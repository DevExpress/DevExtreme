/* global internals, initTree */

QUnit.module('Lazy rendering');

QUnit.test('Render treeView with special symbols in id', function(assert) {
    const $treeView = initTree({
        items: [{ id: '!/#$%&\'()*+,./:;<=>?@[\\]^`{|}~', text: 'Item 1' }]
    });
    const $item = $treeView.find('.' + internals.NODE_CLASS);
    const item = $treeView.dxTreeView('option', 'items')[0];

    assert.ok($item.attr('data-item-id').length > item.id.length * 4);

});

QUnit.test('Only root nodes should be rendered by default', function(assert) {
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1', items: [{ id: 3, text: 'Item 3' }] }, { id: 2, text: 'Item 2' }]
    });
    const items = $treeView.find('.' + internals.ITEM_CLASS);

    assert.equal(items.length, 2);
});

QUnit.test('Nested item should be rendered after click on toggle visibility icon', function(assert) {
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1', items: [{ id: 3, text: 'Item 3' }] }, { id: 2, text: 'Item 2' }]
    });

    $treeView.find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).trigger('dxclick');

    const items = $treeView.find('.' + internals.ITEM_CLASS);

    assert.equal(items.length, 3);
});

QUnit.test('Nested item should be rendered when expandItem method was called', function(assert) {
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1', items: [{ id: 3, text: 'Item 3' }] }, { id: 2, text: 'Item 2' }]
    });

    $treeView.dxTreeView('instance').expandItem($treeView.find('.' + internals.ITEM_CLASS).eq(0).get(0));

    const items = $treeView.find('.' + internals.ITEM_CLASS);

    assert.equal(items.length, 3);
});

QUnit.test('Selection should work correctly for nested items', function(assert) {
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1', items: [{ id: 3, text: 'Item 3' }] }, { id: 2, text: 'Item 2' }],
        showCheckBoxesMode: 'normal'
    });
    const treeView = $treeView.dxTreeView('instance');
    const firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0).get(0);

    treeView.selectItem(firstItem);
    treeView.expandItem(firstItem);

    const items = $treeView.find('.dx-checkbox-checked');

    assert.equal(items.length, 2);
});

QUnit.test('Unselection should work correctly for nested items', function(assert) {
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1', selected: true, items: [{ id: 3, text: 'Item 3', selected: true }] }, { id: 2, text: 'Item 2' }],
        showCheckBoxesMode: 'normal'
    });
    const treeView = $treeView.dxTreeView('instance');
    const firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0).get(0);

    treeView.unselectItem(firstItem);
    treeView.expandItem(firstItem);

    const items = $treeView.find('.dx-checkbox-checked');

    assert.equal(items.length, 0);
});

QUnit.test('\'selectAll\' should have correct state on initialization', function(assert) {
    const $treeView = initTree({
        items: [
            { id: 1, text: 'Item 1', selected: true, items: [{ id: 3, text: 'Item 3', selected: true }] }, { id: 2, text: 'Item 2', selected: true }],
        showCheckBoxesMode: 'selectAll'
    });

    assert.strictEqual($treeView.find('.dx-treeview-select-all-item').dxCheckBox('instance').option('value'), true);
});

QUnit.test('\'selectAll\' should work correctly when nested items are not rendered', function(assert) {
    const $treeView = initTree({
        items: [
            { id: 1, text: 'Item 1', items: [{ id: 3, text: 'Item 3' }] }, { id: 2, text: 'Item 2' }],
        showCheckBoxesMode: 'selectAll'
    });
    const $selectAllItem = $treeView.find('.dx-treeview-select-all-item');

    $selectAllItem.trigger('dxclick');

    const items = $treeView.find('.dx-treeview-node-container .dx-checkbox-checked');

    assert.strictEqual($selectAllItem.dxCheckBox('instance').option('value'), true);
    assert.equal(items.length, 2);
});

QUnit.test('\'selectAll\' should work correctly when nested items are rendered', function(assert) {
    const $treeView = initTree({
        items: [
            { id: 1, text: 'Item 1', items: [{ id: 3, text: 'Item 3' }] }, { id: 2, text: 'Item 2' }],
        showCheckBoxesMode: 'selectAll'
    });
    const $selectAllItem = $treeView.find('.dx-treeview-select-all-item');

    $treeView.find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).trigger('dxclick');
    $selectAllItem.trigger('dxclick');

    const items = $treeView.find('.dx-treeview-node-container .dx-checkbox-checked');

    assert.strictEqual($selectAllItem.dxCheckBox('instance').option('value'), true);
    assert.equal(items.length, 3);
});

QUnit.test('\'selectAll\' should work correctly when nested items are rendered after click on \'selectAll\' item', function(assert) {
    const $treeView = initTree({
        items: [
            { id: 1, text: 'Item 1', items: [{ id: 3, text: 'Item 3' }] }, { id: 2, text: 'Item 2' }],
        showCheckBoxesMode: 'selectAll'
    });
    const $selectAllItem = $treeView.find('.dx-treeview-select-all-item');

    $selectAllItem.trigger('dxclick');
    $treeView.find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).trigger('dxclick');

    const items = $treeView.find('.dx-treeview-node-container .dx-checkbox-checked');

    assert.strictEqual($selectAllItem.dxCheckBox('instance').option('value'), true);
    assert.equal(items.length, 3);
});
