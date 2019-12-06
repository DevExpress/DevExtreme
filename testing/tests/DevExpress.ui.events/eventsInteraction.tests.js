var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    domUtils = require("core/utils/dom"),
    devices = require("core/devices"),
    eventUtils = require("events/utils"),
    Emitter = require("events/core/emitter"),
    GestureEmitter = require("events/gesture/emitter.gesture"),
    registerEmitter = require("events/core/emitter_registrator"),
    feedbackEvents = require("events/core/emitter.feedback"),
    scrollEvents = require("ui/scroll_view/ui.events.emitter.gesture.scroll"),
    holdEvent = require("events/hold"),
    swipeEvents = require("events/swipe"),
    transformEvent = require("events/transform"),
    dragEvents = require("events/drag"),
    dblclickEvent = require("events/dblclick"),
    pointerMock = require("../../helpers/pointerMock.js");

QUnit.testStart(function() {
    var markup =
        '<div id="parent">\
            <div id="child"></div>\
        </div>\
        <div id="element" style="cursor: move"></div>';

    $("#qunit-fixture").html(markup);
});

var moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
};

GestureEmitter.touchBoundary(GestureEmitter.initialTouchBoundary);


QUnit.module("events unsubscribing", {

    beforeEach: function() {
        this.emitterCreated = 0;
        this.emitterDisposed = 0;

        var that = this;

        registerEmitter({
            emitter: Emitter.inherit({

                ctor: function() {
                    this.callBase.apply(this, arguments);

                    that.emitterCreated++;
                },

                dispose: function() {
                    this.callBase.apply(this, arguments);

                    that.emitterDisposed++;
                }

            }),
            events: ["dxteststart", "dxtestend"]
        });
    }

});

QUnit.test("emitter should be created only after first emitter event subscribed", function(assert) {
    var $element = $("#element");

    $element.on("dxteststart", noop);
    assert.equal(this.emitterCreated, 1);
    $element.on("dxtestend", noop);
    assert.equal(this.emitterCreated, 1);
});

QUnit.test("emitter should be removed only after last emitter event unsubscribed", function(assert) {
    var $element = $("#element")
        .on("dxteststart", noop)
        .on("dxtestend", noop);

    $element.off("dxteststart");
    assert.equal(this.emitterDisposed, 0);
    $element.off("dxtestend");
    assert.equal(this.emitterDisposed, 1);
});


QUnit.module("click and hold", moduleConfig);

QUnit.test("click should not be fired twice on parent", function(assert) {
    var clickFired = 0,
        $parent = $("#parent"),
        $child = $("#child"),
        pointer = pointerMock($child);

    $child.on("dxclick", noop);
    $parent.on("dxclick", function() {
        clickFired++;
    });

    pointer.start().down().up();

    assert.equal(clickFired, 1, "click not fired");
});

QUnit.test("click should not be fired after hold", function(assert) {
    var $element = $("#element"),
        pointer = pointerMock($element);

    $element.on(holdEvent.name, function() {
        assert.ok(true, "hold fired");
    });
    $element.on("dxclick", function() {
        assert.ok(false, "click fired");
    });

    pointer.start().down();
    this.clock.tick(1800);
    pointer.wait(1800).up();
});

QUnit.test("hold should be fired after click on next gesture", function(assert) {
    var holdFired = 0,
        clickFired = 0,
        $element = $("#element"),
        pointer = pointerMock($element);

    $element.on(holdEvent.name, function() {
        holdFired++;
    });
    $element.on("dxclick", function() {
        clickFired++;
    });

    pointer.start().down().up();
    assert.equal(holdFired, 0, "hold not fired");
    assert.equal(clickFired, 1, "click fired");

    pointer.start().down();
    this.clock.tick(1800);
    pointer.wait(1800).up();
    assert.equal(holdFired, 1, "hold fired");
    assert.equal(clickFired, 1, "click not fired");
});

QUnit.test("click should be fired after canceled hold", function(assert) {
    var clickFired = 0,
        $element = $("#element"),
        pointer = pointerMock($element);

    $element.on(holdEvent.name, function(e) {
        e.cancel = true;
    });
    $element.on("dxclick", function() {
        clickFired++;
    });

    pointer.start().down();
    this.clock.tick(1800);
    pointer.wait(1800).up();
    assert.equal(clickFired, 1, "click not fired");
});

