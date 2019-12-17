/* global internals, initTree */
import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';
const createInstance = (options) => new TreeViewTestWrapper(options);

QUnit.module('Lazy rendering');

QUnit.test('Render treeView with special symbols in id', function(assert) {
    const sampleId = '!/#$%&\'()*+,./:;<=>?@[\\]^`{|}~__';
    var $treeView = initTree({
            items: [{ id: sampleId, text: 'Item 1' }]
        }),
        $item = $treeView.find('.' + internals.NODE_CLASS),
        item = $treeView.dxTreeView('option', 'items')[0];

    assert.ok($item.attr('data-item-id').length);
    assert.equal(sampleId, $treeView.dxTreeView('instance')._getNodeByElement($item).id);
    assert.equal(sampleId, item.id);
});

QUnit.test('Only root nodes should be rendered by default', function(assert) {
    var $treeView = initTree({
        items: [{ id: 1, text: 'Item 1', items: [{ id: 3, text: 'Item 3' }] }, { id: 2, text: 'Item 2' }]
    });
    var items = $treeView.find('.' + internals.ITEM_CLASS);

    assert.equal(items.length, 2);
});

['!/#$%&\'()"+./:;<=>?@[]^`{|}~\\,', '____2______.jpg', 'E:\\test\\[gsdfgfd]  |  \'[some__file]', '!@#$%^&*()_+', 1, 2.18, Number(3), true, 0,
    'Egsdfgfd]\0\r\n\b', '!/#$%' + String.fromCharCode(10) + String.fromCharCode(13) + String.fromCharCode(0), 'سلام دنیا' ].forEach((testId) => {
    QUnit.test(`Nodes expanding should work with special charactes in id - ${testId}`, function(assert) {
        let treeView = createInstance({
                dataSource: [
                    { id: testId, text: 'item1', selected: false, expanded: false },
                    { id: testId + 'item1_1', parentId: testId, text: 'item1_1', selected: false, expanded: false }
                ],
                dataStructure: 'plain',
                rootValue: -1,
                keyExpr: 'id',
                height: 500
            }),
            parentItem = treeView.getElement().find('[aria-level="1"]'),
            childItem = treeView.getElement().find('[aria-level="2"]');

        assert.equal(childItem.length, 0);

        treeView.instance.expandItem(parentItem);
        childItem = treeView.getElement().find('[aria-level="2"]');
        assert.equal(childItem.length, 1);
        assert.equal(treeView.hasInvisibleClass(childItem), false);
    });

    QUnit.test(`Nodes selection should work with special charactes in id - ${testId}`, function(assert) {
        const treeView = createInstance({
            dataSource: [
                { id: testId, text: 'item1', selected: false, expanded: true },
                { id: testId + 'item1_1', parentId: testId, text: 'item1_1', selected: false, expanded: true }
            ],
            dataStructure: 'plain',
            rootValue: -1,
            keyExpr: 'id',
            showCheckBoxesMode: 'normal',
            height: 500
        });

        treeView.checkSelectedNodes([]);

        const elem = treeView.getElement().find('[aria-level="1"]');
        treeView.instance.selectItem(elem);

        treeView.checkSelectedNodes([0, 1]);
    });

    QUnit.test(`Search should work with special charactes in the nodes ids - ${testId}`, function(assert) {
        let treeView = createInstance({
                dataSource: [
                    { id: testId, text: 'item1', selected: false, expanded: false },
                    { id: testId + 'item1_1', parentId: testId, text: 'item1_1', selected: false, expanded: false },
                    { id: 'item2', text: 'item2', selected: false, expanded: false }
                ],
                dataStructure: 'plain',
                rootValue: -1,
                keyExpr: 'id',
                searchEnabled: true,
                height: 500
            }),
            parentItem = treeView.getElement().find('[aria-label="item1"]'),
            childItem = treeView.getElement().find('[aria-label="item1_1"]'),
            anotherItem = treeView.getElement().find('[aria-label="item2"]');

        assert.equal(parentItem.length, 1);
        assert.equal(childItem.length, 0);
        assert.equal(anotherItem.length, 1);

        treeView.instance.option('searchValue', '1_1');

        parentItem = treeView.getElement().find('[aria-label="item1"]');
        assert.equal(parentItem.length, 1);
        assert.equal(treeView.hasInvisibleClass(parentItem), false);

        childItem = treeView.getElement().find('[aria-label="item1_1"]');
        assert.equal(childItem.length, 1);
        assert.equal(treeView.hasInvisibleClass(childItem), false);

        anotherItem = treeView.getElement().find('[aria-label="item2"]');
        assert.equal(anotherItem.length, 0);
    });
});

