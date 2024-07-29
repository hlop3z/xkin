// @ts-nocheck
import Plugin from "./src/__init__.ts";

console.log(Plugin);

const demoComponent = {
  base: {
    class: "button",
    style: "",
  },
  attrs: (props) => ({
    type: props.type ?? "button",
  }),
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
      style: "width: 300px",
    },
  },
};

const component = Plugin.component(demoComponent);

const Button = component({
  type: "submit",
  size: "sm",
  disabled: true,
  height: "40px",
});

console.log(Button);

setTimeout(() => {
  const active = Button.theme("active");
  const error = Button.theme("error");
  console.log(active);
  console.log(error);
}, 1000);

Plugin.get("layout", "left")
  ?.css({
    active: {
      class: "color-bg-success",
      style: "height: 300px",
    },
    error: {
      class: "color-bg-danger",
      style: "",
    },
  })
  .theme("error");

setTimeout(() => {
  const theme = Plugin.get("layout", "left")?.theme("active");
});

/*
setInterval(() => {
  Plugin.get("layout", "left")?.toggle("open");

  Plugin.get("layout", "left").current.setAttribute(
    "style",
    "padding-top: 40px; padding-right: 20px"
  );

  console.log(Plugin.get("layout", "left").current);
}, 1000);
*/

/*
console.log(Plugin.class({ "is-small": true }));
console.log(Plugin.class(["other", ["extra"], [{ "is-small": true }]]));
console.log(
  Plugin.style([
    "width: 40;;;;;;;",
    ["overflow-x: auto;", "overflow-y: auto;;"],
    { height: "40px" },
  ])
);

console.log(Plugin.blankForm({ key: "one", val: () => "hello world" }));
*/
