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
      clickCount: 0,
    }
  },
  props: ["text", "afterText", "doubleText"],
  mounted() {
    const button = this.$refs.button as HTMLButtonElement;

    button.addEventListener("click", () => {
      this.clickCount += 1;

      if (this.afterText) {
        this.buttonText = this.afterText;
        if (!this.doubleText) {
          button.disabled = true;
        };
      }

      if (this.doubleText && this.clickCount === 1)
        return;
      else if (this.doubleText && this.clickCount === 2) {
        this.buttonText = this.doubleText;
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
