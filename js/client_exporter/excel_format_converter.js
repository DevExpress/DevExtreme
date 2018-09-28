var typeUtils = require("../core/utils/type"),
    stringUtils = require("../core/utils/string"),
    numberFormatter = require("../localization/number"),
    dateLocalization = require("../localization/date"),
    getDateLDMLFormat = require("../localization/ldml/date.format").getFormat,
    getLanguageID = require("../localization/language_codes").getLanguageId,
    UNSUPPORTED_FORMAT_MAPPING = {
        quarter: "shortDate",
        quarterAndYear: "shortDate",
        minute: "longTime",
        millisecond: "longTime"
    },
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

var PERIOD_REGEXP = /a+/g,
    DAY_REGEXP = /E/g,
    DO_REGEXP = /dE+/g,
    STANDALONE_MONTH_REGEXP = /L/g,
    HOUR_REGEXP = /h/g,
    SLASH_REGEXP = /\//g,
    SQUARE_OPEN_BRACKET_REGEXP = /\[/g,
    SQUARE_CLOSE_BRACKET_REGEXP = /]/g,
    ANY_REGEXP = /./g;

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

    _convertDateFormatToOpenXml: function(format) {
        return format.replace(SLASH_REGEXP, "\\/").split("'").map(function(datePart, index) {
            if(index % 2 === 0) {
                return datePart
                    .replace(PERIOD_REGEXP, "AM/PM")
                    .replace(DO_REGEXP, "d")
                    .replace(DAY_REGEXP, "d")
                    .replace(STANDALONE_MONTH_REGEXP, "M")
                    .replace(HOUR_REGEXP, "H")
                    .replace(SQUARE_OPEN_BRACKET_REGEXP, "\\[")
                    .replace(SQUARE_CLOSE_BRACKET_REGEXP, "\\]");
            } if(datePart) {
                return datePart.replace(ANY_REGEXP, "\\$&");
            }
            return "'";
        }).join("");
    },

    _convertDateFormat: function(format) {
        format = UNSUPPORTED_FORMAT_MAPPING[format && format.type || format] || format;

        var that = this,
            formattedValue = (dateLocalization.format(new Date(2009, 8, 8, 6, 5, 4), format) || "").toString(),
            result = getDateLDMLFormat(function(value) {
                return dateLocalization.format(value, format);
            });

        if(result) {
            result = that._convertDateFormatToOpenXml(result);
            result = that._getLanguageInfo(formattedValue) + result;
        }

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
        if(typeUtils.isDefined(format)) {
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
