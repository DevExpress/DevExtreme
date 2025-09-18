/* eslint-disable spellcheck/spell-checker */
import type { Rule } from './types';

const isString = (str: string | null): str is string => Boolean(str);

export const daysFromByDayRule = (rule: Rule): string[] => {
  let result: string[] = [];

  if (rule.byday) {
    if (Array.isArray(rule.byday)) {
      result = rule.byday;
    } else {
      result = rule.byday.split(',');
    }
  }

  return result.map((item) => {
    const match = /[A-Za-z]+/.exec(item);
    return match && String(match[0]);
  }).filter(isString);
};
