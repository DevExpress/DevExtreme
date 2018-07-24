"use strict";

var $ = require("jquery");

QUnit.testStart(function() {
    var markup =
        '<div id="treeView"></div>';

    $("#qunit-fixture").html(markup);
});

require("ui/tree_view");

var WIDGET_CLASS = "dx-treeview",
    NODE_CONTAINER_CLASS = "dx-treeview-node-container",
    OPENED_NODE_CONTAINER_CLASS = "dx-treeview-node-container-opened",
    NODE_CLASS = "dx-treeview-node",
    ITEM_CLASS = "dx-treeview-item",
    SELECTED_STATE_CLASS = "dx-state-selected",
    ITEM_WITH_CHECKBOX_CLASS = "dx-treeview-item-with-checkbox",
    ITEM_WITHOUT_CHECKBOX_CLASS = "dx-treeview-item-without-checkbox",
    IS_LEAF = "dx-treeview-node-is-leaf",
    TOGGLE_ITEM_VISIBILITY_CLASS = "dx-treeview-toggle-item-visibility",
    SELECT_ALL_ITEM_CLASS = "dx-treeview-select-all-item";

var initTree = function(options) {
    return $("#treeView").dxTreeView(options);
};

QUnit.module("aria accessibility", {
    beforeEach: function() {
        this.$element = initTree({
            animationEnabled: false,
            items: [{
                id: 1,
                text: "Item 1",
                selected: true,
                expanded: true,
                items: [{ id: 3, text: "Item 11" }, { id: 4, text: "Item 12" }]
            }, { id: 2, text: "Item 2", expanded: false }],
            selectNodesRecursive: true,
            showCheckBoxesMode: "normal"
        });

        this.instance = this.$element.dxTreeView("instance");
    },

    afterEach: function() {
        this.$treeView = undefined;
        this.instance = undefined;
    }
});

QUnit.test("aria role", function(assert) {
    assert.equal(this.$element.attr("role"), "tree", "role is correct");
});

QUnit.test("aria role for items", function(assert) {
    var $node = this.$element.find("." + NODE_CLASS);
    assert.equal($node.attr("role"), "treeitem", "role is correct");
});

QUnit.test("aria label for items", function(assert) {
    var $node1 = this.$element.find("." + NODE_CLASS).eq(0),
        $node2 = this.$element.find("." + NODE_CLASS).eq(1);

    assert.equal($node1.attr("aria-label"), "Item 1", "label for 1st item is correct");
    assert.equal($node2.attr("aria-label"), "Item 11", "label for 2nd ite is correct");
});

QUnit.test("aria role for item levels", function(assert) {
    var $node = this.$element.find("." + NODE_CONTAINER_CLASS);
    assert.equal($node.attr("role"), "group", "role is correct");
});

QUnit.test("aria expanded for items", function(assert) {
    var $node = this.$element.find("." + NODE_CLASS).eq(0);

    assert.equal($node.attr("aria-expanded"), "true", "expanded item has aria-expanded as true");
});

QUnit.test("aria level for items", function(assert) {
    var $node1 = this.$element.find("." + NODE_CLASS).eq(0),
        $node2 = this.$element.find("." + NODE_CLASS).eq(1);

    assert.equal($node1.attr("aria-level"), "1", "level set correct");
    assert.equal($node2.attr("aria-level"), "2", "level set correct");
});

QUnit.test("aria selected for items", function(assert) {
    var $node = this.$element.find("." + NODE_CLASS).eq(0);

    assert.equal($node.attr("aria-selected"), "true", "item is selected");
});

