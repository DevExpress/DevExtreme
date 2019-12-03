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


['items', 'dataSource', 'createChildren'].forEach((dataSourceOption) => {
    [false, true].forEach((virtualModeEnabled) => {
        [false, true].forEach((expanded) => {
            [false, true].forEach((disabled) => {
                function createWrapper(options, items) {
                    const result = $.extend({ dataStructure: "plain", rootValue: 1, showCheckBoxesMode: "normal" }, options);
                    if(result.dataSourceOption === 'createChildren') {
                        const createChildFunction = (parent) => {
                            const parentId = (parent !== null)
                                ? parent.itemData.id
                                : result.rootValue;
                            return items.filter(function(item) { return parentId === item.parentId; });
                        };
                        result.createChildren = createChildFunction;
                    } else {
                        result[options.dataSourceOption] = items;
                    }
                    return new TreeViewTestWrapper(result);
                }

                function isLazyDataSourceMode(wrapper) {
                    const options = wrapper.instance.option();
                    return options.dataSource && options.virtualModeEnabled || options.createChildren;
                }

                QUnit.module(`DataSource: ${dataSourceOption}. VirtualModeEnabled: ${virtualModeEnabled}. Expanded: ${expanded}. Disabled: ${disabled}.`, () => {
                    QUnit.test(`selectionMode: multiple, selected: false -> getSelectedKeys`, function(assert) {
                        const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectionMode: 'multiple' }, [
                            { id: 1, text: "item1", parentId: 2, selected: false, expanded, disabled },
                            { id: 2, text: "item1_1", parentId: 1, selected: false, expanded, disabled }]);

                        wrapper.checkSelectedKeys([]);
                    });

                    QUnit.test(`selectionMode: multiple, selected: true -> getSelectedKeys`, function(assert) {
                        const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectionMode: 'multiple' }, [
                            { id: 1, text: "item1", parentId: 2, selected: true, expanded, disabled },
                            { id: 2, text: "item1_1", parentId: 1, selected: true, expanded, disabled }]);

                        const expectedKeys = !expanded && isLazyDataSourceMode(wrapper)
                            ? [2]
                            : [1, 2];

                        wrapper.checkSelectedKeys(expectedKeys);
                    });

                    QUnit.test(`selectionMode: multiple, selectNodesRecursive: false. Parent is selected -> getSelectedKeys`, function(assert) {
                        const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectionMode: 'multiple', selectNodesRecursive: false }, [
                            { id: 1, text: "item1", parentId: 2, selected: false, expanded, disabled },
                            { id: 2, text: "item1_1", parentId: 1, selected: true, expanded, disabled }]);

                        wrapper.checkSelectedKeys([2]);
                    });

                    QUnit.test(`selectionMode: multiple, selectNodesRecursive: false. Child is selected -> getSelectedKeys`, function(assert) {
                        const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectionMode: 'multiple', selectNodesRecursive: false }, [
                            { id: 1, text: "item1", parentId: 2, selected: true, expanded, disabled },
                            { id: 2, text: "item1_1", parentId: 1, selected: false, expanded, disabled }]);

                        const expectedKeys = !expanded && isLazyDataSourceMode(wrapper)
                            ? []
                            : [1];

                        wrapper.checkSelectedKeys(expectedKeys);
                    });

                    QUnit.test(`selectionMode: single, selected: lvl 0 -> getSelectedKeys`, function(assert) {
                        const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectionMode: 'single' }, [
                            { id: 1, text: "item1", parentId: 2, selected: false, expanded, disabled },
                            { id: 2, text: "item1_1", parentId: 3, selected: false, expanded, disabled },
                            { id: 3, text: "item1_1_1", parentId: 1, selected: true, expanded, disabled }]);

                        wrapper.checkSelectedKeys([3]);
                    });

                    QUnit.test(`selectionMode: single, selected: lvl 1 -> getSelectedKeys`, function(assert) {
                        const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectionMode: 'single' }, [
                            { id: 1, text: "item1", parentId: 2, selected: false, expanded, disabled },
                            { id: 2, text: "item1_1", parentId: 3, selected: true, expanded, disabled },
                            { id: 3, text: "item1_1_1", parentId: 1, selected: false, expanded, disabled }]);

                        const expectedKeys = !expanded && isLazyDataSourceMode(wrapper)
                            ? []
                            : [2];

                        wrapper.checkSelectedKeys(expectedKeys);
                    });

                    QUnit.test(`selectionMode: single, selected: lvl 2 -> getSelectedKeys`, function(assert) {
                        const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectionMode: 'single' }, [
                            { id: 1, text: "item1", parentId: 2, selected: true, expanded, disabled },
                            { id: 2, text: "item1_1", parentId: 3, selected: false, expanded, disabled },
                            { id: 3, text: "item1_1_1", parentId: 1, selected: false, expanded, disabled }]);

                        const expectedKeys = !expanded && isLazyDataSourceMode(wrapper)
                            ? []
                            : [1];

                        wrapper.checkSelectedKeys(expectedKeys);
                    });

                    QUnit.test(`selectionMode: single, selected: all -> getSelectedKeys`, function(assert) {
                        const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectionMode: 'single' }, [
                            { id: 1, text: "item1", parentId: 2, selected: true, expanded, disabled },
                            { id: 2, text: "item1_1", parentId: 3, selected: true, expanded, disabled },
                            { id: 3, text: "item1_1_1", parentId: 1, selected: true, expanded, disabled }]);

                        const expectedKeys = expanded && isLazyDataSourceMode(wrapper)
                            ? [1]
                            : [3];

                        wrapper.checkSelectedKeys(expectedKeys);
                    });

                    [true, false].forEach((selected) => {
                        QUnit.test(`selectionMode: multiple, selected: ${selected}, selectNodesRecursive: true -> selectItem(lvl0_key)`, function(assert) {
                            const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectNodesRecursive: true }, [
                                { id: 1, text: "item1", parentId: 2, selected, expanded, disabled },
                                { id: 2, text: "item1_1", parentId: 1, selected, expanded, disabled }]);
                            wrapper.instance.selectItem(2);

                            const expectedKeys = !expanded && isLazyDataSourceMode(wrapper)
                                ? [2]
                                : [1, 2];
                            wrapper.checkSelectedKeys(expectedKeys);
                        });
                    });

                    QUnit.test(`selectionMode: multiple, selected: false, selectNodesRecursive: true -> selectItem(lvl1_key)`, function(assert) {
                        const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectNodesRecursive: true }, [
                            { id: 1, text: "item1", parentId: 2, selected: false, expanded, disabled },
                            { id: 2, text: "item1_1", parentId: 1, selected: false, expanded, disabled }]);
                        wrapper.instance.selectItem(1);

                        const expectedKeys = !expanded && isLazyDataSourceMode(wrapper)
                            ? []
                            : [1, 2];
                        wrapper.checkSelectedKeys(expectedKeys);
                    });

                    [true, false].forEach((selected) => {
                        QUnit.test(`selectionMode: multiple, selected: ${selected}, selectNodesRecursive: false -> selectItem(lvl0_key)`, function(assert) {
                            const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectNodesRecursive: false }, [
                                { id: 1, text: "item1", parentId: 2, selected: false, expanded, disabled },
                                { id: 2, text: "item1_1", parentId: 1, selected, expanded, disabled }]);
                            wrapper.instance.selectItem(2);

                            wrapper.checkSelectedKeys([2]);
                        });
                    });

                    QUnit.test(`selectionMode: multiple, selected: false, selectNodesRecursive: false -> selectItem(lvl1_key)`, function(assert) {
                        const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectNodesRecursive: false }, [
                            { id: 1, text: "item1", parentId: 2, selected: false, expanded, disabled },
                            { id: 2, text: "item1_1", parentId: 1, selected: false, expanded, disabled }]);
                        wrapper.instance.selectItem(1);

                        const expectedKeys = !expanded && isLazyDataSourceMode(wrapper)
                            ? []
                            : [1];
                        wrapper.checkSelectedKeys(expectedKeys);
                    });

                    [true, false].forEach((selected) => {
                        [true, false].forEach((selectNodesRecursive) => {
                            QUnit.test(`selectionMode: single, selected: ${selected}, selectNodesRecursive: ${selectNodesRecursive} -> selectItem(lvl0_key)`, function(assert) {
                                const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectNodesRecursive, selectionMode: 'single' }, [
                                    { id: 1, text: "item1", parentId: 2, selected: false, expanded, disabled },
                                    { id: 2, text: "item1_1", parentId: 1, selected, expanded, disabled }]);
                                wrapper.instance.selectItem(2);

                                wrapper.checkSelectedKeys([2]);
                            });

                            QUnit.test(`selectionMode: single, selected: ${selected}, selectNodesRecursive: ${selectNodesRecursive} -> selectItem(lvl1_key)`, function(assert) {
                                const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectNodesRecursive, selectionMode: 'single' }, [
                                    { id: 1, text: "item1", parentId: 2, selected, expanded, disabled },
                                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded, disabled }]);
                                wrapper.instance.selectItem(1);

                                const expectedKeys = !expanded && isLazyDataSourceMode(wrapper)
                                    ? []
                                    : [1];
                                wrapper.checkSelectedKeys(expectedKeys);
                            });
                        });
                    });

                    [{ selectItemArgumentType: '$node', itemGetter: ($item) => $item },
                        { selectItemArgumentType: 'DOMElement', itemGetter: ($item) => $item.get(0) }].forEach((config) => {
                        QUnit.test(`selectionMode: multiple, selected: false -> selectItem(lvl0_${config.selectItemArgumentType}})`, function(assert) {
                            const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectionMode: 'multiple' }, [
                                { id: 1, text: "item1", parentId: 2, selected: false, expanded, disabled },
                                { id: 2, text: "item1_1", parentId: 1, selected: false, expanded, disabled }]);

                            const $root = wrapper.getElement().find('[aria-level="1"]');
                            wrapper.instance.selectItem(config.itemGetter($root));

                            const expectedKeys = !expanded && isLazyDataSourceMode(wrapper)
                                ? [2]
                                : [1, 2];
                            wrapper.checkSelectedKeys(expectedKeys);
                        });
                    });

                    [true, false].forEach((selected) => {
                        QUnit.test(`selectionMode: multiple, selected: ${selected}, selectNodesRecursive: true -> unselectItem(lvl0_key)`, function(assert) {
                            const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectionMode: 'multiple', selectNodesRecursive: true }, [
                                { id: 1, text: "item1", parentId: 2, selected, expanded, disabled },
                                { id: 2, text: "item1_1", parentId: 1, selected, expanded, disabled }]);
                            wrapper.instance.unselectItem(2);

                            wrapper.checkSelectedKeys([]);
                        });
                    });

                    QUnit.test(`selectionMode: multiple, selected: true, selectNodesRecursive: true -> unselectItem(lvl1_key)`, function(assert) {
                        const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectionMode: 'multiple', selectNodesRecursive: true }, [
                            { id: 1, text: "item1", parentId: 2, selected: true, expanded, disabled },
                            { id: 2, text: "item1_1", parentId: 1, selected: true, expanded, disabled }]);
                        wrapper.instance.unselectItem(1);

                        const expectedKeys = !expanded && isLazyDataSourceMode(wrapper)
                            ? [2]
                            : [];

                        wrapper.checkSelectedKeys(expectedKeys);
                    });

                    [true, false].forEach((selected) => {
                        QUnit.test(`selectionMode: multiple, selected: ${selected}, selectNodesRecursive: false -> usselectItem(lvl0_key)`, function(assert) {
                            const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectionMode: 'multiple', selectNodesRecursive: false }, [
                                { id: 1, text: "item1", parentId: 2, selected: false, expanded, disabled },
                                { id: 2, text: "item1_1", parentId: 1, selected, expanded, disabled }]);
                            wrapper.instance.unselectItem(2);

                            wrapper.checkSelectedKeys([]);
                        });
                    });

                    QUnit.test(`selectionMode: multiple, selected: true, selectNodesRecursive: false -> unselectItem(lvl1_key)`, function(assert) {
                        const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectionMode: 'multiple', selectNodesRecursive: false }, [
                            { id: 1, text: "item1", parentId: 2, selected: true, expanded, disabled },
                            { id: 2, text: "item1_1", parentId: 1, selected: true, expanded, disabled }]);
                        wrapper.instance.unselectItem(1);

                        wrapper.checkSelectedKeys([2]);
                    });

                    [true, false].forEach((selected) => {
                        [true, false].forEach((selectNodesRecursive) => {
                            QUnit.test(`selectionMode: single, selected: ${selected}, selectNodesRecursive: ${selectNodesRecursive} -> unselectItem(lvl0_key)`, function(assert) {
                                const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectNodesRecursive, selectionMode: 'single' }, [
                                    { id: 1, text: "item1", parentId: 2, selected: false, expanded, disabled },
                                    { id: 2, text: "item1_1", parentId: 1, selected, expanded, disabled }]);
                                wrapper.instance.unselectItem(2);

                                wrapper.checkSelectedKeys([]);
                            });

                            QUnit.test(`selectionMode: single, selected: ${selected}, selectNodesRecursive: ${selectNodesRecursive} -> unselectItem(lvl1_key)`, function(assert) {
                                const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectNodesRecursive, selectionMode: 'single' }, [
                                    { id: 1, text: "item1", parentId: 2, selected, expanded, disabled },
                                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded, disabled }]);
                                wrapper.instance.unselectItem(1);
                                wrapper.checkSelectedKeys([]);
                            });
                        });
                    });

                    [{ selectItemArgumentType: '$node', itemGetter: ($item) => $item },
                        { selectItemArgumentType: 'DOMElement', itemGetter: ($item) => $item.get(0) }].forEach((config) => {
                        QUnit.test(`selectionMode: multiple, selected: false -> unselectItem(lvl0_${config.selectItemArgumentType}})`, function(assert) {
                            const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectionMode: 'multiple' }, [
                                { id: 1, text: "item1", parentId: 2, selected: false, expanded, disabled },
                                { id: 2, text: "item1_1", parentId: 1, selected: false, expanded, disabled }]);

                            const $root = wrapper.getElement().find('[aria-level="1"]');
                            wrapper.instance.unselectItem(config.itemGetter($root));

                            wrapper.checkSelectedKeys([]);
                        });
                    });

                    [true, false].forEach((selected) => {
                        [true, false].forEach((selectNodesRecursive) => {
                            QUnit.test(`selectionMode: multiple, selectNodesRecursive: ${selectNodesRecursive}, selected: ${selected} -> selectAll`, function(assert) {
                                const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectNodesRecursive, selectionMode: 'multiple' }, [
                                    { id: 1, text: "item1", parentId: 2, selected, expanded, disabled },
                                    { id: 2, text: "item1_1", parentId: 1, selected, expanded, disabled }]);

                                wrapper.instance.selectAll();

                                const expectedKeys = !expanded && isLazyDataSourceMode(wrapper)
                                    ? [2]
                                    : [1, 2];

                                wrapper.checkSelectedKeys(expectedKeys);
                            });

                            QUnit.test(`selectionMode: single, selected: ${selected}, selectNodesRecursive: ${selectNodesRecursive} -> selectAll`, function(assert) {
                                const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectNodesRecursive, selectionMode: 'single' }, [
                                    { id: 1, text: "item1", parentId: 2, selected: false, expanded, disabled },
                                    { id: 2, text: "item1_1", parentId: 1, selected, expanded, disabled }]);
                                wrapper.instance.selectAll();

                                const expectedKeys = expanded && isLazyDataSourceMode(wrapper)
                                    ? [1]
                                    : [2];

                                wrapper.checkSelectedKeys(expectedKeys);
                            });
                        });
                    });


                    [true, false].forEach((selected) => {
                        [true, false].forEach((selectNodesRecursive) => {
                            QUnit.test(`selectionMode: multiple, , selectNodesRecursive: ${selectNodesRecursive}, selected: ${selected} -> unselectAll`, function(assert) {
                                const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectNodesRecursive, selectionMode: 'multiple' }, [
                                    { id: 1, text: "item1", parentId: 2, selected, expanded, disabled },
                                    { id: 2, text: "item1_1", parentId: 1, selected, expanded, disabled }]);

                                wrapper.instance.unselectAll();
                                wrapper.checkSelectedKeys([]);
                            });


                            QUnit.test(`selectionMode: single, selected: ${selected}, selectNodesRecursive: ${selectNodesRecursive} -> unselectAll`, function(assert) {
                                const wrapper = createWrapper({ dataSourceOption, virtualModeEnabled, selectNodesRecursive, selectionMode: 'single' }, [
                                    { id: 1, text: "item1", parentId: 2, selected: false, expanded, disabled },
                                    { id: 2, text: "item1_1", parentId: 1, selected, expanded, disabled }]);

                                wrapper.instance.unselectAll();
                                wrapper.checkSelectedKeys([]);
                            });
                        });
                    });
                });
            });
        });
    });
});

