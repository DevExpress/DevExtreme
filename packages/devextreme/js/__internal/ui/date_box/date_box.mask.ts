import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace, isCommandKeyPressed, normalizeKeyName } from '@js/common/core/events/utils/index';
import { getFormat } from '@js/common/core/localization/ldml/date.format';
import { getRegExpInfo } from '@js/common/core/localization/ldml/date.parser';
import numberLocalization from '@js/common/core/localization/number';
import devices from '@js/core/devices';
import browser from '@js/core/utils/browser';
import { clipboardText } from '@js/core/utils/dom';
import { fitIntoRange, inRange, sign } from '@js/core/utils/math';
import {
  isDate, isDefined, isFunction, isString,
} from '@js/core/utils/type';
import type { DxEvent, InteractionEvent } from '@js/events';
import type { DateLike, Properties } from '@js/ui/date_box';
import dateLocalization from '@ts/core/localization/date';
import type { OptionChanged } from '@ts/core/widget/types';
import type { KeyboardKeyDownEvent } from '@ts/events/core/m_keyboard_processor';

import type { DxMouseWheelEvent } from '../scroll_view/types';
import type { DateBoxBaseProperties } from './date_box.base';
import DateBoxBase from './date_box.base';
import { getDatePartIndexByPosition, renderDateParts } from './date_box.mask.parts';

const MASK_EVENT_NAMESPACE = 'dateBoxMask';
const FORWARD = 1;
const BACKWARD = -1;
const IME_DIGIT_CODE_REGEXP = /^(?:Digit|Numpad)(\d)$/;

export interface DateBoxMaskProperties extends Properties {
  emptyDateValue?: Date;
}
class DateBoxMask extends DateBoxBase {
  _activePartIndex?: number | null;

  _maskValue?: Date | null;

  _dateParts!: { caret: { start: number; end: number }; isStub: boolean }[];

  _maskInputHandler?: (() => void) | null;

  _initialMaskValue?: Date | null;

  _searchValue!: string;

  _regExpInfo!: { regexp: RegExp; patterns: string[] };

  _formatPattern?: string | null;

  _pendingIMEDigit?: string | null;

  _isIMEDigitProcessed?: boolean;

  _isIMECommitPending?: boolean;

  _supportedKeys(): Record<string, (e: KeyboardEvent) => boolean | undefined> {
    const originalHandlers = super._supportedKeys();
    const callOriginalHandler = (e: KeyboardEvent): boolean | undefined => {
      const normalizedKeyName = normalizeKeyName(e);
      const originalHandler = normalizedKeyName ? originalHandlers[normalizedKeyName] : undefined;
      return originalHandler?.apply(this, [e]);
    };
    const applyHandler = (
      e: KeyboardEvent,
      maskHandler: (e: KeyboardEvent) => boolean | undefined,
    ): boolean | undefined => {
      if (this._shouldUseOriginalHandler(e)) {
        return callOriginalHandler.apply(this, [e]);
      }
      return maskHandler.apply(this, [e]);
    };

    return {
      ...originalHandlers,
      del: (e) => applyHandler(e, (event) => {
        this._revertPart(FORWARD);
        if (!this._isAllSelected()) {
          event.preventDefault();
        }
        return undefined;
      }),
      backspace: (e) => applyHandler(e, (event) => {
        this._revertPart(BACKWARD);
        if (!this._isAllSelected()) {
          event.preventDefault();
        }
        return undefined;
      }),
      home: (e) => applyHandler(e, (event) => {
        this._selectFirstPart();
        event.preventDefault();
        return undefined;
      }),
      end: (e) => applyHandler(e, (event) => {
        this._selectLastPart();
        event.preventDefault();
        return undefined;
      }),
      escape: (e) => applyHandler(e, () => {
        this._revertChanges();
        return undefined;
      }),
      enter: (e) => applyHandler(e, () => {
        this._enterHandler();
        return undefined;
      }),
      leftArrow: (e) => applyHandler(e, (event) => {
        this._selectNextPart(BACKWARD);
        event.preventDefault();
        return undefined;
      }),
      rightArrow: (e) => applyHandler(e, (event) => {
        this._selectNextPart(FORWARD);
        event.preventDefault();
        return undefined;
      }),
      upArrow: (e) => applyHandler(e, (event) => {
        this._upDownArrowHandler(FORWARD);
        event.preventDefault();
        return undefined;
      }),
      downArrow: (e) => applyHandler(e, (event) => {
        this._upDownArrowHandler(BACKWARD);
        event.preventDefault();
        return undefined;
      }),
    };
  }

