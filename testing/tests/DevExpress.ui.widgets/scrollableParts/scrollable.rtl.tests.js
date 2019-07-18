import $ from "jquery";
import animationFrame from "animation/frame";
import domUtils from "core/utils/dom";
import devices from "core/devices";
import Scrollable from "ui/scroll_view/ui.scrollable";
import { value as viewPort } from "core/utils/view_port";

import "common.css!";

import {
    RTL_CLASS
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

QUnit.test("rtlEnabled scrolls to very right position when a width was changing via API", assert => {
    const $scrollable = $("#scrollable")
        .dxScrollable({
            direction: "horizontal",
            rtlEnabled: true,
            useNative: true
        });

    const scrollable = $scrollable.dxScrollable("instance");
    scrollable.option("width", 50);

    const veryRightPosition = scrollable.$content().width() - $scrollable.width();
    assert.equal(scrollable.scrollLeft(), veryRightPosition, "scrolled to very right position");
});
