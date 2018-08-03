var $ = require("jquery"),
    MemoryKeyValueStorage = require("framework/state_manager").MemoryKeyValueStorage,
    processHardwareBackButton = require("mobile/process_hardware_back_button"),
    hardwareBackButton = processHardwareBackButton.processCallback,
    hideTopOverlayCallback = require("mobile/hide_top_overlay").hideCallback,
    HistoryBasedNavigationManager = require("framework/navigation_manager").HistoryBasedNavigationManager,
    StackBasedNavigationManager = require("framework/navigation_manager").StackBasedNavigationManager,
    SESSION_KEY = "dxPhoneJSApplication",

    executeAsyncMock = require("../../helpers/executeAsyncMock.js"),
    frameworkMocks = require("../../helpers/frameworkMocks.js");

QUnit.module("StackBasedNavigationManager", {
    beforeEach: function() {
        executeAsyncMock.setup();
        sessionStorage.removeItem(SESSION_KEY);
        hideTopOverlayCallback.reset();
        hardwareBackButton.empty();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
    }
});

var navigationTargets = HistoryBasedNavigationManager.NAVIGATION_TARGETS;

QUnit.test("Programmatic navigation", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager();
    assert.ok(!manager.currentItem());
    var lastArgs;
    var navigatedCount = 0;
    manager.on("navigated", function(args) {
        lastArgs = args;
        navigatedCount++;
    });
    manager.navigate("view1");
    assert.equal(lastArgs.uri, "view1");
    assert.equal(lastArgs.previousUri, undefined);
    assert.equal(lastArgs.options.stack, "view1", "T292466");
    assert.equal(manager.currentItem().uri, "view1");
    assert.equal(navigatedCount, 1);

    manager.navigate("view1");
    assert.equal(navigatedCount, 1);

    manager.navigate("view2");
    assert.equal(lastArgs.uri, "view2");
    assert.equal(lastArgs.previousUri, "view1");
    assert.equal(manager.currentItem().uri, "view2");
    assert.equal(navigatedCount, 2);
});

QUnit.test("Natural navigation", function(assert) {
    var adapter = new frameworkMocks.MockBrowserAdapter(),
        device = new frameworkMocks.MockStackBasedNavigationDevice({
            browserAdapter: adapter
        }),
        manager = new frameworkMocks.MockStackBasedNavigationManager({
            navigationDevice: device
        });

    manager.init().done(function() {
        assert.equal(device.__methodsHistory[0].methodName, "init");

        device.uriChanged.fire("#test1");

        assert.equal(manager.__callbacksHistory.navigating, 1);
        assert.equal(manager.__callbacksHistory.navigated, 1);
        assert.equal(device.__methodsHistory[1].methodName, "setUri");
        assert.equal(device.__methodsHistory[1].args[0], "#test1");

        device.uriChanged.fire("#test1");

        assert.equal(manager.__callbacksHistory.navigating, 2);
        assert.equal(manager.__callbacksHistory.navigated, 1);
        assert.equal(manager.__callbacksHistory.navigationCanceled, 1);
        assert.equal(device.__methodsHistory[2].methodName, "setUri");
        assert.equal(device.__methodsHistory[2].args[0], "#test1");

        manager.on("navigating", navCancel);
        device.uriChanged.fire("#test2");

        assert.equal(manager.__callbacksHistory.navigating, 3);
        assert.equal(manager.__callbacksHistory.navigated, 1);
        assert.equal(manager.__callbacksHistory.navigationCanceled, 2);
        assert.equal(device.__methodsHistory[3].methodName, "setUri");
        assert.equal(device.__methodsHistory[3].args[0], "#test1");
        manager.off("navigating", navCancel);

        device.uriChanged.fire("#test2");
        assert.equal(manager.__callbacksHistory.navigating, 4);
        assert.equal(manager.__callbacksHistory.navigated, 2);
        assert.equal(device.__methodsHistory[4].methodName, "setUri");
        assert.equal(device.__methodsHistory[4].args[0], "#test2");
    });

    function navCancel(args) {
        args.cancel = true;
    }
});

QUnit.test("Cancel on navigating", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager();
    var navigatedLog = [],
        navigationCanceledLog = [];

    manager.on("navigating", function(args) {
        if(args.uri === "pagetocancel") {
            args.cancel = true;
        }
    });

    manager.on("navigated", function(args) {
        navigatedLog.push(args);
    });

    manager.on("navigationCanceled", function(args) {
        navigationCanceledLog.push(args);
    });

    manager.navigate("index");
    assert.equal(navigatedLog.length, 1, "Index navigated");
    assert.equal(navigationCanceledLog.length, 0);

    manager.navigate("pagetocancel");
    assert.equal(navigatedLog.length, 1, "PageToCancel not navigated");
    assert.equal(navigationCanceledLog.length, 1);
    assert.equal(manager._navigationDevice.getUri(), "index");
});

QUnit.test("Deferred navigation", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager();
    var navigatedLog = [];

    var deferred1 = $.Deferred(),
        deferred2 = $.Deferred();

    manager.on("navigating", function(args) {
        args.navigateWhen.push(deferred1);
        args.navigateWhen.push(deferred2);
    });

    manager.on("navigated", function(args) {
        navigatedLog.push(args);
    });

    manager.navigate("index");
    assert.equal(navigatedLog.length, 0, "Deferreds is not resolved");

    deferred1.resolve();
    assert.equal(navigatedLog.length, 0, "Deferred2 is not resolved");

    deferred2.resolve();
    assert.equal(navigatedLog.length, 1, "Index navigated");
});

QUnit.test("Navigating and Navigated events on equal urls", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager(),
        navigatingLog = [],
        navigatedLog = [],
        navigationCanceledLog = [];

    manager.on("navigating", function(args) {
        navigatingLog.push(args);
    });

    manager.on("navigated", function(args) {
        navigatedLog.push(args);
    });

    manager.on("navigationCanceled", function(args) {
        navigationCanceledLog.push(args);
    });

    manager.navigate("index");
    assert.equal(navigatingLog.length, 1);
    assert.equal(navigatedLog.length, 1);
    assert.equal(navigationCanceledLog.length, 0);

    manager.navigate("index");
    assert.equal(navigatingLog.length, 2);
    assert.equal(navigatedLog.length, 1);
    assert.equal(navigationCanceledLog.length, 1);
});

