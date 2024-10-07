import { map } from '@js/core/utils/iterator';

const normalize = function (text) {
  if (text === undefined || text === null) {
    return '';
  }
  return String(text);
};

const upperCaseFirst = function (text) {
  return normalize(text).charAt(0).toUpperCase() + text.substr(1);
};

const chop = function (text) {
  return normalize(text)
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .split(/[\s_-]+/);
};

export const dasherize = function (text) {
  return map(chop(text), (p) => p.toLowerCase()).join('-');
};

export const underscore = function (text) {
  return dasherize(text).replace(/-/g, '_');
};

export const camelize = function (text, upperFirst?: boolean) {
  return map(chop(text), (p, i) => {
    p = p.toLowerCase();
    if (upperFirst || i > 0) {
      p = upperCaseFirst(p);
    }
    return p;
  }).join('');
};

export const humanize = function (text) {
  return upperCaseFirst(dasherize(text).replace(/-/g, ' '));
};

export const titleize = function (text) {
  return map(chop(text), (p) => upperCaseFirst(p.toLowerCase())).join(' ');
};

const DIGIT_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export const captionize = function (name) {
  const captionList: any[] = [];
  let i;
  let char;
  let isPrevCharNewWord = false;
  let isNewWord = false;

  for (i = 0; i < name.length; i++) {
    char = name.charAt(i);
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
