# React Integration

XKin provides a lightweight styling solution for React applications that avoids the overhead of larger CSS-in-JS libraries. This guide demonstrates how to integrate XKin's component system with React to create flexible, themed components.

## Overview

React is the most popular JavaScript library for building user interfaces. XKin enhances React applications with:

- Component-based styling with minimal overhead
- Efficient theme management
- Dynamic styling based on props and state
- No runtime CSS injection (styles are pre-calculated)
- Excellent performance for both SSR and CSR apps

## Basic Component Example

Here's a simple button component using XKin for styling:

```jsx
import React, { useState } from "react";

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
      className={styles.class}
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
import React, { useState, useEffect } from "react";
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
    <div className="container">
      <h1>XKin + React Demo</h1>
      
      <div className="button-container">
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
      
      <div className="status">
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
import React from "react";

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
    return <Component {...props} className={styles.class} style={styles.style} />;
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
import React, { useMemo } from "react";

/**
 * Custom hook for XKin styling
 */
function useXkinStyle(styleConfig, props) {
  // Memoize the component to prevent recreation
  const component = useMemo(() => xkin.component(styleConfig), []);
  
  // Generate and memoize styles
  const styles = useMemo(() => {
    return component(props).theme(props.theme);
  }, [props, props.theme, component]);
  
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
    <div className={styles.class} style={styles.style}>
      {children}
    </div>
  );
}
```

### Creating a Theme Context

React's Context API can be used to manage themes across your application:

```jsx
import React, { createContext, useContext, useState, useMemo } from "react";

// Create a context for theme management
const ThemeContext = createContext();

// Theme provider component
export function ThemeProvider({ children, initialTheme = "light" }) {
  const [theme, setTheme] = useState(initialTheme);
  
  // Memoize the context value to prevent unnecessary renders
  const contextValue = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme: () => setTheme(current => current === "light" ? "dark" : "light")
  }), [theme]);
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Usage in a component
function ThemedButton({ children, ...props }) {
  const { theme, toggleTheme } = useTheme();
  
  const buttonStyle = xkin.component({
    // Style definition...
  });
  
  const styles = buttonStyle(props).theme(theme);
  
  return (
    <button 
      className={styles.class} 
      style={styles.style}
      onClick={toggleTheme}
    >
      {children}
    </button>
  );
}

// App with theme provider
function App() {
  return (
    <ThemeProvider initialTheme="light">
      <div className="app">
        <ThemedButton>Toggle Theme</ThemedButton>
      </div>
    </ThemeProvider>
  );
}
```

## Performance Optimization

React applications can benefit from several XKin optimization techniques:

1. Define component styles outside of the render function to prevent recreation
2. Use `React.memo` for components that use XKin styling
3. Use `useMemo` to memoize style generation
4. Use `xkin.memoizeOne` for complex style calculations
5. For lists, define style configurations outside the component

```jsx
import React, { useMemo, memo } from "react";

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

// Memoized list item component
const ListItem = memo(function ListItem({ item }) {
  const styles = ListItemStyle({ 
    active: item.isActive,
    selected: item.isSelected
  });
  
  return (
    <li className={styles.class}>
      {item.text}
    </li>
  );
});

// List component with optimized rendering
function ListView({ items }) {
  return (
    <ul>
      {items.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
```

## Server-Side Rendering (SSR)

XKin works well with server-side rendering in Next.js or other React SSR frameworks:

```jsx
// pages/index.js in a Next.js app
import React from "react";
import { Button } from "../components/Button";

// This component will be rendered on the server first
export default function HomePage() {
  return (
    <div className="container">
      <h1>Welcome to XKin + Next.js</h1>
      
      <Button 
        size="lg" 
        mode="primary" 
      >
        Get Started
      </Button>
    </div>
  );
}
```

Since XKin generates static class names and styles without runtime injection, it works seamlessly with SSR without hydration mismatches.

## Integration with Other React Libraries

### React Router

```jsx
import React from "react";
import { Link } from "react-router-dom";

const LinkStyle = xkin.component({
  base: {
    class: "nav-link",
    style: "text-decoration: none; padding: 8px 16px;"
  },
  setup: ({ active }) => ({
    class: {
      "nav-link-active": active
    },
    style: {
      fontWeight: active ? "bold" : "normal"
    }
  })
});

// Custom link component with XKin styling
function StyledLink({ to, children, ...props }) {
  // Check if this link is active
  const active = window.location.pathname === to;
  
  // Generate styles
  const styles = LinkStyle({ active }).theme(props.theme);
  
  return (
    <Link 
      to={to} 
      className={styles.class}
      style={styles.style}
    >
      {children}
    </Link>
  );
}
```

### React Hook Form

```jsx
import React from "react";
import { useForm } from "react-hook-form";

// Form input styling
const InputStyle = xkin.component({
  base: {
    class: "form-input",
    style: "padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 100%;"
  },
  setup: ({ error }) => ({
    class: {
      "form-input-error": error
    },
    style: {
      borderColor: error ? "#dc3545" : undefined
    }
  })
});

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = data => console.log(data);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label>Email</label>
        <input
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          className={InputStyle({ error: errors.email }).class}
          style={InputStyle({ error: errors.email }).style}
        />
        {errors.email && <span className="error">Valid email is required</span>}
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
}
``` 