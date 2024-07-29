/**
 * Represents a reference with admin capabilities.
 */
interface RefAdmin {
  current: HTMLElement;
  contains(className: string): boolean;
  find(query: string): any;
  get(query: string): any;
  add(...args: string[]): void;
  remove(...args: string[]): void;
  toggle(args: string[], value?: any): void;
  __add(...args: string[]): void;
  __remove(...args: string[]): void;
  __toggle(args: string[], value?: any): void;
  __dict__: any;
  hide(): void;
  show(): void;
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
      try {
        return this.current?.classList.contains(className) || false;
      } catch (e) {
        return false;
      }
    },
    find(query: string) {
      try {
        const elems = this.current?.querySelectorAll(query);
        if (elems) {
          return Array.from(elems).map((el: any) => elementAdmin(el));
        }
        return [];
      } catch (e) {
        return [];
      }
    },
    ["get"](query: string) {
      try {
        let el: any = this.current?.querySelector(query);
        if (el) return elementAdmin(el);
        return null;
      } catch (e) {
        return null;
      }
    },
    add(...classNames: string[]) {
      try {
        this.__add(...classNames);
      } catch (e) {}
    },
    remove(...classNames: string[]) {
      try {
        this.__remove(...classNames);
      } catch (e) {}
    },
    toggle(classNames: string[], value: any = null) {
      try {
        this.__toggle(value, ...classNames);
      } catch (e) {}
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
    __toggle(value: any, ...classNames: string[]) {
      classNames = [...classNames];
      classNames.forEach((className) => {
        if (value === null) {
          this.current?.classList.toggle(className);
        } else {
          this.current?.classList.toggle(className, value);
        }
      });
    },
    __dict__: {
      display: refAdmin.style.display,
    },
    hide() {
      this.current.style.display = "none";
    },
    show() {
      const dict = this.__dict__;
      if (dict.display && dict.display !== "none") {
        this.current.style.display = dict.display;
      } else {
        this.current.style.display = "";
      }
    },
  };
  return self;
}

const querySelector = (attr: string, val: string) => {
  let el: any = window.document.querySelector(`[${attr}="${val}"]`);
  if (el) return elementAdmin(el);
  return null;
};

const querySelectorAll = (attr: string, val: string) => {
  const elems = window.document.querySelectorAll(`[${attr}="${val}"]`);
  if (elems) {
    return Array.from(elems).map((el: any) => elementAdmin(el));
  } else {
    return [];
  }
};

function isString(value: any) {
  return typeof value === "string" || value instanceof String;
}

function createAdmin(val: string | HTMLElement): any {
  const el: any = isString(val) ? document.querySelector(val) : val;
  return elementAdmin(el);
}

createAdmin.get = querySelector;
createAdmin.find = querySelectorAll;

export default createAdmin;
