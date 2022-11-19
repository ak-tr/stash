<template>
  <div class="main">
    <CodeEditor />
  </div>
</template>

<script lang="ts">
import CodeEditor from "./CodeEditor.vue";

export default {
  name: "AppContainer",
  components: {
    CodeEditor,
  }
}
</script>

<style>
.main {
  display: flex;
  flex-grow: 1;
  justify-content: center;
}
</style>