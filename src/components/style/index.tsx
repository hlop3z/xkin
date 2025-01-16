import { isString } from "../../generic";

/**
 * Transforms a CSS object to a style string.
 * @param {any} input - The CSS object to transform.
 * @returns {string} - The style string.
 */
const objectToStyle = (input: any): string => {
  if (isString(input)) {
    return (input.trim() + ";").replace(/;{1,}$/, ";");
  }

  if (Array.isArray(input)) {
    return input
      .filter((x) => x)
      .map(objectToStyle)
      .join(" ")
      .trim();
  }

  if (typeof input === "object" && input !== null) {
    return Object.entries(input)
      .map(([key, value]) => (value ? `${key}: ${value};` : ""))
      .join(" ")
      .trim();
  }

  return "";
};

export default objectToStyle;