QUnit.test("click should not be fired after unsubscribed on callback hold", function(assert) {
    var clickFired = 0,
        $element = $("#element"),
        pointer = pointerMock($element);

    $element
        .on("dxclick", function() {
            clickFired++;
        })
        .on(holdEvent.name, function(e) {
            $element.off(holdEvent.name);
        });

    pointer.start().down();
    this.clock.tick(1800);
    pointer.wait(1800).up();
    assert.equal(clickFired, 0, "click not fired");
});


QUnit.module("click and hold with feedback", moduleConfig);

QUnit.test("inactive should be fired after click with timeout", function(assert) {
    var $parent = $("#parent"),
        $child = $("#child"),
        inactiveFired = 0;

    $child.on("dxclick", noop);
    $parent.on(feedbackEvents.inactive, { timeout: 100 }, function() {
        inactiveFired++;
    });

    pointerMock($child).start("touch").down().up();
    assert.equal(inactiveFired, 0, "inactive not fired");
    this.clock.tick(100);
    assert.equal(inactiveFired, 1, "inactive fired after timeout");
});

QUnit.test("inactive should be fired after hold without timeout", function(assert) {
    var $parent = $("#parent"),
        $child = $("#child"),
        inactiveFired = 0,
        pointer = pointerMock($child);

    $child.on(holdEvent.name, { timeout: 500 }, noop);
    $parent.on(feedbackEvents.inactive, { timeout: 100 }, function() {
        inactiveFired++;
    });

    pointer.start().down();
    this.clock.tick(500);
    pointer.wait(500);
    assert.equal(inactiveFired, 1, "inactive fired without timeout");
});


QUnit.module("click and dblclick", moduleConfig);

QUnit.test("dblclick should be fired with dxclick", function(assert) {
    var clickFired = 0,
        dblclickFired = 0,
        $child = $("#child"),
        pointer = pointerMock($child);

    $child
        .on("dxclick", function() {
            clickFired++;
        })
        .on(dblclickEvent.name, function() {
            dblclickFired++;
        });

    pointer.start().click().click();

    assert.equal(clickFired, 2, "click fired twice");
    assert.equal(dblclickFired, 1, "dblclick fired once");
});


QUnit.module("singletouch gestures");

QUnit.test("gesture should not be started if direction doesn't detected on first move", function(assert) {
    assert.expect(0);

    var $element = $("#element").on("dxscrollstart", function() {
            assert.ok(false);
        }),
        pointer = pointerMock($element);

    pointer.start().down().move().up();
});

QUnit.test("gesture should be started with diagonal move", function(assert) {
    assert.expect(1);

    var $element = $("#element").on("dxscrollstart", { direction: "vertical" }, function() {
            assert.ok(true);
        }),
        pointer = pointerMock($element);

    pointer.start().down().move(30, 20);
});

QUnit.test("minimum distance for gesture should be 10 pixels", function(assert) {
    var scrollStarted,
        $element = $("#element").on("dxscrollstart", { direction: "both" }, function() {
            scrollStarted = true;
        }),
        pointer = pointerMock($element);

    pointer.start().down().move(9);
    assert.ok(!scrollStarted, "scroll not started");

    pointer.move(1).up();
    assert.ok(scrollStarted, "scroll started");
});

var GESTURE_COVER_CLASS = "dx-gesture-cover",
    $gestureCover = $("." + GESTURE_COVER_CLASS);

var gestureCoverExists = function() {
    return devices.real().deviceType === "desktop" && $gestureCover.css("pointerEvents") !== undefined;
};

QUnit.test("wheel should be prevented on gesture cover (T319068)", function(assert) {
    if(!gestureCoverExists()) {
        assert.expect(0);
        return;
    }

    var event = $.Event("dxmousewheel");
    $("." + GESTURE_COVER_CLASS).trigger(event);
    assert.equal(event.isDefaultPrevented(), true, "scroll prevented");
});

