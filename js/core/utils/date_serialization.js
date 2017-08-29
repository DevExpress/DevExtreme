"use strict";

var config = require("../config"),
    commonUtils = require("./common"),
    isString = commonUtils.isString,
    isDate = commonUtils.isDate,
    isNumber = commonUtils.isNumeric;

var NUMBER_SERIALIZATION_FORMAT = "number",
    DATE_SERIALIZATION_FORMAT = "yyyy/MM/dd",
    DATETIME_SERIALIZATION_FORMAT = "yyyy/MM/dd HH:mm:ss";

var ISO8601_PATTERN = /^(\d{4,})(-)?(\d{2})(-)?(\d{2})(?:T(\d{2})(:)?(\d{2})?(:)?(\d{2}(?:\.(\d{3}))?)?)?(Z|([\+\-])(\d{2})(:)?(\d{2})?)?$/;
var ISO8601_TIME_PATTERN = /^(\d{2}):(\d{2})(:(\d{2}))?$/;
var ISO8601_PATTERN_PARTS = ["", "yyyy", "", "MM", "", "dd", "THH", "", "mm", "", "ss", ".SSS"];

function leftPad(text, length) {
    while(text.length < length) {
        text = "0" + text;
    }
    return text;
}

var LDML_FORMATTERS = {
    y: function(date, count, useUtc) {
        return leftPad(date[useUtc ? "getUTCFullYear" : "getFullYear"]().toString(), count);
    },
    M: function(date, count, useUtc) {
        return leftPad((date[useUtc ? "getUTCMonth" : "getMonth"]() + 1).toString(), Math.min(count, 2));
    },
    d: function(date, count, useUtc) {
        return leftPad(date[useUtc ? "getUTCDate" : "getDate"]().toString(), Math.min(count, 2));
    },
    H: function(date, count, useUtc) {
        return leftPad(date[useUtc ? "getUTCHours" : "getHours"]().toString(), Math.min(count, 2));
    },
    m: function(date, count, useUtc) {
        return leftPad(date[useUtc ? "getUTCMinutes" : "getMinutes"]().toString(), Math.min(count, 2));
    },
    s: function(date, count, useUtc) {
        return leftPad(date[useUtc ? "getUTCSeconds" : "getSeconds"]().toString(), Math.min(count, 2));
    },
    S: function(date, count, useUtc) {
        return leftPad(date[useUtc ? "getUTCMilliseconds" : "getMilliseconds"]().toString(), 3).substr(0, count);
    },
    x: function(date, count, useUtc) {
        var timezoneOffset = useUtc ? 0 : date.getTimezoneOffset(),
            signPart = timezoneOffset > 0 ? "-" : "+",
            timezoneOffsetAbs = Math.abs(timezoneOffset),
            hours = Math.floor(timezoneOffsetAbs / 60),
            minutes = timezoneOffsetAbs % 60,
            hoursPart = leftPad(hours.toString(), 2),
            minutesPart = leftPad(minutes.toString(), 2);

        return signPart + hoursPart + (count >= 3 ? ":" : "") + (count > 1 || minutes ? minutesPart : "");
    },
    X: function(date, count, useUtc) {
        if(useUtc || !date.getTimezoneOffset()) {
            return "Z";
        }
        return LDML_FORMATTERS.x(date, count, useUtc);
    },
    Z: function(date, count, useUtc) {
        return LDML_FORMATTERS.X(date, count >= 5 ? 3 : 2, useUtc);
    },
};

var formatDate = function(date, format) {
    var charIndex,
        formatter,
        char,
        charCount = 0,
        separator = "'",
        isEscaping = false,
        isCurrentCharEqualsNext,
        result = "";

    if(!date) return null;

    if(!format) return date;

    var useUtc = format[format.length - 1] === "Z" || format.slice(-3) === "'Z'";

    for(charIndex = 0; charIndex < format.length; charIndex++) {
        char = format[charIndex];
        formatter = LDML_FORMATTERS[char];
        isCurrentCharEqualsNext = char === format[charIndex + 1];
        charCount++;

        if(!isCurrentCharEqualsNext) {
            if(formatter && !isEscaping) {
                result += formatter(date, charCount, useUtc);
            }
            charCount = 0;
        }

        if(char === separator && !isCurrentCharEqualsNext) {
            isEscaping = !isEscaping;
        } else if(isEscaping || !formatter) {
            result += char;
        }
        if(char === separator && isCurrentCharEqualsNext) {
            charIndex++;
        }
    }
    return result;
};

