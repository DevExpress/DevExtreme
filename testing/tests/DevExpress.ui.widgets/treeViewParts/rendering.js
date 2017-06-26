"use strict";

/* global DATA, data2, internals, initTree */

var $ = require("jquery"),
    commonUtils = require("core/utils/common"),
    isFunction = require("core/utils/type").isFunction,
    fx = require("animation/fx"),
    DataSource = require("data/data_source/data_source").DataSource,
    ArrayStore = require("data/array_store"),
    CustomStore = require("data/custom_store");

QUnit.module("Rendering", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("TreeView should has a right class", function(assert) {
    var $treeView = initTree();
    assert.ok($treeView.hasClass(internals.WIDGET_CLASS));
});

QUnit.test("Render scrollable container", function(assert) {
    var $treeView = initTree({
            items: $.extend(true, [], DATA[1]),
            keyExpr: "key"
        }),
        $rootNode = $treeView.find("." + internals.NODE_CONTAINER_CLASS + ":first");

    assert.ok($rootNode.parent().hasClass("dx-scrollable-content"));
    assert.ok($treeView.find(".dx-scrollable").length, 1);
});

QUnit.test("Scrollable container should be updated after collapse/expand treeView item", function(assert) {
    var $treeView = initTree({
            items: $.extend(true, [], DATA[1]),
            keyExpr: "key"
        }),
        treeView = $treeView.dxTreeView("instance");

    treeView._scrollableContainer.update = sinon.spy(commonUtils.noop);

    $treeView
        .find("." + internals.TOGGLE_ITEM_VISIBILITY_CLASS + ":first")
        .trigger("dxclick");

    assert.equal(treeView._scrollableContainer.update.callCount, 2);
});

QUnit.test("updateDimensions method should update scrollable container", function(assert) {
    var $treeView = initTree({
            items: $.extend(true, [], DATA[1]),
            keyExpr: "key"
        }),
        treeView = $treeView.dxTreeView("instance");

    treeView._scrollableContainer.update = sinon.spy(function() {
        return $.Deferred().resolve();
    });

    assert.ok(isFunction(treeView.updateDimensions));
    var result = treeView.updateDimensions();
    assert.ok(treeView._scrollableContainer.update.calledOnce);
    assert.ok(result.promise);
});

QUnit.test("Scrollable container should be updated if height of widget content is less than height of scrollable content", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].items[1].expanded = true;

    initTree({
        items: data,
        height: 100,
        onContentReady: function() {
            $("#treeView").children().first().dxScrollable("instance").update = sinon.spy(commonUtils.noop);
        }
    }).dxTreeView("instance");

    assert.ok($("#treeView").children().first().dxScrollable("instance").update.calledOnce);
});

QUnit.test("Render items container", function(assert) {
    var $treeView = initTree({
        items: [{ key: 1, text: "Item" }]
    });
    assert.equal($treeView.find("." + internals.NODE_CONTAINER_CLASS).length, 1);
});

QUnit.test("Render html item", function(assert) {
    var $treeView = initTree({
            items: [{ id: 1, html: "<b>Hello</b>" }]
        }),
        $itemContainer = $treeView.find("." + internals.NODE_CONTAINER_CLASS),
        $node = $itemContainer.find("." + internals.NODE_CLASS).eq(0),
        $item = $node.find("." + internals.ITEM_CLASS);

    assert.equal($item.text(), "Hello", "created");
});

QUnit.test("Render first level items", function(assert) {
    var $treeView = initTree({
        items: $.extend(true, [], DATA[0]),
        keyExpr: "key"
    });
    var $itemContainer = $treeView.find("." + internals.NODE_CONTAINER_CLASS),
        $nodes = $itemContainer.find("." + internals.NODE_CLASS),
        $items = $nodes.find("." + internals.ITEM_CLASS);

    assert.equal($items.length, 3);
    assert.equal($($items[0]).find("span").text(), "Item 1");
    assert.equal($($items[1]).find("span").text(), "Item 2");
    assert.equal($($items[2]).find("span").text(), "Item 3");
});

