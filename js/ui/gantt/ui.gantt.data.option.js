import Component from "../../core/component";
import DataHelperMixin from "../../data_helper";

class DataOption extends Component {
    constructor(optionName, dataSourceChangedCallback) {
        super();
        this._optionName = optionName;
        this._dataSourceChangedCallback = dataSourceChangedCallback;
    }
    insert(data, callback) {
        this._dataSource.store().insert(data).done(
            function(data) {
                if(callback) {
                    callback(data);
                }
            }
        );
    }
    update(key, data, callback) {
        this._dataSource.store().update(key, data).done(
            function(data, key) {
                if(callback) {
                    callback(key, data);
                }
            }
        );
    }
    remove(key, callback) {
        this._dataSource.store().remove(key).done(
            function(key) {
                if(callback) {
                    callback(key);
                }
            }
        );
    }

    _dataSourceChangedHandler(newItems, e) {
        this._dataSourceChangedCallback(this._optionName, newItems);
    }
    _dataSourceOptions() {
        return {
            paginate: false
        };
    }
}
DataOption.include(DataHelperMixin);

module.exports = DataOption;
