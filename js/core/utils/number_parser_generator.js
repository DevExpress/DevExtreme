"use strict";

var FLOAT_SEPARATOR = ".";
var GROUP_SEPARATOR = ",";
var ESCAPING_CHAR = "'";

function escapeFormat(formatString) {
    return formatString.replace(/[.*+?^${}()|\[\]\\]/g, "\\$&");
}

function getGroupSizes(formatString) {
    return formatString.split(GROUP_SEPARATOR).slice(1).map(function(str) {
        return str.length;
    });
}

function getIntegerPartRegExp(formatString) {
    var result = escapeFormat(formatString);
    result = result.replace(new RegExp("([0#\\" + GROUP_SEPARATOR + "]+)$"), "($1)");

    var groupSizes = getGroupSizes(formatString),
        requiredDigitCount = formatString.split("0").length - 1;

    result = result.replace(/0/g, "\\d");

    if(formatString.indexOf("#" + GROUP_SEPARATOR) >= 0 && groupSizes.length) {
        var firstGroupSize = groupSizes[0],
            lastGroupSize = groupSizes[groupSizes.length - 1];

        result = result.replace(new RegExp("[#\\" + GROUP_SEPARATOR + "]+"),
            "([1-9]\\d{0," + (firstGroupSize - 1) + "},)(\\d{" + firstGroupSize + "},)*\\d{" +
            lastGroupSize + "}|([1-9]\\d{0," + (lastGroupSize - 1 - requiredDigitCount) + "})?");
    } else {
        result = result.replace(/#+/g, "([1-9]\\d*)?" + (requiredDigitCount ? "" : "|[0]"));
    }
    return result;
}

function getFloatPartRegExp(formatString) {
    if(!formatString) return "()";

    var result = escapeFormat(FLOAT_SEPARATOR + formatString);
    result = result.replace(new RegExp("^(\\\\" + FLOAT_SEPARATOR + "0[0#]*)"), "($1)");
    result = result.replace(new RegExp("^(\\\\" + FLOAT_SEPARATOR + "[0#]*)"), "($1)?");
    result = result.replace(/0/g, "\\d");
    result = result.replace(/#/g, "\\d?");
    return result;
}

function getRegExp(formatString) {
    var floatParts = formatString.split(FLOAT_SEPARATOR),
        integerRegexp = getIntegerPartRegExp(floatParts[0]),
        floatRegExp = getFloatPartRegExp(floatParts[1]);

    return integerRegexp + floatRegExp;
}

function getSignParts(format) {
    var signParts = format.split(";");

    if(signParts.length === 1) {
        signParts.push("-" + signParts[0]);
    }

    return signParts;
}

function checkParserArguments(format, text) {
    return format && text && typeof format === "string" && typeof text === "string";
}

function isPercentFormat(format) {
    return format.slice(-1) === "%";
}

function generateNumberParser(format) {
    return function(text) {
        if(!checkParserArguments(format, text)) {
            return null;
        }

        var signParts = getSignParts(format),
            regExpText = signParts.map(getRegExp).join("|"),
            parseResult = new RegExp("^(" + regExpText + ")$").exec(text);

        if(!parseResult) {
            return null;
        }

        var signPartResultCount = parseResult.length / 2 - 1,
            isNegative = parseResult[signPartResultCount + 2],
            integerResultIndex = isNegative ? signPartResultCount + 2 : 2,
            floatResultIndex = integerResultIndex + signPartResultCount - 1,
            integerPart = parseResult[integerResultIndex].replace(new RegExp(GROUP_SEPARATOR, "g"), ""),
            floatPart = parseResult[floatResultIndex];

        var value = parseInt(integerPart) || 0;

        if(value > Number.MAX_SAFE_INTEGER) {
            return null;
        }

        if(floatPart) {
            value += parseFloat(floatPart) || 0;
        }

        if(isNegative) {
            value = -value;
        }

        if(isPercentFormat(format)) {
            value = value / 100;
        }

        return value;
    };
}

function reverseString(str) {
    return str.toString().split("").reverse().join("");
}

function isPercentFormat(format) {
    return format.indexOf("%") !== -1 && !format.match(/'[^']*%[^']*'/g);
}

function getNonRequiredDigitCount(floatFormat) {
    if(!floatFormat) return 0;
    return floatFormat.length - floatFormat.replace(/[#]/g, "").length;
}

function getRequiredDigitCount(floatFormat) {
    if(!floatFormat) return 0;
    return floatFormat.length - floatFormat.replace(/[0]/g, "").length;
}

function normalizeValueString(valuePart, minDigitCount, maxDigitCount) {
    if(!valuePart) return "";

    if(valuePart.length > maxDigitCount) {
        valuePart = valuePart.substr(0, maxDigitCount);
    }

    while(valuePart.length < minDigitCount) {
        valuePart += "0";
    }
    return valuePart;
}

function applyGroups(valueString, groupSizes) {
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
    return groups.join(GROUP_SEPARATOR);
}

function formatNumberPart(format, valueString, minDigitCount, maxDigitCount) {
    return format.split(ESCAPING_CHAR).map(function(formatPart, escapeIndex) {
        var isEscape = escapeIndex % 2;
        if(!formatPart && isEscape) {
            return ESCAPING_CHAR;
        }
        return isEscape ? formatPart : formatPart.replace(/[,#0]+/, valueString);
    }).join("");
}

function generateNumberFormatter(format) {
    return function(value) {
        if(typeof value !== "number" || isNaN(value)) return "";

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

        var floatFormatParts = numberFormat.split(FLOAT_SEPARATOR),
            minFloatPrecision = getRequiredDigitCount(floatFormatParts[1]),
            maxFloatPrecision = minFloatPrecision + getNonRequiredDigitCount(floatFormatParts[1]),
            minIntegerPrecision = getRequiredDigitCount(floatFormatParts[0]),
            maxIntegerPrecision = getNonRequiredDigitCount(floatFormatParts[0]) ? undefined : minIntegerPrecision,
            groupSizes = getGroupSizes(floatFormatParts[0]).reverse();

        var valueParts = value.toFixed(maxFloatPrecision).split(".");

        var valueIntegerPart = normalizeValueString(valueParts[0], minIntegerPrecision, maxIntegerPrecision),
            valueFloatPart = normalizeValueString(valueParts[1], minFloatPrecision, maxFloatPrecision),
            integerString = reverseString(formatNumberPart(reverseString(floatFormatParts[0]), applyGroups(reverseString(valueIntegerPart), groupSizes))),
            floatString = maxFloatPrecision ? formatNumberPart(floatFormatParts[1], valueFloatPart) : "";

        if(!integerString.match(/\d/)) integerString += "0";

        var result = integerString + (floatString.match(/\d/) ? FLOAT_SEPARATOR : "") + floatString;

        return result;
    };
}

exports.generateNumberParser = generateNumberParser;
exports.generateNumberFormatter = generateNumberFormatter;
