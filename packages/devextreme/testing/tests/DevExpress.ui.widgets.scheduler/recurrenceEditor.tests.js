import $ from 'jquery';
import dateUtils from 'core/utils/date';
import RecurrenceEditor from '__internal/scheduler/m_recurrence_editor';
import SelectBox from 'ui/select_box';
import NumberBox from 'ui/number_box';
import RadioGroup from 'ui/radio_group';
import ButtonGroup from 'ui/button_group';
import DateBox from 'ui/date_box';
import { getRecurrenceProcessor } from '__internal/scheduler/m_recurrence';
import { createTimeZoneCalculator } from '__internal/scheduler/r1/timezone_calculator/index.js';
import dateLocalization from 'common/core/localization/date';

const FREQUENCY_EDITOR = 'dx-recurrence-selectbox-freq';
const REPEAT_COUNT_EDITOR = 'dx-recurrence-numberbox-repeat-count';
const REPEAT_DATE_EDITOR = 'dx-recurrence-datebox-until-date';
const REPEAT_ON_EDITOR = 'dx-recurrence-repeat-on';
const REPEAT_END_TYPE_EDITOR = 'dx-recurrence-radiogroup-repeat-type';
const DAY_OF_MONTH = 'dx-recurrence-numberbox-day-of-month';
const MONTH_OF_YEAR = 'dx-recurrence-selectbox-month-of-year';
const RECURRENCE_BUTTON_GROUP = 'dx-recurrence-button-group';
const INTERVAL_EDITOR = 'dx-recurrence-numberbox-interval';
const LABEL_POSTFIX = '-label';

const { testStart, test, module } = QUnit;

testStart(() => {
    $('#qunit-fixture').html('<div id="recurrence-editor"></div>');
});

const createInstance = options => new RecurrenceEditor($('#recurrence-editor'), {
    timeZoneCalculator: { createDate: (date) => date },
    getStartDateTimeZone: () => {},
    ...options
});

const getFreqEditor = instance => instance.getRecurrenceForm().getEditor('freq');
const getRepeatEndEditor = instance => instance.getEditorByField('repeatEnd');
const getIntervalEditor = instance => instance.getRecurrenceForm().getEditor('interval');

module('Recurrence Editor rendering', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    },
},
() => {
    test('Recurrence editor should be initialized', function(assert) {
        const instance = createInstance();
        assert.ok(instance instanceof RecurrenceEditor, 'dxRecurrenceEditor was initialized');

        assert.ok(instance.$element().hasClass('dx-recurrence-editor'), 'dxRecurrence editor has right class');
    });

    test('Recurrence editor should have correct default options', function(assert) {
        const instance = createInstance();

        assert.equal(instance.option('value'), null, 'value is right');
        assert.equal(instance.option('visible'), true, 'editor is visible');
        assert.equal(instance.option('firstDayOfWeek'), undefined, 'firstDayOfWeek is right');
        assert.ok(instance.option('startDate') instanceof Date, 'startDate is right');
    });

    test('Recurrence editor should correctly process null value and reset inner editors to default values', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY' });

        instance.option('value', null);
        instance.option('visible', true);

        assert.equal(getFreqEditor(instance).option('value'), 'daily', 'freq editor default value was set');
    });

    test('Parts of recurrence editor should have right readonly option', function(assert) {
        const instance = createInstance({
            value: 'FREQ=DAILY',
            readOnly: true
        });

        assert.equal(instance.getRecurrenceForm().getEditor('interval').option('readOnly'), instance.option('readOnly'), 'right readonly option');
    });

    ['WEEKLY', 'MONTHLY', 'YEARLY'].forEach(value => {
        QUnit.test(`Recurrence editor should not crash when FREQ=${value} is set without startDate`, function(assert) {
            const instance = createInstance({ value: `FREQ=${value}` });

            assert.equal(instance.option('value'), `FREQ=${value}`);
            assert.equal($('.dx-recurrence-editor-container').length, 1, 'recurrenceEditor was rendered');
        });
    });

    test('The recurrence editor should fire value change only once when the last selected day unselecting (Angular T1154651)', function(assert) {
        const result = [];
        const expectedResult = ['FREQ=WEEKLY;BYDAY=SU'];
        const instance = createInstance({
            value: 'FREQ=WEEKLY;BYDAY=MO',
            startDate: new Date('2023-06-18T22:00:00'),
        });
        instance.on('valueChanged', ({ value }) => {
            result.push(value);
        });

        $('#recurrence-editor .dx-item-selected').click();

        this.clock.tick(100);

        assert.equal(result.length, 1, 'valueChanged called only once');
        assert.deepEqual(result, expectedResult, 'default value restored');
    });
});

module('GetEditorByField', () => {
    const cases = [
        { field: 'freq', isNecessarily: true, editorType: SelectBox },
        { field: 'interval', isNecessarily: true, editorType: NumberBox },
        { field: 'count', isNecessarily: true, editorType: NumberBox },
        { field: 'until', isNecessarily: true, editorType: DateBox },
        { field: 'repeatEnd', isNecessarily: true, editorType: RadioGroup },
        { field: 'byday', isNecessarily: false, editorType: ButtonGroup, freq: 'FREQ=WEEKLY' },
        { field: 'bymonth', isNecessarily: false, editorType: SelectBox, freq: 'FREQ=YEARLY' },
        { field: 'bymonthday', isNecessarily: false, editorType: NumberBox, freq: 'FREQ=MONTHLY' }

    ];

    cases.forEach((config) => {
        QUnit.test(`getEditorByField should return editor if it's visible, field=${config.field}`, function(assert) {
            const instance = createInstance({ value: 'FREQ=DAILY' });
            let editor = instance.getEditorByField(config.field);

            if(!config.isNecessarily) {
                assert.strictEqual(editor, undefined, 'editor is hidden');

                instance.option('value', config.freq);
                editor = instance.getEditorByField(config.field);
            }

            assert.ok(editor instanceof config.editorType, `returned editor is ${config.editorType}`);
            assert.equal(editor.option('field'), config.field, 'returned editor has correct field');
        });
    });
});

