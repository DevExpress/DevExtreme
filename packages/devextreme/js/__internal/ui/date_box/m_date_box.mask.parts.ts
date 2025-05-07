import { getPatternSetters } from '@js/common/core/localization/ldml/date.parser';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { fitIntoRange } from '@js/core/utils/math';

const monthGetter = (date) => date.getMonth() + 1;

const monthSetter = (date, value) => {
  const day = date.getDate();
  // @ts-expect-error
  const monthLimits = getLimits('M', date);
  // eslint-disable-next-line radix
  const newValue = fitIntoRange(parseInt(value), monthLimits.min, monthLimits.max);

  date.setMonth(newValue - 1, 1);
  // @ts-expect-error
  const { min, max } = getLimits('dM', date);
  const newDay = fitIntoRange(day, min, max);

  date.setDate(newDay);
};

const PATTERN_GETTERS = {
  a: (date) => (date.getHours() < 12 ? 0 : 1),
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
  a: (date, value) => {
    const hours = date.getHours();
    const current = hours >= 12;

    // eslint-disable-next-line radix
    if (current === !!parseInt(value)) {
      return;
    }

    date.setHours((hours + 12) % 24);
  },
  d: (date, value) => {
    // @ts-expect-error
    const lastDayInMonth = getLimits('dM', date).max;

    if (value > lastDayInMonth) {
      date.setMonth(date.getMonth() + 1);
    }

    date.setDate(value);
  },
  h: (date, value) => {
    const isPM = date.getHours() >= 12;
    date.setHours((+value % 12) + (isPM ? 12 : 0));
  },
  M: monthSetter,
  L: monthSetter,
  E: (date, value) => {
    if (value < 0) {
      return;
    }
    // eslint-disable-next-line radix
    date.setDate(date.getDate() - date.getDay() + parseInt(value));
  },
  y: (date, value) => {
    const currentYear = date.getFullYear();
    const valueLength = String(value).length;
    // @ts-expect-error
    const maxLimitLength = String(getLimits('y', date).max).length;
    // eslint-disable-next-line radix
    const newValue = parseInt(String(currentYear).substr(0, maxLimitLength - valueLength) + value);

    date.setFullYear(newValue);
  },
  x: (date) => date,
});

const getPatternGetter = (patternChar) => {
  const unsupportedCharGetter = () => patternChar;
  return PATTERN_GETTERS[patternChar] || unsupportedCharGetter;
};

export const renderDateParts = (text, regExpInfo) => {
  const result = regExpInfo.regexp.exec(text);

  let start = 0;
  let end = 0;
  const sections = [];

  for (let i = 1; i < result.length; i++) {
    start = end;
    end = start + result[i].length;

    const pattern = regExpInfo.patterns[i - 1].replace(/^'|'$/g, '');
    const getter = getPatternGetter(pattern[0]);

    // @ts-expect-error
    sections.push({
      index: i - 1,
      isStub: pattern === result[i],
      caret: { start, end },
      pattern,
      text: result[i],
      // @ts-expect-error
      limits: (...args) => getLimits(pattern[0], ...args),
      setter: PATTERN_SETTERS[pattern[0]] || noop,
      getter,
    });
  }

  return sections;
};

const getLimits = (pattern, date, forcedPattern) => {
  const limits = {
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
  // @ts-expect-error
  return limits[forcedPattern || pattern] || limits.getAmPm;
};

export const getDatePartIndexByPosition = (dateParts, position) => {
  for (let i = 0; i < dateParts.length; i++) {
    const caretInGroup = dateParts[i].caret.end >= position;

    if (!dateParts[i].isStub && caretInGroup) {
      return i;
    }
  }

  return null;
};
