/* global DATA, data2, internals, initTree */
import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';
import { Deferred } from 'core/utils/deferred';
import CustomStore from 'data/custom_store';
import $ from 'jquery';

QUnit.module('Checkboxes');

QUnit.test('Set intermediate state for parent if at least a one child is selected', function(assert) {
    const data = $.extend(true, [], DATA[5]);
    data[0].items[1].items[0].expanded = true;
    data[0].items[1].items[1].expanded = true;
    const $treeView = initTree({
        items: data,
        showCheckBoxesMode: 'normal'
    });

    const checkboxes = $treeView.find('.dx-checkbox');
    $(checkboxes[4]).trigger('dxclick');

    assert.equal($(checkboxes[4]).dxCheckBox('instance').option('value'), true);
    assert.equal($(checkboxes[3]).dxCheckBox('instance').option('value'), false);
    assert.equal($(checkboxes[2]).dxCheckBox('instance').option('value'), undefined);
    assert.equal($(checkboxes[1]).dxCheckBox('instance').option('value'), false);
    assert.equal($(checkboxes[0]).dxCheckBox('instance').option('value'), undefined);
});

QUnit.test('selectNodesRecursive = false', function(assert) {
    const data = $.extend(true, [], DATA[5]);
    data[0].items[1].items[0].expanded = true;
    data[0].items[1].items[1].expanded = true;

    const $treeView = initTree({
        items: data,
        selectNodesRecursive: false,
        showCheckBoxesMode: 'normal'
    });

    const checkboxes = $treeView.find('.dx-checkbox');
    $(checkboxes[4]).trigger('dxclick');

    assert.equal($(checkboxes[4]).dxCheckBox('instance').option('value'), true);
    assert.equal($(checkboxes[3]).dxCheckBox('instance').option('value'), false);
    assert.equal($(checkboxes[2]).dxCheckBox('instance').option('value'), false);
    assert.equal($(checkboxes[1]).dxCheckBox('instance').option('value'), false);
    assert.equal($(checkboxes[0]).dxCheckBox('instance').option('value'), false);
});

QUnit.test('Remove intermediate state from parent if all children are unselected', function(assert) {
    const data = $.extend(true, [], DATA[5]);
    data[0].items[1].items[0].expanded = true;
    data[0].items[1].items[1].expanded = true;

    const $treeView = initTree({
        items: data,
        showCheckBoxesMode: 'normal'
    });

    const checkboxes = $treeView.find('.dx-checkbox');
    $(checkboxes[4]).trigger('dxclick');
    $(checkboxes[3]).trigger('dxclick');
    $(checkboxes[4]).trigger('dxclick');

    assert.equal($(checkboxes[4]).dxCheckBox('instance').option('value'), false);
    assert.equal($(checkboxes[3]).dxCheckBox('instance').option('value'), true);
    assert.equal($(checkboxes[2]).dxCheckBox('instance').option('value'), undefined);
    assert.equal($(checkboxes[1]).dxCheckBox('instance').option('value'), false);
    assert.equal($(checkboxes[0]).dxCheckBox('instance').option('value'), undefined);

    $(checkboxes[3]).trigger('dxclick');
    assert.equal($(checkboxes[4]).dxCheckBox('instance').option('value'), false);
    assert.equal($(checkboxes[3]).dxCheckBox('instance').option('value'), false);
    assert.equal($(checkboxes[2]).dxCheckBox('instance').option('value'), false);
    assert.equal($(checkboxes[1]).dxCheckBox('instance').option('value'), false);
    assert.equal($(checkboxes[0]).dxCheckBox('instance').option('value'), false);
});

QUnit.test('Parent node should be selected if all children are selected', function(assert) {
    const data = $.extend(true, [], DATA[5]);
    data[0].items[1].items[0].expanded = true;
    data[0].items[1].items[1].expanded = true;
    const $treeView = initTree({
        items: data,
        showCheckBoxesMode: 'normal'
    });

    const checkboxes = $treeView.find('.dx-checkbox');
    $(checkboxes[4]).trigger('dxclick');
    $(checkboxes[3]).trigger('dxclick');

    assert.equal($(checkboxes[4]).dxCheckBox('instance').option('value'), true);
    assert.equal($(checkboxes[3]).dxCheckBox('instance').option('value'), true);
    assert.equal($(checkboxes[2]).dxCheckBox('instance').option('value'), true);
    assert.equal($(checkboxes[1]).dxCheckBox('instance').option('value'), false);
    assert.equal($(checkboxes[0]).dxCheckBox('instance').option('value'), undefined);
});

