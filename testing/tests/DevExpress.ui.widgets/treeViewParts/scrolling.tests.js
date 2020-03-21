import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';
import devices from 'core/devices';
import $ from 'jquery';

QUnit.module('scrollToItem', () => {
    if(devices.real().ios) {
        return;
    }
    const LEVEL_SEPARATOR = '_';

    function createWrapper(config, dataSource) {
        const wrapper = new TreeViewTestWrapper({
            displayExpr: 'id',
            scrollDirection: config.scrollDirection,
            height: 200,
            width: 200,
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
            { id: 'item1', expanded, disabled, items: [ { id: 'item1_1', expanded, disabled, items: [ { id: 'item1_1_1', expanded, disabled, items: [ { id: 'item1_1_1_1', expanded, disabled, items: [ { id: 'item1_1_1_1_1', expanded, disabled, items: [ { id: 'item1_1_1_1_1_1', expanded, disabled, items: [ ] } ] } ] } ] } ] }] },
            { id: 'item2', expanded, disabled, items: [ { id: 'item2_1', expanded, disabled, items: [ { id: 'item2_1_1', expanded, disabled, items: [ { id: 'item2_1_1_1', expanded, disabled, items: [ { id: 'item2_1_1_1_1', expanded, disabled, items: [ { id: 'item2_1_1_1_1_1', expanded, disabled, items: [ ] }] } ] } ] } ] }] },
            { id: 'item3', expanded, disabled, items: [ { id: 'item3_1', expanded, disabled, items: [ { id: 'item3_1_1', expanded, disabled, items: [ { id: 'item3_1_1_1', expanded, disabled, items: [ { id: 'item3_1_1_1_1', expanded, disabled, items: [ { id: 'item3_1_1_1_1_1', expanded, disabled, items: [ ] } ] } ] } ] } ] }] },
            { id: 'item4', expanded, disabled, items: [ { id: 'item4_1', expanded, disabled, items: [ { id: 'item4_1_1', expanded, disabled, items: [ { id: 'item4_1_1_1', expanded, disabled, items: [ { id: 'item4_1_1_1_1', expanded, disabled, items: [ { id: 'item4_1_1_1_1_1', expanded, disabled, items: [ ] } ] } ] } ] } ] }] },
            { id: 'item5', expanded, disabled, items: [ { id: 'item5_1', expanded, disabled, items: [ { id: 'item5_1_1', expanded, disabled, items: [ { id: 'item5_1_1_1', expanded, disabled, items: [ { id: 'item5_1_1_1_1', expanded, disabled, items: [ { id: 'item5_1_1_1_1_1', expanded, disabled, items: [ ] } ] } ] } ] } ] }] },
            { id: 'item6', expanded, disabled, items: [ { id: 'item6_1', expanded, disabled, items: [ { id: 'item6_1_1', expanded, disabled, items: [ { id: 'item6_1_1_1', expanded, disabled, items: [ { id: 'item6_1_1_1_1', expanded, disabled, items: [ { id: 'item6_1_1_1_1_1', expanded, disabled, items: [ ] } ] } ] } ] } ] }] },
            { id: 'item7', expanded, disabled, items: [ { id: 'item7_1', expanded, disabled, items: [ { id: 'item7_1_1', expanded, disabled, items: [ { id: 'item7_1_1_1', expanded, disabled, items: [ { id: 'item7_1_1_1_1', expanded, disabled, items: [ { id: 'item7_1_1_1_1_1', expanded, disabled, items: [ ] } ] } ] } ] } ] }] },
            { id: 'item8', expanded, disabled, items: [ { id: 'item8_1', expanded, disabled, items: [ { id: 'item8_1_1', expanded, disabled, items: [ { id: 'item8_1_1_1', expanded, disabled, items: [ { id: 'item8_1_1_1_1', expanded, disabled, items: [ { id: 'item8_1_1_1_1_1', expanded, disabled, items: [ ] } ] } ] } ] } ] }] },
            { id: 'item9', expanded, disabled, items: [ { id: 'item9_1', expanded, disabled, items: [ { id: 'item9_1_1', expanded, disabled, items: [ { id: 'item9_1_1_1', expanded, disabled, items: [ { id: 'item9_1_1_1_1', expanded, disabled, items: [ { id: 'item9_1_1_1_1_1', expanded, disabled, items: [ ] } ] } ] } ] } ] }] },
            { id: 'item10', expanded, disabled, items: [ { id: 'item10_1', expanded, disabled, items: [ { id: 'item10_1_1', expanded, disabled, items: [ { id: 'item10_1_1_1', expanded, disabled, items: [ { id: 'item10_1_1_1_1', expanded, disabled, items: [ { id: 'item10_1_1_1_1_1', expanded, disabled, items: [ ] } ] } ] } ] } ] }] }
        ];
    }

    function isScrollMustFail(config) {
        const isFirstLevelNodeKey = config.key.indexOf(LEVEL_SEPARATOR) === -1;
        return config.disabled && !config.expanded && !isFirstLevelNodeKey;
    }

    const configs = [];
    ['vertical', 'horizontal', 'both'].forEach(scrollDirection => {
        [false, true].forEach(expanded => {
            [false, true].forEach(disabled => {
                ['item1', 'item1_1_1', 'item9', 'item9_1_1_1_1', 'item10', 'item10_1_1_1_1_1'].forEach(key => {
                    configs.push({ expanded, scrollDirection, disabled, key });
                });
            });
        });
    });

    configs.forEach(config => {
        QUnit.test(`expanded: ${config.expanded} disabled: ${config.disabled}, scrollDirection: ${config.scrollDirection} -> onContentReady.scrollToItem(${config.key}) -> focusOut() -> focusIn()`, function(assert) {
            let completionCallback = null;
            let isFirstContentReadyEvent = true;
            const options = $.extend({}, config, {
                onContentReady: function(e) {
                    if(isFirstContentReadyEvent) {
                        isFirstContentReadyEvent = false;
                        completionCallback = e.component.scrollToItem(config.key);
                    }
                }
            });

            const wrapper = createWrapper(options, createDataSource(config.expanded, config.disabled));
            const done = assert.async();
            if(isScrollMustFail(config)) {
                completionCallback.fail(() => { assert.ok('scroll must fail'); done(); });
            } else {
                completionCallback.done(() => {
                    wrapper.checkNodeIsVisibleArea(config.key);
                    done();
                });
            }
        });

        [{ top: 0, left: 0 }, { top: 1000, left: 0 }, { top: 0, left: 1000 }, { top: 1000, left: 1000 }].forEach(initialPosition => {
            QUnit.test(`expanded: ${config.expanded} disabled: ${config.disabled}, scrollDirection: ${config.scrollDirection}, initialPosition: ${initialPosition} -> scrollToItem(${config.key}) -> focusOut() -> focusIn()`, function(assert) {
                const options = $.extend({}, config, { initialPosition });
                const wrapper = createWrapper(options, createDataSource(config.expanded, config.disabled));

                const completionCallback = wrapper.instance.scrollToItem(config.key);
                const done = assert.async();
                if(isScrollMustFail(config)) {
                    completionCallback.fail(() => { assert.ok('scroll must fail'); done(); });
                } else {
                    completionCallback.done(() => {
                        wrapper.checkNodeIsVisibleArea(config.key);
                        done();
                    });
                }
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
            completionCallback.done(() => {
                wrapper.checkNodeIsVisibleArea(key);
                done();
            });
        });
    });


    QUnit.test('scrollToItem(not exists key)', function(assert) {
        const config = { scrollDirection: 'both' };
        const wrapper = createWrapper(config, createDataSource(true, false));

        const done = assert.async(3);
        wrapper.instance.scrollToItem('12345').fail(() => { assert.ok('scroll must fail, node not found for this key'); done(); });
        wrapper.instance.scrollToItem($('<div/>').get(0)).fail(() => { assert.ok('scroll must fail, node not found for this itemElement'); done(); });
        wrapper.instance.scrollToItem({}).fail(() => { assert.ok('scroll must fail, node not found for this itemData'); done(); });
    });
});
