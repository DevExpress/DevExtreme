import $ from "jquery";
import { noop } from "core/utils/common";
import clickEvent from "events/click";
import domUtils from "core/utils/dom";
import support from "core/utils/support";
import devices from "core/devices";
import pointerMock from "../../helpers/pointerMock.js";
import nativePointerMock from "../../helpers/nativePointerMock.js";

QUnit.testStart(function() {
    var markup =
        '<div id="inputWrapper">\
            <input id="input" />\
        </div>\
        <div id="container">\
            <div id="element">\
                <div id="wrapper">\
                    <div><div id="first"></div></div>\
                    <div><div id="second"></div></div>\
                </div>\
            </div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var moduleConfig = {
    beforeEach: function() {
        this.element = $("#element");
        this.container = $("#container");

        this.clock = sinon.useFakeTimers();

        this._originalAnimFrame = clickEvent.misc.requestAnimationFrame;
        clickEvent.misc.requestAnimationFrame = function(callback) {
            callback();
        };
    },
    afterEach: function() {
        this.clock.restore();
        clickEvent.misc.requestAnimationFrame = this._originalAnimFrame;
    }
};


QUnit.module("click handler", moduleConfig);

QUnit.test("event triggers", function(assert) {
    assert.expect(1);

    var $element = this.element.on("dxclick", function(e) {
        assert.ok(e);
    });

    pointerMock($element).start().down().up();
});

QUnit.test("event args", function(assert) {
    var fields = ["altKey", "cancelable", "clientX", "clientY",
        "ctrlKey", "currentTarget", "data", "delegateTarget",
        "isDefaultPrevented", "metaKey", "originalEvent",
        "pageX", "pageY", "screenX", "screenY", "shiftKey",
        "target", "timeStamp", "type", "view", "which"];

    var element = this.element.on("dxclick", function(e) {
        $.each(fields, function() {
            assert.ok(this in e, this);
        });
    });

    nativePointerMock(element).start().down().up();
});

QUnit.test("unsubscribing", function(assert) {
    assert.expect(0);

    var $element = this.element
        .on("dxclick", function(e) {
            assert.ok(e);
        })
        .off("dxclick");

    pointerMock($element).start().down().up();
});

QUnit.test("delegated handlers", function(assert) {
    assert.expect(1);

    this.container.on("dxclick", "#element", function(e) {
        assert.ok(e);
    });

    pointerMock(this.element).start().down().up();
});

QUnit.test("bubbling", function(assert) {
    assert.expect(4);

    this.container.on("dxclick", function(e) {
        assert.ok(e);
        assert.equal(e.type, "dxclick");
    });

    this.element.on("dxclick", function(e) {
        assert.ok(e);
        assert.equal(e.type, "dxclick");
    });

    this.element.trigger("dxclick");
});

QUnit.test("regression: dxclick should triggers only on left mouse button click", function(assert) {
    if(clickEvent.useNativeClick) {
        assert.expect(0);
        return;
    }

    var triggered = 0,
        element = this.element.on("dxclick", function(e) { triggered++; });

    element
        .trigger($.Event("dxpointerdown", { which: 1, pointerType: "mouse", pointers: [null] }))
        .trigger($.Event("dxpointerup", { which: 1, pointerType: "mouse", pointers: [] }));
    assert.equal(triggered, 1, "left button click");

    element
        .trigger($.Event("dxpointerdown", { which: 2, pointerType: "mouse", pointers: [null] }))
        .trigger($.Event("dxpointerup", { which: 2, pointerType: "mouse", pointers: [] }));
    assert.equal(triggered, 1, "middle button click");

    element
        .trigger($.Event("dxpointerdown", { which: 3, pointerType: "mouse", pointers: [null] }))
        .trigger($.Event("dxpointerup", { which: 3, pointerType: "mouse", pointers: [] }));
    assert.equal(triggered, 1, "right button click");
});

QUnit.test("click subscription should make element clickable (Q559654)", function(assert) {
    if(clickEvent.useNativeClick) {
        assert.expect(0);
        return;
    }

    this.element.on("dxclick", noop);
    assert.equal(this.element.attr("onclick"), "void(0)");
});

QUnit.test("click subscription should not add onclick attr for native strategy (T527293)", function(assert) {
    if(!clickEvent.useNativeClick) {
        assert.expect(0);
        return;
    }

    this.element.on("dxclick", noop);
    assert.equal(this.element.attr("onclick"), undefined);
});

QUnit.module("hacks", moduleConfig);

QUnit.test("dxpointer events on iOS7 with alert", function(assert) {
    if(clickEvent.useNativeClick || !support.touchEvents || !(devices.real().tablet || devices.real().phone) || devices.real().platform === "win") {
        assert.expect(0);
        return;
    }

    var originalPlatform;

    try {
        var requestAnimationFrameCallback = noop;
        if(clickEvent.misc) {
            clickEvent.misc.requestAnimationFrame = function(callback) { requestAnimationFrameCallback = callback; };
        }

        originalPlatform = devices.real().platform;
        devices.real({ platform: "ios" });

        var clickCount = 0,
            pointerDownCount = 0,
            pointerUpCount = 0;

        this.element.on("dxclick", function() {
            clickCount++;
        });

        this.element.on("dxpointerdown", function() {
            pointerDownCount++;
        });

        this.element.on("dxpointerdown", function() {
            pointerUpCount++;
        });

        var touchId = 13;

        this.element
            .trigger($.Event("touchstart", { touches: [1], targetTouches: [1], changedTouches: [{ identifier: touchId }] }));
        this.element
            .trigger($.Event("touchend", { touches: [], targetTouches: [], changedTouches: [{ identifier: touchId }] }));
        requestAnimationFrameCallback();
        requestAnimationFrameCallback = noop;

        // iOS dispatch same events after hide alert
        this.element
            .trigger($.Event("touchstart", { touches: [1], targetTouches: [1], changedTouches: [{ identifier: touchId }] }));
        this.element
            .trigger($.Event("touchend", { touches: [], targetTouches: [], changedTouches: [{ identifier: touchId }] }));
        requestAnimationFrameCallback();
        requestAnimationFrameCallback = noop;

        assert.equal(clickCount, 1, "click fired only ones");
        assert.equal(pointerDownCount, 1, "dxpointerdown fired only ones");
        assert.equal(pointerUpCount, 1, "dxpointerup fired only ones");
    } finally {
        devices.real({ platform: originalPlatform });
    }
});

QUnit.test("fast click should be fired on next frame after pointerup", function(assert) {
    if(clickEvent.useNativeClick) {
        assert.expect(0);
        return;
    }

    var origRequestAnimationFrame = clickEvent.misc.requestAnimationFrame;

    try {
        var animCallback = noop;
        clickEvent.misc.requestAnimationFrame = function(callback) {
            animCallback = callback;
        };

        var $element = $("#element"),
            clickFired = 0;
        $element.on("dxclick", function() {
            clickFired++;
        });

        nativePointerMock($element).start().down().up();
        assert.equal(clickFired, 0, "click not fired immediately");
        animCallback();
        assert.equal(clickFired, 1, "click fired on next animation frame");
    } finally {
        clickEvent.misc.requestAnimationFrame = origRequestAnimationFrame;
    }
});

QUnit.test("click should not be fired on pointercancel (Win8 parasitic click)", function(assert) {
    assert.expect(0);

    if(clickEvent.useNativeClick) {
        assert.expect(0);
        return;
    }

    var $element = this.element;

    $element.on("dxclick", function(e) {
        assert.ok(false, "click is fired");
    });

    pointerMock($element).start().down().cancel();
});


QUnit.module("prevent default", moduleConfig);

QUnit.test("pointer events should not be prevented", function(assert) {
    var $element = this.element,
        pointer = nativePointerMock($element);

    $element.on("dxclick", noop);

    $.each(["mousedown", "mouseup", "touchstart", "touchend"], function(_, eventName) {
        $element.on(eventName, function(e) {
            assert.ok(!e.isDefaultPrevented(), eventName + " should not be prevented");
        });
    });

    pointer
        .start()
        .touchStart()
        .touchEnd()
        .mouseDown()
        .mouseUp();
});

QUnit.test("click should not be prevented (T131440, T131837)", function(assert) {
    var $element = this.element;

    $element.on("dxclick", function(e) {
        assert.ok(!e.originalEvent.isDefaultPrevented(), "dxpointerup is not prevented");
    });

    nativePointerMock($element).click();
});


QUnit.module("reset active element", moduleConfig);

QUnit.test("click should reset active element (B253127)", function(assert) {
    if(clickEvent.useNativeClick) {
        assert.expect(0);
        return;
    }

    $("#input").focus();

    var $element = this.element,
        resetActiveElementCalled = 0;

    var originalResetActiveElement = domUtils.resetActiveElement;
    domUtils.resetActiveElement = function() {
        resetActiveElementCalled++;
    };

    try {
        $element.on("dxclick", function() {
            assert.equal(resetActiveElementCalled, 1, "active reset before click happened");
        });

        var pointer = pointerMock($element).start();
        pointer.down();
        assert.equal(resetActiveElementCalled, 0, "not reset after pointerdown");

        pointer.up();
        assert.equal(resetActiveElementCalled, 1, "reset only once");
    } finally {
        domUtils.resetActiveElement = originalResetActiveElement;
    }
});

QUnit.test("click should not reset active element if down default action prevented (B253127)", function(assert) {
    if(clickEvent.useNativeClick) {
        assert.expect(0);
        return;
    }

    $("#input").focus();

    var $element = this.element,
        resetActiveElementCalled = 0;

    var originalResetActiveElement = domUtils.resetActiveElement;
    domUtils.resetActiveElement = function() {
        resetActiveElementCalled++;
    };

    try {
        $element.on({
            "dxclick": noop,
            "dxpointerdown": function(e) {
                e.preventDefault();
            }
        });

        var pointer = pointerMock($element).start();
        pointer.down();
        assert.equal(resetActiveElementCalled, 0, "not reset after pointerdown");

        pointer.up();
        assert.equal(resetActiveElementCalled, 0, "not reset");
    } finally {
        domUtils.resetActiveElement = originalResetActiveElement;
    }
});

$.each(["<input>", "<textarea>", "<select>", "<button>", "<div tabindex='0'>", "<div tabindex='0'><div></div></div>"], function(_, focusable) {
    QUnit.test(focusable + " should get focus on click", function(assert) {
        if(clickEvent.useNativeClick) {
            assert.expect(0);
            return;
        }

        var originalResetActiveElement = domUtils.resetActiveElement;

        try {
            var $focusableWrapper = $("#inputWrapper"),
                $focusable = $(focusable),
                resetCount = 0;

            $focusable.appendTo($focusableWrapper);
            $focusable.trigger('focus');

            if(!$focusable.is(":focus")) {
                assert.ok(true, "window is inactive");
                return;
            }

            $focusableWrapper.on("dxclick", noop);

            domUtils.resetActiveElement = $.proxy(function() {
                resetCount++;
            }, this);

            pointerMock($focusable.children() || $focusable).start().down().up();

            assert.equal(resetCount, 0, focusable + " get focus on click");
        } finally {
            domUtils.resetActiveElement = originalResetActiveElement;
        }
    });
});

QUnit.test("native click should not focus on input after animation or scroll", function(assert) {
    if(devices.real().generic) {
        assert.ok(true);
        return;
    }

    var originalResetActiveElement = domUtils.resetActiveElement;

    try {
        var $element = this.element,
            $input = $("#input"),
            pointer = nativePointerMock($element),
            isMouseDownPrevented = false,
            resetCount = 0;

        $element.on("dxclick", noop)
            .on("mousedown", function(e) {
                isMouseDownPrevented = e.isDefaultPrevented();
            });

        pointer
            .start()
            .touchStart()
            .touchEnd()
            .mouseDown()
            .mouseUp()
            .pointerDown()
            .pointerUp();

        domUtils.resetActiveElement = $.proxy(function() {
            resetCount++;
        }, this);

        // NOTE: after animation/scroll on real device input can be placed under pointer
        if(!isMouseDownPrevented) {
            $input.focus();
            $input.trigger("click");
        }

        assert.equal(resetCount, 1, "input should not get focus after animation or scroll");
    } finally {
        domUtils.resetActiveElement = originalResetActiveElement;
    }
});

QUnit.test("native click should focus on input after animation or scroll if default action prevented", function(assert) {
    if(devices.real().generic) {
        assert.ok(true);
        return;
    }

    var originalResetActiveElement = domUtils.resetActiveElement;

    try {
        var $element = this.element,
            $input = $("#input"),
            pointer = nativePointerMock($element),
            isMouseDownPrevented = false,
            resetCount = 0;

        $element.on({
            "dxclick": noop,
            "mousedown": function(e) {
                isMouseDownPrevented = e.isDefaultPrevented();
            },
            "dxpointerdown": function(e) {
                e.preventDefault();
            }
        });

        pointer
            .start()
            .touchStart()
            .touchEnd()
            .mouseDown()
            .mouseUp()
            .pointerDown()
            .pointerUp();

        domUtils.resetActiveElement = $.proxy(function() {
            resetCount++;
        }, this);

        // NOTE: after animation/scroll on real device input can be placed under pointer
        if(!isMouseDownPrevented) {
            $input.focus();
            $input.trigger("click");
        }

        assert.equal(resetCount, 0, "input should get focus");
    } finally {
        domUtils.resetActiveElement = originalResetActiveElement;
    }
});

QUnit.test("native click should focus on input", function(assert) {
    var originalResetActiveElement = domUtils.resetActiveElement;

    try {
        var $input = $("#input"),
            resetCount = 0;

        domUtils.resetActiveElement = $.proxy(function() {
            resetCount++;
        }, this);

        $input.trigger("click");

        assert.equal(resetCount, 0, "input should not get focus after animation or scroll");
    } finally {
        domUtils.resetActiveElement = originalResetActiveElement;
    }
});

QUnit.test("click on element should not prevent focus on mousedown if used native click (Q586100)", function(assert) {
    if(!support.touch) {
        assert.ok(true);
        return;
    }

    this.container.css({
        overflow: "scroll",
        height: 100
    });

    this.element.css({
        height: 200
    });

    var $element = this.element,
        pointer = nativePointerMock($element),
        isDefaultPrevented = false;

    $element
        .on("dxclick", noop)
        .on("mousedown", function(e) {
            isDefaultPrevented = e.isDefaultPrevented();
        });

    pointer
        .start()
        .touchStart()
        .touchEnd()
        .mouseDown()
        .mouseUp()
        .click(true);

    assert.ok(!isDefaultPrevented, "click on element should call preventDefault() on 'mousedown' event");
});


QUnit.module("target and currentTarget", moduleConfig);

QUnit.test("dxclick should be prevented if 10px bound is exceeded", function(assert) {
    assert.expect(0);

    if(clickEvent.useNativeClick) {
        assert.expect(0);
        return;
    }

    var $element = $("#element"),
        pointer = nativePointerMock($element);

    $element.on("dxclick", function(e) {
        assert.ok(false, "click not present");
    });

    pointer.start().touchStart().touchMove(11).touchEnd();
});

QUnit.test("dxclick should have correct target", function(assert) {
    if(clickEvent.useNativeClick) {
        assert.expect(0);
        return;
    }

    var $container = $("#container"),
        $element = $("#element"),
        pointer = pointerMock($element),
        clickTarget;

    $container.on("dxclick", function(e) {
        clickTarget = e.target;
    });

    pointer.start().down().up();
    assert.ok($element.is(clickTarget));

    $element.on("dxclick", noop);
    pointer.down().up();
    assert.ok($element.is(clickTarget));
});

QUnit.test("dxclick should have correct currentTarget", function(assert) {
    if(clickEvent.useNativeClick) {
        assert.expect(0);
        return;
    }

    var $container = $("#container"),
        $element = $("#element"),
        pointer = pointerMock($element);

    $container.on("dxclick", function(e) {
        assert.ok($container.is(e.currentTarget));
    });

    $element.on("dxclick", function(e) {
        assert.ok($element.is(e.currentTarget));
    });

    pointer.start().down().up();
});

QUnit.test("dxclick should have correct target with delegated handlers", function(assert) {
    assert.expect(1);

    if(clickEvent.useNativeClick) {
        assert.expect(0);
        return;
    }

    var $container = $("#container");

    $container.on("dxclick", "#element", function(e) {
        assert.ok($(e.target).is("#wrapper"));
    });

    $("#first").trigger({ type: "dxpointerdown", pointers: [null] });
    $("#second").trigger({ type: "dxpointerup", pointers: [] });
});

QUnit.test("dxclick should not be fired if target is child of element", function(assert) {
    assert.expect(0);

    if(clickEvent.useNativeClick) {
        assert.expect(0);
        return;
    }

    var $container = $("#container"),
        $element = $("#element");

    $element.on("dxclick", function(e) {
        assert.ok(false, "click was not fired");
    });

    $element.trigger({ type: "dxpointerdown", pointers: [null] });
    $container.trigger({ type: "dxpointerup", pointers: [] });
});


QUnit.module("several subscriptions");

QUnit.test("dxclick should not be fired if target is child of element", function(assert) {
    if(clickEvent.useNativeClick) {
        assert.expect(0);
        return;
    }

    var $element = $("#element");

    $element
        .on("dxclick", "#first", function() {
            assert.ok(true);
        })
        .on("dxclick", "#second", function() {
            assert.ok(true);
        });

    pointerMock($("#first")).start().down().up();
    pointerMock($("#second")).start().down().up();
});


QUnit.module("native click support");

QUnit.test("dxclick should be based on native click", function(assert) {
    assert.expect(1);

    if(!clickEvent.useNativeClick) {
        assert.expect(0);
        return;
    }

    var $element = $("#element");

    $element.on("dxclick", function() {
        assert.ok(true, "dxclick present");
    });

    $element.trigger("click");
});

// T322738
QUnit.test("dxclick should be based on native click for all devices when useNative parameter is true", function(assert) {
    var $element = $("#element"),
        dxClickCallCount = 0,
        dxClickChildCallCount = 0;

    $element.on("dxclick", { useNative: true }, function() {
        dxClickCallCount++;
    });

    var $childElement = $("<div>").on("dxclick", function() {
        dxClickChildCallCount++;
    }).appendTo($element);

    nativePointerMock($element).start().click();
    nativePointerMock($childElement).start().click();

    assert.equal(dxClickCallCount, 2, "dxclick call count");
    assert.equal(dxClickChildCallCount, 1, "dxclick child call count");
    assert.ok($element.hasClass("dx-native-click"), "dx-native-click class was added");
});

QUnit.test("dxclick should triggers only on left mouse button click", function(assert) {
    if(!clickEvent.useNativeClick) {
        assert.expect(0);
        return;
    }

    var $element = $("#element").on("dxclick", function(e) { triggered++; }),
        triggered = 0;


    $element.trigger($.Event("click", { which: 1 }));
    assert.equal(triggered, 1, "left button click");

    $element.trigger($.Event("click", { which: 2 }));
    assert.equal(triggered, 1, "middle button click");

    $element.trigger($.Event("click", { which: 3 }));
    assert.equal(triggered, 1, "right button click");
});

QUnit.test("dxclick should not be fired twice after pointerdown, pointerup and click", function(assert) {
    assert.expect(1);

    if(!clickEvent.useNativeClick) {
        assert.expect(0);
        return;
    }

    var $element = $("#element"),
        pointer = pointerMock($element);

    $element.on("dxclick", function() {
        assert.ok(true, "dxclick fired");
    });

    pointer.start().down().up();
});

QUnit.test("dxclick should be fired even if propagation was stopped", function(assert) {
    assert.expect(1);

    if(!clickEvent.useNativeClick) {
        assert.expect(0);
        return;
    }

    var $element = $("#element"),
        pointer = nativePointerMock($element);

    $element
        .on("dxclick", function() {
            assert.ok(true, "dxclick fired");
        })
        .on("click", function(e) {
            e.stopPropagation();
        });

    pointer.start().down().up();
});

QUnit.test("dxclick should not be fired twice when 'click' is triggered from its handler (T503035)", (assert) => {
    assert.expect(1);

    if(!clickEvent.useNativeClick) {
        assert.expect(0);
        return;
    }

    const $element = $("#element");
    const pointer = nativePointerMock($element);

    $(document).on("dxclick", $.noop);

    $element
        .on("dxclick", () => {
            $("#inputWrapper").trigger("click");
            assert.ok(true, "dxclick fired");
        });

    pointer.start().down().up();
    $(document).off("dxclick", $.noop);
});
