import $ from "jquery";
import { noop } from "core/utils/common";
import fx from "animation/fx";
import eventsEngine from "events/core/events_engine";
import { TreeViewTestWrapper, TreeViewDataHelper } from "../../../helpers/TreeViewTestHelper.js";

let { module, test } = QUnit;

const createInstance = (options) => new TreeViewTestWrapper(options);
const dataHelper = new TreeViewDataHelper();

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
        const data = $.extend(true, [], dataHelper.data[5]);
        data[0].items[1].expanded = true;
        const treeView = createInstance({ items: data });

        assert.equal(treeView.getOpenedContainers().length, 3);
    });

    test("expansion by itemData", assert => {
        const data = [ { id: 1, text: "Item 1", expanded: false, items: [{ id: 11, text: "Item 11" }] }, { id: 12, text: "Item 12" } ];
        const treeView = createInstance({ items: data });

        treeView.instance.expandItem(data[0]);
        assert.ok(data[0].expanded, "item is expanded");

        treeView.instance.collapseItem(data[0]);
        assert.notOk(data[0].expanded, "item is not expanded");
    });

    test("onItemExpanded callback", assert => {
        let itemExpandedHandler = sinon.spy(noop);
        const data = $.extend(true, [], dataHelper.data[5]);
        const treeView = createInstance({
            items: data,
            onItemExpanded: itemExpandedHandler
        });
        const $firstItem = treeView.getItems(0);

        treeView.instance.expandItem(treeView.getItems(0).get(0));

        assert.equal(treeView.getOpenedContainers().length, 1);
        assert.ok(itemExpandedHandler.calledOnce);

        const args = itemExpandedHandler.getCall(0).args[0];
        treeView.checkArguments(args, {
            event: undefined,
            itemData: data[0],
            node: treeView.instance.getNodes()[0],
            itemElement: $firstItem
        });
    });

    test("hidden items should be rendered when deferRendering is false", assert => {
        const treeView = createInstance({
            items: [{ text: "Item 1", items: [{ text: "Item 11", items: [{ text: "Item 111" }] }] }],
            deferRendering: false
        });

        assert.equal(treeView.getNodes().length, 3, "all items have been rendered");
    });

    test("onContentReady rises after first expand", assert => {
        const data = $.extend(true, [], dataHelper.data[5]);
        const onContentReadyHandler = sinon.spy(noop);
        const treeView = createInstance({
            items: data,
            onContentReady: onContentReadyHandler
        });
        const $firstItem = treeView.getItems(0);

        treeView.instance.expandItem($firstItem.get(0));
        assert.equal(onContentReadyHandler.callCount, 2);

        treeView.instance.collapseItem($firstItem.get(0));
        treeView.instance.expandItem($firstItem.get(0));
        assert.equal(onContentReadyHandler.callCount, 2);
    });

    test("onItemExpanded callback after click should have correct arguments", assert => {
        assert.expect(4);

        const data = $.extend(true, [], dataHelper.data[5]);
        const itemExpandedHandler = sinon.spy(noop);
        const treeView = createInstance({
            items: data,
            onItemExpanded: itemExpandedHandler
        });
        const $firstItem = treeView.getItems(0);
        let event = new $.Event("dxclick");
        treeView.getToggleItemVisibility().trigger(event);

        const args = itemExpandedHandler.getCall(0).args[0];
        treeView.checkArguments(args, {
            event: event,
            itemData: data[0],
            node: treeView.instance.getNodes()[0],
            itemElement: $firstItem
        });
    });

    test("onItemCollapsed callback", assert => {
        const data = $.extend(true, [], dataHelper.data[5]);
        data[0].expanded = true;
        const itemCollapsedHandler = sinon.spy(noop);
        const treeView = createInstance({
            items: data,
            onItemCollapsed: itemCollapsedHandler
        });

        const $firstItem = treeView.getItems(0);
        treeView.instance.collapseItem($firstItem);

        assert.equal(treeView.getOpenedContainers().length, 1);
        assert.ok(itemCollapsedHandler.calledOnce);

        const args = itemCollapsedHandler.getCall(0).args[0];
        treeView.checkArguments(args, {
            event: undefined,
            itemData: data[0],
            node: treeView.instance.getNodes()[0],
            itemElement: $firstItem
        });
    });

    test("onItemCollapsed callback after click should have correct arguments", assert => {
        assert.expect(4);

        const data = $.extend(true, [], dataHelper.data[5]);
        data[0].expanded = true;
        const itemCollapsedHandler = sinon.spy(noop);
        const treeView = createInstance({
            items: data,
            onItemCollapsed: itemCollapsedHandler
        });

        const $firstItem = treeView.getItems(0);
        let event = new $.Event("dxclick");
        treeView.getToggleItemVisibility().trigger(event);

        const args = itemCollapsedHandler.getCall(0).args[0];
        treeView.checkArguments(args, {
            event: event,
            itemData: data[0],
            node: treeView.instance.getNodes()[0],
            itemElement: $firstItem
        });
    });

    test("disabled item should not expand on click", assert => {
        const data = $.extend(true, [], dataHelper.data[5]);
        data[0].disabled = true;
        const treeView = createInstance({ items: data });

        eventsEngine.trigger(treeView.getToggleItemVisibility(), "dxclick");

        assert.ok(!treeView.instance.option("items")[0].expanded, "disabled item was not expanded");
    });

    test("expanded disabled item should not collapse on click", assert => {
        const data = $.extend(true, [], dataHelper.data[5]);
        data[0].expanded = true;
        data[0].disabled = true;
        const treeView = createInstance({ items: data });

        eventsEngine.trigger(treeView.getToggleItemVisibility(), "dxclick");

        assert.ok(treeView.instance.option("items")[0].expanded, "disabled item was not collapsed");
    });

    test("expanded item shouldn't collapse after setting .disable for it", assert => {
        const data = $.extend(true, [], dataHelper.data[5]);
        data[0].expanded = true;

        const treeView = createInstance({ items: data });
        let items = treeView.instance.option("items");

        items[0].disabled = true;
        treeView.instance.option("items", items);

        assert.ok(treeView.instance.option("items")[0].expanded, "disabled item was not expanded");
    });

    test("ui expand and collapse work correctly", function(assert) {
        const data = $.extend(true, [], dataHelper.data[5]);
        data[0].items[1].expanded = true;
        const treeView = createInstance({
            items: data
        });

        eventsEngine.trigger(treeView.getToggleItemVisibility(), "dxclick");
        assert.ok(!treeView.isToggleItemVisibilityOpened());

        eventsEngine.trigger(treeView.getToggleItemVisibility(), "dxclick");
        this.clock.tick(100);
        assert.ok(treeView.isToggleItemVisibilityOpened());
    });

    test("itemExpanded should be fired when expanding item", assert => {
        const data = $.extend(true, [], dataHelper.data[5]);
        const treeView = createInstance({ items: data });

        treeView.instance.on("itemExpanded", () => assert.ok(true, "itemExpanded was fired"));

        eventsEngine.trigger(treeView.getToggleItemVisibility(), "dxclick");
    });

    test("itemCollapsed should be fired when collapsing item by click", assert => {
        const data = $.extend(true, [], dataHelper.data[5]);
        data[0].items[1].expanded = true;
        const treeView = createInstance({
            items: data,
            expandEvent: "click"
        });
        treeView.instance.on("itemCollapsed", () => assert.ok(true, "itemCollapsed was fired"));

        eventsEngine.trigger(treeView.getItems(0), "dxclick");
    });

    test("item should expand by click when expansion by click enabled", assert => {
        const items = [{ text: "Item 1", items: [{ text: "Item 11" }] }];
        const treeView = createInstance({
            items: items,
            expandEvent: "click"
        });

        eventsEngine.trigger(treeView.getItems(0), "dxclick");
        assert.ok(items[0].expanded, "item is expanded");
    });

    test("item should collapse by click when expansion by click enabled", assert => {
        const items = [{ text: "Item 1", items: [{ text: "Item 11" }] }];
        const treeView = createInstance({
            items: items,
            expandEvent: "click"
        });

        eventsEngine.trigger(treeView.getItems(0), "dxclick");
        eventsEngine.trigger(treeView.getItems(0), "dxclick");

        assert.notOk(items[0].expanded, "item is collapsed");
    });

    test("item should not expand by click when expansion by click disabling", assert => {
        const items = [{ text: "Item 1", items: [{ text: "Item 11" }] }];
        const treeView = createInstance({
            items: items,
            expandEvent: "click"
        });

        treeView.instance.option("expandEvent", "dblclick");

        eventsEngine.trigger(treeView.getItems(0), "dxclick");
        assert.notOk(items[0].expanded, "item is collapsed");
    });

    test("collapseAll method should collapse all expanded items", assert => {
        const items = [{ text: "Item 1", expanded: true, items: [{ text: "Item 11" }] }];
        const treeView = createInstance({ items: items });

        treeView.instance.collapseAll();

        assert.notOk(items[0].expanded, "item is collapsed");
    });

    test("onItemExpanded should not fire if item is leaf", assert => {
        const items = [{ text: "Item 1" }];
        let itemExpanded = sinon.spy();
        const treeView = createInstance({
            items: items,
            expandByClick: true,
            onItemExpanded: itemExpanded
        });

        eventsEngine.trigger(treeView.getItems(0), "dxclick");

        assert.equal(itemExpanded.callCount, 0, "event was not fired");
    });

    test("not expand parent items in non-recursive case", assert => {
        const items = [{ text: "1", id: 1, items: [{ text: "11", id: 11, items: [{ text: "111", id: 111 }] }] }];
        const treeView = createInstance({
            items: items,
            expandNodesRecursive: false
        });

        treeView.instance.expandItem(11);
        assert.equal(treeView.getNodes().length, 1, "root item was expanded");

        const nodes = treeView.instance.getNodes();
        assert.notOk(nodes[0].expanded, "root node is collapsed");
        assert.ok(nodes[0].children[0].expanded, "child node is expanded");

        treeView.instance.expandItem(1);
        assert.equal(treeView.getNodes().length, 3, "root item was expanded");
    });

    test("expand parent items in recursive case", assert => {
        const items = [{ text: "1", id: 1, items: [{ text: "11", id: 11, items: [{ text: "111", id: 111 }] }] }];
        const treeView = createInstance({
            items: items
        });
        treeView.instance.expandItem(11);
        assert.equal(treeView.getNodes().length, 3, "root item was expanded");

        const nodes = treeView.instance.getNodes();
        assert.ok(nodes[0].expanded, "root node is expanded");
        assert.ok(nodes[0].children[0].expanded, "child node is expanded");
    });

    test("Expand parent items in markup after expand of rendered nested child (T671960)", assert => {
        const items = [{ text: "1", id: 1, items: [{ text: "11", id: 11, items: [{ text: "111", id: 111 }] }] }];
        const treeView = createInstance({
            items: items
        });
        treeView.instance.expandAll();
        treeView.instance.collapseAll();
        treeView.instance.expandItem(111);

        const $nodeContainers = treeView.getElement().find(`.${treeView.classes.NODE_CONTAINER_CLASS}`);
        assert.ok(treeView.isNodeContainerOpened($nodeContainers.eq(1)), "item 11");
        assert.ok(treeView.isNodeContainerOpened($nodeContainers.eq(2)), "item 111");
    });

    test("expand childless item in recursive case", assert => {
        const items = [{ text: "1", id: 1, items: [{ text: "11", id: 11 }] }];
        const treeView = createInstance({ items: items });

        treeView.instance.expandItem(11);
        assert.equal(treeView.getNodes().length, 2, "root item was expanded");

        const nodes = treeView.instance.getNodes();
        assert.ok(nodes[0].expanded, "root node is expanded");
        assert.ok(nodes[0].children[0].expanded, "child node is expanded");
    });

    test("Expand all method", assert => {
        const items = [{ text: "1", id: 1, items: [{ text: "11", id: 11, items: [{ text: "111", id: 111 }] }] }];
        const treeView = createInstance({ items: items });
        treeView.instance.expandAll();

        const nodes = treeView.instance.getNodes();
        assert.ok(nodes[0].expanded, "item 1");
        assert.ok(nodes[0].items[0].expanded, "item 11");
        assert.ok(nodes[0].items[0].items[0].expanded, "item 111");
    });

    test("Collapse all method", assert => {
        const items = [{ text: "1", id: 1, items: [{ text: "11", id: 11, items: [{ text: "111", id: 111 }] }] }];
        const treeView = createInstance({
            items: items
        });

        treeView.instance.expandAll();
        treeView.instance.collapseAll();

        const nodes = treeView.instance.getNodes();
        assert.notOk(nodes[0].expanded, "item 1");
        assert.notOk(nodes[0].items[0].expanded, "item 11");
        assert.notOk(nodes[0].items[0].items[0].expanded, "item 111");
    });
});
