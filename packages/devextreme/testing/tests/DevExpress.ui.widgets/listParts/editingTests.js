import $ from 'jquery';
import typeUtils from 'core/utils/type';
import executeAsyncMock from '../../../helpers/executeAsyncMock.js';
import keyboardMock from '../../../helpers/keyboardMock.js';
import { DataSource } from 'common/data/data_source/data_source';
import ArrayStore from 'common/data/array_store';

import 'ui/list';

const LIST_ITEM_CLASS = 'dx-list-item';
const LIST_SELECT_ALL_CHECKBOX_CLASS = 'dx-list-select-all-checkbox';
const LIST_SELECT_ALL_CLASS = 'dx-list-select-all';
const SELECT_CHECKBOX_CLASS = 'dx-list-select-checkbox';
const SELECT_RADIO_BUTTON_CLASS = 'dx-list-select-radiobutton';

const toSelector = function(cssClass) {
    return '.' + cssClass;
};

QUnit.module('flat index');

QUnit.test('index should be correct for plain list', function(assert) {
    const items = [{ a: 0 }, { a: 1 }];

    const $list = $('#templated-list').dxList({
        items: items
    });
    const list = $list.dxList('instance');

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(1);

    assert.equal(list.getFlatIndexByItemElement($item.get(0)), 1, 'index correct');
    assert.equal(list.getFlatIndexByItemElement($item), 1, 'index correct');
});

QUnit.test('index should be correct for grouped list', function(assert) {
    const items = [
        {
            key: 'first',
            items: [{ a: 0 }, { a: 1 }, { a: 2 }]
        },
        {
            key: 'second',
            items: [{ a: 3 }, { a: 4 }, { a: 5 }]
        }
    ];

    const $list = $('#templated-list').dxList({
        items: items,
        grouped: true
    });
    const list = $list.dxList('instance');

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(5);

    assert.equal(list.getFlatIndexByItemElement($item.get(0)), 5, 'index correct');
    assert.equal(list.getFlatIndexByItemElement($item), 5, 'index correct');
});

QUnit.test('it should be possible to select an item in the grouped list by primitive index', function(assert) {
    const items = [
        {
            key: 'first',
            items: [{ a: 0 }, { a: 1 }]
        },
        {
            key: 'second',
            items: [{ a: 2 }, { a: 3 }]
        }
    ];

    const $list = $('#templated-list').dxList({
        items: items,
        selectionMode: 'single',
        selectedIndex: 2,
        grouped: true
    });
    const list = $list.dxList('instance');

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));

    assert.ok($items.eq(2).hasClass(LIST_ITEM_SELECTED_CLASS), 'correct item is selected');
    assert.deepEqual(list.option('selectedItem'), { key: 'second', items: [{ a: 2 }] }, 'selectedItem is correct');
    assert.deepEqual(list.option('selectedItems'), [{ key: 'second', items: [{ a: 2 }] }], 'selectedItems is correct');

    list.option('selectedIndex', 1);
    assert.ok($items.eq(1).hasClass(LIST_ITEM_SELECTED_CLASS), 'correct item is selected');
    assert.deepEqual(list.option('selectedItem'), { key: 'first', items: [{ a: 1 }] }, 'selectedItem is correct');
    assert.deepEqual(list.option('selectedItems'), [{ key: 'first', items: [{ a: 1 }] }], 'selectedItems is correct');
});

QUnit.test('item should be correct for plain list', function(assert) {
    const items = [{ a: 0 }, { a: 1 }];

    const $list = $('#templated-list').dxList({
        items: items
    });
    const list = $list.dxList('instance');

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(1);

    assert.equal(list.getItemElementByFlatIndex(1).get(0), $item.get(0), 'item correct');
});

QUnit.test('index should be correct for grouped list', function(assert) {
    const items = [
        {
            key: 'first',
            items: [{ a: 0 }, { a: 1 }, { a: 2 }]
        },
        {
            key: 'second',
            items: [{ a: 3 }, { a: 4 }, { a: 5 }]
        }
    ];

    const $list = $('#templated-list').dxList({
        items: items,
        grouped: true
    });
    const list = $list.dxList('instance');

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(5);

    assert.equal(list.getItemElementByFlatIndex(5).get(0), $item.get(0), 'item correct');
});

QUnit.test('it should be possible to select an item with index bigger then 255 in the grouped list (T996851)', function(assert) {
    let selectedIndex;
    const list = $('#list').dxList({
        dataSource: [{
            key: 'someKey',
            items: [...Array(300).keys()]
        }],
        grouped: true,
        selectionMode: 'single',
        onSelectionChanged: function(e) {
            selectedIndex = e.addedItems[0].text;
        },
    }).dxList('instance');

    list.selectItem(280);

    assert.strictEqual(selectedIndex, 280, 'item with big index selected');
});

QUnit.test('deleteItem should remove an item', function(assert) {
    const $list = $('#templated-list').dxList({
        items: [1, 2, 3, 4],
        allowItemDeleting: true
    });
    const list = $list.dxList('instance');
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));

    list.deleteItem($items.eq(0).get(0));
    assert.deepEqual(list.option('items'), [2, 3, 4], 'delete item by node');

    list.deleteItem(0);
    assert.deepEqual(list.option('items'), [3, 4], 'delete item by index');
    assert.equal($list.find(toSelector(LIST_ITEM_CLASS)).length, 2, 'items were removed from the dom');
});

