import { queryAttrSelector } from "./selector";
import type { RefAdmin } from "./ref_admin";

/**
 * Type definition for layout options mapping component names to layout IDs
 */
export type LayoutOptions = Record<string, string>;

/**
 * Global container for registered components
 */
export const globalComponents: Record<string, RefAdmin | null> = {};

/**
 * Creates a GUI manager by registering components with attribute selectors.
 * This allows for easy access to common elements in the application.
 *
 * @example
 * // Register common layout components
 * const gui = createGUI('data-layout', {
 *   header: 'main-header',
 *   sidebar: 'left-sidebar',
 *   content: 'main-content',
 *   footer: 'page-footer'
 * });
 *
 * // Later use them directly
 * gui.header?.show();
 * gui.sidebar?.hide();
 *
 * @param attr - The attribute name to select components by
 * @param options - Object mapping component names to their attribute values
 * @returns The global components object for accessing registered components
 */
export function createGUI(
  attr: string,
  options: LayoutOptions = {}
): Record<string, RefAdmin | null> {
  Object.entries(options).forEach(([name, layoutID]) => {
    globalComponents[name] = queryAttrSelector(attr, layoutID);
  });
  return globalComponents;
}
