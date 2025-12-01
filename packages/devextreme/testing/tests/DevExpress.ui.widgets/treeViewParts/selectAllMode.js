import $ from 'jquery';
import { DATA } from './testData.js';
import { initTree } from './testUtils.js';
import {
    SELECT_ALL_ITEM_CLASS,
    CHECK_BOX_CLASS,
    ITEM_CLASS,
} from '__internal/ui/tree_view/tree_view.base';

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

    assert.strictEqual($treeView.find(`.${SELECT_ALL_ITEM_CLASS}`).length, 0, 'item is not rendered');
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

    this.treeView.$element().find(`.${CHECK_BOX_CLASS}:not(.${SELECT_ALL_ITEM_CLASS})`).each(function(_, checkbox) {
        $(checkbox).dxCheckBox('instance').option('value', true);
    });

    assert.ok(checkBox.option('value'));
});

QUnit.test('\'selectAll\' item should be unselected if all items are unselected', function(assert) {
    initFixture.call(this, DATA[5]);

    const checkBox = this.treeView._$selectAllItem.dxCheckBox('instance');

    this.treeView.selectAll();

    this.treeView.$element().find(`.${CHECK_BOX_CLASS}:not(.${SELECT_ALL_ITEM_CLASS})`).each(function(_, checkbox) {
        $(checkbox).dxCheckBox('instance').option('value', false);
    });

    assert.ok(!checkBox.option('value'));
});

QUnit.test('\'selectAll\' item should have intermediate state if at least one item is unselected', function(assert) {
    initFixture.call(this, DATA[5]);

    const checkBox = this.treeView._$selectAllItem.dxCheckBox('instance');

    this.treeView.selectAll();

    this.treeView.$element().find(`.${CHECK_BOX_CLASS}`).eq(1).dxCheckBox('instance').option('value', false);

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
    assert.strictEqual(this.checkAllItemsSelection(true), 6, 'all items are selected');

    this.treeView.unselectAll();

    assert.ok(!checkBox.option('value'));
    assert.strictEqual(this.checkAllItemsSelection(false), 6, 'all items are unselected');
});