  _shouldUseOriginalHandler(e: KeyboardEvent): boolean {
    const keysToHandleByMask = ['backspace', 'del'];
    const { opened = false } = this.option();
    const isNotDeletingInCalendar = opened && e && !keysToHandleByMask.includes(normalizeKeyName(e) ?? '');

    return !this._useMaskBehavior() || isNotDeletingInCalendar || (e?.altKey);
  }

  _upDownArrowHandler(step: number): void {
    this._setNewDateIfEmpty();

    const originalValue = this._getActivePartValue(this._initialMaskValue);
    const currentValue = this._getActivePartValue();
    const delta = currentValue - originalValue;

    this._loadMaskValue(this._initialMaskValue);
    this._changePartValue(delta + step, true);
  }

  _changePartValue(step: number, lockOtherParts?: boolean): void {
    const activePartPattern = this._getActivePartProp('pattern');
    const isAmPmPartActive = /^a{1,5}$/.test(activePartPattern);

    if (isAmPmPartActive) {
      this._toggleAmPm();
    } else {
      this._partIncrease(step, lockOtherParts);
    }
  }

  _toggleAmPm(): void {
    const currentValue = this._getActivePartProp('text');
    const periodNames = dateLocalization.getPeriodNames(this._formatPattern);
    const indexOfCurrentValue = periodNames.indexOf(currentValue);

    // eslint-disable-next-line no-bitwise
    const newValue = indexOfCurrentValue ^ 1;

    this._setActivePartValue(newValue);
  }

  _getDefaultOptions(): DateBoxMaskProperties {
    return {
      ...super._getDefaultOptions(),
      useMaskBehavior: false,
      emptyDateValue: new Date(2000, 0, 1, 0, 0, 0),
    };
  }

  _isSingleCharKey(
    { originalEvent, alt }: {
      originalEvent: { data: string, key: string, ctrlKey: boolean, metaKey: boolean };
      alt?: boolean
    },
  ): boolean {
    const key = originalEvent.data ?? originalEvent.key;
    return typeof key === 'string' && key.length === 1 && !alt && !isCommandKeyPressed(originalEvent);
  }

  _isSingleDigitKey(e: {
    originalEvent: InputEvent;
    alt?: boolean;
  }): boolean {
    const data = e.originalEvent?.data;
    return data?.length === 1 && !isNaN(parseInt(data, 10));
  }

  _useBeforeInputEvent(): boolean {
    return Boolean(devices.real().android);
  }

  _keyInputHandler(e: DxEvent, key: string): void {
    const oldInputValue = this._input().val();
    this._processInputKey(key);
    e.preventDefault();
    const isValueChanged = oldInputValue !== this._input().val();

    if (isValueChanged) {
      eventsEngine.triggerHandler(this._input(), { type: 'input' });
    }
  }

  _keyboardHandler(e: KeyboardKeyDownEvent): boolean {
    const { key } = e.originalEvent;

    const result = super._keyboardHandler(e);

    if (!this._useMaskBehavior() || this._useBeforeInputEvent()) {
      this._pendingIMEDigit = null;
      this._isIMEDigitProcessed = false;
      this._isIMECommitPending = false;

      return result;
    }

    const chromiumDigitCodeMatch = IME_DIGIT_CODE_REGEXP.exec(e.code);

    if (browser.chrome && e.key === 'Process' && chromiumDigitCodeMatch) {
      const [, digit] = chromiumDigitCodeMatch;

      this._pendingIMEDigit = digit;

      return result;
    }

    this._pendingIMEDigit = null;
    this._isIMEDigitProcessed = false;

    if (this._isSingleCharKey(e)) {
      this._keyInputHandler(e.originalEvent, key);
    }

    return result;
  }

  _maskBeforeInputHandler(e: DxEvent<KeyboardKeyDownEvent & InputEvent>): boolean {
    this._maskInputHandler = null;

    const { inputType } = e.originalEvent;

    if (inputType === 'insertCompositionText') {
      this._maskInputHandler = (): void => {
        this._renderSelectedPart();
      };
    }

    const isBackwardDeletion = inputType === 'deleteContentBackward';
    const isForwardDeletion = inputType === 'deleteContentForward';
    if (isBackwardDeletion || isForwardDeletion) {
      const direction = isBackwardDeletion ? BACKWARD : FORWARD;
      this._maskInputHandler = (): void => {
        this._revertPart();
        this._selectNextPart(direction);
      };
    }

    if (!this._useMaskBehavior() || !this._isSingleCharKey(e)) {
      return false;
    }

    const key = e.originalEvent.data ?? '';
    this._keyInputHandler(e, key);

    return true;
  }

