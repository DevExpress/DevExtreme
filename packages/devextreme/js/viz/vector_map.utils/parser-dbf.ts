/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-var */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-template */
/* eslint-disable vars-on-top */

interface DataBaseFileField {
  name: string;
  type: string;
  length: number;
  count: number;
}

interface DataBaseFileHeader {
  versionNumber: number;
  lastUpdate: Date;
  numberOfRecords: number;
  headerLength: number;
  recordLength: number;
  fields: DataBaseFileField[];
}

type DataBaseFileValue = string | number | Date | null;

type DataBaseFileRecord = Record<string, DataBaseFileValue>;

type DataBaseFileFieldParser = (stream: ParserStream, length: number) => DataBaseFileValue;

interface DataBaseFileFieldParseData {
  name: string;
  parser: DataBaseFileFieldParser;
  length: number;
}

interface DataBaseFileParseResult {
  records: DataBaseFileRecord[] | undefined;
  errors: string[];
  time: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseDBF(stream: ParserStream, errors: string[]): DataBaseFileParseResult {
  var timeStart: Date;
  var timeEnd: Date;
  var header: DataBaseFileHeader;
  var parseData: DataBaseFileFieldParseData[];
  var records: DataBaseFileRecord[] | undefined;
  try {
    timeStart = new Date();
    header = parseDataBaseFileHeader(stream, errors);
    parseData = prepareDataBaseFileRecordParseData(header, errors);
    records = parseDataBaseFileRecords(
      stream,
      header.numberOfRecords,
      header.recordLength,
      parseData,
      errors,
    );
    timeEnd = new Date();
  } catch(e) {
    errors.push('dbf: parsing error: ' + e.message + ' / ' + e.description);
  }
  // @ts-expect-error Date arithmetic; the timestamps stay unassigned when parsing fails
  return { records: records, errors: errors, time: timeEnd - timeStart };
}

function parseDataBaseFileHeader(stream: ParserStream, errors: string[]): DataBaseFileHeader {
  var i: number;
  var header: DataBaseFileHeader = {
    versionNumber: stream.ui8(),
    lastUpdate: new Date(1900 + stream.ui8(), stream.ui8() - 1, stream.ui8()),
    numberOfRecords: stream.ui32LE(),
    headerLength: stream.ui16LE(),
    recordLength: stream.ui16LE(),
    fields: [],
  };
  var term: number;
  stream.skip(20);
  for (i = (header.headerLength - stream.pos() - 1) / 32; i > 0; --i) {
    header.fields.push(parseFieldDescriptor(stream));
  }
  term = stream.ui8();
  if (term !== 13) {
    errors.push('dbf: header terminator: ' + term + ' / expected: 13');
  }
  return header;
}

// eslint-disable-next-line no-underscore-dangle
var _fromCharCode = String.fromCharCode;

function getAsciiString(stream: ParserStream, length: number): string {
  // eslint-disable-next-line prefer-spread
  return _fromCharCode.apply(null, stream.ui8arr(length));
}

function parseFieldDescriptor(stream: ParserStream): DataBaseFileField {
  var desc: DataBaseFileField = {
    name: getAsciiString(stream, 11).replace(/\0*$/gi, ''),
    type: _fromCharCode(stream.ui8()),
    length: stream.skip(4).ui8(),
    count: stream.ui8(),
  };
  stream.skip(14);
  return desc;
}

var DBF_FIELD_PARSERS: Record<string, DataBaseFileFieldParser> = {
  C: function(stream, length) {
    var str = getAsciiString(stream, length);

    try {
      str = decodeURIComponent(escape(str)); // T522922
    // eslint-disable-next-line no-empty
    } catch(e) { }

    return str.trim();
  },
  N: function(stream, length) {
    var str = getAsciiString(stream, length);
    return parseFloat(str);
  },
  D: function(stream, length) {
    var str = getAsciiString(stream, length);
    // @ts-expect-error the Date constructor coerces the numeric substrings
    return new Date(str.substring(0, 4), str.substring(4, 6) - 1, str.substring(6, 8));
  },
};

function DBF_FIELD_PARSER_DEFAULT(stream: ParserStream, length: number): null {
  stream.skip(length);
  return null;
}

function prepareDataBaseFileRecordParseData(
  header: DataBaseFileHeader,
  errors: string[],
): DataBaseFileFieldParseData[] {
  var list: DataBaseFileFieldParseData[] = [];
  var i = 0;
  var ii = header.fields.length;
  var item: DataBaseFileFieldParseData;
  var field: DataBaseFileField;
  var totalLength = 0;
  for (i = 0; i < ii; ++i) {
    field = header.fields[i];
    item = {
      name: field.name,
      parser: DBF_FIELD_PARSERS[field.type],
      length: field.length,
    };
    if (!item.parser) {
      item.parser = DBF_FIELD_PARSER_DEFAULT;
      errors.push('dbf: field ' + field.name + ' type: ' + field.type + ' / unknown');
    }
    totalLength += field.length;
    list.push(item);
  }
  if (totalLength + 1 !== header.recordLength) {
    errors.push('dbf: record length: ' + header.recordLength + ' / actual: ' + (totalLength + 1));
  }
  return list;
}

function parseDataBaseFileRecords(
  stream: ParserStream,
  recordCount: number,
  recordLength: number,
  parseData: DataBaseFileFieldParseData[],
  errors: string[],
): DataBaseFileRecord[] {
  var i: number;
  var j: number;
  var jj = parseData.length;
  var pos: number;
  var records: DataBaseFileRecord[] = [];
  var record: DataBaseFileRecord;
  var pd: DataBaseFileFieldParseData;
  for (i = 0; i < recordCount; ++i) {
    record = {};
    pos = stream.pos();
    stream.skip(1);
    for (j = 0; j < jj; ++j) {
      pd = parseData[j];
      record[pd.name] = pd.parser(stream, pd.length);
    }
    pos = stream.pos() - pos;
    if (pos !== recordLength) {
      errors.push('dbf: record #' + (i + 1) + ' length: ' + recordLength + ' / actual: ' + pos);
    }
    records.push(record);
  }
  return records;
}
