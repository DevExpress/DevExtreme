import $ from 'jquery';
import { noop } from 'core/utils/common';
import typeUtils from 'core/utils/type';
import executeAsyncMock from '../../helpers/executeAsyncMock.js';
import ajaxMock from '../../helpers/ajaxMock.js';
import { DataSource } from 'common/data/data_source/data_source';
import Store from 'data/abstract_store';
import ArrayStore from 'common/data/array_store';
import ODataStore from 'common/data/odata/store';
import AggregateCalculator from '__internal/grids/data_grid/m_aggregate_calculator';
import LocalStore from 'common/data/local_store';

const TEN_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const moduleConfig = {
    beforeEach: function() {
        executeAsyncMock.setup();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
    }
};


QUnit.module('loadSingle');
QUnit.test('loadSingle call doesn\'t affect to state', function(assert) {
    const source = new DataSource(TEN_NUMBERS);
    let changedFired = false;
    let loadingChangedFired = false;

    source.on('changed', function() { changedFired = true; });
    source.on('loadingChanged', function() { loadingChangedFired = true; });

    source.loadSingle('this', 2).done(function(data) {
        assert.ok(!changedFired);
        assert.ok(!loadingChangedFired);
        assert.deepEqual(source.items(), []);
    });
});

QUnit.test('lookup with key specified', function(assert) {
    new DataSource({
        store: {
            type: 'array',
            data: [
                { a: '1', i: 1 },
                { a: '2', i: 2 }
            ],
            key: 'a'
        },
        filter: ['a', '<>', 1]
    }).loadSingle('a', '1').done(function(r) {
        assert.deepEqual(r, { a: '1', i: 1 });
    });
});

QUnit.test('with no key specified', function(assert) {
    assert.expect(3);

    const source = new DataSource({
        store: [
            { a: '1', i: 1 },
            { a: '2', i: 2 },
            { a: '2', i: 3 }
        ],
        filter: ['a', '<>', 1],
        sort: { field: 'i', desc: true }
    });

    source.pageIndex(1);

    $.when(
        source.loadSingle('a', '2').done(function(r) {
            assert.ok(r, 'should ignore skip option');
            assert.deepEqual(r, { a: '2', i: 3 }, 'shouldn\'t ignore sort option');
        }),

        source.loadSingle('a', '1').fail(function() {
            assert.ok(true, 'shouldn\'t retrieve filtered values');
        })
    );
});

QUnit.test('with filter as a function (T686655)', function(assert) {
    assert.expect(2);

    const source = new DataSource({
        store: [
            { a: '1' },
            { a: '2' }
        ],
        filter: (itemData) => itemData.a !== '2'
    });

    source.loadSingle('a', '1').done((r) => {
        assert.equal(r.a, '1');
    });

    source.loadSingle('a', '2').fail(() => {
        assert.ok(true, 'shouldn\'t retrieve filtered values');
    });
});

QUnit.test('use key if no propName specified', function(assert) {
    new DataSource({
        store: {
            type: 'array',
            data: [{ a: 1 }],
            key: 'a'
        }
    }).loadSingle(1).done(function(r) {
        assert.deepEqual(r, { a: 1 }, 'should use store.key() as propName');
    });
});

QUnit.test('doesn\'t apply postProcess', function(assert) {
    new DataSource({
        store: [1],
        postProcess: function(data) {
            return [null].concat(data);
        }
    }).loadSingle('this', 1).done(function(item) {
        assert.equal(item, 1);
    });
});

QUnit.test('error handling', function(assert) {
    assert.expect(0);

    const source = new DataSource(TEN_NUMBERS);

    const failFired = $.Deferred();
    const loadErrorFired = $.Deferred();

    source.on('loadError', function() {
        loadErrorFired.resolve();
    });

    source.loadSingle(function(obj) { throw Error('forced'); }, 1)
        .fail(function() { failFired.resolve(); });

    $.when(loadErrorFired, failFired);
});

QUnit.test('error handling (with key)', function(assert) {
    assert.expect(0);

    const source = new DataSource({
        store: new (ArrayStore.inherit({
            _byKeyImpl: function() { return $.Deferred().reject(Error('forced')).promise(); }
        }))({ key: 'a', data: [] })
    });

    const failFired = $.Deferred();
    const loadErrorFired = $.Deferred();

    source.on('loadError', function() { loadErrorFired.resolve(); });
    source.loadSingle('a', 1).fail(function() { failFired.resolve(); });

    $.when(loadErrorFired, failFired);
});

QUnit.test('error handling (data item cannot be found, T283407)', function(assert) {
    assert.expect(3);

    const handleError = function(error) {
        assert.ok(error instanceof Error);
    };

    new DataSource({
        store: new ArrayStore({
            data: [{ d: 1, b: 1 }],
            key: 'd'
        }),
        onLoadError: handleError
    })
        .on('loadError', handleError)
        .loadSingle('b', 2) // forces data mining through load implementation
        .fail(handleError)
        .done(function() {
            assert.ok(false);
        });
});

QUnit.test('don\'t force byKey for CustomStore(loadMode=raw, byKey=undefined)', function(assert) {
    const done = assert.async();

    const source = new DataSource({
        load: function() {
            return [ { a: 1 }, { a: 2 } ];
        },
        loadMode: 'raw'
    });

    source.loadSingle('a', 2).done(function(item) {
        assert.equal(item.a, 2);
        done();
    });
});

QUnit.module('simple tests');
QUnit.test('initial state and load', function(assert) {
    const source = new DataSource({
        store: TEN_NUMBERS,
        pageSize: 3
    });

    assert.ok(!source.isLoaded());
    assert.deepEqual(source.items(), []);
    assert.equal(source.pageIndex(), 0);

    source.load().done(function(data, extra) {
        assert.ok(source.isLoaded());
        assert.deepEqual(source.items(), data);
        assert.deepEqual(data, [1, 2, 3]);
        assert.equal(source.totalCount(), -1);
    });
});

QUnit.test('requireTotalCount', function(assert) {
    let loadingChangedCount;
    let countCallCount;
    let enumerateCallCount;

    const createWrappedQuery = function(origQuery) {

        function dummy() {
            return this;
        }

        return {
            slice: dummy,
            count: function() {
                countCallCount++;
                return origQuery.count();
            },
            enumerate: function() {
                enumerateCallCount++;
                return origQuery.enumerate();
            }
        };
    };

    const MyStore = ArrayStore.inherit({
        createQuery: function() {
            return createWrappedQuery(this.callBase.apply(this, arguments));
        }
    });

    const source = new DataSource({
        store: new MyStore(TEN_NUMBERS),
        requireTotalCount: true
    });

    source.on('loadingChanged', function() {
        loadingChangedCount++;
    });

    loadingChangedCount = 0;
    countCallCount = 0;
    enumerateCallCount = 0;

    source.load().done(function(r, extra) {
        assert.equal(extra.totalCount, 10);
        assert.equal(source.totalCount(), 10);

        assert.equal(countCallCount, 1);
        assert.equal(enumerateCallCount, 1);
        assert.equal(loadingChangedCount, 2);
    });

});

QUnit.test('load options passed to store', function(assert) {
    new DataSource({
        store: TEN_NUMBERS,
        filter: ['this', '<', 4],
        sort: { getter: 'this', desc: true }
    })
        .load()
        .done(function(data) {
            assert.deepEqual(data, [3, 2, 1]);
        });
});

QUnit.test('map function', function(assert) {
    new DataSource({
        store: [14, 6],
        map: function(item, index) { return index + ':' + item; }
    })
        .load()
        .done(function(data) {
            assert.deepEqual(data, ['0:14', '1:6']);
        });
});

