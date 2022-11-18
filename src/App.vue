<template>
  <div class="wrapper">
    <AppHeader />
  </div>
</template>

<script lang="ts">
import AppHeader from './components/AppHeader.vue';

export default {
  name: "App",
  components: {
    AppHeader,
  }
}
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap");

* {
  font-family: "Space Mono", monospace;
}

.wrapper {
  display: flex;
  flex-direction: column;
  margin: 0;
  height: 100vh;
}

</style>
