import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import {
  detectContainer,
  FontContainer,
  NAME_ID,
  readFontRevision,
  readNameRecords,
  readNames,
  readTable,
} from './font-tables';

const PACKAGE_ROOT = join(__dirname, '..');
const ICONS_DIR = join(PACKAGE_ROOT, 'icons');
const { version: packageVersion } = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8')) as { version: string };
const VERSION = packageVersion.split('.').slice(0, 2).join('.');
const YEAR = '2026';

const FORMATS = ['ttf', 'woff', 'woff2'] as const;
const CONTAINERS: Record<typeof FORMATS[number], FontContainer> = { ttf: 'sfnt', woff: 'woff', woff2: 'woff2' };
const ICON_NAME_ID = { ...NAME_ID, description: 10, vendorUrl: 11 } as const;

const FONTS = [
  { fileName: 'dxicons', fontName: 'dxiconsgeneric' },
  { fileName: 'dxiconsmaterial', fontName: 'dxiconsmaterial' },
  { fileName: 'dxiconsfluent', fontName: 'dxiconsfluent' },
];

const EXPECTED = {
  copyright: `Copyright (c) 2012 - ${YEAR} Developer Express Inc. ALL RIGHTS RESERVED`,
  version: `Version ${VERSION}`,
  fontRevision: Number(VERSION),
  description: 'DevExpress Icons',
  vendorUrl: 'https://www.devexpress.com/Support/EULAs',
  license: 'SEE LICENSE IN LICENSE.md',
  licenseUrl: 'https://js.devexpress.com/Licensing/',
};

const readFont = (fileName: string, format: string): Buffer => readFileSync(join(ICONS_DIR, `${fileName}.${format}`));
const readVendorId = (font: Buffer): string => readTable(font, 'OS/2').toString('latin1', 58, 62);

describe('Icon fonts metadata', () => {
  test('icons/ ships exactly the checked font files', () => {
    const fontFiles = FONTS.flatMap(({ fileName }) => FORMATS.map((format) => `${fileName}.${format}`));

    expect(readdirSync(ICONS_DIR).filter((name) => !name.startsWith('.')).sort()).toEqual(fontFiles.sort());
  });

  describe.each(FONTS)('$fileName', ({ fileName, fontName }) => {
    test.each(FORMATS)('%s container matches its extension', (format) => {
      expect(detectContainer(readFont(fileName, format))).toBe(CONTAINERS[format]);
    });

    test.each(FORMATS)('%s carries the DevExpress name records', (format) => {
      const names = readNames(readFont(fileName, format));

      expect({
        copyright: names.get(ICON_NAME_ID.copyright),
        fullName: names.get(ICON_NAME_ID.fullName),
        version: names.get(ICON_NAME_ID.version),
        postScriptName: names.get(ICON_NAME_ID.postScriptName),
        description: names.get(ICON_NAME_ID.description),
        vendorUrl: names.get(ICON_NAME_ID.vendorUrl),
        license: names.get(ICON_NAME_ID.license),
        licenseUrl: names.get(ICON_NAME_ID.licenseUrl),
      }).toEqual({
        copyright: EXPECTED.copyright,
        fullName: fontName,
        version: EXPECTED.version,
        postScriptName: fontName,
        description: EXPECTED.description,
        vendorUrl: EXPECTED.vendorUrl,
        license: EXPECTED.license,
        licenseUrl: EXPECTED.licenseUrl,
      });
    });

    test.each(FORMATS)('%s credits no third-party font generator', (format) => {
      const credits = readNameRecords(readFont(fileName, format)).filter(({ text }) => /icomoon|fontello/i.test(text));

      expect(credits).toEqual([]);
    });

    test.each(FORMATS)('%s leaves the OS/2 vendor ID empty', (format) => {
      expect(readVendorId(readFont(fileName, format))).toBe('\0\0\0\0');
    });

    test.each(FORMATS)('%s has the release revision', (format) => {
      expect(readFontRevision(readFont(fileName, format))).toBe(EXPECTED.fontRevision);
    });

    test('name records are identical in every format', () => {
      const [ttfRecords, ...otherRecords] = FORMATS
        .map((format) => readNameRecords(readFont(fileName, format)));

      otherRecords.forEach((records) => {
        expect(records).toEqual(ttfRecords);
      });
    });
  });
});
