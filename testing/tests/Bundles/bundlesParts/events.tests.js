const $ = require('jquery');
const special = require('../../../helpers/eventHelper.js').special;

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
