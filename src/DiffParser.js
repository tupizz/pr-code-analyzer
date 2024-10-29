const fs = require("fs");
const logger = require("./logger");

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
      const diffContent = fs.readFileSync(diffFilePath, "utf-8");
      const diffLines = diffContent.split("\n");

      diffLines.forEach((line) => {
        if (line.startsWith("diff --git")) {
          currentFile = line.split(" ")[2].replace("a/", "");
          changes.push(`\nChanges in file: ${currentFile}\n`);
        } else if (line.startsWith("+") && !line.startsWith("+++")) {
          changes.push(`Added: ${line.slice(1)}\n`);
        } else if (line.startsWith("-") && !line.startsWith("---")) {
          changes.push(`Removed: ${line.slice(1)}\n`);
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
