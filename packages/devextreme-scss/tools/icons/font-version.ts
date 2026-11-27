import { brotliCompressSync, brotliDecompressSync, constants } from 'node:zlib';

interface Table {
  tag: string;
  data: Buffer;
}

interface Woff2Table extends Table {
  flags: number;
  originalLength: number;
  transformLength: number | undefined;
}

interface Release {
  version: string;
  major: number;
  minor: number;
  year: number;
}

const NAME_ID_COPYRIGHT = 0;
const NAME_ID_VERSION = 5;
const NAME_HEADER_SIZE = 6;
const NAME_RECORD_SIZE = 12;
const COPYRIGHT_END_YEAR = /(?<=\d{4} - )\d{4}/;

const HEAD_FONT_REVISION_OFFSET = 4;
const HEAD_CHECKSUM_ADJUSTMENT_OFFSET = 8;
const CHECKSUM_MAGIC = 0xb1b0afba;
const UINT32_RANGE = 2 ** 32;
const FIXED_ONE = 2 ** 16;

const SFNT_HEADER_SIZE = 12;
const SFNT_ENTRY_SIZE = 16;
const WOFF_HEADER_SIZE = 44;
const WOFF_ENTRY_SIZE = 20;
const WOFF2_HEADER_SIZE = 48;
const WOFF2_CUSTOM_TAG_INDEX = 63;
const WOFF2_TAGS: Record<number, string> = {
  1: 'head', 5: 'name', 10: 'glyf', 11: 'loca',
};
const WOFF2_BROTLI_PARAMS = {
  [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_FONT,
  [constants.BROTLI_PARAM_QUALITY]: 11,
  [constants.BROTLI_PARAM_LGWIN]: 22,
};

const paddedLength = (length: number): number => Math.ceil(length / 4) * 4;

const padTo4 = (data: Buffer): Buffer => Buffer.concat([
  data, Buffer.alloc(paddedLength(data.length) - data.length),
]);

const byTag = (a: Table, b: Table): number => (a.tag < b.tag ? -1 : 1);

const sumWords = (data: Buffer): number => {
  const padded = padTo4(data);
  let sum = 0;

  for (let offset = 0; offset < padded.length; offset += 4) {
    sum = (sum + padded.readUInt32BE(offset)) % UINT32_RANGE;
  }

  return sum;
};

const checksumOf = ({ tag, data }: Table): number => {
  if (tag !== 'head') {
    return sumWords(data);
  }

  const head = Buffer.from(data);

  head.writeUInt32BE(0, HEAD_CHECKSUM_ADJUSTMENT_OFFSET);

  return sumWords(head);
};

const isUtf16Platform = (platformId: number): boolean => platformId === 0 || platformId === 3;

const decodeName = (platformId: number, bytes: Buffer): string => (isUtf16Platform(platformId)
  ? Buffer.from(bytes).swap16().toString('utf16le')
  : bytes.toString('latin1'));

const encodeName = (platformId: number, text: string): Buffer => (isUtf16Platform(platformId)
  ? Buffer.from(text, 'utf16le').swap16()
  : Buffer.from(text, 'latin1'));

const stampNameText = (nameId: number, text: string, release: Release): string => {
  if (nameId === NAME_ID_VERSION) {
    return `Version ${release.version}`;
  }

  if (!COPYRIGHT_END_YEAR.test(text)) {
    throw new Error(`The copyright record ${JSON.stringify(text)} has no year range to stamp`);
  }

  return text.replace(COPYRIGHT_END_YEAR, String(release.year));
};

const stampName = (table: Buffer, release: Release): Buffer => {
  const format = table.readUInt16BE(0);

  if (format !== 0) {
    throw new Error(`The name table format ${format} is not supported`);
  }

  const count = table.readUInt16BE(2);
  const storageOffset = table.readUInt16BE(4);
  const records = Buffer.from(table.subarray(0, NAME_HEADER_SIZE + count * NAME_RECORD_SIZE));
  const offsets = new Map<string, number>();
  const strings: Buffer[] = [];
  let storageLength = 0;

  records.writeUInt16BE(records.length, 4);

  for (let index = 0; index < count; index += 1) {
    const record = NAME_HEADER_SIZE + index * NAME_RECORD_SIZE;
    const platformId = records.readUInt16BE(record);
    const nameId = records.readUInt16BE(record + 6);
    const start = storageOffset + records.readUInt16BE(record + 10);
    const original = table.subarray(start, start + records.readUInt16BE(record + 8));
    const bytes = nameId === NAME_ID_VERSION || nameId === NAME_ID_COPYRIGHT
      ? encodeName(platformId, stampNameText(nameId, decodeName(platformId, original), release))
      : original;
    const key = bytes.toString('hex');
    let offset = offsets.get(key);

    if (offset === undefined) {
      offset = storageLength;
      offsets.set(key, offset);
      strings.push(bytes);
      storageLength += bytes.length;
    }

    records.writeUInt16BE(bytes.length, record + 8);
    records.writeUInt16BE(offset, record + 10);
  }

  return Buffer.concat([records, ...strings]);
};

const stampHead = (table: Buffer, release: Release): Buffer => {
  const head = Buffer.from(table);

  head.writeInt32BE(Math.round(Number(release.version) * FIXED_ONE), HEAD_FONT_REVISION_OFFSET);

  return head;
};

const stampTable = <T extends Table>(table: T, release: Release): T => {
  if (table.tag === 'name') {
    return { ...table, data: stampName(table.data, release) };
  }

  if (table.tag === 'head') {
    return { ...table, data: stampHead(table.data, release) };
  }

  return table;
};

const placeTables = <T extends Table>(
  tables: T[],
  start: number,
): (T & { offset: number })[] => {
  let offset = start;

  return tables.map((table) => {
    const placed = { ...table, offset };

    offset += paddedLength(table.data.length);

    return placed;
  });
};

const readSfnt = (font: Buffer): Table[] => Array.from(
  { length: font.readUInt16BE(4) },
  (_, index) => {
    const entry = SFNT_HEADER_SIZE + index * SFNT_ENTRY_SIZE;
    const offset = font.readUInt32BE(entry + 8);

    return {
      tag: font.toString('latin1', entry, entry + 4),
      offset,
      data: font.subarray(offset, offset + font.readUInt32BE(entry + 12)),
    };
  },
)
  .sort((a, b) => a.offset - b.offset)
  .map(({ tag, data }) => ({ tag, data }));

const writeSfnt = (flavor: number, tables: Table[]): Buffer => {
  const entrySelector = Math.floor(Math.log2(tables.length));
  const searchRange = 2 ** entrySelector * SFNT_ENTRY_SIZE;
  const header = Buffer.alloc(SFNT_HEADER_SIZE + tables.length * SFNT_ENTRY_SIZE);
  const placed = placeTables(tables, header.length);

  header.writeUInt32BE(flavor, 0);
  header.writeUInt16BE(tables.length, 4);
  header.writeUInt16BE(searchRange, 6);
  header.writeUInt16BE(entrySelector, 8);
  header.writeUInt16BE(tables.length * SFNT_ENTRY_SIZE - searchRange, 10);
  [...placed].sort(byTag).forEach((table, index) => {
    const entry = SFNT_HEADER_SIZE + index * SFNT_ENTRY_SIZE;

    header.write(table.tag, entry, 'latin1');
    header.writeUInt32BE(checksumOf(table), entry + 4);
    header.writeUInt32BE(table.offset, entry + 8);
    header.writeUInt32BE(table.data.length, entry + 12);
  });

  const font = Buffer.concat([header, ...tables.map(({ data }) => padTo4(data))]);
  const head = placed.find(({ tag }) => tag === 'head');

  if (!head) {
    throw new Error('The font has no head table');
  }

  font.writeUInt32BE(0, head.offset + HEAD_CHECKSUM_ADJUSTMENT_OFFSET);
  font.writeUInt32BE(
    (CHECKSUM_MAGIC - sumWords(font) + UINT32_RANGE) % UINT32_RANGE,
    head.offset + HEAD_CHECKSUM_ADJUSTMENT_OFFSET,
  );

  return font;
};

const readWoff = (font: Buffer): Table[] => Array.from(
  { length: font.readUInt16BE(12) },
  (_, index) => {
    const entry = WOFF_HEADER_SIZE + index * WOFF_ENTRY_SIZE;
    const offset = font.readUInt32BE(entry + 4);
    const storedLength = font.readUInt32BE(entry + 8);

    if (storedLength !== font.readUInt32BE(entry + 12)) {
      throw new Error('Compressed woff tables are not supported');
    }

    return {
      tag: font.toString('latin1', entry, entry + 4),
      offset,
      data: font.subarray(offset, offset + storedLength),
    };
  },
)
  .sort((a, b) => a.offset - b.offset)
  .map(({ tag, data }) => ({ tag, data }));

const writeWoff = (flavor: number, sfnt: Buffer, release: Release): Buffer => {
  const tables = readSfnt(sfnt);
  const directorySize = WOFF_HEADER_SIZE + tables.length * WOFF_ENTRY_SIZE;
  const placed = placeTables(tables, directorySize);
  const font = Buffer.concat([
    Buffer.alloc(directorySize), ...tables.map(({ data }) => padTo4(data)),
  ]);

  font.write('wOFF', 0, 'latin1');
  font.writeUInt32BE(flavor, 4);
  font.writeUInt32BE(font.length, 8);
  font.writeUInt16BE(tables.length, 12);
  font.writeUInt32BE(sfnt.length, 16);
  font.writeUInt16BE(release.major, 20);
  font.writeUInt16BE(release.minor, 22);
  [...placed].sort(byTag).forEach((table, index) => {
    const entry = WOFF_HEADER_SIZE + index * WOFF_ENTRY_SIZE;

    font.write(table.tag, entry, 'latin1');
    font.writeUInt32BE(table.offset, entry + 4);
    font.writeUInt32BE(table.data.length, entry + 8);
    font.writeUInt32BE(table.data.length, entry + 12);
    font.writeUInt32BE(checksumOf(table), entry + 16);
  });

  return font;
};

const readWoff2 = (font: Buffer): Woff2Table[] => {
  let position = WOFF2_HEADER_SIZE;

  const readBase128 = (): number => {
    let value = 0;
    let byte = 128;

    while (byte >= 128) {
      byte = font[position];
      position += 1;
      value = value * 128 + (byte % 128);
    }

    return value;
  };

  const entries = Array.from({ length: font.readUInt16BE(12) }, () => {
    const flags = font[position];
    const tagIndex = flags % 64;

    position += 1;

    const tag = tagIndex === WOFF2_CUSTOM_TAG_INDEX
      ? font.toString('latin1', position, position + 4)
      : WOFF2_TAGS[tagIndex] ?? `#${tagIndex}`;

    if (tagIndex === WOFF2_CUSTOM_TAG_INDEX) {
      position += 4;
    }

    const originalLength = readBase128();
    const transformVersion = Math.floor(flags / 64);
    const isTransformed = tag === 'glyf' || tag === 'loca' ? transformVersion === 0 : transformVersion !== 0;

    return {
      tag, flags, originalLength, transformLength: isTransformed ? readBase128() : undefined,
    };
  });
  const stream = brotliDecompressSync(font.subarray(position, position + font.readUInt32BE(20)));
  let offset = 0;

  return entries.map((entry) => {
    const length = entry.transformLength ?? entry.originalLength;
    const data = stream.subarray(offset, offset + length);

    offset += length;

    return { ...entry, data };
  });
};

const writeBase128 = (value: number): Buffer => {
  const bytes = [value % 128];

  for (let rest = Math.floor(value / 128); rest > 0; rest = Math.floor(rest / 128)) {
    bytes.unshift(128 + (rest % 128));
  }

  return Buffer.from(bytes);
};

const writeWoff2 = (
  flavor: number,
  tables: Woff2Table[],
  sfntSize: number,
  release: Release,
): Buffer => {
  const directory = Buffer.concat(tables.flatMap((table) => [
    Buffer.from([table.flags]),
    ...table.flags % 64 === WOFF2_CUSTOM_TAG_INDEX ? [Buffer.from(table.tag, 'latin1')] : [],
    writeBase128(table.originalLength),
    ...table.transformLength === undefined ? [] : [writeBase128(table.transformLength)],
  ]));
  const compressed = brotliCompressSync(
    Buffer.concat(tables.map(({ data }) => data)),
    { params: WOFF2_BROTLI_PARAMS },
  );
  const font = padTo4(Buffer.concat([Buffer.alloc(WOFF2_HEADER_SIZE), directory, compressed]));

  font.write('wOF2', 0, 'latin1');
  font.writeUInt32BE(flavor, 4);
  font.writeUInt32BE(font.length, 8);
  font.writeUInt16BE(tables.length, 12);
  font.writeUInt32BE(sfntSize, 16);
  font.writeUInt32BE(compressed.length, 20);
  font.writeUInt16BE(release.major, 24);
  font.writeUInt16BE(release.minor, 26);

  return font;
};

const stampSfnt = (font: Buffer, release: Release): Buffer => writeSfnt(
  font.readUInt32BE(0),
  readSfnt(font).map((table) => stampTable(table, release)),
);

const stampWoff = (font: Buffer, release: Release): Buffer => {
  const flavor = font.readUInt32BE(4);
  const sfnt = writeSfnt(flavor, readWoff(font).map((table) => stampTable(table, release)));

  return writeWoff(flavor, sfnt, release);
};

const stampWoff2 = (font: Buffer, release: Release): Buffer => {
  const tables = readWoff2(font);
  const stamped = tables.map((table) => {
    const { data } = stampTable(table, release);
    const originalLength = table.transformLength === undefined ? data.length : table.originalLength;

    return { ...table, data, originalLength };
  });
  const sfntSize = stamped.reduce(
    (size, table, index) => size
      + paddedLength(table.originalLength) - paddedLength(tables[index].originalLength),
    font.readUInt32BE(16),
  );

  return writeWoff2(font.readUInt32BE(4), stamped, sfntSize, release);
};

export const stampFontVersion = (font: Buffer, version: string): Buffer => {
  const [major, minor] = version.split('.').map(Number);
  const release: Release = {
    version: `${major}.${minor}`, major, minor, year: 2000 + major,
  };

  switch (font.toString('latin1', 0, 4)) {
    case 'wOF2':
      return stampWoff2(font, release);
    case 'wOFF':
      return stampWoff(font, release);
    default:
      return stampSfnt(font, release);
  }
};
