import $ from 'jquery';

import Scrollable from 'ui/scroll_view/ui.scrollable';
import {
    SCROLLABLE_CONTENT_CLASS,
    SCROLLABLE_CONTAINER_CLASS,
    SCROLLABLE_SCROLLBAR_CLASS,
    SCROLLBAR_HORIZONTAL_CLASS,
    SCROLLBAR_VERTICAL_CLASS,
} from './scrollableParts/scrollable.constants.js';
import { extend } from 'core/utils/extend';

import 'generic_light.css!';

QUnit.testStart(function() {
    const markup = '<div id="outerScrollable">\
        <div style="height: 400px; width: 400px;"></div>\
            <div id="innerScrollable">\
                <div style="height: 200px; width: 200px;"></div>\
            </div>\
        </div>\
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
                    const $outerScrollable = $('#outerScrollable').dxScrollable({ width: 200, height: 200, direction: direction, showScrollbar: 'always', useNative: false, rtlEnabled: rtlEnabled });
                    const $innerScrollable = $('#innerScrollable').dxScrollable({ width: 100, height: 100, direction: direction, showScrollbar: showScrollbar, useNative: false });

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
QUnit.module('Nested scrollable styles', () => {
    const configs = [];
    [false, true].forEach((outerUseNative) => {
        [false, true].forEach((innerUseNative) => {
            [false, true].forEach((rtlEnabled) => {
                ['vertical', 'horizontal', 'both'].forEach((outerDirection) => {
                    ['vertical', 'horizontal', 'both'].forEach((innerDirection) => {
                        ['always', 'never', 'onHover', 'onScroll'].forEach((showScrollbar) => {
                            const config = { rtlEnabled, outerDirection, innerDirection, showScrollbar, outerUseNative, innerUseNative };
                            config.message = Object.keys(config).reduce((message, key) => message += `${key}: ${config[key]}, `, '');
                            configs.push(config);
                        });
                    });
                });
            });
        });
    });

    function checkElementStyles(element, expected, message) {
        const styles = window.getComputedStyle(element);

        for(const propertyName in expected) {
            QUnit.assert.strictEqual(styles[propertyName], expected[propertyName], `${propertyName} ` + message);
        }
    }

    configs.forEach(config => {
        QUnit.test(`check container styles, config: ${config.message}`, function(assert) {
            const options = { showScrollbar: config.showScrollbar, rtlEnabled: config.rtlEnabled };
            const outerScrollableElement = document.querySelector('#outerScrollable');
            const innerScrollableElement = document.querySelector('#innerScrollable');

            new Scrollable(outerScrollableElement, extend(options, { width: 200, height: 200, direction: config.outerDirection, useNative: config.outerUseNative }));
            new Scrollable(innerScrollableElement, extend(options, { width: 100, height: 100, direction: config.innerDirection, useNative: config.innerUseNative }));

            const expectedNative = {
                both: { touchAction: 'pan-x pan-y', overflowX: 'auto', overflowY: 'auto', position: 'relative' },
                vertical: { touchAction: 'pan-y', overflowX: 'hidden', overflowY: 'auto', position: 'relative' },
                horizontal: { touchAction: 'pan-x', overflowX: 'auto', overflowY: 'hidden', position: 'relative' }
            };

            const expectedSimulated = {
                both: { touchAction: 'none', overflowX: 'hidden', overflowY: 'hidden', position: 'static' },
                vertical: { touchAction: 'pan-x', overflowX: 'hidden', overflowY: 'hidden', position: 'static' },
                horizontal: { touchAction: 'pan-y', overflowX: 'hidden', overflowY: 'hidden', position: 'static' }
            };

            checkElementStyles(outerScrollableElement.querySelector(`.${SCROLLABLE_CONTAINER_CLASS}`),
                (config.outerUseNative ? expectedNative : expectedSimulated)[config.outerDirection], 'outerScrollable');
            checkElementStyles(innerScrollableElement.querySelector(`.${SCROLLABLE_CONTAINER_CLASS}`),
                (config.innerUseNative ? expectedNative : expectedSimulated)[config.innerDirection], 'innerScrollable');
        });

        QUnit.test(`check scrollbar styles, config: ${config.message}`, function(assert) {
            const options = { showScrollbar: config.showScrollbar, rtlEnabled: config.rtlEnabled };
            const outerScrollableElement = document.querySelector('#outerScrollable');
            const innerScrollableElement = document.querySelector('#innerScrollable');

            new Scrollable(outerScrollableElement, extend(options, { width: 200, height: 200, direction: config.outerDirection, useNative: config.outerUseNative }));
            new Scrollable(innerScrollableElement, extend(options, { width: 100, height: 100, direction: config.innerDirection, useNative: config.innerUseNative }));

            const expectedSimulated = {
                display: config.showScrollbar === 'never' ? 'none' : 'block'
            };

            if(!config.outerUseNative) {
                if(config.outerDirection === 'both') {
                    checkElementStyles(outerScrollableElement.querySelector(`.${SCROLLBAR_HORIZONTAL_CLASS}`), expectedSimulated, 'outerScrollable');
                    checkElementStyles(outerScrollableElement.querySelector(`.${SCROLLBAR_VERTICAL_CLASS}`), expectedSimulated, 'outerScrollable');
                } else {
                    checkElementStyles(outerScrollableElement.querySelector(`.${SCROLLABLE_SCROLLBAR_CLASS}`), expectedSimulated, 'outerScrollable');
                }

            } else if(!config.innerUseNative) {
                if(config.innerDirection === 'both') {
                    checkElementStyles(innerScrollableElement.querySelector(`.${SCROLLBAR_HORIZONTAL_CLASS}`), expectedSimulated, 'outerScrollable');
                    checkElementStyles(innerScrollableElement.querySelector(`.${SCROLLBAR_VERTICAL_CLASS}`), expectedSimulated, 'outerScrollable');
                } else {
                    checkElementStyles(innerScrollableElement.querySelector(`.${SCROLLABLE_SCROLLBAR_CLASS}`), expectedSimulated, 'innerScrollable');
                }
            } else {
                assert.ok(true);
            }
        });
    });
});
