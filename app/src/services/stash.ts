export interface Stash {
  id: string;
  text: string;
  syntax: string;
  once: boolean;
  expiresAt: number | null;
  // True when this read used up a one-time stash
  deleted: boolean;
}

// A stash made in this browser, with the token that deletes it
export interface Saved {
  id: string;
  token: string;
  syntax: string;
  title: string;
  lines: number;
  once: boolean;
  createdAt: number;
  expiresAt: number;
}

const api = "/stash";

export const getStash = async (id: string): Promise<Stash | null> => {
  const res = await fetch(`${api}/${id}`, { headers: auth(id) });
  if (res.status === 404) {
    forget(id);
    return null;
  }
  if (!res.ok) throw new Error(`Couldn't load stash (${res.status})`);
  return res.json();
};

export const createStash = async (text: string, syntax: string, ttl: number) => {
  const res = await fetch(api, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text, syntax, ttl }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? `Upload failed (${res.status})`);

  const { id, token, expiresAt } = await res.json();
  remember({
    id,
    token,
    syntax,
    title: text.trim().split("\n")[0].slice(0, 200),
    lines: text.split("\n").length,
    once: ttl === 0,
    createdAt: Date.now(),
    expiresAt,
  });
  return id as string;
};

export const deleteStash = async (id: string) => {
  const res = await fetch(`${api}/${id}`, { method: "DELETE", headers: auth(id) });
  if (!res.ok && res.status !== 404) throw new Error(`Delete failed (${res.status})`);
  forget(id);
};

const auth = (id: string): HeadersInit => {
  const token = saved().find((s) => s.id === id)?.token;
  return token ? { authorization: `Bearer ${token}` } : {};
};

// Newest first, expired ones dropped. localStorage can be unavailable, so reads and writes are guarded.
export const saved = (): Saved[] => {
  try {
    const list: Saved[] = JSON.parse(localStorage.getItem("stashes") ?? "[]");
    return list.filter((s) => s.expiresAt > Date.now());
  } catch {
    return [];
  }
};

const store = (list: Saved[]) => {
  try { localStorage.setItem("stashes", JSON.stringify(list)); } catch {}
};
const remember = (stash: Saved) => store([stash, ...saved()]);
const forget = (id: string) => store(saved().filter((s) => s.id !== id));
