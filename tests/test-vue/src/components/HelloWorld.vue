<script setup>
import { ref } from "vue";
import { computed } from "vue";

const props = defineProps(["size", "disabled", "height", "mode"]);

const css = computed(() => {
  return xkin
    .component({
      base: {
        class: "button",
      },
      setup: ({ size, disabled, height }) => ({
        class: {
          "is-small": size === "sm",
          "is-large": size === "lg",
          "is-disabled": disabled,
        },
        style: { height: height },
      }),
      theme: {
        active: {
          class: "color-bg-success",
          style: "",
        },
        error: {
          class: "color-bg-danger",
          style: "",
        },
      },
    })(props)
    .theme(props.mode);
});
</script>

<template>
  <h1 :class="css.class" :style="css.style">
    {{ msg }}
  </h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