QUnit.test('deferred deleteItem should correctly update cached items after item removing', function(assert) {
    let deferred;
    const $list = $('#templated-list').dxList({
        items: [1, 2, 3, 4],
        onItemDeleting: function(e) {
            deferred = $.Deferred();
            e.cancel = deferred.promise();
        },
        allowItemDeleting: true
    });
    const list = $list.dxList('instance');
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));

    list.deleteItem($items.eq(0).get(0));
    deferred.resolve();
    assert.deepEqual(list.option('items'), [2, 3, 4], 'delete item by node');
    assert.equal(list._itemElements().length, 3, 'item was removed from the cache');

    list.deleteItem(0);
    deferred.resolve();
    assert.deepEqual(list.option('items'), [3, 4], 'delete item by index');
    assert.equal(list._itemElements().length, 2, 'item was removed from the cache');
});


const groupedListData = {
    data: [
        {
            key: 'first',
            items: [{ a: 0 }, { a: 1 }, { a: 2 }]
        },
        {
            key: 'second',
            items: [{ a: 3 }, { a: 4 }, { a: 5 }]
        },
        {
            key: 'third',
            items: [{ a: 6 }, { a: 7 }, { a: 8 }]
        }
    ],
    itemsAfterDelete: [
        {
            key: 'first',
            items: [{ a: 0 }, { a: 1 }, { a: 2 }]
        },
        {
            key: 'second',
            items: [{ a: 3 }, { a: 4 }]
        },
        {
            key: 'third',
            items: [{ a: 6 }, { a: 7 }, { a: 8 }]
        }
    ]
};


QUnit.module('deleting in grouped list');

QUnit.test('deleteItem should remove item by node', function(assert) {
    const $list = $('#templated-list').dxList({
        items: groupedListData.data,
        grouped: true,
        editEnabled: true
    });
    const list = $list.dxList('instance');

    const $groups = $list.find(toSelector(LIST_GROUP_CLASS));

    list.deleteItem($groups.eq(1).find(toSelector(LIST_ITEM_CLASS)).eq(2));

    assert.deepEqual(list.option('items'), groupedListData.itemsAfterDelete, 'item deleted');
});

QUnit.test('deleteItem should remove item by index', function(assert) {
    const $list = $('#templated-list').dxList({
        items: groupedListData.data,
        grouped: true,
        editEnabled: true
    });
    const list = $list.dxList('instance');

    list.deleteItem({ group: 1, item: 2 });

    assert.deepEqual(list.option('items'), groupedListData.itemsAfterDelete, 'item deleted');
});

