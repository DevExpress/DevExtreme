const $ = require('jquery');
const dblclickEvent = { name: 'dxdblclick' };

QUnit.testStart(function() {
    const markup =
        '<div id="element">TEST</div>';

    $('#qunit-fixture').html(markup);

    top.LOG = top.LOG || ['INJECT ' + require.resolve('events/core/event_registrator')];
    // top.LOG.push(['INJECT ' + require.cache[require.resolve('events/core/event_registrator')]?.default]);
    top.LOG_open = false;

    $('#element').on(dblclickEvent.name, () => {});
});

QUnit.module('event firing');

QUnit.test('dxdblclick should be works correctly even if its module imported between "on()" calls (T1208575)', function(assert) {
    const el = $('#element');
    const handler = sinon.stub();

    // eslint-disable-next-line spellcheck/spell-checker
    top.LOG_open = true;
    top.LOG.push('1st ON');
    el.on(dblclickEvent.name, () => {});
    // const done = assert.async();

    assert.timeout(100);

    const dblClickModule = require('events/dblclick');
    /* import('events/dblclick').then(() => {
        top.LOG.push('LOAD MODULE');
    }); */

    assert.equal(dblClickModule.name, dblclickEvent.name);

    assert.timeout(100);

    el.off(dblclickEvent.name);

    el.on(dblclickEvent.name, handler);
    el.on(dblclickEvent.name, () => {});

    el.trigger('dxclick');
    el.trigger('dxclick');

    assert.equal(top.LOG.join('; '), '========================<<<<<<<<<<');
    assert.equal(handler.callCount, 3);

    top.LOG_open = false;

    /* setTimeout(() => {

        done();
    }, 0); */


});

