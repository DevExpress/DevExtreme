/* eslint-disable no-underscore-dangle */
import Editor from './common/editor';
import { addAttributes, getAriaName } from './utils/utils';

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
        this._valueChangeEventInstance = undefined;
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

  setAria(name: string, value: string): void {
    const attrName = getAriaName(name);
    addAttributes(this.$element(), [{ name: attrName, value }]);
  }
}
