import fx from 'animation/fx';
import positionUtils from 'animation/position';
import 'common.css!';
import 'generic_light.css!';
import config from 'core/config';
import browser from 'core/utils/browser';
import resizeCallbacks from 'core/utils/resize_callbacks';
import { triggerShownEvent } from 'events/visibility_change';
import $ from 'jquery';
import { hideCallback as hideTopOverlayCallback } from 'mobile/hide_callback';
import 'ui/slider';
import Tooltip from 'ui/tooltip';
import keyboardMock from '../../helpers/keyboardMock.js';
import pointerMock from '../../helpers/pointerMock.js';


const { module, testStart, test, testInActiveWindow } = QUnit;
const SLIDER_PADDING = 7;

testStart(() => {
    const markup =
        `<div id="slider"></div>
        <div id="widget"></div>
        <div id="widthRootStyle" style="width: 300px;"></div>`;

    $('#qunit-fixture').html(markup);
});

const SLIDER_CLASS = 'dx-slider';
const SLIDER_WRAPPER_CLASS = SLIDER_CLASS + '-wrapper';
const SLIDER_LABEL_POSITION_CLASS_PREFIX = SLIDER_CLASS + '-label-position-';
const SLIDER_RANGE_CLASS = SLIDER_CLASS + '-range';
const SLIDER_BAR_CLASS = SLIDER_CLASS + '-bar';
const SLIDER_HANDLE_CLASS = SLIDER_CLASS + '-handle';
const SLIDER_LABEL_CLASS = SLIDER_CLASS + '-label';

const ACTIVE_STATE_CLASS = 'dx-state-active';
const FEEDBACK_SHOW_TIMEOUT = 30;
const FEEDBACK_HIDE_TIMEOUT = 400;
const SLIDER_HANDLE_WIDTH = 14;

const POPUP_CONTENT_CLASS = 'dx-popup-content';

const TOOLTIP_CLASS = 'dx-tooltip';
const TOOLTIP_CONTENT_CLASS = 'dx-overlay-content';

const INVALID_MESSAGE_VISIBLE_CLASS = 'dx-invalid-message-visible';

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

const handlePositionAgainstTrackBar = ($handle) => {
    const $range = $handle.parent();
    const rangeBorderWidth = parseInt($range.css('borderLeftWidth'));
    const positionAgainstRange = $handle.position();
    const handleHalfWidth = $handle.outerWidth() / 2;
    const handleHalfHeight = $handle.outerHeight() / 2;

    return {
        left: positionAgainstRange.left + rangeBorderWidth + handleHalfWidth,
        top: positionAgainstRange.top + rangeBorderWidth + handleHalfHeight
    };
};

