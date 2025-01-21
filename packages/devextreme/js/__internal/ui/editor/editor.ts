import type { Position } from '@js/common';
import type { NativeEventInfo } from '@js/common/core/events';
import EventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace, normalizeKeyName } from '@js/common/core/events/utils/index';
import { data } from '@js/core/element_data';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import Callbacks from '@js/core/utils/callbacks';
import { extend } from '@js/core/utils/extend';
import { hasWindow } from '@js/core/utils/window';
import type { DxEvent } from '@js/events';
import type PublicEditor from '@js/ui/editor/editor';
import type {
  EditorOptions,
  ValueChangedInfo,
} from '@js/ui/editor/editor';
import ValidationEngine from '@js/ui/validation_engine';
import ValidationMessage from '@js/ui/validation_message';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

import domUtils from '../../core/utils/m_dom';

const INVALID_MESSAGE_AUTO = 'dx-invalid-message-auto';
const READONLY_STATE_CLASS = 'dx-state-readonly';
const INVALID_CLASS = 'dx-invalid';
const DX_INVALID_BADGE_CLASS = 'dx-show-invalid-badge';
const VALIDATION_TARGET = 'dx-validation-target';
const VALIDATION_STATUS_VALID = 'valid';
const VALIDATION_STATUS_INVALID = 'invalid';
const READONLY_NAMESPACE = 'editorReadOnly';

const ALLOWED_STYLING_MODES = ['outlined', 'filled', 'underlined'];

const VALIDATION_MESSAGE_KEYS_MAP = {
  validationMessageMode: 'mode',
  validationMessagePosition: 'positionSide',
  validationMessageOffset: 'offset',
  validationBoundary: 'boundary',
};

export type UnresolvedEvents = 'onContentReady' | 'onDisposing' | 'onInitialized' | 'onOptionChanged' | 'onValueChanged';
type ValueChangedEvent = NativeEventInfo<Editor> & ValueChangedInfo;

export interface EditorProperties<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TComponent extends PublicEditor<any> = PublicEditor,
> extends EditorOptions<TComponent> {
  validationMessageOffset: { h: number; v: number };
  validationBoundary?: dxElementWrapper;
  validationTooltipOptions: Record<string, unknown>;
  _showValidationMessage: boolean;
  name?: string;
  _onMarkupRendered?: () => void;
}

