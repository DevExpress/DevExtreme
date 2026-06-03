import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import config from '@js/core/config';
import devices from '@js/core/devices';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import browser from '@js/core/utils/browser';
import dateUtils from '@js/core/utils/date';
import dateSerialization from '@js/core/utils/date_serialization';
import type { DeferredObj } from '@js/core/utils/deferred';
import { createTextElementHiddenCopy } from '@js/core/utils/dom';
import { extend } from '@js/core/utils/extend';
import { inputType } from '@js/core/utils/support';
import { isDate as isDateType, isNumeric, isString } from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import type { DxEvent, InteractionEvent } from '@js/events';
import type {
  DateLike,
  DatePickerType,
  DateType,
  Properties,
} from '@js/ui/date_box';
import type { ToolbarItem } from '@js/ui/popup';
import type { OptionChanged } from '@ts/core/widget/types';
import DropDownEditor from '@ts/ui/drop_down_editor/drop_down_editor';
import type { ValueChangedEvent } from '@ts/ui/editor/editor';

import type { PopupProperties } from '../popup/m_popup';
import uiDateUtils from './date_utils';
import Calendar from './m_date_box.strategy.calendar';
import CalendarWithTime from './m_date_box.strategy.calendar_with_time';
import DateView from './m_date_box.strategy.date_view';
import List from './m_date_box.strategy.list';
import Native from './m_date_box.strategy.native';

const window = getWindow();

const DATEBOX_CLASS = 'dx-datebox';
const DX_AUTO_WIDTH_CLASS = 'dx-auto-width';
const DX_INVALID_BADGE_CLASS = 'dx-show-invalid-badge';
const DX_CLEAR_BUTTON_CLASS = 'dx-clear-button-area';
const DATEBOX_WRAPPER_CLASS = 'dx-datebox-wrapper';
const DROPDOWNEDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';

const PICKER_TYPE: Record<DatePickerType, DatePickerType> = {
  calendar: 'calendar',
  rollers: 'rollers',
  list: 'list',
  native: 'native',
};

const TYPE: Record<DateType, DateType> = {
  date: 'date',
  datetime: 'datetime',
  time: 'time',
};

const STRATEGY_NAME = {
  calendar: 'Calendar',
  dateView: 'DateView',
  native: 'Native',
  calendarWithTime: 'CalendarWithTime',
  list: 'List',
};

const STRATEGY_CLASSES = {
  Calendar,
  DateView,
  Native,
  CalendarWithTime,
  List,
};

export interface DateBoxBaseProperties extends Omit<Properties, 'onClosed' | 'onOpened'> {
  buttonsLocation?: string;
  emptyDateValue?: Date;
  _showValidationIcon?: boolean;
}

class DateBox extends DropDownEditor<DateBoxBaseProperties> {
  _strategy!: Calendar | DateView | Native | CalendarWithTime | List;

  _pickerType?: DatePickerType;

  _storedPadding?: number;

  _userOptions?: DateBoxBaseProperties;

  _supportedKeys(): Record<string, (e: KeyboardEvent) => boolean | undefined> {
    // @ts-expect-error ts-error
    return {
      ...super._supportedKeys(),
      ...this._strategy.supportedKeys(),
    };
  }

  _renderButtonContainers(): void {
    super._renderButtonContainers();
    this._strategy.customizeButtons();
  }

