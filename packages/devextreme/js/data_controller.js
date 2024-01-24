import { noop } from './core/utils/common';
import { Deferred } from './core/utils/deferred';
import { DataSource } from './data/data_source/data_source';
import { normalizeDataSourceOptions } from './data/data_source/utils';
import { extend } from './core/utils/extend';

const DataControllerMock = {
    load: () => Deferred().reject(),
    loadSingle: () => Deferred().reject(),
    loadFromStore: () => Deferred().reject(),
    loadNextPage: () => Deferred().reject(),
    loadOptions: noop,
    userData: noop,
    cancel: noop,
    cancelAll: noop,
    filter: noop,
    addSearchFilter: noop,
    group: noop,
    paginate: noop,
    pageSize: noop,
    pageIndex: noop,
    resetDataSourcePageIndex: noop,
    totalCount: noop,
    isLastPage: noop,
    isLoading: noop,
    isLoaded: noop,
    searchValue: noop,
    searchOperation: noop,
    searchExpr: noop,
    select: noop,
    key: noop,
    keyOf: noop,
    store: noop,
    items: noop,
    applyMapFunction: noop,
    getDataSource: noop,
    reload: noop,
    on: noop,
    off: noop,
};

class DataController {
    constructor(dataSourceOptions) {
        if(!dataSourceOptions) {
            return DataControllerMock;
        }
        this._initDataSource(dataSourceOptions);
    }

    _initDataSource(dataSourceOptions) {
        let widgetDataSourceOptions;
        let dataSourceType;

        this._disposeDataSource();

        if(dataSourceOptions) {
            if(dataSourceOptions instanceof DataSource) {
                // this._isSharedDataSource = true;
                this._dataSource = dataSourceOptions;
            } else {
                widgetDataSourceOptions = {};
                dataSourceType = DataSource;

                dataSourceOptions = normalizeDataSourceOptions(dataSourceOptions, {
                    fromUrlLoadMode: null // (DATA_SOURCE_FROM_URL_LOAD_MODE_METHOD in this) && this[DATA_SOURCE_FROM_URL_LOAD_MODE_METHOD]()
                });

                this._dataSource = new dataSourceType(extend(true, {}, widgetDataSourceOptions, dataSourceOptions));
            }

            // if(NORMALIZE_DATA_SOURCE in this) {
            //     this._dataSource = this[NORMALIZE_DATA_SOURCE](this._dataSource);
            // }

            this._addReadyWatcher();
        }
    }

    _addReadyWatcher() {
        // this.readyWatcher = (function(isLoading) {
        //     this._ready && this._ready(!isLoading);
        // }).bind(this);
        // this._dataSource.on('loadingChanged', this.readyWatcher);
    }

    _disposeDataSource() {
        if(this._dataSource) {
            if(this._isSharedDataSource) {
                delete this._isSharedDataSource;

                // this._proxiedDataSourceChangedHandler && this._dataSource.off('changed', this._proxiedDataSourceChangedHandler);
                // this._proxiedDataSourceLoadErrorHandler && this._dataSource.off('loadError', this._proxiedDataSourceLoadErrorHandler);
                // this._proxiedDataSourceLoadingChangedHandler && this._dataSource.off('loadingChanged', this._proxiedDataSourceLoadingChangedHandler);

                if(this._dataSource._eventsStrategy) {
                    // this._dataSource._eventsStrategy.off('loadingChanged', this.readyWatcher);
                }
            } else {
                this._dataSource.dispose();
            }

            delete this._dataSource;

            // delete this._proxiedDataSourceChangedHandler;
            // delete this._proxiedDataSourceLoadErrorHandler;
            // delete this._proxiedDataSourceLoadingChangedHandler;
        }
    }

    load() {
        return this._dataSource.load();
    }

    loadSingle(propName, propValue) {
        if(arguments.length < 2) {
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
        if(this.pageIndex()) {
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
        if(!arguments.length) {
            return this._dataSource.searchValue();
        }

        return this._dataSource.searchValue(value);
    }

    searchOperation(operation) {
        return this._dataSource.searchOperation(operation);
    }

    searchExpr(expr) {
        if(!arguments.length) {
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

export default DataController;
