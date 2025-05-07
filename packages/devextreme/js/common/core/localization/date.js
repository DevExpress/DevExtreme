import dependencyInjector from '../../../core/utils/dependency_injector';
import { isString } from '../../../core/utils/type';
import { each } from '../../../core/utils/iterator';
import errors from '../../../core/errors';
import { getFormatter as getLDMLDateFormatter } from './ldml/date.formatter';
import { getFormat as getLDMLDateFormat } from './ldml/date.format';
import { getParser as getLDMLDateParser } from './ldml/date.parser';
import defaultDateNames from './default_date_names';
import firstDayOfWeekData from './cldr-data/first_day_of_week_data';
import localizationCore from './core';
import numberLocalization from './number';
import intlDateLocalization from './intl/date';

const DEFAULT_DAY_OF_WEEK_INDEX = 0;
const hasIntl = typeof Intl !== 'undefined';

const FORMATS_TO_PATTERN_MAP = {
    'shortdate': 'M/d/y',
    'shorttime': 'h:mm a',
    'longdate': 'EEEE, MMMM d, y',
    'longtime': 'h:mm:ss a',
    'monthandday': 'MMMM d',
    'monthandyear': 'MMMM y',
    'quarterandyear': 'QQQ y',
    'day': 'd',
    'year': 'y',
    'shortdateshorttime': 'M/d/y, h:mm a',
    'longdatelongtime': 'EEEE, MMMM d, y, h:mm:ss a',
    'month': 'LLLL',
    'shortyear': 'yy',
    'dayofweek': 'EEEE',
    'quarter': 'QQQ',
    'hour': 'HH',
    'minute': 'mm',
    'second': 'ss',
    'millisecond': 'SSS',
    'datetime-local': 'yyyy-MM-ddTHH\':\'mm\':\'ss'
};

const possiblePartPatterns = {
    year: ['y', 'yy', 'yyyy'],
    day: ['d', 'dd'],
    month: ['M', 'MM', 'MMM', 'MMMM'],
    hours: ['H', 'HH', 'h', 'hh', 'ah'],
    minutes: ['m', 'mm'],
    seconds: ['s', 'ss'],
    milliseconds: ['S', 'SS', 'SSS']
};

const dateLocalization = dependencyInjector({
    engine: function() {
        return 'base';
    },
    _getPatternByFormat: function(format) {
        return FORMATS_TO_PATTERN_MAP[format.toLowerCase()];
    },
    _expandPattern: function(pattern) {
        return this._getPatternByFormat(pattern) || pattern;
    },
    formatUsesMonthName: function(format) {
        return this._expandPattern(format).indexOf('MMMM') !== -1;
    },

    formatUsesDayName: function(format) {
        return this._expandPattern(format).indexOf('EEEE') !== -1;
    },
    getFormatParts: function(format) {
        const pattern = this._getPatternByFormat(format) || format;
        const result = [];

        each(pattern.split(/\W+/), (_, formatPart) => {
            each(possiblePartPatterns, (partName, possiblePatterns) => {
                if(possiblePatterns.includes(formatPart)) {
                    result.push(partName);
                }
            });
        });

        return result;
    },
    getMonthNames: function(format) {
        return defaultDateNames.getMonthNames(format);
    },
    getDayNames: function(format) {
        return defaultDateNames.getDayNames(format);
    },
    getQuarterNames: function(format) {
        return defaultDateNames.getQuarterNames(format);
    },
    getPeriodNames: function(format) {
        return defaultDateNames.getPeriodNames(format);
    },
    getTimeSeparator: function() {
        return ':';
    },

    is24HourFormat: function(format) {
        const amTime = new Date(2017, 0, 20, 11, 0, 0, 0);
        const pmTime = new Date(2017, 0, 20, 23, 0, 0, 0);
        const amTimeFormatted = this.format(amTime, format);
        const pmTimeFormatted = this.format(pmTime, format);

        for(let i = 0; i < amTimeFormatted.length; i++) {
            if(amTimeFormatted[i] !== pmTimeFormatted[i]) {
                return !isNaN(parseInt(amTimeFormatted[i]));
            }
        }
    },

    format: function(date, format) {
        if(!date) {
            return;
        }

        if(!format) {
            return date;
        }

        let formatter;

        if(typeof (format) === 'function') {
            formatter = format;
        } else if(format.formatter) {
            formatter = format.formatter;
        } else {
            format = format.type || format;
            if(isString(format)) {
                format = FORMATS_TO_PATTERN_MAP[format.toLowerCase()] || format;
                return numberLocalization.convertDigits(getLDMLDateFormatter(format, this)(date));
            }
        }

        if(!formatter) {
            // TODO: log warning or error
            return;
        }

        return formatter(date);
    },

    parse: function(text, format) {
        const that = this;
        let ldmlFormat;
        let formatter;

        if(!text) {
            return;
        }

        if(!format) {
            return this.parse(text, 'shortdate');
        }

        if(format.parser) {
            return format.parser(text);
        }

        if(typeof format === 'string' && !FORMATS_TO_PATTERN_MAP[format.toLowerCase()]) {
            ldmlFormat = format;
        } else {
            formatter = value => {
                const text = that.format(value, format);
                return numberLocalization.convertDigits(text, true);
            };
            try {
                ldmlFormat = getLDMLDateFormat(formatter);
            } catch(e) {}
        }

        if(ldmlFormat) {
            text = numberLocalization.convertDigits(text, true);
            return getLDMLDateParser(ldmlFormat, this)(text);
        }

        errors.log('W0012');
        const result = new Date(text);

        if(!result || isNaN(result.getTime())) {
            return;
        }

        return result;
    },

    firstDayOfWeekIndex: function() {
        const index = localizationCore.getValueByClosestLocale((locale) => firstDayOfWeekData[locale]);

        return index === undefined ? DEFAULT_DAY_OF_WEEK_INDEX : index;
    }
});

if(hasIntl) {
    dateLocalization.inject(intlDateLocalization);
}

export default dateLocalization;