QUnit.module('Events should not duplicate when container changes (T1314209)', {
    beforeEach: function() {
        this.items = [
            { id: 1, text: 'Item 1', parentId: 0 },
            { id: 2, text: 'Item 2', parentId: 0 }
        ];
    }
}, () => {
    QUnit.test('onItemClick should fire once when clicking on item after items changed', function(assert) {
        const onItemClickStub = sinon.stub();
        const $treeView = initTree({
            items: [],
            showCheckBoxesMode: 'selectAll',
            onItemClick: onItemClickStub
        });

        const instance = $treeView.dxTreeView('instance');
        instance.option('items', this.items);

        const $firstItem = $treeView.find(`.${ITEM_CLASS}`).first();
        $firstItem.trigger('dxclick');

        assert.strictEqual(onItemClickStub.callCount, 1, 'onItemClick fired exactly once');
    });

    QUnit.test('clicking on checkbox should not trigger selection twice', function(assert) {
        const onSelectionChangedStub = sinon.stub();
        const $treeView = initTree({
            items: [],
            showCheckBoxesMode: 'selectAll',
            onSelectionChanged: onSelectionChangedStub
        });

        const instance = $treeView.dxTreeView('instance');
        instance.option('items', this.items);

        const $checkboxes = $treeView.find(`.${CHECK_BOX_CLASS}`);
        $($checkboxes[0]).trigger('dxclick');

        assert.strictEqual(onSelectionChangedStub.callCount, 1, 'onSelectionChanged fired exactly once');

        const $firstCheckbox = $treeView.find(`.${CHECK_BOX_CLASS}`).eq(1);
        const checkboxValue = $firstCheckbox.dxCheckBox('instance').option('value');
        assert.strictEqual(checkboxValue, true, 'first item checkbox should be checked');
    });

    QUnit.test('clicking on item text should not change selection by default', function(assert) {
        const onSelectionChangedStub = sinon.stub();
        const $treeView = initTree({
            items: [],
            showCheckBoxesMode: 'selectAll',
            selectByClick: false,
            onSelectionChanged: onSelectionChangedStub
        });

        const instance = $treeView.dxTreeView('instance');
        instance.option('items', this.items);

        const $firstItem = $treeView.find(`.${ITEM_CLASS}`).first();
        $firstItem.trigger('dxclick');

        assert.strictEqual(onSelectionChangedStub.callCount, 0, 'onSelectionChanged should not fire when clicking item text');

        const $itemCheckboxes = $treeView.find(`.${CHECK_BOX_CLASS}`).slice(1);
        const allUnchecked = $itemCheckboxes.toArray().every(cb => $(cb).dxCheckBox('instance').option('value') === false);
        assert.ok(allUnchecked, 'all item checkboxes should be unchecked');
    });

    QUnit.test('clicking on item should change selection with selectByClick=true', function(assert) {
        const onSelectionChangedStub = sinon.stub();
        const $treeView = initTree({
            items: [],
            showCheckBoxesMode: 'selectAll',
            selectByClick: true,
            onSelectionChanged: onSelectionChangedStub
        });

        const instance = $treeView.dxTreeView('instance');
        instance.option('items', this.items);

        const $firstItem = $treeView.find(`.${ITEM_CLASS}`).first();
        $firstItem.trigger('dxclick');

        assert.strictEqual(onSelectionChangedStub.callCount, 1, 'onSelectionChanged should fire exactly once');

        const $firstItemCheckbox = $treeView.find(`.${CHECK_BOX_CLASS}`).eq(1);
        const checkboxValue = $firstItemCheckbox.dxCheckBox('instance').option('value');
        assert.strictEqual(checkboxValue, true, 'first item checkbox should be checked');
    });

    QUnit.test('selectByClick: clicking item twice should not trigger selection twice', function(assert) {
        const onSelectionChangedStub = sinon.stub();
        const $treeView = initTree({
            items: [],
            showCheckBoxesMode: 'selectAll',
            selectByClick: true,
            onSelectionChanged: onSelectionChangedStub
        });

        const instance = $treeView.dxTreeView('instance');
        instance.option('items', this.items);

        const $firstItem = $treeView.find(`.${ITEM_CLASS}`).first();

        $firstItem.trigger('dxclick');
        assert.strictEqual(onSelectionChangedStub.callCount, 1, 'first click: selection changed once');

        onSelectionChangedStub.reset();
        $firstItem.trigger('dxclick');
        assert.strictEqual(onSelectionChangedStub.callCount, 1, 'second click: selection changed once (not twice)');
    });

    QUnit.test('clicking checkbox vs clicking item should work correctly', function(assert) {
        const onItemClickStub = sinon.stub();
        const onSelectionChangedStub = sinon.stub();
        const $treeView = initTree({
            items: [],
            showCheckBoxesMode: 'selectAll',
            selectByClick: false,
            onItemClick: onItemClickStub,
            onSelectionChanged: onSelectionChangedStub
        });

        const instance = $treeView.dxTreeView('instance');
        instance.option('items', this.items);

        const $checkboxes = $treeView.find(`.${CHECK_BOX_CLASS}`);
        $($checkboxes[0]).trigger('dxclick');

        assert.strictEqual(onItemClickStub.callCount, 0, 'clicking checkbox should not trigger onItemClick');
        assert.strictEqual(onSelectionChangedStub.callCount, 1, 'clicking checkbox should trigger onSelectionChanged once');

        onItemClickStub.reset();
        onSelectionChangedStub.reset();
        const $firstItem = $treeView.find(`.${ITEM_CLASS}`).first();
        $firstItem.trigger('dxclick');

        assert.strictEqual(onItemClickStub.callCount, 1, 'clicking item should trigger onItemClick once');
        assert.strictEqual(onSelectionChangedStub.callCount, 0, 'clicking item should not trigger selection without selectByClick');
    });

    QUnit.test('onItemSelectionChanged should fire once when item checkbox clicked after items changed', function(assert) {
        const onItemSelectionChangedStub = sinon.stub();
        const $treeView = initTree({
            items: [],
            showCheckBoxesMode: 'selectAll',
            onItemSelectionChanged: onItemSelectionChangedStub
        });

        const instance = $treeView.dxTreeView('instance');
        instance.option('items', this.items);

        const $firstItemCheckbox = $treeView.find(`.${CHECK_BOX_CLASS}`).eq(1);
        $firstItemCheckbox.trigger('dxclick');

        assert.strictEqual(onItemSelectionChangedStub.callCount, 1, 'onItemSelectionChanged fired exactly once');
    });

    QUnit.test('onItemHold should fire once after items changed', function(assert) {
        const onItemHoldStub = sinon.stub();
        const $treeView = initTree({
            items: [],
            showCheckBoxesMode: 'selectAll',
            onItemHold: onItemHoldStub
        });

        const instance = $treeView.dxTreeView('instance');
        instance.option('items', this.items);

        const $firstItem = $treeView.find(`.${ITEM_CLASS}`).first();
        $firstItem.trigger('dxhold');

        assert.strictEqual(onItemHoldStub.callCount, 1, 'onItemHold fired exactly once');
    });

    QUnit.test('onItemContextMenu should fire once after items changed', function(assert) {
        const onItemContextMenuStub = sinon.stub();
        const $treeView = initTree({
            items: [],
            showCheckBoxesMode: 'selectAll',
            onItemContextMenu: onItemContextMenuStub
        });

        const instance = $treeView.dxTreeView('instance');
        instance.option('items', this.items);

        const $firstItem = $treeView.find(`.${ITEM_CLASS}`).first();
        $firstItem.trigger('dxcontextmenu');

        assert.strictEqual(onItemContextMenuStub.callCount, 1, 'onItemContextMenu fired exactly once');
    });

    QUnit.test('Events should not duplicate in normal showCheckBoxesMode (regression check)', function(assert) {
        const onItemClickStub = sinon.stub();
        const $treeView = initTree({
            items: [],
            showCheckBoxesMode: 'normal',
            onItemClick: onItemClickStub
        });

        const instance = $treeView.dxTreeView('instance');
        instance.option('items', this.items);

        const $firstItem = $treeView.find(`.${ITEM_CLASS}`).first();
        $firstItem.trigger('dxclick');

        assert.strictEqual(onItemClickStub.callCount, 1, 'onItemClick should fire once even in normal mode');
    });

    QUnit.test('Multiple items changes should not cause event duplication', function(assert) {
        const onItemClickStub = sinon.stub();
        const $treeView = initTree({
            items: [],
            showCheckBoxesMode: 'selectAll',
            onItemClick: onItemClickStub
        });

        const instance = $treeView.dxTreeView('instance');
        instance.option('items', this.items);

        instance.option('items', [
            { id: 3, text: 'Item 3', parentId: 0 }
        ]);

        const $firstItem = $treeView.find(`.${ITEM_CLASS}`).first();
        $firstItem.trigger('dxclick');

        assert.strictEqual(onItemClickStub.callCount, 1, 'onItemClick should fire once after multiple option changes');
    });
});