QUnit.module('keyboard navigation', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test('item deletion by keyboard', function(assert) {
    const items = ['1', '2', '3'];

    const $list = $('#list').dxList({
        items: items,
        editEnabled: true,
        allowItemDeleting: false,
        focusStateEnabled: true
    });
    const list = $list.dxList('instance');

    const keyboard = keyboardMock($list.find('[tabindex=0]'));

    $list.focusin();
    keyboard.keyDown('del');

    assert.deepEqual(list.option('items'), items, 'deletion by keyboard is impossible if \'allowItemDeleting\' = false ');

    list.option('allowItemDeleting', true);
    list.option('focusedElement', $list.find('.' + LIST_ITEM_CLASS).eq(1));

    keyboard.keyDown('del');

    assert.deepEqual(list.option('items'), ['1', '3'], 'item was deleted');
});

QUnit.test('items reordering by keyboard', function(assert) {
    const items = ['1', '2', '3'];

    const $list = $('#list').dxList({
        items: items,
        editEnabled: true,
        itemDragging: {
            allowReordering: false
        },
        focusStateEnabled: true
    });
    const list = $list.dxList('instance');
    const keyboard = keyboardMock($list.find('[tabindex=0]'));

    let $lastItem = $list.find('.' + LIST_ITEM_CLASS).eq(2);

    $lastItem.trigger('dxpointerdown');
    this.clock.tick(10);
    keyboard.keyDown('arrowUp', { shiftKey: true });

    assert.deepEqual(list.option('items'), items, 'reordering by keyboard is impossible if \'itemDragging.allowReordering\' = false ');

    list.option('itemDragging.allowReordering', true);

    $lastItem = $list.find('.' + LIST_ITEM_CLASS).eq(2);
    $lastItem.trigger('dxpointerdown');
    this.clock.tick(10);
    keyboard.keyDown('arrowUp', { shiftKey: true });

    assert.deepEqual(list.option('items'), ['1', '3', '2'], 'items were reordered');

    keyboard.keyDown('arrowDown', { shiftKey: true });

    assert.deepEqual(list.option('items'), items, 'items were reordered');
});


QUnit.module('deleting in grouped list with dataSource', {
    beforeEach: function() {
        executeAsyncMock.setup();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
    }
});

QUnit.test('deleteItem shouldn\'t load data', function(assert) {
    const dataSource = new DataSource({
        store: groupedListData.data,
        pageSize: 1
    });

    const $list = $('#list').height(60).dxList({
        dataSource: dataSource,
        grouped: true,
        editEnabled: true
    });

    const $listItems = $('.' + LIST_ITEM_CLASS, $list);

    $list.dxList('deleteItem', { group: 0, item: 1 }).done(function() {
        const $newListItems = $('.' + LIST_ITEM_CLASS, $list);
        assert.equal($listItems.length, $newListItems.length + 1, 'new item wasn\'t loaded');
    });
});


QUnit.module('selectAll methods');

QUnit.test('selectAll/unselectAll for \'page\' selectAllMode', function(assert) {
    const items = [1, 2, 3, 4, 5];
    const ds = new DataSource({
        store: items,
        pageSize: 2,
        paginate: true
    });

    const $element = $('#list').dxList({
        dataSource: ds,
        pageLoadMode: 'nextButton',
        selectionMode: 'multiple',
        selectAllMode: 'page'
    });

    const instance = $element.dxList('instance');

    instance.selectAll();

    assert.deepEqual(instance.option('selectedItems'), items.slice(0, 2), 'selected items is correct');

    instance.unselectAll();

    assert.deepEqual(instance.option('selectedItems'), [], 'selected items is empty');
});

QUnit.test('selectAll/unselectAll for \'allPages\' selectAllMode', function(assert) {
    const items = [1, 2, 3, 4, 5];
    const loading = sinon.spy();
    const ds = new DataSource({
        store: {
            type: 'array',
            data: items,
            onLoading: loading
        },
        pageSize: 2,
        paginate: true
    });

    const $element = $('#list').dxList({
        dataSource: ds,
        selectionMode: 'multiple',
        selectAllMode: 'allPages'
    });

    const instance = $element.dxList('instance');
    assert.equal(loading.callCount, 1, 'one load during creation');

    instance.selectAll();

    assert.deepEqual(instance.option('selectedItems'), items, 'selected items is correct');
    assert.equal(loading.callCount, 2, 'one load during select all');

    instance.unselectAll();

    assert.deepEqual(instance.option('selectedItems'), [], 'selected items is empty');
    assert.equal(loading.callCount, 2, 'no load during unselect all');
});

QUnit.test('unselectAll method should not unselect disabled items  (T1050340)', function(assert) {
    const items = [{ text: '1', disabled: true }, { text: '2' }];
    const instance = $('#list').dxList({
        dataSource: items,
        selectedItemKeys: ['1', '2'],
        selectionMode: 'all',
        keyExpr: 'text',
    }).dxList('instance');

    instance.unselectAll();

    assert.deepEqual(instance.option('selectedItems'), items.filter(item => item.disabled), 'disabled items are not unselected');
});

QUnit.test('selectAllMode option changed to \'allPages\'', function(assert) {
    const items = [1, 2, 3, 4, 5];
    const ds = new DataSource({
        store: {
            type: 'array',
            data: items
        },
        pageSize: 2,
        paginate: true
    });
    const $element = $('#list').dxList({
        dataSource: ds,
        selectionMode: 'multiple',
        selectAllMode: 'page'
    });
    const instance = $element.dxList('instance');

    instance.selectAll();
    instance.option('selectAllMode', 'allPages');
    instance.selectAll();

    assert.deepEqual(instance.option('selectedItems'), items, 'selected items is correct');
});

QUnit.test('selectAllMode option changed to \'page\'', function(assert) {
    const items = [1, 2, 3, 4, 5];
    const ds = new DataSource({
        store: {
            type: 'array',
            data: items
        },
        pageSize: 2,
        paginate: true
    });
    const $element = $('#list').dxList({
        dataSource: ds,
        selectionMode: 'multiple',
        selectAllMode: 'allPages'
    });
    const instance = $element.dxList('instance');

    instance.option('selectAllMode', 'page');
    instance.selectAll();

    assert.deepEqual(instance.option('selectedItems'), items.slice(0, 2), 'selected items is correct');
});

QUnit.test('selectAllMode option changed twice', function(assert) {
    const items = [1, 2, 3, 4, 5];
    const ds = new DataSource({
        store: {
            type: 'array',
            data: items
        },
        pageSize: 2,
        paginate: true
    });
    const $element = $('#list').dxList({
        dataSource: ds,
        selectionMode: 'multiple',
        selectAllMode: 'page'
    });
    const instance = $element.dxList('instance');

    instance.option('selectAllMode', 'allPages');
    instance.option('selectAllMode', 'page');
    instance.selectAll();

    assert.deepEqual(instance.option('selectedItems'), items.slice(0, 2), 'selected items is correct');
});

QUnit.module('selection');

QUnit.test('unselectItem for last item if \'allPages\' selectAllMode', function(assert) {
    const items = [1, 2, 3, 4, 5];
    const loading = sinon.spy();
    const ds = new DataSource({
        store: items,
        pageSize: 2,
        paginate: true
    });
    ds.store().on('loading', loading);

    const $element = $('#list').dxList({
        selectedItems: [1],
        dataSource: ds,
        pageLoadMode: 'nextButton',
        showSelectionControls: true,
        selectionMode: 'all',
        selectAllMode: 'allPages'
    });

    const instance = $element.dxList('instance');
    assert.equal(loading.callCount, 1, 'one load during creation');

    // act
    instance.unselectItem(0);

    // assert
    assert.equal(loading.callCount, 1, 'no load during unselect last item');
    assert.deepEqual(instance.option('selectedItems'), [], 'selected items is empty');
});

QUnit.test('change selectedItemKeys to invisible items should perform load with filter', function(assert) {
    const items = [1, 2, 3, 4, 5];
    let loading = null;
    const ds = new DataSource({
        store: {
            type: 'array',
            key: 'this',
            data: items,
            onLoading: loading
        },
        pageSize: 2,
        paginate: true
    });

    const $element = $('#list').dxList({
        dataSource: ds,
        selectionMode: 'multiple'
    });

    const instance = $element.dxList('instance');
    loading = sinon.spy();
    ds.store().on('loading', loading);

    // act
    instance.option('selectedItemKeys', [4]);

    // assert
    assert.equal(loading.callCount, 1, 'one load during change selectedRowKeys');
    assert.deepEqual(loading.lastCall.args[0].filter, ['this', '=', 4], 'load during change selectedRowKeys');
    assert.deepEqual(instance.option('selectedItems'), [4], 'selected items is empty');
});

QUnit.test('selectedItems should not be removed if items won\'t loaded', function(assert) {
    const items = [1, 2, 3, 4, 5];
    const ds = new DataSource({
        store: items,
        pageSize: 2,
        paginate: true
    });

    const $element = $('#list').dxList({
        dataSource: ds,
        pageLoadMode: 'nextButton',
        selectedItems: items.slice(),
        selectionMode: 'multiple'
    });

    $element.find('.dx-list-next-button .dx-button').trigger('dxclick');
    assert.deepEqual($element.dxList('option', 'selectedItems'), items, 'selected items is correct');
});

QUnit.test('selectedItems should be cleaned after pulldown', function(assert) {
    const items = [1, 2, 3, 4, 5];
    const ds = new DataSource({
        store: items,
        pageSize: 2,
        paginate: true
    });

    const $element = $('#list').dxList({
        pullRefreshEnabled: true,
        dataSource: ds,
        selectedItems: items.slice(),
        selectionMode: 'multiple'
    });

    $element.dxScrollView('option', 'onPullDown')();
    assert.deepEqual($element.dxList('option', 'selectedItems'), [], 'selected items were cleaned');
});

QUnit.test('selectedItems should not be cleaned after reordering if store key specified', function(assert) {
    const items = [{ id: 1, text: '1' }, { id: 2, text: '2' }, { id: 3, text: '3' }];

    const listInstance = $('#list').dxList({
        dataSource: new ArrayStore({
            key: 'id',
            data: items
        }),
        selectionMode: 'all'
    }).dxList('instance');

    listInstance.selectItem(0);

    const item0 = $('#list').find(toSelector(LIST_ITEM_CLASS)).eq(0).get(0);
    const item1 = $('#list').find(toSelector(LIST_ITEM_CLASS)).eq(1).get(0);

    listInstance.reorderItem(item0, item1);
    assert.equal(listInstance.option('selectedItems')[0], items[0], 'first item is selected');
});

QUnit.test('reorderItem method should return a Promise', function(assert) {
    const listInstance = $('#list').dxList({
        dataSource: [1, 2, 3]
    }).dxList('instance');

    listInstance.selectItem(0);

    const promise = listInstance.reorderItem(0, 1);
    const $items = $('#list').find(toSelector(LIST_ITEM_CLASS));
    const firstItemText = $items.eq(0).text();
    const secondItemText = $items.eq(1).text();

    assert.ok(typeUtils.isPromise(promise), 'method returns a promise');
    assert.equal(firstItemText, '2');
    assert.equal(secondItemText, '1');
});

// T525081
QUnit.test('selection works well after clean all selected items and selectAllMode is \'allPages\'', function(assert) {
    const items = [1, 2, 3];
    const selectionChangedSpy = sinon.spy();

    const listInstance = $('#list').dxList({
        dataSource: new ArrayStore({
            key: 'id',
            data: items
        }),
        selectionMode: 'all',
        showSelectionControls: true,
        selectAllMode: 'allPages',
        onSelectionChanged: selectionChangedSpy
    }).dxList('instance');

    listInstance.selectItem(0);
    listInstance.unselectItem(0);
    listInstance.selectItem(0);

    assert.equal(selectionChangedSpy.callCount, 3, '\'selectionChanged\' event has been fired 3 times');
});

// T567757
QUnit.test('Selecting all filtered items when selectAllMode is \'allPages\'', function(assert) {
    // arrange
    const items = [1, 2, 3, 4, 5];
    let $selectAll;

    const instance = $('#list').dxList({
        dataSource: {
            store: items,
            pageSize: 2,
            paginate: true
        },
        showSelectionControls: true,
        selectionMode: 'all',
        selectAllMode: 'allPages',
        searchValue: '1'
    }).dxList('instance');

    // act
    instance.selectItem(0);

    // assert
    $selectAll = $('#list').find('.dx-list-select-all-checkbox');
    assert.ok($selectAll.hasClass('dx-checkbox-checked'), 'selectAll checkbox is checked');
    assert.deepEqual(instance.option('selectedItems'), [1], 'selected items');

    // act
    instance.option('searchValue', '');

    // assert
    $selectAll = $('#list').find('.dx-list-select-all-checkbox');
    assert.ok($selectAll.hasClass('dx-checkbox-indeterminate'), 'selectAll checkbox is indeterminate');
});

const LIST_ITEM_SELECTED_CLASS = 'dx-list-item-selected';

QUnit.module('selecting in grouped list', {
    beforeEach: function() {
        this.data = [
            {
                key: 'first',
                items: [{ a: 0 }, { a: 1 }, { a: 2 }]
            },
            {
                key: 'second',
                items: [{ a: 3 }, { a: 4 }, { a: 5 }]
            },
            {
                key: 'third',
                items: [{ a: 6 }, { a: 7 }, { a: 8 }]
            }
        ];
        this.selection = [
            { group: 0, item: 0 },
            { group: 0, item: 2 },
            { group: 1, item: 1 },
            { group: 2, item: 2 }
        ];
        this.itemsSelection = [
            {
                key: 'first',
                items: [this.data[0].items[0], this.data[0].items[2]]
            },
            {
                key: 'second',
                items: [this.data[1].items[1]]
            },
            {
                key: 'third',
                items: [this.data[2].items[2]]
            }
        ];
    }
});

const LIST_GROUP_CLASS = 'dx-list-group';

QUnit.test('selectItem by node should add item to selectedItems', function(assert) {
    const $list = $('#templated-list').dxList({
        items: this.data,
        grouped: true,
        editEnabled: true,
        selectionMode: 'multiple'
    });
    const list = $list.dxList('instance');

    const $groups = $list.find(toSelector(LIST_GROUP_CLASS));

    const selectItem = function(group, item) {
        list.selectItem($groups.eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item));
    };

    $.each(this.selection, function(index, value) {
        selectItem(value.group, value.item);
    });

    const selected = list.option('selectedItems');

    assert.deepEqual(selected, this.itemsSelection, 'selection must be equal');
});

