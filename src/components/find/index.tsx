import { elementAdmin } from "../control";

const querySelectorAll = (attr: string, val: string) => {
  const elems = document.querySelectorAll(`[${attr}="${val}"]`);
  return Array.from(elems).map((el) => elementAdmin(el as HTMLElement));
};

export default querySelectorAll;
