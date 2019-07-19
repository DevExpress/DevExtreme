import $ from "jquery";
import translator from "animation/translator";
import animationFrame from "animation/frame";
import resizeCallbacks from "core/utils/resize_callbacks";
import pointerMock from "../../../helpers/pointerMock.js";

import "common.css!";

import {
    SCROLLABLE_CONTAINER_CLASS,
    SCROLLABLE_CONTENT_CLASS,
    calculateInertiaDistance
} from "./scrollable.constants.js";

const INERTIA_TIMEOUT = 100;

const GESTURE_LOCK_KEY = "dxGestureLock";

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

var getScrollOffset = function($scrollable) {
    var $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS),
        $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS),
        location = translator.locate($content);

    return {
        top: location.top - $container.scrollTop(),
        left: location.left - $container.scrollLeft()
    };
};

QUnit.module("dynamic", moduleConfig);

QUnit.test("moving scrollable moves content", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false
    });

    var mouse = pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS)).start(),
        location,
        distance = -10;

    mouse.down().move(0, distance);
    location = getScrollOffset($scrollable);
    assert.equal(location.top, distance, "scroll follows pointer");

    mouse.move(0, distance);
    location = getScrollOffset($scrollable);
    assert.equal(location.top, 2 * distance, "scroll follows pointer everytime");

    mouse.up();
});

QUnit.test("inertia", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
            useNative: false,
            onEnd: function() {
                location = getScrollOffset($scrollable);
                assert.ok(location.top < distance, "was inertia");
            }
        }),
        mouse = pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS)).start(),
        location,
        distance = -10;

    mouse
        .down()
        .wait(10)
        .move(0, distance)
        .up();
});

QUnit.test("inertia calc distance", function(assert) {
    assert.expect(1);

    var contentHeight = 9000,
        moveDistance = -10,
        moveDuration = 10,
        inertiaDistance = calculateInertiaDistance(moveDistance, moveDuration),
        distance = moveDistance + inertiaDistance,
        $scrollable = $("#scrollable");

    $scrollable.find(".content1").height(contentHeight);
    $scrollable.dxScrollable({
        useNative: false,
        onEnd: function() {
            var location = getScrollOffset($scrollable);
            assert.equal(Math.round(location.top), Math.round(distance), "distance was calculated correctly");
        }
    });

    var $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS),
        mouse = pointerMock($content);

    mouse
        .start()
        .down()
        .wait(moveDuration)
        .move(0, moveDistance)
        .up();

});

QUnit.test("no inertia when gesture end is deferred", function(assert) {
    assert.expect(1);

    var scrollableHeight = 50,
        $scrollable = $("#scrollable");

    $scrollable.height(scrollableHeight);
    $scrollable.find(".content1").height(2 * scrollableHeight);
    $scrollable.dxScrollable({
        useNative: false,
        onEnd: function() {
            var location = getScrollOffset($scrollable);
            assert.equal(Math.round(location.top), Math.round(moveDistance), "no inertia");
        }
    });

    var $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS),
        mouse = pointerMock($content),
        moveDistance = -10,
        moveDuration = 10;

    mouse
        .start()
        .down()
        .wait(moveDuration)
        .move(0, moveDistance)
        .wait(INERTIA_TIMEOUT + 1)
        .up();
});

QUnit.test("gesture prevent when scrollable is full and bounce enabled false", function(assert) {
    var $scrollable = $("#scrollable")
        .height(1000);

    $scrollable.wrapInner("<div>")
        .children()
        .height(10);
    $scrollable.dxScrollable({
        useNative: false,
        bounceEnabled: false,
        direction: "vertical"
    });

    pointerMock($scrollable).start().down().move(0, -10);
    assert.ok(!$scrollable.data(GESTURE_LOCK_KEY), "gesture was prevented");
});

QUnit.test("stop inertia on click", function(assert) {
    assert.expect(1);

    animationFrame.requestAnimationFrame = function(callback) {
        setTimeout(callback, 0);
    };

    var moveDistance = -10,
        moveDuration = 10,
        inertiaDistance = calculateInertiaDistance(moveDistance, moveDuration),
        distance = moveDistance + inertiaDistance,

        $scrollable = $("#scrollable").dxScrollable({
            useNative: false,
            onStop: function() {
                var location = getScrollOffset($scrollable);
                assert.notEqual(Math.round(location.top), Math.round(distance), "scroll was stopped");
            }
        }),
        mouse = pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS)).start();

    mouse
        .down()
        .wait(moveDuration)
        .move(0, moveDistance)
        .up();

    mouse
        .down()
        .up();

    this.clock.tick();
});

QUnit.test("scrollbar is hidden on stop", function(assert) {
    assert.expect(1);

    animationFrame.requestAnimationFrame = function(callback) {
        setTimeout(callback, 0);
    };

    var $scrollable = $("#scrollable").dxScrollable({
            useNative: false,
            onStop: function() {
                var $scroll = $scrollable.find(".dx-scrollable-scroll");
                assert.ok($scroll.hasClass("dx-state-invisible"), "scroll was hidden");
            }
        }),
        mouse = pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS)).start();

    mouse
        .down()
        .wait(10)
        .move(0, -10)
        .up();

    mouse
        .down()
        .up();

    this.clock.tick();
});