  _syncInputWithMask(): void {
    this._input().val(this._getDisplayedText(this._maskValue));
    this._caret(this._getActivePartProp('caret'));
  }

  _keyPressHandler(e: { originalEvent: InputEvent & KeyboardEvent }): void {
    const { originalEvent: event } = e;

    const isCompositionDigit = event?.inputType === 'insertCompositionText'
      && this._isSingleDigitKey(e);

    const isIMECommitDigit = event?.inputType === 'insertText'
      && this._isSingleDigitKey(e)
      && this._isIMECommitPending;

    if (isCompositionDigit && event.data) {
      if (!this._isIMEDigitProcessed) {
        this._processInputKey(event.data);
        this._isIMEDigitProcessed = true;
        this._isIMECommitPending = true;
      }

      this._syncInputWithMask();

      return;
    }

    if (isIMECommitDigit) {
      this._isIMECommitPending = false;
      this._pendingIMEDigit = null;

      this._syncInputWithMask();

      return;
    }
    super._keyPressHandler(e);

    if (this._maskInputHandler) {
      this._maskInputHandler();
      this._maskInputHandler = null;
    }
  }

  _processInputKey(key: string): void {
    const hasMultipleParts = this._dateParts?.length > 1;

    if (this._isAllSelected() && hasMultipleParts) {
      this._activePartIndex = 0;
      this._clearSearchValue();
    }
    this._setNewDateIfEmpty();

    if (isNaN(parseInt(key, 10))) {
      this._searchString(key);
    } else {
      this._searchNumber(key);
    }
  }

  _isAllSelected(): boolean {
    const caret = this._caret();
    const { text = '' } = this.option();

    const caretStart = caret?.start ?? 0;
    const caretEnd = caret?.end ?? 0;

    return caretEnd - caretStart === text.length;
  }

  _getFormatPattern(): string {
    if (this._formatPattern) {
      return this._formatPattern;
    }

    const { displayFormat } = this.option();
    const format = this._strategy.getDisplayFormat(displayFormat);
    const isLDMLPattern = isString(format) && !dateLocalization._getPatternByFormat(format);

    if (isLDMLPattern) {
      this._formatPattern = format;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      this._formatPattern = getFormat((value) => dateLocalization.format(value, format)) as string;
    }

    return this._formatPattern;
  }

  _setNewDateIfEmpty(): void {
    if (!this._maskValue) {
      const { type } = this.option();
      const value = type === 'time' ? new Date(0) : new Date();

      this._maskValue = value;
      this._initialMaskValue = value;
      this._renderDateParts();
    }
  }

  _partLimitsReached(max: number): boolean {
    const maxLimitLength = String(max).length;
    const formatLength = this._getActivePartProp('pattern').length;
    const isShortFormat = formatLength === 1;
    const maxSearchLength = isShortFormat ? maxLimitLength : Math.min(formatLength, maxLimitLength);
    const isLengthExceeded = this._searchValue.length === maxSearchLength;
    const isValueOverflowed = parseInt(`${this._searchValue}0`, 10) > max;

    return isLengthExceeded || isValueOverflowed;
  }

  _searchNumber(char: string): void {
    const { max } = this._getActivePartLimits();
    const maxLimitLength = String(max).length;

    this._searchValue = (this._searchValue + char).substr(-maxLimitLength);

    if (isNaN(parseInt(this._searchValue, 10))) {
      this._searchValue = char;
    }

    this._setActivePartValue(this._searchValue);

    if (this._partLimitsReached(max)) {
      this._selectNextPart(FORWARD);
    }
  }

  _searchString(char: string): void {
    const text = this._getActivePartProp('text');
    const convertedText = numberLocalization.convertDigits(text, true);

    if (!isNaN(parseInt(convertedText, 10))) {
      return;
    }

    const limits = this._getActivePartProp('limits')(this._maskValue as Date);
    const startString = this._searchValue + char.toLowerCase();
    const endLimit = limits.max - limits.min;

    for (let i = 0; i <= endLimit; i += 1) {
      this._loadMaskValue(this._initialMaskValue);

      this._changePartValue(i + 1);

      if (this._getActivePartProp('text').toLowerCase().startsWith(startString)) {
        this._searchValue = startString;
        return;
      }
    }

    this._setNewDateIfEmpty();

    if (this._searchValue) {
      this._clearSearchValue();
      this._searchString(char);
    }
  }

