import $ from 'jquery';
import dateLocalization from 'common/core/localization/date';
import keyboardMock from '../../helpers/keyboardMock.js';

import 'ui/date_box/ui.time_view';

QUnit.testStart(function() {
    const markup =
        '<div id="timeView"></div>';

    $('#qunit-fixture').html(markup);
});

const TIMEVIEW_CLASS = 'dx-timeview';
const TIMEVIEW_CLOCK_CLASS = 'dx-timeview-clock';
const TIMEVIEW_FIELD_CLASS = 'dx-timeview-field';
const TIMEVIEW_HOURARROW_CLASS = 'dx-timeview-hourarrow';
const TIMEVIEW_MINUTEARROW_CLASS = 'dx-timeview-minutearrow';
const TIMEVIEW_TIME_SEPARATOR_CLASS = 'dx-timeview-time-separator';
const TIMEVIEW_FORMAT12_CLASS = 'dx-timeview-format12';
const TIMEVIEW_FORMAT12_AM = -1;
const TIMEVIEW_FORMAT12_PM = 1;

const BOX_CLASS = 'dx-box';
const NUMBERBOX_CLASS = 'dx-numberbox';
const INPUT_CLASS = 'dx-texteditor-input';
const NUMBERBOX_SPIN_UP_BUTTON_CLASS = 'dx-numberbox-spin-up';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

QUnit.module('rendering', () => {
    QUnit.test('widget class should be added', function(assert) {
        const $element = $('#timeView').dxTimeView();

        assert.ok($element.hasClass(TIMEVIEW_CLASS), 'class added');
    });

    QUnit.test('timeView should use box with right options', function(assert) {
        const $element = $('#timeView').dxTimeView(); const box = $element.find('.' + BOX_CLASS).dxBox('instance');

        assert.equal(box.option('direction'), 'col', 'box has right direction');
        assert.equal(box.option('items').length, 2, 'box has 2 items');
    });

    QUnit.test('clock should be rendered in top box section', function(assert) {
        const $element = $('#timeView').dxTimeView(); const box = $element.find('.' + BOX_CLASS).dxBox('instance');

        assert.ok(box.itemElements().eq(0).find('.' + TIMEVIEW_CLOCK_CLASS).length, 'clock rendered');
    });

    QUnit.test('field should be rendered in bottom box section', function(assert) {
        const $element = $('#timeView').dxTimeView(); const box = $element.find('.' + BOX_CLASS).dxBox('instance');

        assert.ok(box.itemElements().eq(1).find('.' + TIMEVIEW_FIELD_CLASS).length, 'clock rendered');
    });
});

