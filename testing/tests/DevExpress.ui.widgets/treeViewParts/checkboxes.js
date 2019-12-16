/* global DATA, data2, internals, initTree */
import TreeViewTestWrapper from "../../../helpers/TreeViewTestHelper.js";
import $ from "jquery";

QUnit.module("Checkboxes");

QUnit.test("Set intermediate state for parent if at least a one child is selected", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].items[1].items[0].expanded = true;
    data[0].items[1].items[1].expanded = true;
    var $treeView = initTree({
        items: data,
        showCheckBoxesMode: "normal"
    });

    var checkboxes = $treeView.find(".dx-checkbox");
    $(checkboxes[4]).trigger("dxclick");

    assert.equal($(checkboxes[4]).dxCheckBox("instance").option("value"), true);
    assert.equal($(checkboxes[3]).dxCheckBox("instance").option("value"), false);
    assert.equal($(checkboxes[2]).dxCheckBox("instance").option("value"), undefined);
    assert.equal($(checkboxes[1]).dxCheckBox("instance").option("value"), false);
    assert.equal($(checkboxes[0]).dxCheckBox("instance").option("value"), undefined);
});

QUnit.test("selectNodesRecursive = false", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].items[1].items[0].expanded = true;
    data[0].items[1].items[1].expanded = true;

    var $treeView = initTree({
        items: data,
        selectNodesRecursive: false,
        showCheckBoxesMode: "normal"
    });

    var checkboxes = $treeView.find(".dx-checkbox");
    $(checkboxes[4]).trigger("dxclick");

    assert.equal($(checkboxes[4]).dxCheckBox("instance").option("value"), true);
    assert.equal($(checkboxes[3]).dxCheckBox("instance").option("value"), false);
    assert.equal($(checkboxes[2]).dxCheckBox("instance").option("value"), false);
    assert.equal($(checkboxes[1]).dxCheckBox("instance").option("value"), false);
    assert.equal($(checkboxes[0]).dxCheckBox("instance").option("value"), false);
});

QUnit.test("Remove intermediate state from parent if all children are unselected", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].items[1].items[0].expanded = true;
    data[0].items[1].items[1].expanded = true;

    var $treeView = initTree({
        items: data,
        showCheckBoxesMode: "normal"
    });

    var checkboxes = $treeView.find(".dx-checkbox");
    $(checkboxes[4]).trigger("dxclick");
    $(checkboxes[3]).trigger("dxclick");
    $(checkboxes[4]).trigger("dxclick");

    assert.equal($(checkboxes[4]).dxCheckBox("instance").option("value"), false);
    assert.equal($(checkboxes[3]).dxCheckBox("instance").option("value"), true);
    assert.equal($(checkboxes[2]).dxCheckBox("instance").option("value"), undefined);
    assert.equal($(checkboxes[1]).dxCheckBox("instance").option("value"), false);
    assert.equal($(checkboxes[0]).dxCheckBox("instance").option("value"), undefined);

    $(checkboxes[3]).trigger("dxclick");
    assert.equal($(checkboxes[4]).dxCheckBox("instance").option("value"), false);
    assert.equal($(checkboxes[3]).dxCheckBox("instance").option("value"), false);
    assert.equal($(checkboxes[2]).dxCheckBox("instance").option("value"), false);
    assert.equal($(checkboxes[1]).dxCheckBox("instance").option("value"), false);
    assert.equal($(checkboxes[0]).dxCheckBox("instance").option("value"), false);
});

QUnit.test("Parent node should be selected if all children are selected", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].items[1].items[0].expanded = true;
    data[0].items[1].items[1].expanded = true;
    var $treeView = initTree({
        items: data,
        showCheckBoxesMode: "normal"
    });

    var checkboxes = $treeView.find(".dx-checkbox");
    $(checkboxes[4]).trigger("dxclick");
    $(checkboxes[3]).trigger("dxclick");

    assert.equal($(checkboxes[4]).dxCheckBox("instance").option("value"), true);
    assert.equal($(checkboxes[3]).dxCheckBox("instance").option("value"), true);
    assert.equal($(checkboxes[2]).dxCheckBox("instance").option("value"), true);
    assert.equal($(checkboxes[1]).dxCheckBox("instance").option("value"), false);
    assert.equal($(checkboxes[0]).dxCheckBox("instance").option("value"), undefined);
});

