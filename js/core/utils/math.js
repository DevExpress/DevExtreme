"use strict";

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

exports.sign = sign;
exports.fitIntoRange = fitIntoRange;
exports.inRange = inRange;
