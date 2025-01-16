// @ts-nocheck
import xkin from "./__init__";

window.xkin = xkin;

// ====================================================================================================================
// Demo
// ====================================================================================================================

const isDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

xkin.theme.set({
  darkMode: isDark,
  zebra: true, // Enable zebra striping for tables
  disable: [
    //  Disable specific color types if needed:
    // "text", "background", "border", "table"
  ],
  base: {
    // Core colors
    none: "transparent", // No color
    white: "white", // White
    black: "black", // Black
    gray: "#a5a5a5", // Gray

    // Basic colors
    light: "#fff", // Light
    dark: "#424242", // Dark
    context: "#616161", // Contextual color

    // Utility colors
    success: "#4CAF50", // Success
    danger: "#F44336", // Danger
    warning: "#ff9800", // Warning
    info: "#2196F3", // Info

    // Theme colors
    primary: "#ba68c8", // Primary
    secondary: "#c2185b", // Secondary
  },
  dark: {
    // Basic colors for dark mode
    context: "#a5a5a5", // Contextual color

    // Utility colors for dark mode
    success: "#0f5132", // Success
    danger: "#B71C1C", // Danger
    warning: "#ff9800", // Warning
    info: "#2196F3", // Info

    // Theme colors for dark mode
    primary: "#ba68c8", // Primary
    secondary: "#c2185b", // Secondary
  },
});

const myComponent = {
  base: {
    class: "button",
    style: "",
  },
  attrs: (props) => ({
    type: props.type ? props.type : "button",
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

const buildStyled = xkin.component(myComponent);

const Button = buildStyled({
  type: "submit",
  size: "sm",
  disabled: true,
  height: "40px",
});

const admin = xkin.control("#app");

console.log(Button);

setTimeout(() => {
  const active = Button.theme("active");
  const error = Button.theme("error");
  console.log(active);
  console.log(error);
}, 1000);

// Attribute to look for in elements
xkin.gui("x-attr", {
  button: "app",
});

// Control the specified elements
setInterval(() => {
  const error = Button.theme("error");
  xkin.$gui.button.toggle(...error.class.split(" "));
}, 1000);
