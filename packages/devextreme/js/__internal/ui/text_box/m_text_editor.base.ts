import type { EditorStyle, LabelMode } from '@js/common';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace, normalizeKeyName } from '@js/common/core/events/utils/index';
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
  'KeyDown', 'KeyPress', 'KeyUp',
  'Change', 'Cut', 'Copy', 'Paste', 'Input',
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

function checkButtonsOptionType(buttons): void {
  if (isDefined(buttons) && !Array.isArray(buttons)) {
    throw errors.Error('E1053');
  }
}

export interface TextEditorBaseProperties extends dxTextEditorOptions<TextEditorBase> {
  displayValueFormatter?: ((value: string | any[]) => string);

  labelMode?: LabelMode;

  labelMark?: string;

  showValidationMark?: boolean;

  mode?: string;

  displayValue?: string;
}

class TextEditorBase<
  TProperties extends TextEditorBaseProperties = TextEditorBaseProperties,
> extends Editor<TProperties> {
  _showValidMark?: boolean;

  _$textEditorContainer!: dxElementWrapper;

  _$textEditorInputContainer!: dxElementWrapper;

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
    // @ts-expect-error
    this._buttonCollection = new TextEditorButtonCollection(this, this._getDefaultButtons());

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
      displayValueFormatter(value): string {
        // @ts-expect-error ts-error
        return isDefined(value) && value !== false ? value : '';
      },
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      stylingMode: config().editorStylingMode || 'outlined',
      showValidationMark: true,
      label: '',
      labelMode: 'static',
      labelMark: '',
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    // @ts-expect-error
    return super._defaultOptionsRules().concat([
      {
        device(): boolean {
          const themeName = current();
          return isMaterial(themeName);
        },
        options: {
          labelMode: 'floating',
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          stylingMode: config().editorStylingMode || 'filled',
        },
      },
      {
        device(): boolean {
          const themeName = current();
          return isFluent(themeName);
        },
        options: {
          labelMode: 'outside',
        },
      },
    ]);
  }

  // eslint-disable-next-line class-methods-use-this
  _getDefaultButtons(): TextEditorButtonInfo[] {
    // @ts-expect-error ts-error
    return [{ name: 'clear', Ctor: ClearButton }];
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

  // eslint-disable-next-line class-methods-use-this
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

  _getInputContainer(): dxElementWrapper {
    return this._$textEditorInputContainer;
  }

  _renderPendingIndicator(): void {
    this.$element().addClass(TEXTEDITOR_VALIDATION_PENDING_CLASS);
    const $inputContainer = this._getInputContainer();
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

    // @ts-expect-error ts-error
    const isPending = this.option('validationStatus') === 'pending';

    if (isPending) {
      if (!this._pendingIndicator) {
        this._renderPendingIndicator();
      }
      this._showValidMark = false;
    } else {
      // @ts-expect-error ts-error
      if (this.option('validationStatus') === 'invalid') {
        this._showValidMark = false;
      }
      // @ts-expect-error ts-error
      if (!this._showValidMark && this.option('showValidationMark') === true) {
        // @ts-expect-error ts-error
        this._showValidMark = this.option('validationStatus') === 'valid' && !!this._pendingIndicator;
      }
      this._disposePendingIndicator();
    }

    this._toggleValidMark();
  }

  _getButtonsContainer(): dxElementWrapper {
    return this._$textEditorContainer;
  }

  _renderButtonContainers(): void {
    const { buttons } = this.option();

    const $buttonsContainer = this._getButtonsContainer();
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
    // @ts-expect-error _$textEditorContainer can be null and undefined
    this._$textEditorContainer = null;
    // @ts-expect-error _$textEditorInputContainer can be null and undefined
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

    // @ts-expect-error ts-error
    $input.attr(inputAttributes).addClass(TEXTEDITOR_INPUT_CLASS);

    this._setInputMinHeight($input);
  }

  _setInputMinHeight($input: dxElementWrapper): void {
    $input.css('minHeight', this.option('height') ? '0' : '');
  }

  _getPlaceholderAttr(): string | null {
    const {
      ios,
      // @ts-expect-error ts-error
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
    const renderInputPromise = this._renderInputValue();
    // @ts-expect-error ts-error
    return renderInputPromise.promise();
  }

  _renderInputValue(value?): DeferredObj<unknown> {
    value = value ?? this.option('value');

    const { text, displayValue, displayValueFormatter } = this.option();

    let textValue = text;
    if (displayValue !== undefined && value !== null) {
      textValue = displayValueFormatter?.(displayValue);
    } else if (!isDefined(textValue)) {
      textValue = displayValueFormatter?.(value);
    }

    this.option('text', textValue);

    // fallback to empty string is required to support WebKit native date picker in some basic scenarios
    // can not be covered by QUnit
    // @ts-expect-error @ts-error
    if (this._input().val() !== (isDefined(textValue) ? textValue : '')) {
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
      // @ts-expect-error ts-error
      const { validity } = this._input().get(0);

      if (validity) {
        return validity.valid;
      }
    }

    return true;
  }

  _toggleEmptiness(isEmpty): void {
    this.$element().toggleClass(TEXTEDITOR_EMPTY_INPUT_CLASS, isEmpty);
    this._togglePlaceholder(isEmpty);
  }

  _togglePlaceholder(isEmpty): void {
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
    const disabled = this.option('disabled');
    const focusStateEnabled = this.option('focusStateEnabled');

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
    // @ts-expect-error ts-error
    this._input().prop('spellcheck', spellcheck);
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
    const inputAttr = this.option('inputAttr');
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
      onClickHandler: (): void => {
        this.focus();
      },
      onHoverHandler: (e: MouseEvent | PointerEvent): void => { e.stopPropagation(); },
      onActiveHandler: (e: MouseEvent | PointerEvent): void => { e.stopPropagation(); },
      $editor: this.$element(),
      text: label,
      mark: labelMark,
      mode: labelMode,
      rtlEnabled,
      containsButtonsBefore: !!this._$beforeButtonsContainer,
      getContainerWidth: (): number => this._getLabelContainerWidth(),
      getBeforeWidth: (): number => this._getLabelBeforeWidth(),
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
    const placeholder = this.option('placeholder');
    const placeholderAttributes = {
      id: placeholder ? `dx-${new Guid()}` : undefined,
      'data-dx_placeholder': placeholder,
    };

    const $placeholder = this._$placeholder = $('<div>')
      // @ts-expect-error ts-error
      .attr(placeholderAttributes);

    $placeholder.insertAfter($input);
    $placeholder.addClass(TEXTEDITOR_PLACEHOLDER_CLASS);
  }

  _attachPlaceholderEvents(): void {
    // @ts-expect-error ts-error
    const startEvent = addNamespace(pointerEvents.up, this.NAME);

    eventsEngine.on(this._$placeholder, startEvent, () => {
      // @ts-expect-error ts-error
      eventsEngine.trigger(this._input(), 'focus');
    });
    this._toggleEmptinessEventHandler();
  }

  _placeholder(): dxElementWrapper {
    return this._$placeholder ?? $();
  }

  _clearValueHandler(e): void {
    const $input = this._input();
    e.stopPropagation();

    this._saveValueChangeEvent(e);
    this._clearValue();

    if (!this._isFocused()) {
      // @ts-expect-error ts-error
      eventsEngine.trigger($input, 'focus');
    }
    // @ts-expect-error ts-error
    eventsEngine.trigger($input, 'input');
  }

  _clearValue(): void {
    this.clear();
  }

  _renderEvents(): void {
    const $input = this._input();

    each(EVENTS_LIST, (_, event) => {
      // @ts-expect-error
      if (this.hasActionSubscription(`on${event}`)) {
        // @ts-expect-error
        const action = this._createActionByOption(`on${event}`, { excludeValidators: ['readOnly'] });
        // @ts-expect-error ts-error
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

    each(EVENTS_LIST, (_, event) => {
      // @ts-expect-error ts-error
      eventsEngine.off($input, addNamespace(event.toLowerCase(), this.NAME));
    });

    this._renderEvents();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _keyPressHandler(e?): void {
    this.option('text', this._input().val());
  }

  _keyDownHandler(e): void {
    const $input = this._input();
    const isCtrlEnter = e.ctrlKey && normalizeKeyName(e) === 'enter';
    const { value } = this.option();

    const isNewValue = $input.val() !== value;

    if (isCtrlEnter && isNewValue) {
      // @ts-expect-error ts-error
      eventsEngine.trigger($input, 'change');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _getValueChangeEventOptionName(): string {
    return 'valueChangeEvent';
  }

  _renderValueChangeEvent(): void {
    const keyPressEvent = addNamespace(this._renderValueEventName(), `${this.NAME}TextChange`);
    // @ts-expect-error ts-error
    const valueChangeEvent = addNamespace(this.option(this._getValueChangeEventOptionName()), `${this.NAME}ValueChange`);
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

  // eslint-disable-next-line class-methods-use-this
  _renderValueEventName(): string {
    return 'input change keypress';
  }

  _focusTarget(): dxElementWrapper {
    return this._input();
  }

  // @ts-expect-error ts-error
  _focusEventTarget() {
    return this.element();
  }

  _isInput(element: Element): boolean {
    return element === this._input().get(0);
  }

  _preventNestedFocusEvent(event: DxEvent): boolean {
    if (event.isDefaultPrevented()) {
      return true;
    }
    // @ts-expect-error ts-error
    let shouldPrevent = this._isNestedTarget(event.relatedTarget);

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

  _focusInHandler(event: DxEvent): void {
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

  _hasFocusClass(element: dxElementWrapper): boolean {
    return super._hasFocusClass($(element || this.$element()));
  }

  _renderEmptinessEvent(): void {
    const $input = this._input();

    eventsEngine.on($input, 'input blur', this._toggleEmptinessEventHandler.bind(this));
  }

  _toggleEmptinessEventHandler(): void {
    const text = this._input().val();
    // @ts-expect-error ts-error
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

  _enterKeyHandlerUp(e): void {
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
    // @ts-expect-error ts-error
    return this._input().is(domAdapter.getActiveElement(this._input()[0]));
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
          checkButtonsOptionType(value);
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
    // B218621, B231875
    this._setInputType(this.option('mode'));
  }

  _setInputType(type): void {
    const input = this._input();

    if (type === 'search') {
      type = 'text';
    }

    try {
      input.prop('type', type);
    } catch (e) {
      input.prop('type', 'text');
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

  on(eventName: string | { [key: string]: any }, eventHandler?: any): this {
    const result = super.on(eventName, eventHandler);
    const event = eventName.charAt(0).toUpperCase() + eventName.substr(1);

    if (EVENTS_LIST.includes(event)) {
      this._refreshEvents();
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
