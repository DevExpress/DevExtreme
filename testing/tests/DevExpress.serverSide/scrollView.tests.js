"use strict";

var $ = require("jquery");

require("common.css!");
require("ui/scroll_view");

var SCROLLABLE_CONTENT_CLASS = "dx-scrollable-content",
    SCROLLABLE_SCROLLBAR_CLASS = "dx-scrollable-scrollbar",
    SCROLLVIEW_TOP_POCKET_CLASS = "dx-scrollview-top-pocket",
    SCROLLVIEW_BOTTOM_POCKET_CLASS = "dx-scrollview-bottom-pocket",
    SCROLLVIEW_LOADPANEL_CLASS = "dx-scrollview-loadpanel";

QUnit.testStart(function() {
    var markup = '\
        <div id="scrollView" style="height: 50px; width: 50px;">\
            <div class="content1"></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("ScrollView markup");

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

QUnit.test("loadPanel should not be rendered in scrollView on server", function(assert) {
    var $scrollView = $("#scrollView").dxScrollView(),
        $loadPanel = $scrollView.find("." + SCROLLVIEW_LOADPANEL_CLASS);

    assert.equal($loadPanel.length, 0, "scrollView has no loadPanel on server");
});
