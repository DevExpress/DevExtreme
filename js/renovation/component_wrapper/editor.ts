/* eslint-disable no-underscore-dangle */
import Component from './component';
import ValidationEngine from '../../ui/validation_engine';
import { extend } from '../../core/utils/extend';
import $ from '../../core/renderer';
import { data } from '../../core/element_data';
import Callbacks from '../../core/utils/callbacks';
import OldEditor from '../../ui/editor/editor';

const INVALID_MESSAGE_AUTO = 'dx-invalid-message-auto';
const VALIDATION_TARGET = 'dx-validation-target';

export default class Editor extends Component {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  showValidationMessageTimeout: any;

  validationRequest: any;

  _valueChangeAction: any;

  _valueChangeEventInstance: any;

  getProps(): any {
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const props = super.getProps();
    props.onFocusIn = (): void => {
      const isValidationMessageShownOnFocus = this.option('validationMessageMode') === 'auto';

      // NOTE: The click should be processed before the validation message is shown because
      // it can change the editor's value
      if (isValidationMessageShownOnFocus) {
        // NOTE: Prevent the validation message from showing
        const $validationMessageWrapper = $('.dx-invalid-message.dx-overlay-wrapper');
        $validationMessageWrapper?.removeClass(INVALID_MESSAGE_AUTO);

        clearTimeout(this.showValidationMessageTimeout);

        // NOTE: Show the validation message after a click changes the value
        this.showValidationMessageTimeout = setTimeout(() => {
          $validationMessageWrapper?.addClass(INVALID_MESSAGE_AUTO);
        }, 150);
      }
    };
    props.saveValueChangeEvent = (e: Event): void => {
      this._valueChangeEventInstance = e;
    };

    const propertiesToPass = ['isValid', 'validationStatus', 'validationError', 'validationErrors'];
    propertiesToPass.forEach((prop) => {
      props[prop] = this.option(prop);
    });

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

  _getDefaultOptions(): Record<string, unknown> {
    return extend(
      super._getDefaultOptions(),
      {
        validationMessageOffset: { h: 0, v: 0 },
        validationTooltipOptions: {},
      },
    );
  }

  _bindInnerWidgetOptions(innerWidget: Component, optionsContainer: unknown): void {
    const syncOptions = (): void => (this as unknown as { _options })
      ._options.silent(optionsContainer, extend({},
        innerWidget.option()));

    syncOptions();
    innerWidget.on('optionChanged', syncOptions);
  }

  _optionChanged(option: { name?; value?; previousValue? } = {}): void {
    const { name, value, previousValue } = option;

    if (name && this._getActionConfigs()[name]) {
      this._addAction(name);
    }

    switch (name) {
      case 'value':
        if (value !== previousValue) {
          this.validationRequest.fire({
            value,
            editor: this,
          });
        }
        break;
      case 'isValid':
      case 'validationError':
      case 'validationErrors':
      case 'validationStatus':
        this.option((ValidationEngine as unknown as ({ synchronizeValidationOptions }))
          .synchronizeValidationOptions(option, this.option()));
        break;
      default:
        super._optionChanged(option);
    }

    this._invalidate();
  }

  reset(): void {
    const { value } = this._getDefaultOptions();
    this.option({ value });
  }

  _dispose(): void {
    super._dispose();

    data(this.element(), VALIDATION_TARGET, null);
    clearTimeout(this.showValidationMessageTimeout);
  }
}

const prevIsEditor = (OldEditor as unknown as { isEditor }).isEditor;
(OldEditor as unknown as { isEditor })
  .isEditor = (instance): boolean => prevIsEditor(instance) || instance instanceof Editor;
