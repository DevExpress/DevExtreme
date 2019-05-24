import $ from "jquery";
import { TreeViewTestWrapper, TreeViewDataHelper } from "../../../helpers/TreeViewTestHelper.js";

let { module, test, } = QUnit;

const dataHelper = new TreeViewDataHelper();
const createInstance = (options) => new TreeViewTestWrapper(options);

module("SelectAll mode with 'selectNodesRecursive' = 'false'", {
    beforeEach: function() {
        let data = $.extend(true, [], dataHelper.data[5]);
        data[0].items[1].items[0].expanded = true;
        data[0].items[1].items[1].expanded = true;

        this.treeView = createInstance({
            items: $.extend(true, [], data),
            showCheckBoxesMode: "selectAll",
            selectNodesRecursive: false
        });
    }
}, () => {
    test("Select all items", function() {
        this.treeView.getSelectAllItem().dxCheckBox("instance").option("value", true);

        this.treeView.checkSelected([0, 1, 2, 3, 4, 5], this.treeView.instance.option('items'));
    });

    test("Unselect all items", function() {
        this.treeView.getSelectAllItem().dxCheckBox("instance").option("value", true);
        this.treeView.getSelectAllItem().dxCheckBox("instance").option("value", false);

        this.treeView.checkSelected([], this.treeView.instance.option('items'));
    });
});
