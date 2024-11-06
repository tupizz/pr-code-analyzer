const { execSync } = require("child_process");
const logger = require("./logger");

module.exports = class GitOperator {
  /**
   * Executes a git command safely
   * @param {string} command - Git command to execute
   * @throws {Error} - If command execution fails
   */
  static executeGitCommand(command) {
    try {
      return execSync(command, {
        encoding: "utf8",
        stdio: "pipe",
        maxBuffer: 1024 * 1024 * 100,
      });
    } catch (error) {
      throw new Error(`Git command failed: ${error.message}`);
    }
  }

  /**
   * Fetches latest changes from remote
   */
  static fetchLatestChanges() {
    logger.info("Fetching latest changes from the remote...");
    this.executeGitCommand("git fetch origin");
  }

  /**
   * Checks out specified branch
   * @param {string} branchName - Name of the branch to checkout
   */
  static checkoutBranch(branchName) {
    logger.info(`Checking out branch ${branchName}...`);
    this.executeGitCommand(`git checkout ${branchName}`);
  }

  /**
   * Generates diff between branches
   * @param {string} targetBranch - Target branch to compare against
   * @returns {string} - Diff output
   */
  static generateDiff(targetBranch) {
    logger.info(`Generating diff against ${targetBranch}...`);
    return this.executeGitCommand(`git diff origin/${targetBranch}...HEAD`);
  }
};