module('render', moduleOptions, () => {
    test('default size', function(assert) {
        const $element = $('#widget').dxSlider({
            useInkRipple: false
        });

        assert.ok($element.outerWidth() > 0, 'outer width of the element must be more than zero');
    });

    test('onContentReady fired after the widget is fully ready', function(assert) {
        assert.expect(2);
        const position = 'top';

        $('#slider').dxSlider({
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

    test('Resize by option', function(assert) {
        const setUpWidth = 11;
        const setUpHeight = 22;
        const increment = 123;
        const $slider = $('#slider').dxSlider({
            max: 100,
            min: 0,
            width: setUpWidth,
            height: setUpHeight,
            useInkRipple: false
        });
        const slider = $slider.dxSlider('instance');
        const initialWidth = $slider.width();
        const initialHeight = $slider.height();

        assert.equal(initialWidth, setUpWidth, 'Element\'s width was set properly on init');
        assert.equal(initialHeight, setUpHeight, 'Element\'s height was et properly on init');

        slider.option('width', initialWidth + increment);
        slider.option('height', initialHeight + increment);

        assert.equal($slider.width() - initialWidth, increment, 'Element\'s width was set properly on resize');
        assert.equal($slider.height() - initialHeight, increment, 'Element\'s height was set properly on resize');
    });

    test('check range-slide width after resize', function(assert) {
        const setUpWidth = 100;
        const decrement = 0.7 * setUpWidth;
        const $slider = $('#slider').dxSlider({
            max: 100,
            min: 0,
            width: setUpWidth,
            useInkRipple: false
        });
        const slider = $slider.dxSlider('instance');

        slider.option('width', setUpWidth - decrement);
        const $range = $slider.find('.' + SLIDER_RANGE_CLASS);

        assert.ok($range.width() < $slider.width(), 'range width is correct');
    });

    test('mousedown/touchstart on slider set new value (B233178)', function(assert) {
        const $element = $('#slider').dxSlider({
            max: 500,
            min: 0,
            value: 0,
            useInkRipple: false
        }).css('width', 500 + 2 * SLIDER_PADDING);

        const $handle = $element.find(`.${SLIDER_HANDLE_CLASS}`);
        const $range = $element.find('.' + SLIDER_RANGE_CLASS);

        pointerMock($element).start({ x: SLIDER_PADDING }).move(250 + $element.offset().left).down();
        assert.equal(handlePositionAgainstTrackBar($handle).left, 250);
        assert.equal($range.width(), 250);

        pointerMock($element).start({ x: SLIDER_PADDING }).move(350 + $element.offset().left).down();
        assert.equal(handlePositionAgainstTrackBar($handle).left, 350);
        assert.equal($range.width(), 350);
    });

    test('slider doesn\'t turn off feedback during gesture', function(assert) {
        const $element = $('#slider').dxSlider({
            max: 500,
            min: 0,
            value: 0,
            useInkRipple: false
        }).css('width', 500);

        const $handle = $element.find(`.${SLIDER_HANDLE_CLASS}`);
        const mouse = pointerMock($handle);

        assert.equal($handle.hasClass(ACTIVE_STATE_CLASS), false, 'feedback off before start');
        mouse.start().down();
        this.clock.tick(FEEDBACK_SHOW_TIMEOUT);
        assert.ok($handle.hasClass(ACTIVE_STATE_CLASS), 'feedback on gesture start');

        mouse.move(100);
        assert.equal($handle.hasClass(ACTIVE_STATE_CLASS), true, 'feedback stays on after gesture start');

        mouse.up();
        this.clock.tick(FEEDBACK_HIDE_TIMEOUT);
        assert.ok(!$handle.hasClass(ACTIVE_STATE_CLASS), 'feedback off after gesture end');
    });

    test('slider should not turn off feedback during second gesture', function(assert) {
        const $element = $('#slider').dxSlider({
            max: 500,
            min: 0,
            value: 100,
            width: 500,
            useInkRipple: false
        });

        const $handle = $element.find(`.${SLIDER_HANDLE_CLASS}`);
        const pointer = pointerMock($handle);

        pointer.start().down().move(100).up();
        pointer.down().move(-100);
        this.clock.tick(FEEDBACK_HIDE_TIMEOUT);
        assert.ok($handle.hasClass(ACTIVE_STATE_CLASS), 'handle is active during swipe');
        pointer.up();
    });

    test('slider should turn off feedback after several gestures', function(assert) {
        const $element = $('#slider').dxSlider({
            max: 500,
            min: 0,
            value: 100,
            width: 500,
            useInkRipple: false
        });

        const $handle = $element.find(`.${SLIDER_HANDLE_CLASS}`);
        const pointer = pointerMock($handle);

        pointer.start().down().move(100).up();
        pointer.down().move(-100);
        this.clock.tick(FEEDBACK_HIDE_TIMEOUT);
        pointer.up().down().move(-100).up();
        this.clock.tick(FEEDBACK_HIDE_TIMEOUT);

        assert.ok(!$handle.hasClass(ACTIVE_STATE_CLASS), 'handle isn\'t active after swipe');
    });

    test('slider doesn\'t turn off feedback after sliding in vertical direction', function(assert) {
        const $element = $('#slider').dxSlider({
            max: 500,
            min: 0,
            value: 0,
            useInkRipple: false
        }).css('width', 500);

        const $handle = $element.find(`.${SLIDER_HANDLE_CLASS}`);
        const mouse = pointerMock($handle);

        assert.equal($handle.hasClass(ACTIVE_STATE_CLASS), false, 'feedback off before start');

        mouse.start().down();

        this.clock.tick(FEEDBACK_SHOW_TIMEOUT);
        assert.ok($handle.hasClass(ACTIVE_STATE_CLASS), 'feedback on gesture start');

        mouse
            .move(0, 1)
            .move(1);

        assert.ok($handle.hasClass(ACTIVE_STATE_CLASS), 'feedback turned on');

        mouse.up();
        this.clock.tick(FEEDBACK_HIDE_TIMEOUT);
        assert.ok(!$handle.hasClass(ACTIVE_STATE_CLASS), 'feedback turned off');
    });

    test('drag handler', function(assert) {
        // the width of the right and left margin must be 0 (T927984)
        const styles = $('<style>.dx-slider-bar{margin: 14px 0px;}</style>').appendTo($('head'));
        const $element = $('#slider').dxSlider({
            max: 500,
            min: 0,
            value: 0,
            useInkRipple: false
        }).css('width', 500);

        const $handle = $element.find('.' + SLIDER_HANDLE_CLASS);
        const $range = $element.find('.' + SLIDER_RANGE_CLASS);
        const $bar = $element.find('.' + SLIDER_BAR_CLASS);
        const offsetX = $element.offset().left;

        pointerMock($bar).start().move(offsetX).down().move(250).up();
        assert.equal(handlePositionAgainstTrackBar($handle).left, 250);
        assert.equal($range.width(), 250);

        pointerMock($bar).start().down().move(500 + $handle.outerWidth() / 2).up();
        assert.equal(handlePositionAgainstTrackBar($handle).left, 500);
        assert.equal($range.width(), 500);
        styles.remove();
    });

    test('smooth drag of handler', function(assert) {
        // the width of the right and left margin must be 0 (T927984)
        const styles = $('<style>.dx-slider-bar{margin: 14px 0px;}</style>').appendTo($('head'));
        const $element = $('#slider').dxSlider({
            max: 500,
            min: 0,
            value: 0,
            step: 250,
            width: 500,
            useInkRipple: false
        });

        const $handle = $element.find('.' + SLIDER_HANDLE_CLASS);
        const $range = $element.find('.' + SLIDER_RANGE_CLASS);
        const pointer = pointerMock($handle);

        pointer.start().down($range.offset().left).move(100);
        assert.equal(handlePositionAgainstTrackBar($handle).left, 100);
        pointer.up();
        styles.remove();
    });

    test('value should be updated on swipestart on mobile devices', function(assert) {
        const $element = $('#slider').dxSlider({
            max: 500,
            min: 0,
            value: 0,
            width: 500 + 2 * SLIDER_PADDING,
            useInkRipple: false
        });
        const instance = $element.dxSlider('instance');

        const $handle = $element.find('.' + SLIDER_WRAPPER_CLASS);
        const pointer = pointerMock($handle);

        pointer.start({ pointerType: 'touch', x: SLIDER_PADDING }).move($element.offset().left + 300).swipeStart();
        assert.equal(instance.option('value'), 300, 'value set after dxswipestart');
    });

    test('value should be updated on click on mobile devices', function(assert) {
        const $element = $('#slider').dxSlider({
            max: 500,
            min: 0,
            value: 0,
            width: 500 + 2 * SLIDER_PADDING,
            useInkRipple: false
        });
        const instance = $element.dxSlider('instance');

        const $handle = $element.find('.' + SLIDER_WRAPPER_CLASS);
        const pointer = pointerMock($handle);

        pointer.start({ pointerType: 'touch', x: SLIDER_PADDING }).move($element.offset().left + 300).click();
        assert.equal(instance.option('value'), 300, 'value set after dxclick');
    });

    test('value should be correctly updated on swipestart with the step that exceeds the maximum (T831727)', function(assert) {
        const $element = $('#slider').dxSlider({
            max: 500,
            min: 0,
            value: 0,
            width: 500 + 2 * SLIDER_PADDING,
            useInkRipple: false,
            onOptionChanged: ({ component, name }) =>
                name === 'value' && component.option('step', 2000)
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

        assert.equal(handlePositionAgainstTrackBar($handle).left, 500, 'handle is positioned at the max');
        assert.equal($range.width(), 500, 'the width of the range doesn\'t exceed the maximum');
    });
});

module('hidden input', () => {
    test('the hidden input should use the decimal separator specified in DevExpress.config', function(assert) {
        const originalConfig = config();
        try {
            config({ serverDecimalSeparator: '|' });

            const $element = $('#slider').dxSlider({
                value: 12.25
            });
            const $input = $element.find('input');

            assert.equal($input.val(), '12|25', 'the correct decimal separator is used');
        } finally {
            config(originalConfig);
        }
    });
});

module('the \'name\' option', () => {
    test('widget input should get the \'name\' attribute with a correct value', function(assert) {
        const expectedName = 'some_name';
        const $element = $('#slider').dxSlider({
            name: expectedName
        });
        const $input = $element.find('input');

        assert.equal($input.attr('name'), expectedName, 'the input \'name\' attribute has correct value');
    });
});

module('slider with tooltip', () => {
    test('tooltip default rendering', function(assert) {
        const $slider = $('#slider').dxSlider({
            tooltip: {
                enabled: true,
                showMode: 'always'
            },
            useInkRipple: false
        });

        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);
        const $tooltip = $handle.find('.' + TOOLTIP_CLASS);

        assert.ok($tooltip.length);
        assert.ok(Tooltip.getInstance($tooltip));
    });

    test('\'tooltip.enabled\' option renders or remove tooltip', function(assert) {
        const $slider = $('#slider').dxSlider({
            tooltip: {
                enabled: false,
                showMode: 'always'
            },
            useInkRipple: false
        });
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);

        let $tooltip = $handle.find('.' + TOOLTIP_CLASS);

        assert.ok(!$tooltip.length);
        assert.ok(!$slider.hasClass('dx-slider-tooltip-position-top') && !$slider.hasClass('dx-slider-tooltip-position-bottom'));

        $slider.dxSlider('option', 'tooltip.enabled', true);
        $tooltip = $handle.find('.' + TOOLTIP_CLASS);
        assert.ok($tooltip.length);
        assert.ok($slider.hasClass('dx-slider-tooltip-position-top') || $slider.hasClass('dx-slider-tooltip-position-bottom'));

        $slider.dxSlider('option', 'tooltip.enabled', false);
        $tooltip = $handle.find('.' + TOOLTIP_CLASS);
        assert.ok(!$tooltip.length);
        assert.ok(!$slider.hasClass('dx-slider-tooltip-position-top') && !$slider.hasClass('dx-slider-tooltip-position-bottom'));
    });

    test('tooltip displays current value', function(assert) {
        const $slider = $('#slider').dxSlider({
            min: 0,
            value: 50,
            max: 100,
            tooltip: {
                enabled: true,
                showMode: 'always'
            },
            useInkRipple: false
        });
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);
        const $tooltip = $handle.find('.' + TOOLTIP_CLASS);

        assert.equal($.trim($tooltip.text()), '50');

        $slider.dxSlider('option', 'value', 75);
        assert.equal($.trim($tooltip.text()), 75);
    });

    test('\'tooltip.position\' option', function(assert) {
        const $slider = $('#slider');

        positionUtils.setup($slider, {
            my: 'center',
            at: 'center',
            of: window
        });

        $slider.css('position', 'absolute');

        $slider.dxSlider({
            tooltip: {
                enabled: true,
                showMode: 'always',
                position: 'top'
            },
            useInkRipple: false
        });

        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);
        const $sliderBar = $slider.find('.' + SLIDER_BAR_CLASS);

        let $tooltipContent = $handle.find('.' + TOOLTIP_CONTENT_CLASS);

        const tooltipBottom = $tooltipContent.offset().top + $tooltipContent.outerHeight();
        const sliderTop = $sliderBar.offset().top;

        assert.ok($slider.hasClass('dx-slider-tooltip-position-top'));
        assert.ok(!$slider.hasClass('dx-slider-tooltip-position-bottom'));
        assert.ok(tooltipBottom < sliderTop, 'tooltip bottom = ' + tooltipBottom + ', slider top = ' + sliderTop + ' - tooltip should be display on top');

        $slider.dxSlider('option', 'tooltip.position', 'bottom');

        $tooltipContent = $handle.find('.' + TOOLTIP_CONTENT_CLASS);

        const tooltipTop = $tooltipContent.offset().top;
        const sliderBottom = $sliderBar.offset().top + $sliderBar.outerHeight();

        assert.ok(!$slider.hasClass('dx-slider-tooltip-position-top'));
        assert.ok($slider.hasClass('dx-slider-tooltip-position-bottom'));
        assert.ok(tooltipTop > sliderBottom, 'tooltip top = ' + tooltipTop + ', slider bottom = ' + sliderBottom + ' - tooltip should be display on bottom');
    });

    test('tooltip should be centered after render', function(assert) {
        const $slider = $('#slider').dxSlider({
            max: 100,
            min: 0,
            value: 50,
            tooltip: { enabled: true, showMode: 'always', position: 'top' },
            useInkRipple: false
        });

        const $tooltip = $slider.find('.' + TOOLTIP_CONTENT_CLASS);
        const $handle = $slider.find('.' + SLIDER_HANDLE_CLASS);

        const tooltipWidth = $tooltip.outerWidth();
        const tooltipCenter = tooltipWidth / 2;
        const tooltipOffsetAgainstHandle = Math.abs($tooltip.position().left) + $handle.width() / 2;

        assert.equal(tooltipCenter, tooltipOffsetAgainstHandle, 'tooltip position is centered');
    });

    test('tooltip should be fitted into slide right and left bounds', function(assert) {
        const $slider = $('#slider');

        positionUtils.setup($slider, {
            my: 'center',
            at: 'center',
            of: window
        });

        $slider.dxSlider({
            value: 0,
            min: 0,
            max: 100,
            tooltip: {
                enabled: true,
                showMode: 'always'
            },
            useInkRipple: false
        });

        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);
        const $tooltipContent = $handle.find('.' + TOOLTIP_CONTENT_CLASS);

        const tooltipLeft = $tooltipContent.offset().left;
        const sliderLeft = $slider.offset().left;

        assert.ok(tooltipLeft >= sliderLeft, 'tooltip left = ' + tooltipLeft + ', slider left = ' + sliderLeft);

        $slider.dxSlider('option', 'value', 100);

        const tooltipRight = $tooltipContent.offset().left + $tooltipContent.outerWidth();
        const sliderRight = $slider.offset().left + $slider.outerWidth();

        assert.ok(tooltipRight <= sliderRight, 'tooltip right = ' + tooltipRight + ', slider right = ' + sliderRight);
    });

    test('\'tooltip.showMode\' option', function(assert) {
        const $slider = $('#slider').dxSlider({
            min: 0,
            value: 50,
            max: 100,
            tooltip: {
                enabled: true,
                showMode: 'onhover'
            },
            useInkRipple: false
        });
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);

        assert.ok($handle.hasClass('dx-slider-tooltip-on-hover'));

        $slider.dxSlider('option', 'tooltip.showMode', 'always');
        assert.ok(!$handle.hasClass('dx-slider-tooltip-on-hover'));
    });

    test('tooltip was not created before slider hanlde has focus', function(assert) {
        const $slider = $('#slider').dxSlider({
            min: 0,
            value: 50,
            max: 100,
            tooltip: {
                enabled: true,
                showMode: 'onHover'
            },
            useInkRipple: false
        });
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);

        let $tooltip = $handle.find('.' + TOOLTIP_CLASS);

        assert.ok(!$tooltip.length, 'tooltip was not created');

        $slider.trigger($.Event('dxhoverstart', { target: $handle.get(0) }));

        $tooltip = $handle.find('.' + TOOLTIP_CLASS);

        assert.ok(!!Tooltip.getInstance($tooltip), 'tooltip was created');
    });

    test('\'rtlEnabled\' changing should not leads to error', function(assert) {
        assert.expect(0);

        const $slider = $('#slider').dxSlider({
            rtlEnabled: false,
            tooltip: {
                enabled: true,
                showMode: 'onhover'
            },
            useInkRipple: false
        });

        $slider.dxSlider({
            rtlEnabled: true
        });
    });

    test('tooltip option changing when slider \'visible\' = false', function(assert) {
        const $slider = $('#slider');

        positionUtils.setup($slider, {
            my: 'center',
            at: 'center',
            of: window
        });

        $slider.css('position', 'absolute');

        $slider.dxSlider({
            visible: false,
            useInkRipple: false
        });
        $slider.dxSlider({
            tooltip: {
                enabled: true,
                position: 'top',
                showMode: 'always'
            }
        });

        $slider.dxSlider({ visible: true });

        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);
        const $tooltipContent = $handle.find('.' + TOOLTIP_CONTENT_CLASS);
        const $sliderBar = $slider.find('.' + SLIDER_BAR_CLASS);

        const tooltipBottom = $tooltipContent.offset().top + $tooltipContent.outerHeight();
        const sliderTop = $sliderBar.offset().top;

        assert.ok(tooltipBottom < sliderTop, 'tooltip bottom = ' + tooltipBottom + ', slider top = ' + sliderTop + ' - tooltip should be display on top');
    });

    test('slider tooltip should not add hideTopOverlayCallback (T104070)', function(assert) {
        const $slider = $('#slider');

        $slider.dxSlider({
            tooltip: {
                enabled: true,
                showMode: 'always'
            },
            useInkRipple: false
        });

        assert.ok(!hideTopOverlayCallback.hasCallback());
    });

    test('tooltip renders correct after value length changed', function(assert) {
        if(browser.msie) {
            assert.expect(0);
            return;
        }

        const originalFX = fx.off;
        try {
            fx.off = true;
            const $slider = $('#slider').dxSlider({
                min: -1000000,
                max: 1000000,
                value: 0,
                width: 2000,
                tooltip: {
                    enabled: true,
                    position: 'top',
                    showMode: 'always'
                },
                useInkRipple: false
            });

            $slider.dxSlider('option', 'value', 500000);
            const $sliderHandle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);
            const $tooltipContent = $slider.find('.' + TOOLTIP_CONTENT_CLASS);
            const $popupContent = $tooltipContent.find('.dx-popup-content');

            const centerSlider = $sliderHandle.offset().left + $sliderHandle.outerWidth() / 2;
            const centerTooltipContent = $tooltipContent.offset().left + $tooltipContent.outerWidth() / 2;
            assert.roughEqual(Math.abs(centerSlider), Math.abs(centerTooltipContent), 0.1, 'center slider equals center tooltip');
            assert.roughEqual($tooltipContent.width(), $popupContent.outerWidth(), 2.1, 'popupcontent is stretched');
        } finally {
            fx.off = originalFX;
        }
    });

    test('tooltip should repaints when repaint function called (T260971)', function(assert) {
        $('#slider').hide();

        const $slider = $('#slider').dxSlider({
            min: 0,
            max: 100,
            value: 50,
            width: 2000,
            tooltip: {
                enabled: true,
                position: 'top',
                showMode: 'always'
            },
            useInkRipple: false
        });
        const instance = $slider.dxSlider('instance');

        $('#slider').show();

        instance.repaint();
        assert.ok($slider.find('.dx-tooltip .dx-overlay-content').length, 'tooltip is exist');
    });

    test('slider in scrollable should not show scroll in max position (T315618)', function(assert) {
        const sliderWidth = 400;
        const $slider = $('#slider').dxSlider({
            min: 0,
            max: 100,
            value: 100,
            width: sliderWidth,
            tooltip: {
                enabled: true,
                position: 'bottom',
                showMode: 'always'
            },
            useInkRipple: false
        });
        const $tooltipContent = $slider.find('.' + TOOLTIP_CONTENT_CLASS);
        const tooltipRightBorder = $tooltipContent.offset().left + $tooltipContent.outerWidth() - $slider.offset().left;
        const boundaryOffset = sliderWidth - tooltipRightBorder;

        assert.equal(boundaryOffset, 2, 'tooltip content should have correct boundary offset');
    });

    test('arrow should be centered after dimension was changed', function(assert) {
        const $slider = $('#slider').dxSlider({
            min: 0,
            max: 100,
            value: 50,
            tooltip: {
                enabled: true,
                showMode: 'always'
            },
            useInkRipple: false
        });

        resizeCallbacks.fire();

        const $arrow = $slider.find('.dx-popover-arrow');
        const $sliderHandle = $slider.find('.dx-slider-handle');

        assert.equal($arrow.offset().left + $arrow.outerWidth() / 2, $sliderHandle.offset().left + $sliderHandle.outerWidth() / 2, 'arrow centered');
    });

    test('arrow should not go outside of the content overlay', function(assert) {
        const $slider = $('#slider').dxSlider({
            min: 0,
            max: 100,
            value: 0,
            tooltip: {
                enabled: true,
                showMode: 'always'
            },
            useInkRipple: false
        });

        const $arrow = $slider.find('.dx-popover-arrow');
        const $handle = $slider.find('.dx-slider-handle');
        const $content = $slider.find('.dx-overlay-content');

        $handle.width(SLIDER_HANDLE_WIDTH);
        resizeCallbacks.fire();

        assert.equal($content.offset().left, $arrow.offset().left, 'arrow was fitted');
    });
});

