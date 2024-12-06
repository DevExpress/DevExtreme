import openXmlCurrencyFormat from '../open_xml_currency_format';
import './core';
import './number';
import '../currency';
// eslint-disable-next-line no-restricted-imports, import/no-unresolved
import 'globalize/currency';
// eslint-disable-next-line no-restricted-imports
import Globalize from 'globalize';
import { config } from '../../../../common';
import numberLocalization from '../number';

const CURRENCY_STYLES = ['symbol', 'accounting'];

if(Globalize && Globalize.formatCurrency) {

    if(Globalize.locale().locale === 'en') {
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
            const normalizedConfig = this.callBase(format, formatConfig, value);

            if(format === 'currency') {
                const useAccountingStyle = formatConfig.useCurrencyAccountingStyle ?? config().defaultUseCurrencyAccountingStyle;
                normalizedConfig.style = CURRENCY_STYLES[+useAccountingStyle];
            }

            return normalizedConfig;
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
