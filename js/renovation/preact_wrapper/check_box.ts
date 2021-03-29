/* eslint-disable no-underscore-dangle */
import Editor from './editor';

export default class CheckBox extends Editor {
  // eslint-disable-next-line class-methods-use-this
  _useTemplates(): boolean {
    return false;
  }

  _optionChanged(option): void {
    const { name, value, previousValue } = option || {};

    switch (name) {
      case 'value':
        this._valueChangeAction?.({
          element: this.$element(),
          previousValue,
          value,
          event: this._valueChangeEventInstance,
        });
        this._valueChangeEventInstance = null;
        super._optionChanged(option);
        break;
      case 'onValueChanged':
        this._valueChangeAction = this._createActionByOption('onValueChanged', {
          excludeValidators: ['disabled', 'readOnly'],
        });
        break;
      default:
        super._optionChanged(option);
    }

    this._invalidate();
  }
}
