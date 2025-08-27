import type { template } from '@js/common';
import Guid from '@js/core/guid';
import $, { type dxElementWrapper } from '@js/core/renderer';
import type { FunctionTemplate } from '@js/core/templates/function_template';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isString } from '@js/core/utils/type';
import type {
  GroupItem, Item, SimpleItem, TabbedItem,
} from '@js/ui/form';
import type Button from '@ts/ui/button';
import type Editor from '@ts/ui/editor/editor';
import type LayoutManager from '@ts/ui/form/form.layout_manager';
import type TabPanel from '@ts/ui/tab_panel/tab_panel';

export type PreparedItem<T = Item> = T & {
  guid?: string;
  cssItemClass?: string;
  items?: PreparedItem<T>[];
  template?: template | ((data: Item, itemElement: Element) => string | dxElementWrapper);
  allowIndeterminateState?: boolean;
};

export type TabItem = NonNullable<TabbedItem['tabs']>[number];
export type PreparedTabItem = PreparedItem<TabItem>;
export type SimpleItemWithDataField = SimpleItem & Required<Pick<SimpleItem, 'dataField'>>;

export interface PreparedGroupedItem extends PreparedItem<GroupItem> {
  _prepareGroupCaptionTemplate?: (captionTemplate?: template | ((
    data: Item,
    itemElement: Element) => string | dxElementWrapper
  )) => void;
  _prepareGroupItemTemplate?: (itemTemplate?: template | ((
    data: Item,
    itemElement: Element) => string | dxElementWrapper
  )) => void;
  _renderGroupCaptionTemplate?: () => void;
  _renderGroupContentTemplate?: () => void;
  groupCaptionTemplate?: FunctionTemplate;
  groupContentTemplate?: FunctionTemplate;
}

export interface FormItemRuntimeInfo<T = Item> {
  item: PreparedItem<T>;
  itemIndex?: number;
  path?: string;
  guid?: string;
  widgetInstance?: Editor | TabPanel | Button;
  $itemContainer?: dxElementWrapper;
  layoutManager?: LayoutManager;
  preparedItem?: PreparedItem<T>;
}
export default class FormItemsRunTimeInfo {
  _map: Record<string, FormItemRuntimeInfo> = {};

  _findWidgetInstance<T = Editor>(
    condition: (item: SimpleItem) => boolean,
  ): T | undefined {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let result: T | undefined;

    each(this._map, (_guid: Guid, { widgetInstance, item }): boolean => {
      if (condition(item)) {
        result = widgetInstance;

        return false;
      }
      return true;
    });

    return result;
  }

  _findFieldByCondition(
    callback: (value: FormItemRuntimeInfo) => boolean,
    valueExpr: 'guid'
  ): string | undefined;

  _findFieldByCondition(
    callback: (value: FormItemRuntimeInfo) => boolean,
    valueExpr: 'layoutManager'
  ): LayoutManager | undefined;

  _findFieldByCondition(
    callback: (value: FormItemRuntimeInfo) => boolean,
    valueExpr: 'itemIndex'
  ): number | undefined;

  _findFieldByCondition(
    callback: (value: FormItemRuntimeInfo) => boolean,
    valueExpr: 'preparedItem'
  ): PreparedItem | undefined;
  _findFieldByCondition(
    callback: (value: FormItemRuntimeInfo) => boolean,
    valueExpr: 'layoutManager' | 'guid' | 'itemIndex' | 'preparedItem',
  ): unknown {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let result: unknown;

    each(this._map, (key: string, value: FormItemRuntimeInfo): boolean => {
      if (callback(value)) {
        result = valueExpr === 'guid' ? key : value[valueExpr];
        return false;
      }
      return true;
    });
    return result;
  }

  clear(): void {
    this._map = {};
  }

  removeItemsByItems(itemsRunTimeInfo: FormItemsRunTimeInfo): void {
    each(itemsRunTimeInfo.getItems(), (guid: string) => this.removeItemByKey(guid));
  }

  removeItemByKey(key: string): void {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this._map[key];
  }

  add(options: FormItemRuntimeInfo): string {
    const key = options.guid ?? new Guid().toString();
    this._map[key] = options;
    return key;
  }

