/* eslint-disable no-bitwise */
import { compress } from 'wawoff2';

import {
  ASCENT, DESCENT, UNITS_PER_EM, type Contour,
} from './outline.ts';

export interface Version {
  major: number;
  minor: number;
}

export interface FontNames {
  family: string;
  copyright: string;
  manufacturer: string;
  description: string;
  vendorUrl: string;
  license: string;
  licenseUrl: string;
}

export interface IconGlyph {
  code: number;
  contours: Contour[];
}

export interface IconFontSource {
  names: FontNames;
  version: Version;
  created: Date;
  icons: IconGlyph[];
}

interface Glyph {
  codes: number[];
  advance: number;
  contours: Contour[];
}

interface Bounds {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
}

interface EncodedGlyph {
  data: Buffer;
  pointCount: number;
  contourCount: number;
  bounds: Bounds | null;
}

const SPACE = 0x20;

const uint16 = (value: number): Buffer => {
  const buffer = Buffer.alloc(2);

  buffer.writeUInt16BE(value & 0xffff);

  return buffer;
};

const int16 = (value: number): Buffer => {
  const buffer = Buffer.alloc(2);

  buffer.writeInt16BE(value);

  return buffer;
};

const uint32 = (value: number): Buffer => {
  const buffer = Buffer.alloc(4);

  buffer.writeUInt32BE(value >>> 0);

  return buffer;
};

const pad4 = (data: Buffer): Buffer => (data.length % 4
  ? Buffer.concat([data, Buffer.alloc(4 - (data.length % 4))])
  : data);

const checksum = (data: Buffer): number => {
  const padded = pad4(data);
  let sum = 0;

  for (let offset = 0; offset < padded.length; offset += 4) {
    sum = (sum + padded.readUInt32BE(offset)) >>> 0;
  }

  return sum;
};

const encodeDelta = (
  delta: number,
  bytes: number[],
  shortBit: number,
  sameOrPositiveBit: number,
): number => {
  if (delta === 0) {
    return sameOrPositiveBit;
  }

  if (Math.abs(delta) < 256) {
    bytes.push(Math.abs(delta));

    return shortBit | (delta > 0 ? sameOrPositiveBit : 0);
  }

  bytes.push((delta >> 8) & 0xff, delta & 0xff);

  return 0;
};

const compactFlags = (flags: number[]): number[] => {
  const bytes: number[] = [];

  for (let index = 0; index < flags.length;) {
    let repeat = 0;

    const flag = flags[index];

    while (repeat < 255 && flags[index + repeat + 1] === flag) {
      repeat += 1;
    }

    bytes.push(...(repeat ? [flag | 0x08, repeat] : [flag]));
    index += repeat + 1;
  }

  return bytes;
};

const encodeGlyph = (contours: Contour[]): EncodedGlyph => {
  if (contours.length === 0) {
    return {
      data: Buffer.alloc(0), pointCount: 0, contourCount: 0, bounds: null,
    };
  }

  const points = contours.flat();
  const bounds = {
    xMin: Math.min(...points.map(({ x }) => x)),
    yMin: Math.min(...points.map(({ y }) => y)),
    xMax: Math.max(...points.map(({ x }) => x)),
    yMax: Math.max(...points.map(({ y }) => y)),
  };
  const endPoints = contours.reduce<number[]>(
    (ends, contour) => [...ends, (ends.at(-1) ?? -1) + contour.length],
    [],
  );
  const xBytes: number[] = [];
  const yBytes: number[] = [];
  const flags = points.map((point, index) => {
    const previous = index === 0 ? { x: 0, y: 0 } : points[index - 1];

    return (point.onCurve ? 0x01 : 0)
      | encodeDelta(point.x - previous.x, xBytes, 0x02, 0x10)
      | encodeDelta(point.y - previous.y, yBytes, 0x04, 0x20);
  });
  const data = pad4(Buffer.concat([
    int16(contours.length),
    int16(bounds.xMin), int16(bounds.yMin), int16(bounds.xMax), int16(bounds.yMax),
    ...endPoints.map(uint16), uint16(0),
    Buffer.from(compactFlags(flags)), Buffer.from(xBytes), Buffer.from(yBytes),
  ]));

  return {
    data, pointCount: points.length, contourCount: contours.length, bounds,
  };
};

