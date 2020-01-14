import Class from '../../core/class';
import { extend } from '../../core/utils/extend';
import commonUtils from '../../core/utils/common';
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
    generateStoreLoadOptionAccessor,
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

        /**
        * @name DataSourceOptions.pushAggregationTimeout
        * @type number
        * @default undefined
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

        /**
        * @name DataSourceOptions.store
        * @type Store|StoreOptions|Array<any>|any
        */
        this._store = options.store;
        this._store.on('push', this._onPushHandler);

        /**
        * @name DataSourceOptions.sort
        * @type Sort expression
        */

        /**
        * @name DataSourceOptions.filter
        * @type Filter expression
        */

        /**
        * @name DataSourceOptions.group
        * @type Group expression
        */

        /**
        * @name DataSourceOptions.select
        * @type Select expression
        */

        /**
        * @name DataSourceOptions.expand
        * @type Array<string>|string
        */

        /**
        * @name DataSourceOptions.customQueryParams
        * @type Object
        */

        /**
        * @name DataSourceOptions.requireTotalCount
        * @type Boolean
        */
        this._storeLoadOptions = this._extractLoadOptions(options);

        /**
        * @name DataSourceOptions.map
        * @type function
        * @type_function_param1 dataItem:object
        * @type_function_return object
        */
        this._mapFunc = options.map;

        /**
        * @name DataSourceOptions.postProcess
        * @type function
        * @type_function_param1 data:Array<any>
        * @type_function_return Array<any>
        */
        this._postProcessFunc = options.postProcess;

        this._pageIndex = (options.pageIndex !== undefined) ? options.pageIndex : 0;

        /**
        * @name DataSourceOptions.pageSize
        * @type number
        * @default 20
        */
        this._pageSize = (options.pageSize !== undefined) ? options.pageSize : 20;

        this._loadingCount = 0;
        this._loadQueue = this._createLoadQueue();

        /**
        * @name DataSourceOptions.searchValue
        * @type any
        * @default null
        */
        this._searchValue = ('searchValue' in options) ? options.searchValue : null;

        /**
        * @name DataSourceOptions.searchOperation
        * @type string
        * @default "contains"
        */
        this._searchOperation = options.searchOperation || 'contains';

        /**
        * @name DataSourceOptions.searchExpr
        * @type getter|Array<getter>
        */
        this._searchExpr = options.searchExpr;

        /**
        * @name DataSourceOptions.paginate
        * @type Boolean
        * @default undefined
        */
        this._paginate = options.paginate;

        /**
        * @name DataSourceOptions.reshapeOnPush
        * @type Boolean
        * @default false
        */
        this._reshapeOnPush = options.reshapeOnPush ?? false;

        each(
            [
                /**
                 * @name DataSourceOptions.onChanged
                 * @type function
                 * @type_function_param1 e:Object
                 * @type_function_param1_field1 changes:Array<any>
                 * @action
                 */
                'onChanged',

                /**
                 * @name DataSourceOptions.onLoadError
                 * @type function
                 * @type_function_param1 error:Object
                 * @type_function_param1_field1 message:string
                 * @action
                 */
                'onLoadError',

                /**
                 * @name DataSourceOptions.onLoadingChanged
                 * @type function
                 * @type_function_param1 isLoading:boolean
                 * @action
                 */
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

    /**
    * @name DataSourceMethods.dispose
    * @publicName dispose()
    */
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

    /**
    * @name DataSourceMethods.loadOptions
    * @publicName loadOptions()
    * @return object
    */
    loadOptions() {
        return this._storeLoadOptions;
    },

    /**
    * @name DataSourceMethods.items
    * @publicName items()
    * @return Array<any>
    */
    items() {
        return this._items;
    },

    /**
    * @name DataSourceMethods.pageIndex
    * @publicName pageIndex()
    * @return numeric
    */
    /**
    * @name DataSourceMethods.pageIndex
    * @publicName pageIndex(newIndex)
    * @param1 newIndex:numeric
    */
    pageIndex(newIndex) {
        if(!isNumeric(newIndex)) {
            return this._pageIndex;
        }

        this._pageIndex = newIndex;
        this._isLastPage = !this._paginate;
    },

    /**
    * @name DataSourceMethods.paginate
    * @publicName paginate()
    * @return Boolean
    */
    /**
    * @name DataSourceMethods.paginate
    * @publicName paginate(value)
    * @param1 value:Boolean
    */
    paginate(value) {
        if(!isBoolean(value)) {
            return this._paginate;
        }

        if(this._paginate !== value) {
            this._paginate = value;
            this.pageIndex(0);
        }
    },

    /**
    * @name DataSourceMethods.pageSize
    * @publicName pageSize()
    * @return numeric
    */
    /**
    * @name DataSourceMethods.pageSize
    * @publicName pageSize(value)
    * @param1 value:numeric
    */
    pageSize(value) {
        if(!isNumeric(value)) {
            return this._pageSize;
        }

        this._pageSize = value;
    },

    /**
    * @name DataSourceMethods.isLastPage
    * @publicName isLastPage()
    * @return boolean
    */
    isLastPage() {
        return this._isLastPage;
    },

    /**
    * @name DataSourceMethods.sort
    * @publicName sort()
    * @return any
    */
    /**
    * @name DataSourceMethods.sort
    * @publicName sort(sortExpr)
    * @param1 sortExpr:any
    */
    sort: generateStoreLoadOptionAccessor('sort'),

    /**
    * @name DataSourceMethods.filter
    * @publicName filter()
    * @return object
    */
    /**
    * @name DataSourceMethods.filter
    * @publicName filter(filterExpr)
    * @param1 filterExpr:object
    */
    filter() {
        const newFilter = normalizeStoreLoadOptionAccessorArguments(arguments);
        if(newFilter === undefined) {
            return this._storeLoadOptions.filter;
        }

        this._storeLoadOptions.filter = newFilter;
        this.pageIndex(0);
    },

    /**
    * @name DataSourceMethods.group
    * @publicName group()
    * @return object
    */
    /**
    * @name DataSourceMethods.group
    * @publicName group(groupExpr)
    * @param1 groupExpr:object
    */
    group: generateStoreLoadOptionAccessor('group'),

    /**
    * @name DataSourceMethods.select
    * @publicName select()
    * @return any
    */
    /**
    * @name DataSourceMethods.select
    * @publicName select(expr)
    * @param1 expr:any
    */
    select: generateStoreLoadOptionAccessor('select'),

    /**
    * @name DataSourceMethods.requireTotalCount
    * @publicName requireTotalCount()
    * @return boolean
    */
    /**
    * @name DataSourceMethods.requireTotalCount
    * @publicName requireTotalCount(value)
    * @param1 value:boolean
    */
    requireTotalCount(value) {
        if(!isBoolean(value)) {
            return this._storeLoadOptions.requireTotalCount;
        }

        this._storeLoadOptions.requireTotalCount = value;
    },

    /**
    * @name DataSourceMethods.searchValue
    * @publicName searchValue()
    * @return any
    */
    /**
    * @name DataSourceMethods.searchValue
    * @publicName searchValue(value)
    * @param1 value:any
    */
    searchValue(value) {
        if(arguments.length < 1) {
            return this._searchValue;
        }

        this._searchValue = value;
        this.pageIndex(0);
    },

    /**
    * @name DataSourceMethods.searchOperation
    * @publicName searchOperation()
    * @return string
    */
    /**
    * @name DataSourceMethods.searchOperation
    * @publicName searchOperation(op)
    * @param1 op:string
    */
    searchOperation(op) {
        if(!isString(op)) {
            return this._searchOperation;
        }

        this._searchOperation = op;
        this.pageIndex(0);
    },

    /**
    * @name DataSourceMethods.searchExpr
    * @publicName searchExpr()
    * @return getter|Array<getter>
    */
    /**
    * @name DataSourceMethods.searchExpr
    * @publicName searchExpr(expr)
    * @param1 expr:getter|Array<getter>
    */
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

    /**
    * @name DataSourceMethods.store
    * @publicName store()
    * @return object
    */
    store() {
        return this._store;
    },

    /**
    * @name DataSourceMethods.key
    * @publicName key()
    * @return object|string|number
    */
    key() {
        return this._store?.key();
    },

    /**
    * @name DataSourceMethods.totalCount
    * @publicName totalCount()
    * @return numeric
    */
    totalCount() {
        return this._totalCount;
    },

    /**
    * @name DataSourceMethods.isLoaded
    * @publicName isLoaded()
    * @return boolean
    */
    isLoaded() {
        return this._isLoaded;
    },

    /**
    * @name DataSourceMethods.isLoading
    * @publicName isLoading()
    * @return boolean
    */
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

    /**
    * @name DataSourceMethods.load
    * @publicName load()
    * @return Promise<any>
    */
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
                this._delayedLoadTask = commonUtils.executeAsync(loadTask, loadOperation.delay);
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

    /**
     * @name DataSourceMethods.reload
     * @publicName reload()
     * @return Promise<any>
     */
    reload() {
        const store = this.store();
        if(store instanceof CustomStore) {
            store.clearRawDataCache();
        }

        this._init();
        return this.load();
    },

    /**
     * @name DataSourceMethods.cancel
     * @publicName cancel(operationId)
     * @return boolean
     */
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

    /**
     * @name DataSourceMethods.on
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     */
    /**
     * @name DataSourceMethods.on
     * @publicName on(events)
     * @param1 events:object
     * @return this
     */
    on(eventName, eventHandler) {
        this._eventsStrategy.on(eventName, eventHandler);
        return this;
    },

    /**
     * @name DataSourceMethods.off
     * @publicName off(eventName)
     * @param1 eventName:string
     * @return this
     */
    /**
     * @name DataSourceMethods.off
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     */
    off(eventName, eventHandler) {
        this._eventsStrategy.off(eventName, eventHandler);
        return this;
    },
});
