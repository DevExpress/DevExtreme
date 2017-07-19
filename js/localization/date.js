"use strict";

var $ = require("../core/renderer"),
    numberLocalization = require("./number"),
    dependencyInjector = require("../core/utils/dependency_injector"),
    isString = require("../core/utils/type").isString,
    iteratorUtils = require("../core/utils/iterator"),
    inArray = require("../core/utils/array").inArray,
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

var amPm = function(date) {
    return date.getHours() >= 12 ? 'PM' : 'AM';
};

var getTwelveHourTimeFormat = function(hours) {
    return hours % 12 || 12;
};

var formatNumber = function(number, precision) {
    return numberLocalization.format(number, {
        type: "decimal",
        precision: precision
    });
};

// TODO: add other formatters and parsers
var FORMATTERS = {
    "millisecond": function(date) {
        return formatNumber(date.getMilliseconds(date), 3);
    },

    "second": function(date) {
        return formatNumber(date.getSeconds(), 2);
    },

    "minute": function(date) {
        return formatNumber(date.getMinutes(), 2);
    },

    "h": function(date) {
        return formatNumber(getTwelveHourTimeFormat(date.getHours()), 1);
    },
    "hh": function(date) {
        return formatNumber(getTwelveHourTimeFormat(date.getHours()), 2);
    },
    "hour": function(date) {
        return formatNumber(date.getHours(), 2);
    },

    "day": function(date) {
        return date.getDate();
    },
    "dayofweek": function(date) {
        return days[date.getDay()];
    },

    "M": function(date) {
        return date.getMonth() + 1;
    },
    "MM": function(date) {
        return formatNumber(date.getMonth() + 1, 2);
    },
    "month": function(date) {
        return months[date.getMonth()];
    },

    "year": function(date) {
        return date.getFullYear();
    },
    "shortyear": function(date) {
        return String(date.getFullYear()).substr(2, 2);
    },
    "shorttime": function(date) {
        return FORMATTERS["h"](date) +
            ":" +
            FORMATTERS["minute"](date) +
            " " +
            amPm(date);
    },
    "shortdate": function(date) {
        return [
            FORMATTERS["M"](date),
            FORMATTERS["day"](date),
            FORMATTERS["year"](date)
        ].join("/");
    },
    "shortdateshorttime": function(date) {
        return [
            FORMATTERS["shortdate"](date),
            FORMATTERS["shorttime"](date)
        ].join(", ");
    },
    "mediumdatemediumtime": function(date) {
        return [
            FORMATTERS["monthandday"](date),
            FORMATTERS["shorttime"](date)
        ].join(", ");
    },
    "monthandyear": function(date) {
        return [
            FORMATTERS["month"](date),
            FORMATTERS["year"](date)
        ].join(" ");
    },
    "monthandday": function(date) {
        return [
            FORMATTERS["month"](date),
            FORMATTERS["day"](date)
        ].join(" ");
    },
    "longdate": function(date) {
        return FORMATTERS["dayofweek"](date) +
            ", " +
            FORMATTERS["month"](date) +
            " " +
            FORMATTERS["day"](date) +
            ", " +
            FORMATTERS["year"](date);
    },
    "longtime": function(date) {
        return [
            FORMATTERS["h"](date),
            FORMATTERS["minute"](date),
            FORMATTERS["second"](date)
        ].join(":") + " " + amPm(date);
    },
    "longdatelongtime": function(date) {
        return [
            FORMATTERS["longdate"](date),
            FORMATTERS["longtime"](date)
        ].join(", ");
    },

    "d": function(date) {
        return formatNumber(FORMATTERS["day"](date), 1);
    },
    "dd": function(date) {
        return formatNumber(FORMATTERS["day"](date), 2);
    },

    "d MMMM": function(date) {
        return FORMATTERS["day"](date) +
            " " +
            FORMATTERS["month"](date);
    },
    "yyyy/M/d": function(date) {
        return [
            FORMATTERS["year"](date),
            FORMATTERS["M"](date),
            FORMATTERS["day"](date)
        ].join("/");
    },
    "yyyy/MM/dd": function(date) {
        return [
            FORMATTERS["year"](date),
            FORMATTERS["MM"](date),
            FORMATTERS["dd"](date)
        ].join("/");
    },
    "dd.MM.yyyy": function(date) {
        return [
            FORMATTERS["dd"](date),
            FORMATTERS["MM"](date),
            FORMATTERS["year"](date)
        ].join(".");
    },
    "HH:mm": function(date) {
        return [
            FORMATTERS["hour"](date),
            FORMATTERS["minute"](date)
        ].join(":");
    },
    "HH:mm:ss": function(date) {
        return [
            FORMATTERS["HH:mm"](date),
            FORMATTERS["second"](date)
        ].join(":");
    },

    "h:mm:ss": function(date) {
        return [
            FORMATTERS["h"](date),
            FORMATTERS["minute"](date),
            FORMATTERS["second"](date)
        ].join(":");
    },
    "h:mm:ss:SSS": function(date) {
        return [
            FORMATTERS["h"](date),
            FORMATTERS["minute"](date),
            FORMATTERS["second"](date),
            FORMATTERS["SSS"](date)
        ].join(":");
    },
    "yyyy/MM/dd HH:mm:ss": function(date) {
        return [
            FORMATTERS["yyyy/MM/dd"](date),
            FORMATTERS["HH:mm:ss"](date)
        ].join(" ");
    },

    "yyyy-MM-dd hh:mm:ss.SSS a": function(date) {
        return [
            [
                FORMATTERS["year"](date),
                FORMATTERS["MM"](date),
                FORMATTERS["dd"](date)
            ].join("-"),

            [
                FORMATTERS["hh"](date),
                FORMATTERS["minute"](date),
                FORMATTERS["second"](date)
            ].join(":") + "." + FORMATTERS["SSS"](date),

            amPm(date)

        ].join(" ");
    },

    "yyyy-MM-dd": function(date) {
        return [
            FORMATTERS["year"](date),
            FORMATTERS["MM"](date),
            FORMATTERS["dd"](date)
        ].join("-");
    },
    "yyyyMMddTHHmmss": function(date) {
        return [
            FORMATTERS["year"](date),
            FORMATTERS["MM"](date),
            FORMATTERS["dd"](date),
            "T",
            FORMATTERS["hour"](date),
            FORMATTERS["minute"](date),
            FORMATTERS["second"](date)
        ].join("");
    },
    "datetime-local": function(date) {
        return FORMATTERS["yyyy-MM-dd"](date) +
            "T" +
            FORMATTERS["HH:mm:ss"](date);
    },
    "yyyy-MM-ddTHH:mm:ssZ": function(date) {
        return FORMATTERS["datetime-local"](date) + "Z";
    },
    "yyyy-MM-ddTHH:mmZ": function(date) {
        return FORMATTERS["yyyy-MM-dd"](date) + "T"
            +
            FORMATTERS["hour"](date) +
            ":" +
            FORMATTERS["minute"](date) + "Z";
    },
    "dd/MM/yyyy": function(date) {
        return [
            FORMATTERS["dd"](date),
            FORMATTERS["MM"](date),
            FORMATTERS["year"](date)
        ].join("/");
    },
    "yyyy MMMM d": function(date) {
        return [
            FORMATTERS["year"](date),
            FORMATTERS["month"](date),
            FORMATTERS["day"](date)
        ].join(" ");
    },
    "EEEE, d": function(date) {
        return [
            FORMATTERS["dayofweek"](date),
            FORMATTERS["d"](date)
        ].join(", ");
    },
    "EEEE MM yy": function(date) {
        return [
            FORMATTERS["dayofweek"](date),
            FORMATTERS["MM"](date),
            FORMATTERS["shortyear"](date)
        ].join(" ");
    },
    "d MMMM yyyy": function(date) {
        return [
            FORMATTERS["day"](date),
            FORMATTERS["month"](date),
            FORMATTERS["year"](date)
        ].join(" ");
    },
    "E": function(date) {
        return cutCaptions([FORMATTERS["dayofweek"](date)], "abbreviated")[0];
    },
    "EEE": function(date) {
        return FORMATTERS["E"](date);
    },
    "EEE hh": function(date) {
        return [
            FORMATTERS["EEE"](date),
            FORMATTERS["hh"](date)
        ].join(" ");
    },
    "ss SSS": function(date) {
        return [
            FORMATTERS["second"](date),
            FORMATTERS["SSS"](date)
        ].join(" ");
    },
    "quarter": function(date) {
        var month = date.getMonth();
        if(month >= 0 && month < 3) {
            return "Q1";
        }

        if(month > 2 && month < 6) {
            return "Q2";
        }

        if(month > 5 && month < 9) {
            return "Q3";
        }

        return "Q4";
    },
    "quarterandyear": function(date) {
        return FORMATTERS["quarter"](date) +
            " " +
            FORMATTERS["year"](date);
    }
};

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
    FORMATTERS[value] = FORMATTERS[key];
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
            formatter = getByFormat(FORMATTERS, format);
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
