import { DataSource } from './data/data_source/data_source';
import { normalizeDataSourceOptions } from './data/data_source/utils';
import { extend } from './core/utils/extend';
import ArrayStore from './data/array_store';

class DataController {
    constructor(dataSourceOptions) {
        this._initDataSource(dataSourceOptions);
    }

    static initFromArray(items, key) {
        const dataSource = new DataSource({
            store: new ArrayStore({
                key,
                data: items
            }),
            pageSize: 0,
        });
        return new DataController(dataSource);
    }

    _initDataSource(dataSourceOptions) {
        let widgetDataSourceOptions;
        let dataSourceType;

        this._disposeDataSource();

        if(dataSourceOptions) {
            if(dataSourceOptions instanceof DataSource) {
                this._isSharedDataSource = true;
                this._dataSource = dataSourceOptions;
            } else {
                widgetDataSourceOptions = {};
                dataSourceType = DataSource;

                dataSourceOptions = normalizeDataSourceOptions(dataSourceOptions);
                this._dataSource = new dataSourceType(extend(true, {}, widgetDataSourceOptions, dataSourceOptions));
            }
        }
    }

    _disposeDataSource() {
        if(this._dataSource) {
            if(this._isSharedDataSource) {
                delete this._isSharedDataSource;
            } else {
                this._dataSource.dispose();
            }

            delete this._dataSource;
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

    resetDataSource() {
        this._disposeDataSource();
    }

    resetDataSourcePageIndex() {
        if(this.pageIndex()) {
            this.pageIndex(0);
            this.load();
        }
    }

    initDataSource(dataSourceOptions) {
        this._initDataSource(dataSourceOptions);
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
        return this._dataSource?.key();
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

    itemsToDataSource(value, key) {
        if(!this._dataSource) {
            this._dataSource = new DataSource({
                store: new ArrayStore({
                    key,
                    data: value
                }),
                pageSize: 0,
            });
        }
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
