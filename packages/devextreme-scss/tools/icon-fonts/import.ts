import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { ICON_FONTS } from './config.ts';
import {
  readIconCodes, readIconNames, svgDirectory,
} from './icon-fonts.ts';

interface IcoMoonSelection {
  icons: { properties: { code: number; name: string } }[];
  preferences: { fontPref: { metadata: { fontFamily: string } } };
}

const packageRoot = path.resolve(import.meta.dirname, '..', '..');
const [exportDirectory, ...requested] = process.argv.slice(2);

if (!exportDirectory) {
  console.error('Usage: pnpm run icon-fonts:import <unzipped IcoMoon svg export> [icon name ...]');
  process.exit(1);
}

const selection = JSON.parse(readFileSync(path.join(exportDirectory, 'selection.json'), 'utf8')) as IcoMoonSelection;
const family = selection.preferences.fontPref.metadata.fontFamily;
const font = ICON_FONTS.find((config) => config.family === family);

if (!font) {
  throw new Error(`${exportDirectory}: no icon font with the family "${family}"`);
}

const names = readIconNames(readIconCodes(packageRoot));
const icons = selection.icons
  .map(({ properties }) => ({ exported: properties.name, name: names.get(properties.code) }))
  .filter(({ name }) => name && (!requested.length || requested.includes(name)));
const unknown = requested.filter((name) => !icons.some((icon) => icon.name === name));

if (unknown.length) {
  throw new Error(`${exportDirectory} has no ${unknown.join(', ')}`);
}

icons.forEach(({ exported, name }) => {
  const svg = readFileSync(path.join(exportDirectory, 'SVG', `${exported}.svg`), 'utf8');

  writeFileSync(path.join(svgDirectory(packageRoot, font), `${name}.svg`), svg.replace(/<!--[\s\S]*?-->\s*/g, ''));
});

console.log(`images/icons/${font.theme}: ${icons.map(({ name }) => name).join(', ')}`);
