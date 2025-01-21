import { extend } from '../../core/utils/extend';
import { Component } from '../../core/component';
import { DataHelperMixin } from '../../common/data';

const ItemsOptionBase = Component.inherit({}).include(DataHelperMixin);

class ItemsOption extends ItemsOptionBase {
    constructor(diagramWidget) {
        super();
        this._diagramWidget = diagramWidget;
        this._resetCache();
    }

    _dataSourceChangedHandler(newItems, e) {
        this._resetCache();
        this._items = newItems.map(item => extend(true, {}, item));
        this._dataSourceItems = newItems.slice();

        if(e && e.changes) {
            const internalChanges = e.changes.filter(change => change.internalChange);
            const externalChanges = e.changes.filter(change => !change.internalChange);
            if(internalChanges.length) {
                this._reloadContentByChanges(internalChanges, false);
            }
            if(externalChanges.length) {
                this._reloadContentByChanges(externalChanges, true);
            }
        } else {
            this._diagramWidget._onDataSourceChanged();
        }
    }
    _dataSourceLoadingChangedHandler(isLoading) {
        if(isLoading && !this._dataSource.isLoaded()) {
            this._diagramWidget._showLoadingIndicator();
        } else {
            this._diagramWidget._hideLoadingIndicator();
        }
    }
    _prepareData(dataObj) {
        for(const key in dataObj) {
            if(!Object.prototype.hasOwnProperty.call(dataObj, key)) continue;

            if(dataObj[key] === undefined) {
                dataObj[key] = null;
            }
        }
        return dataObj;
    }

    insert(data, callback, errorCallback) {
        this._resetCache();
        const store = this._getStore();
        store.insert(this._prepareData(data)).done(
            (data, key) => {
                store.push([{ type: 'insert', key, data, internalChange: true }]);
                if(callback) {
                    callback(data);
                }
                this._resetCache();
            }
        ).fail(
            (error) => {
                if(errorCallback) {
                    errorCallback(error);
                }
                this._resetCache();
            }
        );
    }
    update(key, data, callback, errorCallback) {
        const store = this._getStore();
        const storeKey = this._getStoreKey(store, key, data);
        store.update(storeKey, this._prepareData(data)).done(
            (data, key) => {
                store.push([{ type: 'update', key, data, internalChange: true }]);
                if(callback) {
                    callback(key, data);
                }
            }
        ).fail(
            (error) => {
                if(errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }
    remove(key, data, callback, errorCallback) {
        this._resetCache();
        const store = this._getStore();
        const storeKey = this._getStoreKey(store, key, data);
        store.remove(storeKey).done(
            (key) => {
                store.push([{ type: 'remove', key, internalChange: true }]);
                if(callback) {
                    callback(key);
                }
                this._resetCache();
            }
        ).fail(
            (error) => {
                if(errorCallback) {
                    errorCallback(error);
                }
                this._resetCache();
            }
        );
    }
    findItem(itemKey) {
        if(!this._items) {
            return null;
        }
        return this._getItemByKey(itemKey);
    }
    getItems() {
        return this._items;
    }
    hasItems() {
        return !!this._items;
    }

    _reloadContentByChanges(changes, isExternalChanges) {
        changes = changes.map(change => extend(change, { internalKey: this._getInternalKey(change.key) }));
        this._diagramWidget._reloadContentByChanges(changes, isExternalChanges);
    }
    _getItemByKey(key) {
        this._ensureCache();

        const cache = this._cache;
        const index = this._getIndexByKey(key);
        return cache.items[index];
    }
    _getIndexByKey(key) {
        this._ensureCache();

        const cache = this._cache;
        if(typeof key === 'object') {
            for(let i = 0, length = cache.keys.length; i < length; i++) {
                if(cache.keys[i] === key) return i;
            }
        } else {
            const keySet = cache.keySet || cache.keys.reduce((accumulator, key, index) => {
                accumulator[key] = index;
                return accumulator;
            }, {});
            if(!cache.keySet) {
                cache.keySet = keySet;
            }
            return keySet[key];
        }
        return -1;
    }
    _ensureCache() {
        const cache = this._cache;
        if(!cache.keys) {
            cache.keys = [];
            cache.items = [];
            this._fillCache(cache, this._items);
        }
    }
    _fillCache(cache, items) {
        if(!items || !items.length) return;

        const keyExpr = this._getKeyExpr();
        if(keyExpr) {
            items.forEach(item => {
                cache.keys.push(keyExpr(item));
                cache.items.push(item);
            });
        }
        const itemsExpr = this._getItemsExpr();
        if(itemsExpr) {
            items.forEach(item => this._fillCache(cache, itemsExpr(item)));
        }
        const containerChildrenExpr = this._getContainerChildrenExpr();
        if(containerChildrenExpr) {
            items.forEach(item => this._fillCache(cache, containerChildrenExpr(item)));
        }
    }

    _getKeyExpr() {
        throw 'Not Implemented';
    }
    _getItemsExpr() {
    }
    _getContainerChildrenExpr() {
    }

    _initDataSource() {
        super._initDataSource();
        this._dataSource && this._dataSource.paginate(false);
    }
    _dataSourceOptions() {
        return {
            paginate: false
        };
    }
    _getStore() {
        return this._dataSource && this._dataSource.store();
    }
    _getStoreKey(store, internalKey, data) {
        let storeKey = store.keyOf(data);
        if(storeKey === data) {
            const keyExpr = this._getKeyExpr();
            this._dataSourceItems.forEach(item => {
                if(keyExpr(item) === internalKey) storeKey = item;
            });
        }
        return storeKey;
    }
    _getInternalKey(storeKey) {
        if(typeof storeKey === 'object') {
            const keyExpr = this._getKeyExpr();
            return keyExpr(storeKey);
        }
        return storeKey;
    }
    _resetCache() {
        this._cache = {};
    }
}

export default ItemsOption;
