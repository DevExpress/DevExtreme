"use strict";

var eventsEngine = require("../../events/core/events_engine"),
    caret = require("./utils.caret"),
    extend = require("../../core/utils/extend").extend,
    type = require("../../core/utils/type"),
    numberParserGenerator = require("../../core/utils/number_parser_generator"),
    TextEditorBase = require("./ui.text_editor.base"),
    eventUtils = require("../../events/utils");

var MASK_FORMATTER_NAMESPACE = "dxMaskFormatter";

var TextEditorFormatter = TextEditorBase.inherit({

    _supportedKeys: function() {
        var that = this;

        return extend(this.callBase(), {
            backspace: that._removeHandler.bind(this),
            del: that._removeHandler.bind(this)
        });
    },

    _removeHandler: function(e) {
        this._lastKey = e.key;
    },

    _renderInput: function() {
        this.callBase();
        this._renderFormatter();
    },

    _renderFormatter: function() {
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

    _replaceForward: function(text, position) {
        if(position >= text.length) return text;

        var replaceFrom = text.charAt(position + 1),
            replaceTo = text.charAt(position),
            isDigitFrom = !!replaceFrom.match(/^\d$/),
            isDigitTo = !!replaceTo.match(/^\d$/);

        if((!replaceFrom || !replaceTo) || (isDigitFrom && !isDigitTo || !isDigitFrom && isDigitTo)) {
            return null;

        }

        var result = text.substr(0, position) + replaceTo + text.substr(position + 2, text.length);

        return result;
    },

    _tryToReplaceChar: function() {
        var caret = this._caret(),
            text = this._input().val(),
            replacedText = this._replaceForward(text, caret.start - 1);

        return replacedText;
    },

    _adjustCaret: function() {
        var value = this.option("value");
        if(!type.isDefined(value)) this._caret(0);
    },

    _clickHandler: function() {
        this._adjustCaret();
    },

    _applyValue: function(value, forced, caret) {
        caret = caret || this._caret();

        if(this._parsedValue === value && !forced) {
            return;
        } else if(value === null && !forced) {
            this._input().val(this._formattedValue);
        } else {
            this._parsedValue = value;
            this._formattedValue = this._formatter(value);
            this._input().val(this._formattedValue);
        }

        this._caret(caret);
    },

    _formatFirstInputIfNeed: function(text) {
        if(!this._formattedValue) {
            var formattedValue = this._formatter(parseInt(text));

            if(formattedValue) {
                var caretPosition = formattedValue.indexOf(text) + 1;

                return {
                    text: formattedValue,
                    caret: { start: caretPosition, end: caretPosition }
                };
            }
        }
    },

    _formatValue: function() {
        if(!this.option("displayFormat")) return;

        var text = this._input().val(),
            caret;

        if(!text.length) return;

        var firstInputResult = this._formatFirstInputIfNeed(text);

        if(firstInputResult) {
            text = firstInputResult.text;
            caret = firstInputResult.caret;
        }

        var parsedValue = this._parser(text),
            operation = "insert";

        var offset;

        if(parsedValue === null && this._lastKey === "Delete") {
            // 12|.34 -> 12|34
            caret = this._caret();
            text = this._formattedValue;

            text = text.substr(0, caret.start) + text.substr(caret.start).replace(/\d/, "0");
            parsedValue = this._parser(text);
            if(text !== null) {
                offset = text.substr(caret.start).indexOf("0") + 1;
                caret.start += offset;
                caret.end += offset;
                operation = "replace";
            }
        }

        function reverseString(str) {
            return str.split("").reverse().join("");
        }

        if(parsedValue === null && this._lastKey === "Backspace") {
            // 12.3|4 -> 12.|4
            caret = this._caret();
            text = this._formattedValue;

            caret.start++;
            caret.end++;

            text = reverseString(reverseString(text.substr(0, caret.start)).replace(/\d/, "0")) + text.substr(caret.start);
            parsedValue = this._parser(text);
            if(text !== null) {
                offset = reverseString(text.substr(0, caret.start)).indexOf("0") + 1;
                caret.start -= offset;
                caret.end -= offset;
                operation = "replace";
            }
        }

        this._lastKey = null;

        if(parsedValue === null) {
            var replacedText = this._tryToReplaceChar();
            parsedValue = this._parser(replacedText);
            if(replacedText !== null) {
                operation = "replace";
            }
        }

        this._applyValue(parsedValue, operation === "replace", caret);
    },

    _renderValue: function() {
        this.callBase();
        this._applyValue(this.option("value"));
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
        delete this._formatter;
        delete this._parser;
        delete this._formattedValue;
        delete this._parsedValue;
        this.callBase();
    }

});

module.exports = TextEditorFormatter;
