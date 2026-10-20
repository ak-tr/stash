<template>
  <div class="flex h-dvh flex-col font-mono text-xs uppercase tracking-wide text-neutral-500">
    <AppHeader :path="path" />
    <main class="flex min-h-0 flex-1 flex-col overflow-y-auto font-sans text-base normal-case tracking-normal text-neutral-200">
      <component :is="page" />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import NewStash from "./pages/NewStash.vue";
import ViewStash from "./pages/ViewStash.vue";
import YourStashes from "./pages/YourStashes.vue";

// Three pages, so no router: / is new, /mine is yours, anything else is a stash ID
const path = location.pathname;
const page = path === "/" ? NewStash : path === "/mine" ? YourStashes : ViewStash;
</script>
