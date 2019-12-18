/* global internals, initTree, $ */

import commonUtils from 'core/utils/common';

QUnit.module('Usage without keys');

QUnit.test('Keys should be generated automatically', function(assert) {
    var treeView = initTree({
        items: [{ text: 'Item 1', items: [{ text: 'Nested item 1' }, { text: 'Nested item 2' }] }, { text: 'Item 2' }]
    }).dxTreeView('instance');

    var nodes = treeView.getNodes();

    assert.equal(nodes[0].key, 1);
    assert.equal(nodes[0].items[0].key, 2);
    assert.equal(nodes[0].items[1].key, 3);
    assert.equal(nodes[1].key, 4);
});

QUnit.test('Keys generation should not affect source items', function(assert) {
    var treeView = initTree({
        items: [{ text: 'Item 1', items: [{ text: 'Nested item 1' }, { text: 'Nested item 2' }] }, { text: 'Item 2' }]
    }).dxTreeView('instance');

    var items = treeView.option('items');

    assert.strictEqual(items[0].id, undefined);
    assert.strictEqual(items[0].items[0].id, undefined);
    assert.strictEqual(items[0].items[1].id, undefined);
    assert.strictEqual(items[1].id, undefined);
});

QUnit.test('Nested items should be rendered correctly', function(assert) {
    var treeView = initTree({
        items: [{ text: 'Item 1', items: [{ text: 'Nested item 1' }, { text: 'Nested item 2' }] }, { text: 'Item 2' }]
    }).dxTreeView('instance');

    $(treeView.$element()).find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).trigger('dxclick');

    assert.equal(treeView.$element().find('.' + internals.ITEM_CLASS).length, 4);
});

QUnit.test('onItemSelectionChanged event should work correctly', function(assert) {
    var onItemSelectionChanged = sinon.spy(commonUtils.noop);
    var treeView = initTree({
        items: [{ text: 'Item 1' }, { text: 'Item 2' }],
        showCheckBoxesMode: 'normal',
        onItemSelectionChanged: onItemSelectionChanged
    }).dxTreeView('instance');

    $(treeView.$element()).find('.dx-checkbox').eq(0).trigger('dxclick');
    var args = onItemSelectionChanged.getCall(0).args[0];

    assert.strictEqual(args.itemData.id, undefined);
    assert.equal(args.node.key, 1);
});

QUnit.test('Parent should be updated correctly', function(assert) {
    var treeView = initTree({
        items: [{ text: 'Item 1', expanded: true, items: [{ text: 'Nested item' }] }, { text: 'Item 2' }],
        showCheckBoxesMode: 'normal'
    }).dxTreeView('instance');

    $(treeView.$element()).find('.dx-checkbox').eq(1).trigger('dxclick');
    assert.ok(treeView.getNodes()[0].selected);
});

QUnit.test('selectItem() method', function(assert) {
    var data = [{ text: 'Item 1', expanded: true, items: [{ text: 'Nested item' }] }, { text: 'Item 2' }],
        treeView = initTree({
            items: data,
            showCheckBoxesMode: 'normal'
        }).dxTreeView('instance');

    var item = treeView.$element().find('.' + internals.ITEM_CLASS).eq(1).get(0);
    treeView.selectItem(item);

    var nodes = treeView.getNodes(),
        items = treeView.option('items');

    assert.ok(nodes[0].selected);
    assert.ok(nodes[0].items[0].selected);
    assert.ok(!nodes[1].selected);

    assert.ok(items[0].selected);
    assert.ok(items[0].items[0].selected);
    assert.ok(!items[1].selected);

    assert.ok(treeView.$element().find('.dx-checkbox').eq(0).dxCheckBox('instance').option('value'));
    assert.ok(treeView.$element().find('.dx-checkbox').eq(1).dxCheckBox('instance').option('value'));
    assert.ok(!treeView.$element().find('.dx-checkbox').eq(2).dxCheckBox('instance').option('value'));
});

QUnit.test('unselectItem() method', function(assert) {
    var data = [{ text: 'Item 1', expanded: true, items: [{ text: 'Nested item', selected: true }] }, { text: 'Item 2' }],
        treeView = initTree({
            items: data,
            showCheckBoxesMode: 'normal'
        }).dxTreeView('instance');

    var item = treeView.$element().find('.' + internals.ITEM_CLASS).eq(1).get(0);
    treeView.unselectItem(item);

    var nodes = treeView.getNodes(),
        items = treeView.option('items');

    assert.ok(!nodes[0].selected);
    assert.ok(!nodes[0].items[0].selected);
    assert.ok(!nodes[1].selected);

    assert.ok(!items[0].selected);
    assert.ok(!items[0].items[0].selected);
    assert.ok(!items[1].selected);

    assert.ok(!treeView.$element().find('.dx-checkbox').eq(0).dxCheckBox('instance').option('value'));
    assert.ok(!treeView.$element().find('.dx-checkbox').eq(1).dxCheckBox('instance').option('value'));
    assert.ok(!treeView.$element().find('.dx-checkbox').eq(2).dxCheckBox('instance').option('value'));
});


