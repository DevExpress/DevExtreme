/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { data } from '@js/core/element_data';
import $ from '@js/core/renderer';
import Callbacks from '@js/core/utils/callbacks';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import OldEditor from '@js/ui/editor/editor';
import ValidationEngine from '@js/ui/validation_engine';
import { ComponentWrapper } from '@ts/core/r1/component_wrapper';
import { querySelectorInSameDocument } from '@ts/core/r1/utils/dom';

const INVALID_MESSAGE_AUTO = 'dx-invalid-message-auto';
const VALIDATION_TARGET = 'dx-validation-target';

export default class Editor extends ComponentWrapper {
  showValidationMessageTimeout?: ReturnType<typeof setTimeout>;

  validationRequest!: ReturnType<typeof Callbacks>;

  _valueChangeAction!: Function;

  _initialValue: unknown;

  _valueChangeEventInstance?: Event;

  getProps(): Record<string, unknown> {
    const props = super.getProps();
    props.onFocusIn = (): void => {
      const isValidationMessageShownOnFocus = this.option('validationMessageMode') === 'auto';
      if (isValidationMessageShownOnFocus) {
        // @ts-expect-error
        const $validationMessageWrapper = $(querySelectorInSameDocument(this.element(), '.dx-invalid-message.dx-overlay-wrapper'));
        $validationMessageWrapper?.removeClass(INVALID_MESSAGE_AUTO);
        const timeToWaitBeforeShow = 150;
        if (this.showValidationMessageTimeout) {
          clearTimeout(this.showValidationMessageTimeout);
        }
        this.showValidationMessageTimeout = setTimeout(() => {
          $validationMessageWrapper?.addClass(INVALID_MESSAGE_AUTO);
        }, timeToWaitBeforeShow);
      }
    };
    props.saveValueChangeEvent = (e): void => {
      this._valueChangeEventInstance = e;
    };
    return props;
  }

  _createElement(element): void {
    super._createElement(element);
    this.showValidationMessageTimeout = undefined;
    this.validationRequest = Callbacks();
    data(this.$element()[0], VALIDATION_TARGET, this);
  }

  _render(): void {
    (this.option('_onMarkupRendered') as () => void)?.();
  }

  _init(): void {
    super._init();
    this._initialValue = this.option('value');
  }

  _initializeComponent(): void {
    super._initializeComponent();
    // @ts-expect-error
    this._valueChangeAction = this._createActionByOption('onValueChanged', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _initOptions(options: Record<string, unknown>): void {
    // @ts-expect-error
    super._initOptions(options);
    // @ts-expect-error
    this.option(ValidationEngine.initValidationOptions(options));
  }

  _getDefaultOptions(): Record<string, unknown> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._getDefaultOptions(), {
      validationMessageOffset: {
        h: 0,
        v: 0,
      },
      validationTooltipOptions: {},
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _bindInnerWidgetOptions(innerWidget: any, optionsContainer: string): void {
    const innerWidgetOptions = extend({}, innerWidget.option());
    const syncOptions = (): void => this._silent(optionsContainer, innerWidgetOptions);
    syncOptions();
    innerWidget.on('optionChanged', syncOptions);
  }

  _raiseValidation(value, previousValue): void {
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

  _optionChanged(option): void {
    const {
      name,
      previousValue,
      value,
    } = option;
    if (name && this._getActionConfigs()[name] !== undefined) {
      this._addAction(name);
    }
    switch (name) {
      case 'value':
        this._raiseValidation(value, previousValue);
        this.option('isDirty', this._initialValue !== value);
        this._raiseValueChangeAction(value, previousValue);
        break;
      case 'onValueChanged':
        // @ts-expect-error
        this._valueChangeAction = this._createActionByOption('onValueChanged', {
          excludeValidators: ['disabled', 'readOnly'],
        });
        break;
      case 'isValid':
      case 'validationError':
      case 'validationErrors':
      case 'validationStatus':
        // @ts-expect-error
        this.option(ValidationEngine.synchronizeValidationOptions(option, this.option()));
        break;
      default:
        break;
    }
    super._optionChanged(option);
  }

  clear(): void {
    const {
      value,
    } = this._getDefaultOptions();
    this.option({
      value,
    });
  }

  reset(value: unknown = undefined): void {
    if (arguments.length) {
      this._initialValue = value;
    }

    this.option('value', this._initialValue);
    this.option('isDirty', false);
    this.option('isValid', true);
  }

  _dispose(): void {
    super._dispose();

    data(this.element(), VALIDATION_TARGET, null);
    if (this.showValidationMessageTimeout) {
      clearTimeout(this.showValidationMessageTimeout);
    }
  }
}

// @ts-expect-error
const prevIsEditor = OldEditor.isEditor;
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const newIsEditor = (instance): boolean => prevIsEditor(instance) || instance instanceof Editor;
// @ts-expect-error
Editor.isEditor = newIsEditor;
// @ts-expect-error
OldEditor.isEditor = newIsEditor;