QUnit.test("Change uri on navigating event", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager(),
        navigatedLog = [];

    manager.on("navigating", function(args) {
        args.uri = "customized";
    });

    manager.on("navigated", function(args) {
        navigatedLog.push(args);
    });

    manager.navigate("index");
    assert.equal(navigatedLog.length, 1);
    assert.equal(navigatedLog[0].uri, "customized");
});

QUnit.test("History filling by sections (like ios AppStore)", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager();

    manager.navigate("view1", { root: true });
    assert.equal(manager.navigationStacks["view1"].items.length, 1);
    assert.equal(manager.navigationStacks["view1"].items[0].uri, "view1");
    assert.equal(manager.navigationStacks["view1"].items[0].key, "view1_0_view1");

    manager.navigate("view2");
    assert.equal(manager.navigationStacks["view1"].items.length, 2);
    assert.equal(manager.navigationStacks["view1"].items[0].uri, "view1");
    assert.equal(manager.navigationStacks["view1"].items[0].key, "view1_0_view1");
    assert.equal(manager.navigationStacks["view1"].items[1].uri, "view2");
    assert.equal(manager.navigationStacks["view1"].items[1].key, "view1_1_view2");

    manager.navigate("view4");
    assert.equal(manager.navigationStacks["view1"].items.length, 3);
    assert.equal(manager.navigationStacks["view1"].currentIndex, 2);
    manager.back();
    assert.equal(manager.navigationStacks["view1"].currentIndex, 1);
    manager.back();
    assert.equal(manager.navigationStacks["view1"].currentIndex, 0);

    manager.navigate("view3", { root: true });
    assert.equal(manager.navigationStacks["view1"].items.length, 3);
    assert.equal(manager.navigationStacks["view3"].items.length, 1);
    assert.equal(manager.navigationStacks["view3"].items[0].uri, "view3");
    assert.equal(manager.navigationStacks["view3"].items[0].key, "view3_0_view3");

    manager.navigate("view2");
    assert.equal(manager.navigationStacks["view1"].items.length, 3);
    assert.equal(manager.navigationStacks["view3"].items.length, 2);
    assert.equal(manager.navigationStacks["view3"].items[0].uri, "view3");
    assert.equal(manager.navigationStacks["view3"].items[0].key, "view3_0_view3");
    assert.equal(manager.navigationStacks["view3"].items[1].uri, "view2");
    assert.equal(manager.navigationStacks["view3"].items[1].key, "view3_1_view2");
});

QUnit.test("Navigate to another stack behavior (reset stack position like Twitter)", function(assert) {
    var adapter = new frameworkMocks.MockBrowserAdapter(),
        device = new frameworkMocks.MockStackBasedNavigationDevice({
            browserAdapter: adapter
        }),
        manager = new frameworkMocks.MockStackBasedNavigationManager({
            navigationDevice: device
        });

    manager.init().done(function() {
        manager.navigate("view1", { root: true });
        manager.navigate("view1_1");
        manager.navigate("view2", { root: true });
        manager.navigate("view2_1");

        manager.navigate("view1", { root: true });
        assert.equal(device.__methodsHistory[device.__methodsHistory.length - 1].methodName, "setUri");
        assert.equal(device.__methodsHistory[device.__methodsHistory.length - 1].args[0], "view1");
        assert.equal(manager.currentItem().uri, "view1");
        assert.ok(!manager.canBack());
    });
});

QUnit.test("Navigate to another stack behavior (preserve stack position like Apply AppStore)", function(assert) {
    var adapter = new frameworkMocks.MockBrowserAdapter(),
        device = new frameworkMocks.MockStackBasedNavigationDevice({
            browserAdapter: adapter
        }),
        manager = new frameworkMocks.MockStackBasedNavigationManager({
            navigationDevice: device,
            keepPositionInStack: true
        });

    manager.init().done(function() {
        manager.navigate("view1", { root: true });
        manager.navigate("view1_1");
        manager.navigate("view2", { root: true });
        manager.navigate("view2_1");

        manager.navigate("view1", { root: true });
        assert.equal(device.__methodsHistory[device.__methodsHistory.length - 1].methodName, "setUri");
        assert.equal(device.__methodsHistory[device.__methodsHistory.length - 1].args[0], "view1_1");
        assert.equal(manager.currentItem().uri, "view1_1");
        assert.ok(manager.canBack());

        manager.back();
        assert.equal(device.__methodsHistory[device.__methodsHistory.length - 1].methodName, "setUri");
        assert.equal(device.__methodsHistory[device.__methodsHistory.length - 1].args[0], "view1");
        assert.equal(manager.currentItem().uri, "view1");
    });
});

QUnit.test("Navigation with a specified stack ID", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager();

    manager.navigate("view1", { stack: "stack1" });
    assert.equal(manager.navigationStacks["stack1"].items.length, 1);
    assert.equal(manager.navigationStacks["stack1"].items[0].uri, "view1");
    assert.equal(manager.navigationStacks["stack1"].items[0].key, "view1_0_view1");

    manager.navigate("view2");
    assert.equal(manager.navigationStacks["stack1"].items.length, 2);
    assert.equal(manager.navigationStacks["stack1"].items[0].uri, "view1");
    assert.equal(manager.navigationStacks["stack1"].items[0].key, "view1_0_view1");
    assert.equal(manager.navigationStacks["stack1"].items[1].uri, "view2");
    assert.equal(manager.navigationStacks["stack1"].items[1].key, "view1_1_view2");

    manager.navigate("view3", { stack: "stack2" });
    assert.equal(manager.navigationStacks["stack1"].items.length, 2);
    assert.equal(manager.navigationStacks["stack2"].items.length, 1);
    assert.equal(manager.navigationStacks["stack2"].items[0].uri, "view3");
    assert.equal(manager.navigationStacks["stack2"].items[0].key, "view3_0_view3");

    manager.navigate("view4", { stack: "stack1" });
    assert.equal(manager.navigationStacks["stack1"].items.length, 3);
    assert.equal(manager.navigationStacks["stack2"].items.length, 1);
    assert.equal(manager.navigationStacks["stack1"].items[0].uri, "view1");
    assert.equal(manager.navigationStacks["stack1"].items[0].key, "view1_0_view1");
    assert.equal(manager.navigationStacks["stack1"].items[1].uri, "view2");
    assert.equal(manager.navigationStacks["stack1"].items[1].key, "view1_1_view2");
    assert.equal(manager.navigationStacks["stack1"].items[2].uri, "view4");
    assert.equal(manager.navigationStacks["stack1"].items[2].key, "view1_2_view4");
});

