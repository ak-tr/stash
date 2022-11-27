<template>
  <select title="dropdown" name="dropdown" class="dropdown" ref="dropdown" v-model="localSelected">
    <option :selected="option.selected" v-for="option in options" :key="option.value" :value="option.value">{{option.name}}</option>
  </select>
</template>

<script lang="ts">
export default {
  name: "ContainerDropdown",
  data() {
    return {
      localSelected: this.selected,
    }
  },
  props: ["options", "selected"],
  methods: {
    getSelectedTTL() {
      return (this.$refs.dropdown as HTMLSelectElement).value;
    },
  },
};
</script>

<style>
.dropdown {
  padding: 0 25px 0 10px;
  width: 175px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  background-color: #171717;
  color: white;
  transition: background-color 0.25s;
  cursor: pointer;

  margin: 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  background-image: url("/down-arrow.svg");
  background-position: 95% center;
  background-repeat: no-repeat;

  box-sizing: border-box;
  transition: border 0.15s;
}

select:hover {
  border: 1px solid white;
}

select:focus {
  outline: none;
}
</style>
