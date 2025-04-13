# Alpine

Using **`xkin.component`** with Alpine.

## HTML `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Alpine</title>

    <script src="//unpkg.com/alpinejs" defer></script>

    <script src="https://unpkg.com/xkin@latest" type="text/javascript"></script>
  </head>

  <body>
    <div x-data="{ count: 0, mode: null, disabled: true }">
      <button
        @click="() => { count++; disabled = !disabled; mode ? (mode = null) : (mode = 'active'); }"
        x-theme="$theme('button', mode, { size: 'sm', height: '40px', disabled: disabled })"
      >
        Increment
      </button>

      <span x-text="count"></span>
    </div>
    <script src="./main.js"></script>
  </body>
</html>
```

## JavaScript `main.js`

```js
/**
 * @xkin
 */
const Button = xkin.component({
  base: {
    class: "button",
  },
  setup: ({ size, disabled, height }) => ({
    class: {
      "is-small": size === "sm",
      "is-large": size === "lg",
      "is-disabled": disabled,
    },
    style: { height: height },
  }),
  theme: {
    active: {
      class: "color-bg-success",
      style: "",
    },
    error: {
      class: "color-bg-danger",
      style: "",
    },
  },
});

const Components = {
  button: Button,
};

document.addEventListener("alpine:init", () => {
  // Magic
  Alpine.magic("theme", () => {
    return (name, mode, props) => ({
      name: name,
      mode: mode,
      props: { ...(props || {}) },
    });
  });

  // Directive
  Alpine.directive("theme", (el, { expression }, { evaluateLater, effect }) => {
    let getData = evaluateLater(expression);
    effect(() => {
      // Reactive
      getData((data) => {
        const current = Components[data.name];
        const css = current(data.props).theme(data.mode);

        // Set CSS
        el.className = css.class;
        el.setAttribute("style", css.style);
      });
    });
  });
});
```
