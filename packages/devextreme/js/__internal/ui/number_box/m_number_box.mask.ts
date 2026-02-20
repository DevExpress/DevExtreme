import eventsEngine from '@js/common/core/events/core/events_engine';
import { name as dxDblClickEvent } from '@js/common/core/events/double_click';
import {
  addNamespace, getChar, isCommandKeyPressed, normalizeKeyName,
} from '@js/common/core/events/utils/index';
import { getFormat as getLDMLFormat } from '@js/common/core/localization/ldml/number';
import number from '@js/common/core/localization/number';
import devices from '@js/core/devices';
import { ensureDefined, escapeRegExp } from '@js/core/utils/common';
import { fitIntoRange, inRange } from '@js/core/utils/math';
import {
  isDefined, isFunction, isNumeric, isString,
} from '@js/core/utils/type';
import type { Properties } from '@js/ui/number_box';

import NumberBoxBase from './m_number_box.base';
import {
  getCaretAfterFormat, getCaretBoundaries, getCaretInBoundaries,
  getCaretOffset,
  getCaretWithOffset, isCaretInBoundaries,
} from './m_number_box.caret';
import {
  adjustPercentValue, getNthOccurrence, getRealSeparatorIndex,
  splitByIndex,
} from './m_utils';

const NUMBER_FORMATTER_NAMESPACE = 'dxNumberFormatter';
const MOVE_FORWARD = 1;
const MOVE_BACKWARD = -1;
const MINUS = '-';
const MINUS_KEY = 'minus';
const INPUT_EVENT = 'input';
const NUMPAD_DOT_KEY_CODE = 110;

const CARET_TIMEOUT_DURATION = 0;

export interface NumberBoxMaskProperties extends Omit<Properties, 'onChange' | 'onCopy' | 'onCut' | 'onEnterKey' | 'onFocusIn' | 'onFocusOut' | 'onInput'
| 'onKeyDown' | 'onKeyUp' | 'onPaste' | 'onValueChanged' | 'onContentReady' | 'onDisposing'
| 'onOptionChanged' | 'onInitialized' > {
  useMaskBehavior?: boolean;

  displayValueFormatter?: ((value: any) => string);
}

class NumberBoxMask extends NumberBoxBase<NumberBoxMaskProperties> {
  _caretTimeout?: ReturnType<typeof setTimeout>;

  _focusOutOccurs?: boolean;

  _parsedValue?: number | null;

  _lastKeyName?: string | null;

  _lastKey?: string | null;

  _formattedValue?: string;

  _isValuePasted?: boolean;

  _currentFormat?: any;

  _getDefaultOptions(): NumberBoxMaskProperties {
    return {
      ...super._getDefaultOptions(),
      useMaskBehavior: true,
      // @ts-expect-error ts-error
      format: null,
    };
  }

  _isDeleteKey(key): boolean {
    return key === 'del';
  }

  _supportedKeys() {
    if (!this._useMaskBehavior()) {
      return super._supportedKeys();
    }

    const that = this;

    return {
      ...super._supportedKeys(),
      minus: that._revertSign.bind(that),
      del: that._removeHandler.bind(that),
      backspace: that._removeHandler.bind(that),
      leftArrow: that._arrowHandler.bind(that, MOVE_BACKWARD),
      rightArrow: that._arrowHandler.bind(that, MOVE_FORWARD),
      home: that._moveCaretToBoundaryEventHandler.bind(that, MOVE_FORWARD),
      enter: that._updateFormattedValue.bind(that),
      end: that._moveCaretToBoundaryEventHandler.bind(that, MOVE_BACKWARD),
    };
  }

  _getTextSeparatorIndex(text) {
    const decimalSeparator = number.getDecimalSeparator();
    const realSeparatorOccurrenceIndex = getRealSeparatorIndex(this.option('format')).occurrence;
    return getNthOccurrence(text, decimalSeparator, realSeparatorOccurrenceIndex);
  }

  _focusInHandler(e): void {
    if (!this._preventNestedFocusEvent(e)) {
      this.clearCaretTimeout();
      // eslint-disable-next-line no-restricted-globals
      this._caretTimeout = setTimeout(() => {
        this._caretTimeout = undefined;
        const caret = this._caret();

        if (caret !== undefined && caret.start === caret.end && this._useMaskBehavior()) {
          const text = this._getInputVal();
          const decimalSeparatorIndex = this._getTextSeparatorIndex(text);

          if (decimalSeparatorIndex >= 0) {
            this._caret({ start: decimalSeparatorIndex, end: decimalSeparatorIndex });
          } else {
            this._moveCaretToBoundaryEventHandler(MOVE_BACKWARD, e);
          }
        }
      }, CARET_TIMEOUT_DURATION);
    }

    super._focusInHandler(e);
  }

