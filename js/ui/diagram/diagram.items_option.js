import Component from '../../core/component';
import DataHelperMixin from '../../data_helper';

class ItemsOption extends Component {
    constructor(diagramWidget) {
        super();
        this._diagramWidget = diagramWidget;
        this._resetCache();
    }

    _dataSourceChangedHandler(newItems, e) {
        this._resetCache();
        this._items = newItems.map(item => Object.assign({}, item));
        this._dataSourceItems = newItems.slice();

        if(e && e.changes) {
            const changes = e.changes.filter(change => !change.internalChange);
            if(changes.length) {
                this._diagramWidget._reloadContentByChanges(changes, true);
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
                const changes = [{ type: 'insert', key, data, internalChange: true }];
                store.push(changes);
                this._diagramWidget._reloadContentByChanges(changes, false);
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
        const storeKey = this._getStoreKey(store, data);
        store.update(storeKey, this._prepareData(data)).done(
            (data, key) => {
                const changes = [{ type: 'update', key, data, internalChange: true }];
                store.push(changes);
                this._diagramWidget._reloadContentByChanges(changes, false);
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
        const storeKey = this._getStoreKey(store, data);
        store.remove(storeKey).done(
            (key) => {
                const changes = [{ type: 'remove', key, internalChange: true }];
                store.push(changes);
                this._diagramWidget._reloadContentByChanges(changes, false);
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

    _dataSourceOptions() {
        return {
            paginate: false
        };
    }
    _getStore() {
        return this._dataSource && this._dataSource.store();
    }
    _getStoreKey(store, data) {
        let storeKey = store.keyOf(data);
        if(storeKey === data) {
            const index = this._items.indexOf(data);
            if(index > -1) {
                const key = this._dataSourceItems[index];
                if(key) storeKey = key;
            }
        }
        return storeKey;
    }
    _resetCache() {
        this._cache = {};
    }
}
ItemsOption.include(DataHelperMixin);

export default ItemsOption;
