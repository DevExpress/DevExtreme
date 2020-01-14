const fitIntoRange = require('../../core/utils/math').fitIntoRange;
const escapeRegExp = require('../../core/utils/common').escapeRegExp;
const number = require('../../localization/number');

const getCaretBoundaries = function(text, format) {
    const signParts = format.split(';');
    const sign = number.getSign(text, format);

    signParts[1] = signParts[1] || '-' + signParts[0];
    format = signParts[sign < 0 ? 1 : 0];

    const mockEscapedStubs = (str) => str.replace(/'([^']*)'/g, str => str.split('').map(() => ' ').join('').substr(2));

    format = mockEscapedStubs(format);

    const prefixStubLength = /^[^#0.,]*/.exec(format)[0].length;
    const postfixStubLength = /[^#0.,]*$/.exec(format)[0].length;

    return {
        start: prefixStubLength,
        end: text.length - postfixStubLength
    };
};

const _getDigitCountBeforeIndex = function(index, text) {
    const decimalSeparator = number.getDecimalSeparator();
    const regExp = new RegExp('[^0-9' + escapeRegExp(decimalSeparator) + ']', 'g');
    const textBeforePosition = text.slice(0, index);

    return textBeforePosition.replace(regExp, '').length;
};

const _reverseText = function(text) {
    return text.split('').reverse().join('');
};

const _getDigitPositionByIndex = function(digitIndex, text) {
    if(!digitIndex) {
        return -1;
    }

    const regExp = /[0-9]/g;
    let counter = 1;
    let index = null;
    let result = regExp.exec(text);

    while(result) {
        index = result.index;
        if(!digitIndex || counter >= digitIndex) {
            return index;
        }
        counter++;
        result = regExp.exec(text);
    }

    return index === null ? text.length : index;
};

const getCaretWithOffset = function(caret, offset) {
    if(caret.start === undefined) {
        caret = { start: caret, end: caret };
    }

    return {
        start: caret.start + offset,
        end: caret.end + offset
    };
};

const getCaretAfterFormat = function(text, formatted, caret, format) {
    caret = getCaretWithOffset(caret, 0);

    const point = number.getDecimalSeparator();
    const isSeparatorBasedText = isSeparatorBasedString(text);
    const pointPosition = isSeparatorBasedText ? 0 : text.indexOf(point);
    const newPointPosition = formatted.indexOf(point);
    const textParts = isSeparatorBasedText ? text.split(text[pointPosition]) : text.split(point);
    const formattedParts = formatted.split(point);
    const isCaretOnFloat = pointPosition !== -1 && caret.start > pointPosition;

    if(isCaretOnFloat) {
        const relativeIndex = caret.start - pointPosition - 1;
        const digitsBefore = _getDigitCountBeforeIndex(relativeIndex, textParts[1]);
        const newPosition = formattedParts[1] ? newPointPosition + 1 + _getDigitPositionByIndex(digitsBefore, formattedParts[1]) + 1 : formatted.length;

        return getCaretInBoundaries(newPosition, formatted, format);
    } else {
        const positionFromEnd = textParts[0].length - caret.start;
        const digitsFromEnd = _getDigitCountBeforeIndex(positionFromEnd, _reverseText(textParts[0]));
        const newPositionFromEnd = _getDigitPositionByIndex(digitsFromEnd, _reverseText(formattedParts[0]));
        const newPositionFromBegin = formattedParts[0].length - (newPositionFromEnd + 1);

        return getCaretInBoundaries(newPositionFromBegin, formatted, format);
    }
};

var isSeparatorBasedString = function(text) {
    return text.length === 1 && !!text.match(/^[,.][0-9]*$/g);
};

const isCaretInBoundaries = function(caret, text, format) {
    caret = getCaretWithOffset(caret, 0);

    const boundaries = getCaretInBoundaries(caret, text, format);
    return caret.start >= boundaries.start && caret.end <= boundaries.end;
};

var getCaretInBoundaries = function(caret, text, format) {
    caret = getCaretWithOffset(caret, 0);

    const boundaries = getCaretBoundaries(text, format);
    const adjustedCaret = {
        start: fitIntoRange(caret.start, boundaries.start, boundaries.end),
        end: fitIntoRange(caret.end, boundaries.start, boundaries.end)
    };

    return adjustedCaret;
};

const getCaretOffset = function(previousText, newText, format) {
    const previousBoundaries = getCaretBoundaries(previousText, format);
    const newBoundaries = getCaretBoundaries(newText, format);

    return newBoundaries.start - previousBoundaries.start;
};

exports.getCaretBoundaries = getCaretBoundaries;
exports.isCaretInBoundaries = isCaretInBoundaries;
exports.getCaretWithOffset = getCaretWithOffset;
exports.getCaretInBoundaries = getCaretInBoundaries;
exports.getCaretAfterFormat = getCaretAfterFormat;
exports.getCaretOffset = getCaretOffset;
