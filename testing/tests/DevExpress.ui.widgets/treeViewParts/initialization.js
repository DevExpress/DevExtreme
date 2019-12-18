/* global initTree */
import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';
import $ from 'jquery';
QUnit.module('Initialization');

QUnit.test('Init tree view', function(assert) {
    var $treeView = initTree();
    assert.ok($treeView);
});


['items', 'dataSource', 'createChildren'].forEach((dataSourceOption) => {
    [false, true].forEach((virtualModeEnabled) => {
        QUnit.module(`Initialization with cycle/loop keys. DataSource: ${dataSourceOption}. VirtualModeEnabled: ${virtualModeEnabled} (T832760)`, () => {
            QUnit.test('rootValue', function(assert) {
                const configs = [
                    { rootValue: 1, expectedItemId: 2, rootItemIndex: 1 },
                    { rootValue: 2, expectedItemId: 3, rootItemIndex: 2 },
                    { rootValue: 3, expectedItemId: 1, rootItemIndex: 0 },
                    { rootValue: 0, expectedItemId: undefined, rootItemIndex: 1 },
                    { rootValue: null, expectedItemId: undefined, rootItemIndex: 1 },
                    { rootValue: undefined, expectedItemId: undefined, rootItemIndex: 1 }
                ];

                configs.forEach((config) => {
                    let options = createOptions({
                        dataSourceOption,
                        virtualModeEnabled,
                        testRootItemIndex: config.rootItemIndex,
                        testItems: [
                            { id: 1, text: 'item1', parentId: 3 },
                            { id: 2, text: 'item2', parentId: 1 },
                            { id: 3, text: 'item3', parentId: 2 }]
                    });
                    options['rootValue'] = config.rootValue;
                    const wrapper = new TreeViewTestWrapper(options);

                    assert.notEqual(wrapper.instance, undefined);
                    let $rootNode = wrapper.getElement().find('[aria-level="1"]');
                    if(config.expectedItemId !== undefined) {
                        assert.equal($rootNode.attr('data-item-id'), config.expectedItemId);
                    } else {
                        assert.equal($rootNode.length, 0);
                    }
                    wrapper.instance.dispose();
                });
            });

            function createOptions(options) {
                const result = $.extend({ dataStructure: 'plain', rootValue: 1 }, options);
                if(result.dataSourceOption === 'createChildren') {
                    const createChildFunction = (parent) => {
                        return parent == null
                            ? [ options.testItems[options.testRootItemIndex] ]
                            : options.testItems.filter(function(item) { return parent.itemData.id === item.parentId; });
                    };
                    result.createChildren = createChildFunction;
                } else {
                    result[options.dataSourceOption] = options.testItems;
                }
                return result;
            }
        });
    });
});