module('Frequency editor', () => {
    test('Recurrence editor should contain select box for select freq', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY' });

        assert.ok(getFreqEditor(instance) instanceof SelectBox, 'Freq editor is SelectBox');
    });

    test('Frequency editor should have right css class', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY' });

        assert.ok(getFreqEditor(instance).$element().hasClass(FREQUENCY_EDITOR), 'Freq editor class is correct');
    });

    test('Frequency editor should have right defaults', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY' });

        assert.equal(getFreqEditor(instance).option('value'), 'weekly', 'Value is right');
        assert.equal(getFreqEditor(instance).option('layout'), 'horizontal', 'Layout is right');
    });

    test('Freq editor should have right items', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY' });

        const items = getFreqEditor(instance).option('items');
        /* {
            // functionality is not removed, but hide the ability to set minute recurrence in the editor.
            // in the future, if we publish the dxRecurrenceEditor, then we publish the minute recurrence
            { text: 'Minutely', value: 'minutely' };
        }*/
        const itemValues = [{ text: 'Hourly', value: 'hourly' }, { text: 'Daily', value: 'daily' }, { text: 'Weekly', value: 'weekly' }, { text: 'Monthly', value: 'monthly' }, { text: 'Yearly', value: 'yearly' }];

        for(let i = 0, len = items.length; i < len; i++) {
            assert.equal(items[i].text(), itemValues[i].text, 'item text is right');
            assert.equal(items[i].value, itemValues[i].value, 'item value is right');
        }
    });

    test('Recurrence editor should correctly process values of the freq selectBox, byday setting', function(assert) {
        const instance = createInstance({ startDate: new Date(2015, 7, 27) });

        assert.equal(instance.option('value'), null, 'Recurrence editor has right value');

        getFreqEditor(instance).option('value', 'weekly');
        assert.equal(instance.option('value'), 'FREQ=WEEKLY;BYDAY=TH', 'Recurrence editor has right value');
    });

    test('Recurrence editor should correctly process values of the freq selectBox, bymonthday setting', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY', startDate: new Date(2015, 2, 10) });

        getFreqEditor(instance).option('value', 'monthly');

        assert.equal(instance.option('value'), 'FREQ=MONTHLY;BYMONTHDAY=10', 'Recurrence editor has right value');
    });

    test('Recurrence editor should correctly process values of the freq radioGroup, bymonthday and bymonth setting', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY', startDate: new Date(2015, 2, 10) });

        getFreqEditor(instance).option('value', 'yearly');

        assert.equal(instance.option('value'), 'FREQ=YEARLY;BYMONTHDAY=10;BYMONTH=3', 'Recurrence editor has right value');
    });

    test('Recurrence editor onValueChanged should be fired after changing value', function(assert) {
        let fired = 0;
        const instance = createInstance({
            value: 'FREQ=MONTHLY',
            startDate: new Date(2019, 1, 1),
            onValueChanged: function() {
                fired++;
            }
        });

        getFreqEditor(instance).option('value', 'weekly');

        assert.equal(fired, 1, 'Recurrence editor onValueChanged is fired');
    });

    test('Recurrence editor should correctly pass values to the freq editor', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY', startDate: new Date(2019, 1, 1), });

        assert.equal(getFreqEditor(instance).option('value'), 'weekly', 'Freq editor has right value');

        instance.option('value', 'FREQ=MONTHLY');
        assert.equal(getFreqEditor(instance).option('value'), 'monthly', 'Freq editor has right value');
    });

    $.each(['minutely', 'hourly'], (_, value) => {
        test(`Recurrence editor should correctly set frequency on ${value} freq`, function(assert) {
            const instance = createInstance();

            assert.equal(instance.option('value'), null, 'Freq editor has right value');
            getFreqEditor(instance).option('value', value);
            assert.equal(instance.option('value'), `FREQ=${value.toUpperCase()}`, 'Recurrence editor has right value');
        });

        test(`Recurrence editor should correctly set interval on ${value} freq`, function(assert) {
            const instance = createInstance();

            getFreqEditor(instance).option('value', value);
            const intervalEditor = instance.getRecurrenceForm().getEditor('interval');
            intervalEditor.option('value', 10);

            assert.equal(instance.option('value'), `FREQ=${value.toUpperCase()};INTERVAL=10`, 'Freq editor has right value');
        });
    });
});