QUnit.test('All children should be selected/unselected after click on parent node', function(assert) {
    const data = $.extend(true, [], DATA[5]);
    data[0].items[1].items[0].expanded = true;
    data[0].items[1].items[1].expanded = true;
    const $treeView = initTree({
        items: data,
        showCheckBoxesMode: 'normal'
    });

    const checkboxes = $treeView.find('.dx-checkbox');

    $(checkboxes[2]).trigger('dxclick');

    assert.equal($(checkboxes[4]).dxCheckBox('instance').option('value'), true);
    assert.equal($(checkboxes[3]).dxCheckBox('instance').option('value'), true);
    assert.equal($(checkboxes[2]).dxCheckBox('instance').option('value'), true);

    $(checkboxes[2]).trigger('dxclick');

    assert.equal($(checkboxes[4]).dxCheckBox('instance').option('value'), false);
    assert.equal($(checkboxes[3]).dxCheckBox('instance').option('value'), false);
    assert.equal($(checkboxes[2]).dxCheckBox('instance').option('value'), false);
});

QUnit.test('Regression: incorrect parent state', function(assert) {
    const data = $.extend(true, [], data2);
    data[2].expanded = true;

    const $treeView = initTree({
        dataSource: data,
        dataStructure: 'plain',
        showCheckBoxesMode: 'normal'
    });

    const checkboxes = $treeView.find('.dx-checkbox');

    $(checkboxes[3]).trigger('dxclick');
    $(checkboxes[4]).trigger('dxclick');
    $(checkboxes[5]).trigger('dxclick');
    $(checkboxes[6]).trigger('dxclick');

    assert.equal($(checkboxes[2]).dxCheckBox('instance').option('value'), true);
    assert.equal($(checkboxes[0]).dxCheckBox('instance').option('value'), undefined);

});

QUnit.test('T173381', function(assert) {
    const $treeView = initTree({
        items: [
            {
                id: 777, text: 'root', items: [
                    {
                        id: 1, text: 'a', items:
                            [
                                {
                                    id: 11, text: 'a.1', expanded: true,
                                    items: [
                                        { id: 111, text: 'a.1.1' },
                                        { id: 112, text: 'a.1.2' }
                                    ]
                                },
                                { id: 12, text: 'a.2' }]
                    },
                    {
                        id: 2, text: 'b', expanded: true,
                        items: [
                            { id: 21, text: 'b.1' },
                            { id: 22, text: 'b.2' }
                        ]
                    }
                ]
            }
        ],
        showCheckBoxesMode: 'normal'
    });
    const checkboxes = $treeView.find('.dx-checkbox');

    $(checkboxes[2]).trigger('dxclick');
    assert.strictEqual($(checkboxes[0]).dxCheckBox('instance').option('value'), undefined);

    $(checkboxes[6]).trigger('dxclick');
    assert.strictEqual($(checkboxes[0]).dxCheckBox('instance').option('value'), undefined);

    $(checkboxes[6]).trigger('dxclick');
    assert.strictEqual($(checkboxes[0]).dxCheckBox('instance').option('value'), undefined);
});

QUnit.test('T195986', function(assert) {
    const $treeView = initTree({
        items: [
            {
                id: 777, text: 'root', expanded: true, selected: true,
                items: [
                    {
                        id: 1, text: 'a', expanded: true, selected: true, items:
                            [
                                {
                                    id: 11, text: 'a.1', expanded: true, selected: true,
                                    items: [
                                        { id: 111, text: 'a.1.1', selected: true },
                                        { id: 112, text: 'a.1.2', selected: true }
                                    ]
                                }
                            ]
                    }
                ]
            }
        ],
        showCheckBoxesMode: 'normal'
    });
    const checkboxes = $treeView.find('.dx-checkbox');
    $(checkboxes[3]).trigger('dxclick');
    assert.strictEqual($(checkboxes[0]).dxCheckBox('instance').option('value'), undefined);

    $(checkboxes[3]).trigger('dxclick');
    assert.strictEqual($(checkboxes[0]).dxCheckBox('instance').option('value'), true);
});

