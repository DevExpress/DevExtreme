import $ from 'jquery';
import SliderTooltip from '__internal/ui/slider/m_slider_tooltip';
import keyboardMock from '../../helpers/keyboardMock.js';
import pointerMock from '../../helpers/pointerMock.js';
import fx from 'common/core/animation/fx';
import { normalizeKeyName } from 'common/core/events/utils/index';

import 'ui/range_slider';
import 'ui/number_box';
import 'ui/validator';
import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="slider"></div><div id="start-value"></div><div id="end-value"></div>';

    $('#qunit-fixture').html(markup);
});

const SLIDER_CLASS = 'dx-slider';
const SLIDER_WRAPPER_CLASS = SLIDER_CLASS + '-wrapper';
const SLIDER_RANGE_CLASS = SLIDER_CLASS + '-range';
const SLIDER_HANDLE_CLASS = SLIDER_CLASS + '-handle';

const RANGE_SLIDER_CLASS = 'dx-rangeslider';
const RANGE_SLIDER_START_HANDLE_CLASS = RANGE_SLIDER_CLASS + '-start-handle';
const RANGE_SLIDER_END_HANDLE_CLASS = RANGE_SLIDER_CLASS + '-end-handle';

const FOCUSED_STATE_CLASS = 'dx-state-focused';

const TOOLTIP_CLASS = 'dx-popover';

const FEEDBACK_SHOW_TIMEOUT = 30;
const FEEDBACK_HIDE_TIMEOUT = 400;
const CONTAINER_MARGIN = 7;

const getRight = (el) => $(el).get(0).getBoundingClientRect().right;
const getLeft = (el) => $(el).get(0).getBoundingClientRect().left;
const getWidth = (el) => $(el).get(0).getBoundingClientRect().width;

const isRangeSliderDimensionsMatchOptions = (id, assert) => {
    const element = $(id);
    const instance = element.dxRangeSlider('instance');
    const width = element.width();
    const min = instance.option('min');
    const max = instance.option('max');
    const start = instance.option('start');
    const end = instance.option('end');
    const rtl = instance.option('rtlEnabled');

    let handleStart = element.find('.' + SLIDER_HANDLE_CLASS).eq(0);
    let handleEnd = element.find('.' + SLIDER_HANDLE_CLASS).eq(1);
    const range = element.find('.' + SLIDER_RANGE_CLASS);
    const trackBarContainer = range.parent();

    let expectedRangeWidth = (end - start) / (max - min) * (width - 2 * CONTAINER_MARGIN);
    let expectedRangeLeftOffset = (start - min) / (max - min) * (width - 2 * CONTAINER_MARGIN);
    let expectedRangeRightOffset = (max - end) / (max - min) * (width - 2 * CONTAINER_MARGIN);

    if(rtl) {
        const tmpRangeOffset = expectedRangeLeftOffset;
        expectedRangeLeftOffset = expectedRangeRightOffset;
        expectedRangeRightOffset = tmpRangeOffset;

        const tmpHandleStart = handleStart;
        handleStart = handleEnd;
        handleEnd = tmpHandleStart;
    }

    const calculatedRangeWidth = getWidth(range);
    const calculatedRangeLeftOffset = getLeft(range) - getLeft(trackBarContainer);
    const calculatedRangeRightOffset = getRight(trackBarContainer) - getRight(range);

    const startHandleAndRangeDifference = Math.abs(parseInt(handleStart.css('marginLeft')) + parseInt(range.css('borderLeftWidth')));
    const endHandleAndRangeDifference = Math.abs(parseInt(handleEnd.css('marginRight')) + parseInt(range.css('borderRightWidth')));

    const calculatedStartHandleOffset = getLeft(handleStart) - getLeft(trackBarContainer) + startHandleAndRangeDifference;
    const calculatedEndHandleOffset = getRight(trackBarContainer) - getRight(handleEnd) + endHandleAndRangeDifference;

    if(expectedRangeWidth === 0) {
        // range has 1px border and if width === 0, real width === 2
        // so if start === end, handles has some offset
        expectedRangeWidth = 2;
        if(rtl) {
            expectedRangeLeftOffset -= 2;
        } else {
            expectedRangeRightOffset -= 2;
        }
    }

    assert.roughEqual(calculatedRangeWidth, expectedRangeWidth, 0.5, `${SLIDER_RANGE_CLASS} width`);
    assert.roughEqual(calculatedRangeLeftOffset, expectedRangeLeftOffset, 0.5, `${SLIDER_RANGE_CLASS} left offset`);
    assert.roughEqual(calculatedRangeRightOffset, expectedRangeRightOffset, 0.5, `${SLIDER_RANGE_CLASS} right offset`);
    assert.roughEqual(calculatedStartHandleOffset, expectedRangeLeftOffset, 1, `start ${SLIDER_HANDLE_CLASS} offset`);
    assert.roughEqual(calculatedEndHandleOffset, expectedRangeRightOffset, 1, `end ${SLIDER_HANDLE_CLASS} offset`);
};

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


QUnit.module('render', moduleOptions, () => {
    QUnit.test('onContentReady fired after the widget is fully ready', function(assert) {
        assert.expect(1);

        $('#slider').dxRangeSlider({
            onContentReady: function(e) {
                assert.ok($(e.element).hasClass(RANGE_SLIDER_CLASS));
            }
        });
    });

    QUnit.test('render value', function(assert) {
        const el = $('#slider').css('width', 960);

        const slider = el.dxRangeSlider({
            max: 100,
            min: 0,
            start: 0,
            end: 100
        }).dxRangeSlider('instance');

        isRangeSliderDimensionsMatchOptions('#slider', assert);

        slider.option('start', 50);

        isRangeSliderDimensionsMatchOptions('#slider', assert);

        slider.option('end', 50);

        isRangeSliderDimensionsMatchOptions('#slider', assert);
    });

    QUnit.test('mousedown/touchstart on slider set new value', function(assert) {
        const el = $('#slider').dxRangeSlider({
            max: 500,
            min: 0,
            start: 0,
            end: 500
        }).css('width', 500);

        const instance = el.dxRangeSlider('instance');

        pointerMock(el).start().move(240 + el.offset().left).down();

        assert.equal(instance.option('start'), 240);
        assert.equal(instance.option('end'), 500);
        isRangeSliderDimensionsMatchOptions('#slider', assert);

        pointerMock(el).start().move(450 + el.offset().left).down();

        assert.equal(instance.option('start'), 240);
        assert.equal(instance.option('end'), 456);
        isRangeSliderDimensionsMatchOptions('#slider', assert);

        pointerMock(el).start().move(500 + el.offset().left).down();

        assert.equal(instance.option('start'), 240);
        assert.equal(instance.option('end'), 500);
        isRangeSliderDimensionsMatchOptions('#slider', assert);
    });
});

