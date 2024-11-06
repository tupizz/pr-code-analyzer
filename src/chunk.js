module.exports = function chunkByChangesPattern(text, max_length) {
  // Split text into sections by "Changes in file:" pattern, but keep the delimiter
  const sections = text.split(/(?=Changes in file:)/).filter(Boolean);

  const chunks = [];
  let currentChunk = "";

  for (const section of sections) {
    // If current section exceeds max_length on its own, split it further
    if (section.length > max_length) {
      // Push existing chunk if any
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }

      // Split long section into smaller chunks
      let remainingSection = section;
      while (remainingSection.length > 0) {
        chunks.push(remainingSection.slice(0, max_length).trim());
        remainingSection = remainingSection.slice(max_length);
      }
      continue;
    }

    // If adding this section would exceed max_length
    if (currentChunk.length + section.length > max_length) {
      chunks.push(currentChunk.trim());
      currentChunk = section;
    } else {
      currentChunk += section;
    }
  }

  // Push the last chunk if there's any remaining content
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};
