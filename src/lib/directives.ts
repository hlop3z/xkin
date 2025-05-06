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

  const options = { passive: true };
  el.addEventListener("touchstart", handleTouchStart, options);
  el.addEventListener("touchend", handleTouchEnd, options);

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

/**
 * Parameters for the `eventListener` function.
 */
export interface CreateEventListenerParams<T extends Event> {
  /**
   * The target element or object to attach the event listener to.
   * Defaults to the global `document` object.
   */
  target?: EventTarget;
  /**
   * The type of event to listen for (e.g., 'click', 'mouseover', 'keydown').
   */
  type: string;
  /**
   * The callback function to execute when the event is triggered.
   * The function receives the event object, cast to the specific type `T`.
   */
  callback: (event: T) => void;
  /**
   * An optional object specifying characteristics about the event listener.
   * See the `addEventListener` options parameter for details.
   */
  options?: AddEventListenerOptions | boolean;
}

/**
 * Dynamically creates and attaches an event listener to a specified target.
 * Returns a function to easily remove the created event listener.
 *
 * @template T - The specific type of the event being listened for (e.g., MouseEvent, KeyboardEvent).
 * @param {CreateEventListenerParams<T>} params - An object containing the listener configuration.
 * @returns {() => void} A function that, when called, removes the attached event listener.
 *
 * @example
 * ```typescript
 * // Example 1: Listening for click events on a button
 * const button = document.getElementById('myButton');
 * if (button) {
 *  const removeClickListener = eventListener<MouseEvent>({
 *    target: button,
 *    type: 'click',
 *    callback: (event) => {
 *      console.log('Button clicked!', event.clientX, event.clientY);
 *    },
 * });
 *
 * // To remove the listener later:
 * // removeClickListener();
 * }
 *
 * // Example 2: Listening for keydown events on the document
 * const removeKeydownListener = eventListener<KeyboardEvent>({
 *  type: 'keydown',
 *  callback: (event) => {
 *    console.log('Key pressed:', event.key, event.code);
 *    if (event.key === 'Escape') {
 *    removeKeydownListener(); // Remove the listener when Escape is pressed
 *    console.log('Escape key pressed - listener removed.');
 *  }
 * },
 * });
 *
 * // Example 3: Using capture phase for a scroll event on the window
 * const removeScrollListener = eventListener<Event>({
 *  target: window,
 *  type: 'scroll',
 *  callback: () => {
 *    console.log('Window scrolled!');
 *  },
 *  options: { capture: true },
 * });
 *
 * // To remove the scroll listener:
 * // removeScrollListener();
 * ```
 */
export function eventListener<T extends Event>({
  target = document,
  type,
  callback,
  options = {},
}: CreateEventListenerParams<T>): () => void {
  if (!type || typeof callback !== "function") {
    throw new Error("Missing required 'type' or 'callback' function.");
  }

  const handler = (event: Event) => callback(event as T);
  target.addEventListener(type, handler, options);

  return () => target.removeEventListener(type, handler, options);
}