QUnit.test("Render items with parentId set as tree", function(assert) {
    var $treeView = initTree({
        items: $.extend(true, [], data2),
        dataStructure: "tree"
    });
    var $items = $treeView.find("." + internals.ITEM_CLASS);

    assert.equal($items.length, 16);
});

QUnit.test("Render nested items", function(assert) {
    var data = $.extend(true, [], DATA[1]);
    data[0].items[1].items[0].expanded = true;
    var $treeView = initTree({
        items: data,
        keyExpr: "key"
    });

    var $rootNode = $treeView.find("." + internals.NODE_CONTAINER_CLASS + ":first-child"),
        $rootNodeFirstItem = $rootNode.find("." + internals.NODE_CLASS).eq(0),
        $rootNodeSecondItem = $rootNode.find("." + internals.NODE_CLASS).eq(1),
        $firstNestedNode = $rootNodeFirstItem.find("> ." + internals.NODE_CONTAINER_CLASS);

    assert.ok(!$rootNodeFirstItem.hasClass(internals.IS_LEAF));
    assert.ok($rootNodeSecondItem.hasClass(internals.IS_LEAF));
    assert.ok($firstNestedNode.length);
    assert.ok($firstNestedNode.find("." + internals.NODE_CLASS).eq(0).hasClass(internals.IS_LEAF));
    assert.ok(!$firstNestedNode.find("." + internals.NODE_CLASS).eq(1).hasClass(internals.IS_LEAF));
    assert.ok(!$firstNestedNode.find("." + internals.NODE_CLASS).eq(0).find("." + internals.NODE_CONTAINER_CLASS).length);
    assert.ok($firstNestedNode.find("." + internals.NODE_CLASS).eq(1).find("." + internals.NODE_CONTAINER_CLASS).length);
});

QUnit.test("Render toggle icon", function(assert) {
    var $treeView = initTree({
        items: $.extend(true, [], DATA[2]),
    });

    var $rootNode = $treeView.find("." + internals.NODE_CONTAINER_CLASS + ":first-child"),
        $rootNodeFirstItem = $rootNode.find("." + internals.NODE_CLASS).eq(0),
        $rootNodeSecondItem = $rootNode.find("." + internals.NODE_CLASS).eq(1);

    assert.equal($rootNodeFirstItem.find("." + internals.TOGGLE_ITEM_VISIBILITY_CLASS).length, 1);
    assert.equal($rootNodeSecondItem.find("." + internals.TOGGLE_ITEM_VISIBILITY_CLASS).length, 0);
});

QUnit.test("Add disabled class for toggle icon if item is disabled", function(assert) {
    var $treeView = initTree({
        items: [{ id: 1, text: "one", disabled: true, items: [{ id: 11, text: "Nested 1" }, { id: 12, text: "Nested 2" }] }]
    });

    var $rootNode = $treeView.find("." + internals.NODE_CONTAINER_CLASS + ":first-child"),
        $icon = $rootNode.find("." + internals.NODE_CLASS).eq(0).children("." + internals.TOGGLE_ITEM_VISIBILITY_CLASS).eq(0);

    assert.ok($icon.hasClass("dx-state-disabled"));
});

QUnit.test("Toggle visibility action", function(assert) {
    var $treeView = initTree({
            items: $.extend(true, [], DATA[5])
        }),
        treeView = $treeView.dxTreeView("instance"),
        items = treeView.option("items");


    var $toggleVisibilityIcon = $treeView.find("." + internals.TOGGLE_ITEM_VISIBILITY_CLASS);

    $toggleVisibilityIcon.trigger("dxclick");

    var $nestedNode = $treeView.find("." + internals.NODE_CONTAINER_CLASS + ":last-child");
    assert.ok($nestedNode.hasClass(internals.OPENED_NODE_CONTAINER_CLASS));
    assert.ok($toggleVisibilityIcon.hasClass(internals.TOGGLE_ITEM_VISIBILITY_OPENED_CLASS));
    assert.ok(items[0].expanded);

    var nodes = treeView.getNodes();
    assert.ok(nodes[0].expanded);

    $toggleVisibilityIcon.trigger("dxclick");
    assert.ok(!$nestedNode.hasClass(internals.OPENED_NODE_CONTAINER_CLASS));
    assert.ok(!$toggleVisibilityIcon.hasClass(internals.TOGGLE_ITEM_VISIBILITY_OPENED_CLASS));
    assert.ok(!items[0].expanded);

    nodes = treeView.getNodes();
    assert.ok(!nodes[0].expanded);
});