QUnit.test('Selection works correct with custom rootValue', function(assert) {
    const data = [
        { id: 0, parentId: 'none', text: 'Animals' },
        { id: 1, parentId: 0, text: 'Cat' },
        { id: 2, parentId: 0, text: 'Dog' },
        { id: 3, parentId: 0, text: 'Cow' },
        { id: 4, parentId: 'none', text: 'Birds' }
    ];
    const treeView = initTree({
        dataSource: data,
        dataStructure: 'plain',
        showCheckBoxesMode: 'normal',
        rootValue: 'none'
    }).dxTreeView('instance');
    const $icon = $(treeView.$element()).find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).eq(0);

    $icon.trigger('dxclick');
    assert.equal(treeView.option('items').length, 5);

    const $checkbox = treeView.$element().find('.dx-checkbox');
    $($checkbox.eq(1)).trigger('dxclick');
    const nodes = treeView.getNodes();
    assert.ok(nodes[0].items[0].selected, 'item was selected');
    assert.strictEqual(nodes[0].selected, undefined, 'item selection has undefined state');
});


function createWrapper(config, options, items) {
    const result = $.extend({}, config, options, { dataStructure: 'plain', rootValue: ROOT_ID, showCheckBoxesMode: 'normal' });
    if(result.dataSourceOption === 'createChildren') {
        const createChildFunction = (parent) => {
            const parentId = (parent !== null)
                ? parent.itemData.id
                : result.rootValue;
            return items.filter(function(item) { return parentId === item.parentId; });
        };
        result.createChildren = createChildFunction;
    } else {
        result[config.dataSourceOption] = items;
    }
    return new TreeViewTestWrapper(result);
}

function isLazyDataSourceMode(wrapper) {
    const options = wrapper.instance.option();
    return options.dataSource && options.virtualModeEnabled || options.createChildren;
}

const configs = [];
['items', 'dataSource'].forEach((dataSourceOption) => { // 'createChildren' is partially supported
    [false].forEach((virtualModeEnabled) => { // 'true' is partially supported
        [false, true].forEach((expanded) => {
            [false, true].forEach(selectNodesRecursive => {
                ['multiple', 'single'].forEach(selectionMode => {
                    configs.push({ dataSourceOption, virtualModeEnabled, expanded, selectNodesRecursive, selectionMode });
                });
            });
        });
    });
});

