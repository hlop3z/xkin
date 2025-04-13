# DOM Control

Provides a powerful, jQuery-like API for DOM manipulation through the `control()` function. This module gives you a fluent interface for managing DOM elements with minimal code.

## Overview

The DOM control system allows you to:

- Select and manipulate DOM elements using CSS selectors or direct element references
- Add, remove, and toggle CSS classes with a clean API
- Show and hide elements while preserving display properties
- Find child elements with enhanced selector methods
- Apply component themes directly to elements
- Chain methods for concise operations

## API Reference

```js
const elementControl = xkin.control(selectorOrElement);
```

### Parameters

| Parameter           | Type              | Description                           |
| ------------------- | ----------------- | ------------------------------------- |
| `selectorOrElement` | String \| Element | CSS selector or DOM element reference |

### Return Value

The `control()` function returns an element controller object with the following methods and properties:

| Method/Property       | Description                                             |
| --------------------- | ------------------------------------------------------- |
| `current`             | Direct reference to the DOM element                     |
| `add(...classes)`     | Add one or more CSS classes                             |
| `remove(...classes)`  | Remove one or more CSS classes                          |
| `toggle(...classes)`  | Toggle one or more CSS classes                          |
| `contains(className)` | Check if element has a specific class                   |
| `find(selector)`      | Find descendant elements (returns array of controllers) |
| `get(selector)`       | Find first matching descendant (returns controller)     |
| `hide()`              | Hide the element while preserving its display property  |
| `show()`              | Restore the element to its original display property    |
| `css(options)`        | Apply component styling configuration                   |
| `theme(themeName)`    | Apply a specific theme from the component styling       |

## Basic Usage

### Selecting Elements

```js
// Select an element with a CSS selector
const button = xkin.control("#submit-button");

// Or with an existing element reference
const headerElement = document.querySelector("header");
const header = xkin.control(headerElement);
```

### Class Manipulation

```js
// Element with multiple classes
const card = xkin.control(".card");

// Add classes
card.add("active", "highlighted");

// Remove classes
card.remove("loading");

// Toggle classes (add if absent, remove if present)
card.toggle("expanded");

// Check if element has a class
if (card.contains("active")) {
  console.log("Card is active");
}
```

### Show and Hide

The show and hide methods intelligently preserve the original display property:

```js
const notification = xkin.control("#notification");

// Hide the notification
notification.hide();

// Show it again later
setTimeout(() => {
  notification.show();
}, 3000);
```

### Element Traversal

Find child elements within the controlled element:

```js
const form = xkin.control("#registration-form");

// Get a single child element
const emailField = form.get(".email-field");

// Get multiple child elements
const allInputs = form.find("input");

// Chain operations
form.find("button").forEach((button) => {
  button.add("form-button");
});

// Access native DOM element when needed
console.log(form.current.getAttribute("data-form-id"));
```

## Advanced Usage

### Applying Component Styles

The `css()` method allows you to apply component-style configurations directly to elements:

```js
const button = xkin.control("#action-button");

// Define component themes
button.css({
  theme: {
    primary: {
      class: "color-bg-primary color-tx-white",
      style: "border: none;",
    },
    secondary: {
      class: "color-bg-secondary",
      style: "border: 1px solid currentColor;",
    },
    danger: {
      class: "color-bg-danger color-tx-white",
      style: "border: none;",
    },
  },
  // Base styling
  base: {
    class: "button",
    style: "padding: 8px 16px; border-radius: 4px; cursor: pointer;",
  },
});

// Apply the primary theme
button.theme("primary");

// Change to danger theme on hover
button.current.addEventListener("mouseover", () => {
  button.theme("danger");
});

// Revert to primary theme on mouseout
button.current.addEventListener("mouseout", () => {
  button.theme("primary");
});
```

### Event Handling Helper

You can extend the controller with event handling methods:

```js
// Add event handling extension
xkin.control.prototype.on = function (eventType, handler) {
  this.current.addEventListener(eventType, handler);
  return this;
};

xkin.control.prototype.off = function (eventType, handler) {
  this.current.removeEventListener(eventType, handler);
  return this;
};

// Now use in a chainable way
xkin
  .control("#toggle-button")
  .add("active")
  .on("click", () => console.log("Button clicked"))
  .on("mouseover", () => console.log("Button hover"));
```

### Dynamic Content Insertion

Combine with modern JavaScript for dynamic content:

```js
const todoList = xkin.control("#todo-list");
const addTodoBtn = xkin.control("#add-todo");

// Add new items dynamically
addTodoBtn.on("click", () => {
  const newItem = document.createElement("li");
  newItem.textContent = `Task ${todoList.find("li").length + 1}`;
  todoList.current.appendChild(newItem);

  // Control the new element
  const itemControl = xkin.control(newItem);
  itemControl.add("new-item");

  // Animate entry
  setTimeout(() => itemControl.add("visible"), 10);
});
```

## Integration with Theme System

The control module integrates seamlessly with XKin's theme system:

```js
// First, set up a theme
xkin.theme.set({
  base: {
    primary: "#4361ee",
    secondary: "#3f37c9",
    danger: "#ef233c",
  },
});

// Control elements and apply theme colors
const header = xkin.control("header");
header.add("color-bg-primary");

// Dynamically update when theme changes
const themeToggle = xkin.control("#theme-toggle");
themeToggle.on("click", () => {
  xkin.theme.toggle();

  // Update element classes based on theme
  const isDark = xkin.theme.info.isDark;
  header.toggle("dark-mode");

  const buttons = xkin.find(".button");
  buttons.forEach((btn) => {
    btn.remove("color-bg-primary", "color-bg-secondary");
    btn.add(isDark ? "color-bg-secondary" : "color-bg-primary");
  });
});
```

## Performance Considerations

For optimal performance when working with many elements:

1. Use `find()` to get a collection once, then iterate over it rather than selecting elements repeatedly
2. Batch class changes when possible rather than adding/removing classes one at a time
3. For complex DOM manipulations, consider using document fragments before adding to the live DOM

```js
// Inefficient
for (let i = 0; i < 100; i++) {
  const item = xkin.control(`#item-${i}`);
  item.add("processed");
}

// More efficient
const items = xkin.find(".item");
items.forEach((item) => {
  item.add("processed");
});
```