QUnit.test('map function with push to store', function(assert) {
    const done = assert.async();
    const dataSource = new DataSource({
        store: [1],
        paginate: false,
        map: function(item) { return item + 'p'; }
    });

    dataSource.load()
        .done((data) => {
            assert.deepEqual(data, ['1p']);
            dataSource.store().push([{ type: 'insert', data: 2 }]);
            dataSource.on('changed', function() {
                assert.deepEqual(dataSource.items(), ['1p', '2p']);
                done();
            });
        });
});

QUnit.test('map function + grouping', function(assert) {
    new DataSource({
        store: [{ a: 1, b: 3 }],
        group: ['a', 'b'],
        map: function(item) { return item.a * item.b; }
    })
        .load()
        .done(function(data) {
            assert.deepEqual(data, [{
                key: 1,
                items: [{
                    key: 3,
                    items: [3]
                }]
            }]);
        });
});

QUnit.test('map function + grouping with null items', function(assert) {
    new DataSource({
        store: [{ a: 1, b: 3 }],
        group: ['a', 'b'],
        map: function(item) { return item.a * item.b; },
        onCustomizeLoadResult: function(loadResult) {
            loadResult.data[0].items[0].items = null;
        }
    })
        .load()
        .done(function(data) {
            assert.deepEqual(data, [{
                key: 1,
                items: [{
                    key: 3,
                    items: null
                }]
            }]);
        });
});

QUnit.test('map function + grouping + aggregating', function(assert) {
    new DataSource({
        store: [{ a: 1, b: 3 }],
        group: ['a', 'b'],
        map: function(item) { return item.a * item.b; },
        onCustomizeLoadResult: function(loadResult) {
            const calculator = new AggregateCalculator({
                data: loadResult.data,
                groupAggregates: [
                    { aggregator: 'count' }
                ],
                groupLevel: 2
            });

            calculator.calculate();
        }
    })
        .load()
        .done(function(data) {
            assert.deepEqual(data, [{
                key: 1,
                aggregates: [1],
                items: [{
                    key: 3,
                    aggregates: [1],
                    items: [3]
                }]
            }]);
        });
});

QUnit.test('postProcess function', function(assert) {
    new DataSource({
        store: [1],
        postProcess: function(list) {
            return list.concat(['extra']);
        }
    })
        .load()
        .done(function(data) {
            assert.deepEqual(data, [1, 'extra']);
        });
});

QUnit.test('page index change', function(assert) {
    const source = new DataSource({
        store: TEN_NUMBERS,
        pageIndex: 1,
        pageSize: 3
    });

    source.load().done(function() {
        assert.equal(source.pageIndex(), 1);
        assert.deepEqual(source.items(), [4, 5, 6]);

        source.on('changed', function() {
            assert.equal(source.pageIndex(), 2);
            assert.deepEqual(source.items(), [7, 8, 9]);
        });

        source.pageIndex(2);
        source.load();
    });

});

QUnit.test('save custom field of groups after mapping', function(assert) {
    const source = new DataSource({
        store: [
            {
                'key': 1,
                'field': 'value 1'
            },
            {
                'key': 1,
                'field': 'value 2'
            }
        ],
        onCustomizeLoadResult: function(loadResult) {
            loadResult.data[0].customField = true;
        },
        map: item => {
            return { ...item };
        },
        group: 'key'
    });

    source.load();

    assert.ok(source.items()[0].customField);
});

QUnit.test('paginate option', function(assert) {
    const data = [];

    for(let i = 0; i < 100; i++) {
        data.push(i);
    }

    const store = new ArrayStore(data);
    const source = new DataSource({
        store: store,
        paginate: false
    });

    assert.ok(source.isLastPage());
    source.load().done(function() {
        assert.equal(source.items().length, 100);
    });
});

QUnit.test('paginate method', function(assert) {
    const source = new DataSource({
        store: TEN_NUMBERS,
        pageSize: 3
    });

    source.pageIndex(1);

    assert.ok(source.paginate());
    assert.ok(!source.isLastPage());

    source.paginate(true);

    assert.ok(!source.isLastPage());
    assert.equal(source.pageIndex(), 1);

    source.paginate(false);

    assert.ok(source.isLastPage());
    assert.equal(source.pageIndex(), 0);

    source.paginate(true);
    assert.ok(!source.isLastPage());
});

QUnit.test('reload', function(assert) {
    let fn;

    const source = new DataSource({
        load: function(options) {
            fn(options);
            return TEN_NUMBERS;
        }
    });

    fn = function(options) {
        options.userData.foo = 'bar';
    };

    source.load();

    assert.ok(source.isLoaded());
    assert.ok(source.isLastPage());

    fn = function(options) {
        assert.ok(!source.isLoaded());
        assert.ok(!source.isLastPage());
        assert.equal(source.totalCount(), -1);
        assert.equal(source.items().length, 0);
        assert.ok($.isEmptyObject(options.userData));
    };

    source.reload();
});

QUnit.test('reload must clean cache of LocalStore when reload', function(assert) {
    const done = assert.async();
    const clock = sinon.useFakeTimers();
    const storeName = 'dx-local-store';
    const firstData = [{ id: 1, name: '1' }];
    const source = new DataSource({
        store: new LocalStore({
            key: 'id',
            name: storeName,
            data: firstData
        })
    });
    const store = source.store();

    const clearCacheSpy = sinon.spy();
    const clearCacheOrig = store._clearCache.bind(store);

    store._clearCache = () => {
        clearCacheSpy();
        clearCacheOrig();
    };

    assert.deepEqual(source.store().createQuery().toArray(), firstData);

    const nextData = [
        { id: 1, name: '1' },
        { id: 2, name: '2' }
    ];

    localStorage.setItem(
        `dx-data-localStore-${storeName}`,
        JSON.stringify(nextData)
    );

    source.reload().done((r) => {
        assert.equal(clearCacheSpy.callCount, 1);
        assert.deepEqual(source.store().createQuery().toArray(), nextData);

        clock.restore();
        done();
    });
});


QUnit.test('reload invalidates CustomStore\'s raw data cache', function(assert) {
    const done = assert.async();
    let loadImpl;

    const source = new DataSource({
        load: function() {
            return loadImpl();
        },
        loadMode: 'raw',
        cacheRawData: true
    });

    loadImpl = function() { return [ 1 ]; };
    source.load().done(function(data1) {
        assert.equal(data1[0], 1);

        loadImpl = function() { return [ 2 ]; };
        source.reload().done(function(data2) {
            assert.equal(data2[0], 2);
            done();
        });
    });
});

QUnit.test('when grouped then not paginating by default', function(assert) {
    const data = [];

    for(let i = 0; i < 100; i++) {
        data.push({ i: i });
    }

    const store = new ArrayStore(data);
    const source = new DataSource({
        store: store,
        group: 'i'
    });

    source.load().done(function() {
        assert.equal(source.items().length, 100);
    });
});

QUnit.test('load failure', function(assert) {
    const source = new DataSource({
        store: [1, 2, 3],
        select: function() {
            throw Error('forced');
        }
    });

    const failFired = $.Deferred();
    const callbackFired = $.Deferred();

    source.on('loadError', function(error) {
        assert.equal(error.message, 'forced');
        assert.ok(!source.isLoading());

        callbackFired.resolve();
    });

    source.load().fail(function(error) {
        assert.equal(error.message, 'forced');
        failFired.resolve();
    });

    $.when(callbackFired, failFired);
});

QUnit.test('load in disposed state (B230839, B230785)', function(assert) {
    assert.expect(0);

    const source = new DataSource();
    source.dispose();

    source.load();
});

QUnit.test('store load callback fired in disposed state', function(assert) {
    assert.expect(0);

    const loaded = $.Deferred();

    const storeClass = Store.inherit({
        _loadImpl: function() {
            return loaded.promise();
        }
    });

    const store = new storeClass();

    const source = new DataSource(store);

    source.load();
    source.dispose();
    loaded.resolve([1, 2, 3]);
});

