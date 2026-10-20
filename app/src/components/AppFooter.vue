<template>
  <footer class="flex shrink-0 items-center justify-between gap-4 border-t border-neutral-800 px-4 py-3 sm:px-6">
    <span class="flex items-center gap-2">
      <img src="/favicon.svg" alt="" class="size-4" />
      Made by <a class="link" href="https://git.akif.kr">Akif</a>
    </span>
    <span>
      Theme /
      <MenuSelect
        v-model="theme"
        label="Theme"
        :options="themes"
        class="uppercase tracking-wide transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
      />
    </span>
  </footer>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import MenuSelect from "./MenuSelect.vue";

// Mosaic themes, after NCS-Workbench. Colours come from mosaic/tokens.css.
const themes = [
  { value: "dakota-black", name: "Dakota Black" },
  { value: "anthracite", name: "Anthracite" },
  { value: "mocha", name: "Mocha" },
  { value: "canberra-beige", name: "Canberra Beige" },
  { value: "silverstone", name: "Silverstone" },
];

const theme = ref(document.documentElement.dataset.theme ?? "dakota-black");

watch(theme, (id) => {
  if (id === "dakota-black") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = id;
  // A cookie on akif.kr so every *.akif.kr site can share the choice (index.html reads it before paint)
  const domain = location.hostname.endsWith("akif.kr") ? "; domain=akif.kr" : "";
  document.cookie = `theme=${id}; path=/; max-age=31536000; samesite=lax${domain}`;
});
</script>
