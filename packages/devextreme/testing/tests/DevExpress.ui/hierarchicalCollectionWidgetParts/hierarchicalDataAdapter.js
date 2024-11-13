import $ from 'jquery';
import HierarchicalDataAdapter from '__internal/ui/hierarchical_collection/m_data_adapter';
import { processRequestResultLock } from 'common/data/utils';
import HierarchicalCollectionTestHelper from './hierarchicalCollectionTestHelper.js';
import errors from 'ui/widget/ui.errors';

const { module, test } = QUnit;

let helper;

const moduleConfig = {
    beforeEach() {
        helper = new HierarchicalCollectionTestHelper();
    }
};

module('plain structure', moduleConfig, () => {
    test('all items should be converted', function(assert) {
        const items = helper.plainData;

        const dataAdapter = helper.initDataAdapter({ items: items, dataType: 'plain' });
        const data = dataAdapter.getData();

        assert.equal(data.length, 7, 'all items was converted');
    });

    test('parent keys should be correct', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.plainData, dataType: 'plain' });
        const data = dataAdapter.getData();

        assert.equal(data[0].internalFields.parentKey, 0);
        assert.equal(data[2].internalFields.parentKey, 1);
        assert.equal(data[3].internalFields.parentKey, 2);
    });

    test('children keys should be correct', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.plainData, dataType: 'plain' });
        const data = dataAdapter.getData();

        assert.deepEqual(data[0].internalFields.childrenKeys, [2, 3]);
        assert.deepEqual(data[1].internalFields.childrenKeys, [4, 5]);
    });

    test('items should be correct', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.plainData, dataType: 'plain' });
        const data = dataAdapter.getData();

        assert.deepEqual(data[0].internalFields.item, helper.plainData[0]);
        assert.deepEqual(data[1].internalFields.item, helper.plainData[1]);
    });

    test('item fields should exist in the node', function(assert) {
        helper.plainData[0].custom = 'Custom item field';

        const dataAdapter = helper.initDataAdapter({ items: helper.plainData, dataType: 'plain' });
        const data = dataAdapter.getData();

        assert.equal(data[0].custom, 'Custom item field');
    });

    test('data adapter should throw an error when id is not unique', function(assert) {
        assert.throws(
            function() {
                helper.initDataAdapter({
                    items: [{ id: 1, text: 'Item 1' }, { id: 1, text: 'Item 11' }],
                    dataType: 'plain'
                });
            },
            errors.Error('E1040', '1'),
            'raised error is correct'
        );
    });

    test('assessor fields should exist even they are not exist in the item', function(assert) {
        delete helper.plainData[0].selected;
        delete helper.plainData[0].expanded;
        delete helper.plainData[0].disabled;

        const dataAdapter = helper.initDataAdapter({ items: helper.plainData, dataType: 'plain' });
        const data = dataAdapter.getData();

        assert.strictEqual(data[0].internalFields.selected, false, 'selected exist');
        assert.strictEqual(data[0].internalFields.expanded, false, 'expanded exist');
        assert.strictEqual(data[0].internalFields.disabled, false, 'disabled exist');
    });

    test('public node should exist in internalFields', function(assert) {

        const dataAdapter = helper.initDataAdapter({ items: helper.treeDataWithKeys });
        const data = dataAdapter.getData();

        assert.ok(Object.keys(data[0].internalFields.publicNode).length, 'publicNode is not empty');
    });
});


module('tree structure with keys', moduleConfig, () => {
    test('all items should be converted', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.treeDataWithKeys });
        const data = dataAdapter.getData();

        assert.equal(data.length, 7, 'all items was converted');
    });

    test('parent keys should be correct', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.treeDataWithKeys });
        const data = dataAdapter.getData();

        assert.equal(data[0].internalFields.parentKey, 0);
        assert.equal(data[1].internalFields.parentKey, 1);
        assert.equal(data[2].internalFields.parentKey, 2);
    });

    test('children keys should be correct', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.treeDataWithKeys });
        const data = dataAdapter.getData();

        assert.deepEqual(data[0].internalFields.childrenKeys, [2, 5]);
        assert.deepEqual(data[1].internalFields.childrenKeys, [3, 4]);
    });

    test('items should be correct', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.treeDataWithKeys });
        const data = dataAdapter.getData();

        assert.deepEqual(data[0].internalFields.item, helper.treeDataWithKeys[0]);
        assert.deepEqual(data[1].internalFields.item, helper.treeDataWithKeys[0].items[0]);
    });

    test('item fields should exist in the node', function(assert) {
        helper.treeDataWithKeys[0].custom = 'Custom item field';

        const dataAdapter = helper.initDataAdapter({ items: helper.treeDataWithKeys });
        const data = dataAdapter.getData();

        assert.equal(data[0].custom, 'Custom item field');
    });

    test('assessor fields should exist even they are not exist in the item', function(assert) {
        delete helper.plainData[0].selected;
        delete helper.plainData[0].expanded;
        delete helper.plainData[0].disabled;

        const dataAdapter = helper.initDataAdapter({ items: helper.treeDataWithKeys });
        const data = dataAdapter.getData();

        assert.strictEqual(data[0].internalFields.selected, false, 'selected exist');
        assert.strictEqual(data[0].internalFields.expanded, false, 'expanded exist');
        assert.strictEqual(data[0].internalFields.disabled, false, 'disabled exist');
    });

    test('public node should exist in internalFields', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.treeDataWithKeys });
        const data = dataAdapter.getData();

        assert.ok(Object.keys(data[0].internalFields.publicNode).length, 'publicNode is not empty');
    });

    test('dataAdapter should work correct with circular data', function(assert) {
        const parent = {
            id: 1,
            items: []
        };
        const child1 = {
            id: 11,
            parent: parent
        };

        parent.items.push(child1);

        const dataAdapter = helper.initDataAdapter({ items: [parent] });
        const data = dataAdapter.getData();

        assert.equal(data.length, 2, 'circular items were converted');
    });
});


