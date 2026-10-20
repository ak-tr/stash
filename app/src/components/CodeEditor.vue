<template>
  <div ref="el" class="min-h-0 flex-1 bg-tile font-mono text-[13px]"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers, placeholder } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { languages } from "../helpers/highlighters";

const props = defineProps<{ syntax: string; doc?: string; readonly?: boolean }>();

const token = (name: string) => `rgb(var(--${name}))`;

// Editor chrome follows the Mosaic theme tokens. The active line only shows while focused.
const theme = EditorView.theme({
  "&": { height: "100%", color: token("n-200") },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": { fontFamily: "inherit", padding: "12px 0" },
  ".cm-content": { caretColor: token("white"), padding: "0 12px 0 4px" },
  ".cm-cursor": { borderLeftColor: token("white") },
  ".cm-gutters": { backgroundColor: "transparent", color: token("n-500"), border: "none", paddingLeft: "8px" },
  ".cm-placeholder": { color: token("n-500") },
  ".cm-activeLine, .cm-activeLineGutter": { backgroundColor: "transparent" },
  "&.cm-focused .cm-activeLine, &.cm-focused .cm-activeLineGutter": { backgroundColor: token("tile-2") },
});

// Monochrome syntax: weight and grey do the work, no accent colours
const highlightStyle = HighlightStyle.define([
  { tag: [t.keyword, t.modifier, t.operatorKeyword, t.controlKeyword, t.definitionKeyword], color: token("white"), fontWeight: "700" },
  { tag: [t.definition(t.variableName), t.function(t.variableName), t.typeName, t.className, t.propertyName], color: token("white") },
  { tag: [t.string, t.special(t.string), t.regexp], color: token("n-400") },
  { tag: [t.number, t.bool, t.null, t.atom], color: token("n-300") },
  { tag: t.comment, color: token("n-500"), fontStyle: "italic" },
]);

const el = ref<HTMLElement>();
const language = new Compartment();
let view: EditorView;

onMounted(() => {
  view = new EditorView({
    parent: el.value!,
    state: EditorState.create({
      doc: props.doc ?? "",
      extensions: [
        theme,
        lineNumbers(),
        syntaxHighlighting(highlightStyle),
        language.of(languages[props.syntax] ?? []),
        props.readonly
          ? EditorView.editable.of(false)
          : [
              history(),
              keymap.of([...defaultKeymap, ...historyKeymap]),
              placeholder("Paste your code (or anything) here..."),
              highlightActiveLine(),
              highlightActiveLineGutter(),
            ],
      ],
    }),
  });
});

// Highlight while typing, not just after upload
watch(() => props.syntax, (syntax) => view.dispatch({ effects: language.reconfigure(languages[syntax] ?? []) }));

onBeforeUnmount(() => view.destroy());

defineExpose({
  getText: () => view.state.doc.toString(),
  focus: () => view.focus(),
});
</script>
