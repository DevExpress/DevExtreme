/* global initTree */
import TreeViewTestWrapper from "../../../helpers/TreeViewTestHelper.js";
const createInstance = (options) => new TreeViewTestWrapper(options);

QUnit.module("Initialization");

QUnit.test("Init tree view", function(assert) {
    var $treeView = initTree();
    assert.ok($treeView);
});


['items', 'dataSource', 'createChildren'].forEach((sourceOptionName) => {
    [false, true].forEach((virtualModeEnabled) => {
        QUnit.module(`Initialization with cycle/loop keys. DataSource: ${sourceOptionName}. VirtualModeEnabled: ${virtualModeEnabled} (T832760)`, () => {
            QUnit.test(`rootValue`, function(assert) {
                const testData = [ { configRoot: 1, expectedItemId: 2 }, { configRoot: 2, expectedItemId: 3 }, { configRoot: 3, expectedItemId: 1 }, { configRoot: 0, expectedItemId: undefined },
                    { configRoot: null, expectedItemId: undefined },
                    { configRoot: undefined, expectedItemId: undefined } ];

                testData.forEach((testData) => {
                    let options = createOptions(sourceOptionName, virtualModeEnabled, [
                        { id: 1, text: "item1", parentId: 3 },
                        { id: 2, text: "item2", parentId: 1 },
                        { id: 3, text: "item3", parentId: 2 }]);
                    options['rootValue'] = testData.configRoot;
                    const treeView = createInstance(options);

                    assert.notEqual(treeView.instance, undefined);

                    let actualLevelNode = treeView.getElement().find('[aria-level="1"]');
                    assert.equal(actualLevelNode.attr('data-item-id'), testData.expectedItemId);
                    treeView.instance.dispose();
                });
            });

            function createOptions(itemsOptionName, isVirtualModeEnabled, items) {
                let options = { dataStructure: "plain", virtualModeEnabled: isVirtualModeEnabled, rootValue: 1 };
                options[itemsOptionName] = itemsOptionName === 'createChildren' ? (parent) => { return items; } : items;
                return options;
            }
        });
    });
});
