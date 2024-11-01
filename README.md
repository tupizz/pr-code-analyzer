# PR Review Tool

![npm version](https://img.shields.io/npm/v/pr-reviewer)
![License](https://img.shields.io/github/license/tupizz/pr-code-analyzer)

A CLI tool for automated code review and PR description generation using LLM (Language Learning Model). This tool analyzes Git diffs, structures the changes, and leverages AI to provide insightful code reviews and PR descriptions.

## Features

A Node.js CLI tool that automates code reviews using LLM technology. Features:
• 🔍 Automated code review generation
• 📝 Smart PR description creation
• 🎯 Multiple review modes (brief/detailed/description)
• 📊 Git diff analysis
• 🚀 Easy-to-use CLI interface
• 📋 Comprehensive logging

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git installed and configured
- OpenAI API key

### OpenAI API Key Configuration

Set up your OpenAI API key as an environment variable:

```bash
# Linux/macOS
export OPEN_API_KEY=your_openai_api_key

# Windows (Command Prompt)
set OPEN_API_KEY=your_openai_api_key

# Windows (PowerShell)
$env:OPEN_API_KEY="your_openai_api_key"
```

## Installation

1. Install the required dependencies:

```bash
npm install commander winston
```

2. Install the tool globally:

```bash
npm install -g .
```

## Usage

### Basic Command Structure

```bash
pr-reviewer [options]
```

### Options

```
Options:
  -V, --version                    output version number
  -b, --branch <branch>           branch name to review (required)
  -m, --mode <mode>               review mode (review/description) (default: "review")
  -t, --target-branch <branch>    target branch to compare against (default: "development")
  -v, --verbose                   enable verbose logging
  -o, --output <output>           output folder (default: "tmp")
  -h, --help                      display help for command
```

### Examples

```bash
# Basic review of a feature branch
pr-reviewer -b feature/new-feature

# Generate detailed description comparing against main branch
pr-reviewer -b feature/new-feature -m description -t main

# Review with verbose logging
pr-reviewer -b feature/new-feature -v

# Show help
pr-reviewer --help
```

## Review Modes

1. **review** (default)

   - Performs a detailed code review
   - Identifies potential issues
   - Suggests improvements
   - Reviews code style and best practices

2. **description**

   - Generates comprehensive PR description
   - Creates diagrams where applicable
   - Lists key changes and impacts
   - Provides technical context

3. **brief**
   - Quick summary of changes
   - High-level impact analysis
   - Key points for reviewers

## Output

The tool generates several output files:

- `combined.log`: Complete execution log
- `error.log`: Error-specific logging
- Temporary diff files (automatically cleaned up)
- LLM review output (saved to specified location)

## How It Works

1. **Initialization**

   - Parses command-line arguments
   - Validates input parameters
   - Sets up logging system

2. **Git Operations**

   - Fetches latest changes
   - Checks out specified branch
   - Generates diff against target branch

3. **Diff Processing**

   - Parses Git diff output
   - Structures changes by file
   - Identifies additions and removals

4. **LLM Integration**

   - Sends structured changes to LLM
   - Processes LLM response
   - Generates formatted output

5. **Cleanup**
   - Removes temporary files
   - Logs operation completion
   - Handles any errors

## Error Handling

The tool includes comprehensive error handling for:

- Git operation failures
- File system issues
- LLM communication problems
- Invalid input parameters

Errors are:

- Logged to error.log
- Displayed in console with context
- Handled gracefully with proper cleanup

## Development

### Project Structure

```
pr-reviewer/
├── src/
│   ├── GitOperations.js
│   ├── DiffParser.js
│   ├── PRReviewer.js
│   ├── LLMAdapter.js
│   └── send_to_llm.js
├── logs/
│   ├── combined.log
│   └── error.log
└── package.json
```

### Adding New Features

1. Follow the existing class structure
2. Implement error handling
3. Add appropriate logging
4. Update tests if applicable

## Troubleshooting

Common issues and solutions:

1. **Git access errors**

   - Ensure Git is properly configured
   - Check repository permissions

2. **API key issues**

   - Verify OPEN_API_KEY is set
   - Check key validity

3. **Parsing errors**
   - Ensure branch exists
   - Check for valid diff output

## Customizing Prompts

The tool uses customizable prompts for different review modes. These prompts can be modified by editing the `MODE_FOR_PROMPT.js` file in the project root.

### Prompt Structure

```js
// prompts.js
module.exports = {
  PROMPTS: {
    review: `[Your custom review prompt]`,
    brief: `[Your custom brief prompt]`,
    description: `[Your custom description prompt]`,
  },
};
```

### Available Modes

1. **review**: Used for detailed code reviews
2. **brief**: Used for quick summaries
3. **description**: Used for PR descriptions

### Customizing Prompts

To modify the prompts:

1. Locate `MODE_FOR_PROMPT.js` in the project root
2. Edit the desired prompt in the `PROMPTS` object
3. Save the file - changes will take effect immediately

### Example Customization

```js
// prompts.js
module.exports = {
  PROMPTS: {
    review: `
      As a senior developer, review this code focusing on:
      - Performance implications
      - Security concerns
      - Best practices
      - Potential edge cases
      Please be constructive and specific.
    `,
    brief: `
      Provide a 2-3 sentence summary of the changes.
      Include:
      - Main purpose 🎯
      - Key technical changes 🔧
      - Impact on users 👥
    `,
    description: `
      Create a comprehensive PR description with:
      1. Overview of changes
      2. Technical implementation details
      3. Testing considerations
      4. Visual diagrams where applicable
    `,
  },
};
```

### Best Practices for Custom Prompts

1. **Be Specific**: Clearly define what you want the LLM to focus on
2. **Format Consistently**: Use clear formatting for better readability
3. **Include Guidelines**: Add specific instructions for output format
4. **Keep it Focused**: Each prompt should have a single clear purpose
5. **Test Changes**: Verify new prompts generate desired outputs

### Adding New Modes

To add a new review mode:

1. Add your new prompt to the `PROMPTS` object:

   ```js
   module.exports = {
     PROMPTS: {
       // Existing prompts...
       newMode: `Your new prompt here`,
     },
   };
   ```

2. Use the new mode:
   ```bash
   pr-reviewer -b feature/branch -m newMode
   ```

## License

MIT License - see LICENSE.md for details

## Support

For bugs and feature requests, please create an issue in the repository.

---

**Note**: This tool is in active development. Please report any issues or suggestions for improvement.

### Pushing to NPM

```bash
# Increment version
npm version patch|minor|major

# Publish
npm publish
```
