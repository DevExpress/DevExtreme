const $ = require('jquery');
const noop = require('core/utils/common').noop;
const devices = require('core/devices');
const support = require('core/utils/support');
const holdEvent = require('common/core/events/hold');
const contextMenuEvent = require('common/core/events/contextmenu');

QUnit.testStart(function() {
    const markup =
        '<div id="element"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('mobile contextmenu');

QUnit.test('contextmenu should be fired on hold event', function(assert) {

    if(!support.touch) {
        assert.ok(true);
        return;
    }
    const $element = $('#element');

    $element.on(contextMenuEvent.name, function(e) {
        assert.strictEqual(e.target, $element[0]);
    });

    $element.trigger($.Event(holdEvent.name, { pointerType: 'touch' }));
});

QUnit.test('dxhold should be unsubscribed on unsubscribing contextmenu', function(assert) {
    const $element = $('#element');

    $element.on(contextMenuEvent.name, noop).off(contextMenuEvent.name);

    const events = $._data($element[0], 'events') || {};
    const holdEvents = events[holdEvent.name] || [];

    assert.equal(holdEvents.length, 0, 'dxhold event handler was removed');
});


QUnit.module('desktop contextmenu');

QUnit.test('contextmenu should be fired on contextmenu event', function(assert) {
    assert.expect(1);

    const $element = $('#element');

    $element.on(contextMenuEvent.name, function(e) {
        assert.strictEqual(e.target, $element[0]);
    });

    $element.trigger('contextmenu');
});

QUnit.test('contextmenu should be fired on dxhold in simulator', function(assert) {
    assert.expect(1);

    const originalIsSimulator = devices.isSimulator;

    try {
        devices.isSimulator = function() { return true; };
        const $element = $('#element');

        $element.on(contextMenuEvent.name, function(e) {
            assert.strictEqual(e.target, $element[0]);
        });

        $element.trigger($.Event(holdEvent.name, { pointerType: 'mouse' }));
    } finally {
        devices.isSimulator = originalIsSimulator;
    }
});

QUnit.test('contextmenu should not be fired on dxhold event with mouse pointer', function(assert) {
    assert.expect(0);

    const $element = $('#element');

    $element.on(contextMenuEvent.name, function(e) {
        assert.ok(false);
    });

    $element.trigger($.Event(holdEvent.name, { pointerType: 'mouse' }));
});

QUnit.test('contextmenu should be unsubscribed on unsubscribing contextmenu', function(assert) {
    const $element = $('#element');

    $element.on(contextMenuEvent.name, noop).off(contextMenuEvent.name);

    const events = $._data($element[0], 'events') || {};
    const holdEvents = events['contextmenu'] || [];

    assert.equal(holdEvents.length, 0, 'contextmenu event handler was removed');
});
