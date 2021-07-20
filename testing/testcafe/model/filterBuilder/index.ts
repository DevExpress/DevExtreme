import { Selector } from 'testcafe';
import Widget from '../internal/widget';
import Field from './field';

type FieldType = 'item' | 'groupOperation';
const CLASS = {
  item: 'dx-filterbuilder-item-field',
  popupContent: 'dx-popup-content',
  treeView: 'dx-treeview',
  treeViewLeaf: 'dx-treeview-node-is-leaf',
  groupOperation: 'dx-filterbuilder-group-operation',
};

export default class FilterBuilder extends Widget {
  name = 'dxFilterBuilder';

  static getPopupTreeView(): Selector {
    return Selector(`.${CLASS.popupContent} .${CLASS.treeView}`);
  }

  static getPopupTreeViewNode(index = 0): Selector {
    return Selector(`.${CLASS.treeViewLeaf}`).nth(index);
  }

  getField(index = 0, type: FieldType = 'item'): Field {
    const cssClass = CLASS[type];
    const fields = this.element.find(`.${cssClass}`);
    return new Field(fields.nth(index));
  }
}
