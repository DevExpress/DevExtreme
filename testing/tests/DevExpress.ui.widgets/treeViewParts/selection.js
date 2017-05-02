"use strict";

/* global initTree */

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
