 
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const os = require('os');

/**
 * Sends the PR changes to OpenAI's GPT-4 model for review.
 * @param {string} changesFilePath - Path to the file containing structured PR changes.
 */
module.exports = async function sendChangesToLLM(changesFilePath, mode = 'review') {
  // create the file if it doesn't exist
  if (!fs.existsSync(changesFilePath)) {
    fs.writeFileSync(changesFilePath, '', 'utf-8');
  }

  try {
    // Read the structured changes from the file
    const changes = fs.readFileSync(changesFilePath, 'utf-8');

    if (!process.env.OPEN_API_KEY) {
      throw new Error('OPEN_API_KEY is not set');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPEN_API_KEY,
    });

    const codeReviewPrompt = `
    You are a code reviewer. Please review the following PR changes. Find bugs, mistakes, and potential issues. Don't be too picky. Be very detailed and specific. Please be very kind and helpful. Don't be too harsh. Be very detailed and specific.
    `;

    const briefExplanationPrompt = `
    Please give a brief explanation of the changes in a few sentences, be direct, less verbose. Use a simple language and add emojis to make it more fun. Don't need to add too much detail, just a brief explanation.
    IMPORTANT:
    - Don't use mardowns or code formatting. The output should be a simple text.
    `;

    const codeDescriptionPrompt = `
    Please describe the changes this PR is making in a few sentences and topics please.
    - Summarize the changes into few topics, but don't be too general. Explain the changes and the reasons for them.
    - When making sense, please add mermaid diagrams to explain the changes.
    - Don't add too many topics, make it easy to read. a Product person should be able to read this and understand the changes.
    - Don't be too verbose. Be very direct and to the point.
    `;

    const mapModeToPrompt = {
      review: codeReviewPrompt,
      description: codeDescriptionPrompt,
      brief: briefExplanationPrompt,
    };

    // Send the changes to GPT-4 for review
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: mapModeToPrompt[mode] },
        { role: 'user', content: changes },
      ],
    });

    // Output the response from GPT-4
    const response = completion.choices[0].message.content;
    console.log(`\n\n\n[${mode}] Feedback:\n\n\n${response}\n\n\n`);
    console.log('\n\n\n Saving response to file...\n\n\n');

    // Save the response to a temporary file
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'llm-'));
    const outputFilePath = path.join(tempDir, `output_${mode}.txt`);
    fs.writeFileSync(outputFilePath, response, 'utf-8');

    return outputFilePath;
  } catch (error) {
    console.error('Error sending changes to LLM:', error);
    return null;
  }
};