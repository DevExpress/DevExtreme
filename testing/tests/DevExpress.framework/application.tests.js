var $ = require("jquery"),
    commonUtils = require("core/utils/common"),
    dataUtils = require("data/utils"),
    devices = require("core/devices"),
    StackBasedNavigationManager = require("framework/navigation_manager").StackBasedNavigationManager,
    ViewCache = require("framework/view_cache"),
    Router = require("framework/router"),
    dxCommand = require("framework/command"),
    MemoryKeyValueStorage = require("framework/state_manager").MemoryKeyValueStorage,
    Application = require("framework/application").Application,

    executeAsyncMock = require("../../helpers/executeAsyncMock.js"),
    frameworkMocks = require("../../helpers/frameworkMocks.js");

QUnit.module("Application", {
    beforeEach: function() {
        executeAsyncMock.setup();
        dataUtils.processRequestResultLock.reset();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        dataUtils.processRequestResultLock.reset();
    }

});

QUnit.test("Execute first action cycle", function(assert) {
    var indexParams,
        indexCallCount = 0,
        actionExecutingCount = 0,
        actionExecutedCount = 0,
        beforeViewSetupArgs,
        afterViewSetupArgs;
    var routeParseResult = { view: "index" };
    var expectedViewInfo = {
        model: {},
        commands: [],
        canBack: false,
        routeData: routeParseResult,
        uri: "some uri",
        key: "some uri_0_some uri",
        viewName: "index",
        previousViewInfo: undefined,
        navigateOptions: {
            direction: "none",
            root: true,
            target: "current",
            stack: "some uri"
        }
    };
    var ns = {
        index: function(params) {
            indexParams = params;
            indexCallCount++;
            return {};
        }
    };
    var app = new frameworkMocks.MockApplication({
        __routeParseResult: routeParseResult,
        __routeFormatResult: "some uri",
        namespace: ns
    });

    app.on("beforeViewSetup", function(args) {
        beforeViewSetupArgs = args;
        actionExecutingCount++;
    });
    app.on("afterViewSetup", function(args) {
        afterViewSetupArgs = args;
        actionExecutedCount++;
    });
    app.navigate("some uri");
    assert.equal(indexCallCount, 1);
    assert.equal(actionExecutingCount, 1);
    assert.equal(actionExecutedCount, 1);
    assert.deepEqual(indexParams, routeParseResult);
    assert.deepEqual(beforeViewSetupArgs, { viewInfo: expectedViewInfo });
    assert.deepEqual(afterViewSetupArgs, { viewInfo: expectedViewInfo });
});

QUnit.test("Show view cycle", function(assert) {
    var routeParseResult = { view: "index" };

    var app = new frameworkMocks.MockApplication({
        __routeParseResult: routeParseResult
    });

    var viewShownCount = 0,
        viewShownArgs,
        modelViewShownCalled = false;

    app.on("viewShown", function(args) {
        viewShownArgs = args;
        viewShownCount++;
    });

    var viewInfo = {
        viewName: "test view",
        model: {}
    };
    app._showView(viewInfo);
    assert.equal(viewShownCount, 1);
    assert.equal(viewShownArgs.viewInfo.viewName, "test view");
    assert.deepEqual(viewShownArgs.viewInfo.model, {});
    assert.equal(app.__showViewLog.length, 1);
    assert.equal(app.__showViewLog[0].viewName, "test view");
    assert.deepEqual(app.__showViewLog[0].model, {});

    viewInfo = {
        viewName: "test view",
        model: {
            data: 0,
            viewShown: function() {
                modelViewShownCalled = true;
            }
        }
    };
    app._showView(viewInfo);
    assert.equal(viewShownCount, 2);
    assert.equal(viewShownArgs.viewInfo.viewName, "test view");
    assert.deepEqual(viewShownArgs.viewInfo.model, viewInfo.model);
    assert.equal(app.__showViewLog.length, 2);
    assert.equal(app.__showViewLog[1].viewName, "test view");
    assert.deepEqual(app.__showViewLog[1].model, viewInfo.model);
    assert.equal(modelViewShownCalled, true);

    viewInfo = {
        viewName: "test view",
        model: {}
    };
});