QUnit.module("markup", {
    beforeEach: function() {
        this.plainItems = [
            { id: 1, parentId: 0, text: "Animals" },
            { id: 2, parentId: 1, text: "Cat" },
            { id: 3, parentId: 1, text: "Dog" },
            { id: 4, parentId: 1, text: "Cow" },
            { id: 5, parentId: 2, text: "Abyssinian" },
            { id: 6, parentId: 2, text: "Aegean cat" },
            { id: 7, parentId: 2, text: "Australian Mist" },
            { id: 8, parentId: 3, text: "Affenpinscher" },
            { id: 9, parentId: 3, text: "Afghan Hound" },
            { id: 10, parentId: 3, text: "Airedale Terrier" },
            { id: 11, parentId: 3, text: "Akita Inu" },
            { id: 12, parentId: 0, text: "Birds" },
            { id: 13, parentId: 12, text: "Akekee" },
            { id: 14, parentId: 12, text: "Arizona Woodpecker" },
            { id: 15, parentId: 12, text: "Black-chinned Sparrow" },
            { id: 16, parentId: 0, text: "Others" }
        ];
        this.treeItems = [
            {
                key: 1, text: "Item 1", items: [
                    { key: 12, text: "Nested item 1" },
                    {
                        key: 13, text: "Nested item 2", items: [
                            { key: 131, text: "Last item" }
                        ]
                    }
                ]
            },
            { key: 2, text: "Item 2" }
        ];
    }
});

QUnit.test("TreeView should render correctly without items", function(assert) {
    var $treeView = initTree({
            items: undefined
        }),
        $scrollableContent = $treeView.find(".dx-scrollable-content");

    assert.equal($scrollableContent.find(".dx-empty-message").length, 1, "empty message should be shown inside scrollable content");
});

QUnit.test("data expressions should work on render", function(assert) {
    var $treeView = $("#treeView").dxTreeView({
        items: [
            {
                Id: 2,
                Expanded: false,
                Opened: true,
                parent: 0,
                Text: "I1",
                Selected: false,
                Checked: true,
                Caption: "Item 1"
            },
            {
                Id: 21,
                Opened: false,
                parent: 2,
                Caption: "Item 11"
            }
        ],
        dataStructure: "plain",
        keyExpr: "Id",
        selectedExpr: "Checked",
        displayExpr: "Caption",
        expandedExpr: "Opened",
        parentIdExpr: "parent"
    });

    var $node = $treeView.find("." + NODE_CLASS).eq(0),
        $nodeContainer = $node.children("." + NODE_CONTAINER_CLASS).eq(0),
        $item = $node.children("." + ITEM_CLASS).eq(0);

    assert.equal($node.data("item-id"), "2", "keyExpr works");
    assert.equal($item.text(), "Item 1", "displayExpr works");
    assert.ok($node.hasClass(SELECTED_STATE_CLASS), "selectedExpr works");
    assert.ok($nodeContainer.hasClass(OPENED_NODE_CONTAINER_CLASS), "expandedExpr works");
    assert.equal($node.find("." + NODE_CLASS).length, 1, "parentIdExpr works");
});

QUnit.test("TreeView should has a right class", function(assert) {
    var $treeView = initTree();
    assert.ok($treeView.hasClass(WIDGET_CLASS));
});

QUnit.test("Render scrollable container", function(assert) {
    var $treeView = initTree({
            items: this.treeItems,
            keyExpr: "key"
        }),
        $rootNode = $treeView.find("." + NODE_CONTAINER_CLASS + ":first");

    assert.ok($rootNode.parent().hasClass("dx-scrollable-content"));
    assert.ok($treeView.find(".dx-scrollable").length, 1);
});

QUnit.test("Render items container", function(assert) {
    var $treeView = initTree({
        items: [{ key: 1, text: "Item" }]
    });
    assert.equal($treeView.find("." + NODE_CONTAINER_CLASS).length, 1);
});

QUnit.test("Render html item", function(assert) {
    var $treeView = initTree({
            items: [{ id: 1, html: "<b>Hello</b>" }]
        }),
        $itemContainer = $treeView.find("." + NODE_CONTAINER_CLASS),
        $node = $itemContainer.find("." + NODE_CLASS).eq(0),
        $item = $node.find("." + ITEM_CLASS);

    assert.equal($item.text(), "Hello", "created");
});