module('Repeat-end editor', () => {
    test('Recurrence editor should contain repeat-type radio group to turn on/of repeat-end', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY' });

        assert.ok(getRepeatEndEditor(instance) instanceof RadioGroup, 'Repeat-end editor is RadioGroup');
    });

    test('Recurrence repeat-end editor should have right default', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY' });
        const itemValues = [
            { type: 'never' },
            { type: 'until' },
            { type: 'count' }
        ];

        assert.ok(getRepeatEndEditor(instance).$element().hasClass(REPEAT_END_TYPE_EDITOR), 'Repeat-end editor has a class');
        assert.equal(getRepeatEndEditor(instance).option('value'), 'never', 'Repeat-end editor has a right default value');
        assert.deepEqual(getRepeatEndEditor(instance).option('items'), itemValues, 'Repeat-end editor items are correct');
    });

    test('Repeat-end should process rules correctly', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY;COUNT=10' });

        assert.equal(getRepeatEndEditor(instance).option('value'), 'count', 'value is correct');

        instance.option('value', 'FREQ=WEEKLY;UNTIL=19971224T000000Z');

        assert.equal(getRepeatEndEditor(instance).option('value'), 'until', 'value is correct');
    });

    test('Recurrence repeat-type editor should be rendered with right inner editors', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY;COUNT=10' });

        const $repeatCount = getRepeatEndEditor(instance).$element().find('.' + REPEAT_COUNT_EDITOR);
        const $repeatUntilDate = getRepeatEndEditor(instance).$element().find('.' + REPEAT_DATE_EDITOR);

        assert.equal($repeatCount.length, 1, 'repeatCount editor was rendered');
        assert.equal($repeatUntilDate.length, 1, 'repeatUntilDate editor was rendered');
    });

    test('Recurrence editor parts should be disabled if needed, recurrenceString changing', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY' });

        const $repeatCount = getRepeatEndEditor(instance).$element().find('.' + REPEAT_COUNT_EDITOR);
        const $repeatUntilDate = getRepeatEndEditor(instance).$element().find('.' + REPEAT_DATE_EDITOR);

        assert.ok($repeatCount.hasClass('dx-state-disabled'), 'repeat-count editor is disabled');
        assert.ok($repeatUntilDate.hasClass('dx-state-disabled'), 'repeat-until editor is disabled');

        instance.option('value', 'FREQ=WEEKLY;COUNT=10');

        assert.ok(!$repeatCount.hasClass('dx-state-disabled'), 'repeat-count editor is not disabled');
        assert.ok($repeatUntilDate.hasClass('dx-state-disabled'), 'repeat-until editor is disabled');

        instance.option('value', 'FREQ=WEEKLY;UNTIL=20151107');

        assert.ok($repeatCount.hasClass('dx-state-disabled'), 'repeat-count editor is disabled');
        assert.ok(!$repeatUntilDate.hasClass('dx-state-disabled'), 'repeat-until editor is not disabled');
    });

    test('Recurrence editor parts should be disabled if needed, repeat-end editor value changing', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY;COUNT=10' });

        const $repeatCount = getRepeatEndEditor(instance).$element().find('.' + REPEAT_COUNT_EDITOR);
        const $repeatUntilDate = getRepeatEndEditor(instance).$element().find('.' + REPEAT_DATE_EDITOR);

        getRepeatEndEditor(instance).option('value', 'until');

        assert.ok($repeatCount.hasClass('dx-state-disabled'), 'repeat-count editor is disabled');
        assert.ok(!$repeatUntilDate.hasClass('dx-state-disabled'), 'repeat-until editor is not disabled');

        getRepeatEndEditor(instance).option('value', 'count');

        assert.ok(!$repeatCount.hasClass('dx-state-disabled'), 'repeat-count editor is not disabled');
        assert.ok($repeatUntilDate.hasClass('dx-state-disabled'), 'repeat-until editor is disabled');
    });

    test('Recurrence editor should correctly process values from repeat-end editor', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY;COUNT=10' });

        let date = dateUtils.trimTime(new Date());

        date.setDate(date.getDate() + 1);
        date = new Date(date.getTime() - 1);

        getRepeatEndEditor(instance).option('value', 'until');
        assert.equal(instance.option('value').substring(0, 26), ('FREQ=WEEKLY;UNTIL=' + getRecurrenceProcessor().getAsciiStringByDate(date)).substring(0, 26), 'Recurrence editor have right value');
    });

    test('Recurrence repeat-count editor should be rendered with right defaults', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY' });

        const $repeatCount = getRepeatEndEditor(instance).$element().find('.' + REPEAT_COUNT_EDITOR);
        const repeatCount = $repeatCount.dxNumberBox('instance');

        assert.equal(repeatCount.option('showSpinButtons'), true, 'numberBox has right min value');
        assert.equal(repeatCount.option('useLargeSpinButtons'), false, 'numberBox have right useLargeSpinButtons');
        assert.equal(repeatCount.option('min'), 1, 'numberBox has right min value');
        assert.equal(repeatCount.option('value'), 1, 'numberBox has right value');
        assert.equal(repeatCount.option('width'), 70, 'numberBox has right width');
    });

    test('Recurrence repeat-count editor should process rules correctly', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY' });

        const $repeatCount = getRepeatEndEditor(instance).$element().find('.' + REPEAT_COUNT_EDITOR);
        const repeatCount = $repeatCount.dxNumberBox('instance');

        ['FREQ=WEEKLY;COUNT=10', 'FREQ=WEEKLY;COUNT=12'].forEach((recurrenceString) => {
            instance.option('value', recurrenceString);

            const ruleParts = recurrenceString.split(';');
            assert.equal(repeatCount.option('value'), ruleParts[1].split('=')[1], 'value of repeat-count editor is correct');
        });
    });

    test('Recurrence editor should correctly process values from repeat-count editor', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY;COUNT=1' });

        const $repeatCount = getRepeatEndEditor(instance).$element().find('.' + REPEAT_COUNT_EDITOR);
        const repeatCount = $repeatCount.dxNumberBox('instance');

        [10, 12].forEach((value) => {
            repeatCount.option('value', value);
            assert.equal(instance.option('value'), `FREQ=WEEKLY;COUNT=${value}`, `Recurrence editor has right value=${value}`);
        });
    });

    test('Recurrence repeat-until editor should be rendered with right defaults', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY;UNTIL=20151007', firstDayOfWeek: 2 });

        const $repeatUntilDate = getRepeatEndEditor(instance).$element().find('.' + REPEAT_DATE_EDITOR);
        const untilDate = $repeatUntilDate.dxDateBox('instance');

        assert.equal(untilDate.option('type'), 'date', 'dateBox has right type');
        assert.deepEqual(untilDate.option('calendarOptions'), { firstDayOfWeek: 2 }, 'dateBox has right calendarOptions');
        assert.deepEqual(untilDate.option('value'), getRecurrenceProcessor().getDateByAsciiString('20151007'), 'dateBox has right value');
    });

    test('Recurrence repeat-until editor should process rules correctly', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY;UNTIL=20151007' });

        const $repeatUntilDate = getRepeatEndEditor(instance).$element().find('.' + REPEAT_DATE_EDITOR);
        const untilDate = $repeatUntilDate.dxDateBox('instance');

        ['FREQ=WEEKLY;UNTIL=20151107', 'FREQ=WEEKLY;UNTIL=20201107'].forEach((recurrenceString) => {
            instance.option('value', recurrenceString);

            const ruleParts = recurrenceString.split(';');
            assert.deepEqual(untilDate.option('value'), getRecurrenceProcessor().getDateByAsciiString(ruleParts[1].split('=')[1]), 'value of until-date editor is correct');
        });
    });

    test('Recurrence editor should correctly process values from until-date editor', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY;UNTIL=20151007' });

        const $repeatUntilDate = getRepeatEndEditor(instance).$element().find('.' + REPEAT_DATE_EDITOR);
        const untilDate = $repeatUntilDate.dxDateBox('instance');

        [new Date(2015, 11, 7), new Date(2020, 11, 7)].forEach((date) => {
            untilDate.option('value', date);

            date = dateUtils.trimTime(date);
            date.setDate(date.getDate() + 1);
            date = new Date(date.getTime() - 1);

            assert.equal(instance.option('value'), `FREQ=WEEKLY;UNTIL=${getRecurrenceProcessor().getAsciiStringByDate(date)}`, 'Recurrence editor has right value');
        });
    });

    module('timezone', () => {
        [
            [
                'America/Los_Angeles',
                undefined,
                {
                    appointmentTimeZone: undefined,
                    path: 'Grid'
                }],
            [
                undefined,
                'America/Los_Angeles',
                {
                    appointmentTimeZone: 'America/Los_Angeles',
                    path: 'Appointment'
                },
            ],
            [
                'America/Los_Angeles',
                'America/Los_Angeles',
                {
                    appointmentTimeZone: 'America/Los_Angeles',
                    path: 'Appointment'
                },
            ]
        ].forEach(testCase => {
            test('Repeat-until dateBox should get date considering scheduler timeZone', function(assert) {
                const [gridTimeZone, startDateTimeZone] = testCase;
                const timeZoneCalculator = createTimeZoneCalculator(gridTimeZone);

                const instance = createInstance({
                    value: 'FREQ=WEEKLY;UNTIL=20230617T065959Z',
                    timeZoneCalculator,
                    getStartDateTimeZone: () => startDateTimeZone
                });

                const $repeatUntilDate = getRepeatEndEditor(instance).$element().find('.' + REPEAT_DATE_EDITOR);
                const untilDate = $repeatUntilDate.dxDateBox('instance');

                assert.deepEqual(untilDate.option('value'), new Date('2023-06-16 23:59:59'), 'dateBox has right value');
            });

            test('Repeat-until dateBox should apply date considering scheduler timeZone', function(assert) {
                const [gridTimeZone, startDateTimeZone, result] = testCase;

                const timeZoneCalculator = createTimeZoneCalculator(gridTimeZone);
                const timeZoneCalculatorSpy = sinon.spy(timeZoneCalculator, 'createDate');

                const instance = createInstance({
                    value: 'FREQ=WEEKLY;UNTIL=20151007T000000Z', // some other date, we'll change it later in dateBox
                    timeZoneCalculator,
                    getStartDateTimeZone: () => startDateTimeZone
                });
                assert.deepEqual(timeZoneCalculatorSpy.getCall(0).args[1], { ...result, path: 'to' + result.path });

                const $repeatUntilDate = getRepeatEndEditor(instance).$element().find('.' + REPEAT_DATE_EDITOR);
                const untilDate = $repeatUntilDate.dxDateBox('instance');

                untilDate.option('value', new Date('2023-06-16 23:59:59'));

                assert.deepEqual(timeZoneCalculatorSpy.getCall(1).args[1], { ...result, path: 'from' + result.path });
                assert.equal(instance.option('value'), 'FREQ=WEEKLY;UNTIL=20230617T065959Z', 'Recurrence editor has right value');
            });
        });
    });
});

