/* global initTree */
import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';
import $ from 'jquery';
QUnit.module('Initialization', () => {
    QUnit.test('Init tree view', function(assert) {
        const $treeView = initTree();
        assert.ok($treeView);
    });

    function createOptions(options) {
        const result = $.extend({ dataStructure: 'plain', rootValue: 1 }, options);
        if(result.dataSourceOption === 'createChildren') {
            const createChildFunction = (parent) => {
                return parent == null
                    ? [ options.testItems[options.testRootItemIndex || 0] ]
                    : options.testItems.filter(function(item) { return parent.itemData.id === item.parentId; });
            };
            result.createChildren = createChildFunction;
        } else {
            result[options.dataSourceOption] = options.testItems;
        }
        return result;
    }

    ['items', 'dataSource', 'createChildren'].forEach((dataSourceOption) => {
        [false, true].forEach((virtualModeEnabled) => {
            [0, -1, 1.1, '0', 'aaa', null, undefined].forEach(rootValue => {
                QUnit.test(`rootValue = ${rootValue}, dataSource: ${dataSourceOption}, virtualModeEnabled: ${virtualModeEnabled}`, function(assert) {
                    const options = createOptions({
                        dataSourceOption, virtualModeEnabled, rootValue, testItems: [
                            { id: 1, text: 'item1', parentId: rootValue },
                            { id: 2, text: 'item2', parentId: 1 }]
                    });

                    const wrapper = new TreeViewTestWrapper(options);
                    const $item1 = wrapper.getElement().find('[aria-level="1"]');

                    assert.notEqual(wrapper.instance, undefined);
                    assert.notEqual($item1.length, 0, 'item1 must be rendered');
                });
            });

            QUnit.test(`Initialization with cycle/loop keys. DataSource: ${dataSourceOption}. VirtualModeEnabled: ${virtualModeEnabled} (T832760)`, function(assert) {
                const configs = [
                    { rootValue: 1, expectedItemId: 2, rootItemIndex: 1 },
                    { rootValue: 2, expectedItemId: 3, rootItemIndex: 2 },
                    { rootValue: 3, expectedItemId: 1, rootItemIndex: 0 },
                    { rootValue: 0, expectedItemId: undefined, rootItemIndex: 1 },
                    { rootValue: null, expectedItemId: undefined, rootItemIndex: 1 },
                    { rootValue: undefined, expectedItemId: undefined, rootItemIndex: 1 }
                ];

                configs.forEach((config) => {
                    const options = createOptions({
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
                    const $rootNode = wrapper.getElement().find('[aria-level="1"]');
                    if(config.expectedItemId !== undefined) {
                        assert.equal($rootNode.attr('data-item-id'), config.expectedItemId);
                    } else {
                        assert.equal($rootNode.length, 0);
                    }
                    wrapper.instance.dispose();
                });
            });
        });
    });
});

