import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';
import errors from 'ui/widget/ui.errors';

const configs = [];
[false, true, undefined].forEach((expanded) => {
    configs.push({ expanded });
});


QUnit.module('TreeView scrolling', () => {
    const ROOT_ID = -1;
    const TOTAL_ITEMS_COUNT = 30;
    const LAST_ITEM_KEY = TOTAL_ITEMS_COUNT - 1;

    function createWrapper(items) {
        return new TreeViewTestWrapper({
            height: 100,
            dataStructure: 'plain',
            rootValue: ROOT_ID,
            dataSource: items
        });
    }

    configs.forEach(config => {
        [{ key: 0, expectedOffset: 0 },
            { key: 10, expectedOffset: 320 },
            { key: 20, expectedOffset: 640 },
            { key: 29, expectedOffset: 860 }
        ].forEach(testCase => {
            QUnit.test(`flat array, allItems.expanded: ${config.expanded} -> scrollToItem(${testCase.key})`, function(assert) {
                const items = [];
                for(let i = 0; i < TOTAL_ITEMS_COUNT; i++) {
                    items.push({ id: i, text: 'item' + i, parentId: ROOT_ID, expanded: config.expanded });
                }

                const wrapper = createWrapper(items);
                const completionCallback = wrapper.instance.scrollToItem(testCase.key);

                const done = assert.async();
                completionCallback.done(() => {
                    wrapper.checkScrollPosition(testCase.expectedOffset);
                    done();
                });
            });
        });

        [{ key: 0, expandedExpectedOffset: 0, collapsedExpectedOffset: 0 },
            { key: 10, expandedExpectedOffset: 320, collapsedExpectedOffset: 252 },
            { key: 20, expandedExpectedOffset: 640, collapsedExpectedOffset: 572 },
            { key: 29, expandedExpectedOffset: 860, collapsedExpectedOffset: 860 }
        ].forEach(testCase => {
            QUnit.test(`deep array, allItems.expanded: ${config.expanded} -> scrollToItem(${testCase.key})`, function(assert) {
                const items = [];
                for(let i = 0; i < TOTAL_ITEMS_COUNT; i++) {
                    items.push({ id: i, text: 'item' + i, parentId: i - 1, expanded: config.expanded });
                }

                const wrapper = createWrapper(items);
                wrapper.getElement().find('.dx-treeview-node').css('padding-left', '1px');
                const completionCallback = wrapper.instance.scrollToItem(testCase.key);

                const done = assert.async();
                completionCallback.done(() => {
                    if(config.expanded === true) {
                        wrapper.checkScrollPosition(testCase.expandedExpectedOffset);
                    } else {
                        wrapper.checkScrollPosition(testCase.collapsedExpectedOffset);
                    }
                    done();
                });
            });
        });
    });

    [{ argType: 'key', scrollFunc: (wrapper) => wrapper.scrollToItem(LAST_ITEM_KEY) },
        { argType: 'itemElement', scrollFunc: (wrapper) => wrapper.scrollToItem(wrapper.$element().find(`[data-item-id="${LAST_ITEM_KEY}"]`)) },
        { argType: 'itemData', scrollFunc: (wrapper) => wrapper.scrollToItem(wrapper.option('dataSource')[TOTAL_ITEMS_COUNT - 1]) }
    ].forEach(testCase => {
        QUnit.test(`scrollToItem(${testCase.argType})`, function(assert) {
            const items = [];
            for(let i = 0; i < TOTAL_ITEMS_COUNT; i++) {
                items.push({ id: i, text: 'item' + i, parentId: i - 1, expanded: true });
            }

            const wrapper = createWrapper(items);
            const completionCallback = testCase.scrollFunc(wrapper.instance);

            const done = assert.async();
            completionCallback.done(() => {
                wrapper.checkScrollPosition(860);
                done();
            });
        });
    });

    QUnit.test('scrollToItem(LAST_ITEM_KEY) -> scrollToItem(0)', function(assert) {
        const items = [];
        for(let i = 0; i < TOTAL_ITEMS_COUNT; i++) {
            items.push({ id: i, text: 'item' + i, parentId: i - 1, expanded: true });
        }

        const wrapper = createWrapper(items);
        let completionCallback = wrapper.instance.scrollToItem(LAST_ITEM_KEY);

        const done = assert.async();
        completionCallback.done(() => {
            completionCallback = wrapper.instance.scrollToItem(0);
            completionCallback.done(() => {
                wrapper.checkScrollPosition(0);
                done();
            });
        });
    });

    QUnit.test('allItems.disabled: true -> scrollToItem(LAST_ITEM_KEY)', function(assert) {
        const items = [];
        for(let i = 0; i < TOTAL_ITEMS_COUNT; i++) {
            items.push({ id: i, text: 'item' + i, parentId: ROOT_ID, disabled: true });
        }

        const wrapper = createWrapper([{ id: 0, text: 'item1', parentId: ROOT_ID }]);
        const completionCallback = wrapper.instance.scrollToItem(LAST_ITEM_KEY);

        const done = assert.async();
        completionCallback
            .fail((error) => {
                assert.deepEqual(error, errors.Error('W1015'));
                done();
            });
    });

    QUnit.test('scrollToItem(not exists key)', function(assert) {
        const wrapper = createWrapper([{ id: 0, text: 'item1', parentId: ROOT_ID }]);
        const completionCallback = wrapper.instance.scrollToItem(12345);

        const done = assert.async();
        completionCallback
            .fail((error) => {
                assert.deepEqual(error, errors.Error('W1015'));
                done();
            });
    });
});
