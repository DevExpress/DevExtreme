import { Selector } from 'testcafe';
import { WidgetName } from '../helpers/createWidget';
import DropDownList from './internal/dropDownList';

const CLASS = {
  inputField: 'dx-lookup-field',
};

export default class Lookup extends DropDownList {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxLookup'; }

  // eslint-disable-next-line class-methods-use-this
  getInput(): Selector {
    return Selector(`.${CLASS.inputField}`);
  }
}
