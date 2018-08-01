var $ = require("jquery"),
    ViewCache = require("framework/view_cache"),
    ConditionalViewCacheDecorator = require("framework/view_cache").ConditionalViewCacheDecorator,
    CapacityViewCacheDecorator = require("framework/view_cache").CapacityViewCacheDecorator,
    HistoryDependentViewCacheDecorator = require("framework/view_cache").HistoryDependentViewCacheDecorator,

    executeAsyncMock = require("../../helpers/executeAsyncMock.js"),
    frameworkMocks = require("../../helpers/frameworkMocks.js");

QUnit.module("ViewCache", {
    beforeEach: function() {
        executeAsyncMock.setup();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
    }
});

QUnit.test("Set view", function(assert) {
    var cache = new ViewCache();
    cache.setView("1", { test: "1" });
    assert.equal(cache._cache["1"].test, "1");
});

QUnit.test("Get view", function(assert) {
    var cache = new ViewCache();
    cache.setView("1", { test: "1" });
    assert.equal(cache.getView("1").test, "1");
});

QUnit.test("Remove view", function(assert) {
    var cache = new ViewCache(),
        viewRemovedLog = [];

    cache.on("viewRemoved", function(args) {
        viewRemovedLog.push(args);
    });

    cache.setView("1", { test: "1" });
    assert.ok(cache.getView("1"));
    assert.equal(viewRemovedLog.length, 0);

    cache.removeView("1");
    assert.equal(viewRemovedLog.length, 1);
    assert.equal(viewRemovedLog[0].viewInfo.test, "1");
    assert.ok(!cache.getView("1"));

    cache.removeView("1");
    assert.equal(viewRemovedLog.length, 1, "T166784: viewRemoved is not raised if view doesn't exist");
    assert.ok(!cache.getView("1"));
});

QUnit.test("Replace view", function(assert) {
    var cache = new ViewCache();
    cache.setView("1", { test: "1" });
    cache.setView("1", { test: "2" });
    assert.equal(cache.getView("1").test, "2");
});

QUnit.test("Clear cache", function(assert) {
    var cache = new ViewCache();
    cache.setView("1", { test: "1" });
    cache.clear();
    assert.ok(!cache.getView("1"));
});

QUnit.test("Remove each view separately on clear", function(assert) {
    var cache = new ViewCache(),
        viewRemovedLog = [];

    cache.on("viewRemoved", function(e) {
        viewRemovedLog.push(e.viewInfo);
    });

    cache.setView("1", { test: "1" });
    cache.setView("2", { test: "2" });
    cache.clear();

    assert.equal(viewRemovedLog[0].test, "1");
    assert.equal(viewRemovedLog[1].test, "2");
});

QUnit.module("ViewCache decorators");

QUnit.test("ConditionalViewCacheDecorator", function(assert) {
    var cache = new ConditionalViewCacheDecorator({
        viewCache: new ViewCache(),
        filter: function(key, item) {
            return !item.disableCache;
        }
    });
    cache.setView("1", { test: "1" });
    cache.setView("2", { test: "2", disableCache: false });
    cache.setView("3", { test: "3", disableCache: true });

    assert.equal(cache.getView("1").test, "1");
    assert.equal(cache.getView("2").test, "2");
    assert.ok(!cache.getView("3"));
});

QUnit.test("CapacityViewCacheDecorator", function(assert) {
    var cache = new CapacityViewCacheDecorator({
        viewCache: new ViewCache(),
        size: 2
    });
    cache.setView("1", { test: "1" });
    cache.setView("2", { test: "2" });
    cache.setView("3", { test: "3" });

    assert.equal(cache.getView("2").test, "2");
    assert.equal(cache.getView("3").test, "3");
    assert.ok(!cache.getView("1"));

    cache.setView("2", { test: "2.1" });
    assert.equal(cache.getView("2").test, "2.1");

    cache.removeView("2");
    assert.ok(!cache.getView("2"));

    cache.clear();

    cache.setView("4", { test: "4" });
    cache.setView("5", { test: "5" });
    assert.equal(cache.getView("4").test, "4");
    assert.equal(cache.getView("5").test, "5");

    cache = new CapacityViewCacheDecorator({
        viewCache: new ViewCache(),
        size: 3
    });

    cache.setView("1", { test: "1" });
    cache.setView("2", { test: "2" });
    cache.setView("3", { test: "3" });
    cache.getView("1");
    cache.setView("4", { test: "4" });

    assert.equal(cache.getView("3").test, "3");
    assert.equal(cache.getView("1").test, "1");
    assert.equal(cache.getView("4").test, "4");
    assert.ok(!cache.getView("2"));
});

QUnit.test("HistoryDependentViewCacheDecorator", function(assert) {
    assert.expect(1);

    var navigationManager = new frameworkMocks.MockHistoryBasedNavigationManager(),
        viewCache = new HistoryDependentViewCacheDecorator({
            navigationManager: navigationManager,
            viewCache: new ViewCache()
        }),
        viewRemovedLog = [];

    viewCache.on("viewRemoved", function(e) {
        viewRemovedLog.push(e.viewInfo);
    });

    viewCache.setView("1", { test: "test" });
    navigationManager.fireEvent("itemRemoved", [{ key: "1" }]);
    assert.equal(viewRemovedLog.length, 1);
});

QUnit.test("viewRemoved event is raised after removing view", function(assert) {
    var viewCache = new ViewCache(),
        viewRemovedLog = [];

    viewCache.on("viewRemoved", function(e) {
        viewRemovedLog.push(e.viewInfo);
    });


    viewCache.setView("1", { test: "test" });
    assert.equal(viewRemovedLog.length, 0);
    viewCache.removeView("1");
    assert.equal(viewRemovedLog.length, 1);
});

QUnit.test("viewRemoved is reraised to decorators from base viewCache", function(assert) {
    var viewCacheDecorators = [
            new CapacityViewCacheDecorator({
                viewCache: new ViewCache()
            }),
            new ConditionalViewCacheDecorator({
                viewCache: new ViewCache(),
                filter: function() { return true; }
            }),
            new HistoryDependentViewCacheDecorator({
                viewCache: new ViewCache(),
                navigationManager: new frameworkMocks.MockHistoryBasedNavigationManager()
            })
        ],
        viewRemovedLog = [];

    $.each(viewCacheDecorators, function(_, decorator) {
        viewRemovedLog = [];

        decorator.on("viewRemoved", function(e) {
            viewRemovedLog.push(e.viewInfo);
        });

        decorator.setView("test", { key: "test" });
        decorator.removeView("test");
        assert.equal(viewRemovedLog.length, 1);
    });
});
