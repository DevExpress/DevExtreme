var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    ko = require("knockout"),
    DefaultLayoutController = require("framework/html/layout_controller").DefaultLayoutController,
    Component = require("core/component"),
    dxCommand = require("framework/command"),
    fx = require("animation/fx"),

    layoutHelper = require("../../helpers/layoutHelper.js");

require("ui/defer_rendering");
require("ui/nav_bar");
require("ui/toolbar");

require("spa.css!");
require("common.css!");
require("generic_light.css!");

QUnit.testStart(function() {
    var markup = require("./frameworkParts/html_layoutController.markup.html!text");

    $("#qunit-fixture").html(markup);
});

var createLayoutController = function(options) {
    options = options || {};

    var result;

    layoutHelper.createLayoutController(options, function(ctorOptions) {
        ctorOptions.name = ctorOptions.name || "default";
        ctorOptions.transitionDuration = 1;// Don't set to 0 (async behavior should be tested)
        return new DefaultLayoutController(ctorOptions);
    }).done(function(layoutController) {
        result = layoutController;
    });

    return result;
};

QUnit.module("DefaultLayoutController (functional tests)");

QUnit.test("Activate and deactivate", function(assert) {
    var $viewPort = $("#viewPort");

    assert.equal($viewPort.children(".dx-layout").length, 0, "Viewport is empty before start test");

    var layoutController = createLayoutController();

    var $layout = $viewPort.children(".dx-layout");

    assert.equal($layout.length, 1, "After activation layout is in the viewport");
    assert.equal($layout.find(".dx-content-placeholder").length, 2, "Placeholders are in place");
    assert.equal($layout.find(".dx-content-placeholder").children().length, 0, "Placeholders are empty");

    layoutController.deactivate();
    assert.equal($viewPort.children(".dx-layout").length, 1, "After deactivate layout markup is in the viewport");
    assert.equal($viewPort.children(".dx-layout.dx-fast-hidden").length, 1, "After deactivate layout is hidden");
    assert.equal($viewPort.children(".dx-layout:visible").length, 1, "After deactivate layout is hidden by position not display");
});

QUnit.test("Disable", function(assert) {
    var layoutController = createLayoutController();

    var $viewPort = $("#viewPort");
    var $layout = $viewPort.children(".dx-layout");
    var eventLog = [];
    var viewInfo = {
        model: {
            title: "SimpleView",
            content: "Simple content"
        },
        viewName: "simple"
    };


    layoutController.on("viewRendered", function(viewInfo) {
        eventLog.push({ name: "viewRendered", viewInfo: viewInfo });
    });
    layoutController.on("viewShowing", function(viewInfo) {
        eventLog.push({ name: "viewShowing", viewInfo: viewInfo });
    });
    layoutController.on("viewHidden", function(viewInfo) {
        eventLog.push({ name: "viewHidden", viewInfo: viewInfo });
    });
    layoutController.on("viewReleased", function(viewInfo) {
        eventLog.push({ name: "viewReleased", viewInfo: viewInfo });
    });
    layoutController.showView(viewInfo);
    eventLog.length = 0;
    layoutController.disable();
    assert.equal($layout.length, 1, "After disabling layout is in the viewport");
    assert.equal($layout.find(".dx-content-placeholder").length, 2, "Placeholders are in place");

    assert.equal(eventLog.length, 1);
    assert.equal(eventLog[0].name, "viewHidden", "viewHidden fire after disabling");
    assert.equal(eventLog[0].viewInfo, viewInfo);

    eventLog.length = 0;
    layoutController.ensureActive();
    assert.equal($layout.length, 1, "After second activation layout is in the viewport");
    assert.equal($layout.find(".dx-content-placeholder").length, 2, "Placeholders are in place");

    assert.equal(eventLog.length, 1);
    assert.equal(eventLog[0].name, "viewShowing", "viewShowing fire after activating disabled controller");
    assert.equal(eventLog[0].viewInfo, viewInfo);

    layoutController.disable();
    eventLog.length = 0;
    layoutController.deactivate();
    assert.equal($viewPort.children(".dx-layout").length, 1, "After deactivate layout markup is in the viewport");
    assert.equal($viewPort.children(".dx-layout.dx-fast-hidden").length, 1, "After deactivate layout is hidden");
    assert.equal($viewPort.children(".dx-layout:visible").length, 1, "After deactivate layout is hidden by position not display");

    assert.equal(eventLog.length, 2);
    assert.equal(eventLog[0].name, "viewHidden", "viewHidden fire after deactivating");
    assert.equal(eventLog[0].viewInfo, viewInfo);
    assert.equal(eventLog[1].name, "viewReleased", "viewReleased fire after deactivating");
    assert.equal(eventLog[1].viewInfo, viewInfo);

    eventLog.length = 0;
    layoutController.ensureActive();
    assert.equal($viewPort.children(".dx-layout").length, 1, "After reactivation layout is in the viewport");
    assert.equal($viewPort.children(".dx-layout:visible").length, 1, "After deactivate layout is hidden");

    layoutController.disable();
    eventLog.length = 0;
    layoutController.showView(viewInfo);
    layoutController.ensureActive();
    assert.equal(eventLog.length, 1, "viewShowing fire once");
    assert.equal(eventLog[0].name, "viewShowing");
    assert.equal(eventLog[0].viewInfo, viewInfo);
});

