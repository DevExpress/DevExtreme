"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _common = require("../../../core/utils/common");
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _string = require("../../../core/utils/string");
var _type = require("../../../core/utils/type");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _wheel = require("../../../events/core/wheel");
var _index = require("../../../events/utils/index");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _selectors = require("../../../ui/widget/selectors");
var _m_text_editor = _interopRequireDefault(require("./m_text_editor.base"));
var _m_text_editorMask = require("./m_text_editor.mask.rule");
var _m_text_editorMask2 = _interopRequireDefault(require("./m_text_editor.mask.strategy"));
var _m_utils = _interopRequireDefault(require("./m_utils.caret"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const caret = _m_utils.default;
const EMPTY_CHAR = ' ';
const ESCAPED_CHAR = '\\';
const TEXTEDITOR_MASKED_CLASS = 'dx-texteditor-masked';
const FORWARD_DIRECTION = 'forward';
const BACKWARD_DIRECTION = 'backward';
const DROP_EVENT_NAME = 'drop';
const buildInMaskRules = {
  0: /[0-9]/,
  9: /[0-9\s]/,
  '#': /[-+0-9\s]/,
  L(char) {
    return isLiteralChar(char);
  },
  l(char) {
    return isLiteralChar(char) || isSpaceChar(char);
  },
  C: /\S/,
  c: /./,
  A(char) {
    return isLiteralChar(char) || isNumericChar(char);
  },
  a(char) {
    return isLiteralChar(char) || isNumericChar(char) || isSpaceChar(char);
  }
};
function isNumericChar(char) {
  return /[0-9]/.test(char);
}
function isLiteralChar(char) {
  const code = char.charCodeAt();
  return code > 64 && code < 91 || code > 96 && code < 123 || code > 127;
}
function isSpaceChar(char) {
  return char === ' ';
}
const TextEditorMask = _m_text_editor.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      mask: '',
      maskChar: '_',
      maskRules: {},
      maskInvalidMessage: _message.default.format('validation-mask'),
      useMaskedValue: false,
      showMaskMode: 'always'
    });
  },
  _supportedKeys() {
    const that = this;
    const keyHandlerMap = {
      del: that._maskStrategy.getHandler('del'),
      enter: that._changeHandler
    };
    const result = that.callBase();
    (0, _iterator.each)(keyHandlerMap, (key, callback) => {
      const parentHandler = result[key];
      result[key] = function (e) {
        that.option('mask') && callback.call(that, e);
        parentHandler && parentHandler(e);
      };
    });
    return result;
  },
  _getSubmitElement() {
    return !this.option('mask') ? this.callBase() : this._$hiddenElement;
  },
  _init() {
    this.callBase();
    this._initMaskStrategy();
  },
  _initMaskStrategy() {
    this._maskStrategy = new _m_text_editorMask2.default(this);
  },
  _initMarkup() {
    this._renderHiddenElement();
    this.callBase();
  },
  _attachMouseWheelEventHandlers() {
    const hasMouseWheelHandler = this._onMouseWheel !== _common.noop;
    if (!hasMouseWheelHandler) {
      return;
    }
    const input = this._input();
    const eventName = (0, _index.addNamespace)(_wheel.name, this.NAME);
    const mouseWheelAction = this._createAction(e => {
      const {
        event
      } = e;
      if ((0, _selectors.focused)(input) && !(0, _index.isCommandKeyPressed)(event)) {
        this._onMouseWheel(event);
        event.preventDefault();
        event.stopPropagation();
      }
    });
    _events_engine.default.off(input, eventName);
    _events_engine.default.on(input, eventName, e => {
      mouseWheelAction({
        event: e
      });
    });
  },
  _onMouseWheel: _common.noop,
  _useMaskBehavior() {
    return Boolean(this.option('mask'));
  },
  _attachDropEventHandler() {
    const useMaskBehavior = this._useMaskBehavior();
    if (!useMaskBehavior) {
      return;
    }
    const eventName = (0, _index.addNamespace)(DROP_EVENT_NAME, this.NAME);
    const input = this._input();
    _events_engine.default.off(input, eventName);
    _events_engine.default.on(input, eventName, e => e.preventDefault());
  },
  _render() {
    this._attachMouseWheelEventHandlers();
    this._renderMask();
    this.callBase();
    this._attachDropEventHandler();
  },
  _renderHiddenElement() {
    if (this.option('mask')) {
      this._$hiddenElement = (0, _renderer.default)('<input>').attr('type', 'hidden').appendTo(this._inputWrapper());
    }
  },
  _removeHiddenElement() {
    this._$hiddenElement && this._$hiddenElement.remove();
  },
  _renderMask() {
    this.$element().removeClass(TEXTEDITOR_MASKED_CLASS);
    this._maskRulesChain = null;
    this._maskStrategy.detachEvents();
    if (!this.option('mask')) {
      return;
    }
    this.$element().addClass(TEXTEDITOR_MASKED_CLASS);
    this._maskStrategy.attachEvents();
    this._parseMask();
    this._renderMaskedValue();
  },
  _changeHandler(e) {
    const $input = this._input();
    const inputValue = $input.val();
    if (inputValue === this._changedValue) {
      return;
    }
    this._changedValue = inputValue;
    const changeEvent = (0, _index.createEvent)(e, {
      type: 'change'
    });
    // @ts-expect-error
    _events_engine.default.trigger($input, changeEvent);
  },
  _parseMask() {
    this._maskRules = (0, _extend.extend)({}, buildInMaskRules, this.option('maskRules'));
    this._maskRulesChain = this._parseMaskRule(0);
  },
  _parseMaskRule(index) {
    const mask = this.option('mask');
    if (index >= mask.length) {
      // @ts-expect-error
      return new _m_text_editorMask.EmptyMaskRule();
    }
    const currentMaskChar = mask[index];
    const isEscapedChar = currentMaskChar === ESCAPED_CHAR;
    const result = isEscapedChar ? new _m_text_editorMask.StubMaskRule({
      maskChar: mask[index + 1]
    }) : this._getMaskRule(currentMaskChar);
    result.next(this._parseMaskRule(index + 1 + isEscapedChar));
    return result;
  },
  _getMaskRule(pattern) {
    let ruleConfig;
    // @ts-expect-error
    (0, _iterator.each)(this._maskRules, (rulePattern, allowedChars) => {
      if (rulePattern === pattern) {
        ruleConfig = {
          pattern: rulePattern,
          allowedChars
        };
        return false;
      }
    });
    return (0, _type.isDefined)(ruleConfig) ? new _m_text_editorMask.MaskRule((0, _extend.extend)({
      maskChar: this.option('maskChar') || ' '
    }, ruleConfig)) : new _m_text_editorMask.StubMaskRule({
      maskChar: pattern
    });
  },
  _renderMaskedValue() {
    if (!this._maskRulesChain) {
      return;
    }
    const value = this.option('value') || '';
    this._maskRulesChain.clear(this._normalizeChainArguments());
    const chainArgs = {
      length: value.length
    };
    chainArgs[this._isMaskedValueMode() ? 'text' : 'value'] = value;
    this._handleChain(chainArgs);
    this._displayMask();
  },
  _replaceSelectedText(text, selection, char) {
    if (char === undefined) {
      return text;
    }
    const textBefore = text.slice(0, selection.start);
    const textAfter = text.slice(selection.end);
    const edited = textBefore + char + textAfter;
    return edited;
  },
  _isMaskedValueMode() {
    return this.option('useMaskedValue');
  },
  _displayMask(caret) {
    caret = caret || this._caret();
    this._renderValue();
    this._caret(caret);
  },
  _isValueEmpty() {
    return (0, _string.isEmpty)(this._value);
  },
  _shouldShowMask() {
    const showMaskMode = this.option('showMaskMode');
    if (showMaskMode === 'onFocus') {
      return (0, _selectors.focused)(this._input()) || !this._isValueEmpty();
    }
    return true;
  },
  _showMaskPlaceholder() {
    if (this._shouldShowMask()) {
      const text = this._maskRulesChain.text();
      this.option('text', text);
      if (this.option('showMaskMode') === 'onFocus') {
        this._renderDisplayText(text);
      }
    }
  },
  _renderValue() {
    if (this._maskRulesChain) {
      this._showMaskPlaceholder();
      if (this._$hiddenElement) {
        const value = this._maskRulesChain.value();
        const submitElementValue = !(0, _string.isEmpty)(value) ? this._getPreparedValue() : '';
        this._$hiddenElement.val(submitElementValue);
      }
    }
    return this.callBase();
  },
  _getPreparedValue() {
    return this._convertToValue().replace(/\s+$/, '');
  },
  _valueChangeEventHandler(e) {
    if (!this._maskRulesChain) {
      this.callBase.apply(this, arguments);
      return;
    }
    this._saveValueChangeEvent(e);
    this.option('value', this._getPreparedValue());
  },
  _isControlKeyFired(e) {
    return this._isControlKey((0, _index.normalizeKeyName)(e)) || (0, _index.isCommandKeyPressed)(e);
  },
  _handleChain(args) {
    const handledCount = this._maskRulesChain.handle(this._normalizeChainArguments(args));
    this._updateMaskInfo();
    return handledCount;
  },
  _normalizeChainArguments(args) {
    args = args || {};
    args.index = 0;
    args.fullText = this._maskRulesChain.text();
    return args;
  },
  _convertToValue(text) {
    if (this._isMaskedValueMode()) {
      text = this._replaceMaskCharWithEmpty(text || this._textValue || '');
    } else {
      text = text || this._value || '';
    }
    return text;
  },
  _replaceMaskCharWithEmpty(text) {
    return text.replace(new RegExp(this.option('maskChar'), 'g'), EMPTY_CHAR);
  },
  _maskKeyHandler(e, keyHandler) {
    if (this.option('readOnly')) {
      return;
    }
    this.setForwardDirection();
    e.preventDefault();
    this._handleSelection();
    const previousText = this._input().val();
    const raiseInputEvent = () => {
      if (previousText !== this._input().val()) {
        // @ts-expect-error
        _events_engine.default.trigger(this._input(), 'input');
      }
    };
    const handled = keyHandler();
    if (handled) {
      handled.then(raiseInputEvent);
    } else {
      this.setForwardDirection();
      this._adjustCaret();
      this._displayMask();
      this._maskRulesChain.reset();
      raiseInputEvent();
    }
  },
  _handleKey(key, direction) {
    this._direction(direction || FORWARD_DIRECTION);
    this._adjustCaret(key);
    this._handleKeyChain(key);
    this._moveCaret();
  },
  _handleSelection() {
    if (!this._hasSelection()) {
      return;
    }
    const caret = this._caret();
    const emptyChars = new Array(caret.end - caret.start + 1).join(EMPTY_CHAR);
    this._handleKeyChain(emptyChars);
  },
  _handleKeyChain(chars) {
    const caret = this._caret();
    const start = this.isForwardDirection() ? caret.start : caret.start - 1;
    const end = this.isForwardDirection() ? caret.end : caret.end - 1;
    const length = start === end ? 1 : end - start;
    this._handleChain({
      text: chars,
      start,
      length
    });
  },
  _tryMoveCaretBackward() {
    this.setBackwardDirection();
    const currentCaret = this._caret().start;
    this._adjustCaret();
    return !currentCaret || currentCaret !== this._caret().start;
  },
  _adjustCaret(char) {
    const caretStart = this._caret().start;
    const isForwardDirection = this.isForwardDirection();
    const caret = this._maskRulesChain.adjustedCaret(caretStart, isForwardDirection, char);
    this._caret({
      start: caret,
      end: caret
    });
  },
  _moveCaret() {
    const currentCaret = this._caret().start;
    const maskRuleIndex = currentCaret + (this.isForwardDirection() ? 0 : -1);
    const caret = this._maskRulesChain.isAccepted(maskRuleIndex) ? currentCaret + (this.isForwardDirection() ? 1 : -1) : currentCaret;
    this._caret({
      start: caret,
      end: caret
    });
  },
  _caret(position, force) {
    const $input = this._input();
    if (!$input.length) {
      return;
    }
    if (!arguments.length) {
      return caret($input);
    }
    caret($input, position, force);
  },
  _hasSelection() {
    const caret = this._caret();
    return caret.start !== caret.end;
  },
  _direction(direction) {
    if (!arguments.length) {
      return this._typingDirection;
    }
    this._typingDirection = direction;
  },
  setForwardDirection() {
    this._direction(FORWARD_DIRECTION);
  },
  setBackwardDirection() {
    this._direction(BACKWARD_DIRECTION);
  },
  isForwardDirection() {
    return this._direction() === FORWARD_DIRECTION;
  },
  _updateMaskInfo() {
    this._textValue = this._maskRulesChain.text();
    this._value = this._maskRulesChain.value();
  },
  _clean() {
    this._maskStrategy && this._maskStrategy.clean();
    this.callBase();
  },
  _validateMask() {
    if (!this._maskRulesChain) {
      return;
    }
    const isValid = (0, _string.isEmpty)(this.option('value')) || this._maskRulesChain.isValid(this._normalizeChainArguments());
    this.option({
      isValid,
      validationError: isValid ? null : {
        editorSpecific: true,
        message: this.option('maskInvalidMessage')
      }
    });
  },
  _updateHiddenElement() {
    this._removeHiddenElement();
    if (this.option('mask')) {
      this._input().removeAttr('name');
      this._renderHiddenElement();
    }
    this._setSubmitElementName(this.option('name'));
  },
  _updateMaskOption() {
    this._updateHiddenElement();
    this._renderMask();
    this._validateMask();
    this._refreshValueChangeEvent();
  },
  _processEmptyMask(mask) {
    if (mask) return;
    const value = this.option('value');
    this.option({
      text: value,
      isValid: true,
      validationError: null
    });
    this.validationRequest.fire({
      value,
      editor: this
    });
    this._renderValue();
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'mask':
        this._updateMaskOption();
        this._processEmptyMask(args.value);
        break;
      case 'maskChar':
      case 'maskRules':
      case 'useMaskedValue':
        this._updateMaskOption();
        break;
      case 'value':
        this._renderMaskedValue();
        this._validateMask();
        this.callBase(args);
        this._changedValue = this._input().val();
        break;
      case 'maskInvalidMessage':
        break;
      case 'showMaskMode':
        this.option('text', '');
        this._renderValue();
        break;
      default:
        this.callBase(args);
    }
  },
  clear() {
    const {
      value: defaultValue
    } = this._getDefaultOptions();
    if (this.option('value') === defaultValue) {
      this._renderMaskedValue();
    }
    this.callBase();
  }
});
var _default = exports.default = TextEditorMask;