<template>
  <div class="main" :class="{ 'fade-out': shouldFadeOut, 'fade-in': !shouldFadeOut }">
    <div
      class="buttons"
      :class="[!isRequestingPaste ? 'space-between' : 'start']"
    >
      <template v-if="!isRequestingPaste">
        <div class="dropdowns">
          <ContainerDropdown
            :options="ttlValues" 
            selected="1"
            ref="time"
          />
          <ContainerDropdown 
            :options="highlighterValues"
            selected="typescript"
            ref="highlighter"
          />
        </div>
        <ContainerButton
          :text="getUploadButtonText()"
          afterText="Uploading..."
          @btn-click="uploadStash()"
        />
      </template>
      <template v-else-if="pasteExists">
        <ContainerButton
          text="Copy Stash"
          afterText="Copied"
          @btn-click="callCopyToClipboard()"
        />
        <ContainerButton
          text="Copy Link"
          afterText="Copied"
          @btn-click="copyLink()"
        />
        <ContainerButton
          text="Delete Stash"
          afterText="Are you sure?"
          doubleText="Deleting..."
          @btn-click="deleteStash()"
        />
        <ContainerButton
          text="Open Raw"
          @btn-click="openStashAsRaw()"
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

import { modes } from "../helpers/highlighters";
const highlighterValues = Object.keys(modes).map((mode) => {
  return {
    value: mode,
    name: mode[0].toUpperCase() + mode.substring(1)
  }
})

export default {
  name: "AppContainer",
  data() {
    return {
      isGettingPaste: true,
      pasteExists: false,
      pasteUploaded: false,
      shouldFadeOut: false,
      ttlValues: [
        {
          value: 0,
          name: "One-time paste"
        },
        {
          value: 1,
          name: "Expire in 2 hours",
        },
        {
          value: 2,
          name: "Expire in 12 hours"
        },
        {
          value: 3,
          name: "Expire in 24 hours"
        },
      ],
      highlighterValues,
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
        this.uploadStash();
      }
    });
  },
  methods: {
    async uploadStash() {
      const editor: any = this.$refs.editor;
      const highlighterDropdown: any = this.$refs.highlighter;
      const ttlDropdown: any = this.$refs.time;

      const raw = JSON.stringify(editor.getRawText());
      const ttl = ttlDropdown.getSelectedValue();
      const syntax = highlighterDropdown.getSelectedValue();

      const payload = {
        ttl: +ttl,
        raw,
        syntax,
      };

      const response = await this.$axios.post(
        "https://stash.akif.kr/stash",
        payload
      );

      const id = response.data.id;

      this.shouldFadeOut = true;
      setTimeout(() => window.location.href = `https://stash.akif.kr/${id}`, 350);
    },
    openStashAsRaw() {
      // Get ID from URL bar
      const id = window.location.pathname.substring(1);
      // Redirect to raw paste
      window.open(`https://stash.akif.kr/stash/${id}/raw`);
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
    copyLink() {
      const link = window.location.href;
      navigator.clipboard.writeText(link);
    },
    async deleteStash() {
      const id = window.location.pathname.substring(1);
      await this.$axios.delete(`https://stash.akif.kr/stash/${id}`);
      
      setTimeout(() => this.shouldFadeOut = true, 500);
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

.dropdowns {
  display: flex;
  gap: 10px;
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

@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes fade-out {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

.fade-out {
  animation: fade-out 0.15s forwards;
}

.fade-in {
  animation: fade-in 0.3s forwards;
}
</style>
