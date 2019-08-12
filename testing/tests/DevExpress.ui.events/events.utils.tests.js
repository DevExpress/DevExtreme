import $ from "jquery";
import { compare } from "core/utils/version";
import {
    eventData,
    eventDelta,
    needSkipEvent,
    addNamespace,
    normalizeKeyName,
    getChar
} from "events/utils";
import pointerMock from "../../helpers/pointerMock.js";
import nativePointerMock from "../../helpers/nativePointerMock.js";

const { test, testStart, testInActiveWindow } = QUnit;

testStart(() => {
    const markup = `
        <div id="container">
            <div id="element"></div>
        </div>`;

    $("#qunit-fixture").html(markup);
});

QUnit.module("event utils", () => {
    test("mouse support methods", assert => {
        const time = new Date().valueOf(),
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
            data1 = eventData(e1),
            data2 = eventData(e2),
            delta = eventDelta(data1, data2);

        assert.equal(data1.x, 1, "eventData x");
        assert.equal(data1.y, 2, "eventData y");
        assert.ok(data1.time, "eventData time");

        assert.ok(needSkipEvent(e1), "skip event");
        assert.ok(!needSkipEvent(e2), "do not skip event");

        assert.equal(delta.x, 1, "eventDelta x");
        assert.equal(delta.y, -1, "eventDelta y");
        assert.ok(delta.time, 50);
    });

    if(compare($.fn.jquery, [3]) < 0) {
        test("touch support methods", assert => {
            const e1 = nativePointerMock().eventMock("touchmove", {
                    touches: [{
                        pageX: 1,
                        pageY: 2
                    }],
                    timeStamp: new Date().valueOf()
                }),
                data1 = eventData(e1);

            assert.equal(data1.x, 1, "eventData x");
            assert.equal(data1.y, 2, "eventData y");
            assert.ok(data1.time, "eventData time");

            assert.ok(!needSkipEvent(e1), "do not skip event");
        });
    }

    test("mspointer support methods", assert => {
        const e1 = nativePointerMock().eventMock("MSPointerMove", {
            pageX: 1,
            pageY: 2,
            timeStamp: new Date().valueOf(),
            pointerType: 2
        });

        nativePointerMock().eventMock("MSPointerMove", {
            pageX: 1,
            pageY: 2
        });

        const data1 = eventData(e1);

        assert.equal(data1.x, 1, "eventData x");
        assert.equal(data1.y, 2, "eventData y");
        assert.ok(data1.time, "eventData time");
    });

    test("pointer support methods", assert => {
        const e1 = nativePointerMock().eventMock("pointermove", {
            pageX: 1,
            pageY: 2,
            timeStamp: new Date().valueOf(),
            pointerType: "touch"
        });

        nativePointerMock().eventMock("pointermove", {
            pageX: 1,
            pageY: 2
        });

        const data1 = eventData(e1);

        assert.equal(data1.x, 1, "eventData x");
        assert.equal(data1.y, 2, "eventData y");
        assert.ok(data1.time, "eventData time");
    });

    test("dxpointer support methods", assert => {
        const e1 = nativePointerMock().eventMock("dxpointermove", {
            pageX: 1,
            pageY: 2,
            timeStamp: new Date().valueOf(),
            pointerType: "touch"
        });

        nativePointerMock().eventMock("dxpointermove", {
            pageX: 1,
            pageY: 2
        });

        const data1 = eventData(e1);

        assert.equal(data1.x, 1, "eventData x");
        assert.equal(data1.y, 2, "eventData y");
        assert.ok(data1.time, "eventData time");
    });

    test("addNamespace method", assert => {
        const event = addNamespace("custom", "Widget"),
            severalEventsByString = addNamespace("custom1 custom2", "Widget"),
            severalEventsByArray = addNamespace(["custom1", "custom2"], "Widget");

        assert.equal(event, "custom.Widget", "custom event name");
        assert.equal(severalEventsByString, "custom1.Widget custom2.Widget", "several custom event names");
        assert.equal(severalEventsByArray, "custom1.Widget custom2.Widget", "several custom event names");
    });

    test("normalizeKeyName method should normalize key name based on 'key' or 'which' attribute", assert => {
        assert.strictEqual(normalizeKeyName({ key: "Up" }), "upArrow", "IE11 API");
        assert.strictEqual(normalizeKeyName({ key: "ArrowUp" }), "upArrow", "Standard API");
        assert.strictEqual(normalizeKeyName({ key: "ArrowUp", which: 36 }), "upArrow", "'key' attribute is prior");
        assert.strictEqual(normalizeKeyName({ which: 38 }), "upArrow", "'which' attribute used where 'key' attribute unsupported");
        assert.strictEqual(normalizeKeyName({ }), undefined, "return undefined in case event has no 'key' or 'which' attribute");
    });

    test("getChar method should get char based on 'key' or 'which' attribute", assert => {
        assert.strictEqual(getChar({ key: "z" }), "z");
        assert.strictEqual(getChar({ which: 50 }), "2");
        assert.strictEqual(getChar({ key: "z", which: 50 }), "z", "'key' attribute is prior");

    });
});

