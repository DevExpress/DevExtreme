/* global DATA, initTree */

import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';
import $ from 'jquery';
const createInstance = (options) => new TreeViewTestWrapper(options);

QUnit.module('searching');

['dataSource', 'items'].forEach((optionName) => {
    QUnit.test(`Search works even with loop/cycle in ${optionName} option (T832760)`, function(assert) {
        let options = { dataStructure: 'plain', rootValue: 1, searchEnabled: true };
        options[optionName] = [
            { id: 1, text: 'item1', parentId: 2, selected: false, expanded: false },
            { id: 2, text: 'item1_1', parentId: 1, selected: false, expanded: false },
            { id: 3, text: 'item1_2', parentId: 1, selected: false, expanded: false }];
        let treeView = createInstance(options);

        treeView.instance.option('searchValue', '1');

        let $item1 = treeView.getElement().find('[aria-label="item1"]');
        assert.equal($item1.length, 1);
        assert.equal(treeView.hasInvisibleClass($item1), false);

        let $item1_1 = treeView.getElement().find('[aria-label="item1_1"]');
        assert.equal($item1_1.length, 1);
        assert.equal(treeView.hasInvisibleClass($item1_1), false);

        let $item1_2 = treeView.getElement().find('[aria-label="item2"]');
        assert.equal($item1_2.length, 0);
    });
});

QUnit.test('searchValue from empty to value', function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].items[1].items[0].expanded = true;

    var treeView = initTree({
            items: data,
        }).dxTreeView('instance'),
        $items = $(treeView.$element()).find('.dx-treeview-item');

    assert.equal($items.length, 6, '6 items were rendered');

    treeView.option('searchValue', '2');
    $items = $(treeView.$element()).find('.dx-treeview-item');

    assert.equal($items.length, 4, '4 items were rendered after filtration');
});

QUnit.test('searchValue from value to empty', function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].items[1].expanded = true;

    var treeView = initTree({
            items: data,
            searchValue: '2'
        }).dxTreeView('instance'),
        $items = $(treeView.$element()).find('.dx-treeview-item');

    assert.equal($items.length, 4, '4 items were rendered');

    treeView.option('searchValue', '');
    $items = $(treeView.$element()).find('.dx-treeview-item');

    assert.equal($items.length, 6, '6 items were rendered after filtration');
});

QUnit.test('search should consider dataSource sorting', function(assert) {
    var data = [
            { id: 1, parentId: 0, text: 'Bikes' },
            { id: 4, parentId: 3, text: 'BMW' },
            { id: 13, parentId: 3, text: 'Audi' },
            { id: 3, parentId: 0, text: 'Cars' },
            { id: 11, parentId: 10, text: 'YX 1' },
            { id: 12, parentId: 10, text: 'YX 2' },
            { id: 14, parentId: 13, text: 'A1' },
            { id: 15, parentId: 13, text: 'A5' },
            { id: 2, parentId: 0, text: 'Motobikes' },
            { id: 5, parentId: 4, text: 'X1' },
            { id: 6, parentId: 4, text: 'X5' },
            { id: 7, parentId: 4, text: 'X6' },
            { id: 10, parentId: 2, text: 'Yamaha' },
            { id: 8, parentId: 1, text: 'Stels' },
            { id: 9, parentId: 2, text: 'Honda' }
        ],
        treeView = initTree({
            dataSource: { store: data, sort: 'text' },
            dataStructure: 'plain',
            parentIdExpr: 'parentId',
            keyExpr: 'id'
        }).dxTreeView('instance');

    treeView.option('searchValue', '1');

    var $items = $(treeView.$element()).find('.dx-treeview-item'),
        expectedValues = ['Cars', 'Audi', 'A1', 'BMW', 'X1', 'Motobikes', 'Yamaha', 'YX 1'];

    $.each($items, function(index, item) {
        assert.equal($(item).text(), expectedValues[index], 'Correct item');
    });
});

