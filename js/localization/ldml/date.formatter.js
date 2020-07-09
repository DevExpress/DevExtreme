function leftPad(text, length) {
    while(text.length < length) {
        text = '0' + text;
    }
    return text;
}

const FORMAT_TYPES = {
    '3': 'abbreviated',
    '4': 'wide',
    '5': 'narrow'
};

const LDML_FORMATTERS = {
    y: function(date, count, useUtc) {
        let year = date[useUtc ? 'getUTCFullYear' : 'getFullYear']();
        if(count === 2) {
            year = year % 100;
        }
        return leftPad(year.toString(), count);
    },
    M: function(date, count, useUtc, dateParts) {
        const month = date[useUtc ? 'getUTCMonth' : 'getMonth']();
        const formatType = FORMAT_TYPES[count];
        if(formatType) {
            return dateParts.getMonthNames(formatType, 'format')[month];
        }
        return leftPad((month + 1).toString(), Math.min(count, 2));
    },
    L: function(date, count, useUtc, dateParts) {
        const month = date[useUtc ? 'getUTCMonth' : 'getMonth']();
        const formatType = FORMAT_TYPES[count];
        if(formatType) {
            return dateParts.getMonthNames(formatType, 'standalone')[month];
        }
        return leftPad((month + 1).toString(), Math.min(count, 2));
    },
    Q: function(date, count, useUtc, dateParts) {
        const month = date[useUtc ? 'getUTCMonth' : 'getMonth']();
        const quarter = Math.floor(month / 3);
        const formatType = FORMAT_TYPES[count];
        if(formatType) {
            return dateParts.getQuarterNames(formatType)[quarter];
        }
        return leftPad((quarter + 1).toString(), Math.min(count, 2));
    },
    E: function(date, count, useUtc, dateParts) {
        const day = date[useUtc ? 'getUTCDay' : 'getDay']();
        const formatType = FORMAT_TYPES[count < 3 ? 3 : count];
        return dateParts.getDayNames(formatType)[day];
    },
    a: function(date, count, useUtc, dateParts) {
        const hours = date[useUtc ? 'getUTCHours' : 'getHours']();
        const period = hours < 12 ? 0 : 1;
        const formatType = FORMAT_TYPES[count];
        return dateParts.getPeriodNames(formatType)[period];
    },
    d: function(date, count, useUtc) {
        return leftPad(date[useUtc ? 'getUTCDate' : 'getDate']().toString(), Math.min(count, 2));
    },
    H: function(date, count, useUtc) {
        return leftPad(date[useUtc ? 'getUTCHours' : 'getHours']().toString(), Math.min(count, 2));
    },
    h: function(date, count, useUtc) {
        const hours = date[useUtc ? 'getUTCHours' : 'getHours']();
        return leftPad((hours % 12 || 12).toString(), Math.min(count, 2));
    },
    m: function(date, count, useUtc) {
        return leftPad(date[useUtc ? 'getUTCMinutes' : 'getMinutes']().toString(), Math.min(count, 2));
    },
    s: function(date, count, useUtc) {
        return leftPad(date[useUtc ? 'getUTCSeconds' : 'getSeconds']().toString(), Math.min(count, 2));
    },
    S: function(date, count, useUtc) {
        return leftPad(date[useUtc ? 'getUTCMilliseconds' : 'getMilliseconds']().toString(), 3).substr(0, count);
    },
    x: function(date, count, useUtc) {
        const timezoneOffset = useUtc ? 0 : date.getTimezoneOffset();
        const signPart = timezoneOffset > 0 ? '-' : '+';
        const timezoneOffsetAbs = Math.abs(timezoneOffset);
        const hours = Math.floor(timezoneOffsetAbs / 60);
        const minutes = timezoneOffsetAbs % 60;
        const hoursPart = leftPad(hours.toString(), 2);
        const minutesPart = leftPad(minutes.toString(), 2);

        return signPart + hoursPart + (count >= 3 ? ':' : '') + (count > 1 || minutes ? minutesPart : '');
    },
    X: function(date, count, useUtc) {
        if(useUtc || !date.getTimezoneOffset()) {
            return 'Z';
        }
        return LDML_FORMATTERS.x(date, count, useUtc);
    },
    Z: function(date, count, useUtc) {
        return LDML_FORMATTERS.X(date, count >= 5 ? 3 : 2, useUtc);
    }
};

export const getFormatter = function(format, dateParts) {
    return function(date) {
        let charIndex;
        let formatter;
        let char;
        let charCount = 0;
        const separator = '\'';
        let isEscaping = false;
        let isCurrentCharEqualsNext;
        let result = '';

        if(!date) return null;

        if(!format) return date;

        const useUtc = format[format.length - 1] === 'Z' || format.slice(-3) === '\'Z\'';

        for(charIndex = 0; charIndex < format.length; charIndex++) {
            char = format[charIndex];
            formatter = LDML_FORMATTERS[char];
            isCurrentCharEqualsNext = char === format[charIndex + 1];
            charCount++;

            if(!isCurrentCharEqualsNext) {
                if(formatter && !isEscaping) {
                    result += formatter(date, charCount, useUtc, dateParts);
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
};
