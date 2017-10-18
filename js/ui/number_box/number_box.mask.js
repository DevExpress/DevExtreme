"use strict";

var eventsEngine = require("../../events/core/events_engine"),
    extend = require("../../core/utils/extend").extend,
    ensureDefined = require("../../core/utils/common").ensureDefined,
    number = require("../../localization/number"),
    NumberBoxBase = require("./number_box.base"),
    eventUtils = require("../../events/utils");

var NUMBER_FORMATTER_NAMESPACE = "dxNumberFormatter",
    FLOAT_SEPARATOR = ".",
    FORWARD_DIRECTION = 1;

var NumberBoxMask = NumberBoxBase.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {

            useMaskBehavior: true,

            /**
             * @name dxNumberBoxOptions_format
             * @publicName format
             * @type String
             * @default null
             */
            format: null
        });
    },

    _isDeleteKey: function() {
        return this._lastKey === "Delete" || this._lastKey === "Del";
    },

    _isBackspaceKey: function() {
        return this._lastKey === "Backspace";
    },

    _supportedKeys: function() {
        if(!this._useMaskBehavior()) {
            return this.callBase();
        }

        var that = this;

        return extend(this.callBase(), {
            minus: that._revertSign.bind(that)
        });
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

    _getRemovingDirection: function() {
        if(this._isBackspaceKey()) {
            return -1;
        } else if(this._isDeleteKey()) {
            return 1;
        } else {
            return 0;
        }
    },

    _getRemovingText: function(direction) {
        var caret = this._caret(),
            text = this._input().val(),
            start = caret.start,
            end = caret.end;

        if(start === end && direction) {
            direction === FORWARD_DIRECTION ? end++ : start--;
        }

        return text.slice(start, end);
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

    _keyboardHandler: function(e) {
        if(!this._useMaskBehavior()) {
            return this.callBase(e);
        }

        if(e.ctrl) {
            this.callBase(e);
            return;
        }

        this._lastKey = e.originalEvent.key;

        var removingDirection = this._getRemovingDirection(),
            removingText = this._getRemovingText(removingDirection);

        if(this._isStubSymbol(removingText)) {
            this._moveCaret(removingDirection);
        }

        if(this._isStubSymbol(this._lastKey)) {
            var text = this._input().val(),
                caret = this._caret(),
                nextChar = text.charAt(caret.end);

            if(nextChar === this._lastKey) {
                this._moveCaret(1);
            }

            if(this._lastKey !== FLOAT_SEPARATOR || text.indexOf(FLOAT_SEPARATOR) >= 0) {
                e.originalEvent.preventDefault();
            }
        }

        this.callBase(e);
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
        eventsEngine.on(this._input(), eventUtils.addNamespace("input", NUMBER_FORMATTER_NAMESPACE), this._formatValue.bind(this));
    },

    _normalizeCaret: function(caret) {
        var delta = 0,
            parsedValue = this._lightParse(this._input().val());

        if(parsedValue !== null) {
            delta = this._getStubCount();
        }

        return {
            start: caret.start + delta < 0 ? 0 : caret.start + delta,
            end: caret.end + delta < 0 ? 0 : caret.end + delta
        };
    },

    _forceRefreshInputValue: function() {
        if(!this._useMaskBehavior()) {
            return this.callBase();
        }
    },

    _getStubCount: function() {
        var format = this.option("format"),
            escapedRegExp = new RegExp("^('[^']+')([#0])"),
            stubRegexp = new RegExp("^([^0#]+)[0#]"),
            escapedMatches = format.match(escapedRegExp),
            escapedCount = 0,
            stubCount = 0;

        if(escapedMatches) {
            escapedCount = escapedMatches[0].length - 2;
            format.replace(escapedRegExp, "$2");
        }

        var stubMatches = format.match(stubRegexp);

        if(stubMatches) {
            stubCount = stubMatches[1].length;
        }

        return escapedCount + stubCount;
    },

    _isStubSymbol: function(char) {
        return new RegExp("^[^0-9]$").test(char);
    },

    _escapePercentFormat: function(format) {
        return format
            .replace(/'([^']*)%([^']*)'/g, "'$1|$2'")
            .replace("%", "'%'")
            .replace("|", "%");
    },

    _lightParse: function(text) {
        var value = +text;
        return isNaN(value) ? null : value;
    },

    _normalizeFormattedValue: function() {
        var caret = this._caret(),
            text = this._input().val(),
            resultValue = text;

        if(this._isBackspaceKey() || this._isDeleteKey()) {
            resultValue = text.slice(0, caret.start) + "0" + text.slice(caret.end);
            this._moveCaret(1);
        } else {
            resultValue = text.slice(0, caret.start) + text.slice(caret.start + 1);
        }

        if(this._formattedValue !== resultValue) {
            var parsedValue = this._lightParse(resultValue);
            if(parsedValue !== null) {
                resultValue = number.format(parsedValue, this._escapePercentFormat(this.option("format")));
            }
        }

        if(number.parse(resultValue, this.option("format")) !== null) {
            this._formattedValue = resultValue;
        }
    },

    _isEqual: function(value1, value2) {
        var containsNegativeZero = 1 / (value1 * value2) === -Infinity;
        return value1 === value2 && !containsNegativeZero;
    },

    _applyValue: function(value, forced) {
        if(!this._useMaskBehavior() || this._isEqual(this._parsedValue, value) && !forced) {
            return;
        }

        var caret = this._caret();

        if(value === null && !forced) {
            this._normalizeFormattedValue();
            caret = this._normalizeCaret(this._caret());

            if(!this._formattedValue) {
                value = this._lightParse(this._input().val());
            } else {
                this._input().val(this._formattedValue);
                this._caret(caret);
                return;
            }
        }

        this._parsedValue = value;
        this._formattedValue = number.format(value, this.option("format"));
        this._input().val(this._formattedValue);

        this._caret(this._normalizeCaret(caret));
    },

    _revertSign: function() {
        var newValue = -1 * ensureDefined(this._parsedValue, null);
        this.option("value", newValue);
    },

    _formatValue: function() {
        var text = this._input().val();

        if(!text.length) {
            this._applyValue("", true);
            return;
        }

        var parsedValue = number.parse(text, this.option("format"));

        this._applyValue(parsedValue);
    },

    _renderValue: function() {
        this.callBase();

        if(this._useMaskBehavior()) {
            this._applyValue(ensureDefined(this.option("value"), ""));
        }
    },

    _normalizeText: function() {
        if(!this._useMaskBehavior()) {
            return this.callBase();
        }

        return this._input().val();
    },

    _parseValue: function(text) {
        if(!this._useMaskBehavior()) {
            return this.callBase(text);
        }

        return this.callBase(number.parse(text, this.option("format")));
    },

    _valueChangeEventHandler: function(e) {
        if(!this._useMaskBehavior()) {
            return this.callBase(e);
        }

        this.callBase(e, number.parse(this._input().val(), this.option("format")));
        this._applyValue(this.option("value"), true);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "format":
            case "useMaskBehavior":
                this._renderFormatter();
                this._applyValue(this.option("value"), true);
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
