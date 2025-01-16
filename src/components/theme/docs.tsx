/**
 * @example
 *
 * const isDark =
 *   window.matchMedia &&
 *   window.matchMedia("(prefers-color-scheme: dark)").matches;
 *
 * xkin.theme.set({
 *   darkMode: isDark,
 *   zebra: true, // Enable zebra striping for tables
 *   disable: [
 *     //  Disable specific color types:
 *     // "text", "background", "border", "table"
 *   ],
 *   base: {success: "#4CAF50"},
 *   dark: {success: "#0F5132"},
 * });
 */
