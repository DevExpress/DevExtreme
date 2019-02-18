import $ from "jquery";
import CollectionWidget from "ui/collection/ui.collection_widget.live_update";
import { DataSource } from "data/data_source/data_source";

function generateData(count) {
    let items = [];
    for(let i = 0; i < count; i++) {
        items.push({ id: i, text: "text " + i, index: i + 10 });
    }
    return items;
}

const TestComponent = CollectionWidget.inherit({

    NAME: "TestComponent",

    _activeStateUnit: ".item",

    _itemClass: () => "item",

    _itemDataKey: () => "123",

    _itemContainer() {
        return this.$element();
    },

    _shouldAppendItems: () => true,

    reload() {
        this.callBase();
        this.option("items", []);
        this._dataSource.pageIndex(0);
        this._dataSource.reload();
    },

    loadNextPage() {
        const dataSource = this._dataSource;
        dataSource.pageIndex(1 + dataSource.pageIndex());
        dataSource.load();
    }

});

export const run = function() {
    QUnit.module("live update", {
        beforeEach: function() {
            this.$element = $("#cmp");
            this.data = generateData(10);
            this.items = () => this.instance.option("items");
            this.onCustomizeStoreLoadOptionsSpy = sinon.spy();
            this.onItemDeletingSpy = sinon.spy();
            this.instance = new TestComponent(this.$element, {
                dataSource: new DataSource({
                    load: (e) => this.data.sort((a, b) => a.index - b.index),
                    loadMode: "raw",
                    pageSize: 2,
                    pushAggregationTimeout: 0,
                    onCustomizeStoreLoadOptions: this.onCustomizeStoreLoadOptionsSpy,
                    key: "id"
                }),
                onItemDeleting: this.onItemDeletingSpy
            });
            this.store = this.instance.getDataSource().store();
        }
    }, function() {
        QUnit.test("check load next page", function(assert) {
            assert.equal(this.items().length, 2);
            this.instance.loadNextPage();
            assert.equal(this.items()[2], this.data[2]);
            assert.equal(this.items().length, 4);
        });

        QUnit.test("correct index after push insert", function(assert) {
            this.store.push([{ type: "insert", data: { id: 200, text: "text " + 200, index: 0 }, index: 0 }]);
            this.instance.loadNextPage();
            assert.equal(this.items().length, 5);
            assert.equal(this.items()[0].id, 200);
            assert.equal(this.items()[4].id, 4);
        });

        QUnit.test("correct index after push 'remove'", function(assert) {
            this.store.push([{ type: "remove", key: 0 }]);
            this.instance.loadNextPage();
            assert.equal(this.items().length, 3);
            assert.equal(this.items()[0].id, 1);
            assert.equal(this.items()[2].id, 3);
        });

        QUnit.test("fire deleting event after push 'remove'", function(assert) {
            assert.equal(this.onItemDeletingSpy.callCount, 0);
            this.store.push([{ type: "remove", key: 0 }]);
            assert.equal(this.onItemDeletingSpy.callCount, 1);
        });

        QUnit.test("refresh correct index after reload", function(assert) {
            this.store.push([{ type: "insert", data: { id: 200, text: "text " + 200, index: 0 }, index: 0 }]);
            assert.equal(this.items().length, 3);
            this.instance.reload();
            assert.equal(this.items()[0].id, 200);
            assert.equal(this.items()[1].id, 0);
            assert.equal(this.items().length, 2);
            assert.equal(this.instance.itemElements().length, 2);
        });

        QUnit.test("item is pushed to the end of store's array", function(assert) {
            this.store.push([{ type: "insert", data: { id: 200, text: "text " + 200, index: 0 }, index: 0 }]);
            assert.equal(this.data.pop().id, 200);
        });
    });
};
