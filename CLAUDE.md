Follow the Mosaic design guide in `app/node_modules/mosaic/DESIGN.md`. Use pnpm, not npm.

- One Worker serves both the API (`worker/src/index.ts`) and the built app (`app/dist`); config in `worker/wrangler.jsonc`. After changing the API, run `pnpm check` in `worker`.
- Deploy with `pnpm run deploy` in `worker` (plain `pnpm deploy` is a built-in pnpm command).
- `app` has no router: `App.vue` picks the page from the path (`/` new, `/mine` your stashes, anything else a stash ID).