QUnit.test('selectItem by index should add item to selectedItems', function(assert) {
    const $list = $('#templated-list').dxList({
        items: this.data,
        grouped: true,
        editEnabled: true,
        selectionMode: 'multiple'
    });
    const list = $list.dxList('instance');

    const selectItem = function(group, item) {
        list.selectItem({ group: group, item: item });
    };

    $.each(this.selection, function(index, value) {
        selectItem(value.group, value.item);
    });

    const selected = list.option('selectedItems');

    assert.deepEqual(selected, this.itemsSelection, 'selection must be equal');
});

QUnit.test('selectItem by itemData should add item to selectedItems', function(assert) {
    const $list = $('#templated-list').dxList({
        items: this.data,
        grouped: true,
        editEnabled: true,
        selectionMode: 'multiple'
    });
    const list = $list.dxList('instance');
    const that = this;

    const selectItem = function(group, item) {
        list.selectItem(that.data[group].items[item]);
    };

    $.each(this.selection, function(index, value) {
        selectItem(value.group, value.item);
    });

    const selected = list.option('selectedItems');

    assert.deepEqual(selected, this.itemsSelection, 'selection must be equal');
});

QUnit.test('selectItem by itemElement should add item to selectedItems', function(assert) {
    const $list = $('#templated-list').dxList({
        items: this.data,
        grouped: true,
        editEnabled: true,
        selectionMode: 'multiple'
    });
    const list = $list.dxList('instance');

    list.selectItem($('<div>'));
    assert.equal(list.option('selectedItems').length, 0, 'selection must be empty');
});

