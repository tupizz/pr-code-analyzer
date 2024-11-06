const fs = require("fs/promises");
const chunkByChangesPattern = require("../src/chunk");

async function run() {
  const changes = await fs.readFile("changes.txt", "utf-8");
  const chunks = chunkByChangesPattern(changes, 500_000);

  for (const [index, chunk] of chunks.entries()) {
    await fs.writeFile(`chunk_${index + 1}.txt`, chunk, "utf-8");
  }
}

run();
