"use strict";

var $ = require("jquery"),
    MsPointerStrategy = require("events/pointer/mspointer"),
    registerEvent = require("events/core/event_registrator"),
    support = require("core/utils/support"),
    nativePointerMock = require("../../../helpers/nativePointerMock.js"),
    $eventSpecial = $.event.special,
    onlyMSPointerSupport = !window.PointerEvent && window.MSPointerEvent,
    POINTER_DOWN_EVENT_NAME = onlyMSPointerSupport ? "MSPointerDown" : "pointerdown",
    POINTER_UP_EVENT_NAME = onlyMSPointerSupport ? "MSPointerUp" : "pointerup",
    POINTER_MOVE_EVENT_NAME = onlyMSPointerSupport ? "MSPointerMove" : "pointermove",
    POINTER_OVER_EVENT_NAME = onlyMSPointerSupport ? "MSPointerOver" : "pointerover",
    POINTER_OUT_EVENT_NAME = onlyMSPointerSupport ? "MSPointerOut" : "pointerout",
    POINTER_ENTER_EVENT_NAME = onlyMSPointerSupport ? "mouseenter" : "pointerenter",
    POINTER_LEAVE_EVENT_NAME = onlyMSPointerSupport ? "mouseleave" : "pointerleave";

QUnit.module("mspointer events", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        $.each(MsPointerStrategy.map, function(pointerEvent, originalEvents) {
            if($eventSpecial[pointerEvent]) {
                $eventSpecial[pointerEvent].dispose();
            }
            registerEvent(pointerEvent, new MsPointerStrategy(pointerEvent, originalEvents));
        });

        this.$element = $("#element");
    },

    afterEach: function() {
        MsPointerStrategy.resetObserver();
        this.clock.restore();
    }
});

QUnit.test("pointer event should not trigger twice on real devices", function(assert) {
    var handlerTriggerCount = 0;

    var $container = $("#container").on("dxpointerdown", function() {
        handlerTriggerCount++;
    });

    var $element = this.$element.on("dxpointerdown", function() {
        handlerTriggerCount++;
    });

    nativePointerMock($element)
        .start()
        .pointerDown()
        .mouseDown();

    assert.equal(handlerTriggerCount, 2);

    nativePointerMock($container)
        .start()
        .pointerDown()
        .mouseDown();

    assert.equal(handlerTriggerCount, 3);
});

QUnit.test("dxpointerup triggers twice on real devices", function(assert) {
    var triggered = 0;

    this.$element.on("dxpointerup", function() {
        triggered++;
    });

    var pointer = nativePointerMock(this.$element)
        .start()
        .pointerDown()
        .pointerUp();

    this.clock.tick(300);

    pointer
        .mouseDown()
        .mouseUp();

    assert.equal(triggered, 1);
});

$.each({
    "dxpointerdown": POINTER_DOWN_EVENT_NAME,
    "dxpointermove": POINTER_MOVE_EVENT_NAME,
    "dxpointerup": POINTER_UP_EVENT_NAME,
    "dxpointerover": POINTER_OVER_EVENT_NAME,
    "dxpointerout": POINTER_OUT_EVENT_NAME,
    "dxpointerenter": POINTER_ENTER_EVENT_NAME,
    "dxpointerleave": POINTER_LEAVE_EVENT_NAME
}, function(eventName, triggerEvent) {
    QUnit.test("'" + eventName + "' has pointerType = 'mouse' if it was triggered by mouse event", function(assert) {
        this.$element.on(eventName, function(e) {
            assert.equal(e.pointerType, "mouse");
        });

        this.$element.trigger({
            type: triggerEvent,
            pointerType: "mouse"
        });
    });
});

$.each({
    "dxpointerdown": ["MSPointerDown", "pointerdown"],
    "dxpointermove": ["MSPointerMove", "pointermove"],
    "dxpointerup": ["MSPointerUp", "pointerup"],
    "dxpointerover": ["MSPointerOver", "pointerover"],
    "dxpointerout": ["MSPointerOut", "pointerout"],
    "dxpointerenter": ["mouseenter", "pointerenter"],
    "dxpointerleave": ["mouseleave", "pointerleave"]
}, function(eventName, triggerEvents) {
    QUnit.test("'" + eventName + "' was triggered once", function(assert) {
        var triggered = 0;
        this.$element.on(eventName, function(e) {
            triggered++;
        });

        this.$element.trigger(triggerEvents[0]);
        this.$element.trigger(triggerEvents[1]);

        assert.equal(triggered, 1);
    });
});

$.each({
    "dxpointerdown": POINTER_DOWN_EVENT_NAME,
    "dxpointermove": POINTER_MOVE_EVENT_NAME,
    "dxpointerup": POINTER_UP_EVENT_NAME,
    "dxpointerover": POINTER_OVER_EVENT_NAME,
    "dxpointerout": POINTER_OUT_EVENT_NAME,
    "dxpointerenter": POINTER_ENTER_EVENT_NAME,
    "dxpointerleave": POINTER_LEAVE_EVENT_NAME
}, function(eventName, triggerEvent) {
    QUnit.test("'" + eventName + "' has pointerType = 'touch' if it was triggered by touch event", function(assert) {
        this.$element.on(eventName, function(e) {
            assert.equal(e.pointerType, "touch");
        });

        this.$element.trigger({
            type: triggerEvent,
            pointerType: "touch"
        });
    });
});


