/* global jQuery, includeLayout */

(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            module.exports = factory(
                require("jquery"),
                require("core/component"),
                require("framework/command"),
                require("animation/fx"),
                require("../../../helpers/pointerMock.js"),
                require("../../../helpers/layoutHelper.js"),
                require("../../../../layouts/Pivot/PivotLayout.js").PivotLayoutController
            );
        });
    } else {
        factory(
            jQuery,
            DevExpress.Component,
            DevExpress.framework.dxCommand,
            DevExpress.fx,
            root.pointerMock,
            DevExpress.testHelpers,
            DevExpress.layouts.PivotLayout.PivotLayoutController
        );
    }
}(this, function($, Component, dxCommand, fx, pointerMock, layoutHelper, PivotLayoutController) {

    includeLayout("Pivot");

    QUnit.testStart(function() {
        var markup = '                                                                                            \
            <div id="viewPort" class="dx-viewport"></div>                                                         \
            <div id="templates-root">                                                                             \
                <div data-options="dxView: { name: \'simple-view\' }">                                            \
                    <div data-options="dxContent: { targetPlaceholder: \'content\' }">                            \
                        <div class="view-content simple-content"></div>                                           \
                    </div>                                                                                        \
                </div>                                                                                            \
                                                                                                                  \
                <div data-options="dxView: { name: \'for-B251293-with-appbar\' }">                                \
                    <div data-bind="dxCommand: { visible: true, id: \'create\', title: \'Add\' }"></div>          \
                    <div data-options="dxContent: { targetPlaceholder: \'content\' }">123</div>                   \
                </div>                                                                                            \
                                                                                                                  \
                <div data-options="dxView: { name: \'for-B251293-without-appbar\' }">                             \
                    <div data-options="dxContent: { targetPlaceholder: \'content\' }">312</div>                   \
                </div>                                                                                            \
                                                                                                                  \
                <div data-options="dxView: { name: \'with-orientation\', orientation: \'landscape\' }">           \
                    <div data-options="dxContent: { targetPlaceholder: \'content\' }">                            \
                        <div class="view-content landscape"></div>                                                \
                    </div>                                                                                        \
                </div>                                                                                            \
                                                                                                                  \
                <div data-options="dxView: { name: \'with-orientation\', orientation: \'portrait\' }">            \
                    <div data-options="dxContent: { targetPlaceholder: \'content\' }">                            \
                        <div class="view-content portrait"></div>                                                 \
                    </div>                                                                                        \
                </div>                                                                                            \
                                                                                                                  \
                <div data-options="dxView: { name: \'for-T101899\' }">                                            \
                    <div data-options="dxContent: { targetPlaceholder: \'content\' }">                            \
                        <div class="view-content">content</div>                                                   \
                    </div>                                                                                        \
                </div>                                                                                            \
                                                                                                                  \
                <div data-options="dxView: { name: \'for-T136717\' }">                                            \
                    <div data-options="dxContent: { targetPlaceholder: \'content\' }"></div>                      \
                </div>                                                                                            \
                                                                                                                  \
            </div>';

        $("#qunit-fixture").append(markup);
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
            return new PivotLayoutController(ctorOptions);
        });
    }

    QUnit.module("PivotLayoutController");

    QUnit.test("Test template", function(assert) {
        var done = assert.async();

        createLayoutController({ activateManually: false }).done(function(layoutController) {
            var $viewPort = $("#viewPort");

            assert.equal($viewPort.children(".pivot-layout.dx-fast-hidden").length, 0);
            assert.equal($viewPort.children(".pivot-layout:visible").length, 1);

            layoutController.deactivate();
            assert.equal($viewPort.children(".pivot-layout.dx-fast-hidden").length, 1);
            assert.equal($viewPort.children(".pivot-layout:visible").length, 1, "Hidden by position not display");

            done();
        });
    });

    QUnit.test("B251293: Multi-channel, WP8 app - list in listview has wrong height, overlaps with bottom bar", function(assert) {
        var done = assert.async();

        createLayoutController(
            {
                initOptions: {
                    navigation: [{ title: "Test", onExecute: "#test", icon: "test" }]
                }
            }
        ).done(function(layoutController) {

            layoutController.showView({
                viewName: "for-B251293-with-appbar",
                model: { title: "SimpleView", content: "SimpleContent" }
            }).done(function() {
                layoutController.activate().done(function() {

                    var $viewPort = $("#viewPort"),
                        $layout = $viewPort.children(".pivot-layout"),
                        $layoutFooter = $layout.children(".layout-footer");

                    assert.ok($layout.hasClass("has-toolbar-bottom"));
                    assert.equal($layoutFooter.length, 1);
                    assert.equal($layoutFooter.children(".dx-active-view").length, 1);

                    assert.ok($layoutFooter.children(".dx-active-view").find(".dx-toolbar").is(":visible"));
                    assert.ok($layoutFooter.children(".dx-active-view").find(".dx-toolbar").hasClass("layout-toolbar-bottom"));
                    assert.ok(!$layoutFooter.children(".dx-active-view").find(".dx-toolbar").hasClass("dx-state-invisible"));

                    // show another view (without toolbar)
                    layoutController.showView({
                        viewName: "for-B251293-without-appbar",
                        model: {
                            title: "SimpleViewTitle",
                            content: "SimpleViewContent"
                        }
                    }).then(function() {
                        var $viewPort = $("#viewPort"),
                            $layout = $viewPort.children(".pivot-layout"),
                            $layoutFooter = $layout.children(".layout-footer");

                        assert.ok(!$layout.hasClass("has-toolbar-bottom"));
                        assert.equal($layoutFooter.children(".dx-active-view").length, 1);
                        assert.ok($layoutFooter.children(".dx-active-view").find(".dx-toolbar").hasClass("dx-state-invisible"));

                        done();
                    });

                });
            });
        });
    });

    QUnit.test("changing orientation", function(assert) {
        var done = assert.async();

        var templateContext = new Component({
            orientation: "portrait"
        });

        createLayoutController(
            {
                initOptions: {
                    templateContext: templateContext,
                    navigation: [{ title: "Test", onExecute: "#test", icon: "test" }]
                },
                viewEngineOptions: {
                    templateContext: templateContext
                }
            }

        ).done(function(layoutController) {

            layoutController.showView({
                viewName: "with-orientation",
                model: { title: "SimpleView", content: "SimpleContent" }
            }).done(function() {

                layoutController.activate().done(function() {

                    assert.equal($("#viewPort .dx-layout .dx-active-view .portrait").length, 1);
                    assert.equal($("#viewPort .dx-layout .dx-active-view .landscape").length, 0);

                    templateContext.option("orientation", "landscape");

                    assert.equal($("#viewPort .dx-layout .dx-active-view .landscape").length, 1);
                    assert.equal($("#viewPort .dx-layout .dx-active-view .portrait").length, 0);

                    templateContext.option("orientation", "portrait");

                    assert.equal($("#viewPort .dx-layout .dx-active-view .portrait").length, 1);
                    assert.equal($("#viewPort .dx-layout .dx-active-view .landscape").length, 0);

                    done();

                });
            });
        });
    });

    QUnit.test("changing orientation on same view (T244085)", function(assert) {
        var done = assert.async();

        var templateContext = new Component({
            orientation: "portrait"
        });

        createLayoutController(
            {
                initOptions: {
                    templateContext: templateContext,
                    navigation: [{ title: "Test", onExecute: "#test", icon: "test" }]
                },
                viewEngineOptions: {
                    templateContext: templateContext
                }
            }

        ).done(function(layoutController) {

            layoutController.showView({
                viewName: "simple-view",
                model: {}
            }).done(function() {

                layoutController.activate().done(function() {

                    assert.equal($("#viewPort .dx-layout .dx-active-view .simple-content").length, 1);

                    templateContext.option("orientation", "landscape");
                    assert.equal($("#viewPort .dx-layout .dx-active-view .simple-content").length, 1);

                    templateContext.option("orientation", "portrait");
                    assert.equal($("#viewPort .dx-layout .dx-active-view .simple-content").length, 1);

                    done();

                });
            });
        });
    });

    QUnit.test("T101899 scenario 1 - change navigation items after logoff/logon (completely recreate navigation commands)", function(assert) {
        var done = assert.async();

        var viewInfo = {
            viewName: "for-T101899",
            model: {}
        };

        createLayoutController({
            initOptions: {
                navigation: [
                    { title: "c1", id: "c1" },
                    { title: "c2", id: "c2" }
                ]
            }
        }).then(function(layoutController) {
            layoutController.showView(viewInfo).then(function() {
                layoutController.activate().done(function() {

                    var $pivot = layoutController.$pivot,
                        pivot = $pivot.dxPivot("instance"),
                        commandMapping = layoutController._commandManager.commandMapping;

                    var items = pivot.option("items");
                    assert.equal(items.length, 2);
                    assert.equal(items[0].title, "c1");
                    assert.equal(items[1].title, "c2");
                    assert.equal($pivot.find(".dx-pivot-item:not(.dx-pivot-item-hidden) .view-content:visible").length, 1);

                    layoutController.deactivate();// logoff

                    var newNavigation = layoutHelper.prepareNavigation([
                        { title: "c2", id: "c2" },
                        { title: "c3", id: "c3" }
                    ], commandMapping);

                    layoutController.renderNavigation(newNavigation);
                    layoutController.activate();// logon
                    layoutController.showView(viewInfo).then(function() {
                        items = pivot.option("items");
                        assert.equal(items.length, 2);
                        assert.equal(items[0].title, "c2");
                        assert.equal(items[1].title, "c3");
                        assert.equal($pivot.find(".dx-pivot-item:not(.dx-pivot-item-hidden) .view-content:visible").length, 1);

                        done();
                    });

                });
            });
        });
    });

    QUnit.test("T101899 scenario 2 - change navigation items after logoff/logon (change navigation commands visibility)", function(assert) {
        var done = assert.async();

        var viewInfo = {
            viewName: "for-T101899",
            model: {}
        };

        createLayoutController().then(function(layoutController) {
            var $pivot = layoutController.$pivot,
                pivot = $pivot.dxPivot("instance"),
                commandMapping = layoutController._commandManager.commandMapping,
                navigation = layoutHelper.prepareNavigation([
                    { title: "c1", id: "c1" },
                    { title: "c2", id: "c2", visible: false },
                    { title: "c3", id: "c3" }
                ], commandMapping);

            layoutController.renderNavigation(navigation);

            layoutController.showView(viewInfo).then(function() {
                layoutController.activate().done(function() {

                    var items = pivot.option("items");
                    assert.equal(items.length, 2);
                    assert.equal(items[0].title, "c1");
                    assert.equal(items[1].title, "c3");
                    assert.equal($pivot.find(".dx-pivot-item:not(.dx-pivot-item-hidden) .view-content:visible").length, 1);

                    layoutController.deactivate();// logoff

                    navigation[0].option("visible", false);
                    navigation[1].option("visible", true);
                    navigation[2].option("visible", false);

                    // layoutController.renderNavigation(navigation);
                    layoutController.activate();// logon
                    layoutController.showView(viewInfo).then(function() {
                        items = pivot.option("items");
                        assert.equal(items.length, 1);
                        assert.equal(items[0].title, "c2");
                        assert.equal($pivot.find(".dx-pivot-item:not(.dx-pivot-item-hidden) .view-content:visible").length, 1);

                        done();
                    });

                });
            });
        });
    });

    QUnit.test("Navigation command executes on swipe (T136717)", function(assert) {
        var done = assert.async();

        var commandExecuteLog = [],
            viewInfo1 = {
                viewName: "for-T136717",
                model: {}
            };

        var onCommandExecute = function(args) {
            commandExecuteLog.push(args);
        };

        createLayoutController({
            initOptions: {
                navigation: [
                    new dxCommand({ title: "Test1", onExecute: onCommandExecute }),
                    new dxCommand({ title: "Test2", onExecute: onCommandExecute })
                ]
            }
        }).then(function(layoutController) {
            var $pivot = layoutController.$pivot,
                pivot = $pivot.dxPivot("instance");

            var items = pivot.option("items");
            assert.equal(items.length, 2);

            layoutController.showView(viewInfo1).then(function() {
                layoutController.activate().done(function() {

                    var pointer = pointerMock($pivot);

                    fx.off = true;
                    try {
                        assert.equal(commandExecuteLog.length, 0);
                        pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);
                        assert.equal(commandExecuteLog.length, 1);
                        assert.equal(commandExecuteLog[0].addedItems[0].command.option("title"), "Test2");
                        pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
                        assert.equal(commandExecuteLog.length, 2);
                        assert.equal(commandExecuteLog[1].addedItems[0].command.option("title"), "Test1");
                    } finally {
                        fx.off = false;
                        done();
                    }

                });
            });

        });
    });

}));