QUnit.test("Create navigation", function(assert) {
    createLayoutController({
        ctorOptions: {
            name: "create-navigation"
        },
        initOptions: {
            navigation: [
                { title: "c1", id: "c1" },
                { title: "c2", id: "c2" }
            ]
        }
    });

    var $navigation = $("#viewPort .dx-layout .global-navigation"),
        navbar = $navigation.dxNavBar("instance");

    assert.equal(navbar.option("items").length, 2, "NavBar items are created");
    assert.equal(navbar.option("items")[0].text, "c1", "Command 1 is registered");
    assert.equal(navbar.option("items")[1].text, "c2", "Command 1 is registered");
});

QUnit.test("Recreate navigation", function(assert) {
    var layoutController = createLayoutController({
            ctorOptions: {
                name: "recreate-navigation"
            },
            initOptions: {
                navigation: [
                    { title: "c1", id: "c1" }
                ]
            }
        }),
        commandMapping = layoutController._commandManager.commandMapping,
        $navigation = $("#viewPort .dx-layout .global-navigation"),
        navbar = $navigation.dxNavBar("instance");

    assert.equal(navbar.option("items").length, 1, "NavBar items are created");

    var newNavigation = layoutHelper.prepareNavigation([{ title: "c2", id: "c2" }, { title: "c3", id: "c3" }], commandMapping);
    layoutController.renderNavigation(newNavigation);

    assert.equal(navbar.option("items").length, 2, "NavBar items are recreated");
});

QUnit.test("Show view", function(assert) {
    var layoutController = createLayoutController(),
        $layout = $("#viewPort .dx-layout"),
        eventTriggered = false,
        eventLog = [],
        viewInfo = {
            model: {
                title: "SimpleView",
                content: "Simple content"
            },
            viewName: "simple"
        },
        done = assert.async();

    $(document).on("dx.viewchanged", function() {
        eventTriggered = true;
    });

    layoutController.on("viewRendered", function(viewInfo) {
        eventLog.push({ name: "viewRendered", viewInfo: viewInfo });
    });
    layoutController.on("viewShowing", function(viewInfo, direction) {
        eventLog.push({ name: "viewShowing", viewInfo: viewInfo, direction: direction });
    });

    layoutController.showView(viewInfo).done(function() {
        assert.ok(eventTriggered, "Event dx.viewchanged triggered");
        assert.equal($layout.find(".dx-active-view .view-title").text(), "SimpleView", "View title is set");
        assert.equal($layout.find(".dx-active-view .view-content").text(), "Simple content", "View content is set");

        assert.equal(eventLog.length, 2);
        assert.equal(eventLog[0].name, "viewRendered");
        assert.equal(eventLog[0].viewInfo, viewInfo);
        assert.equal(eventLog[1].name, "viewShowing");
        assert.equal(eventLog[1].viewInfo, viewInfo);
        assert.equal(eventLog[1].direction, "forward");

        done();
    });
});

QUnit.test("viewShowing can be used to update viewModel according to new uri params (T336852)", function(assert) {
    var layoutController = createLayoutController(),
        viewInfo = {
            model: {
                title: "title",
                content: "Simple content"
            },
            viewName: "simple"
        },
        viewShowingLog = [],
        done = assert.async();

    layoutController.on("viewShowing", function(viewInfo) {
        viewShowingLog.push(viewInfo);
    });

    layoutController.showView(viewInfo).done(function() {
        assert.equal(viewShowingLog.length, 1);
        assert.equal(viewShowingLog[0], viewInfo);
        layoutController.showView(viewInfo).done(function() {
            assert.equal(viewShowingLog.length, 2);
            assert.equal(viewShowingLog[1], viewInfo);
            done();
        });
    });
});

QUnit.test("Show same view twice (T263730)", function(assert) {
    var layoutController = createLayoutController(),
        eventLog = [],
        viewInfo = {
            model: {
                title: "SimpleView",
                content: "Simple content"
            },
            viewName: "simple"
        };


    layoutController.on("viewRendered", function(viewInfo) {
        eventLog.push({ name: "viewRendered", viewInfo: viewInfo });
    });
    layoutController.on("viewShowing", function(viewInfo) {
        eventLog.push({ name: "viewShowing", viewInfo: viewInfo });
    });
    layoutController.on("viewHidden", function(viewInfo) {
        eventLog.push({ name: "viewHidden", viewInfo: viewInfo });
    });

    eventLog.length = 0;
    layoutController.showView(viewInfo);

    assert.equal(eventLog.length, 2);
    assert.equal(eventLog[0].name, "viewRendered");
    assert.equal(eventLog[0].viewInfo, viewInfo);
    assert.equal(eventLog[1].name, "viewShowing");
    assert.equal(eventLog[1].viewInfo, viewInfo);

    eventLog.length = 0;
    layoutController.disable();

    assert.equal(eventLog.length, 1);
    assert.equal(eventLog[0].name, "viewHidden");
    assert.equal(eventLog[0].viewInfo, viewInfo);
});

