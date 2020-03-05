import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';
import devices from 'core/devices';

const configs = [];
['vertical', 'horizontal', 'both'].forEach((scrollDirection) => {
    [false, true].forEach((expanded) => {
        configs.push({ expanded, scrollDirection });
    });
});


QUnit.module('TreeView scrolling', () => {
    if(devices.real().ios) {
        return;
    }

    const ROOT_ID = -1;
    const TOTAL_ITEMS_COUNT = 21;
    const LAST_ITEM_KEY = TOTAL_ITEMS_COUNT - 1;

    function createWrapper(scrollDirection, items) {
        return new TreeViewTestWrapper({
            scrollDirection,
            height: 20,
            width: 20,
            dataStructure: 'plain',
            rootValue: ROOT_ID,
            dataSource: items
        });
    }

    configs.forEach(config => {
        [{ key: 0, expectedScrollTop: 0 },
            { key: 10, expectedScrollTop: 320 },
            { key: 20, expectedScrollTop: 640 }
        ].forEach(testCase => {
            QUnit.test(`allItems.expanded: ${config.expanded}, scrollDirection: ${config.scrollDirection}, flatArray -> scrollToItem(${testCase.key})`, function(assert) {
                const items = [];
                for(let i = 0; i < TOTAL_ITEMS_COUNT; i++) {
                    items.push({ id: i, text: 'item' + i, parentId: ROOT_ID, expanded: config.expanded });
                }

                const wrapper = createWrapper(config.scrollDirection, items);
                const completionCallback = wrapper.instance.scrollToItem(testCase.key);

                const done = assert.async();
                completionCallback.done((result) => {
                    const expectedScrollTop = config.scrollDirection !== 'horizontal'
                        ? testCase.expectedScrollTop
                        : 0;

                    assert.equal(result, true, 'callback result');
                    wrapper.checkScrollPosition(expectedScrollTop, 0);
                    done();
                });
            });
        });

        [{ key: 0, expectedScrollTop: 0, expectedScrollLeft: 0 },
            { key: 10, expectedScrollTop: 320, expectedScrollLeft: 150 },
            { key: 20, expectedScrollTop: 640, expectedScrollLeft: 300 }
        ].forEach(testCase => {
            QUnit.test(`allItems.expanded: ${config.expanded}, scrollDirection: ${config.scrollDirection}, deep array -> scrollToItem(${testCase.key})`, function(assert) {
                const items = [];
                for(let i = 0; i < TOTAL_ITEMS_COUNT; i++) {
                    items.push({ id: i, text: 'item' + i, parentId: i - 1, expanded: config.expanded });
                }

                const wrapper = createWrapper(config.scrollDirection, items);
                const completionCallback = wrapper.instance.scrollToItem(testCase.key);

                const done = assert.async();
                completionCallback.done((result) => {
                    const expectedScrollTop = config.scrollDirection !== 'horizontal'
                        ? testCase.expectedScrollTop
                        : 0;

                    const expectedScrollLeft = config.scrollDirection !== 'vertical'
                        ? testCase.expectedScrollLeft
                        : 0;

                    assert.equal(result, true, 'callback result');
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
            completionCallback.done((result) => {
                assert.equal(result, true, 'callback result');
                wrapper.checkScrollPosition(640, 300);
                done();
            });
        });
    });

    QUnit.test('allItems.expanded:true -> scrollToItem(lastItem.key) -> scrollToItem(10) -> scrollToItem(firstItem.key)', function(assert) {
        const items = [];
        for(let i = 0; i < TOTAL_ITEMS_COUNT; i++) {
            items.push({ id: i, text: 'item' + i, parentId: i - 1, expanded: true });
        }

        const wrapper = createWrapper('both', items);

        const done = assert.async();
        wrapper.instance.scrollToItem(LAST_ITEM_KEY).done((lastItemScrollResult) => {
            assert.equal(lastItemScrollResult, true, 'callback result');
            wrapper.checkScrollPosition(640, 300);

            wrapper.instance.scrollToItem(10).done((tenthItemScrollResult) => {
                assert.equal(tenthItemScrollResult, true, 'callback result');
                wrapper.checkScrollPosition(320, 150);

                wrapper.instance.scrollToItem(0).done((firstItemScrollResult) => {
                    assert.equal(firstItemScrollResult, true, 'callback result');
                    wrapper.checkScrollPosition(0, 0);
                    done();
                });
            });
        });
    });

    QUnit.test('allItems.disabled: true, allItems.expanded: false -> scrollToItem(lastItem.key)', function(assert) {
        const items = [];
        for(let i = 0; i < TOTAL_ITEMS_COUNT; i++) {
            items.push({ id: i, text: 'item' + i, parentId: i - 1, disabled: true, expanded: false });
        }

        const wrapper = createWrapper('both', items);
        const completionCallback = wrapper.instance.scrollToItem(LAST_ITEM_KEY);

        const done = assert.async();
        completionCallback.done((result) => {
            assert.equal(result, false, 'callback result');
            done();
        });
    });

    QUnit.test('allItems.disabled: true, allItems.expanded: true -> scrollToItem(lastItem.key)', function(assert) {
        const items = [];
        for(let i = 0; i < TOTAL_ITEMS_COUNT; i++) {
            items.push({ id: i, text: 'item' + i, parentId: i - 1, disabled: true, expanded: true });
        }

        const wrapper = createWrapper('both', items);
        const completionCallback = wrapper.instance.scrollToItem(LAST_ITEM_KEY);

        const done = assert.async();
        completionCallback.done((result) => {
            assert.equal(result, true, 'callback result');
            wrapper.checkScrollPosition(640, 300);
            done();
        });
    });

    QUnit.test('scrollToItem(not exists key)', function(assert) {
        const wrapper = createWrapper('horizontal', [{ id: 0, text: 'item1', parentId: ROOT_ID }]);
        const completionCallback = wrapper.instance.scrollToItem(12345);

        const done = assert.async();
        completionCallback.done((result) => {
            assert.equal(result, false, 'callback result');
            done();
        });
    });
});
