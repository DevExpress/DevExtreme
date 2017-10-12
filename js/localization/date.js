"use strict";

var dependencyInjector = require("../core/utils/dependency_injector"),
    isString = require("../core/utils/type").isString,
    iteratorUtils = require("../core/utils/iterator"),
    inArray = require("../core/utils/array").inArray,
    dateParts = require("../core/utils/date_parts"),
    getLDMLDateFormatter = require("./ldml/date.formatter").getFormatter,
    getLDMLDateParser = require("./ldml/date.parser").getParser,
    errors = require("../core/errors");

require("./core");

var FORMATS_TO_PATTERN_MAP = {
    "shortdate": "M/d/y",
    "shorttime": "h:mm a",
    "longdate": "EEEE, MMMM d, y",
    "longtime": "h:mm:ss a",
    "monthandday": "MMMM d",
    "monthandyear": "MMMM y",
    "quarterandyear": "QQQ y",
    "day": "d",
    "year": "y",
    "shortdateshorttime": "M/d/y, h:mm a",
    "mediumdatemediumtime": "MMMM d, h:mm a",
    "longdatelongtime": "EEEE, MMMM d, y, h:mm:ss a",
    "month": "LLLL",
    "shortyear": "yy",
    "dayofweek": "EEEE",
    "quarter": "QQQ",
    "hour": "HH",
    "minute": "mm",
    "second": "ss",
    "millisecond": "SSS",
    "datetime-local": "yyyy-MM-ddTHH':'mm':'ss"
};

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    periods = ["AM", "PM"],
    quarters = ["Q1", "Q2", "Q3", "Q4"];

// TODO: optimize
var cutCaptions = function(captions, format) {
    var lengthByFormat = {
        abbreviated: 3,
        short: 2,
        narrow: 1
    };

    return iteratorUtils.map(captions, function(caption) {
        return caption.substr(0, lengthByFormat[format]);
    });
};

var possiblePartPatterns = {
    year: ["y", "yy", "yyyy"],
    day: ["d", "dd"],
    month: ["M", "MM", "MMM", "MMMM"],
    hours: ["H", "HH", "h", "hh", "ah"],
    minutes: ["m", "mm"],
    seconds: ["s", "ss"],
    milliseconds: ["S", "SS", "SSS"]
};

var dateLocalization = dependencyInjector({
    _getPatternByFormat: function(format) {
        return FORMATS_TO_PATTERN_MAP[format.toLowerCase()];
    },
    _expandPattern: function(pattern) {
        return this._getPatternByFormat(pattern) || pattern;
    },
    formatUsesMonthName: function(format) {
        return this._expandPattern(format).indexOf("MMMM") !== -1;
    },

    formatUsesDayName: function(format) {
        return this._expandPattern(format).indexOf("EEEE") !== -1;
    },
    getFormatParts: function(format) {
        var pattern = this._getPatternByFormat(format) || format,
            result = [];

        iteratorUtils.each(pattern.split(/\W+/), function(_, formatPart) {
            iteratorUtils.each(possiblePartPatterns, function(partName, possiblePatterns) {
                if(inArray(formatPart, possiblePatterns) > -1) {
                    result.push(partName);
                }
            });
        });

        return result;
    },
    getMonthNames: function(format) {
        return cutCaptions(months, format);
    },

    getDayNames: function(format) {
        return cutCaptions(days, format);
    },
    getQuarterNames: function(format) {
        return quarters;
    },
    getPeriodNames: function(format) {
        return periods;
    },
    getTimeSeparator: function() {
        return ":";
    },

    is24HourFormat: function(format) {
        var amTime = new Date(2017, 0, 20, 11, 0, 0, 0),
            pmTime = new Date(2017, 0, 20, 23, 0, 0, 0),
            amTimeFormatted = this.format(amTime, format),
            pmTimeFormatted = this.format(pmTime, format);

        for(var i = 0; i < amTimeFormatted.length; i++) {
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

        var formatter;

        if(typeof (format) === "function") {
            formatter = format;
        } else if(format.formatter) {
            formatter = format.formatter;
        } else {
            format = format.type || format;
            if(isString(format)) {
                format = FORMATS_TO_PATTERN_MAP[format.toLowerCase()] || format;
                return getLDMLDateFormatter(format)(date);
            }
        }

        if(!formatter) {
            // TODO: log warning or error
            return;
        }

        return formatter(date);
    },

    parse: function(text, format) {
        var result;

        if(!text) {
            return;
        }

        if(!format) {
            return new Date(text);
        }

        if(format.parser) {
            return format.parser(text);
        }

        if(format.type || format.formatter) {
            format = format.type;
        }

        if(typeof format === "string") {
            format = FORMATS_TO_PATTERN_MAP[format.toLowerCase()] || format;
            return getLDMLDateParser(format)(text);
        }

        errors.log("W0012");
        result = new Date(text);

        if(!result || isNaN(result.getTime())) {
            return;
        }

        return result;
    },

    firstDayOfWeekIndex: function() {
        return 0;
    }
});

Object.keys(dateParts).forEach(function(methodName) {
    dateParts[methodName] = function() {
        return dateLocalization[methodName].apply(this, arguments);
    };
});

module.exports = dateLocalization;
