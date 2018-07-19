"use strict";

var $ = require("jquery"),
    browser = require("core/utils/browser"),
    noop = require("core/utils/common").noop,
    support = require("core/utils/support"),
    styleUtils = require("core/utils/style"),
    translator = require("animation/translator"),
    animationFrame = require("animation/frame"),
    domUtils = require("core/utils/dom"),
    initMobileViewport = require("mobile/init_mobile_viewport"),
    resizeCallbacks = require("core/utils/resize_callbacks"),
    devices = require("core/devices"),
    Scrollable = require("ui/scroll_view/ui.scrollable"),
    simulatedStrategy = require("ui/scroll_view/ui.scrollable.simulated"),
    Scrollbar = require("ui/scroll_view/ui.scrollbar"),
    config = require("core/config"),
    viewPort = require("core/utils/view_port").value,
    pointerMock = require("../../helpers/pointerMock.js"),
    keyboardMock = require("../../helpers/keyboardMock.js"),
    isRenderer = require("core/utils/type").isRenderer;

require("common.css!");

var SCROLLABLE_CLASS = "dx-scrollable",
    SCROLLABLE_CONTAINER_CLASS = "dx-scrollable-container",
    SCROLLABLE_WRAPPER_CLASS = "dx-scrollable-wrapper",
    SCROLLABLE_CONTENT_CLASS = "dx-scrollable-content",
    SCROLLABLE_SCROLLBAR_CLASS = "dx-scrollable-scrollbar",
    SCROLLABLE_SCROLL_CLASS = "dx-scrollable-scroll",
    SCROLLABLE_SCROLL_CONTENT_CLASS = "dx-scrollable-scroll-content",
    SCROLLBAR_VERTICAL_CLASS = "dx-scrollbar-vertical",
    SCROLLBAR_HORIZONTAL_CLASS = "dx-scrollbar-horizontal",
    SCROLLABLE_NATIVE_CLASS = "dx-scrollable-native",
    SCROLLABLE_SCROLLBARS_HIDDEN = "dx-scrollable-scrollbars-hidden",
    SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE = "dx-scrollable-scrollbars-alwaysvisible",
    SCROLLABLE_DISABLED_CLASS = "dx-scrollable-disabled",
    SCROLLABLE_SCROLLBAR_ACTIVE_CLASS = "dx-scrollable-scrollbar-active",
    RTL_CLASS = "dx-rtl";

var SCROLLBAR_MIN_HEIGHT = 15,
    INERTIA_TIMEOUT = 100;

var ACCELERATION = simulatedStrategy.ACCELERATION,
    MIN_VELOCITY_LIMIT = simulatedStrategy.MIN_VELOCITY_LIMIT,
    FRAME_DURATION = simulatedStrategy.FRAME_DURATION,
    SCROLL_LINE_HEIGHT = simulatedStrategy.SCROLL_LINE_HEIGHT;

var GESTURE_LOCK_KEY = "dxGestureLock";

var moduleConfig = {
    beforeEach: function() {
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

viewPort($("#qunit-fixture").addClass("dx-viewport"));
devices.current("iPhone");


QUnit.testStart(function() {
    var markup = '\
        <div id="scrollable" style="height: 50px; width: 50px;">\
            <div class="content1" style="height: 100px; width: 100px;"></div>\
            <div class="content2"></div>\
        </div>\
        <div id="scrollableVary" style="height: auto">\
            <div class="content3" style="height: 100px; width: 100px;"></div>\
        </div>\
        <div id="scrollableNeighbour"></div>\
        <div id="scrollable1" style="height: 100px;">\
            <div id="scrollable2" style="height: 50px;">\
                    <div class="innerContent"></div>\
            </div>\
            <div style="height: 100px;"></div>\
        </div>\
        <div id="scaledContainer" style="transform:scale(0.5)">\
            <div style="height: 500px; width: 50px;">\
                <div id="scaledScrollable">\
                    <div id="scaledContent" style="height: 1000px; width: 100px;"></div>\
                </div>\
            </div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("markup", moduleConfig);

QUnit.test("scrollable render", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({}),
        $wrapper = $scrollable.children().eq(0),
        $container = $wrapper.children().eq(0),
        $content = $container.children().eq(0);

    assert.ok($scrollable.hasClass(SCROLLABLE_CLASS), "dx-scrollable class attached");
    assert.ok($wrapper.hasClass(SCROLLABLE_WRAPPER_CLASS), "dx-scrollable-wrapper class attached");
    assert.ok($container.hasClass(SCROLLABLE_CONTAINER_CLASS), "dx-scrollable-container class attached");
    assert.ok($content.hasClass(SCROLLABLE_CONTENT_CLASS), "dx-scrollable-content class attached");
    assert.equal($content.children().length, 2, "content was moved");
    assert.ok($content.children().eq(0).hasClass("content1"));
    assert.ok($content.children().eq(1).hasClass("content2"));
});

QUnit.test("scrollable - root element should has 'dx-scrollable-customizable-scrollbars' class (only for non-Mac desktops)", function(assert) {
    var scrollable = new Scrollable($("#scrollable"));

    if(devices.real().deviceType !== "desktop" || navigator.platform.indexOf('Mac') > -1 && browser.webkit) {
        assert.notOk(scrollable.$element().hasClass("dx-scrollable-customizable-scrollbars"), "root element hasn't 'dx-scrollable-customizable-scrollbars' class");
    } else {
        assert.ok(scrollable.$element().hasClass("dx-scrollable-customizable-scrollbars"), "root element has 'dx-scrollable-customizable-scrollbars' class");
    }
});

QUnit.module("rtl", moduleConfig);

QUnit.test("option 'rtl'", function(assert) {
    var $element = $("#scrollable");
    new Scrollable($element);
    var instance = Scrollable.getInstance($element);

    assert.ok(!$element.hasClass(RTL_CLASS));

    instance.option("rtlEnabled", true);
    assert.ok($element.hasClass(RTL_CLASS));
});

QUnit.test("rtlEnabled scrolls to very right position", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        direction: "horizontal",
        rtlEnabled: true,
        useNative: false
    });

    var scrollable = $scrollable.dxScrollable("instance");
    var veryRightPosition = scrollable.$content().width() - $scrollable.width();

    assert.equal(scrollable.scrollLeft(), veryRightPosition, "scrolled to very right position");
});

QUnit.test("rtlEnabled scrolls to very right position after changing the size of the scrollable (T544872)", function(assert) {
    var $scrollable = $("#scrollableVary").dxScrollable({
        direction: "horizontal",
        rtlEnabled: true,
        width: 50,
        height: 50,
        useNative: false
    });

    var scrollable = $scrollable.dxScrollable("instance");
    var veryRightPosition = scrollable.$content().width() - $scrollable.width();

    assert.equal(scrollable.scrollLeft(), veryRightPosition, "scrolled to very right position");
});

QUnit.test("rtlEnabled scrolls to very right position after shown event", function(assert) {
    var $scrollable = $("#scrollable");
    var $wrapper = $scrollable.wrap("<div>").parent().hide();

    $scrollable.dxScrollable({
        direction: "horizontal",
        rtlEnabled: true,
        useNative: false
    });

    $wrapper.show();
    domUtils.triggerShownEvent($wrapper);
    var scrollable = $scrollable.dxScrollable("instance");
    var veryRightPosition = scrollable.$content().width() - $scrollable.width();

    assert.equal(scrollable.scrollLeft(), veryRightPosition, "scrolled to very right position");
});

QUnit.test("init option 'rtl' is true", function(assert) {
    var $element = $("#scrollable").dxScrollable({ rtlEnabled: true }),
        instance = $element.dxScrollable("instance");

    assert.ok($element.hasClass(RTL_CLASS));

    instance.option("rtlEnabled", false);
    assert.ok(!$element.hasClass(RTL_CLASS));
});


QUnit.module("actions", moduleConfig);

QUnit.test("start action not fired after creation", function(assert) {
    var started = 0;

    $("#scrollable").dxScrollable({
        useNative: false,
        onStart: function() {
            started++;
        }
    });

    assert.equal(started, 0, "scroll was not started");
});

QUnit.test("start action fired once after several moves", function(assert) {
    var started = 0;

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        onStart: function() {
            started++;
        }
    });

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, 1)
        .move(0, 1)
        .up();

    assert.equal(started, 1, "scroll started once");
});

QUnit.test("scroll action fired on every move", function(assert) {
    var scrolled = 0;

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        onScroll: function() {
            scrolled++;
        },
        inertiaEnabled: false
    });

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1)
        .move(0, -1)
        .move(0, -1)
        .up();

    assert.equal(scrolled, 3, "scroll action fired three times");
});

QUnit.test("scroll action fired on every content move during inertia", function(assert) {
    var scrolled = 0;

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        onScroll: function() {
            scrolled++;
        }
    });

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .wait(10)
        .move(0, -1)
        .up();

    assert.ok(scrolled > 1, "scroll action fired during inertia");
});

QUnit.test("scroll action does not fire when location was not changed", function(assert) {
    var scrolled = 0;

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        bounceEnabled: false,
        onScroll: function() {
            scrolled++;
        },
        inertiaEnabled: false
    });

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, 1)
        .move(0, 0)
        .up();

    assert.equal(scrolled, 0, "scroll was not fired");
});

QUnit.test("end action fired on scroll end", function(assert) {
    var end = 0;

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        onEnd: function() {
            end++;
        }
    });

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1)
        .up();

    assert.equal(end, 1, "end action fired once");
});

QUnit.test("end action isn't fired without move", function(assert) {
    var end = 0;

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        onEnd: function() {
            end++;
        }
    });

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .up();

    assert.equal(end, 0, "end action wasn't fired");
});

QUnit.test("set actions by option", function(assert) {
    var start = 0,
        scroll = 0,
        end = 0;

    var $scrollable = $("#scrollable").dxScrollable({
            useNative: false,
            inertiaEnabled: false
        }),
        instance = $scrollable.dxScrollable("instance");

    instance.option("onStart", function(assert) { start++; });
    instance.option("onScroll", function(assert) { scroll++; });
    instance.option("onEnd", function(assert) { end++; });

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1)
        .up();

    assert.equal(start, 1, "start action fired");
    assert.equal(scroll, 1, "scroll action fired");
    assert.equal(end, 1, "end action fired");
});

QUnit.test("start not fired if event outside the scrollable", function(assert) {
    var started = 0,
        scrolled = 0,
        ended = 0;

    $("#scrollable").dxScrollable({
        useNative: false,
        onStart: function() {
            started++;
        },
        onScroll: function() {
            scrolled++;
        },
        onEnd: function() {
            ended++;
        }
    });

    pointerMock($("#scrollableNeighbour"))
        .start()
        .down()
        .move(0, -1)
        .up();

    assert.equal(started, 0, "start action not fired");
    assert.equal(scrolled, 0, "scroll action not fired");
    assert.equal(ended, 0, "end action not fired");
});

QUnit.test("scroll not fired without start", function(assert) {
    var scrolled = 0;

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        onScroll: function() {
            scrolled++;
        },
    });

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .move(0, -1);

    assert.equal(scrolled, 0, "scroll action not fired");
});

QUnit.test("scroll not fired when start on another element", function(assert) {
    var scrolled = 0;

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        onScroll: function() {
            scrolled++;
        },
    });

    pointerMock($("#scrollableNeighbour"))
        .start()
        .down();

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .move(0, -1);

    assert.equal(scrolled, 0, "scroll action not fired");
});

QUnit.test("scroll isn't fired when moving after finish of previous scrolling", function(assert) {
    var scrolled = 0;

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        onScroll: function() {
            scrolled++;
        },
    });

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1)
        .up()
        .start()
        .move(0, -1);

    assert.equal(scrolled, 1, "scroll action not fired");
});

QUnit.test("scroll action fired during native scroll", function(assert) {
    var scrolled = 0;

    var $scrollable = $("#scrollable").dxScrollable({
        inertiaEnabled: false,
        useNative: true,
        onScroll: function() {
            scrolled++;
        },
    });

    $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS).trigger("scroll");

    assert.equal(scrolled, 1, "scroll action fired");
});

QUnit.test("changing action option does not cause render", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false
    });

    var $content = $scrollable.find("." + SCROLLABLE_WRAPPER_CLASS),
        mouse = pointerMock($content).start();

    mouse
        .down()
        .move(0, -10);

    var testAction = function(actionName) {
        $scrollable.dxScrollable("option", actionName, noop);
        var location = getScrollOffset($scrollable);
        assert.equal(location.top, -10, actionName + " case scrollable rerendered");
    };

    testAction("onStop");
    testAction("onStart");
    testAction("onEnd");

    testAction("onScroll");
    testAction("onBounce");
    testAction("onUpdated");
});


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

var calculateInertiaDistance = function(distance, duration) {
    var velocity = FRAME_DURATION * distance / duration,
        result = 0;

    while(Math.abs(velocity) > MIN_VELOCITY_LIMIT) {
        result += velocity;
        velocity = velocity * ACCELERATION;
    }

    return result;
};

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


QUnit.module("horizontal direction", moduleConfig);

