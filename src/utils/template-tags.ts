// template-tags.ts
export function html(strings: TemplateStringsArray, ...values: any[]): string {
  return strings.reduce((out, str, i) => out + str + (values[i] ?? ""), "");
}

export function css(strings: TemplateStringsArray, ...values: any[]): string {
  return strings.reduce((out, str, i) => out + str + (values[i] ?? ""), "");
}

export function scss(strings: TemplateStringsArray, ...values: any[]): string {
  return strings.reduce((out, str, i) => out + str + (values[i] ?? ""), "");
}
