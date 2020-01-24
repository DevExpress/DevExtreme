const escapeRegExp = require('../../core/utils/common').escapeRegExp;

const FORMAT_TYPES = {
    '3': 'abbreviated',
    '4': 'wide',
    '5': 'narrow'
};

const monthRegExpGenerator = function(count, dateParts) {
    if(count > 2) {
        return Object.keys(FORMAT_TYPES).map(function(count) {
            return ['format', 'standalone'].map(function(type) {
                return dateParts.getMonthNames(FORMAT_TYPES[count], type).join('|');
            }).join('|');
        }).join('|');
    }
    return '0?[1-9]|1[012]';
};

const PATTERN_REGEXPS = {
    y: function(count) {
        return '[0-9]+';
    },
    M: monthRegExpGenerator,
    L: monthRegExpGenerator,
    Q: function(count, dateParts) {
        if(count > 2) {
            return dateParts.getQuarterNames(FORMAT_TYPES[count], 'format').join('|');
        }
        return '0?[1-4]';
    },
    E: function(count, dateParts) {
        return '\\D*';
    },
    a: function(count, dateParts) {
        return dateParts.getPeriodNames(FORMAT_TYPES[count < 3 ? 3 : count], 'format').join('|');
    },
    d: function(count) {
        return '0?[1-9]|[12][0-9]|3[01]';
    },
    H: function(count) {
        return '0?[0-9]|1[0-9]|2[0-3]';
    },
    h: function(count) {
        return '0?[1-9]|1[012]';
    },
    m: function(count) {
        return '0?[0-9]|[1-5][0-9]';
    },
    s: function(count) {
        return '0?[0-9]|[1-5][0-9]';
    },
    S: function(count) {
        return '[0-9]{1,' + count + '}';
    }
};

const parseNumber = Number;

const caseInsensitiveIndexOf = function(array, value) {
    return array.map((item) => item.toLowerCase()).indexOf(value.toLowerCase());
};

const monthPatternParser = function(text, count, dateParts) {
    if(count > 2) {
        return ['format', 'standalone'].map(function(type) {
            return Object.keys(FORMAT_TYPES).map(function(count) {
                const monthNames = dateParts.getMonthNames(FORMAT_TYPES[count], type);
                return caseInsensitiveIndexOf(monthNames, text);
            });
        }).reduce(function(a, b) {
            return a.concat(b);
        }).filter(function(index) {
            return index >= 0;
        })[0];
    }
    return parseNumber(text) - 1;
};

const PATTERN_PARSERS = {
    y: function(text, count) {
        const year = parseNumber(text);
        if(count === 2) {
            return year < 30 ? 2000 + year : 1900 + year;
        }
        return year;
    },
    M: monthPatternParser,
    L: monthPatternParser,
    Q: function(text, count, dateParts) {
        if(count > 2) {
            return dateParts.getQuarterNames(FORMAT_TYPES[count], 'format').indexOf(text);
        }
        return parseNumber(text) - 1;
    },
    E: function(text, count, dateParts) {
        const dayNames = dateParts.getDayNames(FORMAT_TYPES[count < 3 ? 3 : count], 'format');
        return caseInsensitiveIndexOf(dayNames, text);
    },
    a: function(text, count, dateParts) {
        const periodNames = dateParts.getPeriodNames(FORMAT_TYPES[count < 3 ? 3 : count], 'format');
        return caseInsensitiveIndexOf(periodNames, text);
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
            text = text + '0';
            count++;
        }
        return parseNumber(text);
    }
};

const ORDERED_PATTERNS = ['y', 'M', 'd', 'h', 'm', 's', 'S'];
const PATTERN_SETTERS = {
    y: 'setFullYear',
    M: 'setMonth',
    L: 'setMonth',
    a: function(date, value) {
        const hours = date.getHours();
        if(!value && hours === 12) {
            date.setHours(0);
        } else if(value && hours !== 12) {
            date.setHours(hours + 12);
        }
    },
    d: 'setDate',
    H: 'setHours',
    h: 'setHours',
    m: 'setMinutes',
    s: 'setSeconds',
    S: 'setMilliseconds'
};

