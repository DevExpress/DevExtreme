var $ = require("jquery"),
    TouchStrategy = require("events/pointer/touch"),
    registerEvent = require("events/core/event_registrator"),
    nativePointerMock = require("../../../helpers/nativePointerMock.js"),
    noop = require("core/utils/common").noop,
    special = require("../../../helpers/eventHelper.js").special,
    eventsEngine = require("events/core/events_engine");

QUnit.module("touch events", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        $.each(TouchStrategy.map, function(pointerEvent, originalEvents) {
            if(special[pointerEvent]) {
                special[pointerEvent].dispose.apply(undefined);
            }
            registerEvent(pointerEvent, new TouchStrategy(pointerEvent, originalEvents));
        });

        this.$element = $("#element");
    },

    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("pointer event should not trigger twice on real devices", function(assert) {
    var containerHandler = sinon.stub(),
        elementHandler = sinon.stub();

    var $container = $("#container").on("dxpointerdown", containerHandler);

    var $element = this.$element.on("dxpointerdown", elementHandler);

    nativePointerMock($element)
        .start()
        .touchStart()
        .mouseDown();

    assert.ok(elementHandler.calledOnce, "Element handler should be triggered");
    assert.ok(containerHandler.calledOnce, "Container handler should be triggered by bubbling event");


    nativePointerMock($container)
        .start()
        .touchStart()
        .mouseDown();

    assert.ok(elementHandler.calledOnce, "Element handler should not change since last check");
    assert.ok(containerHandler.callCount < 3, "Container handler should be triggered less than 3 times");
});

QUnit.test("dxpointerup triggers twice on real devices", function(assert) {
    var triggered = 0;

    this.$element.on("dxpointerup", function() {
        triggered++;
    });

    var pointer = nativePointerMock(this.$element)
        .start()
        .touchStart()
        .touchEnd();

    this.clock.tick(300);

    pointer
        .mouseDown()
        .mouseUp();

    assert.equal(triggered, 1);
});


$.each({
    "dxpointerdown": "touchstart",
    "dxpointermove": "touchmove",
    "dxpointerup": "touchend"
}, function(eventName, triggerEvent) {
    QUnit.test("'" + eventName + "' has pointerType = 'touch' if it was triggered by touch event", function(assert) {
        this.$element.on(eventName, function(e) {
            assert.equal(e.pointerType, "touch");
        });

        this.$element.trigger({
            type: triggerEvent,
            changedTouches: [{ identifier: 17 }],
            touches: [{ identifier: 17 }]
        });
    });
});

$.each({
    "dxpointerdown": "touchstart",
    "dxpointermove": "touchmove",
    "dxpointerup": "touchend"
}, function(eventName, triggerEvent) {
    QUnit.test("'" + eventName + "' event should have correct pointerId", function(assert) {
        this.$element.on(eventName, function(e) {
            assert.equal(e.pointerId, 17);
        });

        this.$element.trigger({
            type: triggerEvent,
            changedTouches: [{ identifier: 17 }],
            touches: [{ identifier: 17 }]
        });
    });
});

$.each({
    "dxpointerdown": "touchstart",
    "dxpointermove": "touchmove",
    "dxpointerup": "touchend"
}, function(eventName, triggerEvent) {
    QUnit.test("'" + eventName + "' event should have correct pointerId", function(assert) {
        this.$element.on(eventName, function(e) {
            if(eventName !== "dxpointerup") {
                assert.equal(e.pointers.length, 1, "pointer was added");
                var pointer = e.pointers[0];

                $.each(["pageX", "pageY"], function() {
                    assert.ok(this in pointer, "event has '" + this + "' property");
                });

                assert.equal(pointer.pointerId, 17);
            } else {
                assert.equal(e.pointers.length, 0, "pointers was cleaned");
            }
        });

        this.$element.trigger({
            type: triggerEvent,
            changedTouches: [{ identifier: 17, pageX: 0, pageY: 0 }],
            touches: eventName === "dxpointerup" ? [] : [{ identifier: 17, pageX: 0, pageY: 0 }]
        });
    });
});

QUnit.test("touchmove should not have a passive event listener", function(assert) {
    if(!eventsEngine.passiveEventHandlersSupported()) {
        assert.expect(0);
        return;
    }

    var $element = $("<div style=\"height: 20px; width: 20px;\"></div>").appendTo("#qunit-fixture"),
        element = $element.get(0),
        origAddEventListener = element.addEventListener,
        nonPassiveEvent = false;

    element.addEventListener = function(event, handler, options) {
        if(event === "touchmove" && options && options.passive === false) {
            nonPassiveEvent = true;
        }
    };

    $element.on("touchmove", { isNative: true }, noop);
    assert.ok(nonPassiveEvent, "event listener for touchmove is not passive without jquery");

    element.addEventListener = origAddEventListener;
});
