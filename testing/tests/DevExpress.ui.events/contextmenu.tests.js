var $ = require('jquery'),
    noop = require('core/utils/common').noop,
    devices = require('core/devices'),
    support = require('core/utils/support'),
    holdEvent = require('events/hold'),
    contextMenuEvent = require('events/contextmenu');

QUnit.testStart(function() {
    var markup =
        '<div id="element"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('mobile contextmenu');

QUnit.test('contextmenu should be fired on hold event', function(assert) {

    if(!support.touch) {
        assert.ok(true);
        return;
    }
    var $element = $('#element');

    $element.on(contextMenuEvent.name, function(e) {
        assert.ok(e.target === $element[0]);
    });

    $element.trigger($.Event(holdEvent.name, { pointerType: 'touch' }));
});

QUnit.test('dxhold should be unsubscribed on unsubscribing contextmenu', function(assert) {
    var $element = $('#element');

    $element.on(contextMenuEvent.name, noop).off(contextMenuEvent.name);

    var events = $._data($element[0], 'events') || {},
        holdEvents = events[holdEvent.name] || [];

    assert.equal(holdEvents.length, 0, 'dxhold event handler was removed');
});


QUnit.module('desktop contextmenu');

QUnit.test('contextmenu should be fired on contextmenu event', function(assert) {
    assert.expect(1);

    var $element = $('#element');

    $element.on(contextMenuEvent.name, function(e) {
        assert.ok(e.target === $element[0]);
    });

    $element.trigger('contextmenu');
});

QUnit.test('contextmenu should be fired on dxhold in simulator', function(assert) {
    assert.expect(1);

    var originalIsSimulator = devices.isSimulator;

    try {
        devices.isSimulator = function() { return true; };
        var $element = $('#element');

        $element.on(contextMenuEvent.name, function(e) {
            assert.ok(e.target === $element[0]);
        });

        $element.trigger($.Event(holdEvent.name, { pointerType: 'mouse' }));
    } finally {
        devices.isSimulator = originalIsSimulator;
    }
});

QUnit.test('contextmenu should not be fired on dxhold event with mouse pointer', function(assert) {
    assert.expect(0);

    var $element = $('#element');

    $element.on(contextMenuEvent.name, function(e) {
        assert.ok(false);
    });

    $element.trigger($.Event(holdEvent.name, { pointerType: 'mouse' }));
});

QUnit.test('contextmenu should be unsubscribed on unsubscribing contextmenu', function(assert) {
    var $element = $('#element');

    $element.on(contextMenuEvent.name, noop).off(contextMenuEvent.name);

    var events = $._data($element[0], 'events') || {},
        holdEvents = events['contextmenu'] || [];

    assert.equal(holdEvents.length, 0, 'contextmenu event handler was removed');
});
