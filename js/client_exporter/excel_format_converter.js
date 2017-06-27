"use strict";

var commonUtils = require("../core/utils/common"),
    typeUtils = require("../core/utils/type"),
    stringUtils = require("../core/utils/string"),
    numberFormatter = require("../localization/number"),
    dateLocalization = require("../localization/date"),
    getLanguageID = require("../localization/language_codes").getLanguageId,
    UNSUPPORTED_FORMAT_MAPPING = {
        quarter: "shortDate",
        quarterAndYear: "shortDate",
        minute: "longTime",
        millisecond: "longTime"
    },
    FORMAT_SEPARATORS = " .,:;/\\<>()-",
    ARABIC_ZERO_CODE = 1632,
    DEFINED_NUMBER_FORMTATS = {
        thousands: "#,##0{0},&quot;K&quot;",
        millions: "#,##0{0},,&quot;M&quot;",
        billions: "#,##0{0},,,&quot;B&quot;",
        trillions: "#,##0{0},,,,&quot;T&quot;",
        percent: "0{0}%",
        decimal: "#{0}",
        "fixedpoint": "#,##0{0}",
        exponential: "0{0}E+00",
        currency: " "
    };

require("../localization/currency");

var excelFormatConverter = module.exports = {
    _applyPrecision: function(format, precision) {
        var result,
            i;

        if(precision > 0) {
            result = format !== "decimal" ? "." : "";
            for(i = 0; i < precision; i++) {
                result = result + "0";
            }

            return result;
        }
        return "";
    },

    _getCurrencyFormat: function(currency) {
        return numberFormatter.getOpenXmlCurrencyFormat(currency);
    },

    _isDigit: function(char) {
        var code = char && char.charCodeAt(0);

        return (char >= "0" && char <= "9") || (code >= ARABIC_ZERO_CODE && code < ARABIC_ZERO_CODE + 10);
    },

    _getDifference: function(defaultPattern, patterns, processedIndexes) {
        var i = 0,
            that = this,
            result = [],
            isDigit;

        var patternsFilter = function(pattern) {
            return defaultPattern[i] !== pattern[i];
        };

        if(!Array.isArray(patterns)) {
            patterns = [patterns];
        }

        for(i = 0; i < defaultPattern.length; i++) {
            if(processedIndexes.indexOf(i) < 0 && patterns.filter(patternsFilter).length) {
                do {
                    isDigit = that._isDigit(defaultPattern[i]);
                    if(!result.length && !isDigit && that._isDigit(patterns[0][i])) {
                        break;
                    }
                    result.push(i);
                    processedIndexes.unshift(i);
                    i++;
                } while(defaultPattern[i] && (FORMAT_SEPARATORS.indexOf(defaultPattern[i]) < 0 && (isDigit === that._isDigit(defaultPattern[i]))));
                break;
            }
        }

        if(result.length === 1 && (defaultPattern[processedIndexes[0] - 1] === "0" || defaultPattern[processedIndexes[0] - 1] === "٠")) {
            processedIndexes.unshift(processedIndexes[0] - 1);
        }

        return result;
    },

    _replaceCharsCore: function(pattern, indexes, char, patternPositions) {
        var baseCharIndex = indexes[0];
        var patternIndex = baseCharIndex < patternPositions.length ? patternPositions[baseCharIndex] : baseCharIndex;

        indexes.forEach(function(_, index) {
            pattern = pattern.substr(0, patternIndex + index) + (char.length > 1 ? char[index] : char) + pattern.substr(patternIndex + index + 1);
        });

        if(indexes.length === 1) {
            pattern = pattern.replace("0" + char, char + char);
            pattern = pattern.replace("٠" + char, char + char);
        }

        return pattern;
    },

    _replaceChars: function(pattern, indexes, char, patternPositions) {
        var i,
            index,
            patternIndex;

        if(!this._isDigit(pattern[indexes[0]] || "0")) {
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
                pattern = pattern.substr(0, patternIndex) + " " + pattern.substr(patternIndex);
            }
        }

        pattern = this._replaceCharsCore(pattern, indexes, char, patternPositions);

        return pattern;
    },

    _format: function(value, format) {
        if(Array.isArray(value)) {
            return value.map(function(value) {
                return (dateLocalization.format(value, format) || "").toString();
            });
        }
        return (dateLocalization.format(value, format) || "").toString();
    },

    _escapeChars: function(pattern, defaultPattern, processedIndexes, patternPositions) {
        var escapeIndexes = defaultPattern.split("").map(function(char, index) {
            if(processedIndexes.indexOf(index) < 0 && (FORMAT_SEPARATORS.indexOf(char) < 0 || char === "\/")) {
                return patternPositions[index];
            }
            return -1;
        });

        pattern = pattern.split("").map(function(char, index) {
            if(escapeIndexes.indexOf(index) >= 0) {
                return "\\" + char;
            }
            return char;
        }).join("");

        pattern = pattern.replace("AM\\/PM", "AM/PM");
        return pattern;
    },

    _hasArabicDigits: function(text) {
        var code;

        for(var i = 0; i < text.length; i++) {
            code = text.charCodeAt(i);
            if(code >= ARABIC_ZERO_CODE && code < ARABIC_ZERO_CODE + 10) {
                return true;
            }
        }
        return false;
    },

    _convertDateFormat: function(format) {
        format = UNSUPPORTED_FORMAT_MAPPING[format && format.type || format] || format;

        var that = this,
            processedIndexes = [],
            defaultPattern = that._format(new Date(2009, 8, 8, 6, 5, 4), format),
            patternPositions = defaultPattern.split("").map(function(_, index) { return index; }),
            result = defaultPattern,
            datePatterns = [
                { date: new Date(2009, 8, 8, 6, 5, 2), pattern: "s" },
                { date: new Date(2009, 8, 8, 6, 2, 4), pattern: "m" },
                { date: new Date(2009, 8, 8, 2, 5, 4), pattern: "H" },
                { date: new Date(2009, 8, 8, 18, 5, 4), pattern: "AM/PM" },
                { date: new Date(2009, 8, 1, 6, 5, 4), pattern: "d" },
                { date: [new Date(2009, 8, 2, 6, 5, 4), new Date(2009, 8, 3, 6, 5, 4), new Date(2009, 8, 4, 6, 5, 4)], pattern: "d" },
                { date: new Date(2009, 9, 6, 6, 5, 4), pattern: "M" },
                { date: new Date(1998, 8, 8, 6, 5, 4), pattern: "y" }];

        if(!result) return;

        datePatterns.forEach(function(test) {
            var diff = that._getDifference(defaultPattern, that._format(test.date, format), processedIndexes);

            result = that._replaceChars(result, diff, test.pattern, patternPositions);
        });

        result = that._escapeChars(result, defaultPattern, processedIndexes, patternPositions);

        result = that._getLanguageInfo(defaultPattern) + result;

        return result;
    },

    _getLanguageInfo: function(defaultPattern) {
        var languageID = getLanguageID(),
            languageIDStr = languageID ? languageID.toString(16) : "",
            languageInfo = "";

        if(this._hasArabicDigits(defaultPattern)) {
            while(languageIDStr.length < 3) {
                languageIDStr = "0" + languageIDStr;
            }
            languageInfo = "[$-2010" + languageIDStr + "]";
        } else if(languageIDStr) {
            languageInfo = "[$-" + languageIDStr + "]";
        }

        return languageInfo;
    },

    _convertNumberFormat: function(format, precision, currency) {
        var result,
            excelFormat = format === "currency" ? this._getCurrencyFormat(currency) : DEFINED_NUMBER_FORMTATS[format.toLowerCase()];

        if(excelFormat) {
            result = stringUtils.format(excelFormat, this._applyPrecision(format, precision));
        }

        return result;
    },

    convertFormat: function(format, precision, type, currency) {
        if(commonUtils.isDefined(format)) {
            if(type === "date") {
                return excelFormatConverter._convertDateFormat(format);
            } else {
                if(typeUtils.isString(format) && DEFINED_NUMBER_FORMTATS[format.toLowerCase()]) {
                    return excelFormatConverter._convertNumberFormat(format, precision, currency);
                }
            }
        }
    }
};
