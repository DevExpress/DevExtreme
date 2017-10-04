"use strict";

var eventsEngine = require("../../events/core/events_engine"),
    caret = require("./utils.caret"),
    extend = require("../../core/utils/extend").extend,
    type = require("../../core/utils/type"),
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
        this.callBase(e);
    },

    _renderInput: function() {
        this.callBase();
        this._renderFormatter();
    },

    _clearCache: function() {
        delete this._formatter;
        delete this._parser;
        delete this._formattedValue;
        delete this._lastKey;
        delete this._parsedValue;
    },

    _renderFormatter: function() {
        this._clearCache();

        this._formatter = numberParserGenerator.generateNumberFormatter(this.option("displayFormat"));
        this._parser = numberParserGenerator.generateNumberParser(this.option("displayFormat"));

        this._detachFormatterEvents();
        this._attachFormatterEvents();
    },

    _detachFormatterEvents: function() {
        eventsEngine.off(this._input(), "." + MASK_FORMATTER_NAMESPACE);
    },

    _attachFormatterEvents: function() {
        var $input = this._input();

        eventsEngine.on($input, eventUtils.addNamespace("input", MASK_FORMATTER_NAMESPACE), this._formatValue.bind(this));
        eventsEngine.on($input, eventUtils.addNamespace("dxclick", MASK_FORMATTER_NAMESPACE), this._clickHandler.bind(this));
    },

    _clickHandler: function() {
        var value = this.option("value");
        if(!type.isDefined(value)) this._caret(0);
    },

    _normalizeCaret: function(caret) {
        var delta = 0;

        if(this._lastKey === "Backspace") {
            delta = 0;
        } else if(this._lastKey === "Delete") {
            delta = 1;
        } else {
            var formattedFloat = this._getFormattedFloat(this._input().val());
            if(formattedFloat !== null) {
                delta = this._getStubCountBeforeInput();
            }
        }

        return {
            start: caret.start + delta < 0 ? 0 : caret.start + delta,
            end: caret.end + delta < 0 ? 0 : caret.end + delta
        };
    },

    _getStubCountBeforeInput: function() {
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
            stubCount = stubMatches[0].length;
        }

        return escapedCount + stubCount;
    },

    _getFormattedFloat: function(text) {
        return this._formatter(parseFloat(text));
    },

    _normalizeFormattedValue: function() {
        if(!this._formattedValue) return;

        var caret = this._caret(),
            text = this._input().val(),
            resultValue;

        if(this._lastKey === "Backspace") {
            resultValue = text.substr(0, caret.start) + "0" + text.substr(caret.end, text.length);
        } else if(this._lastKey === "Delete") {
            resultValue = text.substr(0, caret.end - 1) + "0" + text.substr(caret.end, text.length);
        } else {
            resultValue = text.slice(0, caret.start) + text.slice(caret.start + 1);
        }

        var formattedResult = this._getFormattedFloat(resultValue);
        if(formattedResult !== null) {
            resultValue = formattedResult;
        }

        if(this._parser(resultValue) !== null) {
            this._formattedValue = resultValue;
        }
    },

    _getClearValue: function() {
        var regexp = new RegExp("[^0-9" + FLOAT_SEPARATOR + "]", "g");
        return this._input().val().replace(regexp, "");
    },

    _applyValue: function(value, forced) {
        if(this._parsedValue === value && !forced) {
            return;
        }

        var caret = this._caret();

        if(value === null && !forced) {
            caret = this._normalizeCaret(caret);
            this._normalizeFormattedValue();

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
        this._applyValue(-1 * this._parsedValue);
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
        this._applyValue(this.option("value") || "");
    },

    _valueChangeEventHandler: function(e) {
        this.callBase(e, this._parser(this._input().val()));
        this._formatValue();
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
