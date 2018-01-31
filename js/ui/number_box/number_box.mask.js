"use strict";

var eventsEngine = require("../../events/core/events_engine"),
    extend = require("../../core/utils/extend").extend,
    isNumeric = require("../../core/utils/type").isNumeric,
    fitIntoRange = require("../../core/utils/math").fitIntoRange,
    inRange = require("../../core/utils/math").inRange,
    escapeRegExp = require("../../core/utils/common").escapeRegExp,
    number = require("../../localization/number"),
    getLDMLFormat = require("../../localization/ldml/number").getFormat,
    NumberBoxBase = require("./number_box.base"),
    eventUtils = require("../../events/utils"),
    typeUtils = require("../../core/utils/type"),
    browser = require("../../core/utils/browser");

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
            leftArrow: that._arrowHandler.bind(that, MOVE_FORWARD),
            rightArrow: that._arrowHandler.bind(that, MOVE_BACKWARD),
            home: that._moveCaretToBoundary.bind(that, MOVE_FORWARD),
            enter: that._updateFormattedValue.bind(that),
            end: that._moveCaretToBoundary.bind(that, MOVE_BACKWARD)
        });
    },

    _focusOutHandler: function(e) {
        if(this._useMaskBehavior()) {
            this._updateFormattedValue();
        }

        this.callBase(e);
    },

    _updateFormattedValue: function() {
        this._setTextByParsedValue();

        if(this._isValueDirty()) {
            this._isInputTriggered = false;
            eventsEngine.trigger(this._input(), "change");
        }
    },

    _isValueDirty: function() {
        //https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/15181565/
        return browser.msie && this._isInputTriggered;
    },

    _arrowHandler: function(step, e) {
        if(!this._useMaskBehavior()) {
            return;
        }

        var text = this._input().val(),
            caret = this._caret(),
            start = step > 0 ? 0 : caret.start,
            end = step > 0 ? caret.start : text.length,
            chars = text.slice(start, end);

        if(this._isStub(chars, true)) {
            e.preventDefault();
        }

        if(caret.end - caret.start === text.length) {
            this._moveCaretToBoundary(step, e);
        }
    },

    _getClosestNonStubIndex: function(direction, start) {
        var text = this._input().val(),
            index = start || (direction > 0 ? 0 : text.length);

        if(direction === MOVE_BACKWARD) {
            index--;
        }

        while(this._isStub(text.charAt(index))) {
            index += direction;
        }

        return direction < 0 ? ++index : index;
    },

    _moveCaretToBoundary: function(direction, e) {
        if(!this._useMaskBehavior() || e.shiftKey) {
            return;
        }

        var index = this._getClosestNonStubIndex(direction);

        this._caret({
            start: index,
            end: index
        });

        e && e.preventDefault();
    },

    _getDefaultCaretPosition: function() {
        var formatted = number.format(1, this._getFormatPattern());
        return formatted.indexOf("1");
    },

    _moveToClosestNonStub: function(position) {
        position = isNumeric(position) ? { start: position, end: position } : position;

        var caret = position || this._caret();

        if(caret.start !== caret.end) {
            return;
        }

        var text = this._input().val(),
            startPosition = fitIntoRange(caret.start, 0, text.length),
            index = this._getClosestNonStubIndex(MOVE_FORWARD, startPosition);

        if(index >= text.length) {
            index = this._getClosestNonStubIndex(MOVE_BACKWARD, startPosition) || this._getDefaultCaretPosition();
        }

        this._caret({
            start: index,
            end: index
        });
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
        if(!this._shouldHandleKey(e.originalEvent)) {
            this._lastKey = null;
            return this.callBase(e);
        }

        var text = this._getInputVal(),
            caret = this._caret();

        this._lastKey = number.convertDigits(e.originalEvent.key, true);

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
            isValueChanged = parsed !== this._parsedValue;

        if(!isTextSelected && !isValueChanged && char !== MINUS && !this._isValueIncomplete(editedText)) {
            return undefined;
        }

        if(editedText === "") {
            return null;
        }

        if(isNaN(parsed)) {
            return undefined;
        }

        var precision = this._getMaxPrecision(format, parsed),
            pow = Math.pow(10, precision),
            value = (parsed === null ? this._parsedValue : parsed);

        parsed = Math.floor(Math.round(value * pow * 10) / 10) / pow;

        return this._isPercentFormat() ? (parsed && parsed / 100) : parsed;
    },

    _isValueIncomplete: function(text) {
        if(!this._useMaskBehavior()) {
            return this.callBase(text);
        }

        var formatParts = this._getFormatPattern().split(";")[0].split("."),
            isFloatPartAllowed = formatParts.length === 2;

        if(!isFloatPartAllowed) {
            return false;
        }

        var clearedText = this._removeStubInText(text),
            decimalSeparator = number.getDecimalSeparator(),
            decimalSeparatorIndex = clearedText.indexOf(decimalSeparator),
            separatorIsFirst = decimalSeparatorIndex === 0,
            lastChar = clearedText.charAt(clearedText.length - 1),
            onlyOneSeparatorExists = decimalSeparatorIndex === clearedText.length - 1;

        if(separatorIsFirst) {
            return false;
        }
        if(lastChar === decimalSeparator && onlyOneSeparatorExists) {
            return true;
        }
        if(lastChar !== "0") {
            return false;
        }

        var caret = this._caret(),
            floatLength = clearedText.length - decimalSeparatorIndex - 1,
            maxPrecisionOverflow = floatLength > this._getMaxPrecision(this._getFormatPattern(), clearedText),
            textAfterCaret = this._getInputVal().slice(caret.start);

        return !maxPrecisionOverflow && (!textAfterCaret || this._isStub(textAfterCaret, true));
    },

    _isValueInRange: function(value) {
        var min = ensureDefined(this.option("min"), -Infinity),
            max = ensureDefined(this.option("max"), Infinity);

        return inRange(value, min, max);
    },

    _setInputText: function(text, position) {
        var oldLength = (this._formattedValue || "").length,
            newLength = text.length,
            wasRemoved = newLength < oldLength;

        this._input().val(number.convertDigits(text));
        this._formattedValue = text;

        if(wasRemoved) {
            this._moveToClosestNonStub({ start: position, end: position });
        } else {
            this._caret({
                start: position,
                end: position
            });
        }
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

        var caret = this._caret();

        this._caret({
            start: caret.start + offset,
            end: caret.end + offset
        });
    },

    _shouldHandleKey: function(e) {
        var isSpecialChar = e.ctrlKey || e.shiftKey || e.altKey || !this._isChar(e.key),
            useMaskBehavior = this._useMaskBehavior();

        return useMaskBehavior && !isSpecialChar;
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
        eventsEngine.on($input, eventUtils.addNamespace("dxclick", NUMBER_FORMATTER_NAMESPACE), this._moveToClosestNonStub.bind(this, null));
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

        if(!isNumeric(this._parsedValue)) {
            return this._parsedValue;
        }

        this._parsedValue = fitIntoRange(this._parsedValue, this.option("min"), this.option("max"));

        return this._parsedValue;
    },

    _getMaxPrecision: function(format, value) {
        var signParts = format.split(";"),
            currentFormat = signParts[value >= 0 ? 0 : 1] || signParts[0],
            floatPart = currentFormat.split(".")[1] || "";

        return floatPart.length;
    },

    _revertSign: function(e) {
        if(!this._useMaskBehavior()) {
            return;
        }

        var newValue = -1 * ensureDefined(this._parsedValue, null);

        if(this._isValueInRange(newValue)) {
            this._parsedValue = newValue;

            if(e.key === NUMPUD_MINUS_KEY_IE) { //Workaround for IE (T592690)
                eventsEngine.trigger(this._input(), INPUT_EVENT);
            }
        }
    },

    _isCaretOnFloat: function() {
        var text = this._getInputVal(),
            caret = this._caret(),
            decimalSeparator = number.getDecimalSeparator(),
            decimalSeparatorIndex = text.indexOf(decimalSeparator);

        return decimalSeparatorIndex >= 0 && caret.start > decimalSeparatorIndex;
    },

    _getCaretDelta: function(formatted) {
        var text = this._getInputVal(),
            caret = this._caret(),
            caretDelta = 0,
            isFirstInput = this._formattedValue === "",
            allStubsAfterCaret = this._isStub(text.slice(caret.start), true),
            isOneCharInput = Math.abs(formatted.length - text.length) === 1;

        if((isOneCharInput && this._isCaretOnFloat() && !allStubsAfterCaret) || isFirstInput) {
            caretDelta = 0;
        } else if(formatted.length && this._lastKey === text) {
            caretDelta = formatted.indexOf(text) - caret.start + 1;
        } else {
            caretDelta = formatted.length - text.length;
        }

        if(typeUtils.isDefined(this._parsedValue) && this._formattedValue === "" && this._parsedValue !== null) {
            var indexOfLastKey = formatted.indexOf(this._parsedValue.toString());
            caretDelta = indexOfLastKey !== -1 ? indexOfLastKey : 0;
        }

        return caretDelta;
    },

    _removeMinusFromText: function(text, caret) {
        var isMinusPressed = this._lastKey === MINUS && text.charAt(caret.start - 1) === MINUS;

        return isMinusPressed ? this._getEditedText(text, { start: caret.start - 1, end: caret.start }, "") : text;
    },

    _setTextByParsedValue: function() {
        var format = this._getFormatPattern(),
            caret = this._caret(),
            parsed = this._parseValue(),
            formatted = number.format(parsed, format) || "",
            newCaret = caret.start + this._getCaretDelta(formatted);

        this._setInputText(formatted, newCaret);
    },

    _formatValue: function() {
        var text = this._getInputVal(),
            caret = this._caret();

        this._isInputTriggered = true;
        text = this._removeMinusFromText(text, caret);

        if(this._isValueIncomplete(text)) {
            this._formattedValue = text;
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

    _valueChangeEventHandler: function(e) {
        if(!this._useMaskBehavior()) {
            return this.callBase(e);
        }

        this._lastKey = null;

        var parsedValue = this._parseValue();
        this.option("value", parsedValue);
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

    _removeStubInText: function(text) {
        var decimalSeparator = number.getDecimalSeparator(),
            regExpString = "[^0-9" + decimalSeparator + "]+",
            regExp = new RegExp(regExpString, "g");

        text = text || this._getInputVal();

        return text.replace(regExp, "");
    },

    _clearCache: function() {
        delete this._formattedValue;
        delete this._lastKey;
        delete this._parsedValue;
        delete this._isInputTriggered;
    },

    _clean: function() {
        this._clearCache();
        this.callBase();
    }
});

module.exports = NumberBoxMask;
