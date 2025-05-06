import injectCSS from "./inject.ts";

const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;

interface ThemeOptions {
  base?: Record<string, string>;
  dark?: Record<string, string>;
  disable?: string[];
  zebra?: string | boolean;
  darkMode?: boolean;
}

type ColorGroup = "background" | "border" | "text" | "table";

class Theme {
  private base: Record<string, string>;
  private dark: Record<string, string>;
  private disable: Set<string>;
  private zebra: string | false;
  private colors: string[] = [];
  private current: Record<string, string>;
  private isDark: boolean;

  constructor({ base = {}, dark = {}, disable = [], zebra = false, darkMode }: ThemeOptions = {}) {
    this.isDark = darkMode ?? prefersDark;
    this.base = base;
    this.dark = { ...base, ...dark };
    this.disable = new Set(disable);
    this.zebra = Object.keys(base).length && zebra ? (zebra === true ? "#f2f2f2" : zebra) : false;
    this.current = this.isDark ? this.dark : this.base;
  }

  create() {
    injectCSS(this.generateCSS(), "theme-colors");
    this.colors = Object.keys(this.current);
  }

  toggle(force?: boolean) {
    this.isDark = force ?? !this.isDark;
    this.current = this.isDark ? this.dark : this.base;
    this.create();
  }

  private generateCSS(): string {
    let css = "";

    if (this.zebra) {
      css += `tbody tr:nth-child(even) { background-color: ${this.zebra}; }\n`;
    }

    for (const [name, color] of Object.entries(this.current)) {
      for (const group of ["background", "text", "border", "table"] as ColorGroup[]) {
        if (!this.disable.has(group)) {
          css += this.buildStyle(group, name, color);
        }
      }
    }

    return css;
  }

  private buildStyle(group: ColorGroup, name: string, color: string): string {
    const className = getClassName(group, name);
    const style = styleGenerators[group](color);
    return group === "table" ? `.${className} ${style}\n` : `.${className} { ${style} }\n`;
  }

  getColorKeys(): string[] {
    return this.colors;
  }
}

const styleGenerators: Record<ColorGroup, (color: string) => string> = {
  background: (color) => `background-color: ${color} !important;`,
  border: (color) => `border-color: ${color} !important;`,
  text: (color) => `color: ${color} !important;`,
  table: (color) => `{ background-color: ${color} !important; }`,
};

function getClassName(type: ColorGroup, name: string): string {
  const prefixMap: Record<ColorGroup, string> = {
    background: "color-bg",
    border: "color-br",
    text: "color-tx",
    table: "color-tb",
  };
  return `${prefixMap[type]}-${name}`;
}

// Singleton controller
let currentTheme = new Theme();

export default {
  class: getClassName,
  set(options: ThemeOptions) {
    currentTheme = new Theme(options);
    currentTheme.create();
  },
  toggle(force?: boolean) {
    currentTheme.toggle(force);
  },
  get info() {
    return currentTheme;
  },
};
