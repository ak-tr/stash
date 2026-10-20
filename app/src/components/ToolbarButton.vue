<template>
  <!-- A cell in a toolbar bar. Primary is the one filled (inverted) action. -->
  <button
    type="button"
    class="shrink-0 whitespace-nowrap px-3 uppercase sm:px-4 tracking-wide transition-colors focus-visible:outline-none"
    :class="primary
      ? 'bg-invert text-black hover:bg-invert/80 focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-4 focus-visible:outline-black'
      : 'text-neutral-200 hover:bg-invert hover:text-black focus-visible:bg-invert focus-visible:text-black'"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{ primary?: boolean }>();
</script>
