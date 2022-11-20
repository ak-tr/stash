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
        color: "rgba(255, 255, 255, 0.5)"
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

    // Set cursor to position of end of placeholder text
    view.dispatch({
      selection: { anchor: defualtText.length }
    })

    const options = {
      attributes: true
    }

    // Listen for changes to cm-editor
    const callback = (mutations: MutationRecord[]) => {
      mutations.forEach((mutation) => {
        const target = mutation.target as HTMLElement;

        if (target.classList.contains("cm-focused")) {
          return editor.style.outline = "1px solid white";
        }
        editor.style.outline = "1px solid rgba(255, 255, 255, 0.1)";
      })
    }

    const observer = new MutationObserver(callback);
    observer.observe(view.dom, options);
  }
}
</script>

<style>
@import url("https://fonts.cdnfonts.com/css/sf-mono");

.editor {
  font-family: "SF Mono", sans-serif;
  width: 100%;
  flex-grow: 1;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 13px;
  outline: 1px solid rgba(255, 255, 255, 0.1);
  transition: outline 0.15s;
}

.editor * {
  font-family: inherit !important;
}
</style>