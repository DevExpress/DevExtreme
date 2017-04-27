"use strict";

/* global DATA, internals, initTree */

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    devices = require("core/devices");

var NODE_CLASS = "dx-treeview-node",
    TOGGLE_ITEM_VISIBILITY_CLASS = "dx-treeview-toggle-item-visibility";

QUnit.module("Focusing");

QUnit.testInActiveWindow("item should have focus-state class after click on it", function(assert) {
    var treeViewData = DATA[0];
    var $treeView = initTree({
            items: treeViewData,
            focusStateEnabled: true
        }),
        $item = $treeView.find("." + internals.ITEM_CLASS).eq(0),
        $node = $treeView.find("." + internals.NODE_CLASS).eq(0);

    $item.trigger("dxpointerdown");

    assert.ok($node.hasClass("dx-state-focused"), "focus state was toggle after click");
});

QUnit.testInActiveWindow("disabled item should not have focus-state class after click on it", function(assert) {
    var treeViewData = $.extend(true, [], DATA[0]);
    treeViewData[0].disabled = true;

    var $treeView = initTree({
            items: treeViewData,
            focusStateEnabled: true
        }),
        $item = $treeView.find("." + internals.ITEM_CLASS).eq(0),
        $node = $treeView.find("." + internals.NODE_CLASS).eq(0);

    $item.trigger("dxpointerdown");

    assert.ok(!$node.hasClass("dx-state-focused"), "focus state was toggle after click");
});

QUnit.testInActiveWindow("widget should not have focus-state class after click on arrow", function(assert) {
    var treeViewData = DATA[0];
    var $treeView = initTree({
            items: treeViewData,
            focusStateEnabled: true
        }),
        $arrow = $treeView.find("." + internals.TOGGLE_ITEM_VISIBILITY_CLASS).eq(0),
        $node = $treeView.find("." + internals.NODE_CLASS).eq(0);

    $arrow.trigger("dxclick");

    assert.ok(!$node.hasClass("dx-state-focused"), "focus state was toggle after click");
});

QUnit.test("focus on the item should move scroll position to this item (T226868)", function(assert) {
    assert.expect(1);

    if(devices.real().platform !== "generic") {
        assert.ok(true, "unnecessary test on mobile devices");
        return;
    }

    var $treeView = initTree({
            items: [{ id: 1, text: "item 1" }, { id: 2, text: "item 2", expanded: true, items: [{ id: 3, text: "item 3" }] }],
            focusStateEnabled: true,
            height: 40
        }),
        $item = $treeView.find("." + internals.ITEM_CLASS).eq(1),
        scrollable = $treeView.find(".dx-scrollable").dxScrollable("instance");

    scrollable.option("onScroll", function(args) {
        assert.equal(args.scrollOffset.top, 24, "scrolled to the item");
        scrollable.option("onScroll", noop);
    });

    $item.trigger("dxpointerdown");

});

QUnit.test("PointerDown event at checkbox should not be ignored", function(assert) {
    var data = [
        { id: 1, parentId: 0, text: "Cats" }
    ];

    var $treeView = initTree({
        dataSource: data,
        dataStructure: "plain",
        showCheckBoxesMode: "normal"
    });

    var treeView = $treeView.dxTreeView("instance");
    var pointerDownStub = sinon.stub(treeView, "_itemPointerDownHandler");

    var $node = $treeView.find("." + NODE_CLASS).eq(0),
        $checkBox = $node.find(".dx-checkbox");

    $checkBox.trigger("dxpointerdown");

    assert.equal(pointerDownStub.callCount, 1, "itemPointerDownHandler was called");
});

QUnit.test("PointerDown event at expansion arrow should not be ignored", function(assert) {
    var data = [
        { id: 1, parentId: 0, text: "Cats" },
        { id: 2, parentId: 1, text: "Maine Coon" }
    ];

    var $treeView = initTree({
        dataSource: data,
        dataStructure: "plain"
    });

    var treeView = $treeView.dxTreeView("instance");
    var pointerDownStub = sinon.stub(treeView, "_itemPointerDownHandler");

    var $node = $treeView.find("." + NODE_CLASS).eq(0),
        $arrow = $node.find("." + TOGGLE_ITEM_VISIBILITY_CLASS);

    $arrow.trigger("dxpointerdown");

    assert.equal(pointerDownStub.callCount, 1, "itemPointerDownHandler was called");
});
