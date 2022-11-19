<template>
  <div class="main">
    <div class="main-header">
      <ContainerButton text="Upload / ⌘ + ⏎"/>
    </div>
    <CodeEditor />
  </div>
</template>

<script lang="ts">
import CodeEditor from "./CodeEditor.vue";
import ContainerButton from "./ContainerButton.vue";

export default {
  name: "AppContainer",
  components: {
    CodeEditor,
    ContainerButton
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
  margin: 20px;
  box-sizing: border-box;
}

@media only screen and (max-width: 600px) {
  .main {
    padding: 0;
  }
}

.main-header {
  padding: 10px;
  align-self: flex-end;
}
</style>