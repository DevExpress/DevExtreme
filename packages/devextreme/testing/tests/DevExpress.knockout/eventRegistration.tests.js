const $ = require('jquery');
const ko = require('knockout');
const registerEvent = require('common/core/events/core/event_registrator');
const dragEvents = require('common/core/events/drag');
const clickEvent = require('common/core/events/click');
const holdEvent = require('common/core/events/hold');
const pointerEvents = require('common/core/events/pointer');
const swipeEvents = require('common/core/events/swipe');

require('integration/knockout');

const moduleWithoutCsp = QUnit.urlParams['nocsp'] ? QUnit.module : QUnit.module.skip;

QUnit.testStart(function() {
    const markup =
        '<div id="eventContext" data-bind="dxtestevent: handle"></div>';

    $('#qunit-fixture').html(markup);
});

moduleWithoutCsp('custom events with Ko approach', {
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
        const vm = {
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


moduleWithoutCsp('event bindings', {
    beforeEach: function() {
        registerEvent('dxtestevent', {});
    },
    afterEach: function() {
        delete $.event.special['dxtestevent'];
    }
});

QUnit.test('event handler context', function(assert) {
    assert.expect(1);

    const vm = {
        handle: function() {
            assert.equal(this, vm, 'viewmodel is context');
        }
    };

    ko.applyBindings(vm, $('#eventContext').get(0));

    $('#eventContext').trigger('dxtestevent');
});