QUnit.test("Dispose view", function(assert) {

    var viewDisposingLog = [],
        viewDisposedLog = [],
        modelViewDisposingLog = [],
        modelViewDisposedLog = [],
        commandDisposeLog = [];

    var viewInfo = {
        model: {
            viewDisposing: function() {
                modelViewDisposingLog.push(arguments);
            },
            viewDisposed: function() {
                modelViewDisposedLog.push(arguments);
            }
        },
        commands: [
            {
                _dispose: function() {
                    commandDisposeLog.push(arguments);
                }
            }
        ],
        key: "test"
    };

    var cache = new ViewCache(),
        app = new frameworkMocks.MockApplication({
            viewCache: cache
        });

    app._createViewInfo = function() {
        return viewInfo;
    };

    app.on("viewDisposing", function(args) {
        viewDisposingLog.push(args);
    });
    app.on("viewDisposed", function(args) {
        viewDisposedLog.push(args);
    });

    app._acquireViewInfo({ key: "test" });
    cache.removeView("test");
    app._disposeRemovedViews();
    assert.equal(viewDisposingLog.length, 1);
    assert.equal(viewDisposingLog[0].viewInfo, viewInfo);
    assert.equal(modelViewDisposingLog.length, 1);
    assert.equal(viewDisposedLog.length, 1);
    assert.equal(viewDisposedLog[0].viewInfo, viewInfo);
    assert.equal(modelViewDisposedLog.length, 1);
    assert.equal(commandDisposeLog.length, 1);

    // One more time Q483253
    app._acquireViewInfo({ key: "test" });
    cache.removeView("test");
    app._disposeRemovedViews();
    assert.equal(viewDisposingLog.length, 2);
    assert.equal(viewDisposingLog[0].viewInfo, viewInfo);
    assert.equal(modelViewDisposingLog.length, 2);
    assert.equal(viewDisposedLog.length, 2);
    assert.equal(viewDisposedLog[0].viewInfo, viewInfo);
    assert.equal(modelViewDisposedLog.length, 2);
    assert.equal(commandDisposeLog.length, 2);

});

QUnit.test("Pass codebehind arguments", function(assert) {
    var ns = {
        index: function(params, viewInfo) {
            return {
                params: params,
                viewInfo: viewInfo
            };
        }
    };

    var router = new Router();
    router.register(":view/:id", { view: "index", id: undefined });

    var app = new frameworkMocks.MockApplication({
        namespace: ns,
        router: router
    });

    var log = app.__showViewLog;

    app.navigate("index/1");
    assert.equal(log.length, 1);
    assert.equal(log[0].model.params.id, "1");
    assert.equal(log[0].model.viewInfo.viewName, "index");
    assert.equal(log[0].model.viewInfo.routeData.id, "1");
    assert.equal(log[0].model.viewInfo.uri, "index/1");
    assert.ok(log[0].model.viewInfo.key);
    assert.equal(log[0].model.viewInfo.canBack, false);
});


QUnit.test("View navigation stack", function(assert) {
    var ns = {
        index: function() {
            return { data: "index" };
        },
        details: function(params) {
            return { data: "details_" + params.id };
        },
        add: function() {
            return { data: "add" };
        }
    };

    var router = new Router();
    router.register(":view/:id", { view: "index", id: undefined });

    var app = new frameworkMocks.MockApplication({
        namespace: ns,
        router: router
    });

    var log = app.__showViewLog;

    assert.equal(log.length, 0);

    app.navigate("index");
    assert.equal(log.length, 1);
    assert.equal(log[0].model.data, "index");

    app.navigate("details/1");
    assert.equal(log.length, 2);
    assert.equal(log[1].model.data, "details_1");

    app.navigate("index", { target: "back" });
    assert.equal(log.length, 3);
    assert.equal(log[2].model, log[0].model);
    assert.equal(log[2].model.data, "index");

    app.navigate("add");
    assert.equal(log.length, 4);
    assert.equal(log[3].model.data, "add");

    app.navigate("_back");
    assert.equal(log.length, 5);
    assert.equal(log[4].model, log[0].model);
    assert.equal(log[4].model.data, "index");

    app.navigate("details/1");
    assert.equal(log.length, 6);
    assert.equal(log[5].model.data, "details_1");

    app.navigate("details/2");
    assert.equal(log.length, 7);
    assert.equal(log[6].model.data, "details_2");

    app.navigate("_back");
    assert.equal(log.length, 8);
    assert.equal(log[5].model, log[7].model);
    assert.equal(log[7].model.data, "details_1");

    app.navigate("index", { target: "back" });
    assert.equal(log.length, 9);
    assert.equal(log[8].model.data, "index");

    app.navigate("add");
    assert.equal(log.length, 10);
    assert.equal(log[9].model.data, "add");
});

QUnit.test("Redirect on default routing values", function(assert) {
    var appNavigatingLog = [],
        managerNavigatingLog = [],
        managerNavigatedLog = [],
        managerNavigationCanceledLog = [];

    var app = new frameworkMocks.MockApplication({
        router: new Router()
    });
    app.router.register(":view", { view: "home" });

    app.navigationManager.on("navigating", function(args) {
        managerNavigatingLog.push(args);
    });

    app.navigationManager.on("navigated", function(args) {
        managerNavigatedLog.push(args);
    });

    app.navigationManager.on("navigationCanceled", function(args) {
        managerNavigationCanceledLog.push(args);
    });

    app.on("navigating", function(args) {
        appNavigatingLog.push(args);
    });

    app.navigate();

    assert.equal(appNavigatingLog.length, 1);
    assert.equal(appNavigatingLog[0].uri, "home");

    assert.equal(managerNavigatingLog.length, 2);
    assert.equal(managerNavigatingLog[0].uri, "");
    assert.equal(managerNavigatingLog[1].uri, "home");

    assert.equal(managerNavigatedLog.length, 1);
    assert.equal(managerNavigatedLog[0].uri, "home");

    assert.equal(managerNavigationCanceledLog.length, 1);
    assert.equal(managerNavigationCanceledLog[0].uri, "");
    assert.equal(managerNavigationCanceledLog[0].cancelReason, "redirect", "T264514");
});