QUnit.test('expandItem() method', function(assert) {
    var data = [{ text: 'Item 1', items: [{ text: 'Nested item' }] }, { text: 'Item 2' }],
        treeView = initTree({
            items: data,
            showCheckBoxesMode: 'normal'
        }).dxTreeView('instance');

    var item = treeView.$element().find('.' + internals.ITEM_CLASS).eq(0).get(0);
    treeView.expandItem(item);

    var nodes = treeView.getNodes(),
        items = treeView.option('items');

    assert.ok(nodes[0].expanded);
    assert.ok(!nodes[1].expanded);

    assert.ok(items[0].expanded);
    assert.ok(!items[1].expanded);
});

QUnit.test('expandItem method should not reset item data', function(assert) {
    var $treeView = initTree({
        items: [{ text: 'Item 1', items: [{ text: 'Nested item' }] }, { text: 'Item 2' }],
        onItemClick: function(e) {
            var el = $(e.itemElement);
            var data = el.data();
            e.component.expandItem(e.itemElement);

            assert.deepEqual(el.data(), data, 'Item data is OK');
        }
    });

    $treeView.find('.' + internals.ITEM_CLASS).eq(0).trigger('dxclick');
});

QUnit.test('expandItem should work with item ids and tree dataStructure', function(assert) {
    var items = [{ text: 'Item 1', id: 'item-1', items: [{ text: 'Nested item', id: 'item-1-1' }] }, { text: 'Item 2', id: 'item-2' }],
        $treeView = initTree({
            items: items,
            dataStructure: 'tree'
        }),
        treeView = $treeView.dxTreeView('instance');

    treeView.expandItem('item-1');

    assert.strictEqual(items[0].expanded, true, 'item was expanded');
});

QUnit.test('collapseItem() method', function(assert) {
    var data = [{ text: 'Item 1', expanded: true, items: [{ text: 'Nested item' }] }, { text: 'Item 2' }],
        treeView = initTree({
            items: data,
            showCheckBoxesMode: 'normal'
        }).dxTreeView('instance');

    var item = treeView.$element().find('.' + internals.ITEM_CLASS).eq(0).get(0);
    treeView.collapseItem(item);

    var nodes = treeView.getNodes(),
        items = treeView.option('items');

    assert.ok(!nodes[0].expanded);
    assert.ok(!nodes[1].expanded);

    assert.ok(!items[0].expanded);
    assert.ok(!items[1].expanded);
});

QUnit.test('collapseItem method should not reset item data', function(assert) {
    var $treeView = initTree({
        items: [{ text: 'Item 1', items: [{ text: 'Nested item' }] }, { text: 'Item 2' }],
        onItemClick: function(e) {
            var el = $(e.itemElement);
            var data = el.data();
            e.component.collapseItem(e.itemElement);

            assert.deepEqual(el.data(), data, 'Item data is OK');
        }
    });

    $treeView.find('.' + internals.ITEM_CLASS).eq(0).trigger('dxclick');
});

QUnit.test('select all items using select all checkbox', function(assert) {
    var treeView = initTree({
        items: [{ text: 'Item 1', expanded: true, items: [{ text: 'Nested item' }] }, { text: 'Item 2' }],
        showCheckBoxesMode: 'selectAll'
    }).dxTreeView('instance');

    $(treeView._$selectAllItem).trigger('dxclick');
    var nodes = treeView.getNodes(),
        items = treeView.option('items');

    assert.ok(nodes[0].selected);
    assert.ok(nodes[0].items[0].selected);
    assert.ok(nodes[1].selected);

    assert.ok(items[0].selected);
    assert.ok(items[0].items[0].selected);
    assert.ok(items[1].selected);

    $(treeView._$selectAllItem).trigger('dxclick');
    nodes = treeView.getNodes();

    assert.ok(!nodes[0].selected);
    assert.ok(!nodes[0].items[0].selected);
    assert.ok(!nodes[1].selected);

    assert.ok(!items[0].selected);
    assert.ok(!items[0].items[0].selected);
    assert.ok(!items[1].selected);

});
