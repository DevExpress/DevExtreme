"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _config = _interopRequireDefault(require("../../../core/config"));
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _function_template = require("../../../core/templates/function_template");
var _extend = require("../../../core/utils/extend");
var _icon = require("../../../core/utils/icon");
var _inflector = require("../../../core/utils/inflector");
var _iterator = require("../../../core/utils/iterator");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _index = require("../../../events/utils/index");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _editor = _interopRequireDefault(require("../../../ui/editor/editor"));
var _themes = require("../../../ui/themes");
var _m_drop_down_button = _interopRequireDefault(require("../../ui/drop_down_editor/m_drop_down_button"));
var _m_text_editor = _interopRequireDefault(require("../../ui/text_box/m_text_editor.clear"));
var _m_index = _interopRequireDefault(require("../../ui/text_box/texteditor_button_collection/m_index"));
var _m_date_range = require("./m_date_range.utils");
var _m_multiselect_date_box = _interopRequireDefault(require("./m_multiselect_date_box"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const DATERANGEBOX_CLASS = 'dx-daterangebox';
const TEXTEDITOR_LABEL_STATIC_CLASS = 'dx-texteditor-with-label';
const TEXTEDITOR_LABEL_OUTSIDE_CLASS = 'dx-texteditor-label-outside';
const TEXTEDITOR_LABEL_FLOATING_CLASS = 'dx-texteditor-with-floating-label';
const START_DATEBOX_CLASS = 'dx-start-datebox';
const END_DATEBOX_CLASS = 'dx-end-datebox';
const DATERANGEBOX_SEPARATOR_CLASS = 'dx-daterangebox-separator';
const DROP_DOWN_EDITOR_BUTTON_ICON = 'dx-dropdowneditor-icon';
const INVALID_BADGE_CLASS = 'dx-show-invalid-badge';
const READONLY_STATE_CLASS = 'dx-state-readonly';
const TEXTEDITOR_CLASS = 'dx-texteditor';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const TEXTEDITOR_EMPTY_INPUT_CLASS = 'dx-texteditor-empty';
const DROP_DOWN_EDITOR_CLASS = 'dx-dropdowneditor';
const DROP_DOWN_EDITOR_ACTIVE_CLASS = 'dx-dropdowneditor-active';
const SEPARATOR_ICON_NAME = 'to';
const EVENTS_LIST = ['KeyDown', 'KeyUp', 'Change', 'Cut', 'Copy', 'Paste', 'Input', 'EnterKey'];
class DateRangeBox extends _editor.default {
  _getDefaultOptions() {
    // @ts-expect-error
    return (0, _extend.extend)(super._getDefaultOptions(), {
      acceptCustomValue: true,
      activeStateEnabled: true,
      applyButtonText: _message.default.format('OK'),
      applyValueMode: 'instantly',
      buttons: undefined,
      calendarOptions: {},
      cancelButtonText: _message.default.format('Cancel'),
      endDateOutOfRangeMessage: _message.default.format('dxDateRangeBox-endDateOutOfRangeMessage'),
      dateSerializationFormat: undefined,
      deferRendering: true,
      disableOutOfRangeSelection: false,
      disabledDates: null,
      displayFormat: null,
      dropDownButtonTemplate: 'dropDownButton',
      dropDownOptions: {},
      endDate: null,
      endDateInputAttr: {},
      endDateLabel: _message.default.format('dxDateRangeBox-endDateLabel'),
      endDateName: '',
      endDatePlaceholder: '',
      endDateText: undefined,
      focusStateEnabled: true,
      hoverStateEnabled: true,
      invalidStartDateMessage: _message.default.format('dxDateRangeBox-invalidStartDateMessage'),
      invalidEndDateMessage: _message.default.format('dxDateRangeBox-invalidEndDateMessage'),
      isValid: true,
      labelMode: 'static',
      max: undefined,
      min: undefined,
      multiView: true,
      onChange: null,
      onClosed: null,
      onCopy: null,
      onCut: null,
      onEnterKey: null,
      onInput: null,
      onKeyDown: null,
      onKeyUp: null,
      onOpened: null,
      onPaste: null,
      onValueChanged: null,
      openOnFieldClick: true,
      opened: false,
      pickerType: 'calendar',
      readOnly: false,
      showClearButton: false,
      showDropDownButton: true,
      spellcheck: false,
      startDate: null,
      startDateInputAttr: {},
      startDateLabel: _message.default.format('dxDateRangeBox-startDateLabel'),
      startDateName: '',
      startDateOutOfRangeMessage: _message.default.format('dxDateRangeBox-startDateOutOfRangeMessage'),
      startDatePlaceholder: '',
      startDateText: undefined,
      stylingMode: (0, _config.default)().editorStylingMode ?? 'outlined',
      todayButtonText: _message.default.format('dxCalendar-todayButtonText'),
      useHiddenSubmitElement: false,
      useMaskBehavior: false,
      validationError: null,
      validationErrors: null,
      validationMessageMode: 'auto',
      validationMessagePosition: 'auto',
      validationStatus: 'valid',
      value: [null, null],
      valueChangeEvent: 'change',
      _internalValidationErrors: [],
      _currentSelection: 'startDate'
    });
  }
  _defaultOptionsRules() {
    // @ts-expect-error
    return super._defaultOptionsRules().concat([{
      device() {
        const themeName = (0, _themes.current)();
        return (0, _themes.isMaterial)(themeName);
      },
      options: {
        labelMode: 'floating',
        stylingMode: (0, _config.default)().editorStylingMode ?? 'filled'
      }
    }, {
      device() {
        const themeName = (0, _themes.current)();
        return (0, _themes.isFluent)(themeName);
      },
      options: {
        labelMode: 'outside'
      }
    }, {
      device() {
        const realDevice = _devices.default.real();
        const {
          platform
        } = realDevice;
        return platform === 'ios' || platform === 'android';
      },
      options: {
        multiView: false
      }
    }]);
  }
  _initOptions(options) {
    // @ts-expect-error
    super._initOptions(options);
    // @ts-expect-error
    const {
      value: initialValue
    } = this.initialOption();
    let {
      value,
      startDate,
      endDate
    } = this.option();
    if (value[0] && value[1] && (0, _m_date_range.getDeserializedDate)(value[0]) > (0, _m_date_range.getDeserializedDate)(value[1])) {
      value = [value[1], value[0]];
    }
    if (startDate && endDate && (0, _m_date_range.getDeserializedDate)(startDate) > (0, _m_date_range.getDeserializedDate)(endDate)) {
      [startDate, endDate] = [endDate, startDate];
    }
    if ((0, _m_date_range.isSameDateArrays)(initialValue, value)) {
      value = [startDate, endDate];
    } else {
      [startDate, endDate] = value;
    }
    this.option({
      startDate,
      endDate,
      value
    });
  }
  _createOpenAction() {
    // @ts-expect-error
    this._openAction = this._createActionByOption('onOpened', {
      excludeValidators: ['disabled', 'readOnly']
    });
  }
  _raiseOpenAction() {
    if (!this._openAction) {
      this._createOpenAction();
    }
    this._openAction();
  }
  _createCloseAction() {
    // @ts-expect-error
    this._closeAction = this._createActionByOption('onClosed', {
      excludeValidators: ['disabled', 'readOnly']
    });
  }
  _raiseCloseAction() {
    if (!this._closeAction) {
      this._createCloseAction();
    }
    this._closeAction();
  }
  _createEventAction(eventName) {
    // @ts-expect-error
    this[`_${(0, _inflector.camelize)(eventName)}Action`] = this._createActionByOption(`on${eventName}`, {
      excludeValidators: ['readOnly']
    });
  }
  _raiseAction(eventName, event) {
    const action = this[`_${(0, _inflector.camelize)(eventName)}Action`];
    if (!action) {
      this._createEventAction(eventName);
    }
    this[`_${(0, _inflector.camelize)(eventName)}Action`]({
      event
    });
  }
  _initTemplates() {
    this._templateManager.addDefaultTemplates({
      // @ts-expect-error
      dropDownButton: new _function_template.FunctionTemplate(options => {
        const $icon = (0, _renderer.default)('<div>').addClass(DROP_DOWN_EDITOR_BUTTON_ICON);
        (0, _renderer.default)(options.container).append($icon);
      })
    });
    // @ts-expect-error
    super._initTemplates();
  }
  _getDefaultButtons() {
    return [{
      name: 'clear',
      Ctor: _m_text_editor.default
    }, {
      name: 'dropDown',
      Ctor: _m_drop_down_button.default
    }];
  }
  _initMarkup() {
    (0, _renderer.default)(this.element()).addClass(DATERANGEBOX_CLASS).addClass(TEXTEDITOR_CLASS).addClass(DROP_DOWN_EDITOR_CLASS);
    this._toggleDropDownEditorActiveClass();
    this._toggleEditorLabelClass();
    this._toggleReadOnlyState();
    // @ts-expect-error
    this._renderStylingMode();
    this._renderEndDateBox();
    this._renderSeparator();
    this._renderStartDateBox();
    this._toggleEmptinessState();
    this._renderEmptinessEvent();
    this._renderButtonsContainer();
    // @ts-expect-error
    super._initMarkup();
    (0, _renderer.default)(this.element()).removeClass(INVALID_BADGE_CLASS);
  }
  _renderEmptinessEvent() {
    // @ts-expect-error
    const eventName = (0, _index.addNamespace)('input blur', this.NAME);
    _events_engine.default.off(this._focusTarget(), eventName);
    _events_engine.default.on(this._focusTarget(), eventName, this._toggleEmptinessState.bind(this));
  }
  _toggleEmptinessState() {
    const isEmpty = (0, _renderer.default)(this.getStartDateBox().element()).hasClass(TEXTEDITOR_EMPTY_INPUT_CLASS) && (0, _renderer.default)(this.getEndDateBox().element()).hasClass(TEXTEDITOR_EMPTY_INPUT_CLASS);
    (0, _renderer.default)(this.element()).toggleClass(TEXTEDITOR_EMPTY_INPUT_CLASS, isEmpty);
  }
  _attachKeyboardEvents() {
    if (!this.option('readOnly')) {
      // @ts-expect-error
      super._attachKeyboardEvents();
    }
  }
  _toggleReadOnlyState() {
    const {
      readOnly
    } = this.option();
    (0, _renderer.default)(this.element()).toggleClass(READONLY_STATE_CLASS, !!readOnly);
  }
  _toggleDropDownEditorActiveClass() {
    const {
      opened
    } = this.option();
    (0, _renderer.default)(this.element()).toggleClass(DROP_DOWN_EDITOR_ACTIVE_CLASS, opened);
  }
  _toggleEditorLabelClass() {
    const {
      startDateLabel,
      endDateLabel,
      labelMode
    } = this.option();
    const isLabelVisible = (!!startDateLabel || !!endDateLabel) && labelMode !== 'hidden';
    (0, _renderer.default)(this.element()).removeClass(TEXTEDITOR_LABEL_FLOATING_CLASS).removeClass(TEXTEDITOR_LABEL_OUTSIDE_CLASS).removeClass(TEXTEDITOR_LABEL_STATIC_CLASS);
    if (isLabelVisible) {
      (0, _renderer.default)(this.element()).addClass(labelMode === 'floating' ? TEXTEDITOR_LABEL_FLOATING_CLASS : TEXTEDITOR_LABEL_STATIC_CLASS);
      if (labelMode === 'outside') {
        (0, _renderer.default)(this.element()).addClass(TEXTEDITOR_LABEL_OUTSIDE_CLASS);
      }
    }
  }
  _renderStartDateBox() {
    this._$startDateBox = (0, _renderer.default)('<div>').addClass(START_DATEBOX_CLASS).prependTo(this.$element());
    // @ts-expect-error
    this._startDateBox = this._createComponent(this._$startDateBox, _m_multiselect_date_box.default, this._getStartDateBoxConfig());
    this._startDateBox.NAME = '_StartDateBox';
  }
  _renderEndDateBox() {
    this._$endDateBox = (0, _renderer.default)('<div>').addClass(END_DATEBOX_CLASS).appendTo(this.$element());
    // @ts-expect-error
    this._endDateBox = this._createComponent(this._$endDateBox, _m_multiselect_date_box.default, this._getEndDateBoxConfig());
    this._endDateBox.NAME = '_EndDateBox';
  }
  _renderSeparator() {
    const $icon = (0, _icon.getImageContainer)(SEPARATOR_ICON_NAME);
    this._$separator = (0, _renderer.default)('<div>').addClass(DATERANGEBOX_SEPARATOR_CLASS).prependTo(this.$element());
    this._renderPreventBlurOnSeparatorClick();
    $icon === null || $icon === void 0 || $icon.appendTo(this._$separator);
  }
  _renderPreventBlurOnSeparatorClick() {
    // @ts-expect-error
    const eventName = (0, _index.addNamespace)('mousedown', this.NAME);
    _events_engine.default.off(this._$separator, eventName);
    _events_engine.default.on(this._$separator, eventName, e => {
      if (!this._hasActiveElement()) {
        this.focus();
      }
      e.preventDefault();
    });
  }
  _renderButtonsContainer() {
    this._buttonCollection = new _m_index.default(this, this._getDefaultButtons());
    this._$beforeButtonsContainer = undefined;
    this._$afterButtonsContainer = undefined;
    const {
      buttons
    } = this.option();
    this._$beforeButtonsContainer = this._buttonCollection.renderBeforeButtons(buttons, this.$element());
    this._$afterButtonsContainer = this._buttonCollection.renderAfterButtons(buttons, this.$element());
  }
  _updateButtons(names) {
    this._buttonCollection.updateButtons(names);
  }
  _openHandler() {
    this._toggleOpenState();
  }
  _shouldCallOpenHandler() {
    return true;
  }
  _toggleOpenState() {
    const {
      opened
    } = this.option();
    if (!opened) {
      // @ts-expect-error
      this.getStartDateBox()._focusInput();
    }
    if (!this.option('readOnly')) {
      this.option('opened', !this.option('opened'));
    }
  }
  _clearValueHandler(e) {
    e.stopPropagation();
    // @ts-expect-error
    this._saveValueChangeEvent(e);
    this.clear();
    !this._isStartDateActiveElement() && this.focus();
    // @ts-expect-error
    _events_engine.default.trigger((0, _renderer.default)(this.startDateField()), 'input');
  }
  _isClearButtonVisible() {
    return this.option('showClearButton') && !this.option('readOnly');
  }
  _focusInHandler(event) {
    if (this._shouldSkipFocusEvent(event)) {
      return;
    }
    // @ts-expect-error
    super._focusInHandler(event);
  }
  _focusOutHandler(event) {
    if (this._shouldSkipFocusEvent(event)) {
      return;
    }
    // @ts-expect-error
    super._focusOutHandler(event);
  }
  _shouldSkipFocusEvent(event) {
    const {
      target,
      relatedTarget
    } = event;
    return (0, _renderer.default)(target).is((0, _renderer.default)(this.startDateField())) && (0, _renderer.default)(relatedTarget).is((0, _renderer.default)(this.endDateField())) || (0, _renderer.default)(target).is((0, _renderer.default)(this.endDateField())) && (0, _renderer.default)(relatedTarget).is((0, _renderer.default)(this.startDateField()));
  }
  _getPickerType() {
    // @ts-expect-error
    const {
      pickerType
    } = this.option();
    return ['calendar', 'native'].includes(pickerType) ? pickerType : 'calendar';
  }
  _getRestErrors(allErrors, partialErrors) {
    return allErrors.filter(error => !partialErrors.some(prevError => error.message === prevError.message));
  }
  _syncValidationErrors(optionName, newPartialErrors, previousPartialErrors) {
    newPartialErrors || (newPartialErrors = []);
    previousPartialErrors || (previousPartialErrors = []);
    const allErrors = this.option(optionName) || [];
    const otherErrors = this._getRestErrors(allErrors, previousPartialErrors);
    this.option(optionName, [...otherErrors, ...newPartialErrors]);
  }
  _getDateBoxConfig() {
    const options = this.option();
    const dateBoxConfig = {
      acceptCustomValue: options.acceptCustomValue,
      activeStateEnabled: options.activeStateEnabled,
      applyValueMode: options.applyValueMode,
      dateSerializationFormat: options.dateSerializationFormat,
      deferRendering: options.deferRendering,
      disabled: options.disabled,
      displayFormat: options.displayFormat,
      focusStateEnabled: options.focusStateEnabled,
      isValid: options.isValid,
      tabIndex: options.tabIndex,
      height: options.height,
      hoverStateEnabled: options.hoverStateEnabled,
      labelMode: options.labelMode,
      max: options.max,
      min: options.min,
      openOnFieldClick: options.openOnFieldClick,
      pickerType: this._getPickerType(),
      readOnly: options.readOnly,
      rtlEnabled: options.rtlEnabled,
      spellcheck: options.spellcheck,
      stylingMode: options.stylingMode,
      type: 'date',
      useMaskBehavior: options.useMaskBehavior,
      validationMessageMode: options.validationMessageMode,
      validationMessagePosition: options.validationMessagePosition,
      valueChangeEvent: options.valueChangeEvent,
      // @ts-expect-error
      onKeyDown: options.onKeyDown,
      // @ts-expect-error
      onKeyUp: options.onKeyUp,
      // @ts-expect-error
      onChange: options.onChange,
      // @ts-expect-error
      onInput: options.onInput,
      // @ts-expect-error
      onCut: options.onCut,
      // @ts-expect-error
      onCopy: options.onCopy,
      // @ts-expect-error
      onPaste: options.onPaste,
      // @ts-expect-error
      onEnterKey: options.onEnterKey,
      _dateRangeBoxInstance: this,
      _showValidationMessage: false
    };
    (0, _iterator.each)(EVENTS_LIST, (_, eventName) => {
      const optionName = `on${eventName}`;
      // @ts-expect-error
      if (this.hasActionSubscription(optionName)) {
        dateBoxConfig[optionName] = e => {
          this._raiseAction(eventName, e.event);
        };
      }
    });
    return dateBoxConfig;
  }
  _hideOnOutsideClickHandler(_ref) {
    let {
      target
    } = _ref;
    // TODO: extract this common code part with ddeditor to avoid duplication
    const $target = (0, _renderer.default)(target);
    const dropDownButton = this.getButton('dropDown');
    const $dropDownButton = dropDownButton === null || dropDownButton === void 0 ? void 0 : dropDownButton.$element();
    const isInputClicked = !!$target.closest((0, _renderer.default)(this.element())).length;
    const isDropDownButtonClicked = !!$target.closest($dropDownButton).length;
    const isOutsideClick = !isInputClicked && !isDropDownButtonClicked;
    return isOutsideClick;
  }
  _getStartDateBoxConfig() {
    var _options$dropDownOpti;
    const options = this.option();
    return _extends({}, this._getDateBoxConfig(), {
      applyButtonText: options.applyButtonText,
      calendarOptions: options.calendarOptions,
      cancelButtonText: options.cancelButtonText,
      dateOutOfRangeMessage: options.startDateOutOfRangeMessage,
      deferRendering: options.deferRendering,
      // @ts-expect-error
      disabledDates: (_options$dropDownOpti = options.dropDownOptions) === null || _options$dropDownOpti === void 0 ? void 0 : _options$dropDownOpti.disabledDates,
      dropDownOptions: _extends({
        showTitle: false,
        title: '',
        hideOnOutsideClick: e => this._hideOnOutsideClickHandler(e),
        hideOnParentScroll: false,
        // @ts-expect-error
        preventScrollEvents: false
      }, options.dropDownOptions),
      invalidDateMessage: options.invalidStartDateMessage,
      onValueChanged: _ref2 => {
        let {
          value,
          event
        } = _ref2;
        const newValue = [value, this.option('value')[1]];
        this.updateValue(newValue, event);
      },
      opened: options.opened,
      onOpened: () => {
        this._raiseOpenAction();
      },
      onClosed: () => {
        this._raiseCloseAction();
      },
      onOptionChanged: args => {
        const {
          name,
          value,
          previousValue
        } = args;
        if (name === 'text') {
          this.option('startDateText', value);
        }
        if (name === 'validationErrors') {
          this._syncValidationErrors('_internalValidationErrors', value, previousValue);
        }
      },
      todayButtonText: options.todayButtonText,
      showClearButton: false,
      showDropDownButton: false,
      value: this.option('value')[0],
      label: options.startDateLabel,
      placeholder: options.startDatePlaceholder,
      inputAttr: options.startDateInputAttr,
      name: options.startDateName,
      _showValidationIcon: false
    });
  }
  _getEndDateBoxConfig() {
    const options = this.option();
    return _extends({}, this._getDateBoxConfig(), {
      invalidDateMessage: options.invalidEndDateMessage,
      dateOutOfRangeMessage: options.endDateOutOfRangeMessage,
      onValueChanged: _ref3 => {
        let {
          value,
          event
        } = _ref3;
        const newValue = [this.option('value')[0], value];
        this.updateValue(newValue, event);
      },
      onOptionChanged: args => {
        const {
          name,
          value,
          previousValue
        } = args;
        if (name === 'text') {
          this.option('endDateText', value);
        }
        if (name === 'validationErrors') {
          this._syncValidationErrors('_internalValidationErrors', value, previousValue);
        }
      },
      opened: options.opened,
      showClearButton: false,
      showDropDownButton: false,
      value: this.option('value')[1],
      label: options.endDateLabel,
      placeholder: options.endDatePlaceholder,
      deferRendering: true,
      inputAttr: options.endDateInputAttr,
      name: options.endDateName
    });
  }
  _getValidationMessagePosition() {
    const {
      validationMessagePosition
    } = this.option();
    if (validationMessagePosition === 'auto') {
      return this.option('opened') ? 'top' : 'bottom';
    }
    return validationMessagePosition;
  }
  _getSerializedDates(_ref4) {
    let [startDate, endDate] = _ref4;
    return [
    // @ts-expect-error
    this.getStartDateBox()._serializeDate((0, _m_date_range.getDeserializedDate)(startDate)),
    // @ts-expect-error
    this.getStartDateBox()._serializeDate((0, _m_date_range.getDeserializedDate)(endDate))];
  }
  updateValue(newValue, event) {
    if (!(0, _m_date_range.isSameDateArrays)(newValue, this.option('value'))) {
      if (event) {
        // @ts-expect-error
        this._saveValueChangeEvent(event);
      }
      this.option('value', this._getSerializedDates(newValue));
    }
  }
  _updateDateBoxesValue(newValue) {
    const startDateBox = this.getStartDateBox();
    const endDateBox = this.getEndDateBox();
    const [newStartDate, newEndDate] = newValue;
    const oldStartDate = startDateBox.option('value');
    const oldEndDate = endDateBox.option('value');
    if (!(0, _m_date_range.isSameDates)(newStartDate, oldStartDate)) {
      startDateBox.option('value', newStartDate);
    }
    if (!(0, _m_date_range.isSameDates)(newEndDate, oldEndDate)) {
      endDateBox.option('value', newEndDate);
    }
  }
  _renderAccessKey() {
    const $startDateInput = (0, _renderer.default)(this.field()[0]);
    const {
      accessKey
    } = this.option();
    // @ts-expect-error
    $startDateInput.attr('accesskey', accessKey);
  }
  _focusTarget() {
    return (0, _renderer.default)(this.element()).find(`.${TEXTEDITOR_INPUT_CLASS}`);
  }
  _focusEventTarget() {
    return this.element();
  }
  _focusClassTarget() {
    return this.$element();
  }
  _toggleFocusClass(isFocused, $element) {
    // @ts-expect-error
    super._toggleFocusClass(isFocused, this._focusClassTarget($element));
  }
  _hasActiveElement() {
    return this._isStartDateActiveElement() || this._isEndDateActiveElement();
  }
  _isStartDateActiveElement() {
    return this._isActiveElement(this.startDateField());
  }
  _isEndDateActiveElement() {
    return this._isActiveElement(this.endDateField());
  }
  _isActiveElement(input) {
    return (0, _renderer.default)(input).is((0, _renderer.default)(_dom_adapter.default.getActiveElement(input)));
  }
  _popupContentIdentifier(identifier) {
    if (identifier) {
      this._popupContentId = identifier;
    }
    return this._popupContentId;
  }
  _setAriaAttributes() {
    const {
      opened
    } = this.option();
    const arias = {
      expanded: opened,
      controls: this._popupContentIdentifier()
    };
    const ariaOwns = opened ? this._popupContentIdentifier() : undefined;
    // @ts-expect-error
    this.setAria(arias);
    // @ts-expect-error
    this.setAria('owns', ariaOwns, this.$element());
  }
  _cleanButtonContainers() {
    var _this$_$beforeButtons, _this$_$afterButtonsC;
    (_this$_$beforeButtons = this._$beforeButtonsContainer) === null || _this$_$beforeButtons === void 0 || _this$_$beforeButtons.remove();
    (_this$_$afterButtonsC = this._$afterButtonsContainer) === null || _this$_$afterButtonsC === void 0 || _this$_$afterButtonsC.remove();
    this._buttonCollection.clean();
    this._$beforeButtonsContainer = undefined;
    this._$afterButtonsContainer = undefined;
  }
  _applyCustomValidation(value) {
    // @ts-expect-error
    this.validationRequest.fire({
      editor: this,
      value
    });
  }
  _clean() {
    var _this$_$startDateBox, _this$_$endDateBox, _this$_$separator;
    this._cleanButtonContainers();
    (_this$_$startDateBox = this._$startDateBox) === null || _this$_$startDateBox === void 0 || _this$_$startDateBox.remove();
    (_this$_$endDateBox = this._$endDateBox) === null || _this$_$endDateBox === void 0 || _this$_$endDateBox.remove();
    (_this$_$separator = this._$separator) === null || _this$_$separator === void 0 || _this$_$separator.remove();
    // @ts-expect-error
    super._clean();
  }
  _optionChanged(args) {
    const {
      name,
      fullName,
      value,
      previousValue
    } = args;
    switch (name) {
      case 'acceptCustomValue':
      case 'dateSerializationFormat':
      case 'displayFormat':
      case 'max':
      case 'min':
      case 'openOnFieldClick':
      case 'spellcheck':
      case 'useMaskBehavior':
      case 'valueChangeEvent':
        this.getStartDateBox().option(name, value);
        this.getEndDateBox().option(name, value);
        break;
      case 'rtlEnabled':
        // @ts-expect-error
        super._optionChanged(args);
        break;
      case 'labelMode':
        this._toggleEditorLabelClass();
        this.getStartDateBox().option(name, value);
        this.getEndDateBox().option(name, value);
        break;
      case 'applyButtonText':
      case 'applyValueMode':
      case 'cancelButtonText':
      case 'deferRendering':
      case 'disabledDates':
      case 'todayButtonText':
        this.getStartDateBox().option(name, value);
        break;
      case 'opened':
        this._toggleDropDownEditorActiveClass();
        this.getStartDateBox().option(name, value);
        // @ts-expect-error
        this.getEndDateBox()._setOptionWithoutOptionChange(name, value);
        break;
      case 'buttons':
        this._cleanButtonContainers();
        this._renderButtonsContainer();
        break;
      case 'calendarOptions':
      case 'dropDownOptions':
        this.getStartDateBox().option(fullName, value);
        break;
      case 'pickerType':
        {
          const pickerType = this._getPickerType();
          this.getStartDateBox().option(name, pickerType);
          this.getEndDateBox().option(name, pickerType);
          break;
        }
      case 'height':
        this.getStartDateBox().option(name, value);
        this.getEndDateBox().option(name, value);
        // @ts-expect-error
        super._optionChanged(args);
        break;
      case 'dropDownButtonTemplate':
      case 'showDropDownButton':
        this._updateButtons(['dropDown']);
        break;
      case 'showClearButton':
        this._updateButtons(['clear']);
        break;
      case 'endDate':
        // @ts-expect-error
        this.updateValue([this.option('value')[0], value]);
        break;
      case 'startDateLabel':
        this._toggleEditorLabelClass();
        this.getStartDateBox().option('label', value);
        break;
      case 'endDateLabel':
        this._toggleEditorLabelClass();
        this.getEndDateBox().option('label', value);
        break;
      case 'startDatePlaceholder':
        this.getStartDateBox().option('placeholder', value);
        break;
      case 'endDatePlaceholder':
        this.getEndDateBox().option('placeholder', value);
        break;
      case 'startDateInputAttr':
        this.getStartDateBox().option('inputAttr', value);
        break;
      case 'startDateName':
        this.getStartDateBox().option('name', value);
        break;
      case 'endDateInputAttr':
        this.getEndDateBox().option('inputAttr', value);
        break;
      case 'endDateName':
        this.getEndDateBox().option('name', value);
        break;
      case 'multiView':
        this.getStartDateBox().option('calendarOptions.viewsCount', value ? 2 : 1);
        break;
      case 'tabIndex':
      case 'activeStateEnabled':
      case 'focusStateEnabled':
      case 'hoverStateEnabled':
        // @ts-expect-error
        super._optionChanged(args);
        this.getStartDateBox().option(name, value);
        this.getEndDateBox().option(name, value);
        break;
      case 'onValueChanged':
        // @ts-expect-error
        this._createValueChangeAction();
        break;
      case 'onOpened':
        this._createOpenAction();
        break;
      case 'onClosed':
        this._createCloseAction();
        break;
      case 'onKeyDown':
      case 'onKeyUp':
      case 'onChange':
      case 'onInput':
      case 'onCut':
      case 'onCopy':
      case 'onPaste':
      case 'onEnterKey':
        this._createEventAction(name.replace('on', ''));
        break;
      case 'readOnly':
        this._updateButtons();
        // @ts-expect-error
        super._optionChanged(args);
        this.getStartDateBox().option(name, value);
        this.getEndDateBox().option(name, value);
        break;
      case 'disabled':
        this._updateButtons();
        // @ts-expect-error
        super._optionChanged(args);
        this.getStartDateBox().option(name, value);
        this.getEndDateBox().option(name, value);
        break;
      case 'disableOutOfRangeSelection':
        break;
      case 'startDate':
        // @ts-expect-error
        this.updateValue([value, this.option('value')[1]]);
        break;
      case 'stylingMode':
        // @ts-expect-error
        this._renderStylingMode();
        this.getStartDateBox().option(name, value);
        this.getEndDateBox().option(name, value);
        break;
      case 'startDateText':
      case 'endDateText':
      case 'useHiddenSubmitElement':
        break;
      case 'invalidStartDateMessage':
        this.getStartDateBox().option('invalidDateMessage', value);
        break;
      case 'invalidEndDateMessage':
        this.getEndDateBox().option('invalidDateMessage', value);
        break;
      case 'startDateOutOfRangeMessage':
        this.getStartDateBox().option('dateOutOfRangeMessage', value);
        break;
      case 'endDateOutOfRangeMessage':
        this.getEndDateBox().option('dateOutOfRangeMessage', value);
        break;
      case 'validationMessagePosition':
        this.getStartDateBox().option(name, value);
        // @ts-expect-error
        super._optionChanged(args);
        break;
      case '_internalValidationErrors':
        {
          this._syncValidationErrors('validationErrors', value, previousValue);
          const validationErrors = this.option('validationErrors');
          this.option('isValid', !(validationErrors !== null && validationErrors !== void 0 && validationErrors.length));
          break;
        }
      case 'isValid':
        {
          this.getStartDateBox().option(name, value);
          this.getEndDateBox().option(name, value);
          // @ts-expect-error
          const isValid = value && !this.option('_internalValidationErrors').length;
          if (this._shouldSkipIsValidChange || isValid === value) {
            // @ts-expect-error
            super._optionChanged(args);
            return;
          }
          this._shouldSkipIsValidChange = true;
          this.option('isValid', isValid);
          this._shouldSkipIsValidChange = false;
          break;
        }
      case 'validationErrors':
        {
          const internalValidationErrors = this.option('_internalValidationErrors') || [];
          const allErrors = value || [];
          const externalErrors = this._getRestErrors(allErrors, internalValidationErrors);
          // @ts-expect-error
          const errors = [...externalErrors, ...internalValidationErrors];
          const newValue = errors.length ? errors : null;
          // @ts-expect-error
          this._options.silent('validationErrors', newValue);
          // @ts-expect-error
          super._optionChanged(_extends({}, args, {
            value: newValue
          }));
          break;
        }
      case 'value':
        {
          const newValue = (0, _m_date_range.sortDatesArray)(value);
          if (!(0, _m_date_range.isSameDateArrays)(newValue, previousValue)) {
            // @ts-expect-error
            const isDirty = !(0, _m_date_range.isSameDateArrays)(newValue, this._initialValue);
            this.option('isDirty', isDirty);
            // @ts-expect-error
            this._setOptionWithoutOptionChange('value', newValue);
            // @ts-expect-error
            this._setOptionWithoutOptionChange('startDate', newValue[0]);
            // @ts-expect-error
            this._setOptionWithoutOptionChange('endDate', newValue[1]);
            this._applyCustomValidation(newValue);
            this._updateDateBoxesValue(newValue);
            // @ts-expect-error
            this.getStartDateBox().getStrategy().renderValue();
            this._toggleEmptinessState();
            // @ts-expect-error
            this._raiseValueChangeAction(newValue, previousValue);
            // @ts-expect-error
            this._saveValueChangeEvent(undefined);
          }
          break;
        }
      case '_currentSelection':
        break;
      default:
        // @ts-expect-error
        super._optionChanged(args);
    }
  }
  getStartDateBox() {
    return this._startDateBox;
  }
  getEndDateBox() {
    return this._endDateBox;
  }
  getButton(name) {
    return this._buttonCollection.getButton(name);
  }
  open() {
    this.option('opened', true);
  }
  close() {
    this.option('opened', false);
  }
  content() {
    return this.getStartDateBox().content();
  }
  field() {
    return [this.startDateField(), this.endDateField()];
  }
  startDateField() {
    return this.getStartDateBox().field();
  }
  endDateField() {
    return this.getEndDateBox().field();
  }
  focus() {
    this.getStartDateBox().focus();
  }
  reset() {
    super.reset();
    const startDateBox = this.getStartDateBox();
    const endDateBox = this.getEndDateBox();
    startDateBox.reset();
    endDateBox.reset();
    // @ts-expect-error
    startDateBox._updateInternalValidationState(true);
    // @ts-expect-error
    endDateBox._updateInternalValidationState(true);
  }
  clear() {
    super.clear();
    this.getEndDateBox().clear();
    this.getStartDateBox().clear();
  }
}
// @ts-expect-error
(0, _component_registrator.default)('dxDateRangeBox', DateRangeBox);
var _default = exports.default = DateRangeBox;