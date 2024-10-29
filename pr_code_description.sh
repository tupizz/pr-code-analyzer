#!/bin/bash

# Check if branch name is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <branch_name>"
    exit 1
fi

BRANCH_NAME=$1
TARGET_BRANCH="development"  # Adjust the target branch if needed
DIFF_FILE="tmp/pr_diff.txt"
OUTPUT_FILE="tmp/pr_changes_for_llm.txt"
DESCRIPTION_FILE="output/pr_description.txt"

# Fetch the latest changes from the remote
git fetch origin

# Check out the PR branch
git checkout $BRANCH_NAME

# Generate the diff between the PR branch and the target branch (e.g., main)
git diff origin/$TARGET_BRANCH...HEAD > $DIFF_FILE

# Run the Node.js script to parse the diff and structure it
node src/parse_and_structure.js $DIFF_FILE $OUTPUT_FILE

echo "Structured diff saved to $OUTPUT_FILE"

# Optional: Call an LLM for review (uncomment if needed)
node src/send_to_llm.js $OUTPUT_FILE $DESCRIPTION_FILE description