QUnit.test('searchValue from value to empty - update selection', function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].items[1].expanded = true;

    var treeView = initTree({
            items: data,
            showCheckBoxesMode: 'normal',
            searchValue: '2'
        }).dxTreeView('instance'),
        $items = $(treeView.$element()).find('.dx-treeview-item'),
        $checkboxes = $(treeView.$element()).find('.dx-checkbox');

    assert.equal($items.length, 4, '4 items were rendered');
    $checkboxes.eq(2).trigger('dxclick');

    assert.equal($checkboxes.eq(0).dxCheckBox('instance').option('value'), true);
    assert.equal($checkboxes.eq(1).dxCheckBox('instance').option('value'), true);
    assert.equal($checkboxes.eq(2).dxCheckBox('instance').option('value'), true);

    treeView.option('searchValue', '');

    $checkboxes = $(treeView.$element()).find('.dx-checkbox');
    assert.equal($checkboxes.eq(0).dxCheckBox('instance').option('value'), undefined);
    assert.equal($checkboxes.eq(1).dxCheckBox('instance').option('value'), false);
    assert.equal($checkboxes.eq(2).dxCheckBox('instance').option('value'), undefined);
    assert.equal($checkboxes.eq(3).dxCheckBox('instance').option('value'), false);
    assert.equal($checkboxes.eq(4).dxCheckBox('instance').option('value'), true);
    assert.equal($checkboxes.eq(5).dxCheckBox('instance').option('value'), false);

    $items = $(treeView.$element()).find('.dx-treeview-item');

    assert.equal($items.length, 6, '6 items were rendered after filtration');
});

QUnit.test('Should recalculate selection after \'searchValue\' changing', function(assert) {
    var treeView = initTree({
            searchValue: 'b',
            showCheckBoxesMode: 'normal',
            items: [{
                id: 'all',
                text: 'all',
                items: [
                    { id: 'b', text: 'b' },
                    { id: 'c', text: 'c' }
                ]
            }]
        }).dxTreeView('instance'),
        $treeView = $(treeView.$element());

    var checkSelection = function(isFirstItemSelected, isSecondItemSelected) {
        var $items = $treeView.find('.dx-treeview-item'),
            $checkboxes = $treeView.find('.dx-checkbox');

        assert.strictEqual($items.length, 2, '2 items were rendered');
        assert.strictEqual($checkboxes.eq(0).dxCheckBox('instance').option('value'), isFirstItemSelected);
        assert.strictEqual($checkboxes.eq(1).dxCheckBox('instance').option('value'), isSecondItemSelected);
    };

    var $firstChildItem = $treeView.find('.dx-checkbox').eq(1);

    $firstChildItem.trigger('dxclick');
    checkSelection(true, true);
    treeView.option('searchValue', 'c');
    checkSelection(false, false);
});

QUnit.test('searchValue - cut value - update selection', function(assert) {
    var data = $.extend(true, [], DATA[6]);

    var treeView = initTree({
            items: data,
            showCheckBoxesMode: 'normal',
            searchValue: 'item 1'
        }).dxTreeView('instance'),
        $items = $(treeView.$element()).find('.dx-treeview-item'),
        $checkboxes = $(treeView.$element()).find('.dx-checkbox');

    assert.equal($items.length, 6, '6 items were rendered');
    $checkboxes.eq(2).trigger('dxclick');

    assert.strictEqual($checkboxes.eq(0).dxCheckBox('instance').option('value'), true);
    assert.strictEqual($checkboxes.eq(1).dxCheckBox('instance').option('value'), true);
    assert.strictEqual($checkboxes.eq(2).dxCheckBox('instance').option('value'), true);

    treeView.option('searchValue', 'item');

    $checkboxes = $(treeView.$element()).find('.dx-checkbox');
    assert.equal($checkboxes.eq(0).dxCheckBox('instance').option('value'), undefined);
    assert.equal($checkboxes.eq(1).dxCheckBox('instance').option('value'), undefined);
    assert.equal($checkboxes.eq(2).dxCheckBox('instance').option('value'), true);
    assert.equal($checkboxes.eq(3).dxCheckBox('instance').option('value'), false);
    assert.equal($checkboxes.eq(4).dxCheckBox('instance').option('value'), false);
    assert.equal($checkboxes.eq(5).dxCheckBox('instance').option('value'), false);
    assert.equal($checkboxes.eq(6).dxCheckBox('instance').option('value'), false);
    assert.equal($checkboxes.eq(7).dxCheckBox('instance').option('value'), false);

    $items = $(treeView.$element()).find('.dx-treeview-item');

    assert.equal($items.length, 8, '8 items were rendered after filtration');
});

