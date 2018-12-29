/* global initTree */

var $ = require("jquery"),
    keyboardMock = require("../../../helpers/keyboardMock.js");

QUnit.module("selection common");

QUnit.test("selection should work without checkboxes on init", function(assert) {
    var items = [{ text: "item 1", selected: true }, { text: "item 2" }],
        $treeview = initTree({
            items: items,
            showCheckBoxesMode: "none"
        }),
        $nodes = $treeview.find(".dx-treeview-node");

    assert.ok($nodes.eq(0).hasClass("dx-state-selected"), "node should be selected");
    assert.ok(items[0].selected, "item should be selected");

    assert.notOk($nodes.eq(1).hasClass("dx-state-selected"), "node should not be selected");
    assert.notOk(items[1].selected, "item should not be selected");
});

QUnit.test("selection methods should work with item keys", function(assert) {
    var items = [{ text: "item 1", selected: true }, { text: "item 2" }],
        $treeview = initTree({
            items: items
        }),
        instance = $treeview.dxTreeView("instance"),
        $nodes = $treeview.find(".dx-treeview-node");

    instance.unselectItem(1);
    assert.notOk($nodes.eq(0).hasClass("dx-state-selected"), "node should not be selected");
    assert.notOk(items[0].selected, "item should not be selected");

    instance.selectItem(2);
    assert.ok($nodes.eq(1).hasClass("dx-state-selected"), "node should be selected");
    assert.ok(items[1].selected, "item should be selected");
});

QUnit.test("selection methods should work with itemElements", function(assert) {
    var items = [{ text: "item 1", selected: true }, { text: "item 2" }],
        $treeview = initTree({
            items: items
        }),
        instance = $treeview.dxTreeView("instance"),
        $nodes = $treeview.find(".dx-treeview-node");

    instance.unselectItem($nodes.eq(0).find(".dx-treeview-item").eq(0));
    assert.notOk($nodes.eq(0).hasClass("dx-state-selected"), "node should not be selected");
    assert.notOk(items[0].selected, "item should not be selected");

    instance.selectItem($nodes.eq(1).find(".dx-treeview-item").eq(0));
    assert.ok($nodes.eq(1).hasClass("dx-state-selected"), "node should be selected");
    assert.ok(items[1].selected, "item should be selected");
});

QUnit.test("selection methods should work with dom itemElements", function(assert) {
    var items = [{ text: "item 1", selected: true }, { text: "item 2" }],
        $treeview = initTree({
            items: items
        }),
        instance = $treeview.dxTreeView("instance"),
        $nodes = $treeview.find(".dx-treeview-node");

    instance.unselectItem($nodes.eq(0).find(".dx-treeview-item").eq(0).get(0));
    assert.notOk($nodes.eq(0).hasClass("dx-state-selected"), "node should not be selected");
    assert.notOk(items[0].selected, "item should not be selected");

    instance.selectItem($nodes.eq(1).find(".dx-treeview-item").eq(0).get(0));
    assert.ok($nodes.eq(1).hasClass("dx-state-selected"), "node should be selected");
    assert.ok(items[1].selected, "item should be selected");
});

QUnit.test("selectionChanged should fire only when selection was changed", function(assert) {
    var items = [{ text: "item 1", selected: true }, { text: "item 2", items: [{ text: "item 21" }] }],
        selectionChanged = 0,
        $treeview = initTree({
            items: items,
            selectNodesRecursive: true,
            onSelectionChanged: function() {
                selectionChanged++;
            }
        }),
        instance = $treeview.dxTreeView("instance");

    instance.selectItem(1);
    instance.selectItem(2);
    instance.unselectItem(1);

    assert.equal(selectionChanged, 2, "selectionChanged should call twice");
});

QUnit.test("onItemSelectionChanged should have correct arguments", function(assert) {
    var itemSelectionChanged = sinon.spy(),
        $treeview = initTree({
            items: [{ text: "Item 1", id: 2 }],
            onItemSelectionChanged: itemSelectionChanged
        }),
        instance = $treeview.dxTreeView("instance");

    instance.selectItem(2);

    assert.equal(itemSelectionChanged.callCount, 1, "selection was changed once");

    // note: other parameters are redundant but they were saved in the code to prevent a BC
    assert.equal(itemSelectionChanged.getCall(0).args[0].component.NAME, instance.NAME, "component is correct");
    assert.ok($(itemSelectionChanged.getCall(0).args[0].element).hasClass("dx-treeview"), "element is correct");
    assert.equal(itemSelectionChanged.getCall(0).args[0].node.key, 2, "node is correct");
    assert.ok($(itemSelectionChanged.getCall(0).args[0].itemElement).hasClass("dx-treeview-item"), "itemElement is correct");
});

