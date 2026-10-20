import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { buildIconFonts, fontPath } from './icon-fonts.ts';

const packageRoot = path.resolve(import.meta.dirname, '..', '..');
const check = process.argv.includes('--check');
const stale = (await buildIconFonts(packageRoot)).filter(({ fileName, data }) => {
  const committed = fontPath(packageRoot, fileName);

  return !existsSync(committed) || !readFileSync(committed).equals(data);
});
const staleList = stale.map(({ fileName }) => `icons/${fileName}`).join(', ');

if (check) {
  if (stale.length) {
    console.error(`${staleList} differ from a build of images/icons. Run "pnpm run icon-fonts:build".`);
    process.exitCode = 1;
  } else {
    console.log('icons/ matches a build of images/icons');
  }
} else {
  stale.forEach(({ fileName, data }) => writeFileSync(fontPath(packageRoot, fileName), data));
  console.log(stale.length ? `Updated ${staleList}` : 'icons/ is up to date');
}
