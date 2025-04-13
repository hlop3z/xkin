import { elementAdmin } from "./element";
import type { RefAdmin } from "./element";

/**
 * Queries for a single element with attribute selector.
 * @param attr - The attribute name to select by
 * @param val - The attribute value to match
 * @returns RefAdmin for the found element or null if not found
 */
export const queryAttrSelector = (attr: string, val: string): RefAdmin | null => {
  const el = document.querySelector(`[${attr}="${val}"]`);
  return el ? elementAdmin(el as HTMLElement) : null;
};

/**
 * Queries for multiple elements with attribute selector.
 * @param attr - The attribute name to select by
 * @param val - The attribute value to match
 * @returns Array of RefAdmin objects for found elements
 */
export const queryAttrSelectorAll = (attr: string, val: string): RefAdmin[] => {
  const elems = document.querySelectorAll(`[${attr}="${val}"]`);
  return Array.from(elems).map((el) => elementAdmin(el as HTMLElement));
};
