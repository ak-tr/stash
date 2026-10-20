// Runs the router against an in-memory KV: node src/index.check.mjs
import assert from "node:assert/strict";
import router from "./index.ts";

const store = new Map();
const env = {
  STASH_KV: {
    put: async (key, value, { metadata }) => void store.set(key, { value, metadata }),
    getWithMetadata: async (key) => store.get(key) ?? { value: null, metadata: null },
    delete: async (key) => void store.delete(key),
  },
};
const call = (method, path, { body, token } = {}) =>
  router.fetch(
    new Request(`http://stash${path}`, {
      method,
      body: body && JSON.stringify(body),
      headers: token ? { authorization: `Bearer ${token}` } : {},
    }),
    env,
  );
const create = async (body) => (await call("POST", "/stash", { body })).json();

// Validation
assert.equal((await call("POST", "/stash", { body: { text: "hi", ttl: 99 } })).status, 400);
assert.equal((await call("POST", "/stash", { body: { text: "  ", ttl: 1 } })).status, 400);
assert.equal((await call("POST", "/stash", { body: { text: "x".repeat(513 * 1024), ttl: 1 } })).status, 413);

// Create, read, raw
const { id, token } = await create({ text: "a\nb ü", syntax: "go", ttl: 1 });
assert.match(id, /^[a-z0-9]{10}$/);
const stash = await (await call("GET", `/stash/${id}`)).json();
assert.deepEqual([stash.text, stash.syntax, stash.once, stash.deleted], ["a\nb ü", "go", false, false]);
const raw = await call("GET", `/stash/${id}/raw`);
assert.equal(raw.headers.get("content-type"), "text/plain; charset=utf-8");
assert.equal(await raw.text(), "a\nb ü");

// Delete needs the token
assert.equal((await call("DELETE", `/stash/${id}`)).status, 403);
assert.equal((await call("DELETE", `/stash/${id}`, { token: "nope" })).status, 403);
assert.equal((await call("DELETE", `/stash/${id}`, { token })).status, 200);
assert.equal((await call("GET", `/stash/${id}`)).status, 404);

// One-time: the creator can reread it, the first other read (raw included) deletes it
const once = await create({ text: "secret", ttl: 0 });
assert.equal((await (await call("GET", `/stash/${once.id}`, { token: once.token })).json()).deleted, false);
assert.equal(await (await call("GET", `/stash/${once.id}/raw`)).text(), "secret");
assert.equal((await call("GET", `/stash/${once.id}`)).status, 404);

// Stashes saved in the old format still read, but can't be deleted
store.set("old", { value: JSON.stringify({ raw: JSON.stringify(["a", "b"]), once: false, syntax: "go" }), metadata: { gracePeriod: 0 } });
assert.equal((await (await call("GET", "/stash/old")).json()).text, "a\nb");
assert.equal((await call("DELETE", "/stash/old")).status, 403);

// CORS and unknown routes
assert.equal((await call("GET", "/stash/old")).headers.get("access-control-allow-origin"), "*");
assert.equal((await call("GET", "/nope")).status, 404);

console.log("worker ok");
