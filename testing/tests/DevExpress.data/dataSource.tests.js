import $ from "jquery";
import { noop } from "core/utils/common";
import typeUtils from "core/utils/type";
import executeAsyncMock from "../../helpers/executeAsyncMock.js";
import ajaxMock from "../../helpers/ajaxMock.js";
import { DataSource } from "data/data_source/data_source";
import Store from "data/abstract_store";
import ArrayStore from "data/array_store";
import ODataStore from "data/odata/store";
import AggregateCalculator from "ui/data_grid/aggregate_calculator";

const TEN_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const moduleConfig = {
    beforeEach: function() {
        executeAsyncMock.setup();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
    }
};


QUnit.module("loadSingle");
QUnit.test("loadSingle call doesn't affect to state", function(assert) {
    var source = new DataSource(TEN_NUMBERS),
        changedFired = false,
        loadingChangedFired = false;

    source.on("changed", function() { changedFired = true; });
    source.on("loadingChanged", function() { loadingChangedFired = true; });

    source.loadSingle("this", 2).done(function(data) {
        assert.ok(!changedFired);
        assert.ok(!loadingChangedFired);
        assert.deepEqual(source.items(), []);
    });
});

QUnit.test("lookup with key specified", function(assert) {
    new DataSource({
        store: {
            type: "array",
            data: [
                { a: "1", i: 1 },
                { a: "2", i: 2 }
            ],
            key: "a"
        },
        filter: ["a", "<>", 1]
    }).loadSingle("a", "1").done(function(r) {
        assert.deepEqual(r, { a: "1", i: 1 });
    });
});

QUnit.test("with no key specified", function(assert) {
    assert.expect(3);

    var source = new DataSource({
        store: [
            { a: "1", i: 1 },
            { a: "2", i: 2 },
            { a: "2", i: 3 }
        ],
        filter: ["a", "<>", 1],
        sort: { field: "i", desc: true }
    });

    source.pageIndex(1);

    $.when(
        source.loadSingle("a", "2").done(function(r) {
            assert.ok(r, "should ignore skip option");
            assert.deepEqual(r, { a: "2", i: 3 }, "shouldn't ignore sort option");
        }),

        source.loadSingle("a", "1").fail(function() {
            assert.ok(true, "shouldn't retrieve filtered values");
        })
    );
});

QUnit.test("with filter as a function (T686655)", function(assert) {
    assert.expect(2);

    const source = new DataSource({
        store: [
            { a: "1" },
            { a: "2" }
        ],
        filter: (itemData) => itemData.a !== "2"
    });

    source.loadSingle("a", "1").done((r) => {
        assert.equal(r.a, "1");
    });

    source.loadSingle("a", "2").fail(() => {
        assert.ok(true, "shouldn't retrieve filtered values");
    });
});

QUnit.test("use key if no propName specified", function(assert) {
    new DataSource({
        store: {
            type: "array",
            data: [{ a: 1 }],
            key: "a"
        }
    }).loadSingle(1).done(function(r) {
        assert.deepEqual(r, { a: 1 }, "should use store.key() as propName");
    });
});

QUnit.test("doesn't apply postProcess", function(assert) {
    new DataSource({
        store: [1],
        postProcess: function(data) {
            return [null].concat(data);
        }
    }).loadSingle("this", 1).done(function(item) {
        assert.equal(item, 1);
    });
});

QUnit.test("error handling", function(assert) {
    assert.expect(0);

    var source = new DataSource(TEN_NUMBERS);

    var failFired = $.Deferred(),
        loadErrorFired = $.Deferred();

    source.on("loadError", function() {
        loadErrorFired.resolve();
    });

    source.loadSingle(function(obj) { throw Error("forced"); }, 1)
        .fail(function() { failFired.resolve(); });

    $.when(loadErrorFired, failFired);
});

QUnit.test("error handling (with key)", function(assert) {
    assert.expect(0);

    var source = new DataSource({
        store: new (ArrayStore.inherit({
            _byKeyImpl: function() { return $.Deferred().reject(Error("forced")).promise(); }
        }))({ key: "a", data: [] })
    });

    var failFired = $.Deferred(),
        loadErrorFired = $.Deferred();

    source.on("loadError", function() { loadErrorFired.resolve(); });
    source.loadSingle("a", 1).fail(function() { failFired.resolve(); });

    $.when(loadErrorFired, failFired);
});

QUnit.test("error handling (data item cannot be found, T283407)", function(assert) {
    assert.expect(3);

    var handleError = function(error) {
        assert.ok(error instanceof Error);
    };

    new DataSource({
        store: new ArrayStore({
            data: [{ d: 1, b: 1 }],
            key: "d"
        }),
        onLoadError: handleError
    })
        .on("loadError", handleError)
        .loadSingle("b", 2) // forces data mining through load implementation
        .fail(handleError)
        .done(function() {
            assert.ok(false);
        });
});

QUnit.test("don't force byKey for CustomStore(loadMode=raw, byKey=undefined)", function(assert) {
    var done = assert.async();

    var source = new DataSource({
        load: function() {
            return [ { a: 1 }, { a: 2 } ];
        },
        loadMode: "raw"
    });

    source.loadSingle("a", 2).done(function(item) {
        assert.equal(item.a, 2);
        done();
    });
});