QUnit.test('store returned not an array', function(assert) {
    const storeClass = Store.inherit({
        _loadImpl: function() {
            return $.Deferred().resolve(1);
        }
    });

    const store = new storeClass();

    new DataSource(store).load().done(function(r) {
        assert.deepEqual(r, [1]);
    });
});

QUnit.test('dataSource knows key of its store, and knows store as well', function(assert) {
    const store = new ArrayStore({
        key: 'id'
    });
    const source = new DataSource(store);
    assert.equal(source.key(), 'id');
    assert.equal(source.store(), store);
});

QUnit.test('isLoading and loadingChanged', function(assert) {
    const MyStore = Store.inherit({
        load: function() {
            return this.testDeferred.promise();
        }
    });

    const store = new MyStore();
    const ds = new DataSource(store);
    const d1 = $.Deferred();
    const d2 = $.Deferred();
    let changeCount = 0;

    ds.on('loadingChanged', function() {
        changeCount++;
    });

    assert.ok(!ds.isLoading());

    store.testDeferred = d1;
    ds.load().always(function() {
        assert.equal(changeCount, 1);
        assert.ok(ds.isLoading()); // is still loading

        d2.reject();
    });

    store.testDeferred = d2;
    ds.load().always(function() {
        assert.equal(changeCount, 2);
        assert.ok(!ds.isLoading());
    });

    assert.equal(changeCount, 1);
    assert.ok(ds.isLoading());

    d1.resolve([]);
});

QUnit.test('beginLoading and endLoading', function(assert) {
    const ds = new DataSource([]);
    let changeCount = 0;

    ds.on('loadingChanged', function() {
        changeCount++;
    });

    ds.beginLoading();
    ds.beginLoading();

    assert.ok(ds.isLoading(), 'isLoading');
    assert.equal(changeCount, 1, 'loadingChanged is called once');

    ds.endLoading();

    assert.ok(ds.isLoading(), 'isLoading');
    assert.equal(changeCount, 1, 'loadingChanged is called once');

    ds.endLoading();

    assert.ok(!ds.isLoading(), 'not isLoading');
    assert.equal(changeCount, 2, 'loadingChanged is called twice');
});

QUnit.test('beginLoading and endLoading with load', function(assert) {
    const MyStore = Store.inherit({
        load: function() {
            return this.testDeferred.promise();
        }
    });

    const store = new MyStore();
    const ds = new DataSource(store);
    const testDeferred = $.Deferred();
    let changeCount = 0;

    ds.on('loadingChanged', function() {
        changeCount++;
    });

    ds.beginLoading();

    assert.ok(ds.isLoading(), 'isLoading');
    assert.equal(changeCount, 1, 'loadingChanged is called once');

    store.testDeferred = testDeferred;

    ds.load().always(function() {
        assert.ok(ds.isLoading(), 'isLoading');
        assert.equal(changeCount, 1, 'loadingChanged is called once');
        ds.endLoading();
    });

    testDeferred.resolve([]);

    assert.ok(!ds.isLoading(), 'not isLoading');
    assert.equal(changeCount, 2, 'loadingChanged is called twice');
});

QUnit.test('isLoading is false inside when changed fires', function(assert) {
    const source = new DataSource(TEN_NUMBERS);

    source.on('changed', function() {
        assert.ok(!source.isLoading());
    });

    source.load();
});

QUnit.test('customizeStoreLoadOptions', function(assert) {
    const source = new DataSource(TEN_NUMBERS);

    source.on('customizeStoreLoadOptions', function(options) {
        options.storeLoadOptions.filter = ['this', '=', 1];
    });

    source.load().done(function(data) {
        assert.deepEqual(data, [1]);
        assert.ok(!source.loadOptions().filter);
    });
});

QUnit.test('customizeStoreLoadOptions cache', function(assert) {
    const source = new DataSource(TEN_NUMBERS);
    let loadingCount = 0;
    let changedCount = 0;

    source.store().on('loading', function() {
        loadingCount++;
    });
    source.on('changed', function(options) {
        changedCount++;
    });

    source.load().done(function(data) {
        assert.deepEqual(data, TEN_NUMBERS);
        assert.deepEqual(source.items(), TEN_NUMBERS);
        assert.equal(loadingCount, 1);
        assert.equal(changedCount, 1);
    });

    source.on('customizeStoreLoadOptions', function(options) {
        options.data = [1, 2];
    });

    source.load().done(function(data) {
        assert.deepEqual(data, [1, 2]);
        assert.deepEqual(source.items(), [1, 2]);
        assert.equal(loadingCount, 1, 'loading is not raised');
        assert.equal(changedCount, 2, 'changed is raised');
    });
});

QUnit.test('load promise should be rejected if DataSource is disposed while loading data (T541870)', function(assert) {
    const d = $.Deferred();
    const source = new DataSource({
        load: function() {
            return d.promise();
        }
    });

    const loadPromise = source.load().done(function(data) {
        assert.deepEqual(data, TEN_NUMBERS);
    });

    assert.equal(loadPromise.state(), 'pending');

    source.dispose();

    d.resolve();

    assert.equal(loadPromise.state(), 'rejected');
    assert.ok(typeUtils.isEmptyObject(source._operationManager._deferreds));
});

QUnit.test('customizeLoadResult', function(assert) {
    const source = new DataSource({
        map: function(i) {
            return String(i);
        },
        postProcess: function(data) {
            return $.extend(data, { extended: true });
        },
        store: [42]
    });

    source.on('customizeLoadResult', function(args) {
        assert.ok(!('foo' in args.data));
        assert.equal(args.data[0], 42);

        args.data = [24];
    });

    source.load().done(function(data, extra) {
        assert.equal(data[0], '24');
        assert.equal(data.extended, true);
    });
});

// T975035
QUnit.test('parameter should be passed from customizeStoreLoadOptions to customizeLoadResult if call load inside customizeStoreLoadOptions', function(assert) {
    const source = new DataSource(TEN_NUMBERS);
    const calls = [];

    source.on('customizeStoreLoadOptions', function(options) {
        const isFirstCall = !calls.length;
        options.parameter = true;
        calls.push(['customizeStoreLoadOptions', options.operationId]);
        if(isFirstCall) {
            this.load();
        }
    });

    source.on('customizeLoadResult', function(options) {
        calls.push(['customizeLoadResult', options.operationId]);
        assert.ok(options.parameter, 'parameter is passed from customizeStoreLoadOptions');
    });

    source.load();

    assert.deepEqual(calls, [
        ['customizeStoreLoadOptions', 0],
        ['customizeStoreLoadOptions', 1],
        ['customizeLoadResult', 1],
        ['customizeLoadResult', 0]
    ], 'calls order is correct');
});

QUnit.test('cancel works', function(assert) {
    assert.expect(4);

    const source = new DataSource({
        load: function() {
            return $.Deferred().promise();
        }
    });

    const promise = source.load()
        .fail(handleFail)
        .done(handleDone);

    function handleFail() {
        assert.ok(true, 'Should reach this point');
    }

    function handleDone() {
        assert.ok(false, 'Shouldn\'t reach this point');
    }

    assert.ok(source.isLoading());

    source.cancel(promise.operationId);

    assert.ok(!source.isLoaded());
    assert.ok(!source.isLoading());
});

QUnit.test('cancelAll works', function(assert) {
    const source = new DataSource({
        load: function() {
            return $.Deferred().promise();
        }
    });

    const promise1 = source.load();
    const promise2 = source.load();

    source.cancelAll();

    assert.ok(!source.isLoading());
    assert.equal(promise1.state(), 'rejected', 'promise1 is rejected');
    assert.equal(promise2.state(), 'rejected', 'promise2 is rejected');
});

QUnit.test('canceling on customizeStoreLoadOptions', function(assert) {
    const source = new DataSource({
        load: mustNotReach
    });

    function mustNotReach() {
        assert.ok(false, 'Shouldn\'t reach this point');
    }

    function handleFail() {
        assert.ok(true, 'Should reach this point');
    }

    function handleDone() {
        mustNotReach();
    }

    source.on('customizeStoreLoadOptions', function(operation) {
        source.cancel(operation.operationId);
    });

    source.load()
        .fail(handleFail)
        .done(handleDone);
});

