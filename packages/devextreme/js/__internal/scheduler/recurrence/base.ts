import dateUtils from '@js/core/utils/date';

import type { Rule } from './types';

const toMs = dateUtils.dateToMilliseconds;

export const getAsciiStringByDate = (date: Date): string => {
  const currentOffset = date.getTimezoneOffset() * toMs('minute');
  const offsetDate = new Date(date.getTime() + currentOffset);

  return `${offsetDate.getFullYear() + `0${offsetDate.getMonth() + 1}`.slice(-2) + `0${offsetDate.getDate()}`.slice(-2)
  }T${`0${offsetDate.getHours()}`.slice(-2)}${`0${offsetDate.getMinutes()}`.slice(-2)}${`0${offsetDate.getSeconds()}`.slice(-2)}Z`;
};

export const getRecurrenceString = (rule: Rule): string | undefined => {
  if (!rule?.freq) {
    return undefined;
  }

  const result = Object.entries(rule).reduce((acc, [field, value]) => {
    if (field === 'freq' || (field === 'interval' && value < 2)) {
      return acc;
    }

    if (field === 'until') {
      return `${acc}${field}=${getAsciiStringByDate(value)};`;
    }

    return `${acc}${field}=${value};`;
  }, `freq=${rule.freq};`);

  return result.substring(0, result.length - 1).toUpperCase();
};

const createDateTuple = (parseResult: RegExpExecArray): [
  number,
  number,
  number,
  number,
  number,
  number,
  boolean,
] => {
  const isUtc = parseResult[8] !== undefined;

  parseResult.shift();

  if (parseResult[3] === undefined) {
    parseResult.splice(3);
  } else {
    parseResult.splice(3, 1);
    parseResult.splice(6);
  }

  parseResult.unshift('');

  return [
    parseInt(parseResult[1], 10),
    parseInt(parseResult[2], 10) - 1,
    parseInt(parseResult[3], 10),
    parseInt(parseResult[4], 10) || 0,
    parseInt(parseResult[5], 10) || 0,
    parseInt(parseResult[6], 10) || 0,
    isUtc,
  ];
};

const parseExceptionToRawArray = (value: string): RegExpExecArray | null => /(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2}))?(Z)?/.exec(value);

export const getDateByAsciiString = (exceptionText: string | Date): Date | null => {
  if (typeof exceptionText !== 'string') {
    return exceptionText;
  }

  const result = parseExceptionToRawArray(exceptionText);

  if (!result) {
    return null;
  }

  const [year, month, date, hours, minutes, seconds, isUtc] = createDateTuple(result);

  if (isUtc) {
    return new Date(Date.UTC(
      year,
      month,
      date,
      hours,
      minutes,
      seconds,
    ));
  }

  return new Date(
    year,
    month,
    date,
    hours,
    minutes,
    seconds,
  );
};

export const parseRecurrenceRule = (recurrenceRule: string): Rule => {
  const emptyRule = { interval: 1 } as unknown as Rule;
  if (!recurrenceRule) {
    return emptyRule;
  }

  const ruleParts = recurrenceRule.split(';');
  const ruleObject = ruleParts.reduce((result, part) => {
    const rule = part.split('=');
    const ruleName = rule[0].toLowerCase();
    const ruleValue = rule[1];

    switch (ruleName) {
      case 'count':
      case 'interval': {
        const value = parseInt(ruleValue, 10);
        if (!isNaN(value)) {
          result[ruleName] = value;
        }
        break;
      }
      default:
        result[ruleName] = ruleValue;
    }

    return result;
  }, emptyRule);

  if (ruleObject.freq && ruleObject.until) {
    ruleObject.until = getDateByAsciiString(ruleObject.until);
  }

  return ruleObject;
};
