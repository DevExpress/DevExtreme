import eventsEngine from '@js/common/core/events/core/events_engine';
import { name as dxDblClickEvent } from '@js/common/core/events/double_click';
import {
  addNamespace, getChar, isCommandKeyPressed, normalizeKeyName,
} from '@js/common/core/events/utils/index';
import number from '@js/common/core/localization/number';
import devices from '@js/core/devices';
import { escapeRegExp } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { fitIntoRange, inRange } from '@js/core/utils/math';
import {
  isDefined, isFunction, isNumeric, isPlainObject, isString,
} from '@js/core/utils/type';
import type { DxEvent, NativeEventInfo } from '@js/events';
import type { Format, FormatObject } from '@js/localization';
import type { Properties } from '@js/ui/number_box';
import { getGlobalFormatByDataType } from '@ts/core/global_format_config';
import { getFormat as getLDMLFormat } from '@ts/core/localization/ldml/number';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';
import type { KeyboardKeyDownEvent } from '@ts/events/core/keyboard_processor';
import type { TextEditorInternalProperties } from '@ts/ui/text_box/text_editor.base';
import type { CaretRange } from '@ts/ui/text_box/utils.caret';

import type { NumberBoxBaseProperties, NumberBoxValue } from './number_box.base';
import NumberBoxBase from './number_box.base';
import {
  getCaretAfterFormat, getCaretBoundaries, getCaretInBoundaries,
  getCaretOffset,
  getCaretWithOffset, isCaretInBoundaries,
} from './number_box.caret';
import {
  adjustPercentValue, asPattern, getNthOccurrence, getRealSeparatorIndex,
  splitByIndex,
} from './utils';

const NUMBER_FORMATTER_NAMESPACE = 'dxNumberFormatter';
const MOVE_FORWARD = 1 as const;
const MOVE_BACKWARD = -1 as const;
const MINUS = '-';
const MINUS_KEY = 'minus';
const INPUT_EVENT = 'input';
const NUMPAD_DOT_KEY_CODE = 110;

const CARET_TIMEOUT_DURATION = 0;

type CaretMoveDirection = typeof MOVE_FORWARD | typeof MOVE_BACKWARD;

// NOTE: Intl options objects are plain objects too. Reading FormatObject members
// off them yields undefined, which is exactly how such formats were treated before.
const asFormatObject = (format: Format | undefined): FormatObject | undefined => (
  isPlainObject(format) ? format as FormatObject : undefined
);

const isNegativeValue = (value: NumberBoxValue | undefined): boolean => {
  const parsedValue = Number(value);

  return parsedValue < 0 || 1 / parsedValue === -Infinity;
};

export interface NumberBoxMaskProperties extends Omit<Properties, 'onChange' | 'onCopy' | 'onCut' | 'onEnterKey' | 'onFocusIn' | 'onFocusOut' | 'onInput'
| 'onKeyDown' | 'onKeyUp' | 'onPaste' | 'onValueChanged' | 'onContentReady' | 'onDisposing'
| 'onOptionChanged' | 'onInitialized' | 'format' >, Omit<TextEditorInternalProperties, 'displayValueFormatter'> {
  format?: Format | null;

  useMaskBehavior?: boolean;

  displayValueFormatter?: NumberBoxBaseProperties['displayValueFormatter'];

  onValueChanged?: (
    e: NativeEventInfo<unknown> & { value?: NumberBoxValue; previousValue?: NumberBoxValue },
  ) => void;
}

class NumberBoxMask extends NumberBoxBase<NumberBoxMaskProperties> {
  _caretTimeout?: ReturnType<typeof setTimeout>;

  _focusOutOccurs?: boolean;

  _parsedValue?: NumberBoxValue;

  _lastKeyName?: string | null;

  _lastKey?: string | null;

  _formattedValue?: string;

  _currentFormat?: Format;

  _getDefaultOptions(): NumberBoxMaskProperties {
    return {
      ...super._getDefaultOptions(),
      useMaskBehavior: true,
      format: null,
    };
  }

