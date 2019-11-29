var $ = require("jquery"),
    Widget = require("ui/widget/ui.widget"),
    registerComponent = require("core/component_registrator"),
    EventsStrategy = require("core/events_strategy").EventsStrategy;

QUnit.testStart(function() {
    var markup =
        '<div id="element"></div>';

    $("#qunit-fixture").html(markup);
});

var DxWidget = Widget.inherit({});
registerComponent("dxWidget", DxWidget);


QUnit.module("events strategy");

QUnit.test("setup event strategy", function(assert) {
    assert.expect(6);

    var eventName = "testEventName";
    var checkEventMethod = function(name) {
        if(name === eventName) {
            assert.ok(true, "event subscribed");
        }
    };

    var eventsStrategy = {
        on: checkEventMethod,
        off: checkEventMethod,
        fireEvent: checkEventMethod,
        hasEvent: function(name) {
            checkEventMethod(name);
            return true;
        },
        dispose: function() {
            assert.ok(true, "strategy disposed");
        }
    };

    var instance = $("#element").dxWidget({
        eventsStrategy: eventsStrategy
    }).dxWidget("instance");

    instance.on(eventName, function() {});
    instance.off(eventName, function() {});
    assert.ok(instance.hasEvent(eventName));
    instance.fireEvent(eventName);

    $("#element").remove();
});

QUnit.test("setup event strategy as function", function(assert) {
    assert.expect(6);

    var eventName = "testEventName";
    var checkEventMethod = function(name) {
        if(name === eventName) {
            assert.ok(true, "event subscribed");
        }
    };

    var eventsStrategy = function() {
        return {
            on: checkEventMethod,
            off: checkEventMethod,
            fireEvent: checkEventMethod,
            hasEvent: function(name) {
                checkEventMethod(name);
                return true;
            },
            dispose: function() {
                assert.ok(true, "strategy disposed");
            }
        };
    };

    var instance = $("#element").dxWidget({
        eventsStrategy: eventsStrategy
    }).dxWidget("instance");

    instance.on(eventName, function() {});
    instance.off(eventName, function() {});
    assert.ok(instance.hasEvent(eventName));
    instance.fireEvent(eventName);

    $("#element").remove();
});

QUnit.test("callbacks should have correct context", function(assert) {
    assert.expect(1);

    var context = {};
    var $element = $("#element").dxWidget({
        eventsStrategy: new EventsStrategy(context)
    });

    $element.dxWidget("instance").on("disposing", function() {
        assert.equal(this, context, "context is correct");
    });
    $element.remove();
});