QUnit.test("Render first level items", function(assert) {
    var $treeView = initTree({
        items: this.plainItems,
        keyExpr: "key"
    });
    var $itemContainer = $treeView.find("." + NODE_CONTAINER_CLASS),
        $nodes = $itemContainer.find("." + NODE_CLASS),
        $items = $nodes.find("." + ITEM_CLASS);

    assert.equal($items.length, 16);
    assert.equal($($items[0]).find("span").text(), "Animals");
    assert.equal($($items[1]).find("span").text(), "Cat");
    assert.equal($($items[2]).find("span").text(), "Dog");
});

QUnit.test("Render items with parentId set as tree", function(assert) {
    var $treeView = initTree({
        items: this.plainItems,
        dataStructure: "tree"
    });
    var $items = $treeView.find("." + ITEM_CLASS);

    assert.equal($items.length, 16);
});

QUnit.test("Render nested items", function(assert) {
    var data = this.treeItems;
    data[0].items[1].items[0].expanded = true;
    var $treeView = initTree({
        items: data,
        keyExpr: "key"
    });

    var $rootNode = $treeView.find("." + NODE_CONTAINER_CLASS + ":first-child"),
        $rootNodeFirstItem = $rootNode.find("." + NODE_CLASS).eq(0),
        $rootNodeSecondItem = $rootNode.find("." + NODE_CLASS).eq(1),
        $firstNestedNode = $rootNodeFirstItem.find("> ." + NODE_CONTAINER_CLASS);

    assert.ok(!$rootNodeFirstItem.hasClass(IS_LEAF));
    assert.ok($rootNodeSecondItem.hasClass(IS_LEAF));
    assert.ok($rootNodeFirstItem.hasClass(ITEM_WITHOUT_CHECKBOX_CLASS));
    assert.ok($firstNestedNode.length);
    assert.ok($firstNestedNode.find("." + NODE_CLASS).eq(0).hasClass(IS_LEAF));
    assert.ok(!$firstNestedNode.find("." + NODE_CLASS).eq(1).hasClass(IS_LEAF));
    assert.ok(!$firstNestedNode.find("." + NODE_CLASS).eq(0).find("." + NODE_CONTAINER_CLASS).length);
    assert.ok($firstNestedNode.find("." + NODE_CLASS).eq(1).find("." + NODE_CONTAINER_CLASS).length);
    assert.ok($firstNestedNode.find("." + NODE_CLASS).eq(1).find("." + NODE_CLASS).hasClass(ITEM_WITHOUT_CHECKBOX_CLASS));
});

QUnit.test("Render toggle icon", function(assert) {
    var $treeView = initTree({
        items: this.treeItems,
    });

    var $rootNode = $treeView.find("." + NODE_CONTAINER_CLASS + ":first-child"),
        $rootNodeFirstItem = $rootNode.find("." + NODE_CLASS).eq(0),
        $rootNodeSecondItem = $rootNode.find("." + NODE_CLASS).eq(1);

    assert.equal($rootNodeFirstItem.find("." + TOGGLE_ITEM_VISIBILITY_CLASS).length, 1);
    assert.equal($rootNodeSecondItem.find("." + TOGGLE_ITEM_VISIBILITY_CLASS).length, 0);
});

QUnit.test("Add disabled class for toggle icon if item is disabled", function(assert) {
    var $treeView = initTree({
        items: [{
            id: 1,
            text: "one",
            disabled: true,
            items: [{ id: 11, text: "Nested 1" }, { id: 12, text: "Nested 2" }]
        }]
    });

    var $rootNode = $treeView.find("." + NODE_CONTAINER_CLASS + ":first-child"),
        $icon = $rootNode.find("." + NODE_CLASS).eq(0).children("." + TOGGLE_ITEM_VISIBILITY_CLASS).eq(0);

    assert.ok($icon.hasClass("dx-state-disabled"));
});