QUnit.test("Render checkboxes", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].items[0].expanded = true;
    var $treeView = initTree({
        items: data,
        showCheckBoxesMode: "normal"
    });

    assert.equal($treeView.find("." + internals.NODE_CLASS).find(".dx-checkbox").length, 4);
    assert.equal($treeView.find("." + internals.NODE_CLASS + "." + internals.ITEM_WITH_CHECKBOX_CLASS).length, 4);
});

QUnit.test("Render tree by id/parentId fields", function(assert) {
    var data = $.extend(true, [], DATA[4]);
    data = $.map(data, function(item) {
        item.expanded = true;
        return item;
    });

    var $treeView = initTree({
        items: data,
        dataStructure: "plain",
        keyExpr: "Id",
        displayExpr: "Name",
        parentIdExpr: "ParentId"
    });

    var $rootNode = $treeView.find("." + internals.NODE_CONTAINER_CLASS + ":first"),
        $rootNodeItems = $rootNode.find(" > ." + internals.NODE_CLASS);

    assert.equal($treeView.find("." + internals.NODE_CONTAINER_CLASS).length, 5);
    assert.equal($rootNodeItems.length, 2);
    assert.equal($rootNodeItems.eq(0).find("> ." + internals.ITEM_CLASS + " span").text(), "Animals");
    assert.equal($rootNodeItems.eq(1).find("> ." + internals.ITEM_CLASS + " span").text(), "Birds");
    assert.equal($rootNodeItems.eq(0).find("> ." + internals.NODE_CONTAINER_CLASS).find("> ." + internals.NODE_CLASS).length, 2);
    assert.equal($rootNodeItems.eq(1).find("> ." + internals.NODE_CONTAINER_CLASS).find("> ." + internals.NODE_CLASS).length, 1);
});

QUnit.test("Custom item template", function(assert) {
    var $treeView = initTree({
        items: $.extend(true, [], DATA[5]),
        itemTemplate: function(item) {
            return $("<strong />").text(item.text);
        }
    });

    var $rootNodeContainer = $treeView.find("." + internals.NODE_CONTAINER_CLASS + ":first"),
        $firstRootNode = $rootNodeContainer.find("li").first(),
        $firstItem = $firstRootNode.find("> ." + internals.ITEM_CLASS);

    assert.equal($firstItem.length, 1);
    assert.equal($firstItem.text(), "Item 1");
});

QUnit.test("scroll direction by default is 'vertical'", function(assert) {
    var treeView = initTree({
        items: $.extend(true, [], DATA[5]),
    }).dxTreeView("instance");

    assert.equal(treeView._scrollableContainer.option("direction"), "vertical");
});

QUnit.test("custom scroll direction", function(assert) {
    var treeView = initTree({
        items: $.extend(true, [], DATA[5]),
        scrollDirection: "both"
    }).dxTreeView("instance");

    assert.equal(treeView._scrollableContainer.option("direction"), "both");
});

QUnit.test("'getNodes' method", function(assert) {
    var treeView = initTree({
        items: [
            { id: 1, text: "Item 1" },
            {
                id: 2, text: "Item 2",
                items: [
                    { id: 3, text: "Nested item 1" },
                    { id: 4, text: "Nested item 2" }
                ]
            }
        ]
    }).dxTreeView("instance");

    var nodes = treeView.getNodes();

    assert.equal(nodes[0].itemData.id, 1);
    assert.equal(nodes[0].itemData.text, "Item 1");
    assert.equal(nodes[0].parent, null);

    assert.equal(nodes[1].itemData.id, 2);
    assert.equal(nodes[1].itemData.text, "Item 2");
    assert.equal(nodes[1].parent, null);
    assert.equal(nodes[1].children.length, 2);

    assert.equal(nodes[1].children[0].itemData.id, 3);
    assert.equal(nodes[1].children[0].itemData.text, "Nested item 1");
    assert.equal(nodes[1].children[0].parent.itemData.text, "Item 2");

    assert.equal(nodes[1].children[1].itemData.id, 4);
    assert.equal(nodes[1].children[1].itemData.text, "Nested item 2");
    assert.equal(nodes[1].children[1].parent.itemData.text, "Item 2");
});