  _isDeleteKey(key: string | null | undefined): boolean {
    return key === 'del';
  }

  _supportedKeys(): SupportedKeys {
    if (!this._useMaskBehavior()) {
      return super._supportedKeys();
    }

    return {
      ...super._supportedKeys(),
      minus: (e): void => this._revertSign(e),
      del: (e): void => this._removeHandler(e),
      backspace: (e): void => this._removeHandler(e),
      leftArrow: (e): void => this._arrowHandler(MOVE_BACKWARD, e),
      rightArrow: (e): void => this._arrowHandler(MOVE_FORWARD, e),
      home: (e): void => this._boundaryKeyHandler(MOVE_FORWARD, e),
      enter: (): void => this._updateFormattedValue(),
      end: (e): void => this._boundaryKeyHandler(MOVE_BACKWARD, e),
    };
  }

  _getEffectiveFormatOption(): Format | undefined {
    const { format } = this.option();

    return isDefined(format)
      ? format
      : getGlobalFormatByDataType('number');
  }

  _getTextSeparatorIndex(text: string): number {
    const decimalSeparator: string = number.getDecimalSeparator();
    const realSeparatorOccurrenceIndex = getRealSeparatorIndex(this._getFormatPattern()).occurrence;
    return getNthOccurrence(text, decimalSeparator, realSeparatorOccurrenceIndex);
  }

  _focusInHandler(e: DxEvent<FocusEvent>): void {
    if (!this._preventNestedFocusEvent(e)) {
      this.clearCaretTimeout();
      this._caretTimeout = setTimeout(() => {
        this._caretTimeout = undefined;
        const caret = this._caret();

        if (caret?.start === caret?.end && this._useMaskBehavior()) {
          const text = this._getInputVal();
          const decimalSeparatorIndex = this._getTextSeparatorIndex(text);

          if (decimalSeparatorIndex >= 0) {
            this._caret({ start: decimalSeparatorIndex, end: decimalSeparatorIndex });
          } else {
            this._moveCaretToBoundary(MOVE_BACKWARD);
          }
        }
      }, CARET_TIMEOUT_DURATION);
    }

    super._focusInHandler(e);
  }

  _focusOutHandler(e: DxEvent): void {
    const shouldHandleEvent = !this._preventNestedFocusEvent(e);

    if (shouldHandleEvent) {
      this._focusOutOccurs = true;
      if (this._useMaskBehavior()) {
        this._updateFormattedValue();
      }
    }

    super._focusOutHandler(e);

    if (shouldHandleEvent) {
      this._focusOutOccurs = false;
    }
  }

  _hasValueBeenChanged(inputValue: string): boolean {
    const format = this._getFormatPattern();
    const { value } = this.option();
    const formatted = this._format(value, format) || '';

    return formatted !== inputValue;
  }

  _updateFormattedValue(): void {
    const inputValue = this._getInputVal();

    if (this._hasValueBeenChanged(inputValue)) {
      this._updateParsedValue();

      this._adjustParsedValue();
      this._setTextByParsedValue();
      const { value } = this.option();
      if (this._parsedValue !== value) {
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/15181565/
        // https://bugreport.apple.com/web/?problemID=38133794 but this bug tracker is private
        // @ts-expect-error
        eventsEngine.trigger(this._input(), 'change');
      }
    }
  }

  _arrowHandler(step: CaretMoveDirection, e: DxEvent<KeyboardEvent>): void {
    if (!this._useMaskBehavior()) {
      return;
    }

    const caret = this._caret();

    if (!caret) {
      return;
    }

    const text = this._getInputVal();
    const format = this._getFormatPattern();
    const nextCaret = getCaretWithOffset(caret, step);

    if (!isCaretInBoundaries(nextCaret, text, format)) {
      const nextCaretPosition = step === MOVE_FORWARD ? nextCaret.end : nextCaret.start;

      e.preventDefault();
      this._caret(getCaretInBoundaries(nextCaretPosition, text, format));
      this._scrollInputTo(step === MOVE_FORWARD ? 'end' : 'start');
    }
  }

