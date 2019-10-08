var $ = require("jquery"),
    typeUtils = require("core/utils/type"),
    executeAsyncMock = require("../../../helpers/executeAsyncMock.js"),
    keyboardMock = require("../../../helpers/keyboardMock.js"),
    DataSource = require("data/data_source/data_source").DataSource,
    ArrayStore = require("data/array_store");

require("ui/list");

var LIST_ITEM_CLASS = "dx-list-item";

var toSelector = function(cssClass) {
    return "." + cssClass;
};

QUnit.module("flat index");

QUnit.test("index should be correct for plain list", function(assert) {
    var items = [{ a: 0 }, { a: 1 }];

    var $list = $("#templated-list").dxList({
            items: items
        }),
        list = $list.dxList("instance");

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(1);

    assert.equal(list.getFlatIndexByItemElement($item.get(0)), 1, "index correct");
    assert.equal(list.getFlatIndexByItemElement($item), 1, "index correct");
});

QUnit.test("index should be correct for grouped list", function(assert) {
    var items = [
        {
            key: 'first',
            items: [{ a: 0 }, { a: 1 }, { a: 2 }]
        },
        {
            key: 'second',
            items: [{ a: 3 }, { a: 4 }, { a: 5 }]
        }
    ];

    var $list = $("#templated-list").dxList({
            items: items,
            grouped: true
        }),
        list = $list.dxList("instance");

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(5);

    assert.equal(list.getFlatIndexByItemElement($item.get(0)), 5, "index correct");
    assert.equal(list.getFlatIndexByItemElement($item), 5, "index correct");
});

QUnit.test("it should be possible to select an item in the grouped list by primitive index", function(assert) {
    var items = [
        {
            key: 'first',
            items: [{ a: 0 }, { a: 1 }]
        },
        {
            key: 'second',
            items: [{ a: 2 }, { a: 3 }]
        }
    ];

    var $list = $("#templated-list").dxList({
            items: items,
            selectionMode: "single",
            selectedIndex: 2,
            grouped: true
        }),
        list = $list.dxList("instance");

    var $items = $list.find(toSelector(LIST_ITEM_CLASS));

    assert.ok($items.eq(2).hasClass(LIST_ITEM_SELECTED_CLASS), "correct item is selected");
    assert.deepEqual(list.option("selectedItem"), { key: 'second', items: [{ a: 2 }] }, "selectedItem is correct");
    assert.deepEqual(list.option("selectedItems"), [{ key: 'second', items: [{ a: 2 }] }], "selectedItems is correct");

    list.option("selectedIndex", 1);
    assert.ok($items.eq(1).hasClass(LIST_ITEM_SELECTED_CLASS), "correct item is selected");
    assert.deepEqual(list.option("selectedItem"), { key: 'first', items: [{ a: 1 }] }, "selectedItem is correct");
    assert.deepEqual(list.option("selectedItems"), [{ key: 'first', items: [{ a: 1 }] }], "selectedItems is correct");
});

QUnit.test("item should be correct for plain list", function(assert) {
    var items = [{ a: 0 }, { a: 1 }];

    var $list = $("#templated-list").dxList({
            items: items
        }),
        list = $list.dxList("instance");

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(1);

    assert.equal(list.getItemElementByFlatIndex(1).get(0), $item.get(0), "item correct");
});

QUnit.test("index should be correct for grouped list", function(assert) {
    var items = [
        {
            key: 'first',
            items: [{ a: 0 }, { a: 1 }, { a: 2 }]
        },
        {
            key: 'second',
            items: [{ a: 3 }, { a: 4 }, { a: 5 }]
        }
    ];

    var $list = $("#templated-list").dxList({
            items: items,
            grouped: true
        }),
        list = $list.dxList("instance");

    var $items = $list.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.eq(5);

    assert.equal(list.getItemElementByFlatIndex(5).get(0), $item.get(0), "item correct");
});

QUnit.test("deleteItem should remove an item", function(assert) {
    var $list = $("#templated-list").dxList({
            items: [1, 2, 3, 4],
            allowItemDeleting: true
        }),
        list = $list.dxList("instance"),
        $items = $list.find(toSelector(LIST_ITEM_CLASS));

    list.deleteItem($items.eq(0).get(0));
    assert.deepEqual(list.option("items"), [2, 3, 4], "delete item by node");

    list.deleteItem(0);
    assert.deepEqual(list.option("items"), [3, 4], "delete item by index");
    assert.equal($list.find(toSelector(LIST_ITEM_CLASS)).length, 2, "items were removed from the dom");
});

