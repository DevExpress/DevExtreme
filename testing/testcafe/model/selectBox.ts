import { Selector } from 'testcafe';
import DropDownList from './internal/dropDownList';
import { getComponentInstance } from '../helpers/multi-platform-test';

const CLASS = {
  selectBox: 'dx-selectbox',
};
export default class SelectBox extends DropDownList {
  name = 'dxSelectBox';

  getInstance: () => Promise<unknown>;

  constructor(id: string) {
    super(id);

    this.getInstance = getComponentInstance('jquery', Selector(`.${CLASS.selectBox}`));
  }
}
