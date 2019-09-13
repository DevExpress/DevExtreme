/* globals Intl */
var extend = require("../../core/utils/extend").extend;
var locale = require("../core").locale;
var firstDayOfWeekData = require("../cldr-data/first_day_of_week_data");

var SYMBOLS_TO_REMOVE_REGEX = /[\u200E\u200F]/g;

var getIntlFormatter = function(format) {
    return function(date) {
        // NOTE: Intl in some browsers formates dates with timezone offset which was at the moment for this date.
        // But the method "new Date" creates date using current offset. So, we decided to format dates in the UTC timezone.
        if(!format.timeZoneName) {
            var utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()),
                utcFormat = extend({ timeZone: "UTC" }, format);

            return formatDateTime(utcDate, utcFormat);
        }

        return formatDateTime(date, format);
    };
};

var formattersCache = {};
var getFormatter = function(format) {
    var key = locale() + "/" + JSON.stringify(format);
    if(!formattersCache[key]) {
        formattersCache[key] = (new Intl.DateTimeFormat(locale(), format)).format;
    }

    return formattersCache[key];
};

var formatDateTime = function(date, format) {
    return getFormatter(format)(date).replace(SYMBOLS_TO_REMOVE_REGEX, "");
};

var formatNumber = function(number) {
    return (new Intl.NumberFormat(locale())).format(number);
};

var getAlternativeNumeralsMap = (function() {
    var numeralsMapCache = {};

    return function(locale) {
        if(!(locale in numeralsMapCache)) {
            if(formatNumber(0) === "0") {
                numeralsMapCache[locale] = false;
                return false;
            }
            numeralsMapCache[locale] = {};
            for(var i = 0; i < 10; ++i) {
                numeralsMapCache[locale][formatNumber(i)] = i;
            }
        }

        return numeralsMapCache[locale];
    };
}());

var normalizeNumerals = function(dateString) {
    var alternativeNumeralsMap = getAlternativeNumeralsMap(locale());

    if(!alternativeNumeralsMap) {
        return dateString;
    }

    return dateString.split("").map(function(sign) {
        return sign in alternativeNumeralsMap ? String(alternativeNumeralsMap[sign]) : sign;
    }).join("");
};

var removeLeadingZeroes = function(str) {
    return str.replace(/(\D)0+(\d)/g, "$1$2");
};
var dateStringEquals = function(actual, expected) {
    return removeLeadingZeroes(actual) === removeLeadingZeroes(expected);
};

var normalizeMonth = function(text) {
    return text.replace("d\u2019", "de "); // NOTE: For "ca" locale
};

