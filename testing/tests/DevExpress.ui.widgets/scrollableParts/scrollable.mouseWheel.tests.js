import $ from "jquery";
import animationFrame from "animation/frame";
import devices from "core/devices";
import pointerMock from "../../../helpers/pointerMock.js";

import "common.css!";

import {
    SCROLLABLE_CONTAINER_CLASS,
    SCROLLABLE_WRAPPER_CLASS,
    SCROLLABLE_CONTENT_CLASS,
    SCROLLABLE_SCROLL_CLASS,
    SCROLLBAR_HORIZONTAL_CLASS
} from "./scrollable.constants.js";

var moduleConfig = {
    beforeEach: function() {
        var markup = '\
            <div id="scrollable" style="height: 50px; width: 50px;">\
                <div class="content1" style="height: 100px; width: 100px;"></div>\
                <div class="content2"></div>\
            </div>';
        $("#qunit-fixture").html(markup);

        this.clock = sinon.useFakeTimers();
        this._originalRequestAnimationFrame = animationFrame.requestAnimationFrame;
        animationFrame.requestAnimationFrame = function(callback) {
            callback();
        };
    },
    afterEach: function() {
        this.clock.restore();
        animationFrame.requestAnimationFrame = this._originalRequestAnimationFrame;
    }
};

QUnit.module("mouse wheel", moduleConfig);

QUnit.test("mousewheel for vertical direction", function(assert) {
    var distance = 10;

    var $scrollable = $("#scrollable");

    $scrollable.dxScrollable({
        useNative: false,
        direction: "vertical",
        inertiaEnabled: false
    });
    var scrollable = $scrollable.dxScrollable("instance");

    var $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS);

    pointerMock($container)
        .start()
        .wheel(-distance);

    assert.equal(scrollable.scrollOffset().top, distance, "scrolled vertically");
});

// T737554
QUnit.test("preventDefault should be called on immediate mousewheel at the end of content", function(assert) {
    var $scrollable = $("#scrollable");
    var lastWheelEventArgs;
    $scrollable.on("dxmousewheel", function(e) {
        lastWheelEventArgs = e;
    });

    $scrollable.dxScrollable({
        useNative: false,
        direction: "vertical",
        inertiaEnabled: false,
        bounceEnabled: false
    });
    var scrollable = $scrollable.dxScrollable("instance");

    var $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS);

    var pointer = pointerMock($container)
        .start()
        .wheel(-50);

    pointer.wheel(-50);

    assert.equal(scrollable.scrollOffset().top, 50, "scrolled vertically");
    assert.strictEqual(lastWheelEventArgs.isDefaultPrevented(), true, "default is prevented for wheel event");
});

// T737554
QUnit.test("preventDefault should not be called on delayed mousewheel at the end of content", function(assert) {
    var $scrollable = $("#scrollable");
    var lastWheelEventArgs;
    $scrollable.on("dxmousewheel", function(e) {
        lastWheelEventArgs = e;
    });

    $scrollable.dxScrollable({
        useNative: false,
        direction: "vertical",
        inertiaEnabled: false,
        bounceEnabled: false
    });
    var scrollable = $scrollable.dxScrollable("instance");

    var $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS);

    var pointer = pointerMock($container)
        .start()
        .wheel(-50);

    this.clock.tick(500);

    pointer.wheel(-50);

    assert.equal(scrollable.scrollOffset().top, 50, "scrolled vertically");
    assert.strictEqual(lastWheelEventArgs.isDefaultPrevented(), false, "default is prevented for wheel event");
});

QUnit.test("mousewheel calls update before validation", function(assert) {
    var distance = 10;

    var $scrollable = $("#scrollable").height(1000);
    $scrollable.children().height(10);

    $scrollable.dxScrollable({
        useNative: false,
        direction: "vertical",
        inertiaEnabled: false,
        bounceEnabled: false
    });
    var scrollable = $scrollable.dxScrollable("instance");

    var $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS);
    $scrollable.find("." + SCROLLABLE_CONTENT_CLASS).children().height(2000);

    pointerMock($container)
        .start()
        .wheel(-distance);

    assert.equal(scrollable.scrollOffset().top, distance, "scrollable was scrolled");
});

