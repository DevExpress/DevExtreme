/* eslint-disable max-classes-per-file */
import { extend } from '@js/core/utils/extend';
import type { DataSourceLike } from '@js/data/data_source';
import type { StoreChange } from '@js/data/store';
import type { Item } from '@js/ui/diagram';
import type { ComponentProperties } from '@ts/core/widget/component';
import { Component } from '@ts/core/widget/component';
import type Store from '@ts/data/abstract_store';
import type { DataSource } from '@ts/data/data_source/data_source';
import { DataHelperMixin } from '@ts/data/m_data_helper';
import type Diagram from '@ts/ui/diagram/ui.diagram';

export type ItemKey = string | number | object;

export type ItemData = Record<string, unknown>;

export type ItemKeyGetter = (item: Item) => ItemKey;

export type ItemsGetter = (item: Item) => Item[] | undefined;

export interface DiagramStoreChange extends StoreChange {
  internalChange?: boolean;
  internalKey?: ItemKey;
}

interface DataSourceChangedArgs {
  changes?: DiagramStoreChange[];
}

interface ItemsCache {
  keys: ItemKey[];
  items: Item[];
  keySet?: Record<string, number>;
}

export interface ItemsOptionProperties extends ComponentProperties<ItemsOptionBase> {
  dataSource?: DataSourceLike<Item>;
}

// the DataHelperMixin members live on this intermediate prototype, so ItemsOption can override them
/* eslint-disable @typescript-eslint/method-signature-style */
/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
interface ItemsOptionBase {
  _dataSource: DataSource;
  _initDataSource(): void;
  _loadDataSource(): void;
  _refreshDataSource(): void;
  _disposeDataSource(): void;
  getDataSource(): DataSource;
}
/* eslint-enable @typescript-eslint/method-signature-style */
/* eslint-enable @typescript-eslint/no-unsafe-declaration-merging */

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class ItemsOptionBase extends Component<ItemsOptionBase, ItemsOptionProperties> {}

// @ts-expect-error include is a Class.inherit static that the Component typing does not declare
ItemsOptionBase.include(DataHelperMixin);

class ItemsOption extends ItemsOptionBase {
  _diagramWidget: Diagram;

  _cache?: ItemsCache;

  _items!: Item[];

  _dataSourceItems!: Item[];

  constructor(diagramWidget: Diagram) {
    super();
    this._diagramWidget = diagramWidget;
    this._resetCache();
  }

