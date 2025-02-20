import { fitIntoRange, multiplyInExponentialForm } from '../../core/utils/math';
import { toFixed } from '../utils';

const DEFAULT_CONFIG = { thousandsSeparator: ',', decimalSeparator: '.' };
const ESCAPING_CHAR = '\'';
const MAXIMUM_NUMBER_LENGTH = 15;
const PERCENT_EXPONENT_SHIFT = 2; // '1e2'

function getGroupSizes(formatString) {
    return formatString.split(',').slice(1).map(function(str) {
        let singleQuotesLeft = 0;
        return str.split('').filter(function(char, index) {
            singleQuotesLeft += char === '\'';

            const isDigit = char === '#' || char === '0';
            const isInStub = singleQuotesLeft % 2;
            return isDigit && !isInStub;
        }).length;
    });
}

function splitSignParts(format, separatorChar = ';', escapingChar = ESCAPING_CHAR) {
    const parts = [];
    let currentPart = '';
    let state = 'searchingSeparator';

    for(let i = 0; i < format.length; i++) {
        const char = format[i];
        if(state === 'searchingSeparator' && char === escapingChar) {
            state = 'skippingSeparationInsideEscaping';
        } else if(state === 'skippingSeparationInsideEscaping' && char === escapingChar) {
            state = 'searchingSeparator';
        } else if(state === 'searchingSeparator' && char === separatorChar) {
            state = 'separating';
            parts.push(currentPart);
            currentPart = '';
        }

        if(state !== 'separating') {
            currentPart += char;
        } else {
            state = 'searchingSeparator';
        }
    }

    parts.push(currentPart);
    return parts;
}

function getSignParts(format) {
    const signParts = splitSignParts(format);

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

function removeStubs(str) {
    return str.replace(/'[^']*'/g, '');
}

function getNonRequiredDigitCount(floatFormat) {
    if(!floatFormat) return 0;
    const format = removeStubs(floatFormat);
    return format.length - format.replace(/[#]/g, '').length;
}

function getRequiredDigitCount(floatFormat) {
    if(!floatFormat) return 0;
    const format = removeStubs(floatFormat);
    return format.length - format.replace(/[0]/g, '').length;
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

    const groups = [];
    let index = 0;

    while(valueString) {
        const groupSize = groupSizes[index];
        if(!groupSize) {
            break;
        }
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
        const isEscape = escapeIndex % 2;
        if(!formatPart && isEscape) {
            return ESCAPING_CHAR;
        }
        return isEscape ? formatPart : formatPart.replace(/[,#0]+/, valueString);
    }).join('');
}

function getFloatPointIndex(format) {
    let isEscape = false;

    for(let index = 0; index < format.length; index++) {
        if(format[index] === '\'') {
            isEscape = !isEscape;
        }
        if(format[index] === '.' && !isEscape) {
            return index;
        }
    }

    return format.length;
}

export function getFormatter(format, config) {
    config = config || DEFAULT_CONFIG;

    return function(value) {
        if(typeof value !== 'number' || isNaN(value)) return '';

        const signFormatParts = getSignParts(format);
        const isPositiveZero = 1 / value === Infinity;
        const isPositive = value > 0 || isPositiveZero;
        const numberFormat = signFormatParts[isPositive ? 0 : 1];

        const floatPointIndex = getFloatPointIndex(numberFormat);
        const floatFormatParts = [numberFormat.substr(0, floatPointIndex), numberFormat.substr(floatPointIndex + 1)];
        const minFloatPrecision = getRequiredDigitCount(floatFormatParts[1]);
        const maxFloatPrecision = minFloatPrecision + getNonRequiredDigitCount(floatFormatParts[1]);

        if(isPercentFormat(numberFormat)) {
            value = multiplyInExponentialForm(value, PERCENT_EXPONENT_SHIFT);
        }

        if(!isPositive) {
            value = -value;
        }

        const minIntegerPrecision = getRequiredDigitCount(floatFormatParts[0]);
        const maxIntegerPrecision = getNonRequiredDigitCount(floatFormatParts[0]) || config.unlimitedIntegerDigits ? undefined : minIntegerPrecision;
        const integerLength = Math.floor(value).toString().length;
        const floatPrecision = fitIntoRange(maxFloatPrecision, 0, MAXIMUM_NUMBER_LENGTH - integerLength);
        const groupSizes = getGroupSizes(floatFormatParts[0]).reverse();

        const valueParts = toFixed(value, floatPrecision < 0 ? 0 : floatPrecision).split('.');

        let valueIntegerPart = normalizeValueString(reverseString(valueParts[0]), minIntegerPrecision, maxIntegerPrecision);
        const valueFloatPart = normalizeValueString(valueParts[1], minFloatPrecision, maxFloatPrecision);

        valueIntegerPart = applyGroups(valueIntegerPart, groupSizes, config.thousandsSeparator);

        const integerString = reverseString(formatNumberPart(reverseString(floatFormatParts[0]), valueIntegerPart));
        const floatString = maxFloatPrecision ? formatNumberPart(floatFormatParts[1], valueFloatPart) : '';

        const result = integerString + (floatString.match(/\d/) ? config.decimalSeparator : '') + floatString;

        return result;
    };
}

function parseValue(text, isPercent, isNegative) {
    const value = (isPercent ? 0.01 : 1) * parseFloat(text) || 0;

    return isNegative ? -value : value;
}

function prepareValueText(valueText, formatter, isPercent, isIntegerPart) {
    let nextValueText = valueText;
    let char;
    let text;
    let nextText;

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
        const hasGroups = formatter(12345).indexOf('12345') === -1;
        do {
            valueText = '1' + valueText;
        } while(hasGroups && parseValue(valueText, isPercent) < 100000);
    }

    return valueText;
}

function getFormatByValueText(valueText, formatter, isPercent, isNegative) {
    let format = formatter(parseValue(valueText, isPercent, isNegative));
    const valueTextParts = valueText.split('.');
    const valueTextWithModifiedFloat = valueTextParts[0] + '.3' + valueTextParts[1].slice(1);
    const valueWithModifiedFloat = parseValue(valueTextWithModifiedFloat, isPercent, isNegative);
    const decimalSeparatorIndex = formatter(valueWithModifiedFloat).indexOf('3') - 1;

    format = format.replace(/(\d)\D(\d)/g, '$1,$2');

    if(decimalSeparatorIndex >= 0) {
        format = format.slice(0, decimalSeparatorIndex) + '.' + format.slice(decimalSeparatorIndex + 1);
    }

    format = format.replace(/1+/, '1').replace(/1/g, '#');

    if(!isPercent) {
        format = format.replace(/%/g, '\'%\'');
    }

    return format;
}

export function getFormat(formatter) {
    let valueText = '.';
    const isPercent = formatter(1).indexOf('100') >= 0;

    valueText = prepareValueText(valueText, formatter, isPercent, true);
    valueText = prepareValueText(valueText, formatter, isPercent, false);

    const positiveFormat = getFormatByValueText(valueText, formatter, isPercent, false);
    const negativeFormat = getFormatByValueText(valueText, formatter, isPercent, true);

    return negativeFormat === '-' + positiveFormat ? positiveFormat : positiveFormat + ';' + negativeFormat;
}