QUnit.test('Nested item should be rendered after click on toggle visibility icon', function(assert) {
    var $treeView = initTree({
        items: [{ id: 1, text: 'Item 1', items: [{ id: 3, text: 'Item 3' }] }, { id: 2, text: 'Item 2' }]
    });

    $treeView.find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).trigger('dxclick');

    var items = $treeView.find('.' + internals.ITEM_CLASS);

    assert.equal(items.length, 3);
});

QUnit.test('Nested item should be rendered when expandItem method was called', function(assert) {
    var $treeView = initTree({
        items: [{ id: 1, text: 'Item 1', items: [{ id: 3, text: 'Item 3' }] }, { id: 2, text: 'Item 2' }]
    });

    $treeView.dxTreeView('instance').expandItem($treeView.find('.' + internals.ITEM_CLASS).eq(0).get(0));

    var items = $treeView.find('.' + internals.ITEM_CLASS);

    assert.equal(items.length, 3);
});

QUnit.test('Selection should work correctly for nested items', function(assert) {
    var $treeView = initTree({
            items: [{ id: 1, text: 'Item 1', items: [{ id: 3, text: 'Item 3' }] }, { id: 2, text: 'Item 2' }],
            showCheckBoxesMode: 'normal'
        }),
        treeView = $treeView.dxTreeView('instance'),
        firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0).get(0);

    treeView.selectItem(firstItem);
    treeView.expandItem(firstItem);

    var items = $treeView.find('.dx-checkbox-checked');

    assert.equal(items.length, 2);
});

QUnit.test('Unselection should work correctly for nested items', function(assert) {
    var $treeView = initTree({
            items: [{ id: 1, text: 'Item 1', selected: true, items: [{ id: 3, text: 'Item 3', selected: true }] }, { id: 2, text: 'Item 2' }],
            showCheckBoxesMode: 'normal'
        }),
        treeView = $treeView.dxTreeView('instance'),
        firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0).get(0);

    treeView.unselectItem(firstItem);
    treeView.expandItem(firstItem);

    var items = $treeView.find('.dx-checkbox-checked');

    assert.equal(items.length, 0);
});

QUnit.test('\'selectAll\' should have correct state on initialization', function(assert) {
    var $treeView = initTree({
        items: [
            { id: 1, text: 'Item 1', selected: true, items: [{ id: 3, text: 'Item 3', selected: true }] }, { id: 2, text: 'Item 2', selected: true }],
        showCheckBoxesMode: 'selectAll'
    });

    assert.strictEqual($treeView.find('.dx-treeview-select-all-item').dxCheckBox('instance').option('value'), true);
});

QUnit.test('\'selectAll\' should work correctly when nested items are not rendered', function(assert) {
    var $treeView = initTree({
            items: [
                { id: 1, text: 'Item 1', items: [{ id: 3, text: 'Item 3' }] }, { id: 2, text: 'Item 2' }],
            showCheckBoxesMode: 'selectAll'
        }),
        $selectAllItem = $treeView.find('.dx-treeview-select-all-item');

    $selectAllItem.trigger('dxclick');

    var items = $treeView.find('.dx-treeview-node-container .dx-checkbox-checked');

    assert.strictEqual($selectAllItem.dxCheckBox('instance').option('value'), true);
    assert.equal(items.length, 2);
});

QUnit.test('\'selectAll\' should work correctly when nested items are rendered', function(assert) {
    var $treeView = initTree({
            items: [
                { id: 1, text: 'Item 1', items: [{ id: 3, text: 'Item 3' }] }, { id: 2, text: 'Item 2' }],
            showCheckBoxesMode: 'selectAll'
        }),
        $selectAllItem = $treeView.find('.dx-treeview-select-all-item');

    $treeView.find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).trigger('dxclick');
    $selectAllItem.trigger('dxclick');

    var items = $treeView.find('.dx-treeview-node-container .dx-checkbox-checked');

    assert.strictEqual($selectAllItem.dxCheckBox('instance').option('value'), true);
    assert.equal(items.length, 3);
});

QUnit.test('\'selectAll\' should work correctly when nested items are rendered after click on \'selectAll\' item', function(assert) {
    var $treeView = initTree({
            items: [
                { id: 1, text: 'Item 1', items: [{ id: 3, text: 'Item 3' }] }, { id: 2, text: 'Item 2' }],
            showCheckBoxesMode: 'selectAll'
        }),
        $selectAllItem = $treeView.find('.dx-treeview-select-all-item');

    $selectAllItem.trigger('dxclick');
    $treeView.find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).trigger('dxclick');

    var items = $treeView.find('.dx-treeview-node-container .dx-checkbox-checked');

    assert.strictEqual($selectAllItem.dxCheckBox('instance').option('value'), true);
    assert.equal(items.length, 3);
});
