import { swipe } from "./directives";
import { html, css } from "../utils/template-tags";

export default function layout(options: any) {
  const {
    name = "x-layout",
    breakPoint = 1024,
    transitionDuration = "0.3s",
    sizeHeader = "40px",
    sizeFooter = "40px",
    sizeLeft = "185px",
    sizeRight = "185px",
    sizeLeftMini = "60px",
    sizeRightMini = "60px",
    zHeader = 100,
    zFooter = 100,
    zLeft = 102,
    zRight = 102,
  } = options;

  const STORAGE_KEY = "x-layout-state";

  const htmlCode = html` <slot name="header"></slot>
    <slot name="left"></slot>
    <slot name="left-mini"></slot>
    <slot name="right"></slot>
    <slot name="right-mini"></slot>
    <slot name="main"></slot>
    <slot name="footer"></slot>`;

  const styleCode = css`
    :host {
      --app-header: ${sizeHeader};
      --app-footer: ${sizeFooter};
      --app-left: ${sizeLeft};
      --app-right: ${sizeRight};
      --app-left-mini: ${sizeLeftMini};
      --app-right-mini: ${sizeRightMini};

      --app-header-layer: ${zHeader};
      --app-footer-layer: ${zFooter};
      --app-left-layer: ${zLeft};
      --app-right-layer: ${zRight};

      display: block;
    }

    @media (max-width: ${breakPoint}px) {
      ::slotted([slot="main"]) {
        left: 0 !important;
        right: 0 !important;
      }
    }

    @media (min-width: ${breakPoint}px) {
      ::slotted([slot="left"]),
      ::slotted([slot="left-mini"]),
      ::slotted([slot="right"]),
      ::slotted([slot="right-mini"]) {
        top: calc(var(--app-header)) !important;
        bottom: calc(var(--app-footer)) !important;
      }
    }

    ::slotted([slot="header"]) {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--app-header);
      z-index: var(--app-header-layer);
    }

    ::slotted([slot="footer"]) {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: var(--app-footer);
      z-index: var(--app-footer-layer);
    }

    ::slotted([slot="left"]),
    ::slotted([slot="left-mini"]),
    ::slotted([slot="right"]),
    ::slotted([slot="right-mini"]) {
      transform-style: preserve-3d;
      will-change: transform;
      transition-duration: ${transitionDuration};
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-property: transform;
      touch-action: pan-x pan-y;
      pointer-events: auto;
    }

    ::slotted([slot="left"]),
    ::slotted([slot="left-mini"]) {
      position: fixed;
      top: 0;
      bottom: 0;
      z-index: var(--app-left-layer);
      transform: translateX(-100vw);
      left: 0;
    }

    ::slotted([slot="right"]),
    ::slotted([slot="right-mini"]) {
      position: fixed;
      top: 0;
      bottom: 0;
      z-index: var(--app-right-layer);
      transform: translateX(100vw);
      right: 0;
    }

    ::slotted([slot="left"]) {
      width: var(--app-left);
    }
    ::slotted([slot="left-mini"]) {
      width: var(--app-left-mini);
    }
    ::slotted([slot="right"]) {
      width: var(--app-right);
    }
    ::slotted([slot="right-mini"]) {
      width: var(--app-right-mini);
    }

    ::slotted([slot="main"]) {
      position: fixed;
      overflow: auto;
      transition: all 0.1s ease;
    }

    ::slotted(.clip-left) {
      left: calc(var(--app-left));
    }
    ::slotted(.clip-right) {
      right: calc(var(--app-right));
    }
    ::slotted(.clip-top) {
      top: calc(var(--app-header));
    }
    ::slotted(.clip-bottom) {
      bottom: calc(var(--app-footer));
    }

    ::slotted(.open-sidebar) {
      transform: translateX(0) !important;
    }
  `;

  const template = `<style>${styleCode}</style>${htmlCode}`;

  class XLayout extends HTMLElement {
    constructor() {
      super();
      const useShadow = !this.hasAttribute("no-shadow");
      const root = useShadow ? this.attachShadow({ mode: "open" }) : this;
      root.innerHTML = template;
    }

    connectedCallback() {
      const state = this.loadState();

      // Handle toggle for sides
      ["left", "left-mini", "right", "right-mini"].forEach((key: any) => {
        if (state[key]) this.toggle(key, true);

        const slot = (this.shadowRoot || this).querySelector(
          `slot[name="${key}"]`
        ) as HTMLSlotElement;

        if (!slot) return;

        const bindSwipe = () => {
          const assigned = slot.assignedElements();
          if (!assigned.length) return;

          const el = assigned[0] as HTMLElement;
          if (!el) return;

          bindSwipeToElement(el, (direction) => {
            const isLeft = key.startsWith("left");
            const isRight = key.startsWith("right");

            const shouldClose =
              (isLeft && direction === "left") || (isRight && direction === "right");

            if (shouldClose && el.classList.contains("open-sidebar")) {
              this.toggle(key as any, false);
            }
          });
        };

        // Bind swipe on slot change and initial render
        requestAnimationFrame(bindSwipe);
        slot.addEventListener("slotchange", () => requestAnimationFrame(bindSwipe));
      });
    }

    toggle(side: "left" | "right" | "left-mini" | "right-mini", force?: boolean) {
      const slot = (this.shadowRoot || this).querySelector(
        `slot[name="${side}"]`
      ) as HTMLSlotElement;
      const el = slot?.assignedElements()[0] as HTMLElement;
      if (!el) return;

      el.classList.toggle("open-sidebar", force ?? !el.classList.contains("open-sidebar"));
      this.saveState(side, el.classList.contains("open-sidebar"));
    }

    saveState(side: string, open: boolean) {
      const existing = this.loadState();
      existing[side] = open;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    }

    loadState(): Record<string, boolean> {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      } catch {
        return {};
      }
    }
  }

  if (!customElements.get(name)) {
    customElements.define(name, XLayout);
  }

  return XLayout;
}

function bindSwipeToElement(
  el: HTMLElement,
  callback: (direction: "left" | "right" | "up" | "down") => void
) {
  // Prevent rebinding swipe event if already bound
  if (el.hasAttribute("data-swipe-bound")) return;

  el.setAttribute("data-swipe-bound", "true");

  // Use swipe utility function to listen for swipe gestures
  swipe(el, (direction) => {
    callback(direction);
  });
}
