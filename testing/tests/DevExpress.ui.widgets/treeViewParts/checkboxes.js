/* global DATA, data2, internals, initTree */
import TreeViewTestWrapper from "../../../helpers/TreeViewTestHelper.js";
import $ from "jquery";

const createInstance = (options) => new TreeViewTestWrapper(options);
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


QUnit.module("Selection with cycle/loop keys (T832760)", () => {
    [{ optionName: 'items', virtualModeEnabled: false }, { optionName: 'dataSource', virtualModeEnabled: false }, { optionName: 'dataSource', virtualModeEnabled: true }].forEach((testConfig) => {
        QUnit.test(`SelectItem by jQuery node. ${testConfig.optionName} option.`, function(assert) {
            let options = createOptions(testConfig.optionName, testConfig.virtualModeEnabled, [
                { id: 1, text: "item1", parentId: 2, selected: false, expanded: true },
                { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: true }]);
            const treeView = createInstance(options);

            const $parent = treeView.getElement().find('[aria-level="1"]');
            treeView.instance.selectItem($parent);
            treeView.checkSelectedNodes([0, 1]);
        });

        QUnit.test(`SelectItem by html node. ${testConfig.optionName} option.`, function(assert) {
            let options = createOptions(testConfig.optionName, testConfig.virtualModeEnabled, [
                { id: 1, text: "item1", parentId: 2, selected: false, expanded: true },
                { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: true }]);
            const treeView = createInstance(options);

            const $parent = treeView.getElement().find('[aria-level="1"]');
            treeView.instance.selectItem($parent.get(0));
            treeView.checkSelectedNodes([0, 1]);
        });

        QUnit.test(`SelectItem by key. ${testConfig.optionName} option.`, function(assert) {
            let options = createOptions(testConfig.optionName, testConfig.virtualModeEnabled, [
                { id: 1, text: "item1", parentId: 2, selected: false, expanded: true },
                { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: true }]);
            const treeView = createInstance(options);

            treeView.instance.selectItem('1');
            treeView.checkSelectedNodes([0, 1]);
        });

        QUnit.test(`SelectAll. ${testConfig.optionName} option.`, function(assert) {
            let options = createOptions(testConfig.optionName, testConfig.virtualModeEnabled, [
                { id: 1, text: "item1", parentId: 2, selected: false, expanded: true },
                { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: true }]);
            const treeView = createInstance(options);

            treeView.instance.selectAll();
            treeView.checkSelectedNodes([0, 1]);
        });

        QUnit.test(`UnselectItem by jquery node. ${testConfig.optionName} option.`, function() {
            let options = createOptions(testConfig.optionName, testConfig.virtualModeEnabled, [
                { id: 1, text: "item1", parentId: 2, selected: true, expanded: true },
                { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: true }]);
            const treeView = createInstance(options);

            const $parent = treeView.getElement().find('[aria-level="1"]');
            treeView.instance.unselectItem($parent);
            treeView.checkSelectedNodes([]);
        });

        QUnit.test(`UnselectItem by html node. ${testConfig.optionName} option.`, function() {
            let options = createOptions(testConfig.optionName, testConfig.virtualModeEnabled, [
                { id: 1, text: "item1", parentId: 2, selected: true, expanded: true },
                { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: true }]);
            const treeView = createInstance(options);

            const $parent = treeView.getElement().find('[aria-level="1"]');
            treeView.instance.unselectItem($parent.get(0));
            treeView.checkSelectedNodes([]);
        });

        QUnit.test(`UnselectItem by key. ${testConfig.optionName} option.`, function() {
            let options = createOptions(testConfig.optionName, testConfig.virtualModeEnabled, [
                { id: 1, text: "item1", parentId: 2, selected: true, expanded: true },
                { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: true }]);
            const treeView = createInstance(options);

            treeView.instance.unselectItem('1');
            treeView.checkSelectedNodes([]);
        });

        QUnit.test(`UnselectAll should works with loop/cycle in ${testConfig.optionName} option. (T832760)`, function() {
            let options = createOptions(testConfig.optionName, testConfig.virtualModeEnabled, [
                { id: 1, text: "item1", parentId: 2, selected: true, expanded: true },
                { id: 2, text: "item1_1", parentId: 1, selected: true, expanded: true }]);
            const treeView = createInstance(options);

            treeView.instance.unselectAll();
            treeView.checkSelectedNodes([]);
        });
    });

    function createOptions(itemsOptionName, isVirtualModeEnabled, items) {
        let options = { dataStructure: "plain", rootValue: 1, showCheckBoxesMode: "normal" };
        options[itemsOptionName] = items;
        return options;
    }
});
