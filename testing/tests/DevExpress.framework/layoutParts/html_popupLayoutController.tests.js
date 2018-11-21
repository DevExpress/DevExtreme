/* global jQuery, includeLayout */

(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            require("common.css!");

            module.exports = factory(
                require("jquery"),
                require("../../../../layouts/Popup/PopupLayout.js"),
                require("../../../helpers/layoutHelper.js")
            );
        });
    } else {
        factory(
            jQuery,
            DevExpress.layouts.PopupLayout,
            DevExpress.testHelpers
        );
    }
}(this, function($, popupLayoutControllerModule, layoutHelper) {

    includeLayout("Simple");
    includeLayout("Popup");

    var PopupLayoutController = popupLayoutControllerModule.PopupLayoutController,
        OverlayLayoutControllerBase = popupLayoutControllerModule.OverlayLayoutControllerBase;

    QUnit.testStart(function() {
        var markup = $('<div id="viewPort" class="dx-viewport"></div>                                \
                <div id="templates-root">                                                            \
                    <div data-options="dxView: { name: \'test\' }">                                  \
                        <div data-options="dxContent: { targetPlaceholder: \'content\' }">           \
                            <div class="view-content">content</div>                                  \
                        </div>                                                                       \
                    </div>                                                                           \
                    <div class="test-overlay" data-options="dxLayout : { name: \'test-overlay\' }">  \
                        <div class="content-container">                                              \
                        </div>                                                                       \
                    </div>                                                                           \
                </div>');

        $("#qunit-fixture").append(markup);
    });

    function createLayoutController(controllerClass, options) {
        options = options || {};

        options.device = options.device || {
            platform: "ios",
            phone: true
        };

        return layoutHelper.createLayoutController(options, function(ctorOptions) {
            return new controllerClass(ctorOptions);
        });
    }

    QUnit.module("OverlayLayoutControllerBase");

    var OverlayLayoutControllerBaseTester = OverlayLayoutControllerBase.inherit({
        ctor: function(options) {
            options = options || {};
            options.name = options.name || "test-overlay";
            options.contentContainerSelector = ".content-container";
            this.visibleTest = false;
            this.callBase(options);
        },

        _showContainerWidget: function() {
            this.visibleTest = true;
            return $.Deferred().resolve().promise();
        },

        _hideContainerWidget: function() {
            this.visibleTest = false;
            return $.Deferred().resolve().promise();
        }
    });

    QUnit.test("Test init child controller", function(assert) {
        var done = assert.async();
        createLayoutController(OverlayLayoutControllerBaseTester).done(function(layoutController) {
            var $viewPort = $("#viewPort");

            assert.equal($viewPort.find(".dx-layout:visible .content-container .simple-layout").length, 1);
            assert.ok(layoutController.visibleTest);

            layoutController.deactivate().done(function() {
                // NOTE: jQuery 2.2 changed the behavior of :hidden/:visible selectors
                // https://github.com/jquery/jquery/commit/65d71843b7c37dbdba2cfcb1bc7055cb522c5af6#diff-ec2898bdb5c4c35075326f2a345101d3L9
                assert.equal($viewPort.children(".dx-layout:not(.dx-fast-hidden)").length, 0);
                assert.ok(!layoutController.visibleTest);
            });

            done();
        });
    });

    QUnit.test("Test showView", function(assert) {
        var done = assert.async();

        var options = {
            },
            viewInfo = {
                viewName: "test",
                model: {
                    title: "SimpleView",
                    content: "SimpleContent"
                }
            },
            viewInfo2 = $.extend({}, viewInfo, true),
            $viewPort = $("#viewPort");

        createLayoutController(OverlayLayoutControllerBaseTester, options).then(function(layoutController) {

            var $layout = $viewPort.children(".dx-layout:visible"),
                viewRenderedLog = [],
                viewReleased = [],
                viewShowing = [];

            layoutController.on("viewRendered", function() {
                viewRenderedLog.push(arguments);
            });

            layoutController.on("viewShowing", function() {
                viewShowing.push(arguments);
            });

            layoutController.on("viewReleased", function() {
                viewReleased.push(arguments);
            });

            assert.equal($layout.find(".view-content").length, 0);
            assert.equal(viewRenderedLog.length, 0);
            assert.equal(viewShowing.length, 0);
            assert.equal(viewReleased.length, 0);

            layoutController.showView(viewInfo).then(function() {

                assert.equal($layout.find(".view-content").length, 1);
                assert.equal(viewRenderedLog.length, 1);
                assert.equal(viewShowing.length, 1);
                assert.equal(viewReleased.length, 0);

                layoutController.showView(viewInfo2).then(function() {

                    assert.equal(viewRenderedLog.length, 2);
                    assert.equal(viewShowing.length, 2);
                    assert.equal(viewReleased.length, 1);

                    done();
                });

            });

        });
    });

    QUnit.module("PopupLayoutController");

    QUnit.test("Test activate/deactivate", function(assert) {
        var done = assert.async();

        createLayoutController(PopupLayoutController, { activateManually: true }).done(function(layoutController) {
            var $viewPort = $("#viewPort");

            assert.equal($viewPort.find(".dx-layout .dx-popup").length, 1);
            assert.equal($viewPort.find(".dx-layout .dx-popup:visible").length, 0);

            layoutController.activate().done(function() {

                assert.equal($viewPort.find(".dx-layout .dx-popup").length, 1);
                assert.equal($viewPort.find(".dx-layout .dx-popup:visible").length, 1);

                layoutController.deactivate().done(function() {
                    assert.equal($viewPort.find(".dx-layout .dx-popup").length, 1);
                    assert.equal($viewPort.find(".dx-layout .dx-popup:visible").length, 0);
                    done();
                });

            });

        });
    });
}));