QUnit.test("'getNodes' method with selectedItems", function(assert) {
    var treeView = initTree({
        items: [
            { id: 1, text: "Item 1" },
            {
                id: 2, text: "Item 2",
                items: [
                    { id: 3, text: "Nested item 1", selected: true },
                    { id: 4, text: "Nested item 2" }
                ]
            }
        ],
        showCheckBoxesMode: "normal"
    }).dxTreeView("instance");

    var nodes = treeView.getNodes();

    assert.equal(nodes[0].itemData.id, 1);
    assert.equal(nodes[0].itemData.text, "Item 1");
    assert.equal(nodes[0].parent, null);

    assert.equal(nodes[1].itemData.id, 2);
    assert.equal(nodes[1].itemData.text, "Item 2");
    assert.equal(nodes[1].parent, null);

    assert.ok(nodes[1].hasOwnProperty("selected"));
    assert.strictEqual(nodes[1].selected, undefined);
    assert.equal(nodes[1].children.length, 2);

    assert.equal(nodes[1].children[0].itemData.id, 3);
    assert.equal(nodes[1].children[0].itemData.text, "Nested item 1");
    assert.equal(nodes[1].children[0].parent.text, "Item 2");
    assert.strictEqual(nodes[1].children[0].selected, true);

    assert.equal(nodes[1].children[1].itemData.id, 4);
    assert.equal(nodes[1].children[1].itemData.text, "Nested item 2");
    assert.equal(nodes[1].children[1].parent.text, "Item 2");
});

QUnit.test("'getNodes' method should return right result when some item was selected", function(assert) {
    var $treeView = initTree({
        items: [
            { id: 1, text: "Item 1" },
            {
                id: 2, text: "Item 2", expanded: true,
                items: [
                    { id: 3, text: "Nested item 1" },
                    { id: 4, text: "Nested item 2" }
                ]
            }
        ],
        showCheckBoxesMode: "normal"
    });

    var treeView = $treeView.dxTreeView("instance"),
        $checkbox = $treeView.find(".dx-checkbox").eq(2);

    $checkbox.trigger("dxclick");

    var nodes = treeView.getNodes();

    assert.equal(nodes[0].itemData.id, 1);
    assert.equal(nodes[0].itemData.text, "Item 1");
    assert.equal(nodes[0].parent, null);

    assert.equal(nodes[1].itemData.id, 2);
    assert.equal(nodes[1].itemData.text, "Item 2");
    assert.equal(nodes[1].parent, null);

    assert.ok(nodes[1].hasOwnProperty("selected"));
    assert.strictEqual(nodes[1].selected, undefined);
    assert.equal(nodes[1].children.length, 2);

    assert.equal(nodes[1].children[0].itemData.id, 3);
    assert.equal(nodes[1].children[0].itemData.text, "Nested item 1");
    assert.equal(nodes[1].children[0].parent.text, "Item 2");
    assert.strictEqual(nodes[1].children[0].selected, true);

    assert.equal(nodes[1].children[1].itemData.id, 4);
    assert.equal(nodes[1].children[1].itemData.text, "Nested item 2");
    assert.equal(nodes[1].children[1].parent.text, "Item 2");
});