module('tree structure without keys', moduleConfig, () => {
    test('all items should be converted', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.treeDataWithoutKeys });
        const data = dataAdapter.getData();

        assert.equal(data.length, 7, 'all items was converted');
    });

    test('parent keys should be correct', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.treeDataWithoutKeys });
        const data = dataAdapter.getData();

        assert.equal(data[0].internalFields.parentKey, 0);
        assert.equal(data[1].internalFields.parentKey, 1);
        assert.equal(data[2].internalFields.parentKey, 2);
    });

    test('children keys should be correct', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.treeDataWithoutKeys });
        const data = dataAdapter.getData();

        assert.deepEqual(data[0].internalFields.childrenKeys, [2, 5]);
        assert.deepEqual(data[1].internalFields.childrenKeys, [3, 4]);
    });

    test('items should be correct', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.treeDataWithoutKeys });
        const data = dataAdapter.getData();

        assert.deepEqual(data[0].internalFields.item, helper.treeDataWithoutKeys[0]);
        assert.deepEqual(data[1].internalFields.item, helper.treeDataWithoutKeys[0].items[0]);
    });

    test('item fields should exist in the node', function(assert) {
        helper.treeDataWithoutKeys[0].custom = 'Custom item field';

        const dataAdapter = helper.initDataAdapter({ items: helper.treeDataWithoutKeys });
        const data = dataAdapter.getData();

        assert.equal(data[0].custom, 'Custom item field');
    });

    test('assessor fields should exist even they are not exist in the item', function(assert) {
        delete helper.treeDataWithoutKeys[0].selected;
        delete helper.treeDataWithoutKeys[0].expanded;
        delete helper.treeDataWithoutKeys[0].disabled;

        const dataAdapter = helper.initDataAdapter({ items: helper.treeDataWithoutKeys });
        const data = dataAdapter.getData();

        assert.strictEqual(data[0].internalFields.selected, false, 'selected exist');
        assert.strictEqual(data[0].internalFields.expanded, false, 'expanded exist');
        assert.strictEqual(data[0].internalFields.disabled, false, 'disabled exist');
    });

    test('public node should exist in internalFields', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.treeDataWithoutKeys });
        const data = dataAdapter.getData();

        assert.ok(Object.keys(data[0].internalFields.publicNode).length, 'publicNode is not empty');
    });
});


module('tree structure with object instances', moduleConfig, () => {
    test('all items should be converted', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.getTreeDataWithObjects() });
        const data = dataAdapter.getData();

        assert.equal(data.length, 4, 'all items was converted');
    });

    test('parent keys should be correct', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.getTreeDataWithObjects() });
        const data = dataAdapter.getData();

        assert.equal(data[0].internalFields.parentKey, 0);
        assert.equal(data[1].internalFields.parentKey, 1);
        assert.equal(data[2].internalFields.parentKey, 1);
    });

    test('children keys should be correct', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.getTreeDataWithObjects() });
        const data = dataAdapter.getData();

        assert.deepEqual(data[0].internalFields.childrenKeys, [2, 3]);
        assert.deepEqual(data[1].internalFields.childrenKeys, []);
    });

    test('items should be correct', function(assert) {
        const items = helper.getTreeDataWithObjects();

        const dataAdapter = helper.initDataAdapter({ items: items });
        const data = dataAdapter.getData();

        assert.deepEqual(data[0].internalFields.item, items[0]);
        assert.deepEqual(data[1].internalFields.item, items[0].items[0]);
    });

    test('item fields should exist in the node', function(assert) {
        const items = helper.getTreeDataWithObjects();

        items[0].custom = 'Custom item field';

        const dataAdapter = helper.initDataAdapter({ items: items });
        const data = dataAdapter.getData();

        assert.equal(data[0].custom, 'Custom item field');
    });

    test('assessor fields should exist even they are not exist in the item', function(assert) {
        delete helper.getTreeDataWithObjects()[0].selected;
        delete helper.getTreeDataWithObjects()[0].expanded;
        delete helper.getTreeDataWithObjects()[0].disabled;

        const dataAdapter = helper.initDataAdapter({ items: helper.getTreeDataWithObjects() });
        const data = dataAdapter.getData();

        assert.strictEqual(data[0].internalFields.selected, false, 'selected exist');
        assert.strictEqual(data[0].internalFields.expanded, false, 'expanded exist');
        assert.strictEqual(data[0].internalFields.disabled, false, 'disabled exist');
    });

    test('public node should exist in internalFields', function(assert) {

        const dataAdapter = helper.initDataAdapter({ items: helper.getTreeDataWithObjects() });
        const data = dataAdapter.getData();

        assert.ok(Object.keys(data[0].internalFields.publicNode).length, 'publicNode is not empty');
    });
});

