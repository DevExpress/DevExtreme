/* global DATA, data2, internals, initTree */
import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';
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
    let $checkbox;
    let nodes;

    $icon.trigger('dxclick');
    assert.equal(treeView.option('items').length, 5);

    $checkbox = treeView.$element().find('.dx-checkbox');
    $($checkbox.eq(1)).trigger('dxclick');
    nodes = treeView.getNodes();
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
['items', 'dataSource', 'createChildren'].forEach((dataSourceOption) => {
    [false, true].forEach((virtualModeEnabled) => {
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
            // check via dataSource
            let wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded }]);
            wrapper.checkSelectedKeys([]);
            wrapper.checkSelectedNodes([]);
            wrapper.checkEventLog([]);
        });

        QUnit.test('all.selected: false -> selectAll -> expandAll', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }

            let wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded }]);
            wrapper.instance.selectAll();

            let expectedKeys = [0, 1];
            let expectedNodes = [0, 1];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [0];
            }
            if(!config.expanded) {
                // unexpected result
                expectedNodes = [0];
            }
            wrapper.checkSelectedKeys(expectedKeys, 'after selectAll');
            wrapper.checkSelectedNodes(expectedNodes, 'after selectAll');
            wrapper.checkEventLog(['selectionChanged'], 'after selectAll');
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

            wrapper.checkSelectedKeys(expectedKeys, 'after expandAll');
            wrapper.checkSelectedNodes(expectedNodes, 'after expandAll');
            wrapper.checkEventLog([], 'after expandAll');
        });

        QUnit.test('all.selected: false -> selectItem(0) -> expandAll', function(assert) {
            let wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded }]);
            wrapper.instance.selectItem(0);

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
            wrapper.checkSelectedKeys(expectedKeys, 'after selectItem(0)');
            wrapper.checkSelectedNodes(expectedNodes, 'after selectItem(0)');
            wrapper.checkEventLog(['itemSelectionChanged', 'selectionChanged'], 'after selectItem(0)');
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
            wrapper.checkSelectedKeys(expectedKeys, 'after expandAll');
            wrapper.checkSelectedNodes(expectedNodes, 'after expandAll');
            wrapper.checkEventLog([], 'after expandAll');
        });

        QUnit.test('all.selected: false -> selectItem(1) -> expandAll', function(assert) {
            let wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded }]);
            wrapper.instance.selectItem(1);

            let expectedKeys = [1];
            let expectedNodes = [1];
            let expectedCallbacks = ['itemSelectionChanged', 'selectionChanged'];
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
                expectedCallbacks = [];
                expectedNodes = [];
            }
            wrapper.checkSelectedKeys(expectedKeys, 'after selectItem(1)');
            wrapper.checkSelectedNodes(expectedNodes, 'after selectItem(1)');
            wrapper.checkEventLog(expectedCallbacks, 'after selectItem(1)');
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
            wrapper.checkSelectedKeys(expectedKeys, 'after expandAll');
            wrapper.checkSelectedNodes(expectedNodes, 'after expandAll');
            wrapper.checkEventLog([], 'after expandAll');
        });

        QUnit.test('all.selected: true', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }

            let wrapper = createWrapper(config, {}, [
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

            wrapper.checkSelectedKeys(expectedKeys);
            wrapper.checkSelectedNodes(expectedNodes);
            wrapper.checkEventLog([]);
        });

        QUnit.test('all.selected: true -> expandAll', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }

            let wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded }]);

            wrapper.instance.expandAll();

            wrapper.checkSelectedKeys([0, 1], 'after expandAll');
            wrapper.checkSelectedNodes([0, 1], 'after expandAll');
            wrapper.checkEventLog([], 'after expandAll');
        });

        QUnit.test('all.selected: true -> unselectAll -> expandAll', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }

            let wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded }]);

            wrapper.instance.unselectAll();

            let expectedKeys = [];
            let expectedNodes = [];
            wrapper.checkSelectedKeys(expectedKeys, 'after unselectAll');
            wrapper.checkSelectedNodes(expectedNodes, 'after unselectAll');
            wrapper.checkEventLog(['selectionChanged'], 'after unselectAll');
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
            }
            wrapper.checkSelectedKeys(expectedKeys, 'after expandAll');
            // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes, 'after expandAll');
            wrapper.checkEventLog([], 'after expandAll');
        });

        QUnit.test('all.selected: true -> unselectItem(0) -> expandAll', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }

            let wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded }]);

            wrapper.instance.unselectItem(0);

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
            wrapper.checkSelectedKeys(expectedKeys, 'after unselectItem(0)');
            wrapper.checkSelectedNodes(expectedNodes, 'after unselectItem(0)');
            wrapper.checkEventLog(['itemSelectionChanged', 'selectionChanged'], 'after unselectItem(0)');
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
            }
            wrapper.checkSelectedKeys(expectedKeys, 'after expandAll');
            // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes, 'after expandAll');
            wrapper.checkEventLog([], 'after expandAll');
        });

        QUnit.test('all.selected: true -> unselectItem(1) -> expandAll', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }

            let wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded }]);

            wrapper.instance.unselectItem(1);

            let expectedKeys = [0];
            let expectedCallbacks = ['itemSelectionChanged', 'selectionChanged'];
            if(config.selectNodesRecursive) {
                expectedKeys = [];
            }
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [0];
                expectedCallbacks = [];
            }
            wrapper.checkSelectedKeys(expectedKeys, 'after unselectItem(1)');
            wrapper.checkSelectedNodes(expectedKeys, 'after unselectItem(1)');
            wrapper.checkEventLog(expectedCallbacks, 'after unselectItem(1)');
            wrapper.clearEventLog();

            wrapper.instance.expandAll();
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [0, 1];
            }
            wrapper.checkSelectedKeys(expectedKeys, 'after expandAll');
            wrapper.checkSelectedNodes(expectedKeys, 'after expandAll');
            wrapper.checkEventLog([], 'after expandAll');
        });

        QUnit.test('item1.selected: true', function() {
            let wrapper = createWrapper(config, {}, [
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
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');
            wrapper.checkSelectedNodes(expectedNodes);
            wrapper.checkEventLog([], ' - check via dataSource items');
        });

        QUnit.test('item1.selected: true -> expandAll', function() {
            let wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: false, expanded: config.expanded }]);

            wrapper.instance.expandAll();

            let expectedKeys = [0];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [0, 1, 2];
                }
                if(!config.expanded && isLazyDataSourceMode(wrapper) && config.selectNodesRecursive) {
                    // unexpected result
                    expectedKeys = [0, 1];
                }
            }

            wrapper.checkSelectedKeys(expectedKeys, 'after expandAll');
            wrapper.checkSelectedNodes(expectedKeys, 'after expandAll');
            wrapper.checkEventLog([], 'after expandAll');
        });

        QUnit.test('item1.selected: true -> selectAll -> expandAll', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }

            let wrapper = createWrapper(config, {}, [
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
            wrapper.checkSelectedKeys(expectedKeys, 'after selectAll');
            wrapper.checkSelectedNodes(expectedNodes, 'after selectAll');
            wrapper.checkEventLog(['selectionChanged'], 'after selectAll');
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
            wrapper.checkSelectedKeys(expectedKeys, 'after expandAll');
            wrapper.checkSelectedNodes(expectedNodes, 'after expandAll');
            wrapper.checkEventLog([], 'after expandAll');
        });

        QUnit.test('item1.selected: true -> unselectAll -> expandAll', function(assert) {
            let wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: false, expanded: config.expanded }]);

            wrapper.instance.unselectAll();

            wrapper.checkSelectedKeys([], 'after unselectAll');
            wrapper.checkSelectedNodes([], 'after unselectAll');
            wrapper.checkEventLog(['selectionChanged'], 'after unselectAll');
            wrapper.clearEventLog();

            wrapper.instance.expandAll();
            wrapper.checkSelectedKeys([], 'after expandAll');
            wrapper.checkSelectedNodes([], 'after expandAll');
            wrapper.checkEventLog([], 'after expandAll');
        });


        QUnit.test('item1_1.selected: true', function() {
            let wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: false, expanded: config.expanded }]);

            let expectedKeys = [1];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [0, 1, 2];
                }
            }
            if(isLazyDataSourceMode(wrapper)) {
                // unexpected result
                if(!config.expanded) {
                    expectedKeys = [];
                }
            }
            wrapper.checkSelectedKeys(expectedKeys);
            // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes);
            wrapper.checkEventLog([]);
        });


        QUnit.test('item1_1.selected: true -> expandAll', function() {
            let wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: false, expanded: config.expanded }]);

            wrapper.instance.expandAll();

            let expectedKeys = [1];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [0, 1, 2];
                }
                if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                    // unexpected result
                    if(config.selectNodesRecursive) {
                        expectedKeys = [0, 1];
                    } else {
                        expectedKeys = [1];
                    }
                }
            }
            wrapper.checkSelectedKeys(expectedKeys, 'after expandAll');
            // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes);
            wrapper.checkEventLog([], 'after expandAll');
        });

        QUnit.test('item1_1.selected: true -> selectAll -> expandAll', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }
            let wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: false, expanded: config.expanded }]);

            wrapper.instance.selectAll();

            let expectedKeys = [0, 1, 2];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [0];
            }
            wrapper.checkSelectedKeys(expectedKeys, 'after selectAll');
            // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes);
            wrapper.checkEventLog(['selectionChanged'], 'after selectAll');
            wrapper.clearEventLog();

            wrapper.instance.expandAll();

            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [0, 1];
            }
            wrapper.checkSelectedKeys(expectedKeys, 'after expandAll');
            // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes);
            wrapper.checkEventLog([], 'after expandAll');
        });

        QUnit.test('item1_1.selected: true -> unselectAll -> expandAll', function(assert) {
            let wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: false, expanded: config.expanded }]);

            wrapper.instance.unselectAll();

            let expectedKeys = [];
            wrapper.checkSelectedKeys(expectedKeys, 'after unselectAll');
            // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes);
            wrapper.checkEventLog(['selectionChanged'], 'after unselectAll');
            wrapper.clearEventLog();

            wrapper.instance.expandAll();
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1];
                if(config.selectionMode === 'multiple' && config.selectNodesRecursive) {
                    expectedKeys = [0, 1];
                }
            }
            wrapper.checkSelectedKeys(expectedKeys, 'after expandAll');
            // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes);
            wrapper.checkEventLog([], 'after expandAll');
        });

        QUnit.test('item1_1_1.selected: true', function() {
            let wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: true, expanded: config.expanded }]);

            let expectedKeys = [2];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [0, 1, 2];
                }
            }
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [];
            }
            wrapper.checkSelectedKeys(expectedKeys);
            // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes);
            wrapper.checkEventLog([]);
            wrapper.clearEventLog();
        });

        QUnit.test('item1_1_1.selected: true -> expandAll', function() {
            let wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: true, expanded: config.expanded }]);

            wrapper.instance.expandAll();

            let expectedKeys = [2];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [0, 1, 2];
                }
            }
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [];
            }
            wrapper.checkSelectedKeys(expectedKeys, 'after expandAll');
            // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes);
            wrapper.checkEventLog([], 'after expandAll');
        });

        QUnit.test('item1_1_1.selected: true -> selectAll -> expandAll', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }
            let wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: true, expanded: config.expanded }]);

            wrapper.instance.selectAll();

            let expectedKeys = [0, 1, 2];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [0];
            }
            wrapper.checkSelectedKeys(expectedKeys, 'after selectAll');
            // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes);
            wrapper.checkEventLog(['selectionChanged'], 'after selectAll');
            wrapper.clearEventLog();

            wrapper.instance.expandAll();
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                if(config.selectNodesRecursive) {
                    expectedKeys = [0, 1];
                } else {
                    expectedKeys = [0];
                }
            }
            wrapper.checkSelectedKeys(expectedKeys, 'after expandAll');
            // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes);
            wrapper.checkEventLog([], 'after expandAll');
        });
    });
});
