import $ from 'jquery';
import themes from 'ui/themes';
import 'ui/slider';

import 'common.css!';

const SLIDER_CLASS = 'dx-slider';
const SLIDER_HANDLE_CLASS = 'dx-slider-handle';
const SLIDER_RANGE_CLASS = SLIDER_CLASS + '-range';
const SLIDER_BAR_CLASS = 'dx-slider-bar';
const SLIDER_RANGE_VISIBLE_CLASS = SLIDER_RANGE_CLASS + '-visible';
const SLIDER_LABEL_CLASS = SLIDER_CLASS + '-label';

const { module, testStart, test } = QUnit;

testStart(function() {
    const markup = `
        <div id="slider"></div>
        <div id="widget"></div>
        <div id="widthRootStyle" style="width: 300px;"></div>`;

    $('#qunit-fixture').html(markup);
});

module('slider markup', () => {
    test('default', assert => {
        const $sliderElement = $('#slider').dxSlider({
            useInkRipple: false
        });

        assert.ok($sliderElement.hasClass(SLIDER_CLASS), 'slider has correct class');

        const $handle = $sliderElement.find('.' + SLIDER_HANDLE_CLASS);

        assert.ok($handle.length, 'handle is rendered');

        const $range = $sliderElement.find('.' + SLIDER_RANGE_CLASS);

        assert.ok($range.length, 'range is rendered');

        const $bar = $sliderElement.find('.' + SLIDER_BAR_CLASS);

        assert.ok($bar.length, 'bar is rendered');
    });

    test('\'showRange\' option should toggle class to range element', assert => {
        const slider = $('#slider').dxSlider({
            showRange: true,
            useInkRipple: false
        }).dxSlider('instance');

        assert.ok($('.' + SLIDER_RANGE_CLASS).hasClass(SLIDER_RANGE_VISIBLE_CLASS));

        slider.option('showRange', false);
        assert.ok(!$('.' + SLIDER_RANGE_CLASS).hasClass(SLIDER_RANGE_VISIBLE_CLASS));
    });

    test('labels visibility', assert => {
        const $slider = $('#slider').dxSlider({
            min: 0,
            max: 100,
            label: {
                visible: true
            },
            useInkRipple: false
        });

        const $sliderLabels = $slider.find('.' + SLIDER_LABEL_CLASS);
        assert.equal($sliderLabels.length, 2, 'labels are rendered');
    });

    test('labels visiility - format', assert => {
        const $slider = $('#slider').dxSlider({
            label: {
                visible: true,
                format: function(value) {
                    return '[' + value + ']';
                }
            },
            useInkRipple: false
        });

        const $sliderLabels = $slider.find('.' + SLIDER_LABEL_CLASS);
        assert.equal($sliderLabels.eq(0).html(), '[0]');
        assert.equal($sliderLabels.eq(1).html(), '[100]');

        $slider.dxSlider('option', 'label.format', function(value) {
            return '(' + value + ')';
        });
        assert.equal($sliderLabels.eq(0).html(), '(0)');
        assert.equal($sliderLabels.eq(1).html(), '(100)');
    });

    test('labels visiility - position', assert => {
        const $slider = $('#slider').dxSlider({
            label: {
                visible: true,
                position: 'top'
            },
            useInkRipple: false
        });

        assert.ok($slider.hasClass('dx-slider-label-position-top'));
        assert.ok(!$slider.hasClass('dx-slider-label-position-bottom'));

        $slider.dxSlider('option', 'label.position', 'bottom');
        assert.ok($slider.hasClass('dx-slider-label-position-bottom'));
        assert.ok(!$slider.hasClass('dx-slider-label-position-top'));

        $slider.dxSlider('option', 'label.visible', false);
        assert.ok(!$slider.hasClass('dx-slider-label-position-bottom'));
        assert.ok(!$slider.hasClass('dx-slider-label-position-top'));
    });

    test('set the validationMessageOffset for the Generic theme', assert => {
        const slider = $('#slider').dxSlider({
            useInkRipple: false
        }).dxSlider('instance');

        assert.deepEqual(slider.option('validationMessageOffset'), { h: 7, v: 4 });
    });

    test('set the validationMessageOffset for the Material theme', assert => {
        const origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };

        const slider = $('#slider').dxSlider({
            useInkRipple: false
        }).dxSlider('instance');

        assert.deepEqual(slider.option('validationMessageOffset'), { h: 18, v: 0 });

        themes.isMaterial = origIsMaterial;
    });
});

