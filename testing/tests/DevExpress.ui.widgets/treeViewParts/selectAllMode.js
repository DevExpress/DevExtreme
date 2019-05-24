import $ from "jquery";
import { TreeViewTestWrapper, TreeViewDataHelper } from "../../../helpers/TreeViewTestHelper.js";

let { module, test, } = QUnit;

const createInstance = (options) => new TreeViewTestWrapper(options);
const dataHelper = new TreeViewDataHelper();

module("SelectAll mode", () => {
    test("select all item should not be rendered when single selection mode is used", function(assert) {
        const treeView = createInstance({
            items: [{ id: 1, text: "Item 1" }],
            showCheckBoxesMode: "selectAll",
            selectionMode: "single"
        });

        assert.equal(treeView.getSelectAllItem().length, 0, "item is not rendered");
    });

    test("Select all items", function(assert) {
        const data = [{ id: 1, text: "Item 1" }, { id: 2, text: "Item 2" }, { id: 3, text: "Item 3" }];
        const treeView = createInstance({
            items: $.extend(true, [], data),
            showCheckBoxesMode: "selectAll"
        });

        let checkBox = treeView.instance._$selectAllItem.dxCheckBox("instance");

        checkBox.option("value", true);
        treeView.checkSelected([0, 1, 2], treeView.instance.option("items"));

        checkBox.option("value", false);
        treeView.checkSelected([], treeView.instance.option("items"));
    });

    test("'selectAll' item should be selected if all items are selected", function(assert) {
        const treeView = createInstance({
            items: $.extend(true, [], dataHelper.data[5]),
            showCheckBoxesMode: "selectAll"
        });

        treeView.getCheckBoxes().each((_, checkbox) => {
            $(checkbox).dxCheckBox("instance").option("value", true);
        });

        treeView.checkSelectedItems([0, 1, 2, 3, 4, 5], treeView.instance.option("items"));
        treeView.checkSelectedNodes([0, 1]);
        treeView.checkCheckBoxesState([true, true, true]);

        assert.ok(treeView.getSelectAllItem().dxCheckBox("instance").option("value"));
    });

    test("'selectAll' item should be unselected if all items are unselected", function(assert) {
        const treeView = createInstance({
            items: $.extend(true, [], dataHelper.data[5]),
            showCheckBoxesMode: "selectAll"
        });

        treeView.instance.selectAll();

        treeView.getCheckBoxes().each((_, checkbox) => {
            $(checkbox).dxCheckBox("instance").option("value", false);
        });

        treeView.checkSelectedItems([], treeView.instance.option("items"));
        treeView.checkSelectedNodes([]);
        treeView.checkCheckBoxesState([false, false, false]);
        assert.ok(!treeView.getSelectAllItem().dxCheckBox("instance").option("value"));
    });

    test("'selectAll' item should have intermediate state if at least one item is unselected", function(assert) {
        const treeView = createInstance({
            items: $.extend(true, [], dataHelper.data[5]),
            showCheckBoxesMode: "selectAll"
        });

        treeView.instance.selectAll();
        treeView.getCheckBoxes().eq(1).dxCheckBox("instance").option("value", false);

        treeView.checkCheckBoxesState([true, false]);
        assert.ok(!treeView.getSelectAllItem().dxCheckBox("instance").option("value"));
    });

    test("'selectAll' item should be selected if all item became selected", function(assert) {
        const treeView = createInstance({
            items: $.extend(true, [], dataHelper.data[5]),
            showCheckBoxesMode: "selectAll"
        });

        assert.ok(!treeView.getSelectAllItem().dxCheckBox("instance").option("value"));

        let items = treeView.instance.option("items");
        items[0].selected = true;
        items[1].selected = true;

        treeView.instance.option("items", items);

        assert.strictEqual(treeView.getSelectAllItem().dxCheckBox("instance").option("value"), true, 'selected');
    });

    test("Select and unselect all items via API", function(assert) {
        const treeView = createInstance({
            items: $.extend(true, [], dataHelper.data[5]),
            showCheckBoxesMode: "selectAll"
        });

        let selectAllItem = treeView.getSelectAllItem().dxCheckBox("instance");
        assert.ok(!selectAllItem.option("value"));
        treeView.instance.selectAll();

        assert.ok(selectAllItem.option("value"));
        treeView.checkSelectedItems([0, 1, 2, 3, 4, 5], treeView.instance.option("items"));
        treeView.checkSelectedNodes([0, 1]);

        treeView.instance.unselectAll();

        assert.ok(!selectAllItem.option("value"));
        treeView.checkSelected([], treeView.instance.option("items"));
    });

});
