"use strict";

exports.underscore = exports.titleize = exports.humanize = exports.dasherize = exports.captionize = exports.camelize = void 0;
var _iterator = require("./iterator");
const _normalize = function (text) {
  if (text === undefined || text === null) {
    return '';
  }
  return String(text);
};
const _upperCaseFirst = function (text) {
  return _normalize(text).charAt(0).toUpperCase() + text.substr(1);
};
const _chop = function (text) {
  return _normalize(text).replace(/([a-z\d])([A-Z])/g, '$1 $2').split(/[\s_-]+/);
};
const dasherize = function (text) {
  return (0, _iterator.map)(_chop(text), function (p) {
    return p.toLowerCase();
  }).join('-');
};
exports.dasherize = dasherize;
const underscore = function (text) {
  return dasherize(text).replace(/-/g, '_');
};
exports.underscore = underscore;
const camelize = function (text, upperFirst) {
  return (0, _iterator.map)(_chop(text), function (p, i) {
    p = p.toLowerCase();
    if (upperFirst || i > 0) {
      p = _upperCaseFirst(p);
    }
    return p;
  }).join('');
};
exports.camelize = camelize;
const humanize = function (text) {
  return _upperCaseFirst(dasherize(text).replace(/-/g, ' '));
};
exports.humanize = humanize;
const titleize = function (text) {
  return (0, _iterator.map)(_chop(text), function (p) {
    return _upperCaseFirst(p.toLowerCase());
  }).join(' ');
};
exports.titleize = titleize;
const DIGIT_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const captionize = function (name) {
  const captionList = [];
  let i;
  let char;
  let isPrevCharNewWord = false;
  let isNewWord = false;
  for (i = 0; i < name.length; i++) {
    char = name.charAt(i);
    isNewWord = char === char.toUpperCase() && char !== '-' && char !== ')' && char !== '/' || char in DIGIT_CHARS;
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
exports.captionize = captionize;