"use strict";

var browser = require("./browser"),
    isExponential = require("./type").isExponential;

var sign = function(value) {
    if(value === 0) {
        return 0;
    }

    return value / Math.abs(value);
};

var fitIntoRange = function(value, minValue, maxValue) {
    var isMinValueUndefined = !minValue && minValue !== 0,
        isMaxValueUndefined = !maxValue && maxValue !== 0;

    isMinValueUndefined && (minValue = !isMaxValueUndefined ? Math.min(value, maxValue) : value);
    isMaxValueUndefined && (maxValue = !isMinValueUndefined ? Math.max(value, minValue) : value);

    return Math.min(Math.max(value, minValue), maxValue);
};

var inRange = function(value, minValue, maxValue) {
    return value >= minValue && value <= maxValue;
};

function getExponent(value) {
    return Math.abs(parseInt(value.toExponential().split("e")[1]));
}

function adjust(value, interval) {
    var precision = getPrecision(interval || 0) + 2,
        separatedValue = value.toString().split("."),
        sourceValue = value,
        absValue = Math.abs(value),
        separatedAdjustedValue,
        isEdge = browser.msie && browser.version >= 13,
        isExponentValue = isExponential(value),
        integerPart = absValue > 1 ? 10 : 0;

    if(separatedValue.length === 1) {
        return value;
    }

    if(!isExponentValue) {
        if(isExponential(interval)) {
            precision = separatedValue[0].length + getExponent(interval);
        }
        value = absValue;
        value = value - Math.floor(value) + integerPart;
    }

    precision = ((isEdge && (getExponent(value) > 6)) || precision > 7) ? 15 : 7; // fix toPrecision() bug in Edge (T570217)

    if(!isExponentValue) {
        separatedAdjustedValue = parseFloat(value.toPrecision(precision)).toString().split(".");
        if(separatedAdjustedValue[0] === integerPart.toString()) {
            return parseFloat(separatedValue[0] + "." + separatedAdjustedValue[1]);
        }
    }
    return parseFloat(sourceValue.toPrecision(precision));
}

function getPrecision(value) {
    var str = value.toString(),
        mantissa,
        positionOfDelimiter;

    if(str.indexOf(".") < 0) {
        return 0;
    }
    mantissa = str.split(".");
    positionOfDelimiter = mantissa[1].indexOf("e");

    return positionOfDelimiter >= 0 ? positionOfDelimiter : mantissa[1].length;
}

exports.sign = sign;
exports.fitIntoRange = fitIntoRange;
exports.inRange = inRange;
exports.adjust = adjust;
exports.getPrecision = getPrecision;
exports.getExponent = getExponent;

