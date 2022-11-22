<template>
  <select name="ttl" class="ttl" ref="ttl">
    <option value="0">One-time paste</option>
    <option value="1">Expire in 2 hours</option>
    <option value="2">Expire in 12 hours</option>
    <option value="3">Expire in 24 hours</option>
  </select>
</template>

<script lang="ts">
export default {
  name: "ContainerDropdown",
  methods: {
    getSelectedTTL() {
      return (this.$refs.ttl as HTMLSelectElement).value;
    }
  }
};
</script>

<style>
.ttl {
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