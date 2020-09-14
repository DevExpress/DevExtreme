/* eslint-disable no-underscore-dangle */
import Component from './component';
import ValidationEngine from '../../ui/validation_engine';
import { extend } from '../../core/utils/extend';
import { hasWindow } from '../../core/utils/window';
import $ from '../../core/renderer';
import ValidationMessage from '../../ui/validationMessage';
import { data } from '../../core/element_data';
import Callbacks from '../../core/utils/callbacks';

const INVALID_MESSAGE_AUTO = 'dx-invalid-message-auto';
const INVALID_CLASS = 'dx-invalid';
const VALIDATION_TARGET = 'dx-validation-target';
const VALIDATION_STATUS_INVALID = 'invalid';

export default class Editor extends Component {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  _$validationMessage: any;

  _validationMessage: any;

  showValidationMessageTimeout: any;

  validationRequest: any;

  _valueChangeAction: any;

  _valueChangeEventInstance: any;

  getProps(): any {
    /* eslint-enable  @typescript-eslint/no-explicit-any */
    const props = super.getProps();
    props.onFocusIn = (): void => {
      const isValidationMessageShownOnFocus = this.option('validationMessageMode') === 'auto';

      // NOTE: The click should be processed before the validation message is shown because
      // it can change the editor's value
      if (isValidationMessageShownOnFocus) {
        // NOTE: Prevent the validation message from showing
        this._$validationMessage?.removeClass(INVALID_MESSAGE_AUTO);

        clearTimeout(this.showValidationMessageTimeout);

        // NOTE: Show the validation message after a click changes the value
        this.showValidationMessageTimeout = setTimeout(() => {
          this._$validationMessage?.addClass(INVALID_MESSAGE_AUTO);
        }, 150);
      }
    };
    props.saveValueChangeEvent = (e: Event): void => {
      this._valueChangeEventInstance = e;
    };
    return props;
  }

  _init(): void {
    super._init();

    data(this.$element()[0], VALIDATION_TARGET, this);
    this.validationRequest = Callbacks();
    this.showValidationMessageTimeout = null;

    this._valueChangeAction = this._createActionByOption('onValueChanged', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _getDefaultOptions(): object {
    return extend(
      super._getDefaultOptions(),
      {
        validationMessageOffset: { h: 0, v: 0 },
        validationTooltipOptions: {},
      },
    );
  }

  _removeValidationMessage(): void {
    if (this._$validationMessage) {
      this._$validationMessage.remove();
      this.option('aria.describedby', null);
      this._$validationMessage = null;
    }
  }

  _toggleValidationClasses(isInvalid): void {
    this.$element().toggleClass(INVALID_CLASS, isInvalid);
    this.option(`aria.${VALIDATION_STATUS_INVALID}`, isInvalid || undefined);
  }

  _renderValidationState(): void {
    const isValid = this.option('isValid') && this.option('validationStatus') !== VALIDATION_STATUS_INVALID;
    const { validationErrors } = this;
    const $element = this.$element();

    this._toggleValidationClasses(!isValid);

    if (!hasWindow()) {
      return;
    }

    this._removeValidationMessage();
    if (!isValid && validationErrors) {
      this._$validationMessage = $('<div>').appendTo($element);
      this._validationMessage = new ValidationMessage(this._$validationMessage, extend({
        validationErrors,
        target: this._getValidationMessageTarget(),
        container: $element,
        mode: this.option('validationMessageMode'),
        positionRequest: 'below',
        offset: this.option('validationMessageOffset'),
        boundary: this.option('validationBoundary'),
        rtlEnabled: this.option('rtlEnabled'),
      }, this._options.cache('validationTooltipOptions')));

      this.option('aria.describedby', this._validationMessage.$content().attr('id'));
      this._bindInnerWidgetOptions(this._validationMessage, 'validationTooltipOptions');
    }
  }

  _bindInnerWidgetOptions(innerWidget, optionsContainer): void {
    const syncOptions = (): any => this._options.silent(optionsContainer, extend({},
      innerWidget.option()));

    syncOptions();
    innerWidget.on('optionChanged', syncOptions);
  }

  _getValidationMessageTarget(): Element {
    return this.$element();
  }

  _setValidationMessageOption({ name, value }): void {
    const KEY_MAP = {
      validationMessageMode: 'mode',
      validationMessageOffset: 'offset',
      validationBoundary: 'boundary',
    };

    const optionKey = KEY_MAP[name] ? KEY_MAP[name] : name;
    this._validationMessage?.option(optionKey, value);
  }

  _optionChanged(option): void {
    const { name } = option || {};
    if (name && this._getActionConfigs()[name]) {
      this._addAction(name);
    }

    switch (name) {
      case 'width':
        super._optionChanged(option);
        this._validationMessage?.updateMaxWidth();
        break;
      case 'isValid':
      case 'validationError':
      case 'validationErrors':
      case 'validationStatus':
        this.option(ValidationEngine.synchronizeValidationOptions(option, this.option()));
        this._renderValidationState();
        break;
      case 'validationBoundary':
      case 'validationMessageMode':
      case 'validationMessageOffset':
        this._setValidationMessageOption(option);
        break;
      case 'rtlEnabled':
        this._setValidationMessageOption(option);
        super._optionChanged(option);
        break;
      case 'validationTooltipOptions':
        this._innerWidgetOptionChanged(this._validationMessage, option);
        break;
      default:
        this.$element().toggleClass('dx-invalid', !this.option('isValid'));
        super._optionChanged(option);
    }

    this._invalidate();
  }

  reset(): void {
    const defaultOptions = this._getDefaultOptions();
    this.option('value', defaultOptions.value);
  }

  _dispose(): void {
    super._dispose();

    data(this.element(), VALIDATION_TARGET, null);
    clearTimeout(this.showValidationMessageTimeout);
  }
}
