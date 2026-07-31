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
  ensureDefined,
} from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import { fitIntoRange, inRange } from '@js/core/utils/math';
import { isDefined } from '@js/core/utils/type';
import { getGlobalFormatByDataType } from '@ts/core/m_global_format_config';
import TextEditor from '@ts/ui/text_box/text_editor';

import type { TextEditorBaseProperties } from '../text_box/text_editor.base';
import type { TextEditorButtonInfo } from '../text_box/texteditor_button_collection/index';
import SpinButtons from './m_number_box.spins';

const math = Math;

export const WIDGET_CLASS = 'dx-numberbox';
const FIREFOX_CONTROL_KEYS = ['tab', 'del', 'backspace', 'leftArrow', 'rightArrow', 'home', 'end', 'enter'];

const FORCE_VALUECHANGE_EVENT_NAMESPACE = 'NumberBoxForceValueChange';

export interface NumberBoxBaseProperties extends TextEditorBaseProperties {
  min?: number;
  max?: number;
  step?: number;
  showSpinButtons?: boolean;
  useLargeSpinButtons?: boolean;
  invalidValueMessage?: string;
}

class NumberBoxBase<
  TProperties extends NumberBoxBaseProperties = NumberBoxBaseProperties,
> extends TextEditor<TProperties> {
  _keyPressed?: boolean;

  _$submitElement!: dxElementWrapper;

  _supportedKeys(): Record<string, (e: KeyboardEvent) => void> {
    return {
      ...super._supportedKeys(),
      upArrow(e): void {
        if (!isCommandKeyPressed(e)) {
          e.preventDefault();
          e.stopPropagation();
          this._spinUpChangeHandler(e);
        }
      },
      downArrow(e): void {
        if (!isCommandKeyPressed(e)) {
          e.preventDefault();
          e.stopPropagation();
          this._spinDownChangeHandler(e);
        }
      },
      enter(): void {},
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
      // eslint-disable-next-line no-void
      buttons: void 0,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  _useTemplates(): boolean {
    return false;
  }

  _getDefaultButtons(): TextEditorButtonInfo[] {
    // @ts-expect-error ts-error
    return super._getDefaultButtons().concat([{ name: 'spins', Ctor: SpinButtons }]);
  }

  _isSupportInputMode() {
    // @ts-expect-error ts-error
    const version = parseFloat(browser.version);

    return (
      browser.chrome && version >= 66
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        || browser.safari && version >= 12
    );
  }

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    // @ts-expect-error ts-error
    return super._defaultOptionsRules().concat([
      {
        device() {
          return devices.real().generic && !devices.isSimulator();
        },
        options: {
          useLargeSpinButtons: false,
        },
      },
      {
        device: function () {
          return devices.real().deviceType !== 'desktop' && !this._isSupportInputMode();
        }.bind(this),
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

  _getDefaultAttributes() {
    const attributes = super._getDefaultAttributes();
    // eslint-disable-next-line spellcheck/spell-checker
    attributes.inputmode = 'decimal';
    return attributes;
  }

  _renderContentImpl(): void {
    this.option('isValid') && this._validateValue(this.option('value'));
    this.setAria('role', 'spinbutton');
  }

  _renderSubmitElement(): void {
    this._$submitElement = $('<input>')
      .attr('type', 'hidden')
      .appendTo(this.$element());
    this._setSubmitValue(this.option('value'));
  }

  _setSubmitValue(value) {
    this._getSubmitElement().val(applyServerDecimalSeparator(value));
  }

  _getSubmitElement(): dxElementWrapper {
    return this._$submitElement;
  }

  _keyPressHandler(e) {
    super._keyPressHandler();

    const char = getChar(e);
    const validCharRegExp = /[\d.,eE\-+]/;
    const isInputCharValid = validCharRegExp.test(char);

    if (!isInputCharValid) {
      const keyName = normalizeKeyName(e);
      // NOTE: Additional check for Firefox control keys
      if (isCommandKeyPressed(e) || keyName && FIREFOX_CONTROL_KEYS.includes(keyName)) {
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

  _onMouseWheel(dxEvent): void {
    dxEvent.delta > 0 ? this._spinValueChange(1, dxEvent) : this._spinValueChange(-1, dxEvent);
  }

  _renderValue() {
    const inputValue = this._input().val();
    const value = this.option('value');
    // @ts-expect-error ts-error
    if (!inputValue.length || Number(inputValue) !== value) {
      this._forceValueRender();
      this._toggleEmptinessEventHandler();
    }

    const valueText = isDefined(value) ? null : messageLocalization.format('dxNumberBox-noDataText');

    this.setAria({
      // @ts-expect-error ts-error
      // eslint-disable-next-line spellcheck/spell-checker
      valuenow: ensureDefined(value, ''),
      // eslint-disable-next-line spellcheck/spell-checker
      valuetext: valueText,
    });

    this.option('text', this._input().val());
    this._updateButtons();

    return Deferred().resolve();
  }

  _forceValueRender(): void {
    const value = this.option('value');
    const number = Number(value);
    const formattedValue = isNaN(number)
      ? ''
      : this._applyDisplayValueFormatter(value);

    this._renderDisplayText(formattedValue);
  }

  _applyDisplayValueFormatter(value): string | undefined {
    if (!this.option('format')) {
      const globalNumberFormat = getGlobalFormatByDataType('number');

      if (globalNumberFormat) {
        return numberLocalization.format(
          Number(value),
          globalNumberFormat,
        ) as string;
      }
    }

    const { displayValueFormatter } = this.option();

    return displayValueFormatter?.(value);
  }

  _renderProps(): void {
    // @ts-expect-error ts-error
    this._input().prop({
      min: this.option('min'),
      max: this.option('max'),
      step: this.option('step'),
    });

    this.setAria({
      // @ts-expect-error ts-error
      // eslint-disable-next-line spellcheck/spell-checker
      valuemin: ensureDefined(this.option('min'), ''),
      // @ts-expect-error ts-error
      // eslint-disable-next-line spellcheck/spell-checker
      valuemax: ensureDefined(this.option('max'), ''),
    });
  }

  _spinButtonsPointerDownHandler(): void {
    const $input = this._input();
    if (!this.option('useLargeSpinButtons') && domAdapter.getActiveElement() !== $input[0]) {
      // @ts-expect-error ts-error
      eventsEngine.trigger($input, 'focus');
    }
  }

  _spinUpChangeHandler(e): void {
    if (!this.option('readOnly')) {
      this._spinValueChange(1, e.event || e);
    }
  }

  _spinDownChangeHandler(e): void {
    if (!this.option('readOnly')) {
      this._spinValueChange(-1, e.event || e);
    }
  }

  _spinValueChange(sign, dxEvent): void {
    // @ts-expect-error ts-error
    const step = parseFloat(this.option('step'));
    if (step === 0) {
      return;
    }
    // @ts-expect-error ts-error
    let value = parseFloat(this._normalizeInputValue()) || 0;

    value = this._correctRounding(value, step * sign);

    const min = this.option('min');
    const max = this.option('max');

    if (isDefined(min)) {
      // @ts-expect-error ts-error
      value = Math.max(min, value);
    }

    if (isDefined(max)) {
      // @ts-expect-error ts-error
      value = Math.min(max, value);
    }

    this._saveValueChangeEvent(dxEvent);
    this.option('value', value);
  }

  _correctRounding(value, step) {
    const regex = /[,.](.*)/;
    const isFloatValue = regex.test(value);
    const isFloatStep = regex.test(step);

    if (isFloatValue || isFloatStep) {
      // @ts-expect-error
      const valueAccuracy = isFloatValue ? regex.exec(value)[0].length : 0;
      // @ts-expect-error
      const stepAccuracy = isFloatStep ? regex.exec(step)[0].length : 0;
      const accuracy = math.max(valueAccuracy, stepAccuracy);

      value = this._round(value + step, accuracy);

      return value;
    }

    return value + step;
  }

  _round(value, precision) {
    precision = precision || 0;

    const multiplier = 10 ** precision;

    value *= multiplier;
    value = Math.round(value) / multiplier;

    return value;
  }

  _renderValueChangeEvent(): void {
    super._renderValueChangeEvent();

    const forceValueChangeEvent = addNamespace('focusout', FORCE_VALUECHANGE_EVENT_NAMESPACE);
    eventsEngine.off(this.element(), forceValueChangeEvent);
    eventsEngine.on(this.element(), forceValueChangeEvent, this._forceRefreshInputValue.bind(this));
  }

  _forceRefreshInputValue() {
    const { mode } = this.option();
    if (mode === 'number') {
      return;
    }

    const $input = this._input();
    const formattedValue = this._applyDisplayValueFormatter(this.option('value'));
    // @ts-expect-error ts-error
    $input.val(null);
    $input.val(formattedValue);
  }

  _valueChangeEventHandler(e) {
    const $input = this._input();
    const inputValue = this._normalizeText();
    const value = this._parseValue(inputValue);
    const valueHasDigits = inputValue !== '.' && inputValue !== '-';

    if (this._isValueValid() && !this._validateValue(value)) {
      $input.val(this._applyDisplayValueFormatter(value));
      return;
    }

    if (valueHasDigits) {
      // @ts-expect-error ts-error
      super._valueChangeEventHandler(e, isNaN(value) ? null : value);
    }

    this._applyValueBoundaries(inputValue, value);

    this.validationRequest.fire({
      value,
      editor: this,
    });
  }

  _applyValueBoundaries(inputValue, parsedValue) {
    const isValueIncomplete = this._isValueIncomplete(inputValue);
    const isValueCorrect = this._isValueInRange(inputValue);

    if (!isValueIncomplete && !isValueCorrect && parsedValue !== null) {
      if (Number(inputValue) !== parsedValue) {
        this._input().val(this._applyDisplayValueFormatter(parsedValue));
      }
    }
  }

  _replaceCommaWithPoint(value): string {
    return value.replace(',', '.');
  }

  _inputIsInvalid(): boolean {
    const { mode } = this.option();
    const isNumberMode = mode === 'number';
    // @ts-expect-error ts-error
    const validityState = this._input().get(0).validity;

    return isNumberMode && validityState?.badInput;
  }

  _renderDisplayText(text) {
    if (this._inputIsInvalid()) {
      return;
    }

    super._renderDisplayText(text);
  }

  _isValueIncomplete(value) {
    const incompleteRegex = /(^-$)|(^-?\d*\.$)|(\d+e-?$)/i;
    return incompleteRegex.test(value);
  }

  _isValueInRange(value) {
    return inRange(value, this.option('min'), this.option('max'));
  }

  _isNumber(value) {
    return this._parseValue(value) !== null;
  }

  _validateValue(value?) {
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
        message: this.option('invalidValueMessage'),
      },
    });

    return isValid;
  }

  _normalizeInputValue(): number | null {
    return this._parseValue(this._normalizeText());
  }

  _normalizeText() {
    const value = this._input().val().trim();

    return this._replaceCommaWithPoint(value);
  }

  _parseValue(value): number | null {
    const number = parseFloat(value);

    if (isNaN(number)) {
      return null;
    }

    return fitIntoRange(number, this.option('min'), this.option('max'));
  }

  _clearValue(): void {
    if (this._inputIsInvalid()) {
      this._input().val('');
      this._validateValue();
    }
    super._clearValue();
  }

  clear(): void {
    if (this.option('value') === null) {
      this.option('text', '');
      if (this._input().length) {
        this._renderValue();
      }
    } else {
      this.option('value', null);
    }
  }

  _optionChanged(args) {
    switch (args.name) {
      case 'value':
        this._validateValue(args.value);
        this._setSubmitValue(args.value);
        super._optionChanged(args);
        this._resumeValueChangeAction();
        break;
      case 'step':
        this._renderProps();
        break;
      case 'min':
      case 'max':
        this._renderProps();
        this.option('value', this._parseValue(this.option('value')));
        break;
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
