"use strict";

var eventsEngine = require("../../events/core/events_engine"),
    caret = require("./utils.caret"),
    extend = require("../../core/utils/extend").extend,
    ensureDefined = require("../../core/utils/common").ensureDefined,
    numberParserGenerator = require("../../core/utils/number_parser_generator"),
    TextEditorBase = require("./ui.text_editor.base"),
    eventUtils = require("../../events/utils");

var MASK_FORMATTER_NAMESPACE = "dxMaskFormatter",
    FLOAT_SEPARATOR = ".";

var TextEditorFormatter = TextEditorBase.inherit({

    _supportedKeys: function() {
        var that = this;

        return extend(this.callBase(), {
            minus: that._revertSign.bind(that)
        });
    },

    _keyboardHandler: function(e) {
        this._lastKey = e.originalEvent.key;

        if(this._isStubSymbol(this._lastKey)) {
            e.originalEvent.preventDefault();
        }

        this.callBase(e);
    },

    _renderInput: function() {
        this.callBase();
        this._renderFormatter();
    },

    _clearCache: function() {
        delete this._formatter;
        delete this._escapedFormatter;
        delete this._parser;
        delete this._formattedValue;
        delete this._lastKey;
        delete this._parsedValue;
    },

    _renderFormatter: function() {

        this._clearCache();

        var displayFormat = this.option("displayFormat");
        if(!displayFormat) return;

        this._formatter = numberParserGenerator.generateNumberFormatter(displayFormat);
        this._escapedFormatter = numberParserGenerator.generateNumberFormatter(this._escapePercentFormat(displayFormat));
        this._parser = numberParserGenerator.generateNumberParser(displayFormat);

        this._detachFormatterEvents();
        this._attachFormatterEvents();
    },

    _detachFormatterEvents: function() {
        eventsEngine.off(this._input(), "." + MASK_FORMATTER_NAMESPACE);
    },

    _attachFormatterEvents: function() {
        var $input = this._input();

        eventsEngine.on($input, eventUtils.addNamespace("input", MASK_FORMATTER_NAMESPACE), this._formatValue.bind(this));
    },

    _normalizeCaret: function(caret) {
        var delta = 0,
            text = this._input().val();

        switch(this._lastKey) {
            case "Backspace":

                break;
            case "Delete":
                delta = 1;
                break;
            case FLOAT_SEPARATOR:
                if(text.charAt(caret.end) !== FLOAT_SEPARATOR) {
                    delta = -1;
                }
                break;
            default:
                var formattedFloat = this._getFormattedFloat(this._input().val());
                if(formattedFloat !== null) {
                    delta = this._getStubCountBeforePosition();
                }
                break;
        }

        return {
            start: caret.start + delta < 0 ? 0 : caret.start + delta,
            end: caret.end + delta < 0 ? 0 : caret.end + delta
        };
    },

    _getStubCountBeforePosition: function() {
        var format = this.option("displayFormat"),
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
        return new RegExp("^[^0-9" + this._escapeRegExpSpecial(FLOAT_SEPARATOR) + "]$").test(char);
    },

    _escapeRegExpSpecial: function(formatString) {
        return formatString.replace(/[.*+?^${}()|\[\]\\]/g, "\\$&");
    },

    _escapePercentFormat: function(format) {
        return format
            .replace(/'([^']*)%([^']*)'/g, "'$1|$2'")
            .replace("%", "'%'")
            .replace("|", "%");
    },

    _getFormattedFloat: function(text) {
        return this._escapedFormatter(parseFloat(text));
    },

    _normalizeFormattedValue: function() {
        var caret = this._caret(),
            text = this._input().val(),
            resultValue = text;

        switch(this._lastKey) {
            case "Backspace":
                resultValue = text.slice(0, caret.start) + "0" + text.slice(caret.end);
                break;
            case "Delete":
                resultValue = text.slice(0, caret.end - 1) + "0" + text.slice(caret.end);
                break;
            case FLOAT_SEPARATOR:
                if(text.charAt(caret.end) !== FLOAT_SEPARATOR) {
                    return;
                }
                break;
            default:
                resultValue = text.slice(0, caret.start) + text.slice(caret.start + 1);
                break;
        }

        if(this._formattedValue !== resultValue) {
            var formattedResult = this._getFormattedFloat(resultValue);
            if(formattedResult !== null) {
                resultValue = formattedResult;
            }
        }

        if(this._parser(resultValue) !== null) {
            this._formattedValue = resultValue;
        }
    },

    _getClearValue: function() {
        var regexp = new RegExp("[^0-9" + this._escapeRegExpSpecial(FLOAT_SEPARATOR) + "]", "g");
        return this._input().val().replace(regexp, "");
    },

    _applyValue: function(value, forced) {
        if(!this.option("displayFormat")) return;

        if(Object.is(this._parsedValue, value) && !forced) {
            return;
        }

        var caret = this._caret();

        if(value === null && !forced) {
            this._normalizeFormattedValue();
            caret = this._normalizeCaret(caret);

            if(!this._formattedValue) {
                value = parseFloat(this._getClearValue());
            } else {
                this._input().val(this._formattedValue);
                this._caret(caret);
                return;
            }
        }

        this._parsedValue = value;
        this._formattedValue = this._formatter(value);
        this._input().val(this._formattedValue);

        this._caret(caret);
    },

    _revertSign: function() {
        var newValue = -1 * ensureDefined(this._parsedValue, null);
        this._applyValue(newValue);
    },

    _formatValue: function() {
        if(!this.option("displayFormat")) return;

        var text = this._input().val();

        if(!text.length) {
            this._applyValue("", true);
            return;
        }

        var parsedValue = this._parser(text);

        this._applyValue(parsedValue);
    },

    _renderValue: function() {
        this.callBase();
        this._applyValue(ensureDefined(this.option("value"), ""));
    },

    _valueChangeEventHandler: function(e) {
        if(this.option("displayFormat")) {
            this.callBase(e, this._parser(this._input().val()));
            this._formatValue();
        } else {
            this.callBase(e);
        }
    },

    _caret: function(position) {
        if(!arguments.length) {
            return caret(this._input());
        }
        caret(this._input(), position);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "displayFormat":
                this._renderFormatter();
                this._formatValue();
                break;
            default:
                this.callBase(args);
        }
    },

    _clean: function() {
        this._clearCache();
        this.callBase();
    }

});

module.exports = TextEditorFormatter;
