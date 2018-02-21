"use strict";

var $ = require("jquery"),
    animationFrame = require("animation/frame");

require("common.css!");
require("ui/scroll_view");

var SCROLLABLE_CONTENT_CLASS = "dx-scrollable-content",
    SCROLLABLE_SCROLLBAR_CLASS = "dx-scrollable-scrollbar",
    SCROLLVIEW_TOP_POCKET_CLASS = "dx-scrollview-top-pocket",
    SCROLLVIEW_BOTTOM_POCKET_CLASS = "dx-scrollview-bottom-pocket";

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


QUnit.testStart(function() {
    var markup = '\
        <div id="scrollView" style="height: 50px; width: 50px;">\
            <div class="content1" style="height: 100px; width: 100px;"></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("ScrollView", moduleConfig);

QUnit.test("pockets should not be rendered in scrollView on server", function(assert) {
    var $scrollView = $("#scrollView").dxScrollView(),
        $scrollableContent = $scrollView.find("." + SCROLLABLE_CONTENT_CLASS),
        $topPocket = $scrollableContent.find("." + SCROLLVIEW_TOP_POCKET_CLASS),
        $bottomPocket = $scrollableContent.find("." + SCROLLVIEW_BOTTOM_POCKET_CLASS);

    assert.equal($topPocket.length, 0, "scrollView has no top-pocket on server");
    assert.equal($bottomPocket.length, 0, "scrollView has no bottom-pocket on server");
});

QUnit.test("scrollbar should not be rendered in scrollView on server", function(assert) {
    var $scrollView = $("#scrollView").dxScrollView(),
        $scrollbar = $scrollView.find("." + SCROLLABLE_SCROLLBAR_CLASS);

    assert.equal($scrollbar.length, 0, "scrollView has no scrollbar on server");
});

QUnit.test("scrollView should have correct size on init", function(assert) {
    var $scrollView = $("#scrollView").dxScrollView({
        width: 500,
        height: 500
    });

    assert.equal($scrollView.get(0).style.width, "500px");
    assert.equal($scrollView.get(0).style.height, "500px");
});
