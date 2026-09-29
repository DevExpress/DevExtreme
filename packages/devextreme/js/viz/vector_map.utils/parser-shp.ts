/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-var */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
/* eslint-disable vars-on-top */

interface ShapeHeader {
  fileCode: number;
  fileLength: number;
  version: number;
  type_number: number;
  type: string;
  bBox_XY: number[];
  bBox_ZM: number[][];
}

interface ShapeRecord {
  number: number;
  type_number: number;
  type: string;
  geoJSON_type: string;
  coordinates?: GeoJsonCoordinates;
  bBox?: number[];
  mBox?: number[];
  zBox?: number[];
  types?: number[];
}

interface ShapeParseResult {
  bBox: number[];
  type: string | undefined;
  shapes: ShapeRecord[];
  errors: string[];
  time: number;
}

type ShapeRecordReader = (stream: ParserStream, record: ShapeRecord) => void;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseShape(stream: ParserStream, errors: string[]): ShapeParseResult | undefined {
  var timeStart: Date;
  var timeEnd: Date;
  var header: ShapeHeader;
  var records: ShapeRecord[] = [];
  var record: ShapeRecord | null;
  try {
    timeStart = new Date();
    header = parseShapeHeader(stream);
  } catch(e) {
    errors.push('shp: header parsing error: ' + e.message + ' / ' + e.description);
    return;
  }
  if (header.fileCode !== 9994) {
    errors.push('shp: file code: ' + header.fileCode + ' / expected: 9994');
  }
  if (header.version !== 1000) {
    errors.push('shp: file version: ' + header.version + ' / expected: 1000');
  }
  try {
    while (stream.pos() < header.fileLength) {
      record = parseShapeRecord(stream, header.type, errors);
      if (record) {
        records.push(record);
      } else {
        break;
      }
    }
    if (stream.pos() !== header.fileLength) {
      errors.push('shp: file length: ' + header.fileLength + ' / actual: ' + stream.pos());
    }
    timeEnd = new Date();
  } catch(e) {
    errors.push('shp: records parsing error: ' + e.message + ' / ' + e.description);
  }

  // eslint-disable-next-line consistent-return
  return {
    bBox: header.bBox_XY,
    // @ts-expect-error the header has no shapeType field, the value is always undefined
    type: header.shapeType,
    shapes: records,
    // eslint-disable-next-line object-shorthand
    errors: errors,
    // @ts-expect-error Date arithmetic; timeEnd stays unassigned when the records cannot be parsed
    time: timeEnd - timeStart,
  };
}

function readPointShape(stream: ParserStream, record: ShapeRecord): void {
  record.coordinates = readPointArray(stream, 1)[0];
}

function readPolyLineShape(stream: ParserStream, record: ShapeRecord): void {
  var bBox = readBBox(stream);
  var numParts = readInteger(stream);
  var numPoints = readInteger(stream);
  var parts = readIntegerArray(stream, numParts);
  var points = readPointArray(stream, numPoints);
  var rings: number[][][] = [];
  var i: number;
  rings.length = numParts;
  for (i = 0; i < numParts; ++i) {
    rings[i] = points.slice(parts[i], parts[i + 1] || numPoints);
  }
  record.bBox = bBox;
  record.coordinates = rings;
}

function readMultiPointShape(stream: ParserStream, record: ShapeRecord): void {
  record.bBox = readBBox(stream);
  record.coordinates = readPointArray(stream, readInteger(stream));
}

function readPointMShape(stream: ParserStream, record: ShapeRecord): void {
  record.coordinates = readPointArray(stream, 1)[0];
  record.coordinates.push(readDoubleArray(stream, 1)[0]);
}

function readMultiPointMShape(stream: ParserStream, record: ShapeRecord): void {
  var bBox = readBBox(stream);
  var numPoints = readInteger(stream);
  var points = readPointArray(stream, numPoints);
  var mBox = readPair(stream);
  var mValues = readDoubleArray(stream, numPoints);
  record.bBox = bBox;
  record.mBox = mBox;
  record.coordinates = merge_XYM(points, mValues, numPoints);
}

