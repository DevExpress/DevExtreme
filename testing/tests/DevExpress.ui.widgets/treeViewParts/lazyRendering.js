import eventsEngine from "events/core/events_engine";
import { TreeViewTestWrapper } from "../../../helpers/TreeViewTestHelper.js";

let { module, test } = QUnit;

const createInstance = (options) => new TreeViewTestWrapper(options);

module("Lazy rendering", () => {
    test("Render treeView with special symbols in id", (assert) => {
        const treeView = createInstance({ items: [{ id: "!/#$%&'()*+,./:;<=>?@[\\]^`{|}~", text: "Item 1" }] });
        const item = treeView.instance.option("items")[0];

        assert.ok(treeView.getNodes().attr("data-item-id").length > item.id.length * 4);
    });

    test("Only root nodes should be rendered by default", (assert) => {
        const treeView = createInstance({ items: [{ id: 1, text: "Item 1", items: [{ id: 3, text: "Item 3" }] }, { id: 2, text: "Item 2" }] });
        assert.equal(treeView.getItems().length, 2);
    });

    test("Nested item should be rendered after click on toggle visibility icon", (assert) => {
        const treeView = createInstance({ items: [{ id: 1, text: "Item 1", items: [{ id: 3, text: "Item 3" }] }, { id: 2, text: "Item 2" }] });
        eventsEngine.trigger(treeView.getToggleItemVisibility(), "dxclick");

        assert.equal(treeView.getItems().length, 3);
    });

    test("Nested item should be rendered when expandItem method was called", (assert) => {
        const treeView = createInstance({ items: [{ id: 1, text: "Item 1", items: [{ id: 3, text: "Item 3" }] }, { id: 2, text: "Item 2" }] });

        treeView.instance.expandItem(treeView.getItems().eq(0).get(0));

        assert.equal(treeView.getItems().length, 3);
    });

    test("Selection should work correctly for nested items", (assert) => {
        const treeView = createInstance({
            items: [{ id: 1, text: "Item 1", items: [{ id: 3, text: "Item 3" }] }, { id: 2, text: "Item 2" }],
            showCheckBoxesMode: "normal"
        });

        treeView.instance.selectItem(treeView.getItems(0).get(0));
        treeView.instance.expandItem(treeView.getItems(0).get(0));

        assert.equal(treeView.getAllCheckedCheckboxes().length, 2);
    });

    test("Unselection should work correctly for nested items", (assert) => {
        const treeView = createInstance({
            items: [{ id: 1, text: "Item 1", selected: true, items: [{ id: 3, text: "Item 3", selected: true }] }, { id: 2, text: "Item 2" }],
            showCheckBoxesMode: "normal"
        });

        treeView.instance.unselectItem(treeView.getItems(0).get(0));
        treeView.instance.expandItem(treeView.getItems(0).get(0));

        assert.equal(treeView.getAllCheckedCheckboxes().length, 0);
    });

    test("'selectAll' should have correct state on initialization", (assert) => {
        const treeView = createInstance({
            items: [{ id: 1, text: "Item 1", selected: true, items: [{ id: 3, text: "Item 3", selected: true }] }, { id: 2, text: "Item 2", selected: true }],
            showCheckBoxesMode: "selectAll"
        });

        assert.strictEqual(treeView.getSelectAllItem().dxCheckBox("instance").option("value"), true);
    });

    test("'selectAll' should work correctly when nested items are not rendered", (assert) => {
        const treeView = createInstance({
            items: [{ id: 1, text: "Item 1", items: [{ id: 3, text: "Item 3" }] }, { id: 2, text: "Item 2" }],
            showCheckBoxesMode: "selectAll"
        });

        eventsEngine.trigger(treeView.getSelectAllItem(), "dxclick");

        assert.strictEqual(treeView.getSelectAllItem().dxCheckBox("instance").option("value"), true);
        assert.equal(treeView.getAllCheckedCheckboxes().length, 3);
    });

    test("'selectAll' should work correctly when nested items are rendered", (assert) => {
        const treeView = createInstance({
            items: [{ id: 1, text: "Item 1", items: [{ id: 3, text: "Item 3" }] }, { id: 2, text: "Item 2" }],
            showCheckBoxesMode: "selectAll"
        });

        eventsEngine.trigger(treeView.getToggleItemVisibility(), "dxclick");
        eventsEngine.trigger(treeView.getSelectAllItem(), "dxclick");

        assert.strictEqual(treeView.getSelectAllItem().dxCheckBox("instance").option("value"), true);
        assert.equal(treeView.getAllCheckedCheckboxes().length, 4);
    });

    test("'selectAll' should work correctly when nested items are rendered after click on 'selectAll' item", (assert) => {
        const treeView = createInstance({
            items: [{ id: 1, text: "Item 1", items: [{ id: 3, text: "Item 3" }] }, { id: 2, text: "Item 2" }],
            showCheckBoxesMode: "selectAll"
        });

        eventsEngine.trigger(treeView.getSelectAllItem(), "dxclick");
        eventsEngine.trigger(treeView.getToggleItemVisibility(), "dxclick");

        assert.strictEqual(treeView.getSelectAllItem().dxCheckBox("instance").option("value"), true);
        assert.equal(treeView.getAllCheckedCheckboxes().length, 4);
    });
});
