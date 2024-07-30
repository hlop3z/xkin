import { useState } from "preact/hooks";

export default function Button(props) {
  const [count, setCount] = useState(0);

  const css = Styled(props).theme(props.mode);

  return (
    <button
      class={css.class}
      style={css.style}
      onClick={() => setCount((count) => count + 1)}
    >
      count is {count}
    </button>
  );
}

const Styled = xkin.component({
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
