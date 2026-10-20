<template>
  <header class="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-neutral-800 px-4 sm:px-6">
    <h1><a href="/" class="text-white">Stash</a></h1>
    <nav class="flex gap-4">
      <a
        v-for="link in links"
        :key="link.href"
        :href="link.href"
        :aria-current="link.href === path ? 'page' : undefined"
        class="transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none aria-[current=page]:text-white"
      >{{ link.name }}</a>
    </nav>
  </header>
</template>

<script setup lang="ts">
defineProps<{ path: string }>();

const links = [
  { href: "/", name: "New" },
  { href: "/mine", name: "Your stashes" },
];
</script>