QUnit.test("horizontal moving scrollable moves content", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        direction: "horizontal"
    });
    var mouse = pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS)).start(),
        location,
        distance = -10;

    mouse.down().move(distance, 0);
    location = getScrollOffset($scrollable);
    assert.equal(location.left, distance, "scroll follows pointer in horizontal direction");

    mouse.move(distance, 0);
    location = getScrollOffset($scrollable);
    assert.equal(location.left, 2 * distance, "scroll follows pointer everytime in horizontal direction");

    mouse.up();
});


QUnit.test("horizontal inertia calc distance", function(assert) {
    assert.expect(1);

    var contentWidth = 9000,
        moveDistance = -10,
        moveDuration = 10,
        inertiaDistance = calculateInertiaDistance(moveDistance, moveDuration),
        distance = moveDistance + inertiaDistance,
        $scrollable = $("#scrollable");

    $scrollable.find(".content1").width(contentWidth);
    $scrollable.dxScrollable({
        useNative: false,
        direction: "horizontal",
        onEnd: function() {
            var location = getScrollOffset($scrollable);
            assert.equal(Math.round(location.left), Math.round(distance), "distance was calculated correctly");
        }
    });

    var mouse = pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS)).start();

    mouse
        .down()
        .wait(moveDuration)
        .move(moveDistance, 0)
        .up();
});

QUnit.test("reset unused position after change direction", function(assert) {
    var contentWidth = 1000;
    var containerWidth = 100;
    var $scrollable = $("#scrollable").width(containerWidth);

    $scrollable.wrapInner("<div>").children().width(contentWidth);

    var scrollable = $scrollable.dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        direction: "horizontal"
    }).dxScrollable("instance");

    scrollable.scrollTo(contentWidth);
    scrollable.option("direction", "vertical");
    assert.equal(scrollable.scrollLeft(), 0, "left position was reset after change direction");
});

QUnit.module("both directions", moduleConfig);

QUnit.test("bounce problem", function(assert) {
    assert.expect(2);

    var $scrollable = $("#scrollable");

    $scrollable.dxScrollable({
        useNative: false,
        direction: "both",
        onEnd: function() {
            var location = getScrollOffset($scrollable);
            assert.equal(location.top, 0, "content bounced back");
            assert.equal(location.left, 0, "content bounced back");
        }
    });

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS)).start()
        .down()
        .move(10, 10)
        .up();
});

QUnit.test("both direction option", function(assert) {
    var $scrollable = $("#scrollable");
    $scrollable
        .children().width(1000).height(1000);

    $scrollable.dxScrollable({
        useNative: false,
        direction: "vertical",
        onEnd: function() {
            var location = getScrollOffset($scrollable);
            assert.equal(location.top, -10, "content in correct position");
            assert.equal(location.left, -10, "content left in correct position");
        }
    });

    $scrollable.dxScrollable("option", "direction", "both");
    var $content = $("." + SCROLLABLE_CONTENT_CLASS, $scrollable);

    pointerMock($content).start()
        .down()
        .move(-10, -10)
        .wait(1000)
        .up();
});

QUnit.test("no bounce when innercontent more then content", function(assert) {
    var $scrollable = $("#scrollable");
    var $fixture = $("#qunit-fixture");

    $("<div>").width(300).appendTo($fixture).append($scrollable);
    $("<div>").width(500).appendTo($scrollable);

    $scrollable.dxScrollable({
        useNative: false,
        direction: "horizontal",
        inertiaEnabled: false,
        onEnd: function() {
            var location = getScrollOffset($scrollable);
            assert.equal(location.left, -200, "scrollable in right position");
        }
    });

    var $content = $("." + SCROLLABLE_CONTENT_CLASS, $scrollable);
    var mouse = pointerMock($content);

    mouse
        .start()
        .down()
        .move(-200)
        .up();
});

QUnit.test("no scrolling by content during scrolling by thumb", function(assert) {
    var $scrollable = $("#scrollable").height(50).width(50);
    var distance = 10;

    $scrollable.children().width(100).height(100);

    $scrollable.dxScrollable({
        useNative: false,
        direction: "both",
        scrollByThumb: true,
        scrollByContent: false,
        inertiaEnabled: false,
        bounceEnabled: false,
        showScrollbar: 'always'
    });

    var $scrollbarHorizontal = $scrollable.find(".dx-scrollbar-horizontal ." + SCROLLABLE_SCROLL_CLASS);

    pointerMock($scrollbarHorizontal).start()
        .down()
        .move(distance, -distance);

    var scrollableOffset = $scrollable.dxScrollable("scrollOffset");
    assert.equal(scrollableOffset.top, 0, "vertical offset was not changed");
});

QUnit.test("content selection should be allowed during scrolling by thumb", function(assert) {
    var $scrollable = $("#scrollable").height(50).width(50);
    var distance = 10;

    $scrollable.children().width(100).height(100);

    $scrollable.dxScrollable({
        useNative: false,
        direction: "both",
        scrollByThumb: true,
        scrollByContent: false,
        inertiaEnabled: false,
        bounceEnabled: false,
        showScrollbar: 'always'
    });

    $(document).on("dxpointermove.TEST", function(e) {
        assert.ok(!e.isDefaultPrevented(), "default should not be prevented");
    });

    pointerMock($scrollable.children()).start()
        .down()
        .move(distance, -distance);

    $(document).off(".TEST");
});

QUnit.test("reset unused position after change direction (both)", function(assert) {
    var contentWidth = 1000;
    var containerWidth = 100;
    var $scrollable = $("#scrollable").width(containerWidth);

    $scrollable.wrapInner("<div>").children().width(contentWidth);

    var scrollable = $scrollable.dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        direction: "both"
    }).dxScrollable("instance");

    scrollable.scrollTo({ left: contentWidth, top: 10 });
    scrollable.option("direction", "vertical");
    assert.equal(scrollable.scrollLeft(), 0, "left position was reset after change direction");
    assert.equal(scrollable.scrollTop(), 10, "top position was not reset after change direction");
});


QUnit.module("scrollbar", moduleConfig);

QUnit.test("markup", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false
    });

    var $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        $scrollbar = $container.children().eq(1),
        $scroll = $scrollbar.children().eq(0),
        $scrollContent = $scroll.children().eq(0);

    assert.equal($container.find("." + SCROLLABLE_SCROLLBAR_CLASS).length, 1, "single scrollbar added");
    assert.ok($scrollbar.hasClass(SCROLLABLE_SCROLLBAR_CLASS), "dx-scrollable-scrollbar class attached");
    assert.ok($scroll.hasClass(SCROLLABLE_SCROLL_CLASS), "dx-scrollable-scroll class attached");
    assert.ok($scrollContent.hasClass(SCROLLABLE_SCROLL_CONTENT_CLASS), "dx-scrollable-scroll-content class attached");
});

QUnit.test("direction css classes", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        direction: "both"
    });

    assert.equal($scrollable.find("." + SCROLLBAR_HORIZONTAL_CLASS).length, 1, "horizontal scrollbar added");
    assert.equal($scrollable.find("." + SCROLLBAR_VERTICAL_CLASS).length, 1, "vertical scrollbar added");
});

QUnit.test("scrollbar appears when scrolling is begun", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        useSimulatedScrollbar: true,
        inertiaEnabled: false
    });

    var scrollbar = Scrollbar.getInstance($scrollable.find("." + SCROLLBAR_VERTICAL_CLASS));

    assert.equal(scrollbar.option("visible"), false, "scrollbar is hidden before scrolling");

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1);

    assert.equal(scrollbar.option("visible"), true, "scrollbar is shown during scrolling");
});

QUnit.test("scrollbar is hidden when scrolling is completed", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        onEnd: function() {
            assert.equal(scrollbar.option("visible"), false, "scrollbar is hidden");
        }
    });

    var scrollbar = Scrollbar.getInstance($scrollable.find("." + SCROLLBAR_VERTICAL_CLASS));

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1)
        .up();
});

QUnit.test("scrollbar height calculated correctly", function(assert) {
    var containerHeight = 50,
        contentHeight = 100,
        scrollHeight = (containerHeight / contentHeight) * containerHeight;

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false
    });

    var $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS),
        $scroll = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS);

    $container.height(containerHeight);
    $content.height(contentHeight);

    $scrollable.dxScrollable("instance").update();

    assert.equal($scroll.height(), scrollHeight, "scrollbar height calculated correctly");
});

QUnit.test("scrollbar min height", function(assert) {
    var $scrollable = $("#scrollable");
    $scrollable.height(10);
    $scrollable.children().height(10000);

    $scrollable.dxScrollable({
        useNative: false,
        useSimulatedScrollbar: true
    });

    var $scrollbar = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS);
    assert.equal($scrollbar.height(), SCROLLBAR_MIN_HEIGHT);
});

QUnit.test("scrollbar position calculated correctly when content much greater than container", function(assert) {
    var containerSize = 100,
        contentSize = 10000;

    var $scrollable = $("#scrollable");
    $scrollable.height(containerSize);
    $scrollable.wrapInner("<div>").children().height(contentSize);

    $scrollable.dxScrollable({
        useSimulatedScrollbar: true,
        useNative: false
    });
    var $scrollbar = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS);

    $scrollable.dxScrollable("scrollTo", contentSize - containerSize);

    var scrollBarPosition = translator.locate($scrollbar);
    assert.equal(scrollBarPosition.top, containerSize - SCROLLBAR_MIN_HEIGHT);
});

QUnit.test("scrollbar position calculated correctly with scaled content", function(assert) {
    var $scrollable = $("#scaledScrollable");

    $scrollable.dxScrollable({
        useSimulatedScrollbar: true,
        useNative: false,
        showScrollbar: "always",
        direction: "vertical"
    });

    var instance = $scrollable.dxScrollable("instance"),
        $scrollbar = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS);

    instance.scrollTo({ top: 500 });

    var scrollBarPosition = translator.locate($scrollbar),
        $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        scrollbarRect = $scrollbar.get(0).getBoundingClientRect();

    assert.equal(scrollBarPosition.top, 250, "Correct scrollbar position");
    assert.equal(scrollbarRect.height, 125, "Correct scrollbar size");
    assert.equal($container.scrollTop(), 500, "Content position isn't zoomed");
});

QUnit.test("scrollbar in scaled container has correct position after update", function(assert) {
    var containerHeight = 500,
        contentHeight = 1000,
        scaleRatio = 0.5,
        distance = -100,
        scrollbarDistance = -distance * (containerHeight / (contentHeight * 5)) / scaleRatio;

    var $scrollable = $("#scaledScrollable").dxScrollable({
        useNative: false,
        inertiaEnabled: false
    });

    var $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS),
        $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        $scroll = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS);

    $container.height(containerHeight);
    $content.height(contentHeight);
    $scrollable.dxScrollable("instance").update();

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, distance)
        .up();

    $content.height(contentHeight * 5);
    $scrollable.dxScrollable("instance").update();
    $scroll.css("opacity", 1);

    var location = translator.locate($scroll);
    assert.equal(location.top, scrollbarDistance, "scrollbar correctly positioned");
});

QUnit.test("scrollbar width calculated correctly", function(assert) {
    var containerWidth = 50,
        contentWidth = 100,
        scrollWidth = (containerWidth / contentWidth) * containerWidth;

    var $scrollable = $("#scrollable").dxScrollable({
            useNative: false,
            direction: "horizontal"
        }),
        $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS),
        $scroll = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS);

    $container.width(containerWidth);
    $content.width(contentWidth);

    $scrollable.dxScrollable("instance").update();

    assert.equal($scroll.width(), scrollWidth, "scrollbar width calculated correctly");
});

QUnit.test("moving scrollable moves scrollbar", function(assert) {
    var containerHeight = 50,
        contentHeight = 100,
        location,
        distance = -10,
        scrollbarDistance = -distance * (containerHeight / contentHeight);

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        onEnd: function() {
            location = translator.locate($scroll);
            assert.equal(location.top, 2 * scrollbarDistance, "scrollbar follows pointer everytime");
        }
    });

    var $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS),
        $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        $scroll = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS);

    $container.height(containerHeight);
    $content.height(contentHeight);
    $scrollable.dxScrollable("instance").update();

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, distance)
        .move(0, distance)
        .up();
});

QUnit.test("scrollbar has correct position after update", function(assert) {
    var containerHeight = 200,
        contentHeight = 400,
        distance = -10,
        scrollbarDistance = -distance * (containerHeight / (contentHeight * 5));

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        inertiaEnabled: false
    });

    var $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS),
        $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        $scroll = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS);

    $container.height(containerHeight);
    $content.height(contentHeight);
    $scrollable.dxScrollable("instance").update();

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, distance)
        .up();

    $content.height(contentHeight * 5);
    $scrollable.dxScrollable("instance").update();
    $scroll.css("opacity", 1);

    var location = translator.locate($scroll);
    assert.equal(location.top, scrollbarDistance, "scrollbar correctly positioned");
});

QUnit.test("scroll updated before start", function(assert) {
    var scrollHeight = 100;
    var $scrollable = $("#scrollable").height(scrollHeight);
    var $innerWrapper = $scrollable.wrapInner("<div>").children().eq(0).height(scrollHeight / 2);

    var scrollable = $scrollable.dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        direction: "vertical",
        scrollByContent: true,
        bounceEnabled: false
    }).dxScrollable("instance");

    $innerWrapper.height(2 * scrollHeight);
    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -10);

    assert.equal(scrollable.scrollOffset().top, 10, "scrollable moved");
});

