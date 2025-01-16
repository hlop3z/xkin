import objectToClass from "../class";
import objectToStyle from "../style";

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
      class: objectToClass([base.class, css.class]),
      style: objectToStyle([base.style, css.style]),
      attrs: attributes,
      theme: (name: string) => this.theme(name, props),
    };
  }

  theme(name?: string, props: any = {}) {
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

/**
 * Creates a styled component instance.
 * @param {object} config - The configuration object.
 * @returns {Function} - A function that initializes the styled component with given properties.
 */
function Styled(config: any): Function {
  const component = new StyledComponent(config || {});
  return (props: any) => component.start(props || {});
}

export default Styled;
