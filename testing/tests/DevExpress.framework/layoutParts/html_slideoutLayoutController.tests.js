/* global jQuery, includeLayout */

(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            require("common.css!");
            require("ui/toolbar");

            module.exports = factory(
                require("jquery"),
                require("framework/command"),
                require("animation/fx"),
                require("../../../../layouts/SlideOut/SlideOutLayout.js").SlideOutController,
                require("../../../helpers/layoutHelper.js")
            );
        });
    } else {
        factory(
            jQuery,
            DevExpress.framework.dxCommand,
            DevExpress.fx,
            DevExpress.layouts.SlideOutLayout.SlideOutController,
            DevExpress.testHelpers
        );
    }
}(this, function($, dxCommand, fx, SlideOutController, layoutHelper) {

    includeLayout("SlideOut");

    QUnit.testStart(function() {
        var markup = '                                                                                                                         \
            <div id="viewPort" class="dx-viewport"></div>                                                                                      \
                                                                                                                                               \
            <div id="templates-root">                                                                                                          \
                                                                                                                                               \
                <div data-options="dxView: { name: \'simple\' }">                                                                              \
                    <div data-options="dxContent: { targetPlaceholder: \'content\' }">                                                         \
                    </div>                                                                                                                     \
                </div>                                                                                                                         \
                                                                                                                                               \
                <div data-options="dxView: { name: \'simple-with-visible-back\' }">                                                            \
                    <div data-bind="dxCommand: { id: \'back\', title: \'Custom\', visible: true, renderStage: \'onViewRendering\' }"></div>    \
                    <div data-options="dxContent: { targetPlaceholder: \'content\' }">                                                         \
                    </div>                                                                                                                     \
                </div>                                                                                                                         \
                                                                                                                                               \
                <div data-options="dxView: { name: \'simple-with-visible-back-on-view-shown\' }">                                              \
                    <div data-bind="dxCommand: { id: \'back\', title: \'Custom\', visible: true, renderStage: \'onViewShown\' }"></div>        \
                    <div data-options="dxContent: { targetPlaceholder: \'content\' }">                                                         \
                    </div>                                                                                                                     \
                </div>                                                                                                                         \
                                                                                                                                               \
                <div data-options="dxView: { name: \'simple-with-invisible-back\' }">                                                          \
                    <div data-bind="dxCommand: { id: \'back\', title: \'Custom\', visible: false, renderStage: \'onViewRendering\' }"></div>   \
                    <div data-options="dxContent: { targetPlaceholder: \'content\' }">                                                         \
                    </div>                                                                                                                     \
                </div>                                                                                                                         \
                                                                                                                                               \
            </div>';

        $("#qunit-fixture").append(markup);
    });

    function createLayoutController(options) {
        options = options || {};

        options.device = options.device || {
            platform: "ios",
            phone: true
        };

        return layoutHelper.createLayoutController(options, function(ctorOptions) {
            return new SlideOutController(ctorOptions);
        });
    }

    QUnit.module("SlideOutLayoutController");

    QUnit.test("Test template", function(assert) {
        var done = assert.async();

        createLayoutController().done(function(layoutController) {
            var $viewPort = $("#viewPort");

            assert.equal($viewPort.children(".dx-slideout.dx-fast-hidden").length, 0);
            assert.equal($viewPort.children(".dx-slideout:visible").length, 1);

            layoutController.deactivate();
            assert.equal($viewPort.children(".dx-slideout.dx-fast-hidden").length, 1);
            assert.equal($viewPort.children(".dx-slideout:visible").length, 1, "Hidden by position not display");

            done();
        });
    });

    QUnit.test("T304402: SlideOut layout - It is impossible to change a menu item title at runtime", function(assert) {
        var done = assert.async();

        createLayoutController().done(function(layoutController) {
            var $viewPort = $("#viewPort"),
                $layout = $viewPort.children(".dx-slideout"),
                commandMapping = layoutController._commandManager.commandMapping,
                navigationCommand = new dxCommand({
                    id: "item1",
                    title: "initial text"
                }),
                navigation = [navigationCommand];

            layoutHelper.prepareNavigation(navigation, commandMapping);
            layoutController.renderNavigation(navigation);

            var $item = $layout.find(".dx-list .dx-list-item .dx-navigation-item");

            assert.equal($item.length, 1);
            assert.equal($item.text(), "initial text");

            navigationCommand.option("title", "changed text");
            $item = $layout.find(".dx-list .dx-list-item .dx-navigation-item");
            assert.equal($item.text(), "changed text");

            done();
        });
    });

    QUnit.test("Navigation button exists if there is no back command", function(assert) {
        var done = assert.async();

        createLayoutController().done(function(layoutController) {

            layoutController.showView({
                model: {
                    title: "SimpleView"
                },
                viewName: "simple"
            }).done(function() {
                var $viewPort = $("#viewPort");

                var $navButton = $viewPort.find(".dx-slideout .dx-active-view .nav-button:visible");
                assert.equal($navButton.length, 1);

                done();
            });
        });
    });

    QUnit.test("Navigation button doesn't exist if back command is visible", function(assert) {
        var done = assert.async();

        createLayoutController().done(function(layoutController) {

            layoutController.showView({
                model: {
                    title: "SimpleView"
                },
                viewName: "simple-with-visible-back"
            }).done(function() {
                var $viewPort = $("#viewPort");

                var $navButton = $viewPort.find(".dx-slideout .dx-active-view .layout-toolbar .nav-button:visible"),
                    $toolbarLeftVisibleItems = $viewPort.find(".dx-slideout .dx-active-view .layout-toolbar .dx-toolbar-before .dx-toolbar-item:visible");

                assert.equal($navButton.length, 0);
                assert.equal($toolbarLeftVisibleItems.length, 1, "T175800");

                done();
            });

        });
    });

    QUnit.test("Navigation button doesn't exist if back command is visible and rendered on viewShown (T242013)", function(assert) {
        var done = assert.async();

        createLayoutController().done(function(layoutController) {

            layoutController.showView({
                model: {
                    title: "SimpleView"
                },
                viewName: "simple-with-visible-back-on-view-shown"
            }).done(function() {
                var $viewPort = $("#viewPort"),
                    $navButton = $viewPort.find(".dx-slideout .dx-active-view .layout-toolbar .nav-button:visible");

                assert.equal($navButton.length, 0);

                done();
            });

        });
    });

    QUnit.test("Navigation button exists if back command is invisible", function(assert) {
        var done = assert.async();

        createLayoutController().done(function(layoutController) {

            layoutController.showView({
                model: {
                    title: "SimpleView"
                },
                viewName: "simple-with-invisible-back"
            }).done(function() {
                var $viewPort = $("#viewPort");

                var $navButton = $viewPort.find(".dx-slideout .dx-active-view .nav-button:visible");
                assert.equal($navButton.length, 1);

                done();
            });

        });
    });

    QUnit.test("Navigation button is updated if toolbar is rerendered", function(assert) {
        var done = assert.async();

        createLayoutController().done(function(layoutController) {
            var backCommand = new dxCommand({ id: 'back', title: 'Custom', visible: false, renderStage: 'onViewRendering' });

            layoutController.showView({
                model: {
                    title: "SimpleView"
                },
                commands: [
                    backCommand
                ],
                viewName: "simple"
            }).done(function() {
                var $viewPort = $("#viewPort");

                var $navButton = $viewPort.find(".dx-slideout .dx-active-view .nav-button:visible");
                assert.equal($navButton.length, 1);

                var toolbar = $viewPort.find(".dx-slideout .dx-active-view .layout-toolbar").dxToolbar("instance");

                toolbar.repaint();

                $navButton = $viewPort.find(".dx-slideout .dx-active-view .nav-button:visible");
                assert.equal($navButton.length, 1);

                var slideOut = $viewPort.find(".dx-slideout").dxSlideOut("instance");

                assert.ok(!slideOut.option("menuVisible"));

                $navButton.trigger("dxclick");
                assert.ok(slideOut.option("menuVisible"), "T178940");

                done();
            });

        });
    });

    QUnit.test("Test view is shown before menu is hidden (S172782)", function(assert) {
        assert.expect(5);

        var done = assert.async();

        createLayoutController().done(function(layoutController) {
            var slideOut = layoutController.slideOut;

            assert.equal(slideOut.option("menuVisible"), false);

            slideOut.toggleMenuVisibility(true).done(function() {
                assert.equal(slideOut.option("menuVisible"), true);

                slideOut.on("optionChanged", function(args) {
                    assert.equal(args.name, "menuVisible");
                    assert.equal(args.value, false);
                    assert.equal(slideOut.$element().find(".layout-header .dx-toolbar-center .dx-toolbar-label .dx-item-content div").text(), "test title");
                });

                layoutController.showView({
                    model: {
                        title: "test title"
                    },
                    viewName: "simple"
                }).done(done);

            });

        });
    });

    QUnit.test("There should be no transitions if menu is visible (T246943)", function(assert) {
        assert.expect(6);

        var done = assert.async();

        createLayoutController().done(function(layoutController) {
            var slideOut = layoutController.slideOut,
                viewInfo1 = {
                    model: {
                        title: "test1"
                    },
                    viewName: "simple"
                },
                viewInfo2 = {
                    model: {
                        title: "test2"
                    },
                    viewName: "simple"
                },
                expectedFxOff;

            layoutController.transitionExecutor = {
                enter: function() {
                    assert.equal(fx.off, expectedFxOff);
                },
                leave: function() {},
                start: function() {
                    return $.Deferred().resolve().promise();
                }
            };

            expectedFxOff = false;
            layoutController.showView(viewInfo1);
            layoutController.showView(viewInfo2);

            expectedFxOff = true;
            slideOut.toggleMenuVisibility(true).done(function() {
                layoutController.showView(viewInfo1);
                done();
            });

        });
    });

    QUnit.test("Menu hides if navigation was canceled", function(assert) {
        var done = assert.async();

        createLayoutController().done(function(layoutController) {
            var slideOut = layoutController.slideOut;

            assert.equal(slideOut.option("menuVisible"), false);

            slideOut.toggleMenuVisibility(true).done(function() {
                assert.equal(slideOut.option("menuVisible"), true);

                layoutController._navigationManager.fireEvent("navigationCanceled", [{}]);
                assert.equal(slideOut.option("menuVisible"), false);

                done();
            });

        });
    });

    QUnit.test("Menu is hiding if it is disable (T398810)", function(assert) {
        var done = assert.async();

        createLayoutController().done(function(layoutController) {
            var slideOut = layoutController.slideOut;

            slideOut.toggleMenuVisibility(true).done(function() {
                assert.equal(slideOut.option("menuVisible"), true);

                layoutController.disable();
                assert.equal(slideOut.option("menuVisible"), false);

                done();
            });
        });
    });

    QUnit.test("Menu doesn't hide if navigation was canceled by redirect reason (T264514)", function(assert) {
        var done = assert.async();

        createLayoutController().done(function(layoutController) {
            var slideOut = layoutController.slideOut;

            assert.equal(slideOut.option("menuVisible"), false);

            slideOut.toggleMenuVisibility(true).done(function() {
                assert.equal(slideOut.option("menuVisible"), true);

                layoutController._navigationManager.fireEvent("navigationCanceled", [{ cancelReason: "redirect" }]);
                assert.equal(slideOut.option("menuVisible"), true, "T264514");

                done();
            });

        });
    });

    QUnit.test("T297623 SlideOut layout element has not any unnecessary items", function(assert) {
        var done = assert.async();

        createLayoutController({
            initOptions: {
                navigation: [
                    { title: "c1", id: "c1", onExecute: "#simple", }
                ]
            }
        }).done(function(layoutController) {
            var slideOut = layoutController.slideOut;
            slideOut.option("selectedIndex", 0);

            assert.ok(slideOut.$element().find(".dx-slideout-item").length === 0, "there is no any slideOut item");

            done();
        });
    });
}));