QUnit.module('clock rendering', () => {
    QUnit.test('hour arrow should be rendered', function(assert) {
        const $element = $('#timeView').dxTimeView(); const $clock = $element.find('.' + TIMEVIEW_CLOCK_CLASS);

        assert.ok($clock.find('.' + TIMEVIEW_HOURARROW_CLASS).length, 'hour arrow rendered');
    });

    QUnit.test('minute arrow should be rendered', function(assert) {
        const $element = $('#timeView').dxTimeView(); const $clock = $element.find('.' + TIMEVIEW_CLOCK_CLASS);

        assert.ok($clock.find('.' + TIMEVIEW_MINUTEARROW_CLASS).length, 'minute arrow rendered');
    });

    QUnit.test('clock should not render if showClock option is false', function(assert) {
        const $element = $('#timeView').dxTimeView({
            _showClock: false
        });
        const $clock = $element.find('.' + TIMEVIEW_CLOCK_CLASS);

        assert.notOk($clock.length, 'clock was not rendered');
    });

    QUnit.test('clock should be shown if showClock option was changed', function(assert) {
        const $element = $('#timeView').dxTimeView({
            _showClock: false
        });
        const instance = $element.dxTimeView('instance');

        instance.option('_showClock', true);

        const $clock = $element.find('.' + TIMEVIEW_CLOCK_CLASS);

        assert.ok($clock.length, 'clock was rendered');
    });


    const getRotation = function($element) {
        const matrix = $element.css('transform');
        const values = matrix.split('(')[1].split(')')[0].split(',');

        return Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
    };

    QUnit.test('hour arrow has right rotation', function(assert) {
        const $element = $('#timeView').dxTimeView({
            value: new Date(2014, 11, 11, 3, 0)
        });
        const $hourArrow = $element.find('.' + TIMEVIEW_HOURARROW_CLASS);

        assert.equal(getRotation($hourArrow), 90, 'arrow rotation is right');
    });

    QUnit.test('hour arrow has right rotation considering minutes', function(assert) {
        const $element = $('#timeView').dxTimeView({
            value: new Date(2014, 11, 11, 3, 30)
        });
        const $hourArrow = $element.find('.' + TIMEVIEW_HOURARROW_CLASS);

        assert.equal(getRotation($hourArrow), 105, 'arrow rotation is right');
    });

    QUnit.test('minute arrow has right rotation', function(assert) {
        const $element = $('#timeView').dxTimeView({
            value: new Date(2014, 11, 11, 3, 45)
        });
        const $minuteArrow = $element.find('.' + TIMEVIEW_MINUTEARROW_CLASS);

        assert.equal(getRotation($minuteArrow), -90, 'arrow rotation is right');
    });

    QUnit.test('hour arrow has right rotation after changing time option', function(assert) {
        const $element = $('#timeView').dxTimeView(); const instance = $element.dxTimeView('instance'); const $hourArrow = $element.find('.' + TIMEVIEW_HOURARROW_CLASS);

        instance.option('value', new Date(2014, 11, 11, 5, 0));

        assert.equal(getRotation($hourArrow), 150, 'arrow rotation is right');
    });

    QUnit.test('minute arrow has right rotation after changing time option', function(assert) {
        const $element = $('#timeView').dxTimeView(); const instance = $element.dxTimeView('instance'); const $minuteArrow = $element.find('.' + TIMEVIEW_MINUTEARROW_CLASS);

        instance.option('value', new Date(2014, 11, 11, 6, 25));

        assert.equal(getRotation($minuteArrow), 150, 'arrow rotation is right');
    });
});

