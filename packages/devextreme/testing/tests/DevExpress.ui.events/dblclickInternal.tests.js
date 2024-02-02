const $ = require('jquery');
const dblclickEvent = { name: 'dxdblclick' };

QUnit.testStart(function() {
    const markup =
        '<div id="element"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('event firing');

QUnit.test('click handler on document for dxddblclick should be only one despite many removing', function(assert) {
    const el = $('#element');
    const handler = sinon.stub();

    el.on(dblclickEvent.name, handler);

    const dblClickEventOrig = require('events/dblclick');

    assert.equal(dblClickEventOrig.name, 'dxdblclick');

    el.off(dblclickEvent.name);

    el.on(dblclickEvent.name, handler);
    el.trigger(dblclickEvent.name);

    assert.equal(handler.callCount, 1);
});