  _scrollInputTo(edge: 'start' | 'end'): void {
    const inputElement = this._input().get(0);
    if (!inputElement) {
      return;
    }
    inputElement.scrollLeft = edge === 'end' ? inputElement.scrollWidth : 0;
  }

  _moveCaretToBoundary(direction: CaretMoveDirection): void {
    const boundaries = getCaretBoundaries(
      this._getInputVal(),
      this._getFormatPattern(),
    );

    const newCaret = getCaretWithOffset(
      direction === MOVE_FORWARD
        ? boundaries.start
        : boundaries.end,
      0,
    );

    this._caret(newCaret);
  }

  _boundaryKeyHandler(direction: CaretMoveDirection, e: DxEvent<KeyboardEvent>): void {
    if (!this._useMaskBehavior() || e.shiftKey) {
      return;
    }

    this._moveCaretToBoundary(direction);
    e.preventDefault();
    this._scrollInputTo(direction === MOVE_FORWARD ? 'start' : 'end');
  }

  _shouldMoveCaret(text: string, caret: CaretRange | undefined): boolean {
    if (!caret) {
      return false;
    }

    const decimalSeparator = number.getDecimalSeparator();
    const isDecimalSeparatorNext = text.charAt(caret.end ?? 0) === decimalSeparator;
    const isSeparatorKey = this._lastKey === decimalSeparator || this._lastKey === '.' || this._lastKey === ',';

    return isSeparatorKey && isDecimalSeparatorNext;
  }

  _getInputVal(): string {
    const inputValue: string = number.convertDigits(this._input().val(), true);

    return inputValue;
  }

  _keyboardHandler(e: KeyboardKeyDownEvent): boolean {
    this.clearCaretTimeout();

    this._lastKey = number.convertDigits(getChar(e), true);
    this._lastKeyName = normalizeKeyName(e);

    if (!this._shouldHandleKey(e.originalEvent)) {
      return super._keyboardHandler(e);
    }

    const normalizedText = this._getInputVal();
    const caret = this._caret();

    let enteredChar = this._lastKey;
    if (this._lastKeyName === MINUS_KEY) {
      enteredChar = '';
    } else if (e.which === NUMPAD_DOT_KEY_CODE) {
      enteredChar = number.getDecimalSeparator();
    }
    const newValue = this._tryParse(normalizedText, caret, enteredChar);

    if (this._shouldMoveCaret(normalizedText, caret)) {
      this._moveCaret(1);
      e.originalEvent.preventDefault();
    }

    if (newValue === undefined) {
      if (this._lastKeyName !== MINUS_KEY) {
        e.originalEvent.preventDefault();
      }
    } else {
      this._parsedValue = newValue;
    }

    return super._keyboardHandler(e);
  }

  _keyPressHandler(e: DxEvent<KeyboardEvent>): void {
    if (!this._useMaskBehavior()) {
      super._keyPressHandler(e);
    }
  }

