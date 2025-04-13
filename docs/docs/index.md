# Welcome to **X-Kin**

XKin is a modern, **lightweight** JavaScript library designed as an alternative to jQuery, with special focus on styling, theming, and DOM manipulation. Perfect for projects where you need powerful controls without the overhead of larger frameworks.

## Features

- 📦 **Tiny footprint**: Minimal bundle size for optimal performance
- 🎨 **Theme system**: Light/dark mode with automatic system preference detection
- 🧩 **Component styling**: Clean API for managing complex component styles
- 📱 **Responsive layouts**: Web component-based layout system with configurable regions
- 🔍 **DOM utilities**: Simple element selection and manipulation
- ⚡ **Performance optimized**: Includes memoization utilities for efficient rendering

## Installation

### CDN

```html
<script src="https://unpkg.com/xkin@latest" type="text/javascript"></script>
```

### NPM

```bash
npm install xkin --save
```

```js
// ES Module
import { control, theme, css } from "xkin";

// CommonJS
const { control, theme, css } = require("xkin");
```

## API Reference

| Category          | Function         | Description                                                |
| ----------------- | ---------------- | ---------------------------------------------------------- |
| **DOM Selection** | `control()`      | Create a controller for DOM elements with enhanced methods |
|                   | `get()`          | Enhanced `querySelector` with attribute-based selection    |
|                   | `find()`         | Enhanced `querySelectorAll` with attribute-based selection |
| **Styling**       | `css()`          | Convert objects/arrays to CSS class strings                |
|                   | `style()`        | Convert objects/arrays to CSS style strings                |
|                   | `component()`    | Create reusable styled components with themes              |
| **Theming**       | `theme.set()`    | Configure and apply color themes                           |
|                   | `theme.toggle()` | Toggle between light/dark modes                            |
|                   | `theme.class()`  | Generate theme class names                                 |
| **Layout**        | `layout()`       | Create web component-based layouts                         |
|                   | `gui()`          | Initialize and configure layout controls                   |
|                   | `$gui`           | Access configured layout elements                          |
| **Utilities**     | `blank()`        | Generate objects from schemas                              |
|                   | `memoize()`      | Cache function results for performance                     |
|                   | `memoizeOne()`   | Cache only the most recent function result                 |

## Quick Example

```js
// Configure a theme
xkin.theme.set({
  darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
  base: {
    primary: "#4361ee",
    secondary: "#3f37c9",
    success: "#4caf50",
    danger: "#f44336",
  },
  dark: {
    primary: "#4895ef",
    secondary: "#4cc9f0",
    success: "#0f5132",
    danger: "#b71c1c",
  },
});

// Control an element
const button = xkin.control("#my-button");
button.add("color-bg-primary");
button.on("click", () => xkin.theme.toggle());
```
