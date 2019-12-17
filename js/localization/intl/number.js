/* globals Intl */
import dxConfig from '../../core/config';
import { locale } from '../core';
import dxVersion from '../../core/version';
import { compare as compareVersions } from '../../core/utils/version';
import openXmlCurrencyFormat from '../open_xml_currency_format';
import accountingFormats from '../cldr-data/accounting_formats';

const detectCurrencySymbolRegex = /([^\s0]+)?(\s*)0*[.,]*0*(\s*)([^\s0]+)?/;
const formattersCache = {};
const getFormatter = format => {
    const key = locale() + '/' + JSON.stringify(format);
    if(!formattersCache[key]) {
        formattersCache[key] = (new Intl.NumberFormat(locale(), format)).format;
    }

    return formattersCache[key];
};
const getCurrencyFormatter = currency => {
    return (new Intl.NumberFormat(locale(), { style: 'currency', currency: currency }));
};

module.exports = {
    engine: function() {
        return 'intl';
    },
    _formatNumberCore: function(value, format, formatConfig) {
        if(format === 'exponential') {
            return this.callBase.apply(this, arguments);
        }

        return getFormatter(this._normalizeFormatConfig(format, formatConfig))(value);
    },
    _normalizeFormatConfig: function(format, formatConfig, value) {
        let config;

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
        let config;

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

        if(format.currency === 'default') {
            format.currency = dxConfig().defaultCurrency;
        }

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
        const isExponentialRegexp = /^[-+]?[0-9]*.?[0-9]+([eE][-+]?[0-9]+)+$/;
        const legitDecimalSeparator = '.';

        if(this.convertDigits) {
            text = this.convertDigits(text, true);
        }

        if(isExponentialRegexp.test(text)) {
            return text;
        }

        const decimalSeparator = this._getDecimalSeparator(format);
        const cleanUpRegexp = new RegExp('[^0-9-\\' + decimalSeparator + ']', 'g');

        return text.replace(cleanUpRegexp, '').replace(decimalSeparator, legitDecimalSeparator);
    },
    _getDecimalSeparator: function(format) {
        return getFormatter(format)(0.1)[1];
    },
    _getCurrencySymbolInfo: function(currency) {
        const formatter = getCurrencyFormatter(currency);
        return this._extractCurrencySymbolInfo(formatter.format(0));
    },
    _extractCurrencySymbolInfo: function(currencyValueString) {
        const match = detectCurrencySymbolRegex.exec(currencyValueString) || []; const position = match[1] ? 'before' : 'after'; const symbol = match[1] || match[4] || '';
        const delimiter = match[2] || match[3] || '';

        return {
            position: position,
            symbol: symbol,
            delimiter: delimiter
        };
    },

    getCurrencySymbol: function(currency) {
        if(!currency) {
            currency = dxConfig().defaultCurrency;
        }

        const symbolInfo = this._getCurrencySymbolInfo(currency);
        return {
            'symbol': symbolInfo.symbol
        };
    },
    getOpenXmlCurrencyFormat: function(currency) {
        const currencyValue = currency || dxConfig().defaultCurrency;
        const currencySymbol = this._getCurrencySymbolInfo(currencyValue).symbol;

        return openXmlCurrencyFormat(currencySymbol, accountingFormats[locale()]);
    }
};
