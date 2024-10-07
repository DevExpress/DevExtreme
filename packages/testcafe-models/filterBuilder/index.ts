import { Selector } from 'testcafe';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import Field from './field';

type FieldType = 'item' | 'groupOperation' | 'itemOperation' | 'itemAction';
const CLASS = {
  root: 'dx-filterbuilder',
  group: 'dx-filterbuilder-group',
  groupItem: 'dx-filterbuilder-group-item',
  addButton: 'dx-icon-plus',
  removeButton: 'dx-icon-remove',
  item: 'dx-filterbuilder-item-field',
  popupContent: 'dx-popup-content',
  treeView: 'dx-treeview',
  treeViewLeaf: 'dx-treeview-node-is-leaf',
  groupOperation: 'dx-filterbuilder-group-operation',
  itemOperation: 'dx-filterbuilder-item-operation',
  itemValue: 'dx-filterbuilder-item-value-text',
  itemAction: 'dx-filterbuilder-action',
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

  getRootElement(): Selector {
    return this.element.find(`.${CLASS.root}`);
  }

  getGroupByLevel(level): Selector {
    return this.element.find(`.${CLASS.group}`).nth(level - 1);
  }

  getGroupItem(level?): Selector {
    if(level) {
      return this.getGroupByLevel(level).find(`.${CLASS.groupItem}`);
    }
    return this.element.find(`.${CLASS.groupItem}`);
  }

  getOperationButton(level?): Selector {
    if(level) {
      return this.getGroupByLevel(level).find(`.${CLASS.groupOperation}`);
    }
    return this.element.find(`.${CLASS.groupOperation}`);
  }

  getAddButton(level?): Selector {
    if(level) {
      return this.getGroupByLevel(level).find(`.${CLASS.addButton}`);
    }
    return this.element.find(`.${CLASS.addButton}`);
  }

  getRemoveButton(index?): Selector {
    if(index) {
      return this.element.find(`.${CLASS.removeButton}`).nth(index);
    }
    return this.element.find(`.${CLASS.removeButton}`);
  }

  getItem(item, index?) {
    var className;
    switch(item) {
      case 'operation':
        className = CLASS.itemOperation;
        break;
      case 'field': 
        className = CLASS.item;
        break;
      case 'value': 
        className = CLASS.itemValue;
        break;
      default:
        throw new Error(`Unsupported class name: ${className}`);
    }

    if(index) {
      return this.element.find(`.${className}`).nth(index);
    }
    return this.element.find(`.${className}`);
  }
}
