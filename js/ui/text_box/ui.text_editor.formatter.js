"use strict";

var eventsEngine = require("../../events/core/events_engine"),
    caret = require("./utils.caret"),
    extend = require("../../core/utils/extend").extend,
    type = require("../../core/utils/type"),
    localization = require("../../localization"),
    TextEditorBase = require("./ui.text_editor.base"),
    eventUtils = require("../../events/utils");

var MASK_FORMATTER_NAMESPACE = "dxMaskFormatter";

var TextEditorFormatter = TextEditorBase.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {

        });
    },

    _supportedKeys: function() {
        var that = this;

        return extend(this.callBase(), {
            backspace: that._backSpaceHandler
        });
    },

    _renderInput: function() {
        this.callBase();
        this._renderFormatter();
    },

    _renderFormatter: function() {
        this._formatter = localization.number.format;
        this._parser = localization.number.parse;

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

    _getDefaultValue: function() {
        return "";
    },

    _getStubsByString: function(text) {
        return text.replace(/[0-9+-]/g, "");
    },

    _shouldSelectAfterCaret: function() {
        var displayFormat = this.option("displayFormat"),
            formatType = type.isObject(displayFormat) ? displayFormat.type : displayFormat,
            complexFormats = ["exponential", "percent", "currency", "fixedpoint"],
            isComplexFormat = complexFormats.indexOf(formatType) >= 0;

        return displayFormat.replaceAfterCaret || isComplexFormat;
    },

    _adjustCaret: function(initialCaret, oldValue, value) {

        if(!this._shouldSelectAfterCaret()) return;

        var oldStubCount = this._getStubsByString(oldValue.slice(0, initialCaret.start)).length,
            newStubCount = this._getStubsByString(value.slice(0, initialCaret.start)).length,
            caretPosition = initialCaret.start + (newStubCount - oldStubCount);

        this._caret({
            start: caretPosition,
            end: value.length
        });
    },

    _backSpaceHandler: function(e) {
        var caret = this._caret();

        this._caret({
            start: caret.start - 1,
            end: caret.end
        });
    },

    _isValueIncomplete: function(value) {
        var incompleteRegex = /(^-$)|(^-?\d*\.$)|(\d+e-?$)/i;
        return incompleteRegex.test(value);
    },

    _formatValue: function() {
        var format = this.option("displayFormat");

        if(!format) return;

        var value = this._input().val(),
            parsedValue = this._parser(value, format),
            formattedValue = this._formatter(isNaN(parsedValue) ? this._getDefaultValue() : parsedValue, format);

        var initialCaret = this._caret();

        if(!value || !isNaN(parsedValue)) {
            this._input().val(formattedValue);
            this._formattedValue = formattedValue;
        } else if(this._isValueIncomplete(value) && !this._valueChangeEventInstance) {
            return;
        } else {
            this._input().val(this._formattedValue || "");
        }

        this._adjustCaret(initialCaret, value, formattedValue);
    },

    _renderValue: function() {
        this.callBase();
        this._formatValue();
    },

    _valueChangeEventHandler: function(e) {
        this.callBase(e, this._parser(this._input().val(), this.option("displayFormat")));
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
                this._formatValue();
                break;
            default:
                this.callBase(args);
        }
    },

    _clean: function() {
        delete this._formatter;
        delete this._parser; this.callBase();
    }

});

module.exports = TextEditorFormatter;
