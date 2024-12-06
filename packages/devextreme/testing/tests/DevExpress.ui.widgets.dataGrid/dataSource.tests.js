import $ from 'jquery';
import { logger } from 'core/utils/console';
import { DataSource } from 'common/data/data_source/data_source';
import ArrayStore from 'common/data/array_store';
import { CustomStore } from 'common/data/custom_store';
import ODataStore from 'common/data/odata/store';
import dataQuery from 'common/data/query';
import { queryByOptions } from 'common/data/store_helper';
import gridCore from '__internal/grids/data_grid/m_core';
import { createOffsetFilter } from '__internal/grids/data_grid/grouping/m_grouping_core';
import { setupDataGridModules } from '../../helpers/dataGridMocks.js';
import { loadTotalCount, GroupingHelper as ExpandedGroupingHelper } from '__internal/grids/data_grid/grouping/m_grouping_expanded';
import { getContinuationGroupCount, GroupingHelper as CollapsedGroupingHelper } from '__internal/grids/data_grid/grouping/m_grouping_collapsed';

import 'ui/data_grid';

let TEN_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const createDataSource = function(options) {
    options._preferSync = true;
    const dataSource = new DataSource(options);

    const dataGridStub = {
        options: {
            scrolling: options.scrolling,
            cacheEnabled: options.cacheEnabled,
            remoteOperations: options.remoteOperations,
            loadingTimeout: options.loadingTimeout !== undefined ? options.loadingTimeout : (options.asyncLoadEnabled ? 0 : undefined)
        }
    };

    setupDataGridModules(dataGridStub, ['data', 'columns']);

    const dataSourceAdapter = dataGridStub.dataController._createDataSourceAdapter(dataSource);

    const origItems = dataSourceAdapter.items;
    const processItems = function(items) {
        for(let i = 0; i < items.length; i++) {
            if(typeof items[i] === 'object') {
                if('items' in items[i] && items[i].items !== null) {
                    processItems(items[i].items);
                }
                if('collapsedItems' in items[i]) {
                    delete items[i]['collapsedItems'];
                }
                if('key' in items[i] && 'items' in items[i] && 'count' in items[i]) {
                    delete items[i]['count'];
                }
            }
        }
    };

    dataSourceAdapter.items = function() {
        const items = origItems.apply(this, arguments);

        processItems(items);

        return items;
    };

    return dataSourceAdapter;
};


QUnit.module('Grid DataSource', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        TEN_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        this.clock.restore();
    }
}, () => {

    QUnit.test('page index parallel change', function(assert) {
        const loadingPages = [];
        const source = createDataSource({
            store: {
                onLoading: function(options) {
                    loadingPages.push(source.pageIndex());
                },
                type: 'array',
                data: TEN_NUMBERS
            },
            pageSize: 3,
            asyncLoadEnabled: true,
            requireTotalCount: true,
            remoteOperations: { filtering: true, sorting: true, paging: true }
        });
        let changeCallCount = 0;

        source.load().done(function() {
            source.changed.add(function(options) {
                changeCallCount++;
            });

            source.pageIndex(1);
            source.load();

            source.pageIndex(2);
            source.load();

            source.pageIndex(3);
            source.load();
        });

        this.clock.tick(10);

        assert.equal(changeCallCount, 1);
        assert.equal(source.pageIndex(), 3);
        assert.equal(loadingPages.length, 2, 'one loading occurs');
        assert.deepEqual(loadingPages, [0, 3], 'last loading occurs');
        assert.ok(!source.isLoading(), 'loading completed');
    });

    QUnit.test('get page size if paginate enabled', function(assert) {
        const source = createDataSource({
            store: TEN_NUMBERS,
            pageSize: 3
        });
        let changeCallCount = 0;

        source.load().done(function() {
            changeCallCount++;
        });

        this.clock.tick(10);

        assert.equal(changeCallCount, 1);
        assert.equal(source.pageSize(), 3);
    });

    QUnit.test('get page size if paginate disabled', function(assert) {
        const source = createDataSource({
            store: TEN_NUMBERS,
            pageSize: 3,
            paginate: false
        });
        let changeCallCount = 0;

        source.load().done(function() {
            changeCallCount++;
        });

        this.clock.tick(10);

        assert.equal(changeCallCount, 1);
        assert.equal(source.pageSize(), 0);
    });

    QUnit.test('page size change', function(assert) {
        const source = createDataSource({
            store: TEN_NUMBERS,
            pageSize: 3
        });
        let changeCallCount = 0;

        source.load().done(function() {
            assert.equal(source.items().length, 3);
            source.pageSize(5);
            source.load().done(function() {
                changeCallCount++;
            });
        });

        this.clock.tick(10);

        assert.equal(changeCallCount, 1);
        assert.deepEqual(source.items(), [1, 2, 3, 4, 5]);
    });

    QUnit.test('reload do not reset pageIndex', function(assert) {
        const source = createDataSource({
            store: TEN_NUMBERS,
            pageSize: 3
        });

        source.load();
        source.pageIndex(1);

        // act
        source.reload();

        // assert
        assert.equal(source.pageIndex(), 1);
        assert.equal(source.items().length, 3);
        assert.equal(source.items()[0], 4);
    });

    QUnit.test('reload full reset isLoaded', function(assert) {
        const source = createDataSource({
            store: TEN_NUMBERS,
            pageSize: 3,
            asyncLoadEnabled: true
        });
        let finalized;

        source.load().done(function() {
            assert.ok(source.isLoaded());
            // act
            source.reload(true);
            // assert
            assert.ok(!source.isLoaded());

            finalized = true;
        });

        this.clock.tick(10);
        assert.ok(finalized);
    });


    QUnit.test('reload calls before last load complete', function(assert) {
        let totalCountDeferred = $.Deferred();
        const source = createDataSource({
            store: new CustomStore({
                load: function() {
                    return TEN_NUMBERS;
                },
                totalCount: function() {
                    return totalCountDeferred;
                }
            }),
            asyncLoadEnabled: true,
            pageSize: 3,
            requireTotalCount: true,
            remoteOperations: { filtering: true, sorting: true, paging: true }
        });
        let loaded;
        let reloaded;

        source.load().done(function() {
            loaded = true;
        });

        this.clock.tick(10);


        // act
        source.reload().done(function() {
            reloaded = true;
        });

        totalCountDeferred.resolve(10);

        totalCountDeferred = $.Deferred();
        totalCountDeferred.resolve(3);

        this.clock.tick(10);

        // assert
        assert.ok(!loaded);
        assert.ok(reloaded);
        assert.equal(source.totalCount(), 3);
    });

    QUnit.test('pageIndex in dataSource options', function(assert) {
        const source = createDataSource({
            store: TEN_NUMBERS,
            pageSize: 3,
            pageIndex: 1
        });

        // act
        source.load();

        // assert
        assert.equal(source.pageIndex(), 1);
    });

    // B233043
    QUnit.test('pageIndex greater then pageCount in dataSource options', function(assert) {
        const source = createDataSource({
            store: TEN_NUMBERS,
            pageSize: 3,
            pageIndex: 5,
            requireTotalCount: true
        });

        // act
        source.load();

        // assert
        assert.equal(source.pageIndex(), 3);
    });

    // B233043
    QUnit.test('pageIndex equals pageCount in dataSource options', function(assert) {
        const source = createDataSource({
            store: TEN_NUMBERS,
            pageSize: 3,
            pageIndex: 4,
            requireTotalCount: true
        });

        // act
        source.load();

        // assert
        assert.equal(source.pageIndex(), 3);
    });

    QUnit.test('pageIndex correction before change event', function(assert) {
        const source = createDataSource({
            store: new ArrayStore(TEN_NUMBERS),
            pageSize: 3,
            pageIndex: 5,
            requireTotalCount: true
        });
        let changeCallCount = 0;

        source.changed.add(function() {
            changeCallCount++;
        });

        // act
        source.load();

        this.clock.tick(10);

        // assert
        assert.equal(changeCallCount, 1);
        assert.equal(source.pageIndex(), 3);
    });

    QUnit.test('change pageIndex to greater then pageSize', function(assert) {
        const source = createDataSource({
            store: TEN_NUMBERS,
            pageSize: 3,
            pageIndex: 1,
            requireTotalCount: true
        });
        source.load();

        // act
        source.pageIndex(5);
        source.load();

        // assert
        assert.equal(source.pageIndex(), 3);
    });

    QUnit.test('itemsCount calculation', function(assert) {
        const source = createDataSource({
            store: TEN_NUMBERS,
            pageSize: 3,
            requireTotalCount: true
        });

        // act
        source.load();

        // assert
        assert.equal(source.itemsCount(), 3);
    });


    QUnit.test('pageCount calculation', function(assert) {
        const source = createDataSource({
            store: TEN_NUMBERS,
            pageSize: 3,
            requireTotalCount: true
        });

        // act
        source.load();

        // assert
        assert.equal(source.pageCount(), 4);
    });

    QUnit.test('pageCount calculation after change pageSize', function(assert) {
        const source = createDataSource({
            store: TEN_NUMBERS,
            pageSize: 3,
            requireTotalCount: true
        });

        // act
        source.load();
        source.pageSize(5);

        // assert
        assert.equal(source.pageCount(), 2);
    });

    QUnit.test('isLastPage and hasKnownLastPage for first page', function(assert) {
        const source = createDataSource({
            store: new ArrayStore(TEN_NUMBERS),
            pageSize: 3,
            requireTotalCount: true
        });

        // act
        source.load();

        // assert
        assert.ok(!source.isLastPage());
        assert.ok(source.hasKnownLastPage());
    });

    QUnit.test('isLastPage for first page when totalCount = -1', function(assert) {
        const source = createDataSource({
            store: new CustomStore({
                load: function() {
                    return TEN_NUMBERS;
                },
                totalCount: function() {
                    return -1;
                }
            }),
            remoteOperations: { filtering: true, sorting: true, paging: true },
            pageSize: 3,
            requireTotalCount: true
        });

        // act
        source.load();

        // assert
        assert.ok(!source.isLastPage());
        assert.ok(!source.hasKnownLastPage());
    });


    QUnit.test('isLastPage and hasKnownLastPage for last page', function(assert) {
        const source = createDataSource({
            store: new ArrayStore(TEN_NUMBERS),
            pageSize: 3,
            pageIndex: 3,
            requireTotalCount: true
        });

        // act
        source.load();

        // assert
        assert.ok(source.isLastPage());
        assert.ok(source.hasKnownLastPage());
    });

    QUnit.test('groupingHelper when remoteOperations is auto and ArrayStore', function(assert) {
        // act
        const dataSource = createDataSource({
            store: TEN_NUMBERS,
            remoteOperations: 'auto'
        });

        // assert
        assert.ok(dataSource._grouping instanceof CollapsedGroupingHelper);
    });

    QUnit.test('groupingHelper when remoteOperations is auto and CustomStore', function(assert) {
        // act
        const dataSource = createDataSource({
            load: function() { },
            remoteOperations: 'auto'
        });

        // assert
        assert.ok(dataSource._grouping instanceof CollapsedGroupingHelper);
    });

    QUnit.test('groupingHelper when remoteOperations is auto and ODataStore', function(assert) {
        // act
        const dataSource = createDataSource({
            store: {
                type: 'odata',
                url: 'test'
            },
            remoteOperations: 'auto'
        });

        // assert
        assert.ok(dataSource._grouping instanceof ExpandedGroupingHelper);
    });

    // T298483
    QUnit.test('ODataStore customQueryParams/select when remoteOperations false', function(assert) {
        const store = new ODataStore({
            url: 'test'
        });
        const source = createDataSource({
            store: store,
            select: ['field1', 'field2'],
            customQueryParams: { test: true },
            remoteOperations: false,
            pageSize: 3,
            requireTotalCount: true
        });

        store.load = sinon.spy(function(parameters) {
            return $.Deferred().resolve(TEN_NUMBERS);
        });

        // act
        source.load();

        // assert
        assert.ok(!source.isLastPage());
        assert.ok(source.hasKnownLastPage());
        assert.equal(store.load.callCount, 1);
        assert.deepEqual(store.load.firstCall.args[0].customQueryParams, { test: true });
        assert.deepEqual(store.load.firstCall.args[0].select, ['field1', 'field2']);
    });

    // T298483
    QUnit.test('ODataStore customQueryParams when remoteOperations true', function(assert) {
        const store = new ODataStore({
            url: 'test'
        });
        const source = createDataSource({
            store: store,
            customQueryParams: { test: true },
            remoteOperations: { filtering: true, sorting: true, paging: true },
            pageSize: 3,
            requireTotalCount: true
        });

        store.load = sinon.spy(function(parameters) {
            return $.Deferred().resolve([0, 1, 2], { totalCount: 3 });
        });

        // act
        source.load();

        // assert
        assert.ok(!source.isLastPage());
        assert.ok(source.hasKnownLastPage());
        assert.equal(store.load.callCount, 1);
        assert.deepEqual(store.load.firstCall.args[0].customQueryParams, { test: true });
        assert.strictEqual(store.load.firstCall.args[0].skip, 0);
        assert.strictEqual(store.load.firstCall.args[0].take, 3);
    });

    // T474591
    QUnit.test('No error when store returned non-array', function(assert) {
        // arrange
        const source = createDataSource({
            load: function() {
                return $.Deferred().resolve({ /* no data property */ });
            }
        });

        // act
        source.load();

        // assert
        assert.ok(true, 'There are no exceptions');
    });

    QUnit.test('createOffsetFilter should generate filters with =/<> filter operations for boolean values', function(assert) {
        // arrange

        const booleanValues = [null, false, true];
        const descValues = [false, true];

        function checkFilter(filter) {
            if(Array.isArray(filter)) {
                if(Array.isArray(filter[0])) {
                    filter.forEach(checkFilter);
                } else {
                    if(filter[1] !== '=' && filter[1] !== '<>') {
                        assert.ok(false, 'filter contains incorrect filter operation \'' + filter[1] + '\'');
                    }
                }
            }
        }

        descValues.forEach(function(desc) {
            booleanValues.forEach(function(value, index) {
                const filter = createOffsetFilter([value], { group: [{ selector: 'this', desc: desc }] });

                checkFilter(filter);
                assert.deepEqual(dataQuery(booleanValues).filter(filter).toArray(), desc ? booleanValues.slice(index + 1) : booleanValues.slice(0, index), 'filter for value ' + value + ' and desc ' + false + ' is correct');
            });
        });
    });

    QUnit.test('Custom store with remote paging and with local filtering', function(assert) {
        // arrange
        let loadArgs = [];
        const source = createDataSource({
            remoteOperations: { paging: true },
            load: function(e) {
                loadArgs.push(e);
                return $.Deferred().resolve([{ x: 1 }, { x: 2 }]);
            }
        });

        // act
        source.filter(['x', '>', 1]);
        source.load();

        // assert
        assert.strictEqual(source.items().length, 1, 'items are filtered');
        assert.strictEqual(loadArgs.length, 1);
        assert.strictEqual(loadArgs[0].skip, undefined, 'skip is not exists');
        assert.strictEqual(loadArgs[0].take, undefined, 'take is not exists');
        assert.strictEqual(loadArgs[0].filter, undefined, 'filter is not exists');

        // act
        loadArgs = [];
        source.filter(null);
        source.load();

        // assert
        assert.strictEqual(source.items().length, 2, 'items are not filtered');
        assert.strictEqual(loadArgs.length, 1);
        assert.strictEqual(loadArgs[0].skip, 0, 'skip is not exists');
        assert.strictEqual(loadArgs[0].take, 20, 'take is not exists');
        assert.strictEqual(loadArgs[0].filter, undefined, 'filter is not exists');
    });

    // T748688
    QUnit.test('Custom store with remote paging and with local sorting', function(assert) {
        // arrange
        let loadArgs = [];
        const source = createDataSource({
            remoteOperations: { paging: true },
            pageSize: 2,
            load: function(e) {
                loadArgs.push(e);
                if(e.take === 2) {
                    return $.Deferred().resolve([{ x: 1 }, { x: 2 }]);
                } else {
                    return $.Deferred().resolve([{ x: 1 }, { x: 2 }, { x: 3 }]);
                }
            }
        });

        // act
        source.sort([{ selector: 'x', desc: true }]);
        source.load();

        // assert
        assert.strictEqual(source.items().length, 2, 'items are paged');
        assert.strictEqual(source.items()[0].x, 3, 'items are sorted');
        assert.strictEqual(loadArgs.length, 1);
        assert.strictEqual(loadArgs[0].skip, undefined, 'skip is not exists');
        assert.strictEqual(loadArgs[0].take, undefined, 'take is not exists');
        assert.strictEqual(loadArgs[0].sort, undefined, 'sort is not exists');

        // act
        loadArgs = [];
        source.sort(null);
        source.load();

        // assert
        assert.strictEqual(source.items().length, 2, 'items are paged');
        assert.strictEqual(source.items()[0].x, 1, 'items are not sorted');
        assert.strictEqual(loadArgs.length, 1);
        assert.strictEqual(loadArgs[0].skip, 0, 'skip is not exists');
        assert.strictEqual(loadArgs[0].take, 2, 'take is not exists');
        assert.strictEqual(loadArgs[0].sort, undefined, 'sort is not exists');
    });
});

QUnit.module('DataSource when not requireTotalCount', {
    beforeEach: function() {
        this.dataSource = createDataSource({
            store: new ArrayStore(TEN_NUMBERS),
            pageSize: 3,
            requireTotalCount: false
        });
    }
}, () => {

    QUnit.test('isLastPage and hasKnownLastPagefor first page', function(assert) {
        const source = this.dataSource;
        // act
        source.load();

        // assert
        assert.ok(!source.isLastPage());
        assert.ok(!source.hasKnownLastPage());
    });

    QUnit.test('isLastPage and hasKnownLastPage for last page', function(assert) {
        const source = this.dataSource;
        source.pageIndex(3);
        // act
        source.load();

        // assert
        assert.ok(source.isLastPage());
        assert.ok(source.hasKnownLastPage());
    });

    QUnit.test('isLastPage and hasKnownLastPage for first page after last page', function(assert) {
        const source = this.dataSource;
        source.pageIndex(3);
        source.load();

        // act
        source.pageIndex(0);
        source.load();

        // assert
        assert.ok(!source.isLastPage());
        assert.ok(source.hasKnownLastPage());
    });

    QUnit.test('totalCount for first page', function(assert) {
        const source = this.dataSource;
        // act
        source.load();

        // assert
        assert.equal(source.totalCount(), 3);
    });

    QUnit.test('totalCount for last page', function(assert) {
        const source = this.dataSource;
        source.pageIndex(3);
        // act
        source.load();

        // assert
        assert.equal(source.totalCount(), 10);
    });

    QUnit.test('totalCount for page after last', function(assert) {
        const source = this.dataSource;
        source.pageIndex(5);
        // act
        source.load();

        // assert
        assert.equal(source.totalCount(), 15);
    });

    QUnit.test('pageIndex greater then pages count', function(assert) {
        const source = this.dataSource;
        source.pageIndex(5);
        // act
        source.load();

        // assert
        assert.equal(source.pageIndex(), 4);
    });

    QUnit.test('pageIndex equals pages count when last page has items count equals pageSize', function(assert) {
        const source = this.dataSource;
        source.pageSize(5);
        source.pageIndex(2);
        // act
        source.load();

        // assert
        assert.equal(source.pageIndex(), 1);
        assert.equal(source.items().length, 5);
    });
});

QUnit.module('DataSource without cache', {
    beforeEach: function() {
        this.dataSource = createDataSource({
            store: TEN_NUMBERS,
            pageSize: 3,
            requireTotalCount: true
        });
    }
}, () => {

    QUnit.test('first load', function(assert) {
        let loadedCount = 0;
        const source = this.dataSource;

        source.loadingChanged.add(function(isLoading) {
            if(!isLoading) {
                loadedCount++;
            }
        });

        // act
        source.load();

        // assert
        assert.equal(loadedCount, 1);
    });

    QUnit.test('load next page', function(assert) {
        let loadedCount = 0;
        const source = this.dataSource;

        source.loadingChanged.add(function(isLoading) {
            if(!isLoading) {
                loadedCount++;
            }
        });

        source.load();

        // act
        source.pageIndex(1);
        source.load();

        // assert
        assert.strictEqual(source.pageIndex(), 1);
        assert.strictEqual(loadedCount, 2);
    });

    QUnit.test('second load page', function(assert) {
        let loadedCount = 0;
        const source = this.dataSource;


        source.load();
        source.pageIndex(1);
        source.load();

        source.loadingChanged.add(function(isLoading) {
            if(!isLoading) {
                loadedCount++;
            }
        });

        // act
        source.pageIndex(0);
        source.load();

        // assert
        assert.strictEqual(loadedCount, 1);
    });


    QUnit.test('integer pageIndex', function(assert) {
        const source = this.dataSource;

        source.load();

        // act
        source.pageIndex(1);
        source.load();

        // assert
        assert.strictEqual(source.pageIndex(), 1);
        assert.strictEqual(source.items().length, 3);
        assert.deepEqual(source.items(), [4, 5, 6]);
    });
});

