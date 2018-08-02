require("ui/drop_down_menu");

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    ko = require("knockout"),
    domUtils = require("core/utils/dom"),
    dxCommand = require("framework/command"),
    dxCommandContainer = require("framework/html/command_container"),
    CommandMapping = require("framework/command_mapping"),
    CommandManager = require("framework/html/command_manager"),
    TransitionExecutorModule = require("animation/transition_executor/transition_executor"),
    animationPresets = require("animation/presets/presets").presets,
    WidgetItemWrapperBase = require("framework/html/widget_command_adapters").WidgetItemWrapperBase,
    WidgetAdapterBase = require("framework/html/widget_command_adapters").WidgetAdapterBase,
    savedTransitionExecutor;

require("ui/slide_out");
require("ui/nav_bar");
require("ui/toolbar");
require("ui/pivot");

QUnit.testStart(function() {
    var markup = require("./frameworkParts/html_widgetCommandAdapters.markup.html!text");

    $("#qunit-fixture").append(markup);
});

function createComponents($markup, model) {
    model = model || {};
    domUtils.createComponents($markup);
    ko.applyBindings(model, $markup.get(0));

}

var moduleConfig = {
    beforeEach: function() {
        animationPresets.clear();
        savedTransitionExecutor = TransitionExecutorModule.TransitionExecutor;
    },
    afterEach: function() {
        animationPresets.resetToDefaults();
        TransitionExecutorModule.TransitionExecutor = savedTransitionExecutor;
    }
};

QUnit.module("Base adapter", moduleConfig);

QUnit.test("B232880: Global optionChanged is unsubscribed on widget disposing", function(assert) {
    createComponents($("#toolbar-commands-test"), { onExecute: noop });

    var $test = $("#toolbar-commands-test"),
        command = $test.find(".command").eq(0).dxCommand("instance"),
        $toolbar = $test.find(".toolbar"),
        commandChangedLog = [];

    var TestItemWrapper = WidgetItemWrapperBase.inherit({});

    var TestWidgetAdapter = WidgetAdapterBase.inherit({
        _getWidgetByElement: function($element) {
            return $element.dxToolbar("instance");
        },
        _createItemWrapper: function(command, containerOptions) {
            return new TestItemWrapper(command, containerOptions);
        },
        _onCommandChanged: function() {
            commandChangedLog.push(arguments);
        }
    });

    var adapter = new TestWidgetAdapter($toolbar);
    assert.equal(commandChangedLog.length, 0);

    adapter.addCommand(command, {});
    assert.equal(commandChangedLog.length, 0);

    command.option("title", "new");
    assert.equal(commandChangedLog.length, 1);

    $toolbar.remove();
    command.option("title", "new2");
    assert.equal(commandChangedLog.length, 1);
});

QUnit.test("T379406: command deprecated option changes should be ignored", function(assert) {
    var spy = sinon.spy();

    var TestCommand = dxCommand.inherit({
        _getDefaultOptions: function() {
            return $.extend(this.callBase(), {
                newOption: "defaultValue",
            });
        },

        _setDeprecatedOptions: function() {
            this.callBase();

            $.extend(this._deprecatedOptions, {
                deprecatedOption: { since: "version", alias: "newOption" }
            });
        }
    });

    var TestWidgetAdapter = WidgetAdapterBase.inherit({
        _getWidgetByElement: function($element) {
            return $element.dxToolbar("instance");
        },
        _createItemWrapper: function(command, containerOptions) {
            return new WidgetItemWrapperBase(command, containerOptions);
        },
        _setWidgetItemOption: spy
    });

    var $toolbar = $("<div>").appendTo("#qunit-fixture").dxToolbar(),
        widgetAdapter = new TestWidgetAdapter($toolbar),
        command = new TestCommand({ id: 'cmd1', title: 'cmd1', visible: true });

    widgetAdapter.addCommand(command);
    command.option("deprecatedOption", "someValue");

    assert.ok(spy.calledOnce, "the _setWidgetItemOption method is not called for deprecated options");
    assert.equal(spy.args[0][0], "newOption", "the _setWidgetItemOption method is called with correct arguments");
});

