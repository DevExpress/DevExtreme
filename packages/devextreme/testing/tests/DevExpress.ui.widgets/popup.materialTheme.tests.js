import $ from 'jquery';
import fx from 'common/core/animation/fx';
import { value as viewPort } from 'core/utils/view_port';
import executeAsyncMock from '../../helpers/executeAsyncMock.js';

import 'material_blue_light.css!';

import 'ui/popup';
import 'ui/switch';
import 'ui/scroll_view';
import 'ui/date_box';

QUnit.testStart(function() {
    const markup =
        `<style nonce="qunit-test">
            html, body {
                height: 100%;
                margin: 0;
            }
            #qunit-fixture {
                width: 100%;
                height: 100%;
            }
        </style>
        <div id="popup"></div>`;

    $('#qunit-fixture').html(markup);
});

executeAsyncMock.setup();

QUnit.module('popover content size', {
    beforeEach: function() {
        viewPort($('#qunit-fixture').addClass('dx-viewport'));

        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('popover content has correct size switch', function(assert) {
        $('#popup').dxPopup({
            width: 1000,
            height: '100%',
            contentTemplate: function() {
                const scrollView = $('<div id="switch"></div>');

                return scrollView;
            },
        }).dxPopup('instance')
            .show();

        const $switch = $('#switch').dxSwitch();
        $switch.dxSwitch('instance');

        assert.equal($switch.contents().eq(0).width(), 36, 'Set coorect switch width');
        assert.equal($switch.contents().eq(0).height(), 20, 'Set correct switch height');
    });
});

QUnit.module('popup', {
    beforeEach: function() {
        viewPort($('#qunit-fixture').addClass('dx-viewport'));

        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('title should have margin-bottom = 0 (T979891)', function(assert) {
        const popup = $('#popup').dxPopup({ visible: true }).dxPopup('instance');
        const $title = popup.topToolbar();

        assert.strictEqual($title.css('marginBottom'), '0px', 'margin-bottom equals 0');
    });


    ['outlined', 'underlined', 'filled'].forEach((stylingMode) => {
        QUnit.test(`popup content should not be scrollable with datebox in stylingMode: ${stylingMode} (T1100188)`, function(assert) {
            const popupContent = $(
                `<div id="scrollView">
                    <div id="dateBox"></div>
                </div>'`
            );
            popupContent.appendTo($('#popup'));

            $('#popup').dxPopup({
                height: 'auto',
                visible: true,
            });

            const scrollView = $('#scrollView').dxScrollView({
                scrollByContent: true,
                showScrollbar: 'always'
            }).dxScrollView('instance');

            $('#dateBox').dxDateBox({
                label: 'Hello',
                stylingMode,
                displayFormat: 'dd.MM.yyyy'
            });

            scrollView.scrollTo(100);

            assert.deepEqual(scrollView.scrollOffset(), { top: 0, left: 0 }, 'scroll position does not changed');
        });
    });
});