QUnit.test('searchValue with the same text in items', function(assert) {
    var data = [
        { id: '1', parentId: 0, text: 'Item 1' },
        { id: '11', parentId: '1', text: 'Item 11' },
        { id: '12', parentId: '1', text: 'Item 555' },
        { id: '2', parentId: 0, text: 'Item 2' },
        { id: '21', parentId: '2', text: 'Item 25' },
        { id: '22', parentId: '2', text: 'Item 22' }
    ];

    var treeView = initTree({
            items: data,
            dataStructure: 'plain',
            showCheckBoxesMode: 'normal'
        }).dxTreeView('instance'),
        $checkboxes;

    treeView.option('searchValue', '25');
    $checkboxes = $(treeView.$element()).find('.dx-checkbox');
    $checkboxes.eq(1).trigger('dxclick');

    assert.equal($checkboxes.eq(0).dxCheckBox('instance').option('value'), true);
    assert.equal($checkboxes.eq(1).dxCheckBox('instance').option('value'), true);

    treeView.option('searchValue', '');
    $checkboxes = $(treeView.$element()).find('.dx-checkbox');
    assert.equal($checkboxes.eq(0).dxCheckBox('instance').option('value'), false);
    assert.equal($checkboxes.eq(1).dxCheckBox('instance').option('value'), undefined);
    assert.equal($checkboxes.eq(2).dxCheckBox('instance').option('value'), true);
    assert.equal($checkboxes.eq(3).dxCheckBox('instance').option('value'), false);

    treeView.option('searchValue', '5');
    $checkboxes = $(treeView.$element()).find('.dx-checkbox');
    assert.equal($checkboxes.eq(0).dxCheckBox('instance').option('value'), false);
    assert.equal($checkboxes.eq(1).dxCheckBox('instance').option('value'), false);
    assert.equal($checkboxes.eq(2).dxCheckBox('instance').option('value'), true);
    assert.equal($checkboxes.eq(3).dxCheckBox('instance').option('value'), true);

    treeView.option('searchValue', '55');
    $checkboxes = $(treeView.$element()).find('.dx-checkbox');
    $checkboxes.eq(1).trigger('dxclick');
    assert.equal($checkboxes.eq(0).dxCheckBox('instance').option('value'), true);
    assert.equal($checkboxes.eq(1).dxCheckBox('instance').option('value'), true);

    treeView.option('searchValue', '');
    $checkboxes = $(treeView.$element()).find('.dx-checkbox');
    assert.equal($checkboxes.eq(0).dxCheckBox('instance').option('value'), undefined);
    assert.equal($checkboxes.eq(1).dxCheckBox('instance').option('value'), false);
    assert.equal($checkboxes.eq(2).dxCheckBox('instance').option('value'), true);
    assert.equal($checkboxes.eq(3).dxCheckBox('instance').option('value'), undefined);
    assert.equal($checkboxes.eq(4).dxCheckBox('instance').option('value'), true);
    assert.equal($checkboxes.eq(5).dxCheckBox('instance').option('value'), false);
});

QUnit.test('searchEnabled', function(assert) {
    var $treeView = initTree({
            items: $.extend(true, [], DATA[1]),
            searchEnabled: true
        }),
        instance = $treeView.dxTreeView('instance');

    instance.option('searchEnabled', false);

    assert.notOk($treeView.find('.dx-treeview-search').length, 'hasn\'t search editor');

    instance.option('searchEnabled', true);

    assert.ok($treeView.children().first().hasClass('dx-treeview-search'), 'has search editor');
});

QUnit.test('searchMode', function(assert) {
    var $treeView = initTree({
            items: $.extend(true, [], DATA[1]),
            searchValue: 'item 2'
        }),
        instance = $treeView.dxTreeView('instance'),
        $items = $treeView.find('.dx-treeview-item');

    assert.strictEqual($items.length, 3, 'count item');

    instance.option('searchMode', 'startswith');

    $items = $treeView.find('.dx-treeview-item');
    assert.strictEqual($items.length, 1, 'count item');
});