QUnit.module('Grouping with basic remoteOperations', {
    beforeEach: function() {
        this.array = [
            { field1: 1, field2: 2, field3: 3 },
            { field1: 1, field2: 2, field3: 4 },
            { field1: 1, field2: 3, field3: 5 },
            { field1: 2, field2: 4, field3: 6 }
        ];
        this.createDataSource = function(options) {
            return createDataSource($.extend({
                store: this.array,
                paginate: true,
                group: 'field1',
                requireTotalCount: true,
                remoteOperations: { filtering: true, sorting: true, paging: true }
            }, options || {}));
        };
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {

    QUnit.test('grouping without paginate', function(assert) {
        const source = this.createDataSource({
            paginate: false
        });

        // act
        source.load();
        assert.equal(source.totalItemsCount(), 4);
        assert.deepEqual(source.items(), [{
            key: 1, items: [
                { field1: 1, field2: 2, field3: 3 },
                { field1: 1, field2: 2, field3: 4 },
                { field1: 1, field2: 3, field3: 5 }
            ]
        }, {
            key: 2, items: [{ field1: 2, field2: 4, field3: 6 }]
        }]);
    });

    // T137160
    QUnit.test('collapse group with undefined value when grouping without paginate', function(assert) {
        const source = this.createDataSource({
            paginate: false,
            group: 'field0'
        });

        source.load();
        const changeRowExpandResult = source.changeRowExpand([undefined]);
        source.load();

        // act
        assert.equal(source.totalItemsCount(), 1);
        assert.deepEqual(source.items(), [{
            key: undefined, items: null
        }]);
        assert.ok(changeRowExpandResult && changeRowExpandResult.done);
    });

    // T136667
    QUnit.test('collapse group with date value when grouping without paginate', function(assert) {
        const source = this.createDataSource({
            store: [
                { field1: new Date(2012, 1, 5), field2: 1 },
                { field1: new Date(2012, 1, 5), field2: 2 },
                { field1: new Date(2012, 2, 5), field2: 3 }
            ],
            paginate: false,
            group: 'field1'
        });

        source.load();
        source.changeRowExpand([new Date(2012, 1, 5)]);
        source.load();

        // act
        assert.equal(source.totalItemsCount(), 2);
        assert.deepEqual(source.items(), [{
            key: new Date(2012, 1, 5), items: null
        }, {
            key: new Date(2012, 2, 5), items: [{ field1: new Date(2012, 2, 5), field2: 3 }]
        }]);
    });

    QUnit.test('keys for items in groups', function(assert) {
        const source = this.createDataSource({
            store: new ArrayStore({ key: 'field3', data: this.array }),
            paginate: false
        });

        // act
        source.load();

        assert.equal(source.totalItemsCount(), 4);
        assert.deepEqual(source.items(), [{
            key: 1, items: [
                { field1: 1, field2: 2, field3: 3 },
                { field1: 1, field2: 2, field3: 4 },
                { field1: 1, field2: 3, field3: 5 }
            ]
        }, {
            key: 2, items: [
                { field1: 2, field2: 4, field3: 6 }
            ]
        }]);
    });

    QUnit.test('grouping with pageSize more items count', function(assert) {
        const source = this.createDataSource();

        // act
        source.load();

        assert.equal(source.totalItemsCount(), 4);
        assert.deepEqual(source.items(), [{
            key: 1, items: [
                { field1: 1, field2: 2, field3: 3 },
                { field1: 1, field2: 2, field3: 4 },
                { field1: 1, field2: 3, field3: 5 }
            ]
        }, {
            key: 2, items: [{ field1: 2, field2: 4, field3: 6 }]
        }]);

        assert.equal(source.itemsCount(), 4);
    });

    // T105748
    QUnit.test('grouping with sorting', function(assert) {
        const source = this.createDataSource({
            sort: 'field3',
            store: [
                { field1: 1, field2: 2, field3: 1 },
                { field1: 1, field2: 2, field3: 2 },
                { field1: 1, field2: 2, field3: 4 },
                { field1: 1, field2: 2, field3: 3 },
                { field1: 1, field2: 2, field3: 5 },
                { field1: 1, field2: 2, field3: 6 },
                { field1: 1, field2: 2, field3: 7 },
                { field1: 2, field2: 3, field3: 8 },
                { field1: 2, field2: 3, field3: 9 },
                { field1: 2, field2: 3, field3: 10 },
                { field1: 2, field2: 3, field3: 11 }
            ]
        });

        // act
        source.load();

        // assert
        assert.equal(source.totalItemsCount(), 11);
        assert.deepEqual(source.items(), [{
            key: 1, items: [
                { field1: 1, field2: 2, field3: 1 },
                { field1: 1, field2: 2, field3: 2 },
                { field1: 1, field2: 2, field3: 3 },
                { field1: 1, field2: 2, field3: 4 },
                { field1: 1, field2: 2, field3: 5 },
                { field1: 1, field2: 2, field3: 6 },
                { field1: 1, field2: 2, field3: 7 }
            ]
        }, {
            key: 2, items: [
                { field1: 2, field2: 3, field3: 8 },
                { field1: 2, field2: 3, field3: 9 },
                { field1: 2, field2: 3, field3: 10 },
                { field1: 2, field2: 3, field3: 11 }
            ]
        }]);
        assert.equal(source.itemsCount(), 11);
    });

    QUnit.test('grouping with pageSize less items count', function(assert) {
        const source = this.createDataSource({
            pageSize: 2
        });

        // act
        source.load();

        assert.equal(source.totalItemsCount(), 4);
        assert.deepEqual(source.items(), [{
            key: 1, isContinuationOnNextPage: true, items: [
                { field1: 1, field2: 2, field3: 3 },
                { field1: 1, field2: 2, field3: 4 }
            ]
        }]);
        assert.equal(source.itemsCount(), 2);
    });

    QUnit.test('grouping with pageSize less items count. Continue group parameter', function(assert) {
        const source = this.createDataSource({
            pageSize: 2,
            pageIndex: 1
        });

        // act
        source.load();

        assert.equal(source.totalItemsCount(), 4);
        assert.deepEqual(source.items(), [{
            key: 1, isContinuation: true, items: [
                { field1: 1, field2: 3, field3: 5 }
            ]
        }, {
            key: 2, items: [{ field1: 2, field2: 4, field3: 6 }]
        }]);
        assert.equal(source.itemsCount(), 2, 'items count with continue group');
    });

    QUnit.test('grouping with pageSize less items count. Continue group parameter when virtual scrolling', function(assert) {
        const source = this.createDataSource({
            pageSize: 2,
            pageIndex: 1,
            scrolling: { mode: 'virtual', preventPreload: true }
        });

        // act
        source.load();

        assert.equal(source.totalItemsCount(), 4);
        assert.deepEqual(source.items(), [{
            key: 1, isContinuation: true, items: [
                { field1: 1, field2: 3, field3: 5 }
            ]
        }, {
            key: 2, items: [{ field1: 2, field2: 4, field3: 6 }]
        }]);
        assert.equal(source.itemsCount(), 2, 'items count without continue group');
    });

    QUnit.test('collapse group on first page after loading second page', function(assert) {
        const source = this.createDataSource({
            pageSize: 2,
            scrolling: { mode: 'virtual', preventPreload: true }
        });

        // act
        source.load();
        source.pageIndex(1);
        source.load();

        // assert
        assert.equal(source.itemsCount(), 2);

        // act
        source.changeRowExpand([1]);
        source.load();

        // assert
        assert.equal(source.totalItemsCount(), 2);
        assert.deepEqual(source.items(), [{
            key: 1, items: null
        }, {
            key: 2, items: [{ field1: 2, field2: 4, field3: 6 }]
        }]);
        assert.equal(source.itemsCount(), 2, 'items count without continue group');
    });


    QUnit.test('changed callback fired after changeRowExpand', function(assert) {
        const source = this.createDataSource({
            pageSize: 3,
            store: [
                { field1: 1, field2: 2, field3: 3 },
                { field1: 1, field2: 2, field3: 4 },
                { field1: 2, field2: 3, field3: 5 },
                { field1: 3, field2: 4, field3: 6 }
            ]
        });

        // act
        source.load();
        source.changed.add(function() {
            // assert
            assert.equal(source.itemsCount(), 3);
            assert.deepEqual(source.items(), [{
                key: 1, items: null,
            }, {
                key: 2, items: [{ field1: 2, field2: 3, field3: 5 }]
            }, {
                key: 3, items: [{ field1: 3, field2: 4, field3: 6 }]
            }]);
        });

        // act
        source.changeRowExpand([1]);
        source.load();
    });

    QUnit.test('changed callback fired after changeRowExpand when no groups', function(assert) {
        const source = this.createDataSource({
            pageSize: 3,
            group: null,
            store: [
                { field1: 1, field2: 2, field3: 3 },
                { field1: 1, field2: 2, field3: 4 },
                { field1: 2, field2: 3, field3: 5 },
                { field1: 3, field2: 4, field3: 6 }
            ]
        });

        let isChanged = false;

        source.load();
        source.changed.add(function() {
            isChanged = true;
        });

        // act
        source.changeRowExpand([1]);
        source.load();

        // assert
        assert.ok(isChanged, 'changed called');
    });

    QUnit.test('grouping with pageSize less items count. Continue group parameter not set when previous page ends with collapsed group', function(assert) {
        const source = this.createDataSource({
            pageSize: 3,
            store: [
                { field1: 1, field2: 2, field3: 3 },
                { field1: 1, field2: 2, field3: 4 },
                { field1: 2, field2: 3, field3: 5 },
                { field1: 3, field2: 4, field3: 6 }
            ]
        });

        // act
        source.load();
        source.changeRowExpand([2]);
        source.pageIndex(1);
        source.load();

        assert.equal(source.totalItemsCount(), 4);
        assert.deepEqual(source.items(), [{
            key: 3, items: [{ field1: 3, field2: 4, field3: 6 }]
        }]);
    });

    QUnit.test('grouping with pageSize less items count. Continue group parameter not set', function(assert) {
        const source = this.createDataSource({
            pageSize: 3,
            pageIndex: 1
        });

        // act
        source.load();

        assert.equal(source.totalItemsCount(), 4);
        assert.deepEqual(source.items(), [{
            key: 2, items: [{ field1: 2, field2: 4, field3: 6 }]
        }]);
    });

    QUnit.test('grouping with pageSize less items count. Continue on next page group parameter', function(assert) {
        const source = this.createDataSource({
            pageSize: 2
        });

        // act
        source.load();

        assert.equal(source.totalItemsCount(), 4);
        assert.deepEqual(source.items(), [{
            key: 1, isContinuationOnNextPage: true, items: [
                { field1: 1, field2: 2, field3: 3 },
                { field1: 1, field2: 2, field3: 4 }
            ]
        }]);
    });

    QUnit.test('grouping with pageSize less items count. Continue on next page group parameter when has collapsed item', function(assert) {
        const source = this.createDataSource({
            pageSize: 2,
            store: [
                { field1: 1, field2: 2, field3: 3 },
                { field1: 1, field2: 2, field3: 4 },
                { field1: 1, field2: 3, field3: 5 },
                { field1: 2, field2: 4, field3: 6 },
                { field1: 2, field2: 4, field3: 7 }
            ]
        });

        // act
        source.load();
        source.changeRowExpand([1]);
        source.load();
        assert.equal(source.totalItemsCount(), 3);
        assert.deepEqual(source.items(), [{
            key: 1, items: null
        }, {
            key: 2, isContinuationOnNextPage: true, items: [
                { field1: 2, field2: 4, field3: 6 }
            ]
        }]);
    });

    QUnit.test('grouping with mapping. Use an isContinuationOnNextPage flag', function(assert) {
        const source = this.createDataSource({
            pageSize: 2,
            map: item => {
                return item;
            }
        });

        source.load();

        assert.ok(source.items()[0].isContinuationOnNextPage);
    });

    QUnit.test('grouping with mapping. Use an isContinuation flag', function(assert) {
        const source = this.createDataSource({
            pageSize: 2,
            pageIndex: 1,
            map: item => {
                return item;
            }
        });

        source.load();

        assert.ok(source.items()[0].isContinuation);
    });

    QUnit.test('grouping with pageSize less items count. Not Continue on next page group parameter when all items on group on current page', function(assert) {
        const source = this.createDataSource({
            pageSize: 3
        });

        // act
        source.load();

        assert.equal(source.totalItemsCount(), 4);
        assert.deepEqual(source.items(), [{
            key: 1, items: [
                { field1: 1, field2: 2, field3: 3 },
                { field1: 1, field2: 2, field3: 4 },
                { field1: 1, field2: 3, field3: 5 }
            ]
        }]);
    });

    QUnit.test('grouping without paginate. Collapse group', function(assert) {
        const source = this.createDataSource({
            paginate: false
        });

        source.load();
        source.changeRowExpand([1]);
        source.load();

        assert.equal(source.totalItemsCount(), 2);
        assert.deepEqual(source.items(), [{
            key: 1, items: null
        }, {
            key: 2, items: [{ field1: 2, field2: 4, field3: 6 }]
        }]);
        assert.equal(source.itemsCount(), 2);
    });

    QUnit.test('grouping without paginate. Expand group after collapse', function(assert) {
        const source = this.createDataSource({
            paginate: false
        });

        source.load();

        source.changeRowExpand([1]);
        source.load();
        source.changeRowExpand([1]);
        source.load();

        assert.equal(source.totalItemsCount(), 4);
        assert.deepEqual(source.items(), [{
            key: 1, items: [
                { field1: 1, field2: 2, field3: 3 },
                { field1: 1, field2: 2, field3: 4 },
                { field1: 1, field2: 3, field3: 5 }
            ]
        }, {
            key: 2, items: [{ field1: 2, field2: 4, field3: 6 }]
        }]);
    });


    QUnit.test('grouping with paginate. Collapse group', function(assert) {
        const source = this.createDataSource({});

        source.load();

        source.changeRowExpand([1]);
        source.load();

        assert.equal(source.totalItemsCount(), 2);
        assert.deepEqual(source.items(), [{
            key: 1, items: null
        }, {
            key: 2, items: [{ field1: 2, field2: 4, field3: 6 }]
        }]);
    });

    // T635726
    QUnit.test('expand group item if group level is collapsed', function(assert) {
        const source = this.createDataSource({
            group: [{ selector: 'field1', isExpanded: false }]
        });

        source.load();

        source.changeRowExpand([2]);
        source.load();

        assert.deepEqual(source.items(), [{
            key: 1, items: null
        }, {
            key: 2, items: [{ field1: 2, field2: 4, field3: 6 }]
        }]);
    });

    QUnit.test('grouping with paginate. Collapse group when remote sorting and local sorting are different', function(assert) {
        const arrayStore = new ArrayStore([
            { field1: 'ES', field2: 1 },
            { field1: 'ES', field2: 2 },
            { field1: 'ES', field2: 3 },
            { field1: 'ES', field2: 4 },
            { field1: 'ES', field2: 5 },
            { field1: 'Győr', field2: 6 },
            { field1: 'Győr', field2: 7 },
            { field1: 'Győr', field2: 8 },
            { field1: 'Győr', field2: 9 },
            { field1: 'Győr', field2: 10 },
            { field1: 'Göd', field2: 11 },
            { field1: 'Göd', field2: 12 },
            { field1: 'Göd', field2: 13 },
            { field1: 'Göd', field2: 14 },
            { field1: 'Göd', field2: 15 }
        ]);

        const source = this.createDataSource({
            pageSize: 4,
            store: new CustomStore({
                load: function(options) {
                    const d = $.Deferred();
                    if(options.sort) {
                        options.sort[0].selector = function(data) {
                            return $.inArray(data.field1, ['ES', 'Göd', 'Győr']);
                        };
                    }
                    $.when(arrayStore.load(options), arrayStore.totalCount(options)).done(function(items, totalCount) {
                        d.resolve(items, { totalCount: totalCount });
                    });
                    return d;
                }
            })
        });

        source.load();

        // act
        source.changeRowExpand(['ES']);
        source.load();
        source.changeRowExpand(['Göd']);
        source.load();

        // assert
        assert.deepEqual(source.items(), [{
            key: 'ES', items: null
        }, {
            key: 'Göd', items: null
        }, {
            key: 'Győr', isContinuationOnNextPage: true, items: [
                { field1: 'Győr', field2: 6 },
                { field1: 'Győr', field2: 7 }
            ]
        }]);

        // act
        source.changeRowExpand(['Győr']);
        source.load();

        // assert
        assert.deepEqual(source.items(), [{
            key: 'ES', items: null
        }, {
            key: 'Göd', items: null
        }, {
            key: 'Győr', items: null
        }]);
    });

    QUnit.test('grouping with paginate. Collapse group when CustomStore used', function(assert) {
        const arrayStore = new ArrayStore(this.array);

        const source = this.createDataSource({
            store: new CustomStore({
                load: function(options) {
                    const d = $.Deferred();
                    $.when(arrayStore.load(options), arrayStore.totalCount(options)).done(function(items, totalCount) {
                        d.resolve(items, { totalCount: totalCount });
                    });
                    return d;
                }
            })
        });

        source.load();

        source.changeRowExpand([1]);
        source.load();

        assert.equal(source.totalItemsCount(), 2);
        assert.deepEqual(source.items(), [{
            key: 1, items: null
        }, {
            key: 2, items: [{ field1: 2, field2: 4, field3: 6 }]
        }]);
    });

    // T720420
    QUnit.test('grouping with paginate. Collapse group and paging when ODataStore used', function(assert) {
        const arrayStore = new ArrayStore(this.array);

        const source = this.createDataSource({
            pageSize: 2,
            group: 'field2',
            store: new CustomStore({
                load: function(options) {
                    const d = $.Deferred();
                    $.when(arrayStore.load(options), arrayStore.totalCount(options)).done(function(items, totalCount) {
                        d.resolve(items, { totalCount: totalCount });
                    });
                    return d;
                }
            })
        });

        source.load();

        // act
        source.changeRowExpand([2]);
        source.load();
        source.pageIndex(1);
        source.load();

        // assert
        assert.equal(source.pageIndex(), 1);
        assert.equal(source.totalItemsCount(), 3);
        assert.deepEqual(source.items(), [{
            key: 4, items: [{ field1: 2, field2: 4, field3: 6 }]
        }]);
    });

    QUnit.test('grouping with paginate. Collapse group when dataSource has filter', function(assert) {
        const source = this.createDataSource({
            store: [
                { field1: 1, field2: 2, field3: 3 },
                { field1: 1, field2: 2, field3: 4 },
                { field1: 1, field2: 3, field3: 5 },
                { field1: 2, field2: 4, field3: 6 },
                { field1: 2, field2: 4, field3: 7 }
            ],
            filter: ['field3', '>', 4]
        });

        source.load();
        source.changeRowExpand([2]);
        source.load();

        assert.equal(source.totalItemsCount(), 2);
        assert.deepEqual(source.items(), [{
            key: 1, items: [{ field1: 1, field2: 3, field3: 5 }]
        }, {
            key: 2, items: null
        }]);
    });

    QUnit.test('grouping with paginate. Collapse group when dataSource has filter 2', function(assert) {
        const source = this.createDataSource({
            store: [
                { field1: 1, field2: 2, field3: 3 },
                { field1: 1, field2: 2, field3: 4 },
                { field1: 1, field2: 3, field3: 5 },
                { field1: 2, field2: 4, field3: 6 },
                { field1: 2, field2: 4, field3: 7 }
            ],
            filter: ['field3', '>', 4]
        });

        source.load();
        source.changeRowExpand([1]);
        source.load();

        assert.equal(source.totalItemsCount(), 3);
        assert.deepEqual(source.items(), [{
            key: 1, items: null,
        }, {
            key: 2, items: [{ field1: 2, field2: 4, field3: 6 }, { field1: 2, field2: 4, field3: 7 }]
        }]);
        assert.equal(source.itemsCount(), 3);
    });

    QUnit.test('grouping with paginate. Expand group after collapse', function(assert) {
        const source = this.createDataSource({});

        source.load();

        source.changeRowExpand([1]);
        source.load();
        source.changeRowExpand([1]);
        source.load();

        assert.equal(source.totalItemsCount(), 4);
        assert.deepEqual(source.items(), [{
            key: 1, items: [
                { field1: 1, field2: 2, field3: 3 },
                { field1: 1, field2: 2, field3: 4 },
                { field1: 1, field2: 3, field3: 5 }
            ]
        }, {
            key: 2, items: [{ field1: 2, field2: 4, field3: 6 }]
        }]);
    });

    QUnit.test('grouping with paginate. Update group offsets after expand by correct page offset', function(assert) {
        const array = [
            { field1: 1, field2: 2, field3: 3 },
            { field1: 1, field2: 2, field3: 4 },
            { field1: 1, field2: 3, field3: 5 },
            { field1: 2, field2: 4, field3: 6 },
            { field1: 2, field2: 5, field3: 7 },
            { field1: 3, field2: 6, field3: 8 }
        ];
        const source = this.createDataSource({
            store: array,
            pageSize: 3
        });

        source.load();

        source.changeRowExpand([1]);
        source.load();
        source.changeRowExpand([2]);
        source.load();
        source.changeRowExpand([3]);
        source.load();
        // act
        source.changeRowExpand([2]);
        source.load();
        source.pageIndex(1);
        source.load();
        source.changeRowExpand([3]);
        source.load();

        assert.deepEqual(source.getGroupsInfo(), [ // TODO make public method for test
            { key: 1, children: [], offset: 0, data: { count: 3, offset: 0, path: [1], isExpanded: false } },
            { key: 2, children: [], offset: 3, data: { count: 2, offset: 3, path: [2], isExpanded: true } },
            { key: 3, children: [], offset: 5, data: { count: 1, offset: 5, path: [3], isExpanded: true } }
        ]);

        assert.equal(source.items().length, 1);
        assert.deepEqual(source.items(), [{
            key: 3, items: [
                { field1: 3, field2: 6, field3: 8 }
            ]
        }]);
    });

    QUnit.test('sort group on add groupsInfo', function(assert) {
        const source = this.createDataSource({
            store: [],
            pageSize: 3
        });

        source.load();

        source._grouping.addGroupInfo({ offset: 3, path: '1' });
        source._grouping.addGroupInfo({ offset: 2, path: '2' });
        source._grouping.addGroupInfo({ offset: 0, path: '3' });
        source._grouping.addGroupInfo({ offset: 7, path: '4' });

        const offsets = $.map(source.getGroupsInfo(), function(g) {
            return g.offset;
        });

        assert.deepEqual(offsets, [0, 2, 3, 7]);
    });

    // T231326
    QUnit.test('grouping with paginate. Update group offsets after expand by correct page offset 2', function(assert) {
        const array = [
            { field1: 1, field2: 1, field3: 1 },
            { field1: 1, field2: 2, field3: 2 },
            { field1: 1, field2: 2, field3: 3 },
            { field1: 1, field2: 2, field3: 4 },
            { field1: 1, field2: 2, field3: 5 },
            { field1: 1, field2: 2, field3: 6 },
            { field1: 1, field2: 2, field3: 7 },
            { field1: 1, field2: 2, field3: 8 },
            { field1: 1, field2: 2, field3: 9 },
            { field1: 1, field2: 2, field3: 10 },
            { field1: 1, field2: 2, field3: 11 },
            { field1: 1, field2: 2, field3: 12 },
            { field1: 1, field2: 2, field3: 13 },
            { field1: 1, field2: 2, field3: 14 },
            { field1: 1, field2: 2, field3: 15 },
            { field1: 1, field2: 2, field3: 16 },
            { field1: 1, field2: 2, field3: 17 },
            { field1: 1, field2: 2, field3: 18 },
            { field1: 1, field2: 2, field3: 19 },
            { field1: 1, field2: 2, field3: 20 },

            { field1: 1, field2: 2, field3: 21 },
            { field1: 1, field2: 2, field3: 22 },
            { field1: 1, field2: 2, field3: 23 },
            { field1: 1, field2: 2, field3: 24 },
            { field1: 1, field2: 2, field3: 25 },
            { field1: 1, field2: 2, field3: 26 },
            { field1: 1, field2: 2, field3: 27 },
            { field1: 1, field2: 2, field3: 28 },
            { field1: 1, field2: 2, field3: 29 },
            { field1: 1, field2: 2, field3: 30 },
            { field1: 1, field2: 2, field3: 31 },
            { field1: 1, field2: 2, field3: 32 },
            { field1: 1, field2: 2, field3: 33 },
            { field1: 1, field2: 2, field3: 34 },
            { field1: 1, field2: 2, field3: 35 },
            { field1: 1, field2: 2, field3: 36 },
            { field1: 1, field2: 2, field3: 37 },
            { field1: 1, field2: 2, field3: 38 },
            { field1: 1, field2: 2, field3: 39 },
            { field1: 1, field2: 2, field3: 40 },

            { field1: 1, field2: 2, field3: 41 },
            { field1: 1, field2: 2, field3: 42 },
            { field1: 1, field2: 2, field3: 43 },
            { field1: 1, field2: 2, field3: 44 },
            { field1: 1, field2: 2, field3: 45 },
            { field1: 1, field2: 2, field3: 46 },
            { field1: 1, field2: 2, field3: 47 },
            { field1: 1, field2: 2, field3: 48 },
            { field1: 1, field2: 2, field3: 49 },
            { field1: 1, field2: 2, field3: 50 },
            { field1: 1, field2: 2, field3: 51 },
            { field1: 1, field2: 2, field3: 52 },
            { field1: 1, field2: 2, field3: 53 },
            { field1: 1, field2: 2, field3: 54 },
            { field1: 1, field2: 2, field3: 55 },
            { field1: 1, field2: 2, field3: 56 },
            { field1: 1, field2: 3, field3: 57 },
            { field1: 1, field2: 3, field3: 58 },
            { field1: 1, field2: 3, field3: 59 },
            { field1: 1, field2: 3, field3: 60 },

            { field1: 1, field2: 3, field3: 61 },
            { field1: 1, field2: 3, field3: 62 },
            { field1: 1, field2: 3, field3: 63 },
            { field1: 1, field2: 3, field3: 64 },
            { field1: 1, field2: 3, field3: 65 },
            { field1: 1, field2: 3, field3: 66 },
            { field1: 1, field2: 3, field3: 67 },
            { field1: 1, field2: 3, field3: 68 },
            { field1: 1, field2: 3, field3: 69 },
            { field1: 1, field2: 3, field3: 70 },
            { field1: 1, field2: 3, field3: 71 },
            { field1: 1, field2: 3, field3: 72 },
            { field1: 1, field2: 3, field3: 73 },
            { field1: 1, field2: 3, field3: 74 },
            { field1: 1, field2: 3, field3: 75 },
            { field1: 1, field2: 4, field3: 76 },
            { field1: 1, field2: 4, field3: 77 },
            { field1: 1, field2: 4, field3: 78 },
            { field1: 1, field2: 4, field3: 79 },
            { field1: 1, field2: 4, field3: 80 },

            { field1: 1, field2: 4, field3: 81 },
            { field1: 1, field2: 4, field3: 82 },
            { field1: 1, field2: 4, field3: 83 },
            { field1: 1, field2: 4, field3: 84 },
            { field1: 1, field2: 4, field3: 85 },
            { field1: 1, field2: 4, field3: 86 },
            { field1: 1, field2: 4, field3: 87 },
            { field1: 1, field2: 4, field3: 88 },
            { field1: 1, field2: 4, field3: 89 },
            { field1: 1, field2: 4, field3: 90 },
            { field1: 1, field2: 4, field3: 91 },
            { field1: 1, field2: 4, field3: 92 },
            { field1: 1, field2: 4, field3: 93 },
            { field1: 1, field2: 4, field3: 94 },
            { field1: 2, field2: 1, field3: 95 },
            { field1: 2, field2: 1, field3: 96 }
        ];
        const source = this.createDataSource({
            store: array,
            group: ['field1', 'field2'],
            pageSize: 20,
            scrolling: { mode: 'virtual', preventPreload: true }
        });

        source.load();

        source.pageIndex(1);
        source.load();

        source.pageIndex(2);
        source.load();

        source.pageIndex(3);
        source.load();

        // act
        source.changeRowExpand([1, 4]);
        source.load();

        assert.deepEqual(source.getGroupsInfo(), [
            { key: 1, offset: 75, children: [{ key: 4, children: [], offset: 75, data: { count: 19, offset: 75, path: [1, 4], isExpanded: false } }], data: { isExpanded: true, offset: 75, path: [1] } }
        ]);

        assert.equal(source.items().length, 2);
        assert.deepEqual(source.items(), [{
            key: 1, isContinuation: true, items: [
                { key: 3, isContinuation: true, items: array.slice(60, 75) },
                { key: 4, items: null }
            ]
        }, {
            key: 2, items: [
                { key: 1, items: array.slice(94, 96) }
            ]
        }]);
    });

    // B254194, T310036
    QUnit.test('hide collapsed group when after filtering group has no elements', function(assert) {
        const arrayStore = new ArrayStore(this.array);

        const source = this.createDataSource({
            store: new CustomStore({
                load: function(options) {
                    const d = $.Deferred();
                    setTimeout(function() {
                        arrayStore.load(options).done(d.resolve).fail(d.reject);
                    });
                    return d;
                },
                totalCount: function(options) {
                    const d = $.Deferred();
                    setTimeout(function() {
                        arrayStore.totalCount(options).done(d.resolve).fail(d.reject);
                    });
                    return d;
                }
            }),
            pageSize: 2
        });

        source.load();

        this.clock.tick(10);

        source.changeRowExpand([1]);
        source.load();

        this.clock.tick(10);

        // act
        source.filter(['field2', '>', 3]);
        source.reload();

        this.clock.tick(10);

        // assert
        assert.equal(source.totalItemsCount(), 1, 'total items count');
        assert.deepEqual(source.items(), [{
            key: 2, items: [
                { field1: 2, field2: 4, field3: 6 }
            ]
        }], 'items');
        assert.equal(source.itemsCount(), 1, 'visible items count');
    });

    QUnit.test('collapseAll when no grouped columns', function(assert) {
        const source = this.createDataSource({
            pageSize: 2,
            group: null
        });
        source.load();

        // act
        source.collapseAll();
        source.load();

        // assert
        assert.equal(source.pageCount(), 2, 'pageCount');
        assert.deepEqual(source.items(), [
            { field1: 1, field2: 2, field3: 3 },
            { field1: 1, field2: 2, field3: 4 }
        ], 'items');
    });

    QUnit.test('expandAll when no grouped columns', function(assert) {
        const source = this.createDataSource({
            pageSize: 2,
            group: null
        });
        source.load();

        // act
        source.expandAll();
        source.load();

        // assert
        assert.equal(source.pageCount(), 2, 'pageCount');
        assert.deepEqual(source.items(), [
            { field1: 1, field2: 2, field3: 3 },
            { field1: 1, field2: 2, field3: 4 }
        ], 'items');
    });

    QUnit.test('loadTotalCount for CustomStore when totalCount in extra', function(assert) {
        let lastLoadOptions;

        const store = new CustomStore({
            load: function(options) {
                lastLoadOptions = options;
                const d = $.Deferred();
                d.resolve([], {
                    totalCount: 10
                });
                return d;
            }
        });

        // T329728
        if(store._customLoadOptions) {
            store._customLoadOptions = function() {
                return ['param1'];
            };
        }

        const dataSource = createDataSource({
            store: store,
            paginate: true,
            param1: 1,
            param2: 2,
            remoteOperations: { filtering: true, sorting: true, paging: true }
        });

        let totalCount;

        // act
        loadTotalCount(dataSource, { filter: ['this', '>=', 5] }).done(function(e) {
            totalCount = e;
        });

        // assert
        assert.deepEqual(lastLoadOptions, {
            skip: 0,
            take: 1,
            requireTotalCount: true,
            filter: ['this', '>=', 5],
            param1: 1, // T329728
        });
        assert.strictEqual(totalCount, 10);
    });

    QUnit.test('loadTotalCount for CustomStore when no totalCount in extra', function(assert) {
        let lastLoadOptions;
        let lastTotalCountOptions;

        const store = new CustomStore({
            load: function(options) {
                lastLoadOptions = options;
                return [];
            },
            totalCount: function(options) {
                lastTotalCountOptions = options;
                return 10;
            }
        });

        const dataSource = createDataSource({
            store: store,
            paginate: true,
            remoteOperations: { filtering: true, sorting: true, paging: true }
        });

        let totalCount;

        // act
        loadTotalCount(dataSource, { filter: ['this', '>=', 5] }).done(function(e) {
            totalCount = e;
        });

        // assert
        assert.deepEqual(lastLoadOptions, {
            skip: 0,
            take: 1,
            requireTotalCount: true,
            filter: ['this', '>=', 5]
        });
        assert.deepEqual(lastTotalCountOptions, {
            skip: 0,
            take: 1,
            requireTotalCount: true,
            filter: ['this', '>=', 5]
        });
        assert.strictEqual(totalCount, 10);
    });

    // T545211
    QUnit.test('Ungrouping with custom store - there are no exceptions when remote paging', function(assert) {
        // arrange
        const that = this;
        const dataSource = createDataSource({
            load: function() {
                return $.Deferred().resolve({
                    data: that.array,
                    totalCount: that.array.length
                });
            },
            paginate: true,
            requireTotalCount: true,
            remoteOperations: { paging: true }
        });

        dataSource.group('field1');
        dataSource.load();

        try {
            // act
            dataSource.group(null);
            dataSource.load();

            // assert
            assert.ok(true, 'There are no exceptions');
        } catch(error) {
            // assert
            assert.ok(false, 'exception was threw:' + error);
        }
    });
});

QUnit.module('Grouping with basic remoteOperations. Second level', {
    beforeEach: function() {
        this.array = [
            { field1: 1, field2: 2, field3: 3 },
            { field1: 1, field2: 2, field3: 4 },
            { field1: 1, field2: 3, field3: 5 },
            { field1: 1, field2: 3, field3: 6 },
            { field1: 2, field2: 4, field3: 7 }
        ];
        this.createDataSource = function(options) {
            return createDataSource($.extend({
                store: this.array,
                paginate: true,
                group: ['field1', 'field2'],
                requireTotalCount: true,
                remoteOperations: { filtering: true, sorting: true, paging: true }
            }, options || {}));
        };
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('grouping with paginate', function(assert) {
        const source = this.createDataSource({
            pageSize: 3
        });

        // act
        source.load();

        assert.equal(source.totalItemsCount(), 5);
        assert.deepEqual(source.items(), [{
            key: 1, isContinuationOnNextPage: true, items: [{
                key: 2, items: [
                    { field1: 1, field2: 2, field3: 3 },
                    { field1: 1, field2: 2, field3: 4 }
                ]
            },
            {
                key: 3, isContinuationOnNextPage: true, items: [{ field1: 1, field2: 3, field3: 5 }]
            }
            ]
        }]);
    });

    // T134180
    QUnit.test('grouping with paginate and totalCount from extra', function(assert) {
        const array = this.array;
        const source = this.createDataSource({
            load: function() {
                return $.Deferred().resolve(array, { totalCount: array.length }).promise();
            },
            pageSize: 3
        });

        // act
        source.load();

        assert.equal(source.totalItemsCount(), 5);
        assert.deepEqual(source.items(), [{
            key: 1, isContinuationOnNextPage: true, items: [{
                key: 2, items: [
                    { field1: 1, field2: 2, field3: 3 },
                    { field1: 1, field2: 2, field3: 4 }
                ]
            },
            {
                key: 3, isContinuationOnNextPage: true, items: [{ field1: 1, field2: 3, field3: 5 }]
            }
            ]
        }]);
    });

    QUnit.test('grouping without paginate', function(assert) {
        const source = this.createDataSource({
            paginate: false
        });

        // act
        source.load();

        assert.equal(source.totalItemsCount(), 5);
        assert.deepEqual(source.items(), [{
            key: 1, items: [{
                key: 2, items: [
                    { field1: 1, field2: 2, field3: 3 },
                    { field1: 1, field2: 2, field3: 4 }
                ]
            }, {
                key: 3, items: [
                    { field1: 1, field2: 3, field3: 5 },
                    { field1: 1, field2: 3, field3: 6 }
                ]
            }]
        }, {
            key: 2, items: [{
                key: 4, items: [
                    { field1: 2, field2: 4, field3: 7 }
                ]
            }]
        }]);
    });

    QUnit.test('change group order when remote data', function(assert) {
        const arrayStore = new ArrayStore([
            { field1: 1, field2: 2, field3: 3 },
            { field1: 1, field2: 2, field3: 4 },
            { field1: 1, field2: 2, field3: 5 },
            { field1: 1, field2: 2, field3: 6 },
            { field1: 1, field2: 3, field3: 7 },
            { field1: 1, field2: 3, field3: 8 },
            { field1: 1, field2: 3, field3: 9 },
            { field1: 2, field2: 4, field3: 10 }
        ]);

        const source = this.createDataSource({
            pageSize: 3,
            store: new CustomStore({
                load: function(options) {
                    const d = $.Deferred();
                    setTimeout(function() {
                        arrayStore.load(options).done(function(data) {
                            d.resolve(data);
                        });
                    });
                    return d;
                },
                totalCount: function(options) {
                    const d = $.Deferred();
                    setTimeout(function() {
                        arrayStore.totalCount(options).done(function(totalCount) {
                            d.resolve(totalCount);
                        });
                    });
                    return d;
                }
            })
        });


        source.load();
        this.clock.tick(10);

        source.changeRowExpand([1, 2]);
        this.clock.tick(10);
        source.load();
        this.clock.tick(10);

        source.changeRowExpand([1, 3]);
        this.clock.tick(10);
        source.load();
        this.clock.tick(10);

        // act
        source.group(['field1', { selector: 'field2', desc: true }]);

        source.reload();
        this.clock.tick(10);

        // assert
        assert.equal(source.totalItemsCount(), 3);
        assert.deepEqual(source.items(), [{
            key: 1, items: [
                { key: 3, items: null },
                { key: 2, items: null }
            ]
        }, {
            key: 2, items: [
                {
                    key: 4, items: [
                        { field1: 2, field2: 4, field3: 10 }
                    ]
                }
            ]
        }]);
        assert.equal(source.itemsCount(), 3);
    });


    QUnit.test('Continue group parameter for first group level only', function(assert) {
        const source = this.createDataSource({
            pageSize: 2,
            pageIndex: 1
        });

        // act
        source.load();

        assert.equal(source.totalItemsCount(), 5);
        assert.deepEqual(source.items(), [{
            key: 1, isContinuation: true, items: [{
                key: 3, items: [
                    { field1: 1, field2: 3, field3: 5 },
                    { field1: 1, field2: 3, field3: 6 }
                ]
            }]
        }]);
    });

    QUnit.test('Continue group parameter for both group levels', function(assert) {
        const source = this.createDataSource({
            pageSize: 3,
            pageIndex: 1
        });

        // act
        source.load();

        assert.equal(source.totalItemsCount(), 5);
        assert.deepEqual(source.items(), [{
            key: 1, isContinuation: true, items: [
                { key: 3, isContinuation: true, items: [{ field1: 1, field2: 3, field3: 6 }] }
            ]
        }, {
            key: 2, items: [
                { key: 4, items: [{ field1: 2, field2: 4, field3: 7 }] }
            ]
        }]);
    });

    QUnit.test('Continue on next page group parameter for first group level only', function(assert) {
        const source = this.createDataSource({
            pageSize: 2
        });

        // act
        source.load();

        assert.equal(source.totalItemsCount(), 5);
        assert.deepEqual(source.items(), [{
            key: 1, isContinuationOnNextPage: true, items: [
                {
                    key: 2, items: [
                        { field1: 1, field2: 2, field3: 3 },
                        { field1: 1, field2: 2, field3: 4 }
                    ]
                }
            ]
        }]);

    });

    QUnit.test('Continue on next page group parameter for both group levels', function(assert) {
        const source = this.createDataSource({
            pageSize: 3
        });

        // act
        source.load();

        assert.equal(source.totalItemsCount(), 5);
        assert.deepEqual(source.items(), [{
            key: 1, isContinuationOnNextPage: true, items: [
                {
                    key: 2, items: [
                        { field1: 1, field2: 2, field3: 3 },
                        { field1: 1, field2: 2, field3: 4 }
                    ]
                },
                {
                    key: 3, isContinuationOnNextPage: true,
                    items: [{ field1: 1, field2: 3, field3: 5 }]

                }
            ]
        }]);

    });

    QUnit.test('Collapse second level group', function(assert) {
        const source = this.createDataSource({
            pageSize: 4
        });

        // act
        source.load();

        source.changeRowExpand([1, 3]);
        source.load();

        assert.equal(source.totalItemsCount(), 4);
        assert.deepEqual(source.items(), [{
            key: 1, items: [{
                key: 2, items: [
                    { field1: 1, field2: 2, field3: 3 },
                    { field1: 1, field2: 2, field3: 4 }
                ]
            }, { key: 3, items: null }
            ]
        }, {
            key: 2, items: [{
                key: 4, items: [
                    { field1: 2, field2: 4, field3: 7 }
                ]
            }]
        }]);
    });

    QUnit.test('Collapse second level group and first level group', function(assert) {
        const source = this.createDataSource({
            pageSize: 4
        });

        // act
        source.load();

        source.changeRowExpand([1, 3]);
        source.load();
        source.changeRowExpand([1]);
        source.load();

        assert.equal(source.totalItemsCount(), 2);
        assert.deepEqual(source.items(), [{
            key: 1, items: null
        }, {
            key: 2, items: [{
                key: 4, items: [
                    { field1: 2, field2: 4, field3: 7 }
                ]
            }]
        }]);
    });

    // T406350
    QUnit.test('Collapse second level group and first level group when scrolling mode is virtual', function(assert) {
        this.array = [
            { field1: 1, field2: 1, field3: 1 },
            { field1: 1, field2: 2, field3: 2 },
            { field1: 1, field2: 2, field3: 3 },
            { field1: 1, field2: 2, field3: 4 },
            { field1: 1, field2: 2, field3: 5 },
            { field1: 1, field2: 2, field3: 6 },
            { field1: 2, field2: 1, field3: 7 }
        ];

        const source = this.createDataSource({
            pageSize: 5,
            scrolling: { mode: 'virtual', preventPreload: true }
        });

        source.viewportSize(5);

        // act
        source.load();

        source.changeRowExpand([1, 1]);
        source.load();
        source.changeRowExpand([1]);
        source.load();

        assert.equal(source.totalItemsCount(), 2);
        assert.deepEqual(source.items(), [{
            key: 1, items: null
        }, {
            key: 2, items: [{
                key: 1, items: [
                    { field1: 2, field2: 1, field3: 7 }
                ]
            }]
        }]);
    });

    // T371565
    QUnit.test('Collapse several second level groups', function(assert) {
        this.array = [
            { field1: 1, field2: 2, field3: 3 },
            { field1: 1, field2: 2, field3: 4 },
            { field1: 1, field2: 3, field3: 5 },
            { field1: 1, field2: 3, field3: 6 },
            { field1: 2, field2: 4, field3: 7 },
            { field1: 2, field2: 4, field3: 8 },
            { field1: 2, field2: 5, field3: 9 },
            { field1: 2, field2: 5, field3: 10 },
        ];

        const source = this.createDataSource({
            pageSize: 4
        });

        // act
        source.load();

        source.changeRowExpand([1, 2]);
        source.load();
        source.changeRowExpand([1, 3]);
        source.load();
        source.changeRowExpand([2, 4]);
        source.load();

        assert.equal(source.totalItemsCount(), 5);
        assert.deepEqual(source.items(), [{
            key: 1, items: [{ key: 2, items: null }, { key: 3, items: null }]
        }, {
            key: 2, isContinuationOnNextPage: true, items: [
                { key: 4, items: null },
                { key: 5, isContinuationOnNextPage: true, items: [this.array[6]] }
            ]
        }]);
    });

    QUnit.test('Collapse state of items restore after expand', function(assert) {
        const source = this.createDataSource({
            pageSize: 4
        });

        // act
        source.load();

        source.changeRowExpand([1, 3]);
        source.load();
        source.changeRowExpand([1]);
        source.load();
        source.changeRowExpand([1]);
        source.load();

        assert.equal(source.totalItemsCount(), 4);
        assert.deepEqual(source.items(), [{
            key: 1, items: [{
                key: 2, items: [
                    { field1: 1, field2: 2, field3: 3 },
                    { field1: 1, field2: 2, field3: 4 }
                ]
            }, { key: 3, items: null }
            ]
        }, {
            key: 2, items: [{
                key: 4, items: [
                    { field1: 2, field2: 4, field3: 7 }
                ]
            }]
        }]);
    });

    QUnit.test('change sortOrder of group', function(assert) {
        let loadingChangedCount = 0;
        this.array.push({ field1: 3, field2: 5, field3: 8 });

        const source = this.createDataSource({
            pageSize: 4
        });

        // act
        source.load();
        source.changeRowExpand([1, 2]);
        source.load();
        source.group([{ selector: 'field1', desc: true }, 'field2']);

        source.loadingChanged.add(function() {
            loadingChangedCount++;
        });
        source.reload();

        // assert
        assert.equal(source.totalItemsCount(), 5);
        assert.deepEqual(source.items(), [{
            key: 3, items: [{
                key: 5, items: [{ field1: 3, field2: 5, field3: 8 }]
            }]
        }, {
            key: 2, items: [{
                key: 4, items: [{ field1: 2, field2: 4, field3: 7 }]
            }]
        }, {
            key: 1, isContinuationOnNextPage: true, items: [{
                key: 2, items: null
            }, {
                key: 3, isContinuationOnNextPage: true, items: [{ field1: 1, field2: 3, field3: 5 }]
            }
            ]
        }]);
        // T197066
        assert.equal(loadingChangedCount, 2, 'first - update collapsed group info, second - load data');
        assert.ok(!source.isLoading(), 'load completed');
    });

    QUnit.test('reset groups info when change group fields', function(assert) {
        this.array.push({ field1: 3, field2: 5, field3: 8 });

        const source = this.createDataSource({
            pageSize: 4
        });

        // act
        source.load();
        source.changeRowExpand([1, 2]);
        source.load();
        source.group(['field3', 'field2']);
        source.reload();

        assert.deepEqual(source.getGroupsInfo(), []);
    });

    QUnit.test('reset groups info when clear group fields', function(assert) {
        this.array.push({ field1: 3, field2: 5, field3: 8 });

        const source = this.createDataSource({
            pageSize: 4
        });

        // act
        source.load();
        source.changeRowExpand([1, 2]);
        source.load();
        source.group(null);
        source.reload();

        assert.deepEqual(source.getGroupsInfo(), []);
    });

    QUnit.test('clear second level groups info when change second level group field', function(assert) {
        this.array.push({ field1: 3, field2: 5, field3: 8 });

        const source = this.createDataSource({
            pageSize: 4
        });

        // act
        source.load();
        source.changeRowExpand([1, 2]);
        source.load();
        source.group(['field1', 'field3']);
        source.reload();

        assert.deepEqual(source.getGroupsInfo(), [
            {
                children: [],
                key: 1,
                offset: 0,
                data: {
                    isExpanded: true,
                    offset: 0,
                    path: [1]
                }
            }
        ]);
    });

    QUnit.test('clear second level groups info when change change groups count to one', function(assert) {
        this.array.push({ field1: 3, field2: 5, field3: 8 });

        const source = this.createDataSource({
            pageSize: 4
        });

        // act
        source.load();
        source.changeRowExpand([1, 2]);
        source.load();
        source.group('field1');
        source.reload();

        assert.deepEqual(source.getGroupsInfo(), [
            {
                children: [],
                key: 1,
                offset: 0,
                data: {
                    isExpanded: true,
                    offset: 0,
                    path: [1]
                }
            }
        ]);
    });

    // T307341
    QUnit.test('Update group offset for expanded grouped row of the first level when change sortOrder of the first level group field', function(assert) {
        // arrange
        this.array = [
            { field1: 1, field2: 2, field3: 3 },
            { field1: 1, field2: 2, field3: 4 },
            { field1: 1, field2: 3, field3: 5 },
            { field1: 2, field2: 4, field3: 6 },
            { field1: 3, field2: 5, field3: 7 },
            { field1: 4, field2: 6, field3: 8 },
            { field1: 4, field2: 6, field3: 9 },
            { field1: 4, field2: 6, field3: 10 },
            { field1: 4, field2: 6, field3: 11 }
        ];

        const source = this.createDataSource({
            pageSize: 5
        });

        source.load();
        source.changeRowExpand([1, 2]);
        source.load();
        source.changeRowExpand([1, 3]);
        source.load();
        source.changeRowExpand([2]);
        source.load();
        source.changeRowExpand([3]);
        source.load();
        source.changeRowExpand([4]);
        source.load();

        // act
        source.group([{ selector: 'field1', desc: true, isExpanded: true }, { selector: 'field2', isExpanded: true }]);
        source.reload();

        // assert
        assert.equal(source.totalItemsCount(), 5);
        assert.deepEqual(source.items(), [{
            key: 4, items: null
        }, {
            key: 3, items: null
        }, {
            key: 2, items: null
        }, {
            key: 1, items: [{
                key: 2, items: null
            }, {
                key: 3, items: null
            }
            ]
        }]);
    });

    // T318433, T318206
    QUnit.test('change filter after collapse second level group', function(assert) {
        const source = this.createDataSource({
            pageSize: 3
        });

        source.load();
        source.changeRowExpand([1, 2]);
        source.load();

        const loadArgs = [];
        source.store().on('loading', function(e) {
            loadArgs.push(e);
        });

        // act
        source.filter(['field1', '>=', 1]);
        source.load();

        // assert
        assert.equal(source.totalItemsCount(), 4);
        assert.deepEqual(source.items(), [{
            key: 1, items: [{
                key: 2, items: null
            }, {
                key: 3, items: [
                    { field1: 1, field2: 3, field3: 5 },
                    { field1: 1, field2: 3, field3: 6 }
                ]
            }
            ]
        }]);
        assert.equal(loadArgs.length, 3);
        assert.deepEqual(loadArgs[0].filter, [['field1', '=', 1], 'and', ['field2', '=', 2], 'and', ['field1', '>=', 1]]);
        assert.deepEqual(loadArgs[1].filter, [[[['field1', '<', 1], 'or', ['field1', '=', null]], 'or', [['field1', '=', 1], 'and', [['field2', '<', 2], 'or', ['field2', '=', null]]]], 'and', ['field1', '>=', 1]]);
        assert.deepEqual(loadArgs[2].filter, [[['field1', '<>', 1], 'or', [['field1', '=', 1], 'and', ['field2', '<>', 2]]], 'and', ['field1', '>=', 1]]);
    });
});

function createDataSourceWithRemoteGrouping(options, remoteGroupPaging, brokeOptions) {
    if($.isArray(options.store) || (options.store && options.store.type === 'array') || options.load) {
        const arrayStore = new ArrayStore(options.store || []);
        options.executeAsync = options.executeAsync || function(func) { func(); };
        brokeOptions = brokeOptions || {};

        options.remoteOperations = { filtering: true, sorting: true, grouping: true, paging: true, summary: true };
        if(remoteGroupPaging) {
            options.remoteOperations.groupPaging = true;
        }
        delete options.store;
        options.load = options.load || function(loadOptions) {
            const d = $.Deferred();

            const removeDataItems = function(items, groupCount) {
                if(!groupCount) return;
                for(let i = 0; i < items.length; i++) {
                    if(groupCount > 1) {
                        removeDataItems(items[i].items, groupCount - 1);
                    } else {
                        items[i].count = items[i].items.length;
                        items[i].items = null;
                    }
                }
            };

            options.executeAsync(function() {
                if(brokeOptions.errorOnFirstLoad) {
                    brokeOptions.errorOnFirstLoad = false;
                    d.reject('Error');
                    return;
                }
                arrayStore.load(loadOptions).done(function(data) {
                    const groupCount = gridCore.normalizeSortingInfo(loadOptions.group).length;

                    removeDataItems(data, groupCount);

                    arrayStore.totalCount(loadOptions).done(function(totalCount) {
                        const extra = {};
                        if(loadOptions.requireTotalCount && !brokeOptions.skipTotalCount) {
                            extra.totalCount = totalCount;
                        }
                        if(loadOptions.requireGroupCount && !brokeOptions.skipGroupCount) {
                            queryByOptions(arrayStore.createQuery(), {
                                filter: loadOptions.filter,
                                group: loadOptions.group
                            }).count().done(function(groupCount) {
                                extra.groupCount = groupCount;
                            });
                        }
                        if(brokeOptions.useNativePromise) {
                            d.resolve($.extend({ data: data }, extra));
                        } else {
                            d.resolve(data, extra);
                        }
                    });
                });
            }, loadOptions);
            return d;
        };
    }
    return createDataSource(options);
}

QUnit.module('Remote group paging', {
    beforeEach: function() {
        this.array = [
            { field1: 1, field2: 2, field3: 3 },
            { field1: 1, field2: 2, field3: 4 },
            { field1: 1, field2: 3, field3: 5 },
            { field1: 2, field2: 4, field3: 6 },
            { field1: 2, field2: 4, field3: 7 },
            { field1: 1, field2: 5, field3: 7 }
        ];

        this.clock = sinon.useFakeTimers();

        const remoteGroupPaging = true;

        this.createDataSource = function(options, brokeOptions) {
            return createDataSourceWithRemoteGrouping($.extend({
                store: this.array,
                paginate: true,
                requireTotalCount: true,
                requireGroupCount: true
            }, options || {}), remoteGroupPaging, brokeOptions);
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {

    QUnit.test('Load collapsed group', function(assert) {
        const dataSource = this.createDataSource({
            group: 'field2',
            pageSize: 2
        });
        const loadingChanged = sinon.stub();

        dataSource.store().on('loading', loadingChanged);

        dataSource.load();

        assert.deepEqual(dataSource.items(), [{
            key: 2, items: null
        }, {
            key: 3, items: null
        }], 'loaded items');

        assert.equal(dataSource.totalItemsCount(), 4, 'total items count');
        assert.strictEqual(loadingChanged.callCount, 1);
        // assert.deepEqual(loadingChanged.lastCall.args[0].group, "field2");
        assert.strictEqual(loadingChanged.lastCall.args[0].requireTotalCount, true);
        assert.strictEqual(loadingChanged.lastCall.args[0].requireGroupCount, true);
        assert.strictEqual(loadingChanged.lastCall.args[0].skip, 0);
        assert.strictEqual(loadingChanged.lastCall.args[0].take, 2);

    });

    QUnit.test('Load collapsed group and expand first item', function(assert) {
        const dataSource = this.createDataSource({
            group: 'field2',
            pageSize: 3
        });
        const loadingChanged = sinon.stub();

        dataSource.load();

        dataSource.store().on('loading', loadingChanged);

        dataSource.changeRowExpand([2]);

        dataSource.load();

        assert.deepEqual(dataSource.items(), [
            {
                key: 2,
                items: [{ 'field1': 1, 'field2': 2, 'field3': 3 },
                    { 'field1': 1, 'field2': 2, 'field3': 4 }]
            }], 'items');

        assert.equal(dataSource.totalItemsCount(), 6, 'total items count');
        assert.strictEqual(loadingChanged.callCount, 2, 'loading count');
        assert.deepEqual(loadingChanged.getCall(0).args[0].group, [{ 'desc': false, 'selector': 'field2' }], 'group by for second level loading');
        assert.strictEqual(loadingChanged.getCall(0).args[0].requireTotalCount, true, 'require total count is passed on first loading');
        assert.strictEqual(loadingChanged.getCall(0).args[0].requireGroupCount, true, 'require group count is passed on first loading');
        assert.strictEqual(loadingChanged.getCall(0).args[0].skip, 0, 'skip for first level');
        assert.strictEqual(loadingChanged.getCall(0).args[0].take, 1, 'take for first level');

        assert.deepEqual(loadingChanged.getCall(1).args[0].group, null, 'group by for second level loading');
        assert.deepEqual(loadingChanged.getCall(1).args[0].filter, ['field2', '=', 2], 'filter on second loading');
        assert.strictEqual(loadingChanged.getCall(1).args[0].requireTotalCount, false, 'require total count is passed on second loading');
        assert.strictEqual(loadingChanged.getCall(1).args[0].requireGroupCount, false, 'require group count is passed on first loading');
        assert.strictEqual(loadingChanged.getCall(1).args[0].skip, undefined, 'skip for second level');
        assert.strictEqual(loadingChanged.getCall(1).args[0].take, 2, 'take for second level');
    });

    // T511907
    QUnit.test('Load collapsed group and expand group item that contain items with white space at the end', function(assert) {
        const loadStub = sinon.stub();
        const dataSource = this.createDataSource({
            load: loadStub,
            group: 'name',
            pageSize: 3
        });

        loadStub.onCall(0).returns($.Deferred().resolve({
            data: [
                { key: 'test1', items: null, count: 3 },
                { key: 'test2', items: null, count: 3 },
                { key: 'test3', items: null, count: 3 }
            ], totalCount: 9, groupCount: 3
        }));

        loadStub.onCall(1).returns($.Deferred().resolve({
            data: [
                { key: 'test1', items: null, count: 3 }
            ], totalCount: 9, groupCount: 3
        }));

        loadStub.onCall(2).returns($.Deferred().resolve({
            data: [
                { name: 'test1', id: 1 },
                { name: 'test1 ', id: 2 }
            ]
        }));

        dataSource.load();

        dataSource.changeRowExpand(['test1']);

        // act
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items(), [
            {
                key: 'test1',
                isContinuationOnNextPage: true,
                items: [
                    { name: 'test1', id: 1 },
                    { name: 'test1 ', id: 2 }
                ]
            }], 'items');

        assert.equal(dataSource.totalItemsCount(), 7, 'total items count');

        assert.strictEqual(loadStub.callCount, 3, 'loading count');
        assert.deepEqual(loadStub.getCall(0).args[0].group, [{ 'desc': false, 'selector': 'name' }], 'load 0 group');
        assert.deepEqual(loadStub.getCall(1).args[0].group, [{ 'desc': false, 'selector': 'name' }], 'load 1 group');

        assert.deepEqual(loadStub.getCall(2).args[0].group, null, 'load 2 group');
        assert.deepEqual(loadStub.getCall(2).args[0].filter, ['name', '=', 'test1'], 'load 2 filter');
        assert.strictEqual(loadStub.getCall(2).args[0].skip, undefined, 'load 2 skip');
        assert.strictEqual(loadStub.getCall(2).args[0].take, 2, 'load 2 skip');
    });

    QUnit.test('Expand group if group key is object', function(assert) {
        const dataSource = this.createDataSource({
            load: function() {
                return $.Deferred().resolve({
                    data: [
                        { key: { groupId: 1, groupName: 'test 1' }, items: [{ id: 1 }] },
                        { key: { groupId: 2, groupName: 'test 2' }, items: [{ id: 2 }] }
                    ], totalCount: 2, groupCount: 2
                });
            },
            group: 'group'
        });

        dataSource.load();

        // act
        dataSource.changeRowExpand([{ groupId: 1, groupName: 'test 1' }]);
        dataSource.load();

        // assert
        assert.equal(dataSource.totalItemsCount(), 3, 'total items count');
        assert.deepEqual(dataSource.items(), [{
            key: { groupId: 1, groupName: 'test 1' },
            items: [{ id: 1 }]
        }, {
            key: { groupId: 2, groupName: 'test 2' },
            items: null
        }], 'items');
    });

    QUnit.test('Load collapsed group and expand first item when native promise is used', function(assert) {
        const dataSource = this.createDataSource({
            group: 'field2',
            pageSize: 3
        }, { useNativePromise: true });
        const loadingChanged = sinon.stub();

        dataSource.load();

        dataSource.store().on('loading', loadingChanged);

        dataSource.changeRowExpand([2]);

        dataSource.load();

        assert.deepEqual(dataSource.items(), [
            {
                key: 2,
                items: [{ 'field1': 1, 'field2': 2, 'field3': 3 },
                    { 'field1': 1, 'field2': 2, 'field3': 4 }]
            }], 'items');
    });

    QUnit.test('Send count query on row expand when next level is group', function(assert) {
        const dataSource = this.createDataSource({
            group: ['field2', 'field1'],
            pageSize: 2
        });
        const loadingChanged = sinon.stub();

        dataSource.load();

        dataSource.store().on('loading', loadingChanged);

        dataSource.changeRowExpand([2]);

        assert.deepEqual(dataSource.items(), [{
            key: 2, items: null
        }, {
            key: 3, items: null
        }], 'loaded items');

        assert.equal(dataSource.totalItemsCount(), 4, 'total items count');
        assert.strictEqual(loadingChanged.callCount, 1, 'loading count');

        assert.deepEqual(loadingChanged.getCall(0).args[0].group, [{ 'desc': false, 'selector': 'field1' }], 'group');
        assert.strictEqual(loadingChanged.getCall(0).args[0].requireTotalCount, false, 'require total count is not passed on loading');
        assert.strictEqual(loadingChanged.getCall(0).args[0].requireGroupCount, true, 'require group count is not passed on loading');
        assert.deepEqual(loadingChanged.getCall(0).args[0].filter, ['field2', '=', 2], 'filter');
        assert.strictEqual(loadingChanged.getCall(0).args[0].skip, 0, 'skip');
        assert.strictEqual(loadingChanged.getCall(0).args[0].take, 1, 'take');
    });

    QUnit.test('Send count query on row expand when next level is group if group by 3 levels', function(assert) {
        const dataSource = this.createDataSource({
            group: ['field2', 'field1', 'field3'],
            pageSize: 2
        });
        const loadingChanged = sinon.stub();

        dataSource.load();

        dataSource.store().on('loading', loadingChanged);

        dataSource.changeRowExpand([2]);

        assert.deepEqual(dataSource.items(), [{
            key: 2, items: null
        }, {
            key: 3, items: null
        }], 'loaded items');

        assert.equal(dataSource.totalItemsCount(), 4, 'total items count');
        assert.strictEqual(loadingChanged.callCount, 1, 'loading count');

        assert.deepEqual(loadingChanged.getCall(0).args[0].group, [{ 'desc': false, 'selector': 'field1' }], 'group');
        assert.strictEqual(loadingChanged.getCall(0).args[0].requireTotalCount, false, 'require total count is not passed on loading');
        assert.strictEqual(loadingChanged.getCall(0).args[0].requireGroupCount, true, 'require group count is not passed on loading');
        assert.deepEqual(loadingChanged.getCall(0).args[0].filter, ['field2', '=', 2], 'filter');
        assert.strictEqual(loadingChanged.getCall(0).args[0].skip, 0, 'skip');
        assert.strictEqual(loadingChanged.getCall(0).args[0].take, 1, 'take');
    });

    // T493778
    QUnit.test('Send count query on row expand when next level is group if use native promises', function(assert) {
        const dataSource = this.createDataSource({
            group: ['field2', 'field1'],
            pageSize: 2
        }, { useNativePromise: true });
        const loaded = sinon.stub();

        dataSource.load();

        dataSource.store().on('loaded', loaded);

        dataSource.changeRowExpand([2]);

        assert.deepEqual(dataSource.items(), [{
            key: 2, items: null
        }, {
            key: 3, items: null
        }], 'loaded items');

        assert.equal(dataSource.totalItemsCount(), 4, 'total items count');
        assert.strictEqual(loaded.callCount, 1, 'loading count');

        assert.deepEqual(loaded.getCall(0).args[0], { data: [{ key: 1, items: null, count: 2 }], groupCount: 1, totalCount: undefined }, 'loaded data');

        assert.deepEqual(loaded.getCall(0).args[1].group, [{ 'desc': false, 'selector': 'field1' }], 'group');
        assert.strictEqual(loaded.getCall(0).args[1].requireTotalCount, false, 'require total count is not passed on loading');
        assert.strictEqual(loaded.getCall(0).args[1].requireGroupCount, true, 'require group count is not passed on loading');
        assert.deepEqual(loaded.getCall(0).args[1].filter, ['field2', '=', 2], 'filter');
        assert.strictEqual(loaded.getCall(0).args[1].skip, 0, 'skip');
        assert.strictEqual(loaded.getCall(0).args[1].take, 1, 'take');
    });

    QUnit.test('Load collapsed groups and expand first item when two groups', function(assert) {
        const dataSource = this.createDataSource({
            executeAsync: function(func, loadOptions) {
                setTimeout(func, 10);
            },
            group: ['field1', 'field2'],
            pageSize: 3
        });
        const loadingChanged = sinon.stub();

        dataSource.summary({
            groupAggregates: [{
                summaryType: 'count'
            }],
            totalAggregates: [{
                summaryType: 'count'
            }]
        });

        dataSource.load();
        this.clock.tick(10);

        dataSource.changeRowExpand([1]);
        this.clock.tick(10);

        dataSource.store().on('loading', loadingChanged);

        dataSource.load();
        this.clock.tick(10);
        this.clock.tick(10);

        assert.deepEqual(dataSource.items(), [
            {
                isContinuationOnNextPage: true,
                key: 1,
                items: [{
                    key: 2,
                    items: null
                }, {
                    key: 3,
                    items: null
                }]
            }], 'items');

        assert.equal(dataSource.totalItemsCount(), 6, 'total items count');
        assert.strictEqual(loadingChanged.callCount, 2, 'loading count');

        assert.deepEqual(loadingChanged.getCall(0).args[0].group, [{ 'desc': false, 'selector': 'field1' }], 'group by for second level loading');
        assert.strictEqual(loadingChanged.getCall(0).args[0].requireTotalCount, true, 'require total count is passed on first loading');
        assert.strictEqual(loadingChanged.getCall(0).args[0].requireGroupCount, true, 'require group count is passed on first loading');
        assert.strictEqual(loadingChanged.getCall(0).args[0].skip, 0, 'skip for first level');
        assert.strictEqual(loadingChanged.getCall(0).args[0].take, 1, 'take for first level');
        assert.deepEqual(loadingChanged.getCall(0).args[0].groupSummary, [{ summaryType: 'count' }], 'groupSummary for first loading');
        assert.deepEqual(loadingChanged.getCall(0).args[0].totalSummary, [{ summaryType: 'count' }], 'totalSummary for first loading');

        assert.deepEqual(loadingChanged.getCall(1).args[0].group, [{ 'desc': false, 'selector': 'field2' }], 'group by for second level loading');
        assert.deepEqual(loadingChanged.getCall(1).args[0].filter, ['field1', '=', 1], 'filter on second loading');
        assert.strictEqual(loadingChanged.getCall(1).args[0].requireTotalCount, false, 'require total count should not be passed on second loading');
        assert.strictEqual(loadingChanged.getCall(1).args[0].requireGroupCount, true, 'require group count should not be passed on second loading');
        assert.strictEqual(loadingChanged.getCall(1).args[0].skip, 0, 'skip for second level');
        assert.strictEqual(loadingChanged.getCall(1).args[0].take, 2, 'take for second level');
        assert.deepEqual(loadingChanged.getCall(1).args[0].groupSummary, [{ summaryType: 'count' }], 'groupSummary for second loading');
        assert.deepEqual(loadingChanged.getCall(1).args[0].totalSummary, undefined, 'no totalSummary for second loading');
    });

    QUnit.test('Load collapsed groups, expand second big item and go to third page when two groups', function(assert) {
        const array = [{ field1: 1, field2: 2, field3: 3 },
            { field1: 2, field2: 3, field3: 4 },
            { field1: 2, field2: 4, field3: 5 },
            { field1: 2, field2: 5, field3: 6 },
            { field1: 2, field2: 6, field3: 7 },
            { field1: 2, field2: 7, field3: 8 },
            { field1: 2, field2: 8, field3: 9 },
            { field1: 3, field2: 9, field3: 10 }];

        const dataSource = this.createDataSource({
            store: array,
            group: ['field1', 'field2'],
            pageSize: 3
        });

        dataSource.load();

        // act
        dataSource.changeRowExpand([2]);
        dataSource.load();

        dataSource.pageIndex(1);
        dataSource.load();

        dataSource.pageIndex(2);
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items(), [
            {
                isContinuation: true,
                isContinuationOnNextPage: true,
                key: 2,
                items: [{
                    key: 6,
                    items: null
                }, {
                    key: 7,
                    items: null
                }]
            }], 'items');

        assert.equal(dataSource.totalItemsCount(), 12, 'total items count');
    });

    QUnit.test('Load collapsed groups, expand second level item, expand third level big item and go to third page when two groups', function(assert) {
        const array = [{ field1: 1, field2: 2, field3: 3 },
            { field1: 2, field2: 3, field3: 4 },
            { field1: 2, field2: 4, field3: 5 },
            { field1: 2, field2: 4, field3: 6 },
            { field1: 2, field2: 4, field3: 7 },
            { field1: 2, field2: 4, field3: 8 },
            { field1: 2, field2: 4, field3: 9 },
            { field1: 3, field2: 5, field3: 10 }];

        const dataSource = this.createDataSource({
            store: array,
            group: ['field1', 'field2'],
            pageSize: 4
        });

        dataSource.load();

        // act
        dataSource.changeRowExpand([2]);
        dataSource.load();

        dataSource.changeRowExpand([2, 4]);
        dataSource.load();

        dataSource.pageIndex(1);
        dataSource.load();

        dataSource.pageIndex(2);
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items(), [
            {
                isContinuation: true,
                key: 2,
                items: [{
                    key: 4,
                    isContinuation: true,
                    isContinuationOnNextPage: true,
                    items: [array[4], array[5]]
                }]
            }], 'items');

        assert.equal(dataSource.totalItemsCount(), 16, 'total items count');
    });

    // T623492
    QUnit.test('Change page several times after expand groups if data is grouped by two fields', function(assert) {
        const array = [];
        let j;
        for(let i = 0; i < 4; i++) {
            for(j = 0; j < 6; j++) {
                array.push({ group1: i, group2: 0, id: i * 9 + j + 1 });
            }
            for(j = 0; j < 3; j++) {
                array.push({ group1: i, group2: 1, id: i * 9 + j + 7 });
            }
        }

        const dataSource = this.createDataSource({
            store: array,
            group: ['group1', 'group2'],
            pageSize: 20,
            scrolling: { mode: 'virtual' }
        });

        dataSource.load();
        dataSource.setViewportPosition(1);

        // act
        dataSource.changeRowExpand([0]);
        dataSource.load();
        dataSource.changeRowExpand([0, 0]);
        dataSource.load();
        dataSource.changeRowExpand([0, 1]);
        dataSource.load();
        dataSource.changeRowExpand([1]);
        dataSource.load();
        dataSource.changeRowExpand([1, 0]);
        dataSource.load();

        dataSource.pageIndex(1);
        dataSource.load();

        dataSource.changeRowExpand([1, 1]);
        dataSource.load();
        dataSource.changeRowExpand([2]);
        dataSource.load();
        dataSource.changeRowExpand([2, 0]);
        dataSource.load();
        dataSource.changeRowExpand([2, 1]);
        dataSource.load();
        dataSource.changeRowExpand([3]);
        dataSource.load();
        dataSource.changeRowExpand([3, 0]);
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items().length, 4, 'first level group count');

        assert.deepEqual(dataSource.items()[2].key, 3, 'prev last group key');
        assert.deepEqual(dataSource.items()[2].items, [{
            'key': 0,
            'isContinuationOnNextPage': true,
            'items': [{
                'group1': 3,
                'group2': 0,
                'id': 28
            }, {
                'group1': 3,
                'group2': 0,
                'id': 29
            }],
        }], 'prev last group items');

        assert.deepEqual(dataSource.items()[3].key, 3, 'last group key');
        assert.deepEqual(dataSource.items()[3].items, [{
            'key': 0,
            'isContinuation': true,
            'items': [{
                'group1': 3,
                'group2': 0,
                'id': 30
            }, {
                'group1': 3,
                'group2': 0,
                'id': 31
            }, {
                'group1': 3,
                'group2': 0,
                'id': 32
            }, {
                'group1': 3,
                'group2': 0,
                'id': 33
            }]
        }, {
            'key': 1,
            'items': null
        }], 'last group items');
    });

    QUnit.test('Expand third level group', function(assert) {
        const array = [
            /* 1 */
            /* 2 */
            /* 3 */
            { field1: 1, field2: 2, field3: 3, id: 1 },
            { field1: 1, field2: 2, field3: 3, id: 2 },
            /* 2 */ { field1: 2, field2: 2, field3: 4, id: 3 },
            // ===
            { field1: 3, field2: 3, field3: 5, id: 4 },
            { field1: 4, field2: 3, field3: 5, id: 5 },
            { field1: 5, field2: 3, field3: 5, id: 6 }
        ];

        const dataSource = this.createDataSource({
            store: array,
            group: ['field1', 'field2', 'field3'],
            pageSize: 6
        });

        dataSource.load();

        // act
        dataSource.changeRowExpand([1]);
        dataSource.load();

        dataSource.changeRowExpand([1, 2]);
        dataSource.load();

        dataSource.changeRowExpand([1, 2, 3]);
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items().length, 2, 'group count on first levetl');

        assert.deepEqual(dataSource.items()[0].items, [{
            key: 2,
            items: [{
                key: 3,
                items: [array[0], array[1]]
            }]
        }], 'items');

        assert.equal(dataSource.totalItemsCount(), 9, 'total items count');
    });

    QUnit.test('Load collapsed groups and expand two items when two groups', function(assert) {
        const dataSource = this.createDataSource({
            group: ['field1', 'field2'],
            pageSize: 5
        });
        const loadingChanged = sinon.stub();

        dataSource.load();

        dataSource.changeRowExpand([1]);
        dataSource.load();

        dataSource.changeRowExpand([2]);
        dataSource.store().on('loading', loadingChanged);
        dataSource.load();

        assert.deepEqual(dataSource.items(), [
            {
                key: 1,
                items: [{
                    key: 2,
                    items: null
                }, {
                    key: 3,
                    items: null
                },
                {
                    key: 5,
                    items: null
                }]
            }, {
                key: 2,
                isContinuationOnNextPage: true,
                items: []
            }], 'items');

        assert.equal(dataSource.totalItemsCount(), 7, 'total items count');
        assert.strictEqual(loadingChanged.callCount, 2, 'loading count');

        assert.deepEqual(loadingChanged.getCall(0).args[0].group, [{ 'desc': false, 'selector': 'field1' }], 'group by for second level loading');
        assert.strictEqual(loadingChanged.getCall(0).args[0].requireTotalCount, true, 'require total count is passed on first loading');
        assert.strictEqual(loadingChanged.getCall(0).args[0].requireGroupCount, true, 'require group count is passed on first loading');
        assert.strictEqual(loadingChanged.getCall(0).args[0].skip, 0, 'skip for first level');
        assert.strictEqual(loadingChanged.getCall(0).args[0].take, 2, 'take for first level');

        assert.deepEqual(loadingChanged.getCall(1).args[0].group, [{ 'desc': false, 'selector': 'field2' }], 'group by for second level loading');
        assert.deepEqual(loadingChanged.getCall(1).args[0].filter, ['field1', '=', 1], 'filter on second loading');
        assert.strictEqual(loadingChanged.getCall(1).args[0].requireTotalCount, false, 'require total count should not be passed on second loading');
        assert.strictEqual(loadingChanged.getCall(1).args[0].requireGroupCount, true, 'require group count should be passed on second loading');
        assert.strictEqual(loadingChanged.getCall(1).args[0].skip, 0, 'skip for second level');
        assert.strictEqual(loadingChanged.getCall(1).args[0].take, undefined, 'take for second level');
    });

    QUnit.test('Load collapsed group and expand second level item', function(assert) {
        const dataSource = this.createDataSource({
            group: ['field1', 'field2'],
            pageSize: 3
        });
        const loadingChanged = sinon.stub();

        dataSource.load();

        dataSource.changeRowExpand([1]);
        dataSource.load();

        dataSource.changeRowExpand([1, 2]);

        dataSource.store().on('loading', loadingChanged);

        dataSource.load();

        assert.deepEqual(dataSource.items(), [
            {
                isContinuationOnNextPage: true,
                key: 1,
                items: [{
                    key: 2,
                    isContinuationOnNextPage: true,
                    items: [
                        { 'field1': 1, 'field2': 2, 'field3': 3 }
                    ]
                }]
            }], 'items');

        assert.equal(dataSource.totalItemsCount(), 10, 'total items count'); // ?
        assert.strictEqual(loadingChanged.callCount, 3, 'loading count');

        assert.deepEqual(loadingChanged.getCall(0).args[0].group, [{ 'desc': false, 'selector': 'field1' }], 'group by for second level loading');
        assert.strictEqual(loadingChanged.getCall(0).args[0].requireTotalCount, true, 'require total count is passed on first loading');
        assert.strictEqual(loadingChanged.getCall(0).args[0].skip, 0, 'skip for first level');
        assert.strictEqual(loadingChanged.getCall(0).args[0].take, 1, 'take for first level');

        assert.deepEqual(loadingChanged.getCall(1).args[0].group, [{ 'desc': false, 'selector': 'field2' }], 'group by for second level loading');
        assert.deepEqual(loadingChanged.getCall(1).args[0].filter, ['field1', '=', 1], 'filter on second loading');
        assert.strictEqual(loadingChanged.getCall(1).args[0].requireTotalCount, false, 'require total count is passed on second loading');
        assert.strictEqual(loadingChanged.getCall(1).args[0].skip, 0, 'skip for second level');
        assert.strictEqual(loadingChanged.getCall(1).args[0].take, 1, 'take for second level');

        assert.deepEqual(loadingChanged.getCall(2).args[0].group, null, 'group by for second level loading');
        assert.deepEqual(loadingChanged.getCall(2).args[0].filter, [['field1', '=', 1], 'and', ['field2', '=', 2]], 'filter on second loading');
        assert.strictEqual(loadingChanged.getCall(2).args[0].requireTotalCount, false, 'require total count is passed on second loading');
        assert.strictEqual(loadingChanged.getCall(2).args[0].skip, undefined, 'skip for second level');
        assert.strictEqual(loadingChanged.getCall(2).args[0].take, 1, 'take for second level');
    });

    // T452323
    QUnit.test('Reload dataSource when one expanded group and two group levels exist', function(assert) {
        const dataSource = this.createDataSource({
            group: ['field1', 'field2'],
            pageSize: 3
        });
        const loadingChanged = sinon.stub();

        dataSource.load();

        dataSource.changeRowExpand([1]);
        dataSource.load();

        dataSource.store().on('loading', loadingChanged);

        // act
        dataSource.reload(true);

        assert.deepEqual(dataSource.items(), [
            {
                isContinuationOnNextPage: true,
                key: 1,
                items: [{
                    key: 2,
                    items: null
                }, {
                    key: 3,
                    items: null
                }]
            }], 'items');

        assert.equal(dataSource.totalItemsCount(), 6, 'total items count');
        assert.strictEqual(loadingChanged.callCount, 4, 'loading count');

        assert.deepEqual(loadingChanged.getCall(0).args[0].group, ['field2'], 'group for group count request');
        assert.deepEqual(loadingChanged.getCall(0).args[0].filter, ['field1', '=', 1], 'filter for group count request');
        assert.strictEqual(loadingChanged.getCall(0).args[0].requireTotalCount, false, 'require total count is not passed for group count request');
        assert.strictEqual(loadingChanged.getCall(0).args[0].requireGroupCount, true, 'require group count is passed for group count request');
        assert.strictEqual(loadingChanged.getCall(0).args[0].skip, 0, 'skip for group count request');
        assert.strictEqual(loadingChanged.getCall(0).args[0].take, 1, 'take for group count request');

        assert.deepEqual(loadingChanged.getCall(1).args[0].group, ['field1'], 'group for group offset request'); // T452323, T477410
        assert.deepEqual(loadingChanged.getCall(1).args[0].filter, [['field1', '<', 1], 'or', ['field1', '=', null]], 'filter for group offset request');
        assert.strictEqual(loadingChanged.getCall(1).args[0].requireTotalCount, false, 'require total count is not passed for group offset request');
        assert.strictEqual(loadingChanged.getCall(1).args[0].requireGroupCount, true, 'require group count is passed for group offset request');
        assert.strictEqual(loadingChanged.getCall(1).args[0].skip, 0, 'skip for group offset request');
        assert.strictEqual(loadingChanged.getCall(1).args[0].take, 1, 'take for group offset request');

        assert.deepEqual(loadingChanged.getCall(2).args[0].group, [{ 'desc': false, 'selector': 'field1' }], 'group by for second level loading');
        assert.strictEqual(loadingChanged.getCall(2).args[0].requireTotalCount, true, 'require total count is passed on first loading');
        assert.strictEqual(loadingChanged.getCall(2).args[0].requireGroupCount, true, 'require group count is passed on first loading');
        assert.strictEqual(loadingChanged.getCall(2).args[0].skip, 0, 'skip for first level');
        assert.strictEqual(loadingChanged.getCall(2).args[0].take, 1, 'take for first level');

        assert.deepEqual(loadingChanged.getCall(3).args[0].group, [{ 'desc': false, 'selector': 'field2' }], 'group by for second level loading');
        assert.deepEqual(loadingChanged.getCall(3).args[0].filter, ['field1', '=', 1], 'filter on second loading');
        assert.strictEqual(loadingChanged.getCall(3).args[0].requireTotalCount, false, 'require total count should not be passed on second loading');
        assert.strictEqual(loadingChanged.getCall(3).args[0].requireGroupCount, true, 'require group count should not be passed on second loading');
        assert.strictEqual(loadingChanged.getCall(3).args[0].skip, 0, 'skip for second level');
        assert.strictEqual(loadingChanged.getCall(3).args[0].take, 2, 'take for second level');
    });

    // T990766
    QUnit.test('Reload dataSource when two expanded group and two group levels exist', function(assert) {
        const dataSource = this.createDataSource({
            group: ['field1', 'field2'],
            pageSize: 3
        });
        const loadingChanged = sinon.stub();

        dataSource.load();

        dataSource.changeRowExpand([2]);
        dataSource.load();
        dataSource.changeRowExpand([2, 4]);
        dataSource.load();

        dataSource.store().on('loading', loadingChanged);

        // act
        dataSource.reload(true);

        assert.deepEqual(dataSource.items(), [
            {
                key: 1,
                items: null
            },
            {
                key: 2,
                items: [{
                    isContinuationOnNextPage: true,
                    key: 4,
                    items: []
                }]
            }], 'items');

        assert.equal(dataSource.totalItemsCount(), 9, 'total items count');
        assert.strictEqual(loadingChanged.callCount, 6, 'loading count');
    });

    QUnit.test('Error on change grouping when one expanded group and two group levels exist', function(assert) {
        const brokeOptions = {};
        const dataSource = this.createDataSource({
            group: ['field1'],
            pageSize: 3
        }, brokeOptions);
        const changed = sinon.stub();
        const loadError = sinon.stub();

        dataSource.load();

        dataSource.changeRowExpand([1]);
        dataSource.load();

        dataSource.changed.add(changed);
        dataSource.loadError.add(loadError);

        // act
        brokeOptions.errorOnFirstLoad = true;
        dataSource.group(['field1', 'field2']);
        dataSource.load();

        // assert
        assert.strictEqual(changed.callCount, 1, 'changed call count');
        assert.strictEqual(loadError.callCount, 1, 'last error call count');
        assert.strictEqual(changed.lastCall.args[0].changeType, 'loadError', 'last change is error');
        assert.strictEqual(loadError.lastCall.args[0].message, 'Error', 'last error message');
    });

    // T850299
    QUnit.test('Remote group paging should work correctly after sorting if grouping by 2 columns', function(assert) {
        // arrange
        let items;
        let subgroups;

        const data = [];

        for(let j = 1; j < 4; j++) {
            for(let k = 1; k < 16; k++) {
                data.push({
                    group1: 'group',
                    group2: `subgroup${j}`,
                    field: k * j
                });
            }
        }

        const pageSize = 7;

        const dataSource = createDataSourceWithRemoteGrouping({
            store: data,
            paginate: true,
            pageSize,
            group: [{ selector: 'group1', isExpanded: false }, { selector: 'group2', isExpanded: false }],
        }, true);

        dataSource.load();

        // assert
        items = dataSource.items();

        assert.equal(items.length, 1, 'one first level group');
        assert.notOk(items[0].items, 'group is not expanded');

        // act
        dataSource.changeRowExpand(['group']);
        dataSource.load();

        // assert
        items = dataSource.items();

        assert.equal(items.length, 1, 'one first level group');
        assert.equal(items[0].items.length, 3, 'group is expanded');

        items[0].items.forEach((subgroup, index) => {
            assert.notOk(subgroup.items, `subgroup #${index + 1} is not expanded`);
        });

        // act
        dataSource.changeRowExpand(['group', 'subgroup2']);
        dataSource.load();

        // assert
        items = dataSource.items();
        subgroups = items[0].items;

        assert.equal(items.length, 1, 'one first level group');
        assert.equal(subgroups.length, 2, 'group is expanded');

        assert.notOk(subgroups[0].items, 'subgroup #1 is not expanded');

        assert.equal(subgroups[1].items.length, 4, 'subgroup #2 is expanded and paginated');

        // act
        dataSource.sort({ selector: 'field', desc: true });
        dataSource.load();

        // assert
        items = dataSource.items();
        subgroups = items[0].items;

        assert.equal(items.length, 1, 'one first level group');
        assert.equal(subgroups.length, 2, 'group is expanded');

        assert.notOk(subgroups[0].items, 'subgroup #1 is not expanded');

        assert.equal(subgroups[1].items.length, 4, 'subgroup #2 is expanded and paginated');
        assert.deepEqual(subgroups[1].items[0], {
            'field': 30,
            'group1': 'group',
            'group2': 'subgroup2'
        }, 'data is sorted');
    });

    // T477410
    QUnit.test('Reload dataSource when one expanded group and one group level exist', function(assert) {
        const dataSource = this.createDataSource({
            group: ['field1'],
            pageSize: 3
        });
        const loadingChanged = sinon.stub();

        dataSource.load();

        dataSource.changeRowExpand([1]);
        dataSource.load();

        dataSource.store().on('loading', loadingChanged);

        // act
        dataSource.reload(true);

        assert.deepEqual(dataSource.items(), [
            {
                isContinuationOnNextPage: true,
                key: 1,
                items: [
                    { field1: 1, field2: 2, field3: 3 },
                    { field1: 1, field2: 2, field3: 4 }
                ]
            }], 'items');

        assert.equal(dataSource.totalItemsCount(), 7, 'total items count');
        assert.strictEqual(loadingChanged.callCount, 4, 'loading count');

        assert.deepEqual(loadingChanged.getCall(0).args[0].group, null, 'group is empty for group count request');
        assert.deepEqual(loadingChanged.getCall(0).args[0].filter, ['field1', '=', 1], 'filter for group count request');
        assert.strictEqual(loadingChanged.getCall(0).args[0].requireTotalCount, true, 'require total count is not passed for group count request');
        assert.strictEqual(loadingChanged.getCall(0).args[0].requireGroupCount, false, 'require group count is passed for group count request');
        assert.strictEqual(loadingChanged.getCall(0).args[0].skip, 0, 'skip for group count request');
        assert.strictEqual(loadingChanged.getCall(0).args[0].take, 1, 'take for group count request');

        assert.deepEqual(loadingChanged.getCall(1).args[0].group, ['field1'], 'group for group offset request'); // T452323, T477410
        assert.deepEqual(loadingChanged.getCall(1).args[0].filter, [['field1', '<', 1], 'or', ['field1', '=', null]], 'filter for group offset request');
        assert.strictEqual(loadingChanged.getCall(1).args[0].requireTotalCount, false, 'require total count is not passed for group offset request');
        assert.strictEqual(loadingChanged.getCall(1).args[0].requireGroupCount, true, 'require group count is passed for group offset request');
        assert.strictEqual(loadingChanged.getCall(1).args[0].skip, 0, 'skip for group offset request');
        assert.strictEqual(loadingChanged.getCall(1).args[0].take, 1, 'take for group offset request');

        assert.deepEqual(loadingChanged.getCall(2).args[0].group, [{ 'desc': false, 'selector': 'field1' }], 'group by for second level loading');
        assert.strictEqual(loadingChanged.getCall(2).args[0].requireTotalCount, true, 'require total count is passed on first loading');
        assert.strictEqual(loadingChanged.getCall(2).args[0].requireGroupCount, true, 'require group count is passed on first loading');
        assert.strictEqual(loadingChanged.getCall(2).args[0].skip, 0, 'skip for first level');
        assert.strictEqual(loadingChanged.getCall(2).args[0].take, 1, 'take for first level');

        assert.deepEqual(loadingChanged.getCall(3).args[0].group, null, 'group is empty for second level loading');
        assert.deepEqual(loadingChanged.getCall(3).args[0].filter, ['field1', '=', 1], 'filter on second loading');
        assert.strictEqual(loadingChanged.getCall(3).args[0].requireTotalCount, false, 'require total count should not be passed on second loading');
        assert.strictEqual(loadingChanged.getCall(3).args[0].requireGroupCount, false, 'require group count should not be passed on second loading');
        assert.strictEqual(loadingChanged.getCall(3).args[0].skip, undefined, 'skip for second level');
        assert.strictEqual(loadingChanged.getCall(3).args[0].take, 2, 'take for second level');
    });

    // T454240
    QUnit.test('Error when store not returned groupCount', function(assert) {
        // arrange
        assert.expect(1);

        const dataSource = this.createDataSource({
            group: 'field2'
        }, { skipGroupCount: true });

        // act
        dataSource.load()
            .done(() => {
                // assert
                assert.ok(false, 'exception should be rised');
            })
            .fail((e) => {
                // assert
                assert.ok(e.message.indexOf('E4022') >= 0, 'name of error');
            });
    });

    // T477410
    QUnit.test('Error when store not returned groupCount during expand not last level group', function(assert) {
        // arrange
        assert.expect(1);

        const brokeOptions = {};
        const dataSource = this.createDataSource({
            group: ['field1', 'field2']
        }, brokeOptions);

        dataSource.load();

        // act
        brokeOptions.skipGroupCount = true;

        dataSource.changeRowExpand([1])
            .done(() => {
                // assert
                assert.ok(false, 'exception should be rised');
            })
            .fail((e) => {
                // assert
                assert.ok(e.message.indexOf('E4022') >= 0, 'name of error');
            });
    });

    // T477410
    QUnit.test('Exception when store not returned totalCount after full reload', function(assert) {
        // arrange
        const brokeOptions = {};
        const dataSource = this.createDataSource({
            group: ['field1']
        }, brokeOptions);

        dataSource.load();
        dataSource.changeRowExpand([1]);
        dataSource.load();

        // act
        try {
            brokeOptions.skipTotalCount = true;
            dataSource.reload(true);
            assert.ok(false, 'exception should be rised');
        } catch(e) {
            assert.ok(e.message.indexOf('E4021') >= 0, 'name of error');
        }
    });

    // T754708
    QUnit.test('The collapseAll method should work after expanding group row', function(assert) {
        // arrange
        const dataSource = this.createDataSource({
            group: 'field2',
            pageSize: 2
        });

        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items(), [{
            key: 2, items: null
        }, {
            key: 3, items: null
        }], 'loaded items');

        dataSource.changeRowExpand([2]); // expand group row
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items(), [
            {
                isContinuationOnNextPage: true,
                items: [
                    {
                        field1: 1,
                        field2: 2,
                        field3: 3
                    }
                ],
                key: 2
            }
        ], 'loaded items');

        // act
        dataSource.collapseAll();
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items(), [{
            key: 2, items: null
        }, {
            key: 3, items: null
        }], 'loaded items');
    });

    // T754708
    QUnit.test('The expandAll method  should work after collapsing group row', function(assert) {
        // arrange
        const dataSource = this.createDataSource({
            group: 'field2',
            pageSize: 2
        });

        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items(), [{
            key: 2, items: null
        }, {
            key: 3, items: null
        }], 'loaded items');

        dataSource.expandAll();
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items(), [
            {
                isContinuationOnNextPage: true,
                items: [
                    {
                        field1: 1,
                        field2: 2,
                        field3: 3
                    }
                ],
                key: 2
            }
        ], 'loaded items');

        dataSource.changeRowExpand([2]); // collapse group row
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items(), [{
            key: 2, items: null
        },
        {
            isContinuationOnNextPage: true,
            items: [],
            key: 3
        }], 'loaded items');

        // act
        dataSource.expandAll();
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items(), [
            {
                isContinuationOnNextPage: true,
                items: [
                    {
                        field1: 1,
                        field2: 2,
                        field3: 3
                    }
                ],
                key: 2
            }
        ], 'loaded items');
    });

    // T1077558
    QUnit.test('The grouped data should be correct after changing page from 1 to 0', function(assert) {
        // arrange
        const array = [
            { field1: 1, field2: 2, id: 1 },
            { field1: 1, field2: 2, id: 2 },
            { field1: 1, field2: 2, id: 3 },
            { field1: 1, field2: 2, id: 4 },
            { field1: 1, field2: 2, id: 5 },
            { field1: 1, field2: 3, id: 6 },
            { field1: 1, field2: 3, id: 7 },
            { field1: 1, field2: 3, id: 8 },
            { field1: 1, field2: 3, id: 9 },
            { field1: 1, field2: 3, id: 10 }
        ];

        const dataSource = this.createDataSource({
            store: array,
            group: ['field1', 'field2'],
            pageSize: 10
        });

        dataSource.load();

        // act
        dataSource.changeRowExpand([1]);
        dataSource.load();

        dataSource.changeRowExpand([1, 2]);
        dataSource.load();

        dataSource.changeRowExpand([1, 3]);
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items()[0].items, [{
            key: 2,
            items: [array[0], array[1], array[2], array[3], array[4]]
        }, {
            key: 3,
            isContinuationOnNextPage: true,
            items: [array[5], array[6]]
        }], 'items');

        // act
        dataSource.pageIndex(1);
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items()[0].items, [{
            key: 3,
            isContinuation: true,
            items: [array[7], array[8], array[9]]
        }], 'items');

        // act
        dataSource.pageIndex(0);
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items()[0].items, [{
            key: 2,
            items: [array[0], array[1], array[2], array[3], array[4]]
        }, {
            key: 3,
            isContinuationOnNextPage: true,
            items: [array[5], array[6]]
        }], 'items');
    });

    // T1077558
    QUnit.test('The grouped data should be correct after changing page from 0 to 1', function(assert) {
        // arrange
        const array = [
            { field1: 1, field2: 2, id: 1 },
            { field1: 1, field2: 3, id: 2 },
            { field1: 1, field2: 4, id: 3 },
            { field1: 1, field2: 4, id: 4 },
            { field1: 1, field2: 4, id: 5 },
            { field1: 1, field2: 5, id: 6 },
            { field1: 1, field2: 5, id: 7 },
            { field1: 1, field2: 5, id: 8 },
            { field1: 1, field2: 5, id: 9 }
        ];

        const dataSource = this.createDataSource({
            store: array,
            group: ['field1', 'field2'],
            pageSize: 6
        });

        dataSource.load();

        // act
        dataSource.changeRowExpand([1]);
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items()[0].items, [{
            key: 2,
            items: null
        }, {
            key: 3,
            items: null
        }, {
            key: 4,
            items: null
        }, {
            key: 5,
            items: null
        }], 'first page - items after expand first group');

        // act
        dataSource.changeRowExpand([1, 4]);
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items()[0].items, [{
            key: 2,
            items: null
        }, {
            key: 3,
            items: null
        }, {
            key: 4,
            isContinuationOnNextPage: true,
            items: [array[2], array[3]]
        }], 'first page - items after expand fourth group');

        // act
        dataSource.pageIndex(1);
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items()[0].items, [{
            key: 4,
            isContinuation: true,
            items: [array[4]]
        }, {
            key: 5,
            items: null
        }], 'second page - items');

        // act
        dataSource.changeRowExpand([1, 5]);
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items()[0].items, [{
            key: 4,
            isContinuation: true,
            items: [array[4]]
        }, {
            key: 5,
            isContinuationOnNextPage: true,
            items: [array[5], array[6]]
        }], 'second page - items after expand fifth group');

        // act
        dataSource.pageIndex(2);
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items()[0].items, [{
            key: 5,
            isContinuation: true,
            items: [array[7], array[8]]
        }], 'third page - items');

        // act
        dataSource.pageIndex(1);
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items()[0].items, [{
            key: 4,
            isContinuation: true,
            items: [array[4]]
        }, {
            key: 5,
            isContinuationOnNextPage: true,
            items: [array[5], array[6]]
        }], 'second page - items');
    });

    $.each(['Grouping without remoteOperations', 'Grouping with remoteOperations', 'Grouping with remoteOperations and with remote groupPaging'], function(moduleIndex, moduleName) {

        QUnit.module(moduleName, {
            beforeEach: function() {
                this.array = [
                    { field1: 1, field2: 2, field3: 3 },
                    { field1: 1, field2: 2, field3: 4 },
                    { field1: 1, field2: 3, field3: 5 },
                    { field1: 2, field2: 4, field3: 6 }
                ];
                const remoteGroupPaging = moduleIndex === 2;

                this.createDataSource = function(options) {
                    return (moduleIndex === 0 ? createDataSource : createDataSourceWithRemoteGrouping)($.extend({
                        store: this.array,
                        paginate: true,
                        group: 'field2',
                        remoteOperations: false,
                        requireTotalCount: true
                    }, options || {}), remoteGroupPaging);
                };
                this.processItems = function(items) {
                    for(let i = 0; i < items.length; i++) {
                        if('key' in items[i]) {
                            delete items[i].count;
                            if(items[i].items) {
                                this.processItems(items[i].items);
                            }
                        }
                    }
                    return items;
                };
            }
        }, () => {

            if(moduleIndex === 1) {
                QUnit.test('grouping with paginate. Group is collapsed. Async loading', function(assert) {
                    let changedCount = 0;
                    const source = this.createDataSource({
                        group: [{ selector: 'field2', isExpanded: false }],
                        pageSize: 2,
                        executeAsync: function(func) {
                            setTimeout(function() {
                                func();
                            }, 10);
                        },
                        onChanged: function() {
                            changedCount++;
                        }
                    });

                    source.load();
                    this.clock.tick(10);

                    assert.equal(changedCount, 1);
                    assert.equal(source.totalItemsCount(), 3);
                    assert.deepEqual(this.processItems(source.items()), [{
                        key: 2, items: null
                    }, {
                        key: 3, items: null
                    }]);
                });

                QUnit.test('grouping with paginate. Group is expanded. Async loading', function(assert) {
                    const loadArgs = [];
                    let changedCount = 0;
                    const source = this.createDataSource({
                        group: [{ selector: 'field2', isExpanded: true }],
                        select: ['field2', 'field3'],
                        pageSize: 3,
                        executeAsync: function(func, loadOptions) {
                            loadArgs.push(loadOptions);
                            setTimeout(function() {
                                func();
                            }, 10);
                        },
                        onChanged: function() {
                            changedCount++;
                        }
                    });

                    source.load();

                    assert.equal(loadArgs.length, 1);

                    // act
                    this.clock.tick(10);

                    // assert
                    assert.equal(loadArgs.length, 2);

                    assert.deepEqual(loadArgs[0].group, [{ selector: 'field2', isExpanded: false, desc: false }]);
                    assert.deepEqual(loadArgs[0].select, ['field2', 'field3']);
                    assert.deepEqual(loadArgs[0].filter, undefined);
                    assert.strictEqual(loadArgs[0].skip, undefined);
                    assert.strictEqual(loadArgs[0].take, undefined);

                    assert.deepEqual(loadArgs[1].group, null);
                    assert.deepEqual(loadArgs[1].select, ['field2', 'field3']); // T328457
                    assert.deepEqual(loadArgs[1].filter, ['field2', '=', 2]);
                    assert.strictEqual(loadArgs[1].skip, undefined);
                    assert.strictEqual(loadArgs[1].take, 2);

                    assert.equal(changedCount, 0);
                    assert.equal(source.totalItemsCount(), -1);
                    assert.deepEqual(this.processItems(source.items()), []);

                    // act
                    this.clock.tick(10);

                    // assert
                    assert.equal(changedCount, 1);
                    assert.equal(source.totalItemsCount(), 8);
                    assert.deepEqual(this.processItems(source.items()), [{
                        key: 2, items: [
                            { field2: 2, field3: 3 },
                            { field2: 2, field3: 4 }
                        ]
                    }]);
                });

                QUnit.test('grouping with paginate. Several groups are expanded. Async loading', function(assert) {
                    const loadArgs = [];
                    const source = this.createDataSource({
                        group: [{ selector: 'field1', isExpanded: true }, { selector: 'field2', isExpanded: true }],
                        pageSize: 3,
                        executeAsync: function(func, loadOptions) {
                            loadArgs.push(loadOptions);
                            setTimeout(function() {
                                func();
                            }, 10);
                        }
                    });

                    source.load();

                    assert.equal(loadArgs.length, 1);

                    // act
                    this.clock.tick(10);

                    // assert
                    assert.equal(loadArgs.length, 2);

                    assert.deepEqual(loadArgs[0].group, [{ selector: 'field1', isExpanded: true, desc: false }, { selector: 'field2', isExpanded: false, desc: false }], 'isExpanded is false for last group');
                    assert.deepEqual(loadArgs[0].filter, undefined);
                    assert.strictEqual(loadArgs[0].skip, undefined);
                    assert.strictEqual(loadArgs[0].take, undefined);

                    assert.deepEqual(loadArgs[1].group, null);
                    assert.deepEqual(loadArgs[1].filter, [['field1', '=', 1], 'and', ['field2', '=', 2]]);
                    assert.strictEqual(loadArgs[1].skip, undefined);
                    assert.strictEqual(loadArgs[1].take, 1);
                });
            }
            QUnit.test('grouping without paginate', function(assert) {
                const source = this.createDataSource({
                    paginate: false
                });

                // act
                source.load();
                assert.equal(source.totalItemsCount(), 3);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 2, items: null
                }, {
                    key: 3, items: null
                }, {
                    key: 4, items: null
                }]);
                assert.equal(source.itemsCount(), 3);
            });

            QUnit.test('grouping with map function', function(assert) {
                const source = this.createDataSource({
                    map: function(data) {
                        return data;
                    }
                });

                // act
                source.load();
                assert.equal(source.totalItemsCount(), 3);
                assert.deepEqual(source.items(), [{
                    key: 2, items: null
                }, {
                    key: 3, items: null
                }, {
                    key: 4, items: null
                }]);
                assert.equal(source.itemsCount(), 3);
            });

            QUnit.test('grouping with pageSize more items count', function(assert) {
                const source = this.createDataSource();

                // act
                source.load();

                assert.equal(source.totalItemsCount(), 3);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 2, items: null
                }, {
                    key: 3, items: null
                }, {
                    key: 4, items: null
                }]);
                assert.equal(source.itemsCount(), 3);
            });

            QUnit.test('grouping with pageSize less items count', function(assert) {
                const source = this.createDataSource({
                    pageSize: 2
                });

                // act
                source.load();

                assert.equal(source.totalItemsCount(), 3);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 2, items: null
                }, {
                    key: 3, items: null
                }]);
                assert.equal(source.itemsCount(), 2);
            });

            // T356413
            QUnit.test('grouping with pageSize less items count. Change pageSize at runtime', function(assert) {
                const source = this.createDataSource({
                    group: 'group',
                    store: [
                        { group: 1, id: 1 },
                        { group: 1, id: 2 },
                        { group: 1, id: 3 },
                        { group: 1, id: 4 },
                        { group: 1, id: 5 },
                        { group: 1, id: 6 },
                        { group: 2, id: 7 },
                    ],
                    pageSize: 3
                });

                // act
                source.load();

                source.changeRowExpand([1]);
                source.pageSize(5);
                source.load();

                source.pageSize(3);
                source.pageIndex(2);
                source.load();

                // assert
                assert.equal(source.totalItemsCount(), 10);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1, isContinuation: true, items: [
                        { group: 1, id: 5 },
                        { group: 1, id: 6 },
                    ]
                }]);
                assert.equal(source.itemsCount(), 3);
            });

            // B254928
            QUnit.test('grouping with pageSize less items count when no requireTotalCount', function(assert) {
                const source = this.createDataSource({
                    pageSize: 5,
                    group: [{ selector: 'field2', isExpanded: true }],
                    requireTotalCount: false
                });

                // act
                source.load();

                // assert
                assert.equal(source.totalItemsCount(), 5);
                assert.equal(source.itemsCount(), 5);
                assert.ok(!source.isLastPage());
                assert.ok(!source.hasKnownLastPage());

                // act
                source.pageIndex(1);
                source.load();
                assert.equal(source.totalItemsCount(), 7);
                assert.equal(source.itemsCount(), 2);
                assert.ok(source.isLastPage());
                assert.ok(source.hasKnownLastPage());
            });

            // B239382
            QUnit.test('grouping with isExpanded group on previous page and isExpanded current group that continues on the next page', function(assert) {
                const source = this.createDataSource({
                    pageSize: 4,
                    store: [
                        { field1: 1, field2: 2, field3: 3 },
                        { field1: 1, field2: 2, field3: 4 },
                        { field1: 1, field2: 3, field3: 5 },
                        { field1: 2, field2: 4, field3: 6 },
                        { field1: 2, field2: 5, field3: 7 },
                        { field1: 2, field2: 5, field3: 8 },
                        { field1: 2, field2: 5, field3: 9 },
                        { field1: 2, field2: 6, field3: 10 },
                        { field1: 2, field2: 6, field3: 11 }
                    ],
                    paginate: true,
                    group: 'field2',
                    remoteOperations: false,
                    requireTotalCount: true
                });

                // act
                source.load();
                source.changeRowExpand([2]);
                source.load();
                source.pageIndex(1);
                source.load();
                source.changeRowExpand([5]);
                source.load();

                assert.equal(source.totalItemsCount(), 11);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 4,
                    items: null
                }, {
                    key: 5,
                    isContinuationOnNextPage: true,
                    items: [{ field1: 2, field2: 5, field3: 7 }, { field1: 2, field2: 5, field3: 8 }]
                }]);
                assert.equal(source.itemsCount(), 4);
            });

            // B239382
            QUnit.test('grouping on last page when group continued from several pages', function(assert) {
                const source = this.createDataSource({
                    pageSize: 3,
                    store: [
                        { field1: 1, field2: 2, field3: 3 },
                        { field1: 1, field2: 2, field3: 4 },
                        { field1: 1, field2: 3, field3: 5 },
                        { field1: 1, field2: 4, field3: 6 },
                        { field1: 1, field2: 5, field3: 7 }
                    ],
                    paginate: true,
                    group: 'field1',
                    remoteOperations: false,
                    requireTotalCount: true
                });

                // act
                source.load();
                const changeRowExpandResult = source.changeRowExpand([1]);
                source.load();
                source.pageIndex(2);
                source.load();

                assert.equal(source.totalItemsCount(), 8);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1,
                    isContinuation: true,
                    items: [{ field1: 1, field2: 5, field3: 7 }]
                }]);
                assert.equal(source.itemsCount(), 2);
                assert.ok(changeRowExpandResult && changeRowExpandResult.done);
            });

            QUnit.test('grouping with pageSize less items count. Continue group parameter', function(assert) {
                const source = this.createDataSource({
                    pageSize: 2
                });

                source.load();

                // act
                source.changeRowExpand([2]);
                source.pageIndex(1);
                source.load();

                assert.equal(source.totalItemsCount(), 6);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 2, isContinuation: true, items: [
                        { field1: 1, field2: 2, field3: 4 }
                    ]
                }]);
                assert.equal(source.itemsCount(), 2);
            });

            QUnit.test('grouping with pageSize less items count. Continue group parameter when sort exists and several groups expanded', function(assert) {
                const source = this.createDataSource({
                    store: [
                        { field1: 1, field2: 2, field3: 3 },
                        { field1: 1, field2: 2, field3: 4 },
                        { field1: 1, field2: 2, field3: 5 },
                        { field1: 1, field2: 2, field3: 6 },
                        { field1: 1, field2: 3, field3: 7 },
                        { field1: 2, field2: 4, field3: 8 }
                    ],
                    group: 'field2',
                    sort: [{ selector: 'field3', desc: true }],
                    pageSize: 4
                });

                source.load();

                // act
                source.changeRowExpand([2]);
                source.load();
                source.pageIndex(1);
                source.load();
                source.changeRowExpand([3]);
                source.load();

                assert.equal(source.totalItemsCount(), 9);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 2, isContinuation: true, items: [
                        { field1: 1, field2: 2, field3: 3 }
                    ]
                }, {
                    key: 3, items: [
                        { field1: 1, field2: 3, field3: 7 }
                    ]
                }]);
                assert.equal(source.itemsCount(), 4);
            });

            QUnit.test('grouping with pageSize less items count. Continue group parameter when virtual scrolling', function(assert) {
                const source = this.createDataSource({
                    pageSize: 2,
                    scrolling: { mode: 'virtual', preventPreload: true }
                });

                source.load();

                // act
                source.changeRowExpand([2]);
                source.pageIndex(1);
                source.load();

                assert.equal(source.totalItemsCount(), 5);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 2, isContinuation: true, items: [
                        { field1: 1, field2: 2, field3: 4 }
                    ]
                }, {
                    key: 3, items: null
                }]);
                assert.equal(source.itemsCount(), 2);
            });

            QUnit.test('grouping with pageSize less items count. Continue on next page group parameter', function(assert) {
                const source = this.createDataSource({
                    pageSize: 2
                });

                source.load();

                // act
                source.changeRowExpand([2]);
                source.load();

                assert.equal(source.totalItemsCount(), 6);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 2, isContinuationOnNextPage: true, items: [
                        { field1: 1, field2: 2, field3: 3 }
                    ]
                }]);
                assert.equal(source.itemsCount(), 2);
            });

            QUnit.test('grouping with pageSize less items count. Continue group parameter not set', function(assert) {
                const source = this.createDataSource({
                    pageSize: 2,
                    pageIndex: 1
                });
                source.load();

                // act
                assert.equal(source.totalItemsCount(), 3);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 4, items: null
                }]);
            });

            QUnit.test('grouping without paginate. Expand group', function(assert) {
                const source = this.createDataSource({
                    paginate: false
                });

                source.load();
                source.changeRowExpand([2]);
                source.load();

                assert.equal(source.totalItemsCount(), 5);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 2, items: [
                        { field1: 1, field2: 2, field3: 3 },
                        { field1: 1, field2: 2, field3: 4 }
                    ]
                }, {
                    key: 3, items: null
                }, {
                    key: 4, items: null
                }]);
            });

            QUnit.test('grouping without paginate. Collapse group after expand', function(assert) {
                const source = this.createDataSource({
                    paginate: false
                });

                source.load();

                source.changeRowExpand([2]);
                source.changeRowExpand([2]);

                assert.equal(source.totalItemsCount(), 3);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 2, items: null
                }, {
                    key: 3, items: null
                }, {
                    key: 4, items: null
                }]);
            });


            QUnit.test('grouping with paginate. Expand group', function(assert) {
                const source = this.createDataSource({
                    pageSize: 3
                });

                source.load();
                source.changeRowExpand([2]);
                source.load();

                assert.equal(source.totalItemsCount(), 5);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 2, items: [
                        { field1: 1, field2: 2, field3: 3 },
                        { field1: 1, field2: 2, field3: 4 }
                    ]
                }]);
            });

            // T837927
            QUnit.test('grouping with paginate. Expand group if filterValue is defined', function(assert) {
                const source = this.createDataSource({
                    group: ['field1', 'field2'],
                    pageSize: 5
                });

                const filter = ['field3', '=', 3];

                source.customizeStoreLoadOptions.add(options => {
                    if(options.isCustomLoading) return;

                    const storeLoadOptions = options.storeLoadOptions;
                    storeLoadOptions.filter = storeLoadOptions.filter ? [storeLoadOptions.filter, 'and', filter] : filter;
                });

                source.load();
                source.changeRowExpand([1]);
                source.load();

                assert.equal(source.totalItemsCount(), 2);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1, items: [
                        { key: 2, items: null }
                    ]
                }]);
            });

            QUnit.test('grouping with pageSize less items count. Collapse group with undefined key', function(assert) {
                const source = this.createDataSource({
                    group: [{ selector: 'field1', isExpanded: true, desc: true }],
                    store: [
                        { field1: false, field2: 1 },
                        { field1: undefined, field2: 2 },
                        { field1: true, field2: 3 }
                    ],
                    pageSize: 3
                });

                source.load();

                // act
                source.changeRowExpand([true]);
                source.load();
                source.changeRowExpand([undefined]);
                source.load();

                assert.deepEqual(this.processItems(source.items()), [
                    { key: undefined, items: null },
                    { key: true, items: null },
                    { key: false, isContinuationOnNextPage: true, items: [] }
                ]);

                assert.equal(source.itemsCount(), 3);
            });

            QUnit.test('grouping with paginate. Collapse group after expand', function(assert) {
                const source = this.createDataSource({});

                source.load();

                source.changeRowExpand([2]);
                source.changeRowExpand([2]);

                assert.equal(source.totalItemsCount(), 3);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 2, items: null
                }, {
                    key: 3, items: null
                }, {
                    key: 4, items: null
                }]);
            });

            if(moduleIndex === 0) {

                QUnit.test('getContinuationGroupCount', function(assert) {
                    assert.equal(getContinuationGroupCount(0, 3, 2), 1, '1 continuation groups');
                    assert.equal(getContinuationGroupCount(0, 3, 3), 2, '2 continuation groups');
                    assert.equal(getContinuationGroupCount(0, 3, 5), 3, '3 continuation groups');
                    assert.equal(getContinuationGroupCount(0, 3, 6), 3, '3 continuation groups');
                    assert.equal(getContinuationGroupCount(0, 3, 10), 5, '5 continuation groups');
                    assert.equal(getContinuationGroupCount(0, 4, 10), 4, '4 continuation groups');

                    assert.equal(getContinuationGroupCount(2, 3, 2), 1, '1 continuation groups');
                    assert.equal(getContinuationGroupCount(2, 3, 3), 1, '1 continuation groups');
                    assert.equal(getContinuationGroupCount(2, 3, 5), 2, '2 continuation groups');
                    assert.equal(getContinuationGroupCount(2, 3, 10), 5, '5 continuation groups');

                    assert.equal(getContinuationGroupCount(2, 3, 5), 2, '2 continuation groups');
                    assert.equal(getContinuationGroupCount(2, 4, 5), 1, '1 continuation groups');
                    assert.equal(getContinuationGroupCount(2, 6, 5), 1, '1 continuation groups');
                    assert.equal(getContinuationGroupCount(2, 7, 5), 0, '0 continuation groups');


                    assert.equal(getContinuationGroupCount(4, 3, 2), 0, '0 continuation groups');
                    assert.equal(getContinuationGroupCount(4, 3, 3), 1, '1 continuation groups');
                    assert.equal(getContinuationGroupCount(4, 3, 5), 2, '2 continuation groups');
                    assert.equal(getContinuationGroupCount(4, 3, 10), 4, '4 continuation groups');

                    assert.equal(getContinuationGroupCount(-2, 3, 2), 0, '0 continuation groups');
                    assert.equal(getContinuationGroupCount(-2, 3, 3), 1, '1 continuation groups');
                    assert.equal(getContinuationGroupCount(-2, 3, 5), 2, '2 continuation groups');
                    assert.equal(getContinuationGroupCount(-2, 3, 10), 4, '4 continuation groups');
                });

                QUnit.test('collapseAll when no grouped columns', function(assert) {
                    const source = this.createDataSource({
                        pageSize: 2,
                        group: null
                    });
                    source.load();

                    // act
                    source.collapseAll();
                    source.load();

                    // assert
                    assert.equal(source.pageCount(), 2, 'pageCount');
                    assert.deepEqual(source.items(), [
                        { field1: 1, field2: 2, field3: 3 },
                        { field1: 1, field2: 2, field3: 4 }
                    ], 'items');
                });

                // T112478
                QUnit.test('collapseAll for remote data', function(assert) {
                    // arrange
                    const source = this.createDataSource({
                        load: function() { return [{ group: 'group 1', text: 'text 1' }, { group: 'group 1', text: 'text 2' }, { group: 'group 2', text: 'text 3' }]; },
                        totalCount: function() { return -1; },
                        pageSize: 2,
                        group: [{ selector: 'group', isExpanded: true }],
                        remoteOperations: { filtering: true, sorting: true, paging: true }
                    });
                    let messageError;

                    source.load();

                    logger.error = function(message) {
                        messageError = message;
                    };

                    assert.ok(source._grouping instanceof ExpandedGroupingHelper, 'expanded grouping helper');


                    // act
                    source.collapseAll();
                    source.load();

                    // assert
                    assert.ok(source._grouping instanceof CollapsedGroupingHelper, 'collapsed grouping helper');
                    assert.ok(!messageError, 'no error');
                    assert.deepEqual(this.processItems(source.items()), [{ key: 'group 1', items: null }, { key: 'group 2', items: null }]);
                });

                QUnit.test('expandAll when no grouped columns', function(assert) {
                    const source = this.createDataSource({
                        pageSize: 2,
                        group: null
                    });
                    source.load();

                    // act
                    source.expandAll();
                    source.load();

                    // assert
                    assert.equal(source.pageCount(), 2, 'pageCount');
                    assert.deepEqual(source.items(), [
                        { field1: 1, field2: 2, field3: 3 },
                        { field1: 1, field2: 2, field3: 4 }
                    ], 'items');
                });

                // T183365
                QUnit.test('change grouping and reload with custom store', function(assert) {
                    const source = this.createDataSource({
                        load: function() {
                            return [
                                { name: 'Chai', customer: 'John' },
                                { name: 'Chang', customer: 'John' },
                                { name: 'Queso Caprale', customer: 'Bob' }
                            ];
                        },
                        totalCount: function() { return 3; },
                        group: null
                    });
                    source.load();

                    // act
                    source.group('name');
                    source.reload();

                    // assert
                    assert.equal(source.totalItemsCount(), 3);
                    assert.deepEqual(source.items(), [{
                        key: 'Chai', items: null
                    }, {
                        key: 'Chang', items: null
                    }, {
                        key: 'Queso Caprale', items: null
                    }]);
                    assert.equal(source.itemsCount(), 3);
                });

                // T266248
                QUnit.test('change sortOrder of group', function(assert) {
                    const source = this.createDataSource({
                        pageSize: 5,
                        group: [{ selector: 'field1', isExpanded: true }]
                    });
                    source.load();

                    // act
                    source.group([{ selector: 'field1', isExpanded: true, desc: true }]);
                    source.reload();

                    // assert
                    assert.equal(source.pageCount(), 2, 'pageCount');
                    assert.deepEqual(source.items(), [
                        {
                            items: [{ field1: 2, field2: 4, field3: 6 }],
                            key: 2
                        },
                        {
                            isContinuationOnNextPage: true,
                            items: [
                                { field1: 1, field2: 2, field3: 3 },
                                { field1: 1, field2: 2, field3: 4 }
                            ],
                            key: 1
                        }
                    ], 'items');
                });

                // T851306
                QUnit.test('change sortOrder of group with many unique values', function(assert) {
                    const source = this.createDataSource({
                        store: [{
                            field1: 1
                        }, {
                            field1: 2
                        }, {
                            field1: 3
                        }, {
                            field1: 4
                        }, {
                            field1: 5
                        }],
                        pageSize: 2,
                        group: [{ selector: 'field1', isExpanded: true }]
                    });
                    source.load();

                    sinon.spy(source._grouping, '_updateGroupInfoOffsets');

                    // act
                    source.group([{ selector: 'field1', isExpanded: true, desc: true }]);
                    source.reload();

                    // assert
                    assert.equal(source.pageCount(), 5, 'pageCount');
                    assert.deepEqual(source.items(), [{
                        key: 5,
                        items: [{ field1: 5 }]
                    }], 'items');
                    assert.equal(source._grouping._updateGroupInfoOffsets.callCount, 1, '_updateGroupInfoOffsets is called once');
                });
            }
        });
    });

    $.each(['Grouping without remoteOperations. Second level', 'Grouping with remote grouping. Second level', 'Grouping with remote grouping and remote group paging. Second level'], function(moduleIndex, moduleName) {

        QUnit.module(moduleName, {
            beforeEach: function() {
                this.array = [
                    { field1: 1, field2: 2, field3: 3 },
                    { field1: 1, field2: 2, field3: 4 },
                    { field1: 1, field2: 3, field3: 5 },
                    { field1: 1, field2: 3, field3: 6 },
                    { field1: 2, field2: 4, field3: 7 }
                ];
                this.createDataSource = function(options) {
                    const remoteGroupPaging = moduleIndex === 2;

                    return (moduleIndex === 0 ? createDataSource : createDataSourceWithRemoteGrouping)($.extend({
                        store: this.array,
                        paginate: true,
                        remoteOperations: false,
                        group: ['field1', 'field2'],
                        requireTotalCount: true
                    }, options || {}), remoteGroupPaging);
                };
                this.processItems = function(items) {
                    for(let i = 0; i < items.length; i++) {
                        if('key' in items[i]) {
                            delete items[i].count;
                            if(items[i].items) {
                                this.processItems(items[i].items);
                            }
                        }
                    }
                    return items;
                };
            }
        }, () => {

            QUnit.test('grouping with paginate', function(assert) {
                const source = this.createDataSource({
                    pageSize: 2
                });

                // act
                source.load();

                assert.equal(source.totalItemsCount(), 2);
                assert.deepEqual(source.items(), [{
                    key: 1, items: null
                }, {
                    key: 2, items: null
                }]);
            });

            QUnit.test('grouping with paginate. Expand first level group', function(assert) {
                let loadCount = 0;
                const source = this.createDataSource({
                    pageSize: 3,
                    executeAsync: function(func) {
                        loadCount++;
                        func();
                    }
                });

                source.load();
                loadCount = 0;

                // act
                source.changeRowExpand([1]);
                source.load();

                assert.equal(source.totalItemsCount(), 4);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1, items: [
                        { key: 2, items: null },
                        { key: 3, items: null }
                    ]
                }]);

                if(moduleIndex === 2) {
                    assert.equal(loadCount, 3, 'loading three times when remoteOperations with groupPaging is true');
                } else {
                    assert.equal(loadCount, 0, 'loading from cache when remoteOperations.groupPaging is false');
                }
            });

            QUnit.test('grouping with paginate. Expand first level group and second level group', function(assert) {
                const source = this.createDataSource({
                    group: [{ selector: 'field1', desc: true, isExpanded: true }, { selector: 'field2', isExpanded: true }],
                    pageSize: 5
                });

                // act
                source.load();
                source.changeRowExpand([2]);
                source.load();
                source.changeRowExpand([1, 2]);
                source.load();

                assert.equal(source.totalItemsCount(), 8);
                assert.deepEqual(this.processItems(source.items()),
                    [{ key: 2, items: null }, {
                        key: 1, items: [
                            { key: 2, items: null },
                            { key: 3, items: [{ field1: 1, field2: 3, field3: 5 }], isContinuationOnNextPage: true }
                        ],
                        isContinuationOnNextPage: true
                    }]);
            });

            QUnit.test('grouping without paginate', function(assert) {
                const source = this.createDataSource({
                    paginate: false
                });

                // act
                source.load();

                assert.equal(source.totalItemsCount(), 2);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1, items: null
                }, {
                    key: 2, items: null
                }]);
            });

            QUnit.test('grouping without paginate. Expand first level group', function(assert) {
                const source = this.createDataSource({
                    paginate: false
                });

                // act
                source.load();
                source.changeRowExpand([1]);
                source.load();

                assert.equal(source.totalItemsCount(), 4);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1, items: [
                        { key: 2, items: null },
                        { key: 3, items: null }
                    ]
                }, {
                    key: 2, items: null
                }]);
            });


            QUnit.test('Continue group parameter for first group level only', function(assert) {
                const source = this.createDataSource({
                    pageSize: 2
                });

                // act
                source.load();
                source.changeRowExpand([1]);
                source.pageIndex(1);
                source.load();

                assert.equal(source.totalItemsCount(), 5);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1, isContinuation: true, items: [{
                        key: 3, items: null
                    }]
                }]);
            });

            QUnit.test('Continue group parameter for first group level only when virtual scrolling', function(assert) {
                const source = this.createDataSource({
                    pageSize: 2,
                    scrolling: { mode: 'virtual', preventPreload: true }
                });

                // act
                source.load();
                source.changeRowExpand([1]);
                source.pageIndex(1);
                source.load();

                assert.equal(source.totalItemsCount(), 4);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1, isContinuation: true, items: [{
                        key: 3, items: null
                    }]
                }, {
                    key: 2, items: null
                }]);
            });

            QUnit.test('Continue group parameter for first group level only when page ends with group header', function(assert) {
                const source = this.createDataSource({
                    pageSize: 2
                });

                // act
                source.load();
                source.changeRowExpand([2]);
                source.load();
                source.pageIndex(1);
                source.load();

                assert.equal(source.totalItemsCount(), 4);
                assert.equal(source.itemsCount(), 2);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 2, isContinuation: true, items: [{
                        key: 4, items: null
                    }]
                }]);
            });

            QUnit.test('Continue group parameter for both group levels', function(assert) {
                const source = this.createDataSource({
                    pageSize: 3
                });

                // act
                source.load();
                source.changeRowExpand([1]);
                source.load();
                source.changeRowExpand([1, 2]);
                source.load();
                source.pageIndex(1);
                source.load();

                assert.equal(source.totalItemsCount(), 9);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1, isContinuation: true, isContinuationOnNextPage: true, items: [
                        { key: 2, isContinuation: true, items: [{ field1: 1, field2: 2, field3: 4 }] }
                    ]
                }]);

                assert.equal(source.itemsCount(), 3);
            });

            QUnit.test('Continue group parameter for both group levels when virtual scrolling', function(assert) {
                const source = this.createDataSource({
                    pageSize: 3,
                    scrolling: { mode: 'virtual', preventPreload: true }
                });

                // act
                source.load();
                source.changeRowExpand([1]);
                source.load();
                source.changeRowExpand([1, 2]);
                source.load();
                source.pageIndex(1);
                source.load();

                assert.equal(source.totalItemsCount(), 6);
                assert.deepEqual(this.processItems(source.items()), [{
                    isContinuationOnNextPage: true,
                    items: [{
                        isContinuationOnNextPage: true,
                        items: [{ field1: 1, field2: 2, field3: 3 }],
                        key: 2
                    }
                    ],
                    key: 1
                },
                {
                    key: 1, isContinuation: true, items: [
                        { key: 2, isContinuation: true, items: [{ field1: 1, field2: 2, field3: 4 }] },
                        { key: 3, items: null }
                    ]
                }, {
                    key: 2, items: null
                }]);
                assert.equal(source.itemsCount(), 3);
            });

            QUnit.test('Expand second level group', function(assert) {
                const source = this.createDataSource({
                    pageSize: 5
                });

                // act
                source.load();

                source.changeRowExpand([1]);
                source.load();

                source.changeRowExpand([1, 3]);
                source.load();

                assert.equal(source.totalItemsCount(), 6);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1,
                    items: [{
                        key: 2, items: null
                    }, {
                        key: 3, items: [
                            { field1: 1, field2: 3, field3: 5 },
                            { field1: 1, field2: 3, field3: 6 }
                        ]
                    }
                    ]
                }]);
                assert.equal(source.itemsCount(), 5);
            });

            if(moduleIndex !== 2) {
                QUnit.test('Expand second level group ends on previous page', function(assert) {
                    const source = this.createDataSource({
                        pageSize: 5
                    });

                    source.load();

                    // act
                    source.changeRowExpand([1]);
                    source.load();
                    source.changeRowExpand([1, 3]);
                    source.load();
                    source.pageIndex(1);
                    source.load();

                    assert.equal(source.totalItemsCount(), 6);
                    assert.deepEqual(this.processItems(source.items()), [{
                        key: 2, items: null
                    }]);
                });

                QUnit.test('Expand second level group ends on previous page when virtual scrolling', function(assert) {
                    const source = this.createDataSource({
                        pageSize: 5,
                        scrolling: { mode: 'virtual', preventPreload: true }
                    });

                    source.load();

                    // act
                    source.changeRowExpand([1]);
                    source.load();
                    source.changeRowExpand([1, 3]);
                    source.load();
                    source.pageIndex(1);
                    source.load();

                    assert.equal(source.totalItemsCount(), 6);
                    assert.deepEqual(this.processItems(source.items()), [{
                        items: [{
                            items: null,
                            key: 2
                        }, {
                            items: [
                                { field1: 1, field2: 3, field3: 5 },
                                { field1: 1, field2: 3, field3: 6 }
                            ],
                            key: 3
                        }],
                        key: 1
                    }, {
                        key: 2, items: null
                    }]);
                });
            }

            QUnit.test('isExpanded state of items restore after collapse/expand', function(assert) {
                const source = this.createDataSource({
                    pageSize: 5
                });

                // act
                source.load();

                source.changeRowExpand([1]);
                source.load();
                source.changeRowExpand([1, 3]);
                source.load();
                source.changeRowExpand([1]);
                source.load();
                source.changeRowExpand([1]);
                source.load();

                assert.equal(source.totalItemsCount(), 6);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1,
                    items: [
                        { key: 2, items: null },
                        {
                            key: 3,
                            items: [
                                { field1: 1, field2: 3, field3: 5 },
                                { field1: 1, field2: 3, field3: 6 }
                            ]
                        }]
                }]);
            });

            QUnit.test('isExpanded all group levels', function(assert) {
                const source = this.createDataSource({
                    pageSize: 3
                });

                source.expandAll();

                // act
                source.load();

                assert.equal(source.totalItemsCount(), 15);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1, isContinuationOnNextPage: true, items:
                        [
                            {
                                key: 2,
                                isContinuationOnNextPage: true,
                                items: [{ field1: 1, field2: 2, field3: 3 }]
                            }
                        ]
                }]);
            });

            QUnit.test('isExpanded all first group level', function(assert) {
                const source = this.createDataSource({
                    pageSize: 3
                });

                source.load();
                source.changeRowExpand([1]);
                source.load();
                source.changeRowExpand([1, 3]);
                source.load();
                source.changeRowExpand([1]);
                source.load();
                // act
                source.expandAll(0);
                source.load();

                assert.equal(source.totalItemsCount(), 11);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1,
                    items: [
                        { key: 2, items: null },
                        {
                            key: 3,
                            isContinuationOnNextPage: true,
                            items: []
                        }
                    ],
                    isContinuationOnNextPage: true
                }]);
            });

            QUnit.test('Collapsed all group levels', function(assert) {
                const source = this.createDataSource({
                    pageSize: 3
                });

                source.load();
                source.changeRowExpand([1]);
                // act
                source.collapseAll();
                source.load();

                assert.equal(source.totalItemsCount(), 2);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1, items: null
                }, {
                    key: 2, items: null
                }]);
            });

            QUnit.test('Collapse all second group level', function(assert) {
                const source = this.createDataSource({
                    pageSize: 3
                });

                source.load();
                source.changeRowExpand([1]);
                source.changeRowExpand([1, 3]);

                // act
                source.collapseAll(1);
                source.reload();

                // assert
                assert.ok(!source.group()[0].isExpanded);
                assert.ok(!source.group()[1].isExpanded);
                assert.equal(source.totalItemsCount(), 4);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1, items:
                        [
                            { key: 2, items: null },
                            { key: 3, items: null }
                        ]
                }]);
            });

            QUnit.test('Collapse all second group level when all groups isExpanded', function(assert) {
                const source = this.createDataSource({
                    pageSize: 3,
                    group: [{ selector: 'field1', isExpanded: true }, { selector: 'field2', isExpanded: true }],
                });

                source.load();

                // act
                source.collapseAll(1);
                source.reload();

                // assert
                assert.ok(source.group()[0].isExpanded);
                assert.ok(!source.group()[1].isExpanded);
                assert.equal(source.totalItemsCount(), 5);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1, items:
                        [
                            { key: 2, items: null },
                            { key: 3, items: null }
                        ]
                }]);
            });

            QUnit.test('isExpanded group parameter', function(assert) {
                const source = this.createDataSource({
                    pageSize: 3,
                    group: [{ selector: 'field1', isExpanded: true }, 'field2']
                });

                // act
                source.load();

                assert.equal(source.totalItemsCount(), 5);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1, items:
                        [
                            { key: 2, items: null },
                            { key: 3, items: null }
                        ]
                }]);
            });

            // B254818
            QUnit.test('isExpanded group parameters. Apply filter', function(assert) {
                const source = this.createDataSource({
                    pageSize: 5,
                    group: [{ selector: 'field1', isExpanded: true }, { selector: 'field2', isExpanded: true }]
                });

                source.load();

                // act
                source.filter(['field2', '=', 2]);
                source.reload();

                assert.equal(source.totalItemsCount(), 4);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1, items: [
                        {
                            key: 2, items: [
                                { field1: 1, field2: 2, field3: 3 },
                                { field1: 1, field2: 2, field3: 4 }
                            ]
                        }
                    ]
                }]);
            });

            QUnit.test('change sortOrder for first group level', function(assert) {
                const source = this.createDataSource({
                    pageSize: 3
                });

                // act
                source.load();
                source.changeRowExpand([1]);
                source.load();
                source.group([{ selector: 'field1', desc: true }, 'field2']);
                source.reload();

                assert.equal(source.totalItemsCount(), 5);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 2, items: null
                }, {
                    key: 1, isContinuationOnNextPage: true, items: [{
                        key: 2, items: null
                    }]
                }]);
            });


            QUnit.test('change sortOrder for second group level', function(assert) {
                const source = this.createDataSource({
                    pageSize: 3
                });

                // act
                source.load();
                source.changeRowExpand([1]);
                source.group([{ selector: 'field1' }, { selector: 'field2', desc: true }]);
                source.reload();

                assert.equal(source.totalItemsCount(), 4);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1, items:
                        [
                            { key: 3, items: null },
                            { key: 2, items: null }
                        ]
                }]);
            });

            // T382926
            QUnit.test('change sortOrder for second group level when all groups expanded', function(assert) {
                const array = [
                    { field1: 1, field2: 2, field3: 1 },
                    { field1: 1, field2: 2, field3: 2 },
                    { field1: 1, field2: 2, field3: 3 },
                    { field1: 1, field2: 2, field3: 4 },
                    { field1: 2, field2: 1, field3: 5 },
                    { field1: 2, field2: 1, field3: 6 },
                    { field1: 2, field2: 2, field3: 7 }
                ];

                const source = this.createDataSource({
                    store: array,
                    pageSize: 5,
                    group: [{ selector: 'field1', desc: false, isExpanded: true }, { selector: 'field2', desc: false, isExpanded: true }]
                });

                // act
                source.load();

                source.group([{ selector: 'field1', desc: false, isExpanded: true }, { selector: 'field2', desc: true, isExpanded: true }]);
                source.reload();

                assert.equal(source.totalItemsCount(), 18);
                assert.equal(source.itemsCount(), 5);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1,
                    items: [
                        {
                            key: 2,
                            isContinuationOnNextPage: true,
                            items: [array[0], array[1], array[2]]
                        }
                    ],
                    isContinuationOnNextPage: true
                }]);
            });

            // B254110
            QUnit.test('change isExpanded for first group level', function(assert) {
                const source = this.createDataSource({
                    pageSize: 3
                });

                // act
                source.load();
                source.group([{ selector: 'field1', isExpanded: true }, 'field2']);
                source.reload();

                assert.equal(source.totalItemsCount(), 5);
                assert.deepEqual(this.processItems(source.items()), [{
                    items: [{
                        items: null,
                        key: 2
                    },
                    {
                        items: null,
                        key: 3
                    }
                    ],
                    key: 1
                }]);
            });

            // B254110
            QUnit.test('change isExpanded for second group level', function(assert) {
                const source = this.createDataSource({
                    pageSize: 3,
                    group: [{ selector: 'field1', isExpanded: true }, { selector: 'field2', isExpanded: true }]
                });

                // act
                source.load();
                source.group([{ selector: 'field1', isExpanded: true }, { selector: 'field2', isExpanded: false }]);
                source.reload();

                assert.equal(source.totalItemsCount(), 5);
                assert.deepEqual(this.processItems(source.items()), [{
                    items: [{
                        items: null,
                        key: 2
                    },
                    {
                        items: null,
                        key: 3
                    }
                    ],
                    key: 1
                }]);
            });

            QUnit.test('Second page for big group', function(assert) {
                const source = this.createDataSource({
                    store: [
                        { field1: 1, field2: 2, field3: 1 },
                        { field1: 1, field2: 2, field3: 2 },
                        { field1: 1, field2: 2, field3: 3 },
                        { field1: 1, field2: 2, field3: 4 },
                        { field1: 1, field2: 2, field3: 5 },
                        { field1: 1, field2: 2, field3: 6 },
                        { field1: 1, field2: 2, field3: 7 },
                        { field1: 1, field2: 2, field3: 8 }
                    ],
                    pageSize: 5
                });

                source.load();

                // act
                source.expandAll();
                source.pageIndex(1);
                source.load();

                assert.equal(source.totalItemsCount(), 14);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1,
                    isContinuation: true,
                    isContinuationOnNextPage: true,
                    items: [{
                        key: 2,
                        isContinuation: true,
                        isContinuationOnNextPage: true,
                        items: [
                            { field1: 1, field2: 2, field3: 4 },
                            { field1: 1, field2: 2, field3: 5 },
                            { field1: 1, field2: 2, field3: 6 }
                        ]
                    }]
                }]);
            });

            QUnit.test('Last pages for very big group', function(assert) {
                const array = [];
                for(let i = 0; i < 29; i++) {
                    array.push({ field1: 1, field2: 2, field3: i + 1 });
                }
                array.push({ field1: 2, field2: 3, field3: 30 });
                const source = this.createDataSource({
                    store: array,
                    pageSize: 5
                });

                source.load();

                // act
                source.expandAll();
                source.pageIndex(8);
                source.load();

                assert.equal(source.totalItemsCount(), 53);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1,
                    isContinuation: true,
                    isContinuationOnNextPage: true,
                    items: [{
                        key: 2,
                        isContinuation: true,
                        isContinuationOnNextPage: true,
                        items: [
                            { field1: 1, field2: 2, field3: 25 },
                            { field1: 1, field2: 2, field3: 26 },
                            { field1: 1, field2: 2, field3: 27 }
                        ]
                    }]
                }]);

                // act
                source.pageIndex(9);
                source.load();

                // assert
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1,
                    isContinuation: true,
                    items: [{
                        key: 2,
                        isContinuation: true,
                        items: [
                            { field1: 1, field2: 2, field3: 28 },
                            { field1: 1, field2: 2, field3: 29 }
                        ]
                    }]
                }, {
                    key: 2,
                    isContinuationOnNextPage: true,
                    items: []
                }]);

                // act
                source.pageIndex(10);
                source.load();

                // assert
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 2,
                    isContinuation: true,
                    items: [{
                        key: 3,
                        items: [
                            { field1: 2, field2: 3, field3: 30 }
                        ]
                    }]
                }]);
            });

            QUnit.test('Third page for big group', function(assert) {
                const source = this.createDataSource({
                    store: [
                        { field1: 1, field2: 2, field3: 1 },
                        { field1: 1, field2: 2, field3: 2 },
                        { field1: 1, field2: 2, field3: 3 },
                        { field1: 1, field2: 2, field3: 4 },
                        { field1: 1, field2: 2, field3: 5 },
                        { field1: 1, field2: 2, field3: 6 },
                        { field1: 1, field2: 2, field3: 7 },
                        { field1: 1, field2: 2, field3: 8 },
                        { field1: 1, field2: 2, field3: 9 },
                        { field1: 1, field2: 2, field3: 10 },
                        { field1: 1, field2: 2, field3: 11 }
                    ],
                    pageSize: 5
                });

                source.load();

                // act
                source.expandAll();
                source.pageIndex(2);
                source.load();

                assert.equal(source.totalItemsCount(), 19);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1,
                    isContinuation: true,
                    isContinuationOnNextPage: true,
                    items: [{
                        key: 2,
                        isContinuation: true,
                        isContinuationOnNextPage: true,
                        items: [
                            { field1: 1, field2: 2, field3: 7 },
                            { field1: 1, field2: 2, field3: 8 },
                            { field1: 1, field2: 2, field3: 9 }
                        ]
                    }]
                }]);
            });

            QUnit.test('Last page for big first level group', function(assert) {
                const source = this.createDataSource({
                    store: [
                        { field1: 1, field2: 2, field3: 1 },
                        { field1: 1, field2: 2, field3: 2 },
                        { field1: 1, field2: 2, field3: 3 },

                        { field1: 1, field2: 2, field3: 4 },
                        { field1: 1, field2: 2, field3: 5 },
                        { field1: 1, field2: 2, field3: 6 },

                        { field1: 1, field2: 2, field3: 7 },
                        { field1: 1, field2: 2, field3: 8 },

                        { field1: 2, field2: 3, field3: 9 }
                    ],
                    pageSize: 5
                });

                source.load();

                // act
                source.expandAll();
                source.pageIndex(2);
                source.load();

                assert.equal(source.totalItemsCount(), 18);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1,
                    isContinuation: true,
                    items: [{
                        key: 2,
                        isContinuation: true,
                        items: [
                            { field1: 1, field2: 2, field3: 7 },
                            { field1: 1, field2: 2, field3: 8 }
                        ]
                    }]
                }, {
                    key: 2,
                    isContinuationOnNextPage: true,
                    items: []
                }]);
            });

            QUnit.test('Last page for big second level group', function(assert) {
                const source = this.createDataSource({
                    store: [
                        { field1: 1, field2: 2, field3: 1 },
                        { field1: 1, field2: 2, field3: 2 },
                        { field1: 1, field2: 2, field3: 3 },

                        { field1: 1, field2: 2, field3: 4 },
                        { field1: 1, field2: 2, field3: 5 },
                        { field1: 1, field2: 2, field3: 6 },

                        { field1: 1, field2: 2, field3: 7 },
                        { field1: 1, field2: 2, field3: 8 },

                        { field1: 1, field2: 3, field3: 9 }
                    ],
                    pageSize: 5
                });

                source.load();

                // act
                source.expandAll();
                source.pageIndex(2);
                source.load();

                assert.equal(source.totalItemsCount(), 18);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1,
                    isContinuation: true,
                    isContinuationOnNextPage: true,
                    items: [{
                        key: 2,
                        isContinuation: true,
                        items: [
                            { field1: 1, field2: 2, field3: 7 },
                            { field1: 1, field2: 2, field3: 8 }
                        ]
                    }, {
                        key: 3,
                        isContinuationOnNextPage: true,
                        items: []
                    }]
                }]);
            });

            QUnit.test('Page ends with 2 group headers', function(assert) {
                const source = this.createDataSource({
                    store: [
                        { field1: 1, field2: 2, field3: 1 },
                        { field1: 2, field2: 3, field3: 2 },
                        { field1: 2, field2: 3, field3: 3 },
                        { field1: 2, field2: 3, field3: 4 },
                        { field1: 2, field2: 3, field3: 5 },
                        { field1: 2, field2: 3, field3: 6 },
                        { field1: 2, field2: 3, field3: 7 },
                        { field1: 2, field2: 3, field3: 8 }
                    ],
                    pageSize: 5
                });

                source.load();

                // act
                source.expandAll();
                source.load();

                // assert
                assert.equal(source.totalItemsCount(), 18);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1,
                    items: [{
                        key: 2,
                        items: [
                            { field1: 1, field2: 2, field3: 1 }
                        ]
                    }]
                }, {
                    key: 2,
                    isContinuationOnNextPage: true,
                    items: [{
                        key: 3,
                        isContinuationOnNextPage: true,
                        items: []
                    }]
                }]);

                // act
                source.pageIndex(1);
                source.load();

                // assert
                assert.equal(source.totalItemsCount(), 18);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 2,
                    isContinuation: true,
                    isContinuationOnNextPage: true,
                    items: [{
                        key: 3,
                        isContinuation: true,
                        isContinuationOnNextPage: true,
                        items: [
                            { field1: 2, field2: 3, field3: 2 },
                            { field1: 2, field2: 3, field3: 3 },
                            { field1: 2, field2: 3, field3: 4 }
                        ]
                    }]
                }]);
            });

            QUnit.test('Page ends with 1 first group header', function(assert) {
                const source = this.createDataSource({
                    store: [
                        { field1: 1, field2: 2, field3: 1 },
                        { field1: 1, field2: 2, field3: 2 },
                        { field1: 2, field2: 3, field3: 3 },
                        { field1: 2, field2: 3, field3: 4 },
                        { field1: 2, field2: 3, field3: 5 },
                        { field1: 2, field2: 3, field3: 6 },
                        { field1: 2, field2: 3, field3: 7 },
                        { field1: 2, field2: 3, field3: 8 }
                    ],
                    pageSize: 5
                });

                source.load();

                // act
                source.expandAll();
                source.load();

                // assert
                assert.equal(source.totalItemsCount(), 15);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 1,
                    items: [{
                        key: 2,
                        items: [
                            { field1: 1, field2: 2, field3: 1 },
                            { field1: 1, field2: 2, field3: 2 }
                        ]
                    }]
                }, {
                    key: 2,
                    isContinuationOnNextPage: true,
                    items: []
                }]);

                // act
                source.pageIndex(1);
                source.load();

                // assert
                assert.equal(source.totalItemsCount(), 15);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 2,
                    isContinuation: true,
                    isContinuationOnNextPage: true,
                    items: [{
                        key: 3,
                        isContinuationOnNextPage: true,
                        items: [
                            { field1: 2, field2: 3, field3: 3 },
                            { field1: 2, field2: 3, field3: 4 },
                            { field1: 2, field2: 3, field3: 5 }
                        ]
                    }]
                }]);
            });

            // T180076
            QUnit.test('Four groups with paging', function(assert) {
                const array = [
                    { field1: 1, field2: 2, field3: 3, field4: 4, field5: 5 },
                    { field1: 2, field2: 3, field3: 4, field4: 5, field5: 6 },
                    { field1: 3, field2: 4, field3: 5, field4: 6, field5: 7 }
                ];
                const source = this.createDataSource({
                    group: [{ selector: 'field1', isExpanded: true }, { selector: 'field2', isExpanded: true }, { selector: 'field3', isExpanded: true }, { selector: 'field4', isExpanded: true }],
                    store: array,
                    pageSize: 10
                });

                // act
                source.pageIndex(1);
                source.load();

                assert.equal(source.totalItemsCount(), 15);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 3, items: [{
                        key: 4, items: [{
                            key: 5, items: [{
                                key: 6, items: [array[2]]
                            }]
                        }]
                    }]
                }]);
            });

            // T180076
            QUnit.test('Four groups with paging after collapse group', function(assert) {
                const array = [
                    { field1: 1, field2: 2, field3: 3, field4: 4, field5: 5 },
                    { field1: 2, field2: 3, field3: 4, field4: 5, field5: 6 },
                    { field1: 3, field2: 4, field3: 5, field4: 6, field5: 7 }
                ];
                const source = this.createDataSource({
                    group: [{ selector: 'field1', isExpanded: true }, { selector: 'field2', isExpanded: true }, { selector: 'field3', isExpanded: true }, { selector: 'field4', isExpanded: true }],
                    store: array,
                    pageSize: 10
                });

                // act
                source.pageIndex(1);
                source.load();
                source.changeRowExpand([1]);
                source.load();

                assert.equal(source.totalItemsCount(), 15);
                assert.deepEqual(this.processItems(source.items()), [{
                    key: 3, isContinuation: true, items: [{
                        key: 4, isContinuation: true, items: [{
                            key: 5, isContinuation: true, items: [{
                                key: 6, isContinuation: true, items: [array[2]]
                            }]
                        }]
                    }]
                }]);
            });
        });
    });
});

