"use strict";

var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    caret = require("./utils.caret"),
    domUtils = require("../../core/utils/dom"),
    isDefined = require("../../core/utils/type").isDefined,
    stringUtils = require("../../core/utils/string"),
    inArray = require("../../core/utils/array").inArray,
    extend = require("../../core/utils/extend").extend,
    each = require("../../core/utils/iterator").each,
    messageLocalization = require("../../localization/message"),
    TextEditorBase = require("./ui.text_editor.base"),
    MaskRules = require("./ui.text_editor.mask.rule"),
    eventUtils = require("../../events/utils");

var stubCaret = function() {
    return {};
};

var EMPTY_CHAR = " ";
var EMPTY_CHAR_CODE = 32;
var ESCAPED_CHAR = "\\";

var TEXTEDITOR_MASKED_CLASS = "dx-texteditor-masked";
var MASK_EVENT_NAMESPACE = "dxMask";
var FORWARD_DIRECTION = "forward";
var BACKWARD_DIRECTION = "backward";
var BLUR_EVENT = "blur beforedeactivate";

var buildInMaskRules = {
    "0": /[0-9]/,
    "9": /[0-9\s]/,
    "#": /[-+0-9\s]/,
    "L": function(char) {
        return isLiteralChar(char);
    },
    "l": function(char) {
        return isLiteralChar(char) || isSpaceChar(char);
    },
    "C": /\S/,
    "c": /./,
    "A": function(char) {
        return isLiteralChar(char) || isNumericChar(char);
    },
    "a": function(char) {
        return isLiteralChar(char) || isNumericChar(char) || isSpaceChar(char);
    }
};

var isNumericChar = function(char) {
    return /[0-9]/.test(char);
};

var isLiteralChar = function(char) {
    var code = char.charCodeAt();
    return (64 < code && code < 91 || 96 < code && code < 123 || code > 127);
};

var isSpaceChar = function(char) {
    return char === " ";
};

