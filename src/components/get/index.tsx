import { elementAdmin } from "../control";

const querySelector = (attr: string, val: string) => {
  const el = document.querySelector(`[${attr}="${val}"]`);
  return el ? elementAdmin(el as HTMLElement) : null;
};

export default querySelector;
