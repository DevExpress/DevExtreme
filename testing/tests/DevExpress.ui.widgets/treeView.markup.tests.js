import $ from "jquery";
import { TreeViewTestWrapper, TreeViewDataHelper } from "../../helpers/TreeViewTestHelper.js";

let { module, test, testStart } = QUnit;

const createInstance = (options) => new TreeViewTestWrapper(options);
const dataHelper = new TreeViewDataHelper();

testStart(function() {
    const markup = '<div id="treeView"></div>';

    $("#qunit-fixture").html(markup);
});

import "ui/tree_view";

let treeView;

module("aria accessibility", {
    beforeEach() {
        treeView = createInstance({
            animationEnabled: false,
            items: [
                { id: 1, text: "Item 1", selected: true, expanded: true, items: [{ id: 3, text: "Item 11" }, { id: 4, text: "Item 12" }] },
                { id: 2, text: "Item 2", expanded: false }
            ],
            selectNodesRecursive: true,
            showCheckBoxesMode: "normal"
        });
    }
}, () => {
    test("aria role", (assert) => {
        assert.equal(treeView.getElement().attr("role"), "tree", "role is correct");
    });

    test("aria role for items", (assert) => {
        assert.equal(treeView.getNodes().attr("role"), "treeitem", "role is correct");
    });

    test("aria label for items", (assert) => {
        assert.equal(treeView.getNodes(0).attr("aria-label"), "Item 1", "label for 1st item is correct");
        assert.equal(treeView.getNodes(1).attr("aria-label"), "Item 11", "label for 2nd ite is correct");
    });

    test("aria role for item levels", (assert) => {
        assert.equal(treeView.getNodeContainers().attr("role"), "group", "role is correct");
    });

    test("aria expanded for items", (assert) => {
        assert.equal(treeView.getNodes(0).attr("aria-expanded"), "true", "expanded item has aria-expanded as true");
    });

    test("aria level for items", (assert) => {
        assert.equal(treeView.getNodes(0).attr("aria-level"), "1", "level set correct");
        assert.equal(treeView.getNodes(1).attr("aria-level"), "2", "level set correct");
    });

    test("aria selected for items", (assert) => {
        assert.equal(treeView.getNodes(0).attr("aria-selected"), "true", "item is selected");
    });
});


