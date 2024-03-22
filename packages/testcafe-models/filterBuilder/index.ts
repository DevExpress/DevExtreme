import { Selector } from 'testcafe';
import type { WidgetName } from '../../helpers/widgetTypings';
import Widget from '../internal/widget';
import Field from './field';

type FieldType = 'item' | 'groupOperation' | 'itemOperation';
const CLASS = {
  item: 'dx-filterbuilder-item-field',
  popupContent: 'dx-popup-content',
  treeView: 'dx-treeview',
  treeViewLeaf: 'dx-treeview-node-is-leaf',
  groupOperation: 'dx-filterbuilder-group-operation',
  itemOperation: 'dx-filterbuilder-item-operation',
};

export default class FilterBuilder extends Widget {
  static getPopupTreeView(): Selector {
    return Selector(`.${CLASS.popupContent} .${CLASS.treeView}`);
  }

  static getPopupTreeViewNode(index = 0): Selector {
    return Selector(`.${CLASS.treeViewLeaf}`).nth(index);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxFilterBuilder'; }

  getField(index = 0, type: FieldType = 'item'): Field {
    const cssClass = CLASS[type];
    const fields = this.element.find(`.${cssClass}`);
    return new Field(fields.nth(index));
  }
}
