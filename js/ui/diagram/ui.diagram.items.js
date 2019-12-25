import Component from '../../core/component';
import DataHelperMixin from '../../data_helper';

class ItemsOption extends Component {
    constructor(diagramWidget) {
        super();
        this._diagramWidget = diagramWidget;
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
}
ItemsOption.include(DataHelperMixin);

module.exports = ItemsOption;
