import type { PositionConfig } from '@js/common/core/animation';
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
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { FunctionTemplate } from '@js/core/templates/function_template';
import browser from '@js/core/utils/browser';
import {
  // @ts-expect-error
  splitPair,
} from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getDefaultAlignment } from '@js/core/utils/position';
import { isDefined } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import type { DxEvent, EventInfo } from '@js/events';
import type { Options as Properties } from '@js/ui/drop_down_editor/ui.drop_down_editor';
import type { Properties as PopupProperties } from '@js/ui/popup';
import Popup from '@js/ui/popup/ui.popup';
import errors from '@js/ui/widget/ui.errors';
import Widget from '@js/ui/widget/ui.widget';
import { focused } from '@ts/core/utils/m_selectors';
import type { OptionChanged } from '@ts/core/widget/types';
import TextBox from '@ts/ui/text_box/m_text_box';

import type Popover from '../popover/m_popover';
import type { TextEditorButtonInfo } from '../text_box/texteditor_button_collection/m_index';
import DropDownButton from './m_drop_down_button';
import { getElementWidth, getSizeValue } from './m_utils';

export const DROP_DOWN_EDITOR_CLASS = 'dx-dropdowneditor';
const DROP_DOWN_EDITOR_INPUT_WRAPPER = 'dx-dropdowneditor-input-wrapper';
const DROP_DOWN_EDITOR_BUTTON_ICON = 'dx-dropdowneditor-icon';
const DROP_DOWN_EDITOR_OVERLAY = 'dx-dropdowneditor-overlay';
const DROP_DOWN_EDITOR_OVERLAY_FLIPPED = 'dx-dropdowneditor-overlay-flipped';
const DROP_DOWN_EDITOR_ACTIVE = 'dx-dropdowneditor-active';
const DROP_DOWN_EDITOR_FIELD_CLICKABLE = 'dx-dropdowneditor-field-clickable';
const DROP_DOWN_EDITOR_FIELD_TEMPLATE_WRAPPER = 'dx-dropdowneditor-field-template-wrapper';
export const DROP_DOWN_EDITOR_BEFORE_FIELD_ADDON = 'dx-dropdowneditor-before-field-template';
export const DROP_DOWN_EDITOR_AFTER_FIELD_ADDON = 'dx-dropdowneditor-after-field-template';

const OVERLAY_CONTENT_LABEL = 'Dropdown';

const isIOs = devices.current().platform === 'ios';

type HideOnOutsideClickEvent = DxEvent<MouseEvent | PointerEvent | TouchEvent>;

export interface DropDownEditorProperties extends Omit<
  Properties,
  | 'onChange'
  | 'onCopy'
  | 'onCut'
  | 'onEnterKey'
  | 'onFocusIn'
  | 'onFocusOut'
  | 'onInput'
  | 'onKeyDown'
  | 'onKeyUp'
  | 'onPaste'
  | 'onValueChanged'
  | 'validationMessagePosition'
  | 'onContentReady'
  | 'onDisposing'
  | 'onOptionChanged'
  | 'onInitialized'
> {
  buttonsLocation?: string;

  _onMarkupRendered?: () => void;

  onPopupInitialized?: (e: { component: DropDownEditor; popup: Popup }) => void;
}

interface TemplateRenderPayload {
  model: Properties['value'];
  container: Element;
  onRendered?: () => void;
}

interface FieldAddonsTemplates {
  beforeTemplate?: { render: (payload: TemplateRenderPayload) => void };
  afterTemplate?: { render: (payload: TemplateRenderPayload) => void };
}

function createTemplateWrapperElement(): dxElementWrapper {
  return $('<div>').addClass(DROP_DOWN_EDITOR_FIELD_TEMPLATE_WRAPPER);
}

class DropDownEditor<
  TProperties extends DropDownEditorProperties = DropDownEditorProperties,
