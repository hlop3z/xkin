<script setup>
import HelloWorld from "./components/HelloWorld.vue";

import { ref } from "vue";

const disabled = ref(null);
const mode = ref(null);

setInterval(() => {
  disabled.value = !disabled.value;
}, 5000);

setInterval(() => {
  // disabled.value = !disabled.value;
  if (!mode.value) {
    mode.value = "active";
  } else {
    mode.value = null;
  }
}, 1000);
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  {{ disabled ? "yes" : "no" }}
  <HelloWorld msg="Vite + Vue" size="sm" :disabled="disabled" :mode="mode" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
