var browserAdapters = require("framework/browser_adapters"),
    frameworkMocks = require("../../helpers/frameworkMocks.js"),
    ROOT_PAGE_URL = "__root__";

function performTest(options) {
    QUnit.module(options.adapterName);

    var windowMockConfig = {
            isOldBrowser: options.isOld,
            isAndroid: options.isAndroid
        },
        startHistoryLength = options.isAndroid ? 2 : 1,
        maxHistoryLength = options.historyLess ? 1 : startHistoryLength + 1,
        expectedPopStateCount = options.historyLess ? 0 : 1;

    QUnit.test("basic", function(assert) {
        assert.expect(17);

        var windowMock = new frameworkMocks.MockBrowser(windowMockConfig),
            adapter = new browserAdapters[options.adapterName]({ window: windowMock }),
            popStateFiredCount = 0;

        adapter.popState.add(function() {
            popStateFiredCount++;
        });

        assert.equal(adapter.getHash(), "", "#1");
        assert.equal(windowMock.history.length, 1);

        adapter.createRootPage().always(function() {
            assert.equal(adapter.getHash(), ROOT_PAGE_URL, "#2");
            assert.equal(windowMock.history.length, startHistoryLength);
            assert.equal(popStateFiredCount, 0);

            adapter.pushState("test1").always(function() {
                assert.equal(adapter.getHash(), "test1", "#3");
                assert.equal(windowMock.history.length, maxHistoryLength);
                assert.equal(popStateFiredCount, 0);

                adapter.replaceState("test2").always(function() {
                    assert.equal(adapter.getHash(), "test2", "#4");
                    assert.equal(windowMock.history.length, maxHistoryLength);
                    assert.equal(popStateFiredCount, 0);

                    adapter.back().always(function() {
                        assert.equal(adapter.getHash(), ROOT_PAGE_URL, "#5");
                        assert.equal(windowMock.history.length, maxHistoryLength);
                        assert.equal(popStateFiredCount, expectedPopStateCount);

                        adapter.pushState("test3").always(function() {
                            assert.equal(adapter.getHash(), "test3", "#6");
                            assert.equal(windowMock.history.length, maxHistoryLength);
                            assert.equal(popStateFiredCount, expectedPopStateCount);
                        });
                    });
                });
            });
        });

        for(var i = 5; i--;) {
            windowMock.doEvents();
        }
    });

    if(options.adapterName !== "DefaultBrowserAdapter") {
        QUnit.test("task added in popState handler should not be resolved before hashchange fired", function(assert) {
            assert.expect(0);

            var windowMock = new frameworkMocks.MockBrowser(windowMockConfig),
                adapter = new browserAdapters[options.adapterName]({ window: windowMock });

            adapter.popState.add(function() {
                adapter.replaceState("test2").always(function() {
                    assert.ok(false, "task resolved before hashchange fired");
                });
            });

            adapter.createRootPage().always(function() {
                adapter.pushState("test1");
            });

            for(var i = maxHistoryLength; i--;) {
                windowMock.doEvents();
            }

            windowMock.history.back();
        });
    }
}

performTest({
    adapterName: "DefaultBrowserAdapter",
    isOld: false
});
performTest({
    adapterName: "BuggyAndroidBrowserAdapter",
    isOld: true,
    isAndroid: true
});
performTest({
    adapterName: "OldBrowserAdapter",
    isOld: true
});
performTest({
    adapterName: "HistorylessBrowserAdapter",
    historyLess: true
});
