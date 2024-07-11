"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _deferred = require("../core/utils/deferred");
var _extend = require("../core/utils/extend");
var _type = require("../core/utils/type");
var _array_store = _interopRequireDefault(require("../data/array_store"));
var _data_source = require("../data/data_source/data_source");
var _utils = require("../data/data_source/utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class DataController {
  constructor(dataSourceOptions, _ref) {
    let {
      key
    } = _ref;
    this._isSharedDataSource = false;
    this._keyExpr = key;
    this.updateDataSource(dataSourceOptions);
  }
  _updateDataSource(dataSourceOptions) {
    if (!dataSourceOptions) {
      return;
    }
    if (dataSourceOptions instanceof _data_source.DataSource) {
      this._isSharedDataSource = true;
      this._dataSource = dataSourceOptions;
    } else {
      const normalizedDataSourceOptions = (0, _utils.normalizeDataSourceOptions)(dataSourceOptions);
      this._dataSource = new _data_source.DataSource((0, _extend.extend)(true, {}, {}, normalizedDataSourceOptions));
    }
  }
  _updateDataSourceByItems(items) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this._dataSource = new _data_source.DataSource({
      store: new _array_store.default({
        key: this.key(),
        data: items
      }),
      pageSize: 0
    });
  }
  _disposeDataSource() {
    if (this._dataSource) {
      if (this._isSharedDataSource) {
        this._isSharedDataSource = false;
      } else {
        this._dataSource.dispose();
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      delete this._dataSource;
    }
  }
  load() {
    return this._dataSource.load();
  }
  loadSingle(propName, propValue) {
    if (!this._dataSource) {
      // @ts-expect-error TS2350
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new _deferred.Deferred().reject();
    }
    let pName = propName;
    let pValue = propValue;
    if (arguments.length < 2) {
      pValue = propName;
      pName = this.key();
    }
    return this._dataSource.loadSingle(pName, pValue);
  }
  loadFromStore(loadOptions) {
    return this.store().load(loadOptions);
  }
  loadNextPage() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    this.pageIndex(1 + this.pageIndex());
    return this.load();
  }
  loadOptions() {
    return this._dataSource.loadOptions();
  }
  userData() {
    return this._dataSource._userData;
  }
  cancel(operationId) {
    this._dataSource.cancel(operationId);
  }
  cancelAll() {
    this._dataSource.cancelAll();
  }
  filter(filter) {
    return this._dataSource.filter(filter);
  }
  addSearchFilter(storeLoadOptions) {
    this._dataSource._addSearchFilter(storeLoadOptions);
  }
  group(group) {
    return this._dataSource.group(group);
  }
  paginate() {
    return this._dataSource.paginate();
  }
  pageSize() {
    return this._dataSource._pageSize;
  }
  pageIndex(pageIndex) {
    if (pageIndex === undefined) {
      return this._dataSource.pageIndex(undefined);
    }
    return this._dataSource.pageIndex(pageIndex);
  }
  resetDataSource() {
    this._disposeDataSource();
  }
  resetDataSourcePageIndex() {
    if (this.pageIndex()) {
      this.pageIndex(0);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.load();
    }
  }
  updateDataSource(items, key) {
    const dataSourceOptions = items ?? this.items();
    if (key) {
      this._keyExpr = key;
    }
    this._disposeDataSource();
    if (Array.isArray(dataSourceOptions)) {
      this._updateDataSourceByItems(dataSourceOptions);
    } else {
      this._updateDataSource(dataSourceOptions);
    }
  }
  totalCount() {
    return this._dataSource.totalCount();
  }
  isLastPage() {
    return this._dataSource.isLastPage() || !this._dataSource._pageSize;
  }
  isLoading() {
    return this._dataSource.isLoading();
  }
  isLoaded() {
    return this._dataSource.isLoaded();
  }
  searchValue(value) {
    return this._dataSource.searchValue(value);
  }
  searchOperation(operation) {
    return this._dataSource.searchOperation(operation);
  }
  searchExpr(expr) {
    return this._dataSource.searchExpr(expr);
  }
  select() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return this._dataSource.select(args);
  }
  key() {
    var _this$_dataSource;
    const storeKey = (_this$_dataSource = this._dataSource) === null || _this$_dataSource === void 0 ? void 0 : _this$_dataSource.key();
    return (0, _type.isDefined)(storeKey) && this._keyExpr === 'this' ? storeKey : this._keyExpr;
  }
  keyOf(item) {
    return this.store().keyOf(item);
  }
  store() {
    return this._dataSource.store();
  }
  items() {
    var _this$_dataSource2;
    return (_this$_dataSource2 = this._dataSource) === null || _this$_dataSource2 === void 0 ? void 0 : _this$_dataSource2.items();
  }
  applyMapFunction(data) {
    return this._dataSource._applyMapFunction(data);
  }
  getDataSource() {
    return this._dataSource ?? null;
  }
  reload() {
    return this._dataSource.reload();
  }
  on(event, handler) {
    this._dataSource.on(event, handler);
  }
  off(event, handler) {
    this._dataSource.off(event, handler);
  }
}
var _default = exports.default = DataController;