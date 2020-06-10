import 'common.css!';

import $ from 'jquery';
import dateUtils from 'core/utils/date';
import RecurrenceEditor from 'ui/scheduler/ui.scheduler.recurrence_editor';
import SelectBox from 'ui/select_box';
import NumberBox from 'ui/number_box';
import RadioGroup from 'ui/radio_group';
import { getRecurrenceProcessor } from 'ui/scheduler/recurrence';
import dateLocalization from 'localization/date';

// const FREQUENCY_EDITOR = 'dx-recurrence-selectbox-freq';
const REPEAT_COUNT_EDITOR = 'dx-recurrence-numberbox-repeat-count';
const REPEAT_DATE_EDITOR = 'dx-recurrence-datebox-until-date';
const REPEAT_ON_EDITOR = 'dx-recurrence-repeat-on';
// const REPEAT_ON_MONTH_EDITOR = 'dx-recurrence-repeat-on-month';
const DAY_OF_MONTH = 'dx-recurrence-numberbox-day-of-month';
// const REPEAT_ON_YEAR_EDITOR = 'dx-recurrence-repeat-on-year';
const MONTH_OF_YEAR = 'dx-recurrence-selectbox-month-of-year';
// const EVERY_INTERVAL = 'dx-recurrence-numberbox-interval';
const RECURRENCE_BUTTON_GROUP = 'dx-recurrence-button-group';

const { testStart, test, module } = QUnit;

testStart(() => {
    $('#qunit-fixture').html('<div id="recurrence-editor"></div>');
});

const moduleConfig = {
    beforeEach() {
        this.createInstance = function(options) {
            this.instance = new RecurrenceEditor($('#recurrence-editor'), options);
            this.freqEditor = this.instance.getRecurrenceForm().getEditor('freq');
        };
    }
};

module('Recurrence Editor rendering', moduleConfig, () => {
    test('Recurrence editor should be initialized', function(assert) {
        this.createInstance();
        assert.ok(this.instance instanceof RecurrenceEditor, 'dxRecurrenceEditor was initialized');

        assert.ok(this.instance.$element().hasClass('dx-recurrence-editor'));
    });

    test('Recurrence editor should have correct default options', function(assert) {
        this.createInstance();

        assert.equal(this.instance.option('value'), null, 'value is right');
        assert.equal(this.instance.option('visible'), true, 'editor is visible');
    });

    test('Recurrence editor should correctly process null value and reset inner editors to default values', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY' });

        this.instance.option('value', null);
        this.instance.option('visible', true);

        assert.equal(this.freqEditor.option('value'), 'daily', 'freq editor default value was set');
    });

    test('Parts of recurrence editor should have right readonly option', function(assert) {
        this.createInstance({
            value: 'FREQ=DAILY',
            readOnly: true
        });

        assert.equal(this.instance.getRecurrenceForm().getEditor('interval').option('readOnly'), this.instance.option('readOnly'), 'right readonly option');
    });
});

