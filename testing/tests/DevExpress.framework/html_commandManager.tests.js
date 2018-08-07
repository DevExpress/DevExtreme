var $ = require("jquery"),
    ko = require("knockout"),
    domUtils = require("core/utils/dom"),
    Action = require("core/action"),
    createActionExecutors = require("framework/action_executors").createActionExecutors,
    fx = require("animation/fx"),
    executeAsyncMock = require("../../helpers/executeAsyncMock.js"),
    dxCommand = require("framework/command"),
    CommandMapping = require("framework/command_mapping"),
    CommandManager = require("framework/html/command_manager"),
    Router = require("framework/router"),
    htmlFrameworkMocks = require("../../helpers/htmlFrameworkMocks.js");

require("ui/toolbar");

QUnit.testStart(function() {
    var markup = require("./frameworkParts/html_commandManager.markup.html!text");

    $("#qunit-fixture").html(markup);
});

QUnit.module("CommandManager", {
    beforeEach: function() {
        executeAsyncMock.setup();
        Action.registerExecutor(createActionExecutors(this));
        domUtils.createComponents($("#qunit-fixture"));
        fx.off = true;
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        fx.off = false;
    }
});

QUnit.test("Execute command with non object arg", function(assert) {
    var result;
    var model = {
        test: function(e) {
            result = "executed_" + e.actionValue;
        }
    };
    ko.applyBindings(model, $("#execute-test").get(0));

    var manager = new CommandManager();
    var commands = manager.findCommands($("#execute-test"), model);
    assert.equal(commands.length, 1);
    commands[0].execute("args");
    assert.equal(result, "executed_args");
});

QUnit.test("Execute command with object args", function(assert) {
    var result;
    var model = {
        test: function(e) {
            result = "executed_" + e.text;
        }
    };
    ko.applyBindings(model, $("#execute-test").get(0));

    var manager = new CommandManager();
    var commands = manager.findCommands($("#execute-test"), model);
    assert.equal(commands.length, 1);
    commands[0].execute({ text: "args" });
    assert.equal(result, "executed_args");
});

QUnit.test("Navigation command", function(assert) {
    executeAsyncMock.setup();
    try {
        // Registering uri binding that needs this.app.navigationManager
        var router = new Router();
        router.register(":view/:id", { view: "index", id: undefined });
        var app = new htmlFrameworkMocks.MockHtmlApplication({ router: router });
        var manager = new CommandManager({});
        ko.applyBindings({}, $("#navigate-test").get(0));
        var commands = manager.findCommands($("#navigate-test"), {});
        assert.equal(commands.length, 1);
        commands[0].execute();
        assert.equal(app.navigationManager._navigationDevice.getUri(), "test-uri");
    } finally {
        executeAsyncMock.teardown();
    }
});

QUnit.test("Navigation command with template", function(assert) {
    // Registering uri binding that needs this.app.navigationManager
    var router = new Router();
    router.register(":view/:id", { view: "index", id: undefined });
    var app = new htmlFrameworkMocks.MockHtmlApplication({ router: router });
    var manager = new CommandManager({});
    ko.applyBindings({
        id: "123"
    }, $("#navigate-with-template-test").get(0));
    var commands = manager.findCommands($("#navigate-with-template-test"), {});
    assert.equal(commands.length, 1);
    commands[0].execute();
    assert.equal(app.navigationManager._navigationDevice.getUri(), "test-uri/123");
});


QUnit.test("Layout commands (with observable) - B231696 - dxCommand does not change its state if observable changes", function(assert) {
    var done = assert.async(),
        commandMapping = new CommandMapping();

    commandMapping.mapCommands("add", [{ id: "add" }]);

    var manager = new CommandManager({ commandMapping: commandMapping });
    var model = {
        title: ko.observable("initial")
    };
    ko.applyBindings(model, $("#complex-test-with-observable").get(0));

    var $renderResult = $("#complex-test-with-observable .render-result"),
        commands = manager.findCommands($renderResult),
        containers = manager.findCommandContainers($renderResult);

    manager.renderCommandsToContainers(commands, containers).always(function() {
        var toolbar = $renderResult.find(".toolbar").dxToolbar("instance");
        var items = toolbar.option("items");
        assert.equal(items.length, 1);
        assert.equal(items[0].options.text, "initial");

        model.title("changed");
        assert.equal(items[0].options.text, "changed");

        done();
    });

});

