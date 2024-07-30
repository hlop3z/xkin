# Components

Define and configure a component with class, style, attributes, and theme.

## Attributes

| Name          | Description                         |
| ------------- | ----------------------------------- |
| **`base`**    | Static core styling                 |
| **`attrs()`** | Additional element attributes       |
| **`setup()`** | Dynamic base styling                |
| **`theme`**   | Themes as `class` & `style` objects |

## Example

```js
const myComponent = {
  base: {
    class: "button",
    style: "",
  },
  attrs: (props) => ({
    type: props.type ? props.type : "button",
  }),
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
};

// Reusable Component
const component = xkin.component(myComponent);

const Button = component({
  type: "submit",
  size: "sm",
  disabled: true,
  height: "40px",
});

// Component Attributes
console.log(Button);

// Build Themes.
setTimeout(() => {
  const active = Button.theme("active");
  const error = Button.theme("error");
  console.log(active);
  console.log(error);
}, 1000);
```

### Explanation

- **`base`**: Define the static core styling with `class` and `style`.
- **`attrs()`**: Function to define additional attributes based on props.
- **`setup()`**: Function to define dynamic base styling based on custom properties such as `size`, `disabled`, and `height`.
- **`theme`**: Object defining different themes with their respective `class` and `style`.

### Example Usage

1. **Define the Component**: Create a component object with `base`, `attrs`, `setup`, and `theme`.
2. **Create an Instance**: Use the `xkin.component` function to create an instance of the component with specific properties.
3. **Access Themes**: Use the `theme` function of the component instance to build different themes.

The example demonstrates how to define a button component with various configurations and build themes dynamically.
