"use strict";

var numericTranslator = require("./numeric_translator"),
    vizUtils = require("../core/utils"),
    isDefined = require("../../core/utils/type").isDefined,
    raiseTo = vizUtils.raiseTo,
    getLog = vizUtils.getLog;

module.exports = {
    translate: function(bp) {
        var that = this,
            specialValue = that.translateSpecialCase(bp);

        if(isDefined(specialValue)) {
            return specialValue;
        }
        return numericTranslator.translate.call(that, getLog(bp, that._businessRange.base));
    },

    untranslate: function() {
        var result = numericTranslator.untranslate.apply(this, arguments);
        return result === null ? result : raiseTo(result, this._businessRange.base);
    },

    getInterval: numericTranslator.getInterval,

    _getValue: function(value) {
        return Math.pow(this._canvasOptions.base, value);
    },

    zoom: numericTranslator.zoom,

    getMinScale: numericTranslator.getMinScale,

    getScale: function(val1, val2) {
        var base = this._businessRange.base;
        val1 = isDefined(val1) ? getLog(val1, base) : undefined;
        val2 = isDefined(val2) ? getLog(val2, base) : undefined;

        return numericTranslator.getScale.call(this, val1, val2);
    },

    // dxRangeSelector

    isValid: function(value) {
        return numericTranslator.isValid.call(this, getLog(value, this._businessRange.base));
    },

    parse: numericTranslator.parse,

    to: function(value) {
        return numericTranslator.to.call(this, getLog(value, this._businessRange.base));
    },

    from: function(position) {
        return raiseTo(numericTranslator.from.call(this, position), this._businessRange.base);
    },

    _add: function(value, diff, dir) {
        var b = this._businessRange.base;
        // numeric _add is expected to be context free
        return raiseTo(numericTranslator._add(getLog(value, b), diff, dir), b);
    },

    isValueProlonged: numericTranslator.isValueProlonged
};
