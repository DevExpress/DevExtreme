/* global jQuery, ko, includeLayout */

(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            module.exports = factory(
                require("jquery"),
                require("knockout"),
                require("framework/router"),
                require("core/utils/dom"),
                require("framework/html/html_application"),
                require("framework/html/view_engine").ViewEngine,
                require("framework/html/command_manager"),
                require("framework/command"),
                require("animation/fx"),
                require("framework/state_manager").MemoryKeyValueStorage,

                require("../../../helpers/frameworkMocks.js"),
                require("../../../helpers/htmlFrameworkMocks.js"),
                require("../../../helpers/layoutHelper.js").createLayoutController,
                require("../../../../layouts/Empty/EmptyLayout.js"),
                require("../../../../layouts/Simple/SimpleLayout.js"),
                require("../../../../layouts/Split/SplitLayout.js")
            );
        });
    } else {
        factory(
            jQuery,
            ko,
            DevExpress.framework.Router,
            DevExpress.utils.dom,
            DevExpress.framework.html.HtmlApplication,
            DevExpress.framework.html.ViewEngine,
            DevExpress.framework.html.CommandManager,
            DevExpress.framework.dxCommand,
            DevExpress.fx,
            DevExpress.framework.MemoryKeyValueStorage,

            DevExpress.mocks.framework,
            DevExpress.mocks.framework.html,
            DevExpress.testHelpers.createLayoutController,
            DevExpress.layouts.EmptyLayout,
            DevExpress.layouts.SimpleLayout,
            DevExpress.layouts.SplitLayout
        );
    }
}(this, function($, ko, Router, domUtils, HtmlApplication, ViewEngine, CommandManager, dxCommand, fx, MemoryKeyValueStorage,
    frameworkMocks, htmlFrameworkMocks, createLayoutController, emptyLayoutControllerModule, SimpleLayoutControllerModule, splitLayoutControllerModule) {

    includeLayout("Empty");
    includeLayout("Simple");
    includeLayout("Split");

    var MultipaneLayoutController = splitLayoutControllerModule.MultipaneLayoutController,
        ToolbarController = splitLayoutControllerModule.ToolbarController,
        AndroidSplitLayoutController = splitLayoutControllerModule.AndroidSplitLayoutController,
        IOSSplitLayoutController = splitLayoutControllerModule.IOSSplitLayoutController,
        WinSplitLayoutController = splitLayoutControllerModule.WinSplitLayoutController;

    QUnit.testStart(function() {
        var markup = '                                                                                                                                                                       \
            <div id="viewPort" class="dx-viewport"></div>                                                                                                                                    \
                                                                                                                                                                                             \
            <div id="templates-root">                                                                                                                                                        \
                <div data-options="dxView: { name: \'test\', pane: \'master\' }">                                                                                                            \
                    <div data-options="dxContent: { targetPlaceholder: \'content\' }">                                                                                                       \
                        <div class="view-content">content</div>                                                                                                                              \
                    </div>                                                                                                                                                                   \
                </div>                                                                                                                                                                       \
                <div data-options="dxView: { name: \'detail-view\' }"></div>                                                                                                                 \
                                                                                                                                                                                             \
                <div class="test-split" data-options="dxLayout : { name: \'test-split\', platform: \'test\' }">                                                                              \
                    <div class="first-test-pane">                                                                                                                                            \
                    </div>                                                                                                                                                                   \
                    <div class="second-test-pane">                                                                                                                                           \
                    </div>                                                                                                                                                                   \
                </div>                                                                                                                                                                       \
            </div>                                                                                                                                                                           \
                                                                                                                                                                                             \
            <div id="split">                                                                                                                                                                 \
                <div data-options="dxView: { name: \'master-view\', pane: \'master\' }"></div>                                                                                               \
                <div data-options="dxView: { name: \'detail-view\', pane: \'detail\' }"></div>                                                                                               \
            </div>                                                                                                                                                                           \
                                                                                                                                                                                             \
            <div id="test-toolbar">                                                                                                                                                          \
                <div class="render-result">                                                                                                                                                  \
                    <div class="toolbar" data-bind="dxToolbar: { items: [{ text: \'Test\' }] }" data-options="dxCommandContainer: { id: \'test-container\' } ">                              \
                    </div>                                                                                                                                                                   \
                </div>                                                                                                                                                                       \
            </div>                                                                                                                                                                           \
                                                                                                                                                                                             \
            <div id="test-android">                                                                                                                                                          \
                <div data-options="dxView: { name: \'test\' }">                                                                                                                              \
                </div>                                                                                                                                                                       \
                                                                                                                                                                                             \
                <div class="android-split" data-options="dxLayout: { name: \'android-split\' }">                                                                                             \
                    <div class="header-toolbar" data-bind="dxToolbar: {}" data-options="dxCommandContainer: { id: \'test-container\' } ">                                                    \
                    </div>                                                                                                                                                                   \
                    <div class="first-test-pane">                                                                                                                                            \
                    </div>                                                                                                                                                                   \
                    <div class="second-test-pane">                                                                                                                                           \
                    </div>                                                                                                                                                                   \
                </div>                                                                                                                                                                       \
            </div>                                                                                                                                                                           \
                                                                                                                                                                                             \
            <div id="test-update-title">                                                                                                                                                     \
                <div data-options="dxView: { name: \'test\' }">                                                                                                                              \
                </div>                                                                                                                                                                       \
                                                                                                                                                                                             \
                <div class="split" data-options="dxLayout: { name: \'split\' }">                                                                                                             \
                    <div class="header-toolbar" data-bind="dxToolbar: { items: [{ text: title, location: \'center\' }] }" data-options="dxCommandContainer: { id: \'test-container\' } ">    \
                    </div>                                                                                                                                                                   \
                    <div class="first-test-pane">                                                                                                                                            \
                    </div>                                                                                                                                                                   \
                    <div class="second-test-pane">                                                                                                                                           \
                    </div>                                                                                                                                                                   \
                    <div class="footer-toolbar" data-bind="dxToolbar: {}" data-options="dxCommandContainer: { id: \'test-container\' } ">                                                    \
                    </div>                                                                                                                                                                   \
                </div>                                                                                                                                                                       \
            </div>';

        $("#qunit-fixture").append(markup);
    });

    function createMultipaneLayoutController(options) {
        options = options || {};

        options.device = options.device || {
            platform: "win",
            tablet: true
        };

        return createLayoutController(options, function(ctorOptions) {
            return new MultipaneLayoutController(ctorOptions);
        });
    }

    function objectKeysLength(obj) {
        var length = 0;

        for(var key in obj) { // eslint-disable-line no-unused-vars
            length++;
        }

        return length;
    }

    QUnit.module("MultipaneLayoutController");

    QUnit.test("Test initiation, activation and deactivation", function(assert) {
        var done = assert.async(),
            firstController = new htmlFrameworkMocks.MockLayoutController(),
            secondController = new htmlFrameworkMocks.MockLayoutController();

        createLayoutController({ device: { platform: 'test' } }, function(options) {
            try {
                return new MultipaneLayoutController({
                    name: "test-split",
                    panesConfig: {
                        firstPane: {
                            controller: firstController,
                            selector: ".first-test-pane"
                        },
                        secondPane: {
                            controller: secondController,
                            selector: ".second-test-pane"
                        }
                    }
                });
            } catch(e) {
                done();
            }
        }).done(function(layoutController) {

            assert.equal(firstController.__initLog.length, 1);
            assert.ok(firstController.__initLog[0].$viewPort.is(".first-test-pane"), "First child controller uses master layout's pane selector as it's viewport");
            assert.equal(firstController.__activateLog.length, 1);

            assert.equal(secondController.__initLog.length, 1);
            assert.ok(secondController.__initLog[0].$viewPort.is(".second-test-pane"), "Second child controller uses master layout's pane selector as it's viewport");
            assert.equal(secondController.__activateLog.length, 1);

            layoutController.deactivate();
            assert.equal(firstController.__deactivateLog.length, 1);
            assert.equal(secondController.__deactivateLog.length, 1);

            done();
        });
    });

    QUnit.test("Test showView", function(assert) {
        var done = assert.async(),
            firstController = new htmlFrameworkMocks.MockLayoutController(),
            secondController = new htmlFrameworkMocks.MockLayoutController();

        createLayoutController({ device: { platform: 'test' } }, function(options) {
            // refactor tests: replace createLayoutController with initLayoutController since we have the instance here in test
            try {
                return new MultipaneLayoutController({
                    name: "test-split",
                    panesConfig: {
                        firstPane: {
                            controller: firstController,
                            selector: ".first-test-pane"
                        },
                        secondPane: {
                            controller: secondController,
                            selector: ".second-test-pane"
                        }
                    }
                });
            } catch(e) {
                done();
            }
        }).done(function(layoutController) {

            var firstPaneViewInfo = {
                    viewTemplateInfo: {
                        pane: "firstPane"
                    }
                },
                secondPaneViewInfo = {
                    viewTemplateInfo: {
                        pane: "secondPane"
                    }
                };

            layoutController.showView(firstPaneViewInfo, "first-direction");

            assert.equal(firstController.__showViewLog.length, 1);
            assert.equal(firstController.__showViewLog[0].viewInfo, firstPaneViewInfo);
            assert.equal(firstController.__showViewLog[0].direction, "first-direction");
            assert.equal(secondController.__showViewLog.length, 0);

            layoutController.showView(secondPaneViewInfo, "second-direction");

            assert.equal(firstController.__showViewLog.length, 1);
            assert.equal(firstController.__showViewLog[0].viewInfo, firstPaneViewInfo);
            assert.equal(firstController.__showViewLog[0].direction, "first-direction");
            assert.equal(secondController.__showViewLog.length, 1);
            assert.equal(secondController.__showViewLog[0].viewInfo, secondPaneViewInfo);
            assert.equal(secondController.__showViewLog[0].direction, "second-direction");

            done();
        });
    });

    QUnit.test("T220809: Unexpected commands are rendered in About view of Win8 SplitLayout", function(assert) {
        var done = assert.async(),
            firstController = new htmlFrameworkMocks.MockLayoutController(),
            secondController = new htmlFrameworkMocks.MockLayoutController();

        createLayoutController({ device: { platform: 'test' } }, function(options) {
            try {
                return new MultipaneLayoutController({
                    name: "test-split",
                    panesConfig: {
                        firstPane: {
                            controller: firstController,
                            selector: ".first-test-pane"
                        },
                        secondPane: {
                            controller: secondController,
                            selector: ".second-test-pane"
                        }
                    }
                });
            } catch(e) {
                done();
            }
        }).done(function(layoutController) {

            var firstPaneViewInfo = {
                    viewTemplateInfo: {
                        pane: "firstPane"
                    }
                },
                secondPaneViewInfo = {
                    viewTemplateInfo: {
                        pane: "secondPane"
                    }
                };

            assert.equal(layoutController._activeViews.firstPane, undefined);
            assert.equal(layoutController._activeViews.secondPane, undefined);

            layoutController.showView(firstPaneViewInfo, "first-direction");

            assert.equal(layoutController._activeViews.firstPane, firstPaneViewInfo);
            assert.equal(layoutController._activeViews.secondPane, undefined);

            layoutController.showView(secondPaneViewInfo, "second-direction");

            assert.equal(layoutController._activeViews.firstPane, firstPaneViewInfo);
            assert.equal(layoutController._activeViews.secondPane, secondPaneViewInfo);

            layoutController.deactivate().done(function() {

                assert.equal(layoutController._activeViews.firstPane, undefined);
                assert.equal(layoutController._activeViews.secondPane, undefined);

                done();
            });

        });
    });

    QUnit.test("Test target navigation stack is chosen correctly on navigating", function(assert) {
        var done = assert.async(),
            firstController = new htmlFrameworkMocks.MockLayoutController(),
            secondController = new htmlFrameworkMocks.MockLayoutController(),
            router = new Router();

        router.register(":view/:id", { view: "index", id: undefined });
        var app = new frameworkMocks.MockApplication({ router: router });

        createLayoutController({ device: { platform: 'test' }, initOptions: { app: app } }, function(options) {
            try {
                return new MultipaneLayoutController({
                    name: "test-split",
                    panesConfig: {
                        master: {
                            controller: firstController,
                            selector: ".first-test-pane"
                        },
                        detail: {
                            controller: secondController,
                            selector: ".second-test-pane"
                        }
                    }
                });
            } catch(e) {
                done();
            }
        }).done(function(layoutController) {
            var $eventSourceElement,
                $layoutMarkup = layoutController._$mainLayout,
                $mockMasterPainEventSource = $("<div/>").appendTo($layoutMarkup.find(".first-test-pane")),
                $mockDetailPainEventSource = $("<div/>").appendTo($layoutMarkup.find(".second-test-pane")),
                $mockUnknownEventSource = $("<div/>").appendTo($layoutMarkup);

            layoutController._getEventSourceElement = function() { return $eventSourceElement; };
            $eventSourceElement = $mockMasterPainEventSource;

            var navigationManager = layoutController._navigationManager,
                steps = [
                    function() {
                        var stacks = navigationManager.navigationStacks;

                        assert.equal(objectKeysLength(stacks), 0);

                        navigationManager.navigate("test");
                    },
                    function() {
                        var stacks = navigationManager.navigationStacks,
                            currentStack = navigationManager.currentStack;

                        assert.equal(objectKeysLength(stacks), 1);
                        assert.equal(stacks.test.items.length, 1);
                        assert.equal(currentStack, stacks.test);

                        navigationManager.navigate("detail-view");
                    },
                    function() {
                        var stacks = navigationManager.navigationStacks,
                            currentStack = navigationManager.currentStack;

                        assert.equal(objectKeysLength(stacks), 2);
                        assert.equal(stacks.test.items.length, 1);
                        assert.equal(stacks.detail_pane.items.length, 1);
                        assert.equal(currentStack, stacks.detail_pane);

                        navigationManager.navigate("test/2");
                    },
                    function() {
                        var stacks = navigationManager.navigationStacks,
                            currentStack = navigationManager.currentStack;

                        assert.equal(objectKeysLength(stacks), 2);
                        assert.equal(stacks.test.items.length, 2);
                        assert.equal(stacks.detail_pane.items.length, 1);
                        assert.equal(currentStack, stacks.test);

                        navigationManager.navigate("detail-view/2");
                    },
                    function() {
                        var stacks = navigationManager.navigationStacks,
                            currentStack = navigationManager.currentStack;

                        assert.equal(objectKeysLength(stacks), 2);
                        assert.equal(stacks.test.items.length, 2);
                        assert.equal(stacks.detail_pane.items.length, 1, "detail view initiated from master pane is root");
                        assert.equal(currentStack, stacks.detail_pane);

                        $eventSourceElement = $mockDetailPainEventSource;
                        navigationManager.navigate("detail-view/3");
                    },
                    function() {
                        var stacks = navigationManager.navigationStacks,
                            currentStack = navigationManager.currentStack;

                        assert.equal(objectKeysLength(stacks), 2);
                        assert.equal(stacks.test.items.length, 2);
                        assert.equal(stacks.detail_pane.items.length, 2, "detail view initiated from detail pane is not root");
                        assert.equal(currentStack, stacks.detail_pane);

                        $eventSourceElement = $mockUnknownEventSource;
                        navigationManager.navigate("detail-view/4");
                    },
                    function(navigatedArgs) {
                        var stacks = navigationManager.navigationStacks,
                            currentStack = navigationManager.currentStack;

                        assert.equal(objectKeysLength(stacks), 2);
                        assert.equal(stacks.test.items.length, 2);
                        assert.equal(stacks.detail_pane.items.length, 3, "detail view initiated from unknown element is not root");
                        assert.equal(currentStack, stacks.detail_pane);

                        done();
                    }
                ],
                doStep = function(navigatedArgs) {
                    var step = steps.shift();
                    step(navigatedArgs);
                };

            navigationManager.on("navigated", doStep);

            doStep();
        });
    });

    QUnit.test("The 'init' method doesn't subscribe to the 'navigating' event (T336375)", function(assert) {
        var done = assert.async(),
            firstController = new htmlFrameworkMocks.MockLayoutController(),
            secondController = new htmlFrameworkMocks.MockLayoutController(),
            router = new Router();

        router.register(":view/:id", { view: "index", id: undefined });
        var app = new frameworkMocks.MockApplication({ router: router });

        createLayoutController({ device: { platform: 'test' }, initOptions: { app: app }, activateManually: true }, function(options) {
            try {
                return new MultipaneLayoutController({
                    name: "test-split",
                    panesConfig: {
                        master: {
                            controller: firstController,
                            selector: ".first-test-pane"
                        },
                        detail: {
                            controller: secondController,
                            selector: ".second-test-pane"
                        }
                    }
                });
            } catch(e) {
                done();
            }
        }).done(function(layoutController) {
            var navigationManager = layoutController._navigationManager,
                steps = [
                    function() {
                        var stacks = navigationManager.navigationStacks;

                        assert.equal(objectKeysLength(stacks), 0);

                        navigationManager.navigate("detail-view/first");
                    },
                    function() {
                        var stacks = navigationManager.navigationStacks,
                            currentStack = navigationManager.currentStack;

                        assert.equal(objectKeysLength(stacks), 1);
                        assert.ok(stacks["detail-view/first"], "T336375");
                        assert.equal(stacks["detail-view/first"].items.length, 1);
                        assert.equal(currentStack, stacks["detail-view/first"]);

                        done();
                    }
                ],
                doStep = function(navigatedArgs) {
                    var step = steps.shift();
                    step(navigatedArgs);
                };

            navigationManager.on("navigated", doStep);

            doStep();
        });
    });

    QUnit.test("Test target navigation stack is processed correctly on navigating back", function(assert) {
        var done = assert.async(),
            firstController = new htmlFrameworkMocks.MockLayoutController(),
            secondController = new htmlFrameworkMocks.MockLayoutController(),
            router = new Router();

        router.register(":view/:id", { view: "index", id: undefined });
        var app = new frameworkMocks.MockApplication({ router: router });

        createLayoutController({ device: { platform: 'test' }, initOptions: { app: app } }, function(options) {
            try {
                return new MultipaneLayoutController({
                    name: "test-split",
                    panesConfig: {
                        master: {
                            controller: firstController,
                            selector: ".first-test-pane"
                        },
                        detail: {
                            controller: secondController,
                            selector: ".second-test-pane"
                        }
                    }
                });
            } catch(e) {
                done();
            }
        }).done(function(layoutController) {
            var navigationManager = layoutController._navigationManager,
                steps = [
                    function() {
                        navigationManager.navigate("test");
                    },
                    function() {
                        navigationManager.navigate("detail-view/1");
                    },
                    function() {
                        navigationManager.navigate("test/2");
                    },
                    function() {
                        navigationManager.navigate("detail-view/2");
                    },
                    function(navigatedArgs) {
                        navigationManager.back({ stack: "test" });// stack is passed by application while creating a back command
                    },
                    function(navigatedArgs) {
                        var stacks = navigationManager.navigationStacks,
                            currentStack = navigationManager.currentStack;

                        assert.equal(currentStack, stacks.test);
                        assert.equal(currentStack.currentItem().uri, "test");

                        navigationManager.back({ stack: "detail_pane" });
                    },
                    function(navigatedArgs) {
                        var stacks = navigationManager.navigationStacks,
                            currentStack = navigationManager.currentStack;

                        assert.equal(currentStack, stacks.detail_pane);
                        assert.equal(currentStack.currentItem().uri, "detail-view/1");

                        done();
                    }
                ],
                doStep = function(navigatedArgs) {
                    var step = steps.shift();
                    step(navigatedArgs);
                };

            navigationManager.on("navigated", doStep);

            doStep();
        });
    });

    QUnit.test("Master pane stack key is initialized properly on the very first view showing (T394291)", function(assert) {
        var done = assert.async(),
            viewEngine = new ViewEngine({
                $root: $("#templates-root")
            }),
            navigationManager = new frameworkMocks.MockStackBasedNavigationManager(),
            router = new Router();

        router.register(":view/:id", { view: undefined, id: undefined });

        viewEngine.init().done(function() {

            var layoutController = new MultipaneLayoutController({
                name: "test-split",
                panesConfig: {
                    master: {
                        controller: new htmlFrameworkMocks.MockLayoutController(),
                        selector: ".first-test-pane"
                    },
                    detail: {
                        controller: new htmlFrameworkMocks.MockLayoutController(),
                        selector: ".second-test-pane"
                    }
                }
            });

            layoutController.init({
                $viewPort: $("#viewPort"),
                viewEngine: viewEngine,
                navigationManager: navigationManager,
                router: router
            });

            var app = new HtmlApplication({
                namespace: {},
                layoutSet: [{ controller: layoutController }],
                viewEngine: viewEngine,
                navigationManager: navigationManager,
                router: router
            });

            var steps = [
                    function() {
                        // create the 'detail-view' stack
                        navigationManager.navigate("detail-view/1");
                    },
                    function() {
                        // add the second item to the 'test' stack
                        navigationManager.navigate("test/1");
                    },
                    function() {
                        // add the second item to the 'detail-view' stack
                        navigationManager.navigate("detail-view/2");
                        assert.ok(app.canBack("test"), "It's possible to go back in the 'test' stack (T394291)");
                    },
                    function(navigatedArgs) {
                        done();
                    }
                ],
                doStep = function(args) {
                    var step = steps.shift();
                    step(args);
                };

            navigationManager.on("navigated", doStep);

            // create the 'test' stack
            app.navigate("test");
        });
    });

    QUnit.test("ToolbarController: merge commands", function(assert) {
        var done = assert.async();
        domUtils.createComponents($("#qunit-fixture"));
        ko.applyBindings({}, $("#test-toolbar").get(0));

        var $renderResult = $("#test-toolbar .render-result"),
            $toolbar = $renderResult.find(".toolbar");

        var commandManager = new CommandManager(),
            toolbarController = new ToolbarController($toolbar, commandManager),
            viewInfos = {
                first: {
                    commands: [
                        new dxCommand({ id: "c1" }),
                        new dxCommand({ id: "c2" })
                    ]
                },
                second: {
                    commands: [
                        new dxCommand({ id: "c3" }),
                        new dxCommand({ id: "c4" })
                    ]
                }
            };

        commandManager.renderCommandsToContainers = function(commands, containers) {
            var toolbarInstance = $toolbar.dxToolbar("instance");

            assert.equal(fx.off, true, "T303824");
            assert.equal(commands.length, 4);
            assert.equal(toolbarInstance.option("items").length, 1, "Test item remains untouched");
            done();
        };

        toolbarController.showViews(viewInfos);
    });

    QUnit.test("Test Android controller", function(assert) {
        assert.expect(2);

        var done = assert.async(),
            commandManager = new CommandManager(),
            firstController = new htmlFrameworkMocks.MockLayoutController(),
            secondController = new htmlFrameworkMocks.MockLayoutController(),
            app = { router: new frameworkMocks.MockRouter({ __parseResult: [], __formatResult: [] }) };

        domUtils.createComponents($("#qunit-fixture"));

        createLayoutController({
            device: { platform: 'test' },
            $root: $("#test-android"),
            initOptions: {
                commandManager: commandManager,
                app: app
            }
        }, function(options) {
            try {
                return new AndroidSplitLayoutController({
                    name: "android-split",
                    panesConfig: {
                        firstPane: {
                            controller: firstController,
                            selector: ".first-test-pane"
                        },
                        secondPane: {
                            controller: secondController,
                            selector: ".second-test-pane"
                        }
                    }
                });
            } catch(e) {
                done();
            }
        }).done(function(layoutController) {
            var viewInfos = {
                    first: {
                        viewTemplateInfo: {
                            pane: "firstPane"
                        },
                        commands: [
                            new dxCommand({ id: "c1" })
                        ],
                        model: {
                            title: "Test"
                        }
                    },
                    second: {
                        viewTemplateInfo: {
                            pane: "secondPane"
                        },
                        commands: [
                            new dxCommand({ id: "c2" })
                        ],
                        model: {
                            title: "Test"
                        }
                    }
                },
                showViewsLog = [];

            layoutController.toolbarController.showViews = function(viewInfos) {
                showViewsLog = viewInfos;
            };

            layoutController.showView(viewInfos.first, "first-direction");
            assert.equal(objectKeysLength(showViewsLog), 1);
            showViewsLog = [];

            layoutController.showView(viewInfos.second, "second-direction");
            assert.equal(objectKeysLength(showViewsLog), 2, "showViews has been invoked twice; 2 active views");
            done();
        });
    });

    QUnit.test("child controllers events reraising", function(assert) {
        var done = assert.async(),
            firstController = new htmlFrameworkMocks.MockLayoutController(),
            secondController = new htmlFrameworkMocks.MockLayoutController();

        createLayoutController({ device: { platform: 'test' } }, function(options) {
            try {
                return new MultipaneLayoutController({
                    name: "test-split",
                    panesConfig: {
                        firstPane: {
                            controller: firstController,
                            selector: ".first-test-pane"
                        },
                        secondPane: {
                            controller: secondController,
                            selector: ".second-test-pane"
                        }
                    }
                });
            } catch(e) {
                done();
            }
        }).done(function(layoutController) {
            var viewEventsLog = [];

            layoutController.on("viewReleased", function(args) {
                viewEventsLog.push(args);
            });
            layoutController.on("viewRendered", function(args) {
                viewEventsLog.push(args);
            });
            layoutController.on("viewShowing", function(args) {
                viewEventsLog.push(args);
            });

            firstController.fireEvent("viewReleased", [{ a: 1 }]);
            secondController.fireEvent("viewReleased", [{ a: 2 }]);
            firstController.fireEvent("viewRendered", [{ a: 3 }]);
            secondController.fireEvent("viewRendered", [{ a: 4 }]);
            firstController.fireEvent("viewShowing", [{ a: 5 }]);
            secondController.fireEvent("viewShowing", [{ a: 6 }]);

            assert.equal(viewEventsLog.length, 6, "Both child controller events are reraised");
            assert.equal(viewEventsLog[0].a, 1);
            assert.equal(viewEventsLog[1].a, 2);
            assert.equal(viewEventsLog[2].a, 3);
            assert.equal(viewEventsLog[3].a, 4);
            assert.equal(viewEventsLog[4].a, 5);
            assert.equal(viewEventsLog[5].a, 6);

            done();
        });
    });

    var testUpdateLayoutTitle = function(controllerName, assert) {
        var done = assert.async(),
            commandManager = new CommandManager(),
            viewPort = $("#viewPort"),
            firstController = new htmlFrameworkMocks.MockLayoutController(),
            secondController = new htmlFrameworkMocks.MockLayoutController(),
            app = { router: new frameworkMocks.MockRouter({ __parseResult: [], __formatResult: [] }) };

        domUtils.createComponents($("#qunit-fixture"));

        createLayoutController({
            device: { platform: 'test' },
            $root: $("#test-update-title"),
            initOptions: {
                commandManager: commandManager,
                app: app
            }
        }, function(options) {
            try {
                return new splitLayoutControllerModule[controllerName]({
                    name: "split",
                    panesConfig: {
                        master: {
                            controller: firstController,
                            selector: ".first-test-pane"
                        },
                        detail: {
                            controller: secondController,
                            selector: ".second-test-pane"
                        }
                    }
                });
            } catch(e) {
                done();
            }
        }).done(function(layoutController) {
            var master = {
                    viewTemplateInfo: {
                        pane: "master",
                        title: "master title"
                    },
                    layoutController: layoutController,
                    navigateOptions: {
                        stack: "master"
                    }
                },
                detail = {
                    viewTemplateInfo: {
                        pane: "detail",
                        title: "detail title"
                    },
                    layoutController: layoutController
                },
                viewInfoWithModel = {
                    viewTemplateInfo: {
                        pane: "master",
                        title: "viewTemplateInfo Title"
                    },
                    layoutController: layoutController,
                    model: {
                        title: "View 1"
                    }
                };

            layoutController.showView(master, "first-direction");
            assert.equal(viewPort.find(".dx-toolbar-center").text(), "master title", "title is changed before view showing");

            layoutController.showView(detail, "second-direction");
            assert.equal(viewPort.find(".dx-toolbar-center").text(), "master title", "title remains the same after showing a detail view");

            layoutController.showView(viewInfoWithModel, "third-direction");
            assert.equal(viewPort.find(".dx-toolbar-center").text(), "View 1", "title is from viewInfo.model");

            done();
        });
    };

    QUnit.test("Update layout title - win8", function(assert) {
        testUpdateLayoutTitle("Win8SplitLayoutController", assert);
    });

    QUnit.test("Update layout title - win", function(assert) {
        testUpdateLayoutTitle("WinSplitLayoutController", assert);
    });

    QUnit.test("Update layout title - android", function(assert) {
        testUpdateLayoutTitle("AndroidSplitLayoutController", assert);
    });

    QUnit.test("Save/Restore state (T195351)", function(assert) {
        var firstController = new htmlFrameworkMocks.MockLayoutController(),
            secondController = new htmlFrameworkMocks.MockLayoutController(),
            createLayoutOptions = {
                device: { platform: 'test' },
                ctorOptions: {
                    name: "test-split",
                    masterPaneName: "master",
                    detailPaneName: "detailPane",
                    panesConfig: {
                        master: {
                            controller: firstController,
                            selector: ".first-test-pane"
                        },
                        detailPane: {
                            controller: secondController,
                            selector: ".second-test-pane"
                        }
                    }
                }
            },
            mockRouterParseCallback = function(uri) {
                return {
                    view: uri
                };
            };

        var done = assert.async();

        createMultipaneLayoutController(createLayoutOptions).done(function(layoutController) {
            var firstPaneViewInfo = {
                    viewTemplateInfo: {
                        pane: "master"
                    },
                    uri: "test", // pane: 'master'
                    navigateOptions: {
                        stack: "master_pane"
                    }
                },
                secondPaneViewInfo = {
                    viewTemplateInfo: {
                        pane: "detailPane"
                    },
                    uri: "detail-view",
                    navigateOptions: {
                        stack: "detailPane_pane"
                    }
                };

            layoutController._router.__parseCallback = mockRouterParseCallback;

            layoutController.showView(firstPaneViewInfo);
            layoutController.showView(secondPaneViewInfo);

            var storage = new MemoryKeyValueStorage();

            layoutController.saveState(storage);

            createLayoutOptions.viewEngine = layoutController._viewEngine;
            createMultipaneLayoutController(createLayoutOptions).done(function(layoutController) {
                var navigatingLog = [];

                layoutController._router.__parseCallback = mockRouterParseCallback;

                layoutController._navigationManager.on("navigating", function(args) {
                    navigatingLog.push(args);
                });

                layoutController.restoreState(storage);
                assert.equal(navigatingLog.length, 2);
                assert.equal(navigatingLog[0].uri, "test");
                assert.equal(navigatingLog[0].options.stack, "master_pane");
                assert.equal(navigatingLog[0].options.target, "current");
                assert.equal(navigatingLog[1].uri, "detail-view");
                assert.equal(navigatingLog[1].options.stack, "detailPane_pane");
                assert.equal(navigatingLog[1].options.target, "current");

                done();
            });

        });
    });


    QUnit.module("Throw error tests");

    QUnit.test("AndroidSplitLayoutController throws error if Empty layout controller is missing", function(assert) {
        var emptyLayoutController = emptyLayoutControllerModule.EmptyLayoutController,
            controller = new AndroidSplitLayoutController();

        emptyLayoutControllerModule.EmptyLayoutController = undefined;

        assert.throws(
            function() {
                controller._createPanesConfig();
            },
            /EmptyLayoutController/,
            "raised error message contains 'EmptyLayoutController'"
        );

        emptyLayoutControllerModule.EmptyLayoutController = emptyLayoutController;
    });

    QUnit.test("IOSSplitLayoutController throws error if Empty layout controller is missing", function(assert) {
        var simpleLayoutController = SimpleLayoutControllerModule.SimpleLayoutController,
            controller = new IOSSplitLayoutController();

        SimpleLayoutControllerModule.SimpleLayoutController = undefined;

        assert.throws(
            function() {
                controller._createPanesConfig();
            },
            /SimpleLayoutController/,
            "raised error message contains 'SimpleLayoutController'"
        );

        SimpleLayoutControllerModule.SimpleLayoutController = simpleLayoutController;
    });

    QUnit.test("WinSplitLayoutController throws error if Empty layout controller is missing", function(assert) {
        var emptyLayoutController = emptyLayoutControllerModule.EmptyLayoutController,
            controller = new WinSplitLayoutController();

        emptyLayoutControllerModule.EmptyLayoutController = undefined;

        assert.throws(
            function() {
                controller._createPanesConfig();
            },
            /EmptyLayoutController/,
            "raised error message contains 'EmptyLayoutController'"
        );

        emptyLayoutControllerModule.EmptyLayoutController = emptyLayoutController;
    });
}));