> extends TextBox<TProperties> {
  _$container!: dxElementWrapper;

  _$submitElement?: dxElementWrapper;

  _$popup?: dxElementWrapper;

  _popup?: Popup | Popover;

  _$templateWrapper?: dxElementWrapper;

  _$beforeFieldAddon?: dxElementWrapper | null;

  _$afterFieldAddon?: dxElementWrapper | null;

  _openAction!: (event?: Record<string, unknown>) => void;

  _closeAction!: (event?: Record<string, unknown>) => void;

  _openOnFieldClickAction?: (event?: Record<string, unknown>) => void;

  _activeRenderContext?: symbol;

  _popupInitializedAction!: (event?: EventInfo<DropDownEditor> & {
    popup?: Popup;
  }) => void;

  _popupContentId?: string;

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  _supportedKeys(): Record<string, (e: KeyboardEvent) => boolean | void> {
    return {
      ...super._supportedKeys(),
      tab: (e): void => {
        if (!this.option('opened')) {
          return;
        }
        // @ts-expect-error ts-error
        if (!this._popup.getFocusableElements().length) {
          this.close();
          return;
        }

        const $focusableElement = e.shiftKey
          ? this._getLastPopupElement()
          : this._getFirstPopupElement();

        if ($focusableElement) {
          // @ts-expect-error ts-error
          eventsEngine.trigger($focusableElement, 'focus');
          // @ts-expect-error ts-error
          $focusableElement.select();
        }
        e.preventDefault();
      },
      escape: (e): boolean => {
        if (this.option('opened')) {
          e.preventDefault();
        }

        this.close();

        return true;
      },
      upArrow: (e): boolean => {
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
      downArrow: (e): boolean => {
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
      enter: (e): boolean => {
        if (this.option('opened')) {
          e.preventDefault();
          this._valueChangeEventHandler(e);
        }
        return true;
      },
    };
  }

  _getDefaultButtons(): TextEditorButtonInfo[] {
    // @ts-expect-error ts-error
    return super._getDefaultButtons().concat([{ name: 'dropDown', Ctor: DropDownButton }]);
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
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
      _cached_dropDownOptions: {},
    };
  }

  // eslint-disable-next-line class-methods-use-this
  _useTemplates(): boolean {
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  _getDefaultPopupPosition(isRtlEnabled?: boolean): PositionConfig {
    const position = getDefaultAlignment(isRtlEnabled);

    return {
      // @ts-expect-error ts-error
      offset: { h: 0, v: -1 },
      my: `${position} top`,
      at: `${position} bottom`,
      // @ts-expect-error ts-error
      collision: 'flip flip',
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device(device): boolean {
          const isGeneric = device.platform === 'generic';
          return isGeneric;
        },
        // @ts-expect-error ts-error
        options: {
          popupPosition: { offset: { v: 0 } },
        },
      },
    ]);
  }

  _inputWrapper(): dxElementWrapper {
    return this.$element().find(`.${DROP_DOWN_EDITOR_INPUT_WRAPPER}`).first();
  }

  _init(): void {
    super._init();
    this._initVisibilityActions();
    this._initPopupInitializedAction();

    const { rtlEnabled, dropDownOptions } = this.option();

    this._updatePopupPosition(rtlEnabled);
    this._options.cache('dropDownOptions', dropDownOptions);
  }

  _updatePopupPosition(isRtlEnabled?: boolean): void {
    const { my, at } = this._getDefaultPopupPosition(isRtlEnabled);
    const currentPosition = this.option('popupPosition');

    this.option('popupPosition', extend({}, currentPosition, { my, at }));
  }

  _initVisibilityActions(): void {
    this._openAction = this._createActionByOption('onOpened', {
      excludeValidators: ['disabled', 'readOnly'],
    });

    this._closeAction = this._createActionByOption('onClosed', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _initPopupInitializedAction(): void {
    this._popupInitializedAction = this._createActionByOption('onPopupInitialized', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _initMarkup(): void {
    this._renderSubmitElement();

    super._initMarkup();

    this.$element()
      .addClass(DROP_DOWN_EDITOR_CLASS);

    this.setAria('role', this._getAriaRole());
  }

  _render(): void {
    this._detachFocusEvents();

    super._render();

    this._renderOpenHandler();
    this._attachFocusOutHandler();
    this._renderOpenedState();
  }

  _renderContentImpl(): void {
    if (!this.option('deferRendering')) {
      this._createPopup();
    }
  }

  _renderInput(): void {
    super._renderInput();
    this._renderTemplateWrapper();
    this._renderFieldAddons();

    this._wrapInput();
    this._setDefaultAria();
  }

  _wrapInput(): void {
    this._$container = this.$element()
      .wrapInner($('<div>').addClass(DROP_DOWN_EDITOR_INPUT_WRAPPER))
      .children()
      .eq(0);
  }

  // eslint-disable-next-line class-methods-use-this
  _getAriaHasPopup(): string {
    return 'true';
  }

  // eslint-disable-next-line class-methods-use-this
  _getAriaAutocomplete(): string {
    return 'none';
  }

  // eslint-disable-next-line class-methods-use-this
  _getAriaRole(): string {
    return 'combobox';
  }

  _setDefaultAria(): void {
    this.setAria({
      haspopup: this._getAriaHasPopup(),
      autocomplete: this._getAriaAutocomplete(),
      role: this._getAriaRole(),
    });
  }

  _readOnlyPropValue(): boolean {
    return !this._isEditable() || super._readOnlyPropValue();
  }

  _cleanFocusState(): void {
    super._cleanFocusState();

    if (this.option('fieldTemplate')) {
      this._detachFocusEvents();
    }
  }

  _getFieldTemplate() {
    return this.option('fieldTemplate') && this._getTemplateByOption('fieldTemplate');
  }

  _renderMask(): void {
    if (this.option('fieldTemplate')) {
      return;
    }

    super._renderMask();
  }

  _renderField(): void {
    const fieldAddonsTemplates = this._getFieldAddonsTemplates();

    if (fieldAddonsTemplates) {
      this._renderFieldAddonsContent(fieldAddonsTemplates, this._fieldRenderData());

      return;
    }

    const fieldTemplate = this._getFieldTemplate();

    if (fieldTemplate) {
      this._renderTemplatedField(fieldTemplate, this._fieldRenderData());
    }
  }

  _renderPlaceholder(): void {
    const hasFieldTemplate = !!this._getFieldTemplate();

    if (!hasFieldTemplate) {
      super._renderPlaceholder();
    }
  }

  _renderValue(): DeferredObj<unknown> {
    if (this.option('useHiddenSubmitElement')) {
      this._setSubmitValue();
    }

    const promise = super._renderValue();

    return promise.always(this._renderField.bind(this));
  }

  _getButtonsContainer(): dxElementWrapper {
    const fieldTemplate = this._getFieldTemplate();
    return fieldTemplate ? this._$container : this._$textEditorContainer;
  }

  _renderBeforeFieldAddon(): void {
    if (!this._$beforeFieldAddon) {
      this._$beforeFieldAddon = $('<div>')
        .addClass(DROP_DOWN_EDITOR_BEFORE_FIELD_ADDON)
        .insertBefore(this._$textEditorContainer);
    }
  }

  _renderAfterFieldAddon(): void {
    if (!this._$afterFieldAddon) {
      this._$afterFieldAddon = $('<div>')
        .addClass(DROP_DOWN_EDITOR_AFTER_FIELD_ADDON)
        .insertAfter(this._$textEditorContainer);
    }
  }

  _renderFieldAddons(): void {
    const { fieldAddons } = this.option();

    if (!fieldAddons) {
      return;
    }

    this._renderBeforeFieldAddon();
    this._renderAfterFieldAddon();
  }

  _renderTemplateWrapper(): void {
    const fieldTemplate = this._getFieldTemplate();
    if (!fieldTemplate) {
      return;
    }

    if (!this._$templateWrapper) {
      this._$templateWrapper = createTemplateWrapperElement()
        .prependTo(this.$element());
    }
  }

  _renderTemplatedField(fieldTemplate, data): void {
    const isFocused = focused(this._input());

    this._detachKeyboardEvents();
    this._detachFocusEvents();

    this._$textEditorContainer.remove();

    const $newTemplateWrapper = createTemplateWrapperElement();
    this._$templateWrapper!.replaceWith($newTemplateWrapper);
    this._$templateWrapper = $newTemplateWrapper;

    const currentRenderContext = Symbol('renderContext');
    this._activeRenderContext = currentRenderContext;

    fieldTemplate.render({
      model: data,
      container: getPublicElement(this._$templateWrapper),
      onRendered: () => {
        if (this._activeRenderContext !== currentRenderContext) {
          return;
        }

        const $input = this._input();

        if (!$input.length) {
          throw errors.Error('E1010');
        }

        this._integrateInput();

        if (!isFocused) {
          return;
        }

        // T1259996
        if (browser.mozilla) {
          const inputElement = $input.get(0) as HTMLInputElement;
          inputElement.focus({ preventScroll: true });
        } else {
          // @ts-expect-error
          eventsEngine.trigger($input, 'focus');
        }
      },
    });
  }

  _getFieldAddonsTemplates(): FieldAddonsTemplates | null {
    const { fieldAddons } = this.option();

    if (!fieldAddons) {
      return null;
    }

    const { beforeTemplate: before, afterTemplate: after } = fieldAddons;

    const beforeTemplate = before ? this._getTemplate(before) : null;
    const afterTemplate = after ? this._getTemplate(after) : null;

    return {
      beforeTemplate,
      afterTemplate,
    };
  }

  _clearFieldAddons(removeField?: boolean): void {
    this._$beforeFieldAddon?.empty();
    this._$afterFieldAddon?.empty();

    if (removeField) {
      this._$beforeFieldAddon = null;
      this._$afterFieldAddon = null;
    }
  }

  _renderBeforeFieldAddonContent(model: Properties['value'], beforeTemplate?: FieldAddonsTemplates['beforeTemplate'] | null): void {
    if (beforeTemplate && this._$beforeFieldAddon) {
      beforeTemplate.render({
        model,
        container: getPublicElement(this._$beforeFieldAddon),
      });
    }
  }

  _renderAfterFieldAddonContent(model: Properties['value'], afterTemplate?: FieldAddonsTemplates['afterTemplate'] | null): void {
    if (afterTemplate && this._$afterFieldAddon) {
      afterTemplate.render({
        model,
        container: getPublicElement(this._$afterFieldAddon),
      });
    }
  }

  _renderFieldAddonsContent(fieldAddonsTemplates: FieldAddonsTemplates, model: Properties['value']): void {
    this._clearFieldAddons();

    if (!fieldAddonsTemplates) {
      return;
    }

    const { beforeTemplate, afterTemplate } = fieldAddonsTemplates;

    this._renderBeforeFieldAddonContent(model, beforeTemplate);
    this._renderAfterFieldAddonContent(model, afterTemplate);
  }

  _integrateInput(): void {
    const { isValid } = this.option();

    this._renderFocusState();
    this._refreshValueChangeEvent();
    this._refreshEvents();
    this._refreshEmptinessEvent();
    this._setDefaultAria();
    this._setFieldAria();
    this._toggleValidationClasses(!isValid);

    const { _onMarkupRendered: markupRendered } = this.option();

    markupRendered?.();
  }

  _refreshEmptinessEvent(): void {
    eventsEngine.off(this._input(), 'input blur', this._toggleEmptinessEventHandler);
    this._renderEmptinessEvent();
  }

  _fieldRenderData(): Properties['value'] {
    const { value } = this.option();
    return value;
  }

  _initTemplates(): void {
    this._templateManager.addDefaultTemplates({
      // @ts-expect-error ts-error
      dropDownButton: new FunctionTemplate((options) => {
        const $icon = $('<div>').addClass(DROP_DOWN_EDITOR_BUTTON_ICON);
        $(options.container).append($icon);
      }),
    });
    super._initTemplates();
  }

  _renderOpenHandler(): void {
    const $inputWrapper = this._inputWrapper();
    // @ts-expect-error ts-error
    const eventName = addNamespace(clickEventName, this.NAME);
    const { openOnFieldClick } = this.option();

    eventsEngine.off($inputWrapper, eventName);
    eventsEngine.on($inputWrapper, eventName, this._getInputClickHandler(openOnFieldClick));
    this.$element().toggleClass(DROP_DOWN_EDITOR_FIELD_CLICKABLE, openOnFieldClick);

    if (openOnFieldClick) {
      this._openOnFieldClickAction = this._createAction(this._openHandler.bind(this));
    }
  }

  _attachFocusOutHandler(): void {
    if (isIOs) {
      this._detachFocusOutEvents();
      // @ts-expect-error ts-error
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
  }

  _isTargetOutOfComponent(newTarget): boolean {
    const popupWrapper = this.content ? $(this.content()).closest(`.${DROP_DOWN_EDITOR_OVERLAY}`) : this._$popup;
    // @ts-expect-error
    const isTargetOutsidePopup = $(newTarget).closest(`.${DROP_DOWN_EDITOR_OVERLAY}`, popupWrapper).length === 0;

    return isTargetOutsidePopup;
  }

  _detachFocusOutEvents(): void {
    // @ts-expect-error ts-error
    isIOs && eventsEngine.off(this._inputWrapper(), addNamespace('focusout', this.NAME));
  }

  _getInputClickHandler(openOnFieldClick) {
    return openOnFieldClick
      ? (e) => { this._executeOpenAction(e); }
      : () => { this._focusInput(); };
  }

  _openHandler(): void {
    this._toggleOpenState();
  }

  _executeOpenAction(e): void {
    this._openOnFieldClickAction?.({ event: e });
  }

  _keyboardEventBindingTarget() {
    return this._input();
  }

  _focusInput(): boolean {
    if (this.option('disabled')) {
      return false;
    }

    if (this.option('focusStateEnabled') && !focused(this._input())) {
      this._resetCaretPosition();
      // @ts-expect-error ts-error
      eventsEngine.trigger(this._input(), 'focus');
    }

    return true;
  }

  _resetCaretPosition(ignoreEditable = false): void {
    const inputElement = this._input().get(0);

    if (inputElement) {
      // @ts-expect-error ts-error
      const { value } = inputElement;
      const caretPosition = isDefined(value)
        && (ignoreEditable || this._isEditable()) ? value.length : 0;

      this._caret({ start: caretPosition, end: caretPosition }, true);
    }
  }

  _isEditable(): boolean | undefined {
    const { acceptCustomValue } = this.option();

    return acceptCustomValue;
  }

  _toggleOpenState(isVisible?: boolean): void {
    if (!this._focusInput()) {
      return;
    }

    if (!this.option('readOnly')) {
      isVisible = arguments.length ? isVisible : !this.option('opened');
      this.option('opened', isVisible);
    }
  }

  _getControlsAria(): string | undefined {
    return this._popup && this._popupContentId;
  }

  _renderOpenedState(): void {
    const opened = this.option('opened');

    if (opened) {
      this._createPopup();
    }
    // @ts-expect-error ts-error
    this.$element().toggleClass(DROP_DOWN_EDITOR_ACTIVE, opened);
    this._setPopupOption('visible', opened);

    const arias = {
      expanded: opened,
      controls: this._getControlsAria(),
    };

    this.setAria(arias);
    this.setAria('owns', (opened || undefined) && this._popupContentId, this.$element());
  }

  _createPopup(): void {
    if (this._$popup) {
      return;
    }

    this._$popup = $('<div>').addClass(DROP_DOWN_EDITOR_OVERLAY)
      .appendTo(this.$element());

    this._renderPopup();
    this._renderPopupContent();
    this._setPopupAriaLabel();
  }

  _setPopupAriaLabel(): void {
    // @ts-expect-error ts-error
    const $overlayContent = this._popup.$overlayContent();

    this.setAria('label', OVERLAY_CONTENT_LABEL, $overlayContent);
  }

  // eslint-disable-next-line class-methods-use-this
  _renderPopupContent(): void {}

  _renderPopup(): void {
    const popupConfig = extend(this._popupConfig(), this._options.cache('dropDownOptions'));

    // @ts-expect-error ts-error
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
  }

  _attachPopupKeyHandler(): void {
    // @ts-expect-error ts-error
    eventsEngine.on(this._popup.$overlayContent(), addNamespace('keydown', this.NAME), (e) => this._popupKeyHandler(e));
  }

  _popupKeyHandler(e): void {
    // eslint-disable-next-line default-case, @typescript-eslint/switch-exhaustiveness-check
    switch (normalizeKeyName(e)) {
      case 'tab':
        this._popupTabHandler(e);
        break;
      case 'escape':
        this._popupEscHandler();
        break;
    }
  }

  _popupTabHandler(e): void {
    const $target = $(e.target);
    const moveBackward = e.shiftKey && $target.is(this._getFirstPopupElement());
    const moveForward = !e.shiftKey && $target.is(this._getLastPopupElement());

    if (moveForward || moveBackward) {
      // @ts-expect-error ts-error
      eventsEngine.trigger(this.field(), 'focus');
      e.preventDefault();
    }
  }

  _popupEscHandler(): void {
    // @ts-expect-error ts-error
    eventsEngine.trigger(this._input(), 'focus');
    this.close();
  }

  _setPopupContentId($popupContent: dxElementWrapper): void {
    this._popupContentId = `dx-${new Guid()}`;
    this.setAria('id', this._popupContentId, $popupContent);
  }

  // eslint-disable-next-line class-methods-use-this
  _contentReadyHandler(): void {}

  _popupConfig(): PopupProperties {
    return {
      onInitialized: this._getPopupInitializedHandler(),
      position: extend(this.option('popupPosition'), {
        of: this.$element(),
      }),
      // @ts-expect-error ts-error
      showTitle: this.option('dropDownOptions.showTitle'),
      _ignoreFunctionValueDeprecation: true,
      // @ts-expect-error ts-error
      width: (): number => getElementWidth(this.$element()),
      height: 'auto',
      shading: false,
      hideOnParentScroll: true,
      hideOnOutsideClick: (
        e: DxEvent<MouseEvent | PointerEvent | TouchEvent>,
      ): boolean => this._closeOutsideDropDownHandler(e),
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
      // @ts-expect-error ts-error
      contentTemplate: null,
      _hideOnParentScrollTarget: this.$element(),
      _wrapperClassExternal: DROP_DOWN_EDITOR_OVERLAY,
      _ignorePreventScrollEventsDeprecation: true,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  _popupInitializedHandler(): void {}

  _getPopupInitializedHandler(): (e) => void {
    const { onPopupInitialized } = this.option();

    return (e) => {
      this._popupInitializedHandler();
      if (onPopupInitialized) {
        // @ts-expect-error
        this._popupInitializedAction({ popup: e.component });
      }
    };
  }

  _dimensionChanged(): void {
    // TODO: Use ResizeObserver to hide popup after editor visibility change
    // instead of window's dimension change,
    if (hasWindow() && !this.$element().is(':visible')) {
      this.close();
      return;
    }

    this._updatePopupWidth();
  }

  _updatePopupWidth(): void {
    const popupWidth = getSizeValue(this.option('dropDownOptions.width'));

    if (popupWidth === undefined) {
      this._setPopupOption('width', () => getElementWidth(this.$element()));
    }
  }

  _popupPositionedHandler(e): void {
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
        // @ts-expect-error ts-error
        // eslint-disable-next-line radix
        top: locate($popupOverlayContent).top - parseInt($label.css('fontSize')),
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _popupShowingHandler(): void {}

  _popupHidingHandler(): void {
    this.option('opened', false);
  }

  _popupShownHandler(): void {
    this._openAction();

    this._validationMessage?.option('positionSide', this._getValidationMessagePositionSide());
  }

  _popupHiddenHandler(): void {
    this._closeAction();
    this._validationMessage?.option('positionSide', this._getValidationMessagePositionSide());
  }

  _getValidationMessagePositionSide(): string {
    // @ts-expect-error ts-error
    const { validationMessagePosition } = this.option();

    if (validationMessagePosition !== 'auto') {
      return validationMessagePosition;
    }

    let positionSide = 'bottom';

    if (this._popup?.option('visible')) {
      const { top: myTop } = animationPosition.setup(this.$element());

      const { top: popupTop } = animationPosition.setup(this._popup.$content());
      // @ts-expect-error ts-error
      positionSide = (myTop + this.option('popupPosition').offset.v) > popupTop ? 'bottom' : 'top';
    }

    return positionSide;
  }

  _closeOutsideDropDownHandler(event: HideOnOutsideClickEvent): boolean {
    const { target } = event;

    const $target = $(target);
    const dropDownButton = this.getButton('dropDown');
    const $dropDownButton = dropDownButton?.$element();
    const isInputClicked = !!$target.closest(this.$element()).length;
    // @ts-expect-error ts-error
    const isDropDownButtonClicked = !!$target.closest($dropDownButton).length;
    const isOutsideClick = !isInputClicked && !isDropDownButtonClicked;

    return isOutsideClick;
  }

  _clean(): void {
    delete this._openOnFieldClickAction;
    delete this._$templateWrapper;

    this._clearFieldAddons(true);

    if (this._$popup) {
      this._$popup.remove();
      delete this._$popup;
      delete this._popup;
    }

    super._clean();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _setPopupOption(optionName: string, value?): void {
    // @ts-expect-error ts-error
    this._setWidgetOption('_popup', arguments);
  }

  _validatedOpening(): void {
    if (!this.option('readOnly')) {
      this._toggleOpenState(true);
    }
  }

  _getPopupToolbarItems() {
    const { applyValueMode } = this.option();

    return applyValueMode === 'useButtons'
      ? this._popupToolbarItemsConfig()
      : [];
  }

  _getFirstPopupElement(): dxElementWrapper {
    // @ts-expect-error ts-error
    return $(this._popup.getFocusableElements()).first();
  }

  _getLastPopupElement(): dxElementWrapper {
    // @ts-expect-error ts-error
    return $(this._popup.getFocusableElements()).last();
  }

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
  }

  _applyButtonsLocation(buttonsConfig) {
    const { buttonsLocation } = this.option();
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
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _applyButtonHandler(args?): void {
    this.close();

    if (this.option('focusStateEnabled')) {
      this.focus();
    }
  }

  _cancelButtonHandler(): void {
    this.close();
    if (this.option('focusStateEnabled')) {
      this.focus();
    }
  }

  _popupOptionChanged(args): void {
    // @ts-expect-error ts-error
    const options = Widget.getOptionsFromContainer(args);

    this._setPopupOption(options);

    const optionsKeys = Object.keys(options);
    if (optionsKeys.includes('width') || optionsKeys.includes('height')) {
      this._dimensionChanged();
    }
  }

  _renderSubmitElement(): void {
    if (this.option('useHiddenSubmitElement')) {
      this._$submitElement = $('<input>')
        .attr('type', 'hidden')
        .appendTo(this.$element());
    }
  }

  _setSubmitValue(): void {
    const { value } = this.option();

    this._getSubmitElement().val(value);
  }

  _getSubmitElement(): dxElementWrapper {
    if (this.option('useHiddenSubmitElement')) {
      // @ts-expect-error ts-error
      return this._$submitElement;
    }
    return super._getSubmitElement();
  }

  _dispose(): void {
    this._detachFocusOutEvents();
    super._dispose();
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    const { name, value } = args;

    switch (name) {
      case 'width':
      case 'height':
        super._optionChanged(args);
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
      case 'fieldAddons':
      case 'fieldTemplate':
      case 'acceptCustomValue':
      case 'openOnFieldClick':
        this._invalidate();
        break;
      case 'dropDownButtonTemplate':
      case 'showDropDownButton':
        this._updateButtons(['dropDown']);
        break;
      case 'dropDownOptions': {
        this._popupOptionChanged(args);
        this._innerWidgetOptionChanged(this._popup, args);
        break;
      }
      case '_cached_dropDownOptions':
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
        this._updatePopupPosition(value as TProperties['rtlEnabled']);
        super._optionChanged(args);
        break;
      default:
        super._optionChanged(args);
    }
  }

  open(): void {
    this.option('opened', true);
  }

  close(): void {
    this.option('opened', false);
  }

  field(): Element {
    return getPublicElement(this._input());
  }

  content(): Element | null {
    return this._popup ? this._popup.content() : null;
  }
}

registerComponent('dxDropDownEditor', DropDownEditor);

export default DropDownEditor;
