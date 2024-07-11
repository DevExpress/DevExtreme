"use strict";

require("./core");
var _globalize = _interopRequireDefault(require("globalize"));
var _number = _interopRequireDefault(require("../number"));
var _errors = _interopRequireDefault(require("../../core/errors"));
require("globalize/number");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line no-restricted-imports

// eslint-disable-next-line no-restricted-imports, import/no-unresolved

const MAX_FRACTION_DIGITS = 20;
if (_globalize.default && _globalize.default.formatNumber) {
  if (_globalize.default.locale().locale === 'en') {
    _globalize.default.locale('en');
  }
  const formattersCache = {};
  const getFormatter = format => {
    let formatter;
    let formatCacheKey;
    if (typeof format === 'object') {
      formatCacheKey = _globalize.default.locale().locale + ':' + JSON.stringify(format);
    } else {
      formatCacheKey = _globalize.default.locale().locale + ':' + format;
    }
    formatter = formattersCache[formatCacheKey];
    if (!formatter) {
      formatter = formattersCache[formatCacheKey] = _globalize.default.numberFormatter(format);
    }
    return formatter;
  };
  const globalizeNumberLocalization = {
    engine: function () {
      return 'globalize';
    },
    _formatNumberCore: function (value, format, formatConfig) {
      if (format === 'exponential') {
        return this.callBase.apply(this, arguments);
      }
      return getFormatter(this._normalizeFormatConfig(format, formatConfig, value))(value);
    },
    _normalizeFormatConfig: function (format, formatConfig, value) {
      let config;
      if (format === 'decimal') {
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
      if (format === 'percent') {
        config.style = 'percent';
      }
      return config;
    },
    _getPrecisionConfig: function (precision) {
      let config;
      if (precision === null) {
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
    format: function (value, format) {
      if (typeof value !== 'number') {
        return value;
      }
      format = this._normalizeFormat(format);
      if (!format || typeof format !== 'function' && !format.type && !format.formatter) {
        return getFormatter(format)(value);
      }
      return this.callBase.apply(this, arguments);
    },
    parse: function (text, format) {
      if (!text) {
        return;
      }
      if (format && (format.parser || typeof format === 'string')) {
        return this.callBase.apply(this, arguments);
      }
      if (format) {
        // Current parser functionality provided as-is and is independent of the most of capabilities of formatter.
        _errors.default.log('W0011');
      }
      let result = _globalize.default.parseNumber(text);
      if (isNaN(result)) {
        result = this.callBase.apply(this, arguments);
      }
      return result;
    }
  };
  _number.default.resetInjection();
  _number.default.inject(globalizeNumberLocalization);
}