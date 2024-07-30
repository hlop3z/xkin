# Control

```html
<button id="my-button">Click Me</button>
```

```js
const element = document.querySelector("#my-button");

const admin = xkin.control(element);
// OR
const admin = xkin.control("#my-button");
```

## Attributes

| Name           | Description                                       |
| -------------- | ------------------------------------------------- |
| **`current`**  | Get current element                               |
| **`add`**      | Add class(es) to the current element              |
| **`remove`**   | Remove class(es) from the current element         |
| **`toggle`**   | Toggle class(es) on the current element           |
| **`hide`**     | Hide the current element                          |
| **`show`**     | Show the current element                          |
| **`css`**      | Set the component theme configurations            |
| **`theme`**    | Activate a theme configuration                    |
| **`contains`** | Check if the current element contains a class     |
| **`find`**     | Perform `querySelectorAll` on the current element |
| **`get`**      | Perform `querySelector` on the current element    |

## Current

```js
const admin = xkin.control("#my-button");

console.log(admin.current);
```

## Add, Remove, and Toggle

```js
const admin = xkin.control("#my-button");

admin.add("active-class", "other-class");
admin.remove("active-class", "other-class");
admin.toggle("active", "is-open");
```

## Hide and Show

```js
const admin = xkin.control("#my-button");

admin.hide();
setTimeout(() => admin.show(), 1000);
```

## CSS and Theme

```js
const admin = xkin.control("#my-button");

admin.css({
  active: {
    class: "color-bg-success",
    style: "height: 60px",
  },
  error: {
    class: "color-bg-danger",
    style: "height: 40px",
  },
});

// Activate "active" theme
admin.theme("active");

// Switch to "error" theme
setTimeout(() => admin.theme("error"), 1500);

// Reset theme
setTimeout(() => admin.theme(), 3000);
```

## Contains

```js
const admin = xkin.control("#my-button");

console.log(admin.contains("is-small"));
```

## Get and Find

```html
<div id="container">
  <button class="single">Click Me</button>
  <span class="group">One</span>
  <span class="group">Two</span>
</div>

<script>
  const admin = xkin.control("#container");

  const button = admin.get(".single"); // querySelector
  const groups = admin.find(".group"); // querySelectorAll
</script>
```