QUnit.test("bounce top", function(assert) {
    assert.expect(1);

    var $scrollable = $("#scrollable").dxScrollable({
            useNative: false,
            onEnd: function() {
                var location = getScrollOffset($scrollable);
                assert.equal(location.top, 0, "content bounced back");
            }
        }),
        mouse = pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS)).start();

    mouse
        .down()
        .wait(10)
        .move(0, 10)
        .up();
});

QUnit.test("bounce bottom", function(assert) {
    assert.expect(1);

    var scrollableHeight = 50,
        $scrollable = $("#scrollable");

    $scrollable.height(scrollableHeight);
    $scrollable.find(".content1").height(2 * scrollableHeight);
    $scrollable.dxScrollable({
        useNative: false,
        onEnd: function() {
            var location = getScrollOffset($scrollable),
                height = $scrollable.height() - $content.height();

            assert.equal(location.top, height, "content bounced back");
        },
        inertiaEnabled: false
    });

    var $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS),
        mouse = pointerMock($content);

    mouse
        .start()
        .down()
        .move(0, -scrollableHeight - 10)
        .up();
});

QUnit.test("bounce up", function(assert) {
    assert.expect(1);

    var scroll = 0;

    var $scrollable = $("#scrollable").dxScrollable({
            useNative: false,
            onEnd: function() {
                assert.ok(scroll > 1, "Scroll action fired on bounced");
            },
            onScroll: function() {
                scroll++;
            },
            inertiaEnabled: false
        }),
        mouse = pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS)).start();

    mouse
        .down()
        .move(0, 100)
        .up();
});

QUnit.test("stop bounce on click", function(assert) {
    assert.expect(1);

    animationFrame.requestAnimationFrame = function(callback) {
        setTimeout(callback, 0);
    };

    var moveDistance = -10,
        moveDuration = 10,

        $scrollable = $("#scrollable").dxScrollable({
            useNative: false,
            onStop: function() {
                var location = getScrollOffset($scrollable);
                assert.notEqual(location.top, 0, "bounced stopped");
            },
            onEnd: function() {
                assert.ok(false, "shouldn't fire end action");
            }
        }),
        $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS),
        mouse = pointerMock($content);

    mouse
        .start()
        .down()
        .wait(moveDuration)
        .move(0, moveDistance)
        .up()
        .down();

    this.clock.tick();
});

QUnit.test("stop inertia bounce on after mouse up", function(assert) {
    assert.expect(1);

    animationFrame.requestAnimationFrame = function(callback) {
        setTimeout(callback, 0);
    };

    var moveDistance = -10,
        moveDuration = 10,

        $scrollable = $("#scrollable").dxScrollable({
            useNative: false,
            onStop: function() {
                var location = getScrollOffset($scrollable);
                assert.notEqual(location.top, 0, "bounced stopped");
            },
            onEnd: function() {
                assert.ok(false, "scroll complete shouldn`t be fired");
            }
        }),
        $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS),
        mouse = pointerMock($content);

    mouse
        .start()
        .down()
        .wait(moveDuration)
        .move(0, moveDistance)
        .up();

    mouse
        .down();

    this.clock.tick();
});

QUnit.test("bounce elastic", function(assert) {
    assert.expect(2);

    var moveDistance = 10,
        wasFirstMove = false;

    var $scrollable = $("#scrollable").dxScrollable({
            useNative: false,
            inertiaEnabled: false,

            onScroll: function() {
                if(wasFirstMove) {
                    var location = getScrollOffset($scrollable);
                    assert.ok(location.top > 0, "bounced exists");
                    assert.ok(location.top < 2 * moveDistance, "bounced elastic");
                } else {
                    wasFirstMove = true;
                }
            }
        }),
        mouse = pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS)).start();

    mouse
        .down()
        .move(0, moveDistance)
        .move(0, moveDistance);
});

QUnit.test("inertia calc distance out of bounds", function(assert) {
    assert.expect(1);

    var moveDistance = 10,
        moveDuration = 10,
        inertiaDistance = calculateInertiaDistance(moveDistance, moveDuration),
        distance = (-1.5 * moveDistance) + (0.1 * moveDistance) + moveDistance + inertiaDistance,
        $scrollable = $("#scrollable");

    $scrollable.dxScrollable({
        useNative: false,

        onBounce: function() {
            var location = getScrollOffset($scrollable);
            assert.ok(Math.round(location.top) < Math.round(distance), "distance was calculated wrong");
        },

        onEnd: function() {
        }
    });

    var mouse = pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS)).start();

    mouse
        .down()
        .move(0, -1.5 * moveDistance)
        .wait(300)
        .move(0, 0.1 * moveDistance)
        .wait(moveDuration)
        .move(0, moveDistance)
        .up();
});

