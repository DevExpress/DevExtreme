import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import {
  detectContainer,
  FontContainer,
  NAME_ID,
  readFontRevision,
  readGlyphCount,
  readNameRecords,
  readNames,
  readTable,
} from './font-tables';

const PACKAGE_ROOT = join(__dirname, '..');
const ICONS_DIR = join(PACKAGE_ROOT, 'icons');
const { version: packageVersion } = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8')) as { version: string };
const [MAJOR, MINOR] = packageVersion.split('.');
const VERSION = `${MAJOR}.${MINOR}`;
const RELEASE_YEAR = 2000 + Number(MAJOR);

const FORMATS = ['ttf', 'woff', 'woff2'] as const;
const CONTAINERS: Record<typeof FORMATS[number], FontContainer> = { ttf: 'sfnt', woff: 'woff', woff2: 'woff2' };
const WEB_FORMATS = ['woff', 'woff2'] as const;
const WEB_HEADER_OFFSETS: Record<typeof WEB_FORMATS[number], { metadataLength: number; privateDataLength: number }> = {
  woff: { metadataLength: 28, privateDataLength: 40 },
  woff2: { metadataLength: 32, privateDataLength: 44 },
};
const NAME_RECORDS = {
  copyright: NAME_ID.copyright,
  family: 1,
  subfamily: 2,
  uniqueId: 3,
  fullName: NAME_ID.fullName,
  version: NAME_ID.version,
  postScriptName: NAME_ID.postScriptName,
  manufacturer: 8,
  description: 10,
  vendorUrl: 11,
  license: NAME_ID.license,
  licenseUrl: NAME_ID.licenseUrl,
} as const;

const FONTS = [
  { fileName: 'dxicons', fontName: 'dxiconsgeneric' },
  { fileName: 'dxiconsmaterial', fontName: 'dxiconsmaterial' },
  { fileName: 'dxiconsfluent', fontName: 'dxiconsfluent' },
];

const EXPECTED = {
  copyright: `Copyright © 2011 - ${RELEASE_YEAR} Developer Express Inc.`,
  subfamily: 'Regular',
  version: `Version ${VERSION}`,
  fontRevision: Number(VERSION),
  manufacturer: 'Developer Express Inc.',
  description: 'DevExpress Icons',
  vendorUrl: 'https://js.devexpress.com/',
  license: 'DevExtreme Complete End User License Agreement',
  licenseUrl: 'https://js.devexpress.com/EULAs/DevExtremeComplete/',
};

const readFont = (fileName: string, format: string): Buffer => readFileSync(join(ICONS_DIR, `${fileName}.${format}`));
const readVendorId = (font: Buffer): string => readTable(font, 'OS/2').toString('latin1', 58, 62);
const readEmbeddingPermissions = (font: Buffer): number => readTable(font, 'OS/2').readUInt16BE(8);

describe('Icon fonts metadata', () => {
  test('icons/ ships exactly the checked font files', () => {
    const fontFiles = FONTS.flatMap(({ fileName }) => FORMATS.map((format) => `${fileName}.${format}`));

    expect(readdirSync(ICONS_DIR).filter((name) => !name.startsWith('.')).sort()).toEqual(fontFiles.sort());
  });

  describe.each(FONTS)('$fileName', ({ fileName, fontName }) => {
    test.each(FORMATS)('%s container matches its extension', (format) => {
      expect(detectContainer(readFont(fileName, format))).toBe(CONTAINERS[format]);
    });

    test.each(FORMATS)('%s carries exactly the DevExtreme name records', (format) => {
      const names = readNames(readFont(fileName, format));
      const records = Object.fromEntries(Object.entries(NAME_RECORDS).map(([field, nameId]) => [field, names.get(nameId)]));

      expect(records).toEqual({
        copyright: EXPECTED.copyright,
        family: fontName,
        subfamily: EXPECTED.subfamily,
        uniqueId: fontName,
        fullName: fontName,
        version: EXPECTED.version,
        postScriptName: fontName,
        manufacturer: EXPECTED.manufacturer,
        description: EXPECTED.description,
        vendorUrl: EXPECTED.vendorUrl,
        license: EXPECTED.license,
        licenseUrl: EXPECTED.licenseUrl,
      });
      expect([...names.keys()].sort((a, b) => a - b)).toEqual(Object.values(NAME_RECORDS).sort((a, b) => a - b));
    });

    test.each(FORMATS)('%s repeats every name record on each platform', (format) => {
      const font = readFont(fileName, format);
      const names = readNames(font);

      expect(readNameRecords(font).filter(({ nameId, text }) => text !== names.get(nameId))).toEqual([]);
    });

    test.each(FORMATS)('%s credits no third-party font generator', (format) => {
      const credits = readNameRecords(readFont(fileName, format)).filter(({ text }) => /icomoon|fontello/i.test(text));

      expect(credits).toEqual([]);
    });

    test.each(FORMATS)('%s leaves the OS/2 vendor ID empty', (format) => {
      expect(readVendorId(readFont(fileName, format))).toBe('\0\0\0\0');
    });

    test.each(FORMATS)('%s allows installable embedding', (format) => {
      expect(readEmbeddingPermissions(readFont(fileName, format))).toBe(0);
    });

    test.each(WEB_FORMATS)('%s has no extended metadata or private data block', (format) => {
      const font = readFont(fileName, format);
      const { metadataLength, privateDataLength } = WEB_HEADER_OFFSETS[format];

      expect({
        metadata: font.readUInt32BE(metadataLength),
        privateData: font.readUInt32BE(privateDataLength),
      }).toEqual({ metadata: 0, privateData: 0 });
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

    test('every format has the glyph set of the ttf', () => {
      const [ttf, ...otherFonts] = FORMATS.map((format) => readFont(fileName, format));

      otherFonts.forEach((font) => {
        expect(readGlyphCount(font)).toBe(readGlyphCount(ttf));
        expect(readTable(font, 'cmap').equals(readTable(ttf, 'cmap'))).toBe(true);
      });
    });
  });
});
