/* global initTree */
import TreeViewTestWrapper from "../../../helpers/TreeViewTestHelper.js";
const createInstance = (options) => new TreeViewTestWrapper(options);

QUnit.module("Initialization");

QUnit.test("Init tree view", function(assert) {
    var $treeView = initTree();
    assert.ok($treeView);
});

['dataSource', 'items'].forEach((sourceOptionName) => {
    QUnit.test(`Tree initialize with loop/cycle keys in ${sourceOptionName} option. -> rootValue  (T832760)`, function(assert) {
        const testData = [ { configRoot: 1, expectedItemId: 2 }, { configRoot: 2, expectedItemId: 3 }, { configRoot: 3, expectedItemId: 1 }, { configRoot: 0, expectedItemId: undefined },
            { configRoot: null, expectedItemId: undefined },
            { configRoot: undefined, expectedItemId: undefined } ];

        testData.forEach((testData) => {
            let options = { dataStructure: "plain", rootValue: testData.configRoot };
            options[sourceOptionName] = [
                { id: 1, text: "item1", parentId: 3 },
                { id: 2, text: "item2", parentId: 1 },
                { id: 3, text: "item3", parentId: 2 }];
            const tree = createInstance(options);

            assert.notEqual(tree.instance, undefined);
            let actualLevelNode = tree.getElement().find('[aria-level="1"]');
            assert.equal(actualLevelNode.attr('data-item-id'), testData.expectedItemId);
        });
    });

    QUnit.test(`Tree initialize with with loop/cycle keys in ${sourceOptionName} option. -> Expanded and collapsed (T832760)`, function(assert) {
        const testData = [true, false];
        testData.forEach((optionValue) => {
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
