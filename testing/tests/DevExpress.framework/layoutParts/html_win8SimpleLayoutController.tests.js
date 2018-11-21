/* global jQuery, includeLayout */

(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            require("common.css!");
            require("ui/toolbar");

            module.exports = factory(
                require("jquery"),
                require("core/devices"),
                require("../../../../layouts/Simple/SimpleLayout.js").SimpleLayoutController,
                require("../../../helpers/layoutHelper.js")
            );
        });
    } else {
        factory(
            jQuery,
            DevExpress.devices,
            DevExpress.layouts.SimpleLayout.SimpleLayoutController,
            DevExpress.testHelpers
        );
    }
}(this, function($, devices, SimpleLayoutController, layoutHelper) {

    includeLayout("Simple");

    QUnit.testStart(function() {
        var markup = '<div id="viewPort" class="dx-viewport"></div>                                                                         \
            <div id="templates-root">                                                                                                       \
                <div data-options="dxView: { name: \'for-T142621-with-appbar\' }">                                                          \
                    <div data-bind="dxCommand: { visible: true, id: \'create\', title: \'Add\', renderStage: \'onViewRendering\' }"></div>  \
                    <div data-options="dxContent: { targetPlaceholder: \'content\' }">                                                      \
                        <div class="test-visibility-change-handler dx-visibility-change-handler"></div>                                     \
                    </div>                                                                                                                  \
                </div>                                                                                                                      \
                                                                                                                                            \
                <div data-options="dxView: { name: \'for-T142621-without-appbar\' }">                                                       \
                    <div data-options="dxContent: { targetPlaceholder: \'content\' }">312</div>                                             \
                </div>                                                                                                                      \
            </div>';

        $("#qunit-fixture").append(markup);
    });

    function createLayoutController(options) {
        options = options || {};

        options.device = options.device || {
            platform: "win",
            phone: true,
            version: undefined
        };

        return layoutHelper.createLayoutController(options, function(ctorOptions) {
            return new SimpleLayoutController(ctorOptions);
        });
    }

    QUnit.module("SimpleLayoutController for WinPhone", {
        beforeEach: function() {
            this.realDevice = devices.current();
            devices.current({ platform: "win", deviceType: "phone" });
        },
        afterEach: function() {
            devices.current(this.realDevice);
        }
    });

    QUnit.test("Test template", function(assert) {
        var done = assert.async();
        createLayoutController().done(function(layoutController) {
            var $viewPort = $("#viewPort");

            assert.equal($viewPort.children(".dx-layout.dx-fast-hidden").length, 0);
            assert.equal($viewPort.children(".dx-layout:visible").length, 1);

            layoutController.deactivate();
            assert.equal($viewPort.children(".dx-layout.dx-fast-hidden").length, 1);
            assert.equal($viewPort.children(".dx-layout:visible").length, 1, "Hidden by position not display");

            done();
        });
    });

    QUnit.test("T142621: View content size is not calculated properly after navigating back to a view on Windows Phone 8", function(assert) {
        var done = assert.async();

        var options = {
                initOptions: {
                    navigation: [ { title: "Test", action: "#test", icon: "test" } ]
                }
            },
            viewInfo = {
                viewName: "for-T142621-with-appbar",
                model: {
                    title: "SimpleView",
                    content: "SimpleContent"
                }
            };

        var testToolbarVisibility = function(visible) {
            var $viewPort = $("#viewPort"),
                $layout = $viewPort.children(".dx-layout"),
                toolbar = $layout.find(".layout-footer .dx-active-view .dx-toolbar").dxToolbar("instance");

            assert.equal(toolbar.option("visible"), visible);
            assert.equal($layout.hasClass("has-toolbar-bottom"), visible);
        };


        createLayoutController(options).then(function(layoutController) {
            var expectedVisibilityOnRendered = [ true, false ];

            layoutController.on("viewRendered", function(viewInfo) {
                var $markup = viewInfo.renderResult.$markup,
                    $toolbar = $markup.find(".layout-toolbar-bottom"),
                    toolbar = $toolbar.dxToolbar("instance"),
                    expectedVisibility = expectedVisibilityOnRendered.shift();

                assert.ok(expectedVisibility === true || expectedVisibility === false);
                assert.equal(toolbar.option("visible"), expectedVisibility);
            });


            layoutController.showView(viewInfo).then(function() {
                testToolbarVisibility(true);

                // show another view (without toolbar)
                layoutController.showView({
                    viewName: "for-T142621-without-appbar",
                    model: {
                        title: "SimpleViewTitle",
                        content: "SimpleViewContent"
                    }
                }).then(function() {
                    testToolbarVisibility(false);

                    // back to first view (with toolbar)
                    layoutController.showView(viewInfo, "backward").then(function() {
                        testToolbarVisibility(true);

                        var toolbar = $("#viewPort .layout-footer .dx-active-view .dx-toolbar").dxToolbar("instance");

                        assert.ok(toolbar.option("visible"));
                        toolbar.option("items", []);
                        testToolbarVisibility(false);

                        layoutController.disposeView(viewInfo);

                        done();
                    });
                });
            });

        });
    });
}));