QUnit.test("All children should be selected/unselected after click on parent node", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].items[1].items[0].expanded = true;
    data[0].items[1].items[1].expanded = true;
    var $treeView = initTree({
        items: data,
        showCheckBoxesMode: "normal"
    });

    var checkboxes = $treeView.find(".dx-checkbox");

    $(checkboxes[2]).trigger("dxclick");

    assert.equal($(checkboxes[4]).dxCheckBox("instance").option("value"), true);
    assert.equal($(checkboxes[3]).dxCheckBox("instance").option("value"), true);
    assert.equal($(checkboxes[2]).dxCheckBox("instance").option("value"), true);

    $(checkboxes[2]).trigger("dxclick");

    assert.equal($(checkboxes[4]).dxCheckBox("instance").option("value"), false);
    assert.equal($(checkboxes[3]).dxCheckBox("instance").option("value"), false);
    assert.equal($(checkboxes[2]).dxCheckBox("instance").option("value"), false);
});

QUnit.test("Regression: incorrect parent state", function(assert) {
    var data = $.extend(true, [], data2);
    data[2].expanded = true;

    var $treeView = initTree({
        dataSource: data,
        dataStructure: "plain",
        showCheckBoxesMode: "normal"
    });

    var checkboxes = $treeView.find(".dx-checkbox");

    $(checkboxes[3]).trigger("dxclick");
    $(checkboxes[4]).trigger("dxclick");
    $(checkboxes[5]).trigger("dxclick");
    $(checkboxes[6]).trigger("dxclick");

    assert.equal($(checkboxes[2]).dxCheckBox("instance").option("value"), true);
    assert.equal($(checkboxes[0]).dxCheckBox("instance").option("value"), undefined);

});

QUnit.test("T173381", function(assert) {
    var $treeView = initTree({
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
            showCheckBoxesMode: "normal"
        }),
        checkboxes = $treeView.find(".dx-checkbox");

    $(checkboxes[2]).trigger("dxclick");
    assert.strictEqual($(checkboxes[0]).dxCheckBox("instance").option("value"), undefined);

    $(checkboxes[6]).trigger("dxclick");
    assert.strictEqual($(checkboxes[0]).dxCheckBox("instance").option("value"), undefined);

    $(checkboxes[6]).trigger("dxclick");
    assert.strictEqual($(checkboxes[0]).dxCheckBox("instance").option("value"), undefined);
});

QUnit.test("T195986", function(assert) {
    var $treeView = initTree({
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
            showCheckBoxesMode: "normal"
        }),
        checkboxes = $treeView.find(".dx-checkbox");
    $(checkboxes[3]).trigger("dxclick");
    assert.strictEqual($(checkboxes[0]).dxCheckBox("instance").option("value"), undefined);

    $(checkboxes[3]).trigger("dxclick");
    assert.strictEqual($(checkboxes[0]).dxCheckBox("instance").option("value"), true);
});

QUnit.test("Selection works correct with custom rootValue", function(assert) {
    var data = [
            { id: 0, parentId: "none", text: "Animals" },
            { id: 1, parentId: 0, text: "Cat" },
            { id: 2, parentId: 0, text: "Dog" },
            { id: 3, parentId: 0, text: "Cow" },
            { id: 4, parentId: "none", text: "Birds" }
        ],
        treeView = initTree({
            dataSource: data,
            dataStructure: "plain",
            showCheckBoxesMode: "normal",
            rootValue: "none"
        }).dxTreeView("instance"),
        $icon = $(treeView.$element()).find("." + internals.TOGGLE_ITEM_VISIBILITY_CLASS).eq(0),
        $checkbox,
        nodes;

    $icon.trigger("dxclick");
    assert.equal(treeView.option("items").length, 5);

    $checkbox = treeView.$element().find(".dx-checkbox");
    $($checkbox.eq(1)).trigger("dxclick");
    nodes = treeView.getNodes();
    assert.ok(nodes[0].items[0].selected, "item was selected");
    assert.strictEqual(nodes[0].selected, undefined, "item selection has undefined state");
});

