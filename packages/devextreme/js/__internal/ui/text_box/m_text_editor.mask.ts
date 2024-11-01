import eventsEngine from '@js/common/core/events/core/events_engine';
import { name as wheelEventName } from '@js/common/core/events/core/wheel';
import {
  addNamespace, createEvent, isCommandKeyPressed, normalizeKeyName,
} from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isEmpty } from '@js/core/utils/string';
import { isDefined } from '@js/core/utils/type';
import { focused } from '@js/ui/widget/selectors';

import TextEditorBase from './m_text_editor.base';
import { EmptyMaskRule, MaskRule, StubMaskRule } from './m_text_editor.mask.rule';
import MaskStrategy from './m_text_editor.mask.strategy';
import caretUtils from './m_utils.caret';

const caret = caretUtils;

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
  },
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

const TextEditorMask = TextEditorBase.inherit({

  _getDefaultOptions() {
    return extend(this.callBase(), {
      mask: '',

      maskChar: '_',

      maskRules: {},

      maskInvalidMessage: messageLocalization.format('validation-mask'),

      useMaskedValue: false,

      showMaskMode: 'always',
    });
  },

  _supportedKeys() {
    const that = this;

    const keyHandlerMap = {
      del: that._maskStrategy.getHandler('del'),
      enter: that._changeHandler,
    };

    const result = that.callBase();
    each(keyHandlerMap, (key, callback) => {
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
    this._maskStrategy = new MaskStrategy(this);
  },

  _initMarkup() {
    this._renderHiddenElement();
    this.callBase();
  },

  _attachMouseWheelEventHandlers() {
    const hasMouseWheelHandler = this._onMouseWheel !== noop;

    if (!hasMouseWheelHandler) {
      return;
    }

    const input = this._input();
    const eventName = addNamespace(wheelEventName, this.NAME);
    const mouseWheelAction = this._createAction((e) => {
      const { event } = e;

      if (focused(input) && !isCommandKeyPressed(event)) {
        this._onMouseWheel(event);
        event.preventDefault();
        event.stopPropagation();
      }
    });

    eventsEngine.off(input, eventName);
    eventsEngine.on(input, eventName, (e) => {
      mouseWheelAction({ event: e });
    });
  },

  _onMouseWheel: noop,

  _useMaskBehavior() {
    return Boolean(this.option('mask'));
  },

  _attachDropEventHandler() {
    const useMaskBehavior = this._useMaskBehavior();

    if (!useMaskBehavior) {
      return;
    }

    const eventName = addNamespace(DROP_EVENT_NAME, this.NAME);
    const input = this._input();

    eventsEngine.off(input, eventName);
    eventsEngine.on(input, eventName, (e) => e.preventDefault());
  },

  _render() {
    this._attachMouseWheelEventHandlers();
    this._renderMask();
    this.callBase();
    this._attachDropEventHandler();
  },

  _renderHiddenElement() {
    if (this.option('mask')) {
      this._$hiddenElement = $('<input>')
        .attr('type', 'hidden')
        .appendTo(this._inputWrapper());
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
    const changeEvent = createEvent(e, { type: 'change' });
    // @ts-expect-error
    eventsEngine.trigger($input, changeEvent);
  },

  _parseMask() {
    this._maskRules = extend({}, buildInMaskRules, this.option('maskRules'));
    this._maskRulesChain = this._parseMaskRule(0);
  },

  _parseMaskRule(index) {
    const mask = this.option('mask');
    if (index >= mask.length) {
      // @ts-expect-error
      return new EmptyMaskRule();
    }

    const currentMaskChar = mask[index];
    const isEscapedChar = currentMaskChar === ESCAPED_CHAR;
    const result = isEscapedChar
      ? new StubMaskRule({ maskChar: mask[index + 1] })
      : this._getMaskRule(currentMaskChar);

    result.next(this._parseMaskRule(index + 1 + isEscapedChar));
    return result;
  },

  _getMaskRule(pattern) {
    let ruleConfig;
    // @ts-expect-error
    each(this._maskRules, (rulePattern, allowedChars) => {
      if (rulePattern === pattern) {
        ruleConfig = {
          pattern: rulePattern,
          allowedChars,
        };
        return false;
      }
    });

    return isDefined(ruleConfig)
      ? new MaskRule(extend({ maskChar: this.option('maskChar') || ' ' }, ruleConfig))
      : new StubMaskRule({ maskChar: pattern });
  },

  _renderMaskedValue() {
    if (!this._maskRulesChain) {
      return;
    }

    const value = this.option('value') || '';
    this._maskRulesChain.clear(this._normalizeChainArguments());

    const chainArgs = { length: value.length };
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
    return isEmpty(this._value);
  },

  _shouldShowMask() {
    const showMaskMode = this.option('showMaskMode');

    if (showMaskMode === 'onFocus') {
      return focused(this._input()) || !this._isValueEmpty();
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
        const submitElementValue = !isEmpty(value)
          ? this._getPreparedValue()
          : '';

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
    return this._isControlKey(normalizeKeyName(e)) || isCommandKeyPressed(e);
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
        eventsEngine.trigger(this._input(), 'input');
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

    this._handleChain({ text: chars, start, length });
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
    this._caret({ start: caret, end: caret });
  },

  _moveCaret() {
    const currentCaret = this._caret().start;
    const maskRuleIndex = currentCaret + (this.isForwardDirection() ? 0 : -1);

    const caret = this._maskRulesChain.isAccepted(maskRuleIndex)
      ? currentCaret + (this.isForwardDirection() ? 1 : -1)
      : currentCaret;

    this._caret({ start: caret, end: caret });
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
    const isValid = isEmpty(this.option('value')) || this._maskRulesChain.isValid(this._normalizeChainArguments());

    this.option({
      isValid,
      validationError: isValid ? null : { editorSpecific: true, message: this.option('maskInvalidMessage') },
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
      validationError: null,
    });

    this.validationRequest.fire({
      value,
      editor: this,
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
    const { value: defaultValue } = this._getDefaultOptions();
    if (this.option('value') === defaultValue) {
      this._renderMaskedValue();
    }
    this.callBase();
  },
});

export default TextEditorMask;
