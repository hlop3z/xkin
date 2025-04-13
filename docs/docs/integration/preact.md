# Preact Integration

XKin works seamlessly with Preact, allowing you to create styled components with minimal overhead. This integration provides a lightweight solution for styling Preact applications without large CSS-in-JS dependencies.

## Overview

Preact is a fast 3kB alternative to React with the same modern API. XKin complements Preact's minimal approach by providing:

- Component-based styling with themes
- Conditional styling based on props
- Minimal bundle size impact
- No runtime style injection overhead

## Basic Component Example

Here's a simple button component that uses XKin for styling:

```jsx
import { useState } from "preact/hooks";

/**
 * Button component styling definition
 */
const ButtonStyle = xkin.component({
  base: {
    class: "button",
    style: "border: none; border-radius: 4px; cursor: pointer; transition: all 0.2s;"
  },
  
  setup: ({ size, disabled, height }) => ({
    class: {
      "button-sm": size === "sm",
      "button-lg": size === "lg",
      "button-disabled": disabled
    },
    style: {
      height: height || "auto",
      opacity: disabled ? 0.7 : 1,
      pointerEvents: disabled ? "none" : "auto",
      padding: size === "sm" ? "6px 12px" : size === "lg" ? "12px 24px" : "8px 16px",
      fontSize: size === "sm" ? "0.875rem" : size === "lg" ? "1.125rem" : "1rem"
    }
  }),
  
  theme: {
    primary: {
      class: "color-bg-primary color-tx-white",
      style: "box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);"
    },
    secondary: {
      class: "color-bg-secondary color-tx-white",
      style: "box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);"
    },
    danger: {
      class: "color-bg-danger color-tx-white",
      style: "box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);"
    }
  }
});

/**
 * Button component that uses XKin for styling
 */
export function Button(props) {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1);
    if (props.onClick) props.onClick();
  };

  // Generate styles from props
  const styles = ButtonStyle(props).theme(props.mode);

  return (
    <button
      type={props.type || "button"}
      onClick={handleClick}
      class={styles.class}
      style={styles.style}
      disabled={props.disabled}
    >
      {props.children || `Count: ${count}`}
    </button>
  );
}
```

## Using the Component

```jsx
import { useState, useEffect } from "preact/hooks";
import { Button } from "./components/Button";

export function App() {
  // State for component props
  const [disabled, setDisabled] = useState(false);
  const [mode, setMode] = useState("primary");

  // Toggle disabled state every 5 seconds
  useEffect(() => {
    const disabledInterval = setInterval(() => {
      setDisabled(prev => !prev);
    }, 5000);

    // Clean up on unmount
    return () => clearInterval(disabledInterval);
  }, []);

  // Cycle through themes every second
  useEffect(() => {
    const themes = ["primary", "secondary", "danger", null];
    let currentIndex = 0;
    
    const themeInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % themes.length;
      setMode(themes[currentIndex]);
    }, 1000);

    return () => clearInterval(themeInterval);
  }, []);

  return (
    <div class="container">
      <h1>XKin + Preact Demo</h1>
      
      <div class="button-container">
        <Button 
          size="sm" 
          mode={mode} 
          disabled={disabled}
          onClick={() => console.log("Button clicked!")}
        >
          Small Button
        </Button>
        
        <Button mode={mode} disabled={disabled}>
          Default Button
        </Button>
        
        <Button size="lg" mode={mode} disabled={disabled}>
          Large Button
        </Button>
      </div>
      
      <div class="status">
        <p>Current Theme: <strong>{mode || "none"}</strong></p>
        <p>Disabled: <strong>{disabled ? "Yes" : "No"}</strong></p>
      </div>
    </div>
  );
}
```

## Advanced Patterns

### Creating a Higher-Order Component

You can create a higher-order component (HOC) to apply XKin styling to any component:

```jsx
/**
 * HOC that applies XKin styling to any component
 */
export function withXkinStyle(Component, styleConfig) {
  // Create the XKin component once
  const xkinComponent = xkin.component(styleConfig);
  
  // Return a new component that applies the styling
  return function StyledComponent(props) {
    // Generate styles from props
    const styles = xkinComponent(props).theme(props.theme);
    
    // Apply styles to the wrapped component
    return <Component {...props} class={styles.class} style={styles.style} />;
  };
}

// Usage example
const styleConfig = {
  base: { class: "card", style: "border-radius: 8px;" },
  setup: ({ elevated }) => ({
    style: elevated ? "box-shadow: 0 8px 16px rgba(0,0,0,0.1);" : ""
  }),
  theme: {
    dark: { class: "color-bg-dark color-tx-white" }
  }
};

// Create a styled div
const Card = withXkinStyle("div", styleConfig);

// Use the styled component
function MyComponent() {
  return (
    <Card elevated theme="dark">
      <h2>Card Title</h2>
      <p>Card content goes here</p>
    </Card>
  );
}
```

### Creating a Custom Hook

For more flexibility, you can create a custom hook to use XKin styling:

```jsx
/**
 * Custom hook for XKin styling
 */
function useXkinStyle(styleConfig, props) {
  // Memoize the component to prevent recreation
  const component = useMemo(() => xkin.component(styleConfig), []);
  
  // Generate and memoize styles
  const styles = useMemo(() => {
    return component(props).theme(props.theme);
  }, [props, props.theme]);
  
  return styles;
}

// Usage in a component
function Card({ children, elevated, theme }) {
  const styleConfig = {
    base: { class: "card", style: "border-radius: 8px;" },
    setup: ({ elevated }) => ({
      style: elevated ? "box-shadow: 0 8px 16px rgba(0,0,0,0.1);" : ""
    }),
    theme: {
      dark: { class: "color-bg-dark color-tx-white" }
    }
  };
  
  const styles = useXkinStyle(styleConfig, { elevated, theme });
  
  return (
    <div class={styles.class} style={styles.style}>
      {children}
    </div>
  );
}
```

## Performance Optimization

To optimize XKin with Preact:

1. Define component styles outside of the render function to prevent recreation
2. Use `xkin.memoize` or `xkin.memoizeOne` for complex style calculations
3. Use Preact's `useMemo` to memoize style generation
4. For lists of items, create the component style definition once and reuse it

```jsx
// Define once outside any component
const ListItemStyle = xkin.component({
  base: { class: "list-item" },
  setup: xkin.memoizeOne(props => ({
    class: {
      "list-item-active": props.active,
      "list-item-selected": props.selected
    }
  }))
});

// Inside your component
function ListView({ items }) {
  return (
    <ul>
      {items.map(item => {
        const styles = ListItemStyle({ 
          active: item.isActive,
          selected: item.isSelected
        });
        
        return (
          <li key={item.id} class={styles.class}>
            {item.text}
          </li>
        );
      })}
    </ul>
  );
}
```

## Integration with Preact Signals

XKin works well with Preact Signals for reactive styling:

```jsx
import { signal } from "@preact/signals";

// Create signals for theme state
const themeMode = signal("light");
const accentColor = signal("primary");

// Component using signals for styling
function ThemedButton({ children, ...props }) {
  const buttonStyle = xkin.component({
    // Style definition...
  });
  
  // Effect that updates when signals change
  useEffect(() => {
    // Handle theme changes
  }, [themeMode.value, accentColor.value]);
  
  const styles = buttonStyle(props).theme(accentColor.value);
  
  return (
    <button class={styles.class} style={styles.style}>
      {children}
    </button>
  );
}
```