QUnit.test("selection shouldn't be prevented in native scroll", function(assert) {
    if(!gestureCoverExists()) {
        assert.expect(0);
        return;
    }

    var $element = $("#element"),
        pointer = pointerMock($element);

    $element.on("dxscrollstart", { isNative: true }, $.noop);

    pointer.start().down().move(20);
    assert.equal($gestureCover.css("pointerEvents"), "none", "gestureCover is disabled");
});

$.each([
    ["hover", "pointer-events", "all", true],
    ["cursor", "cursor", "move", false]
], function(_, config) {
    var name = config[0],
        prop = config[1],
        propValue = config[2],
        needReset = config[3];

    if(!gestureCoverExists()) {
        return;
    }

    QUnit.test("gesture should set " + name + " if needed with pointer", function(assert) {
        assert.expect(2);

        var originalProp = $gestureCover.css(prop),
            $element = $("#element"),
            pointer = pointerMock($element);

        $element.on({
            "dxscrollstart": function(e) {
                assert.equal($gestureCover.css(prop), propValue, name + " is disabled");
            },
            "dxscrollend": function() {
                assert.equal($gestureCover.css(prop), needReset ? originalProp : propValue, name + " is enabled");
            }
        });

        pointer.start().down().move(20).up();
    });

    QUnit.test("gesture should set " + name + " if needed with mousewheel", function(assert) {
        assert.expect(2);

        var originalProp = $gestureCover.css(prop),
            $element = $("#element"),
            pointer = pointerMock($element);

        $element.on({
            "dxscrollstart": function(e) {
                assert.equal($gestureCover.css(prop), propValue, name + " is disabled");
            },
            "dxscrollend": function() {
                assert.equal($gestureCover.css(prop), needReset ? originalProp : propValue, name + " is enabled");
            }
        });

        pointer.start().wheel(20);
    });

    QUnit.test("cancel gesture should reset " + name + " on desktop", function(assert) {
        var originalProp = $gestureCover.css(prop),
            $element = $("#element"),
            pointer = pointerMock($element);

        $element.on({
            "dxscrollstart": function(e) {
                e.cancel = true;
            }
        });

        pointer.start().down().move(20).up();
        assert.equal($gestureCover.css(prop), needReset ? originalProp : propValue, name + " is enabled");
    });

    QUnit.test("dispose gesture should reset " + name + " if locked by current emitter", function(assert) {
        var originalProp = $gestureCover.css(prop),
            $element = $("#element"),
            pointer = pointerMock($element);

        $element.on({
            "dxscrollstart.TEST": noop
        });

        pointer.start().down().move(20);
        $element.off(".TEST");
        assert.equal($gestureCover.css(prop), needReset ? originalProp : propValue, name + " is enabled");
    });

    QUnit.test("dispose gesture should not reset " + name + " if locked by another emitter", function(assert) {
        var $child = $("#child"),
            $parent = $("#parent"),
            pointer = pointerMock($child);

        $child.on("dxscrollstart", noop);
        $parent.on("dxscrollstart.TEST", noop);

        pointer.start().down().move(20);
        var assignedProp = $gestureCover.css(prop);
        $parent.off(".TEST");
        assert.equal($gestureCover.css(prop), assignedProp, name + " is enabled");
    });
});

QUnit.test("gesture should be canceled if event should be skipped", function(assert) {
    assert.expect(1);

    try {
        eventUtils.forceSkipEvents();

        var $element = $("#element"),
            pointer = pointerMock($element);

        $element.on({
            "dxscrollcancel": function(e) {
                assert.ok(true, "gesture canceled");
            }
        });

        pointer.start().down().move(20);
    } finally {
        eventUtils.stopEventsSkipping();
    }
});

QUnit.test("text selection should be reset on gesture start", function(assert) {
    assert.expect(1);

    var originalClearSelection = domUtils.clearSelection;

    try {
        domUtils.clearSelection = function() { assert.ok(true, "selection cleared"); };

        var $element = $("#element"),
            pointer = pointerMock($element);

        $element.on("dxscrollstart", noop);

        pointer.start().down().move(20);
    } finally {
        domUtils.clearSelection = originalClearSelection;
    }
});