module('public methods', moduleConfig, () => {
    test('getTreeNodes', function(assert) {
        helper.plainData[3].isSelected = true;
        helper.plainData[5].isSelected = true;

        helper.plainData[6].isDisabled = true;
        helper.plainData[4].isDisabled = true;

        helper.plainData[0].isExpanded = true;
        helper.plainData[1].isExpanded = true;

        const accessors = {
            getters: {
                selected: function(item) { return item.isSelected; },
                display: function(item) { return item.caption; },
                expanded: function(item) { return item.isExpanded; },
                disabled: function(item) { return item.isDisabled; },
                parentKey: function(item) { return item.parentId; },
                key: function(item) { return item.id; },
                items: function(item) { return item.items; }
            },
            setters: {
                selected: function(item, value) { item.isSelected = value; },
                display: function(item, value) { item.caption = value; },
                expanded: function(item, value) { item.isExpanded = value; },
                disabled: function(item, value) { item.isDisabled = value; },
                parentKey: function(item, value) { item.parentId = value; },
                key: function(item, value) { item.id = value; },
                items: function(item, value) { item.items = value; }
            }
        };
        const dataAdapter = helper.initDataAdapter({ items: helper.plainData, dataAccessors: accessors, recursiveSelection: true, dataType: 'plain' });
        const nodes = dataAdapter.getTreeNodes();

        assert.ok(nodes[0].itemData.isExpanded, 'node is expanded');
        assert.ok(nodes[0].children[0].itemData.isExpanded, 'node is expanded');

        assert.ok(nodes[0].children[0].children[0].itemData.isSelected, 'node is selected');
        assert.strictEqual(nodes[0].children[0].itemData.isSelected, undefined, 'node is in undetermined state');
        assert.ok(nodes[1].itemData.isSelected, 'node is selected');

        assert.ok(nodes[1].children[0].itemData.isDisabled, 'node is disabled');
        assert.ok(nodes[0].children[0].children[1].itemData.isDisabled, 'node is disabled');

    });

    test('getTreeNodes if data was without keys', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.treeDataWithoutKeys });
        const treeNodes = dataAdapter.getTreeNodes();

        assert.equal(treeNodes[0].key, 1);
        assert.equal(treeNodes[1].key, 6);
        assert.equal(treeNodes.length, 2);
        assert.equal(treeNodes[0].children[0].children[0].key, 3);
        assert.equal(treeNodes[0].children[0].children.length, 2);
        assert.equal(treeNodes[0].children.length, 2);
    });

    test('getSelectedNodesKeys', function(assert) {
        helper.plainData[3].selected = true;
        helper.plainData[5].selected = true;

        const dataAdapter = helper.initDataAdapter({
            items: helper.plainData,
            recursiveSelection: true,
            dataType: 'plain'
        });
        const selectedNodes = [4, 6, 7];

        assert.deepEqual(dataAdapter.getSelectedNodesKeys(), selectedNodes, 'selected keys are correct');
    });

    test('getExpandedNodesKeys', function(assert) {
        helper.plainData[1].expanded = true;
        helper.plainData[2].expanded = true;
        helper.plainData[4].expanded = true;

        const dataAdapter = helper.initDataAdapter({ items: helper.plainData, dataType: 'plain' });
        const expandedNodes = [2, 3, 5];

        assert.deepEqual(dataAdapter.getExpandedNodesKeys(), expandedNodes, 'expanded keys are correct');
    });

    test('getNodeByItem', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.plainData, dataType: 'plain' });
        const node = dataAdapter.getNodeByItem(helper.plainData[1]);

        assert.deepEqual(node.text, 'Item 11', 'node is correct');
    });

    test('getNodesByItems', function(assert) {
        const items = helper.plainData;
        const dataAdapter = helper.initDataAdapter({ items: items, dataType: 'plain' });
        const nodes = dataAdapter.getNodesByItems(helper.plainData);

        for(let i = 0, n = helper.plainData.length; i < n; i++) {
            assert.deepEqual(nodes[i].internalFields.item, items[i], 'nodes[i] is correct');
        }
    });

    test('getNodeByKey', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.plainData, dataType: 'plain' });
        const node = dataAdapter.getNodeByKey(2);

        assert.deepEqual(node.text, 'Item 11', 'node is correct');
    });

    test('getItemsCount', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.plainData, dataType: 'plain' });

        assert.equal(dataAdapter.getItemsCount(), helper.plainData.length, 'items count is correct');
    });

    test('getVisibleItemsCount', function(assert) {
        helper.plainData[3].visible = false;
        const dataAdapter = helper.initDataAdapter({ items: helper.plainData });

        assert.equal(dataAdapter.getVisibleItemsCount(), helper.plainData.length - 1, 'items count is correct');
    });

    test('isAllSelected', function(assert) {

        let dataAdapter = helper.initDataAdapter({ items: helper.plainData, dataType: 'plain' });
        assert.strictEqual(dataAdapter.isAllSelected(), false, 'nothing is selected');

        $.each(helper.plainData, function(_, item) { item.selected = true; });

        dataAdapter = helper.initDataAdapter({ items: helper.plainData, dataType: 'plain' });
        assert.strictEqual(dataAdapter.isAllSelected(), true, 'all items are selected');

        helper.plainData[1].selected = false;
        dataAdapter = helper.initDataAdapter({ items: helper.plainData, dataType: 'plain' });
        assert.strictEqual(dataAdapter.isAllSelected(), undefined, 'not all items are selected');
    });

    test('selectAll', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.plainData, dataType: 'plain' });

        dataAdapter.toggleSelectAll(true);
        assert.ok(dataAdapter.isAllSelected(), 'all items are selected');

        dataAdapter.toggleSelectAll(false);
        assert.strictEqual(dataAdapter.isAllSelected(), false, 'nothing is selected');

        dataAdapter.toggleSelectAll(undefined);
        assert.strictEqual(helper.plainData[1].selected, false, 'undefined state change nothing');
    });

    test('toggleSelection', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.plainData, dataType: 'plain' });

        dataAdapter.toggleSelection(2, true);
        assert.ok(helper.plainData[1].selected, 'item was selected');

        dataAdapter.toggleSelection(2, false);
        assert.strictEqual(helper.plainData[1].selected, false, 'item was unselected');

        dataAdapter.toggleSelection(2, undefined);
        assert.strictEqual(helper.plainData[1].selected, undefined, 'item was set to undefined state');
    });

    test('toggleNodeDisabledState', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.plainData, dataType: 'plain' });

        dataAdapter.toggleNodeDisabledState(2, true);
        assert.ok(helper.plainData[1].disabled, 'item was disabled');

        dataAdapter.toggleNodeDisabledState(2, false);
        assert.strictEqual(helper.plainData[1].disabled, false, 'item was enabled');
    });

    test('toggleNodeDisabledState with expressions', function(assert) {
        const dataAdapter = helper.initDataAdapter({
            items: helper.plainData,
            dataType: 'plain',
            dataAccessors: helper.getCustomAccessors()
        });

        dataAdapter.toggleNodeDisabledState(2, true);
        assert.ok(helper.plainData[1].disable, 'item was disabled');

        dataAdapter.toggleNodeDisabledState(2, false);
        assert.strictEqual(helper.plainData[1].disable, false, 'item was enabled');
    });

    test('items accessor should be ignored if dataStructure is plain', function(assert) {
        const dataAdapter = helper.initDataAdapter({
            items: [
                { id: 1, parentId: 0, text: 'Item 1', items: [{ id: 11, parentId: 1, text: 'Item 11' }] },
                { id: 2, parentId: 0, text: 'Item 2' }
            ],
            dataType: 'plain'
        });

        assert.equal(dataAdapter.getData().length, 2, 'inner item should not be converted');
    });

    test('getRootNodes', function(assert) {
        const items = [];

        for(let i = 1; i <= 100; i++) {
            items.push({
                id: i,
                text: i.toString()
            });
        }

        items[0].items = [{ id: 200, text: 'child' }];

        const dataAdapter = helper.initDataAdapter({ items: items });

        assert.equal(dataAdapter.getData().length, 101);
        assert.equal(dataAdapter.getRootNodes().length, 100);
    });

    test('getRootNodes with deferred datasource (T310879)', function(assert) {
        const items = [{ id: 1, text: 'item 1' }];
        const dataAdapter = helper.initDataAdapter({ items: items });
        try {
            processRequestResultLock.obtain();
            assert.equal(dataAdapter.getRootNodes().length, 1);
        } finally {
            processRequestResultLock.release();
        }
    });

    test('getChildrenNodes', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.plainData, dataType: 'plain' });
        const children = dataAdapter.getChildrenNodes(1);

        assert.equal(children.length, 2, 'nodes count is correct');
        assert.equal(children[0].internalFields.key, 2, 'first node');
        assert.equal(children[1].internalFields.key, 3, 'second node');
    });

    test('addItem - root', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.plainData, dataType: 'plain' });
        const item = { id: 8, text: 'Item 3', parentId: 0 };

        dataAdapter.addItem(item);

        assert.equal(dataAdapter.getData().length, 8, 'node was added');
        assert.equal(dataAdapter.getRootNodes().length, 3, 'root node was added');
    });

    test('addItem - subLevel', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.plainData, dataType: 'plain' });
        const item = { id: 8, text: 'Item 1-3', parentId: 1 };

        dataAdapter.addItem(item);

        assert.equal(dataAdapter.getData().length, 8, 'node was added');
        assert.equal(dataAdapter.getChildrenNodes(1).length, 3, 'node was added at the correct level');
    });

    test('getFullData', function(assert) {
        const dataAdapter = helper.initDataAdapter({
            items: [
                { id: 1, parentId: 0, text: 'Cars' },
                { id: 2, parentId: 0, text: 'Bikes' },
                { id: 3, parentId: 0, text: 'Motobikes' }
            ],
            searchValue: 'ike',
        });

        assert.equal(dataAdapter.getData().length, 2, 'searched items');
        assert.equal(dataAdapter.getFullData().length, 3, 'initial items');
    });
});

