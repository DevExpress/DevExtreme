import type { DateFormatter } from '@ts/core/localization/date';
import numberLocalization from '@ts/core/localization/number';

const ARABIC_COMMA = '\u060C';
const FORMAT_SEPARATORS = ` .,:;/\\<>()-[]${ARABIC_COMMA}`;
const AM_PM_PATTERN = '. m.';

const checkDigit = (char: string): boolean => {
  const code = char && numberLocalization.convertDigits(char, false).charCodeAt(0);
  const zeroCode = numberLocalization.convertDigits('0', false).charCodeAt(0);

  return zeroCode <= code && code < zeroCode + 10;
};

const checkPatternContinue = (
  text: string,
  patterns: string[],
  index: number,
  isDigit: boolean,
): boolean => {
  const char = text[index];
  const nextChar = text[index + 1];

  if (!isDigit) {
    if (char === '.' || (char === ' ' && text.slice(index - 1, index + 3) === AM_PM_PATTERN)) {
      return true;
    }
    if (char === '-' && !checkDigit(nextChar)) {
      return true;
    }
  }
  const isDigitChanged = isDigit && patterns.some((pattern) => text[index] !== pattern[index]);

  return !FORMAT_SEPARATORS.includes(char)
    && (isDigit === checkDigit(char) && (!isDigit || isDigitChanged));
};

const getPatternStartIndex = (defaultPattern: string, index: number): number => {
  if (!checkDigit(defaultPattern[index])) {
    while (index > 0
            && !checkDigit(defaultPattern[index - 1])
            && (defaultPattern[index - 1] === '.'
            || !FORMAT_SEPARATORS.includes(defaultPattern[index - 1]))) {
      // eslint-disable-next-line no-param-reassign
      index -= 1;
    }
  }
  return index;
};

const getDifference = (
  defaultPattern: string,
  patterns: string | string[],
  processedIndexes: number[],
  isDigit: boolean | undefined,
): number[] => {
  let i = 0;
  const result: number[] = [];

  const patternsFilter = (pattern: string): boolean => defaultPattern[i] !== pattern[i]
      && (isDigit === undefined || checkDigit(defaultPattern[i]) === isDigit);

  if (!Array.isArray(patterns)) {
    // eslint-disable-next-line no-param-reassign
    patterns = [patterns];
  }

  for (i = 0; i < defaultPattern.length; i += 1) {
    if (!processedIndexes.includes(i) && patterns.filter(patternsFilter).length) {
      i = getPatternStartIndex(defaultPattern, i);
      do {
        // eslint-disable-next-line no-param-reassign
        isDigit = checkDigit(defaultPattern[i]);
        // eslint-disable-next-line max-depth
        if (!result.length && !isDigit && checkDigit(patterns[0][i])) {
          break;
        }
        result.push(i);
        processedIndexes.unshift(i);
        i += 1;
      } while (defaultPattern[i] && checkPatternContinue(defaultPattern, patterns, i, isDigit));
      break;
    }
  }

  if (result.length === 1 && (defaultPattern[processedIndexes[0] - 1] === '0' || defaultPattern[processedIndexes[0] - 1] === '٠')) {
    processedIndexes.unshift(processedIndexes[0] - 1);
  }

  return result;
};

const replaceCharsCore = (
  pattern: string,
  indexes: number[],
  char: string,
  patternPositions: number[],
): string => {
  const baseCharIndex = indexes[0];
  const patternIndex = baseCharIndex < patternPositions.length
    ? patternPositions[baseCharIndex]
    : baseCharIndex;

  indexes.forEach((_, index) => {
    // eslint-disable-next-line no-param-reassign
    pattern = pattern.substr(0, patternIndex + index)
      + (char.length > 1 ? char[index] : char)
      + pattern.substr(patternIndex + index + 1);
  });

  if (indexes.length === 1) {
    // eslint-disable-next-line no-param-reassign
    pattern = pattern.replace(`0${char}`, char + char);
    // eslint-disable-next-line no-param-reassign
    pattern = pattern.replace(`٠${char}`, char + char);
  }

  return pattern;
};

