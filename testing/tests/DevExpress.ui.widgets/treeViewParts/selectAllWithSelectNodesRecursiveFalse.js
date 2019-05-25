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
        this.checkAllItemsSelection = function(selection) {
            var items = this.treeView.instance.option('items'),
                count = 0;

            count = items[0].selected === selection ? (count + 1) : count;
            count = items[0].items[0].selected === selection ? (count + 1) : count;
            count = items[0].items[1].selected === selection ? (count + 1) : count;
            count = items[0].items[1].items[0].selected === selection ? (count + 1) : count;
            count = items[0].items[1].items[1].selected === selection ? (count + 1) : count;
            count = items[1].selected === selection ? (count + 1) : count;

            return count;
        };
    }
}, () => {
    test("Select all items", function(assert) {
        this.treeView.getSelectAllItem().dxCheckBox("instance").option("value", true);

        this.treeView.checkSelectedNodes([0, 1, 2, 3, 4, 5]);
        assert.equal(this.checkAllItemsSelection(true), 6, "all items were selected");
    });

    test("Unselect all items", function(assert) {
        this.treeView.getSelectAllItem().dxCheckBox("instance").option("value", true);
        this.treeView.getSelectAllItem().dxCheckBox("instance").option("value", false);

        this.treeView.checkSelectedNodes([]);
        assert.equal(this.checkAllItemsSelection(false), 6, "all items were unselected");
    });
});