QUnit.module('field rendering', () => {
    QUnit.test('field should be box widget', function(assert) {
        const $element = $('#timeView').dxTimeView(); const box = $element.find('.' + TIMEVIEW_FIELD_CLASS).dxBox('instance');

        assert.equal(box.option('direction'), 'row', 'rendered');
        assert.equal(box.option('align'), 'center', 'rendered');
        assert.equal(box.option('crossAlign'), 'center', 'rendered');
    });

    QUnit.test('field should contain hour numberbox with current hour value', function(assert) {
        const $element = $('#timeView').dxTimeView({
            value: new Date(2014, 11, 11, 11, 22)
        });
        const box = $element.find('.' + TIMEVIEW_FIELD_CLASS).dxBox('instance');

        const hourNumberBox = box.itemElements().eq(0).find('.' + NUMBERBOX_CLASS).dxNumberBox('instance');

        assert.equal(hourNumberBox.option('showSpinButtons'), true, 'spin buttons enabled');
        assert.equal(hourNumberBox.option('value'), 11, 'correct hour value');
    });

    QUnit.test('hours and minutes should be separated by time separator', function(assert) {
        const $element = $('#timeView').dxTimeView({
            value: new Date(2014, 11, 11, 11, 22)
        });
        const $separator = $element.find('.' + TIMEVIEW_TIME_SEPARATOR_CLASS);

        assert.equal($separator.length, 1, 'separator should exist');
    });

    QUnit.test('hour numberbox should set hours', function(assert) {
        const time = new Date(2014, 11, 11, 11, 22);

        const $element = $('#timeView').dxTimeView({
            value: time
        });
        const instance = $element.dxTimeView('instance');
        const hourNumberBox = $element.find('.' + NUMBERBOX_CLASS).eq(0).dxNumberBox('instance');

        hourNumberBox.option('value', 5);

        assert.notStrictEqual(instance.option('value'), time, 'date instance changed');
        assert.equal(instance.option('value').valueOf(), new Date(2014, 11, 11, 5, 22).valueOf(), 'hour changed');
    });

    QUnit.test('hour numberbox should be updated after time option change', function(assert) {
        const $element = $('#timeView').dxTimeView({
            value: new Date(2014, 11, 11, 11, 22)
        });
        const instance = $element.dxTimeView('instance');
        const hourNumberBox = $element.find('.' + NUMBERBOX_CLASS).eq(0).dxNumberBox('instance');

        instance.option('value', new Date(2014, 11, 11, 7, 22));

        assert.equal(hourNumberBox.option('value'), 7, 'hour changed');
    });

    QUnit.test('field should contain minute numberbox with current minute value', function(assert) {
        const $element = $('#timeView').dxTimeView({
            value: new Date(2014, 11, 11, 11, 22)
        });
        const box = $element.find('.' + TIMEVIEW_FIELD_CLASS).dxBox('instance');

        const minuteNumberBox = box.itemElements().eq(2).find('.' + NUMBERBOX_CLASS).dxNumberBox('instance');

        assert.equal(minuteNumberBox.option('showSpinButtons'), true, 'spin buttons enabled');
        assert.equal(minuteNumberBox.option('value'), 22, 'correct hour value');
    });

    QUnit.test('minute numberbox should set minutes', function(assert) {
        const time = new Date(2014, 11, 11, 11, 22);

        const $element = $('#timeView').dxTimeView({
            value: time
        });
        const instance = $element.dxTimeView('instance');
        const minuteNumberBox = $element.find('.' + NUMBERBOX_CLASS).eq(1).dxNumberBox('instance');

        minuteNumberBox.option('value', 33);

        assert.notStrictEqual(instance.option('value'), time, 'date instance changed');
        assert.equal(instance.option('value').valueOf(), new Date(2014, 11, 11, 11, 33).valueOf(), 'minute changed');
    });

    QUnit.test('minute numberbox should be updated after time option change', function(assert) {
        const $element = $('#timeView').dxTimeView({
            value: new Date(2014, 11, 11, 11, 22)
        });
        const instance = $element.dxTimeView('instance');
        const minuteNumberBox = $element.find('.' + NUMBERBOX_CLASS).eq(1).dxNumberBox('instance');

        instance.option('value', new Date(2014, 11, 11, 11, 33));

        assert.equal(minuteNumberBox.option('value'), 33, 'minute changed');
    });

    QUnit.test('hour numberbox should be looped', function(assert) {
        const time = new Date(2014, 11, 11, 11, 22);

        const $element = $('#timeView').dxTimeView({
            value: time
        });
        const instance = $element.dxTimeView('instance');
        const hourNumberBox = $element.find('.' + NUMBERBOX_CLASS).eq(0).dxNumberBox('instance');

        hourNumberBox.option('value', 24);
        assert.equal(hourNumberBox.option('value'), 0, 'numberbox updated');
        assert.equal(instance.option('value').valueOf(), new Date(2014, 11, 11, 0, 22).valueOf(), 'minute changed');

        hourNumberBox.option('value', -1);
        assert.equal(hourNumberBox.option('value'), 23, 'numberbox updated');
        assert.equal(instance.option('value').valueOf(), new Date(2014, 11, 11, 23, 22).valueOf(), 'minute changed');
    });

    QUnit.test('minute numberbox should be looped', function(assert) {
        const time = new Date(2014, 11, 11, 11, 22);

        const $element = $('#timeView').dxTimeView({
            value: time
        });
        const instance = $element.dxTimeView('instance');
        const minuteNumberBox = $element.find('.' + NUMBERBOX_CLASS).eq(1).dxNumberBox('instance');

        minuteNumberBox.option('value', 60);
        assert.equal(minuteNumberBox.option('value'), 0, 'numberbox updated');
        assert.equal(instance.option('value').valueOf(), new Date(2014, 11, 11, 11, 0).valueOf(), 'minute changed');

        minuteNumberBox.option('value', -1);
        assert.equal(minuteNumberBox.option('value'), 59, 'numberbox updated');
        assert.equal(instance.option('value').valueOf(), new Date(2014, 11, 11, 11, 59).valueOf(), 'minute changed');
    });

    QUnit.test('hour and minute numberboxes should set minutes with null value', function(assert) {
        assert.expect(2);

        let expected;

        const $element = $('#timeView').dxTimeView({
            value: null,
            onValueChanged: function(args) {
                if(expected) {
                    assert.ok(Math.abs(args.value.valueOf() - expected.valueOf()) < 60 * 1000, 'correct value');
                }
            }
        });
        const instance = $element.dxTimeView('instance');
        const hourNumberBox = $element.find('.' + NUMBERBOX_CLASS).eq(0).dxNumberBox('instance');
        const minuteNumberBox = $element.find('.' + NUMBERBOX_CLASS).eq(1).dxNumberBox('instance');

        expected = new Date();
        expected.setHours((expected.getHours() + 24 + 1) % 24);
        hourNumberBox.option('value', expected.getHours());

        expected = null;
        instance.option('value', null);

        expected = new Date();
        expected.setMinutes((expected.getMinutes() + 60 + 1) % 60);
        minuteNumberBox.option('value', expected.getMinutes());
    });

    QUnit.test('disabled state should be passed to numberboxes', function(assert) {
        const $element = $('#timeView').dxTimeView({
            disabled: true
        });
        const instance = $element.dxTimeView('instance');
        const hourNumberBox = $element.find('.' + NUMBERBOX_CLASS).eq(0).dxNumberBox('instance');
        const minuteNumberBox = $element.find('.' + NUMBERBOX_CLASS).eq(1).dxNumberBox('instance');

        assert.equal(hourNumberBox.option('disabled'), true, 'hour numberbox disabled');
        assert.equal(minuteNumberBox.option('disabled'), true, 'minute numberbox disabled');

        instance.option('disabled', false);
        assert.equal(hourNumberBox.option('disabled'), false, 'hour numberbox disabled');
        assert.equal(minuteNumberBox.option('disabled'), false, 'minute numberbox disabled');
    });
});

