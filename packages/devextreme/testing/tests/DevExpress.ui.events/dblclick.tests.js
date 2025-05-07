const $ = require('jquery');
const dblclickEvent = require('common/core/events/dblclick');
const { dblClick } = require('__internal/events/m_dblclick');
const pointerMock = require('../../helpers/pointerMock.js');

QUnit.testStart(function() {
    const markup =
        '<div id="container">\
            <div id="element"></div>\
            <div id="otherElement"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
};


QUnit.module('event firing', moduleConfig);

QUnit.test('dxdblclick should bubble up', function(assert) {
    assert.expect(1);

    $('#container').on(dblclickEvent.name, function(e) {
        assert.ok(true, 'dxdblclick fired');
    });

    $('#element').trigger(dblclickEvent.name);
});

QUnit.test('dxdblclick should not be handled on a usual dxclick even if dblClick.remove() was called more than necessary (T1208575)', function(assert) {
    const el = $('#element');
    const handler = sinon.stub();

    // emulate calling .off('dxdblclick') before import 'common/core/events/dblclick' (T1208575)
    dblClick.remove();

    el.off(dblclickEvent.name);
    el.on(dblclickEvent.name, handler);
    el.on(dblclickEvent.name, () => { });

    el.trigger('dxclick');

    assert.equal(handler.callCount, 0);
});

QUnit.module('timeout', moduleConfig);

QUnit.test('dxdblclick should be fired if element clicked twice with timeout < 300ms', function(assert) {
    assert.expect(1);

    const $element = $('#element').on(dblclickEvent.name, function(e) {
        assert.ok(true, 'dxdblclick fired');
    });
    const pointer = pointerMock($element).start();

    pointer.click().wait(299);
    this.clock.tick(299);
    pointer.click();
});

QUnit.test('dxdblclick should not be fired if element clicked twice with timeout > 300ms', function(assert) {
    assert.expect(0);

    const $element = $('#element').on(dblclickEvent.name, function(e) {
        assert.ok(true, 'dxdblclick fired');
    });
    const pointer = pointerMock($element).start();

    pointer.click().wait(301);
    this.clock.tick(301);
    pointer.click();
});

QUnit.test('dxdblclick should be fired once after triple click', function(assert) {
    assert.expect(1);

    const $element = $('#element').on(dblclickEvent.name, function(e) {
        assert.ok(true, 'dxdblclick fired');
    });
    const pointer = pointerMock($element).start();

    pointer.click();
    pointer.click();
    pointer.click();
});

QUnit.test('dxdblclick should not be fired if click triggered on another element', function(assert) {
    assert.expect(1);

    $('#container').on(dblclickEvent.name, function(e) {
        assert.ok(true, 'dxdblclick fired');
    });
    $('#otherElement').on(dblclickEvent.name, function(e) {
        assert.ok(false, 'dxdblclick fired');
    });

    pointerMock($('#element')).click();
    pointerMock($('#otherElement')).click();
});

QUnit.test('dxdblclick should not be fired for the mixed (real and triggered) clicks (T941819)', function(assert) {
    assert.expect(0);

    $('#element').on(dblclickEvent.name, () => assert.ok(false));

    pointerMock($('#element'))
        // NOTE: triggered click
        .start({ clock: 2222 })
        .click()
        // NOTE: real click (the timeStamp is smaller than the previous one)
        .start({ clock: 1111 })
        .click();
});