QUnit.test("itemSelected should fire when select", function(assert) {
    var items = [{ text: "item 1", selected: true }, { text: "item 2" }],
        itemSelected = 0,
        $treeview = initTree({
            items: items,
            onItemSelectionChanged: function() {
                itemSelected++;
            }
        }),
        instance = $treeview.dxTreeView("instance");

    instance.selectItem(2);

    assert.equal(itemSelected, 1, "event was fired");
});

QUnit.test("itemSelected should not fire when selection was not changed", function(assert) {
    var items = [{ text: "item 1", selected: true }, { text: "item 2" }],
        itemSelected = 0,
        $treeview = initTree({
            items: items,
            onItemSelectionChanged: function() {
                itemSelected++;
            }
        }),
        instance = $treeview.dxTreeView("instance");

    instance.selectItem(1);

    assert.equal(itemSelected, 0, "event was not fired");
});

QUnit.test("disabled item should be selectable via api", function(assert) {
    var items = [{ text: "item 1", disabled: true }, { text: "item 2", disabled: true, selected: true }],
        $treeview = initTree({
            items: items,
            showCheckBoxesMode: "normal"
        }),
        $nodes = $treeview.find(".dx-treeview-node"),
        instance = $treeview.dxTreeView("instance");

    instance.selectItem(1);
    assert.ok(items[0].selected, "item should be selected");

    instance.unselectItem(1);
    assert.notOk(items[0].selected, "item should not be selected");

    assert.ok(items[1].selected, "item should be selected");
    assert.ok($nodes.eq(1).hasClass("dx-state-selected"), "item should be selected");
});

QUnit.test("all nodes should have selected class if they have selected property", function(assert) {
    var items = [{ text: "item 1", selected: true, expanded: true, items: [{ text: "item 11", selected: true }] }, { text: "item 2", selected: true }],
        $treeview = initTree({
            items: items,
            showCheckBoxesMode: "none"
        }),
        $nodes = $treeview.find(".dx-treeview-node.dx-state-selected");

    assert.equal($nodes.length, 3, "all nodes should have selected class");
});

QUnit.test("should not fire an error when try to select unspecified item", function(assert) {
    var items = [{ text: "item 1", selected: true, expanded: true, items: [{ text: "item 11", selected: true }] }, { text: "item 2", selected: true }],
        treeview = initTree({
            items: items
        }).dxTreeView("instance");

    try {
        treeview.selectItem(null);
    } catch(e) {
        assert.notOk(true, "Error has been raised");
    } finally {
        assert.ok(true);
    }
});

QUnit.test("should not fire an error when item contains 'nodeType' field", function(assert) {
    var treeview = initTree({
        items: [{ id: 1, nodeType: "test" }]
    }).dxTreeView("instance");

    try {
        treeview.selectItem({ id: 1, nodeType: "test" });
    } catch(e) {
        assert.notOk(true, "Error has been raised");
    } finally {
        assert.step("Test completed");
    }
});


QUnit.module("selection single");

QUnit.test("only one node should be selected on init", function(assert) {
    var items = [{ text: "item 1", selected: true }, { text: "item 2", selected: true }],
        $treeview = initTree({
            items: items,
            selectionMode: "single"
        }),
        $nodes = $treeview.find(".dx-treeview-node");

    assert.notOk($nodes.eq(0).hasClass("dx-state-selected"), "node should not be selected");
    assert.ok($nodes.eq(1).hasClass("dx-state-selected"), "node should be selected");
});

QUnit.test("only one node should be selected on selection change", function(assert) {
    var items = [{ text: "item 1", selected: true }, { text: "item 2" }],
        $treeview = initTree({
            items: items,
            selectionMode: "single"
        }),
        instance = $treeview.dxTreeView("instance"),
        $nodes = $treeview.find(".dx-treeview-node");

    instance.selectItem(2);

    assert.notOk($nodes.eq(0).hasClass("dx-state-selected"), "node should not be selected");
    assert.ok($nodes.eq(1).hasClass("dx-state-selected"), "node should be selected");
});

QUnit.test("last item should not be deselected when selectionRequired is used with checkboxes", function(assert) {
    var $treeview = initTree({
            items: [{ id: 1, text: "item 1", selected: true }],
            showCheckBoxesMode: "normal",
            selectionMode: "single",
            selectionRequired: true
        }),
        $node = $treeview.find(".dx-treeview-node"),
        checkbox = $node.find(".dx-checkbox").dxCheckBox("instance"),
        treeview = $treeview.dxTreeView("instance");

    $(checkbox.element()).trigger("dxclick");
    assert.ok($node.hasClass("dx-state-selected"), "node is selected");
    assert.deepEqual(treeview.getSelectedNodesKeys(), [1], "node was not removed from selected nodes array");
    assert.ok(checkbox.option("value"), "node's checkbox is still checked");
});