var dateParser = function(text, skipISO8601Parsing) {
    var result;
    var parsedValue;

    if(isString(text) && !skipISO8601Parsing) {
        result = parseISO8601String(text);
    }

    if(!result) {
        parsedValue = !isDate(text) && Date.parse(text);

        result = isNumber(parsedValue) ? new Date(parsedValue) : text;
    }

    return result;
};

var parseISO8601String = function(text) {
    var parts = text.match(ISO8601_PATTERN);

    var timePart = function(part) {
        return +part || 0;
    };

    if(!parts) {
        parts = text.match(ISO8601_TIME_PATTERN);
        if(parts) {
            return new Date(0, 0, 0, timePart(parts[1]), timePart(parts[2]), timePart(parts[4]));
        }
        return;
    }

    var year = parts[1],
        month = --parts[3],
        day = parts[5],
        timeZoneHour = 0,
        timeZoneMinute = 0;

    timeZoneHour = timePart(parts[14]);
    timeZoneMinute = timePart(parts[16]);

    if(parts[13] === "-") {
        timeZoneHour = -timeZoneHour;
        timeZoneMinute = -timeZoneMinute;
    }

    var hour = timePart(parts[6]) - timeZoneHour,
        minute = timePart(parts[8]) - timeZoneMinute,
        second = timePart(parts[10]),
        millisecond = timePart(parts[11]);

    if(!!parts[12]) {
        return new Date(Date.UTC(year, month, day, hour, minute, second, millisecond));
    }

    return new Date(year, month, day, hour, minute, second, millisecond);
};

var getIso8601Format = function(text, useUtc) {
    var parts = text.match(ISO8601_PATTERN),
        result = "";

    if(!parts) {
        parts = text.match(ISO8601_TIME_PATTERN);
        if(parts) {
            return parts[3] ? "HH:mm:ss" : "HH:mm";
        }
        return;
    }


    for(var i = 1; i < ISO8601_PATTERN_PARTS.length; i++) {
        if(parts[i]) {
            result += ISO8601_PATTERN_PARTS[i] || parts[i];
        }
    }

    if(parts[12] === "Z") {
        result += "'Z'";
    }

    if(parts[14]) {
        if(parts[15]) {
            result += "xxx";
        } else if(parts[16]) {
            result += "xx";
        } else {
            result += "x";
        }
    }

    return result;
};

var deserializeDate = function(value) {
    if(typeof value === "number") {
        return new Date(value);
    }

    return dateParser(value, !config().forceIsoDateParsing);
};

var serializeDate = function(value, serializationFormat) {
    if(!serializationFormat) {
        return value;
    }

    if(!isDate(value)) {
        return null;
    }

    if(serializationFormat === NUMBER_SERIALIZATION_FORMAT) {
        return value && value.valueOf ? value.valueOf() : null;
    }

    return formatDate(value, serializationFormat);
};

var getDateSerializationFormat = function(value) {
    if(typeof value === "number") {
        return NUMBER_SERIALIZATION_FORMAT;
    } else if(isString(value)) {
        var format;

        if(config().forceIsoDateParsing) {
            format = getIso8601Format(value);
        }
        if(format) {
            return format;
        } else if(value.indexOf(":") >= 0) {
            return DATETIME_SERIALIZATION_FORMAT;
        } else {
            return DATE_SERIALIZATION_FORMAT;
        }
    } else if(value) {
        return null;
    }
};

module.exports = {
    dateParser: dateParser,
    deserializeDate: deserializeDate,
    serializeDate: serializeDate,
    getDateSerializationFormat: getDateSerializationFormat
};