QUnit.test("mousewheel scrolls correctly when mouse is located over scrollbar", function(assert) {
    var distance = 10;
    var $scrollable = $("#scrollable");

    $scrollable.dxScrollable({
        useNative: false,
        direction: "vertical",
        inertiaEnabled: false,
        scrollByThumb: true
    });
    var scrollable = $scrollable.dxScrollable("instance");

    var $scrollbar = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS);

    pointerMock($scrollbar)
        .start()
        .wheel(-distance);

    assert.equal(scrollable.scrollOffset().top, distance, "scrolled vertically");
});

QUnit.test("mousewheel for horizontal direction", function(assert) {
    var distance = 10;
    var $scrollable = $("#scrollable");
    $scrollable.width(100);
    $scrollable.children().width(200);

    $scrollable.dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        direction: "horizontal"
    });
    var scrollable = $scrollable.dxScrollable("instance");

    var $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS);

    pointerMock($container)
        .start()
        .wheel(-distance, true);

    assert.equal(scrollable.scrollOffset().left, distance, "scrolled horizontally");
});

QUnit.test("mousewheel for both direction scrolls vertical", function(assert) {
    var distance = 10;

    var $scrollable = $("#scrollable");

    $scrollable.dxScrollable({
        useNative: false,
        direction: "both",
        inertiaEnabled: false,
        scrollByContent: false
    });
    var scrollable = $scrollable.dxScrollable("instance");

    var $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS);

    pointerMock($container)
        .start()
        .wheel(-distance);

    assert.equal(scrollable.scrollOffset().top, distance, "scrolled vertically");
    assert.equal(scrollable.scrollOffset().left, 0, "horizontal was prevented");
});

QUnit.test("mousewheel default behavior prevented", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        inertiaEnabled: false
    });

    var wheelHandler = function(e) {
        assert.ok(e.isDefaultPrevented(), "mousewheel is prevented");
    };

    try {
        $(document).on("dxmousewheel", wheelHandler);

        var $container = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);
        pointerMock($container)
            .start()
            .wheel(-10);

    } finally {
        $(document).off("dxmousewheel", wheelHandler);
    }
});

QUnit.test("mousewheel does not prevent default behavior when scroll is disabled", function(assert) {
    var $scrollable = $("#scrollable");
    $scrollable.height(100);
    $scrollable.wrapInner("<div>").children().height(50);

    $scrollable.dxScrollable({
        useNative: false,
        disabled: true
    });

    var wheelHandler = function(e) {
        assert.equal(e.isDefaultPrevented(), false, "mousewheel is not prevented");
    };

    try {
        $(document).on("dxmousewheel", wheelHandler);

        var $container = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);
        pointerMock($container)
            .start()
            .wheel(-10);

    } finally {
        $(document).off("dxmousewheel", wheelHandler);
    }
});

QUnit.test("mousewheel prevented only for event handled by scrollable", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        inertiaEnable: false,
        disabled: true
    });

    var wheelHandler = function(e) {
        assert.equal(e.isDefaultPrevented(), false, "mousewheel is not prevented");
    };

    try {
        $(document).on("dxmousewheel", wheelHandler);

        var $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS);
        pointerMock($container)
            .start()
            .wheel(-10);

    } finally {
        $(document).off("dxmousewheel", wheelHandler);
    }
});

QUnit.test("mousewheel triggers scroll event on container", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false
    });

    var scrollFired = 0,
        $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS);

    $container.on("scroll", function(e) {
        scrollFired++;
    });

    pointerMock($container)
        .start()
        .down()
        .move(-9, -10);

    assert.equal(scrollFired, 1, "scroll fired once");
});

QUnit.test("mousewheel scroll parent scrollable when children scroll reach bounce", function(assert) {
    var scrollableCounter = 0;
    var parentScrollableCounter = 0;
    var $scrollable = $("#scrollable").height(50);
    var $parentScrollable = $scrollable.wrap("<div>").parent().height(25);

    $scrollable.dxScrollable({
        useNative: false,
        bounceEnabled: true,
        inertiaEnabled: false,
        onScroll: function() {
            scrollableCounter++;
        }
    });

    $parentScrollable.dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        onScroll: function() {
            parentScrollableCounter++;
        }
    });

    $parentScrollable.dxScrollable("scrollTo", 1);

    var $wrapper = $scrollable.find("." + SCROLLABLE_WRAPPER_CLASS);

    pointerMock($wrapper).start().wheel(10);

    assert.equal(scrollableCounter, 0, "scroll was not fire for children scrollable");
    assert.ok(parentScrollableCounter > 0, "scroll fired for children scrollable");
});

