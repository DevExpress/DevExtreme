/* global DATA, dataID, internals, initTree */

import $ from 'jquery';

QUnit.module('Custom item template via expressions');

QUnit.test('Render items with custom model', function(assert) {
    const data = $.extend(true, [], DATA[3]);
    data[0].children[0].expanded = true;

    const $treeView = initTree({
        items: data,
        keyExpr: 'itemId',
        displayExpr: 'itemName',
        itemsExpr: 'children'
    });

    const $rootNode = $treeView.find('.' + internals.NODE_CONTAINER_CLASS + ':first-child');
    const $rootNodeFirstItem = $rootNode.find('.' + internals.NODE_CLASS).eq(0);
    const $rootNodeSecondItem = $rootNode.find(' > .' + internals.NODE_CLASS).eq(1);

    assert.equal($rootNodeFirstItem.find('> .' + internals.ITEM_CLASS + ' span').text(), 'Item 1');
    assert.equal($rootNodeSecondItem.find('.' + internals.ITEM_CLASS + ' span').text(), 'Item 2');
    assert.equal($rootNodeFirstItem.find('.' + internals.NODE_CONTAINER_CLASS).find('.' + internals.NODE_CLASS + ' .' + internals.ITEM_CLASS + ' span').text(), 'Nested Item 1');
});

QUnit.test('T202554: dxTreeView - The selectedExpr option does not link the checkbox to a data source item', function(assert) {
    const treeView = $('#treeView').dxTreeView({
        items: [
            { Id: 1, ParentId: 0, Name: 'Item 1', expanded: true },
            { Id: 2, ParentId: 1, Name: 'Item 2', isSelected: true },
            { Id: 3, ParentId: 1, Name: 'Item 3' }
        ],
        displayExpr: 'Name',
        keyExpr: 'Id',
        parentIdExpr: 'ParentId',
        dataStructure: 'plain',
        showCheckBoxesMode: 'normal',
        selectedExpr: function() { return 'isSelected'; }
    }).dxTreeView('instance');

    assert.strictEqual(treeView.$element().find('.dx-checkbox').eq(0).dxCheckBox('instance').option('value'), undefined);
    assert.strictEqual(treeView.$element().find('.dx-checkbox').eq(1).dxCheckBox('instance').option('value'), true);
    assert.strictEqual(treeView.$element().find('.dx-checkbox').eq(2).dxCheckBox('instance').option('value'), undefined);
});

QUnit.test('Expressions should be reinitialized if *expr option was changed', function(assert) {
    const treeView = $('#treeView').dxTreeView({
        items: [
            {
                Key: 1,
                Id: 2,

                Expanded: true,
                Opened: false,

                ParentId: 0,
                RootId: 1
            }
        ],
        keyExpr: 'Key',
        expandedExpr: 'Expanded',
        parentIdExpr: 'ParentId'
    }).dxTreeView('instance');

    const item = treeView.option('items')[0];

    treeView.option('keyExpr', 'Id');
    assert.equal(treeView._keyGetter(item), 2);

    treeView.option('expandedExpr', 'Opened');
    assert.equal(treeView._expandedGetter(item), false);

    treeView.option('parentIdExpr', 'RootId');
    assert.equal(treeView._parentIdGetter(item), 1);
});

QUnit.test('displayExpr should be updated correctly in runtime', function(assert) {
    const treeView = $('#treeView').dxTreeView({
        items: [
            { text: 'John', lastName: 'Smith' }
        ]
    }).dxTreeView('instance');

    assert.equal(treeView.$element().find('.' + internals.ITEM_CLASS + ' span').text(), 'John');

    treeView.option('displayExpr', 'lastName');

    assert.equal(treeView.$element().find('.' + internals.ITEM_CLASS + ' span').text(), 'Smith');
});

QUnit.test('VirtualMode: Only root nodes should be rendered in virtualMode with parentIdExpr', function(assert) {
    const $treeView = initTree({
        dataSource: dataID,
        parentIdExpr: 'elternId',
        dataStructure: 'plain',
        virtualModeEnabled: true
    });

    const items = $treeView.find('.' + internals.ITEM_CLASS);

    assert.equal(items.length, 2);
});
