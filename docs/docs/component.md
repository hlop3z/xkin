# Component Styling

Component styling system provides a clean, declarative way to create reusable UI components with consistent styling. It separates static base styles from dynamic styles and supports multiple themes.

## Overview

The component system enables you to:

- Define reusable UI component styles with a declarative API
- Separate static styles from dynamic styles that depend on props
- Apply different themes to components based on state or context
- Handle additional attributes like ARIA properties or data attributes

## API Reference

```js
const myComponent = xkin.component(componentConfig);
const instance = myComponent(props);
```

### Component Configuration

| Property       | Type     | Description                                                 |
| -------------- | -------- | ----------------------------------------------------------- |
| `base`         | Object   | Static core styles that don't change based on props         |
| `setup(props)` | Function | Function that returns dynamic styles based on props         |
| `attrs(props)` | Function | Function that returns additional HTML attributes            |
| `theme`        | Object   | Theme variations with their own class and style definitions |

### Component Instance Result

| Property      | Type     | Description                                        |
| ------------- | -------- | -------------------------------------------------- |
| `class`       | String   | Combined CSS classes from base and setup           |
| `style`       | String   | Combined inline styles from base and setup         |
| `attrs`       | Object   | Additional HTML attributes from the attrs function |
| `theme(name)` | Function | Function to apply a specific theme                 |

## Basic Example

```js
// Define a button component
const Button = xkin.component({
  // Static base styles
  base: {
    class: "btn",
    style: "display: inline-block; padding: 8px 16px; border-radius: 4px; cursor: pointer;",
  },

  // Dynamic styles based on props
  setup: ({ size, disabled, fullWidth }) => ({
    class: {
      "btn-sm": size === "small",
      "btn-lg": size === "large",
      "btn-disabled": disabled,
      "btn-block": fullWidth,
    },
    style: disabled ? "opacity: 0.6; pointer-events: none;" : "",
  }),

  // Additional HTML attributes
  attrs: (props) => ({
    type: props.type || "button",
    "aria-disabled": props.disabled ? "true" : "false",
    "data-size": props.size || "default",
  }),

  // Theme variations
  theme: {
    primary: {
      class: "color-bg-primary color-tx-white",
      style: "border: none;",
    },
    secondary: {
      class: "color-bg-secondary color-tx-white",
      style: "border: none;",
    },
    outline: {
      class: "color-tx-primary",
      style: "background: transparent; border: 1px solid currentColor;",
    },
  },
});

// Use the component with specific props
const submitButton = Button({
  size: "large",
  disabled: false,
  fullWidth: true,
  type: "submit",
});

console.log(submitButton);
// {
//   class: "btn btn-lg btn-block",
//   style: "display: inline-block; padding: 8px 16px; border-radius: 4px; cursor: pointer;",
//   attrs: {
//     type: "submit",
//     "aria-disabled": "false",
//     "data-size": "large"
//   },
//   theme: [Function]
// }

// Apply a theme
const primaryButton = submitButton.theme("primary");
console.log(primaryButton);
// {
//   class: "btn btn-lg btn-block color-bg-primary color-tx-white",
//   style: "display: inline-block; padding: 8px 16px; border-radius: 4px; cursor: pointer; border: none;"
// }
```

## Dynamic Property Examples

### Conditional Classes

```js
const Card = xkin.component({
  base: {
    class: "card",
    style: "border-radius: 8px; overflow: hidden;",
  },
  setup: ({ elevated, interactive, padding = "normal" }) => ({
    class: {
      "card-elevated": elevated,
      "card-interactive": interactive,
      "card-padding-sm": padding === "small",
      "card-padding-lg": padding === "large",
    },
    style: elevated ? "box-shadow: 0 4px 8px rgba(0,0,0,0.1);" : "",
  }),
});
```

### Dynamic Styles

```js
const Box = xkin.component({
  base: {
    class: "box",
    style: "display: block;",
  },
  setup: ({ width, height, margin, padding, color }) => ({
    style: {
      width: width,
      height: height,
      margin: margin,
      padding: padding,
      backgroundColor: color,
    },
  }),
});

const redBox = Box({
  width: "200px",
  height: "100px",
  padding: "16px",
  color: "#f44336",
});
```

## Integration with DOM

Use component styles with DOM elements:

```js
// Define the component
const Input = xkin.component({
  base: {
    class: "input",
    style: "padding: 8px; border: 1px solid #ccc; border-radius: 4px;",
  },
  setup: ({ invalid, disabled, size }) => ({
    class: {
      "input-invalid": invalid,
      "input-disabled": disabled,
      "input-sm": size === "small",
      "input-lg": size === "large",
    },
    style: invalid ? "border-color: #dc3545;" : "",
  }),
  attrs: (props) => ({
    type: props.type || "text",
    disabled: props.disabled ? true : undefined,
    "aria-invalid": props.invalid ? "true" : "false",
  }),
});

// Apply to a DOM element
document.addEventListener("DOMContentLoaded", () => {
  const inputElement = document.getElementById("username");
  const inputControl = xkin.control(inputElement);

  // Get component styles with specific props
  const inputStyles = Input({
    invalid: !inputElement.checkValidity(),
    size: "large",
    type: "email",
  });

  // Apply classes and styles
  inputControl.add(inputStyles.class);
  inputElement.style = inputStyles.style;

  // Apply attributes
  Object.entries(inputStyles.attrs).forEach(([key, value]) => {
    if (value !== undefined) {
      inputElement.setAttribute(key, value);
    }
  });
});
```

## Performance Considerations

Component system uses memoization internally to optimize performance. The `setup` and `attrs` functions are only re-executed when their input props change.

For even better performance with frequently updating components, consider using `xkin.memoizeOne` for your custom setup functions:

```js
const optimizedSetup = xkin.memoizeOne((props) => ({
  class: {
    "item-selected": props.selected,
    "item-active": props.active,
  },
  style: {
    opacity: props.opacity,
  },
}));

const ListItem = xkin.component({
  base: { class: "list-item" },
  setup: optimizedSetup,
});
```