var intlFormats = {
    "day": { day: "numeric" },
    "dayofweek": { weekday: "long" },
    "longdate": { weekday: "long", year: "numeric", month: "long", day: "numeric" },
    "longdatelongtime": { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" },
    "longtime": { hour: "numeric", minute: "numeric", second: "numeric" },
    "month": { month: "long" },
    "monthandday": { month: "long", day: "numeric" },
    "monthandyear": { year: "numeric", month: "long" },
    "shortdate": {},
    "shorttime": { hour: "numeric", minute: "numeric" },
    "shortyear": { year: "2-digit" },
    "year": { year: "numeric" }
};

Object.defineProperty(intlFormats, "shortdateshorttime", {
    get: function() {
        var defaultOptions = Intl.DateTimeFormat(locale()).resolvedOptions();

        return { year: defaultOptions.year, month: defaultOptions.month, day: defaultOptions.day, hour: "numeric", minute: "numeric" };
    }
});

var getIntlFormat = function(format) {
    return typeof format === "string" && intlFormats[format.toLowerCase()];
};

var monthNameStrategies = {
    standalone: function(monthIndex, monthFormat) {
        var date = new Date(1999, monthIndex, 13, 1);
        var dateString = getIntlFormatter({ month: monthFormat })(date);

        return dateString;
    },
    format: function(monthIndex, monthFormat) {
        var date = new Date(0, monthIndex, 13, 1);
        var dateString = normalizeMonth(getIntlFormatter({ day: "numeric", month: monthFormat })(date));
        var parts = dateString.split(" ").filter(function(part) {
            return part.indexOf("13") < 0;
        });

        if(parts.length === 1) {
            return parts[0];
        } else if(parts.length === 2) {
            return parts[0].length > parts[1].length ? parts[0] : parts[1]; // NOTE: For "lt" locale
        }

        return monthNameStrategies.standalone(monthIndex, monthFormat);
    }
};

module.exports = {
    getMonthNames: function(format, type) {
        var intlFormats = {
            wide: "long",
            abbreviated: "short",
            narrow: "narrow"
        };

        var monthFormat = intlFormats[format || "wide"];

        type = type || "standalone";

        return Array.apply(null, new Array(12)).map(function(_, monthIndex) {
            return monthNameStrategies[type](monthIndex, monthFormat);
        });
    },

    getDayNames: function(format) {
        var intlFormats = {
            wide: "long",
            abbreviated: "short",
            short: "narrow",
            narrow: "narrow"
        };

        var getIntlDayNames = function(format) {
            return Array.apply(null, new Array(7)).map(function(_, dayIndex) {
                return getIntlFormatter({ weekday: format })(new Date(0, 0, dayIndex));
            });
        };

        var result = getIntlDayNames(intlFormats[format || "wide"]);

        return result;
    },

    getPeriodNames: function() {
        var hour12Formatter = getIntlFormatter({ hour: "numeric", hour12: true });

        return [ 1, 13 ].map(function(hours) {
            var hourNumberText = formatNumber(1); // NOTE: For "bn" locale
            var timeParts = hour12Formatter(new Date(0, 0, 1, hours)).split(hourNumberText);

            if(timeParts.length !== 2) {
                return "";
            }

            var biggerPart = timeParts[0].length > timeParts[1].length ? timeParts[0] : timeParts[1];

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
        if(typeof (format) !== "function" && !format.formatter) {
            format = format.type || format;
        }
        var intlFormat = getIntlFormat(format);

        if(intlFormat) {
            return getIntlFormatter(intlFormat)(date);
        }

        var formatType = typeof format;
        if(format.formatter || formatType === "function" || formatType === "string") {
            return this.callBase.apply(this, arguments);
        }

        return getIntlFormatter(format)(date);
    },

    parse: function(dateString, format) {
        var formatter;

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

        var formatParts = this.getFormatParts(format);
        var dateParts = dateString
            .split(/\D+/)
            .filter(function(part) { return part.length > 0; });

        if(formatParts.length !== dateParts.length) {
            return;
        }

        var dateArgs = this._generateDateArgs(formatParts, dateParts);

        var constructDate = function(dateArgs, ampmShift) {
            var hoursShift = ampmShift ? 12 : 0;
            return new Date(dateArgs.year, dateArgs.month, dateArgs.day, (dateArgs.hours + hoursShift) % 24, dateArgs.minutes, dateArgs.seconds);
        };
        var constructValidDate = function(ampmShift) {
            var parsedDate = constructDate(dateArgs, ampmShift);
            if(dateStringEquals(normalizeNumerals(this.format(parsedDate, format)), dateString)) {
                return parsedDate;
            }
        }.bind(this);

        return constructValidDate(false) || constructValidDate(true);
    },

    _generateDateArgs: function(formatParts, dateParts) {
        var currentDate = new Date();
        var dateArgs = {
            year: currentDate.getFullYear(),
            month: currentDate.getMonth(),
            day: currentDate.getDate(),
            hours: 0,
            minutes: 0,
            seconds: 0
        };

        formatParts.forEach(function(formatPart, index) {
            var datePart = dateParts[index];
            var parsed = parseInt(datePart, 10);

            if(formatPart === "month") {
                parsed = parsed - 1;
            }

            dateArgs[formatPart] = parsed;
        });

        return dateArgs;
    },

    formatUsesMonthName: function(format) {
        if(typeof format === "object" && !(format.type || format.format)) {
            return format.month === "long";
        }

        return this.callBase.apply(this, arguments);
    },

    formatUsesDayName: function(format) {
        if(typeof format === "object" && !(format.type || format.format)) {
            return format.weekday === "long";
        }

        return this.callBase.apply(this, arguments);
    },

    getFormatParts: function(format) {
        if(typeof format === "string") {
            return this.callBase(format);
        }
        var intlFormat = extend({}, intlFormats[format.toLowerCase()]);
        var date = new Date(2001, 2, 4, 5, 6, 7);
        var formattedDate = getIntlFormatter(intlFormat)(date);

        formattedDate = normalizeNumerals(formattedDate);

        var formatParts = [
            { name: "year", value: 1 },
            { name: "month", value: 3 },
            { name: "day", value: 4 },
            { name: "hours", value: 5 },
            { name: "minutes", value: 6 },
            { name: "seconds", value: 7 }
        ];

        return formatParts
            .map(function(part) {
                return {
                    name: part.name,
                    index: formattedDate.indexOf(part.value)
                };
            })
            .filter(function(part) { return part.index > -1; })
            .sort(function(a, b) { return a.index - b.index; })
            .map(function(part) { return part.name; });
    },

    firstDayOfWeekIndex: function() {
        var index = firstDayOfWeekData[locale()];

        return index === undefined ? 1 : index;
    }
};