  _dataSourceChangedHandler(newItems: Item[], e?: DataSourceChangedArgs): void {
    this._resetCache();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- extend() is untyped
    this._items = newItems.map((item) => extend(true, {}, item));
    this._dataSourceItems = newItems.slice();

    if (e?.changes) {
      const internalChanges = e.changes.filter((change) => change.internalChange);
      const externalChanges = e.changes.filter((change) => !change.internalChange);
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

  _dataSourceLoadingChangedHandler(isLoading: boolean): void {
    if (isLoading && !this._dataSource.isLoaded()) {
      this._diagramWidget._showLoadingIndicator();
    } else {
      this._diagramWidget._hideLoadingIndicator();
    }
  }

  _prepareData(dataObj: ItemData): ItemData {
    Object.keys(dataObj).forEach((key) => {
      if (dataObj[key] === undefined) {
        dataObj[key] = null;
      }
    });

    return dataObj;
  }

  insert(
    data: ItemData,
    callback?: (data: unknown) => void,
    errorCallback?: (error: unknown) => void,
  ): void {
    this._resetCache();
    const store = this._getStore();
    store
      .insert(this._prepareData(data))
      .done((insertedData: unknown, key: unknown) => {
        const change: DiagramStoreChange = {
          type: 'insert', key, data: insertedData, internalChange: true,
        };
        store.push([change]);
        if (callback) {
          callback(insertedData);
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

  update(
    key: ItemKey,
    data: ItemData,
    callback?: (key: unknown, data: unknown) => void,
    errorCallback?: (error: unknown) => void,
  ): void {
    const store = this._getStore();
    const storeKey = this._getStoreKey(store, key, data);
    store
      .update(storeKey, this._prepareData(data))
      .done((updatedKey: unknown, updatedData: unknown) => {
        const change: DiagramStoreChange = {
          type: 'update', key: updatedKey, data: updatedData, internalChange: true,
        };
        store.push([change]);
        if (callback) {
          callback(updatedKey, updatedData);
        }
      })
      .fail((error) => {
        if (errorCallback) {
          errorCallback(error);
        }
      });
  }

  remove(
    key: ItemKey,
    data: ItemData,
    callback?: (key: unknown) => void,
    errorCallback?: (error: unknown) => void,
  ): void {
    this._resetCache();
    const store = this._getStore();
    const storeKey = this._getStoreKey(store, key, data);
    store
      .remove(storeKey)
      .done((removedKey: unknown) => {
        const change: DiagramStoreChange = { type: 'remove', key: removedKey, internalChange: true };
        store.push([change]);
        if (callback) {
          callback(removedKey);
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

  findItem(itemKey: ItemKey): Item | null {
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

  _reloadContentByChanges(changes: DiagramStoreChange[], isExternalChanges: boolean): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- extend() is untyped
    const changesWithInternalKeys = changes.map((change) => extend(
      change,
      { internalKey: this._getInternalKey(change.key) },
    ));
    this._diagramWidget._reloadContentByChanges(changesWithInternalKeys, isExternalChanges);
  }

  _getItemByKey(key: ItemKey): Item {
    const cache = this._ensureCache();
    const index = this._getIndexByKey(key);

    return cache.items[index];
  }

  _getIndexByKey(key: ItemKey): number {
    const cache = this._ensureCache();
    if (typeof key === 'object') {
      for (let i = 0, { length } = cache.keys; i < length; i += 1) {
        if (cache.keys[i] === key) return i;
      }
    } else {
      const keySet = cache.keySet
        || cache.keys.reduce<Record<string, number>>((accumulator, itemKey, index) => {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string -- key coercion
          accumulator[String(itemKey)] = index;

          return accumulator;
        }, {});
      if (!cache.keySet) {
        cache.keySet = keySet;
      }

      return keySet[key];
    }

    return -1;
  }

  _ensureCache(): ItemsCache {
    if (!this._cache) {
      const cache: ItemsCache = {
        keys: [],
        items: [],
      };
      this._cache = cache;
      this._fillCache(cache, this._items);
    }

    return this._cache;
  }

  _fillCache(cache: ItemsCache, items: Item[] | undefined): void {
    if (!items?.length) return;

    const keyExpr = this._getKeyExpr();
    if (keyExpr) {
      items.forEach((item) => {
        cache.keys.push(keyExpr(item));
        cache.items.push(item);
      });
    }
    const itemsExpr = this._getItemsExpr();
    if (itemsExpr) {
      items.forEach((item) => this._fillCache(cache, itemsExpr(item)));
    }
    const containerChildrenExpr = this._getContainerChildrenExpr();
    if (containerChildrenExpr) {
      items.forEach((item) => this._fillCache(cache, containerChildrenExpr(item)));
    }
  }

  _getKeyExpr(): ItemKeyGetter | undefined {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw 'Not Implemented';
  }

  _getItemsExpr(): ItemsGetter | undefined {
    return undefined;
  }

  _getContainerChildrenExpr(): ItemsGetter | undefined {
    return undefined;
  }

  _initDataSource(): void {
    super._initDataSource();
    this._dataSource?.paginate(false);
  }

  _dataSourceOptions(): { paginate: boolean } {
    return {
      paginate: false,
    };
  }

  _getStore(): Store {
    return this._dataSource?.store();
  }

  _getStoreKey(store: Store, internalKey: ItemKey, data: ItemData): unknown {
    let storeKey = store.keyOf(data);
    if (storeKey === data) {
      const keyExpr = this._getKeyExpr();
      this._dataSourceItems.forEach((item) => {
        if (keyExpr?.(item) === internalKey) storeKey = item;
      });
    }

    return storeKey;
  }

  _getInternalKey(storeKey: ItemKey | undefined): ItemKey | undefined {
    if (typeof storeKey === 'object') {
      const keyExpr = this._getKeyExpr();

      return keyExpr?.(storeKey);
    }

    return storeKey;
  }

  _resetCache(): void {
    this._cache = undefined;
  }
}

export default ItemsOption;
