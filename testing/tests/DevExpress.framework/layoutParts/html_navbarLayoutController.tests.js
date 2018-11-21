/* global jQuery, includeLayout */

(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            require("common.css!");
            require("android5_light.css!");
            module.exports = factory(
                require("jquery"),
                require("framework/command"),
                require("../../../helpers/layoutHelper.js"),
                require("../../../../layouts/Navbar/NavbarLayout.js").NavBarController,
                require("ui/themes"),
                require("core/utils/view_port").value
            );
        });
    } else {
        factory(
            jQuery,
            DevExpress.framework.dxCommand,
            DevExpress.testHelpers,
            DevExpress.layouts.NavbarLayout.NavBarController,
            DevExpress.ui.themes,
            DevExpress.viewPort
        );
    }
}(this, function($, dxCommand, layoutHelper, NavbarLayoutController, themes, viewPort) {

    includeLayout("Navbar");

    QUnit.testStart(function() {
        var markup = '                                                                                            \
            <div id="viewPort" class="dx-viewport"></div>                                                         \
            <div id="templates-root">                                                                             \
                <div data-options="dxView: { name: \'for-T379324-with-appbar\' }">                                \
                    <div data-bind="dxCommand: { visible: true, id: \'create\', title: \'Add\' }"></div>          \
                    <div data-options="dxContent: { targetPlaceholder: \'content\' }">123</div>                   \
                </div>                                                                                            \
                                                                                                                  \
                <div data-options="dxView: { name: \'for-T379324-without-appbar\' }">                             \
                    <div data-options="dxContent: { targetPlaceholder: \'content\' }">312</div>                   \
            </div>';

        $("#qunit-fixture").append(markup);
        viewPort('#viewPort');
    });

    function createLayoutController(options) {
        options = options || {};

        options = $.extend({
            activateManually: true
        }, options);

        options.device = options.device || {
            platform: "win",
            phone: true
        };

        return layoutHelper.createLayoutController(options, function(ctorOptions) {
            return new NavbarLayoutController(ctorOptions);
        });
    }

    QUnit.module("NavbarLayoutController");

    QUnit.test("B251293: Basic WP10 app - empty appBar should be hidden", function(assert) {
        var done = assert.async();

        createLayoutController(
            {
                initOptions: {
                    navigation: [{ title: "Test", onExecute: "#test", icon: "test" }]
                }
            }
        ).done(function(layoutController) {

            layoutController.showView({
                viewName: "for-T379324-with-appbar",
                model: { title: "SimpleView", content: "SimpleContent" }
            }).done(function() {
                layoutController.activate().done(function() {

                    var $viewPort = $("#viewPort"),
                        $layout = $viewPort.children(".navbar-layout"),
                        $layoutFooter = $layout.children(".layout-footer");

                    assert.equal($layoutFooter.length, 1);
                    assert.equal($layoutFooter.children(".dx-active-view").length, 1);

                    assert.ok($layoutFooter.children(".dx-active-view").find(".dx-toolbar").is(":visible"));
                    assert.ok($layoutFooter.children(".dx-active-view").find(".dx-toolbar").hasClass("layout-toolbar-bottom"));
                    assert.ok(!$layoutFooter.children(".dx-active-view").find(".dx-toolbar").hasClass("dx-state-invisible"));

                    layoutController.showView({
                        viewName: "for-T379324-without-appbar",
                        model: {
                            title: "SimpleViewTitle",
                            content: "SimpleViewContent"
                        }
                    }).then(function() {
                        var $viewPort = $("#viewPort"),
                            $layout = $viewPort.children(".navbar-layout"),
                            $layoutFooter = $layout.children(".layout-footer");

                        assert.equal($layoutFooter.children(".dx-active-view").length, 1);
                        assert.ok($layoutFooter.children(".dx-active-view").find(".dx-toolbar").hasClass("dx-state-invisible"));

                        done();
                    });
                });
            });
        });
    });

    QUnit.test("Toolbar is hidden via using negative position not 'display: none' (T386849)", function(assert) {
        var done = assert.async(),
            layoutController,
            $viewPort = $("#viewPort"),
            $layout,
            $layoutFooter;

        // themes.current("android5");

        createLayoutController({
            initOptions: {
                navigation: [{ title: "Test", onExecute: "#test", icon: "test" }]
            }
        })
            .then(function(lc) {
                layoutController = lc;

                $layout = $viewPort.children(".navbar-layout");
                $layoutFooter = $layout.children(".layout-footer");

                return layoutController.showView({
                    viewName: "for-T379324-with-appbar",
                    model: { title: "SimpleView", content: "SimpleContent" }
                });
            })
            .then(function() {
                return layoutController.activate();
            })
            .then(function() {
                assert.ok($layout.hasClass("has-toolbar"));
                assert.ok($layoutFooter.css("display") !== "none");

                return layoutController.showView({
                    viewName: "for-T379324-without-appbar",
                    model: {
                        title: "SimpleViewTitle",
                        content: "SimpleViewContent"
                    }
                });
            })
            .then(function() {
                assert.ok(!$layout.hasClass("has-toolbar"));
                assert.ok($layoutFooter.css("display") !== "none", "T386849");

                done();
            });
    });

}));
