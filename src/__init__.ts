// @ts-nocheck
// import "./styles/__init__.scss";

import { createAdmin, querySelector, querySelectorAll } from "./element";
import { objectToClass, objectToStyle, Styled, blankForm } from "./styling";
import { Layout } from "./layout";
import theme from "./theme";

const Project = {
  // Elements
  control: createAdmin,
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
  $gui: {},
  gui: (attr, options) => Layout(Project)(attr, options),
};

export default Project;
