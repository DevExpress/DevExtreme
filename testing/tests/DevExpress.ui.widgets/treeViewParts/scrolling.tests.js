import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';

const configs = [];
[false, true, undefined].forEach((expanded) => {
    ['vertical', 'horizontal', 'both'].forEach((scrollDirection) => {
        configs.push({ expanded, scrollDirection });
    });
});


QUnit.module('TreeView scrolling', () => {
    const ROOT_ID = -1;
    const TOTAL_ITEMS_COUNT = 21;
    const LAST_ITEM_KEY = 20;

    function createWrapper(scrollDirection, items) {
        return new TreeViewTestWrapper({
            scrollDirection,
            height: 100,
            width: 100,
            dataStructure: 'plain',
            rootValue: ROOT_ID,
            dataSource: items
        });
    }

    configs.forEach(config => {
        [{ key: 0, expectedScrollTop: 0 },
            { key: 10, expectedScrollTop: 320 },
            { key: 20, expectedScrollTop: 572 }
        ].forEach(testCase => {
            QUnit.test(`allItems.expanded: ${config.expanded}, scrollDirection: ${config.scrollDirection}, flatArray -> scrollToItem(${testCase.key})`, function(assert) {
                const items = [];
                for(let i = 0; i < TOTAL_ITEMS_COUNT; i++) {
                    items.push({ id: i, text: 'item' + i, parentId: ROOT_ID, expanded: config.expanded });
                }

                const wrapper = createWrapper(config.scrollDirection, items);
                const completionCallback = wrapper.instance.scrollToItem(testCase.key);

                const done = assert.async();
                completionCallback.done(() => {
                    const expectedScrollTop = config.scrollDirection !== 'horizontal'
                        ? testCase.expectedScrollTop
                        : 0;
                    wrapper.checkScrollPosition(expectedScrollTop, 0);
                    done();
                });
            });
        });

        [{ key: 0, expectedExpandedScrollTop: 0, expectedCollapsedScrollTop: 0, expectedExpandedScrollLeft: 0, expectedCollapsedScrollLeft: 0 },
            { key: 10, expectedExpandedScrollTop: 320, expectedCollapsedScrollTop: 252, expectedExpandedScrollLeft: 150, expectedCollapsedScrollLeft: 120 },
            { key: 20, expectedExpandedScrollTop: 572, expectedCollapsedScrollTop: 572, expectedExpandedScrollLeft: 270, expectedCollapsedScrollLeft: 270 }
        ].forEach(testCase => {
            QUnit.test(`allItems.expanded: ${config.expanded}, scrollDirection: ${config.scrollDirection}, deep array -> scrollToItem(${testCase.key})`, function(assert) {
                const items = [];
                for(let i = 0; i < TOTAL_ITEMS_COUNT; i++) {
                    items.push({ id: i, text: 'item' + i, parentId: i - 1, expanded: config.expanded });
                }

                const wrapper = createWrapper(config.scrollDirection, items);
                const completionCallback = wrapper.instance.scrollToItem(testCase.key);

                const done = assert.async();
                completionCallback.done(() => {
                    let expectedScrollTop = 0;
                    if(config.scrollDirection !== 'horizontal') {
                        expectedScrollTop = config.expanded === true
                            ? testCase.expectedExpandedScrollTop
                            : testCase.expectedCollapsedScrollTop;
                    }

                    let expectedScrollLeft = 0;
                    if(config.scrollDirection !== 'vertical') {
                        expectedScrollLeft = config.expanded === true
                            ? testCase.expectedExpandedScrollLeft
                            : testCase.expectedCollapsedScrollLeft;
                    }
                    wrapper.checkScrollPosition(expectedScrollTop, expectedScrollLeft);
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

            const wrapper = createWrapper('both', items);
            const completionCallback = testCase.scrollFunc(wrapper.instance);

            const done = assert.async();
            completionCallback.done(() => {
                wrapper.checkScrollPosition(572, 270);
                done();
            });
        });
    });

    QUnit.test('scrollToItem(LAST_ITEM_KEY) -> scrollToItem(0)', function(assert) {
        const items = [];
        for(let i = 0; i < TOTAL_ITEMS_COUNT; i++) {
            items.push({ id: i, text: 'item' + i, parentId: i - 1, expanded: true });
        }

        const wrapper = createWrapper('both', items);
        let completionCallback = wrapper.instance.scrollToItem(LAST_ITEM_KEY);

        const done = assert.async();
        completionCallback.done(() => {
            completionCallback = wrapper.instance.scrollToItem(0);
            completionCallback.done(() => {
                wrapper.checkScrollPosition(0, 0);
                done();
            });
        });
    });

    QUnit.test('allItems.disabled: true -> scrollToItem(LAST_ITEM_KEY)', function(assert) {
        const items = [];
        for(let i = 0; i < TOTAL_ITEMS_COUNT; i++) {
            items.push({ id: i, text: 'item' + i, parentId: ROOT_ID, disabled: true });
        }

        const wrapper = createWrapper('horizontal', [{ id: 0, text: 'item1', parentId: ROOT_ID }]);
        const completionCallback = wrapper.instance.scrollToItem(LAST_ITEM_KEY);

        const done = assert.async();
        completionCallback
            .fail(() => {
                assert.ok('callback must fail');
                done();
            });
    });

    QUnit.test('scrollToItem(not exists key)', function(assert) {
        const wrapper = createWrapper('horizontal', [{ id: 0, text: 'item1', parentId: ROOT_ID }]);
        const completionCallback = wrapper.instance.scrollToItem(12345);

        const done = assert.async();
        completionCallback
            .fail(() => {
                assert.ok('callback must fail');
                done();
            });
    });
});
