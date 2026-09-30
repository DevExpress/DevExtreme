import { createHash } from 'crypto';
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
} from './font-tables';

const PACKAGE_ROOT = join(__dirname, '..');
const FONTS_DIR = join(PACKAGE_ROOT, 'fonts');
const TYPOGRAPHY_SCSS = join(PACKAGE_ROOT, 'scss/widgets/material/typography/_index.scss');
const LICENSE_FILE = 'Roboto-OFL.txt';
const LICENSE_SHA256 = '061402327a96aadb0bfb694a960ed289ecd38d383e396243831ab81feb109c41';
const VERSION = '3.015';

const FORMATS = ['ttf', 'woff', 'woff2'] as const;
const CONTAINERS: Record<typeof FORMATS[number], FontContainer> = { ttf: 'sfnt', woff: 'woff', woff2: 'woff2' };

const WEIGHTS = [
  {
    weight: 300,
    fullName: 'Roboto Light',
    postScriptName: 'Roboto-Light',
    ttfSha256: '9043dbdf077dd7d72d5c9c533737513e13202f881c7f5fd5ce9552abd422a9b6',
  },
  {
    weight: 400,
    fullName: 'Roboto',
    postScriptName: 'Roboto-Regular',
    ttfSha256: '1ee8483b140ddfbbb8548838935a9878a6eda018aa1c39f4bf29d65b14a052db',
  },
  {
    weight: 500,
    fullName: 'Roboto Medium',
    postScriptName: 'Roboto-Medium',
    ttfSha256: '64ef7cb83e2a0c8c3592cbb2d3d9d7aa1185adcf885152776984d89706a61c8a',
  },
  {
    weight: 700,
    fullName: 'Roboto Bold',
    postScriptName: 'Roboto-Bold',
    ttfSha256: '28874d37d069dc482e8486d5db06a3fcb31ab9c38b37c210afaf14bc7b550535',
  },
];

const EXPECTED = {
  copyright: 'Copyright 2011 The Roboto Project Authors (https://github.com/googlefonts/roboto-classic)',
  version: `Version ${VERSION}; 2026`,
  fontRevision: Number(VERSION),
  glyphCount: 1326,
  trademark: 'Roboto is a trademark of Google.',
  license: 'This Font Software is licensed under the SIL Open Font License, Version 1.1. This license is available with a FAQ at: https://openfontlicense.org',
  licenseUrl: 'https://openfontlicense.org',
};

const fontFileName = (weight: number, format: string): string => `Roboto-${weight}.${format}`;
const readFont = (weight: number, format: string): Buffer => readFileSync(join(FONTS_DIR, fontFileName(weight, format)));
const sha256 = (data: Buffer): string => createHash('sha256').update(data).digest('hex');

describe('Roboto fallback fonts', () => {
  const fontFiles = WEIGHTS
    .flatMap(({ weight }) => FORMATS.map((format) => fontFileName(weight, format)))
    .sort();

  test('fonts/ ships exactly the Roboto files and their license', () => {
    expect(readdirSync(FONTS_DIR).filter((name) => !name.startsWith('.')).sort()).toEqual([...fontFiles, LICENSE_FILE].sort());
  });

  test('the license file starts with the copyright of the fonts and carries the OFL 1.1 text', () => {
    const text = readFileSync(join(FONTS_DIR, LICENSE_FILE), 'utf8').replace(/\r\n/g, '\n');

    expect(text.split('\n')[0]).toBe(EXPECTED.copyright);
    expect(text).toContain('SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007');
    expect(sha256(Buffer.from(text))).toBe(LICENSE_SHA256);
  });

  test('the material typography references exactly the shipped font files', () => {
    const scss = readFileSync(TYPOGRAPHY_SCSS, 'utf8');
    const referenced: string[] = [];
    const urlPattern = /url\("fonts\/([^"]+)"\)/g;
    let match = urlPattern.exec(scss);

    while (match) {
      referenced.push(match[1]);
      match = urlPattern.exec(scss);
    }

    expect(referenced.sort()).toEqual(fontFiles);
  });

  describe.each(WEIGHTS)('Roboto-$weight', ({
    weight, fullName, postScriptName, ttfSha256,
  }) => {
    test('the ttf is the upstream release file', () => {
      expect(sha256(readFont(weight, 'ttf'))).toBe(ttfSha256);
    });

    test.each(FORMATS)('%s container matches its extension', (format) => {
      expect(detectContainer(readFont(weight, format))).toBe(CONTAINERS[format]);
    });

    test.each(FORMATS)('%s carries the Roboto 3 name records', (format) => {
      const names = readNames(readFont(weight, format));

      expect({
        copyright: names.get(NAME_ID.copyright),
        fullName: names.get(NAME_ID.fullName),
        version: names.get(NAME_ID.version),
        postScriptName: names.get(NAME_ID.postScriptName),
        trademark: names.get(NAME_ID.trademark),
        license: names.get(NAME_ID.license),
        licenseUrl: names.get(NAME_ID.licenseUrl),
      }).toEqual({
        copyright: EXPECTED.copyright,
        fullName,
        version: EXPECTED.version,
        postScriptName,
        trademark: EXPECTED.trademark,
        license: EXPECTED.license,
        licenseUrl: EXPECTED.licenseUrl,
      });
    });

    test.each(FORMATS)('%s has the release glyph set and revision', (format) => {
      const font = readFont(weight, format);

      expect(readGlyphCount(font)).toBe(EXPECTED.glyphCount);
      expect(readFontRevision(font)).toBe(EXPECTED.fontRevision);
    });

    test('name records are identical in every format', () => {
      const [ttfRecords, ...otherRecords] = FORMATS.map((format) => readNameRecords(readFont(weight, format)));

      otherRecords.forEach((records) => {
        expect(records).toEqual(ttfRecords);
      });
    });
  });
});
