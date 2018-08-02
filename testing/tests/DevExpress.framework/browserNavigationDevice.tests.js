var HistoryBasedNavigationDevice = require("framework/navigation_devices").HistoryBasedNavigationDevice,

    frameworkMocks = require("../../helpers/frameworkMocks.js"),

    SESSION_KEY = "dxPhoneJSApplication",
    ROOT_PAGE_URL = "__root__";

QUnit.module("browserNavigationDevice", {
    beforeEach: function() {
        sessionStorage.removeItem(SESSION_KEY);
    },
    afterEach: function() {
        sessionStorage.removeItem(SESSION_KEY);
    }
});

QUnit.test("API methods", function(assert) {
    var browserAdapter = new frameworkMocks.MockBrowserAdapter(),
        navigationDevice = new frameworkMocks.MockStackBasedNavigationDevice({
            browserAdapter: browserAdapter
        });

    navigationDevice.init().done(function() {
        assert.equal(browserAdapter.__callHistory.length, 3);
        assert.equal(browserAdapter.__callHistory[0].name, "getHash");
        assert.equal(browserAdapter.__callHistory[1].name, "createRootPage");
        assert.equal(browserAdapter.__callHistory[2].name, "pushState");

        navigationDevice.setUri("test").done(function() {
            assert.equal(browserAdapter.__callHistory.length, 4);
            assert.equal(browserAdapter.__callHistory[3].name, "replaceState");
            assert.equal(browserAdapter.__callHistory[3].args[0], "test");

            navigationDevice.back().done(function() {
                assert.equal(browserAdapter.__callHistory.length, 5);
                assert.equal(browserAdapter.__callHistory[4].name, "back");

                navigationDevice.getUri();
                assert.equal(browserAdapter.__callHistory.length, 6);
                assert.equal(browserAdapter.__callHistory[5].name, "getHash");
            });
        });
    });
});

QUnit.test("test canWorkInPureBrowser property", function(assert) {
    var browserAdapter = new frameworkMocks.MockBrowserAdapter({ canWorkInPureBrowser: false }),
        navigationDevice = new frameworkMocks.MockStackBasedNavigationDevice({
            browserAdapter: browserAdapter
        });

    navigationDevice.init().done(function() {

        assert.equal(browserAdapter.__callHistory.length, 0);

        navigationDevice.setUri("test").done(function() {
            assert.equal(browserAdapter.__callHistory.length, 1);
            assert.equal(browserAdapter.__callHistory[0].name, "replaceState");
            assert.equal(browserAdapter.__callHistory[0].args[0], "test");

            navigationDevice.back().done(function() {
                assert.equal(browserAdapter.__callHistory.length, 2);
                assert.equal(browserAdapter.__callHistory[1].name, "back");

                navigationDevice.getUri();
                assert.equal(browserAdapter.__callHistory.length, 3);
                assert.equal(browserAdapter.__callHistory[2].name, "getHash");
            });
        });
    });
});

QUnit.test("popState", function(assert) {
    var browserAdapter = new frameworkMocks.MockBrowserAdapter(),
        navigationDevice = new frameworkMocks.MockStackBasedNavigationDevice({
            browserAdapter: browserAdapter
        }),
        uriChangedHistory = [],
        backInitiatedCount = 0;

    navigationDevice.uriChanged.add(function() {
        uriChangedHistory.push(arguments);
    });
    navigationDevice.backInitiated.add(function() {
        backInitiatedCount++;
    });

    browserAdapter.__hash = "testUri";
    browserAdapter.popState.fire();
    assert.equal(browserAdapter.__callHistory[0].name, "getHash");
    assert.equal(browserAdapter.__callHistory[1].name, "back");
    assert.equal(browserAdapter.__callHistory.length, 2);
    assert.equal(uriChangedHistory.length, 0);
    assert.equal(backInitiatedCount, 0);

    browserAdapter.__hash = ROOT_PAGE_URL;
    browserAdapter.__isRootPage = true;
    browserAdapter.popState.fire();
    assert.equal(uriChangedHistory.length, 1);
    assert.equal(uriChangedHistory[0][0], "testUri");
    assert.equal(backInitiatedCount, 0);

    browserAdapter.popState.fire();
    assert.equal(uriChangedHistory.length, 1);
    assert.equal(backInitiatedCount, 1);
});

QUnit.test("HistoryBasedNavigationDevice", function(assert) {
    var browserAdapter = new frameworkMocks.MockBrowserAdapter(),
        navigationDevice = new HistoryBasedNavigationDevice({
            browserAdapter: browserAdapter
        });

    navigationDevice.setUri("test").done(function() {
        assert.equal(browserAdapter.__callHistory[0].name, "getHash");
        assert.equal(browserAdapter.__callHistory[1].name, "pushState");
        assert.equal(browserAdapter.__callHistory[1].args[0], "test");

        navigationDevice.back().done(function() {
            assert.equal(browserAdapter.__callHistory[2].name, "back");

            navigationDevice.getUri();
            assert.equal(browserAdapter.__callHistory[3].name, "getHash");
        });
    });
});

QUnit.test("navigationDevice.setUri should call pushState or replaceState by consider argument target", function(assert) {
    var browserAdapter = new frameworkMocks.MockBrowserAdapter(),
        navigationDevice = new HistoryBasedNavigationDevice({
            browserAdapter: browserAdapter
        }),
        replaceCurrentUri = true;

    navigationDevice.setUri("test", !replaceCurrentUri).done(function() {
        assert.equal(browserAdapter.__callHistory[0].name, "getHash");
        assert.equal(browserAdapter.__callHistory[1].name, "pushState");
        assert.equal(browserAdapter.__callHistory[1].args[0], "test");

        navigationDevice.setUri("test2", replaceCurrentUri).done(function() {
            assert.equal(browserAdapter.__callHistory[2].name, "replaceState");
            assert.equal(browserAdapter.__callHistory[2].args[0], "test2");
        });
    });
});

QUnit.test("navigationDevice.setUri shouldn't pushState if it equals to the current one (T170505)", function(assert) {
    var browserAdapter = new frameworkMocks.MockBrowserAdapter(),
        navigationDevice = new HistoryBasedNavigationDevice({
            browserAdapter: browserAdapter
        });

    navigationDevice.setUri("test", false).done(function() {
        assert.equal(browserAdapter.__callHistory[0].name, "getHash");
        assert.equal(browserAdapter.__callHistory[1].name, "pushState");
        assert.equal(browserAdapter.__callHistory[1].args[0], "test");

        navigationDevice.setUri("test", false).done(function() {
            assert.equal(browserAdapter.__callHistory[2].name, "getHash");
            assert.ok(!browserAdapter.__callHistory[3]);
        });
    });
});