const ROOT_ID = -1;
configs.forEach(config => {
    QUnit.module(`SelectionMode: ${config.selectionMode}, dataSource: ${config.dataSourceOption}, virtualModeEnabled: ${config.virtualModeEnabled}, expanded: ${config.expanded}, selectNodesRecursive: ${config.selectNodesRecursive}`, () => {
        QUnit.test('all.selected: false', function(assert) {
            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded }]);
            wrapper.checkSelection([], []);
            wrapper.checkEventLog([]);
        });

        QUnit.test('all.selected: false -> selectAll -> expandAll', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }

            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded }]);
            wrapper.instance.selectAll();

            let expectedKeys = [0, 1];
            let expectedNodes = [0, 1];
            const expectedEventLog = ['selectionChanged'];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [0];
            }
            if(!config.expanded) {
                // unexpected result
                expectedNodes = [0];
            }

            wrapper.checkSelection(expectedKeys, expectedNodes, 'after select');
            wrapper.checkEventLog(expectedEventLog, 'after select');
            wrapper.clearEventLog();

            wrapper.instance.expandAll();
            expectedKeys = [0, 1];
            expectedNodes = [0, 1];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [0];
                if(config.selectNodesRecursive) {
                    expectedKeys = [0, 1];
                    expectedNodes = [0, 1];
                } else {
                    expectedNodes = [0];
                }
            }

            wrapper.checkSelection(expectedKeys, expectedNodes, 'after expand');
            wrapper.checkEventLog([], 'after expand');
        });

        QUnit.test('all.selected: false -> selectItem(0) -> expandAll', function(assert) {
            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded }]);
            const selectResult = wrapper.instance.selectItem(0);

            let expectedKeys = [0];
            let expectedNodes = [0];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [0, 1];
                    expectedNodes = [0, 1];
                }
                if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                    // unexpected result
                    expectedKeys = [0];
                }
            }
            if(!config.expanded) {
                // unexpected result
                expectedNodes = [0];
            }

            assert.strictEqual(selectResult, true, 'item1 is selected');
            wrapper.checkSelection(expectedKeys, expectedNodes, 'after select');
            wrapper.checkEventLog(['itemSelectionChanged', 'selectionChanged'], 'after select');
            wrapper.clearEventLog();

            wrapper.instance.expandAll();
            expectedNodes = [0];
            if(config.selectionMode === 'multiple') {
                if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                    // unexpected result
                    if(config.selectNodesRecursive) {
                        expectedKeys = [0, 1];
                    }
                }
                if(config.selectNodesRecursive) {
                    expectedNodes = [0, 1];
                }
            }
            wrapper.checkSelection(expectedKeys, expectedNodes, 'after expand');
            wrapper.checkEventLog([], 'after expand');
        });


        QUnit.test('all.selected: false -> selectItem(1) -> expandAll', function(assert) {
            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded }]);
            const selectResult = wrapper.instance.selectItem(1);

            let expectedKeys = [1];
            let expectedNodes = [1];
            let expectedEventLog = ['itemSelectionChanged', 'selectionChanged'];
            let expectedSelectResult = true;
            if(!config.expanded) {
                expectedNodes = [];
            }
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [0, 1];
                    expectedNodes = [0, 1];

                    if(!config.expanded) {
                        expectedNodes = [0];
                    }
                }
            }
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [];
                expectedEventLog = [];
                expectedNodes = [];
                expectedSelectResult = false;
            }


            assert.strictEqual(selectResult, expectedSelectResult, 'selectResult after select');
            wrapper.checkSelection(expectedKeys, expectedNodes, 'after select');
            wrapper.checkEventLog(expectedEventLog, 'after select');
            wrapper.clearEventLog();

            wrapper.instance.expandAll();
            expectedNodes = [1];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedNodes = [0, 1];
                }
            }
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedNodes = [];
            }
            wrapper.checkSelection(expectedKeys, expectedNodes, 'after expand');
            wrapper.checkEventLog([], 'after expand');
        });

        QUnit.test('all.selected: true', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }

            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded }]);

            let expectedKeys = [0, 1];
            let expectedNodes = [0, 1];
            if(!config.expanded) {
                // unexpected result
                if(isLazyDataSourceMode(wrapper)) {
                    expectedKeys = [0];
                }
                expectedNodes = [0];
            }

            wrapper.checkSelection(expectedKeys, expectedNodes);
            wrapper.checkEventLog([]);
        });

        QUnit.test('all.selected: true -> expandAll', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }

            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded }]);

            wrapper.instance.expandAll();

            wrapper.checkSelection([0, 1], [0, 1], 'after expand');
            wrapper.checkEventLog([], 'after expand');
        });

        QUnit.test('all.selected: true -> unselectAll -> expandAll', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }

            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded }]);

            wrapper.instance.unselectAll();

            let expectedKeys = [];
            let expectedNodes = [];
            const expectedEventLog = ['selectionChanged'];

            wrapper.checkSelection(expectedKeys, expectedNodes, 'after unselect');
            wrapper.checkEventLog(expectedEventLog, 'after unselect');
            wrapper.clearEventLog();

            wrapper.instance.expandAll();
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1];
                expectedNodes = [1];
                if(config.selectNodesRecursive) {
                    expectedKeys = [0, 1];
                    expectedNodes = [0, 1];
                }
                wrapper.checkSelectedKeys(expectedKeys, 'after expand');
                // TODO: DOM checkbox element value is 'false' when data source object property value is 'true' -T862228
            } else {
                wrapper.checkSelection(expectedKeys, expectedNodes, 'after expand');
            }
            wrapper.checkEventLog([], 'after expand');
        });

        QUnit.test('all.selected: true -> unselectItem(0) -> expandAll', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }

            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded }]);

            const unselectResult = wrapper.instance.unselectItem(0);

            let expectedKeys = [1];
            let expectedNodes = [1];
            if(config.selectNodesRecursive) {
                expectedKeys = [];
                expectedNodes = [];
            }
            if(!config.expanded) {
                // unexpected result
                if(isLazyDataSourceMode(wrapper)) {
                    expectedKeys = [];
                }
                expectedNodes = [];
            }

            assert.strictEqual(unselectResult, true, 'after unselect');
            wrapper.checkSelection(expectedKeys, expectedNodes, 'after unselect');
            wrapper.checkEventLog(['itemSelectionChanged', 'selectionChanged'], 'after unselect');
            wrapper.clearEventLog();

            wrapper.instance.expandAll();
            if(!config.selectNodesRecursive) {
                expectedNodes = [1];
            }
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1];
                expectedNodes = [1];
                if(config.selectNodesRecursive) {
                    expectedKeys = [0, 1];
                    expectedNodes = [0, 1];
                }

                wrapper.checkSelectedKeys(expectedKeys, 'after expand');
                // TODO: DOM checkbox element value is 'false' when data source object property value is 'true' -T862228
            } else {
                wrapper.checkSelection(expectedKeys, expectedNodes, 'after expand');
            }
            wrapper.checkEventLog([], 'after expand');
        });

        QUnit.test('all.selected: true -> unselectItem(1) -> expandAll', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }

            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded }]);

            const unselectResult = wrapper.instance.unselectItem(1);

            let expectedKeysAndNodes = [0];
            let expectedEventLog = ['itemSelectionChanged', 'selectionChanged'];
            let expectedUnselectResult = true;
            if(config.selectNodesRecursive) {
                expectedKeysAndNodes = [];
            }
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeysAndNodes = [0];
                expectedEventLog = [];
                expectedUnselectResult = false;
            }

            assert.strictEqual(unselectResult, expectedUnselectResult, 'after unselect');
            wrapper.checkSelection(expectedKeysAndNodes, expectedKeysAndNodes, 'after unselect');
            wrapper.checkEventLog(expectedEventLog, 'after unselect');
            wrapper.clearEventLog();

            wrapper.instance.expandAll();
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeysAndNodes = [0, 1];
            }
            wrapper.checkSelection(expectedKeysAndNodes, expectedKeysAndNodes, 'after unselect');
            wrapper.checkEventLog([], 'after expand');
        });

        QUnit.test('item1.selected: true', function() {
            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: false, expanded: config.expanded }]);

            let expectedKeys = [0];
            let expectedNodes = [0];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [0, 1, 2];
                    expectedNodes = [0, 1, 2];
                }
                if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                    // unexpected result
                    expectedKeys = [0];
                }
            }
            if(!config.expanded) {
                // unexpected result
                expectedNodes = [0];
            }
            wrapper.checkSelection(expectedKeys, expectedNodes);
            wrapper.checkEventLog([]);
        });

        QUnit.test('item1.selected: true -> expandAll', function() {
            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: false, expanded: config.expanded }]);

            wrapper.instance.expandAll();

            let expectedKeysAndNodes = [0];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeysAndNodes = [0, 1, 2];
                }
                if(!config.expanded && isLazyDataSourceMode(wrapper) && config.selectNodesRecursive) {
                    // unexpected result
                    expectedKeysAndNodes = [0, 1];
                }
            }

            wrapper.checkSelection(expectedKeysAndNodes, expectedKeysAndNodes, 'after expand');
            wrapper.checkEventLog([], 'after expand');
        });

        QUnit.test('item1.selected: true -> selectAll -> expandAll', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }

            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: false, expanded: config.expanded }]);

            wrapper.instance.selectAll();

            let expectedKeys = [0, 1, 2];
            let expectedNodes = [0, 1, 2];
            if(!config.expanded) {
                // unexpected result
                if(isLazyDataSourceMode(wrapper)) {
                    expectedKeys = [0];
                }
                expectedNodes = [0];
            }

            wrapper.checkSelection(expectedKeys, expectedNodes, 'after select');
            wrapper.checkEventLog(['selectionChanged'], 'after select');
            wrapper.clearEventLog();

            wrapper.instance.expandAll();
            if(!config.expanded) {
                expectedNodes = [0, 1, 2];
                if(isLazyDataSourceMode(wrapper)) {
                    // unexpected result
                    if(config.selectNodesRecursive) {
                        expectedKeys = [0, 1];
                        expectedNodes = [0, 1];
                    } else {
                        expectedKeys = [0];
                        expectedNodes = [0];
                    }
                }
            }
            wrapper.checkSelection(expectedKeys, expectedNodes, 'after expand');
            wrapper.checkEventLog([], 'after expand');
        });

        QUnit.test('item1.selected: true -> unselectAll -> expandAll', function(assert) {
            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: false, expanded: config.expanded }]);

            wrapper.instance.unselectAll();

            const expectedEventLog = ['selectionChanged'];
            wrapper.checkSelection([], [], 'after unselect');
            wrapper.checkEventLog(expectedEventLog, 'after unselect');
            wrapper.clearEventLog();

            wrapper.instance.expandAll();
            wrapper.checkSelection([], [], 'after expand');
            wrapper.checkEventLog([], 'after expand');
        });

        QUnit.test('item1_1.selected: true', function() {
            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: false, expanded: config.expanded }]);

            let expectedKeys = [1];
            let expectedNodes = [1];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [0, 1, 2];
                    expectedNodes = [0, 1, 2];
                }
            }
            if(isLazyDataSourceMode(wrapper)) {
                // unexpected result
                if(!config.expanded) {
                    expectedKeys = [];
                    expectedNodes = [];
                }
                wrapper.checkSelectedKeys(expectedKeys);
                // TODO: DOM checkbox element value is 'false' when data source object property value is 'true' (T862228)- wrapper.checkSelectedNodes(expectedNodes);
            } else {
                if(!config.expanded) {
                    if(!config.selectNodesRecursive || config.selectionMode === 'single') {
                        expectedNodes = [];
                    } else {
                        expectedNodes = [0];
                    }
                }
                wrapper.checkSelection(expectedKeys, expectedNodes);
            }

            wrapper.checkEventLog([]);
        });


        QUnit.test('item1_1.selected: true -> expandAll', function() {
            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: false, expanded: config.expanded }]);

            wrapper.instance.expandAll();

            let expectedKeysAndNodes = [1];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeysAndNodes = [0, 1, 2];
                }
                if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                    // unexpected result
                    if(config.selectNodesRecursive) {
                        expectedKeysAndNodes = [0, 1];
                    } else {
                        expectedKeysAndNodes = [1];
                    }
                }
                wrapper.checkSelectedKeys(expectedKeysAndNodes, 'after expand');
                // TODO: DOM checkbox element value is 'false' when data source object property value is 'true' (T862228)- wrapper.checkSelectedNodes(expectedNodes);
            } else {
                wrapper.checkSelection(expectedKeysAndNodes, expectedKeysAndNodes, 'after expand');
            }

            wrapper.checkEventLog([], 'after expand');
        });

        QUnit.test('item1_1.selected: true -> selectAll -> expandAll', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }

            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: false, expanded: config.expanded }]);
            wrapper.instance.selectAll();

            let expectedKeys = [0, 1, 2];
            let expectedNodes = [0, 1, 2];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [0];
                expectedNodes = [0];
            }

            if(!config.expanded) {
                expectedNodes = [0];
            }

            wrapper.checkSelection(expectedKeys, expectedNodes, 'after select');
            wrapper.checkEventLog(['selectionChanged'], 'after select');
            wrapper.clearEventLog();

            wrapper.instance.expandAll();
            expectedNodes = [0, 1, 2];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [0, 1];
                expectedNodes = [0, 1];
            }
            wrapper.checkSelection(expectedKeys, expectedNodes, 'after expand');
            wrapper.checkEventLog([], 'after expand');
        });

        QUnit.test('item1_1.selected: true -> unselectAll -> expandAll', function() {
            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: false, expanded: config.expanded }]);

            wrapper.instance.unselectAll();

            let expectedKeys = [];
            let expectedNodes = [];
            const expectedEventLog = ['selectionChanged'];

            wrapper.checkSelection(expectedKeys, expectedNodes, 'after unselect');
            wrapper.checkEventLog(expectedEventLog, 'after unselect');
            wrapper.clearEventLog();

            wrapper.instance.expandAll();
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1];
                expectedNodes = [1];
                if(config.selectionMode === 'multiple' && config.selectNodesRecursive) {
                    expectedKeys = [0, 1];
                    expectedNodes = [0, 1];
                }
                wrapper.checkSelectedKeys(expectedKeys, 'after expand');
                // TODO: DOM checkbox element value is 'false' when data source object property value is 'true' (T862228)- wrapper.checkSelectedNodes(expectedNodes);
            } else {
                wrapper.checkSelection(expectedKeys, expectedNodes, 'after expand');
            }

            wrapper.checkEventLog([], 'after expand');
        });

        QUnit.test('item1_1_1.selected: true', function() {
            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: true, expanded: config.expanded }]);

            let expectedKeys = [2];
            let expectedNodes = [2];
            if(!config.expanded) {
                expectedNodes = [];
            }
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [0, 1, 2];
                    expectedNodes = [0, 1, 2];

                    if(!config.expanded) {
                        expectedNodes = [0];
                    }
                }
            }

            if(isLazyDataSourceMode(wrapper)) {
                if(!config.expanded) {
                    // unexpected result
                    expectedKeys = [];
                    expectedNodes = [];
                }
                wrapper.checkSelectedKeys(expectedKeys);
                // TODO: DOM checkbox element value is 'false' when data source object property value is 'true' (T862228)- wrapper.checkSelectedNodes(expectedNodes);
            } else {
                wrapper.checkSelection(expectedKeys, expectedNodes);
            }


            wrapper.checkEventLog([]);
            wrapper.clearEventLog();
        });

        QUnit.test('item1_1_1.selected: true -> expandAll', function() {
            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: true, expanded: config.expanded }]);

            wrapper.instance.expandAll();

            let expectedKeysAndNodes = [2];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeysAndNodes = [0, 1, 2];
                }
            }
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeysAndNodes = [];
                wrapper.checkSelectedKeys(expectedKeysAndNodes, 'after expand');
                // TODO: DOM checkbox element value is 'false' when data source object property value is 'true' (T862228)- wrapper.checkSelectedNodes(expectedNodes);
            } else {
                wrapper.checkSelection(expectedKeysAndNodes, expectedKeysAndNodes, 'after expand');
            }
            wrapper.checkEventLog([], 'after expand');
        });

        QUnit.test('item1_1_1.selected: true -> selectAll -> expandAll', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }
            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: true, expanded: config.expanded }]);

            wrapper.instance.selectAll();

            let expectedKeys = [0, 1, 2];
            let expectedNodes = [0, 1, 2];
            if(!config.expanded) {
                expectedNodes = [0];
            }
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [0];
            }

            wrapper.checkSelection(expectedKeys, expectedNodes, 'after select');
            wrapper.checkEventLog(['selectionChanged'], 'after select');
            wrapper.clearEventLog();

            wrapper.instance.expandAll();
            expectedNodes = [0, 1, 2];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                if(config.selectNodesRecursive) {
                    expectedKeys = [0, 1];
                    expectedNodes = [0, 1];
                } else {
                    expectedKeys = [0];
                    expectedNodes = [0];
                }
            }
            wrapper.checkSelection(expectedKeys, expectedNodes, 'after expand');
            wrapper.checkEventLog([], 'after expand');
        });
    });
});


