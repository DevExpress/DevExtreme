/* eslint-disable no-bitwise */
export interface GlyphPoint {
  x: number;
  y: number;
  onCurve: boolean;
}

export type Contour = GlyphPoint[];

export interface TrueTypeFont {
  unitsPerEm: number;
  ascent: number;
  descent: number;
  created: Date;
  glyphs: Contour[][];
  advances: number[];
  glyphIdByCode: Map<number, number>;
}

const MAC_EPOCH_SECONDS = 2082844800n;

const readTableDirectory = (font: Buffer): Map<string, Buffer> => {
  const tables = new Map<string, Buffer>();
  const count = font.readUInt16BE(4);

  for (let index = 0; index < count; index += 1) {
    const entry = 12 + index * 16;
    const offset = font.readUInt32BE(entry + 8);
    const length = font.readUInt32BE(entry + 12);

    tables.set(font.toString('latin1', entry, entry + 4), font.subarray(offset, offset + length));
  }

  return tables;
};

const requireTable = (tables: Map<string, Buffer>, tag: string): Buffer => {
  const table = tables.get(tag);

  if (!table) {
    throw new Error(`The font has no ${JSON.stringify(tag)} table`);
  }

  return table;
};

const readCmap = (cmap: Buffer): Map<number, number> => {
  const record = Array.from({ length: cmap.readUInt16BE(2) }, (_, index) => 4 + index * 8)
    .find((at) => cmap.readUInt16BE(at) === 3 && cmap.readUInt16BE(at + 2) === 1);
  const offset = record === undefined ? -1 : cmap.readUInt32BE(record + 4);

  if (offset === -1 || cmap.readUInt16BE(offset) !== 4) {
    throw new Error('Only a format 4 Windows Unicode cmap is supported');
  }

  const segmentCount = cmap.readUInt16BE(offset + 6) / 2;
  const ends = offset + 14;
  const starts = ends + segmentCount * 2 + 2;
  const deltas = starts + segmentCount * 2;
  const rangeOffsets = deltas + segmentCount * 2;
  const glyphIdByCode = new Map<number, number>();

  for (let segment = 0; segment < segmentCount; segment += 1) {
    const start = cmap.readUInt16BE(starts + segment * 2);
    const end = cmap.readUInt16BE(ends + segment * 2);
    const delta = cmap.readUInt16BE(deltas + segment * 2);
    const rangeOffsetAt = rangeOffsets + segment * 2;
    const rangeOffset = cmap.readUInt16BE(rangeOffsetAt);

    for (let code = start; code <= end && code !== 0xffff; code += 1) {
      const glyphId = rangeOffset === 0
        ? code
        : cmap.readUInt16BE(rangeOffsetAt + rangeOffset + (code - start) * 2);

      glyphIdByCode.set(code, rangeOffset !== 0 && glyphId === 0 ? 0 : (glyphId + delta) & 0xffff);
    }
  }

  return glyphIdByCode;
};

const readCoordinates = (
  glyph: Buffer,
  start: number,
  flags: number[],
  shortBit: number,
  sameOrPositiveBit: number,
): { values: number[]; end: number } => {
  const values: number[] = [];
  let position = start;
  let value = 0;

  flags.forEach((flag) => {
    if (flag & shortBit) {
      value += flag & sameOrPositiveBit ? glyph[position] : -glyph[position];
      position += 1;
    } else if (!(flag & sameOrPositiveBit)) {
      value += glyph.readInt16BE(position);
      position += 2;
    }

    values.push(value);
  });

  return { values, end: position };
};

const readContours = (glyph: Buffer, glyphId: number): Contour[] => {
  if (glyph.length === 0) {
    return [];
  }

  const contourCount = glyph.readInt16BE(0);

  if (contourCount < 0) {
    throw new Error(`Glyph ${glyphId} is composite, only simple glyphs are supported`);
  }

  const endPoints = Array.from(
    { length: contourCount },
    (_, index) => glyph.readUInt16BE(10 + index * 2),
  );
  const instructionsAt = 10 + contourCount * 2;
  let position = instructionsAt + 2 + glyph.readUInt16BE(instructionsAt);
  const pointCount = contourCount ? endPoints[contourCount - 1] + 1 : 0;
  const flags: number[] = [];

  while (flags.length < pointCount) {
    const flag = glyph[position];

    position += 1;
    flags.push(flag);

    if (flag & 0x08) {
      const repeat = glyph[position];

      position += 1;
      flags.push(...Array<number>(repeat).fill(flag));
    }
  }

  const xs = readCoordinates(glyph, position, flags, 0x02, 0x10);
  const ys = readCoordinates(glyph, xs.end, flags, 0x04, 0x20);

  return endPoints.map((end, index) => {
    const first = index === 0 ? 0 : endPoints[index - 1] + 1;

    return flags.slice(first, end + 1).map((flag, offset) => ({
      x: xs.values[first + offset],
      y: ys.values[first + offset],
      onCurve: (flag & 0x01) !== 0,
    }));
  });
};

export const readTrueType = (font: Buffer): TrueTypeFont => {
  const tables = readTableDirectory(font);
  const head = requireTable(tables, 'head');
  const hhea = requireTable(tables, 'hhea');
  const hmtx = requireTable(tables, 'hmtx');
  const loca = requireTable(tables, 'loca');
  const glyf = requireTable(tables, 'glyf');
  const glyphCount = requireTable(tables, 'maxp').readUInt16BE(4);
  const longOffsets = head.readInt16BE(50) === 1;
  const metricsCount = hhea.readUInt16BE(34);
  const glyphOffset = (glyphId: number): number => (longOffsets
    ? loca.readUInt32BE(glyphId * 4)
    : loca.readUInt16BE(glyphId * 2) * 2);
  const glyphs: Contour[][] = [];
  const advances: number[] = [];

  for (let glyphId = 0; glyphId < glyphCount; glyphId += 1) {
    const outline = glyf.subarray(glyphOffset(glyphId), glyphOffset(glyphId + 1));

    glyphs.push(readContours(outline, glyphId));
    advances.push(hmtx.readUInt16BE(Math.min(glyphId, metricsCount - 1) * 4));
  }

  return {
    unitsPerEm: head.readUInt16BE(18),
    ascent: hhea.readInt16BE(4),
    descent: hhea.readInt16BE(6),
    created: new Date(Number(head.readBigUInt64BE(20) - MAC_EPOCH_SECONDS) * 1000),
    glyphs,
    advances,
    glyphIdByCode: readCmap(requireTable(tables, 'cmap')),
  };
};
