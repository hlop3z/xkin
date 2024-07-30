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