QUnit.module('Summary', {
    beforeEach: function() {
        this.createDataSource = function(options) {
            return createDataSource($.extend({
                store: TEN_NUMBERS,
                pageSize: 3,
                paginate: true,
                remoteOperations: 'auto',
                requireTotalCount: true
            }, options));
        };
    }
}, () => {

    QUnit.test('Total summary without grouping', function(assert) {
        const dataSource = this.createDataSource({});

        dataSource.summary({
            totalAggregates: [{
                aggregator: 'count'
            }, {
                aggregator: 'sum'
            }]
        });

        // act
        dataSource.load();

        // assert
        assert.strictEqual(dataSource.items().length, 3);
        assert.deepEqual(dataSource.totalAggregates(), [10, 55]);
    });

    QUnit.test('Total summary and group summary', function(assert) {
        const dataSource = this.createDataSource({
            group: 'this'
        });

        dataSource.summary({
            totalAggregates: [{
                aggregator: 'count'
            }, {
                aggregator: 'sum'
            }],
            groupAggregates: [{
                aggregator: 'count'
            }]
        });

        // act
        dataSource.load();

        // assert
        assert.strictEqual(dataSource.items().length, 3);
        assert.deepEqual(dataSource.items()[0], { key: 1, aggregates: [1], items: null });
        assert.deepEqual(dataSource.totalAggregates(), [10, 55]);
    });

    QUnit.test('Total summary and group summary when map defines', function(assert) {
        const dataSource = this.createDataSource({
            group: 'this',
            map: function(data) {
                return data;
            }
        });

        dataSource.summary({
            totalAggregates: [{
                aggregator: 'count'
            }, {
                aggregator: 'sum'
            }],
            groupAggregates: [{
                aggregator: 'count'
            }]
        });

        // act
        dataSource.load();

        // assert
        assert.strictEqual(dataSource.items().length, 3);
        assert.deepEqual(dataSource.items()[0], { key: 1, aggregates: [1], items: null });
        assert.deepEqual(dataSource.totalAggregates(), [10, 55]);
    });

    QUnit.test('Total summary with CustomStore when remoteOperations filtering and sorting', function(assert) {
        let storeLoadOptions;
        const dataSource = this.createDataSource({
            filter: ['this', '>=', 0],
            sort: 'this',
            store: new CustomStore({
                load: function(options) {
                    storeLoadOptions = options;
                    return TEN_NUMBERS;
                }
            }),
            remoteOperations: {
                filtering: true,
                sorting: true
            }
        });

        dataSource.summary({
            totalAggregates: [{
                aggregator: 'count'
            }, {
                aggregator: 'sum'
            }]
        });

        // act
        dataSource.load();

        // assert
        assert.ok(storeLoadOptions.filter);
        assert.ok(storeLoadOptions.sort);
        assert.strictEqual(dataSource.items().length, 3);
        assert.deepEqual(dataSource.totalAggregates(), [10, 55]);
    });

    QUnit.test('Total summary with CustomStore when remoteOperations false', function(assert) {
        let storeLoadOptions;
        const dataSource = this.createDataSource({
            filter: ['this', '>=', 0],
            sort: 'this',
            store: new CustomStore({
                load: function(options) {
                    storeLoadOptions = options;
                    return TEN_NUMBERS;
                }
            }),
            remoteOperations: false
        });

        dataSource.summary({
            totalAggregates: [{
                aggregator: 'count'
            }, {
                aggregator: 'sum'
            }]
        });

        // act
        dataSource.load();

        // assert
        assert.ok(!storeLoadOptions.filter);
        assert.ok(!storeLoadOptions.sort);
        assert.strictEqual(dataSource.items().length, 3);
        assert.deepEqual(dataSource.totalAggregates(), [10, 55]);
    });

    QUnit.test('Total summary and group summary with CustomStore', function(assert) {
        const dataSource = this.createDataSource({
            group: 'this',
            remoteOperations: false,
            store: new CustomStore({
                load: function() {
                    return TEN_NUMBERS;
                }
            })
        });

        dataSource.summary({
            totalAggregates: [{
                aggregator: 'count'
            }, {
                aggregator: 'sum'
            }],
            groupAggregates: [{
                aggregator: 'count'
            }]
        });

        // act
        dataSource.load();

        // assert
        assert.strictEqual(dataSource.items().length, 3);
        assert.deepEqual(dataSource.items()[0], { key: 1, aggregates: [1], items: null });
        assert.deepEqual(dataSource.totalAggregates(), [10, 55]);
    });
});

