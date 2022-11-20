<template>
  <button class="button" type="button">
    {{ text }} / {{getKeyMap()}}
  </button>
</template>

<script lang="ts">
export default {
  name: "ContactButton",
  props: ["text"],
  methods: {
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
    }
  },
};
</script>

<style scoped>
.button {
  /* width: 120px; */
  padding: 0 15px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  background-color: #171717;
  color: white;
  transition: border 0.15s;
}

.button:hover {
  border: 1px solid white;
  cursor: pointer;
}
</style>
