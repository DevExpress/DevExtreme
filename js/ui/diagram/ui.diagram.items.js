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
        this._dataSource.store().insert(data).done(
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
        this._dataSource.store().update(key, data).done(
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
        this._dataSource.store().remove(key).done(
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
}
ItemsOption.include(DataHelperMixin);

module.exports = ItemsOption;
