<h1 style="font-size: 5em; letter-spacing: -2px; font-family: Georgia, sans-serif;" align="center">
   Welcome to <strong>XKin</strong>
</h1>

<p align="center" style="font-size: 2.5em; letter-spacing: -2px; font-family: Georgia, sans-serif;" >
   A lightweight library for control, styling and themes.
</p>

<p
  align="center"
  style="font-size: 2.5em; letter-spacing: -2px; font-family: Georgia, sans-serif;"
>
  <span style="font-size: 2em;">Links</span>
  <br /><br />
  <a href="https://github.com/hlop3z/xkin" target="_blank"> Github </a>
  <br /><br />
  <a href="https://hlop3z.github.io/xkin/" target="_blank"> Docs </a>
</p>

---

XKin is a modern, super **lightweight** alternative to jQuery, designed specifically for color palette design and styling. It provides simple **control for existing elements** and basic layout management. The library includes features for applying styles and classes, handling complex components, and integrating a theme system. Additionally, it offers tools for extending other projects, such as **Vue**, **Alpine**, and **React**.

## Features

| Name            | Description                              |
| --------------- | ---------------------------------------- |
| **`control`**   | Control and manage existing elements     |
| **`gui`**       | Initialize and configure the layout      |
| **`$gui`**      | Manage and control the layout            |
| **`find`**      | Custom `querySelectorAll` implementation |
| **`get`**       | Custom `querySelector` implementation    |
| **`style`**     | Convert object to `CSS` styles           |
| **`class`**     | Convert object to `CSS` classes          |
| **`theme`**     | Build and inject `CSS` for themes        |
| **`component`** | Style and manage complex components      |
| **`blankForm`** | Generate a form object from a schema     |

## Usage

### `control`

```html
<button id="my-button">Click Me</button>
```

```js
const element = document.querySelector("#my-button");

const admin = xkin.control(element);
// OR
const admin = xkin.control("#my-button");
```

#### `control` Attributes

| Name           | Description                                       |
| -------------- | ------------------------------------------------- |
| **`current`**  | Get current element                               |
| **`add`**      | Add class(es) to the current element              |
| **`remove`**   | Remove class(es) from the current element         |
| **`toggle`**   | Toggle class(es) on the current element           |
| **`contains`** | Check if the current element contains a class     |
| **`find`**     | Perform `querySelectorAll` on the current element |
| **`get`**      | Perform `querySelector` on the current element    |
| **`hide`**     | Hide the current element                          |
| **`show`**     | Show the current element                          |
| **`css`**      | Set the component theme configurations            |
| **`theme`**    | Activate a theme configuration                    |

#### `control` Current

```js
const admin = xkin.control("#my-button");

console.log(admin.current);
```

#### `control` Add, Remove, and Toggle

```js
const admin = xkin.control("#my-button");

admin.add("active-class", "other-class");
admin.remove("active-class", "other-class");
admin.toggle("active", "is-open");
```

#### `control` Hide and Show

```js
const admin = xkin.control("#my-button");

admin.hide();
setTimeout(() => admin.show(), 1000);
```

#### `control` CSS and Theme

```js
const admin = xkin.control("#my-button");

admin.css({
  active: {
    class: "color-bg-success",
    style: "height: 60px",
  },
  error: {
    class: "color-bg-danger",
    style: "height: 40px",
  },
});

// Activate "active" theme
admin.theme("active");

// Switch to "error" theme
setTimeout(() => admin.theme("error"), 1500);

// Reset theme
setTimeout(() => admin.theme(), 3000);
```

#### `control` Contains

```js
const admin = xkin.control("#my-button");

console.log(admin.contains("is-small"));
```

#### `control` Get and Find

```html
<div id="container">
  <button class="single">Click Me</button>
  <span class="group">One</span>
  <span class="group">Two</span>
</div>

<script>
  const admin = xkin.control("#container");

  const button = admin.get(".single"); // querySelector
  const groups = admin.find(".group"); // querySelectorAll
</script>
```

### `gui` and `$gui`

