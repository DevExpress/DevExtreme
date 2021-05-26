import Component from '../../core/component';
import DataHelperMixin from '../../data_helper';

class DataOption extends Component {
    constructor(optionName, loadPanel, dataSourceChangedCallback) {
        super();
        this._optionName = optionName;
        this._loadPanel = loadPanel;
        this._dataSourceChangedCallback = dataSourceChangedCallback;
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
        this._loadPanel.show();
    }
    _hideLoadPanel() {
        this._loadPanel.hide();
    }
    _getStore() {
        return this._dataSource.store();
    }
    _getItems() {
        return this._getStore()._array || this._dataSource.items();
    }
    _reloadDataSource() {
        const isArray = !!this._getStore()._array;
        if(!isArray) {
            this._dataSource.load();
        }
    }
}
DataOption.include(DataHelperMixin);

export default DataOption;
