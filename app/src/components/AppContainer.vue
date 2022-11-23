<template>
  <div class="main">
    <div
      class="buttons"
      :class="[!isRequestingPaste ? 'space-between' : 'start']"
    >
      <template v-if="!isRequestingPaste">
        <ContainerDropdown ref="dropdown" />
        <ContainerButton
          :text="getUploadButtonText()"
          afterText="Uploading..."
          @btn-click="uploadPaste()"
        />
      </template>
      <template v-else-if="pasteExists">
        <ContainerButton
          text="Copy Stash"
          afterText="Copied"
          @btn-click="callCopyToClipboard()"
        />
        <ContainerButton
          text="Delete Stash"
          afterText="Are you sure?"
          doubleText="Deleting..."
          @btn-click="deleteStash()"
        />
      </template>
    </div>
    <ContainerMessage
      v-if="isRequestingPaste && !isGettingPaste && !pasteExists"
      header="Stash not found!"
      message="Either the paste has expired or does not exist! Stashes are automatically deleted after their specified expiry date."
    />
    <CodeEditor
      ref="editor"
      :isRequestingPaste="isRequestingPaste"
      @on-paste-result="onPasteResult"
    />
  </div>
</template>

<script lang="ts">
import CodeEditor from "./CodeEditor.vue";
import ContainerButton from "./ContainerButton.vue";
import ContainerDropdown from "./ContainerDropdown.vue";
import ContainerMessage from "./ContainerMessage.vue";

export default {
  name: "AppContainer",
  data() {
    return {
      isGettingPaste: true,
      pasteExists: false,
      pasteUploaded: false,
    };
  },
  props: ["isRequestingPaste"],
  components: {
    CodeEditor,
    ContainerButton,
    ContainerDropdown,
    ContainerMessage,
  },
  mounted() {
    if (this.isRequestingPaste) return;

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.metaKey && e.key == "Enter") {
        this.uploadPaste();
      }
    });
  },
  methods: {
    async uploadPaste() {
      const editor: any = this.$refs.editor;
      const dropdown: any = this.$refs.dropdown;

      const raw = JSON.stringify(editor.getRawText());
      const ttl = dropdown.getSelectedTTL();

      const payload = {
        ttl: +ttl,
        raw: raw,
        once: +ttl === 0 ? true : false,
      };

      const response = await this.$axios.post(
        "https://stash.akif.kr/paste",
        payload
      );

      const id = response.data.id;

      window.location.href = `https://stash.akif.kr/${id}`;
    },
    onPasteResult(status: boolean) {
      this.isGettingPaste = false;
      this.pasteExists = status;
    },
    getOS() {
      if (navigator.userAgent.includes("Win")) return "Win";
      if (navigator.userAgent.includes("Mac")) return "Mac";
      if (navigator.userAgent.includes("Linux")) return "Linux";
      if (
        navigator.userAgent.includes("Android") ||
        navigator.userAgent.includes("like Mac")
      )
        return "Mobile";
    },
    getKeyMap() {
      switch (this.getOS()) {
        case "Win":
          return "Ctrl + ⏎";
        case "Mac":
          return "⌘ + ⏎";
        case "Linux":
          return "❖ + ⏎";
        default:
          return "";
      }
    },
    getUploadButtonText() {
      return `Upload / ${this.getKeyMap()}`;
    },
    callCopyToClipboard() {
      (this.$refs.editor as any).copyToClipboard();
    },
    async deleteStash() {
      const id = window.location.pathname.substring(1);
      await this.$axios.delete(`https://stash.akif.kr/paste/${id}`);
      setTimeout(() => window.location.href = "https://stash.akif.kr", 1000);
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap");

.main {
  display: flex;
  flex-direction: column;
  padding: 0 15%;
  height: 85vh;
  align-items: center;
  margin: 10px 20px 20px 20px;
  box-sizing: border-box;
}

@media only screen and (max-width: 600px) {
  .main {
    padding: 0;
  }
}

.buttons {
  display: flex;
  width: 100%;
  padding: 10px 0 10px 0;
  gap: 10px;
}

.buttons * {
  font-family: "Montserrat", sans-serif !important;
}

.space-between {
  justify-content: space-between;
}

.start {
  justify-content: flex-start;
}
</style>
