# Layout System

Layout system provides a powerful, web component-based approach to page layouts. It makes it easy to create responsive layouts with headers, footers, sidebars, and main content.

## Overview

The layout system offers:

- A custom web component for consistent layout structure
- Configurable dimensions for all layout regions
- Automatic responsive behavior with configurable breakpoints
- Transition effects and z-index management
- Support for mini sidebar states for collapsed views

## Layout Regions

The layout component supports these slot regions:

- `header` - Fixed top header area
- `footer` - Fixed bottom footer area
- `left` - Main left sidebar
- `left-mini` - Collapsed version of left sidebar
- `right` - Main right sidebar
- `right-mini` - Collapsed version of right sidebar
- `main` - Main content area

## Configuration Options

```js
xkin.layout({
  // Component name (used in HTML)
  name: "app-layout",

  // Responsive breakpoint (px) for mobile view
  breakPoint: 1024,

  // Transition duration for animations
  transitionDuration: "0.3s",

  // Region dimensions
  sizeHeader: "60px",
  sizeFooter: "40px",
  sizeLeft: "250px",
  sizeRight: "200px",
  sizeLeftMini: "60px",
  sizeRightMini: "60px",

  // Z-index values for proper layering
  zHeader: "100",
  zFooter: "100",
  zLeft: "102",
  zRight: "102",
});
```

## Basic Usage

```html
<app-layout>
  <!-- Header region -->
  <header slot="header" class="app-header">
    <h1>My Application</h1>
  </header>

  <!-- Primary left sidebar -->
  <nav slot="left" class="app-sidebar">
    <ul class="nav-menu">
      <li>Dashboard</li>
      <li>Reports</li>
      <li>Settings</li>
    </ul>
  </nav>

  <!-- Collapsed left sidebar (mobile or collapsed state) -->
  <nav slot="left-mini" class="app-sidebar-mini">
    <ul class="nav-menu-icons">
      <li>📊</li>
      <li>📝</li>
      <li>⚙️</li>
    </ul>
  </nav>

  <!-- Main content area with clipping to respect headers/footers/sidebars -->
  <main slot="main" class="clip-top clip-bottom clip-left clip-right">
    <div class="content-wrapper">
      <h2>Dashboard</h2>
      <p>Welcome to your application dashboard!</p>
    </div>
  </main>

  <!-- Footer region -->
  <footer slot="footer" class="app-footer">
    <p>© 2023 My Company</p>
  </footer>
</app-layout>
```

## Responsive Behavior

The layout automatically adjusts to screen size based on the configured breakpoint:

- **Desktop Mode (> breakpoint)**: Shows full sidebars if they're open
- **Mobile Mode (≤ breakpoint)**: Main content takes full width, sidebars overlay content when open

## CSS Helper Classes

The layout component provides utility classes for managing the layout:

| Class          | Purpose                                                            |
| -------------- | ------------------------------------------------------------------ |
| `clip-top`     | Adjusts top position to account for header                         |
| `clip-bottom`  | Adjusts bottom position to account for footer                      |
| `clip-left`    | Adjusts left position to account for left sidebar                  |
| `clip-right`   | Adjusts right position to account for right sidebar                |
| `open-sidebar` | Applies transform to show a sidebar when added to sidebar elements |

## Sidebar Control Example

```js
// First, initialize the GUI with element selectors
xkin.gui("data-region", {
  left: "main-nav",
  right: "side-panel",
  leftMini: "mini-nav",
  rightMini: "mini-panel",
});

// Now control sidebar visibility using references from $gui
document.getElementById("toggle-left").addEventListener("click", () => {
  // Toggle left sidebar visibility based on screen size
  if (window.innerWidth <= 1024) {
    // On mobile, show the mini sidebar
    xkin.$gui.leftMini.add("open-sidebar");
    xkin.$gui.left.remove("open-sidebar");
  } else {
    // On desktop, toggle between regular and mini sidebar
    if (xkin.$gui.left.contains("open-sidebar")) {
      xkin.$gui.left.remove("open-sidebar");
      xkin.$gui.leftMini.add("open-sidebar");
    } else {
      xkin.$gui.left.add("open-sidebar");
      xkin.$gui.leftMini.remove("open-sidebar");
    }
  }
});
```

## Responsive Layout Example

Here's a complete example of a responsive layout with dynamic sidebar controls:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>XKin Layout Example</title>
    <script src="https://unpkg.com/xkin@latest"></script>
    <style>
      body {
        margin: 0;
        font-family: system-ui, sans-serif;
      }
      .app-header {
        background: #333;
        color: white;
        display: flex;
        align-items: center;
        padding: 0 20px;
      }
      .app-footer {
        background: #333;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .sidebar {
        background: #f5f5f5;
        height: 100%;
        overflow: auto;
        padding: 20px;
      }
      .sidebar-mini {
        background: #f5f5f5;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 20px;
      }
      .content {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }
      .icon-button {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        margin-right: 20px;
      }
    </style>
  </head>
  <body>
    <app-layout>
      <header slot="header" class="app-header">
        <button id="toggle-sidebar" class="icon-button">☰</button>
        <h1>My App</h1>
      </header>

      <nav slot="left" class="sidebar" data-region="main-nav">
        <h3>Navigation</h3>
        <ul>
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Projects</a></li>
          <li><a href="#">Reports</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
      </nav>

      <nav slot="left-mini" class="sidebar-mini" data-region="mini-nav">
        <div>📊</div>
        <div>📁</div>
        <div>📝</div>
        <div>⚙️</div>
      </nav>

      <main slot="main" class="content clip-top clip-bottom clip-left">
        <h2>Welcome to the Dashboard</h2>
        <p>This is a responsive layout built with XKin layout system.</p>
        <p>Try resizing your browser or clicking the menu button to see how the layout responds.</p>
      </main>

      <footer slot="footer" class="app-footer">
        <p>© 2023 XKin Example</p>
      </footer>
    </app-layout>

    <script>
      // Initialize the layout
      xkin.layout({
        name: "app-layout",
        breakPoint: 768,
        sizeHeader: "60px",
        sizeFooter: "40px",
        sizeLeft: "250px",
        sizeLeftMini: "60px",
      });

      // Set up the GUI controls
      xkin.gui("data-region", {
        left: "main-nav",
        leftMini: "mini-nav",
      });

      // Default state - on desktop show full sidebar, on mobile show none
      if (window.innerWidth > 768) {
        xkin.$gui.left.add("open-sidebar");
      }

      // Toggle sidebar on button click
      document.getElementById("toggle-sidebar").addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          // On mobile, toggle between showing and hiding the mini sidebar
          if (xkin.$gui.leftMini.contains("open-sidebar")) {
            xkin.$gui.leftMini.remove("open-sidebar");
          } else {
            xkin.$gui.leftMini.add("open-sidebar");
          }
        } else {
          // On desktop, toggle between full and mini sidebar
          if (xkin.$gui.left.contains("open-sidebar")) {
            xkin.$gui.left.remove("open-sidebar");
            xkin.$gui.leftMini.add("open-sidebar");
          } else {
            xkin.$gui.left.add("open-sidebar");
            xkin.$gui.leftMini.remove("open-sidebar");
          }
        }
      });

      // Handle window resize
      window.addEventListener("resize", () => {
        if (window.innerWidth <= 768) {
          // On mobile, close both sidebars
          xkin.$gui.left.remove("open-sidebar");
          xkin.$gui.leftMini.remove("open-sidebar");
        }
      });
    </script>
  </body>
</html>
```
