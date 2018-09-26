import $ from "jquery";
import { DataSource } from "data/data_source/data_source";

import "ui/tree_view";

QUnit.module("live update", {
    beforeEach: function() {
        this.itemRenderedSpy = sinon.spy();
        this.data = [{
            id: 1,
            text: "1",
            expanded: true
        }, {
            id: 11,
            text: "1 1",
            categoryId: 1,
            expanded: true
        }, {
            id: 111,
            text: "1 1 1",
            categoryId: 11
        }];
        this.createTreeView = (dataSourceOptions, repaintChangesOnly) => {
            var dataSource = new DataSource($.extend({
                paginate: false,
                load: () => this.data,
                key: "id"
            }, dataSourceOptions));

            return $("#treeView").dxTreeView({
                dataSource: dataSource,
                dataStructure: "plain",
                parentIdExpr: "categoryId",
                keyExpr: "id",
                displayExpr: "text",
                repaintChangesOnly: repaintChangesOnly,
                onContentReady: (e) => {
                    e.component.option("onItemRendered", this.itemRenderedSpy);
                }
            }).dxTreeView("instance");
        };
    }
}, function() {
    QUnit.test("update item", function(assert) {
        var store = this.createTreeView().getDataSource().store();

        var pushData = [{ type: "update", data: { id: 111, categoryId: 11, text: "1 1 1 updated" }, key: 111 }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 1, "only one item is updated after push");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, pushData[0].data, "check updated item");
    });

    QUnit.test("repaintChangesOnly, update item instance", function(assert) {
        var dataSource = this.createTreeView({}, true).getDataSource();

        this.data[0] = { id: 1, text: "1 updated" };
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, "only one item is updated after reload");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.text, "1 updated", "check updated item");
    });
});
