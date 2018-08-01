var StateManager = require("framework/state_manager"),
    frameworkMocks = require("../../helpers/frameworkMocks.js");

QUnit.module("StateManager");

QUnit.test("Add and remove source", function(assert) {
    var manager = new StateManager();
    var source = new frameworkMocks.MockStateSource();

    assert.equal(manager.stateSources.length, 0);
    manager.addStateSource(source);
    assert.equal(manager.stateSources.length, 1);
    manager.removeStateSource(source);
    assert.equal(manager.stateSources.length, 0);
});

QUnit.test("Save state", function(assert) {
    var manager = new StateManager();
    var source = new frameworkMocks.MockStateSource();

    assert.equal(source.__saveStateLog.length, 0);

    manager.addStateSource(source);
    manager.saveState();
    assert.equal(source.__saveStateLog.length, 1);
});

QUnit.test("Restore state", function(assert) {
    var manager = new StateManager();
    var source = new frameworkMocks.MockStateSource();

    assert.equal(source.__restoreStateLog.length, 0);

    manager.addStateSource(source);
    manager.restoreState();
    assert.equal(source.__restoreStateLog.length, 1);
});

QUnit.test("Remove state", function(assert) {
    var manager = new StateManager();
    var source = new frameworkMocks.MockStateSource();

    assert.equal(source.__removeStateLog.length, 0);

    manager.addStateSource(source);
    manager.removeStateSource(source);
    assert.equal(source.__removeStateLog.length, 1);
});
