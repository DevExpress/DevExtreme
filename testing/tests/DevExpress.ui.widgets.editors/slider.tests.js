import $ from "jquery";
import Tooltip from "ui/tooltip";
import resizeCallbacks from "core/utils/resize_callbacks";
import domUtils from "core/utils/dom";
import positionUtils from "animation/position";
import browser from "core/utils/browser";
import config from "core/config";
import { hideCallback as hideTopOverlayCallback } from "mobile/hide_top_overlay";
import keyboardMock from "../../helpers/keyboardMock.js";
import pointerMock from "../../helpers/pointerMock.js";
import fx from "animation/fx";
import "ui/slider";

import "common.css!";

const { module, testStart, test, testInActiveWindow } = QUnit;

testStart(() => {
    const markup =
        `<div id="slider"></div>
        <div id="widget"></div>
        <div id="widthRootStyle" style="width: 300px;"></div>`;

    $("#qunit-fixture").html(markup);
});

const SLIDER_CLASS = "dx-slider",
    SLIDER_WRAPPER_CLASS = SLIDER_CLASS + "-wrapper",
    SLIDER_LABEL_POSITION_CLASS_PREFIX = SLIDER_CLASS + "-label-position-",
    SLIDER_RANGE_CLASS = SLIDER_CLASS + "-range",
    SLIDER_BAR_CLASS = SLIDER_CLASS + "-bar",
    SLIDER_HANDLE_CLASS = SLIDER_CLASS + "-handle",
    SLIDER_LABEL_CLASS = SLIDER_CLASS + "-label",

    ACTIVE_STATE_CLASS = "dx-state-active",
    FEEDBACK_SHOW_TIMEOUT = 30,
    FEEDBACK_HIDE_TIMEOUT = 400,
    SLIDER_HANDLE_WIDTH = 14,

    POPUP_CONTENT_CLASS = "dx-popup-content",

    TOOLTIP_CLASS = "dx-tooltip",
    TOOLTIP_CONTENT_CLASS = "dx-overlay-content",

    INVALID_MESSAGE_VISIBLE_CLASS = "dx-invalid-message-visible";

const moduleOptions = {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
};