QUnit.module('slider with tooltip', () => {
    QUnit.test('tooltip default rendering', function(assert) {
        const $slider = $('#slider').dxRangeSlider({
            tooltip: {
                enabled: true,
                showMode: 'always'
            }
        });
        const $handle = $slider.find('.' + SLIDER_HANDLE_CLASS);
        const $tooltips = $handle.find('.' + TOOLTIP_CLASS);

        assert.equal($tooltips.length, 2);
        assert.ok(SliderTooltip.getInstance($tooltips.eq(0)));
        assert.ok(SliderTooltip.getInstance($tooltips.eq(1)));
    });

    QUnit.test('\'tooltip.format\' should not be called for \'value\' option', function(assert) {
        const formatLog = [];

        $('#slider').dxRangeSlider({
            min: 123,
            start: 234,
            max: 567,
            end: 456,
            value: [234, 456],
            tooltip: {
                enabled: true,
                format: function(value) {
                    formatLog.push(value);
                }
            }
        });

        assert.equal($.inArray(300, formatLog), -1);
    });
});

QUnit.module('user interaction', () => {
    QUnit.test('activeHandle should be changed is drag cross over handler', function(assert) {
        fx.off = true;
        const $element = $('#slider').dxRangeSlider({
            max: 100,
            min: 0,
            start: 40,
            end: 60,
            width: 100 + CONTAINER_MARGIN * 2
        });

        const instance = $element.dxRangeSlider('instance');

        const $wrapper = $element.find('.' + SLIDER_WRAPPER_CLASS);
        const pointer = pointerMock($wrapper);

        pointer.start().down($wrapper.offset().left + CONTAINER_MARGIN + 40, $wrapper.offset().top).move(46);
        assert.equal(instance.option('start'), 60);
        assert.equal(instance.option('end'), 80);
        isRangeSliderDimensionsMatchOptions('#slider', assert);
        pointer.up();

        pointer.start().down($wrapper.offset().left + CONTAINER_MARGIN + 80, $wrapper.offset().top).move(-57);
        assert.equal(instance.option('start'), 30);
        assert.equal(instance.option('end'), 60);
        isRangeSliderDimensionsMatchOptions('#slider', assert);
        pointer.up();
    });

    QUnit.test('activeHandle should be changed is drag cross over handler when min was set', function(assert) {
        fx.off = true;
        const $element = $('#slider').dxRangeSlider({
            max: 160,
            min: 60,
            start: 120,
            end: 140,
            width: 100 + CONTAINER_MARGIN * 2
        });

        const instance = $element.dxRangeSlider('instance');

        const $wrapper = $element.find('.' + SLIDER_WRAPPER_CLASS);
        const pointer = pointerMock($wrapper);

        pointer.start().down($wrapper.offset().left + CONTAINER_MARGIN + 80, $wrapper.offset().top).move(-46);
        assert.equal(instance.option('start'), 100);
        assert.equal(instance.option('end'), 120);
        isRangeSliderDimensionsMatchOptions('#slider', assert);
        pointer.up();
    });

    QUnit.test('activeHandle should be changed is drag cross over handler (RTL)', function(assert) {
        const $element = $('#slider').dxRangeSlider({
            max: 100,
            min: 0,
            start: 40,
            end: 60,
            width: 100 + CONTAINER_MARGIN * 2,
            rtlEnabled: true
        });

        const instance = $element.dxRangeSlider('instance');

        const $wrapper = $element.find('.' + SLIDER_WRAPPER_CLASS);
        const pointer = pointerMock($wrapper);

        pointer.start().down($wrapper.offset().left + CONTAINER_MARGIN + 40, $wrapper.offset().top).move(46);
        assert.equal(instance.option('start'), 20);
        assert.equal(instance.option('end'), 40);
        isRangeSliderDimensionsMatchOptions('#slider', assert);
        pointer.up();

        pointer.start().down($wrapper.offset().left + CONTAINER_MARGIN + 80, $wrapper.offset().top).move(-57);
        assert.equal(instance.option('start'), 40);
        assert.equal(instance.option('end'), 70);
        isRangeSliderDimensionsMatchOptions('#slider', assert);
        pointer.up();
    });
});

QUnit.module('actions', () => {
    QUnit.test('onValueChanged should be fired after value is changed', function(assert) {
        const onValueChangedStub = sinon.stub();

        const el = $('#slider').dxRangeSlider({
            max: 500,
            min: 0,
            start: 0,
            end: 500,
            onValueChanged: onValueChangedStub
        }).css('width', 500);

        pointerMock(el).start().move(250 + el.offset().left).down();

        assert.ok(onValueChangedStub.called, 'onValueChanged was fired');
    });

    QUnit.test('onValueChanged should be fired when dxRangeSlider is readOnly', function(assert) {
        const onValueChangedStub = sinon.stub();

        const slider = $('#slider').dxRangeSlider({
            readOnly: true,
            max: 100,
            min: 0,
            start: 20,
            end: 60,
            onValueChanged: onValueChangedStub
        }).dxRangeSlider('instance');

        slider.option('start', 30);

        assert.ok(onValueChangedStub.called, 'onValueChanged was fired');
    });

    QUnit.test('onValueChanged should be fired when dxRangeSlider is disabled', function(assert) {
        const onValueChangedStub = sinon.stub();

        const slider = $('#slider').dxRangeSlider({
            disabled: true,
            max: 100,
            min: 0,
            start: 20,
            end: 60,
            onValueChanged: onValueChangedStub
        }).dxRangeSlider('instance');

        slider.option('start', 30);

        assert.ok(onValueChangedStub.called, 'onValueChanged was fired');
    });
});

QUnit.module('focus policy', moduleOptions, () => {
    QUnit.testInActiveWindow('Handle focus by click on track bar (T249311)', function(assert) {
        assert.expect(2);

        const $rangeSlider = $('#slider').dxRangeSlider({
            max: 100,
            min: 0,
            start: 40,
            end: 60,
            width: 100,
            focusStateEnabled: true
        });
        const $handles = $rangeSlider.find('.' + SLIDER_HANDLE_CLASS);
        const $leftHandle = $handles.eq(0);
        const $rightHandle = $handles.eq(1);
        const pointer = pointerMock($rangeSlider);

        pointer.start().down($rangeSlider.offset().left + 20, $rangeSlider.offset().top).up();
        assert.ok($leftHandle.hasClass('dx-state-focused'), 'left handle has focus class after click on track');

        pointer.start().down($rangeSlider.offset().left + 80, $rangeSlider.offset().top).up();
        assert.ok($rightHandle.hasClass('dx-state-focused'), 'right handle has focus class after click on track');
    });
});

