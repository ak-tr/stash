<template>
  <div class="main">
    <div class="main-header">
      <ContainerDropdown />
      <ContainerButton text="Upload" @upload-click="upload()" />
    </div>
    <CodeEditor ref="editor"/>
  </div>
</template>

<script lang="ts">
import CodeEditor from "./CodeEditor.vue";
import ContainerButton from "./ContainerButton.vue";
import ContainerDropdown from "./ContainerDropdown.vue";

export default {
  name: "AppContainer",
  components: {
    CodeEditor,
    ContainerButton,
    ContainerDropdown,
  },
  mounted() {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.metaKey && e.key == "Enter") {
        this.upload();
      }
    });
  },
  methods: {
    upload() {
      const editor: any = this.$refs.editor;
      const raw = JSON.stringify(editor.getRawText());
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');

.main {
  display: flex;
  flex-direction: column;
  padding: 0 15%;
  height: 85vh;
  align-items: center;
  margin: 10px 20px;
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
  padding: 10px 0 20px 0;
  gap: 10px;
}

.main-header * {
  font-family: "Montserrat", sans-serif !important;
}
</style>