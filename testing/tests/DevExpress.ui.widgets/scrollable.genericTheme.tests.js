import $ from 'jquery';

import 'ui/scroll_view/ui.scrollable';
import { SCROLLABLE_CONTENT_CLASS } from './scrollableParts/scrollable.constants.js';
import { extend } from 'core/utils/extend';

import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
    '<div id="outerScrollable">\
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
