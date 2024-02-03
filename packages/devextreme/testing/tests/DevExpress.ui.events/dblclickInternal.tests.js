const $ = require('jquery');
const dblclickEvent = { name: 'dxdblclick' };

QUnit.testStart(function() {
    const markup =
        '<div id="element">TEST</div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('event firing');

QUnit.test('dxdblclick should be works correctly even if its module imported between "on()" calls (T1208575)', function(assert) {
    const el = $('#element');
    const handler = sinon.stub();

    el.on(dblclickEvent.name, handler);

    // const dblClickEventOrig = require('events/dblclick');

    // assert.equal(dblClickEventOrig.name, dblclickEvent.name);

    el.off(dblclickEvent.name);

    el.on(dblclickEvent.name, handler);
    el.on(dblclickEvent.name, () => {});

    el.trigger('dxclick');
    el.trigger('dxclick');

    assert.equal(handler.callCount, 2);
});

