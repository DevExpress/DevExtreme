"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _common = require("../../../core/utils/common");
var _data = require("../../../core/utils/data");
var _deferred = require("../../../core/utils/deferred");
var _extend = require("../../../core/utils/extend");
var _type = require("../../../core/utils/type");
var _variable_wrapper = _interopRequireDefault(require("../../../core/utils/variable_wrapper"));
var _array_store = _interopRequireDefault(require("../../../data/array_store"));
var _data_source = require("../../../data/data_source/data_source");
var _data_helper = _interopRequireDefault(require("../../../data_helper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DataExpressionMixin = (0, _extend.extend)({}, _data_helper.default, {
  _dataExpressionDefaultOptions() {
    return {
      items: [],
      dataSource: null,
      itemTemplate: 'item',
      value: null,
      valueExpr: 'this',
      displayExpr: undefined
    };
  },
  _initDataExpressions() {
    this._compileValueGetter();
    this._compileDisplayGetter();
    this._initDynamicTemplates();
    this._initDataSource();
    this._itemsToDataSource();
  },
  _itemsToDataSource() {
    if (!this.option('dataSource')) {
      // TODO: try this.option("dataSource", new ...)
      this._dataSource = new _data_source.DataSource({
        store: new _array_store.default(this.option('items')),
        pageSize: 0
      });
      this._initDataController();
    }
  },
  _compileDisplayGetter() {
    this._displayGetter = (0, _data.compileGetter)(this._displayGetterExpr());
  },
  _displayGetterExpr() {
    return this.option('displayExpr');
  },
  _compileValueGetter() {
    this._valueGetter = (0, _data.compileGetter)(this._valueGetterExpr());
  },
  _valueGetterExpr() {
    return this.option('valueExpr') || 'this';
  },
  _loadValue(value) {
    const deferred = (0, _deferred.Deferred)();
    value = this._unwrappedValue(value);
    if (!(0, _type.isDefined)(value)) {
      return deferred.reject().promise();
    }
    this._loadSingle(this._valueGetterExpr(), value).done(item => {
      this._isValueEquals(this._valueGetter(item), value) ? deferred.resolve(item) : deferred.reject();
    }).fail(() => {
      deferred.reject();
    });
    this._loadValueDeferred = deferred;
    return deferred.promise();
  },
  _rejectValueLoading() {
    var _this$_loadValueDefer;
    (_this$_loadValueDefer = this._loadValueDeferred) === null || _this$_loadValueDefer === void 0 || _this$_loadValueDefer.reject({
      shouldSkipCallback: true
    });
  },
  _getCurrentValue() {
    return this.option('value');
  },
  _unwrappedValue(value) {
    value = value ?? this._getCurrentValue();
    if (value && this._dataSource && this._valueGetterExpr() === 'this') {
      value = this._getItemKey(value);
    }
    return _variable_wrapper.default.unwrap(value);
  },
  _getItemKey(value) {
    const key = this._dataSource.key();
    if (Array.isArray(key)) {
      const result = {};
      for (let i = 0, n = key.length; i < n; i++) {
        result[key[i]] = value[key[i]];
      }
      return result;
    }
    if (key && typeof value === 'object') {
      value = value[key];
    }
    return value;
  },
  _isValueEquals(value1, value2) {
    const dataSourceKey = this._dataSource && this._dataSource.key();
    let result = this._compareValues(value1, value2);
    if (!result && dataSourceKey && (0, _type.isDefined)(value1) && (0, _type.isDefined)(value2)) {
      if (Array.isArray(dataSourceKey)) {
        result = this._compareByCompositeKey(value1, value2, dataSourceKey);
      } else {
        result = this._compareByKey(value1, value2, dataSourceKey);
      }
    }
    return result;
  },
  _compareByCompositeKey(value1, value2, key) {
    const isObject = _type.isObject;
    if (!isObject(value1) || !isObject(value2)) {
      return false;
    }
    for (let i = 0, n = key.length; i < n; i++) {
      if (value1[key[i]] !== value2[key[i]]) {
        return false;
      }
    }
    return true;
  },
  _compareByKey(value1, value2, key) {
    const unwrapObservable = _variable_wrapper.default.unwrap;
    const valueKey1 = (0, _common.ensureDefined)(unwrapObservable(value1[key]), value1);
    const valueKey2 = (0, _common.ensureDefined)(unwrapObservable(value2[key]), value2);
    return this._compareValues(valueKey1, valueKey2);
  },
  _compareValues(value1, value2) {
    return (0, _data.toComparable)(value1, true) === (0, _data.toComparable)(value2, true);
  },
  _initDynamicTemplates: _common.noop,
  _setCollectionWidgetItemTemplate() {
    this._initDynamicTemplates();
    this._setCollectionWidgetOption('itemTemplate', this.option('itemTemplate'));
  },
  _getCollectionKeyExpr() {
    const valueExpr = this.option('valueExpr');
    const isValueExprField = (0, _type.isString)(valueExpr) && valueExpr !== 'this' || (0, _type.isFunction)(valueExpr);
    return isValueExprField ? valueExpr : null;
  },
  _dataExpressionOptionChanged(args) {
    // eslint-disable-next-line default-case
    switch (args.name) {
      case 'items':
        this._itemsToDataSource();
        this._setCollectionWidgetOption('items');
        break;
      case 'dataSource':
        this._initDataSource();
        break;
      case 'itemTemplate':
        this._setCollectionWidgetItemTemplate();
        break;
      case 'valueExpr':
        this._compileValueGetter();
        break;
      case 'displayExpr':
        this._compileDisplayGetter();
        this._initDynamicTemplates();
        this._setCollectionWidgetOption('displayExpr');
        break;
    }
  }
});
var _default = exports.default = DataExpressionMixin;