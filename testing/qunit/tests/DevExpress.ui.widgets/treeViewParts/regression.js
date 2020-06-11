/* global internals */

const $ = require('jquery');

QUnit.module('Regression');

QUnit.test('Widget should work right if item is class instance', function(assert) {
    const User = function(name) { this.name = name; };
    const treeView = $('#treeView').dxTreeView({
        items: [
            new User('Alex'),
            new User('Jack'),
            new User('John')
        ],
        displayExpr: 'name'
    }).dxTreeView('instance');

    assert.equal(treeView.$element().find('.dx-item span').eq(0).text(), 'Alex');
    assert.equal(treeView.$element().find('.dx-item span').eq(1).text(), 'Jack');
    assert.equal(treeView.$element().find('.dx-item span').eq(2).text(), 'John');
});

QUnit.test('\'No data\' text should be rendered if tree view has no items', function(assert) {
    const treeView = $('#treeView').dxTreeView({
        items: []
    }).dxTreeView('instance');

    assert.ok(treeView.$element().hasClass('dx-empty-collection'));
    assert.equal(treeView.$element().find('.dx-empty-message').length, 1);

    treeView.option('items', [{ text: 'Item 1' }]);
    assert.ok(!treeView.$element().hasClass('dx-empty-collection'));
    assert.equal(treeView.$element().find('.dx-empty-message').length, 0);

    treeView.option('items', []);
    assert.ok(treeView.$element().hasClass('dx-empty-collection'));
    assert.equal(treeView.$element().find('.dx-empty-message').length, 1);
});

QUnit.test('T217916: dxTreeView does not render a node if ID is less than ParentID', function(assert) {
    const treeView = $('#treeView').dxTreeView({
        items: [
            { id: 1, text: 'Cats', parentId: 0, expanded: true },
            { id: 4, text: 'Sub Bob', parentId: 2, expanded: true },
            { id: 2, text: 'Bob', parentId: 3, expanded: true },
            { id: 3, text: 'Dogs', parentId: 0, expanded: true }
        ],
        dataStructure: 'plain'

    }).dxTreeView('instance');

    assert.equal(treeView.$element().find('.' + internals.ITEM_CLASS).length, 4);
});
