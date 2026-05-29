import type { EditorStyle, LabelMode } from '@js/common';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace, normalizeKeyName } from '@js/common/core/events/utils/index';
import type { DeepPartial } from '@js/core';
import config from '@js/core/config';
import devices from '@js/core/devices';
import domAdapter from '@js/core/dom_adapter';
import Guid from '@js/core/guid';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import resizeObserverSingleton from '@js/core/resize_observer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getWidth } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type dxButton from '@js/ui/button';
import LoadIndicator from '@js/ui/load_indicator';
import type { dxTextEditorOptions } from '@js/ui/text_box/ui.text_editor.base';
import { current, isFluent, isMaterial } from '@js/ui/themes';
import errors from '@js/ui/widget/ui.errors';
import { focused } from '@ts/core/utils/m_selectors';
import type { OptionChanged } from '@ts/core/widget/types';
import type { ValueChangedEvent } from '@ts/ui/editor/editor';
import Editor from '@ts/ui/editor/editor';

import ClearButton from './text_editor.clear';
import { TextEditorLabel } from './text_editor.label';
import type { TextEditorButtonInfo } from './texteditor_button_collection/index';
import TextEditorButtonCollection from './texteditor_button_collection/index';

export interface TextEditorBaseProperties extends dxTextEditorOptions<TextEditorBase> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayValueFormatter?: ((value: string | any[]) => string);

  labelMode?: LabelMode;

  labelMark?: string;

  showValidationMark?: boolean;

  mode?: string;

  displayValue?: string;
}

export const TEXTEDITOR_CLASS = 'dx-texteditor';
export const TEXTEDITOR_INPUT_CONTAINER_CLASS = 'dx-texteditor-input-container';
export const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const TEXTEDITOR_INPUT_SELECTOR = `.${TEXTEDITOR_INPUT_CLASS}`;
const TEXTEDITOR_CONTAINER_CLASS = 'dx-texteditor-container';
const TEXTEDITOR_BUTTONS_CONTAINER_CLASS = 'dx-texteditor-buttons-container';
const TEXTEDITOR_PLACEHOLDER_CLASS = 'dx-placeholder';
const TEXTEDITOR_EMPTY_INPUT_CLASS = 'dx-texteditor-empty';

const STATE_INVISIBLE_CLASS = 'dx-state-invisible';
const TEXTEDITOR_PENDING_INDICATOR_CLASS = 'dx-pending-indicator';
const TEXTEDITOR_VALIDATION_PENDING_CLASS = 'dx-validation-pending';
const TEXTEDITOR_VALID_CLASS = 'dx-valid';

const EVENTS_LIST = [
  'KeyDown',
  'KeyPress',
  'KeyUp',
  'Change',
  'Cut',
  'Copy',
  'Paste',
  'Input',
];

const CONTROL_KEYS = [
  'tab',
  'enter',
  'shift',
  'control',
  'alt',
  'escape',
  'pageUp',
  'pageDown',
  'end',
  'home',
  'leftArrow',
  'upArrow',
  'rightArrow',
  'downArrow',
];

let TextEditorLabelCreator = TextEditorLabel;

const checkButtonsOptionType = (buttons: TextEditorBaseProperties['buttons']): void => {
  if (isDefined(buttons) && !Array.isArray(buttons)) {
    throw errors.Error('E1053');
  }
};

class TextEditorBase<
  TProperties extends TextEditorBaseProperties = TextEditorBaseProperties,
