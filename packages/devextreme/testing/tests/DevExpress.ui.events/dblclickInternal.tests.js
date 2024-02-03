const $ = require('jquery');
const dblclickEvent = { name: 'dxdblclick' };

QUnit.testStart(function() {
    const markup =
        '<div id="element">TEST</div>';

    $('#qunit-fixture').html(markup);

    $('#element').on(dblclickEvent.name, () => {});
});

QUnit.module('event firing');

QUnit.test('dxdblclick should be works correctly even if its module imported between "on()" calls (T1208575)', function(assert) {
    const el = $('#element');
    const handler = sinon.stub();

    el.on(dblclickEvent.name, () => {});

    assert.timeout(100);

    const dblClickModule = require('events/dblclick');

    assert.equal(dblClickModule.name, dblclickEvent.name);

    assert.timeout(100);

    el.off(dblclickEvent.name);

    el.on(dblclickEvent.name, handler);
    el.on(dblclickEvent.name, () => {});

    el.trigger('dxclick');

    assert.equal(handler.callCount, 3);

});