QUnit.test("'getNodes' method should return right result when selectAll was changed", function(assert) {
    var $treeView = initTree({
        items: [
            { id: 1, text: "Item 1" },
            {
                id: 2, text: "Item 2",
                items: [
                    { id: 3, text: "Nested item 1" },
                    {
                        id: 4, text: "Nested item 2", expanded: true,
                        items: [
                            { id: 5, text: "Nested item 3" }
                        ]
                    }
                ]
            }
        ],
        showCheckBoxesMode: "selectAll"
    });

    var $selectAllItem = $treeView.find(".dx-treeview-select-all-item"),
        treeView = $treeView.dxTreeView("instance"),
        nodes;

    $selectAllItem.trigger("dxclick");
    nodes = treeView.getNodes();

    assert.strictEqual(nodes[0].selected, true);
    assert.strictEqual(nodes[1].selected, true);
    assert.strictEqual(nodes[1].children[0].selected, true);
    assert.strictEqual(nodes[1].children[1].selected, true);
    assert.strictEqual(nodes[1].children[1].children[0].selected, true);

    $selectAllItem.trigger("dxclick");
    nodes = treeView.getNodes();

    assert.strictEqual(nodes[0].selected, false);
    assert.strictEqual(nodes[1].selected, false);
    assert.strictEqual(nodes[1].children[0].selected, false);
    assert.strictEqual(nodes[1].children[1].selected, false);
    assert.strictEqual(nodes[1].children[1].children[0].selected, false);
});

QUnit.test("'getNodes' method should return hierarchical structure if widget was initialized with plain data", function(assert) {
    var treeView = initTree({
        items: [
            { id: 1, text: "Item 1", parentId: 0 },
            { id: 2, text: "Item 2", parentId: 0 },
            { id: 3, text: "Item 2.1", parentId: 2 },
            { id: 4, text: "Item 2.2", parentId: 2 }
        ],
        dataStructure: "plain"
    }).dxTreeView("instance");

    var nodes = treeView.getNodes();

    assert.equal(nodes.length, 2);

    assert.ok(!nodes[0].children.length);
    assert.equal(nodes[0].itemData.text, "Item 1");

    assert.equal(nodes[1].itemData.text, "Item 2");
    assert.equal(nodes[1].items.length, 2);

    assert.equal(nodes[1].items[0].itemData.text, "Item 2.1");
    assert.equal(nodes[1].items[1].itemData.text, "Item 2.2");

    assert.equal(nodes[1].items[0].parent.itemData.text, "Item 2");
    assert.equal(nodes[1].items[1].parent.itemData.text, "Item 2");
});

QUnit.test("Render checkbox before itemRendered is fired", function(assert) {
    var i = 0,
        data = $.extend(true, [], DATA[5]);
    data[0].items[0].expanded = true;
    var $treeView = initTree({
        items: data,
        showCheckBoxesMode: "normal",
        onItemRendered: function(e) {
            i++;
            assert.equal(e.element.find("." + internals.NODE_CLASS).find(".dx-checkbox").length, i);
            assert.equal(e.element.find("." + internals.NODE_CLASS + "." + internals.ITEM_WITH_CHECKBOX_CLASS).length, i);
        }
    });

    assert.ok($treeView);
    assert.equal(i, 4, "itemRendered event is fired 3 times");

});

QUnit.test("Items change correct on option change", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].expanded = true;
    var $treeView = initTree({
            items: [{
                text: "item1",
                selected: true,
                expanded: true,
                items: [ { text: "item1-1" } ]
            }],
            showCheckBoxesMode: "normal"
        }),
        treeView = $treeView.dxTreeView("instance");

    assert.ok(treeView.option("items")[0].selected);
    assert.ok(treeView.option("items")[0].expanded);

    treeView.option("items", [{ text: "a" }, { text: "b" }]);

    assert.ok(!treeView.option("items")[0].selected);
    assert.ok(!treeView.option("items")[0].expanded);
});

QUnit.test("DataSource change correct on option change", function(assert) {
    var data = $.extend(true, [], DATA[5]);
    data[0].expanded = true;
    var $treeView = initTree({
            dataSource: [{
                text: "item1",
                selected: true,
                expanded: true,
                items: [{ text: "item1-1" }]
            }],
            showCheckBoxesMode: "normal"
        }),
        treeView = $treeView.dxTreeView("instance");

    assert.ok(treeView.option("items")[0].selected);
    assert.ok(treeView.option("items")[0].expanded);

    treeView.option("dataSource", [{ text: "a" }, { text: "b" }]);

    assert.ok(!treeView.option("items")[0].selected);
    assert.ok(!treeView.option("items")[0].expanded);
});

