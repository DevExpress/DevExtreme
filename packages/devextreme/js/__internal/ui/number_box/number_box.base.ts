import eventsEngine from '@js/common/core/events/core/events_engine';
import {
  addNamespace, getChar, isCommandKeyPressed, normalizeKeyName,
} from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import numberLocalization from '@js/common/core/localization/number';
import devices from '@js/core/devices';
import domAdapter from '@js/core/dom_adapter';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import {
  // @ts-expect-error ts-error
  applyServerDecimalSeparator,
} from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { fitIntoRange, inRange } from '@js/core/utils/math';
import { isDefined } from '@js/core/utils/type';
import type { DxEvent, InteractionEvent } from '@js/events';
import type { Format } from '@js/localization';
import { getGlobalFormatByDataType } from '@ts/core/global_format_config';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';
import type { DxMouseWheelEvent } from '@ts/ui/scroll_view/types';
import TextEditor from '@ts/ui/text_box/text_editor';

import type { TextEditorBaseProperties } from '../text_box/text_editor.base';
import type { TextEditorButtonInfo } from '../text_box/texteditor_button_collection/index';
import type { SpinChangeEvent } from './number_box.spin';
import SpinButtons from './number_box.spins';

export const WIDGET_CLASS = 'dx-numberbox';
const FIREFOX_CONTROL_KEYS = ['tab', 'del', 'backspace', 'leftArrow', 'rightArrow', 'home', 'end', 'enter'];

const FORCE_VALUECHANGE_EVENT_NAMESPACE = 'NumberBoxForceValueChange';

export type NumberBoxValue = number | null | undefined;

export type SpinValueChangeEvent = DxEvent<InteractionEvent> | DxMouseWheelEvent;

export type KeyPressEvent = DxEvent<KeyboardEvent> & {
  originalEvent: InputEvent & KeyboardEvent;
};

const getSpinEvent = (
  e: SpinChangeEvent | DxEvent<InteractionEvent>,
): SpinValueChangeEvent => ('event' in e ? e.event : e);

export interface NumberBoxBaseProperties extends TextEditorBaseProperties {
  min?: number;
  max?: number;
  step?: number;
  showSpinButtons?: boolean;
  useLargeSpinButtons?: boolean;
  invalidValueMessage?: string;
  format?: Format;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayValueFormatter?: ((value: any) => string);
}

class NumberBoxBase<
  TProperties extends NumberBoxBaseProperties = NumberBoxBaseProperties,
