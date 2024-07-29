import { querySelector } from "./element";

// Define types for options and layout
type LayoutOptions = Record<string, string>;

export function Layout(engine: any) {
  return (attr: string, options: LayoutOptions = {}) => {
    const layout: any = {};

    Object.entries(options).forEach(([name, layoutID]) => {
      layout[name] = querySelector(attr, layoutID);
    });

    engine.$layout = layout;
    return layout;
  };
}
