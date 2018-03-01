"use strict";

var $ = require("jquery");

require("ui/slider");

QUnit.testStart(function() {
    var markup =
        '<div id="slider"></div>\
        <div id="widget"></div>\
        <div id="widthRootStyle" style="width: 300px;"></div>';

    $("#qunit-fixture").html(markup);
});

require("common.css!");

var SLIDER_CLASS = "dx-slider",
    SLIDER_HANDLE_CLASS = "dx-slider-handle";

QUnit.module("Slider markup");

QUnit.test("default", function(assert) {
    var $sliderElement = $("#slider").dxSlider({
        useInkRipple: false
    });

    assert.ok($sliderElement.hasClass(SLIDER_CLASS), "slider has correct class");

    var $handle = $sliderElement.find("." + SLIDER_HANDLE_CLASS);

    assert.ok($handle.length, "handle is rendered");
});

QUnit.test("root with custom width", function(assert) {
    var $sliderElement = $("#widthRootStyle").dxSlider({
            useInkRipple: false
        }),
        instance = $sliderElement.dxSlider("instance");

    assert.strictEqual(instance.option("width"), undefined);
    assert.strictEqual($sliderElement[0].style.width, "300px", "outer width of the element must be equal to custom width");
});

QUnit.test("slider with a custom dimensions", function(assert) {
    var setUpWidth = 11,
        setUpHeight = 22,
        $sliderElement = $("#slider").dxSlider({
            max: 100,
            min: 0,
            width: setUpWidth,
            height: setUpHeight,
            useInkRipple: false
        }),
        initialWidth = $sliderElement[0].style.width,
        initialHeight = $sliderElement[0].style.height;

    assert.equal(initialWidth, setUpWidth + "px", "Element's width was set properly on init");
    assert.equal(initialHeight, setUpHeight + "px", "Element's height was et properly on init");
});

QUnit.module("aria accessibility");

QUnit.test("aria role", function(assert) {
    var $element = $("#widget").dxSlider({
            useInkRipple: false
        }),
        $handle = $element.find(".dx-slider-handle");

    assert.equal($handle.attr("role"), "slider", "aria role is correct");
});

QUnit.test("aria properties", function(assert) {
    var $element = $("#widget").dxSlider({
            min: 20,
            max: 50,
            value: 35,
            useInkRipple: false
        }),
        $handle = $element.find(".dx-slider-handle");

    assert.equal($handle.attr("aria-valuemin"), 20, "aria min is correct");
    assert.equal($handle.attr("aria-valuemax"), 50, "aria max is correct");
    assert.equal($handle.attr("aria-valuenow"), 35, "aria now is correct");
});

QUnit.test("change aria properties on option changing", function(assert) {
    var $element = $("#widget").dxSlider({
            min: 20,
            max: 50,
            value: 35,
            useInkRipple: false
        }),
        instance = $element.dxSlider("instance"),
        $handle = $element.find(".dx-slider-handle");

    instance.option({
        min: 25,
        max: 70,
        value: 40
    });

    assert.equal($handle.attr("aria-valuemin"), 25, "aria min is correct");
    assert.equal($handle.attr("aria-valuemax"), 70, "aria max is correct");
    assert.equal($handle.attr("aria-valuenow"), 40, "aria now is correct");
});