QUnit.test("clearHistory", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager();

    manager.navigate("view1", { stack: "stack1" });
    assert.equal(manager.navigationStacks["stack1"].items.length, 1);
    assert.equal(manager.currentStack, manager.navigationStacks["stack1"]);

    manager.navigate("view2", { stack: "stack2" });
    assert.equal(manager.navigationStacks["stack2"].items.length, 1);
    assert.equal(manager.currentStack, manager.navigationStacks["stack2"]);

    manager.clearHistory();
    assert.equal(manager.currentStack.items.length, 0);
    assert.equal(manager.navigationStacks["stack1"], undefined);
    assert.equal(manager.navigationStacks["stack2"], undefined);
});

QUnit.test("The 'back' navigation target changes the previous item id if url has changed (B236542)", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager();

    manager.navigate("view1", { root: true });
    manager.navigate("view2");
    manager.navigate("view3");

    manager.navigate("view4", { target: navigationTargets.back });
    assert.equal(manager.navigationStacks["view1"].items.length, 3);
    assert.equal(manager.navigationStacks["view1"].items[0].uri, "view1");
    assert.equal(manager.navigationStacks["view1"].items[0].key, "view1_0_view1");
    assert.equal(manager.navigationStacks["view1"].items[1].uri, "view4");
    assert.equal(manager.navigationStacks["view1"].items[1].key, "view1_1_view4");
    assert.equal(manager.navigationStacks["view1"].items[2].uri, "view3");
    assert.equal(manager.navigationStacks["view1"].items[2].key, "view1_2_view3");
});

QUnit.test("Navigation with target 'back' navigates to current if no previous view", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager();

    manager.navigate("view1", { root: true });
    manager.navigate("view2", { target: navigationTargets.back });

    assert.equal(manager.navigationStacks["view1"].items.length, 1);
    assert.equal(manager.navigationStacks["view1"].items[0].uri, "view2");
    assert.equal(manager.navigationStacks["view1"].items[0].key, "view2_0_view2");
});

QUnit.test("Navigating back with two same consequent urls in stack (T158018)", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager();

    manager.navigate("view1");
    manager.navigate("view2");
    manager.navigate("view1", { target: navigationTargets.current });

    assert.equal(manager.navigationStacks["view1"].items.length, 2);
    assert.equal(manager.navigationStacks["view1"].items[0].uri, "view1");
    assert.equal(manager.navigationStacks["view1"].items[0].key, "view1_0_view1");
    assert.equal(manager.navigationStacks["view1"].items[1].uri, "view1");
    assert.equal(manager.navigationStacks["view1"].items[1].key, "view1_1_view1");
    assert.equal(manager.navigationStacks["view1"].currentIndex, 1);

    manager.back();

    assert.equal(manager.navigationStacks["view1"].items.length, 2);
    assert.equal(manager.navigationStacks["view1"].items[0].uri, "view1");
    assert.equal(manager.navigationStacks["view1"].items[0].key, "view1_0_view1");
    assert.equal(manager.navigationStacks["view1"].items[1].uri, "view1");
    assert.equal(manager.navigationStacks["view1"].items[1].key, "view1_1_view1");
    assert.equal(manager.navigationStacks["view1"].currentIndex, 0, "Navigation performed");

});

QUnit.test("Target view stack should be searched by root view not by stack name (T236767)", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager();

    manager.navigate("view1", { root: true });
    manager.navigate("view2", { target: "current" });
    manager.navigate("view3");
    manager.back();
    manager.navigate("view4", { root: true });
    manager.navigate("view2", { root: true });
    manager.navigate("view3");
    manager.back({ stack: "view1" });

    assert.equal(manager.currentItem().uri, "view2", "T236767");

    assert.equal(manager.navigationStacks["view1"].items.length, 2);
    assert.equal(manager.navigationStacks["view1"].items[0].uri, "view2");
    assert.equal(manager.navigationStacks["view1"].items[0].key, "view2_0_view2");
    assert.equal(manager.navigationStacks["view1"].items[1].uri, "view3");
    assert.equal(manager.navigationStacks["view1"].items[1].key, "view2_1_view3");

    assert.equal(manager.navigationStacks["view4"].items.length, 1);
    assert.equal(manager.navigationStacks["view4"].items[0].uri, "view4");
    assert.equal(manager.navigationStacks["view4"].items[0].key, "view4_0_view4");
});

QUnit.test("Uri is changed in the navigation history while using { target: current } (Q498147)", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager(),
        log = [];

    manager.on("navigated", function(args) {
        log.push(args);
    });

    manager.navigate("home", { root: true });
    assert.equal(log[0].item.uri, "home");

    manager.navigate("current", { target: "current" });
    assert.equal(log[1].item.uri, "current");

    manager.navigate("about", { root: true });
    assert.equal(log[2].item.uri, "about");

    manager.navigate("home");
    assert.equal(log[3].item.uri, "home");
});

QUnit.test("Using { target: current } with empty history (B235737)", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager(),
        log = [];

    manager.on("navigated", function(args) {
        log.push(args);
    });

    manager.navigate("home", { target: "current" });
    assert.equal(log[0].item.uri, "home");
});

QUnit.test("Switch to existent stack", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager();

    manager.navigate("view1", { root: true });
    manager.navigate("view1_1");
    manager.navigate("view2", { root: true });
    manager.navigate("view1");

    assert.equal(manager.navigationStacks["view1"].items.length, 2);
    assert.equal(manager.navigationStacks["view2"].items.length, 2);
    assert.strictEqual(manager.navigationStacks["view2"], manager.currentStack);
    assert.equal("view1", manager.currentItem().uri);
});

QUnit.test("Navigate to root of the current stack", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager({ keepPositionInStack: true });

    manager.navigate("view1", { root: true });
    manager.navigate("view1_1");
    assert.equal(manager.currentItem().uri, "view1_1");
    assert.equal(manager.navigationStacks["view1"].currentIndex, 1);
    manager.navigate("view1", { root: true });
    assert.equal(manager.navigationStacks["view1"].items.length, 2);
    assert.equal(manager.currentItem().uri, "view1");
    assert.equal(manager.navigationStacks["view1"].currentIndex, 0);
});

