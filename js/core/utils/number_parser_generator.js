"use strict";

var FLOAT_SEPARATOR = ".";
var GROUP_SEPARATOR = ",";
var CHARS_TO_ESCAPE_REGEXP = /([\\\/\.\*\+\?\|\(\)\[\]\{\}])/g;

function escapeFormat(formatString) {
    return formatString.replace(CHARS_TO_ESCAPE_REGEXP, "\\$1");
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

        result = result.replace(new RegExp("[#\\" + GROUP_SEPARATOR + "]+"), "([1-9]\\d{0," + (firstGroupSize - 1) + "},)(\\d{" + firstGroupSize + "},)*\\d{" + lastGroupSize + "}|([1-9]\\d{0," + (lastGroupSize - 1 - requiredDigitCount) + "})?");
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

function generateNumberParser(format) {
    return function(text) {
        if(typeof text !== "string" || !text || typeof format !== "string" || !format) {
            return null;
        }

        var signParts = format.split(";");
        if(signParts.length === 1) {
            signParts.push("-" + signParts[0]);
        }

        var regExpText = signParts.map(getRegExp).join("|");
        var parseResult = new RegExp("^(" + regExpText + ")$").exec(text);

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

        return value;
    };
}

exports.generateNumberParser = generateNumberParser;
