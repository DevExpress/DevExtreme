"use strict";

var eventsEngine = require("../../events/core/events_engine"),
    extend = require("../../core/utils/extend").extend,
    isNumeric = require("../../core/utils/type").isNumeric,
    fitIntoRange = require("../../core/utils/math").fitIntoRange,
    inRange = require("../../core/utils/math").inRange,
    escapeRegExp = require("../../core/utils/common").escapeRegExp,
    number = require("../../localization/number"),
    maskCaret = require("./number_box.caret"),
    getLDMLFormat = require("../../localization/ldml/number").getFormat,
    NumberBoxBase = require("./number_box.base"),
    eventUtils = require("../../events/utils"),
    typeUtils = require("../../core/utils/type");

var NUMBER_FORMATTER_NAMESPACE = "dxNumberFormatter",
    MOVE_FORWARD = 1,
    MOVE_BACKWARD = -1,
    MINUS = "-",
    NUMPUD_MINUS_KEY_IE = "Subtract",
    INPUT_EVENT = "input";

var ensureDefined = function(value, defaultValue) {
    return value === undefined ? defaultValue : value;
};

var NumberBoxMask = NumberBoxBase.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {

            useMaskBehavior: true,

            /**
             * @name dxNumberBoxOptions_format
             * @publicName format
             * @type format
             * @default ""
             */
            format: null
        });
    },

    _isDeleteKey: function(key) {
        return key === "Delete" || key === "Del";
    },

    _supportedKeys: function() {
        if(!this._useMaskBehavior()) {
            return this.callBase();
        }

        var that = this;

        return extend(this.callBase(), {
            minus: that._revertSign.bind(that),
            del: that._removeHandler.bind(that),
            backspace: that._removeHandler.bind(that),
            leftArrow: that._arrowHandler.bind(that, MOVE_BACKWARD),
            rightArrow: that._arrowHandler.bind(that, MOVE_FORWARD),
            home: that._moveCaretToBoundary.bind(that, MOVE_FORWARD),
            enter: that._updateFormattedValue.bind(that),
            end: that._moveCaretToBoundary.bind(that, MOVE_BACKWARD)
        });
    },

    _focusInHandler: function(e) {
        this.callBase(e);

        var caret = this._caret();
        if(caret.start === caret.end) {
            this._moveCaretToBoundary(MOVE_FORWARD, e);
        }
    },


    _focusOutHandler: function(e) {
        if(this._useMaskBehavior()) {
            this._updateFormattedValue();
        }

        this.callBase(e);
    },

    _updateFormattedValue: function() {
        this._adjustParsedValue();
        this._setTextByParsedValue();

        if(this._isValueDirty()) {
            this._isDirty = false;
            eventsEngine.trigger(this._input(), "change");
        }
    },

    _isValueDirty: function() {
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/15181565/
        // https://bugreport.apple.com/web/?problemID=38133794 but this bug tracker is private
        return this._isDirty;
    },

    _arrowHandler: function(step, e) {
        if(!this._useMaskBehavior()) {
            return;
        }

        var text = this._getInputVal(),
            format = this._getFormatPattern(),
            nextCaret = maskCaret.getCaretWithOffset(this._caret(), step);

        if(!maskCaret.isCaretInBoundaries(nextCaret, text, format)) {
            nextCaret = step === MOVE_FORWARD ? nextCaret.end : nextCaret.start;
            e.preventDefault();
            this._caret(maskCaret.getCaretInBoundaries(nextCaret, text, format));
        }
    },

    _moveCaretToBoundary: function(direction, e) {
        if(!this._useMaskBehavior() || e.shiftKey) {
            return;
        }

        var boundaries = maskCaret.getCaretBoundaries(this._getInputVal(), this._getFormatPattern()),
            newCaret = maskCaret.getCaretWithOffset(direction === MOVE_FORWARD ? boundaries.start : boundaries.end, 0);

        this._caret(newCaret);

        e && e.preventDefault();
    },

    _shouldMoveCaret: function(text, caret) {
        var decimalSeparator = number.getDecimalSeparator(),
            isDecimalSeparatorNext = text.charAt(caret.end) === decimalSeparator,
            isZeroNext = text.charAt(caret.end) === "0",
            moveToFloat = this._lastKey === decimalSeparator && isDecimalSeparatorNext,
            zeroToZeroReplace = this._lastKey === "0" && isZeroNext;

        return moveToFloat || zeroToZeroReplace;
    },

    _getInputVal: function() {
        return number.convertDigits(this._input().val(), true);
    },

    _keyboardHandler: function(e) {
        this._lastKey = number.convertDigits(e.originalEvent.key, true);

        if(!this._shouldHandleKey(e.originalEvent)) {
            return this.callBase(e);
        }

        var text = this._getInputVal(),
            caret = this._caret();

        var enteredChar = this._lastKey === MINUS ? "" : this._lastKey,
            newValue = this._tryParse(text, caret, enteredChar);

        if(newValue === undefined) {
            if(this._lastKey !== MINUS) {
                e.originalEvent.preventDefault();
            }

            if(this._shouldMoveCaret(text, caret)) {
                this._moveCaret(1);
            }
        } else {
            this._parsedValue = newValue;
        }

        return this.callBase(e);
    },

    _keyPressHandler: function(e) {
        if(!this._useMaskBehavior()) {
            this.callBase(e);
        }
    },

    _removeHandler: function(e) {
        var caret = this._caret(),
            text = this._getInputVal(),
            start = caret.start,
            end = caret.end;

        this._lastKey = e.key;

        if(caret.start === caret.end) {
            this._isDeleteKey(e.key) ? end++ : start--;
        }

        var char = text.slice(start, end);

        if(this._isStub(char)) {
            this._moveCaret(this._isDeleteKey(e.key) ? 1 : -1);
            if(this._parsedValue < 0 || 1 / this._parsedValue === -Infinity) {
                this._revertSign(e);
                this._setTextByParsedValue();
            }
            e.preventDefault();
            return;
        }

        var decimalSeparator = number.getDecimalSeparator();
        if(char === decimalSeparator) {
            var decimalSeparatorIndex = text.indexOf(decimalSeparator);
            if(this._isNonStubAfter(decimalSeparatorIndex + 1)) {
                this._moveCaret(this._isDeleteKey(e.key) ? 1 : -1);
                e.preventDefault();
            }
            return;
        }


        if(end - start < text.length) {
            var editedText = this._getEditedText(text, { start: start, end: end }, ""),
                noDigits = editedText.search(/[0-9]/) < 0;

            if(noDigits && this._isValueInRange(0)) {
                this._parsedValue = this._parsedValue < 0 || 1 / this._parsedValue === -Infinity ? -0 : 0;
                return;
            }
        }

        var valueAfterRemoving = this._tryParse(text, { start: start, end: end }, "");
        if(valueAfterRemoving === undefined) {
            e.preventDefault();
        } else {
            this._parsedValue = valueAfterRemoving;
        }
    },

    _isPercentFormat: function() {
        var format = this._getFormatPattern(),
            noEscapedFormat = format.replace(/'[^']+'/g, '');

        return noEscapedFormat.indexOf("%") !== -1;
    },

    _getFormatPattern: function() {
        var format = this.option("format"),
            isLDMLPattern = typeof format === "string" && (format.indexOf("0") >= 0 || format.indexOf("#") >= 0);

        if(isLDMLPattern) {
            return format;
        } else {
            return getLDMLFormat(function(value) {
                return number.format(value, format);
            });
        }
    },

    _getFormatForSign: function(text) {
        var format = this._getFormatPattern(),
            signParts = format.split(";"),
            sign = number.getSign(text, format);

        signParts[1] = signParts[1] || "-" + signParts[0];
        return sign < 0 ? signParts[1] : signParts[0];
    },

    _removeStubs: function(text, excludeComma) {
        var format = this._getFormatForSign(text),
            thousandsSeparator = number.getThousandsSeparator(),
            stubs = format.replace(/[#0.,]/g, ""),
            regExp = new RegExp("[\-" + escapeRegExp((excludeComma ? "" : thousandsSeparator) + stubs) + "]", "g");

        return text.replace(regExp, "");
    },

    _getEditedText: function(text, selection, char) {
        var textBefore = text.slice(0, selection.start),
            textAfter = text.slice(selection.end),
            edited = textBefore + char + textAfter;

        return edited;
    },

    _tryParse: function(text, selection, char) {
        var editedText = this._getEditedText(text, selection, char),
            format = this._getFormatPattern(),
            isTextSelected = selection.start !== selection.end,
            parsed = number.parse(editedText, format),
            maxPrecision = this._getPrecisionLimits(format, editedText).max,
            isValueChanged = parsed !== this._parsedValue;

        var isDecimalPointRestricted = char === number.getDecimalSeparator() && maxPrecision === 0,
            isUselessCharRestricted = !isTextSelected && !isValueChanged && char !== MINUS && !this._isValueIncomplete(editedText) && this._isStub(char);

        if(isDecimalPointRestricted || isUselessCharRestricted) {
            return undefined;
        }

        if(editedText === "") {
            parsed = 0;
        }

        if(isNaN(parsed)) {
            return undefined;
        }

        var pow = Math.pow(10, maxPrecision),
            value = (parsed === null ? this._parsedValue : parsed);

        parsed = Math.floor(Math.round(value * pow * 10) / 10) / pow;

        return this._isPercentFormat() ? (parsed && parsed / 100) : parsed;
    },

    _isValueIncomplete: function(text) {
        if(!this._useMaskBehavior()) {
            return this.callBase(text);
        }

        var caret = this._caret(),
            point = number.getDecimalSeparator(),
            pointIndex = text.indexOf(point),
            isCaretOnFloat = pointIndex > 0 && pointIndex < caret.start,
            textParts = this._removeStubs(text, true).split(point);

        if(!isCaretOnFloat || textParts.length !== 2) {
            return false;
        }

        var floatLength = textParts[1].length,
            precision = this._getPrecisionLimits(this._getFormatPattern(), text),
            isPrecisionInRange = inRange(floatLength, precision.min, precision.max),
            endsWithZero = textParts[1].charAt(floatLength - 1) === "0";

        return isPrecisionInRange && (endsWithZero || !floatLength);
    },

    _isValueInRange: function(value) {
        var min = ensureDefined(this.option("min"), -Infinity),
            max = ensureDefined(this.option("max"), Infinity);

        return inRange(value, min, max);
    },

    _setInputText: function(text) {
        var newCaret = maskCaret.getCaretAfterFormat(this._getInputVal(), text, this._caret(), this._getFormatPattern()),
            newValue = number.convertDigits(text);

        if(this._formattedValue !== newValue) {
            this._isDirty = true;
        }

        this._input().val(newValue);
        this._formattedValue = text;

        this._caret(newCaret);
    },

    _useMaskBehavior: function() {
        return !!this.option("format") && this.option("useMaskBehavior");
    },

    _renderInputType: function() {
        var isNumberType = this.option("mode") === "number";

        if(this._useMaskBehavior() && isNumberType) {
            this._setInputType("tel");
        } else {
            this.callBase();
        }
    },

    _isChar: function(str) {
        return typeof str === "string" && str.length === 1;
    },

    _moveCaret: function(offset) {
        if(!offset) {
            return;
        }

        var newCaret = maskCaret.getCaretWithOffset(this._caret(), offset),
            adjustedCaret = maskCaret.getCaretInBoundaries(newCaret, this._getInputVal(), this._getFormatPattern());

        this._caret(adjustedCaret);
    },

    _shouldHandleKey: function(e) {
        var isSpecialChar = e.ctrlKey || e.shiftKey || e.altKey || !this._isChar(e.key),
            isMinusKey = e.key === MINUS,
            useMaskBehavior = this._useMaskBehavior();

        return useMaskBehavior && !isSpecialChar && !isMinusKey;
    },

    _renderInput: function() {
        this.callBase();
        this._renderFormatter();
    },

    _renderFormatter: function() {
        this._clearCache();
        this._detachFormatterEvents();

        if(this._useMaskBehavior()) {
            this._attachFormatterEvents();
        }
    },

    _detachFormatterEvents: function() {
        eventsEngine.off(this._input(), "." + NUMBER_FORMATTER_NAMESPACE);
    },

    _attachFormatterEvents: function() {
        var $input = this._input();

        eventsEngine.on($input, eventUtils.addNamespace(INPUT_EVENT, NUMBER_FORMATTER_NAMESPACE), this._formatValue.bind(this));
        eventsEngine.on($input, eventUtils.addNamespace("dxclick", NUMBER_FORMATTER_NAMESPACE), function() {
            this._caret(maskCaret.getCaretInBoundaries(this._caret(), this._getInputVal(), this._getFormatPattern()));
        }.bind(this));
    },

    _forceRefreshInputValue: function() {
        if(!this._useMaskBehavior()) {
            return this.callBase();
        }
    },

    _isNonStubAfter: function(index, text) {
        text = (text || this._getInputVal()).slice(index);
        return text && !this._isStub(text, true);
    },

    _isStub: function(str, isString) {
        var escapedDecimalSeparator = escapeRegExp(number.getDecimalSeparator()),
            regExpString = "^[^0-9" + escapedDecimalSeparator + "]+$",
            stubRegExp = new RegExp(regExpString, "g");

        return stubRegExp.test(str) && (isString || this._isChar(str));
    },

    _parseValue: function(text) {
        if(!this._useMaskBehavior()) {
            return this.callBase(text);
        }

        return this._parsedValue;
    },

    _getPrecisionLimits: function(format, text) {
        var currentFormat = this._getFormatForSign(text),
            floatPart = (currentFormat.split(".")[1] || "").replace(/[^#0]/g, ""),
            minPrecision = floatPart.replace(/^(0*)#*/, '$1').length,
            maxPrecision = floatPart.length;

        return { min: minPrecision, max: maxPrecision };
    },

    _revertSign: function(e) {
        if(!this._useMaskBehavior()) {
            return;
        }

        var caret = this._caret();
        if(caret.start !== caret.end) {
            this._caret(maskCaret.getCaretInBoundaries(0, this._getInputVal(), this._getFormatPattern()));
        }

        var newValue = -1 * ensureDefined(this._parsedValue, null);

        if(this._isValueInRange(newValue)) {
            this._parsedValue = newValue;

            if(e.key === NUMPUD_MINUS_KEY_IE) { // Workaround for IE (T592690)
                eventsEngine.trigger(this._input(), INPUT_EVENT);
            }
        }
    },

    _removeMinusFromText: function(text, caret) {
        var isMinusPressed = this._lastKey === MINUS && text.charAt(caret.start - 1) === MINUS;

        return isMinusPressed ? this._getEditedText(text, { start: caret.start - 1, end: caret.start }, "") : text;
    },

    _setTextByParsedValue: function() {
        var format = this._getFormatPattern(),
            parsed = this._parseValue(),
            formatted = number.format(parsed, format) || "";

        this._setInputText(formatted);
    },

    _formatValue: function() {
        var text = this._getInputVal(),
            caret = this._caret(),
            textWithoutMinus = this._removeMinusFromText(text, caret),
            wasMinusRemoved = textWithoutMinus !== text;

        this._isDirty = false;
        text = textWithoutMinus;

        if(this._isValueIncomplete(textWithoutMinus)) {
            this._formattedValue = text;
            if(wasMinusRemoved) {
                this._setTextByParsedValue();
            }
            return;
        }

        var textWasChanged = this._formattedValue !== text;
        if(textWasChanged) {
            var value = this._tryParse(text, caret, "");
            if(typeUtils.isDefined(value)) {
                this._parsedValue = value;
            }
        }

        this._setTextByParsedValue();
    },

    _renderDisplayText: function() {
        if(this._useMaskBehavior()) {
            this._toggleEmptinessEventHandler();
        } else {
            this.callBase.apply(this, arguments);
        }
    },

    _renderValue: function() {
        if(this._useMaskBehavior()) {
            this._parsedValue = this.option("value");
            this._setTextByParsedValue();
        }

        this.callBase();
    },

    _adjustParsedValue: function() {
        var clearedText = this._removeStubs(this._getInputVal()),
            parsedValue = clearedText ? this._parseValue() : null;

        if(!isNumeric(parsedValue)) {
            this._parsedValue = parsedValue;
            return;
        }

        this._parsedValue = fitIntoRange(parsedValue, this.option("min"), this.option("max"));
    },

    _valueChangeEventHandler: function(e) {
        if(!this._useMaskBehavior()) {
            return this.callBase(e);
        }

        this._lastKey = null;

        this._adjustParsedValue();
        this.option("value", this._parsedValue);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "format":
            case "useMaskBehavior":
                this._renderFormatter();
                this._parsedValue = this.option("value");
                this._setTextByParsedValue();
                break;
            default:
                this.callBase(args);
        }
    },

    _optionValuesEqual: function(name, oldValue, newValue) {
        if(name === "value" && oldValue === 0 && newValue === 0) {
            return (1 / oldValue) === (1 / newValue);
        }
        return this.callBase.apply(this, arguments);
    },

    _clearCache: function() {
        delete this._formattedValue;
        delete this._lastKey;
        delete this._parsedValue;
        delete this._isDirty;
    },

    _clean: function() {
        this._clearCache();
        this.callBase();
    }
});

module.exports = NumberBoxMask;