class Editor<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TProperties extends EditorProperties<any> = EditorProperties,
> extends Widget<TProperties> {
  _initialValue: unknown;

  public _validationMessage?: ValidationMessage;

  public validationRequest!: ReturnType<typeof Callbacks>;

  // eslint-disable-next-line no-restricted-globals
  public showValidationMessageTimeout?: ReturnType<typeof setTimeout>;

  private _valueChangeAction!: ((event?: Record<string, unknown>) => void);

  private _valueChangeActionSuppressed?: boolean;

  private _valueChangeEventInstance?: ValueChangedEvent;

  _$validationMessage?: dxElementWrapper;

  ctor(element: Element, options: TProperties): void {
    this.showValidationMessageTimeout = undefined;
    this.validationRequest = Callbacks();

    super.ctor(element, options);
  }

  _createElement(element: Element): void {
    super._createElement(element);
    const $element = this.$element();
    if ($element) {
      data($element[0], VALIDATION_TARGET, this);
    }
  }

  _initOptions(options: TProperties): void {
    super._initOptions(options);
    // @ts-expect-error ts-error
    this.option(ValidationEngine.initValidationOptions(options));
  }

  _init(): void {
    this._initialValue = this.option('value');
    super._init();

    const { validationTooltipOptions } = this.option();

    this._options.cache('validationTooltipOptions', validationTooltipOptions);
    const $element = this.$element();
    $element.addClass(DX_INVALID_BADGE_CLASS);
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      value: null,
      name: '',
      onValueChanged: null,
      readOnly: false,
      isValid: true,
      validationError: null,
      validationErrors: null,
      validationStatus: VALIDATION_STATUS_VALID,
      validationMessageMode: 'auto',
      validationMessagePosition: 'bottom',
      validationBoundary: undefined,
      validationMessageOffset: { h: 0, v: 0 },
      validationTooltipOptions: {},
      _showValidationMessage: true,
      isDirty: false,
    } as unknown as TProperties;
  }

  _attachKeyboardEvents(): void {
    if (!this.option('readOnly')) {
      super._attachKeyboardEvents();
    }
  }

  _setOptionsByReference(): void {
    super._setOptionsByReference();

    extend(this._optionsByReference, {
      validationError: true,
    });
  }

  _createValueChangeAction(): void {
    this._valueChangeAction = this._createActionByOption('onValueChanged', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _suppressValueChangeAction(): void {
    this._valueChangeActionSuppressed = true;
  }

  _resumeValueChangeAction(): void {
    this._valueChangeActionSuppressed = false;
  }

  _initMarkup(): void {
    this._toggleReadOnlyState();

    const { name, _onMarkupRendered: markupRendered } = this.option();

    this._setSubmitElementName(name);

    super._initMarkup();
    this._renderValidationState();

    markupRendered?.();
  }

  _raiseValueChangeAction(value: unknown, previousValue: unknown): void {
    if (!this._valueChangeAction) {
      this._createValueChangeAction();
    }
    this._valueChangeAction(this._valueChangeArgs(value, previousValue));
  }

  _valueChangeArgs(value: unknown, previousValue: unknown): {
    value: unknown;
    previousValue: unknown;
    event?: NativeEventInfo<Editor> & ValueChangedInfo;
  } {
    return {
      value,
      previousValue,
      event: this._valueChangeEventInstance,
    };
  }

  _saveValueChangeEvent(e: ValueChangedEvent | undefined): void {
    this._valueChangeEventInstance = e;
  }

  _focusInHandler(e: DxEvent): void {
    const { validationMessageMode } = this.option();
    const isValidationMessageShownOnFocus = validationMessageMode === 'auto';

    // NOTE: The click should be processed before the validation message is shown because
    // it can change the editor's value
    if (this._canValueBeChangedByClick() && isValidationMessageShownOnFocus) {
      // @ts-expect-error ts-error
      // NOTE: Prevent the validation message from showing
      const $validationMessageWrapper = this._validationMessage?.$wrapper();
      $validationMessageWrapper?.removeClass(INVALID_MESSAGE_AUTO);

      clearTimeout(this.showValidationMessageTimeout);

      // NOTE: Show the validation message after a click changes the value
      // eslint-disable-next-line no-restricted-globals
      this.showValidationMessageTimeout = setTimeout(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        () => $validationMessageWrapper?.addClass(INVALID_MESSAGE_AUTO),
        150,
      );
    }

    super._focusInHandler(e);
  }

  // eslint-disable-next-line class-methods-use-this
  _canValueBeChangedByClick(): boolean {
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  _getStylingModePrefix(): string {
    return 'dx-editor-';
  }

  _renderStylingMode(): void {
    const { stylingMode } = this.option();
    const prefix = this._getStylingModePrefix();

    const allowedStylingClasses = ALLOWED_STYLING_MODES.map((mode) => prefix + mode);

    allowedStylingClasses.forEach((className) => this.$element().removeClass(className));

    let stylingModeClass = prefix + String(stylingMode);

    if (!allowedStylingClasses.includes(stylingModeClass)) {
      const optionName = 'stylingMode';
      const defaultOptionValue = this._getDefaultOptions()[optionName];
      const platformOptionValue = this._convertRulesToOptions(
        this._defaultOptionsRules(),
      )[optionName];

      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      stylingModeClass = prefix + (platformOptionValue ?? defaultOptionValue);
    }

    this.$element().addClass(stylingModeClass);
  }

  _getValidationErrors(): unknown[] | undefined {
    let { validationErrors } = this.option();
    const { validationError } = this.option();

    if (!validationErrors && validationError) {
      validationErrors = [validationError];
    }
    return validationErrors;
  }

  _disposeValidationMessage(): void {
    if (this._$validationMessage) {
      this._$validationMessage.remove();
      this.setAria('describedby', null);
      this._$validationMessage = undefined;
      this._validationMessage = undefined;
    }
  }

  _toggleValidationClasses(isInvalid: boolean): void {
    this.$element().toggleClass(INVALID_CLASS, isInvalid);
    this.setAria(VALIDATION_STATUS_INVALID, isInvalid || undefined);
  }

  _renderValidationState(): void {
    const {
      validationStatus,
      _showValidationMessage: showValidationMessage,
    } = this.option();
    const isValid = this.option('isValid') && validationStatus !== VALIDATION_STATUS_INVALID;
    const validationErrors = this._getValidationErrors();
    const $element = this.$element();

    this._toggleValidationClasses(!isValid);

    if (!hasWindow() || !showValidationMessage) {
      return;
    }

    this._disposeValidationMessage();
    if (!isValid && validationErrors) {
      const {
        validationMessageMode,
        validationMessageOffset,
        validationBoundary,
        rtlEnabled,
      } = this.option();

      this._$validationMessage = $('<div>').appendTo($element);
      const validationMessageContentId = `dx-${new Guid()}`;
      this.setAria('describedby', validationMessageContentId);

      // @ts-expect-error ts-error
      this._validationMessage = new ValidationMessage(this._$validationMessage, extend({
        validationErrors,
        rtlEnabled,
        target: this._getValidationMessageTarget(),
        visualContainer: $element,
        mode: validationMessageMode,
        positionSide: this._getValidationMessagePosition(),
        offset: validationMessageOffset,
        boundary: validationBoundary,
        contentId: validationMessageContentId,
      }, this._options.cache('validationTooltipOptions')));
      this._bindInnerWidgetOptions(this._validationMessage, 'validationTooltipOptions');
    }
  }

  _getValidationMessagePosition(): Position | undefined {
    const { validationMessagePosition } = this.option();
    return validationMessagePosition;
  }

  _getValidationMessageTarget(): dxElementWrapper {
    return this.$element();
  }

  _toggleReadOnlyState(): void {
    const { readOnly } = this.option();

    this._toggleBackspaceHandler(readOnly);
    this.$element().toggleClass(READONLY_STATE_CLASS, !!readOnly);
    this._setAriaReadonly(readOnly);
  }

  _setAriaReadonly(readOnly: boolean | undefined): void {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this.setAria('readonly', readOnly || undefined);
  }

  _toggleBackspaceHandler(isReadOnly: boolean | undefined): void {
    const $eventTarget = this._keyboardEventBindingTarget();
    const eventName = addNamespace('keydown', READONLY_NAMESPACE);

    EventsEngine.off($eventTarget, eventName);

    if (isReadOnly) {
      EventsEngine.on($eventTarget, eventName, (e) => {
        if (normalizeKeyName(e) === 'backspace') {
          e.preventDefault();
        }
      });
    }
  }

  _dispose(): void {
    const element = this.$element()[0];

    data(element, VALIDATION_TARGET, null);
    clearTimeout(this.showValidationMessageTimeout);
    this._disposeValidationMessage();
    super._dispose();
  }

  _setSubmitElementName(name: string | undefined): void {
    const $submitElement = this._getSubmitElement();

    if (!$submitElement) {
      return;
    }

    if (name && name.length > 0) {
      $submitElement.attr('name', name);
    } else {
      $submitElement.removeAttr('name');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _getSubmitElement(): dxElementWrapper | null {
    return null;
  }

  _setValidationMessageOption({
    name,
    value,
  }: OptionChanged<TProperties> | Record<string, unknown>): void {
    const optionKey = VALIDATION_MESSAGE_KEYS_MAP[String(name)]
      ? VALIDATION_MESSAGE_KEYS_MAP[String(name)]
      : name;
    this._validationMessage?.option(optionKey, value);
  }

  // eslint-disable-next-line class-methods-use-this
  _hasActiveElement(): boolean {
    return false;
  }

  _optionChanged(args: OptionChanged<TProperties> | Record<string, unknown>): void {
    const { name, value, previousValue } = args;

    switch (name) {
      case 'onValueChanged':
        this._createValueChangeAction();
        break;
      case 'readOnly':
        this._toggleReadOnlyState();
        this._refreshFocusState();
        break;
      case 'value':
        if (value != previousValue) { // eslint-disable-line eqeqeq
          this.option('isDirty', this._initialValue !== value);

          this.validationRequest.fire({
            value,
            editor: this,
          });
        }
        if (!this._valueChangeActionSuppressed) {
          this._raiseValueChangeAction(value, previousValue);
          this._saveValueChangeEvent(undefined);
        }
        break;
      case 'width':
        super._optionChanged(args);
        // @ts-expect-error ts-error
        this._validationMessage?.updateMaxWidth();
        break;
      case 'name':
        this._setSubmitElementName(value as EditorProperties[typeof name]);
        break;
      case 'isValid':
      case 'validationError':
      case 'validationErrors':
      case 'validationStatus':
        // @ts-expect-error ts-error
        this.option(ValidationEngine.synchronizeValidationOptions(args, this.option()));
        this._renderValidationState();
        break;
      case 'validationBoundary':
      case 'validationMessageMode':
      case 'validationMessagePosition':
      case 'validationMessageOffset':
        this._setValidationMessageOption(args);
        break;
      case 'rtlEnabled':
        this._setValidationMessageOption(args);
        super._optionChanged(args);
        break;
      case 'validationTooltipOptions':
        this._innerWidgetOptionChanged(this._validationMessage, args);
        break;
      case '_showValidationMessage':
      case 'isDirty':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _resetToInitialValue(): void {
    this.option('value', this._initialValue);
  }

  blur(): void {
    if (this._hasActiveElement()) {
      domUtils.resetActiveElement();
    }
  }

  clear(): void {
    const defaultOptions = this._getDefaultOptions();
    this.option('value', defaultOptions.value);
  }

  reset(value = undefined): void {
    if (arguments.length) {
      this._initialValue = value;
    }

    this._resetToInitialValue();
    this.option('isDirty', false);
    this.option('isValid', true);
  }
}

// @ts-expect-error ts-error
Editor.isEditor = (instance): boolean => instance instanceof Editor;
export default Editor;