QUnit.module('isDirty', () => {
    QUnit.test('should be false by default', function(assert) {
        const instance = $('#slider').dxRangeSlider({}).dxRangeSlider('instance');

        assert.strictEqual(instance.option('isDirty'), false);
    });

    QUnit.test('should be set to true after value changed', function(assert) {
        const instance = $('#slider').dxRangeSlider({ value: [0, 1] }).dxRangeSlider('instance');

        instance.option('value', [2, 3]);

        assert.strictEqual(instance.option('isDirty'), true);
    });

    QUnit.test('should be false if value updated to initial', function(assert) {
        const initialValue = [0, 10];

        const instance = $('#slider').dxRangeSlider({ value: initialValue }).dxRangeSlider('instance');

        instance.option('start', [1, 2]);

        assert.strictEqual(instance.option('isDirty'), true);
    });

    ['start', 'end'].forEach((slider) => {
        QUnit.test(`should be set to true after ${slider} value changed`, function(assert) {
            const instance = $('#slider').dxRangeSlider({ value: [0, 10] }).dxRangeSlider('instance');

            instance.option(slider, 1);

            assert.strictEqual(instance.option('isDirty'), true);
        });
    });
});

QUnit.module('keyboard navigation', moduleOptions, () => {
    QUnit.test('control keys test', function(assert) {
        assert.expect(8);

        const $rangeSlider = $('#slider').dxRangeSlider({
            min: 10,
            max: 90,
            start: 50,
            end: 80,
            step: 3,
            focusStateEnabled: true
        });

        const rangeSlider = $rangeSlider.dxRangeSlider('instance');
        const $handles = $rangeSlider.find('.' + SLIDER_HANDLE_CLASS);
        const $leftHandle = $handles.eq(0);
        const $rightHandle = $handles.eq(1);
        let keyboard = keyboardMock($leftHandle);

        $leftHandle.trigger('focusin');

        keyboard.keyDown('right');
        assert.equal(rangeSlider.option('start'), 53, 'value is correct after rightArrow press');

        keyboard.keyDown('left');
        assert.equal(rangeSlider.option('start'), 50, 'value is correct after leftArrow press');

        keyboard.keyDown('home');
        assert.equal(rangeSlider.option('start'), 10, 'value is correct after home press');

        keyboard.keyDown('end');
        assert.equal(rangeSlider.option('start'), 80, 'value is correct after end press');

        rangeSlider.option('start', 50);

        keyboard = keyboardMock($rightHandle);
        $rightHandle.trigger('focusin');

        keyboard.keyDown('right');
        assert.equal(rangeSlider.option('end'), 83, 'value is correct after rightArrow press');

        keyboard.keyDown('left');
        assert.equal(rangeSlider.option('end'), 80, 'value is correct after leftArrow press');

        keyboard.keyDown('home');
        assert.equal(rangeSlider.option('end'), 50, 'value is correct after home press');

        keyboard.keyDown('end');
        assert.equal(rangeSlider.option('end'), 90, 'value is correct after end press');
    });

    QUnit.test('pageUp/pageDown keys test', function(assert) {
        assert.expect(6);

        const $rangeSlider = $('#slider').dxRangeSlider({
            min: 10,
            max: 90,
            start: 50,
            end: 80,
            keyStep: 1,
            focusStateEnabled: true
        });

        const rangeSlider = $rangeSlider.dxRangeSlider('instance');
        const $handles = $rangeSlider.find('.' + SLIDER_HANDLE_CLASS);
        const $leftHandle = $handles.eq(0);
        const $rightHandle = $handles.eq(1);
        let keyboard = keyboardMock($leftHandle);

        $leftHandle.trigger('focusin');

        keyboard.keyDown('pageUp');
        assert.equal(rangeSlider.option('start'), 51, 'value is correct after pageUp press');

        keyboard.keyDown('pageDown');
        assert.equal(rangeSlider.option('start'), 50, 'value is correct after pageDown press');

        rangeSlider.option('keyStep', 3);
        rangeSlider.option('step', 3);

        keyboard.keyDown('pageUp');
        assert.equal(rangeSlider.option('start'), 59, 'value is correct after pageUp press');

        keyboard.keyDown('pageDown');
        assert.equal(rangeSlider.option('start'), 50, 'value is correct after pageDown press');

        keyboard = keyboardMock($rightHandle);
        $rightHandle.trigger('focusin');

        keyboard.keyDown('pageUp');
        assert.equal(rangeSlider.option('end'), 89, 'value is correct after pageUp press');

        keyboard.keyDown('pageDown');
        assert.equal(rangeSlider.option('end'), 80, 'value is correct after pageDown press');
    });

    QUnit.test('control keys test for rtl', function(assert) {
        assert.expect(8);

        const $rangeSlider = $('#slider').dxRangeSlider({
            rtlEnabled: true,
            min: 10,
            max: 90,
            start: 50,
            end: 80,
            step: 3,
            focusStateEnabled: true
        });

        const rangeSlider = $rangeSlider.dxRangeSlider('instance');
        const $handles = $rangeSlider.find('.' + SLIDER_HANDLE_CLASS);
        const $leftHandle = $handles.eq(0);
        const $rightHandle = $handles.eq(1);
        let keyboard = keyboardMock($leftHandle);

        $leftHandle.trigger('focusin');

        keyboard.keyDown('right');
        assert.equal(rangeSlider.option('start'), 47, 'value is correct after rightArrow press');

        keyboard.keyDown('left');
        assert.equal(rangeSlider.option('start'), 50, 'value is correct after leftArrow press');

        keyboard.keyDown('home');
        assert.equal(rangeSlider.option('start'), 10, 'value is correct after home press');

        keyboard.keyDown('end');
        assert.equal(rangeSlider.option('start'), 80, 'value is correct after end press');

        rangeSlider.option('start', 50);

        keyboard = keyboardMock($rightHandle);
        $rightHandle.trigger('focusin');

        keyboard.keyDown('right');
        assert.equal(rangeSlider.option('end'), 77, 'value is correct after rightArrow press');

        keyboard.keyDown('left');
        assert.equal(rangeSlider.option('end'), 80, 'value is correct after leftArrow press');

        keyboard.keyDown('home');
        assert.equal(rangeSlider.option('end'), 50, 'value is correct after home press');

        keyboard.keyDown('end');
        assert.equal(rangeSlider.option('end'), 90, 'value is correct after end press');
    });

    QUnit.test('pageUp/pageDown keys test for rtl', function(assert) {
        assert.expect(6);

        const $rangeSlider = $('#slider').dxRangeSlider({
            rtlEnabled: true,
            min: 10,
            max: 90,
            start: 50,
            end: 80,
            keyStep: 1,
            focusStateEnabled: true
        });

        const rangeSlider = $rangeSlider.dxRangeSlider('instance');
        const $handles = $rangeSlider.find('.' + SLIDER_HANDLE_CLASS);
        const $leftHandle = $handles.eq(0);
        const $rightHandle = $handles.eq(1);
        let keyboard = keyboardMock($leftHandle);

        $leftHandle.trigger('focusin');

        keyboard.keyDown('pageUp');
        assert.equal(rangeSlider.option('start'), 49, 'value is correct after pageUp press');

        keyboard.keyDown('pageDown');
        assert.equal(rangeSlider.option('start'), 50, 'value is correct after pageDown press');

        rangeSlider.option('keyStep', 3);

        keyboard.keyDown('pageUp');
        assert.equal(rangeSlider.option('start'), 47, 'value is correct after pageUp press');

        keyboard.keyDown('pageDown');
        assert.equal(rangeSlider.option('start'), 50, 'value is correct after pageDown press');

        keyboard = keyboardMock($rightHandle);
        $rightHandle.trigger('focusin');

        keyboard.keyDown('pageUp');
        assert.equal(rangeSlider.option('end'), 77, 'value is correct after pageUp press');

        keyboard.keyDown('pageDown');
        assert.equal(rangeSlider.option('end'), 80, 'value is correct after pageDown press');
    });

    QUnit.testInActiveWindow('Handle should not stop when start = end and we move start handle right via keyboard', function(assert) {
        const $rangeSlider = $('#slider').dxRangeSlider({
            start: 29,
            end: 30,
            focusStateEnabled: true
        });
        const rangeSlider = $rangeSlider.dxRangeSlider('instance');
        const $startHandle = $rangeSlider.find('.' + RANGE_SLIDER_START_HANDLE_CLASS);
        const $endHandle = $rangeSlider.find('.' + RANGE_SLIDER_END_HANDLE_CLASS);
        const keyboard = keyboardMock($startHandle);

        $('.' + SLIDER_HANDLE_CLASS).css({
            'width': '1px',
            'height': '1px'
        });

        $startHandle.focus();

        keyboard.keyDown('right');
        keyboard.keyDown('right');

        assert.ok($endHandle.hasClass(FOCUSED_STATE_CLASS));
        assert.equal(rangeSlider.option('end'), 31, 'end handle was moved');
        assert.equal(rangeSlider.option('start'), 30, 'start handle was not moved after collision');
    });

    QUnit.testInActiveWindow('Handle should not stop when start = end and we move end handle right via keyboard RTL', function(assert) {
        const $rangeSlider = $('#slider').dxRangeSlider({
            rtlEnabled: true,
            start: 30,
            end: 31,
            focusStateEnabled: true
        });
        const rangeSlider = $rangeSlider.dxRangeSlider('instance');
        const $startHandle = $rangeSlider.find('.' + RANGE_SLIDER_START_HANDLE_CLASS);
        const $endHandle = $rangeSlider.find('.' + RANGE_SLIDER_END_HANDLE_CLASS);
        const keyboard = keyboardMock($endHandle);

        $('.' + SLIDER_HANDLE_CLASS).css({
            'width': '1px',
            'height': '1px'
        });

        $endHandle.focus();

        keyboard.keyDown('right');
        keyboard.keyDown('right');

        assert.ok($startHandle.hasClass(FOCUSED_STATE_CLASS));
        assert.equal(rangeSlider.option('end'), 30, 'end handle was not moved after collision');
        assert.equal(rangeSlider.option('start'), 29, 'start handle was moved');
    });

    QUnit.testInActiveWindow('Handle should not stop when start = end and we move start handle left via keyboard RTL', function(assert) {
        const $rangeSlider = $('#slider').dxRangeSlider({
            rtlEnabled: true,
            start: 29,
            end: 30,
            focusStateEnabled: true
        });
        const rangeSlider = $rangeSlider.dxRangeSlider('instance');
        const $startHandle = $rangeSlider.find('.' + RANGE_SLIDER_START_HANDLE_CLASS);
        const $endHandle = $rangeSlider.find('.' + RANGE_SLIDER_END_HANDLE_CLASS);
        const keyboard = keyboardMock($startHandle);

        $('.' + SLIDER_HANDLE_CLASS).css({
            'width': '1px',
            'height': '1px'
        });

        $startHandle.focus();

        keyboard.keyDown('left');
        keyboard.keyDown('left');

        assert.ok($endHandle.hasClass(FOCUSED_STATE_CLASS));
        assert.equal(rangeSlider.option('end'), 31, 'end handle was moved');
        assert.equal(rangeSlider.option('start'), 30, 'start handle was not moved after collision');
    });


    QUnit.testInActiveWindow('Handle should not stop when start = end and we move end handle left via keyboard', function(assert) {
        const $rangeSlider = $('#slider').dxRangeSlider({
            start: 30,
            end: 31,
            focusStateEnabled: true
        });
        const rangeSlider = $rangeSlider.dxRangeSlider('instance');
        const $startHandle = $rangeSlider.find('.' + RANGE_SLIDER_START_HANDLE_CLASS);
        const $endHandle = $rangeSlider.find('.' + RANGE_SLIDER_END_HANDLE_CLASS);
        const keyboard = keyboardMock($endHandle);

        $('.' + SLIDER_HANDLE_CLASS).css({
            'width': '1px',
            'height': '1px'
        });

        $endHandle.focus();

        keyboard.keyDown('left');
        keyboard.keyDown('left');

        assert.ok($startHandle.hasClass(FOCUSED_STATE_CLASS));
        assert.equal(rangeSlider.option('end'), 30, 'end handle was not moved after collision');
        assert.equal(rangeSlider.option('start'), 29, 'start handle was moved');
    });
});