  _clearSearchValue(): void {
    this._searchValue = '';
  }

  _revertPart(direction?: number): void {
    if (!this._isAllSelected()) {
      const { emptyDateValue } = this.option();
      const actual = this._getActivePartValue(emptyDateValue);
      this._setActivePartValue(actual);

      this._selectNextPart(direction);
    }
    this._clearSearchValue();
  }

  _useMaskBehavior(): boolean {
    const { mode } = this.option();
    return this.option('useMaskBehavior') && mode === 'text';
  }

  _prepareRegExpInfo(): void {
    this._regExpInfo = getRegExpInfo(this._getFormatPattern(), dateLocalization);
    const { regexp } = this._regExpInfo;
    const { source } = regexp;
    const { flags } = regexp;
    const quantifierRegexp = new RegExp(/(\{[0-9]+,?[0-9]*\})/);

    const convertedSource = source
      .split(quantifierRegexp)
      .map((sourcePart) => (quantifierRegexp.test(sourcePart)
        ? sourcePart
        : numberLocalization.convertDigits(sourcePart, false)) as string)
      .join('');
    this._regExpInfo.regexp = new RegExp(convertedSource, flags);
  }

  _initMaskState(): void {
    this._activePartIndex = 0;
    this._formatPattern = null;
    this._prepareRegExpInfo();
    this._loadMaskValue();
  }

  _renderMask(): void {
    super._renderMask();
    this._detachMaskEvents();
    this._clearMaskState();

    if (this._useMaskBehavior()) {
      this._attachMaskEvents();
      this._initMaskState();
      this._renderDateParts();
    }
  }

  _renderDateParts(): void {
    if (!this._useMaskBehavior()) {
      return;
    }

    const { text } = this.option();
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const newText = text || this._getDisplayedText(this._maskValue);

    if (newText) {
      this._dateParts = renderDateParts(newText, this._regExpInfo);
      if (!this._input().is(':hidden')) {
        this._selectNextPart();
      }
    }
  }

  _detachMaskEvents(): void {
    eventsEngine.off(this._input(), `.${MASK_EVENT_NAMESPACE}`);
  }

  _attachMaskEvents(): void {
    eventsEngine.on(this._input(), addNamespace('dxclick', MASK_EVENT_NAMESPACE), this._maskClickHandler.bind(this));
    eventsEngine.on(this._input(), addNamespace('paste', MASK_EVENT_NAMESPACE), this._maskPasteHandler.bind(this));
    eventsEngine.on(this._input(), addNamespace('drop', MASK_EVENT_NAMESPACE), () => {
      this._renderSelectedPart();
    });

    eventsEngine.on(this._input(), addNamespace('compositionstart', MASK_EVENT_NAMESPACE), this._maskCompositionStartHandler.bind(this));
    eventsEngine.on(this._input(), addNamespace('compositionend', MASK_EVENT_NAMESPACE), this._maskCompositionEndHandler.bind(this));

    if (this._useBeforeInputEvent()) {
      eventsEngine.on(this._input(), addNamespace('beforeinput', MASK_EVENT_NAMESPACE), this._maskBeforeInputHandler.bind(this));
    }
  }

  _renderSelectedPart(): void {
    this._renderDisplayText(this._getDisplayedText(this._maskValue));
    this._selectNextPart();
  }

  _selectLastPart(): void {
    if (this.option('text')) {
      this._activePartIndex = this._dateParts.length;
      this._selectNextPart(BACKWARD);
    }
  }

  _selectFirstPart(): void {
    if (this.option('text') && this._dateParts) {
      this._activePartIndex = -1;
      this._selectNextPart(FORWARD);
    }
  }

  _hasMouseWheelHandler(): boolean {
    return true;
  }

  _onMouseWheel(e: DxMouseWheelEvent): void {
    if (this._useMaskBehavior()) {
      this._partIncrease(e.delta > 0 ? FORWARD : BACKWARD, Boolean(e));
    }
  }

