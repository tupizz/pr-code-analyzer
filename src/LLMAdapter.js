const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");
const os = require("os");
const OpenAI = require("openai");
const logger = require("./logger");
const { PROMPTS } = require("../MODE_FOR_PROMPT");
const chunkByChangesPattern = require("./chunk");

/**
 * LLMService class for interacting with OpenAI's GPT-4o-mini model
 */
module.exports = class LLMService {
  /**
   * Initializes the LLMService with an OpenAI client
   * @param {string} apiKey - OpenAI API key
   * @throws {Error} - If API key is not provided
   */
  constructor(apiKey = process.env.OPEN_API_KEY) {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    this.client = new OpenAI({ apiKey });
  }

  /**
   * Processes the changes and generates a review or brief
   * @param {string} changesFilePath - Path to the changes file
   * @param {string} mode - Review mode (default: "review")
   * @returns {Promise<string>} - Path to the output file
   * @throws {Error} - If file reading or writing fails
   */
  async processChanges(changesFilePath, mode = "review", outputFolder = null) {
    try {
      // Validate mode
      if (!PROMPTS[mode]) {
        throw new Error(`Invalid mode: ${mode}`);
      }

      // Ensure file exists and read it
      await fs
        .access(changesFilePath)
        .catch(() => fs.writeFile(changesFilePath, "", "utf-8"));

      const changes = await fs.readFile(changesFilePath, "utf-8");

      // save changes locally in execution folder
      await fs.writeFile("pr_changes_for_llm.txt", changes, "utf-8");

      const chunks = chunkByChangesPattern(changes, 10_000);
      logger.info(`Chunked changes into ${chunks.length} chunks`);

      let result = "";
      for (const [index, chunk] of chunks.entries()) {
        logger.info(`Processing chunk ${index + 1} of ${chunks.length}`);
        const response = await this.client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: PROMPTS[mode] },
            { role: "user", content: chunk },
          ],
        });

        result += response.choices[0].message.content;
      }

      console.log(`\n\n\n[${mode}] Output:\n\n\n${result}\n\n\n`);

      // Save and return results
      const outputFolderPath = outputFolder
        ? outputFolder
        : fsSync.mkdtempSync(path.join(os.tmpdir(), "llm-"));

      const outputPath = path.join(outputFolderPath, `output_${mode}.txt`);
      await fs.writeFile(outputPath, result, "utf-8");
      return outputPath;
    } catch (error) {
      logger.error(`Error processing changes: ${error.message}`);
      return null;
    }
  }
};
