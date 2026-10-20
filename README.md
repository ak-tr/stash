# Stash

A pastebin for sharing code snippets. Vue + TypeScript for the frontend, a Cloudflare Worker + KV for the backend. It uses the [Mosaic](https://github.com/ak-tr/mosaic) design system.

Go to [stash.akif.kr](https://stash.akif.kr), paste your code, pick an expiry and a syntax, and press Upload (or ⌘ + ⏎ / Ctrl + ⏎). Copy the link to share it. Stashes you make are listed under **Your stashes** in that browser, which also keeps the token that lets you delete them.

## Running and deploying

One Cloudflare Worker serves everything on `stash.akif.kr`: the API on `/stash`, and the built app from `app/dist` for every other path. Its config is `worker/wrangler.jsonc`.

- `pnpm start` in `worker`: builds the app and serves the whole site on `localhost:8787`, with a local KV.
- `pnpm dev` in `app`: the app with hot reload on `localhost:5173`. It proxies `/stash` to the worker above, so run that too.
- `pnpm check` in `worker`: type-checks and runs the API checks against an in-memory KV. `pnpm check` in `app` checks language detection.
- `pnpm run deploy` in `worker`: builds the app and deploys the app and API together. (`pnpm deploy` without `run` is a different, built-in pnpm command.)

## API

The API lives on the same host as the app: [stash.akif.kr](https://stash.akif.kr).

`POST /stash` creates a stash. JSON body:

- `text`: the content (required, up to 512 KB)
- `ttl`: `0` one read only, `1` 2 hours, `2` 12 hours, `3` 24 hours
- `syntax`: optional, e.g. `typescript`

Returns `{ id, token, expiresAt }`. Keep `token`: it's the only way to delete the stash.

`GET /stash/:id` returns `{ id, text, syntax, once, expiresAt, deleted }` as JSON, or 404. A one-time stash is deleted by the first read from anyone but its creator (send `Authorization: Bearer <token>` to read your own without using it up); `deleted` is `true` on that read.

`GET /stash/:id/raw` returns the text as `text/plain; charset=utf-8`, with the same one-time rule.

`DELETE /stash/:id` with `Authorization: Bearer <token>` deletes it. Returns 403 for a missing or wrong token.

The [Postman collection](stash.postman_collection.json) has all four requests. Creating a stash saves its `id` and `token` for the others.