function createWrapper(config, options, items) {
    const result = $.extend({}, config, options, { dataStructure: "plain", rootValue: ROOT_ID, showCheckBoxesMode: "normal" });
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

const ROOT_ID = 0;
configs.forEach(config => {
    QUnit.module(`SelectionMode: ${config.selectionMode}, dataSource: ${config.dataSourceOption}, virtualModeEnabled: ${config.virtualModeEnabled}, expanded: ${config.expanded}, selectNodesRecursive: ${config.selectNodesRecursive}`, () => {
        QUnit.test(`all.selected: false`, function(assert) {
            // check via dataSource
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded }]);
            wrapper.checkSelectedKeys([], ' - check via dataSource items');
            wrapper.checkCallbacks([], ' - check via dataSource items');
            wrapper.instance.dispose();

            // check via property
            wrapper = createWrapper(config, { selectedItemKeys: [] }, [
                { id: 1, text: "item1", parentId: ROOT_ID, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, expanded: config.expanded }]);
            wrapper.checkSelectedKeys([], ' - check via selectedItemKeys option');
            wrapper.checkCallbacks([], ' - check via dataSource items');
        });

        QUnit.test(`all.selected: false -> selectAll -> expandAll`, function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok("skip for 'single'");
                return;
            }
            // check via dataSource
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded }]);
            wrapper.instance.selectAll();

            let expectedKeys = [1, 2];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');
            wrapper.checkCallbacks(['selectionChanged'], ' - check via dataSource items');

            wrapper.instance.expandAll();
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1];
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2];
                }
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');
            wrapper.checkCallbacks(['selectionChanged'], ' - check via dataSource items');
            wrapper.instance.dispose();

            // check via property
            wrapper = createWrapper(config, { selectedItemKeys: [] }, [
                { id: 1, text: "item1", parentId: ROOT_ID, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, expanded: config.expanded }]);
            wrapper.instance.option('selectedItemKeys', [1, 2]);

            expectedKeys = [1, 2];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');

            wrapper.instance.expandAll();
            if(config.selectNodesRecursive) {
                expectedKeys = [1, 2];
            }

            let expectedCalls = ['itemSelectionChanged', 'itemSelectionChanged', 'selectionChanged'];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedCalls = ['itemSelectionChanged', 'selectionChanged'];
            }
            if(config.selectNodesRecursive) {
                expectedCalls = ['itemSelectionChanged', 'selectionChanged'];
            }

            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');
            wrapper.checkCallbacks(expectedCalls, ' - check via selectedItemKeys option');
        });

        QUnit.test(`all.selected: false -> selectItem(1) -> expandAll`, function(assert) {
            // check via dataSource
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded }]);
            wrapper.instance.selectItem(1);

            let expectedKeys = [1];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2];
                }
                if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                    // unexpected result
                    expectedKeys = [1];
                }
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');

            wrapper.instance.expandAll();
            if(config.selectionMode === 'multiple') {
                if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                    // unexpected result
                    if(config.selectNodesRecursive) {
                        expectedKeys = [1, 2];
                    }
                }
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');
            wrapper.instance.dispose();

            // check via property
            wrapper = createWrapper(config, { selectedItemKeys: [] }, [
                { id: 1, text: "item1", parentId: ROOT_ID, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, expanded: config.expanded }]);
            wrapper.instance.option('selectedItemKeys', [1]);

            expectedKeys = [1];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2];
                }
                if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                    // unexpected result
                    expectedKeys = [1];
                }
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');

            wrapper.instance.expandAll();
            if(config.selectionMode === 'multiple' && config.selectNodesRecursive) {
                expectedKeys = [1, 2];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys items');
        });

        QUnit.test(`all.selected: false -> selectItem(2) -> expandAll`, function(assert) {
            // check via dataSource
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded }]);
            wrapper.instance.selectItem(2);

            let expectedKeys = [2];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2];
                }
            }
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');

            wrapper.instance.expandAll();
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');
            wrapper.instance.dispose();

            // check via property
            wrapper = createWrapper(config, { selectedItemKeys: [] }, [
                { id: 1, text: "item1", parentId: ROOT_ID, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, expanded: config.expanded }]);

            wrapper.instance.option('selectedItemKeys', [2]);

            expectedKeys = [2];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2];
                }
            }
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');

            wrapper.instance.expandAll();
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');
        });

        QUnit.test(`all.selected: true`, function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok("skip for 'single'");
                return;
            }

            // check via dataSource
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded }]);

            let expectedKeys = [1, 2];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');
            wrapper.instance.dispose();

            // check via property
            wrapper = createWrapper(config, { selectedItemKeys: [1, 2] }, [
                { id: 1, text: "item1", parentId: ROOT_ID, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, expanded: config.expanded }]);

            expectedKeys = [1, 2];
            if((!config.expanded || !config.selectNodesRecursive) && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');
        });

        QUnit.test(`all.selected: true -> expandAll`, function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok("skip for 'single'");
                return;
            }

            // check via dataSource
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded }]);

            wrapper.instance.expandAll();

            let expectedKeys = [1, 2];
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');
            wrapper.instance.dispose();

            // check via property
            wrapper = createWrapper(config, { selectedItemKeys: [1, 2] }, [
                { id: 1, text: "item1", parentId: ROOT_ID, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, expanded: config.expanded }]);

            wrapper.instance.expandAll();

            expectedKeys = [1, 2];
            if(!config.selectNodesRecursive && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');
        });

        QUnit.test(`all.selected: true -> unselectAll -> expandAll`, function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok("skip for 'single'");
                return;
            }
            // check via dataSource
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded }]);

            wrapper.instance.unselectAll();

            let expectedKeys = [];
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');

            wrapper.instance.expandAll();
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [2];
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2];
                }
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');
            wrapper.instance.dispose();

            // check via property
            wrapper = createWrapper(config, { selectedItemKeys: [1, 2] }, [
                { id: 1, text: "item1", parentId: ROOT_ID, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, expanded: config.expanded }]);
            wrapper.instance.option('selectedItemKeys', [], ' - check via selectedItemKeys option');
            wrapper.instance.expandAll();

            expectedKeys = [];
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');
        });

        QUnit.test(`all.selected: true -> unselectItem(1) -> expandAll`, function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok("skip for 'single'");
                return;
            }

            // check via dataSource
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded }]);

            wrapper.instance.unselectItem(1);

            let expectedKeys = [2];
            if(config.selectNodesRecursive) {
                expectedKeys = [];
            }
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [];
            }
            wrapper.checkSelectedKeys(expectedKeys);

            wrapper.instance.expandAll();

            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [2];
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2];
                }
            }
            wrapper.checkSelectedKeys(expectedKeys);
            wrapper.instance.dispose();
        });

        QUnit.test(`all.selected: true -> unselectItem(2) -> expandAll`, function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok("skip for 'single'");
                return;
            }

            // check via dataSource
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded }]);

            wrapper.instance.unselectItem(2);

            let expectedKeys = [1];
            if(config.selectNodesRecursive) {
                expectedKeys = [];
            }
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1];
            }
            wrapper.checkSelectedKeys(expectedKeys, 'via dataSource');

            wrapper.instance.expandAll();
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1, 2];
            }
            wrapper.checkSelectedKeys(expectedKeys);
            wrapper.instance.dispose();
        });

        QUnit.test(`item1.selected: true`, function() {
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

            let expectedKeys = [1];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2, 3];
                }
                if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                    // unexpected result
                    expectedKeys = [1];
                }
            }
            wrapper.checkSelectedKeys(expectedKeys);
            wrapper.instance.dispose();

            wrapper = createWrapper(config, { selectedItemKeys: [1] }, [
                { id: 1, text: "item1", parentId: ROOT_ID, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, expanded: config.expanded }]);

            expectedKeys = [1];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2, 3];
                }
                if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                    // unexpected result
                    expectedKeys = [1];
                }
            }
            wrapper.checkSelectedKeys(expectedKeys);
        });

        QUnit.test(`item1.selected: true -> expandAll`, function() {
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

            wrapper.instance.expandAll();

            let expectedKeys = [1];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2, 3];
                }
                if(!config.expanded && isLazyDataSourceMode(wrapper) && config.selectNodesRecursive) {
                    // unexpected result
                    expectedKeys = [1, 2];
                }
            }

            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');
            wrapper.instance.dispose();

            wrapper = createWrapper(config, { selectedItemKeys: [1] }, [
                { id: 1, text: "item1", parentId: ROOT_ID, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, expanded: config.expanded }]);

            wrapper.instance.expandAll();

            expectedKeys = [1];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2, 3];
                }
                if(!config.expanded && isLazyDataSourceMode(wrapper) && config.selectNodesRecursive) {
                    // unexpected result
                    expectedKeys = [1, 2];
                }
            }

            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');
        });

        QUnit.test(`item1.selected: true -> selectAll -> expandAll`, function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok("skip for 'single'");
                return;
            }
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

            wrapper.instance.selectAll();

            let expectedKeys = [1, 2, 3];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');

            wrapper.instance.expandAll();
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2];
                } else {
                    expectedKeys = [1];
                }
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');
            wrapper.instance.dispose();

            wrapper = createWrapper(config, { selectedItemKeys: [1] }, [
                { id: 1, text: "item1", parentId: ROOT_ID, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, expanded: config.expanded }]);

            wrapper.instance.option('selectedItemKeys', [1, 2, 3]);

            expectedKeys = [1, 2, 3];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');

            wrapper.instance.expandAll();
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2];
                } else {
                    expectedKeys = [1];
                }
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');
        });

        QUnit.test(`item1.selected: true -> unselectAll -> expandAll`, function(assert) {
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: true, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

            wrapper.instance.unselectAll();

            let expectedKeys = [];
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');

            wrapper.instance.expandAll();
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');
            wrapper.instance.dispose();


            wrapper = createWrapper(config, { selectedItemKeys: [1] }, [
                { id: 1, text: "item1", parentId: ROOT_ID, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, expanded: config.expanded }]);

            wrapper.instance.option('selectedItemKeys', []);

            expectedKeys = [];
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');

            wrapper.instance.expandAll();
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');
        });


        QUnit.test(`item1_1.selected: true`, function() {
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

            let expectedKeys = [2];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2, 3];
                }
            }
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');
            wrapper.instance.dispose();

            wrapper = createWrapper(config, { selectedItemKeys: [2] }, [
                { id: 1, text: "item1", parentId: ROOT_ID, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, expanded: config.expanded }]);

            expectedKeys = [2];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2, 3];
                }
            }
            if(isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');
        });


        QUnit.test(`item1_1.selected: true -> expandAll`, function() {
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

            wrapper.instance.expandAll();

            let expectedKeys = [2];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2, 3];
                }
                if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                    // unexpected result
                    if(config.selectNodesRecursive) {
                        expectedKeys = [1, 2];
                    } else {
                        expectedKeys = [2];
                    }
                }
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');
            wrapper.instance.dispose();

            wrapper = createWrapper(config, { selectedItemKeys: [2] }, [
                { id: 1, text: "item1", parentId: ROOT_ID, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, expanded: config.expanded }]);

            wrapper.instance.expandAll();

            expectedKeys = [2];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2, 3];
                }
            }
            if(isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');
        });

        QUnit.test(`item1_1.selected: true -> selectAll -> expandAll`, function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok("skip for 'single'");
                return;
            }
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

            wrapper.instance.selectAll();

            let expectedKeys = [1, 2, 3];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');

            wrapper.instance.expandAll();

            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1, 2];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');
            wrapper.instance.dispose();

            wrapper = createWrapper(config, { selectedItemKeys: [2] }, [
                { id: 1, text: "item1", parentId: ROOT_ID, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, expanded: config.expanded }]);

            wrapper.instance.option('selectedItemKeys', [1, 2, 3]);
            expectedKeys = [1, 2, 3];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');

            wrapper.instance.expandAll();
            expectedKeys = [1, 2, 3];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1];
                if(config.selectNodesRecursive) {
                    // unexpected result
                    expectedKeys = [1, 2];
                }
            }

            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');
        });

        QUnit.test(`item1_1.selected: true -> unselectAll -> expandAll`, function(assert) {
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, selected: false, expanded: config.expanded }]);

            wrapper.instance.unselectAll();

            let expectedKeys = [];
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');

            wrapper.instance.expandAll();

            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [2];
                if(config.selectionMode === "multiple" && config.selectNodesRecursive) {
                    expectedKeys = [1, 2];
                }
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');
            wrapper.instance.dispose();

            wrapper = createWrapper(config, { selectedItemKeys: [2] }, [
                { id: 1, text: "item1", parentId: ROOT_ID, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, expanded: config.expanded }]);

            wrapper.instance.option('selectedItemKeys', []);

            expectedKeys = [];
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');

            wrapper.instance.expandAll();
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');
        });

        QUnit.test(`item1_1_1.selected: true`, function() {
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, selected: true, expanded: config.expanded }]);

            let expectedKeys = [3];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2, 3];
                }
            }
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');
            wrapper.instance.dispose();

            wrapper = createWrapper(config, { selectedItemKeys: [3] }, [
                { id: 1, text: "item1", parentId: ROOT_ID, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, expanded: config.expanded }]);

            expectedKeys = [3];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2, 3];
                }
            }
            if(isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');
        });

        QUnit.test(`item1_1_1.selected: true -> expandAll`, function() {
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, selected: true, expanded: config.expanded }]);

            wrapper.instance.expandAll();

            let expectedKeys = [3];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2, 3];
                }
            }
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');
            wrapper.instance.dispose();

            wrapper = createWrapper(config, { selectedItemKeys: [3] }, [
                { id: 1, text: "item1", parentId: ROOT_ID, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, expanded: config.expanded }]);

            wrapper.instance.expandAll();

            expectedKeys = [3];
            if(config.selectionMode === 'multiple') {
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2, 3];
                }
            }
            if(isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');
        });

        QUnit.test(`item1_1_1.selected: true -> selectAll -> expandAll`, function(assert) {
            if(config.selectionMode === 'single') {
                assert.ok("skip for 'single'");
                return;
            }
            let wrapper = createWrapper(config, {}, [
                { id: 1, text: "item1", parentId: ROOT_ID, selected: false, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, selected: true, expanded: config.expanded }]);

            wrapper.instance.selectAll();

            let expectedKeys = [1, 2, 3];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');

            wrapper.instance.expandAll();
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                if(config.selectNodesRecursive) {
                    expectedKeys = [1, 2];
                } else {
                    expectedKeys = [1];
                }
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via dataSource items');
            wrapper.instance.dispose();

            wrapper = createWrapper(config, { selectedItemKeys: [3] }, [
                { id: 1, text: "item1", parentId: ROOT_ID, expanded: config.expanded },
                { id: 2, text: "item1_1", parentId: 1, expanded: config.expanded },
                { id: 3, text: "item1_1_1", parentId: 2, expanded: config.expanded }]);

            wrapper.instance.option('selectedItemKeys', [1, 2, 3]);
            expectedKeys = [1, 2, 3];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1];
            }
            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');

            wrapper.instance.expandAll();
            expectedKeys = [1, 2, 3];
            if(!config.expanded && isLazyDataSourceMode(wrapper)) {
                // unexpected result
                expectedKeys = [1];
                if(config.selectNodesRecursive) {
                    // unexpected result
                    expectedKeys = [1, 2];
                }
            }

            wrapper.checkSelectedKeys(expectedKeys, ' - check via selectedItemKeys option');
        });
    });
});