QUnit.test("Autocalculated 'root' navigatedArgs property (for native layouts)", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager(),
        log = [];

    manager.on("navigated", function(args) {
        log.push(args);
    });

    manager.navigate("view1");
    manager.navigate("view1_1");
    manager.navigate("view2", { root: true });
    manager.navigate("view1", { root: true });
    manager.navigate("view2");

    assert.ok(log[0].options.root);
    assert.ok(!log[1].options.root);
    assert.ok(log[2].options.root);
    assert.ok(log[3].options.root);
    assert.ok(!log[4].options.root);
});

QUnit.test("Navigation direction calculation", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager(),
        log = [];

    manager.on("navigated", function(args) {
        log.push(args);
    });

    assert.equal(log.length, 0);

    manager.navigate("view1", { root: true });
    assert.equal(log.length, 1);
    assert.equal(log[0].options.direction, "none");

    manager.navigate("view1_1");
    assert.equal(log.length, 2);
    assert.equal(log[1].options.direction, "forward");

    manager.navigate("view1_2", { target: "current" });
    assert.equal(log.length, 3);
    assert.equal(log[2].options.direction, "none");

    manager.back();
    assert.equal(log.length, 4);
    assert.equal(log[3].options.direction, "backward");

    manager.navigate("view2", { root: true });
    assert.equal(log.length, 5);
    assert.equal(log[4].options.direction, "none");

    manager.navigate("view2_1");
    assert.equal(log.length, 6);
    assert.equal(log[5].options.direction, "forward");

    manager.navigate("view2_2");
    assert.equal(log.length, 7);
    assert.equal(log[6].options.direction, "forward");

    manager.navigate("view2_1");
    assert.equal(log.length, 8);
    assert.equal(log[7].options.direction, "forward");

    manager.navigate("view2_2", { direction: "none" });
    assert.equal(log.length, 9);
    assert.equal(log[8].options.direction, "none");

    manager.back();
    assert.equal(log.length, 10);
    assert.equal(log[9].options.direction, "none");

    manager.navigate("view3", { root: true });
    assert.equal(log.length, 11);
    assert.equal(log[10].options.direction, "none");

    manager.navigate("view3_1");
    assert.equal(log.length, 12);
    assert.equal(log[11].options.direction, "forward");

    manager.navigate("view3", { root: true });
    assert.equal(log.length, 13);
    assert.equal(log[12].options.direction, "none");


});

QUnit.test("Navigation direction calculation (B235738)", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager(),
        log = [];

    manager.on("navigated", function(args) {
        log.push(args);
    });

    assert.equal(log.length, 0);

    manager.navigate("products", { root: true });
    assert.equal(log.length, 1);
    assert.equal(log[0].options.direction, "none");

    manager.navigate("products_detail");
    assert.equal(log.length, 2);
    assert.equal(log[1].options.direction, "forward");

    manager.navigate("products_edit", { direction: "none" });
    assert.equal(log.length, 3);
    assert.equal(log[2].options.direction, "none");

    manager.navigate("products_detail", { target: navigationTargets.back });
    assert.equal(log.length, 4);
    assert.equal(log[3].options.direction, "none");

    manager.back();
    assert.equal(log.length, 5);
    assert.equal(log[4].options.direction, "backward");

});

QUnit.test("Unexpected navigation item (regression)", function(assert) {
    var adapter = new frameworkMocks.MockBrowserAdapter(),
        device = new frameworkMocks.MockStackBasedNavigationDevice({
            browserAdapter: adapter
        }),
        manager = new frameworkMocks.MockStackBasedNavigationManager({
            navigationDevice: device
        });
    var store = new MemoryKeyValueStorage();

    manager.init().done(function() {
        manager.navigate("view1", { root: true });
        manager.saveState(store);

        // simulate F5 press
        manager = new frameworkMocks.MockStackBasedNavigationManager({ navigationDevice: device });
        manager.init().done(function() {
            manager.restoreState(store);
            manager.navigate();

            assert.equal(manager.currentStack.items.length, 1);
        });
    });

});

QUnit.test("Remove items strategy", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager();
    var itemRemovedLog = [];

    manager.on("itemRemoved", function(item) {
        itemRemovedLog.push(item);
    });

    manager.navigate("view1", { root: true });
    manager.navigate("view2");
    manager.navigate("view3");
    manager.navigate("view4");

    assert.equal(manager.currentStack.items.length, 4);
    assert.equal(manager.currentItem().uri, "view4");
    assert.equal(itemRemovedLog.length, 0);

    manager.back();

    assert.equal(manager.currentStack.items.length, 4);
    assert.equal(manager.currentItem().uri, "view3");
    assert.equal(itemRemovedLog.length, 0);

    manager.navigate("view5");

    assert.equal(manager.currentStack.items.length, 4);
    assert.equal(manager.currentItem().uri, "view5");
    assert.equal(itemRemovedLog.length, 1);
    assert.equal(itemRemovedLog[0].uri, "view4");

    manager.back();

    assert.equal(manager.currentStack.items.length, 4);
    assert.equal(manager.currentItem().uri, "view3");
    assert.equal(itemRemovedLog.length, 1);

    manager.navigate("view5");

    assert.equal(manager.currentStack.items.length, 4);
    assert.equal(manager.currentItem().uri, "view5");
    assert.equal(itemRemovedLog.length, 1);

    manager.navigate("view6", { target: navigationTargets.current });

    assert.equal(manager.currentStack.items.length, 4);
    assert.equal(manager.currentItem().uri, "view6");
    assert.equal(itemRemovedLog.length, 2);
});

QUnit.test("canBack", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager();

    assert.ok(!manager.canBack());

    manager.navigate("view1");
    assert.ok(!manager.canBack());

    manager.navigate("view2");
    assert.ok(manager.canBack());

    manager.back();
    assert.ok(!manager.canBack());

    manager.navigate("view3");
    assert.ok(manager.canBack());

    manager.navigate("view4", { root: true });
    assert.ok(!manager.canBack());
    assert.ok(manager.canBack("view1"));

    assert.ok(!manager.canBack("view5")); // T392438
});

