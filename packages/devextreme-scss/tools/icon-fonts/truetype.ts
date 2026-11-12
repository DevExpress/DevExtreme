export const UNITS_PER_EM = 1024;
export const ASCENT = 960;
export const DESCENT = -64;

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

const uint16 = (value: number): Buffer => {
  const buffer = Buffer.alloc(2);

  buffer.writeUInt16BE(value);

  return buffer;
};

const uint32 = (value: number): Buffer => {
  const buffer = Buffer.alloc(4);

  buffer.writeUInt32BE(value);

  return buffer;
};

const pad4 = (data: Buffer): Buffer => (data.length % 4
  ? Buffer.concat([data, Buffer.alloc(4 - (data.length % 4))])
  : data);

const checksum = (data: Buffer): number => {
  const padded = pad4(data);
  let sum = 0;

  for (let offset = 0; offset < padded.length; offset += 4) {
    sum = (sum + padded.readUInt32BE(offset)) % 0x100000000;
  }

  return sum;
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
    { platform: [1, 0, 0], encode: encodeMacRoman },
    { platform: [3, 1, 0x409], encode: encodeUtf16 },
  ].flatMap(({ platform, encode }) => [...texts].map(([nameId, text]) => ({
    header: [...platform, nameId], bytes: encode(text),
  })));
  let offset = 0;

  return Buffer.concat([
    uint16(0), uint16(records.length), uint16(6 + 12 * records.length),
    ...records.map(({ header, bytes }) => {
      const record = Buffer.concat([...header, bytes.length, offset].map(uint16));

      offset += bytes.length;

      return record;
    }),
    ...records.map(({ bytes }) => bytes),
  ]);
};

const readTables = (font: Buffer): Map<string, Buffer> => new Map(
  Array.from({ length: font.readUInt16BE(4) }, (_, index) => {
    const entry = 12 + 16 * index;
    const offset = font.readUInt32BE(entry + 8);

    return [
      font.toString('latin1', entry, entry + 4),
      Buffer.from(font.subarray(offset, offset + font.readUInt32BE(entry + 12))),
    ];
  }),
);

const assembleFont = (tables: Map<string, Buffer>): Buffer => {
  const tags = [...tables.keys()].sort();
  const entrySelector = Math.floor(Math.log2(tags.length));
  const searchRange = 16 * 2 ** entrySelector;
  let offset = 12 + 16 * tags.length;
  const directory = tags.map((tag) => {
    const data = tables.get(tag) ?? Buffer.alloc(0);
    const entry = Buffer.concat([
      Buffer.from(tag, 'latin1'), uint32(checksum(data)), uint32(offset), uint32(data.length),
    ]);

    offset += pad4(data).length;

    return entry;
  });
  const font = Buffer.concat([
    uint32(0x00010000), uint16(tags.length),
    uint16(searchRange), uint16(entrySelector), uint16(tags.length * 16 - searchRange),
    ...directory,
    ...tags.map((tag) => pad4(tables.get(tag) ?? Buffer.alloc(0))),
  ]);
  const headOffset = directory[tags.indexOf('head')].readUInt32BE(8);

  font.writeUInt32BE((0xb1b0afba - checksum(font) + 0x100000000) % 0x100000000, headOffset + 8);

  return font;
};

// svg2ttf writes neither the license records ILScan requires nor an empty vendor ID, and its
// line metrics differ from the IcoMoon fonts. These tables keep the fonts as they were.
export const patchTrueType = (font: Buffer, names: FontNames, version: Version): Buffer => {
  const tables = readTables(font);
  const head = tables.get('head');
  const os2 = tables.get('OS/2');

  if (!head || !os2) {
    throw new Error('svg2ttf wrote no head or OS/2 table');
  }

  head.writeUInt32BE(Math.round((version.major + version.minor / 10) * 0x10000), 4); // fontRevision
  head.writeUInt32BE(0, 8); // checkSumAdjustment, set by assembleFont
  os2.fill(0, 58, 62); // achVendID
  os2.writeUInt16BE(0x40, 62); // fsSelection: regular, without USE_TYPO_METRICS
  os2.writeInt16BE(-DESCENT, 72); // sTypoLineGap
  os2.writeUInt16BE(ASCENT, 74); // usWinAscent
  os2.writeUInt16BE(-DESCENT, 76); // usWinDescent
  tables.set('gasp', Buffer.concat([1, 1, 0xffff, 0x000f].map(uint16)));
  tables.set('name', buildName(names, version));

  return assembleFont(tables);
};

// The WOFF and WOFF2 headers carry the release the icons belong to.
export const withVersion = (font: Buffer, offset: number, version: Version): Buffer => {
  font.writeUInt16BE(version.major, offset);
  font.writeUInt16BE(version.minor, offset + 2);

  return font;
};
