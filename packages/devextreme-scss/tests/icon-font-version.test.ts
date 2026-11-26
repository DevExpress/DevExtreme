import { readdirSync, readFileSync } from 'fs';
import { basename, extname, join } from 'path';

import { stampFontVersion } from '../tools/icons/font-version';
import {
  NAME_ID,
  NameRecord,
  readFontRevision,
  readNameRecords,
  readNames,
} from './font-tables';

const PACKAGE_ROOT = join(__dirname, '..');
const ICONS_DIR = join(PACKAGE_ROOT, 'icons');
const { version: packageVersion } = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8')) as { version: string };
const [MAJOR, MINOR] = packageVersion.split('.');
const VERSION = `${MAJOR}.${MINOR}`;

const LONGER_VERSION = '131.12';
const HEADER_VERSION_OFFSETS: Record<string, number> = { '.woff': 20, '.woff2': 24 };

const FONT_FILES = readdirSync(ICONS_DIR).filter((name) => ['.ttf', '.woff', '.woff2'].includes(extname(name)));
const WEB_FONT_FILES = FONT_FILES.filter((name) => extname(name) in HEADER_VERSION_OFFSETS);
const FONT_FAMILIES = [...new Set(FONT_FILES.map((name) => basename(name, extname(name))))];
const SFNT_SIZE_OFFSET = 16;

const readFont = (name: string): Buffer => readFileSync(join(ICONS_DIR, name));
const readUnstampedRecords = (font: Buffer): NameRecord[] => readNameRecords(font)
  .filter(({ nameId }) => nameId !== NAME_ID.copyright && nameId !== NAME_ID.version);

describe('Icon font version stamp', () => {
  describe.each(FONT_FILES)('%s', (name) => {
    const font = readFont(name);
    const stamped = stampFontVersion(font, LONGER_VERSION);

    test('writes the release version and the copyright year into the name records', () => {
      const names = readNames(stamped);

      expect({
        copyright: names.get(NAME_ID.copyright),
        version: names.get(NAME_ID.version),
      }).toEqual({
        copyright: 'Copyright © 2011 - 2131 Developer Express Inc.',
        version: 'Version 131.12',
      });
    });

    test('writes the release revision into the head table', () => {
      expect(readFontRevision(stamped)).toBe(131.12);
    });

    test('keeps every other name record', () => {
      expect(readUnstampedRecords(stamped)).toEqual(readUnstampedRecords(font));
    });

    test('stamping the committed version back restores the file byte for byte', () => {
      expect(stamped.equals(font)).toBe(false);
      expect(stampFontVersion(stamped, VERSION).equals(font)).toBe(true);
    });
  });

  test.each(WEB_FONT_FILES)('%s header has the stamped version', (name) => {
    const offset = HEADER_VERSION_OFFSETS[extname(name)];
    const stamped = stampFontVersion(readFont(name), LONGER_VERSION);

    expect(`${stamped.readUInt16BE(offset)}.${stamped.readUInt16BE(offset + 2)}`).toBe(LONGER_VERSION);
  });

  describe.each(FONT_FAMILIES)('%s web headers', (family) => {
    const [ttf, woff, woff2] = ['ttf', 'woff', 'woff2'].map((format) => readFont(`${family}.${format}`));
    const [stampedTtf, stampedWoff, stampedWoff2] = [ttf, woff, woff2]
      .map((font) => stampFontVersion(font, LONGER_VERSION));

    test('woff declares the size of the stamped ttf', () => {
      expect(stampedWoff.readUInt32BE(SFNT_SIZE_OFFSET)).toBe(stampedTtf.length);
    });

    test('woff2 declares as much extra sfnt size as the stamped ttf gained', () => {
      expect(stampedWoff2.readUInt32BE(SFNT_SIZE_OFFSET) - woff2.readUInt32BE(SFNT_SIZE_OFFSET))
        .toBe(stampedTtf.length - ttf.length);
    });
  });
});