  _removeHandler(e: DxEvent<KeyboardEvent>): void {
    const caret = this._caret();
    const text = this._getInputVal();

    let { start = 0, end = 0 } = caret ?? {};

    this._lastKey = getChar(e);
    this._lastKeyName = normalizeKeyName(e);

    const isDeleteKey = this._isDeleteKey(this._lastKeyName);
    const isBackspaceKey = !isDeleteKey;

    if (start === end) {
      const caretPosition = start;

      const canDelete = (isBackspaceKey && caretPosition > 0)
        || (isDeleteKey && caretPosition < text.length);

      if (canDelete) {
        if (isDeleteKey) {
          end += 1;
        } else {
          start -= 1;
        }
      } else {
        e.preventDefault();
        return;
      }
    }

    const char = text.slice(start, end);

    if (this._isStub(char)) {
      this._moveCaret(isDeleteKey ? 1 : -1);
      if (isNegativeValue(this._parsedValue)) {
        this._revertSign(e);
        this._setTextByParsedValue();
        const { valueChangeEvent } = this.option();
        const shouldTriggerInputEvent = valueChangeEvent?.split(' ').includes('input');
        if (shouldTriggerInputEvent) {
          // @ts-expect-error ts-error
          eventsEngine.trigger(this._input(), 'input');
        }
      }
      e.preventDefault();
      return;
    }

    const decimalSeparator: string = number.getDecimalSeparator();
    if (char === decimalSeparator) {
      const decimalSeparatorIndex = text.indexOf(decimalSeparator);
      if (this._isNonStubAfter(decimalSeparatorIndex + 1)) {
        this._moveCaret(isDeleteKey ? 1 : -1);
        e.preventDefault();
      }
      return;
    }

    if (end - start < text.length) {
      const editedText = this._replaceSelectedText(text, { start, end }, '');
      const noDigits = editedText.search(/[0-9]/) < 0;

      if (noDigits && this._isValueInRange(0)) {
        this._parsedValue = isNegativeValue(this._parsedValue) ? -0 : 0;
        return;
      }
    }

    const valueAfterRemoving = this._tryParse(text, { start, end }, '');
    if (valueAfterRemoving === undefined) {
      e.preventDefault();
    } else {
      this._parsedValue = valueAfterRemoving;
    }
  }

  _isPercentFormat(): boolean {
    const noEscapedFormat = asPattern(this._getFormatPattern()).replace(/'[^']+'/g, '');

    return noEscapedFormat.includes('%');
  }

  _parse(text: string, format: Format): NumberBoxValue | undefined {
    const formatOption = this._getEffectiveFormatOption();
    const customParser = asFormatObject(formatOption)?.parser;
    const isCustomParser = isFunction(customParser);
    const parser = (isCustomParser ? customParser : number.parse) as (
      text: string, textFormat: Format,
    ) => NumberBoxValue | undefined;
    let integerPartStartIndex = 0;

    if (!isCustomParser && isString(format)) {
      const formatPointIndex = getRealSeparatorIndex(format).index;
      const textPointIndex = this._getTextSeparatorIndex(text);

      const formatIntegerPartLength = formatPointIndex !== -1 ? formatPointIndex : format.length;
      const textIntegerPartLength = textPointIndex !== -1 ? textPointIndex : text.length;

      if (textIntegerPartLength > formatIntegerPartLength && !format.includes('#')) {
        integerPartStartIndex = textIntegerPartLength - formatIntegerPartLength;
      }
    }

    const parsedValue = parser(text.substr(integerPartStartIndex), format);

    return parsedValue;
  }

  _format(value: NumberBoxValue | undefined, format: Format): string | undefined {
    const formatOption = this._getEffectiveFormatOption();
    const customFormatter = asFormatObject(formatOption)?.formatter ?? formatOption;
    const formatter = (isFunction(customFormatter) ? customFormatter : number.format) as (
      value: NumberBoxValue | undefined, valueFormat: Format,
    ) => string | undefined;

    const formattedValue: string | undefined = value === null ? '' : formatter(value, format);

    return formattedValue;
  }

  _getFormatPattern(): Format {
    if (!this._currentFormat) {
      this._updateFormat();
    }

    return this._currentFormat;
  }

  _updateFormat(): void {
    const format = this._getEffectiveFormatOption();
    const formatObject = asFormatObject(format);
    const isCustomParser = isFunction(formatObject?.parser);
    const isLDMLPattern = isString(format) && (format.includes('0') || format.includes('#'));
    const isExponentialFormat = format === 'exponential' || formatObject?.type === 'exponential';
    const shouldUseFormatAsIs = isCustomParser || isLDMLPattern || isExponentialFormat;

    this._currentFormat = shouldUseFormatAsIs
      ? format
      : getLDMLFormat((value: number): string => {
        const text = this._format(value, format) ?? '';
        const convertedText: string = number.convertDigits(text, true);

        return convertedText;
      });
  }