QUnit.test("deferred deleteItem should correctly update cached items after item removing", function(assert) {
    var deferred,
        $list = $("#templated-list").dxList({
            items: [1, 2, 3, 4],
            onItemDeleting: function(e) {
                deferred = $.Deferred();
                e.cancel = deferred.promise();
            },
            allowItemDeleting: true
        }),
        list = $list.dxList("instance"),
        $items = $list.find(toSelector(LIST_ITEM_CLASS));

    list.deleteItem($items.eq(0).get(0));
    deferred.resolve();
    assert.deepEqual(list.option("items"), [2, 3, 4], "delete item by node");
    assert.equal(list._itemElements().length, 3, "item was removed from the cache");

    list.deleteItem(0);
    deferred.resolve();
    assert.deepEqual(list.option("items"), [3, 4], "delete item by index");
    assert.equal(list._itemElements().length, 2, "item was removed from the cache");
});


var groupedListData = {
    data: [
        {
            key: 'first',
            items: [{ a: 0 }, { a: 1 }, { a: 2 }]
        },
        {
            key: 'second',
            items: [{ a: 3 }, { a: 4 }, { a: 5 }]
        },
        {
            key: 'third',
            items: [{ a: 6 }, { a: 7 }, { a: 8 }]
        }
    ],
    itemsAfterDelete: [
        {
            key: 'first',
            items: [{ a: 0 }, { a: 1 }, { a: 2 }]
        },
        {
            key: 'second',
            items: [{ a: 3 }, { a: 4 }]
        },
        {
            key: 'third',
            items: [{ a: 6 }, { a: 7 }, { a: 8 }]
        }
    ]
};


QUnit.module("deleting in grouped list");

QUnit.test("deleteItem should remove item by node", function(assert) {
    var $list = $("#templated-list").dxList({
            items: groupedListData.data,
            grouped: true,
            editEnabled: true
        }),
        list = $list.dxList("instance");

    var $groups = $list.find(toSelector(LIST_GROUP_CLASS));

    list.deleteItem($groups.eq(1).find(toSelector(LIST_ITEM_CLASS)).eq(2));

    assert.deepEqual(list.option("items"), groupedListData.itemsAfterDelete, "item deleted");
});

QUnit.test("deleteItem should remove item by index", function(assert) {
    var $list = $("#templated-list").dxList({
            items: groupedListData.data,
            grouped: true,
            editEnabled: true
        }),
        list = $list.dxList("instance");

    list.deleteItem({ group: 1, item: 2 });

    assert.deepEqual(list.option("items"), groupedListData.itemsAfterDelete, "item deleted");
});

QUnit.test("deleteItem should remove item by index", function(assert) {
    var $list = $("#templated-list").dxList({
            items: groupedListData.data,
            grouped: true,
            editEnabled: true
        }),
        list = $list.dxList("instance");

    list.deleteItem({ group: 1, item: 2 });

    assert.deepEqual(list.option("items"), groupedListData.itemsAfterDelete, "item deleted");
});

