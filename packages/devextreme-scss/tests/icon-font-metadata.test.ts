import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import {
  detectContainer,
  FontContainer,
  NAME_ID,
  readFontRevision,
  readNameRecords,
  readNames,
} from './font-tables';

const ICONS_DIR = join(__dirname, '..', 'icons');
const VERSION = '26.2';

const FORMATS = ['ttf', 'woff', 'woff2'] as const;
const CONTAINERS: Record<typeof FORMATS[number], FontContainer> = { ttf: 'sfnt', woff: 'woff', woff2: 'woff2' };

const FONTS = [
  { fileName: 'dxicons', fontName: 'dxiconsgeneric' },
  { fileName: 'dxiconsmaterial', fontName: 'dxiconsmaterial' },
  { fileName: 'dxiconsfluent', fontName: 'dxiconsfluent' },
];

const EXPECTED = {
  copyright: 'Copyright (c) Developer Express Inc.',
  version: `Version ${VERSION}`,
  fontRevision: Number(VERSION),
  license: 'SEE LICENSE IN LICENSE.md',
  licenseUrl: 'https://js.devexpress.com/Licensing/',
};

const readFont = (fileName: string, format: string): Buffer => readFileSync(join(ICONS_DIR, `${fileName}.${format}`));

describe('Icon fonts metadata', () => {
  test('icons/ ships exactly the checked font files', () => {
    const fontFiles = FONTS.flatMap(({ fileName }) => FORMATS.map((format) => `${fileName}.${format}`));

    expect(readdirSync(ICONS_DIR).filter((name) => !name.startsWith('.')).sort()).toEqual(fontFiles.sort());
  });

  describe.each(FONTS)('$fileName', ({ fileName, fontName }) => {
    test.each(FORMATS)('%s container matches its extension', (format) => {
      expect(detectContainer(readFont(fileName, format))).toBe(CONTAINERS[format]);
    });

    test.each(FORMATS)('%s carries the DevExtreme copyright, license and version', (format) => {
      const names = readNames(readFont(fileName, format));

      expect({
        copyright: names.get(NAME_ID.copyright),
        fullName: names.get(NAME_ID.fullName),
        version: names.get(NAME_ID.version),
        postScriptName: names.get(NAME_ID.postScriptName),
        license: names.get(NAME_ID.license),
        licenseUrl: names.get(NAME_ID.licenseUrl),
      }).toEqual({
        copyright: EXPECTED.copyright,
        fullName: fontName,
        version: EXPECTED.version,
        postScriptName: fontName,
        license: EXPECTED.license,
        licenseUrl: EXPECTED.licenseUrl,
      });
    });

    test.each(FORMATS)('%s has the release revision', (format) => {
      expect(readFontRevision(readFont(fileName, format))).toBe(EXPECTED.fontRevision);
    });

    test('name records are identical in every format', () => {
      const [ttfRecords, ...otherRecords] = FORMATS.map((format) => readNameRecords(readFont(fileName, format)));

      otherRecords.forEach((records) => {
        expect(records).toEqual(ttfRecords);
      });
    });
  });
});
