/* globals Intl */
var dxConfig = require('../../core/config');
var locale = require('../core').locale;
var dxVersion = require('../../core/version');
var compareVersions = require('../../core/utils/version').compare;
var openXmlCurrencyFormat = require("../open_xml_currency_format");
var accountingFormats = require("../cldr-data/accounting_formats");

var detectCurrencySymbolRegex = /([^\s0]+)?(\s*)0*[.,]*0*(\s*)([^\s0]+)?/,
    formattersCache = {},
    getFormatter = function(format) {
        var key = locale() + '/' + JSON.stringify(format);
        if(!formattersCache[key]) {
            formattersCache[key] = (new Intl.NumberFormat(locale(), format)).format;
        }

        return formattersCache[key];
    },
    getCurrencyFormatter = function(currency) {
        return (new Intl.NumberFormat(locale(), { style: 'currency', currency: currency }));
    };

module.exports = {
    _formatNumberCore: function(value, format, formatConfig) {
        if(format === 'exponential') {
            return this.callBase.apply(this, arguments);
        }

        return getFormatter(this._normalizeFormatConfig(format, formatConfig))(value);
    },
    _normalizeFormatConfig: function(format, formatConfig, value) {
        var config;

        if(format === 'decimal') {
            config = {
                minimumIntegerDigits: formatConfig.precision || undefined,
                useGrouping: false,
                maximumFractionDigits: String(value).length,
                round: value < 0 ? 'ceil' : 'floor'
            };
        } else {
            config = this._getPrecisionConfig(formatConfig.precision);
        }

        if(format === 'percent') {
            config.style = 'percent';
        } else if(format === 'currency') {
            config.style = 'currency';
            config.currency = formatConfig.currency || dxConfig().defaultCurrency;
        }

        return config;
    },
    _getPrecisionConfig: function(precision) {
        var config;

        if(precision === null) {
            config = {
                minimumFractionDigits: 0,
                maximumFractionDigits: 20
            };
        } else {
            config = {
                minimumFractionDigits: precision || 0,
                maximumFractionDigits: precision || 0
            };
        }

        return config;
    },
    format: function(value, format) {
        if('number' !== typeof value) {
            return value;
        }

        format = this._normalizeFormat(format);

        if(!format || 'function' !== typeof format && !format.type && !format.formatter) {
            return getFormatter(format)(value);
        }

        return this.callBase.apply(this, arguments);
    },
    parse: function(text, format) {
        if(compareVersions(dxVersion, '17.2.8') >= 0) {
            return this.callBase.apply(this, arguments);
        }
        if(!text) {
            return;
        }

        if(format && format.parser) {
            return format.parser(text);
        }

        text = this._normalizeNumber(text, format);

        if(text.length > 15) {
            return NaN;
        }

        return parseFloat(text);
    },
    _normalizeNumber: function(text, format) {
        var isExponentialRegexp = /^[-+]?[0-9]*.?[0-9]+([eE][-+]?[0-9]+)+$/,
            legitDecimalSeparator = '.';

        if(this.convertDigits) {
            text = this.convertDigits(text, true);
        }

        if(isExponentialRegexp.test(text)) {
            return text;
        }

        var decimalSeparator = this._getDecimalSeparator(format);
        var cleanUpRegexp = new RegExp('[^0-9-\\' + decimalSeparator + ']', 'g');

        return text.replace(cleanUpRegexp, '').replace(decimalSeparator, legitDecimalSeparator);
    },
    _getDecimalSeparator: function(format) {
        return getFormatter(format)(0.1)[1];
    },
    _getCurrencySymbolInfo: function(currency) {
        var formatter = getCurrencyFormatter(currency);
        return this._extractCurrencySymbolInfo(formatter.format(0));
    },
    _extractCurrencySymbolInfo: function(currencyValueString) {
        var match = detectCurrencySymbolRegex.exec(currencyValueString) || [],
            position = match[1] ? 'before' : 'after',
            symbol = match[1] || match[4] || '',
            delimiter = match[2] || match[3] || '';

        return {
            position: position,
            symbol: symbol,
            delimiter: delimiter
        };
    },

    getCurrencySymbol: function(currency) {
        let symbolInfo = this._getCurrencySymbolInfo(currency);
        return {
            "symbol": symbolInfo.symbol
        };
    },
    getOpenXmlCurrencyFormat: function(currency) {
        var currencyValue = currency || dxConfig().defaultCurrency,
            currencySymbol = this._getCurrencySymbolInfo(currencyValue).symbol;

        return openXmlCurrencyFormat(currencySymbol, accountingFormats[locale()]);
    }
};