module('Interval editor', () => {
    test('Recurrence interval numberbox should be rendered with right defaults', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY' });

        const $intervalLabel = instance.$element().find(`.${INTERVAL_EDITOR}${LABEL_POSTFIX}`);
        assert.ok(getIntervalEditor(instance) instanceof NumberBox, 'Interval editor is NumberBox');

        assert.equal($intervalLabel.length, 1, 'Label for interval editor was rendered');
        assert.equal(getIntervalEditor(instance).option('showSpinButtons'), true, 'Interval editor has right showSpinButtons');
        assert.equal(getIntervalEditor(instance).option('useLargeSpinButtons'), false, 'Interval editor has right useLargeSpinButtons');
        assert.equal(getIntervalEditor(instance).option('min'), 1, 'Interval editor has right min value');
        assert.equal(getIntervalEditor(instance).option('value'), 1, 'Interval editor hase right value');
        assert.equal(getIntervalEditor(instance).option('width'), 70, 'Interval editor has right width');
    });

    test('Interval editor should have right css class', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY' });

        assert.ok(getIntervalEditor(instance).$element().hasClass(INTERVAL_EDITOR), 'Interval editor class is correct');
    });

    test('Recurrence interval editor should process value correctly', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY;INTERVAL=2' });

        assert.equal(getIntervalEditor(instance).option('value'), 2, 'Interval editor has right value after init');

        instance.option('value', 'FREQ=WEEKLY;INTERVAL=3');

        assert.equal(getIntervalEditor(instance).option('value'), 3, 'Interval editor has right value');
    });

    test('Recurrence editor should correctly process values from interval editor', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY;INTERVAL=2' });

        getIntervalEditor(instance).option('value', 3);

        assert.equal(instance.option('value'), 'FREQ=WEEKLY;INTERVAL=3', 'Recurrence editor has right value');
    });

    const textCases = [
        { freq: 'WEEKLY', expectedText: 'week(s)' },
        { freq: 'DAILY', expectedText: 'day(s)' },
        { freq: 'MONTHLY', expectedText: 'month(s)' },
        { freq: 'YEARLY', expectedText: 'year(s)' }
    ];

    textCases.forEach((config) => {
        QUnit.test(`Recurrence interval label should have correct text on init, freq=${config.freq}`, function(assert) {
            const instance = createInstance({
                value: `FREQ=${config.freq}`
            });

            const $label = instance.$element().find(`.${INTERVAL_EDITOR}${LABEL_POSTFIX}`);

            assert.equal($label.text(), config.expectedText, 'label text is correct');
        });
    });

    textCases.forEach((config) => {
        QUnit.test(`Recurrence interval label should have correct text after changing freq, freq=${config.freq}`, function(assert) {
            const instance = createInstance();

            instance.option('value', `FREQ=${config.freq}`);
            const $label = instance.$element().find(`.${INTERVAL_EDITOR}${LABEL_POSTFIX}`);

            assert.equal($label.text(), config.expectedText, 'label text is correct');
        });
    });
});

