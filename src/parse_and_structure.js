const fs = require('fs');

// Get input arguments (diff file and output file)
const diffFilePath = process.argv[2];
const outputFilePath = process.argv[3];

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

// Parse and save the diff
const changes = parseDiffFile(diffFilePath);
saveChangesForLLM(changes, outputFilePath);