QUnit.test("Auto create back command", function(assert) {
    var router = new Router();
    router.register(":view/:id", { view: "index", id: undefined });
    var app = new frameworkMocks.MockApplication({
        router: router,
        namespace: {
            index: function() {
                return {
                    title: "index"
                };
            },
            view4: function() {
                return {
                    commands: [new dxCommand({ id: "back", title: "My custom back" })]
                };
            }
        },
        useViewTitleAsBackText: true
    });


    app.navigate("index");
    assert.equal(app.navigationManager.currentStack.items.length, 1);
    assert.equal(app.__showViewLog[0].commands.length, 0);

    app.navigate("view2");
    assert.equal(app.navigationManager.currentStack.items.length, 2);
    assert.equal(app.__showViewLog[1].commands.length, 1);
    assert.equal(app.__showViewLog[1].commands[0].option("id"), "back");
    assert.equal(app.__showViewLog[1].commands[0].option("title"), "index");
    assert.equal(app.__showViewLog[1].commands[0].option("renderStage"), "onViewRendering");

    app.navigate("view3");
    assert.equal(app.navigationManager.currentStack.items.length, 3);
    assert.equal(app.__showViewLog[2].commands.length, 1);
    assert.equal(app.__showViewLog[2].commands[0].option("id"), "back");
    assert.equal(app.__showViewLog[2].commands[0].option("title"), "Back");

    app.navigate("view4");
    assert.equal(app.navigationManager.currentStack.items.length, 4);
    assert.equal(app.__showViewLog[3].commands.length, 1);
    assert.equal(app.__showViewLog[3].commands[0].option("id"), "back");
    assert.equal(app.__showViewLog[3].commands[0].option("title"), "My custom back");

    app = new frameworkMocks.MockApplication({
        router: router,
        namespace: {
            index: function() {
                return {
                    title: "index"
                };
            }
        },
        useViewTitleAsBackText: false
    });


    app.navigate("index");
    app.navigate("view2");
    assert.equal(app.navigationManager.currentStack.items.length, 2);
    assert.equal(app.__showViewLog[1].commands.length, 1);
    assert.equal(app.__showViewLog[1].commands[0].option("id"), "back");
    assert.equal(app.__showViewLog[1].commands[0].option("title"), "Back");
    assert.equal(app.__showViewLog[1].commands[0].option("renderStage"), "onViewShown");

});

QUnit.test("Back command persists its navigation stack key", function(assert) {
    var router = new Router(),
        lastViewInfo;

    router.register(":view/:id", { view: "index", id: undefined });
    var app = new frameworkMocks.MockApplication({
        router: router
    });

    app.on("afterViewSetup", function(args) {
        lastViewInfo = args.viewInfo;
    });


    app.navigate("stack1");
    assert.equal(app.navigationManager.currentStack.items.length, 1);
    assert.equal(app.navigationManager.currentStack, app.navigationManager.navigationStacks.stack1);

    app.navigate("stack1/1");
    assert.equal(app.navigationManager.currentStack.items.length, 2);
    assert.equal(app.navigationManager.currentStack, app.navigationManager.navigationStacks.stack1);

    var testViewInfo = lastViewInfo;

    app.navigate("stack2", { root: true });
    assert.equal(app.navigationManager.currentStack.items.length, 1);
    assert.equal(app.navigationManager.currentStack, app.navigationManager.navigationStacks.stack2);

    app.navigate("stack2/1");
    assert.equal(app.navigationManager.currentStack.items.length, 2);
    assert.equal(app.navigationManager.currentStack, app.navigationManager.navigationStacks.stack2);

    testViewInfo.commands[0].execute();
    assert.equal(app.navigationManager.currentStack.items.length, 2);
    assert.equal(app.navigationManager.currentStack, app.navigationManager.navigationStacks.stack1);
    assert.equal(app.navigationManager.currentStack.currentItem().uri, "stack1");
});

QUnit.test("Not create back command for application.mode == 'webSite'", function(assert) {
    var router = new Router();

    router.register(":view/:id", { view: "index", id: undefined });

    var app = new frameworkMocks.MockApplication({
        mode: "webSite",
        router: router,
        namespace: {
            index: function() {
                return {};
            },
            view3: function() {
                return {
                    commands: [new dxCommand({ id: "back", title: "My custom back" })]
                };
            }
        }
    });

    app.navigate("some uri");
    assert.equal(app.navigationManager.currentStack.items.length, 1);
    assert.equal(app.__showViewLog[0].commands.length, 0);

    app.navigate("view2");
    assert.equal(app.navigationManager.currentStack.items.length, 2);
    assert.equal(app.__showViewLog[1].commands.length, 0);

    app.navigate("view3");
    assert.equal(app.navigationManager.currentStack.items.length, 3);
    assert.equal(app.__showViewLog[2].commands.length, 1);
    assert.equal(app.__showViewLog[2].commands[0].option("title"), "My custom back");
});

