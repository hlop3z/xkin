# Vue Integration

XKin integrates seamlessly with Vue applications, providing powerful styling and theming capabilities for your components. This guide shows you how to incorporate XKin's component system into Vue using two different approaches.

## Overview

There are two main approaches to using XKin with Vue:
1. **Computed Properties**: Use Vue's computed properties to generate XKin styles
2. **Custom Directives**: Create Vue directives for easier component styling

## Method 1: Using Computed Properties

This approach uses Vue's reactive computed properties to generate and update XKin styles whenever component props change.

### Creating a Styled Component

```vue
<script setup>
import { computed } from "vue";

const props = defineProps({
  size: String,
  disabled: Boolean,
  height: String,
  mode: String
});

const count = ref(0);

// Generate XKin styling as a computed property
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
        style: {
          height: height,
          transition: "all 0.3s ease-in-out"
        },
      }),
      theme: {
        active: {
          class: "color-bg-success color-tx-white",
          style: "border: none;",
        },
        error: {
          class: "color-bg-danger color-tx-white",
          style: "border: none;",
        },
      },
    })(props)
    .theme(props.mode); // Apply the specified theme
});
</script>

<template>
  <button 
    type="button" 
    @click="count++" 
    :class="css.class" 
    :style="css.style"
  >
    Count is {{ count }}
  </button>
</template>
```

### Using the Component

```vue
<script setup>
import { ref } from "vue";
import CustomButton from "./components/CustomButton.vue";

// Reactive state for component props
const disabled = ref(false);
const mode = ref(null);

// Toggle button state every 2 seconds
setInterval(() => {
  disabled.value = !disabled.value;
}, 2000);

// Toggle theme every second
setInterval(() => {
  mode.value = mode.value ? null : "active";
}, 1000);
</script>

<template>
  <div>
    <h1>Custom Button Example</h1>
    <p>This button changes theme and state automatically</p>
    <CustomButton 
      size="sm" 
      height="40px" 
      :mode="mode" 
      :disabled="disabled" 
    />
  </div>
</template>
```

## Method 2: Using Custom Directives

This approach creates a custom Vue directive that applies XKin styling more declaratively.

### Creating a Theme Directive

```js
// theme-directive.js
/**
 * Applies XKin styling to an element
 */
const applyStyles = (el, props) => {
  // Get XKin styling from the component
  const css = el.__xkinComponent__(props).theme(props.mode);
  
  // Apply to the element
  el.className = css.class;
  el.setAttribute("style", css.style);
};

/**
 * Vue directive to apply XKin styling
 */
export const themeDirective = {
  // When directive is first bound to the element
  created(el, { value, arg }) {
    if (!arg) {
      // Save the component generator function
      el.__xkinComponent__ = value;
    } else if (arg === "props") {
      // Apply styles with the given props
      applyStyles(el, value);
    }
  },
  
  // When bound element's component is updated
  updated(el, { value, arg }) {
    if (arg === "props") {
      // Update styles when props change
      applyStyles(el, value);
    }
  }
};
```

### Registering the Directive

```js
// main.js
import { createApp } from "vue";
import App from "./App.vue";
import { themeDirective } from "./theme-directive";

const app = createApp(App);

// Register the custom directive globally
app.directive("theme", themeDirective);

app.mount("#app");
```

### Creating a Component with the Directive

```vue
<script setup>
import { ref } from "vue";

const props = defineProps({
  size: String,
  disabled: Boolean,
  height: String,
  mode: String
});

const count = ref(0);

// Define the component styling
const componentStyle = xkin.component({
  base: {
    class: "button",
  },
  setup: ({ size, disabled, height }) => ({
    class: {
      "is-small": size === "sm",
      "is-large": size === "lg",
      "is-disabled": disabled,
    },
    style: {
      height: height,
      borderRadius: "4px",
      padding: size === "sm" ? "4px 8px" : "8px 16px"
    },
  }),
  theme: {
    active: {
      class: "color-bg-success color-tx-white",
      style: "border: none;",
    },
    error: {
      class: "color-bg-danger color-tx-white",
      style: "border: none;",
    },
  },
});
</script>

<template>
  <button
    type="button"
    @click="count++"
    v-theme="componentStyle"  <!-- Pass the component styling -->
    v-theme:props="props"     <!-- Pass the props to apply -->
  >
    Count is {{ count }}
  </button>
</template>
```

## Advanced Usage: Composition API Integration

For more complex components, you can create composable functions that encapsulate XKin styling logic:

```js
// useXkinStyle.js
import { computed } from "vue";

/**
 * Composable function for XKin styling
 */
export function useXkinStyle(styleConfig, props) {
  // Create the component
  const component = xkin.component(styleConfig);
  
  // Computed property that updates when props change
  const styles = computed(() => {
    return component(props).theme(props.mode);
  });
  
  // Return styling and helper methods
  return {
    styles,
    applyTheme: (themeName) => component(props).theme(themeName),
    // Add any additional helper methods here
  };
}
```

### Using the Composable

```vue
<script setup>
import { ref } from "vue";
import { useXkinStyle } from "./useXkinStyle";

const props = defineProps({
  size: String,
  disabled: Boolean,
  mode: String
});

// Button styling configuration
const buttonConfig = {
  base: {
    class: "button",
    style: "font-family: sans-serif;"
  },
  setup: ({ size, disabled }) => ({
    class: {
      "btn-sm": size === "sm",
      "btn-lg": size === "lg",
      "btn-disabled": disabled
    },
    style: {
      opacity: disabled ? 0.6 : 1
    }
  }),
  theme: {
    primary: {
      class: "color-bg-primary color-tx-white",
      style: ""
    },
    secondary: {
      class: "color-bg-secondary",
      style: ""
    }
  }
};

// Use the composable
const { styles } = useXkinStyle(buttonConfig, props);

const count = ref(0);
</script>

<template>
  <button 
    type="button" 
    @click="count++" 
    :class="styles.class" 
    :style="styles.style"
  >
    Count is {{ count }}
  </button>
</template>
```

## Performance Optimization

For optimal performance in Vue applications, consider these best practices:

1. Use `xkin.memoizeOne` within your component style configuration for complex calculations
2. Avoid recreating component definitions on each render
3. For lists, use unique keys and stable component references

```js
// Define component outside render cycle
const buttonStyle = xkin.component({
  // Component definition...
  setup: xkin.memoizeOne(props => ({
    // Complex prop calculations...
  }))
});

// In your component
const css = computed(() => buttonStyle(props).theme(props.mode));
```

## Integration with Vue's Transition System

XKin works well with Vue's transition system:

```vue
<template>
  <Transition name="fade">
    <button v-if="visible" :class="css.class" :style="css.style">
      Animated Button
    </button>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```
