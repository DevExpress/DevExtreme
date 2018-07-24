"use strict";

var escapeRegExp = require("../../core/utils/common").escapeRegExp;

var FORMAT_TYPES = {
    "3": "abbreviated",
    "4": "wide",
    "5": "narrow"
};

var monthRegExpGenerator = function(count, dateParts) {
    if(count > 2) {
        return Object.keys(FORMAT_TYPES).map(function(count) {
            return ["format", "standalone"].map(function(type) {
                return dateParts.getMonthNames(FORMAT_TYPES[count], type).join("|");
            }).join("|");
        }).join("|");
    }
    return "0?[1-9]|1[012]";
};

var PATTERN_REGEXPS = {
    y: function(count) {
        return "[0-9]+";
    },
    M: monthRegExpGenerator,
    L: monthRegExpGenerator,
    Q: function(count, dateParts) {
        if(count > 2) {
            return dateParts.getQuarterNames(FORMAT_TYPES[count], "format").join("|");
        }
        return "0?[1-4]";
    },
    E: function(count, dateParts) {
        return "\\D*";
    },
    a: function(count, dateParts) {
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

var monthPatternParser = function(text, count, dateParts) {
    if(count > 2) {
        return ["format", "standalone"].map(function(type) {
            return Object.keys(FORMAT_TYPES).map(function(count) {
                return dateParts.getMonthNames(FORMAT_TYPES[count], type).indexOf(text);
            });
        }).reduce(function(a, b) {
            return a.concat(b);
        }).filter(function(index) {
            return index >= 0;
        })[0];
    }
    return parseNumber(text) - 1;
};

var PATTERN_PARSERS = {
    y: function(text, count) {
        var year = parseNumber(text);
        if(count === 2) {
            return year < 30 ? 2000 + year : 1900 + year;
        }
        return year;
    },
    M: monthPatternParser,
    L: monthPatternParser,
    Q: function(text, count, dateParts) {
        if(count > 2) {
            return dateParts.getQuarterNames(FORMAT_TYPES[count], "format").indexOf(text);
        }
        return parseNumber(text) - 1;
    },
    E: function(text, count, dateParts) {
        return dateParts.getDayNames(FORMAT_TYPES[count < 3 ? 3 : count], "format").indexOf(text);
    },
    a: function(text, count, dateParts) {
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

var ORDERED_PATTERNS = ["y", "M", "d", "h", "m", "s", "S"];
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

var createPattern = function(char, count) {
    var result = "";
    for(var i = 0; i < count; i++) {
        result += char;
    }
    return result;
};

var getRegExpInfo = function(format, dateParts) {
    var regexpText = "",
        isEscaping,
        patterns = [];

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
            regexpText += "(" + regexpPart(count, dateParts) + ")";
            i += count - 1;
        } else {
            char = escapeRegExp(char);
            patterns.push(char);
            regexpText += "(" + char + ")";
        }
    }
    return {
        patterns: patterns,
        regexp: new RegExp("^" + regexpText + "$")
    };
};

var getPatternSetters = function() {
    return PATTERN_SETTERS;
};

var setPatternPart = function(date, pattern, text, dateParts) {
    var patternChar = pattern[0],
        partSetter = PATTERN_SETTERS[patternChar],
        partParser = PATTERN_PARSERS[patternChar];

    if(partSetter && partParser) {
        var value = partParser(text, pattern.length, dateParts);
        if(date[partSetter]) {
            date[partSetter](value);
        } else {
            partSetter(date, value);
        }
    }
};

var setPatternPartFromNow = function(date, pattern, now) {
    var setterName = PATTERN_SETTERS[pattern],
        getterName = "g" + setterName.substr(1);

    date[setterName](now[getterName]());
};

var getShortPatterns = function(fullPatterns) {
    return fullPatterns.map(function(pattern) {
        return pattern[0] === "H" ? "h" : pattern[0];
    });
};

var getMaxOrderedPatternIndex = function(patterns) {
    var indexes = patterns.map(function(pattern) {
        return ORDERED_PATTERNS.indexOf(pattern);
    });

    return Math.max.apply(Math, indexes);
};

var getOrderedFormatPatterns = function(formatPatterns) {
    var otherPatterns = formatPatterns.filter(function(pattern) {
        return ORDERED_PATTERNS.indexOf(pattern) < 0;
    });

    return ORDERED_PATTERNS.concat(otherPatterns);
};

var getParser = function(format, dateParts) {
    var regExpInfo = getRegExpInfo(format, dateParts);

    return function(text) {
        var regExpResult = regExpInfo.regexp.exec(text);

        if(regExpResult) {
            var now = new Date(),
                date = new Date(now.getFullYear(), 0, 1),
                formatPatterns = getShortPatterns(regExpInfo.patterns),
                maxPatternIndex = getMaxOrderedPatternIndex(formatPatterns),
                orderedFormatPatterns = getOrderedFormatPatterns(formatPatterns);

            orderedFormatPatterns.forEach(function(pattern, index) {
                if(index < ORDERED_PATTERNS.length && index > maxPatternIndex) return;

                var patternIndex = formatPatterns.indexOf(pattern);
                if(patternIndex >= 0) {
                    setPatternPart(date, regExpInfo.patterns[patternIndex], regExpResult[patternIndex + 1], dateParts);
                } else {
                    setPatternPartFromNow(date, pattern, now);
                }
            });

            return date;
        }

        return null;
    };
};

exports.getParser = getParser;
exports.getRegExpInfo = getRegExpInfo;
exports.getPatternSetters = getPatternSetters;