QUnit.test("last item should not be deselected when selectionRequired is used without checkboxes", function(assert) {
    var $treeview = initTree({
            items: [{ id: 1, text: "item 1", selected: true }],
            showCheckBoxesMode: "none",
            selectionMode: "single",
            selectByClick: true,
            selectionRequired: true
        }),
        $node = $treeview.find(".dx-treeview-node"),
        $item = $node.children(".dx-treeview-item"),
        treeview = $treeview.dxTreeView("instance");

    $item.trigger("dxclick");
    assert.ok($node.hasClass("dx-state-selected"), "node is selected");
    assert.deepEqual(treeview.getSelectedNodesKeys(), [1], "node was not removed from selected nodes array");
});

QUnit.test("last item should not be deselected when selectionRequired is used with api", function(assert) {
    var $treeview = initTree({
            items: [{ id: 1, text: "item 1", selected: true }],
            showCheckBoxesMode: "none",
            selectionMode: "single",
            selectionRequired: true
        }),
        $node = $treeview.find(".dx-treeview-node"),
        treeview = $treeview.dxTreeView("instance");

    treeview.unselectItem(1);
    assert.ok($node.hasClass("dx-state-selected"), "node is selected");
    assert.deepEqual(treeview.getSelectedNodesKeys(), [1], "node was not removed from selected nodes array");
});

QUnit.test("last item should not be deselected when selectionRequired is used with multiple selection", function(assert) {
    var $treeview = initTree({
            items: [{ id: 1, text: "item 1", selected: true }, { id: 2, text: "item 2", selected: true }],
            showCheckBoxesMode: "none",
            selectionMode: "multiple",
            selectionRequired: true
        }),
        $node = $treeview.find(".dx-treeview-node"),
        treeview = $treeview.dxTreeView("instance");

    treeview.unselectItem(1);
    assert.notOk($node.eq(0).hasClass("dx-state-selected"), "node is not selected");
    assert.deepEqual(treeview.getSelectedNodesKeys(), [2], "node was removed from selected nodes array");

    treeview.unselectItem(2);
    assert.ok($node.eq(1).hasClass("dx-state-selected"), "node is selected");
    assert.deepEqual(treeview.getSelectedNodesKeys(), [2], "node was not removed from selected nodes array");
});

QUnit.test("last item should not be deselected when selectionRequired is used with recursive selection", function(assert) {
    var $treeview = initTree({
            items: [{ id: 1, text: "item 1", selected: true, expanded: true, items: [{ id: 11, text: "Item 11" }] }],
            showCheckBoxesMode: "none",
            selectionMode: "multiple",
            selectNodesRecursive: true,
            selectionRequired: true
        }),
        $node = $treeview.find(".dx-treeview-node"),
        treeview = $treeview.dxTreeView("instance");

    treeview.unselectItem(1);
    assert.ok($node.eq(0).hasClass("dx-state-selected"), "root node is selected");
    assert.ok($node.eq(1).hasClass("dx-state-selected"), "leaf node is selected");
    assert.deepEqual(treeview.getSelectedNodesKeys(), [1, 11], "all nodes are still in the selected array");
});

QUnit.test("last item should not be deselected when selectionRequired is used with select all", function(assert) {
    var $treeview = initTree({
            items: [{
                id: 1,
                text: "item 1",
                selected: true,
                expanded: true,
                items: [{ id: 11, text: "Item 11" }]
            }, { id: 2, text: "Item 2", selected: true }],
            selectionMode: "multiple",
            selectNodesRecursive: true,
            selectionRequired: true
        }),
        $node = $treeview.find(".dx-treeview-node"),
        treeview = $treeview.dxTreeView("instance");

    treeview.unselectAll();
    assert.notOk($node.eq(0).hasClass("dx-state-selected"), "first node is not selected");
    assert.notOk($node.eq(1).hasClass("dx-state-selected"), "child node is not selected");
    assert.ok($node.eq(2).hasClass("dx-state-selected"), "last node is selected");
    assert.deepEqual(treeview.getSelectedNodesKeys(), [2], "last noder is still in the selected array");
});

QUnit.test("selectByClick option should select item  by single click", function(assert) {
    var items = [{ text: "item 1" }, { text: "item 2" }],
        $treeview = initTree({
            items: items,
            selectByClick: false,
            selectionMode: "single"
        }),
        instance = $treeview.dxTreeView("instance"),
        $item = $treeview.find(".dx-treeview-item").eq(0);

    instance.option("selectByClick", true);

    $item.trigger("dxclick");

    assert.ok(items[0].selected, "item was selected");
});

