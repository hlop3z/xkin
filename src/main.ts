/**
 * Utility function that converts an object to a CSS class string
 * @see "./lib/utils" for implementation details
 */
export { objectToClass as css } from "./lib/utils";

/**
 * Utility function that converts an object to inline style string
 * @see "./lib/utils" for implementation details
 */
export { objectToStyle as style } from "./lib/utils";

/**
 * Creates a blank form object
 * @see "./lib/utils" for implementation details
 */
export { blankForm as blank } from "./lib/utils";

/**
 * Creates styled components with CSS-in-JS capabilities
 * @see "./lib/component" for implementation details
 */
export { StyledComponent as component } from "./lib/component";

/**
 * Creates admin control elements
 * @see "./lib/element" for implementation details
 */
export { createAdmin as control } from "./lib/element";

/**
 * Query selector functions for attribute-based DOM element selection
 * @see "./lib/selector" for implementation details
 */
export { queryAttrSelector as get, queryAttrSelectorAll as find } from "./lib/selector";

/**
 * GUI creation utilities and global component registry
 * @see "./lib/gui" for implementation details
 */
export { createGUI as gui, globalComponents as $gui } from "./lib/gui";

/**
 * Memoization utilities to optimize performance
 * @see "./lib/memoize" for implementation details
 */
export { memoize, memoizeOne } from "./lib/memoize";

/**
 * Theme system for consistent styling
 * @see "./lib/theme" for implementation details
 */
export { default as theme } from "./lib/theme";

/**
 * Directive utilities for handling custom events.
 * @see "./lib/directives" for implementation details
 */
export { hover, clickOutside, swipe } from "./lib/directives";

/**
 * Layout utilities for component positioning and structure
 * @see "./lib/layout" for implementation details
 */
export { default as layout } from "./lib/layout";
