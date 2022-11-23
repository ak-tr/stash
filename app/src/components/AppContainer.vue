<template>
  <div class="main">
    <div class="main-header" v-if="!isRequestingPaste">
      <ContainerDropdown ref="dropdown" />
      <ContainerButton text="Upload" @upload-click="uploadPaste()" />
    </div>
    <ContainerMessage
      v-if="!pasteExists"
      header="Stash not found!"
      message="Either the paste has expired or does not exist! Stashes are automatically deleted after their specified expiry date."
    />
    <CodeEditor
      v-if="pasteExists"
      ref="editor"
      :isRequestingPaste="isRequestingPaste"
      @not-found="onNotFound"
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
      pasteExists: true,
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

      const response = await this.$axios
        .post("https://stash.akif.kr/paste", payload)

      const id = response.data.id;

      window.location.href = `https://stash.akif.kr/${id}`
    },
    onNotFound() {
      this.pasteExists = false;
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
  height: 100vh;
  align-items: center;
  margin: 10px 20px 20px 20px;
  box-sizing: border-box;
}

@media only screen and (max-width: 600px) {
  .main {
    padding: 0;
  }
}

.main-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px 0 10px 0;
  gap: 10px;
}

.main-header * {
  font-family: "Montserrat", sans-serif !important;
}
</style>
