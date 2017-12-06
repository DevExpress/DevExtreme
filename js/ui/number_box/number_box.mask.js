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
    typeUtils = require("../../core/utils/type");

var NUMBER_FORMATTER_NAMESPACE = "dxNumberFormatter",
    MOVE_FORWARD = 1,
    MOVE_BACKWARD = -1,
    MAXIMUM_FLOAT_LENGTH = 15;

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

    _isBackspaceKey: function(key) {
        return key === "Backspace";
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
            enter: that._formatValue.bind(that),
            end: that._moveCaretToBoundary.bind(that, MOVE_BACKWARD)
        });
    },

    _focusOutHandler: function(e) {
        if(this._useMaskBehavior()) {
            this._formatValue();
        }

        this.callBase(e);
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

    _moveToClosestNonStub: function(position) {
        position = isNumeric(position) ? { start: position, end: position } : position;

        var caret = position || this._caret();

        if(caret.start !== caret.end) {
            return;
        }

        var text = this._input().val(),
            startPosition = fitIntoRange(caret.start, 0, text.length),
            afterIndex = this._getClosestNonStubIndex(MOVE_FORWARD, startPosition),
            index = afterIndex < text.length ? afterIndex : this._getClosestNonStubIndex(MOVE_BACKWARD, startPosition);

        this._caret({
            start: index,
            end: index
        });
    },

    _goToDecimalPart: function(text, caret) {
        var decimalSeparator = number.getDecimalSeparator(),
            isDecimalSeparatorNext = text.charAt(caret.end) === decimalSeparator;

        return this._lastKey === decimalSeparator && isDecimalSeparatorNext;
    },

    _keyboardHandler: function(e) {
        if(!this._shouldHandleKey(e.originalEvent)) {
            this._lastKey = null;
            return this.callBase(e);
        }

        var text = this._input().val(),
            caret = this._caret();

        this._lastKey = e.originalEvent.key;

        var enteredChar = this._lastKey === "-" ? "" : this._lastKey,
            newValue = this._tryParse(text, caret, enteredChar);

        if(newValue === undefined) {
            if(this._lastKey !== "-") {
                e.originalEvent.preventDefault();
            }

            if(this._goToDecimalPart(text, caret)) {
                this._moveCaret(1);
            }
        } else {
            this._parsedValue = newValue;
        }

        return this.callBase(e);
    },

    _removeHandler: function(e) {
        var caret = this._caret(),
            text = this._input().val(),
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

        if(char === number.getDecimalSeparator()) {
            this._moveCaret(this._isDeleteKey(e.key) ? 1 : -1);
            e.preventDefault();
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

    _isNumberVeryLong: function(text) {
        return text.replace(/[^0-9]/g, "").length > MAXIMUM_FLOAT_LENGTH;
    },

    _tryParse: function(text, selection, char) {
        var editedText = this._getEditedText(text, selection, char),
            parsed = number.parse(editedText, this._getFormatPattern()),
            minusPressed = char === "-",
            isValueChanged = parsed !== this._parsedValue;

        if(!isValueChanged && !minusPressed && !this._isValueIncomplete(editedText)) {
            return undefined;
        }

        if(editedText === "") {
            return null;
        }

        parsed = isNaN(parsed) ? undefined : parsed;

        return this._isPercentFormat() ? (parsed && parsed / 100) : parsed;
    },

    _isValueIncomplete: function(text) {
        if(!this._useMaskBehavior()) {
            return this.callBase(text);
        }

        var decimalSeparator = number.getDecimalSeparator(),
            clearRegExp = new RegExp("[^0-9" + decimalSeparator + "]", "g"),
            cleanedText = text.replace(clearRegExp, "").replace(decimalSeparator, ".");

        return cleanedText.match(/\.0*$/);
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

        this._input().val(text);
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

        eventsEngine.on($input, eventUtils.addNamespace("input", NUMBER_FORMATTER_NAMESPACE), this._formatValue.bind(this));
        eventsEngine.on($input, eventUtils.addNamespace("dxclick", NUMBER_FORMATTER_NAMESPACE), this._moveToClosestNonStub.bind(this, null));
    },

    _forceRefreshInputValue: function() {
        if(!this._useMaskBehavior()) {
            return this.callBase();
        }
    },

    _isStub: function(str, isString) {
        var escapedDecimalSeparator = escapeRegExp(number.getDecimalSeparator()),
            stubRegExp = new RegExp("^[^0-9" + escapedDecimalSeparator + "]+$", "g");

        return stubRegExp.test(str) && (isString || this._isChar(str));
    },

    _escapePercentFormat: function(format) {
        return format
            .replace(/'([^']*)%([^']*)'/g, "'$1|$2'")
            .replace("%", "'%'")
            .replace("|", "%");
    },

    _lightParse: function(text) {
        if(this._isNumberVeryLong(text)) {
            return undefined;
        }
        var value = +text;
        if(text === "") return null;
        return isNaN(value) ? undefined : value;
    },

    _parseValue: function(text) {
        if(!this._useMaskBehavior()) {
            return this.callBase(text);
        }

        if(!isNumeric(this._parsedValue)) {
            return this._parsedValue;
        }

        return fitIntoRange(this._parsedValue, this.option("min"), this.option("max"));
    },

    _isIncomplete: function(string) {
        var decimalSeparator = number.getDecimalSeparator(),
            escapedSeparator = escapeRegExp(decimalSeparator),
            regExp = new RegExp("[^" + escapedSeparator + "]" + escapedSeparator + "0*[^0-9" + escapedSeparator + "]*$", "ig"),
            lastKeyIncomplete = this._lastKey === decimalSeparator || this._lastKey === "0";

        return lastKeyIncomplete && regExp.test(string);
    },

    _revertSign: function() {
        if(!this._useMaskBehavior()) {
            return;
        }

        var newValue = -1 * ensureDefined(this._parsedValue, null);

        if(this._isValueInRange(newValue)) {
            this._parsedValue = newValue;
        }
    },

    _formatValue: function() {
        var text = this._input().val(),
            caret = this._caret();

        if(this._lastKey === "-") {
            text = this._getEditedText(text, { start: caret.start - 1, end: caret.start }, "");
        }

        if(this._isIncomplete(text)) {
            this._formattedValue = text;
            return;
        }

        var format = this._getFormatPattern(),
            decimalSeparator = number.getDecimalSeparator(),
            decimalSeparatorIndex = text.indexOf(decimalSeparator),
            caretOnFloatPart = decimalSeparatorIndex >= 0 && caret.start > decimalSeparatorIndex,
            caretDelta;

        if(this._formattedValue !== text) {
            var parsedValueByText = this._tryParse(text, caret, "");
            if(parsedValueByText !== undefined && parsedValueByText !== null) {
                this._parsedValue = parsedValueByText;
            }
        }

        var formatted = number.format(this._parsedValue, format) || "",
            isFirstInput = this._formattedValue === "",
            isOneCharInput = Math.abs(formatted.length - text.length) === 1;

        if((isOneCharInput && caretOnFloatPart) || isFirstInput) {
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

        this._setInputText(formatted, caret.start + caretDelta);
    },

    _renderDisplayText: function() {
        if(this._useMaskBehavior()) {
            this._toggleEmptinessEventHandler();
        } else {
            this.callBase.apply(this, arguments);
        }
    },

    _renderValue: function() {
        this.callBase();

        if(this._useMaskBehavior()) {
            this._parsedValue = this.option("value");
            this._formatValue();
        }
    },

    _valueChangeEventHandler: function(e) {
        if(!this._useMaskBehavior()) {
            return this.callBase(e);
        }

        this._lastKey = null;
        this.option("value", this._parseValue());
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "format":
            case "useMaskBehavior":
                this._renderFormatter();
                this._parsedValue = this.option("value");
                this._formatValue();
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
    },

    _clean: function() {
        this._clearCache();
        this.callBase();
    }
});

module.exports = NumberBoxMask;
