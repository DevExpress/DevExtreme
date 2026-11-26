import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { stampFontVersion } from './font-version.ts';

const packageRoot = path.resolve(import.meta.dirname, '..', '..');
const iconsRoot = path.join(packageRoot, 'icons');
const FONT_EXTENSIONS = ['.ttf', '.woff', '.woff2'];

const { version: packageVersion }: { version: string } = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
const [major, minor] = packageVersion.split('.');
const version = `${major}.${minor}`;

readdirSync(iconsRoot)
  .filter((name) => FONT_EXTENSIONS.includes(path.extname(name)))
  .forEach((name) => {
    const file = path.join(iconsRoot, name);
    const font = readFileSync(file);
    const stamped = stampFontVersion(font, version);

    if (!stamped.equals(font)) {
      writeFileSync(file, stamped);
      process.stderr.write(`icons/${name}: stamped Version ${version}\n`);
    }
  });
