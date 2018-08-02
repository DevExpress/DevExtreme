var dxCommand = require("framework/command"),
    utils = require("framework/utils").utils,
    mergeCommands = utils.mergeCommands,
    commandToContainer = utils.commandToContainer;

QUnit.module("Framework utils");

QUnit.test("mergeCommands", function(assert) {
    var result,
        command = new dxCommand({ id: "c", title: "command" }),
        commands = [
            new dxCommand({ id: "c1", title: "command1" }),
            new dxCommand({ id: "c2", title: "command2" })
        ],
        overrideCommands = [
            new dxCommand({ id: "c2", title: "command3" }),
            new dxCommand({ id: "c3", title: "command4" })
        ];

    result = mergeCommands([], [command]);

    assert.equal(result.length, 1);
    assert.equal(result[0].option("title"), "command", "merge with an empty array");

    result = mergeCommands(commands, overrideCommands);
    assert.equal(result.length, 3);
    assert.equal(result[0].option("title"), "command1");
    assert.equal(result[1].option("title"), "command3");
    assert.equal(result[2].option("title"), "command4");
});

QUnit.test("mergeCommands with the 'behavior' option", function(assert) {
    var log = [],
        commands = [
            new dxCommand({ id: "a", behavior: "a", onExecute: function() { log.push("a"); } }),
            new dxCommand({ id: "b", behavior: "b", onExecute: function() { log.push("b"); } })
        ],
        overrideCommands = [
            new dxCommand({ id: "c", behavior: "a", onExecute: function() { log.push("c"); } }),
            new dxCommand({ id: "d", behavior: "b" })
        ];

    var result = mergeCommands(commands, overrideCommands);
    assert.equal(result.length, 2);
    assert.equal(result[0].option("id"), "c");
    assert.equal(result[1].option("id"), "d");

    result[0].execute();
    result[1].execute();

    assert.equal(log.length, 2);
    assert.equal(log[0], "c");
    assert.equal(log[1], "b");
});

QUnit.test("resolvePropertyValue", function(assert) {
    var command = new dxCommand({
        test: "commandTest",
        boolTest: false
    });

    assert.equal(commandToContainer.resolvePropertyValue(command, {}, "test"), "commandTest");
    assert.equal(commandToContainer.resolvePropertyValue(command, { test: "containerTest" }, "test"), "commandTest");
    assert.equal(commandToContainer.resolvePropertyValue(command, { notInCommand: "containerTest" }, "notInCommand"), "containerTest");

    assert.equal(commandToContainer.resolvePropertyValue(command, {}, "boolTest"), false);
    assert.equal(commandToContainer.resolvePropertyValue(command, { boolTest: true }, "boolTest"), false);
    assert.equal(commandToContainer.resolvePropertyValue(command, { notInCommand: false }, "notInCommand"), false);
});

QUnit.test("resolveTextValue and resolveIconValue (T162730)", function(assert) {
    var command = new dxCommand({
        title: "commandTitle",
        icon: "commandIcon"
    });

    assert.equal(commandToContainer.resolveTextValue(command, {}), "");
    assert.equal(commandToContainer.resolveIconValue(command, {}, "icon"), "");

    assert.equal(commandToContainer.resolveTextValue(command, { showText: true, showIcon: true }), "commandTitle");
    assert.equal(commandToContainer.resolveIconValue(command, { showText: true, showIcon: true }, "icon"), "commandIcon");

    assert.equal(commandToContainer.resolveTextValue(command, { showText: false, showIcon: true }), "");
    assert.equal(commandToContainer.resolveIconValue(command, { showText: false, showIcon: true }, "icon"), "commandIcon");

    command.option("title", "");

    assert.equal(commandToContainer.resolveTextValue(command, { showText: true, showIcon: false }), "");
    assert.equal(commandToContainer.resolveIconValue(command, { showText: true, showIcon: false }, "icon"), "commandIcon");

    command.option("title", "commandTitle");

    assert.equal(commandToContainer.resolveTextValue(command, { showIcon: false, showText: true }), "commandTitle");
    assert.equal(commandToContainer.resolveIconValue(command, { showIcon: false, showText: true }, "icon"), "");

    command.option("icon", "");

    assert.equal(commandToContainer.resolveTextValue(command, { showIcon: true, showText: false }), "commandTitle");
    assert.equal(commandToContainer.resolveIconValue(command, { showIcon: true, showText: false }, "icon"), "");

    command.option("icon", "commandIcon");
    command.option("showIcon", true);
    command.option("showText", false);

    assert.equal(commandToContainer.resolveTextValue(command, { showIcon: false, showText: true }), "");
    assert.equal(commandToContainer.resolveIconValue(command, { showIcon: false, showText: true }, "icon"), "commandIcon");
});
