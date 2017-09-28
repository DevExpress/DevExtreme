"use strict";

var $ = require("jquery"),
    Tooltip = require("ui/tooltip"),
    resizeCallbacks = require("core/utils/window").resizeCallbacks,
    domUtils = require("core/utils/dom"),
    positionUtils = require("animation/position"),
    browser = require("core/utils/browser"),
    config = require("core/config"),
    hideTopOverlayCallback = require("mobile/hide_top_overlay").hideCallback,
    keyboardMock = require("../../helpers/keyboardMock.js"),
    pointerMock = require("../../helpers/pointerMock.js"),
    fx = require("animation/fx");

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
    SLIDER_WRAPPER_CLASS = SLIDER_CLASS + "-wrapper",
    SLIDER_RANGE_CLASS = SLIDER_CLASS + "-range",
    SLIDER_RANGE_VISIBLE_CLASS = SLIDER_RANGE_CLASS + "-visible",
    SLIDER_BAR_CLASS = SLIDER_CLASS + "-bar",
    SLIDER_HANDLE_CLASS = SLIDER_CLASS + "-handle",
    SLIDER_LABEL_CLASS = SLIDER_CLASS + "-label",

    ACTIVE_STATE_CLASS = "dx-state-active",
    FEEDBACK_SHOW_TIMEOUT = 30,
    FEEDBACK_HIDE_TIMEOUT = 400,
    SLIDER_HANDLE_WIDTH = 14,

    TOOLTIP_CLASS = "dx-tooltip",
    TOOLTIP_CONTENT_CLASS = "dx-overlay-content";


var moduleOptions = {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
};

QUnit.module("render", moduleOptions);

QUnit.test("default", function(assert) {
    var $sliderElement = $("#slider").dxSlider({
        useInkRipple: false
    });

    assert.ok($sliderElement.hasClass(SLIDER_CLASS));
});

QUnit.test("Resize by option", function(assert) {
    var setUpWidth = 11,
        setUpHeight = 22,
        increment = 123,
        $slider = $("#slider").dxSlider({
            max: 100,
            min: 0,
            width: setUpWidth,
            height: setUpHeight,
            useInkRipple: false
        }),
        slider = $slider.dxSlider("instance"),
        initialWidth = $slider.width(),
        initialHeight = $slider.height();

    assert.equal(initialWidth, setUpWidth, "Element's width was set properly on init");
    assert.equal(initialHeight, setUpHeight, "Element's height was et properly on init");

    slider.option("width", initialWidth + increment);
    slider.option("height", initialHeight + increment);

    assert.equal($slider.width() - initialWidth, increment, "Element's width was set properly on resize");
    assert.equal($slider.height() - initialHeight, increment, "Element's height was set properly on resize");
}),

QUnit.test("check range-slide width after resize", function(assert) {
    var setUpWidth = 100,
        decrement = 0.7 * setUpWidth,
        $slider = $("#slider").dxSlider({
            max: 100,
            min: 0,
            width: setUpWidth,
            useInkRipple: false
        }),
        slider = $slider.dxSlider("instance");

    slider.option("width", setUpWidth - decrement);

    var $range = $slider.find("." + SLIDER_RANGE_CLASS);

    assert.ok($range.width() < $slider.width(), "range width is correct");
});

QUnit.test("mousedown/touchstart on slider set new value (B233178)", function(assert) {
    var $element = $("#slider").dxSlider({
        max: 500,
        min: 0,
        value: 0,
        useInkRipple: false
    }).css("width", 500);

    var $handle = $element.find("." + SLIDER_HANDLE_CLASS),
        $range = $element.find("." + SLIDER_RANGE_CLASS);

    pointerMock($element).start().move(250 + $element.offset().left).down();
    assert.equal($handle.position().left, 250 - $handle.outerWidth() / 2);
    assert.equal($range.width(), 250);

    pointerMock($element).start().move(350 + $element.offset().left).down();
    assert.equal($handle.position().left, 350 - $handle.outerWidth() / 2);
    assert.equal($range.width(), 350);
});

QUnit.test("slider doesn't turn off feedback during gesture", function(assert) {
    var $element = $("#slider").dxSlider({
        max: 500,
        min: 0,
        value: 0,
        useInkRipple: false
    }).css("width", 500);

    var $handle = $element.find("." + SLIDER_HANDLE_CLASS),
        mouse = pointerMock($handle);

    assert.equal($handle.hasClass(ACTIVE_STATE_CLASS), false, "feedback off before start");
    mouse.start().down();
    this.clock.tick(FEEDBACK_SHOW_TIMEOUT);
    assert.ok($handle.hasClass(ACTIVE_STATE_CLASS), "feedback on gesture start");

    mouse.move(100);
    assert.equal($handle.hasClass(ACTIVE_STATE_CLASS), true, "feedback stays on after gesture start");

    mouse.up();
    this.clock.tick(FEEDBACK_HIDE_TIMEOUT);
    assert.ok(!$handle.hasClass(ACTIVE_STATE_CLASS), "feedback off after gesture end");
});

QUnit.test("slider should not turn off feedback during second gesture", function(assert) {
    var $element = $("#slider").dxSlider({
        max: 500,
        min: 0,
        value: 100,
        width: 500,
        useInkRipple: false
    });

    var $handle = $element.find("." + SLIDER_HANDLE_CLASS),
        pointer = pointerMock($handle);

    pointer.start().down().move(100).up();
    pointer.down().move(-100);
    this.clock.tick(FEEDBACK_HIDE_TIMEOUT);
    assert.ok($handle.hasClass(ACTIVE_STATE_CLASS), "handle is active during swipe");
    pointer.up();
});

