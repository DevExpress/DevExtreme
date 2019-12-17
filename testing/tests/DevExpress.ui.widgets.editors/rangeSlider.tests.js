import $ from 'jquery';
import Tooltip from 'ui/tooltip';
import keyboardMock from '../../helpers/keyboardMock.js';
import pointerMock from '../../helpers/pointerMock.js';
import fx from 'animation/fx';

import 'ui/range_slider';
import 'ui/number_box/number_box';
import 'ui/validator';
import 'common.css!';

QUnit.testStart(function() {
    var markup =
        '<div id="slider"></div><div id="start-value"></div><div id="end-value"></div>';

    $('#qunit-fixture').html(markup);
});

var SLIDER_CLASS = 'dx-slider',
    SLIDER_WRAPPER_CLASS = SLIDER_CLASS + '-wrapper',
    SLIDER_RANGE_CLASS = SLIDER_CLASS + '-range',
    SLIDER_HANDLE_CLASS = SLIDER_CLASS + '-handle',

    RANGE_SLIDER_CLASS = 'dx-rangeslider',
    RANGE_SLIDER_START_HANDLE_CLASS = RANGE_SLIDER_CLASS + '-start-handle',
    RANGE_SLIDER_END_HANDLE_CLASS = RANGE_SLIDER_CLASS + '-end-handle',

    FOCUSED_STATE_CLASS = 'dx-state-focused',

    TOOLTIP_CLASS = 'dx-popover',

    FEEDBACK_SHOW_TIMEOUT = 30,
    FEEDBACK_HIDE_TIMEOUT = 400;

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


QUnit.module('render', moduleOptions);

QUnit.test('onContentReady fired after the widget is fully ready', function(assert) {
    assert.expect(1);

    $('#slider').dxRangeSlider({
        onContentReady: function(e) {
            assert.ok($(e.element).hasClass(RANGE_SLIDER_CLASS));
        }
    });
});

QUnit.test('render value', function(assert) {
    var el = $('#slider').css('width', 960);

    el.dxRangeSlider({
        max: 100,
        min: 0,
        start: 0,
        end: 100,
        useInkRipple: false
    });

    var slider = el.dxRangeSlider('instance');

    var handleStart = el.find('.' + SLIDER_HANDLE_CLASS).eq(0),
        handleEnd = el.find('.' + SLIDER_HANDLE_CLASS).eq(1),
        range = el.find('.' + SLIDER_RANGE_CLASS);

    assert.equal(handleStart.position().left, 0);
    assert.equal(handleEnd.position().left, 960);
    assert.equal(range.width(), 960);

    slider.option('start', 50);

    assert.equal(range.position().left, 960 / 2);
    assert.equal(range.width(), 960 / 2);

    slider.option('end', 50);

    assert.equal(range.position().left + range.width(), 960 / 2);
    assert.equal(range.width(), 0);
});

QUnit.test('mousedown/touchstart on slider set new value', function(assert) {
    var el = $('#slider').dxRangeSlider({
        max: 500,
        min: 0,
        start: 0,
        end: 500,
        useInkRipple: false
    }).css('width', 500);

    var range = el.find('.' + SLIDER_RANGE_CLASS);

    pointerMock(el).start().move(240 + el.offset().left).down();
    assert.equal(range.position().left, 240);
    assert.equal(range.position().left + range.width(), 500);
    assert.equal(range.width(), 260);

    pointerMock(el).start().move(450 + el.offset().left).down();
    assert.equal(range.position().left, 240);
    assert.equal(range.position().left + range.width(), 450);
    assert.equal(range.width(), 210);

    pointerMock(el).start().move(500 + el.offset().left).down();
    assert.equal(range.position().left, 240);
    assert.equal(range.position().left + range.width(), 500);
    assert.equal(range.width(), 260);
});

QUnit.test('value change should have jQuery event', function(assert) {
    var el = $('#slider').dxRangeSlider({
        max: 500,
        min: 0,
        start: 0,
        end: 500,
        onValueChanged: function(args) {
            assert.ok(args.event, 'Event present');
        },
        useInkRipple: false
    }).css('width', 500);

    pointerMock(el).start().move(240 + el.offset().left).down();
});