QUnit.test("bounce is disabled", function(assert) {
    assert.expect(1);

    var moveDistance = 100;

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        bounceEnabled: false,
        inertiaEnabled: false,

        onBounce: function() {
            assert.ok(false, "bounce action was not fired");
        }
    });

    var mouse = pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS)).start();

    mouse
        .down()
        .move(0, moveDistance);

    var location = getScrollOffset($scrollable);
    assert.equal(location.top, 0, "content is not moving");
});

QUnit.test("inertia stopped on the bound when bounce is disabled", function(assert) {
    assert.expect(1);

    var moveDistance = 10,
        $scrollable = $("#scrollable");

    $scrollable.dxScrollable({
        useNative: false,
        bounceEnabled: false,

        onBounce: function() {
            assert.ok(false, "bounce action was not fired");
        },

        onEnd: function() {
            var location = getScrollOffset($scrollable);
            assert.equal(location.top, 0, "content stopped on the bound");
        }
    });

    var mouse = pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS)).start();

    mouse
        .down()
        .move(0, -1.5 * moveDistance)
        .wait(300)
        .move(0, 0.1 * moveDistance)
        .wait(10)
        .move(0, moveDistance)
        .up();
});

QUnit.test("inertia is stopped when bound is reached", function(assert) {
    var moveDistance = 10,
        lastLocation = (-1.5 * moveDistance) + (0.1 * moveDistance) + moveDistance,
        $scrollable = $("#scrollable");

    $scrollable.dxScrollable({
        useNative: false,
        bounceEnabled: false,

        onScroll: function() {
            var location = getScrollOffset($scrollable);
            assert.notEqual(location.top, lastLocation || -1, "content position is changed on each scroll step");
            lastLocation = location.top;
        }
    });

    var $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS),
        mouse = pointerMock($content);

    mouse
        .start()
        .down()
        .move(0, -1.5 * moveDistance)
        .wait(200)
        .move(0, 0.1 * moveDistance)
        .wait(10)
        .move(0, moveDistance)
        .up();
});

QUnit.test("velocity calculated correctly when content height less than container height", function(assert) {
    var moveDistance = 10,
        $scrollable = $("#scrollable").height(500);

    $scrollable.dxScrollable({
        useNative: false,
        onScroll: function() {
            var location = getScrollOffset($scrollable);
            assert.ok(location.top >= 0, "content location calculated right");
        }
    });

    var $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS),
        mouse = pointerMock($content).start();

    mouse
        .down()
        .move(0, moveDistance)
        .up();
});

QUnit.test("window resize should call update", function(assert) {
    assert.expect(2);

    var $scrollable = $("#scrollable");

    $scrollable.dxScrollable({
        useNative: true,
        onUpdated: function() {
            assert.ok(true, "update fired");
        }
    });

    resizeCallbacks.fire();
});

QUnit.test("scrollable should have correct scrollPosition when content is not cropped by overflow hidden", function(assert) {
    var $scrollable = $("#scrollable").height(50).width(50);

    $scrollable.dxScrollable({
        useNative: false,
        direction: "both",
        scrollByContent: true
    });

    var $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS);

    $content.children().eq(0).css({
        width: "100px",
        height: "100px"
    });
    $content.children().eq(1).css({
        width: "300px",
        height: "300px",
        position: "absolute",
        top: 0,
        left: 0
    });

    $content.css({
        height: "100px",
        width: "100px"
    });

    $scrollable.dxScrollable("instance").scrollTo({ top: 250, left: 250 });
    $scrollable.dxScrollable("instance").update();
    $scrollable.dxScrollable("instance").scrollTo({ top: 250, left: 250 });

    assert.equal($scrollable.dxScrollable("instance").scrollTop(), 250);
    assert.equal($scrollable.dxScrollable("instance").scrollLeft(), 250);
});

QUnit.test("scrollable should have correct scrollPosition when content is cropped by overflow hidden", function(assert) {
    var $scrollable = $("#scrollable").height(50).width(50);

    $scrollable.dxScrollable({
        useNative: false,
        direction: "both",
        scrollByContent: true
    });

    var $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS);

    $content.children().eq(0).css({
        width: "100px",
        height: "100px"
    });
    $content.children().eq(1).css({
        width: "300px",
        height: "300px",
        position: "absolute",
        top: 0,
        left: 0
    });

    $content.css({
        height: "100px",
        width: "100px",
        overflow: "hidden"
    });

    $scrollable.dxScrollable("instance").scrollTo({ top: 250, left: 250 });
    $scrollable.dxScrollable("instance").update();
    $scrollable.dxScrollable("instance").scrollTo({ top: 250, left: 250 });

    assert.equal($scrollable.dxScrollable("instance").scrollTop(), 50);
    assert.equal($scrollable.dxScrollable("instance").scrollLeft(), 50);
});

QUnit.test("scrollable prevents anchor events", function(assert) {
    var $input = $("<input>").css("height", "40px");
    var scrollable = $("#scrollable")
        .append($input)
        .dxScrollable({
            useNative: false
        })
        .dxScrollable("instance");

    $input
        .focus()
        .css("height", "auto");
    var scrollPosition = scrollable.scrollTop();

    $input
        .parent()
        .append($("<input>"));

    assert.strictEqual(scrollable.scrollTop(), scrollPosition, "Scrollable save content position");
});
