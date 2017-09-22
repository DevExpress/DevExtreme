"use strict";

var FLOAT_SEPARATOR = ".";

var CHARS_TO_ESCAPE_REGEXP = /([\\\/\.\*\+\?\|\(\)\[\]\{\}])/g;

function escapeFormat(formatString) {
    return formatString.replace(CHARS_TO_ESCAPE_REGEXP, "\\$1");
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

        return value;
    };
}

exports.generateNumberParser = generateNumberParser;
