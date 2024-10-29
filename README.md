# PR Review Tool

This tool allows users to generate structured changes from Git diffs and send them to a language model (LLM) for review or description. It parses changes in a specific Git branch, structures the added and removed lines, and then sends them to an external service for further processing.

## Prerequisites

1. Ensure that Node.js and npm are installed on your system.
2. You must have an environment variable `OPEN_API_KEY` set to your OpenAI API key. The tool relies on this key to send the structured diff to the language model for review.

### Setting the OpenAI API Key:

Before running the tool, set the `OPEN_API_KEY` environment variable in your terminal. Use the following command depending on your operating system:

- For **Linux/macOS**:

  ```bash
  export OPEN_API_KEY=your_openai_api_key
  ```

- For **Windows** (Command Prompt):

  ```cmd
  set OPEN_API_KEY=your_openai_api_key
  ```

- For **Windows** (Powershell):

  ```powershell
  $env:OPEN_API_KEY="your_openai_api_key"
  ```

## Installation

To install the tool globally on your machine, navigate to the directory where the project is located and run the following command:

```bash
npm install -g .
```

This installs the tool globally, making it accessible from anywhere on your system.

## Usage

Once installed, you can invoke the tool using the following command:

```bash
pr_review <branch_name> <mode> <target_branch>
```

### Arguments:

1. **branch_name**: The name of the branch for which the diff should be generated. Example: `feature/PB-29024-transcript-v2`
   
2. **mode**: Specifies the operation mode. It can be either:
   - `brief`: Send changes to the LLM for a brief description.
   - `review`: Send changes to the LLM for a full review.
   - `description`: Send changes to the LLM for a more robust description, with diagrams and topics, nice to be used in PR Description.
   
3. **target_branch**: (Optional) The branch to compare against. Default is `development`.

### Example:

To run the tool for a feature branch and generate a brief description of changes compared to the `development` branch:

```bash
pr_review feature/example-branch brief dev
```

This command will:
1. Fetch the latest changes from the remote repository.
2. Check out the specified branch (`feature/example-branch`).
3. Generate a diff between the specified branch and the target branch (`dev`).
4. Parse the diff to identify added or removed lines.
5. Save the structured diff in a temporary file.
6. Send the structured changes to the LLM for review or a description based on the mode.
7. Save the LLM's response.

## How It Works

1. **Fetching and Diff Generation**: The tool fetches the latest changes from the remote repository and generates a diff between the specified branch and the target branch.
2. **Parsing the Diff**: The diff is parsed, and the added/removed lines are structured by file.
3. **Saving Changes**: The structured changes are saved to a temporary file.
4. **Sending to LLM**: The tool sends the structured changes to the LLM for review or description, depending on the mode selected.
5. **Output**: The tool will log where the final structured changes and LLM output are saved.

## Error Handling

If any errors occur during execution (e.g., network issues, Git problems), the tool will log the error and terminate the process.

## Additional Notes

- Ensure you have the necessary permissions to fetch and checkout branches from the repository.
- The LLM communication is handled by the `sendChangesToLLM` function located in `src/send_to_llm`.

## License

This tool is licensed under the MIT License.