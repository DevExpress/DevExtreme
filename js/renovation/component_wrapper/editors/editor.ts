import { isDefined } from '../../../core/utils/type';
import Component from '../common/component';
import ValidationEngine from '../../../ui/validation_engine';
import { extend } from '../../../core/utils/extend';
// eslint-disable-next-line import/named
import $ from '../../../core/renderer';
import { data } from '../../../core/element_data';
import Callbacks from '../../../core/utils/callbacks';
import OldEditor from '../../../ui/editor/editor';
import { Option } from '../common/types';
import { querySelectorInSameDocument } from '../../utils/dom';

const INVALID_MESSAGE_AUTO = 'dx-invalid-message-auto';
const VALIDATION_TARGET = 'dx-validation-target';

export default class Editor extends Component {
  showValidationMessageTimeout?: ReturnType<typeof setTimeout>;

  validationRequest!: ReturnType<typeof Callbacks>;

  // eslint-disable-next-line @typescript-eslint/ban-types
  _valueChangeAction!: Function;

  _valueChangeEventInstance?: Event;

  getProps(): Record<string, unknown> {
    const props = super.getProps();
    props.onFocusIn = (): void => {
      const isValidationMessageShownOnFocus = this.option('validationMessageMode') === 'auto';

      // NOTE: The click should be processed before the validation message is shown because
      // it can change the editor's value
      if (isValidationMessageShownOnFocus) {
        // NOTE: Prevent the validation message from showing
        const $validationMessageWrapper = $(querySelectorInSameDocument(this.element(), '.dx-invalid-message.dx-overlay-wrapper') as Element);
        $validationMessageWrapper?.removeClass(INVALID_MESSAGE_AUTO);

        const timeToWaitBeforeShow = 150;
        if (this.showValidationMessageTimeout) {
          clearTimeout(this.showValidationMessageTimeout);
        }

        // NOTE: Show the validation message after a click changes the value
        this.showValidationMessageTimeout = setTimeout(() => {
          $validationMessageWrapper?.addClass(INVALID_MESSAGE_AUTO);
        }, timeToWaitBeforeShow);
      }
    };
    props.saveValueChangeEvent = (e: Event): void => {
      this._valueChangeEventInstance = e;
    };

    return props;
  }

  _createElement(element: HTMLElement): void {
    super._createElement(element);
    this.showValidationMessageTimeout = undefined;
    this.validationRequest = Callbacks();
    data(this.$element()[0], VALIDATION_TARGET, this);
  }

  _render(): void {
    (this.option('_onMarkupRendered') as () => void)?.();
  }

  _initializeComponent(): void {
    super._initializeComponent();

    this._valueChangeAction = this._createActionByOption('onValueChanged', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _initOptions(options: Record<string, unknown>): void {
    super._initOptions(options);

    this.option((ValidationEngine as unknown as ({ initValidationOptions }))
      .initValidationOptions(options));
  }

  _getDefaultOptions(): Record<string, unknown> {
    return extend(
      super._getDefaultOptions(),
      {
        validationMessageOffset: { h: 0, v: 0 },
        validationTooltipOptions: {},
      },
    ) as Record<string, unknown>;
  }

  _bindInnerWidgetOptions(innerWidget: Component, optionsContainer: string): void {
    const innerWidgetOptions = extend({}, innerWidget.option());
    const syncOptions = (): void => this._silent(optionsContainer, innerWidgetOptions);

    syncOptions();
    innerWidget.on('optionChanged', syncOptions);
  }

  _raiseValidation(value: unknown, previousValue: unknown): void {
    const areValuesEmpty = !isDefined(value) && !isDefined(previousValue);

    if (value !== previousValue && !areValuesEmpty) {
      this.validationRequest.fire({
        value,
        editor: this,
      });
    }
  }

  _raiseValueChangeAction(value: unknown, previousValue: unknown): void {
    this._valueChangeAction?.({
      element: this.$element(),
      previousValue,
      value,
      event: this._valueChangeEventInstance,
    });
    this._valueChangeEventInstance = undefined;
  }

  _optionChanged(option: Option): void {
    const { name, value, previousValue } = option;

    if (name && this._getActionConfigs()[name] !== undefined) {
      this._addAction(name);
    }

    switch (name) {
      case 'value':
        this._raiseValidation(value, previousValue);
        this._raiseValueChangeAction(value, previousValue);
        break;
      case 'onValueChanged':
        this._valueChangeAction = this._createActionByOption('onValueChanged', {
          excludeValidators: ['disabled', 'readOnly'],
        });
        break;
      case 'isValid':
      case 'validationError':
      case 'validationErrors':
      case 'validationStatus':
        this.option((ValidationEngine as unknown as ({ synchronizeValidationOptions }))
          .synchronizeValidationOptions(option, this.option()));
        break;
      default:
        break;
    }

    super._optionChanged(option);
  }

  reset(): void {
    const { value } = this._getDefaultOptions();
    this.option({ value });
  }

  _dispose(): void {
    super._dispose();

    data(this.element(), VALIDATION_TARGET, null);
    if (this.showValidationMessageTimeout) {
      clearTimeout(this.showValidationMessageTimeout);
    }
  }
}

const prevIsEditor = (OldEditor as unknown as { isEditor: (instance: Component) => boolean })
  .isEditor;
const newIsEditor = (instance): boolean => prevIsEditor(instance) || instance instanceof Editor;
(Editor as unknown as { isEditor: (instance: Component) => boolean }).isEditor = newIsEditor;
(OldEditor as unknown as { isEditor: (instance: Component) => boolean }).isEditor = newIsEditor;