  _selectNextPart(step = 0): void {
    if (!this.option('text') || this._disposed) {
      return;
    }

    if (step) {
      this._initialMaskValue = new Date(this._maskValue as Date);
    }

    const activePartIndex = this._activePartIndex ?? 0;
    let index = fitIntoRange(activePartIndex + step, 0, this._dateParts.length - 1);
    if (this._dateParts[index]?.isStub) {
      const isBoundaryIndex = (index === 0 && step < 0)
        || (index === this._dateParts.length - 1 && step > 0);
      if (!isBoundaryIndex) {
        this._selectNextPart(step >= 0 ? step + 1 : step - 1);
        return;
      }

      index = activePartIndex;
    }

    if (activePartIndex !== index) {
      this._clearSearchValue();
    }

    this._activePartIndex = index;
    this._caret(this._getActivePartProp('caret'));
  }

  _getRealLimitsPattern(): string | undefined {
    if (this._getActivePartProp('pattern').startsWith('d')) {
      return 'dM';
    }

    return undefined;
  }

  _getActivePartLimits(lockOtherParts = false): { min: number; max: number } {
    const limitFunction = this._getActivePartProp('limits');
    return limitFunction(
      this._maskValue as Date,
      lockOtherParts ? this._getRealLimitsPattern() : undefined,
    );
  }

  _getActivePartValue(dateValue?: Date | null): number {
    const date = dateValue ?? this._maskValue as Date;
    const getter = this._getActivePartProp('getter');
    const isGetterFunction = isFunction(getter);

    const activePartValue = isGetterFunction ? getter(date) : date[getter]() as number;

    return activePartValue;
  }

  _addLeadingZeroes(value: number): string {
    const zeroes = /^0+/.exec(this._searchValue);
    const limits = this._getActivePartLimits();
    const maxLimitLength = String(limits.max).length;

    return (((zeroes?.[0]) ?? '') + String(value)).substr(-maxLimitLength);
  }

  _setActivePartValue(value: number | string, dateValue?: Date): void {
    let newValue: number | string = +value;

    const newDateValue = dateValue ?? this._maskValue as Date;
    const setter = this._getActivePartProp('setter');
    const limits = this._getActivePartLimits();

    newValue = inRange(newValue, limits.min, limits.max) ? newValue : newValue % 10;
    newValue = this._addLeadingZeroes(fitIntoRange(newValue, limits.min, limits.max));

    if (isFunction(setter)) {
      setter(newDateValue, newValue);
    } else {
      newDateValue[setter](newValue);
    }

    this._renderDisplayText(this._getDisplayedText(newDateValue));
    this._renderDateParts();
  }

  _getActivePartProp(property: 'caret'): { start: number; end: number };
  _getActivePartProp(property: 'isStub'): boolean;
  _getActivePartProp(property: 'pattern' | 'text'): string;
  _getActivePartProp(property: 'limits'): (date: Date, forcedPattern?: string) => { min: number; max: number };
  _getActivePartProp(property: 'setter'): string | ((date: Date, value: number | string) => void);
  _getActivePartProp(property: 'getter'): string | ((date: Date) => number);
  _getActivePartProp(property: 'caret' | 'isStub' | 'pattern' | 'text' | 'limits' | 'setter' | 'getter'): unknown {
    if (!isDefined(this._activePartIndex)) {
      return undefined;
    }

    if (!this._dateParts?.[this._activePartIndex]) {
      return undefined;
    }

    return this._dateParts[this._activePartIndex][property] as unknown;
  }

  _loadMaskValue(value: Date | null | string = this.getDateOption('value')): void {
    this._maskValue = value ? new Date(value) : null;
    this._initialMaskValue = value ? new Date(value) : null;
  }

  _saveMaskValue(): void {
    const value = this._maskValue && new Date(this._maskValue);
    const { type } = this.option();

    if (value && type === 'date') {
      value.setHours(0, 0, 0, 0);
    }
    // @ts-expect-error ts-error
    this._initialMaskValue = new Date(value);

    if (this._applyInternalValidation(value).isValid) {
      this.setDateOption('value', value);
    }
  }

  _revertChanges(): void {
    this._loadMaskValue();
    this._renderDisplayText(this._getDisplayedText(this._maskValue));
    this._renderDateParts();
  }

  _renderDisplayText(text?: string): void {
    super._renderDisplayText(text);
    if (this._useMaskBehavior()) {
      this.option('text', text);
    }
  }