QUnit.module('12 hours format', () => {
    QUnit.test('format field should be rendered when use24HourFormat option is enabled', function(assert) {
        const $element = $('#timeView').dxTimeView({
            use24HourFormat: false
        });
        const instance = $element.dxTimeView('instance');

        assert.equal($element.find('.' + TIMEVIEW_FORMAT12_CLASS).length, 1, 'input was rendered');

        instance.option('use24HourFormat', true);
        assert.equal($element.find('.' + TIMEVIEW_FORMAT12_CLASS).length, 0, 'input was removed');
    });

    QUnit.test('timeView should use localized message for the 24hour format selectBox', function(assert) {
        const getPeriodNames = sinon.stub(dateLocalization, 'getPeriodNames').returns(['A', 'P']);

        try {
            const $element = $('#timeView').dxTimeView({
                use24HourFormat: false
            });
            const formatField = $element.find('.' + TIMEVIEW_FORMAT12_CLASS).dxSelectBox('instance');
            const items = formatField.option('items');

            assert.equal(items[0].text, 'A', 'AM item is correct');
            assert.equal(items[1].text, 'P', 'PM item is correct');
        } finally {
            getPeriodNames.restore();
        }
    });

    QUnit.test('day time should be changed after setting a new value', function(assert) {
        const $element = $('#timeView').dxTimeView({
            use24HourFormat: false,
            value: new Date(2011, 0, 1, 10, 0, 0, 0)
        });
        const formatField = $element.find('.' + TIMEVIEW_FORMAT12_CLASS).dxSelectBox('instance');
        const instance = $element.dxTimeView('instance');

        assert.equal(formatField.option('value'), TIMEVIEW_FORMAT12_AM, 'am is selected');

        instance.option('value', new Date(2011, 0, 1, 12, 1, 0, 0));
        assert.equal(formatField.option('value'), TIMEVIEW_FORMAT12_PM, 'pm is selected');
        assert.equal(instance.option('value').toString(), new Date(2011, 0, 1, 12, 1, 0, 0), 'hours is correct');
    });

    QUnit.test('hours view should be changed after format changing', function(assert) {
        const $element = $('#timeView').dxTimeView({
            use24HourFormat: false,
            value: new Date(2011, 0, 1, 15, 0, 0, 0)
        });
        const formatField = $element.find('.' + TIMEVIEW_FORMAT12_CLASS).dxSelectBox('instance');
        const instance = $element.dxTimeView('instance');

        assert.equal(formatField.option('value'), TIMEVIEW_FORMAT12_PM, 'pm is selected');

        formatField.option('value', TIMEVIEW_FORMAT12_AM);
        assert.equal(instance.option('value').toString(), new Date(2011, 0, 1, 3, 0, 0, 0), 'time has been changed');
    });

    QUnit.test('boundary hours should have correct day time value', function(assert) {
        const $element = $('#timeView').dxTimeView({
            use24HourFormat: false,
            value: new Date(2011, 0, 1, 12, 0, 0, 0)
        });
        const formatField = $element.find('.' + TIMEVIEW_FORMAT12_CLASS).dxSelectBox('instance');
        const instance = $element.dxTimeView('instance');

        assert.equal(formatField.option('value'), TIMEVIEW_FORMAT12_PM, 'pm is selected');
        assert.equal(instance.option('value').toString(), new Date(2011, 0, 1, 12, 0, 0, 0), 'time is correct');

        instance.option('value', new Date(2011, 0, 1, 0, 0, 0, 0));
        assert.equal(formatField.option('value'), TIMEVIEW_FORMAT12_AM, 'am is selected');
        assert.equal(instance.option('value').toString(), new Date(2011, 0, 1, 0, 0, 0, 0), 'time is correct');
    });

    QUnit.test('boundary hours should change correctly after day time changing', function(assert) {
        const $element = $('#timeView').dxTimeView({
            use24HourFormat: false,
            value: new Date(2011, 0, 1, 0, 0, 0, 0)
        });
        const formatField = $element.find('.' + TIMEVIEW_FORMAT12_CLASS).dxSelectBox('instance');
        const instance = $element.dxTimeView('instance');

        formatField.option('value', TIMEVIEW_FORMAT12_PM);
        assert.equal(instance.option('value').toString(), new Date(2011, 0, 1, 12, 0, 0, 0), 'time is correct');

        formatField.option('value', TIMEVIEW_FORMAT12_AM);
        assert.equal(instance.option('value').toString(), new Date(2011, 0, 1, 0, 0, 0, 0), 'time is correct');
    });

    QUnit.test('midday part should not be changed when clock moves back through the boundary (T808116)', function(assert) {
        const $element = $('#timeView').dxTimeView({
            use24HourFormat: false,
            value: new Date(2011, 0, 1, 12, 0, 10, 0)
        });
        const formatField = $element.find('.' + TIMEVIEW_FORMAT12_CLASS).dxSelectBox('instance');
        const hourNumberBox = $element.find('.' + NUMBERBOX_CLASS).eq(0).dxNumberBox('instance');
        const instance = $element.dxTimeView('instance');

        hourNumberBox.option('value', 11);
        assert.equal(formatField.option('value'), TIMEVIEW_FORMAT12_PM, 'pm is selected');
        assert.equal(instance.option('value').toString(), new Date(2011, 0, 1, 23, 0, 0, 0), 'time is correct');

        hourNumberBox.option('value', 12);
        assert.equal(formatField.option('value'), TIMEVIEW_FORMAT12_PM, 'pm is selected');
        assert.equal(instance.option('value').toString(), new Date(2011, 0, 1, 12, 0, 0, 0), 'time is correct');
    });

    QUnit.test('timeView should not change value specified via api', function(assert) {
        const $element = $('#timeView').dxTimeView({
            use24HourFormat: false,
            value: null
        });
        const formatField = $element.find('.' + TIMEVIEW_FORMAT12_CLASS).dxSelectBox('instance');
        const instance = $element.dxTimeView('instance');

        instance.option('value', new Date(2011, 0, 1, 10, 5, 0, 0));

        assert.equal(instance.option('value').toString(), new Date(2011, 0, 1, 10, 5, 0, 0), 'value has not been changed');
        assert.equal(formatField.option('value'), TIMEVIEW_FORMAT12_AM, 'am is selected');
    });

    QUnit.test('hour numberbox can change value from 12 to 1 after spin up button click (T986347)', function(assert) {
        const $element = $('#timeView').dxTimeView({
            value: new Date(2014, 11, 11, 12, 1),
            use24HourFormat: false
        });

        const $hourNumberBox = $element.find(`.${NUMBERBOX_CLASS}`);
        const hourNumberBox = $hourNumberBox.dxNumberBox('instance');
        const $spinUpButton = $($hourNumberBox.find(`.${NUMBERBOX_SPIN_UP_BUTTON_CLASS}`));

        $spinUpButton.trigger('dxpointerdown');

        assert.equal(hourNumberBox.option('value'), 1);
    });
});

