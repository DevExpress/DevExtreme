import $ from "jquery";
import { DataSource } from "data/data_source/data_source";

import "ui/list";

QUnit.module("live update", {
    beforeEach: function() {
        this.itemRenderedSpy = sinon.spy();
        this.itemDeletedSpy = sinon.spy();
        this.createList = (dataSourceOptions, repaintChangesOnly) => {
            var dataSource = new DataSource($.extend({
                paginate: false,
                load: () => [{ a: "Item 0", id: 0 }, { a: "Item 1", id: 1 }],
                key: "id"
            }, dataSourceOptions));

            return $("#templated-list").dxList({
                dataSource: dataSource,
                repaintChangesOnly: repaintChangesOnly,
                onContentReady: (e) => {
                    e.component.option("onItemRendered", this.itemRenderedSpy);
                    e.component.option("onItemDeleted", this.itemDeletedSpy);
                }
            }).dxList("instance");
        };
    }
}, function() {
    QUnit.test("update item", function(assert) {
        var store = this.createList().getDataSource().store();

        var pushData = [{ type: "update", data: { a: "Item 0 Updated", id: 0 }, key: 0 }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 1, "only one item is updated after push");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, pushData[0].data, "check updated item");
    });

    QUnit.test("add item", function(assert) {
        var store = this.createList().getDataSource().store();

        var pushData = [{ type: "insert", data: { a: "Item 2 Inserted", id: 2 } }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 1, "only one item is updated after push");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, pushData[0].data, "check added item");
    });

    QUnit.test("remove one item", function(assert) {
        var store = this.createList().getDataSource().store();

        var pushData = [{ type: "remove", key: 0 }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 0, "items are not refreshed after remove");
        assert.deepEqual(this.itemDeletedSpy.callCount, 1, "check removed items count");
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData.id, pushData[0].key, "check removed item key");
    });

    QUnit.test("update item when grouping is enabled", function(assert) {
        var store = this.createList({
            load: () => [{
                key: "a",
                items: [{ a: "Item 0", id: 0, type: "a" }, { a: "Item 2", id: 0, type: "a" }]
            }, {
                key: "b",
                items: [{ a: "Item 1", id: 1, type: "b" }]
            }],
            group: "type"
        }).getDataSource().store();

        var pushData = [{ type: "update", data: { a: "Item 0 Updated", id: 0, type: "a" }, key: 0 }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 1, "only one item is updated after push");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, pushData[0].data, "check updated item");
    });

    QUnit.test("update item when paging is enabled", function(assert) {
        var store = this.createList({
            paginate: true,
            pageSize: 2,
            load: (loadOptions) => {
                if(loadOptions.skip > 0) {
                    return [{ a: "Item 2", id: 2 }, { a: "Item 3", id: 3 }];
                }
                return [{ a: "Item 0", id: 0 }, { a: "Item 1", id: 1 }];
            }
        }).getDataSource().store();

        var $moreButton = $("#templated-list .dx-list-next-button > .dx-button").eq(0);
        $moreButton.trigger("dxclick");

        this.itemRenderedSpy.reset();
        var pushData = [
            { type: "update", data: { a: "Item 0 Updated", id: 0 }, key: 0 },
            { type: "update", data: { a: "Item 2 Updated", id: 2 }, key: 2 },
        ];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 2, "items from different pages are updated after push");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, pushData[0].data, "check first updated item");
        assert.deepEqual(this.itemRenderedSpy.lastCall.args[0].itemData, pushData[1].data, "check last updated item");
    });

    QUnit.test("repaintChangesOnly, update item instance", function(assert) {
        var data = [{ a: "Item 0", id: 0 }, { a: "Item 1", id: 1 }];
        var dataSource = this.createList({
            load: () => data,
            key: "id"
        }, true).getDataSource();

        data[0] = { a: "Item Updated", id: 0 };
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, "only one item is updated after reload");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, "Item Updated", "check updated item");
    });

    QUnit.test("repaintChangesOnly, update item field", function(assert) {
        var data = [{ a: "Item 0", id: 0 }, { a: "Item 1", id: 1 }];
        var dataSource = this.createList({
            load: () => data,
            key: "id"
        }, true).getDataSource();

        data[0].a = "Item Updated";
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, "only one item is updated after reload");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, "Item Updated", "check updated item");
    });

    QUnit.test("repaintChangesOnly, grouping, update all", function(assert) {
        var data = [{
            key: "a",
            items: [{ a: "Item 0", id: 0, type: "a" }, { a: "Item 2", id: 1, type: "a" }]
        }, {
            key: "b",
            items: [{ a: "Item 1", id: 2, type: "b" }]
        }];
        var dataSource = this.createList({
            load: () => data,
            key: "id",
            group: "type"
        }, true).getDataSource();

        data[0].items[0].a = "Item Updated";
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 2, "all item is updated after reload");
    });

    QUnit.test("repaintChangesOnly, update dataSource", function(assert) {
        var data = [{ a: "Item 0", id: 0 }, { a: "Item Updated", id: 1 }];
        var list = this.createList({
            load: () => [data[0]],
            key: "id"
        }, true);

        var dataSource = new DataSource({
            paginate: false,
            load: () => data,
            key: "id"
        });
        list.option("dataSource", dataSource);

        assert.equal(this.itemRenderedSpy.callCount, 1, "only one item is updated after reload");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, "Item Updated", "check updated item");
    });

    QUnit.test("repaintChangesOnly, update store item", function(assert) {
        var data = [{ a: "Item 0", id: 0 }, { a: "Item 1", id: 1 }];
        var dataSource = this.createList({
            load: () => data,
            key: "id",
            update: (key, value) => data[0].a = value.a
        }, true).getDataSource();

        dataSource.store().update(0, { a: "Item Updated", id: 0 });
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, "only one item is updated after reload");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, "Item Updated", "check updated item");
    });

    QUnit.test("repaintChangesOnly, delete item", function(assert) {
        var data = [{ a: "Item 0", id: 0 }, { a: "Item 1", id: 1 }];
        var dataSource = this.createList({
            load: () => data,
            key: "id"
        }, true).getDataSource();

        data.splice(0, 1);
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 0, "no updated items");
        assert.equal(this.itemDeletedSpy.callCount, 1, "one item is deleted");
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData.a, "Item 0", "check deleted item");
    });

    QUnit.test("repaintChangesOnly, add item", function(assert) {
        var data = [{ a: "Item 0", id: 0 }, { a: "Item 1", id: 1 }];
        var dataSource = this.createList({
            load: () => data,
            key: "id"
        }, true).getDataSource();

        data.push({ a: "Item 2", id: 2 });
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, "only one item is rendered after append");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, "Item 2", "check appended item");
    });

    QUnit.test("repaintChangesOnly, update item instance with composite key", function(assert) {
        var data = [{ a: "Item 0", id: 0, key: 1 }, { a: "Item 1", id: 0, key: 0 }];
        var dataSource = this.createList({
            load: () => data,
            key: ["id", "key"]
        }, true).getDataSource();

        data[0] = { a: "Item Updated", id: 0, key: 1 };
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, "only one item is updated after reload");
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.a, "Item Updated", "check updated item");
    });
});
