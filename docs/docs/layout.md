# Layout

Creates a **web component-based** layout with configurable regions

- Supports header, footer, left sidebar, right sidebar, and main content areas
- Configurable sizes and breakpoints for responsive behavior
- Automatic z-index management for proper layering

## Layout Customization

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

## HTML Usage

```html
<app-layout>
  <header slot="header">Header Content</header>
  <nav slot="left">Left Sidebar</nav>
  <aside slot="right">Right Sidebar</aside>
  <main slot="main" class="clip-top clip-bottom clip-left clip-right">Main Content</main>
  <footer slot="footer">Footer Content</footer>
</app-layout>
```