module('Frequency editor', moduleConfig, () => {
    test('Recurrence editor should contain select box for select freq', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY' });

        assert.ok(this.freqEditor instanceof SelectBox, 'Freq editor is SelectBox');
    });

    test('Freq editor should have right items', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY' });

        const items = this.freqEditor.option('items');
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
        this.createInstance({ startDate: new Date(2015, 7, 27) });

        assert.equal(this.instance.option('value'), null, 'Recurrence editor has right value');

        this.freqEditor.option('value', 'weekly');
        assert.equal(this.instance.option('value'), 'FREQ=WEEKLY;BYDAY=TH', 'Recurrence editor has right value');
    });

    test('Recurrence editor should correctly process values of the freq selectBox, bymonthday setting', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY', startDate: new Date(2015, 2, 10) });

        this.freqEditor.option('value', 'monthly');

        assert.equal(this.instance.option('value'), 'FREQ=MONTHLY;BYMONTHDAY=10', 'Recurrence editor has right value');
    });

    test('Recurrence editor should correctly process values of the freq radioGroup, bymonthday and bymonth setting', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY', startDate: new Date(2015, 2, 10) });

        this.freqEditor.option('value', 'yearly');

        assert.equal(this.instance.option('value'), 'FREQ=YEARLY;BYMONTHDAY=10;BYMONTH=3', 'Recurrence editor has right value');
    });

    test('Recurrence editor onValueChanged should be fired after changing value', function(assert) {
        let fired = 0;
        this.createInstance({
            value: 'FREQ=MONTHLY',
            startDate: new Date(2019, 1, 1),
            onValueChanged: function() {
                fired++;
            }
        });

        this.freqEditor.option('value', 'weekly');

        assert.equal(fired, 1, 'Recurrence editor onValueChanged is fired');
    });

    test('Recurrence editor should correctly pass values to the freq editor', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY', startDate: new Date(2019, 1, 1), });

        assert.equal(this.freqEditor.option('value'), 'weekly', 'Freq editor has right value');

        this.instance.option('value', 'FREQ=MONTHLY');
        assert.equal(this.freqEditor.option('value'), 'monthly', 'Freq editor has right value');
    });

    $.each(['minutely', 'hourly'], (_, value) => {
        test(`Recurrence editor should correctly set frequency on ${value} freq`, function(assert) {
            this.createInstance();

            assert.equal(this.instance.option('value'), null, 'Freq editor has right value');
            this.freqEditor.option('value', value);
            assert.equal(this.instance.option('value'), `FREQ=${value.toUpperCase()}`, 'Recurrence editor has right value');
        });

        test(`Recurrence editor should correctly set interval on ${value} freq`, function(assert) {
            this.createInstance();

            this.freqEditor.option('value', value);
            const intervalEditor = this.instance.getRecurrenceForm().getEditor('interval');
            intervalEditor.option('value', 10);

            assert.equal(this.instance.option('value'), `FREQ=${value.toUpperCase()};INTERVAL=10`, 'Freq editor has right value');
        });
    });
});

const repeatEndModuleConfig = {
    beforeEach() {
        this.createInstance = function(options) {
            this.instance = new RecurrenceEditor($('#recurrence-editor'), options);
            this.repeatEndEditor = this.instance._repeatEndEditor;
        };
    }
};

