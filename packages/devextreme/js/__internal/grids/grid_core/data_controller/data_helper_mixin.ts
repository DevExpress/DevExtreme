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

type ProxiedDataSourceHandler = (...args: unknown[]) => void;

// TODO Get rid of this mixin
// eslint-disable-next-line @stylistic/max-len
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const DataHelperMixin = <T extends ModuleType<Controller>>(Base: T) => class extends Base {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public _dataSource?: any;

  protected _dataController?: DataController;

  protected readyWatcher?: (isLoading: boolean) => void;

  // Optional hook implemented by Widget-based consumers (see Widget#_ready).
  protected _ready?: (value?: boolean) => void;

  private _proxiedDataSourceChangedHandler?: ProxiedDataSourceHandler;

  private _proxiedDataSourceLoadErrorHandler?: ProxiedDataSourceHandler;

  private _proxiedDataSourceLoadingChangedHandler?: ProxiedDataSourceHandler;

  protected _isSharedDataSource?: boolean;

  private readonly _dataSourceType?: () => typeof DataSource;

  public postInit(): void {
    this.on('disposing', () => {
      this._disposeDataSource();
    });
  }

  /**
   * @extended: state_storing, virtual_scrolling
   */
  protected _refreshDataSource(): void {
    this._initDataSource();
    this._loadDataSource();
  }

  protected _initDataSource(): void {
    let dataSourceOptions = SPECIFIC_DATA_SOURCE_OPTION in this
      // @ts-expect-error dynamic mixin method
      ? this[SPECIFIC_DATA_SOURCE_OPTION]()
      : this.option('dataSource');

    this._disposeDataSource();

    if (dataSourceOptions) {
      if (dataSourceOptions instanceof DataSource) {
        this._isSharedDataSource = true;
        this._dataSource = dataSourceOptions;
      } else {
        const widgetDataSourceOptions = DATA_SOURCE_OPTIONS_METHOD in this
          // @ts-expect-error dynamic mixin method
          ? this[DATA_SOURCE_OPTIONS_METHOD]()
          : {};

        const DataSourceType = this._dataSourceType
          ? this._dataSourceType()
          : DataSource;

        dataSourceOptions = normalizeDataSourceOptions(dataSourceOptions, {
          fromUrlLoadMode: (DATA_SOURCE_FROM_URL_LOAD_MODE_METHOD in this)
            // @ts-expect-error dynamic mixin method
            && this[DATA_SOURCE_FROM_URL_LOAD_MODE_METHOD](),
        });

        this._dataSource = new DataSourceType(
          extend(true, {}, widgetDataSourceOptions, dataSourceOptions),
        );
      }

      if (NORMALIZE_DATA_SOURCE in this) {
        // @ts-expect-error dynamic mixin method
        this._dataSource = this[NORMALIZE_DATA_SOURCE](this._dataSource);
      }

      this._addDataSourceHandlers();
      this._initDataController();
    }
  }

  private _initDataController(): void {
    const dataController = this.option?.('_dataController');
    const dataSource = this._dataSource;

    if (dataController) {
      this._dataController = dataController;
    } else {
      this._dataController = new DataController(dataSource);
    }
  }

  private _addDataSourceHandlers(): void {
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

  private _addReadyWatcher(): void {
    this.readyWatcher = (isLoading: boolean): void => {
      this._ready?.(!isLoading);
    };
    this._dataSource.on('loadingChanged', this.readyWatcher);
  }

  private _addDataSourceChangeHandler(): void {
    const dataSource = this._dataSource;
    this._proxiedDataSourceChangedHandler = (e): void => {
      this[DATA_SOURCE_CHANGED_METHOD](dataSource.items(), e);
    };
    dataSource.on('changed', this._proxiedDataSourceChangedHandler);
  }

  private _addDataSourceLoadErrorHandler(): void {
    this._proxiedDataSourceLoadErrorHandler = this[DATA_SOURCE_LOAD_ERROR_METHOD].bind(this);
    this._dataSource.on('loadError', this._proxiedDataSourceLoadErrorHandler);
  }

  private _addDataSourceLoadingChangedHandler(): void {
    this._proxiedDataSourceLoadingChangedHandler = this[DATA_SOURCE_LOADING_CHANGED_METHOD]
      .bind(this);
    this._dataSource.on('loadingChanged', this._proxiedDataSourceLoadingChangedHandler);
  }

  protected _loadDataSource(): void {
    const dataSource = this._dataSource;
    if (dataSource) {
      if (dataSource.isLoaded()) {
        if (this._proxiedDataSourceChangedHandler) {
          this._proxiedDataSourceChangedHandler();
        }
      } else {
        dataSource.load();
      }
    }
  }

  protected _disposeDataSource(): void {
    if (this._dataSource) {
      if (this._isSharedDataSource) {
        delete this._isSharedDataSource;

        if (this._proxiedDataSourceChangedHandler) {
          this._dataSource.off('changed', this._proxiedDataSourceChangedHandler);
        }
        if (this._proxiedDataSourceLoadErrorHandler) {
          this._dataSource.off('loadError', this._proxiedDataSourceLoadErrorHandler);
        }
        if (this._proxiedDataSourceLoadingChangedHandler) {
          this._dataSource.off('loadingChanged', this._proxiedDataSourceLoadingChangedHandler);
        }

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected getDataSource(): any | null {
    return this._dataSource ?? null;
  }
};
