import { ComponentWrapper } from './component-wrapper';

export class EditorWrapper extends ComponentWrapper {
  // extracted from js/ui/editor/editor.js
  _initializeComponent() {
    super._initializeComponent();

    this._valueChangeAction = this._createActionByOption('onValueChanged', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  // extracted from js/ui/editor/editor.js
  _raiseValueChangeAction(value, previousValue) {
    this._valueChangeAction?.({
      element: this.$element(),
      previousValue,
      value,
      event: this._valueChangeEventInstance,
    });
    this._valueChangeEventInstance = undefined;
  }

  // extracted from js/ui/editor/editor.js
  _optionChanged(option) {
    const { name, value, previousValue } = option;

    switch (name) {
      case 'value':
        this._raiseValueChangeAction(value, previousValue);
        break;
      case 'onValueChanged':
        this._valueChangeAction = this._createActionByOption('onValueChanged', {
          excludeValidators: ['disabled', 'readOnly'],
        });
        break;
      default:
        break;
    }

    super._optionChanged(option);
  }
}
