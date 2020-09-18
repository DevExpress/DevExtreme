import Class from '../../core/class';
import { extend } from '../../core/utils/extend';
import { executeAsync } from '../../core/utils/common';
import { each } from '../../core/utils/iterator';
import { isString, isNumeric, isBoolean, isDefined, isPlainObject } from '../../core/utils/type';
import { throttleChanges } from '../utils';
import arrayUtils from '../array_utils';
import CustomStore from '../custom_store';
import { EventsStrategy } from '../../core/events_strategy';
import { errors } from '../errors';
import array from '../../core/utils/array';
import queue from '../../core/utils/queue';
import { Deferred, when } from '../../core/utils/deferred';
import OperationManager from './operation_manager';
import {
    normalizeDataSourceOptions,
    normalizeStoreLoadOptionAccessorArguments,
    CANCELED_TOKEN,
    isPending,
    normalizeLoadResult,
    mapDataRespectingGrouping
} from './utils';

export const DataSource = Class.inherit({
    /**
    * @name DataSourceMethods.ctor
    * @publicName ctor(url)
    * @param1 url:string
    * @hidden
    */
    /**
    * @name DataSourceMethods.ctor
    * @publicName ctor(data)
    * @param1 data:Array<any>
    * @hidden
    */
    /**
    * @name DataSourceMethods.ctor
    * @publicName ctor(store)
    * @param1 store:Store
    * @hidden
    */
    /**
    * @name DataSourceMethods.ctor
    * @publicName ctor(options)
    * @param1 options:CustomStoreOptions|DataSourceOptions
    * @hidden
    */
    ctor(options) {
        options = normalizeDataSourceOptions(options);
        this._eventsStrategy = new EventsStrategy(this);

        /**
        * @name DataSourceOptions.store.type
        * @type Enums.DataSourceStoreType
        */

        const onPushHandler = options.pushAggregationTimeout !== 0
            ? throttleChanges(this._onPush, () =>
                options.pushAggregationTimeout === undefined
                    ? this._changedTime * 5
                    : options.pushAggregationTimeout
            )
            : this._onPush;

        this._changedTime = 0;

        this._onPushHandler = (changes) => {
            this._aggregationTimeoutId = onPushHandler.call(this, changes);
        };

        this._store = options.store;
        this._store.on('push', this._onPushHandler);


        this._storeLoadOptions = this._extractLoadOptions(options);

        this._mapFunc = options.map;

        this._postProcessFunc = options.postProcess;

        this._pageIndex = (options.pageIndex !== undefined) ? options.pageIndex : 0;

        this._pageSize = (options.pageSize !== undefined) ? options.pageSize : 20;

        this._loadingCount = 0;
        this._loadQueue = this._createLoadQueue();

        this._searchValue = ('searchValue' in options) ? options.searchValue : null;

        this._searchOperation = options.searchOperation || 'contains';

        this._searchExpr = options.searchExpr;

        this._paginate = options.paginate;

        this._reshapeOnPush = options.reshapeOnPush ?? false;

        each(
            [
                'onChanged',

                'onLoadError',

                'onLoadingChanged',

                'onCustomizeLoadResult',
                'onCustomizeStoreLoadOptions'
            ],
            (_, optionName) => {
                if(optionName in options) {
                    this.on(optionName.substr(2, 1).toLowerCase() + optionName.substr(3), options[optionName]);
                }
            });

        this._operationManager = new OperationManager();
        this._init();
    },

    _init() {
        this._items = [];
        this._userData = {};
        this._totalCount = -1;
        this._isLoaded = false;

        if(!isDefined(this._paginate)) {
            this._paginate = !this.group();
        }

        this._isLastPage = !this._paginate;
    },

    dispose() {
        this._store.off('push', this._onPushHandler);
        this._eventsStrategy.dispose();
        clearTimeout(this._aggregationTimeoutId);

        delete this._store;

        this._delayedLoadTask?.abort();

        this._operationManager.cancelAll();

        this._disposed = true;
    },

    _extractLoadOptions(options) {
        const result = {};
        let names = ['sort', 'filter', 'select', 'group', 'requireTotalCount'];
        const customNames = this._store._customLoadOptions();

        if(customNames) {
            names = names.concat(customNames);
        }

        each(names, function() {
            result[this] = options[this];
        });
        return result;
    },

    loadOptions() {
        return this._storeLoadOptions;
    },

    items() {
        return this._items;
    },

    pageIndex(newIndex) {
        if(!isNumeric(newIndex)) {
            return this._pageIndex;
        }

        this._pageIndex = newIndex;
        this._isLastPage = !this._paginate;
    },

    paginate(value) {
        if(!isBoolean(value)) {
            return this._paginate;
        }

        if(this._paginate !== value) {
            this._paginate = value;
            this.pageIndex(0);
        }
    },

    pageSize(value) {
        if(!isNumeric(value)) {
            return this._pageSize;
        }

        this._pageSize = value;
    },

    isLastPage() {
        return this._isLastPage;
    },

    generateStoreLoadOptionAccessor(optionName) {
        return (args) => {
            const normalizedArgs = normalizeStoreLoadOptionAccessorArguments(args);
            if(normalizedArgs === undefined) {
                return this._storeLoadOptions[optionName];
            }

            this._storeLoadOptions[optionName] = normalizedArgs;
        };
    },

    sort(...args) {
        return this.generateStoreLoadOptionAccessor('sort')(args);
    },

    filter() {
        const newFilter = normalizeStoreLoadOptionAccessorArguments(arguments);
        if(newFilter === undefined) {
            return this._storeLoadOptions.filter;
        }

        this._storeLoadOptions.filter = newFilter;
        this.pageIndex(0);
    },

    group(...args) {
        return this.generateStoreLoadOptionAccessor('group')(args);
    },

    select(...args) {
        return this.generateStoreLoadOptionAccessor('select')(args);
    },

    requireTotalCount(value) {
        if(!isBoolean(value)) {
            return this._storeLoadOptions.requireTotalCount;
        }

        this._storeLoadOptions.requireTotalCount = value;
    },

    searchValue(value) {
        if(arguments.length < 1) {
            return this._searchValue;
        }

        this._searchValue = value;
        this.pageIndex(0);
    },

    searchOperation(op) {
        if(!isString(op)) {
            return this._searchOperation;
        }

        this._searchOperation = op;
        this.pageIndex(0);
    },

    searchExpr(expr) {
        const argc = arguments.length;

        if(argc === 0) {
            return this._searchExpr;
        }

        if(argc > 1) {
            expr = [].slice.call(arguments);
        }

        this._searchExpr = expr;
        this.pageIndex(0);
    },

    store() {
        return this._store;
    },

    key() {
        return this._store?.key();
    },

    totalCount() {
        return this._totalCount;
    },

    isLoaded() {
        return this._isLoaded;
    },

    isLoading() {
        return this._loadingCount > 0;
    },

    beginLoading() {
        this._changeLoadingCount(1);
    },

    endLoading() {
        this._changeLoadingCount(-1);
    },

    _createLoadQueue() {
        return queue.create();
    },

    _changeLoadingCount(increment) {
        const oldLoading = this.isLoading();

        this._loadingCount += increment;
        const newLoading = this.isLoading();

        if(oldLoading ^ newLoading) {
            this._eventsStrategy.fireEvent('loadingChanged', [newLoading]);
        }
    },

    _scheduleLoadCallbacks(deferred) {
        this.beginLoading();

        deferred.always(() => {
            this.endLoading();
        });
    },

    _scheduleFailCallbacks(deferred) {
        deferred.fail((...args) => {
            if(args[0] === CANCELED_TOKEN) {
                return;
            }

            this._eventsStrategy.fireEvent('loadError', args);
        });
    },

    _fireChanged(args) {
        const date = new Date();
        this._eventsStrategy.fireEvent('changed', args);
        this._changedTime = new Date() - date;
    },

    _scheduleChangedCallbacks(deferred) {
        deferred.done(() => this._fireChanged());
    },

    loadSingle(propName, propValue) {
        const d = new Deferred();
        const key = this.key();
        const store = this._store;
        const options = this._createStoreLoadOptions();
        const handleDone = (data) => {
            if(!isDefined(data) || array.isEmpty(data)) {
                d.reject(new errors.Error('E4009'));
            } else {
                if(!Array.isArray(data)) {
                    data = [data];
                }
                d.resolve(this._applyMapFunction(data)[0]);
            }
        };

        this._scheduleFailCallbacks(d);

        if(arguments.length < 2) {
            propValue = propName;
            propName = key;
        }

        delete options.skip;
        delete options.group;
        delete options.refresh;
        delete options.pageIndex;
        delete options.searchString;

        const shouldForceByKey = () => (store instanceof CustomStore) && !store._byKeyViaLoad();

        (() => {

            // NOTE for CustomStore always using byKey for backward compatibility with "old user datasource"
            if(propName === key || shouldForceByKey()) {
                return store.byKey(propValue, options);
            }

            options.take = 1;
            options.filter = options.filter
                ? [options.filter, [propName, propValue]]
                : [propName, propValue];

            return store.load(options);

        })().fail(d.reject).done(handleDone);

        return d.promise();
    },

    load() {
        const d = new Deferred();

        const loadTask = () => {
            if(this._disposed) {
                return undefined;
            }

            if(!isPending(d)) {
                return;
            }

            return this._loadFromStore(loadOperation, d);
        };

        this._scheduleLoadCallbacks(d);
        this._scheduleFailCallbacks(d);
        this._scheduleChangedCallbacks(d);

        const loadOperation = this._createLoadOperation(d);

        this._eventsStrategy.fireEvent('customizeStoreLoadOptions', [loadOperation]);

        this._loadQueue.add(() => {
            if(typeof loadOperation.delay === 'number') {
                this._delayedLoadTask = executeAsync(loadTask, loadOperation.delay);
            } else {
                loadTask();
            }
            return d.promise();
        });

        return d.promise({
            operationId: loadOperation.operationId
        });
    },

    _onPush(changes) {
        if(this._reshapeOnPush) {
            this.load();
        } else {
            this._eventsStrategy.fireEvent('changing', [{ changes }]);

            const group = this.group();
            const items = this.items();
            let groupLevel = 0;
            const dataSourceChanges = this.paginate() || group ? changes.filter(item => item.type === 'update') : changes;

            if(group) {
                groupLevel = Array.isArray(group) ? group.length : 1;
            }

            if(this._mapFunc) {
                dataSourceChanges.forEach((item) => {
                    if(item.type === 'insert') {
                        item.data = this._mapFunc(item.data);
                    }
                });
            }

            arrayUtils.applyBatch(this.store(), items, dataSourceChanges, groupLevel, true);
            this._fireChanged([{ changes: changes }]);
        }
    },

    _createLoadOperation(deferred) {
        const operationId = this._operationManager.add(deferred);
        const storeLoadOptions = this._createStoreLoadOptions();

        deferred.always(() => this._operationManager.remove(operationId));

        return {
            operationId,
            storeLoadOptions
        };
    },

    reload() {
        const store = this.store();
        if(store instanceof CustomStore) {
            store.clearRawDataCache();
        }

        this._init();
        return this.load();
    },

    cancel(operationId) {
        return this._operationManager.cancel(operationId);
    },

    cancelAll() {
        return this._operationManager.cancelAll();
    },

    _addSearchOptions(storeLoadOptions) {
        if(this._disposed) {
            return;
        }

        if(this.store()._useDefaultSearch) {
            this._addSearchFilter(storeLoadOptions);
        } else {
            storeLoadOptions.searchOperation = this._searchOperation;
            storeLoadOptions.searchValue = this._searchValue;
            storeLoadOptions.searchExpr = this._searchExpr;
        }
    },

    _createStoreLoadOptions() {
        const result = extend({}, this._storeLoadOptions);
        this._addSearchOptions(result);

        if(this._paginate) {
            if(this._pageSize) {
                result.skip = this._pageIndex * this._pageSize;
                result.take = this._pageSize;
            }
        }

        result.userData = this._userData;

        return result;
    },

    _addSearchFilter(storeLoadOptions) {
        const value = this._searchValue;
        const op = this._searchOperation;
        let selector = this._searchExpr;
        const searchFilter = [];

        if(!value) {
            return;
        }

        if(!selector) {
            selector = 'this';
        }

        if(!Array.isArray(selector)) {
            selector = [selector];
        }

        // TODO optimize for byKey case

        each(selector, function(i, item) {
            if(searchFilter.length) {
                searchFilter.push('or');
            }

            searchFilter.push([item, op, value]);
        });

        if(storeLoadOptions.filter) {
            storeLoadOptions.filter = [searchFilter, storeLoadOptions.filter];
        } else {
            storeLoadOptions.filter = searchFilter;
        }
    },

    _loadFromStore(loadOptions, pendingDeferred) {
        const handleSuccess = (data, extra) => {
            if(this._disposed) {
                return;
            }

            if(!isPending(pendingDeferred)) {
                return;
            }

            // Process result
            const loadResult = extend(normalizeLoadResult(data, extra), loadOptions);

            this._eventsStrategy.fireEvent('customizeLoadResult', [loadResult]);
            when(loadResult.data).done((data) => {
                loadResult.data = data;
                this._processStoreLoadResult(loadResult, pendingDeferred);
            }).fail(pendingDeferred.reject);
        };

        if(loadOptions.data) {
            return new Deferred().resolve(loadOptions.data).done(handleSuccess);
        }

        return this.store().load(loadOptions.storeLoadOptions)
            .done(handleSuccess)
            .fail(pendingDeferred.reject);
    },

    _processStoreLoadResult(loadResult, pendingDeferred) {
        let data = loadResult.data;
        let extra = loadResult.extra;
        const storeLoadOptions = loadResult.storeLoadOptions;

        const resolvePendingDeferred = () => {
            this._isLoaded = true;
            this._totalCount = isFinite(extra.totalCount) ? extra.totalCount : -1;
            return pendingDeferred.resolve(data, extra);
        };

        const proceedLoadingTotalCount = () => {
            this.store().totalCount(storeLoadOptions)
                .done(function(count) {
                    extra.totalCount = count;
                    resolvePendingDeferred();
                })
                .fail(pendingDeferred.reject);
        };

        if(this._disposed) {
            return;
        }

        // todo: if operation is canceled there is no need to do data transformation

        data = this._applyPostProcessFunction(this._applyMapFunction(data));

        if(!isPlainObject(extra)) {
            extra = {};
        }

        this._items = data;

        if(!data.length || !this._paginate || (this._pageSize && (data.length < this._pageSize))) {
            this._isLastPage = true;
        }

        if(storeLoadOptions.requireTotalCount && !isFinite(extra.totalCount)) {
            proceedLoadingTotalCount();
        } else {
            resolvePendingDeferred();
        }
    },

    _applyMapFunction(data) {
        if(this._mapFunc) {
            return mapDataRespectingGrouping(data, this._mapFunc, this.group());
        }

        return data;
    },

    _applyPostProcessFunction(data) {
        if(this._postProcessFunc) {
            return this._postProcessFunc(data);
        }

        return data;
    },

    on(eventName, eventHandler) {
        this._eventsStrategy.on(eventName, eventHandler);
        return this;
    },

    off(eventName, eventHandler) {
        this._eventsStrategy.off(eventName, eventHandler);
        return this;
    },
});
