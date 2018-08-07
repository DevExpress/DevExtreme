var $ = require("jquery"),
    CommandMapping = require("framework/command_mapping");

QUnit.module("commandMapping");

QUnit.test("mapCommands", function(assert) {
    var mapping = new CommandMapping();
    mapping.mapCommands("container1", [
        { id: "cmd1" },
        { id: "cmd2", showIcon: false }
    ]);
    mapping.mapCommands("container2", [
        { id: "cmd1", showIcon: false, custom: "custom" }
    ]);

    assert.deepEqual(mapping.getCommandMappingForContainer("cmd1", "container1"), { id: "cmd1", showIcon: true, showText: true });
    assert.deepEqual(mapping.getCommandMappingForContainer("cmd2", "container1"), { id: "cmd2", showIcon: false, showText: true });
    assert.deepEqual(mapping.getCommandMappingForContainer("cmd1", "container2"), { id: "cmd1", showIcon: false, showText: true, custom: "custom" });
    assert.ok(!mapping.getCommandMappingForContainer("cmd2", "container2"));
});

QUnit.test("unmapCommands", function(assert) {
    var mapping = new CommandMapping();
    mapping.mapCommands("container1", [
        { id: "cmd1" },
        { id: "cmd2" }
    ]);

    assert.ok(mapping.getCommandMappingForContainer("cmd1", "container1"));
    assert.ok(mapping.getCommandMappingForContainer("cmd2", "container1"));

    mapping.unmapCommands("container1", ["cmd1"]);

    assert.ok(!mapping.getCommandMappingForContainer("cmd1", "container1"));
    assert.ok(mapping.getCommandMappingForContainer("cmd2", "container1"));
});

QUnit.test("setDefaults", function(assert) {
    var mapping = new CommandMapping();
    mapping.setDefaults("container1", { showIcon: false });
    mapping.mapCommands("container1", [
        { id: "cmd1" },
        { id: "cmd2", showIcon: true }
    ]);
    mapping.setDefaults("container2", { showIcon: false, showText: false, custom: "container-custom" });
    mapping.mapCommands("container2", [
        { id: "cmd1" },
        { id: "cmd2", showIcon: true, custom: "custom" }
    ]);

    assert.deepEqual(mapping.getCommandMappingForContainer("cmd1", "container1"), { id: "cmd1", showIcon: false, showText: true });
    assert.deepEqual(mapping.getCommandMappingForContainer("cmd2", "container1"), { id: "cmd2", showIcon: true, showText: true });
    assert.deepEqual(mapping.getCommandMappingForContainer("cmd1", "container2"), { id: "cmd1", showIcon: false, showText: false, custom: "container-custom" });
    assert.deepEqual(mapping.getCommandMappingForContainer("cmd2", "container2"), { id: "cmd2", showIcon: true, showText: false, custom: "custom" });
});

QUnit.test("load", function(assert) {
    var mapping = new CommandMapping(),
        config = {
            container1: {
                defaults: { showIcon: false },
                commands: [
                    { id: "cmd1" },
                    { id: "cmd2", showIcon: true }
                ]
            },
            container2: {
                defaults: { showIcon: false, showText: false, custom: "container-custom" },
                commands: [
                    { id: "cmd1" },
                    { id: "cmd2", showIcon: true, custom: "custom" }
                ]
            }
        };

    mapping.load(config);

    assert.deepEqual(mapping.getCommandMappingForContainer("cmd1", "container1"), { id: "cmd1", showIcon: false, showText: true });
    assert.deepEqual(mapping.getCommandMappingForContainer("cmd2", "container1"), { id: "cmd2", showIcon: true, showText: true });
    assert.deepEqual(mapping.getCommandMappingForContainer("cmd1", "container2"), { id: "cmd1", showIcon: false, showText: false, custom: "container-custom" });
    assert.deepEqual(mapping.getCommandMappingForContainer("cmd2", "container2"), { id: "cmd2", showIcon: true, showText: false, custom: "custom" });
});

QUnit.test("missedCommandException", function(assert) {
    var ex1, ex2;

    var mapping = new CommandMapping();
    mapping.mapCommands("container1", [
        { id: "cmd1", showIcon: true }
    ]);
    mapping.mapCommands("container2", [
        { id: "cmd2", showIcon: true }
    ]);
    mapping.checkCommandsExist(["cmd1"]);
    mapping.checkCommandsExist(["cmd2"]);
    try {
        mapping.checkCommandsExist(["cmd2", "cmd3"]);
    } catch(ex) {
        ex1 = ex.message;
    }
    try {
        mapping.checkCommandsExist(["cmd0", "cmd0", "cmd1", "cmd2", "cmd3"]);
    } catch(ex) {
        ex2 = ex.message;
    }
    assert.ok(ex1.indexOf('cmd3'));
    assert.ok(ex2.indexOf('cmd0', 'cmd3'));
});

QUnit.test("Check for obsoletes (T130640)", function(assert) {
    $.each(CommandMapping.defaultMapping, function(container, mapping) {
        var defaults = mapping.defaults || {},
            commands = mapping.commands || [],
            check = function(location) { assert.ok(location !== "left" && location !== "right"); };

        check(defaults.location);
        $.each(commands, function(_, command) {
            check(command.location);
        });
    });
});