QUnit.test("scroll not updated before start if auto update is prevented", function(assert) {
    var scrollHeight = 100;
    var $scrollable = $("#scrollable").height(scrollHeight);
    var $innerWrapper = $scrollable.wrapInner("<div>").children().eq(0).height(scrollHeight / 2);

    var scrollable = $scrollable.dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        direction: "vertical",
        scrollByContent: true,
        bounceEnabled: false,
        updateManually: true
    }).dxScrollable("instance");

    $innerWrapper.height(2 * scrollHeight);
    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -10);

    assert.equal(scrollable.scrollOffset().top, 0, "scrollable not moved");
});

QUnit.test("scroll not updated after scrollTo if auto update is prevented", function(assert) {
    var scrollHeight = 100;
    var $scrollable = $("#scrollable").height(scrollHeight);
    var $innerWrapper = $scrollable.wrapInner("<div>").children().eq(0).height(scrollHeight / 2);

    var scrollable = $scrollable.dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        direction: "vertical",
        scrollByContent: true,
        bounceEnabled: false,
        updateManually: true
    }).dxScrollable("instance");

    $innerWrapper.height(2 * scrollHeight);

    scrollable.scrollTo(10);

    assert.equal(scrollable.scrollOffset().top, 0, "scrollable not moved");
});

QUnit.test("native scrollable should be updated before dxscrollinit", function(assert) {
    var $scrollable = $("#scrollable1").dxScrollable({
        useNative: true,
        direction: "vertical"
    });

    $scrollable.hide();

    var $scrollableNested = $("#scrollable2").dxScrollable({
            useNative: true,
            direction: "vertical"
        }),
        $scrollableNestedContainer = $scrollableNested.find("." + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollableNested.find(".innerContent").eq(0);

    $scrollableNestedContainer.on("dxscrollinit", function() {
        assert.ok(true, "scroll action fired for nested dxScrollable");
    });

    $scrollable.show();
    $content.height(100);

    pointerMock($content).start().down().up();
});

QUnit.test("scrollbar removed when direction changed", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        direction: "vertical"
    });

    assert.equal($scrollable.find("." + SCROLLABLE_SCROLL_CLASS).length, 1, "one scrollbar added");

    $scrollable.dxScrollable("instance").option("direction", "horizontal");

    assert.equal($scrollable.find("." + SCROLLABLE_SCROLL_CLASS).length, 1, "single scrollbar for single direction");
});

QUnit.test("direction class was changed when direction changed", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        direction: "vertical"
    });

    assert.ok($scrollable.hasClass("dx-scrollable-vertical"), "scrollbar has class vertical");
    assert.equal($scrollable.hasClass("dx-scrollable-horizontal"), false, "scrollbar has not class horizontal");
    assert.equal($scrollable.hasClass("dx-scrollable-both"), false, "scrollbar has not class both");

    $scrollable.dxScrollable("instance").option("direction", "horizontal");

    assert.equal($scrollable.hasClass("dx-scrollable-vertical"), false, "scrollbar has class vertical");
    assert.ok($scrollable.hasClass("dx-scrollable-horizontal"), "scrollbar has not class horizontal");
    assert.equal($scrollable.hasClass("dx-scrollable-both"), false, "scrollbar has not class both");

    $scrollable.dxScrollable("instance").option("direction", "both");

    assert.equal($scrollable.hasClass("dx-scrollable-vertical"), false, "scrollbar has class vertical");
    assert.equal($scrollable.hasClass("dx-scrollable-horizontal"), false, "scrollbar has not class horizontal");
    assert.ok($scrollable.hasClass("dx-scrollable-both"), "scrollbar has not class both");
});

QUnit.test("scrollbar does not appear during scrolling when content is less than container", function(assert) {
    var containerHeight = 50,
        contentHeight = containerHeight;

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        inertiaEnabled: false
    });

    var $content = $scrollable.find(".content1"),
        $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS);

    $container.height(containerHeight);
    $content.height(contentHeight);
    $scrollable.dxScrollable("instance").update();

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1);

    assert.ok($scrollable.find(".dx-scrollable-scrollbar").is(":hidden"), "scrollbar is hidden during scrolling");
});

QUnit.test("scrollbar jumps to the mouse click point on scrollbar area", function(assert) {
    $("#qunit-fixture").css("top", 0);

    var containerSize = 50,
        contentHeight = 100,
        moveDistance = 20;

    var $scrollable = $("#scrollable")
        .height(containerSize)
        .wrapInner("<div>");
    $scrollable.children().height(contentHeight);

    $scrollable.dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        showScrollbar: "onHover",
        scrollByThumb: true,
        scrollByContent: false
    });

    var $scrollbarContainer = $scrollable.find(".dx-scrollbar-vertical");
    var pointer = pointerMock($scrollbarContainer)
        .start()
        .move(0, moveDistance)
        .down();

    var scrollable = $scrollable.dxScrollable("instance");
    var scrollOffset = (moveDistance / containerSize) * contentHeight - containerSize / 2;

    assert.equal(scrollable.scrollOffset().top, scrollOffset);

    pointer.move(0, 10);
    assert.equal(scrollable.scrollOffset().top, scrollOffset + (10 / containerSize) * contentHeight);
});

QUnit.test("scrollbar add active class when thumb is clicked", function(assert) {
    var SCROLLBAR_ACTIVE_CLASS = SCROLLABLE_SCROLLBAR_ACTIVE_CLASS;
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        showScrollbar: 'onHover',
        scrollByThumb: true
    });

    var $scrollbar = $scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS);
    var $thumb = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS);


    assert.equal($scrollbar.hasClass(SCROLLBAR_ACTIVE_CLASS), false, "active class was not attached before mouse down on thumb");
    pointerMock($thumb).start().down();

    assert.equal($scrollbar.hasClass(SCROLLBAR_ACTIVE_CLASS), true, "active class was attached after mouse down on thumb");

    pointerMock($("body")).start().up();
    assert.equal($scrollbar.hasClass(SCROLLBAR_ACTIVE_CLASS), false, "active class was not attached after mouse up");
});

QUnit.test("scrollbar add active class when click on scrollbar area", function(assert) {
    var SCROLLBAR_ACTIVE_CLASS = SCROLLABLE_SCROLLBAR_ACTIVE_CLASS;

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        showScrollbar: "onHover",
        scrollByThumb: true
    });

    var $scrollbar = $scrollable.find(".dx-scrollbar-vertical");
    var pointer = pointerMock($scrollbar)
        .start()
        .down();

    assert.equal($scrollbar.hasClass(SCROLLBAR_ACTIVE_CLASS), true, "active class was attached after mouse down on scrollbar area");

    pointer.up();

    assert.equal($scrollbar.hasClass(SCROLLBAR_ACTIVE_CLASS), false, "active class was removed after mouse up");
});

QUnit.test("dx-state-hover-enabled class attached only when showScrollbar is visible", function(assert) {
    var HOVERED_CLASS = "dx-scrollbar-hoverable";
    var $scrollable = $("#scrollable").dxScrollable({
        showScrollbar: 'onScroll',
        useNative: false,
        useSimulatedScrollbar: true,
        direction: "vertical",
        scrollByThumb: true
    });
    var scrollable = $scrollable.dxScrollable("instance"),
        scrollBar = Scrollbar.getInstance($scrollable.find("." + SCROLLBAR_VERTICAL_CLASS));

    assert.equal(scrollBar.option("hoverStateEnabled"), false, "hoverStateEnabled option is false for onScroll mode");
    assert.equal($scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS).hasClass(HOVERED_CLASS), false, "dx-scrollbar-hoverable was not attached when showScrollbar is onScroll");

    scrollable.option("showScrollbar", "onHover");

    scrollBar = Scrollbar.getInstance($scrollable.find("." + SCROLLBAR_VERTICAL_CLASS));
    assert.equal(scrollBar.option("hoverStateEnabled"), true, "hoverStateEnabled option is true for onHover mode");
    assert.equal($scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS).hasClass(HOVERED_CLASS), true, "dx-scrollbar-hoverable was attached when showScrollbar is onHover");
});

QUnit.test("useSimulatedScrollbar is false when useNative option set to true", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true
    });

    assert.equal($scrollable.dxScrollable("option", "useSimulatedScrollbar"), devices.real().platform === "android", "useSimulatedScrollbar should be false");
});

QUnit.test("useSimulatedScrollbar option dependence from useNative option", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        useSimulatedScrollbar: true
    });

    $scrollable.dxScrollable("option", "useNative", true);
    // NOTE: on android devices useSimulatedScrollbar is true always
    assert.equal($scrollable.dxScrollable("option", "useSimulatedScrollbar"), devices.real().platform === "android", "useSimulatedScrollbar option was changed");
});

QUnit.test("scrollBar is not hoverable when scrollByThumb options is false", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        showScrollBar: "onHover",
        scrollByThumb: false
    });

    var scrollbar = Scrollbar.getInstance($scrollable.find(".dx-scrollable-scrollbar"));

    assert.equal(scrollbar.option("hoverStateEnabled"), false, "scrollbar is not hoverable");
});

QUnit.test("container size should be rounded to prevent unexpected scrollbar appearance", function(assert) {
    var scrollbar = new Scrollbar($("#scrollable"), {
        containerSize: 100.8,
        contentSize: 101
    });

    assert.ok(scrollbar.$element().is(":hidden"), "scrollbar is not visible");
});

QUnit.test("content size should be rounded to prevent unexpected scrollbar appearance", function(assert) {
    var scrollbar = new Scrollbar($("#scrollable"), {
        containerSize: 100,
        contentSize: 100.4
    });

    assert.ok(scrollbar.$element().is(":hidden"), "scrollbar is not visible");
});

QUnit.module("api", moduleConfig);

QUnit.test("update", function(assert) {
    var moveDistance = -10,
        moveDuration = 10,
        inertiaDistance = calculateInertiaDistance(moveDistance, moveDuration),
        distance = moveDistance + inertiaDistance,
        $scrollable = $("#scrollable"),
        $scrollableChild = $scrollable.find("div");

    $scrollableChild.height(0);

    $scrollable.dxScrollable({
        useNative: false,
        onEnd: function() {
            var location = getScrollOffset($scrollable);
            assert.equal(Math.round(location.top), Math.round(distance), "distance was calculated correctly");
        }
    });

    var mouse = pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS)).start();

    $scrollableChild.height(-1 * distance + 1);
    $scrollable.dxScrollable("instance").update();

    mouse
        .down()
        .wait(moveDuration)
        .move(0, moveDistance)
        .up();
});

QUnit.test("scroll event should be triggered if scroll position changed", function(assert) {
    var called = 0,
        $scrollable = $("#scrollable").dxScrollable({
            useNative: false,
            direction: "both"
        }),
        $content = $scrollable.find(".content1");

    $scrollable.dxScrollable("scrollTo", { top: 50, left: 50 });

    return new Promise(function(resolve) {
        $scrollable.dxScrollable("option", "onScroll", function() {
            assert.ok(++called <= 2, "scroll was fired on height change");
            resolve();
        });
        $content.height(50);
    }).then(function() {
        return new Promise(function(resolve) {
            $scrollable.dxScrollable("option", "onScroll", function() {
                assert.ok(++called >= 2, "scroll was fired on width change");
                resolve();
            });
            $content.width(50);
        });
    });
});


QUnit.test("content", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false
    });
    var content = $scrollable.dxScrollable("instance").content();

    assert.equal(isRenderer(content), !!config().useJQuery, "content is correct");
    assert.ok($(content).hasClass(SCROLLABLE_CONTENT_CLASS), "returns content");
});

QUnit.test("scrollBy with plain object", function(assert) {
    var distance = 10,
        $scrollable = $("#scrollable").dxScrollable({
            useNative: false,
            onEnd: function() {
                var location = getScrollOffset($scrollable);
                assert.equal(location.top, -distance, "scroll to correctly vertical position");
                assert.equal(location.left, 0, "scroll to correctly horizontal position");
            }
        }),
        scrollable = $scrollable.dxScrollable("instance");

    scrollable.scrollBy({ left: distance, top: distance });
});

QUnit.test("scrollBy with numeric", function(assert) {
    var distance = 10,
        $scrollable = $("#scrollable").dxScrollable({
            useNative: false,
            onEnd: function() {
                var location = getScrollOffset($scrollable);
                assert.equal(location.top, -distance, "scroll to correctly vertical position");
                assert.equal(location.left, 0, "scroll to correctly horizontal position");
            }
        }),
        scrollable = $scrollable.dxScrollable("instance");

    scrollable.scrollBy(distance);
});

QUnit.test("scrollBy actions", function(assert) {
    var started = 0,
        scrolled = 0,
        ended = 0,
        completed = $.Deferred(),
        distance = 10,
        $scrollable = $("#scrollable").dxScrollable({
            useNative: false,
            onStart: function() {
                started++;
            },
            onScroll: function() {
                scrolled++;
            },
            onEnd: function() {
                ended++;
                completed.resolve();
            }
        }),
        scrollable = $scrollable.dxScrollable("instance");

    scrollable.scrollBy(distance);
    completed.done(function() {
        assert.equal(started, 1, "start action should be fired once");
        assert.equal(scrolled, 1, "scroll action should be fired once");
        assert.equal(ended, 1, "end action should be fired once");
    });
});