QUnit.module("keyboard navigation", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("item deletion by keyboard", function(assert) {
    var items = ["1", "2", "3"];

    var $list = $("#list").dxList({
            items: items,
            editEnabled: true,
            allowItemDeleting: false,
            focusStateEnabled: true
        }),
        list = $list.dxList("instance");

    var keyboard = keyboardMock($list);

    $list.focusin();
    keyboard.keyDown("del");

    assert.deepEqual(list.option("items"), items, "deletion by keyboard is impossible if 'allowItemDeleting' = false ");

    list.option("allowItemDeleting", true);
    list.option("focusedElement", $list.find("." + LIST_ITEM_CLASS).eq(1));

    keyboard.keyDown("del");

    assert.deepEqual(list.option("items"), ["1", "3"], "item was deleted");
});

QUnit.test("items reordering by keyboard", function(assert) {
    var items = ["1", "2", "3"];

    var $list = $("#list").dxList({
            items: items,
            editEnabled: true,
            itemDragging: {
                allowReordering: false
            },
            focusStateEnabled: true
        }),
        list = $list.dxList("instance"),
        $lastItem = $list.find("." + LIST_ITEM_CLASS).eq(2);

    $lastItem.trigger("dxpointerdown");
    this.clock.tick();
    $lastItem.trigger($.Event("keydown", { key: "ArrowUp", shiftKey: true }));

    assert.deepEqual(list.option("items"), items, "reordering by keyboard is impossible if 'itemDragging.allowReordering' = false ");

    list.option("itemDragging.allowReordering", true);

    $lastItem = $list.find("." + LIST_ITEM_CLASS).eq(2);
    $lastItem.trigger("dxpointerdown");
    this.clock.tick();
    $list.trigger($.Event("keydown", { key: "ArrowUp", shiftKey: true }));

    assert.deepEqual(list.option("items"), ["1", "3", "2"], "items were reordered");

    $lastItem.trigger($.Event("keydown", { key: "ArrowDown", shiftKey: true }));

    assert.deepEqual(list.option("items"), items, "items were reordered");
});


QUnit.module("deleting in grouped list with dataSource", {
    beforeEach: function() {
        executeAsyncMock.setup();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
    }
});

QUnit.test("deleteItem shouldn't load data", function(assert) {
    var dataSource = new DataSource({
        store: groupedListData.data,
        pageSize: 1
    });

    var $list = $("#list").height(60).dxList({
        dataSource: dataSource,
        grouped: true,
        editEnabled: true
    });

    var $listItems = $("." + LIST_ITEM_CLASS, $list);

    $list.dxList("deleteItem", { group: 0, item: 1 }).done(function() {
        var $newListItems = $("." + LIST_ITEM_CLASS, $list);
        assert.equal($listItems.length, $newListItems.length + 1, "new item wasn't loaded");
    });
});


QUnit.module("selectAll methods");

QUnit.test("selectAll/unselectAll for 'page' selectAllMode", function(assert) {
    var items = [1, 2, 3, 4, 5];
    var ds = new DataSource({
        store: items,
        pageSize: 2,
        paginate: true
    });

    var $element = $("#list").dxList({
        dataSource: ds,
        pageLoadMode: "nextButton",
        selectionMode: "multiple",
        selectAllMode: "page"
    });

    var instance = $element.dxList("instance");

    instance.selectAll();

    assert.deepEqual(instance.option("selectedItems"), items.slice(0, 2), "selected items is correct");

    instance.unselectAll();

    assert.deepEqual(instance.option("selectedItems"), [], "selected items is empty");
});

QUnit.test("selectAll/unselectAll for 'allPages' selectAllMode", function(assert) {
    var items = [1, 2, 3, 4, 5];
    var loading = sinon.spy();
    var ds = new DataSource({
        store: {
            type: "array",
            data: items,
            onLoading: loading
        },
        pageSize: 2,
        paginate: true
    });

    var $element = $("#list").dxList({
        dataSource: ds,
        selectionMode: "multiple",
        selectAllMode: "allPages"
    });

    var instance = $element.dxList("instance");
    assert.equal(loading.callCount, 1, "one load during creation");

    instance.selectAll();

    assert.deepEqual(instance.option("selectedItems"), items, "selected items is correct");
    assert.equal(loading.callCount, 2, "one load during select all");

    instance.unselectAll();

    assert.deepEqual(instance.option("selectedItems"), [], "selected items is empty");
    assert.equal(loading.callCount, 2, "no load during unselect all");
});

QUnit.module("selection");

QUnit.test("unselectItem for last item if 'allPages' selectAllMode", function(assert) {
    var items = [1, 2, 3, 4, 5];
    var loading = sinon.spy();
    var ds = new DataSource({
        store: items,
        pageSize: 2,
        paginate: true
    });
    ds.store().on("loading", loading);

    var $element = $("#list").dxList({
        selectedItems: [1],
        dataSource: ds,
        pageLoadMode: "nextButton",
        showSelectionControls: true,
        selectionMode: "all",
        selectAllMode: "allPages"
    });

    var instance = $element.dxList("instance");
    assert.equal(loading.callCount, 1, "one load during creation");

    // act
    instance.unselectItem(0);

    // assert
    assert.equal(loading.callCount, 1, "no load during unselect last item");
    assert.deepEqual(instance.option("selectedItems"), [], "selected items is empty");
});

QUnit.test("change selectedItemKeys to invisible items should perform load with filter", function(assert) {
    var items = [1, 2, 3, 4, 5];
    var ds = new DataSource({
        store: {
            type: "array",
            key: "this",
            data: items,
            onLoading: loading
        },
        pageSize: 2,
        paginate: true
    });

    var $element = $("#list").dxList({
        dataSource: ds,
        selectionMode: "multiple"
    });

    var instance = $element.dxList("instance");
    var loading = sinon.spy();
    ds.store().on("loading", loading);

    // act
    instance.option("selectedItemKeys", [4]);

    // assert
    assert.equal(loading.callCount, 1, "one load during change selectedRowKeys");
    assert.deepEqual(loading.lastCall.args[0].filter, ["this", "=", 4], "load during change selectedRowKeys");
    assert.deepEqual(instance.option("selectedItems"), [4], "selected items is empty");
});

QUnit.test("selectedItems should not be removed if items won't loaded", function(assert) {
    var items = [1, 2, 3, 4, 5];
    var ds = new DataSource({
        store: items,
        pageSize: 2,
        paginate: true
    });

    var $element = $("#list").dxList({
        dataSource: ds,
        pageLoadMode: "nextButton",
        selectedItems: items.slice(),
        selectionMode: "multiple"
    });

    $element.find(".dx-list-next-button .dx-button").trigger("dxclick");
    assert.deepEqual($element.dxList("option", "selectedItems"), items, "selected items is correct");
});

QUnit.test("selectedItems should be cleaned after pulldown", function(assert) {
    var items = [1, 2, 3, 4, 5];
    var ds = new DataSource({
        store: items,
        pageSize: 2,
        paginate: true
    });

    var $element = $("#list").dxList({
        pullRefreshEnabled: true,
        dataSource: ds,
        selectedItems: items.slice(),
        selectionMode: "multiple"
    });

    $element.dxScrollView("option", "onPullDown")();
    assert.deepEqual($element.dxList("option", "selectedItems"), [], "selected items were cleaned");
});

QUnit.test("selectedItems should not be cleaned after reordering if store key specified", function(assert) {
    var items = [{ id: 1, text: "1" }, { id: 2, text: "2" }, { id: 3, text: "3" }];

    var listInstance = $("#list").dxList({
        dataSource: new ArrayStore({
            key: "id",
            data: items
        }),
        selectionMode: "all"
    }).dxList("instance");

    listInstance.selectItem(0);

    var item0 = $("#list").find(toSelector(LIST_ITEM_CLASS)).eq(0).get(0),
        item1 = $("#list").find(toSelector(LIST_ITEM_CLASS)).eq(1).get(0);

    listInstance.reorderItem(item0, item1);
    assert.equal(listInstance.option("selectedItems")[0], items[0], "first item is selected");
});

QUnit.test("reorderItem method should return a Promise", function(assert) {
    var listInstance = $("#list").dxList({
        dataSource: [1, 2, 3]
    }).dxList("instance");

    listInstance.selectItem(0);

    var promise = listInstance.reorderItem(0, 1),
        $items = $("#list").find(toSelector(LIST_ITEM_CLASS)),
        firstItemText = $items.eq(0).text(),
        secondItemText = $items.eq(1).text();

    assert.ok(typeUtils.isPromise(promise), "method returns a promise");
    assert.equal(firstItemText, "2");
    assert.equal(secondItemText, "1");
});

// T525081
QUnit.test("selection works well after clean all selected items and selectAllMode is 'allPages'", function(assert) {
    var items = [1, 2, 3],
        selectionChangedSpy = sinon.spy();

    var listInstance = $("#list").dxList({
        dataSource: new ArrayStore({
            key: "id",
            data: items
        }),
        selectionMode: "all",
        showSelectionControls: true,
        selectAllMode: "allPages",
        onSelectionChanged: selectionChangedSpy
    }).dxList("instance");

    listInstance.selectItem(0);
    listInstance.unselectItem(0);
    listInstance.selectItem(0);

    assert.equal(selectionChangedSpy.callCount, 3, "'selectionChanged' event has been fired 3 times");
});

// T567757
QUnit.test("Selecting all filtered items when selectAllMode is 'allPages'", function(assert) {
    // arrange
    var items = [1, 2, 3, 4, 5],
        $selectAll;

    var instance = $("#list").dxList({
        dataSource: {
            store: items,
            pageSize: 2,
            paginate: true
        },
        showSelectionControls: true,
        selectionMode: "all",
        selectAllMode: "allPages",
        searchValue: "1"
    }).dxList("instance");

    // act
    instance.selectItem(0);

    // assert
    $selectAll = $("#list").find(".dx-list-select-all-checkbox");
    assert.ok($selectAll.hasClass("dx-checkbox-checked"), "selectAll checkbox is checked");
    assert.deepEqual(instance.option("selectedItems"), [1], "selected items");

    // act
    instance.option("searchValue", "");

    // assert
    $selectAll = $("#list").find(".dx-list-select-all-checkbox");
    assert.ok($selectAll.hasClass("dx-checkbox-indeterminate"), "selectAll checkbox is indeterminate");
});

var LIST_ITEM_SELECTED_CLASS = "dx-list-item-selected";

QUnit.module("selecting in grouped list", {
    beforeEach: function() {
        this.data = [
            {
                key: 'first',
                items: [{ a: 0 }, { a: 1 }, { a: 2 }]
            },
            {
                key: 'second',
                items: [{ a: 3 }, { a: 4 }, { a: 5 }]
            },
            {
                key: 'third',
                items: [{ a: 6 }, { a: 7 }, { a: 8 }]
            }
        ];
        this.selection = [
            { group: 0, item: 0 },
            { group: 0, item: 2 },
            { group: 1, item: 1 },
            { group: 2, item: 2 }
        ];
        this.itemsSelection = [
            {
                key: 'first',
                items: [this.data[0].items[0], this.data[0].items[2]]
            },
            {
                key: 'second',
                items: [this.data[1].items[1]]
            },
            {
                key: 'third',
                items: [this.data[2].items[2]]
            }
        ];
    }
});

var LIST_GROUP_CLASS = "dx-list-group";

QUnit.test("selectItem by node should add item to selectedItems", function(assert) {
    var $list = $("#templated-list").dxList({
            items: this.data,
            grouped: true,
            editEnabled: true,
            selectionMode: "multiple"
        }),
        list = $list.dxList("instance");

    var $groups = $list.find(toSelector(LIST_GROUP_CLASS));

    var selectItem = function(group, item) {
        list.selectItem($groups.eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item));
    };

    $.each(this.selection, function(index, value) {
        selectItem(value.group, value.item);
    });

    var selected = list.option("selectedItems");

    assert.deepEqual(selected, this.itemsSelection, "selection must be equal");
});

