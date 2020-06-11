const $ = require('jquery');
const Widget = require('ui/widget/ui.widget');
const registerComponent = require('core/component_registrator');
const EventsStrategy = require('core/events_strategy').EventsStrategy;

QUnit.testStart(function() {
    const markup =
        '<div id="element"></div>';

    $('#qunit-fixture').html(markup);
});

const DxWidget = Widget.inherit({});
registerComponent('dxWidget', DxWidget);


QUnit.module('events strategy');

QUnit.test('setup event strategy', function(assert) {
    assert.expect(6);

    const eventName = 'testEventName';
    const checkEventMethod = function(name) {
        if(name === eventName) {
            assert.ok(true, 'event subscribed');
        }
    };

    const eventsStrategy = {
        on: checkEventMethod,
        off: checkEventMethod,
        fireEvent: checkEventMethod,
        hasEvent: function(name) {
            checkEventMethod(name);
            return true;
        },
        dispose: function() {
            assert.ok(true, 'strategy disposed');
        }
    };

    const instance = $('#element').dxWidget({
        eventsStrategy: eventsStrategy
    }).dxWidget('instance');

    instance.on(eventName, function() {});
    instance.off(eventName, function() {});
    assert.ok(instance._eventsStrategy.hasEvent(eventName));
    instance._eventsStrategy.fireEvent(eventName);

    $('#element').remove();
});

QUnit.test('setup event strategy as function', function(assert) {
    assert.expect(6);

    const eventName = 'testEventName';
    const checkEventMethod = function(name) {
        if(name === eventName) {
            assert.ok(true, 'event subscribed');
        }
    };

    const eventsStrategy = function() {
        return {
            on: checkEventMethod,
            off: checkEventMethod,
            fireEvent: checkEventMethod,
            hasEvent: function(name) {
                checkEventMethod(name);
                return true;
            },
            dispose: function() {
                assert.ok(true, 'strategy disposed');
            }
        };
    };

    const instance = $('#element').dxWidget({
        eventsStrategy: eventsStrategy
    }).dxWidget('instance');

    instance.on(eventName, function() {});
    instance.off(eventName, function() {});
    assert.ok(instance._eventsStrategy.hasEvent(eventName));
    instance._eventsStrategy.fireEvent(eventName);

    $('#element').remove();
});

QUnit.test('callbacks should have correct context', function(assert) {
    assert.expect(1);

    const context = {};
    const $element = $('#element').dxWidget({
        eventsStrategy: new EventsStrategy(context)
    });

    $element.dxWidget('instance').on('disposing', function() {
        assert.equal(this, context, 'context is correct');
    });
    $element.remove();
});


