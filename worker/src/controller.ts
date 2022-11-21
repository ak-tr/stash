import { Env } from ".";
import { PasteBody } from "./types";

const headers = {
  "Content-Type": "application/json;charset=UTF-8",
} as const;

const ttlEpoch = {
  1: 864000,
  2: 7200,
  3: 43200,
  4: 86400,
};

export const createNewPaste = async ({ content }: PasteBody, env: Env) => {
  // Get body
  const { ttl, raw, once } = content;

  // If missing keys, return bad request
  if (!(ttl || raw || once)) {
    return new Response(
      JSON.stringify({
        message: "Bad request",
      }),
      {
        headers,
        status: 400,
      }
    );
  }

  // Generate new ID
  const uid = Date.now().toString(36);
  // Calculate expiration
  const expiration = Date.now() + ttlEpoch[ttl as keyof typeof ttlEpoch];

  // Add to KV
  await env.STASH_KV.put(uid, JSON.stringify({ raw, once }), { expiration });


  return new Response(JSON.stringify({ id: uid }, null, 4), { headers });
};

export const errorHandler = (error: any) => {
  return new Response(error.message || "Server Error", {
    status: error.status || 500,
  });
};

export const missingHandler = () =>
  new Response(JSON.stringify({ message: "Unknown route" }, null, 4), {
    status: 404,
    headers,
  });
