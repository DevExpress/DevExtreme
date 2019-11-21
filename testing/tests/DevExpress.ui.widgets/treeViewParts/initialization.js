/* global initTree */
import TreeViewTestWrapper from "../../../helpers/TreeViewTestHelper.js";
const createInstance = (options) => new TreeViewTestWrapper(options);

QUnit.module("Initialization");

QUnit.test("Init tree view", function(assert) {
    var $treeView = initTree();
    assert.ok($treeView);
});

['dataSource', 'items'].forEach((sourceOptionName) => {
    QUnit.test(`Tree initialize with loop/cycle keys in ${sourceOptionName} option (T832760)`, function(assert) {
        let options = { dataStructure: "plain" };
        options[sourceOptionName] = [
            { id: 1, text: "item1", parentId: 3 },
            { id: 2, text: "item2", parentId: 1 },
            { id: 3, text: "item3", parentId: 2 }];
        const tree = createInstance(options);

        assert.notEqual(tree.instance, undefined);
    });

    [true, false].forEach((optionValue) => {
        QUnit.test(`Tree initialize with with loop/cycle keys in ${sourceOptionName} option. Collapsed ${optionValue}. Expanded ${optionValue} (T832760)`, function(assert) {
            let options = { dataStructure: "plain", showCheckBoxesMode: "normal" };
            options[sourceOptionName] = [
                { id: 1, text: "item1", parentId: 3, expanded: optionValue, selected: optionValue },
                { id: 2, text: "item2", parentId: 1, expanded: optionValue, selected: optionValue },
                { id: 3, text: "item3", parentId: 2, expanded: optionValue, selected: optionValue }];
            const tree = createInstance(options);

            assert.notEqual(tree.instance, undefined);
        });
    });
});
