var fitIntoRange = require("../../core/utils/math").fitIntoRange,
    escapeRegExp = require("../../core/utils/common").escapeRegExp,
    number = require("../../localization/number");

var getCaretBoundaries = function(text, format) {
    var signParts = format.split(";"),
        sign = number.getSign(text, format);

    signParts[1] = signParts[1] || "-" + signParts[0];
    format = sign < 0 ? signParts[1] : signParts[0];

    var clearedFormat = format.replace(/'([^']*)'/g, "$1"),
        result = /^([^#0\.,]*)([#0\.,]*)([^#0\.,]*)$/.exec(clearedFormat);

    var startBorder = result[1].length,
        endBorder = text.length - result[3].length;

    return { start: startBorder, end: endBorder };
};

var _getDigitCountBeforeIndex = function(index, text) {
    var decimalSeparator = number.getDecimalSeparator(),
        regExp = new RegExp("[^0-9" + escapeRegExp(decimalSeparator) + "]", "g"),
        textBeforePosition = text.slice(0, index);

    return textBeforePosition.replace(regExp, '').length;
};

var _reverseText = function(text) {
    return text.split("").reverse().join("");
};

var _getDigitPositionByIndex = function(digitIndex, text) {
    if(!digitIndex) {
        return -1;
    }

    var regExp = /[0-9]/g,
        counter = 1,
        index = null,
        result = regExp.exec(text);

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

var getCaretWithOffset = function(caret, offset) {
    if(caret.start === undefined) {
        caret = { start: caret, end: caret };
    }

    return {
        start: caret.start + offset,
        end: caret.end + offset
    };
};

var getCaretAfterFormat = function(text, formatted, caret, format) {
    caret = getCaretWithOffset(caret, 0);

    var point = number.getDecimalSeparator(),
        pointPosition = text.indexOf(point),
        newPointPosition = formatted.indexOf(point),
        textParts = text.split(point),
        formattedParts = formatted.split(point),
        isCaretOnFloat = pointPosition !== -1 && caret.start > pointPosition;

    if(isCaretOnFloat) {
        var relativeIndex = caret.start - pointPosition - 1,
            digitsBefore = _getDigitCountBeforeIndex(relativeIndex, textParts[1]),
            newPosition = formattedParts[1] ? newPointPosition + 1 + _getDigitPositionByIndex(digitsBefore, formattedParts[1]) + 1 : formatted.length;

        return getCaretInBoundaries(newPosition, formatted, format);
    } else {
        var positionFromEnd = textParts[0].length - caret.start,
            digitsFromEnd = _getDigitCountBeforeIndex(positionFromEnd, _reverseText(textParts[0])),
            newPositionFromEnd = _getDigitPositionByIndex(digitsFromEnd, _reverseText(formattedParts[0])),
            newPositionFromBegin = formattedParts[0].length - (newPositionFromEnd + 1);

        return getCaretInBoundaries(newPositionFromBegin, formatted, format);
    }
};

var isCaretInBoundaries = function(caret, text, format) {
    caret = getCaretWithOffset(caret, 0);

    var boundaries = getCaretInBoundaries(caret, text, format);
    return caret.start >= boundaries.start && caret.end <= boundaries.end;
};

var getCaretInBoundaries = function(caret, text, format) {
    caret = getCaretWithOffset(caret, 0);

    var boundaries = getCaretBoundaries(text, format),
        adjustedCaret = {
            start: fitIntoRange(caret.start, boundaries.start, boundaries.end),
            end: fitIntoRange(caret.end, boundaries.start, boundaries.end)
        };

    return adjustedCaret;
};

var getCaretOffset = function(previousText, newText, format) {
    var previousBoundaries = getCaretBoundaries(previousText, format),
        newBoundaries = getCaretBoundaries(newText, format);

    return newBoundaries.start - previousBoundaries.start;
};

exports.getCaretBoundaries = getCaretBoundaries;
exports.isCaretInBoundaries = isCaretInBoundaries;
exports.getCaretWithOffset = getCaretWithOffset;
exports.getCaretInBoundaries = getCaretInBoundaries;
exports.getCaretAfterFormat = getCaretAfterFormat;
exports.getCaretOffset = getCaretOffset;