module('Repeat-end editor', repeatEndModuleConfig, () => {
    test('Recurrence editor should contain repeat-type radio group to turn on/of repeat-end', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY' });

        assert.ok(this.repeatEndEditor instanceof RadioGroup, 'Repeat-end editor is RadioGroup');
    });

    test('Recurrence repeat-end editor should have right default', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY' });
        const itemValues = [{ text: 'Never', value: 'never' }, { text: 'Count', value: 'count' }, { text: 'Until', value: 'until' }];
        const items = this.repeatEndEditor.option('items');

        assert.equal(this.repeatEndEditor.option('value'), 'never', 'Repeat-end editor has a right default value');
        for(let i = 0, len = items.length; i < len; i++) {
            assert.equal(items[i].text(), itemValues[i].text, 'item text is right');
            assert.equal(items[i].value, itemValues[i].value, 'item value is right');
        }
    });

    test('Repeat-end should process rules correctly', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY;COUNT=10' });

        assert.equal(this.repeatEndEditor.option('value'), 'count', 'value is correct');

        this.instance.option('value', 'FREQ=WEEKLY;UNTIL=19971224T000000Z');

        assert.equal(this.repeatEndEditor.option('value'), 'until', 'value is correct');
    });

    test('Recurrence repeat-type editor should be rendered with right inner editors', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY;COUNT=10' });

        const $repeatCount = this.repeatEndEditor.$element().find('.' + REPEAT_COUNT_EDITOR);
        const $repeatUntilDate = this.repeatEndEditor.$element().find('.' + REPEAT_DATE_EDITOR);

        assert.equal($repeatCount.length, 1, 'repeatCount editor was rendered');
        assert.equal($repeatUntilDate.length, 1, 'repeatUntilDate editor was rendered');
    });

    test('Recurrence editor parts should be disabled if needed, recurrenceString changing', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY' });

        const $repeatCount = this.repeatEndEditor.$element().find('.' + REPEAT_COUNT_EDITOR);
        const $repeatUntilDate = this.repeatEndEditor.$element().find('.' + REPEAT_DATE_EDITOR);

        assert.ok($repeatCount.hasClass('dx-state-disabled'), 'repeat-count editor is disabled');
        assert.ok($repeatUntilDate.hasClass('dx-state-disabled'), 'repeat-until editor is disabled');

        this.instance.option('value', 'FREQ=WEEKLY;COUNT=10');

        assert.ok(!$repeatCount.hasClass('dx-state-disabled'), 'repeat-count editor is not disabled');
        assert.ok($repeatUntilDate.hasClass('dx-state-disabled'), 'repeat-until editor is disabled');

        this.instance.option('value', 'FREQ=WEEKLY;UNTIL=20151107');

        assert.ok($repeatCount.hasClass('dx-state-disabled'), 'repeat-count editor is disabled');
        assert.ok(!$repeatUntilDate.hasClass('dx-state-disabled'), 'repeat-until editor is not disabled');
    });

    test('Recurrence editor parts should be disabled if needed, repeat-end editor value changing', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY;COUNT=10' });

        const $repeatCount = this.repeatEndEditor.$element().find('.' + REPEAT_COUNT_EDITOR);
        const $repeatUntilDate = this.repeatEndEditor.$element().find('.' + REPEAT_DATE_EDITOR);

        this.repeatEndEditor.option('value', 'until');

        assert.ok($repeatCount.hasClass('dx-state-disabled'), 'repeat-count editor is disabled');
        assert.ok(!$repeatUntilDate.hasClass('dx-state-disabled'), 'repeat-until editor is not disabled');

        this.repeatEndEditor.option('value', 'count');

        assert.ok(!$repeatCount.hasClass('dx-state-disabled'), 'repeat-count editor is not disabled');
        assert.ok($repeatUntilDate.hasClass('dx-state-disabled'), 'repeat-until editor is disabled');
    });

    test('Recurrence editor should correctly process values from repeat-end editor', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY;COUNT=10' });

        let date = dateUtils.trimTime(new Date());

        date.setDate(date.getDate() + 1);
        date = new Date(date.getTime() - 1);

        this.repeatEndEditor.option('value', 'until');
        assert.equal(this.instance.option('value').substring(0, 26), ('FREQ=WEEKLY;UNTIL=' + getRecurrenceProcessor().getAsciiStringByDate(date)).substring(0, 26), 'Recurrence editor have right value');
    });

    test('Recurrence repeat-count editor should be rendered with right defaults', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY' });

        const $repeatCount = this.repeatEndEditor.$element().find('.' + REPEAT_COUNT_EDITOR);
        const repeatCount = $repeatCount.dxNumberBox('instance');

        assert.equal(repeatCount.option('showSpinButtons'), true, 'numberBox has right min value');
        assert.equal(repeatCount.option('useLargeSpinButtons'), false, 'numberBox have right useLargeSpinButtons');
        assert.equal(repeatCount.option('min'), 1, 'numberBox has right min value');
        assert.equal(repeatCount.option('value'), 1, 'numberBox has right value');
        assert.equal(repeatCount.option('width'), 70, 'numberBox has right width');
    });

    test('Recurrence repeat-count editor should process rules correctly', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY' });

        const $repeatCount = this.repeatEndEditor.$element().find('.' + REPEAT_COUNT_EDITOR);
        const repeatCount = $repeatCount.dxNumberBox('instance');

        ['FREQ=WEEKLY;COUNT=10', 'FREQ=WEEKLY;COUNT=12'].forEach((recurrenceString) => {
            this.instance.option('value', recurrenceString);

            const ruleParts = recurrenceString.split(';');
            assert.equal(repeatCount.option('value'), ruleParts[1].split('=')[1], 'value of repeat-count editor is correct');
        });
    });

    test('Recurrence editor should correctly process values from repeat-count editor', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY;COUNT=1' });

        const $repeatCount = this.repeatEndEditor.$element().find('.' + REPEAT_COUNT_EDITOR);
        const repeatCount = $repeatCount.dxNumberBox('instance');

        [10, 12].forEach((value) => {
            repeatCount.option('value', value);
            assert.equal(this.instance.option('value'), `FREQ=WEEKLY;COUNT=${value}`, `Recurrence editor has right value=${value}`);
        });
    });

    test('Recurrence repeat-until editor should be rendered with right defaults', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY;UNTIL=20151007', firstDayOfWeek: 2 });

        const $repeatUntilDate = this.repeatEndEditor.$element().find('.' + REPEAT_DATE_EDITOR);
        const untilDate = $repeatUntilDate.dxDateBox('instance');

        assert.equal(untilDate.option('type'), 'date', 'dateBox has right type');
        assert.deepEqual(untilDate.option('calendarOptions'), { firstDayOfWeek: 2 }, 'dateBox has right calendarOptions');
        assert.deepEqual(untilDate.option('value'), getRecurrenceProcessor().getDateByAsciiString('20151007'), 'dateBox has right value');
    });

    test('Recurrence repeat-until editor should process rules correctly', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY;UNTIL=20151007' });

        const $repeatUntilDate = this.repeatEndEditor.$element().find('.' + REPEAT_DATE_EDITOR);
        const untilDate = $repeatUntilDate.dxDateBox('instance');

        ['FREQ=WEEKLY;UNTIL=20151107', 'FREQ=WEEKLY;UNTIL=20201107'].forEach((recurrenceString) => {
            this.instance.option('value', recurrenceString);

            const ruleParts = recurrenceString.split(';');
            assert.deepEqual(untilDate.option('value'), getRecurrenceProcessor().getDateByAsciiString(ruleParts[1].split('=')[1]), 'value of until-date editor is correct');
        });
    });

    test('Recurrence editor should correctly process values from until-date editor', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY;UNTIL=20151007' });

        const $repeatUntilDate = this.repeatEndEditor.$element().find('.' + REPEAT_DATE_EDITOR);
        const untilDate = $repeatUntilDate.dxDateBox('instance');

        [new Date(2015, 11, 7), new Date(2020, 11, 7)].forEach((date) => {
            untilDate.option('value', date);

            date = dateUtils.trimTime(date);
            date.setDate(date.getDate() + 1);
            date = new Date(date.getTime() - 1);

            assert.equal(this.instance.option('value'), `FREQ=WEEKLY;UNTIL=${getRecurrenceProcessor().getAsciiStringByDate(date)}`, 'Recurrence editor has right value');
        });
    });
});