QUnit.module('Delayed datasource', () => {
    function executeDelayed(action, timeout) {
        const deferred = new Deferred();
        setTimeout(() => {
            try {
                const result = action();
                deferred.resolve(result);
            } catch(e) {
                deferred.reject(e);
            }
        }, timeout);
        return deferred.promise();
    }

    QUnit.test('all.selected: false -> selectItem(1)', function(assert) {
        const done = assert.async();
        const wrapper = new TreeViewTestWrapper({
            dataSource: new CustomStore({
                load: () => executeDelayed(() => { return [ { id: 1, text: 'item1' }]; }, 1)
            }),
            showCheckBoxesMode: 'normal',
            dataStructure: 'plain'
        });

        const selectResult = wrapper.instance.selectItem(1);

        setTimeout(() => {
            const $item1 = wrapper.getElement().find('[aria-level="1"]');

            assert.equal($item1.length, 1, 'item1 is rendered');
            assert.strictEqual(selectResult, false, 'selected item not found');
            wrapper.checkSelection([], [], 'nothing is selected');
            wrapper.checkEventLog([], 'there is no selection events');
            done();
        }, 2);
    });

    QUnit.test('all.selected: false -> timeout(() => selectItem(1)) -> reload dataSource', function(assert) {
        const done = assert.async();
        const wrapper = new TreeViewTestWrapper({
            dataSource: new CustomStore({
                load: () => executeDelayed(() => { return [ { id: 0, text: 'item1' }]; }, 1)
            }),
            showCheckBoxesMode: 'normal',
            dataStructure: 'plain'
        });

        setTimeout(() => {
            const selectResult = wrapper.instance.selectItem(0);
            assert.strictEqual(selectResult, true, 'selected item found');

            const $item1 = wrapper.getElement().find('[aria-level="1"]');
            assert.equal($item1.length, 1, 'item1 is rendered');
            wrapper.checkSelection([0], [0], 'item1 is selected');
            wrapper.checkEventLog(['itemSelectionChanged', 'selectionChanged'], 'there is no selection events');

            wrapper.clearEventLog();
            wrapper.instance.getDataSource().reload().done(function() {
                const $item1_ = wrapper.getElement().find('[aria-level="1"]');

                assert.equal($item1_.length, 1, 'item1 is rendered');
                wrapper.checkSelection([], [], 'nothing is selected');
                wrapper.checkEventLog([], 'there is no selection events');
                done();
            });
        }, 2);

        QUnit.test('all.selected: false -> contentReady(() => selectItem(1)) ', function(assert) {
            const done = assert.async();
            const wrapper = new TreeViewTestWrapper({
                dataSource: new CustomStore({
                    load: () => executeDelayed(() => { return [ { id: 0, text: 'item1' }]; }, 1)
                }),
                showCheckBoxesMode: 'normal',
                dataStructure: 'plain',
                onContentReady: function() {
                    const selectResult = wrapper.instance.selectItem(0);
                    const $item1 = wrapper.getElement().find('[aria-level="1"]');

                    assert.equal(selectResult, true, 'item1 is selected');
                    assert.equal($item1.length, 1, 'item1 is rendered');
                    wrapper.checkSelection([0], [0], 'item1 is selected');
                    wrapper.checkEventLog(['itemSelectionChanged', 'selectionChanged'], 'there is no selection events');
                    done();
                }
            });
        });
    });
});