QUnit.test("Location option from command container", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.mapCommands("toolbar", [
        { id: 'cmdLeft', location: 'before' },
        { id: 'cmdCenter' },
        { id: 'cmdRight', location: 'after' },
        { id: 'cmdMenu', locateInMenu: 'always' }
    ]);

    createComponents($("#toolbar-option-location"));

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#toolbar-option-location"),
        $toolbar = $test.find(".toolbar"),
        toolbar = $toolbar.dxToolbar("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(4, toolbar.option("items").length);

    var commandLeft = toolbar.option("items")[0];
    assert.equal("before", commandLeft.location);

    var commandCenter = toolbar.option("items")[1];
    assert.equal(undefined, commandCenter.location);

    var commandRight = toolbar.option("items")[2];
    assert.equal("after", commandRight.location);

    var commandMenu = toolbar.option("items")[3];
    assert.equal("always", commandMenu.locateInMenu);
});

QUnit.test("Menu Location option from command container", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.mapCommands("toolbar", [
        { id: 'cmdMenu', locateInMenu: 'always' },
        { id: 'cmdAutoMenu', locateInMenu: 'auto' },
        { id: 'cmdDeprecatedMenu', location: 'menu' }
    ]);

    createComponents($("#toolbar-option-location-menu"));

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#toolbar-option-location-menu"),
        $toolbar = $test.find(".toolbar"),
        toolbar = $toolbar.dxToolbar("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(3, toolbar.option("items").length);

    var commandMenu = toolbar.option("items")[0];
    assert.equal("always", commandMenu.locateInMenu);

    var commandAutoMenu = toolbar.option("items")[1];
    assert.equal("auto", commandAutoMenu.locateInMenu);

    var commandDeprecatedMenu = toolbar.option("items")[2];
    assert.equal("menu", commandDeprecatedMenu.location);
    assert.equal(true, commandDeprecatedMenu.isAction, "Property isAction has been created");
});


QUnit.test("showText option from command container", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.mapCommands("toolbar", [
        { id: 'cmdAutoMenu', locateInMenu: 'auto', showText: 'inMenu' },
        { id: 'cmdAutoMenuWithoutText', locateInMenu: 'auto', showText: 'inMenu' }
    ]);

    createComponents($("#toolbar-option-show-text"));

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#toolbar-option-show-text"),
        $toolbar = $test.find(".toolbar"),
        toolbar = $toolbar.dxToolbar("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);

    var commandAutoMenu = toolbar.option("items")[0];
    assert.equal(commandAutoMenu.showText, "inMenu");

    var commandAutoMenuWithoutText = toolbar.option("items")[1];
    assert.equal(commandAutoMenuWithoutText.showText, undefined);
});

QUnit.test("T430159 - Not hide the command menu after click a command item", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.mapCommands("toolbar", [
        { id: 'cmdMenu', locateInMenu: 'always' },
        { id: 'cmdAutoMenu', locateInMenu: 'auto' },
        { id: 'cmdDeprecatedMenu', location: 'menu' }
    ]);

    createComponents($("#toolbar-option-location-menu"));

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#toolbar-option-location-menu"),
        $toolbar = $test.find(".toolbar"),
        toolbar = $toolbar.dxToolbar("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);
    var item = toolbar.option("items")[0];
    assert.equal(true, item.isAction, "Property isAction has been created");

    item = toolbar.option("items")[1];
    assert.equal(undefined, item.isAction, "Property isAction is undefined");

    item = toolbar.option("items")[2];
    assert.equal(true, item.isAction, "Property isAction has been created");
});

QUnit.test("Resolve text & icon properties", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.mapCommands("toolbar", [
        { id: 'noicon', showText: false, location: 'before' },
        { id: 'notext', showIcon: false, location: 'after' }
    ]);

    createComponents($("#toolbar-resolve-text-icon"));

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#toolbar-resolve-text-icon"),
        $toolbar = $test.find(".toolbar"),
        toolbar = $toolbar.dxToolbar("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(2, toolbar.option("items").length);

    var item1 = toolbar.option("items")[0];
    assert.equal("No Icon", item1.options.text);
    assert.ok(!item1.options.icon);

    var item2 = toolbar.option("items")[1];
    assert.ok(!item2.options.text);
    assert.equal("no-text", item2.options.icon);
});

QUnit.test("Clear widget items", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.mapCommands("pivot", [
        { id: 'c1' },
        { id: 'c2' }
    ]);

    createComponents($("#clear-widget-items"));

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#clear-widget-items"),
        $pivot = $test.find(".pivot"),
        pivot = $pivot.dxPivot("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);

    assert.equal(2, pivot.option("items").length);

    manager.clearContainer(containers[0]);
    assert.equal(0, pivot.option("items").length);
});