QUnit.module('slider with tooltip');

QUnit.test('tooltip default rendering', function(assert) {
    var $slider = $('#slider').dxRangeSlider({
            tooltip: {
                enabled: true,
                showMode: 'always'
            },
            useInkRipple: false
        }),

        $handle = $slider.find('.' + SLIDER_HANDLE_CLASS),
        $tooltips = $handle.find('.' + TOOLTIP_CLASS);

    assert.equal($tooltips.length, 2);
    assert.ok(Tooltip.getInstance($tooltips.eq(0)));
    assert.ok(Tooltip.getInstance($tooltips.eq(1)));
});

QUnit.test('\'tooltip.format\' should not be called for \'value\' option', function(assert) {
    var formatLog = [];

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
        },
        useInkRipple: false
    });

    assert.equal($.inArray(300, formatLog), -1);
});

QUnit.module('user interaction');

QUnit.test('activeHandle should be changed is drag cross over handler', function(assert) {
    fx.off = true;
    var $element = $('#slider').dxRangeSlider({
        max: 100,
        min: 0,
        start: 40,
        end: 60,
        width: 100,
        useInkRipple: false
    });

    var $wrapper = $element.find('.' + SLIDER_WRAPPER_CLASS),
        $range = $element.find('.' + SLIDER_RANGE_CLASS),
        pointer = pointerMock($wrapper);

    pointer.start().down($wrapper.offset().left + 40, $wrapper.offset().top).move(40);
    assert.equal($range.position().left, 60);
    assert.equal($range.position().left + $range.width(), 80);
    pointer.up();

    pointer.start().down($wrapper.offset().left + 80, $wrapper.offset().top).move(-50);
    assert.equal($range.position().left, 30);
    assert.equal($range.position().left + $range.width(), 60);
    pointer.up();
});

QUnit.test('activeHandle should be changed is drag cross over handler when min was set', function(assert) {
    fx.off = true;
    var $element = $('#slider').dxRangeSlider({
        max: 160,
        min: 60,
        start: 120,
        end: 140,
        width: 100,
        useInkRipple: false
    });

    var $wrapper = $element.find('.' + SLIDER_WRAPPER_CLASS),
        $range = $element.find('.' + SLIDER_RANGE_CLASS),
        pointer = pointerMock($wrapper);

    pointer.start().down($wrapper.offset().left + 80, $wrapper.offset().top).move(-40);
    assert.equal($range.position().left, 40);
    assert.equal($range.position().left + $range.width(), 60);
    pointer.up();
});

QUnit.test('activeHandle should be changed is drag cross over handler (RTL)', function(assert) {
    var $element = $('#slider').dxRangeSlider({
        max: 100,
        min: 0,
        start: 40,
        end: 60,
        width: 100,
        rtlEnabled: true,
        useInkRipple: false
    });

    var $wrapper = $element.find('.' + SLIDER_WRAPPER_CLASS),
        $range = $element.find('.' + SLIDER_RANGE_CLASS),
        pointer = pointerMock($wrapper);

    pointer.start().down($wrapper.offset().left + 40, $wrapper.offset().top).move(40);
    assert.equal($range.position().left, 60);
    assert.equal($range.position().left + $range.width(), 80);
    pointer.up();

    pointer.start().down($wrapper.offset().left + 80, $wrapper.offset().top).move(-50);
    assert.equal($range.position().left, 30);
    assert.equal($range.position().left + $range.width(), 60);
    pointer.up();
});


QUnit.module('actions');

QUnit.test('onValueChanged should be fired after value is changed', function(assert) {
    var onValueChangedStub = sinon.stub();

    var el = $('#slider').dxRangeSlider({
        max: 500,
        min: 0,
        start: 0,
        end: 500,
        onValueChanged: onValueChangedStub,
        useInkRipple: false
    }).css('width', 500);

    pointerMock(el).start().move(250 + el.offset().left).down();

    assert.ok(onValueChangedStub.called, 'onValueChanged was fired');
});

