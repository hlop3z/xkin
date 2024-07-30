# Preact

Using **`xkin.component`** with Preact.

## Create Component

```jsx
import { useState } from "preact/hooks";

export default function Button(props) {
  const [count, setCount] = useState(0);
  const add = () => setCount((count) => count + 1);

  /**
   * @xkin
   */
  const css = Styled(props).theme(props.mode);

  return (
    <button type="button" onClick={add} class={css.class} style={css.style}>
      count is {count}
    </button>
  );
}

/**
 * @xkin
 */
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
```

## Use Component

```jsx
import { useState, useEffect } from "preact/hooks";

import CustomButton from "./components/Button";

export function App() {
  const [disabled, setDisabled] = useState(null);
  const [mode, setMode] = useState(null);

  useEffect(() => {
    const disabledInterval = setInterval(() => {
      setDisabled((prevDisabled) => !prevDisabled);
    }, 5000);

    const modeInterval = setInterval(() => {
      setMode((prevMode) => (prevMode === null ? "active" : null));
    }, 1000);

    // Clean up intervals on component unmount
    return () => {
      clearInterval(disabledInterval);
      clearInterval(modeInterval);
    };
  }, []);

  return (
    <>
      <CustomButton size="sm" height="40px" mode={mode} disabled={disabled} />
    </>
  );
}
```
