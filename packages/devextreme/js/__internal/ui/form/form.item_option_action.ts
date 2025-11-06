import type { ValidationRule } from '@js/common';
import Class from '@js/core/class';
import type { dxElementWrapper } from '@js/core/renderer';
import type { Item, SimpleItem } from '@js/ui/form';
import type Button from '@ts/ui/button';
import type Editor from '@ts/ui/editor/editor';
import type FormItemsRunTimeInfo from '@ts/ui/form/form.items_runtime_info';
import type { PreparedItem } from '@ts/ui/form/form.items_runtime_info';
import type TabPanel from '@ts/ui/tab_panel/tab_panel';

export interface ItemOptionActionOptions<T = Item> {
  itemsRunTimeInfo: FormItemsRunTimeInfo;
  item: T;
  optionName?: string;
  value?: unknown;
  previousValue?: unknown;
}

export interface ValidationRulesItemOptionActionOption extends ItemOptionActionOptions<SimpleItem> {
  validationRules?: ValidationRule[];
}

export default class ItemOptionAction<T extends ItemOptionActionOptions = ItemOptionActionOptions> {
  _options: T;

  _itemsRunTimeInfo: FormItemsRunTimeInfo;

  constructor(options: T) {
    this._options = options;
    this._itemsRunTimeInfo = this._options.itemsRunTimeInfo;
  }

  findInstance(): Editor | TabPanel | Button | undefined {
    return this._itemsRunTimeInfo.findWidgetInstanceByItem(this._options.item);
  }

  findItemContainer(): dxElementWrapper {
    return this._itemsRunTimeInfo.findItemContainerByItem(this._options.item);
  }

  findPreparedItem(): PreparedItem | undefined {
    return this._itemsRunTimeInfo.findPreparedItemByItem(this._options.item);
  }

  tryExecute(): void {
    Class.abstract();
  }
}
