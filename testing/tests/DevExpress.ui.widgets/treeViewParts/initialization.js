/* global initTree */
import TreeViewTestWrapper from "../../../helpers/TreeViewTestHelper.js";
const createInstance = (options) => new TreeViewTestWrapper(options);

QUnit.module("Initialization");

QUnit.test("Init tree view", function(assert) {
    var $treeView = initTree();
    assert.ok($treeView);
});


['dataSource', 'items'].forEach((optionName) => {
    QUnit.test(`Tree initialized even with redirect keys in ${optionName} option`, function(assert) {
        let options = { dataStructure: "plain" };
        options[optionName] = [
            { id: 1, text: "item1", parentId: 3 },
            { id: 2, text: "item2", parentId: 1 },
            { id: 3, text: "item3", parentId: 2 }];
        const tree = createInstance(options);

        assert.notEqual(tree.instance, undefined);
    });

    QUnit.test(`Nodes expanding works even with redirect keys in ${optionName} option`, function(assert) {
        let options = { dataStructure: "plain", rootValue: 1 };
        options[optionName] = [
            { id: 1, text: "item1", parentId: 2, selected: false, expanded: false },
            { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: false }];

        let treeView = createInstance(options),
            parentItem = treeView.getElement().find('[aria-level="1"]'),
            childItem = treeView.getElement().find('[aria-level="2"]');

        assert.equal(childItem.length, 0);

        treeView.instance.expandItem(parentItem);
        childItem = treeView.getElement().find('[aria-level="2"]');
        assert.equal(childItem.length, 1);
        assert.equal(treeView.hasInvisibleClass(childItem), false);
    });

    QUnit.test(`Nodes selection works even with redirect keys in ${optionName} option`, function(assert) {
        let options = { dataStructure: "plain", rootValue: 1, showCheckBoxesMode: "normal" };
        options[optionName] = [
            { id: 1, text: "item1", parentId: 2, selected: false, expanded: true },
            { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: true }];

        const treeView = createInstance(options);

        treeView.checkSelectedNodes([]);

        const elem = treeView.getElement().find('[aria-level="1"]');
        treeView.instance.selectItem(elem);
        treeView.checkSelectedNodes([0, 1]);
    });

    QUnit.test(`Search works even with redirect keys in ${optionName} option`, function(assert) {
        let options = { dataStructure: "plain", rootValue: 1, searchEnabled: true };
        options[optionName] = [
            { id: 1, text: "item1", parentId: 2, selected: false, expanded: false },
            { id: 2, text: "item1_1", parentId: 1, selected: false, expanded: false },
            { id: 3, text: "item2", parentId: 1, selected: false, expanded: false }];

        let treeView = createInstance(options),
            parentItem = treeView.getElement().find('[aria-label="item1"]'),
            childItem = treeView.getElement().find('[aria-label="item1_1"]'),
            anotherItem = treeView.getElement().find('[aria-label="item2"]');

        assert.equal(parentItem.length, 0);
        assert.equal(childItem.length, 1);
        assert.equal(anotherItem.length, 1);

        treeView.instance.option('searchValue', "1");

        parentItem = treeView.getElement().find('[aria-label="item1"]');
        assert.equal(parentItem.length, 1);
        assert.equal(treeView.hasInvisibleClass(parentItem), false);

        childItem = treeView.getElement().find('[aria-label="item1_1"]');
        assert.equal(childItem.length, 1);
        assert.equal(treeView.hasInvisibleClass(childItem), false);

        anotherItem = treeView.getElement().find('[aria-label="item2"]');
        assert.equal(anotherItem.length, 0);
    });
});
