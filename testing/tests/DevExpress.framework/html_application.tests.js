window.includeThemesLinks();

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    TransitionExecutorModule = require("animation/transition_executor/transition_executor"),
    animationPresetsModule = require("animation/presets/presets"),
    Class = require("core/class"),
    EventsMixin = require("core/events_mixin"),
    initMobileViewportModule = require("mobile/init_mobile_viewport/init_mobile_viewport"),
    Router = require("framework/router"),
    ViewCache = require("framework/view_cache"),
    HtmlApplication = require("framework/html/html_application"),
    devices = require("core/devices"),
    messageLocalization = require("localization/message"),
    device = devices.current(),

    executeAsyncMock = require("../../helpers/executeAsyncMock.js"),
    frameworkMocks = require("../../helpers/frameworkMocks.js"),
    htmlFrameworkMocks = require("../../helpers/htmlFrameworkMocks.js"),
    ajaxMock = require("../../helpers/ajaxMock.js");

require("spa.css!");
require("common.css!");

QUnit.testStart(function() {
    var markup = $('<div id="view-templates">                                                                   \
                <div data-options="dxView: { name: \'test-view\'}">                                             \
                    <div data-options="dxContent: { targetPlaceholder: \'content\' }"></div>                    \
                </div>                                                                                          \
                <div data-options="dxView: { name: \'to-localize\'}">                                           \
                    <div data-options="dxContent: { targetPlaceholder: \'content\' }">@testLocalizedValue</div> \
                </div>                                                                                          \
                </div>                                                                                            \
                                                                                                                \
                <div id="testViewPort"></div>                                                                     \
                <div class="dx-viewport"></div>');

    $("body").append(markup);
});

function createThemeMarkerStyle(themeName) {
    var style = $("<style></style>").attr("type", "text/css"),
        styleText = ".dx-theme-marker { font-family: 'dx." + themeName + "' }";

    if(document.documentMode < 11) {
        style[0].styleSheet.cssText = styleText;
    } else {
        style.html(styleText);
    }

    style.appendTo("body");
    return style;
}


var TestLayoutController = Class.inherit({
    ctor: function(options) {
        this.log = noop;// is overridden by options.log
        $.extend(this, options);
    },
    init: function() {
        this.log("init");
    },
    activate: function() {
        this.log("activate");
        return $.Deferred().resolve().promise();
    },
    ensureActive: function() {
        this.log("activate");
        return $.Deferred().resolve().promise();
    },
    disable: function() {
        this._sleep = true;
        this.log("disable");
        this.fireEvent("viewHidden", [this.lastViewInfo]);
    },
    deactivate: function() {
        this.log("deactivate");
        this.fireEvent("viewHidden", [this.lastViewInfo]);
        this.fireEvent("viewReleased", [this.lastViewInfo]);
        delete this.lastViewInfo;
        return $.Deferred().resolve().promise();
    },
    showView: function(viewInfo, direction) {
        if(this._sleep) {
            this._sleep = false;
            this.fireEvent("viewShowing", [viewInfo, direction]);
            return $.Deferred().resolve().promise();
        }
        this.log("showView");
        if(!viewInfo.renderResult) {
            this.fireEvent("viewRendered", [viewInfo]);
            viewInfo.renderResult = {};
        }
        this.lastViewInfo = viewInfo;
        this.fireEvent("viewShowing", [viewInfo, direction]);
        return $.Deferred().resolve().promise();
    },
    activeViewInfo: function() {
        return this.lastViewInfo;
    },
    renderNavigation: function(navigationCommands) {
        this.log("renderNavigation");
    },
    element: function() {
        return $("<div/>");
    }
}).include(EventsMixin);


var viewTemplatesBackup,
    savedTransitionExecutor;

QUnit.module("HtmlApplication", {
    beforeEach: function() {
        viewTemplatesBackup = $("#view-templates").html();
        executeAsyncMock.setup();
        savedTransitionExecutor = TransitionExecutorModule.TransitionExecutor;
    },
    afterEach: function() {
        devices.current(device);
        executeAsyncMock.teardown();
        $("#view-templates").html(viewTemplatesBackup);
        $(".dx-viewport").attr("class", "dx-viewport");
        animationPresetsModule.presets = new animationPresetsModule.PresetCollection();
        TransitionExecutorModule.TransitionExecutor = savedTransitionExecutor;
    }
});

QUnit.test("viewport css classes attached", function(assert) {
    var style = createThemeMarkerStyle("ios7.default");

    devices.current({
        platform: "ios",
        deviceType: "phone",
        version: [7, 1, 0]
    });

    var app = new htmlFrameworkMocks.MockHtmlApplication(),
        $vp = app.viewPort();

    assert.ok($vp.hasClass("dx-theme-ios7"), "platform class is attached");
    assert.ok($vp.hasClass("dx-device-phone"), "deviceType class is attached");
    style.remove();
});

