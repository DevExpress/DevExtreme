import animationPosition from '@js/common/core/animation/position';
import { locate, move } from '@js/common/core/animation/translator';
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace, isCommandKeyPressed, normalizeKeyName } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import { getPublicElement } from '@js/core/element';
import Guid from '@js/core/guid';
import $ from '@js/core/renderer';
import { FunctionTemplate } from '@js/core/templates/function_template';
import {
  noop,
  // @ts-expect-error
  splitPair,
} from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getDefaultAlignment } from '@js/core/utils/position';
import { isDefined } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import Popup from '@js/ui/popup/ui.popup';
import TextBox from '@js/ui/text_box';
import { focused } from '@js/ui/widget/selectors';
import errors from '@js/ui/widget/ui.errors';
import Widget from '@js/ui/widget/ui.widget';

import DropDownButton from './m_drop_down_button';
import { getElementWidth, getSizeValue } from './m_utils';

const DROP_DOWN_EDITOR_CLASS = 'dx-dropdowneditor';
const DROP_DOWN_EDITOR_INPUT_WRAPPER = 'dx-dropdowneditor-input-wrapper';
const DROP_DOWN_EDITOR_BUTTON_ICON = 'dx-dropdowneditor-icon';
const DROP_DOWN_EDITOR_OVERLAY = 'dx-dropdowneditor-overlay';
const DROP_DOWN_EDITOR_OVERLAY_FLIPPED = 'dx-dropdowneditor-overlay-flipped';
const DROP_DOWN_EDITOR_ACTIVE = 'dx-dropdowneditor-active';
const DROP_DOWN_EDITOR_FIELD_CLICKABLE = 'dx-dropdowneditor-field-clickable';
const DROP_DOWN_EDITOR_FIELD_TEMPLATE_WRAPPER = 'dx-dropdowneditor-field-template-wrapper';

const OVERLAY_CONTENT_LABEL = 'Dropdown';

