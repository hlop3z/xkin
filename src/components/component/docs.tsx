/**
 * @example
 *
 * const myComponent = {
 *   base: {
 *     class: "button",
 *     style: "",
 *   },
 *   attrs: (props) => ({
 *     type: props.type ? props.type : "button",
 *   }),
 *   setup: ({ size, disabled, height }) => ({
 *     class: {
 *       "is-small": size === "sm",
 *       "is-large": size === "lg",
 *       "is-disabled": disabled,
 *     },
 *     style: { height: height },
 *   }),
 *   theme: {
 *     active: {
 *       class: "color-bg-success",
 *       style: "",
 *     },
 *     error: {
 *       class: "color-bg-danger",
 *       style: "",
 *     },
 *   },
 * };
 *
 * // Reusable Component
 * const component = xkin.component(myComponent);
 *
 * const Button = component({
 *   type: "submit",
 *   size: "sm",
 *   disabled: true,
 *   height: "40px",
 * });
 *
 * // Component Attributes
 * console.log(Button);
 *
 * // Build Themes.
 * setTimeout(() => {
 *   const active = Button.theme("active");
 *   const error = Button.theme("error");
 *   console.log(active);
 *   console.log(error);
 * }, 1000);
 */
