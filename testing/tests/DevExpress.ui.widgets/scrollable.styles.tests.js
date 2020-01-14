import $ from 'jquery';

import 'ui/scroll_view/ui.scrollable';
import { SCROLLABLE_CONTENT_CLASS } from './scrollableParts/scrollable.constants.js';

import 'common.css!';
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
        ['always', 'never', 'onHover', 'onScroll'].forEach((showScrollbar) => {
            QUnit.test(`Outer scrollable.showScrollbar: 'always', innerScrollable.showScrollbar: '${showScrollbar}', rtlEnabled: ${rtlEnabled}`, function(assert) {
                const $outerScrollable = $('#outerScrollable').dxScrollable({ showScrollbar: 'always', useNative: false, rtlEnabled: rtlEnabled });
                const $innerScrollable = $('#innerScrollable').dxScrollable({ showScrollbar: showScrollbar, useNative: false });

                if(rtlEnabled) {
                    checkPaddings(assert, $outerScrollable, { left: '8px' });
                    checkPaddings(assert, $innerScrollable, { left: showScrollbar === 'always' ? '8px' : '0px' });
                } else {
                    checkPaddings(assert, $outerScrollable, { right: '8px' });
                    checkPaddings(assert, $innerScrollable, { right: showScrollbar === 'always' ? '8px' : '0px' });
                }
            });
        });
    });
});
