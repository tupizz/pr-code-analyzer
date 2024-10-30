const fs = require("fs");
const path = require("path");
const os = require("os");

const GitOperator = require("./GitOperator");
const DiffParser = require("./DiffParser");
const LLMService = require("./LLMAdapter");
const logger = require("./logger");

module.exports = class PRReviewer {
  constructor(options) {
    this.branchName = options.branch;
    this.mode = options.mode;
    this.targetBranch = options.targetBranch;
    this.tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "pr_diff-"));
    this.outputFolder = options.output ? options.output : this.tmpDir;
    this.diffFile = path.join(this.tmpDir, "pr_diff.txt");
    this.outputFile = path.join(this.tmpDir, "pr_changes_for_llm.txt");
  }

  async run() {
    try {
      // Execute git operations
      GitOperator.fetchLatestChanges();
      GitOperator.checkoutBranch(this.branchName);

      // Generate and save diff
      const diffOutput = GitOperator.generateDiff(this.targetBranch);
      fs.writeFileSync(this.diffFile, diffOutput);
      logger.info(`Diff saved to ${this.diffFile}`);

      // Parse and structure the diff
      const changes = DiffParser.parseDiffFile(this.diffFile);
      DiffParser.saveChangesForLLM(changes, this.outputFile);

      // Send to LLM
      logger.info("Sending structured diff to LLM for review...");
      const reviewFilePath = await new LLMService().processChanges(
        this.outputFile,
        this.mode,
        this.outputFolder,
      );
      logger.info(`Review saved to ${reviewFilePath}`);

      return reviewFilePath;
    } catch (error) {
      logger.error("Failed to process PR review:", error);
      throw error;
    } finally {
      // Cleanup temporary files
      this.cleanup();
    }
  }

  cleanup() {
    try {
      fs.rmSync(this.tmpDir, { recursive: true, force: true });
      logger.info("Cleaned up temporary files");
    } catch (error) {
      logger.error("Failed to cleanup temporary files:", error);
    }
  }
};
