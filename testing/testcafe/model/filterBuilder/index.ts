import { Selector } from 'testcafe';
import Widget from '../internal/widget';
import Field from './field';

const CLASS = {
  item: 'dx-filterbuilder-item-field',
  popupContent: 'dx-popup-content',
  treeView: 'dx-treeview',
};

export default class FilterBuilder extends Widget {
  name = 'dxFilterBuilder';

  getField(index = 0): Field {
    const fields = this.element.find(`.${CLASS.item}`);
    return new Field(fields.nth(index));
  }

  static getPopupTreeView(): Selector {
    return Selector(`.${CLASS.popupContent} .${CLASS.treeView}`);
  }
}