QUnit.test('unselectItem should remove item from selectedItems', function(assert) {
    const $list = $('#templated-list').dxList({
        items: this.data,
        grouped: true,
        editEnabled: true,
        selectionMode: 'multiple'
    });
    const list = $list.dxList('instance');

    const selectItem = function(group, item) {
        list.selectItem({ group: group, item: item });
    };
    const unselectItem = function(group, item) {
        list.unselectItem({ group: group, item: item });
    };

    $.each(this.selection, function(index, value) {
        selectItem(value.group, value.item);
        unselectItem(value.group, value.item);
    });

    const selected = list.option('selectedItems');

    assert.deepEqual(selected, [], 'selection must be equal');
});

QUnit.test('isItemSelected should reflect current item state', function(assert) {
    const data = [
        {
            key: 'first',
            items: [{ a: 0 }]
        },
        {
            key: 'second',
            items: [{ a: 0 }]
        }
    ];

    const $list = $('#templated-list').dxList({
        items: data,
        grouped: true,
        editEnabled: true,
        selectionMode: 'multiple'
    });
    const list = $list.dxList('instance');

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));

    list.selectItem($items.eq(1));
    assert.equal(list.isItemSelected($items.eq(1)), true, 'isItemSelected return proper state');

    list.unselectItem($items.eq(1));
    assert.equal(list.isItemSelected($items.eq(1)), false, 'isItemSelected return proper state');
});