  _partIncrease(step: number, lockOtherParts?: boolean): void {
    this._setNewDateIfEmpty();

    const { max, min } = this._getActivePartLimits(lockOtherParts);

    let newValue = step + this._getActivePartValue();

    if (newValue > max) {
      newValue = this._applyLimits(newValue, { limitBase: min, limitClosest: max, max });
    } else if (newValue < min) {
      newValue = this._applyLimits(newValue, { limitBase: max, limitClosest: min, max });
    }

    this._setActivePartValue(newValue);
  }

  _applyLimits(
    newValue: number,
    { limitBase, limitClosest, max }: { limitBase: number, limitClosest: number, max: number },
  ): number {
    const delta = (newValue - limitClosest) % max;
    return delta ? limitBase + delta - 1 * sign(delta) : limitClosest;
  }

  _maskClickHandler(): void {
    this._loadMaskValue(this._maskValue);
    const { text } = this.option();
    if (text) {
      this._activePartIndex = getDatePartIndexByPosition(
        this._dateParts,
        this._caret()?.start ?? 0,
      );

      if (!this._isAllSelected()) {
        this._clearSearchValue();

        if (isDefined(this._activePartIndex)) {
          this._caret(this._getActivePartProp('caret'));
        } else {
          this._selectLastPart();
        }
      }
    }
  }

  _maskCompositionStartHandler(): void {
    this._isIMEDigitProcessed = false;
    this._isIMECommitPending = false;
  }

  _maskCompositionEndHandler(): void {
    this._input().val(this._getDisplayedText(this._maskValue));
    this._caret(this._getActivePartProp('caret'));

    this._maskInputHandler = null;
  }

  _maskPasteHandler(e: DxEvent): void {
    const { text } = this.option();
    // @ts-expect-error text
    const newText = this._replaceSelectedText(text, this._caret(), clipboardText(e));
    const date = dateLocalization.parse(newText, this._getFormatPattern());

    if (date && this._isDateValid(date)) {
      this._maskValue = date;
      this._renderDisplayText(this._getDisplayedText(this._maskValue));
      this._renderDateParts();
      this._selectNextPart();
    }

    e.preventDefault();
  }

  _isDateValid(date: DateLike): boolean {
    return isDate(date) && !isNaN(date.getTime());
  }

  _isValueDirty(): boolean {
    const value = this.getDateOption('value');

    return this._maskValue?.getTime() !== value?.getTime();
  }

  _hasEditorSpecificValidationError(): boolean {
    const { isValid, validationError } = this.option();

    return !isValid && Boolean(validationError?.editorSpecific);
  }

  _fireChangeEvent(): void {
    this._clearSearchValue();

    if (this._isValueDirty() || this._hasEditorSpecificValidationError()) {
      eventsEngine.triggerHandler(this._input(), { type: 'change' });
    }
  }

  _enterHandler(): void {
    this._fireChangeEvent();

    if (this._useMaskBehavior() && this._isAllSelected()) {
      this._selectFirstPart();
    } else {
      this._selectNextPart(FORWARD);
    }
  }

  _focusOutHandler(e: DxEvent): void {
    const shouldFireChangeEvent = this._useMaskBehavior() && !e.isDefaultPrevented();

    if (shouldFireChangeEvent) {
      this._fireChangeEvent();
      super._focusOutHandler(e);
    } else {
      super._focusOutHandler(e);
    }
  }

  _valueChangeEventHandler(e: InteractionEvent): void {
    const { text } = this.option();

    if (this._useMaskBehavior()) {
      this._saveValueChangeEvent(e);
      if (!text) {
        this._maskValue = null;
      } else if (this._maskValue === null) {
        this._loadMaskValue(text);
      }
      this._saveMaskValue();
    } else {
      super._valueChangeEventHandler(e);
    }
  }

  _optionChanged(args: OptionChanged<DateBoxBaseProperties>): void {
    switch (args.name) {
      case 'useMaskBehavior':
        this._renderMask();
        break;
      case 'displayFormat':
      case 'mode':
        super._optionChanged(args);
        this._renderMask();
        break;
      case 'value':
        this._loadMaskValue();
        super._optionChanged(args);
        this._renderDateParts();
        break;
      case 'emptyDateValue':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _clearMaskState(): void {
    this._clearSearchValue();
    // @ts-expect-error ts-error
    delete this._dateParts;
    delete this._activePartIndex;
    delete this._maskValue;
  }

  clear(): void {
    this._clearMaskState();
    this._activePartIndex = 0;

    super.clear();
  }

  _clean(): void {
    super._clean();
    this._detachMaskEvents();
    this._clearMaskState();
  }
}

export default DateBoxMask;
