import openXmlCurrencyFormat from '../open_xml_currency_format';
import './core';
import './number';
import '../currency';
import 'globalize/currency';

const enCurrencyUSD = {
    'main': {
        'en': {
            'identity': {
                'version': {
                    '_cldrVersion': '28',
                    '_number': '$Revision: 11972 $'
                },
                'language': 'en'
            },
            'numbers': {
                'currencies': {
                    'USD': {
                        'displayName': 'US Dollar',
                        'displayName-count-one': 'US dollar',
                        'displayName-count-other': 'US dollars',
                        'symbol': '$',
                        'symbol-alt-narrow': '$'
                    }
                }
            }
        }
    }
};

const currencyData = {
    'supplemental': {
        'version': {
            '_cldrVersion': '28',
            '_unicodeVersion': '8.0.0',
            '_number': '$Revision: 11969 $'
        },
        'currencyData': {
            'fractions': {
                'DEFAULT': {
                    '_rounding': '0',
                    '_digits': '2'
                }
            }
        }
    }
};

import Globalize from 'globalize';
import config from '../../core/config';
import numberLocalization from '../number';

if(Globalize && Globalize.formatCurrency) {

    if(Globalize.locale().locale === 'en') {
        Globalize.load(
            enCurrencyUSD,
            currencyData
        );

        Globalize.locale('en');
    }

    const formattersCache = {};

    const getFormatter = (currency, format) => {
        let formatter;
        let formatCacheKey;

        if(typeof format === 'object') {
            formatCacheKey = Globalize.locale().locale + ':' + currency + ':' + JSON.stringify(format);
        } else {
            formatCacheKey = Globalize.locale().locale + ':' + currency + ':' + format;
        }
        formatter = formattersCache[formatCacheKey];
        if(!formatter) {
            formatter = formattersCache[formatCacheKey] = Globalize.currencyFormatter(currency, format);
        }

        return formatter;
    };

    const globalizeCurrencyLocalization = {
        _formatNumberCore: function(value, format, formatConfig) {
            if(format === 'currency') {
                const currency = formatConfig && formatConfig.currency || config().defaultCurrency;
                return getFormatter(currency, this._normalizeFormatConfig(format, formatConfig, value))(value);
            }

            return this.callBase.apply(this, arguments);
        },
        _normalizeFormatConfig: function(format, formatConfig, value) {
            const config = this.callBase(format, formatConfig, value);

            if(format === 'currency') {
                config.style = 'accounting';
            }

            return config;
        },
        format: function(value, format) {
            if(typeof value !== 'number') {
                return value;
            }

            format = this._normalizeFormat(format);

            if(format) {
                if(format.currency === 'default') {
                    format.currency = config().defaultCurrency;
                }

                if(format.type === 'currency') {
                    return this._formatNumber(value, this._parseNumberFormatString('currency'), format);
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

            return Globalize.cldr.main('numbers/currencies/' + currency);
        },
        getOpenXmlCurrencyFormat: function(currency) {
            const currencySymbol = this.getCurrencySymbol(currency).symbol;
            const accountingFormat = Globalize.cldr.main('numbers/currencyFormats-numberSystem-latn').accounting;

            return openXmlCurrencyFormat(currencySymbol, accountingFormat);
        }
    };

    numberLocalization.inject(globalizeCurrencyLocalization);
}
