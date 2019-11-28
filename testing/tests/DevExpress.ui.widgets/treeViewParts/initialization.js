/* global initTree */
import TreeViewTestWrapper from "../../../helpers/TreeViewTestHelper.js";
QUnit.module("Initialization");

QUnit.test("Init tree view", function(assert) {
    var $treeView = initTree();
    assert.ok($treeView);
});


['items', 'dataSource', 'createChildren'].forEach((dataSourceOption) => {
    [false, true].forEach((virtualModeEnabled) => {
        QUnit.module(`Initialization with cycle/loop keys. DataSource: ${dataSourceOption}. VirtualModeEnabled: ${virtualModeEnabled} (T832760)`, () => {
            QUnit.test(`rootValue`, function(assert) {
                const testData = [
                    { rootValue: 1, expectedItemId: 2 },
                    { rootValue: 2, expectedItemId: 3 },
                    { rootValue: 3, expectedItemId: 1 },
                    { rootValue: 0, expectedItemId: undefined },
                    { rootValue: null, expectedItemId: undefined },
                    { rootValue: undefined, expectedItemId: undefined } ];

                testData.forEach((testData) => {
                    let options = createOptions(dataSourceOption, virtualModeEnabled, [
                        { id: 1, text: "item1", parentId: 3 },
                        { id: 2, text: "item2", parentId: 1 },
                        { id: 3, text: "item3", parentId: 2 }]);
                    options['rootValue'] = testData.rootValue;
                    const wrapper = new TreeViewTestWrapper(options);

                    assert.notEqual(wrapper.instance, undefined);
                    let $rootNode = wrapper.getElement().find('[aria-level="1"]');
                    if(testData.expectedItemId !== undefined) {
                        assert.equal($rootNode.attr('data-item-id'), testData.expectedItemId);
                    } else {
                        assert.equal($rootNode.length, 0);
                    }
                    wrapper.instance.dispose();
                });
            });

            function createOptions(dataSourceOptionName, isVirtualModeEnabled, items) {
                let options = { dataStructure: "plain", virtualModeEnabled: isVirtualModeEnabled, rootValue: 1 };
                const isCreateChildrenDataSource = dataSourceOptionName === 'createChildren';
                options[dataSourceOptionName] = isCreateChildrenDataSource ? (parent) => { return items; } : items;
                return options;
            }
        });
    });
});
