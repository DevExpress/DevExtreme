import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import { textMatcher } from '../internal/textMatcher';
import Field from './field';

type FieldType = 'item' | 'groupOperation' | 'itemOperation' | 'itemAction' | 'itemValue';

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
  checkbox: 'dx-checkbox',
};

const ITEM_CLASS = {
  operation: CLASS.itemOperation,
  field: CLASS.item,
  value: CLASS.itemValue,
};

export default class FilterBuilder extends Widget {
  name: WidgetName = 'dxFilterBuilder';

  public static getPopupTreeView(page: Page): Locator {
    return page.locator(`.${CLASS.popupContent} .${CLASS.treeView}`);
  }

  public static getPopupTreeViewNodeByText(page: Page, text: string): Locator {
    return page.locator(`.${CLASS.treeViewLeaf}`)
      .filter({ hasText: textMatcher(text) })
      .filter({ visible: true });
  }

  public static getPopupTreeViewNodeCheckboxByText(page: Page, text: string): Locator {
    return FilterBuilder.getPopupTreeViewNodeByText(page, text).locator(`.${CLASS.checkbox}`);
  }

  public getField(index = 0, type: FieldType = 'item'): Field {
    return new Field(this.element.locator(`.${CLASS[type]}`).nth(index));
  }

  public getRootElement(): Locator {
    return this.element.locator(`.${CLASS.root}`);
  }

  public getGroupByLevel(level: number): Locator {
    return this.element.locator(`.${CLASS.group}`).nth(level - 1);
  }

  public getGroupItem(level?: number): Locator {
    return (level ? this.getGroupByLevel(level) : this.element).locator(`.${CLASS.groupItem}`);
  }

  public getOperationButton(level?: number): Locator {
    return (level ? this.getGroupByLevel(level) : this.element).locator(`.${CLASS.groupOperation}`);
  }

  public getAddButton(level?: number): Locator {
    return (level ? this.getGroupByLevel(level) : this.element).locator(`.${CLASS.addButton}`);
  }

  public getRemoveButton(index?: number): Locator {
    const buttons = this.element.locator(`.${CLASS.removeButton}`);

    return index ? buttons.nth(index) : buttons;
  }

  public getItem(item: keyof typeof ITEM_CLASS, index?: number): Locator {
    const items = this.element.locator(`.${ITEM_CLASS[item]}`);

    return index ? items.nth(index) : items;
  }

  public isReady(): Promise<boolean> {
    return this.invoke('isReady');
  }
}
