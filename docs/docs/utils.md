# Utility Functions

Provides several utility functions to handle common tasks efficiently. These utilities help with DOM selection, class and style manipulation, data transformation, and performance optimization.

## DOM Selection Utilities

### `find(attributeName, value)`

Returns an array of element controllers for all elements with a matching attribute value.

```js
// HTML: <button data-role="action">Save</button> <button data-role="action">Cancel</button>
const actionButtons = xkin.find("data-role", "action");

// Returns array of controllers for all matching elements
actionButtons.forEach((button) => {
  button.add("action-button");
});
```

### `get(attributeName, value)`

Returns the first element controller with a matching attribute value.

```js
// HTML: <nav data-panel="sidebar">...</nav>
const sidebar = xkin.get("data-panel", "sidebar");

// Returns a single controller for the first matching element
sidebar.add("visible");
```

## Class and Style Manipulation

### `css(input)`

Converts various input formats to a single CSS class string. This is useful for combining conditional classes.

```js
// Convert array of class names
const classes = xkin.css(["btn", "btn-primary"]);
// Result: "btn btn-primary"

// Mix arrays and objects with conditional classes
const buttonClasses = xkin.css([
  "btn",
  {
    "btn-primary": isPrimary,
    "btn-lg": size === "large",
    "btn-disabled": isDisabled,
  },
]);
// Result (if isPrimary and isDisabled are true): "btn btn-primary btn-disabled"

// Mix arrays of arrays for complex combinations
const mixedClasses = xkin.css(["card", ["card-header", "bg-dark"], { "is-selected": isSelected }]);
// Result (if isSelected is true): "card card-header bg-dark is-selected"
```

### `style(input)`

Converts various input formats to a single CSS style string. This is useful for creating inline styles dynamically.

```js
// Convert object to style string
const styles = xkin.style({
  width: "200px",
  height: "100px",
  backgroundColor: "#f5f5f5",
});
// Result: "width: 200px; height: 100px; background-color: #f5f5f5;"

// Mix arrays and objects
const cardStyles = xkin.style([
  "border-radius: 4px;",
  {
    padding: hasContent ? "16px" : "0",
    margin: "8px 0",
  },
]);
// Result (if hasContent is true): "border-radius: 4px; padding: 16px; margin: 8px 0;"

// Conditional inclusion
const dynamicStyles = xkin.style([
  "position: relative;",
  isAbsolute && "position: absolute; top: 0; left: 0;",
]);
// Only includes the second style if isAbsolute is true
```

## Data Transformation

### `blank(schema)`

Generates an object from a schema by evaluating function values. This is useful for creating default form values or state objects.

```js
// Generate a form object with default values
const formDefaults = xkin.blank({
  name: "",
  email: "",
  age: () => 18,
  date: () => new Date().toISOString().split("T")[0],
  settings: {
    notifications: () => true,
    theme: "light",
  },
});

// Result:
// {
//   name: "",
//   email: "",
//   age: 18,
//   date: "2023-07-15", // Current date in YYYY-MM-DD format
//   settings: {
//     notifications: true,
//     theme: "light"
//   }
// }
```

## Performance Optimization

### `memoize(function, [hashFunction], [cacheSize])`

Creates a memoized version of a function that caches its results based on input arguments. This is useful for expensive calculations that may be called repeatedly with the same inputs.

```js
// Expensive calculation function
function calculateLayout(width, height, items) {
  console.log("Calculating layout...");
  // Simulate complex calculation
  return {
    width,
    height,
    positions: items.map((item, i) => ({
      id: item.id,
      x: i * 10,
      y: i * 5,
    })),
  };
}

// Create memoized version with default cache size (100)
const memoizedCalculate = xkin.memoize(calculateLayout);

// First call calculates and caches
const layout1 = memoizedCalculate(800, 600, [{ id: 1 }, { id: 2 }, { id: 3 }]);
// Console: "Calculating layout..."

// Second call with same parameters uses cached result
const layout2 = memoizedCalculate(800, 600, [{ id: 1 }, { id: 2 }, { id: 3 }]);
// No console output, uses cached result

// Different parameters trigger new calculation
const layout3 = memoizedCalculate(1024, 768, [{ id: 1 }, { id: 2 }, { id: 3 }]);
// Console: "Calculating layout..."
```

#### Custom Cache Size

```js
// Limit cache to only most recent 10 results
const limitedCache = xkin.memoize(expensiveFunction, undefined, 10);
```

#### Custom Hash Function

```js
// Custom hash function for complex objects
const userCache = xkin.memoize(
  fetchUserData,
  (userId, options) => `${userId}-${options.includeDetails}-${options.filter}`,
  50
);
```

### `memoizeOne(function, [equalityCheck])`

Creates a memoized function that only remembers the latest arguments and result. This is optimal for functions that are typically called repeatedly with the same recent value.

```js
// Original function for processing user data
function processUserData(userId, filters) {
  console.log("Processing data for", userId);
  // Expensive operation...
  return {
    id: userId,
    processed: true,
    filters,
  };
}

// Create memoized version that only remembers most recent call
const memoizedProcess = xkin.memoizeOne(processUserData);

// First call processes and caches
memoizedProcess("user123", ["active"]);
// Console: "Processing data for user123"

// Same parameters use cached result
memoizedProcess("user123", ["active"]);
// No console output, uses cached result

// Different parameters replace the cache
memoizedProcess("user456", ["active"]);
// Console: "Processing data for user456"

// Original parameters now require reprocessing
memoizedProcess("user123", ["active"]);
// Console: "Processing data for user123"
```

## Real-World Use Cases

### Responsive Component Styling

```js
// Define responsive style generator
const getResponsiveStyles = xkin.memoize((width, isMobile) => {
  return {
    container: xkin.style({
      width: width + "px",
      padding: isMobile ? "8px" : "16px",
      fontSize: isMobile ? "14px" : "16px",
    }),
    header: xkin.css(["component-header", { "mobile-header": isMobile }]),
  };
});

// Use in a component
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const isMobile = width < 768;

  // Gets cached result if dimensions haven't changed
  const styles = getResponsiveStyles(width, isMobile);

  const container = xkin.control("#app-container");
  const header = xkin.control("#app-header");

  container.current.setAttribute("style", styles.container);
  header.current.className = styles.header;
});
```

### Form Data Handling

```js
// Generate default form values
const defaultForm = xkin.blank({
  username: "",
  email: "",
  preferences: {
    theme: "light",
    notifications: () => true,
    fontSize: () => localStorage.getItem("fontSize") || "medium",
  },
});

// Reset form to defaults
document.querySelector("#reset-button").addEventListener("click", () => {
  const form = document.querySelector("#settings-form");
  const formData = xkin.blank(defaultForm);

  // Apply values to form elements
  Object.entries(formData).forEach(([key, value]) => {
    if (typeof value === "object") {
      Object.entries(value).forEach(([subKey, subValue]) => {
        const field = form.querySelector(`[name="${key}.${subKey}"]`);
        if (field) field.value = subValue;
      });
    } else {
      const field = form.querySelector(`[name="${key}"]`);
      if (field) field.value = value;
    }
  });
});
```
