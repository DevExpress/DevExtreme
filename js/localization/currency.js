"use strict";

var $ = require("jquery"),
    numberLocalization = require("./number");

numberLocalization.inject({
    _formatNumberCore: function(value, format, formatConfig) {
        if(format === "currency") {
            formatConfig.precision = formatConfig.precision || 0;
            return this.getCurrencySymbol().symbol + this.format(value, $.extend({}, formatConfig, { type: "fixedpoint" }));
        }

        return this.callBase.apply(this, arguments);
    },
    getCurrencySymbol: function() {
        return { symbol: "$" };
    },
    getOpenXmlCurrencyFormat: function() {
        return "$#,##0{0}_);\\($#,##0{0}\\)";
    }
});
