import $ from 'jquery';
import fx from 'animation/fx';
import { value as viewPort } from 'core/utils/view_port';
import executeAsyncMock from '../../helpers/executeAsyncMock.js';

import 'material_blue_light.css!';

import 'ui/popup';
import 'ui/switch';

QUnit.testStart(function() {
    const markup =
        `<style>
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

viewPort($('#qunit-fixture').addClass('dx-viewport'));
executeAsyncMock.setup();

QUnit.module('popover content size', {
    beforeEach: function() {
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
});
