type Props = {
  toggle: (value: any) => void;
  class: (
    type: "background" | "border" | "text" | "table",
    name: string
  ) => string;
  set: (config: {
    base: any;
    dark: any;
    disable: any;
    zebra: string | boolean;
    colors: any;
    current: any;
    isDark: boolean;
  }) => string;
  info: {
    base: any;
    dark: any;
    disable: any;
    zebra: string | boolean;
    colors: any;
    current: any;
    isDark: boolean;
  };
};

export default Props;
