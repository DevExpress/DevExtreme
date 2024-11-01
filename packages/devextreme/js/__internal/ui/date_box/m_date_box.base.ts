import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import config from '@js/core/config';
import devices from '@js/core/devices';
import browser from '@js/core/utils/browser';
import dateUtils from '@js/core/utils/date';
import dateSerialization from '@js/core/utils/date_serialization';
import { createTextElementHiddenCopy } from '@js/core/utils/dom';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { inputType } from '@js/core/utils/support';
import { isDate as isDateType, isNumeric, isString } from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import DropDownEditor from '@ts/ui/drop_down_editor/m_drop_down_editor';

import Calendar from './m_date_box.strategy.calendar';
import CalendarWithTime from './m_date_box.strategy.calendar_with_time';
import DateView from './m_date_box.strategy.date_view';
import List from './m_date_box.strategy.list';
import Native from './m_date_box.strategy.native';
import uiDateUtils from './m_date_utils';

const window = getWindow();

const DATEBOX_CLASS = 'dx-datebox';
const DX_AUTO_WIDTH_CLASS = 'dx-auto-width';
const DX_INVALID_BADGE_CLASS = 'dx-show-invalid-badge';
const DX_CLEAR_BUTTON_CLASS = 'dx-clear-button-area';
const DATEBOX_WRAPPER_CLASS = 'dx-datebox-wrapper';
const DROPDOWNEDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';

const PICKER_TYPE = {
  calendar: 'calendar',
  rollers: 'rollers',
  list: 'list',
  native: 'native',
};