const buildCmap = (glyphs: Glyph[]): Buffer => {
  const entries = glyphs
    .flatMap(({ codes }, glyphId) => codes.map((code) => ({ code, glyphId })))
    .sort((a, b) => a.code - b.code);
  const segments: { start: number; end: number; delta: number }[] = [];

  entries.forEach(({ code, glyphId }) => {
    const last = segments.at(-1);
    const delta = (glyphId - code) & 0xffff;

    if (last && code === last.end + 1 && delta === last.delta) {
      last.end = code;
    } else {
      segments.push({ start: code, end: code, delta });
    }
  });
  segments.push({ start: 0xffff, end: 0xffff, delta: 1 });

  const entrySelector = Math.floor(Math.log2(segments.length));
  const searchRange = 2 * 2 ** entrySelector;
  const subtable = Buffer.concat([
    uint16(4), uint16(16 + 8 * segments.length), uint16(0),
    uint16(segments.length * 2), uint16(searchRange), uint16(entrySelector),
    uint16(segments.length * 2 - searchRange),
    ...segments.map(({ end }) => uint16(end)), uint16(0),
    ...segments.map(({ start }) => uint16(start)),
    ...segments.map(({ delta }) => uint16(delta)),
    ...segments.map(() => uint16(0)),
  ]);
  // One format 4 subtable shared by the Unicode and the Windows records.
  const records = [[0, 3], [3, 1]];
  const subtableOffset = 4 + records.length * 8;

  return Buffer.concat([
    uint16(0), uint16(records.length),
    ...records.flatMap(([platformId, encodingId]) => [
      uint16(platformId), uint16(encodingId), uint32(subtableOffset),
    ]),
    subtable,
  ]);
};

const encodeMacRoman = (text: string): Buffer => Buffer.from([...text].map((char) => {
  if (char === '©') {
    return 0xa9;
  }

  const code = char.charCodeAt(0);

  if (code > 0x7e) {
    throw new Error(`No Mac Roman mapping for ${JSON.stringify(char)} in ${JSON.stringify(text)}`);
  }

  return code;
}));

const encodeUtf16 = (text: string): Buffer => Buffer.from(text, 'utf16le').swap16();

const buildName = (names: FontNames, version: Version): Buffer => {
  const texts = new Map<number, string>([
    [0, names.copyright],
    [1, names.family],
    [2, 'Regular'],
    [3, names.family],
    [4, names.family],
    [5, `Version ${version.major}.${version.minor}`],
    [6, names.family],
    [8, names.manufacturer],
    [10, names.description],
    [11, names.vendorUrl],
    [13, names.license],
    [14, names.licenseUrl],
  ]);
  const records = [
    {
      platformId: 1, encodingId: 0, languageId: 0, encode: encodeMacRoman,
    },
    {
      platformId: 3, encodingId: 1, languageId: 0x409, encode: encodeUtf16,
    },
  ].flatMap((platform) => [...texts].map(([nameId, text]) => ({
    ...platform, nameId, bytes: platform.encode(text),
  })));
  let offset = 0;
  const headers = records.map(({
    platformId, encodingId, languageId, nameId, bytes,
  }) => {
    const header = Buffer.concat([
      uint16(platformId), uint16(encodingId), uint16(languageId), uint16(nameId),
      uint16(bytes.length), uint16(offset),
    ]);

    offset += bytes.length;

    return header;
  });

  return Buffer.concat([
    uint16(0), uint16(records.length), uint16(6 + 12 * records.length),
    ...headers,
    ...records.map(({ bytes }) => bytes),
  ]);
};

