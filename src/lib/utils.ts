import { memoize } from "./memoize";

/**
 * Type guard to check if a value is a string.
 * @param val - The value to check
 * @returns True if the value is a string, false otherwise
 */
export const isString = (val: unknown): val is string =>
  typeof val === "string" || val instanceof String;

/**
 * Represents an object with string keys and any values.
 */
export interface GenericObject {
  [key: string]: any;
}

/**
 * Creates a new object by executing functions in the input object and storing their results.
 * @param obj - The input object
 * @returns A new object with the executed function results
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
 */
export type ClassInput = string | Array<any> | Record<string, boolean> | null | undefined;

/**
 * Transforms a CSS object to a space-separated class string.
 * @param input - The CSS object to transform
 * @returns The space-separated class string
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

// Memoized version for performance
export const objectToClass = memoize(_objectToClass);

/**
 * CSS style input type that can be a string, array, or object with string values.
 */
export type StyleInput = string | Array<any> | Record<string, string> | null | undefined;

/**
 * Transforms a CSS object to a style string.
 * @param input - The CSS object to transform
 * @returns The style string
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

// Memoized version for performance
export const objectToStyle = memoize(_objectToStyle);