> extends Editor<TProperties> {
  _showValidMark?: boolean;

  _$textEditorContainer?: dxElementWrapper | null;

  _$textEditorInputContainer?: dxElementWrapper | null;

  _pendingIndicator?: LoadIndicator | null;

  _buttonCollection!: TextEditorButtonCollection;

  _$beforeButtonsContainer?: dxElementWrapper | null;

  _$afterButtonsContainer?: dxElementWrapper | null;

  _labelContainerElement?: Element | null;

  _label!: TextEditorLabel;

  _$placeholder?: dxElementWrapper | null;

  _enterKeyAction?: ((event?: Record<string, unknown>) => void);

  ctor(element: Element, options: TProperties): void {
    if (options) {
      checkButtonsOptionType(options.buttons);
    }

    this._buttonCollection = new TextEditorButtonCollection(
      this as unknown as TextEditorBase,
      this._getDefaultButtons(),
    );

    this._$beforeButtonsContainer = null;
    this._$afterButtonsContainer = null;
    this._labelContainerElement = null;

    super.ctor(element, options);
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
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
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      stylingMode: config().editorStylingMode || 'outlined',
      showValidationMark: true,
      label: '',
      labelMode: 'static',
      labelMark: '',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      displayValueFormatter(value: string | any[]): string {
        // @ts-expect-error Comparison of boolean and any[], any is not string
        return isDefined(value) && value !== false ? value : '';
      },
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    const rules = [
      ...super._defaultOptionsRules(),
      {
        device(): boolean {
          const themeName = current();
          return isMaterial(themeName);
        },
        options: {
          labelMode: 'floating',
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          stylingMode: config().editorStylingMode || 'filled',
        } as DeepPartial<TProperties>,
      },
      {
        device(): boolean {
          const themeName = current();
          return isFluent(themeName);
        },
        options: {
          labelMode: 'outside',
        } as DeepPartial<TProperties>,
      },
    ];

    return rules;
  }

  _getDefaultButtons(): TextEditorButtonInfo[] {
    return [
      {
        name: 'clear',
        Ctor: ClearButton,
      },
    ];
  }

  _isClearButtonVisible(): boolean {
    return this.option('showClearButton') && !this.option('readOnly');
  }

  _input(): dxElementWrapper {
    return this.$element().find(TEXTEDITOR_INPUT_SELECTOR).first();
  }

  _isFocused(): boolean {
    return focused(this._input()) || super._isFocused();
  }

  _inputWrapper(): dxElementWrapper {
    return this.$element();
  }

  _buttonsContainer(): dxElementWrapper {
    return this._inputWrapper().find(`.${TEXTEDITOR_BUTTONS_CONTAINER_CLASS}`).eq(0);
  }

  _isControlKey(key: string): boolean {
    return CONTROL_KEYS.includes(key);
  }

  _renderStylingMode(): void {
    super._renderStylingMode();

    const { stylingMode } = this.option();

    this._updateButtonsStyling(stylingMode);
  }

  _initMarkup(): void {
    this.$element()
      .addClass(TEXTEDITOR_CLASS);

    this._renderInput();
    this._renderButtonContainers();
    this._renderStylingMode();
    this._renderInputType();
    this._renderPlaceholder();
    this._renderProps();

    super._initMarkup();

    this._renderValue();
    this._renderLabel();
  }

  _render(): void {
    super._render();

    this._refreshValueChangeEvent();
    this._refreshEvents();

    this._renderEnterKeyAction();
    this._renderEmptinessEvent();
  }

  _renderInput(): void {
    this._$textEditorContainer = $('<div>')
      .addClass(TEXTEDITOR_CONTAINER_CLASS)
      .appendTo(this.$element());

    this._$textEditorInputContainer = $('<div>')
      .addClass(TEXTEDITOR_INPUT_CONTAINER_CLASS)
      .appendTo(this._$textEditorContainer);

    this._$textEditorInputContainer.append(this._createInput());
  }

  _getInputContainer(): dxElementWrapper | null | undefined {
    return this._$textEditorInputContainer;
  }

  _renderPendingIndicator(): void {
    this.$element().addClass(TEXTEDITOR_VALIDATION_PENDING_CLASS);

    const $inputContainer = this._getInputContainer();

    if (!$inputContainer) {
      return;
    }

    const $indicatorElement = $('<div>')
      .addClass(TEXTEDITOR_PENDING_INDICATOR_CLASS)
      .appendTo($inputContainer);

    this._pendingIndicator = this._createComponent($indicatorElement, LoadIndicator, {});
  }

  _disposePendingIndicator(): void {
    if (!this._pendingIndicator) {
      return;
    }
    this._pendingIndicator.dispose();
    this._pendingIndicator.$element().remove();
    this._pendingIndicator = null;
    this.$element().removeClass(TEXTEDITOR_VALIDATION_PENDING_CLASS);
  }

  _renderValidationState(): void {
    super._renderValidationState();

    const { validationStatus, showValidationMark } = this.option();

    const isPending = validationStatus === 'pending';

    if (isPending) {
      if (!this._pendingIndicator) {
        this._renderPendingIndicator();
      }

      this._showValidMark = false;
    } else {
      if (validationStatus === 'invalid') {
        this._showValidMark = false;
      }

      if (!this._showValidMark && showValidationMark === true) {
        this._showValidMark = validationStatus === 'valid' && !!this._pendingIndicator;
      }

      this._disposePendingIndicator();
    }

    this._toggleValidMark();
  }

  _getButtonsContainer(): dxElementWrapper | null | undefined {
    return this._$textEditorContainer;
  }

  _renderButtonContainers(): void {
    const { buttons } = this.option();

    const $buttonsContainer = this._getButtonsContainer();

    if (!$buttonsContainer) {
      return;
    }

    this._$beforeButtonsContainer = this._buttonCollection.renderBeforeButtons(
      buttons,
      $buttonsContainer,
    );

    this._$afterButtonsContainer = this._buttonCollection.renderAfterButtons(
      buttons,
      $buttonsContainer,
    );
  }

  _cleanButtonContainers(): void {
    this._$beforeButtonsContainer?.remove();
    this._$afterButtonsContainer?.remove();
    this._buttonCollection.clean();
  }

  _clean(): void {
    this._buttonCollection.clean();
    this._disposePendingIndicator();
    this._unobserveLabelContainerResize();

    super._clean();

    this._$beforeButtonsContainer = null;
    this._$afterButtonsContainer = null;
    this._$textEditorContainer = null;
    this._$textEditorInputContainer = null;
    this._$placeholder = null;
  }

  _createInput(): dxElementWrapper {
    const $input = $('<input>');
    this._applyInputAttributes($input, this.option('inputAttr'));
    return $input;
  }

  _setSubmitElementName(name?: string): void {
    const { inputAttr } = this.option();

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    super._setSubmitElementName(name || inputAttr?.name || '');
  }

  _applyInputAttributes(
    $input: dxElementWrapper,
    customAttributes = {},
  ): void {
    const inputAttributes = extend(this._getDefaultAttributes(), customAttributes);

    $input.attr(inputAttributes);
    $input.addClass(TEXTEDITOR_INPUT_CLASS);

    this._setInputMinHeight($input);
  }

  _setInputMinHeight($input: dxElementWrapper): void {
    $input.css('minHeight', this.option('height') ? '0' : '');
  }

  _getPlaceholderAttr(): string | null {
    const {
      ios,
      // @ts-expect-error Property 'mac' does not exist on type 'Device'
      mac,
    } = devices.real();
    const { placeholder } = this.option();

    // WA to fix vAlign (T898735)
    // https://bugs.webkit.org/show_bug.cgi?id=142968
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const value = placeholder || (ios || mac ? ' ' : null);

    return value;
  }

  _getDefaultAttributes(): {
    autocomplete: string;
    placeholder: string | null;
    // eslint-disable-next-line spellcheck/spell-checker
    inputmode?: string;
  } {
    const defaultAttributes = {
      autocomplete: 'off',
      placeholder: this._getPlaceholderAttr(),
    };

    return defaultAttributes;
  }

  _updateButtons(names?: string[]): void {
    this._buttonCollection.updateButtons(names);
  }

  _updateButtonsStyling(editorStylingMode?: EditorStyle): void {
    each(this.option('buttons'), (_, { options, name: buttonName }) => {
      if (options && !options.stylingMode && this.option('visible')) {
        const buttonInstance = this.getButton(buttonName);
        if (buttonInstance?.option) {
          buttonInstance.option('stylingMode', editorStylingMode === 'underlined' ? 'text' : 'contained');
        }
      }
    });
  }

  _renderValue(): DeferredObj<unknown> {
    const renderInputDeferred = this._renderInputValue();

    // @ts-expect-error DeferredObj typification
    const renderInputPromise = renderInputDeferred.promise() as DeferredObj<unknown>;

    return renderInputPromise;
  }

  _renderInputValue(value?: TProperties['value']): DeferredObj<unknown> {
    const {
      value: optionValue,
      text,
      displayValue,
      displayValueFormatter,
    } = this.option();

    const finalValue = value ?? optionValue;

    let textValue = text;

    if (displayValue !== undefined && finalValue !== null) {
      textValue = displayValueFormatter?.(displayValue);
    } else if (!isDefined(textValue)) {
      textValue = displayValueFormatter?.(finalValue);
    }

    this.option({ text: textValue });

    const inputElementValue = this._input().val() as string | undefined;

    // fallback to empty string is required to support WebKit native date picker in some basic
    // scenarios can not be covered by QUnit
    if (inputElementValue !== (isDefined(textValue) ? textValue : '')) {
      this._renderDisplayText(textValue);
    } else {
      this._toggleEmptinessEventHandler();
    }

    return Deferred().resolve();
  }

  _renderDisplayText(text: string | undefined): void {
    this._input().val(text);
    this._toggleEmptinessEventHandler();
  }

  _isValueValid(): boolean {
    if (this._input().length) {
      // @ts-expect-error Property 'validity' does not exist on type 'Element'
      const { validity } = this._input().get(0);

      if (validity) {
        return Boolean(validity.valid);
      }
    }

    return true;
  }

  _toggleEmptiness(isEmpty: boolean): void {
    this.$element().toggleClass(TEXTEDITOR_EMPTY_INPUT_CLASS, isEmpty);
    this._togglePlaceholder(isEmpty);
  }

  _togglePlaceholder(isEmpty: boolean): void {
    this.$element()
      .find(`.${TEXTEDITOR_PLACEHOLDER_CLASS}`)
      .eq(0)
      .toggleClass(STATE_INVISIBLE_CLASS, !isEmpty);
  }

  _renderProps(): void {
    this._toggleReadOnlyState();
    this._toggleSpellcheckState();
    this._toggleTabIndex();
  }

  _toggleDisabledState(value: boolean): void {
    super._toggleDisabledState(value);

    const $input = this._input();
    $input.prop('disabled', value);
  }

  _toggleTabIndex(): void {
    const $input = this._input();

    const { disabled, focusStateEnabled } = this.option();

    if (disabled || !focusStateEnabled) {
      $input.attr('tabIndex', -1);
    } else {
      $input.removeAttr('tabIndex');
    }
  }

  _toggleReadOnlyState(): void {
    this._input().prop('readOnly', this._readOnlyPropValue());
    super._toggleReadOnlyState();
  }

  _readOnlyPropValue(): boolean {
    const { readOnly } = this.option();

    return !!readOnly;
  }

  _toggleSpellcheckState(): void {
    const { spellcheck } = this.option();

    this._input().prop('spellcheck', Boolean(spellcheck));
  }

  _unobserveLabelContainerResize(): void {
    if (this._labelContainerElement) {
      resizeObserverSingleton.unobserve(this._labelContainerElement);

      this._labelContainerElement = null;
    }
  }

  _getLabelContainer(): dxElementWrapper {
    return this._input();
  }

  _getLabelContainerWidth(): number {
    return getWidth(this._getLabelContainer()) as number;
  }

  _getLabelBeforeWidth(): number {
    const buttonsBeforeWidth = this._$beforeButtonsContainer
      && getWidth(this._$beforeButtonsContainer) as number;

    return buttonsBeforeWidth ?? 0;
  }

  _updateLabelWidth(): void {
    this._label.updateBeforeWidth(this._getLabelBeforeWidth());
    this._label.updateMaxWidth(this._getLabelContainerWidth());
  }

  _getFieldElement(): dxElementWrapper {
    return this._getLabelContainer();
  }

  _setFieldAria(force?: boolean): void {
    const { inputAttr } = this.option();

    const ariaLabel = inputAttr?.['aria-label'];
    const labelId = this._label?.getId();

    const value = ariaLabel ? undefined : labelId;

    if (value || force) {
      const aria = {
        // eslint-disable-next-line spellcheck/spell-checker
        labelledby: value,
        label: ariaLabel,
      };
      this.setAria(aria, this._getFieldElement());
    }
  }

  _renderLabel(): void {
    this._unobserveLabelContainerResize();

    this._labelContainerElement = $(this._getLabelContainer()).get(0);

    const {
      label, labelMode, labelMark, rtlEnabled,
    } = this.option();

    const labelConfig = {
      rtlEnabled,
      $editor: this.$element(),
      text: label,
      mark: labelMark,
      mode: labelMode,
      containsButtonsBefore: !!this._$beforeButtonsContainer,
      getContainerWidth: (): number => this._getLabelContainerWidth(),
      getBeforeWidth: (): number => this._getLabelBeforeWidth(),
      onActiveHandler: (e: MouseEvent | PointerEvent): void => { e.stopPropagation(); },
      onClickHandler: (): void => { this.focus(); },
      onHoverHandler: (e: MouseEvent | PointerEvent): void => { e.stopPropagation(); },
    };

    this._label = new TextEditorLabelCreator(labelConfig);

    this._setFieldAria();

    if (this._labelContainerElement) { // NOTE: element can be not in DOM yet in React and Vue
      resizeObserverSingleton.observe(
        this._labelContainerElement,
        this._updateLabelWidth.bind(this),
      );
    }
  }

  _renderPlaceholder(): void {
    this._renderPlaceholderMarkup();
    this._attachPlaceholderEvents();
  }

  _renderPlaceholderMarkup(): void {
    if (this._$placeholder) {
      this._$placeholder.remove();
      this._$placeholder = null;
    }

    const $input = this._input();
    // There should be no destructuring, because of knockout limitations
    const placeholder = this.option('placeholder');

    const placeholderAttributes = {
      id: placeholder ? `dx-${new Guid()}` : undefined,
      'data-dx_placeholder': placeholder,
    };

    // @ts-expect-error attr typification
    this._$placeholder = $('<div>').attr(placeholderAttributes);
    this._$placeholder.insertAfter($input);
    this._$placeholder.addClass(TEXTEDITOR_PLACEHOLDER_CLASS);
  }

  _attachPlaceholderEvents(): void {
    // @ts-expect-error second argument
    const startEvent = addNamespace(pointerEvents.up, this.NAME);

    eventsEngine.on(this._$placeholder, startEvent, () => {
      // @ts-expect-error eventsEngine typification
      eventsEngine.trigger(this._input(), 'focus');
    });

    this._toggleEmptinessEventHandler();
  }

  _placeholder(): dxElementWrapper {
    return this._$placeholder ?? $();
  }

  _clearValueHandler(e: ValueChangedEvent & DxEvent): void {
    const $input = this._input();

    e.stopPropagation();

    this._saveValueChangeEvent(e);
    this._clearValue();

    if (!this._isFocused()) {
      // @ts-expect-error eventsEngine typification
      eventsEngine.trigger($input, 'focus');
    }

    // @ts-expect-error eventsEngine typification
    eventsEngine.trigger($input, 'input');
  }

  _clearValue(): void {
    this.clear();
  }

  _renderEvents(): void {
    const $input = this._input();

    EVENTS_LIST.forEach((event: string) => {
      const actionName = `on${event}`;
      const hasActionSubscription = this.hasActionSubscription(actionName as keyof TProperties);

      if (hasActionSubscription) {
        const action = this._createActionByOption(actionName as keyof TProperties, {
          excludeValidators: ['readOnly'],
        });

        // @ts-expect-error eventsEngine typification
        eventsEngine.on($input, addNamespace(event.toLowerCase(), this.NAME), (e) => {
          if (this._disposed) {
            return;
          }

          action({ event: e });
        });
      }
    });
  }

  _refreshEvents(): void {
    const $input = this._input();

    EVENTS_LIST.forEach((event: string) => {
      // @ts-expect-error second argument && eventsEngine typification
      eventsEngine.off($input, addNamespace(event.toLowerCase(), this.NAME));
    });

    this._renderEvents();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _keyPressHandler(e?: { originalEvent: InputEvent & KeyboardEvent }): void {
    this.option('text', this._input().val());
  }

  _keyDownHandler(e: KeyboardEvent): void {
    const $input = this._input();
    const isCtrlEnter = e.ctrlKey && normalizeKeyName(e) === 'enter';

    const { value } = this.option();

    const isNewValue = $input.val() !== value;

    if (isCtrlEnter && isNewValue) {
      // @ts-expect-error eventsEngine typification
      eventsEngine.trigger($input, 'change');
    }
  }

  _getValueChangeEventOptionName(): keyof TProperties {
    return 'valueChangeEvent';
  }

  _renderValueChangeEvent(): void {
    const valueChangeEventOptionName = this._getValueChangeEventOptionName();
    const { [valueChangeEventOptionName]: actionName } = this.option();

    const keyPressEvent = addNamespace(this._renderValueEventName(), `${this.NAME}TextChange`);
    const valueChangeEvent = addNamespace(actionName as string, `${this.NAME}ValueChange`);
    const keyDownEvent = addNamespace('keydown', `${this.NAME}TextChange`);

    const $input = this._input();

    eventsEngine.on($input, keyPressEvent, this._keyPressHandler.bind(this));
    eventsEngine.on($input, valueChangeEvent, this._valueChangeEventHandler.bind(this));
    eventsEngine.on($input, keyDownEvent, this._keyDownHandler.bind(this));
  }

  _cleanValueChangeEvent(): void {
    const valueChangeNamespace = `.${this.NAME}ValueChange`;
    const textChangeNamespace = `.${this.NAME}TextChange`;

    eventsEngine.off(this._input(), valueChangeNamespace);
    eventsEngine.off(this._input(), textChangeNamespace);
  }

  _refreshValueChangeEvent(): void {
    this._cleanValueChangeEvent();
    this._renderValueChangeEvent();
  }

  _renderValueEventName(): string {
    return 'input change keypress';
  }

  _focusTarget(): dxElementWrapper {
    return this._input();
  }

  _focusEventTarget(): dxElementWrapper {
    return this.$element();
  }

  _isInput(element: Element): boolean {
    return element === this._input().get(0);
  }

  _preventNestedFocusEvent(event: DxEvent): boolean {
    if (event.isDefaultPrevented()) {
      return true;
    }

    let shouldPrevent = this._isNestedTarget(
      (event as DxEvent & { relatedTarget: Element | dxElementWrapper; }).relatedTarget,
    );

    if (event.type === 'focusin') {
      shouldPrevent = shouldPrevent
        && this._isNestedTarget(event.target)
        && !this._isInput(event.target);
    } else if (!shouldPrevent) {
      this._toggleFocusClass(false, this.$element());
    }

    if (shouldPrevent) {
      event.preventDefault();
    }

    return shouldPrevent;
  }

  _isNestedTarget(target: Element | dxElementWrapper): boolean {
    return !!this.$element().find(target).length;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _focusClassTarget($element?: dxElementWrapper): dxElementWrapper {
    return this.$element();
  }

  _focusInHandler(event: DxEvent & {
    relatedTarget: Element | dxElementWrapper;
  }): void {
    this._preventNestedFocusEvent(event);

    super._focusInHandler(event);
  }

  _focusOutHandler(event: DxEvent): void {
    this._preventNestedFocusEvent(event);

    super._focusOutHandler(event);
  }

  _toggleFocusClass(isFocused: boolean, $element?: dxElementWrapper): void {
    super._toggleFocusClass(isFocused, this._focusClassTarget($element));
  }

  _hasFocusClass(element?: dxElementWrapper): boolean {
    return super._hasFocusClass($(element ?? this.$element()));
  }

  _renderEmptinessEvent(): void {
    const $input = this._input();

    eventsEngine.on($input, 'input blur', this._toggleEmptinessEventHandler.bind(this));
  }

  _toggleEmptinessEventHandler(): void {
    const text = this._input().val();

    const isEmpty = (text === '' || text === null) && this._isValueValid();

    this._toggleEmptiness(isEmpty);
  }

  _valueChangeEventHandler(e: ValueChangedEvent, formattedValue?: unknown): void {
    if (this.option('readOnly')) {
      return;
    }
    this._saveValueChangeEvent(e);
    this.option('value', arguments.length > 1 ? formattedValue : this._input().val());
    this._saveValueChangeEvent(undefined);
  }

  _renderEnterKeyAction(): void {
    this._enterKeyAction = this._createActionByOption('onEnterKey', {
      excludeValidators: ['readOnly'],
    });

    eventsEngine.off(this._input(), 'keyup.onEnterKey.dxTextEditor');
    eventsEngine.on(this._input(), 'keyup.onEnterKey.dxTextEditor', this._enterKeyHandlerUp.bind(this));
  }

  _enterKeyHandlerUp(e: DxEvent<KeyboardEvent>): void {
    if (this._disposed) {
      return;
    }

    if (normalizeKeyName(e) === 'enter') {
      this._enterKeyAction?.({ event: e });
    }
  }

  _updateValue(): void {
    this._options.silent('text', null);

    this._renderValue();
  }

  _dispose(): void {
    this._enterKeyAction = undefined;
    super._dispose();
  }

  _getSubmitElement(): dxElementWrapper {
    return this._input();
  }

  _hasActiveElement(): boolean {
    const input = this._input()[0];
    const activeElement = domAdapter.getActiveElement(input);

    // @ts-expect-error dxElementWrapper
    return this._input().is(activeElement);
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    const { name, fullName, value } = args;

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
        super._optionChanged(args);
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
        // @ts-expect-error ts-error
        this._input().attr({ placeholder: this._getPlaceholderAttr() });
        break;
      case 'label':
        // @ts-expect-error ts-error
        this._label.updateText(value ?? '');
        this._setFieldAria(true);
        break;
      case 'labelMark':
        // @ts-expect-error ts-error
        this._label.updateMark(value ?? '');
        break;
      case 'labelMode':
        this._label.updateMode(value as LabelMode);
        this._setFieldAria();
        break;
      case 'width':
        super._optionChanged(args);
        this._label.updateMaxWidth(this._getLabelContainerWidth());
        break;
      case 'readOnly':
      case 'disabled':
        this._updateButtons();
        super._optionChanged(args);
        break;
      case 'showClearButton':
        this._updateButtons(['clear']);
        break;
      case 'text':
        break;
      case 'value':
        this._updateValue();
        super._optionChanged(args);
        break;
      case 'inputAttr':
        this._applyInputAttributes(this._input(), this.option(name));
        break;
      case 'stylingMode':
        this._renderStylingMode();
        this._updateLabelWidth();
        break;
      case 'buttons': {
        if (fullName === name) {
          checkButtonsOptionType(value as TProperties['buttons']);
        }

        this._cleanButtonContainers();
        this._renderButtonContainers();

        const { stylingMode } = this.option();

        this._updateButtonsStyling(stylingMode);
        this._updateLabelWidth();
        this._label.updateContainsButtonsBefore(!!this._$beforeButtonsContainer);
        break;
      }
      case 'visible': {
        super._optionChanged(args);

        if (value && this.option('buttons')) {
          this._cleanButtonContainers();
          this._renderButtonContainers();
          const { stylingMode } = this.option();

          this._updateButtonsStyling(stylingMode);
        }

        break;
      }
      case 'displayValueFormatter':
        this._invalidate();
        break;
      case 'showValidationMark':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _renderInputType(): void {
    const { mode } = this.option();

    // B218621, B231875
    this._setInputType(mode);
  }

  _setInputType(type: string | undefined): void {
    const input = this._input();
    const defaultType = 'text';
    const typeValue = type === 'search' ? defaultType : type;

    try {
      input.prop('type', typeValue ?? defaultType);
    } catch (e) {
      input.prop('type', defaultType);
    }
  }

  getButton(name: string): dxButton | undefined | null {
    // @ts-expect-error TextEditorButtonCollection should use generic
    return this._buttonCollection.getButton(name);
  }

  focus(): void {
    // @ts-expect-error ts-error
    eventsEngine.trigger(this._input(), 'focus');
  }

  clear(): void {
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
  }

  _resetInputText(): void {
    this._options.silent('text', this._initialValue);

    this._renderValue();
  }

  _isValueEqualToInitial(): boolean {
    const { value } = this.option();
    const initialValue = this._initialValue;

    return value === initialValue;
  }

  _resetToInitialValue(): void {
    const shouldResetInputText = this._isValueEqualToInitial();
    if (shouldResetInputText) {
      this._resetInputText();
    } else {
      super._resetToInitialValue();
    }

    this._disposePendingIndicator();
    this._showValidMark = false;
    this._toggleValidMark();
  }

  _toggleValidMark(): void {
    this.$element().toggleClass(TEXTEDITOR_VALID_CLASS, !!this._showValidMark);
  }

  reset(value = undefined): void {
    if (arguments.length) {
      super.reset(value);
    } else {
      super.reset();
    }
  }

  on(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eventName: string | { [key: string]: any },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eventHandler?: any | undefined,
  ): this {
    const result = super.on(eventName, eventHandler);

    if (typeof eventName === 'string') {
      const event = eventName.charAt(0).toUpperCase() + eventName.substr(1);

      if (EVENTS_LIST.includes(event)) {
        this._refreshEvents();
      }
    }

    return result;
  }
}

/// #DEBUG
// @ts-expect-error ts-error
TextEditorBase.mockTextEditorLabel = (mock): void => {
  TextEditorLabelCreator = mock;
};
// @ts-expect-error ts-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
TextEditorBase.restoreTextEditorLabel = (mock): void => {
  TextEditorLabelCreator = TextEditorLabel;
};
/// #ENDDEBUG

export default TextEditorBase;