QUnit.test("BeginEnd update container widget", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.mapCommands("toolbar", ["back", "add", "delete"]);

    createComponents($("#toolbar-commands-test"), { onExecute: noop });

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#toolbar-commands-test"),
        $toolbar = $test.find(".toolbar"),
        toolbar = $toolbar.dxToolbar("instance"),
        count = 0,
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    toolbar.on("contentReady", function() {
        count++;
    });

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(1, count);
});

QUnit.test("Commands adding animation", function(assert) {
    var commandMapping = new CommandMapping(),
        manager = new CommandManager({ commandMapping: commandMapping }),
        commands = [
            new dxCommand({ id: 'cmd1', title: 'cmd1', visible: true }),
            new dxCommand({ id: 'cmd2', title: 'cmd2', visible: true }),
            new dxCommand({ id: 'cmd3', title: 'cmd3', visible: false }),
            new dxCommand({ id: 'cmd4', title: 'cmd4', visible: true })
        ],
        containers = [
            new dxCommandContainer($("<div/>").appendTo("#qunit-fixture").dxToolbar(), { id: 'toolbar' })
        ],
        enterLog = [],
        startLog = [];

    TransitionExecutorModule.TransitionExecutor = TransitionExecutorModule.TransitionExecutor.inherit({
        enter: function($el, config) {
            enterLog.push({
                $element: $el,
                config: config
            });
        },
        start: function(config) {
            startLog.push(config);
        }
    });

    commandMapping.mapCommands("toolbar", [
        { id: 'cmd1', location: 'before' },
        { id: 'cmd2', location: 'after' },
        { id: 'cmd3', location: 'after' },
        { id: 'cmd4', locateInMenu: 'always' },
        { id: 'cmd5', location: 'after' }
    ]);

    assert.equal(enterLog.length, 0);
    assert.equal(startLog.length, 0);

    manager.renderCommandsToContainers(commands, containers);

    assert.equal(enterLog.length, 2, "invisible and menu items shouldn't be animated");
    assert.equal(enterLog[0].$element.text(), "cmd1");
    assert.equal(enterLog[0].config, "command-rendered-top");
    assert.equal(enterLog[1].$element.text(), "cmd2");
    assert.equal(enterLog[1].config, "command-rendered-top");
    assert.equal(startLog.length, 1);
    assert.equal(startLog[0], undefined);

    enterLog.length = 0;
    startLog.length = 0;

    manager.renderCommandsToContainers([new dxCommand({ id: 'cmd5', title: 'cmd5', visible: true })], containers);

    assert.equal(enterLog.length, 1, "only newly added command are animated");
    assert.equal(enterLog[0].$element.text(), "cmd5");
    assert.equal(enterLog[0].config, "command-rendered-top");
    assert.equal(startLog.length, 1);
});

QUnit.test("Commands adding animation on invisible container (T317429)", function(assert) {
    var commandMapping = new CommandMapping(),
        manager = new CommandManager({ commandMapping: commandMapping }),
        commands = [
            new dxCommand({ id: 'cmd1', title: 'cmd1', visible: true }),
            new dxCommand({ id: 'cmd2', title: 'cmd2', visible: true })
        ],
        containers = [
            new dxCommandContainer($("<div/>").appendTo("#qunit-fixture").dxToolbar({ visible: false }), { id: 'toolbar' })
        ],
        enterLog = [];

    TransitionExecutorModule.TransitionExecutor = TransitionExecutorModule.TransitionExecutor.inherit({
        enter: function($el, config) {
            enterLog.push({
                $element: $el,
                config: config
            });
        },
        start: noop
    });

    commandMapping.mapCommands("toolbar", [
        { id: 'cmd1', location: 'center' },
        { id: 'cmd2', location: 'center' }
    ]);

    assert.equal(enterLog.length, 0);

    manager.renderCommandsToContainers(commands, containers);

    assert.equal(enterLog.length, 2, "T317429");
});

QUnit.test("Commands adding animation is not applied to dxNavBar container by default (T315645)", function(assert) {
    var commandMapping = new CommandMapping(),
        manager = new CommandManager({ commandMapping: commandMapping }),
        commands = [
            new dxCommand({ id: 'cmd1', title: 'cmd1', visible: true })
        ],
        containers = [
            new dxCommandContainer($("<div/>").appendTo("#qunit-fixture").dxNavBar(), { id: 'navbar' })
        ],
        enterLog = [];

    TransitionExecutorModule.TransitionExecutor = TransitionExecutorModule.TransitionExecutor.inherit({
        enter: function($el, config) {
            enterLog.push({
                $element: $el,
                config: config
            });
        },
        start: function(config) {
        }
    });

    commandMapping.mapCommands("navbar", [
        { id: 'cmd1' }
    ]);

    assert.equal(enterLog.length, 0);

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(enterLog.length, 0, "navbar items shouldn't be animated (T315645)");
});

