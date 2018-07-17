"use strict";

/* global DATA, internals, initTree */

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    fx = require("animation/fx");

QUnit.module("Expanded items", {
    beforeEach: function() {
        this.checkFunctionArguments = function(assert, actualArgs, expectedArgs) {
            assert.strictEqual(actualArgs.event, expectedArgs.event, "arg is OK");
            assert.deepEqual(actualArgs.itemData, expectedArgs.itemData, "arg is OK");
            assert.deepEqual(actualArgs.node, expectedArgs.node, "arg is OK");
            assert.deepEqual($(actualArgs.itemElement).get(0), expectedArgs.itemElement.get(0), "arg is OK");
        };
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("Some item has'expanded' field", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].items[1].expanded = true;
    var $treeView = initTree({
        items: data
    });

    assert.equal($treeView.find("." + internals.OPENED_NODE_CONTAINER_CLASS).length, 3);
});

QUnit.test("expansion by itemData", function(assert) {
    var data = [
        { id: 1, text: "Item 1", expanded: false, items: [{ id: 11, text: "Item 11" }] }, { id: 12, text: "Item 12" }
        ],
        treeView = initTree({ items: data }).dxTreeView("instance");

    treeView.expandItem(data[0]);
    assert.ok(data[0].expanded, "item is expanded");

    treeView.collapseItem(data[0]);
    assert.notOk(data[0].expanded, "item is not expanded");
});

QUnit.test("onItemExpanded callback", function(assert) {
    var data = $.extend(true, [], DATA[5]),
        itemExpandedHandler = sinon.spy(noop),
        $treeView = initTree({
            items: data,
            onItemExpanded: itemExpandedHandler
        }),
        treeView = $treeView.dxTreeView("instance");

    var $firstItem = $treeView.find("." + internals.ITEM_CLASS).eq(0);

    treeView.expandItem($firstItem.get(0));

    assert.equal($treeView.find("." + internals.OPENED_NODE_CONTAINER_CLASS).length, 1);
    assert.ok(itemExpandedHandler.calledOnce);

    var args = itemExpandedHandler.getCall(0).args[0];

    this.checkFunctionArguments(assert, args, {
        event: undefined,
        itemData: data[0],
        node: treeView.getNodes()[0],
        itemElement: $firstItem
    });
});

QUnit.test("onContentReady rises after first expand", function(assert) {
    var data = $.extend(true, [], DATA[5]),
        onContentReadyHandler = sinon.spy(noop),
        $treeView = initTree({
            items: data,
            onContentReady: onContentReadyHandler
        }),
        treeView = $treeView.dxTreeView("instance");

    var $firstItem = $treeView.find("." + internals.ITEM_CLASS).eq(0);

    treeView.expandItem($firstItem.get(0));

    assert.equal(onContentReadyHandler.callCount, 2);

    treeView.collapseItem($firstItem.get(0));
    treeView.expandItem($firstItem.get(0));
    assert.equal(onContentReadyHandler.callCount, 2);
});

QUnit.test("onItemExpanded callback after click should have correct arguments", function(assert) {
    assert.expect(4);

    var data = $.extend(true, [], DATA[5]),
        itemExpandedHandler = sinon.spy(noop),
        $treeView = initTree({
            items: data,
            onItemExpanded: itemExpandedHandler
        });

    var $firstItem = $treeView.find("." + internals.ITEM_CLASS).eq(0),
        event = new $.Event("dxclick");
    $firstItem.parent().find("> ." + internals.TOGGLE_ITEM_VISIBILITY_CLASS).trigger(event);

    var args = itemExpandedHandler.getCall(0).args[0];
    this.checkFunctionArguments(assert, args, {
        event: event,
        itemData: data[0],
        node: $treeView.dxTreeView("instance").getNodes()[0],
        itemElement: $firstItem
    });
});

QUnit.test("onItemCollapsed callback", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].expanded = true;
    var itemCollapsedHandler = sinon.spy(noop),
        $treeView = initTree({
            items: data,
            onItemCollapsed: itemCollapsedHandler
        }),
        treeView = $treeView.dxTreeView("instance");

    var $firstItem = $treeView.find("." + internals.ITEM_CLASS).eq(0);
    treeView.collapseItem($firstItem);

    assert.equal($treeView.find("." + internals.OPENED_NODE_CONTAINER_CLASS).length, 1);
    assert.ok(itemCollapsedHandler.calledOnce);

    var args = itemCollapsedHandler.getCall(0).args[0];
    this.checkFunctionArguments(assert, args, {
        event: undefined,
        itemData: data[0],
        node: treeView.getNodes()[0],
        itemElement: $firstItem
    });
});