module('getPublicNode method', moduleConfig, () => {
    test('public node should have correct accessor fields', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.treeDataWithoutKeys });
        const data = dataAdapter.getData();
        const publicNode = dataAdapter.getPublicNode(data[2]);

        assert.strictEqual(publicNode.disabled, false);
        assert.strictEqual(publicNode.expanded, false);
        assert.strictEqual(publicNode.selected, false);
        assert.equal(publicNode.items.length, 0);
    });

    test('public node should have correct item field', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.treeDataWithoutKeys });
        const data = dataAdapter.getData();
        const publicNode = dataAdapter.getPublicNode(data[5]);

        assert.deepEqual(publicNode.items[0].itemData, helper.getTreeDataWithoutKeys()[1].items[0]);
    });

    test('public node should have correct hierarchy', function(assert) {
        const dataAdapter = helper.initDataAdapter({ items: helper.treeDataWithoutKeys });
        const data = dataAdapter.getData();
        const publicNode = dataAdapter.getPublicNode(data[2]);

        assert.equal(publicNode.key, 3);
        assert.equal(publicNode.parent.key, 2);
        assert.equal(publicNode.parent.parent.key, 1);
        assert.strictEqual(publicNode.parent.parent.parent, null);
        assert.equal(publicNode.parent.children.length, 2);
        assert.equal(publicNode.parent.items.length, 2);
        assert.equal(publicNode.children.length, 0);
    });

    test('public node should depend on original node', function(assert) {
        helper.plainData[0].selected = true;

        const dataAdapter = helper.initDataAdapter({ items: helper.plainData });
        const data = dataAdapter.getData();
        const publicNode = dataAdapter.getPublicNode(data[0]);

        assert.strictEqual(publicNode.selected, true, 'public node is selected');

        dataAdapter.toggleSelection(1, false);

        assert.strictEqual(publicNode.selected, false, 'public node became unselected');
    });
});