const buildOs2 = (glyphs: Glyph[]): Buffer => {
  const codes = glyphs.flatMap((glyph) => glyph.codes);
  const advances = glyphs.map(({ advance }) => advance).filter((advance) => advance > 0);
  const averageAdvance = advances.reduce((sum, advance) => sum + advance, 0) / advances.length;

  return Buffer.concat([
    uint16(3), int16(Math.round(averageAdvance)), uint16(400), uint16(5), uint16(0),
    int16(665), int16(716), int16(0), int16(143),
    int16(665), int16(716), int16(0), int16(491),
    int16(51), int16(265), int16(0),
    Buffer.alloc(10),
    uint32(1), uint32(0x10000000), uint32(0), uint32(0),
    Buffer.alloc(4),
    uint16(0x40), uint16(Math.min(...codes)), uint16(Math.max(...codes)),
    int16(ASCENT), int16(DESCENT), int16(-DESCENT), uint16(ASCENT), uint16(-DESCENT),
    uint32(1), uint32(0),
    int16(0), int16(0), uint16(0), uint16(SPACE), uint16(0),
  ]);
};

const MAC_EPOCH_SECONDS = 2082844800;

const longDateTime = (date: Date): Buffer => {
  const buffer = Buffer.alloc(8);

  buffer.writeBigUInt64BE(BigInt(Math.round(date.getTime() / 1000) + MAC_EPOCH_SECONDS));

  return buffer;
};

const assembleFont = (tables: Map<string, Buffer>): Buffer => {
  const tags = [...tables.keys()].sort();
  const entrySelector = Math.floor(Math.log2(tags.length));
  const searchRange = 16 * 2 ** entrySelector;
  const directory: Buffer[] = [];
  const bodies: Buffer[] = [];
  let offset = 12 + 16 * tags.length;
  let headOffset = 0;

  tags.forEach((tag) => {
    const data = tables.get(tag) ?? Buffer.alloc(0);

    if (tag === 'head') {
      headOffset = offset;
    }

    directory.push(Buffer.concat([
      Buffer.from(tag, 'latin1'), uint32(checksum(data)), uint32(offset), uint32(data.length),
    ]));
    bodies.push(pad4(data));
    offset += pad4(data).length;
  });

  const font = Buffer.concat([
    uint32(0x00010000), uint16(tags.length),
    uint16(searchRange), uint16(entrySelector), uint16(tags.length * 16 - searchRange),
    ...directory,
    ...bodies,
  ]);

  font.writeUInt32BE((0xb1b0afba - checksum(font)) >>> 0, headOffset + 8);

  return font;
};

