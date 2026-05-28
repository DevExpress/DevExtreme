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
import { isEmpty } from '@js/core/utils/string';
import { isDefined } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import { focused } from '@ts/core/utils/m_selectors';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';
import type { ValueChangedEvent } from '@ts/ui/editor/editor';
import type { DxMouseWheelEvent } from '@ts/ui/scroll_view/types';
import type { TextEditorBaseProperties } from '@ts/ui/text_box/text_editor.base';
import TextEditorBase from '@ts/ui/text_box/text_editor.base';
import type { HandlingArgs } from '@ts/ui/text_box/text_editor.mask.rule';
import { EmptyMaskRule, MaskRule, StubMaskRule } from '@ts/ui/text_box/text_editor.mask.rule';
import MaskStrategy from '@ts/ui/text_box/text_editor.mask.strategy';
import type { CaretRange } from '@ts/ui/text_box/utils.caret';
import caretUtils from '@ts/ui/text_box/utils.caret';

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
  _changedValue?: string;

  _maskStrategy!: MaskStrategy;

  _$hiddenElement!: dxElementWrapper;

  _typingDirection?: CaretDirection;

  _maskRulesChain?: EmptyMaskRule | StubMaskRule | MaskRule | null;

  _maskRules?: MaskRules;

  _textValue?: string;

  _value?: string;

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
    const result = super._supportedKeys();

    const keyHandlerMap = {
      del: this._maskStrategy.getHandler('del'),
      enter: this._changeHandler,
    };

    Object.entries(keyHandlerMap).forEach(([key, handler]) => {
      const parentHandler = result[key];

      result[key] = (e: DxEvent<KeyboardEvent>): void => {
        const { mask } = this.option();

        if (mask && handler) {
          handler.call(this, e);
        }

        parentHandler?.(e);
      };
    });

    return result;
  }

  _getSubmitElement(): dxElementWrapper {
    const { mask } = this.option();

    const submitElement = !mask ? super._getSubmitElement() : this._$hiddenElement;

    return submitElement;
  }

  _init(): void {
    super._init();

    this._initMaskStrategy();
  }

  _initMaskStrategy(): void {
    // @ts-expect-error expected
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
    // @ts-expect-error addNamespace with second argument
    const eventName = addNamespace(wheelEventName, this.NAME);

    const mouseWheelAction = this._createAction((e: { event: DxMouseWheelEvent }) => {
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
  _onMouseWheel(e?: DxMouseWheelEvent): void {}

  _useMaskBehavior(): boolean {
    const { mask } = this.option();

    return Boolean(mask);
  }

  _attachDropEventHandler(): void {
    const useMaskBehavior = this._useMaskBehavior();

    if (!useMaskBehavior) {
      return;
    }

    // @ts-expect-error addNamespace with second argument
    const eventName = addNamespace(DROP_EVENT_NAME, this.NAME);
    const input = this._input();

    eventsEngine.off(input, eventName);
    eventsEngine.on(input, eventName, (e: DxEvent<DragEvent>) => { e.preventDefault(); });
  }

  _render(): void {
    this._attachMouseWheelEventHandlers();
    this._renderMask();
    super._render();
    this._attachDropEventHandler();
  }

  _renderHiddenElement(): void {
    const { mask } = this.option();

    if (mask) {
      this._$hiddenElement = $('<input>')
        .attr('type', 'hidden')
        .appendTo(this._inputWrapper());
    }
  }

  _removeHiddenElement(): void {
    this._$hiddenElement?.remove();
  }

  _renderMask(): void {
    this.$element().removeClass(TEXTEDITOR_MASKED_CLASS);
    this._maskRulesChain = null;
    this._maskStrategy.detachEvents();

    const { mask } = this.option();

    if (!mask) {
      return;
    }

    this.$element().addClass(TEXTEDITOR_MASKED_CLASS);
    this._maskStrategy.attachEvents();
    this._parseMask();
    this._renderMaskedValue();
  }

  _changeHandler(e: DxEvent): void {
    const $input = this._input();

    const inputValue = $input.val();

    if (inputValue === this._changedValue) {
      return;
    }

    this._changedValue = inputValue;

    const changeEvent = createEvent(e, { type: 'change' });

    // @ts-expect-error eventsEngine with trigger
    eventsEngine.trigger($input, changeEvent);
  }

  _parseMask(): void {
    const { maskRules } = this.option();

    this._maskRules = extend({}, buildInMaskRules, maskRules);
    this._maskRulesChain = this._parseMaskRule(0);
  }

  _parseMaskRule(index: number): EmptyMaskRule | StubMaskRule | MaskRule {
    const { mask } = this.option();

    if (!isDefined(mask) || index >= mask.length) {
      return new EmptyMaskRule({});
    }

    const currentMaskChar = mask[index];
    const isEscapedChar = currentMaskChar === ESCAPED_CHAR;

    const result = isEscapedChar
      ? new StubMaskRule({ maskChar: mask[index + 1] })
      : this._getMaskRule(currentMaskChar);

    const nextIndex = index + 1 + Number(isEscapedChar);
    const recursiveResult = this._parseMaskRule(nextIndex);

    // @ts-expect-error EmptyMaskRule Liskov
    result.next(recursiveResult);

    return result;
  }

  _getMaskRule(pattern: string): MaskRule | StubMaskRule {
    if (!this._maskRules) {
      return new StubMaskRule({ maskChar: pattern });
    }

    const matchingEntry = Object.entries(this._maskRules).find(
      ([rulePattern]) => rulePattern === pattern,
    );

    if (matchingEntry) {
      const [, allowedChars] = matchingEntry;

      const ruleConfig = {
        pattern,
        allowedChars,
      };

      const { maskChar } = this.option();

      return new MaskRule(
        extend(
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          { maskChar: maskChar || ' ' },
          ruleConfig,
        ),
      );
    }

    return new StubMaskRule({ maskChar: pattern });
  }

  _renderMaskedValue(): void {
    if (!this._maskRulesChain) {
      return;
    }

    const { value: optionValue } = this.option();
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const value = optionValue || '';

    this._maskRulesChain.clear(this._normalizeChainArguments());

    const chainArgs = { length: value?.length };
    const prop = this._isMaskedValueMode() ? 'text' : 'value';

    chainArgs[prop] = value;

    this._handleChain(chainArgs);
    this._displayMask();
  }

  _replaceSelectedText(
    text: string,
    selection: CaretRange,
    char: string,
  ): string {
    if (char === undefined) {
      return text;
    }

    const textBefore = text.slice(0, selection.start);
    const textAfter = text.slice(selection.end);

    const edited = `${textBefore}${char}${textAfter}`;

    return edited;
  }

  _isMaskedValueMode(): boolean {
    const { useMaskedValue } = this.option();

    return Boolean(useMaskedValue);
  }

  _displayMask(caret?: CaretRange): void {
    const currentCaret = caret ?? this._caret();
    const finalCaret = {
      start: currentCaret?.start ?? 0,
      end: currentCaret?.end ?? 0,
    };

    this._renderValue();
    this._caret(finalCaret);
  }

  _isValueEmpty(): boolean {
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
      const text = this._maskRulesChain?.text();

      this.option({ text });

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

  _getPreparedValue(): string {
    return this._convertToValue().replace(/\s+$/, '');
  }

  _valueChangeEventHandler(...args: unknown[]): void {
    if (!this._maskRulesChain) {
      // @ts-expect-error _valueChangeEventHandler
      super._valueChangeEventHandler(...args);
      return;
    }

    const [e] = args;

    this._saveValueChangeEvent(e as ValueChangedEvent);

    const preparedValue = this._getPreparedValue();

    this.option({ value: preparedValue });
  }

  _isControlKeyFired(e: KeyboardEvent): boolean {
    const normalizedKeyName = normalizeKeyName(e);

    const isControlKey = isDefined(normalizedKeyName)
      ? this._isControlKey(normalizedKeyName)
      : false;

    return isControlKey || isCommandKeyPressed(e);
  }

  _handleChain(args: HandlingArgs): number {
    const handledCount = this._maskRulesChain?.handle(this._normalizeChainArguments(args)) ?? 0;

    this._updateMaskInfo();

    return handledCount;
  }

  _normalizeChainArguments(args?: HandlingArgs): HandlingArgs {
    return {
      ...args,
      index: 0,
      fullText: this._maskRulesChain?.text(),
    };
  }

  _convertToValue(text?: string): string {
    if (this._isMaskedValueMode()) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      return this._replaceMaskCharWithEmpty(text || this._textValue || '');
    }

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return text || this._value || '';
  }

  _replaceMaskCharWithEmpty(text: string): string {
    const { maskChar } = this.option();

    // @ts-expect-error ts-error
    return text.replace(new RegExp(maskChar, 'g'), EMPTY_CHAR);
  }

  _maskKeyHandler(
    e: KeyboardEvent | ClipboardEvent | InputEvent,
    keyHandler: () => Promise<string> | undefined,
  ): void {
    const { readOnly } = this.option();

    if (readOnly) {
      return;
    }

    this.setForwardDirection();

    e.preventDefault();

    this._handleSelection();

    const previousText = this._input().val();

    const raiseInputEvent = (): void => {
      if (previousText !== this._input().val()) {
        // @ts-expect-error trigger
        eventsEngine.trigger(this._input(), 'input');
      }
    };

    const handled = keyHandler();

    if (handled) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handled.then(raiseInputEvent);
    } else {
      this.setForwardDirection();
      this._adjustCaret();
      this._displayMask();
      this._maskRulesChain?.reset();
      raiseInputEvent();
    }
  }

  _handleKey(key: string, direction: CaretDirection): void {
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

    const caretStart = caret?.start ?? 0;
    const caretEnd = caret?.end ?? 0;

    const emptyChars = new Array(caretEnd - caretStart + 1).join(EMPTY_CHAR);

    this._handleKeyChain(emptyChars);
  }

  _handleKeyChain(chars: string): void {
    const caret = this._caret();

    const caretStart = caret?.start ?? 0;
    const caretEnd = caret?.end ?? 0;

    const start = this.isForwardDirection() ? caretStart : caretStart - 1;
    const end = this.isForwardDirection() ? caretEnd : caretEnd - 1;

    const length = start === end ? 1 : end - start;

    this._handleChain({ text: chars, start, length });
  }

  _tryMoveCaretBackward(): boolean {
    this.setBackwardDirection();

    const currentCaret = this._caret()?.start;

    this._adjustCaret();

    return !currentCaret || currentCaret !== this._caret()?.start;
  }

  _adjustCaret(char?: string): void {
    const caretStart = this._caret()?.start ?? 0;
    const isForwardDirection = this.isForwardDirection();

    const caret = this._maskRulesChain?.adjustedCaret(caretStart, isForwardDirection, char ?? '');

    this._caret({ start: caret, end: caret });
  }

  _moveCaret(): void {
    const currentCaret = this._caret()?.start ?? 0;
    const maskRuleIndex = currentCaret + (this.isForwardDirection() ? 0 : -1);

    const caret = this._maskRulesChain?.isAccepted(maskRuleIndex)
      ? currentCaret + (this.isForwardDirection() ? 1 : -1)
      : currentCaret;

    this._caret({ start: caret, end: caret });
  }

  _caret(
    position?: CaretRange,
    force?: boolean,
  ): CaretRange | undefined {
    const $input = this._input();

    if (!$input.length) {
      return undefined;
    }

    if (arguments.length > 0) {
      caretUtils($input, position, force);
      return undefined;
    }

    return caretUtils($input);
  }

  _hasSelection(): boolean {
    const caret = this._caret();

    return caret?.start !== caret?.end;
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
    this._textValue = this._maskRulesChain?.text();
    this._value = this._maskRulesChain?.value();
  }

  _clean(): void {
    this._maskStrategy?.clean();

    super._clean();
  }

  _validateMask(): void {
    if (!this._maskRulesChain) {
      return;
    }

    const { maskInvalidMessage, value } = this.option();

    const defaultValidationError = {
      editorSpecific: true,
      message: maskInvalidMessage,
    };

    const isValid = isEmpty(value) || this._maskRulesChain.isValid(this._normalizeChainArguments());
    const validationError = isValid ? null : defaultValidationError;

    this.option({
      isValid,
      validationError,
    });
  }

  _updateHiddenElement(): void {
    this._removeHiddenElement();

    const { mask } = this.option();

    if (mask) {
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

  _processEmptyMask(mask: string): void {
    if (mask) {
      return;
    }

    const { value } = this.option();

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
        // @ts-expect-error as string
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
        this.option({ text: '' });

        this._renderValue();
        break;
      default:
        super._optionChanged(args);
    }
  }

  clear(): void {
    const { value: defaultValue } = this._getDefaultOptions();
    const { value } = this.option();

    if (value === defaultValue) {
      this._renderMaskedValue();
    }

    super.clear();
  }
}

export default TextEditorMask;
