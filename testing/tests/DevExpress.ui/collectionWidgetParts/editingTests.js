"use strict";

var $ = require("jquery"),
    CollectionWidget = require("ui/collection/ui.collection_widget.edit"),
    DataSource = require("data/data_source/data_source").DataSource,
    ArrayStore = require("data/array_store"),
    CustomStore = require("data/custom_store"),

    executeAsyncMock = require("../../../helpers/executeAsyncMock.js");

var ITEM_CLASS = "item",
    ITEM_SELECTED_CLASS = "dx-item-selected",
    ITEM_RESPONSE_WAIT_CLASS = "dx-item-response-wait";

var TestComponent = CollectionWidget.inherit({

    NAME: "TestComponent",

    _activeStateUnit: ".item",

    _itemClass: function() {
        return "item";
    },

    _itemDataKey: function() {
        return "123";
    },

    _itemContainer: function() {
        return this.element();
    }

});

var runTests = function() {

    QUnit.module("selecting of items", {
        beforeEach: function() {
            this.items = [{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }, { a: 7 }, { a: 8 }];
            this.$element = $("#cmp");
            this.instance = new TestComponent(this.$element, {
                items: this.items,
                selectionMode: "multiple"
            });
        }
    });

    QUnit.test("selectItem by node should add class to element", function(assert) {
        var $item = this.instance.itemElements().eq(0);

        this.instance.selectItem($item);

        assert.ok($item.hasClass(ITEM_SELECTED_CLASS), "class added");
    });

    QUnit.test("selectItem by index should add class to element", function(assert) {
        var $item = this.instance.itemElements().eq(0);

        this.instance.selectItem(0);

        assert.ok($item.hasClass(ITEM_SELECTED_CLASS), "class added");
    });

    QUnit.test("selectItem by itemData should add class to element", function(assert) {
        var $item = this.instance.itemElements().eq(0);

        this.instance.selectItem(this.items[0]);

        assert.ok($item.hasClass(ITEM_SELECTED_CLASS), "class added");
    });

    QUnit.test("selectItem by itemData should not fail if itemData is a string with special chars", function(assert) {
        var items = ["one.", "two.", "three.", "four."];
        this.instance.option("items", items);

        try {
            this.instance.selectItem(items[2]);

            var $item = this.instance.itemElements().eq(2);
            assert.ok($item.hasClass(ITEM_SELECTED_CLASS), "class added");
        } catch(error) {
            assert.ok(false, "no error was thrown");
        }
    });

    QUnit.test("Items should not be unwrapped if plain edit strategy is used", function(assert) {
        var items = [{ text: "Item 1", items: [1] }, { text: "Item 2", items: [2] }];
        this.instance.option({
            "items": items,
            selectedIndex: 0
        });

        var $item = this.instance.itemElements().eq(0);
        assert.ok($item.hasClass(ITEM_SELECTED_CLASS), "item was selected");
    });

    QUnit.test("selectItem should add item to selectedItems", function(assert) {
        var selection = [1, 5, 0, 6, 8],
            $items = this.instance.itemElements(),
            that = this;

        var selectItem = function(index) {
            that.instance.selectItem($items.eq(index));
        };

        $.each(selection, function(index, value) {
            selectItem(value);
        });

        var selected = this.instance.option("selectedItems");

        assert.equal(selected.length, selection.length, "selection must have same length with selected");

        $.each(selection, function(index, value) {
            assert.notEqual($.inArray(that.items[value], selected), -1, that.items[value] + " must be present in selected");
        });
    });

    QUnit.test("selectItem should not process item which is not presented", function(assert) {
        this.instance.selectItem($("<div>"));
        assert.equal(this.instance.option("selectedItems").length, 0, "selection must be empty");
    });

    QUnit.test("selectItem should not process already selected item", function(assert) {
        this.instance.selectItem(0);
        this.instance.selectItem(0);
        assert.equal(this.instance.option("selectedItems").length, 1, "selection must contain only one item");
    });

    QUnit.test("unselectItem by node should remove class from element", function(assert) {
        var $item = this.instance.itemElements().eq(0);

        this.instance.selectItem($item);
        this.instance.unselectItem($item);

        assert.ok(!$item.hasClass(ITEM_SELECTED_CLASS), "class removed");
    });

    QUnit.test("unselectItem by index should remove class from element", function(assert) {
        var $item = this.instance.itemElements().eq(0);

        this.instance.selectItem(0);
        this.instance.unselectItem(0);

        assert.ok(!$item.hasClass(ITEM_SELECTED_CLASS), "class removed");
    });

    QUnit.test("unselectItem by itemData should remove class from element", function(assert) {
        var $item = this.instance.itemElements().eq(0);

        this.instance.selectItem(0);
        this.instance.unselectItem(this.items[0]);

        assert.ok(!$item.hasClass(ITEM_SELECTED_CLASS), "class removed");
    });

    QUnit.test("unselectItem should remove item from selectedItems", function(assert) {
        var twiceClicking = [1, 5, 0, 6, 8],
            $items = this.instance.itemElements(),
            that = this;

        var selectItem = function(index) {
            that.instance.selectItem($items.eq(index));
        };
        var unselectItem = function(index) {
            that.instance.unselectItem($items.eq(index));
        };

        $.each(twiceClicking, function(index, value) {
            selectItem(value);
            unselectItem(value);
        });

        assert.equal(this.instance.option("selectedItems").length, 0, "should not be selected elements");
    });

    QUnit.test("unselectItem should not process item which is not presented", function(assert) {
        this.instance.option("selectedItems", [this.items[0]]);

        this.instance.unselectItem($("<div>"));
        assert.equal(this.instance.option("selectedItems").length, 1, "selection must contain only one item");
    });

    QUnit.test("unselectItem should not process already selected item", function(assert) {
        this.instance.option("selectedItems", [this.items[0]]);

        this.instance.unselectItem(1);
        assert.equal(this.instance.option("selectedItems").length, 1, "selection must contain only one item");
    });

    QUnit.test("isItemSelected by node should reflect current item state", function(assert) {
        var $items = this.instance.itemElements();

        this.instance.selectItem($items.eq(0));
        assert.equal(this.instance.isItemSelected($items.eq(0)), true, "isItemSelected return proper state");

        this.instance.unselectItem($items.eq(0));
        assert.equal(this.instance.isItemSelected($items.eq(0)), false, "isItemSelected return proper state");
    });

    QUnit.test("isItemSelected by index should reflect current item state", function(assert) {
        this.instance.selectItem(0);
        assert.equal(this.instance.isItemSelected(0), true, "isItemSelected return proper state");

        this.instance.unselectItem(0);
        assert.equal(this.instance.isItemSelected(0), false, "isItemSelected return proper state");
    });

    QUnit.test("selection should be same when list refresh", function(assert) {
        var selection = [1, 5, 0, 6, 8],
            $items = this.instance.itemElements(),
            that = this;

        var selectItem = function(index) {
            that.instance.selectItem($items.eq(index));
        };

        $.each(selection, function(index, value) {
            selectItem(value);
        });

        this.instance._refresh();

        var selected = this.instance.option("selectedItems");

        assert.equal(selected.length, selection.length, "items in _selectedItems is presented");
        assert.equal(this.$element.find("." + ITEM_SELECTED_CLASS).length, selection.length, "selected elements is presented");

        $items = this.instance.itemElements();
        $.each(selection, function(index, value) {
            assert.ok($items.eq(value).hasClass(ITEM_SELECTED_CLASS), that.items[value] + " must have selected class");
            assert.notEqual($.inArray(that.items[value], selected), -1, that.items[value] + " must be present in selectedItems");
        });
    });

    QUnit.test("selection shouldn be correct after item property was changed", function(assert) {
        var items = [{ a: 0, disabled: true }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                selectionMode: "multiple",
                items: items,
                selectedIndex: 0
            });

        instance.option("items[0].disabled", false);
        instance.option("selectedIndex", 1);

        assert.equal($element.find("." + ITEM_SELECTED_CLASS).length, 1, "only one item is selected");
    });

    QUnit.test("deleteItem should change selected items", function(assert) {

        var that = this;

        var item = function(index) {
            return that.instance.itemElements().eq(index);
        };

        this.instance.selectItem(item(0));
        this.instance.selectItem(item(1));
        this.instance.selectItem(item(2));
        this.instance.deleteItem(item(1));

        assert.deepEqual(this.instance.option("selectedItems"), [{ a: 0 }, { a: 2 }], "item not deleted");
    });

    QUnit.test("onItemSelect should not be fired on widget rendering", function(assert) {
        assert.expect(0);

        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp");

        new TestComponent($element, {
            items: items,
            selectedItems: items,
            onItemSelect: function() {
                assert.ok(false, "select action triggered");
            },
            selectionMode: "multiple"
        });
    });

    QUnit.test("onSelectionChanged should be fired if selection changed", function(assert) {

        this.instance.option("onSelectionChanged", function(args) {
            assert.ok(true, "select action triggered");
        });

        this.instance.option("selectedItems", [this.items[0]]);
    });

    QUnit.test("onSelectionChanged should not be fired if selection not changed", function(assert) {
        assert.expect(0);

        this.instance.option("onSelectionChanged", function(args) {
            assert.ok(false, "select action triggered");
        });

        this.instance.option("selectedItems", []);
    });

    QUnit.test("onSelectionChanged should be fired with correct added items", function(assert) {
        var that = this;

        this.instance.option({
            selectedItems: [this.items[1]],
            onSelectionChanged: function(args) {
                assert.deepEqual(args.addedItems, [that.items[0]], "correct added items specified");
            }
        });

        this.instance.option("selectedItems", [this.items[0]]);
    });

    QUnit.test("onSelectionChanged should be fired with correct added and removed items when keyExpr or DataSource Store key is specified", function(assert) {
        var items = [{ id: 1, text: "Item 1" }, { id: 2, text: "Item 2" }],
            $element = $("<div>"),
            selectionChangedHandler = sinon.spy(),
            instance = new TestComponent($element, {
                dataSource: new DataSource({
                    store: new ArrayStore({
                        key: "id",
                        data: items
                    })
                }),
                selectedItemKeys: [2],
                onSelectionChanged: selectionChangedHandler
            });

        instance.option("selectedItemKeys", [1]);

        assert.equal(selectionChangedHandler.callCount, 1, "selectionChanged was fired once");
        assert.deepEqual(selectionChangedHandler.getCall(0).args[0].addedItems, [items[0]], "first item should be selected");
        assert.deepEqual(selectionChangedHandler.getCall(0).args[0].removedItems, [items[1]], "second item should be deselected");
    });

    QUnit.test("onSelectionChanged should be fired with correct removed items", function(assert) {
        var that = this;

        this.instance.option({
            selectedItems: [this.items[0], this.items[1]],
            onSelectionChanged: function(args) {
                assert.deepEqual(args.removedItems, [that.items[0]], "correct added items specified");
            },
        });

        this.instance.option("selectedItems", [this.items[1]]);
    });

    QUnit.test("onSelectionChanged should be fired if widget disabled", function(assert) {

        this.instance.option({
            selectedItems: [this.items[0], this.items[1]],
            disabled: true,
            onSelectionChanged: function(args) {
                assert.ok(true, "select action triggered");
            }
        });

        this.instance.option("selectedItems", []);
    });

    QUnit.test("changing selection should work inside onSelectionChanged handler", function(assert) {
        var that = this;

        this.instance.option({
            selectedItems: [this.items[0], this.items[1]],
            disabled: true,
            onSelectionChanged: function(args) {
                if(that.instance.option("selectedItems").length === 1) {
                    that.instance.option("selectedItems", []);
                }
            }
        });

        this.instance.option("selectedItems", [this.items[0]]);
        assert.ok(!this.instance.isItemSelected(0), "selection changed");
    });

    QUnit.test("selection should not be applied if selection mode is none", function(assert) {
        this.instance.option({
            selectedIndex: 0,
            selectionMode: "none"
        });

        this.instance.option("selectedItems", [this.items[1]]);
        this.instance.option("selectedIndex", 2);
        this.instance.option("selectedItemKeys", { a: 3 });
        this.instance.selectItem(this.items[4]);

        assert.equal(this.instance.itemElements().filter(".dx-item-selected").length, 0, "there are no items selected");
    });

    QUnit.test("select unexisting item by selectedItems option should restore previous selection", function(assert) {
        this.instance.option({
            selectionRequired: true,
            selectionMode: "single",
            selectedIndex: 2
        });

        this.instance.option("selectedItems", [{ text: "UnExisting item" }]);

        assert.deepEqual(this.instance.option("selectedItems"), [this.items[2]], "selectedItems is correct");
        assert.deepEqual(this.instance.option("selectedItem"), this.items[2], "selectedItem is correct");
        assert.equal(this.instance.option("selectedIndex"), 2, "selectedIndex is correct");
        assert.deepEqual(this.instance.option("selectedItemKeys"), [this.items[2]], "selectedItemKeys is correct");
        assert.ok(this.instance.itemElements().eq(2).hasClass("dx-item-selected"), "selected item class is on the correct item");
    });

    QUnit.test("select unexisting item by selectedItem option should restore previous selection", function(assert) {
        this.instance.option({
            selectionRequired: true,
            selectionMode: "single",
            selectedIndex: 2
        });

        this.instance.option("selectedItem", { text: "UnExisting item" });

        assert.deepEqual(this.instance.option("selectedItems"), [this.items[2]], "selectedItems is correct");
        assert.deepEqual(this.instance.option("selectedItem"), this.items[2], "selectedItem is correct");
        assert.equal(this.instance.option("selectedIndex"), 2, "selectedIndex is correct");
        assert.deepEqual(this.instance.option("selectedItemKeys"), [this.items[2]], "selectedItemKeys is correct");
        assert.ok(this.instance.itemElements().eq(2).hasClass("dx-item-selected"), "selected item class is on the correct item");
    });

    QUnit.test("select unexisting item by selectedIndex option should restore previous selection", function(assert) {
        this.instance.option({
            selectionRequired: true,
            selectionMode: "single",
            selectedIndex: 2
        });

        this.instance.option("selectedIndex", -10);

        assert.deepEqual(this.instance.option("selectedItems"), [this.items[2]], "selectedItems is correct");
        assert.deepEqual(this.instance.option("selectedItem"), this.items[2], "selectedItem is correct");
        assert.equal(this.instance.option("selectedIndex"), 2, "selectedIndex is correct");
        assert.deepEqual(this.instance.option("selectedItemKeys"), [this.items[2]], "selectedItemKeys is correct");
        assert.ok(this.instance.itemElements().eq(2).hasClass("dx-item-selected"), "selected item class is on the correct item");
    });

    QUnit.test("select unexisting item by selectedItemKeys option should restore previous selection", function(assert) {
        this.instance.option({
            selectionRequired: true,
            selectionMode: "single",
            selectedIndex: 2
        });

        this.instance.option("selectedItemKeys", [{ text: "UnExisting item key" }]);

        assert.deepEqual(this.instance.option("selectedItems"), [this.items[2]], "selectedItems is correct");
        assert.deepEqual(this.instance.option("selectedItem"), this.items[2], "selectedItem is correct");
        assert.equal(this.instance.option("selectedIndex"), 2, "selectedIndex is correct");
        assert.deepEqual(this.instance.option("selectedItemKeys"), [this.items[2]], "selectedItemKeys is correct");
        assert.ok(this.instance.itemElements().eq(2).hasClass("dx-item-selected"), "selected item class is on the correct item");
    });

    QUnit.test("select unexisting item by selectItem method should restore previous selection", function(assert) {
        this.instance.option({
            selectionRequired: true,
            selectionMode: "single",
            selectedIndex: 2
        });

        this.instance.selectItem({ text: "UnExisting item" });

        assert.deepEqual(this.instance.option("selectedItems"), [this.items[2]], "selectedItems is correct");
        assert.deepEqual(this.instance.option("selectedItem"), this.items[2], "selectedItem is correct");
        assert.equal(this.instance.option("selectedIndex"), 2, "selectedIndex is correct");
        assert.deepEqual(this.instance.option("selectedItemKeys"), [this.items[2]], "selectedItemKeys is correct");
        assert.ok(this.instance.itemElements().eq(2).hasClass("dx-item-selected"), "selected item class is on the correct item");
    });

    QUnit.test("select should work when items are not equal by the link and store key is specified", function(assert) {
        var clock = sinon.useFakeTimers();

        try {
            var instance = new TestComponent($("<div>"), {
                selectionMode: "multiple",
                dataSource: {
                    load: function(options) {
                        var d = $.Deferred(),
                            items = [
                                { id: 1, text: "Item 1" },
                                { id: 2, text: "Item 2" }
                            ];

                        setTimeout(function() {
                            if(options.filter) {
                                d.resolve([{ id: 2, text: "Item 2" }]);
                            } else {
                                d.resolve(items);
                            }
                        }, 0);

                        return d.promise();
                    },
                    key: "id"
                },
                selectedItem: { id: 2, text: "Detached item 2" }
            });

            clock.tick();

            assert.equal(instance.option("selectedItem").text, "Item 2", "selectedItem is correct");
            assert.equal(instance.option("selectedIndex"), 1, "selectedIndex is correct");
            assert.deepEqual(instance.option("selectedItemKeys"), [2], "selectedItemKeys is correct");
            assert.equal(instance.option("selectedItems")[0].text, "Item 2", "selectedItems is correct");
            assert.ok(instance.itemElements().eq(1).hasClass("dx-item-selected"), "selected item class is on the correct item");
        } finally {
            clock.restore();
        }
    });

    QUnit.test("selection should work with custom store without filter implementation", function(assert) {
        var clock = sinon.useFakeTimers();

        try {
            var instance = new TestComponent($("<div>"), {
                selectionMode: "multiple",
                dataSource: {
                    load: function() {
                        var d = $.Deferred(),
                            items = [
                                { id: 1, text: "Item 1" },
                                { id: 2, text: "Item 2" }
                            ];

                        setTimeout(function() {
                            d.resolve(items);
                        }, 0);

                        return d.promise();
                    },
                    key: "id"
                },
                selectedItem: { id: 2, text: "Detached item 2" }
            });

            clock.tick();

            assert.equal(instance.option("selectedItem").text, "Item 2", "selectedItem is correct");
            assert.equal(instance.option("selectedIndex"), 1, "selectedIndex is correct");
            assert.deepEqual(instance.option("selectedItemKeys"), [2], "selectedItemKeys is correct");
            assert.equal(instance.option("selectedItems")[0].text, "Item 2", "selectedItems is correct");
            assert.ok(instance.itemElements().eq(1).hasClass("dx-item-selected"), "selected item class is on the correct item");
        } finally {
            clock.restore();
        }
    });


    QUnit.module("selecting of item keys", {
        beforeEach: function() {
            var items = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }];
            this.items = items;
            this.$element = $("#cmp");
            this.instance = new TestComponent(this.$element, {
                dataSource: new DataSource({
                    store: new ArrayStore({
                        key: "id",
                        data: items
                    })
                }),
                selectionMode: "multiple"
            });
        }
    });

    QUnit.test("selecting options should be synchronized when selectedItemKeys is set ", function(assert) {
        this.instance.option("selectedItemKeys", [1, 2]);

        assert.deepEqual(this.instance.option("selectedItems"), [ { id: 1 }, { id: 2 }], "selectedItems is correct");
        assert.deepEqual(this.instance.option("selectedItem"), { id: 1 }, "selectedItem is correct");
        assert.equal(this.instance.option("selectedIndex"), 1, "selectedIndex is correct");
        assert.ok(this.$element.find("." + ITEM_CLASS).eq(1).hasClass("dx-item-selected"), "first item has selected class");
    });

    QUnit.test("selecting options should be synchronized when selectedItemKeys is set with complex keys", function(assert) {
        var items = [
            { id: 1, key: "key1", text: "Item 1" },
            { id: 2, key: "key2", text: "Item 2" },
            { id: 3, key: "key3", text: "Item 3" }
        ];

        var instance = new TestComponent(this.$element, {
            dataSource: new DataSource({
                store: new ArrayStore({
                    key: ["id", "key"],
                    data: items
                })
            }),
            selectionMode: "multiple"
        });

        var $item = this.$element.find("." + ITEM_CLASS).eq(1);

        instance.option("selectedItems", [{ id: 2, key: "key2", text: "Item 2" }]);

        assert.deepEqual(instance.option("selectedItemKeys"), [{ id: items[1].id, key: items[1].key }], "selectedItems is correct");
        assert.deepEqual(instance.option("selectedItem"), items[1], "selectedItem is correct");
        assert.equal(instance.option("selectedIndex"), 1, "selectedIndex is correct");
        assert.ok($item.hasClass("dx-item-selected"), "item has selected class");
    });


    QUnit.module("selecting of item keys", {
        beforeEach: function() {
            this.$element = $("#cmp");
        }
    });

    QUnit.test("selectedItemKeys should work when it is set on initialization", function(assert) {
        var items = [
            { id: 1, key: "key1", text: "Item 1" },
            { id: 2, key: "key2", text: "Item 2" },
            { id: 3, key: "key3", text: "Item 3" }
        ];

        var instance = new TestComponent(this.$element, {
            items: items,
            keyExpr: "id",
            selectionMode: "multiple",
            selectedItemKeys: [2]
        });

        var $item = this.$element.find("." + ITEM_CLASS).eq(1);

        assert.deepEqual(instance.option("selectedItems"), [items[1]], "selectedItems is correct");
        assert.deepEqual(instance.option("selectedItem"), items[1], "selectedItem is correct");
        assert.equal(instance.option("selectedIndex"), 1, "selectedIndex is correct");
        assert.ok($item.hasClass("dx-item-selected"), "item has selected class");
    });

    QUnit.test("using keyExpr as primitive", function(assert) {
        var items = [
            { key: "key1", text: "Item 1" },
            { key: "key2", text: "Item 2" },
            { key: "key3", text: "Item 3" }
            ],
            instance = new TestComponent(this.$element, {
                items: items,
                keyExpr: "key",
                selectionMode: "multiple"
            }),
            $item = this.$element.find("." + ITEM_CLASS).eq(1);

        instance.option("selectedItemKeys", ["key2"]);

        assert.deepEqual(instance.option("selectedItems"), [items[1]], "selectedItems is correct");
        assert.equal(instance.option("selectedIndex"), 1, "selectedIndex is correct");
        assert.deepEqual(instance.option("selectedItem"), items[1], "selectedItem is correct");
        assert.ok($item.hasClass("dx-item-selected"), "item has selected class");
    });

    QUnit.test("changing keyExpr by option", function(assert) {
        var items = [
                { key: "key1", text: "Item 1" },
                { key: "key2", text: "Item 2" },
                { key: "key3", text: "Item 3" }
            ],
            instance = new TestComponent(this.$element, {
                items: items,
                keyExpr: "text",
                selectionMode: "multiple"
            }),
            $item = this.$element.find("." + ITEM_CLASS).eq(1);

        instance.option("keyExpr", "key");
        instance.option("selectedItemKeys", ["key2"]);

        assert.deepEqual(instance.option("selectedItems"), [items[1]], "selectedItems is correct");
        assert.equal(instance.option("selectedIndex"), 1, "selectedIndex is correct");
        assert.deepEqual(instance.option("selectedItem"), items[1], "selectedItem is correct");
        assert.ok($item.hasClass("dx-item-selected"), "item has selected class");
    });

    QUnit.test("using keyExpr with dataSource", function(assert) {
        var items = [
                { key: "key1", text: "Item 1" },
                { key: "key2", text: "Item 2" },
                { key: "key3", text: "Item 3" }
            ],
            instance = new TestComponent(this.$element, {
                dataSource: new DataSource({
                    store: new ArrayStore({
                        key: "text",
                        data: items
                    })
                }),
                keyExpr: "key",
                selectionMode: "multiple"
            }),
            $item = this.$element.find("." + ITEM_CLASS).eq(1);

        instance.option("keyExpr", "key");
        instance.option("selectedItemKeys", ["key2"]);

        assert.deepEqual(instance.option("selectedItems"), [items[1]], "selectedItems is correct");
        assert.equal(instance.option("selectedIndex"), 1, "selectedIndex is correct");
        assert.deepEqual(instance.option("selectedItem"), items[1], "selectedItem is correct");
        assert.ok($item.hasClass("dx-item-selected"), "item has selected class");
    });


    QUnit.module("selecting of items with datasource");

    QUnit.test("added and removed selection should be correct", function(assert) {
        var items = [1, 2, 3, 4, 5];
        var ds = new DataSource({
            store: items,
            pageSize: 2,
            paginate: true
        });

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                dataSource: ds,
                selectedItems: items.slice(),
                selectionMode: "multiple",
                onSelectionChanged: function(args) {
                    assert.ok(args.addedItems.length <= 1, "unloaded items does not present in selection");
                    assert.ok(args.removedItems.length <= 1, "unloaded items does not present in selection");
                }
            });

        instance.unselectItem(0);
        instance.selectItem(0);
    });

    QUnit.test("dynamically loaded items should be selected", function(assert) {
        var items = [1, 2, 3, 4];
        var ds = new DataSource({
            store: items,
            pageSize: 2,
            paginate: true
        });

        var $element = $("#cmp");

        new TestComponent($element, {
            dataSource: ds,
            selectedItems: items.slice(0, 3),
            selectionMode: "multiple",
            onItemRendered: function(args) {
                var isSelected = $.inArray(args.itemData, args.component.option("selectedItems")) > -1;
                assert.equal(args.itemElement.hasClass(ITEM_SELECTED_CLASS), isSelected, "item selection is correct");
            }
        });

        ds.pageIndex(1 + ds.pageIndex());
        ds.load();
    });

    QUnit.test("selectItem should not remove not loaded items", function(assert) {
        var items = [1, 2, 3, 4, 5];
        var ds = new DataSource({
            store: items,
            pageSize: 2,
            paginate: true
        });

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                dataSource: ds,
                selectedItems: items.slice(1),
                selectionMode: "multiple"
            });

        instance.selectItem(0);
        assert.deepEqual(instance.option("selectedItems"), items, "selected items is correct");
    });

    QUnit.test("it should not be possible to select multiple items in 'single' selection mode (T386482)", function(assert) {
        var items = [1, 3];
        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                selectionMode: "single",
                dataSource: items,
                selectedItem: ""
            });

        instance.selectItem($element.find('.' + ITEM_CLASS).eq(0));
        assert.equal(instance.option("selectedItems").length, 1, "only one item is selected");
    });

    QUnit.test("unselectItem should remove only unselected item", function(assert) {
        var items = [1, 2, 3, 4, 5];
        var ds = new DataSource({
            store: items,
            pageSize: 2,
            paginate: true
        });

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                dataSource: ds,
                selectedItems: items.slice(),
                selectionMode: "multiple"
            });

        instance.unselectItem(0);
        assert.deepEqual(instance.option("selectedItems"), items.slice().splice(1, 4), "selected items is correct");
    });

    QUnit.test("selectedIndex after initialization test", function(assert) {
        var clock;
        try {
            clock = sinon.useFakeTimers();

            var ds = new CustomStore({
                load: function() {
                    var deferred = $.Deferred();

                    setTimeout(function() {
                        deferred.resolve([1, 2, 3, 4, 5]);
                    }, 3000);

                    return deferred.promise();
                }
            });

            var $element = $("#cmp"),
                instance = new TestComponent($element, {
                    dataSource: ds,
                    selectedIndex: 2,
                    selectionMode: "single"
                });

            clock.tick(4000);

            assert.equal(instance.option("selectedIndex"), 2, "selected index is correct");
        } finally {
            clock.restore();
        }
    });

    QUnit.test("selection should be applied with deferred dataSource if selectedItemKeys has value on init", function(assert) {
        var clock;

        try {
            clock = sinon.useFakeTimers();

            var instance = new TestComponent($("#cmp"), {
                dataSource: {
                    key: "id",
                    load: function() {
                        var deferred = $.Deferred();

                        setTimeout(function() {
                            deferred.resolve([{ id: 1, text: "Item 1" }]);
                        }, 100);

                        return deferred.promise();
                    }
                },
                selectedItemKeys: [1],
                selectionMode: "all"
            });

            clock.tick(100);

            assert.equal(instance.option("selectedIndex"), 0, "selectedIndex is correct");
        } finally {
            clock.restore();
        }
    });


    QUnit.module("selecting of items in single mode");

    QUnit.test("selectedItem should select only one item", function(assert) {
        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items,
                selectionMode: 'single'
            });

        var item = function(index) {
            return instance.itemElements().eq(index);
        };

        instance.selectItem(item(0));
        instance.selectItem(item(1));

        assert.deepEqual(instance.option("selectedItems"), [{ a: 1 }], "selected only one item");
    });

    QUnit.test("selectedItems should accept only one item", function(assert) {
        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items,
                selectedItems: items,
                selectionMode: 'single'
            });

        assert.deepEqual(instance.option("selectedItems"), [{ a: 0 }], "selected only one item");

        instance.option("selectedItems", items);
        assert.deepEqual(instance.option("selectedItems"), [{ a: 0 }], "selected only one item");
    });

    QUnit.test("onSelectionChanged should not be fired on widget rendering after adjusting selected items", function(assert) {
        assert.expect(0);

        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp");

        new TestComponent($element, {
            items: items,
            selectedItems: items,
            selectionMode: 'single',
            onSelectionChanged: function() {
                assert.ok(false, "select action triggered");
            }
        });
    });

    QUnit.test("onSelectionChanged should be fired on widget rendering after adjusting selected items", function(assert) {
        assert.expect(0);

        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp");

        new TestComponent($element, {
            items: items,
            selectedItems: items,
            selectionMode: 'single',
            onSelectionChanged: function() {
                assert.ok(false, "unselect action triggered");
            }
        });
    });

    QUnit.test("selectedItem is set on init", function(assert) {
        var $element = $("#cmp"),
            items = [1, 2, 3],
            instance = new TestComponent($element, {
                selectionMode: "single",
                items: items,
                selectedItem: items[2]
            });

        assert.equal(instance.option("selectedIndex"), 2, "selectedIndex option value is correct");
        assert.deepEqual(instance.option("selectedItems"), [items[2]], "selectedItems option value is correct");
    });

    QUnit.test("selectedIndex is set on init", function(assert) {
        var $element = $("#cmp"),
            items = [1, 2, 3],
            instance = new TestComponent($element, {
                selectionMode: "single",
                items: items,
                selectedIndex: 2
            });

        assert.equal(instance.option("selectedItem"), items[2], "selectedItem option value is correct");
        assert.deepEqual(instance.option("selectedItems"), [items[2]], "selectedItems option value is correct");
    });

    QUnit.test("selectedItem and selectedIndex options should depend on each other", function(assert) {
        var $element = $("#cmp"),
            items = [1, 2, 3],
            instance = new TestComponent($element, {
                selectionMode: "single",
                items: items
            });

        assert.equal(instance.option("selectedItem"), null, "selectedItem is null on init");

        instance.option("selectedIndex", 2);
        assert.deepEqual(instance.option("selectedItem"), items[2], "selectedItem option value is correct after selectedIndex change");

        instance.option("selectedItem", items[1]);
        assert.equal(instance.option("selectedIndex"), 1, "selectedIndex option value is correct after selectedItem change");
    });

    QUnit.test("selectedItem and selectedItems options should depend on each other", function(assert) {
        var $element = $("#cmp"),
            items = [1, 2, 3],
            instance = new TestComponent($element, {
                selectionMode: "single",
                items: items
            });

        instance.option("selectedItem", items[0]);
        assert.deepEqual(instance.option("selectedItems"), [items[0]], "selectedItems option value is correct after selectedItem change");

        instance.option("selectedItems", [items[1]]);
        assert.equal(instance.option("selectedItem"), items[1], "selectedItem option value is correct after selectedItems change");
    });

    QUnit.test("selection change should not block other options change", function(assert) {
        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                selectionMode: "single",
                items: [1, 2],
                selectedIndex: 0
            });

        instance.option("onOptionChanged", function(args) {
            if(args.name === "selectedItem") {
                instance.option("items", [2, 3]);
            }
        });
        instance.option("selectedIndex", 1);
        assert.equal($element.text(), "23", "items changed correctly");
    });


    QUnit.module("selecting of items in multiple mode", {
        beforeEach: function() {
            this.TestComponent = TestComponent.inherit({
                _getDefaultOptions: function() {
                    return $.extend(this.callBase(), {
                        selectedIndex: 0
                    });
                }
            });
        }
    });

    QUnit.test("selectedItems should have precedence over selectedIndex if initialized with empty collection", function(assert) {
        var $element = $("#cmp"),
            instance = new this.TestComponent($element, {
                selectionMode: "multiple",
                items: [1, 2, 3],
                selectedItems: []
            });

        assert.deepEqual(instance.option("selectedItems"), [], "selectedItems option value is correct after selectedItem change");
    });

    QUnit.test("selectedItemKeys should have precedence over selectedIndex if initialized with empty collection", function(assert) {
        var $element = $("#cmp"),
            instance = new this.TestComponent($element, {
                selectionMode: "multiple",
                items: [1, 2, 3],
                selectedItemKeys: []
            });

        assert.deepEqual(instance.option("selectedItemKeys"), [], "selectedItems option value is correct after selectedItem change");
    });


    QUnit.module("selection mode");

    QUnit.test("selection mode option none", function(assert) {
        assert.expect(1);

        var $element = $("#cmp");

        new TestComponent($element, {
            selectedIndex: 1,
            items: [0, 1, 2, 3, 4],
            selectionMode: "none"
        });

        var $items = $element.find(".item"),
            $item = $items.eq(1);

        assert.ok(!$item.hasClass("dx-item-selected"), "selected class was not attached");
    });

    QUnit.test("selection mode option single", function(assert) {
        assert.expect(3);

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                selectedIndex: 1,
                items: [0, 1, 2, 3, 4],
                selectionMode: "single"
            }),
            $items = $element.find(".item"),
            $item = $items.eq(1);

        assert.ok($item.hasClass("dx-item-selected"), "selected class was attached");

        instance.option("selectedIndex", 0);

        assert.ok(!$item.hasClass("dx-item-selected"), "selected class was removed");

        assert.ok($items.first().hasClass("dx-item-selected"), "selected class was attached");
    });


    QUnit.module("selection mode changing");

    QUnit.test("selectedItems should be updated with one item", function(assert) {
        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items,
                selectedItems: items,
                selectionMode: 'multiple'
            });

        instance.option("selectionMode", 'single');
        assert.deepEqual(instance.option("selectedItems"), [{ a: 0 }], "selected only one item");
    });

    QUnit.test("onItemSelect should not be fired", function(assert) {
        assert.expect(0);

        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items,
                selectedItems: items,
                selectionMode: 'multiple',
                onItemSelect: function() {
                    assert.ok(false, "select action triggered");
                }
            });

        instance.option("selectionMode", 'single');
    });

    QUnit.test("onSelectionChanged should be fired", function(assert) {
        assert.expect(3);

        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items,
                selectedItems: items,
                selectionMode: 'multiple',
                onSelectionChanged: function(e) {
                    assert.ok(true, "unselect action triggered");
                    assert.deepEqual(e.removedItems, [items[1]], "one removed item");
                    assert.deepEqual(e.addedItems, [], "no added items");
                }
            });

        instance.option("selectionMode", 'single');
    });


    QUnit.module("selection required");

    QUnit.test("first item should be selected if selection required", function(assert) {
        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items,
                selectedIndex: -1,
                selectionMode: 'single',
                selectionRequired: true
            });

        assert.equal(instance.option("selectedIndex"), 0, "selection present");
    });

    QUnit.test("selection should not be dropped if selection removed", function(assert) {
        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items,
                selectedIndex: 1,
                selectionMode: 'single',
                selectionRequired: true
            });

        instance.option("selectedIndex", -1);
        assert.equal(instance.option("selectedIndex"), 1, "previous selection present");
    });

    QUnit.test("at least one item should be selected if 'selectionRequired' option changed to 'true'", function(assert) {
        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items,
                selectedIndex: -1,
                selectionMode: 'single',
                selectionRequired: false
            });

        assert.equal(instance.option("selectedItems").length, 0, "no items are selected on init");

        instance.option("selectionRequired", true);
        assert.equal(instance.option("selectedItems").length, 1, "one item is selected");
    });


    QUnit.module("deleting of items");

    QUnit.test("deleteItem should remove item by node", function(assert) {
        var items = [{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }, { a: 7 }, { a: 8 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items
            });

        instance.deleteItem(instance.itemElements().eq(2));

        assert.equal(instance.itemElements().length, 8, "item deleted");
        assert.equal(instance.option("items").length, 8, "item deleted from items");
    });

    QUnit.test("deleteItem should remove item by index", function(assert) {
        var items = [{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }, { a: 7 }, { a: 8 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items
            });

        instance.deleteItem(2);

        assert.equal(instance.itemElements().length, 8, "item deleted");
        assert.equal(instance.option("items").length, 8, "item deleted from items");
    });

    QUnit.test("deleteItem should be resolved", function(assert) {
        assert.expect(1);

        var items = [{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }, { a: 7 }, { a: 8 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items
            });

        instance.deleteItem(instance.itemElements().eq(2)).done(function() {
            assert.ok(true, "resolved");
        });
    });

    QUnit.test("deleteItem should trigger delete callback only once with correct itemData", function(assert) {
        var item = "0",
            deleteActionFlag = 0,
            deletedItem = null;

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: [item],
                onItemDeleted: function(e) {
                    deleteActionFlag++;
                    deletedItem = e.itemData;
                    assert.equal(e.itemIndex, 0, "correct index specified");
                }
            });

        instance.deleteItem(instance.itemElements().eq(0));

        assert.ok(deleteActionFlag > 0, "onItemDeleted triggered");
        assert.strictEqual(deleteActionFlag, 1, "onItemDeleted triggered 1 time");
        assert.strictEqual(item, deletedItem, "item equals selected item");
    });

    QUnit.test("deleteItem should not process item which is not presented", function(assert) {
        assert.expect(3);

        var items = [{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }, { a: 7 }, { a: 8 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items
            });

        instance.deleteItem($("<div>")).fail(function() {
            assert.ok(true, "rejected");
        });

        assert.equal(instance.itemElements().length, 9, "item not deleted");
        assert.equal(instance.option("items").length, 9, "item not deleted");
    });

    QUnit.test("deleteItem should not cause refresh", function(assert) {
        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items
            });

        var item = function(index) {
            return instance.itemElements().eq(index);
        };

        item(0).data("rendered", true);
        instance.deleteItem(item(1));

        assert.equal(item(0).data("rendered"), true, "item not deleted");
    });

    QUnit.test("deleteItem should trigger onOptionChanged action", function(assert) {
        assert.expect(2);

        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items
            });

        instance.option("onOptionChanged", function(args) {
            if(args.name !== "items") return;

            assert.equal(args.component, instance, "correct option value");
            assert.deepEqual(args.value, [items[0]], "correct option value");
        });
        instance.deleteItem(1);
    });

    QUnit.test("item should not be deleted if 'cancel' flag in onItemDeleting is true", function(assert) {
        var instance = new TestComponent($("#cmp"), {
            items: [0],
            onItemDeleting: function(e) {
                e.cancel = true;
            }
        });

        var $item = instance.itemElements().eq(0);
        instance.deleteItem($item);

        $item = instance.itemElements().eq(0);
        assert.equal($item.length, 1, "item not removed");
    });

    QUnit.test("item should not be deleted if 'cancel' flag in onItemDeleting is resolved with true", function(assert) {
        var instance = new TestComponent($("#cmp"), {
            items: [0],
            onItemDeleting: function(e) {
                e.cancel = $.Deferred().resolve(true);
            }
        });

        var $item = instance.itemElements().eq(0);
        instance.deleteItem($item);

        $item = instance.itemElements().eq(0);
        assert.equal($item.length, 1, "item not removed");
    });

    QUnit.test("item should be deleted if 'cancel' flag in onItemDeleting is resolved", function(assert) {
        var instance = new TestComponent($("#cmp"), {
            dataSource: [0],
            onItemDeleting: function(e) {
                e.cancel = $.Deferred().resolve();
            }
        });

        var $item = instance.itemElements().eq(0);
        instance.deleteItem($item);

        $item = instance.itemElements().eq(0);
        assert.equal($item.length, 0, "item removed");
    });


    QUnit.module("deleting with confirmation");

    QUnit.test("item should be deleted if confirmation resolved", function(assert) {
        var confirmation = $.Deferred(),
            itemDeleted = false;

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: ["0"],
                onItemDeleting: function(e) {
                    return confirmation.promise();
                },
                onItemDeleted: function() {
                    itemDeleted = true;
                }
            });

        instance.deleteItem(0);
        assert.equal(itemDeleted, false, "item not deleted");

        confirmation.resolve();
        assert.equal(itemDeleted, true, "item deleted");
    });

    QUnit.test("item should be deleted if confirmation resolved with true", function(assert) {
        var confirmation = $.Deferred(),
            itemDeleted = false;

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: ["0"],
                onItemDeleting: function(e) {
                    return confirmation.promise();
                },
                onItemDeleted: function() {
                    itemDeleted = true;
                }
            });

        instance.deleteItem(0);
        assert.equal(itemDeleted, false, "item not deleted");

        confirmation.resolve(true);
        assert.equal(itemDeleted, true, "item deleted");
    });

    QUnit.test("item should not be deleted if confirmation rejected", function(assert) {
        var confirmation = $.Deferred(),
            itemDeleted = false;

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: ["0"],
                onItemDeleting: function(e) {
                    return confirmation.promise();
                },
                onItemDeleted: function() {
                    itemDeleted = true;
                }
            });

        instance.deleteItem(0);
        assert.equal(itemDeleted, false, "item not deleted");

        confirmation.reject();
        assert.equal(itemDeleted, false, "item not deleted");
    });

    QUnit.test("item should not be deleted if confirmation resolved with false", function(assert) {
        var confirmation = $.Deferred(),
            itemDeleted = false;

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: ["0"],
                onItemDeleting: function(e) {
                    return confirmation.promise();
                },
                onItemDeleted: function() {
                    itemDeleted = true;
                }
            });

        instance.deleteItem(0);
        assert.equal(itemDeleted, false, "item not deleted");

        confirmation.resolve(false);
        assert.equal(itemDeleted, false, "item not deleted");
    });

    QUnit.test("deleteItem should be resolved if confirmation pass", function(assert) {
        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: ["0"],
                onItemDeleting: function(e) {
                    return $.Deferred().resolve().promise();
                }
            });

        instance.deleteItem(0).done(function() {
            assert.ok(true, "deleteItem resolved");
        });
    });

    QUnit.test("deleteItem should not be resolved if confirmation not pass", function(assert) {
        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: ["0"],
                onItemDeleting: function(e) {
                    return $.Deferred().reject().promise();
                }
            });

        instance.deleteItem(0).fail(function() {
            assert.ok(true, "deleteItem rejected");
        });
    });

    QUnit.test("deleteItem should delete item without confirmation if item is already deleting", function(assert) {
        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: ["0"],
                onItemDeleting: function(e) {
                    instance.deleteItem(0);
                },
                onItemDeleted: function() {
                    assert.ok(true, "item deleted");
                }
            });

        instance.deleteItem(0);
    });

    QUnit.test("deleteItem should not delete item without confirmation if previous confirmation fails", function(assert) {
        assert.expect(0);

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: ["0"],
                onItemDeleting: function(e) {
                    return $.Deferred().reject().promise();
                },
                onItemDeleted: function() {
                    assert.ok(false, "item deleted");
                }
            });

        instance.deleteItem(0);
        instance.deleteItem(0);
    });


    QUnit.module("deleting from dataSource", {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();
            executeAsyncMock.setup();
        },
        afterEach: function() {
            this.clock.restore();
            executeAsyncMock.teardown();
        }
    });

    QUnit.test("deleteItem should remove item", function(assert) {
        assert.expect(2);

        var store = new ArrayStore({
            data: [
                { id: 0, text: 0 },
                { id: 1, text: 1 },
                { id: 2, text: 2 }
            ],
            key: "id"
        });

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                dataSource: {
                    store: store
                }
            });

        instance.deleteItem(instance.itemElements().eq(1)).done(function() {
            assert.equal(instance.itemElements().length, 2, "item deleted");
            assert.equal(instance.option("items").length, 2, "item deleted from items");
        });
    });

    QUnit.test("deleteItem should not remove when error occurred", function(assert) {
        assert.expect(2);

        var store = new ArrayStore({
            data: [
                { text: 0 },
                { text: 1 },
                { text: 2 }
            ]
        });

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                dataSource: {
                    store: store
                }
            });

        store._removeImpl = function() {
            return $.Deferred().reject().promise();
        };

        instance.deleteItem(instance.itemElements().eq(1)).fail(function() {
            assert.equal(instance.itemElements().length, 3, "item not deleted");
            assert.equal(instance.option("items").length, 3, "item not deleted from items");
        });
    });

    QUnit.test("deleteItem should fade deleting item when deleting and disable widget", function(assert) {
        assert.expect(4);

        var deferred = $.Deferred();

        var store = new ArrayStore({
            data: [
                { text: 0 },
                { text: 1 },
                { text: 2 }
            ]
        });

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                dataSource: {
                    store: store
                }
            });

        store._removeImpl = function() {
            var d = $.Deferred();

            deferred.done(function() {
                d.reject();
            });

            return d.promise();
        };

        var $item = instance.itemElements().eq(1);

        instance.deleteItem($item).fail(function() {
            assert.equal($item.hasClass(ITEM_RESPONSE_WAIT_CLASS), false, "item not wait for response");
            assert.equal(instance.option("disabled"), false, "widget is not disabled");
        });

        assert.equal($item.hasClass(ITEM_RESPONSE_WAIT_CLASS), true, "item wait for response");
        assert.equal(instance.option("disabled"), true, "widget is disabled");

        deferred.resolve();
    });

    QUnit.test("only needed items should be rendered after delete", function(assert) {
        assert.expect(1);

        var dataSource = new DataSource({
            store: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            pageSize: 2
        });

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                dataSource: dataSource
            });

        instance.deleteItem(0);

        var $newItems = $("." + ITEM_CLASS, $element);
        assert.equal($newItems.text(), "12", "element was not removed");
    });

    QUnit.test("last item should not be duplicated after delete items", function(assert) {
        var dataSource = new DataSource({
            store: [0, 1, 2, 3]
        });

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                dataSource: dataSource
            });

        instance.deleteItem(0);
        var $newItems = $("." + ITEM_CLASS, $element);

        assert.equal($newItems.text(), "123");
    });

    QUnit.test("deleteItem should trigger delete callback only once with correct itemData even if items changed at runtime", function(assert) {
        var dataSource = new DataSource({
            store: new ArrayStore({
                data: [0],
                onRemoved: function() {
                    instance.option("dataSource", { store: [] });
                }
            })
        });

        var args;
        var instance = new TestComponent($("#cmp"), {
            dataSource: dataSource,
            onItemDeleted: function(e) {
                args = e;
            }
        });

        var $item = instance.itemElements().eq(0);
        instance.deleteItem($item);
        assert.strictEqual(args.itemElement.get(0), $item.get(0), "item equals selected item");
        assert.strictEqual(args.itemData, 0, "item equals selected item");
        assert.strictEqual(args.itemIndex, 0, "item equals selected item");
    });

    QUnit.test("deleteItem should trigger onOptionChanged action", function(assert) {
        assert.expect(2);

        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                dataSource: items
            });

        instance.option("onOptionChanged", function(args) {
            if(args.name !== "dataSource") return;

            assert.equal(args.component, instance, "correct option value");
            assert.deepEqual(args.value, [items[0]], "correct option value");
        });
        instance.deleteItem(1);
    });

    QUnit.test("deleteItem should not trigger onOptionChanged action if instance of DataSource", function(assert) {
        assert.expect(0);

        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                dataSource: new DataSource(items)
            });

        instance.option("onOptionChanged", function(args) {
            if(args.name !== "dataSource") return;

            assert.ok(false, "action fired");
        });
        instance.deleteItem(1);
    });


    QUnit.module("reordering of items");

    QUnit.test("reorderItem should swap items by index", function(assert) {
        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items
            });

        var item = function(index) {
            return instance.itemElements().eq(index).get(0);
        };

        var item0 = item(0),
            item1 = item(1);

        instance.reorderItem(0, 1);
        assert.equal(item0, item(1));
        assert.equal(item1, item(0));
    });

    QUnit.test("reorderItem should swap items by node", function(assert) {
        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items
            });

        var item = function(index) {
            return instance.itemElements().eq(index).get(0);
        };

        var item0 = item(0),
            item1 = item(1);

        instance.reorderItem(item0, item1);
        assert.equal(item0, item(1));
        assert.equal(item1, item(0));
    });

    QUnit.test("reorderItem should swap last with first items", function(assert) {
        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items
            });

        var item = function(index) {
            return instance.itemElements().eq(index).get(0);
        };

        var item0 = item(0),
            item1 = item(1);

        instance.reorderItem(1, 0);
        assert.equal(item0, item(1));
        assert.equal(item1, item(0));
    });

    QUnit.test("reorderItem should swap items in items option", function(assert) {
        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items
            });

        instance.reorderItem(0, 1);

        assert.deepEqual(instance.option("items"), [{ a: 1 }, { a: 0 }], "items rearranged");
    });

    QUnit.test("reorderItem should swap last with first items in items option", function(assert) {
        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items
            });

        instance.reorderItem(1, 0);

        assert.deepEqual(instance.option("items"), [{ a: 1 }, { a: 0 }], "items rearranged");
    });

    QUnit.test("reorderItem should not cause refresh", function(assert) {
        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items
            });

        var item = function(index) {
            return instance.itemElements().eq(index);
        };

        item(0).data("rendered", true);
        instance.reorderItem(0, 1);

        assert.equal(item(1).data("rendered"), true, "item not deleted");
    });

    QUnit.test("reorderItem should be resolved", function(assert) {
        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items
            });

        instance.reorderItem(0, 1).done(function() {
            assert.ok(true, "resolved");
            assert.equal(this, instance, "correct context");
        });
    });

    QUnit.test("reorderItem should not be executed if items are equal", function(assert) {
        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items,
                itemReorder: function(args) {
                    assert.ok(false, "items reordered");
                }

            });

        instance.reorderItem(0, 0).fail(function() {
            assert.ok(true, "failed");
        });
    });

    QUnit.test("onItemReordered should be fired if items reordered", function(assert) {
        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items,
                onItemReordered: function(args) {
                    assert.equal(args.itemElement.get(0), item(1), "correct item element");
                    assert.equal(args.fromIndex, 0, "correct from index");
                    assert.equal(args.toIndex, 1, "correct to index");
                }
            });

        var item = function(index) {
            return instance.itemElements().eq(index).get(0);
        };

        instance.reorderItem(item(0), item(1));
    });

    QUnit.test("selection should be updated after items reordered", function(assert) {
        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items,
                selectedItems: [items[0]],
                selectionMode: "multiple"
            });

        var item = function(index) {
            return instance.itemElements().eq(index).get(0);
        };

        instance.reorderItem(0, 1);
        assert.equal(instance.isItemSelected(item(0)), false, "selection changed");
        assert.equal(instance.isItemSelected(item(1)), true, "selection changed");
    });

    QUnit.test("deleteItem should trigger onOptionChanged action", function(assert) {
        assert.expect(2);

        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                items: items.slice()
            });

        instance.option("onOptionChanged", function(args) {
            if(args.name !== "items") return;

            assert.equal(args.component, instance, "correct option value");
            assert.deepEqual(args.value, [items[1], items[0]], "correct option value");
        });
        instance.reorderItem(0, 1);
    });


    QUnit.module("reordering with dataSource");

    QUnit.test("deleteItem should not trigger onOptionChanged action", function(assert) {
        assert.expect(0);

        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                dataSource: items.slice()
            });

        instance.option("onOptionChanged", function(args) {
            if(args.name !== "dataSource") return;

            assert.ok(false, "action fired");
        });
        instance.reorderItem(0, 1);
    });

    QUnit.test("deleteItem should not trigger onOptionChanged action if instance of DataSource", function(assert) {
        assert.expect(0);

        var items = [{ a: 0 }, { a: 1 }];

        var $element = $("#cmp"),
            instance = new TestComponent($element, {
                dataSource: new DataSource(items.slice())
            });

        instance.option("onOptionChanged", function(args) {
            if(args.name !== "dataSource") return;

            assert.ok(false, "action fired");
        });
        instance.deleteItem(1);
    });

    QUnit.test("items should update when datasource option changed", function(assert) {
        var widget = new TestComponent("#cmp", {
            dataSource: new DataSource({
                store: new ArrayStore([{ text: "item 1" }])
            })
        });

        assert.equal(widget.option("items")[0].text, "item 1", "item were initialized");

        widget.option("dataSource", new DataSource({
            store: new ArrayStore([{ text: "item 2" }])
        }));

        assert.equal(widget.option("items")[0].text, "item 2", "items wew changed");
    });
};

module.exports = { run: runTests };