QUnit.module('format rendering', () => {
    [false, true].forEach((use24HourFormat) => {
        QUnit.test(`minute numberbox should have min/max constraints, use24HourFormat=${use24HourFormat}`, function(assert) {
            const $element = $('#timeView').dxTimeView({ use24HourFormat });
            const minuteNumberBox = $element.find(`.${NUMBERBOX_CLASS}`).eq(1).dxNumberBox('instance');

            assert.equal(minuteNumberBox.option('min'), -1, 'min constraint set');
            assert.equal(minuteNumberBox.option('max'), 60, 'max constraint set');
        });

        QUnit.test(`minute numberbox should have min/max constraints, use24HourFormat changed from ${use24HourFormat} to ${!use24HourFormat}`, function(assert) {
            const $element = $('#timeView').dxTimeView({ use24HourFormat });
            const timeView = $element.dxTimeView('instance');
            const newUse24HourFormatValue = !use24HourFormat;

            timeView.option('use24HourFormat', newUse24HourFormatValue);
            const minuteNumberBox = $element.find(`.${NUMBERBOX_CLASS}`).eq(1).dxNumberBox('instance');

            assert.equal(minuteNumberBox.option('min'), -1, 'min constraint set');
            assert.equal(minuteNumberBox.option('max'), 60, 'max constraint set');
        });

        QUnit.test(`hour numberbox should have min/max constraints, use24HourFormat=${use24HourFormat}`, function(assert) {
            const $element = $('#timeView').dxTimeView({ use24HourFormat });
            const hourNumberBox = $element.find(`.${NUMBERBOX_CLASS}`).eq(0).dxNumberBox('instance');
            const expectedMaxValue = use24HourFormat ? 24 : 13;

            assert.equal(hourNumberBox.option('min'), -1, 'min constraint set');
            assert.equal(hourNumberBox.option('max'), expectedMaxValue, 'max constraint set');
        });

        QUnit.test(`hour numberbox should have min/max constraints, use24HourFormat changed from ${use24HourFormat} to ${!use24HourFormat}`, function(assert) {
            const $element = $('#timeView').dxTimeView({ use24HourFormat });
            const timeView = $element.dxTimeView('instance');
            const newUse24HourFormatValue = !use24HourFormat;
            const expectedMaxValue = newUse24HourFormatValue ? 24 : 13;

            timeView.option('use24HourFormat', newUse24HourFormatValue);
            const hourNumberBox = $element.find(`.${NUMBERBOX_CLASS}`).eq(0).dxNumberBox('instance');

            assert.equal(hourNumberBox.option('min'), -1, 'min constraint set');
            assert.equal(hourNumberBox.option('max'), expectedMaxValue, 'max constraint set');
        });

        [
            new Date(2000, 1, 1, 5, 15),
            new Date(2000, 1, 1, 15, 15),
            new Date(2000, 1, 1, 0, 15)
        ].forEach((value) => {
            QUnit.test(`hour numberbox should have correct initial value, use24HourFormat=${use24HourFormat}, initial hour value=${value.getHours()}`, function(assert) {
                const $element = $('#timeView').dxTimeView({ use24HourFormat, value });
                const hourNumberBox = $element.find(`.${NUMBERBOX_CLASS}`).eq(0).dxNumberBox('instance');
                const maxHourValue = use24HourFormat ? 24 : 12;
                let expectedValue = value.getHours() % maxHourValue;

                if(!use24HourFormat && expectedValue === 0) {
                    expectedValue = 12; // 12AM
                }

                assert.equal(hourNumberBox.option('value'), expectedValue, 'correct value');
            });
        });

        QUnit.test('hour numberbox should have correct value after some incorrect values applyings (T986347)', function(assert) {
            const $element = $('#timeView').dxTimeView({ use24HourFormat });
            const maxValue = use24HourFormat ? 23 : 12;

            const $hourNumberBox = $element.find(`.${NUMBERBOX_CLASS}`).eq(0);
            const hourNumberBox = $hourNumberBox.dxNumberBox('instance');

            const $input = $hourNumberBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
            const kb = keyboardMock($input);

            kb.caret({ start: 0, end: 2 })
                .type('30')
                .change();

            kb.caret({ start: 0, end: 2 })
                .type('30')
                .change();

            const text = hourNumberBox.option('text');
            const value = hourNumberBox.option('value');
            assert.ok(text <= maxValue, `current text value is ${text}; expected max is ${maxValue}`);
            assert.ok(value <= maxValue, `current value is ${value}; expected max is ${maxValue}`);
        });
    });
});