QUnit.module("simple tests");
QUnit.test("initial state and load", function(assert) {
    var source = new DataSource({
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

QUnit.test("requireTotalCount", function(assert) {
    var loadingChangedCount,
        countCallCount,
        enumerateCallCount;

    var createWrappedQuery = function(origQuery) {

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

    var MyStore = ArrayStore.inherit({
        createQuery: function() {
            return createWrappedQuery(this.callBase.apply(this, arguments));
        }
    });

    var source = new DataSource({
        store: new MyStore(TEN_NUMBERS),
        requireTotalCount: true
    });

    source.on("loadingChanged", function() {
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

QUnit.test("load options passed to store", function(assert) {
    new DataSource({
        store: TEN_NUMBERS,
        filter: ["this", "<", 4],
        sort: { getter: "this", desc: true }
    })
        .load()
        .done(function(data) {
            assert.deepEqual(data, [3, 2, 1]);
        });
});

QUnit.test("map function", function(assert) {
    new DataSource({
        store: [14, 6],
        map: function(item, index) { return index + ":" + item; }
    })
        .load()
        .done(function(data) {
            assert.deepEqual(data, ["0:14", "1:6"]);
        });
});

QUnit.test("map function with push to store", function(assert) {
    var done = assert.async(),
        dataSource = new DataSource({
            store: [1],
            paginate: false,
            map: function(item) { return item + "p"; }
        });

    dataSource.load()
        .done((data) => {
            assert.deepEqual(data, ["1p"]);
            dataSource.store().push([{ type: "insert", data: 2 }]);
            dataSource.on("changed", function() {
                assert.deepEqual(dataSource.items(), ["1p", "2p"]);
                done();
            });
        });
});

QUnit.test("map function + grouping", function(assert) {
    new DataSource({
        store: [{ a: 1, b: 3 }],
        group: ["a", "b"],
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

QUnit.test("map function + grouping with null items", function(assert) {
    new DataSource({
        store: [{ a: 1, b: 3 }],
        group: ["a", "b"],
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

QUnit.test("map function + grouping + aggregating", function(assert) {
    new DataSource({
        store: [{ a: 1, b: 3 }],
        group: ["a", "b"],
        map: function(item) { return item.a * item.b; },
        onCustomizeLoadResult: function(loadResult) {
            var calculator = new AggregateCalculator({
                data: loadResult.data,
                groupAggregates: [
                    { aggregator: "count" }
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

QUnit.test("postProcess function", function(assert) {
    new DataSource({
        store: [1],
        postProcess: function(list) {
            return list.concat(["extra"]);
        }
    })
        .load()
        .done(function(data) {
            assert.deepEqual(data, [1, "extra"]);
        });
});

QUnit.test("page index change", function(assert) {
    var source = new DataSource({
        store: TEN_NUMBERS,
        pageIndex: 1,
        pageSize: 3
    });

    source.load().done(function() {
        assert.equal(source.pageIndex(), 1);
        assert.deepEqual(source.items(), [4, 5, 6]);

        source.on("changed", function() {
            assert.equal(source.pageIndex(), 2);
            assert.deepEqual(source.items(), [7, 8, 9]);
        });

        source.pageIndex(2);
        source.load();
    });

});

QUnit.test("paginate option", function(assert) {
    var data = [];

    for(var i = 0; i < 100; i++) {
        data.push(i);
    }

    var store = new ArrayStore(data),
        source = new DataSource({
            store: store,
            paginate: false
        });

    assert.ok(source.isLastPage());
    source.load().done(function() {
        assert.equal(source.items().length, 100);
    });
});

QUnit.test("paginate method", function(assert) {
    var source = new DataSource({
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

QUnit.test("reload", function(assert) {
    var fn;

    var source = new DataSource({
        load: function(options) {
            fn(options);
            return TEN_NUMBERS;
        }
    });

    fn = function(options) {
        options.userData.foo = "bar";
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

QUnit.test("reload invalidates CustomStore's raw data cache", function(assert) {
    var done = assert.async(),
        loadImpl;

    var source = new DataSource({
        load: function() {
            return loadImpl();
        },
        loadMode: "raw",
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

QUnit.test("when grouped then not paginating by default", function(assert) {
    var data = [];

    for(var i = 0; i < 100; i++) {
        data.push({ i: i });
    }

    var store = new ArrayStore(data),
        source = new DataSource({
            store: store,
            group: "i"
        });

    source.load().done(function() {
        assert.equal(source.items().length, 100);
    });
});

QUnit.test("load failure", function(assert) {
    var source = new DataSource({
        store: [1, 2, 3],
        select: function() {
            throw Error("forced");
        }
    });

    var failFired = $.Deferred(),
        callbackFired = $.Deferred();

    source.on("loadError", function(error) {
        assert.equal(error.message, "forced");
        assert.ok(!source.isLoading());

        callbackFired.resolve();
    });

    source.load().fail(function(error) {
        assert.equal(error.message, "forced");
        failFired.resolve();
    });

    $.when(callbackFired, failFired);
});

QUnit.test("load in disposed state (B230839, B230785)", function(assert) {
    assert.expect(0);

    var source = new DataSource();
    source.dispose();

    source.load();
});

QUnit.test("store load callback fired in disposed state", function(assert) {
    assert.expect(0);

    var loaded = $.Deferred();

    var storeClass = Store.inherit({
        _loadImpl: function() {
            return loaded.promise();
        }
    });

    var store = new storeClass();

    var source = new DataSource(store);

    source.load();
    source.dispose();
    loaded.resolve([1, 2, 3]);
});

QUnit.test("store returned not an array", function(assert) {
    var storeClass = Store.inherit({
        _loadImpl: function() {
            return $.Deferred().resolve(1);
        }
    });

    var store = new storeClass();

    new DataSource(store).load().done(function(r) {
        assert.deepEqual(r, [1]);
    });
});

QUnit.test("dataSource knows key of its store, and knows store as well", function(assert) {
    var store = new ArrayStore({
        key: "id"
    });
    var source = new DataSource(store);
    assert.equal(source.key(), "id");
    assert.equal(source.store(), store);
});

QUnit.test("isLoading and loadingChanged", function(assert) {
    var MyStore = Store.inherit({
        load: function() {
            return this.testDeferred.promise();
        }
    });

    var store = new MyStore(),
        ds = new DataSource(store),
        d1 = $.Deferred(),
        d2 = $.Deferred(),
        changeCount = 0;

    ds.on("loadingChanged", function() {
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

QUnit.test("beginLoading and endLoading", function(assert) {
    var ds = new DataSource([]),
        changeCount = 0;

    ds.on("loadingChanged", function() {
        changeCount++;
    });

    ds.beginLoading();
    ds.beginLoading();

    assert.ok(ds.isLoading(), "isLoading");
    assert.equal(changeCount, 1, "loadingChanged is called once");

    ds.endLoading();

    assert.ok(ds.isLoading(), "isLoading");
    assert.equal(changeCount, 1, "loadingChanged is called once");

    ds.endLoading();

    assert.ok(!ds.isLoading(), "not isLoading");
    assert.equal(changeCount, 2, "loadingChanged is called twice");
});

QUnit.test("beginLoading and endLoading with load", function(assert) {
    var MyStore = Store.inherit({
        load: function() {
            return this.testDeferred.promise();
        }
    });

    var store = new MyStore(),
        ds = new DataSource(store),
        testDeferred = $.Deferred(),
        changeCount = 0;

    ds.on("loadingChanged", function() {
        changeCount++;
    });

    ds.beginLoading();

    assert.ok(ds.isLoading(), "isLoading");
    assert.equal(changeCount, 1, "loadingChanged is called once");

    store.testDeferred = testDeferred;

    ds.load().always(function() {
        assert.ok(ds.isLoading(), "isLoading");
        assert.equal(changeCount, 1, "loadingChanged is called once");
        ds.endLoading();
    });

    testDeferred.resolve([]);

    assert.ok(!ds.isLoading(), "not isLoading");
    assert.equal(changeCount, 2, "loadingChanged is called twice");
});

QUnit.test("isLoading is false inside when changed fires", function(assert) {
    var source = new DataSource(TEN_NUMBERS);

    source.on("changed", function() {
        assert.ok(!source.isLoading());
    });

    source.load();
});

QUnit.test("customizeStoreLoadOptions", function(assert) {
    var source = new DataSource(TEN_NUMBERS);

    source.on("customizeStoreLoadOptions", function(options) {
        options.storeLoadOptions.filter = ["this", "=", 1];
    });

    source.load().done(function(data) {
        assert.deepEqual(data, [1]);
        assert.ok(!source.loadOptions().filter);
    });
});

QUnit.test("customizeStoreLoadOptions cache", function(assert) {
    var source = new DataSource(TEN_NUMBERS),
        loadingCount = 0,
        changedCount = 0;

    source.store().on("loading", function() {
        loadingCount++;
    });
    source.on("changed", function(options) {
        changedCount++;
    });

    source.load().done(function(data) {
        assert.deepEqual(data, TEN_NUMBERS);
        assert.deepEqual(source.items(), TEN_NUMBERS);
        assert.equal(loadingCount, 1);
        assert.equal(changedCount, 1);
    });

    source.on("customizeStoreLoadOptions", function(options) {
        options.data = [1, 2];
    });

    source.load().done(function(data) {
        assert.deepEqual(data, [1, 2]);
        assert.deepEqual(source.items(), [1, 2]);
        assert.equal(loadingCount, 1, "loading is not raised");
        assert.equal(changedCount, 2, "changed is raised");
    });
});

QUnit.test("load promise should be rejected if DataSource is disposed while loading data (T541870)", function(assert) {
    var d = $.Deferred();
    var source = new DataSource({
        load: function() {
            return d.promise();
        }
    });

    var loadPromise = source.load().done(function(data) {
        assert.deepEqual(data, TEN_NUMBERS);
    });

    assert.equal(loadPromise.state(), "pending");

    source.dispose();

    d.resolve();

    assert.equal(loadPromise.state(), "rejected");
    assert.ok(typeUtils.isEmptyObject(source._operationManager._deferreds));
});

QUnit.test("customizeLoadResult", function(assert) {
    var source = new DataSource({
        map: function(i) {
            return String(i);
        },
        postProcess: function(data) {
            return $.extend(data, { extended: true });
        },
        store: [42]
    });

    source.on("customizeLoadResult", function(args) {
        assert.ok(!("foo" in args.data));
        assert.equal(args.data[0], 42);

        args.data = [24];
    });

    source.load().done(function(data, extra) {
        assert.equal(data[0], "24");
        assert.equal(data.extended, true);
    });
});

QUnit.test("cancel works", function(assert) {
    assert.expect(4);

    var source = new DataSource({
        load: function() {
            return $.Deferred().promise();
        }
    });

    var promise = source.load()
        .fail(handleFail)
        .done(handleDone);

    function handleFail() {
        assert.ok(true, "Should reach this point");
    }

    function handleDone() {
        assert.ok(false, "Shouldn't reach this point");
    }

    assert.ok(source.isLoading());

    source.cancel(promise.operationId);

    assert.ok(!source.isLoaded());
    assert.ok(!source.isLoading());
});

QUnit.test("cancelAll works", function(assert) {
    var source = new DataSource({
        load: function() {
            return $.Deferred().promise();
        }
    });

    var promise1 = source.load();
    var promise2 = source.load();

    source.cancelAll();

    assert.ok(!source.isLoading());
    assert.equal(promise1.state(), "rejected", "promise1 is rejected");
    assert.equal(promise2.state(), "rejected", "promise2 is rejected");
});

QUnit.test("canceling on customizeStoreLoadOptions", function(assert) {
    var source = new DataSource({
        load: mustNotReach
    });

    function mustNotReach() {
        assert.ok(false, "Shouldn't reach this point");
    }

    function handleFail() {
        assert.ok(true, "Should reach this point");
    }

    function handleDone() {
        mustNotReach();
    }

    source.on("customizeStoreLoadOptions", function(operation) {
        source.cancel(operation.operationId);
    });

    source.load()
        .fail(handleFail)
        .done(handleDone);
});

QUnit.test("cancel event flow", function(assert) {
    var loadingChangedLog = [];
    var ds = new DataSource({
        load: function() {
            return $.Deferred().promise();
        }
    });

    function mustNotReach() {
        assert.ok(false, "Shouldn't reach this point");
    }

    ds.on("changed", function() {
        mustNotReach();
    });

    ds.on("loadError", function() {
        mustNotReach();
    });

    ds.on("loadingChanged", function(state) {
        loadingChangedLog.push(state);
    });

    var promise = ds.load()
        .always(function(state) {
            assert.equal(state, "canceled");
        });

    ds.cancel(promise.operationId);

    assert.deepEqual(loadingChangedLog, [true, false]);
});

QUnit.test("search API, default impl, no selector", function(assert) {
    var store = new ArrayStore(["a", "b"]);

    var source = new DataSource(store);
    source.searchValue("a");

    source.load().done(function(r) {
        assert.equal(r.length, 1);
    });
});

QUnit.test("search API, default impl, single selector", function(assert) {
    var store = new ArrayStore([
        { text: "abc" },
        { text: "xyz" }
    ]);

    var source = new DataSource(store);
    source.searchExpr("text");
    source.searchValue("a");

    source.load().done(function(r) {
        assert.equal(r.length, 1);
        assert.equal(r[0].text, "abc");
    });
});

QUnit.test("search API, default impl, multi selectors, custom op", function(assert) {
    var store = new ArrayStore([
        { text: "abc", description: "xyz" },
        { text: "xyz", description: "abc" },
        { text: "xyz", description: "xyz" }
    ]);

    var source = new DataSource(store);
    source.searchExpr("text", "description");
    source.searchOperation("=");
    source.searchValue("abc");

    source.load().done(function(r) {
        assert.equal(r.length, 2);
    });
});

QUnit.test("search API, default impl, complex selector", function(assert) {
    var store = new ArrayStore([
        { date: new Date(1984, 5, 14) }
    ]);

    var source = new DataSource(store);
    source.searchExpr(function(item) { return item.date.getFullYear(); });
    source.searchOperation("=");
    source.searchValue(1984);

    source.load().done(function(r) {
        assert.equal(r.length, 1);
    });
});

QUnit.test("search API, custom impl", function(assert) {
    var MyStore = Store.inherit({

        ctor: function(o) {
            this.callBase(o);
            this._useDefaultSearch = false;
        },

        _loadImpl: function(options) {
            assert.ok(!options.filter);

            assert.equal(options.searchExpr, "expr");
            assert.equal(options.searchValue, "test text");
            assert.equal(options.searchOperation, "operation");

            return $.Deferred(); // api requires
        }

    });

    var source = new DataSource(new MyStore());
    source.searchOperation("operation");
    source.searchValue("test text");
    source.searchExpr("expr");

    source.load();
});

QUnit.test("search API, configuration from ctor", function(assert) {
    var source = new DataSource({
        searchExpr: "abc",
        searchOperation: "xyz",
        searchValue: 0,
        load: noop
    });

    assert.equal(source.searchExpr(), "abc");
    assert.equal(source.searchOperation(), "xyz");
    assert.strictEqual(source.searchValue(), 0);
});

QUnit.test("search API, useDefaultSearch", function(assert) {
    assert.expect(8);

    var sourceWithCustomSearch = new DataSource({
        useDefaultSearch: false,

        load: function(options) {
            assert.ok(!options.filter);

            assert.equal(options.searchExpr, "expr");
            assert.equal(options.searchValue, "test text");
            assert.equal(options.searchOperation, "operation");

            return $.Deferred().promise();
        }
    });

    var sourceWithDefaultSearch = new DataSource({
        useDefaultSearch: true,

        load: function(options) {
            assert.deepEqual(options.filter, [["expr", "operation", "test text"]]);

            assert.ok(!options.searchExpr);
            assert.ok(!options.searchValue);
            assert.ok(!options.searchOperation);

            return $.Deferred().promise();
        }
    });

    sourceWithCustomSearch.searchExpr("expr");
    sourceWithCustomSearch.searchValue("test text");
    sourceWithCustomSearch.searchOperation("operation");

    sourceWithDefaultSearch.searchExpr("expr");
    sourceWithDefaultSearch.searchValue("test text");
    sourceWithDefaultSearch.searchOperation("operation");

    $.when(
        sourceWithCustomSearch.load(),
        sourceWithDefaultSearch.load()
    ).fail(function() {
        assert.ok(false, "Shouldn't reach this point");
    });
});

QUnit.test("events API, changed", function(assert) {
    var cl = {};

    var source = new DataSource({
        store: [1, 2, 3],
        onChanged: function() {
            cl.onChanged_option = true;
        }
    });

    source.on("changed", function() {
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

QUnit.test("events API, loadingChanged", function(assert) {
    var cl = {
        onLoadingChanged_option: [],
        on_loadingChanged_callback: []
    };
    var source = new DataSource({
        store: [1, 2, 3],
        onLoadingChanged: function(isLoading) {
            cl.onLoadingChanged_option.push(isLoading);
        }
    });

    source.on("loadingChanged", function(isLoading) {
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

QUnit.test("events API, loadError", function(assert) {
    var cl = {};

    var source = new DataSource({
        store: [1, 2, 3],
        select: function() {
            throw new Error("Forced");
        },
        onLoadError: function(e) {
            cl.onLoadError_option = e.message;
        }
    });

    source.on("loadError", function(e) {
        cl.on_loadError_callback = e.message;
    });


    source.load().fail(function(e) {
        assert.equal(e.message, "Forced");
        assert.deepEqual(cl, {
            onLoadError_option: "Forced",
            on_loadError_callback: "Forced"
        });
    });
});

QUnit.test("events API, customizeLoadResult", function(assert) {
    var cl = {};

    var source = new DataSource({
        store: [1, 2, 3],
        onCustomizeLoadResult: function(loadResult) {
            cl.onCustomizeLoadResult_option = loadResult;

            delete cl.onCustomizeLoadResult_option.operationId;
            loadResult.foo = 1;
        }
    });

    source.on("customizeLoadResult", function(loadResult) {
        cl.on_customizeLoadResult_callback = loadResult;

        delete cl.on_customizeLoadResult_callback.operationId;
        loadResult.bar = 2;
    });


    source.load().done(function(r) {
        var expected = {
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

QUnit.test("events API, customizeStoreLoadOptions", function(assert) {
    var cl = {},
        source = new DataSource({
            store: [1, 2, 3],
            onCustomizeStoreLoadOptions: function(loadOptions) {
                cl.onCustomizeStoreLoadOptions_option = loadOptions;
                delete cl.onCustomizeStoreLoadOptions_option.operationId;
            }
        });

    source.on("customizeStoreLoadOptions", function(loadOptions) {
        cl.on_customizeStoreLoadOptions_callback = loadOptions;
        delete cl.onCustomizeStoreLoadOptions_option.operationId;
    });


    source.load().done(function(r) {
        var expected = {
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

QUnit.test("dispose unsubscribes events", function(assert) {
    var func = function() { };
    var source = new DataSource({
        store: [1, 2, 3],

        onChanged: func,
        onLoadError: func,
        onLoadingChanged: func,
        onCustomizeLoadResult: func,
        onCustomizeStoreLoadOptions: func
    });

    source.on("changed", func);
    source.on("loadError", func);
    source.on("loadingChanged", func);
    source.on("customizeLoadResult", func);
    source.on("customizeStoreLoadOptions", func);

    var events = source._eventsStrategy._events;
    assert.ok(events["changed"].has(func));
    assert.ok(events["loadError"].has(func));
    assert.ok(events["loadingChanged"].has(func));
    assert.ok(events["customizeLoadResult"].has(func));
    assert.ok(events["customizeStoreLoadOptions"].has(func));

    source.dispose();

    events = source._eventsStrategy._events;
    assert.ok(!events["changed"].has());
    assert.ok(!events["loadError"].has());
    assert.ok(!events["loadingChanged"].has());
    assert.ok(!events["customizeLoadResult"].has());
    assert.ok(!events["customizeStoreLoadOptions"].has());
});

QUnit.module("Changing store load options", moduleConfig);

QUnit.test("sort", function(assert) {
    var data = [
        { id: 1 },
        { id: 2 },
        { id: 3 }
    ];

    var source = new DataSource({
        store: data,
        map: function(i) { return i.id; }
    });

    source.sort("a");
    assert.equal(source.sort(), "a");

    source.sort("a", "b");
    assert.deepEqual(source.sort(), ["a", "b"]);

    source.sort({ field: "id", desc: true });
    assert.deepEqual(source.sort(), { field: "id", desc: true });

    source.load().done(function(r) {
        assert.deepEqual(r, [3, 2, 1]);
    });
});

QUnit.test("filter", function(assert) {
    var data = [
        { id: 1 },
        { id: 2 }
    ];

    var source = new DataSource({
        store: data,
        map: function(i) { return i.id; }
    });

    function fn1() { }

    source.filter("id", ">", 1);
    assert.deepEqual(source.filter(), ["id", ">", 1]);

    source.filter(fn1);
    assert.strictEqual(source.filter(), fn1);

    source.filter(["id", "<", 2]);
    assert.deepEqual(source.filter(), ["id", "<", 2]);

    source.load().done(function(r) {
        assert.deepEqual(r, [1]);
    });
});

QUnit.test("group", function(assert) {
    var data = [
        { g: 1 },
        { g: 2 },
        { g: 1 }
    ];

    var source = new DataSource({
        store: data
    });

    source.group("a");
    assert.equal(source.group(), "a");

    source.group("a", "b");
    assert.deepEqual(source.group(), ["a", "b"]);

    source.group("g");
    source.load().done(function(r) {
        assert.equal(r.length, 2);
        assert.equal(r[0].key, 1);
    });
});

QUnit.test("select", function(assert) {
    var data = [
        { a: 1, b: 2 }
    ];

    var source = new DataSource({
        store: data
    });

    function fn1() { }

    source.select("a");
    assert.equal(source.select(), "a");

    source.select("a", "b");
    assert.deepEqual(source.select(), ["a", "b"]);

    source.select(fn1);
    assert.strictEqual(source.select(), fn1);

    source.select("b");
    source.load().done(function(r) {
        assert.equal(r[0].b, 2);
        assert.ok(!("a" in r[0]));
    });
});


QUnit.module("requireTotalCount");
QUnit.test("requireTotalCount: fail", function(assert) {
    var done = assert.async();

    ajaxMock.setup({
        url: "odata.org",
        responseText: {
            d: {
                results: [],
                __count: undefined
            }
        }
    });

    var source = new DataSource({
        store: new ODataStore({
            url: "odata.org"
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

QUnit.test("requireTotalCount: success", function(assert) {
    var data = [
        { a: 1, b: 2 },
        { a: 3, b: 4 }
    ];

    var source = new DataSource({
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
QUnit.test("totalCount when CustomStore with Promise/A", function(assert) {
    var loadCallback,
        source = new DataSource({
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

QUnit.module("Custom cases and regressions", moduleConfig);
QUnit.test("expand option for OData store", function(assert) {
    var done = assert.async();

    ajaxMock.setup({
        url: "odata.org",
        callback: function(bag) {
            this.responseText = { value: [bag] };
        }
    });

    new DataSource({
        store: new ODataStore({
            url: "odata.org"
        }),

        expand: "TestExpand"
    }).load()
        .done(function(data) {
            assert.equal(data[0].data.$expand, "TestExpand");
        })
        .always(function() {
            ajaxMock.clear();
        })
        .always(done);
});

QUnit.test("filterToLower option equal false for OData store", function(assert) {
    var done = assert.async();

    ajaxMock.setup({
        url: "odata.org",
        callback: function(bag) {
            this.responseText = { value: [bag] };
        }
    });

    new DataSource({
        store: new ODataStore({
            url: "odata.org",
            filterToLower: false
        }),
        filter: ["prop.nested.prop", "contains", "O"]
    }).load()
        .done(function(data) {
            assert.equal(data[0].data.$filter, "substringof('O',prop/nested/prop)");
        })
        .always(function() {
            ajaxMock.clear();
        })
        .always(done);
});

QUnit.test("Q456193", function(assert) {
    var store = new ArrayStore(["a", "b", "c"]),
        source = new DataSource(store);

    source.load().done(function(r) {
        assert.deepEqual(r, ["a", "b", "c"]);
        assert.ok(!r[0].__key__);
    });
});

QUnit.test("paging with continuation token", function(assert) {
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


    var source = new DataSource({
        pageSize: null, // means page size varies

        load: function(options) {
            var userData = options.userData,
                token,
                serverResponse;

            if(userData.lastPageIndex && source.pageIndex() > userData.lastPageIndex) {
                return $.Deferred().resolve([]);
            }

            userData.pageTokens = userData.pageTokens || {};

            token = userData.pageTokens[source.pageIndex()];

            serverResponse = simulateServerResponse(token);
            if("nextToken" in serverResponse) {
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

QUnit.test("B239452", function(assert) {
    var BENCH = {
        title: "Bench"
    };

    var exercises = [{
        equipment: BENCH
    }];

    var ds = new DataSource({
        store: new ArrayStore(exercises),
        filter: ["equipment", BENCH]
    });

    ds.load().done(function(r) {
        assert.equal(r.length, 1);
    });
});

QUnit.test("B251658", function(assert) {
    var ds = new DataSource({
        store: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        pageSize: 5
    });
    ds.pageIndex(1);
    ds.filter("this", "<", 5);
    assert.equal(ds.pageIndex(), 0);

    ds.pageIndex(1);
    ds.filter();
    assert.equal(ds.pageIndex(), 1);
});

QUnit.test("B253895 - Data - DataSource.pageIndex is not set to 0 when search API is applied", function(assert) {
    var ds = new DataSource({
        store: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        pageSize: 5
    });
    ds.pageIndex(1);
    ds.searchExpr("this");
    assert.equal(ds.pageIndex(), 0);

    ds.pageIndex(1);
    ds.searchOperation("=");
    assert.equal(ds.pageIndex(), 0);

    ds.pageIndex(1);
    ds.searchValue("4");
    assert.equal(ds.pageIndex(), 0);

    ds.pageIndex(1);
    ds.searchExpr();
    ds.searchValue();
    ds.searchOperation();
    assert.equal(ds.pageIndex(), 1);
});

QUnit.test("paging should be disabled if ctor options is url (see T314464)", function(assert) {
    assert.ok(!new DataSource("path/to/file/with/json/content.txt").paginate());
});

QUnit.test("StoreLoadOptionAccessors: null and undefined (based on T304670)", function(assert) {
    var ds = new DataSource("");

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
    assert.equal(ds.searchExpr("foo"), undefined);
    assert.equal(ds.searchExpr(undefined), undefined);
    assert.equal(ds.searchExpr(null), undefined);
    // getter
    assert.equal(ds.searchExpr(), null);

    // setter
    assert.equal(ds.searchValue("foo"), undefined);
    assert.equal(ds.searchValue(undefined), undefined);
    assert.equal(ds.searchValue(null), undefined);
    // getter
    assert.equal(ds.searchValue(), null);

    // setter
    assert.equal(ds.searchOperation("="), undefined);
    // getter
    assert.equal(ds.searchOperation(undefined), "=");
    assert.equal(ds.searchOperation(null), "=");
    assert.equal(ds.searchOperation(), "=");

    // setter
    assert.equal(ds.requireTotalCount(false), undefined);
    // getter
    assert.equal(ds.requireTotalCount(undefined), false);
    assert.equal(ds.requireTotalCount(null), false);
    assert.equal(ds.requireTotalCount(), false);
});

QUnit.module("live update", {
    beforeEach: function() {
        var loadSpy = sinon.spy();
        this.loadSpy = loadSpy;
        var itemRemove = { field: 1 },
            itemUpdate = { field: 2 };
        this.changes = [
            { type: "insert", data: { field: 3 } },
            { type: "remove", key: itemRemove },
            { type: "update", key: itemUpdate, data: { field: 4 } }
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
                        key: "a",
                        items: [{ key: 1, field: 1, type: "a" }, { key: 2, field: 2, type: "a" }]
                    }, {
                        key: "b",
                        items: [{ key: 3, field: 3, type: "b" }]
                    }];
                },
                key: "key",
                group: "type",
                pushAggregationTimeout: 0
            });
        };

        this.initPlainDataSource = function(options) {
            this.array = [
                { id: 1, text: "test 1" },
                { id: 2, text: "test 2" }
            ];

            return new DataSource($.extend({
                store: {
                    type: "array",
                    data: this.array,
                    key: "id"
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
    QUnit.test("load is called when reshapeOnPush is enabled", function(assert) {
        var dataSource = this.createDataSource({
            reshapeOnPush: true,
            pushAggregationTimeout: 0
        });
        assert.equal(this.loadSpy.callCount, 0);

        dataSource.store().push(this.changes);
        assert.equal(this.loadSpy.callCount, 1);
    });

    QUnit.test("load is called with throttle when reshapeOnPush and pushAggregationTimeout are enabled", function(assert) {
        var dataSource = this.createDataSource({
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

    QUnit.test("load is called with throttle when reshapeOnPush and pushAggregationTimeout is defined", function(assert) {
        var dataSource = this.createDataSource({
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

    QUnit.test("load is called with automatic throttle depends on changed time", function(assert) {
        var dataSource = this.createDataSource({
            reshapeOnPush: true
        });

        dataSource.on("changed", (function() {
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

    QUnit.test("automatic throttle depends on changed time when reshapeOnPush is disabled", function(assert) {
        var dataSource = this.createDataSource({
            reshapeOnPush: false
        });

        dataSource.load();

        var changedSpy = sinon.spy();
        dataSource.on("changed", (function() {
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

    QUnit.test("load isn't called when reshapeOnPush is disabled", function(assert) {
        var dataSource = this.createDataSource();
        dataSource.store().push(this.changes);
        assert.equal(this.loadSpy.callCount, 0);
    });

    QUnit.test("pass changes in changed event when reshapeOnPush and paginate are disabled", function(assert) {
        var dataSource = this.createDataSource({
            paginate: false,
            pushAggregationTimeout: 0
        });
        var changedSpy = sinon.spy();
        dataSource.on("changed", changedSpy);
        dataSource.store().push(this.changes);
        assert.equal(changedSpy.firstCall.args[0].changes.length, 3);
    });

    QUnit.test("don't skip changes with types 'insert' and 'remove' when reshapeOnPush is disabled and paginate is enabled", function(assert) {
        var dataSource = this.createDataSource({
            paginate: true,
            pushAggregationTimeout: 0
        });
        var changedSpy = sinon.spy();
        dataSource.on("changed", changedSpy);
        dataSource.store().push(this.changes);
        assert.equal(changedSpy.firstCall.args[0].changes.length, 3);
    });

    QUnit.test("changed is fired with throttle when pushAggregationTimeout is enabled", function(assert) {
        var dataSource = this.createDataSource({
            paginate: false,
            pushAggregationTimeout: 100
        });
        var changedSpy = sinon.spy();
        dataSource.on("changed", changedSpy);

        assert.equal(changedSpy.callCount, 0);

        dataSource.store().push(this.changes);
        dataSource.store().push(this.changes);

        assert.equal(changedSpy.callCount, 0);

        this.clock.tick(100);
        assert.equal(changedSpy.callCount, 1);
        assert.equal(changedSpy.lastCall.args[0].changes.length, 6);
    });

    QUnit.test("push for grouping", function(assert) {
        var dataSource = this.initGroupingDataSource();
        dataSource.load();

        dataSource.store().push([
            { type: "update", data: { key: 1, field: 12, type: "a" }, key: 1 }
        ]);
        assert.deepEqual(dataSource.items()[0].key, "a");
        assert.deepEqual(dataSource.items()[0].items[0].field, 12);
    });

    QUnit.test("push type='insert' is ignored for grouping", function(assert) {
        var dataSource = this.initGroupingDataSource();
        dataSource.load();

        dataSource.store().push([
            { type: "insert", data: { key: 3, field: 3, type: "a" } }
        ]);
        assert.deepEqual(dataSource.items()[0].items.length, 2);

        dataSource.store().push([
            { type: "insert", key: 4 }
        ]);
        assert.deepEqual(dataSource.items()[0].items.length, 2);
    });

    QUnit.test("push type='delete' is ignored for grouping", function(assert) {
        var dataSource = this.initGroupingDataSource();
        dataSource.load();

        dataSource.store().push([
            { type: "delete", key: 2 }
        ]);
        assert.deepEqual(dataSource.items()[0].items.length, 2);
    });

    QUnit.test("push type='insert' if item is exists", function(assert) {
        var dataSource = this.initPlainDataSource();
        dataSource.load();

        dataSource.store().push([
            { type: "insert", data: { id: 2, text: "modified" } }
        ]);

        assert.deepEqual(dataSource.items().length, 2);
    });

    QUnit.test("push type='insert' if item is exists if reshapeOnPush", function(assert) {
        var dataSource = this.initPlainDataSource({ reshapeOnPush: true });
        dataSource.load();

        dataSource.store().push([
            { type: "insert", data: { id: 2, text: "modified" } }
        ]);

        assert.deepEqual(dataSource.items().length, 2);
        assert.deepEqual(this.array.length, 2);
    });

    QUnit.test("push type='remove' and type='insert'", function(assert) {
        var dataSource = this.initPlainDataSource();
        dataSource.load();

        dataSource.store().push([
            { type: "remove", key: 1 },
            { type: "insert", data: { id: 1, text: "modified" } }
        ]);

        assert.deepEqual(this.array, [
            { id: 2, text: "test 2" },
            { id: 1, text: "modified" }
        ]);
        assert.deepEqual(dataSource.items(), this.array);
    });

    QUnit.test("push type='remove' and type='insert' if reshapeOnPush", function(assert) {
        var dataSource = this.initPlainDataSource({ reshapeOnPush: true });
        dataSource.load();

        dataSource.store().push([
            { type: "remove", key: 1 },
            { type: "insert", data: { id: 1, text: "modified" } }
        ]);

        assert.deepEqual(this.array, [
            { id: 2, text: "test 2" },
            { id: 1, text: "modified" }
        ]);
        assert.deepEqual(dataSource.items(), this.array);
    });

    QUnit.test("push type='insert' with same key", function(assert) {
        var dataSource = this.initPlainDataSource();
        dataSource.load();

        dataSource.store().push([
            { type: "insert", data: { id: 3, text: "first" } },
            { type: "insert", data: { id: 3, text: "second" } }
        ]);

        assert.deepEqual(this.array, [
            { id: 1, text: "test 1" },
            { id: 2, text: "test 2" },
            { id: 3, text: "first" }
        ]);
        assert.deepEqual(dataSource.items(), this.array);
    });

    QUnit.test("push type='remove' after insert if reshapeOnPush", function(assert) {
        var dataSource = this.initPlainDataSource({ reshapeOnPush: true });
        dataSource.load();

        dataSource.store().push([
            { type: "insert", data: { id: 3, text: "first" } },
            { type: "insert", data: { id: 3, text: "second" } }
        ]);

        assert.deepEqual(this.array, [
            { id: 1, text: "test 1" },
            { id: 2, text: "test 2" },
            { id: 3, text: "first" }
        ]);
        assert.deepEqual(dataSource.items(), this.array);
    });
});
