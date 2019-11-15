import Component from "../../core/component";
import DataHelperMixin from "../../data_helper";

class ItemsOption extends Component {
    constructor(diagramWidget) {
        super();
        this._diagramWidget = diagramWidget;
        this._resetCache();
    }

    _dataSourceChangedHandler(newItems, e) {
        this._items = newItems;
        this._diagramWidget._onDataSourceChanged();
    }
    _dataSourceLoadingChangedHandler(isLoading) {
        if(isLoading && !this._dataSource.isLoaded()) {
            this._diagramWidget._showLoadingIndicator();
        } else {
            this._diagramWidget._hideLoadingIndicator();
        }
    }
    insert(data, callback, errorCallback) {
        this._resetCache();
        this._getStore().insert(data).done(
            (data) => {
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
        var storeKey = this._getStoreKey(data);
        this._getStore().update(storeKey, data).done(
            function(data, key) {
                if(callback) {
                    callback(key, data);
                }
            }
        ).fail(
            function(error) {
                if(errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }
    remove(key, data, callback, errorCallback) {
        this._resetCache();
        var storeKey = this._getStoreKey(data);
        this._getStore().remove(storeKey).done(
            (key) => {
                if(callback) {
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
        const index = this._getIndexByKey(itemKey);
        return this._items[index];
    }
    getItems() {
        return this._items;
    }
    hasItems() {
        return !!this._items;
    }

    _getIndexByKey(key) {
        const cache = this._cache,
            keys = cache.keys || this._getKeys() || [];
        if(!cache.keys) {
            cache.keys = keys;
        }

        if(typeof key === "object") {
            for(var i = 0, length = keys.length; i < length; i++) {
                if(keys[i] === key) return i;
            }
        } else {
            const set = cache.set || keys.reduce((accumulator, key, index) => {
                accumulator[key] = index;
                return accumulator;
            }, {});
            if(!cache.set) {
                cache.set = set;
            }
            return set[key];
        }
        return -1;
    }

    _getKeys() {
        if(!this._items) {
            return [];
        }
        const keyExpr = this._getKeyExpr();
        return keyExpr && this._items && this._items.map(item => keyExpr(item));
    }

    _getKeyExpr() {
        throw "Not Implemented";
    }

    _dataSourceOptions() {
        return {
            paginate: false
        };
    }
    _getStore() {
        return this._dataSource.store();
    }
    _getStoreKey(data) {
        return this._getStore().keyOf(data);
    }
    _resetCache() {
        this._cache = {};
    }
}
ItemsOption.include(DataHelperMixin);

module.exports = ItemsOption;