> extends TextEditor<TProperties> {
  _keyPressed?: boolean;

  _$submitElement!: dxElementWrapper;

  _supportedKeys(): SupportedKeys {
    return {
      ...super._supportedKeys(),
      upArrow: (e): void => {
        if (!isCommandKeyPressed(e)) {
          e.preventDefault();
          e.stopPropagation();
          this._spinUpChangeHandler(e);
        }
      },
      downArrow: (e): void => {
        if (!isCommandKeyPressed(e)) {
          e.preventDefault();
          e.stopPropagation();
          this._spinDownChangeHandler(e);
        }
      },
      enter: (): void => {},
    };
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      value: 0,
      min: undefined,
      max: undefined,
      step: 1,
      showSpinButtons: false,
      useLargeSpinButtons: true,
      mode: 'text',
      invalidValueMessage: messageLocalization.format('dxNumberBox-invalidValueMessage'),
      buttons: undefined,
    };
  }

  _useTemplates(): boolean {
    return false;
  }

  _getDefaultButtons(): TextEditorButtonInfo[] {
    // @ts-expect-error ts-error
    return super._getDefaultButtons().concat([{ name: 'spins', Ctor: SpinButtons }]);
  }

  _isSupportInputMode(): boolean {
    const version = parseFloat(browser.version ?? '');

    const isSupportedChrome = !!browser.chrome && version >= 66;
    const isSupportedSafari = !!browser.safari && version >= 12;

    return isSupportedChrome || isSupportedSafari;
  }

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    // @ts-expect-error ts-error
    return super._defaultOptionsRules().concat([
      {
        device: (): boolean => !!devices.real().generic && !devices.isSimulator(),
        options: {
          useLargeSpinButtons: false,
        },
      },
      {
        device: (): boolean => devices.real().deviceType !== 'desktop'
          && !this._isSupportInputMode(),
        options: {
          mode: 'number',
        },
      },
    ]);
  }

  _initMarkup(): void {
    this._renderSubmitElement();
    this.$element().addClass(WIDGET_CLASS);

    super._initMarkup();
    this._toggleTabIndex();
  }

  _getDefaultAttributes(): ReturnType<TextEditor<TProperties>['_getDefaultAttributes']> {
    const attributes = super._getDefaultAttributes();
    // eslint-disable-next-line spellcheck/spell-checker
    attributes.inputmode = 'decimal';
    return attributes;
  }

  _renderContentImpl(): void {
    const { isValid, value } = this.option();

    if (isValid) {
      this._validateValue(value);
    }

    this.setAria('role', 'spinbutton');
  }

  _renderSubmitElement(): void {
    const { value } = this.option();

    this._$submitElement = $('<input>')
      .attr('type', 'hidden')
      .appendTo(this.$element());
    this._setSubmitValue(value);
  }

  _setSubmitValue(value: NumberBoxValue): void {
    this._getSubmitElement().val(applyServerDecimalSeparator(value));
  }

  _getSubmitElement(): dxElementWrapper {
    return this._$submitElement;
  }

  _keyPressHandler(e: KeyPressEvent): void {
    super._keyPressHandler();

    const char = getChar(e);
    const validCharRegExp = /[\d.,eE\-+]/;
    const isInputCharValid = validCharRegExp.test(char);

    if (!isInputCharValid) {
      const keyName = normalizeKeyName(e);
      // NOTE: Additional check for Firefox control keys
      if (isCommandKeyPressed(e) || (keyName && FIREFOX_CONTROL_KEYS.includes(keyName))) {
        return;
      }

      e.preventDefault();
      return;
    }

    this._keyPressed = true;
  }

  _hasMouseWheelHandler(): boolean {
    return true;
  }

  _onMouseWheel(e: DxMouseWheelEvent): void {
    this._spinValueChange(e.delta > 0 ? 1 : -1, e);
  }

  _renderValue(): DeferredObj<unknown> {
    const inputValue = this._input().val();
    const { value } = this.option();

    if (!inputValue.length || Number(inputValue) !== value) {
      this._forceValueRender();
      this._toggleEmptinessEventHandler();
    }

    const valueText = isDefined(value) ? null : messageLocalization.format('dxNumberBox-noDataText');

    this.setAria({
      // eslint-disable-next-line spellcheck/spell-checker
      valuenow: value ?? '',
      // eslint-disable-next-line spellcheck/spell-checker
      valuetext: valueText,
    });

    this.option('text', this._input().val());
    this._updateButtons();

    return Deferred().resolve();
  }

  _forceValueRender(): void {
    const { value } = this.option();
    const formattedValue = isNaN(Number(value))
      ? ''
      : this._applyDisplayValueFormatter(value);

    this._renderDisplayText(formattedValue);
  }

  _applyDisplayValueFormatter(value: NumberBoxValue): string | undefined {
    const { format, displayValueFormatter } = this.option();

    if (!format) {
      const globalNumberFormat = getGlobalFormatByDataType('number');

      if (globalNumberFormat) {
        return numberLocalization.format(
          Number(value),
          globalNumberFormat,
        ) as string;
      }
    }

    return displayValueFormatter?.(value);
  }

  _renderProps(): void {
    const { min, max, step } = this.option();

    // @ts-expect-error ts-error
    this._input().prop({ min, max, step });

    this.setAria({
      // eslint-disable-next-line spellcheck/spell-checker
      valuemin: min ?? '',
      // eslint-disable-next-line spellcheck/spell-checker
      valuemax: max ?? '',
    });
  }

  _spinButtonsPointerDownHandler(): void {
    const { useLargeSpinButtons } = this.option();
    const $input = this._input();

    if (!useLargeSpinButtons && domAdapter.getActiveElement() !== $input[0]) {
      // @ts-expect-error ts-error
      eventsEngine.trigger($input, 'focus');
    }
  }

  _spinUpChangeHandler(e: SpinChangeEvent | DxEvent<InteractionEvent>): void {
    const { readOnly } = this.option();

    if (!readOnly) {
      this._spinValueChange(1, getSpinEvent(e));
    }
  }

  _spinDownChangeHandler(e: SpinChangeEvent | DxEvent<InteractionEvent>): void {
    const { readOnly } = this.option();

    if (!readOnly) {
      this._spinValueChange(-1, getSpinEvent(e));
    }
  }

  _spinValueChange(sign: number, dxEvent?: SpinValueChangeEvent): void {
    const { step: stepOption, min, max } = this.option();
    const step = parseFloat(String(stepOption));

    if (step === 0) {
      return;
    }

    let value = parseFloat(String(this._normalizeInputValue())) || 0;

    value = this._correctRounding(value, step * sign);

    if (isDefined(min)) {
      value = Math.max(min, value);
    }

    if (isDefined(max)) {
      value = Math.min(max, value);
    }

    this._saveValueChangeEvent(dxEvent);
    this.option('value', value);
  }

  _correctRounding(value: number, step: number): number {
    const regex = /[,.](.*)/;
    const valueText = String(value);
    const stepText = String(step);
    const isFloatValue = regex.test(valueText);
    const isFloatStep = regex.test(stepText);

    if (isFloatValue || isFloatStep) {
      const valueAccuracy = isFloatValue ? regex.exec(valueText)?.[0].length ?? 0 : 0;
      const stepAccuracy = isFloatStep ? regex.exec(stepText)?.[0].length ?? 0 : 0;
      const accuracy = Math.max(valueAccuracy, stepAccuracy);

      return this._round(value + step, accuracy);
    }

    return value + step;
  }

  _round(value: number, precision = 0): number {
    const multiplier = 10 ** precision;

    return Math.round(value * multiplier) / multiplier;
  }

  _renderValueChangeEvent(): void {
    super._renderValueChangeEvent();

    const forceValueChangeEvent = addNamespace('focusout', FORCE_VALUECHANGE_EVENT_NAMESPACE);
    eventsEngine.off(this.element(), forceValueChangeEvent);
    eventsEngine.on(this.element(), forceValueChangeEvent, this._forceRefreshInputValue.bind(this));
  }

  _forceRefreshInputValue(): void {
    const { mode, value } = this.option();

    if (mode === 'number') {
      return;
    }

    const $input = this._input();
    const formattedValue = this._applyDisplayValueFormatter(value);
    // @ts-expect-error ts-error
    $input.val(null);
    $input.val(formattedValue);
  }

  _valueChangeEventHandler(e: DxEvent): void {
    const $input = this._input();
    const inputValue = this._normalizeText();
    const value = this._parseValue(inputValue);
    const valueHasDigits = inputValue !== '.' && inputValue !== '-';

    if (this._isValueValid() && !this._validateValue(value)) {
      $input.val(this._applyDisplayValueFormatter(value));
      return;
    }

    if (valueHasDigits) {
      super._valueChangeEventHandler(e, isNaN(Number(value)) ? null : value);
    }

    this._applyValueBoundaries(inputValue, value);

    this.validationRequest.fire({
      value,
      editor: this,
    });
  }

  _applyValueBoundaries(inputValue: string, parsedValue: NumberBoxValue): void {
    const isValueIncomplete = this._isValueIncomplete(inputValue);
    const isValueCorrect = this._isValueInRange(inputValue);

    if (!isValueIncomplete && !isValueCorrect && parsedValue !== null) {
      if (Number(inputValue) !== parsedValue) {
        this._input().val(this._applyDisplayValueFormatter(parsedValue));
      }
    }
  }

  _replaceCommaWithPoint(value: string): string {
    return value.replace(',', '.');
  }

  _inputIsInvalid(): boolean {
    const { mode } = this.option();
    const isNumberMode = mode === 'number';
    const input = this._input().get(0) as HTMLInputElement | undefined;

    return isNumberMode && !!input?.validity.badInput;
  }

  _renderDisplayText(text: string | undefined): void {
    if (this._inputIsInvalid()) {
      return;
    }

    super._renderDisplayText(text);
  }

  _isValueIncomplete(value: string): boolean {
    const incompleteRegex = /(^-$)|(^-?\d*\.$)|(\d+e-?$)/i;
    return incompleteRegex.test(value);
  }

  _isValueInRange(value: string | NumberBoxValue): boolean {
    const { min, max } = this.option();

    return inRange(value, min, max);
  }

  _isNumber(value: string): boolean {
    return this._parseValue(value) !== null;
  }

  _validateValue(value?: NumberBoxValue): boolean {
    const { invalidValueMessage } = this.option();
    const inputValue = this._normalizeText();
    const isValueValid = this._isValueValid();
    let isValid = true;
    const isNumber = this._isNumber(inputValue);

    if (isNaN(Number(value))) {
      isValid = false;
    }

    if (!value && isValueValid) {
      isValid = true;
    } else if (!isNumber && !isValueValid) {
      isValid = false;
    }

    this.option({
      isValid,
      validationError: isValid ? null : {
        editorSpecific: true,
        message: invalidValueMessage,
      },
    });

    return isValid;
  }

  _normalizeInputValue(): NumberBoxValue {
    return this._parseValue(this._normalizeText());
  }

  _normalizeText(): string {
    const value = this._input().val().trim();

    return this._replaceCommaWithPoint(value);
  }

  _parseValue(value?: string | NumberBoxValue): NumberBoxValue {
    const { min, max } = this.option();
    const parsedValue = parseFloat(String(value ?? ''));

    if (isNaN(parsedValue)) {
      return null;
    }

    return fitIntoRange(parsedValue, min, max);
  }

  _clearValue(): void {
    if (this._inputIsInvalid()) {
      this._input().val('');
      this._validateValue();
    }
    super._clearValue();
  }

  clear(): void {
    const { value } = this.option();

    if (value === null) {
      this.option('text', '');
      if (this._input().length) {
        this._renderValue();
      }
    } else {
      this.option('value', null);
    }
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    switch (args.name) {
      case 'value': {
        const value = args.value as NumberBoxValue;

        this._validateValue(value);
        this._setSubmitValue(value);
        super._optionChanged(args);
        this._resumeValueChangeAction();
        break;
      }
      case 'step':
        this._renderProps();
        break;
      case 'min':
      case 'max': {
        const { value } = this.option();

        this._renderProps();
        this.option('value', this._parseValue(value));
        break;
      }
      case 'showSpinButtons':
      case 'useLargeSpinButtons':
        this._updateButtons(['spins']);
        break;
      case 'invalidValueMessage':
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default NumberBoxBase;