QUnit.test("text selection shouldn't be reset on native scroll", function(assert) {
    assert.expect(0);

    var originalClearSelection = domUtils.clearSelection;

    try {
        domUtils.clearSelection = function() { assert.ok(false, "selection cleared"); };

        var $element = $("#element"),
            pointer = pointerMock($element);

        $element.on("dxscrollstart", { isNative: true }, $.noop);

        pointer.start().down().move(20);
    } finally {
        domUtils.clearSelection = originalClearSelection;
    }
});

QUnit.test("text selection should be reset on gesture move", function(assert) {
    assert.expect(1);

    var originalClearSelection = domUtils.clearSelection;

    try {
        var $element = $("#element"),
            pointer = pointerMock($element);

        $element.on("dxscrollstart", noop);

        pointer.start().down().move(20);
        domUtils.clearSelection = function() { assert.ok(true, "selection cleared"); };
        pointer.move(20);
    } finally {
        domUtils.clearSelection = originalClearSelection;
    }
});

QUnit.test("test selection should not reset on mouseWheel and touch events", function(assert) {
    assert.expect(0);

    var originalClearSelection = domUtils.clearSelection;

    try {
        domUtils.clearSelection = function() { assert.ok(false); };

        var $element = $("#element");
        var pointer = pointerMock($element);

        $element.on("dxscrollstart", { validate: function() { return true; } }, noop);

        pointer.start().wheel(-10);

        pointer.start("touch").down().move(20);
    } finally {
        domUtils.clearSelection = originalClearSelection;
    }
});

var testContinuous = function(config) {
    QUnit.test(config.element.direction + " " + config.element.event, function(assert) {
        var elementFiredCount = 0;

        var $element = $("#element").on(config.element.event, { direction: config.element.direction }, function() {
            elementFiredCount++;
        });

        pointerMock($element)
            .start()
            .down()
            .move(config.startDirection === "horizontal" ? 10 : 0, config.startDirection === "vertical" ? 10 : 0)
            .move(config.endDirection === "horizontal" ? 10 : 0, config.endDirection === "vertical" ? 10 : 0);

        assert.equal(elementFiredCount, 1);
    });
};

testContinuous({
    element: { event: scrollEvents.move, direction: "vertical" },
    startDirection: "horizontal",
    endDirection: "vertical"
});

testContinuous({
    element: { event: scrollEvents.move, direction: "horizontal" },
    startDirection: "vertical",
    endDirection: "horizontal"
});


var testNestedGesture = function(config) {
    QUnit.test(config.parent.direction + " " + config.parent.event.replace("dx", "") +
        " in " + config.child.direction + " " + config.child.event.replace("dx", ""), function(assert) {

        var childFiredCount = 0;
        var parentFiredCount = 0;

        $("#parent").on(config.parent.event, { direction: config.parent.direction }, function() {
            parentFiredCount++;
        });

        var $child = $("#child").on(config.child.event, { direction: config.child.direction }, function() {
            childFiredCount++;
        });

        pointerMock($child).start()
            .down()
            .move(config.direction === "horizontal" ? 10 : 0, config.direction === "vertical" ? 10 : 0);

        assert.equal(parentFiredCount, config.success === "parent" ? 1 : 0);
        assert.equal(childFiredCount, config.success === "child" ? 1 : 0);
    });
};

var testNestedGestureSuite = function(firstGesture, secondGesture, testBothDirection) {

    testNestedGesture({
        parent: { event: secondGesture, direction: "horizontal" },
        child: { event: firstGesture, direction: "horizontal" },
        direction: "horizontal",
        success: "child"
    });

    testNestedGesture({
        parent: { event: secondGesture, direction: "vertical" },
        child: { event: firstGesture, direction: "vertical" },
        direction: "vertical",
        success: "child"
    });

    testNestedGesture({
        parent: { event: secondGesture, direction: "horizontal" },
        child: { event: firstGesture, direction: "vertical" },
        direction: "horizontal",
        success: "parent"
    });

    testNestedGesture({
        parent: { event: secondGesture, direction: "vertical" },
        child: { event: firstGesture, direction: "horizontal" },
        direction: "vertical",
        success: "parent"
    });

    if(testBothDirection) {
        testNestedGesture({
            parent: { event: secondGesture, direction: "vertical" },
            child: { event: firstGesture, direction: "both" },
            direction: "vertical",
            success: "child"
        });

        testNestedGesture({
            parent: { event: secondGesture, direction: "horizontal" },
            child: { event: firstGesture, direction: "both" },
            direction: "horizontal",
            success: "child"
        });
    }
};

