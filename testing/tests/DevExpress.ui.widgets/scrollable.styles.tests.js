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
QUnit.module('Paddings', () => {
    function checkPaddings(assert, $scrollable, { top, right, bottom, left }) {
        const $scrollableContent = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);

        assert.strictEqual($scrollableContent.css('paddingTop'), `${top}px`, 'padding top');
        assert.strictEqual($scrollableContent.css('paddingRight'), `${right}px`, 'padding right');
        assert.strictEqual($scrollableContent.css('paddingBottom'), `${bottom}px`, 'padding bottom');
        assert.strictEqual($scrollableContent.css('paddingLeft'), `${left}px`, 'padding left');
    }

    [false, true].forEach((rtlEnabled) => {
        ['always', 'never', 'onHover', 'onScroll'].forEach((showScrollbar) => {
            QUnit.test(`Outer scrollable.showScrollbar: 'always', innerScrollable.showScrollbar: '${showScrollbar}'`, function(assert) {
                const $outerScrollable = $('#outerScrollable').dxScrollable({ showScrollbar: 'always', rtlEnabled: rtlEnabled });
                const $innerScrollable = $('#innerScrollable').dxScrollable({ showScrollbar: showScrollbar });

                if(rtlEnabled) {
                    checkPaddings(assert, $outerScrollable, { top: 0, right: 0, bottom: 0, left: 8 });
                    checkPaddings(assert, $innerScrollable, { top: 0, right: 0, bottom: 0, left: showScrollbar === 'always' ? 8 : 0 });
                } else {
                    checkPaddings(assert, $outerScrollable, { top: 0, right: 8, bottom: 0, left: 0 });
                    checkPaddings(assert, $innerScrollable, { top: 0, right: showScrollbar === 'always' ? 8 : 0, bottom: 0, left: 0 });
                }
            });
        });
    });
});