const intervalModuleConfig = {
    beforeEach() {
        this.createInstance = function(options) {
            this.instance = new RecurrenceEditor($('#recurrence-editor'), options);
            this.intervalEditor = this.instance.getRecurrenceForm().getEditor('interval');
        };
    }
};

module('Interval editor', intervalModuleConfig, () => {
    test('Recurrence interval numberbox should be rendered with right defaults', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY' });

        const $intervalLabel = this.instance.$element().find('.dx-recurrence-numberbox-interval-1-label');
        assert.ok(this.intervalEditor instanceof NumberBox, 'Interval editor is NumberBox');

        assert.equal($intervalLabel.length, 1, 'Label for interval editor was rendered');
        assert.equal(this.intervalEditor.option('showSpinButtons'), true, 'Interval editor has right showSpinButtons');
        assert.equal(this.intervalEditor.option('useLargeSpinButtons'), false, 'Interval editor has right useLargeSpinButtons');
        assert.equal(this.intervalEditor.option('min'), 1, 'Interval editor has right min value');
        assert.equal(this.intervalEditor.option('value'), 1, 'Interval editor hase right value');
        assert.equal(this.intervalEditor.option('width'), 70, 'Interval editor has right width');
    });

    test('Recurrence interval editor should process value correctly', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY;INTERVAL=2' });

        assert.equal(this.intervalEditor.option('value'), 2, 'Interval editor has right value after init');

        this.instance.option('value', 'FREQ=WEEKLY;INTERVAL=3');

        assert.equal(this.intervalEditor.option('value'), 3, 'Interval editor has right value');
    });

    test('Recurrence editor should correctly process values from interval editor', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY;INTERVAL=2' });

        this.intervalEditor.option('value', 3);

        assert.equal(this.instance.option('value'), 'FREQ=WEEKLY;INTERVAL=3', 'Recurrence editor has right value');
    });

    test('Recurrence interval editor should have correct aria-describedby attribute', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY;INTERVAL=2' });

        const $intervalEditor = this.instance.$element().find('.dx-recurrence-numberbox-interval .dx-texteditor-input');
        const $intervalLabel = this.instance.$element().find('.dx-recurrence-numberbox-interval-1-label').first();

        assert.notEqual(this.intervalEditor.$element().find('.dx-texteditor-input').attr('aria-describedby'), undefined, 'aria-describedby exists');
        assert.equal($intervalEditor.attr('aria-describedby'), $intervalLabel.attr('id'), 'aria-describedby is correct');
    });
});

