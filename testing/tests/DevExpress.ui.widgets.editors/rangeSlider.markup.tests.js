const $ = require('jquery');
const config = require('core/config');

require('ui/range_slider');

QUnit.testStart(function() {
    const markup =
        '<div id="slider"></div><div id="start-value"></div><div id="end-value"></div>';

    $('#qunit-fixture').html(markup);
});

require('common.css!');

const SLIDER_CLASS = 'dx-slider';

const RANGE_SLIDER_CLASS = 'dx-rangeslider';
const RANGE_SLIDER_START_HANDLE_CLASS = RANGE_SLIDER_CLASS + '-start-handle';
const RANGE_SLIDER_END_HANDLE_CLASS = RANGE_SLIDER_CLASS + '-end-handle';

QUnit.module('rangeSlider markup', () => {
    QUnit.test('default', function(assert) {
        const sliderElement = $('#slider').dxRangeSlider({
            useInkRipple: false
        });

        assert.ok(sliderElement.hasClass(SLIDER_CLASS));
        assert.ok(sliderElement.hasClass(RANGE_SLIDER_CLASS));
    });
});

QUnit.module('hidden inputs', () => {
    QUnit.test('two inputs should be rendered', function(assert) {
        const $element = $('#slider').dxRangeSlider();
        const $inputs = $element.find('input');

        assert.equal($inputs.length, 2, 'inputs are rendered');
    });

    QUnit.test('both inputs should have a \'hidden\' type', function(assert) {
        const $element = $('#slider').dxRangeSlider();
        const $inputs = $element.find('input');

        assert.equal($inputs.eq(0).attr('type'), 'hidden', 'the first input is of the \'hidden\' type');
        assert.equal($inputs.eq(1).attr('type'), 'hidden', 'the second input is of the \'hidden\' type');
    });

    QUnit.test('inputs get correct values on init', function(assert) {
        const initialStart = 15;
        const initialEnd = 45;
        const $element = $('#slider').dxRangeSlider({
            start: initialStart,
            end: initialEnd
        });
        const $inputs = $element.find('input');

        assert.equal($inputs.eq(0).val(), initialStart, 'the first input got correct value');
        assert.equal($inputs.eq(1).val(), initialEnd, 'the second input got correct value');
    });

    QUnit.test('first input gets correct value after widget the \'start\' option change', function(assert) {
        const expectedStart = 33;
        const $element = $('#slider').dxRangeSlider();
        const instance = $element.dxRangeSlider('instance');
        const $input = $element.find('input').eq(0);

        instance.option('start', expectedStart);
        assert.equal($input.val(), expectedStart, 'the first input value is correct');
    });

    QUnit.test('second input gets correct value after widget the \'end\' option change', function(assert) {
        const expectedEnd = 88;
        const $element = $('#slider').dxRangeSlider();
        const instance = $element.dxRangeSlider('instance');
        const $input = $element.find('input').eq(1);

        instance.option('end', expectedEnd);
        assert.equal($input.val(), expectedEnd, 'the second input value is correct');
    });

    QUnit.test('the hidden inputs should use the decimal separator specified in DevExpress.config', function(assert) {
        const originalConfig = config();
        try {
            config({ serverDecimalSeparator: '|' });

            const $element = $('#slider').dxRangeSlider({
                start: 12.25,
                end: 53.64
            });
            const $inputs = $element.find('input');

            assert.equal($inputs.eq(0).val(), '12|25', 'the correct decimal separator is used in the first input');
            assert.equal($inputs.eq(1).val(), '53|64', 'the correct decimal separator is used in the second input');
        } finally {
            config(originalConfig);
        }
    });
});

QUnit.module('\'name\' options', () => {
    QUnit.test('first input should get the \'name\' attribute depending on the \'startName\' option', function(assert) {
        const startName = 'start';
        const $element = $('#slider').dxRangeSlider({
            startName: startName
        });
        const $input = $element.find('input').eq(0);

        assert.equal($input.attr('name'), startName, 'the first input has correct \'name\' attribute');
    });

    QUnit.test('first input should get the \'name\' attribute correctly after the \'startName\' option change', function(assert) {
        const expectedName = 'newName';
        const $element = $('#slider').dxRangeSlider({
            startName: 'initial'
        });
        const instance = $element.dxRangeSlider('instance');
        const $input = $element.find('input').eq(0);

        instance.option('startName', expectedName);
        assert.equal($input.attr('name'), expectedName, 'the first input has correct \'name\' attribute after the \'startName\' option change');
    });

    QUnit.test('second input should get the \'name\' attribute depending on the \'endName\' option', function(assert) {
        const endName = 'end';
        const $element = $('#slider').dxRangeSlider({
            endName: endName
        });
        const $input = $element.find('input').eq(1);

        assert.equal($input.attr('name'), endName, 'the second input has correct \'name\' attribute');
    });

    QUnit.test('second input should get the \'name\' attribute correctly after the \'endName\' option change', function(assert) {
        const expectedName = 'newName';
        const $element = $('#slider').dxRangeSlider({
            endName: 'initial'
        });
        const instance = $element.dxRangeSlider('instance');
        const $input = $element.find('input').eq(1);

        instance.option('endName', expectedName);
        assert.equal($input.attr('name'), expectedName, 'the second input has correct \'name\' attribute after the \'endName\' option change');
    });
});

QUnit.module('value option', () => {
    QUnit.test('inputs get correct value on init', function(assert) {
        const start = 15;
        const end = 45;
        const $element = $('#slider').dxRangeSlider({
            value: [start, end]
        });
        const instance = $('#slider').dxRangeSlider('instance');
        const $inputs = $element.find('input');

        assert.equal(instance.option('start'), start, 'start option got correct value');
        assert.equal(instance.option('end'), end, 'end got correct value');

        assert.equal($inputs.eq(0).val(), start, 'the first input got correct value');
        assert.equal($inputs.eq(1).val(), end, 'the second input got correct value');
    });

    QUnit.test('handle change option value', function(assert) {
        const start = 15;
        const end = 45;
        const $element = $('#slider').dxRangeSlider({
            value: [0, 1]
        });
        const instance = $('#slider').dxRangeSlider('instance');
        const $inputs = $element.find('input');

        $element.dxRangeSlider('option', 'value', [start, end]);

        assert.equal(instance.option('start'), start, 'start option got correct value');
        assert.equal(instance.option('end'), end, 'end got correct value');

        assert.equal($inputs.eq(0).val(), start, 'the first input got correct value');
        assert.equal($inputs.eq(1).val(), end, 'the second input got correct value');
    });
});

QUnit.module('aria accessibility', () => {
    QUnit.test('aria-labels for handles', function(assert) {
        const $element = $('#slider').dxRangeSlider({
            start: 50,
            end: 70,
            useInkRipple: false
        });
        const $startHandle = $element.find('.' + RANGE_SLIDER_START_HANDLE_CLASS);
        const $endHandle = $element.find('.' + RANGE_SLIDER_END_HANDLE_CLASS);

        assert.equal($startHandle.attr('aria-label'), 'From', 'start handle label is correct');
        assert.equal($endHandle.attr('aria-label'), 'Till', 'end handle label is correct');
    });
});