QUnit.test("Render checkboxes", function(assert) {
    var data = this.treeItems;
    data[0].items[0].expanded = true;
    var $treeView = initTree({
        items: data,
        showCheckBoxesMode: "normal"
    });

    assert.equal($treeView.find("." + NODE_CLASS).find(".dx-checkbox").length, 4);
    assert.equal($treeView.find("." + NODE_CLASS + "." + ITEM_WITH_CHECKBOX_CLASS).length, 4);
});

QUnit.test("Render tree by id/parentId fields", function(assert) {
    var data = this.plainItems;
    data = $.map(data, function(item) {
        item.expanded = true;
        return item;
    });

    var $treeView = initTree({
        items: data,
        dataStructure: "plain",
        keyExpr: "id",
        parentIdExpr: "parentId"
    });

    var $rootNode = $treeView.find("." + NODE_CONTAINER_CLASS + ":first"),
        $rootNodeItems = $rootNode.find(" > ." + NODE_CLASS);

    assert.equal($treeView.find("." + NODE_CONTAINER_CLASS).length, 5);
    assert.equal($rootNodeItems.length, 3);
    assert.equal($rootNodeItems.eq(0).find("> ." + ITEM_CLASS + " span").text(), "Animals");
    assert.equal($rootNodeItems.eq(1).find("> ." + ITEM_CLASS + " span").text(), "Birds");
    assert.equal($rootNodeItems.eq(0).find("> ." + NODE_CONTAINER_CLASS).find("> ." + NODE_CLASS).length, 3);
    assert.equal($rootNodeItems.eq(1).find("> ." + NODE_CONTAINER_CLASS).find("> ." + NODE_CLASS).length, 3);
});

QUnit.test("Custom item template", function(assert) {
    var $treeView = initTree({
        items: this.treeItems,
        itemTemplate: function(item) {
            return $("<strong />").text(item.text);
        }
    });

    var $rootNodeContainer = $treeView.find("." + NODE_CONTAINER_CLASS + ":first"),
        $firstRootNode = $rootNodeContainer.find("li").first(),
        $firstItem = $firstRootNode.find("> ." + ITEM_CLASS);

    assert.equal($firstItem.length, 1);
    assert.equal($firstItem.text(), "Item 1");
});

QUnit.test("scroll direction by default is 'vertical'", function(assert) {
    var treeView = initTree({
        items: this.treeItems,
    }).dxTreeView("instance");

    assert.equal(treeView._scrollableContainer.option("direction"), "vertical");
});

QUnit.test("custom scroll direction", function(assert) {
    var treeView = initTree({
        items: this.treeItems,
        scrollDirection: "both"
    }).dxTreeView("instance");

    assert.equal(treeView._scrollableContainer.option("direction"), "both");
});

QUnit.test("Disabled class is added when disabledExpr is used", function(assert) {
    var $treeView = initTree({
            items: [{ id: 1, text: "item 1", isDisabled: true }],
            disabledExpr: "isDisabled"
        }),
        $item = $treeView.find("." + ITEM_CLASS).eq(0);

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
        $item = $treeView.find("." + ITEM_CLASS).eq(0);

    assert.ok($item.hasClass("dx-state-disabled"));
});

QUnit.test("toggle visibility icon should not render for invisible item (T323491)", function(assert) {
    var $treeView = initTree({
            items: [
                { text: "item 1", visible: false, items: [{ text: "item 11" }] },
                { text: "item 1", items: [{ text: "item 21" }] }],
        }),
        $icons = $treeView.find("." + TOGGLE_ITEM_VISIBILITY_CLASS);

    assert.equal($icons.length, 1, "only one icon should be rendered");
});

QUnit.test("Render Search editor", function(assert) {
    var $searchEditor,
        $treeView = initTree({
            items: this.treeItems,
            searchEnabled: true,
            searchValue: "2"
        });

    $searchEditor = $treeView.children().first();
    assert.ok($searchEditor.hasClass("dx-treeview-search"), "has search editor");
    assert.strictEqual($searchEditor.dxTextBox("instance").option("value"), "2", "editor value");
});

