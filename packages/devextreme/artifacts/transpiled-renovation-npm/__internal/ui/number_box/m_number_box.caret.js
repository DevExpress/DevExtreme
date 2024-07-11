"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCaretBoundaries = exports.getCaretAfterFormat = void 0;
exports.getCaretInBoundaries = getCaretInBoundaries;
exports.isCaretInBoundaries = exports.getCaretWithOffset = exports.getCaretOffset = void 0;
var _common = require("../../../core/utils/common");
var _math = require("../../../core/utils/math");
var _number = _interopRequireDefault(require("../../../localization/number"));
var _m_utils = require("./m_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const getCaretBoundaries = function (text, format) {
  if (typeof format === 'string') {
    const signParts = format.split(';');
    const sign = _number.default.getSign(text, format);
    signParts[1] = signParts[1] || `-${signParts[0]}`;
    format = signParts[sign < 0 ? 1 : 0];
    const mockEscapedStubs = str => str.replace(/'([^']*)'/g, str => str.split('').map(() => ' ').join('').substr(2));
    format = mockEscapedStubs(format);
    // @ts-expect-error
    const prefixStubLength = /^[^#0.,]*/.exec(format)[0].length;
    // @ts-expect-error
    const postfixStubLength = /[^#0.,]*$/.exec(format)[0].length;
    return {
      start: prefixStubLength,
      end: text.length - postfixStubLength
    };
  }
  return {
    start: 0,
    end: text.length
  };
};
// eslint-disable-next-line @typescript-eslint/naming-convention
exports.getCaretBoundaries = getCaretBoundaries;
const _getDigitCountBeforeIndex = function (index, text) {
  const decimalSeparator = _number.default.getDecimalSeparator();
  const regExp = new RegExp(`[^0-9${(0, _common.escapeRegExp)(decimalSeparator)}]`, 'g');
  const textBeforePosition = text.slice(0, index);
  return textBeforePosition.replace(regExp, '').length;
};
// eslint-disable-next-line @typescript-eslint/naming-convention
const _reverseText = function (text) {
  return text.split('').reverse().join('');
};
// eslint-disable-next-line @typescript-eslint/naming-convention
const _getDigitPositionByIndex = function (digitIndex, text) {
  if (!digitIndex) {
    return -1;
  }
  const regExp = /[0-9]/g;
  let counter = 1;
  let index = null;
  let result = regExp.exec(text);
  while (result) {
    index = result.index;
    if (counter >= digitIndex) {
      return index;
    }
    counter++;
    result = regExp.exec(text);
  }
  return index === null ? text.length : index;
};
// eslint-disable-next-line @typescript-eslint/naming-convention
const _trimNonNumericCharsFromEnd = function (text) {
  return text.replace(/[^0-9e]+$/, '');
};
const getCaretWithOffset = function (caret, offset) {
  if (caret.start === undefined) {
    caret = {
      start: caret,
      end: caret
    };
  }
  return {
    start: caret.start + offset,
    end: caret.end + offset
  };
};
exports.getCaretWithOffset = getCaretWithOffset;
const getCaretAfterFormat = function (text, formatted, caret, format) {
  caret = getCaretWithOffset(caret, 0);
  const point = _number.default.getDecimalSeparator();
  const isSeparatorBasedText = isSeparatorBasedString(text);
  const realSeparatorOccurrenceIndex = (0, _m_utils.getRealSeparatorIndex)(format).occurrence;
  const pointPosition = isSeparatorBasedText ? 0 : (0, _m_utils.getNthOccurrence)(text, point, realSeparatorOccurrenceIndex);
  const newPointPosition = (0, _m_utils.getNthOccurrence)(formatted, point, realSeparatorOccurrenceIndex);
  const textParts = (0, _m_utils.splitByIndex)(text, pointPosition);
  const formattedParts = (0, _m_utils.splitByIndex)(formatted, newPointPosition);
  const isCaretOnFloat = pointPosition !== -1 && caret.start > pointPosition;
  if (isCaretOnFloat) {
    const relativeIndex = caret.start - pointPosition - 1;
    const digitsBefore = _getDigitCountBeforeIndex(relativeIndex, textParts[1]);
    const newPosition = formattedParts[1] ? newPointPosition + 1 + _getDigitPositionByIndex(digitsBefore, formattedParts[1]) + 1 : formatted.length;
    return getCaretInBoundaries(newPosition, formatted, format);
  }
  const formattedIntPart = _trimNonNumericCharsFromEnd(formattedParts[0]);
  const positionFromEnd = textParts[0].length - caret.start;
  const digitsFromEnd = _getDigitCountBeforeIndex(positionFromEnd, _reverseText(textParts[0]));
  const newPositionFromEnd = _getDigitPositionByIndex(digitsFromEnd, _reverseText(formattedIntPart));
  const newPositionFromBegin = formattedIntPart.length - (newPositionFromEnd + 1);
  return getCaretInBoundaries(newPositionFromBegin, formatted, format);
};
exports.getCaretAfterFormat = getCaretAfterFormat;
function isSeparatorBasedString(text) {
  return text.length === 1 && !!text.match(/^[,.][0-9]*$/g);
}
const isCaretInBoundaries = function (caret, text, format) {
  caret = getCaretWithOffset(caret, 0);
  const boundaries = getCaretInBoundaries(caret, text, format);
  return caret.start >= boundaries.start && caret.end <= boundaries.end;
};
exports.isCaretInBoundaries = isCaretInBoundaries;
function getCaretInBoundaries(caret, text, format) {
  caret = getCaretWithOffset(caret, 0);
  const boundaries = getCaretBoundaries(text, format);
  const adjustedCaret = {
    start: (0, _math.fitIntoRange)(caret.start, boundaries.start, boundaries.end),
    end: (0, _math.fitIntoRange)(caret.end, boundaries.start, boundaries.end)
  };
  return adjustedCaret;
}
const getCaretOffset = function (previousText, newText, format) {
  const previousBoundaries = getCaretBoundaries(previousText, format);
  const newBoundaries = getCaretBoundaries(newText, format);
  return newBoundaries.start - previousBoundaries.start;
};
exports.getCaretOffset = getCaretOffset;