QUnit.test("Cancel navigate while navigating (Q525276)", function(assert) {
    var deferred = $.Deferred();

    var MockApplication = frameworkMocks.MockApplication.inherit({
        _showViewImpl: function() {
            this.callBase();
            return deferred;
        }
    });

    var router = new Router();
    router.register(":view");

    var app = new MockApplication({ router: router }),
        navigatedLog = [];

    app.navigationManager.on("navigated", function(args) {
        navigatedLog.push(args);
    });

    app.navigate({
        view: "first"
    });

    app.navigate({
        view: "second"
    });

    app.navigate({
        view: "third"
    });

    deferred.resolve();

    assert.equal(navigatedLog.length, 2);
    assert.equal(navigatedLog[0].uri, "first");
    assert.equal(navigatedLog[1].uri, "third");
});

QUnit.test("B230107 - back is not allowed after using of root navigation", function(assert) {

    var router = new Router();
    router.register(":view/:id", { view: "index", id: undefined });

    var app = new frameworkMocks.MockApplication({
        namespace: {},
        router: router,
        navigation: [{
            onExecute: "#about",
            root: true
        }]
    });

    var navigationManager = app.navigationManager;
    app.navigate("view1");
    assert.ok(!navigationManager.canBack());
    app.navigate("view2");
    assert.ok(navigationManager.canBack());
    app.navigation[0].execute();
    assert.ok(!navigationManager.canBack());
});

QUnit.test("Save-Restore state (complex)", function(assert) {
    var router = new Router();
    router.register(":view/:id", { view: "index", id: undefined });
    var stateStorage = new MemoryKeyValueStorage();
    var createApp = function() {
        return new frameworkMocks.MockApplication({
            router: router,
            namespace: {
                index: function() {
                    return {};
                }
            },
            stateStorage: stateStorage
        });
    };
    var app = createApp();
    app.navigate("index");
    app.saveState();

    app = createApp();
    app.restoreState();
    assert.equal(app.navigationManager.currentItem().uri, "index");
});

QUnit.test("Highlight navigation commands", function(assert) {
    var app = new frameworkMocks.MockApplication({
        router: new Router(),
        navigation: [
            {
                id: "home",
                title: "HOME",
                onExecute: "#home"
            },
            {
                id: "about",
                title: "TEST",
                onExecute: "#about"
            }
        ],
        namespace: {
            home_inner: function() {
                return { currentNavigationItemId: "about" };
            }
        }
    });
    app.router.register(":view", { view: "home" });

    app.navigate();
    assert.ok(app.navigation[0].option("highlighted"));
    assert.ok(!app.navigation[1].option("highlighted"));

    app.navigate("about", { root: true });
    assert.ok(!app.navigation[0].option("highlighted"));
    assert.ok(app.navigation[1].option("highlighted"));

    app.navigate("about_inner");
    assert.ok(!app.navigation[0].option("highlighted"));
    assert.ok(app.navigation[1].option("highlighted"));

    app.navigate("home", { root: true });
    assert.ok(app.navigation[0].option("highlighted"));
    assert.ok(!app.navigation[1].option("highlighted"));

    app.navigate("home_inner");
    assert.ok(!app.navigation[0].option("highlighted"));
    assert.ok(app.navigation[1].option("highlighted"));
});

QUnit.test("Restore highlighted navigation command if navigation is canceled (Q587642)", function(assert) {
    var commandOptionChangedLog = [],
        app = new frameworkMocks.MockApplication({
            router: new Router(),
            disableViewCache: true, // T105609
            navigation: [
                {
                    id: "home",
                    title: "HOME",
                    onExecute: "#home"
                },
                {
                    id: "about",
                    title: "TEST",
                    onExecute: "#about"
                }
            ]
        });
    app.router.register(":view", { view: "home" });

    app.navigation[0].on("optionChanged", function(args) {
        commandOptionChangedLog.push(args);
    });

    assert.equal(commandOptionChangedLog.length, 0);

    app.navigate("home", { root: true });
    assert.ok(app.navigation[0].option("highlighted"));
    assert.ok(!app.navigation[1].option("highlighted"));
    assert.equal(commandOptionChangedLog.length, 1);

    app.on("navigating", function(args) {
        args.cancel = true;
    });

    app.navigate("about", { root: true });
    assert.ok(app.navigation[0].option("highlighted"));
    assert.ok(!app.navigation[1].option("highlighted"));
    assert.equal(commandOptionChangedLog.length, 2);
});