QUnit.module("nested singletouch gestures");

var gestures = [scrollEvents.move, swipeEvents.swipe, dragEvents.move];
$.each(gestures, function(_, firstGesture) {
    $.each(gestures, function(_, secondGesture) {
        testNestedGestureSuite(firstGesture, secondGesture, firstGesture !== swipeEvents.swipe);
    });
});


var testNestedGestureAcceptingOnUnsubscribing = function(parentGesture, childGesture) {
    QUnit.test(parentGesture.replace("dx", "") +
        " in " + childGesture.replace("dx", ""), function(assert) {

        var $parent = $("#parent");
        var $child = $("#child");
        var parentFiredCount = 0;

        $parent.on(parentGesture, { direction: "vertical" }, function() {
            parentFiredCount++;
        });

        $child.on(childGesture, { direction: "vertical" }, function() {
            $child.off(childGesture);
        });

        pointerMock($child)
            .start()
            .down()
            .move(0, 10);

        assert.equal(parentFiredCount, 0);
    });
};

QUnit.module("nested singletouch gestures accepting on unsubscribing");

gestures = [scrollEvents.move, swipeEvents.swipe, dragEvents.move];
$.each(gestures, function(_, firstGesture) {
    $.each(gestures, function(_, secondGesture) {
        testNestedGestureAcceptingOnUnsubscribing(firstGesture, secondGesture);
    });
});


var testNestedGestureCanceling = function(parentGesture, childGesture) {
    QUnit.test(parentGesture.replace("dx", "") +
        " in " + childGesture.replace("dx", ""), function(assert) {

        var $parent = $("#parent");
        var $child = $("#child");
        var parentFiredCount = 0;

        $parent.on(parentGesture, { direction: "vertical" }, function() {
            parentFiredCount++;
        });

        $child.on(childGesture, { direction: "vertical" }, function(e) {
            e.cancel = true;
        });

        pointerMock($child)
            .start()
            .down()
            .move(0, 10);

        assert.equal(parentFiredCount, 1);
    });
};

QUnit.module("nested singletouch gestures cancelling");

gestures = [scrollEvents.move, swipeEvents.swipe, dragEvents.move];
$.each(gestures, function(_, firstGesture) {
    $.each(gestures, function(_, secondGesture) {
        testNestedGestureCanceling(firstGesture, secondGesture);
    });
});


QUnit.module("singletouch immediate gestures", moduleConfig);

QUnit.test("gesture should be started with specified direction immediately", function(assert) {
    assert.expect(2);

    var $element = $("#element").on(swipeEvents.start, { immediate: true, direction: "horizontal" }, function(e) {
            assert.ok(true, "swipestart was fired");
            assert.equal(e.pageX, 0, "pageX is correct");
        }),
        pointer = pointerMock($element);

    pointer.start().down().move(1).up();
});

QUnit.test("gesture should not be started immediately without detected direction", function(assert) {
    assert.expect(0);

    var $element = $("#element").on(swipeEvents.start, { immediate: true, direction: "horizontal" }, function() {
            assert.ok(false, "swipestart was fired");
        }),
        pointer = pointerMock($element);

    pointer.start().down().move(0).up();
});

QUnit.test("gesture should be started with wrong direction after timeout", function(assert) {
    var $element = $("#element").on(swipeEvents.start, { immediate: true, direction: "horizontal" }, function() {
            swipeFired++;
        }),
        pointer = pointerMock($element),
        swipeFired = 0;

    pointer.start().down().move(0, 1);
    assert.equal(swipeFired, 0, "swipestart was fired");
    this.clock.tick(180);
    pointer.move(0, 1);
    assert.equal(swipeFired, 1, "swipestart was fired");
});

