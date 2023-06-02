import numberLocalization from '../number';

const ARABIC_COMMA = '\u060C';
const FORMAT_SEPARATORS = ' .,:;/\\<>()-[]' + ARABIC_COMMA;
const AM_PM_PATTERN = '. m.';

const checkDigit = function(char) {
    const code = char && numberLocalization.convertDigits(char, false).charCodeAt(0);
    const zeroCode = numberLocalization.convertDigits('0', false).charCodeAt(0);

    return zeroCode <= code && code < zeroCode + 10;
};

const checkPatternContinue = function(text, patterns, index, isDigit) {
    const char = text[index];
    const nextChar = text[index + 1];

    if(!isDigit) {
        if(char === '.' || (char === ' ' && text.slice(index - 1, index + 3) === AM_PM_PATTERN)) {
            return true;
        }
        if(char === '-' && !checkDigit(nextChar)) {
            return true;
        }
    }
    const isDigitChanged = isDigit && patterns.some(pattern => text[index] !== pattern[index]);
    return FORMAT_SEPARATORS.indexOf(char) < 0 && (isDigit === checkDigit(char) && (!isDigit || isDigitChanged));
};

const getPatternStartIndex = function(defaultPattern, index) {
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

const getDifference = function(defaultPattern, patterns, processedIndexes, isDigit) {
    let i = 0;
    const result = [];

    const patternsFilter = function(pattern) {
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
            } while(defaultPattern[i] && checkPatternContinue(defaultPattern, patterns, i, isDigit));
            break;
        }
    }

    if(result.length === 1 && (defaultPattern[processedIndexes[0] - 1] === '0' || defaultPattern[processedIndexes[0] - 1] === '٠')) {
        processedIndexes.unshift(processedIndexes[0] - 1);
    }

    return result;
};

const replaceCharsCore = function(pattern, indexes, char, patternPositions) {
    const baseCharIndex = indexes[0];
    const patternIndex = baseCharIndex < patternPositions.length ? patternPositions[baseCharIndex] : baseCharIndex;

    indexes.forEach(function(_, index) {
        pattern = pattern.substr(0, patternIndex + index) + (char.length > 1 ? char[index] : char) + pattern.substr(patternIndex + index + 1);
    });

    if(indexes.length === 1) {
        pattern = pattern.replace('0' + char, char + char);
        pattern = pattern.replace('٠' + char, char + char);
    }

    return pattern;
};

const replaceChars = function(pattern, indexes, char, patternPositions) {
    let i;
    let index;
    let patternIndex;

    if(!checkDigit(pattern[indexes[0]] || '0')) {
        const letterCount = Math.max(indexes.length <= 3 ? 3 : 4, char.length);

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

const formatValue = function(value, formatter) {
    if(Array.isArray(value)) {
        return value.map(function(value) {
            return (formatter(value) || '').toString();
        });
    }
    return (formatter(value) || '').toString();
};

const ESCAPE_CHARS_REGEXP = /[a-zA-Z]/g;

const escapeChars = function(pattern, defaultPattern, processedIndexes, patternPositions) {
    const escapeIndexes = defaultPattern.split('').map(function(char, index) {
        if(processedIndexes.indexOf(index) < 0 && (char.match(ESCAPE_CHARS_REGEXP) || char === '\'')) {
            return patternPositions[index];
        }
        return -1;
    });

    pattern = pattern.split('').map(function(char, index) {
        let result = char;
        const isCurrentCharEscaped = escapeIndexes.indexOf(index) >= 0;
        const isPrevCharEscaped = index > 0 && escapeIndexes.indexOf(index - 1) >= 0;
        const isNextCharEscaped = escapeIndexes.indexOf(index + 1) >= 0;

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

export const getFormat = function(formatter) {
    const processedIndexes = [];
    const defaultPattern = formatValue(new Date(2009, 8, 8, 6, 5, 4), formatter);
    const patternPositions = defaultPattern.split('').map(function(_, index) { return index; });
    let result = defaultPattern;
    const replacedPatterns = {};
    const datePatterns = [
        { date: new Date(2009, 8, 8, 6, 5, 4, 111), pattern: 'S' },
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
        const diff = getDifference(defaultPattern, formatValue(test.date, formatter), processedIndexes, test.isDigit);
        const pattern = test.pattern === 'M' && !replacedPatterns['d'] ? 'L' : test.pattern;

        result = replaceChars(result, diff, pattern, patternPositions);
        replacedPatterns[pattern] = diff.length;
    });

    result = escapeChars(result, defaultPattern, processedIndexes, patternPositions);

    if(processedIndexes.length) {
        return result;
    }
};
