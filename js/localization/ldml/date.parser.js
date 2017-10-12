"use strict";

var dateParts = require("../../core/utils/date_parts");

var FORMAT_TYPES = {
    "3": "abbreviated",
    "4": "wide",
    "5": "narrow"
};

var PATTERN_REGEXPS = {
    y: function(count) {
        return "[0-9]{" + count + ",}";
    },
    M: function(count) {
        if(count > 2) {
            return dateParts.getMonthNames(FORMAT_TYPES[count], "format").join("|");
        }
        return "0?[1-9]|1[012]";
    },
    L: function(count) {
        if(count > 2) {
            return dateParts.getMonthNames(FORMAT_TYPES[count], "standalone").join("|");
        }
        return "0?[1-9]|1[012]";
    },
    Q: function(count) {
        if(count > 2) {
            return dateParts.getQuarterNames(FORMAT_TYPES[count], "format").join("|");
        }
        return "0?[1-4]";
    },
    E: function(count) {
        return dateParts.getDayNames(FORMAT_TYPES[count < 3 ? 3 : count], "format").join("|");
    },
    a: function(count) {
        return dateParts.getPeriodNames(FORMAT_TYPES[count < 3 ? 3 : count], "format").join("|");
    },
    d: function(count) {
        return "0?[1-9]|[12][0-9]|3[01]";
    },
    H: function(count) {
        return "0?[0-9]|1[0-9]|2[0-3]";
    },
    h: function(count) {
        return "0?[1-9]|1[012]";
    },
    m: function(count) {
        return "0?[0-9]|[1-5][0-9]";
    },
    s: function(count) {
        return "0?[0-9]|[1-5][0-9]";
    },
    S: function(count) {
        return "[0-9]{1," + count + "}";
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
    L: function(text, count) {
        if(count > 2) {
            return dateParts.getMonthNames(FORMAT_TYPES[count], "standalone").indexOf(text);
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

var PATTERNS = ["y", "M", "d", "h", "m", "s", "S"];

var PATTERN_SETTERS = {
    y: "setFullYear",
    M: "setMonth",
    L: "setMonth",
    a: function(date, value) {
        var hours = date.getHours();
        if(!value && hours === 12) {
            date.setHours(0);
        } else if(value && hours !== 12) {
            date.setHours(hours + 12);
        }
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
    return str.replace(/[[\]{}()*+?.\\^$|\s]/g, "\\$&");
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
        isEscaping,
        patterns = [];

    format = escapeRegExp(format);

    for(var i = 0; i < format.length; i++) {
        var char = format[i],
            isEscapeChar = char === "'",
            regexpPart = PATTERN_REGEXPS[char];

        if(isEscapeChar) {
            isEscaping = !isEscaping;
            if(format[i - 1] !== "'") {
                continue;
            }
        }

        if(regexpPart && !isEscaping) {
            var count = getSameCharCount(format, i),
                pattern = createPattern(char, count);

            patterns.push(pattern);
            regexpText += "(" + regexpPart(count) + ")";
            i += count - 1;
        } else {
            regexpText += char;
        }
    }
    return {
        patterns: patterns,
        regexp: new RegExp("^" + regexpText + "$")
    };
};

var setPatternPart = function(date, pattern, text) {
    var patternChar = pattern[0],
        partSetter = PATTERN_SETTERS[patternChar],
        partParser = PATTERN_PARSERS[patternChar];

    if(partSetter && partParser) {
        var value = partParser(text, pattern.length);
        if(date[partSetter]) {
            date[partSetter](value);
        } else {
            partSetter(date, value);
        }
    }
};

var getParser = function(format) {
    var regExpInfo = getRegExpInfo(format);

    return function(text) {
        var regExpResult = regExpInfo.regexp.exec(text);

        if(regExpResult) {
            var now = new Date(),
                date = new Date(now.getFullYear(), 0, 1),
                assignedPatterns = ["y"];

            regExpInfo.patterns.forEach(function(pattern, index) {
                var partText = regExpResult[index + 1];
                setPatternPart(date, pattern, partText);
                pattern = pattern[0];
                if(pattern === "H") pattern = "h";
                var patternIndex = PATTERNS.indexOf(pattern) - 1;
                while(patternIndex >= 0) {
                    assignedPatterns.push(pattern);
                    pattern = PATTERNS[patternIndex];
                    if(assignedPatterns.indexOf(pattern) < 0) {
                        var setterName = PATTERN_SETTERS[pattern],
                            getterName = "g" + setterName.substr(1);

                        date[setterName](now[getterName]());
                    }
                    patternIndex--;
                }
            });
            return date;
        }

        return null;
    };
};

exports.getParser = getParser;