QUnit.module('Cache', {
    beforeEach: function() {
        this.createDataSource = function(options) {
            const that = this;
            that.loadingCount = 0;
            return createDataSource($.extend({
                store: {
                    onLoading: function(e) {
                        that.loadingCount++;
                    },
                    type: 'array',
                    data: TEN_NUMBERS.slice()
                },
                pageSize: 3,
                paginate: true,
                remoteOperations: false,
                requireTotalCount: true
            }, options));
        };
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        TEN_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        this.clock.restore();
    }
}, () => {

    QUnit.test('caching when all remoteOperations', function(assert) {
        const dataSource = this.createDataSource({
            remoteOperations: {
                filtering: true,
                sorting: true,
                paging: true
            }
        });
        dataSource.load();

        // act
        dataSource.load();
        dataSource.reload();

        // assert
        assert.deepEqual(this.loadingCount, 1, 'one loading');
    });

    QUnit.test('caching pages when all remoteOperations', function(assert) {
        const dataSource = this.createDataSource({
            remoteOperations: true
        });
        dataSource.load();

        dataSource.pageIndex(1);
        dataSource.load();

        this.loadingCount = 0;

        // act
        dataSource.pageIndex(0);
        dataSource.load();

        // assert
        assert.deepEqual(this.loadingCount, 0, 'no loading');
        assert.deepEqual(dataSource.items(), [1, 2, 3], 'items are correct');
    });

    QUnit.test('not reset pages cache on pageSize change when all remoteOperations', function(assert) {
        const dataSource = this.createDataSource({
            remoteOperations: true
        });
        dataSource.load();

        this.loadingCount = 0;

        // act
        dataSource.pageSize(2);
        dataSource.load();

        // assert
        assert.deepEqual(this.loadingCount, 0, 'data is loaded from cache');
        assert.deepEqual(dataSource.items(), [1, 2], 'items are correct');
    });

    QUnit.test('reset pages cache on filtering change when all remoteOperations', function(assert) {
        const dataSource = this.createDataSource({
            remoteOperations: true
        });
        dataSource.load();

        this.loadingCount = 0;

        // act
        dataSource.filter(['this', '>', '4']);
        dataSource.load();

        // assert
        assert.deepEqual(this.loadingCount, 1, 'one loading');
        assert.deepEqual(dataSource.items(), [5, 6, 7], 'items are correct');
    });

    QUnit.test('caching totalCount and summary on paging when all remoteOperations', function(assert) {
        const that = this;
        that.loadingArgs = [];

        const dataSource = this.createDataSource({
            load: function(options) {
                that.loadingArgs.push(options);

                const data = TEN_NUMBERS.slice(options.skip, options.skip + options.take);
                return $.Deferred().resolve(data, {
                    totalCount: options.requireTotalCount ? TEN_NUMBERS.length : -1,
                    summary: options.totalSummary ? [666] : null
                });
            },
            remoteOperations: true
        });

        dataSource.summary({
            totalAggregates: [{
                selector: 'this',
                aggregator: 'sum'
            }]
        });

        dataSource.load();

        // act
        dataSource.pageIndex(1);
        dataSource.load();

        // assert
        assert.deepEqual(this.loadingArgs.length, 2, 'two loading');
        assert.deepEqual(this.loadingArgs[0].requireTotalCount, true, 'requireTotalCount for first page');
        assert.deepEqual(this.loadingArgs[0].totalSummary, [{ selector: 'this', aggregator: 'sum' }], 'totalSummary for first page');
        assert.deepEqual(this.loadingArgs[1].requireTotalCount, undefined, 'no requireTotalCount for second page');
        assert.deepEqual(this.loadingArgs[1].totalSummary, undefined, 'no totalSummary for second page');
    });

    [false, true].forEach(function(groupPaging) {
        QUnit.test('caching pages when remote ' + (groupPaging ? 'group paging' : 'grouping'), function(assert) {
            const that = this;
            that.loadingArgs = [];

            const dataSource = createDataSourceWithRemoteGrouping({
                store: {
                    onLoading: function(e) {
                        that.loadingArgs.push(e);
                    },
                    type: 'array',
                    data: TEN_NUMBERS
                },
                paginate: true,
                requireTotalCount: true,
                pageSize: 3,
                group: ['this']
            }, groupPaging);

            dataSource.load();
            dataSource.changeRowExpand([1]);
            dataSource.load();

            dataSource.pageIndex(1);
            dataSource.load();

            assert.deepEqual(this.loadingArgs.length, groupPaging ? 4 : 2, 'loading count before cache');

            this.loadingArgs = [];

            // act
            dataSource.pageIndex(0);
            dataSource.load();

            // assert
            assert.deepEqual(this.loadingArgs.length, 0, 'no loading');
            assert.deepEqual(dataSource.items(), [
                { key: 1, items: [1] },
                { key: 2, items: null },
            ], 'items are correct');
            assert.deepEqual(dataSource.totalItemsCount(), 11, 'totalCount');
        });
    });

    QUnit.test('no caching when cacheEnabled false', function(assert) {
        const dataSource = this.createDataSource({
            cacheEnabled: false
        });
        dataSource.load();

        // act
        dataSource.load();
        dataSource.reload();

        // assert
        assert.deepEqual(this.loadingCount, 3, 'three loading');
    });

    QUnit.test('second load from cache after change filter/sort', function(assert) {
        const dataSource = this.createDataSource({});
        dataSource.load();

        // act
        dataSource.sort({ selector: 'this', desc: true });
        dataSource.filter(['this', '>', 5]);
        dataSource.load();

        // assert
        assert.strictEqual(dataSource.items().length, 3, 'item Count');
        assert.strictEqual(dataSource.items()[0], 10, 'first item');
        assert.deepEqual(dataSource.totalCount(), 5, 'totalCount');
        assert.deepEqual(this.loadingCount, 1, 'one loading');
    });

    QUnit.test('full reload reset cache', function(assert) {
        const dataSource = this.createDataSource({});
        dataSource.load();

        // act
        dataSource.filter(['this', '>', 5]);
        dataSource.reload(true);

        // assert
        assert.deepEqual(dataSource.totalCount(), 5, 'totalCount');
        assert.deepEqual(this.loadingCount, 2, 'two loading');
    });

    QUnit.test('reload from original dataSource reset cache', function(assert) {
        const dataSource = this.createDataSource({});
        dataSource.load();

        // act
        dataSource.filter(['this', '>', 5]);
        dataSource._dataSource.reload();

        // assert
        assert.deepEqual(dataSource.totalCount(), 5, 'totalCount');
        assert.deepEqual(this.loadingCount, 2, 'two loading');
    });

    QUnit.test('load from cache when remote filtering is not changed and pageIndex is changed', function(assert) {
        const dataSource = this.createDataSource({
            remoteOperations: {
                filtering: true
            }
        });
        dataSource.filter(['this', '<', 5]);
        dataSource.load();

        // act
        dataSource.filter(['this', '<', 5]);
        dataSource.pageIndex(1);
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.items()[0], 4, 'first item on page');
        assert.deepEqual(this.loadingCount, 1, 'one loading');
    });

    QUnit.test('load from cache when pageSize and pageIndex is changed', function(assert) {
        const dataSource = this.createDataSource({
            remoteOperations: {
                filtering: true
            }
        });
        dataSource.load();

        // act
        dataSource.pageSize(4);
        dataSource.pageIndex(1);
        dataSource.reload();

        // assert
        assert.deepEqual(dataSource.items()[0], 5, 'first item on page');
        assert.deepEqual(this.loadingCount, 1, 'one loading');
    });

    // T328467
    QUnit.test('load from cache when remote paging but summary exists and pageIndex is changed', function(assert) {
        const dataSource = this.createDataSource({
            remoteOperations: {
                filtering: true,
                paging: true
            }
        });

        dataSource.summary({
            totalAggregates: [{
                selector: 'this',
                aggregator: 'count'
            }, {
                selector: 'this',
                aggregator: 'sum'
            }]
        });

        dataSource.load();
        assert.deepEqual(this.loadingCount, 1, 'one loading');

        // act
        dataSource.pageSize(4);
        dataSource.pageIndex(1);
        dataSource.reload();

        // assert
        assert.deepEqual(dataSource.items()[0], 5, 'first item on page');
        assert.deepEqual(this.loadingCount, 1, 'one loading');
        assert.deepEqual(dataSource.totalAggregates(), [10, 55], 'total aggregates');
    });


    QUnit.test('reset cache when remote filtering is changed', function(assert) {
        const dataSource = this.createDataSource({
            remoteOperations: {
                filtering: true
            }
        });
        dataSource.filter(['this', '>', 5]);
        dataSource.load();

        // act
        dataSource.filter(['this', '>', 6]);
        dataSource.reload();

        // assert
        assert.deepEqual(dataSource.items()[0], 7, 'first item on page');
        assert.deepEqual(dataSource.totalCount(), 4, 'totalCount');
        assert.deepEqual(this.loadingCount, 2, 'one loading');
    });

    QUnit.test('reset cache when remote sorting is changed', function(assert) {
        const dataSource = this.createDataSource({
            remoteOperations: {
                sorting: true
            }
        });
        dataSource.load();

        // act
        dataSource.sort({ selector: 'this', desc: true });
        dataSource.reload();

        // assert
        assert.deepEqual(dataSource.items()[0], 10, 'first item on page');
        assert.deepEqual(dataSource.totalCount(), 10, 'totalCount');
        assert.deepEqual(this.loadingCount, 2, 'one loading');
    });

    QUnit.test('reset cache when remote sorting is not changed and grouping is changed', function(assert) {
        const dataSource = this.createDataSource({
            remoteOperations: {
                sorting: true
            }
        });
        dataSource.load();

        // act
        dataSource.group({ selector: 'this', desc: true });
        dataSource.reload();

        // assert
        assert.deepEqual(dataSource.items()[0], { key: 10, items: null }, 'first item on page');
        assert.deepEqual(dataSource.totalCount(), 10, 'totalCount');
        assert.deepEqual(this.loadingCount, 1, 'one loading');
    });

    QUnit.test('update cache on push', function(assert) {
        const dataSource = this.createDataSource({
            reshapeOnPush: true
        });
        dataSource.load();
        this.clock.tick(10);

        // act
        dataSource.store().push([{ type: 'remove', key: 1 }]);
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataSource.items()[0], 2, 'first item on page');
        assert.deepEqual(dataSource.totalCount(), 9, 'totalCount is refreshed');
        assert.deepEqual(this.loadingCount, 1, 'one loading');
    });

    QUnit.test('update cache on push without reshapeOnPush', function(assert) {
        const dataSource = this.createDataSource({
            pushAggregationTimeout: 0
        });
        dataSource.load();
        this.clock.tick(10);

        // act
        dataSource.store().push([{ type: 'remove', key: 1 }]);
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataSource.items()[0], 2, 'first item on page');
        assert.deepEqual(dataSource.totalCount(), 10, 'totalCount is not refreshed');
        assert.deepEqual(this.loadingCount, 1, 'one loading');
    });

    QUnit.test('load summary from cache on paging for local array (T1042990)', function(assert) {
        const array = [1, 2, 3, 4];
        const dataSource = this.createDataSource({
            store: array
        });

        let stepCount = 0;

        dataSource.summary({
            totalAggregates: [{
                aggregator: {
                    seed: 0,
                    step: (a, b) => {
                        stepCount++;
                        return a + b;
                    }
                }
            }]
        });
        dataSource.load();
        this.clock.tick(10);

        assert.equal(stepCount, 4, 'summary is calculated');

        // act
        dataSource.pageIndex(1);
        dataSource.load();
        this.clock.tick(10);

        // assert
        assert.equal(stepCount, 4, 'summary is not recalculated');
        assert.deepEqual(dataSource.items()[0], 4, 'first item on page');
        assert.deepEqual(dataSource.totalCount(), 4, 'totalCount');
        assert.deepEqual(dataSource.totalAggregates(), [10], 'totalAggregates');
    });

    QUnit.test('do not load summary from cache on paging for local array if group summary is defined (T1042990)', function(assert) {
        const array = [1, 2, 3, 4];
        const dataSource = this.createDataSource({
            store: array,
            group: 'this'
        });

        let stepCount = 0;

        dataSource.summary({
            totalAggregates: [{
                aggregator: {
                    seed: 0,
                    step: (a, b) => {
                        stepCount++;
                        return a + b;
                    }
                }
            }],
            groupAggregates: [{
                aggregator: 'count'
            }]
        });
        dataSource.load();
        this.clock.tick(10);

        assert.equal(stepCount, 4, 'summary is calculated');

        // act
        dataSource.pageIndex(1);
        dataSource.load();
        this.clock.tick(10);

        // assert
        assert.equal(stepCount, 8, 'summary is recalculated');
        assert.deepEqual(dataSource.items()[0].key, 4, 'first item key on page');
        assert.deepEqual(dataSource.items()[0].aggregates, [1], 'first item aggregates on page');
        assert.deepEqual(dataSource.totalCount(), 4, 'totalCount');
        assert.deepEqual(dataSource.totalAggregates(), [10], 'totalAggregates');
    });

    QUnit.test('calculate summary on load without operations for local array', function(assert) {
        const array = [1, 2, 3, 4];
        const dataSource = this.createDataSource({
            store: array
        });

        let stepCount = 0;

        dataSource.summary({
            totalAggregates: [{
                aggregator: {
                    seed: 0,
                    step: (a, b) => {
                        stepCount++;
                        return a + b;
                    }
                }
            }]
        });
        dataSource.load();
        this.clock.tick(10);

        assert.equal(stepCount, 4, 'summary is calculated');

        // act
        dataSource.load();
        this.clock.tick(10);

        // assert
        assert.equal(stepCount, 8, 'summary is recalculated');
        assert.deepEqual(dataSource.totalCount(), 4, 'totalCount');
        assert.deepEqual(dataSource.totalAggregates(), [10], 'totalAggregates');
    });

    QUnit.test('New mode. Data should be loaded from the cache with the same load params', function(assert) {
        const dataSource = this.createDataSource({
            remoteOperations: {
                paging: true,
                sorting: true
            },
            scrolling: {
                legacyMode: false,
                mode: 'virtual',
                rowRenderingMode: 'virtual'
            }
        });
        dataSource.load();
        this.clock.tick(10);

        // assert
        assert.equal(this.loadingCount, 1, 'first load');

        // act
        dataSource.pageIndex(1);
        dataSource.loadPageCount(2);
        dataSource.load();
        this.clock.tick(10);

        // assert
        assert.equal(this.loadingCount, 2, 'second load');
        assert.deepEqual(dataSource.items(), [4, 5, 6, 7, 8, 9], 'items on the second load');

        // act
        dataSource.pageIndex(2);
        dataSource.loadPageCount(1);
        dataSource.load();
        this.clock.tick(10);

        // assert
        assert.equal(this.loadingCount, 2, 'data is loaded from cache');
        assert.deepEqual(dataSource.items(), [7, 8, 9], 'items on the third load');

        // act
        dataSource.pageIndex(1);
        dataSource.loadPageCount(2);
        dataSource.load();
        this.clock.tick(10);

        // assert
        assert.equal(this.loadingCount, 2, 'data is loaded from cache');
        assert.deepEqual(dataSource.items(), [4, 5, 6, 7, 8, 9], 'items from cache');
    });

    QUnit.test('New mode. Data should be loaded from the cache with the same load params if remote groupPaging', function(assert) {
        const remoteGroupPaging = true;
        const array = [
            { group1: 1, group2: 1, id: 1 },
            { group1: 1, group2: 1, id: 2 },
            { group1: 1, group2: 1, id: 3 },
            { group1: 1, group2: 1, id: 4 },
            { group1: 1, group2: 2, id: 5 },
            { group1: 2, group2: 1, id: 6 },
        ];

        const dataSource = createDataSourceWithRemoteGrouping({
            store: array,
            paginate: true,
            pageSize: 2,
            requireTotalCount: true,
            requireGroupCount: true,
            group: ['group1', 'group2'],
            scrolling: {
                legacyMode: false,
                mode: 'virtual',
                rowRenderingMode: 'virtual'
            }
        }, remoteGroupPaging);

        dataSource.load();
        dataSource.changeRowExpand([1]);
        dataSource.load();
        dataSource.changeRowExpand([1, 1]);
        dataSource.load();
        dataSource.pageIndex(1);
        dataSource.load();
        dataSource.pageIndex(2);
        dataSource.load();

        this.loadingCount = 0;

        // act
        dataSource.pageIndex(1);
        dataSource.load();

        // assert
        assert.equal(this.loadingCount, 0, 'no load during back scroll');
        assert.deepEqual(dataSource.items(), [{
            'isContinuation': true,
            'isContinuationOnNextPage': true,
            'items': [
                {
                    'isContinuation': true,
                    'isContinuationOnNextPage': true,
                    'items': [
                        array[0],
                        array[1]
                    ],
                    'key': 1
                }
            ],
            'key': 1
        }], 'items on the second load');

        // act
        dataSource.pageIndex(0);
        dataSource.load();

        // assert
        assert.equal(this.loadingCount, 0, 'no load during back scroll');
        assert.deepEqual(dataSource.items(), [{
            'isContinuationOnNextPage': true,
            'items': [
                {
                    'items': [],
                    'key': 1
                }
            ],
            'key': 1
        }], 'items on the second load');
    });

    QUnit.test('New mode. Cache should not be reset when pageSize is changed', function(assert) {
        const dataSource = this.createDataSource({
            remoteOperations: {
                paging: true,
                sorting: true
            },
            scrolling: {
                legacyMode: false,
                mode: 'virtual',
                rowRenderingMode: 'virtual'
            }
        });
        dataSource.load();
        this.clock.tick(10);

        // assert
        assert.equal(this.loadingCount, 1, 'first load');
        assert.deepEqual(dataSource.items(), [1, 2, 3], 'items on the first load');

        // act
        dataSource.pageIndex(1);
        dataSource.loadPageCount(2);
        dataSource.load();
        this.clock.tick(10);

        // assert
        assert.equal(this.loadingCount, 2, 'second load');
        assert.deepEqual(dataSource.items(), [4, 5, 6, 7, 8, 9], 'items on the second load');

        // act
        dataSource.pageIndex(0);
        dataSource.pageSize(2);
        dataSource.loadPageCount(1);
        dataSource.load();
        this.clock.tick(10);

        // assert
        assert.equal(this.loadingCount, 2, 'data is loaded from the cache');
        assert.deepEqual(dataSource.items(), [1, 2], 'new loaded items for the first page');
    });

    QUnit.test('New mode. Data should be loaded without the cache', function(assert) {
        const dataSource = this.createDataSource({
            remoteOperations: {
                paging: true,
                sorting: true
            },
            scrolling: {
                legacyMode: false,
                mode: 'virtual',
                rowRenderingMode: 'virtual'
            },
            cacheEnabled: false,
        });
        dataSource.load();
        this.clock.tick(10);

        // assert
        assert.equal(this.loadingCount, 1, 'first load');

        // act
        dataSource.pageIndex(1);
        dataSource.loadPageCount(2);
        dataSource.load();
        this.clock.tick(10);

        // assert
        assert.equal(this.loadingCount, 2, 'second load');
        assert.deepEqual(dataSource.items(), [4, 5, 6, 7, 8, 9], 'items on the second load');

        // act
        dataSource.pageIndex(2);
        dataSource.loadPageCount(1);
        dataSource.load();
        this.clock.tick(10);

        // assert
        assert.equal(this.loadingCount, 3, 'third load');
        assert.deepEqual(dataSource.items(), [7, 8, 9], 'items on the third load');

        // act
        dataSource.pageIndex(1);
        dataSource.loadPageCount(2);
        dataSource.load();
        this.clock.tick(10);

        // assert
        assert.equal(this.loadingCount, 4, 'fourth load');
        assert.deepEqual(dataSource.items(), [4, 5, 6, 7, 8, 9], 'items on the fourth load');
    });
});

