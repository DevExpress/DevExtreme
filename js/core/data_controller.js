class DataController {
    constructor(dataSource) {
        this.updateDataSource(dataSource);
    }

    updateDataSource(dataSource) {
        this._dataSource = dataSource;
    }

    load() {
        return this._dataSource.load();
    }

    loadSingle(propName, propValue) {
        return this._dataSource.loadSingle(propName, propValue);
    }

    loadFromStore(loadOptions) {
        return this.store().load(loadOptions);
    }

    loadDataSource() {
        const dataSource = this._dataSource;

        if(dataSource) {
            if(dataSource.isLoaded()) {
                this._proxiedDataSourceChangedHandler && this._proxiedDataSourceChangedHandler();
            } else {
                dataSource.load();
            }
        }
    }

    loadNextPage() {
        this.pageIndex(1 + this.pageIndex());

        return this.load();
    }

    loadOptions() {
        return this._dataSource?.loadOptions();
    }

    cancel(operationId) {
        this._dataSource?.cancel(operationId);
    }

    cancelAll() {
        this._dataSource?.cancelAll();
    }

    filter(filter) {
        return this._dataSource?.filter(filter);
    }

    addSearchFilter(storeLoadOptions) {
        this._dataSource?._addSearchFilter(storeLoadOptions);
    }

    group(group) {
        return this._dataSource?.group(group);
    }

    paginate() {
        return this._dataSource?.paginate();
    }

    pageSize() {
        return this._dataSource?._pageSize;
    }

    pageIndex(pageIndex) {
        return this._dataSource?.pageIndex(pageIndex);
    }

    resetDataSourcePageIndex() {
        if(this.pageIndex()) {
            this.pageIndex(0);
            this.load();
        }
    }

    totalCount() {
        return this._dataSource?.totalCount();
    }

    isLastPage() {
        return !this._dataSource || this._dataSource.isLastPage() || !this._dataSource._pageSize;
    }

    isLoading() {
        return this._dataSource?.isLoading();
    }

    isLoaded() {
        return this._dataSource?.isLoaded();
    }

    searchValue(value) {
        if(!arguments.length) {
            return this._dataSource?.searchValue();
        }

        return this._dataSource?.searchValue(value);
    }

    searchOperation(operation) {
        return this._dataSource?.searchOperation(operation);
    }

    searchExpr(expr) {
        return this._dataSource?.searchExpr(expr);
    }

    select() {
        return this._dataSource && this._dataSource.select(...arguments);
    }

    isKeySpecified() {
        return !!(this._dataSource?.key());
    }

    key() {
        return this._dataSource?.key();
    }

    keyOf(item) {
        return this.store()?.keyOf(item);
    }

    store() {
        return this._dataSource?.store();
    }

    items() {
        return this._dataSource?.items();
    }

    applyMapFunction(data) {
        return this._dataSource?._applyMapFunction(data);
    }

    getDataSource() {
        return this._dataSource || null;
    }

    reload() {
        return this._dataSource?.reload();
    }

    on(event, handler) {
        this._dataSource?.on(event, handler);
    }

    off(event, handler) {
        this._dataSource?.off(event, handler);
    }
}

export default DataController;
