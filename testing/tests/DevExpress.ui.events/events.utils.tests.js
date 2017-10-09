"use strict";

var $ = require("jquery"),
    compareVersion = require("core/utils/version").compare,
    eventUtils = require("events/utils"),
    pointerMock = require("../../helpers/pointerMock.js"),
    nativePointerMock = require("../../helpers/nativePointerMock.js");

QUnit.testStart(function() {
    var markup =
        '<div id="container">\
            <div id="element"></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("event utils");

QUnit.test("mouse support methods", function(assert) {
    var time = new Date().valueOf(),
        e1 = nativePointerMock().eventMock("mousemove", {
            pageX: 1,
            pageY: 2,
            timeStamp: time,
            which: 2
        }),
        e2 = nativePointerMock().eventMock("mousemove", {
            pageX: 2,
            pageY: 1,
            timeStamp: time + 50,
            which: 1
        }),
        data1 = eventUtils.eventData(e1),
        data2 = eventUtils.eventData(e2),
        delta = eventUtils.eventDelta(data1, data2);

    assert.equal(data1.x, 1, "eventData x");
    assert.equal(data1.y, 2, "eventData y");
    assert.ok(data1.time, "eventData time");

    assert.ok(eventUtils.needSkipEvent(e1), "skip event");
    assert.ok(!eventUtils.needSkipEvent(e2), "do not skip event");

    assert.equal(delta.x, 1, "eventDelta x");
    assert.equal(delta.y, -1, "eventDelta y");
    assert.ok(delta.time, 50);
});

if(compareVersion($.fn.jquery, [3]) < 0) {
    QUnit.test("touch support methods", function(assert) {
        var e1 = nativePointerMock().eventMock("touchmove", {
                touches: [{
                    pageX: 1,
                    pageY: 2
                }],
                timeStamp: new Date().valueOf()
            }),
            data1 = eventUtils.eventData(e1);

        assert.equal(data1.x, 1, "eventData x");
        assert.equal(data1.y, 2, "eventData y");
        assert.ok(data1.time, "eventData time");

        assert.ok(!eventUtils.needSkipEvent(e1), "do not skip event");
    });
}

QUnit.test("mspointer support methods", function(assert) {
    var e1 = nativePointerMock().eventMock("MSPointerMove", {
        pageX: 1,
        pageY: 2,
        timeStamp: new Date().valueOf(),
        pointerType: 2
    });

    nativePointerMock().eventMock("MSPointerMove", {
        pageX: 1,
        pageY: 2
    });

    var data1 = eventUtils.eventData(e1);

    assert.equal(data1.x, 1, "eventData x");
    assert.equal(data1.y, 2, "eventData y");
    assert.ok(data1.time, "eventData time");
});

QUnit.test("pointer support methods", function(assert) {
    var e1 = nativePointerMock().eventMock("pointermove", {
        pageX: 1,
        pageY: 2,
        timeStamp: new Date().valueOf(),
        pointerType: "touch"
    });

    nativePointerMock().eventMock("pointermove", {
        pageX: 1,
        pageY: 2
    });

    var data1 = eventUtils.eventData(e1);

    assert.equal(data1.x, 1, "eventData x");
    assert.equal(data1.y, 2, "eventData y");
    assert.ok(data1.time, "eventData time");
});

QUnit.test("dxpointer support methods", function(assert) {
    var e1 = nativePointerMock().eventMock("dxpointermove", {
        pageX: 1,
        pageY: 2,
        timeStamp: new Date().valueOf(),
        pointerType: "touch"
    });

    nativePointerMock().eventMock("dxpointermove", {
        pageX: 1,
        pageY: 2
    });

    var data1 = eventUtils.eventData(e1);

    assert.equal(data1.x, 1, "eventData x");
    assert.equal(data1.y, 2, "eventData y");
    assert.ok(data1.time, "eventData time");
});

QUnit.test("addNamespace method", function(assert) {
    var event = eventUtils.addNamespace("custom", "Widget"),
        severalEventsByString = eventUtils.addNamespace("custom1 custom2", "Widget"),
        severalEventsByArray = eventUtils.addNamespace(["custom1", "custom2"], "Widget");

    assert.equal(event, "custom.Widget", "custom event name");
    assert.equal(severalEventsByString, "custom1.Widget custom2.Widget", "several custom event names");
    assert.equal(severalEventsByArray, "custom1.Widget custom2.Widget", "several custom event names");
});


QUnit.module("skip mousewheel event test");

function needSkipMouseWheel(element) {
    var mouse = pointerMock(element),
        needSkip;
    element.on({
        "dxmousewheel": function(e) {
            needSkip = eventUtils.needSkipEvent(e);
        }
    });

    mouse.wheel();
    return needSkip;
}

QUnit.testInActiveWindow("needSkipEvent returns true for number input wheel", function(assert) {
    if(!/webkit/i.exec(navigator.userAgent)) {
        assert.ok(true, "this test run only in webkit");
        return;
    }

    var element;

    try {
        element = $("<input type='number' />")
            .appendTo("#qunit-fixture")
            .trigger("focus");

        assert.ok(needSkipMouseWheel(element));
    } finally {
        element.remove();
    }
});

QUnit.testInActiveWindow("needSkipEvent returns true for text input wheel", function(assert) {
    var element;
    try {
        element = $("<input type='text' />")
            .appendTo("#qunit-fixture")
            .trigger("focus");

        assert.ok(!needSkipMouseWheel(element));
    } finally {
        element.remove();
    }
});

QUnit.testInActiveWindow("needSkipEvent returns true for textarea input wheel", function(assert) {
    if(!/webkit/i.exec(navigator.userAgent)) {
        assert.ok(true, "this test run only in webkit");
        return;
    }

    var element;
    try {
        element = $("<textarea></textarea>")
            .appendTo("#qunit-fixture")
            .trigger("focus");

        assert.ok(needSkipMouseWheel(element));
    } finally {
        element.remove();
    }
});

QUnit.testInActiveWindow("needSkipEvent returns true for select input wheel", function(assert) {
    if(!/webkit/i.exec(navigator.userAgent)) {
        assert.ok(true, "this test run only in webkit");
        return;
    }

    var element;
    try {
        element = $("<select><option /><option /><option /></select>")
            .appendTo("#qunit-fixture")
            .trigger("focus");

        assert.ok(needSkipMouseWheel(element));
    } finally {
        element.remove();
    }
});


QUnit.module("skip mouse event tests");

function needSkipMouseDown(element) {
    var mouse = nativePointerMock(element),
        needSkip;
    element.on({
        "mousedown": function(e) {
            needSkip = eventUtils.needSkipEvent(e);
        }
    });
    mouse.mouseDown();
    return needSkip;
}

QUnit.test("needSkipEvent returns true for input click", function(assert) {
    var element = $("<input type='text' />");
    assert.ok(needSkipMouseDown(element));
});

QUnit.test("needSkipEvent returns true for textarea click", function(assert) {
    var element = $("<textarea></textarea>");
    assert.ok(needSkipMouseDown(element));
});

QUnit.test("needSkipEvent returns true for select click", function(assert) {
    var element = $("<select><option /><option /><option /></select>");
    assert.ok(needSkipMouseDown(element));
});

QUnit.test("needSkipEvent returns false for div click", function(assert) {
    var element = $("<div />");
    assert.ok(!needSkipMouseDown(element));
});

QUnit.test("needSkipEvent returns true for .dx-skip-gesture-event click", function(assert) {
    var element = $("<div class='dx-skip-gesture-event' />");
    assert.ok(needSkipMouseDown(element));
});

QUnit.test("needSkipEvent returns true for nested in .dx-skip-gesture-event click", function(assert) {
    var element = $("<div />").appendTo("<div class='dx-skip-gesture-event' />");
    assert.ok(needSkipMouseDown(element));
});


QUnit.module("skip pointer event tests");

function needSkipPointerDown(element) {
    var mouse = nativePointerMock(element),
        needSkip;
    element.on({
        "touchstart": function(e) {
            needSkip = eventUtils.needSkipEvent(e);
        }
    });
    mouse.touchStart();
    return needSkip;
}

QUnit.testInActiveWindow("needSkipEvent returns true for focused input click (B254465)", function(assert) {
    if(!/webkit/i.exec(navigator.userAgent)) {
        assert.ok(true, "this test run only in webkit");
        return;
    }

    var element;
    try {
        element = $("<input type='text' />")
            .appendTo("#qunit-fixture")
            .trigger("focus");

        assert.ok(needSkipPointerDown(element));
    } finally {
        element.remove();
    }
});

QUnit.test("needSkipEvent returns false for not focused input click", function(assert) {
    var element = $("<input type='text' />");
    assert.ok(!needSkipPointerDown(element));
});

QUnit.test("needSkipEvent returns false for div click", function(assert) {
    var element = $("<div />");
    assert.ok(!needSkipPointerDown(element));
});

QUnit.test("needSkipEvent returns true for .dx-skip-gesture-event click", function(assert) {
    var element = $("<div class='dx-skip-gesture-event' />");
    assert.ok(needSkipPointerDown(element));
});

QUnit.test("needSkipEvent returns true for nested in .dx-skip-gesture-event click", function(assert) {
    var element = $("<div />").appendTo("<div class='dx-skip-gesture-event' />");
    assert.ok(needSkipPointerDown(element));
});

if(compareVersion($.fn.jquery, [3]) < 0) {
    QUnit.module("JQuery integration");

    var W3CEventProps = [
            "bubbles",
            "cancelable",
            "currentTarget",
            "eventPhase",
            "target",
            "timeStamp",
            "type",
            "preventDefault",
            "stopPropagation"
        ],

        W3CUIEventProps = W3CEventProps.concat([
            "detail",
            "view"
        ]),

        W3CMouseEventProps = W3CUIEventProps.concat([
            "altKey",
            "button",
            "clientX",
            "clientY",
            "ctrlKey",
            "metaKey",
            "relatedTarget",
            "screenX",
            "screenY",
            "shiftKey"
        ]),

        W3CTouchEventProps = W3CUIEventProps.concat([
            "altKey",
            "changedTouches",
            "ctrlKey",
            "metaKey",
            "shiftKey",
            "targetTouches",
            "touches"
        ]),

        W3CPointerEventProps = W3CMouseEventProps.concat([
            "pointerId",
            "pointerType",
            "width",
            "height",
            "pressure",
            "tiltX",
            "tiltY",
            "isPrimary"
        ]),

        jQueryAdditionalProps = [
            "originalEvent",

            "stopPropagation",
            "isPropagationStopped",
            "stopImmediatePropagation",
            "isImmediatePropagationStopped",
            "preventDefault",
            "isDefaultPrevented",

            "result",
            "data",

            "relatedTarget",
            "delegateTarget",
            "originalTarget",

            "which",
            "button",
            "charCode",

            "pageX",
            "pageY",

            "clientX",
            "clientY",

            "offsetX",
            "offsetY",

            "screenX",
            "screenY",

            "prevValue"
        ];


    if("ontouchstart" in window && !('callPhantom' in window)) {
        $.each(["touchstart", "touchmove", "touchend", "touchcancel"], function(index, eventName) {
            QUnit.test("'" + eventName + "' event has all properties according to W3C (http://www.w3.org/TR/touch-eventUtils/)", function(assert) {
                var element = $("#element")
                    .on(eventName, function(e) {
                        $.each(W3CTouchEventProps, function() {
                            assert.ok(this in e, "event has '" + this + "' property");
                        });
                    })
                    .get(0);

                nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
            });

            QUnit.test("'" + eventName + "' event has all jQuery properties", function(assert) {
                var element = $("#element")
                    .on(eventName, function(e) {
                        $.each(jQueryAdditionalProps, function() {
                            assert.ok(this in e, "event has '" + this + "' property");
                        });
                    })
                    .get(0);

                nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
            });

            QUnit.test("'" + eventName + "' should be unsubscribed by namespace", function(assert) {
                assert.expect(0);

                var element = $("#element")
                    .on(eventName + ".Test", function(e) {
                        assert.ok(false);
                    })
                    .off(".Test")
                    .get(0);

                nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
            });
        });
    }

    if(navigator.msPointerEnabled) {
        $.each(["MSPointerDown", "MSPointerMove", "MSPointerUp"], function(index, eventName) {
            QUnit.test("'" + eventName + "' event has all properties according to W3C (http://www.w3.org/TR/pointerevents/)", function(assert) {
                var element = $("#element")
                    .on(eventName, function(e) {
                        $.each(W3CPointerEventProps, function() {
                            assert.ok(this in e, "event has '" + this + "' property");
                        });
                    })
                    .get(0);

                nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
            });

            QUnit.test("'" + eventName + "' event has all jQuery properties", function(assert) {
                var element = $("#element")
                    .on(eventName, function(e) {
                        $.each(jQueryAdditionalProps, function() {
                            assert.ok(this in e, "event has '" + this + "' property");
                        });
                    })
                    .get(0);

                nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
            });

            QUnit.test("'" + eventName + "' should be unsubscribed by namespace", function(assert) {
                assert.expect(0);

                var element = $("#element")
                    .on(eventName + ".Test", function(e) {
                        assert.ok(false);
                    })
                    .off(".Test")
                    .get(0);

                nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
            });
        });
    }

    if(navigator.pointerEnabled) {
        $.each(["pointerdown", "pointermove", "pointerup"], function(index, eventName) {
            QUnit.test("'" + eventName + "' event has all properties according to W3C (http://www.w3.org/TR/pointerevents/)", function(assert) {
                var element = $("#element")
                    .on(eventName, function(e) {
                        $.each(W3CPointerEventProps, function() {
                            assert.ok(this in e, "event has '" + this + "' property");
                        });
                    })
                    .get(0);

                nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
            });

            QUnit.test("'" + eventName + "' event has all jQuery properties", function(assert) {
                var element = $("#element")
                    .on(eventName, function(e) {
                        $.each(jQueryAdditionalProps, function() {
                            assert.ok(this in e, "event has '" + this + "' property");
                        });
                    })
                    .get(0);

                nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
            });

            QUnit.test("'" + eventName + "' should be unsubscribed by namespace", function(assert) {
                assert.expect(0);

                var element = $("#element")
                    .on(eventName + ".Test", function(e) {
                        assert.ok(false);
                    })
                    .off(".Test")
                    .get(0);

                nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
            });
        });
    }


    QUnit.module("regressions");

    $.each("touchstart touchend touchmove touchcancel".split(" "), function(_, eventName) {
        QUnit.test(eventName + " - some event properties should not be undefined", function(assert) {
            var event = $.event.fix({ type: eventName, touches: [], changedTouches: [{ screenX: 123, screenY: 321, clientX: 345, clientY: 543, pageX: 678, pageY: 876 }] });

            assert.equal(event.screenX, 123, "event.screenX is defined");
            assert.equal(event.screenY, 321, "event.screenY is defined");

            assert.equal(event.clientX, 345, "event.clientX is defined");
            assert.equal(event.clientY, 543, "event.clientY is defined");

            assert.equal(event.pageX, 678, "event.pageX is defined");
            assert.equal(event.pageY, 876, "event.pageY is defined");
        });
    });
}