QUnit.test('cancel event flow', function(assert) {
    const loadingChangedLog = [];
    const ds = new DataSource({
        load: function() {
            return $.Deferred().promise();
        }
    });

    function mustNotReach() {
        assert.ok(false, 'Shouldn\'t reach this point');
    }

    ds.on('changed', function() {
        mustNotReach();
    });

    ds.on('loadError', function() {
        mustNotReach();
    });

    ds.on('loadingChanged', function(state) {
        loadingChangedLog.push(state);
    });

    const promise = ds.load()
        .always(function(state) {
            assert.equal(state, 'canceled');
        });

    ds.cancel(promise.operationId);

    assert.deepEqual(loadingChangedLog, [true, false]);
});

QUnit.test('search API, default impl, no selector', function(assert) {
    const store = new ArrayStore(['a', 'b']);

    const source = new DataSource(store);
    source.searchValue('a');

    source.load().done(function(r) {
        assert.equal(r.length, 1);
    });
});

QUnit.test('search API, default impl, single selector', function(assert) {
    const store = new ArrayStore([
        { text: 'abc' },
        { text: 'xyz' }
    ]);

    const source = new DataSource(store);
    source.searchExpr('text');
    source.searchValue('a');

    source.load().done(function(r) {
        assert.equal(r.length, 1);
        assert.equal(r[0].text, 'abc');
    });
});

QUnit.test('search API, default impl, multi selectors, custom op', function(assert) {
    const store = new ArrayStore([
        { text: 'abc', description: 'xyz' },
        { text: 'xyz', description: 'abc' },
        { text: 'xyz', description: 'xyz' }
    ]);

    const source = new DataSource(store);
    source.searchExpr('text', 'description');
    source.searchOperation('=');
    source.searchValue('abc');

    source.load().done(function(r) {
        assert.equal(r.length, 2);
    });
});

QUnit.test('search API, default impl, complex selector', function(assert) {
    const store = new ArrayStore([
        { date: new Date(1984, 5, 14) }
    ]);

    const source = new DataSource(store);
    source.searchExpr(function(item) { return item.date.getFullYear(); });
    source.searchOperation('=');
    source.searchValue(1984);

    source.load().done(function(r) {
        assert.equal(r.length, 1);
    });
});

QUnit.test('search API, custom impl', function(assert) {
    const MyStore = Store.inherit({

        ctor: function(o) {
            this.callBase(o);
            this._useDefaultSearch = false;
        },

        _loadImpl: function(options) {
            assert.ok(!options.filter);

            assert.equal(options.searchExpr, 'expr');
            assert.equal(options.searchValue, 'test text');
            assert.equal(options.searchOperation, 'operation');

            return $.Deferred(); // api requires
        }

    });

    const source = new DataSource(new MyStore());
    source.searchOperation('operation');
    source.searchValue('test text');
    source.searchExpr('expr');

    source.load();
});

QUnit.test('search API, configuration from ctor', function(assert) {
    const source = new DataSource({
        searchExpr: 'abc',
        searchOperation: 'xyz',
        searchValue: 0,
        load: noop
    });

    assert.equal(source.searchExpr(), 'abc');
    assert.equal(source.searchOperation(), 'xyz');
    assert.strictEqual(source.searchValue(), 0);
});

QUnit.test('search API, useDefaultSearch', function(assert) {
    assert.expect(8);

    const sourceWithCustomSearch = new DataSource({
        useDefaultSearch: false,

        load: function(options) {
            assert.ok(!options.filter);

            assert.equal(options.searchExpr, 'expr');
            assert.equal(options.searchValue, 'test text');
            assert.equal(options.searchOperation, 'operation');

            return $.Deferred().promise();
        }
    });

    const sourceWithDefaultSearch = new DataSource({
        useDefaultSearch: true,

        load: function(options) {
            assert.deepEqual(options.filter, [['expr', 'operation', 'test text']]);

            assert.ok(!options.searchExpr);
            assert.ok(!options.searchValue);
            assert.ok(!options.searchOperation);

            return $.Deferred().promise();
        }
    });

    sourceWithCustomSearch.searchExpr('expr');
    sourceWithCustomSearch.searchValue('test text');
    sourceWithCustomSearch.searchOperation('operation');

    sourceWithDefaultSearch.searchExpr('expr');
    sourceWithDefaultSearch.searchValue('test text');
    sourceWithDefaultSearch.searchOperation('operation');

    $.when(
        sourceWithCustomSearch.load(),
        sourceWithDefaultSearch.load()
    ).fail(function() {
        assert.ok(false, 'Shouldn\'t reach this point');
    });
});

QUnit.test('events API, changed', function(assert) {
    const cl = {};

    const source = new DataSource({
        store: [1, 2, 3],
        onChanged: function() {
            cl.onChanged_option = true;
        }
    });

    source.on('changed', function() {
        cl.on_changed_callback = true;
    });


    source.load().done(function(r) {
        assert.deepEqual(r, [1, 2, 3]);
        assert.deepEqual(cl, {
            onChanged_option: true,
            on_changed_callback: true
        });
    });
});

QUnit.test('events API, loadingChanged', function(assert) {
    const cl = {
        onLoadingChanged_option: [],
        on_loadingChanged_callback: []
    };
    const source = new DataSource({
        store: [1, 2, 3],
        onLoadingChanged: function(isLoading) {
            cl.onLoadingChanged_option.push(isLoading);
        }
    });

    source.on('loadingChanged', function(isLoading) {
        cl.on_loadingChanged_callback.push(isLoading);
    });


    source.load().done(function(r) {
        assert.deepEqual(r, [1, 2, 3]);
        assert.deepEqual(cl, {
            onLoadingChanged_option: [true, false],
            on_loadingChanged_callback: [true, false]
        });
    });
});

QUnit.test('events API, loadError', function(assert) {
    const cl = {};

    const source = new DataSource({
        store: [1, 2, 3],
        select: function() {
            throw new Error('Forced');
        },
        onLoadError: function(e) {
            cl.onLoadError_option = e.message;
        }
    });

    source.on('loadError', function(e) {
        cl.on_loadError_callback = e.message;
    });


    source.load().fail(function(e) {
        assert.equal(e.message, 'Forced');
        assert.deepEqual(cl, {
            onLoadError_option: 'Forced',
            on_loadError_callback: 'Forced'
        });
    });
});

QUnit.test('events API, customizeLoadResult', function(assert) {
    const cl = {};

    const source = new DataSource({
        store: [1, 2, 3],
        onCustomizeLoadResult: function(loadResult) {
            cl.onCustomizeLoadResult_option = loadResult;

            delete cl.onCustomizeLoadResult_option.operationId;
            loadResult.foo = 1;
        }
    });

    source.on('customizeLoadResult', function(loadResult) {
        cl.on_customizeLoadResult_callback = loadResult;

        delete cl.on_customizeLoadResult_callback.operationId;
        loadResult.bar = 2;
    });


    source.load().done(function(r) {
        const expected = {
            data: [1, 2, 3],
            extra: undefined,
            foo: 1,
            bar: 2,

            storeLoadOptions: {
                skip: 0,
                take: 20,
                userData: {}
            }
        };

        assert.deepEqual(r, [1, 2, 3]);
        assert.deepEqual(cl, {
            onCustomizeLoadResult_option: expected,
            on_customizeLoadResult_callback: expected
        });
    });
});

