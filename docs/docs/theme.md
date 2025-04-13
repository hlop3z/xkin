# Theme System

The theme system provides a powerful way to manage colors and styles across your application. It generates CSS classes for different color types and supports automatic light/dark mode switching.

## Overview

The theme system:

- Automatically generates CSS classes for your color palette
- Supports light and dark mode with system preference detection
- Applies colors to backgrounds, text, borders, and tables
- Allows toggling between themes at runtime

## API Reference

| Method                      | Description                                                                  |
| --------------------------- | ---------------------------------------------------------------------------- |
| `theme.set(config)`         | Configure and apply your theme system                                        |
| `theme.toggle([forceDark])` | Toggle between light/dark themes (optional boolean to force a specific mode) |
| `theme.class(type, name)`   | Get CSS class name for a specific color and type                             |
| `theme.info`                | Get current theme status and configuration                                   |

## Color Types

XKin provides four different color types that can be applied to elements:

| Type           | CSS Class    | Description                         |
| -------------- | ------------ | ----------------------------------- |
| **Background** | `color-bg-*` | Apply colors to element backgrounds |
| **Text**       | `color-tx-*` | Apply colors to text content        |
| **Border**     | `color-br-*` | Apply colors to element borders     |
| **Table**      | `color-tb-*` | Apply zebra striping to tables      |

## Usage Examples

### Getting Theme Classes

```js
// Get the CSS class for the "primary" color background
const primaryBgClass = xkin.theme.class("background", "primary"); // Returns "color-bg-primary"

// Get the CSS class for the "danger" text color
const dangerTextClass = xkin.theme.class("text", "danger"); // Returns "color-tx-danger"
```

### Applying Theme Classes in HTML

```html
<!-- Apply background color -->
<div class="color-bg-primary">Primary background</div>

<!-- Apply text color -->
<div class="color-tx-danger">Danger text</div>

<!-- Apply border color -->
<div class="color-br-secondary">Element with secondary border</div>

<!-- Apply table zebra styling -->
<table class="color-tb-light">
  <tr>
    <td>Row 1</td>
  </tr>
  <tr>
    <td>Row 2</td>
  </tr>
</table>
```

## Configuration Options

The `theme.set()` method accepts a configuration object with the following options:

| Option     | Type           | Description                                                                          |
| ---------- | -------------- | ------------------------------------------------------------------------------------ |
| `base`     | Object         | Core color palette for light mode                                                    |
| `dark`     | Object         | Color palette overrides for dark mode (inherits values from `base` if not specified) |
| `zebra`    | Boolean/String | Enable zebra striping for tables (can be a color value)                              |
| `disable`  | Array          | Color types to disable (e.g., `["background", "text"]`)                              |
| `darkMode` | Boolean        | Force dark mode on initialization (defaults to system preference)                    |

## Complete Example

```js
// Initialize theme system with comprehensive palette
xkin.theme.set({
  // Use system preference for initial mode
  darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,

  // Enable zebra striping for tables with custom color
  zebra: "#f5f5f5",

  // Disable specific color types if needed
  disable: [],

  // Core color palette (light mode)
  base: {
    // Neutrals
    none: "transparent",
    white: "#ffffff",
    black: "#000000",
    gray: "#a5a5a5",

    // UI colors
    light: "#f8f9fa",
    dark: "#343a40",
    context: "#6c757d",

    // Status colors
    success: "#28a745",
    danger: "#dc3545",
    warning: "#ffc107",
    info: "#17a2b8",

    // Brand colors
    primary: "#007bff",
    secondary: "#6610f2",
    accent: "#e83e8c",
  },

  // Dark mode overrides (only specify what changes)
  dark: {
    light: "#343a40",
    dark: "#f8f9fa",
    context: "#adb5bd",

    success: "#0a3622",
    danger: "#a71d2a",
    warning: "#b78603",
    info: "#0f6674",

    primary: "#0069d9",
    secondary: "#5b0cdb",
    accent: "#d03072",
  },
});

// Toggle between light and dark modes
document.getElementById("theme-toggle").addEventListener("click", () => {
  xkin.theme.toggle();
});

// Get current theme state
console.log("Current dark mode:", xkin.theme.info.isDark);
```

## Responsive Theme Toggle Example

Implement a theme toggle that stays in sync with system preferences:

```js
// Initial setup
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
xkin.theme.set({
  darkMode: prefersDark.matches,
  // ... other theme options
});

// Listen for system preference changes
prefersDark.addEventListener("change", (event) => {
  xkin.theme.toggle(event.matches);
});

// Toggle button
const toggleBtn = xkin.control("#theme-toggle");
toggleBtn.on("click", () => {
  xkin.theme.toggle();
  updateToggleIcon();
});

function updateToggleIcon() {
  const isDark = xkin.theme.info.isDark;
  toggleBtn.theme(isDark ? "dark" : "light");
}
```