QUnit.test("onItemCollapsed callback after click should have correct arguments", function(assert) {
    assert.expect(4);

    var data = $.extend(true, [], DATA[5]);
    data[0].expanded = true;
    var itemCollapsedHandler = sinon.spy(noop),
        $treeView = initTree({
            items: data,
            onItemCollapsed: itemCollapsedHandler
        }),
        treeView = $treeView.dxTreeView("instance");

    var $firstItem = $treeView.find("." + internals.ITEM_CLASS).eq(0),
        event = new $.Event("dxclick");
    $firstItem.parent().find("> ." + internals.TOGGLE_ITEM_VISIBILITY_CLASS).trigger(event);

    var args = itemCollapsedHandler.getCall(0).args[0];
    this.checkFunctionArguments(assert, args, {
        event: event,
        itemData: data[0],
        node: treeView.getNodes()[0],
        itemElement: $firstItem
    });
});

QUnit.test("disabled item should not expand on click", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].disabled = true;
    var $treeView = initTree({
            items: data
        }),
        treeView = $treeView.dxTreeView("instance"),
        $firstItem = $treeView.find("." + internals.ITEM_CLASS).eq(0),
        $icon = $firstItem.parent().find("> ." + internals.TOGGLE_ITEM_VISIBILITY_CLASS);

    $icon.trigger("dxclick");

    assert.ok(!treeView.option("items")[0].expanded, "disabled item was not expanded");
});

QUnit.test("expanded disabled item should not collapse on click", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].expanded = true;
    data[0].disabled = true;
    var $treeView = initTree({
            items: data
        }),
        treeView = $treeView.dxTreeView("instance"),
        $firstItem = $treeView.find("." + internals.ITEM_CLASS).eq(0),
        $icon = $firstItem.parent().find("> ." + internals.TOGGLE_ITEM_VISIBILITY_CLASS);

    $icon.trigger("dxclick");

    assert.ok(treeView.option("items")[0].expanded, "disabled item was not expanded");
});

QUnit.test("expanded item shouldn't collapse after setting .disable for it", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].expanded = true;

    var $treeView = initTree({
            items: data
        }),
        treeView = $treeView.dxTreeView("instance"),
        items = treeView.option("items");

    items[0].disabled = true;
    treeView.option("items", items);

    assert.ok(treeView.option("items")[0].expanded, "disabled item was not expanded");
});

QUnit.test("ui expand and collapse work correctly", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].items[1].expanded = true;
    var $treeView = initTree({
            items: data
        }),
        $toggleExpandIcon = $($treeView.find(".dx-treeview-toggle-item-visibility").eq(0));

    $toggleExpandIcon.trigger("dxclick");
    assert.ok(!$toggleExpandIcon.hasClass("dx-treeview-toggle-item-visibility-opened"));

    $toggleExpandIcon.trigger("dxclick");
    this.clock.tick(100);
    assert.ok($toggleExpandIcon.hasClass("dx-treeview-toggle-item-visibility-opened"));
});

QUnit.test("itemExpanded should be fired when expanding item", function(assert) {
    var data = $.extend(true, [], DATA[5]);

    var $treeView = initTree({
            items: data
        }),
        treeView = $treeView.dxTreeView("instance"),
        $toggleExpandIcon = $($treeView.find(".dx-treeview-toggle-item-visibility").eq(0));

    treeView.on("itemExpanded", function() {
        assert.ok(true, "itemExpanded was fired");
    });

    $toggleExpandIcon.trigger("dxclick");
});

QUnit.test("itemCollapsed should be fired when collapsing item by click", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].items[1].expanded = true;
    var $treeView = initTree({
            items: data,
            expandEvent: "click"
        }),
        treeView = $treeView.dxTreeView("instance"),
        $item = $treeView.find(".dx-treeview-item").eq(0);

    treeView.on("itemCollapsed", function() {
        assert.ok(true, "itemCollapsed was fired");
    });

    $item.trigger("dxclick");
});

QUnit.test("item should expand by click when expansion by click enabled", function(assert) {
    var items = [{ text: "Item 1", items: [{ text: "Item 11" }] }],
        $treeView = initTree({
            items: items,
            expandEvent: "click"
        }),
        $item = $treeView.find(".dx-treeview-item").eq(0);

    $item.trigger("dxclick");
    assert.ok(items[0].expanded, "item is expanded");
});

QUnit.test("item should collapse by click when expansion by click enabled", function(assert) {
    var items = [{ text: "Item 1", items: [{ text: "Item 11" }] }],
        $treeView = initTree({
            items: items,
            expandEvent: "click"
        }),
        $item = $treeView.find(".dx-treeview-item").eq(0);

    $item.trigger("dxclick");
    $item.trigger("dxclick");
    assert.notOk(items[0].expanded, "item is collapsed");
});

