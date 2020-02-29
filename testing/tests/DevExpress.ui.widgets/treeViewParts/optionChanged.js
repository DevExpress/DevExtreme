/* global DATA, initTree */

import $ from 'jquery';

QUnit.module('optionChanged');

QUnit.test('selectAllText', function(assert) {
    const treeView = initTree({
        showCheckBoxesMode: 'selectAll',
        items: $.extend(true, [], DATA[5])
    }).dxTreeView('instance');

    treeView.option('selectAllText', 'Select all items');
    assert.equal(treeView._$selectAllItem.dxCheckBox('instance').option('text'), 'Select all items');
});

QUnit.test('selectAll mode', function(assert) {
    const treeView = initTree({
        showCheckBoxesMode: 'selectAll',
        items: $.extend(true, [], DATA[5])
    }).dxTreeView('instance');

    treeView.option('showCheckBoxesMode', 'normal');
    assert.equal(typeof treeView._$selectAllItem, 'undefined');

    treeView.option('showCheckBoxesMode', 'selectAll');
    assert.equal(treeView._$selectAllItem.length, 1);
});

QUnit.test('scrollDirection', function(assert) {
    const treeView = initTree({
        items: $.extend(true, [], DATA[5])
    }).dxTreeView('instance');

    treeView.option('scrollDirection', 'both');
    assert.equal(treeView._scrollableContainer.option('direction'), 'both');
});

QUnit.test('showCheckBoxes', function(assert) {
    const data = $.extend(true, [], DATA[5]);
    data[0].items[1].items[0].expanded = true;
    data[0].items[1].items[1].expanded = true;
    const treeView = initTree({
        items: data,
    }).dxTreeView('instance');

    treeView.option('showCheckBoxesMode', 'normal');
    assert.equal(treeView.$element().find('.dx-checkbox').length, 6);

    treeView.option('showCheckBoxesMode', 'none');
    assert.equal(treeView.$element().find('.dx-checkbox').length, 0);
});

QUnit.test('parentIdExpr should work correctly when it was dynamically changed', function(assert) {
    const $treeView = initTree({
        items: [{ text: 'item 1', id: 1, parentId: 0, expanded: true }, { text: 'item 11', id: 2, parentId: 1 }],
        dataStructure: 'plain'
    });
    const instance = $treeView.dxTreeView('instance');

    instance.option('parentIdExpr', 'parentId');
    const $node1 = $treeView.find('.dx-treeview-node').eq(0);

    assert.equal($node1.find('.dx-treeview-node').length, 1, 'item 11 became a child of the item 1');
});

QUnit.module('Option changing for single item');

QUnit.test('node should have disabled class when it was disabled at runtime', function(assert) {
    const $treeView = initTree({
        items: [{ text: 'item 1' }],
        dataStructure: 'plain'
    });
    const instance = $treeView.dxTreeView('instance');
    const $item = $treeView.find('.dx-treeview-item').eq(0);

    instance.option('items[0].disabled', true);
    assert.ok($item.hasClass('dx-state-disabled'), 'item should be disabled');

    instance.option('items[0].disabled', false);
    assert.notOk($item.hasClass('dx-state-disabled'), 'item should not be disabled');
});

QUnit.test('checkbox should have disabled class when item was disabled at runtime', function(assert) {
    const $treeView = initTree({
        items: [{ text: 'item 1' }],
        dataStructure: 'plain',
        showCheckBoxesMode: 'normal'
    });
    const instance = $treeView.dxTreeView('instance');
    const $checkbox = $treeView.find('.dx-checkbox').eq(0);

    instance.option('items[0].disabled', true);
    assert.ok($checkbox.hasClass('dx-state-disabled'), 'checkbox should be disabled');

    instance.option('items[0].disabled', false);
    assert.notOk($checkbox.hasClass('dx-state-disabled'), 'checkbox should not be disabled');
});

QUnit.test('node should have disabled class when it was disabled at runtime with expressions', function(assert) {
    const $treeView = initTree({
        items: [{ text: 'item 1' }],
        disabledExpr: 'disable',
        dataStructure: 'plain'
    });
    const instance = $treeView.dxTreeView('instance');
    const $item = $treeView.find('.dx-treeview-item').eq(0);

    instance.option('items[0].disable', true);
    assert.ok($item.hasClass('dx-state-disabled'), 'item should be disabled');

    instance.option('items[0].disable', false);
    assert.notOk($item.hasClass('dx-state-disabled'), 'item should not be disabled');
});

QUnit.test('checkbox should have disabled class when item was disabled at runtime with expressions', function(assert) {
    const $treeView = initTree({
        items: [{ text: 'item 1' }],
        dataStructure: 'plain',
        disabledExpr: 'disable',
        showCheckBoxesMode: 'normal'
    });
    const instance = $treeView.dxTreeView('instance');
    const $checkbox = $treeView.find('.dx-checkbox').eq(0);

    instance.option('items[0].disable', true);
    assert.ok($checkbox.hasClass('dx-state-disabled'), 'checkbox should be disabled');

    instance.option('items[0].disable', false);
    assert.notOk($checkbox.hasClass('dx-state-disabled'), 'checkbox should not be disabled');
});
