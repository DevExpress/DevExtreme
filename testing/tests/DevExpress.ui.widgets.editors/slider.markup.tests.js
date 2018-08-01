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
    SLIDER_HANDLE_CLASS = "dx-slider-handle",
    SLIDER_RANGE_CLASS = SLIDER_CLASS + "-range",
    SLIDER_BAR_CLASS = "dx-slider-bar",
    SLIDER_RANGE_VISIBLE_CLASS = SLIDER_RANGE_CLASS + "-visible",
    SLIDER_LABEL_CLASS = SLIDER_CLASS + "-label";

QUnit.module("slider markup");

QUnit.test("default", function(assert) {
    var $sliderElement = $("#slider").dxSlider({
        useInkRipple: false
    });

    assert.ok($sliderElement.hasClass(SLIDER_CLASS), "slider has correct class");

    var $handle = $sliderElement.find("." + SLIDER_HANDLE_CLASS);

    assert.ok($handle.length, "handle is rendered");

    var $range = $sliderElement.find("." + SLIDER_RANGE_CLASS);

    assert.ok($range.length, "range is rendered");

    var $bar = $sliderElement.find("." + SLIDER_BAR_CLASS);

    assert.ok($bar.length, "bar is rendered");
});

QUnit.test("'showRange' option should toggle class to range element", function(assert) {
    var slider = $("#slider").dxSlider({
        showRange: true,
        useInkRipple: false
    }).dxSlider("instance");

    assert.ok($("." + SLIDER_RANGE_CLASS).hasClass(SLIDER_RANGE_VISIBLE_CLASS));

    slider.option("showRange", false);
    assert.ok(!$("." + SLIDER_RANGE_CLASS).hasClass(SLIDER_RANGE_VISIBLE_CLASS));
});

QUnit.test("labels visibility", function(assert) {
    var $slider = $("#slider").dxSlider({
        min: 0,
        max: 100,
        label: {
            visible: true
        },
        useInkRipple: false
    });

    var $sliderLabels = $slider.find("." + SLIDER_LABEL_CLASS);
    assert.equal($sliderLabels.length, 2, "labels are rendered");
});

QUnit.test("labels visiility - format", function(assert) {
    var $slider = $("#slider").dxSlider({
        label: {
            visible: true,
            format: function(value) {
                return "[" + value + "]";
            }
        },
        useInkRipple: false
    });

    var $sliderLabels = $slider.find("." + SLIDER_LABEL_CLASS);
    assert.equal($sliderLabels.eq(0).html(), "[0]");
    assert.equal($sliderLabels.eq(1).html(), "[100]");

    $slider.dxSlider("option", "label.format", function(value) {
        return "(" + value + ")";
    });
    assert.equal($sliderLabels.eq(0).html(), "(0)");
    assert.equal($sliderLabels.eq(1).html(), "(100)");
});

QUnit.test("labels visiility - position", function(assert) {
    var $slider = $("#slider").dxSlider({
        label: {
            visible: true,
            position: "top"
        },
        useInkRipple: false
    });

    assert.ok($slider.hasClass("dx-slider-label-position-top"));
    assert.ok(!$slider.hasClass("dx-slider-label-position-bottom"));

    $slider.dxSlider("option", "label.position", "bottom");
    assert.ok($slider.hasClass("dx-slider-label-position-bottom"));
    assert.ok(!$slider.hasClass("dx-slider-label-position-top"));

    $slider.dxSlider("option", "label.visible", false);
    assert.ok(!$slider.hasClass("dx-slider-label-position-bottom"));
    assert.ok(!$slider.hasClass("dx-slider-label-position-top"));
});

QUnit.module("widget sizing render");

QUnit.test("constructor", function(assert) {
    var $element = $("#widget").dxSlider({
            width: 400,
            useInkRipple: false
        }),
        instance = $element.dxSlider("instance");

    assert.strictEqual(instance.option("width"), 400);
    assert.strictEqual($element[0].style.width, "400px", "outer width of the element must be equal to custom width");
});

QUnit.test("root with custom width", function(assert) {
    var $element = $("#widthRootStyle").dxSlider({
            useInkRipple: false
        }),
        instance = $element.dxSlider("instance");

    assert.strictEqual(instance.option("width"), undefined);
    assert.strictEqual($element[0].style.width, "300px", "outer width of the element must be equal to custom width");
});

QUnit.test("change width", function(assert) {
    var $element = $("#widget").dxSlider({
            useInkRipple: false
        }),
        instance = $element.dxSlider("instance"),
        customWidth = 400;

    instance.option("width", customWidth);

    assert.strictEqual($element[0].style.width, customWidth + "px", "outer width of the element must be equal to custom width");
});

QUnit.module("hidden input");

QUnit.test("a hidden input should be rendered", function(assert) {
    var $slider = $("#slider").dxSlider(),
        $input = $slider.find("input");

    assert.equal($input.length, 1, "input is rendered");
    assert.equal($input.attr("type"), "hidden", "the input type is 'hidden'");
});

QUnit.test("the hidden input should have correct value on widget init", function(assert) {
    var expectedValue = 30,
        $slider = $("#slider").dxSlider({
            value: expectedValue
        }),
        $input = $slider.find("input");

    assert.equal(parseInt($input.val()), expectedValue, "the hidden input value is correct");
});


QUnit.test("the hidden input should get correct value on widget value change", function(assert) {
    var expectedValue = 77,
        $slider = $("#slider").dxSlider(),
        instance = $slider.dxSlider("instance"),
        $input = $slider.find("input");

    instance.option("value", 11);
    instance.option("value", expectedValue);
    assert.equal(parseInt($input.val()), expectedValue, "the hidden input value is correct");
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
