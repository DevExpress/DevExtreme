var $ = require("jquery"),
    ko = require("knockout"),
    Action = require("core/action"),
    Router = require("framework/router"),
    createExecutors = require("framework/action_executors").createActionExecutors,

    executeAsyncMock = require("../../helpers/executeAsyncMock.js"),
    frameworkMocks = require("../../helpers/frameworkMocks.js");

QUnit.testStart(function() {
    var markup = '                                                                                      \
        <div id="qunit-fixture">                                                                        \
            <div id="testRoutingAction" data-bind="dxAction: route"></div>                              \
            <div id="testRoutingActionWithOptions" data-bind="dxAction: options"></div>                 \
            <div id="testHashAction" data-bind="dxAction: \'#uri/{item}\'"></div>                       \
            <div id="testHashActionMultilevel" data-bind="dxAction: \'#uri/{item.inner}\'"></div>       \
            <div id="testHashActionWithCompoundKeys" data-bind="dxAction: \'#uri/{key1,key2}\'"></div>  \
            <div id="testHashActionWithBindingContext" data-bind="foreach: items">                      \
                <div class="child" data-bind="dxAction: \'#uri/{$parent.name}\'"></div>                 \
            </div>                                                                                      \
        </div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("framework action executors", {
    beforeEach: function() {
        executeAsyncMock.setup();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
    }
});

QUnit.test("framework route action executor", function(assert) {
    var app = new frameworkMocks.MockApplication();
    Action.registerExecutor(createExecutors(app));
    app.router.__formatResult = "testView";

    var vm = {
        route: {
            view: "testView"
        }
    };
    app.router.__parseResult = vm.route;
    ko.applyBindings(vm, $("#testRoutingAction")[0]);

    var element = $("#testRoutingAction");
    element.trigger("dxclick");

    assert.deepEqual(app.router.__formatLog[0], vm.route);
    assert.equal(app.navigationManager.currentItem().uri, "testView");
});

QUnit.test("framework route action executor with options", function(assert) {
    var app = new frameworkMocks.MockApplication(),
        navigatingLog = [];

    Action.registerExecutor(createExecutors(app));

    var vm = {
        options: {
            routeValues: { view: "testView" },
            options: { target: "current", root: true }
        }
    };

    app.router.__formatResult = "testView";
    app.router.__parseResult = vm.options.routeValues;
    app.on("navigating", function(args) {
        navigatingLog.push(args);
    });

    ko.applyBindings(vm, $("#testRoutingActionWithOptions")[0]);

    var element = $("#testRoutingActionWithOptions");
    element.trigger("dxclick");

    assert.deepEqual(app.router.__formatLog[0], vm.options.routeValues);
    assert.equal(app.navigationManager.currentItem().uri, "testView");
    assert.equal(navigatingLog.length, 1);
    assert.equal(navigatingLog[0].options.target, "current");
    assert.equal(navigatingLog[0].options.root, true);
});

QUnit.test("framework hash action executor", function(assert) {
    var router = new Router();
    router.register(":view/:id", { view: "index", id: undefined });
    var app = new frameworkMocks.MockApplication({ router: router });
    Action.registerExecutor(createExecutors(app));

    var vm = {
        item: "test"
    };
    ko.applyBindings(vm, $("#testHashAction")[0]);

    var element = $("#testHashAction");
    element.trigger("dxclick");
    assert.equal(app.navigationManager.currentItem().uri, "uri/test");
});

QUnit.test("framework hash action executor with multilevel model", function(assert) {
    var router = new Router();
    router.register(":view/:id", { view: "index", id: undefined });
    var app = new frameworkMocks.MockApplication({ router: router });
    Action.registerExecutor(createExecutors(app));

    var vm = {
        item: {
            inner: "test"
        }
    };
    ko.applyBindings(vm, $("#testHashActionMultilevel")[0]);

    var element = $("#testHashActionMultilevel");
    element.trigger("dxclick");
    assert.equal(app.navigationManager.currentItem().uri, "uri/test");
});

QUnit.test("framework hash action executor with multilevel observable model", function(assert) {
    var router = new Router();
    router.register(":view/:id", { view: "index", id: undefined });
    var app = new frameworkMocks.MockApplication({ router: router });
    Action.registerExecutor(createExecutors(app));

    var vm = {
        item: ko.observable({
            inner: ko.observable("test")
        })
    };
    ko.applyBindings(vm, $("#testHashActionMultilevel")[0]);

    var element = $("#testHashActionMultilevel");
    element.trigger("dxclick");
    assert.equal(app.navigationManager.currentItem().uri, "uri/test");
});

QUnit.test("framework hash action executor with compound keys (B231203)", function(assert) {
    var router = new Router();
    router.register(":view/:id", { view: "index", id: undefined });
    var app = new frameworkMocks.MockApplication({ router: router });
    Action.registerExecutor(createExecutors(app));

    var vm = {
        key1: "test1",
        key2: "test2"
    };
    ko.applyBindings(vm, $("#testHashActionWithCompoundKeys")[0]);

    var element = $("#testHashActionWithCompoundKeys");
    element.trigger("dxclick");
    assert.equal(decodeURIComponent(app.navigationManager.currentItem().uri), "uri/json:{\"key1\":\"test1\",\"key2\":\"test2\"}");
});

QUnit.test("framework hash action executor with binding context (B234670)", function(assert) {
    var router = new Router();
    router.register(":view/:id", { view: "index", id: undefined });
    var app = new frameworkMocks.MockApplication({ router: router });
    Action.registerExecutor(createExecutors(app));

    var vm = {
        items: [
            {
                name: "test"
            }
        ],
        name: "parent"
    };
    ko.applyBindings(vm, $("#testHashActionWithBindingContext")[0]);

    var element = $("#testHashActionWithBindingContext").children(".child");
    element.trigger("dxclick");
    assert.equal(app.navigationManager.currentItem().uri, "uri/parent");
});

QUnit.test("Framework hash executor with undefined parameter", function(assert) {
    var router = new Router();
    router.register(":view/:id", { view: "index", id: undefined });
    var app = new frameworkMocks.MockApplication({ router: router });
    Action.registerExecutor(createExecutors(app));

    var vm = {
        item: undefined
    };
    ko.applyBindings(vm, $("#testHashAction")[0]);

    var element = $("#testHashAction");
    element.trigger("dxclick");
    assert.equal(app.navigationManager.currentItem().uri, "uri");
});
