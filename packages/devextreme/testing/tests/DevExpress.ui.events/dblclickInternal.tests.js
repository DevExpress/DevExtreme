import $ from 'jquery';
const dblclickEvent = { name: 'dxdblclick' };

QUnit.testStart(function() {
    const markup =
        '<div id="element">TEST</div>';

    $('#qunit-fixture').html(markup);

    top.LOG = top.LOG || [];
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
    const done = assert.async();

    /*    import('events/dblclick').then((m) => {
        el.off(dblclickEvent.name);
        top.LOG.push('IMPORT');
        top.LOG_open = false;

        done();
        return m;
    });*/

    setTimeout(() => {
        done();
    }, 1500);

    el.off(dblclickEvent.name);
    el.on(dblclickEvent.name, handler);
    el.on(dblclickEvent.name, () => {});

    el.trigger('dxclick');
    el.trigger('dxclick');

    assert.equal(top.LOG.join('; '), '<<<=====================');
    assert.equal(handler.callCount, 3);


});

