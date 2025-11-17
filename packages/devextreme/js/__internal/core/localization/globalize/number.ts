import './core';
// eslint-disable-next-line no-restricted-imports
import Globalize from 'globalize';
import numberLocalization from '../number';
import errors from '../../../../core/errors';

// eslint-disable-next-line no-restricted-imports, import/no-unresolved
import 'globalize/number';
const MAX_FRACTION_DIGITS = 20;

if(Globalize && Globalize.formatNumber) {
    if(Globalize.locale().locale === 'en') {
        Globalize.locale('en');
    }

    const formattersCache = {};

    const getFormatter = format => {
        let formatter;
        let formatCacheKey;

        if(typeof format === 'object') {
            formatCacheKey = Globalize.locale().locale + ':' + JSON.stringify(format);
        } else {
            formatCacheKey = Globalize.locale().locale + ':' + format;
        }
        formatter = formattersCache[formatCacheKey];
        if(!formatter) {
            formatter = formattersCache[formatCacheKey] = Globalize.numberFormatter(format);
        }

        return formatter;
    };

    const globalizeNumberLocalization = {
        engine: function() {
            return 'globalize';
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
                    minimumIntegerDigits: formatConfig.precision || 1,
                    useGrouping: false,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: MAX_FRACTION_DIGITS,
                    round: value < 0 ? 'ceil' : 'floor'
                };
            } else {
                config = this._getPrecisionConfig(formatConfig.precision);
            }
            if(format === 'percent') {
                config.style = 'percent';
            }

            return config;
        },

        _getPrecisionConfig: function(precision) {
            let config;

            if(precision === null) {
                config = {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: MAX_FRACTION_DIGITS
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
            if(typeof value !== 'number') {
                return value;
            }

            format = this._normalizeFormat(format);

            if(!format || typeof (format) !== 'function' && !format.type && !format.formatter) {
                return getFormatter(format)(value);
            }

            return this.callBase.apply(this, arguments);
        },

        parse: function(text, format) {
            if(!text) {
                return;
            }

            if(format && (format.parser || typeof format === 'string')) {
                return this.callBase.apply(this, arguments);
            }

            if(format) {
                // Current parser functionality provided as-is and is independent of the most of capabilities of formatter.
                errors.log('W0011');
            }

            let result = Globalize.parseNumber(text);

            if(isNaN(result)) {
                result = this.callBase.apply(this, arguments);
            }

            return result;
        }
    };

    numberLocalization.resetInjection();
    numberLocalization.inject(globalizeNumberLocalization);
}
