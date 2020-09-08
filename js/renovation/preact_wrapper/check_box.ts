/* eslint-disable no-underscore-dangle */
import Editor from './editor';

export default class CheckBox extends Editor {
  _optionChanged(option): void {
    const { name, value, previousValue } = option || {};

    switch (name) {
      case 'value':
        if (value !== previousValue) {
          this.validationRequest.fire({
            value,
            editor: this,
          });
        }
        this._valueChangeAction?.({
          element: this.$element(),
          previousValue,
          value,
          event: this._valueChangeEventInstance,
        });
        this._valueChangeEventInstance = null;
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