QUnit.test("selectItem by index should add item to selectedItems", function(assert) {
    var $list = $("#templated-list").dxList({
            items: this.data,
            grouped: true,
            editEnabled: true,
            selectionMode: "multiple"
        }),
        list = $list.dxList("instance");

    var selectItem = function(group, item) {
        list.selectItem({ group: group, item: item });
    };

    $.each(this.selection, function(index, value) {
        selectItem(value.group, value.item);
    });

    var selected = list.option("selectedItems");

    assert.deepEqual(selected, this.itemsSelection, "selection must be equal");
});

QUnit.test("selectItem by itemData should add item to selectedItems", function(assert) {
    var $list = $("#templated-list").dxList({
            items: this.data,
            grouped: true,
            editEnabled: true,
            selectionMode: "multiple"
        }),
        list = $list.dxList("instance"),
        that = this;

    var selectItem = function(group, item) {
        list.selectItem(that.data[group].items[item]);
    };

    $.each(this.selection, function(index, value) {
        selectItem(value.group, value.item);
    });

    var selected = list.option("selectedItems");

    assert.deepEqual(selected, this.itemsSelection, "selection must be equal");
});

QUnit.test("selectItem by itemElement should add item to selectedItems", function(assert) {
    var $list = $("#templated-list").dxList({
            items: this.data,
            grouped: true,
            editEnabled: true,
            selectionMode: "multiple"
        }),
        list = $list.dxList("instance");

    list.selectItem($("<div>"));
    assert.equal(list.option("selectedItems").length, 0, "selection must be empty");
});