QUnit.test('selection should be same when list refresh', function(assert) {
    const $list = $('#templated-list').dxList({
        items: this.data,
        grouped: true,
        editEnabled: true,
        selectionMode: 'multiple'
    });
    const list = $list.dxList('instance');

    const groupItem = function(group, item) {
        return $list.find(toSelector(LIST_GROUP_CLASS)).eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item);
    };
    const selectItem = function(group, item) {
        list.selectItem(groupItem(group, item));
    };

    $.each(this.selection, function(index, value) {
        selectItem(value.group, value.item);
    });

    list._refresh();

    $.each(this.selection, function(index, value) {
        assert.ok(groupItem(value.group, value.item).hasClass(LIST_ITEM_SELECTED_CLASS), 'class rendered');
    });
});

QUnit.test('selection should be cleared after grouped option is changed', function(assert) {
    const $list = $('#templated-list').dxList({
        items: this.data,
        grouped: true,
        editEnabled: true,
        selectionMode: 'multiple'
    });
    const list = $list.dxList('instance');

    const $groups = $list.find(toSelector(LIST_GROUP_CLASS));

    const selectItem = function(group, item) {
        list.selectItem($groups.eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item));
    };

    $.each(this.selection, function(index, value) {
        selectItem(value.group, value.item);
    });

    list.option('grouped', false);

    assert.equal(list.option('selectedItems').length, 0, 'should not be items in selectedItems');
    assert.equal($list.find(toSelector(LIST_ITEM_SELECTED_CLASS)).length, 0, 'should not be selected elements');
});

QUnit.test('deleteItem should change selected items', function(assert) {
    const toDelete = [
        { group: 0, item: 1 },
        { group: 1, item: 1 },
        { group: 2, item: 1 }
    ];
    const itemsSelection = [
        {
            key: 'first',
            items: [{ a: 0 }, { a: 2 }]
        },
        {
            key: 'third',
            items: [{ a: 8 }]
        }
    ];


    const $list = $('#templated-list').dxList({
        items: this.data,
        grouped: true,
        editEnabled: true,
        selectionMode: 'multiple'
    });
    const list = $list.dxList('instance');

    const groups = function() {
        return $list.find(toSelector(LIST_GROUP_CLASS));
    };
    const selectItem = function(group, item) {
        list.selectItem(groups().eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item));
    };
    const deleteItem = function(group, item) {
        list.deleteItem(groups().eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item));
    };

    $.each(this.selection, function(_, value) {
        selectItem(value.group, value.item);
    });
    $.each(toDelete, function(_, value) {
        deleteItem(value.group, value.item);
    });

    assert.deepEqual(list.option('selectedItems'), itemsSelection, 'item not deleted');
});

QUnit.test('item should be selectable by click on it in the grouped list', function(assert) {
    const list = $('#templated-list').dxList({
        items: [
            { key: 'first', items: [{ text: 'item 1' }] }
        ],
        grouped: true,
        selectionMode: 'multiple',
        keyExpr: 'text'
    }).dxList('instance');
    const $items = $(list.itemElements());

    $items.eq(0).trigger('dxclick');

    assert.ok($items.eq(0).hasClass('dx-list-item-selected'), 'item became selected');
});


QUnit.module('selecting in grouped list with single mode', {
    beforeEach: function() {
        this.data = [
            {
                key: 'first',
                items: [{ a: 0 }, { a: 1 }, { a: 2 }]
            },
            {
                key: 'second',
                items: [{ a: 3 }, { a: 4 }, { a: 5 }]
            },
            {
                key: 'third',
                items: [{ a: 6 }, { a: 7 }, { a: 8 }]
            }
        ];
        this.selection = [
            { group: 0, item: 0 },
            { group: 0, item: 2 },
            { group: 1, item: 1 },
            { group: 2, item: 2 }
        ];
        this.itemsSelection = [
            {
                key: 'first',
                items: [this.data[0].items[0], this.data[0].items[2]]
            },
            {
                key: 'second',
                items: [this.data[1].items[1]]
            },
            {
                key: 'third',
                items: [this.data[2].items[2]]
            }
        ];
    }
});

QUnit.test('selectedItem should select only one item', function(assert) {
    const itemsSelection = [
        {
            key: 'third',
            items: [{ a: 8 }]
        }
    ];

    const $list = $('#templated-list').dxList({
        items: this.data,
        grouped: true,
        editEnabled: true,
        selectionMode: 'single'
    });
    const list = $list.dxList('instance');

    const groups = function() {
        return $list.find(toSelector(LIST_GROUP_CLASS));
    };
    const selectItem = function(group, item) {
        list.selectItem(groups().eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item));
    };

    $.each(this.selection, function(_, value) {
        selectItem(value.group, value.item);
    });

    assert.deepEqual(list.option('selectedItems'), itemsSelection, 'selected only one item');
});

