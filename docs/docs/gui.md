# GUI

- **`gui`** Initialize and configure the layout
- **`$gui`** Manage and control the layout

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