QUnit.test("unselectItem should remove item from selectedItems", function(assert) {
    var $list = $("#templated-list").dxList({
            items: this.data,
            grouped: true,
            editEnabled: true,
            selectionMode: "multiple"
        }),
        list = $list.dxList("instance");

    var selectItem = function(group, item) {
        list.selectItem({ group: group, item: item });
    };
    var unselectItem = function(group, item) {
        list.unselectItem({ group: group, item: item });
    };

    $.each(this.selection, function(index, value) {
        selectItem(value.group, value.item);
        unselectItem(value.group, value.item);
    });

    var selected = list.option("selectedItems");

    assert.deepEqual(selected, [], "selection must be equal");
});

QUnit.test("isItemSelected should reflect current item state", function(assert) {
    var data = [
        {
            key: 'first',
            items: [{ a: 0 }]
        },
        {
            key: 'second',
            items: [{ a: 0 }]
        }
    ];

    var $list = $("#templated-list").dxList({
            items: data,
            grouped: true,
            editEnabled: true,
            selectionMode: "multiple"
        }),
        list = $list.dxList("instance");

    var $items = $list.find(toSelector(LIST_ITEM_CLASS));

    list.selectItem($items.eq(1));
    assert.equal(list.isItemSelected($items.eq(1)), true, "isItemSelected return proper state");

    list.unselectItem($items.eq(1));
    assert.equal(list.isItemSelected($items.eq(1)), false, "isItemSelected return proper state");
});

