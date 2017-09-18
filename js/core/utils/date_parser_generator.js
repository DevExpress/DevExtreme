"use strict";

var dateParts = require("./date_parts");

var FORMAT_TYPES = {
    "3": "abbreviated",
    "4": "wide",
    "5": "narrow"
};

var PATTERN_REGEXPS = {
    y: function(count) {
        return "[0-9]{" + count + "}";
    },
    M: function(count) {
        if(count > 2) {
            return dateParts.getMonthNames(FORMAT_TYPES[count], "format").join("|");
        }
        return (count === 1 ? "" : "0") + "[1-9]|1[012]";
    },
    Q: function(count) {
        if(count > 2) {
            return dateParts.getQuarterNames(FORMAT_TYPES[count], "format").join("|");
        }
        return (count === 1 ? "" : "0") + "[1-4]";
    },
    E: function(count) {
        return dateParts.getDayNames(FORMAT_TYPES[count < 3 ? 3 : count], "format").join("|");
    },
    a: function(count) {
        return dateParts.getPeriodNames(FORMAT_TYPES[count < 3 ? 3 : count], "format").join("|");
    },
    d: function(count) {
        return (count === 1 ? "" : "0") + "[1-9]|[12][0-9]|3[01]";
    },
    H: function(count) {
        return (count === 1 ? "" : "0") + "[1-9]|1[0-9]|2[0-3]";
    },
    h: function(count) {
        return (count === 1 ? "" : "0") + "[1-9]|1[012]";
    },
    m: function(count) {
        return (count === 1 ? "" : "0") + "[1-9]|[1-5][0-9]";
    },
    s: function(count) {
        return (count === 1 ? "" : "0") + "[1-9]|[1-5][0-9]";
    },
    S: function(count) {
        return "[0-9]{" + count + "}";
    }
};

var parseNumber = Number;

var PATTERN_PARSERS = {
    y: function(text, count) {
        var year = parseNumber(text);
        if(count === 2) {
            return year < 30 ? 2000 + year : 1900 + year;
        }
        return year;
    },
    M: function(text, count) {
        if(count > 2) {
            return dateParts.getMonthNames(FORMAT_TYPES[count], "format").indexOf(text);
        }
        return parseNumber(text) - 1;
    },
    Q: function(text, count) {
        if(count > 2) {
            return dateParts.getQuarterNames(FORMAT_TYPES[count], "format").indexOf(text);
        }
        return parseNumber(text) - 1;
    },
    E: function(text, count) {
        return dateParts.getDayNames(FORMAT_TYPES[count < 3 ? 3 : count], "format").indexOf(text);
    },
    a: function(text, count) {
        return dateParts.getPeriodNames(FORMAT_TYPES[count < 3 ? 3 : count], "format").indexOf(text);
    },
    d: parseNumber,
    H: parseNumber,
    h: parseNumber,
    m: parseNumber,
    s: parseNumber,
    S: function(text, count) {
        count = Math.max(count, 3);
        text = text.slice(0, 3);
        while(count < 3) {
            text = text + "0";
            count++;
        }
        return parseNumber(text);
    }
};

var PATTERN_SETTERS = {
    y: "setFullYear",
    M: "setMonth",
    a: function(text, count) {
        //return dateParts.getPeriodNames(FORMAT_TYPES[count < 3 ? 3 : count], "format").indexOf(text);
    },
    d: "setDate",
    H: "setHours",
    h: "setHours",
    m: "setMinutes",
    s: "setSeconds",
    S: "setMilliseconds"
};

var getSameCharCount = function(text, index) {
    var char = text[index],
        count = 0;

    do {
        index++;
        count++;
    } while(text[index] === char);

    return count;
};

var escapeRegExp = function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

var createPattern = function(char, count) {
    var result = "";
    for(var i = 0; i < count; i++) {
        result += char;
    }
    return result;
};

var getRegExpInfo = function(format) {
    var regexpText = "",
        patterns = [];

    format = escapeRegExp(format);

    for(var i = 0; i < format.length; i++) {
        var char = format[i],
            regexpPart = PATTERN_REGEXPS[char];

        if(regexpPart) {
            var count = getSameCharCount(format, i),
                pattern = createPattern(char, count);

            patterns.push(pattern);
            regexpText += "(" + regexpPart(count) + ")";
            i += count - 1;
        } else {
            regexpText += format[i];
        }
    }
    return {
        patterns: patterns,
        regexp: new RegExp("^" + regexpText + "$", "g")
    };
};

var setPatternPart = function(date, pattern, text) {
    var patternChar = pattern[0],
        partSetter = PATTERN_SETTERS[patternChar],
        partParser = PATTERN_PARSERS[patternChar];

    if(partSetter && partParser) {
        var value = partParser(text, pattern.length);
        date[partSetter](value);
    }
};

var generateDateParser = function(format) {
    var regExpInfo = getRegExpInfo(format);

    return function(text) {
        var regExpResult = regExpInfo.regexp.exec(text);

        if(regExpResult) {
            var date = new Date(new Date().getFullYear(), 0, 1);
            regExpInfo.patterns.forEach(function(pattern, index) {
                var partText = regExpResult[index + 1];
                setPatternPart(date, pattern, partText);
            });
            return date;
        }

        return null;
    };
};

exports.generateDateParser = generateDateParser;
