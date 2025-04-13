import { isString } from "./utils";
import { StyledComponent } from "./component";

/**
 * Represents a reference with admin capabilities for DOM elements.
 * Provides a fluent interface for DOM manipulation, styling, and traversal.
 * 
 * @interface RefAdmin
 */
export interface RefAdmin {
  /** 
   * The current DOM element being managed 
   * @readonly
   */
  current: HTMLElement;
  
  /** 
   * Checks if the element contains a specific CSS class
   * 
   * @example
   * ```ts
   * if (elementRef.contains('active')) {
   *   // Element has 'active' class
   * }
   * ```
   * 
   * @param className - The CSS class name to check
   * @returns True if the element contains the class, false otherwise
   */
  contains(className: string): boolean;
  
  /**
   * Finds child elements matching a CSS selector
   * Similar to querySelectorAll but returns RefAdmin objects
   * 
   * @example
   * ```ts
   * // Find all buttons within the element
   * const buttons = elementRef.find('button');
   * ```
   * 
   * @param query - The CSS selector to match
   * @returns Array of element admins for matching elements
   */
  find(query: string): RefAdmin[];
  
  /**
   * Gets the first child element matching a CSS selector
   * Similar to querySelector but returns a RefAdmin object
   * 
   * @example
   * ```ts
   * // Find the header within the element
   * const header = elementRef.get('header');
   * if (header) {
   *   header.add('highlighted');
   * }
   * ```
   * 
   * @param query - The CSS selector to match
   * @returns Element admin for the first matching element or null if not found
   */
  get(query: string): RefAdmin | null;
  
  /**
   * Adds one or more CSS classes to the element
   * 
   * @example
   * ```ts
   * elementRef.add('active', 'visible');
   * ```
   * 
   * @param args - CSS class names to add
   */
  add(...args: string[]): void;
  
  /**
   * Removes one or more CSS classes from the element
   * 
   * @example
   * ```ts
   * elementRef.remove('disabled', 'hidden');
   * ```
   * 
   * @param args - CSS class names to remove
   */
  remove(...args: string[]): void;
  
  /**
   * Toggles one or more CSS classes on the element
   * Adds the class if not present, removes it if present
   * 
   * @example
   * ```ts
   * elementRef.toggle('expanded');
   * ```
   * 
   * @param args - CSS class names to toggle
   */
  toggle(...args: string[]): void;
  
  /** 
   * Internal method to add CSS classes
   * @internal
   */
  __add(...args: string[]): void;
  
  /** 
   * Internal method to remove CSS classes
   * @internal
   */
  __remove(...args: string[]): void;
  
  /** 
   * Internal method to toggle CSS classes
   * @internal 
   */
  __toggle(args: string[]): void;
  
  /** 
   * Internal dictionary for storing element properties
   * Used to restore state when toggling visibility
   * @internal
   */
  __dict__: { display: string };
  
  /** 
   * Hides the element by setting its display style to "none"
   * 
   * @example
   * ```ts
   * elementRef.hide(); // Element is now hidden
   * ```
   */
  hide(): void;
  
  /** 
   * Shows the element by restoring its original display style
   * 
   * @example
   * ```ts
   * elementRef.show(); // Element is now visible
   * ```
   */
  show(): void;
  
  /**
   * Applies custom CSS theme to the element
   * 
   * @example
   * ```ts
   * elementRef.css({
   *   primary: { class: 'primary-theme', style: 'color: blue;' },
   *   secondary: { class: 'secondary-theme', style: 'color: green;' }
   * });
   * 
   * // Later apply the theme
   * elementRef.theme('primary');
   * ```
   * 
   * @param args - Theme configuration object with named themes
   * @returns The RefAdmin instance for method chaining
   */
  css(args: any): RefAdmin;
  
  /** 
   * Gets or applies the element's theme
   * Method is added dynamically by the css() method
   * 
   * @param name - The theme name to apply
   * @param setter - Whether to actually apply the theme (true) or just get the theme definition (false)
   */
  theme: (name: string, setter?: boolean) => void;
}

/**
 * Creates an admin interface for a DOM element.
 * Factory function that provides a convenient way to get a RefAdmin instance.
 * 
 * @example
 * ```ts
 * // By CSS selector
 * const header = createAdmin('#header');
 * 
 * // By direct element reference
 * const button = createAdmin(document.getElementById('submit-button'));
 * 
 * if (header) {
 *   header.add('fixed-header');
 *   header.find('nav').forEach(nav => nav.add('nav-item'));
 * }
 * ```
 * 
 * @param selector - CSS selector string or direct HTMLElement reference
 * @returns RefAdmin for the element or null if not found
 */
export function createAdmin(selector: string | HTMLElement): RefAdmin | null {
  const el = isString(selector) ? document.querySelector(selector as string) : selector;
  return el ? elementAdmin(el as HTMLElement) : null;
}

/**
 * Factory function for creating a RefAdmin object with element admin capabilities.
 * Used internally by createAdmin but can also be used directly when you already have an element reference.
 * 
 * @example
 * ```ts
 * const button = document.getElementById('submit-button');
 * if (button) {
 *   const buttonAdmin = elementAdmin(button);
 *   buttonAdmin.add('active');
 * }
 * ```
 * 
 * @param refAdmin - The HTMLElement to create the RefAdmin for
 * @returns The RefAdmin object with the full admin API
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