module("render", moduleOptions, () => {
    test("default size", function(assert) {
        const $element = $("#widget").dxSlider({
            useInkRipple: false
        });

        assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
    });

    test("onContentReady fired after the widget is fully ready", function(assert) {
        assert.expect(2);
        const position = "top";

        $("#slider").dxSlider({
            label: {
                visible: true,
                position: position
            },
            onContentReady: function(e) {
                assert.ok($(e.element).hasClass(SLIDER_CLASS));
                assert.ok($(e.element).hasClass(SLIDER_LABEL_POSITION_CLASS_PREFIX + position));
            }
        });
    });

    test("Resize by option", function(assert) {
        const setUpWidth = 11,
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
    });

    test("check range-slide width after resize", function(assert) {
        const setUpWidth = 100,
            decrement = 0.7 * setUpWidth,
            $slider = $("#slider").dxSlider({
                max: 100,
                min: 0,
                width: setUpWidth,
                useInkRipple: false
            }),
            slider = $slider.dxSlider("instance");

        slider.option("width", setUpWidth - decrement);
        const $range = $slider.find("." + SLIDER_RANGE_CLASS);

        assert.ok($range.width() < $slider.width(), "range width is correct");
    });

    test("mousedown/touchstart on slider set new value (B233178)", function(assert) {
        const $element = $("#slider").dxSlider({
            max: 500,
            min: 0,
            value: 0,
            useInkRipple: false
        }).css("width", 500);

        const $handle = $element.find("." + SLIDER_HANDLE_CLASS),
            $range = $element.find("." + SLIDER_RANGE_CLASS);

        pointerMock($element).start().move(250 + $element.offset().left).down();
        assert.equal($handle.position().left, 250 - $handle.outerWidth() / 2);
        assert.equal($range.width(), 250);

        pointerMock($element).start().move(350 + $element.offset().left).down();
        assert.equal($handle.position().left, 350 - $handle.outerWidth() / 2);
        assert.equal($range.width(), 350);
    });

    test("slider doesn't turn off feedback during gesture", function(assert) {
        const $element = $("#slider").dxSlider({
            max: 500,
            min: 0,
            value: 0,
            useInkRipple: false
        }).css("width", 500);

        const $handle = $element.find("." + SLIDER_HANDLE_CLASS),
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

    test("slider should not turn off feedback during second gesture", function(assert) {
        const $element = $("#slider").dxSlider({
            max: 500,
            min: 0,
            value: 100,
            width: 500,
            useInkRipple: false
        });

        const $handle = $element.find("." + SLIDER_HANDLE_CLASS),
            pointer = pointerMock($handle);

        pointer.start().down().move(100).up();
        pointer.down().move(-100);
        this.clock.tick(FEEDBACK_HIDE_TIMEOUT);
        assert.ok($handle.hasClass(ACTIVE_STATE_CLASS), "handle is active during swipe");
        pointer.up();
    });

    test("slider should turn off feedback after several gestures", function(assert) {
        const $element = $("#slider").dxSlider({
            max: 500,
            min: 0,
            value: 100,
            width: 500,
            useInkRipple: false
        });

        const $handle = $element.find("." + SLIDER_HANDLE_CLASS),
            pointer = pointerMock($handle);

        pointer.start().down().move(100).up();
        pointer.down().move(-100);
        this.clock.tick(FEEDBACK_HIDE_TIMEOUT);
        pointer.up().down().move(-100).up();
        this.clock.tick(FEEDBACK_HIDE_TIMEOUT);

        assert.ok(!$handle.hasClass(ACTIVE_STATE_CLASS), "handle isn't active after swipe");
    });

    test("slider doesn't turn off feedback after sliding in vertical direction", function(assert) {
        const $element = $("#slider").dxSlider({
            max: 500,
            min: 0,
            value: 0,
            useInkRipple: false
        }).css("width", 500);

        const $handle = $element.find("." + SLIDER_HANDLE_CLASS),
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

    test("drag handler", function(assert) {
        const $element = $("#slider").dxSlider({
            max: 500,
            min: 0,
            value: 0,
            useInkRipple: false
        }).css("width", 500);

        const offsetX = $element.offset().left,
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

    test("smooth drag of handler", function(assert) {
        const $element = $("#slider").dxSlider({
            max: 500,
            min: 0,
            value: 0,
            step: 250,
            width: 500,
            useInkRipple: false
        });

        const $handle = $element.find("." + SLIDER_HANDLE_CLASS),
            halfHandleWidth = $handle.outerWidth() / 2,
            pointer = pointerMock($handle);

        pointer.start().down($element.offset().left).move(100);
        assert.equal($handle.position().left, 100 - halfHandleWidth);
        pointer.up();
    });

    test("value should be updated on swipestart on mobile devices", function(assert) {
        const $element = $("#slider").dxSlider({
                max: 500,
                min: 0,
                value: 0,
                width: 500,
                useInkRipple: false
            }),
            instance = $element.dxSlider("instance");

        const $handle = $element.find("." + SLIDER_WRAPPER_CLASS),
            pointer = pointerMock($handle);

        pointer.start("touch").move($element.offset().left + 300).swipeStart();
        assert.equal(instance.option("value"), 300, "value set after dxswipestart");
    });

    test("value should be updated on click on mobile devices", function(assert) {
        const $element = $("#slider").dxSlider({
                max: 500,
                min: 0,
                value: 0,
                width: 500,
                useInkRipple: false
            }),
            instance = $element.dxSlider("instance");

        const $handle = $element.find("." + SLIDER_WRAPPER_CLASS),
            pointer = pointerMock($handle);

        pointer.start("touch").move($element.offset().left + 300).click();
        assert.equal(instance.option("value"), 300, "value set after dxclick");
    });

    test("value should be correctly updated on swipestart with the step that exceeds the maximum (T831727)", function(assert) {
        const $element = $("#slider").dxSlider({
            max: 500,
            min: 0,
            value: 0,
            width: 500,
            useInkRipple: false,
            onOptionChanged: ({ component }) => {
                component.option("step", 2000);
            }
        });
        const { left: offsetX } = $element.offset();
        const $handle = $element.find(`.${SLIDER_HANDLE_CLASS}`);
        const $range = $element.find(`.${SLIDER_RANGE_CLASS}`);
        const $bar = $element.find(`.${SLIDER_BAR_CLASS}`);

        pointerMock($bar)
            .start()
            .move(offsetX)
            .down()
            .move(100)
            .move(100);

        assert.equal($handle.position().left, 500, "handle is positioned at the max");
        assert.equal($range.width(), 500, "the width of the range doesn't exceed the maximum");
    });
});

module("hidden input", () => {
    test("the hidden input should use the decimal separator specified in DevExpress.config", function(assert) {
        const originalConfig = config();
        try {
            config({ serverDecimalSeparator: "|" });

            const $element = $("#slider").dxSlider({
                    value: 12.25
                }),
                $input = $element.find("input");

            assert.equal($input.val(), "12|25", "the correct decimal separator is used");
        } finally {
            config(originalConfig);
        }
    });
});

module("the 'name' option", () => {
    test("widget input should get the 'name' attribute with a correct value", function(assert) {
        const expectedName = "some_name",
            $element = $("#slider").dxSlider({
                name: expectedName
            }),
            $input = $element.find("input");

        assert.equal($input.attr("name"), expectedName, "the input 'name' attribute has correct value");
    });
});

module("slider with tooltip", () => {
    test("tooltip default rendering", function(assert) {
        const $slider = $("#slider").dxSlider({
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

    test("'tooltip.enabled' option renders or remove tooltip", function(assert) {
        const $slider = $("#slider").dxSlider({
                tooltip: {
                    enabled: false,
                    showMode: "always"
                },
                useInkRipple: false
            }),
            $handle = $slider.find("." + SLIDER_HANDLE_CLASS);

        let $tooltip = $handle.find("." + TOOLTIP_CLASS);

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

    test("tooltip displays current value", function(assert) {
        const $slider = $("#slider").dxSlider({
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

    test("'tooltip.position' option", function(assert) {
        const $slider = $("#slider");

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

        const $handle = $slider.find("." + SLIDER_HANDLE_CLASS),
            $sliderBar = $slider.find("." + SLIDER_BAR_CLASS);

        let $tooltipContent = $handle.find("." + TOOLTIP_CONTENT_CLASS);

        const tooltipBottom = $tooltipContent.offset().top + $tooltipContent.outerHeight(),
            sliderTop = $sliderBar.offset().top;

        assert.ok($slider.hasClass("dx-slider-tooltip-position-top"));
        assert.ok(!$slider.hasClass("dx-slider-tooltip-position-bottom"));
        assert.ok(tooltipBottom < sliderTop, "tooltip bottom = " + tooltipBottom + ", slider top = " + sliderTop + " - tooltip should be display on top");

        $slider.dxSlider("option", "tooltip.position", "bottom");

        $tooltipContent = $handle.find("." + TOOLTIP_CONTENT_CLASS);

        const tooltipTop = $tooltipContent.offset().top,
            sliderBottom = $sliderBar.offset().top + $sliderBar.outerHeight();

        assert.ok(!$slider.hasClass("dx-slider-tooltip-position-top"));
        assert.ok($slider.hasClass("dx-slider-tooltip-position-bottom"));
        assert.ok(tooltipTop > sliderBottom, "tooltip top = " + tooltipTop + ", slider bottom = " + sliderBottom + " - tooltip should be display on bottom");
    });

    test("tooltip should be centered after render", function(assert) {
        const $slider = $("#slider").dxSlider({
            max: 100,
            min: 0,
            value: 50,
            tooltip: { enabled: true, showMode: "always", position: "top" },
            useInkRipple: false
        });

        const $tooltip = $slider.find("." + TOOLTIP_CONTENT_CLASS);
        const $arrow = $(".dx-popover-arrow");

        assert.equal(Math.floor(($tooltip.outerWidth() - $arrow.outerWidth()) / 2), -$tooltip.position().left + parseInt($arrow.css("margin-left").replace("px", "")), "tooltip position is centered");
    });

    test("tooltip should be fitted into slide right and left bounds", function(assert) {
        const $slider = $("#slider");

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

        const $handle = $slider.find("." + SLIDER_HANDLE_CLASS),
            $tooltipContent = $handle.find("." + TOOLTIP_CONTENT_CLASS);

        const tooltipLeft = $tooltipContent.offset().left,
            sliderLeft = $slider.offset().left;

        assert.ok(tooltipLeft >= sliderLeft, "tooltip left = " + tooltipLeft + ", slider left = " + sliderLeft);

        $slider.dxSlider("option", "value", 100);

        const tooltipRight = $tooltipContent.offset().left + $tooltipContent.outerWidth(),
            sliderRight = $slider.offset().left + $slider.outerWidth();

        assert.ok(tooltipRight <= sliderRight, "tooltip right = " + tooltipRight + ", slider right = " + sliderRight);
    });

    test("'tooltip.showMode' option", function(assert) {
        const $slider = $("#slider").dxSlider({
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

    test("tooltip was not created before slider hanlde has focus", function(assert) {
        const $slider = $("#slider").dxSlider({
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

        let $tooltip = $handle.find("." + TOOLTIP_CLASS);

        assert.ok(!$tooltip.length, "tooltip was not created");

        $slider.trigger($.Event("dxhoverstart", { target: $handle.get(0) }));

        $tooltip = $handle.find("." + TOOLTIP_CLASS);

        assert.ok(!!Tooltip.getInstance($tooltip), "tooltip was created");
    });

    test("'rtlEnabled' changing should not leads to error", function(assert) {
        assert.expect(0);

        const $slider = $("#slider").dxSlider({
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

    test("tooltip option changing when slider 'visible' = false", function(assert) {
        const $slider = $("#slider");

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

        const $handle = $slider.find("." + SLIDER_HANDLE_CLASS),
            $tooltipContent = $handle.find("." + TOOLTIP_CONTENT_CLASS),
            $sliderBar = $slider.find("." + SLIDER_BAR_CLASS);

        const tooltipBottom = $tooltipContent.offset().top + $tooltipContent.outerHeight(),
            sliderTop = $sliderBar.offset().top;

        assert.ok(tooltipBottom < sliderTop, "tooltip bottom = " + tooltipBottom + ", slider top = " + sliderTop + " - tooltip should be display on top");
    });

    test("slider tooltip should not add hideTopOverlayCallback (T104070)", function(assert) {
        const $slider = $("#slider");

        $slider.dxSlider({
            tooltip: {
                enabled: true,
                showMode: "always"
            },
            useInkRipple: false
        });

        assert.ok(!hideTopOverlayCallback.hasCallback());
    });

    test("tooltip renders correct after value length changed", function(assert) {
        if(browser.msie) {
            assert.expect(0);
            return;
        }

        const originalFX = fx.off;
        try {
            fx.off = true;
            const $slider = $("#slider").dxSlider({
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
            const $sliderHandle = $slider.find("." + SLIDER_HANDLE_CLASS);
            const $tooltipContent = $slider.find("." + TOOLTIP_CONTENT_CLASS);
            const $popupContent = $tooltipContent.find(".dx-popup-content");

            const centerSlider = $sliderHandle.offset().left + $sliderHandle.outerWidth() / 2;
            const centerTooltipContent = $tooltipContent.offset().left + $tooltipContent.outerWidth() / 2;
            assert.roughEqual(Math.abs(centerSlider), Math.abs(centerTooltipContent), 0.1, "center slider equals center tooltip");
            assert.roughEqual($tooltipContent.width(), $popupContent.outerWidth(), 2.1, "popupcontent is stretched");
        } finally {
            fx.off = originalFX;
        }
    });

    test("tooltip should repaints when repaint function called (T260971)", function(assert) {
        $("#slider").hide();

        const $slider = $("#slider").dxSlider({
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

    test("slider in scrollable should not show scroll in max position (T315618)", function(assert) {
        const sliderWidth = 400,
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

    test("arrow should be centered after dimension was changed", function(assert) {
        const $slider = $("#slider").dxSlider({
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

        const $arrow = $slider.find(".dx-popover-arrow");
        const $sliderHandle = $slider.find(".dx-slider-handle");

        assert.equal($arrow.offset().left + $arrow.outerWidth() / 2, $sliderHandle.offset().left + $sliderHandle.outerWidth() / 2, "arrow centered");
    });

    test("arrow should not go outside of the content overlay", function(assert) {
        const $slider = $("#slider").dxSlider({
            min: 0,
            max: 100,
            value: 0,
            tooltip: {
                enabled: true,
                showMode: "always"
            },
            useInkRipple: false
        });

        const $arrow = $slider.find(".dx-popover-arrow"),
            $handle = $slider.find(".dx-slider-handle"),
            $content = $slider.find(".dx-overlay-content");

        $handle.width(SLIDER_HANDLE_WIDTH);
        resizeCallbacks.fire();

        assert.equal($content.offset().left, $arrow.offset().left, "arrow was fitted");
    });
});

module("'tooltip.format' option", () => {
    test("'tooltip.format' option as function", function(assert) {
        const $slider = $("#slider").dxSlider({
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

    test("'tooltip.format' option as FormatHelper format", function(assert) {
        const $slider = $("#slider").dxSlider({
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
            $handle = $slider.find("." + SLIDER_HANDLE_CLASS);

        let $tooltip = $handle.find("." + TOOLTIP_CLASS);

        assert.equal($.trim($tooltip.text()), "0.1");
        $slider.dxSlider("option", "tooltip.format", { format: "fixedpoint", precision: 2 });

        $tooltip = $handle.find("." + TOOLTIP_CLASS);
        assert.equal($.trim($tooltip.text()), "0.12");
    });

    test("'tooltip.format' changing should re-render tooltip content", function(assert) {
        const $slider = $("#slider").dxSlider({
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
            $handle = $slider.find("." + SLIDER_HANDLE_CLASS);

        let $tooltip = $handle.find("." + TOOLTIP_CLASS);

        assert.equal($.trim($tooltip.text()), "(1)");

        $slider.dxSlider("option", "tooltip.format", function(value) {
            return "[" + value + "]";
        });

        $tooltip = $handle.find("." + TOOLTIP_CLASS);

        assert.equal($.trim($tooltip.text()), "[1]");
    });

    test("'tooltip.format' as undefined (null, false) should render value as is", function(assert) {
        const $slider = $("#slider").dxSlider({
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

    test("Update tooltip width when value is formatted", function(assert) {
        const values = ["first", "second value", "third"],
            $slider = $("#slider").dxSlider({
                min: 0,
                value: 1,
                max: 3,
                tooltip: {
                    enabled: true,
                    showMode: "always",
                    format: function(index) {
                        return values[index - 1];
                    }
                },
                useInkRipple: false
            }),
            $handle = $slider.find("." + SLIDER_HANDLE_CLASS),
            $tooltip = $handle.find("." + TOOLTIP_CLASS);

        $slider.dxSlider("option", "value", 2);
        assert.ok($tooltip.find("." + TOOLTIP_CONTENT_CLASS).width() >= $tooltip.find("." + POPUP_CONTENT_CLASS).width());
    });
});

module("labels", moduleOptions, () => {
    test("'label.visible' option toggles label visibility", function(assert) {
        const $slider = $("#slider").dxSlider({
            min: 0,
            max: 100,
            label: {
                visible: true
            },
            useInkRipple: false
        });
        let $sliderLabels = $slider.find("." + SLIDER_LABEL_CLASS);

        assert.equal($sliderLabels.length, 2, "labels are rendered");
        assert.equal($sliderLabels.eq(0).html(), "0");
        assert.equal($sliderLabels.eq(1).html(), "100");

        $slider.dxSlider("option", "label.visible", false);
        $sliderLabels = $slider.find("." + SLIDER_LABEL_CLASS);
        assert.equal($sliderLabels.length, 0, "labels are removed");
    });

    test("labels should re-rendered if 'min' or/and 'max' options changed", function(assert) {
        const $slider = $("#slider").dxSlider({
            label: {
                visible: true
            },
            useInkRipple: false
        });

        $slider.dxSlider({
            min: 1000,
            max: 2000
        });

        let $sliderLabels = $slider.find("." + SLIDER_LABEL_CLASS);
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
});

module("events", () => {
    test("value change should cause value change action call", function(assert) {
        assert.expect(1);

        const $slider = $("#slider").dxSlider({
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

    test("Changing the 'value' option must invoke the 'onValueChanged' action", function(assert) {
        const slider = $("#slider").dxSlider({
            onValueChanged: function() { assert.ok(true); },
            useInkRipple: false
        }).dxSlider("instance");
        slider.option("value", true);
    });

    test("T269867 - handle should not have active state if the 'activeStateEnabled' option is false", function(assert) {
        const $element = $("#slider").dxSlider({
                activeStateEnabled: false,
                useInkRipple: false
            }),
            $handle = $element.find(".dx-slider-handle");

        pointerMock($handle).start().down().move(250 + $element.offset().left);
        assert.ok(!$handle.hasClass("dx-state-active"), "handle should not have active state");
    });
});

module("focus policy", moduleOptions, () => {
    testInActiveWindow("Handle focus by click on track bar (T249311)", function(assert) {
        assert.expect(1);

        const $slider = $("#slider").dxSlider({
                focusStateEnabled: true,
                useInkRipple: false
            }),
            $handle = $slider.find("." + SLIDER_HANDLE_CLASS);

        $slider.trigger("dxclick");
        assert.ok($handle.hasClass("dx-state-focused"), "handle has focus class after click on track");
    });
});

module("keyboard navigation", moduleOptions, () => {
    test("control keys test", function(assert) {
        assert.expect(2);

        const $slider = $("#slider").dxSlider({
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

    test("control keys test with step", function(assert) {
        assert.expect(4);

        const $slider = $("#slider").dxSlider({
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

    test("pageUp/pageDown keys test", function(assert) {
        assert.expect(4);

        const $slider = $("#slider").dxSlider({
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

    test("control keys test for rtl", function(assert) {
        assert.expect(4);

        const $slider = $("#slider").dxSlider({
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

    test("pageUp/pageDown keys test for rtl", function(assert) {
        assert.expect(4);

        const $slider = $("#slider").dxSlider({
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

    test("T380070 - the value should not be changed on the 'left' key press if the value is min", function(assert) {
        const spy = sinon.spy(),
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

    test("T380070 - the value should not be changed on the 'right' key press if the value is max", function(assert) {
        const spy = sinon.spy(),
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
});

module("regression tests", moduleOptions, () => {
    test("change value of invisible element", function(assert) {
        const $element = $("#slider").dxSlider({
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

    test("min value behaviour", function(assert) {
        const $element = $("#slider").dxSlider({
            max: 600,
            min: 100,
            value: 200,
            useInkRipple: false
        }).css("width", 500);

        const slider = $element.dxSlider("instance");

        pointerMock($element).start().move(250 + $element.offset().left).down();
        assert.equal(slider.option("value"), 350);
    });

    test("B230095 - value is set to '0' after click on the handle", function(assert) {
        const $element = $("#slider").dxSlider({
            max: 10,
            min: 0,
            value: 5,
            useInkRipple: false
        });

        const $handle = $element.find("." + SLIDER_HANDLE_CLASS),
            handleX = $handle.offset().left + $handle.outerWidth() / 2;

        pointerMock($element.find("." + SLIDER_HANDLE_CLASS)).start().move(handleX).click();
        assert.equal($element.dxSlider("option", "value"), 5);
    });

    test("B232111, B233180 - disabled state doesn't work", function(assert) {
        const $element = $("#slider").dxSlider({
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

    test("B233256 - incorrect options", function(assert) {
        const $element = $("#slider").dxSlider({
                min: 0,
                value: 50,
                max: 100,
                useInkRipple: false
            }),
            slider = $element.dxSlider("instance");

        slider.option("min", 110);

        assert.expect(0);
    });

    test("B233288 - incorrect behavior when swipe on handle", function(assert) {
        const $element = $("#slider")
            .css("width", 500)
            .dxSlider({
                max: 500,
                min: 0,
                value: 250,
                useInkRipple: false
            });

        const $handle = $element.find("." + SLIDER_HANDLE_CLASS),
            handleX = $handle.offset().left + $handle.outerWidth() / 2,
            instance = $element.dxSlider("instance");

        assert.equal(instance.option("value"), 250);
        pointerMock($handle).start().move(handleX).down().move(2).up();
        assert.equal(instance.option("value"), 252);
    });

    test("B234545 dxRangeSlider/dxSlider - incorrect behavior with negative min and max values.", function(assert) {
        const $element = $("#slider").css("width", 960);

        $element.dxSlider({
            max: 100,
            min: 0,
            value: 0,
            useInkRipple: false
        });

        const slider = $element.dxSlider("instance");

        const $range = $element.find("." + SLIDER_RANGE_CLASS);

        slider.option("min", -10);
        slider.option("max", -10);

        assert.equal(slider.option("value"), -10);
        assert.equal($range.width(), 0);
    });

    test("B234766 dxSlider - incorrect value calculation with fractional step", function(assert) {
        const $element = $("#slider").css("width", 960);

        $element.dxSlider({
            max: 100,
            min: 0,
            value: 0,
            useInkRipple: false
        });

        const slider = $element.dxSlider("instance");

        const $handle = $element.find("." + SLIDER_HANDLE_CLASS),
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

    test("incorrect when step is NAN or empty string", function(assert) {
        const $element = $("#slider")
                .css("width", 500)
                .dxSlider({
                    max: 500,
                    min: 0,
                    value: 250,
                    useInkRipple: false
                }),
            slider = $element.dxSlider("instance");

        slider.option("step", "NANstring");

        const $handle = $element.find("." + SLIDER_HANDLE_CLASS),
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

    test("Q374462 dxSlider - It is impossible to set the step option to the float value", function(assert) {
        const $element = $("#slider")
                .css("width", 100)
                .dxSlider({
                    max: 1,
                    min: -1,
                    value: 0,
                    useInkRipple: false
                }),
            slider = $element.dxSlider("instance");

        slider.option("step", 0.01);
        const $handle = $element.find("." + SLIDER_HANDLE_CLASS),
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

    test("step depends on min value after swipe", function(assert) {
        const $element = $("#slider")
                .css("width", 150)
                .dxSlider({
                    max: 2,
                    min: 0.5,
                    value: 0.5,
                    step: 1,
                    useInkRipple: false
                }),
            slider = $element.dxSlider("instance");

        const $handle = $element.find("." + SLIDER_HANDLE_CLASS),
            handleX = $handle.offset().left + $handle.outerWidth() / 2;

        pointerMock($handle).start().move(handleX).down().move(100).up();
        assert.equal(slider.option("value"), 1.5, "step depends min value");
    });

    test("'repaint' method should not leads to error if 'tooltip.enabled' is true", function(assert) {
        assert.expect(0);

        const $element = $("#slider"),
            slider = $element.dxSlider({
                tooltip: {
                    enabled: true,
                    showMode: "always"
                },
                useInkRipple: false
            }).dxSlider("instance");

        slider.repaint();
    });

    test("The error should not be thrown if value is null", function(assert) {
        try {
            const slider = $("#slider").dxSlider({
                value: null
            }).dxSlider("instance");

            slider.option("value", 100);

            assert.ok(true, "The error doesn't be thrown");
        } catch(e) {
            assert.ok(false, e);
        }
    });

    test("Value is not jumping when the slider handler is moved", function(assert) {
        const left = $("#qunit-fixture").css("left");

        $("#qunit-fixture").css("left", "0px");
        const $element = $("#slider").dxSlider({
            min: 0,
            max: 3,
            width: 500,
            value: 0
        });

        const $handle = $element.find("." + SLIDER_HANDLE_CLASS),
            mouse = pointerMock($handle);

        mouse.start().down();
        this.clock.tick(FEEDBACK_SHOW_TIMEOUT);

        mouse.move(99);

        const $range = $element.find("." + SLIDER_RANGE_CLASS);
        assert.ok($range.width() < 160, "range width is not jumping");

        mouse.up();
        this.clock.tick(FEEDBACK_HIDE_TIMEOUT);

        $("#qunit-fixture").css("left", left);
    });
});

module("RTL", moduleOptions, () => {
    test("render value", function(assert) {
        const $element = $("#slider").css("width", 960);

        $element.dxSlider({
            max: 100,
            min: 0,
            value: 0,
            rtlEnabled: true,
            useInkRipple: false
        });

        const slider = $element.dxSlider("instance"),
            $range = $element.find("." + SLIDER_RANGE_CLASS);

        assert.equal($range.position().left, 960);

        slider.option("value", 100);

        assert.equal($range.position().left, 0);
    });

    test("mousedown/touchstart on slider set new value", function(assert) {
        const $element = $("#slider").dxSlider({
            max: 500,
            min: 0,
            value: 0,
            rtlEnabled: true,
            useInkRipple: false
        }).css("width", 500);

        const $range = $element.find("." + SLIDER_RANGE_CLASS);

        pointerMock($element).start().move(250 + $element.offset().left).down();
        assert.equal($range.width(), 250);

        pointerMock($element).start().move(350 + $element.offset().left).down();
        assert.equal($range.width(), 150);
    });
});

module("visibility change", () => {
    test("tooltip should be centered after visibility changed", function(assert) {
        const $slider = $("#slider");
        const $parent = $slider.parent();

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

        const $tooltip = $slider.find("." + TOOLTIP_CONTENT_CLASS);
        const $arrow = $(".dx-popover-arrow");

        assert.equal(Math.floor(($tooltip.outerWidth() - $arrow.outerWidth()) / 2), -$tooltip.position().left + parseInt($arrow.css("margin-left").replace("px", "")), "tooltip position is centered");
    });
});

module("validation", () => {
    testInActiveWindow("add the CSS class on the focusIn event for show a validation message", function(assert) {
        const $slider = $("#slider");
        $slider.dxSlider({
            max: 100,
            min: 0,
            value: 50,
            isValid: false,
            validationError: { message: "Test message" }
        });

        $slider.find(`.${ SLIDER_HANDLE_CLASS }`).first().trigger("focusin");

        assert.ok($slider.hasClass(INVALID_MESSAGE_VISIBLE_CLASS));
        assert.equal($(".dx-overlay-wrapper.dx-invalid-message").css("visibility"), "visible", "validation message is shown");
    });

    testInActiveWindow("remove the CSS class on the focusOut event for hide a validation message", function(assert) {
        const $slider = $("#slider");
        $slider.dxSlider({
            max: 100,
            min: 0,
            value: 50,
            isValid: false,
            validationError: { message: "Test message" }
        });

        const handle = $slider.find(`.${ SLIDER_HANDLE_CLASS }`).first();
        handle.trigger("focusin");
        handle.trigger("focusout");

        assert.notOk($slider.hasClass(INVALID_MESSAGE_VISIBLE_CLASS));
        assert.equal($(".dx-overlay-wrapper.dx-invalid-message").css("visibility"), "hidden", "validation message is hidden");
    });

    testInActiveWindow("validation message should be hidden once focusStateEnabled option switch off", function(assert) {
        const $slider = $("#slider");
        const instance = $slider.dxSlider({
            max: 100,
            min: 0,
            value: 50,
            isValid: false,
            validationError: { message: "Test message" }
        }).dxSlider("instance");
        const handle = $slider.find(`.${ SLIDER_HANDLE_CLASS }`).first();

        handle.trigger("focusin");
        instance.option("focusStateEnabled", false);

        assert.notOk($slider.hasClass(INVALID_MESSAGE_VISIBLE_CLASS));
        assert.strictEqual($(".dx-overlay-wrapper.dx-invalid-message").css("visibility"), "hidden", "validation message is hidden");
    });
});