QUnit.test('onValueChanged should be fired when dxRangeSlider is readOnly', function(assert) {
    var onValueChangedStub = sinon.stub();

    var slider = $('#slider').dxRangeSlider({
        readOnly: true,
        max: 100,
        min: 0,
        start: 20,
        end: 60,
        onValueChanged: onValueChangedStub,
        useInkRipple: false
    }).dxRangeSlider('instance');

    slider.option('start', 30);

    assert.ok(onValueChangedStub.called, 'onValueChanged was fired');
});

QUnit.test('onValueChanged should be fired when dxRangeSlider is disabled', function(assert) {
    var onValueChangedStub = sinon.stub();

    var slider = $('#slider').dxRangeSlider({
        disabled: true,
        max: 100,
        min: 0,
        start: 20,
        end: 60,
        onValueChanged: onValueChangedStub,
        useInkRipple: false
    }).dxRangeSlider('instance');

    slider.option('start', 30);

    assert.ok(onValueChangedStub.called, 'onValueChanged was fired');
});


QUnit.module('focus policy', moduleOptions);

QUnit.testInActiveWindow('Handle focus by click on track bar (T249311)', function(assert) {
    assert.expect(2);

    var $rangeSlider = $('#slider').dxRangeSlider({
            max: 100,
            min: 0,
            start: 40,
            end: 60,
            width: 100,
            focusStateEnabled: true,
            useInkRipple: false
        }),
        $handles = $rangeSlider.find('.' + SLIDER_HANDLE_CLASS),
        $leftHandle = $handles.eq(0),
        $rightHandle = $handles.eq(1),
        pointer = pointerMock($rangeSlider);

    pointer.start().down($rangeSlider.offset().left + 20, $rangeSlider.offset().top).up();
    assert.ok($leftHandle.hasClass('dx-state-focused'), 'left handle has focus class after click on track');

    pointer.start().down($rangeSlider.offset().left + 80, $rangeSlider.offset().top).up();
    assert.ok($rightHandle.hasClass('dx-state-focused'), 'right handle has focus class after click on track');
});


QUnit.module('keyboard navigation', moduleOptions);

