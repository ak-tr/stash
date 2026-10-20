<template>
  <div class="flex h-10 shrink-0 divide-x divide-neutral-800 border-b border-neutral-800 font-mono text-xs uppercase tracking-wide">
    <MenuSelect v-model="ttl" label="Expiry" :options="ttlOptions" :class="cell" v-slot="{ selected }">
      <span class="truncate">{{ selected }}</span><span class="hidden sm:inline" aria-hidden="true">↓</span>
    </MenuSelect>
    <MenuSelect v-model="syntax" label="Syntax" :options="syntaxOptions" :class="cell" v-slot="{ selected }">
      <span class="truncate">{{ selected }}</span><span class="hidden sm:inline" aria-hidden="true">↓</span>
    </MenuSelect>
    <ToolbarButton title="Detect the syntax from your code" @click="detectSyntax">{{ detectLabel }}</ToolbarButton>
    <p class="hidden min-w-0 flex-1 items-center truncate px-4 text-neutral-500 sm:flex" role="status">{{ error }}</p>
    <ToolbarButton primary @click="upload">{{ uploadLabel }}</ToolbarButton>
  </div>
  <CodeEditor ref="editor" :syntax="syntax" />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import CodeEditor from "../components/CodeEditor.vue";
import ToolbarButton from "../components/ToolbarButton.vue";
import MenuSelect from "../components/MenuSelect.vue";
import { languages, syntaxName } from "../helpers/highlighters";
import { createStash } from "../services/stash";

// Toolbar cell that opens a menu; inverts on hover and focus like the buttons
const cell = "flex min-w-0 flex-1 items-center justify-between gap-3 px-3 uppercase sm:px-4 tracking-wide text-neutral-200 transition-colors hover:bg-invert hover:text-black focus-visible:bg-invert focus-visible:text-black focus-visible:outline-none sm:w-44 sm:flex-none";

const ttlOptions = [
  { value: 0, name: "One read only" },
  { value: 1, name: "Expire in 2h" },
  { value: 2, name: "Expire in 12h" },
  { value: 3, name: "Expire in 24h" },
];
const syntaxOptions = ["", ...Object.keys(languages)].map((value) => ({ value, name: syntaxName(value) }));

const ttl = ref(1);
const syntax = ref("");
const editor = ref<InstanceType<typeof CodeEditor>>();
const uploading = ref(false);
const error = ref("");
const detectLabel = ref("Detect");

// No hint on touch screens; ⌘ on Mac, Ctrl everywhere else
const hint = matchMedia("(pointer: coarse)").matches ? "" : navigator.userAgent.includes("Mac") ? " / ⌘ + ⏎" : " / Ctrl + ⏎";
const uploadLabel = computed(() => (uploading.value ? "Uploading..." : error.value ? "Retry" : "Upload") + hint);

const upload = async () => {
  if (uploading.value) return;
  const text = editor.value!.getText();
  if (!text.trim()) return editor.value!.focus();

  uploading.value = true;
  try {
    location.href = `/${await createStash(text, syntax.value, ttl.value)}`;
  } catch (e) {
    error.value = (e as Error).message;
    uploading.value = false;
  }
};

// highlight.js is only downloaded the first time this runs
const detectSyntax = async () => {
  const text = editor.value!.getText();
  if (!text.trim()) return editor.value!.focus();

  const { detect } = await import("../helpers/detect");
  const found = detect(text);
  if (found) syntax.value = found;
  else {
    detectLabel.value = "No match";
    setTimeout(() => (detectLabel.value = "Detect"), 2000);
  }
};

const onKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") upload();
};
onMounted(() => addEventListener("keydown", onKeydown));
onUnmounted(() => removeEventListener("keydown", onKeydown));
</script>
