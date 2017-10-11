"use strict";

var $ = require("jquery"),
    support = require("core/utils/support");

require("common.css!");
require("ui/load_indicator");

QUnit.testStart(function() {
    var markup =
        '<div id="loadIndicator"></div>';

    $("#qunit-fixture").html(markup);
});

var LOADINDICATOR_CLASS = "dx-loadindicator",
    LOADINDICATOR_WRAPPER = LOADINDICATOR_CLASS + "-wrapper",
    LOADINDICATOR_ICON = LOADINDICATOR_CLASS + "-icon",
    LOADINDICATOR_CONTENT_CLASS = "dx-loadindicator-content",
    LOADINDICATOR_SEGMENT = LOADINDICATOR_CLASS + "-segment",
    LOADINDICATOR_SEGMENTN = LOADINDICATOR_CLASS + "-segment",
    LOADINDICATOR_IMAGE = "dx-loadindicator-image";

var isIdenticalNamesInUrl = function(firstUrl, secondUrl) {
    var firstName = firstUrl.split("/");
    firstName = firstName[firstName.length - 1].replace(")", "").replace("\"", "");
    var secondName = secondUrl.split("/");
    secondName = secondName[secondName.length - 1];
    return firstName === secondName;
};

QUnit.module("indicator with browser animation", {
    beforeEach: function() {
        // Override support styleProp
        this._defaultAnimation = support.animation;
        support.animation = true;
    },
    afterEach: function() {
        // Restoring support styleProp
        support.animation = this._defaultAnimation;
    }
});

QUnit.test("rendered markup", function(assert) {
    var $indicator = $("#loadIndicator"),
        loadIndicator = $indicator.dxLoadIndicator({ visible: false, viaImage: false }).dxLoadIndicator("instance");

    assert.ok($indicator.hasClass(LOADINDICATOR_CLASS), "Load Indicator initialized");
    assert.equal($indicator.find("." + LOADINDICATOR_ICON).length, 1, "Icon div created");
    assert.equal($indicator.find("." + LOADINDICATOR_SEGMENT).length, loadIndicator.option("_animatingSegmentCount") + 1, "Segments created");
    assert.equal($indicator.find("." + LOADINDICATOR_SEGMENTN + "1").length, 1, "Numerated segment created");
    assert.equal($indicator.find("." + LOADINDICATOR_CONTENT_CLASS).length, 1, "content is created");
});

QUnit.test("shows on init if loading option is true", function(assert) {
    var $element = $("#loadIndicator").dxLoadIndicator({ visible: true, viaImage: false });
    assert.ok($element.is(":visible"));
});

QUnit.test("visible changes visibility option", function(assert) {
    var $indicator = $("#loadIndicator").dxLoadIndicator({
        visible: false
    });

    var loadIndicator = $indicator.dxLoadIndicator("instance");

    assert.ok($indicator.is(":hidden"));

    loadIndicator.option("visible", false);
    assert.ok($indicator.is(":hidden"));

    loadIndicator.option("visible", true);
    assert.ok($indicator.is(":visible"));

    loadIndicator.option("visible", false);
    assert.ok($indicator.is(":hidden"));
});

QUnit.module("indicator with image", {
    beforeEach: function() {
        // Override support styleProp
        this._defaultAnimation = support.animation;
        support.animation = false;
    },
    afterEach: function() {
        // Restoring support styleProp
        support.animation = this._defaultAnimation;
    }
});

QUnit.test("rendered markup", function(assert) {
    var $indicator = $("#loadIndicator").dxLoadIndicator({ visible: false, viaImage: false }),
        $indicatorWrapper = $indicator.find("." + LOADINDICATOR_WRAPPER);

    assert.ok($indicator.hasClass(LOADINDICATOR_CLASS), "Load Indicator initialized");

    assert.ok($indicatorWrapper, "Wrapper class added");

    assert.ok($indicatorWrapper.hasClass(LOADINDICATOR_IMAGE), "Image class added");

    assert.equal($indicator.find("." + LOADINDICATOR_ICON).length, 0, "Icon div not created");
    assert.equal($indicator.find("." + LOADINDICATOR_SEGMENT).length, 0, "16 Segment not created");
    assert.equal($indicator.find("." + LOADINDICATOR_SEGMENTN + "1").length, 0, "Numerated segment not created");
});


QUnit.module("", {});

QUnit.test("LoadIndicator with custom indicator", function(assert) {
    var url = "../../testing/content/customLoadIndicator.png",
        element = $("#loadIndicator").dxLoadIndicator({
            visible: true,
            indicatorSrc: url
        }),
        $wrapper = element.find("." + LOADINDICATOR_WRAPPER);
    var instance = $("#loadIndicator").dxLoadIndicator().dxLoadIndicator("instance");
    assert.ok(isIdenticalNamesInUrl($wrapper.css("background-image"), url), "custom indicator installed successfully as image");
    instance.option("indicatorSrc", "");
    assert.ok($wrapper.css("background-image") !== "", "custom indicator changed successfully as image");
});
