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
});
