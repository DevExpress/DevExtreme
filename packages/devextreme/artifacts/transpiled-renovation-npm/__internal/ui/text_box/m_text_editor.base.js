"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _config = _interopRequireDefault(require("../../../core/config"));
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _guid = _interopRequireDefault(require("../../../core/guid"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _resize_observer = _interopRequireDefault(require("../../../core/resize_observer"));
var _deferred = require("../../../core/utils/deferred");
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _size = require("../../../core/utils/size");
var _type = require("../../../core/utils/type");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _pointer = _interopRequireDefault(require("../../../events/pointer"));
var _index = require("../../../events/utils/index");
var _editor = _interopRequireDefault(require("../../../ui/editor/editor"));
var _load_indicator = _interopRequireDefault(require("../../../ui/load_indicator"));
var _themes = require("../../../ui/themes");
var _selectors = require("../../../ui/widget/selectors");
var _ui = _interopRequireDefault(require("../../../ui/widget/ui.errors"));
var _m_text_editor = _interopRequireDefault(require("./m_text_editor.clear"));
var _m_text_editor2 = require("./m_text_editor.label");
var _m_index = _interopRequireDefault(require("./texteditor_button_collection/m_index"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TEXTEDITOR_CLASS = 'dx-texteditor';
const TEXTEDITOR_INPUT_CONTAINER_CLASS = 'dx-texteditor-input-container';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const TEXTEDITOR_INPUT_SELECTOR = `.${TEXTEDITOR_INPUT_CLASS}`;
const TEXTEDITOR_CONTAINER_CLASS = 'dx-texteditor-container';
const TEXTEDITOR_BUTTONS_CONTAINER_CLASS = 'dx-texteditor-buttons-container';
const TEXTEDITOR_PLACEHOLDER_CLASS = 'dx-placeholder';
const TEXTEDITOR_EMPTY_INPUT_CLASS = 'dx-texteditor-empty';
const STATE_INVISIBLE_CLASS = 'dx-state-invisible';
const TEXTEDITOR_PENDING_INDICATOR_CLASS = 'dx-pending-indicator';
const TEXTEDITOR_VALIDATION_PENDING_CLASS = 'dx-validation-pending';
const TEXTEDITOR_VALID_CLASS = 'dx-valid';
const EVENTS_LIST = ['KeyDown', 'KeyPress', 'KeyUp', 'Change', 'Cut', 'Copy', 'Paste', 'Input'];
const CONTROL_KEYS = ['tab', 'enter', 'shift', 'control', 'alt', 'escape', 'pageUp', 'pageDown', 'end', 'home', 'leftArrow', 'upArrow', 'rightArrow', 'downArrow'];
let TextEditorLabelCreator = _m_text_editor2.TextEditorLabel;
function checkButtonsOptionType(buttons) {
  if ((0, _type.isDefined)(buttons) && !Array.isArray(buttons)) {
    throw _ui.default.Error('E1053');
  }
}
// @ts-expect-error
const TextEditorBase = _editor.default.inherit({
  ctor(_, options) {
    if (options) {
      checkButtonsOptionType(options.buttons);
    }
    this._buttonCollection = new _m_index.default(this, this._getDefaultButtons());
    this._$beforeButtonsContainer = null;
    this._$afterButtonsContainer = null;
    this._labelContainerElement = null;
    this.callBase.apply(this, arguments);
  },
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      // eslint-disable-next-line no-void
      buttons: void 0,
      value: '',
      spellcheck: false,
      showClearButton: false,
      valueChangeEvent: 'change',
      placeholder: '',
      inputAttr: {},
      onFocusIn: null,
      onFocusOut: null,
      onKeyDown: null,
      onKeyUp: null,
      onChange: null,
      onInput: null,
      onCut: null,
      onCopy: null,
      onPaste: null,
      onEnterKey: null,
      mode: 'text',
      hoverStateEnabled: true,
      focusStateEnabled: true,
      text: undefined,
      displayValueFormatter(value) {
        return (0, _type.isDefined)(value) && value !== false ? value : '';
      },
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      stylingMode: (0, _config.default)().editorStylingMode || 'outlined',
      showValidationMark: true,
      label: '',
      labelMode: 'static',
      labelMark: ''
    });
  },
  _defaultOptionsRules() {
    return this.callBase().concat([{
      device() {
        const themeName = (0, _themes.current)();
        return (0, _themes.isMaterial)(themeName);
      },
      options: {
        labelMode: 'floating',
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        stylingMode: (0, _config.default)().editorStylingMode || 'filled'
      }
    }, {
      device() {
        const themeName = (0, _themes.current)();
        return (0, _themes.isFluent)(themeName);
      },
      options: {
        labelMode: 'outside'
      }
    }]);
  },
  _getDefaultButtons() {
    return [{
      name: 'clear',
      Ctor: _m_text_editor.default
    }];
  },
  _isClearButtonVisible() {
    return this.option('showClearButton') && !this.option('readOnly');
  },
  _input() {
    return this.$element().find(TEXTEDITOR_INPUT_SELECTOR).first();
  },
  _isFocused() {
    return (0, _selectors.focused)(this._input()) || this.callBase();
  },
  _inputWrapper() {
    return this.$element();
  },
  _buttonsContainer() {
    return this._inputWrapper().find(`.${TEXTEDITOR_BUTTONS_CONTAINER_CLASS}`).eq(0);
  },
  _isControlKey(key) {
    return CONTROL_KEYS.includes(key);
  },
  _renderStylingMode() {
    this.callBase();
    this._updateButtonsStyling(this.option('stylingMode'));
  },
  _initMarkup() {
    this.$element().addClass(TEXTEDITOR_CLASS);
    this._renderInput();
    this._renderButtonContainers();
    this._renderStylingMode();
    this._renderInputType();
    this._renderPlaceholder();
    this._renderProps();
    this.callBase();
    this._renderValue();
    this._renderLabel();
  },
  _render() {
    this.callBase();
    this._refreshValueChangeEvent();
    this._refreshEvents();
    this._renderEnterKeyAction();
    this._renderEmptinessEvent();
  },
  _renderInput() {
    this._$textEditorContainer = (0, _renderer.default)('<div>').addClass(TEXTEDITOR_CONTAINER_CLASS).appendTo(this.$element());
    this._$textEditorInputContainer = (0, _renderer.default)('<div>').addClass(TEXTEDITOR_INPUT_CONTAINER_CLASS).appendTo(this._$textEditorContainer);
    this._$textEditorInputContainer.append(this._createInput());
  },
  _getInputContainer() {
    return this._$textEditorInputContainer;
  },
  _renderPendingIndicator() {
    this.$element().addClass(TEXTEDITOR_VALIDATION_PENDING_CLASS);
    const $inputContainer = this._getInputContainer();
    const $indicatorElement = (0, _renderer.default)('<div>').addClass(TEXTEDITOR_PENDING_INDICATOR_CLASS).appendTo($inputContainer);
    this._pendingIndicator = this._createComponent($indicatorElement, _load_indicator.default);
  },
  _disposePendingIndicator() {
    if (!this._pendingIndicator) {
      return;
    }
    this._pendingIndicator.dispose();
    this._pendingIndicator.$element().remove();
    this._pendingIndicator = null;
    this.$element().removeClass(TEXTEDITOR_VALIDATION_PENDING_CLASS);
  },
  _renderValidationState() {
    this.callBase();
    const isPending = this.option('validationStatus') === 'pending';
    if (isPending) {
      !this._pendingIndicator && this._renderPendingIndicator();
      this._showValidMark = false;
    } else {
      if (this.option('validationStatus') === 'invalid') {
        this._showValidMark = false;
      }
      if (!this._showValidMark && this.option('showValidationMark') === true) {
        this._showValidMark = this.option('validationStatus') === 'valid' && !!this._pendingIndicator;
      }
      this._disposePendingIndicator();
    }
    this._toggleValidMark();
  },
  _getButtonsContainer() {
    return this._$textEditorContainer;
  },
  _renderButtonContainers() {
    const buttons = this.option('buttons');
    const $buttonsContainer = this._getButtonsContainer();
    this._$beforeButtonsContainer = this._buttonCollection.renderBeforeButtons(buttons, $buttonsContainer);
    this._$afterButtonsContainer = this._buttonCollection.renderAfterButtons(buttons, $buttonsContainer);
  },
  _cleanButtonContainers() {
    var _this$_$beforeButtons, _this$_$afterButtonsC;
    (_this$_$beforeButtons = this._$beforeButtonsContainer) === null || _this$_$beforeButtons === void 0 || _this$_$beforeButtons.remove();
    (_this$_$afterButtonsC = this._$afterButtonsContainer) === null || _this$_$afterButtonsC === void 0 || _this$_$afterButtonsC.remove();
    this._buttonCollection.clean();
  },
  _clean() {
    this._buttonCollection.clean();
    this._disposePendingIndicator();
    this._unobserveLabelContainerResize();
    this._$beforeButtonsContainer = null;
    this._$afterButtonsContainer = null;
    this._$textEditorContainer = null;
    this.callBase();
  },
  _createInput() {
    const $input = (0, _renderer.default)('<input>');
    this._applyInputAttributes($input, this.option('inputAttr'));
    return $input;
  },
  _setSubmitElementName(name) {
    const inputAttrName = this.option('inputAttr.name');
    return this.callBase(name || inputAttrName || '');
  },
  _applyInputAttributes($input, customAttributes) {
    const inputAttributes = (0, _extend.extend)(this._getDefaultAttributes(), customAttributes);
    $input.attr(inputAttributes).addClass(TEXTEDITOR_INPUT_CLASS);
    this._setInputMinHeight($input);
  },
  _setInputMinHeight($input) {
    $input.css('minHeight', this.option('height') ? '0' : '');
  },
  _getPlaceholderAttr() {
    const {
      ios,
      // @ts-expect-error
      mac
    } = _devices.default.real();
    const {
      placeholder
    } = this.option();
    // WA to fix vAlign (T898735)
    // https://bugs.webkit.org/show_bug.cgi?id=142968
    const value = placeholder || (ios || mac ? ' ' : null);
    return value;
  },
  _getDefaultAttributes() {
    const defaultAttributes = {
      autocomplete: 'off',
      placeholder: this._getPlaceholderAttr()
    };
    return defaultAttributes;
  },
  _updateButtons(names) {
    this._buttonCollection.updateButtons(names);
  },
  _updateButtonsStyling(editorStylingMode) {
    (0, _iterator.each)(this.option('buttons'), (_, _ref) => {
      let {
        options,
        name: buttonName
      } = _ref;
      if (options && !options.stylingMode && this.option('visible')) {
        const buttonInstance = this.getButton(buttonName);
        buttonInstance.option && buttonInstance.option('stylingMode', editorStylingMode === 'underlined' ? 'text' : 'contained');
      }
    });
  },
  _renderValue() {
    const renderInputPromise = this._renderInputValue();
    return renderInputPromise.promise();
  },
  _renderInputValue(value) {
    value = value ?? this.option('value');
    let text = this.option('text');
    const displayValue = this.option('displayValue');
    const displayValueFormatter = this.option('displayValueFormatter');
    if (displayValue !== undefined && value !== null) {
      text = displayValueFormatter(displayValue);
    } else if (!(0, _type.isDefined)(text)) {
      text = displayValueFormatter(value);
    }
    this.option('text', text);
    // fallback to empty string is required to support WebKit native date picker in some basic scenarios
    // can not be covered by QUnit
    if (this._input().val() !== ((0, _type.isDefined)(text) ? text : '')) {
      this._renderDisplayText(text);
    } else {
      this._toggleEmptinessEventHandler();
    }
    return (0, _deferred.Deferred)().resolve();
  },
  _renderDisplayText(text) {
    this._input().val(text);
    this._toggleEmptinessEventHandler();
  },
  _isValueValid() {
    if (this._input().length) {
      const {
        validity
      } = this._input().get(0);
      if (validity) {
        return validity.valid;
      }
    }
    return true;
  },
  _toggleEmptiness(isEmpty) {
    this.$element().toggleClass(TEXTEDITOR_EMPTY_INPUT_CLASS, isEmpty);
    this._togglePlaceholder(isEmpty);
  },
  _togglePlaceholder(isEmpty) {
    this.$element().find(`.${TEXTEDITOR_PLACEHOLDER_CLASS}`).eq(0).toggleClass(STATE_INVISIBLE_CLASS, !isEmpty);
  },
  _renderProps() {
    this._toggleReadOnlyState();
    this._toggleSpellcheckState();
    this._toggleTabIndex();
  },
  _toggleDisabledState(value) {
    this.callBase.apply(this, arguments);
    const $input = this._input();
    $input.prop('disabled', value);
  },
  _toggleTabIndex() {
    const $input = this._input();
    const disabled = this.option('disabled');
    const focusStateEnabled = this.option('focusStateEnabled');
    if (disabled || !focusStateEnabled) {
      $input.attr('tabIndex', -1);
    } else {
      $input.removeAttr('tabIndex');
    }
  },
  _toggleReadOnlyState() {
    this._input().prop('readOnly', this._readOnlyPropValue());
    this.callBase();
  },
  _readOnlyPropValue() {
    return this.option('readOnly');
  },
  _toggleSpellcheckState() {
    this._input().prop('spellcheck', this.option('spellcheck'));
  },
  _unobserveLabelContainerResize() {
    if (this._labelContainerElement) {
      _resize_observer.default.unobserve(this._labelContainerElement);
      this._labelContainerElement = null;
    }
  },
  _getLabelContainer() {
    return this._input();
  },
  _getLabelContainerWidth() {
    return (0, _size.getWidth)(this._getLabelContainer());
  },
  _getLabelBeforeWidth() {
    const buttonsBeforeWidth = this._$beforeButtonsContainer && (0, _size.getWidth)(this._$beforeButtonsContainer);
    return buttonsBeforeWidth ?? 0;
  },
  _updateLabelWidth() {
    this._label.updateBeforeWidth(this._getLabelBeforeWidth());
    this._label.updateMaxWidth(this._getLabelContainerWidth());
  },
  _getFieldElement() {
    return this._getLabelContainer();
  },
  _setFieldAria(force) {
    var _this$_label;
    const inputAttr = this.option('inputAttr');
    const ariaLabel = inputAttr === null || inputAttr === void 0 ? void 0 : inputAttr['aria-label'];
    const labelId = (_this$_label = this._label) === null || _this$_label === void 0 ? void 0 : _this$_label.getId();
    const value = ariaLabel ? undefined : labelId;
    if (value || force) {
      const aria = {
        // eslint-disable-next-line spellcheck/spell-checker
        labelledby: value,
        label: ariaLabel
      };
      this.setAria(aria, this._getFieldElement());
    }
  },
  _renderLabel() {
    this._unobserveLabelContainerResize();
    this._labelContainerElement = (0, _renderer.default)(this._getLabelContainer()).get(0);
    const {
      label,
      labelMode,
      labelMark,
      rtlEnabled
    } = this.option();
    const labelConfig = {
      onClickHandler: () => {
        this.focus();
      },
      onHoverHandler: e => {
        e.stopPropagation();
      },
      onActiveHandler: e => {
        e.stopPropagation();
      },
      $editor: this.$element(),
      text: label,
      mark: labelMark,
      mode: labelMode,
      rtlEnabled,
      containsButtonsBefore: !!this._$beforeButtonsContainer,
      getContainerWidth: () => this._getLabelContainerWidth(),
      getBeforeWidth: () => this._getLabelBeforeWidth()
    };
    this._label = new TextEditorLabelCreator(labelConfig);
    this._setFieldAria();
    if (this._labelContainerElement) {
      // NOTE: element can be not in DOM yet in React and Vue
      _resize_observer.default.observe(this._labelContainerElement, this._updateLabelWidth.bind(this));
    }
  },
  _renderPlaceholder() {
    this._renderPlaceholderMarkup();
    this._attachPlaceholderEvents();
  },
  _renderPlaceholderMarkup() {
    if (this._$placeholder) {
      this._$placeholder.remove();
      this._$placeholder = null;
    }
    const $input = this._input();
    const placeholder = this.option('placeholder');
    const placeholderAttributes = {
      id: placeholder ? `dx-${new _guid.default()}` : undefined,
      'data-dx_placeholder': placeholder
    };
    const $placeholder = this._$placeholder = (0, _renderer.default)('<div>')
    // @ts-expect-error
    .attr(placeholderAttributes);
    $placeholder.insertAfter($input);
    $placeholder.addClass(TEXTEDITOR_PLACEHOLDER_CLASS);
  },
  _attachPlaceholderEvents() {
    const startEvent = (0, _index.addNamespace)(_pointer.default.up, this.NAME);
    _events_engine.default.on(this._$placeholder, startEvent, () => {
      // @ts-expect-error
      _events_engine.default.trigger(this._input(), 'focus');
    });
    this._toggleEmptinessEventHandler();
  },
  _placeholder() {
    // @ts-expect-error
    return this._$placeholder || (0, _renderer.default)();
  },
  _clearValueHandler(e) {
    const $input = this._input();
    e.stopPropagation();
    this._saveValueChangeEvent(e);
    this._clearValue();
    // @ts-expect-error
    !this._isFocused() && _events_engine.default.trigger($input, 'focus');
    // @ts-expect-error
    _events_engine.default.trigger($input, 'input');
  },
  _clearValue() {
    this.clear();
  },
  _renderEvents() {
    const $input = this._input();
    (0, _iterator.each)(EVENTS_LIST, (_, event) => {
      if (this.hasActionSubscription(`on${event}`)) {
        const action = this._createActionByOption(`on${event}`, {
          excludeValidators: ['readOnly']
        });
        _events_engine.default.on($input, (0, _index.addNamespace)(event.toLowerCase(), this.NAME), e => {
          if (this._disposed) {
            return;
          }
          action({
            event: e
          });
        });
      }
    });
  },
  _refreshEvents() {
    const $input = this._input();
    (0, _iterator.each)(EVENTS_LIST, (_, event) => {
      _events_engine.default.off($input, (0, _index.addNamespace)(event.toLowerCase(), this.NAME));
    });
    this._renderEvents();
  },
  _keyPressHandler() {
    this.option('text', this._input().val());
  },
  _keyDownHandler(e) {
    const $input = this._input();
    const isCtrlEnter = e.ctrlKey && (0, _index.normalizeKeyName)(e) === 'enter';
    const isNewValue = $input.val() !== this.option('value');
    if (isCtrlEnter && isNewValue) {
      // @ts-expect-error
      _events_engine.default.trigger($input, 'change');
    }
  },
  _getValueChangeEventOptionName() {
    return 'valueChangeEvent';
  },
  _renderValueChangeEvent() {
    const keyPressEvent = (0, _index.addNamespace)(this._renderValueEventName(), `${this.NAME}TextChange`);
    const valueChangeEvent = (0, _index.addNamespace)(this.option(this._getValueChangeEventOptionName()), `${this.NAME}ValueChange`);
    const keyDownEvent = (0, _index.addNamespace)('keydown', `${this.NAME}TextChange`);
    const $input = this._input();
    _events_engine.default.on($input, keyPressEvent, this._keyPressHandler.bind(this));
    _events_engine.default.on($input, valueChangeEvent, this._valueChangeEventHandler.bind(this));
    _events_engine.default.on($input, keyDownEvent, this._keyDownHandler.bind(this));
  },
  _cleanValueChangeEvent() {
    const valueChangeNamespace = `.${this.NAME}ValueChange`;
    const textChangeNamespace = `.${this.NAME}TextChange`;
    _events_engine.default.off(this._input(), valueChangeNamespace);
    _events_engine.default.off(this._input(), textChangeNamespace);
  },
  _refreshValueChangeEvent() {
    this._cleanValueChangeEvent();
    this._renderValueChangeEvent();
  },
  _renderValueEventName() {
    return 'input change keypress';
  },
  _focusTarget() {
    return this._input();
  },
  _focusEventTarget() {
    return this.element();
  },
  _isInput(element) {
    return element === this._input().get(0);
  },
  _preventNestedFocusEvent(event) {
    if (event.isDefaultPrevented()) {
      return true;
    }
    let shouldPrevent = this._isNestedTarget(event.relatedTarget);
    if (event.type === 'focusin') {
      shouldPrevent = shouldPrevent && this._isNestedTarget(event.target) && !this._isInput(event.target);
    } else if (!shouldPrevent) {
      this._toggleFocusClass(false, this.$element());
    }
    shouldPrevent && event.preventDefault();
    return shouldPrevent;
  },
  _isNestedTarget(target) {
    return !!this.$element().find(target).length;
  },
  _focusClassTarget() {
    return this.$element();
  },
  _focusInHandler(event) {
    this._preventNestedFocusEvent(event);
    this.callBase.apply(this, arguments);
  },
  _focusOutHandler(event) {
    this._preventNestedFocusEvent(event);
    this.callBase.apply(this, arguments);
  },
  _toggleFocusClass(isFocused, $element) {
    this.callBase(isFocused, this._focusClassTarget($element));
  },
  _hasFocusClass(element) {
    return this.callBase((0, _renderer.default)(element || this.$element()));
  },
  _renderEmptinessEvent() {
    const $input = this._input();
    _events_engine.default.on($input, 'input blur', this._toggleEmptinessEventHandler.bind(this));
  },
  _toggleEmptinessEventHandler() {
    const text = this._input().val();
    const isEmpty = (text === '' || text === null) && this._isValueValid();
    this._toggleEmptiness(isEmpty);
  },
  _valueChangeEventHandler(e, formattedValue) {
    if (this.option('readOnly')) {
      return;
    }
    this._saveValueChangeEvent(e);
    this.option('value', arguments.length > 1 ? formattedValue : this._input().val());
    this._saveValueChangeEvent(undefined);
  },
  _renderEnterKeyAction() {
    this._enterKeyAction = this._createActionByOption('onEnterKey', {
      excludeValidators: ['readOnly']
    });
    _events_engine.default.off(this._input(), 'keyup.onEnterKey.dxTextEditor');
    _events_engine.default.on(this._input(), 'keyup.onEnterKey.dxTextEditor', this._enterKeyHandlerUp.bind(this));
  },
  _enterKeyHandlerUp(e) {
    if (this._disposed) {
      return;
    }
    if ((0, _index.normalizeKeyName)(e) === 'enter') {
      this._enterKeyAction({
        event: e
      });
    }
  },
  _updateValue() {
    this._options.silent('text', null);
    this._renderValue();
  },
  _dispose() {
    this._enterKeyAction = undefined;
    this.callBase();
  },
  _getSubmitElement() {
    return this._input();
  },
  _hasActiveElement() {
    return this._input().is(_dom_adapter.default.getActiveElement(this._input()[0]));
  },
  _optionChanged(args) {
    const {
      name,
      fullName,
      value
    } = args;
    const eventName = name.replace('on', '');
    if (EVENTS_LIST.includes(eventName)) {
      this._refreshEvents();
      return;
    }
    switch (name) {
      case 'valueChangeEvent':
        this._refreshValueChangeEvent();
        this._refreshFocusEvent();
        this._refreshEvents();
        break;
      case 'onValueChanged':
        this._createValueChangeAction();
        break;
      case 'focusStateEnabled':
        this.callBase(args);
        this._toggleTabIndex();
        break;
      case 'spellcheck':
        this._toggleSpellcheckState();
        break;
      case 'mode':
        this._renderInputType();
        break;
      case 'onEnterKey':
        this._renderEnterKeyAction();
        break;
      case 'placeholder':
        this._renderPlaceholder();
        this._setFieldAria(true);
        this._input().attr({
          placeholder: this._getPlaceholderAttr()
        });
        break;
      case 'label':
        this._label.updateText(value);
        this._setFieldAria(true);
        break;
      case 'labelMark':
        this._label.updateMark(value);
        break;
      case 'labelMode':
        this._label.updateMode(value);
        this._setFieldAria();
        break;
      case 'width':
        this.callBase(args);
        this._label.updateMaxWidth(this._getLabelContainerWidth());
        break;
      case 'readOnly':
      case 'disabled':
        this._updateButtons();
        this.callBase(args);
        break;
      case 'showClearButton':
        this._updateButtons(['clear']);
        break;
      case 'text':
        break;
      case 'value':
        this._updateValue();
        this.callBase(args);
        break;
      case 'inputAttr':
        this._applyInputAttributes(this._input(), this.option(name));
        break;
      case 'stylingMode':
        this._renderStylingMode();
        this._updateLabelWidth();
        break;
      case 'buttons':
        if (fullName === name) {
          checkButtonsOptionType(value);
        }
        this._cleanButtonContainers();
        this._renderButtonContainers();
        this._updateButtonsStyling(this.option('stylingMode'));
        this._updateLabelWidth();
        this._label.updateContainsButtonsBefore(!!this._$beforeButtonsContainer);
        break;
      case 'visible':
        this.callBase(args);
        if (value && this.option('buttons')) {
          this._cleanButtonContainers();
          this._renderButtonContainers();
          this._updateButtonsStyling(this.option('stylingMode'));
        }
        break;
      case 'displayValueFormatter':
        this._invalidate();
        break;
      case 'showValidationMark':
        break;
      default:
        this.callBase(args);
    }
  },
  _renderInputType() {
    // B218621, B231875
    this._setInputType(this.option('mode'));
  },
  _setInputType(type) {
    const input = this._input();
    if (type === 'search') {
      type = 'text';
    }
    try {
      input.prop('type', type);
    } catch (e) {
      input.prop('type', 'text');
    }
  },
  getButton(name) {
    return this._buttonCollection.getButton(name);
  },
  focus() {
    // @ts-expect-error
    _events_engine.default.trigger(this._input(), 'focus');
  },
  clear() {
    if (this._showValidMark) {
      this._showValidMark = false;
      this._renderValidationState();
    }
    const defaultOptions = this._getDefaultOptions();
    if (this.option('value') === defaultOptions.value) {
      this._options.silent('text', '');
      this._renderValue();
    } else {
      this.option('value', defaultOptions.value);
    }
  },
  _resetToInitialValue() {
    if (this.option('value') === this._initialValue) {
      this._options.silent('text', this._initialValue);
      this._renderValue();
    } else {
      this.callBase();
    }
    this._disposePendingIndicator();
    this._showValidMark = false;
    this._toggleValidMark();
  },
  _toggleValidMark() {
    this.$element().toggleClass(TEXTEDITOR_VALID_CLASS, !!this._showValidMark);
  },
  reset() {
    let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    if (arguments.length) {
      this.callBase(value);
    } else {
      this.callBase();
    }
  },
  on(eventName, eventHandler) {
    const result = this.callBase(eventName, eventHandler);
    const event = eventName.charAt(0).toUpperCase() + eventName.substr(1);
    if (EVENTS_LIST.includes(event)) {
      this._refreshEvents();
    }
    return result;
  }
});

var _default = exports.default = TextEditorBase;