QUnit.test("not immediate gesture should not be started with wrong direction after timeout", function(assert) {
    var $element = $("#element").on(swipeEvents.start, { immediate: false, direction: "horizontal" }, function() {
            swipeFired++;
        }),
        pointer = pointerMock($element),
        swipeFired = 0;

    pointer.start().down().move(0, 1);
    assert.equal(swipeFired, 0, "swipestart was fired");
    this.clock.tick(180);
    pointer.move(0, 10);
    assert.equal(swipeFired, 0, "swipestart was fired");
});

QUnit.test("gesture should not be started with wrong direction without timeout", function(assert) {
    var $element = $("#element").on(swipeEvents.start, { immediate: true, direction: "horizontal" }, function() {
            swipeFired++;
        }),
        pointer = pointerMock($element),
        swipeFired = 0;

    pointer.start().down().move(0, 1);
    assert.equal(swipeFired, 0, "swipestart was not fired");
    pointer.move(0, 11);
    assert.equal(swipeFired, 0, "swipestart was not fired");
});

QUnit.test("gesture should not be started with wrong and specified direction without timeout (horizontal)", function(assert) {
    var $element = $("#element").on(swipeEvents.start, { immediate: true, direction: "horizontal" }, function() {
            swipeFired++;
        }),
        pointer = pointerMock($element),
        swipeFired = 0;

    pointer.start().down().move(5, 10);
    assert.equal(swipeFired, 0, "swipestart was not fired");
});

QUnit.test("gesture should not be started with wrong and specified direction without timeout (vertical)", function(assert) {
    var $element = $("#element").on(swipeEvents.start, { immediate: true, direction: "vertical" }, function() {
            swipeFired++;
        }),
        pointer = pointerMock($element),
        swipeFired = 0;

    pointer.start().down().move(10, 5);
    assert.equal(swipeFired, 0, "swipestart was not fired");
});

QUnit.test("second gesture should not be started with wrong direction without timeout", function(assert) {
    var $element = $("#element").on(swipeEvents.start, { immediate: true, direction: "horizontal" }, function() {
            swipeFired++;
        }),
        pointer = pointerMock($element),
        swipeFired = 0;

    pointer.start().down().move(0, 1);
    assert.equal(swipeFired, 0, "swipestart was not fired");
    this.clock.tick(170);
    pointer.up().down().move(0, 1);
    this.clock.tick(10);
    pointer.move(0, 1);
    assert.equal(swipeFired, 0, "swipestart was not fired");
});


QUnit.module("simple events with singletouch gestures", moduleConfig);

QUnit.test("click should not be fired after swipe", function(assert) {
    var $element = $("#element"),
        pointer = pointerMock($element);

    $element.on("dxclick", function() {
        assert.ok(false, "click fired");
    });
    $element.on(swipeEvents.swipe, { direction: "horizontal" }, function() {
        assert.ok(true, "swipe fired");
    });

    pointer.start().down().move(100).up();
});

QUnit.test("hold should not be fired after swipe", function(assert) {
    var $element = $("#element"),
        pointer = pointerMock($element);

    $element.on(holdEvent.name, function() {
        assert.ok(false, "hold fired");
    });
    $element.on(swipeEvents.swipe, { direction: "horizontal" }, function() {
        assert.ok(true, "swipe fired");
    });

    pointer.start().down().move(100);
    this.clock.tick(1800);
    pointer.wait(1800).up();
});

QUnit.test("swipe should not be fired after hold", function(assert) {
    var $element = $("#element"),
        pointer = pointerMock($element);

    $element.on(holdEvent.name, function() {
        assert.ok(true, "hold fired");
    });
    $element.on(swipeEvents.swipe, { direction: "horizontal" }, function() {
        assert.ok(false, "swipe fired");
    });

    pointer.start().down();
    this.clock.tick(1800);
    pointer.wait(1800).move(100).up();
});


QUnit.module("singletouch gestures with feedback", moduleConfig);

