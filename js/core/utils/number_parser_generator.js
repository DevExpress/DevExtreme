"use strict";

var FLOAT_SEPARATOR = ".";

function escapeFormat(formatString) {
    var charsToEscape = /([\\\/\.\*\+\?\|\(\)\[\]\{\}])/g;

    return formatString.replace(charsToEscape, "\\$1");
}

function getIntegerPartRegExp(formatString) {
    var result = escapeFormat(formatString);
    result = result.replace(new RegExp("([0#]+)$"), "($1)");
    result = result.replace(/0/g, "\\d");
    result = result.replace("#", "\\d*");
    return result;
}

function getFloatPartRegExp(formatString) {
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
        floatRegExp = getFloatPartRegExp(floatParts[1] || "");

    return integerRegexp + floatRegExp;
}

function getSignParts(format) {
    var signParts = format.split(";");

    if(signParts.length === 1) {
        signParts.push("-" + signParts[0]);
    }

    return signParts;
}

function isTextAndFormatValid(format, text) {
    return format && text && typeof format === "string" && typeof text === "string";
}

function isPercentFormat(format) {
    return format.endsWith("%");
}

function generateNumberParser(format) {
    return function(text) {
        if(!isTextAndFormatValid(format, text)) {
            return null;
        }

        var signParts = getSignParts(format),
            regExpText = signParts.map(getRegExp).join("|"),
            parseResult = new RegExp("^(" + regExpText + ")$").exec(text);

        if(!parseResult) {
            return null;
        }

        var isNegative = parseResult[4],
            integerResultIndex = isNegative ? 4 : 2,
            floatResultIndex = integerResultIndex + 1;

        var value = parseInt(parseResult[integerResultIndex]) || 0;

        if(value > Number.MAX_SAFE_INTEGER) {
            return null;
        }

        if(parseResult[floatResultIndex]) {
            value += parseFloat(parseResult[floatResultIndex]) || 0;
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

exports.generateNumberParser = generateNumberParser;
