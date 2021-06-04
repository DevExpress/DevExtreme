// eslint-disable-next-line import/named
import { dxElementWrapper } from '../../core/renderer';
import Editor from './common/editor';
import { Option } from './common/types';
import { addAttributes, getAriaName } from './utils/utils';

export default class CheckBox extends Editor {
  // eslint-disable-next-line class-methods-use-this
  _useTemplates(): boolean {
    return false;
  }

  _optionChanged(option: Option): void {
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
    addAttributes(
      this.$element() as unknown as dxElementWrapper,
      [{ name: attrName, value }],
    );
  }
}