QUnit.test("Commands adding animation is not applied to dxPivot container by default (T314445)", function(assert) {
    var commandMapping = new CommandMapping(),
        manager = new CommandManager({ commandMapping: commandMapping }),
        commands = [
            new dxCommand({ id: 'cmd1', title: 'cmd1', visible: true })
        ],
        containers = [
            new dxCommandContainer($("<div/>").appendTo("#qunit-fixture").dxPivot(), { id: 'pivot' })
        ],
        enterLog = [];

    TransitionExecutorModule.TransitionExecutor = TransitionExecutorModule.TransitionExecutor.inherit({
        enter: function($el, config) {
            enterLog.push({
                $element: $el,
                config: config
            });
        },
        start: function(config) {
        }
    });

    commandMapping.mapCommands("pivot", [
        { id: 'cmd1' }
    ]);

    assert.equal(enterLog.length, 0);

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(enterLog.length, 0, "pivot items shouldn't be animated (T314445)");
});

QUnit.test("dxToolbar command container items shouldn't be animated on rerendering (T559301)", function(assert) {
    var commandMapping = new CommandMapping(),
        manager = new CommandManager({ commandMapping: commandMapping }),
        commands = [
            new dxCommand({ id: 'cmd1', title: 'cmd1', visible: true }),
            new dxCommand({ id: 'cmd2', title: 'cmd2', visible: false })
        ],
        containers = [
            new dxCommandContainer($("<div/>").appendTo("#qunit-fixture").dxToolbar(), { id: 'toolbar' })
        ],
        enterLog = [];

    TransitionExecutorModule.TransitionExecutor = TransitionExecutorModule.TransitionExecutor.inherit({
        enter: function($el, config) {
            enterLog.push({
                $element: $el,
                config: config
            });
        },
        start: noop
    });

    commandMapping.mapCommands("toolbar", [
        { id: 'cmd1', location: 'before' },
        { id: 'cmd2', location: 'after' }
    ]);

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(enterLog.length, 1);

    commands[1].option('visible', true);
    commands[1].option('title', 'New Title');

    assert.equal(enterLog.length, 1, 'T559301');
});

QUnit.test("Commands adding animation (invisible container)", function(assert) {
    var commandMapping = new CommandMapping(),
        manager = new CommandManager({ commandMapping: commandMapping }),
        $toolbar = $("<div/>").appendTo("#qunit-fixture").dxToolbar().hide(),
        commands = [
            new dxCommand({ id: 'cmd1', title: 'cmd1', visible: true })
        ],
        containers = [
            new dxCommandContainer($toolbar, { id: 'toolbar' })
        ],
        enterLog = [],
        startLog = [];

    TransitionExecutorModule.TransitionExecutor = TransitionExecutorModule.TransitionExecutor.inherit({
        enter: function($el, config) {
            enterLog.push({
                $element: $el,
                config: config
            });
        },
        start: function(config) {
            startLog.push(config);
        }
    });

    commandMapping.mapCommands("toolbar", [
        { id: 'cmd1', location: 'before' },
        { id: 'cmd2', location: 'before' }
    ]);

    assert.equal(enterLog.length, 0);
    assert.equal(startLog.length, 0);
    manager.renderCommandsToContainers(commands, containers);

    assert.equal(enterLog.length, 0, "items shouldn't be animated if they are rendered into hidden container");
    assert.equal(startLog.length, 1);
    assert.equal(startLog[0], undefined);

    enterLog.length = 0;
    startLog.length = 0;
    $toolbar.show();
    manager.renderCommandsToContainers([new dxCommand({ id: 'cmd2', title: 'cmd2', visible: true })], containers);

    assert.equal(enterLog.length, 1, "only newly added command are animated since toolbar is visible now");
    assert.equal(enterLog[0].$element.text(), "cmd2");
    assert.equal(enterLog[0].config, "command-rendered-top");
    assert.equal(startLog.length, 1);
});

QUnit.module("dxToolbar adapter", moduleConfig);