QUnit.test("Layout deactivate causes viewHidden event", function(assert) {
    var layoutController = createLayoutController(),
        viewHiddenLog = [],
        viewInfo = {
            model: {
                title: "SimpleView",
                content: "Simple content"
            },
            viewName: "simple"
        };

    layoutController.on("viewHidden", function(viewInfo) {
        viewHiddenLog.push({ name: "viewHidden", viewInfo: viewInfo });
    });

    layoutController.showView(viewInfo);

    layoutController.deactivate();
    assert.equal(viewHiddenLog.length, 1);
}),

QUnit.test("Show view (T131399)", function(assert) {
    var layoutController = createLayoutController(),
        $layout = $("#viewPort .dx-layout");

    layoutController.showView({
        model: {
            title: "test",
            complexObject: {
                message: "test content"
            }
        },
        viewName: "T131399"
    });

    assert.equal($layout.find(".dx-active-view .view-content").text(), "test content", "The 'with' binding works");
});

QUnit.test("Show view with dxDeferRendering", function(assert) {
    assert.expect(11);

    var done = assert.async(),
        layoutController = createLayoutController(),
        $layout = $("#viewPort .dx-layout"),
        asyncMarker = "";

    layoutController.on("viewRendered", function() {
        assert.equal($layout.find(".dx-active-view .view-content1").text(), "", "the first dxDeferRendered is not rendered on viewRendered");
        assert.equal($layout.find(".dx-active-view .view-content2").text(), "", "the second dxDeferRendered is not rendered on viewRendered");
        setTimeout(function() { asyncMarker = "viewRendered"; });
    });

    layoutController.showView({
        model: {
            title: "title",
            content: "test",
            onRendered1: function() {
                assert.equal($layout.find(".dx-active-view .view-content1").text(), "test", "the first dxDeferRendered is rendered on the first step");
                assert.equal($layout.find(".dx-active-view .view-content2").text(), "", "the second dxDeferRendered is not rendered on the first step");
                assert.equal(asyncMarker, "viewRendered", "onRendered1 async operation");
                setTimeout(function() { asyncMarker = "onRendered1"; });
            },
            onRendered2: function() {
                assert.equal($layout.find(".dx-active-view .view-content1").text(), "test", "the first dxDeferRendered is rendered on the second step");
                assert.equal($layout.find(".dx-active-view .view-content2").text(), "test", "the second dxDeferRendered is rendered on the second step");
                assert.equal(asyncMarker, "onRendered1", "onRendered2 async operation");
                setTimeout(function() { asyncMarker = "onRendered2"; });
            }
        },
        viewName: "withDeferRendering"
    }).done(function() {
        assert.equal($layout.find(".dx-active-view .view-content1").text(), "test", "the first dxDeferRendered is rendered on viewShown");
        assert.equal($layout.find(".dx-active-view .view-content2").text(), "test", "the second dxDeferRendered is rendered on viewShown");
        assert.equal(asyncMarker, "onRendered1", "viewShown is synchronous with the last defer rendering");
        done();
    });

});

QUnit.test("Show view with dxDeferRendering on root content element", function(assert) {
    assert.expect(1);

    var done = assert.async(),
        layoutController = createLayoutController(),
        $layout = $("#viewPort .dx-layout");

    layoutController.showView({
        model: {
            title: "title",
            content: "test",
            onRendered: function() {
                assert.equal($layout.find(".dx-active-view .view-content").text(), "test", "the first dxDeferRendered is rendered on the first step");
                done();
            }
        },
        viewName: "withDeferRenderingOnRootElement"
    });
});

QUnit.test("View release", function(assert) {
    var done = assert.async(),
        layoutController = createLayoutController(),
        $layout = $("#viewPort .dx-layout"),
        viewReleasedLog = [];

    layoutController.on("viewReleased", function(args) {
        viewReleasedLog.push(args);
    });

    layoutController.showView({
        model: {
            title: "View1",
            content: "Content1"
        },
        viewName: "simple"
    }).done(function() {
        layoutController.showView({
            model: {
                title: "View2",
                content: "Content2"
            },
            viewName: "simple"
        }).done(function() {
            assert.equal($layout.find(".dx-active-view .view-title").text(), "View2", "View2 title is set");
            assert.equal($layout.find(".dx-active-view .view-content").text(), "Content2", "View2 content is set");
            assert.equal($layout.find(".header .dx-inactive-view").length, 1, "View1 is hidden");
            assert.equal($layout.find(".header .dx-inactive-view").is(":visible"), true, "Performance optimization in 15.2 (hide by position not display)");
            assert.equal(viewReleasedLog.length, 1);
            assert.equal(viewReleasedLog[0].model.title, "View1", "Old view is released");

            // Q465089
            layoutController.deactivate();
            assert.equal(viewReleasedLog.length, 2);
            assert.equal(viewReleasedLog[1].model.title, "View2", "All views are released on deactivate");

            done();
        });
    });

});

