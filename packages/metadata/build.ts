import { promises as fs } from 'fs';
import * as path from 'path';

const ARTIFACTS = [
  'Declarations.json',
  'modules-meta.json',
  'NGMetaData.json',
  'StrongMetaData.json',
  'integration-data.json',
];

async function main() {
  const srcDir = path.resolve(__dirname, 'artifacts');
  const distDir = path.resolve(__dirname, 'dist');
  await fs.mkdir(distDir, { recursive: true });
  for (const file of ARTIFACTS) {
    const src = path.join(srcDir, file);
    const dest = path.join(distDir, file);
    await fs.copyFile(src, dest);
  }
  console.log('Artifacts copied to dist/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