QUnit.test("navigation command is highlighted before a view is shown (T240769)", function(assert) {
    assert.expect(6);

    var app = new frameworkMocks.MockApplication({
            router: new Router(),
            navigation: [
                {
                    id: "home",
                    title: "HOME",
                    onExecute: "#home"
                },
                {
                    id: "about",
                    title: "TEST",
                    onExecute: "#about"
                }
            ]
        }),
        commands = {
            home: app.navigation[0],
            about: app.navigation[1]
        };

    app.router.register(":view", { view: "home" });

    app._showView = function(viewInfo) {
        assert.equal(commands[viewInfo.viewName].option("highlighted"), true);
        return $.Deferred().resolve().promise();
    };

    app.navigate("home", { root: true });
    assert.equal(app.navigation[0].option("highlighted"), true);
    assert.equal(app.navigation[1].option("highlighted"), false);

    app.navigate("about", { root: true });
    assert.equal(app.navigation[0].option("highlighted"), false);
    assert.equal(app.navigation[1].option("highlighted"), true);
});

QUnit.test("B234938 NavbarLayout selects incorrect item", function(assert) {
    var app = new frameworkMocks.MockApplication({
        router: new Router(),
        navigation: [
            {
                title: 'HOME',
                onExecute: '#home'
            },
            {
                title: 'TEST',
                onExecute: '#test'
            }
        ],
        namespace: {}
    });
    app.router.register("home/:key/:code", { view: "home", key: undefined, code: undefined });
    app.router.register(":view", { view: "test" });

    app.navigate("home/", { root: true });
    assert.ok(app.navigation[0].option("highlighted"));
    assert.ok(!app.navigation[1].option("highlighted"));
    app.navigate("test", { root: true });
    assert.ok(!app.navigation[0].option("highlighted"));
    assert.ok(app.navigation[1].option("highlighted"));
});

QUnit.test("B235646 Navbar doesn't highlight current item", function B235646(assert) {
    var app = new frameworkMocks.MockApplication({
        router: new Router(),
        navigation: [
            { title: "Home", onExecute: "#index" },
            { title: "First", onExecute: "#Pages/1" },
            { title: "Second", onExecute: "#Pages/2" }
        ]
    });

    app.router.register("Pages/:categoryId/:id", { view: "Pages", id: undefined });
    app.router.register(":view/:id", { view: "index", id: undefined });

    app.navigate("index", { root: true });
    assert.ok(app.navigation[0].option("highlighted"));
    assert.ok(!app.navigation[1].option("highlighted"));
    assert.ok(!app.navigation[2].option("highlighted"));

    app.navigate("Pages/1", { root: true });
    assert.ok(!app.navigation[0].option("highlighted"));
    assert.ok(app.navigation[1].option("highlighted"));
    assert.ok(!app.navigation[2].option("highlighted"));

    app.navigate("index", { root: true });
    assert.ok(app.navigation[0].option("highlighted"));
    assert.ok(!app.navigation[1].option("highlighted"));
    assert.ok(!app.navigation[2].option("highlighted"));

    app.navigate("Pages/2", { root: true });
    assert.ok(!app.navigation[0].option("highlighted"));
    assert.ok(!app.navigation[1].option("highlighted"));
    assert.ok(app.navigation[2].option("highlighted"));

    app.navigate("Pages/1", { root: true });
    assert.ok(!app.navigation[0].option("highlighted"));
    assert.ok(app.navigation[1].option("highlighted"));
    assert.ok(!app.navigation[2].option("highlighted"));
});

QUnit.test("B235294 - Target option is ignored by the HtmlApplication.navigate function", function(assert) {
    var app = new frameworkMocks.MockApplication({
        router: new Router(),
        navigation: [
            {
                title: 'HOME',
                onExecute: '#home'
            },
            {
                title: 'TEST',
                onExecute: '#test'
            }
        ]
    });
    app.router.register("about1/:id/:id2", { view: "about", id: undefined, id2: undefined });
    app.router.register(":view/:id", { view: "home", id: undefined });

    app.navigate('home');
    app.navigationManager.on("navigated", function(args) {
        assert.equal(args.options.target, "current");
    });
    app.navigate("about", { target: "current" });
});

QUnit.test("RouteValues in app.navigate()", function(assert) {
    var router = new Router();
    router.register(":view/:id", { view: "index", id: undefined });

    var app = new frameworkMocks.MockApplication({
        router: router
    });

    var navigatingLog = [];
    app.navigationManager.on("navigating", function(args) {
        navigatingLog.push(args);
    });

    app.navigate({ view: "product", id: "123" });

    assert.equal(navigatingLog.length, 1);
    assert.equal(navigatingLog[0].uri, "product/123");

    router = new Router();
    router.register(":view");
    app.router = router;

    assert.throws(function() {
        app.navigate({ unknown: "view" });
    });

});

