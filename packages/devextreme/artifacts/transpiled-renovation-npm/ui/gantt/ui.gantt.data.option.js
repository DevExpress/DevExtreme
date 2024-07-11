"use strict";

exports.default = void 0;
var _component = require("../../core/component");
var _data_helper = _interopRequireDefault(require("../../data_helper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class DataOption extends _component.Component {
  constructor(optionName, getLoadPanel, dataSourceChangedCallback) {
    super();
    this._optionName = optionName;
    this._getLoadPanel = getLoadPanel;
    this._dataSourceChangedCallback = dataSourceChangedCallback;
  }
  insert(data, callback, errorCallback) {
    this._showLoadPanel();
    this._getStore().insert(data).done(response => {
      if (callback) {
        callback(response);
      }
      this._hideLoadPanel();
    }).fail(error => {
      if (errorCallback) {
        errorCallback(error);
      }
      this._hideLoadPanel();
    });
  }
  update(key, data, callback, errorCallback) {
    this._showLoadPanel();
    this._getStore().update(key, data).done((data, key) => {
      if (callback) {
        callback(data, key);
      }
      this._hideLoadPanel();
    }).fail(error => {
      if (errorCallback) {
        errorCallback(error);
      }
      this._hideLoadPanel();
    });
  }
  remove(key, callback, errorCallback) {
    this._showLoadPanel();
    this._getStore().remove(key).done(key => {
      if (callback) {
        callback(key);
      }
      this._hideLoadPanel();
    }).fail(error => {
      if (errorCallback) {
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
    if (isLoading && !this._dataSource.isLoaded()) {
      this._showLoadPanel();
    } else {
      this._hideLoadPanel();
    }
  }
  _showLoadPanel() {
    var _this$_getLoadPanel;
    (_this$_getLoadPanel = this._getLoadPanel()) === null || _this$_getLoadPanel === void 0 || _this$_getLoadPanel.show();
  }
  _hideLoadPanel() {
    var _this$_getLoadPanel2;
    (_this$_getLoadPanel2 = this._getLoadPanel()) === null || _this$_getLoadPanel2 === void 0 || _this$_getLoadPanel2.hide();
  }
  _getStore() {
    return this._dataSource.store();
  }
  _getItems() {
    return this._getStore()._array || this._dataSource.items();
  }
  _reloadDataSource() {
    return this._dataSource.load();
  }
  dispose() {
    this._disposeDataSource();
  }
  _optionChanged(args) {
    switch (args.name) {
      case 'dataSource':
        break;
    }
  }
}
DataOption.include(_data_helper.default);
var _default = exports.default = DataOption;
module.exports = exports.default;
module.exports.default = exports.default;