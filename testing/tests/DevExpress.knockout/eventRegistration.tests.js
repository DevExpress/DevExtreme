const $ = require('jquery');
const ko = require('knockout');
const registerEvent = require('events/core/event_registrator');
const dragEvents = require('events/drag');
const clickEvent = require('events/click');
const holdEvent = require('events/hold');
const pointerEvents = require('events/pointer');
const swipeEvents = require('events/swipe');

require('integration/knockout');

QUnit.testStart(function() {
    const markup =
        '<div id="eventContext" data-bind="dxtestevent: handle"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('custom events with Ko approach', {
    beforeEach: function() {

    },
    afterEach: function() {
        ko.cleanNode($('#qunit-fixture').get(0));
    }
});

$.each([
    pointerEvents.down,
    pointerEvents.move,
    pointerEvents.up,
    pointerEvents.cancel,
    swipeEvents.start,
    swipeEvents.swipe,
    swipeEvents.end,
    clickEvent.name,
    holdEvent.name,
    dragEvents.start,
    dragEvents.move,
    dragEvents.end,
    dragEvents.enter,
    dragEvents.leave,
    dragEvents.drop
], function(_, eventName) {
    QUnit.test('\'' + eventName + '\' event triggers in standard way', function(assert) {
        const $element = $('<div data-bind="event:{\'' + eventName + '\' : handler}"></div>').appendTo('#qunit-fixture');
        let triggered = 0;
        const vm = {
            handler: function() {
                triggered++;
            }
        };

        ko.applyBindings(vm, $element.get(0));

        $element.trigger(eventName);
        assert.equal(triggered, 1);
    });

    QUnit.test('\'' + eventName + '\' event triggers', function(assert) {
        const $element = $('<div data-bind="{\'' + eventName + '\' : handler}"></div>').appendTo('#qunit-fixture');
        let triggered = 0;
        var vm = {
            handler: function(data, e) {
                triggered++;
                assert.strictEqual(data, vm, 'data event specified correctly');
                assert.ok(e instanceof $.Event, 'jQuery event passed to event handler');
            }
        };

        ko.applyBindings(vm, $element.get(0));

        $element.trigger(eventName);
        assert.equal(triggered, 1);
    });
});

QUnit.test('event with option binding', function(assert) {
    assert.expect(2);

    const $element = $('<div data-bind="dxtestevent: { execute: handler, option1: option1value }"></div>').appendTo('#qunit-fixture');

    registerEvent('dxtestevent', {
        setup: function(element, data) {
            assert.equal(data.option1, 500);
        }
    });

    ko.applyBindings({
        option1value: 500,
        handler: function() {
            assert.ok(true);
        }
    }, $element.get(0));

    $element.trigger('dxtestevent');
});


QUnit.module('event bindings', {
    beforeEach: function() {
        registerEvent('dxtestevent', {});
    },
    afterEach: function() {
        delete $.event.special['dxtestevent'];
    }
});

QUnit.test('event handler context', function(assert) {
    assert.expect(1);

    var vm = {
        handle: function() {
            assert.equal(this, vm, 'viewmodel is context');
        }
    };

    ko.applyBindings(vm, $('#eventContext').get(0));

    $('#eventContext').trigger('dxtestevent');
});
