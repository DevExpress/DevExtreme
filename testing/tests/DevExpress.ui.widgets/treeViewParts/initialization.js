/* global initTree */
import TreeViewTestWrapper from "../../../helpers/TreeViewTestHelper.js";
const createInstance = (options) => new TreeViewTestWrapper(options);

QUnit.module("Initialization");

QUnit.test("Init tree view", function(assert) {
    var $treeView = initTree();
    assert.ok($treeView);
});

QUnit.module("Initialization with cycle/loop keys (T832760)", () => {
    [{ sourceOptionName: 'items', virtualModeEnabled: false }, { sourceOptionName: 'dataSource', virtualModeEnabled: false }, { sourceOptionName: 'dataSource', virtualModeEnabled: true }].forEach((testConfig) => {
        QUnit.test(`rootValue option`, function(assert) {
            const testData = [ { configRoot: 1, expectedItemId: 2 }, { configRoot: 2, expectedItemId: 3 }, { configRoot: 3, expectedItemId: 1 }, { configRoot: 0, expectedItemId: undefined },
                { configRoot: null, expectedItemId: undefined },
                { configRoot: undefined, expectedItemId: undefined } ];

            testData.forEach((testData) => {
                let options = { dataStructure: "plain", rootValue: testData.configRoot, virtualModeEnabled: testConfig.virtualModeEnabled };
                options[testConfig.sourceOptionName] = [
                    { id: 1, text: "item1", parentId: 3 },
                    { id: 2, text: "item2", parentId: 1 },
                    { id: 3, text: "item3", parentId: 2 }];
                const treeView = createInstance(options);

                assert.notEqual(treeView.instance, undefined);

                let actualLevelNode = treeView.getElement().find('[aria-level="1"]');
                assert.equal(actualLevelNode.attr('data-item-id'), testData.expectedItemId);
                treeView.instance.dispose();
            });
        });

        QUnit.test(`Expanded value`, function(assert) {
            const testSamples = [true, false];
            testSamples.forEach((optionValue) => {
                let options = { dataStructure: "plain", rootValue: 1, virtualModeEnabled: testConfig.virtualModeEnabled };
                options[testConfig.sourceOptionName] = [
                    { id: 1, text: "item1", parentId: 2, expanded: optionValue },
                    { id: 2, text: "item1_1", parentId: 1, expanded: optionValue }];

                const treeView = createInstance(options),
                    $item1 = treeView.getElement().find('[aria-level="1"]'),
                    $item2 = treeView.getElement().find('[aria-level="2"]');

                assert.notEqual(treeView.instance, undefined);
                assert.equal(treeView.IsVisible($item1), true);
                assert.equal(treeView.IsVisible($item2), optionValue);
            });
        });

        QUnit.test(`Selected value`, function(assert) {
            const testSamples = [{ selectedOption: true, expectedSelected: [0, 1] }, { selectedOption: false, expectedSelected: [] } ];
            testSamples.forEach((testData) => {
                let options = { dataStructure: "plain", showCheckBoxesMode: "normal", rootValue: 1 };
                options[testConfig.sourceOptionName] = [
                    { id: 1, text: "item1", parentId: 2, expanded: true, selected: testData.selectedOption },
                    { id: 2, text: "item1_1", parentId: 1, expanded: true, selected: testData.selectedOption }];

                const treeView = createInstance(options);
                assert.notEqual(treeView.instance, undefined);
                treeView.checkSelectedNodes(testData.expectedSelected);
            });
        });
    });
});