QUnit.test("canBack (Q520857)", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager();

    assert.ok(!manager.canBack());

    manager.navigate("about", { root: true });
    assert.ok(!manager.canBack());

    manager.navigate("view2");
    assert.ok(manager.canBack());

    manager.navigate("page2", { root: true });
    assert.ok(!manager.canBack());

    manager.navigate("about", { root: true });
    assert.ok(!manager.canBack());

    manager.navigate("view2");
    assert.ok(manager.canBack());
});

// test("B250921: canBack and overlay (hideTopOverlayCallback)", function(assert) {
QUnit.test("Q579100: canBack doesn't depend on overlay visibility", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager();
    manager.navigate("view1");
    var overlayHide = false;
    hideTopOverlayCallback.add(function() { overlayHide = true; });
    assert.ok(!overlayHide);
    // ok(manager.canBack());
    assert.ok(!manager.canBack());// behavior is changed to opposite. See the Q579100 notes
    assert.ok(!overlayHide);
    hideTopOverlayCallback.fire();
    assert.ok(overlayHide);
    assert.ok(!manager.canBack());
});

QUnit.test("fire back button then navigate back", function(assert) {
    var device = new frameworkMocks.MockStackBasedNavigationDevice(),
        manager = new frameworkMocks.MockStackBasedNavigationManager({ navigationDevice: device }),
        overlayHide,
        cancelNavigation;

    manager.navigate("view1");
    manager.navigate("view2");
    manager.navigate("view3");

    cancelNavigation = true;
    manager.on("navigatingBack", function(e) {
        e.cancel = cancelNavigation;
    });
    manager.back();
    assert.equal(manager.currentItem().uri, "view3", "cancelNavigation = true");

    cancelNavigation = false;
    manager.back();
    assert.equal(manager.currentItem().uri, "view2", "cancelNavigation = false");

    hideTopOverlayCallback.add(function() {
        overlayHide = true;
    });

    overlayHide = false;
    device.backInitiated.fire();
    assert.ok(overlayHide);
    assert.equal(manager.currentItem().uri, "view2", "close overlay");

    overlayHide = false;
    device.backInitiated.fire();
    assert.ok(!overlayHide);
    assert.equal(manager.currentItem().uri, "view1", "go back");
});

// B250877 fix rolled back, since it has been fixed on the overlay widget level
// test("B250877:fire backButton to hide overlay before navigate", function(assert) {
QUnit.test("B251641: Navigating via app.navigate() shouldn't raise hideTopOverlayCallback", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager();
    var overlayHide = false;
    manager.navigate("view1");
    hideTopOverlayCallback.add(function() {
        overlayHide = true;
    });
    manager.navigate("view2");
    assert.ok(!overlayHide);
    assert.equal(manager.currentItem().uri, "view2");
});

QUnit.test("Q564000: Navigating via app.back() shouldn't raise hideTopOverlayCallback", function(assert) {
    var manager = new frameworkMocks.MockStackBasedNavigationManager();
    manager.navigate("view1");
    manager.navigate("view2");
    var overlayHide = false;
    hideTopOverlayCallback.add(function() {
        overlayHide = true;
    });
    manager.back();
    assert.ok(!overlayHide);
    assert.equal(manager.currentItem().uri, "view1");
});

QUnit.test("Navigating via hardware button should raise backButtonCallback", function(assert) {
    var browser = new frameworkMocks.MockBrowser(),
        device = new frameworkMocks.MockStackBasedNavigationDevice({ window: browser }),
        manager = new frameworkMocks.MockStackBasedNavigationManager({ navigationDevice: device }),
        backButtonCallbackRaised = false;

    manager.init().done(function() {
        manager.navigate("view1");
        manager.navigate("view2");

        hideTopOverlayCallback.add(function() {
            backButtonCallbackRaised = true;
        });

        browser.history.back();
        assert.ok(backButtonCallbackRaised, "backButtonCallback raised");
        assert.equal(manager.currentItem().uri, "view2", "navigation canceled");
        assert.equal(browser.location.hash, "#view2", "browser has is not changed"); // B250090

        backButtonCallbackRaised = false;

        browser.history.back();
        assert.ok(!backButtonCallbackRaised, "backButtonCallback is not raised since the previously registered handler was removed by backButtonCallback implementation");
        assert.equal(manager.currentItem().uri, "view1", "navigation is not canceled");
        assert.equal(browser.location.hash, "#view1", "browser has is not changed");
    });
});

QUnit.test("isHardwareButton argument", function(assert) {
    var device = new frameworkMocks.MockStackBasedNavigationDevice(),
        manager = new frameworkMocks.MockStackBasedNavigationManager({ navigationDevice: device }),
        navigatingBackLog = [];

    manager.navigate("view1");
    manager.navigate("view2");
    manager.navigate("view3");

    manager.on("navigatingBack", function(args) {
        navigatingBackLog.push(args);
    });

    device.backInitiated.fire();
    assert.equal(navigatingBackLog.length, 1, "navigatingBack raised");
    assert.ok(navigatingBackLog[0].isHardwareButton, "isHardwareButton argument is set to true if navigated via device back button");

    manager.back();
    assert.equal(navigatingBackLog.length, 2, "navigatingBack raised for the second time");
    assert.ok(!navigatingBackLog[1].isHardwareButton, "isHardwareButton argument isn't set when programmatically navigated");
});

QUnit.test("Forcing the hardware back button navigation from the outside using the processHardwareBackButton method", function(assert) {
    var device = new frameworkMocks.MockStackBasedNavigationDevice(),
        manager = new frameworkMocks.MockStackBasedNavigationManager({ navigationDevice: device }),
        navigatingBackLog = [],
        backButtonCallbackLog = [];

    manager.navigate("view1");
    manager.navigate("view2");
    manager.navigate("view3");

    manager.on("navigatingBack", function(args) {
        navigatingBackLog.push(args);
    });

    hideTopOverlayCallback.add(function(args) {
        backButtonCallbackLog.push(args);
    });

    processHardwareBackButton();
    assert.equal(backButtonCallbackLog.length, 1, "backButtonCallbackLog is raised and removed the handler");
    assert.equal(navigatingBackLog.length, 0, "navigatingBack is not raised since the backButtonCallback had the handler");

    processHardwareBackButton();
    assert.equal(backButtonCallbackLog.length, 1, "backButtonCallbackLog is not raised (handler was removed)");
    assert.equal(navigatingBackLog.length, 1, "navigatingBack is raised");
    assert.ok(navigatingBackLog[0].isHardwareButton, "isHardwareButton argument is set to true if navigated via device back button");
});

