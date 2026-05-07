/* eslint-disable spellcheck/spell-checker */
import type { Format } from '@ts/core/localization/date';
import type { LdlmDateLocalization } from '@ts/core/localization/ldml/date.parser';

function leftPad(text: string, length: number): string {
  while (text.length < length) {
    // eslint-disable-next-line no-param-reassign
    text = `0${text}`;
  }
  return text;
}

const FORMAT_TYPES: Record<number, Format> = {
  3: 'abbreviated',
  4: 'wide',
  5: 'narrow',
};

const LDML_FORMATTERS = {
  y(date: Date, count: number, useUtc: boolean): string {
    let year = date[useUtc ? 'getUTCFullYear' : 'getFullYear']();
    if (count === 2) {
      year %= 100;
    }
    return leftPad(year.toString(), count);
  },
  M(date: Date, count: number, useUtc: boolean, dateParts: LdlmDateLocalization): string {
    const month = date[useUtc ? 'getUTCMonth' : 'getMonth']();
    const formatType = FORMAT_TYPES[count];
    if (formatType) {
      return dateParts.getMonthNames(formatType, 'format')[month];
    }
    return leftPad((month + 1).toString(), Math.min(count, 2));
  },
  L(date: Date, count: number, useUtc: boolean, dateParts: LdlmDateLocalization): string {
    const month = date[useUtc ? 'getUTCMonth' : 'getMonth']();
    const formatType = FORMAT_TYPES[count];
    if (formatType) {
      return dateParts.getMonthNames(formatType, 'standalone')[month];
    }
    return leftPad((month + 1).toString(), Math.min(count, 2));
  },
  Q(date: Date, count: number, useUtc: boolean, dateParts: LdlmDateLocalization): string {
    const month = date[useUtc ? 'getUTCMonth' : 'getMonth']();
    const quarter = Math.floor(month / 3);
    const formatType = FORMAT_TYPES[count];
    if (formatType) {
      return dateParts.getQuarterNames(formatType)[quarter];
    }
    return leftPad((quarter + 1).toString(), Math.min(count, 2));
  },
  E(date: Date, count: number, useUtc: boolean, dateParts: LdlmDateLocalization): string {
    const day = date[useUtc ? 'getUTCDay' : 'getDay']();
    const formatType = FORMAT_TYPES[count < 3 ? 3 : count];
    return dateParts.getDayNames(formatType)[day];
  },
  a(date: Date, count: number, useUtc: boolean, dateParts: LdlmDateLocalization): string {
    const hours = date[useUtc ? 'getUTCHours' : 'getHours']();
    const period = hours < 12 ? 0 : 1;
    const formatType = FORMAT_TYPES[count];
    return dateParts.getPeriodNames(formatType)[period];
  },
  d(date: Date, count: number, useUtc: boolean): string {
    return leftPad(date[useUtc ? 'getUTCDate' : 'getDate']().toString(), Math.min(count, 2));
  },
  H(date: Date, count: number, useUtc: boolean): string {
    return leftPad(date[useUtc ? 'getUTCHours' : 'getHours']().toString(), Math.min(count, 2));
  },
  h(date: Date, count: number, useUtc: boolean): string {
    const hours = date[useUtc ? 'getUTCHours' : 'getHours']();
    return leftPad((hours % 12 || 12).toString(), Math.min(count, 2));
  },
  m(date: Date, count: number, useUtc: boolean): string {
    return leftPad(date[useUtc ? 'getUTCMinutes' : 'getMinutes']().toString(), Math.min(count, 2));
  },
  s(date: Date, count: number, useUtc: boolean): string {
    return leftPad(date[useUtc ? 'getUTCSeconds' : 'getSeconds']().toString(), Math.min(count, 2));
  },
  S(date: Date, count: number, useUtc: boolean): string {
    return leftPad(date[useUtc ? 'getUTCMilliseconds' : 'getMilliseconds']().toString(), 3).substr(0, count);
  },
  x(date: Date, count: number, useUtc: boolean): string {
    const timezoneOffset = useUtc ? 0 : date.getTimezoneOffset();
    const signPart = timezoneOffset > 0 ? '-' : '+';
    const timezoneOffsetAbs = Math.abs(timezoneOffset);
    const hours = Math.floor(timezoneOffsetAbs / 60);
    const minutes = timezoneOffsetAbs % 60;
    const hoursPart = leftPad(hours.toString(), 2);
    const minutesPart = leftPad(minutes.toString(), 2);

    return signPart + hoursPart + (count >= 3 ? ':' : '') + (count > 1 || minutes ? minutesPart : '');
  },
  X(date: Date, count: number, useUtc: boolean): string {
    if (useUtc || !date.getTimezoneOffset()) {
      return 'Z';
    }
    return LDML_FORMATTERS.x(date, count, useUtc);
  },
  Z(date: Date, count: number, useUtc: boolean): string {
    return LDML_FORMATTERS.X(date, count >= 5 ? 3 : 2, useUtc);
  },
};

export const getFormatter = (
  format: string | undefined,
  dateParts: LdlmDateLocalization,
) => (date: Date | null): Date | string | null => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let charIndex: number;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let formatter: typeof LDML_FORMATTERS[keyof typeof LDML_FORMATTERS];
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let char: string;
  let charCount = 0;
  const separator = '\'';
  let isEscaping = false;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let isCurrentCharEqualsNext: boolean;
  let result = '';

  if (!date) {
    return null;
  }

  if (!format) {
    return date;
  }

  const useUtc = format.endsWith('Z') || format.endsWith('\'Z\'');

  for (charIndex = 0; charIndex < format.length; charIndex += 1) {
    char = format[charIndex];
    formatter = LDML_FORMATTERS[char];
    isCurrentCharEqualsNext = char === format[charIndex + 1];
    charCount += 1;

    if (!isCurrentCharEqualsNext) {
      if (formatter && !isEscaping) {
        result += formatter(date, charCount, useUtc, dateParts);
      }
      charCount = 0;
    }

    if (char === separator && !isCurrentCharEqualsNext) {
      isEscaping = !isEscaping;
    } else if (isEscaping || !formatter) {
      result += char;
    }
    if (char === separator && isCurrentCharEqualsNext) {
      charIndex += 1;
    }
  }
  return result;
};