QUnit.test('selectedItems should accept only one item', function(assert) {
    const itemsSelection = [
        {
            key: 'first',
            items: [{ a: 0 }]
        }
    ];

    const $list = $('#templated-list').dxList({
        items: this.data,
        grouped: true,
        editEnabled: true,
        selectedItems: this.itemsSelection,
        selectionMode: 'single'
    });
    const list = $list.dxList('instance');

    assert.deepEqual(list.option('selectedItems'), itemsSelection, 'selected only one item');

    list.option('selectedItems', this.itemsSelection);
    assert.deepEqual(list.option('selectedItems'), itemsSelection, 'selected only one item');
});


QUnit.module('selecting in grouped list with dataSource');

QUnit.test('selection should hold selection after dataSource filtering (T474406)', function(assert) {
    const items = [
        { key: 'first', text: 'a' },
        { key: 'second', text: 'b' }
    ];
    const dataSource = new DataSource({
        store: items,
        group: 'key',
        searchOperation: 'contains',
        searchExpr: 'text'
    });

    const $list = $('#templated-list').dxList({
        dataSource: dataSource,
        grouped: true,
        keyExpr: 'text',
        selectedItemKeys: ['b'],
        selectionMode: 'multiple'
    });
    const list = $list.dxList('instance');

    dataSource.searchValue('a');
    dataSource.load();

    const groups = function() {
        return $list.find(toSelector(LIST_GROUP_CLASS));
    };
    const selectItem = function(group, item) {
        list.selectItem(groups().eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item));
    };

    selectItem(0, 0);

    assert.deepEqual(list.option('selectedItemKeys'), ['a', 'b']);
});


QUnit.module('reordering in grouped items', {
    beforeEach: function() {
        this.data = [
            {
                key: 'first',
                items: [{ a: 0 }, { a: 1 }, { a: 2 }]
            },
            {
                key: 'second',
                items: [{ a: 3 }, { a: 4 }, { a: 5 }]
            }
        ];
        this.movedItem = { group: 0, item: 1 };
        this.destinationItem = { group: 1, item: 1 };
        this.movedItems = [
            {
                key: 'first',
                items: [{ a: 0 }, { a: 2 }]
            },
            {
                key: 'second',
                items: [{ a: 3 }, { a: 1 }, { a: 4 }, { a: 5 }]
            }
        ];
    }
});

QUnit.test('reorderItem should swap items by node', function(assert) {
    const $list = $('#templated-list').dxList({
        items: this.data,
        grouped: true,
        editEnabled: true
    });
    const list = $list.dxList('instance');

    const groups = function() {
        return $list.find(toSelector(LIST_GROUP_CLASS));
    };
    const item = function(group, item) {
        return groups().eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item).get(0);
    };

    const item01 = item(0, 1);
    const item11 = item(1, 1);

    list.reorderItem(item01, item11);
    assert.equal(item01, item(1, 1));
    assert.equal(item11, item(1, 2));
});

QUnit.test('reorderItem should swap items by index', function(assert) {
    const $list = $('#templated-list').dxList({
        items: this.data,
        grouped: true,
        editEnabled: true
    });
    const list = $list.dxList('instance');
    const refreshItemsSpy = sinon.spy(list, '_refreshItemElements');

    const groups = function() {
        return $list.find(toSelector(LIST_GROUP_CLASS));
    };
    const item = function(group, item) {
        return groups().eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item).get(0);
    };

    const item01 = item(0, 1);
    const item11 = item(1, 1);

    list.reorderItem(this.movedItem, this.destinationItem);
    assert.equal(item01, item(1, 1));
    assert.equal(item11, item(1, 2));
    assert.equal(refreshItemsSpy.callCount, 1, 'Items refresh after reorder');
});

QUnit.test('reorderItem should swap items by node within one group', function(assert) {
    const $list = $('#templated-list').dxList({
        items: this.data,
        grouped: true,
        editEnabled: true
    });
    const list = $list.dxList('instance');

    const groups = function() {
        return $list.find(toSelector(LIST_GROUP_CLASS));
    };
    const item = function(group, item) {
        return groups().eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item).get(0);
    };

    const item11 = item(1, 1);
    const item12 = item(1, 2);

    list.reorderItem(item11, item12);
    assert.equal(item11, item(1, 2));
    assert.equal(item12, item(1, 1));
});

QUnit.test('reorderItem should swap last with first items in items option', function(assert) {
    const $list = $('#templated-list').dxList({
        items: this.data,
        grouped: true,
        editEnabled: true
    });
    const list = $list.dxList('instance');

    list.reorderItem(this.movedItem, this.destinationItem);
    assert.deepEqual(list.option('items'), this.movedItems, 'items option changed');
});

QUnit.test('onItemReordered should be fired if items reordered', function(assert) {
    const $list = $('#templated-list').dxList({
        items: this.data,
        grouped: true,
        editEnabled: true,
        onItemReordered: function(args) {
            assert.deepEqual(args.fromIndex, { group: 0, item: 1 }, 'correct from index');
            assert.deepEqual(args.toIndex, { group: 1, item: 1 }, 'correct to index');
        }
    });
    const list = $list.dxList('instance');

    const item = function(group, item) {
        return $list.find(toSelector(LIST_GROUP_CLASS)).eq(group)
            .find(toSelector(LIST_ITEM_CLASS)).eq(item)
            .get(0);
    };

    list.reorderItem(item(0, 1), item(1, 1));
});

