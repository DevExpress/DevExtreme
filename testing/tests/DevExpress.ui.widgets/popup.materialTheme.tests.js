import $ from 'jquery';
import fx from 'animation/fx';
import { value as viewPort } from 'core/utils/view_port';
import executeAsyncMock from '../../helpers/executeAsyncMock.js';

import 'common.css!';
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
