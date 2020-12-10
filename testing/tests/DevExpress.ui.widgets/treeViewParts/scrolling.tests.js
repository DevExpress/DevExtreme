import TreeViewTestWrapper from '../../../helpers/TreeViewTestHelper.js';
import browser from 'core/utils/browser';
import $ from 'jquery';

import 'common.css!';
import 'generic_light.css!';

QUnit.module('scrollToItem', () => {
    if(browser.msie) {
        return;
    }

    function createWrapper(config, items) {
        const wrapper = new TreeViewTestWrapper({
            displayExpr: 'id',
            scrollDirection: config.scrollDirection,
            height: 150,
            width: 150,
            animationEnabled: false,
            items: items,
            rtlEnabled: config.rtlEnabled,
            onContentReady: config.onContentReady,
            scrollableUseNative: config.scrollableUseNative
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

    function isNotSupported(key, config) {
        const isFirstLevelNodeKey = key.indexOf('_') === -1;
        return config.disabled && !config.expanded && !isFirstLevelNodeKey;
    }

    const configs = [];
    ['vertical', 'horizontal', 'both'].forEach(scrollDirection => {
        [false, true].forEach(expanded => {
            [false, true].forEach(disabled => {
                [false, true].forEach(rtlEnabled => {
                    [false, true].forEach(scrollableUseNative => {
                        configs.push({
                            expanded,
                            scrollDirection,
                            disabled,
                            rtlEnabled,
                            scrollableUseNative,
                            keysToScroll: ['item1', 'item1_1_1', 'item9', 'item9_1_1_1_1', 'item10', 'item10_1_1_1_1_1'],
                            description: `expanded: ${expanded}, rtlEnabled: ${rtlEnabled}, disabled: ${disabled}, scrollDirection: ${scrollDirection}, scrollableUseNative: ${scrollableUseNative} `
                        });
                    });
                });
            });
        });
    });

    configs.forEach(config => {
        config.keysToScroll.forEach(key => {
            QUnit.test(`config:${config.description} -> onContentReady.scrollToItem(${key}) -> focusOut() -> focusIn()`, function(assert) {
                let completionCallback = null;
                let isFirstContentReadyEvent = true;
                const options = $.extend({}, config, {
                    onContentReady: function(e) {
                        if(isFirstContentReadyEvent) {
                            isFirstContentReadyEvent = false;

                            completionCallback = e.component.scrollToItem(key);
                        }
                    }
                });

                const wrapper = createWrapper(options, createDataSource(config.expanded, config.disabled));
                const done = assert.async();
                if(isNotSupported(key, config)) {
                    completionCallback.fail(() => {
                        assert.ok('scroll must fail');
                        done();
                    });
                } else {
                    completionCallback.done(() => {
                        wrapper.getElement().focusout();
                        wrapper.getElement().focusin();
                        wrapper.checkNodeIsInVisibleArea(key);
                        done();
                    });
                }
            });
        });

        [{ top: 0, left: 0 }, { top: 1000, left: 0 }, { top: 0, left: 1000 }, { top: 1000, left: 1000 }].forEach(initialPosition => {
            QUnit.test(`config:${config.description}, initialPosition: ${JSON.stringify(initialPosition)} -> scrollToItem() -> focusOut() -> focusIn()`, function(assert) {
                const options = $.extend({}, config, { initialPosition });
                const wrapper = createWrapper(options, createDataSource(config.expanded, config.disabled));
                config.keysToScroll.forEach(key => {
                    const completionCallback = wrapper.instance.scrollToItem(key);
                    const done = assert.async();
                    if(isNotSupported(key, config)) {
                        completionCallback.fail(() => { assert.ok('scroll must fail'); done(); });
                    } else {
                        completionCallback.done(() => {
                            wrapper.getElement().focusout();
                            wrapper.getElement().focusin();
                            wrapper.checkNodeIsInVisibleArea(key);
                            done();
                        });
                    }
                });
            });
        });
    });

    QUnit.test('scrollToItem(key} -> scrollToItem(itemElement) -> scrollToItem(itemData))', function(assert) {
        const wrapper = createWrapper({ scrollDirection: 'both', rtlEnabled: false }, [
            { id: 'item1', expanded: true, items: [ { id: 'item1_1', expanded: true, items: [ { id: 'item1_1_1' } ] } ] },
            { id: 'item2', expanded: true, items: [ { id: 'item2_1', expanded: true, items: [ { id: 'item2_1_1' } ] } ] },
            { id: 'item3', expanded: true, items: [ { id: 'item3_1', expanded: true, items: [ { id: 'item3_1_1' } ] } ] },
            { id: 'item4', expanded: true, items: [ { id: 'item4_1', expanded: true, items: [ { id: 'item4_1_1' } ] } ] },
            { id: 'item5', expanded: true, items: [ { id: 'item5_1', expanded: true, items: [ { id: 'item5_1_1' } ] } ] }
        ]);

        const done = assert.async(3);
        const key = 'item1_1_1';
        wrapper.instance._scrollableContainer.scrollTo({ left: 0, top: 0 });
        wrapper.instance.scrollToItem('item1_1_1').done(() => {
            wrapper.checkNodeIsInVisibleArea(key);
            done();
        });

        wrapper.instance._scrollableContainer.scrollTo({ left: 0, top: 0 });
        const node = wrapper.getElement().find('[data-item-id="item1_1_1"]').get(0);
        wrapper.instance.scrollToItem(node).done(() => {
            wrapper.checkNodeIsInVisibleArea(node.getAttribute('data-item-id'));
            done();
        });

        wrapper.instance._scrollableContainer.scrollTo({ left: 0, top: 0 });
        const itemData = wrapper.instance.option('items')[0].items[0].items[0];
        wrapper.instance.scrollToItem(itemData).done(() => {
            wrapper.checkNodeIsInVisibleArea(itemData.id);
            done();
        });
    });

    QUnit.test('scrollToItem(not exists key)', function(assert) {
        const config = { scrollDirection: 'both' };
        const wrapper = createWrapper(config, [{ id: 'item1', items: [ { id: 'item1_1', items: [ { id: 'item1_1_1' } ] } ] } ]);

        const done = assert.async(3);
        wrapper.instance.scrollToItem('12345').fail(() => { assert.ok('scroll must fail, node not found for this key'); done(); });
        wrapper.instance.scrollToItem($('<div/>').get(0)).fail(() => { assert.ok('scroll must fail, node not found for this itemElement'); done(); });
        wrapper.instance.scrollToItem({}).fail(() => { assert.ok('scroll must fail, node not found for this itemData'); done(); });
    });
});
