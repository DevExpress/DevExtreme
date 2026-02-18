import { getPatternSetters } from '@js/common/core/localization/ldml/date.parser';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { fitIntoRange } from '@js/core/utils/math';

const getLimits = (
  pattern: string,
  date: Date,
  forcedPattern?: string,
): { min: number; max: number } => {
  const limits: Record<string, { min: number; max: number }> = {
    y: { min: 0, max: 9999 },
    M: { min: 1, max: 12 },
    L: { min: 1, max: 12 },
    d: { min: 1, max: 31 },
    dM: {
      min: 1,
      max: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
    },
    E: { min: 0, max: 6 },
    H: { min: 0, max: 23 },
    h: { min: 1, max: 12 },
    m: { min: 0, max: 59 },
    s: { min: 0, max: 59 },
    S: { min: 0, max: 999 },
    a: { min: 0, max: 1 },
    x: { min: 0, max: 0 }, // NOTE: Timezone part is read only.
  };
  return limits[forcedPattern ?? pattern] ?? { min: 0, max: 0 };
};

const monthGetter = (date: Date): number => date.getMonth() + 1;

const monthSetter = (date: Date, value: number | string): void => {
  const day = date.getDate();
  const monthLimits = getLimits('M', date);
  const newValue = fitIntoRange(+value, monthLimits.min, monthLimits.max);

  date.setMonth(newValue - 1, 1);

  const { min, max } = getLimits('dM', date);
  const newDay = fitIntoRange(day, min, max);

  date.setDate(newDay);
};

const PATTERN_GETTERS = {
  a: (date: Date): number => (date.getHours() < 12 ? 0 : 1),
  E: 'getDay',
  y: 'getFullYear',
  M: monthGetter,
  L: monthGetter,
  d: 'getDate',
  H: 'getHours',
  h: 'getHours',
  m: 'getMinutes',
  s: 'getSeconds',
  S: 'getMilliseconds',
  x: 'getTimezoneOffset',
};

const PATTERN_SETTERS = extend({}, getPatternSetters(), {
  a: (date: Date, value: number | string): void => {
    const hours = date.getHours();
    const current = hours >= 12;

    if (current === !!+value) {
      return;
    }

    date.setHours((hours + 12) % 24);
  },
  d: (date: Date, value: number | string): void => {
    const lastDayInMonth = getLimits('dM', date).max;

    if (+value > lastDayInMonth) {
      date.setMonth(date.getMonth() + 1);
    }

    date.setDate(+value);
  },
  h: (date: Date, value: number | string): void => {
    const isPM = date.getHours() >= 12;
    date.setHours((+value % 12) + (isPM ? 12 : 0));
  },
  M: monthSetter,
  L: monthSetter,
  E: (date: Date, value: number | string): void => {
    if (+value < 0) {
      return;
    }

    date.setDate(date.getDate() - date.getDay() + +value);
  },
  y: (date: Date, value: number | string): void => {
    const currentYear = date.getFullYear();
    const valueLength = String(value).length;
    const maxLimitLength = String(getLimits('y', date).max).length;
    const yearPrefix = String(currentYear).substr(0, maxLimitLength - valueLength);
    const newValue = parseInt(yearPrefix + value, 10);

    date.setFullYear(newValue);
  },
  x: (date: Date): Date => date,
});

const getPatternGetter = (patternChar: string): string | ((date: Date) => number | Date) => {
  const unsupportedCharGetter = (): string => patternChar;
  return (PATTERN_GETTERS[patternChar]
    ?? unsupportedCharGetter) as string | ((date: Date) => number | Date);
};

interface Section {
  index: number;
  isStub: boolean;
  caret: { start: number; end: number };
  pattern: string;
  text: string;
  limits: (date: Date, forcedPattern?: string) => { min: number; max: number };
  setter: (date: Date, value: number | string) => void;
  getter: string | ((date: Date) => Date | number);
}

export const renderDateParts = (
  text: string,
  regExpInfo: { regexp: RegExp; patterns: string[] },
): Section[] => {
  const result = regExpInfo.regexp.exec(text) ?? [];

  let start = 0;
  let end = 0;
  const sections: Section[] = [];

  for (let i = 1; i < result.length; i += 1) {
    start = end;
    end = start + result[i].length;

    const pattern = regExpInfo.patterns[i - 1].replace(/^'|'$/g, '');
    const getter = getPatternGetter(pattern[0]);

    sections.push({
      index: i - 1,
      isStub: pattern === result[i],
      caret: { start, end },
      pattern,
      text: result[i],
      limits: (date: Date, forcedPattern?: string) => getLimits(pattern[0], date, forcedPattern),
      setter: PATTERN_SETTERS[pattern[0]] ?? noop,
      getter,
    });
  }

  return sections;
};

export const getDatePartIndexByPosition = (
  dateParts: { caret: { start: number; end: number }; isStub: boolean }[],
  position: number,
): number | null => {
  for (let i = 0; i < dateParts.length; i += 1) {
    const caretInGroup = dateParts[i].caret.end >= position;

    if (!dateParts[i].isStub && caretInGroup) {
      return i;
    }
  }

  return null;
};
