import $ from "jquery";
import { noop } from "core/utils/common";
import translator from "animation/translator";
import animationFrame from "animation/frame";
import devices from "core/devices";
import { value as viewPort } from "core/utils/view_port";
import pointerMock from "../../../helpers/pointerMock.js";

import "common.css!";

import {
    SCROLLABLE_CONTAINER_CLASS,
    SCROLLABLE_WRAPPER_CLASS,
    SCROLLABLE_CONTENT_CLASS
} from "./scrollable.constants.js";

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
        <div id="scaledContainer" style="transform:scale(0.2, 0.5)">\
            <div style="height: 500px; width: 500px;">\
                <div id="scaledScrollable">\
                    <div id="scaledContent" style="height: 1000px; width: 1000px;"></div>\
                </div>\
            </div>\
        </div>';

    $("#qunit-fixture").html(markup);
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