  _getDefaultOptions(): DateBoxBaseProperties {
    return {
      ...super._getDefaultOptions(),
      type: 'date',
      showAnalogClock: true,
      value: null,
      // @ts-expect-error ts-error
      displayFormat: null,
      interval: 30,
      // @ts-expect-error ts-error
      disabledDates: null,
      pickerType: PICKER_TYPE.calendar,
      invalidDateMessage: messageLocalization.format('dxDateBox-validation-datetime'),
      dateOutOfRangeMessage: messageLocalization.format('validation-range'),
      applyButtonText: messageLocalization.format('OK'),
      adaptivityEnabled: false,
      calendarOptions: {},
      useHiddenSubmitElement: true,

      _showValidationIcon: true,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<DateBoxBaseProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device: { platform: 'ios' },
        options: {
          dropDownOptions: {
            showTitle: true,
          },
        },
      },
      {
        device: { platform: 'android' },
        options: {
          buttonsLocation: 'bottom after',
        },
      },
      {
        device(): boolean {
          const realDevice = devices.real();
          const { platform } = realDevice;
          return platform === 'ios' || platform === 'android';
        },
        options: {
          pickerType: PICKER_TYPE.native,
        },
      },
      {
        device: {
          platform: 'generic',
          deviceType: 'desktop',
        },
        options: {
          buttonsLocation: 'bottom after',
        },
      },
    ]);
  }

  _initOptions(options: DateBoxBaseProperties): void {
    this._userOptions = extend({}, options);
    super._initOptions(options);
    this._updatePickerOptions();
  }

  _updatePickerOptions(): void {
    let { pickerType } = this.option();
    const { type } = this.option();

    if (pickerType === PICKER_TYPE.list && (type === TYPE.datetime || type === TYPE.date)) {
      pickerType = PICKER_TYPE.calendar;
    }

    if (type === TYPE.time && pickerType === PICKER_TYPE.calendar) {
      pickerType = PICKER_TYPE.list;
    }

    this._pickerType = pickerType;

    this._setShowDropDownButtonOption();
  }

  _setShowDropDownButtonOption(): void {
    const { platform } = devices.real();
    const isMozillaOnAndroid = platform === 'android' && browser.mozilla;
    const isNativePickerType = this._isNativeType();
    let showDropDownButton = platform !== 'generic' || !isNativePickerType;

    if (isNativePickerType && isMozillaOnAndroid) { // T1197922
      showDropDownButton = false;
    }

    this.option({ showDropDownButton });
  }

  _init(): void {
    this._initStrategy();
    this.option(extend({}, this._strategy.getDefaultOptions(), this._userOptions));
    delete this._userOptions;
    super._init();
  }

  _toLowerCaseFirstLetter(string: string): string {
    return string.charAt(0).toLowerCase() + string.substr(1);
  }

  _initStrategy(): void {
    const strategyName = this._getStrategyName(this._getFormatType());
    const strategy = STRATEGY_CLASSES[strategyName];

    if (!(this._strategy?.NAME === strategyName)) {
      // eslint-disable-next-line new-cap
      this._strategy = new strategy(this);
    }
  }

  _getFormatType(): DateType {
    const { type = 'date' } = this.option();
    const isTime = /h|m|s/g.test(type);
    const isDate = /d|M|Y/g.test(type);

    if (isDate && isTime) {
      return TYPE.datetime;
    }

    if (isTime) {
      return TYPE.time;
    }

    return TYPE.date;
  }

  _getStrategyName(type: DateType): string {
    const pickerType = this._pickerType;

    if (pickerType === PICKER_TYPE.rollers) {
      return STRATEGY_NAME.dateView;
    } if (pickerType === PICKER_TYPE.native) {
      return STRATEGY_NAME.native;
    }

    if (type === TYPE.date) {
      return STRATEGY_NAME.calendar;
    }

    if (type === TYPE.datetime) {
      return STRATEGY_NAME.calendarWithTime;
    }

    return STRATEGY_NAME.list;
  }

  _initMarkup(): void {
    this.$element().addClass(DATEBOX_CLASS);

    super._initMarkup();

    this._refreshFormatClass();
    this._refreshPickerTypeClass();

    this._strategy.renderInputMinMax(this._input());
  }

  _render(): void {
    super._render();

    this._formatValidationIcon();
  }

  _renderDimensions(): void {
    super._renderDimensions();
    const { width } = this.option();
    this.$element().toggleClass(DX_AUTO_WIDTH_CLASS, !width);

    this._updatePopupWidth();
    this._updatePopupHeight();
  }

  _dimensionChanged(): void {
    super._dimensionChanged();

    this._updatePopupHeight();
  }

  _updatePopupHeight(): void {
    if (this._popup && this._strategy instanceof List) {
      this._strategy._updatePopupHeight();
    }
  }

  _updatePopupWidth(): void {
    if (this._strategy instanceof Calendar || this._strategy instanceof CalendarWithTime) {
      return;
    }

    super._updatePopupWidth();
  }

  _refreshFormatClass(): void {
    const $element = this.$element();
    const types = Object.values(TYPE);

    types.forEach((item) => {
      $element.removeClass(`${DATEBOX_CLASS}-${item}`);
    });

    const { type } = this.option();

    $element.addClass(`${DATEBOX_CLASS}-${type}`);
  }

  _refreshPickerTypeClass(): void {
    const $element = this.$element();
    const pickerTypes = Object.values(PICKER_TYPE);

    pickerTypes.forEach((item) => {
      $element.removeClass(`${DATEBOX_CLASS}-${item}`);
    });

    $element.addClass(`${DATEBOX_CLASS}-${this._pickerType}`);
  }

  _formatValidationIcon(): void {
    if (!hasWindow()) {
      return;
    }

    const inputElement = this._input().get(0) as HTMLElement;
    const { rtlEnabled } = this.option();
    const clearButtonWidth = this._getClearButtonWidth();
    const longestElementDimensions = this._getLongestElementDimensions();
    const curWidth = parseFloat(window.getComputedStyle(inputElement).width) - clearButtonWidth;
    const shouldHideValidationIcon = longestElementDimensions.width > curWidth;
    const { style } = inputElement;

    const { _showValidationIcon: showValidationIcon } = this.option();

    this.$element()
      .toggleClass(DX_INVALID_BADGE_CLASS, !shouldHideValidationIcon && showValidationIcon);

    if (shouldHideValidationIcon) {
      this._storedPadding ??= rtlEnabled
        ? longestElementDimensions.leftPadding
        : longestElementDimensions.rightPadding;
      if (rtlEnabled) {
        style.paddingLeft = '0';
      } else {
        style.paddingRight = '0';
      }
    } else if (rtlEnabled) {
      style.paddingLeft = `${this._storedPadding}px`;
    } else {
      style.paddingRight = `${this._storedPadding}px`;
    }
  }

  _getClearButtonWidth(): number {
    let clearButtonWidth = 0;
    const input = this._input().get(0) as HTMLInputElement;

    if (this._isClearButtonVisible() && input.value === '') {
      const clearButtonElement = this.$element().find(`.${DX_CLEAR_BUTTON_CLASS}`).get(0);
      clearButtonWidth = parseFloat(window.getComputedStyle(clearButtonElement).width);
    }

    return clearButtonWidth;
  }

  _getLongestElementDimensions(): {
    width: number;
    leftPadding: number;
    rightPadding: number;
  } {
    const { displayFormat } = this.option();
    const format = this._strategy.getDisplayFormat(displayFormat);
    const longestValue = dateLocalization.format(
      uiDateUtils.getLongestDate(
        format,
        dateLocalization.getMonthNames(),
        dateLocalization.getDayNames(),
      ),
      format,
    );
    const $input = this._input();
    const inputElement = $input.get(0);
    const $longestValueElement = createTextElementHiddenCopy($input, longestValue);
    const storedPadding = this._storedPadding ?? 0;

    $longestValueElement.appendTo(this.$element());
    const elementWidth = parseFloat(window.getComputedStyle($longestValueElement.get(0)).width);
    const rightPadding = parseFloat(window.getComputedStyle(inputElement).paddingRight);
    const leftPadding = parseFloat(window.getComputedStyle(inputElement).paddingLeft);
    const necessaryWidth = elementWidth + leftPadding + rightPadding + storedPadding;
    $longestValueElement.remove();

    return {
      width: necessaryWidth,
      leftPadding,
      rightPadding,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getKeyboardListeners(): any[] {
    return super._getKeyboardListeners().concat([this._strategy?.getKeyboardListener()]);
  }

  _renderPopup(): void {
    super._renderPopup();
    this._popup?.$wrapper()?.addClass(DATEBOX_WRAPPER_CLASS);
    this._renderPopupWrapper();
  }

  _getPopupToolbarItems(): ToolbarItem[] {
    const defaultItems = super._getPopupToolbarItems();

    return this._strategy._getPopupToolbarItems(defaultItems);
  }

  _popupConfig(): PopupProperties {
    const popupConfig = super._popupConfig();
    return {
      ...this._strategy.popupConfig(popupConfig),
      title: this._getPopupTitle(),
      dragEnabled: false,
    };
  }

  _renderPopupWrapper(): void {
    if (!this._popup) {
      return;
    }

    const $element = this.$element();
    const classPostfixes = [...Object.values(TYPE), ...Object.values(PICKER_TYPE)];

    classPostfixes.forEach((item) => {
      $element.removeClass(`${DATEBOX_WRAPPER_CLASS}-${item}`);
    });

    const { type } = this.option();

    this._popup.$wrapper()
      ?.addClass(`${DATEBOX_WRAPPER_CLASS}-${type}`)
      .addClass(`${DATEBOX_WRAPPER_CLASS}-${this._pickerType}`)
      .addClass(DROPDOWNEDITOR_OVERLAY_CLASS);
  }

  _renderPopupContent(): void {
    super._renderPopupContent();
    this._strategy.renderPopupContent();
  }

  _popupShowingHandler(): void {
    super._popupShowingHandler();
    this._strategy.popupShowingHandler();
  }

  _popupShownHandler(): void {
    super._popupShownHandler();
    this._strategy.renderOpenedState();
  }

  _popupHiddenHandler(): void {
    super._popupHiddenHandler();
    this._strategy.renderOpenedState();
    this._strategy.popupHiddenHandler();
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      this._formatValidationIcon();
    }
  }

  _clearValueHandler(e: ValueChangedEvent & DxEvent): void {
    this.option('text', '');
    super._clearValueHandler(e);
  }

  _readOnlyPropValue(): boolean {
    if (this._pickerType === PICKER_TYPE.rollers) {
      return true;
    }

    const { platform } = devices.real();
    const isCustomValueDisabled = this._isNativeType() && (platform === 'ios' || platform === 'android');

    if (isCustomValueDisabled) {
      const { readOnly = false } = this.option();

      return readOnly;
    }

    return super._readOnlyPropValue();
  }

  _isClearButtonVisible(): boolean {
    return super._isClearButtonVisible() && !this._isNativeType();
  }

  _toggleEmptinessEventHandler(): void {
    if (this._isNativeType()) {
      this._toggleEmptiness(false);

      return;
    }

    super._toggleEmptinessEventHandler();
  }

  _renderValue(): DeferredObj<unknown> {
    const value = this.getDateOption('value');

    this.option('text', this._getDisplayedText(value));
    this._strategy.renderValue();

    return super._renderValue();
  }

  _setSubmitValue(): void {
    const value = this.getDateOption('value');
    const { type = 'date', dateSerializationFormat } = this.option();
    const submitFormat = uiDateUtils.SUBMIT_FORMATS_MAP[type];
    const submitValue = dateSerializationFormat
      ? dateSerialization.serializeDate(value, dateSerializationFormat)
      : uiDateUtils.toStandardDateFormat(value, submitFormat);

    this._getSubmitElement().val(submitValue);
  }

  _getDisplayedText(value?: DateLike): string {
    const { mode = 'text', displayFormat: displayFormatOption } = this.option();

    if (mode === 'text') {
      const displayFormat = this._strategy.getDisplayFormat(displayFormatOption);
      return dateLocalization.format(value, displayFormat) as string;
    }
    const format = this._getFormatByMode(mode);

    if (format) {
      return dateLocalization.format(value, format) as string;
    }
    return uiDateUtils.toStandardDateFormat(value, mode);
  }

  _getFormatByMode(mode: string): string | null {
    return inputType(mode)
      ? null
      : uiDateUtils.FORMATS_MAP[mode] as string | null;
  }

  _valueChangeEventHandler(
    e: InteractionEvent,
  ): void {
    const { text, type = 'date', validationError } = this.option();
    const currentValue = this.getDateOption('value');

    if (text === this._getDisplayedText(currentValue)) {
      this._recallInternalValidation(currentValue, validationError);
      return;
    }

    const parsedDate = this._getParsedDate(text);
    const value = currentValue ?? this._getDateByDefault();
    const newValue = uiDateUtils.mergeDates(value, parsedDate, type);
    const date = parsedDate && type === 'time' ? newValue : parsedDate;

    if (this._applyInternalValidation(date).isValid) {
      const displayedText = this._getDisplayedText(newValue);

      if (value && value.getTime() === newValue?.getTime() && displayedText !== text) {
        this._renderValue();
      } else {
        this.dateValue(newValue, e);
      }
    }
  }

  _recallInternalValidation(
    value: Date | null,
    validationError: { editorSpecific?: boolean },
  ): void {
    if (!validationError || validationError.editorSpecific) {
      this._applyInternalValidation(value);
      this._applyCustomValidation(value);
    }
  }

  _getDateByDefault(): Date | undefined {
    if (this._strategy.useCurrentDateByDefault()) {
      return this._strategy.getDefaultDate();
    }

    return undefined;
  }

  _getParsedDate(text?: string): Date | undefined {
    const { displayFormat } = this.option();
    const strategyDisplayFormat = this._strategy.getDisplayFormat(displayFormat);
    const parsedText = this._strategy.getParsedText(text, strategyDisplayFormat as string);

    return parsedText ?? undefined;
  }

  _applyInternalValidation(value?: Date | null): { isValid: boolean; isDate: boolean } {
    const { text, type } = this.option();
    const hasText = !!text && value !== null;
    const isDate = !!value && isDateType(value) && !isNaN(value.getTime());
    const isDateInRange = isDate && dateUtils.dateInRange(
      value,
      this.getDateOption('min'),
      this.getDateOption('max'),
      type,
    );
    const isValid = (!hasText && !value) || isDateInRange;
    let validationMessage = '';

    const { invalidDateMessage = '', dateOutOfRangeMessage = '' } = this.option();

    if (!isDate) {
      validationMessage = invalidDateMessage;
    } else if (!isDateInRange) {
      validationMessage = dateOutOfRangeMessage;
    }

    this._updateInternalValidationState(isValid, validationMessage);

    return {
      isValid,
      isDate,
    };
  }

  _updateInternalValidationState(isValid: boolean, validationMessage: string): void {
    this.option({
      isValid,
      validationError: isValid ? null : {
        editorSpecific: true,
        message: validationMessage,
      },
    });
  }

  _applyCustomValidation(value: DateLike): void {
    this.validationRequest.fire({
      editor: this,
      value: this._serializeDate(value),
    });
  }

  _isValueChanged(newValue: Date | null): boolean {
    const oldValue = this.getDateOption('value');

    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    const oldTime = oldValue && oldValue.getTime();
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    const newTime = newValue && newValue.getTime();

    return oldTime !== newTime;
  }

  _isTextChanged(newValue: DateLike): boolean {
    const { text: oldText } = this.option();
    const newText = (newValue && this._getDisplayedText(newValue)) ?? '';

    return oldText !== newText;
  }

  _renderProps(): void {
    super._renderProps();
    this._input().attr('autocomplete', 'off');
  }

  _renderOpenedState(): void {
    if (!this._isNativeType()) {
      super._renderOpenedState();
    }

    if (this._strategy.isAdaptivityChanged()) {
      this._refreshStrategy();
    }
  }

  _getPopupTitle(): string {
    const { placeholder } = this.option();

    if (placeholder) {
      return placeholder;
    }

    const { type } = this.option();

    if (type === TYPE.time) {
      return messageLocalization.format('dxDateBox-simulatedDataPickerTitleTime');
    }

    if (type === TYPE.date || type === TYPE.datetime) {
      return messageLocalization.format('dxDateBox-simulatedDataPickerTitleDate');
    }

    return '';
  }

  _refreshStrategy(): void {
    this._strategy.dispose();
    this._initStrategy();
    this.option(this._strategy.getDefaultOptions());
    this._refresh();
  }

  _applyButtonHandler(e: { event: InteractionEvent }): void {
    const value = this._strategy.getValue();
    this.dateValue(value, e.event);

    super._applyButtonHandler();
  }

  _dispose(): void {
    super._dispose();
    this._strategy?.dispose();
  }

  _isNativeType(): boolean {
    return this._pickerType === PICKER_TYPE.native;
  }

  _updatePopupTitle(): void {
    this._popup?.option('title', this._getPopupTitle());
  }

  _optionChanged(args: OptionChanged<DateBoxBaseProperties>): void {
    switch (args.name) {
      case 'showClearButton':
      case 'buttons':
        super._optionChanged(args);
        this._formatValidationIcon();
        break;
      case 'pickerType':
        this._updatePickerOptions();
        this._refreshStrategy();
        this._refreshPickerTypeClass();
        this._invalidate();
        break;
      case 'type':
        this._updatePickerOptions();
        this._refreshStrategy();
        this._refreshFormatClass();
        this._renderPopupWrapper();
        this._formatValidationIcon();
        this._updateValue();
        break;
      case 'placeholder':
        super._optionChanged(args);
        this._updatePopupTitle();
        break;
      case 'min':
      case 'max': {
        const isValid = this.option('isValid');
        this._applyInternalValidation(this.getDateOption('value'));
        if (!isValid) {
          this._applyCustomValidation(this.getDateOption('value'));
        }
        this._invalidate();
        break;
      }
      case 'dateSerializationFormat':
      case 'interval':
      case 'disabledDates':
      case 'calendarOptions':
      case 'todayButtonText':
        this._invalidate();
        break;
      case 'displayFormat':
        this.option('text', this._getDisplayedText(this.getDateOption('value')));
        this._renderInputValue();
        break;
      case 'text':
        this._strategy.textChangedHandler();
        super._optionChanged(args);
        break;
      case 'isValid':
        super._optionChanged(args);
        this._formatValidationIcon();
        break;
      case 'showDropDownButton':
        this._formatValidationIcon();
        super._optionChanged(args);
        break;
      case 'readOnly':
        super._optionChanged(args);
        this._formatValidationIcon();
        break;
      case 'invalidDateMessage':
      case 'dateOutOfRangeMessage':
      case 'adaptivityEnabled':
      case 'showAnalogClock':
      case '_showValidationIcon':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _getSerializationFormat(): string | undefined {
    const { value, dateSerializationFormat } = this.option();

    if (dateSerializationFormat && config().forceIsoDateParsing) {
      return dateSerializationFormat;
    }

    if (isNumeric(value)) {
      return 'number';
    }

    if (!isString(value) || value === '') {
      return undefined;
    }

    return dateSerialization.getDateSerializationFormat(value) as string;
  }

  _updateValue(value?: Date | null): void {
    super._updateValue();
    this._applyInternalValidation(value ?? this.getDateOption('value'));
  }

  dateValue(
    value: Date | null,
    dxEvent?: InteractionEvent | Event,
  ): void {
    const isValueChanged = this._isValueChanged(value);

    if (isValueChanged && dxEvent) {
      this._saveValueChangeEvent(dxEvent);
    }

    if (!isValueChanged) {
      const { text } = this.option();

      if (this._isTextChanged(value)) {
        this._updateValue(value);
      } else if (text === '') {
        this._applyCustomValidation(value);
      }
    }

    this.setDateOption('value', value);
  }

  getDateOption(optionName: 'value' | 'min' | 'max'): Date | null {
    const { [optionName]: optionValue } = this.option();

    const deserializedDate: Date | null = dateSerialization.deserializeDate(optionValue);

    return deserializedDate;
  }

  setDateOption(optionName: 'value' | 'min' | 'max', value: DateLike | undefined): void {
    const serializedDate = this._serializeDate(value);

    this.option(optionName, serializedDate);
  }

  _serializeDate(date?: DateLike): Date | string | null {
    const serializationFormat = this._getSerializationFormat();

    const serializedDate: Date | string | null = dateSerialization.serializeDate(
      date,
      serializationFormat,
    );

    return serializedDate;
  }

  _clearValue(): void {
    const { value } = this.option();

    super._clearValue();
    if (value === null) {
      this._applyCustomValidation(null);
    }
  }

  clear(): void {
    const { value } = this.option();

    super.clear();
    if (value === null) {
      this._applyInternalValidation(null);
    }
  }
}

export default DateBox;