QUnit.module('Custom Load', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.createDataSource = function(options) {
            const that = this;
            that.loadingCount = 0;
            return (options.remoteOperations === true ? createDataSourceWithRemoteGrouping : createDataSource)($.extend({
                store: {
                    onLoading: function(e) {
                        if(e.group && e.group.length === 1 && e.group[0].selector === 'this' && e.group[0].groupInterval) {
                            e.group[0].selector = function(data) {
                                return Math.floor(data / e.group[0].groupInterval);
                            };
                        }
                        that.loadingCount++;
                    },
                    type: 'array',
                    data: TEN_NUMBERS
                },
                pageSize: 3,
                paginate: true,
                remoteOperations: false,
                requireTotalCount: true
            }, options));
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {

    // T344031
    QUnit.test('load when loadingTimeout is defined', function(assert) {
        const dataSource = this.createDataSource({
            loadingTimeout: 10
        });
        dataSource.load();

        this.clock.tick(10);


        const changedArgs = [];
        const loadingChangedArgs = [];

        dataSource.changed.add(function(e) {
            changedArgs.push(e);
        });

        dataSource.loadingChanged.add(function(e) {
            loadingChangedArgs.push(e);
        });

        let customLoadData = false;

        // act
        dataSource.load({
            filter: ['this', '>', 8]
        }).done(function(data) {
            customLoadData = data;
        });

        this.clock.tick(9);

        // assert
        assert.ok(!customLoadData, 'custom load data is not loaded');
        assert.deepEqual(loadingChangedArgs, [true], 'loadingChanged args when data is not loaded');

        // act
        this.clock.tick(1);

        // assert
        assert.deepEqual(customLoadData, [9, 10], 'custom load data');
        assert.deepEqual(loadingChangedArgs, [true, false], 'loadingChanged args');
    });

    QUnit.test('load without cache with group/filter/paging options', function(assert) {
        const dataSource = this.createDataSource({
            filter: ['this', '>', '5'],
            remoteOperations: { filtering: true }
        });
        dataSource.load();

        const changedArgs = [];
        const loadingChangedArgs = [];

        dataSource.changed.add(function(e) {
            changedArgs.push(e);
        });

        dataSource.loadingChanged.add(function(e) {
            loadingChangedArgs.push(e);
        });

        let customLoadData = false;

        // act
        dataSource.load({
            filter: ['this', '>', '1'],
            group: 'this',
            skip: 2,
            take: 2
        }).done(function(data) {
            customLoadData = data;
        });


        // assert
        assert.deepEqual(customLoadData, [{ key: 4, items: [4] }, { key: 5, items: [5] }], 'custom load data');
        assert.ok(!changedArgs.length, 'changed is not fired');
        assert.deepEqual(loadingChangedArgs, [true, false], 'loadingChanged args');

        assert.deepEqual(dataSource.items(), [6, 7, 8], 'items on page');
        assert.deepEqual(dataSource.totalCount(), 5, 'totalCount');
        assert.deepEqual(this.loadingCount, 2, 'loading count');
    });

    // T317818
    QUnit.test('load from cache with group/filter/paging options', function(assert) {
        const dataSource = this.createDataSource({
            filter: ['this', '>', '5'],
            remoteOperations: { filtering: true }
        });
        dataSource.load();

        const changedArgs = [];
        const loadingChangedArgs = [];

        dataSource.changed.add(function(e) {
            changedArgs.push(e);
        });

        dataSource.loadingChanged.add(function(e) {
            loadingChangedArgs.push(e);
        });

        let customLoadData = false;

        // act
        dataSource.load({
            filter: ['this', '>', '5'],
            group: 'this',
            skip: 2,
            take: 2
        }).done(function(data) {
            customLoadData = data;
        });


        // assert
        assert.deepEqual(customLoadData, [{ key: 8, items: [8] }, { key: 9, items: [9] }], 'custom load data');
        assert.ok(!changedArgs.length, 'changed is not fired');
        assert.deepEqual(loadingChangedArgs, [true, false], 'loadingChanged args');

        assert.deepEqual(dataSource.items(), [6, 7, 8], 'items on page');
        assert.deepEqual(dataSource.totalCount(), 5, 'totalCount');
        assert.deepEqual(this.loadingCount, 1, 'loading count');
    });

    // T341843
    QUnit.test('load from cache with group as function options', function(assert) {
        const dataSource = this.createDataSource({
            group: [{ selector: 'this', desc: false }],
            remoteOperations: false
        });
        dataSource.load();

        const changedArgs = [];
        const loadingChangedArgs = [];

        dataSource.changed.add(function(e) {
            changedArgs.push(e);
        });

        dataSource.loadingChanged.add(function(e) {
            loadingChangedArgs.push(e);
        });

        let customLoadData = false;

        // act
        dataSource.load({
            group: function(data) { return data % 2; }
        }).done(function(data) {
            customLoadData = data;
        });


        // assert
        assert.deepEqual(customLoadData, [{ key: 0, items: [2, 4, 6, 8, 10] }, { key: 1, items: [1, 3, 5, 7, 9] }], 'custom load data');
        assert.ok(!changedArgs.length, 'changed is not fired');
        assert.deepEqual(loadingChangedArgs, [true, false], 'loadingChanged args');

        assert.deepEqual(dataSource.items(), [{ key: 1, items: null }, { key: 2, items: null }, { key: 3, items: null }], 'items on page');
        assert.deepEqual(dataSource.totalCount(), 10, 'totalCount');
        assert.deepEqual(this.loadingCount, 1, 'loading count');
    });

    QUnit.test('load when remote grouping and not isLoadingAll', function(assert) {
        const dataSource = this.createDataSource({
            filter: ['this', '>', '5'],
            remoteOperations: true
        });
        dataSource.load();

        const changedArgs = [];
        const loadingChangedArgs = [];

        dataSource.changed.add(function(e) {
            changedArgs.push(e);
        });

        dataSource.loadingChanged.add(function(e) {
            loadingChangedArgs.push(e);
        });

        let customLoadData = false;
        this.loadingCount = 0;
        // act
        dataSource.load({
            filter: ['this', '>', '5'],
            group: 'this',
            skip: 2,
            take: 2
        }).done(function(data) {
            customLoadData = data;
        });


        // assert
        assert.deepEqual(customLoadData, [{ key: 8, items: null, count: 1 }, { key: 9, items: null, count: 1 }], 'custom load data');
        assert.ok(!changedArgs.length, 'changed is not fired');
        assert.deepEqual(loadingChangedArgs, [true, false], 'loadingChanged args');

        assert.deepEqual(dataSource.items(), [6, 7, 8], 'items on page');
        assert.deepEqual(dataSource.totalCount(), 5, 'totalCount');
        assert.deepEqual(this.loadingCount, 1, 'loading count');
    });

    // T368828
    QUnit.test('load when remote grouping and first page', function(assert) {
        const dataSource = this.createDataSource({
            group: 'this',
            remoteOperations: true,
            pageSize: 3
        });
        dataSource.load();

        const changedArgs = [];
        const loadingChangedArgs = [];

        dataSource.changed.add(function(e) {
            changedArgs.push(e);
        });

        dataSource.loadingChanged.add(function(e) {
            loadingChangedArgs.push(e);
        });

        let customLoadData = false;
        this.loadingCount = 0;
        // act
        dataSource.load({
            group: 'this',
            skip: 0,
            take: 3
        }).done(function(data) {
            customLoadData = data;
        });


        // assert
        assert.deepEqual(customLoadData, [{ key: 1, items: null, count: 1 }, { key: 2, items: null, count: 1 }, { key: 3, items: null, count: 1 }], 'custom load data');
        assert.ok(!changedArgs.length, 'changed is not fired');
        assert.deepEqual(loadingChangedArgs, [true, false], 'loadingChanged args');

        assert.deepEqual(dataSource.items(), [{ key: 1, items: null }, { key: 2, items: null }, { key: 3, items: null }], 'items on page');
        assert.deepEqual(dataSource.totalCount(), 10, 'totalCount');
        assert.deepEqual(this.loadingCount, 0, 'loading count');
    });

    // T368828
    QUnit.test('load when remote grouping and second page', function(assert) {
        const dataSource = this.createDataSource({
            group: 'this',
            remoteOperations: true
        });
        dataSource.load();

        const changedArgs = [];
        const loadingChangedArgs = [];

        dataSource.changed.add(function(e) {
            changedArgs.push(e);
        });

        dataSource.loadingChanged.add(function(e) {
            loadingChangedArgs.push(e);
        });

        let customLoadData = false;
        this.loadingCount = 0;
        // act

        dataSource.load({
            group: 'this',
            skip: 2,
            take: 2
        }).done(function(data) {
            customLoadData = data;
        });


        // assert
        assert.deepEqual(customLoadData, [{ key: 3, items: null, count: 1 }, { key: 4, items: null, count: 1 }], 'custom load data');
        assert.ok(!changedArgs.length, 'changed is not fired');
        assert.deepEqual(loadingChangedArgs, [true, false], 'loadingChanged args');

        assert.deepEqual(dataSource.items(), [{ key: 1, items: null }, { key: 2, items: null }, { key: 3, items: null }], 'items on page');
        assert.deepEqual(dataSource.totalCount(), 10, 'totalCount');
        assert.deepEqual(this.loadingCount, 1, 'loading count');
    });

    // T368875
    QUnit.test('load when remote grouping and groupInterval is defined', function(assert) {
        const dataSource = this.createDataSource({
            group: 'this',
            remoteOperations: true,
            pageSize: 3
        });
        dataSource.load();

        const changedArgs = [];
        const loadingChangedArgs = [];

        dataSource.changed.add(function(e) {
            changedArgs.push(e);
        });

        dataSource.loadingChanged.add(function(e) {
            loadingChangedArgs.push(e);
        });

        let customLoadData = false;
        this.loadingCount = 0;
        // act
        dataSource.load({
            group: [{ selector: 'this', groupInterval: 2 }],
            skip: 0,
            take: 3
        }).done(function(data) {
            customLoadData = data;
        });


        // assert
        assert.deepEqual(customLoadData, [{ key: 0, items: null, count: 1 }, { key: 1, items: null, count: 2 }, { key: 2, items: null, count: 2 }], 'custom load data');
        assert.ok(!changedArgs.length, 'changed is not fired');
        assert.deepEqual(loadingChangedArgs, [true, false], 'loadingChanged args');

        assert.deepEqual(dataSource.items(), [{ key: 1, items: null }, { key: 2, items: null }, { key: 3, items: null }], 'items on page');
        assert.deepEqual(dataSource.totalCount(), 10, 'totalCount');
        assert.deepEqual(this.loadingCount, 1, 'loading count');
    });

    // T375388
    QUnit.test('load when remote summary and summary is not defined', function(assert) {
        const dataSource = this.createDataSource({
            remoteOperations: { summary: true }
        });
        dataSource.load();

        let customLoadData = false;
        // act
        dataSource.load({
            filter: ['this', '>=', '5'],
            group: 'this',
            take: 2
        }).done(function(data) {
            customLoadData = data;
        });


        // assert
        assert.deepEqual(customLoadData, [{ key: 5, items: [5] }, { key: 6, items: [6] }], 'custom load data');

        assert.deepEqual(dataSource.items(), [1, 2, 3], 'items on page');
        assert.deepEqual(dataSource.totalCount(), 10, 'totalCount');
    });

    // T344271
    QUnit.test('load when remote grouping and not isLoadingAll and expand one item', function(assert) {
        const dataSource = this.createDataSource({
            filter: ['this', '>', '5'],
            remoteOperations: true,
            group: 'this'
        });
        dataSource.load();

        const changedArgs = [];
        const loadingChangedArgs = [];
        const loadingArgs = [];

        dataSource.changed.add(function(e) {
            changedArgs.push(e);
        });

        dataSource.loadingChanged.add(function(e) {
            loadingChangedArgs.push(e);
        });

        let customLoadData = false;
        this.loadingCount = 0;

        dataSource.changeRowExpand([6]);

        dataSource.store().on('loading', function(e) {
            loadingArgs.push(e);
        });

        // act
        dataSource.load().done(function(data) {
            customLoadData = data;
        });

        // assert
        assert.deepEqual(customLoadData, [{ key: 6, items: [6], count: 1 }, { key: 7, items: null, collapsedItems: null, count: 1 }], 'custom load data');
        assert.equal(changedArgs.length, 1, 'changed is fired');
        assert.deepEqual(loadingChangedArgs, [true, false, true, false], 'loadingChanged args');
        assert.deepEqual(loadingArgs, [{
            group: null, requireTotalCount: false, requireGroupCount: false, searchOperation: 'contains', searchValue: null, userData: {},
            sort: [{ selector: 'this', desc: false }],
            filter: [['this', '>', '5'], 'and', ['this', '=', 6]],
            skip: undefined,
            take: undefined
        }], 'loading args');

        assert.deepEqual(dataSource.items(), [{ key: 6, items: [6] }, { key: 7, items: null }], 'items on page');
        assert.deepEqual(dataSource.totalCount(), 5, 'totalCount');
        assert.deepEqual(this.loadingCount, 1, 'loading count');
    });

    // T324247
    QUnit.test('load when remote grouping and isLoadingAll', function(assert) {
        const dataSource = this.createDataSource({
            filter: ['this', '>', '5'],
            remoteOperations: true
        });
        dataSource.load();

        const changedArgs = [];
        const loadingChangedArgs = [];

        dataSource.changed.add(function(e) {
            changedArgs.push(e);
        });

        dataSource.loadingChanged.add(function(e) {
            loadingChangedArgs.push(e);
        });

        let customLoadData = false;
        this.loadingCount = 0;

        // act
        dataSource.load({
            isLoadingAll: true,
            filter: ['this', '>', '5'],
            group: 'this'
        }).done(function(data) {
            customLoadData = data;
        });

        // assert
        assert.deepEqual(customLoadData, [6, 7, 8, 9, 10].map(function(key) {
            return { key: key, items: [key], count: 1 };
        }), 'custom load data');
        assert.ok(!changedArgs.length, 'changed is not fired');
        assert.deepEqual(loadingChangedArgs, [true, false], 'loadingChanged args');

        assert.deepEqual(dataSource.items(), [6, 7, 8], 'items on page');
        assert.deepEqual(dataSource.totalCount(), 5, 'totalCount');

        assert.deepEqual(this.loadingCount, 2, 'loading count');
    });

    // T359403
    QUnit.test('load with group and paging options', function(assert) {
        let loadingCount = 0;
        const dataSource = this.createDataSource({
            store: {
                onLoading: function() {
                    loadingCount++;
                },
                type: 'array',
                data: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
            },

            pageSize: 5,
            remoteOperations: { filtering: true, sorting: true, paging: true }
        });
        dataSource.load();

        const changedArgs = [];
        const loadingChangedArgs = [];

        dataSource.changed.add(function(e) {
            changedArgs.push(e);
        });

        dataSource.loadingChanged.add(function(e) {
            loadingChangedArgs.push(e);
        });

        let customLoadData = false;

        // act
        dataSource.load({
            group: 'this',
            skip: 2,
            take: 2
        }).done(function(data) {
            customLoadData = data;
        });


        // assert
        assert.deepEqual(customLoadData, [{ key: 3, items: [3, 3] }, { key: 4, items: [4, 4] }], 'custom load data');
        assert.ok(!changedArgs.length, 'changed is not fired');
        assert.deepEqual(loadingChangedArgs, [true, false], 'loadingChanged args');

        assert.deepEqual(dataSource.items(), [1, 1, 2, 2, 3], 'items on page');
        assert.deepEqual(dataSource.totalCount(), 10, 'totalCount');
        assert.deepEqual(loadingCount, 2, 'loading count');
    });
});


QUnit.module('New virtual scrolling mode', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.createDataSource = function(options) {
            return createDataSource($.extend({
                store: TEN_NUMBERS,
                paginate: true,
                scrolling: {
                    legacyMode: false,
                    mode: 'virtual',
                    rowRenderingMode: 'virtual'
                },
                remoteOperations: { filtering: true, sorting: true, paging: true }
            }, options));
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('loadPageCount affects the skip and take parameter', function(assert) {
        // arrange
        const dataSource = this.createDataSource({
            pageSize: 3
        });
        const dataLoadingHandler = dataSource._customizeStoreLoadOptionsHandler;
        const takeValues = [];
        const skipValues = [];

        dataSource._customizeStoreLoadOptionsHandler = function(options) {
            dataLoadingHandler.apply(dataSource, arguments);
            skipValues.push(options.storeLoadOptions.skip);
            takeValues.push(options.storeLoadOptions.take);
        };
        dataSource._dataSource.off('customizeStoreLoadOptions', dataLoadingHandler);
        dataSource._dataSource.on('customizeStoreLoadOptions', dataSource._customizeStoreLoadOptionsHandler);

        try {
            // act
            dataSource.loadPageCount(2);
            dataSource.load();

            // assert
            assert.strictEqual(skipValues[0], 0, 'first skip value');
            assert.strictEqual(takeValues[0], 6, 'first take value');
            assert.deepEqual(dataSource.items(), TEN_NUMBERS.slice(0, 6), 'first load items');

            // act
            dataSource.loadPageCount(3);
            dataSource.load();

            // assert
            assert.strictEqual(skipValues[1], 6, 'second skip value');
            assert.strictEqual(takeValues[1], 3, 'second take value');
            assert.deepEqual(dataSource.items(), TEN_NUMBERS.slice(0, 9), 'second load items');
        } finally {
            dataSource._dataSource.off('customizeStoreLoadOptions', dataSource._dataLoadingHandler);
            dataSource._dataSource.on('customizeStoreLoadOptions', dataLoadingHandler);
        }
    });

    // TODO the following tests can be removed when legacyMode is disabled by default
    QUnit.test('startLoadTime was not initialized when loadingChanged is raised', function(assert) {
        // arrange
        const dataSource = this.createDataSource({
            pageSize: 3
        });
        const loadingChangeHandler = dataSource._loadingChangedHandler;
        const startLoadTimeValues = [];

        dataSource._loadingChangedHandler = function() {
            loadingChangeHandler.apply(dataSource, arguments);
            startLoadTimeValues.push(dataSource._startLoadTime);
        };
        dataSource._dataSource.off('loadingChanged', loadingChangeHandler);
        dataSource._dataSource.on('loadingChanged', dataSource._loadingChangedHandler);

        try {
            // act
            dataSource.load();

            // assert
            assert.strictEqual(startLoadTimeValues.length, 2, 'change handler call count');
            assert.notOk(startLoadTimeValues[0], 'not initizlized on the first call');
            assert.notOk(startLoadTimeValues[1], 'not initizlized on the second call');
        } finally {
            dataSource._dataSource.off('loadingChanged', dataSource._loadingChangedHandler);
            dataSource._dataSource.on('loadingChanged', loadingChangeHandler);
        }
    });

    QUnit.test('VirtualScrollController.handleDataChanged is not called when data is loaded', function(assert) {
        // arrange
        const dataSource = this.createDataSource({
            pageSize: 3
        });
        const handleDataChangedSpy = sinon.spy(dataSource._virtualScrollController, 'handleDataChanged');

        try {
            // act
            dataSource.load();

            // assert
            assert.notOk(handleDataChangedSpy.called, 'not called');
        } finally {
            handleDataChangedSpy.restore();
        }
    });

    QUnit.test('VirtualScrollController.load is not called when data is loaded', function(assert) {
        // arrange
        const dataSource = this.createDataSource({
            pageSize: 3
        });
        const loadSpy = sinon.spy(dataSource._virtualScrollController, 'load');

        try {
            // act
            dataSource.load();

            // assert
            assert.notOk(loadSpy.called, 'not called');
        } finally {
            loadSpy.restore();
        }
    });

    QUnit.test('resetPagesCache is not called when row is expanded', function(assert) {
        // arrange
        const dataSource = this.createDataSource({
            pageSize: 3,
            group: 't'
        });
        const resetPagesCacheSpy = sinon.spy(dataSource, 'resetPagesCache');

        try {
            // act
            dataSource.changeRowExpand([1]);

            // assert
            assert.notOk(resetPagesCacheSpy.called, 'not called');
        } finally {
            resetPagesCacheSpy.restore();
        }
    });

    QUnit.test('VirtualScrollController.getDelayDeferred is not called on reload', function(assert) {
        // arrange
        const dataSource = this.createDataSource({
            pageSize: 3
        });
        const getDelayDeferredSpy = sinon.spy(dataSource._virtualScrollController, 'getDelayDeferred');

        try {
            // act
            dataSource.reload();

            // assert
            assert.notOk(getDelayDeferredSpy.called, 'not called');
        } finally {
            getDelayDeferredSpy.restore();
        }
    });

    QUnit.test('VirtualScrollController.reset is not called on refresh', function(assert) {
        // arrange
        const dataSource = this.createDataSource({
            pageSize: 3
        });
        const resetSpy = sinon.spy(dataSource._virtualScrollController, 'reset');

        try {
            // act
            dataSource.refresh({ storeLoadOptions: {} }, { reload: true });

            // assert
            assert.notOk(resetSpy.called, 'not called');
        } finally {
            resetSpy.restore();
        }
    });

    QUnit.test('loadingChanged should not fire when loading is failed', function(assert) {
        // arrange
        const dataSource = createDataSource({
            store: new CustomStore({
                key: 'id',
                load: function() {
                    return $.Deferred().reject().promise();
                }
            }),
            scrolling: {
                legacyMode: false,
                mode: 'virtual',
                rowRenderingMode: 'virtual'
            },
        });
        const fireSpy = sinon.spy(dataSource.loadingChanged, 'fire');

        try {
            // act
            dataSource.load();

            // assert
            assert.equal(fireSpy.callCount, 2, 'called twice');
        } finally {
            fireSpy.restore();
        }
    });

    QUnit.test('dataSource adapter should have copy of dataSource items', function(assert) {
        // arrange
        const items = [{ id: 1 }];
        const dataSource = createDataSource({
            store: [{ id: 1 }],
            scrolling: {
                legacyMode: false
            }
        });

        // act
        dataSource.load();

        // assert
        assert.notEqual(dataSource.items(), dataSource._dataSource.items(), 'dataSourceAdapter have copy of items');
        assert.deepEqual(dataSource.items(), items, 'dataSourceAdapter items');
        assert.deepEqual(dataSource._dataSource.items(), items, 'dataSource items');
    });
});

QUnit.module('DataSource with diacritical marks', {
    beforeEach: function() {
        this.array = [
            { id: 1, city: 'izmir' },
            { id: 2, city: 'İzmi̇r' },
            { id: 3, city: 'İZMİR' }
        ];

        this.langParams = {};

        this.createDataSource = function(options) {
            return createDataSource($.extend({
                store: this.array,
                langParams: this.langParams
            }, options));
        };

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, function() {
    [true, false].forEach((remoteOperations) => {
        ['no base', 'base'].forEach((sensitivity) => {
            QUnit.test(`Filtering with remoteOperations = ${remoteOperations}, locale = 'en-US' and sensitivity=${sensitivity}`, function(assert) {
                // arrange
                this.langParams.collatorOptions = { sensitivity };
                this.langParams.locale = 'en-US';
                const dataSource = this.createDataSource({ remoteOperations });

                // act
                dataSource.filter(['city', '=', 'İZMİR']);
                dataSource.load();

                if(sensitivity === 'base') {
                    // assert
                    assert.strictEqual(dataSource.items().length, 3, 'item count');
                    assert.deepEqual(dataSource.items()[0], { id: 1, city: 'izmir' }, 'first item');
                    assert.deepEqual(dataSource.items()[1], { id: 2, city: 'İzmi̇r' }, 'second item');
                    assert.deepEqual(dataSource.items()[2], { id: 3, city: 'İZMİR' }, 'third item');
                } else {
                    // assert
                    assert.strictEqual(dataSource.items().length, 2, 'item count');
                    assert.deepEqual(dataSource.items()[0], { id: 2, city: 'İzmi̇r' }, 'first item');
                    assert.deepEqual(dataSource.items()[1], { id: 3, city: 'İZMİR' }, 'second item');
                }
            });

            QUnit.test(`Filtering with remoteOperations = ${remoteOperations}, locale = 'tr' and sensitivity=${sensitivity}`, function(assert) {
                // arrange
                this.langParams.collatorOptions = { sensitivity };
                this.langParams.locale = 'tr';
                const dataSource = this.createDataSource({ remoteOperations });

                // act
                dataSource.filter(['city', '=', 'İZMİR']);
                dataSource.load();

                if(sensitivity === 'base') {
                    // assert
                    assert.strictEqual(dataSource.items().length, 3, 'item count');
                    assert.deepEqual(dataSource.items()[0], { id: 1, city: 'izmir' }, 'first item');
                    assert.deepEqual(dataSource.items()[1], { id: 2, city: 'İzmi̇r' }, 'second item');
                    assert.deepEqual(dataSource.items()[2], { id: 3, city: 'İZMİR' }, 'third item');
                } else {
                    // assert
                    assert.strictEqual(dataSource.items().length, 2, 'item count');
                    assert.deepEqual(dataSource.items()[0], { id: 1, city: 'izmir' }, 'first item');
                    assert.deepEqual(dataSource.items()[1], { id: 3, city: 'İZMİR' }, 'second item');
                }
            });
        });

        QUnit.test(`Sorting with remoteOperations = ${remoteOperations} and locale = 'en-US'`, function(assert) {
            // arrange
            this.langParams.locale = 'en-US';
            this.langParams.collatorOptions = { caseFirst: 'upper' };
            const dataSource = this.createDataSource({ remoteOperations });

            // act
            dataSource.sort('city');
            dataSource.load();

            // assert
            assert.deepEqual(dataSource.items()[0], { id: 1, city: 'izmir' }, 'first item');
            assert.deepEqual(dataSource.items()[1], { id: 3, city: 'İZMİR' }, 'second item');
            assert.deepEqual(dataSource.items()[2], { id: 2, city: 'İzmi̇r' }, 'third item');
        });

        QUnit.test(`Sorting with remoteOperations = ${remoteOperations} and locale = 'tr'`, function(assert) {
            // arrange
            this.langParams.locale = 'tr';
            this.langParams.collatorOptions = { caseFirst: 'upper' };
            const dataSource = this.createDataSource({ remoteOperations });

            // act
            dataSource.sort('city');
            dataSource.load();

            // assert
            assert.deepEqual(dataSource.items()[0], { id: 3, city: 'İZMİR' }, 'first item');
            assert.deepEqual(dataSource.items()[1], { id: 1, city: 'izmir' }, 'second item');
            assert.deepEqual(dataSource.items()[2], { id: 2, city: 'İzmi̇r' }, 'third item');
        });
    });
});