QUnit.test("Initializing state (B253070)", function(assert) {
    var router = new Router(),
        navigationManager = new frameworkMocks.MockStackBasedNavigationManager(),
        navigatedLog = [],
        initializedLog = [],
        initializedArgumentsLength = 0;

    router.register(":view/:id", { view: "index", id: undefined });

    navigationManager.on("navigated", function(args) {
        navigatedLog.push(args);
    });

    var app = new frameworkMocks.MockApplication({
        router: router,
        navigationManager: navigationManager
    });

    app.on("initialized", function(args) {
        initializedLog.push(args);
        initializedArgumentsLength = arguments.length;
    });

    var deferred = $.Deferred();
    app.components.push({
        init: function() {
            return deferred;
        }
    });

    assert.equal(navigatedLog.length, 0);
    assert.equal(initializedLog.length, 0);

    app.navigate();

    assert.equal(navigatedLog.length, 0);
    assert.equal(initializedLog.length, 0);

    assert.throws(function() {
        app.navigate("test");
    });

    assert.equal(navigatedLog.length, 0);
    assert.equal(initializedLog.length, 0);

    deferred.resolve();

    assert.equal(navigatedLog.length, 1);
    assert.equal(initializedLog.length, 1);
    assert.equal(initializedArgumentsLength, 0);
});

QUnit.test("Navigating to an empty uri should do nothing if an app is already navigating somewhere (part of T195351)", function(assert) {
    var router = new Router(),
        navigationManager = new frameworkMocks.MockStackBasedNavigationManager(),
        navigatingLog = [];

    router.register(":view/:id", { view: "index", id: undefined });

    navigationManager.on("navigating", function(args) {
        navigatingLog.push(args);
    });

    var app = new frameworkMocks.MockApplication({
        router: router,
        navigationManager: navigationManager
    });

    app.init();

    assert.equal(navigatingLog.length, 0);

    app.navigate("view1");
    app._showViewImplMockDeferred = $.Deferred();
    app.navigate("view2");
    app.navigate();

    app._showViewImplMockDeferred.resolve();

    assert.equal(navigatingLog.length, 2);
    assert.equal(navigatingLog[0].uri, "view1");
    assert.equal(navigatingLog[1].uri, "view2");
});

QUnit.test("Fail on init component", function(assert) {
    var app = new frameworkMocks.MockApplication(),
        deferred = $.Deferred(),
        errorObject = new Error();

    app.components.push({
        init: function() {
            return deferred;
        }
    });

    try {
        deferred.reject(errorObject);
        app.init();
        assert.ok(false, "doesn't throw");
    } catch(e) {
        assert.strictEqual(e, errorObject);
    }
});

QUnit.test("B253263 - The global navigation active item is highlighted incorrectly in some cases", function(assert) {
    var app = new frameworkMocks.MockApplication({
        router: new Router(),
        navigation: [
            {
                title: "HOME",
                onExecute: "#home"
            },
            {
                title: "ABOUT",
                onExecute: "#about"
            }
        ]
    });
    app.router.register(":view/:id", { view: "home", id: undefined });

    app.navigate();
    assert.ok(app.navigation[0].option("highlighted"));
    assert.ok(!app.navigation[1].option("highlighted"));

    app.navigate("about", {
        root: true
    });
    assert.ok(!app.navigation[0].option("highlighted"));
    assert.ok(app.navigation[1].option("highlighted"));

    app.navigate("home");
    assert.ok(!app.navigation[0].option("highlighted"));
    assert.ok(app.navigation[1].option("highlighted"));
});

QUnit.test("_highlightCurrentNavigationCommand is called when onNavigationCancelled raised (B253596)", function(assert) {
    var app = new frameworkMocks.MockApplication({
        router: new Router(),
        navigation: [
            {
                title: "HOME",
                onExecute: "#home"
            },
            {
                title: "ABOUT",
                onExecute: "#about"
            }
        ]
    });

    app.router.register(":view/:id", { view: "home", id: undefined });
    app.navigate("home");
    app.on("navigating", function(e) {
        if(e.uri === "about") {
            e.cancel = true;
        }
    });

    app.navigation[0].option("highlighted", false);
    app.navigation[1].option("highlighted", true);

    app.navigate("about", { root: true });
    assert.ok(app.navigation[0].option("highlighted"));
    assert.ok(!app.navigation[1].option("highlighted"));
    assert.ok(app.navigation[0].option("highlighted"));
});

QUnit.test("Do not dispose views before the navigation has completed (Q563465)", function(assert) {
    var router = new Router();
    router.register(":view/:id", { view: "index", id: undefined });

    var app = new frameworkMocks.MockApplication({
        router: router,
        disableViewCache: true
    });

    var log = [],
        lastCreatedViewInfo;

    app.on("afterViewSetup", function(e) {
        lastCreatedViewInfo = e.viewInfo;
        app._obtainViewLink(e.viewInfo);
    });
    app.on("viewShown", function(e) {
        log.push({
            event: "viewShown",
            args: e
        });
    });
    app.on("viewDisposed", function(e) {
        log.push({
            event: "viewDisposed",
            args: e
        });
    });

    assert.equal(log.length, 0);

    app.navigate("index");
    assert.equal(log.length, 1);
    assert.equal(log[0].event, "viewShown");
    assert.equal(log[0].args.viewInfo.uri, "index");

    app._releaseViewLink(lastCreatedViewInfo);

    app.navigate("index/1", { target: 'current' });
    assert.equal(log.length, 3);
    assert.equal(log[0].event, "viewShown");
    assert.equal(log[0].args.viewInfo.uri, "index");
    assert.equal(log[1].event, "viewShown");
    assert.equal(log[1].args.viewInfo.uri, "index/1");
    assert.equal(log[2].event, "viewDisposed");
    assert.equal(log[2].args.viewInfo.uri, "index");

});

