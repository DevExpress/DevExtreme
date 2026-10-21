import {
  existsSync, readdirSync, readFileSync, writeFileSync,
} from 'node:fs';
import path from 'node:path';

import { ICON_FONTS } from './config.ts';
import { contoursToPath } from './glyph-path.ts';
import {
  fontPath, readIconCodes, readIconNames, svgDirectory,
} from './icon-fonts.ts';
import { readTrueType } from './truetype.ts';

const packageRoot = path.resolve(import.meta.dirname, '..', '..');
const names = readIconNames(readIconCodes(packageRoot));

// An existing file keeps its design grid, so the svg renders exactly as before.
const readSize = (file: string, grid: number): { width: number; height: number } => {
  const svg = existsSync(file) ? readFileSync(file, 'utf8') : '';
  const attribute = (name: string): number => Number(new RegExp(`<svg\\b[^>]*\\s${name}="([\\d.]+)"`).exec(svg)?.[1] ?? grid);

  return { width: attribute('width'), height: attribute('height') };
};

ICON_FONTS.forEach((font) => {
  const ttf = readTrueType(readFileSync(fontPath(packageRoot, `${font.fileName}.ttf`)));
  const directory = svgDirectory(packageRoot, font);

  names.forEach((name, code) => {
    const glyphId = ttf.glyphIdByCode.get(code);

    if (!glyphId) {
      throw new Error(`${font.fileName}.ttf has no glyph for ${name} (\\${code.toString(16)})`);
    }

    const file = path.join(directory, `${name}.svg`);
    const { width, height } = readSize(file, font.grid);
    const scale = ttf.unitsPerEm / height;
    // IcoMoon put the grid on the font with the baseline snapped to a whole grid unit.
    const top = (height - Math.round((height * -ttf.descent) / ttf.unitsPerEm)) * scale;
    const viewBox = [0, -top, width * scale, ttf.unitsPerEm].map((value) => Number(value.toFixed(3))).join(' ');

    writeFileSync(file, `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}"><title>${name}</title><path d="${contoursToPath(ttf.glyphs[glyphId])}"/></svg>\n`);
  });

  const strays = readdirSync(directory).filter((file) => file.endsWith('.svg') && ![...names.values()].includes(path.basename(file, '.svg')));

  console.log(`images/icons/${font.theme}: ${names.size} svg written${strays.length ? `, not icons of the $icons map: ${strays.join(', ')}` : ''}`);
});