module('\'tooltip.format\' option', () => {
    test('\'tooltip.format\' option as function', function(assert) {
        const $slider = $('#slider').dxSlider({
            min: 0,
            value: 50,
            max: 100,
            tooltip: {
                enabled: true,
                showMode: 'always',
                format: function(value) {
                    return '$' + value;
                }
            },
            useInkRipple: false
        });
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);
        const $tooltip = $handle.find('.' + TOOLTIP_CLASS);

        assert.equal($.trim($tooltip.text()), '$50');

        $slider.dxSlider('option', 'value', 75);
        assert.equal($.trim($tooltip.text()), '$75');
    });

    test('\'tooltip.format\' option as FormatHelper format', function(assert) {
        const $slider = $('#slider').dxSlider({
            min: 0,
            value: 0.12345,
            max: 1,
            tooltip: {
                enabled: true,
                showMode: 'always',
                format: { type: 'fixedpoint', precision: 1 }
            },
            useInkRipple: false
        });
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);

        let $tooltip = $handle.find('.' + TOOLTIP_CLASS);

        assert.equal($.trim($tooltip.text()), '0.1');
        $slider.dxSlider('option', 'tooltip.format', { format: 'fixedpoint', precision: 2 });

        $tooltip = $handle.find('.' + TOOLTIP_CLASS);
        assert.equal($.trim($tooltip.text()), '0.12');
    });

    test('\'tooltip.format\' changing should re-render tooltip content', function(assert) {
        const $slider = $('#slider').dxSlider({
            min: 0,
            value: 1,
            max: 1,
            tooltip: {
                enabled: true,
                showMode: 'always',
                format: function(value) {
                    return '(' + value + ')';
                }
            },
            useInkRipple: false
        });
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);

        let $tooltip = $handle.find('.' + TOOLTIP_CLASS);

        assert.equal($.trim($tooltip.text()), '(1)');

        $slider.dxSlider('option', 'tooltip.format', function(value) {
            return '[' + value + ']';
        });

        $tooltip = $handle.find('.' + TOOLTIP_CLASS);

        assert.equal($.trim($tooltip.text()), '[1]');
    });

    test('\'tooltip.format\' as undefined (null, false) should render value as is', function(assert) {
        const $slider = $('#slider').dxSlider({
            min: 0,
            value: 1,
            max: 1,
            tooltip: {
                enabled: true,
                showMode: 'always',
                format: null
            },
            useInkRipple: false
        });
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);
        const $tooltip = $handle.find('.' + TOOLTIP_CLASS);

        assert.equal($.trim($tooltip.text()), '1');
    });

    test('Update tooltip width when value is formatted', function(assert) {
        const values = ['first', 'second value', 'third'];
        const $slider = $('#slider').dxSlider({
            min: 0,
            value: 1,
            max: 3,
            tooltip: {
                enabled: true,
                showMode: 'always',
                format: function(index) {
                    return values[index - 1];
                }
            },
            useInkRipple: false
        });
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);
        const $tooltip = $handle.find('.' + TOOLTIP_CLASS);

        $slider.dxSlider('option', 'value', 2);
        assert.ok($tooltip.find('.' + TOOLTIP_CONTENT_CLASS).width() >= $tooltip.find('.' + POPUP_CONTENT_CLASS).width());
    });
});

