const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");
const os = require("os");
const OpenAI = require("openai");
const logger = require("./logger");
const { PROMPTS } = require("../MODE_FOR_PROMPT");

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
  async processChanges(changesFilePath, mode = "review") {
    try {
      // Ensure file exists and read it
      await fs
        .access(changesFilePath)
        .catch(() => fs.writeFile(changesFilePath, "", "utf-8"));

      const changes = await fs.readFile(changesFilePath, "utf-8");

      // Validate mode
      if (!PROMPTS[mode]) {
        throw new Error(`Invalid mode: ${mode}`);
      }

      // Get LLM response
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: PROMPTS[mode] },
          { role: "user", content: changes },
        ],
      });

      // Save and return results
      const outputPath = path.join(
        fsSync.mkdtempSync(path.join(os.tmpdir(), "llm-")),
        `output_${mode}.txt`,
      );

      const result = response.choices[0].message.content;

      console.log(`\n[${mode}] Output:\n\n\n${result}\n\n\n`);

      await fs.writeFile(outputPath, result, "utf-8");
      return outputPath;
    } catch (error) {
      logger.error(`Error processing changes: ${error.message}`);
      return null;
    }
  }
};