QUnit.module("skip mousewheel event test", () => {
    const needSkipMouseWheel = element => {
        const mouse = pointerMock(element);
        let needSkip;

        element.on({
            "dxmousewheel": e => {
                needSkip = needSkipEvent(e);
            }
        });

        mouse.wheel();
        return needSkip;
    };

    const checkSkippedMouseWheelEvent = ($container, selector) => needSkipMouseWheel($container.find(selector).first());

    testInActiveWindow("needSkipEvent returns true for number input wheel", assert => {
        if(!/webkit/i.exec(navigator.userAgent)) {
            assert.ok(true, "this test run only in webkit");
            return;
        }

        let element;

        try {
            element = $("<input type='number' />")
                .appendTo("#qunit-fixture")
                .trigger("focus");

            assert.ok(needSkipMouseWheel(element));
        } finally {
            element.remove();
        }
    });

    testInActiveWindow("needSkipEvent returns true for text input wheel", assert => {
        let element;
        try {
            element = $("<input type='text' />")
                .appendTo("#qunit-fixture")
                .trigger("focus");

            assert.ok(!needSkipMouseWheel(element));
        } finally {
            element.remove();
        }
    });

    testInActiveWindow("needSkipEvent returns true for textarea input wheel", assert => {
        if(!/webkit/i.exec(navigator.userAgent)) {
            assert.ok(true, "this test run only in webkit");
            return;
        }

        let element;
        try {
            element = $("<textarea></textarea>")
                .appendTo("#qunit-fixture")
                .trigger("focus");

            assert.ok(needSkipMouseWheel(element));
        } finally {
            element.remove();
        }
    });

    testInActiveWindow("needSkipEvent returns true for select input wheel", assert => {
        if(!/webkit/i.exec(navigator.userAgent)) {
            assert.ok(true, "this test run only in webkit");
            return;
        }

        let element;
        try {
            element = $("<select><option /><option /><option /></select>")
                .appendTo("#qunit-fixture")
                .trigger("focus");

            assert.ok(needSkipMouseWheel(element));
        } finally {
            element.remove();
        }
    });

    testInActiveWindow("needSkipEvent returns true for contentEditable element", assert => {
        let $element;
        try {
            $element = $(`
                <div contenteditable="true">
                    <h>Test</h>
                    <div class="text">
                        <b>Bold</b>
                    </div>
                </div>
            `)
                .appendTo("#qunit-fixture")
                .trigger("focus");

            assert.ok(checkSkippedMouseWheelEvent($element, "h"), "event is skipped for the h tag");
            assert.ok(checkSkippedMouseWheelEvent($element, ".text"), "event is skipped for the element with the 'text' class name");
            assert.ok(checkSkippedMouseWheelEvent($element, "b"), "event is skipped for the b tag");
        } catch(e) {
            $element.remove();
        }
    });

    testInActiveWindow("needSkipEvent returns true for element with contenteditable false", assert => {
        let $element;
        try {
            $element = $(`
                <div contenteditable="true">
                    <h contenteditable="false">Test</h>
                    <div contenteditable="false" class="text">
                        <b contenteditable="false">Bold</b>
                    </div>
                </div>
            `)
                .appendTo("#qunit-fixture")
                .trigger("focus");

            assert.ok(checkSkippedMouseWheelEvent($element, "h"), "event is skipped for the h tag");
            assert.ok(checkSkippedMouseWheelEvent($element, ".text"), "event is skipped for the element with the 'text' class name");
            assert.ok(checkSkippedMouseWheelEvent($element, "b"), "event is skipped for the b tag");
        } catch(e) {
            $element.remove();
        }
    });

    testInActiveWindow("needSkipEvent returns false for the contentEditable element when this element is not focused", assert => {
        let $element;
        try {
            $element = $(`
                <div contenteditable="true">
                    <h>Test</h>
                    <div class="text">
                        <b>Bold</b>
                    </div>
                </div>
            `)
                .appendTo("#qunit-fixture");

            assert.notOk(checkSkippedMouseWheelEvent($element, "h"), "event is skipped for the h tag");
            assert.notOk(checkSkippedMouseWheelEvent($element, ".text"), "event is skipped for the element with the 'text' class name");
            assert.notOk(checkSkippedMouseWheelEvent($element, "b"), "event is skipped for the b tag");
        } catch(e) {
            $element.remove();
        }
    });
});