QUnit.test("Commands work (B252354)", function(assert) {
    var layoutController = createLayoutController({
            ctorOptions: {
                name: "with-container"
            },
            initOptions: {
                commandMapping: {
                    "test-container": { commands: ["command"] }
                }
            }
        }),
        $layout = $("#viewPort .dx-layout");

    var model = {
        title: ko.observable("MyCommand"),
        action: noop()
    };


    try {
        fx.off = true;

        layoutController.showView({
            model: model,
            viewName: "with-command"
        });

        var $button = $layout.find(".dx-active-view .command-container .dx-button");
        assert.equal($button.length, 1, "Command has been registered");

        var command = layoutController._visibleViews["content"].commands[0],
            optionChangedLog = [];

        assert.ok(command);

        command.on("optionChanged", function(args) {
            optionChangedLog.push(args);
        });
        model.title("Changed");

        assert.equal(optionChangedLog.length, 1, "Command is alive");
    } finally {
        fx.off = false;
    }

});

QUnit.test("Command render stage", function(assert) {
    assert.expect(5);

    var done = assert.async(),
        layoutController = createLayoutController({
            ctorOptions: {
                name: "with-container"
            },
            initOptions: {
                commandMapping: {
                    "test-container": { commands: ["command1", "command2"] }
                }
            }
        }),
        $layout = $("#viewPort .dx-layout");

    layoutController.on("viewRendered", function() {
        var $button = $layout.find(".command-container .dx-button");
        assert.equal($button.length, 1);
        assert.equal($button.text(), "command1");
    });

    layoutController.showView({
        model: {},
        viewName: "commands-render-stage"
    }).done(function() {
        var $buttons = $layout.find(".command-container .dx-button");
        assert.equal($buttons.length, 2);
        assert.equal($buttons.eq(0).text(), "command1");
        assert.equal($buttons.eq(1).text(), "command2");

        done();
    });

});

QUnit.test("Breaking change: all the view content should be in dxContent container (B252355)", function(assert) {
    var layoutController = createLayoutController({
        ctorOptions: {
            name: "content-only"
        }
    });

    assert.throws(function() {
        layoutController.showView({
            viewName: "with-rubbish-markup"
        });
    }, "all the view content should be in dxContent container");

});

QUnit.test("If there are no dxCommand or dxContent elements view content is wrapped and works", function(assert) {
    var layoutController = createLayoutController({
            ctorOptions: {
                name: "content-only"
            }
        }),
        $layout = $("#viewPort .dx-layout");

    layoutController.showView({
        viewName: "with-proper-rubbish-markup"
    });

    assert.equal($layout.find(".proper-rubbish").length, 2);

});

QUnit.test("Q553601 It is impossible to show/hide navigation items at runtime via Knockout", function(assert) {
    var visible = ko.observable(false);

    createLayoutController({
        ctorOptions: {
            name: "binding-navbar"
        },
        initOptions: {
            navigation: [
                new dxCommand({ id: "1", title: "title", visible: visible })
            ]
        }
    });

    var $navigation = $("#viewPort .dx-layout .global-navigation"),
        navBar = $navigation.dxNavBar("instance");

    assert.equal(navBar.option("items")[0].visible(), false);
    visible(true);
    assert.equal(navBar.option("items")[0].visible(), true);
});

QUnit.test("Layout model option", function(assert) {
    var text = ko.observable("test");

    createLayoutController({
        ctorOptions: {
            name: "layout-model-binding",
            layoutModel: { text: text }
        }
    });

    var $layout = $("#viewPort .dx-layout");

    var a = ko.dataFor($layout.get(0));
    assert.ok(a !== undefined);

    var $content = $("#viewPort .dx-layout .content");

    assert.equal($content.text(), "test");
    text("test1");
    assert.equal($content.text(), "test1");
});

QUnit.test("correct binding contexts for transition elements (B255501)", function(assert) {
    var done = assert.async(),
        title = "test",
        model = { title: ko.observable(title), content: "View content" },
        layoutController = createLayoutController({
            ctorOptions: {
                name: "with-transition"
            }
        }),
        $layout = $("#viewPort .dx-layout");

    layoutController.showView({
        model: model,
        viewName: "simple"
    }).done(function() {

        var transitionInnerWrapperData = ko.dataFor($layout.find(".dx-active-view").get(0));

        assert.equal(transitionInnerWrapperData.title(), title);
        assert.equal($(".dx-active-view .transition-title").text(), title);

        done();
    });

});