QUnit.test("scrollBy to location", function(assert) {
    var distance = 10,
        wasFirstMove = false;

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        onEnd: function() {
            if(wasFirstMove) {
                var location = getScrollOffset($scrollable);
                assert.equal(location.top, -distance * 2, "scroll to correctly vertical position");
            }
            wasFirstMove = true;
        }
    });

    var scrollable = $scrollable.dxScrollable("instance");

    scrollable.scrollBy(distance);
    scrollable.scrollBy(distance);
});

QUnit.test("scrollBy to location with dynamic content", function(assert) {
    var distance = 10,
        wasFirstMove = false;

    var $scrollable = $("#scrollable").empty().dxScrollable({
        useNative: false,
        onEnd: function() {
            if(wasFirstMove) {
                var location = getScrollOffset($scrollable);
                assert.equal(location.top, -distance * 2, "scroll to correctly vertical position");
            }
            wasFirstMove = true;
        }
    });

    var scrollable = $scrollable.dxScrollable("instance"),
        $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS);


    $content.append($("<div>").height(100));
    scrollable.scrollBy(distance);
    scrollable.scrollBy(distance);
});

QUnit.test("scrollBy to location with dynamic content if auto update is prevented", function(assert) {
    var distance = 10,
        wasFirstMove = false;

    var $scrollable = $("#scrollable").empty().dxScrollable({
        useNative: false,
        updateManually: true,
        onEnd: function() {
            if(wasFirstMove) {
                var location = getScrollOffset($scrollable);
                assert.equal(location.top, 0, "scroll to correctly vertical position");
            }
            wasFirstMove = true;
        }
    });

    var scrollable = $scrollable.dxScrollable("instance"),
        $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS);


    $content.append($("<div>").height(100));
    scrollable.scrollBy(distance);
    scrollable.scrollBy(distance);
});

QUnit.test("scrollTo to location", function(assert) {
    var distance = 10,
        actionFiredCount = 0;

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        onEnd: function() {
            actionFiredCount++;
        }
    });

    var scrollable = $scrollable.dxScrollable("instance");

    scrollable.scrollTo(distance);
    scrollable.scrollTo(distance);

    assert.equal(actionFiredCount, 1, "action was fired only one time");
});

QUnit.test("scrollTo to location with dynamic content", function(assert) {
    var wasFirstMove = false;

    var $scrollable = $("#scrollable").empty().append($("<div>").height(150)).dxScrollable({
        useNative: false,
        onEnd: function() {
            if(wasFirstMove) {
                var location = getScrollOffset($scrollable);
                assert.equal(location.top, -50, "scroll to correctly vertical position");
            }
            wasFirstMove = true;
        }
    });

    var scrollable = $scrollable.dxScrollable("instance"),
        $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS);

    scrollable.scrollTo(100);
    $content.empty().append($("<div>").height(101));
    scrollable.scrollTo(50);
});

QUnit.test("scrollOffset", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false
    });
    var $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS);

    translator.move($content, { top: -10 });

    assert.deepEqual($scrollable.dxScrollable("scrollOffset"), { top: 10, left: 0 }, "scrollOffset is correct");
});

QUnit.test("scrollLeft", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false
    });
    var $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS);

    translator.move($content, { left: -10 });

    assert.equal($scrollable.dxScrollable("scrollLeft"), 10, "scrollLeft is correct");
});

QUnit.test("scrollTop", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false
    });
    var $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS);

    translator.move($content, { top: -10 });

    assert.equal($scrollable.dxScrollable("scrollTop"), 10, "scrollLeft is correct");
});

QUnit.test("scrollbar hidden while scrolling when showScrollbar is false", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        showScrollbar: false
    });

    var $scrollbar = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS);

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1);

    assert.equal($scrollbar.is(":hidden"), true, "scrollbar is hidden");
});

QUnit.test("showScrollbar render", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        showScrollbar: false
    });

    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_HIDDEN), true, "scrollable has class scrollbars_disabled");

    $scrollable.dxScrollable("option", "showScrollbar", true);

    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_HIDDEN), false, "scrollable has not class scrollbars_disabled");
});

QUnit.test("event arguments", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        onScroll: function(e) {
            assert.notEqual(e.event, undefined, "Event passed");
            assert.deepEqual(e.scrollOffset, { top: 10, left: undefined }, "scrollOffset passed");
            assert.equal(e.reachedLeft, undefined, "reachedLeft passed");
            assert.equal(e.reachedRight, undefined, "reachedRight passed");
            assert.equal(e.reachedTop, false, "reachedTop passed");
            assert.equal(e.reachedBottom, false, "reachedBottom passed");
        }
    });

    var mouse = pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS)).start(),
        distance = -10;

    mouse
        .down()
        .move(0, distance)
        .up();
});

QUnit.test("disabled: scroll was not moved when disabled is true", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
            useNative: false,
            disabled: true
        }),
        mouse = pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS)).start(),
        location,
        distance = -10;

    mouse.down().move(0, distance);
    location = getScrollOffset($scrollable);
    assert.equal(location.top, 0, "scroll was not moved when disabled is true");
    mouse.up();
});

QUnit.test("simulated strategy should subscribe to the poiner events after disabled option changed", function(assert) {
    var $scrollable = $("#scrollable"),
        scrollableInstance = $("#scrollable").dxScrollable({
            useNative: false,
            showScrollbar: "onHover",
            disabled: true
        }).dxScrollable("instance");

    scrollableInstance.option("disabled", false);

    var scrollbar = Scrollbar.getInstance($scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS));
    var $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS);

    $container.trigger("mouseenter");

    assert.equal(scrollbar.option("visible"), true, "thumb is visible after mouse enter");
});

QUnit.test("disabled option add class to root element", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false
    });

    assert.equal($scrollable.hasClass(SCROLLABLE_DISABLED_CLASS), false, "scrollable have not disabled class");

    $scrollable.dxScrollable("option", "disabled", true);

    assert.equal($scrollable.hasClass(SCROLLABLE_DISABLED_CLASS), true, "scrollable have disabled class");
});

QUnit.test("changing option showScrollbar does not duplicate scrollbar", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        showScrollbar: true
    });

    $scrollable.dxScrollable("option", "showScrollbar", false);

    var $scrollbars = $scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS);

    assert.equal($scrollbars.length, 1, "scrollbar is not duplicated");
});

QUnit.test("switching useNative to false turns off native scrolling", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true
    });

    var $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS);
    assert.notEqual($container.css("overflowY"), "hidden");

    $scrollable.dxScrollable("option", "useNative", false);

    assert.equal($container.css("overflowY"), "hidden");
});

QUnit.test("scrollToElement", function(assert) {
    var $scrollable = $("#scrollable").height(50);
    var $wrapper = $scrollable.wrapInner("<div>").children().eq(0);
    var $item = $("<div>").height(25).appendTo($scrollable);

    $scrollable.dxScrollable({
        direction: "vertical"
    });

    var scrollable = $scrollable.dxScrollable("instance");

    scrollable.scrollToElement($item.get(0));

    assert.equal(scrollable.scrollTop(), $wrapper.height() + $item.outerHeight() - scrollable.clientHeight());
});

QUnit.test("scrollToElement when item height is greater than scroll height", function(assert) {
    var $scrollable = $("#scrollable").height(50);
    var $wrapper = $scrollable.wrapInner("<div>").children().eq(0);
    var $item = $("<div>").height(100).appendTo($scrollable);

    $scrollable.dxScrollable({
        direction: "vertical"
    });

    var scrollable = $scrollable.dxScrollable("instance");

    scrollable.scrollToElement($item.get(0));

    assert.equal(scrollable.scrollTop(), $wrapper.height());
});

QUnit.test("scrollToElement with offset", function(assert) {
    var bottomOffset = 70;
    var $scrollable = $("#scrollable").empty().height(100);
    var $item1 = $("<div>").height(50).appendTo($scrollable);
    var $item2 = $("<div>").height(50).appendTo($scrollable);

    $("<div>").height(150).appendTo($scrollable);

    var scrollable = $scrollable.dxScrollable({
        direction: "vertical"
    }).dxScrollable("instance");

    scrollable.scrollToElement($item2, { bottom: bottomOffset });
    assert.equal(scrollable.scrollTop(), $item1.outerHeight());
});

QUnit.test("scrollToElement with offset in opposite direction", function(assert) {
    var topOffset = 30;
    var $scrollable = $("#scrollable").empty().height(100);
    var $item1 = $("<div>").height(50).appendTo($scrollable);
    var $item2 = $("<div>").height(50).appendTo($scrollable);

    $("<div>").height(1500).appendTo($scrollable);

    var scrollable = $scrollable.dxScrollable({
        direction: "vertical"
    }).dxScrollable("instance");

    scrollable.scrollTo(200);
    scrollable.scrollToElement($item2, { top: topOffset });
    assert.equal(scrollable.scrollTop(), $item1.outerHeight() - topOffset);
});

QUnit.test("scrollToElement with absolute position in the container(T162489)", function(assert) {
    var $scrollable = $("#scrollable"),
        $wrapper = $scrollable.wrapInner("<div>").children().eq(0),
        $item = $("<div>", {
            css: {
                position: "absolute",
                top: 50
            }
        }).height(100).append($("<div/>")).appendTo($scrollable);

    $scrollable.dxScrollable({
        direction: "vertical"
    });

    var scrollable = $scrollable.dxScrollable("instance");

    scrollable.scrollTo(50);
    scrollable.scrollToElement($item.children().eq(0));

    assert.equal(scrollable.scrollTop() + scrollable.option("pushBackValue"), $wrapper.height() - scrollable.clientHeight());
});

QUnit.test("scrollToElement does not scroll to element when element is not child of scrollable", function(assert) {
    var $scrollable = $("#scrollable");
    var $item = $("<div>").height(500).insertAfter($scrollable);

    $scrollable.dxScrollable({
        direction: "vertical"
    });

    var scrollable = $scrollable.dxScrollable("instance");

    scrollable.scrollToElement($item);

    assert.equal(scrollable.scrollTop(), 0, "scrollable was not scrolled");
});

QUnit.test("scrollToElement scrolls to bottom position of element when scroll scrollTop less than element position.top", function(assert) {
    var $scrollable = $("#scrollable").height(50);
    var $wrapper = $scrollable.wrapInner("<div>").children().eq(0);
    var $item = $("<div>").height(100).appendTo($scrollable);
    var $spaceItem = $("<div>").height(500).appendTo($scrollable);

    $scrollable.dxScrollable({
        direction: "vertical"
    });

    var scrollable = $scrollable.dxScrollable("instance");
    scrollable.scrollTo($wrapper.height() + $item.height() + $spaceItem.height());
    scrollable.scrollToElement($item);

    assert.equal(scrollable.scrollTop(), $wrapper.outerHeight() + $item.outerHeight() - scrollable.clientHeight());
});

QUnit.test("scrollToElement does not scroll when element is placed in visible area", function(assert) {
    var $scrollable = $("#scrollable").height(30);
    var $item = $("<div>").height(10).prependTo($scrollable);

    $("<div>").height(30).prependTo($scrollable);

    $scrollable.dxScrollable({
        direction: "vertical"
    });

    var scrollable = $scrollable.dxScrollable("instance");
    scrollable.scrollTo(30);
    scrollable.scrollToElement($item);

    assert.equal(scrollable.scrollTop(), 30);
});

QUnit.test("scrollToElement does not scroll when element is placed in visible area and greater than visible area", function(assert) {
    var $scrollable = $("#scrollable").height(30);
    var $item = $("<div>").height(50).prependTo($scrollable);

    $scrollable.dxScrollable({
        direction: "vertical"
    });

    var scrollable = $scrollable.dxScrollable("instance");
    scrollable.scrollToElement($item);

    assert.equal(scrollable.scrollTop(), 0);
});

QUnit.test("scrollToElements scrolls in both directions", function(assert) {
    var topPosition = 30;
    var leftPosition = 50;
    var itemSize = 30;

    var $scrollable = $("#scrollable").width(50).height(50).css("position", "relative");

    $scrollable.wrapInner("<div>").children().eq(0).width(200).height(200);

    var $item = $("<div>").css({
        width: itemSize + "px",
        height: itemSize + "px",
        position: "absolute",
        top: topPosition + "px",
        left: leftPosition + "px"
    }).appendTo($scrollable);

    var scrollable = $scrollable.dxScrollable({
        direction: "both"
    }).dxScrollable("instance");

    scrollable.scrollToElement($item);
    assert.equal(scrollable.scrollTop() + scrollable.option("pushBackValue"), topPosition + itemSize - scrollable.clientHeight(), "scrollable was scrolled by vertical");
    assert.equal(scrollable.scrollLeft(), leftPosition + itemSize - scrollable.clientWidth(), "scrollable was scrolled by horizontal");
});

