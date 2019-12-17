var fitIntoRange = require('../../core/utils/math').fitIntoRange;
var toFixed = require('../utils').toFixed;

var DEFAULT_CONFIG = { thousandsSeparator: ',', decimalSeparator: '.' },
    ESCAPING_CHAR = '\'',
    MAXIMUM_NUMBER_LENGTH = 15;

function getGroupSizes(formatString) {
    return formatString.split(',').slice(1).map(function(str) {
        return str.split('').filter(function(char) {
            return char === '#' || char === '0';
        }).length;
    });
}

function getSignParts(format) {
    var signParts = format.split(';');

    if(signParts.length === 1) {
        signParts.push('-' + signParts[0]);
    }

    return signParts;
}

function reverseString(str) {
    return str.toString().split('').reverse().join('');
}

function isPercentFormat(format) {
    return format.indexOf('%') !== -1 && !format.match(/'[^']*%[^']*'/g);
}

function getNonRequiredDigitCount(floatFormat) {
    if(!floatFormat) return 0;
    return floatFormat.length - floatFormat.replace(/[#]/g, '').length;
}

function getRequiredDigitCount(floatFormat) {
    if(!floatFormat) return 0;
    return floatFormat.length - floatFormat.replace(/[0]/g, '').length;
}

function normalizeValueString(valuePart, minDigitCount, maxDigitCount) {
    if(!valuePart) return '';

    if(valuePart.length > maxDigitCount) {
        valuePart = valuePart.substr(0, maxDigitCount);
    }

    while(valuePart.length > minDigitCount && valuePart.slice(-1) === '0') {
        valuePart = valuePart.substr(0, valuePart.length - 1);
    }

    while(valuePart.length < minDigitCount) {
        valuePart += '0';
    }

    return valuePart;
}

function applyGroups(valueString, groupSizes, thousandsSeparator) {
    if(!groupSizes.length) return valueString;

    var groups = [],
        index = 0;

    while(valueString) {
        var groupSize = groupSizes[index];
        groups.push(valueString.slice(0, groupSize));
        valueString = valueString.slice(groupSize);
        if(index < groupSizes.length - 1) {
            index++;
        }
    }
    return groups.join(thousandsSeparator);
}

function formatNumberPart(format, valueString) {
    return format.split(ESCAPING_CHAR).map(function(formatPart, escapeIndex) {
        var isEscape = escapeIndex % 2;
        if(!formatPart && isEscape) {
            return ESCAPING_CHAR;
        }
        return isEscape ? formatPart : formatPart.replace(/[,#0]+/, valueString);
    }).join('');
}

function getFloatPointIndex(format) {
    var isEscape = false;

    for(var index = 0; index < format.length; index++) {
        if(format[index] === '\'') {
            isEscape = !isEscape;
        }
        if(format[index] === '.' && !isEscape) {
            return index;
        }
    }

    return format.length;
}

function getFormatter(format, config) {
    config = config || DEFAULT_CONFIG;

    return function(value) {
        if(typeof value !== 'number' || isNaN(value)) return '';

        var signFormatParts = getSignParts(format),
            isPositiveZero = 1 / value === Infinity,
            isPositive = value > 0 || isPositiveZero,
            numberFormat = signFormatParts[isPositive ? 0 : 1];

        if(isPercentFormat(numberFormat)) {
            value = value * 100;
        }

        if(!isPositive) {
            value = -value;
        }

        var floatPointIndex = getFloatPointIndex(numberFormat),
            floatFormatParts = [numberFormat.substr(0, floatPointIndex), numberFormat.substr(floatPointIndex + 1)],
            minFloatPrecision = getRequiredDigitCount(floatFormatParts[1]),
            maxFloatPrecision = minFloatPrecision + getNonRequiredDigitCount(floatFormatParts[1]),
            minIntegerPrecision = getRequiredDigitCount(floatFormatParts[0]),
            maxIntegerPrecision = getNonRequiredDigitCount(floatFormatParts[0]) ? undefined : minIntegerPrecision,
            integerLength = Math.floor(value).toString().length,
            floatPrecision = fitIntoRange(maxFloatPrecision, 0, MAXIMUM_NUMBER_LENGTH - integerLength),
            groupSizes = getGroupSizes(floatFormatParts[0]).reverse();

        var valueParts = toFixed(value, floatPrecision < 0 ? 0 : floatPrecision).split('.');

        var valueIntegerPart = normalizeValueString(reverseString(valueParts[0]), minIntegerPrecision, maxIntegerPrecision),
            valueFloatPart = normalizeValueString(valueParts[1], minFloatPrecision, maxFloatPrecision);

        valueIntegerPart = applyGroups(valueIntegerPart, groupSizes, config.thousandsSeparator);

        var integerString = reverseString(formatNumberPart(reverseString(floatFormatParts[0]), valueIntegerPart)),
            floatString = maxFloatPrecision ? formatNumberPart(floatFormatParts[1], valueFloatPart) : '';

        var result = integerString + (floatString.match(/\d/) ? config.decimalSeparator : '') + floatString;

        return result;
    };
}

function parseValue(text, isPercent, isNegative) {
    var value = (isPercent ? 0.01 : 1) * parseFloat(text) || 0;

    return isNegative ? -value : value;
}

function prepareValueText(valueText, formatter, isPercent, isIntegerPart) {
    var nextValueText = valueText,
        char,
        text,
        nextText;

    do {
        if(nextText) {
            char = text.length === nextText.length ? '0' : '1';
            valueText = isIntegerPart ? char + valueText : valueText + char;
        }
        text = nextText || formatter(parseValue(nextValueText, isPercent));
        nextValueText = isIntegerPart ? '1' + nextValueText : nextValueText + '1';
        nextText = formatter(parseValue(nextValueText, isPercent));
    } while(text !== nextText && (isIntegerPart ? text.length === nextText.length : text.length <= nextText.length));

    if(isIntegerPart && nextText.length > text.length) {
        var hasGroups = formatter(12345).indexOf('12345') === -1;
        do {
            valueText = '1' + valueText;
        } while(hasGroups && parseValue(valueText, isPercent) < 100000);
    }

    return valueText;
}

function getFormatByValueText(valueText, formatter, isPercent, isNegative) {
    var format = formatter(parseValue(valueText, isPercent, isNegative)),
        valueTextParts = valueText.split('.'),
        valueTextWithModifiedFloat = valueTextParts[0] + '.3' + valueTextParts[1].slice(1),
        valueWithModifiedFloat = parseValue(valueTextWithModifiedFloat, isPercent, isNegative),
        decimalSeparatorIndex = formatter(valueWithModifiedFloat).indexOf('3') - 1;

    format = format.replace(/(\d)\D(\d)/g, '$1,$2');

    if(decimalSeparatorIndex >= 0) {
        format = format.slice(0, decimalSeparatorIndex) + '.' + format.slice(decimalSeparatorIndex + 1);
    }

    format = format.replace(/1+/, '1').replace(/1/g, '#');

    if(!isPercent) {
        format = format.replace('%', '\'%\'');
    }

    return format;
}

function getFormat(formatter) {
    var valueText = '.',
        isPercent = formatter(1).indexOf('100') >= 0;

    valueText = prepareValueText(valueText, formatter, isPercent, true);
    valueText = prepareValueText(valueText, formatter, isPercent, false);

    var positiveFormat = getFormatByValueText(valueText, formatter, isPercent, false);
    var negativeFormat = getFormatByValueText(valueText, formatter, isPercent, true);

    return negativeFormat === '-' + positiveFormat ? positiveFormat : positiveFormat + ';' + negativeFormat;
}

exports.getFormatter = getFormatter;
exports.getFormat = getFormat;
