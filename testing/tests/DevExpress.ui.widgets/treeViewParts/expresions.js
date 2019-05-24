import $ from "jquery";
import { TreeViewTestWrapper, TreeViewDataHelper } from "../../../helpers/TreeViewTestHelper.js";

let { module, test, skip } = QUnit;

const createInstance = (options) => new TreeViewTestWrapper(options);
const dataHelper = new TreeViewDataHelper();

module("Custom item template via expressions", () => {
    test("Render items with custom model", (assert) => {
        var data = $.extend(true, [], dataHelper.data[3]);
        data[0].children[0].expanded = true;

        const treeView = createInstance({
            items: data,
            keyExpr: "itemId",
            displayExpr: "itemName",
            itemsExpr: "children"
        });

        let $rootNode = treeView.getNodeContainers().eq(0),
            $rootNodeFirstItem = treeView.getNodesInNode($rootNode).eq(0),
            $rootNodeSecondItem = treeView.getNodesInNode($rootNode).eq(2);

        assert.equal(treeView.getItemsInNode($rootNodeFirstItem).eq(0).text(), "Item 1");
        assert.equal(treeView.getItemsInNode($rootNodeSecondItem).text(), "Item 2");
        assert.equal(treeView.getItemsInNode($rootNodeFirstItem).eq(1).text(), "Nested Item 1");
    });

    // TODO: fix
    skip("T202554: dxTreeView - The selectedExpr option does not link the checkbox to a data source item", (assert) => {
        const treeView = createInstance({
            items: [
                { Id: 1, ParentId: 0, Name: "Item 1", expanded: true },
                { Id: 2, ParentId: 1, Name: "Item 2", isSelected: true },
                { Id: 3, ParentId: 1, Name: "Item 3" }
            ],
            displayExpr: "Name",
            keyExpr: "Id",
            parentIdExpr: "ParentId",
            selectedExpr: () => "isSelected",
            dataStructure: "plain",
            showCheckboxesMode: "normal"
        });

        treeView.checkCheckBoxesState([undefined, true, false]);
    });

    test("Expressions should be reinitialized if *expr option was changed", (assert) => {
        const treeView = createInstance({
            items: [
                {
                    Key: 1,
                    Id: 2,

                    Expanded: true,
                    Opened: false,

                    ParentId: 0,
                    RootId: 1
                }
            ],
            keyExpr: "Key",
            expandedExpr: "Expanded",
            parentIdExpr: "ParentId"
        });

        let item = treeView.instance.option("items")[0];

        treeView.instance.option("keyExpr", "Id");
        assert.equal(treeView.instance._keyGetter(item), 2);

        treeView.instance.option("expandedExpr", "Opened");
        assert.equal(treeView.instance._expandedGetter(item), false);

        treeView.instance.option("parentIdExpr", "RootId");
        assert.equal(treeView.instance._parentIdGetter(item), 1);
    });

    test("displayExpr should be updated correctly in runtime", (assert) => {
        const treeView = createInstance({
            items: [
                { text: "John", lastName: "Smith" }
            ]
        });
        assert.equal(treeView.getItems().text(), "John");

        treeView.instance.option("displayExpr", "lastName");
        assert.equal(treeView.getItems().text(), "Smith");
    });

    test("VirtualMode: Only root nodes should be rendered in virtualMode with parentIdExpr", (assert) => {
        const treeView = createInstance({
            dataSource: dataHelper.dataID,
            parentIdExpr: "elternId",
            dataStructure: "plain",
            virtualModeEnabled: true
        });
        assert.equal(treeView.getItems().length, 2);
    });

});
