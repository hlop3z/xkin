import { Styled } from "./styling";

const isString = (val: any) => typeof val === "string" || val instanceof String;

/**
 * Represents a reference with admin capabilities.
 */
interface RefAdmin {
  current: HTMLElement;
  contains(className: string): boolean;
  find(query: string): RefAdmin[];
  get(query: string): RefAdmin | null;
  add(...args: string[]): void;
  remove(...args: string[]): void;
  toggle(...args: string[]): void;
  __add(...args: string[]): void;
  __remove(...args: string[]): void;
  __toggle(args: string[]): void;
  __dict__: { display: string };
  hide(): void;
  show(): void;
  css(args: any): void;
  theme(args: any): void;
}

/**
 * Factory function for creating a RefAdmin object with element admin capabilities.
 * @param refAdmin - The HTMLElement to create the RefAdmin for.
 * @returns {RefAdmin} - The RefAdmin object.
 */
function elementAdmin(refAdmin: HTMLElement): RefAdmin {
  const self: RefAdmin = {
    get current() {
      return refAdmin;
    },
    contains(className: string) {
      return this.current?.classList.contains(className) || false;
    },
    find(query: string) {
      const elems = this.current?.querySelectorAll(query) || [];
      return Array.from(elems).map((el) => elementAdmin(el as HTMLElement));
    },
    get(query: string) {
      const el = this.current?.querySelector(query);
      return el ? elementAdmin(el as HTMLElement) : null;
    },
    add(...classNames: string[]) {
      this.__add(...classNames);
    },
    remove(...classNames: string[]) {
      this.__remove(...classNames);
    },
    toggle(...classNames: string[]) {
      this.__toggle(classNames);
    },
    __add(...classNames: string[]) {
      classNames.forEach((className) => {
        this.current?.classList.add(className);
      });
    },
    __remove(...classNames: string[]) {
      classNames.forEach((className) => {
        this.current?.classList.remove(className);
      });
    },
    __toggle(classNames: string[]) {
      classNames.forEach((className) => {
        this.current?.classList.toggle(className);
      });
    },
    __dict__: {
      display: refAdmin.style.display,
    },
    hide() {
      this.current.style.display = "none";
    },
    show() {
      this.current.style.display =
        this.__dict__.display !== "none" ? this.__dict__.display : "";
    },
    get theme() {
      // @ts-ignore
      return this.current.__xkin__;
    },
    css(props: any) {
      // @ts-ignore
      const args = props || {};
      const config = {
        theme: args,
        base: {
          class: this.current.className,
          style: this.current.getAttribute("style"),
        },
      };
      const component = Styled(config)({});
      const method = (name: string, setter: boolean = true) => {
        const admin = component.theme(name);
        if (setter) {
          const current = {
            class: this.current.className,
            style: this.current.getAttribute("style"),
          };
          if (current.class !== admin.class && admin.class !== undefined) {
            this.current.className = admin.class;
          }
          if (current.style !== admin.style && admin.style !== undefined) {
            this.current.setAttribute("style", admin.style);
          }
        }
      };

      // @ts-ignore
      this.current.__xkin__ = method;
      return this;
    },
  };
  return self;
}

export function createAdmin(val: string | HTMLElement): RefAdmin | null {
  const el = isString(val) ? document.querySelector(val as string) : val;
  return el ? elementAdmin(el as HTMLElement) : null;
}

export const querySelector = (attr: string, val: string) => {
  const el = document.querySelector(`[${attr}="${val}"]`);
  return el ? elementAdmin(el as HTMLElement) : null;
};

export const querySelectorAll = (attr: string, val: string) => {
  const elems = document.querySelectorAll(`[${attr}="${val}"]`);
  return Array.from(elems).map((el) => elementAdmin(el as HTMLElement));
};
