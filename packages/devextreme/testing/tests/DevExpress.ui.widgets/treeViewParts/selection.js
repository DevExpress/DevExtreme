import $ from 'jquery';
import keyboardMock from '../../../helpers/keyboardMock.js';
import eventsEngine from 'common/core/events/core/events_engine';
import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';

const { module, test } = QUnit;

const createInstance = (options) => new TreeViewTestWrapper(options);

module('selection common', () => {
    test('selection should work without checkboxes on init', function() {
        const items = [{ text: 'item 1', selected: true }, { text: 'item 2' }];
        const treeView = createInstance({
            items: items,
            showCheckBoxesMode: 'none'
        });

        treeView.checkSelected([0], items);
    });

    test('selection methods should work with item keys', function() {
        const items = [{ text: 'item 1', selected: true }, { text: 'item 2' }];
        const treeView = createInstance({
            items: items
        });

        treeView.instance.unselectItem(1);
        treeView.checkSelected([], items);

        treeView.instance.selectItem(2);
        treeView.checkSelected([1], items);
    });

    test('selection methods should work with itemElements', function() {
        const items = [{ text: 'item 1', selected: true }, { text: 'item 2' }];
        const treeView = createInstance({
            items: items
        });

        treeView.instance.unselectItem(treeView.getItems(treeView.getNodes().eq(0)).eq(0));
        treeView.checkSelected([], items);

        treeView.instance.selectItem(treeView.getItems(treeView.getNodes().eq(1)).eq(0));
        treeView.checkSelected([1], items);
    });

    test('selection methods should work with dom itemElements', function(assert) {
        const items = [{ text: 'item 1', selected: true }, { text: 'item 2' }];
        const treeView = createInstance({
            items: items
        });

        treeView.instance.unselectItem(treeView.getItems(treeView.getNodes().eq(0)).eq(0).get(0));
        treeView.checkSelected([], items);

        treeView.instance.selectItem(treeView.getItems(treeView.getNodes().eq(1)).eq(0).get(0));
        treeView.checkSelected([1], items);
    });

    test('selectionChanged should fire only when selection was changed', function(assert) {
        const selectionChangedHandler = sinon.spy();
        const items = [{ text: 'item 1', selected: true }, { text: 'item 2', items: [{ text: 'item 21' }] }];
        const treeView = createInstance({
            items: items,
            selectNodesRecursive: true,
            onSelectionChanged: selectionChangedHandler
        });

        treeView.instance.selectItem(1);
        treeView.instance.selectItem(2);
        treeView.instance.unselectItem(1);

        treeView.checkSelectedNodes([1]);
        assert.equal(selectionChangedHandler.callCount, 2, 'selectionChanged should call twice');
    });

    test('onItemSelectionChanged should have correct arguments', function(assert) {
        const itemSelectionChangedHandler = sinon.spy();
        const treeView = createInstance({
            items: [{ text: 'Item 1', id: 2 }],
            onItemSelectionChanged: itemSelectionChangedHandler
        });

        treeView.instance.selectItem(2);

        assert.equal(itemSelectionChangedHandler.callCount, 1, 'selection was changed once');
        // note: other parameters are redundant but they were saved in the code to prevent a BC
        assert.equal(itemSelectionChangedHandler.getCall(0).args[0].component.NAME, treeView.instance.NAME, 'component is correct');
        assert.ok(treeView.hasWidgetClass($(itemSelectionChangedHandler.getCall(0).args[0].element)), 'element is correct');
        assert.equal(itemSelectionChangedHandler.getCall(0).args[0].node.key, 2, 'node is correct');
        assert.ok(treeView.hasItemClass($(itemSelectionChangedHandler.getCall(0).args[0].itemElement)), 'itemElement is correct');
    });

    test('itemSelected should fire when select', function(assert) {
        const itemSelectionChangedHandler = sinon.spy();

        const items = [{ text: 'item 1', selected: true }, { text: 'item 2' }];
        const treeView = createInstance({
            items: items,
            onItemSelectionChanged: itemSelectionChangedHandler
        });

        treeView.instance.selectItem(2);

        treeView.checkSelected([0, 1], items);
        assert.equal(itemSelectionChangedHandler.callCount, 1, 'event was fired');
    });

    test('itemSelected should not fire when selection was not changed', function(assert) {
        const itemSelectionChangedHandler = sinon.spy();

        const items = [{ text: 'item 1', selected: true }, { text: 'item 2' }];
        const treeView = createInstance({
            items: items,
            onItemSelectionChanged: itemSelectionChangedHandler
        });

        treeView.instance.selectItem(1);

        treeView.checkSelected([0], items);
        assert.equal(itemSelectionChangedHandler.callCount, 0, 'event was not fired');
    });

    test('disabled item should be selectable via api', function(assert) {
        const items = [{ text: 'item 1', disabled: true }, { text: 'item 2', disabled: true, selected: true }];
        const treeView = createInstance({
            items: items,
            showCheckBoxesMode: 'normal'
        });

        treeView.instance.selectItem(1);
        treeView.checkSelected([0, 1], items);

        treeView.instance.unselectItem(1);
        treeView.checkSelected([1], items);
    });

    test('all nodes should have selected class if they have selected property', function(assert) {
        const items = [{ text: 'item 1', selected: true, expanded: true, items: [{ text: 'item 11', selected: true }] }, { text: 'item 2', selected: true }];
        const treeView = createInstance({
            items: items,
            showCheckBoxesMode: 'none'
        });

        treeView.checkSelected([0, 1, 2], items);
        assert.equal(treeView.getSelectedNodes().length, 3, 'all nodes should have selected class');
    });

    test('should not fire an error when try to select unspecified item', function(assert) {
        const items = [{ text: 'item 1', selected: true, expanded: true, items: [{ text: 'item 11', selected: true }] }, { text: 'item 2', selected: true }];
        const treeView = createInstance({ items: items });

        try {
            treeView.instance.selectItem(null);
        } catch(e) {
            assert.notOk(true, 'Error has been raised');
        } finally {
            assert.ok(true);
        }
    });

    test('should not fire an error when item contains \'nodeType\' field', function(assert) {
        const treeView = createInstance({ items: [{ id: 1, nodeType: 'test' }] });

        try {
            treeView.instance.selectItem({ id: 1, nodeType: 'test' });
        } catch(e) {
            assert.notOk(true, 'Error has been raised');
        } finally {
            assert.ok(true);
        }
    });

    [
        { items: [{ id: 0, visible: false, selected: false }, { id: 1, visible: false, selected: false }], action: (tree) => tree.selectItem(0), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: false }, { id: 1, visible: false, selected: false }], action: (tree) => tree.selectItem(1), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: false }, { id: 1, visible: false, selected: true }], action: (tree) => tree.selectItem(0), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: false }, { id: 1, visible: false, selected: true }], action: (tree) => tree.selectItem(1), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: false }, { id: 1, visible: true, selected: false }], action: (tree) => tree.selectItem(0), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: false }, { id: 1, visible: true, selected: false }], action: (tree) => tree.selectItem(1), expectedResult: true, expectedKeys: [1] },
        { items: [{ id: 0, visible: false, selected: false }, { id: 1, visible: true, selected: true }], action: (tree) => tree.selectItem(0), expectedResult: false, expectedKeys: [1] },
        { items: [{ id: 0, visible: false, selected: false }, { id: 1, visible: true, selected: true }], action: (tree) => tree.selectItem(1), expectedResult: true, expectedKeys: [1] },
        { items: [{ id: 0, visible: false, selected: true }, { id: 1, visible: false, selected: false }], action: (tree) => tree.selectItem(0), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: true }, { id: 1, visible: false, selected: false }], action: (tree) => tree.selectItem(1), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: true }, { id: 1, visible: false, selected: true }], action: (tree) => tree.selectItem(0), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: true }, { id: 1, visible: false, selected: true }], action: (tree) => tree.selectItem(1), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: true }, { id: 1, visible: true, selected: false }], action: (tree) => tree.selectItem(0), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: true }, { id: 1, visible: true, selected: false }], action: (tree) => tree.selectItem(1), expectedResult: true, expectedKeys: [1] },
        { items: [{ id: 0, visible: false, selected: true }, { id: 1, visible: true, selected: true }], action: (tree) => tree.selectItem(0), expectedResult: false, expectedKeys: [1] },
        { items: [{ id: 0, visible: false, selected: true }, { id: 1, visible: true, selected: true }], action: (tree) => tree.selectItem(1), expectedResult: true, expectedKeys: [1] },
        { items: [{ id: 0, visible: true, selected: false }, { id: 1, visible: false, selected: false }], action: (tree) => tree.selectItem(0), expectedResult: true, expectedKeys: [0] },
        { items: [{ id: 0, visible: true, selected: false }, { id: 1, visible: false, selected: false }], action: (tree) => tree.selectItem(1), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: true, selected: false }, { id: 1, visible: false, selected: true }], action: (tree) => tree.selectItem(0), expectedResult: true, expectedKeys: [0] },
        { items: [{ id: 0, visible: true, selected: false }, { id: 1, visible: false, selected: true }], action: (tree) => tree.selectItem(1), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: true, selected: false }, { id: 1, visible: true, selected: false }], action: (tree) => tree.selectItem(0), expectedResult: true, expectedKeys: [0] },
        { items: [{ id: 0, visible: true, selected: false }, { id: 1, visible: true, selected: false }], action: (tree) => tree.selectItem(1), expectedResult: true, expectedKeys: [1] },
        { items: [{ id: 0, visible: true, selected: false }, { id: 1, visible: true, selected: true }], action: (tree) => tree.selectItem(0), expectedResult: true, expectedKeys: [0] },
        { items: [{ id: 0, visible: true, selected: false }, { id: 1, visible: true, selected: true }], action: (tree) => tree.selectItem(1), expectedResult: true, expectedKeys: [1] },
        { items: [{ id: 0, visible: true, selected: true }, { id: 1, visible: false, selected: false }], action: (tree) => tree.selectItem(0), expectedResult: true, expectedKeys: [0] },
        { items: [{ id: 0, visible: true, selected: true }, { id: 1, visible: false, selected: false }], action: (tree) => tree.selectItem(1), expectedResult: false, expectedKeys: [0] },
        { items: [{ id: 0, visible: true, selected: true }, { id: 1, visible: false, selected: true }], action: (tree) => tree.selectItem(0), expectedResult: true, expectedKeys: [0] },
        { items: [{ id: 0, visible: true, selected: true }, { id: 1, visible: false, selected: true }], action: (tree) => tree.selectItem(1), expectedResult: false, expectedKeys: [0] },
        { items: [{ id: 0, visible: true, selected: true }, { id: 1, visible: true, selected: false }], action: (tree) => tree.selectItem(0), expectedResult: true, expectedKeys: [0] },
        { items: [{ id: 0, visible: true, selected: true }, { id: 1, visible: true, selected: false }], action: (tree) => tree.selectItem(1), expectedResult: true, expectedKeys: [1] },
        { items: [{ id: 0, visible: true, selected: true }, { id: 1, visible: true, selected: true }], action: (tree) => tree.selectItem(0), expectedResult: true, expectedKeys: [0] },
        { items: [{ id: 0, visible: true, selected: true }, { id: 1, visible: true, selected: true }], action: (tree) => tree.selectItem(1), expectedResult: true, expectedKeys: [1] }
    ].forEach((config) => {
        test(`Select hidden node. SelectionMode: single, items: ${JSON.stringify(config.items)}, action: ${config.action.toString()} (T982103)`, function(assert) {
            const wrapper = createInstance({
                selectionMode: 'single',
                items: config.items
            });


            const result = config.action(wrapper.instance);
            assert.equal(result, config.expectedResult, 'result is correct');
            wrapper.checkSelectedKeys(config.expectedKeys, 'item1 is selected');
        });
    });

    [
        { items: [{ id: 0, visible: false, selected: false }, { id: 1, visible: false, selected: false }], action: (tree) => tree.selectItem(0), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: false }, { id: 1, visible: false, selected: false }], action: (tree) => tree.selectItem(1), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: false }, { id: 1, visible: false, selected: true }], action: (tree) => tree.selectItem(0), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: false }, { id: 1, visible: false, selected: true }], action: (tree) => tree.selectItem(1), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: false }, { id: 1, visible: true, selected: false }], action: (tree) => tree.selectItem(0), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: false }, { id: 1, visible: true, selected: false }], action: (tree) => tree.selectItem(1), expectedResult: true, expectedKeys: [1] },
        { items: [{ id: 0, visible: false, selected: false }, { id: 1, visible: true, selected: true }], action: (tree) => tree.selectItem(0), expectedResult: false, expectedKeys: [1] },
        { items: [{ id: 0, visible: false, selected: false }, { id: 1, visible: true, selected: true }], action: (tree) => tree.selectItem(1), expectedResult: true, expectedKeys: [1] },
        { items: [{ id: 0, visible: false, selected: true }, { id: 1, visible: false, selected: false }], action: (tree) => tree.selectItem(0), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: true }, { id: 1, visible: false, selected: false }], action: (tree) => tree.selectItem(1), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: true }, { id: 1, visible: false, selected: true }], action: (tree) => tree.selectItem(0), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: true }, { id: 1, visible: false, selected: true }], action: (tree) => tree.selectItem(1), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: true }, { id: 1, visible: true, selected: false }], action: (tree) => tree.selectItem(0), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: false, selected: true }, { id: 1, visible: true, selected: false }], action: (tree) => tree.selectItem(1), expectedResult: true, expectedKeys: [1] },
        { items: [{ id: 0, visible: false, selected: true }, { id: 1, visible: true, selected: true }], action: (tree) => tree.selectItem(0), expectedResult: false, expectedKeys: [1] },
        { items: [{ id: 0, visible: false, selected: true }, { id: 1, visible: true, selected: true }], action: (tree) => tree.selectItem(1), expectedResult: true, expectedKeys: [1] },
        { items: [{ id: 0, visible: true, selected: false }, { id: 1, visible: false, selected: false }], action: (tree) => tree.selectItem(0), expectedResult: true, expectedKeys: [0] },
        { items: [{ id: 0, visible: true, selected: false }, { id: 1, visible: false, selected: false }], action: (tree) => tree.selectItem(1), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: true, selected: false }, { id: 1, visible: false, selected: true }], action: (tree) => tree.selectItem(0), expectedResult: true, expectedKeys: [0] },
        { items: [{ id: 0, visible: true, selected: false }, { id: 1, visible: false, selected: true }], action: (tree) => tree.selectItem(1), expectedResult: false, expectedKeys: [] },
        { items: [{ id: 0, visible: true, selected: false }, { id: 1, visible: true, selected: false }], action: (tree) => tree.selectItem(0), expectedResult: true, expectedKeys: [0] },
        { items: [{ id: 0, visible: true, selected: false }, { id: 1, visible: true, selected: false }], action: (tree) => tree.selectItem(1), expectedResult: true, expectedKeys: [1] },
        { items: [{ id: 0, visible: true, selected: false }, { id: 1, visible: true, selected: true }], action: (tree) => tree.selectItem(0), expectedResult: true, expectedKeys: [0, 1] },
        { items: [{ id: 0, visible: true, selected: false }, { id: 1, visible: true, selected: true }], action: (tree) => tree.selectItem(1), expectedResult: true, expectedKeys: [1] },
        { items: [{ id: 0, visible: true, selected: true }, { id: 1, visible: false, selected: false }], action: (tree) => tree.selectItem(0), expectedResult: true, expectedKeys: [0] },
        { items: [{ id: 0, visible: true, selected: true }, { id: 1, visible: false, selected: false }], action: (tree) => tree.selectItem(1), expectedResult: false, expectedKeys: [0] },
        { items: [{ id: 0, visible: true, selected: true }, { id: 1, visible: false, selected: true }], action: (tree) => tree.selectItem(0), expectedResult: true, expectedKeys: [0] },
        { items: [{ id: 0, visible: true, selected: true }, { id: 1, visible: false, selected: true }], action: (tree) => tree.selectItem(1), expectedResult: false, expectedKeys: [0] },
        { items: [{ id: 0, visible: true, selected: true }, { id: 1, visible: true, selected: false }], action: (tree) => tree.selectItem(0), expectedResult: true, expectedKeys: [0] },
        { items: [{ id: 0, visible: true, selected: true }, { id: 1, visible: true, selected: false }], action: (tree) => tree.selectItem(1), expectedResult: true, expectedKeys: [0, 1] },
        { items: [{ id: 0, visible: true, selected: true }, { id: 1, visible: true, selected: true }], action: (tree) => tree.selectItem(0), expectedResult: true, expectedKeys: [0, 1] },
        { items: [{ id: 0, visible: true, selected: true }, { id: 1, visible: true, selected: true }], action: (tree) => tree.selectItem(1), expectedResult: true, expectedKeys: [0, 1] }
    ].forEach((config) => {
        test(`Select hidden node. SelectionMode: multiple, items: ${JSON.stringify(config.items)}, action: ${config.action.toString()} (T982103)`, function(assert) {
            const wrapper = createInstance({
                selectionMode: 'multiple',
                items: config.items
            });


            const result = config.action(wrapper.instance);
            assert.equal(result, config.expectedResult, 'result is correct');
            wrapper.checkSelectedKeys(config.expectedKeys, 'item1 is selected');
        });
    });
});