QUnit.test("Toolbar commands", function(assert) {
    var commandMapping = new CommandMapping(),
        actionLog = [],
        model = {
            onExecute: function(e) {
                actionLog.push(e);
            }
        };

    commandMapping.mapCommands("toolbar", [
        { id: 'back', showIcon: false, location: 'before' },
        { id: 'add', showText: false, location: 'after' },
        { id: 'delete', showIcon: false, locateInMenu: 'always' }
    ]);

    createComponents($("#toolbar-commands-test"), model);

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#toolbar-commands-test"),
        $toolbar = $test.find(".toolbar"),
        toolbar = $toolbar.dxToolbar("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(3, toolbar.option("items").length);

    var item1 = toolbar.option("items")[0];
    assert.equal("before", item1.location);
    assert.equal("dxButton", item1.widget);
    assert.equal("Back", item1.options.text);
    assert.equal(true, item1.options.disabled);
    assert.equal(false, item1.visible);
    assert.ok(!item1.options.icon);

    var item2 = toolbar.option("items")[1];
    assert.equal("after", item2.location);
    assert.equal("dxButton", item2.widget);
    assert.equal(false, item2.options.disabled);
    assert.equal(true, item2.visible);
    assert.ok(!item2.options.text);
    assert.equal("add-icon", item2.options.icon);

    var item3 = toolbar.option("items")[2];
    assert.equal("always", item3.locateInMenu);
    assert.equal(undefined, item3.widget);
    assert.equal(false, item3.disabled);
    assert.equal(true, item3.visible);
    assert.equal("Delete", item3.text);
    assert.ok(!item3.icon);

    var $button = $toolbar
        .find(".dx-toolbar-item")
        .last()
        .find(".dx-button");

    $button.trigger("dxclick");
    assert.equal(actionLog.length, 1);
    assert.equal($(actionLog[0].element).dxCommand("instance").option("id"), "add");
    assert.ok(actionLog[0].event, "T132769");
});

QUnit.test("Apply default options from command container for toolbar", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.setDefaults("toolbar", { icon: 'icon', title: 'title', type: 'type' });
    commandMapping.mapCommands("toolbar", [
        { id: 'cmd' }
    ]);

    createComponents($("#toolbar-default-options"));

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#toolbar-default-options"),
        $toolbar = $test.find(".toolbar"),
        toolbar = $toolbar.dxToolbar("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(1, toolbar.option("items").length, "Command has been added");

    var item = toolbar.option("items")[0];

    assert.equal("icon", item.options.icon, "Property icon has been forwarding");
    assert.equal("title", item.options.text, "Property title has been forwarding");
    assert.equal("type", item.options.type, "Property type has been forwarding");
});

QUnit.test("Apply command options over default options for toolbar", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.setDefaults("toolbar", { icon: 'icon', title: 'title', type: 'type' });
    commandMapping.mapCommands("toolbar", [
        { id: 'cmd' }
    ]);

    createComponents($("#toolbar-replace-default-options"));

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#toolbar-replace-default-options"),
        $toolbar = $test.find(".toolbar"),
        toolbar = $toolbar.dxToolbar("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(1, toolbar.option("items").length, "Command has been added");

    var item = toolbar.option("items")[0];

    assert.equal("icon-first", item.options.icon, "Property icon has been replaced");
    assert.equal("title1", item.options.text, "Property title has been replaced");
    assert.equal("type1", item.options.type, "Property type has been replaced");
    assert.equal("test value", item.options.anyOther, "Any property should be propagated to the widget (T163493)");
});

QUnit.test("Toolbar listens command options", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.mapCommands("toolbar", [
        { id: 'back', location: 'before' }
    ]);

    var model = {
        backTitle: ko.observable("Back")
    };

    createComponents($("#toolbar-commands-change-option"), model);

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#toolbar-commands-change-option"),
        $toolbar = $test.find(".toolbar"),
        toolbar = $toolbar.dxToolbar("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(1, toolbar.option("items").length);

    var item = toolbar.option("items")[0];
    assert.equal("Back", item.options.text);

    model.backTitle("New Title");

    item = toolbar.option("items")[0];
    assert.equal("New Title", item.options.text);
});

QUnit.test("Toolbar item should become visible after dxCommand visible option changed", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.mapCommands("toolbar", [
        { id: 'test', location: 'before' }
    ]);

    var model = {
        testVisible: ko.observable(false)
    };

    createComponents($("#toolbar-commands-change-visible-option"), model);

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#toolbar-commands-change-visible-option"),
        $toolbar = $test.find(".toolbar"),
        toolbar = $toolbar.dxToolbar("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);

    var item = toolbar.option("items")[0];
    assert.strictEqual(item.visible, false);
    assert.strictEqual(item.options.visible, true);

    model.testVisible(true);

    assert.strictEqual(item.visible, true);
    assert.strictEqual(item.options.visible, true);
});


QUnit.module("dxList adapter", moduleConfig);

QUnit.test("List commands", function(assert) {
    var commandMapping = new CommandMapping(),
        actionLog = [],
        model = {
            onExecute: function(e) {
                actionLog.push(e);
            }
        };

    commandMapping.mapCommands("list", [
        { id: 'back', showIcon: false },
        { id: 'add', showText: false }
    ]);

    createComponents($("#list-commands-test"), model);

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#list-commands-test"),
        $list = $test.find(".list"),
        list = $list.dxList("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(2, list.option("items").length);

    var item1 = list.option("items")[0];
    assert.equal("Back", item1.title);
    assert.ok(!item1.icon);

    var item2 = list.option("items")[1];
    assert.ok(!item2.title);
    assert.equal("add-icon", item2.icon);

    var $item = $list.find(".dx-item-content").last();

    assert.equal(actionLog.length, 0);

    $item.trigger("dxclick");
    assert.equal(actionLog.length, 1);
    var command = $(actionLog[0].element).dxCommand("instance");
    assert.equal(command.option("id"), "add");
    assert.ok(actionLog[0].event, "T132769");

    command.option("disabled", true);
    $list = $test.find(".list");
    $item = $list.find(".dx-item-content").last();

    $item.trigger("dxclick");
    assert.equal(actionLog.length, 1);
});
QUnit.test("List commands with default template", function(assert) {
    var commandMapping = new CommandMapping(),
        actionLog = [],
        model = {
            onExecute: function(e) {
                actionLog.push(e);
            }
        };

    commandMapping.mapCommands("list", [
        { id: 'back', showIcon: false },
        { id: 'add', showText: false }
    ]);

    createComponents($("#list-commands-test-default-template"), model);

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#list-commands-test-default-template"),
        $list = $test.find(".list"),
        list = $list.dxList("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(2, list.option("items").length);

    var item1 = list.option("items")[0];
    assert.equal("Back", item1.title);
    assert.ok(!item1.icon);

    var item2 = list.option("items")[1];
    assert.ok(!item2.title);
    assert.equal("add-icon", item2.icon);

    var $item = $list.find(".dx-item-content").last();

    assert.equal(actionLog.length, 0);

    $item.trigger("dxclick");
    assert.equal(actionLog.length, 1);
    var command = $(actionLog[0].element).dxCommand("instance");
    assert.equal(command.option("id"), "add");
    assert.ok(actionLog[0].event, "T132769");

    command.option("disabled", true);
    $list = $test.find(".list");
    $item = $list.find(".dx-item-content").last();

    $item.trigger("dxclick");
    assert.equal(actionLog.length, 1);
});

QUnit.test("Apply default options from command container for list", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.setDefaults("list", { icon: 'icon', title: 'title' });
    commandMapping.mapCommands("list", [
        { id: 'cmd' }
    ]);

    createComponents($("#list-default-options"));

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#list-default-options"),
        $list = $test.find(".list"),
        list = $list.dxList("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(1, list.option("items").length, "Command has been added");

    var item = list.option("items")[0];

    assert.equal("icon", item.icon, "Property icon has been forwarding");
    assert.equal("title", item.title, "Property title has been forwarding");
});

QUnit.test("Apply command options over default options for list", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.setDefaults("list", { icon: 'icon', title: 'title' });
    commandMapping.mapCommands("list", [
        { id: 'cmd' }
    ]);

    createComponents($("#list-replace-default-options"));

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#list-replace-default-options"),
        $list = $test.find(".list"),
        list = $list.dxList("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(1, list.option("items").length, "Command has been added");

    var item = list.option("items")[0];

    assert.equal("icon-first", item.icon, "Property icon has been replaced");
    assert.equal("title1", item.title, "Property title has been replaced");
});

QUnit.test("List listens command options", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.mapCommands("list", [
        { id: 'back' }
    ]);

    var model = {
        backTitle: ko.observable("Back")
    };

    createComponents($("#list-commands-change-option"), model);

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#list-commands-change-option"),
        $list = $test.find(".list"),
        list = $list.dxList("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(1, list.option("items").length);

    var item = list.option("items")[0];
    assert.equal("Back", item.title);

    model.backTitle("New Title");

    item = list.option("items")[0];
    assert.equal("New Title", item.title);
});

QUnit.module("dxNavBar adapter", moduleConfig);

QUnit.test("NavBar commands", function(assert) {
    var commandMapping = new CommandMapping(),
        actionLog = [],
        model = {
            onExecute: function(e) {
                actionLog.push(e);
            }
        };
    commandMapping.mapCommands("navBar", [
        { id: 'back', showIcon: false },
        { id: 'add', showText: false }
    ]);

    createComponents($("#navBar-commands-test"), model);

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#navBar-commands-test"),
        $navBar = $test.find(".navBar"),
        navBar = $navBar.dxNavBar("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(2, navBar.option("items").length);

    var item1 = navBar.option("items")[0];
    assert.equal("Back", item1.text);
    assert.ok(!item1.icon);

    var item2 = navBar.option("items")[1];
    assert.ok(!item2.text);
    assert.equal("add-icon", item2.icon);

    assert.equal(1, navBar.option("selectedIndex"));
    var $item = $navBar
        .find(".dx-nav-item")
        .last();

    $item.trigger("dxclick");
    assert.equal(actionLog.length, 1);
    assert.equal($(actionLog[0].element).dxCommand("instance").option("id"), "add");
    assert.ok(actionLog[0].event, "T132769");
});

QUnit.test("Apply default options from command container for navbar", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.setDefaults("navBar", { icon: 'icon', title: 'title' });
    commandMapping.mapCommands("navBar", [
        { id: 'cmd' }
    ]);

    createComponents($("#navbar-default-options"));

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#navbar-default-options"),
        $navbar = $test.find(".navbar"),
        navbar = $navbar.dxNavBar("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(1, navbar.option("items").length, "Command has been added");

    var item = navbar.option("items")[0];

    assert.equal("icon", item.icon, "Property icon has been forwarding");
    assert.equal("title", item.text, "Property title has been forwarding");
});

QUnit.test("Apply command options over default options for navbar", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.setDefaults("navBar", { icon: 'icon', title: 'title' });
    commandMapping.mapCommands("navBar", [
        { id: 'cmd' }
    ]);

    createComponents($("#navbar-replace-default-options"));

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#navbar-replace-default-options"),
        $navbar = $test.find(".navbar"),
        navbar = $navbar.dxNavBar("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);

    assert.equal(1, navbar.option("items").length, "Command has been added");

    var item = navbar.option("items")[0];

    assert.equal("icon-first", item.icon, "Property icon has been replaced");
    assert.equal("title1", item.text, "Property title has been replaced");
});

QUnit.test("NavBar listens command options", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.mapCommands("navBar", [
        { id: 'back' }
    ]);

    var model = {
        backTitle: ko.observable("Back")
    };

    createComponents($("#navBar-commands-change-option"), model);

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#navBar-commands-change-option"),
        $navBar = $test.find(".navBar"),
        navBar = $navBar.dxNavBar("instance"),
        command = $test.find(".command").dxCommand("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test),
        reRenderCount = 0;

    command.option("highlighted", true);

    manager.renderCommandsToContainers(commands, containers);

    navBar.on("contentReady", function(args) {
        reRenderCount++;
    });

    assert.equal(1, navBar.option("items").length);

    var item = navBar.option("items")[0];
    assert.equal(item.text, "Back");
    assert.equal(item.visible, true);
    assert.equal(item.highlighted, true);

    command.option("visible", false);
    model.backTitle("New Title");
    command.option("highlighted", false);

    item = navBar.option("items")[0];
    assert.equal(item.text, "New Title");
    assert.equal(item.visible, false);
    assert.equal(reRenderCount, 0);
});

QUnit.test("Switching 'highlighted' option toggles selectedIndex in Navbar", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.mapCommands("navBar", [
        { id: 'back', showIcon: false },
        { id: 'add', showText: false }
    ]);

    var model = {
        onExecute: noop
    };

    createComponents($("#navBar-commands-test"), model);

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#navBar-commands-test"),
        $navBar = $test.find(".navBar"),
        navBar = $navBar.dxNavBar("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);

    navBar.option("selectedIndex", 0);

    var $item = $navBar
            .find(".dx-nav-item")
            .first(),
        command = $test
            .find(".dx-command")
            .last()
            .dxCommand("instance");

    $item.trigger("dxclick");

    command.option("highlighted", true);

    assert.equal(navBar.option("selectedIndex"), 1, "navBar invokes selectedIndex change even if associated command was already highlighted");
});

QUnit.module("dxPivot adapter", moduleConfig);

QUnit.test("dxPivot is rerendered on command visibility change", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.mapCommands("pivot", [
        { id: 'c1' },
        { id: 'c2' }
    ]);

    createComponents($("#pivot-commands-visibility"));

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#pivot-commands-visibility"),
        $pivot = $test.find(".pivot"),
        pivot = $pivot.dxPivot("instance"),
        command2 = $test.find(".command.c2").dxCommand("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    command2.option("visible", false);

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(pivot.option("items").length, 1);

    var item = pivot.option("items")[0];
    assert.equal("c1", item.title);

    command2.option("visible", true);
    assert.equal(pivot.option("items").length, 2);
});

QUnit.test("Pivot selected item changes immediately (T117665, T112606)", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.mapCommands("pivot", [
        { id: 'c1' },
        { id: 'c2' }
    ]);

    createComponents($("#pivot-selected-item-change"));

    var manager = new CommandManager({ commandMapping: commandMapping }),
        $test = $("#pivot-selected-item-change"),
        $pivot = $test.find(".pivot"),
        pivot = $pivot.dxPivot("instance"),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    commands[0].option("highlighted", true);

    manager.renderCommandsToContainers(commands, containers);
    assert.equal(pivot.option("items").length, 2);

    var selectedIndex = pivot.option("selectedIndex"),
        selectedElement = $pivot.find(".dx-pivot-item:not(.dx-pivot-item-hidden)").addClass("selectedElementTest");

    assert.equal(selectedIndex, 0);
    assert.equal(selectedElement.length, 1);
    assert.equal(pivot.option("items")[selectedIndex].title, "c1");

    commands[0].option("highlighted", false);
    commands[1].option("highlighted", true);

    selectedIndex = pivot.option("selectedIndex");
    var newSelectedElement = $pivot.find(".dx-pivot-item:not(.dx-pivot-item-hidden)");

    assert.equal(selectedIndex, 1);
    assert.equal(newSelectedElement.length, 1);
    assert.ok(newSelectedElement[0] !== selectedElement[0]);
    assert.equal(pivot.option("items")[selectedIndex].title, "c2");

});

QUnit.module("dxSlideOut adapter", moduleConfig);

QUnit.test("dxSlideOut does not loose content on item adding", function(assert) {
    var commandMapping = new CommandMapping();

    commandMapping.mapCommands("slideOut", [
        { id: 'c1' },
        { id: 'c2' }
    ]);

    var $test = $("#slideOut-commands"),
        $slideOut = $test.find(".slideOut"),
        model = {
            renderContent: function(e) {
                $slideOut.find(".dx-slideout-item").text("test content");
            }
        };

    createComponents($("#slideOut-commands"), model);

    var manager = new CommandManager({ commandMapping: commandMapping }),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    manager.renderCommandsToContainers(commands, containers);

    var $item = $slideOut
        .find(".dx-slideout-menu .dx-list-item")
        .first();

    $item.trigger("dxclick");

    assert.equal($slideOut.find(".dx-slideout-item").text(), "test content");

    manager.renderCommandsToContainers(commands, containers);

    assert.equal($slideOut.find(".dx-slideoutview-content").text(), "test content");
});

QUnit.test("T277325: Command highlighting and visibility change", function(assert) {
    assert.expect(0);

    var commandMapping = new CommandMapping();

    commandMapping.mapCommands("slideOut", [
        { id: 'c1' },
        { id: 'c2' }
    ]);

    var $test = $("#slideOut-commands"),
        $slideOut = $test.find(".slideOut"),
        model = {
            renderContent: function(e) {
                $slideOut.find(".dx-slideout-item").text("test content");
            }
        };

    createComponents($test, model);

    var manager = new CommandManager({ commandMapping: commandMapping }),
        commands = manager.findCommands($test),
        containers = manager.findCommandContainers($test);

    commands[0].option("visible", false);
    commands[1].option("visible", false);

    manager.renderCommandsToContainers(commands, containers);

    commands[0].option("visible", true);
    commands[0].option("highlighted", true);// T277325 exception was here. Fixed in T272871
});