QUnit.module('regressions', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.element = $('#slider')
            .css('width', 100 + 2 * CONTAINER_MARGIN)
            .dxRangeSlider({
                max: 100,
                min: 0,
                start: 20,
                end: 60,
                useInkRipple: false
            });

        const handles = this.element.find('.' + SLIDER_HANDLE_CLASS);
        this.leftHandle = handles.eq(0);
        this.rightHandle = handles.eq(1);
        this.range = this.element.find('.' + SLIDER_RANGE_CLASS);
        this.instance = this.element.dxRangeSlider('instance');

    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }

}, () => {
    QUnit.test('change value of invisible element', function(assert) {
        this.instance.option('start', 30);
        this.instance.option('end', 50);

        this.instance.option('visible', false);
        this.instance.option('start', 40);
        this.instance.option('visible', true);

        assert.ok(this.range.outerWidth() > 0, 'range width is not null');
    });

    QUnit.test('min value behaviour', function(assert) {
        pointerMock(this.element).start().move(25 + CONTAINER_MARGIN + this.element.offset().left).click();
        assert.equal(this.instance.option('start'), 25);

        pointerMock(this.element).start().move(45 + CONTAINER_MARGIN + this.element.offset().left).click();
        assert.equal(this.instance.option('end'), 45);
    });

    QUnit.test('incorrect values handling', function(assert) {
        this.instance.option('start', 80);
        assert.equal(this.instance.option('start'), 80);
        assert.equal(this.instance.option('end'), 80);
        isRangeSliderDimensionsMatchOptions('#slider', assert);

        this.instance.option('start', 60);
        assert.equal(this.instance.option('start'), 60);
        assert.equal(this.instance.option('end'), 80);
        isRangeSliderDimensionsMatchOptions('#slider', assert);

        this.instance.option('start', -100);
        assert.equal(this.instance.option('start'), 0);
        isRangeSliderDimensionsMatchOptions('#slider', assert);

        this.instance.option('end', 150);
        assert.equal(this.instance.option('end'), 100);
        isRangeSliderDimensionsMatchOptions('#slider', assert);
    });

    QUnit.test('B230371 - click on handler does not change value', function(assert) {
        pointerMock(this.leftHandle).start().move(this.range.offset().left).click();
        assert.equal(this.instance.option('start'), 20);

        pointerMock(this.rightHandle).start().move(this.range.offset().left + 40).click();
        assert.equal(this.instance.option('end'), 60);
    });

    QUnit.test('only one handler must be highlighted on pressing (B230410)', function(assert) {
        const module = this;

        const leftHandle = module.leftHandle;
        const rightHandle = module.rightHandle;

        let mouse = pointerMock(leftHandle).start().move(leftHandle.offset().left).down();
        module.clock.tick(FEEDBACK_SHOW_TIMEOUT);
        assert.ok(leftHandle.hasClass('dx-state-active'));
        assert.ok(!rightHandle.hasClass('dx-state-active'));

        mouse.up();
        module.clock.tick(FEEDBACK_HIDE_TIMEOUT);
        assert.ok(!leftHandle.hasClass('dx-state-active'));
        assert.ok(!rightHandle.hasClass('dx-state-active'));
        module.clock.tick(FEEDBACK_HIDE_TIMEOUT + 1);

        mouse = pointerMock(rightHandle).start().move(rightHandle.offset().left).down();
        module.clock.tick(FEEDBACK_SHOW_TIMEOUT);
        assert.ok(rightHandle.hasClass('dx-state-active'));
        assert.ok(!leftHandle.hasClass('dx-state-active'));

        mouse.up();
        module.clock.tick(FEEDBACK_HIDE_TIMEOUT);
        assert.ok(!leftHandle.hasClass('dx-state-active'));
        assert.ok(!rightHandle.hasClass('dx-state-active'));
    });

    QUnit.test('B231116', function(assert) {
        this.instance.option({
            width: 10014
        });
        pointerMock(this.leftHandle).start().move(this.range.offset().left).down().move(10000).up();
        assert.equal(this.instance.option('start'), 60);
        assert.equal(this.instance.option('end'), 100);

        this.instance.option('start', 20);
        pointerMock(this.rightHandle).start().move(this.range.offset().left + 8000).down().move(-10000).up();
        assert.equal(this.instance.option('start'), 0);
        assert.equal(this.instance.option('end'), 20);

    });

    QUnit.test('B233321 dxRangeSlider - impossible to change range in both directions if range slider touch points are under each other.', function(assert) {
        const module = this;

        module.instance.option({
            'start': 50,
            'end': 50
        });

        const mouse = pointerMock(module.element.find('.' + SLIDER_WRAPPER_CLASS));
        const hX = module.rightHandle.offset().left + module.rightHandle.outerWidth() / 2;
        const hY = module.rightHandle.offset().top + module.rightHandle.outerHeight() / 2;

        mouse
            .start()
            .move(hX - 1, hY)
            .down()
            .move(-150)
            .up();
        assert.equal(module.instance.option('start'), 0, 'start handler should be in min position');
        assert.equal(module.instance.option('end'), 50, 'end handler should stay in middle');


        module.instance.option({
            'start': 50,
            'end': 50
        });

        mouse
            .start()
            .move(hX, hY)
            .down()
            .move(150)
            .up();
        assert.equal(module.instance.option('start'), 50, 'start handler should be in min position');
        assert.equal(module.instance.option('end'), 100, 'end handler should stay in middle');
    });


    QUnit.test('B234545 dxRangeSlider/dxSlider - incorrect behavior with negative min and max values.', function(assert) {
        this.instance.option({
            'min': -10,
            'max': -10
        });
        const range = this.element.find('.' + SLIDER_RANGE_CLASS);
        assert.equal(range.width(), 0);
    });

    QUnit.test('B234627 dxRangeSlider: handler can run from cursor', function(assert) {
        this.instance.option({
            max: 100,
            start: 0,
            end: 80,
            step: 1,
            width: 1014
        });

        const mouse = pointerMock(this.rightHandle);
        let hX = this.rightHandle.offset().left + this.rightHandle.outerWidth() / 2;
        let hY = this.rightHandle.offset().top + this.rightHandle.outerHeight() / 2;

        mouse
            .start()
            .move(hX, hY)
            .down()
            .move(-100)
            .up();

        hX = this.rightHandle.offset().left + this.rightHandle.outerWidth() / 2,
        hY = this.rightHandle.offset().top + this.rightHandle.outerHeight() / 2;

        mouse
            .start()
            .move(hX, hY)
            .down()
            .move(100)
            .up();

        assert.equal(this.instance.option('end'), 80, 'we should back to initial position');
    });

    QUnit.test('B235276 dxRangeSlider - incorrect highlight when move handles from overlap position.', function(assert) {
        const module = this;

        module.instance.option({
            'start': 50,
            'end': 50
        });

        const mouse = pointerMock(module.element.find('.' + SLIDER_WRAPPER_CLASS));
        const hX = module.rightHandle.offset().left + module.rightHandle.outerWidth() / 2;
        const hY = module.rightHandle.offset().top + module.rightHandle.outerHeight() / 2;

        const leftHandle = module.leftHandle;
        const rightHandle = module.rightHandle;

        assert.equal(leftHandle.hasClass('dx-state-active'), false);
        assert.equal(rightHandle.hasClass('dx-state-active'), false);

        mouse
            .start()
        // TODO: get rid of 1px;
            .move(hX - 1, hY)
            .down()
            .move(-30);

        assert.equal(leftHandle.hasClass('dx-state-active'), true, 'left handler should be active');
        assert.equal(rightHandle.hasClass('dx-state-active'), false);

        mouse.up();
        module.clock.tick(FEEDBACK_HIDE_TIMEOUT);
        assert.ok(!leftHandle.hasClass('dx-state-active'));
        assert.equal(leftHandle.hasClass('dx-state-active'), false);
        assert.equal(rightHandle.hasClass('dx-state-active'), false);
    });

    QUnit.test('B236168 - when we set startValue greater than endValue we lost handle', function(assert) {
        this.instance.option({
            min: 0,
            max: 100,
            start: 20,
            end: 80,
            step: 1,
            width: 10014
        });
        this.instance.option('start', -20);
        this.instance.option('end', -30);

        assert.equal(this.instance.option('start'), 0, 'start value is equal to min value');
        assert.equal(this.instance.option('end'), 0, 'end value is equal to min');
        isRangeSliderDimensionsMatchOptions('#slider', assert);

        const mouse = pointerMock(this.element.find('.' + SLIDER_WRAPPER_CLASS));
        let hX = this.leftHandle.offset().left + this.leftHandle.outerWidth() / 2;
        let hY = this.leftHandle.offset().top + this.leftHandle.outerHeight() / 2;

        mouse
            .start()
            .move(hX, hY)
            .click();

        assert.equal(this.instance.option('start'), 0, 'start value is equal min value');
        assert.equal(this.instance.option('end'), 0, 'end value is equal min value');
        isRangeSliderDimensionsMatchOptions('#slider', assert);

        this.instance.option('start', 130);
        this.instance.option('end', 110);

        assert.equal(this.instance.option('start'), 100, 'start value is equal to max value');
        assert.equal(this.instance.option('end'), 100, 'end value is equal to max values');
        isRangeSliderDimensionsMatchOptions('#slider', assert);

        hX = this.rightHandle.offset().left;
        hY = this.rightHandle.offset().top;

        mouse
            .start()
            .move(hX, hY)
            .click();

        assert.equal(this.instance.option('start'), 100, 'start value is equal max');
        assert.equal(this.instance.option('end'), 100, 'end value is equal max');
        isRangeSliderDimensionsMatchOptions('#slider', assert);

        this.instance.option('start', 50);
        this.instance.option('end', 150);

        hX = this.leftHandle.offset().left;
        hY = this.leftHandle.offset().top;

        mouse
            .start()
            .move(hX, hY)
            .click();

        assert.equal(this.instance.option('end'), 100, 'end value is equal max');
        isRangeSliderDimensionsMatchOptions('#slider', assert);

        this.instance.option('start', -50);
        this.instance.option('end', 50);

        hX = this.rightHandle.offset().left;
        hY = this.rightHandle.offset().top;

        mouse
            .start()
            .move(hX, hY)
            .click();

        assert.equal(this.instance.option('start'), 0, 'start value is equal min');
        isRangeSliderDimensionsMatchOptions('#slider', assert);
    });

    QUnit.test('B235978 - value may be bigger max option', function(assert) {
        this.instance.option({
            min: 0,
            max: 10,
            start: 1.3,
            end: 9.1,
            step: 1.3,
            width: 100
        });
        const mouse = pointerMock(this.element.find('.' + SLIDER_WRAPPER_CLASS));
        let hX = this.rightHandle.offset().left + this.rightHandle.outerWidth() / 2;
        let hY = this.rightHandle.offset().top + this.rightHandle.outerHeight() / 2;

        mouse
            .start()
            .move(hX, hY)
            .down()
            .move(8)
            .up();

        assert.equal(this.instance.option('end'), 10);

        hX = this.rightHandle.offset().left + this.rightHandle.outerWidth() / 2;
        hY = this.rightHandle.offset().top + this.rightHandle.outerHeight() / 2;

        mouse
            .down()
            .move(18)
            .up();

        assert.equal(this.instance.option('end'), 10);
    });

    QUnit.test('B238710 dxRangeSlider: click on left side of element sets up value that less than minimum', function(assert) {
        pointerMock(this.element.find('.' + SLIDER_WRAPPER_CLASS))
            .start()
            .move(this.element.offset().left + this.leftHandle.outerWidth() / 2 - 1)
            .down()
            .up();

        assert.equal(this.instance.option('start'), 0);
    });
});

