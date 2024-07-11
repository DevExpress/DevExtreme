"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataHelperMixin = void 0;
var _extend = require("../../../../core/utils/extend");
var _data_source = require("../../../../data/data_source/data_source");
var _utils = require("../../../../data/data_source/utils");
var _m_data_controller = _interopRequireDefault(require("../../../ui/collection/m_data_controller"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DATA_SOURCE_OPTIONS_METHOD = '_dataSourceOptions';
const DATA_SOURCE_CHANGED_METHOD = '_dataSourceChangedHandler';
const DATA_SOURCE_LOAD_ERROR_METHOD = '_dataSourceLoadErrorHandler';
const DATA_SOURCE_LOADING_CHANGED_METHOD = '_dataSourceLoadingChangedHandler';
const DATA_SOURCE_FROM_URL_LOAD_MODE_METHOD = '_dataSourceFromUrlLoadMode';
const SPECIFIC_DATA_SOURCE_OPTION = '_getSpecificDataSourceOption';
const NORMALIZE_DATA_SOURCE = '_normalizeDataSource';
// TODO Get rid of this mixin
const DataHelperMixin = Base => class DataHelperMixin extends Base {
  postCtor() {
    this.on('disposing', () => {
      this._disposeDataSource();
    });
  }
  /**
   * @extended: state_storing, virtual_scrolling
   */
  _refreshDataSource() {
    this._initDataSource();
    this._loadDataSource();
  }
  _initDataSource() {
    let dataSourceOptions = SPECIFIC_DATA_SOURCE_OPTION in this ? this[SPECIFIC_DATA_SOURCE_OPTION]() : this.option('dataSource');
    let widgetDataSourceOptions;
    let dataSourceType;
    this._disposeDataSource();
    if (dataSourceOptions) {
      if (dataSourceOptions instanceof _data_source.DataSource) {
        this._isSharedDataSource = true;
        this._dataSource = dataSourceOptions;
      } else {
        widgetDataSourceOptions = DATA_SOURCE_OPTIONS_METHOD in this ? this[DATA_SOURCE_OPTIONS_METHOD]() : {};
        dataSourceType = this._dataSourceType ? this._dataSourceType() : _data_source.DataSource;
        dataSourceOptions = (0, _utils.normalizeDataSourceOptions)(dataSourceOptions, {
          fromUrlLoadMode: DATA_SOURCE_FROM_URL_LOAD_MODE_METHOD in this && this[DATA_SOURCE_FROM_URL_LOAD_MODE_METHOD]()
        });
        // eslint-disable-next-line new-cap
        this._dataSource = new dataSourceType((0, _extend.extend)(true, {}, widgetDataSourceOptions, dataSourceOptions));
      }
      if (NORMALIZE_DATA_SOURCE in this) {
        this._dataSource = this[NORMALIZE_DATA_SOURCE](this._dataSource);
      }
      this._addDataSourceHandlers();
      this._initDataController();
    }
  }
  _initDataController() {
    var _this$option;
    const dataController = (_this$option = this.option) === null || _this$option === void 0 ? void 0 : _this$option.call(this, '_dataController');
    const dataSource = this._dataSource;
    if (dataController) {
      this._dataController = dataController;
    } else {
      this._dataController = new _m_data_controller.default(dataSource);
    }
  }
  _addDataSourceHandlers() {
    if (DATA_SOURCE_CHANGED_METHOD in this) {
      this._addDataSourceChangeHandler();
    }
    if (DATA_SOURCE_LOAD_ERROR_METHOD in this) {
      this._addDataSourceLoadErrorHandler();
    }
    if (DATA_SOURCE_LOADING_CHANGED_METHOD in this) {
      this._addDataSourceLoadingChangedHandler();
    }
    this._addReadyWatcher();
  }
  _addReadyWatcher() {
    this.readyWatcher = function (isLoading) {
      this._ready && this._ready(!isLoading);
    }.bind(this);
    this._dataSource.on('loadingChanged', this.readyWatcher);
  }
  _addDataSourceChangeHandler() {
    const dataSource = this._dataSource;
    this._proxiedDataSourceChangedHandler = function (e) {
      this[DATA_SOURCE_CHANGED_METHOD](dataSource.items(), e);
    }.bind(this);
    dataSource.on('changed', this._proxiedDataSourceChangedHandler);
  }
  _addDataSourceLoadErrorHandler() {
    this._proxiedDataSourceLoadErrorHandler = this[DATA_SOURCE_LOAD_ERROR_METHOD].bind(this);
    this._dataSource.on('loadError', this._proxiedDataSourceLoadErrorHandler);
  }
  _addDataSourceLoadingChangedHandler() {
    this._proxiedDataSourceLoadingChangedHandler = this[DATA_SOURCE_LOADING_CHANGED_METHOD].bind(this);
    this._dataSource.on('loadingChanged', this._proxiedDataSourceLoadingChangedHandler);
  }
  _loadDataSource() {
    const dataSource = this._dataSource;
    if (dataSource) {
      if (dataSource.isLoaded()) {
        this._proxiedDataSourceChangedHandler && this._proxiedDataSourceChangedHandler();
      } else {
        dataSource.load();
      }
    }
  }
  _loadSingle(key, value) {
    key = key === 'this' ? this._dataSource.key() || 'this' : key;
    return this._dataSource.loadSingle(key, value);
  }
  _isLastPage() {
    return !this._dataSource || this._dataSource.isLastPage() || !this._dataSource._pageSize;
  }
  _isDataSourceLoading() {
    return this._dataSource && this._dataSource.isLoading();
  }
  _disposeDataSource() {
    if (this._dataSource) {
      if (this._isSharedDataSource) {
        delete this._isSharedDataSource;
        this._proxiedDataSourceChangedHandler && this._dataSource.off('changed', this._proxiedDataSourceChangedHandler);
        this._proxiedDataSourceLoadErrorHandler && this._dataSource.off('loadError', this._proxiedDataSourceLoadErrorHandler);
        this._proxiedDataSourceLoadingChangedHandler && this._dataSource.off('loadingChanged', this._proxiedDataSourceLoadingChangedHandler);
        if (this._dataSource._eventsStrategy) {
          this._dataSource._eventsStrategy.off('loadingChanged', this.readyWatcher);
        }
      } else {
        this._dataSource.dispose();
      }
      delete this._dataSource;
      delete this._proxiedDataSourceChangedHandler;
      delete this._proxiedDataSourceLoadErrorHandler;
      delete this._proxiedDataSourceLoadingChangedHandler;
    }
  }
  getDataSource() {
    return this._dataSource || null;
  }
};
exports.DataHelperMixin = DataHelperMixin;