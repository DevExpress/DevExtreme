"use strict";

var numericTranslator = require("./numeric_translator");

module.exports = {
    translate: numericTranslator.translate,

    untranslate: function() {
        var result = numericTranslator.untranslate.apply(this, arguments);
        return result === null ? result : new Date(result);
    },

    _getValue: numericTranslator._getValue,
    getInterval: numericTranslator.getInterval,
    zoom: numericTranslator.zoom,
    getMinScale: numericTranslator.getMinScale,
    getScale: numericTranslator.getScale,

    // dxRangeSelector

    isValid: function(value) {
        return numericTranslator.isValid.call(this, new Date(value));
    },

    parse: function(value) {
        return new Date(value);
    },

    to: numericTranslator.to,

    from: function(position) {
        return new Date(numericTranslator.from.call(this, position));
    },

    _add: require("../../core/utils/date").addDateInterval,

    isValueProlonged: numericTranslator.isValueProlonged
};
