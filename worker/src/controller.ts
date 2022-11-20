import { PasteBody } from "./types";

const headers = {
  "Content-Type": "application/json;charset=UTF-8",
} as const;

export const createNewPaste = async ({ content }: PasteBody) => {
  // Get body
  const { ttl, raw } = content;

  return new Response(JSON.stringify(content, null, 4), { headers });
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