QUnit.test('current expansion should be saved after searchMode option was changed', function(assert) {
    var $treeView = initTree({
            items: [{
                id: '1',
                items: [{ id: '1_1', expanded: true, items: [{ id: '1_1_1' }] }]
            }, {
                id: '2',
                items: [{ id: '2_1', expanded: true, items: [{ id: '2_1_1' }] }]
            }]
        }),
        instance = $treeView.dxTreeView('instance'),
        items;

    instance.collapseItem('1');
    instance.collapseItem('2');

    instance.option('searchMode', 'startswith');
    items = instance.option('items');

    assert.notOk(items[0].expanded, 'item is collapsed');
    assert.notOk(items[1].expanded, 'item is collapsed');
});

QUnit.test('searchExpr', function(assert) {
    var $treeView = initTree({
            items: [
                { key: 1, text: 'Item 1', value: 'test 3' },
                { key: 2, text: 'Item 2', value: 'test 3' },
                { key: 3, text: 'Item 3', value: 'test 1' }
            ],
            searchValue: '3'
        }),
        instance = $treeView.dxTreeView('instance'),
        $items = $treeView.find('.dx-treeview-item');

    assert.strictEqual($items.length, 1, 'count item');
    assert.strictEqual($items.text(), 'Item 3', 'text of the first item');

    instance.option('searchExpr', 'value');

    $items = $treeView.find('.dx-treeview-item');
    assert.strictEqual($items.length, 2, 'count item');
    assert.strictEqual($items.first().text(), 'Item 1', 'text of the first item');
    assert.strictEqual($items.last().text(), 'Item 2', 'text of the second item');
});

QUnit.test('save selection after clean searchValue if selectNodesRecursive: false', function(assert) {
    var $treeView = initTree({
            items: [
                { key: 1, text: 'Item 1', selected: true },
                { key: 2, parentId: 1, text: 'Item 2' },
            ],
            dataStructure: 'plain',
            showCheckBoxesMode: 'normal',
            selectNodesRecursive: false,
            searchValue: '2'
        }),
        instance = $treeView.dxTreeView('instance');

    instance.option('searchValue', '');

    var items = instance.option('items');
    assert.ok(items[0].selected, 'selection is saved');
});

QUnit.test('searchEditorOptions', function(assert) {
    var $treeView = initTree({
            items: $.extend(true, [], DATA[1]),
            searchEnabled: true,
            searchEditorOptions: {
                placeholder: 'Search'
            }
        }),
        searchEditorInstance = $treeView.children().first().dxTextBox('instance'),
        instance = $treeView.dxTreeView('instance');

    assert.strictEqual(searchEditorInstance.option('placeholder'), 'Search', 'placeholder of the search editor');

    instance.option('searchEditorOptions', { placeholder: 'Test' });

    searchEditorInstance = $treeView.children().first().dxTextBox('instance'), assert.strictEqual(searchEditorInstance.option('placeholder'), 'Test', 'placeholder of the search editor');
});

QUnit.test('search immediately if searchTimeout was set, but searchValue is changed by option', function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].items[1].items[0].expanded = true;

    var treeView = initTree({
            items: data,
            searchTimeout: 500
        }).dxTreeView('instance'),
        $items = $(treeView.$element()).find('.dx-treeview-item');

    assert.equal($items.length, 6, '6 items were rendered');

    treeView.option('searchValue', '2');

    $items = $(treeView.$element()).find('.dx-treeview-item');
    assert.equal($items.length, 4, 'filter was applied immediately');
});

QUnit.test('apply search after searchTimeout', function(assert) {
    this.clock = sinon.useFakeTimers();
    var data = $.extend(true, [], DATA[5]);
    data[0].items[1].items[0].expanded = true;

    var $treeView = initTree({
            items: data,
            searchEnabled: true,
            searchTimeout: 500
        }),
        $items = $treeView.find('.dx-treeview-item');

    assert.equal($items.length, 6, '6 items were rendered');

    var $input = $treeView.find('input');

    $input.val('2').trigger('input');

    this.clock.tick(100);
    $items = $treeView.find('.dx-treeview-item');
    assert.equal($items.length, 6, 'still all items');

    this.clock.tick(500);
    $items = $treeView.find('.dx-treeview-item');
    assert.equal($items.length, 4, 'filter was applied after timeout');
    this.clock.restore();
});
