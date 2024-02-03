const $ = require('jquery');
const { on, off, trigger } = require('events');
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

    on(el, dblclickEvent.name, handler);

    // const dblClickEventOrig = require('events/dblclick');

    // assert.equal(dblClickEventOrig.name, dblclickEvent.name);

    off(el, dblclickEvent.name);

    on(el, dblclickEvent.name, handler);
    on(el, dblclickEvent.name, () => {});

    trigger(el, 'dxclick');
    trigger(el, 'dxclick');

    assert.equal(handler.callCount, 2);
});