QUnit.test("selectByClick option should unselect item  by second click", function(assert) {
    var items = [{ text: "item 1" }, { text: "item 2" }],
        $treeview = initTree({
            items: items,
            selectByClick: true,
            selectionMode: "single"
        }),
        $item = $treeview.find(".dx-treeview-item").eq(0);

    $item.trigger("dxclick");
    $item.trigger("dxclick");

    assert.notOk(items[0].selected, "item was unselected");
});

QUnit.test("selection can be prevented on itemClick", function(assert) {
    var items = [{ text: "item 1" }, { text: "item 2" }],
        $treeview = initTree({
            items: items,
            selectByClick: true,
            selectionMode: "single",
            onItemClick: function(e) {
                e.event.preventDefault();
            }
        }),
        $item = $treeview.find(".dx-treeview-item").eq(0);

    $item.trigger("dxclick");

    assert.notOk(items[0].selected, "item selection has been prevented");
});

QUnit.test("selectNodesRecursive should be ignored when single selection is enabled", function(assert) {
    var $treeview = initTree({
            items: [{ text: "Item 1", expanded: true, items: [{ text: "Item 11" }] }],
            selectionMode: "single",
            selectByClick: true,
            selectNodesRecursive: true
        }),
        $item = $treeview.find(".dx-treeview-item").eq(0),
        $nodes = $treeview.find(".dx-treeview-node");

    $item.trigger("dxclick");

    assert.ok($nodes.eq(0).hasClass("dx-state-selected"), "root node should be selected");
    assert.notOk($nodes.eq(1).hasClass("dx-state-selected"), "nested node should not be selected");
});

QUnit.test("selectNodesRecursive should work correct on option changing", function(assert) {
    var $treeview = initTree({
        items: [{ id: 1, text: "Item 1", expanded: true, items: [{ id: 11, text: "Item 11", selected: true }] }],
        selectByClick: true,
        selectNodesRecursive: false
    });

    $treeview.dxTreeView("instance").option("selectNodesRecursive", true);

    var $nodes = $treeview.find(".dx-treeview-node");

    assert.ok($nodes.eq(0).hasClass("dx-state-selected"), "root node should be selected");
    assert.ok($nodes.eq(1).hasClass("dx-state-selected"), "nested node should be selected");
});

QUnit.test("onItemSelectionChanged event should be fired on unselect previosly selected item", function(assert) {
    var items = [{ text: "item 1" }, { text: "item 2" }],
        itemSelectionChangedStub = sinon.stub(),
        $treeView = initTree({
            items: items,
            selectByClick: true,
            selectionMode: "single",
            onItemSelectionChanged: itemSelectionChangedStub
        }),
        $items = $treeView.find(".dx-treeview-item");

    $items.eq(0).trigger("dxclick");
    $items.eq(1).trigger("dxclick");

    assert.equal(itemSelectionChangedStub.callCount, 3, "'onItemSelectionChanged' event fires three times");

    var callArgs = itemSelectionChangedStub.getCall(1).args[0];
    assert.deepEqual(callArgs.itemData, { selected: false, text: "item 1" }, "'onItemSelectionChanged' event fires on unselect of item1");
});

QUnit.test("item selection correctly reset when dataSource is filtered", function(assert) {
    var CHECK_BOX_SELECTOR = ".dx-checkbox",
        items = [{ text: "item 1" }, { text: "item 2" }],
        $treeView = initTree({
            dataSource: items,
            selectionMode: "single",
            showCheckBoxesMode: "normal",
            searchExpr: "text",
            searchEnabled: true,
        }),
        treeViewInstance = $treeView.dxTreeView("instance");

    treeViewInstance.option("searchValue", "2");
    $treeView.find(CHECK_BOX_SELECTOR).trigger("dxclick");
    treeViewInstance.option("searchValue", "1");
    $treeView.find(CHECK_BOX_SELECTOR).trigger("dxclick");
    treeViewInstance.option("searchValue", "");

    var checkedCheckBoxCount = $treeView.find(".dx-checkbox-checked").length;
    assert.equal(checkedCheckBoxCount, 1, "There is only one checked checkBox");
    assert.ok($treeView.find(CHECK_BOX_SELECTOR).eq(0).hasClass("dx-checkbox-checked"), "Correct checkbox checked");
});

QUnit.test("items should be selectable after the search", function(assert) {
    var clickHandler = sinon.spy(),
        $treeView = initTree({
            dataSource: [{ text: "Stores" }],
            searchEnabled: true,
            searchTimeout: 0,
            selectionMode: "single",
            onItemClick: clickHandler
        }),
        $input = $treeView.find(".dx-texteditor-input"),
        kb = keyboardMock($input);

    kb.type("s");

    var $item = $treeView.find(".dx-treeview-item").eq(0);
    $($item).trigger("dxclick");

    assert.equal(clickHandler.callCount, 1, "click works");
});