QUnit.test('selection should be updated after items reordered', function(assert) {
    const selection = [
        {
            key: 'second',
            items: [this.data[0].items[1], this.data[1].items[1]]
        }
    ];

    const $list = $('#templated-list').dxList({
        items: this.data,
        grouped: true,
        selectedItems: [
            {
                key: 'first',
                items: [this.data[0].items[1]]
            },
            {
                key: 'second',
                items: [this.data[1].items[1]]
            }
        ],
        editEnabled: true,
        selectionMode: 'multiple'
    });
    const list = $list.dxList('instance');

    list.reorderItem(this.movedItem, this.destinationItem);
    assert.deepEqual(list.option('selectedItems'), selection, 'selectedItems option updated');
});

QUnit.module('onSelectionChanging', {
    beforeEach: function() {
        this.dataSource = new DataSource({
            store: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            paginate: true,
            pageSize: 3
        });
    }
}, () => {
    [true, false].forEach(selectByClick => {
        QUnit.test(`should be raised only once on checkBox click if selectByClick=${selectByClick} and selection is cancelled`, function(assert) {
            const selectionChangingHandler = sinon.spy((args) => {
                args.cancel = true;
            });

            const $list = $('#list').dxList({
                dataSource: this.dataSource,
                showSelectionControls: true,
                selectByClick,
                onSelectionChanging: selectionChangingHandler,
                selectionMode: 'multiple'
            });

            const $firstCheckbox = $list.find(`.${SELECT_CHECKBOX_CLASS}`).eq(0);
            $firstCheckbox.trigger('dxclick');

            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is raised once');
        });

        QUnit.test(`should be raised only once on radioButton click if selectByClick=${selectByClick} and selection is cancelled`, function(assert) {
            const selectionChangingHandler = sinon.spy((args) => {
                args.cancel = true;
            });

            const $list = $('#list').dxList({
                dataSource: this.dataSource,
                showSelectionControls: true,
                selectByClick,
                onSelectionChanging: selectionChangingHandler,
                selectionMode: 'single'
            });

            const $firstRadioButton = $list.find(`.${SELECT_RADIO_BUTTON_CLASS}`).eq(0);
            $firstRadioButton.trigger('dxclick');

            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is raised once');
        });

        QUnit.test(`should be raised only once on checkBox click if selectByClick=${selectByClick} and selection is applied`, function(assert) {
            const selectionChangingHandler = sinon.stub();

            const $list = $('#list').dxList({
                dataSource: this.dataSource,
                showSelectionControls: true,
                selectByClick,
                onSelectionChanging: selectionChangingHandler,
                selectionMode: 'multiple'
            });

            const $firstCheckbox = $list.find(`.${SELECT_CHECKBOX_CLASS}`).eq(0);
            $firstCheckbox.trigger('dxclick');

            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is raised once');

            const $firstItem = $list.find(`.${LIST_ITEM_CLASS}`);
            assert.strictEqual($list.dxList('option', 'focusedElement'), $firstItem.get(0), 'focusedElement is updated correctly');
        });

        QUnit.test(`should be raised only once on radioButton click if selectByClick=${selectByClick} and selection is applied`, function(assert) {
            const selectionChangingHandler = sinon.stub();

            const $list = $('#list').dxList({
                dataSource: this.dataSource,
                showSelectionControls: true,
                selectByClick,
                onSelectionChanging: selectionChangingHandler,
                selectionMode: 'single'
            });

            const $firstRadioButton = $list.find(`.${SELECT_RADIO_BUTTON_CLASS}`).eq(0);
            $firstRadioButton.trigger('dxclick');

            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is raised once');
        });

        QUnit.test(`should be raised only once on selectAll checkBox click if selectByClick=${selectByClick} and selection is applied`, function(assert) {
            const selectionChangingHandler = sinon.stub();

            const $list = $('#list').dxList({
                dataSource: this.dataSource,
                showSelectionControls: true,
                selectByClick,
                onSelectionChanging: selectionChangingHandler,
                selectionMode: 'all'
            });

            const $selectAllCheckBox = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`).eq(0);
            $selectAllCheckBox.trigger('dxclick');

            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is raised once');

            const $selectAllItem = $list.find(`.${LIST_SELECT_ALL_CLASS}`);
            assert.strictEqual($list.dxList('option', 'focusedElement'), $selectAllItem.get(0), 'focusedElement is updated correctly');
        });

        QUnit.test(`should be raised only once on selectAll checkbox click if selectByClick=${selectByClick} and selection is cancelled`, function(assert) {
            const selectionChangingHandler = sinon.spy((args) => {
                args.cancel = true;
            });

            const $list = $('#list').dxList({
                dataSource: this.dataSource,
                showSelectionControls: true,
                selectByClick,
                onSelectionChanging: selectionChangingHandler,
                selectionMode: 'all'
            });

            const $selectAllCheckBox = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`).eq(0);
            $selectAllCheckBox.trigger('dxclick');

            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is raised once');
        });
    });
});
