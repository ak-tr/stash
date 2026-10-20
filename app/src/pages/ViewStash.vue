<template>
  <NotFound v-if="state === 'missing'" />
  <p v-else-if="state === 'error'" class="m-4 border border-dashed border-neutral-700 p-4 font-mono text-xs uppercase tracking-wide text-neutral-400 sm:m-6">
    Couldn't load this stash. Try again in a moment.
  </p>
  <template v-else-if="stash">
    <p class="border-b border-neutral-800 px-4 py-3 font-mono text-xs uppercase tracking-wide text-neutral-500 sm:hidden">{{ meta }}</p>
    <div class="flex h-10 shrink-0 divide-x divide-neutral-800 border-b border-neutral-800 font-mono text-xs uppercase tracking-wide">
      <ToolbarButton class="flex-1 sm:flex-none" @click="copy">{{ labels.copy ?? "Copy" }}</ToolbarButton>
      <ToolbarButton class="flex-1 sm:flex-none" @click="copyLink">{{ labels.link ?? "Copy link" }}</ToolbarButton>
      <ToolbarButton class="flex-1 sm:flex-none" @click="openRaw">Raw</ToolbarButton>
      <p class="hidden min-w-0 flex-1 items-center truncate px-4 text-neutral-500 sm:flex">{{ meta }}</p>
      <ToolbarButton v-if="mine" class="flex-1 sm:flex-none" @click="remove">{{ labels.delete ?? "Delete" }}</ToolbarButton>
    </div>
    <CodeEditor :doc="stash.text" :syntax="stash.syntax" readonly />
  </template>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import CodeEditor from "../components/CodeEditor.vue";
import NotFound from "../components/NotFound.vue";
import ToolbarButton from "../components/ToolbarButton.vue";
import { syntaxName } from "../helpers/highlighters";
import { deleteStash, getStash, saved, type Stash } from "../services/stash";
import { timeLeft } from "../helpers/format";

const id = location.pathname.slice(1);
const mine = saved().some((s) => s.id === id);
const stash = ref<Stash>();
const state = ref<"loading" | "found" | "missing" | "error">("loading");

getStash(id).then(
  (found) => {
    stash.value = found ?? undefined;
    state.value = found ? "found" : "missing";
  },
  () => (state.value = "error"),
);

const meta = computed(() => {
  const { text, syntax, once, deleted, expiresAt } = stash.value!;
  const lines = text.split("\n").length;
  const bytes = new Blob([text]).size;
  return [
    syntaxName(syntax),
    `${lines} ${lines === 1 ? "line" : "lines"}`,
    bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`,
    deleted ? "Deleted after this view" : once ? "One read only" : expiresAt && `Expires in ${timeLeft(expiresAt)}`,
  ].filter(Boolean).join(" / ");
});

// Button labels that change for a moment after a click
const labels = reactive<Record<string, string>>({});
const timers: Record<string, number> = {};
const flash = (key: string, label: string, ms = 2000) => {
  clearTimeout(timers[key]);
  labels[key] = label;
  timers[key] = setTimeout(() => delete labels[key], ms);
};

const copy = async () => {
  await navigator.clipboard.writeText(stash.value!.text);
  flash("copy", "Copied");
};

const copyLink = async () => {
  await navigator.clipboard.writeText(location.href);
  flash("link", "Copied");
};

// A one-time stash is gone from the server once read, so open the copy already here
const openRaw = () => {
  const { text, once } = stash.value!;
  open(once ? URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" })) : `/stash/${id}/raw`);
};

const remove = async () => {
  if (labels.delete !== "Sure?") return flash("delete", "Sure?", 3000);
  labels.delete = "Deleting...";
  try {
    await deleteStash(id);
    location.href = "/";
  } catch {
    flash("delete", "Failed");
  }
};
</script>
