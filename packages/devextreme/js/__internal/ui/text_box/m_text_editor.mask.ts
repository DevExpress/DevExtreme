import eventsEngine from '@js/common/core/events/core/events_engine';
import { name as wheelEventName } from '@js/common/core/events/core/wheel';
import {
  addNamespace, createEvent, isCommandKeyPressed, normalizeKeyName,
} from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isEmpty } from '@js/core/utils/string';
import { isDefined } from '@js/core/utils/type';
import { focused } from '@ts/core/utils/m_selectors';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';

import type { TextEditorBaseProperties } from './m_text_editor.base';
import TextEditorBase from './m_text_editor.base';
import { EmptyMaskRule, MaskRule, StubMaskRule } from './m_text_editor.mask.rule';
import MaskStrategy from './m_text_editor.mask.strategy';
import type { CaretRange } from './utils.caret';
import caretUtils from './utils.caret';

type MaskRules = Record<string, RegExp | ((char: string) => boolean)>;

type CaretDirection = 'forward' | 'backward';

const EMPTY_CHAR = ' ';
const ESCAPED_CHAR = '\\';

const TEXTEDITOR_MASKED_CLASS = 'dx-texteditor-masked';
const FORWARD_DIRECTION = 'forward';
const BACKWARD_DIRECTION = 'backward';

const DROP_EVENT_NAME = 'drop';

const isNumericChar = (char: string): boolean => /[0-9]/.test(char);

const isLiteralChar = (char: string): boolean => {
  const code = char.charCodeAt(0);

  return (code > 64 && code < 91) || (code > 96 && code < 123) || code > 127;
};

const isSpaceChar = (char: string): boolean => char === ' ';

