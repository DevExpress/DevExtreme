"use strict";

require("./core");
require("./number");
require("globalize/date");
var _globalize = _interopRequireDefault(require("globalize"));
var _date2 = _interopRequireDefault(require("../date"));
var _type = require("../../core/utils/type");
var iteratorUtils = _interopRequireWildcard(require("../../core/utils/iterator"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line no-restricted-imports, import/no-unresolved

const ACCEPTABLE_JSON_FORMAT_PROPERTIES = ['skeleton', 'date', 'time', 'datetime', 'raw'];
const RTL_MARKS_REGEX = /[\u200E\u200F]/g;

// eslint-disable-next-line no-restricted-imports

if (_globalize.default && _globalize.default.formatDate) {
  if (_globalize.default.locale().locale === 'en') {
    _globalize.default.locale('en');
  }
  const formattersCache = {};
  const FORMATS_TO_GLOBALIZE_MAP = {
    'shortdate': {
      path: 'dateTimeFormats/availableFormats/yMd'
    },
    'shorttime': {
      path: 'timeFormats/short'
    },
    'longdate': {
      path: 'dateFormats/full'
    },
    'longtime': {
      path: 'timeFormats/medium'
    },
    'monthandday': {
      path: 'dateTimeFormats/availableFormats/MMMMd'
    },
    'monthandyear': {
      path: 'dateTimeFormats/availableFormats/yMMMM'
    },
    'quarterandyear': {
      path: 'dateTimeFormats/availableFormats/yQQQ'
    },
    'day': {
      path: 'dateTimeFormats/availableFormats/d'
    },
    'year': {
      path: 'dateTimeFormats/availableFormats/y'
    },
    'shortdateshorttime': {
      path: 'dateTimeFormats/short',
      parts: ['shorttime', 'shortdate']
    },
    'longdatelongtime': {
      path: 'dateTimeFormats/medium',
      parts: ['longtime', 'longdate']
    },
    'month': {
      pattern: 'LLLL'
    },
    'shortyear': {
      pattern: 'yy'
    },
    'dayofweek': {
      pattern: 'EEEE'
    },
    'quarter': {
      pattern: 'QQQ'
    },
    'millisecond': {
      pattern: 'SSS'
    },
    'hour': {
      pattern: 'HH'
    },
    'minute': {
      pattern: 'mm'
    },
    'second': {
      pattern: 'ss'
    }
  };
  const globalizeDateLocalization = {
    engine: function () {
      return 'globalize';
    },
    _getPatternByFormat: function (format) {
      const that = this;
      const lowerFormat = format.toLowerCase();
      const globalizeFormat = FORMATS_TO_GLOBALIZE_MAP[lowerFormat];
      if (lowerFormat === 'datetime-local') {
        return 'yyyy-MM-ddTHH\':\'mm\':\'ss';
      }
      if (!globalizeFormat) {
        return;
      }
      let result = globalizeFormat.path && that._getFormatStringByPath(globalizeFormat.path) || globalizeFormat.pattern;
      if (globalizeFormat.parts) {
        iteratorUtils.each(globalizeFormat.parts, (index, part) => {
          result = result.replace('{' + index + '}', that._getPatternByFormat(part));
        });
      }
      return result;
    },
    _getFormatStringByPath: function (path) {
      return _globalize.default.locale().main('dates/calendars/gregorian/' + path);
    },
    getPeriodNames: function (format, type) {
      format = format || 'wide';
      type = type === 'format' ? type : 'stand-alone';
      const json = _globalize.default.locale().main(`dates/calendars/gregorian/dayPeriods/${type}/${format}`);
      return [json['am'], json['pm']];
    },
    getMonthNames: function (format, type) {
      const months = _globalize.default.locale().main('dates/calendars/gregorian/months/' + (type === 'format' ? type : 'stand-alone') + '/' + (format || 'wide'));
      return iteratorUtils.map(months, month => {
        return month;
      });
    },
    getDayNames: function (format) {
      const days = _globalize.default.locale().main('dates/calendars/gregorian/days/stand-alone/' + (format || 'wide'));
      return iteratorUtils.map(days, day => {
        return day;
      });
    },
    getTimeSeparator: function () {
      return _globalize.default.locale().main('numbers/symbols-numberSystem-latn/timeSeparator');
    },
    removeRtlMarks(text) {
      return text.replace(RTL_MARKS_REGEX, '');
    },
    format: function (date, format) {
      if (!date) {
        return;
      }
      if (!format) {
        return date;
      }
      let formatter;
      let formatCacheKey;
      if (typeof format === 'function') {
        return format(date);
      }
      if (format.formatter) {
        return format.formatter(date);
      }
      format = format.type || format;
      if (typeof format === 'string') {
        formatCacheKey = _globalize.default.locale().locale + ':' + format;
        formatter = formattersCache[formatCacheKey];
        if (!formatter) {
          format = {
            raw: this._getPatternByFormat(format) || format
          };
          formatter = formattersCache[formatCacheKey] = _globalize.default.dateFormatter(format);
        }
      } else {
        if (!this._isAcceptableFormat(format)) {
          return;
        }
        formatter = _globalize.default.dateFormatter(format);
      }
      return this.removeRtlMarks(formatter(date));
    },
    parse: function (text, format) {
      if (!text) {
        return;
      }
      if (!format || typeof format === 'function' || (0, _type.isObject)(format) && !this._isAcceptableFormat(format)) {
        if (format) {
          const parsedValue = this.callBase(text, format);
          if (parsedValue) {
            return parsedValue;
          }
        }
        return _globalize.default.parseDate(text);
      }
      if (format.parser) {
        return format.parser(text);
      }
      if (typeof format === 'string') {
        format = {
          raw: this._getPatternByFormat(format) || format
        };
      }
      const parsedDate = _globalize.default.parseDate(text, format);
      return parsedDate ? parsedDate : this.callBase(text, format);
    },
    _isAcceptableFormat: function (format) {
      if (format.parser) {
        return true;
      }
      for (let i = 0; i < ACCEPTABLE_JSON_FORMAT_PROPERTIES.length; i++) {
        if (Object.prototype.hasOwnProperty.call(format, ACCEPTABLE_JSON_FORMAT_PROPERTIES[i])) {
          return true;
        }
      }
    },
    firstDayOfWeekIndex: function () {
      const firstDay = _globalize.default.locale().supplemental.weekData.firstDay();
      return this._getDayKeys().indexOf(firstDay);
    },
    _getDayKeys: function () {
      const days = _globalize.default.locale().main('dates/calendars/gregorian/days/format/short');
      return iteratorUtils.map(days, (day, key) => {
        return key;
      });
    }
  };
  _date2.default.resetInjection();
  _date2.default.inject(globalizeDateLocalization);
}