QUnit.module("skip mouse event tests", () => {
    const needSkipMouseDown = element => {
        const mouse = nativePointerMock(element);
        let needSkip;

        element.on({
            "mousedown": e => {
                needSkip = needSkipEvent(e);
            }
        });
        mouse.mouseDown();
        return needSkip;
    };

    test("needSkipEvent returns true for input click", assert => {
        const element = $("<input type='text' />");
        assert.ok(needSkipMouseDown(element));
    });

    test("needSkipEvent returns true for textarea click", assert => {
        const element = $("<textarea></textarea>");
        assert.ok(needSkipMouseDown(element));
    });

    test("needSkipEvent returns true for select click", assert => {
        const element = $("<select><option /><option /><option /></select>");
        assert.ok(needSkipMouseDown(element));
    });

    test("needSkipEvent returns false for div click", assert => {
        const element = $("<div />");
        assert.ok(!needSkipMouseDown(element));
    });

    test("needSkipEvent returns true for .dx-skip-gesture-event click", assert => {
        const element = $("<div class='dx-skip-gesture-event' />");
        assert.ok(needSkipMouseDown(element));
    });

    test("needSkipEvent returns true for nested in .dx-skip-gesture-event click", assert => {
        const element = $("<div />").appendTo("<div class='dx-skip-gesture-event' />");
        assert.ok(needSkipMouseDown(element));
    });
});

QUnit.module("skip pointer event tests", () => {
    const needSkipPointerDown = element => {
        const mouse = nativePointerMock(element);
        let needSkip;

        element.on({
            "touchstart": e => {
                needSkip = needSkipEvent(e);
            }
        });
        mouse.touchStart();
        return needSkip;
    };

    testInActiveWindow("needSkipEvent returns true for focused input click (B254465)", assert => {
        if(!/webkit/i.exec(navigator.userAgent)) {
            assert.ok(true, "this test run only in webkit");
            return;
        }

        let element;
        try {
            element = $("<input type='text' />")
                .appendTo("#qunit-fixture")
                .trigger("focus");

            assert.ok(needSkipPointerDown(element));
        } finally {
            element.remove();
        }
    });

    test("needSkipEvent returns false for not focused input click", assert => {
        const element = $("<input type='text' />");
        assert.ok(!needSkipPointerDown(element));
    });

    test("needSkipEvent returns false for div click", assert => {
        const element = $("<div />");
        assert.ok(!needSkipPointerDown(element));
    });

    test("needSkipEvent returns true for .dx-skip-gesture-event click", assert => {
        const element = $("<div class='dx-skip-gesture-event' />");
        assert.ok(needSkipPointerDown(element));
    });

    test("needSkipEvent returns true for nested in .dx-skip-gesture-event click", assert => {
        const element = $("<div />").appendTo("<div class='dx-skip-gesture-event' />");
        assert.ok(needSkipPointerDown(element));
    });
});

