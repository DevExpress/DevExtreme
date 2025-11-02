/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// @ts-expect-error ts-error
import { DataHelperMixin } from '@js/common/data';
import { Component } from '@js/core/component';
import { extend } from '@js/core/utils/extend';
import type { Item } from '@js/ui/diagram';

// @ts-expect-error ts-error
const ItemsOptionBase = Component.inherit({}).include(DataHelperMixin);

class ItemsOption extends ItemsOptionBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _diagramWidget: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _cache: any;

  _items!: Item[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _dataSourceItems: any;

  constructor(diagramWidget) {
    super();
    this._diagramWidget = diagramWidget;
    this._resetCache();
  }

  _dataSourceChangedHandler(newItems, e): void {
    this._resetCache();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    this._items = newItems.map((item) => extend(true, {}, item));
    this._dataSourceItems = newItems.slice();

    if (e?.changes) {
      const internalChanges = e.changes.filter(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (change): boolean => change.internalChange,
      );
      const externalChanges = e.changes.filter(
        (change): boolean => !change.internalChange,
      );
      if (internalChanges.length) {
        this._reloadContentByChanges(internalChanges, false);
      }
      if (externalChanges.length) {
        this._reloadContentByChanges(externalChanges, true);
      }
    } else {
      this._diagramWidget._onDataSourceChanged();
    }
  }

  _dataSourceLoadingChangedHandler(isLoading): void {
    // @ts-expect-error ts-error
    if (isLoading && !this._dataSource.isLoaded()) {
      this._diagramWidget._showLoadingIndicator();
    } else {
      this._diagramWidget._hideLoadingIndicator();
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _prepareData(dataObj) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in dataObj) {
      // eslint-disable-next-line no-continue
      if (!Object.prototype.hasOwnProperty.call(dataObj, key)) continue;

      if (dataObj[key] === undefined) {
        dataObj[key] = null;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return dataObj;
  }

  insert(data, callback, errorCallback): void {
    this._resetCache();
    const store = this._getStore();
    store
      .insert(this._prepareData(data))
      .done((resultData, resultKey): void => {
        store.push([{
          type: 'insert', resultKey, resultData, internalChange: true,
        }]);
        if (callback) {
          callback(resultData);
        }
        this._resetCache();
      })
      .fail((error) => {
        if (errorCallback) {
          errorCallback(error);
        }
        this._resetCache();
      });
  }

  update(key, data, callback, errorCallback): void {
    const store = this._getStore();
    const storeKey = this._getStoreKey(store, key, data);
    store
      .update(storeKey, this._prepareData(data))
      .done((resultData, resultKey) => {
        store.push([{
          type: 'update', resultKey, resultData, internalChange: true,
        }]);
        if (callback) {
          callback(resultKey, resultData);
        }
      })
      .fail((error) => {
        if (errorCallback) {
          errorCallback(error);
        }
      });
  }

  remove(key, data, callback, errorCallback): void {
    this._resetCache();
    const store = this._getStore();
    const storeKey = this._getStoreKey(store, key, data);
    store
      .remove(storeKey)
      .done((resultKey): void => {
        store.push([{ type: 'remove', resultKey, internalChange: true }]);
        if (callback) {
          callback(resultKey);
        }
        this._resetCache();
      })
      .fail((error): void => {
        if (errorCallback) {
          errorCallback(error);
        }
        this._resetCache();
      });
  }

  findItem(itemKey): Item | null {
    if (!this._items) {
      return null;
    }
    return this._getItemByKey(itemKey);
  }

  getItems(): Item[] {
    return this._items;
  }

  hasItems(): boolean {
    return !!this._items;
  }

  _reloadContentByChanges(changes, isExternalChanges): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,no-param-reassign
    changes = changes.map((change) => extend(
      change,
      { internalKey: this._getInternalKey(change.key) },
    ));
    this._diagramWidget._reloadContentByChanges(changes, isExternalChanges);
  }

  _getItemByKey(key): Item {
    this._ensureCache();

    const cache = this._cache;
    const index = this._getIndexByKey(key);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return cache.items[index];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getIndexByKey(key) {
    this._ensureCache();

    const cache = this._cache;
    if (typeof key === 'object') {
      for (let i = 0, { length } = cache.keys; i < length; i += 1) {
        if (cache.keys[i] === key) return i;
      }
    } else {
      const keySet = cache.keySet
        || cache.keys.reduce((accumulator, cacheKey, index) => {
          accumulator[cacheKey] = index;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return accumulator;
        }, {});
      if (!cache.keySet) {
        cache.keySet = keySet;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return keySet[key];
    }
    return -1;
  }

  _ensureCache(): void {
    const cache = this._cache;
    if (!cache.keys) {
      cache.keys = [];
      cache.items = [];
      this._fillCache(cache, this._items);
    }
  }

  _fillCache(cache, items): void {
    if (!items?.length) return;

    const keyExpr = this._getKeyExpr();
    // @ts-expect-error ts-error
    if (keyExpr) {
      items.forEach((item): void => {
        // @ts-expect-error ts-error
        cache.keys.push(keyExpr(item));
        cache.items.push(item);
      });
    }
    const itemsExpr = this._getItemsExpr();
    // @ts-expect-error ts-error
    if (itemsExpr) {
      // @ts-expect-error ts-error
      items.forEach((item): void => this._fillCache(cache, itemsExpr(item)));
    }
    const containerChildrenExpr = this._getContainerChildrenExpr();
    // @ts-expect-error ts-error
    if (containerChildrenExpr) {
      // @ts-expect-error ts-error
      items.forEach((item): void => this._fillCache(cache, containerChildrenExpr(item)));
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getKeyExpr() {
    throw 'Not Implemented';
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getItemsExpr() {}

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getContainerChildrenExpr() {}

  _initDataSource(): void {
    super._initDataSource();
    // @ts-expect-error ts-error
    this._dataSource?.paginate(false);
  }

  _dataSourceOptions(): { paginate: boolean } {
    return {
      paginate: false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getStore() {
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._dataSource?.store();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getStoreKey(store, internalKey, data) {
    let storeKey = store.keyOf(data);
    if (storeKey === data) {
      const keyExpr = this._getKeyExpr();
      this._dataSourceItems.forEach((item) => {
        // @ts-expect-error ts-error
        if (keyExpr(item) === internalKey) storeKey = item;
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return storeKey;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getInternalKey(storeKey) {
    if (typeof storeKey === 'object') {
      const keyExpr = this._getKeyExpr();
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return keyExpr(storeKey);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return storeKey;
  }

  _resetCache(): void {
    this._cache = {};
  }
}

export default ItemsOption;
