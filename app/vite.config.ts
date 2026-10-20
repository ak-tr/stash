import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  // The API runs separately: `pnpm start` in ../worker serves it on :8787
  server: { proxy: { "^/stash(/|$)": "http://localhost:8787" } },
});
