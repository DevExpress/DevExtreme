import { adjust } from '@js/core/utils/math';
import { isString } from '@js/core/utils/type';
import type { Format } from '@js/localization';

export interface SeparatorPosition {
  occurrence: number;
  index: number;
}

const asPattern = (format: Format): string => (isString(format) ? format : '');

const getRealSeparatorIndex = (format: Format): SeparatorPosition => {
  const pattern = asPattern(format);
  let quoteBalance = 0;
  let separatorCount = 0;

  for (let i = 0; i < pattern.length; i += 1) {
    if (pattern[i] === '\'') {
      quoteBalance += 1;
    }
    if (pattern[i] === '.') {
      separatorCount += 1;
      if (quoteBalance % 2 === 0) {
        return {
          occurrence: separatorCount,
          index: i,
        };
      }
    }
  }

  return { occurrence: 1, index: -1 };
};

const getNthOccurrence = (str: string, char: string, occurrence: number): number => {
  let index = -1;

  for (let remaining = occurrence; remaining > 0; remaining -= 1) {
    index = str.indexOf(char, index + 1);

    if (index === -1) {
      return -1;
    }
  }

  return index;
};

const splitByIndex = (str: string, index: number): string[] => {
  if (index === -1) {
    return [str];
  }

  return [str.slice(0, index), str.slice(index + 1)];
};

const adjustPercentValue = (
  rawValue: number | null | undefined,
  interval: number,
): number | null | undefined => {
  if (!rawValue) {
    return rawValue;
  }

  return adjust(rawValue / 100, interval / 100);
};

export {
  adjustPercentValue,
  asPattern,
  getNthOccurrence,
  getRealSeparatorIndex,
  splitByIndex,
};
