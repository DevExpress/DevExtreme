/* global DATA, internals, initTree */

import $ from "jquery";
import { noop } from "core/utils/common";
import fx from "animation/fx";

const TREEVIEW_NODE_CONTAINER_CLASS = "dx-treeview-node-container";
const TREEVIEW_NODE_CONTAINER_OPENED_CLASS = "dx-treeview-node-container-opened";

const { module, test } = QUnit;

const checkFunctionArguments = (assert, actualArgs, expectedArgs) => {
    assert.strictEqual(actualArgs.event, expectedArgs.event, "arg is OK");
    assert.deepEqual(actualArgs.itemData, expectedArgs.itemData, "arg is OK");
    assert.deepEqual(actualArgs.node, expectedArgs.node, "arg is OK");
    assert.deepEqual($(actualArgs.itemElement).get(0), expectedArgs.itemElement.get(0), "arg is OK");
};

module("Expanded items", {
    beforeEach() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    test("Some item has'expanded' field", assert => {
        const data = $.extend(true, [], DATA[5]);
        data[0].items[1].expanded = true;
        const $treeView = initTree({
            items: data
        });

        assert.equal($treeView.find("." + internals.OPENED_NODE_CONTAINER_CLASS).length, 3);
    });

    test("expansion by itemData", assert => {
        const data = [
            { id: 1, text: "Item 1", expanded: false, items: [{ id: 11, text: "Item 11" }] }, { id: 12, text: "Item 12" }
        ];
        const treeView = initTree({ items: data }).dxTreeView("instance");

        treeView.expandItem(data[0]);
        assert.ok(data[0].expanded, "item is expanded");

        treeView.collapseItem(data[0]);
        assert.notOk(data[0].expanded, "item is not expanded");
    });

    test("onItemExpanded callback", assert => {
        const data = $.extend(true, [], DATA[5]),
            itemExpandedHandler = sinon.spy(noop),
            $treeView = initTree({
                items: data,
                onItemExpanded: itemExpandedHandler
            }),
            treeView = $treeView.dxTreeView("instance");

        const $firstItem = $treeView.find("." + internals.ITEM_CLASS).eq(0);

        treeView.expandItem($firstItem.get(0));

        assert.equal($treeView.find("." + internals.OPENED_NODE_CONTAINER_CLASS).length, 1);
        assert.ok(itemExpandedHandler.calledOnce);

        const args = itemExpandedHandler.getCall(0).args[0];

        checkFunctionArguments(assert, args, {
            event: undefined,
            itemData: data[0],
            node: treeView.getNodes()[0],
            itemElement: $firstItem
        });
    });

    test("hidden items should be rendered when deferRendering is false", assert => {
        const $treeView = initTree({
            items: [{ text: "Item 1", items: [{ text: "Item 11", items: [{ text: "Item 111" }] }] }],
            deferRendering: false
        });

        assert.equal($treeView.find(".dx-treeview-node").length, 3, "all items have been rendered");
    });

    test("onContentReady rises after first expand", assert => {
        const data = $.extend(true, [], DATA[5]);
        const onContentReadyHandler = sinon.spy(noop);
        const $treeView = initTree({
            items: data,
            onContentReady: onContentReadyHandler
        });
        const treeView = $treeView.dxTreeView("instance");

        const $firstItem = $treeView.find("." + internals.ITEM_CLASS).eq(0);

        treeView.expandItem($firstItem.get(0));

        assert.equal(onContentReadyHandler.callCount, 2);

        treeView.collapseItem($firstItem.get(0));
        treeView.expandItem($firstItem.get(0));
        assert.equal(onContentReadyHandler.callCount, 2);
    });

    test("onItemExpanded callback after click should have correct arguments", assert => {
        assert.expect(4);

        const data = $.extend(true, [], DATA[5]);
        const itemExpandedHandler = sinon.spy(noop);
        const $treeView = initTree({
            items: data,
            onItemExpanded: itemExpandedHandler
        });

        const $firstItem = $treeView.find("." + internals.ITEM_CLASS).eq(0),
            event = new $.Event("dxclick");
        $firstItem.parent().find("> ." + internals.TOGGLE_ITEM_VISIBILITY_CLASS).trigger(event);

        const args = itemExpandedHandler.getCall(0).args[0];
        checkFunctionArguments(assert, args, {
            event: event,
            itemData: data[0],
            node: $treeView.dxTreeView("instance").getNodes()[0],
            itemElement: $firstItem
        });
    });

    test("onItemCollapsed callback", assert => {
        const data = $.extend(true, [], DATA[5]);
        data[0].expanded = true;
        const itemCollapsedHandler = sinon.spy(noop);
        const $treeView = initTree({
            items: data,
            onItemCollapsed: itemCollapsedHandler
        });
        const treeView = $treeView.dxTreeView("instance");

        const $firstItem = $treeView.find("." + internals.ITEM_CLASS).eq(0);
        treeView.collapseItem($firstItem);

        assert.equal($treeView.find("." + internals.OPENED_NODE_CONTAINER_CLASS).length, 1);
        assert.ok(itemCollapsedHandler.calledOnce);

        const args = itemCollapsedHandler.getCall(0).args[0];
        checkFunctionArguments(assert, args, {
            event: undefined,
            itemData: data[0],
            node: treeView.getNodes()[0],
            itemElement: $firstItem
        });
    });

    test("onItemCollapsed callback after click should have correct arguments", assert => {
        assert.expect(4);

        const data = $.extend(true, [], DATA[5]);
        data[0].expanded = true;
        const itemCollapsedHandler = sinon.spy(noop),
            $treeView = initTree({
                items: data,
                onItemCollapsed: itemCollapsedHandler
            }),
            treeView = $treeView.dxTreeView("instance");

        const $firstItem = $treeView.find("." + internals.ITEM_CLASS).eq(0),
            event = new $.Event("dxclick");
        $firstItem.parent().find("> ." + internals.TOGGLE_ITEM_VISIBILITY_CLASS).trigger(event);

        const args = itemCollapsedHandler.getCall(0).args[0];
        checkFunctionArguments(assert, args, {
            event: event,
            itemData: data[0],
            node: treeView.getNodes()[0],
            itemElement: $firstItem
        });
    });

    test("disabled item should not expand on click", assert => {
        const data = $.extend(true, [], DATA[5]);
        data[0].disabled = true;
        const $treeView = initTree({
                items: data
            }),
            treeView = $treeView.dxTreeView("instance"),
            $firstItem = $treeView.find("." + internals.ITEM_CLASS).eq(0),
            $icon = $firstItem.parent().find("> ." + internals.TOGGLE_ITEM_VISIBILITY_CLASS);

        $icon.trigger("dxclick");

        assert.ok(!treeView.option("items")[0].expanded, "disabled item was not expanded");
    });

    test("expanded disabled item should not collapse on click", assert => {
        const data = $.extend(true, [], DATA[5]);
        data[0].expanded = true;
        data[0].disabled = true;
        const $treeView = initTree({
                items: data
            }),
            treeView = $treeView.dxTreeView("instance"),
            $firstItem = $treeView.find("." + internals.ITEM_CLASS).eq(0),
            $icon = $firstItem.parent().find("> ." + internals.TOGGLE_ITEM_VISIBILITY_CLASS);

        $icon.trigger("dxclick");

        assert.ok(treeView.option("items")[0].expanded, "disabled item was not expanded");
    });

    test("expanded item shouldn't collapse after setting .disable for it", assert => {
        const data = $.extend(true, [], DATA[5]);
        data[0].expanded = true;

        const $treeView = initTree({
                items: data
            }),
            treeView = $treeView.dxTreeView("instance"),
            items = treeView.option("items");

        items[0].disabled = true;
        treeView.option("items", items);

        assert.ok(treeView.option("items")[0].expanded, "disabled item was not expanded");
    });

    test("ui expand and collapse work correctly", function(assert) {
        const data = $.extend(true, [], DATA[5]);
        data[0].items[1].expanded = true;
        const $treeView = initTree({
                items: data
            }),
            $toggleExpandIcon = $($treeView.find(".dx-treeview-toggle-item-visibility").eq(0));

        $toggleExpandIcon.trigger("dxclick");
        assert.ok(!$toggleExpandIcon.hasClass("dx-treeview-toggle-item-visibility-opened"));

        $toggleExpandIcon.trigger("dxclick");
        this.clock.tick(100);
        assert.ok($toggleExpandIcon.hasClass("dx-treeview-toggle-item-visibility-opened"));
    });

    test("itemExpanded should be fired when expanding item", assert => {
        const data = $.extend(true, [], DATA[5]);

        const $treeView = initTree({
            items: data
        });
        const treeView = $treeView.dxTreeView("instance");
        const $toggleExpandIcon = $($treeView.find(".dx-treeview-toggle-item-visibility").eq(0));

        treeView.on("itemExpanded", () => assert.ok(true, "itemExpanded was fired"));

        $toggleExpandIcon.trigger("dxclick");
    });

    test("itemCollapsed should be fired when collapsing item by click", assert => {
        const data = $.extend(true, [], DATA[5]);
        data[0].items[1].expanded = true;
        const $treeView = initTree({
            items: data,
            expandEvent: "click"
        });
        const treeView = $treeView.dxTreeView("instance");
        const $item = $treeView.find(".dx-treeview-item").eq(0);

        treeView.on("itemCollapsed", () => assert.ok(true, "itemCollapsed was fired"));

        $item.trigger("dxclick");
    });

    test("item should expand by click when expansion by click enabled", assert => {
        const items = [{ text: "Item 1", items: [{ text: "Item 11" }] }];
        const $treeView = initTree({
            items: items,
            expandEvent: "click"
        });
        const $item = $treeView.find(".dx-treeview-item").eq(0);

        $item.trigger("dxclick");
        assert.ok(items[0].expanded, "item is expanded");
    });

    test("item should collapse by click when expansion by click enabled", assert => {
        const items = [{ text: "Item 1", items: [{ text: "Item 11" }] }];
        const $treeView = initTree({
            items: items,
            expandEvent: "click"
        });
        const $item = $treeView.find(".dx-treeview-item").eq(0);

        $item.trigger("dxclick");
        $item.trigger("dxclick");
        assert.notOk(items[0].expanded, "item is collapsed");
    });

    test("item should not expand by click when expansion by click disabling", assert => {
        const items = [{ text: "Item 1", items: [{ text: "Item 11" }] }];
        const $treeView = initTree({
            items: items,
            expandEvent: "click"
        });
        const instance = $treeView.dxTreeView("instance");
        const $item = $treeView.find(".dx-treeview-item").eq(0);

        instance.option("expandEvent", "dblclick");

        $item.trigger("dxclick");
        assert.notOk(items[0].expanded, "item is collapsed");
    });

    test("collapseAll method should collapse all expanded items", assert => {
        const items = [{ text: "Item 1", expanded: true, items: [{ text: "Item 11" }] }];
        const $treeView = initTree({
            items: items
        });
        const instance = $treeView.dxTreeView("instance");

        instance.collapseAll();

        assert.notOk(items[0].expanded, "item is collapsed");
    });

    test("onItemExpanded should not fire if item is leaf", assert => {
        const items = [{ text: "Item 1" }];
        let itemExpanded = 0;
        const $treeView = initTree({
            items: items,
            expandByClick: true,
            onItemExpanded: () => itemExpanded++
        });
        const $item = $treeView.find(".dx-treeview-item").eq(0);

        $item.trigger("dxclick");

        assert.equal(itemExpanded, 0, "event was not fired");
    });

    test("not expand parent items in non-recursive case", assert => {
        const items = [{ text: "1", id: 1, items: [{ text: "11", id: 11, items: [{ text: "111", id: 111 }] }] }];
        const $treeView = initTree({
            items: items,
            expandNodesRecursive: false
        });
        const treeView = $treeView.dxTreeView("instance");

        treeView.expandItem(11);

        let $items = $treeView.find(".dx-treeview-node");
        assert.equal($items.length, 1, "root item was expanded");

        const nodes = treeView.getNodes();
        assert.notOk(nodes[0].expanded, "root node is collapsed");
        assert.ok(nodes[0].children[0].expanded, "child node is expanded");

        treeView.expandItem(1);

        $items = $treeView.find(".dx-treeview-node");
        assert.equal($items.length, 3, "root item was expanded");
    });

    test("expand parent items in recursive case", assert => {
        const items = [{ text: "1", id: 1, items: [{ text: "11", id: 11, items: [{ text: "111", id: 111 }] }] }];
        const $treeView = initTree({
            items: items
        });
        const treeView = $treeView.dxTreeView("instance");

        treeView.expandItem(11);

        const $items = $treeView.find(".dx-treeview-node");
        assert.equal($items.length, 3, "root item was expanded");

        const nodes = treeView.getNodes();
        assert.ok(nodes[0].expanded, "root node is expanded");
        assert.ok(nodes[0].children[0].expanded, "child node is expanded");
    });

    test("Expand parent items in markup after expand of rendered nested child (T671960)", assert => {
        const items = [{
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
        }];
        const $treeView = initTree({
            items: items
        });
        const treeView = $treeView.dxTreeView("instance");

        treeView.expandAll();
        treeView.collapseAll();
        treeView.expandItem(111);

        const nodeElements = $treeView.find("." + TREEVIEW_NODE_CONTAINER_CLASS);
        assert.ok(nodeElements.eq(1).hasClass(TREEVIEW_NODE_CONTAINER_OPENED_CLASS), "item 11");
        assert.ok(nodeElements.eq(2).hasClass(TREEVIEW_NODE_CONTAINER_OPENED_CLASS), "item 111");
    });

    test("expand childless item in recursive case", assert => {
        const items = [{ text: "1", id: 1, items: [{ text: "11", id: 11 }] }];
        const $treeView = initTree({
            items: items
        });
        const treeView = $treeView.dxTreeView("instance");

        treeView.expandItem(11);

        const $items = $treeView.find(".dx-treeview-node");
        assert.equal($items.length, 2, "root item was expanded");

        const nodes = treeView.getNodes();
        assert.ok(nodes[0].expanded, "root node is expanded");
        assert.ok(nodes[0].children[0].expanded, "child node is expanded");
    });

    test("Expand all method", assert => {
        const items = [{
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
        }];
        const $treeView = initTree({
            items: items
        });
        const treeView = $treeView.dxTreeView("instance");

        treeView.expandAll();

        const nodes = treeView.getNodes();
        assert.ok(nodes[0].expanded, "item 1");
        assert.ok(nodes[0].items[0].expanded, "item 11");
        assert.ok(nodes[0].items[0].items[0].expanded, "item 111");
    });

    test("Collapse all method", assert => {
        const items = [{
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
        }];
        const $treeView = initTree({
            items: items
        });
        const treeView = $treeView.dxTreeView("instance");

        treeView.expandAll();
        treeView.collapseAll();

        const nodes = treeView.getNodes();
        assert.notOk(nodes[0].expanded, "item 1");
        assert.notOk(nodes[0].items[0].expanded, "item 11");
        assert.notOk(nodes[0].items[0].items[0].expanded, "item 111");
    });
});