QUnit.module('RTL', moduleOptions, () => {
    QUnit.test('render value', function(assert) {
        const $element = $('#slider').css('width', 960 + 2 * CONTAINER_MARGIN);

        $element.dxRangeSlider({
            max: 100,
            min: 0,
            start: 0,
            end: 100,
            rtlEnabled: true
        });

        const slider = $element.dxRangeSlider('instance');

        assert.ok($element.hasClass('dx-rtl'));
        isRangeSliderDimensionsMatchOptions('#slider', assert);

        slider.option('start', 50);

        isRangeSliderDimensionsMatchOptions('#slider', assert);

        slider.option('end', 50);

        isRangeSliderDimensionsMatchOptions('#slider', assert);

        slider.option('rtlEnabled', false);
        assert.ok(!$element.hasClass('dx-rtl'));
    });

    QUnit.test('mousedown/touchstart on slider set new value', function(assert) {
        const $element = $('#slider').dxRangeSlider({
            max: 500,
            min: 0,
            start: 0,
            end: 500,
            rtlEnabled: true
        }).css('width', 500 + 2 * CONTAINER_MARGIN);

        const instance = $element.dxRangeSlider('instance');

        pointerMock($element).start().move(240 + $element.offset().left + CONTAINER_MARGIN).down();
        assert.equal(instance.option('start'), 0);
        assert.equal(instance.option('end'), 260);
        isRangeSliderDimensionsMatchOptions('#slider', assert);

        pointerMock($element).start().move(450 + $element.offset().left + CONTAINER_MARGIN).down();
        assert.equal(instance.option('start'), 50);
        assert.equal(instance.option('end'), 260);
        isRangeSliderDimensionsMatchOptions('#slider', assert);

        pointerMock($element).start().move(500 + $element.offset().left + CONTAINER_MARGIN).down();
        assert.equal(instance.option('start'), 0);
        assert.equal(instance.option('end'), 260);
        isRangeSliderDimensionsMatchOptions('#slider', assert);
    });

    QUnit.test('correct handle is moved by click in RTL mode (T106708)', function(assert) {
        const $element = $('#slider').dxRangeSlider({
            min: 0,
            max: 100,
            start: 25,
            end: 75,
            rtlEnabled: true
        }).css('width', 100 + 2 * CONTAINER_MARGIN);
        const pointer = pointerMock($element).start();

        pointer.move(10 + $element.offset().left + CONTAINER_MARGIN).down().up();

        assert.equal($element.dxRangeSlider('option', 'start'), 25);
        assert.equal($element.dxRangeSlider('option', 'end'), 90);

        pointer.move(40).down().up();

        assert.equal($element.dxRangeSlider('option', 'start'), 50);
        assert.equal($element.dxRangeSlider('option', 'end'), 90);
    });
});

