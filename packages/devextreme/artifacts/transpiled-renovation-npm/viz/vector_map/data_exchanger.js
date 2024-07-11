"use strict";

exports.DataExchanger = DataExchanger;
var _callbacks = _interopRequireDefault(require("../../core/utils/callbacks"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function DataExchanger() {
  this._store = {};
}
DataExchanger.prototype = {
  constructor: DataExchanger,
  dispose: function () {
    this._store = null;
    return this;
  },
  _get: function (category, name) {
    const store = this._store[category] || (this._store[category] = {});
    return store[name] || (store[name] = {
      callbacks: (0, _callbacks.default)()
    });
  },
  set: function (category, name, data) {
    const item = this._get(category, name);
    item.data = data;
    item.callbacks.fire(data);
    return this;
  },
  bind: function (category, name, callback) {
    const item = this._get(category, name);
    item.callbacks.add(callback);
    item.data && callback(item.data);
    return this;
  },
  unbind: function (category, name, callback) {
    const item = this._get(category, name);
    item.callbacks.remove(callback);
    return this;
  }
};