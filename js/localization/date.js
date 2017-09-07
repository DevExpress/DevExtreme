"use strict";

var dependencyInjector = require("../core/utils/dependency_injector"),
    isString = require("../core/utils/type").isString,
    iteratorUtils = require("../core/utils/iterator"),
    inArray = require("../core/utils/array").inArray,
    serializeDate = require("../core/utils/date_serialization").serializeDate,
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

var parseTime = function(text) {
    var now = new Date(),
        parts = text.split(" "),
        time = parts[0].split(":"),

        hours = Number(time[0]),
        minutes = Number(time[1]),
        second = Number(time[2]) || 0,

        pm = /^pm$/i.test(parts[1]),

        isValid = second < 60 && minutes < 60 && hours > 0 && hours < 13;

    if(!isValid) {
        return null;
    }

    if(!pm && hours === 12) {
        hours = 0;
    }

    if(pm && hours !== 12) {
        hours += 12;
    }

    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, second);
};

var removeTimezoneOffset = function(date) {
    return new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
};

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// TODO: find best solution for parsing without timezone
var parseWithoutTimezone = function(text) {
    if(text.slice(-1) !== "Z") {
        text += "Z";
    }
    return removeTimezoneOffset(new Date(text));
};

var PARSERS = {
    "day": function(text) {
        var now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), Number(text));
    },

    "hour": function(text) {
        var now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(text));
    },

    "minute": function(text) {
        var now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), Number(text));
    },

    "month": function(text) {
        return new Date(new Date().getFullYear(), inArray(text, months));
    },

    "monthandday": function(text) {
        var parts = text.split(" "),
            result = PARSERS.month(parts[0]);

        result.setDate(Number(parts[1]));

        return result;
    },

    "monthandyear": function(text) {
        var parts = text.split(" "),
            result = PARSERS.month(parts[0]);

        result.setYear(Number(parts[1]));

        return result;
    },

    "year": function(text) {
        var date = new Date(new Date(0));
        date.setUTCFullYear(Number(text));

        return removeTimezoneOffset(date);
    },
    "second": function(text) {
        var now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), Number(text));
    },

    "shortyear": function(text) {
        var MAX_YEAR_IN_XXI_CENTURY = 36;
        var year = Number(text);

        if(year > MAX_YEAR_IN_XXI_CENTURY) {
            year += 1900;
        } else {
            year += 2000;
        }

        return PARSERS.year(year);
    },
    "longdatelongtime": function(text) {
        return new Date(text);
    },
    "shortdateshorttime": function(text) {
        return new Date(text);
    },
    "longdate": function(text) {
        return new Date(text);
    },
    "shortdate": function(text) {
        if(!/^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/\d{1,4}/.test(text)) {
            return;
        }
        var parts = text.split("/");

        var date = new Date(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1]));

        if(parts[2].length < 3) {
            date.setFullYear(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1]));
        }

        return date;
    },

    "longtime": function(text) {
        return parseTime(text);
    },

    "shorttime": function(text) {
        return parseTime(text);
    },

    "millisecond": function(text) {
        return new Date(Number(text));
    },
    "yyyy MMMM d": function(text) {
        var parts = text.split(" ");
        if(parts.length !== 3) {
            return;
        }

        return new Date(Number(parts[0]), inArray(parts[1], months), Number(parts[2]));
    },
    "HH:mm": function(text) {
        var parts = text.split(":");
        return new Date(0, 0, 0, Number(parts[0]), Number(parts[1]), 0, 0);
    },
    "yyyy-MM-ddTHH:mm:ssZ": parseWithoutTimezone,
    "yyyy-MM-ddTHH:mmZ": parseWithoutTimezone,
    "datetime-local": parseWithoutTimezone,
    "mediumdatemediumtime": function(text) {
        var parts = text.split(", "),
            dateParts = parts[0].split(" "),
            timeParts = parts[1].split(" ");

        var amPm = timeParts.length === 2
            ? timeParts.pop()
            : undefined;

        var result = PARSERS.month(dateParts[0]);
        result.setDate(Number(dateParts[1]));

        timeParts = timeParts[0].split(":");
        var hours = Number(timeParts[0]);

        switch(String(amPm).toLowerCase()) {
            case "am":
                hours = hours === 12 ? 0 : hours;
                break;

            case "pm":
                hours = hours === 12 ? 12 : hours + 12;
                break;

            default: break;
        }

        result.setHours(hours);
        result.setMinutes(Number(timeParts[1]));

        return result;
    }
};

// generating pattern aliases
iteratorUtils.each(FORMATS_TO_PATTERN_MAP, function(key, value) {
    value = value.replace(/'/g, "");
    PARSERS[value] = PARSERS[key];
});

var getByFormat = function(obj, format) {
    return isString(format) && (obj[format.toLowerCase()] || obj[format.replace(/'/g, "")]);
};

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
                return serializeDate(date, format);
            }
        }

        if(!formatter) {
            // TODO: log warning or error
            return;
        }

        return formatter(date);
    },

    parse: function(text, format) {
        var result,
            parser;

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

        if(format && typeof (format) !== "function") {
            parser = getByFormat(PARSERS, format);
        }

        if(parser) {
            result = parser(text);
        } else {
            errors.log("W0012");
            result = new Date(text);
        }

        if(!result || isNaN(result.getTime())) {
            return;
        }

        return result;
    },

    firstDayOfWeekIndex: function() {
        return 0;
    }
});

module.exports = dateLocalization;