function readPolyLineMShape(stream: ParserStream, record: ShapeRecord): void {
  var bBox = readBBox(stream);
  var numParts = readInteger(stream);
  var numPoints = readInteger(stream);
  var parts = readIntegerArray(stream, numParts);
  var points = readPointArray(stream, numPoints);
  var mBox = readPair(stream);
  var mValues = readDoubleArray(stream, numPoints);
  var rings: number[][][] = [];
  var i: number;
  var from: number;
  var to: number;
  rings.length = numParts;
  for (i = 0; i < numParts; ++i) {
    from = parts[i];
    to = parts[i + 1] || numPoints;
    rings[i] = merge_XYM(points.slice(from, to), mValues.slice(from, to), to - from);
  }
  record.bBox = bBox;
  record.mBox = mBox;
  record.coordinates = rings;
}

function readPointZShape(stream: ParserStream, record: ShapeRecord): void {
  record.coordinates = readPointArray(stream, 1)[0];
  // @ts-expect-error the record is not an array: parsing a PointZ shape throws here
  record.push(readDoubleArray(stream, 1)[0], readDoubleArray(stream, 1)[0]);
}

function readMultiPointZShape(stream: ParserStream, record: ShapeRecord): void {
  var bBox = readBBox(stream);
  var numPoints = readInteger(stream);
  var points = readPointArray(stream, numPoints);
  var zBox = readPair(stream);
  var zValues = readDoubleArray(stream, numPoints);
  var mBox = readPair(stream);
  var mValue = readDoubleArray(stream, numPoints);
  record.bBox = bBox;
  record.zBox = zBox;
  record.mBox = mBox;
  record.coordinates = merge_XYZM(points, zValues, mValue, numPoints);
}

function readPolyLineZShape(stream: ParserStream, record: ShapeRecord): void {
  var bBox = readBBox(stream);
  var numParts = readInteger(stream);
  var numPoints = readInteger(stream);
  var parts = readIntegerArray(stream, numParts);
  var points = readPointArray(stream, numPoints);
  var zBox = readPair(stream);
  var zValues = readDoubleArray(stream, numPoints);
  var mBox = readPair(stream);
  var mValues = readDoubleArray(stream, numPoints);
  var rings: number[][][] = [];
  var i: number;
  var from: number;
  var to: number;
  rings.length = numParts;
  for (i = 0; i < numParts; ++i) {
    from = parts[i];
    to = parts[i + 1] || numPoints;
    rings[i] = merge_XYZM(
      points.slice(from, to),
      zValues.slice(from, to),
      mValues.slice(from, to),
      to - from,
    );
  }
  record.bBox = bBox;
  record.zBox = zBox;
  record.mBox = mBox;
  record.coordinates = rings;
}

function readMultiPatchShape(stream: ParserStream, record: ShapeRecord): void {
  var bBox = readBBox(stream);
  var numParts = readInteger(stream);
  var numPoints = readInteger(stream);
  var parts = readIntegerArray(stream, numParts);
  var partTypes = readIntegerArray(stream, numParts);
  var points = readPointArray(stream, numPoints);
  var zBox = readPair(stream);
  var zValues = readDoubleArray(stream, numPoints);
  var mBox = readPair(stream);
  var rings: number[][][] = [];
  var i: number;
  var from: number;
  var to: number;
  rings.length = numParts;
  for (i = 0; i < numParts; ++i) {
    from = parts[i];
    to = parts[i + 1] || numPoints;
    rings[i] = merge_XYZM(
      points.slice(from, to),
      zValues.slice(from, to),
      // @ts-expect-error mValues is not declared here: a MultiPatch shape with parts throws
      mValues.slice(from, to),
      to - from,
    );
  }
  record.bBox = bBox;
  record.zBox = zBox;
  record.mBox = mBox;
  record.types = partTypes;
  record.coordinates = rings;
}

var SHP_TYPES: Record<number, string> = {
  0: 'Null',
  1: 'Point',
  3: 'PolyLine',
  5: 'Polygon',
  8: 'MultiPoint',
  11: 'PointZ',
  13: 'PolyLineZ',
  15: 'PolygonZ',
  18: 'MultiPointZ',
  21: 'PointM',
  23: 'PolyLineM',
  25: 'PolygonM',
  28: 'MultiPointM',
  31: 'MultiPatch',
};