  addItemsOrExtendFrom(itemsRunTimeInfo: FormItemsRunTimeInfo): void {
    itemsRunTimeInfo.each((key: string, itemRunTimeInfo: FormItemRuntimeInfo) => {
      if (this._map[key]) {
        if (itemRunTimeInfo.widgetInstance) {
          this._map[key].widgetInstance = itemRunTimeInfo.widgetInstance;
        }
        this._map[key].$itemContainer = itemRunTimeInfo.$itemContainer;
      } else {
        this.add({
          item: itemRunTimeInfo.item,
          widgetInstance: itemRunTimeInfo.widgetInstance,
          guid: key,
          $itemContainer: itemRunTimeInfo.$itemContainer,
        });
      }
    });
  }

  extendRunTimeItemInfoByKey(
    key: string,
    options: Partial<FormItemRuntimeInfo>,
  ): void {
    if (this._map[key]) {
      this._map[key] = extend(this._map[key], options);
    }
  }

  findWidgetInstanceByItem(item: Item): Editor | TabPanel | Button | undefined {
    return this._findWidgetInstance((storedItem) => storedItem === item);
  }

  findGroupOrTabLayoutManagerByPath(targetPath: string): LayoutManager | undefined {
    return this._findFieldByCondition(({ path }) => path === targetPath, 'layoutManager');
  }

  findKeyByPath(targetPath: string): string | undefined {
    return this._findFieldByCondition(({ path }) => path === targetPath, 'guid');
  }

  findWidgetInstanceByName<T>(name: string): T | undefined {
    return this._findWidgetInstance<T>((item) => name === item.name);
  }

  findWidgetInstanceByDataField(dataField: string): Editor | undefined {
    return this._findWidgetInstance(
      (item) => dataField === (isString(item) ? item : item.dataField),
    );
  }

  findItemContainerByItem(item: PreparedItem): dxElementWrapper {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in this._map) {
      if (this._map[key].item === item) {
        return this._map[key].$itemContainer ?? $();
      }
    }
    return $();
  }

  findItemIndexByItem(targetItem: Item): number | undefined {
    return this._findFieldByCondition(({ item }) => item === targetItem, 'itemIndex');
  }

  findPreparedItemByItem(item: Item): PreparedItem | undefined {
    return this._findFieldByCondition(({ item: currentItem }) => currentItem === item, 'preparedItem');
  }

  getItems(): Record<string, FormItemRuntimeInfo> {
    return this._map;
  }

  each(handler: (key: string, itemRunTimeInfo: FormItemRuntimeInfo) => void): void {
    each(this._map, (key: string, itemRunTimeInfo: FormItemRuntimeInfo) => {
      handler(key, itemRunTimeInfo);
    });
  }

  removeItemsByPathStartWith(path: string): void {
    const keys = Object.keys(this._map);
    const filteredKeys = keys.filter((key) => {
      if (this._map[key].path) {
        return this._map[key].path?.includes(path, 0);
      }
      return false;
    });
    filteredKeys.forEach((key) => this.removeItemByKey(key));
  }

  _isEditableItem(item: SimpleItem): boolean {
    const { visible: itemVisible, editorOptions } = item;
    const { readOnly, disabled, visible } = editorOptions ?? {};

    return itemVisible !== false && !readOnly && !disabled && visible !== false;
  }

  _isItemAIEnabled(item: SimpleItem): boolean {
    // @ts-expect-error
    return !item.aiOptions?.disabled;
  }

  _isDataItem(item: PreparedItem): item is SimpleItemWithDataField {
    return 'dataField' in item;
  }

  getVisibleItems(): FormItemRuntimeInfo[] {
    const allItems = Object.values(this._map);

    return allItems.filter(({ $itemContainer }) => $itemContainer?.css('visibility') === 'visible');
  }

  getItemsForDataExtraction(): SimpleItemWithDataField[] {
    const visibleItems = this.getVisibleItems().map(({ item }) => item);

    return visibleItems
      .filter(this._isDataItem)
      .filter(this._isItemAIEnabled)
      .filter(this._isEditableItem);
  }
}
