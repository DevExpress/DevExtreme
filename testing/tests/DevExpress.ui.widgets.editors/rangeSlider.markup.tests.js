var $ = require('jquery'),
    config = require('core/config');

require('ui/range_slider');

QUnit.testStart(function() {
    var markup =
        '<div id="slider"></div><div id="start-value"></div><div id="end-value"></div>';

    $('#qunit-fixture').html(markup);
});

require('common.css!');

var SLIDER_CLASS = 'dx-slider',

    RANGE_SLIDER_CLASS = 'dx-rangeslider',
    RANGE_SLIDER_START_HANDLE_CLASS = RANGE_SLIDER_CLASS + '-start-handle',
    RANGE_SLIDER_END_HANDLE_CLASS = RANGE_SLIDER_CLASS + '-end-handle';

QUnit.module('rangeSlider markup', () => {
    QUnit.test('default', function(assert) {
        var sliderElement = $('#slider').dxRangeSlider({
            useInkRipple: false
        });

        assert.ok(sliderElement.hasClass(SLIDER_CLASS));
        assert.ok(sliderElement.hasClass(RANGE_SLIDER_CLASS));
    });
});

QUnit.module('hidden inputs', () => {
    QUnit.test('two inputs should be rendered', function(assert) {
        var $element = $('#slider').dxRangeSlider(),
            $inputs = $element.find('input');

        assert.equal($inputs.length, 2, 'inputs are rendered');
    });

    QUnit.test('both inputs should have a \'hidden\' type', function(assert) {
        var $element = $('#slider').dxRangeSlider(),
            $inputs = $element.find('input');

        assert.equal($inputs.eq(0).attr('type'), 'hidden', 'the first input is of the \'hidden\' type');
        assert.equal($inputs.eq(1).attr('type'), 'hidden', 'the second input is of the \'hidden\' type');
    });

    QUnit.test('inputs get correct values on init', function(assert) {
        var initialStart = 15,
            initialEnd = 45,
            $element = $('#slider').dxRangeSlider({
                start: initialStart,
                end: initialEnd
            }),
            $inputs = $element.find('input');

        assert.equal($inputs.eq(0).val(), initialStart, 'the first input got correct value');
        assert.equal($inputs.eq(1).val(), initialEnd, 'the second input got correct value');
    });

    QUnit.test('first input gets correct value after widget the \'start\' option change', function(assert) {
        var expectedStart = 33,
            $element = $('#slider').dxRangeSlider(),
            instance = $element.dxRangeSlider('instance'),
            $input = $element.find('input').eq(0);

        instance.option('start', expectedStart);
        assert.equal($input.val(), expectedStart, 'the first input value is correct');
    });

    QUnit.test('second input gets correct value after widget the \'end\' option change', function(assert) {
        var expectedEnd = 88,
            $element = $('#slider').dxRangeSlider(),
            instance = $element.dxRangeSlider('instance'),
            $input = $element.find('input').eq(1);

        instance.option('end', expectedEnd);
        assert.equal($input.val(), expectedEnd, 'the second input value is correct');
    });

    QUnit.test('the hidden inputs should use the decimal separator specified in DevExpress.config', function(assert) {
        var originalConfig = config();
        try {
            config({ serverDecimalSeparator: '|' });

            var $element = $('#slider').dxRangeSlider({
                    start: 12.25,
                    end: 53.64
                }),
                $inputs = $element.find('input');

            assert.equal($inputs.eq(0).val(), '12|25', 'the correct decimal separator is used in the first input');
            assert.equal($inputs.eq(1).val(), '53|64', 'the correct decimal separator is used in the second input');
        } finally {
            config(originalConfig);
        }
    });
});

QUnit.module('\'name\' options', () => {
    QUnit.test('first input should get the \'name\' attribute depending on the \'startName\' option', function(assert) {
        var startName = 'start',
            $element = $('#slider').dxRangeSlider({
                startName: startName
            }),
            $input = $element.find('input').eq(0);

        assert.equal($input.attr('name'), startName, 'the first input has correct \'name\' attribute');
    });

    QUnit.test('first input should get the \'name\' attribute correctly after the \'startName\' option change', function(assert) {
        var expectedName = 'newName',
            $element = $('#slider').dxRangeSlider({
                startName: 'initial'
            }),
            instance = $element.dxRangeSlider('instance'),
            $input = $element.find('input').eq(0);

        instance.option('startName', expectedName);
        assert.equal($input.attr('name'), expectedName, 'the first input has correct \'name\' attribute after the \'startName\' option change');
    });

    QUnit.test('second input should get the \'name\' attribute depending on the \'endName\' option', function(assert) {
        var endName = 'end',
            $element = $('#slider').dxRangeSlider({
                endName: endName
            }),
            $input = $element.find('input').eq(1);

        assert.equal($input.attr('name'), endName, 'the second input has correct \'name\' attribute');
    });

    QUnit.test('second input should get the \'name\' attribute correctly after the \'endName\' option change', function(assert) {
        var expectedName = 'newName',
            $element = $('#slider').dxRangeSlider({
                endName: 'initial'
            }),
            instance = $element.dxRangeSlider('instance'),
            $input = $element.find('input').eq(1);

        instance.option('endName', expectedName);
        assert.equal($input.attr('name'), expectedName, 'the second input has correct \'name\' attribute after the \'endName\' option change');
    });
});

QUnit.module('value option', () => {
    QUnit.test('inputs get correct value on init', function(assert) {
        var start = 15,
            end = 45,
            $element = $('#slider').dxRangeSlider({
                value: [start, end]
            }),
            instance = $('#slider').dxRangeSlider('instance'),
            $inputs = $element.find('input');

        assert.equal(instance.option('start'), start, 'start option got correct value');
        assert.equal(instance.option('end'), end, 'end got correct value');

        assert.equal($inputs.eq(0).val(), start, 'the first input got correct value');
        assert.equal($inputs.eq(1).val(), end, 'the second input got correct value');
    });

    QUnit.test('handle change option value', function(assert) {
        var start = 15,
            end = 45,
            $element = $('#slider').dxRangeSlider({
                value: [0, 1]
            }),
            instance = $('#slider').dxRangeSlider('instance'),
            $inputs = $element.find('input');

        $element.dxRangeSlider('option', 'value', [start, end]);

        assert.equal(instance.option('start'), start, 'start option got correct value');
        assert.equal(instance.option('end'), end, 'end got correct value');

        assert.equal($inputs.eq(0).val(), start, 'the first input got correct value');
        assert.equal($inputs.eq(1).val(), end, 'the second input got correct value');
    });
});

QUnit.module('aria accessibility', () => {
    QUnit.test('aria-labels for handles', function(assert) {
        var $element = $('#slider').dxRangeSlider({
                start: 50,
                end: 70,
                useInkRipple: false
            }),
            $startHandle = $element.find('.' + RANGE_SLIDER_START_HANDLE_CLASS),
            $endHandle = $element.find('.' + RANGE_SLIDER_END_HANDLE_CLASS);

        assert.equal($startHandle.attr('aria-label'), 'From', 'start handle label is correct');
        assert.equal($endHandle.attr('aria-label'), 'Till', 'end handle label is correct');
    });
});