module('Repeat-on editor', () => {
    test('Recurrence repeat-on editor should be rendered', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY' });

        const $repeatOn = instance.$element().find('.' + REPEAT_ON_EDITOR);

        assert.equal($repeatOn.length, 1, 'repeat-on editor was rendered');
    });

    test('Recurrence repeat-on lablle should have correct css class', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY' });

        const $repeatOnLabel = instance.$element().find(`.${REPEAT_ON_EDITOR}${LABEL_POSTFIX}`);

        assert.equal($repeatOnLabel.text(), 'Repeat On', 'label text is correct');
    });

    test('Recurrence repeat-on editor should contain repeat-on-week editor, when freq = weekly', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY' });

        const buttonGroup = instance.getEditorByField('byday');

        assert.ok(buttonGroup instanceof ButtonGroup, 'repeat-on-week editor was rendered');
        assert.ok(buttonGroup.$element().hasClass(RECURRENCE_BUTTON_GROUP), 'repeat-on-week editor has correct class');
    });

    test('Repeat-on-week editor should have right defaults', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY' });

        const buttonGroup = instance.getEditorByField('byday');

        assert.equal(buttonGroup.option('selectionMode'), 'multiple', 'Selection mode is ok');
        assert.equal(buttonGroup.option('keyExpr'), 'key', 'KeyExpr mode is ok');
        assert.equal(buttonGroup.option('field'), 'byday', 'Field mode is ok');
    });

    test('Recurrence repeat-on editor should process values correctly, freq = weekly', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY;BYDAY=TU,SU' });
        assert.deepEqual($('.' + 'dx-buttongroup').eq(0).dxButtonGroup('instance').option('selectedItemKeys'), ['SU', 'TU'], 'Right button group select item keys');

        instance.option('value', 'FREQ=WEEKLY;BYDAY=MO');
        assert.deepEqual($('.' + 'dx-buttongroup').eq(0).dxButtonGroup('instance').option('selectedItemKeys'), ['MO'], 'Right button group select item keys');
    });

    test('Recurrence repeat-on editor should process values by startDate correctly, freq = weekly', function(assert) {
        createInstance({ value: 'FREQ=WEEKLY', startDate: new Date(2015, 1, 1, 1) });

        assert.deepEqual($('.' + 'dx-buttongroup').eq(0).dxButtonGroup('instance').option('selectedItemKeys'), ['SU'], 'Right button group select item keys');
    });

    test('Recurrence repeat-on editor should process values by startDate correctly after remove selection, freq = weekly', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY', startDate: new Date(2015, 1, 1, 1) });

        const buttonGroup = instance.getEditorByField('byday');
        buttonGroup.option('selectedItemKeys', []);

        assert.deepEqual(buttonGroup.option('selectedItemKeys'), ['SU'], 'Selection should consider startDate day');
    });

    test('Recurrence editor should process values from repeat-on-editor after init correctly, freq=weekly', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY;BYDAY=TU' });

        const buttonGroup = $('.' + 'dx-buttongroup').eq(0).dxButtonGroup('instance');
        buttonGroup.option('selectedItemKeys', ['TU', 'WE']);

        assert.equal(instance.option('value'), 'FREQ=WEEKLY;BYDAY=TU,WE', 'Recurrence editor value is correct');
    });

    test('Recurrence editor should process values from repeat-on-editor after remove selection, freq=weekly', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY;BYDAY=TU', startDate: new Date(2015, 1, 1, 1) });

        const buttonGroup = $('.' + 'dx-buttongroup').eq(0).dxButtonGroup('instance');
        buttonGroup.option('selectedItemKeys', []);

        assert.equal(instance.option('value'), 'FREQ=WEEKLY;BYDAY=SU', 'Recurrence editor value is correct');
    });

    test('\'BYDAY\' rule has a higher priority than \'startDate\' rule, freq=weekly', function(assert) {
        createInstance({ value: 'FREQ=WEEKLY;BYDAY=TU', startDate: new Date(2015, 1, 1, 1) });

        assert.deepEqual($('.' + 'dx-buttongroup').eq(0).dxButtonGroup('instance').option('selectedItemKeys'), ['TU'], 'Right button group select item keys');
    });

    test('Recurrence editor should process values from repeat-on-editor correctly, freq=weekly', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY;BYDAY=TU,SU' });

        const buttonGroup = $('.' + 'dx-buttongroup').eq(0).dxButtonGroup('instance');
        buttonGroup.option('selectedItemKeys', ['TU', 'SU', 'MO']);

        assert.equal(instance.option('value'), 'FREQ=WEEKLY;BYDAY=SU,MO,TU');
    });

    test('Recurrence repeat-on editor should contain repeat-on-month editor, when freq = monthly', function(assert) {
        const instance = createInstance({ value: 'FREQ=MONTHLY', startDate: new Date(2019, 1, 1) });
        const dayOfMonth = instance.getRecurrenceForm().getEditor('bymonthday');

        assert.ok(dayOfMonth.$element().hasClass(DAY_OF_MONTH), 'correct default value of day-of-month editor');
        assert.equal(dayOfMonth.option('min'), 1, 'correct default value of day-of-month editor');
        assert.equal(dayOfMonth.option('max'), 31, 'correct default value of day-of-month editor');
        assert.equal(dayOfMonth.option('showSpinButtons'), true, 'correct default value of day-of-month editor');
        assert.equal(dayOfMonth.option('useLargeSpinButtons'), false, 'numberBox have right useLargeSpinButtons');
    });

    test('Recurrence repeat-on editor should should process values correctly, when freq = monthly', function(assert) {
        const instance = createInstance({ value: 'FREQ=MONTHLY;BYMONTHDAY=5' });

        const dayOfMonth = instance.getRecurrenceForm().getEditor('bymonthday');

        assert.equal(dayOfMonth.option('value'), 5, 'repeat-on-month editor was rendered');

        instance.option('value', 'FREQ=MONTHLY;BYMONTHDAY=6');

        assert.equal(dayOfMonth.option('value'), 6, 'repeat-on-month editor was rendered');
    });

    test('Recurrence repeat-on editor should should process values by startDate correctly, when freq = monthly', function(assert) {
        const instance = createInstance({ value: 'FREQ=MONTHLY', startDate: new Date(2015, 1, 10, 1) });

        const dayOfMonth = instance.getRecurrenceForm().getEditor('bymonthday');

        assert.equal(dayOfMonth.option('value'), 10, 'repeat-on-month editor was rendered with right value');
    });

    test('Recurrence editor should process values from repeat-on-editor correctly, freq=monthly', function(assert) {
        const instance = createInstance({ value: 'FREQ=MONTHLY;BYMONTHDAY=5' });

        const dayOfMonth = instance.getRecurrenceForm().getEditor('bymonthday');
        dayOfMonth.option('value', 12);

        assert.equal(instance.option('value'), 'FREQ=MONTHLY;BYMONTHDAY=12');
    });

    test('\'BYMONTHDAY\' rule has a higher priority than \'startDate\' rule, when freq = monthly', function(assert) {
        const instance = createInstance({ value: 'FREQ=MONTHLY;BYMONTHDAY=5', startDate: new Date(2015, 1, 10, 1) });

        const dayOfMonth = instance.getRecurrenceForm().getEditor('bymonthday');

        assert.equal(dayOfMonth.option('value'), 5, 'repeat-on-month editor was rendered with right value');
    });

    test('Recurrence repeat-on editor should contain repeat-on-year editor parts, when freq = yearly', function(assert) {
        const instance = createInstance({ value: 'FREQ=YEARLY', startDate: new Date(2019, 1, 1) });

        const $repeatOn = instance.$element().find('.' + REPEAT_ON_EDITOR);
        const $repeatOnMonth = $repeatOn.find('.' + MONTH_OF_YEAR);

        assert.equal($repeatOnMonth.length, 1, 'repeat-on-month editor was rendered');
        const $day = $repeatOn.find('.' + DAY_OF_MONTH);
        assert.equal($day.length, 1, 'day-of-month editor was rendered');
    });

    test('Recurrence repeat-on editor parts should have right defaults, when freq = yearly', function(assert) {
        const instance = createInstance({ value: 'FREQ=YEARLY', startDate: new Date(2019, 1, 1) });

        const monthOfYear = instance.getRecurrenceForm().getEditor('bymonth');

        assert.ok(monthOfYear.$element().hasClass(MONTH_OF_YEAR), 'correct default value of day-of-month editor');
        assert.equal(monthOfYear.option('items').length, 12, 'items are correct');
        assert.equal(monthOfYear.option('value'), 2, 'value is correct');
        assert.equal(monthOfYear.option('text'), 'February', 'text is correct');
    });

    test('Recurrence repeat-on editor should should process values correctly, when freq = yearly', function(assert) {
        const instance = createInstance({ value: 'FREQ=YEARLY;BYMONTH=10;BYMONTHDAY=5' });

        const getDayOfMonth = () => instance.getRecurrenceForm().getEditor('bymonthday').option('value');
        const getMonth = () => instance.getRecurrenceForm().getEditor('bymonth').option('value');

        assert.equal(getDayOfMonth(), 5, 'day was set correctly');
        assert.equal(getMonth(), 10, 'month was set correctly');

        instance.option('value', 'FREQ=YEARLY;BYMONTH=11;BYMONTHDAY=6');

        assert.equal(getDayOfMonth(), 6, 'day was set correctly');
        assert.equal(getMonth(), 11, 'month was set correctly');
    });

    test('Recurrence repeat-on editor should process values by startDate correctly, when freq = yearly', function(assert) {
        const instance = createInstance({ value: 'FREQ=YEARLY', startDate: new Date(2015, 2, 10, 1) });

        const dayEditor = instance.getRecurrenceForm().getEditor('bymonthday');
        const monthEditor = instance.getRecurrenceForm().getEditor('bymonth');

        assert.equal(dayEditor.option('value'), 10, 'day was set correctly');
        assert.equal(monthEditor.option('value'), 3, 'month was set correctly');
    });

    test('Recurrence editor should process values from repeat-on-editor correctly, freq = yearly', function(assert) {
        const instance = createInstance({ value: 'FREQ=YEARLY;BYMONTHDAY=4;BYMONTH=11', startDate: new Date(2015, 7, 4) });

        const monthEditor = instance.getRecurrenceForm().getEditor('bymonth');

        monthEditor.option('value', '10');

        assert.equal(instance.option('value'), 'FREQ=YEARLY;BYMONTHDAY=4;BYMONTH=10', 'recurrence editor value is correct');

        const dayOfMonth = instance.getRecurrenceForm().getEditor('bymonthday');
        dayOfMonth.option('value', 5);

        assert.equal(instance.option('value'), 'FREQ=YEARLY;BYMONTHDAY=5;BYMONTH=10', 'recurrence editor value is correct');
    });

    test('\'BYMONTH\' rule should has right default value, when freq = yearly', function(assert) {
        const instance = createInstance({ value: 'FREQ=YEARLY', startDate: new Date(2016, 4, 10) });

        const monthEditor = instance.getRecurrenceForm().getEditor('bymonth');

        assert.equal(monthEditor.option('value'), 5, 'month was set correctly');
    });

    test('\'BYMONTH\' rule has a higher priority than \'startDate\' rule, when freq = yearly', function(assert) {
        const instance = createInstance({ value: 'FREQ=YEARLY;BYMONTH=10;BYMONTHDAY=5', startDate: new Date(2015, 2, 10, 1) });

        const monthEditor = instance.getRecurrenceForm().getEditor('bymonth');
        const dayEditor = instance.getRecurrenceForm().getEditor('bymonthday');

        assert.equal(dayEditor.option('value'), 5, 'day was set correctly');
        assert.equal(monthEditor.option('value'), 10, 'month was set correctly');
    });

    const repeatOnPartsVisibilityCases = [
        { freq: 'WEEKLY', byDayVisible: true, byMonthDayVisible: false, byMonthVisible: false, labelVisible: true },
        { freq: 'DAILY', byDayVisible: false, byMonthDayVisible: false, byMonthVisible: false, labelVisible: false },
        { freq: 'HOURLY', byDayVisible: false, byMonthDayVisible: false, byMonthVisible: false, labelVisible: false },
        { freq: 'MONTHLY', byDayVisible: false, byMonthDayVisible: true, byMonthVisible: false, labelVisible: true },
        { freq: 'YEARLY', byDayVisible: false, byMonthDayVisible: true, byMonthVisible: true, labelVisible: true }
    ];

    repeatOnPartsVisibilityCases.forEach((config) => {
        QUnit.test(`Recurrence repeat-on editor parts visibility on init, freq=${config.freq}`, function(assert) {
            const instance = createInstance({
                value: `FREQ=${config.freq}`
            });

            const recurrenceForm = instance.getRecurrenceForm();

            assert.equal(recurrenceForm.itemOption('repeatOnLabel').visible, config.labelVisible, `label visibility is ${config.byDayVisible}`);
            assert.equal(recurrenceForm.itemOption('byday').visible, config.byDayVisible, `byday editor visibility is ${config.byDayVisible}`);
            assert.equal(recurrenceForm.itemOption('bymonthday').visible, config.byMonthDayVisible, `bymonthday editor visibility is ${config.byMonthDayVisible}`);
            assert.equal(recurrenceForm.itemOption('bymonth').visible, config.byMonthVisible, `bymonth editor visibility is ${config.byDayVisible}`);
        });
    });

    repeatOnPartsVisibilityCases.forEach((config) => {
        QUnit.test(`Recurrence repeat-on editor parts visibility after changing freq, freq=${config.freq}`, function(assert) {
            const instance = createInstance();

            instance.option('value', `FREQ=${config.freq}`);
            const recurrenceForm = instance.getRecurrenceForm();

            assert.equal(recurrenceForm.itemOption('repeatOnLabel').visible, config.labelVisible, `label visibility is ${config.byDayVisible}`);
            assert.equal(recurrenceForm.itemOption('byday').visible, config.byDayVisible, `byday editor visibility is ${config.byDayVisible}`);
            assert.equal(recurrenceForm.itemOption('bymonthday').visible, config.byMonthDayVisible, `bymonthday editor visibility is ${config.byMonthDayVisible}`);
            assert.equal(recurrenceForm.itemOption('bymonth').visible, config.byMonthVisible, `bymonth editor visibility is ${config.byDayVisible}`);
        });
    });

    test('Recurrence editor should process values from repeat-on-editor correctly after freq changing', function(assert) {
        const instance = createInstance({ value: 'FREQ=YEARLY', startDate: new Date(2015, 2, 10) });

        const monthEditor = instance.getRecurrenceForm().getEditor('bymonth');
        const freqEditor = instance.getRecurrenceForm().getEditor('freq');

        monthEditor.option('value', '10');
        freqEditor.option('value', 'daily');

        assert.equal(instance.option('value'), 'FREQ=DAILY', 'recurrence editor value is correct');

        freqEditor.option('value', 'monthly');

        const dayEditor = instance.getRecurrenceForm().getEditor('bymonthday');

        dayEditor.option('value', 5);
        freqEditor.option('value', 'yearly');

        assert.equal(instance.option('value'), 'FREQ=YEARLY;BYMONTHDAY=5;BYMONTH=3', 'recurrence editor value is correct');
    });
});