QUnit.test("navigation after restoreState", function(assert) {
    var adapter = new frameworkMocks.MockBrowserAdapter(),
        device = new frameworkMocks.MockStackBasedNavigationDevice({
            browserAdapter: adapter
        }),
        manager = new frameworkMocks.MockStackBasedNavigationManager({
            navigationDevice: device
        }),
        store = new MemoryKeyValueStorage();

    var navigatedCount = 0;

    manager.on("navigated", function(args) {
        navigatedCount++;
    });

    manager.init().done(function() {
        manager.navigate("view1", { root: true });
        manager.saveState(store);

        assert.equal(navigatedCount, 1);
        assert.equal(navigatedCount, 1);

        manager = new frameworkMocks.MockStackBasedNavigationManager({ navigationDevice: device });
        manager.on("navigated", function(args) {
            navigatedCount++;
        });

        manager.init().done(function() {
            manager.restoreState(store);
            manager.navigate();

            assert.equal(navigatedCount, 2);
            assert.equal(navigatedCount, 2);
        });
    });
});

QUnit.test("T112608 - The HtmApplication.saveState method does not keep the navigation stack items", function(assert) {
    var adapter = new frameworkMocks.MockBrowserAdapter(),
        device = new frameworkMocks.MockStackBasedNavigationDevice({
            browserAdapter: adapter
        }),
        manager = new frameworkMocks.MockStackBasedNavigationManager({
            navigationDevice: device
        }),
        store = new MemoryKeyValueStorage();

    manager.init().done(function() {
        manager.navigate("view1", { root: true });
        manager.navigate("view1_1");
        manager.saveState(store);

        manager = new frameworkMocks.MockStackBasedNavigationManager({ navigationDevice: device });
        manager.init().done(function() {
            manager.restoreState(store);
            manager.navigate();

            assert.equal(manager.currentStack.items.length, 2);
        });
    });
});

QUnit.test("Save empty state", function(assert) {
    var adapter = new frameworkMocks.MockBrowserAdapter(),
        device = new frameworkMocks.MockStackBasedNavigationDevice({
            browserAdapter: adapter
        }),
        manager = new frameworkMocks.MockStackBasedNavigationManager({
            navigationDevice: device
        }),
        store = new MemoryKeyValueStorage();

    manager.init().done(function() {
        manager.navigate("view1");
        manager.saveState(store);

        manager = new frameworkMocks.MockStackBasedNavigationManager({ navigationDevice: device });
        manager.init().done(function() {
            manager.saveState(store);// save empty state over the saved state with view1
            manager.restoreState(store);

            assert.equal(manager.currentStack.items.length, 0);
        });
    });
});

QUnit.test("T195351: Split layout - Navigation state is not restored when a web page is refreshed on Desktop", function(assert) {
    var adapter = new frameworkMocks.MockBrowserAdapter(),
        device = new frameworkMocks.MockStackBasedNavigationDevice({
            browserAdapter: adapter
        }),
        manager = new frameworkMocks.MockStackBasedNavigationManager({
            navigationDevice: device
        }),
        store = new MemoryKeyValueStorage();

    manager.init().done(function() {
        manager.navigate("view1", { root: true });
        manager.navigate("view1_1");
        manager.navigate("view2", { root: true });
        manager.navigate("view2_1");
        manager.saveState(store);

        manager = new frameworkMocks.MockStackBasedNavigationManager({ navigationDevice: device });
        manager.init().done(function() {
            manager.restoreState(store);

            assert.equal(manager.currentStack.items.length, 2);
            assert.equal(manager.currentItem().uri, "view2_1");
            assert.equal(manager.currentStack, manager.navigationStacks["view2"]);
            assert.ok(manager.navigationStacks["view1"]);
            assert.equal(manager.navigationStacks["view1"].items.length, 2);
        });
    });
});

QUnit.module("HistoryBasedNavigationManager", {
    beforeEach: function() {
        executeAsyncMock.setup();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
    }
});

QUnit.test("navigate", function(assert) {
    var device = new frameworkMocks.MockHistoryBasedNavigationDevice(),
        manager = new HistoryBasedNavigationManager({ navigationDevice: device });

    var lastArgs,
        navigatedCount = 0;

    manager.on("navigated", function(args) {
        lastArgs = args;
        navigatedCount++;
    });

    assert.ok(!manager.currentItem());

    device.__methodsHistory.length = 0;
    manager.navigate("view1");

    assert.equal(lastArgs.uri, "view1");
    assert.equal(lastArgs.previousUri, undefined);
    assert.equal(lastArgs.options.direction, "none");
    assert.equal(lastArgs.item.uri, "view1");
    assert.equal(lastArgs.item.key, "view1");
    assert.equal(manager.currentItem().uri, "view1");
    assert.equal(navigatedCount, 1);
    assert.equal(device.__methodsHistory.length, 1);
    assert.equal(device.__methodsHistory[0].methodName, "setUri");
    assert.equal(device.__methodsHistory[0].args[0], "view1");

    device.__methodsHistory.length = 0;
    manager.navigate("view2");

    assert.equal(lastArgs.uri, "view2");
    assert.equal(lastArgs.previousUri, "view1");
    assert.equal(lastArgs.options.direction, "none");
    assert.equal(lastArgs.item.uri, "view2");
    assert.equal(lastArgs.item.key, "view2");
    assert.equal(manager.currentItem().uri, "view2");
    assert.equal(navigatedCount, 2);
    assert.equal(device.__methodsHistory.length, 1);
    assert.equal(device.__methodsHistory[0].methodName, "setUri");
    assert.equal(device.__methodsHistory[0].args[0], "view2");

    device.__methodsHistory.length = 0;
    manager.back();

    assert.equal(lastArgs.uri, "view1");
    assert.equal(lastArgs.previousUri, "view2");
    assert.equal(lastArgs.options.direction, "none");
    assert.equal(lastArgs.item.uri, "view1");
    assert.equal(lastArgs.item.key, "view1");
    assert.equal(manager.currentItem().uri, "view1");
    assert.equal(navigatedCount, 3);
    assert.equal(device.__methodsHistory.length, 2);
    assert.equal(device.__methodsHistory[0].methodName, "back");
    assert.equal(device.__methodsHistory[1].methodName, "setUri");
    assert.equal(device.__methodsHistory[1].args[0], "view1");

    device.__methodsHistory.length = 0;
    manager.navigate("view2");
    manager.navigate("_back");

    assert.equal(lastArgs.uri, "view1");
    assert.equal(lastArgs.previousUri, "view2");
    assert.equal(lastArgs.options.direction, "none");
    assert.equal(lastArgs.item.uri, "view1");
    assert.equal(lastArgs.item.key, "view1");
    assert.equal(manager.currentItem().uri, "view1");
    assert.equal(navigatedCount, 5);
    assert.equal(device.__methodsHistory.length, 3);
    assert.equal(device.__methodsHistory[0].methodName, "setUri");
    assert.equal(device.__methodsHistory[1].methodName, "back");
    assert.equal(device.__methodsHistory[2].methodName, "setUri");
});

