<template>
  <!-- Trigger takes the classes passed in; the default slot is its content -->
  <button
    v-bind="$attrs"
    ref="button"
    type="button"
    :popovertarget="id"
    :title="label"
    :aria-label="`${label}: ${selected}`"
  >
    <slot :selected="selected">{{ selected }}</slot>
  </button>
  <!-- Popover gives Esc and outside-click closing for free. Teleported so parent styles
       (e.g. a toolbar's divide-x, which zeroes child borders) can't reach it. -->
  <Teleport to="body">
    <div
      :id="id"
      ref="menu"
      popover
      :aria-label="label"
      class="fixed inset-auto m-0 border border-neutral-800 bg-tile p-0 font-mono text-xs uppercase tracking-wide text-neutral-400"
      @beforetoggle="position"
      @toggle="focusSelected"
    >
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        :aria-pressed="option.value === model"
        class="flex w-full items-center justify-between gap-6 px-3 py-2.5 text-left uppercase tracking-wide transition-colors hover:bg-invert hover:text-black focus-visible:bg-invert focus-visible:text-black focus-visible:outline-none"
        @click="choose(option.value)"
      >
        {{ option.name }}
        <span class="size-1.5 shrink-0 bg-current" :class="{ 'opacity-0': option.value !== model }" aria-hidden="true"></span>
      </button>
    </div>
  </Teleport>
</template>

<script setup lang="ts" generic="T extends string | number">
import { computed, ref, useId } from "vue";

defineOptions({ inheritAttrs: false });
const props = defineProps<{ label: string; options: { value: T; name: string }[] }>();
const model = defineModel<T>({ required: true });

const id = useId();
const button = ref<HTMLElement>();
const menu = ref<HTMLElement>();
const selected = computed(() => props.options.find((o) => o.value === model.value)?.name ?? "");

// Opens below the trigger in the top half of the screen and above it in the bottom half,
// aligned to whichever side the trigger is on, at least as wide as it, and scrolling if it won't fit
const position = (e: Event) => {
  if ((e as ToggleEvent).newState !== "open") return;
  const r = button.value!.getBoundingClientRect();
  const below = r.bottom < innerHeight / 2;
  const right = r.left > innerWidth / 2;
  Object.assign(menu.value!.style, {
    top: below ? `${r.bottom + 8}px` : "auto",
    bottom: below ? "auto" : `${innerHeight - r.top + 8}px`,
    left: right ? "auto" : `${r.left}px`,
    right: right ? `${innerWidth - r.right}px` : "auto",
    minWidth: `${Math.max(r.width, 176)}px`,
    maxHeight: `${(below ? innerHeight - r.bottom : r.top) - 24}px`,
  });
};

const focusSelected = (e: Event) => {
  if ((e as ToggleEvent).newState === "open") menu.value!.querySelector<HTMLElement>("[aria-pressed=true]")?.focus();
};

const choose = (value: T) => {
  model.value = value;
  menu.value!.hidePopover();
  button.value!.focus();
};
</script>