QUnit.test("scrollable prevented when it is stretched", function(assert) {
    var scrollableCounter = 0;
    var innerScrollableCounter = 0;
    var $scrollable = $("#scrollable").height(50);
    var $innerScrollable = $("<div>").height(75).appendTo($scrollable);

    $scrollable.dxScrollable({
        useNative: false,
        bounceEnabled: true,
        inertiaEnabled: false,
        onScroll: function() {
            scrollableCounter++;
        }
    });

    $innerScrollable.dxScrollable({
        useNative: false,
        bounceEnabled: false,
        inertiaEnabled: false,
        onScroll: function() {
            innerScrollableCounter++;
        }
    });

    pointerMock($innerScrollable).start().wheel(-10);

    assert.equal(innerScrollableCounter, 0, "scroll was not fire for children scrollable");
    assert.ok(scrollableCounter > 0, "scroll fired for children scrollable");
});

QUnit.test("scroll should work on mousewheel after draging on horizontal bar", function(assert) {
    var distance = 10;

    var $scrollable = $("#scrollable");

    $scrollable.dxScrollable({
        useNative: false,
        direction: "both",
        inertiaEnabled: false,
        scrollByContent: false,
        scrollByThumb: true
    });
    var scrollable = $scrollable.dxScrollable("instance");

    var $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS);
    var $scrollbar = $scrollable.find("." + SCROLLBAR_HORIZONTAL_CLASS + " .dx-scrollable-scroll");

    pointerMock($scrollbar).start().down().move(-distance).up();

    pointerMock($container)
        .start()
        .wheel(-distance);

    assert.equal(scrollable.scrollOffset().top, distance, "scrolled vertically");
});

if(devices.current().deviceType === "desktop") {
    ["vertical", "horizontal"].forEach((direction) => {
        class ValidateMouseWheelEventTestHelper {
            constructor(direction) {
                this._direction = direction;
                this._wheelEvent = {
                    type: "dxmousewheel",
                    pointerType: "mouse",
                    shiftKey: direction === "vertical" ? false : true
                };

                this.$scrollable = this._getScrollable();

                this.strategy = this.$scrollable.dxScrollable("instance")._strategy;
            }

            _getScrollable() {
                return $("#scrollable").dxScrollable({
                    useNative: true,
                    direction: this._direction
                });
            }

            getEvent() { return this._wheelEvent; }

            getScrollableContainer() {
                return this.$scrollable.find(`.${SCROLLABLE_CONTAINER_CLASS}`);
            }
        }

        QUnit.test(`validate() mouse wheel (top, left) - direction:${direction}`, function(assert) {
            let helper = new ValidateMouseWheelEventTestHelper(direction);
            let event = helper.getEvent();

            event.delta = 1;
            assert.strictEqual(!!helper.strategy.validate(event), false, "validate result when event.delta = 1");

            event.delta = -1;
            assert.strictEqual(!!helper.strategy.validate(event), true, "validate result when event.delta = -1");
        });

        QUnit.test(`validate() mousewheel (bottom, right)- direction:${direction}`, function(assert) {
            let helper = new ValidateMouseWheelEventTestHelper(direction);
            let event = helper.getEvent();
            let $container = helper.getScrollableContainer();

            $container.scrollTop(50);
            $container.scrollLeft(50);

            event.delta = 1;
            assert.strictEqual(!!helper.strategy.validate(event), true, "validate result when event.delta = 1");

            event.delta = -1;
            assert.strictEqual(!!helper.strategy.validate(event), false, "validate result when event.delta = -1");
        });

        QUnit.test(`validate() mousewheel (center, center)- direction:${direction}`, function(assert) {
            let helper = new ValidateMouseWheelEventTestHelper(direction);
            let event = helper.getEvent();
            let $container = helper.getScrollableContainer();

            $container.scrollTop(25);
            $container.scrollLeft(25);

            event.delta = 1;
            assert.strictEqual(!!helper.strategy.validate(event), true, "validate result when event.delta = 1");

            event.delta = -1;
            assert.strictEqual(!!helper.strategy.validate(event), true, "validate result when event.delta = -1");
        });
    });
}
