import $ from 'jquery';
import { dblClick } from 'events/dblclick_impl';
import { name as dxDblClickEventName } from 'events/dblclick';

QUnit.testStart(function() {
    const markup =
        '<div id="element">TEST</div>';

    $('#qunit-fixture').html(markup);

    top.LOG = top.LOG || [];
    top.LOG_open = false;
});

QUnit.module('event firing');

QUnit.test('dxdblclick should be works correctly even if dblClick.remove() calls many times (T1208575)', function(assert) {
    const el = $('#element');
    const handler = sinon.stub();
    // eslint-disable-next-line spellcheck/spell-checker
    top.LOG_open = true;
    top.LOG.push('1st ON');

    dblClick.remove();
    dblClick.remove();

    el.on(dxDblClickEventName, handler);
    el.on(dxDblClickEventName, () => {});

    el.trigger('dxclick');
    el.trigger('dxclick');

    assert.equal(top.LOG.join('; '), '<<<=====================');
    assert.equal(handler.callCount, 3);


});

