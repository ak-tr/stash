<template>
  <div class="wrapper">
    <AppHeader />
    <AppContainer :isRequestingPaste="isRequestingPaste" />
  </div>
</template>

<script lang="ts">
import AppHeader from './components/AppHeader.vue';
import AppContainer from './components/AppContainer.vue';

export default {
  name: "App",
  components: {
    AppHeader,
    AppContainer,
  },
  computed: {
    isRequestingPaste() {
      // Check if path has been given ID
      return window.location.pathname.length != 1;
    }
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