QUnit.module('option value', () => {
    QUnit.test('onValueChanged event should be fired with correct arguments', function(assert) {
        const start = 15;
        const end = 45;
        const expectedFields = [
            'component', 'element', 'event', 'previousValue', 'value', 'start', 'end'
        ];
        const instance = $('#slider').dxRangeSlider({
            value: [0, end]
        }).dxRangeSlider('instance');

        instance.option('onValueChanged', function(args) {
            expectedFields.forEach(field => {
                assert.ok(field in args, `argument has ${field} field`);
            });
        });
        instance.option('value', [start, end]);
    });

    QUnit.test('onValueChanged should be called once when value is changed one time', function(assert) {
        const onValueChangedStub = sinon.stub();

        const instance = $('#slider').dxRangeSlider({
            value: [10, 30],
            onValueChanged: onValueChangedStub
        }).dxRangeSlider('instance');

        instance.option('value', [15, 20]);

        assert.strictEqual(onValueChangedStub.callCount, 1);
    });

    QUnit.test('Exception shouldn\'t be throw when start value more than end value', function(assert) {
        try {
            let startValue = null;
            let endValue = null;

            const $rangeSlider = $('#slider').dxRangeSlider({
                start: 10,
                end: 20,
                onValueChanged: function(data) {
                    startValue.option('value', data.start);
                    endValue.option('value', data.end);
                }
            });

            const instance = $rangeSlider.dxRangeSlider('instance');

            startValue = $('#start-value').dxNumberBox({
                onValueChanged: function(data) {
                    instance.option('start', data.value);
                }
            }).dxNumberBox('instance');

            endValue = $('#end-value').dxNumberBox({
                onValueChanged: function(data) {
                    instance.option('end', data.value);
                }
            }).dxNumberBox('instance');

            startValue.option({
                value: 30
            });

            assert.deepEqual(instance.option('value'), [30, 30], 'value option is correct');
        } catch(error) {
            assert.ok(false, 'exception was threw:' + error);
        }
    });

    QUnit.test('clear method should set value to default', function(assert) {
        $('#slider').dxRangeSlider({
            value: [10, 30]
        });

        const instance = $('#slider').dxRangeSlider('instance');

        instance.clear();

        assert.deepEqual(instance.option('value'), [40, 60], 'value was cleared to default');
    });
});

