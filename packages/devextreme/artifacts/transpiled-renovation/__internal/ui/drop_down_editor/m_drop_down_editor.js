"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _position = _interopRequireDefault(require("../../../animation/position"));
var _translator = require("../../../animation/translator");
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _element = require("../../../core/element");
var _guid = _interopRequireDefault(require("../../../core/guid"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _function_template = require("../../../core/templates/function_template");
var _common = require("../../../core/utils/common");
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _position2 = require("../../../core/utils/position");
var _type = require("../../../core/utils/type");
var _window = require("../../../core/utils/window");
var _click = require("../../../events/click");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _index = require("../../../events/utils/index");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _ui = _interopRequireDefault(require("../../../ui/popup/ui.popup"));
var _text_box = _interopRequireDefault(require("../../../ui/text_box"));
var _selectors = require("../../../ui/widget/selectors");
var _ui2 = _interopRequireDefault(require("../../../ui/widget/ui.errors"));
var _ui3 = _interopRequireDefault(require("../../../ui/widget/ui.widget"));
var _m_drop_down_button = _interopRequireDefault(require("./m_drop_down_button"));
var _m_utils = require("./m_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DROP_DOWN_EDITOR_CLASS = 'dx-dropdowneditor';
const DROP_DOWN_EDITOR_INPUT_WRAPPER = 'dx-dropdowneditor-input-wrapper';
const DROP_DOWN_EDITOR_BUTTON_ICON = 'dx-dropdowneditor-icon';
const DROP_DOWN_EDITOR_OVERLAY = 'dx-dropdowneditor-overlay';
const DROP_DOWN_EDITOR_OVERLAY_FLIPPED = 'dx-dropdowneditor-overlay-flipped';
const DROP_DOWN_EDITOR_ACTIVE = 'dx-dropdowneditor-active';
const DROP_DOWN_EDITOR_FIELD_CLICKABLE = 'dx-dropdowneditor-field-clickable';
const DROP_DOWN_EDITOR_FIELD_TEMPLATE_WRAPPER = 'dx-dropdowneditor-field-template-wrapper';
const OVERLAY_CONTENT_LABEL = 'Dropdown';
const isIOs = _devices.default.current().platform === 'ios';
// @ts-expect-error
const DropDownEditor = _text_box.default.inherit({
  _supportedKeys() {
    return (0, _extend.extend)({}, this.callBase(), {
      tab(e) {
        if (!this.option('opened')) {
          return;
        }
        if (!this._popup.getFocusableElements().length) {
          this.close();
          return;
        }
        const $focusableElement = e.shiftKey ? this._getLastPopupElement() : this._getFirstPopupElement();
        if ($focusableElement) {
          // @ts-expect-error
          _events_engine.default.trigger($focusableElement, 'focus');
          $focusableElement.select();
        }
        e.preventDefault();
      },
      escape(e) {
        if (this.option('opened')) {
          e.preventDefault();
        }
        this.close();
        return true;
      },
      upArrow(e) {
        if (!(0, _index.isCommandKeyPressed)(e)) {
          e.preventDefault();
          e.stopPropagation();
          if (e.altKey) {
            this.close();
            return false;
          }
        }
        return true;
      },
      downArrow(e) {
        if (!(0, _index.isCommandKeyPressed)(e)) {
          e.preventDefault();
          e.stopPropagation();
          if (e.altKey) {
            this._validatedOpening();
            return false;
          }
        }
        return true;
      },
      enter(e) {
        if (this.option('opened')) {
          e.preventDefault();
          this._valueChangeEventHandler(e);
        }
        return true;
      }
    });
  },
  _getDefaultButtons() {
    return this.callBase().concat([{
      name: 'dropDown',
      Ctor: _m_drop_down_button.default
    }]);
  },
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      value: null,
      onOpened: null,
      onClosed: null,
      opened: false,
      acceptCustomValue: true,
      applyValueMode: 'instantly',
      deferRendering: true,
      activeStateEnabled: true,
      dropDownButtonTemplate: 'dropDownButton',
      fieldTemplate: null,
      openOnFieldClick: false,
      showDropDownButton: true,
      // eslint-disable-next-line no-void
      buttons: void 0,
      dropDownOptions: {
        showTitle: false
      },
      popupPosition: this._getDefaultPopupPosition(),
      onPopupInitialized: null,
      applyButtonText: _message.default.format('OK'),
      cancelButtonText: _message.default.format('Cancel'),
      buttonsLocation: 'default',
      useHiddenSubmitElement: false,
      validationMessagePosition: 'auto'
    });
  },
  _useTemplates() {
    return true;
  },
  _getDefaultPopupPosition(isRtlEnabled) {
    const position = (0, _position2.getDefaultAlignment)(isRtlEnabled);
    return {
      offset: {
        h: 0,
        v: -1
      },
      my: `${position} top`,
      at: `${position} bottom`,
      collision: 'flip flip'
    };
  },
  _defaultOptionsRules() {
    return this.callBase().concat([{
      device(device) {
        const isGeneric = device.platform === 'generic';
        return isGeneric;
      },
      options: {
        popupPosition: {
          offset: {
            v: 0
          }
        }
      }
    }]);
  },
  _inputWrapper() {
    return this.$element().find(`.${DROP_DOWN_EDITOR_INPUT_WRAPPER}`).first();
  },
  _init() {
    this.callBase();
    this._initVisibilityActions();
    this._initPopupInitializedAction();
    this._updatePopupPosition(this.option('rtlEnabled'));
    this._options.cache('dropDownOptions', this.option('dropDownOptions'));
  },
  _updatePopupPosition(isRtlEnabled) {
    const {
      my,
      at
    } = this._getDefaultPopupPosition(isRtlEnabled);
    const currentPosition = this.option('popupPosition');
    this.option('popupPosition', (0, _extend.extend)({}, currentPosition, {
      my,
      at
    }));
  },
  _initVisibilityActions() {
    this._openAction = this._createActionByOption('onOpened', {
      excludeValidators: ['disabled', 'readOnly']
    });
    this._closeAction = this._createActionByOption('onClosed', {
      excludeValidators: ['disabled', 'readOnly']
    });
  },
  _initPopupInitializedAction() {
    this._popupInitializedAction = this._createActionByOption('onPopupInitialized', {
      excludeValidators: ['disabled', 'readOnly']
    });
  },
  _initMarkup() {
    this._renderSubmitElement();
    this.callBase();
    this.$element().addClass(DROP_DOWN_EDITOR_CLASS);
    this.setAria('role', this._getAriaRole());
  },
  _render() {
    this.callBase();
    this._renderOpenHandler();
    this._attachFocusOutHandler();
    this._renderOpenedState();
  },
  _renderContentImpl() {
    if (!this.option('deferRendering')) {
      this._createPopup();
    }
  },
  _renderInput() {
    this.callBase();
    this._renderTemplateWrapper();
    this._wrapInput();
    this._setDefaultAria();
  },
  _wrapInput() {
    this._$container = this.$element().wrapInner((0, _renderer.default)('<div>').addClass(DROP_DOWN_EDITOR_INPUT_WRAPPER)).children().eq(0);
  },
  _getAriaHasPopup() {
    return 'true';
  },
  _getAriaAutocomplete() {
    return 'none';
  },
  _getAriaRole() {
    return 'combobox';
  },
  _setDefaultAria() {
    this.setAria({
      haspopup: this._getAriaHasPopup(),
      autocomplete: this._getAriaAutocomplete(),
      role: this._getAriaRole()
    });
  },
  _readOnlyPropValue() {
    return !this._isEditable() || this.callBase();
  },
  _cleanFocusState() {
    this.callBase();
    if (this.option('fieldTemplate')) {
      this._detachFocusEvents();
    }
  },
  _getFieldTemplate() {
    return this.option('fieldTemplate') && this._getTemplateByOption('fieldTemplate');
  },
  _renderMask() {
    if (this.option('fieldTemplate')) {
      return;
    }
    this.callBase();
  },
  _renderField() {
    const fieldTemplate = this._getFieldTemplate();
    fieldTemplate && this._renderTemplatedField(fieldTemplate, this._fieldRenderData());
  },
  _renderPlaceholder() {
    const hasFieldTemplate = !!this._getFieldTemplate();
    if (!hasFieldTemplate) {
      this.callBase();
    }
  },
  _renderValue() {
    if (this.option('useHiddenSubmitElement')) {
      this._setSubmitValue();
    }
    const promise = this.callBase();
    promise.always(this._renderField.bind(this));
  },
  _getButtonsContainer() {
    const fieldTemplate = this._getFieldTemplate();
    return fieldTemplate ? this._$container : this._$textEditorContainer;
  },
  _renderTemplateWrapper() {
    const fieldTemplate = this._getFieldTemplate();
    if (!fieldTemplate) {
      return;
    }
    if (!this._$templateWrapper) {
      this._$templateWrapper = (0, _renderer.default)('<div>').addClass(DROP_DOWN_EDITOR_FIELD_TEMPLATE_WRAPPER).prependTo(this.$element());
    }
  },
  _renderTemplatedField(fieldTemplate, data) {
    const isFocused = (0, _selectors.focused)(this._input());
    this._detachKeyboardEvents();
    this._detachFocusEvents();
    this._$textEditorContainer.remove();
    this._$templateWrapper.empty();
    const $templateWrapper = this._$templateWrapper;
    fieldTemplate.render({
      model: data,
      container: (0, _element.getPublicElement)($templateWrapper),
      onRendered: () => {
        const isRenderedInRoot = !!this.$element().find($templateWrapper).length;
        if (!isRenderedInRoot) {
          return;
        }
        const $input = this._input();
        if (!$input.length) {
          throw _ui2.default.Error('E1010');
        }
        this._integrateInput();
        // @ts-expect-error
        isFocused && _events_engine.default.trigger($input, 'focus');
      }
    });
  },
  _integrateInput() {
    var _this$option;
    const {
      isValid
    } = this.option();
    this._renderFocusState();
    this._refreshValueChangeEvent();
    this._refreshEvents();
    this._refreshEmptinessEvent();
    this._setDefaultAria();
    this._setFieldAria();
    this._toggleValidationClasses(!isValid);
    (_this$option = this.option('_onMarkupRendered')) === null || _this$option === void 0 || _this$option();
  },
  _refreshEmptinessEvent() {
    _events_engine.default.off(this._input(), 'input blur', this._toggleEmptinessEventHandler);
    this._renderEmptinessEvent();
  },
  _fieldRenderData() {
    return this.option('value');
  },
  _initTemplates() {
    this._templateManager.addDefaultTemplates({
      // @ts-expect-error
      dropDownButton: new _function_template.FunctionTemplate(options => {
        const $icon = (0, _renderer.default)('<div>').addClass(DROP_DOWN_EDITOR_BUTTON_ICON);
        (0, _renderer.default)(options.container).append($icon);
      })
    });
    this.callBase();
  },
  _renderOpenHandler() {
    const $inputWrapper = this._inputWrapper();
    const eventName = (0, _index.addNamespace)(_click.name, this.NAME);
    const openOnFieldClick = this.option('openOnFieldClick');
    _events_engine.default.off($inputWrapper, eventName);
    _events_engine.default.on($inputWrapper, eventName, this._getInputClickHandler(openOnFieldClick));
    this.$element().toggleClass(DROP_DOWN_EDITOR_FIELD_CLICKABLE, openOnFieldClick);
    if (openOnFieldClick) {
      this._openOnFieldClickAction = this._createAction(this._openHandler.bind(this));
    }
  },
  _attachFocusOutHandler() {
    if (isIOs) {
      this._detachFocusOutEvents();
      _events_engine.default.on(this._inputWrapper(), (0, _index.addNamespace)('focusout', this.NAME), event => {
        const newTarget = event.relatedTarget;
        if (newTarget && this.option('opened')) {
          const isNewTargetOutside = this._isTargetOutOfComponent(newTarget);
          if (isNewTargetOutside) {
            this.close();
          }
        }
      });
    }
  },
  _isTargetOutOfComponent(newTarget) {
    const popupWrapper = this.content ? (0, _renderer.default)(this.content()).closest(`.${DROP_DOWN_EDITOR_OVERLAY}`) : this._$popup;
    // @ts-expect-error
    const isTargetOutsidePopup = (0, _renderer.default)(newTarget).closest(`.${DROP_DOWN_EDITOR_OVERLAY}`, popupWrapper).length === 0;
    return isTargetOutsidePopup;
  },
  _detachFocusOutEvents() {
    isIOs && _events_engine.default.off(this._inputWrapper(), (0, _index.addNamespace)('focusout', this.NAME));
  },
  _getInputClickHandler(openOnFieldClick) {
    return openOnFieldClick ? e => {
      this._executeOpenAction(e);
    } : () => {
      this._focusInput();
    };
  },
  _openHandler() {
    this._toggleOpenState();
  },
  _executeOpenAction(e) {
    this._openOnFieldClickAction({
      event: e
    });
  },
  _keyboardEventBindingTarget() {
    return this._input();
  },
  _focusInput() {
    if (this.option('disabled')) {
      return false;
    }
    if (this.option('focusStateEnabled') && !(0, _selectors.focused)(this._input())) {
      this._resetCaretPosition();
      // @ts-expect-error
      _events_engine.default.trigger(this._input(), 'focus');
    }
    return true;
  },
  _resetCaretPosition() {
    let ignoreEditable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    const inputElement = this._input().get(0);
    if (inputElement) {
      const {
        value
      } = inputElement;
      const caretPosition = (0, _type.isDefined)(value) && (ignoreEditable || this._isEditable()) ? value.length : 0;
      this._caret({
        start: caretPosition,
        end: caretPosition
      }, true);
    }
  },
  _isEditable() {
    return this.option('acceptCustomValue');
  },
  _toggleOpenState(isVisible) {
    if (!this._focusInput()) {
      return;
    }
    if (!this.option('readOnly')) {
      isVisible = arguments.length ? isVisible : !this.option('opened');
      this.option('opened', isVisible);
    }
  },
  _getControlsAria() {
    return this._popup && this._popupContentId;
  },
  _renderOpenedState() {
    const opened = this.option('opened');
    if (opened) {
      this._createPopup();
    }
    this.$element().toggleClass(DROP_DOWN_EDITOR_ACTIVE, opened);
    this._setPopupOption('visible', opened);
    const arias = {
      expanded: opened,
      controls: this._getControlsAria()
    };
    this.setAria(arias);
    this.setAria('owns', (opened || undefined) && this._popupContentId, this.$element());
  },
  _createPopup() {
    if (this._$popup) {
      return;
    }
    this._$popup = (0, _renderer.default)('<div>').addClass(DROP_DOWN_EDITOR_OVERLAY).appendTo(this.$element());
    this._renderPopup();
    this._renderPopupContent();
    this._setPopupAriaLabel();
  },
  _setPopupAriaLabel() {
    const $overlayContent = this._popup.$overlayContent();
    this.setAria('label', OVERLAY_CONTENT_LABEL, $overlayContent);
  },
  _renderPopupContent: _common.noop,
  _renderPopup() {
    const popupConfig = (0, _extend.extend)(this._popupConfig(), this._options.cache('dropDownOptions'));
    delete popupConfig.closeOnOutsideClick;
    this._popup = this._createComponent(this._$popup, _ui.default, popupConfig);
    this._popup.on({
      showing: this._popupShowingHandler.bind(this),
      shown: this._popupShownHandler.bind(this),
      hiding: this._popupHidingHandler.bind(this),
      hidden: this._popupHiddenHandler.bind(this),
      contentReady: this._contentReadyHandler.bind(this)
    });
    this._attachPopupKeyHandler();
    this._contentReadyHandler();
    this._setPopupContentId(this._popup.$content());
    this._bindInnerWidgetOptions(this._popup, 'dropDownOptions');
  },
  _attachPopupKeyHandler() {
    _events_engine.default.on(this._popup.$overlayContent(), (0, _index.addNamespace)('keydown', this.NAME), e => this._popupKeyHandler(e));
  },
  _popupKeyHandler(e) {
    // eslint-disable-next-line default-case, @typescript-eslint/switch-exhaustiveness-check
    switch ((0, _index.normalizeKeyName)(e)) {
      case 'tab':
        this._popupTabHandler(e);
        break;
      case 'escape':
        this._popupEscHandler(e);
        break;
    }
  },
  _popupTabHandler(e) {
    const $target = (0, _renderer.default)(e.target);
    const moveBackward = e.shiftKey && $target.is(this._getFirstPopupElement());
    const moveForward = !e.shiftKey && $target.is(this._getLastPopupElement());
    if (moveForward || moveBackward) {
      // @ts-expect-error
      _events_engine.default.trigger(this.field(), 'focus');
      e.preventDefault();
    }
  },
  _popupEscHandler() {
    // @ts-expect-error
    _events_engine.default.trigger(this._input(), 'focus');
    this.close();
  },
  _setPopupContentId($popupContent) {
    this._popupContentId = `dx-${new _guid.default()}`;
    this.setAria('id', this._popupContentId, $popupContent);
  },
  _contentReadyHandler: _common.noop,
  _popupConfig() {
    return {
      onInitialized: this._getPopupInitializedHandler(),
      position: (0, _extend.extend)(this.option('popupPosition'), {
        of: this.$element()
      }),
      showTitle: this.option('dropDownOptions.showTitle'),
      _ignoreFunctionValueDeprecation: true,
      width: () => (0, _m_utils.getElementWidth)(this.$element()),
      height: 'auto',
      shading: false,
      hideOnParentScroll: true,
      hideOnOutsideClick: e => this._closeOutsideDropDownHandler(e),
      animation: {
        show: {
          type: 'fade',
          duration: 0,
          from: 0,
          to: 1
        },
        hide: {
          type: 'fade',
          duration: 400,
          from: 1,
          to: 0
        }
      },
      deferRendering: false,
      focusStateEnabled: false,
      showCloseButton: false,
      dragEnabled: false,
      toolbarItems: this._getPopupToolbarItems(),
      onPositioned: this._popupPositionedHandler.bind(this),
      fullScreen: false,
      contentTemplate: null,
      _hideOnParentScrollTarget: this.$element(),
      _wrapperClassExternal: DROP_DOWN_EDITOR_OVERLAY,
      _ignorePreventScrollEventsDeprecation: true
    };
  },
  _popupInitializedHandler: _common.noop,
  _getPopupInitializedHandler() {
    const onPopupInitialized = this.option('onPopupInitialized');
    return e => {
      this._popupInitializedHandler(e);
      if (onPopupInitialized) {
        this._popupInitializedAction({
          popup: e.component
        });
      }
    };
  },
  _dimensionChanged() {
    // TODO: Use ResizeObserver to hide popup after editor visibility change
    // instead of window's dimension change,
    if ((0, _window.hasWindow)() && !this.$element().is(':visible')) {
      this.close();
      return;
    }
    this._updatePopupWidth();
  },
  _updatePopupWidth() {
    const popupWidth = (0, _m_utils.getSizeValue)(this.option('dropDownOptions.width'));
    if (popupWidth === undefined) {
      this._setPopupOption('width', () => (0, _m_utils.getElementWidth)(this.$element()));
    }
  },
  _popupPositionedHandler(e) {
    var _e$position;
    const {
      labelMode,
      stylingMode
    } = this.option();
    if (!this._popup) {
      return;
    }
    const $popupOverlayContent = this._popup.$overlayContent();
    const isOverlayFlipped = (_e$position = e.position) === null || _e$position === void 0 || (_e$position = _e$position.v) === null || _e$position === void 0 ? void 0 : _e$position.flip;
    const shouldIndentForLabel = labelMode !== 'hidden' && labelMode !== 'outside' && stylingMode === 'outlined';
    if (e.position) {
      $popupOverlayContent.toggleClass(DROP_DOWN_EDITOR_OVERLAY_FLIPPED, isOverlayFlipped);
    }
    if (isOverlayFlipped && shouldIndentForLabel && this._label.isVisible()) {
      const $label = this._label.$element();
      (0, _translator.move)($popupOverlayContent, {
        // eslint-disable-next-line radix
        top: (0, _translator.locate)($popupOverlayContent).top - parseInt($label.css('fontSize'))
      });
    }
  },
  _popupShowingHandler: _common.noop,
  _popupHidingHandler() {
    this.option('opened', false);
  },
  _popupShownHandler() {
    var _this$_validationMess;
    this._openAction();
    (_this$_validationMess = this._validationMessage) === null || _this$_validationMess === void 0 || _this$_validationMess.option('positionSide', this._getValidationMessagePositionSide());
  },
  _popupHiddenHandler() {
    var _this$_validationMess2;
    this._closeAction();
    (_this$_validationMess2 = this._validationMessage) === null || _this$_validationMess2 === void 0 || _this$_validationMess2.option('positionSide', this._getValidationMessagePositionSide());
  },
  _getValidationMessagePositionSide() {
    const validationMessagePosition = this.option('validationMessagePosition');
    if (validationMessagePosition !== 'auto') {
      return validationMessagePosition;
    }
    let positionSide = 'bottom';
    if (this._popup && this._popup.option('visible')) {
      // @ts-expect-error
      const {
        top: myTop
      } = _position.default.setup(this.$element());
      // @ts-expect-error
      const {
        top: popupTop
      } = _position.default.setup(this._popup.$content());
      positionSide = myTop + this.option('popupPosition').offset.v > popupTop ? 'bottom' : 'top';
    }
    return positionSide;
  },
  _closeOutsideDropDownHandler(_ref) {
    let {
      target
    } = _ref;
    const $target = (0, _renderer.default)(target);
    const dropDownButton = this.getButton('dropDown');
    const $dropDownButton = dropDownButton && dropDownButton.$element();
    const isInputClicked = !!$target.closest(this.$element()).length;
    const isDropDownButtonClicked = !!$target.closest($dropDownButton).length;
    const isOutsideClick = !isInputClicked && !isDropDownButtonClicked;
    return isOutsideClick;
  },
  _clean() {
    delete this._openOnFieldClickAction;
    delete this._$templateWrapper;
    if (this._$popup) {
      this._$popup.remove();
      delete this._$popup;
      delete this._popup;
    }
    this.callBase();
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _setPopupOption(optionName, value) {
    this._setWidgetOption('_popup', arguments);
  },
  _validatedOpening() {
    if (!this.option('readOnly')) {
      this._toggleOpenState(true);
    }
  },
  _getPopupToolbarItems() {
    return this.option('applyValueMode') === 'useButtons' ? this._popupToolbarItemsConfig() : [];
  },
  _getFirstPopupElement() {
    return (0, _renderer.default)(this._popup.getFocusableElements()).first();
  },
  _getLastPopupElement() {
    return (0, _renderer.default)(this._popup.getFocusableElements()).last();
  },
  _popupToolbarItemsConfig() {
    const buttonsConfig = [{
      shortcut: 'done',
      options: {
        onClick: this._applyButtonHandler.bind(this),
        text: this.option('applyButtonText')
      }
    }, {
      shortcut: 'cancel',
      options: {
        onClick: this._cancelButtonHandler.bind(this),
        text: this.option('cancelButtonText')
      }
    }];
    return this._applyButtonsLocation(buttonsConfig);
  },
  _applyButtonsLocation(buttonsConfig) {
    const buttonsLocation = this.option('buttonsLocation');
    const resultConfig = buttonsConfig;
    if (buttonsLocation !== 'default') {
      const position = (0, _common.splitPair)(buttonsLocation);
      (0, _iterator.each)(resultConfig, (_, element) => {
        (0, _extend.extend)(element, {
          toolbar: position[0],
          location: position[1]
        });
      });
    }
    return resultConfig;
  },
  _applyButtonHandler() {
    this.close();
    this.option('focusStateEnabled') && this.focus();
  },
  _cancelButtonHandler() {
    this.close();
    this.option('focusStateEnabled') && this.focus();
  },
  _popupOptionChanged(args) {
    // @ts-expect-error
    const options = _ui3.default.getOptionsFromContainer(args);
    this._setPopupOption(options);
    const optionsKeys = Object.keys(options);
    if (optionsKeys.includes('width') || optionsKeys.includes('height')) {
      this._dimensionChanged();
    }
  },
  _renderSubmitElement() {
    if (this.option('useHiddenSubmitElement')) {
      this._$submitElement = (0, _renderer.default)('<input>').attr('type', 'hidden').appendTo(this.$element());
    }
  },
  _setSubmitValue() {
    this._getSubmitElement().val(this.option('value'));
  },
  _getSubmitElement() {
    if (this.option('useHiddenSubmitElement')) {
      return this._$submitElement;
    }
    return this.callBase();
  },
  _dispose() {
    this._detachFocusOutEvents();
    this.callBase();
  },
  _optionChanged(args) {
    var _this$_popup;
    switch (args.name) {
      case 'width':
      case 'height':
        this.callBase(args);
        (_this$_popup = this._popup) === null || _this$_popup === void 0 || _this$_popup.repaint();
        break;
      case 'opened':
        this._renderOpenedState();
        break;
      case 'onOpened':
      case 'onClosed':
        this._initVisibilityActions();
        break;
      case 'onPopupInitialized':
        // for dashboards
        this._initPopupInitializedAction();
        break;
      case 'fieldTemplate':
      case 'acceptCustomValue':
      case 'openOnFieldClick':
        this._invalidate();
        break;
      case 'dropDownButtonTemplate':
      case 'showDropDownButton':
        this._updateButtons(['dropDown']);
        break;
      case 'dropDownOptions':
        this._popupOptionChanged(args);
        this._options.cache('dropDownOptions', this.option('dropDownOptions'));
        break;
      case 'popupPosition':
        break;
      case 'deferRendering':
        if ((0, _window.hasWindow)()) {
          this._createPopup();
        }
        break;
      case 'applyValueMode':
      case 'applyButtonText':
      case 'cancelButtonText':
      case 'buttonsLocation':
        this._setPopupOption('toolbarItems', this._getPopupToolbarItems());
        break;
      case 'useHiddenSubmitElement':
        if (this._$submitElement) {
          this._$submitElement.remove();
          this._$submitElement = undefined;
        }
        this._renderSubmitElement();
        break;
      case 'rtlEnabled':
        this._updatePopupPosition(args.value);
        this.callBase(args);
        break;
      default:
        this.callBase(args);
    }
  },
  open() {
    this.option('opened', true);
  },
  close() {
    this.option('opened', false);
  },
  field() {
    return (0, _element.getPublicElement)(this._input());
  },
  content() {
    return this._popup ? this._popup.content() : null;
  }
});
(0, _component_registrator.default)('dxDropDownEditor', DropDownEditor);
var _default = exports.default = DropDownEditor;