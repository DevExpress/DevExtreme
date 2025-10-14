import { Component } from '../../core/component';
import { DataHelperMixin } from '../../common/data';

class DataOption extends Component {
    constructor(optionName, getLoadPanel, dataSourceChangedCallback) {
        super();
        this._optionName = optionName;
        this._getLoadPanel = getLoadPanel;
        this._dataSourceChangedCallback = dataSourceChangedCallback;
        this._pendingReloadRequestInfo = null;
    }
    insert(data, callback, errorCallback) {
        this._showLoadPanel();
        this._getStore().insert(data).done((response) => {
            if(callback) {
                callback(response);
            }
            this._hideLoadPanel();
        }).fail((error) => {
            if(errorCallback) {
                errorCallback(error);
            }
            this._hideLoadPanel();
        });
    }
    update(key, data, callback, errorCallback) {
        this._showLoadPanel();
        this._getStore().update(key, data).done((data, key) => {
            if(callback) {
                callback(data, key);
            }
            this._hideLoadPanel();
        }).fail((error) => {
            if(errorCallback) {
                errorCallback(error);
            }
            this._hideLoadPanel();
        });
    }
    remove(key, callback, errorCallback) {
        this._showLoadPanel();
        this._getStore().remove(key).done((key) => {
            if(callback) {
                callback(key);
            }
            this._hideLoadPanel();
        }).fail((error) => {
            if(errorCallback) {
                errorCallback(error);
            }
            this._hideLoadPanel();
        });
    }

    _dataSourceChangedHandler(newItems, e) {
        this._dataSourceChangedCallback(this._optionName, newItems);
    }
    _dataSourceOptions() {
        return {
            paginate: false
        };
    }
    _dataSourceLoadingChangedHandler(isLoading) {
        if(isLoading && !this._dataSource.isLoaded()) {
            this._showLoadPanel();
        } else {
            this._hideLoadPanel();
        }
    }
    _showLoadPanel() {
        this._getLoadPanel()?.show();
    }
    _hideLoadPanel() {
        this._getLoadPanel()?.hide();
    }
    _getStore() {
        return this._dataSource.store();
    }
    _getItems() {
        return this._getStore()._array || this._dataSource.items();
    }
    _createPendingReloadRequestPromise() {
        let resolve = null;

        let promise = new Promise(_resolve => {
            resolve = _resolve;
        });

        promise = promise.then(() => {
            return new Promise(_resolve => {
                this._reloadDataSource()
                    .done(data => {
                        _resolve(data);
                    });
            });
        });

        return { promise, resolve, counter: 1 };
    }
    _addPendingReloadRequest() {
        if(!this._pendingReloadRequestInfo) {
            this._pendingReloadRequestInfo = this._createPendingReloadRequestPromise();
        } else {
            this._pendingReloadRequestInfo.counter++;
        }
    }
    _resolvePendingReloadRequests() {
        if(!this._pendingReloadRequestInfo) { return; }

        this._pendingReloadRequestInfo.counter--;
        if(this._pendingReloadRequestInfo.counter <= 0) {
            this._pendingReloadRequestInfo.resolve();
        }

        return this._pendingReloadRequestInfo.promise
            .then(data => {
                this._pendingReloadRequestInfo = null;

                return data;
            });
    }
    _reloadDataSource() {
        return this._dataSource.load();
    }
    dispose() {
        this._disposeDataSource();
    }
    _optionChanged(args) {
        switch(args.name) {
            case 'dataSource':
                break;
        }
    }
}
DataOption.include(DataHelperMixin);

export default DataOption;
