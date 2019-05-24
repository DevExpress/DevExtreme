import { TreeViewTestWrapper } from "../../../helpers/TreeViewTestHelper.js";

const { module, test } = QUnit;
const createInstance = (options) => new TreeViewTestWrapper(options);

module("Regression", () => {
    test("Widget should work right if item is class instance", (assert) => {
        function User(name) { this.name = name; }
        const treeView = createInstance({
            items: [
                new User("Alex"),
                new User("Jack"),
                new User("John")
            ],
            displayExpr: "name"
        });

        let selector = `.${treeView.classes.ITEM_CLASS} span`;

        assert.equal(treeView.instance.$element().find(selector).eq(0).text(), "Alex");
        assert.equal(treeView.instance.$element().find(selector).eq(1).text(), "Jack");
        assert.equal(treeView.instance.$element().find(selector).eq(2).text(), "John");
    });

    test("'No data' text should be rendered if tree view has no items", (assert) => {
        const treeView = createInstance({ items: [] });

        assert.ok(treeView.instance.$element().hasClass("dx-empty-collection"));
        assert.equal(treeView.instance.$element().find(".dx-empty-message").length, 1);

        treeView.instance.option("items", [{ text: "Item 1" }]);
        assert.ok(!treeView.instance.$element().hasClass("dx-empty-collection"));
        assert.equal(treeView.instance.$element().find(".dx-empty-message").length, 0);

        treeView.instance.option("items", []);
        assert.ok(treeView.instance.$element().hasClass("dx-empty-collection"));
        assert.equal(treeView.instance.$element().find(".dx-empty-message").length, 1);
    });

    test("T217916: dxTreeView does not render a node if ID is less than ParentID", (assert) => {
        const treeView = createInstance({
            items: [
                { id: 1, text: "Cats", parentId: 0, expanded: true },
                { id: 4, text: "Sub Bob", parentId: 2, expanded: true },
                { id: 2, text: "Bob", parentId: 3, expanded: true },
                { id: 3, text: "Dogs", parentId: 0, expanded: true }
            ],
            dataStructure: "plain"

        });

        assert.equal(treeView.getItems().length, 4);
    });
});

