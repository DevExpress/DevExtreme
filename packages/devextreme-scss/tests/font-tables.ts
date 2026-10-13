import { brotliDecompressSync, inflateSync } from 'zlib';

export type FontContainer = 'sfnt' | 'woff' | 'woff2';

export interface NameRecord {
  platformId: number;
  encodingId: number;
  languageId: number;
  nameId: number;
  text: string;
}

export const NAME_ID = {
  copyright: 0,
  fullName: 4,
  version: 5,
  postScriptName: 6,
  trademark: 7,
  license: 13,
  licenseUrl: 14,
} as const;

const WOFF2_KNOWN_TAGS = [
  'cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post', 'cvt ', 'fpgm', 'glyf', 'loca', 'prep', 'CFF ', 'VORG', 'EBDT',
  'EBLC', 'gasp', 'hdmx', 'kern', 'LTSH', 'PCLT', 'VDMX', 'vhea', 'vmtx', 'BASE', 'GDEF', 'GPOS', 'GSUB', 'EBSC', 'JSTF', 'MATH',
  'CBDT', 'CBLC', 'COLR', 'CPAL', 'SVG ', 'sbix', 'acnt', 'avar', 'bdat', 'bloc', 'bsln', 'cvar', 'fdsc', 'feat', 'fmtx', 'fvar',
  'gvar', 'hsty', 'just', 'lcar', 'mort', 'morx', 'opbd', 'prop', 'trak', 'Zapf', 'Silf', 'Glat', 'Gloc', 'Feat', 'Sill',
];

export const detectContainer = (font: Buffer): FontContainer => {
  const signature = font.toString('latin1', 0, 4);

  if (signature === 'wOF2') {
    return 'woff2';
  }

  if (signature === 'wOFF') {
    return 'woff';
  }

  if (signature === 'true' || signature === 'OTTO' || font.readUInt32BE(0) === 0x00010000) {
    return 'sfnt';
  }

  throw new Error(`Unknown font container ${JSON.stringify(signature)}`);
};

const readSfntTable = (font: Buffer, tag: string): Buffer | undefined => {
  const count = font.readUInt16BE(4);

  for (let index = 0; index < count; index += 1) {
    const entry = 12 + index * 16;

    if (font.toString('latin1', entry, entry + 4) === tag) {
      const offset = font.readUInt32BE(entry + 8);
      const length = font.readUInt32BE(entry + 12);

      return font.subarray(offset, offset + length);
    }
  }

  return undefined;
};

const readWoffTable = (font: Buffer, tag: string): Buffer | undefined => {
  const count = font.readUInt16BE(12);

  for (let index = 0; index < count; index += 1) {
    const entry = 44 + index * 20;

    if (font.toString('latin1', entry, entry + 4) === tag) {
      const offset = font.readUInt32BE(entry + 4);
      const compressedLength = font.readUInt32BE(entry + 8);
      const originalLength = font.readUInt32BE(entry + 12);
      const raw = font.subarray(offset, offset + compressedLength);

      return compressedLength < originalLength ? inflateSync(raw) : raw;
    }
  }

  return undefined;
};

const readWoff2Table = (font: Buffer, tag: string): Buffer | undefined => {
  if (font.toString('latin1', 4, 8) === 'ttcf') {
    throw new Error('woff2 font collections are not supported');
  }

  const count = font.readUInt16BE(12);
  const totalCompressedSize = font.readUInt32BE(20);
  const entries: { tag: string; length: number }[] = [];
  let position = 48;

  const readBase128 = (): number => {
    let value = 0;

    for (let byteIndex = 0; byteIndex < 5; byteIndex += 1) {
      const byte = font[position];

      position += 1;
      // eslint-disable-next-line no-bitwise
      value = value * 128 + (byte & 0x7f);

      // eslint-disable-next-line no-bitwise
      if ((byte & 0x80) === 0) {
        return value;
      }
    }

    throw new Error('Malformed UIntBase128 in the woff2 table directory');
  };

  for (let index = 0; index < count; index += 1) {
    const flags = font[position];
    // eslint-disable-next-line no-bitwise
    const tagCode = flags & 0x3f;
    // eslint-disable-next-line no-bitwise
    const transformVersion = flags >> 6;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let entryTag: string;

    position += 1;

    if (tagCode === 63) {
      entryTag = font.toString('latin1', position, position + 4);
      position += 4;
    } else {
      entryTag = WOFF2_KNOWN_TAGS[tagCode];
    }

    const originalLength = readBase128();
    const isTransformed = entryTag === 'glyf' || entryTag === 'loca'
      ? transformVersion === 0
      : transformVersion !== 0;
    const length = isTransformed ? readBase128() : originalLength;

    entries.push({ tag: entryTag, length });
  }

  const stream = brotliDecompressSync(font.subarray(position, position + totalCompressedSize));
  let offset = 0;

  for (const entry of entries) {
    if (entry.tag === tag) {
      return stream.subarray(offset, offset + entry.length);
    }

    offset += entry.length;
  }

  return undefined;
};

export const readTable = (font: Buffer, tag: string): Buffer => {
  const readers: Record<FontContainer, (data: Buffer, name: string) => Buffer | undefined> = {
    sfnt: readSfntTable,
    woff: readWoffTable,
    woff2: readWoff2Table,
  };
  const table = readers[detectContainer(font)](font, tag);

  if (!table) {
    throw new Error(`The font has no ${JSON.stringify(tag)} table`);
  }

  return table;
};

const decodeNameString = (platformId: number, bytes: Buffer): string => {
  if (platformId === 0 || platformId === 3) {
    if (bytes.length % 2 !== 0) {
      throw new Error('Odd UTF-16 name string length');
    }

    return Buffer.from(bytes).swap16().toString('utf16le');
  }

  return bytes.toString('latin1');
};

export const readNameRecords = (font: Buffer): NameRecord[] => {
  const table = readTable(font, 'name');
  const count = table.readUInt16BE(2);
  const storageOffset = table.readUInt16BE(4);
  const records: NameRecord[] = [];

  for (let index = 0; index < count; index += 1) {
    const record = 6 + index * 12;
    const platformId = table.readUInt16BE(record);
    const length = table.readUInt16BE(record + 8);
    const start = storageOffset + table.readUInt16BE(record + 10);

    records.push({
      platformId,
      encodingId: table.readUInt16BE(record + 2),
      languageId: table.readUInt16BE(record + 4),
      nameId: table.readUInt16BE(record + 6),
      text: decodeNameString(platformId, table.subarray(start, start + length)),
    });
  }

  return records;
};

const recordRank = (record: NameRecord): number => {
  if (record.platformId === 3 && record.languageId === 0x0409) {
    return 0;
  }

  return record.platformId === 0 ? 1 : 2;
};

export const readNames = (font: Buffer): Map<number, string> => {
  const best = new Map<number, NameRecord>();

  readNameRecords(font).forEach((record) => {
    const current = best.get(record.nameId);

    if (!current || recordRank(record) < recordRank(current)) {
      best.set(record.nameId, record);
    }
  });

  return new Map(Array.from(best, ([nameId, record]) => [nameId, record.text]));
};

export const readGlyphCount = (font: Buffer): number => readTable(font, 'maxp').readUInt16BE(4);

export const readFontRevision = (font: Buffer): number => Math.round((readTable(font, 'head').readInt32BE(4) / 65536) * 1000) / 1000;