QUnit.test("inactive should be fired after swipe without timeout if swipe started with delay", function(assert) {
    var $parent = $("#parent"),
        $child = $("#child"),
        inactiveFired = 0,
        pointer = pointerMock($child);

    $child.on(swipeEvents.swipe, { direction: "horizontal" }, noop);
    $parent
        .on(feedbackEvents.active, { timeout: 10 }, noop)
        .on(feedbackEvents.inactive, { timeout: 100 }, function() {
            inactiveFired++;
        });

    pointer.start().down();
    this.clock.tick(10);
    pointer.move(50);
    assert.equal(inactiveFired, 1, "inactive fired without timeout");
});


QUnit.module("singletouch gestures with mousewheel", moduleConfig);

var wheelBlockedEvents = {};
wheelBlockedEvents[dragEvents.move] = true;
wheelBlockedEvents[swipeEvents.swipe] = true;
wheelBlockedEvents["dxclick"] = false;

wheelBlockedEvents[feedbackEvents.active] = false;

$.each(wheelBlockedEvents, function(eventName, blockMouseWheel) {
    QUnit.test(eventName + " gesture should not be canceled by mousewheel", function(assert) {
        var $element = $("#element");

        $element.on(eventName, function() {
            assert.ok(true);
        });

        $element.on(scrollEvents.move, {
            direction: "vertical",
            validate: function() { return true; }
        }, function() {
            assert.ok(!blockMouseWheel);
        });

        pointerMock($element).start().down().move(blockMouseWheel ? 10 : 9, blockMouseWheel ? 10 : 9).wheel(60);
    });
});

QUnit.test("first vertical scroll should be selected if scrolling by wheel without shift", function(assert) {
    $("#parent").on(scrollEvents.move, {
        direction: "vertical",
        validate: function() { return true; }
    }, function() {
        assert.ok(true);
    });

    var $child = $("#child").on(scrollEvents.move, {
        direction: "horizontal",
        validate: function() { return true; }
    }, function() {
        assert.ok(false);
    });

    pointerMock($child).start().wheel(60);
});

QUnit.test("first both scroll should be selected if scrolling by wheel without shift", function(assert) {
    $("#parent").on(scrollEvents.move, {
        direction: "both",
        validate: function() { return true; }
    }, function() {
        assert.ok(true);
    });

    var $child = $("#child").on(scrollEvents.move, {
        direction: "horizontal",
        validate: function() { return true; }
    }, function() {
        assert.ok(false);
    });

    pointerMock($child).start().wheel(60);
});

QUnit.test("first horizontal scroll should be selected if scrolling by wheel with shift", function(assert) {
    $("#parent").on(scrollEvents.move, {
        direction: "horizontal",
        validate: function() { return true; }
    }, function() {
        assert.ok(true);
    });

    var $child = $("#child").on(scrollEvents.move, {
        direction: "vertical",
        validate: function() { return true; }
    }, function() {
        assert.ok(false);
    });

    pointerMock($child).start().wheel(60, true);
});

QUnit.test("first both scroll should be selected if scrolling by wheel with shift", function(assert) {
    $("#parent").on(scrollEvents.move, {
        direction: "both",
        validate: function() { return true; }
    }, function() {
        assert.ok(true);
    });

    var $child = $("#child").on(scrollEvents.move, {
        direction: "vertical",
        validate: function() { return true; }
    }, function() {
        assert.ok(false);
    });

    pointerMock($child).start().wheel(60, true);
});


var testMultitouch = function(config) {
    QUnit.test(config.parent.event + " in " + config.child.event, function(assert) {
        var log = [];

        $("#parent").on(config.parent.event, function() {
            log.push("parent");
        });

        var $child = $("#child").on(config.child.event, function() {
            log.push("child");
        });

        var pointers = [],
            pageX = 0,
            pageY = 0;
        $.each(config.actions, function(_, action) {
            switch(action) {
                case "down":
                    pointers.push({ pageX: 0, pageY: 0 });
                    $child.trigger($.Event("dxpointerdown", { pageX: pageX, pageY: pageY, pointers: pointers, pointerType: "touch" }));
                    break;
                case "verticalMove":
                    pageY += 10;

                    if(pointers[0]) {
                        pointers[0].pageY += 10;
                    }

                    $child.trigger($.Event("dxpointermove", { pageX: pageX, pageY: pageY, pointers: pointers, pointerType: "touch" }));
                    break;
                case "up":
                    pointers.shift();
                    $child.trigger($.Event("dxpointerup", { pageX: pageX, pageY: pageY, pointers: pointers, pointerType: "touch" }));
                    break;
            }
        });

        assert.deepEqual(log, config.success);
    });
};