const repeatOnModuleConfig = {
    beforeEach() {
        this.createInstance = function(options) {
            this.instance = new RecurrenceEditor($('#recurrence-editor'), options);
            this.intervalEditor = this.instance.getRecurrenceForm().getEditor('interval');
        };
    }
};

module('Repeat-on editor', repeatOnModuleConfig, () => {
    test('Recurrence repeat-on editor should be rendered', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY' });

        const $repeatOn = this.instance.$element().find('.' + REPEAT_ON_EDITOR);

        assert.equal($repeatOn.length, 1, 'repeat-on editor was rendered');
    });

    test('Recurrence repeat-on editor should contain repeat-on-week editor, when freq = weekly', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY' });

        const $repeatOn = this.instance.$element().find('.' + REPEAT_ON_EDITOR);
        const $repeatOnWeek = $repeatOn.find('.' + RECURRENCE_BUTTON_GROUP);

        assert.equal($repeatOnWeek.length, 1, 'repeat-on-week editor was rendered');
    });

    test('Recurrence repeat-on editor should process values correctly, freq = weekly', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY;BYDAY=TU,SU' });
        assert.deepEqual($('.' + 'dx-buttongroup').eq(0).dxButtonGroup('instance').option('selectedItemKeys'), ['SU', 'TU'], 'Right button group select item keys');

        this.instance.option('value', 'FREQ=WEEKLY;BYDAY=MO');
        assert.deepEqual($('.' + 'dx-buttongroup').eq(0).dxButtonGroup('instance').option('selectedItemKeys'), ['MO'], 'Right button group select item keys');
    });

    test('Recurrence repeat-on editor should process values by startDate correctly, freq = weekly', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY', startDate: new Date(2015, 1, 1, 1) });

        assert.deepEqual($('.' + 'dx-buttongroup').eq(0).dxButtonGroup('instance').option('selectedItemKeys'), ['SU'], 'Right button group select item keys');
    });

    test('Recurrence editor should process values from repeat-on-editor after init correctly, freq=weekly', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY;BYDAY=TU' });

        const buttonGroup = $('.' + 'dx-buttongroup').eq(0).dxButtonGroup('instance');
        buttonGroup.option('selectedItemKeys', ['TU', 'WE']);

        assert.equal(this.instance.option('value'), 'FREQ=WEEKLY;BYDAY=TU,WE');
    });

    test('\'BYDAY\' rule has a higher priority than \'startDate\' rule, freq=weekly', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY;BYDAY=TU', startDate: new Date(2015, 1, 1, 1) });

        assert.deepEqual($('.' + 'dx-buttongroup').eq(0).dxButtonGroup('instance').option('selectedItemKeys'), ['TU'], 'Right button group select item keys');
    });

    test('Recurrence editor should process values from repeat-on-editor correctly, freq=weekly', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY;BYDAY=TU,SU' });

        const buttonGroup = $('.' + 'dx-buttongroup').eq(0).dxButtonGroup('instance');
        buttonGroup.option('selectedItemKeys', ['TU', 'SU', 'MO']);

        assert.equal(this.instance.option('value'), 'FREQ=WEEKLY;BYDAY=SU,MO,TU');
    });

    test('Recurrence repeat-on editor should contain repeat-on-month editor, when freq = monthly', function(assert) {
        this.createInstance({ value: 'FREQ=MONTHLY', startDate: new Date(2019, 1, 1) });
        const dayOfMonth = this.instance.getRecurrenceForm().getEditor('bymonthday');

        assert.equal(dayOfMonth.option('min'), 1, 'correct default value of day-of-month editor');
        assert.equal(dayOfMonth.option('max'), 31, 'correct default value of day-of-month editor');
        assert.equal(dayOfMonth.option('showSpinButtons'), true, 'correct default value of day-of-month editor');
        assert.equal(dayOfMonth.option('useLargeSpinButtons'), false, 'numberBox have right useLargeSpinButtons');
    });

    test('Recurrence repeat-on editor should should process values correctly, when freq = monthly', function(assert) {
        this.createInstance({ value: 'FREQ=MONTHLY;BYMONTHDAY=5' });

        const dayOfMonth = this.instance.getRecurrenceForm().getEditor('bymonthday');

        assert.equal(dayOfMonth.option('value'), 5, 'repeat-on-month editor was rendered');

        this.instance.option('value', 'FREQ=MONTHLY;BYMONTHDAY=6');

        assert.equal(dayOfMonth.option('value'), 6, 'repeat-on-month editor was rendered');
    });

    test('Recurrence repeat-on editor should should process values by startDate correctly, when freq = monthly', function(assert) {
        this.createInstance({ value: 'FREQ=MONTHLY', startDate: new Date(2015, 1, 10, 1) });

        const dayOfMonth = this.instance.getRecurrenceForm().getEditor('bymonthday');

        assert.equal(dayOfMonth.option('value'), 10, 'repeat-on-month editor was rendered with right value');
    });

    test('Recurrence editor should process values from repeat-on-editor correctly, freq=monthly', function(assert) {
        this.createInstance({ value: 'FREQ=MONTHLY;BYMONTHDAY=5' });

        const dayOfMonth = this.instance.getRecurrenceForm().getEditor('bymonthday');
        dayOfMonth.option('value', 12);

        assert.equal(this.instance.option('value'), 'FREQ=MONTHLY;BYMONTHDAY=12');
    });

    test('\'BYMONTHDAY\' rule has a higher priority than \'startDate\' rule, when freq = monthly', function(assert) {
        this.createInstance({ value: 'FREQ=MONTHLY;BYMONTHDAY=5', startDate: new Date(2015, 1, 10, 1) });

        const dayOfMonth = this.instance.getRecurrenceForm().getEditor('bymonthday');

        assert.equal(dayOfMonth.option('value'), 5, 'repeat-on-month editor was rendered with right value');
    });

    test('Recurrence repeat-on editor should contain repeat-on-year editor parts, when freq = yearly', function(assert) {
        this.createInstance({ value: 'FREQ=YEARLY', startDate: new Date(2019, 1, 1) });

        const $repeatOn = this.instance.$element().find('.' + REPEAT_ON_EDITOR);
        const $repeatOnMonth = $repeatOn.find('.' + MONTH_OF_YEAR);

        assert.equal($repeatOnMonth.length, 1, 'repeat-on-month editor was rendered');
        const $day = $repeatOn.find('.' + DAY_OF_MONTH);
        assert.equal($day.length, 1, 'day-of-month editor was rendered');
    });

    test('Recurrence repeat-on editor parts should have right defaults, when freq = yearly', function(assert) {
        this.createInstance({ value: 'FREQ=YEARLY', startDate: new Date(2019, 1, 1) });

        const monthOfYear = this.instance.getRecurrenceForm().getEditor('bymonth');

        assert.equal(monthOfYear.option('items').length, 12, 'items are correct');
        assert.equal(monthOfYear.option('value'), 2, 'value is correct');
    });

    test('Recurrence repeat-on editor should should process values correctly, when freq = yearly', function(assert) {
        this.createInstance({ value: 'FREQ=YEARLY;BYMONTH=10;BYMONTHDAY=5' });

        const getDayOfMonth = () => this.instance.getRecurrenceForm().getEditor('bymonthday').option('value');
        const getMonth = () => this.instance.getRecurrenceForm().getEditor('bymonth').option('value');

        assert.equal(getDayOfMonth(), 5, 'day was set correctly');
        assert.equal(getMonth(), 10, 'month was set correctly');

        this.instance.option('value', 'FREQ=YEARLY;BYMONTH=11;BYMONTHDAY=6');

        assert.equal(getDayOfMonth(), 6, 'day was set correctly');
        assert.equal(getMonth(), 11, 'month was set correctly');
    });

    test('Recurrence repeat-on editor should process values by startDate correctly, when freq = yearly', function(assert) {
        this.createInstance({ value: 'FREQ=YEARLY', startDate: new Date(2015, 2, 10, 1) });

        const dayEditor = this.instance.getRecurrenceForm().getEditor('bymonthday');
        const monthEditor = this.instance.getRecurrenceForm().getEditor('bymonth');

        assert.equal(dayEditor.option('value'), 10, 'day was set correctly');
        assert.equal(monthEditor.option('value'), 3, 'month was set correctly');
    });

    test('Recurrence editor should process values from repeat-on-editor correctly, freq = yearly', function(assert) {
        this.createInstance({ value: 'FREQ=YEARLY;BYMONTHDAY=4;BYMONTH=11', startDate: new Date(2015, 7, 4) });

        const monthEditor = this.instance.getRecurrenceForm().getEditor('bymonth');

        monthEditor.option('value', '10');

        assert.equal(this.instance.option('value'), 'FREQ=YEARLY;BYMONTHDAY=4;BYMONTH=10', 'recurrence editor value is correct');

        const dayOfMonth = this.instance.getRecurrenceForm().getEditor('bymonthday');
        dayOfMonth.option('value', 5);

        assert.equal(this.instance.option('value'), 'FREQ=YEARLY;BYMONTHDAY=5;BYMONTH=10', 'recurrence editor value is correct');
    });

    test('\'BYMONTH\' rule should has right default value, when freq = yearly', function(assert) {
        this.createInstance({ value: 'FREQ=YEARLY', startDate: new Date(2016, 4, 10) });

        const monthEditor = this.instance.getRecurrenceForm().getEditor('bymonth');

        assert.equal(monthEditor.option('value'), 5, 'month was set correctly');
    });

    test('\'BYMONTH\' rule has a higher priority than \'startDate\' rule, when freq = yearly', function(assert) {
        this.createInstance({ value: 'FREQ=YEARLY;BYMONTH=10;BYMONTHDAY=5', startDate: new Date(2015, 2, 10, 1) });

        const monthEditor = this.instance.getRecurrenceForm().getEditor('bymonth');
        const dayEditor = this.instance.getRecurrenceForm().getEditor('bymonthday');

        assert.equal(dayEditor.option('value'), 5, 'day was set correctly');
        assert.equal(monthEditor.option('value'), 10, 'month was set correctly');
    });

    // NOTE: matrix testing
    test('Recurrence repeat-on editor should be visible after changing freq if needed', function(assert) {
        this.createInstance({ value: 'FREQ=DAILY', startDate: new Date(2019, 1, 1) });
        const recurrenceForm = this.instance.getRecurrenceForm();

        assert.notOk(recurrenceForm.itemOption('byday').visible, 'byday editor is hidden');
        assert.notOk(recurrenceForm.itemOption('bymonthday').visible, 'byday editor is hidden');
        assert.notOk(recurrenceForm.itemOption('bymonth').visible, 'byday editor is hidden');

        this.instance.option('value', 'FREQ=WEEKLY');

        assert.ok(recurrenceForm.itemOption('byday').visible, 'byday editor is hidden');
        assert.notOk(recurrenceForm.itemOption('bymonthday').visible, 'byday editor is hidden');
        assert.notOk(recurrenceForm.itemOption('bymonth').visible, 'byday editor is hidden');

        this.instance.option('value', 'FREQ=MONTHLY');

        assert.notOk(recurrenceForm.itemOption('byday').visible, 'byday editor is hidden');
        assert.ok(recurrenceForm.itemOption('bymonthday').visible, 'byday editor is hidden');
        assert.notOk(recurrenceForm.itemOption('bymonth').visible, 'byday editor is hidden');

        this.instance.option('value', 'FREQ=YEARLY');

        assert.notOk(recurrenceForm.itemOption('byday').visible, 'byday editor is hidden');
        assert.ok(recurrenceForm.itemOption('bymonthday').visible, 'byday editor is hidden');
        assert.ok(recurrenceForm.itemOption('bymonth').visible, 'byday editor is hidden');
    });

    test('Recurrence editor should process values from repeat-on-editor correctly after freq changing', function(assert) {
        this.createInstance({ value: 'FREQ=YEARLY', startDate: new Date(2015, 2, 10) });

        const monthEditor = this.instance.getRecurrenceForm().getEditor('bymonth');
        const freqEditor = this.instance.getRecurrenceForm().getEditor('freq');

        monthEditor.option('value', '10');
        freqEditor.option('value', 'daily');

        assert.equal(this.instance.option('value'), 'FREQ=DAILY', 'recurrence editor value is correct');

        freqEditor.option('value', 'monthly');

        const dayEditor = this.instance.getRecurrenceForm().getEditor('bymonthday');

        dayEditor.option('value', 5);
        freqEditor.option('value', 'yearly');

        assert.equal(this.instance.option('value'), 'FREQ=YEARLY;BYMONTHDAY=5;BYMONTH=3', 'recurrence editor value is correct');
    });
});