const getSameCharCount = function(text, index) {
    const char = text[index];
    let count = 0;

    do {
        index++;
        count++;
    } while(text[index] === char);

    return count;
};

const createPattern = function(char, count) {
    let result = '';
    for(let i = 0; i < count; i++) {
        result += char;
    }
    return result;
};

const getRegExpInfo = function(format, dateParts) {
    let regexpText = '';
    let stubText = '';
    let isEscaping;
    const patterns = [];

    const addPreviousStub = function() {
        if(stubText) {
            patterns.push('\'' + stubText + '\'');
            regexpText += escapeRegExp(stubText) + ')';
            stubText = '';
        }
    };

    for(let i = 0; i < format.length; i++) {
        const char = format[i];
        const isEscapeChar = char === '\'';
        const regexpPart = PATTERN_REGEXPS[char];

        if(isEscapeChar) {
            isEscaping = !isEscaping;
            if(format[i - 1] !== '\'') {
                continue;
            }
        }

        if(regexpPart && !isEscaping) {
            const count = getSameCharCount(format, i);
            const pattern = createPattern(char, count);

            addPreviousStub();
            patterns.push(pattern);

            regexpText += '(' + regexpPart(count, dateParts) + ')';
            i += count - 1;
        } else {
            if(!stubText) {
                regexpText += '(';
            }
            stubText += char;
        }
    }

    addPreviousStub();

    return {
        patterns: patterns,
        regexp: new RegExp('^' + regexpText + '$', 'i')
    };
};

const getPatternSetters = function() {
    return PATTERN_SETTERS;
};

const setPatternPart = function(date, pattern, text, dateParts) {
    const patternChar = pattern[0];
    const partSetter = PATTERN_SETTERS[patternChar];
    const partParser = PATTERN_PARSERS[patternChar];

    if(partSetter && partParser) {
        const value = partParser(text, pattern.length, dateParts);
        if(date[partSetter]) {
            date[partSetter](value);
        } else {
            partSetter(date, value);
        }
    }
};

const setPatternPartFromNow = function(date, pattern, now) {
    const setterName = PATTERN_SETTERS[pattern];
    const getterName = 'g' + setterName.substr(1);

    date[setterName](now[getterName]());
};

const getShortPatterns = function(fullPatterns) {
    return fullPatterns.map(function(pattern) {
        if(pattern[0] === '\'') {
            return '';
        } else {
            return pattern[0] === 'H' ? 'h' : pattern[0];
        }
    });
};

const getMaxOrderedPatternIndex = function(patterns) {
    const indexes = patterns.map(function(pattern) {
        return ORDERED_PATTERNS.indexOf(pattern);
    });

    return Math.max.apply(Math, indexes);
};

const getOrderedFormatPatterns = function(formatPatterns) {
    const otherPatterns = formatPatterns.filter(function(pattern) {
        return ORDERED_PATTERNS.indexOf(pattern) < 0;
    });

    return ORDERED_PATTERNS.concat(otherPatterns);
};

const getParser = function(format, dateParts) {
    const regExpInfo = getRegExpInfo(format, dateParts);

    return function(text) {
        const regExpResult = regExpInfo.regexp.exec(text);

        if(regExpResult) {
            const now = new Date();
            const date = new Date(now.getFullYear(), 0, 1);
            const formatPatterns = getShortPatterns(regExpInfo.patterns);
            const maxPatternIndex = getMaxOrderedPatternIndex(formatPatterns);
            const orderedFormatPatterns = getOrderedFormatPatterns(formatPatterns);

            orderedFormatPatterns.forEach(function(pattern, index) {
                if(!pattern || (index < ORDERED_PATTERNS.length && index > maxPatternIndex)) {
                    return;
                }

                const patternIndex = formatPatterns.indexOf(pattern);
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