QUnit.test("Animations work with no direction (T242497, T339056)", function(assert) {
    var model = { title: "", content: "View content" },
        layoutController = createLayoutController({
            ctorOptions: {
                name: "with-transition"
            }
        }),
        enterLog = [],
        leaveLog = [],
        startLog = [];

    layoutController.transitionExecutor = {
        enter: function($elements, animation, modifier) {
            enterLog.push({
                $elements: $elements,
                animation: animation,
                modifier: modifier
            });
        },
        leave: function($elements, animation, modifier) {
            leaveLog.push({
                $elements: $elements,
                animation: animation,
                modifier: modifier
            });
        },
        start: function(config) {
            startLog.push(config);
            return $.Deferred().resolve().promise();
        }
    };

    layoutController.showView({
        model: model,
        viewName: "simple"
    }, "none");

    assert.equal(enterLog.length, 1, "T293727");
    assert.equal(enterLog[0].modifier.duration, 0, "T293727");
    assert.equal(enterLog[0].modifier.delay, 0, "T339056 (white blink on Android if animation between layouts is switched off)");
    assert.equal(startLog.length, 1);

    layoutController.showView({
        model: model,
        viewName: "simple"
    }, "none");

    assert.equal(enterLog.length, 2);
    assert.equal(enterLog[1].modifier.duration, undefined);
    assert.equal(startLog.length, 2);
});

QUnit.test("Showing of inactive view should be performed without animation (T308600)", function(assert) {
    var model = { title: "", content: "View content" },
        layoutController = createLayoutController({
            ctorOptions: {
                name: "with-transition"
            }
        }),
        animationDeferred = $.Deferred().resolve().promise(),
        enterLog = [],
        startLog = [];

    layoutController.transitionExecutor = {
        enter: function($elements, animation, modifier) {
            assert.equal($elements.length, 1);
            enterLog.push({
                $elements: $elements,
                enterLeft: $elements.css("left")
            });
            $elements.addClass("dx-some-animation");
        },
        leave: function($elements, animation, modifier) {
        },
        start: function(config) {
            $.each(enterLog, function(index, item) {
                startLog.push({
                    enterLeft: item.enterLeft,
                    startLeft: item.$elements.css("left")
                });
                item.$elements.removeClass("dx-some-animation");
            });
            enterLog.length = 0;
            return animationDeferred;
        }
    };

    var viewInfo1 = {
            model: model,
            viewName: "simple"
        },
        viewInfo2 = {
            model: model,
            viewName: "simple"
        };

    layoutController.showView(viewInfo1, "none");
    layoutController.showView(viewInfo2, "forward");
    layoutController.showView(viewInfo1, "backward");

    assert.equal(startLog.length, 3);
    assert.equal(startLog[0].enterLeft, "0px");
    assert.equal(startLog[0].startLeft, "0px");
    assert.equal(startLog[1].enterLeft, "0px");
    assert.equal(startLog[1].startLeft, "0px");
    assert.equal(startLog[2].enterLeft, "-99999px");
    assert.equal(startLog[2].startLeft, "0px", "T308600");
});

QUnit.test("Inactive view should be invisible (T455422)", function(assert) {
    var done = assert.async(),
        layoutController = createLayoutController(),
        model = { title: "View title", content: "View content" };

    layoutController.showView({
        model: model,
        viewName: "simple"
    }).done(function() {
        layoutController.showView({
            model: model,
            viewName: "simple"
        }).done(function() {
            assert.equal($("#viewPort .dx-layout .dx-inactive-view").css("left"), "-99999px", "T455422");
            assert.equal($("#viewPort .dx-layout .dx-inactive-view").css("top"), "-99999px", "T455422");

            done();
        });
    });
});

QUnit.test("Inputs enabling/disabling mechanism", function(assert) {
    var done = assert.async(),
        layoutController = createLayoutController(),
        model = { title: "View title", content: "View content" };

    var patchedInputsCount,
        disabledInputsCount;

    layoutController.showView({
        model: model,
        viewName: "with-inputs"
    }).done(function() {
        layoutController.showView({
            model: model,
            viewName: "simple"
        }).done(function() {
            patchedInputsCount = $("#viewPort .dx-layout .dx-inactive-view .test-item:input")
                .filter("[data-disabled=true]")
                .length;
            assert.equal(patchedInputsCount, 4);

            disabledInputsCount = $("#viewPort .dx-layout .dx-inactive-view .test-item:input")
                .filter("[disabled]")
                .length;
            assert.equal(disabledInputsCount, 9);

            layoutController.showView({
                model: model,
                viewName: "with-inputs"
            });

            disabledInputsCount = $("#viewPort .dx-layout .dx-active-view .test-item:input")
                .filter("[disabled]")
                .length;
            assert.equal(disabledInputsCount, 5);

            done();
        });
    });
});

QUnit.test("IDs path/unpatch mechanism", function(assert) {
    var done = assert.async(),
        layoutController = createLayoutController(),
        model = { title: "View title", content: "View content" };

    layoutController.showView({
        model: model,
        viewName: "with-ids"
    }).done(function() {
        layoutController.showView({
            model: model,
            viewName: "simple"
        }).done(function() {
            assert.equal($("#viewPort .dx-layout .dx-inactive-view .test-item").attr("id"), "__hidden-bag-id");

            layoutController.showView({
                model: model,
                viewName: "with-ids"
            }).done(function() {
                assert.equal($("#viewPort .dx-layout .dx-active-view .test-item").attr("id"), "id");

                done();
            });
        });
    });
});

