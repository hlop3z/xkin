import { writeFile, mkdir, readdir, stat } from "fs/promises";
import path from "path";

// Retrieve the component name from command-line arguments
const componentName = Bun.argv[2];

// Utility: Convert kebab-case or snake_case to TitleCase
const titleCase = (text) => {
  return text
    .replace(/[-_]/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

// Check if a component name is provided
if (!componentName) {
  console.error("Error: Please provide a component name.");
  process.exit(1);
}

function generateID(size = 16) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let uuid = "";

  // Fill with random characters up to the specified size
  for (let i = 0; i < size; i++) {
    uuid += characters[Math.floor(Math.random() * characters.length)];
  }

  return "__" + uuid + Date.now().toString(36) + "__";
}

const className = componentName.toLowerCase(); // titleCase(componentName);
const mainFolderPath = "./src/components/";
const destinationFolder = path.join(mainFolderPath, className);

// Generate component files
async function generateFiles(folderPath, fileData) {
  try {
    // Ensure the destination folder exists
    await mkdir(folderPath, { recursive: true });

    const themeName = generateID(16);

    // Write all files in parallel
    await Promise.all(
      Object.entries(fileData).map(async ([fileName, fileContent]) => {
        let content = fileContent.trim();
        const filePath = path.join(folderPath, fileName);

        if (fileName === "index.tsx") {
          content = `const $NAME = "${themeName}${className}";\n\n${fileContent.trim()}`;
        }
        if (fileName === "style.scss") {
          content = `$NAME: "${themeName}${className}";\n\n${
            fileContent.trim() || ""
          }`;
        }

        await writeFile(filePath, content, "utf-8");
        console.log(`File created: ${filePath}`);
      })
    );

    // Update the components index file
    const componentFolders = await readdir(mainFolderPath, {
      withFileTypes: true,
    });
    const exportStatements = componentFolders
      .filter((dirent) => dirent.isDirectory())
      .map(
        (dirent) =>
          `export { default as ${dirent.name} } from "./${dirent.name}/index.tsx";`
      );

    const indexPath = path.join(mainFolderPath, "index.ts");
    await writeFile(indexPath, exportStatements.join("\n"), "utf-8");
    console.log(`File created: ${indexPath}`);
  } catch (error) {
    console.error("Error generating files:", error);
  }
}

// Check if a directory exists
async function isDirectoryExists(directoryPath) {
  try {
    const stats = await stat(directoryPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

// Sample files for the component
const sample = {
  "index.tsx": `export default null;`,
  "style.scss": `// .#{$NAME} { color: red; }`,
  "props.tsx": `
type Props = {
  class?: string | any[] | Record<string, boolean> | any;
  style?: string | any[] | Record<string, string> | any;
  children?: any;
};

export default Props;
`,
  "docs.tsx": `
/**
 * ${className} - Component.
 *
 * @component
 *
 * @param {Props} props - The props object containing the following attributes:
 * @param {any} [props.class] - The CSS classes to apply to the component.
 * @param {any} [props.style] - The inline CSS styles to apply to the component.
 *
 * @returns {JSX.Element} The rendered Component.
 *
 * @example
 *
 * console.log(${className})
 */
`,
};

// Main script execution
(async () => {
  if (await isDirectoryExists(destinationFolder)) {
    console.log(`Component { ${className} } already exists.`);
  } else {
    await generateFiles(destinationFolder, sample);
  }
})();
