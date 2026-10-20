import { AutoRouter, type IRequest, cors, error } from "itty-router";

export interface Env {
  STASH_KV: KVNamespace;
}

// Kept alongside each stash in KV; the value is the text itself
interface Meta {
  syntax: string;
  once: boolean;
  token: string;
  expiresAt: number;
}

// App's ttl option -> seconds. 0 is "one read only", kept 10 days at most
const ttlSeconds: Record<string, number> = { 0: 864000, 1: 7200, 2: 43200, 3: 86400 };
const maxBytes = 512 * 1024;
const notFound = () => error(404, "Stash expired or does not exist");

// 10 random base36 characters (~51 bits), so IDs can't be guessed
const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
const newId = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(10)), (b) => alphabet[b % 36]).join("");

const bearer = (request: IRequest) => request.headers.get("authorization")?.replace(/^Bearer /, "");

// Reads a stash. One-time stashes are deleted on the first read by anyone but their creator.
// ponytail: KV is eventually consistent, so two readers within ~60s can both see a one-time stash; move to a Durable Object if that matters
const read = async (request: IRequest, env: Env) => {
  const { id } = request.params;
  const { value, metadata } = await env.STASH_KV.getWithMetadata<Meta>(id);
  if (value == null) return null;

  const stash = metadata?.token
    ? { id, text: value, syntax: metadata.syntax, once: metadata.once, expiresAt: metadata.expiresAt }
    : legacy(id, value);

  const isCreator = !!metadata?.token && bearer(request) === metadata.token;
  const deleted = stash.once && !isCreator;
  if (deleted) await env.STASH_KV.delete(id);

  return { ...stash, deleted };
};

// ponytail: stashes saved before Oct 2026 hold JSON with an array of lines. Delete this 10 days after deploying, once they've all expired
const legacy = (id: string, value: string) => {
  const { raw, once, syntax } = JSON.parse(value);
  return { id, text: JSON.parse(raw).join("\n") as string, syntax: syntax as string, once: !!once, expiresAt: null };
};

const { preflight, corsify } = cors({ allowMethods: ["GET", "POST", "DELETE"] });

const router = AutoRouter<IRequest, [Env]>({ before: [preflight], finally: [corsify] });

router
  .post("/stash", async (request, env) => {
    const { text, syntax, ttl }: Record<string, any> = (await request.json().catch(() => null)) ?? {};

    if (typeof text !== "string" || !text.trim()) return error(400, "text is required");
    if (new TextEncoder().encode(text).length > maxBytes) return error(413, "text is over 512 KB");
    if (!(String(ttl) in ttlSeconds)) return error(400, "ttl must be 0, 1, 2 or 3");

    const id = newId();
    const token = crypto.randomUUID();
    const expirationTtl = ttlSeconds[ttl];
    const metadata: Meta = {
      syntax: typeof syntax === "string" ? syntax.slice(0, 32) : "",
      once: ttl == 0,
      token,
      expiresAt: Date.now() + expirationTtl * 1000,
    };

    await env.STASH_KV.put(id, text, { expirationTtl, metadata });
    return { id, token, expiresAt: metadata.expiresAt };
  })
  .get("/stash/:id", async (request, env) => (await read(request, env)) ?? notFound())
  .get("/stash/:id/raw", async (request, env) => {
    const stash = await read(request, env);
    if (!stash) return notFound();
    return new Response(stash.text, { headers: { "content-type": "text/plain; charset=utf-8" } });
  })
  .delete("/stash/:id", async (request, env) => {
    const { id } = request.params;
    const { metadata } = await env.STASH_KV.getWithMetadata<Meta>(id);
    if (!metadata) return notFound();
    if (!metadata.token || bearer(request) !== metadata.token) return error(403, "Wrong or missing delete token");

    await env.STASH_KV.delete(id);
    return { id, deleted: true };
  });

export default router;
