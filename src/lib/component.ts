import { objectToClass, objectToStyle } from "./utils";

/**
 * Configuration interface for styled components.
 * Defines the base styling, dynamic styling, attribute handling, and theme options.
 * 
 * @interface StyleComponentConfig
 * @property {object} [base] - Base styling that's applied to all instances
 * @property {string} [base.class] - Base CSS classes
 * @property {string} [base.style] - Base inline styles
 * @property {function} [setup] - Function to dynamically generate styling based on props
 * @property {function} [attrs] - Function to generate additional attributes based on props
 * @property {object} [theme] - Collection of named theme variations
 */
export interface StyleComponentConfig {
  base?: {
    class?: string;
    style?: string;
  };
  setup?: (props: any) => { class?: string; style?: string };
  attrs?: (props: any) => Record<string, any>;
  theme?: Record<string, { class?: string; style?: string }>;
}

/**
 * Result of styling a component.
 * Contains processed classes, styles, attributes, and a theme accessor function.
 * 
 * @interface StyleResult
 * @property {string} class - Combined CSS classes
 * @property {string} style - Combined inline styles
 * @property {Record<string, any>} attrs - HTML attributes to apply
 * @property {function} theme - Function to access themed variations
 */
export interface StyleResult {
  class: string;
  style: string;
  attrs: Record<string, any>;
  theme: (name?: string) => Partial<{ class: string; style: string }>;
}

/**
 * Creates a styled component instance that can be initialized with properties.
 * 
 * @example
 * ```ts
 * const Button = StyledComponent({
 *   base: {
 *     class: 'btn',
 *     style: 'cursor: pointer;'
 *   },
 *   setup: (props) => ({
 *     class: props.primary ? 'btn-primary' : 'btn-secondary'
 *   }),
 *   theme: {
 *     large: { class: 'btn-lg' },
 *     small: { class: 'btn-sm' }
 *   }
 * });
 * 
 * // Use the component
 * const btnStyle = Button({ primary: true });
 * console.log(btnStyle.class); // 'btn btn-primary'
 * 
 * // Apply a theme
 * const themedBtn = btnStyle.theme('large');
 * console.log(themedBtn.class); // 'btn btn-primary btn-lg'
 * ```
 * 
 * @param {StyleComponentConfig} config - The configuration object
 * @returns {Function} A function that initializes the styled component with given properties
 */
export function StyledComponent(config: StyleComponentConfig): (props?: any) => StyleResult {
  const component = new Style(config || {});
  return (props: any = {}) => component.start(props);
}

/**
 * Class representing a styled component configuration.
 * Handles the internal logic for applying styles, themes, and attributes.
 */
export class Style {
  /**
   * The normalized configuration with all optional properties filled in with defaults
   * @private
   */
  private config: Required<StyleComponentConfig>;

  /**
   * Creates a new Style instance with the provided configuration
   * 
   * @param {StyleComponentConfig} config - The styling configuration
   */
  constructor(config: StyleComponentConfig = {}) {
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

  /**
   * Initializes the styled component with the provided props
   * 
   * @param {any} props - Properties to apply to the component
   * @returns {StyleResult} The complete styled component result
   */
  start(props: any = {}): StyleResult {
    const { base, attrs, setup } = this.config;
    const attributes = attrs(props);
    const css = setup(props);

    return {
      class: objectToClass([base.class, css.class]),
      style: objectToStyle([base.style, css.style]),
      attrs: attributes,
      theme: (name?: string) => this.theme(name, props),
    };
  }

  /**
   * Applies a theme to the component by merging theme styles with base styles
   * 
   * @param {string} [name] - The theme name to apply
   * @param {any} [props={}] - Properties to apply to the component
   * @returns {Partial<{ class: string; style: string }>} The themed component styles
   */
  theme(name?: string, props: any = {}): Partial<{ class: string; style: string }> {
    const { theme, base, setup } = this.config;
    const css = setup(props);

    if (!name) {
      return {
        class: objectToClass([base.class, css.class]),
        style: objectToStyle([base.style, css.style]),
      };
    }

    const themeConfig = theme[name];

    if (themeConfig) {
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