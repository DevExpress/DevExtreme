var numericTranslator = require("./numeric_translator");

module.exports = {
    translate: numericTranslator.translate,

    untranslate: numericTranslator.untranslate,

    _getValue: numericTranslator._getValue,
    getInterval: numericTranslator.getInterval,
    zoom: numericTranslator.zoom,
    getMinScale: numericTranslator.getMinScale,
    getScale: numericTranslator.getScale,

    // dxRangeSelector

    isValid: function(value) {
        return numericTranslator.isValid.call(this, new Date(value));
    },

    getCorrectValue: numericTranslator.getCorrectValue,

    _parse: function(value) {
        return new Date(value);
    },

    to: numericTranslator.to,

    from: function(position, direction) {
        var result = numericTranslator.from.call(this, position, direction);
        return result === null ? result : new Date(result);
    },

    _add: require("../../core/utils/date").addDateInterval,

    isValueProlonged: numericTranslator.isValueProlonged
};
