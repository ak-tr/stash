<template>
  <div class="editor" ref="editor">
  </div>
</template>

<script lang="ts">
import {EditorState} from "@codemirror/state"
import {EditorView, keymap} from "@codemirror/view"
import {defaultKeymap} from "@codemirror/commands"

export default {
  name: "CodeEditor",
  mounted() {
    // Get reference to editor and its height
    const editor = this.$refs.editor as HTMLElement;
    const editorHeight = editor.clientHeight;
    // Specify placeholder text
    const defualtText = "Paste your code (or anything) here..."

    // Make theme changes to editor
    const theme = EditorView.theme({
      "&": {
        height: `${editorHeight-15}px`,
      },
      "&.cm-focused": {
        outline: "none !important",
      },
      ".cm-scroller": {
        overflow: "auto",
      },
      ".cm-content": {
        caretColor: "white",
      },
    }, { dark: true })

    // Set start state
    const startState = EditorState.create({
      doc: defualtText,
      extensions: [theme, keymap.of(defaultKeymap)]
    });

    // Create view and pass parent
    const view = new EditorView({
      state: startState,
      parent: editor,
    });

    // Focus view
    view.focus();

    // Set cursor to position of end of placeholder text
    view.dispatch({
      selection: { anchor: defualtText.length }
    })
  }
}
</script>

<style>
.editor {
  width: 100%;
  flex-grow: 1;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  outline: 0 !important;
  font-size: 12px;
  box-sizing: border-box;
}
</style>