QUnit.test('control keys test', function(assert) {
    assert.expect(8);

    var $rangeSlider = $('#slider').dxRangeSlider({
            min: 10,
            max: 90,
            start: 50,
            end: 80,
            step: 3,
            focusStateEnabled: true,
            useInkRipple: false
        }),
        rangeSlider = $rangeSlider.dxRangeSlider('instance'),
        $handles = $rangeSlider.find('.' + SLIDER_HANDLE_CLASS),
        $leftHandle = $handles.eq(0),
        $rightHandle = $handles.eq(1),
        keyboard = keyboardMock($leftHandle);

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

    var $rangeSlider = $('#slider').dxRangeSlider({
            min: 10,
            max: 90,
            start: 50,
            end: 80,
            keyStep: 1,
            focusStateEnabled: true,
            useInkRipple: false
        }),
        rangeSlider = $rangeSlider.dxRangeSlider('instance'),
        $handles = $rangeSlider.find('.' + SLIDER_HANDLE_CLASS),
        $leftHandle = $handles.eq(0),
        $rightHandle = $handles.eq(1),
        keyboard = keyboardMock($leftHandle);

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

    var $rangeSlider = $('#slider').dxRangeSlider({
            rtlEnabled: true,
            min: 10,
            max: 90,
            start: 50,
            end: 80,
            step: 3,
            focusStateEnabled: true,
            useInkRipple: false
        }),
        rangeSlider = $rangeSlider.dxRangeSlider('instance'),
        $handles = $rangeSlider.find('.' + SLIDER_HANDLE_CLASS),
        $leftHandle = $handles.eq(0),
        $rightHandle = $handles.eq(1),
        keyboard = keyboardMock($leftHandle);

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

    var $rangeSlider = $('#slider').dxRangeSlider({
            rtlEnabled: true,
            min: 10,
            max: 90,
            start: 50,
            end: 80,
            keyStep: 1,
            focusStateEnabled: true,
            useInkRipple: false
        }),
        rangeSlider = $rangeSlider.dxRangeSlider('instance'),
        $handles = $rangeSlider.find('.' + SLIDER_HANDLE_CLASS),
        $leftHandle = $handles.eq(0),
        $rightHandle = $handles.eq(1),
        keyboard = keyboardMock($leftHandle);

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
    var $rangeSlider = $('#slider').dxRangeSlider({
            start: 29,
            end: 30,
            focusStateEnabled: true,
            useInkRipple: false
        }),
        rangeSlider = $rangeSlider.dxRangeSlider('instance'),
        $startHandle = $rangeSlider.find('.' + RANGE_SLIDER_START_HANDLE_CLASS),
        $endHandle = $rangeSlider.find('.' + RANGE_SLIDER_END_HANDLE_CLASS),
        keyboard = keyboardMock($startHandle);

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
    var $rangeSlider = $('#slider').dxRangeSlider({
            rtlEnabled: true,
            start: 30,
            end: 31,
            focusStateEnabled: true,
            useInkRipple: false
        }),
        rangeSlider = $rangeSlider.dxRangeSlider('instance'),
        $startHandle = $rangeSlider.find('.' + RANGE_SLIDER_START_HANDLE_CLASS),
        $endHandle = $rangeSlider.find('.' + RANGE_SLIDER_END_HANDLE_CLASS),
        keyboard = keyboardMock($endHandle);

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
    var $rangeSlider = $('#slider').dxRangeSlider({
            rtlEnabled: true,
            start: 29,
            end: 30,
            focusStateEnabled: true,
            useInkRipple: false
        }),
        rangeSlider = $rangeSlider.dxRangeSlider('instance'),
        $startHandle = $rangeSlider.find('.' + RANGE_SLIDER_START_HANDLE_CLASS),
        $endHandle = $rangeSlider.find('.' + RANGE_SLIDER_END_HANDLE_CLASS),
        keyboard = keyboardMock($startHandle);

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
    var $rangeSlider = $('#slider').dxRangeSlider({
            start: 30,
            end: 31,
            focusStateEnabled: true,
            useInkRipple: false
        }),
        rangeSlider = $rangeSlider.dxRangeSlider('instance'),
        $startHandle = $rangeSlider.find('.' + RANGE_SLIDER_START_HANDLE_CLASS),
        $endHandle = $rangeSlider.find('.' + RANGE_SLIDER_END_HANDLE_CLASS),
        keyboard = keyboardMock($endHandle);

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

QUnit.module('regressions', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.element = $('#slider')
            .css('width', 100)
            .dxRangeSlider({
                max: 100,
                min: 0,
                start: 20,
                end: 60,
                useInkRipple: false
            });

        var handles = this.element.find('.' + SLIDER_HANDLE_CLASS);
        this.leftHandle = handles.eq(0);
        this.rightHandle = handles.eq(1);
        this.range = this.element.find('.' + SLIDER_RANGE_CLASS);
        this.instance = this.element.dxRangeSlider('instance');

    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }

});

QUnit.test('change value of invisible element', function(assert) {
    this.instance.option('start', 30);
    this.instance.option('end', 50);

    this.instance.option('visible', false);
    this.instance.option('start', 40);
    this.instance.option('visible', true);

    assert.ok(this.range.outerWidth() > 0, 'range width is not null');
});

QUnit.test('min value behaviour', function(assert) {
    pointerMock(this.element).start().move(25 + this.element.offset().left).click();
    assert.equal(this.instance.option('start'), 25);

    pointerMock(this.element).start().move(45 + this.element.offset().left).click();
    assert.equal(this.instance.option('end'), 45);
});