QUnit.test("slider should turn off feedback after several gestures", function(assert) {
    var $element = $("#slider").dxSlider({
        max: 500,
        min: 0,
        value: 100,
        width: 500,
        useInkRipple: false
    });

    var $handle = $element.find("." + SLIDER_HANDLE_CLASS),
        pointer = pointerMock($handle);

    pointer.start().down().move(100).up();
    pointer.down().move(-100);
    this.clock.tick(FEEDBACK_HIDE_TIMEOUT);
    pointer.up().down().move(-100).up();
    this.clock.tick(FEEDBACK_HIDE_TIMEOUT);

    assert.ok(!$handle.hasClass(ACTIVE_STATE_CLASS), "handle isn't active after swipe");
});

QUnit.test("slider doesn't turn off feedback after sliding in vertical direction", function(assert) {
    var $element = $("#slider").dxSlider({
        max: 500,
        min: 0,
        value: 0,
        useInkRipple: false
    }).css("width", 500);

    var $handle = $element.find("." + SLIDER_HANDLE_CLASS),
        mouse = pointerMock($handle);

    assert.equal($handle.hasClass(ACTIVE_STATE_CLASS), false, "feedback off before start");

    mouse.start().down();
    this.clock.tick(FEEDBACK_SHOW_TIMEOUT);
    assert.ok($handle.hasClass(ACTIVE_STATE_CLASS), "feedback on gesture start");

    mouse
        .move(0, 1)
        .move(1);

    assert.ok($handle.hasClass(ACTIVE_STATE_CLASS), "feedback turned on");

    mouse.up();
    this.clock.tick(FEEDBACK_HIDE_TIMEOUT);
    assert.ok(!$handle.hasClass(ACTIVE_STATE_CLASS), "feedback turned off");
});

QUnit.test("drag handler", function(assert) {
    var $element = $("#slider").dxSlider({
        max: 500,
        min: 0,
        value: 0,
        useInkRipple: false
    }).css("width", 500);

    var offsetX = $element.offset().left,
        $handle = $element.find("." + SLIDER_HANDLE_CLASS),
        $range = $element.find("." + SLIDER_RANGE_CLASS),
        $bar = $element.find("." + SLIDER_BAR_CLASS),
        handleWidth = $handle.outerWidth();

    pointerMock($bar).start().move(offsetX).down().move(250).up();
    assert.equal($handle.position().left, 250 - handleWidth / 2);
    assert.equal($range.width(), 250);

    pointerMock($bar).start().down().move(500 + $handle.outerWidth() / 2).up();
    assert.equal($handle.position().left, 500 - handleWidth / 2);
    assert.equal($range.width(), 500);

});

QUnit.test("smooth drag of handler", function(assert) {
    var $element = $("#slider").dxSlider({
        max: 500,
        min: 0,
        value: 0,
        step: 250,
        width: 500,
        useInkRipple: false
    });

    var $handle = $element.find("." + SLIDER_HANDLE_CLASS),
        halfHandleWidth = $handle.outerWidth() / 2,
        pointer = pointerMock($handle);

    pointer.start().down($element.offset().left).move(100);
    assert.equal($handle.position().left, 100 - halfHandleWidth);
    pointer.up();
});

QUnit.test("value should be updated on swipestart on mobile devices", function(assert) {
    var $element = $("#slider").dxSlider({
            max: 500,
            min: 0,
            value: 0,
            width: 500,
            useInkRipple: false
        }),
        instance = $element.dxSlider("instance");

    var $handle = $element.find("." + SLIDER_WRAPPER_CLASS),
        pointer = pointerMock($handle);

    pointer.start("touch").move($element.offset().left + 300).swipeStart();
    assert.equal(instance.option("value"), 300, "value set after dxswipestart");
});