QUnit.module("multitouch");

testMultitouch({
    parent: { event: transformEvent.transform },
    child: { event: transformEvent.transform },
    actions: ["down", "verticalMove", "down", "verticalMove"],
    success: ["child"]
});


QUnit.module("multitouch with singletouch gestures");

testMultitouch({
    parent: { event: scrollEvents.move, direction: "both" },
    child: { event: transformEvent.transform },
    actions: ["down", "verticalMove", "down", "verticalMove", "up", "verticalMove"],
    success: ["parent", "child", "parent"]
});

testMultitouch({
    parent: { event: scrollEvents.move, direction: "horizontal" },
    child: { event: "dxtransformend" },
    actions: ["down", "verticalMove", "down", "verticalMove", "up", "verticalMove"],
    success: ["parent", "child", "parent"]
});

testMultitouch({
    parent: { event: "dxscrollend", direction: "both" },
    child: { event: "dxtransformend" },
    actions: ["down", "verticalMove", "down", "verticalMove", "up", "verticalMove", "up"],
    success: ["parent", "child", "parent"]
});

testMultitouch({
    parent: { event: "dxtransformstart", direction: "both" },
    child: { event: "dxscrollend" },
    actions: ["down", "verticalMove", "down", "verticalMove", "up", "verticalMove", "up"],
    success: ["child", "parent", "child"]
});

testMultitouch({
    parent: { event: "dxscrollstart", direction: "both" },
    child: { event: "dxtransformstart" },
    actions: ["down", "verticalMove", "down", "verticalMove", "down", "verticalMove"],
    success: ["parent", "child"]
});

testMultitouch({
    parent: { event: scrollEvents.move, direction: "both" },
    child: { event: transformEvent.transform },
    actions: ["down", "verticalMove", "down", "verticalMove", "down", "verticalMove"],
    success: ["parent", "child", "child"]
});

testMultitouch({
    parent: { event: "dxscrollend", direction: "both" },
    child: { event: "dxtransformend" },
    actions: ["down", "verticalMove", "down", "verticalMove", "down", "verticalMove", "up"],
    success: ["parent"]
});

testMultitouch({
    parent: { event: "dxscrollend", direction: "both" },
    child: { event: "dxtransformend" },
    actions: ["down", "verticalMove", "down", "verticalMove", "up", "verticalMove", "up", "verticalMove"],
    success: ["parent", "child", "parent"]
});


QUnit.module("events unsubscription");

QUnit.test("manager resets only needed emitter", function(assert) {
    var testEmitter = Emitter.inherit({
        end: function(e) {
            $(e.target).trigger("dxtestevent");
        },
        validatePointers: function() {
            return true;
        }
    });

    registerEmitter({
        emitter: testEmitter,
        bubble: true,
        events: [
            "dxtestevent"
        ]
    });

    var $child = $("#child").on("dxtestevent", function() {
        assert.ok("false", "dxtestevent should not be fired for child element");
    });

    $("#parent").on("dxtestevent", function() {
        assert.ok("true", "dxtestevent should be fired for parent element");
    });

    $child.trigger("dxpointerdown");
    $child.off("dxtestevent");
    $child.trigger("dxpointerup");
});

QUnit.test("active emitter should not be reset if inactive emitter was unsubscribed", function(assert) {
    assert.expect(1);

    var $element = $("#element")
        .on(dragEvents.move, noop)
        .on(dragEvents.end, function() {
            assert.ok(true, "dragend was fired");
        });

    var pointer = pointerMock($element);
    pointer.start().down().move(10);

    $element
        .on(scrollEvents.move, noop)
        .off(scrollEvents.move);

    pointer.up();
});
