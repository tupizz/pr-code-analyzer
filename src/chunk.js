module.exports = function chunkByChangesPattern(text, max_length) {
  // Split text into sections by "Changes in file:" pattern
  const sections = text.split(/(?=Changes in file:)/);
  console.log(sections);
  const chunks = [];
  let currentChunk = "";
  let currentLength = 0;

  for (const section of sections) {
    // If adding this section would exceed the max_length, finalize the current chunk
    if (currentLength + section.length > max_length) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
      currentLength = 0;
    }

    // Add the section to the current chunk
    currentChunk += section;
    currentLength += section.length;
  }

  // Push the last chunk if there's any remaining content
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};