QUnit.test("navigatingBack event", function(assert) {
    var app = new frameworkMocks.MockApplication({
            router: new Router()
        }),
        navigatingBackLog = [],
        navigatingLog = [],
        cancelBack;

    app.router.register(":view");

    app.navigate('view1');
    app.navigate('view2');

    app.on("navigatingBack", function(args) {
        navigatingBackLog.push(args);
        args.cancel = cancelBack;
    });
    app.on("navigating", function(args) {
        navigatingLog.push(args);
    });

    cancelBack = true;
    app.back();
    assert.equal(navigatingBackLog.length, 1);
    assert.equal(navigatingLog.length, 0);

    cancelBack = false;
    app.back();
    assert.equal(navigatingBackLog.length, 2);
    assert.equal(navigatingLog.length, 1);
});

QUnit.test("navigation manager selecting by mode option", function(assert) {
    var app = new Application();

    assert.equal(app.navigationManager instanceof StackBasedNavigationManager, true);

    app = new Application({
        mode: "webSite"
    });

    assert.equal(app.navigationManager instanceof StackBasedNavigationManager, false);

    app = new Application({
        mode: "mobileApp"
    });

    assert.equal(app.navigationManager instanceof StackBasedNavigationManager, true);

});

QUnit.test("viewLinkHash item is deleted after a view is disposed", function(assert) {
    var app = new frameworkMocks.MockApplication(),
        viewInfo = {
            key: "test"
        };

    assert.ok(app._viewLinksHash["test"] === undefined);
    app._obtainViewLink(viewInfo);
    assert.ok(app._viewLinksHash["test"] !== undefined);

    app._releaseViewLink(viewInfo);
    assert.ok(app._viewLinksHash["test"] !== undefined);

    app._disposeRemovedViews();
    assert.ok(app._viewLinksHash["test"] === undefined);
});

QUnit.module("Application viewCache", {
    beforeEach: function() {
        var that = this;

        this.device = devices.current();
        this.router = new Router();
        this.viewSetupLog = [];
        this.viewSetup = function(args) {
            that.viewSetupLog.push(args);
        };
        executeAsyncMock.setup();
        this.router.register(":view/:id", { view: "index", id: undefined });
    },
    afterEach: function() {
        devices.current(this.device);
        executeAsyncMock.teardown();
        $(".dx-viewport").attr("class", "dx-viewport");
    }
});

QUnit.test("Basic functionality", function(assert) {
    var app = new frameworkMocks.MockApplication({
        router: this.router
    });
    app.init();
    app.on("afterViewSetup", this.viewSetup);

    app.navigate("view1", { root: true });
    app.navigate("view2");
    assert.equal(this.viewSetupLog.length, 2);

    app.navigate("view1", { root: true });
    app.navigate("view2");
    assert.equal(this.viewSetupLog.length, 2);
});

QUnit.test("disableViewCache option", function(assert) {
    var app = new frameworkMocks.MockApplication({
        router: this.router,
        disableViewCache: true
    });
    app.on("afterViewSetup", this.viewSetup);

    this.viewSetupLog.length = 0;
    app.navigate("view1", { root: true });
    app.navigate("view2");
    assert.equal(this.viewSetupLog.length, 2);

    app.navigate("view1", { root: true });
    app.navigate("view2");
    assert.equal(this.viewSetupLog.length, 4);
});

QUnit.test("viewCacheSize option", function(assert) {
    var app = new frameworkMocks.MockApplication({
        router: this.router,
        viewCacheSize: 2
    });
    app.on("afterViewSetup", this.viewSetup);
    this.viewSetupLog.length = 0;

    app.navigate("view1", { root: true });
    app.navigate("view2");
    app.navigate("view1", { root: true });
    assert.equal(this.viewSetupLog.length, 2);

    app.navigate("view2");
    app.navigate("view3");
    app.navigate("view1", { root: true });
    assert.equal(this.viewSetupLog.length, 4);
});

QUnit.test("Lock process data request result", function(assert) {
    assert.expect(2);

    var done = assert.async(),
        MockApplication = frameworkMocks.MockApplication.inherit({
            _showViewImpl: function() {
                var result = this.callBase();
                assert.equal(dataUtils.processRequestResultLock.promise().state(), "pending");
                return result;
            }
        });

    var app = new MockApplication();

    app.on("viewShown", function() {
        assert.equal(dataUtils.processRequestResultLock.promise().state(), "resolved");
        done();
    });

    app._showView({});
});

