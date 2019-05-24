import $ from "jquery";
import commonUtils from "core/utils/common";
import { TreeViewTestWrapper } from "../../../helpers/TreeViewTestHelper.js";
import eventsEngine from "events/core/events_engine";

const { module, test } = QUnit;
const createInstance = (options) => new TreeViewTestWrapper(options);

module("Usage without keys", () => {
    test("Keys should be generated automatically", (assert) => {
        const treeView = createInstance({ items: [{ text: "Item 1", items: [{ text: "Nested item 1" }, { text: "Nested item 2" }] }, { text: "Item 2" }] });

        let nodes = treeView.instance.getNodes();

        assert.equal(nodes[0].key, 1);
        assert.equal(nodes[0].items[0].key, 2);
        assert.equal(nodes[0].items[1].key, 3);
        assert.equal(nodes[1].key, 4);
    });

    test("Keys generation should not affect source items", (assert) => {
        const treeView = createInstance({ items: [{ text: "Item 1", items: [{ text: "Nested item 1" }, { text: "Nested item 2" }] }, { text: "Item 2" }] });

        var items = treeView.instance.option("items");

        assert.strictEqual(items[0].id, undefined);
        assert.strictEqual(items[0].items[0].id, undefined);
        assert.strictEqual(items[0].items[1].id, undefined);
        assert.strictEqual(items[1].id, undefined);
    });

    test("Nested items should be rendered correctly", (assert) => {
        const treeView = createInstance({ items: [{ text: "Item 1", items: [{ text: "Nested item 1" }, { text: "Nested item 2" }] }, { text: "Item 2" }] });

        eventsEngine.trigger(treeView.getToggleItemVisibility(), "dxclick");

        assert.equal(treeView.getItems().length, 4);
    });

    test("onItemSelectionChanged event should work correctly", (assert) => {
        let onItemSelectionChanged = sinon.spy(commonUtils.noop);
        const treeView = createInstance({
            items: [{ text: "Item 1" }, { text: "Item 2" }],
            showCheckBoxesMode: "normal",
            onItemSelectionChanged: onItemSelectionChanged
        });

        eventsEngine.trigger(treeView.getCheckBoxes().eq(0), "dxclick");

        let args = onItemSelectionChanged.getCall(0).args[0];

        assert.strictEqual(args.itemData.id, undefined);
        assert.equal(args.node.key, 1);
    });

    test("Parent should be updated correctly", (assert) => {
        const treeView = createInstance({
            items: [{ text: "Item 1", expanded: true, items: [{ text: "Nested item" }] }, { text: "Item 2" }],
            showCheckBoxesMode: "normal"
        });

        eventsEngine.trigger(treeView.getCheckBoxes().eq(1), "dxclick");

        assert.ok(treeView.instance.getNodes()[0].selected);
    });

    test("selectItem() method", (assert) => {
        const treeView = createInstance({
            items: [{ text: "Item 1", expanded: true, items: [{ text: "Nested item" }] }, { text: "Item 2" }],
            showCheckBoxesMode: "normal"
        });

        treeView.instance.selectItem(treeView.getItems(1).get(0));

        let nodes = treeView.instance.getNodes(),
            items = treeView.instance.option("items");

        assert.ok(nodes[0].selected);
        assert.ok(nodes[0].items[0].selected);
        assert.ok(!nodes[1].selected);

        assert.ok(items[0].selected);
        assert.ok(items[0].items[0].selected);
        assert.ok(!items[1].selected);

        treeView.checkCheckBoxesState([true, true, false]);
    });

    test("unselectItem() method", (assert) => {
        const treeView = createInstance({
            items: [{ text: "Item 1", expanded: true, items: [{ text: "Nested item", selected: true }] }, { text: "Item 2" }],
            showCheckBoxesMode: "normal"
        });

        treeView.instance.unselectItem(treeView.getItems(1).get(0));

        let nodes = treeView.instance.getNodes(),
            items = treeView.instance.option("items");

        assert.ok(!nodes[0].selected);
        assert.ok(!nodes[0].items[0].selected);
        assert.ok(!nodes[1].selected);

        assert.ok(!items[0].selected);
        assert.ok(!items[0].items[0].selected);
        assert.ok(!items[1].selected);

        treeView.checkCheckBoxesState([false, false, false]);
    });


    test("expandItem() method", (assert) => {
        const treeView = createInstance({
            items: [{ text: "Item 1", items: [{ text: "Nested item" }] }, { text: "Item 2" }],
            showCheckBoxesMode: "normal"
        });

        treeView.instance.expandItem(treeView.getItems(0).get(0));

        let nodes = treeView.instance.getNodes(),
            items = treeView.instance.option("items");

        assert.ok(nodes[0].expanded);
        assert.ok(!nodes[1].expanded);

        assert.ok(items[0].expanded);
        assert.ok(!items[1].expanded);
    });

    test("expandItem method should not reset item data", (assert) => {
        const treeView = createInstance({
            items: [{ text: "Item 1", items: [{ text: "Nested item" }] }, { text: "Item 2" }],
            onItemClick: (e) => {
                let el = $(e.itemElement);
                let data = el.data();
                e.component.expandItem(e.itemElement);

                assert.deepEqual(el.data(), data, "Item data is OK");
            }
        });

        eventsEngine.trigger(treeView.getItems(0), "dxclick");
    });

    test("expandItem should work with item ids and tree dataStructure", (assert) => {
        const items = [{ text: "Item 1", id: "item-1", items: [{ text: "Nested item", id: "item-1-1" }] }, { text: "Item 2", id: "item-2" }];
        const treeView = createInstance({
            items: items,
            dataStructure: "tree"
        });

        treeView.instance.expandItem("item-1");

        assert.strictEqual(items[0].expanded, true, "item was expanded");
    });

    test("collapseItem() method", (assert) => {
        const treeView = createInstance({
            items: [{ text: "Item 1", expanded: true, items: [{ text: "Nested item" }] }, { text: "Item 2" }],
            showCheckBoxesMode: "normal"
        });

        treeView.instance.collapseItem(treeView.getItems(0).get(0));

        let nodes = treeView.instance.getNodes(),
            items = treeView.instance.option("items");

        assert.ok(!nodes[0].expanded);
        assert.ok(!nodes[1].expanded);

        assert.ok(!items[0].expanded);
        assert.ok(!items[1].expanded);
    });

    test("collapseItem method should not reset item data", (assert) => {
        const treeView = createInstance({
            items: [{ text: "Item 1", items: [{ text: "Nested item" }] }, { text: "Item 2" }],
            onItemClick: (e) => {
                let el = $(e.itemElement);
                let data = el.data();
                e.component.collapseItem(e.itemElement);

                assert.deepEqual(el.data(), data, "Item data is OK");
            }
        });

        eventsEngine.trigger(treeView.getItems(0), "dxclick");
    });

    test("select all items using select all checkbox", (assert) => {
        const treeView = createInstance({
            items: [{ text: "Item 1", expanded: true, items: [{ text: "Nested item" }] }, { text: "Item 2" }],
            showCheckBoxesMode: "selectAll"
        });

        eventsEngine.trigger($(treeView.instance._$selectAllItem), "dxclick");
        let nodes = treeView.instance.getNodes(),
            items = treeView.instance.option("items");

        assert.ok(nodes[0].selected);
        assert.ok(nodes[0].items[0].selected);
        assert.ok(nodes[1].selected);

        assert.ok(items[0].selected);
        assert.ok(items[0].items[0].selected);
        assert.ok(items[1].selected);

        eventsEngine.trigger($(treeView.instance._$selectAllItem), "dxclick");
        nodes = treeView.instance.getNodes();

        assert.ok(!nodes[0].selected);
        assert.ok(!nodes[0].items[0].selected);
        assert.ok(!nodes[1].selected);

        assert.ok(!items[0].selected);
        assert.ok(!items[0].items[0].selected);
        assert.ok(!items[1].selected);
    });
});

