#!/usr/bin/env node
const { Command } = require("commander");

const logger = require("../src/logger");
const PRReviewer = require("../src/PRMain");

// Set up CLI
const program = new Command();

program
  .name("pr-reviewer")
  .description("CLI tool for automated PR reviews using LLM")
  .version("1.0.0")
  .requiredOption("-b, --branch <branch>", "branch name to review")
  .option("-m, --mode <mode>", "review mode (review/description)", "review")
  .option(
    "-t, --target-branch <branch>",
    "target branch to compare against",
    "development",
  )
  .option("-o, --output <output>", "output folder", "")
  .option("-v, --verbose", "enable verbose logging")
  .action(async (options) => {
    try {
      if (options.verbose) {
        logger.level = "debug";
      }

      const reviewer = new PRReviewer(options);
      await reviewer.run();
      process.exit(0);
    } catch (error) {
      logger.error("Fatal error:", error);
      process.exit(1);
    }
  });

program.parse();
