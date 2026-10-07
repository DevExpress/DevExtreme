import defaultDateNames from '@js/common/core/localization/default_date_names';
import { getFormatter as getLDMLFormatter } from '@js/common/core/localization/ldml/date.formatter';
import config from '@js/core/config';
import { isDate, isNumeric as isNumber, isString } from '@js/core/utils/type';

const NUMBER_SERIALIZATION_FORMAT = 'number';
const DATE_SERIALIZATION_FORMAT = 'yyyy/MM/dd';
const DATETIME_SERIALIZATION_FORMAT = 'yyyy/MM/dd HH:mm:ss';

const ISO_PARTIAL_DATE_PATTERN = /^\d{4,}(-\d{2})?$/;
const ISO8601_PATTERN = /^(\d{4,})(-)?(\d{2})(-)?(\d{2})(?:T(\d{2})(:)?(\d{2})?(:)?(\d{2}(?:\.(\d{1,3})\d*)?)?)?(Z|([+-])(\d{2})(:)?(\d{2})?)?$/;
const ISO8601_TIME_PATTERN = /^(\d{2}):(\d{2})(:(\d{2}))?$/;
const ISO8601_PATTERN_PARTS = ['', 'yyyy', '', 'MM', '', 'dd', 'THH', '', 'mm', '', 'ss', '.SSS'];
const DATE_SERIALIZATION_PATTERN = /^(\d{4})\/(\d{2})\/(\d{2})$/;

const MILLISECOND_LENGHT = 3;

function getTimePart(part: string): number {
  return +part || 0;
}

function createLocalDateFromUTCTimestamp(timestamp: number): Date {
  const utc = new Date(timestamp);

  return new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
}

function isISOPartialDateString(text: string): boolean {
  return ISO_PARTIAL_DATE_PATTERN.test(text);
}

const getIso8601Format = function getIso8601Format(
  text: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useUtc?: boolean,
): string | undefined {
  let parts = ISO8601_PATTERN.exec(text);
  let result = '';

  if (!parts) {
    parts = ISO8601_TIME_PATTERN.exec(text);
    if (parts) {
      return parts[3] ? 'HH:mm:ss' : 'HH:mm';
    }
    return undefined;
  }

  for (let i = 1; i < ISO8601_PATTERN_PARTS.length; i += 1) {
    if (parts[i]) {
      result += ISO8601_PATTERN_PARTS[i] || parts[i];
    }
  }

  if (parts[12] === 'Z') {
    result += '\'Z\'';
  }

  if (parts[14]) {
    if (parts[15]) {
      result += 'xxx';
    } else if (parts[16]) {
      result += 'xx';
    } else {
      result += 'x';
    }
  }

  return result;
};

const getDateSerializationFormat = function getDateSerializationFormat(
  value: unknown,
): string | null | undefined {
  if (typeof value === 'number') {
    return NUMBER_SERIALIZATION_FORMAT;
  } if (isString(value)) {
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if below
    let format: string | undefined;

    if (config().forceIsoDateParsing) {
      format = getIso8601Format(value);
    }
    if (format) {
      return format;
    } if (value.includes(':')) {
      return DATETIME_SERIALIZATION_FORMAT;
    }
    return DATE_SERIALIZATION_FORMAT;
  } if (value) {
    return null;
  }

  return undefined;
};

function parseDate(text: unknown): unknown {
  const parsedValue = !isDate(text) && Date.parse(String(text));

  if (!parsedValue && isString(text) && getDateSerializationFormat(text) === DATE_SERIALIZATION_FORMAT) {
    const parts = DATE_SERIALIZATION_PATTERN.exec(text);

    if (parts) {
      const newDate = new Date(getTimePart(parts[1]), getTimePart(parts[2]), getTimePart(parts[3]));

      newDate.setFullYear(getTimePart(parts[1]));
      newDate.setMonth(getTimePart(parts[2]) - 1);
      newDate.setDate(getTimePart(parts[3]));

      return newDate;
    }
  }

  if (!isNumber(parsedValue)) {
    return text;
  }

  return isISOPartialDateString(String(text))
    ? createLocalDateFromUTCTimestamp(parsedValue)
    : new Date(parsedValue);
}

function parseISO8601String(text: string): Date | undefined {
  let parts = ISO8601_PATTERN.exec(text);

  if (!parts) {
    parts = ISO8601_TIME_PATTERN.exec(text);
    if (parts) {
      return new Date(0, 0, 0, getTimePart(parts[1]), getTimePart(parts[2]), getTimePart(parts[4]));
    }

    return undefined;
  }

  const year = getTimePart(parts[1]);
  const month = Number(parts[3]) - 1;
  const day = Number(parts[5]);
  let timeZoneHour = 0;
  let timeZoneMinute = 0;
  const correctYear = (d: Date): Date => {
    if (year < 100) {
      d.setFullYear(year);
    }
    return d;
  };

  timeZoneHour = getTimePart(parts[14]);
  timeZoneMinute = getTimePart(parts[16]);

  if (parts[13] === '-') {
    timeZoneHour = -timeZoneHour;
    timeZoneMinute = -timeZoneMinute;
  }

  const hour = getTimePart(parts[6]) - timeZoneHour;
  const minute = getTimePart(parts[8]) - timeZoneMinute;
  const second = getTimePart(parts[10]);
  const parseMilliseconds = function parseMilliseconds(part = ''): number {
    return getTimePart(part) * 10 ** (MILLISECOND_LENGHT - part.length);
  };
  const millisecond = parseMilliseconds(parts[11]);

  if (parts[12]) {
    return correctYear(new Date(Date.UTC(year, month, day, hour, minute, second, millisecond)));
  }

  return correctYear(new Date(year, month, day, hour, minute, second, millisecond));
}

function dateParser<T>(text: T, skipISO8601Parsing?: boolean): T | Date;
function dateParser(text: unknown, skipISO8601Parsing?: boolean): unknown {
  // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if below
  let result: Date | undefined;

  if (isString(text) && !skipISO8601Parsing) {
    result = parseISO8601String(text);
  }

  return result ?? parseDate(text);
}

function deserializeDate<T>(value: T): Date | Exclude<T, number | Date>;
function deserializeDate(value: unknown): unknown {
  if (typeof value === 'number') {
    return new Date(value);
  }

  return dateParser(value, !config().forceIsoDateParsing);
}

type SerializedDate<TFormat extends string> = TFormat extends typeof NUMBER_SERIALIZATION_FORMAT
  ? number | null
  : string extends TFormat ? string | number | null : string | null;

function serializeDate<T>(value: T, serializationFormat?: null): T;
function serializeDate<TFormat extends string>(
  value: unknown,
  serializationFormat: TFormat,
): SerializedDate<TFormat>;
function serializeDate<T>(
  value: T,
  serializationFormat?: string | null,
): T | string | number | null;
function serializeDate(value: unknown, serializationFormat?: string | null): unknown {
  if (!serializationFormat) {
    return value;
  }

  if (!isDate(value)) {
    return null;
  }

  if (serializationFormat === NUMBER_SERIALIZATION_FORMAT) {
    return value?.valueOf ? value.valueOf() : null;
  }

  return getLDMLFormatter(serializationFormat, defaultDateNames)(value);
}

const dateSerialization = {
  createLocalDateFromUTCTimestamp,
  dateParser,
  deserializeDate,
  serializeDate,
  getDateSerializationFormat,
};

export { dateSerialization };