module('labels', moduleOptions, () => {
    test('\'label.visible\' option toggles label visibility', function(assert) {
        const $slider = $('#slider').dxSlider({
            min: 0,
            max: 100,
            label: {
                visible: true
            },
            useInkRipple: false
        });
        let $sliderLabels = $slider.find('.' + SLIDER_LABEL_CLASS);

        assert.equal($sliderLabels.length, 2, 'labels are rendered');
        assert.equal($sliderLabels.eq(0).html(), '0');
        assert.equal($sliderLabels.eq(1).html(), '100');

        $slider.dxSlider('option', 'label.visible', false);
        $sliderLabels = $slider.find('.' + SLIDER_LABEL_CLASS);
        assert.equal($sliderLabels.length, 0, 'labels are removed');
    });

    test('labels should re-rendered if \'min\' or/and \'max\' options changed', function(assert) {
        const $slider = $('#slider').dxSlider({
            label: {
                visible: true
            },
            useInkRipple: false
        });

        $slider.dxSlider({
            min: 1000,
            max: 2000
        });

        let $sliderLabels = $slider.find('.' + SLIDER_LABEL_CLASS);
        assert.equal($sliderLabels.eq(0).html(), '1000');
        assert.equal($sliderLabels.eq(1).html(), '2000');

        $slider.dxSlider({
            min: 1500
        });
        $sliderLabels = $slider.find('.' + SLIDER_LABEL_CLASS);
        assert.equal($sliderLabels.eq(0).html(), '1500');
        assert.equal($sliderLabels.eq(1).html(), '2000');

        $slider.dxSlider({
            max: 2500
        });
        $sliderLabels = $slider.find('.' + SLIDER_LABEL_CLASS);
        assert.equal($sliderLabels.eq(0).html(), '1500');
        assert.equal($sliderLabels.eq(1).html(), '2500');
    });
});

