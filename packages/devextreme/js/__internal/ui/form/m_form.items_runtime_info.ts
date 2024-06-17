import Guid from '@js/core/guid';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isString } from '@js/core/utils/type';

export default class FormItemsRunTimeInfo {
  _map?: any;

  constructor() {
    this._map = {};
  }

  _findWidgetInstance(condition) {
    let result;

    // @ts-expect-error
    each(this._map, (guid, { widgetInstance, item }) => {
      if (condition(item)) {
        result = widgetInstance;

        return false;
      }
    });

    return result;
  }

  _findFieldByCondition(callback, valueExpr) {
    let result;
    // @ts-expect-error
    each(this._map, (key, value) => {
      if (callback(value)) {
        result = valueExpr === 'guid' ? key : value[valueExpr];
        return false;
      }
    });
    return result;
  }

  clear() {
    this._map = {};
  }

  removeItemsByItems(itemsRunTimeInfo) {
    each(itemsRunTimeInfo.getItems(), (guid) => this.removeItemByKey(guid));
  }

  removeItemByKey(key) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this._map[key];
  }

  add(options) {
    const key = options.guid || new Guid();
    this._map[key] = options;
    return key;
  }

  addItemsOrExtendFrom(itemsRunTimeInfo) {
    itemsRunTimeInfo.each((key, itemRunTimeInfo) => {
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

  extendRunTimeItemInfoByKey(key, options) {
    if (this._map[key]) {
      this._map[key] = extend(this._map[key], options);
    }
  }

  findWidgetInstanceByItem(item) {
    return this._findWidgetInstance((storedItem) => storedItem === item);
  }

  findGroupOrTabLayoutManagerByPath(targetPath) {
    return this._findFieldByCondition(({ path }) => path === targetPath, 'layoutManager');
  }

  findKeyByPath(targetPath) {
    return this._findFieldByCondition(({ path }) => path === targetPath, 'guid');
  }

  findWidgetInstanceByName(name) {
    return this._findWidgetInstance((item) => name === item.name);
  }

  findWidgetInstanceByDataField(dataField) {
    return this._findWidgetInstance((item) => dataField === (isString(item) ? item : item.dataField));
  }

  findItemContainerByItem(item) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in this._map) {
      if (this._map[key].item === item) {
        return this._map[key].$itemContainer;
      }
    }
    return null;
  }

  findItemIndexByItem(targetItem) {
    return this._findFieldByCondition(({ item }) => item === targetItem, 'itemIndex');
  }

  findPreparedItemByItem(item) {
    return this._findFieldByCondition(({ item: currentItem }) => currentItem === item, 'preparedItem');
  }

  getItems() {
    return this._map;
  }

  each(handler) {
    each(this._map, (key, itemRunTimeInfo) => {
      handler(key, itemRunTimeInfo);
    });
  }

  removeItemsByPathStartWith(path) {
    const keys = Object.keys(this._map);
    const filteredKeys = keys.filter((key) => {
      if (this._map[key].path) {
        return this._map[key].path.indexOf(path, 0) > -1;
      }
      return false;
    });
    filteredKeys.forEach((key) => this.removeItemByKey(key));
  }
}