QUnit.test('incorrect values handling', function(assert) {
    this.instance.option('start', 80);
    assert.equal(this.instance.option('start'), 80);
    assert.equal(this.instance.option('end'), 80);
    assert.equal(this.range.position().left, 80);
    assert.equal(this.range.position().left + this.range.width(), 80);

    this.instance.option('start', 60);
    assert.equal(this.instance.option('start'), 60);
    assert.equal(this.instance.option('end'), 80);
    assert.equal(this.range.position().left, 60);
    assert.equal(this.range.position().left + this.range.width(), 80);

    this.instance.option('start', -100);
    assert.equal(this.instance.option('start'), 0);
    assert.equal(this.leftHandle.position().left, 0);

    this.instance.option('end', 150);
    assert.equal(this.instance.option('end'), 100);
    assert.equal(this.rightHandle.position().left, 100);
});

QUnit.test('B230371 - click on handler does not change value', function(assert) {
    pointerMock(this.leftHandle).start().move(this.leftHandle.offset().left).click();
    assert.equal(this.instance.option('start'), 20);

    pointerMock(this.rightHandle).start().move(this.rightHandle.offset().left).click();
    assert.equal(this.instance.option('end'), 60);
});

QUnit.test('only one handler must be highlighted on pressing (B230410)', function(assert) {
    var module = this;

    var leftHandle = module.leftHandle,
        rightHandle = module.rightHandle;

    var mouse = pointerMock(leftHandle).start().move(leftHandle.offset().left).down();
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
    pointerMock(this.leftHandle).start().move(this.leftHandle.offset().left).down().move(100).up();
    assert.equal(this.instance.option('start'), 60);
    assert.equal(this.instance.option('end'), 100);

    this.instance.option('start', 20);
    pointerMock(this.rightHandle).start().move(this.rightHandle.offset().left).down().move(-100).up();
    assert.equal(this.instance.option('start'), 0);
    assert.equal(this.instance.option('end'), 20);

});

QUnit.test('B233321 dxRangeSlider - impossible to change range in both directions if range slider touch points are under each other.', function(assert) {
    var module = this;

    module.instance.option({
        'start': 50,
        'end': 50
    });

    var mouse = pointerMock(module.element.find('.' + SLIDER_WRAPPER_CLASS)),
        hX = module.rightHandle.offset().left + module.rightHandle.outerWidth() / 2,
        hY = module.rightHandle.offset().top + module.rightHandle.outerHeight() / 2;

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
    var range = this.element.find('.' + SLIDER_RANGE_CLASS);
    assert.equal(range.width(), 0);
});

QUnit.test('B234627 dxRangeSlider: handler can run from cursor', function(assert) {
    this.instance.option({
        max: 100,
        start: 0,
        end: 80,
        step: 1,
        width: 100
    });

    var mouse = pointerMock(this.rightHandle),
        hX = this.rightHandle.offset().left + this.rightHandle.outerWidth() / 2,
        hY = this.rightHandle.offset().top + this.rightHandle.outerHeight() / 2;

    mouse
        .start()
        .move(hX, hY)
        .down()
        .move(-10)
        .up();

    hX = this.rightHandle.offset().left + this.rightHandle.outerWidth() / 2,
    hY = this.rightHandle.offset().top + this.rightHandle.outerHeight() / 2;

    mouse
        .start()
        .move(hX, hY)
        .down()
        .move(10)
        .up();

    assert.equal(this.instance.option('end'), 80, 'we should back to initial position');
});

