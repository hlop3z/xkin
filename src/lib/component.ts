import { objectToClass, objectToStyle } from "./utils";

/**
 * Configuration interface for styled components.
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
 */
export interface StyleResult {
  class: string;
  style: string;
  attrs: Record<string, any>;
  theme: (name?: string) => Partial<{ class: string; style: string }>;
}

/**
 * Creates a styled component instance.
 * @param config - The configuration object
 * @returns A function that initializes the styled component with given properties
 */
export function StyledComponent(config: StyleComponentConfig): (props?: any) => StyleResult {
  const component = new Style(config || {});
  return (props: any = {}) => component.start(props);
}

/**
 * Class representing a styled component configuration.
 */
export class Style {
  private config: Required<StyleComponentConfig>;

  /**
   * Creates a new Style instance
   * @param config - The styling configuration
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
   * Initializes the styled component with props
   * @param props - Properties to apply to the component
   * @returns The styled component result
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
   * Applies a theme to the component
   * @param name - The theme name to apply
   * @param props - Properties to apply to the component
   * @returns The themed component styles
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