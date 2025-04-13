// This file is used by ESLint to specify which TypeScript version to use
module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
    extraFileExtensions: [".json"]
  },
  settings: {
    typescript: {
      version: "5.3.3" // Use a version compatible with @typescript-eslint
    }
  }
}; 