QUnit.test("selection should be same when list refresh", function(assert) {
    var $list = $("#templated-list").dxList({
            items: this.data,
            grouped: true,
            editEnabled: true,
            selectionMode: "multiple"
        }),
        list = $list.dxList("instance");

    var groupItem = function(group, item) {
        return $list.find(toSelector(LIST_GROUP_CLASS)).eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item);
    };
    var selectItem = function(group, item) {
        list.selectItem(groupItem(group, item));
    };

    $.each(this.selection, function(index, value) {
        selectItem(value.group, value.item);
    });

    list._refresh();

    $.each(this.selection, function(index, value) {
        assert.ok(groupItem(value.group, value.item).hasClass(LIST_ITEM_SELECTED_CLASS), "class rendered");
    });
});

QUnit.test("selection should be cleared after grouped option is changed", function(assert) {
    var $list = $("#templated-list").dxList({
            items: this.data,
            grouped: true,
            editEnabled: true,
            selectionMode: "multiple"
        }),
        list = $list.dxList("instance");

    var $groups = $list.find(toSelector(LIST_GROUP_CLASS));

    var selectItem = function(group, item) {
        list.selectItem($groups.eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item));
    };

    $.each(this.selection, function(index, value) {
        selectItem(value.group, value.item);
    });

    list.option("grouped", false);

    assert.equal(list.option("selectedItems").length, 0, "should not be items in selectedItems");
    assert.equal($list.find(toSelector(LIST_ITEM_SELECTED_CLASS)).length, 0, "should not be selected elements");
});

QUnit.test("deleteItem should change selected items", function(assert) {
    var toDelete = [
            { group: 0, item: 1 },
            { group: 1, item: 1 },
            { group: 2, item: 1 }
        ],
        itemsSelection = [
            {
                key: 'first',
                items: [{ a: 0 }, { a: 2 }]
            },
            {
                key: 'third',
                items: [{ a: 8 }]
            }
        ];


    var $list = $("#templated-list").dxList({
            items: this.data,
            grouped: true,
            editEnabled: true,
            selectionMode: "multiple"
        }),
        list = $list.dxList("instance");

    var groups = function() {
        return $list.find(toSelector(LIST_GROUP_CLASS));
    };
    var selectItem = function(group, item) {
        list.selectItem(groups().eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item));
    };
    var deleteItem = function(group, item) {
        list.deleteItem(groups().eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item));
    };

    $.each(this.selection, function(_, value) {
        selectItem(value.group, value.item);
    });
    $.each(toDelete, function(_, value) {
        deleteItem(value.group, value.item);
    });

    assert.deepEqual(list.option("selectedItems"), itemsSelection, "item not deleted");
});