QUnit.test("scrollTo should not reset unused position", function(assert) {
    var contentWidth = 1000;
    var containerWidth = 100;
    var $scrollable = $("#scrollable").width(containerWidth);

    $scrollable.wrapInner("<div>").children().width(contentWidth);

    var scrollable = $scrollable.dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        direction: "both"
    }).dxScrollable("instance");

    scrollable.scrollTo({ left: containerWidth, top: 10 });
    scrollable.scrollTo({ top: 40 });
    assert.equal(scrollable.scrollLeft(), containerWidth, "left position was not reset");
    assert.equal(scrollable.scrollTop(), 40, "top position set");
});

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


QUnit.module("initViewport integration", moduleConfig);

QUnit.test("initViewport with disabled panning doesn't lock native scrolling", function(assert) {
    assert.expect(1);

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true
    });
    var mouse = pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS));

    try {
        initMobileViewport({ allowZoom: true, allowPan: false });

        $(document).on("dxpointermove.initViewportIntegration", function(e) {
            assert.equal(e.isDefaultPrevented(), false, "dxpointermove was not prevented");
        });

        mouse.start("touch").down().move(1, 1);

    } finally {
        initMobileViewport({ allowZoom: true, allowPan: true });
        $(document).off(".initViewportIntegration");
    }
});

QUnit.test("initViewport disables panning for non-native scrolling", function(assert) {
    assert.expect(1);

    var $scrollable = $("#scrollable").dxScrollable({
            useNative: false,
            inertiaEnabled: false
        }),
        mouse = pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS));

    var originalSupportTouch;

    try {
        originalSupportTouch = support.touch;
        support.touch = true;
        initMobileViewport({ allowZoom: true, allowPan: false });

        $(document).on("dxpointermove.initViewportIntegration", function(e) {
            assert.equal(e.isDefaultPrevented(), true, "dxpointermove was prevented");
        });

        mouse.start("touch").down().move(1, 1);

    } finally {
        support.touch = originalSupportTouch;
        initMobileViewport({ allowZoom: true, allowPan: true });
        $(document).off(".initViewportIntegration");
    }
});

QUnit.test("dxpointermove is prevented when scrolling is disabled (Q574378)", function(assert) {
    var realDevice = devices.real(),
        isWin10 = realDevice.platform === "win" && realDevice.version[0] === 10;

    if(isWin10) {
        assert.ok(true, "test is not relevant for win10 devices");
        return;
    }

    var $scrollable = $("#scrollable");

    $scrollable
        .height("auto")
        .wrapInner("<div>").children().height(50);

    $scrollable.dxScrollable({
        useNative: true
    });

    var originalSupportTouch;

    try {
        originalSupportTouch = support.touch;
        support.touch = true;
        initMobileViewport({ allowZoom: true, allowPan: false });

        $(document).on("dxpointermove.initViewportIntegration", function(e) {
            assert.equal(e.isDefaultPrevented(), true, "dxpointermove was prevented on non win10 devices");
        });

        pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
            .start("touch")
            .down()
            .move(0, 1);

    } finally {
        support.touch = originalSupportTouch;
        initMobileViewport({ allowZoom: true, allowPan: true });
        $(document).off(".initViewportIntegration");
    }
});


QUnit.module("events integration", moduleConfig);

QUnit.test("scrollable returns to bound and prevent other gestures", function(assert) {
    var $scrollable = $("#scrollable");
    var $scrollableInner = $("<div>").appendTo($scrollable).dxScrollable({
        useNative: false,
        bounceEnabled: true,
        direction: "horizontal"
    });

    $scrollable.dxScrollable({
        useNative: false,
        bounceEnabled: true,
        direction: "vertical"
    });

    pointerMock($scrollable).start()
        .down()
        .move(0, 10);

    pointerMock($scrollableInner).start()
        .down()
        .move(10, 0)
        .up();

    this.clock.tick(1000);
    assert.equal($scrollable.dxScrollable("scrollTop"), 0);
});

QUnit.test("scrollable locking", function(assert) {
    var $scrollable = $("#scrollable");
    var $scrollableWrapper = $scrollable.wrap("<div>").parent();

    var scrollable = $scrollable.dxScrollable({
        direction: "vertical",
        useNative: false
    }).dxScrollable("instance");

    $scrollableWrapper.on("dxscroll", function() {
        assert.ok(true, "scrollable is locked");
    });

    scrollable._lock();

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS)).start()
        .down()
        .move(0, 10)
        .up();

    this.clock.tick(1000);
});


QUnit.module("regression", moduleConfig);

QUnit.test("B250273 - dxList: showScrollbar option does not work on device.", function(assert) {
    var $scrollable = $("#scrollable");

    $scrollable.dxScrollable({
        useNative: true,
        showScrollbar: false,
        useSimulatedScrollbar: true
    });

    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_HIDDEN), true, "scrollable has class scrollbars_disabled");
    assert.equal($scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS).length, 0);

    $scrollable.dxScrollable("option", "showScrollbar", true);
    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_HIDDEN), false, "scrollable has not class scrollbars_disabled");
    assert.equal($scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS).length, 1);

    $scrollable.dxScrollable("option", "showScrollbar", false);
    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_HIDDEN), true, "scrollable has class scrollbars_disabled");
    assert.equal($scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS).length, 0);
});

QUnit.test("B252134 - Scrolling works in design mode", function(assert) {
    config({ designMode: true });

    try {
        var startCalled = 0,
            stopCalled = 0,
            endCalled = 0,
            updateCalled = 0,

            $scrollable = $("#scrollable").dxScrollable({
                useNative: false,

                onStart: function() {
                    startCalled++;
                },

                onStop: function() {
                    stopCalled++;
                },

                onEnd: function() {
                    endCalled++;
                },

                update: function() {
                    updateCalled++;
                }
            }),
            $container = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS);

        pointerMock($container)
            .start()
            .down()
            .move(0, 500)
            .up();

        assert.equal(startCalled, 0);
        assert.equal(stopCalled, 0);
        assert.equal(endCalled, 0);
        assert.equal(updateCalled, 0);

        assert.equal(translator.locate($container).top, 0);
    } finally {
        config({ designMode: false });
    }
});

QUnit.test("simulated scrollable should stop animators on disposing", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        direction: "both"
    });
    var scrollable = $scrollable.dxScrollable("instance");

    scrollable.scrollTo({ left: 999, top: 999 });

    $scrollable.remove();

    var scrollers = scrollable._strategy._scrollers,
        verticalScroller = scrollers["vertical"],
        horizontalScroller = scrollers["horizontal"];

    assert.ok(verticalScroller._inertiaAnimator._isStopped());
    assert.ok(horizontalScroller._inertiaAnimator._isStopped());

    assert.ok(verticalScroller._bounceAnimator._isStopped());
    assert.ok(horizontalScroller._bounceAnimator._isStopped());
});

QUnit.test("scrollable content should not blink in bounce on iOS", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true
    });
    var instance = $scrollable.dxScrollable("instance");
    var $wrapper = $scrollable.find("." + SCROLLABLE_WRAPPER_CLASS);
    var onStart = false;
    var onEnd = false;

    $wrapper
        .on("dxscrollstart", function() {
            onStart = instance._strategy._disablePushBack;
        })
        .on("dxscrollend", function() {
            onEnd = instance._strategy._disablePushBack;
        });

    pointerMock($(".content1"))
        .start()
        .down()
        .move(0, 10)
        .up();

    assert.ok(onStart, "constant _disablePushBack is true on scroll start");
    assert.ok(!onEnd, "constant _disablePushBack is false on scroll end");
});


QUnit.module("scrollers interaction", moduleConfig);

QUnit.test("scrolling component with content size equal to container size nested in another component causes outer component scrolling", function(assert) {
    assert.expect(1);

    var complete = $.Deferred();

    $("#scrollable").dxScrollable({
        useNative: false,
        bounceEnabled: true,
        inertiaEnabled: false,
        onScroll: function() {
            complete.resolve();
        }
    });

    var $scrollableNested = $(".content1").dxScrollable({
        useNative: false,
        bounceEnabled: false
    });

    pointerMock($scrollableNested).start()
        .down()
        .move(0, -10);

    complete.done(function() {
        assert.ok(true, "scroll action fired for external dxScrollable");
    });
});

QUnit.test("disabled scrollable nested in another scrollable causes outer component scrolling (B238642)", function(assert) {
    assert.expect(1);

    var complete = $.Deferred();

    $("#scrollable").dxScrollable({
        useNative: false,
        bounceEnabled: true,
        inertiaEnabled: false,
        onScroll: function() {
            complete.resolve();
        }
    });

    var $scrollableNested = $(".content1").dxScrollable({ disabled: true });

    pointerMock($scrollableNested).start()
        .down()
        .move(0, -10);

    complete.done(function() {
        assert.ok(true, "scroll action fired for external dxScrollable");
    });
});


QUnit.module("scrolling by thumb", moduleConfig);

QUnit.test("normalize visibilityMode for scrollbar", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        showScrollbar: true,
        useNative: false
    });

    var scrollbar = Scrollbar.getInstance($("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable));
    assert.equal(scrollbar.option("visibilityMode"), "onScroll", "true normalize to onScroll");

    $scrollable.dxScrollable("option", "showScrollbar", false);

    scrollbar = Scrollbar.getInstance($("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable));
    assert.equal(scrollbar.option("visibilityMode"), "never", "true normalize to onScroll");
});

QUnit.test("scroll by thumb", function(assert) {
    var containerHeight = 50,
        contentHeight = 100;

    var $scrollable = $("#scrollable").dxScrollable({
        scrollByThumb: true,
        inertiaEnabled: false,
        useNative: false
    });

    var $thumb = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS),
        mouse = pointerMock($thumb).start(),
        location,
        distance = 10,
        $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS),
        containerToContentRatio = (containerHeight / contentHeight);

    $container.height(containerHeight);
    $content.height(contentHeight);
    $scrollable.dxScrollable("update");

    mouse.down();
    var downEvent = mouse.lastEvent();
    mouse.move(0, distance);
    location = getScrollOffset($scrollable);

    assert.notOk(downEvent.isDefaultPrevented(), "default is not prevented"); // T516691
    assert.equal(location.top, -distance / containerToContentRatio, "scroll follows pointer");

    mouse.move(0, distance);
    location = getScrollOffset($scrollable);
    assert.equal(location.top, -2 * distance / containerToContentRatio, "scroll follows pointer everytime");
});

QUnit.test("scrollTo should scroll to correct position during scroll by thumb", function(assert) {
    var containerHeight = 50,
        contentHeight = 100;

    var $scrollable = $("#scrollable").dxScrollable({
        scrollByThumb: true,
        inertiaEnabled: false,
        useNative: false
    });

    var $thumb = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS),
        mouse = pointerMock($thumb).start(),
        $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS),
        instance = $scrollable.dxScrollable("instance");

    $container.height(containerHeight);
    $content.height(contentHeight);
    instance.update();

    mouse.down().move(0, 10);
    instance.scrollTo(30);

    assert.equal(instance.scrollTop(), 30, "scroll has correct position");
});

QUnit.test("scroll by thumb without scrolling by content", function(assert) {
    var containerHeight = 50,
        contentHeight = 100;

    var $scrollable = $("#scrollable").dxScrollable({
        scrollByThumb: true,
        scrollByContent: false,
        bounceEnabled: false,
        inertiaEnabled: false,
        useNative: false
    });

    var $thumb = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS),
        mouse = pointerMock($thumb).start(),
        distance = 10,
        $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS);

    $container.height(containerHeight);
    $content.height(contentHeight);
    $scrollable.dxScrollable("update");

    mouse.down().move(0, distance);
    assert.notEqual(getScrollOffset($scrollable).top, 0, "scroll follows pointer");
});

QUnit.test("scroll by thumb should prevent scrolling cross direction", function(assert) {
    var containerSize = 50,
        contentSize = 100;

    var $scrollable = $("#scrollable").dxScrollable({
        direction: "both",
        scrollByThumb: true,
        scrollByContent: true,
        bounceEnabled: false,
        inertiaEnabled: false,
        useNative: false
    });

    var $thumb = $scrollable.find("." + SCROLLBAR_VERTICAL_CLASS + " ." + SCROLLABLE_SCROLL_CLASS),
        mouse = pointerMock($thumb).start(),
        distance = 10,
        $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS);

    $container
        .height(containerSize)
        .width(containerSize);
    $content
        .height(contentSize)
        .width(contentSize);
    $scrollable.dxScrollable("update");

    mouse.down().move(-distance, distance);
    assert.equal(getScrollOffset($scrollable).left, 0, "horizontal scrolling prevented");
});

QUnit.test("thumb is visible on mouseenter when thumbMode='onHover'", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        showScrollbar: 'onHover',
        inertiaEnabled: false,
        useNative: false
    });

    var $container = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);
    var scrollbar = Scrollbar.getInstance($("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable));

    assert.equal(scrollbar.option("visible"), false, "thumb is hidden after scrollable creation");

    $container.trigger("mouseenter");

    assert.equal(scrollbar.option("visible"), true, "thumb is visible after mouse enter");

    $container.trigger("mouseleave");

    assert.equal(scrollbar.option("visible"), false, "thumb is hidden after mouse leave");
});