module('events', () => {
    test('value change should cause value change action call', function(assert) {
        assert.expect(1);

        const $slider = $('#slider').dxSlider({
            max: 500,
            min: 0,
            value: 0,
            onValueChanged: function() {
                assert.ok(true, 'action fired');
            },
            useInkRipple: false
        }).css('width', 500);

        pointerMock($slider).start().move(250 + $slider.offset().left).down();
    });

    test('swipe should raise valueChange event with "swipe" event type', function(assert) {
        assert.expect(1);

        const $slider = $('#slider').dxSlider({
            max: 500,
            min: 0,
            value: 0,
            onValueChanged: function(data) {
                assert.strictEqual(data.event.event.type, 'dxswipe', 'event type is correct');
            },
            useInkRipple: false
        }).css('width', 500);

        const $handle = $slider.find('.' + SLIDER_WRAPPER_CLASS);
        const pointer = pointerMock($handle);
        pointer.start().swipeStart().swipe(10);
    });

    test('event should be passed to valueChange correctly when "swipeend" event is triggered', function(assert) {
        assert.expect(1);

        const $slider = $('#slider').dxSlider({
            max: 500,
            min: 0,
            value: 0,
            onValueChanged: function(data) {
                assert.strictEqual(data.event.event.type, 'dxswipeend', 'event type is correct');
            },
            useInkRipple: false
        }).css('width', 500);

        const $handle = $slider.find('.' + SLIDER_WRAPPER_CLASS);
        const pointer = pointerMock($handle);
        pointer.start().swipeStart().swipeEnd(9.666692444513187);
    });

    test('click on slider scale should raise valueChange event with "pointerdown" event type', function(assert) {
        assert.expect(1);

        const $slider = $('#slider').dxSlider({
            max: 500,
            min: 0,
            value: 0,
            onValueChanged: function(data) {
                assert.strictEqual(data.event.type, 'dxpointerdown', 'event type is correct');
            },
            useInkRipple: false
        }).css('width', 500);

        pointerMock($slider).start().move(250 + $slider.offset().left).down();
    });

    test('value option change after swipe should raise valueChanged event with no event (T926119)', function(assert) {
        assert.expect(2);

        const $slider = $('#slider').dxSlider({
            max: 500,
            min: 0,
            value: 0,
            useInkRipple: false,
            onValueChanged: (data) => {
                assert.strictEqual(data.event.event.type, 'dxswipe', 'valueChange with event type "swipe" has been raised');
            }
        }).css('width', 500);
        const slider = $slider.dxSlider('instance');

        const $handle = $slider.find('.' + SLIDER_WRAPPER_CLASS);
        const pointer = pointerMock($handle);
        pointer.start().swipeStart().swipe(10).swipeEnd(9.666692444513187);

        slider.option('onValueChanged', (data) => {
            assert.strictEqual(data.event, undefined, 'no event has been passed to valueChanged event after option change');
        });
        slider.option('value', 0);
    });

    test('Changing the \'value\' option must invoke the \'onValueChanged\' action', function(assert) {
        const slider = $('#slider').dxSlider({
            onValueChanged: function() { assert.ok(true); },
            useInkRipple: false
        }).dxSlider('instance');
        slider.option('value', true);
    });

    test('T269867 - handle should not have active state if the \'activeStateEnabled\' option is false', function(assert) {
        const $element = $('#slider').dxSlider({
            activeStateEnabled: false,
            useInkRipple: false
        });
        const $handle = $element.find('.dx-slider-handle');

        pointerMock($handle).start().down().move(250 + $element.offset().left);
        assert.ok(!$handle.hasClass('dx-state-active'), 'handle should not have active state');
    });
});