QUnit.test("orientationChanged behavior", function(assert) {
    var templateContext = new Component({
            orientation: "portrait"
        }),
        layoutController = createLayoutController({
            initOptions: {
                templateContext: templateContext
            },
            viewEngineOptions: {
                templateContext: templateContext
            }
        });
    var model = { title: "View title" },
        viewRenderedCount = 0,
        withOrientationViewInfo = {
            model: model,
            viewName: "with-orientation"
        },
        eventLog = [];

    layoutController.on("viewShowing", function(viewInfo) {
        eventLog.push({ name: "viewShowing", viewInfo: viewInfo });
    });
    layoutController.on("viewShown", function(viewInfo) {
        eventLog.push({ name: "viewShown", viewInfo: viewInfo });
    });
    layoutController.on("viewHidden", function(viewInfo) {
        eventLog.push({ name: "viewHidden", viewInfo: viewInfo });
    });
    layoutController.on("viewReleased", function(viewInfo) {
        eventLog.push({ name: "viewReleased", viewInfo: viewInfo });
    });
    layoutController.on("viewRendered", function() {
        viewRenderedCount++;
    });

    layoutController.showView(withOrientationViewInfo);

    assert.equal($("#viewPort .dx-layout .dx-active-view .portrait").length, 1);
    assert.equal($("#viewPort .dx-layout .dx-active-view .landscape").length, 0);
    assert.equal(viewRenderedCount, 1);

    assert.equal(eventLog.length, 1);
    assert.equal(eventLog[0] && eventLog[0].name, "viewShowing");
    eventLog = [];

    templateContext.option("orientation", "landscape");

    assert.equal($("#viewPort .dx-layout .dx-active-view .landscape").length, 1);
    assert.equal($("#viewPort .dx-layout .dx-active-view .portrait").length, 0);
    assert.equal(viewRenderedCount, 2);

    assert.equal(eventLog.length, 3);
    assert.equal(eventLog[0] && eventLog[0].name, "viewShowing");
    assert.equal(eventLog[1] && eventLog[1].name, "viewHidden");
    assert.equal(eventLog[2] && eventLog[2].name, "viewShown");
    eventLog = [];

    layoutController.deactivate();

    templateContext.option("orientation", "portrait");

    assert.equal($("#viewPort .dx-layout .dx-active-view .portrait").length, 0);
    assert.equal($("#viewPort .dx-layout .dx-active-view .landscape").length, 0);
    assert.equal(viewRenderedCount, 2);

    assert.equal(eventLog.length, 2);
    assert.equal(eventLog[0] && eventLog[0].name, "viewHidden");
    assert.equal(eventLog[1] && eventLog[1].name, "viewReleased");
    eventLog = [];

    layoutController.ensureActive();

    layoutController.showView(withOrientationViewInfo);

    assert.equal($("#viewPort .dx-layout .dx-active-view .portrait").length, 1);
    assert.equal($("#viewPort .dx-layout .dx-active-view .landscape").length, 0);
    assert.equal(viewRenderedCount, 2);

    assert.equal(eventLog.length, 1);
    assert.equal(eventLog[0] && eventLog[0].name, "viewShowing");
    eventLog = [];

    layoutController.showView({
        model: {
            title: "SimpleView",
            content: "Simple content"
        },
        viewName: "simple"
    });

    assert.equal(eventLog.length, 3);
    assert.equal(eventLog[0] && eventLog[0].name, "viewShowing");
    assert.equal(eventLog[1] && eventLog[1].name, "viewHidden");
    assert.equal(eventLog[2] && eventLog[2].name, "viewReleased");
    eventLog = [];

    templateContext.option("orientation", "landscape");

    assert.equal(eventLog.length, 0, "T378390");
    eventLog = [];

    layoutController.showView(withOrientationViewInfo);

    assert.equal($("#viewPort .dx-layout .dx-active-view .landscape").length, 1);
    assert.equal($("#viewPort .dx-layout .dx-active-view .portrait").length, 0);

    assert.equal(eventLog.length, 3);
    assert.equal(eventLog[0] && eventLog[0].name, "viewShowing");
    assert.equal(eventLog[1] && eventLog[1].name, "viewHidden");
    assert.equal(eventLog[2] && eventLog[2].name, "viewReleased");
    eventLog = [];
});