QUnit.test("thumb is visible after update when content became more then container", function(assert) {
    var $scrollable = $("#scrollable").height(100);
    var $innerWrapper = $scrollable.wrapInner("<div>").children().height(50);

    $scrollable.dxScrollable({
        showScrollbar: "onHover",
        useNative: false
    });

    var scrollbar = Scrollbar.getInstance($scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS));
    var $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS);

    $container.trigger("mouseenter");

    assert.equal(scrollbar.option("visible"), false, "thumb is hidden when content less then container");

    $innerWrapper.height(200);
    $scrollable.dxScrollable("update");

    assert.equal(scrollbar.option("visible"), true, "thumb is visible after update");
});

QUnit.test("thumb hide after scroll when showScrollbar = onScroll", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        showScrollbar: 'onScroll',
        inertiaEnabled: false,
        useNative: false
    });

    var $content = $("." + SCROLLABLE_CONTENT_CLASS, $scrollable);
    var $scrollbar = $("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable);
    var scrollbar = Scrollbar.getInstance($scrollbar);

    $scrollbar.trigger("mouseenter");
    pointerMock($content).start().wheel(1);

    assert.equal(scrollbar.option("visible"), false, "thumb is visible after scroll");
});

QUnit.test("thumb stays visible after scroll when mouseEnter on scrollbar and scroll stopped", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        showScrollbar: 'onHover',
        inertiaEnabled: false,
        useNative: false
    });

    var $container = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);
    var scrollbar = Scrollbar.getInstance($("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable));

    $container.trigger("mouseenter");
    pointerMock($container).start().wheel(1);

    assert.equal(scrollbar.option("visible"), true, "thumb is visible after mouse enter");
});

QUnit.test("thumb always visible when showScroll = always", function(assert) {
    var $scrollable = $("#scrollable").height(100);
    $scrollable.children().height(200);

    $scrollable.dxScrollable({
        showScrollbar: 'always',
        inertiaEnabled: false,
        useNative: false
    });

    var $scrollbar = $("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable);
    var scrollbar = Scrollbar.getInstance($scrollbar);

    assert.equal(scrollbar.option("visible"), true, "thumb is visible always");

    pointerMock($("." + SCROLLABLE_CONTENT_CLASS, $scrollable)).start().wheel(1);

    assert.equal(scrollbar.option("visible"), true, "thumb is visible always");
});

QUnit.test("always visible class should be added when showScrollbar = always", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        showScrollbar: 'always',
        useNative: false
    });
    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE), true, "class added");

    $scrollable.dxScrollable("option", "showScrollbar", "never");
    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE), false, "class added");
});

QUnit.test("showScrollbar option change", function(assert) {
    var $scrollable = $("#scrollable").height(100);
    $scrollable.children().height(200);

    $scrollable.dxScrollable({
        showScrollbar: 'always',
        useNative: false
    });

    $scrollable.dxScrollable("option", "showScrollbar", "never");

    var $scrollbar = $("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable),
        scrollbar = Scrollbar.getInstance($scrollbar);

    assert.equal($scrollbar.is(":hidden"), true);
    assert.equal(scrollbar.option("visible"), false);
});

QUnit.test("scrolling by thumb does not cause inertia", function(assert) {
    assert.expect(1);

    var containerHeight = 50,
        contentHeight = 100;

    var $scrollable = $("#scrollable").dxScrollable({
        scrollByThumb: true,
        useNative: false,
        onEnd: function() {
            var location = getScrollOffset($scrollable);
            assert.equal(location.top, -2 * distance / containerToContentRatio, "no inertia");
        }
    });

    $scrollable.find("." + SCROLLABLE_CONTENT_CLASS).height(contentHeight);

    var $thumb = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS),
        mouse = pointerMock($thumb).start(),
        distance = 10,
        containerToContentRatio = (containerHeight / contentHeight);

    $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS).height(containerHeight);

    $scrollable.dxScrollable("update");

    mouse
        .down()
        .move(0, distance)
        .wait(20)
        .move(0, distance)
        .up();
});

QUnit.test("thumb is visible on mouseenter when thumbMode='onHover' only for single scrollable nested in another scrollable", function(assert) {
    var $scrollable = $("#scrollable");
    var $wrapScrollable = $scrollable.wrap("<div>").parent();

    $wrapScrollable.height(10);
    $scrollable.height(20);
    $scrollable.children().height(30);

    var scrollableOption = {
        useNative: false,
        showScrollbar: "onHover"
    };

    $scrollable.dxScrollable(scrollableOption);
    $wrapScrollable.dxScrollable(scrollableOption);

    var $scrollableContainer = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);
    var $wrapScrollableContainer = $("." + SCROLLABLE_CONTAINER_CLASS, $wrapScrollable).not($scrollableContainer);
    var $scrollableScrollbar = $("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable);
    var scrollableScrollbar = Scrollbar.getInstance($scrollableScrollbar);
    var wrapScrollableScrollbar = Scrollbar.getInstance($("." + SCROLLABLE_SCROLLBAR_CLASS, $wrapScrollable).not($scrollableScrollbar));

    $wrapScrollableContainer.trigger($.Event("mouseenter", { originalEvent: {} }));
    $scrollableContainer.trigger($.Event("mouseenter", { originalEvent: {} }));

    assert.equal(scrollableScrollbar.option("visible"), true, "scrollbar is visible for inner scrollable");
    assert.equal(wrapScrollableScrollbar.option("visible"), false, "scrollbar is hidden for outer scrollable");
});

QUnit.test("scroll by thumb does not hide scrollbar when mouse goes outside of scrollable", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        showScrollbar: "onHover",
        scrollByContent: true
    });

    var $scrollbar = $("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable);
    var scrollbar = Scrollbar.getInstance($scrollbar);
    var $container = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);

    $container.trigger($.Event("mouseenter", { originalEvent: {} }));

    pointerMock($container)
        .start()
        .down()
        .move(0, -1);


    assert.equal(scrollbar.option("visible"), true, "scrollbar is visible");

    $container.trigger($.Event("mouseleave", { originalEvent: {} }));

    assert.equal(scrollbar.option("visible"), true, "scrollbar is visible after mouseleave");
});

QUnit.test("leaving inner scroller and releasing in outer scroller should hide inner scrollbar and show outer scrollbar", function(assert) {
    var $scrollable = $("#scrollable");
    var $wrapScrollable = $scrollable.wrap("<div>").parent();

    $wrapScrollable.height(10);
    $scrollable.height(20);
    $scrollable.children().height(30);

    var scrollableOption = {
        useNative: false,
        inertiaEnabled: false,
        showScrollbar: "onHover"
    };

    $scrollable.dxScrollable(scrollableOption);
    $wrapScrollable.dxScrollable(scrollableOption);

    var $scrollableContainer = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);
    var $wrapScrollableContainer = $("." + SCROLLABLE_CONTAINER_CLASS, $wrapScrollable).not($scrollableContainer);
    var $scrollableScrollbar = $("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable);
    var scrollableScrollbar = Scrollbar.getInstance($scrollableScrollbar);
    var wrapScrollableScrollbar = Scrollbar.getInstance($("." + SCROLLABLE_SCROLLBAR_CLASS, $wrapScrollable).not($scrollableScrollbar));

    // enter outer
    $wrapScrollableContainer.trigger($.Event("mouseenter", { originalEvent: {} }));
    // enter inner
    $scrollableContainer.trigger($.Event("mouseenter", { originalEvent: {} }));

    // start scrolling inner
    pointerMock($scrollableContainer).start().down().move(0, 10);
    // leaving inner
    $scrollableContainer.trigger($.Event("mouseleave", { relatedTarget: $wrapScrollableContainer.get(0) }));
    // up on outer
    pointerMock($wrapScrollableContainer).up();

    assert.equal(scrollableScrollbar.option("visible"), false, "scrollbar is hidden for inner scrollable");
    assert.equal(wrapScrollableScrollbar.option("visible"), true, "scrollbar is visible for outer scrollable");
});

QUnit.test("scrollbar is visible for parent scrollable after mouse leave for children scrollable", function(assert) {
    var $scrollable = $("#scrollable").height(25);
    var $childScrollable = $("<div>").height(50);

    $childScrollable.append("<div>").children().height(75);
    $childScrollable.appendTo($scrollable).dxScrollable({
        useNative: false,
        showScrollbar: "onHover",
        direction: "vertical"
    });
    $scrollable.dxScrollable({
        useNative: false,
        showScrollbar: "onHover",
        direction: "vertical"
    });

    var $parentContainer = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS).eq(0);
    var $childrenContainer = $childScrollable.find("." + SCROLLABLE_CONTAINER_CLASS);

    $parentContainer.trigger($.Event("mouseenter", { originalEvent: { target: $parentContainer.get(0) } }));
    $childrenContainer.trigger($.Event("mouseenter", { originalEvent: { target: $childrenContainer.get(0) } }));

    var childrenScrollbar = Scrollbar.getInstance($childScrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS));
    var parentScrollbar = Scrollbar.getInstance($scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS).not(childrenScrollbar.$element()));

    assert.equal(parentScrollbar.option("visible"), false, "parent scrollbar is hidden");
    assert.equal(childrenScrollbar.option("visible"), true, "children scrollbar is visible");

    $childScrollable.triggerHandler($.Event("mouseleave", { relatedTarget: $parentContainer.get(0) }));

    assert.equal(parentScrollbar.option("visible"), true, "parent scrollbar is visible");
    assert.equal(childrenScrollbar.option("visible"), false, "children scrollbar is hidden");
});

QUnit.test("scrollbar is visible for parent scrollable after start", function(assert) {
    var $scrollable = $("#scrollable").height(25);
    var $childScrollable = $("<div>").height(50);

    $childScrollable.append("<div>").children().height(75);
    $childScrollable.appendTo($scrollable).dxScrollable({
        useNative: false,
        showScrollbar: "onHover",
        direction: "vertical"
    });
    $scrollable.dxScrollable({
        useNative: false,
        showScrollbar: "onHover",
        direction: "vertical"
    });

    var $parentContainer = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS).eq(0);
    var $childrenContainer = $childScrollable.find("." + SCROLLABLE_CONTAINER_CLASS);

    $parentContainer.trigger($.Event("mouseenter", { originalEvent: { target: $parentContainer.get(0) } }));
    $childrenContainer.trigger($.Event("mouseenter", { originalEvent: { target: $childrenContainer.get(0) } }));
    pointerMock($childrenContainer).start().down().move(0, 10);
    $childrenContainer.trigger($.Event("mouseleave", { originalEvent: { target: $childrenContainer.get(0) } }));

    var childrenScrollbar = Scrollbar.getInstance($childScrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS));
    var parentScrollbar = Scrollbar.getInstance($scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS).not(childrenScrollbar.$element()));

    assert.equal(parentScrollbar.option("visible"), false, "parent scrollbar is hidden");
    assert.equal(childrenScrollbar.option("visible"), true, "children scrollbar is visible");
});

QUnit.test("scrollbar set active state only for one scrollable when direction of parentScrollable is horizontal and direction of innerScrollable is vertical", function(assert) {
    var $scrollable = $("#scrollable").height(25);
    var $childScrollable = $("<div>").height(50).appendTo($scrollable);
    $childScrollable.append("<div>").children().height(75);
    $childScrollable.dxScrollable({
        useNative: false,
        showScrollbar: "onHover",
        direction: "vertical"
    });
    $scrollable.dxScrollable({
        useNative: false,
        showScrollbar: "onHover",
        direction: "horizontal"
    });

    var $childScrollbar = $childScrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS);
    var $scrollbar = $scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS).not($childScrollbar);

    pointerMock($childScrollable).start()
        .down()
        .up();

    assert.equal($childScrollbar.hasClass(SCROLLABLE_SCROLLBAR_ACTIVE_CLASS), false, "child scrollbar has not active state");
    assert.equal($scrollbar.hasClass(SCROLLABLE_SCROLLBAR_ACTIVE_CLASS), false, "scrollbar has not active state");
});


QUnit.module("useNative", moduleConfig);

QUnit.test("scrollable render", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true
    });

    assert.ok($scrollable.hasClass(SCROLLABLE_NATIVE_CLASS), "dx-scrollable-native class attached");
});

QUnit.test("simulated scroll does not work when using native", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true
    });

    var mouse = pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS)).start(),
        distance = -10,
        startLocation = getScrollOffset($scrollable);

    mouse
        .down()
        .move(0, distance)
        .up();

    var location = getScrollOffset($scrollable);
    assert.equal(location.top, startLocation.top, "scroll does not move");
});

QUnit.test("scroll action fired for simulated scroller during native scroll", function(assert) {
    var done = assert.async();

    var $scrollable = $("#scrollable").dxScrollable({
        inertiaEnabled: false,
        useNative: false,
        onScroll: function(args) {
            assert.equal(args.scrollOffset.top, 10, "scroll action fired with right offset");
            done();
        },
    });

    $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS).scrollTop(10);
});

QUnit.test("scroll action fired when scrollable scrolling", function(assert) {
    assert.expect(2);

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true,
        onScroll: function() {
            assert.ok(true, "scroll fired");
        }
    });

    var $container = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);

    var pointer = pointerMock($container).start().wheel(10);

    $container.scrollTop(10);
    pointer.wheel(10);
});

QUnit.test("scroll action does not fired when scroll location does not changed", function(assert) {
    assert.expect(1);

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true,
        onScroll: function() {
            assert.ok(true, "scroll fired");
        }
    });

    var $container = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);

    pointerMock($container)
        .start()
        .wheel(0)
        .wheel(0);
});