QUnit.test("Set current view", function(assert) {
    var modelViewRenderedLog = [],
        modelViewShowingLog = [],
        modelViewShownLog = [],
        viewRenderedLog = [],
        viewShowingLog = [],
        viewShownLog = [],
        sequenceLog = [];

    var layoutController = new TestLayoutController({
            log: function(event) {
                sequenceLog.push("controller_" + event);
            }
        }),
        model = {
            viewRendered: function(args) {
                sequenceLog.push("model_viewRendered");
                modelViewRenderedLog.push(args);
            },
            viewShowing: function(args) {
                sequenceLog.push("model_viewShowing");
                modelViewShowingLog.push(args);
            },
            viewShown: function(args) {
                sequenceLog.push("model_viewShown");
                modelViewShownLog.push(args);
            }
        };


    var app = new htmlFrameworkMocks.MockHtmlApplication({
        layoutSet: [{ controller: layoutController }],
        namespace: {
            index: function() {
                return model;
            }
        }
    });

    app.on("viewRendered", function(args) {
        sequenceLog.push("app_viewRendered");
        viewRenderedLog.push(args);
    });
    app.on("viewShowing", function(args) {
        sequenceLog.push("app_viewShowing");
        viewShowingLog.push(args);
    });
    app.on("viewShown", function(args) {
        sequenceLog.push("app_viewShown");
        viewShownLog.push(args);
    });

    app.router.__parseResult = {
        view: "index"
    };

    app.navigate();

    assert.equal(viewRenderedLog.length, 1);
    assert.equal(viewRenderedLog[0].viewInfo.model, model);
    assert.equal(modelViewRenderedLog.length, 1);
    assert.equal(modelViewRenderedLog[0].viewInfo.model, model);
    assert.equal(modelViewShowingLog.length, 1);
    assert.equal(modelViewShowingLog[0].viewInfo.model, model);
    assert.equal(modelViewShownLog.length, 1);
    assert.equal(modelViewShownLog[0].viewInfo.model, model);
    assert.equal(viewShowingLog.length, 1);
    assert.equal(viewShowingLog[0].viewInfo.model, model);
    assert.equal(viewShowingLog[0].direction, "none");
    assert.equal(viewShowingLog[0].params, viewShowingLog[0].viewInfo.routeData);
    assert.equal(viewShownLog.length, 1);
    assert.equal(viewShownLog[0].viewInfo.model, model);

    assert.equal(sequenceLog.length, 10);
    assert.equal(sequenceLog[0], "controller_init");
    assert.equal(sequenceLog[1], "controller_renderNavigation");
    assert.equal(sequenceLog[2], "controller_showView");
    assert.equal(sequenceLog[3], "app_viewRendered");
    assert.equal(sequenceLog[4], "model_viewRendered");
    assert.equal(sequenceLog[5], "app_viewShowing");
    assert.equal(sequenceLog[6], "model_viewShowing");
    assert.equal(sequenceLog[7], "controller_activate");
    assert.equal(sequenceLog[8], "app_viewShown");
    assert.equal(sequenceLog[9], "model_viewShown");
});

QUnit.test("Extend view model from view template", function(assert) {
    var layoutController = new TestLayoutController(),
        model = {
            title: "model title",
            modelProperty: "model property"
        };


    var app = new htmlFrameworkMocks.MockHtmlApplication({
        layoutSet: [{ controller: layoutController }],
        namespace: {
            index: function() {
                return model;
            }
        }
    });

    app.router.__parseResult = {
        view: "index"
    };

    app.viewEngine.__findViewComponentOptions["index"] = {
        title: "template title",
        templateProperty: "template property"
    };

    app.navigate();

    assert.equal(layoutController.activeViewInfo().model.title, "model title");
    assert.equal(layoutController.activeViewInfo().model.modelProperty, "model property");
    assert.equal(layoutController.activeViewInfo().model.templateProperty, "template property");
});

QUnit.test("layoutController method call sequence test", function(assert) {
    var sequenceLog = [],
        done = assert.async();

    var log = function(event) {
        sequenceLog.push(this.name + "_" + event);
    };

    var layoutController = new TestLayoutController({
            name: "c1",
            log: log
        }),
        layoutController2 = new TestLayoutController({
            name: "c2",
            log: log
        });

    var app = new htmlFrameworkMocks.MockHtmlApplication({
        layoutSet: [
            { controller: layoutController },
            { controller: layoutController2, customResolveRequired: true }
        ],
        router: new Router()
    });

    app.router.register(":view");

    app.on("resolveLayoutController", function(args) {
        if(args.viewInfo.viewName === "view2") {
            args.layoutController = layoutController2;
        }
    });

    app.navigate("view1");

    assert.equal(sequenceLog.length, 6);

    assert.equal(sequenceLog[0], "c1_init");
    assert.equal(sequenceLog[1], "c2_init");
    assert.equal(sequenceLog[2], "c1_renderNavigation");
    assert.equal(sequenceLog[3], "c2_renderNavigation");

    assert.equal(sequenceLog[4], "c1_showView");
    assert.equal(sequenceLog[5], "c1_activate");

    sequenceLog.length = 0;
    app.on("viewShown", function() {
        assert.equal(sequenceLog.length, 3);
        assert.equal(sequenceLog[0], "c2_showView");
        assert.equal(sequenceLog[1], "c2_activate");
        assert.equal(sequenceLog[2], "c1_deactivate");

        sequenceLog.length = 0;
        app.off("viewShown");
        app.on("viewShown", function() {
            assert.equal(sequenceLog.length, 3);
            assert.equal(sequenceLog[0], "c1_showView");
            assert.equal(sequenceLog[1], "c1_activate");
            assert.equal(sequenceLog[2], "c2_deactivate");

            done();
        });

        app.back();
    });

    app.navigate("view2");
});