```html
<div>
  <aside x-attr="left-id">Left</aside>
  <aside x-attr="right-id">Right</aside>
</div>

<script>
  // Attribute to look for in elements
  xkin.gui("x-attr", {
    left: "left-id",
    right: "right-id",
  });

  // Control the specified elements
  setInterval(() => {
    xkin.$gui.left.toggle("open");
    xkin.$gui.right.toggle("open");
  }, 1000);
</script>
```

### Helper Utils

#### `find`

```js
xkin.find("custom-attr", "the-value");
```

#### `get`

```js
xkin.get("custom-attr", "the-value");
```

#### `blankForm`

Generate a form object from a schema.

```js
// Form from schema
xkin.blankForm({ key: "one", val: () => "hello world" });
```

#### `class`

Convert objects to a single class string.

```js
// Object-To-Class
xkin.class([
  "my-class",
  ["other-class", "extra-class"],
  { "is-small-class": true },
]);
```

#### `style`

Convert objects to a single style string.

```js
// Object-To-Style
xkin.style([
  "width: 40px;",
  ["overflow-x: auto;", "overflow-y: auto;"],
  { height: "40px" },
]);
```

#### `component`

Define and configure a component with class, style, attributes, and theme.

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

const component = xkin.component(myComponent);

const Button = component({
  type: "submit",
  size: "sm",
  disabled: true,
  height: "40px",
});

console.log(Button);

setTimeout(() => {
  const active = Button.theme("active");
  const error = Button.theme("error");
  console.log(active);
  console.log(error);
}, 1000);
```

### Themes

#### `theme` Methods

| Method       | Description                                                       |
| ------------ | ----------------------------------------------------------------- |
| **`set`**    | Configure and apply a theme                                       |
| **`class`**  | Get class types such as (`background`, `border`, `text`, `table`) |
| **`toggle`** | Toggle between themes                                             |
| **`info`**   | Retrieve the current theme                                        |

```js
xkin.theme.class("background", "white");
```

#### Color Types

- **Background** => **`bg`**
- **Text** => **`tx`**
- **Border** => **`br`**
- **Table** => **`tb`**

#### Applying Theme Classes

```html
<!-- Background -->
<div class="color-bg-<themeColor>"></div>

<!-- Text -->
<div class="color-tx-<themeColor>"></div>

<!-- Border -->
<div class="color-br-<themeColor>"></div>

<!-- Table -->
<div class="color-tb-<themeColor>"></div>
```

#### `theme.set` Options

| Option         | Description                     |
| -------------- | ------------------------------- |
| **`base`**     | Core theme configuration        |
| **`dark`**     | Dark theme configuration        |
| **`zebra`**    | Zebra stripe pattern for tables |
| **`disable`**  | Disable specific color types    |
| **`darkMode`** | Enable dark mode                |

### Example Configuration

```js
const isDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

xkin.theme.set({
  darkMode: isDark,
  zebra: true, // Enable zebra striping for tables
  disable: [
    //  Disable specific color types if needed:
    // "text", "background", "border", "table"
  ],
  base: {
    // Core colors
    none: "transparent", // No color
    white: "white", // White
    black: "black", // Black
    gray: "#a5a5a5", // Gray

    // Basic colors
    light: "#fff", // Light
    dark: "#424242", // Dark
    context: "#616161", // Contextual color

    // Utility colors
    success: "#4CAF50", // Success
    danger: "#F44336", // Danger
    warning: "#ff9800", // Warning
    info: "#2196F3", // Info

    // Theme colors
    primary: "#ba68c8", // Primary
    secondary: "#c2185b", // Secondary
  },
  dark: {
    // Basic colors for dark mode
    context: "#a5a5a5", // Contextual color

    // Utility colors for dark mode
    success: "#0f5132", // Success
    danger: "#B71C1C", // Danger
    warning: "#ff9800", // Warning
    info: "#2196F3", // Info

    // Theme colors for dark mode
    primary: "#ba68c8", // Primary
    secondary: "#c2185b", // Secondary
  },
});
```