var TextEditorMask = TextEditorBase.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
                /**
                * @name dxTextEditorOptions_mask
                * @publicName mask
                * @type string
                * @default ""
                */
            mask: "",

                /**
                * @name dxTextEditorOptions_maskChar
                * @publicName maskChar
                * @type string
                * @default "_"
                */
            maskChar: "_",

                /**
                * @name dxTextEditorOptions_maskRules
                * @publicName maskRules
                * @type Object
                * @default "{}"
                */
            maskRules: {},

                /**
                * @name dxTextEditorOptions_maskInvalidMessage
                * @publicName maskInvalidMessage
                * @type string
                * @default "Value is invalid"
                */
            maskInvalidMessage: messageLocalization.format("validation-mask"),

                /**
                * @name dxTextEditorOptions_useMaskedValue
                * @publicName useMaskedValue
                * @type boolean
                * @default false
                */
            useMaskedValue: false
        });
    },

    _supportedKeys: function() {
        var that = this;

        var keyHandlerMap = {
            backspace: that._maskBackspaceHandler,
            del: that._maskDelHandler,
            enter: that._changeHandler
        };

        var result = that.callBase();
        each(keyHandlerMap, function(key, callback) {
            var parentHandler = result[key];
            result[key] = function(e) {
                that.option("mask") && callback.call(that, e);
                parentHandler && parentHandler(e);
            };
        });

        return result;
    },

    _getSubmitElement: function() {
        return !this.option("mask") ? this.callBase() : this._$hiddenElement;
    },

    _render: function() {
        this._renderHiddenElement();
        this.callBase();
        this._renderMask();
    },

    _renderHiddenElement: function() {
        if(this.option("mask")) {
            this._$hiddenElement = $("<input>")
                .attr("type", "hidden")
                .appendTo(this._inputWrapper());
        }
    },

    _removeHiddenElement: function() {
        this._$hiddenElement && this._$hiddenElement.remove();
    },

    _renderMask: function() {
        this.element().removeClass(TEXTEDITOR_MASKED_CLASS);
        this._maskRulesChain = null;

        this._detachMaskEventHandlers();

        if(!this.option("mask")) {
            return;
        }

        this.element().addClass(TEXTEDITOR_MASKED_CLASS);

        this._attachMaskEventHandlers();
        this._parseMask();
        this._renderMaskedValue();

        this._changedValue = this._input().val();
    },

    _attachMaskEventHandlers: function() {
        var $input = this._input();

        eventsEngine.on($input, eventUtils.addNamespace("focus", MASK_EVENT_NAMESPACE), this._maskFocusHandler.bind(this));
        eventsEngine.on($input, eventUtils.addNamespace("keydown", MASK_EVENT_NAMESPACE), this._maskKeyDownHandler.bind(this));
        eventsEngine.on($input, eventUtils.addNamespace("keypress", MASK_EVENT_NAMESPACE), this._maskKeyPressHandler.bind(this));
        eventsEngine.on($input, eventUtils.addNamespace("input", MASK_EVENT_NAMESPACE), this._maskInputHandler.bind(this));
        eventsEngine.on($input, eventUtils.addNamespace("paste", MASK_EVENT_NAMESPACE), this._maskPasteHandler.bind(this));
        eventsEngine.on($input, eventUtils.addNamespace("cut", MASK_EVENT_NAMESPACE), this._maskCutHandler.bind(this));
        eventsEngine.on($input, eventUtils.addNamespace("drop", MASK_EVENT_NAMESPACE), this._maskDragHandler.bind(this));

        this._attachChangeEventHandlers();
    },

    _detachMaskEventHandlers: function() {
        eventsEngine.off(this._input(), "." + MASK_EVENT_NAMESPACE);
    },

    _attachChangeEventHandlers: function() {
        if(inArray("change", this.option("valueChangeEvent").split(" ")) === -1) {
            return;
        }

        eventsEngine.on(this._input(), eventUtils.addNamespace(BLUR_EVENT, MASK_EVENT_NAMESPACE), (function(e) {
            // NOTE: input is focused on caret changing in IE(T304159)
            this._suppressCaretChanging(this._changeHandler, [e]);
            this._changeHandler(e);
        }).bind(this));
    },

    _suppressCaretChanging: function(callback, args) {
        var originalCaret = caret;
        caret = stubCaret;
        try {
            callback.apply(this, args);
        } finally {
            caret = originalCaret;
        }
    },

    _changeHandler: function(e) {
        var $input = this._input(),
            inputValue = $input.val();

        if(inputValue === this._changedValue) {
            return;
        }

        this._changedValue = inputValue;
        var changeEvent = eventUtils.createEvent(e, { type: "change" });
        eventsEngine.trigger($input, changeEvent);
    },

    _parseMask: function() {
        this._maskRules = extend({}, buildInMaskRules, this.option("maskRules"));
        this._maskRulesChain = this._parseMaskRule(0);
    },

    _parseMaskRule: function(index) {
        var mask = this.option("mask");
        if(index >= mask.length) {
            return new MaskRules.EmptyMaskRule();
        }

        var currentMaskChar = mask[index];
        var isEscapedChar = currentMaskChar === ESCAPED_CHAR;
        var result = isEscapedChar
        ? new MaskRules.StubMaskRule({ maskChar: mask[index + 1] })
                : this._getMaskRule(currentMaskChar);

        result.next(this._parseMaskRule(index + 1 + isEscapedChar));
        return result;
    },

    _getMaskRule: function(pattern) {
        var ruleConfig;

        each(this._maskRules, function(rulePattern, allowedChars) {
            if(rulePattern === pattern) {
                ruleConfig = {
                    pattern: rulePattern,
                    allowedChars: allowedChars
                };
                return false;
            }
        });

        return isDefined(ruleConfig)
                ? new MaskRules.MaskRule(extend({ maskChar: this.option("maskChar") }, ruleConfig))
                : new MaskRules.StubMaskRule({ maskChar: pattern });
    },

    _renderMaskedValue: function() {
        if(!this._maskRulesChain) {
            return;
        }

        var value = this.option("value") || "";
        this._maskRulesChain.clear(this._normalizeChainArguments());

        var chainArgs = { length: value.length };
        chainArgs[this._isMaskedValueMode() ? "text" : "value"] = value;

        this._handleChain(chainArgs);
        this._displayMask();
    },

    _isMaskedValueMode: function() {
        return this.option("useMaskedValue");
    },

    _displayMask: function(caret) {
        caret = caret || this._caret();
        this._renderValue();
        this._caret(caret);
    },

    _renderValue: function() {
        if(this._maskRulesChain) {
            var text = this._maskRulesChain.text();

            this.option("text", text);

            if(this._$hiddenElement) {
                var value = this._maskRulesChain.value(),
                    hiddenElementValue = this._isMaskedValueMode() ? text : value;

                this._$hiddenElement.val(!stringUtils.isEmpty(value) ? hiddenElementValue : "");
            }
        }
        this.callBase();
    },

    _valueChangeEventHandler: function(e) {
        if(!this._maskRulesChain) {
            this.callBase.apply(this, arguments);
            return;
        }

        this._saveValueChangeEvent(e);
        var value = this._isMaskedValueMode()
                ? (this._textValue || "")
                    .replace(new RegExp("[" + this.option("maskChar") + "]", "g"), " ")
                    .replace(/\s+$/, "")
                : (this._value || "").replace(/\s+$/, "");

        this.option("value", value);
    },

    _maskFocusHandler: function() {
        this._direction(FORWARD_DIRECTION);
        var caret = this._getAdjustedCaret();
        this._caretTimeout = setTimeout(function() {
            this._caret({ start: caret, end: caret });
        }.bind(this), 0);
    },

    _maskKeyDownHandler: function() {
        this._keyPressHandled = false;
    },

    _maskKeyPressHandler: function(e) {
        if(this._keyPressHandled) {
            return;
        }

        this._keyPressHandled = true;

        if(this._isControlKeyFired(e)) {
            return;
        }

        this._maskKeyHandler(e, function() {
            this._handleKey(e.which);
            return true;
        });
    },

    _maskInputHandler: function(e) {
        if(this._keyPressHandled) {
            return;
        }

        this._keyPressHandled = true;

        var inputValue = this._input().val();
        var caret = this._caret();
        caret.start = caret.end - 1;
        var oldValue = inputValue.substring(0, caret.start) + inputValue.substring(caret.end);
        var char = inputValue[caret.start];

        this._input().val(oldValue);

            // NOTE: WP8 can not to handle setCaret immediately after setting value
        this._inputHandlerTimer = setTimeout((function() {
            this._caret({ start: caret.start, end: caret.start });

            this._maskKeyHandler(e, function() {
                this._handleKey(char.charCodeAt());
                return true;
            });
        }).bind(this));
    },

    _isControlKeyFired: function(e) {
        return this._isControlKey(e.key) || e.ctrlKey // NOTE: FF fires control keys on keypress
                || e.metaKey; // NOTE: Safari fires keys with ctrl modifier on keypress
    },

    _maskBackspaceHandler: function(e) {

        var that = this;
        that._keyPressHandled = true;

        var afterBackspaceHandler = function(needAdjustCaret, callBack) {
            if(needAdjustCaret) {
                that._direction(FORWARD_DIRECTION);
                that._adjustCaret();
            }
            var currentCaret = that._caret();
            clearTimeout(that._backspaceHandlerTimeout);
            that._backspaceHandlerTimeout = setTimeout(function() {
                callBack(currentCaret);
            });
        };

        that._maskKeyHandler(e, function() {
            if(that._hasSelection()) {
                afterBackspaceHandler(true, function(currentCaret) {
                    that._displayMask(currentCaret);
                    that._maskRulesChain.reset();
                });
                return;
            }

            if(that._tryMoveCaretBackward()) {
                afterBackspaceHandler(false, function(currentCaret) {
                    that._caret(currentCaret);
                });
                return;
            }

            that._handleKey(EMPTY_CHAR_CODE, BACKWARD_DIRECTION);
            afterBackspaceHandler(true, function(currentCaret) {
                that._displayMask(currentCaret);
                that._maskRulesChain.reset();
            });
        });
    },

    _maskDelHandler: function(e) {
        this._keyPressHandled = true;
        this._maskKeyHandler(e, function() {
            !this._hasSelection() && this._handleKey(EMPTY_CHAR_CODE);
            return true;
        });
    },

    _maskPasteHandler: function(e) {
        this._keyPressHandled = true;
        var caret = this._caret();

        this._maskKeyHandler(e, function() {
            var pastingText = domUtils.clipboardText(e);
            var restText = this._maskRulesChain.text().substring(caret.end);

            var accepted = this._handleChain({ text: pastingText, start: caret.start, length: pastingText.length });
            var newCaret = caret.start + accepted;

            this._handleChain({ text: restText, start: newCaret, length: restText.length });

            this._caret({ start: newCaret, end: newCaret });

            return true;
        });
    },

    _handleChain: function(args) {
        var handledCount = this._maskRulesChain.handle(this._normalizeChainArguments(args));
        this._value = this._maskRulesChain.value();
        this._textValue = this._maskRulesChain.text();
        return handledCount;
    },

    _normalizeChainArguments: function(args) {
        args = args || {};
        args.index = 0;
        args.fullText = this._maskRulesChain.text();
        return args;
    },

    _maskCutHandler: function(e) {
        var caret = this._caret();
        var selectedText = this._input().val().substring(caret.start, caret.end);

        this._maskKeyHandler(e, function() {
            domUtils.clipboardText(e, selectedText);
            return true;
        });
    },

    _maskDragHandler: function() {
        this._clearDragTimer();
        this._dragTimer = setTimeout((function() {
            this.option("value", this._convertToValue(this._input().val()));
        }).bind(this));
    },

    _convertToValue: function(text) {
        return text.replace(new RegExp(this.option("maskChar"), "g"), EMPTY_CHAR);
    },

    _maskKeyHandler: function(e, tryHandleKeyCallback) {
        if(this.option("readOnly")) {
            return;
        }

        this._direction(FORWARD_DIRECTION);
        e.preventDefault();

        this._handleSelection();

        if(!tryHandleKeyCallback.call(this)) {
            return;
        }

        this._direction(FORWARD_DIRECTION);
        this._adjustCaret();
        this._displayMask();
        this._maskRulesChain.reset();
    },

    _handleKey: function(keyCode, direction) {
        var char = String.fromCharCode(keyCode);
        this._direction(direction || FORWARD_DIRECTION);
        this._adjustCaret(char);
        this._handleKeyChain(char);
        this._moveCaret();
    },

    _handleSelection: function() {
        if(!this._hasSelection()) {
            return;
        }

        var caret = this._caret();
        var emptyChars = new Array(caret.end - caret.start + 1).join(EMPTY_CHAR);
        this._handleKeyChain(emptyChars);
    },

    _handleKeyChain: function(chars) {
        var caret = this._caret();
        var start = this._isForwardDirection() ? caret.start : caret.start - 1;
        var end = this._isForwardDirection() ? caret.end : caret.end - 1;
        var length = start === end ? 1 : end - start;

        this._handleChain({ text: chars, start: start, length: length });
    },

    _tryMoveCaretBackward: function() {
        this._direction(BACKWARD_DIRECTION);
        var currentCaret = this._caret().start;
        this._adjustCaret();
        return !currentCaret || currentCaret !== this._caret().start;
    },

    _getAdjustedCaret: function(char) {
        var caret = this._maskRulesChain.adjustedCaret(this._caret().start, this._isForwardDirection(), char);
        return caret;
    },

    _adjustCaret: function(char) {
        var caret = this._getAdjustedCaret(char);
        this._caret({ start: caret, end: caret });
    },

    _moveCaret: function() {
        var currentCaret = this._caret().start;
        var maskRuleIndex = currentCaret + (this._isForwardDirection() ? 0 : -1);

        var caret = this._maskRulesChain.isAccepted(maskRuleIndex)
                ? currentCaret + (this._isForwardDirection() ? 1 : -1)
                : currentCaret;

        this._caret({ start: caret, end: caret });
    },

    _caret: function(position) {
        if(!arguments.length) {
            return caret(this._input());
        }
        caret(this._input(), position);
    },

    _hasSelection: function() {
        var caret = this._caret();
        return caret.start !== caret.end;
    },

    _direction: function(direction) {
        if(!arguments.length) {
            return this._typingDirection;
        }

        this._typingDirection = direction;
    },

    _isForwardDirection: function() {
        return this._direction() === FORWARD_DIRECTION;
    },

    _clearDragTimer: function() {
        clearTimeout(this._dragTimer);
    },

    _clean: function() {
        this._clearDragTimer();
        this.callBase();
    },

    _validateMask: function() {
        if(!this._maskRulesChain) {
            return;
        }
        var isValid = this._maskRulesChain.isValid(this._normalizeChainArguments());

        this.option({
            isValid: isValid,
            validationError: isValid ? null : { editorSpecific: true, message: this.option("maskInvalidMessage") }
        });
    },

    _dispose: function() {
        clearTimeout(this._inputHandlerTimer);
        clearTimeout(this._backspaceHandlerTimeout);
        clearTimeout(this._caretTimeout);
        this.callBase();
    },

    _updateHiddenElement: function() {
        if(this.option("mask")) {
            this._input().removeAttr("name");
            this._renderHiddenElement();
        } else {
            this._removeHiddenElement();
        }
        this._setSubmitElementName(this.option("name"));
    },

    _updateMaskOption: function() {
        this._updateHiddenElement();
        this._renderMask();
        this._validateMask();
    },

    _processEmptyMask: function(mask) {
        if(mask) return;

        var value = this.option("value");
        this.option({
            text: value,
            isValid: true
        });
        this.validationRequest.fire({
            value: value,
            editor: this
        });
        this._renderValue();
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "mask":
                this._updateMaskOption();
                this._processEmptyMask(args.value);
                break;
            case "maskChar":
            case "maskRules":
            case "useMaskedValue":
                this._updateMaskOption();
                break;
            case "value":
                this._renderMaskedValue();
                this._validateMask();
                this.callBase(args);
                break;
            case "maskInvalidMessage":
                break;
            default:
                this.callBase(args);
        }
    }

});

module.exports = TextEditorMask;
