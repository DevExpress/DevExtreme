import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { ICON_FONTS } from './config.ts';
import {
  readIconCodes, readIconNames, svgDirectory,
} from './icon-fonts.ts';

interface IcoMoonProject {
  iconSets: {
    height: number;
    icons: { paths: string[]; grid?: number; width?: number }[];
    selection: { code: number; name: string }[];
  }[];
  preferences: { fontPref: { metadata: { fontFamily: string } } };
}

const packageRoot = path.resolve(import.meta.dirname, '..', '..');
const projects = process.argv.slice(2);

if (!projects.length) {
  console.error('Usage: pnpm run icon-fonts:import <IcoMoon project .json> [...]');
  process.exit(1);
}

const names = readIconNames(readIconCodes(packageRoot));

projects.forEach((file) => {
  const project = JSON.parse(readFileSync(file, 'utf8')) as IcoMoonProject;
  const family = project.preferences.fontPref.metadata.fontFamily;
  const font = ICON_FONTS.find((config) => config.family === family);

  if (!font) {
    throw new Error(`${file}: no icon font with the family "${family}"`);
  }

  const [{ height, icons, selection }] = project.iconSets;
  const directory = svgDirectory(packageRoot, font);
  const written = new Set<string>();
  const skipped: string[] = [];

  // IcoMoon pairs icons with their selection entries by position.
  icons.forEach((icon, index) => {
    const { code, name: projectName } = selection[index];
    const name = names.get(code);

    if (!name) {
      skipped.push(`${projectName} (\\${code.toString(16)})`);
      return;
    }

    const size = icon.grid ?? 16;
    const width = ((icon.width ?? height) / height) * size;
    const body = icon.paths.map((d) => `<path d="${d}"/>`).join('\n');

    writeFileSync(
      path.join(directory, `${name}.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${size}" viewBox="0 0 ${icon.width ?? height} ${height}">\n<title>${name}</title>\n${body}\n</svg>\n`,
    );
    written.add(name);
  });

  const strays = readdirSync(directory).filter((entry) => entry.endsWith('.svg') && !written.has(path.basename(entry, '.svg')));

  console.log(`images/icons/${font.theme}: ${written.size} svg from ${path.basename(file)}`);

  if (skipped.length) {
    console.log(`  not in the $icons map, skipped: ${skipped.join(', ')}`);
  }

  if (strays.length) {
    console.log(`  not in the project, left as is: ${strays.join(', ')}`);
  }
});
