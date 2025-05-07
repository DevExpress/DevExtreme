/* global initTree */
import ArrayStore from 'common/data/array_store';
import { DataSource } from 'common/data/data_source/data_source';
import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';
import $ from 'jquery';
QUnit.module('Initialization', () => {
    QUnit.test('Init tree view', function(assert) {
        const $treeView = initTree();
        assert.ok($treeView);
    });

    function createOptions(options) {
        const result = $.extend({ dataStructure: 'plain', rootValue: 1 }, options);
        if(result.dataSourceOption === 'createChildren') {
            const createChildFunction = (parent) => {
                return parent == null
                    ? [ options.testItems[options.testRootItemIndex || 0] ]
                    : options.testItems.filter(function(item) { return parent.itemData.id === item.parentId; });
            };
            result.createChildren = createChildFunction;
        } else {
            result[options.dataSourceOption] = options.testItems;
        }
        return result;
    }

    ['items', 'dataSource', 'createChildren'].forEach((dataSourceOption) => {
        [false, true].forEach((virtualModeEnabled) => {
            ['single', 'multiple'].forEach(selectionMode => {
                [0, -1, 1.1, '0', 'aaa', null, undefined].forEach(rootValue => {
                    QUnit.test(`rootValue = ${rootValue}, dataSource: ${dataSourceOption}, virtualModeEnabled: ${virtualModeEnabled}`, function(assert) {
                        const options = createOptions({
                            selectionMode, dataSourceOption, virtualModeEnabled, rootValue, testItems: [
                                { id: 1, text: 'item1', parentId: rootValue },
                                { id: 2, text: 'item2', parentId: 1 }]
                        });

                        const wrapper = new TreeViewTestWrapper(options);
                        const $item1 = wrapper.getElement().find('[aria-level="1"]');

                        assert.notEqual(wrapper.instance, undefined);
                        assert.notEqual($item1.length, 0, 'item1 must be rendered');
                    });
                });

                QUnit.test(`Initialization with cycle/loop keys. DataSource: ${dataSourceOption}. VirtualModeEnabled: ${virtualModeEnabled} (T832760)`, function(assert) {
                    const configs = [
                        { rootValue: 1, expectedItemId: 2, rootItemIndex: 1 },
                        { rootValue: 2, expectedItemId: 3, rootItemIndex: 2 },
                        { rootValue: 3, expectedItemId: 1, rootItemIndex: 0 },
                        { rootValue: 0, expectedItemId: undefined, rootItemIndex: 1 },
                        { rootValue: null, expectedItemId: undefined, rootItemIndex: 1 },
                        { rootValue: undefined, expectedItemId: undefined, rootItemIndex: 1 }
                    ];

                    configs.forEach((config) => {
                        const options = createOptions({
                            selectionMode,
                            dataSourceOption,
                            virtualModeEnabled,
                            testRootItemIndex: config.rootItemIndex,
                            testItems: [
                                { id: 1, text: 'item1', parentId: 3 },
                                { id: 2, text: 'item2', parentId: 1 },
                                { id: 3, text: 'item3', parentId: 2 }]
                        });
                        options['rootValue'] = config.rootValue;
                        const wrapper = new TreeViewTestWrapper(options);

                        assert.notEqual(wrapper.instance, undefined);
                        const $rootNode = wrapper.getElement().find('[aria-level="1"]');
                        if(config.expectedItemId !== undefined) {
                            assert.equal($rootNode.attr('data-item-id'), config.expectedItemId);
                        } else {
                            assert.equal($rootNode.length, 0);
                        }
                        wrapper.instance.dispose();
                    });
                });
            });
        });
    });

    [true, false].forEach(virtualModeEnabled => {
        [null, -1, 0, ''].forEach(rootValue => {
            ['single', 'multiple'].forEach(selectionMode => {
                QUnit.test(`Adding new item to store with ${rootValue} value in parentId`, function(assert) { // T906787
                    const store = new ArrayStore({ data: [ { id: 1, parentId: rootValue, text: 'item1' } ] });
                    const wrapper = new TreeViewTestWrapper({
                        selectionMode,
                        virtualModeEnabled,
                        rootValue: rootValue,
                        dataStructure: 'plain',
                        dataSource: new DataSource({
                            store: store,
                        }),
                    });

                    store.insert({ id: 2, parentId: rootValue, text: 'item2' });
                    const nodes = wrapper.getNodes();
                    assert.equal(nodes.length, 2);
                    assert.equal(nodes.get(0).innerText.trim(), 'item1');
                    assert.equal(nodes.get(1).innerText.trim(), 'item2');
                });
            });
        });
    });
});

QUnit.module('Custom store', () => {
    function createTreeView(dataSourceFilter) {
        const store = new ArrayStore({
            key: 'id',
            data: [ { id: 1, parentId: null, text: 'item1' }, { id: 2, parentId: null, text: 'item2' } ]
        });

        return new TreeViewTestWrapper({
            dataSource: new DataSource({
                store: store,
                filter: dataSourceFilter
            }),
            dataStructure: 'plain',
            rootValue: null
        }).instance;
    }

    QUnit.test('Delete item from store', function(assert) {
        const treeView = createTreeView();
        treeView.getDataSource().store().remove(2);

        const nodes = treeView.getNodes();
        assert.equal(nodes.length, 1);
        assert.equal(nodes[0].text, 'item1');
    });

    QUnit.test('Delete non exists item from store', function(assert) {
        const treeView = createTreeView();
        treeView.getDataSource().store().remove(3);

        const nodes = treeView.getNodes();
        assert.equal(nodes.length, 2);
        assert.equal(nodes[0].text, 'item1');
        assert.equal(nodes[1].text, 'item2');
    });

    QUnit.test('Delete non visible item from filtered store', function(assert) {
        const treeView = createTreeView(['id', '=', '1']);
        treeView.getDataSource().store().remove(2);

        const nodes = treeView.getNodes();
        assert.equal(nodes.length, 1);
        assert.equal(nodes[0].text, 'item1');
    });

    QUnit.test('Delete visible item from filtered store', function(assert) {
        const treeView = createTreeView(['id', '=', '2']);
        treeView.getDataSource().store().remove(2);

        const nodes = treeView.getNodes();
        assert.equal(nodes.length, 0);
    });

    QUnit.test('Remove filter after deleting visible item from filtered store', function(assert) {
        const treeView = createTreeView(['id', '=', '2']);
        treeView.getDataSource().store().remove(2);

        treeView.option('dataSource', new DataSource({
            store: treeView.getDataSource().store()
        }));

        const nodes = treeView.getNodes();
        assert.equal(nodes.length, 1);
        assert.equal(nodes[0].text, 'item1');
    });
});

