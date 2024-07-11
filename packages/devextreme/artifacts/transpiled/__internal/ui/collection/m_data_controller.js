"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _common = require("../../../core/utils/common");
var _deferred = require("../../../core/utils/deferred");
const DataControllerMock = {
  load: () => (0, _deferred.Deferred)().reject(),
  loadSingle: () => (0, _deferred.Deferred)().reject(),
  loadFromStore: () => (0, _deferred.Deferred)().reject(),
  loadNextPage: () => (0, _deferred.Deferred)().reject(),
  loadOptions: _common.noop,
  userData: _common.noop,
  cancel: _common.noop,
  cancelAll: _common.noop,
  filter: _common.noop,
  addSearchFilter: _common.noop,
  group: _common.noop,
  paginate: _common.noop,
  pageSize: _common.noop,
  pageIndex: _common.noop,
  resetDataSourcePageIndex: _common.noop,
  totalCount: _common.noop,
  isLastPage: _common.noop,
  isLoading: _common.noop,
  isLoaded: _common.noop,
  searchValue: _common.noop,
  searchOperation: _common.noop,
  searchExpr: _common.noop,
  select: _common.noop,
  key: _common.noop,
  keyOf: _common.noop,
  store: _common.noop,
  items: _common.noop,
  applyMapFunction: _common.noop,
  getDataSource: _common.noop,
  reload: _common.noop,
  on: _common.noop,
  off: _common.noop
};
class DataController {
  constructor(dataSource) {
    if (!dataSource) {
      // @ts-expect-error
      // eslint-disable-next-line no-constructor-return
      return DataControllerMock;
    }
    this._dataSource = dataSource;
  }
  load() {
    return this._dataSource.load();
  }
  loadSingle(propName, propValue) {
    if (arguments.length < 2) {
      propValue = propName;
      propName = this.key();
    }
    return this._dataSource.loadSingle(propName, propValue);
  }
  loadFromStore(loadOptions) {
    return this.store().load(loadOptions);
  }
  loadNextPage() {
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
    return this._dataSource.pageIndex(pageIndex);
  }
  resetDataSourcePageIndex() {
    if (this.pageIndex()) {
      this.pageIndex(0);
      this.load();
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
    if (!arguments.length) {
      return this._dataSource.searchValue();
    }
    return this._dataSource.searchValue(value);
  }
  searchOperation(operation) {
    return this._dataSource.searchOperation(operation);
  }
  searchExpr(expr) {
    if (!arguments.length) {
      return this._dataSource.searchExpr();
    }
    return this._dataSource.searchExpr(expr);
  }
  select() {
    return this._dataSource.select(...arguments);
  }
  key() {
    return this._dataSource.key();
  }
  keyOf(item) {
    return this.store().keyOf(item);
  }
  store() {
    return this._dataSource.store();
  }
  items() {
    return this._dataSource.items();
  }
  applyMapFunction(data) {
    return this._dataSource._applyMapFunction(data);
  }
  getDataSource() {
    return this._dataSource || null;
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