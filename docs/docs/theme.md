# Theme

## Methods

| Method       | Description                                                       |
| ------------ | ----------------------------------------------------------------- |
| **`set`**    | Configure and apply a theme                                       |
| **`class`**  | Get class types such as (`background`, `border`, `text`, `table`) |
| **`toggle`** | Toggle between themes                                             |
| **`info`**   | Retrieve the current theme                                        |

## Color Types

- **Background** => **`bg`**
- **Text** => **`tx`**
- **Border** => **`br`**
- **Table** => **`tb`**

```js
xkin.theme.class("background", "white");
```

## Applying Theme Classes

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

## `theme.set` Options

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