QUnit.test("treeView consider store sorting", function(assert) {
    var data = [
            { id: 1, parentId: 0, text: "Bikes", expanded: true },
            { id: 4, parentId: 3, text: "BMW" },
            { id: 13, parentId: 3, text: "Audi" },
            { id: 3, parentId: 0, text: "Cars", expanded: true },
            { id: 11, parentId: 10, text: "YX 1" },
            { id: 12, parentId: 10, text: "YX 2" },
            { id: 14, parentId: 13, text: "A1" },
            { id: 15, parentId: 13, text: "A5" },
            { id: 2, parentId: 0, text: "Motobikes", expanded: true },
            { id: 5, parentId: 4, text: "X1" },
            { id: 6, parentId: 4, text: "X5" },
            { id: 7, parentId: 4, text: "X6" },
            { id: 10, parentId: 2, text: "Yamaha" },
            { id: 8, parentId: 1, text: "Stels" },
            { id: 9, parentId: 2, text: "Honda" }
        ],
        treeView = initTree({
            dataSource: { store: data, sort: "text" },
            dataStructure: "plain",
            parentIdExpr: "parentId",
            keyExpr: "id"
        }).dxTreeView("instance"),
        $items = $(treeView.$element()).find(".dx-treeview-item"),
        expectedValues = ["Bikes", "Stels", "Cars", "Audi", "BMW", "Motobikes", "Honda", "Yamaha"];

    $.each($items, function(index, item) {
        assert.equal($(item).text(), expectedValues[index], "Correct item");
    });
});

QUnit.test("Render 'selectAll' item", function(assert) {
    var $treeView = initTree({
            showCheckBoxesMode: "selectAll",
            dataSource: this.treeItems
        }),
        $selectAll = $treeView.find("." + SELECT_ALL_ITEM_CLASS);

    assert.equal($selectAll.length, 1);
});

QUnit.test("On initialization 'selectAll' item should be selected if all items are selected", function(assert) {
    var data = [{ id: 1, text: "item 1", selected: true }, { id: 2, text: "item 2", selected: true }],
        $treeView = initTree({
            showCheckBoxesMode: "selectAll",
            dataSource: data
        }),
        $selectAll = $treeView.find("." + SELECT_ALL_ITEM_CLASS);

    assert.ok($selectAll.hasClass("dx-checkbox-checked"));
});

QUnit.test("On initialization 'selectAll' item should be unselected if all items are unselected", function(assert) {
    var data = [{ id: 1, text: "item 1" }, { id: 2, text: "item 2" }],
        $treeView = initTree({
            showCheckBoxesMode: "selectAll",
            dataSource: data
        }),
        $selectAll = $treeView.find("." + SELECT_ALL_ITEM_CLASS);

    assert.notOk($selectAll.hasClass("dx-checkbox-indeterminate"));
    assert.notOk($selectAll.hasClass("dx-checkbox-checked"));
});

QUnit.test("On initialization 'selectAll' item should have intermediate state if at least one item is selected", function(assert) {
    var data = [{ id: 1, text: "item 1", selected: true }, { id: 2, text: "item 2" }],
        $treeView = initTree({
            showCheckBoxesMode: "selectAll",
            dataSource: data
        }),
        $selectAll = $treeView.find("." + SELECT_ALL_ITEM_CLASS);

    assert.ok($selectAll.hasClass("dx-checkbox-indeterminate"));
});

QUnit.test("On initialization 'selectAll' item should have intermediate state if at least one item is selected (ierarchical)", function(assert) {
    var data = [{
            id: "1",
            expanded: true,
            items: [{
                id: "1_1",
                selected: true
            }, {
                id: "1_2",
                selected: false
            }]
        }],
        $treeView = initTree({
            showCheckBoxesMode: "selectAll",
            dataSource: data
        }),
        $selectAll = $treeView.find("." + SELECT_ALL_ITEM_CLASS);

    assert.ok($selectAll.hasClass("dx-checkbox-indeterminate"));
});