QUnit.test('events API, customizeStoreLoadOptions', function(assert) {
    const cl = {};
    const source = new DataSource({
        store: [1, 2, 3],
        onCustomizeStoreLoadOptions: function(loadOptions) {
            cl.onCustomizeStoreLoadOptions_option = loadOptions;
            delete cl.onCustomizeStoreLoadOptions_option.operationId;
        }
    });

    source.on('customizeStoreLoadOptions', function(loadOptions) {
        cl.on_customizeStoreLoadOptions_callback = loadOptions;
        delete cl.onCustomizeStoreLoadOptions_option.operationId;
    });


    source.load().done(function(r) {
        const expected = {
            storeLoadOptions: {
                skip: 0,
                take: 20,
                userData: {}
            }
        };

        assert.deepEqual(r, [1, 2, 3]);
        assert.deepEqual(cl, {
            onCustomizeStoreLoadOptions_option: expected,
            on_customizeStoreLoadOptions_callback: expected
        });
    });
});

QUnit.test('dispose unsubscribes events', function(assert) {
    const func = function() { };
    const source = new DataSource({
        store: [1, 2, 3],

        onChanged: func,
        onLoadError: func,
        onLoadingChanged: func,
        onCustomizeLoadResult: func,
        onCustomizeStoreLoadOptions: func
    });

    source.on('changed', func);
    source.on('loadError', func);
    source.on('loadingChanged', func);
    source.on('customizeLoadResult', func);
    source.on('customizeStoreLoadOptions', func);

    let events = source._eventsStrategy._events;
    assert.ok(events['changed'].has(func));
    assert.ok(events['loadError'].has(func));
    assert.ok(events['loadingChanged'].has(func));
    assert.ok(events['customizeLoadResult'].has(func));
    assert.ok(events['customizeStoreLoadOptions'].has(func));

    source.dispose();

    events = source._eventsStrategy._events;
    assert.ok(!events['changed'].has());
    assert.ok(!events['loadError'].has());
    assert.ok(!events['loadingChanged'].has());
    assert.ok(!events['customizeLoadResult'].has());
    assert.ok(!events['customizeStoreLoadOptions'].has());
});

QUnit.test('items should be deleted on dataSource disposing(T1045202)', function(assert) {
    const source = new DataSource({
        store: TEN_NUMBERS,
    });
    source.load().done(() => {
        const items = source.items();
        assert.deepEqual(items, TEN_NUMBERS);

        source.dispose();
        assert.deepEqual(items, TEN_NUMBERS);
        assert.equal(source.items(), undefined);
    });
});

QUnit.test('_dalayedLoadTask should be deleted on dataSource disposing(T1045202)', function(assert) {
    this.clock = sinon.useFakeTimers();
    const source = new DataSource({
        store: TEN_NUMBERS,
    });

    source.on('customizeStoreLoadOptions', function(options) {
        options.delay = 5;
    });

    source.load();
    this.clock.tick(4);

    assert.notEqual(source._delayedLoadTask, undefined);
    source.dispose();
    assert.equal(source._delayedLoadTask, undefined);

    this.clock.restore();
});

QUnit.module('Changing store load options', moduleConfig);

QUnit.test('sort', function(assert) {
    const data = [
        { id: 1 },
        { id: 2 },
        { id: 3 }
    ];

    const source = new DataSource({
        store: data,
        map: function(i) { return i.id; }
    });

    source.sort('a');
    assert.equal(source.sort(), 'a');

    source.sort('a', 'b');
    assert.deepEqual(source.sort(), ['a', 'b']);

    source.sort({ field: 'id', desc: true });
    assert.deepEqual(source.sort(), { field: 'id', desc: true });

    source.load().done(function(r) {
        assert.deepEqual(r, [3, 2, 1]);
    });
});

QUnit.test('filter', function(assert) {
    const data = [
        { id: 1 },
        { id: 2 }
    ];

    const source = new DataSource({
        store: data,
        map: function(i) { return i.id; }
    });

    function fn1() { }

    source.filter('id', '>', 1);
    assert.deepEqual(source.filter(), ['id', '>', 1]);

    source.filter(fn1);
    assert.strictEqual(source.filter(), fn1);

    source.filter(['id', '<', 2]);
    assert.deepEqual(source.filter(), ['id', '<', 2]);

    source.load().done(function(r) {
        assert.deepEqual(r, [1]);
    });
});

QUnit.test('filter with langParams', function(assert) {
    const data = [
        { id: 'istanbul' },
        { id: 'İstanbul' },
        { id: 'izmir' },
        { id: 'İzmir' },
        { id: 'İZMİR' },
        { id: 'Iğdır' },
        { id: 'ığdır' },
        { id: 'YASİN' },
        { id: 'Québec' },
        { id: 'quebec' },
        { id: 'Paris' },
    ];

    let source = new DataSource({
        store: data,
        langParams: {
            locale: 'tr',
            collatorOptions: {
                caseFirst: 'upper',
            }
        },
        sort: ['id'],
    });

    source.filter('id', 'contains', 'is');

    source.load().done(function(r) {
        assert.deepEqual(r, [
            { 'id': 'İstanbul' },
            { 'id': 'istanbul' },
            { 'id': 'Paris' }
        ]);
    });

    source = new DataSource({
        store: data,
        langParams: {
            collatorOptions: {
                sensitivity: 'base'
            }
        }
    });

    source.filter('id', 'contains', 'que');

    source.load().done(function(r) {
        assert.deepEqual(r, [
            { 'id': 'Québec' },
            { 'id': 'quebec' },
        ]);
    });
});

QUnit.test('group', function(assert) {
    const data = [
        { g: 1 },
        { g: 2 },
        { g: 1 }
    ];

    const source = new DataSource({
        store: data
    });

    source.group('a');
    assert.equal(source.group(), 'a');

    source.group('a', 'b');
    assert.deepEqual(source.group(), ['a', 'b']);

    source.group('g');
    source.load().done(function(r) {
        assert.equal(r.length, 2);
        assert.equal(r[0].key, 1);
    });
});

QUnit.test('select', function(assert) {
    const data = [
        { a: 1, b: 2 }
    ];

    const source = new DataSource({
        store: data
    });

    function fn1() { }

    source.select('a');
    assert.equal(source.select(), 'a');

    source.select('a', 'b');
    assert.deepEqual(source.select(), ['a', 'b']);

    source.select(fn1);
    assert.strictEqual(source.select(), fn1);

    source.select('b');
    source.load().done(function(r) {
        assert.equal(r[0].b, 2);
        assert.ok(!('a' in r[0]));
    });
});


QUnit.module('requireTotalCount');
QUnit.test('requireTotalCount: fail', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        responseText: {
            d: {
                results: [],
                __count: undefined
            }
        }
    });

    const source = new DataSource({
        store: new ODataStore({
            url: 'odata.org'
        }),

        requireTotalCount: true
    });

    source.load()
        .done(function() {
            assert.ok(false);
        })
        .fail(function(error) {
            assert.ok(error);
        })
        .always(function() {
            ajaxMock.clear();
        })
        .always(done);
});

QUnit.test('requireTotalCount: success', function(assert) {
    const data = [
        { a: 1, b: 2 },
        { a: 3, b: 4 }
    ];

    const source = new DataSource({
        store: data
    });

    assert.ok(!source.requireTotalCount(), 'default requireTotalCount value');

    source.requireTotalCount(true);

    assert.ok(source.requireTotalCount(), 'requireTotalCount after change option value');

    source.load().done(function(r, extra) {
        assert.ok(extra);
        assert.equal(extra.totalCount, 2);
        assert.equal(source.totalCount(), 2);
    });
});

// T401687
QUnit.test('totalCount when CustomStore with Promise/A', function(assert) {
    let loadCallback;
    const source = new DataSource({
        requireTotalCount: true,
        load: function(e) {
            return {
                then: function(callback) {
                    loadCallback = callback;
                }
            };
        }
    });


    source.load().done(function(data, extra) {
        assert.deepEqual(data, [1, 2, 3]);
        assert.ok(extra);
        assert.ok(extra.totalCount, 10);
        assert.deepEqual(source.items(), [1, 2, 3]);
        assert.equal(source.totalCount(), 10);
    });

    loadCallback({
        data: [1, 2, 3],
        totalCount: 10
    });
});

