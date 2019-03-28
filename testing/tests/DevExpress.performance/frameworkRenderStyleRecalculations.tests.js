require("../../helpers/frameworkMocks.js");
require("../../helpers/htmlFrameworkMocks.js");
require("../../helpers/qunitPerformanceExtension.js");

require("common.css!");

var $ = require("jquery"),
    DefaultLayoutController = require("framework/html/layout_controller").DefaultLayoutController,
    dxCommand = require("framework/command"),
    devices = require("core/devices"),
    animationPresets = require("animation/presets/presets").presets,
    layoutHelper = require("../../helpers/layoutHelper.js");

require("ui/nav_bar");

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

QUnit.testStart(function() {
    var markup = '\
        <div id="viewPort" class="dx-viewport" style="width:500px; height:500px; position:absolute; overflow: hidden">\
        </div>\
        \
        <div id="templates-root">\
        \
            <div data-options="dxLayout: { name: \'default\' }">\
                <div class="header" data-options="dxContentPlaceholder: { name: \'header\' }">\
                    <div class="view-title" data-bind="text: title"></div>\
                </div>\
                <div class="content" data-options="dxContentPlaceholder: { name: \'content\' }">\
                </div>\
            </div>\
            \
            <div data-options="dxLayout: { name: \'animated\' }">\
                <div class="content" data-options="dxContentPlaceholder: { name: \'content\', animation: \'slide\' }">\
                </div>\
            </div>\
            \
            <div data-options="dxLayout: { name: \'create-navigation\' }">\
                <div class="global-navigation" data-bind="dxNavBar: {}" data-options="dxCommandContainer: { id: \'global-navigation\' }"></div>\
            </div>\
            \
            <div data-options="dxView: { name: \'simple1\' }">\
                <div data-options="dxContent: { targetPlaceholder: \'content\' }">\
                    <div class="view-content">Put content here</div>\
                </div>\
            </div>\
            \
            <div data-options="dxView: { name: \'simple2\' }">\
                <div data-options="dxContent: { targetPlaceholder: \'content\' }">\
                    <div class="view-content" data-bind="text: content"></div>\
                </div>\
            </div>\
        \
        </div>';

    $("#qunit-fixture").html(markup);
});

QUnit.performanceTest("default layout performance test", function(assert) {
    var measureFunction = function() {
        for(var i = 0; i < 10; i++) {
            var layoutController = createLayoutController({
                $root: $("#templates-root").clone()
            });
            layoutController.deactivate();
        }
    };

    assert.measureStyleRecalculation(measureFunction, 1);
});

QUnit.performanceTest("layout navigation performance test", function(assert) {
    var measureFunction = function() {
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
    };

    assert.measureStyleRecalculation(measureFunction, 9);
});

QUnit.performanceTest("change command visibility performance test", function(assert) {
    var c1 = new dxCommand({ title: "c1", id: "c1" });

    createLayoutController({
        ctorOptions: {
            name: "create-navigation"
        },
        initOptions: {
            navigation: [
                c1,
                { title: "c2", id: "c2" }
            ]
        }
    });

    var measureFunction = function() {
        c1.option("visible", false);
    };

    // 1. update container widget item
    assert.measureStyleRecalculation(measureFunction, 1);
});

QUnit.performanceTest("layout recreate navigation performance test", function(assert) {
    var measureFunction = function() {
        var $element = $('<div data-options="dxLayout: { name: \'recreate-navigation\' }"><div class="global-navigation" data-bind="dxNavBar: {}" data-options="dxCommandContainer: { id: \'global-navigation\' }"></div></div>');
        $("#templates-root").append($element);

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
            $navigation = $("#viewPort .dx-layout .global-navigation");

        $navigation.dxNavBar("instance");

        var newNavigation = layoutHelper.prepareNavigation([{ title: "c2", id: "c2" }, { title: "c3", id: "c3" }], commandMapping);
        layoutController.renderNavigation(newNavigation);
    };

    assert.measureStyleRecalculation(measureFunction, 14);
});

QUnit.performanceTest("show view", function(assert) {
    var layoutController = createLayoutController(),
        viewInfo1 = {
            model: {
                title: "SimpleView1",
                content: "Simple content"
            },
            viewName: "simple1"
        };

    var measureFunction = function() {
        return layoutController.showView(viewInfo1);
    };

    assert.measureStyleRecalculation(measureFunction, 4);
});

QUnit.performanceTest("change view", function(assert) {
    var layoutController = createLayoutController(),
        viewInfo1 = {
            model: {
                title: "SimpleView1",
                content: "Simple content"
            },
            viewName: "simple1"
        },
        viewInfo2 = {
            model: {
                title: "SimpleView2",
                content: "Simple content"
            },
            viewName: "simple2"
        };

    return layoutController.showView(viewInfo1).then(function() {
        var measureFunction = function() {
            return layoutController.showView(viewInfo2);
        };

        assert.measureStyleRecalculation(measureFunction, 4);
    });
});

QUnit.skip("change view with animation", function(assert) {
    devices.current({ platform: 'android' });
    animationPresets.resetToDefaults();

    var layoutController = createLayoutController({
            ctorOptions: {
                name: "animated"
            }
        }),
        viewInfo1 = {
            model: {
                title: "SimpleView1",
                content: "Simple content"
            },
            viewName: "simple1"
        },
        viewInfo2 = {
            model: {
                title: "SimpleView2",
                content: "Simple content"
            },
            viewName: "simple2"
        };

    return layoutController.showView(viewInfo1).then(function() {
        var measureFunction = function() {
            return layoutController.showView(viewInfo2);
        };

        assert.measureStyleRecalculation(measureFunction, 1);
    });
});
