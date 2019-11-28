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
    [false, true].forEach((isVirtualModeEnabled) => {
        QUnit.module(`Checkbox selection. DataSource: ${dataSourceOption}. VirtualModeEnabled: ${isVirtualModeEnabled} (T832760)`, () => {
            QUnit.test(`Initialization`, function(assert) {
                const testSamples = [{ selectedOption: true, expectedSelected: [0, 1] }, { selectedOption: false, expectedSelected: [] } ];
                testSamples.forEach((testData) => {
                    let options = createOptions(dataSourceOption, isVirtualModeEnabled, [
                        { id: 1, text: "item1", parentId: 2, expanded: true, selected: testData.selectedOption },
                        { id: 2, text: "item1_1", parentId: 1, expanded: true, selected: testData.selectedOption }]);
                    options['showCheckBoxesMode'] = "normal";

                    const wrapper = new TreeViewTestWrapper(options);
                    assert.notEqual(wrapper.instance, undefined);
                    wrapper.checkSelectedNodes(testData.expectedSelected);
                    wrapper.instance.dispose();
                });
            });

            function runSelectItemTest(argumentGetter) {
                let options = createOptions(dataSourceOption, isVirtualModeEnabled, [
                    { id: 1, text: "item1", parentId: 2, selected: true, expanded: true },
                    { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: true }]);
                const wrapper = new TreeViewTestWrapper(options);

                const $parent = wrapper.getElement().find('[aria-level="1"]');

                wrapper.instance.selectItem(argumentGetter($parent));
                wrapper.checkSelectedNodes([0, 1]);
                wrapper.instance.dispose();
            }

            QUnit.test(`selectItem($node)`, function() {
                runSelectItemTest($parent => $parent);
            });
            QUnit.test(`selectItem(DOMElement)`, function() {
                runSelectItemTest($parent => $parent.get(0));
            });
            QUnit.test(`selectItem(key)`, function() {
                runSelectItemTest(_ => 1);
            });

            QUnit.test(`selectAll`, function(assert) {
                let options = createOptions(dataSourceOption, isVirtualModeEnabled, [
                    { id: 1, text: "item1", parentId: 2, selected: false, expanded: true },
                    { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: true }]);
                const wrapper = new TreeViewTestWrapper(options);

                wrapper.instance.selectAll();
                wrapper.checkSelectedNodes([0, 1]);
                wrapper.instance.dispose();
            });

            function runUnselectItemTest(argumentGetter) {
                let options = createOptions(dataSourceOption, isVirtualModeEnabled, [
                    { id: 1, text: "item1", parentId: 2, selected: true, expanded: true },
                    { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: true }]);
                const wrapper = new TreeViewTestWrapper(options);

                const $parent = wrapper.getElement().find('[aria-level="1"]');

                wrapper.instance.unselectItem(argumentGetter($parent));
                wrapper.checkSelectedNodes([]);
                wrapper.instance.dispose();
            }

            QUnit.test(`unselectItem($node)`, function() {
                runUnselectItemTest($parent => $parent);
            });
            QUnit.test(`unselectItem(DOMElement)`, function() {
                runUnselectItemTest($parent => $parent.get(0));
            });
            QUnit.test(`unselectItem(key)`, function() {
                runUnselectItemTest(_ => 1);
            });

            QUnit.test(`unselectAll`, function() {
                let options = createOptions(dataSourceOption, isVirtualModeEnabled, [
                    { id: 1, text: "item1", parentId: 2, selected: true, expanded: true },
                    { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: true }]);
                const wrapper = new TreeViewTestWrapper(options);

                wrapper.instance.unselectAll();
                wrapper.checkSelectedNodes([]);
                wrapper.instance.dispose();
            });
        });

        function createOptions(dataSourceOptionName, isVirtualModeEnabled, items) {
            let options = { dataStructure: "plain", rootValue: 1, showCheckBoxesMode: "normal", virtualModeEnabled: isVirtualModeEnabled };

            const isCreateChildrenDataSource = dataSourceOptionName === 'createChildren';
            const createChildFunction = (parent) => {
                return parent == null
                    ? [ items[1] ]
                    : items.filter(function(item) { return parent.itemData.id === item.parentId; });
            };
            options[dataSourceOptionName] = isCreateChildrenDataSource
                ? createChildFunction
                : items;
            return options;
        }
    });
});
