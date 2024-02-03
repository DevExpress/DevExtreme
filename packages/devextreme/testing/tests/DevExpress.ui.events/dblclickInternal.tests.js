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
    const done = assert.async();

    import('events/dblclick').then((m) => {
        assert.equal(m.name, dblclickEvent.name);

        el.off(dblclickEvent.name);

        el.on(dblclickEvent.name, handler);
        el.on(dblclickEvent.name, () => {});

        el.trigger('dxclick');

        assert.equal(handler.callCount, 3);
        done();
    });


});

