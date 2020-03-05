import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';
import devices from 'core/devices';

QUnit.module('TreeView scrolling.', () => {
    if(devices.real().ios) {
        return;
    }

    const ROOT_ID = '0';
    const TOTAL_BRANCHES_COUNT = 10;
    const MAX_DEEP_LEVEL = 10;

    function createWrapper(config, dataSource) {
        const wrapper = new TreeViewTestWrapper({
            scrollDirection: config.scrollDirection,
            height: 20,
            width: 20,
            dataStructure: 'plain',
            rootValue: ROOT_ID,
            dataSource: dataSource
        });

        if(config.initialPosition) {
            wrapper.instance._scrollableContainer.scrollTo(config.initialPosition);
        }

        return wrapper;
    }

    function createDataSource(expanded, disabled) {
        const items = [];
        for(let i = 1; i <= TOTAL_BRANCHES_COUNT; i++) {
            for(let j = 1; j <= MAX_DEEP_LEVEL; j++) {
                if(j === 1) {
                    const text = `item${i}`;
                    items.push({ id: text, text, parentId: ROOT_ID, expanded, disabled });
                } else {
                    const parentId = items[items.length - 1].id;
                    const text = `item${i}_` + [...Array(j)].map(() => 1).join('_');
                    items.push({ id: text, text, parentId, expanded, disabled });
                }
            }
        }
        return items;
    }

    function getNodePosition(config) {
        switch(config.scrollDirection) {
            case 'horizontal':
                return 'left';
            case 'vertical':
                return 'top';
            case 'both':
                return 'topAndLeft';
        }
    }

    const configs = [];
    ['vertical', 'horizontal', 'both'].forEach(scrollDirection => {
        [false, true].forEach(expanded => {
            [false, true].forEach(disabled => {
                [{ top: 0, left: 0 }, { top: 1000, left: 0 }, { top: 0, left: 1000 }, { top: 1000, left: 1000 }].forEach(initialPosition => {
                    configs.push({ expanded, scrollDirection, disabled, initialPosition });
                });
            });
        });
    });

    configs.forEach(config => {
        ['item1', 'item10', 'item1_1_1', 'item1_1_1_1_1', 'item10_1_1_1_1'].forEach(key => {
            QUnit.test(`TreeView scrolling. expanded: ${config.expanded} disabled: ${config.disabled}, scrollDirection: ${config.scrollDirection}, initialPosition: ${JSON.stringify(config.initialPosition)} -> scrollToItem(${key})`, function(assert) {
                const wrapper = createWrapper(config, createDataSource(config.expanded, config.disabled));
                const completionCallback = wrapper.instance.scrollToItem(key);

                const done = assert.async();
                completionCallback.done((result) => {
                    const isFirstLevelNodeKey = key.indexOf('_') === -1;
                    if(!isFirstLevelNodeKey && config.disabled && !config.expanded) {
                        assert.strictEqual(result, false, 'scroll must fail');
                    } else {
                        assert.strictEqual(result, true, 'scroll must success');
                        wrapper.checkNodePosition(key, getNodePosition(config));
                    }
                    done();
                });
            });
        });
    });

    [{ argType: 'key', scrollFunc: (wrapper) => wrapper.scrollToItem('item1_1_1') },
        { argType: 'itemElement', scrollFunc: (wrapper) => wrapper.scrollToItem(wrapper.$element().find('[data-item-id="item1_1_1"]')) },
        { argType: 'itemData', scrollFunc: (wrapper) => wrapper.scrollToItem(wrapper.option('dataSource').find(i => i.id === 'item1_1_1')) }
    ].forEach(testCase => {
        QUnit.test(`scrollToItem(item1_1_1: ${testCase.argType})`, function(assert) {
            const config = { scrollDirection: 'both' };
            const wrapper = createWrapper(config, createDataSource(true, false));
            const completionCallback = testCase.scrollFunc(wrapper.instance);

            const done = assert.async();
            completionCallback.done((result) => {
                assert.strictEqual(result, true, 'scroll must success');
                wrapper.checkNodePosition('item1_1_1', getNodePosition(config));
                done();
            });
        });
    });
});