QUnit.test("cancel navigation", function(assert) {
    var mockWindow = new frameworkMocks.MockBrowser(),
        device = new frameworkMocks.MockHistoryBasedNavigationDevice({ window: mockWindow }),
        manager = new HistoryBasedNavigationManager({ navigationDevice: device });

    var navigatedCount = 0,
        navigatingCount = 0,
        navigationCanceledCount = 0,
        cancelArgs;

    manager.on("navigated", function() {
        navigatedCount++;
    });

    manager.on("navigating", function() {
        navigatingCount++;
    });

    manager.navigate("view1");
    assert.equal(navigatingCount, 1);
    assert.equal(navigatedCount, 1);
    assert.equal(navigationCanceledCount, 0);

    manager.on("navigationCanceled", function(args) {
        cancelArgs = args;
        navigationCanceledCount++;
    });

    manager.navigate("view1", { testOption: 42 });
    assert.equal(navigatingCount, 2);
    assert.equal(navigatedCount, 1);
    assert.equal(navigationCanceledCount, 1);
    assert.equal(cancelArgs.currentUri, "view1");
    assert.equal(cancelArgs.uri, "view1");

    manager.on("navigating", function(args) {
        args.cancel = true;
    });

    cancelArgs = undefined;
    manager.navigate("view2");

    assert.equal(navigatingCount, 3);
    assert.equal(navigatedCount, 1);
    assert.equal(navigationCanceledCount, 2);
    assert.equal(cancelArgs.currentUri, "view1");
    assert.equal(cancelArgs.uri, "view2");
    assert.equal(manager.currentItem().uri, "view1");
    assert.equal(manager._navigationDevice.getUri(), "view1");

    cancelArgs = undefined;
    mockWindow.location.hash = "view2";// navigation via browser address bar
    mockWindow.doEvents();

    assert.equal(navigatingCount, 4);
    assert.equal(navigatedCount, 1);
    assert.equal(navigationCanceledCount, 3);
    assert.equal(cancelArgs.currentUri, "view1");
    assert.equal(cancelArgs.uri, "view2");
    assert.equal(manager.currentItem().uri, "view1");
    assert.equal(manager._navigationDevice.getUri(), "view1", "T187869");
});

QUnit.test("canceling navigation should not add new locations to history (T235562)", function(assert) {
    var mockWindow = new frameworkMocks.MockBrowser(),
        device = new frameworkMocks.MockHistoryBasedNavigationDevice({ window: mockWindow }),
        manager = new HistoryBasedNavigationManager({ navigationDevice: device });

    var navigatedCount = 0,
        navigatingCount = 0,
        navigationCanceledCount = 0;

    var cancelNavigating = function(args) {
        args.cancel = true;
    };

    manager.on("navigating", cancelNavigating);

    manager.on("navigationCanceled", function(args) {
        navigationCanceledCount++;
    });
    manager.on("navigating", function() {
        navigatingCount++;
    });
    manager.on("navigated", function() {
        navigatedCount++;
    });

    manager.navigate();
    assert.equal(navigatingCount, 1);
    assert.equal(navigatedCount, 0);
    assert.equal(navigationCanceledCount, 1);
    assert.equal(mockWindow.history.length, 1);

    manager.off("navigating", cancelNavigating);

    manager.navigate("view1");
    assert.equal(navigatingCount, 2);
    assert.equal(navigatedCount, 1);
    assert.equal(navigationCanceledCount, 1);
    assert.equal(mockWindow.history.length, 1);
});

QUnit.test("Natural navigation", function(assert) {
    assert.expect(2);

    var device = new frameworkMocks.MockHistoryBasedNavigationDevice(),
        manager = new HistoryBasedNavigationManager({ navigationDevice: device });

    manager.on("navigating", function() {
        assert.ok(1);
    });
    manager.on("navigated", function() {
        assert.ok(1);
    });

    device.uriChanged.fire("view1");
});

QUnit.test("navigateWhen", function(assert) {
    var device = new frameworkMocks.MockHistoryBasedNavigationDevice(),
        manager = new HistoryBasedNavigationManager({ navigationDevice: device });

    var d = $.Deferred(),
        navigatedCount = 0;

    manager.on("navigating", function(args) {
        args.navigateWhen.push(d.promise());
    });

    manager.on("navigated", function(assert) {
        navigatedCount++;
    });

    manager.navigate("view1");
    assert.equal(navigatedCount, 0);

    d.resolve();
    assert.equal(navigatedCount, 1);
});

QUnit.test("navigate options", function(assert) {
    var device = new frameworkMocks.MockHistoryBasedNavigationDevice(),
        manager = new HistoryBasedNavigationManager({ navigationDevice: device });

    var navigatedArgs,
        navigatingArgs,
        cancelArgs;

    manager.on("navigated", function(args) {
        navigatedArgs = args;
    });

    manager.on("navigating", function(args) {
        navigatingArgs = args;
    });

    manager.on("navigationCanceled", function(args) {
        cancelArgs = args;
    });

    manager.navigate("view1", { testOption: 42 });
    assert.equal(navigatedArgs.options.testOption, 42);
    assert.equal(navigatingArgs.options.testOption, 42);

    manager.navigate("view1", { testOption: 43 });
    assert.equal(cancelArgs.options.testOption, 43);
    assert.equal(navigatingArgs.options.testOption, 43);
});

