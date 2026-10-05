/* eslint-disable @typescript-eslint/naming-convention */
import { map } from '@js/core/utils/iterator';

type Text = string | number | null | undefined;

const _normalize = function (text: Text): string {
  if (text === undefined || text === null) {
    return '';
  }
  return String(text);
};

const _upperCaseFirst = function (text: string): string {
  return _normalize(text).charAt(0).toUpperCase() + text.substr(1);
};

const _chop = function (text: Text): string[] {
  return _normalize(text)
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .split(/[\s_-]+/);
};

export const dasherize = function (text: Text): string {
  return map(_chop(text), (p: string): string => p.toLowerCase()).join('-');
};

export const underscore = function (text: Text): string {
  return dasherize(text).replace(/-/g, '_');
};

export const camelize = function (text: Text, upperFirst?: boolean): string {
  return map(_chop(text), (p: string, i: number): string => {
    let part = p.toLowerCase();
    if (upperFirst || i > 0) {
      part = _upperCaseFirst(part);
    }
    return part;
  }).join('');
};

export const humanize = function (text: Text): string {
  return _upperCaseFirst(dasherize(text).replace(/-/g, ' '));
};

export const titleize = function (text: Text): string {
  return map(_chop(text), (p: string): string => _upperCaseFirst(p.toLowerCase())).join(' ');
};

const DIGIT_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export const captionize = function (name: string | undefined): string {
  const captionList: string[] = [];
  let isPrevCharNewWord = false;
  let isNewWord = false;

  for (let i = 0; i < (name as string).length; i += 1) {
    let char = (name as string).charAt(i);
    isNewWord = (char === char.toUpperCase() && char !== '-' && char !== ')' && char !== '/') || (char in DIGIT_CHARS);
    if (char === '_' || char === '.') {
      char = ' ';
      isNewWord = true;
    } else if (i === 0) {
      char = char.toUpperCase();
      isNewWord = true;
    } else if (!isPrevCharNewWord && isNewWord) {
      if (captionList.length > 0) {
        captionList.push(' ');
      }
    }
    captionList.push(char);
    isPrevCharNewWord = isNewWord;
  }
  return captionList.join('');
};

export default {
  dasherize,
  underscore,
  camelize,
  humanize,
  titleize,
  captionize,
};
