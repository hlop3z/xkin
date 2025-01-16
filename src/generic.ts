export const isString = (val: any): val is string =>
  typeof val === "string" || val instanceof String;
