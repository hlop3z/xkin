const isString = (val: any): val is string =>
  typeof val === "string" || val instanceof String;

/**
 * Transforms a CSS object to a space-separated class string.
 * @param {any} input - The CSS object to transform.
 * @returns {string} - The space-separated class string.
 */
export const objectToClass = (input: any): string => {
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

/**
 * Transforms a CSS object to a style string.
 * @param {any} input - The CSS object to transform.
 * @returns {string} - The style string.
 */
export const objectToStyle = (input: any): string => {
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

/**
 * Creates a new object by executing functions in the input object and storing their results.
 * @param {object} obj - The input object.
 * @returns {object} - The new object with the executed function results.
 */
export function blankForm(obj: { [key: string]: any }): object {
  const newObj: { [key: string]: any } = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
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
 * Class representing a styled component configuration.
 */
class StyledComponent {
  config: any;
  constructor(config: any = {}) {
    const blank = () => ({ class: "", style: "" });

    this.config = {
      base: {
        ...blank(),
        ...config.base,
      },
      setup: config.setup || blank,
      attrs: config.attrs || (() => ({})),
      theme: config.theme || {},
    };
  }

  start(props = {}) {
    const { base, attrs, setup } = this.config;
    const attributes = attrs(props);
    const css = setup(props);

    return {
      attrs: attributes,
      class: objectToClass([base.class, css.class]),
      style: objectToStyle([base.style, css.style]),
      theme: (name: string) => this.theme(name, props),
    };
  }

  theme(name: string, props: any = {}) {
    const { theme, base, setup } = this.config;
    const themeConfig = theme[name];

    if (themeConfig) {
      const css = setup(props);

      return {
        class: objectToClass([base.class, css.class, themeConfig.class]),
        style: objectToStyle([base.style, css.style, themeConfig.style]),
      };
    } else {
      console.warn(`Theme "${name}" is not defined.`);
      return {};
    }
  }
}

/**
 * Creates a styled component instance.
 * @param {object} config - The configuration object.
 * @returns {Function} - A function that initializes the styled component with given properties.
 */
export function Styled(config: any): Function {
  const component = new StyledComponent(config || {});
  return (props: any) => component.start(props || {});
}
