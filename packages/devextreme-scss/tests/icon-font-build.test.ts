import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';

import { ICON_FONTS } from '../tools/icon-fonts/config';
import { contoursToPath, pathToContours } from '../tools/icon-fonts/glyph-path';
import { buildIconFonts, fontFileNames, fontPath } from '../tools/icon-fonts/icon-fonts';
import { readTrueType } from '../tools/icon-fonts/truetype';

const PACKAGE_ROOT = join(__dirname, '..');

const sha256 = (data: Buffer | undefined): string => (data ? createHash('sha256').update(data).digest('hex') : 'not built');

describe('Icon fonts build', () => {
  let built = new Map<string, Buffer>();

  beforeAll(async () => {
    const files = await buildIconFonts(PACKAGE_ROOT);

    built = new Map(files.map(({ fileName, data }) => [fileName, data]));
  });

  test.each(fontFileNames())('icons/%s is the build of images/icons (pnpm run icon-fonts:build)', (fileName) => {
    const committed = readFileSync(fontPath(PACKAGE_ROOT, fileName));

    expect(sha256(built.get(fileName))).toBe(sha256(committed));
  });

  test.each(ICON_FONTS)('svg paths keep every outline of $fileName.ttf', ({ fileName }) => {
    const { glyphs } = readTrueType(readFileSync(fontPath(PACKAGE_ROOT, `${fileName}.ttf`)));
    const changed = glyphs
      .map((contours, glyphId) => ({ contours, glyphId }))
      .filter(({ contours }) => {
        const roundTrip = pathToContours(contoursToPath(contours));

        return JSON.stringify(roundTrip) !== JSON.stringify(contours);
      })
      .map(({ glyphId }) => glyphId);

    expect(changed).toEqual([]);
  });
});
