# GUI Management

GUI management provides a simple way to access and control layout elements through a centralized API. This system makes it easy to manipulate sidebars, headers, and other layout elements without complex DOM queries.

## Overview

The GUI system consists of two main components:

- `gui()` - Initializes references to elements using custom attribute selectors
- `$gui` - An object containing references to the initialized elements

## API Reference

```js
// Initialize GUI elements
xkin.gui(attributeName, elementsMap);

// Access GUI elements
xkin.$gui.elementKey;
```

### Parameters

| Parameter       | Type   | Description                                  |
| --------------- | ------ | -------------------------------------------- |
| `attributeName` | String | The HTML attribute used to identify elements |
| `elementsMap`   | Object | Object mapping keys to attribute values      |

### Return Value

The `gui()` function initializes the global `$gui` object with references to the selected elements. Each element is accessible using the key specified in the `elementsMap`.

## Basic Example

```html
<div id="app">
  <!-- Elements with custom attribute identifiers -->
  <header x-region="app-header">Site Header</header>
  <aside x-region="left-sidebar">Left Sidebar</aside>
  <aside x-region="right-sidebar">Right Sidebar</aside>
  <div x-region="content-area">Main Content</div>
  <footer x-region="app-footer">Site Footer</footer>
</div>

<script>
  // Initialize GUI with references to elements
  xkin.gui("x-region", {
    header: "app-header",
    left: "left-sidebar",
    right: "right-sidebar",
    content: "content-area",
    footer: "app-footer",
  });

  // Now each element can be accessed and controlled via $gui
  console.log(xkin.$gui.header.current); // DOM element reference

  // Add classes to elements
  xkin.$gui.header.add("sticky-header");
  xkin.$gui.left.add("expanded");

  // Toggle sidebar visibility
  document.getElementById("toggle-left").addEventListener("click", () => {
    xkin.$gui.left.toggle("visible");
  });
</script>
```

## Integration with Layout Component

The GUI system works especially well with the layout component. When used together, they provide a powerful way to manage complex responsive layouts:

```html
<app-layout>
  <header slot="header" x-part="header">Header</header>
  <nav slot="left" x-part="nav">Navigation</nav>
  <nav slot="left-mini" x-part="mini-nav">Mini Nav</nav>
  <main slot="main" class="clip-top clip-left">Main Content</main>
</app-layout>

<button id="toggle-nav">Toggle Navigation</button>

<script>
  // Initialize layout
  xkin.layout({ name: "app-layout" });

  // Initialize GUI
  xkin.gui("x-part", {
    header: "header",
    nav: "nav",
    miniNav: "mini-nav",
  });

  // Toggle navigation with smooth transitions
  document.getElementById("toggle-nav").addEventListener("click", () => {
    // Toggle between full and mini navigation
    if (xkin.$gui.nav.contains("open-sidebar")) {
      xkin.$gui.nav.remove("open-sidebar");
      xkin.$gui.miniNav.add("open-sidebar");
    } else {
      xkin.$gui.nav.add("open-sidebar");
      xkin.$gui.miniNav.remove("open-sidebar");
    }
  });
</script>
```

## Dynamically Updating GUI References

If your application changes the DOM after initialization, you can update the GUI references:

```js
// Initial setup
xkin.gui("data-panel", {
  main: "dashboard",
});

// Later, when navigation changes panels
function navigateTo(panelId) {
  // Add new panel
  document.getElementById("container").innerHTML = `
    <div data-panel="${panelId}">New Panel Content</div>
  `;

  // Update GUI reference
  xkin.gui("data-panel", {
    main: panelId,
  });

  // Now you can use the updated reference
  xkin.$gui.main.add("panel-visible");
}
```

## Multiple Attribute Selection

The GUI system also supports selecting multiple elements with the same attribute value using the `find` function:

```html
<div class="tabs">
  <button x-tab="settings" class="active">General</button>
  <button x-tab="settings">Profile</button>
  <button x-tab="settings">Security</button>
</div>

<script>
  // Find all tab elements
  const tabs = xkin.find("x-tab", "settings");

  // Loop through and add click listeners
  tabs.forEach((tab) => {
    tab.on("click", () => {
      // Remove active class from all tabs
      tabs.forEach((t) => t.remove("active"));
      // Add active class to clicked tab
      tab.add("active");
    });
  });
</script>
```

## Useful Patterns

### Toggling Sidebars

```js
const toggleSidebar = (side) => {
  const isOpen = xkin.$gui[side].contains("open-sidebar");

  if (isOpen) {
    xkin.$gui[side].remove("open-sidebar");
  } else {
    // Close other sidebars first
    if (side === "left" && xkin.$gui.right) {
      xkin.$gui.right.remove("open-sidebar");
    } else if (side === "right" && xkin.$gui.left) {
      xkin.$gui.left.remove("open-sidebar");
    }

    // Open requested sidebar
    xkin.$gui[side].add("open-sidebar");
  }
};

// Usage
document.getElementById("left-button").onclick = () => toggleSidebar("left");
document.getElementById("right-button").onclick = () => toggleSidebar("right");
```

### Responsive Behavior

```js
// Handle responsive layout
window.addEventListener("resize", () => {
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    // On mobile, close main sidebar and show mini if needed
    xkin.$gui.left.remove("open-sidebar");

    if (document.body.classList.contains("nav-open")) {
      xkin.$gui.leftMini.add("open-sidebar");
    }
  } else {
    // On desktop, show main sidebar and hide mini
    xkin.$gui.left.add("open-sidebar");
    xkin.$gui.leftMini.remove("open-sidebar");
  }
});
```