QUnit.test("item should be selectable by click on it in the grouped list", function(assert) {
    var list = $("#templated-list").dxList({
            items: [
                { key: "first", items: [{ text: "item 1" }] }
            ],
            grouped: true,
            selectionMode: "multiple",
            keyExpr: "text"
        }).dxList("instance"),
        $items = $(list.itemElements());

    $items.eq(0).trigger("dxclick");

    assert.ok($items.eq(0).hasClass("dx-list-item-selected"), "item became selected");
});


QUnit.module("selecting in grouped list with single mode", {
    beforeEach: function() {
        this.data = [
            {
                key: 'first',
                items: [{ a: 0 }, { a: 1 }, { a: 2 }]
            },
            {
                key: 'second',
                items: [{ a: 3 }, { a: 4 }, { a: 5 }]
            },
            {
                key: 'third',
                items: [{ a: 6 }, { a: 7 }, { a: 8 }]
            }
        ];
        this.selection = [
            { group: 0, item: 0 },
            { group: 0, item: 2 },
            { group: 1, item: 1 },
            { group: 2, item: 2 }
        ];
        this.itemsSelection = [
            {
                key: 'first',
                items: [this.data[0].items[0], this.data[0].items[2]]
            },
            {
                key: 'second',
                items: [this.data[1].items[1]]
            },
            {
                key: 'third',
                items: [this.data[2].items[2]]
            }
        ];
    }
});

QUnit.test("selectedItem should select only one item", function(assert) {
    var itemsSelection = [
        {
            key: 'third',
            items: [{ a: 8 }]
        }
    ];

    var $list = $("#templated-list").dxList({
            items: this.data,
            grouped: true,
            editEnabled: true,
            selectionMode: 'single'
        }),
        list = $list.dxList("instance");

    var groups = function() {
        return $list.find(toSelector(LIST_GROUP_CLASS));
    };
    var selectItem = function(group, item) {
        list.selectItem(groups().eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item));
    };

    $.each(this.selection, function(_, value) {
        selectItem(value.group, value.item);
    });

    assert.deepEqual(list.option("selectedItems"), itemsSelection, "selected only one item");
});

QUnit.test("selectedItems should accept only one item", function(assert) {
    var itemsSelection = [
        {
            key: 'first',
            items: [{ a: 0 }]
        }
    ];

    var $list = $("#templated-list").dxList({
            items: this.data,
            grouped: true,
            editEnabled: true,
            selectedItems: this.itemsSelection,
            selectionMode: 'single'
        }),
        list = $list.dxList("instance");

    assert.deepEqual(list.option("selectedItems"), itemsSelection, "selected only one item");

    list.option("selectedItems", this.itemsSelection);
    assert.deepEqual(list.option("selectedItems"), itemsSelection, "selected only one item");
});


QUnit.module("selecting in grouped list with dataSource");

QUnit.test("selection should hold selection after dataSource filtering (T474406)", function(assert) {
    var items = [
        { key: 'first', text: 'a' },
        { key: 'second', text: 'b' }
    ];
    var dataSource = new DataSource({
        store: items,
        group: "key",
        searchOperation: "contains",
        searchExpr: "text"
    });

    var $list = $("#templated-list").dxList({
            dataSource: dataSource,
            grouped: true,
            keyExpr: "text",
            selectedItemKeys: ["b"],
            selectionMode: 'multiple'
        }),
        list = $list.dxList("instance");

    dataSource.searchValue("a");
    dataSource.load();

    var groups = function() {
        return $list.find(toSelector(LIST_GROUP_CLASS));
    };
    var selectItem = function(group, item) {
        list.selectItem(groups().eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item));
    };

    selectItem(0, 0);

    assert.deepEqual(list.option("selectedItemKeys"), ["a", "b"]);
});


QUnit.module("reordering in grouped items", {
    beforeEach: function() {
        this.data = [
            {
                key: 'first',
                items: [{ a: 0 }, { a: 1 }, { a: 2 }]
            },
            {
                key: 'second',
                items: [{ a: 3 }, { a: 4 }, { a: 5 }]
            }
        ];
        this.movedItem = { group: 0, item: 1 };
        this.destinationItem = { group: 1, item: 1 };
        this.movedItems = [
            {
                key: 'first',
                items: [{ a: 0 }, { a: 2 }]
            },
            {
                key: 'second',
                items: [{ a: 3 }, { a: 1 }, { a: 4 }, { a: 5 }]
            }
        ];
    }
});