if(compare($.fn.jquery, [3]) < 0) {
    QUnit.module("JQuery integration", () => {
        const W3CEventProps = [
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
            $.each(["touchstart", "touchmove", "touchend", "touchcancel"], (index, eventName) => {
                test(`'${eventName}' event has all properties according to W3C (http://www.w3.org/TR/touch-eventUtils/)`, assert => {
                    const element = $("#element")
                        .on(eventName, (e) => {
                            $.each(W3CTouchEventProps, function() {
                                assert.ok(this in e, "event has '" + this + "' property");
                            });
                        })
                        .get(0);

                    nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
                });

                test(`'${eventName}' event has all jQuery properties`, assert => {
                    const element = $("#element")
                        .on(eventName, (e) => {
                            $.each(jQueryAdditionalProps, function() {
                                assert.ok(this in e, "event has '" + this + "' property");
                            });
                        })
                        .get(0);

                    nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
                });

                test(`'${eventName}' should be unsubscribed by namespace`, assert => {
                    assert.expect(0);

                    const element = $("#element")
                        .on(eventName + ".Test", (e) => {
                            assert.ok(false);
                        })
                        .off(".Test")
                        .get(0);

                    nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
                });
            });
        }

        if(navigator.msPointerEnabled) {
            $.each(["MSPointerDown", "MSPointerMove", "MSPointerUp"], (index, eventName) => {
                test(`'${eventName}' event has all properties according to W3C (http://www.w3.org/TR/pointerevents/)`, assert => {
                    const element = $("#element")
                        .on(eventName, (e) => {
                            $.each(W3CPointerEventProps, function() {
                                assert.ok(this in e, "event has '" + this + "' property");
                            });
                        })
                        .get(0);

                    nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
                });

                test(`'${eventName}' event has all jQuery properties`, assert => {
                    const element = $("#element")
                        .on(eventName, (e) => {
                            $.each(jQueryAdditionalProps, function() {
                                assert.ok(this in e, "event has '" + this + "' property");
                            });
                        })
                        .get(0);

                    nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
                });

                test(`'${eventName}' should be unsubscribed by namespace`, assert => {
                    assert.expect(0);

                    const element = $("#element")
                        .on(eventName + ".Test", (e) => {
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
                test(`'${eventName}' event has all properties according to W3C (http://www.w3.org/TR/pointerevents/)`, assert => {
                    const element = $("#element")
                        .on(eventName, (e) => {
                            $.each(W3CPointerEventProps, function() {
                                assert.ok(this in e, "event has '" + this + "' property");
                            });
                        })
                        .get(0);

                    nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
                });

                test(`'${eventName}' event has all jQuery properties`, assert => {
                    const element = $("#element")
                        .on(eventName, (e) => {
                            $.each(jQueryAdditionalProps, function() {
                                assert.ok(this in e, "event has '" + this + "' property");
                            });
                        })
                        .get(0);

                    nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
                });

                test(`'${eventName}' should be unsubscribed by namespace`, assert => {
                    assert.expect(0);

                    const element = $("#element")
                        .on(eventName + ".Test", (e) => {
                            assert.ok(false);
                        })
                        .off(".Test")
                        .get(0);

                    nativePointerMock.simulateEvent(element, eventName, { touches: [1], changedTouches: [1] });
                });
            });
        }
    });

    QUnit.module("regressions", () => {
        $.each("touchstart touchend touchmove touchcancel".split(" "), (_, eventName) => {
            test(eventName + " - some event properties should not be undefined", assert => {
                const event = $.event.fix({ type: eventName, touches: [], changedTouches: [{ screenX: 123, screenY: 321, clientX: 345, clientY: 543, pageX: 678, pageY: 876 }] });

                assert.equal(event.screenX, 123, "event.screenX is defined");
                assert.equal(event.screenY, 321, "event.screenY is defined");

                assert.equal(event.clientX, 345, "event.clientX is defined");
                assert.equal(event.clientY, 543, "event.clientY is defined");

                assert.equal(event.pageX, 678, "event.pageX is defined");
                assert.equal(event.pageY, 876, "event.pageY is defined");
            });
        });
    });
}