$.each({
    "dxpointerdown": POINTER_DOWN_EVENT_NAME,
    "dxpointermove": POINTER_MOVE_EVENT_NAME,
    "dxpointerup": POINTER_UP_EVENT_NAME,
    "dxpointerover": POINTER_OVER_EVENT_NAME,
    "dxpointerout": POINTER_OUT_EVENT_NAME,
    "dxpointerenter": POINTER_ENTER_EVENT_NAME,
    "dxpointerleave": POINTER_LEAVE_EVENT_NAME
}, function(eventName, triggerEvent) {
    QUnit.test("'" + eventName + "' event should have correct pointerId", function(assert) {
        this.$element.on(eventName, function(e) {
            assert.equal(e.pointerId, 17);
        });

        this.$element.trigger({
            type: triggerEvent,
            pointerType: "touch",
            pointerId: 17
        });
    });
});


if(support.pointerEvents) {
    var msPointerEnabled = window.navigator.msPointerEnabled;

    var simulatePointerEvent = function($element, type, options) {
        options = $.extend({
            canBubble: true,
            cancelable: true,
            type: type
        }, options);

        var event = document.createEvent(msPointerEnabled ? "MSPointerEvent" : "pointerEvent");

        var args = [];
        $.each(["type", "canBubble", "cancelable", "view", "detail", "screenX", "screenY", "clientX", "clientY", "ctrlKey", "altKey",
            "shiftKey", "metaKey", "button", "relatedTarget", "offsetX", "offsetY", "width", "height", "pressure", "rotation", "tiltX",
            "tiltY", "pointerId", "pointerType", "hwTimestamp", "isPrimary"], function(i, name) {
            if(name in options) {
                args.push(options[name]);
            } else {
                args.push(event[name]);
            }
        });
        event.initPointerEvent.apply(event, args);

        $element[0].dispatchEvent(event);
    };

    QUnit.test("dxpointer events should have all touches in pointer array", function(assert) {
        simulatePointerEvent(this.$element, "pointerdown", { pointerType: "touch", pointerId: 17 });

        this.$element.on("dxpointerdown", function(e) {
            var pointers = e.pointers;
            assert.equal(pointers[0].pointerId, 17);
            assert.equal(pointers[1].pointerId, 18);
        });

        simulatePointerEvent(this.$element, POINTER_DOWN_EVENT_NAME, { pointerType: "touch", pointerId: 18 });

        this.$element.on("dxpointerup", function(e) {
            var pointers = e.pointers;
            assert.equal(pointers.length, 1);
            assert.equal(pointers[0].pointerId, 18);
        });

        simulatePointerEvent(this.$element, POINTER_UP_EVENT_NAME, { pointerType: "touch", pointerId: 17 });
    });

    QUnit.test("active touches should be reset if primary pointer is added", function(assert) {
        simulatePointerEvent(this.$element, POINTER_DOWN_EVENT_NAME, { pointerType: "touch", pointerId: 17, isPrimary: false });

        this.$element.on("dxpointerdown", function(e) {
            var pointers = e.pointers;
            assert.equal(pointers.length, 1);
            assert.equal(pointers[0].pointerId, 18);
        });

        simulatePointerEvent(this.$element, POINTER_DOWN_EVENT_NAME, { pointerType: "touch", pointerId: 18, isPrimary: true });
    });

    QUnit.test("pointers in dxpointer events should be updated on mouse move", function(assert) {
        simulatePointerEvent(this.$element, POINTER_DOWN_EVENT_NAME, { pointerType: "touch", pointerId: 17, clientX: 0 });
        simulatePointerEvent(this.$element, POINTER_DOWN_EVENT_NAME, { pointerType: "touch", pointerId: 18, clientX: 100 });

        this.$element.one("dxpointermove", function(e) {
            var pointers = e.pointers;

            assert.equal(pointers[0].pageX, 0);
            assert.equal(pointers[1].pageX, 50);
        });
        simulatePointerEvent(this.$element, POINTER_MOVE_EVENT_NAME, { pointerType: "touch", pointerId: 18, clientX: 50 });

        this.$element.one("dxpointermove", function(e) {
            var pointers = e.pointers;

            assert.equal(pointers[0].pageX, 20);
            assert.equal(pointers[1].pageX, 50);
        });
        simulatePointerEvent(this.$element, POINTER_MOVE_EVENT_NAME, { pointerType: "touch", pointerId: 17, clientX: 20 });
    });

    QUnit.test("two pointers with same pointerid should not be present in pointers array", function(assert) {
        this.$element.on("dxpointerdown", function(e) {
            assert.equal(e.pointers.length, 1);
        });
        simulatePointerEvent(this.$element, POINTER_DOWN_EVENT_NAME, { pointerType: "mouse", pointerId: 1 });
        simulatePointerEvent(this.$element, POINTER_DOWN_EVENT_NAME, { pointerType: "mouse", pointerId: 1 });
    });
}
