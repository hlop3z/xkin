import { isString } from "../../generic";

/**
 * Transforms a CSS object to a space-separated class string.
 * @param {any} input - The CSS object to transform.
 * @returns {string} - The space-separated class string.
 */
const objectToClass = (input: any): string => {
  if (isString(input)) {
    return input.trim();
  }

  if (Array.isArray(input)) {
    return input
      .filter((x) => x)
      .map(objectToClass)
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

export default objectToClass;