QUnit.test("Overlay layoutController deactivates on back initiating with the only view in it's stack", function(assert) {
    var sequenceLog = [];

    var log = function(event) {
        sequenceLog.push(this.name + "_" + event);
    };

    var layoutController = new TestLayoutController({
            name: "c1",
            log: log
        }),
        layoutController2 = new TestLayoutController({
            name: "c2",
            isOverlay: true,
            log: log
        });

    var app = new htmlFrameworkMocks.MockHtmlApplication({
        layoutSet: [
            { controller: layoutController },
            { controller: layoutController2, customResolveRequired: true }
        ],
        router: new Router()
    });

    app.router.register(":view");

    app.on("resolveLayoutController", function(args) {
        if(args.viewInfo.viewName === "view2") {
            args.layoutController = layoutController2;
        }
    });

    app.navigate("view1", { root: true });

    assert.equal(sequenceLog.length, 6);

    assert.equal(sequenceLog[0], "c1_init");
    assert.equal(sequenceLog[1], "c2_init");
    assert.equal(sequenceLog[2], "c1_renderNavigation");
    assert.equal(sequenceLog[3], "c2_renderNavigation");

    assert.equal(sequenceLog[4], "c1_showView");
    assert.equal(sequenceLog[5], "c1_activate");

    sequenceLog.length = 0;
    app.navigate("view2", { root: true });

    assert.equal(sequenceLog.length, 3);
    assert.equal(sequenceLog[0], "c2_showView");
    assert.equal(sequenceLog[1], "c2_activate");
    assert.equal(sequenceLog[2], "c1_disable");

    sequenceLog.length = 0;
    app.back();

    assert.equal(sequenceLog.length, 2);
    assert.equal(sequenceLog[0], "c1_activate");
    assert.equal(sequenceLog[1], "c2_deactivate");

    sequenceLog.length = 0;
    app.navigate("view2", { root: true });

    assert.equal(sequenceLog.length, 3);
    assert.equal(sequenceLog[0], "c2_showView");
    assert.equal(sequenceLog[1], "c2_activate");
});

QUnit.test("viewShowing, viewShown, viewHidden events with overlay layout (T263730)", function(assert) {
    var eventsLog = [];

    var layoutController = new TestLayoutController({
            name: "c1"
        }),
        layoutController2 = new TestLayoutController({
            name: "c2",
            isOverlay: true
        });

    var app = new htmlFrameworkMocks.MockHtmlApplication({
        layoutSet: [
            { controller: layoutController },
            { controller: layoutController2, customResolveRequired: true }
        ],
        router: new Router()
    });

    app.router.register(":view");

    app.on("resolveLayoutController", function(args) {
        if(args.viewInfo.viewName === "view2") {
            args.layoutController = layoutController2;
        }
    });

    $.each(["viewShowing", "viewShown", "viewHidden"], function(i, eventName) {
        app.on(eventName, function(args) {
            eventsLog.push({
                eventName: eventName,
                viewName: args.viewInfo.viewName
            });
        });
    });

    eventsLog.length = 0;
    app.navigate("view1");

    assert.equal(eventsLog.length, 2);
    assert.equal(eventsLog[0].viewName, "view1");
    assert.equal(eventsLog[0].eventName, "viewShowing");
    assert.equal(eventsLog[1].viewName, "view1");
    assert.equal(eventsLog[1].eventName, "viewShown");

    eventsLog.length = 0;
    app.navigate("view2");

    assert.equal(eventsLog.length, 3);
    assert.equal(eventsLog[0].viewName, "view2");
    assert.equal(eventsLog[0].eventName, "viewShowing");
    assert.equal(eventsLog[1].viewName, "view1");
    assert.equal(eventsLog[1].eventName, "viewHidden");
    assert.equal(eventsLog[2].viewName, "view2");
    assert.equal(eventsLog[2].eventName, "viewShown");

    eventsLog.length = 0;
    app.back();
    assert.equal(eventsLog.length, 3);
    assert.equal(eventsLog[0].viewName, "view1");
    assert.equal(eventsLog[0].eventName, "viewShowing");
    assert.equal(eventsLog[1].viewName, "view2");
    assert.equal(eventsLog[1].eventName, "viewHidden");
    assert.equal(eventsLog[2].viewName, "view1");
    assert.equal(eventsLog[2].eventName, "viewShown");
});

