#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const sendChangesToLLM = require('../src/send_to_llm');

/**
 * Parses the diff file and extracts changes.
 * @param {string} diffFilePath - Path to the diff file.
 * @returns {string[]} - Array of changes with added or removed lines.
 */
function parseDiffFile(diffFilePath) {
  const changes = [];
  let currentFile = null;

  const diffContent = fs.readFileSync(diffFilePath, 'utf-8');
  const diffLines = diffContent.split('\n');

  diffLines.forEach((line) => {
    if (line.startsWith('diff --git')) {
      currentFile = line.split(' ')[2].replace('a/', '');
      changes.push(`\nChanges in file: ${currentFile}\n`);
    } else if (line.startsWith('+') && !line.startsWith('+++')) {
      changes.push(`Added: ${line.slice(1)}\n`);
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      changes.push(`Removed: ${line.slice(1)}\n`);
    }
  });

  return changes;
}

/**
 * Saves the structured changes to an output file.
 * @param {string[]} changes - Array of structured changes.
 * @param {string} outputFilePath - Path to the output file.
 */
function saveChangesForLLM(changes, outputFilePath) {
  fs.writeFileSync(outputFilePath, changes.join(''), 'utf-8');
  console.log(`Structured changes saved to ${outputFilePath}`);
}

async function run() {
  // Check if branch name is provided
  if (process.argv.length < 3) {
    console.error('Usage: node script_name.js <branch_name> <mode> <target_branch>');
    process.exit(1);
  }
  
  const BRANCH_NAME = process.argv[2]; // The branch name to review
  const MODE = process.argv[3]; // The mode to use, either 'review' or 'description'
  const TARGET_BRANCH = process.argv[4] || 'development'; // The target branch to compare against
  
  // Create a unique temporary directory
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pr_diff-'));
  
  const DIFF_FILE = path.join(tmpDir, 'pr_diff.txt');
  const OUTPUT_FILE = path.join(tmpDir, 'pr_changes_for_llm.txt');
  // const REVIEW_FILE = path.join(tmpDir, 'pr_review.txt');
  
  try {
    // Fetch the latest changes from the remote
    console.log('Fetching latest changes from the remote...');
    execSync('git fetch origin', { stdio: 'inherit' });
    
    // Check out the PR branch
    console.log(`Checking out branch ${BRANCH_NAME}...`);
    execSync(`git checkout ${BRANCH_NAME}`, { stdio: 'inherit' });
    
    // Generate the diff between the PR branch and the target branch
    console.log(`Generating diff between ${BRANCH_NAME} and ${TARGET_BRANCH}...`);
    const diffCommand = `git diff origin/${TARGET_BRANCH}...HEAD`;
    const diffOutput = execSync(diffCommand, { encoding: 'utf8' });
    fs.writeFileSync(DIFF_FILE, diffOutput);
    console.log(`Diff saved to ${DIFF_FILE}`);
    
    // Run the Node.js script to parse the diff and structure it
    console.log('Running parse_and_structure.js...');
    const diffFilePath = DIFF_FILE;
    const outputFilePath = OUTPUT_FILE;
    const changes = parseDiffFile(diffFilePath);
    saveChangesForLLM(changes, outputFilePath);
    console.log(`Structured diff saved to ${OUTPUT_FILE}`);
    
    console.log('Sending structured diff to LLM for review...');
    const reviewFilePath = await sendChangesToLLM(OUTPUT_FILE, MODE);
    console.log(`Review saved to ${reviewFilePath}`);
  } catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
  }
}

run();
