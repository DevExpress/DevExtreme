import Component from '../../core/component';
import DataHelperMixin from '../../data_helper';

class ItemsOption extends Component {
    constructor(diagramWidget) {
        super();
        this._diagramWidget = diagramWidget;
        this._pushHandler = this._handlePush.bind(this);
        this._resetCache();
    }

    _dataSourceChangedHandler(newItems, e) {
        if(e && e.changes) return;

        this._resetCache();
        this._items = newItems.map(item => Object.assign({}, item));
        this._diagramWidget._onDataSourceChanged();

        const store = this._getStore();
        if(this._pushHandlerStore !== store) {
            this._pushHandlerStore && this._pushHandlerStore.off('push', this._pushHandler);
            this._pushHandlerStore = store;
            this._pushHandlerStore && this._pushHandlerStore.on('push', this._pushHandler);
        }
    }
    _dataSourceLoadingChangedHandler(isLoading) {
        if(isLoading && !this._dataSource.isLoaded()) {
            this._diagramWidget._showLoadingIndicator();
        } else {
            this._diagramWidget._hideLoadingIndicator();
        }
    }
    _handlePush(changes) {
    }

    dispose() {
        this._pushHandlerStore && this._pushHandlerStore.off('push', this._pushHandler);

        this._disposeDataSource();
    }
    insert(data, callback, errorCallback) {
        this._resetCache();
        this._getStore().insert(data).done(
            (data) => {
                if(callback) {
                    this._diagramWidget._onDataSourceUpdated(undefined, [{ type: 'insert', data }]);
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
        const storeKey = this._getStoreKey(data);
        this._getStore().update(storeKey, data).done(
            (data, key) => {
                if(callback) {
                    this._diagramWidget._onDataSourceUpdated(key, [{ type: 'update', key, data }]);
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
        const storeKey = this._getStoreKey(data);
        this._getStore().remove(storeKey).done(
            (key) => {
                if(callback) {
                    this._diagramWidget._onDataSourceUpdated(key, [{ type: 'remove', key, data }]);
                    callback(key, data);
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
    _getStoreKey(data) {
        return this._getStore().keyOf(data);
    }
    _resetCache() {
        this._cache = {};
    }
}
ItemsOption.include(DataHelperMixin);

export default ItemsOption;