QUnit.test("Model commands", function(assert) {
    var modelCommands = [
            new dxCommand({ id: 'test' })
        ],
        manager = new CommandManager(),
        commands,
        containers;

    manager.renderCommandsToContainers = function(_commands, _containers) {
        commands = _commands;
        containers = _containers;
    };

    ko.applyBindings({}, $("#model-commands-test").get(0));
    containers = manager.findCommandContainers($("#model-commands-test"));

    manager.renderCommandsToContainers(modelCommands, containers);

    assert.equal(commands.length, 1);
    assert.equal(commands[0], modelCommands[0]);
    assert.equal(containers.length, 1);
});

QUnit.test("take container options into account", function(assert) {
    var commandMapping = new CommandMapping();
    commandMapping.setDefaults("ios", { showText: false, showIcon: true });
    commandMapping.setDefaults("android", { showText: true, showIcon: false });

    commandMapping.mapCommands("ios", [
        { id: "add" },
        { id: "edit" }
    ]);

    commandMapping.mapCommands("android", [
        { id: "add", showIcon: true },
        { id: "edit", showText: false, showIcon: true }
    ]);

    var manager = new CommandManager({
        commandMapping: commandMapping,
        defaultWidgetAdapter: {
            addCommand: function($container, command, options) {
                log.push({
                    $container: $container,
                    command: command,
                    options: options
                });
                return true;
            }
        }
    });
    var log = [];

    ko.applyBindings({}, $("#platform-options-for-container").get(0));
    var $renderResult = $("#platform-options-for-container .render-result"),
        commands = manager.findCommands($renderResult),
        containers = manager.findCommandContainers($renderResult);

    manager.renderCommandsToContainers(commands, containers);

    assert.equal(log.length, 4);

    assert.ok(log[0].$container.is(".ios"));
    assert.equal(log[0].command.option("id"), "add");
    assert.deepEqual(log[0].options, { id: "add", showText: false, showIcon: true });
    assert.equal(log[1].command.option("id"), "edit");
    assert.deepEqual(log[1].options, { id: "edit", showText: false, showIcon: true });

    assert.ok(log[2].$container.is(".android"));
    assert.equal(log[2].command.option("id"), "add");
    assert.deepEqual(log[2].options, { id: "add", showText: true, showIcon: true });
    assert.equal(log[3].command.option("id"), "edit");
    assert.deepEqual(log[3].options, { id: "edit", showText: false, showIcon: true });
});

QUnit.test("Missing command id", function(assert) {
    var mapping = new CommandMapping();
    mapping.mapCommands("add-container", [{ id: "add-command" }]);
    var manager = new CommandManager({
        commandMapping: mapping
    });
    var canWork = true;
    var model = {
        work: function() {},
        cantWork: function() {
            return !canWork;
        }
    };
    ko.applyBindings(model, $("#missedIdcommand").get(0));

    var commands = manager.findCommands($("#missedIdcommand")),
        containers = manager.findCommandContainers($("#missedIdcommand"));

    // var renderResult = $("#complex-test .render-result");
    assert.throws(function() {
        manager.renderCommandsToContainers(commands, containers);
    }, function(e) {
        return e.message.indexOf("Processed markup") !== -1 && e.message.indexOf("data-bind=\"dxCommand: { onExecute: work, disabled: cantWork }\"") !== -1 && e.message.indexOf("The command's 'id' option should be specified.") !== -1;
    });
});