QUnit.test("orientationChanged should not rise re-rendering for already shown orientation", function(assert) {
    var templateContext = new Component({
        orientation: "portrait"
    });

    var layoutController = createLayoutController({
            initOptions: {
                templateContext: templateContext
            },
            viewEngineOptions: {
                templateContext: templateContext
            }
        }),
        model = { title: "View title" },
        viewRenderedCount = 0;

    layoutController.on("viewRendered", function() {
        viewRenderedCount++;
    });

    layoutController.showView({
        model: model,
        viewName: "with-orientation"
    });
    assert.equal(viewRenderedCount, 1);

    templateContext.option("orientation", "landscape");
    assert.equal(viewRenderedCount, 2);

    templateContext.option("orientation", "portrait");
    assert.equal(viewRenderedCount, 2);

    templateContext.option("orientation", "landscape");
    assert.equal(viewRenderedCount, 2);
});


QUnit.test("orientationChanged should not rise re-rendering if orientation was not defined for view", function(assert) {
    var templateContext = new Component({
        orientation: "portrait"
    });

    var layoutController = createLayoutController({
            initOptions: {
                templateContext: templateContext
            },
            viewEngineOptions: {
                templateContext: templateContext
            }
        }),
        model = {
            title: "View title",
            content: "View content"
        },
        viewRenderedCount = 0;

    layoutController.on("viewRendered", function() {
        viewRenderedCount++;
    });

    layoutController.showView({
        model: model,
        viewName: "simple"
    });
    assert.equal(viewRenderedCount, 1);

    templateContext.option("orientation", "landscape");
    assert.equal(viewRenderedCount, 1);

    templateContext.option("orientation", "portrait");
    assert.equal(viewRenderedCount, 1);

    templateContext.option("orientation", "landscape");
    assert.equal(viewRenderedCount, 1);
});

QUnit.test("Show view with $templateView in viewInfo", function(assert) {
    var layoutController = createLayoutController(),
        $layout = $("#viewPort .dx-layout"),
        $viewTemplate = $(" <div>\
                                        <div data-options=\"dxContent: { targetPlaceholder: 'content' }\">\
                                                <div class=\"template-view\" data-bind=\"text: content\"></div>\
                                        </div>\
                                    </div>").dxView();

    layoutController.showView({
        model: {
            title: "SimpleView",
            content: "Simple content"
        },
        $viewTemplate: $viewTemplate
    });

    assert.equal($layout.find(".dx-active-view .template-view").length, 1);
});

QUnit.test("dxhiding/dxshown events on activation and deactivation (B255108)", function(assert) {
    var layoutController = createLayoutController(),
        dxHidingLog1 = [],
        dxShownLog1 = [],
        dxHidingLog2 = [],
        dxShownLog2 = [];

    layoutController.ensureActive();

    layoutController.showView({
        model: { title: "test" },
        viewName: "with-visibility-handlers"
    });

    $("#viewPort #some-widget")
        .on("dxhiding", function() {
            dxHidingLog1.push(arguments);
        })
        .on("dxshown", function() {
            dxShownLog1.push(arguments);
        });

    $("#viewPort #another-widget")
        .on("dxhiding", function() {
            dxHidingLog2.push(arguments);
        })
        .on("dxshown", function() {
            dxShownLog2.push(arguments);
        });

    assert.equal(dxHidingLog1.length, 0);
    assert.equal(dxShownLog1.length, 0);
    assert.equal(dxHidingLog2.length, 0);
    assert.equal(dxShownLog2.length, 0);

    layoutController.deactivate();

    assert.equal(dxHidingLog1.length, 0, "Performance optimization in 15.2");
    assert.equal(dxShownLog1.length, 0);
    assert.equal(dxHidingLog2.length, 0, "Performance optimization in 15.2");
    assert.equal(dxShownLog2.length, 0);

    layoutController.ensureActive();

    assert.equal(dxHidingLog1.length, 0, "Performance optimization in 15.2");
    assert.equal(dxShownLog1.length, 0, "Performance optimization in 15.2");
    assert.equal(dxHidingLog2.length, 0, "Performance optimization in 15.2");
    assert.equal(dxShownLog2.length, 0, "Performance optimization in 15.2");
});

QUnit.test("dxshown event should be fired on the very first view showing", function(assert) {
    var layoutController = createLayoutController(),
        dxShownLog = [];

    layoutController.ensureActive();

    var old = layoutController._appendViewToLayout;
    layoutController._appendViewToLayout = function(viewInfo) {
        var $widget = viewInfo.renderResult.$markup.find("#some-widget");

        $widget.on("dxshown", function() {
            assert.ok($widget.is(":visible"), "There is no reason to fire shown event on invisible elements");
            assert.ok($widget.is(".dx-active-view *"), "active view classes should be applied at the moment of dxshown event");
            assert.ok(!$widget.is(".dx-inactive-view *"), "inactive view classes should not be applied at the moment of dxshown event");
            dxShownLog.push(arguments);
        });

        return old.apply(this, arguments);
    };

    layoutController.showView({
        model: { title: "test" },
        viewName: "with-visibility-handlers"
    });

    assert.equal(dxShownLog.length, 1, "widgets should update their sizes when they are being shown for the first time");
});

