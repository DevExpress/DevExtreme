/* global initTree */

QUnit.module('Initialization');

QUnit.test('Init tree view', function(assert) {
    var $treeView = initTree();
    assert.ok($treeView);
});
