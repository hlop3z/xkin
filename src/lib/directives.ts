/**
 * Swipe detection utility
 *
 * @example
 * // Vanilla JS
 * ```ts
 * swipe(document.getElementById("myElement"), (dir) => {
 *   console.log("Direction:", dir);
 * });
 * ```
 *
 * @example
 * // React & Preact (using useEffect)
 * ```ts
 * useEffect(() => {
 *   swipe(ref.current, (dir) => console.log(`Swiped: ${dir}`));
 * }, []);
 * ```
 */
export function swipe(
  el: HTMLElement,
  callback: (direction: "left" | "right" | "up" | "down") => void,
  threshold: number = 50
): () => void {
  let startX: number, startY: number;

  const handleTouchStart = (e: TouchEvent) => {
    const t: any = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const t: any = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > threshold) callback(dx > 0 ? "right" : "left");
    } else {
      if (Math.abs(dy) > threshold) callback(dy > 0 ? "down" : "up");
    }
  };

  el.addEventListener("touchstart", handleTouchStart);
  el.addEventListener("touchend", handleTouchEnd);

  // Return cleanup function
  return () => {
    el.removeEventListener("touchstart", handleTouchStart);
    el.removeEventListener("touchend", handleTouchEnd);
  };
}

/**
 * Detects clicks outside of the given element.
 *
 * @param {HTMLElement} el - The element to watch.
 * @param {(e: MouseEvent) => void} callback - Called when a click outside is detected.
 * @returns {Function} cleanup - Call this to remove the listener.
 *
 * @example
 * // Vanilla JS
 * ```ts
 * const cleanup = clickOutside(document.getElementById("myElement"), () => {
 *   console.log('Clicked outside!');
 * });
 * // To remove:
 * cleanup();
 * ```
 *
 * @example
 * // React & Preact (using useEffect)
 * ```ts
 * useEffect(() => {
 *   const cleanup = clickOutside(ref.current!, () => console.log('Clicked outside!'));
 *   return cleanup;
 * }, []);
 * ```
 */
export function clickOutside(el: HTMLElement, callback: (e: MouseEvent) => void): () => void {
  const handler: any = (e: MouseEvent) => {
    if (el && !el.contains(e.target as Node)) {
      callback(e);
    }
  };

  document.addEventListener("mousedown", handler);
  document.addEventListener("touchstart", handler);

  // Return cleanup function
  return () => {
    document.removeEventListener("mousedown", handler);
    document.removeEventListener("touchstart", handler);
  };
}

/**
 * Handles hover enter/leave on a DOM element.
 *
 * @param {HTMLElement} el - The element to observe.
 * @param {(hovering: boolean, event: MouseEvent) => void} callback - Called with `true` on hover, `false` on leave.
 * @returns {Function} cleanup - Call this to remove listeners.
 *
 * @example
 * // Vanilla JS
 * ```ts
 * const cleanup = hover(document.getElementById("myElement"), (isHovering) => {
 *   console.log(isHovering ? 'Hovered' : 'Unhovered');
 * });
 * // To remove:
 * cleanup();
 * ```
 *
 * @example
 * // React & Preact (using useEffect)
 * ```ts
 * useEffect(() => {
 *   const cleanup = hover(ref.current!, (isHovering) => {
 *     console.log(isHovering ? 'Hovered' : 'Unhovered');
 *   });
 *   return cleanup;
 * }, []);
 * ```
 */
export function hover(
  el: HTMLElement,
  callback: (hovering: boolean, event: MouseEvent) => void
): () => void {
  const onEnter = (e: MouseEvent) => callback(true, e);
  const onLeave = (e: MouseEvent) => callback(false, e);

  el.addEventListener("mouseenter", onEnter);
  el.addEventListener("mouseleave", onLeave);

  // Return cleanup function
  return () => {
    el.removeEventListener("mouseenter", onEnter);
    el.removeEventListener("mouseleave", onLeave);
  };
}