module('selection', moduleConfig, () => {
    test('set recursive selection', function(assert) {
        helper.plainData[3].selected = true;
        helper.plainData[4].selected = true;
        helper.plainData[5].selected = true;

        const dataAdapter = helper.initDataAdapter({
            items: helper.plainData,
            recursiveSelection: true,
            dataType: 'plain'
        });
        const nodes = dataAdapter.getTreeNodes();

        assert.strictEqual(nodes[0].selected, undefined, 'item 1 is in undetermined state');
        assert.ok(nodes[0].items[0].selected, 'item 11 was selected');
        assert.ok(nodes[1].items[0].selected, 'item 21 was selected');
    });

    test('set recursive selection with random data', function(assert) {
        helper.randomData[1].selected = true;
        helper.randomData[2].selected = true;
        helper.randomData[3].selected = true;

        const dataAdapter = helper.initDataAdapter({
            items: helper.randomData,
            recursiveSelection: true,
            dataType: 'plain'
        });
        const nodes = dataAdapter.getTreeNodes();

        assert.strictEqual(nodes[1].selected, undefined, 'item 1 is in undetermined state');
        assert.ok(nodes[1].items[1].selected, 'item 11 was selected');
        assert.ok(nodes[0].items[0].selected, 'item 21 was selected');
    });

    test('set recursiveSelection false', function(assert) {
        helper.plainData[0].selected = true;

        helper.initDataAdapter({
            items: helper.plainData,
            recursiveSelection: false
        });

        assert.ok(helper.plainData[0].selected, 'node was selected');
        assert.ok(!helper.plainData[1].selected, 'child node was not selected');
    });

    test('set multipleSelection false', function(assert) {
        helper.plainData[0].selected = true;
        helper.plainData[3].selected = true;

        const dataAdapter = helper.initDataAdapter({
            items: helper.plainData,
            recursiveSelection: false,
            multipleSelection: false,
            dataType: 'plain'
        });

        assert.notOk(dataAdapter.getData()[0].internalFields.selected, 'node was unselected');
        assert.ok(dataAdapter.getData()[3].internalFields.selected, 'node was selected');
        assert.equal(dataAdapter.getSelectedNodesKeys(), 4, 'last item id was selected');
    });
});

module('expand', moduleConfig, () => {
    test('set simple expand', function(assert) {
        helper.plainData[1].expanded = true;

        helper.initDataAdapter({
            items: helper.plainData,
            recursiveExpansion: false,
            dataType: 'plain'
        });

        assert.ok(!helper.plainData[0].expanded, 'node was not expanded');
        assert.ok(helper.plainData[1].expanded, 'child node was expanded');
    });

    test('set recursive expand', function(assert) {
        helper.plainData[3].expanded = true;

        const dataAdapter = helper.initDataAdapter({
            items: helper.plainData,
            recursiveExpansion: true,
            dataType: 'plain'
        });
        const nodes = dataAdapter.getTreeNodes();

        assert.ok(nodes[0].expanded, 'node was expanded');
        assert.ok(nodes[0].items[0].expanded, 'node was expanded');
    });
});

