import { Env } from ".";
import { KVParsedValue, KVWithMetadata, PasteBody, PasteParams } from "./types";

const headers = {
  "Content-Type": "application/json;charset=UTF-8",
} as const;

const ttlEpoch = {
  0: 864000,
  1: 7200,
  2: 43200,
  3: 86400,
} as const;

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
  const expirationTtl = ttlEpoch[ttl as keyof typeof ttlEpoch]; // laq42aco

  // Add to KV
  await env.STASH_KV.put(uid, JSON.stringify({ raw, once }), {
    expirationTtl,
    // Add grace period metadata for one time stashes
    metadata: { 
      gracePeriod: Date.now() + 60000
    },
  });

  return new Response(JSON.stringify({ id: uid }, null, 4), { headers });
};

export const getPaste = async ({ id }: PasteParams, env: Env) => {
  const { value, metadata }: KVWithMetadata = await env.STASH_KV.getWithMetadata(id);

  if (!value) {
    return new Response(
      JSON.stringify({
        message: "Key expired/does not exist",
      }),
      {
        headers,
      }
    );
  }

  const object: KVParsedValue = JSON.parse(value);
  const isWithinGracePeriod = metadata ? Date.now() < metadata?.gracePeriod : false;

  console.log(isWithinGracePeriod);

  // If it is a one-time stash and it is not within grace period
  // delete the key from the key-value store
  if (object.once && !isWithinGracePeriod) {
    await env.STASH_KV.delete(id);
  }

  return new Response(JSON.stringify({ raw: object.raw }, null, 4), {
    headers,
  });
};

export const deletePaste = async ({ id }: PasteParams, env: Env) => {
  let status: boolean;

  try {
    await env.STASH_KV.delete(id);
    status = true;
  } catch (e) {
    status = false;
  }

  return new Response(JSON.stringify({ id, status }, null, 4), { headers });
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