QUnit.test("resolveViewCacheKey", function(assert) {
    var viewShownLog = [],
        app = new frameworkMocks.MockApplication({
            router: this.router
        });

    app.on("resolveViewCacheKey", function(args) {
        args.key = "test";
    });

    app.on("viewShown", function(args) {
        viewShownLog.push(args);
    });

    app.init();
    app.on("afterViewSetup", this.viewSetup);

    assert.equal(this.viewSetupLog.length, 0);
    assert.equal(viewShownLog.length, 0);

    app.navigate("view1");
    assert.equal(this.viewSetupLog.length, 1);
    assert.equal(viewShownLog.length, 1);
    assert.equal(viewShownLog[0].params.view, "view1");

    var viewInfo = viewShownLog[0].viewInfo;
    assert.equal(viewInfo.viewName, "view1");
    assert.equal(viewInfo.routeData.view, "view1");
    assert.equal(viewInfo.uri, "view1");
    assert.equal(viewInfo.navigateOptions.stack, "view1");
    assert.ok(!viewInfo.canBack);
    assert.ok(!viewInfo.previousViewInfo);

    app.navigate("view2");
    assert.equal(this.viewSetupLog.length, 1);
    assert.equal(viewShownLog.length, 2);
    assert.equal(viewShownLog[1].params.view, "view2");

    viewInfo = viewShownLog[1].viewInfo;
    assert.equal(viewInfo.viewName, "view2");
    assert.equal(viewInfo.routeData.view, "view2");
    assert.equal(viewInfo.uri, "view2");
    assert.equal(viewInfo.navigateOptions.stack, "view1");
    assert.ok(viewInfo.canBack);
    assert.ok(viewInfo.previousViewInfo);

});

QUnit.test("resolveViewCacheKey (T292466)", function(assert) {
    var viewShownLog = [],
        viewInfos = {},
        app = new frameworkMocks.MockApplication({
            router: this.router
        });

    app.on("resolveViewCacheKey", function(args) {
        args.key = args.routeData.view;
    });

    app.on("viewShown", function(args) {
        viewShownLog.push(args);
        viewInfos[args.viewInfo.key] = args.viewInfo;
    });

    app.init();

    app.navigate("view1/1", { root: true });
    app.navigate("view2/1");
    viewInfos["view2"].commands[0].execute();// back

    app.navigate("view1/2", { root: true });
    app.navigate("view2/2");
    viewInfos["view2"].commands[0].execute();// back

    assert.equal(viewShownLog.length, 6);
    assert.equal(viewShownLog[5].params.view, "view1");
    assert.equal(viewShownLog[5].params.id, "2");
});

QUnit.test("view should be disposed on navigation when cache is cleared (T628302)", function(assert) {
    var log = [],
        app = new frameworkMocks.MockApplication({
            router: this.router
        });

    app.on("resolveViewCacheKey", function(args) {
        args.key = args.routeData.view;
    });

    app.on("viewShown", function(e) {
        log.push({
            event: "viewShown",
            args: e
        });
    });
    app.on("viewDisposed", function(e) {
        log.push({
            event: "viewDisposed",
            args: e
        });
    });

    app.init();

    app.navigate("view1", { root: true });
    app.navigate("view2");
    app.viewCache.clear();
    app.navigate("view1");

    assert.equal(log.length, 5);
    assert.equal(log[0].event, "viewShown");
    assert.equal(log[0].args.viewInfo.uri, "view1");
    assert.equal(log[1].event, "viewShown");
    assert.equal(log[1].args.viewInfo.uri, "view2");
    assert.equal(log[2].event, "viewShown");
    assert.equal(log[2].args.viewInfo.uri, "view1");
    assert.equal(log[3].event, "viewDisposed");
    assert.equal(log[3].args.viewInfo.uri, "view2");
    assert.equal(log[4].event, "viewDisposed");
    assert.equal(log[4].args.viewInfo.uri, "view1");
});


QUnit.module("Application (async tests)");

QUnit.test("Perform post-viewShown actions asynchronously (Q468481)", function(assert) {
    var done = assert.async();

    var viewDisposedLog = [],
        viewShownLog = [],
        app = new frameworkMocks.MockApplication(),
        showViewImplDeferred = $.Deferred(),
        viewInfo = {
            model: {},
            key: "view1"
        };

    app._createViewInfo = function() {
        return viewInfo;
    };

    app._showViewImpl = function() {
        return showViewImplDeferred;
    };
    app.on("viewShown", function(args) {
        viewShownLog.push(args);
    });
    app.on("viewDisposed", function(args) {
        viewDisposedLog.push(args);
    });

    app._acquireViewInfo({ key: "view1" });
    app._releaseViewLink({ key: "view1" });
    app._showView({ key: "view2" });
    assert.equal(viewDisposedLog.length, 0);
    assert.equal(viewShownLog.length, 0);
    showViewImplDeferred.resolve();
    assert.equal(viewDisposedLog.length, 0);
    assert.equal(viewShownLog.length, 0);
    commonUtils.executeAsync(function() {
        assert.equal(viewDisposedLog.length, 1);
        assert.equal(viewShownLog.length, 1);
        done();
    });

});