QUnit.test("scrollBy", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true
    });
    var instance = $scrollable.dxScrollable("instance");

    instance.scrollBy(10);
    assert.equal(instance.scrollTop(), 10, "container has correctly position");

    instance.scrollBy(20);
    assert.equal(instance.scrollTop(), 30, "container has correctly position");
});

QUnit.test("scrollTo", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true
    });
    var instance = $scrollable.dxScrollable("instance");

    $scrollable.dxScrollable("scrollTo", 10);
    assert.equal(instance.scrollTop(), 10, "container has correctly position");

    $scrollable.dxScrollable("scrollTo", 20);
    assert.equal(instance.scrollTop(), 20, "container has correctly position");
});

QUnit.test("useSimulatedScrollbar = false do not create scrollbars when useNative true", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true,
        useSimulatedScrollbar: false
    });

    assert.equal($scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS).length, 0);
});

QUnit.test("useSimulatedScrollbar = true create scrollbars when useNative true", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true,
        useSimulatedScrollbar: true
    });

    assert.equal($scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS).length, 1);
});

QUnit.test("useSimulatedScrollbar = false remove old scrollbars when useNative true", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true,
        useSimulatedScrollbar: true
    });

    $scrollable.dxScrollable("option", "useSimulatedScrollbar", false);

    assert.equal($scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS).length, 0);
});

QUnit.test("simulatedScrollbar direction", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true,
        useSimulatedScrollbar: true
    });

    assert.equal($scrollable.find("." + SCROLLBAR_VERTICAL_CLASS).length, 1, "vertical scrollbar was been added");
    assert.equal($scrollable.find("." + SCROLLBAR_HORIZONTAL_CLASS).length, 0, "horizontal scrollbar was not been added");

    $scrollable.dxScrollable("option", "direction", "horizontal");

    assert.equal($scrollable.find("." + SCROLLBAR_VERTICAL_CLASS).length, 0, "vertical scrollbar was not been added");
    assert.equal($scrollable.find("." + SCROLLBAR_HORIZONTAL_CLASS).length, 1, "horizontal scrollbar was been added");

    $scrollable.dxScrollable("option", "direction", "both");

    assert.equal($scrollable.find("." + SCROLLBAR_VERTICAL_CLASS).length, 1, "vertical scrollbar was been added");
    assert.equal($scrollable.find("." + SCROLLBAR_HORIZONTAL_CLASS).length, 1, "horizontal scrollbar was been added");
});

QUnit.test("simulatedScrollbar visibility", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true,
        useSimulatedScrollbar: true
    });

    var $scrollbar = $scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS),
        scrollbar = Scrollbar.getInstance($scrollbar);
    var $container = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);

    assert.equal(scrollbar.option("visible"), false, "on start thumb is hidden");

    pointerMock($container)
        .start()
        .wheel(10);

    assert.equal(scrollbar.option("visible"), true, "after move thumb is visible");
});

QUnit.test("scrollbar height calculated correctly when simulatedScrollbar is true", function(assert) {
    var containerHeight = 50,
        contentHeight = 100,
        scrollHeight = (containerHeight / contentHeight) * containerHeight;

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true,
        useSimulatedScrollbar: true
    });

    var $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS),
        $scroll = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS);

    $container.height(containerHeight);
    $content.height(contentHeight);

    $scrollable.dxScrollable("instance").update();

    assert.equal($scroll.height(), scrollHeight, "scrollbar height calculated correctly");
});

QUnit.test("moving scrollable moves scrollbar", function(assert) {
    var containerHeight = 50,
        contentHeight = 100,
        distance = 10,
        scrollbarDistance = distance * (containerHeight / contentHeight);

    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true,
        useSimulatedScrollbar: true
    });

    var $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS),
        $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        $scroll = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS);

    $container.height(containerHeight);
    $content.height(contentHeight);
    $scrollable.dxScrollable("instance").update();

    $scrollable.dxScrollable("scrollTo", 2 * distance);
    $container.trigger("scroll");

    var location = translator.locate($scroll);
    assert.equal(location.top, 2 * scrollbarDistance, "scrollbar follows pointer everytime");
});

QUnit.test("scrollbar appears for simulated scrolling even when useSimulatedScrollbar is false", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        useSimulatedScrollbar: false,
        inertiaEnabled: false
    });

    var scrollbar = Scrollbar.getInstance($scrollable.find("." + SCROLLBAR_VERTICAL_CLASS));

    assert.equal(scrollbar.option("visible"), false, "scrollbar is hidden before scrolling");

    pointerMock($scrollable.find("." + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1);

    assert.equal(scrollbar.option("visible"), true, "scrollbar is shown during scrolling");
});

QUnit.test("scrollOffset", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true
    });
    var instance = $scrollable.dxScrollable("instance");

    instance.scrollTo(10);

    assert.deepEqual(instance.scrollOffset(), { top: 10, left: 0 }, "scrollOffset is correct");
});

QUnit.test("scrollHeight", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true
    });
    var $content = $("." + SCROLLABLE_CONTENT_CLASS, $scrollable);
    $content.css("padding", "10px");

    assert.equal($scrollable.dxScrollable("scrollHeight"), $content.outerHeight() - 2 * $scrollable.dxScrollable("option", "pushBackValue"), "scroll height equals to content height");
});

QUnit.test("clientHeight", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true
    });
    var $container = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);

    assert.equal($scrollable.dxScrollable("clientHeight"), $container.height(), "client height equals to container height");
});

QUnit.test("scrollWidth", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true
    });
    var $content = $("." + SCROLLABLE_CONTENT_CLASS, $scrollable);

    assert.equal($scrollable.dxScrollable("scrollWidth"), $content.width(), "scroll width equals to content width");
});

QUnit.test("clientWidth", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true
    });
    var $container = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);

    assert.equal($scrollable.dxScrollable("clientWidth"), $container.width(), "client width equals to container width");
});

QUnit.test("scroll reachedTop true only at the top", function(assert) {
    var currentScrollTopState = true;
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true,
        onScroll: function(e) {
            assert.equal(e.reachedLeft, undefined, "reached left is not defined");
            assert.equal(e.reachedRight, undefined, "reached right is not defined");
            assert.equal(e.reachedTop, currentScrollTopState, "reached top is correct");
        }
    });

    var $container = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);
    $container.trigger("scroll");

    currentScrollTopState = false;
    $scrollable.dxScrollable("scrollTo", 1);
    $container.trigger("scroll");

    currentScrollTopState = true;
    $scrollable.dxScrollable("scrollTo", 0);
    $container.trigger("scroll");
}),

QUnit.test("scroll reachedBottom true only at the bottom", function(assert) {
    var currentScrollBottomState = false;
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true,
        onScroll: function(e) {
            assert.equal(e.reachedLeft, undefined, "reached left is not defined");
            assert.equal(e.reachedRight, undefined, "reached right is not defined");
            assert.equal(e.reachedBottom, currentScrollBottomState, "reached bottom is correct");
        }
    });
    var $container = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);
    var $content = $("." + SCROLLABLE_CONTENT_CLASS, $scrollable);
    var containerSize = $container.prop("clientHeight");
    var contentSize = $content.outerHeight();

    $container.trigger("scroll");

    currentScrollBottomState = true;
    $scrollable.dxScrollable("scrollTo", contentSize - containerSize);
    $container.trigger("scroll");

    currentScrollBottomState = false;
    $scrollable.dxScrollable("scrollTo", contentSize - containerSize - 1);
    $container.trigger("scroll");
});

QUnit.test("scroll reachedLeft true only at the left border", function(assert) {
    var currentScrollLeftState = true;

    var $scrollable = $("#scrollable").width(100);
    $scrollable.children().width(200);

    $scrollable.dxScrollable({
        useNative: true,
        direction: "horizontal",
        onScroll: function(e) {
            assert.equal(e.reachedLeft, currentScrollLeftState, "reached left is correct");
            assert.equal(e.reachedTop, undefined, "reached top is not defined");
            assert.equal(e.reachedBottom, undefined, "reached bottom is not defined");
        }
    });

    var $container = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);

    $container.trigger("scroll");

    currentScrollLeftState = false;
    $scrollable.dxScrollable("scrollTo", 1);
    $container.trigger("scroll");

    currentScrollLeftState = true;
    $scrollable.dxScrollable("scrollTo", 0);
    $container.trigger("scroll");
});

QUnit.test("scroll reachedRight true only at the right border", function(assert) {
    var currentScrollLeftState = false;

    var $scrollable = $("#scrollable").width(100);
    $scrollable.children().width(200);

    $scrollable.dxScrollable({
        useNative: true,
        direction: "horizontal",
        onScroll: function(e) {
            assert.equal(e.reachedRight, currentScrollLeftState, "reached right is correct");
            assert.equal(e.reachedTop, undefined, "reached top is not defined");
            assert.equal(e.reachedBottom, undefined, "reached bottom is not defined");
        }
    });

    var $container = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);
    var $content = $("." + SCROLLABLE_CONTENT_CLASS, $scrollable);
    var containerSize = $container.prop("clientWidth");
    var contentSize = $content.outerWidth();

    $container.trigger("scroll");

    currentScrollLeftState = true;

    $scrollable.dxScrollable("scrollTo", contentSize - containerSize);
    $container.trigger("scroll");

    currentScrollLeftState = false;
    $scrollable.dxScrollable("scrollTo", contentSize - containerSize - 1);
    $container.trigger("scroll");
});

QUnit.test("scroll args are correct", function(assert) {
    var top = true,
        left = true,
        right = false,
        bottom = false;
    var lastScrollEventArgs;
    var $scrollable = $("#scrollable").width(100);
    $scrollable.children().width(200);

    $scrollable.dxScrollable({
        useNative: true,
        direction: "both",
        onScroll: function(e) {
            lastScrollEventArgs = e;
        }
    });

    var checkLastScrollEvent = function() {
        assert.equal(lastScrollEventArgs.reachedTop, top, "reached top is correct");
        assert.equal(lastScrollEventArgs.reachedRight, right, "reached right is correct");
        assert.equal(lastScrollEventArgs.reachedBottom, bottom, "reached bottom is correct");
        assert.equal(lastScrollEventArgs.reachedLeft, left, "reached left is correct");
    };

    var $container = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable),
        containerWidth = $container.prop("clientWidth"),
        contentWidth = $container.prop("scrollWidth"),
        containerHeight = $container.prop("clientHeight"),
        contentHeight = $container.prop("scrollHeight");

    assert.ok(!lastScrollEventArgs, "scroll was not triggered on start");

    $container.trigger("scroll");
    checkLastScrollEvent();

    top = false;
    $scrollable.dxScrollable("scrollTo", { left: 0, top: 1 });
    $container.trigger("scroll");
    checkLastScrollEvent();

    left = false;
    $scrollable.dxScrollable("scrollTo", { left: 1, top: 1 });
    $container.trigger("scroll");
    checkLastScrollEvent();

    bottom = true;
    $scrollable.dxScrollable("scrollTo", {
        left: 1,
        top: contentHeight - containerHeight
    });
    $container.trigger("scroll");
    checkLastScrollEvent();

    right = true;
    $scrollable.dxScrollable("scrollTo", {
        left: contentWidth - containerWidth,
        top: contentHeight - containerHeight
    });
    $container.trigger("scroll");
    checkLastScrollEvent();
});

QUnit.test("scroll arguments", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: true,
        onScroll: function(e) {
            assert.equal(e.reachedLeft, undefined, "reached left is not defined");
            assert.equal(e.reachedRight, undefined, "reached right is not defined");
            assert.equal(e.reachedTop, true, "reached top is true");
            assert.equal(e.reachedBottom, false, "reached bottom is false");
        }
    });

    var $container = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);
    $container.trigger("scroll");
});

var testDefaultValue = function(realDevice, currentDevice, realVersion) {
    devices.real({
        platform: realDevice,
        version: realVersion
    });
    devices.current({ platform: currentDevice });
    $("#scrollable").dxScrollable({});

    return $("#scrollable").dxScrollable("option", "useNative");
};

QUnit.module("default value nativeScrollable", {
    beforeEach: function() {
        moduleConfig.beforeEach.call(this);
        this.originalRealDevice = devices.real();
        this.originalCurrentDevice = devices.current();

        this.originalSupportNativeScrolling = support.nativeScrolling;
        support.nativeScrolling = true;
    },
    afterEach: function() {
        moduleConfig.afterEach.call(this);
        devices.real(this.originalRealDevice);
        devices.current(this.originalCurrentDevice);

        support.nativeScrolling = this.originalSupportNativeScrolling;
    }
});

var nativeScrollable = [
    { real: "ios", current: "ios" },
    { real: "ios", current: "generic" },
    { real: "ios", current: "desktop" },
    { real: "android", current: "android", version: [4] },
    { real: "android", current: "generic", version: [4] },
    { real: "win", current: "win" },
    { real: "win", current: "generic" },
    { real: "ios", current: "android" },
    { real: "ios", current: "win" },
    { real: "android", current: "ios", version: [4] },
    { real: "android", current: "win", version: [4] },
    { real: "win", current: "android" },
    { real: "win", current: "ios" }
];