module('FirstDayOfWeek setting', moduleConfig, () => {
    test('Recurrence editor should have correct firstDayOfWeek default value', function(assert) {
        this.createInstance();

        assert.strictEqual(this.instance.option('firstDayOfWeek'), undefined, 'default value is correct');
    });

    test('Recurrence editor should have correct firstDayOfWeek value if this is different in localization', function(assert) {
        const spy = sinon.spy(dateLocalization, 'firstDayOfWeekIndex');

        this.createInstance({ firstDayOfWeek: 0 });

        assert.notOk(spy.called, 'firstDayOfWeekIndex wasn\'t called');
    });

    test('Repeat-until dateBox should have right firstDayOfWeek', function(assert) {
        this.createInstance({ firstDayOfWeek: 5, value: 'FREQ=WEEKLY;UNTIL=20151007' });

        const $untilDate = this.instance.$element().find('.' + REPEAT_DATE_EDITOR);
        const untilDate = $untilDate.dxDateBox('instance');

        assert.equal(untilDate.option('calendarOptions.firstDayOfWeek'), 5, 'First day of the week is ok');
    });

    test('Repeat-until dateBox should have right firstDayOfWeek after firstDayOfWeek option changing', function(assert) {
        this.createInstance({ firstDayOfWeek: 5, value: 'FREQ=WEEKLY;UNTIL=20151007' });
        this.instance.option('firstDayOfWeek', 1);

        const $untilDate = this.instance.$element().find('.' + REPEAT_DATE_EDITOR);
        const untilDate = $untilDate.dxDateBox('instance');

        assert.equal(untilDate.option('calendarOptions.firstDayOfWeek'), 1, 'First day of the week is ok');
    });

    const dayNames = [{ key: 'SU', text: 'Sun' }, { key: 'MO', text: 'Mon' }, { key: 'TU', text: 'Tue' }, { key: 'WE', text: 'Wed' }, { key: 'TH', text: 'Thu' }, { key: 'FR', text: 'Fri' }, { key: 'SA', text: 'Sat' }];

    test('Repeat-on-week editor should be rendered correctly', function(assert) {
        this.createInstance({ firstDayOfWeek: 3, value: 'FREQ=WEEKLY;BYDAY=TU' });

        const buttonGroup = $('.' + 'dx-buttongroup').eq(0).dxButtonGroup('instance');
        assert.deepEqual(buttonGroup.option('items'), dayNames.slice(3).concat(dayNames.slice(0, 3)));
    });

    test('Repeat-on-week editor should be rendered correctly after firstDayOfWeek option changing', function(assert) {
        this.createInstance({ firstDayOfWeek: 3, value: 'FREQ=WEEKLY;BYDAY=TU' });
        this.instance.option('firstDayOfWeek', 5);

        const buttonGroup = $('.' + 'dx-buttongroup').eq(0).dxButtonGroup('instance');
        assert.deepEqual(buttonGroup.option('items'), dayNames.slice(5).concat(dayNames.slice(0, 5)));
    });

    test('Repeat-count editor should have correct value after re-initializing values', function(assert) {
        this.createInstance({ value: 'FREQ=WEEKLY;BYDAY=SU,TU;COUNT=3' });

        this.instance.option('value', '');

        this.instance.option('value', 'FREQ=WEEKLY;BYDAY=SU,TU;COUNT=3');

        const repeatCount = this.instance.$element().find('.' + REPEAT_COUNT_EDITOR).eq(0).dxNumberBox('instance');

        assert.equal(repeatCount.option('value'), 3, 'Value was processed correctly');
    });
});