const buildInMaskRules: MaskRules = {
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

class TextEditorMask<
  TProperties extends TextEditorBaseProperties= TextEditorBaseProperties,
> extends TextEditorBase<TProperties> {
  _changedValue?: any;

  _maskStrategy!: MaskStrategy;

  _$hiddenElement!: dxElementWrapper;

  _typingDirection?: CaretDirection;

  _maskRulesChain?: any;

  _maskRules?: MaskRules;

  _textValue?: any;

  _value?: any;

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      mask: '',

      maskChar: '_',

      maskRules: {},

      maskInvalidMessage: messageLocalization.format('validation-mask'),

      useMaskedValue: false,

      showMaskMode: 'always',
    };
  }

  _supportedKeys(): SupportedKeys {
    const that = this;

    const keyHandlerMap = {
      del: that._maskStrategy.getHandler('del'),
      enter: that._changeHandler,
    };

    const result = super._supportedKeys();
    each(keyHandlerMap, (key, callback) => {
      const parentHandler = result[key];
      result[key] = function (e) {
        that.option('mask') && callback.call(that, e);
        parentHandler && parentHandler(e);
      };
    });

    return result;
  }

  _getSubmitElement(): dxElementWrapper {
    return !this.option('mask') ? super._getSubmitElement() : this._$hiddenElement;
  }

  _init(): void {
    super._init();

    this._initMaskStrategy();
  }

  _initMaskStrategy(): void {
    // @ts-expect-error MaskStrategy bad typification
    this._maskStrategy = new MaskStrategy(this);
  }

  _initMarkup(): void {
    this._renderHiddenElement();
    super._initMarkup();
  }

  _attachMouseWheelEventHandlers(): void {
    if (!this._hasMouseWheelHandler()) {
      return;
    }

    const input = this._input();
    // @ts-expect-error ts-error
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
  }

  _hasMouseWheelHandler(): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _onMouseWheel(e?): void {}

  _useMaskBehavior(): boolean {
    return Boolean(this.option('mask'));
  }

  _attachDropEventHandler(): void {
    const useMaskBehavior = this._useMaskBehavior();

    if (!useMaskBehavior) {
      return;
    }
    // @ts-expect-error
    const eventName = addNamespace(DROP_EVENT_NAME, this.NAME);
    const input = this._input();

    eventsEngine.off(input, eventName);
    eventsEngine.on(input, eventName, (e) => e.preventDefault());
  }

  _render(): void {
    this._attachMouseWheelEventHandlers();
    this._renderMask();
    super._render();
    this._attachDropEventHandler();
  }

  _renderHiddenElement(): void {
    if (this.option('mask')) {
      this._$hiddenElement = $('<input>')
        .attr('type', 'hidden')
        .appendTo(this._inputWrapper());
    }
  }

  _removeHiddenElement(): void {
    this._$hiddenElement && this._$hiddenElement.remove();
  }

  _renderMask(): void {
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
  }

  _changeHandler(e): void {
    const $input = this._input();
    const inputValue = $input.val();

    if (inputValue === this._changedValue) {
      return;
    }

    this._changedValue = inputValue;
    const changeEvent = createEvent(e, { type: 'change' });
    // @ts-expect-error
    eventsEngine.trigger($input, changeEvent);
  }

  _parseMask(): void {
    this._maskRules = extend({}, buildInMaskRules, this.option('maskRules'));
    this._maskRulesChain = this._parseMaskRule(0);
  }

  _parseMaskRule(index: number): EmptyMaskRule | StubMaskRule | MaskRule {
    const { mask } = this.option();
    // @ts-expect-error ts-error
    if (index >= mask.length) {
      // @ts-expect-error ts-error
      return new EmptyMaskRule();
    }
    // @ts-expect-error
    const currentMaskChar = mask[index];
    const isEscapedChar = currentMaskChar === ESCAPED_CHAR;
    const result = isEscapedChar
      // @ts-expect-error
      ? new StubMaskRule({ maskChar: mask[index + 1] })
      : this._getMaskRule(currentMaskChar);
    // @ts-expect-error
    result.next(this._parseMaskRule(index + 1 + isEscapedChar));
    return result;
  }

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
  }

  _renderMaskedValue(): void {
    if (!this._maskRulesChain) {
      return;
    }

    const value = this.option('value') || '';
    this._maskRulesChain.clear(this._normalizeChainArguments());
    // @ts-expect-error ts-error
    const chainArgs = { length: value.length };
    chainArgs[this._isMaskedValueMode() ? 'text' : 'value'] = value;

    this._handleChain(chainArgs);
    this._displayMask();
  }

  _replaceSelectedText(text, selection, char) {
    if (char === undefined) {
      return text;
    }

    const textBefore = text.slice(0, selection.start);
    const textAfter = text.slice(selection.end);
    const edited = textBefore + char + textAfter;

    return edited;
  }

  _isMaskedValueMode() {
    return this.option('useMaskedValue');
  }

  _displayMask(caret?): void {
    caret = caret || this._caret();
    this._renderValue();
    this._caret(caret);
  }

  _isValueEmpty() {
    return isEmpty(this._value);
  }

  _shouldShowMask(): boolean {
    const { showMaskMode } = this.option();

    if (showMaskMode === 'onFocus') {
      return focused(this._input()) || !this._isValueEmpty();
    }

    return true;
  }

  _showMaskPlaceholder(): void {
    if (this._shouldShowMask()) {
      const text = this._maskRulesChain.text();
      this.option('text', text);

      const { showMaskMode } = this.option();

      if (showMaskMode === 'onFocus') {
        this._renderDisplayText(text);
      }
    }
  }

  _renderValue(): DeferredObj<unknown> {
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
    return super._renderValue();
  }

  _getPreparedValue() {
    return this._convertToValue().replace(/\s+$/, '');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _valueChangeEventHandler(e, value?): void {
    if (!this._maskRulesChain) {
      // @ts-expect-error
      super._valueChangeEventHandler.apply(this, arguments);
      return;
    }

    this._saveValueChangeEvent(e);

    this.option('value', this._getPreparedValue());
  }

  _isControlKeyFired(e) {
    // @ts-expect-error
    return this._isControlKey(normalizeKeyName(e)) || isCommandKeyPressed(e);
  }

  _handleChain(args) {
    const handledCount = this._maskRulesChain.handle(this._normalizeChainArguments(args));
    this._updateMaskInfo();
    return handledCount;
  }

  _normalizeChainArguments(args?) {
    args = args || {};
    args.index = 0;
    args.fullText = this._maskRulesChain.text();
    return args;
  }

  _convertToValue(text?) {
    if (this._isMaskedValueMode()) {
      text = this._replaceMaskCharWithEmpty(text || this._textValue || '');
    } else {
      text = text || this._value || '';
    }

    return text;
  }

  _replaceMaskCharWithEmpty(text) {
    const { maskChar } = this.option();
    // @ts-expect-error ts-error
    return text.replace(new RegExp(maskChar, 'g'), EMPTY_CHAR);
  }

  _maskKeyHandler(e, keyHandler): void {
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
  }

  _handleKey(key, direction): void {
    this._direction(direction || FORWARD_DIRECTION);
    this._adjustCaret(key);
    this._handleKeyChain(key);
    this._moveCaret();
  }

  _handleSelection(): void {
    if (!this._hasSelection()) {
      return;
    }

    const caret = this._caret();
    const emptyChars = new Array(caret.end - caret.start + 1).join(EMPTY_CHAR);
    this._handleKeyChain(emptyChars);
  }

  _handleKeyChain(chars): void {
    const caret = this._caret();
    const start = this.isForwardDirection() ? caret.start : caret.start - 1;
    const end = this.isForwardDirection() ? caret.end : caret.end - 1;
    const length = start === end ? 1 : end - start;

    this._handleChain({ text: chars, start, length });
  }

  _tryMoveCaretBackward(): boolean {
    this.setBackwardDirection();
    const currentCaret = this._caret().start;
    this._adjustCaret();
    return !currentCaret || currentCaret !== this._caret().start;
  }

  _adjustCaret(char?): void {
    const caretStart = this._caret().start;
    const isForwardDirection = this.isForwardDirection();

    const caret = this._maskRulesChain.adjustedCaret(caretStart, isForwardDirection, char);
    this._caret({ start: caret, end: caret });
  }

  _moveCaret(): void {
    const currentCaret = this._caret().start;
    const maskRuleIndex = currentCaret + (this.isForwardDirection() ? 0 : -1);

    const caret = this._maskRulesChain.isAccepted(maskRuleIndex)
      ? currentCaret + (this.isForwardDirection() ? 1 : -1)
      : currentCaret;

    this._caret({ start: caret, end: caret });
  }

  _caret(
    position?: { start: number; end: number },
    force?,
    // @ts-expect-error
  ): CaretRange {
    const $input = this._input();

    if (!$input.length) {
      // @ts-expect-error
      return;
    }

    if (!arguments.length) {
      // @ts-expect-error
      return caretUtils($input);
    }

    caretUtils($input, position, force);
  }

  _hasSelection(): boolean {
    const caret = this._caret();

    return caret.start !== caret.end;
  }

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type, consistent-return
  _direction(direction?: CaretDirection): CaretDirection | void {
    if (!arguments.length) {
      return this._typingDirection;
    }

    this._typingDirection = direction;
  }

  setForwardDirection(): void {
    this._direction(FORWARD_DIRECTION);
  }

  setBackwardDirection(): void {
    this._direction(BACKWARD_DIRECTION);
  }

  isForwardDirection(): boolean {
    return this._direction() === FORWARD_DIRECTION;
  }

  _updateMaskInfo(): void {
    this._textValue = this._maskRulesChain.text();
    this._value = this._maskRulesChain.value();
  }

  _clean(): void {
    this._maskStrategy && this._maskStrategy.clean();
    super._clean();
  }

  _validateMask(): void {
    if (!this._maskRulesChain) {
      return;
    }
    const isValid = isEmpty(this.option('value')) || this._maskRulesChain.isValid(this._normalizeChainArguments());

    this.option({
      isValid,
      validationError: isValid ? null : { editorSpecific: true, message: this.option('maskInvalidMessage') },
    });
  }

  _updateHiddenElement(): void {
    this._removeHiddenElement();

    if (this.option('mask')) {
      this._input().removeAttr('name');
      this._renderHiddenElement();
    }

    const { name } = this.option();

    this._setSubmitElementName(name);
  }

  _updateMaskOption(): void {
    this._updateHiddenElement();
    this._renderMask();
    this._validateMask();
    this._refreshValueChangeEvent();
  }

  _processEmptyMask(mask): void {
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
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
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
        super._optionChanged(args);

        this._changedValue = this._input().val();
        break;
      case 'maskInvalidMessage':
        break;
      case 'showMaskMode':
        this.option('text', '');
        this._renderValue();
        break;
      default:
        super._optionChanged(args);
    }
  }

  clear(): void {
    const { value: defaultValue } = this._getDefaultOptions();
    if (this.option('value') === defaultValue) {
      this._renderMaskedValue();
    }
    super.clear();
  }
}

export default TextEditorMask;