QUnit.module('Custom cases and regressions', moduleConfig);
QUnit.test('expand option for OData store', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        callback: function(bag) {
            this.responseText = { value: [bag] };
        }
    });

    new DataSource({
        store: new ODataStore({
            url: 'odata.org'
        }),

        expand: 'TestExpand'
    }).load()
        .done(function(data) {
            assert.equal(data[0].data.$expand, 'TestExpand');
        })
        .always(function() {
            ajaxMock.clear();
        })
        .always(done);
});

QUnit.test('filterToLower option equal false for OData store', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        callback: function(bag) {
            this.responseText = { value: [bag] };
        }
    });

    new DataSource({
        store: new ODataStore({
            url: 'odata.org',
            filterToLower: false
        }),
        filter: ['prop.nested.prop', 'contains', 'O']
    }).load()
        .done(function(data) {
            assert.equal(data[0].data.$filter, 'contains(prop/nested/prop,\'O\')');
        })
        .always(function() {
            ajaxMock.clear();
        })
        .always(done);
});

QUnit.test('Q456193', function(assert) {
    const store = new ArrayStore(['a', 'b', 'c']);
    const source = new DataSource(store);

    source.load().done(function(r) {
        assert.deepEqual(r, ['a', 'b', 'c']);
        assert.ok(!r[0].__key__);
    });
});

QUnit.test('paging with continuation token', function(assert) {
    function simulateServerResponse(token) {
        if(!token) {
            return {
                data: [1, 2],
                nextToken: 3
            };
        }

        if(token === 3) {
            return {
                data: [3, 4, 5],
                nextToken: 6
            };
        }

        if(token === 6) {
            return {
                data: [6]
            };
        }

        throw Error();
    }


    const source = new DataSource({
        pageSize: null, // means page size varies

        load: function(options) {
            const userData = options.userData;

            if(userData.lastPageIndex && source.pageIndex() > userData.lastPageIndex) {
                return $.Deferred().resolve([]);
            }

            userData.pageTokens = userData.pageTokens || {};

            const token = userData.pageTokens[source.pageIndex()];

            const serverResponse = simulateServerResponse(token);
            if('nextToken' in serverResponse) {
                userData.pageTokens[1 + source.pageIndex()] = serverResponse.nextToken;
            } else {
                userData.lastPageIndex = source.pageIndex();
            }
            return $.Deferred().resolve(serverResponse.data);
        }
    });

    source.load().done(function(r) {
        assert.deepEqual(r, [1, 2]);
        assert.ok(!source.isLastPage());

        source.load().done(function(r) {
            assert.deepEqual(r, [1, 2]); // page index was not changed, so same data must be returned
            assert.ok(!source.isLastPage());

            source.pageIndex(1 + source.pageIndex());
            source.load().done(function(r) {
                assert.deepEqual(r, [3, 4, 5]);
                assert.ok(!source.isLastPage());

                source.pageIndex(1 + source.pageIndex());
                source.load().done(function(r) {
                    assert.deepEqual(r, [6]);
                    assert.ok(!source.isLastPage()); // still cannot know whether is last page

                    source.pageIndex(1 + source.pageIndex());
                    source.load().done(function(r) {
                        assert.deepEqual(r, []);
                        assert.ok(source.isLastPage());
                    });
                });

            });
        });

    });
});

QUnit.test('B239452', function(assert) {
    const BENCH = {
        title: 'Bench'
    };

    const exercises = [{
        equipment: BENCH
    }];

    const ds = new DataSource({
        store: new ArrayStore(exercises),
        filter: ['equipment', BENCH]
    });

    ds.load().done(function(r) {
        assert.equal(r.length, 1);
    });
});

QUnit.test('B251658', function(assert) {
    const ds = new DataSource({
        store: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        pageSize: 5
    });
    ds.pageIndex(1);
    ds.filter('this', '<', 5);
    assert.equal(ds.pageIndex(), 0);

    ds.pageIndex(1);
    ds.filter();
    assert.equal(ds.pageIndex(), 1);
});

QUnit.test('B253895 - Data - DataSource.pageIndex is not set to 0 when search API is applied', function(assert) {
    const ds = new DataSource({
        store: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        pageSize: 5
    });
    ds.pageIndex(1);
    ds.searchExpr('this');
    assert.equal(ds.pageIndex(), 0);

    ds.pageIndex(1);
    ds.searchOperation('=');
    assert.equal(ds.pageIndex(), 0);

    ds.pageIndex(1);
    ds.searchValue('4');
    assert.equal(ds.pageIndex(), 0);

    ds.pageIndex(1);
    ds.searchExpr();
    ds.searchValue();
    ds.searchOperation();
    assert.equal(ds.pageIndex(), 1);
});

QUnit.test('paging should be disabled if ctor options is url (see T314464)', function(assert) {
    assert.ok(!new DataSource('path/to/file/with/json/content.txt').paginate());
});

QUnit.test('StoreLoadOptionAccessors: null and undefined (based on T304670)', function(assert) {
    const ds = new DataSource('');

    // setter
    assert.equal(ds.pageSize(0), undefined);
    // getter
    assert.equal(ds.pageSize(undefined), 0);
    assert.equal(ds.pageSize(null), 0);

    // setter
    assert.equal(ds.sort(null), undefined);
    assert.equal(ds.sort(undefined), undefined);
    // getter
    assert.equal(ds.sort(), undefined);

    // setter
    assert.equal(ds.pageIndex(0), undefined);
    // getter
    assert.equal(ds.pageIndex(undefined), 0);
    assert.equal(ds.pageIndex(null), 0);

    // setter
    assert.equal(ds.group(null), undefined);
    assert.equal(ds.group(undefined), undefined);
    // getter
    assert.equal(ds.group(), undefined);

    // setter
    assert.equal(ds.select(null), undefined);
    assert.equal(ds.select(undefined), undefined);
    // getter
    assert.equal(ds.select(), undefined);

    // setter
    assert.equal(ds.filter(null), undefined);
    assert.equal(ds.filter(undefined), undefined);
    // getter
    assert.equal(ds.filter(), undefined);

    // setter
    assert.equal(ds.paginate(false), undefined);
    // getter
    assert.equal(ds.pageIndex(undefined), false);
    assert.equal(ds.pageIndex(null), false);

    // setter
    assert.equal(ds.searchExpr('foo'), undefined);
    assert.equal(ds.searchExpr(undefined), undefined);
    assert.equal(ds.searchExpr(null), undefined);
    // getter
    assert.equal(ds.searchExpr(), null);

    // setter
    assert.equal(ds.searchValue('foo'), undefined);
    assert.equal(ds.searchValue(undefined), undefined);
    assert.equal(ds.searchValue(null), undefined);
    // getter
    assert.equal(ds.searchValue(), null);

    // setter
    assert.equal(ds.searchOperation('='), undefined);
    // getter
    assert.equal(ds.searchOperation(undefined), '=');
    assert.equal(ds.searchOperation(null), '=');
    assert.equal(ds.searchOperation(), '=');

    // setter
    assert.equal(ds.requireTotalCount(false), undefined);
    // getter
    assert.equal(ds.requireTotalCount(undefined), false);
    assert.equal(ds.requireTotalCount(null), false);
    assert.equal(ds.requireTotalCount(), false);
});