module('FirstDayOfWeek setting', () => {
    test('Recurrence editor should have correct firstDayOfWeek default value', function(assert) {
        const instance = createInstance();

        assert.strictEqual(instance.option('firstDayOfWeek'), undefined, 'default value is correct');
    });

    test('Recurrence editor should have correct firstDayOfWeek value if this is different in localization', function(assert) {
        const spy = sinon.spy(dateLocalization, 'firstDayOfWeekIndex');

        createInstance({ firstDayOfWeek: 0 });

        assert.notOk(spy.called, 'firstDayOfWeekIndex wasn\'t called');
    });

    test('Repeat-until dateBox should have right firstDayOfWeek', function(assert) {
        const instance = createInstance({ firstDayOfWeek: 5, value: 'FREQ=WEEKLY;UNTIL=20151007' });

        const $untilDate = instance.$element().find('.' + REPEAT_DATE_EDITOR);
        const untilDate = $untilDate.dxDateBox('instance');

        assert.equal(untilDate.option('calendarOptions.firstDayOfWeek'), 5, 'First day of the week is ok');
    });

    test('Repeat-until dateBox should have right firstDayOfWeek after firstDayOfWeek option changing', function(assert) {
        const instance = createInstance({ firstDayOfWeek: 5, value: 'FREQ=WEEKLY;UNTIL=20151007' });
        instance.option('firstDayOfWeek', 1);

        const $untilDate = instance.$element().find('.' + REPEAT_DATE_EDITOR);
        const untilDate = $untilDate.dxDateBox('instance');

        assert.equal(untilDate.option('calendarOptions.firstDayOfWeek'), 1, 'First day of the week is ok');
    });

    const dayNames = [{ key: 'SU', text: 'Sun' }, { key: 'MO', text: 'Mon' }, { key: 'TU', text: 'Tue' }, { key: 'WE', text: 'Wed' }, { key: 'TH', text: 'Thu' }, { key: 'FR', text: 'Fri' }, { key: 'SA', text: 'Sat' }];

    test('Repeat-on-week editor should be rendered correctly', function(assert) {
        createInstance({ firstDayOfWeek: 3, value: 'FREQ=WEEKLY;BYDAY=TU' });

        const buttonGroup = $('.' + 'dx-buttongroup').eq(0).dxButtonGroup('instance');
        assert.deepEqual(buttonGroup.option('items'), dayNames.slice(3).concat(dayNames.slice(0, 3)));
    });

    test('Repeat-on-week editor should be rendered correctly after firstDayOfWeek option changing', function(assert) {
        const instance = createInstance({ firstDayOfWeek: 3, value: 'FREQ=WEEKLY;BYDAY=TU' });
        instance.option('firstDayOfWeek', 5);

        const buttonGroup = $('.' + 'dx-buttongroup').eq(0).dxButtonGroup('instance');
        assert.deepEqual(buttonGroup.option('items'), dayNames.slice(5).concat(dayNames.slice(0, 5)));
    });

    test('Repeat-count editor should have correct value after re-initializing values', function(assert) {
        const instance = createInstance({ value: 'FREQ=WEEKLY;BYDAY=SU,TU;COUNT=3' });

        instance.option('value', '');

        instance.option('value', 'FREQ=WEEKLY;BYDAY=SU,TU;COUNT=3');

        const repeatCount = instance.$element().find('.' + REPEAT_COUNT_EDITOR).eq(0).dxNumberBox('instance');

        assert.equal(repeatCount.option('value'), 3, 'Value was processed correctly');
    });
});

