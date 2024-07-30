# Vue

Using **`xkin.component`** with Vue.

---

## Using Computed

---

### Create Component

```html
<script setup>
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
  <button type="button" @click="count++" :class="css.class" :style="css.style">
    count is {{ count }}
  </button>
</template>
```

### Use Component

```html
<script setup>
  import CustomButton from "./components/CustomButton.vue";

  import { ref } from "vue";

  const disabled = ref(null);
  const mode = ref(null);

  setInterval(() => {
    disabled.value = !disabled.value;
  }, 2000);

  setInterval(() => {
    if (!mode.value) {
      mode.value = "active";
    } else {
      mode.value = null;
    }
  }, 1000);
</script>

<template>
  <div>
    <h1>Custom Button</h1>
    <CustomButton size="sm" height="40px" :mode="mode" :disabled="disabled" />
  </div>
</template>
```

---

## Using Directives

---

### Create Directive

```js
const handleCSS = (el, props) => {
  /**
   * @xkin
   */
  const css = el.__css__(props).theme(props.mode);
  el.className = css.class;
  el.setAttribute("style", css.style);
};

const themeDirective = {
  created(el, { value, arg }) {
    if (!arg) {
      el.__css__ = value;
    } else if (arg === "props") {
      handleCSS(el, value);
    }
  },
  updated(el, { value, arg }) {
    if (arg === "props") {
      handleCSS(el, value);
    }
  },
};
```

### Register

```js
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

// Register
app.directive("theme", themeDirective);

app.mount("#app");
```

### Create Component

```html
<script setup>
  import { ref } from "vue";

  const props = defineProps(["size", "disabled", "height", "mode"]);

  const count = ref(0);

  /**
   * @xkin
   */
  const component = xkin.component({
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
  });
</script>

<template>
  <button
    type="button"
    @click="count++"
    v-theme="component"
    v-theme:props="props"
  >
    count is {{ count }}
  </button>
</template>
```

### Use Component

```html
<script setup>
  import CustomButton from "./components/CustomButton.vue";

  import { ref } from "vue";

  const disabled = ref(null);
  const mode = ref(null);

  setInterval(() => {
    disabled.value = !disabled.value;
  }, 2000);

  setInterval(() => {
    if (!mode.value) {
      mode.value = "active";
    } else {
      mode.value = null;
    }
  }, 1000);
</script>

<template>
  <div>
    <h1>Custom Button</h1>
    <CustomButton size="sm" height="40px" :mode="mode" :disabled="disabled" />
  </div>
</template>
```
