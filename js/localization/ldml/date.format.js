var ARABIC_COMMA = '\u060C',
    FORMAT_SEPARATORS = ' .,:;/\\<>()-[]' + ARABIC_COMMA,
    ARABIC_ZERO_CODE = 1632;

var checkDigit = function(char) {
    var code = char && char.charCodeAt(0);

    return (char >= '0' && char <= '9') || (code >= ARABIC_ZERO_CODE && code < ARABIC_ZERO_CODE + 10);
};

var checkPatternContinue = function(text, index, isDigit) {
    var char = text[index],
        prevChar = text[index - 1],
        nextChar = text[index + 1];

    if(!isDigit) {
        if(char === '.' || (char === ' ' && prevChar === '.')) {
            return true;
        }
        if(char === '-' && !checkDigit(nextChar)) {
            return true;
        }
    }
    return FORMAT_SEPARATORS.indexOf(char) < 0 && (isDigit === checkDigit(char));
};

var getPatternStartIndex = function(defaultPattern, index) {
    if(!checkDigit(defaultPattern[index])) {
        while(index > 0
            && !checkDigit(defaultPattern[index - 1])
            && (defaultPattern[index - 1] === '.'
            || FORMAT_SEPARATORS.indexOf(defaultPattern[index - 1]) < 0)) {
            index--;
        }
    }
    return index;
};

var getDifference = function(defaultPattern, patterns, processedIndexes, isDigit) {
    var i = 0,
        result = [];

    var patternsFilter = function(pattern) {
        return defaultPattern[i] !== pattern[i] && (isDigit === undefined || checkDigit(defaultPattern[i]) === isDigit);
    };

    if(!Array.isArray(patterns)) {
        patterns = [patterns];
    }

    for(i = 0; i < defaultPattern.length; i++) {
        if(processedIndexes.indexOf(i) < 0 && patterns.filter(patternsFilter).length) {
            i = getPatternStartIndex(defaultPattern, i);
            do {
                isDigit = checkDigit(defaultPattern[i]);
                if(!result.length && !isDigit && checkDigit(patterns[0][i])) {
                    break;
                }
                result.push(i);
                processedIndexes.unshift(i);
                i++;
            } while(defaultPattern[i] && checkPatternContinue(defaultPattern, i, isDigit));
            break;
        }
    }

    if(result.length === 1 && (defaultPattern[processedIndexes[0] - 1] === '0' || defaultPattern[processedIndexes[0] - 1] === '٠')) {
        processedIndexes.unshift(processedIndexes[0] - 1);
    }

    return result;
};

var replaceCharsCore = function(pattern, indexes, char, patternPositions) {
    var baseCharIndex = indexes[0];
    var patternIndex = baseCharIndex < patternPositions.length ? patternPositions[baseCharIndex] : baseCharIndex;

    indexes.forEach(function(_, index) {
        pattern = pattern.substr(0, patternIndex + index) + (char.length > 1 ? char[index] : char) + pattern.substr(patternIndex + index + 1);
    });

    if(indexes.length === 1) {
        pattern = pattern.replace('0' + char, char + char);
        pattern = pattern.replace('٠' + char, char + char);
    }

    return pattern;
};

var replaceChars = function(pattern, indexes, char, patternPositions) {
    var i,
        index,
        patternIndex;

    if(!checkDigit(pattern[indexes[0]] || '0')) {
        var letterCount = Math.max(indexes.length <= 3 ? 3 : 4, char.length);

        while(indexes.length > letterCount) {
            index = indexes.pop();
            patternIndex = patternPositions[index];

            patternPositions[index] = -1;
            for(i = index + 1; i < patternPositions.length; i++) {
                patternPositions[i]--;
            }
            pattern = pattern.substr(0, patternIndex) + pattern.substr(patternIndex + 1);
        }

        index = indexes[indexes.length - 1] + 1,
        patternIndex = index < patternPositions.length ? patternPositions[index] : index;

        while(indexes.length < letterCount) {

            indexes.push(indexes[indexes.length - 1] + 1);
            for(i = index; i < patternPositions.length; i++) {
                patternPositions[i]++;
            }
            pattern = pattern.substr(0, patternIndex) + ' ' + pattern.substr(patternIndex);
        }
    }

    pattern = replaceCharsCore(pattern, indexes, char, patternPositions);

    return pattern;
};

var formatValue = function(value, formatter) {
    if(Array.isArray(value)) {
        return value.map(function(value) {
            return (formatter(value) || '').toString();
        });
    }
    return (formatter(value) || '').toString();
};

var ESCAPE_CHARS_REGEXP = /[a-zA-Z]/g;

var escapeChars = function(pattern, defaultPattern, processedIndexes, patternPositions) {
    var escapeIndexes = defaultPattern.split('').map(function(char, index) {
        if(processedIndexes.indexOf(index) < 0 && (char.match(ESCAPE_CHARS_REGEXP) || char === '\'')) {
            return patternPositions[index];
        }
        return -1;
    });

    pattern = pattern.split('').map(function(char, index) {
        var result = char,
            isCurrentCharEscaped = escapeIndexes.indexOf(index) >= 0,
            isPrevCharEscaped = index > 0 && escapeIndexes.indexOf(index - 1) >= 0,
            isNextCharEscaped = escapeIndexes.indexOf(index + 1) >= 0;

        if(isCurrentCharEscaped) {
            if(!isPrevCharEscaped) {
                result = '\'' + result;
            }
            if(!isNextCharEscaped) {
                result = result + '\'';
            }
        }

        return result;
    }).join('');

    return pattern;
};

var getFormat = function(formatter) {
    var processedIndexes = [],
        defaultPattern = formatValue(new Date(2009, 8, 8, 6, 5, 4), formatter),
        patternPositions = defaultPattern.split('').map(function(_, index) { return index; }),
        result = defaultPattern,
        replacedPatterns = {},
        datePatterns = [
            { date: new Date(2009, 8, 8, 6, 5, 4, 100), pattern: 'S' },
            { date: new Date(2009, 8, 8, 6, 5, 2), pattern: 's' },
            { date: new Date(2009, 8, 8, 6, 2, 4), pattern: 'm' },
            { date: new Date(2009, 8, 8, 18, 5, 4), pattern: 'H', isDigit: true },
            { date: new Date(2009, 8, 8, 2, 5, 4), pattern: 'h', isDigit: true },
            { date: new Date(2009, 8, 8, 18, 5, 4), pattern: 'a', isDigit: false },
            { date: new Date(2009, 8, 1, 6, 5, 4), pattern: 'd' },
            { date: [new Date(2009, 8, 2, 6, 5, 4), new Date(2009, 8, 3, 6, 5, 4), new Date(2009, 8, 4, 6, 5, 4)], pattern: 'E' },
            { date: new Date(2009, 9, 6, 6, 5, 4), pattern: 'M' },
            { date: new Date(1998, 8, 8, 6, 5, 4), pattern: 'y' }];

    if(!result) return;

    datePatterns.forEach(function(test) {
        var diff = getDifference(defaultPattern, formatValue(test.date, formatter), processedIndexes, test.isDigit),
            pattern = test.pattern === 'M' && !replacedPatterns['d'] ? 'L' : test.pattern;

        result = replaceChars(result, diff, pattern, patternPositions);
        replacedPatterns[pattern] = diff.length;
    });

    result = escapeChars(result, defaultPattern, processedIndexes, patternPositions);

    if(processedIndexes.length) {
        return result;
    }
};

exports.getFormat = getFormat;