QUnit.test("Root overlay layout (T290401)", function(assert) {
    var eventsLog = [];

    var layoutController = new TestLayoutController({
        name: "c1",
        isOverlay: true
    });

    var app = new htmlFrameworkMocks.MockHtmlApplication({
        layoutSet: [
            { controller: layoutController }
        ],
        router: new Router()
    });

    app.router.register(":view");

    $.each(["viewShowing", "viewShown", "viewHidden"], function(i, eventName) {
        app.on(eventName, function(args) {
            eventsLog.push({
                eventName: eventName,
                viewName: args.viewInfo.viewName
            });
        });
    });

    eventsLog.length = 0;
    app.navigate("view1");

    assert.equal(eventsLog.length, 2);
    assert.equal(eventsLog[0].viewName, "view1");
    assert.equal(eventsLog[0].eventName, "viewShowing");
    assert.equal(eventsLog[1].viewName, "view1");
    assert.equal(eventsLog[1].eventName, "viewShown");
});

QUnit.test("Layout activation method call once after second overlay opening", function(assert) {
    var sequenceLog = [];

    var log = function(event) {
        sequenceLog.push(this.name + "_" + event);
    };

    var layoutController = new TestLayoutController({
            name: "c1",
            log: log
        }),
        layoutController2 = new TestLayoutController({
            name: "c2",
            isOverlay: true,
            log: log
        });

    var app = new htmlFrameworkMocks.MockHtmlApplication({
        layoutSet: [
            { controller: layoutController },
            { controller: layoutController2, customResolveRequired: true }
        ],
        router: new Router()
    });

    app.router.register(":view");

    app.on("resolveLayoutController", function(args) {
        if(args.viewInfo.viewName === "view2") {
            args.layoutController = layoutController2;
        }
    });

    app.navigate("view1");
    app.navigate("view2");
    var firstOverlayOpening = app._activeLayoutControllersStack.length;
    app.navigate("view1");
    sequenceLog.length = 0;
    app.navigate("view2");
    assert.equal(app._activeLayoutControllersStack.length, firstOverlayOpening, "methods call log length equal at second and third overlay opening");
});

QUnit.test("T184222: Under some circumstances views stop being shown after a view in popup layout is shown on Android phone", function(assert) {
    var sequenceLog = [];
    var clock = sinon.useFakeTimers();

    var log = function(event) {
        sequenceLog.push(this.name + "_" + event);
    };

    var navbarLayoutController = new TestLayoutController({
            name: "navbar",
            log: log
        }),
        popupLayoutController = new TestLayoutController({
            name: "popup",
            isOverlay: true,
            log: log
        }),
        simpleLayoutController = new TestLayoutController({
            name: "simple",
            log: log
        });

    var app = new htmlFrameworkMocks.MockHtmlApplication({
        layoutSet: [
            { controller: navbarLayoutController, customResolveRequired: true },
            { controller: popupLayoutController, customResolveRequired: true },
            { controller: simpleLayoutController, customResolveRequired: true }
        ],
        router: new Router()
    });

    app.router.register(":view");

    app.on("resolveLayoutController", function(args) {
        if(args.viewInfo.viewName === "list") {
            args.layoutController = navbarLayoutController;
        } else if(args.viewInfo.viewName === "new") {
            args.layoutController = popupLayoutController;
        } else if(args.viewInfo.viewName === "detail") {
            args.layoutController = simpleLayoutController;
        }
    });

    app.navigate("list", { root: true });

    assert.equal(sequenceLog.length, 8);

    assert.equal(sequenceLog[0], "navbar_init");
    assert.equal(sequenceLog[1], "popup_init");
    assert.equal(sequenceLog[2], "simple_init");
    assert.equal(sequenceLog[3], "navbar_renderNavigation");
    assert.equal(sequenceLog[4], "popup_renderNavigation");
    assert.equal(sequenceLog[5], "simple_renderNavigation");

    assert.equal(sequenceLog[6], "navbar_showView");
    assert.equal(sequenceLog[7], "navbar_activate");

    sequenceLog.length = 0;
    app.navigate("new");

    assert.equal(sequenceLog.length, 3);
    assert.equal(sequenceLog[0], "popup_showView");
    assert.equal(sequenceLog[1], "popup_activate");
    assert.equal(sequenceLog[2], "navbar_disable");

    sequenceLog.length = 0;
    app.navigate("detail", { target: 'current' });
    clock.tick();

    assert.equal(sequenceLog.length, 4);
    assert.equal(sequenceLog[0], "simple_showView");
    assert.equal(sequenceLog[1], "simple_activate");
    assert.equal(sequenceLog[2], "popup_deactivate");
    assert.equal(sequenceLog[3], "navbar_deactivate");

    clock.restore();
});

