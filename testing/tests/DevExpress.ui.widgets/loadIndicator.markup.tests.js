"use strict";

var $ = require("jquery");

require("common.css!");
require("ui/load_indicator");

QUnit.testStart(function() {
    var markup =
        '<div id="loadIndicator"></div>';

    $("#qunit-fixture").html(markup);
});

var LOADINDICATOR_CLASS = "dx-loadindicator",
    LOADINDICATOR_WRAPPER = LOADINDICATOR_CLASS + "-wrapper",
    LOADINDICATOR_CONTENT_CLASS = "dx-loadindicator-content";

QUnit.module("LoadIndicator markup");

QUnit.test("Basic markup initialization", function(assert) {
    var $indicator = $("#loadIndicator").dxLoadIndicator(),
        $indicatorWrapper = $indicator.find("." + LOADINDICATOR_WRAPPER),
        $indicatorContent = $indicator.find("." + LOADINDICATOR_CONTENT_CLASS);

    assert.ok($indicator.hasClass(LOADINDICATOR_CLASS), "Load Indicator initialized");
    assert.equal($indicatorWrapper.length, 1, "Wrapper has been added");
    assert.equal($indicatorContent.length, 1, "Content is added");
});

QUnit.test("visibility of the LoadIndicator with initial value of the 'visible' option equal to 'true'", function(assert) {
    var $element = $("#loadIndicator").dxLoadIndicator({ visible: true, viaImage: false });
    assert.ok($element.is(":visible"));
});

