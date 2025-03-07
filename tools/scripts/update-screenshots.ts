const fs = require('fs').promises;
const path = require('path');

const excludeMask = /_diff|_etalon|_mask/i;
const excludeDirectories = /node_modules|screenshots|artifacts|.idea|.project|bundles|build|tmp|dist|cache/i;

async function findFileRecursively(dir: string, filename: string): Promise<string | null> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (excludeDirectories.test(entry.name)) {
        continue;
      }

      const fullPath = path.join(dir, entry.name);

      if (entry.isFile() && entry.name === filename) {
        return fullPath;
      } else if (entry.isDirectory()) {
        const found = await findFileRecursively(fullPath, filename);

        if (found) return found;
      }
    }
  } catch (err) {
    console.error(`Error during file finding ${dir}:`, err);
    process.exit(1);
  }

  return null;
}

async function main(sourceDir: string, destDir: string) {
  const newFiles: string[] = [];
  let replacedCount = 0;
  let files;

  try {
    files = await fs.readdir(sourceDir);
  } catch (err) {
    console.error('Error of reading source directory:', err);
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (excludeMask.test(file)) {
      continue;
    }

    const sourceFilePath = path.join(sourceDir, file);

    let stats;
    try {
      stats = await fs.stat(sourceFilePath);
    } catch (err) {
      console.error(`Error of getting stats of ${file}:`, err);
      continue;
    }
    if (!stats.isFile()) continue;

    let destFilePath = await findFileRecursively(destDir, file);

    if (destFilePath) {
      try {
        await fs.unlink(destFilePath);
      } catch (err) {
        console.error(`Error of deleting ${destFilePath}:`, err);
        continue;
      }
      try {
        await fs.rename(sourceFilePath, destFilePath);
      } catch (err) {
        console.error(`Error of moving ${file}:`, err);
      }

      replacedCount++;
    } else {
      newFiles.push(file);
    }

    process.stdout.write(`\r${i}/${files.length} `);
  }
  process.stdout.write(`\r${files.length}/${files.length} Done!\n`);

  console.log(`${replacedCount} files replaced`);
  console.log(`${newFiles.length} new files found:`);
  for (const file of newFiles) {
    console.log(file);
  }
}

const destDir = process.argv[2];
const sourceDir = process.argv[3];

main(sourceDir, destDir).catch(err => console.error(err));
