/* eslint-disable spellcheck/spell-checker */
import type { Format } from '@ts/core/localization/date';
import { escapeRegExp } from '@ts/core/utils/m_common';
import { logger } from '@ts/core/utils/m_console';

export interface LdlmDateLocalization {
  getTimeSeparator?: () => string;
  getMonthNames: (format: Format, type?: string) => string[];
  getQuarterNames: (format: Format, type?: string) => string[];
  getPeriodNames: (format: Format, type?: string) => string[];
  getDayNames: (format: Format, type?: string) => string[];
}

const FORMAT_TYPES: Record<number, Format> = {
  3: 'abbreviated',
  4: 'wide',
  5: 'narrow',
};

const monthRegExpGenerator = (count: number, dateParts: LdlmDateLocalization): string => {
  if (count > 2) {
    return Object.keys(FORMAT_TYPES)
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .map((count) => ['format', 'standalone']
        .map((type) => dateParts.getMonthNames(FORMAT_TYPES[count], type).join('|'))
        .join('|'))
      .join('|');
  }
  return count === 2 ? '1[012]|0?[1-9]' : '0??[1-9]|1[012]';
};

const PATTERN_REGEXPS = {
  ':': (count: number, dateParts: LdlmDateLocalization): string => {
    const countSuffix = count > 1 ? `{${count}}` : '';
    let timeSeparator: string = escapeRegExp(dateParts.getTimeSeparator?.());
    if (timeSeparator !== ':') {
      timeSeparator = `${timeSeparator}|:`;
    }
    return `${timeSeparator}${countSuffix}`;
  },
  y(count: number): string {
    return count === 2 ? `[0-9]{${count}}` : '[0-9]+?';
  },
  M: monthRegExpGenerator,
  L: monthRegExpGenerator,
  Q(count: number, dateParts: LdlmDateLocalization): string {
    if (count > 2) {
      return dateParts.getQuarterNames(FORMAT_TYPES[count], 'format').join('|');
    }
    return '0?[1-4]';
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  E(_count: number, _dateParts: LdlmDateLocalization): string {
    return '\\D*';
  },
  a(count: number, dateParts: LdlmDateLocalization): string {
    return dateParts.getPeriodNames(FORMAT_TYPES[count < 3 ? 3 : count], 'format').join('|');
  },
  d(count: number): string {
    return count === 2 ? '3[01]|[12][0-9]|0?[1-9]' : '0??[1-9]|[12][0-9]|3[01]';
  },
  H(count: number): string {
    return count === 2 ? '2[0-3]|1[0-9]|0?[0-9]' : '0??[0-9]|1[0-9]|2[0-3]';
  },
  h(count: number): string {
    return count === 2 ? '1[012]|0?[1-9]' : '0??[1-9]|1[012]';
  },
  m(count: number): string {
    return count === 2 ? '[1-5][0-9]|0?[0-9]' : '0??[0-9]|[1-5][0-9]';
  },
  s(count: number): string {
    return count === 2 ? '[1-5][0-9]|0?[0-9]' : '0??[0-9]|[1-5][0-9]';
  },
  S(count: number): string {
    return `[0-9]{1,${count}}`;
  },
  w(count: number): string {
    return count === 2 ? '[1-5][0-9]|0?[0-9]' : '0??[0-9]|[1-5][0-9]';
  },
  x(count: number): string {
    return count === 3 ? '[+-](?:2[0-3]|[01][0-9]):(?:[0-5][0-9])|Z' : '[+-](?:2[0-3]|[01][0-9])(?:[0-5][0-9])|Z';
  },
};

const parseNumber = Number;

// eslint-disable-next-line arrow-body-style
const caseInsensitiveIndexOf = (array: string[], value: string): number => {
  return array.map((item) => item.toLowerCase()).indexOf(value.toLowerCase());
};

const monthPatternParser = (
  text: string,
  count: number,
  dateParts: LdlmDateLocalization,
): number => {
  if (count > 2) {
    return ['format', 'standalone']
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .map((type) => Object.keys(FORMAT_TYPES).map((count) => {
        const monthNames = dateParts.getMonthNames(FORMAT_TYPES[count], type);
        return caseInsensitiveIndexOf(monthNames, text);
      }))
      .reduce((a, b) => a.concat(b))
      .filter((index) => index >= 0)[0];
  }
  return parseNumber(text) - 1;
};

const PATTERN_PARSERS = {
  y(text: string, count: number): number {
    const year = parseNumber(text);
    if (count === 2) {
      return year < 30 ? 2000 + year : 1900 + year;
    }
    return year;
  },
  M: monthPatternParser,
  L: monthPatternParser,
  Q(text: string, count: number, dateParts: LdlmDateLocalization): number {
    if (count > 2) {
      return dateParts.getQuarterNames(FORMAT_TYPES[count], 'format').indexOf(text);
    }
    return parseNumber(text) - 1;
  },
  E(text: string, count: number, dateParts: LdlmDateLocalization): number {
    const dayNames = dateParts.getDayNames(FORMAT_TYPES[count < 3 ? 3 : count], 'format');
    return caseInsensitiveIndexOf(dayNames, text);
  },
  a(text: string, count: number, dateParts: LdlmDateLocalization): number {
    const periodNames = dateParts.getPeriodNames(FORMAT_TYPES[count < 3 ? 3 : count], 'format');
    return caseInsensitiveIndexOf(periodNames, text);
  },
  d: parseNumber,
  H: parseNumber,
  h: parseNumber,
  m: parseNumber,
  s: parseNumber,
  S(text: string, count: number): number {
    // eslint-disable-next-line no-param-reassign
    count = Math.max(count, 3);
    // eslint-disable-next-line no-param-reassign
    text = text.slice(0, 3);
    while (count < 3) {
      // eslint-disable-next-line no-param-reassign
      text = `${text}0`;
      // eslint-disable-next-line no-param-reassign
      count += 1;
    }
    return parseNumber(text);
  },
};

const ORDERED_PATTERNS = ['y', 'M', 'd', 'h', 'm', 's', 'S'];
const PATTERN_SETTERS = {
  y: 'setFullYear',
  M: 'setMonth',
  L: 'setMonth',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  a(date: Date, value: any, datePartValues: Record<string, number>): void {
    let hours = date.getHours();

    const hourPartValue = datePartValues.h;
    if (hourPartValue !== undefined && hourPartValue !== hours) {
      hours -= 1;
    }

    if (!value && hours === 12) {
      hours = 0;
    } else if (value && hours !== 12) {
      hours += 12;
    }

    date.setHours(hours);
  },
  d: 'setDate',
  H: 'setHours',
  h: 'setHours',
  m: 'setMinutes',
  s: 'setSeconds',
  S: 'setMilliseconds',
};

const getSameCharCount = (text: string, index: number): number => {
  const char = text[index];
  if (!char) {
    return 0;
  }
  let count = 0;

  do {
    // eslint-disable-next-line no-param-reassign
    index += 1;
    count += 1;
  } while (text[index] === char);

  return count;
};

const createPattern = (char: string, count: number): string => {
  let result = '';
  for (let i = 0; i < count; i += 1) {
    result += char;
  }
  return result;
};

const digitFieldSymbols = ['d', 'H', 'h', 'm', 's', 'w', 'M', 'L', 'Q'];
export const isPossibleForParsingFormat = (patterns: string[]): boolean => {
  const isDigitPattern = (pattern: string): boolean => {
    if (!pattern) {
      return false;
    }
    const char = pattern[0];
    return ['y', 'S'].includes(char) || (digitFieldSymbols.includes(char) && pattern.length < 3);
  };

  const isAmbiguousDigitPattern = (pattern: string): boolean => !pattern.startsWith('S') && pattern.length !== 2;

  let possibleForParsing = true;
  let ambiguousDigitPatternsCount = 0;

  // eslint-disable-next-line @typescript-eslint/no-shadow
  return patterns.every((pattern, index, patterns) => {
    if (isDigitPattern(pattern)) {
      if (isAmbiguousDigitPattern(pattern)) {
        // eslint-disable-next-line no-plusplus
        possibleForParsing = ++ambiguousDigitPatternsCount < 2;
      }
      if (!isDigitPattern(patterns[index + 1])) {
        ambiguousDigitPatternsCount = 0;
      }
    }
    return possibleForParsing;
  });
};

export const getRegExpInfo = (
  format: string,
  dateParts: LdlmDateLocalization,
): {
  patterns: string[];
  regexp: RegExp;
} => {
  let regexpText = '';
  let stubText = '';
  let isEscaping = false;
  const patterns: string[] = [];

  const addPreviousStub = (): void => {
    if (stubText) {
      patterns.push(`'${stubText}'`);
      regexpText += `${escapeRegExp(stubText)})`;
      stubText = '';
    }
  };

  for (let i = 0; i < format.length; i += 1) {
    const char = format[i];
    const isEscapeChar = char === '\'';
    const regexpPart = PATTERN_REGEXPS[char];

    if (isEscapeChar) {
      isEscaping = !isEscaping;
      if (format[i - 1] !== '\'') {
        // eslint-disable-next-line no-continue
        continue;
      }
    }

    if (regexpPart && !isEscaping) {
      const count = getSameCharCount(format, i);
      const pattern = createPattern(char, count);

      addPreviousStub();
      patterns.push(pattern);

      regexpText += `(${regexpPart(count, dateParts)})`;
      i += count - 1;
    } else {
      if (!stubText) {
        regexpText += '(';
      }
      stubText += char;
    }
  }

  addPreviousStub();
  if (!isPossibleForParsingFormat(patterns)) {
    logger.warn(`The following format may be parsed incorrectly: ${format}.`);
  }

  return {
    patterns,
    regexp: new RegExp(`^${regexpText}$`, 'i'),
  };
};

export const getPatternSetters = (): typeof PATTERN_SETTERS => PATTERN_SETTERS;

const setPatternPart = (
  date: Date,
  pattern: string,
  text: string,
  dateParts: LdlmDateLocalization,
  datePartValues: Record<string, number>,
): void => {
  const patternChar = pattern[0];
  const partSetter = PATTERN_SETTERS[patternChar];
  const partParser = PATTERN_PARSERS[patternChar];

  if (partSetter && partParser) {
    const value: number = partParser(text, pattern.length, dateParts);
    datePartValues[pattern] = value;
    if (date[partSetter]) {
      date[partSetter](value);
    } else {
      partSetter(date, value, datePartValues);
    }
  }
};

const setPatternPartFromNow = (date: Date, pattern: string, now: Date): void => {
  const setterName = PATTERN_SETTERS[pattern];
  const getterName = `g${setterName.substr(1)}`;
  const value = now[getterName]();
  date[setterName](value);
};

const getShortPatterns = (fullPatterns: string[]): string[] => fullPatterns.map((pattern) => {
  if (pattern.startsWith('\'')) {
    return '';
  }
  return pattern.startsWith('H') ? 'h' : pattern[0];
});

const getMaxOrderedPatternIndex = (patterns: string[]): number => {
  const indexes = patterns.map((pattern) => ORDERED_PATTERNS.indexOf(pattern));

  return Math.max(...indexes);
};

const getOrderedFormatPatterns = (formatPatterns: string[]): string[] => {
  const otherPatterns = formatPatterns.filter((pattern) => !ORDERED_PATTERNS.includes(pattern));

  return ORDERED_PATTERNS.concat(otherPatterns);
};

export const getParser = (format: string, dateParts: LdlmDateLocalization) => {
  const regExpInfo = getRegExpInfo(format, dateParts);

  return (text: string): Date | null => {
    const regExpResult = regExpInfo.regexp.exec(text);

    if (regExpResult) {
      const now = new Date();
      const date = new Date(now.getFullYear(), 0, 1);
      const formatPatterns = getShortPatterns(regExpInfo.patterns);
      const maxPatternIndex = getMaxOrderedPatternIndex(formatPatterns);
      const orderedFormatPatterns = getOrderedFormatPatterns(formatPatterns);
      const datePartValues = { };

      orderedFormatPatterns.forEach((pattern, index) => {
        if (!pattern || (index < ORDERED_PATTERNS.length && index > maxPatternIndex)) {
          return;
        }

        const patternIndex = formatPatterns.indexOf(pattern);
        if (patternIndex >= 0) {
          const regExpPattern = regExpInfo.patterns[patternIndex];
          const regExpText = regExpResult[patternIndex + 1];
          setPatternPart(date, regExpPattern, regExpText, dateParts, datePartValues);
        } else {
          setPatternPartFromNow(date, pattern, now);
        }
      });

      return date;
    }

    return null;
  };
};