module('focus policy', moduleOptions, () => {
    testInActiveWindow('Handle focus by click on track bar (T249311)', function(assert) {
        assert.expect(1);

        const $slider = $('#slider').dxSlider({
            focusStateEnabled: true,
            useInkRipple: false
        });
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);

        $slider.trigger('dxclick');
        assert.ok($handle.hasClass('dx-state-focused'), 'handle has focus class after click on track');
    });
});

module('keyboard navigation', moduleOptions, () => {
    test('control keys test', function(assert) {
        assert.expect(4);

        const $slider = $('#slider').dxSlider({
            min: 10,
            max: 90,
            value: 50,
            focusStateEnabled: true,
            useInkRipple: false,
            onValueChanged: (data) => {
                assert.strictEqual(data.event.type, 'keydown', 'correct event has been passed to valueChanged');
            }
        });
        const slider = $slider.dxSlider('instance');
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);
        const keyboard = keyboardMock($handle);

        $handle.trigger('focusin');

        keyboard.keyDown('right');
        assert.equal(slider.option('value'), 51, 'value is correct after rightArrow press');

        keyboard.keyDown('left');
        assert.equal(slider.option('value'), 50, 'value is correct after leftArrow press');
    });

    test('control keys test with step', function(assert) {
        assert.expect(4);

        const $slider = $('#slider').dxSlider({
            min: 10,
            max: 90,
            value: 50,
            step: 3,
            focusStateEnabled: true,
            useInkRipple: false
        });
        const slider = $slider.dxSlider('instance');
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);
        const keyboard = keyboardMock($handle);

        $handle.trigger('focusin');

        keyboard.keyDown('right');
        assert.equal(slider.option('value'), 52, 'value is correct after rightArrow press');

        keyboard.keyDown('left');
        assert.equal(slider.option('value'), 49, 'value is correct after leftArrow press');

        keyboard.keyDown('home');
        assert.equal(slider.option('value'), 10, 'value is correct after home press');

        keyboard.keyDown('end');
        assert.equal(slider.option('value'), 90, 'value is correct after end press');
    });

    test('pageUp/pageDown keys test', function(assert) {
        assert.expect(8);

        const $slider = $('#slider').dxSlider({
            min: 10,
            max: 90,
            value: 50,
            keyStep: 1,
            focusStateEnabled: true,
            useInkRipple: false,
            onValueChanged: (data) => {
                assert.strictEqual(data.event.type, 'keydown', 'correct event has been passed to valueChanged');
            }
        });
        const slider = $slider.dxSlider('instance');
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);
        const keyboard = keyboardMock($handle);

        $handle.trigger('focusin');

        keyboard.keyDown('pageUp');
        assert.equal(slider.option('value'), 51, 'value is correct after pageUp press');

        keyboard.keyDown('pageDown');
        assert.equal(slider.option('value'), 50, 'value is correct after pageDown press');

        slider.option('keyStep', 10);
        slider.option('step', 2);

        keyboard.keyDown('pageUp');
        assert.equal(slider.option('value'), 70, 'value is correct after pageUp press');

        keyboard.keyDown('pageDown');
        assert.equal(slider.option('value'), 50, 'value is correct after pageDown press');
    });


    test('home/end keys test', function(assert) {
        assert.expect(4);

        const $slider = $('#slider').dxSlider({
            min: 0,
            max: 50,
            value: 25,
            keyStep: 1,
            focusStateEnabled: true,
            useInkRipple: false,
            onValueChanged: (data) => {
                assert.strictEqual(data.event.type, 'keydown', 'correct event has been passed to valueChanged');
            }
        });
        const slider = $slider.dxSlider('instance');
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);
        const keyboard = keyboardMock($handle);

        $handle.trigger('focusin');

        keyboard.keyDown('end');
        assert.equal(slider.option('value'), 50, 'value is correct after end press');

        keyboard.keyDown('home');
        assert.equal(slider.option('value'), 0, 'value is correct after home press');
    });

    test('control keys test for rtl', function(assert) {
        assert.expect(4);

        const $slider = $('#slider').dxSlider({
            rtlEnabled: true,
            min: 10,
            max: 90,
            value: 50,
            step: 3,
            focusStateEnabled: true,
            useInkRipple: false
        });
        const slider = $slider.dxSlider('instance');
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);
        const keyboard = keyboardMock($handle);

        $handle.trigger('focusin');

        keyboard.keyDown('right');
        assert.equal(slider.option('value'), 49, 'value is correct after rightArrow press');

        keyboard.keyDown('left');
        assert.equal(slider.option('value'), 52, 'value is correct after leftArrow press');

        keyboard.keyDown('home');
        assert.equal(slider.option('value'), 10, 'value is correct after home press');

        keyboard.keyDown('end');
        assert.equal(slider.option('value'), 90, 'value is correct after end press');
    });

    test('pageUp/pageDown keys test for rtl', function(assert) {
        assert.expect(4);

        const $slider = $('#slider').dxSlider({
            rtlEnabled: true,
            min: 10,
            max: 90,
            value: 50,
            keyStep: 1,
            focusStateEnabled: true,
            useInkRipple: false
        });
        const slider = $slider.dxSlider('instance');
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);
        const keyboard = keyboardMock($handle);

        $handle.trigger('focusin');

        keyboard.keyDown('pageUp');
        assert.equal(slider.option('value'), 49, 'value is correct after pageUp press');

        keyboard.keyDown('pageDown');
        assert.equal(slider.option('value'), 50, 'value is correct after pageDown press');

        slider.option('keyStep', 10);

        keyboard.keyDown('pageUp');
        assert.equal(slider.option('value'), 40, 'value is correct after pageUp press');

        keyboard.keyDown('pageDown');
        assert.equal(slider.option('value'), 50, 'value is correct after pageDown press');
    });

    test('T380070 - the value should not be changed on the \'left\' key press if the value is min', function(assert) {
        const spy = sinon.spy();
        const $slider = $('#slider').dxSlider({
            min: 10,
            value: 10,
            focusStateEnabled: true,
            onValueChanged: spy
        });
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);

        keyboardMock($handle).press('left');
        assert.strictEqual(spy.called, false, 'the onValueChanged is not called');
    });

    test('T380070 - the value should not be changed on the \'right\' key press if the value is max', function(assert) {
        const spy = sinon.spy();
        const $slider = $('#slider').dxSlider({
            max: 10,
            value: 10,
            focusStateEnabled: true,
            onValueChanged: spy
        });
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);

        keyboardMock($handle).press('right');
        assert.strictEqual(spy.called, false, 'the onValueChanged is not called');
    });
});