QUnit.test("T615310: layoutController mustn't start animation when navigation occur from overlay layout", function(assert) {
    var clock = sinon.useFakeTimers();
    ajaxMock.setup({
        url: "../../helpers/TestViewTemplates.html",
        responseText: "<div data-options=\"dxView: { name: 'navbar' }\"></div>" +
            "<div data-options=\"dxView: { name: 'popup' }\"></div>" +
            "<div data-options=\"dxView: { name: 'simple' }\"></div>"
    });
    $("head").append('<link rel="dx-template" type="text/html" href="../../helpers/TestViewTemplates.html"/>');

    var navbarLayoutController = new TestLayoutController({ name: "navbar" }),
        popupLayoutController = new TestLayoutController({ name: "popup", isOverlay: true }),
        simpleLayoutController = new TestLayoutController({ name: "simple" });

    var app = new HtmlApplication({
        layoutSet: [
            { controller: navbarLayoutController, customResolveRequired: true },
            { controller: popupLayoutController, customResolveRequired: true },
            { controller: simpleLayoutController, customResolveRequired: true }
        ],
        router: new Router()
    });

    app.router.register(":view");

    app.on("resolveLayoutController", function(args) {
        if(args.viewInfo.viewName === "navbar") {
            args.layoutController = navbarLayoutController;
        } else if(args.viewInfo.viewName === "popup") {
            args.layoutController = popupLayoutController;
        } else if(args.viewInfo.viewName === "simple") {
            args.layoutController = simpleLayoutController;
        }
    });

    var animated = false;
    var originalLeave = app.transitionExecutor.leave;
    app.transitionExecutor.leave = function() {
        animated = true;
    };

    app.navigate("navbar", { root: true });
    clock.tick();
    app.navigate("popup");
    clock.tick();
    app.navigate("simple");

    assert.notOk(animated);

    app.transitionExecutor.leave = originalLeave;
    $("head").children("[rel='dx-template']").remove();
    ajaxMock.clear();
    clock.restore();
});

QUnit.test("View markup localization works", function(assert) {
    var app = new HtmlApplication({
        rootNode: $("#view-templates")
    });

    messageLocalization.load({
        en: {
            "testLocalizedValue": "Localization works"
        }
    });

    app.init();

    var $view = app.getViewTemplate("to-localize");
    assert.equal($.trim($view.text()), "Localization works");
});

QUnit.test("B231760 - Customize root css classes (default)", function(assert) {
    var style = createThemeMarkerStyle("ios7.default");
    devices.current({ platform: "ios", version: [7] });

    var app = new htmlFrameworkMocks.MockHtmlApplication({}),
        $vp = app.viewPort();

    assert.ok($vp.hasClass("dx-viewport"));
    assert.ok($vp.hasClass("dx-theme-ios7"));
    assert.ok($vp.hasClass("dx-theme-ios7-typography"));

    style.remove();
});

QUnit.test("Set root css classes for win8phone device", function(assert) {
    var style = createThemeMarkerStyle("win8.pink");

    devices.current({ platform: "win", version: [8], deviceType: "phone" });
    var app = new htmlFrameworkMocks.MockHtmlApplication({}),
        $vp = app.viewPort();

    assert.ok($vp.hasClass("dx-viewport"));
    assert.ok($vp.hasClass("dx-theme-win8"));
    assert.ok($vp.hasClass("dx-theme-win8-typography"));
    assert.ok($vp.hasClass("dx-device-phone"));

    style.remove();
});

QUnit.test("Set root css classes for win10phone device", function(assert) {
    var style = createThemeMarkerStyle("win8.pink");

    devices.current({ platform: "win", version: [10], deviceType: "phone" });
    var app = new htmlFrameworkMocks.MockHtmlApplication({}),
        $vp = app.viewPort();

    assert.ok($vp.hasClass("dx-viewport"));
    assert.ok($vp.hasClass("dx-theme-win10"));
    assert.ok($vp.hasClass("dx-theme-win10-typography"));
    assert.ok($vp.hasClass("dx-device-phone"));

    style.remove();
});

QUnit.test("Resolve layout controller", function(assert) {
    var resolveLayoutControllerLog = [],
        controller = {},
        customController = {};

    var app = new htmlFrameworkMocks.MockHtmlApplication({
        layoutSet: [{ controller: controller }, { controller: customController, customResolveRequired: true }]
    });

    app.init();

    var resolved = app._resolveLayoutController({});

    assert.equal(resolved, controller);

    app.on("resolveLayoutController", function(args) {
        resolveLayoutControllerLog.push(args);
        assert.equal(args.layoutController, null);
        args.layoutController = customController;
    });

    var viewInfo = {};
    resolved = app._resolveLayoutController(viewInfo);

    assert.equal(resolveLayoutControllerLog.length, 1);
    assert.equal(resolveLayoutControllerLog[0].viewInfo, viewInfo);
    assert.equal(resolveLayoutControllerLog[0].layoutController, customController);
    assert.equal(resolveLayoutControllerLog[0].availableLayoutControllers.length, 2);
    assert.equal(resolved, customController);
});

QUnit.test("Resolve layout controller without initialization", function(assert) {
    var app = new htmlFrameworkMocks.MockHtmlApplication({
        layoutSet: []
    });

    app.init();
    app.on("resolveLayoutController", function(args) {
        args.layoutController = {};
    });

    assert.throws(function() {
        app._resolveLayoutController({});
    });
});

QUnit.test("Resolve layout controller (trows with concurrent registrations)", function(assert) {
    var app = new htmlFrameworkMocks.MockHtmlApplication({
        layoutSet: [
            { controller: {} },
            { controller: {} }
        ]
    });

    app.init();

    assert.throws(function() {
        app._resolveLayoutController({});
    }, "Throws if it's impossible to choose the most appropriate layout controller");
});

