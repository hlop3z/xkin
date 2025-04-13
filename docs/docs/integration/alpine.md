# Alpine.js Integration

XKin integrates elegantly with Alpine.js to provide powerful styling capabilities with minimal code. This guide demonstrates how to combine XKin's component system with Alpine's reactive attributes.

## Overview

Alpine.js is a minimal JavaScript framework for adding interactivity to your HTML with simple directives. XKin enhances Alpine applications by providing:

- Component-based styling with themes
- Centralized styling logic
- Reactive style updates based on state

## Basic Integration

The integration involves:
1. Creating XKin component definitions
2. Registering custom Alpine directives and magic methods
3. Using them in your HTML with Alpine's reactivity system

## Complete Example

### HTML Structure (`index.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>XKin + Alpine Integration</title>

  <!-- Alpine.js from CDN -->
  <script src="//unpkg.com/alpinejs" defer></script>
  <!-- XKin from CDN -->
  <script src="https://unpkg.com/xkin@latest"></script>
  <!-- Our custom integration -->
  <script src="./theme-integration.js" defer></script>
  
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .is-small {
      font-size: 0.875rem;
      padding: 6px 12px;
    }
    
    .is-large {
      font-size: 1.125rem;
      padding: 10px 20px;
    }
    
    .is-disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  </style>
</head>

<body>
  <h1>XKin + Alpine.js Demo</h1>
  
  <div x-data="{ 
    count: 0, 
    mode: null, 
    disabled: false,
    toggleMode() {
      this.mode = this.mode ? null : 'active';
    }
  }">
    <div class="control-panel">
      <h2>Counter: <span x-text="count"></span></h2>
      <div>
        <label>
          <input type="checkbox" x-model="disabled"> Disable button
        </label>
        <button @click="toggleMode()" x-text="mode ? 'Remove Theme' : 'Apply Theme'"></button>
      </div>
    </div>
    
    <div class="button-showcase">
      <button
        @click="count++"
        x-theme="$theme('button', mode, { 
          size: 'sm', 
          height: '40px', 
          disabled: disabled 
        })"
      >
        Increment Count
      </button>
    </div>
  </div>
</body>
</html>
```

### JavaScript Implementation (`theme-integration.js`)

```js
// Define our component library using XKin
const ComponentLibrary = {
  // Button component definition
  button: xkin.component({
    base: {
      class: "button",
      style: "outline: none; margin: 10px 0;",
    },
    setup: ({ size, disabled, height }) => ({
      class: {
        "is-small": size === "sm",
        "is-large": size === "lg",
        "is-disabled": disabled,
      },
      style: {
        height: height || "auto",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
    }),
    theme: {
      active: {
        class: "color-bg-success color-tx-white",
        style: "transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.15);",
      },
      error: {
        class: "color-bg-danger color-tx-white",
        style: "",
      },
      warning: {
        class: "color-bg-warning",
        style: "",
      },
    },
  }),

  // Add more components as needed
  card: xkin.component({
    // Card component definition...
  }),
};

// Configure XKin theme (optional)
xkin.theme.set({
  base: {
    success: "#38c172",
    danger: "#e3342f",
    warning: "#f6993f",
  },
});

// Wait for Alpine to initialize
document.addEventListener("alpine:init", () => {
  // Register a magic helper to create theme configurations
  Alpine.magic("theme", () => {
    return (componentName, themeName, props = {}) => ({
      name: componentName,
      theme: themeName,
      props: props,
    });
  });

  // Register the theme directive
  Alpine.directive("theme", (el, { expression }, { evaluateLater, effect }) => {
    // Create evaluator for the expression
    const getThemeData = evaluateLater(expression);
    
    // Set up reactive effect
    effect(() => {
      getThemeData((data) => {
        // Get the requested component
        const component = ComponentLibrary[data.name];
        
        if (!component) {
          console.warn(`XKin component "${data.name}" not found`);
          return;
        }
        
        // Generate styles with the current props and theme
        const styles = component(data.props).theme(data.theme);
        
        // Apply to the element
        el.className = styles.class;
        el.style = styles.style;
      });
    });
  });
});
```

## Advanced Usage

### Multiple Theme Components

```html
<div x-data="{ activeTab: 'home' }">
  <!-- Navigation tabs with different themes -->
  <div class="tabs">
    <button 
      @click="activeTab = 'home'"
      x-theme="$theme('tab', activeTab === 'home' ? 'active' : null, { size: 'sm' })"
    >
      Home
    </button>
    <button 
      @click="activeTab = 'profile'"
      x-theme="$theme('tab', activeTab === 'profile' ? 'active' : null, { size: 'sm' })"
    >
      Profile
    </button>
    <button 
      @click="activeTab = 'settings'"
      x-theme="$theme('tab', activeTab === 'settings' ? 'active' : null, { size: 'sm' })"
    >
      Settings
    </button>
  </div>
  
  <!-- Content panels -->
  <div x-show="activeTab === 'home'">Home content</div>
  <div x-show="activeTab === 'profile'">Profile content</div>
  <div x-show="activeTab === 'settings'">Settings content</div>
</div>
```

### Dynamically Switching Themes

```html
<div x-data="{ darkMode: false }">
  <button 
    @click="darkMode = !darkMode"
    x-theme="$theme('iconButton', null, {})"
  >
    <span x-show="darkMode">🌙</span>
    <span x-show="!darkMode">☀️</span>
  </button>
  
  <div x-theme="$theme('card', darkMode ? 'dark' : 'light', { 
    elevated: true, 
    padding: 'large' 
  })">
    <h2>Content Card</h2>
    <p>This card changes theme when dark mode is toggled.</p>
  </div>
</div>
```

## Performance Considerations

For optimal performance when using XKin with Alpine:

1. Define your components outside the Alpine initialization to avoid recreating them
2. Use `xkin.memoizeOne` for expensive style calculations
3. For lists or repeated components, define the component once and reuse it

```js
// Optimize component for better performance
const optimizedButton = xkin.component({
  // ...component definition
  setup: xkin.memoizeOne(props => ({
    // Complex styling logic here
  }))
});

// Add to your component library
ComponentLibrary.optimizedButton = optimizedButton;
```

## Integration with Alpine Plugins

XKin works seamlessly with Alpine plugins like Alpine Focus, Intersect, and Collapse:

```html
<div 
  x-data="{ visible: false }" 
  x-intersect="visible = true"
  x-theme="$theme('reveal', visible ? 'visible' : 'hidden', { 
    delay: '0.3s'
  })"
>
  This content will be styled when it enters the viewport
</div>
```
