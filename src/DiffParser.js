const fs = require("fs");
const logger = require("./logger");

const SKIP_FILES = ["package-lock.json", "package.json"];
const SKIP_FOLDERS = [
  "node_modules",
  "dist",
  "build",
  "coverage",
  "prayModules",
];

module.exports = class DiffParser {
  /**
   * Parses the diff file and extracts changes.
   * @param {string} diffFilePath - Path to the diff file.
   * @returns {string[]} - Array of changes with added or removed lines.
   * @throws {Error} - If file reading fails
   */
  static parseDiffFile(diffFilePath) {
    try {
      const changes = [];
      let currentFile = null;
      let skipFile = false;
      const diffContent = fs.readFileSync(diffFilePath, "utf-8");
      const diffLines = diffContent.split("\n");

      diffLines.forEach((line) => {
        if (line.startsWith("diff --git")) {
          currentFile = line.split(" ")[2].replace("a/", "");

          logger.info(`Current file: ${currentFile}`);

          // Reset skipFile flag and check if we should skip this file
          skipFile =
            SKIP_FILES.some((file) => currentFile.endsWith(file)) ||
            SKIP_FOLDERS.some((folder) => currentFile.includes(folder));

          if (skipFile) {
            console.log("Skipping package-lock.json or package.json");
            return;
          }

          changes.push(`\nChanges in file: ${currentFile}\n`);
        } else if (!skipFile) {
          // Only process lines if we're not skipping the current file
          if (line.startsWith("+") && !line.startsWith("+++")) {
            changes.push(`Added: ${line.slice(1)}\n`);
          } else if (line.startsWith("-") && !line.startsWith("---")) {
            changes.push(`Removed: ${line.slice(1)}\n`);
          }
        }
      });

      return changes;
    } catch (error) {
      throw new Error(`Failed to parse diff file: ${error.message}`);
    }
  }

  /**
   * Saves the structured changes to an output file.
   * @param {string[]} changes - Array of structured changes.
   * @param {string} outputFilePath - Path to the output file.
   * @throws {Error} - If file writing fails
   */
  static saveChangesForLLM(changes, outputFilePath) {
    try {
      fs.writeFileSync(outputFilePath, changes.join(""), "utf-8");
      logger.info(`Structured changes saved to ${outputFilePath}`);
    } catch (error) {
      throw new Error(`Failed to save changes: ${error.message}`);
    }
  }
};