$.each(nativeScrollable, function() {
    var devices = this;
    QUnit.test("real: " + devices.real + "; current: " + devices.current, function(assert) {
        assert.ok(testDefaultValue(devices.real, devices.current, devices.version));
    });
});

QUnit.module("default value simulatedScrollable", {
    beforeEach: function() {
        moduleConfig.beforeEach.call(this);
        this.originalRealDevice = devices.real();
        this.originalCurrentDevice = devices.current();

        this.originalSupportNativeScrolling = support.nativeScrolling;
        support.nativeScrolling = false;
    },
    afterEach: function() {
        moduleConfig.afterEach.call(this);
        devices.real(this.originalRealDevice);
        devices.current(this.originalCurrentDevice);

        support.nativeScrolling = this.originalSupportNativeScrolling;
    }
});

var simulatedScrollable = [
    { real: "android", current: "android", version: [3] },
    { real: "android", current: "android", version: [2] },
    { real: "generic", current: "ios" },
    { real: "generic", current: "android" },
    { real: "generic", current: "win" },
    { real: "generic", current: "generic" },
    { real: "generic", current: "desktop" }
];

$.each(simulatedScrollable, function() {
    var devices = this;
    QUnit.test("real: " + devices.real + "; current: " + devices.current, function(assert) {
        assert.ok(!testDefaultValue(devices.real, devices.current, devices.version));
    });
});

QUnit.test("useNative false in simulator", function(assert) {
    var windowSelf,
        forceDevice;

    try {
        windowSelf = window.self;
        forceDevice = window.top["dx-force-device"];

        window.self = {};
        window.top["dx-force-device"] = "iPhone";
        assert.ok(!testDefaultValue("generic", "generic"));
    } finally {
        window.self = windowSelf;
        if(forceDevice) {
            window.top["dx-force-device"] = forceDevice;
        } else {
            try { delete window.top["dx-force-device"]; } catch(e) { }
        }
    }
});


QUnit.module("active element blurring", {
    beforeEach: function() {
        moduleConfig.beforeEach.call(this);
        this.originalRealDevice = devices.real();
        this.originalCurrentDevice = devices.current();

        this.originalResetActiveElement = domUtils.resetActiveElement;
        this.resetCount = 0;
        domUtils.resetActiveElement = $.proxy(function() {
            this.resetCount++;
        }, this);
    },
    afterEach: function() {
        moduleConfig.afterEach.call(this);
        devices.real(this.originalRealDevice);
        devices.current(this.originalCurrentDevice);

        domUtils.resetActiveElement = this.originalResetActiveElement;
    }
});

var testBlurInNativeScrolling = function(platform, shouldBeBlurred) {
    QUnit.testInActiveWindow(platform + ": active element should" + (shouldBeBlurred ? "" : " not") + " be blurred (B250228)", function(assert) {
        if(!/webkit/i.exec(navigator.userAgent)) {
            assert.ok(true, "this test run only in webkit");
            return;
        }

        var $innerInput;

        try {
            devices.real({ platform: platform });

            var $element = $("#scrollable");
            $innerInput = $("<input>").appendTo($element);

            $element.dxScrollable();
            var elementPointer = pointerMock($element.find("." + SCROLLABLE_CONTAINER_CLASS));

            $innerInput.focus();
            elementPointer.start().down().move(0, 10);
            if(shouldBeBlurred) {
                assert.equal(this.resetCount, 1, "inner input was blurred");
            } else {
                assert.equal(this.resetCount, 0, "inner input was not blurred");
            }
            elementPointer.up();
        } finally {
            $innerInput.remove();
        }
    });
};

testBlurInNativeScrolling("ios", true);
testBlurInNativeScrolling("android");
testBlurInNativeScrolling("win");
testBlurInNativeScrolling("desktop");

QUnit.testInActiveWindow("scrollable should not reset active element outside (B250228)", function(assert) {
    if(!/webkit/i.exec(navigator.userAgent)) {
        assert.ok(true, "this test run only in webkit");
        return;
    }

    var $outerInput;

    try {
        var $element = $("#scrollable"),
            elementPointer = pointerMock($element);

        $outerInput = $("<input>").appendTo("#qunit-fixture");

        $element.dxScrollable();

        $outerInput.focus();
        elementPointer.start().down().move(0, 10);
        assert.equal(this.resetCount, 0, "outer input was not blurred");
        elementPointer.up();
    } finally {
        $outerInput.remove();
    }
});


QUnit.module("keyboard support");

QUnit.test("support arrow keys", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "mobile device does not support tabindex on div element");
        return;
    }

    var $scrollable = $("#scrollable");
    $scrollable.width(100);
    $scrollable.children().width(200);

    $scrollable.dxScrollable({
        useNative: false,
        direction: "both"
    });

    var scrollable = $scrollable.dxScrollable("instance"),
        $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        keyboard = keyboardMock($container);

    $container.focus();

    keyboard.keyDown("down");
    assert.equal(scrollable.scrollOffset().top, SCROLL_LINE_HEIGHT, "down key moves to one line down");

    keyboard.keyDown("up");
    assert.equal(scrollable.scrollOffset().top, 0, "up key moves to one line up");

    keyboard.keyDown("right");
    assert.equal(scrollable.scrollOffset().left, SCROLL_LINE_HEIGHT, "right key moves to one column right");

    keyboard.keyDown("left");
    assert.equal(scrollable.scrollOffset().left, 0, "left key moves to one column down");
});

QUnit.test("support pageup and pagedown", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "mobile device does not support tabindex on div element");
        return;
    }

    var $scrollable = $("#scrollable"),
        containerHeight = 100;

    $scrollable.height(containerHeight);
    $scrollable.children().height(1000);

    $scrollable.dxScrollable({
        useNative: false
    });

    var scrollable = $scrollable.dxScrollable("instance"),
        $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        keyboard = keyboardMock($container);

    $container.focus();

    keyboard.keyDown("pagedown");
    keyboard.keyDown("pagedown");
    assert.equal(scrollable.scrollOffset().top, 2 * containerHeight, "page down key moves to one page down");

    keyboard.keyDown("pageup");
    assert.equal(scrollable.scrollOffset().top, containerHeight, "page up key moves to one page up");
});

QUnit.test("support end and home", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "mobile device does not support tabindex on div element");
        return;
    }

    var $scrollable = $("#scrollable"),
        containerHeight = 100,
        contentHeight = 1000;

    $scrollable.height(containerHeight).wrapInner("<div>").children().height(contentHeight);

    $scrollable.dxScrollable({
        useNative: false
    });

    var scrollable = $scrollable.dxScrollable("instance");
    var $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS);
    var keyboard = keyboardMock($container);

    $container.focus();

    keyboard.keyDown("end");
    assert.equal(scrollable.scrollOffset().top, contentHeight - containerHeight, "end key moves to the bottom");

    keyboard.keyDown("home");
    assert.equal(scrollable.scrollOffset().top, 0, "home key moves to the top");
});

QUnit.test("supportKeyboard option", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "mobile device does not support tabindex on div element");
        return;
    }

    var $scrollable = $("#scrollable");
    $scrollable.width(100);
    $scrollable.children().width(200);

    $scrollable.dxScrollable({
        useNative: false,
        direction: "both",
        useKeyboard: false
    });

    var $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS);

    assert.equal($container.attr("tabindex"), null, "scrollable has not tabindex after focus");

});

QUnit.test("supportKeyboard option after render", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "mobile device does not support tabindex on div element");
        return;
    }

    var $scrollable = $("#scrollable");
    $scrollable.width(100);
    $scrollable.children().width(200);

    $scrollable.dxScrollable({
        useNative: false,
        direction: "both",
        useKeyboard: true
    });

    var scrollable = $scrollable.dxScrollable("instance"),
        $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        keyboard = keyboardMock($container);

    $container.focus();

    scrollable.option("useKeyboard", false);
    keyboard.keyDown("down");
    assert.equal(scrollable.scrollOffset().top, 0, "down key does not move to one line down after option change");

    scrollable.option("useKeyboard", true);
    keyboard.keyDown("down");
    assert.equal(scrollable.scrollOffset().top, SCROLL_LINE_HEIGHT, "right key moves to one column down after option change");
});

QUnit.test("arrow keys does not trigger when it not need", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "mobile device does not support tabindex on div element");
        return;
    }

    var $scrollable = $("#scrollable");
    $scrollable.height(100);
    $scrollable.wrapInner("<div>");
    $scrollable.children().height(50);

    $scrollable.dxScrollable({
        useNative: false,
        useKeyboard: true,
        bounceEnabled: false
    });

    var count = 0;

    $scrollable.on("scroll", function(assert) {
        count++;
    });
    var $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS);
    keyboardMock($container).keyDown("down");

    $container.focus();

    assert.equal(count, 0, "down key moves to one line down");
});

QUnit.test("arrows work correctly after scroll by scrollbar", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "mobile device does not support tabindex on div element");
        return;
    }

    var $scrollable = $("#scrollable");
    $scrollable.height(100);
    $scrollable.children().height(200);

    $scrollable.dxScrollable({
        useNative: false,
        useKeyboard: true,
        bounceEnabled: false,
        scrollByThumb: true,
        useSimulatedScrollbar: true
    });

    var scrollable = $scrollable.dxScrollable("instance");
    var $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS);
    var keyboard = keyboardMock($container);
    var $scrollbar = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS);
    var pointer = pointerMock($scrollbar).start();

    $container.focus();

    pointer
        .down()
        .move(0, 10)
        .up();

    var scrollLocation = scrollable.scrollOffset().top;

    keyboard.keyDown("down");
    assert.equal(scrollable.scrollOffset().top, SCROLL_LINE_HEIGHT + scrollLocation);
});

QUnit.testInActiveWindow("arrows was not handled when focus on input element", function(assert) {
    var $scrollable = $("#scrollable");
    var $input = $("<input type='text' />").appendTo($scrollable);

    $scrollable.dxScrollable({
        useNative: false,
        useKeyboard: true
    });

    $input.focus();

    try {
        $(document).on("keydown.test", function(e) {
            assert.equal(e.isDefaultPrevented(), false, "event was not prevented");
        });

        var keyboard = keyboardMock($input);
        keyboard.keyDown("down");
    } finally {
        $(document).off("keydown.test");
    }
});


QUnit.module("visibility events integration");

QUnit.test("scroll should save position on dxhiding and restore on dxshown", function(assert) {
    var $scrollable = $("#scrollable");

    var scrollable = $scrollable.dxScrollable({
        useNative: false,
        direction: "both"
    }).dxScrollable("instance");

    scrollable.scrollTo({ left: 10, top: 20 });

    domUtils.triggerHidingEvent($scrollable);

    $scrollable.hide();

    scrollable.scrollTo({ left: 0, top: 0 });

    $scrollable.show();
    domUtils.triggerShownEvent($scrollable);

    assert.deepEqual(scrollable.scrollOffset(), { left: 10, top: 20 }, "scroll position restored after dxshown");
});

QUnit.test("scroll should restore on second dxshown", function(assert) {
    var $scrollable = $("#scrollable");

    var scrollable = $scrollable.dxScrollable({
        useNative: false,
        direction: "both"
    }).dxScrollable("instance");

    scrollable.scrollTo({ left: 10, top: 20 });

    domUtils.triggerHidingEvent($scrollable);
    domUtils.triggerShownEvent($scrollable);

    scrollable.scrollTo({ left: 0, top: 0 });
    domUtils.triggerShownEvent($scrollable);

    assert.deepEqual(scrollable.scrollOffset(), { left: 0, top: 0 }, "scroll position was not changed");
});

QUnit.test("scroll should save position on dxhiding when scroll is hidden", function(assert) {
    var $scrollable = $("#scrollable");

    var scrollable = $scrollable.dxScrollable({
        useNative: false,
    }).dxScrollable("instance");

    scrollable.scrollTo({ left: 0, top: 20 });
    domUtils.triggerHidingEvent($scrollable);
    $scrollable.hide();

    scrollable.scrollTo({ left: 0, top: 0 });

    $scrollable.show();
    domUtils.triggerShownEvent($scrollable);

    assert.deepEqual(scrollable.scrollOffset(), { left: 0, top: 20 }, "scroll position restored after dxshown");
});


if(styleUtils.styleProp("touchAction")) {
    QUnit.module("nested scrolling in IE/Edge");

    QUnit.test("touch-action none should be present on not stretched list", function(assert) {
        var $content = $("<div>").width(100).height(100);
        var $scrollable = $("<div>").width(50).height(50);

        $scrollable.append($content).appendTo("#qunit-fixture");

        $scrollable = $scrollable.dxScrollable({
            useNative: false,
            direction: "both",
            bounceEnabled: false
        });

        var scrollable = $scrollable.dxScrollable("instance"),
            $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS);

        assert.equal($container.css("touchAction"), "none");

        $content.width(50).height(100);
        scrollable.update();
        assert.equal($container.css("touchAction"), "pan-x");

        $content.width(100).height(50);
        scrollable.update();
        assert.equal($container.css("touchAction"), "pan-y");

        $content.width(50).height(50);
        scrollable.update();
        assert.notEqual($container.css("touchAction"), "none");
    });
}