QUnit.test("Resolve layout controller (doesn't trows with customResolveRequired)", function(assert) {
    var controller = {},
        customController = {};

    var app = new htmlFrameworkMocks.MockHtmlApplication({
        layoutSet: [
            { customResolveRequired: true, controller: customController },
            { controller: controller }
        ]
    });

    app.init();

    var resolved = app._resolveLayoutController({});
    assert.equal(resolved, controller);
});

QUnit.test("Resolve layout controller (with no layoutController registered)", function(assert) {
    var app = new htmlFrameworkMocks.MockHtmlApplication({ layoutSet: [] });

    app.init();

    assert.throws(function() {
        app._resolveLayoutController({});
    }, "Throws if there are no controllers registered for the specified navigation type");

});

QUnit.test("Resolve layout controller (unspecified layoutSet)", function(assert) {
    var app = new htmlFrameworkMocks.MockHtmlApplication();

    app.init();

    assert.ok(app._resolveLayoutController({}));
});

QUnit.test("Controller viewHidden event causes application viewHidden event", function(assert) {
    var viewHiddenLog = [];

    var controller = new htmlFrameworkMocks.MockLayoutController();

    var app = new htmlFrameworkMocks.MockHtmlApplication({
        layoutSet: [{ controller: controller }],
        router: new Router()
    });

    app.init();
    app.on("viewHidden", function(args) {
        viewHiddenLog.push(args);
    });

    var viewInfo = {
        key: "test_0_test",
        model: {},
        layoutController: controller
    };


    app._showViewImpl(viewInfo);
    controller.fireEvent("viewHidden", [viewInfo]);

    assert.equal(viewHiddenLog.length, 1);
});

QUnit.test("View release causes it's disposing if it's not in the cache (Q507149, B230785, B230092)", function(assert) {
    var disposedCount = 0;

    var controller = new htmlFrameworkMocks.MockLayoutController();

    var app = new htmlFrameworkMocks.MockHtmlApplication({
        layoutSet: [{ controller: controller }],
        router: new Router()
    });

    app.init();
    app.on("viewDisposed", function() {
        disposedCount++;
    });

    var viewInfo = {
        key: "test_0_test",
        model: {},
        layoutController: controller
    };

    app._showViewImpl(viewInfo);
    controller.fireEvent("viewReleased", [viewInfo]);

    app._disposeRemovedViews();

    assert.equal(disposedCount, 1);
});

QUnit.test("orientationChanged callback for layoutController", function(assert) {
    devices._currentOrientation = "portrait";

    var layoutController = new htmlFrameworkMocks.MockLayoutController(),
        app = new htmlFrameworkMocks.MockHtmlApplication({
            layoutSet: [{ controller: layoutController }]
        });

    app.router.__parseResult = {
        view: "index"
    };

    app.navigate();

    var options = layoutController.__initLog[0],
        templateContext = app.templateContext(), // TODO: check if viewEngine got correct dynamicViewFilter
        callbackFiredCount = 0,
        callbackLastArgs,
        viewShownLog = [],
        mockViewInfo = {};

    assert.equal(templateContext.option("orientation"), "portrait");

    options.templateContext.on("optionChanged", function(args) {
        callbackLastArgs = args;
        callbackFiredCount++;
    });

    devices._currentOrientation = "landscape";
    devices.fireEvent("orientationChanged", [{
        orientation: "landscape"
    }]);

    assert.equal(templateContext.option("orientation"), "landscape");
    assert.deepEqual(callbackLastArgs, { name: "orientation", fullName: "orientation", value: "landscape", previousValue: "portrait", component: options.templateContext });
    assert.equal(callbackFiredCount, 1);

    app.on("viewShown", function(args) {
        viewShownLog.push(args);
    });
    layoutController.fireEvent("viewShown", [mockViewInfo]);
    assert.equal(viewShownLog.length, 1);
    assert.equal(viewShownLog[0].viewInfo, mockViewInfo);
});

QUnit.test("initViewPort disabled option", function(assert) {
    var originalInitMobileViewport = initMobileViewportModule.initMobileViewport,
        initViewportCalls = [];

    initMobileViewportModule.initMobileViewport = function() {
        initViewportCalls.push(arguments);
    };

    new HtmlApplication({
        mode: "webSite"
    });

    assert.equal(initViewportCalls.length, 0);

    var viewPortOptions = {
        allowZoom: true,
        allowPan: true,
        allowSelection: true
    };

    new HtmlApplication({
        viewPort: viewPortOptions
    });

    assert.equal(initViewportCalls.length, 1);
    assert.equal(initViewportCalls[0][0], viewPortOptions, "T144180");

    initMobileViewportModule.initMobileViewport = originalInitMobileViewport;
});

