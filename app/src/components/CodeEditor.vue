<template>
  <div class="editor" ref="editor">
  </div>
</template>

<script lang="ts">
import { EditorState } from "@codemirror/state"
import { EditorView, keymap, lineNumbers, placeholder } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"

export default {
  name: "CodeEditor",
  props: [
    "isRequestingPaste",
  ],
  data() {
    return {
      view: new EditorView(),
      raw: "",
    }
  },
  async mounted() {
    // Get reference to editor and its height
    const editor = this.$refs.editor as HTMLElement;
    const editorHeight = editor.clientHeight;

    editor.style.opacity = "0";

    if (this.isRequestingPaste) {
      this.raw = await this.getPaste();

      if (!this.raw) {
        this.$emit("onPasteResult", false)
        return;
      } 

      this.$emit("onPasteResult", true);
    }

    editor.style.opacity = "1";

    // Specify placeholder text
    const defaultText = "Paste your code (or anything) here..."

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
      ".cm-gutters": {
        backgroundColor: "inherit !important",
      }
    }, { dark: true })

    const extensions = [theme, keymap.of(defaultKeymap), placeholder(defaultText)];

    if (this.isRequestingPaste) {
      extensions.push(lineNumbers());
      extensions.push(EditorView.editable.of(false));
    }

    // Set start state
    const startState = EditorState.create({
      doc: this.isRequestingPaste ? this.raw : "",
      extensions,
    });


    // Create view and pass parent
    this.view = new EditorView({
      state: startState,
      parent: editor,
    });

    // Exit here if requesting paste
    if (this.isRequestingPaste) return;

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
    observer.observe(this.view.dom, { attributes: true });
  },
  methods: {
    getRawText() {
      return this.view.state.doc.toJSON();
    },
    async getPaste() {
      const stashId = window.location.pathname.substring(1);
      const response = await this.$axios.get(`https://stash.akif.kr/stash/${stashId}`);

      return response.data.text ?? null;
    },
    copyToClipboard() {
      const content = this.view.state.doc.toJSON().join("\n");
      navigator.clipboard.writeText(content);
    }
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
  margin-top: 10px;
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