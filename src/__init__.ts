// @ts-nocheck
// import "./styles/__init__.scss";

import { createAdmin, querySelector, querySelectorAll } from "./element";
import { objectToClass, objectToStyle, Styled, blankForm } from "./styling";
import theme from "./theme";

export default {
  // Elements
  admin: createAdmin,
  find: querySelectorAll,
  get: querySelector,
  // CSS
  style: objectToStyle,
  class: objectToClass,
  // Complex
  component: Styled,
  blankForm: blankForm,
  // Colors
  theme: theme,
};
