var config = require('../config'),
    getLDMLFormatter = require('../../localization/ldml/date.formatter').getFormatter,
    defaultDateNames = require('../../localization/default_date_names'),
    typeUtils = require('./type'),
    isString = typeUtils.isString,
    isDate = typeUtils.isDate,
    isNumber = typeUtils.isNumeric;

var NUMBER_SERIALIZATION_FORMAT = 'number',
    DATE_SERIALIZATION_FORMAT = 'yyyy/MM/dd',
    DATETIME_SERIALIZATION_FORMAT = 'yyyy/MM/dd HH:mm:ss';

var ISO8601_PATTERN = /^(\d{4,})(-)?(\d{2})(-)?(\d{2})(?:T(\d{2})(:)?(\d{2})?(:)?(\d{2}(?:\.(\d{1,3})\d*)?)?)?(Z|([+-])(\d{2})(:)?(\d{2})?)?$/;
var ISO8601_TIME_PATTERN = /^(\d{2}):(\d{2})(:(\d{2}))?$/;
var ISO8601_PATTERN_PARTS = ['', 'yyyy', '', 'MM', '', 'dd', 'THH', '', 'mm', '', 'ss', '.SSS'];

var MILLISECOND_LENGHT = 3;

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

    if(parts[13] === '-') {
        timeZoneHour = -timeZoneHour;
        timeZoneMinute = -timeZoneMinute;
    }

    var hour = timePart(parts[6]) - timeZoneHour,
        minute = timePart(parts[8]) - timeZoneMinute,
        second = timePart(parts[10]),
        parseMilliseconds = function(part) {
            part = part || '';
            return timePart(part) * Math.pow(10, MILLISECOND_LENGHT - part.length);
        },
        millisecond = parseMilliseconds(parts[11]);

    if(parts[12]) {
        return new Date(Date.UTC(year, month, day, hour, minute, second, millisecond));
    }

    return new Date(year, month, day, hour, minute, second, millisecond);
};

var getIso8601Format = function(text, useUtc) {
    var parts = text.match(ISO8601_PATTERN),
        result = '';

    if(!parts) {
        parts = text.match(ISO8601_TIME_PATTERN);
        if(parts) {
            return parts[3] ? 'HH:mm:ss' : 'HH:mm';
        }
        return;
    }


    for(var i = 1; i < ISO8601_PATTERN_PARTS.length; i++) {
        if(parts[i]) {
            result += ISO8601_PATTERN_PARTS[i] || parts[i];
        }
    }

    if(parts[12] === 'Z') {
        result += '\'Z\'';
    }

    if(parts[14]) {
        if(parts[15]) {
            result += 'xxx';
        } else if(parts[16]) {
            result += 'xx';
        } else {
            result += 'x';
        }
    }

    return result;
};

var deserializeDate = function(value) {
    if(typeof value === 'number') {
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

    return getLDMLFormatter(serializationFormat, defaultDateNames)(value);
};

var getDateSerializationFormat = function(value) {
    if(typeof value === 'number') {
        return NUMBER_SERIALIZATION_FORMAT;
    } else if(isString(value)) {
        var format;

        if(config().forceIsoDateParsing) {
            format = getIso8601Format(value);
        }
        if(format) {
            return format;
        } else if(value.indexOf(':') >= 0) {
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
