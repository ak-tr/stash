<template>
  <button
    class="button"
    type="button"
  >
    {{ text }}
  </button>
</template>

<script lang="ts">
export default {
  name: "ContactButton",
  props: ["text"],
};
</script>

<style scoped>
.button {
  /* width: 120px; */
  padding: 0 15px;
  height: 50px;
  border: 1px solid white;
  border-radius: 5px;
  background-color: #171717;
  color: white;
  transition: background-color 0.25s;
}

.button:hover {
  background-color: white;
  color: #171717;
  cursor: pointer;
}
</style>