QUnit.test("showCheckBoxesMode option", function(assert) {
    var $treeView = initTree({
            items: [{ id: 1, html: "<b>Hello</b>" }]
        }),
        instance = $treeView.dxTreeView("instance");

    assert.notOk($treeView.find(".dx-checkbox").length, "there are no checkboxes");

    instance.option("showCheckBoxesMode", "selectAll");
    assert.ok($treeView.find(".dx-checkbox").length, "checkboxes was rendered");
    assert.ok($treeView.find(".dx-treeview-select-all-item").length, "selectAll item was rendered");

    instance.option("showCheckBoxesMode", "normal");
    assert.ok($treeView.find(".dx-checkbox").length, "checkboxes was rendered");
    assert.notOk($treeView.find(".dx-treeview-select-all-item").length, "selectAll item was not rendered");
});

QUnit.test("deprecated options selectAllEnabled and showCheckBoxes works correctly", function(assert) {
    var $treeView = initTree({
            items: [{ id: 1, html: "<b>Hello</b>" }],
            showCheckBoxes: true,
            selectAllEnabled: true
        }),
        instance = $treeView.dxTreeView("instance");

    assert.ok($treeView.find(".dx-checkbox").length, "checkboxes was rendered");
    assert.ok($treeView.find(".dx-treeview-select-all-item").length, "selectAll item was rendered");

    instance.option("selectAllEnabled", false);
    assert.ok($treeView.find(".dx-checkbox").length, "checkboxes was rendered");
    assert.notOk($treeView.find(".dx-treeview-select-all-item").length, "selectAll item was not rendered");

    instance.option("showCheckBoxes", false);
    assert.notOk($treeView.find(".dx-checkbox").length, "there are no checkboxes");
});

QUnit.test("Disabled class is added when disabledExpr is used", function(assert) {
    var $treeView = initTree({
            items: [{ id: 1, text: "item 1", isDisabled: true }],
            disabledExpr: "isDisabled"
        }),
        $item = $treeView.find(".dx-treeview-item").eq(0);

    assert.ok($item.hasClass("dx-state-disabled"));
});

QUnit.test("Disabled class is added when disabledExpr is used with custom template", function(assert) {
    var $treeView = initTree({
            items: [{ id: 1, text: "item 1", isDisabled: true }],
            disabledExpr: "isDisabled",
            itemTemplate: function() {
                return "123";
            }
        }),
        $item = $treeView.find(".dx-treeview-item").eq(0);

    assert.ok($item.hasClass("dx-state-disabled"));
});

QUnit.test("toggle visibility icon should not render for invisible item (T323491)", function(assert) {
    var $treeView = initTree({
            items: [
            { text: "item 1", visible: false, items: [{ text: "item 11" }] },
            { text: "item 1", items: [{ text: "item 21" }] }],
        }),
        $icons = $treeView.find(".dx-treeview-toggle-item-visibility");

    assert.equal($icons.length, 1, "only one icon should be rendered");
});

QUnit.test("Repaint treeView on every dataSource modified - insert", function(assert) {
    var store = new ArrayStore({
        key: "id",
        data: [{
            id: 1,
            text: "Item 1",
            parentId: 0
        }, {
            id: 2,
            text: "Item 2",
            parentId: 0
        }, {
            id: 4,
            text: "Item 2-1",
            parentId: 1
        }, {
            id: 5,
            text: "Item 2-2",
            parentId: 2
        }, {
            id: 3,
            text: "Item 1-1",
            parentId: 1
        }]
    });
    var dataSource = new DataSource({
        store: new CustomStore({
            load: function(options) {
                return store.load(options);
            },
            insert: function(values) {
                return store.insert(values);
            }
        })
    });

    var treeView = initTree({
            dataSource: dataSource,
            dataStructure: "plain"
        }).dxTreeView("instance"),
        toggleIcon = treeView.element().find("." + internals.TOGGLE_ITEM_VISIBILITY_CLASS).eq(1),
        items;

    dataSource.store().insert({
        id: 7,
        text: "Item 2-3",
        parentId: 2
    });

    toggleIcon.trigger("dxclick");
    items = treeView.element().find("." + internals.ITEM_CLASS);
    assert.equal(items.length, 4);

    dataSource.store().insert({
        id: 6,
        text: "Item 3",
        parentId: 0
    });

    items = treeView.element().find("." + internals.ITEM_CLASS);
    assert.equal(items.length, 5);

    treeView.option("searchValue", "Item 2");
    items = treeView.element().find("." + internals.ITEM_CLASS);
    assert.equal(items.length, 5);

    dataSource.store().insert({
        id: 8,
        text: "item 4",
        parentId: 0
    });

    items = treeView.element().find("." + internals.ITEM_CLASS);
    assert.equal(items.length, 5);
});

