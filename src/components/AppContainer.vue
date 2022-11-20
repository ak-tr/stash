<template>
  <div class="main">
    <div class="main-header">
      <ContainerDropdown />
      <ContainerButton text="Upload"/>
    </div>
    <CodeEditor />
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
  }
}
</script>

<style>
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
  padding: 10px 0;
  gap: 10px;
}
</style>