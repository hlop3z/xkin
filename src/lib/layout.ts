export default function Layout({
  name,
  breakPoint,
  transitionDuration,
  sizeHeader,
  sizeFooter,
  sizeLeft,
  sizeRight,
  sizeLeftMini,
  sizeRightMini,
  zHeader,
  zFooter,
  zLeft,
  zRight,
}: any) {
  const value = {
    name: name || "x-layout",
    breakPoint: breakPoint || 1024,
    transition: transitionDuration || "0.3s",
    sizeHeader: sizeHeader || "40px",
    sizeFooter: sizeFooter || "40px",
    sizeLeft: sizeLeft || "185px",
    sizeRight: sizeRight || "185px",
    sizeLeftMini: sizeLeftMini || "60px",
    sizeRightMini: sizeRightMini || "60px",
    zHeader: zHeader || "100",
    zFooter: zFooter || "100",
    zLeft: zLeft || "102",
    zRight: zRight || "102",
  };

  class XLayout extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: "open" });

      shadow.innerHTML = `
<style>
  :host {
    --app-header: ${value.sizeHeader};
    --app-footer: ${value.sizeFooter};
    --app-left: ${value.sizeLeft};
    --app-right: ${value.sizeRight};
    --app-left-mini: ${value.sizeLeftMini};
    --app-right-mini: ${value.sizeRightMini};

    --app-header-layer: ${value.zHeader};
    --app-footer-layer: ${value.zFooter};
    --app-left-layer: ${value.zLeft};
    --app-right-layer: ${value.zRight};

    display: block;
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

  /* Sidebar slots */
  ::slotted([slot="left"]),
  ::slotted([slot="left-mini"]),
  ::slotted([slot="right"]),
  ::slotted([slot="right-mini"]) {
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    will-change: transform;
    -webkit-transition-duration: ${value.transition};
    transition-duration: ${value.transition};
    -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    -webkit-transition-property: -webkit-transform;
    transition-property: transform;
  }

  ::slotted([slot="left"]),
  ::slotted([slot="left-mini"]) {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: var(--app-left-layer);
    -webkit-transform: translateX(-100vw);
    -ms-transform: translateX(-100vw);
    transform: translateX(-100vw);
  }

  ::slotted([slot="right"]),
  ::slotted([slot="right-mini"]) {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: var(--app-right-layer);
    -webkit-transform: translateX(100vw);
    -ms-transform: translateX(100vw);
    transform: translateX(100vw);
  }

  ::slotted([slot="left"]) {
    left: 0;
    width: var(--app-left);
  }

  ::slotted([slot="left-mini"]) {
    left: 0;
    width: var(--app-left-mini);
  }

  ::slotted([slot="right"]) {
    right: 0;
    width: var(--app-right);
  }

  ::slotted([slot="right-mini"]) {
    right: 0;
    width: var(--app-right-mini);
  }

  ::slotted([slot="main"]) {
    position: fixed;
    overflow: auto;
    transition: all 0.1s ease;
  }

  @media (max-width: ${value.breakPoint}px) {
    ::slotted([slot="main"]) {
      left: 0 !important;
      right: 0 !important;
    }
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
    -webkit-transform: translateX(0) !important;
    -ms-transform: translateX(0) !important;
    transform: translateX(0) !important;
  }
</style>

<slot name="header"></slot>
<slot name="left"></slot>
<slot name="left-mini"></slot>
<slot name="right"></slot>
<slot name="right-mini"></slot>
<slot name="main"></slot>
<slot name="footer"></slot>
      `;
    }
  }

  customElements.define(value.name, XLayout);
}
