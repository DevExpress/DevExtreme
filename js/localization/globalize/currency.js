require("./core");
require("./number");

require("../currency");
require("globalize/currency");

var enCurrencyUSD = {
    "main": {
        "en": {
            "identity": {
                "version": {
                    "_cldrVersion": "28",
                    "_number": "$Revision: 11972 $"
                },
                "language": "en"
            },
            "numbers": {
                "currencies": {
                    "USD": {
                        "displayName": "US Dollar",
                        "displayName-count-one": "US dollar",
                        "displayName-count-other": "US dollars",
                        "symbol": "$",
                        "symbol-alt-narrow": "$"
                    }
                }
            }
        }
    }
};

var currencyData = {
    "supplemental": {
        "version": {
            "_cldrVersion": "28",
            "_unicodeVersion": "8.0.0",
            "_number": "$Revision: 11969 $"
        },
        "currencyData": {
            "fractions": {
                "DEFAULT": {
                    "_rounding": "0",
                    "_digits": "2"
                }
            }
        }
    }
};

var Globalize = require("globalize"),
    config = require("../../core/config"),
    numberLocalization = require("../number");

if(Globalize && Globalize.formatCurrency) {

    if(Globalize.locale().locale === "en") {
        Globalize.load(
            enCurrencyUSD,
            currencyData
        );

        Globalize.locale("en");
    }

    var formattersCache = {};

    var getFormatter = function(currency, format) {
        var formatter,
            formatCacheKey;

        if(typeof format === "object") {
            formatCacheKey = Globalize.locale().locale + ":" + currency + ":" + JSON.stringify(format);
        } else {
            formatCacheKey = Globalize.locale().locale + ":" + currency + ":" + format;
        }
        formatter = formattersCache[formatCacheKey];
        if(!formatter) {
            formatter = formattersCache[formatCacheKey] = Globalize.currencyFormatter(currency, format);
        }

        return formatter;
    };

    var globalizeCurrencyLocalization = {
        _formatNumberCore: function(value, format, formatConfig) {
            if(format === "currency") {
                var currency = formatConfig && formatConfig.currency || config().defaultCurrency;
                return getFormatter(currency, this._normalizeFormatConfig(format, formatConfig, value))(value);
            }

            return this.callBase.apply(this, arguments);
        },
        _normalizeFormatConfig: function(format, formatConfig, value) {
            var config = this.callBase(format, formatConfig, value);

            if(format === "currency") {
                config.style = "accounting";
            }

            return config;
        },
        format: function(value, format) {
            if(typeof value !== "number") {
                return value;
            }

            format = this._normalizeFormat(format);

            if(format) {
                if(format.currency === "default") {
                    format.currency = config().defaultCurrency;
                }

                if(format.type === "currency") {
                    return this._formatNumber(value, this._parseNumberFormatString("currency"), format);
                } else if(!format.type && format.currency) {
                    return getFormatter(format.currency, format)(value);
                }
            }

            return this.callBase.apply(this, arguments);
        },
        getCurrencySymbol: function(currency) {
            if(!currency) {
                currency = config().defaultCurrency;
            }

            return Globalize.cldr.main("numbers/currencies/" + currency);
        },
        getOpenXmlCurrencyFormat: function(currency) {
            var currencySymbol = this.getCurrencySymbol(currency).symbol,
                currencyFormat = Globalize.cldr.main("numbers/currencyFormats-numberSystem-latn"),
                i,
                result,
                symbol,
                encodeSymbols;

            if(currencyFormat.accounting) {
                encodeSymbols = {
                    ".00": "{0}",
                    "'": "\\'",
                    "\\(": "\\(",
                    "\\)": "\\)",
                    " ": "\\ ",
                    "\"": "&quot;",
                    "\\¤": currencySymbol
                };

                result = currencyFormat.accounting.split(";");
                for(i = 0; i < result.length; i++) {
                    for(symbol in encodeSymbols) {
                        if(Object.prototype.hasOwnProperty.call(encodeSymbols, symbol)) {
                            result[i] = result[i].replace(new RegExp(symbol, "g"), encodeSymbols[symbol]);
                        }
                    }
                }

                return result.length === 2 ? result[0] + "_);" + result[1] : result[0];
            }
        }
    };

    numberLocalization.inject(globalizeCurrencyLocalization);
}
