import { isString } from "./utils";
import { StyledComponent } from "./component";

/**
 * Represents a reference with admin capabilities for DOM elements.
 */
export interface RefAdmin {
  /** The current DOM element */
  current: HTMLElement;
  
  /** 
   * Checks if the element contains a class
   * @param className - The class name to check
   * @returns True if the element contains the class, false otherwise
   */
  contains(className: string): boolean;
  
  /**
   * Finds child elements matching a selector
   * @param query - The selector to match
   * @returns Array of element admins for matching elements
   */
  find(query: string): RefAdmin[];
  
  /**
   * Gets the first child element matching a selector
   * @param query - The selector to match
   * @returns Element admin for the first matching element or null
   */
  get(query: string): RefAdmin | null;
  
  /**
   * Adds classes to the element
   * @param args - Class names to add
   */
  add(...args: string[]): void;
  
  /**
   * Removes classes from the element
   * @param args - Class names to remove
   */
  remove(...args: string[]): void;
  
  /**
   * Toggles classes on the element
   * @param args - Class names to toggle
   */
  toggle(...args: string[]): void;
  
  /** Internal method to add classes */
  __add(...args: string[]): void;
  
  /** Internal method to remove classes */
  __remove(...args: string[]): void;
  
  /** Internal method to toggle classes */
  __toggle(args: string[]): void;
  
  /** Internal dictionary for storing element properties */
  __dict__: { display: string };
  
  /** Hides the element */
  hide(): void;
  
  /** Shows the element */
  show(): void;
  
  /**
   * Applies custom CSS theme
   * @param args - Theme configuration
   * @returns The RefAdmin instance for chaining
   */
  css(args: any): RefAdmin;
  
  /** Gets the element's theme */
  theme: (name: string, setter?: boolean) => void;
}

/**
 * Creates an admin interface for a DOM element.
 * @param selector - Element selector string or HTMLElement
 * @returns RefAdmin for the element or null if not found
 */
export function createAdmin(selector: string | HTMLElement): RefAdmin | null {
  const el = isString(selector) ? document.querySelector(selector as string) : selector;
  return el ? elementAdmin(el as HTMLElement) : null;
}

/**
 * Factory function for creating a RefAdmin object with element admin capabilities.
 * @param refAdmin - The HTMLElement to create the RefAdmin for
 * @returns The RefAdmin object
 */
export function elementAdmin(refAdmin: HTMLElement): RefAdmin {
  const self: RefAdmin = {
    get current(): HTMLElement {
      return refAdmin;
    },
    
    contains(className: string): boolean {
      return this.current?.classList.contains(className) || false;
    },
    
    find(query: string): RefAdmin[] {
      const elems = this.current?.querySelectorAll(query) || [];
      return Array.from(elems).map((el) => elementAdmin(el as HTMLElement));
    },
    
    get(query: string): RefAdmin | null {
      const el = this.current?.querySelector(query);
      return el ? elementAdmin(el as HTMLElement) : null;
    },
    
    add(...classNames: string[]): void {
      this.__add(...classNames);
    },
    
    remove(...classNames: string[]): void {
      this.__remove(...classNames);
    },
    
    toggle(...classNames: string[]): void {
      this.__toggle(classNames);
    },
    
    __add(...classNames: string[]): void {
      classNames.forEach((className) => {
        this.current?.classList.add(className);
      });
    },
    
    __remove(...classNames: string[]): void {
      classNames.forEach((className) => {
        this.current?.classList.remove(className);
      });
    },
    
    __toggle(classNames: string[]): void {
      classNames.forEach((className) => {
        this.current?.classList.toggle(className);
      });
    },
    
    __dict__: {
      display: refAdmin.style.display,
    },
    
    hide(): void {
      this.current.style.display = "none";
    },
    
    show(): void {
      this.current.style.display =
        this.__dict__.display !== "none" ? this.__dict__.display : "";
    },
    
    get theme() {
      // @ts-expect-error - Type checking suppressed intentionally
      return this.current.__xkin__;
    },

    set theme(value) {
      // Prevent external setting of theme
    },
    
    css(props: any): RefAdmin {
      const args = props || {};
      const config = {
        theme: args,
        base: {
          class: this.current.className,
          style: this.current.getAttribute("style") || "",
        },
      };
      
      const component = StyledComponent(config)({});
      
      const method = (name: string, setter: boolean = true): void => {
        const admin = component.theme(name);
        if (setter) {
          const current = {
            class: this.current.className,
            style: this.current.getAttribute("style") || "",
          };
          
          if (current.class !== admin.class && admin.class !== undefined) {
            this.current.className = admin.class;
          }
          
          if (current.style !== admin.style && admin.style !== undefined) {
            this.current.setAttribute("style", admin.style);
          }
        }
      };

      // Store the theme method on the element
      // @ts-expect-error - Type checking suppressed intentionally
      this.current.__xkin__ = method;
      
      return this;
    },
  };
  
  return self;
} 