const isIOs = devices.current().platform === 'ios';
// @ts-expect-error
const DropDownEditor = TextBox.inherit({

  _supportedKeys() {
    return extend({}, this.callBase(), {
      tab(e) {
        if (!this.option('opened')) {
          return;
        }

        if (!this._popup.getFocusableElements().length) {
          this.close();
          return;
        }

        const $focusableElement = e.shiftKey
          ? this._getLastPopupElement()
          : this._getFirstPopupElement();

        if ($focusableElement) {
          // @ts-expect-error
          eventsEngine.trigger($focusableElement, 'focus');
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
        if (!isCommandKeyPressed(e)) {
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
        if (!isCommandKeyPressed(e)) {
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
      },
    });
  },

  _getDefaultButtons() {
    return this.callBase().concat([{ name: 'dropDown', Ctor: DropDownButton }]);
  },

  _getDefaultOptions() {
    return extend(this.callBase(), {
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
      dropDownOptions: { showTitle: false },
      popupPosition: this._getDefaultPopupPosition(),
      onPopupInitialized: null,
      applyButtonText: messageLocalization.format('OK'),
      cancelButtonText: messageLocalization.format('Cancel'),
      buttonsLocation: 'default',
      useHiddenSubmitElement: false,
      validationMessagePosition: 'auto',
    });
  },

  _useTemplates() {
    return true;
  },

  _getDefaultPopupPosition(isRtlEnabled) {
    const position = getDefaultAlignment(isRtlEnabled);

    return {
      offset: { h: 0, v: -1 },
      my: `${position} top`,
      at: `${position} bottom`,
      collision: 'flip flip',
    };
  },

  _defaultOptionsRules() {
    return this.callBase().concat([
      {
        device(device) {
          const isGeneric = device.platform === 'generic';
          return isGeneric;
        },
        options: {
          popupPosition: { offset: { v: 0 } },
        },
      },
    ]);
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
    const { my, at } = this._getDefaultPopupPosition(isRtlEnabled);
    const currentPosition = this.option('popupPosition');

    this.option('popupPosition', extend({}, currentPosition, { my, at }));
  },

  _initVisibilityActions() {
    this._openAction = this._createActionByOption('onOpened', {
      excludeValidators: ['disabled', 'readOnly'],
    });

    this._closeAction = this._createActionByOption('onClosed', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  },

  _initPopupInitializedAction() {
    this._popupInitializedAction = this._createActionByOption('onPopupInitialized', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  },

  _initMarkup() {
    this._renderSubmitElement();

    this.callBase();

    this.$element()
      .addClass(DROP_DOWN_EDITOR_CLASS);

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
    this._$container = this.$element()
      .wrapInner($('<div>').addClass(DROP_DOWN_EDITOR_INPUT_WRAPPER))
      .children()
      .eq(0);
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
      role: this._getAriaRole(),
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
      this._$templateWrapper = $('<div>')
        .addClass(DROP_DOWN_EDITOR_FIELD_TEMPLATE_WRAPPER)
        .prependTo(this.$element());
    }
  },

  _renderTemplatedField(fieldTemplate, data) {
    const isFocused = focused(this._input());

    this._detachKeyboardEvents();
    this._detachFocusEvents();

    this._$textEditorContainer.remove();
    this._$templateWrapper.empty();

    const $templateWrapper = this._$templateWrapper;

    const currentRenderContext = Symbol('renderContext');
    this._activeRenderContext = currentRenderContext;

    fieldTemplate.render({
      model: data,
      container: getPublicElement($templateWrapper),
      onRendered: () => {
        if (this._activeRenderContext !== currentRenderContext) {
          return;
        }

        const isRenderedInRoot = !!this.$element().find($templateWrapper).length;

        if (!isRenderedInRoot) {
          return;
        }

        const $input = this._input();

        if (!$input.length) {
          throw errors.Error('E1010');
        }

        this._integrateInput();
        // @ts-expect-error
        isFocused && eventsEngine.trigger($input, 'focus');
      },
    });
  },

  _integrateInput() {
    const { isValid } = this.option();

    this._renderFocusState();
    this._refreshValueChangeEvent();
    this._refreshEvents();
    this._refreshEmptinessEvent();
    this._setDefaultAria();
    this._setFieldAria();
    this._toggleValidationClasses(!isValid);
    this.option('_onMarkupRendered')?.();
  },

  _refreshEmptinessEvent() {
    eventsEngine.off(this._input(), 'input blur', this._toggleEmptinessEventHandler);
    this._renderEmptinessEvent();
  },

  _fieldRenderData() {
    return this.option('value');
  },

  _initTemplates() {
    this._templateManager.addDefaultTemplates({
      // @ts-expect-error
      dropDownButton: new FunctionTemplate((options) => {
        const $icon = $('<div>').addClass(DROP_DOWN_EDITOR_BUTTON_ICON);
        $(options.container).append($icon);
      }),
    });
    this.callBase();
  },

  _renderOpenHandler() {
    const $inputWrapper = this._inputWrapper();
    const eventName = addNamespace(clickEventName, this.NAME);
    const openOnFieldClick = this.option('openOnFieldClick');

    eventsEngine.off($inputWrapper, eventName);
    eventsEngine.on($inputWrapper, eventName, this._getInputClickHandler(openOnFieldClick));
    this.$element().toggleClass(DROP_DOWN_EDITOR_FIELD_CLICKABLE, openOnFieldClick);

    if (openOnFieldClick) {
      this._openOnFieldClickAction = this._createAction(this._openHandler.bind(this));
    }
  },

  _attachFocusOutHandler() {
    if (isIOs) {
      this._detachFocusOutEvents();
      eventsEngine.on(this._inputWrapper(), addNamespace('focusout', this.NAME), (event) => {
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
    const popupWrapper = this.content ? $(this.content()).closest(`.${DROP_DOWN_EDITOR_OVERLAY}`) : this._$popup;
    // @ts-expect-error
    const isTargetOutsidePopup = $(newTarget).closest(`.${DROP_DOWN_EDITOR_OVERLAY}`, popupWrapper).length === 0;

    return isTargetOutsidePopup;
  },

  _detachFocusOutEvents() {
    isIOs && eventsEngine.off(this._inputWrapper(), addNamespace('focusout', this.NAME));
  },

  _getInputClickHandler(openOnFieldClick) {
    return openOnFieldClick
      ? (e) => { this._executeOpenAction(e); }
      : () => { this._focusInput(); };
  },

  _openHandler() {
    this._toggleOpenState();
  },

  _executeOpenAction(e) {
    this._openOnFieldClickAction({ event: e });
  },

  _keyboardEventBindingTarget() {
    return this._input();
  },

  _focusInput() {
    if (this.option('disabled')) {
      return false;
    }

    if (this.option('focusStateEnabled') && !focused(this._input())) {
      this._resetCaretPosition();
      // @ts-expect-error
      eventsEngine.trigger(this._input(), 'focus');
    }

    return true;
  },

  _resetCaretPosition(ignoreEditable = false) {
    const inputElement = this._input().get(0);

    if (inputElement) {
      const { value } = inputElement;
      const caretPosition = isDefined(value) && (ignoreEditable || this._isEditable()) ? value.length : 0;

      this._caret({ start: caretPosition, end: caretPosition }, true);
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
      controls: this._getControlsAria(),
    };

    this.setAria(arias);
    this.setAria('owns', (opened || undefined) && this._popupContentId, this.$element());
  },

  _createPopup() {
    if (this._$popup) {
      return;
    }

    this._$popup = $('<div>').addClass(DROP_DOWN_EDITOR_OVERLAY)
      .appendTo(this.$element());

    this._renderPopup();
    this._renderPopupContent();
    this._setPopupAriaLabel();
  },

  _setPopupAriaLabel() {
    const $overlayContent = this._popup.$overlayContent();

    this.setAria('label', OVERLAY_CONTENT_LABEL, $overlayContent);
  },

  _renderPopupContent: noop,

  _renderPopup() {
    const popupConfig = extend(this._popupConfig(), this._options.cache('dropDownOptions'));

    delete popupConfig.closeOnOutsideClick;

    this._popup = this._createComponent(this._$popup, Popup, popupConfig);

    this._popup.on({
      showing: this._popupShowingHandler.bind(this),
      shown: this._popupShownHandler.bind(this),
      hiding: this._popupHidingHandler.bind(this),
      hidden: this._popupHiddenHandler.bind(this),
      contentReady: this._contentReadyHandler.bind(this),
    });

    this._attachPopupKeyHandler();

    this._contentReadyHandler();

    this._setPopupContentId(this._popup.$content());

    this._bindInnerWidgetOptions(this._popup, 'dropDownOptions');
  },

  _attachPopupKeyHandler() {
    eventsEngine.on(this._popup.$overlayContent(), addNamespace('keydown', this.NAME), (e) => this._popupKeyHandler(e));
  },

  _popupKeyHandler(e) {
    // eslint-disable-next-line default-case, @typescript-eslint/switch-exhaustiveness-check
    switch (normalizeKeyName(e)) {
      case 'tab':
        this._popupTabHandler(e);
        break;
      case 'escape':
        this._popupEscHandler(e);
        break;
    }
  },

  _popupTabHandler(e) {
    const $target = $(e.target);
    const moveBackward = e.shiftKey && $target.is(this._getFirstPopupElement());
    const moveForward = !e.shiftKey && $target.is(this._getLastPopupElement());

    if (moveForward || moveBackward) {
      // @ts-expect-error
      eventsEngine.trigger(this.field(), 'focus');
      e.preventDefault();
    }
  },

  _popupEscHandler() {
    // @ts-expect-error
    eventsEngine.trigger(this._input(), 'focus');
    this.close();
  },

  _setPopupContentId($popupContent) {
    this._popupContentId = `dx-${new Guid()}`;
    this.setAria('id', this._popupContentId, $popupContent);
  },

  _contentReadyHandler: noop,

  _popupConfig() {
    return {
      onInitialized: this._getPopupInitializedHandler(),
      position: extend(this.option('popupPosition'), {
        of: this.$element(),
      }),
      showTitle: this.option('dropDownOptions.showTitle'),
      _ignoreFunctionValueDeprecation: true,
      width: () => getElementWidth(this.$element()),
      height: 'auto',
      shading: false,
      hideOnParentScroll: true,
      hideOnOutsideClick: (e) => this._closeOutsideDropDownHandler(e),
      animation: {
        show: {
          type: 'fade', duration: 0, from: 0, to: 1,
        },
        hide: {
          type: 'fade', duration: 400, from: 1, to: 0,
        },
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
      _ignorePreventScrollEventsDeprecation: true,
    };
  },

  _popupInitializedHandler: noop,

  _getPopupInitializedHandler() {
    const onPopupInitialized = this.option('onPopupInitialized');

    return (e) => {
      this._popupInitializedHandler(e);
      if (onPopupInitialized) {
        this._popupInitializedAction({ popup: e.component });
      }
    };
  },

  _dimensionChanged() {
    // TODO: Use ResizeObserver to hide popup after editor visibility change
    // instead of window's dimension change,
    if (hasWindow() && !this.$element().is(':visible')) {
      this.close();
      return;
    }

    this._updatePopupWidth();
  },

  _updatePopupWidth() {
    const popupWidth = getSizeValue(this.option('dropDownOptions.width'));

    if (popupWidth === undefined) {
      this._setPopupOption('width', () => getElementWidth(this.$element()));
    }
  },

  _popupPositionedHandler(e) {
    const { labelMode, stylingMode } = this.option();

    if (!this._popup) {
      return;
    }

    const $popupOverlayContent = this._popup.$overlayContent();
    const isOverlayFlipped = e.position?.v?.flip;
    const shouldIndentForLabel = labelMode !== 'hidden' && labelMode !== 'outside' && stylingMode === 'outlined';

    if (e.position) {
      $popupOverlayContent.toggleClass(DROP_DOWN_EDITOR_OVERLAY_FLIPPED, isOverlayFlipped);
    }

    if (isOverlayFlipped && shouldIndentForLabel && this._label.isVisible()) {
      const $label = this._label.$element();

      move($popupOverlayContent, {
        // eslint-disable-next-line radix
        top: locate($popupOverlayContent).top - parseInt($label.css('fontSize')),
      });
    }
  },

  _popupShowingHandler: noop,

  _popupHidingHandler() {
    this.option('opened', false);
  },

  _popupShownHandler() {
    this._openAction();

    this._validationMessage?.option('positionSide', this._getValidationMessagePositionSide());
  },

  _popupHiddenHandler() {
    this._closeAction();
    this._validationMessage?.option('positionSide', this._getValidationMessagePositionSide());
  },

  _getValidationMessagePositionSide() {
    const validationMessagePosition = this.option('validationMessagePosition');

    if (validationMessagePosition !== 'auto') {
      return validationMessagePosition;
    }

    let positionSide = 'bottom';

    if (this._popup && this._popup.option('visible')) {
      const { top: myTop } = animationPosition.setup(this.$element());
      const { top: popupTop } = animationPosition.setup(this._popup.$content());

      positionSide = (myTop + this.option('popupPosition').offset.v) > popupTop ? 'bottom' : 'top';
    }

    return positionSide;
  },

  _closeOutsideDropDownHandler({ target }) {
    const $target = $(target);
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
    return this.option('applyValueMode') === 'useButtons'
      ? this._popupToolbarItemsConfig()
      : [];
  },

  _getFirstPopupElement() {
    return $(this._popup.getFocusableElements()).first();
  },

  _getLastPopupElement() {
    return $(this._popup.getFocusableElements()).last();
  },

  _popupToolbarItemsConfig() {
    const buttonsConfig = [
      {
        shortcut: 'done',
        options: {
          onClick: this._applyButtonHandler.bind(this),
          text: this.option('applyButtonText'),
        },
      },
      {
        shortcut: 'cancel',
        options: {
          onClick: this._cancelButtonHandler.bind(this),
          text: this.option('cancelButtonText'),
        },
      },
    ];

    return this._applyButtonsLocation(buttonsConfig);
  },

  _applyButtonsLocation(buttonsConfig) {
    const buttonsLocation = this.option('buttonsLocation');
    const resultConfig = buttonsConfig;

    if (buttonsLocation !== 'default') {
      const position = splitPair(buttonsLocation);

      each(resultConfig, (_, element) => {
        extend(element, {
          toolbar: position[0],
          location: position[1],
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
    const options = Widget.getOptionsFromContainer(args);

    this._setPopupOption(options);

    const optionsKeys = Object.keys(options);
    if (optionsKeys.includes('width') || optionsKeys.includes('height')) {
      this._dimensionChanged();
    }
  },

  _renderSubmitElement() {
    if (this.option('useHiddenSubmitElement')) {
      this._$submitElement = $('<input>')
        .attr('type', 'hidden')
        .appendTo(this.$element());
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
    switch (args.name) {
      case 'width':
      case 'height':
        this.callBase(args);
        this._popup?.repaint();
        break;
      case 'opened':
        this._renderOpenedState();
        break;
      case 'onOpened':
      case 'onClosed':
        this._initVisibilityActions();
        break;
      case 'onPopupInitialized': // for dashboards
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
        if (hasWindow()) {
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
    return getPublicElement(this._input());
  },

  content() {
    return this._popup ? this._popup.content() : null;
  },
});

registerComponent('dxDropDownEditor', DropDownEditor);

export default DropDownEditor;