module('Selection mode', () => {
    test('Selected: [node 1], single -> multiple, click(node 2)', function(assert) {
        const items = [{ text: 'item 1', selected: true }, { text: 'item 2' }];
        const treeView = createInstance({
            items: items,
            selectionMode: 'single',
            selectByClick: true,
            showCheckBoxesMode: 'normal'
        });

        treeView.checkSelected([0], items);

        treeView.instance.option('selectionMode', 'multiple');
        eventsEngine.trigger(treeView.getItems().eq(1), 'dxclick');

        treeView.checkSelected([0, 1], items);
    });

    test('Selected: [], multiple -> single, click(node 2)', function(assert) {
        const items = [{ text: 'item 1' }, { text: 'item 2' }];
        const treeView = createInstance({
            items: items,
            selectionMode: 'multiple',
            selectByClick: true,
            showCheckBoxesMode: 'normal'
        });

        eventsEngine.trigger(treeView.getItems().eq(0), 'dxclick');

        treeView.checkSelected([0], items);

        treeView.instance.option('selectionMode', 'single');
        eventsEngine.trigger(treeView.getItems().eq(1), 'dxclick');

        treeView.checkSelected([1], items);
    });

    test('Selected: [node 2], single -> multiple, click(node 1), selectNodesRecursive: false', function(assert) {
        const items = [{ id: 1, text: 'item 1', expanded: true, items: [{ id: 11, text: 'Item 11', selected: true }, { id: 12, text: 'Item 12' }] }];
        const treeView = createInstance({
            items: items,
            selectionMode: 'single',
            selectByClick: true,
            showCheckBoxesMode: 'normal',
            selectNodesRecursive: false
        });

        treeView.checkSelected([1], items);

        treeView.instance.option('selectionMode', 'multiple');
        eventsEngine.trigger(treeView.getItems().eq(0), 'dxclick');

        treeView.checkSelected([0, 1], items);
    });

    test('Selected: [node 2], single -> multiple, click(node 1), selectNodesRecursive: true', function(assert) {
        const items = [{ id: 1, text: 'item 1', expanded: true, items: [{ id: 11, text: 'Item 11', selected: true }, { id: 12, text: 'Item 12' }] }];
        const treeView = createInstance({
            items: items,
            selectionMode: 'single',
            selectByClick: true,
            showCheckBoxesMode: 'normal',
            selectNodesRecursive: true
        });

        treeView.checkSelected([1], items);

        treeView.instance.option('selectionMode', 'multiple');
        eventsEngine.trigger(treeView.getItems().eq(0), 'dxclick');

        treeView.checkSelected([0, 1, 2], items);
    });

    test('Selected nodes: [node 2, node 3], multiple -> single, selectNodesRecursive: false', function(assert) {
        const items = [{ id: 1, text: 'item 1', expanded: true, items: [{ id: 11, text: 'Item 11', selected: true }, { id: 12, text: 'Item 12', selected: true }] }];
        const treeView = createInstance({
            items: items,
            selectionMode: 'multiple',
            selectByClick: true,
            showCheckBoxesMode: 'normal',
            selectNodesRecursive: false
        });

        treeView.checkSelected([1, 2], items);

        treeView.instance.option('selectionMode', 'single');

        treeView.checkSelected([2], items);
    });

    test('Selected nodes: [node 1, node 2, node 3], multiple -> single, selectNodesRecursive: true', function(assert) {
        const items = [{ id: 1, text: 'item 1', expanded: true, items: [{ id: 11, text: 'Item 11', selected: true }, { id: 12, text: 'Item 12', selected: true }] }];
        const treeView = createInstance({
            items: items,
            selectionMode: 'multiple',
            selectByClick: true,
            showCheckBoxesMode: 'normal',
            selectNodesRecursive: true
        });

        treeView.checkSelected([0, 1, 2], items);

        treeView.instance.option('selectionMode', 'single');

        treeView.checkSelected([2], items);
    });
});

