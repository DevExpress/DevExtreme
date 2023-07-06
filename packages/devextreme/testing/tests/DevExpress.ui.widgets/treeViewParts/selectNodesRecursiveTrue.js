/* global DATA, internals, initTree */

import $ from 'jquery';

QUnit.module('selectNodesRecursive = true', {
    beforeEach: function() {
        this.data = $.extend(true, [], DATA[5]);
        this.data[0].items[1].items[0].expanded = true;
        this.data[0].items[1].items[1].expanded = true;
        this.$treeView = initTree({
            items: this.data,
            showCheckBoxesMode: 'normal'
        });
        this.treeView = this.$treeView.dxTreeView('instance');
    },
    afterEach: function() {
    }
});

QUnit.test('ignore invisible items on select (T317454)', function(assert) {
    const items = [{
        text: 'item 1', expanded: true, items: [
            { text: 'item 11', selected: false },
            { text: 'item 12', visible: false, selected: false }
        ]
    }];
    const $treeView = initTree({
        items: items,
        showCheckBoxesMode: 'selectAll'
    });
    const treeView = $treeView.dxTreeView('instance');
    const selectAll = $treeView.find('.dx-treeview-select-all-item').dxCheckBox('instance');

    treeView.selectItem(items[0].items[0]);
    assert.strictEqual(items[0].selected, true, 'parent item ignore invisible selection');
    assert.strictEqual(selectAll.option('value'), true, 'selectAll item ignore invisible selection');
});

QUnit.test('ignore invisible items on unselect (T317454)', function(assert) {
    const items = [{
        text: 'item 1', expanded: true, items: [
            { text: 'item 11' },
            { text: 'item 12', visible: false, selected: true },
            { text: 'item 13', visible: false }
        ]
    }];
    const $treeView = initTree({
        items: items,
        showCheckBoxesMode: 'selectAll'
    });
    const treeView = $treeView.dxTreeView('instance');
    const selectAll = $treeView.find('.dx-treeview-select-all-item').dxCheckBox('instance');

    treeView.selectItem(items[0]);
    assert.notOk(items[0].items[2].selected, 'invisible item ignores parent selection');

    treeView.unselectItem(items[0].items[0]);
    assert.strictEqual(items[0].selected, false, 'parent item ignore invisible selection');
    assert.strictEqual(selectAll.option('value'), false, 'selectAll item ignore invisible selection');
});

QUnit.test('Unselect disabled item via API', function(assert) {
    const data = $.extend(true, [], DATA[2]);
    data[0].disabled = true;
    data[0].selected = true;

    const $treeView = initTree({
        items: data,
        showCheckBoxesMode: 'normal'
    });
    const instance = $treeView.dxTreeView('instance');
    const $item = $treeView.find('.' + internals.ITEM_CLASS).first().get(0);

    assert.ok(instance.option('items')[0].selected, 'item is selected');
    instance.unselectItem($item);
    assert.notOk(instance.option('items')[0].selected, 'item is not selected');

});

QUnit.test('selection by key', function(assert) {
    const data = [
        { id: 1, text: 'Item 1', expanded: true, items: [{ id: 11, text: 'Item 11' }] }, { id: 12, text: 'Item 12' }
    ];
    const treeView = initTree({ items: data }).dxTreeView('instance');

    treeView.selectItem(1);
    assert.ok(data[0].selected);

    treeView.unselectItem(1);
    assert.notOk(data[0].selected);
});

QUnit.test('Toggle node selected class', function(assert) {
    const data = $.extend(true, [], DATA[2]);
    data[0].selected = true;
    data[0].expanded = true;

    const treeView = initTree({
        items: data,
        showCheckBoxesMode: 'normal'
    }).dxTreeView('instance');
    const $treeView = treeView.$element();
    let $selectedItems = $treeView.find('.dx-state-selected');
    const checkboxes = $treeView.find('.dx-checkbox');

    assert.equal($selectedItems.length, 3, '3 selected items');

    $(checkboxes[1]).trigger('dxclick');
    $selectedItems = $treeView.find('.dx-state-selected');

    assert.equal($selectedItems.length, 1, '1 selected items');

    $(checkboxes[2]).trigger('dxclick');
    $selectedItems = $treeView.find('.dx-state-selected');

    assert.equal($selectedItems.length, 0, '0 selected items');
});

QUnit.test('\'selectItem()\' by itemData', function(assert) {
    this.treeView.selectItem(this.data[0]);
    assert.ok(this.data[0].selected, 'item was selected');
});

QUnit.test('\'unselectItem()\' by itemData', function(assert) {
    this.treeView.selectItem(this.data[0]);
    this.treeView.unselectItem(this.data[0]);
    assert.ok(!this.data[0].selected, 'item was unselected');
});
