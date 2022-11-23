<template>
  <button class="button" type="button" ref="button">
    {{ buttonText }}
  </button>
</template>

<script lang="ts">
export default {
  name: "ContactButton",
  data() {
    return {
      buttonText: this.text,
    }
  },
  props: ["text", "afterText"],
  mounted() {
    const button = this.$refs.button as HTMLButtonElement;

    button.addEventListener("click", () => {
      if (this.afterText) {
        this.buttonText = this.afterText;
        button.disabled = true;
      }

      this.$emit("btnClick");
    })


  },
};
</script>

<style scoped>
.button {
  min-width: 120px;
  padding: 0 15px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  background-color: #171717;
  color: white;
  transition: border 0.15s, color 0.35s, border 0.35s;
}

.button:hover:enabled {
  border: 1px solid white;
  cursor: pointer;
}

.button:disabled {
  color:  rgba(255, 255, 255, 0.2);
}
</style>
