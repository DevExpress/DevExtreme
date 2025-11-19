/* globals Intl */
import { extend } from '../../../../core/utils/extend';
import localizationCoreUtils from '../core';

const SYMBOLS_TO_REMOVE_REGEX = /[\u200E\u200F]/g;
const NARROW_NO_BREAK_SPACE_REGEX = /[\u202F]/g;

const getIntlFormatter = format => {
    return date => {
        // NOTE: Intl in some browsers formates dates with timezone offset which was at the moment for this date.
        // But the method "new Date" creates date using current offset. So, we decided to format dates in the UTC timezone.
        if(!format.timeZoneName) {
            const year = date.getFullYear();
            // NOTE: new Date(99,0,1) will return 1999 year, but 99 expected
            const recognizableAsTwentyCentury = String(year).length < 3;
            const safeYearShift = 400;
            const temporaryYearValue = recognizableAsTwentyCentury ? year + safeYearShift : year;
            const utcDate = new Date(Date.UTC(temporaryYearValue, date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
            if(recognizableAsTwentyCentury) {
                utcDate.setFullYear(year);
            }
            const utcFormat = extend({ timeZone: 'UTC' }, format);

            return formatDateTime(utcDate, utcFormat);
        }

        return formatDateTime(date, format);
    };
};

const formattersCache = {};
const getFormatter = format => {
    const key = localizationCoreUtils.locale() + '/' + JSON.stringify(format);
    if(!formattersCache[key]) {
        formattersCache[key] = (new Intl.DateTimeFormat(localizationCoreUtils.locale(), format)).format;
    }

    return formattersCache[key];
};

function formatDateTime(date, format) {
    return getFormatter(format)(date)
        .replace(SYMBOLS_TO_REMOVE_REGEX, '')
        .replace(NARROW_NO_BREAK_SPACE_REGEX, ' ');
}

const formatNumber = number => {
    return (new Intl.NumberFormat(localizationCoreUtils.locale())).format(number);
};

const getAlternativeNumeralsMap = (() => {
    const numeralsMapCache = {};

    return locale => {
        if(!(locale in numeralsMapCache)) {
            if(formatNumber(0) === '0') {
                numeralsMapCache[locale] = false;
                return false;
            }
            numeralsMapCache[locale] = {};
            for(let i = 0; i < 10; ++i) {
                numeralsMapCache[locale][formatNumber(i)] = i;
            }
        }

        return numeralsMapCache[locale];
    };
})();

const normalizeNumerals = dateString => {
    const alternativeNumeralsMap = getAlternativeNumeralsMap(localizationCoreUtils.locale());

    if(!alternativeNumeralsMap) {
        return dateString;
    }

    return dateString.split('').map(sign => {
        return sign in alternativeNumeralsMap ? String(alternativeNumeralsMap[sign]) : sign;
    }).join('');
};

const removeLeadingZeroes = str => {
    return str.replace(/(\D)0+(\d)/g, '$1$2');
};
const dateStringEquals = (actual, expected) => {
    return removeLeadingZeroes(actual) === removeLeadingZeroes(expected);
};

const normalizeMonth = text => {
    return text.replace('d\u2019', 'de '); // NOTE: For "ca" locale
};

const intlFormats = {
    'day': { day: 'numeric' },
    'date': { year: 'numeric', month: 'long', day: 'numeric' },
    'dayofweek': { weekday: 'long' },
    'longdate': { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    'longdatelongtime': { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' },
    'longtime': { hour: 'numeric', minute: 'numeric', second: 'numeric' },
    'month': { month: 'long' },
    'monthandday': { month: 'long', day: 'numeric' },
    'monthandyear': { year: 'numeric', month: 'long' },
    'shortdate': {},
    'shorttime': { hour: 'numeric', minute: 'numeric' },
    'shortyear': { year: '2-digit' },
    'year': { year: 'numeric' }
};

Object.defineProperty(intlFormats, 'shortdateshorttime', {
    get: function() {
        const defaultOptions = Intl.DateTimeFormat(localizationCoreUtils.locale()).resolvedOptions();

        return { year: defaultOptions.year, month: defaultOptions.month, day: defaultOptions.day, hour: 'numeric', minute: 'numeric' };
    }
});

const getIntlFormat = format => {
    return typeof format === 'string' && intlFormats[format.toLowerCase()];
};

const monthNameStrategies = {
    standalone: function(monthIndex, monthFormat) {
        const date = new Date(1999, monthIndex, 13, 1);
        const dateString = getIntlFormatter({ month: monthFormat })(date);

        return dateString;
    },
    format: function(monthIndex, monthFormat) {
        const date = new Date(0, monthIndex, 13, 1);
        const dateString = normalizeMonth(getIntlFormatter({ day: 'numeric', month: monthFormat })(date));
        const parts = dateString.split(' ').filter(part => {
            return part.indexOf('13') < 0;
        });

        if(parts.length === 1) {
            return parts[0];
        } else if(parts.length === 2) {
            return parts[0].length > parts[1].length ? parts[0] : parts[1]; // NOTE: For "lt" locale
        }

        return monthNameStrategies.standalone(monthIndex, monthFormat);
    }
};

export default {
    engine: function() {
        return 'intl';
    },
    getMonthNames: function(format, type) {
        const intlFormats = {
            wide: 'long',
            abbreviated: 'short',
            narrow: 'narrow'
        };

        const monthFormat = intlFormats[format || 'wide'];

        type = type === 'format' ? type : 'standalone';

        return Array.apply(null, new Array(12)).map((_, monthIndex) => {
            return monthNameStrategies[type](monthIndex, monthFormat);
        });
    },

    getDayNames: function(format) {
        const intlFormats = {
            wide: 'long',
            abbreviated: 'short',
            short: 'narrow',
            narrow: 'narrow'
        };

        const getIntlDayNames = format => {
            return Array.apply(null, new Array(7)).map((_, dayIndex) => {
                return getIntlFormatter({ weekday: format })(new Date(0, 0, dayIndex));
            });
        };

        const result = getIntlDayNames(intlFormats[format || 'wide']);

        return result;
    },

    getPeriodNames: function() {
        const hour12Formatter = getIntlFormatter({ hour: 'numeric', hour12: true });

        return [ 1, 13 ].map(hours => {
            const hourNumberText = formatNumber(1); // NOTE: For "bn" locale
            const timeParts = hour12Formatter(new Date(0, 0, 1, hours)).split(hourNumberText);

            if(timeParts.length !== 2) {
                return '';
            }

            const biggerPart = timeParts[0].length > timeParts[1].length ? timeParts[0] : timeParts[1];

            return biggerPart.trim();
        });
    },

    format: function(date, format) {
        if(!date) {
            return;
        }

        if(!format) {
            return date;
        }

        // TODO: refactor (extract code form base)
        if(typeof (format) !== 'function' && !format.formatter) {
            format = format.type || format;
        }
        const intlFormat = getIntlFormat(format);

        if(intlFormat) {
            return getIntlFormatter(intlFormat)(date);
        }

        const formatType = typeof format;
        if(format.formatter || formatType === 'function' || formatType === 'string') {
            return this.callBase.apply(this, arguments);
        }

        return getIntlFormatter(format)(date);
    },

    parse: function(dateString, format) {
        let formatter;

        if(format && !format.parser && typeof dateString === 'string') {
            dateString = normalizeMonth(dateString);
            formatter = (date) => {
                return normalizeMonth(this.format(date, format));
            };
        }
        return this.callBase(dateString, formatter || format);
    },

    _parseDateBySimpleFormat: function(dateString, format) {
        dateString = normalizeNumerals(dateString);

        const formatParts = this.getFormatParts(format);
        const dateParts = dateString
            .split(/\D+/)
            .filter(part => { return part.length > 0; });

        if(formatParts.length !== dateParts.length) {
            return;
        }

        const dateArgs = this._generateDateArgs(formatParts, dateParts);

        const constructDate = (dateArgs, ampmShift) => {
            const hoursShift = ampmShift ? 12 : 0;
            return new Date(dateArgs.year, dateArgs.month, dateArgs.day, (dateArgs.hours + hoursShift) % 24, dateArgs.minutes, dateArgs.seconds);
        };
        const constructValidDate = ampmShift => {
            const parsedDate = constructDate(dateArgs, ampmShift);
            if(dateStringEquals(normalizeNumerals(this.format(parsedDate, format)), dateString)) {
                return parsedDate;
            }
        };

        return constructValidDate(false) || constructValidDate(true);
    },

    _generateDateArgs: function(formatParts, dateParts) {
        const currentDate = new Date();
        const dateArgs = {
            year: currentDate.getFullYear(),
            month: currentDate.getMonth(),
            day: currentDate.getDate(),
            hours: 0,
            minutes: 0,
            seconds: 0
        };

        formatParts.forEach((formatPart, index) => {
            const datePart = dateParts[index];
            let parsed = parseInt(datePart, 10);

            if(formatPart === 'month') {
                parsed = parsed - 1;
            }

            dateArgs[formatPart] = parsed;
        });

        return dateArgs;
    },

    formatUsesMonthName: function(format) {
        if(typeof format === 'object' && !(format.type || format.format)) {
            return format.month === 'long';
        }

        return this.callBase.apply(this, arguments);
    },

    formatUsesDayName: function(format) {
        if(typeof format === 'object' && !(format.type || format.format)) {
            return format.weekday === 'long';
        }

        return this.callBase.apply(this, arguments);
    },
    getTimeSeparator: function() {
        const formatOptions = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
        };
        return normalizeNumerals(formatDateTime(new Date(2001, 1, 1, 11, 11), formatOptions)).replace(/\d/g, '');
    },

    getFormatParts: function(format) {
        if(typeof format === 'string') {
            return this.callBase(format);
        }
        const intlFormat = extend({}, intlFormats[format.toLowerCase()]);
        const date = new Date(2001, 2, 4, 5, 6, 7);
        let formattedDate = getIntlFormatter(intlFormat)(date);

        formattedDate = normalizeNumerals(formattedDate);

        const formatParts = [
            { name: 'year', value: 1 },
            { name: 'month', value: 3 },
            { name: 'day', value: 4 },
            { name: 'hours', value: 5 },
            { name: 'minutes', value: 6 },
            { name: 'seconds', value: 7 }
        ];

        return formatParts
            .map(part => {
                return {
                    name: part.name,
                    index: formattedDate.indexOf(part.value)
                };
            })
            .filter(part => { return part.index > -1; })
            .sort((a, b) => { return a.index - b.index; })
            .map(part => { return part.name; });
    }
};
