/* global DATA, initTree */

import $ from 'jquery';

function initFixture(items) {
    this.treeView = initTree({
        items: $.extend(true, [], items),
        showCheckBoxesMode: 'selectAll'
    }).dxTreeView('instance');

    this.checkAllItemsSelection = function(selection) {
        const items = this.treeView.option('items');
        let count = 0;

        count = items[0].selected === selection ? (count + 1) : count;
        count = items[0].items[0].selected === selection ? (count + 1) : count;
        count = items[0].items[1].selected === selection ? (count + 1) : count;
        count = items[0].items[1].items[0].selected === selection ? (count + 1) : count;
        count = items[0].items[1].items[1].selected === selection ? (count + 1) : count;
        count = items[1].selected === selection ? (count + 1) : count;

        return count;
    };
}

QUnit.module('SelectAll mode');

QUnit.test('select all item should not be rendered when single selection mode is used', function(assert) {
    const $treeView = initTree({
        items: [{ id: 1, text: 'Item 1' }],
        showCheckBoxesMode: 'selectAll',
        selectionMode: 'single'
    });

    assert.equal($treeView.find('.dx-treeview-select-all-item').length, 0, 'item is not rendered');
});

QUnit.test('Select all items', function(assert) {
    const data = [{ id: 1, text: 'Item 1' }, { id: 2, text: 'Item 2' }, { id: 3, text: 'Item 3' }];
    const that = this;

    const checkState = function(state) {
        $.each(that.treeView.option('items'), function(index, item) {
            assert.strictEqual(item.selected, state, 'item ' + index + ' selected state is ' + state);
        });
    };

    initFixture.call(this, data);
    const checkBox = this.treeView._$selectAllItem.dxCheckBox('instance');

    checkBox.option('value', true);
    checkState(true);

    checkBox.option('value', false);
    checkState(false);
});

QUnit.test('\'selectAll\' item should be selected if all items are selected', function(assert) {
    initFixture.call(this, DATA[5]);

    const checkBox = this.treeView._$selectAllItem.dxCheckBox('instance');

    this.treeView.$element().find('.dx-checkbox:not(.dx-treeview-select-all-item)').each(function(_, checkbox) {
        $(checkbox).dxCheckBox('instance').option('value', true);
    });

    assert.ok(checkBox.option('value'));
});

QUnit.test('\'selectAll\' item should be unselected if all items are unselected', function(assert) {
    initFixture.call(this, DATA[5]);

    const checkBox = this.treeView._$selectAllItem.dxCheckBox('instance');

    this.treeView.selectAll();

    this.treeView.$element().find('.dx-checkbox:not(.dx-treeview-select-all-item)').each(function(_, checkbox) {
        $(checkbox).dxCheckBox('instance').option('value', false);
    });

    assert.ok(!checkBox.option('value'));
});

QUnit.test('\'selectAll\' item should have intermediate state if at least one item is unselected', function(assert) {
    initFixture.call(this, DATA[5]);

    const checkBox = this.treeView._$selectAllItem.dxCheckBox('instance');

    this.treeView.selectAll();

    this.treeView.$element().find('.dx-checkbox').eq(1).dxCheckBox('instance').option('value', false);

    assert.ok(!checkBox.option('value'));
});

QUnit.test('\'selectAll\' item should be selected if all item became selected', function(assert) {
    initFixture.call(this, DATA[5]);
    let checkBox = this.treeView._$selectAllItem.dxCheckBox('instance');
    const items = this.treeView.option('items');

    assert.ok(!checkBox.option('value'));

    items[0].selected = true;
    items[1].selected = true;

    this.treeView.option('items', items);
    checkBox = this.treeView._$selectAllItem.dxCheckBox('instance'),
    assert.strictEqual(checkBox.option('value'), true, 'selected');
});

QUnit.test('Select and unselect all items via API', function(assert) {
    initFixture.call(this, DATA[5]);
    const checkBox = this.treeView._$selectAllItem.dxCheckBox('instance');

    assert.ok(!checkBox.option('value'));
    this.treeView.selectAll();

    assert.ok(checkBox.option('value'));
    assert.equal(this.checkAllItemsSelection(true), 6, 'all items are selected');

    this.treeView.unselectAll();

    assert.ok(!checkBox.option('value'));
    assert.equal(this.checkAllItemsSelection(false), 6, 'all items are unselected');
});