module('Item\'s dependence from nodes', moduleConfig, () => {
    test('tree items with keys', function(assert) {
        helper.treeDataWithKeys[0].items[0].selected = true;
        helper.treeDataWithKeys[0].items[0].expanded = true;

        helper.initDataAdapter({
            items: helper.treeDataWithKeys,
            recursiveSelection: true,
            recursiveExpansion: true
        });

        assert.strictEqual(helper.treeDataWithKeys[0].selected, undefined, 'node was not selected');
        assert.ok(helper.treeDataWithKeys[0].items[0].items[0].selected, 'node was selected');
        assert.ok(helper.treeDataWithKeys[0].items[0].items[1].selected, 'node was selected');
        assert.ok(helper.treeDataWithKeys[0].items[0].expanded, 'node was expanded');
        assert.ok(helper.treeDataWithKeys[0].expanded, 'node was expanded');
    });

    test('tree items without keys', function(assert) {
        helper.treeDataWithoutKeys[0].items[0].selected = true;
        helper.treeDataWithoutKeys[0].items[0].expanded = true;

        helper.initDataAdapter({
            items: helper.treeDataWithoutKeys,
            recursiveSelection: true,
            recursiveExpansion: true
        });

        assert.strictEqual(helper.treeDataWithoutKeys[0].selected, undefined, 'node was not selected');
        assert.ok(helper.treeDataWithoutKeys[0].items[0].items[0].selected, 'node was selected');
        assert.ok(helper.treeDataWithoutKeys[0].items[0].items[1].selected, 'node was selected');
        assert.ok(helper.treeDataWithoutKeys[0].items[0].expanded, 'node was expanded');
        assert.ok(helper.treeDataWithoutKeys[0].expanded, 'node was expanded');
    });

    test('plain items', function(assert) {
        helper.plainData[1].selected = true;
        helper.plainData[1].expanded = true;

        helper.initDataAdapter({
            items: helper.plainData,
            recursiveSelection: true,
            recursiveExpansion: true,
            dataType: 'plain'
        });

        assert.strictEqual(helper.plainData[0].selected, undefined, 'node was not selected');
        assert.ok(helper.plainData[3].selected, 'node was selected');
        assert.ok(helper.plainData[4].selected, 'node was selected');
        assert.ok(helper.plainData[0].expanded, 'node was expanded');
    });
});

module('Expansion changing', moduleConfig, () => {
    test('collapse item', function(assert) {

        helper.plainData[1].expanded = true;

        const dataAdapter = helper.initDataAdapter({
            items: helper.plainData,
            recursiveExpansion: true,
            dataType: 'plain'
        });

        dataAdapter.toggleExpansion(1, false);

        assert.ok(!helper.plainData[0].expanded, 'node was collapsed');
        assert.deepEqual(dataAdapter.getExpandedNodesKeys(), [2], 'expanded array was updated');
    });

    test('expand item (recursive expansion)', function(assert) {
        const dataAdapter = helper.initDataAdapter({
            items: helper.plainData,
            recursiveExpansion: true,
            dataType: 'plain'
        });

        dataAdapter.toggleExpansion(4, true);

        assert.ok(helper.plainData[0].expanded, 'node was expanded');
        assert.ok(helper.plainData[1].expanded, 'node was expanded');
        assert.deepEqual(dataAdapter.getExpandedNodesKeys(), [1, 2, 4], 'expanded array was updated');
    });

    test('expand item (simple expansion)', function(assert) {
        const dataAdapter = helper.initDataAdapter({
            items: helper.plainData,
            recursiveExpansion: false,
            dataType: 'plain'
        });

        dataAdapter.toggleExpansion(2, true);

        assert.ok(!helper.plainData[0].expanded, 'node was not expanded');
        assert.ok(helper.plainData[1].expanded, 'child node was expanded');
        assert.deepEqual(dataAdapter.getExpandedNodesKeys(), [2], 'expanded array was updated');
    });
});