var SHP_RECORD_PARSERS: Record<number, ShapeRecordReader> = {
  0: noop,
  1: readPointShape,
  3: readPolyLineShape,
  5: readPolyLineShape,
  8: readMultiPointShape,
  11: readPointZShape,
  13: readPolyLineZShape,
  15: readPolyLineZShape,
  18: readMultiPointZShape,
  21: readPointMShape,
  23: readPolyLineMShape,
  25: readPolyLineMShape,
  28: readMultiPointMShape,
  31: readMultiPatchShape,
};

var SHP_TYPE_TO_GEOJSON_TYPE_MAP: Record<string, string> = {
  Null: 'Null',
  Point: 'Point',
  PolyLine: 'MultiLineString',
  Polygon: 'Polygon',
  MultiPoint: 'MultiPoint',
  PointZ: 'Point',
  PolyLineZ: 'MultiLineString',
  PolygonZ: 'Polygon',
  MultiPointZ: 'MultiPoint',
  PointM: 'Point',
  PolyLineM: 'MultiLineString',
  PolygonM: 'Polygon',
  MultiPointM: 'MultiPoint',
  MultiPatch: 'MultiPatch',
};

function parseShapeHeader(stream: ParserStream): ShapeHeader {
  var header = {} as ShapeHeader;
  header.fileCode = stream.ui32BE();
  stream.skip(20);
  header.fileLength = stream.ui32BE() << 1;
  header.version = stream.ui32LE();
  header.type_number = stream.ui32LE();
  header.type = SHP_TYPES[header.type_number];
  header.bBox_XY = readBBox(stream);
  header.bBox_ZM = readPointArray(stream, 2);
  return header;
}

function readInteger(stream: ParserStream): number {
  return stream.ui32LE();
}

function readIntegerArray(stream: ParserStream, length: number): number[] {
  var array: number[] = [];
  var i: number;
  array.length = length;
  for (i = 0; i < length; ++i) {
    array[i] = readInteger(stream);
  }
  return array;
}

function readDoubleArray(stream: ParserStream, length: number): number[] {
  var array: number[] = [];
  var i: number;
  array.length = length;
  for (i = 0; i < length; ++i) {
    array[i] = stream.f64LE();
  }
  return array;
}

function readBBox(stream: ParserStream): number[] {
  return readDoubleArray(stream, 4);
}

function readPair(stream: ParserStream): number[] {
  return [stream.f64LE(), stream.f64LE()];
}

function readPointArray(stream: ParserStream, count: number): number[][] {
  var points: number[][] = [];
  var i: number;
  points.length = count;
  for (i = 0; i < count; ++i) {
    points[i] = readPair(stream);
  }
  return points;
}

function merge_XYM(xy: number[][], m: number[], length: number): number[][] {
  var array: number[][] = [];
  var i: number;
  array.length = length;
  for (i = 0; i < length; ++i) {
    array[i] = [xy[i][0], xy[i][1], m[i]];
  }
  return array;
}

function merge_XYZM(xy: number[][], z: number[], m: number[], length: number): number[][] {
  var array: number[][] = [];
  var i: number;
  array.length = length;
  for (i = 0; i < length; ++i) {
    array[i] = [xy[i][0], xy[i][1], z[i], m[i]];
  }
  return array;
}

function parseShapeRecord(
  stream: ParserStream,
  generalType: string,
  errors: string[],
): ShapeRecord | null {
  var record: ShapeRecord | null = { number: stream.ui32BE() } as ShapeRecord;
  var length = stream.ui32BE() << 1;
  var pos = stream.pos();
  var type = stream.ui32LE();

  record.type_number = type;
  record.type = SHP_TYPES[type];
  record.geoJSON_type = SHP_TYPE_TO_GEOJSON_TYPE_MAP[record.type];
  if (record.type) {
    if (record.type !== generalType) {
      errors.push('shp: shape #' + record.number + ' type: ' + record.type + ' / expected: ' + generalType);
    }
    SHP_RECORD_PARSERS[type](stream, record);
    pos = stream.pos() - pos;
    if (pos !== length) {
      errors.push('shp: shape #' + record.number + ' length: ' + length + ' / actual: ' + pos);
    }
  } else {
    errors.push('shp: shape #' + record.number + ' type: ' + type + ' / unknown');
    record = null;
  }
  return record;
}
