// @ts-nocheck
import xkin from "./src/__init__.ts";

xkin.gui("x-layout", {
  left: "left-id",
  right: "right-id",
});

setInterval(() => {
  xkin.$gui.left.toggle("open");
  xkin.$gui.right.toggle("open");
}, 1000);

const myComponent = {
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
      style: "",
    },
  },
};

const component = xkin.component(myComponent);

// const _el = Plugin.control(".button");
// console.log(Object.keys(_el));

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

/*
xkin
  .get("x-layout", "left")
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
  const element = xkin.get("x-layout", "left");
  element.theme("active");
  setTimeout(() => element.theme("error"), 1000);
});
*/

(function () {
  const admin = xkin.control("#container");

  const button = admin.get(".single");
  const groups = admin.find(".group");

  console.log(button.current);
  console.log(groups);
})();

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
