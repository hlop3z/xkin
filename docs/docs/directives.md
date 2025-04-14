# Directives

Provides a set of utility directives for handling common user interactions like swipe gestures, clicks outside elements, and hover events. These directives make it easy to create interactive interfaces without writing complex event handling code.

## Overview

The directives system offers:

- Clean, functional API for event handling
- Automatic cleanup functions for proper memory management
- Support for touch and mouse events
- Easy integration with any JavaScript framework or vanilla JS

## Available Directives

### Swipe Detection

The `swipe` directive detects touch swipe gestures and reports the direction.

```js
xkin.swipe(element, callback, threshold);
```

#### Parameters

| Parameter  | Type       | Description                                             | Default |
|------------|------------|---------------------------------------------------------|---------|
| `element`  | HTMLElement | The DOM element to detect swipes on                    | Required |
| `callback` | Function   | Callback receiving the direction: "left", "right", "up", or "down" | Required |
| `threshold`| Number     | Minimum swipe distance in pixels to trigger detection   | 50 |

#### Returns

A cleanup function that removes the event listeners when called.

#### Example

```js
// Detect swipes on a sidebar element
const sidebar = document.querySelector('.sidebar');

const cleanup = xkin.swipe(sidebar, (direction) => {
  if (direction === 'left') {
    // User swiped left, close the sidebar
    sidebar.classList.remove('open');
  } else if (direction === 'right') {
    // User swiped right, open the sidebar
    sidebar.classList.add('open');
  }
}, 75); // Custom threshold (75px)

// Later, when component unmounts or is no longer needed
cleanup();
```

### Click Outside

The `clickOutside` directive detects clicks that happen outside a specified element, useful for closing menus, modals, and dropdowns.

```js
xkin.clickOutside(element, callback);
```

#### Parameters

| Parameter  | Type       | Description                                             |
|------------|------------|---------------------------------------------------------|
| `element`  | HTMLElement | The DOM element to watch for outside clicks           |
| `callback` | Function   | Callback function that receives the mouse event         |

#### Returns

A cleanup function that removes the event listeners when called.

#### Example

```js
// Close dropdown when user clicks outside
const dropdown = document.querySelector('.dropdown');
const toggleButton = document.querySelector('.dropdown-toggle');

// Show dropdown when button is clicked
toggleButton.addEventListener('click', () => {
  dropdown.classList.add('active');
  
  // Set up the outside click detection
  const cleanup = xkin.clickOutside(dropdown, () => {
    dropdown.classList.remove('active');
    cleanup(); // Remove the listener once dropdown is closed
  });
});
```

### Hover Detection

The `hover` directive provides a simple way to detect when a user hovers over or leaves an element.

```js
xkin.hover(element, callback);
```

#### Parameters

| Parameter  | Type       | Description                                             |
|------------|------------|---------------------------------------------------------|
| `element`  | HTMLElement | The DOM element to detect hover on                    |
| `callback` | Function   | Callback with parameters (isHovering, event)           |

#### Returns

A cleanup function that removes the event listeners when called.

#### Example

```js
// Add hover effects to a button
const button = document.querySelector('.feature-button');

const cleanup = xkin.hover(button, (isHovering) => {
  if (isHovering) {
    button.classList.add('hover');
    // Maybe show tooltip or change button appearance
  } else {
    button.classList.remove('hover');
    // Hide tooltip or revert appearance changes
  }
});

// Remove hover detection when no longer needed
cleanup();
```

## Framework Integration

### React

```jsx
import { useEffect, useRef } from 'react';
import { swipe, clickOutside, hover } from 'xkin';

function Sidebar() {
  const sidebarRef = useRef(null);
  
  useEffect(() => {
    if (!sidebarRef.current) return;
    
    // Set up swipe detection
    const cleanupSwipe = swipe(sidebarRef.current, (direction) => {
      console.log(`Swiped ${direction}`);
    });
    
    // Clean up on unmount
    return () => {
      cleanupSwipe();
    };
  }, []);
  
  return <div ref={sidebarRef} className="sidebar">Sidebar content</div>;
}
```

### Vue

```vue
<template>
  <div ref="sidebar" class="sidebar">Sidebar content</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { swipe } from 'xkin';

const sidebar = ref(null);
let cleanup = null;

onMounted(() => {
  if (sidebar.value) {
    cleanup = swipe(sidebar.value, (direction) => {
      console.log(`Swiped ${direction}`);
    });
  }
});

onUnmounted(() => {
  if (cleanup) cleanup();
});
</script>
```

### Alpine.js

```html
<div
  x-data="{ isOpen: false }"
  x-init="
    () => {
      const cleanup = xkin.swipe($el, (dir) => {
        if (dir === 'left') isOpen = false;
        if (dir === 'right') isOpen = true;
      });
      
      // Clean up on element removal
      $cleanup = cleanup;
    }
  "
  class="sidebar"
  :class="{ 'open': isOpen }"
>
  Sidebar content
</div>
```

## Advanced Usage

### Combining Directives

```js
const modal = document.querySelector('.modal');
const modalContent = modal.querySelector('.modal-content');

// Show modal
function openModal() {
  modal.classList.add('visible');
  
  // Set up outside click to close
  const outsideClickCleanup = xkin.clickOutside(modalContent, () => {
    closeModal();
    outsideClickCleanup();
  });
  
  // Set up escape key to close
  const escKeyHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escKeyHandler);
    }
  };
  document.addEventListener('keydown', escKeyHandler);
}

function closeModal() {
  modal.classList.remove('visible');
}
```

### Custom Swipe Thresholds

Adjust the threshold based on device or element size:

```js
// Use different thresholds for different devices
const isMobile = window.innerWidth < 768;
const threshold = isMobile ? 30 : 70;

xkin.swipe(element, handleSwipe, threshold);

// Or adjust dynamically based on element size
function setupSwipe(element) {
  // Use 20% of element width as threshold
  const threshold = element.offsetWidth * 0.2;
  return xkin.swipe(element, handleSwipe, threshold);
}
```

