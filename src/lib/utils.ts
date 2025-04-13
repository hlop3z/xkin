import { memoize } from "./memoize";

/**
 * Type guard to check if a value is a string.
 * Useful for safely working with values that might be strings.
 * 
 * @example
 * ```ts
 * if (isString(value)) {
 *   // TypeScript knows value is a string in this block
 *   return value.toLowerCase();
 * }
 * ```
 * 
 * @param val - The value to check
 * @returns True if the value is a string, false otherwise
 */
export const isString = (val: unknown): val is string =>
  typeof val === "string" || val instanceof String;

/**
 * Represents an object with string keys and any values.
 * Used as a generic type for objects with unknown structure.
 * 
 * @interface GenericObject
 */
export interface GenericObject {
  [key: string]: any;
}

/**
 * Creates a new object by executing functions in the input object and storing their results.
 * Useful for initializing objects with dynamic default values.
 * 
 * @example
 * ```ts
 * const formTemplate = {
 *   username: '',
 *   email: '',
 *   created: () => new Date(),
 *   id: () => Math.random().toString(36).substring(2)
 * };
 * 
 * const newForm = blankForm(formTemplate);
 * // Result: { username: '', email: '', created: [Date object], id: 'random string' }
 * ```
 * 
 * @param {GenericObject} obj - The input object with potential function values
 * @returns {GenericObject} A new object with the executed function results
 */
export function blankForm(obj: GenericObject): GenericObject {
  const newObj: GenericObject = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (typeof value === "function") {
        newObj[key] = value(); // Execute the function and store the result
      } else {
        newObj[key] = value; // Copy non-function values as-is
      }
    }
  }

  return newObj;
}

/**
 * CSS class input type that can be a string, array of strings, or object with boolean values.
 * Represents the different ways to specify CSS classes.
 * 
 * @example
 * // String format
 * const classes1: ClassInput = "btn primary";
 * 
 * // Array format
 * const classes2: ClassInput = ["btn", condition && "primary"];
 * 
 * // Object format
 * const classes3: ClassInput = { 
 *   btn: true, 
 *   primary: isActive, 
 *   disabled: !isEnabled 
 * };
 */
export type ClassInput = string | Array<any> | Record<string, boolean> | null | undefined;

/**
 * Transforms a CSS object to a space-separated class string.
 * Handles various input formats (string, array, object) consistently.
 * 
 * @param {ClassInput} input - The CSS object to transform
 * @returns {string} The space-separated class string
 */
export const _objectToClass = (input: ClassInput): string => {
  if (isString(input)) {
    return input.trim();
  }

  if (Array.isArray(input)) {
    return input
      .filter(Boolean)
      .map(_objectToClass)
      .join(" ")
      .trim();
  }

  if (typeof input === "object" && input !== null) {
    return Object.keys(input)
      .filter((key) => input[key])
      .join(" ")
      .trim();
  }

  return "";
};

/**
 * Memoized version of the _objectToClass function for performance optimization.
 * Avoids redundant processing of the same inputs by caching results.
 * 
 * @example
 * ```ts
 * // Object syntax with conditional classes
 * const classes = objectToClass({
 *   button: true,
 *   primary: isPrimary,
 *   large: size === 'large',
 *   disabled: !isEnabled
 * });
 * 
 * // Result if isPrimary=true, size='large', isEnabled=false
 * // "button primary large disabled"
 * ```
 */
export const objectToClass = memoize(_objectToClass);

/**
 * CSS style input type that can be a string, array, or object with string values.
 * Represents the different ways to specify inline styles.
 * 
 * @example
 * // String format
 * const style1: StyleInput = "color: red; font-size: 16px;";
 * 
 * // Array format
 * const style2: StyleInput = [
 *   "color: red;",
 *   isLarge && "font-size: 16px;"
 * ];
 * 
 * // Object format
 * const style3: StyleInput = {
 *   color: isError ? 'red' : 'black',
 *   fontSize: '16px'
 * };
 */
export type StyleInput = string | Array<any> | Record<string, string> | null | undefined;

/**
 * Transforms a CSS object to a style string.
 * Handles various input formats (string, array, object) consistently.
 * 
 * @param {StyleInput} input - The CSS object to transform
 * @returns {string} The properly formatted style string
 */
export const _objectToStyle = (input: StyleInput): string => {
  if (isString(input)) {
    return (input.trim() + ";").replace(/;{1,}$/, ";");
  }

  if (Array.isArray(input)) {
    return input
      .filter(Boolean)
      .map(_objectToStyle)
      .join(" ")
      .trim();
  }

  if (typeof input === "object" && input !== null) {
    return Object.entries(input)
      .map(([key, value]) => (value ? `${key}: ${value};` : ""))
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  return "";
};

/**
 * Memoized version of the _objectToStyle function for performance optimization.
 * Avoids redundant processing of the same inputs by caching results.
 * 
 * @example
 * ```ts
 * // Object syntax for inline styles
 * const style = objectToStyle({
 *   color: isError ? 'red' : 'blue',
 *   fontSize: '16px',
 *   fontWeight: isBold ? 'bold' : 'normal'
 * });
 * 
 * // Result if isError=true, isBold=true
 * // "color: red; fontSize: 16px; fontWeight: bold;"
 * ```
 */
export const objectToStyle = memoize(_objectToStyle);
