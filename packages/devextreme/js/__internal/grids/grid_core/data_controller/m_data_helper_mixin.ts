import { DataSource } from '@js/common/data/data_source/data_source';
import { normalizeDataSourceOptions } from '@js/common/data/data_source/utils';
import { extend } from '@js/core/utils/extend';
import DataController from '@ts/ui/collection/m_data_controller';

import type { Controller } from '../m_modules';
import type { ModuleType } from '../m_types';

const DATA_SOURCE_OPTIONS_METHOD = '_dataSourceOptions';
const DATA_SOURCE_CHANGED_METHOD = '_dataSourceChangedHandler';
const DATA_SOURCE_LOAD_ERROR_METHOD = '_dataSourceLoadErrorHandler';
const DATA_SOURCE_LOADING_CHANGED_METHOD = '_dataSourceLoadingChangedHandler';
const DATA_SOURCE_FROM_URL_LOAD_MODE_METHOD = '_dataSourceFromUrlLoadMode';
const SPECIFIC_DATA_SOURCE_OPTION = '_getSpecificDataSourceOption';
const NORMALIZE_DATA_SOURCE = '_normalizeDataSource';

// TODO Get rid of this mixin
export const DataHelperMixin = <T extends ModuleType<Controller>>(Base: T) => class DataHelperMixin extends Base {
  public _dataSource: any;

  protected _dataController: any;

  protected readyWatcher: any;

  private _proxiedDataSourceChangedHandler: any;

  private _proxiedDataSourceLoadErrorHandler: any;

  private _proxiedDataSourceLoadingChangedHandler: any;

  protected _isSharedDataSource: any;

  private readonly _dataSourceType: any;

  public postCtor() {
    this.on('disposing', () => {
      this._disposeDataSource();
    });
  }

  /**
   * @extended: state_storing, virtual_scrolling
   */
  protected _refreshDataSource() {
    this._initDataSource();
    this._loadDataSource();
  }

  protected _initDataSource() {
    let dataSourceOptions = SPECIFIC_DATA_SOURCE_OPTION in this
      ? (this[SPECIFIC_DATA_SOURCE_OPTION] as any)()
      : this.option('dataSource');

    let widgetDataSourceOptions;
    let dataSourceType;

    this._disposeDataSource();

    if (dataSourceOptions) {
      if (dataSourceOptions instanceof DataSource) {
        this._isSharedDataSource = true;
        this._dataSource = dataSourceOptions;
      } else {
        widgetDataSourceOptions = DATA_SOURCE_OPTIONS_METHOD in this
          ? (this[DATA_SOURCE_OPTIONS_METHOD] as any)()
          : {};

        dataSourceType = this._dataSourceType ? this._dataSourceType() : DataSource;

        dataSourceOptions = normalizeDataSourceOptions(dataSourceOptions, {
          fromUrlLoadMode: (DATA_SOURCE_FROM_URL_LOAD_MODE_METHOD in this) && (this[DATA_SOURCE_FROM_URL_LOAD_MODE_METHOD] as any)(),
        });

        // eslint-disable-next-line new-cap
        this._dataSource = new dataSourceType(extend(true, {}, widgetDataSourceOptions, dataSourceOptions));
      }

      if (NORMALIZE_DATA_SOURCE in this) {
        this._dataSource = (this[NORMALIZE_DATA_SOURCE] as any)(this._dataSource);
      }

      this._addDataSourceHandlers();
      this._initDataController();
    }
  }

  private _initDataController() {
    const dataController = this.option?.('_dataController');
    const dataSource = this._dataSource;

    if (dataController) {
      this._dataController = dataController;
    } else {
      this._dataController = new DataController(dataSource);
    }
  }

  private _addDataSourceHandlers() {
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

  private _addReadyWatcher() {
    this.readyWatcher = function (isLoading) {
      this._ready && this._ready(!isLoading);
    }.bind(this);
    this._dataSource.on('loadingChanged', this.readyWatcher);
  }

  private _addDataSourceChangeHandler() {
    const dataSource = this._dataSource;
    this._proxiedDataSourceChangedHandler = function (e) {
      this[DATA_SOURCE_CHANGED_METHOD](dataSource.items(), e);
    }.bind(this);
    dataSource.on('changed', this._proxiedDataSourceChangedHandler);
  }

  private _addDataSourceLoadErrorHandler() {
    this._proxiedDataSourceLoadErrorHandler = this[DATA_SOURCE_LOAD_ERROR_METHOD].bind(this);
    this._dataSource.on('loadError', this._proxiedDataSourceLoadErrorHandler);
  }

  private _addDataSourceLoadingChangedHandler() {
    this._proxiedDataSourceLoadingChangedHandler = this[DATA_SOURCE_LOADING_CHANGED_METHOD].bind(this);
    this._dataSource.on('loadingChanged', this._proxiedDataSourceLoadingChangedHandler);
  }

  protected _loadDataSource() {
    const dataSource = this._dataSource;
    if (dataSource) {
      if (dataSource.isLoaded()) {
        this._proxiedDataSourceChangedHandler && this._proxiedDataSourceChangedHandler();
      } else {
        dataSource.load();
      }
    }
  }

  private _loadSingle(key, value) {
    key = key === 'this' ? this._dataSource.key() || 'this' : key;
    return this._dataSource.loadSingle(key, value);
  }

  private _isLastPage() {
    return !this._dataSource || this._dataSource.isLastPage() || !this._dataSource._pageSize;
  }

  private _isDataSourceLoading() {
    return this._dataSource && this._dataSource.isLoading();
  }

  protected _disposeDataSource() {
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

  protected getDataSource() {
    return this._dataSource || null;
  }
};