  _getFormatForSign(text: string): string {
    const format = this._getFormatPattern();
    if (isString(format)) {
      const signParts = format.split(';');
      const sign: number = number.getSign(text, format);

      signParts[1] = signParts[1] || `-${signParts[0]}`;
      return sign < 0 ? signParts[1] : signParts[0];
    }
    const sign: number = number.getSign(text);
    return sign < 0 ? '-' : '';
  }

  _removeStubs(text: string, excludeComma?: boolean): string {
    const format = this._getFormatForSign(text);
    const thousandsSeparator: string = number.getThousandsSeparator();
    const stubs = this._getStubs(format);
    let result = text;

    if (stubs.length) {
      const prefixStubs = stubs[0];
      const postfixRegex = new RegExp(`(${escapeRegExp(stubs[1] || '')})$`, 'g');
      const decoratorsRegex = new RegExp(`[-${escapeRegExp(excludeComma ? '' : thousandsSeparator)}]`, 'g');

      result = result
        .replace(prefixStubs, '')
        .replace(postfixRegex, '')
        .replace(decoratorsRegex, '');
    }

    return result;
  }

  _getStubs(format: string): string[] {
    const patternMatch = /[^']([#0.,]+)/g.exec(format);
    const pattern = patternMatch?.[0].trim();
    const stubs = isDefined(pattern) ? format.split(pattern) : [format];

    return stubs.map((stub) => stub.replace(/'/g, ''));
  }

  _truncateToPrecision(
    value: NumberBoxValue | undefined,
    maxPrecision: number,
  ): NumberBoxValue | undefined {
    if (isDefined(value)) {
      const strValue = value.toString();
      const decimalSeparatorIndex = strValue.indexOf('.');

      if (strValue && decimalSeparatorIndex > -1) {
        const truncatedValue = strValue.substr(0, decimalSeparatorIndex + maxPrecision + 1);
        const parsedValue = parseFloat(truncatedValue);

        return isNaN(parsedValue) ? value : parsedValue;
      }
    }
    return value;
  }

  _tryParse(
    text: string,
    selection: CaretRange | undefined,
    char?: string | null,
  ): NumberBoxValue | undefined {
    const { start = 0, end = 0 } = selection ?? {};
    const isTextSelected = start !== end;
    const isWholeTextSelected = isTextSelected && start === 0 && end === text.length;
    const decimalSeparator: string = number.getDecimalSeparator();

    if (isWholeTextSelected && char === decimalSeparator) {
      return 0;
    }

    const editedText = this._replaceSelectedText(text, { start, end }, char ?? undefined);
    const format = this._getFormatPattern();
    const hasCustomParser = isFunction(asFormatObject(format)?.parser);

    let parsedValue = this._getParsedValue(editedText, format);
    const maxPrecision = hasCustomParser ? undefined : this._getPrecisionLimits(editedText).max;
    const isValueChanged = parsedValue !== this._parsedValue;

    const isDecimalPointRestricted = char === decimalSeparator && maxPrecision === 0;
    const isUselessCharRestricted = !isTextSelected
            && !isValueChanged
            && char !== MINUS
            && this._isStub(char);

    if (isDecimalPointRestricted || isUselessCharRestricted) {
      return undefined;
    }

    if (this._removeStubs(editedText) === '') {
      parsedValue = Math.abs(Number(this._parsedValue) * 0);
    }

    if (isNaN(Number(parsedValue))) {
      return undefined;
    }

    const value = parsedValue === null ? this._parsedValue : parsedValue;
    parsedValue = maxPrecision ? this._truncateToPrecision(value, maxPrecision) : parsedValue;

    if (!hasCustomParser && this._isPercentFormat()) {
      const interval = this._getIntervalFromPrecision(maxPrecision ?? 0);

      return adjustPercentValue(parsedValue, interval);
    }

    return parsedValue;
  }

  _getIntervalFromPrecision(precision: number): number {
    if (precision < 1) {
      return 1;
    }

    return 10 ** -precision;
  }

  _getParsedValue(text: string, format: Format): NumberBoxValue | undefined {
    const signFormat = asFormatObject(format)?.formatter ?? format;
    const sign: number = number.getSign(text, signFormat);
    const textWithoutStubs = this._removeStubs(text, true);
    const parsedValue = this._parse(textWithoutStubs, format);
    const parsedValueSign = Number(parsedValue) < 0 ? -1 : 1;
    const shouldRevertSign = isNumeric(parsedValue) && sign !== parsedValueSign;

    return shouldRevertSign ? sign * parsedValue : parsedValue;
  }

  _isValueIncomplete(text: string): boolean {
    if (!this._useMaskBehavior()) {
      return super._isValueIncomplete(text);
    }

    const caret = this._caret();
    const point: string = number.getDecimalSeparator();
    const pointIndex = this._getTextSeparatorIndex(text);
    const isCaretOnFloat = pointIndex >= 0 && pointIndex < (caret?.start ?? 0);
    const textParts = this._removeStubs(text, true).split(point);

    if (!isCaretOnFloat || textParts.length !== 2) {
      return false;
    }

    const floatLength = textParts[1].length;
    const endsWithZero = textParts[1].charAt(floatLength - 1) === '0';
    const isFloatPartComplete = endsWithZero || !floatLength;

    const format = this._getFormatPattern();

    if (isFunction(asFormatObject(format)?.parser)) {
      return isFloatPartComplete;
    }

    const precision = this._getPrecisionLimits(asPattern(format));

    return inRange(floatLength, precision.min, precision.max) && isFloatPartComplete;
  }

  _isValueInRange(value: number): boolean {
    const { min, max } = this.option();

    return inRange(value, min ?? -Infinity, max ?? Infinity);
  }

  _setInputText(text: string): void {
    const normalizedText: string = number.convertDigits(text, true);
    const caret = this._caret();
    const newCaret = caret && getCaretAfterFormat(
      this._getInputVal(),
      normalizedText,
      caret,
      this._getFormatPattern(),
    );

    this._input().val(text);
    this._toggleEmptinessEventHandler();
    this._formattedValue = text;

    if (newCaret && !this._focusOutOccurs) {
      this._caret(newCaret);
    }
  }

  _useMaskBehavior(): boolean {
    const { useMaskBehavior } = this.option();
    return !!this._getEffectiveFormatOption() && !!useMaskBehavior;
  }

  _renderInputType(): void {
    const { mode } = this.option();

    const isNumberType = mode === 'number';
    const isDesktop = devices.real().deviceType === 'desktop';

    if (this._useMaskBehavior() && isNumberType) {
      this._setInputType(isDesktop || this._isSupportInputMode() ? 'text' : 'tel');
    } else {
      super._renderInputType();
    }
  }

  _isChar(str: string | null | undefined): boolean {
    return isString(str) && str.length === 1;
  }

  _moveCaret(offset?: number): void {
    const caret = this._caret();

    if (!offset || !caret) {
      return;
    }

    const newCaret = getCaretWithOffset(caret, offset);
    const adjustedCaret = getCaretInBoundaries(
      newCaret,
      this._getInputVal(),
      this._getFormatPattern(),
    );

    this._caret(adjustedCaret);
  }

  _shouldHandleKey(e: KeyboardEvent): boolean {
    const keyName = normalizeKeyName(e);
    const isSpecialChar = isCommandKeyPressed(e) || e.altKey || e.shiftKey
      || !this._isChar(keyName);
    const isMinusKey = keyName === MINUS_KEY;
    const useMaskBehavior = this._useMaskBehavior();

    return useMaskBehavior && !isSpecialChar && !isMinusKey;
  }

  _renderInput(): void {
    super._renderInput();
    this._renderFormatter();
  }

  _renderFormatter(): void {
    this._clearCache();
    this._detachFormatterEvents();

    if (this._useMaskBehavior()) {
      this._attachFormatterEvents();
    }
  }

  _detachFormatterEvents(): void {
    eventsEngine.off(this._input(), `.${NUMBER_FORMATTER_NAMESPACE}`);
  }

  _isInputFromPaste(e: DxEvent<InputEvent>): boolean {
    return e.originalEvent?.inputType === 'insertFromPaste';
  }

  _attachFormatterEvents(): void {
    const $input = this._input();

    eventsEngine.on(
      $input,
      addNamespace(INPUT_EVENT, NUMBER_FORMATTER_NAMESPACE),
      (e: DxEvent<InputEvent>) => { this._formatValue(e); },
    );

    eventsEngine.on($input, addNamespace('dxclick', NUMBER_FORMATTER_NAMESPACE), () => {
      if (!this._caretTimeout) {
        this._caretTimeout = setTimeout(() => {
          this._caretTimeout = undefined;

          const caret = this._caret();

          if (caret) {
            this._caret(getCaretInBoundaries(
              caret,
              this._getInputVal(),
              this._getFormatPattern(),
            ));
          }
        }, CARET_TIMEOUT_DURATION);
      }
    });

    eventsEngine.on($input, dxDblClickEvent, () => {
      this.clearCaretTimeout();
    });
  }

  clearCaretTimeout(): void {
    clearTimeout(this._caretTimeout);
    this._caretTimeout = undefined;
  }

  _forceRefreshInputValue(): void {
    if (!this._useMaskBehavior()) {
      super._forceRefreshInputValue();
    }
  }

  _isNonStubAfter(index: number): boolean {
    const text = this._getInputVal().slice(index);

    return !!text && !this._isStub(text, true);
  }

  _isStub(str: string | null | undefined, allowMultipleChars?: boolean): boolean {
    const escapedDecimalSeparator = escapeRegExp(number.getDecimalSeparator());
    const regExpString = `^[^0-9${escapedDecimalSeparator}]+$`;
    const stubRegExp = new RegExp(regExpString, 'g');

    return stubRegExp.test(str ?? '') && (!!allowMultipleChars || this._isChar(str));
  }

  _parseValue(text?: string | NumberBoxValue): NumberBoxValue | undefined {
    if (!this._useMaskBehavior()) {
      return super._parseValue(text);
    }

    return this._parsedValue;
  }

  _getPrecisionLimits(text: string): { min: number; max: number } {
    const currentFormat = this._getFormatForSign(text);
    const realSeparatorIndex = getRealSeparatorIndex(currentFormat).index;
    const floatPart = (splitByIndex(currentFormat, realSeparatorIndex)[1] || '').replace(/[^#0]/g, '');
    const minPrecision = floatPart.replace(/^(0*)#*/, '$1').length;
    const maxPrecision = floatPart.length;

    return { min: minPrecision, max: maxPrecision };
  }

  _revertSign(e: DxEvent<KeyboardEvent>): void {
    if (!this._useMaskBehavior()) {
      return;
    }

    const caret = this._caret();

    if (caret?.start !== caret?.end) {
      if (normalizeKeyName(e) === MINUS_KEY) {
        this._applyRevertedSign(e, caret, true);
        return;
      }
      this._caret(getCaretInBoundaries(0, this._getInputVal(), this._getFormatPattern()));
    }

    this._applyRevertedSign(e, caret);
  }

  _applyRevertedSign(
    e: DxEvent<KeyboardEvent>,
    caret: CaretRange | undefined,
    preserveSelectedText?: boolean,
  ): void {
    const newValue = -1 * (this._parsedValue ?? 0);

    if (this._isValueInRange(newValue) || newValue === 0) {
      this._parsedValue = newValue;

      if (preserveSelectedText) {
        const format = this._getFormatPattern();
        const previousText = this._getInputVal();

        this._setTextByParsedValue();
        e.preventDefault();

        if (caret) {
          const currentText = this._getInputVal();
          const offset = getCaretOffset(previousText, currentText, format);
          const caretWithOffset = getCaretWithOffset(caret, offset);
          const caretInBoundaries = getCaretInBoundaries(caretWithOffset, currentText, format);

          this._caret(caretInBoundaries);
        }
      }
    }
  }

  _removeMinusFromText(text: string, caret: CaretRange | undefined): string {
    const caretStart = caret?.start ?? 0;
    const isMinusPressed = this._lastKeyName === MINUS_KEY
      && text.charAt(caretStart - 1) === MINUS;

    return isMinusPressed
      ? this._replaceSelectedText(text, { start: caretStart - 1, end: caretStart }, '')
      : text;
  }

  _setTextByParsedValue(): void {
    const format = this._getFormatPattern();
    const parsed = this._parseValue();
    const formatted = this._format(parsed, format) || '';

    this._setInputText(formatted);
  }

  _formatValue(e: DxEvent<InputEvent>): void {
    let normalizedText = this._getInputVal();
    const caret = this._caret();
    const textWithoutMinus = this._removeMinusFromText(normalizedText, caret);
    const wasMinusRemoved = textWithoutMinus !== normalizedText;
    const isFromPaste = this._isInputFromPaste(e);

    normalizedText = textWithoutMinus;

    if (!isFromPaste && this._isValueIncomplete(textWithoutMinus)) {
      this._formattedValue = normalizedText;
      if (wasMinusRemoved) {
        this._setTextByParsedValue();
      }
      return;
    }

    const formattedValue: string | undefined = number.convertDigits(this._formattedValue, true);
    const textWasChanged = formattedValue !== normalizedText;

    if (textWasChanged) {
      const value = this._tryParse(normalizedText, caret, '');

      if (isDefined(value)) {
        this._parsedValue = value;
      }
    }

    this._setTextByParsedValue();
  }

  _renderDisplayText(text?: string): void {
    if (this._useMaskBehavior()) {
      this._toggleEmptinessEventHandler();
    } else {
      super._renderDisplayText(text);
    }
  }

  _renderValue(): DeferredObj<unknown> {
    if (this._useMaskBehavior()) {
      const { value } = this.option();

      this._parsedValue = value;
      this._setTextByParsedValue();
    }

    return super._renderValue();
  }

  _updateParsedValue(): void {
    const inputValue = this._getInputVal();
    this._parsedValue = this._tryParse(inputValue, this._caret());
  }

  _adjustParsedValue(): void {
    if (!this._useMaskBehavior()) {
      return;
    }

    const clearedText = this._removeStubs(this._getInputVal());
    const parsedValue = clearedText ? this._parseValue() : null;

    if (!isNumeric(parsedValue)) {
      this._parsedValue = parsedValue;
      return;
    }

    const { min, max } = this.option();

    this._parsedValue = fitIntoRange(parsedValue, min, max);
  }

  _valueChangeEventHandler(e: DxEvent): void {
    if (!this._useMaskBehavior()) {
      super._valueChangeEventHandler(e);
      return;
    }

    const caret = this._caret();

    this._saveValueChangeEvent(e);
    this._lastKey = null;
    this._lastKeyName = null;

    this._updateParsedValue();
    this._adjustParsedValue();
    this.option('value', this._parsedValue);

    if (caret) {
      this._caret(caret);
    }
  }

  _optionChanged(args: OptionChanged<NumberBoxMaskProperties>): void {
    switch (args.name) {
      case 'format':
      case 'useMaskBehavior':
        this._renderInputType();
        this._updateFormat();
        this._renderFormatter();
        this._renderValue();
        this._refreshValueChangeEvent();
        this._refreshEvents();
        break;
      case 'min':
      case 'max':
        this._adjustParsedValue();
        super._optionChanged(args);
        break;
      default:
        super._optionChanged(args);
    }
  }

  _clearCache(): void {
    delete this._formattedValue;
    delete this._lastKey;
    delete this._lastKeyName;
    delete this._parsedValue;
    delete this._focusOutOccurs;
    clearTimeout(this._caretTimeout);
    delete this._caretTimeout;
  }

  _clean(): void {
    this._clearCache();
    super._clean();
  }
}

export default NumberBoxMask;
