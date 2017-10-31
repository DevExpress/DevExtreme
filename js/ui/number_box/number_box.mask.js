"use strict";

var eventsEngine = require("../../events/core/events_engine"),
    extend = require("../../core/utils/extend").extend,
    ensureDefined = require("../../core/utils/common").ensureDefined,
    isNumeric = require("../../core/utils/type").isNumeric,
    fitIntoRange = require("../../core/utils/math").fitIntoRange,
    inRange = require("../../core/utils/math").inRange,
    escapeRegExp = require("../../core/utils/common").escapeRegExp,
    number = require("../../localization/number"),
    getLDMLFormat = require("../../localization/ldml/number").getFormat,
    NumberBoxBase = require("./number_box.base"),
    eventUtils = require("../../events/utils");

var NUMBER_FORMATTER_NAMESPACE = "dxNumberFormatter",
    STUB_CHAR_REG_EXP = "[^0-9.]",
    MOVE_FORWARD = 1,
    MOVE_BACKWARD = -1;

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
            leftArrow: that._arrowHandler.bind(that, MOVE_BACKWARD),
            rightArrow: that._arrowHandler.bind(that, MOVE_FORWARD),
            end: that._moveCaretToBoundary.bind(that, MOVE_BACKWARD),
            home: that._moveCaretToBoundary.bind(that, MOVE_FORWARD)
        });
    },

    _arrowHandler: function(step, e) {
        if(!this._useMaskBehavior()) {
            return;
        }

        var text = this._input().val(),
            caret = this._caret(),
            start = step < 0 ? 0 : caret.start,
            end = step < 0 ? caret.start : text.length,
            chars = text.slice(start, end);

        if(this._isStub(chars, true)) {
            e.preventDefault();
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

        var caret = ensureDefined(position, this._caret());

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

        var valueAfterRemoving = this._tryParse(text, { start: start, end: end }, "");
        if(valueAfterRemoving === null) {
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

    _tryInsert: function(text, selection, char) {
        var format = this._getFormatPattern();
        return number.parse(this._getEditedText(text, selection, char), format);
    },

    _tryReplace: function(text, selection, char) {
        var format = this._getFormatPattern(),
            start = selection.start,
            end = selection.start === selection.end ? selection.end + 1 : selection.end,
            replacement = selection.start === selection.end ? char : "0",
            replaced = this._getEditedText(text, { start: start, end: end }, replacement);

        return number.parse(replaced, format);
    },

    _tryRemoveLeadingZeros: function(text, selection, char) {
        var format = this._getFormatPattern(),
            inserted = this._getEditedText(text, selection, char),
            regExp = new RegExp("^(" + STUB_CHAR_REG_EXP + "*)(0+)", "g"),
            cleared = inserted.replace(regExp, "$1");

        return number.parse(cleared, format);
    },

    _tryLightParse: function(text, selection, char) {
        var textBefore = text.slice(0, selection.start),
            textAfter = text.slice(selection.end),
            inserted = textBefore + char + textAfter,
            value = this._lightParse(inserted);

        return this._isPercentFormat() ? (value && value / 100) : value;
    },

    _tryParse: function(text, selection, char) {
        var inserted = this._tryInsert(text, selection, char),
            replaced = this._tryReplace(text, selection, char),
            lightParsed = this._tryLightParse(text, selection, char),
            noLeadingZeros = this._tryRemoveLeadingZeros(text, selection, char),
            value = ensureDefined(inserted,
                ensureDefined(replaced, ensureDefined(lightParsed, noLeadingZeros))
            );

        if(!this._isValueInRange(value)) {
            return null;
        }

        if(value === lightParsed) {
            this._formattedValue = "";
        }

        return value;
    },

    _isValueInRange: function(value) {
        var min = ensureDefined(this.option("min"), -Infinity),
            max = ensureDefined(this.option("max"), Infinity),
            nextValue = value * 10;

        return inRange(value, min, max) || inRange(nextValue, min, max);
    },

    _setInputText: function(text, position) {
        var oldLength = (this._formattedValue || "").length,
            newLength = text.length,
            wasRemoved = newLength < oldLength,
            lastStubCount = this._getStubCountBeforePosition(this._formattedValue, position - 1),
            newStubCount = this._getStubCountBeforePosition(text, position),
            caretDelta = newStubCount - lastStubCount;

        if(this._formattedValue === "") {
            var indexOfLastKey = text.indexOf(this._parsedValue.toString());
            caretDelta = indexOfLastKey !== -1 ? indexOfLastKey : 0;
        }

        this._input().val(text);
        this._formattedValue = text;

        if(wasRemoved) {
            this._moveToClosestNonStub({ start: position, end: position });
        } else {
            this._caret({
                start: position + caretDelta,
                end: position + caretDelta
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

    _keyboardHandler: function(e) {
        if(!this._shouldHandleKey(e.originalEvent)) {
            return this.callBase(e);
        }

        var text = this._input().val(),
            caret = this._caret();

        this._lastKey = e.originalEvent.key;

        var newValue = this._tryParse(text, caret, e.originalEvent.key);
        if(newValue === null) {
            e.originalEvent.preventDefault();
        } else {
            this._parsedValue = newValue;
        }

        return this.callBase(e);
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

    _getLeadingZeroCountBeforePosition: function(text, position) {
        var regExp = new RegExp("^" + STUB_CHAR_REG_EXP + "*(0)*[^0]*$", "g"),
            leadingZeros = text.slice(0, position).replace(regExp, "$1");

        return leadingZeros.length;
    },

    _getStubCountBeforePosition: function(text, position) {
        text = text || this._input().val();
        position = ensureDefined(position, text.length);

        var stubRegExp = new RegExp(STUB_CHAR_REG_EXP, "g"),
            checkedText = text.slice(0, position);

        return (checkedText.match(stubRegExp) || []).length;
    },

    _isStub: function(str, isString) {
        var stubRegExp = new RegExp("^" + STUB_CHAR_REG_EXP + "+$", "g");
        return stubRegExp.test(str) && (isString || this._isChar(str));
    },

    _escapePercentFormat: function(format) {
        return format
            .replace(/'([^']*)%([^']*)'/g, "'$1|$2'")
            .replace("%", "'%'")
            .replace("|", "%");
    },

    _lightParse: function(text) {
        var value = +text;
        return isNaN(value) || Math.abs(value) > 999999999999999 ? null : value;
    },

    _parseValue: function(text) {
        if(!this._useMaskBehavior()) {
            return this.callBase(text);
        }
        return this._parsedValue;
    },

    _isIncomplete: function(string) {
        var decimalSeparator = number.getDecimalSeparator(),
            escapedSeparator = escapeRegExp(decimalSeparator),
            regExp = new RegExp("[^" + escapedSeparator + "]" + escapedSeparator + "0*" + STUB_CHAR_REG_EXP + "*$", "ig"),
            lastKeyIncomplete = this._lastKey === decimalSeparator || this._lastKey === "0";

        return lastKeyIncomplete && regExp.test(string);
    },

    _revertSign: function() {
        if(!this._useMaskBehavior()) {
            return;
        }

        var newValue = -1 * ensureDefined(this._parsedValue, null);

        if(this._isValueInRange(newValue)) {
            this.option("value", newValue);
        }
    },

    _formatValue: function() {
        var text = this._input().val();

        if(this._isIncomplete(text)) {
            this._formattedValue = text;
            return;
        }

        if(text === "") {
            this._parsedValue = "";
        }

        var format = this._getFormatPattern(),
            caret = this._caret(),
            formatted = number.format(this._parsedValue, format),
            beforeLeadingZeros = this._getLeadingZeroCountBeforePosition(text, caret.start),
            afterLeadingZeros = this._getLeadingZeroCountBeforePosition(formatted, caret.start),
            zerosDelta = afterLeadingZeros - beforeLeadingZeros,
            beforeStubs = this._getStubCountBeforePosition(text, caret.start),
            afterStubs = this._getStubCountBeforePosition(formatted, caret.start + zerosDelta),
            caretDelta = (afterLeadingZeros + afterStubs) - (beforeLeadingZeros + beforeStubs);

        if(this._isBackspaceKey(this._lastKey) || formatted.length > text.length || this._formattedValue === "") {
            caretDelta = 0;
        }

        this._setInputText(formatted, caret.start + caretDelta);
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
        this.option("value", this._parsedValue);
        this._formatValue();
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
