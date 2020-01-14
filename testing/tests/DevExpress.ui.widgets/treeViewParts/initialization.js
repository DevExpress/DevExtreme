/* global initTree */

QUnit.module('Initialization');

QUnit.test('Init tree view', function(assert) {
    const $treeView = initTree();
    assert.ok($treeView);
});
