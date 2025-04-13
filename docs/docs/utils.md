# Utils

## `find`

```js
xkin.find("custom-attr", "the-value");
```

## `get`

```js
xkin.get("custom-attr", "the-value");
```

## `blank`

Generate a form object from a schema.

```js
// Form from schema
xkin.blank({ key: "one", val: () => "hello world" });
```

## `css`

Convert objects to a single class string.

```js
// Object-To-Class
xkin.css(["my-class", ["other-class", "extra-class"], { "is-small-class": true }]);
```

## `style`

Convert objects to a single style string.

```js
// Object-To-Style
xkin.style(["width: 40px;", ["overflow-x: auto;", "overflow-y: auto;"], { height: "40px" }]);
```

## `memoize`

Convert objects to a single style string.

```js
const calculateLayout = xkin.memoize((width, height, items) => {
  console.log("Calculating layout...");
  // Expensive calculation here
  return { width, height, positions: [] };
});

// Will calculate once and cache the result
calculateLayout(800, 600, [1, 2, 3]);
calculateLayout(800, 600, [1, 2, 3]); // Uses cached result
```

## `memoizeOne`

```js
// Useful for component props optimization
const getDisplayData = (userId: string, filters: string[]) => {
  console.log('Processing data...');
  return processUserData(userId, filters);
};

const memoizedGetData = xkin.memoizeOne(getDisplayData);

// Only recalculates when inputs change
memoizedGetData('user123', ['active']); // Logs and processes
memoizedGetData('user123', ['active']); // Returns cached result
memoizedGetData('user123', ['inactive']); // Logs and processes (inputs changed)
```