module('selection single', () => {
    test('only one node should be selected on init', function(assert) {
        const items = [{ text: 'item 1', selected: true }, { text: 'item 2', selected: true }];
        const treeView = createInstance({ items: items, selectionMode: 'single' });

        treeView.checkSelected([1], items);
    });

    test('only one node should be selected on selection change', function(assert) {
        const items = [{ text: 'item 1', selected: true }, { text: 'item 2' }];
        const treeView = createInstance({ items: items, selectionMode: 'single' });

        treeView.instance.selectItem(2);

        treeView.checkSelected([1], items);
    });

    test('last item should not be deselected when selectionRequired is used with checkboxes', function(assert) {
        const items = [{ id: 1, text: 'item 1', selected: true }];
        const treeView = createInstance({
            items: items,
            showCheckBoxesMode: 'normal',
            selectionMode: 'single',
            selectionRequired: true
        });

        const $checkBox = treeView.getCheckBoxes();

        eventsEngine.trigger($checkBox, 'dxclick');

        treeView.checkSelected([0], items);
        assert.deepEqual(treeView.instance.getSelectedNodeKeys(), [1], 'node was not removed from selected nodes array');
        assert.ok($checkBox.dxCheckBox('instance').option('value'), 'node\'s checkbox is still checked');
    });

    test('last item should not be deselected when selectionRequired is used without checkboxes', function(assert) {
        const items = [{ id: 1, text: 'item 1', selected: true }];
        const treeView = createInstance({
            items: items,
            showCheckBoxesMode: 'none',
            selectionMode: 'single',
            selectByClick: true,
            selectionRequired: true
        });

        const $item = treeView.getItems(treeView.getNodes());

        eventsEngine.trigger($item, 'dxclick');

        treeView.checkSelected([0], items);
        assert.deepEqual(treeView.instance.getSelectedNodeKeys(), [1], 'node was not removed from selected nodes array');
    });

    test('last item should not be deselected when selectionRequired is used with api', function(assert) {
        const items = [{ id: 1, text: 'item 1', selected: true }];
        const treeView = createInstance({
            items: items,
            showCheckBoxesMode: 'none',
            selectionMode: 'single',
            selectionRequired: true
        });

        treeView.instance.unselectItem(1);

        treeView.checkSelected([0], items);
        assert.deepEqual(treeView.instance.getSelectedNodeKeys(), [1], 'node was not removed from selected nodes array');
    });

    test('last item should not be deselected when selectionRequired is used with multiple selection', function(assert) {
        const items = [{ id: 1, text: 'item 1', selected: true }, { id: 2, text: 'item 2', selected: true }];
        const treeView = createInstance({
            items: items,
            showCheckBoxesMode: 'none',
            selectionMode: 'multiple',
            selectionRequired: true
        });

        treeView.instance.unselectItem(1);

        treeView.checkSelected([1], items);
        assert.deepEqual(treeView.instance.getSelectedNodeKeys(), [2], 'node was removed from selected nodes array');

        treeView.instance.unselectItem(2);
        treeView.checkSelected([1], items);
        assert.deepEqual(treeView.instance.getSelectedNodeKeys(), [2], 'node was not removed from selected nodes array');
    });

    test('last item should not be deselected when selectionRequired is used with recursive selection', function(assert) {
        const items = [{ id: 1, text: 'item 1', selected: true, expanded: true, items: [{ id: 11, text: 'Item 11' }] }];
        const treeView = createInstance({
            items: items,
            showCheckBoxesMode: 'none',
            selectionMode: 'multiple',
            selectNodesRecursive: true,
            selectionRequired: true
        });

        treeView.instance.unselectItem(1);
        treeView.checkSelected([0, 1], items);
        assert.deepEqual(treeView.instance.getSelectedNodeKeys(), [1, 11], 'all nodes are still in the selected array');
    });

    test('last item should not be deselected when selectionRequired is used with select all', function(assert) {
        const items = [{ id: 1, text: 'item 1', selected: true, expanded: true, items: [{ id: 11, text: 'Item 11' }] }, { id: 2, text: 'Item 2', selected: true }];
        const treeView = createInstance({
            items: items,
            selectionMode: 'multiple',
            selectNodesRecursive: true,
            selectionRequired: true
        });

        treeView.instance.unselectAll();

        treeView.checkSelected([2], items);
        assert.deepEqual(treeView.instance.getSelectedNodeKeys(), [2], 'last noder is still in the selected array');
    });

    test('selectByClick option should select item  by single click', function(assert) {
        const items = [{ text: 'item 1' }, { text: 'item 2' }];
        const treeView = createInstance({
            items: items,
            selectByClick: false,
            selectionMode: 'single'
        });

        treeView.instance.option('selectByClick', true);
        eventsEngine.trigger(treeView.getItems().eq(0), 'dxclick');

        treeView.checkSelected([0], items);
    });

    test('selectByClick selection should work correctly after runtime "showCheckBoxesMode" option change (T1190412)', function(assert) {
        const items = [{ text: 'item 1' }, { text: 'item 2' }];
        const treeView = createInstance({
            items: items,
            selectByClick: true,
        });

        treeView.instance.option('showCheckBoxesMode', 'selectAll');

        eventsEngine.trigger(treeView.getItems().eq(0), 'dxclick');

        treeView.checkSelected([0], items);
    });

    QUnit.test('expandEvent should work correctly after runtime "showCheckBoxesMode" option change', function(assert) {
        const items = [{ text: 'Item 1', items: [{ text: 'Item 11' }] }];
        const treeView = createInstance({
            items: items,
            expandEvent: 'click'
        });

        treeView.instance.option('showCheckBoxesMode', 'selectAll');

        eventsEngine.trigger(treeView.getItems().eq(0), 'dxclick');

        assert.ok(items[0].expanded);
    });

    test('selectByClick option should unselect item  by second click', function(assert) {
        const items = [{ text: 'item 1' }, { text: 'item 2' }];
        const treeView = createInstance({
            items: items,
            selectByClick: true,
            selectionMode: 'single'
        });

        eventsEngine.trigger(treeView.getItems().eq(0), 'dxclick');
        eventsEngine.trigger(treeView.getItems().eq(0), 'dxclick');

        treeView.checkSelected([], items);
    });

    test('selection can be prevented on itemClick', function(assert) {
        const items = [{ text: 'item 1' }, { text: 'item 2' }];
        const treeView = createInstance({
            items: items,
            selectByClick: true,
            selectionMode: 'single',
            onItemClick: function(e) {
                e.event.preventDefault();
            }
        });

        eventsEngine.trigger(treeView.getItems().eq(0), 'dxclick');
        treeView.checkSelected([], items);
    });

    test('selectNodesRecursive should be ignored when single selection is enabled', function(assert) {
        const items = [{ text: 'Item 1', expanded: true, items: [{ text: 'Item 11' }] }];
        const treeView = createInstance({
            items: items,
            selectionMode: 'single',
            selectByClick: true,
            selectNodesRecursive: true
        });

        eventsEngine.trigger(treeView.getItems().eq(0), 'dxclick');

        treeView.checkSelected([0], items);
    });

    test('selectNodesRecursive should work correct on option changing', function(assert) {
        const items = [{ id: 1, text: 'Item 1', expanded: true, items: [{ id: 11, text: 'Item 11', selected: true }] }];
        const treeView = createInstance({
            items: items,
            selectByClick: true,
            selectNodesRecursive: false
        });

        treeView.instance.option('selectNodesRecursive', true);
        treeView.checkSelected([0, 1], items);
    });

    test('onItemSelectionChanged event should be fired on unselect previosly selected item', function(assert) {
        const itemSelectionChangedHandler = sinon.spy();
        const treeView = createInstance({
            items: [{ text: 'item 1' }, { text: 'item 2' }],
            selectByClick: true,
            selectionMode: 'single',
            onItemSelectionChanged: itemSelectionChangedHandler
        });

        eventsEngine.trigger(treeView.getItems().eq(0), 'dxclick');
        eventsEngine.trigger(treeView.getItems().eq(1), 'dxclick');

        assert.equal(itemSelectionChangedHandler.callCount, 3, '\'onItemSelectionChanged\' event fires three times');
        assert.deepEqual(itemSelectionChangedHandler.getCall(1).args[0].itemData, { selected: false, text: 'item 1' }, 'itemSelectionChangedHandler.itemData');
    });

    test('item selection correctly reset when dataSource is filtered', function(assert) {
        const items = [{ text: 'item 1' }, { text: 'item 2' }];
        const treeView = createInstance({
            dataSource: items,
            selectionMode: 'single',
            showCheckBoxesMode: 'normal',
            searchExpr: 'text',
            searchEnabled: true,
        });

        treeView.instance.option('searchValue', '2');
        eventsEngine.trigger(treeView.getCheckBoxes(), 'dxclick');
        treeView.instance.option('searchValue', '1');
        eventsEngine.trigger(treeView.getCheckBoxes(), 'dxclick');
        treeView.instance.option('searchValue', '');

        assert.equal(treeView.getAllSelectedCheckboxes().length, 1, 'There is only one checked checkBox');
        treeView.checkSelected([0], items);
    });

    test('items should be selectable after the search', function(assert) {
        const itemClickHandler = sinon.spy();
        const treeView = createInstance({
            dataSource: [{ text: 'Stores' }],
            searchEnabled: true,
            searchTimeout: 0,
            selectionMode: 'single',
            onItemClick: itemClickHandler
        });
        const $input = treeView.getElement().find('.dx-texteditor-input');

        keyboardMock($input).type('s');
        eventsEngine.trigger(treeView.getItems().eq(0), 'dxclick');

        assert.equal(itemClickHandler.callCount, 1, 'click works');
    });
});