module('regression tests', moduleOptions, () => {
    test('change value of invisible element', function(assert) {
        const $element = $('#slider').dxSlider({
            max: 100,
            min: 0,
            value: 20,
            useInkRipple: false
        }).css('width', 100 + SLIDER_PADDING * 2);
        const instance = $element.dxSlider('instance');
        const range = $element.find('.' + SLIDER_RANGE_CLASS);

        instance.option('visible', false);
        instance.option('value', 40);
        instance.option('visible', true);

        assert.equal(range.width(), 40, 'range width is right');
    });

    test('min value behaviour', function(assert) {
        const $element = $('#slider').dxSlider({
            max: 600,
            min: 100,
            value: 200,
            useInkRipple: false
        }).css('width', 500);

        const slider = $element.dxSlider('instance');

        pointerMock($element).start().move(250 + $element.offset().left).down();
        assert.equal(slider.option('value'), 350);
    });

    test('B230095 - value is set to \'0\' after click on the handle', function(assert) {
        const $element = $('#slider').dxSlider({
            max: 10,
            min: 0,
            value: 5,
            useInkRipple: false
        });

        const $handle = $element.find(`.${SLIDER_HANDLE_CLASS}`);
        const handleX = $handle.offset().left + $handle.outerWidth() / 2;

        pointerMock($element.find(`.${SLIDER_HANDLE_CLASS}`)).start().move(handleX).click();
        assert.equal($element.dxSlider('option', 'value'), 5);
    });

    test('B232111, B233180 - disabled state doesn\'t work', function(assert) {
        const $element = $('#slider').dxSlider({
            min: 0,
            value: 50,
            max: 100,
            disabled: true,
            useInkRipple: false
        });
        const slider = $element.dxSlider('instance');

        assert.ok($element.hasClass('dx-state-disabled'));
        pointerMock($element).start().move(250 + $element.offset().left).down();
        assert.equal(slider.option('value'), 50);
    });

    test('B233256 - incorrect options', function(assert) {
        const $element = $('#slider').dxSlider({
            min: 0,
            value: 50,
            max: 100,
            useInkRipple: false
        });
        const slider = $element.dxSlider('instance');

        slider.option('min', 110);

        assert.expect(0);
    });

    test('B233288 - incorrect behavior when swipe on handle', function(assert) {
        const $element = $('#slider')
            .css('width', 500)
            .dxSlider({
                max: 500,
                min: 0,
                value: 250,
                useInkRipple: false
            });

        const $handle = $element.find(`.${SLIDER_HANDLE_CLASS}`);
        const handleX = $handle.offset().left + $handle.outerWidth() / 2;
        const instance = $element.dxSlider('instance');

        assert.equal(instance.option('value'), 250);
        pointerMock($handle).start().move(handleX).down().move(2).up();
        assert.equal(instance.option('value'), 252);
    });

    test('B234545 dxRangeSlider/dxSlider - incorrect behavior with negative min and max values.', function(assert) {
        const $element = $('#slider').css('width', 960);

        $element.dxSlider({
            max: 100,
            min: 0,
            value: 0,
            useInkRipple: false
        });

        const slider = $element.dxSlider('instance');

        const $range = $element.find('.' + SLIDER_RANGE_CLASS);

        slider.option('min', -10);
        slider.option('max', -10);

        assert.equal(slider.option('value'), -10);
        assert.equal($range.width(), 0);
    });

    test('B234766 dxSlider - incorrect value calculation with fractional step', function(assert) {
        const $element = $('#slider').css('width', 960 + 2 * SLIDER_PADDING);

        $element.dxSlider({
            max: 100,
            min: 0,
            value: 0,
            useInkRipple: false
        });

        const slider = $element.dxSlider('instance');

        const $handle = $element.find(`.${SLIDER_HANDLE_CLASS}`);
        const $range = $element.find('.' + SLIDER_RANGE_CLASS);

        slider.option('step', 2.5);
        slider.option('value', 2.5);

        assert.equal(handlePositionAgainstTrackBar($handle).left, 960 / 40);
        assert.equal($range.width(), 960 / 40);

        slider.option('max', 10);
        slider.option('step', 0.5);
        slider.option('value', 0.5);

        assert.equal(handlePositionAgainstTrackBar($handle).left, 960 / 20);
        assert.equal($range.width(), 960 / 20);
    });

    test('incorrect when step is NAN or empty string', function(assert) {
        const $element = $('#slider')
            .css('width', 500)
            .dxSlider({
                max: 500,
                min: 0,
                value: 250,
                useInkRipple: false
            });
        const slider = $element.dxSlider('instance');

        slider.option('step', 'NANstring');

        const $handle = $element.find(`.${SLIDER_HANDLE_CLASS}`);
        const handleX = $handle.offset().left + $handle.outerWidth() / 2;

        assert.equal(slider.option('value'), 250);
        pointerMock($handle).start().move(handleX).down().move(50).up();
        assert.equal(slider.option('value'), 300);

        slider.option('step', '');
        slider.option('value', 250);

        assert.equal(slider.option('value'), 250);
        pointerMock($handle).start().move(handleX).down().move(50).up();
        assert.equal(slider.option('value'), 300);
    });

    test('Q374462 dxSlider - It is impossible to set the step option to the float value', function(assert) {
        const $element = $('#slider')
            .css('width', 100)
            .dxSlider({
                max: 1,
                min: -1,
                value: 0,
                useInkRipple: false
            });
        const slider = $element.dxSlider('instance');

        slider.option('step', 0.01);
        const $handle = $element.find(`.${SLIDER_HANDLE_CLASS}`);
        const handleX = $handle.offset().left + $handle.outerWidth() / 2;

        assert.equal(slider.option('value'), 0);
        pointerMock($handle).start().move(handleX).down().move(10).up();
        assert.equal(slider.option('value'), 0.20);

        slider.option('step', 0.00015);
        slider.option('value', 0);
        assert.equal(slider.option('value'), 0);
        pointerMock($handle).start().move(handleX).down().move(15).up();
        assert.equal(slider.option('value'), 0.30005);

        slider.option('step', 0.0000001);
        slider.option('value', 0);
        pointerMock($handle).start().move(handleX).down().move(15).up();
        assert.equal(slider.option('value'), 0.3, 'step should be reset to default');
    });

    test('step depends on min value after swipe', function(assert) {
        const $element = $('#slider')
            .css('width', 150)
            .dxSlider({
                max: 2,
                min: 0.5,
                value: 0.5,
                step: 1,
                useInkRipple: false
            });
        const slider = $element.dxSlider('instance');

        const $handle = $element.find(`.${SLIDER_HANDLE_CLASS}`);
        const handleX = $handle.offset().left + $handle.outerWidth() / 2;

        pointerMock($handle).start().move(handleX).down().move(100).up();
        assert.equal(slider.option('value'), 1.5, 'step depends min value');
    });

    test('\'repaint\' method should not leads to error if \'tooltip.enabled\' is true', function(assert) {
        assert.expect(0);

        const $element = $('#slider');
        const slider = $element.dxSlider({
            tooltip: {
                enabled: true,
                showMode: 'always'
            },
            useInkRipple: false
        }).dxSlider('instance');

        slider.repaint();
    });

    test('The error should not be thrown if value is null', function(assert) {
        try {
            const slider = $('#slider').dxSlider({
                value: null
            }).dxSlider('instance');

            slider.option('value', 100);

            assert.ok(true, 'The error doesn\'t be thrown');
        } catch(e) {
            assert.ok(false, e);
        }
    });

    test('Value is not jumping when the slider handler is moved', function(assert) {
        const left = $('#qunit-fixture').css('left');

        $('#qunit-fixture').css('left', '0px');
        const $element = $('#slider').dxSlider({
            min: 0,
            max: 3,
            width: 500,
            value: 0
        });

        const $handle = $element.find(`.${SLIDER_HANDLE_CLASS}`);
        const mouse = pointerMock($handle);

        mouse.start().down();
        this.clock.tick(FEEDBACK_SHOW_TIMEOUT);

        mouse.move(99);

        const $range = $element.find('.' + SLIDER_RANGE_CLASS);
        assert.ok($range.width() < 160, 'range width is not jumping');

        mouse.up();
        this.clock.tick(FEEDBACK_HIDE_TIMEOUT);

        $('#qunit-fixture').css('left', left);
    });
});

