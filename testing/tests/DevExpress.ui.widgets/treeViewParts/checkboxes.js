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

function isSelectByKeysFunction(func) {
    return func.toString().indexOf('setSelectedNodesKeys') > 0;
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
            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded }]);
            wrapper.checkSelectedKeys([]);
            wrapper.checkSelectedNodes([]);
            wrapper.checkEventLog([]);
        });

        [treeView => treeView.selectAll(), treeView => treeView.setSelectedNodesKeys([0, 1])].forEach(selectFunc => {
            QUnit.test('all.selected: false -> selectAll -> expandAll', function(assert) {
                if(config.selectionMode === 'single') {
                    assert.ok('skip for single');
                    return;
                }

                const wrapper = createWrapper(config, {}, [
                    { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded }]);
                selectFunc(wrapper.instance);

                let expectedKeys = [0, 1];
                let expectedNodes = [0, 1];
                let expectedEventLog = ['selectionChanged'];
                if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                    // unexpected result
                    expectedKeys = [0];
                }
                if(!config.expanded) {
                    // unexpected result
                    expectedNodes = [0];
                }

                if(isSelectByKeysFunction(selectFunc)) {
                    expectedEventLog = ['itemSelectionChanged', 'itemSelectionChanged', 'selectionChanged'];
                    if(config.selectNodesRecursive || (!config.expanded && isLazyDataSourceMode(wrapper))) {
                        expectedEventLog = ['itemSelectionChanged', 'selectionChanged'];
                    }
                }

                wrapper.checkSelectedKeys(expectedKeys, 'after select');
                wrapper.checkSelectedNodes(expectedNodes, 'after select');
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

                wrapper.checkSelectedKeys(expectedKeys, 'after expand');
                wrapper.checkSelectedNodes(expectedNodes, 'after expand');
                wrapper.checkEventLog([], 'after expand');
            });
        });

        [treeView => treeView.selectItem(0), treeView => treeView.setSelectedNodesKeys([0])].forEach(selectItemFunc => {
            QUnit.test('all.selected: false -> selectItem(0) -> expandAll', function(assert) {
                const wrapper = createWrapper(config, {}, [
                    { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded }]);
                selectItemFunc(wrapper.instance);

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
                wrapper.checkSelectedKeys(expectedKeys, 'after select');
                wrapper.checkSelectedNodes(expectedNodes, 'after select');
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
                wrapper.checkSelectedKeys(expectedKeys, 'after expand');
                wrapper.checkSelectedNodes(expectedNodes, 'after expand');
                wrapper.checkEventLog([], 'after expand');
            });
        });

        [treeView => treeView.selectItem(1), treeView => treeView.setSelectedNodesKeys([1])].forEach(selectItemFunc => {
            QUnit.test('all.selected: false -> selectItem(1) -> expandAll', function(assert) {
                const wrapper = createWrapper(config, {}, [
                    { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded }]);
                selectItemFunc(wrapper.instance);

                let expectedKeys = [1];
                let expectedNodes = [1];
                let expectedEventLog = ['itemSelectionChanged', 'selectionChanged'];
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
                }
                wrapper.checkSelectedKeys(expectedKeys, 'after select');
                wrapper.checkSelectedNodes(expectedNodes, 'after select');
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
                wrapper.checkSelectedKeys(expectedKeys, 'after expand');
                wrapper.checkSelectedNodes(expectedNodes, 'after expand');
                wrapper.checkEventLog([], 'after expand');
            });
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

            wrapper.checkSelectedKeys(expectedKeys);
            wrapper.checkSelectedNodes(expectedNodes);
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

            wrapper.checkSelectedKeys([0, 1], 'after expand');
            wrapper.checkSelectedNodes([0, 1], 'after expand');
            wrapper.checkEventLog([], 'after expand');
        });

        [treeView => treeView.unselectAll(), treeView => treeView.setSelectedNodesKeys([])].forEach(unselectFunc => {
            QUnit.test('all.selected: true -> unselectAll -> expandAll', function(assert) {
                if(config.selectionMode === 'single') {
                    assert.ok('skip for single');
                    return;
                }

                const wrapper = createWrapper(config, {}, [
                    { id: 0, text: 'item1', parentId: ROOT_ID, selected: true, expanded: config.expanded },
                    { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded }]);

                unselectFunc(wrapper.instance);

                let expectedKeys = [];
                let expectedNodes = [];
                let expectedEventLog = ['selectionChanged'];
                if(isSelectByKeysFunction(unselectFunc)) {
                    expectedEventLog = ['itemSelectionChanged', 'itemSelectionChanged', 'selectionChanged'];
                    if(config.selectNodesRecursive || (!config.expanded && isLazyDataSourceMode(wrapper))) {
                        expectedEventLog = ['itemSelectionChanged', 'selectionChanged'];
                    }
                }

                wrapper.checkSelectedKeys(expectedKeys, 'after unselect');
                wrapper.checkSelectedNodes(expectedNodes, 'after unselect');
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
                }
                wrapper.checkSelectedKeys(expectedKeys, 'after expand');
                // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes, 'after expand');
                wrapper.checkEventLog([], 'after expand');
            });
        });

        QUnit.test('all.selected: true -> unselectItem(0) -> expandAll', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }

            const wrapper = createWrapper(config, {}, [
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
            wrapper.checkSelectedKeys(expectedKeys, 'after unselect');
            wrapper.checkSelectedNodes(expectedNodes, 'after unselect');
            wrapper.checkEventLog(['itemSelectionChanged', 'selectionChanged'], 'after unselect');
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
            wrapper.checkSelectedKeys(expectedKeys, 'after expand');
            // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes, 'after expand');
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

            wrapper.instance.unselectItem(1);

            let expectedKeys = [0];
            let expectedEventLog = ['itemSelectionChanged', 'selectionChanged'];
            if(config.selectNodesRecursive) {
                expectedKeys = [];
            }
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [0];
                expectedEventLog = [];
            }
            wrapper.checkSelectedKeys(expectedKeys, 'after unselect');
            wrapper.checkSelectedNodes(expectedKeys, 'after unselect');
            wrapper.checkEventLog(expectedEventLog, 'after unselect');
            wrapper.clearEventLog();

            wrapper.instance.expandAll();
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [0, 1];
            }
            wrapper.checkSelectedKeys(expectedKeys, 'after expand');
            wrapper.checkSelectedNodes(expectedKeys, 'after expand');
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
            wrapper.checkSelectedKeys(expectedKeys);
            wrapper.checkSelectedNodes(expectedNodes);
            wrapper.checkEventLog([]);
        });

        QUnit.test('item1.selected: true -> expandAll', function() {
            const wrapper = createWrapper(config, {}, [
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

            wrapper.checkSelectedKeys(expectedKeys, 'after expand');
            wrapper.checkSelectedNodes(expectedKeys, 'after expand');
            wrapper.checkEventLog([], 'after expand');
        });

        [treeView => treeView.selectAll(), treeView => treeView.setSelectedNodesKeys([0, 1, 2])].forEach(selectFunc => {
            QUnit.test('item1.selected: true -> selectAll -> expandAll', function(assert) {
                if(config.selectionMode === 'single') {
                    assert.ok('skip for single');
                    return;
                }

                const wrapper = createWrapper(config, {}, [
                    { id: 0, text: 'item1', parentId: ROOT_ID, selected: true, expanded: config.expanded },
                    { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded },
                    { id: 2, text: 'item1_1_1', parentId: 1, selected: false, expanded: config.expanded }]);

                selectFunc(wrapper.instance);

                let expectedKeys = [0, 1, 2];
                let expectedNodes = [0, 1, 2];
                if(!config.expanded) {
                    // unexpected result
                    if(isLazyDataSourceMode(wrapper)) {
                        expectedKeys = [0];
                    }
                    expectedNodes = [0];
                }

                let expectedEventLog = ['selectionChanged'];
                if(isSelectByKeysFunction(selectFunc)) {
                    expectedEventLog = ['itemSelectionChanged', 'itemSelectionChanged', 'selectionChanged'];
                    if(config.selectNodesRecursive || (!config.expanded && isLazyDataSourceMode(wrapper))) {
                        // unexpected result
                        expectedEventLog = [];
                    }
                }
                wrapper.checkSelectedKeys(expectedKeys, 'after select');
                wrapper.checkSelectedNodes(expectedNodes, 'after select');
                wrapper.checkEventLog(expectedEventLog, 'after select');
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
                wrapper.checkSelectedKeys(expectedKeys, 'after expand');
                wrapper.checkSelectedNodes(expectedNodes, 'after expand');
                wrapper.checkEventLog([], 'after expand');
            });
        });

        [treeView => treeView.unselectAll(), treeView => treeView.setSelectedNodesKeys([])].forEach(unselectFunc => {
            QUnit.test('item1.selected: true -> unselectAll -> expandAll', function(assert) {
                const wrapper = createWrapper(config, {}, [
                    { id: 0, text: 'item1', parentId: ROOT_ID, selected: true, expanded: config.expanded },
                    { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded },
                    { id: 2, text: 'item1_1_1', parentId: 1, selected: false, expanded: config.expanded }]);

                unselectFunc(wrapper.instance);

                let expectedEventLog = ['selectionChanged'];
                if(isSelectByKeysFunction(unselectFunc)) {
                    expectedEventLog = ['itemSelectionChanged', 'selectionChanged'];
                }
                wrapper.checkSelectedKeys([], 'after unselect');
                wrapper.checkSelectedNodes([], 'after unselect');
                wrapper.checkEventLog(expectedEventLog, 'after unselect');
                wrapper.clearEventLog();

                wrapper.instance.expandAll();
                wrapper.checkSelectedKeys([], 'after expand');
                wrapper.checkSelectedNodes([], 'after expand');
                wrapper.checkEventLog([], 'after expand');
            });
        });

        QUnit.test('item1_1.selected: true', function() {
            const wrapper = createWrapper(config, {}, [
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
            const wrapper = createWrapper(config, {}, [
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
            wrapper.checkSelectedKeys(expectedKeys, 'after expand');
            // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes);
            wrapper.checkEventLog([], 'after expand');
        });

        [treeView => treeView.selectAll(), treeView => treeView.setSelectedNodesKeys([0, 1, 2])].forEach(selectFunc => {
            QUnit.test('item1_1.selected: true -> selectAll -> expandAll', function(assert) {
                if(config.selectionMode === 'single') {
                    assert.ok('skip for single');
                    return;
                }

                const wrapper = createWrapper(config, {}, [
                    { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded },
                    { id: 2, text: 'item1_1_1', parentId: 1, selected: false, expanded: config.expanded }]);
                selectFunc(wrapper.instance);

                let expectedKeys = [0, 1, 2];
                if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                    // unexpected result
                    expectedKeys = [0];
                }

                let expectedEventLog = ['selectionChanged'];
                if(isSelectByKeysFunction(selectFunc)) {
                    expectedEventLog = ['itemSelectionChanged', 'itemSelectionChanged', 'selectionChanged'];
                    if(config.selectNodesRecursive) {
                        expectedEventLog = [];
                    }
                    if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                        // unexpected result;
                        expectedEventLog = ['itemSelectionChanged', 'selectionChanged'];
                    }
                }
                wrapper.checkSelectedKeys(expectedKeys, 'after select');
                // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes);
                wrapper.checkEventLog(expectedEventLog, 'after select');
                wrapper.clearEventLog();

                wrapper.instance.expandAll();

                if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                    // unexpected result
                    expectedKeys = [0, 1];
                }
                wrapper.checkSelectedKeys(expectedKeys, 'after expand');
                // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes);
                wrapper.checkEventLog([], 'after expand');
            });
        });

        [treeView => treeView.unselectAll(), treeView => treeView.setSelectedNodesKeys([])].forEach(unselectFunc => {
            QUnit.test('item1_1.selected: true -> unselectAll -> expandAll', function(assert) {
                const wrapper = createWrapper(config, {}, [
                    { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 1, text: 'item1_1', parentId: 0, selected: true, expanded: config.expanded },
                    { id: 2, text: 'item1_1_1', parentId: 1, selected: false, expanded: config.expanded }]);

                unselectFunc(wrapper.instance);

                let expectedKeys = [];
                let expectedEventLog = ['selectionChanged'];
                if(isSelectByKeysFunction(unselectFunc)) {
                    expectedEventLog = ['itemSelectionChanged', 'selectionChanged'];

                    if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                        // unexpected result;
                        expectedEventLog = [];
                    }
                }
                wrapper.checkSelectedKeys(expectedKeys, 'after unselect');
                // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes);
                wrapper.checkEventLog(expectedEventLog, 'after unselect');
                wrapper.clearEventLog();

                wrapper.instance.expandAll();
                if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                    // unexpected result
                    expectedKeys = [1];
                    if(config.selectionMode === 'multiple' && config.selectNodesRecursive) {
                        expectedKeys = [0, 1];
                    }
                }
                wrapper.checkSelectedKeys(expectedKeys, 'after expand');
                // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes);
                wrapper.checkEventLog([], 'after expand');
            });
        });

        QUnit.test('item1_1_1.selected: true', function() {
            const wrapper = createWrapper(config, {}, [
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
            const wrapper = createWrapper(config, {}, [
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
            wrapper.checkSelectedKeys(expectedKeys, 'after expand');
            // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes);
            wrapper.checkEventLog([], 'after expand');
        });

        [treeView => treeView.selectAll(), treeView => treeView.setSelectedNodesKeys([0, 1, 2])].forEach(selectFunc => {
            QUnit.test('item1_1_1.selected: true -> selectAll -> expandAll', function(assert) {
                if(config.selectionMode === 'single') {
                    assert.ok('skip for single');
                    return;
                }
                const wrapper = createWrapper(config, {}, [
                    { id: 0, text: 'item1', parentId: ROOT_ID, selected: false, expanded: config.expanded },
                    { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded },
                    { id: 2, text: 'item1_1_1', parentId: 1, selected: true, expanded: config.expanded }]);

                selectFunc(wrapper.instance);

                let expectedKeys = [0, 1, 2];
                let expectedEventLog = ['selectionChanged'];
                if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                    // unexpected result
                    expectedKeys = [0];
                }
                if(isSelectByKeysFunction(selectFunc)) {
                    expectedEventLog = ['itemSelectionChanged', 'itemSelectionChanged', 'selectionChanged'];
                    if(config.selectNodesRecursive) {
                        expectedEventLog = [];
                    }
                    if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                        // unexpected result;
                        expectedEventLog = ['itemSelectionChanged', 'selectionChanged'];
                    }
                }
                wrapper.checkSelectedKeys(expectedKeys, 'after select');
                // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes);
                wrapper.checkEventLog(expectedEventLog, 'after select');
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
                wrapper.checkSelectedKeys(expectedKeys, 'after expand');
                // TODO: bug. internal data source items and UI are out of sync - wrapper.checkSelectedNodes(expectedNodes);
                wrapper.checkEventLog([], 'after expand');
            });
        });

        [true, false].forEach(selected => {
            [[0], [0, 1], [0, 2], [0, 1, 2], [2]].forEach(selectedKeys => {
                QUnit.test(`all.selected: ${selected}} -> setSelectedKey(${selectedKeys})`, function(assert) {
                    if(config.selectionMode === 'single') {
                        assert.ok('skip for single');
                        return;
                    }

                    const itemsCount = 3;
                    const items = [];
                    for(let i = 0; i < itemsCount; i++) {
                        items.push({ id: i, text: `item${i}`, parentId: ROOT_ID, selected, expanded: config.expanded });
                    }

                    const wrapper = createWrapper(config, {}, items);
                    wrapper.instance.setSelectedNodesKeys(selectedKeys);

                    const itemSelectionChangedEventCallCount = selected
                        ? itemsCount - selectedKeys.length
                        : selectedKeys.length;

                    let expectedEventLog = [];
                    for(let i = 0; i < itemSelectionChangedEventCallCount; i++) {
                        expectedEventLog.push('itemSelectionChanged');
                    }
                    if(itemSelectionChangedEventCallCount > 0) {
                        expectedEventLog.push('selectionChanged');
                    }

                    wrapper.checkSelectedKeys(selectedKeys);
                    wrapper.checkSelectedNodes(selectedKeys);
                    wrapper.checkEventLog(expectedEventLog);
                });
            });
        });

        QUnit.test('item1.selected: true, item2.selected:true -> setSelectedNodesKeys([key for item1_1]) -> expandAll', function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok('skip for single');
                return;
            }

            const wrapper = createWrapper(config, {}, [
                { id: 0, text: 'item1', parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 1, text: 'item1_1', parentId: 0, selected: false, expanded: config.expanded },
                { id: 2, text: 'item1_1_1', parentId: 1, selected: false, expanded: config.expanded },
                { id: 3, text: 'item2', parentId: ROOT_ID, selected: true, expanded: config.expanded }
            ]);

            wrapper.instance.setSelectedNodesKeys([1]);

            let expectedKeys = [0, 1, 2];
            let expectedNodes = [0, 1, 2];
            let expectedEventLog = ['itemSelectionChanged', 'selectionChanged'];
            if(!config.selectNodesRecursive) {
                expectedKeys = [1];
                expectedNodes = [1];
                expectedEventLog = ['itemSelectionChanged', 'itemSelectionChanged', 'itemSelectionChanged', 'selectionChanged'];
            }

            if(!config.expanded) {
                expectedNodes = [];
                if(config.selectNodesRecursive) {
                    expectedNodes = [0];
                    expectedEventLog = ['itemSelectionChanged', 'selectionChanged'];
                }
                if(isLazyDataSourceMode(wrapper)) {
                    // unexpected result
                    expectedNodes = [];
                    expectedKeys = [];
                    expectedEventLog = ['itemSelectionChanged', 'itemSelectionChanged', 'selectionChanged'];
                }
            }
            wrapper.checkSelectedKeys(expectedKeys, 'after select');
            wrapper.checkSelectedNodes(expectedNodes, 'after select');
            wrapper.checkEventLog(expectedEventLog, 'after select');
            wrapper.clearEventLog();

            wrapper.instance.expandAll();
            expectedKeys = [0, 1, 2];
            expectedNodes = [0, 1, 2];
            if(!config.selectNodesRecursive) {
                expectedKeys = [1];
                expectedNodes = [1];
            }
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                expectedKeys = [];
                expectedNodes = [];
            }
            wrapper.checkSelectedKeys(expectedKeys, 'after expand');
            wrapper.checkSelectedNodes(expectedNodes, 'after expand');
            wrapper.checkEventLog([], 'after expand');
        });
    });
});