module('widget sizing render', () => {
    test('constructor', assert => {
        const $element = $('#widget').dxSlider({
                width: 400,
                useInkRipple: false
            }),
            instance = $element.dxSlider('instance');

        assert.strictEqual(instance.option('width'), 400);
        assert.strictEqual($element[0].style.width, '400px', 'outer width of the element must be equal to custom width');
    });

    test('root with custom width', assert => {
        const $element = $('#widthRootStyle').dxSlider({
                useInkRipple: false
            }),
            instance = $element.dxSlider('instance');

        assert.strictEqual(instance.option('width'), undefined);
        assert.strictEqual($element[0].style.width, '300px', 'outer width of the element must be equal to custom width');
    });

    test('change width', assert => {
        const $element = $('#widget').dxSlider({
                useInkRipple: false
            }),
            instance = $element.dxSlider('instance'),
            customWidth = 400;

        instance.option('width', customWidth);

        assert.strictEqual($element[0].style.width, customWidth + 'px', 'outer width of the element must be equal to custom width');
    });
});

module('hidden input', () => {
    test('a hidden input should be rendered', assert => {
        const $slider = $('#slider').dxSlider(),
            $input = $slider.find('input');

        assert.equal($input.length, 1, 'input is rendered');
        assert.equal($input.attr('type'), 'hidden', 'the input type is \'hidden\'');
    });

    test('the hidden input should have correct value on widget init', assert => {
        const expectedValue = 30,
            $slider = $('#slider').dxSlider({
                value: expectedValue
            }),
            $input = $slider.find('input');

        assert.equal(parseInt($input.val()), expectedValue, 'the hidden input value is correct');
    });

    test('the hidden input should get correct value on widget value change', assert => {
        const expectedValue = 77,
            $slider = $('#slider').dxSlider(),
            instance = $slider.dxSlider('instance'),
            $input = $slider.find('input');

        instance.option('value', 11);
        instance.option('value', expectedValue);
        assert.equal(parseInt($input.val()), expectedValue, 'the hidden input value is correct');
    });
});

module('aria accessibility', () => {
    test('aria role', assert => {
        const $element = $('#widget').dxSlider({
                useInkRipple: false
            }),
            $handle = $element.find('.dx-slider-handle');

        assert.equal($handle.attr('role'), 'slider', 'aria role is correct');
    });

    test('aria properties', assert => {
        const $element = $('#widget').dxSlider({
                min: 20,
                max: 50,
                value: 35,
                useInkRipple: false
            }),
            $handle = $element.find('.dx-slider-handle');

        assert.equal($handle.attr('aria-valuemin'), 20, 'aria min is correct');
        assert.equal($handle.attr('aria-valuemax'), 50, 'aria max is correct');
        assert.equal($handle.attr('aria-valuenow'), 35, 'aria now is correct');
    });

    test('change aria properties on option changing', assert => {
        const $element = $('#widget').dxSlider({
                min: 20,
                max: 50,
                value: 35,
                useInkRipple: false
            }),
            instance = $element.dxSlider('instance'),
            $handle = $element.find('.dx-slider-handle');

        instance.option({
            min: 25,
            max: 70,
            value: 40
        });

        assert.equal($handle.attr('aria-valuemin'), 25, 'aria min is correct');
        assert.equal($handle.attr('aria-valuemax'), 70, 'aria max is correct');
        assert.equal($handle.attr('aria-valuenow'), 40, 'aria now is correct');
    });
});
