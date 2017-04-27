"use strict";

/* global DATA, internals, initTree */

var $ = require("jquery"),
    devices = require("core/devices");

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
        scrollable.option("onScroll", $.noop);
    });

    $item.trigger("dxpointerdown");

});

QUnit.test("Checkbox should be clicked when treeview in not in focus", function(assert) {
    var data = [
        { id: 1, parentId: 0, text: "Cats" },
        { id: 2, parentId: 0, text: "Dogs" },
        { id: 3, parentId: 0, text: "Tigers" },
        { id: 4, parentId: 0, text: "Birds" },
        { id: 5, parentId: 0, text: "Hippos" },
        { id: 6, parentId: 0, text: "Elefants" },
        { id: 7, parentId: 0, text: "Cows" }
    ];

    var $treeView = initTree({
        dataSource: data,
        dataStructure: "plain",
        showCheckBoxesMode: "normal",
        height: 100
    });

    var treeView = $treeView.dxTreeView("instance");
    var pointerDownStub = sinon.stub(treeView, "_itemPointerDownHandler");

    var $node = $treeView.find("." + internals.NODE_CLASS).eq(5),
        $checkBox = $node.find(".dx-checkbox");

    $checkBox.trigger("dxpointerdown");

    assert.equal(pointerDownStub.callCount, 1, "checkBox should be part of node");
});

QUnit.test("Expansion should work when treeview in not in focus", function(assert) {
    var data = [
        { id: 1, parentId: 0, text: "Cats" },
        { id: 2, parentId: 0, text: "Dogs" },
        { id: 3, parentId: 0, text: "Tigers" },
        { id: 4, parentId: 0, text: "Birds" },
        { id: 5, parentId: 0, text: "Hippos" },
        { id: 6, parentId: 0, text: "Elefants" },
        { id: 7, parentId: 0, text: "Cows" },
        { id: 8, parentId: 6, text: "Mini-elefants" }
    ];

    var $treeView = initTree({
        dataSource: data,
        dataStructure: "plain",
        height: 100
    });

    var treeView = $treeView.dxTreeView("instance");
    var pointerDownStub = sinon.stub(treeView, "_itemPointerDownHandler");

    var $node = $treeView.find("." + internals.NODE_CLASS).eq(5),
        $arrow = $node.find("." + internals.TOGGLE_ITEM_VISIBILITY_CLASS);

    $arrow.trigger("dxpointerdown");

    assert.equal(pointerDownStub.callCount, 1, "arrow should be part of node");
});