QUnit.test('B235276 dxRangeSlider - incorrect highlight when move handles from overlap position.', function(assert) {
    var module = this;

    module.instance.option({
        'start': 50,
        'end': 50
    });

    var mouse = pointerMock(module.element.find('.' + SLIDER_WRAPPER_CLASS)),
        hX = module.rightHandle.offset().left + module.rightHandle.outerWidth() / 2,
        hY = module.rightHandle.offset().top + module.rightHandle.outerHeight() / 2;

    var leftHandle = module.leftHandle,
        rightHandle = module.rightHandle;

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

QUnit.test('B236168 -  when we set startValue greater than endValue we lost handle', function(assert) {
    this.instance.option({
        min: 0,
        max: 100,
        start: 20,
        end: 80,
        step: 1,
        width: 100
    });
    this.instance.option('start', -20);
    this.instance.option('end', -30);

    assert.equal(this.instance.option('start'), 0, 'start value is equal to min value');
    assert.equal(this.instance.option('end'), 0, 'end value is equal to min');
    assert.equal(this.leftHandle.position().left, 0, 'start handler should be in min position');
    assert.equal(this.rightHandle.position().left, 0, 'end handler should be in min position');

    var mouse = pointerMock(this.element.find('.' + SLIDER_WRAPPER_CLASS)),
        hX = this.leftHandle.offset().left + this.leftHandle.outerWidth() / 2,
        hY = this.leftHandle.offset().top + this.leftHandle.outerHeight() / 2;

    mouse
        .start()
        .move(hX, hY)
        .click();

    assert.equal(this.instance.option('start'), 0, 'start value is equal min value');
    assert.equal(this.instance.option('end'), 0, 'end value is equal min value');
    assert.equal(this.leftHandle.position().left, 0, 'start handler should be in min position');
    assert.equal(this.rightHandle.position().left, 0, 'end handler should be in min position');

    this.instance.option('start', 130);
    this.instance.option('end', 110);

    assert.equal(this.instance.option('start'), 100, 'start value is equal to max value');
    assert.equal(this.instance.option('end'), 100, 'end value is equal to max values');
    assert.equal(this.range.position().left, 100, 'start handler should be in max position');
    assert.equal(this.range.position().left + this.range.width(), 100, 'end handler should be in max position');

    hX = this.rightHandle.offset().left;
    hY = this.rightHandle.offset().top;

    mouse
        .start()
        .move(hX, hY)
        .click();

    assert.equal(this.instance.option('start'), 100, 'start value is equal max');
    assert.equal(this.instance.option('end'), 100, 'end value is equal max');
    assert.equal(this.range.position().left, 100, 'start handler should be in max position');
    assert.equal(this.range.position().left + this.range.width(), 100, 'end handler should be in max position');

    this.instance.option('start', 50);
    this.instance.option('end', 150);

    hX = this.leftHandle.offset().left;
    hY = this.leftHandle.offset().top;

    mouse
        .start()
        .move(hX, hY)
        .click();

    assert.equal(this.instance.option('end'), 100, 'end value is equal max');
    assert.equal(this.range.position().left + this.range.width(), 100, 'end handler should be in max position');

    this.instance.option('start', -50);
    this.instance.option('end', 50);

    hX = this.rightHandle.offset().left;
    hY = this.rightHandle.offset().top;

    mouse
        .start()
        .move(hX, hY)
        .click();

    assert.equal(this.instance.option('start'), 0, 'start value is equal min');
    assert.equal(this.leftHandle.position().left, 0, 'start handler should be in min position');
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
    var mouse = pointerMock(this.element.find('.' + SLIDER_WRAPPER_CLASS)),
        hX = this.rightHandle.offset().left + this.rightHandle.outerWidth() / 2,
        hY = this.rightHandle.offset().top + this.rightHandle.outerHeight() / 2;

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


QUnit.module('RTL', moduleOptions);

QUnit.test('render value', function(assert) {
    var $element = $('#slider').css('width', 960);

    $element.dxRangeSlider({
        max: 100,
        min: 0,
        start: 0,
        end: 100,
        rtlEnabled: true,
        useInkRipple: false
    });

    var slider = $element.dxRangeSlider('instance');

    var $handleStart = $element.find('.' + SLIDER_HANDLE_CLASS).eq(0),
        $handleEnd = $element.find('.' + SLIDER_HANDLE_CLASS).eq(1),
        $range = $element.find('.' + SLIDER_RANGE_CLASS);

    assert.ok($element.hasClass('dx-rtl'));
    assert.equal($handleStart.position().left, 960 - $handleStart.outerWidth() / 2);
    assert.equal($handleEnd.position().left, -$handleStart.outerWidth() / 2);
    assert.equal($range.width(), 960);

    slider.option('start', 50);

    assert.equal($handleStart.position().left, 960 / 2 - $handleStart.outerWidth() / 2);
    assert.equal($range.width(), 960 / 2);

    slider.option('end', 50);

    assert.equal($range.position().left + $range.width(), 960 / 2);
    assert.equal($range.width(), 0);

    slider.option('rtlEnabled', false);
    assert.ok(!$element.hasClass('dx-rtl'));
});

QUnit.test('mousedown/touchstart on slider set new value', function(assert) {
    var $element = $('#slider').dxRangeSlider({
        max: 500,
        min: 0,
        start: 0,
        end: 500,
        rtlEnabled: true,
        useInkRipple: false
    }).css('width', 500);

    var $range = $element.find('.' + SLIDER_RANGE_CLASS),
        rangeOffset;

    pointerMock($element).start().move(240 + $element.offset().left).down();
    rangeOffset = Math.round($range.position().left);
    assert.equal($range.width() + rangeOffset, 500);
    assert.equal(rangeOffset, 240);
    assert.equal($range.width(), 260);

    pointerMock($element).start().move(450 + $element.offset().left).down();
    rangeOffset = Math.round($range.position().left);
    assert.equal($range.width() + rangeOffset, 450);
    assert.equal(rangeOffset, 240);
    assert.equal($range.width(), 210);

    pointerMock($element).start().move(500 + $element.offset().left).down();
    rangeOffset = Math.round($range.position().left);
    assert.equal($range.width() + rangeOffset, 500);
    assert.equal(rangeOffset, 240);
    assert.equal($range.width(), 260);
});

QUnit.test('correct handle is moved by click in RTL mode (T106708)', function(assert) {
    var $element = $('#slider').dxRangeSlider({
            min: 0,
            max: 100,
            start: 25,
            end: 75,
            rtlEnabled: true,
            useInkRipple: false
        }).css('width', 100),

        pointer = pointerMock($element).start();

    pointer.move(10 + $element.offset().left).down().up();

    assert.equal($element.dxRangeSlider('option', 'start'), 25);
    assert.equal($element.dxRangeSlider('option', 'end'), 90);

    pointer.move(40).down().up();

    assert.equal($element.dxRangeSlider('option', 'start'), 50);
    assert.equal($element.dxRangeSlider('option', 'end'), 90);
});


QUnit.module('option value');

QUnit.test('onValueChanged event should be fired with correct arguments', function(assert) {
    var start = 15,
        end = 45,
        $element = $('#slider').dxRangeSlider({
            value: [0, end]
        }),
        instance = $element.dxRangeSlider('instance');

    instance.option('onValueChanged', function(args) {
        assert.deepEqual(args.value, [start, end], 'value argument got correct value');
    });
    instance.option('value', [start, end]);
});

QUnit.test('onValueChanged should be called once when value is changed one time', function(assert) {
    var onValueChangedStub = sinon.stub();

    var instance = $('#slider').dxRangeSlider({
        value: [10, 30],
        onValueChanged: onValueChangedStub
    }).dxRangeSlider('instance');

    instance.option('value', [15, 20]);

    assert.strictEqual(onValueChangedStub.callCount, 1);
});

QUnit.test('Exception shouldn\'t be throw when start value more than end value', function(assert) {
    try {
        var $rangeSlider = $('#slider').dxRangeSlider({
            start: 10,
            end: 20,
            onValueChanged: function(data) {
                startValue.option('value', data.start);
                endValue.option('value', data.end);
            }
        });

        var instance = $rangeSlider.dxRangeSlider('instance');

        var startValue = $('#start-value').dxNumberBox({
            onValueChanged: function(data) {
                instance.option('start', data.value);
            }
        }).dxNumberBox('instance');

        var endValue = $('#end-value').dxNumberBox({
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

QUnit.test('reset method should set value to default', function(assert) {
    $('#slider').dxRangeSlider({
        value: [10, 30]
    });

    var instance = $('#slider').dxRangeSlider('instance');

    instance.reset();

    assert.deepEqual(instance.option('value'), [40, 60], 'value was reset to default');
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