QUnit.test("layout transitions", function(assert) {
    var sequenceLog = [],
        done = assert.async();

    TransitionExecutorModule.TransitionExecutor = TransitionExecutorModule.TransitionExecutor.inherit({
        enter: function($el, presetName, config) {
            sequenceLog.push({
                method: "enter",
                $element: $el,
                preset: presetName,
                config: config
            });
        },
        leave: function($el, presetName, config) {
            sequenceLog.push({
                method: "leave",
                $element: $el,
                preset: presetName,
                config: config
            });
        },
        start: function() {
            sequenceLog.push({
                method: "start"
            });

            return new $.Deferred().resolve().promise();
        }
    });

    var log = function(event) {
        sequenceLog.push(this.name + "_" + event);
    };

    var layoutController = new TestLayoutController({
            name: "c1",
            log: log
        }),
        layoutController2 = new TestLayoutController({
            name: "c2",
            log: log
        });

    var app = new htmlFrameworkMocks.MockHtmlApplication({
        layoutSet: [
            { controller: layoutController },
            { controller: layoutController2, customResolveRequired: true }
        ],
        router: new Router()
    });

    app.router.register(":view");

    app.on("resolveLayoutController", function(args) {
        if(args.viewInfo.viewName === "view2") {
            args.layoutController = layoutController2;
        }
    });


    app.navigate("view1", { root: true });

    assert.equal(sequenceLog.length, 6);

    assert.equal(sequenceLog[5], "c1_activate");


    var steps = [
            function() {
                sequenceLog.length = 0;
                app.navigate("view2", { root: true, direction: "forward" });
            },
            function() {
                assert.equal(sequenceLog.length, 6);

                assert.equal(sequenceLog[0], "c2_showView");
                assert.equal(sequenceLog[1], "c2_activate");
                assert.equal(sequenceLog[2].method, "leave");
                assert.equal(sequenceLog[2].preset, "layout-change");
                assert.equal(sequenceLog[3].method, "enter");
                assert.equal(sequenceLog[3].preset, "layout-change");
                assert.equal(sequenceLog[5], "c1_deactivate");

                sequenceLog.length = 0;
                app.navigate("view1", { root: false, direction: "forward" });
            },
            function() {
                assert.equal(sequenceLog.length, 6);

                assert.equal(sequenceLog[0], "c1_showView");
                assert.equal(sequenceLog[1], "c1_activate");
                assert.equal(sequenceLog[2].method, "leave");
                assert.equal(sequenceLog[2].preset, "layout-change");
                assert.equal(sequenceLog[2].config.direction, "forward");
                assert.equal(sequenceLog[3].method, "enter");
                assert.equal(sequenceLog[3].preset, "layout-change");
                assert.equal(sequenceLog[3].config.direction, "forward");
                assert.equal(sequenceLog[4].method, "start");
                assert.equal(sequenceLog[5], "c2_deactivate");

                sequenceLog.length = 0;
                app.back();
            },

            function() {
                assert.equal(sequenceLog.length, 6);

                assert.equal(sequenceLog[0], "c2_showView");
                assert.equal(sequenceLog[1], "c2_activate");
                assert.equal(sequenceLog[2].method, "leave");
                assert.equal(sequenceLog[2].preset, "layout-change");
                assert.equal(sequenceLog[2].config.direction, "backward");
                assert.equal(sequenceLog[3].method, "enter");
                assert.equal(sequenceLog[3].preset, "layout-change");
                assert.equal(sequenceLog[3].config.direction, "backward");
                assert.equal(sequenceLog[4].method, "start");
                assert.equal(sequenceLog[5], "c1_deactivate");

                sequenceLog.length = 0;
                layoutController2.isOverlay = true;
                app.navigate("view1", { root: false });
            },

            function() {
                assert.equal(sequenceLog.length, 3);

                assert.equal(sequenceLog[0], "c1_showView");
                assert.equal(sequenceLog[1], "c1_activate");
                assert.equal(sequenceLog[2], "c2_deactivate");

                sequenceLog.length = 0;
                app.navigate("view2", { root: false });
            },
            function() {
                assert.equal(sequenceLog.length, 3);

                assert.equal(sequenceLog[0], "c2_showView");
                assert.equal(sequenceLog[1], "c2_activate");
                assert.equal(sequenceLog[2], "c1_disable");

                done();
            }
        ],
        doStep = function() {
            var step = steps.shift();
            step();
        };

    app.on("viewShown", doStep);

    doStep();
});

QUnit.test("animationSet option", function(assert) {
    var registerLog = [],
        applyChangesLog = [];

    animationPresetsModule.presets = {
        registerPreset: function(name, config) {
            registerLog.push({
                name: name,
                config: config
            });
        },
        applyChanges: function() {
            applyChangesLog.push(arguments);
        }
    };

    new htmlFrameworkMocks.MockHtmlApplication({
        animationSet: {
            animation1: [
                { animation: "1" }
            ],
            animation2: [
                { animation: "2" },
                { animation: "3" }
            ]
        }
    });

    assert.equal(registerLog.length, 3);
    assert.equal(registerLog[0].name, "animation1");
    assert.equal(registerLog[0].config.animation, "1");
    assert.equal(registerLog[1].name, "animation2");
    assert.equal(registerLog[1].config.animation, "2");
    assert.equal(registerLog[2].name, "animation2");
    assert.equal(registerLog[2].config.animation, "3");
    assert.equal(applyChangesLog.length, 1);
});

QUnit.module("view disposing", {
    beforeEach: function() {
        executeAsyncMock.setup();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
    }
});