QUnit.module('editor support', () => {
    QUnit.test('value changed should be raised on value change', function(assert) {
        assert.expect(1);

        const time = new Date(2014, 11, 11, 11, 22);

        const $element = $('#timeView').dxTimeView({
            onValueChanged: function(args) {
                assert.equal(args.value.valueOf(), time.valueOf(), 'value changed');
            }
        });
        const instance = $element.dxTimeView('instance');

        instance.option('value', time);
    });

    QUnit.test('\'registerKeyHandler\' should attach handler to the each nested editor', function(assert) {
        const handler = sinon.stub();
        const $element = $('#timeView');
        const instance = $element
            .dxTimeView({ use24HourFormat: false })
            .dxTimeView('instance');

        instance.registerKeyHandler('escape', handler);

        const $inputs = $element.find(`.${INPUT_CLASS}`);

        $inputs.each((index, element) => {
            const escapeKeyDown = $.Event('keydown', { key: 'Escape' });

            $(element).trigger(escapeKeyDown);
        });

        assert.strictEqual($inputs.length, 3, 'there are 3 editors');
        assert.strictEqual(handler.callCount, 3, 'each editor handle the keydown event');
    });

    QUnit.test('Custom keyboard handlers still works after option change', function(assert) {
        const handler = sinon.stub();
        const $element = $('#timeView');
        const instance = $element
            .dxTimeView({ use24HourFormat: false })
            .dxTimeView('instance');

        instance.registerKeyHandler('escape', handler);
        instance.option('use24HourFormat', true);

        const $inputs = $element.find(`.${INPUT_CLASS}`);

        $inputs.each((index, element) => {
            const escapeKeyDown = $.Event('keydown', { key: 'Escape' });

            $(element).trigger(escapeKeyDown);
        });

        assert.strictEqual($inputs.length, 2, 'there are 2 editors');
        assert.strictEqual(handler.callCount, 2, 'each editor handle the keydown event');
    });
});

QUnit.module('aria accessibility', () => {
    QUnit.test('role for clock picture', function(assert) {
        const $element = $('#timeView').dxTimeView(); const $clock = $element.find('.dx-timeview-clock');

        assert.equal($clock.attr('role'), 'presentation');
    });

    QUnit.test('label for hour and minute numberboxes', function(assert) {
        const $element = $('#timeView').dxTimeView(); const $hour = $element.find('.dx-texteditor-input[aria-valuemax=\'24\']'); const $minute = $element.find('.dx-texteditor-input[aria-valuemax=\'60\']');

        assert.equal($hour.attr('aria-label'), 'hours', 'hours label is correct');
        assert.equal($minute.attr('aria-label'), 'minutes', 'minutes label is correct');
    });
});