QUnit.module('Validation', () => {
    [false, true].forEach((isValid) => {
        QUnit.test(`initial state - isValid = ${isValid}, change the "value" option`, function(assert) {
            const instance = $('#slider').dxRangeSlider({
                value: [10, 30],
                isValid
            }).dxRangeSlider('instance');
            const validatorStub = sinon.stub().returns(!isValid);

            $('#slider').dxValidator({
                validationRules: [{
                    type: 'custom',
                    validationCallback: validatorStub
                }]
            });

            instance.option('value', [15, 20]);

            assert.strictEqual(instance.option('isValid'), !isValid, `"isValid" option is ${!isValid}`);

            const { value } = validatorStub.lastCall.args[0];
            assert.deepEqual(value, [15, 20], '\'value\' argument of the validation callback is correct');
        });

        QUnit.test(`initial state - isValid = ${isValid}, change the "start" option`, function(assert) {
            const instance = $('#slider').dxRangeSlider({
                value: [10, 30],
                isValid
            }).dxRangeSlider('instance');
            const validatorStub = sinon.stub().returns(!isValid);

            $('#slider').dxValidator({
                validationRules: [{
                    type: 'custom',
                    validationCallback: validatorStub
                }]
            });
            instance.option('start', 15);

            assert.strictEqual(instance.option('isValid'), !isValid, `"isValid" option is ${!isValid}`);

            const { value } = validatorStub.lastCall.args[0];
            assert.deepEqual(value, [15, 30], '\'value\' argument of the validation callback is correct');
        });

        QUnit.test(`initial state - isValid = ${isValid}, change the "end" option`, function(assert) {
            const instance = $('#slider').dxRangeSlider({
                value: [10, 30],
                isValid
            }).dxRangeSlider('instance');
            const validatorStub = sinon.stub().returns(!isValid);

            $('#slider').dxValidator({
                validationRules: [{
                    type: 'custom',
                    validationCallback: validatorStub
                }]
            });
            instance.option('end', 15);

            assert.strictEqual(instance.option('isValid'), !isValid, `"isValid" option is ${!isValid}`);

            const { value } = validatorStub.lastCall.args[0];
            assert.deepEqual(value, [10, 15], '\'value\' argument of the validation callback is correct');
        });
    });
});

