var $ = require("jquery");

require("bundles/modules/framework");

QUnit.testStart(function() {
    var markup = '<div id="command"></div>';

    $("#qunit-fixture").html(markup);
});

QUnit.test("execute test", function(assert) {
    var executed = false;
    var command = $("#command").dxCommand({
        onExecute: function() {
            executed = true;
        }
    }).dxCommand("instance");

    command.execute();
    assert.equal(true, executed, "disabled");
    command.option("disabled", true);
    executed = false;
    assert.throws(function() {
        command.execute();
        assert.equal(false, executed, "disabled");
    });
    command.option("disabled", function() {
        return false;
    });
    command.execute();
    assert.equal(true, executed, "disabled as function");
});
