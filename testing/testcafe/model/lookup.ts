import { Selector } from 'testcafe';
import DropDownList from './internal/dropDownList';

const CLASS = {
  inputField: 'dx-lookup-field',
};

export default class Lookup extends DropDownList {
  name = 'dxLookup';

  // eslint-disable-next-line class-methods-use-this
  getInput(): Selector {
    return Selector(`.${CLASS.inputField}`);
  }
}
