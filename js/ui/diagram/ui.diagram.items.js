import Component from "../../core/component";
import DataHelperMixin from "../../data_helper";

class ItemsOption extends Component {
    constructor(diagramWidget) {
        super();
        this._diagramWidget = diagramWidget;
    }

    _dataSourceLoadingChangedHandler(isLoading) {
        if(isLoading && !this._dataSource.isLoaded()) {
            this._diagramWidget._showLoadingIndicator();
        } else {
            this._diagramWidget._hideLoadingIndicator();
        }
    }
    insert(data, callback, errorCallback) {
        this._getStore().insert(data).done(
            function(data) {
                if(callback) {
                    callback(data);
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
        var storeKey = this._getStoreKey(data);
        this._getStore().remove(storeKey).done(
            function(key) {
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

    _getStore() {
        return this._dataSource.store();
    }
    _getStoreKey(data) {
        return this._getStore().keyOf(data);
    }
}
ItemsOption.include(DataHelperMixin);

module.exports = ItemsOption;