QUnit.test("value should be updated on click on mobile devices", function(assert) {
    var $element = $("#slider").dxSlider({
            max: 500,
            min: 0,
            value: 0,
            width: 500,
            useInkRipple: false
        }),
        instance = $element.dxSlider("instance");

    var $handle = $element.find("." + SLIDER_WRAPPER_CLASS),
        pointer = pointerMock($handle);

    pointer.start("touch").move($element.offset().left + 300).click();
    assert.equal(instance.option("value"), 300, "value set after dxclick");
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

QUnit.test("the hidden input should use the decimal separator specified in DevExpress.config", function(assert) {
    var originalConfig = config();
    try {
        config({ serverDecimalSeparator: "|" });

        var $element = $("#slider").dxSlider({
                value: 12.25
            }),
            $input = $element.find("input");

        assert.equal($input.val(), "12|25", "the correct decimal separator is used");
    } finally {
        config(originalConfig);
    }
});


QUnit.module("the 'name' option");

QUnit.test("widget input should get the 'name' attribute with a correct value", function(assert) {
    var expectedName = "some_name",
        $element = $("#slider").dxSlider({
            name: expectedName
        }),
        $input = $element.find("input");

    assert.equal($input.attr("name"), expectedName, "the input 'name' attribute has correct value");
});


QUnit.module("slider with tooltip");

QUnit.test("tooltip default rendering", function(assert) {
    var $slider = $("#slider").dxSlider({
            tooltip: {
                enabled: true,
                showMode: "always"
            },
            useInkRipple: false
        }),

        $handle = $slider.find("." + SLIDER_HANDLE_CLASS),
        $tooltip = $handle.find("." + TOOLTIP_CLASS);

    assert.ok($tooltip.length);
    assert.ok(Tooltip.getInstance($tooltip));
});

QUnit.test("'tooltip.enabled' option renders or remove tooltip", function(assert) {
    var $slider = $("#slider").dxSlider({
            tooltip: {
                enabled: false,
                showMode: "always"
            },
            useInkRipple: false
        }),

        $handle = $slider.find("." + SLIDER_HANDLE_CLASS),
        $tooltip = $handle.find("." + TOOLTIP_CLASS);
    assert.ok(!$tooltip.length);
    assert.ok(!$slider.hasClass("dx-slider-tooltip-position-top") && !$slider.hasClass("dx-slider-tooltip-position-bottom"));

    $slider.dxSlider("option", "tooltip.enabled", true);
    $tooltip = $handle.find("." + TOOLTIP_CLASS);
    assert.ok($tooltip.length);
    assert.ok($slider.hasClass("dx-slider-tooltip-position-top") || $slider.hasClass("dx-slider-tooltip-position-bottom"));

    $slider.dxSlider("option", "tooltip.enabled", false);
    $tooltip = $handle.find("." + TOOLTIP_CLASS);
    assert.ok(!$tooltip.length);
    assert.ok(!$slider.hasClass("dx-slider-tooltip-position-top") && !$slider.hasClass("dx-slider-tooltip-position-bottom"));
});

QUnit.test("tooltip displays current value", function(assert) {
    var $slider = $("#slider").dxSlider({
            min: 0,
            value: 50,
            max: 100,
            tooltip: {
                enabled: true,
                showMode: "always"
            },
            useInkRipple: false
        }),
        $handle = $slider.find("." + SLIDER_HANDLE_CLASS),
        $tooltip = $handle.find("." + TOOLTIP_CLASS);

    assert.equal($.trim($tooltip.text()), "50");

    $slider.dxSlider("option", "value", 75);
    assert.equal($.trim($tooltip.text()), 75);
});

QUnit.test("'tooltip.position' option", function(assert) {

    var $slider = $("#slider");

    positionUtils.setup($slider, {
        my: "center",
        at: "center",
        of: window
    });

    $slider.css("position", "absolute");

    $slider.dxSlider({
        tooltip: {
            enabled: true,
            showMode: "always",
            position: "top"
        },
        useInkRipple: false
    });

    var $handle = $slider.find("." + SLIDER_HANDLE_CLASS),
        $tooltipContent = $handle.find("." + TOOLTIP_CONTENT_CLASS),
        $sliderBar = $slider.find("." + SLIDER_BAR_CLASS);

    var tooltipBottom = $tooltipContent.offset().top + $tooltipContent.outerHeight(),
        sliderTop = $sliderBar.offset().top;

    assert.ok($slider.hasClass("dx-slider-tooltip-position-top"));
    assert.ok(!$slider.hasClass("dx-slider-tooltip-position-bottom"));
    assert.ok(tooltipBottom < sliderTop, "tooltip bottom = " + tooltipBottom + ", slider top = " + sliderTop + " - tooltip should be display on top");

    $slider.dxSlider("option", "tooltip.position", "bottom");

    $tooltipContent = $handle.find("." + TOOLTIP_CONTENT_CLASS);

    var tooltipTop = $tooltipContent.offset().top,
        sliderBottom = $sliderBar.offset().top + $sliderBar.outerHeight();

    assert.ok(!$slider.hasClass("dx-slider-tooltip-position-top"));
    assert.ok($slider.hasClass("dx-slider-tooltip-position-bottom"));
    assert.ok(tooltipTop > sliderBottom, "tooltip top = " + tooltipTop + ", slider bottom = " + sliderBottom + " - tooltip should be display on bottom");
});

QUnit.test("tooltip should be centered after render", function(assert) {
    var $slider = $("#slider").dxSlider({
        max: 100,
        min: 0,
        value: 50,
        tooltip: { enabled: true, showMode: "always", position: "top" },
        useInkRipple: false
    });

    var $tooltip = $slider.find("." + TOOLTIP_CONTENT_CLASS);
    var $arrow = $(".dx-popover-arrow");

    assert.equal(Math.floor(($tooltip.outerWidth() - $arrow.outerWidth()) / 2), -$tooltip.position().left + parseInt($arrow.css("margin-left").replace("px", "")), "tooltip position is centered");
});

QUnit.test("tooltip should be fitted into slide right and left bounds", function(assert) {
    var $slider = $("#slider");

    positionUtils.setup($slider, {
        my: "center",
        at: "center",
        of: window
    });

    $slider.dxSlider({
        value: 0,
        min: 0,
        max: 100,
        tooltip: {
            enabled: true,
            showMode: "always"
        },
        useInkRipple: false
    });

    var $handle = $slider.find("." + SLIDER_HANDLE_CLASS),
        $tooltipContent = $handle.find("." + TOOLTIP_CONTENT_CLASS);

    var tooltipLeft = $tooltipContent.offset().left,
        sliderLeft = $slider.offset().left;

    assert.ok(tooltipLeft >= sliderLeft, "tooltip left = " + tooltipLeft + ", slider left = " + sliderLeft);

    $slider.dxSlider("option", "value", 100);

    var tooltipRight = $tooltipContent.offset().left + $tooltipContent.outerWidth(),
        sliderRight = $slider.offset().left + $slider.outerWidth();

    assert.ok(tooltipRight <= sliderRight, "tooltip right = " + tooltipRight + ", slider right = " + sliderRight);
});

QUnit.test("'tooltip.showMode' option", function(assert) {
    var $slider = $("#slider").dxSlider({
            min: 0,
            value: 50,
            max: 100,
            tooltip: {
                enabled: true,
                showMode: "onhover"
            },
            useInkRipple: false
        }),
        $handle = $slider.find("." + SLIDER_HANDLE_CLASS);

    assert.ok($handle.hasClass("dx-slider-tooltip-on-hover"));

    $slider.dxSlider("option", "tooltip.showMode", "always");
    assert.ok(!$handle.hasClass("dx-slider-tooltip-on-hover"));
});

QUnit.test("tooltip was not created before slider hanlde has focus", function(assert) {
    var $slider = $("#slider").dxSlider({
            min: 0,
            value: 50,
            max: 100,
            tooltip: {
                enabled: true,
                showMode: "onHover"
            },
            useInkRipple: false
        }),
        $handle = $slider.find("." + SLIDER_HANDLE_CLASS);
    var $tooltip = $handle.find("." + TOOLTIP_CLASS);

    assert.ok(!$tooltip.length, "tooltip was not created");

    $slider.trigger($.Event("dxhoverstart", { target: $handle.get(0) }));

    $tooltip = $handle.find("." + TOOLTIP_CLASS);

    assert.ok(!!Tooltip.getInstance($tooltip), "tooltip was created");
});

QUnit.test("'rtlEnabled' changing should not leads to error", function(assert) {
    assert.expect(0);

    var $slider = $("#slider").dxSlider({
        rtlEnabled: false,
        tooltip: {
            enabled: true,
            showMode: "onhover"
        },
        useInkRipple: false
    });

    $slider.dxSlider({
        rtlEnabled: true
    });
});

QUnit.test("tooltip option changing when slider 'visible' = false", function(assert) {
    var $slider = $("#slider");

    positionUtils.setup($slider, {
        my: "center",
        at: "center",
        of: window
    });

    $slider.css("position", "absolute");

    $slider.dxSlider({
        visible: false,
        useInkRipple: false
    });
    $slider.dxSlider({
        tooltip: {
            enabled: true,
            position: "top",
            showMode: "always"
        }
    });

    $slider.dxSlider({ visible: true });

    var $handle = $slider.find("." + SLIDER_HANDLE_CLASS),
        $tooltipContent = $handle.find("." + TOOLTIP_CONTENT_CLASS),
        $sliderBar = $slider.find("." + SLIDER_BAR_CLASS);

    var tooltipBottom = $tooltipContent.offset().top + $tooltipContent.outerHeight(),
        sliderTop = $sliderBar.offset().top;

    assert.ok(tooltipBottom < sliderTop, "tooltip bottom = " + tooltipBottom + ", slider top = " + sliderTop + " - tooltip should be display on top");
});

QUnit.test("slider tooltip should not add hideTopOverlayCallback (T104070)", function(assert) {
    var $slider = $("#slider");

    $slider.dxSlider({
        tooltip: {
            enabled: true,
            showMode: "always"
        },
        useInkRipple: false
    });

    assert.ok(!hideTopOverlayCallback.hasCallback());
});

QUnit.test("tooltip renders correct after value length changed", function(assert) {
    if(browser.msie) {
        assert.expect(0);
        return;
    }

    var originalFX = fx.off;
    try {
        fx.off = true;
        var $slider = $("#slider").dxSlider({
            min: -1000000,
            max: 1000000,
            value: 0,
            width: 2000,
            tooltip: {
                enabled: true,
                position: "top",
                showMode: "always"
            },
            useInkRipple: false
        });

        $slider.dxSlider("option", "value", 500000);
        var $sliderHandle = $slider.find("." + SLIDER_HANDLE_CLASS);
        var $tooltipContent = $slider.find("." + TOOLTIP_CONTENT_CLASS);
        var $popupContent = $tooltipContent.find(".dx-popup-content");

        var centerSlider = $sliderHandle.offset().left + $sliderHandle.outerWidth() / 2;
        var centerTooltipContent = $tooltipContent.offset().left + $tooltipContent.outerWidth() / 2;
        assert.roughEqual(Math.abs(centerSlider), Math.abs(centerTooltipContent), 0.1, "center slider equals center tooltip");
        assert.roughEqual($tooltipContent.width(), $popupContent.outerWidth(), 2, "popupcontent is stretched");
    } finally {
        fx.off = originalFX;
    }
});

QUnit.test("tooltip should repaints when repaint function called (T260971)", function(assert) {
    $("#slider").hide();

    var $slider = $("#slider").dxSlider({
            min: 0,
            max: 100,
            value: 50,
            width: 2000,
            tooltip: {
                enabled: true,
                position: "top",
                showMode: "always"
            },
            useInkRipple: false
        }),
        instance = $slider.dxSlider("instance");

    $("#slider").show();

    instance.repaint();
    assert.ok($slider.find(".dx-tooltip .dx-overlay-content").length, "tooltip is exist");
});

QUnit.test("slider in scrollable should not show scroll in max position (T315618)", function(assert) {
    var sliderWidth = 400,
        $slider = $("#slider").dxSlider({
            min: 0,
            max: 100,
            value: 100,
            width: sliderWidth,
            tooltip: {
                enabled: true,
                position: "bottom",
                showMode: "always"
            },
            useInkRipple: false
        }),
        $tooltipContent = $slider.find("." + TOOLTIP_CONTENT_CLASS),
        tooltipRightBorder = $tooltipContent.offset().left + $tooltipContent.outerWidth() - $slider.offset().left,
        boundaryOffset = sliderWidth - tooltipRightBorder;

    assert.equal(boundaryOffset, 2, "tooltip content should have correct boundary offset");
});

QUnit.test("arrow should be centered after dimension was changed", function(assert) {
    var $slider = $("#slider").dxSlider({
        min: 0,
        max: 100,
        value: 50,
        tooltip: {
            enabled: true,
            showMode: "always"
        },
        useInkRipple: false
    });

    resizeCallbacks.fire();

    var $arrow = $slider.find(".dx-popover-arrow");
    var $sliderHandle = $slider.find(".dx-slider-handle");

    assert.equal($arrow.offset().left + $arrow.outerWidth() / 2, $sliderHandle.offset().left + $sliderHandle.outerWidth() / 2, "arrow centered");
});

QUnit.test("arrow should not go outside of the content overlay", function(assert) {
    var $slider = $("#slider").dxSlider({
        min: 0,
        max: 100,
        value: 0,
        tooltip: {
            enabled: true,
            showMode: "always"
        },
        useInkRipple: false
    });

    var $arrow = $slider.find(".dx-popover-arrow"),
        $handle = $slider.find(".dx-slider-handle"),
        $content = $slider.find(".dx-overlay-content");

    $handle.width(SLIDER_HANDLE_WIDTH);
    resizeCallbacks.fire();

    assert.equal($content.offset().left, $arrow.offset().left, "arrow was fitted");
});


QUnit.module("'tooltip.format' option");

QUnit.test("'tooltip.format' option as function", function(assert) {
    var $slider = $("#slider").dxSlider({
            min: 0,
            value: 50,
            max: 100,
            tooltip: {
                enabled: true,
                showMode: "always",
                format: function(value) {
                    return "$" + value;
                }
            },
            useInkRipple: false
        }),
        $handle = $slider.find("." + SLIDER_HANDLE_CLASS),
        $tooltip = $handle.find("." + TOOLTIP_CLASS);

    assert.equal($.trim($tooltip.text()), "$50");

    $slider.dxSlider("option", "value", 75);
    assert.equal($.trim($tooltip.text()), "$75");
});

QUnit.test("'tooltip.format' option as FormatHelper format", function(assert) {
    var $slider = $("#slider").dxSlider({
            min: 0,
            value: 0.12345,
            max: 1,
            tooltip: {
                enabled: true,
                showMode: "always",
                format: { type: "fixedpoint", precision: 1 }
            },
            useInkRipple: false
        }),
        $handle = $slider.find("." + SLIDER_HANDLE_CLASS),
        $tooltip = $handle.find("." + TOOLTIP_CLASS);

    assert.equal($.trim($tooltip.text()), "0.1");
    $slider.dxSlider("option", "tooltip.format", { format: "fixedpoint", precision: 2 });

    $tooltip = $handle.find("." + TOOLTIP_CLASS);
    assert.equal($.trim($tooltip.text()), "0.12");
});

QUnit.test("'tooltip.format' changing should re-render tooltip content", function(assert) {
    var $slider = $("#slider").dxSlider({
            min: 0,
            value: 1,
            max: 1,
            tooltip: {
                enabled: true,
                showMode: "always",
                format: function(value) {
                    return "(" + value + ")";
                }
            },
            useInkRipple: false
        }),
        $handle = $slider.find("." + SLIDER_HANDLE_CLASS),
        $tooltip = $handle.find("." + TOOLTIP_CLASS);

    assert.equal($.trim($tooltip.text()), "(1)");

    $slider.dxSlider("option", "tooltip.format", function(value) {
        return "[" + value + "]";
    });

    $tooltip = $handle.find("." + TOOLTIP_CLASS);

    assert.equal($.trim($tooltip.text()), "[1]");
});

QUnit.test("'tooltip.format' as undefined (null, false) should render value as is", function(assert) {
    var $slider = $("#slider").dxSlider({
            min: 0,
            value: 1,
            max: 1,
            tooltip: {
                enabled: true,
                showMode: "always",
                format: null
            },
            useInkRipple: false
        }),
        $handle = $slider.find("." + SLIDER_HANDLE_CLASS),
        $tooltip = $handle.find("." + TOOLTIP_CLASS);

    assert.equal($.trim($tooltip.text()), "1");
});


QUnit.module("labels", moduleOptions);

QUnit.test("'label.visible' option toggles label visibility", function(assert) {
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
    assert.equal($sliderLabels.eq(0).html(), "0");
    assert.equal($sliderLabels.eq(1).html(), "100");

    $slider.dxSlider("option", "label.visible", false);
    $sliderLabels = $slider.find("." + SLIDER_LABEL_CLASS);
    assert.equal($sliderLabels.length, 0, "labels are removed");
});

QUnit.test("labels should re-rendered if 'min' or/and 'max' options changed", function(assert) {
    var $slider = $("#slider").dxSlider({
        label: {
            visible: true
        },
        useInkRipple: false
    });

    $slider.dxSlider({
        min: 1000,
        max: 2000
    });

    var $sliderLabels = $slider.find("." + SLIDER_LABEL_CLASS);
    assert.equal($sliderLabels.eq(0).html(), "1000");
    assert.equal($sliderLabels.eq(1).html(), "2000");

    $slider.dxSlider({
        min: 1500
    });
    $sliderLabels = $slider.find("." + SLIDER_LABEL_CLASS);
    assert.equal($sliderLabels.eq(0).html(), "1500");
    assert.equal($sliderLabels.eq(1).html(), "2000");

    $slider.dxSlider({
        max: 2500
    });
    $sliderLabels = $slider.find("." + SLIDER_LABEL_CLASS);
    assert.equal($sliderLabels.eq(0).html(), "1500");
    assert.equal($sliderLabels.eq(1).html(), "2500");
});

QUnit.test("'label.format' as function", function(assert) {
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

QUnit.test("'label.position' option toggles label position", function(assert) {
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


QUnit.module("events");

QUnit.test("value change should cause value change action call", function(assert) {
    assert.expect(1);

    var $slider = $("#slider").dxSlider({
        max: 500,
        min: 0,
        value: 0,
        onValueChanged: function() {
            assert.ok(true, "action fired");
        },
        useInkRipple: false
    }).css("width", 500);

    pointerMock($slider).start().move(250 + $slider.offset().left).down();
});

QUnit.test("Changing the 'value' option must invoke the 'onValueChanged' action", function(assert) {
    var slider = $("#slider").dxSlider({
        onValueChanged: function() { assert.ok(true); },
        useInkRipple: false
    }).dxSlider("instance");
    slider.option("value", true);
});

QUnit.test("T269867 - handle should not have active state if the 'activeStateEnabled' option is false", function(assert) {
    var $element = $("#slider").dxSlider({
            activeStateEnabled: false,
            useInkRipple: false
        }),
        $handle = $element.find(".dx-slider-handle");

    pointerMock($handle).start().down().move(250 + $element.offset().left);
    assert.ok(!$handle.hasClass("dx-state-active"), "handle should not have active state");
});


QUnit.module("focus policy", moduleOptions);

QUnit.testInActiveWindow("Handle focus by click on track bar (T249311)", function(assert) {
    assert.expect(1);

    var $slider = $("#slider").dxSlider({
            focusStateEnabled: true,
            useInkRipple: false
        }),
        $handle = $slider.find("." + SLIDER_HANDLE_CLASS);

    $slider.trigger("dxclick");
    assert.ok($handle.hasClass("dx-state-focused"), "handle has focus class after click on track");
});


QUnit.module("keyboard navigation", moduleOptions);

QUnit.test("control keys test", function(assert) {
    assert.expect(2);

    var $slider = $("#slider").dxSlider({
            min: 10,
            max: 90,
            value: 50,
            focusStateEnabled: true,
            useInkRipple: false
        }),
        slider = $slider.dxSlider("instance"),
        $handle = $slider.find("." + SLIDER_HANDLE_CLASS),
        keyboard = keyboardMock($handle);

    $handle.trigger("focusin");

    keyboard.keyDown("right");
    assert.equal(slider.option("value"), 51, "value is correct after rightArrow press");

    keyboard.keyDown("left");
    assert.equal(slider.option("value"), 50, "value is correct after leftArrow press");
});

QUnit.test("control keys test with step", function(assert) {
    assert.expect(4);

    var $slider = $("#slider").dxSlider({
            min: 10,
            max: 90,
            value: 50,
            step: 3,
            focusStateEnabled: true,
            useInkRipple: false
        }),
        slider = $slider.dxSlider("instance"),
        $handle = $slider.find("." + SLIDER_HANDLE_CLASS),
        keyboard = keyboardMock($handle);

    $handle.trigger("focusin");

    keyboard.keyDown("right");
    assert.equal(slider.option("value"), 52, "value is correct after rightArrow press");

    keyboard.keyDown("left");
    assert.equal(slider.option("value"), 49, "value is correct after leftArrow press");

    keyboard.keyDown("home");
    assert.equal(slider.option("value"), 10, "value is correct after home press");

    keyboard.keyDown("end");
    assert.equal(slider.option("value"), 90, "value is correct after end press");
});

QUnit.test("pageUp/pageDown keys test", function(assert) {
    assert.expect(4);

    var $slider = $("#slider").dxSlider({
            min: 10,
            max: 90,
            value: 50,
            keyStep: 1,
            focusStateEnabled: true,
            useInkRipple: false
        }),
        slider = $slider.dxSlider("instance"),
        $handle = $slider.find("." + SLIDER_HANDLE_CLASS),
        keyboard = keyboardMock($handle);

    $handle.trigger("focusin");

    keyboard.keyDown("pageUp");
    assert.equal(slider.option("value"), 51, "value is correct after pageUp press");

    keyboard.keyDown("pageDown");
    assert.equal(slider.option("value"), 50, "value is correct after pageDown press");

    slider.option("keyStep", 10);
    slider.option("step", 2);

    keyboard.keyDown("pageUp");
    assert.equal(slider.option("value"), 70, "value is correct after pageUp press");

    keyboard.keyDown("pageDown");
    assert.equal(slider.option("value"), 50, "value is correct after pageDown press");
});

QUnit.test("control keys test for rtl", function(assert) {
    assert.expect(4);

    var $slider = $("#slider").dxSlider({
            rtlEnabled: true,
            min: 10,
            max: 90,
            value: 50,
            step: 3,
            focusStateEnabled: true,
            useInkRipple: false
        }),
        slider = $slider.dxSlider("instance"),
        $handle = $slider.find("." + SLIDER_HANDLE_CLASS),
        keyboard = keyboardMock($handle);

    $handle.trigger("focusin");

    keyboard.keyDown("right");
    assert.equal(slider.option("value"), 49, "value is correct after rightArrow press");

    keyboard.keyDown("left");
    assert.equal(slider.option("value"), 52, "value is correct after leftArrow press");

    keyboard.keyDown("home");
    assert.equal(slider.option("value"), 10, "value is correct after home press");

    keyboard.keyDown("end");
    assert.equal(slider.option("value"), 90, "value is correct after end press");
});

QUnit.test("pageUp/pageDown keys test for rtl", function(assert) {
    assert.expect(4);

    var $slider = $("#slider").dxSlider({
            rtlEnabled: true,
            min: 10,
            max: 90,
            value: 50,
            keyStep: 1,
            focusStateEnabled: true,
            useInkRipple: false
        }),
        slider = $slider.dxSlider("instance"),
        $handle = $slider.find("." + SLIDER_HANDLE_CLASS),
        keyboard = keyboardMock($handle);

    $handle.trigger("focusin");

    keyboard.keyDown("pageUp");
    assert.equal(slider.option("value"), 49, "value is correct after pageUp press");

    keyboard.keyDown("pageDown");
    assert.equal(slider.option("value"), 50, "value is correct after pageDown press");

    slider.option("keyStep", 10);

    keyboard.keyDown("pageUp");
    assert.equal(slider.option("value"), 40, "value is correct after pageUp press");

    keyboard.keyDown("pageDown");
    assert.equal(slider.option("value"), 50, "value is correct after pageDown press");
});

QUnit.test("T380070 - the value should not be changed on the 'left' key press if the value is min", function(assert) {
    var spy = sinon.spy(),
        $slider = $("#slider").dxSlider({
            min: 10,
            value: 10,
            focusStateEnabled: true,
            onValueChanged: spy
        }),
        $handle = $slider.find("." + SLIDER_HANDLE_CLASS);

    keyboardMock($handle).press("left");
    assert.ok(spy.called === false, "the onValueChanged is not called");
});

QUnit.test("T380070 - the value should not be changed on the 'right' key press if the value is max", function(assert) {
    var spy = sinon.spy(),
        $slider = $("#slider").dxSlider({
            max: 10,
            value: 10,
            focusStateEnabled: true,
            onValueChanged: spy
        }),
        $handle = $slider.find("." + SLIDER_HANDLE_CLASS);

    keyboardMock($handle).press("right");
    assert.ok(spy.called === false, "the onValueChanged is not called");
});


QUnit.module("regression tests", moduleOptions);

QUnit.test("change value of invisible element", function(assert) {
    var $element = $("#slider").dxSlider({
            max: 100,
            min: 0,
            value: 20,
            useInkRipple: false
        }).css("width", 100),
        instance = $element.dxSlider("instance"),
        range = $element.find("." + SLIDER_RANGE_CLASS);

    instance.option("visible", false);
    instance.option("value", 40);
    instance.option("visible", true);

    assert.equal(range.width(), 40, "range width is right");
});

QUnit.test("min value behaviour", function(assert) {
    var $element = $("#slider").dxSlider({
        max: 600,
        min: 100,
        value: 200,
        useInkRipple: false
    }).css("width", 500);

    var slider = $element.dxSlider("instance");

    pointerMock($element).start().move(250 + $element.offset().left).down();
    assert.equal(slider.option("value"), 350);
});

QUnit.test("B230095 - value is set to '0' after click on the handle", function(assert) {
    var $element = $("#slider").dxSlider({
        max: 10,
        min: 0,
        value: 5,
        useInkRipple: false
    });

    var $handle = $element.find("." + SLIDER_HANDLE_CLASS),
        handleX = $handle.offset().left + $handle.outerWidth() / 2;

    pointerMock($element.find("." + SLIDER_HANDLE_CLASS)).start().move(handleX).click();
    assert.equal($element.dxSlider("option", "value"), 5);
});

QUnit.test("B232111, B233180 - disabled state doesn't work", function(assert) {
    var $element = $("#slider").dxSlider({
            min: 0,
            value: 50,
            max: 100,
            disabled: true,
            useInkRipple: false
        }),
        slider = $element.dxSlider("instance");

    assert.ok($element.hasClass("dx-state-disabled"));
    pointerMock($element).start().move(250 + $element.offset().left).down();
    assert.equal(slider.option("value"), 50);
});

QUnit.test("B233256 - incorrect options", function(assert) {
    var $element = $("#slider").dxSlider({
            min: 0,
            value: 50,
            max: 100,
            useInkRipple: false
        }),
        slider = $element.dxSlider("instance");

    slider.option("min", 110);

    assert.expect(0);
});

QUnit.test("B233288 - incorrect behavior when swipe on handle", function(assert) {
    var $element = $("#slider")
            .css("width", 500)
            .dxSlider({
                max: 500,
                min: 0,
                value: 250,
                useInkRipple: false
            });

    var $handle = $element.find("." + SLIDER_HANDLE_CLASS),
        handleX = $handle.offset().left + $handle.outerWidth() / 2,
        instance = $element.dxSlider("instance");

    assert.equal(instance.option("value"), 250);
    pointerMock($handle).start().move(handleX).down().move(2).up();
    assert.equal(instance.option("value"), 252);
});

QUnit.test("B234545 dxRangeSlider/dxSlider - incorrect behavior with negative min and max values.", function(assert) {
    var $element = $("#slider").css("width", 960);

    $element.dxSlider({
        max: 100,
        min: 0,
        value: 0,
        useInkRipple: false
    });

    var slider = $element.dxSlider("instance");

    var $range = $element.find("." + SLIDER_RANGE_CLASS);

    slider.option("min", -10);
    slider.option("max", -10);

    assert.equal(slider.option("value"), -10);
    assert.equal($range.width(), 0);
});

QUnit.test("B234766 dxSlider - incorrect value calculation with fractional step", function(assert) {
    var $element = $("#slider").css("width", 960);

    $element.dxSlider({
        max: 100,
        min: 0,
        value: 0,
        useInkRipple: false
    });

    var slider = $element.dxSlider("instance");

    var $handle = $element.find("." + SLIDER_HANDLE_CLASS),
        $range = $element.find("." + SLIDER_RANGE_CLASS);

    slider.option("step", 2.5);
    slider.option("value", 2.5);

    assert.equal($handle.position().left, 960 / 40 - $handle.outerWidth() / 2);
    assert.equal($range.width(), 960 / 40);

    slider.option("max", 10);
    slider.option("step", 0.5);
    slider.option("value", 0.5);

    assert.equal($handle.position().left, 960 / 20 - $handle.outerWidth() / 2);
    assert.equal($range.width(), 960 / 20);
});

QUnit.test("incorrect when step is NAN or empty string", function(assert) {
    var $element = $("#slider")
            .css("width", 500)
            .dxSlider({
                max: 500,
                min: 0,
                value: 250,
                useInkRipple: false
            }),
        slider = $element.dxSlider("instance");

    slider.option("step", "NANstring");

    var $handle = $element.find("." + SLIDER_HANDLE_CLASS),
        handleX = $handle.offset().left + $handle.outerWidth() / 2;

    assert.equal(slider.option("value"), 250);
    pointerMock($handle).start().move(handleX).down().move(50).up();
    assert.equal(slider.option("value"), 300);

    slider.option("step", "");
    slider.option("value", 250);

    assert.equal(slider.option("value"), 250);
    pointerMock($handle).start().move(handleX).down().move(50).up();
    assert.equal(slider.option("value"), 300);
});

QUnit.test("Q374462 dxSlider - It is impossible to set the step option to the float value", function(assert) {
    var $element = $("#slider")
            .css("width", 100)
            .dxSlider({
                max: 1,
                min: -1,
                value: 0,
                useInkRipple: false
            }),
        slider = $element.dxSlider("instance");

    slider.option("step", 0.01);
    var $handle = $element.find("." + SLIDER_HANDLE_CLASS),
        handleX = $handle.offset().left + $handle.outerWidth() / 2;

    assert.equal(slider.option("value"), 0);
    pointerMock($handle).start().move(handleX).down().move(10).up();
    assert.equal(slider.option("value"), 0.20);

    slider.option("step", 0.00015);
    slider.option("value", 0);
    assert.equal(slider.option("value"), 0);
    pointerMock($handle).start().move(handleX).down().move(15).up();
    assert.equal(slider.option("value"), 0.30005);

    slider.option("step", 0.0000001);
    slider.option("value", 0);
    pointerMock($handle).start().move(handleX).down().move(15).up();
    assert.equal(slider.option("value"), 0.3, "step should be reset to default");
});

QUnit.test("step depends on min value after swipe", function(assert) {
    var $element = $("#slider")
            .css("width", 150)
            .dxSlider({
                max: 2,
                min: 0.5,
                value: 0.5,
                step: 1,
                useInkRipple: false
            }),
        slider = $element.dxSlider("instance");

    var $handle = $element.find("." + SLIDER_HANDLE_CLASS),
        handleX = $handle.offset().left + $handle.outerWidth() / 2;

    pointerMock($handle).start().move(handleX).down().move(100).up();
    assert.equal(slider.option("value"), 1.5, "step depends min value");
});

QUnit.test("'repaint' method should not leads to error if 'tooltip.enabled' is true", function(assert) {
    assert.expect(0);

    var $element = $("#slider"),
        slider = $element.dxSlider({
            tooltip: {
                enabled: true,
                showMode: "always"
            },
            useInkRipple: false
        }).dxSlider("instance");

    slider.repaint();
});

QUnit.test("The error should not be thrown if value is null", function(assert) {
    try {
        var slider = $("#slider").dxSlider({
            value: null
        }).dxSlider("instance");

        slider.option("value", 100);

        assert.ok(true, "The error doesn't be thrown");
    } catch(e) {
        assert.ok(false, e);
    }
});

QUnit.module("RTL", moduleOptions);

QUnit.test("render value", function(assert) {
    var $element = $("#slider").css("width", 960);

    $element.dxSlider({
        max: 100,
        min: 0,
        value: 0,
        rtlEnabled: true,
        useInkRipple: false
    });

    var slider = $element.dxSlider("instance"),
        $range = $element.find("." + SLIDER_RANGE_CLASS);

    assert.equal($range.position().left, 960);

    slider.option("value", 100);

    assert.equal($range.position().left, 0);
});

QUnit.test("mousedown/touchstart on slider set new value", function(assert) {
    var $element = $("#slider").dxSlider({
        max: 500,
        min: 0,
        value: 0,
        rtlEnabled: true,
        useInkRipple: false
    }).css("width", 500);

    var $range = $element.find("." + SLIDER_RANGE_CLASS);

    pointerMock($element).start().move(250 + $element.offset().left).down();
    assert.equal($range.width(), 250);

    pointerMock($element).start().move(350 + $element.offset().left).down();
    assert.equal($range.width(), 150);
});

QUnit.module("widget sizing render");

QUnit.test("default", function(assert) {
    var $element = $("#widget").dxSlider({
        useInkRipple: false
    });

    assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
});

QUnit.test("constructor", function(assert) {
    var $element = $("#widget").dxSlider({
            width: 400,
            useInkRipple: false
        }),
        instance = $element.dxSlider("instance");

    assert.strictEqual(instance.option("width"), 400);
    assert.strictEqual($element.outerWidth(), 400, "outer width of the element must be equal to custom width");
});

QUnit.test("root with custom width", function(assert) {
    var $element = $("#widthRootStyle").dxSlider({
            useInkRipple: false
        }),
        instance = $element.dxSlider("instance");

    assert.strictEqual(instance.option("width"), undefined);
    assert.strictEqual($element.outerWidth(), 300, "outer width of the element must be equal to custom width");
});

QUnit.test("change width", function(assert) {
    var $element = $("#widget").dxSlider({
            useInkRipple: false
        }),
        instance = $element.dxSlider("instance"),
        customWidth = 400;

    instance.option("width", customWidth);

    assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
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


QUnit.module("visibility change");

QUnit.test("tooltip should be centered after visibility changed", function(assert) {
    var $slider = $("#slider");
    var $parent = $slider.parent();

    $parent.hide();
    $slider.dxSlider({
        max: 100,
        min: 0,
        value: 50,
        tooltip: { enabled: true, showMode: "always", position: "top" },
        useInkRipple: false
    });

    $parent.show();
    domUtils.triggerShownEvent($parent);

    var $tooltip = $slider.find("." + TOOLTIP_CONTENT_CLASS);
    var $arrow = $(".dx-popover-arrow");

    assert.equal(Math.floor(($tooltip.outerWidth() - $arrow.outerWidth()) / 2), -$tooltip.position().left + parseInt($arrow.css("margin-left").replace("px", "")), "tooltip position is centered");
});