QUnit.module('live update', {
    beforeEach: function() {
        const loadSpy = sinon.spy();
        this.loadSpy = loadSpy;
        const itemRemove = { field: 1 };
        const itemUpdate = { field: 2 };
        this.changes = [
            { type: 'insert', data: { field: 3 } },
            { type: 'remove', key: itemRemove },
            { type: 'update', key: itemUpdate, data: { field: 4 } }
        ];

        this.createDataSource = function(options) {
            return new DataSource($.extend({
                load: function() {
                    loadSpy();
                    return [itemRemove, itemUpdate];
                }
            }, options));
        };
        this.initGroupingDataSource = function(options) {
            return new DataSource({
                load: function() {
                    return [{
                        key: 'a',
                        items: [{ key: 1, field: 1, type: 'a' }, { key: 2, field: 2, type: 'a' }]
                    }, {
                        key: 'b',
                        items: [{ key: 3, field: 3, type: 'b' }]
                    }];
                },
                key: 'key',
                group: 'type',
                pushAggregationTimeout: 0
            });
        };

        this.initPlainDataSource = function(options) {
            this.array = [
                { id: 1, text: 'test 1' },
                { id: 2, text: 'test 2' }
            ];

            return new DataSource($.extend({
                store: {
                    type: 'array',
                    data: this.array,
                    key: 'id'
                },
                paginate: false,
                pushAggregationTimeout: 0
            }, options));
        };

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, function() {
    QUnit.test('load is called when reshapeOnPush is enabled', function(assert) {
        const dataSource = this.createDataSource({
            reshapeOnPush: true,
            pushAggregationTimeout: 0
        });
        assert.equal(this.loadSpy.callCount, 0);

        dataSource.store().push(this.changes);
        assert.equal(this.loadSpy.callCount, 1);
    });

    QUnit.test('load is called with throttle when reshapeOnPush and pushAggregationTimeout are enabled', function(assert) {
        const dataSource = this.createDataSource({
            reshapeOnPush: true,
            pushAggregationTimeout: 100
        });
        assert.equal(this.loadSpy.callCount, 0);

        dataSource.store().push(this.changes);
        dataSource.store().push(this.changes);

        assert.equal(this.loadSpy.callCount, 0);
        this.clock.tick(100);
        assert.equal(this.loadSpy.callCount, 1);
    });

    QUnit.test('dataSource items are modified only after pushAggregationTimeout (T950900)', function(assert) {
        const items = [
            {
                id: 1,
                field: 1
            }
        ];
        const store = new ArrayStore({
            key: 'id',
            data: items
        });
        const dataSource = new DataSource({
            store,
            pushAggregationTimeout: 100
        });

        dataSource.store().push([
            { type: 'update', key: 1, data: { field: 2 } }
        ]);

        assert.equal(items[0].field, 1);

        this.clock.tick(100);

        assert.equal(items[0].field, 2);

        dataSource.store().push([
            { type: 'update', key: 1, data: { field: 3 } }
        ]);

        assert.equal(items[0].field, 2);

        this.clock.tick(100);

        assert.equal(items[0].field, 3);
    });

    QUnit.test('aggregation works correctly in two DataSources with common store', function(assert) {
        assert.expect(2);

        const items = [
            {
                id: 1,
                status: 'Initial value',
            }
        ];

        const store = new ArrayStore({
            key: 'id',
            data: items
        });

        const dataSourceConfig = {
            store,
            reshapeOnPush: true,
            pushAggregationTimeout: 100
        };

        const dataSource1 = new DataSource(dataSourceConfig);
        const dataSource2 = new DataSource(dataSourceConfig);

        dataSource1.on('changed', () => {
            assert.strictEqual(items[0].status, 'Changed value');
        });
        dataSource2.on('changed', () => {
            assert.strictEqual(items[0].status, 'Changed value');
        });

        store.push([
            { type: 'update', key: 1, data: { status: 'Changed value' } }
        ]);

        this.clock.tick(100);
    });

    QUnit.test('aggregation works correctly in two DataSources with different pushAggregationTimeout values and common store', function(assert) {
        const items = [
            {
                id: 1,
                status: 'Initial value'
            },
            {
                id: 2,
                status: 'Initial value'
            }
        ];

        const store = new ArrayStore({
            key: 'id',
            data: items
        });

        const dataSource1 = new DataSource({
            store,
            reshapeOnPush: true,
            pushAggregationTimeout: 100
        });

        const dataSource2 = new DataSource({
            store,
            reshapeOnPush: true,
            pushAggregationTimeout: 150
        });

        const changedSpy1 = sinon.spy();
        const changedSpy2 = sinon.spy();

        dataSource1.on('changed', changedSpy1);
        dataSource2.on('changed', changedSpy2);

        store.push([
            { type: 'update', key: 1, data: { status: 'Changed value' } }
        ]);

        this.clock.tick(100);

        assert.strictEqual(changedSpy1.callCount, 0);
        assert.strictEqual(changedSpy2.callCount, 0);
        assert.strictEqual(items[0].status, 'Initial value');
        assert.strictEqual(items[1].status, 'Initial value');

        store.push([
            { type: 'update', key: 2, data: { status: 'Changed value' } }
        ]);

        this.clock.tick(50);

        assert.strictEqual(changedSpy1.callCount, 1);
        assert.strictEqual(changedSpy2.callCount, 0);
        assert.strictEqual(items[0].status, 'Changed value');
        assert.strictEqual(items[1].status, 'Initial value');

        this.clock.tick(50);

        assert.strictEqual(changedSpy1.callCount, 2);
        assert.strictEqual(changedSpy2.callCount, 1);
        assert.strictEqual(items[0].status, 'Changed value');
        assert.strictEqual(items[1].status, 'Changed value');
    });

    QUnit.test('load is called with throttle when reshapeOnPush and pushAggregationTimeout is defined', function(assert) {
        const dataSource = this.createDataSource({
            reshapeOnPush: true,
            pushAggregationTimeout: 100
        });
        assert.equal(this.loadSpy.callCount, 0);

        dataSource.store().push(this.changes);
        dataSource.store().push(this.changes);

        assert.equal(this.loadSpy.callCount, 0);
        this.clock.tick(100);
        assert.equal(this.loadSpy.callCount, 1);
    });

    QUnit.test('load is called with automatic throttle depends on changed time', function(assert) {
        const dataSource = this.createDataSource({
            reshapeOnPush: true
        });

        dataSource.on('changed', (function() {
            this.clock.tick(10);
        }).bind(this));

        dataSource.load();

        assert.equal(this.loadSpy.callCount, 1);

        dataSource.store().push(this.changes);
        dataSource.store().push(this.changes);

        this.clock.tick(49);

        assert.equal(this.loadSpy.callCount, 1);

        this.clock.tick(1);
        assert.equal(this.loadSpy.callCount, 2);
    });

    QUnit.test('automatic throttle depends on changed time when reshapeOnPush is disabled', function(assert) {
        const dataSource = this.createDataSource({
            reshapeOnPush: false
        });

        dataSource.load();

        const changedSpy = sinon.spy();
        dataSource.on('changed', (function() {
            this.clock.tick(10);
            changedSpy();
        }).bind(this));

        assert.equal(changedSpy.callCount, 0);

        dataSource.store().push(this.changes);
        this.clock.tick();
        dataSource.store().push(this.changes);
        assert.equal(changedSpy.callCount, 1);

        this.clock.tick(49);
        assert.equal(changedSpy.callCount, 1);

        this.clock.tick(1);
        assert.equal(changedSpy.callCount, 2);
    });

    QUnit.test('load isn\'t called when reshapeOnPush is disabled', function(assert) {
        const dataSource = this.createDataSource();
        dataSource.store().push(this.changes);
        assert.equal(this.loadSpy.callCount, 0);
    });

    QUnit.test('pass changes in changed event when reshapeOnPush and paginate are disabled', function(assert) {
        const dataSource = this.createDataSource({
            paginate: false,
            pushAggregationTimeout: 0
        });
        const changedSpy = sinon.spy();
        dataSource.on('changed', changedSpy);
        dataSource.store().push(this.changes);
        assert.equal(changedSpy.firstCall.args[0].changes.length, 3);
    });

    QUnit.test('don\'t skip changes with types \'insert\' and \'remove\' when reshapeOnPush is disabled and paginate is enabled', function(assert) {
        const dataSource = this.createDataSource({
            paginate: true,
            pushAggregationTimeout: 0
        });
        const changedSpy = sinon.spy();
        dataSource.on('changed', changedSpy);
        dataSource.store().push(this.changes);
        assert.equal(changedSpy.firstCall.args[0].changes.length, 3);
    });

    QUnit.test('changed is fired with throttle when pushAggregationTimeout is enabled', function(assert) {
        const dataSource = this.createDataSource({
            paginate: false,
            pushAggregationTimeout: 100
        });
        const changedSpy = sinon.spy();
        dataSource.on('changed', changedSpy);

        assert.equal(changedSpy.callCount, 0);

        dataSource.store().push(this.changes);
        dataSource.store().push(this.changes);

        assert.equal(changedSpy.callCount, 0);

        this.clock.tick(100);
        assert.equal(changedSpy.callCount, 1);
        assert.equal(changedSpy.lastCall.args[0].changes.length, 6);
    });

    QUnit.test('push for grouping', function(assert) {
        const dataSource = this.initGroupingDataSource();
        dataSource.load();

        dataSource.store().push([
            { type: 'update', data: { key: 1, field: 12, type: 'a' }, key: 1 }
        ]);
        assert.deepEqual(dataSource.items()[0].key, 'a');
        assert.deepEqual(dataSource.items()[0].items[0].field, 12);
    });

    QUnit.test('push type=\'insert\' is ignored for grouping', function(assert) {
        const dataSource = this.initGroupingDataSource();
        dataSource.load();

        dataSource.store().push([
            { type: 'insert', data: { key: 3, field: 3, type: 'a' } }
        ]);
        assert.deepEqual(dataSource.items()[0].items.length, 2);

        dataSource.store().push([
            { type: 'insert', key: 4 }
        ]);
        assert.deepEqual(dataSource.items()[0].items.length, 2);
    });

    QUnit.test('push type=\'delete\' is ignored for grouping', function(assert) {
        const dataSource = this.initGroupingDataSource();
        dataSource.load();

        dataSource.store().push([
            { type: 'delete', key: 2 }
        ]);
        assert.deepEqual(dataSource.items()[0].items.length, 2);
    });

    // T837104
    QUnit.test('push after adding items via array directly', function(assert) {
        const store = this.initPlainDataSource().store();

        store.push([
            { type: 'update', key: 1, data: { text: 'updated' } }
        ]);

        this.array.push({ id: 3, text: 'test 3' });

        store.push([
            { type: 'update', key: 3, data: { text: 'updated' } }
        ]);

        assert.deepEqual(this.array[2].text, 'updated');
    });

    QUnit.test('push after adding items via array directly and via store.insert', function(assert) {
        const store = this.initPlainDataSource().store();

        store.push([
            { type: 'update', key: 1, data: { text: 'updated' } }
        ]);
        this.array.push({ id: 3, text: 'test 3' });
        store.insert({ key: 4, text: 'test 4' });

        store.push([
            { type: 'update', key: 3, data: { text: 'updated' } }
        ]);

        assert.deepEqual(this.array[2].text, 'updated');
    });

    QUnit.test('second push with type update should use cache', function(assert) {
        const store = this.initPlainDataSource().store();

        store.push([
            { type: 'update', key: 1, data: { text: 'updated 1' } }
        ]);

        const keyOfSpy = sinon.spy(store, 'keyOf');

        store.push([
            { type: 'update', key: 2, data: { text: 'updated 2' } }
        ]);

        assert.strictEqual(this.array[0].text, 'updated 1');
        assert.strictEqual(this.array[1].text, 'updated 2');
        assert.strictEqual(keyOfSpy.callCount, 0, 'keyOf is not called');
    });

    QUnit.test('second push with type update should use cache after remove item', function(assert) {
        const store = this.initPlainDataSource().store();

        store.push([
            { type: 'remove', key: 1 }
        ]);

        const keyOfSpy = sinon.spy(store, 'keyOf');

        store.push([
            { type: 'update', key: 2, data: { text: 'updated 2' } }
        ]);

        assert.strictEqual(this.array[0].text, 'updated 2');
        assert.strictEqual(keyOfSpy.callCount, 0, 'keyOf is not called');
    });

    // T958523
    QUnit.test('second push with type insert should use cache', function(assert) {
        const dataSource = this.initPlainDataSource();
        const store = dataSource.store();

        dataSource.load();
        store.push([
            { type: 'insert', data: { id: 3, text: 'new 1' } }
        ]);
        const keyOfSpy = sinon.spy(store, 'keyOf');

        store.push([
            { type: 'insert', data: { id: 4, text: 'new 2' } }
        ]);

        assert.strictEqual(this.array[3].text, 'new 2', 'new 2 is added to array');
        assert.strictEqual(dataSource.items()[3].text, 'new 2', 'new 2 is added to dataSource items');
        assert.strictEqual(keyOfSpy.callCount, 2, '1 for store data + 1 for dataSource items');
    });

    QUnit.test('push type=\'insert\' if item is exists', function(assert) {
        const dataSource = this.initPlainDataSource();
        dataSource.load();

        dataSource.store().push([
            { type: 'insert', data: { id: 2, text: 'modified' } }
        ]);

        assert.deepEqual(dataSource.items().length, 2);
    });

    QUnit.test('push type=\'insert\' if item is exists if reshapeOnPush', function(assert) {
        const dataSource = this.initPlainDataSource({ reshapeOnPush: true });
        dataSource.load();

        dataSource.store().push([
            { type: 'insert', data: { id: 2, text: 'modified' } }
        ]);

        assert.deepEqual(dataSource.items().length, 2);
        assert.deepEqual(this.array.length, 2);
    });

    QUnit.test('push type=\'remove\' and type=\'insert\'', function(assert) {
        const dataSource = this.initPlainDataSource();
        dataSource.load();

        dataSource.store().push([
            { type: 'remove', key: 1 },
            { type: 'insert', data: { id: 1, text: 'modified' } }
        ]);

        assert.deepEqual(this.array, [
            { id: 2, text: 'test 2' },
            { id: 1, text: 'modified' }
        ]);
        assert.deepEqual(dataSource.items(), this.array);
    });

    QUnit.test('push type=\'remove\' and type=\'insert\' if reshapeOnPush', function(assert) {
        const dataSource = this.initPlainDataSource({ reshapeOnPush: true });
        dataSource.load();

        dataSource.store().push([
            { type: 'remove', key: 1 },
            { type: 'insert', data: { id: 1, text: 'modified' } }
        ]);

        assert.deepEqual(this.array, [
            { id: 2, text: 'test 2' },
            { id: 1, text: 'modified' }
        ]);
        assert.deepEqual(dataSource.items(), this.array);
    });

    QUnit.test('push type=\'insert\' with same key', function(assert) {
        const dataSource = this.initPlainDataSource();
        dataSource.load();

        dataSource.store().push([
            { type: 'insert', data: { id: 3, text: 'first' } },
            { type: 'insert', data: { id: 3, text: 'second' } }
        ]);

        assert.deepEqual(this.array, [
            { id: 1, text: 'test 1' },
            { id: 2, text: 'test 2' },
            { id: 3, text: 'first' }
        ]);
        assert.deepEqual(dataSource.items(), this.array);
    });

    QUnit.test('push type=\'remove\' after insert if reshapeOnPush', function(assert) {
        const dataSource = this.initPlainDataSource({ reshapeOnPush: true });
        dataSource.load();

        dataSource.store().push([
            { type: 'insert', data: { id: 3, text: 'first' } },
            { type: 'insert', data: { id: 3, text: 'second' } }
        ]);

        assert.deepEqual(this.array, [
            { id: 1, text: 'test 1' },
            { id: 2, text: 'test 2' },
            { id: 3, text: 'first' }
        ]);
        assert.deepEqual(dataSource.items(), this.array);
    });
});
