import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';
import devices from 'core/devices';

QUnit.module('scrollToItem', () => {
    if(devices.real().ios) {
        return;
    }
    const LEVEL_SEPARATOR = '_';

    const WIDGET_HEIGHT = 200;
    const WIDGET_WIDTH = 200;

    function createWrapper(config, dataSource) {
        const wrapper = new TreeViewTestWrapper({
            keyExpr: 'text',
            scrollDirection: config.scrollDirection,
            height: WIDGET_HEIGHT,
            width: WIDGET_WIDTH,
            animationEnabled: false, // +400ms per test
            dataSource: dataSource,
            onContentReady: config.onContentReady
        });

        if(config.initialPosition) {
            wrapper.instance._scrollableContainer.scrollTo(config.initialPosition);
        }

        return wrapper;
    }

    function createDataSource(expanded, disabled) {
        return [
            { text: 'item1', expanded, disabled, items: [ { text: 'item1_1', expanded, disabled, items: [ { text: 'item1_1_1', expanded, disabled, items: [ { text: 'item1_1_1_1', expanded, disabled, items: [ { text: 'item1_1_1_1_1', expanded, disabled, items: [ { text: 'item1_1_1_1_1_1', expanded, disabled, items: [ ] } ] } ] } ] } ] }] },
            { text: 'item2', expanded, disabled, items: [ { text: 'item2_1', expanded, disabled, items: [ { text: 'item2_1_1', expanded, disabled, items: [ { text: 'item2_1_1_1', expanded, disabled, items: [ { text: 'item2_1_1_1_1', expanded, disabled, items: [ { text: 'item2_1_1_1_1_1', expanded, disabled, items: [ ] }] } ] } ] } ] }] },
            { text: 'item3', expanded, disabled, items: [ { text: 'item3_1', expanded, disabled, items: [ { text: 'item3_1_1', expanded, disabled, items: [ { text: 'item3_1_1_1', expanded, disabled, items: [ { text: 'item3_1_1_1_1', expanded, disabled, items: [ { text: 'item3_1_1_1_1_1', expanded, disabled, items: [ ] } ] } ] } ] } ] }] },
            { text: 'item4', expanded, disabled, items: [ { text: 'item4_1', expanded, disabled, items: [ { text: 'item4_1_1', expanded, disabled, items: [ { text: 'item4_1_1_1', expanded, disabled, items: [ { text: 'item4_1_1_1_1', expanded, disabled, items: [ { text: 'item4_1_1_1_1_1', expanded, disabled, items: [ ] } ] } ] } ] } ] }] },
            { text: 'item5', expanded, disabled, items: [ { text: 'item5_1', expanded, disabled, items: [ { text: 'item5_1_1', expanded, disabled, items: [ { text: 'item5_1_1_1', expanded, disabled, items: [ { text: 'item5_1_1_1_1', expanded, disabled, items: [ { text: 'item5_1_1_1_1_1', expanded, disabled, items: [ ] } ] } ] } ] } ] }] },
            { text: 'item6', expanded, disabled, items: [ { text: 'item6_1', expanded, disabled, items: [ { text: 'item6_1_1', expanded, disabled, items: [ { text: 'item6_1_1_1', expanded, disabled, items: [ { text: 'item6_1_1_1_1', expanded, disabled, items: [ { text: 'item6_1_1_1_1_1', expanded, disabled, items: [ ] } ] } ] } ] } ] }] },
            { text: 'item7', expanded, disabled, items: [ { text: 'item7_1', expanded, disabled, items: [ { text: 'item7_1_1', expanded, disabled, items: [ { text: 'item7_1_1_1', expanded, disabled, items: [ { text: 'item7_1_1_1_1', expanded, disabled, items: [ { text: 'item7_1_1_1_1_1', expanded, disabled, items: [ ] } ] } ] } ] } ] }] },
            { text: 'item8', expanded, disabled, items: [ { text: 'item8_1', expanded, disabled, items: [ { text: 'item8_1_1', expanded, disabled, items: [ { text: 'item8_1_1_1', expanded, disabled, items: [ { text: 'item8_1_1_1_1', expanded, disabled, items: [ { text: 'item8_1_1_1_1_1', expanded, disabled, items: [ ] } ] } ] } ] } ] }] },
            { text: 'item9', expanded, disabled, items: [ { text: 'item9_1', expanded, disabled, items: [ { text: 'item9_1_1', expanded, disabled, items: [ { text: 'item9_1_1_1', expanded, disabled, items: [ { text: 'item9_1_1_1_1', expanded, disabled, items: [ { text: 'item9_1_1_1_1_1', expanded, disabled, items: [ ] } ] } ] } ] } ] }] },
            { text: 'item10', expanded, disabled, items: [ { text: 'item10_1', expanded, disabled, items: [ { text: 'item10_1_1', expanded, disabled, items: [ { text: 'item10_1_1_1', expanded, disabled, items: [ { text: 'item10_1_1_1_1', expanded, disabled, items: [ { text: 'item10_1_1_1_1_1', expanded, disabled, items: [ ] } ] } ] } ] } ] }] }
        ];
    }

    const configs = [];
    ['vertical', 'horizontal', 'both'].forEach(scrollDirection => {
        [false, true].forEach(expanded => {
            [false, true].forEach(disabled => {
                ['item1', 'item1_1_1', 'item1_1_1_1_1', 'item1_1_1_1_1_1', 'item9', 'item9_1_1_1_1', 'item10', 'item10_1_1_1_1', 'item10_1_1_1_1_1'].forEach(key => {
                    configs.push({ expanded, scrollDirection, disabled, key });
                });
            });
        });
    });

    configs.forEach(config => {
        [{ top: 0, left: 0 }, { top: 1000, left: 0 }, { top: 0, left: 1000 }, { top: 1000, left: 1000 }].forEach(initialPosition => {
            QUnit.test(`expanded: ${config.expanded} disabled: ${config.disabled}, scrollDirection: ${config.scrollDirection}, initialPosition: ${initialPosition} -> scrollToItem(${config.key})`, function(assert) {
                config.initialPosition = initialPosition;
                const wrapper = createWrapper(config, createDataSource(config.expanded, config.disabled));
                const completionCallback = wrapper.instance.scrollToItem(config.key);

                const done = assert.async();
                completionCallback.done((result) => {
                    const isFirstLevelNodeKey = config.key.indexOf(LEVEL_SEPARATOR) === -1;
                    if(config.disabled && !config.expanded && !isFirstLevelNodeKey) {
                        assert.strictEqual(result, false, 'scroll must fail');
                    } else {
                        assert.strictEqual(result, true, 'scroll must success');
                        wrapper.checkNodeIsVisibleArea(config.key);
                    }
                    wrapper.instance.dispose();
                    done();
                });
            });
        });
    });

    configs.forEach(config => {
        QUnit.test(`expanded: ${config.expanded} disabled: ${config.disabled}, scrollDirection: ${config.scrollDirection} -> onContentReady.scrollToItem(${config.key})`, function(assert) {
            let completionCallback = null;
            let isFirstContentReadyEvent = true;
            config.onContentReady = function(e) {
                if(isFirstContentReadyEvent) {
                    isFirstContentReadyEvent = false;
                    completionCallback = e.component.scrollToItem(config.key);
                }
            };

            const wrapper = createWrapper(config, createDataSource(config.expanded, config.disabled));

            const done = assert.async();
            completionCallback.done((result) => {
                const isFirstLevelNodeKey = config.key.indexOf(LEVEL_SEPARATOR) === -1;
                if(config.disabled && !config.expanded && !isFirstLevelNodeKey) {
                    assert.strictEqual(result, false, 'scroll must fail');
                } else {
                    assert.strictEqual(result, true, 'scroll must success');
                    wrapper.checkNodeIsVisibleArea(config.key);
                }
                wrapper.instance.dispose();
                done();
            });
        });
    });

    const key = 'item1_1_1';
    [{ argType: 'key', scrollFunc: (wrapper) => wrapper.scrollToItem(key) },
        { argType: 'itemElement', scrollFunc: (wrapper) => wrapper.scrollToItem(wrapper.$element().find(`[data-item-id="${key}"]`)) },
        { argType: 'itemData', scrollFunc: (wrapper) => wrapper.scrollToItem(wrapper.option('dataSource')[0].items[0].items[0]) }
    ].forEach(testCase => {
        QUnit.test(`scrollToItem(item1_1_1: ${testCase.argType})`, function(assert) {
            const config = { scrollDirection: 'both', initialPosition: { top: 1000, left: 1000 }, expanded: true };
            const wrapper = createWrapper(config, createDataSource(true, false));
            const completionCallback = testCase.scrollFunc(wrapper.instance);

            const done = assert.async();
            completionCallback.done((result) => {
                assert.strictEqual(result, true, 'scroll must success');
                wrapper.checkNodeIsVisibleArea(key);
                done();
            });
        });
    });


    QUnit.test('scrollToItem(not exists key)', function(assert) {
        const config = { scrollDirection: 'both' };
        const wrapper = createWrapper(config, createDataSource(true, false));
        const completionCallback = wrapper.instance.scrollToItem('12345');

        const done = assert.async();
        completionCallback.done((result) => {
            assert.strictEqual(result, false, 'scroll must fail');
            done();
        });
    });
});