QUnit.module('Searching', () => {
    QUnit.test('all.selected: false, searchValue: 2 -> select(item1) -> removeSearch', function(assert) {
        const wrapper = new TreeViewTestWrapper({ searchValue: '2', showCheckBoxesMode: 'normal', dataStructure: 'plain', rootValue: ROOT_ID,
            items: [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false },
                { id: 1, text: 'item2', parentId: ROOT_ID, selected: false }] });
        wrapper.checkSelection([], [], 'after search');
        wrapper.checkEventLog([], 'after search');

        const selectResult = wrapper.instance.selectItem(0);
        assert.equal(selectResult, false, 'nothing is found');
        wrapper.checkSelection([], [], 'after selectItem');
        wrapper.checkEventLog([], 'after selectItem');

        wrapper.instance.option('searchValue', '');
        wrapper.checkSelection([], [], 'after removeSearch');
        wrapper.checkEventLog([], 'after removeSearch');
    });

    QUnit.test('all.selected: false, searchValue: 2 -> selectAll() -> removeSearch', function(assert) {
        const wrapper = new TreeViewTestWrapper({ searchValue: '2', showCheckBoxesMode: 'normal', dataStructure: 'plain', rootValue: ROOT_ID,
            items: [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false },
                { id: 1, text: 'item2', parentId: ROOT_ID, selected: false }] });
        wrapper.checkSelection([], [], 'after search');
        wrapper.checkEventLog([], 'after search');

        wrapper.instance.selectAll();
        wrapper.checkSelection([1], [0], 'after selectAll');
        wrapper.checkEventLog(['selectionChanged'], 'after selectAll');
        wrapper.clearEventLog();

        wrapper.instance.option('searchValue', '');
        wrapper.checkSelection([1], [1], 'after removeSearch');
        wrapper.checkEventLog([]);
    });

    QUnit.test('all.selected: true, searchValue: 2 -> unselect(item1) -> removeSearch', function(assert) {
        const wrapper = new TreeViewTestWrapper({ searchValue: '2', showCheckBoxesMode: 'normal', dataStructure: 'plain', rootValue: ROOT_ID,
            items: [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: true },
                { id: 1, text: 'item2', parentId: ROOT_ID, selected: true }] });
        wrapper.checkSelection([1], [0], 'after search');
        wrapper.checkEventLog([], 'after search');

        const unselectResult = wrapper.instance.unselectItem(0);
        assert.equal(unselectResult, false, 'nothing is found');
        wrapper.checkSelection([1], [0], 'after unselect');
        wrapper.checkEventLog([], 'after unselect');
        wrapper.clearEventLog();

        wrapper.instance.option('searchValue', '');
        wrapper.checkSelection([0, 1], [0, 1], 'after removeSearch');
        wrapper.checkEventLog([], 'after removeSearch');
    });

    QUnit.test('all.selected: true, searchValue: 2 -> unselectAll -> removeSearch', function(assert) {
        const wrapper = new TreeViewTestWrapper({ searchValue: '2', showCheckBoxesMode: 'normal', dataStructure: 'plain', rootValue: ROOT_ID,
            items: [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: true },
                { id: 1, text: 'item2', parentId: ROOT_ID, selected: true }] });
        wrapper.checkSelection([1], [0], 'after search');
        wrapper.checkEventLog([], 'after search');

        wrapper.instance.unselectAll();
        wrapper.checkSelection([], [], 'after unselectAll');
        wrapper.checkEventLog(['selectionChanged'], 'after unselectAll');
        wrapper.clearEventLog();

        wrapper.instance.option('searchValue', '');
        wrapper.checkSelection([0], [0], 'after removeSearch');
        wrapper.checkEventLog([], 'after removeSearch');
    });
});
