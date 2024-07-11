"use strict";

exports.plugin = void 0;
var _common = require("../../core/utils/common");
var _data_helper = _interopRequireDefault(require("../../data_helper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const postCtor = _data_helper.default.postCtor;
let name;
const members = {
  _dataSourceLoadErrorHandler: function () {
    this._dataSourceChangedHandler();
  },
  _dataSourceOptions: function () {
    return {
      paginate: false
    };
  },
  _updateDataSource: function () {
    this._refreshDataSource();
    if (!this.option('dataSource')) {
      this._dataSourceChangedHandler();
    }
  },
  _dataIsLoaded: function () {
    return !this._dataSource || this._dataSource.isLoaded();
  },
  _dataSourceItems: function () {
    return this._dataSource && this._dataSource.items();
  }
};
for (name in _data_helper.default) {
  if (name === 'postCtor') {
    continue;
  }
  members[name] = _data_helper.default[name];
}
const plugin = exports.plugin = {
  name: 'data_source',
  init: function () {
    postCtor.call(this);
  },
  dispose: _common.noop,
  members: members
};