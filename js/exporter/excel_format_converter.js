import stringUtils from "../core/utils/string";
import numberFormatter from "../localization/number";
import dateLocalization from "../localization/date";
import { isDefined, isString } from "../core/utils/type";
import { getFormat } from "../localization/ldml/date.format";
import { getLanguageId } from "../localization/language_codes";
import "../localization/currency";

const UNSUPPORTED_FORMAT_MAPPING = {
    quarter: "shortDate",
    quarterAndYear: "shortDate",
    minute: "longTime",
    millisecond: "longTime"
};
const ARABIC_ZERO_CODE = 1632;
const DEFINED_NUMBER_FORMTATS = {
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
const PERIOD_REGEXP = /a+/g;
const DAY_REGEXP = /E/g;
const DO_REGEXP = /dE+/g;
const STANDALONE_MONTH_REGEXP = /L/g;
const HOUR_REGEXP = /h/g;
const SLASH_REGEXP = /\//g;
const SQUARE_OPEN_BRACKET_REGEXP = /\[/g;
const SQUARE_CLOSE_BRACKET_REGEXP = /]/g;
const ANY_REGEXP = /./g;

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

    _convertDateFormat: function(format, isExcelJS) {
        if(!isExcelJS) {
            format = UNSUPPORTED_FORMAT_MAPPING[format && format.type || format] || format;
        }

        const formattedValue = (dateLocalization.format(new Date(2009, 8, 8, 6, 5, 4), format) || "").toString();
        let result = getFormat(value => dateLocalization.format(value, format));

        if(result) {
            result = this._convertDateFormatToOpenXml(result);
            result = this._getLanguageInfo(formattedValue) + result;
        }

        return result;
    },

    _getLanguageInfo: function(defaultPattern) {
        var languageID = getLanguageId(),
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
        let result,
            excelFormat;

        if(format === "currency") {
            excelFormat = numberFormatter.getOpenXmlCurrencyFormat(currency);
        } else {
            excelFormat = DEFINED_NUMBER_FORMTATS[format.toLowerCase()];
        }

        if(excelFormat) {
            result = stringUtils.format(excelFormat, this._applyPrecision(format, precision));
        }

        return result;
    },

    convertFormat: function(format, precision, type, currency, isExcelJS) {
        if(isDefined(format)) {
            if(type === "date") {
                return excelFormatConverter._convertDateFormat(format, isExcelJS);
            } else {
                if(isString(format) && DEFINED_NUMBER_FORMTATS[format.toLowerCase()]) {
                    return excelFormatConverter._convertNumberFormat(format, precision, currency);
                }
            }
        }
    }
};