  _focusOutHandler(e): void {
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

  _hasValueBeenChanged(inputValue) {
    const format = this._getFormatPattern();
    const value = this.option('value');
    const formatted = this._format(value, format) || '';

    return formatted !== inputValue;
  }

  _updateFormattedValue() {
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

  _arrowHandler(step, e) {
    if (!this._useMaskBehavior()) {
      return;
    }

    const text = this._getInputVal();
    const format = this._getFormatPattern();
    let nextCaret = getCaretWithOffset(this._caret(), step);

    if (!isCaretInBoundaries(nextCaret, text, format)) {
      nextCaret = step === MOVE_FORWARD ? nextCaret.end : nextCaret.start;
      e.preventDefault();
      this._caret(getCaretInBoundaries(nextCaret, text, format));
    }
  }

  _moveCaretToBoundary(direction) {
    const boundaries = getCaretBoundaries(this._getInputVal(), this._getFormatPattern());
    const newCaret = getCaretWithOffset(direction === MOVE_FORWARD ? boundaries.start : boundaries.end, 0);

    this._caret(newCaret);
  }

  _moveCaretToBoundaryEventHandler(direction, e) {
    if (!this._useMaskBehavior() || e?.shiftKey) {
      return;
    }

    this._moveCaretToBoundary(direction);
    e?.preventDefault();
  }

  _shouldMoveCaret(text, caret) {
    const decimalSeparator = number.getDecimalSeparator();
    const isDecimalSeparatorNext = text.charAt(caret.end) === decimalSeparator;
    const moveToFloat = (this._lastKey === decimalSeparator || this._lastKey === '.' || this._lastKey === ',') && isDecimalSeparatorNext;

    return moveToFloat;
  }

  _getInputVal() {
    return number.convertDigits(this._input().val(), true);
  }

  _keyboardHandler(e): boolean {
    this.clearCaretTimeout();

    this._lastKey = number.convertDigits(getChar(e), true);
    this._lastKeyName = normalizeKeyName(e);

    if (!this._shouldHandleKey(e.originalEvent)) {
      return super._keyboardHandler(e);
    }

    const normalizedText = this._getInputVal();
    const caret = this._caret();

    let enteredChar;
    if (this._lastKeyName === MINUS_KEY) {
      enteredChar = '';
    } else {
      enteredChar = e.which === NUMPAD_DOT_KEY_CODE ? number.getDecimalSeparator() : this._lastKey;
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

  _keyPressHandler(e): void {
    if (!this._useMaskBehavior()) {
      super._keyPressHandler(e);
    }
  }

  _removeHandler(e) {
    const caret = this._caret();
    const text = this._getInputVal();

    let { start = 0, end = 0 } = caret ?? {};

    this._lastKey = getChar(e);
    this._lastKeyName = normalizeKeyName(e);

    const isDeleteKey = this._isDeleteKey(this._lastKeyName);
    const isBackspaceKey = !isDeleteKey;

    if (start === end) {
      const caretPosition = start;
      const canDelete = isBackspaceKey && caretPosition > 0 || isDeleteKey && caretPosition < text.length;

      if (canDelete) {
        isDeleteKey && end++;
        isBackspaceKey && start--;
      } else {
        e.preventDefault();
        return;
      }
    }

    const char = text.slice(start, end);

    if (this._isStub(char)) {
      this._moveCaret(isDeleteKey ? 1 : -1);
      // @ts-expect-error ts-error
      if (this._parsedValue < 0 || 1 / this._parsedValue === -Infinity) {
        this._revertSign(e);
        this._setTextByParsedValue();
        // @ts-expect-error ts-error
        const shouldTriggerInputEvent = this.option('valueChangeEvent').split(' ').includes('input');
        if (shouldTriggerInputEvent) {
          // @ts-expect-error ts-error
          eventsEngine.trigger(this._input(), 'input');
        }
      }
      e.preventDefault();
      return;
    }

    const decimalSeparator = number.getDecimalSeparator();
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
        // @ts-expect-error ts-error
        this._parsedValue = this._parsedValue < 0 || 1 / this._parsedValue === -Infinity ? -0 : 0;
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

  _isPercentFormat() {
    const format = this._getFormatPattern();
    const noEscapedFormat = format.replace(/'[^']+'/g, '');

    return noEscapedFormat.indexOf('%') !== -1;
  }

  _parse(text, format) {
    const formatOption = this.option('format');
    // @ts-expect-error ts-error
    const isCustomParser = isFunction(formatOption.parser);
    // @ts-expect-error ts-error
    const parser = isCustomParser ? formatOption.parser : number.parse;
    let integerPartStartIndex = 0;

    if (!isCustomParser) {
      const formatPointIndex = getRealSeparatorIndex(format).index;
      const textPointIndex = this._getTextSeparatorIndex(text);

      const formatIntegerPartLength = formatPointIndex !== -1 ? formatPointIndex : format.length;
      const textIntegerPartLength = textPointIndex !== -1 ? textPointIndex : text.length;

      if (textIntegerPartLength > formatIntegerPartLength && format.indexOf('#') === -1) {
        integerPartStartIndex = textIntegerPartLength - formatIntegerPartLength;
      }
    }

    text = text.substr(integerPartStartIndex);

    return parser(text, format);
  }

  _format(value, format) {
    const formatOption = this.option('format');
    // @ts-expect-error ts-error
    const customFormatter = formatOption?.formatter || formatOption;
    const formatter = isFunction(customFormatter) ? customFormatter : number.format;

    const formattedValue = value === null ? '' : formatter(value, format);

    return formattedValue;
  }

  _getFormatPattern() {
    if (!this._currentFormat) {
      this._updateFormat();
    }

    return this._currentFormat;
  }

  _updateFormat(): void {
    const { format } = this.option();
    // @ts-expect-error ts-error
    const isCustomParser = isFunction(format?.parser);
    const isLDMLPattern = isString(format) && (format.includes('0') || format.includes('#'));
    // @ts-expect-error ts-error
    const isExponentialFormat = format === 'exponential' || format?.type === 'exponential';
    const shouldUseFormatAsIs = isCustomParser || isLDMLPattern || isExponentialFormat;

    this._currentFormat = shouldUseFormatAsIs
      ? format
      : getLDMLFormat((value) => {
        const text = this._format(value, format);
        return number.convertDigits(text, true);
      });
  }

  _getFormatForSign(text) {
    const format = this._getFormatPattern();
    if (isString(format)) {
      const signParts = format.split(';');
      const sign = number.getSign(text, format);

      signParts[1] = signParts[1] || `-${signParts[0]}`;
      return sign < 0 ? signParts[1] : signParts[0];
    }
    const sign = number.getSign(text);
    return sign < 0 ? '-' : '';
  }

  _removeStubs(text, excludeComma?): string {
    const format = this._getFormatForSign(text);
    const thousandsSeparator = number.getThousandsSeparator();
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

  _getStubs(format) {
    const regExpResult = /[^']([#0.,]+)/g.exec(format);
    const pattern = regExpResult && regExpResult[0].trim();

    return format
      .split(pattern)
      .map((stub) => stub.replace(/'/g, ''));
  }

  _truncateToPrecision(value, maxPrecision) {
    if (isDefined(value)) {
      const strValue = value.toString();
      const decimalSeparatorIndex = strValue.indexOf('.');

      if (strValue && decimalSeparatorIndex > -1) {
        const parsedValue = parseFloat(strValue.substr(0, decimalSeparatorIndex + maxPrecision + 1));
        return isNaN(parsedValue) ? value : parsedValue;
      }
    }
    return value;
  }

  _tryParse(text, selection, char?) {
    const isTextSelected = selection.start !== selection.end;
    const isWholeTextSelected = isTextSelected && selection.start === 0 && selection.end === text.length;
    const decimalSeparator = number.getDecimalSeparator();

    if (isWholeTextSelected && char === decimalSeparator) {
      return 0;
    }

    const editedText = this._replaceSelectedText(text, selection, char);
    const format = this._getFormatPattern();

    let parsedValue = this._getParsedValue(editedText, format);
    const maxPrecision = !format.parser && this._getPrecisionLimits(editedText).max;
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
      // @ts-expect-error ts-error
      parsedValue = Math.abs(this._parsedValue * 0);
    }

    if (isNaN(parsedValue)) {
      return undefined;
    }

    const value = parsedValue === null ? this._parsedValue : parsedValue;
    parsedValue = maxPrecision ? this._truncateToPrecision(value, maxPrecision) : parsedValue;

    if (!format.parser && this._isPercentFormat()) {
      const interval = this._getIntervalFromPrecision(maxPrecision);

      return adjustPercentValue(parsedValue, interval);
    }

    return parsedValue;
  }

  _getIntervalFromPrecision(precision) {
    if (precision < 1) {
      return 1;
    }

    return 10 ** -precision;
  }

  _getParsedValue(text, format) {
    const sign = number.getSign(text, format?.formatter || format);
    const textWithoutStubs = this._removeStubs(text, true);
    const parsedValue = this._parse(textWithoutStubs, format);
    const parsedValueSign = parsedValue < 0 ? -1 : 1;
    const parsedValueWithSign = isNumeric(parsedValue) && sign !== parsedValueSign ? sign * parsedValue : parsedValue;

    return parsedValueWithSign;
  }

  _isValueIncomplete(text) {
    if (!this._useMaskBehavior()) {
      return super._isValueIncomplete(text);
    }

    const caret = this._caret();
    const point = number.getDecimalSeparator();
    const pointIndex = this._getTextSeparatorIndex(text);
    const isCaretOnFloat = pointIndex >= 0 && pointIndex < (caret?.start ?? 0);
    const textParts = this._removeStubs(text, true).split(point);

    if (!isCaretOnFloat || textParts.length !== 2) {
      return false;
    }

    const floatLength = textParts[1].length;
    const format = this._getFormatPattern();
    const isCustomParser = !!format.parser;
    const precision = !isCustomParser && this._getPrecisionLimits(this._getFormatPattern());
    const isPrecisionInRange = isCustomParser
      ? true
      // @ts-expect-error ts-error
      : inRange(floatLength, precision.min, precision.max);
    const endsWithZero = textParts[1].charAt(floatLength - 1) === '0';

    return isPrecisionInRange && (endsWithZero || !floatLength);
  }

  _isValueInRange(value) {
    // @ts-expect-error ts-error
    const min = ensureDefined(this.option('min'), -Infinity);
    // @ts-expect-error ts-error
    const max = ensureDefined(this.option('max'), Infinity);

    return inRange(value, min, max);
  }

  _setInputText(text): void {
    const normalizedText = number.convertDigits(text, true);
    const newCaret = getCaretAfterFormat(this._getInputVal(), normalizedText, this._caret(), this._getFormatPattern());

    this._input().val(text);
    this._toggleEmptinessEventHandler();
    this._formattedValue = text;

    if (!this._focusOutOccurs) {
      this._caret(newCaret);
    }
  }

  _useMaskBehavior(): boolean {
    const { useMaskBehavior } = this.option();
    // @ts-expect-error ts-error
    return !!this.option('format') && useMaskBehavior;
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

  _isChar(str) {
    return isString(str) && str.length === 1;
  }

  _moveCaret(offset?): void {
    if (!offset) {
      return;
    }

    const newCaret = getCaretWithOffset(this._caret(), offset);
    const adjustedCaret = getCaretInBoundaries(newCaret, this._getInputVal(), this._getFormatPattern());

    this._caret(adjustedCaret);
  }

  _shouldHandleKey(e): boolean {
    const keyName = normalizeKeyName(e);
    const isSpecialChar = isCommandKeyPressed(e) || e.altKey || e.shiftKey || !this._isChar(keyName);
    const isMinusKey = keyName === MINUS_KEY;
    const useMaskBehavior = this._useMaskBehavior();

    return useMaskBehavior && !isSpecialChar && !isMinusKey;
  }

  _renderInput(): void {
    super._renderInput();
    this._renderFormatter();
  }

  _renderFormatter() {
    this._clearCache();
    this._detachFormatterEvents();

    if (this._useMaskBehavior()) {
      this._attachFormatterEvents();
    }
  }

  _detachFormatterEvents() {
    eventsEngine.off(this._input(), `.${NUMBER_FORMATTER_NAMESPACE}`);
  }

  _isInputFromPaste(e) {
    const inputType = e.originalEvent?.inputType;

    if (isDefined(inputType)) {
      return inputType === 'insertFromPaste';
    }
    return this._isValuePasted;
  }

  _attachFormatterEvents(): void {
    const $input = this._input();

    eventsEngine.on($input, addNamespace(INPUT_EVENT, NUMBER_FORMATTER_NAMESPACE), (e) => {
      this._formatValue(e);
      this._isValuePasted = false;
    });

    eventsEngine.on($input, addNamespace('dxclick', NUMBER_FORMATTER_NAMESPACE), () => {
      if (!this._caretTimeout) {
        this._caretTimeout = setTimeout(() => {
          this._caretTimeout = undefined;
          this._caret(getCaretInBoundaries(this._caret(), this._getInputVal(), this._getFormatPattern()));
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

  _forceRefreshInputValue() {
    if (!this._useMaskBehavior()) {
      return super._forceRefreshInputValue();
    }
  }

  _isNonStubAfter(index) {
    const text = this._getInputVal().slice(index);
    return text && !this._isStub(text, true);
  }

  _isStub(str, isString?) {
    const escapedDecimalSeparator = escapeRegExp(number.getDecimalSeparator());
    const regExpString = `^[^0-9${escapedDecimalSeparator}]+$`;
    const stubRegExp = new RegExp(regExpString, 'g');

    return stubRegExp.test(str) && (isString || this._isChar(str));
  }

  _parseValue(text?): number | null {
    if (!this._useMaskBehavior()) {
      return super._parseValue(text);
    }
    // @ts-expect-error ts-error
    return this._parsedValue;
  }

  _getPrecisionLimits(text): { min: number; max: number } {
    const currentFormat = this._getFormatForSign(text);
    const realSeparatorIndex = getRealSeparatorIndex(currentFormat).index;
    const floatPart = (splitByIndex(currentFormat, realSeparatorIndex)[1] || '').replace(/[^#0]/g, '');
    const minPrecision = floatPart.replace(/^(0*)#*/, '$1').length;
    const maxPrecision = floatPart.length;

    return { min: minPrecision, max: maxPrecision };
  }

  _revertSign(e) {
    if (!this._useMaskBehavior()) {
      return;
    }

    const caret = this._caret();
    if (caret !== undefined && caret.start !== caret.end) {
      if (normalizeKeyName(e) === MINUS_KEY) {
        this._applyRevertedSign(e, caret, true);
        return;
      }
      this._caret(getCaretInBoundaries(0, this._getInputVal(), this._getFormatPattern()));
    }

    this._applyRevertedSign(e, caret);
  }

  _applyRevertedSign(e, caret, preserveSelectedText?): void {
    const newValue = -1 * ensureDefined(this._parsedValue, null);

    if (this._isValueInRange(newValue) || newValue === 0) {
      this._parsedValue = newValue;

      if (preserveSelectedText) {
        const format = this._getFormatPattern();
        const previousText = this._getInputVal();

        this._setTextByParsedValue();
        e.preventDefault();

        const currentText = this._getInputVal();
        const offset = getCaretOffset(previousText, currentText, format);

        caret = getCaretWithOffset(caret, offset);

        const caretInBoundaries = getCaretInBoundaries(caret, currentText, format);

        this._caret(caretInBoundaries);
      }
    }
  }

  _removeMinusFromText(text, caret) {
    const isMinusPressed = this._lastKeyName === MINUS_KEY && text.charAt(caret.start - 1) === MINUS;

    return isMinusPressed ? this._replaceSelectedText(text, {
      start: caret.start - 1,
      end: caret.start,
    }, '') : text;
  }

  _setTextByParsedValue(): void {
    const format = this._getFormatPattern();
    const parsed = this._parseValue();
    const formatted = this._format(parsed, format) || '';

    this._setInputText(formatted);
  }

  _formatValue(e): void {
    let normalizedText = this._getInputVal();
    const caret = this._caret();
    const textWithoutMinus = this._removeMinusFromText(normalizedText, caret);
    const wasMinusRemoved = textWithoutMinus !== normalizedText;

    normalizedText = textWithoutMinus;

    if (!this._isInputFromPaste(e) && this._isValueIncomplete(textWithoutMinus)) {
      this._formattedValue = normalizedText;
      if (wasMinusRemoved) {
        this._setTextByParsedValue();
      }
      return;
    }

    const textWasChanged = number.convertDigits(this._formattedValue, true) !== normalizedText;
    if (textWasChanged) {
      const value = this._tryParse(normalizedText, caret, '');
      if (isDefined(value)) {
        this._parsedValue = value;
      }
    }

    this._setTextByParsedValue();
  }

  _renderDisplayText(): void {
    if (this._useMaskBehavior()) {
      this._toggleEmptinessEventHandler();
    } else {
      // @ts-expect-error ts-error
      super._renderDisplayText.apply(this, arguments);
    }
  }

  _renderValue() {
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

    this._parsedValue = fitIntoRange(parsedValue, this.option('min'), this.option('max'));
  }

  _valueChangeEventHandler(e): void {
    if (!this._useMaskBehavior()) {
      return super._valueChangeEventHandler(e);
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

  _optionChanged(args): void {
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
