# Xkin

<div align="center">
   <p>
   <strong>A lightweight UI library for web applications.</strong>
   <br/>
    Provides utilities for styling, component creation, DOM manipulation and theme management.
   </p>
   <p><code>11kB</code> minified | <code>4kb</code> gzipped</p>

[![License: BSD 3-Clause](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![npm version](https://img.shields.io/npm/v/xkin.svg)](https://www.npmjs.com/package/xkin)

[Documentation](https://hlop3z.github.io/xkin/) |
[GitHub](https://github.com/hlop3z/xkin)

</div>

## Installation

```bash
npm install xkin
# or
yarn add xkin
# or
bun add xkin
```

## Quick Start

```ts
import * as xkin from "xkin";

// Create a styled component
const button = xkin.component({
  base: {
    class: "btn",
    style: "cursor: pointer; padding: 8px 16px;",
  },
  theme: {
    primary: {
      class: "btn-primary",
      style: "background-color: #0d6efd; color: white;",
    },
    secondary: {
      class: "btn-secondary",
      style: "background-color: #6c757d; color: white;",
    },
  },
});

// Use the component
const btnProps = button({});
document.getElementById("myButton").className = btnProps.class;
document.getElementById("myButton").setAttribute("style", btnProps.style);

// Apply a theme
const primaryBtnProps = button({}).theme("primary");
document.getElementById("primaryButton").className = primaryBtnProps.class;
document.getElementById("primaryButton").setAttribute("style", primaryBtnProps.style);

// Use the element control methods
const btnControl = xkin.control("#myButton");
btnControl.add("active", "highlight");
btnControl.hide();
btnControl.show();

// Create a custom web component layout
xkin.layout({
  name: "app-layout",
  sizeHeader: "60px",
  sizeFooter: "50px",
  sizeLeft: "200px",
  sizeRight: "250px",
});

// Set up color themes
xkin.theme.set({
  base: {
    primary: "#0d6efd",
    secondary: "#6c757d",
    success: "#198754",
  },
  dark: {
    primary: "#0b5ed7",
    secondary: "#5c636a",
    success: "#157347",
  },
});

// Toggle dark mode
xkin.theme.toggle();

// Use directives for interactive behavior
const element = document.querySelector(".sidebar");
xkin.swipe(element, (direction) => {
  if (direction === "left") {
    // Close sidebar
  }
});
```

## Core Features

- **Styling**: Convert JavaScript objects to CSS classes and styles
- **Components**: Create reusable UI components with theme support
- **DOM Manipulation**: Simplified DOM element selection and manipulation
- **Theme Management**: Apply color themes with support for dark mode
- **Layout System**: Web component-based layout with configurable regions and touch gestures
- **Directives**: Utilities for handling touch gestures, click outside, and hover events
- **Performance Optimization**: Function memoization utilities to prevent redundant calculations

## API Reference

### Styling

- `xkin.css(object)`: Converts an object to a CSS class string
- `xkin.style(object)`: Converts an object to a CSS style string
- `xkin.blank(form)`: Creates a new object by executing functions in the input object

### Components

- `xkin.component(config)`: Creates a new styled component with theming support

### DOM Manipulation

- `xkin.control(selector)`: Returns an element controller with enhanced methods
- `xkin.get(attr_selector)`: Queries for a single element controller with enhanced methods
- `xkin.find(attr_selector)`: Queries for multiple elements controller with enhanced methods

### GUI Management

- `xkin.gui(attr, options)`: Creates a GUI manager for attribute-based components
- `xkin.$gui`: Global components object

### Layout System

- `xkin.layout(config)`: Creates a web component-based layout with configurable regions
  - Supports header, footer, left sidebar, right sidebar, and main content areas
  - Configurable sizes and breakpoints for responsive behavior
  - Automatic z-index management for proper layering
  - Touch gesture support for swiping sidebars open/closed
  - State persistence across page reloads
  - Option to disable shadow DOM with the `no-shadow` attribute

### Theme Management

- `xkin.theme.set(config)`: Creates a new theme with base and dark mode color configurations
- `xkin.theme.toggle(value?)`: Toggles between light and dark mode
- `xkin.theme.class(type, name)`: Gets CSS class names for different color types
- `xkin.theme.info`: Returns the current theme object with color information

### Directives

- `xkin.swipe(element, callback, threshold?)`: Detects swipe gestures on an element
- `xkin.clickOutside(element, callback)`: Detects clicks outside of an element
- `xkin.hover(element, callback)`: Handles hover enter/leave events on an element

### Performance Optimization

- `xkin.memoize(fn, keyFn?, maxSize?)`: Creates a cached version of a function that stores results by input arguments
- `xkin.memoizeOne(fn, keyFn?)`: Creates a memoized function that only keeps the most recent result

## Examples

### Layout System

```ts
// Create a custom layout with specific dimensions
xkin.layout({
  name: "app-layout", // Custom element name
  breakPoint: 1024, // Mobile breakpoint in pixels
  transitionDuration: "0.3s", // Transition speed for sidebars
  sizeHeader: "60px", // Header height
  sizeFooter: "40px", // Footer height
  sizeLeft: "250px", // Left sidebar width
  sizeRight: "200px", // Right sidebar width
  sizeLeftMini: "50px", // Collapsed left sidebar width
  sizeRightMini: "50px", // Collapsed right sidebar width
});
```

HTML Usage:

```html
<!-- With shadow DOM (default) -->
<app-layout>
  <header slot="header">Header Content</header>
  <nav slot="left">Left Sidebar</nav>
  <aside slot="right">Right Sidebar</aside>
  <main slot="main" class="clip-top clip-bottom clip-left clip-right">Main Content</main>
  <footer slot="footer">Footer Content</footer>
</app-layout>

<!-- Without shadow DOM -->
<app-layout no-shadow>
  <!-- Same content structure -->
</app-layout>
```

JavaScript control:

```js
// Get layout component reference
const layout = document.querySelector("app-layout");

// Programmatically toggle sidebars
layout.toggle("left"); // Toggle left sidebar
layout.toggle("right", true); // Force open right sidebar
layout.toggle("left-mini", false); // Force close left-mini sidebar
```

### Directive Usage

```js
// Swipe detection
const sidebar = document.querySelector(".sidebar");
const cleanup = xkin.swipe(
  sidebar,
  (direction) => {
    if (direction === "left") {
      console.log("Swiped left - close sidebar");
      sidebar.classList.remove("open");
    } else if (direction === "right") {
      console.log("Swiped right - open sidebar");
      sidebar.classList.add("open");
    }
  },
  75
); // Custom threshold (default is 50px)

// Click outside detection
const dropdown = document.querySelector(".dropdown");
const dropdownCleanup = xkin.clickOutside(dropdown, () => {
  dropdown.classList.remove("open");
});

// Hover handling
const button = document.querySelector(".hover-button");
const hoverCleanup = xkin.hover(button, (isHovering) => {
  button.classList.toggle("hovered", isHovering);
});

// Cleanup when no longer needed
cleanup();
dropdownCleanup();
hoverCleanup();
```

### Theme Management

```ts
// Set up color themes
xkin.theme.set({
  base: {
    // Light mode colors
    primary: "#0d6efd",
    secondary: "#6c757d",
    success: "#198754",
    danger: "#dc3545",
    warning: "#ffc107",
    info: "#0dcaf0",
    light: "#f8f9fa",
    dark: "#212529",
  },
  dark: {
    // Dark mode colors (overrides base colors)
    primary: "#0b5ed7",
    secondary: "#5c636a",
    light: "#2b3035",
    dark: "#f8f9fa",
  },
  disable: ["warning"], // Colors that should not generate CSS classes
  zebra: "#f2f2f2", // Color for zebra-striped tables
  darkMode: false, // Initial mode (false = light, true = dark)
});

// Apply colors using generated CSS classes
// <button class="color-bg-primary">Primary Button</button>
// <p class="color-tx-secondary">Secondary Text</p>
// <div class="color-br-danger">Danger Border</div>
// <table class="color-tb-light">Zebra Table</table>

// Toggle dark mode
xkin.theme.toggle();

// Force light or dark mode
xkin.theme.toggle(false); // Light mode
xkin.theme.toggle(true); // Dark mode

// Get current theme information
const colors = xkin.theme.info.colors; // Available color names
const isDark = xkin.theme.info.isDark; // Current mode
```

### Memoization for Performance

```ts
// Memoize an expensive calculation
const calculateLayout = xkin.memoize((width, height, items) => {
  console.log("Calculating layout...");
  // Expensive calculation here
  return { width, height, positions: [] };
});

// Will calculate once and cache the result
calculateLayout(800, 600, [1, 2, 3]);
calculateLayout(800, 600, [1, 2, 3]); // Uses cached result

// For functions where only the last result matters
const getLatestTheme = xkin.memoizeOne((theme) => {
  console.log("Processing theme...");
  return { ...theme, processed: true };
});
```

## Integration with Frameworks

Xkin works well with popular frameworks and libraries:

- [React Integration](https://hlop3z.github.io/xkin/integration/react)
- [Vue Integration](https://hlop3z.github.io/xkin/integration/vue)
- [Preact Integration](https://hlop3z.github.io/xkin/integration/preact)
- [Alpine.js Integration](https://hlop3z.github.io/xkin/integration/alpine)

## Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Run tests
bun run test

# Lint code
bun run lint

# Format code
bun run format
```

## License

BSD 3-Clause