module('RTL', moduleOptions, () => {
    test('render value', function(assert) {
        const $element = $('#slider').css('width', 960 + 2 * SLIDER_PADDING);

        $element.dxSlider({
            max: 100,
            min: 0,
            value: 0,
            rtlEnabled: true,
            useInkRipple: false
        });

        const slider = $element.dxSlider('instance');
        const $range = $element.find('.' + SLIDER_RANGE_CLASS);
        const rangeBorderWidth = parseInt($range.css('borderLeftWidth'));

        assert.equal($range.position().left + rangeBorderWidth * 2, 960);

        slider.option('value', 100);

        assert.equal($range.position().left + rangeBorderWidth * 2, 0);
    });

    test('mousedown/touchstart on slider set new value', function(assert) {
        const $element = $('#slider').dxSlider({
            max: 500,
            min: 0,
            value: 0,
            rtlEnabled: true,
            useInkRipple: false
        }).css('width', 500 + 2 * SLIDER_PADDING);

        const $range = $element.find('.' + SLIDER_RANGE_CLASS);

        pointerMock($element).start({ x: SLIDER_PADDING }).move(250 + $element.offset().left).down();
        assert.equal($range.width(), 250);

        pointerMock($element).start({ x: SLIDER_PADDING }).move(350 + $element.offset().left).down();
        assert.equal($range.width(), 150);
    });
});

module('visibility change', () => {
    test('tooltip should be centered after visibility changed', function(assert) {
        const $slider = $('#slider');
        const $parent = $slider.parent();

        $parent.hide();
        $slider.dxSlider({
            max: 100,
            min: 0,
            value: 50,
            tooltip: { enabled: true, showMode: 'always', position: 'top' },
            useInkRipple: false
        });

        $parent.show();
        triggerShownEvent($parent);

        const $tooltip = $slider.find('.' + TOOLTIP_CONTENT_CLASS);
        const $handle = $slider.find('.' + SLIDER_HANDLE_CLASS);

        const tooltipWidth = $tooltip.outerWidth();
        const tooltipCenter = tooltipWidth / 2;
        const tooltipOffsetAgainstHandle = Math.abs($tooltip.position().left) + $handle.width() / 2;

        assert.equal(tooltipCenter, tooltipOffsetAgainstHandle, 'tooltip position is centered');
    });
});

module('validation', () => {
    testInActiveWindow('add the CSS class on the focusIn event for show a validation message', function(assert) {
        const $slider = $('#slider');
        $slider.dxSlider({
            max: 100,
            min: 0,
            value: 50,
            isValid: false,
            validationError: { message: 'Test message' }
        });

        $slider.find(`.${ SLIDER_HANDLE_CLASS }`).first().trigger('focusin');

        assert.ok($slider.hasClass(INVALID_MESSAGE_VISIBLE_CLASS));
        assert.equal($('.dx-overlay-wrapper.dx-invalid-message').css('visibility'), 'visible', 'validation message is shown');
    });

    testInActiveWindow('remove the CSS class on the focusOut event for hide a validation message', function(assert) {
        const $slider = $('#slider');
        $slider.dxSlider({
            max: 100,
            min: 0,
            value: 50,
            isValid: false,
            validationError: { message: 'Test message' }
        });

        const handle = $slider.find(`.${ SLIDER_HANDLE_CLASS }`).first();
        handle.trigger('focusin');
        handle.trigger('focusout');

        assert.notOk($slider.hasClass(INVALID_MESSAGE_VISIBLE_CLASS));
        assert.equal($('.dx-overlay-wrapper.dx-invalid-message').css('visibility'), 'hidden', 'validation message is hidden');
    });

    testInActiveWindow('validation message should be hidden once focusStateEnabled option switch off', function(assert) {
        const $slider = $('#slider');
        const instance = $slider.dxSlider({
            max: 100,
            min: 0,
            value: 50,
            isValid: false,
            validationError: { message: 'Test message' }
        }).dxSlider('instance');
        const handle = $slider.find(`.${ SLIDER_HANDLE_CLASS }`).first();

        handle.trigger('focusin');
        instance.option('focusStateEnabled', false);

        assert.notOk($slider.hasClass(INVALID_MESSAGE_VISIBLE_CLASS));
        assert.strictEqual($('.dx-overlay-wrapper.dx-invalid-message').css('visibility'), 'hidden', 'validation message is hidden');
    });
});

module('small float step', () => {
    test('handle should move on correct step when step is very small (T945742)', function(assert) {
        const step = 0.0000001;
        const startValue = 0.5;
        const $slider = $('#slider').dxSlider({
            step,
            min: 0,
            max: 1,
            value: startValue
        });
        const slider = $slider.dxSlider('instance');
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);
        const handleX = $handle.offset().left + $handle.outerWidth() / 2;

        pointerMock($handle).start().move(handleX).down().move(step).up();
        assert.strictEqual(slider.option('value'), startValue + step, 'new value is correct');
    });

    test('keyboard navigation shound work correctly even when step is very small', function(assert) {
        const step = 0.0000000001;
        const epsilon = step / 10;
        const startValue = 0.50000000005;
        const $slider = $('#slider').dxSlider({
            step,
            min: 0,
            max: 1,
            value: startValue
        });
        const slider = $slider.dxSlider('instance');
        const $handle = $slider.find(`.${SLIDER_HANDLE_CLASS}`);

        const keyboard = keyboardMock($handle);

        $handle.focusin();

        let currentValue = 0.5;
        for(let i = 0; i < 15; ++i) {
            keyboard.press('left');
            assert.roughEqual(slider.option('value'), currentValue, epsilon, 'value is correct');
            currentValue -= step;
        }
    });
});