const TYPE = {
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

const DateBox = DropDownEditor.inherit({

  _supportedKeys() {
    return extend(this.callBase(), this._strategy.supportedKeys());
  },

  _renderButtonContainers() {
    this.callBase.apply(this, arguments);
    this._strategy.customizeButtons();
  },

  _getDefaultOptions() {
    return extend(this.callBase(), {
      type: 'date',

      showAnalogClock: true,

      value: null,

      dateSerializationFormat: undefined,

      min: undefined,

      max: undefined,

      displayFormat: null,

      interval: 30,

      disabledDates: null,

      pickerType: PICKER_TYPE.calendar,

      invalidDateMessage: messageLocalization.format('dxDateBox-validation-datetime'),

      dateOutOfRangeMessage: messageLocalization.format('validation-range'),

      applyButtonText: messageLocalization.format('OK'),

      adaptivityEnabled: false,

      calendarOptions: {},

      useHiddenSubmitElement: true,

      _showValidationIcon: true,
    });
  },

  _defaultOptionsRules() {
    return this.callBase().concat([
      {
        device: { platform: 'ios' },
        options: {
          'dropDownOptions.showTitle': true,
        },
      },
      {
        device: { platform: 'android' },
        options: {
          buttonsLocation: 'bottom after',
        },
      },
      {
        device() {
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
  },

  _initOptions(options) {
    this._userOptions = extend({}, options);
    this.callBase(options);
    this._updatePickerOptions();
  },

  _updatePickerOptions() {
    let pickerType = this.option('pickerType');
    const type = this.option('type');

    if (pickerType === PICKER_TYPE.list && (type === TYPE.datetime || type === TYPE.date)) {
      pickerType = PICKER_TYPE.calendar;
    }

    if (type === TYPE.time && pickerType === PICKER_TYPE.calendar) {
      pickerType = PICKER_TYPE.list;
    }

    this._pickerType = pickerType;

    this._setShowDropDownButtonOption();
  },

  _setShowDropDownButtonOption() {
    const { platform } = devices.real();
    const isMozillaOnAndroid = platform === 'android' && browser.mozilla;
    const isNativePickerType = this._isNativeType();
    let showDropDownButton = platform !== 'generic' || !isNativePickerType;

    if (isNativePickerType && isMozillaOnAndroid) { // T1197922
      showDropDownButton = false;
    }

    this.option({ showDropDownButton });
  },

  _init() {
    this._initStrategy();
    this.option(extend({}, this._strategy.getDefaultOptions(), this._userOptions));
    delete this._userOptions;
    this.callBase();
  },

  _toLowerCaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.substr(1);
  },

  _initStrategy() {
    const strategyName = this._getStrategyName(this._getFormatType());
    const strategy = STRATEGY_CLASSES[strategyName];

    if (!(this._strategy && this._strategy.NAME === strategyName)) {
      // eslint-disable-next-line new-cap
      this._strategy = new strategy(this);
    }
  },

  _getFormatType() {
    const currentType = this.option('type');
    const isTime = /h|m|s/g.test(currentType);
    const isDate = /d|M|Y/g.test(currentType);
    let type = '';

    if (isDate) {
      type += TYPE.date;
    }

    if (isTime) {
      type += TYPE.time;
    }

    return type;
  },

  _getStrategyName(type) {
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
  },

  _initMarkup() {
    this.$element().addClass(DATEBOX_CLASS);

    this.callBase();

    this._refreshFormatClass();
    this._refreshPickerTypeClass();

    this._strategy.renderInputMinMax(this._input());
  },

  _render() {
    this.callBase();

    this._formatValidationIcon();
  },

  _renderDimensions() {
    this.callBase();
    this.$element().toggleClass(DX_AUTO_WIDTH_CLASS, !this.option('width'));

    this._updatePopupWidth();
    this._updatePopupHeight();
  },

  _dimensionChanged() {
    this.callBase();

    this._updatePopupHeight();
  },

  _updatePopupHeight() {
    if (this._popup) {
      this._strategy._updatePopupHeight?.();
    }
  },

  _refreshFormatClass() {
    const $element = this.$element();

    each(TYPE, (_, item) => {
      $element.removeClass(`${DATEBOX_CLASS}-${item}`);
    });

    $element.addClass(`${DATEBOX_CLASS}-${this.option('type')}`);
  },

  _refreshPickerTypeClass() {
    const $element = this.$element();

    each(PICKER_TYPE, (_, item) => {
      $element.removeClass(`${DATEBOX_CLASS}-${item}`);
    });

    $element.addClass(`${DATEBOX_CLASS}-${this._pickerType}`);
  },

  _formatValidationIcon() {
    if (!hasWindow()) {
      return;
    }

    const inputElement = this._input().get(0);
    const isRtlEnabled = this.option('rtlEnabled');
    const clearButtonWidth = this._getClearButtonWidth();
    const longestElementDimensions = this._getLongestElementDimensions();
    const curWidth = parseFloat(window.getComputedStyle(inputElement).width) - clearButtonWidth;
    const shouldHideValidationIcon = longestElementDimensions.width > curWidth;
    const { style } = inputElement;

    this.$element().toggleClass(DX_INVALID_BADGE_CLASS, !shouldHideValidationIcon && this.option('_showValidationIcon'));

    if (shouldHideValidationIcon) {
      if (this._storedPadding === undefined) {
        this._storedPadding = isRtlEnabled ? longestElementDimensions.leftPadding : longestElementDimensions.rightPadding;
      }
      isRtlEnabled ? style.paddingLeft = 0 : style.paddingRight = 0;
    } else {
      isRtlEnabled ? style.paddingLeft = `${this._storedPadding}px` : style.paddingRight = `${this._storedPadding}px`;
    }
  },

  _getClearButtonWidth() {
    let clearButtonWidth = 0;
    if (this._isClearButtonVisible() && this._input().val() === '') {
      const clearButtonElement = this.$element().find(`.${DX_CLEAR_BUTTON_CLASS}`).get(0);
      clearButtonWidth = parseFloat(window.getComputedStyle(clearButtonElement).width);
    }

    return clearButtonWidth;
  },

  _getLongestElementDimensions() {
    const format = this._strategy.getDisplayFormat(this.option('displayFormat'));
    const longestValue = dateLocalization.format(uiDateUtils.getLongestDate(format, dateLocalization.getMonthNames(), dateLocalization.getDayNames()), format);
    const $input = this._input();
    const inputElement = $input.get(0);
    const $longestValueElement = createTextElementHiddenCopy($input, longestValue);
    const isPaddingStored = this._storedPadding !== undefined;
    const storedPadding = !isPaddingStored ? 0 : this._storedPadding;

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
  },

  _getKeyboardListeners() {
    return this.callBase().concat([this._strategy && this._strategy.getKeyboardListener()]);
  },

  _renderPopup() {
    this.callBase();
    this._popup.$wrapper().addClass(DATEBOX_WRAPPER_CLASS);
    this._renderPopupWrapper();
  },

  _getPopupToolbarItems() {
    const defaultItems = this.callBase();

    return this._strategy._getPopupToolbarItems?.(defaultItems) ?? defaultItems;
  },

  _popupConfig() {
    const popupConfig = this.callBase();
    return extend(this._strategy.popupConfig(popupConfig), {
      title: this._getPopupTitle(),
      dragEnabled: false,
    });
  },

  _renderPopupWrapper() {
    if (!this._popup) {
      return;
    }

    const $element = this.$element();
    const classPostfixes = extend({}, TYPE, PICKER_TYPE);

    each(classPostfixes, (_, item) => {
      $element.removeClass(`${DATEBOX_WRAPPER_CLASS}-${item}`);
    });

    this._popup.$wrapper()
      .addClass(`${DATEBOX_WRAPPER_CLASS}-${this.option('type')}`)
      .addClass(`${DATEBOX_WRAPPER_CLASS}-${this._pickerType}`)
      .addClass(DROPDOWNEDITOR_OVERLAY_CLASS);
  },

  _renderPopupContent() {
    this.callBase();
    this._strategy.renderPopupContent();
  },

  _popupShowingHandler() {
    this.callBase();
    this._strategy.popupShowingHandler();
  },

  _popupShownHandler() {
    this.callBase();
    this._strategy.renderOpenedState();
  },

  _popupHiddenHandler() {
    this.callBase();
    this._strategy.renderOpenedState();
    this._strategy.popupHiddenHandler();
  },

  _visibilityChanged(visible) {
    if (visible) {
      this._formatValidationIcon();
    }
  },

  _clearValueHandler(e) {
    this.option('text', '');
    this.callBase(e);
  },

  _readOnlyPropValue() {
    if (this._pickerType === PICKER_TYPE.rollers) {
      return true;
    }

    const { platform } = devices.real();
    const isCustomValueDisabled = this._isNativeType() && (platform === 'ios' || platform === 'android');

    if (isCustomValueDisabled) {
      return this.option('readOnly');
    }

    return this.callBase();
  },

  _isClearButtonVisible() {
    return this.callBase() && !this._isNativeType();
  },

  _renderValue() {
    const value = this.dateOption('value');

    this.option('text', this._getDisplayedText(value));
    this._strategy.renderValue();

    return this.callBase();
  },

  _setSubmitValue() {
    const value = this.dateOption('value');
    const dateSerializationFormat = this.option('dateSerializationFormat');
    const submitFormat = uiDateUtils.SUBMIT_FORMATS_MAP[this.option('type')];
    const submitValue = dateSerializationFormat ? dateSerialization.serializeDate(value, dateSerializationFormat) : uiDateUtils.toStandardDateFormat(value, submitFormat);

    this._getSubmitElement().val(submitValue);
  },

  _getDisplayedText(value) {
    const mode = this.option('mode');
    let displayedText;

    if (mode === 'text') {
      const displayFormat = this._strategy.getDisplayFormat(this.option('displayFormat'));
      displayedText = dateLocalization.format(value, displayFormat);
    } else {
      const format = this._getFormatByMode(mode);

      if (format) {
        displayedText = dateLocalization.format(value, format);
      } else {
        displayedText = uiDateUtils.toStandardDateFormat(value, mode);
      }
    }

    return displayedText;
  },

  _getFormatByMode(mode) {
    return inputType(mode) ? null : uiDateUtils.FORMATS_MAP[mode];
  },

  _valueChangeEventHandler(e) {
    const { text, type, validationError } = this.option();
    const currentValue = this.dateOption('value');

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

      if (value && newValue && value.getTime() === newValue.getTime() && displayedText !== text) {
        this._renderValue();
      } else {
        this.dateValue(newValue, e);
      }
    }
  },

  _recallInternalValidation(value, validationError) {
    if (!validationError || validationError.editorSpecific) {
      this._applyInternalValidation(value);
      this._applyCustomValidation(value);
    }
  },

  _getDateByDefault() {
    return this._strategy.useCurrentDateByDefault() && this._strategy.getDefaultDate();
  },

  _getParsedDate(text) {
    const displayFormat = this._strategy.getDisplayFormat(this.option('displayFormat'));
    const parsedText = this._strategy.getParsedText(text, displayFormat);

    return parsedText ?? undefined;
  },

  _applyInternalValidation(value) {
    const text = this.option('text');
    const hasText = !!text && value !== null;
    const isDate = !!value && isDateType(value) && !isNaN(value.getTime());
    const isDateInRange = isDate && dateUtils.dateInRange(value, this.dateOption('min'), this.dateOption('max'), this.option('type'));
    const isValid = !hasText && !value || isDateInRange;
    let validationMessage = '';

    if (!isDate) {
      validationMessage = this.option('invalidDateMessage');
    } else if (!isDateInRange) {
      validationMessage = this.option('dateOutOfRangeMessage');
    }

    this._updateInternalValidationState(isValid, validationMessage);

    return {
      isValid,
      isDate,
    };
  },

  _updateInternalValidationState(isValid, validationMessage) {
    this.option({
      isValid,
      validationError: isValid ? null : {
        editorSpecific: true,
        message: validationMessage,
      },
    });
  },

  _applyCustomValidation(value) {
    this.validationRequest.fire({
      editor: this,
      value: this._serializeDate(value),
    });
  },

  _isValueChanged(newValue) {
    const oldValue = this.dateOption('value');
    const oldTime = oldValue && oldValue.getTime();
    const newTime = newValue && newValue.getTime();

    return oldTime !== newTime;
  },

  _isTextChanged(newValue) {
    const oldText = this.option('text');
    const newText = newValue && this._getDisplayedText(newValue) || '';

    return oldText !== newText;
  },

  _renderProps() {
    this.callBase();
    this._input().attr('autocomplete', 'off');
  },

  _renderOpenedState() {
    if (!this._isNativeType()) {
      this.callBase();
    }

    if (this._strategy.isAdaptivityChanged()) {
      this._refreshStrategy();
    }
  },

  _getPopupTitle() {
    const placeholder = this.option('placeholder');

    if (placeholder) {
      return placeholder;
    }

    const type = this.option('type');

    if (type === TYPE.time) {
      return messageLocalization.format('dxDateBox-simulatedDataPickerTitleTime');
    }

    if (type === TYPE.date || type === TYPE.datetime) {
      return messageLocalization.format('dxDateBox-simulatedDataPickerTitleDate');
    }

    return '';
  },

  _refreshStrategy() {
    this._strategy.dispose();
    this._initStrategy();
    this.option(this._strategy.getDefaultOptions());
    this._refresh();
  },

  _applyButtonHandler(e) {
    const value = this._strategy.getValue();
    this.dateValue(value, e.event);

    this.callBase();
  },

  _dispose() {
    this.callBase();
    this._strategy?.dispose();
  },

  _isNativeType() {
    return this._pickerType === PICKER_TYPE.native;
  },

  _updatePopupTitle() {
    this._popup?.option('title', this._getPopupTitle());
  },

  _optionChanged(args) {
    switch (args.name) {
      case 'showClearButton':
      case 'buttons':
        this.callBase.apply(this, arguments);
        this._formatValidationIcon();
        break;
      case 'pickerType':
        this._updatePickerOptions({ pickerType: args.value });
        this._refreshStrategy();
        this._refreshPickerTypeClass();
        this._invalidate();
        break;
      case 'type':
        this._updatePickerOptions({ format: args.value });
        this._refreshStrategy();
        this._refreshFormatClass();
        this._renderPopupWrapper();
        this._formatValidationIcon();
        this._updateValue();
        break;
      case 'placeholder':
        this.callBase.apply(this, arguments);
        this._updatePopupTitle();
        break;
      case 'min':
      case 'max': {
        const isValid = this.option('isValid');
        this._applyInternalValidation(this.dateOption('value'));
        if (!isValid) {
          this._applyCustomValidation(this.dateOption('value'));
        }
        this._invalidate();
        break;
      }
      case 'dateSerializationFormat':
      case 'interval':
      case 'disabledDates':
      case 'calendarOptions':
        this._invalidate();
        break;
      case 'displayFormat':
        this.option('text', this._getDisplayedText(this.dateOption('value')));
        this._renderInputValue();
        break;
      case 'text':
        this._strategy.textChangedHandler(args.value);
        this.callBase.apply(this, arguments);
        break;
      case 'isValid':
        this.callBase.apply(this, arguments);
        this._formatValidationIcon();
        break;
      case 'showDropDownButton':
        this._formatValidationIcon();
        this.callBase.apply(this, arguments);
        break;
      case 'readOnly':
        this.callBase.apply(this, arguments);
        this._formatValidationIcon();
        break;
      case 'todayButtonText':
        this._setPopupOption('toolbarItems', this._getPopupToolbarItems());
        break;
      case 'invalidDateMessage':
      case 'dateOutOfRangeMessage':
      case 'adaptivityEnabled':
      case 'showAnalogClock':
      case '_showValidationIcon':
        break;
      default:
        this.callBase.apply(this, arguments);
    }
  },

  _getSerializationFormat() {
    const value = this.option('value');

    if (this.option('dateSerializationFormat') && config().forceIsoDateParsing) {
      return this.option('dateSerializationFormat');
    }

    if (isNumeric(value)) {
      return 'number';
    }

    if (!isString(value)) {
      return;
    }

    return dateSerialization.getDateSerializationFormat(value);
  },

  _updateValue(value) {
    this.callBase();
    this._applyInternalValidation(value ?? this.dateOption('value'));
  },

  dateValue(value, dxEvent) {
    const isValueChanged = this._isValueChanged(value);

    if (isValueChanged && dxEvent) {
      this._saveValueChangeEvent(dxEvent);
    }

    if (!isValueChanged) {
      if (this._isTextChanged(value)) {
        this._updateValue(value);
      } else if (this.option('text') === '') {
        this._applyCustomValidation(value);
      }
    }

    return this.dateOption('value', value);
  },

  dateOption(optionName, value) {
    if (arguments.length === 1) {
      return dateSerialization.deserializeDate(this.option(optionName));
    }

    this.option(optionName, this._serializeDate(value));
  },

  _serializeDate(date) {
    const serializationFormat = this._getSerializationFormat();
    return dateSerialization.serializeDate(date, serializationFormat);
  },

  _clearValue() {
    const value = this.option('value');

    this.callBase();
    if (value === null) {
      this._applyCustomValidation(null);
    }
  },

  clear() {
    const value = this.option('value');

    this.callBase();
    if (value === null) {
      this._applyInternalValidation(null);
    }
  },
});

export default DateBox;