module('Search operation', moduleConfig, () => {
    test('It should be possible to find items that contain some substring', function(assert) {
        const dataAdapter = helper.initDataAdapter({
            items: [
                { id: 1, parentId: 0, text: 'Cars' },
                { id: 2, parentId: 0, text: 'Bikes' },
                { id: 3, parentId: 0, text: 'Motobikes' }
            ]
        });

        const result = dataAdapter.search('ike');

        assert.equal(result.length, 2, 'Two entries were found');
        assert.equal(result[0].internalFields.key, 2, 'The first entry is OK');
        assert.equal(result[1].internalFields.key, 3, 'The second entry is OK');
    });

    test('It should be possible to find items if text is set via expression', function(assert) {
        const accessors = {
            getters: {
                items: function(item) { return item['items']; },
                key: function(item) { return item['id']; },
                parentKey: function(item) { return item['parentId']; },
                expanded: function(item) { return item['expanded'] || false; },
                selected: function(item) { return item['selected'] || false; },
                disabled: function(item) { return item['disabled'] || false; },
                display: function(item) { return item['name'] || ''; }
            },
            setters: {
                items: function(item, value) { item['items'] = value; },
                key: function(item, value) { item['id'] = value; },
                parentKey: function(item, value) { item['parentId'] = value; },
                expanded: function(item, value) { item['expanded'] = value; },
                selected: function(item, value) { item['selected'] = value; },
                disabled: function(item, value) { item['disabled'] = value; },
                display: function(item, value) { item['name'] = value; }
            }
        };
        const items = [
            { id: 1, parentId: 0, name: 'Cars' },
            { id: 2, parentId: 0, name: 'Bikes' },
            { id: 3, parentId: 0, name: 'Motobikes' }
        ];
        const dataAdapter = new HierarchicalDataAdapter({ dataAccessors: accessors, items: items, dataType: 'plain' });

        const result = dataAdapter.search('ike');

        assert.equal(result.length, 2, 'Two entries were found');
        assert.equal(result[0].internalFields.key, 2, 'The first entry is OK');
        assert.equal(result[1].internalFields.key, 3, 'The second entry is OK');
    });

    test('Search should be case insensitive', function(assert) {
        const dataAdapter = helper.initDataAdapter({
            items: [
                { id: 1, parentId: 0, text: 'Cars' },
                { id: 2, parentId: 0, text: 'Bikes' },
                { id: 3, parentId: 0, text: 'Motobikes' }
            ],
            dataType: 'plain'
        });

        const result = dataAdapter.search('bike');

        assert.equal(result.length, 2, 'Two entries were found');
        assert.equal(result[0].internalFields.key, 2, 'The first entry is OK');
        assert.equal(result[1].internalFields.key, 3, 'The second entry is OK');
    });

    test('Empty array should be returned if the search isn\'t successful', function(assert) {
        const dataAdapter = helper.initDataAdapter({
            items: [
                { id: 1, parentId: 0, text: 'Cars' }
            ]
        });

        const result = dataAdapter.search('bla-bla-bla');

        assert.ok($.isArray(result), 'The result is array');
        assert.equal(result.length, 0, 'The result is empty');
    });

    test('Entry parents should be added to the search result', function(assert) {
        const dataAdapter = helper.initDataAdapter({
            items: [
                { id: 1, parentId: 0, text: 'Cars' },
                { id: 2, parentId: 0, text: 'Bikes' },
                { id: 3, parentId: 0, text: 'Motobikes' },
                { id: 4, parentId: 1, text: 'BMW' },
                { id: 5, parentId: 4, text: 'X1' },
                { id: 6, parentId: 4, text: 'X5' },
                { id: 7, parentId: 4, text: 'X6' },
                { id: 8, parentId: 2, text: 'Stels' },
                { id: 9, parentId: 3, text: 'Honda' },
                { id: 10, parentId: 3, text: 'Yamaha' },
                { id: 11, parentId: 10, text: 'YX 1' },
                { id: 12, parentId: 10, text: 'YX 2' }
            ],
            dataType: 'plain'
        });

        const result = dataAdapter.search('X');

        assert.equal(result.length, 9, 'Nine entries were found');
        assert.equal(result[0].text, 'Cars', 'The entry is OK');
        assert.equal(result[1].text, 'BMW', 'The entry is OK');
        assert.equal(result[2].text, 'X1', 'The entry is OK');
        assert.equal(result[3].text, 'X5', 'The entry is OK');
        assert.equal(result[4].text, 'X6', 'The entry is OK');
        assert.equal(result[5].text, 'Motobikes', 'The entry is OK');
        assert.equal(result[6].text, 'Yamaha', 'The entry is OK');
        assert.equal(result[7].text, 'YX 1', 'The entry is OK');
        assert.equal(result[8].text, 'YX 2', 'The entry is OK');
    });

    test('Parent nodes should be expanded', function(assert) {
        const dataAdapter = helper.initDataAdapter({
            items: [
                { id: 1, parentId: 0, text: 'Cars' },
                { id: 2, parentId: 0, text: 'Bikes' },
                { id: 3, parentId: 0, text: 'Motobikes' },
                { id: 4, parentId: 1, text: 'BMWX' },
                { id: 5, parentId: 4, text: 'X1' },
                { id: 6, parentId: 4, text: 'X5' },
                { id: 7, parentId: 4, text: 'X6' },
                { id: 8, parentId: 2, text: 'Stels' },
                { id: 9, parentId: 3, text: 'Honda' },
                { id: 10, parentId: 3, text: 'Yamaha' },
                { id: 11, parentId: 10, text: 'YX 1' },
                { id: 12, parentId: 10, text: 'YX 2' }
            ],
            dataType: 'plain'
        });

        const result = dataAdapter.search('X');

        assert.ok(result[0].internalFields.expanded, 'The \'Cars\' entry is expanded');
        assert.ok(result[1].internalFields.expanded, 'The \'BMWX\' entry is expanded');
        assert.ok(!result[2].internalFields.expanded, 'The \'X1\' entry is not expanded');
        assert.ok(!result[3].internalFields.expanded, 'The \'X5\' entry is not expanded');
        assert.ok(!result[4].internalFields.expanded, 'The \'X6\' entry is not expanded');
        assert.ok(result[5].internalFields.expanded, 'The \'Motobikes\' entry expanded');
        assert.ok(result[6].internalFields.expanded, 'The \'Yamaha\' entry not expanded');
        assert.ok(!result[7].internalFields.expanded, 'The \'YX 1\' entry is not expanded');
        assert.ok(!result[8].internalFields.expanded, 'The \'YX\' The entry is not expanded');
    });

    test('Search should work with warning when the parent node is lost', function(assert) {
        const items = [
            { id: 1, parentId: 0, text: 'Cars' },
            { id: 5, parentId: 154, text: 'X1' },
            { id: 6, parentId: 1, text: 'X5' }
        ];
        const warningHandler = sinon.spy(errors, 'log');

        try {
            const dataAdapter = helper.initDataAdapter({
                dataType: 'plain',
                items: items
            });

            dataAdapter.search('X');

            assert.equal(warningHandler.callCount, 1, 'warning has been called once');
            assert.equal(warningHandler.getCall(0).args[0], 'W1007', 'warning has correct error id');
            assert.equal(warningHandler.getCall(0).args[1], 154, 'warning has correct parentId');
            assert.equal(warningHandler.getCall(0).args[2], 5, 'warning has correct id');
        } finally {
            warningHandler.restore();
        }
    });

    test('Node changed should fire if any node was changed', function(assert) {
        const handler = sinon.spy();
        const dataAdapter = helper.initDataAdapter({
            items: [{ text: 'item 1', expanded: true, items: [{ text: 'item 11' }] }],
            dataType: 'tree',
            onNodeChanged: handler
        });
        const nodes = dataAdapter.getData();

        dataAdapter.toggleExpansion(1, false);

        assert.ok(handler.calledOnce, 'nodechanged was fired once');
        assert.ok(handler.calledWith(nodes[0]), 'node is correct');
    });

    test('Searching with special symbols should not crash the regular expression', function(assert) {
        const symbols = '[]{}()-+?*,.\\^$|#'.split('');

        const dataAdapter = helper.initDataAdapter({
            items: [{ text: 'item 1', expanded: true, items: [{ text: 'item 11' }] }],
            dataType: 'tree'
        });
        const breakingSymbols = [];

        $.each(symbols, function(_, symbol) {
            try {
                dataAdapter.search(symbol);
            } catch(e) {
                breakingSymbols.push(symbol);
            }
        });

        assert.deepEqual(breakingSymbols, [], 'breaking symbols array should be empty');
    });

    test('searchExpr is array', function(assert) {
        const items = [
            { key: 1, text: 'Item 1', value: 'test 3' },
            { key: 2, text: 'Item 2', value: 'test 3' },
            { key: 3, text: 'Item 3', value: 'test 1' }];
        const dataAdapter = helper.initDataAdapter({
            items: items,
            dataType: 'plain',
            searchExpr: ['value', 'text']
        });
        const result = dataAdapter.search('1');

        assert.equal(result.length, 2, 'count item');
    });

    test('search should consider simple sorting', function(assert) {
        const items = [
            { id: 1, parentId: 0, text: 'Bikes' },
            { id: 4, parentId: 3, text: 'BMW' },
            { id: 3, parentId: 0, text: 'Cars' },
            { id: 11, parentId: 10, text: 'YX 1' },
            { id: 12, parentId: 10, text: 'YX 2' },
            { id: 2, parentId: 0, text: 'Motobikes' },
            { id: 5, parentId: 4, text: 'X1' },
            { id: 6, parentId: 4, text: 'X5' },
            { id: 7, parentId: 4, text: 'X6' },
            { id: 10, parentId: 2, text: 'Yamaha' },
            { id: 8, parentId: 1, text: 'Stels' },
            { id: 9, parentId: 2, text: 'Honda' }
        ];
        const dataAdapter = helper.initDataAdapter({
            items: items,
            dataType: 'plain',
            sort: 'text',
            searchExpr: ['value', 'text']
        });
        const result = dataAdapter.search('1');
        const expectedValues = ['BMW', 'Cars', 'Motobikes', 'X1', 'Yamaha', 'YX 1'];

        $.each(result, function(index, item) {
            assert.equal(item.text, expectedValues[index], 'Correct item');
        });
    });

    test('search should consider sorting expression', function(assert) {
        const items = [
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
        ];
        const dataAdapter = helper.initDataAdapter({
            items: items,
            dataType: 'plain',
            sort: { field: 'text', desc: true },
            searchExpr: ['value', 'text']
        });
        const result = dataAdapter.search('1');
        const expectedValues = ['YX 1', 'Yamaha', 'X1', 'Motobikes', 'Cars', 'BMW', 'Audi', 'A1'];

        $.each(result, function(index, item) {
            assert.equal(item.text, expectedValues[index], 'Correct item');
        });
    });
});