QUnit.test("Repaint treeView on every dataSource modified - remove", function(assert) {
    var store = new ArrayStore({
        key: "id",
        data: [{
            id: 1,
            text: "Item 1",
            parentId: 0
        }, {
            id: 2,
            text: "Item 2",
            parentId: 0
        }, {
            id: 3,
            text: "Item 1-1",
            parentId: 1
        }, {
            id: 4,
            text: "Item 2-1",
            parentId: 1
        }, {
            id: 5,
            text: "Item 2-2",
            parentId: 2
        }, {
            id: 6,
            text: "Item 1-1-1",
            parentId: 3
        }]
    });
    var dataSource = new DataSource({
        store: new CustomStore({
            load: function(options) {
                return store.load(options);
            },
            remove: function(key) {
                return store.remove(key);
            }
        })
    });

    var treeView = initTree({
            dataSource: dataSource,
            dataStructure: "plain"
        }).dxTreeView("instance"),
        toggleIcon = treeView.element().find("." + internals.TOGGLE_ITEM_VISIBILITY_CLASS),
        items;

    toggleIcon.eq(0).trigger("dxclick");

    toggleIcon.eq(1).trigger("dxclick");

    toggleIcon = treeView.element().find("." + internals.TOGGLE_ITEM_VISIBILITY_CLASS);
    toggleIcon.eq(1).trigger("dxclick");

    items = treeView.element().find("." + internals.ITEM_CLASS);
    assert.equal(items.length, 6);

    dataSource.store().remove(4);

    items = treeView.element().find("." + internals.ITEM_CLASS);
    assert.equal(items.length, 5);

    dataSource.store().remove(1);

    items = treeView.element().find("." + internals.ITEM_CLASS);
    assert.equal(items.length, 2);
    assert.equal(treeView.option("items").length, 2);
});

QUnit.test("TreeView should render correctly without items", function(assert) {
    var $treeView = initTree({
        items: undefined
    });

    assert.equal($treeView.find(".dx-empty-message").length, 1, "empty message should be shown");
});

QUnit.test("Dynamic dataSource filter should work correctly", function(assert) {
    var data = $.extend(true, [], DATA[4]),
        dataSource = new DataSource({
            store: data
        });

    var $treeView = initTree({
        dataStructure: "plain",
        keyExpr: "Id",
        displayExpr: "Name",
        parentIdExpr: "ParentId",
        dataSource: dataSource
    }).dxTreeView("instance");

    assert.equal($treeView.option("items").length, 8, "all items were loaded");

    dataSource.filter(['ParentId', '=', 3]);
    dataSource.load();
    assert.equal($treeView.option("items").length, 2, "only dog's children were loaded");

    dataSource.filter(['ParentId', '=', 12]);
    dataSource.load();
    assert.equal($treeView.option("items").length, 1, "only birds's children were loaded");
});

QUnit.test("TreeView with empty dataSource should updates after item inserted in the Store", function(assert) {
    var dataSource = new DataSource({
            store: new ArrayStore([])
        }),
        treeView = initTree({
            dataStructure: "plain",
            dataSource: dataSource
        }).dxTreeView("instance");

    dataSource.store().insert({
        id: 1,
        parentId: 0,
        text: "Item 1"
    });
    dataSource.load();

    assert.equal(treeView.option("items").length, 1, "item was inserted");
});