export const buildTrueType = (source: IconFontSource): Buffer => {
  const icons = [...source.icons]
    .sort((a, b) => a.code - b.code)
    .map(({ code, contours }) => ({ codes: [code], advance: UNITS_PER_EM, contours }));
  const glyphs: Glyph[] = [
    { codes: [], advance: UNITS_PER_EM, contours: [] },
    { codes: [SPACE], advance: UNITS_PER_EM / 2, contours: [] },
    ...icons,
  ];
  const encoded = glyphs.map(({ contours }) => encodeGlyph(contours));
  const outlined = encoded.flatMap(({ bounds }, glyphId) => (bounds
    ? [{ ...bounds, advance: glyphs[glyphId].advance }]
    : []));
  const locations = encoded.reduce<number[]>(
    (offsets, { data }) => [...offsets, (offsets.at(-1) ?? 0) + data.length],
    [0],
  );
  const longLocations = (locations.at(-1) ?? 0) > 0x1fffe;
  const xMin = Math.min(...outlined.map((bounds) => bounds.xMin));
  const xMax = Math.max(...outlined.map((bounds) => bounds.xMax));
  const revision = Math.round((source.version.major + source.version.minor / 10) * 65536);

  return assembleFont(new Map([
    ['OS/2', buildOs2(glyphs)],
    ['cmap', buildCmap(glyphs)],
    ['gasp', Buffer.concat([uint16(1), uint16(1), uint16(0xffff), uint16(0x000f)])],
    ['glyf', Buffer.concat(encoded.map(({ data }) => data))],
    ['head', Buffer.concat([
      uint32(0x00010000), uint32(revision), uint32(0), uint32(0x5f0f3cf5),
      uint16(0x000b), uint16(UNITS_PER_EM),
      longDateTime(source.created), longDateTime(source.created),
      int16(xMin), int16(Math.min(...outlined.map(({ yMin }) => yMin))),
      int16(xMax), int16(Math.max(...outlined.map(({ yMax }) => yMax))),
      uint16(0), uint16(8), int16(2), int16(longLocations ? 1 : 0), int16(0),
    ])],
    ['hhea', Buffer.concat([
      uint32(0x00010000), int16(ASCENT), int16(DESCENT), int16(0),
      uint16(Math.max(...glyphs.map(({ advance }) => advance))),
      int16(xMin),
      int16(Math.min(...outlined.map((bounds) => bounds.advance - bounds.xMax))),
      int16(xMax),
      int16(1), int16(0), int16(0), Buffer.alloc(8), int16(0), uint16(glyphs.length),
    ])],
    ['hmtx', Buffer.concat(encoded.map(({ bounds }, glyphId) => Buffer.concat([
      uint16(glyphs[glyphId].advance), int16(bounds?.xMin ?? 0),
    ])))],
    ['loca', Buffer.concat(locations.map((offset) => (longLocations ? uint32(offset) : uint16(offset / 2))))],
    ['maxp', Buffer.concat([
      uint32(0x00010000), uint16(glyphs.length),
      uint16(Math.max(...encoded.map(({ pointCount }) => pointCount))),
      uint16(Math.max(...encoded.map(({ contourCount }) => contourCount))),
      uint16(0), uint16(0), uint16(2), Buffer.alloc(16),
    ])],
    ['name', buildName(source.names, source.version)],
    ['post', Buffer.concat([uint32(0x00030000), Buffer.alloc(28)])],
  ]));
};

// WOFF keeps the tables uncompressed, so the file does not depend on the zlib version.
export const buildWoff = (font: Buffer, version: Version): Buffer => {
  const tableCount = font.readUInt16BE(4);
  const directory: Buffer[] = [];
  const bodies: Buffer[] = [];
  let offset = 44 + 20 * tableCount;

  for (let index = 0; index < tableCount; index += 1) {
    const entry = 12 + index * 16;
    const length = font.readUInt32BE(entry + 12);
    const start = font.readUInt32BE(entry + 8);
    const data = pad4(font.subarray(start, start + length));

    directory.push(Buffer.concat([
      font.subarray(entry, entry + 4), uint32(offset), uint32(length), uint32(length),
      font.subarray(entry + 4, entry + 8),
    ]));
    bodies.push(data);
    offset += data.length;
  }

  return Buffer.concat([
    Buffer.from('wOFF', 'latin1'), uint32(0x00010000), uint32(offset), uint16(tableCount), uint16(0),
    uint32(font.length), uint16(version.major), uint16(version.minor), Buffer.alloc(20),
    ...directory,
    ...bodies,
  ]);
};

// wawoff2 returns a view into its wasm memory that the next call overwrites,
// so the calls run one at a time and each result is copied at once.
let compression: Promise<unknown> = Promise.resolve();

export const buildWoff2 = (font: Buffer, version: Version): Promise<Buffer> => {
  const result = compression.then(async () => {
    const woff2 = Buffer.from(await compress(font));

    woff2.writeUInt16BE(version.major, 24);
    woff2.writeUInt16BE(version.minor, 26);

    return woff2;
  });

  compression = result.catch(() => undefined);

  return result;
};