QUnit.module('valueChanged handler should receive correct event parameter', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();

        this.valueChangedHandler = sinon.stub();
        this.$element = $('#slider').dxRangeSlider({
            min: 0,
            max: 100,
            start: 50,
            end: 80,
            width: 100 + CONTAINER_MARGIN * 2,
            focusStateEnabled: true,
            onValueChanged: this.valueChangedHandler
        });
        this.instance = this.$element.dxRangeSlider('instance');
        this.$handles = this.$element.find(`.${SLIDER_HANDLE_CLASS}`);
        this.$wrapper = this.$element.find(`.${SLIDER_WRAPPER_CLASS}`);
        this.pointer = pointerMock(this.$wrapper);

        this.testProgramChange = (assert) => {
            const value = this.instance.option('value');
            this.instance.option('value', [value[0] - 1, value[1] + 1]);

            const callCount = this.valueChangedHandler.callCount;
            const event = this.valueChangedHandler.getCall(callCount - 1).args[0].event;
            assert.strictEqual(event, undefined, 'event is undefined');
        };
        this.checkEvent = (assert, type, target, key) => {
            const event = this.valueChangedHandler.getCall(0).args[0].event;
            assert.strictEqual(event.type, type, 'event type is correct');
            assert.strictEqual(event.target, target.get(0), 'event target is correct');
            if(type === 'keydown') {
                assert.strictEqual(normalizeKeyName(event), normalizeKeyName({ key }), 'event key is correct');
            }
        };
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test('on value program change', function(assert) {
        this.testProgramChange(assert);
    });

    QUnit.test('on handle swipe', function(assert) {
        this.pointer
            .start()
            .down(this.$wrapper.offset().left + CONTAINER_MARGIN + 50, this.$wrapper.offset().top)
            .move(20);

        this.checkEvent(assert, 'dxswipe', this.$wrapper);
        this.testProgramChange(assert);
    });

    QUnit.test('on handle swipeend (correction after swipe on float step)', function(assert) {
        this.pointer
            .start()
            .down(this.$wrapper.offset().left + CONTAINER_MARGIN + 50, this.$wrapper.offset().top)
            .move(9.666692444513187)
            .swipeStart()
            .swipeEnd();

        const event = this.valueChangedHandler.getCall(1).args[0].event;
        assert.strictEqual(event.type, 'dxswipeend', 'event type is correct');
        assert.strictEqual(event.target, this.$wrapper.get(0), 'event target is correct');

        this.testProgramChange(assert);
    });

    QUnit.test('on click on slider scale', function(assert) {
        this.pointer.start().move(10 + this.$element.offset().left).down();

        this.checkEvent(assert, 'dxpointerdown', this.$wrapper);
        this.testProgramChange(assert);
    });

    [0, 1].forEach(handlerNumber => {
        QUnit.module(`on ${handlerNumber === 0 ? 'left' : 'right'} handle`, {
            beforeEach: function() {
                this.$handle = this.$handles.eq(handlerNumber);
                this.keyboard = keyboardMock(this.$handle);
            }
        }, () => {
            ['rightArrow', 'leftArrow', 'home', 'end', 'pageUp', 'pageDown'].forEach(key => {
                QUnit.test(`on ${key} press`, function(assert) {
                    this.keyboard.press(key);

                    this.checkEvent(assert, 'keydown', this.$handle, key);
                    this.testProgramChange(assert);
                });
            });
        });
    });
});

QUnit.module('valueChangeMode option', {
    beforeEach: function() {
        this.valueChangedHandler = sinon.stub();
        this.$element = $('#slider').dxRangeSlider({
            max: 100,
            min: 0,
            start: 20,
            end: 60,
            valueChangeMode: 'onHandleRelease',
            onValueChanged: this.valueChangedHandler,
            tooltip: {
                enabled: true,
                showMode: 'always'
            }
        });
        this.instance = this.$element.dxRangeSlider('instance');
        this.$handle = this.$element.find(`.${SLIDER_HANDLE_CLASS}`);
        this.leftHandle = this.$handle.eq(0);
        this.rightHandle = this.$handle.eq(1);
        this.leftHandleTooltip = this.leftHandle.find(`.${TOOLTIP_CLASS}`);
        this.rightHandleTooltip = this.rightHandle.find(`.${TOOLTIP_CLASS}`);

        this.range = this.$element.find('.' + SLIDER_RANGE_CLASS);

        this.getLeftTooltipText = () => $.trim(this.leftHandleTooltip.text());
        this.getRightTooltipText = () => $.trim(this.rightHandleTooltip.text());
    }
}, () => {
    QUnit.test('value option should not change on left handle swipe with "onHandleRelease" valueChangeMode', function(assert) {
        const pointer = pointerMock(this.leftHandle);
        pointer.start().move(this.range.offset().left).down().move(200);

        assert.notOk(this.valueChangedHandler.called, 'the onValueChanged is not called');

        pointer.up();

        assert.equal(this.instance.option('start'), 40);
        assert.ok(this.valueChangedHandler.called, 'the onValueChanged is called');
    });

    QUnit.test('value option should not change on right handle swipe with "onHandleRelease" valueChangeMode', function(assert) {
        const pointer = pointerMock(this.rightHandle);
        pointer.start().down(this.rightHandle.offset().left + CONTAINER_MARGIN).move(200);

        assert.notOk(this.valueChangedHandler.called, 'the onValueChanged is not called');

        pointer.up();

        assert.equal(this.instance.option('end'), 80);
        assert.ok(this.valueChangedHandler.called, 'the onValueChanged is called');
    });

    QUnit.test('tooltip value should change on left handle swipe with "onHandleRelease" valueChangeMode', function(assert) {
        const pointer = pointerMock(this.leftHandle);
        pointer.start()
            .down(this.range.offset().left)
            .move(200);

        assert.strictEqual(this.getLeftTooltipText(), '40');

        pointer.move(400).up();

        assert.strictEqual(this.getLeftTooltipText(), '60');
    });

    QUnit.test('tooltip value should change on right handle swipe with "onHandleRelease" valueChangeMode', function(assert) {
        const pointer = pointerMock(this.rightHandle);
        pointer.start().down(this.rightHandle.offset().left + CONTAINER_MARGIN).move(200);

        assert.strictEqual(this.getRightTooltipText(), '80');

        pointer.move(100).up();

        assert.strictEqual(this.getRightTooltipText(), '90');
    });

    QUnit.test('value should be correctly updated when right handle is moved through left handle', function(assert) {
        this.instance.option('start', 40);
        const pointer = pointerMock(this.rightHandle);
        pointer.start().down(this.rightHandle.offset().left + CONTAINER_MARGIN).move(-400).up();

        assert.strictEqual(this.instance.option('start'), 20);
    });

    QUnit.test('value should be correctly updated when left handle is moved through right handle', function(assert) {
        this.instance.option('start', 40);
        const pointer = pointerMock(this.leftHandle);
        pointer.start().down(this.leftHandle.offset().left + CONTAINER_MARGIN).move(400).up();

        assert.strictEqual(this.instance.option('end'), 80);
    });

    QUnit.test('tooltip value should be correctly updated when handle value is 0', function(assert) {
        const pointer = pointerMock(this.rightHandle);
        pointer.start().down(this.rightHandle.offset().left + CONTAINER_MARGIN).move(-600);

        assert.strictEqual(this.getLeftTooltipText(), '0');
    });
});

