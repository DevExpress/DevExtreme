var dependencyInjector = require("../core/utils/dependency_injector"),
    inArray = require("../core/utils/array").inArray,
    escapeRegExp = require("../core/utils/common").escapeRegExp,
    each = require("../core/utils/iterator").each,
    isPlainObject = require("../core/utils/type").isPlainObject,
    ldmlNumber = require("./ldml/number"),
    config = require("../core/config"),
    errors = require("../core/errors"),
    toFixed = require("./utils").toFixed;

var MAX_LARGE_NUMBER_POWER = 4,
    DECIMAL_BASE = 10;

var NUMERIC_FORMATS = ["currency", "fixedpoint", "exponential", "percent", "decimal"];

var LargeNumberFormatPostfixes = {
    1: 'K', // kilo
    2: 'M', // mega
    3: 'B', // billions
    4: 'T' // tera
};

var LargeNumberFormatPowers = {
    "largenumber": 'auto',
    "thousands": 1,
    "millions": 2,
    "billions": 3,
    "trillions": 4
};

var numberLocalization = dependencyInjector({
    numericFormats: NUMERIC_FORMATS,

    defaultLargeNumberFormatPostfixes: LargeNumberFormatPostfixes,

    _parseNumberFormatString: function(formatType) {
        var formatList,
            formatObject = {};

        if(!formatType || typeof formatType !== 'string') return;

        formatList = formatType.toLowerCase().split(' ');
        each(formatList, function(index, value) {
            if(inArray(value, NUMERIC_FORMATS) > -1) {
                formatObject.formatType = value;
            } else if(value in LargeNumberFormatPowers) {
                formatObject.power = LargeNumberFormatPowers[value];
            }
        });

        if(formatObject.power && !formatObject.formatType) {
            formatObject.formatType = 'fixedpoint';
        }

        if(formatObject.formatType) {
            return formatObject;
        }
    },

    _calculateNumberPower: function(value, base, minPower, maxPower) {
        var number = Math.abs(value),
            power = 0;

        if(number > 1) {
            while(number && number >= base && (maxPower === undefined || power < maxPower)) {
                power++;
                number = number / base;
            }
        } else if(number > 0 && number < 1) {
            while(number < 1 && (minPower === undefined || power > minPower)) {
                power--;
                number = number * base;
            }
        }

        return power;
    },
    _getNumberByPower: function(number, power, base) {
        var result = number;

        while(power > 0) {
            result = result / base;
            power--;
        }

        while(power < 0) {
            result = result * base;
            power++;
        }

        return result;
    },
    _formatNumber: function(value, formatObject, formatConfig) {
        var powerPostfix;
        var result;

        if(formatObject.power === 'auto') {
            formatObject.power = this._calculateNumberPower(value, 1000, 0, MAX_LARGE_NUMBER_POWER);
        }

        if(formatObject.power) {
            value = this._getNumberByPower(value, formatObject.power, 1000);
        }

        powerPostfix = this.defaultLargeNumberFormatPostfixes[formatObject.power] || '';

        result = this._formatNumberCore(value, formatObject.formatType, formatConfig);

        result = result.replace(/(\d|.$)(\D*)$/, "$1" + powerPostfix + "$2");

        return result;
    },

    _formatNumberExponential: function(value, formatConfig) {
        var power = this._calculateNumberPower(value, DECIMAL_BASE),
            number = this._getNumberByPower(value, power, DECIMAL_BASE),
            powString;

        if(formatConfig.precision === undefined) {
            formatConfig.precision = 1;
        }

        if(number.toFixed(formatConfig.precision || 0) >= DECIMAL_BASE) {
            power++;
            number = number / DECIMAL_BASE;
        }

        powString = (power >= 0 ? '+' : '') + power.toString();

        return this._formatNumberCore(number, 'fixedpoint', formatConfig) + 'E' + powString;
    },

    _addZeroes: function(value, precision) {
        var multiplier = Math.pow(10, precision);
        var sign = value < 0 ? "-" : "";

        value = ((Math.abs(value) * multiplier) >>> 0) / multiplier;

        var result = value.toString();
        while(result.length < precision) {
            result = "0" + result;
        }

        return sign + result;
    },

    _addGroupSeparators: function(value) {
        var parts = value.toString().split(".");

        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, config().thousandsSeparator) + (parts[1] ? config().decimalSeparator + parts[1] : "");
    },

    _formatNumberCore: function(value, format, formatConfig) {
        if(format === 'exponential') {
            return this._formatNumberExponential(value, formatConfig);
        }

        if(format !== "decimal" && formatConfig.precision !== null) {
            formatConfig.precision = formatConfig.precision || 0;
        }

        if(format === "percent") {
            value = value * 100;
        }

        if(formatConfig.precision !== undefined) {
            if(format === "decimal") {
                value = this._addZeroes(value, formatConfig.precision);
            } else {
                value = formatConfig.precision === null ? value.toPrecision() : toFixed(value, formatConfig.precision);
            }
        }

        if(format !== "decimal") {
            value = this._addGroupSeparators(value);
        } else {
            value = value.toString().replace(".", config().decimalSeparator);
        }

        if(format === "percent") {
            value += "%";
        }

        return value;
    },

    _normalizeFormat: function(format) {
        if(!format) {
            return {};
        }

        if(typeof (format) === "function") {
            return format;
        }

        if(!isPlainObject(format)) {
            format = {
                type: format
            };
        }

        return format;
    },

    _getSeparators: function() {
        return {
            decimalSeparator: this.getDecimalSeparator(),
            thousandsSeparator: this.getThousandsSeparator()
        };
    },

    getThousandsSeparator: function() {
        return this.format(10000, "fixedPoint")[2];
    },

    getDecimalSeparator: function() {
        return this.format(1.2, { type: "fixedPoint", precision: 1 })[1];
    },

    convertDigits: function(value, toStandard) {
        var digits = this.format(90, "decimal");

        if(typeof value !== "string" || digits[1] === "0") {
            return value;
        }

        var fromFirstDigit = toStandard ? digits[1] : "0",
            toFirstDigit = toStandard ? "0" : digits[1],
            fromLastDigit = toStandard ? digits[0] : "9",
            regExp = new RegExp("[" + fromFirstDigit + "-" + fromLastDigit + "]", "g");

        return value.replace(regExp, function(char) {
            return String.fromCharCode(char.charCodeAt(0) + (toFirstDigit.charCodeAt(0) - fromFirstDigit.charCodeAt(0)));
        });
    },

    getSign: function(text, format) {
        if(text.replace(/[^0-9-]/g, "").charAt(0) === "-") {
            return -1;
        }
        if(!format) {
            return 1;
        }

        var separators = this._getSeparators(),
            regExp = new RegExp("[0-9" + escapeRegExp(separators.decimalSeparator + separators.thousandsSeparator) + "]+", "g"),
            negativeEtalon = this.format(-1, format).replace(regExp, "1"),
            cleanedText = text.replace(regExp, "1");

        return cleanedText === negativeEtalon ? -1 : 1;
    },

    format: function(value, format) {
        if(typeof value !== "number") {
            return value;
        }

        if(typeof format === "number") {
            return value;
        }

        format = format && format.formatter || format;

        if(typeof format === "function") {
            return format(value);
        }

        format = this._normalizeFormat(format);

        if(!format.type) {
            format.type = "decimal";
        }

        var numberConfig = this._parseNumberFormatString(format.type);

        if(!numberConfig) {
            return this.convertDigits(ldmlNumber.getFormatter(format.type, this._getSeparators())(value));
        }

        return this._formatNumber(value, numberConfig, format);
    },

    parse: function(text, format) {
        if(!text) {
            return;
        }

        if(format && format.parser) {
            return format.parser(text);
        }

        text = this.convertDigits(text, true);

        if(format && typeof format !== "string") {
            errors.log("W0011");
        }

        var decimalSeparator = this.getDecimalSeparator(),
            regExp = new RegExp("[^0-9" + escapeRegExp(decimalSeparator) + "]", "g"),
            cleanedText = text
                .replace(regExp, "")
                .replace(decimalSeparator, ".")
                .replace(/\.$/g, "");

        if(cleanedText === "." || cleanedText === "") {
            return null;
        }

        if(this._calcSignificantDigits(cleanedText) > 15) {
            return NaN;
        }

        const parsed = +cleanedText;
        return parsed * this.getSign(text, format);
    },

    _calcSignificantDigits: function(text) {
        const [ integer, fractional ] = text.split(".");
        const calcDigitsAfterLeadingZeros = digits => {
            let index = -1;
            for(let i = 0; i < digits.length; i++) {
                if(digits[i] !== "0") {
                    index = i;
                    break;
                }
            }
            return index > -1 ? digits.length - index : 0;
        };
        let result = 0;
        if(integer) {
            result += calcDigitsAfterLeadingZeros(integer.split(""));
        }
        if(fractional) {
            result += calcDigitsAfterLeadingZeros(fractional.split("").reverse());
        }
        return result;
    }
});

module.exports = numberLocalization;
