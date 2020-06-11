const $ = require('jquery');
const dblclickEvent = require('events/dblclick');
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