QUnit.test("reorderItem should swap items by node", function(assert) {
    var $list = $("#templated-list").dxList({
            items: this.data,
            grouped: true,
            editEnabled: true
        }),
        list = $list.dxList("instance");

    var groups = function() {
        return $list.find(toSelector(LIST_GROUP_CLASS));
    };
    var item = function(group, item) {
        return groups().eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item).get(0);
    };

    var item01 = item(0, 1),
        item11 = item(1, 1);

    list.reorderItem(item01, item11);
    assert.equal(item01, item(1, 1));
    assert.equal(item11, item(1, 2));
});

QUnit.test("reorderItem should swap items by index", function(assert) {
    var $list = $("#templated-list").dxList({
            items: this.data,
            grouped: true,
            editEnabled: true
        }),
        list = $list.dxList("instance"),
        refreshItemsSpy = sinon.spy(list, "_refreshItemElements");

    var groups = function() {
        return $list.find(toSelector(LIST_GROUP_CLASS));
    };
    var item = function(group, item) {
        return groups().eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item).get(0);
    };

    var item01 = item(0, 1),
        item11 = item(1, 1);

    list.reorderItem(this.movedItem, this.destinationItem);
    assert.equal(item01, item(1, 1));
    assert.equal(item11, item(1, 2));
    assert.equal(refreshItemsSpy.callCount, 1, "Items refresh after reorder");
});

QUnit.test("reorderItem should swap items by node within one group", function(assert) {
    var $list = $("#templated-list").dxList({
            items: this.data,
            grouped: true,
            editEnabled: true
        }),
        list = $list.dxList("instance");

    var groups = function() {
        return $list.find(toSelector(LIST_GROUP_CLASS));
    };
    var item = function(group, item) {
        return groups().eq(group).find(toSelector(LIST_ITEM_CLASS)).eq(item).get(0);
    };

    var item11 = item(1, 1),
        item12 = item(1, 2);

    list.reorderItem(item11, item12);
    assert.equal(item11, item(1, 2));
    assert.equal(item12, item(1, 1));
});

QUnit.test("reorderItem should swap last with first items in items option", function(assert) {
    var $list = $("#templated-list").dxList({
            items: this.data,
            grouped: true,
            editEnabled: true
        }),
        list = $list.dxList("instance");

    list.reorderItem(this.movedItem, this.destinationItem);
    assert.deepEqual(list.option("items"), this.movedItems, "items option changed");
});

QUnit.test("onItemReordered should be fired if items reordered", function(assert) {
    var $list = $("#templated-list").dxList({
            items: this.data,
            grouped: true,
            editEnabled: true,
            onItemReordered: function(args) {
                assert.deepEqual(args.fromIndex, { group: 0, item: 1 }, "correct from index");
                assert.deepEqual(args.toIndex, { group: 1, item: 1 }, "correct to index");
            }
        }),
        list = $list.dxList("instance");

    var item = function(group, item) {
        return $list.find(toSelector(LIST_GROUP_CLASS)).eq(group)
            .find(toSelector(LIST_ITEM_CLASS)).eq(item)
            .get(0);
    };

    list.reorderItem(item(0, 1), item(1, 1));
});

QUnit.test("selection should be updated after items reordered", function(assert) {
    var selection = [
        {
            key: 'second',
            items: [this.data[0].items[1], this.data[1].items[1]]
        }
    ];

    var $list = $("#templated-list").dxList({
            items: this.data,
            grouped: true,
            selectedItems: [
                {
                    key: 'first',
                    items: [this.data[0].items[1]]
                },
                {
                    key: 'second',
                    items: [this.data[1].items[1]]
                }
            ],
            editEnabled: true,
            selectionMode: "multiple"
        }),
        list = $list.dxList("instance");

    list.reorderItem(this.movedItem, this.destinationItem);
    assert.deepEqual(list.option("selectedItems"), selection, "selectedItems option updated");
});