QUnit.test("view is disposed after removing from view cache", function(assert) {
    var viewCache = new ViewCache(),
        layoutController = new htmlFrameworkMocks.MockLayoutController(),
        app = new htmlFrameworkMocks.MockHtmlApplication({
            layoutSet: [{ controller: layoutController }],
            viewCache: viewCache,
            router: new Router()
        }),
        isDisposed = false;

    app._createViewInfo = function() {
        return {
            key: "test",
            layoutController: layoutController
        };
    };

    app.on("viewDisposed", function(args) {
        isDisposed = true;
    });

    app.init();
    var viewInfo = app._acquireViewInfo({ key: "test", uri: "test" });
    app._showViewImpl(viewInfo);
    layoutController.fireEvent("viewReleased", [viewInfo]);

    assert.ok(!isDisposed);
    viewCache.removeView("test");
    assert.ok(!isDisposed);
    app._disposeRemovedViews();
    assert.ok(isDisposed);
});

QUnit.test("view is disposed after layout controller had released it", function(assert) {
    var viewCache = new ViewCache(),
        layoutController = new htmlFrameworkMocks.MockLayoutController(),
        app = new htmlFrameworkMocks.MockHtmlApplication({
            layoutSet: [{ controller: layoutController }],
            viewCache: viewCache,
            router: new Router()
        }),
        isDisposed = false;

    app._createViewInfo = function() {
        return {
            key: "test",
            layoutController: layoutController
        };
    };

    app.on("viewDisposed", function(args) {
        isDisposed = true;
    });

    app.init();
    var viewInfo = app._acquireViewInfo({ key: "test", uri: "test" });
    app._showViewImpl(viewInfo);

    assert.ok(!isDisposed);
    viewCache.removeView("test");
    assert.ok(!isDisposed);
    layoutController.fireEvent("viewReleased", [viewInfo]);
    app._disposeRemovedViews();
    assert.ok(isDisposed);
});

QUnit.test("View markup is not hidden on getViewTemplate", function(assert) {
    var app = new HtmlApplication({
        rootNode: $("#view-templates")
    });

    app.init();

    var $view = app.getViewTemplate("test-view");
    assert.equal($view.length, 1);
    assert.ok($view.is(":not(.dx-hidden)"));
});

QUnit.module("HtmlApplication viewCache", {
    beforeEach: function() {
        var that = this;

        device = devices.current();
        this.router = new Router();
        this.viewSetupLog = [];
        this.viewSetup = function(args) {
            that.viewSetupLog.push(args);
        };
        executeAsyncMock.setup();
        this.router.register(":view/:id", { view: "index", id: undefined });
    },
    afterEach: function() {
        devices.current(device);
        executeAsyncMock.teardown();
        $(".dx-viewport").attr("class", "dx-viewport");
    }
});

QUnit.test("disableCache option", function(assert) {
    var __findViewComponentOptions = [];
    __findViewComponentOptions["view1"] = { disableCache: true };

    var app = new htmlFrameworkMocks.MockHtmlApplication({
        router: this.router,
        viewEngine: new htmlFrameworkMocks.MockViewEngine({
            __findViewComponentOptions: __findViewComponentOptions
        })
    });
    app.on("afterViewSetup", this.viewSetup);
    this.viewSetupLog.length = 0;

    app.navigate("view1", { root: true });
    app.navigate("view2");
    app.navigate("view1", { root: true });
    assert.equal(this.viewSetupLog.length, 3);
});

QUnit.test("T303618 - new view instance shouldn't be created after changing uri in the navigating event handler and manual uri change in a browser address bar", function(assert) {
    var done = assert.async(),
        adapter = new frameworkMocks.MockBrowserAdapter(),
        device = new frameworkMocks.MockStackBasedNavigationDevice({
            browserAdapter: adapter
        }),
        navigationManager = new frameworkMocks.MockHistoryBasedNavigationManager({
            navigationDevice: device
        }),
        layoutController = new htmlFrameworkMocks.MockLayoutController(),
        router = new Router(),
        app = new htmlFrameworkMocks.MockHtmlApplication({
            navigationManager: navigationManager,
            layoutSet: [{ controller: layoutController }],
            router: router,
            disableViewCache: true
        }),
        viewDisposedLog = [],
        viewSetupLog = [];

    router.register(":view");

    app.on("afterViewSetup", function(args) {
        viewSetupLog.push(args);
    });

    app.on("viewDisposed", function(args) {
        viewDisposedLog.push(args);
    });

    app.on("navigating", function(e) {
        e.uri = "home";
    });

    var steps = [
            function(event) {
                assert.ok(!event);
                app.navigate("home");
            },
            function(event) {
                assert.equal(event, "navigated");
                device.uriChanged.fire("about");
            },
            function(event) {
                assert.equal(event, "navigationCanceled", "navigation is canceled if navigating from home to home");
                assert.equal(viewSetupLog.length, 1, "only one view instance is created");
                assert.equal(viewDisposedLog.length, 0, "nothing is disposed");
                done();
            }
        ],
        doStep = function(event) {
            var step = steps.shift();
            step(event);
        };

    app.navigationManager.on("navigated", function() {
        doStep("navigated");
    });
    app.navigationManager.on("navigationCanceled", function() {
        doStep("navigationCanceled");
    });
    doStep();
});