QUnit.test("navigation target", function(assert) {
    var device = new frameworkMocks.MockHistoryBasedNavigationDevice(),
        manager = new HistoryBasedNavigationManager({ navigationDevice: device });

    var lastTarget;

    manager.on("navigated", function(args) {
        lastTarget = args.options.target;
    });

    device.__methodsHistory.length = 0;
    manager.navigate("view1");
    assert.equal(lastTarget, navigationTargets.current);
    assert.equal(device.__methodsHistory.length, 1);
    assert.equal(device.__methodsHistory[0].methodName, "setUri");
    assert.equal(device.__methodsHistory[0].args[0], "view1");
    assert.ok(device.__methodsHistory[0].args[1]);

    device.__methodsHistory.length = 0;
    manager.navigate("view2", {
        target: navigationTargets.current
    });

    assert.equal(lastTarget, navigationTargets.current);
    assert.equal(device.__methodsHistory.length, 1);
    assert.equal(device.__methodsHistory[0].methodName, "setUri");
    assert.equal(device.__methodsHistory[0].args[0], "view2");
    assert.ok(device.__methodsHistory[0].args[1]);

    device.__methodsHistory.length = 0;
    device.uriChanged.fire("view1");
    assert.equal(lastTarget, navigationTargets.blank);
    assert.equal(device.__methodsHistory.length, 1);
    assert.equal(device.__methodsHistory[0].methodName, "setUri");
    assert.equal(device.__methodsHistory[0].args[0], "view1");
    assert.ok(!device.__methodsHistory[0].args[1]);
});

QUnit.test("previousItem method", function(assert) {
    var device = new frameworkMocks.MockHistoryBasedNavigationDevice(),
        manager = new HistoryBasedNavigationManager({ navigationDevice: device });

    manager.navigate("view1");
    assert.equal(manager.previousItem(), undefined);

    manager.navigate("view2");
    assert.equal(manager.previousItem().uri, "view1");
    assert.equal(manager.previousItem().key, "view1");

    manager.back();
    assert.equal(manager.previousItem().uri, "view2");
    assert.equal(manager.previousItem().key, "view2");
});

QUnit.test("currentItem method (read)", function(assert) {
    var device = new frameworkMocks.MockHistoryBasedNavigationDevice(),
        manager = new HistoryBasedNavigationManager({ navigationDevice: device });

    manager.navigate("view1");
    assert.equal(manager.currentItem().uri, "view1");
    assert.equal(manager.currentItem().key, "view1");

    manager.navigate("view2");
    assert.equal(manager.currentItem().uri, "view2");
    assert.equal(manager.currentItem().key, "view2");

    manager.back();
    assert.equal(manager.currentItem().uri, "view1");
    assert.equal(manager.currentItem().key, "view1");
});

QUnit.test("currentItem method (write)", function(assert) {
    var device = new frameworkMocks.MockStackBasedNavigationDevice(),
        manager = new StackBasedNavigationManager({ navigationDevice: device });

    manager.navigate("view1", { root: true });
    assert.equal(manager.currentItem().uri, "view1");

    var item1 = manager.currentItem();

    manager.navigate("view1_2");
    assert.equal(manager.currentItem().uri, "view1_2");

    manager.navigate("view2", { root: true });
    assert.equal(manager.currentItem().uri, "view2");

    var item2 = manager.currentItem();

    manager.currentItem(item1);

    assert.equal(manager.currentItem().uri, "view1");
    assert.equal(manager.currentStack, manager.navigationStacks["view1"]);
    assert.equal(manager.currentStack.items[0], manager.currentItem());

    manager.currentItem(item2.key);

    assert.equal(manager.currentItem().uri, "view2");
    assert.equal(manager.currentStack, manager.navigationStacks["view2"]);
    assert.equal(manager.currentStack.items[0], manager.currentItem());
});

QUnit.test("navigating handler can change uri", function(assert) {
    var device = new frameworkMocks.MockHistoryBasedNavigationDevice(),
        mockWindow = device._browserAdapter._window,
        manager = new HistoryBasedNavigationManager({ navigationDevice: device });

    var navigatedArgs;

    manager.on("navigating", function(args) {
        args.uri = "view2";
    });
    manager.on("navigated", function(args) {
        navigatedArgs = args;
    });

    manager.navigate("view1");

    assert.equal(navigatedArgs.uri, "view2");
    assert.equal(manager._navigationDevice.getUri(), "view2");

    mockWindow.location.hash = "view3";// navigation via browser address bar
    mockWindow.doEvents();

    assert.equal(navigatedArgs.uri, "view2");
    assert.equal(manager._navigationDevice.getUri(), "view2", "T188916");
});

QUnit.test("change uri on navigating and manual hash change (T303618)", function(assert) {
    var device = new frameworkMocks.MockHistoryBasedNavigationDevice(),
        mockWindow = device._browserAdapter._window,
        manager = new HistoryBasedNavigationManager({ navigationDevice: device });

    var navigatedArgs;

    manager.on("navigating", function(args) {
        args.uri = "view1";
    });
    manager.on("navigated", function(args) {
        navigatedArgs = args;
    });

    manager.navigate("view1");

    assert.equal(navigatedArgs.uri, "view1");
    assert.equal(manager._navigationDevice.getUri(), "view1");

    navigatedArgs = undefined;

    mockWindow.location.hash = "view2";// navigation via browser address bar
    mockWindow.doEvents();

    assert.equal(navigatedArgs, undefined, "T303618");
    assert.equal(manager._navigationDevice.getUri(), "view1");
});

QUnit.test("uri changed fires hideTopOverlay callback", function(assert) {
    var device = new frameworkMocks.MockHistoryBasedNavigationDevice();

    new HistoryBasedNavigationManager({ navigationDevice: device });

    var hideTopOverlayCallback1Fired = 0,
        hideTopOverlayCallback2Fired = 0;// TODO: rename

    hideTopOverlayCallback.add(function() {
        hideTopOverlayCallback1Fired++;
    });

    hideTopOverlayCallback.add(function() {
        hideTopOverlayCallback2Fired++;
    });

    assert.equal(hideTopOverlayCallback1Fired, 0);
    assert.equal(hideTopOverlayCallback2Fired, 0);

    device.uriChanged.fire();
    assert.equal(hideTopOverlayCallback1Fired, 1);
    assert.equal(hideTopOverlayCallback2Fired, 1);
});