QUnit.test("item should not expand by click when expansion by click disabling", function(assert) {
    var items = [{ text: "Item 1", items: [{ text: "Item 11" }] }],
        $treeView = initTree({
            items: items,
            expandEvent: "click"
        }),
        instance = $treeView.dxTreeView("instance"),
        $item = $treeView.find(".dx-treeview-item").eq(0);

    instance.option("expandEvent", "dblclick");

    $item.trigger("dxclick");
    assert.notOk(items[0].expanded, "item is collapsed");
});

QUnit.test("collapseAll method should collapse all expanded items", function(assert) {
    var items = [{ text: "Item 1", expanded: true, items: [{ text: "Item 11" }] }],
        $treeView = initTree({
            items: items
        }),
        instance = $treeView.dxTreeView("instance");

    instance.collapseAll();

    assert.notOk(items[0].expanded, "item is collapsed");
});

QUnit.test("onItemExpanded should not fire if item is leaf", function(assert) {
    var items = [{ text: "Item 1" }],
        itemExpanded = 0,
        $treeView = initTree({
            items: items,
            expandByClick: true,
            onItemExpanded: function() {
                itemExpanded++;
            }
        }),
        $item = $treeView.find(".dx-treeview-item").eq(0);

    $item.trigger("dxclick");

    assert.equal(itemExpanded, 0, "event was not fired");
});

QUnit.test("not expand parent items in non-recursive case", function(assert) {
    var items = [{ text: "1", id: 1, items: [{ text: "11", id: 11, items: [{ text: "111", id: 111 }] }] }],
        $treeView = initTree({
            items: items,
            expandNodesRecursive: false
        }),
        treeView = $treeView.dxTreeView("instance");

    treeView.expandItem(11);

    var $items = $treeView.find(".dx-treeview-node");
    assert.equal($items.length, 1, "root item was expanded");

    var nodes = treeView.getNodes();
    assert.notOk(nodes[0].expanded, "root node is collapsed");
    assert.ok(nodes[0].children[0].expanded, "child node is expanded");

    treeView.expandItem(1);

    $items = $treeView.find(".dx-treeview-node");
    assert.equal($items.length, 3, "root item was expanded");
});

QUnit.test("expand parent items in recursive case", function(assert) {
    var items = [{ text: "1", id: 1, items: [{ text: "11", id: 11, items: [{ text: "111", id: 111 }] }] }],
        $treeView = initTree({
            items: items
        }),
        treeView = $treeView.dxTreeView("instance");

    treeView.expandItem(11);

    var $items = $treeView.find(".dx-treeview-node");
    assert.equal($items.length, 3, "root item was expanded");

    var nodes = treeView.getNodes();
    assert.ok(nodes[0].expanded, "root node is expanded");
    assert.ok(nodes[0].children[0].expanded, "child node is expanded");
});

QUnit.test("expand childless item in recursive case", function(assert) {
    var items = [{ text: "1", id: 1, items: [{ text: "11", id: 11 }] }],
        $treeView = initTree({
            items: items
        }),
        treeView = $treeView.dxTreeView("instance");

    treeView.expandItem(11);

    var $items = $treeView.find(".dx-treeview-node");
    assert.equal($items.length, 2, "root item was expanded");

    var nodes = treeView.getNodes();
    assert.ok(nodes[0].expanded, "root node is expanded");
    assert.ok(nodes[0].children[0].expanded, "child node is expanded");
});

QUnit.test("Expand all method", function(assert) {
    var items = [{
            text: "1",
            id: 1,
            items: [{
                text: "11",
                id: 11,
                items: [{
                    text: "111",
                    id: 111
                }]
            }]
        }],
        $treeView = initTree({
            items: items
        }),
        treeView = $treeView.dxTreeView("instance");

    treeView.expandAll();

    var nodes = treeView.getNodes();
    assert.ok(nodes[0].expanded, "item 1");
    assert.ok(nodes[0].items[0].expanded, "item 11");
    assert.ok(nodes[0].items[0].items[0].expanded, "item 111");
});

QUnit.test("Collapse all method", function(assert) {
    var items = [{
            text: "1",
            id: 1,
            items: [{
                text: "11",
                id: 11,
                items: [{
                    text: "111",
                    id: 111
                }]
            }]
        }],
        $treeView = initTree({
            items: items
        }),
        treeView = $treeView.dxTreeView("instance");

    treeView.expandAll();
    treeView.collapseAll();

    var nodes = treeView.getNodes();
    assert.notOk(nodes[0].expanded, "item 1");
    assert.notOk(nodes[0].items[0].expanded, "item 11");
    assert.notOk(nodes[0].items[0].items[0].expanded, "item 111");
});
