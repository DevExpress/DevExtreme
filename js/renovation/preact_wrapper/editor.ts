/* eslint-disable no-underscore-dangle */
import Component from './component';
import { extend } from '../../core/utils/extend';
import $ from '../../core/renderer';
import { data } from '../../core/element_data';

const INVALID_MESSAGE_AUTO = 'dx-invalid-message-auto';
const INVALID_CLASS = 'dx-invalid';
const VALIDATION_TARGET = 'dx-validation-target';
const VALIDATION_STATUS_INVALID = 'invalid';

export default class Editor extends Component {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  showValidationMessageTimeout: any;

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
        const $validationMessage = $('.dx-validation-message');
        $validationMessage?.removeClass(INVALID_MESSAGE_AUTO);

        clearTimeout(this.showValidationMessageTimeout);

        // NOTE: Show the validation message after a click changes the value
        this.showValidationMessageTimeout = setTimeout(() => {
          $validationMessage?.addClass(INVALID_MESSAGE_AUTO);
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

  _toggleValidationClasses(isInvalid): void {
    this.$element().toggleClass(INVALID_CLASS, isInvalid);
    this.option(`aria.${VALIDATION_STATUS_INVALID}`, isInvalid || undefined);
  }

  _bindInnerWidgetOptions(innerWidget, optionsContainer): void {
    const syncOptions = (): any => this._options.silent(optionsContainer, extend({},
      innerWidget.option()));

    syncOptions();
    innerWidget.on('optionChanged', syncOptions);
  }

  _optionChanged(option): void {
    const { name } = option || {};
    if (name && this._getActionConfigs()[name]) {
      this._addAction(name);
    }

    switch (name) {
      default:
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