module("markup", () => {
    test("TreeView should render correctly without items", (assert) => {
        const treeView = createInstance({ items: undefined });

        assert.equal(treeView.findEmptyMessageClass(treeView.getScrollableContent()).length, 1, "empty message should be shown inside scrollable content");
    });

    test("data expressions should work on render", (assert) => {
        const treeView = createInstance({
            items: [
                { Id: 2, Expanded: false, Opened: true, parent: 0, Text: "I1", Selected: false, Checked: true, Caption: "Item 1" },
                { Id: 21, Opened: false, parent: 2, Caption: "Item 11" }
            ],
            dataStructure: "plain",
            keyExpr: "Id",
            selectedExpr: "Checked",
            displayExpr: "Caption",
            expandedExpr: "Opened",
            parentIdExpr: "parent"
        });
        let $node = treeView.getNodes(0),
            $nodeContainer = treeView.getNodeContainersInNode($node, 0);

        assert.equal($node.data("item-id"), "2", "keyExpr works");
        assert.equal(treeView.getItemsInNode($node).eq(0).text(), "Item 1", "displayExpr works");
        assert.ok(treeView.hasSelectedClass($node), "selectedExpr works");
        assert.ok(treeView.isNodeContainerOpened($nodeContainer), "expandedExpr works");
        assert.equal(treeView.getNodesInNode($node).length, 1, "parentIdExpr works");
    });

    test("TreeView should has a right class", (assert) => {
        const treeView = createInstance();
        assert.ok(treeView.hasWidgetClass());
    });

    test("Render scrollable container", (assert) => {
        const treeView = createInstance({
            items: dataHelper.treeItems,
            keyExpr: "key"
        });

        assert.ok(treeView.getNodeContainers().eq(0).parent().hasClass("dx-scrollable-content"));
        assert.ok(treeView.getScrollable().length, 1);
    });

    test("Render items container", (assert) => {
        const treeView = createInstance({ items: [{ key: 1, text: "Item" }] });
        assert.equal(treeView.getNodes().length, 1);
    });

    test("Render html item", (assert) => {
        const treeView = createInstance({ items: [{ id: 1, html: "<b>Hello</b>" }] });
        assert.equal(treeView.getItems(0).text(), "Hello", "created");
    });

    test("Render first level items", (assert) => {
        const treeView = createInstance({ items: dataHelper.plainItems, keyExpr: "key" });
        const $items = treeView.getItems();

        assert.equal($items.length, 16);
        assert.equal($($items[0]).find("span").text(), "Animals");
        assert.equal($($items[1]).find("span").text(), "Cat");
        assert.equal($($items[2]).find("span").text(), "Dog");
    });

    test("Render items with parentId set as tree", (assert) => {
        const treeView = createInstance({ items: dataHelper.plainItems, dataStructure: "tree" });
        assert.equal(treeView.getItems().length, 16);
    });

    test("Render nested items", (assert) => {
        let data = dataHelper.treeItems;
        data[0].items[1].items[0].expanded = true;
        const treeView = createInstance({ items: data, keyExpr: "key" });

        var $firstNode = treeView.getNodeContainers().children().eq(0),
            $secondNode = treeView.getNodeContainers().children().eq(2),
            $nestedNode = treeView.getNodeContainers().eq(1);

        assert.ok(!treeView.isNodeLeaf($firstNode));
        assert.ok(treeView.isNodeLeaf($secondNode));
        assert.ok(treeView.hasWithoutCheckBoxClass($firstNode));
        assert.ok($nestedNode.length);
        assert.ok(treeView.isNodeLeaf(treeView.getNodesInNode($nestedNode).eq(0)));
        assert.ok(!treeView.isNodeLeaf(treeView.getNodesInNode($nestedNode).eq(1)));
        assert.ok(!treeView.getNodeContainersInNode(treeView.getNodesInNode($nestedNode).eq(0)).length);

        let $node = treeView.getNodesInNode($nestedNode).eq(1);
        assert.ok(treeView.getNodeContainersInNode($node).length);
        assert.ok(treeView.hasWithoutCheckBoxClass(treeView.getNodesInNode($node)));
    });

    test("Render toggle icon", (assert) => {
        const treeView = createInstance({ items: dataHelper.treeItems });

        let $rootNode = treeView.getNodeContainers().eq(0),
            $firstNode = $rootNode.children().eq(0),
            $secondNode = $rootNode.children().eq(1);

        assert.ok(treeView.getToggleItemVisibilityInNode($firstNode).length > 0);
        assert.ok(treeView.getToggleItemVisibilityInNode($secondNode).length === 0);
    });

    test("Add disabled class for toggle icon if item is disabled", (assert) => {
        const treeView = createInstance({
            items: [{ id: 1, text: "one", disabled: true, items: [{ id: 11, text: "Nested 1" }, { id: 12, text: "Nested 2" }] }]
        });

        let $rootNode = treeView.getNodeContainers().eq(0).children(),
            $icon = treeView.getToggleItemVisibilityInNode($rootNode).eq(0);

        assert.ok($icon.hasClass("dx-state-disabled"));
    });

    test("Render checkboxes", (assert) => {
        let data = dataHelper.treeItems;
        data[0].items[0].expanded = true;
        const treeView = createInstance({ items: data, showCheckBoxesMode: "normal" });

        assert.ok(treeView.getNodesWithCheckBoxes().length >= 4);
        assert.ok(treeView.getItemsWithCheckBoxes().length >= 4);
    });

    test("Render tree by id/parentId fields", (assert) => {
        let data = dataHelper.plainItems;
        $.map(data, item => item.expanded = true);

        const treeView = createInstance({
            items: data,
            dataStructure: "plain",
            keyExpr: "id",
            parentIdExpr: "parentId"
        });
        let $rootNodeItems = treeView.getNodeContainers().eq(0).children();

        assert.equal(treeView.getNodeContainers().length, 5);
        assert.equal($rootNodeItems.length, 3);
        assert.equal($rootNodeItems.eq(0)[0].firstChild.innerText, "Animals");
        assert.equal($rootNodeItems.eq(1)[0].firstChild.innerText, "Birds");
        assert.equal($rootNodeItems.eq(0)[0].childNodes.length, 3);
        assert.equal($rootNodeItems.eq(1)[0].childNodes.length, 3);
    });

    test("Custom item template", (assert) => {
        const treeView = createInstance({
            items: dataHelper.treeItems,
            itemTemplate: (item) => $("<strong />").text(item.text)
        });

        var $rootNodeContainer = treeView.getNodeContainers().eq(0).children(),
            $firstItem = treeView.getItemsInNode($rootNodeContainer).eq(0);

        assert.equal($firstItem.length, 1);
        assert.equal($firstItem.text(), "Item 1");
    });

    test("scroll direction by default is 'vertical'", (assert) => {
        const treeView = createInstance({ items: dataHelper.treeItems });

        assert.equal(treeView.instance._scrollableContainer.option("direction"), "vertical");
    });

    test("custom scroll direction", (assert) => {
        const treeView = createInstance({
            items: dataHelper.treeItems,
            scrollDirection: "both"
        });

        assert.equal(treeView.instance._scrollableContainer.option("direction"), "both");
    });

    test("Disabled class is added when disabledExpr is used", (assert) => {
        const treeView = createInstance({
            items: [{ id: 1, text: "item 1", isDisabled: true }],
            disabledExpr: "isDisabled"
        });

        assert.ok(treeView.isDisabled(treeView.getItems(0)));
    });

    test("Disabled class is added when disabledExpr is used with custom template", (assert) => {
        const treeView = createInstance({
            items: [{ id: 1, text: "item 1", isDisabled: true }],
            disabledExpr: "isDisabled",
            itemTemplate: () => "123"
        });

        assert.ok(treeView.isDisabled(treeView.getItems(0)));
    });

    test("toggle visibility icon should not render for invisible item (T323491)", (assert) => {
        const treeView = createInstance({
            items: [
                { text: "item 1", visible: false, items: [{ text: "item 11" }] },
                { text: "item 1", items: [{ text: "item 21" }] }
            ]
        });

        assert.equal(treeView.getToggleItemVisibility().length, 1, "only one icon should be rendered");
    });

    test("Render Search editor", (assert) => {
        const treeView = createInstance({
            items: dataHelper.treeItems,
            searchEnabled: true,
            searchValue: "2"
        });

        let $searchEditor = treeView.getElement().children().first();
        assert.ok(treeView.isSearch($searchEditor), "has search editor");
        assert.strictEqual($searchEditor.dxTextBox("instance").option("value"), "2", "editor value");
    });

    test("treeView consider store sorting", (assert) => {
        const data = [
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
        ];
        const treeView = createInstance({
            dataSource: { store: data, sort: "text" },
            dataStructure: "plain",
            parentIdExpr: "parentId",
            keyExpr: "id"
        });
        const expectedValues = ["Bikes", "Stels", "Cars", "Audi", "BMW", "Motobikes", "Honda", "Yamaha"];

        $.each(treeView.getItems(), (index, item) => { assert.equal($(item).text(), expectedValues[index], "Correct item"); });
    });

    test("Render 'selectAll' item", (assert) => {
        const treeView = createInstance({
            showCheckBoxesMode: "selectAll",
            dataSource: dataHelper.treeItems
        });
        assert.equal(treeView.getSelectAllItem().length, 1);
    });

    test("On initialization 'selectAll' item should be selected if all items are selected", (assert) => {
        const data = [{ id: 1, text: "item 1", selected: true }, { id: 2, text: "item 2", selected: true }];
        const treeView = createInstance({
            showCheckBoxesMode: "selectAll",
            dataSource: data
        });
        assert.ok(treeView.hasCheckBoxCheckedClass(treeView.getSelectAllItem()));
    });

    test("On initialization 'selectAll' item should be unselected if all items are unselected", (assert) => {
        const data = [{ id: 1, text: "item 1" }, { id: 2, text: "item 2" }];
        const treeView = createInstance({
            showCheckBoxesMode: "selectAll",
            dataSource: data
        });
        assert.notOk(treeView.hasCheckBoxIndeterminateClass(treeView.getSelectAllItem()));
        assert.notOk(treeView.hasCheckBoxCheckedClass(treeView.getSelectAllItem()));
    });

    test("On initialization 'selectAll' item should have intermediate state if at least one item is selected", (assert) => {
        const data = [{ id: 1, text: "item 1", selected: true }, { id: 2, text: "item 2" }];
        const treeView = createInstance({
            showCheckBoxesMode: "selectAll",
            dataSource: data
        });
        assert.ok(treeView.hasCheckBoxIndeterminateClass(treeView.getSelectAllItem()));
    });

    test("On initialization 'selectAll' item should have intermediate state if at least one item is selected (ierarchical)", (assert) => {
        const data = [{ id: "1", expanded: true, items: [{ id: "1_1", selected: true }, { id: "1_2", selected: false }] }];
        const treeView = createInstance({
            showCheckBoxesMode: "selectAll",
            dataSource: data
        });
        assert.ok(treeView.hasCheckBoxIndeterminateClass(treeView.getSelectAllItem()));
    });
});
