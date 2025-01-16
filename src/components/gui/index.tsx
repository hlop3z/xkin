import querySelector from "../get";

type LayoutOptions = Record<string, string>;

export const layout: any = {};

function GUI(attr: string, options: LayoutOptions = {}) {
  Object.entries(options).forEach(([name, layoutID]) => {
    layout[name] = querySelector(attr, layoutID);
  });
  return layout;
}

export default GUI;
