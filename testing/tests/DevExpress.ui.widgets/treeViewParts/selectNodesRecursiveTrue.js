import $ from "jquery";
import eventsEngine from "events/core/events_engine";
import { TreeViewTestWrapper, TreeViewDataHelper } from "../../../helpers/TreeViewTestHelper.js";

let { module, test, } = QUnit;

const dataHelper = new TreeViewDataHelper();
const createInstance = (options) => new TreeViewTestWrapper(options);

module("selectNodesRecursive = true", () => {
    test("ignore invisible items on select (T317454)", (assert) => {
        const items = [{
            text: 'item 1', expanded: true, items: [
                { text: 'item 11', selected: false },
                { text: 'item 12', visible: false, selected: false }
            ]
        }];

        const treeView = createInstance({
            items: items,
            showCheckBoxesMode: "selectAll"
        });

        treeView.instance.selectItem(items[0].items[0]);
        assert.strictEqual(items[0].selected, true, "parent item ignore invisible selection");
        assert.strictEqual(treeView.getSelectAllItem().dxCheckBox("instance").option("value"), true, "selectAll item ignore invisible selection");
    });

    test("ignore invisible items on unselect (T317454)", (assert) => {
        const items = [{
            text: 'item 1', expanded: true, items: [
                { text: 'item 11' },
                { text: 'item 12', visible: false, selected: true },
                { text: 'item 13', visible: false }
            ]
        }];

        const treeView = createInstance({
            items: items,
            showCheckBoxesMode: "selectAll"
        });

        treeView.instance.selectItem(items[0]);
        assert.notOk(items[0].items[2].selected, "invisible item ignores parent selection");

        treeView.instance.unselectItem(items[0].items[0]);
        assert.strictEqual(items[0].selected, false, "parent item ignore invisible selection");
        assert.strictEqual(treeView.getSelectAllItem().dxCheckBox("instance").option("value"), false, "selectAll item ignore invisible selection");
    });

    test("Unselect disabled item via API", (assert) => {
        let data = $.extend(true, [], dataHelper.data[2]);
        data[0].disabled = true;
        data[0].selected = true;

        const treeView = createInstance({
            items: data,
            showCheckBoxesMode: "normal"
        });

        assert.ok(treeView.instance.option("items")[0].selected, "item is selected");
        treeView.instance.unselectItem(treeView.getItems(0).get(0));
        assert.notOk(treeView.instance.option("items")[0].selected, "item is not selected");
    });

    test("selection by key", (assert) => {
        let data = [
            { id: 1, text: "Item 1", expanded: true, items: [{ id: 11, text: "Item 11" }] }, { id: 12, text: "Item 12" }
        ];
        const treeView = createInstance({ items: data });

        treeView.instance.selectItem(1);
        assert.ok(data[0].selected);

        treeView.instance.unselectItem(1);
        assert.notOk(data[0].selected);
    });

    test("Toggle node selected class", (assert) => {
        var data = $.extend(true, [], dataHelper.data[2]);
        data[0].selected = true;
        data[0].expanded = true;

        const treeView = createInstance({
            items: data,
            showCheckBoxesMode: "normal"
        });

        assert.equal(treeView.getSelectedItems().length, 3, "3 selected items");

        eventsEngine.trigger(treeView.getCheckBoxes(1), "dxclick");
        assert.equal(treeView.getSelectedItems().length, 1, "1 selected items");

        eventsEngine.trigger(treeView.getCheckBoxes(2), "dxclick");
        assert.equal(treeView.getSelectedItems().length, 0, "0 selected items");
    });

    test("'selectItem()' by itemData", (assert) => {
        let data = $.extend(true, [], dataHelper.data[5]);
        data[0].items[1].items[0].expanded = true;
        data[0].items[1].items[1].expanded = true;

        const treeView = createInstance({
            items: data,
            showCheckBoxesMode: "normal"
        });

        treeView.instance.selectItem(data[0]);
        treeView.checkSelected([0, 1, 2, 3, 4], data);
        assert.ok(data[0].selected, "item was selected");
    });

    test("'unselectItem()' by itemData", (assert) => {
        let data = $.extend(true, [], dataHelper.data[5]);
        data[0].items[1].items[0].expanded = true;
        data[0].items[1].items[1].expanded = true;

        const treeView = createInstance({
            items: data,
            showCheckBoxesMode: "normal"
        });

        treeView.instance.selectItem(data[0]);
        treeView.instance.unselectItem(data[0]);

        treeView.checkSelected([], data);
        assert.ok(!data[0].selected, "item was unselected");
    });

});
