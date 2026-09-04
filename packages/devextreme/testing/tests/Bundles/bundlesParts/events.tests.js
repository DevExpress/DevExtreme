import $ from 'jquery';
import { special } from '../../../helpers/eventHelper.js';

QUnit.test('events', function(assert) {

    $.each([
        'dxclick',

        'dxcontextmenu',

        'dxdblclick',

        'dxdrag',

        'dxhold',

        'dxhoverstart',
        'dxhoverend',

        'dxpointerdown',
        'dxpointerup',
        'dxpointermove',
        'dxpointercancel',
        'dxpointerenter',
        'dxpointerleave',
        'dxpointerover',
        'dxpointerout',

        'dxswipe',

        'dxtransform'
    ], function(_, namespace) {
        assert.ok(special[namespace], namespace + ' event present');
    });

});