const replaceChars = (
  pattern: string,
  indexes: number[],
  char: string,
  patternPositions: number[],
): string => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let i: number;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let index: number;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let patternIndex: number;

  if (!checkDigit(pattern[indexes[0]] || '0')) {
    const letterCount = Math.max(indexes.length <= 3 ? 3 : 4, char.length);

    while (indexes.length > letterCount) {
      index = indexes.pop() as number;
      patternIndex = patternPositions[index];

      patternPositions[index] = -1;
      for (i = index + 1; i < patternPositions.length; i += 1) {
        patternPositions[i] -= 1;
      }
      // eslint-disable-next-line no-param-reassign
      pattern = pattern.substr(0, patternIndex) + pattern.substr(patternIndex + 1);
    }

    index = indexes[indexes.length - 1] + 1;
    patternIndex = index < patternPositions.length ? patternPositions[index] : index;

    while (indexes.length < letterCount) {
      indexes.push(indexes[indexes.length - 1] + 1);
      for (i = index; i < patternPositions.length; i += 1) {
        patternPositions[i] += 1;
      }
      // eslint-disable-next-line no-param-reassign
      pattern = `${pattern.substr(0, patternIndex)} ${pattern.substr(patternIndex)}`;
    }
  }

  // eslint-disable-next-line no-param-reassign
  pattern = replaceCharsCore(pattern, indexes, char, patternPositions);

  return pattern;
};

const formatValue = (value: Date | Date[], formatter: DateFormatter): string | string[] => {
  if (Array.isArray(value)) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    return value.map((value) => (formatter(value) || '').toString());
  }
  return (formatter(value) || '').toString();
};

const ESCAPE_CHARS_REGEXP = /[a-zA-Z]/g;

const escapeChars = (
  pattern: string,
  defaultPattern: string,
  processedIndexes: number[],
  patternPositions: number[],
): string => {
  const escapeIndexes = defaultPattern
    .split('')
    .map((char, index) => {
      if (!processedIndexes.includes(index) && (char.match(ESCAPE_CHARS_REGEXP) || char === '\'')) {
        return patternPositions[index];
      }
      return -1;
    });

  // eslint-disable-next-line no-param-reassign
  pattern = pattern
    .split('')
    .map((char, index) => {
      let result = char;
      const isCurrentCharEscaped = escapeIndexes.includes(index);
      const isPrevCharEscaped = index > 0 && escapeIndexes.includes(index - 1);
      const isNextCharEscaped = escapeIndexes.includes(index + 1);

      if (isCurrentCharEscaped) {
        if (!isPrevCharEscaped) {
          result = `'${result}`;
        }
        if (!isNextCharEscaped) {
          result = `${result}'`;
        }
      }

      return result;
    })
    .join('');

  return pattern;
};

export const getFormat = (formatter: DateFormatter): string | undefined => {
  const processedIndexes = [];
  const defaultPattern = formatValue(new Date(2009, 8, 8, 6, 5, 4), formatter) as string;
  const patternPositions = defaultPattern.split('').map((_, index) => index);
  let result = defaultPattern;
  const replacedPatterns: Record<string, number> = {};
  const datePatterns = [
    { date: new Date(2009, 8, 8, 6, 5, 4, 111), pattern: 'S' },
    { date: new Date(2009, 8, 8, 6, 5, 2), pattern: 's' },
    { date: new Date(2009, 8, 8, 6, 2, 4), pattern: 'm' },
    { date: new Date(2009, 8, 8, 18, 5, 4), pattern: 'H', isDigit: true },
    { date: new Date(2009, 8, 8, 2, 5, 4), pattern: 'h', isDigit: true },
    { date: new Date(2009, 8, 8, 18, 5, 4), pattern: 'a', isDigit: false },
    { date: new Date(2009, 8, 1, 6, 5, 4), pattern: 'd' },
    { date: [new Date(2009, 8, 2, 6, 5, 4), new Date(2009, 8, 3, 6, 5, 4), new Date(2009, 8, 4, 6, 5, 4)], pattern: 'E' },
    { date: new Date(2009, 9, 6, 6, 5, 4), pattern: 'M' },
    { date: new Date(1998, 8, 8, 6, 5, 4), pattern: 'y' }];

  if (!result) {
    return undefined;
  }

  datePatterns.forEach((test) => {
    const diff = getDifference(
      defaultPattern,
      formatValue(test.date, formatter),
      processedIndexes,
      test.isDigit,
    );
    const pattern = test.pattern === 'M' && !replacedPatterns.d ? 'L' : test.pattern;

    result = replaceChars(result, diff, pattern, patternPositions);
    replacedPatterns[pattern] = diff.length;
  });

  result = escapeChars(result, defaultPattern, processedIndexes, patternPositions);

  if (processedIndexes.length) {
    return result;
  }

  return undefined;
};
