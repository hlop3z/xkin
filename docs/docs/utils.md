# Utils

## `find`

```js
xkin.find("custom-attr", "the-value");
```

## `get`

```js
xkin.get("custom-attr", "the-value");
```

## `blankForm`

Generate a form object from a schema.

```js
// Form from schema
xkin.blankForm({ key: "one", val: () => "hello world" });
```

## `class`

Convert objects to a single class string.

```js
// Object-To-Class
xkin.class([
  "my-class",
  ["other-class", "extra-class"],
  { "is-small-class": true },
]);
```

## `style`

Convert objects to a single style string.

```js
// Object-To-Style
xkin.style([
  "width: 40px;",
  ["overflow-x: auto;", "overflow-y: auto;"],
  { height: "40px" },
]);
```
