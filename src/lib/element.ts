import morphdom from "morphdom";

/**
 * @typedef {Object} ComponentContext
 * @property {HTMLElement} self - A reference to the component instance.
 * @property {any} [last] - The previous value (only available in watchers).
 * @property {any} [value] - The current value (only available in watchers).
 */
interface ComponentContext {
  self: HTMLElement;
  last?: any;
  value?: any;
}

interface ComponentDefinition {
  props?: Record<string, any>;
  data?: Record<string, any> | (() => Record<string, any>);
  watch?: Record<string, (context: ComponentContext) => void>;
  methods?: Record<string, (...args: any[]) => void>;
  html?: (context: Record<string, any>) => string;
  style?: (context: Record<string, any>) => string;
  mounted?: () => void;
  unmounted?: () => void;
  adopted?: () => void;
}

/**
 * Creates a reactive Web Component base class.
 *
 * @param {ComponentDefinition} definition - The component definition object.
 * @returns {CustomElementConstructor} The generated Web Component class.
 */
function createComponentBase(definition: ComponentDefinition): CustomElementConstructor {
  const {
    props = {},
    data = {},
    watch = {},
    methods = {},
    html = () => "",
    style,
    mounted,
    unmounted,
    adopted,
  }: any = definition;

  const observedAttributes = Object.keys(watch);

  return class extends HTMLElement {
    static get observedAttributes() {
      return observedAttributes;
    }

    private _watchers: Record<string, (context: ComponentContext) => void>;
    private _mounted = false;
    private _renderScheduled = false;
    private _data: Record<string, any> = {};
    private _props: Record<string, any> = {};

    constructor() {
      super();
      this.attachShadow({ mode: "open" });

      this._watchers = watch;
      this._data = typeof data === "function" ? data.call(this) : { ...data };

      for (const [key, def] of Object.entries(props)) {
        const isFunc = typeof def === "function";
        const isAsync = isFunc && def.constructor.name === "AsyncFunction";

        const initValue = this.hasAttribute(key)
          ? parseAttributeValue(this.getAttribute(key), def)
          : isFunc
            ? def.call(this)
            : def;

        this._props[key] = initValue;

        if (isAsync) {
          (def.call(this) as Promise<any>).then((res) => {
            this._props[key] = res;
            this._scheduleRender();
          });
        }
      }

      this._props = new Proxy(this._props, {
        set: (obj, prop: string, value) => {
          if (!(prop in obj)) return false;
          const prev = obj[prop];
          obj[prop] = value;
          if (this._mounted && this._watchers[prop]) {
            this._watchers[prop]({ self: this, last: prev, value });
          }
          this._scheduleRender();
          return true;
        },
      });

      for (const [name, fn] of Object.entries(methods) as [
        string,
        (context: Record<string, any>, ...args: any[]) => void,
      ][]) {
        (this as any)[name] = (...args: any[]) => fn({ ...this.data, self: this }, ...args);
      }
    }

    connectedCallback() {
      this._mounted = true;
      mounted?.call(this);
      this._renderComponent();
    }

    disconnectedCallback() {
      this._mounted = false;
      unmounted?.call(this);
    }

    adoptedCallback() {
      adopted?.call(this);
    }

    attributeChangedCallback(attr: string, oldVal: string | null, newVal: string | null) {
      if (oldVal === newVal) return;
      const propDef = props[attr];
      if (propDef !== undefined) {
        const prev = this._props[attr];
        this._props[attr] = parseAttributeValue(newVal, propDef);
        if (this._mounted && this._watchers[attr]) {
          this._watchers[attr]({ self: this, last: prev, value: this._props[attr] });
        }
        this._scheduleRender();
      }
    }

    get data(): Readonly<Record<string, any>> {
      return { ...this._data, ...this._props };
    }

    update(updates: Partial<Record<string, any>> = {}, render = true) {
      let hasChanged = false;
      for (const [key, val] of Object.entries(updates)) {
        if (this._props[key] !== val) {
          this._props[key] = val;
          hasChanged = true;
          if (observedAttributes.includes(key)) {
            this.setAttribute(key, val);
          }
        }
      }
      if (render && hasChanged) this._scheduleRender();
    }

    private _scheduleRender() {
      if (this._renderScheduled) return;
      this._renderScheduled = true;
      Promise.resolve().then(() => this._renderComponent());
    }

    private _renderComponent() {
      this._renderScheduled = false;
      const context = { ...this._data, ...this._props, self: this };
      const cssOutput = style ? `<style>${style.call(this, context)}</style>` : "";
      const htmlOutput = `${cssOutput}${html.call(this, context)}`;

      morphdom(this.shadowRoot as any, `<div>${htmlOutput}</div>`, {
        childrenOnly: true,
      });
    }
  };
}

function parseAttributeValue(val: string | null, def: any): any {
  if (val === null) return undefined;
  if (def === Number) return Number(val);
  if (def === Boolean) return val.toLowerCase() !== "false";
  if (def === Object || def === Array) {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val;
}

/**
 * Registers a Web Component with the given tag name and definition.
 * Ensures that the component is only registered once to prevent errors.
 *
 * @param {string} tag - The custom element tag name (e.g., 'my-component').
 * @param {ComponentDefinition} def - The component definition object (as described in {@link createComponentBase}).
 */
export default function createComponent(tag: string, def: ComponentDefinition) {
  if (!customElements.get(tag)) {
    customElements.define(tag, createComponentBase(def));
  } else {
    console.warn(`Component "${tag}" is already registered.`);
  }
}
