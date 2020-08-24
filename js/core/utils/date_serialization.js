import config from '../config';
import { getFormatter as getLDMLFormatter } from '../../localization/ldml/date.formatter';
import defaultDateNames from '../../localization/default_date_names';
import { isString, isDate, isNumeric as isNumber } from './type';

const NUMBER_SERIALIZATION_FORMAT = 'number';
const DATE_SERIALIZATION_FORMAT = 'yyyy/MM/dd';
const DATETIME_SERIALIZATION_FORMAT = 'yyyy/MM/dd HH:mm:ss';

const ISO8601_PATTERN = /^(\d{4,})(-)?(\d{2})(-)?(\d{2})(?:T(\d{2})(:)?(\d{2})?(:)?(\d{2}(?:\.(\d{1,3})\d*)?)?)?(Z|([+-])(\d{2})(:)?(\d{2})?)?$/;
const ISO8601_TIME_PATTERN = /^(\d{2}):(\d{2})(:(\d{2}))?$/;

const ISO8601_PATTERN_PARTS = ['', 'yyyy', '', 'MM', '', 'dd', 'THH', '', 'mm', '', 'ss', '.SSS'];
const DATE_SERIALIZATIN_PATTERN = /^(\d{4})\/(\d{2})\/(\d{2})?$/;

const MILLISECOND_LENGHT = 3;

const dateParser = function(text, skipISO8601Parsing) {
    let result;

    if(isString(text) && !skipISO8601Parsing) {
        result = parseISO8601String(text);
    }

    return result ? result : parseDate(text);
};

function getDimePart(part) {
    return +part || 0;
}

function parseDate(text) {
    const parsedValue = !isDate(text) && Date.parse(text);

    if(!parsedValue && getDateSerializationFormat(text) === DATE_SERIALIZATION_FORMAT) {

        const parts = text.match(DATE_SERIALIZATIN_PATTERN);
        if(parts) {
            const newDate = new Date(getDimePart(parts[1]), getDimePart(parts[2]), getDimePart(parts[3]));
            newDate.setFullYear(getDimePart(parts[1]));
            newDate.setMonth(getDimePart(parts[2]) - 1);
            newDate.setDate(getDimePart(parts[3]));
            return newDate;
        }
    }

    return isNumber(parsedValue) ? new Date(parsedValue) : text;
}

function parseISO8601String(text) {
    let parts = text.match(ISO8601_PATTERN);

    if(!parts) {
        parts = text.match(ISO8601_TIME_PATTERN);
        if(parts) {
            return new Date(0, 0, 0, getDimePart(parts[1]), getDimePart(parts[2]), getDimePart(parts[4]));
        }

        return;
    }

    const year = parts[1];
    const month = --parts[3];
    const day = parts[5];
    let timeZoneHour = 0;
    let timeZoneMinute = 0;

    timeZoneHour = getDimePart(parts[14]);
    timeZoneMinute = getDimePart(parts[16]);

    if(parts[13] === '-') {
        timeZoneHour = -timeZoneHour;
        timeZoneMinute = -timeZoneMinute;
    }

    const hour = getDimePart(parts[6]) - timeZoneHour;
    const minute = getDimePart(parts[8]) - timeZoneMinute;
    const second = getDimePart(parts[10]);
    const parseMilliseconds = function(part) {
        part = part || '';
        return getDimePart(part) * Math.pow(10, MILLISECOND_LENGHT - part.length);
    };
    const millisecond = parseMilliseconds(parts[11]);

    if(parts[12]) {
        return new Date(Date.UTC(year, month, day, hour, minute, second, millisecond));
    }

    return new Date(year, month, day, hour, minute, second, millisecond);
}

const getIso8601Format = function(text, useUtc) {
    let parts = text.match(ISO8601_PATTERN);
    let result = '';

    if(!parts) {
        parts = text.match(ISO8601_TIME_PATTERN);
        if(parts) {
            return parts[3] ? 'HH:mm:ss' : 'HH:mm';
        }
        return;
    }


    for(let i = 1; i < ISO8601_PATTERN_PARTS.length; i++) {
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

const deserializeDate = function(value) {
    if(typeof value === 'number') {
        return new Date(value);
    }

    return dateParser(value, !config().forceIsoDateParsing);
};

const serializeDate = function(value, serializationFormat) {
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

const getDateSerializationFormat = function(value) {
    if(typeof value === 'number') {
        return NUMBER_SERIALIZATION_FORMAT;
    } else if(isString(value)) {
        let format;

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

export default {
    dateParser: dateParser,
    deserializeDate: deserializeDate,
    serializeDate: serializeDate,
    getDateSerializationFormat: getDateSerializationFormat
};