QUnit.test("dxhiding/dxshown and dx.viewchanged events on orientation changing with single view (T179682)", function(assert) {
    var dxViewChangedLog = [],
        dxHidingLog = [],
        dxShownLog = [],
        model = { title: "test" },
        templateContext = new Component({
            orientation: "portrait"
        }),
        layoutController = createLayoutController({
            initOptions: {
                templateContext: templateContext
            },
            viewEngineOptions: {
                templateContext: templateContext
            }
        }),
        done = assert.async();

    layoutController.showView({
        model: model,
        viewName: "with-visibility-handlers"
    }).then(function() {

        $(document).on("dx.viewchanged", function() {
            dxViewChangedLog.push(arguments);
        });
        $("#viewPort #some-widget")
            .on("dxhiding", function() {
                dxHidingLog.push(arguments);
            })
            .on("dxshown", function() {
                dxShownLog.push(arguments);
            });

        assert.equal(dxViewChangedLog.length, 0);
        assert.equal(dxShownLog.length, 0);
        assert.equal(dxHidingLog.length, 0);

        templateContext.option("orientation", "landscape");

        assert.equal(dxViewChangedLog.length, 0);
        assert.equal(dxShownLog.length, 0);
        assert.equal(dxHidingLog.length, 0);

        layoutController.deactivate();
        assert.ok(layoutController._$mainLayout.is(":visible"), "performance optimization in 15.2");

        templateContext.option("orientation", "portrait");

        assert.equal(dxViewChangedLog.length, 0);
        assert.equal(dxShownLog.length, 0);
        assert.equal(dxHidingLog.length, 0, "performance optimization in 15.2");

        layoutController.ensureActive();

        return layoutController.showView({
            model: model,
            viewName: "with-visibility-handlers"
        });

    }).then(function() {

        assert.equal(dxViewChangedLog.length, 1);
        assert.equal(dxShownLog.length, 0, "performance optimization in 15.2");
        assert.equal(dxHidingLog.length, 0, "performance optimization in 15.2");

    }).then(function() {

        done();
    });

});

QUnit.test("back command disposing correctly", function(assert) {
    var layoutController = createLayoutController(),
        commandsCreated = 0,
        commandsDisposed = 0;

    var TestCommandClass = dxCommand.inherit({
        ctor: function() {
            this.callBase.apply(this, arguments);
            commandsCreated++;
        },
        _dispose: function() {
            this.callBase();
            commandsDisposed++;
        }
    });

    layoutController.showView({
        model: { title: "test" },
        viewName: "with-back-command",
        commands: [new TestCommandClass({ id: "back" })]
    });

    assert.equal(commandsCreated, 1);
    assert.equal(commandsDisposed, 1);
});

// TODO: reanimate or remove
// test("orientationChanged with more than one view", function() {
//    DefaultLayoutController = DX.framework.html.DefaultLayoutController.inherit({
//        _getTargetFrame: function(viewInfo) {
//            return viewInfo.viewName;
//        }
//    });
//    DX.devices._currentOrientation = "portrait";

//    var orientationChanged = $.Callbacks(),
//        layoutController = createLayoutController({
//            initOptions: {
//                orientationChanged: orientationChanged
//            }
//        });
//    var model = { title: "View title" };

//    layoutController.showView({
//        model: model,
//        viewName: "with-orientation-1"
//    });

//    layoutController.showView({
//        model: model,
//        viewName: "with-orientation-2"
//    });

//    assert.equal($("#viewPort .dx-layout .dx-active-view .portrait").length, 2);
//    assert.equal($("#viewPort .dx-layout .dx-active-view .landscape").length, 0);

//    DX.devices._currentOrientation = "landscape";
//    orientationChanged.fire({ orientation: "landscape" });

//    assert.equal($("#viewPort .dx-layout .dx-active-view .landscape").length, 2);
//    assert.equal($("#viewPort .dx-layout .dx-active-view .portrait").length, 0);

//    DefaultLayoutController = DX.framework.html.DefaultLayoutController;
// });

QUnit.test("Bindings are applied properly (T242369)", function(assert) {
    assert.expect(2);

    var done = assert.async(),
        layoutController = createLayoutController({
            ctorOptions: {
                name: "with-content-for-view-placeholder"
            },
            initOptions: {
                commandMapping: {
                    "test-container": { commands: ["command"] }
                }
            }
        }),
        $layout = $("#viewPort .dx-layout");

    layoutController.showView({
        model: {
            onRendered: function() {
                var $button = $layout.find(".view-content .dx-button");
                assert.equal($button.length, 1, "Bindings have been applied");
                assert.equal($button.text(), "test command");

                done();
            }
        },
        viewName: "view-with-content-placeholder"
    });
});

QUnit.test("Layout markup without views shouldn't contain an rubbish .dx-content divs (T247480)", function(assert) {
    createLayoutController({
        ctorOptions: {
            name: "with-content-for-view-placeholder"
        },
        initOptions: {
            commandMapping: {
                "test-container": { commands: ["command"] }
            }
        }
    });

    var $layout = $("#viewPort .dx-layout");

    assert.equal($layout.children(".dx-content").length, 0);
});
