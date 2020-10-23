/* globals Intl */
import dxConfig from '../../core/config';
import localizationCoreUtils from '../core';
import openXmlCurrencyFormat from '../open_xml_currency_format';
import accountingFormats from '../cldr-data/accounting_formats';

const detectCurrencySymbolRegex = /([^\s0]+)?(\s*)0*[.,]*0*(\s*)([^\s0]+)?/;
const formattersCache = {};
const getFormatter = format => {
    const key = localizationCoreUtils.locale() + '/' + JSON.stringify(format);
    if(!formattersCache[key]) {
        formattersCache[key] = (new Intl.NumberFormat(localizationCoreUtils.locale(), format)).format;
    }

    return formattersCache[key];
};
const getCurrencyFormatter = currency => {
    return (new Intl.NumberFormat(localizationCoreUtils.locale(), { style: 'currency', currency: currency }));
};

export default {
    engine: function() {
        return 'intl';
    },
    _formatNumberCore: function(value, format, formatConfig) {
        if(format === 'exponential') {
            return this.callBase.apply(this, arguments);
        }

        return getFormatter(this._normalizeFormatConfig(format, formatConfig, value))(value);
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
    _getCurrencySymbolInfo: function(currency) {
        const formatter = getCurrencyFormatter(currency);
        return this._extractCurrencySymbolInfo(formatter.format(0));
    },
    _extractCurrencySymbolInfo: function(currencyValueString) {
        const match = detectCurrencySymbolRegex.exec(currencyValueString) || [];
        const position = match[1] ? 'before' : 'after';
        const symbol = match[1] || match[4] || '';
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
        const targetCurrency = currency || dxConfig().defaultCurrency;
        const currencySymbol = this._getCurrencySymbolInfo(targetCurrency).symbol;
        const closestAccountingFormat = localizationCoreUtils.getValueByClosestLocale(locale => accountingFormats[locale]);

        return openXmlCurrencyFormat(currencySymbol, closestAccountingFormat);
    }
};
