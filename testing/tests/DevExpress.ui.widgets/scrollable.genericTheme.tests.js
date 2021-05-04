import $ from 'jquery';

import Scrollable from 'ui/scroll_view/ui.scrollable';
import { SCROLLABLE_CONTENT_CLASS, SCROLLABLE_CONTAINER_CLASS } from './scrollableParts/scrollable.constants.js';
import { extend } from 'core/utils/extend';

import 'generic_light.css!';

QUnit.testStart(function() {
    const markup = '<div id="outerScrollable">\
        <div id="innerScrollable"></div>\
    </div>';

    $('#qunit-fixture').html(markup);
});

// T851522
QUnit.module('Paddings: simulated strategy', () => {
    function checkPaddings(assert, $scrollable, { top = '0px', right = '0px', bottom = '0px', left = '0px' }) {
        const $scrollableContent = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);

        assert.strictEqual($scrollableContent.css('paddingTop'), top, 'padding top');
        assert.strictEqual($scrollableContent.css('paddingRight'), right, 'padding right');
        assert.strictEqual($scrollableContent.css('paddingBottom'), bottom, 'padding bottom');
        assert.strictEqual($scrollableContent.css('paddingLeft'), left, 'padding left');
    }

    [false, true].forEach((rtlEnabled) => {
        ['vertical', 'horizontal', 'both'].forEach((direction) => {
            ['always', 'never', 'onHover', 'onScroll'].forEach((showScrollbar) => {
                QUnit.test(`Outer scrollable.showScrollbar: 'always', innerScrollable.showScrollbar: '${showScrollbar}', direction: ${direction}, rtlEnabled: ${rtlEnabled}`, function(assert) {
                    const $outerScrollable = $('#outerScrollable').dxScrollable({ direction: direction, showScrollbar: 'always', useNative: false, rtlEnabled: rtlEnabled });
                    const $innerScrollable = $('#innerScrollable').dxScrollable({ direction: direction, showScrollbar: showScrollbar, useNative: false });

                    const expectedHorizontalOuterScrollablePaddings = { bottom: '8px' };
                    const expectedHorizontalInnerScrollablePaddings = { bottom: showScrollbar === 'always' ? '8px' : '0px' };
                    const expectedVerticalOuterScrollablePaddings = rtlEnabled ? { left: '8px' } : { right: '8px' };
                    const expectedVerticalInnerScrollablePaddings = rtlEnabled ? { left: showScrollbar === 'always' ? '8px' : '0px' } : { right: showScrollbar === 'always' ? '8px' : '0px' };

                    if(direction === 'horizontal') {
                        checkPaddings(assert, $outerScrollable, expectedHorizontalOuterScrollablePaddings);
                        checkPaddings(assert, $innerScrollable, expectedHorizontalInnerScrollablePaddings);
                    } else if(direction === 'vertical') {
                        checkPaddings(assert, $outerScrollable, expectedVerticalOuterScrollablePaddings);
                        checkPaddings(assert, $innerScrollable, expectedVerticalInnerScrollablePaddings);
                    } else {
                        checkPaddings(assert, $outerScrollable, extend(expectedVerticalOuterScrollablePaddings, expectedHorizontalOuterScrollablePaddings));
                        checkPaddings(assert, $innerScrollable, extend(expectedVerticalInnerScrollablePaddings, expectedHorizontalInnerScrollablePaddings));
                    }
                });
            });
        });
    });
});


// T872060
QUnit.module('ScrollProps: native strategy', () => {
    const configs = [];
    [false, true].forEach((rtlEnabled) => {
        ['vertical', 'horizontal', 'both'].forEach((outerDirection) => {
            ['vertical', 'horizontal', 'both'].forEach((innerDirection) => {
                ['always', 'never', 'onHover', 'onScroll'].forEach((showScrollbar) => {
                    const config = { rtlEnabled, outerDirection, innerDirection, showScrollbar };
                    config.message = Object.keys(config).reduce((message, key) => message += `${key}: ${config[key]}, `, '');
                    configs.push(config);
                });
            });
        });
    });

    function checkScrollProps(assert, scrollable, expected, message) {
        const scrollableContainer = scrollable.querySelector(`.${SCROLLABLE_CONTAINER_CLASS}`);
        const styles = window.getComputedStyle(scrollableContainer);

        assert.strictEqual(styles.touchAction, expected.touchAction, 'touch action ' + message);
        assert.strictEqual(styles.overflowX, expected.overflowX, 'overflow X ' + message);
        assert.strictEqual(styles.overflowY, expected.overflowY, 'overflow Y ' + message);
    }

    configs.forEach(config => {
        QUnit.test(`config: ${config.message}, innerScrollable inside outerScrollable`, function(assert) {
            const options = { showScrollbar: config.showScrollbar, useNative: true, rtlEnabled: config.rtlEnabled };
            const outerScrollableElement = document.querySelector('#outerScrollable');
            const innerScrollableElement = document.querySelector('#innerScrollable');

            new Scrollable(outerScrollableElement, extend(options, { direction: config.outerDirection }));
            new Scrollable(innerScrollableElement, extend(options, { direction: config.innerDirection }));

            const expected = {
                both: { touchAction: 'pan-x pan-y', overflowX: 'auto', overflowY: 'auto' },
                vertical: { touchAction: 'pan-y', overflowX: 'hidden', overflowY: 'auto' },
                horizontal: { touchAction: 'pan-x', overflowX: 'auto', overflowY: 'hidden' }
            };

            checkScrollProps(assert, outerScrollableElement, expected[config.outerDirection], 'outerScrollable');
            checkScrollProps(assert, innerScrollableElement, expected[config.innerDirection], 'innerScrollable');
        });
    });
});
