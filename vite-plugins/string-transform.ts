// @ts-nocheck
import type { Plugin } from "vite";
import { minify as htmlMinify } from "html-minifier-terser";
import { minify as cssMinify } from "csso";
import sass from "sass";

// Pattern to detect ${} variables in template literals
const varPattern = /\$\{([^}]+)\}/g;

const isDev = process.env.NODE_ENV !== "production";

export function inlineTemplateTransformPlugin(): Plugin {
  return {
    name: "vite-plugin-inline-template-transform",
    enforce: "pre",

    async transform(code, id) {
      if (!id.endsWith(".ts") && !id.endsWith(".js")) return;

      const replacements: {
        tag: string;
        pattern: RegExp;
        minify: (s: string) => Promise<string>;
      }[] = [
        {
          tag: "html",
          pattern: /html`([\s\S]*?)`/g,
          minify: async (s) => {
            // Preserve variables inside `${}`
            const variableMap: Record<string, string> = {};
            s = s.replace(varPattern, (match) => {
              const placeholder = `__VAR__${Math.random().toString(36).substr(2)}__`;
              variableMap[placeholder] = match;
              return placeholder;
            });

            const minifiedHTML = await htmlMinify(s, {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              minifyCSS: true,
              allowCustomElements: true,
            });

            // Restore variables from placeholders
            let restoredHTML = minifiedHTML;
            for (const [placeholder, original] of Object.entries(variableMap)) {
              restoredHTML = restoredHTML.replace(
                new RegExp(escapeRegExp(placeholder), "g"),
                original
              );
            }

            return restoredHTML;
          },
        },
        {
          tag: "css",
          pattern: /css`([\s\S]*?)`/g,
          minify: async (s) => {
            // Preserve variables inside `${}`
            const variableMap: Record<string, string> = {};
            s = s.replace(varPattern, (match) => {
              const placeholder = `__VAR__${Math.random().toString(36).substr(2)}__`;
              variableMap[placeholder] = match;
              return placeholder;
            });

            const minifiedCSS = cssMinify(s).css;

            // Restore variables from placeholders
            let restoredCSS = minifiedCSS;
            for (const [placeholder, original] of Object.entries(variableMap)) {
              restoredCSS = restoredCSS.replace(
                new RegExp(escapeRegExp(placeholder), "g"),
                original
              );
            }

            return restoredCSS;
          },
        },
        {
          tag: "scss",
          pattern: /scss`([\s\S]*?)`/g,
          minify: async (s) => {
            // Preserve variables inside `${}`
            const variableMap: Record<string, string> = {};
            s = s.replace(varPattern, (match) => {
              const placeholder = `__VAR__${Math.random().toString(36).substr(2)}__`;
              variableMap[placeholder] = match;
              return placeholder;
            });

            // Minify SCSS using Sass (compression)
            const minifiedSCSS = sass.compileString(s, { style: "compressed" }).css;

            // Restore variables from placeholders
            let restoredSCSS = minifiedSCSS;
            for (const [placeholder, original] of Object.entries(variableMap)) {
              restoredSCSS = restoredSCSS.replace(
                new RegExp(escapeRegExp(placeholder), "g"),
                original
              );
            }

            return restoredSCSS;
          },
        },
      ];

      let transformed = code;
      for (const { pattern, minify } of replacements) {
        transformed = await replaceAsync(transformed, pattern, async (_, raw) => {
          const cleaned = raw.trim();
          if (isDev) return "`" + cleaned + "`";
          const minified = await minify(cleaned);
          return "`" + minified + "`";
        });
      }

      return {
        code: transformed,
        map: null,
      };
    },
  };
}

// Utility for async regex replacement
async function replaceAsync(
  str: string,
  regex: RegExp,
  asyncFn: (match: string, ...args: any[]) => Promise<string>
): Promise<string> {
  const matches = [...str.matchAll(regex)];
  const replacements = await Promise.all(matches.map((m) => asyncFn(...m)));
  return matches.reduce((acc, match, i) => acc.replace(match[0], replacements[i]), str);
}

// Utility to escape special regex characters (to avoid errors like "Nothing to repeat")
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&"); // escape special characters
}
