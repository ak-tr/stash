<template>
  <div class="message">
    <h1>{{header}}</h1>
    <p>{{message}}</p>
  </div>
</template>

<script lang="ts">
export default {
  name: "ContainerMessage",
  props: [
    "header",
    "message"
  ]
}
</script>

<style scoped>
.message {
  max-width: 550px;
  padding-top: 20px;
}

h1 {
  font-size: 300%;
  margin: 0;
  line-height: 50px;
}
</style>