import './core';
import './number';
// eslint-disable-next-line no-restricted-imports, import/no-unresolved
import 'globalize/date';

const ACCEPTABLE_JSON_FORMAT_PROPERTIES = ['skeleton', 'date', 'time', 'datetime', 'raw'];
const RTL_MARKS_REGEX = /[\u200E\u200F]/g;

// eslint-disable-next-line no-restricted-imports
import Globalize from 'globalize';
import dateLocalization from '../date';
import { isObject } from '../../../../core/utils/type';
import * as iteratorUtils from '../../../../core/utils/iterator';

if(Globalize && Globalize.formatDate) {

    if(Globalize.locale().locale === 'en') {
        Globalize.locale('en');
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
        engine: function() {
            return 'globalize';
        },

        _getPatternByFormat: function(format) {
            const that = this;
            const lowerFormat = format.toLowerCase();
            const globalizeFormat = FORMATS_TO_GLOBALIZE_MAP[lowerFormat];

            if(lowerFormat === 'datetime-local') {
                return 'yyyy-MM-ddTHH\':\'mm\':\'ss';
            }

            if(!globalizeFormat) {
                return;
            }

            let result = globalizeFormat.path && that._getFormatStringByPath(globalizeFormat.path) || globalizeFormat.pattern;

            if(globalizeFormat.parts) {
                iteratorUtils.each(globalizeFormat.parts, (index, part) => {
                    result = result.replace('{' + index + '}', that._getPatternByFormat(part));
                });
            }
            return result;
        },

        _getFormatStringByPath: function(path) {
            return Globalize.locale().main('dates/calendars/gregorian/' + path);
        },

        getPeriodNames: function(format, type) {
            format = format || 'wide';
            type = type === 'format' ? type : 'stand-alone';

            const json = Globalize.locale().main(`dates/calendars/gregorian/dayPeriods/${type}/${format}`);
            return [json['am'], json['pm']];
        },

        getMonthNames: function(format, type) {
            const months = Globalize.locale().main('dates/calendars/gregorian/months/' + (type === 'format' ? type : 'stand-alone') + '/' + (format || 'wide'));

            return iteratorUtils.map(months, month => { return month; });
        },

        getDayNames: function(format) {
            const days = Globalize.locale().main('dates/calendars/gregorian/days/stand-alone/' + (format || 'wide'));

            return iteratorUtils.map(days, day => { return day; });
        },

        getTimeSeparator: function() {
            return Globalize.locale().main('numbers/symbols-numberSystem-latn/timeSeparator');
        },

        removeRtlMarks(text) {
            return text.replace(RTL_MARKS_REGEX, '');
        },

        format: function(date, format) {
            if(!date) {
                return;
            }

            if(!format) {
                return date;
            }

            let formatter;
            let formatCacheKey;

            if(typeof (format) === 'function') {
                return format(date);
            }

            if(format.formatter) {
                return format.formatter(date);
            }

            format = format.type || format;

            if(typeof format === 'string') {
                formatCacheKey = Globalize.locale().locale + ':' + format;
                formatter = formattersCache[formatCacheKey];
                if(!formatter) {
                    format = {
                        raw: this._getPatternByFormat(format) || format
                    };

                    formatter = formattersCache[formatCacheKey] = Globalize.dateFormatter(format);
                }
            } else {
                if(!this._isAcceptableFormat(format)) {
                    return;
                }

                formatter = Globalize.dateFormatter(format);
            }

            return this.removeRtlMarks(formatter(date));
        },

        parse: function(text, format) {
            if(!text) {
                return;
            }

            if(!format || typeof (format) === 'function' || isObject(format) && !this._isAcceptableFormat(format)) {
                if(format) {
                    const parsedValue = this.callBase(text, format);
                    if(parsedValue) {
                        return parsedValue;
                    }
                }

                return Globalize.parseDate(text);
            }

            if(format.parser) {
                return format.parser(text);
            }

            if(typeof format === 'string') {
                format = {
                    raw: this._getPatternByFormat(format) || format
                };
            }

            const parsedDate = Globalize.parseDate(text, format);
            return parsedDate ? parsedDate : this.callBase(text, format);
        },

        _isAcceptableFormat: function(format) {
            if(format.parser) {
                return true;
            }

            for(let i = 0; i < ACCEPTABLE_JSON_FORMAT_PROPERTIES.length; i++) {
                if(Object.prototype.hasOwnProperty.call(format, ACCEPTABLE_JSON_FORMAT_PROPERTIES[i])) {
                    return true;
                }
            }
        },

        firstDayOfWeekIndex: function() {
            const firstDay = Globalize.locale().supplemental.weekData.firstDay();

            return this._getDayKeys().indexOf(firstDay);
        },

        _getDayKeys: function() {
            const days = Globalize.locale().main('dates/calendars/gregorian/days/format/short');

            return iteratorUtils.map(days, (day, key) => { return key; });
        }
    };

    dateLocalization.resetInjection();
    dateLocalization.inject(globalizeDateLocalization);
}
