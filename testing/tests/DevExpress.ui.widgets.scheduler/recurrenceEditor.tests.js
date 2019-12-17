var $ = require('jquery'),
    dateUtils = require('core/utils/date'),
    RecurrenceEditor = require('ui/scheduler/ui.scheduler.recurrence_editor'),
    recurrenceUtils = require('ui/scheduler/utils.recurrence'),
    dateLocalization = require('localization/date');

var FREQUENCY_EDITOR = 'dx-recurrence-selectbox-freq',
    REPEAT_END_EDITOR_CONTAINER = 'dx-recurrence-repeat-end-container',
    REPEAT_TYPE_EDITOR = 'dx-recurrence-radiogroup-repeat-type',
    REPEAT_COUNT_EDITOR = 'dx-recurrence-numberbox-repeat-count',
    REPEAT_DATE_EDITOR = 'dx-recurrence-datebox-until-date',
    REPEAT_ON_EDITOR = 'dx-recurrence-repeat-on',
    REPEAT_ON_WEEK_EDITOR = 'dx-recurrence-repeat-on-week',
    REPEAT_ON_MONTH_EDITOR = 'dx-recurrence-repeat-on-month',
    DAY_OF_MONTH = 'dx-recurrence-numberbox-day-of-month',
    REPEAT_ON_YEAR_EDITOR = 'dx-recurrence-repeat-on-year',
    MONTH_OF_YEAR = 'dx-recurrence-selectbox-month-of-year',
    EVERY_INTERVAL = 'dx-recurrence-numberbox-interval';

require('common.css!');

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="recurrence-editor"></div>');
});

QUnit.module('Recurrence editor - rendering', {
    beforeEach: function() {
        this.createInstance = function(options) {
            this.instance = new RecurrenceEditor($('#recurrence-editor'), options);
        };
    }
});

QUnit.test('Recurrence editor should be initialized', function(assert) {
    this.createInstance();
    assert.ok(this.instance instanceof RecurrenceEditor, 'dxRecurrenceEditor was initialized');

    assert.ok(this.instance.$element().hasClass('dx-recurrence-editor'));
});

QUnit.test('Recurrence editor should have correct default options', function(assert) {
    this.createInstance();

    assert.equal(this.instance.option('value'), null, 'value is right');
    assert.equal(this.instance.option('visible'), true, 'editor is visible');
});

QUnit.test('Recurrence editor should correctly process null value and reset inner editors to default values', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY' });

    this.instance.option('value', null);
    this.instance.option('visible', true);

    var freqEditor = $('.' + FREQUENCY_EDITOR).dxSelectBox('instance');

    assert.equal(freqEditor.option('value'), 'never', 'freq editor default value was set');
});

QUnit.module('Recurrence editor - freq editor', {
    beforeEach: function() {
        this.createInstance = function(options) {
            this.instance = new RecurrenceEditor($('#recurrence-editor'), options);
        };
    }
});

QUnit.test('Recurrence editor should contain select box for select freq', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY' });

    assert.equal($('.' + FREQUENCY_EDITOR).length, 1, 'select box was rendered');
});

QUnit.test('Recurrence editor should has right items', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY' });

    var freqEditor = $('.' + FREQUENCY_EDITOR).dxSelectBox('instance');

    var items = freqEditor.option('items');
    var itemValues = [{ text: 'Never', value: 'never' }, { text: 'Daily', value: 'daily' }, { text: 'Weekly', value: 'weekly' }, { text: 'Monthly', value: 'monthly' }, { text: 'Yearly', value: 'yearly' }];

    for(var i = 0, len = items.length; i < len; i++) {
        assert.equal(itemValues[i].text, items[i].text(), 'item text is right');
        assert.equal(itemValues[i].value, items[i].value, 'item value is right');
    }
});

QUnit.test('Recurrence editor should correctly process values of the freq selectBox, byday setting', function(assert) {
    this.createInstance({ startDate: new Date(2015, 7, 27) });
    this.instance.option('visible', true);

    var freqEditor = $('.' + FREQUENCY_EDITOR).dxSelectBox('instance');

    assert.equal(this.instance.option('value'), null, 'Recurrence editor has right value');

    freqEditor.option('value', 'weekly');
    assert.equal(this.instance.option('value'), 'FREQ=WEEKLY;BYDAY=TH', 'Recurrence editor has right value');
});

QUnit.test('Recurrence editor should correctly process values of the freq radioGroup, bymonthday setting', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY', startDate: new Date(2015, 2, 10) });

    var freqEditor = $('.' + FREQUENCY_EDITOR).dxSelectBox('instance');
    freqEditor.option('value', 'monthly');

    assert.equal(this.instance.option('value'), 'FREQ=MONTHLY;BYMONTHDAY=10', 'Recurrence editor has right value');
});

QUnit.test('Recurrence editor should correctly process values of the freq radioGroup, bymonthday and bymonth setting', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY', startDate: new Date(2015, 2, 10) });

    var freqEditor = $('.' + FREQUENCY_EDITOR).dxSelectBox('instance');
    freqEditor.option('value', 'yearly');

    assert.equal(this.instance.option('value'), 'FREQ=YEARLY;BYMONTHDAY=10;BYMONTH=3', 'Recurrence editor has right value');
});

QUnit.test('Recurrence editor onValueChanged should be fired after change value', function(assert) {
    var fired = 0;
    this.createInstance({
        value: 'FREQ=MONTHLY',
        onValueChanged: function() {
            fired++;
        }
    });

    var freqEditor = $('.' + FREQUENCY_EDITOR).dxSelectBox('instance');

    freqEditor.option('value', 'weekly');

    assert.equal(fired, 1, 'Recurrence editor onValueChanged is fired');
});

QUnit.test('\'resizePopup\' observer should be fired after changing freq', function(assert) {
    this.createInstance({
        value: 'FREQ=MONTHLY'
    });

    var stub = sinon.stub(this.instance, 'invoke').withArgs('resizePopup');

    var freqEditor = $('.' + FREQUENCY_EDITOR).dxSelectBox('instance');

    freqEditor.option('value', 'weekly');

    assert.ok(stub.calledOnce, 'Observer is notified');
});

QUnit.test('Recurrence editor should correctly process values to the freq radioGroup', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY' });

    var freqEditor = $('.' + FREQUENCY_EDITOR).dxSelectBox('instance');

    assert.equal(freqEditor.option('value'), 'weekly', 'Freq editor has right value');

    this.instance.option('value', 'FREQ=MONTHLY');
    assert.equal(freqEditor.option('value'), 'monthly', 'Freq editor has right value');
});


QUnit.module('Recurrence editor - interval editor', {
    beforeEach: function() {
        this.createInstance = function(options) {
            this.instance = new RecurrenceEditor($('#recurrence-editor'), options);
        };
    }
});

QUnit.test('Recurrence interval numberbox should be rendered with right defaults', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY' });

    var $interval = this.instance.$element().find('.' + EVERY_INTERVAL),
        $intervalLabel = this.instance.$element().find('.dx-recurrence-numberbox-interval-label'),
        interval = $interval.dxNumberBox('instance');

    assert.equal($interval.length, 1, 'numberBox for setting recurrence interval was rendered');
    assert.equal($intervalLabel.length, 1, 'labels was rendered');
    assert.equal(interval.option('showSpinButtons'), true, 'numberBox have right showSpinButtons');
    assert.equal(interval.option('useLargeSpinButtons'), false, 'numberBox have right useLargeSpinButtons');
    assert.equal(interval.option('min'), 1, 'numberBox have right min value');
    assert.equal(interval.option('value'), 1, 'numberBox have right value');
});

QUnit.test('Recurrence interval numberbox should process value correctly', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY;INTERVAL=2' });

    var $interval = this.instance.$element().find('.' + EVERY_INTERVAL);

    assert.equal($interval.dxNumberBox('instance').option('value'), 2, 'numberBox have right value after init');

    this.instance.option('value', 'FREQ=WEEKLY;INTERVAL=3');

    assert.equal($interval.dxNumberBox('instance').option('value'), 3, 'numberBox have right value');
});

QUnit.test('Recurrence editor should correctly process values from interval editor', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY;INTERVAL=2' });

    var $interval = this.instance.$element().find('.' + EVERY_INTERVAL);

    $interval.dxNumberBox('instance').option('value', 3);

    assert.equal(this.instance.option('value'), 'FREQ=WEEKLY;INTERVAL=3', 'Recurrence editor have right value');
});

QUnit.test('Recurrence repeat-interval editor should have correct aria-describedby attribute', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY;INTERVAL=1' });

    var $intervalEditor = this.instance.$element().find('.dx-recurrence-numberbox-interval .dx-texteditor-input'),
        $intervalLabel = this.instance.$element().find('.dx-recurrence-numberbox-interval-label').first();

    assert.notEqual($intervalEditor.attr('aria-describedby'), undefined, 'aria-describedby exists');
    assert.equal($intervalEditor.attr('aria-describedby'), $intervalLabel.attr('id'), 'aria-describedby is correct');
});


QUnit.module('Recurrence editor - repeat-end editor', {
    beforeEach: function() {
        this.createInstance = function(options) {
            this.instance = new RecurrenceEditor($('#recurrence-editor'), options);
        };
    }
});

QUnit.test('Recurrence editor should contain repeat-type radio group to turn on/of repeat-end', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY' });

    var $repeatType = $('.' + REPEAT_TYPE_EDITOR);

    assert.equal($repeatType.length, 1, 'repeat-type was rendered');
});

QUnit.test('Recurrence repeat-type editor should have right default', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY' });

    var $repeatType = $('.' + REPEAT_TYPE_EDITOR),
        repeatTypeEditor = $repeatType.dxRadioGroup('instance');

    assert.equal(repeatTypeEditor.option('value'), 'never', 'repeat-type has right value');
    assert.equal($repeatType.css('display'), 'block', 'repeat editor is not visible');
});

QUnit.test('Recurrence repeat-type editor should be rendered with right inner editor', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY;COUNT=10' });

    var $repeat = this.instance.$element().find('.' + REPEAT_END_EDITOR_CONTAINER),
        $repeatType = $repeat.find('.' + REPEAT_TYPE_EDITOR),
        $repeatCount = $repeat.find('.' + REPEAT_COUNT_EDITOR),
        $repeatUntilDate = $repeat.find('.' + REPEAT_DATE_EDITOR);

    assert.equal($repeatType.length, 1, 'repeatType editor was rendered');

    assert.equal($repeatCount.length, 1, 'repeatCount editor was rendered');
    assert.equal($repeatCount.parent().hasClass('dx-recurrence-repeat-end-wrapper'), 1, 'repeatCount editor is wrapped correctly');

    assert.equal($repeatUntilDate.length, 1, 'repeatUntilDate editor was rendered');
    assert.equal($repeatUntilDate.parent().hasClass('dx-recurrence-repeat-end-wrapper'), 1, 'repeatUntil editor is wrapped correctly');
});

QUnit.test('Recurrence editor parts should be disabled if needed', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY' });

    var $repeatType = $('.' + REPEAT_TYPE_EDITOR),
        repeatTypeEditor = $repeatType.dxRadioGroup('instance');

    repeatTypeEditor.option('value', 'count');

    var $repeatCount = this.instance.$element().find('.' + REPEAT_COUNT_EDITOR),
        $repeatUntilDate = this.instance.$element().find('.' + REPEAT_DATE_EDITOR);

    assert.ok(!$repeatCount.hasClass('dx-state-disabled'), 'repeat-count editor is not disabled by default');
    assert.ok($repeatUntilDate.hasClass('dx-state-disabled'), 'repeat-until editor is disabled');

    this.instance.option('value', 'FREQ=WEEKLY;UNTIL=20151107');

    assert.ok($repeatCount.hasClass('dx-state-disabled'), 'repeat-count editor is disabled');
    assert.ok(!$repeatUntilDate.hasClass('dx-state-disabled'), 'repeat-until editor is not disabled');
});

QUnit.test('Recurrence radioGroup for select type of repeat should process rules correctly', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY;COUNT=10' });

    var $complete = this.instance.$element().find('.' + REPEAT_TYPE_EDITOR),
        complete = $complete.dxRadioGroup('instance');

    assert.equal(complete.option('value'), 'count', 'value is correct');

    this.instance.option('value', 'FREQ=WEEKLY;UNTIL=19971224T000000Z');

    assert.equal(complete.option('value'), 'until', 'value is correct');
});

QUnit.test('Recurrence editor parts should be rendered after repeat-type editor optionChanged', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY;COUNT=10' });

    var $repeatType = this.instance.$element().find('.' + REPEAT_TYPE_EDITOR),
        repeatType = $repeatType.dxRadioGroup('instance');

    assert.equal(repeatType.option('value'), 'count', 'repeat-type is correct after init');

    repeatType.option('value', 'until');

    var $repeatUntilDate = this.instance.$element().find('.' + REPEAT_DATE_EDITOR),
        $repeatCount = this.instance.$element().find('.' + REPEAT_COUNT_EDITOR);

    assert.ok($repeatCount.hasClass('dx-state-disabled'), 'repeat-count editor is disabled');
    assert.ok(!$repeatUntilDate.hasClass('dx-state-disabled'), 'repeat-until editor is not disabled after optionChanged');

    repeatType.option('value', 'count');

    assert.ok(!$repeatCount.hasClass('dx-state-disabled'), 'repeat-count editor is disabled');
    assert.ok($repeatUntilDate.hasClass('dx-state-disabled'), 'repeat-until editor is not disabled');
});

QUnit.test('Recurrence editor should correctly process values from repeat-type editor', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY;COUNT=10' });

    var $complete = this.instance.$element().find('.' + REPEAT_TYPE_EDITOR);
    var date = dateUtils.trimTime(new Date());

    date.setDate(date.getDate() + 1);
    date = new Date(date.getTime() - 1);

    $complete.dxRadioGroup('instance').option('value', 'until');
    assert.equal(this.instance.option('value').substring(0, 26), ('FREQ=WEEKLY;UNTIL=' + recurrenceUtils.getAsciiStringByDate(date)).substring(0, 26), 'Recurrence editor have right value');
});

QUnit.test('Recurrence repeat-count editor should be rendered with right defaults', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY' });

    var $repeatCount = this.instance.$element().find('.' + REPEAT_COUNT_EDITOR),
        repeatCount = $repeatCount.dxNumberBox('instance');

    assert.equal(repeatCount.option('showSpinButtons'), true, 'numberBox has right min value');
    assert.equal(repeatCount.option('useLargeSpinButtons'), false, 'numberBox have right useLargeSpinButtons');
    assert.equal(repeatCount.option('min'), 1, 'numberBox has right min value');
    assert.equal(repeatCount.option('value'), 1, 'numberBox has right value');
});

QUnit.test('Recurrence repeat-count editor should process rules correctly', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY;COUNT=10' });

    var $repeatCount = this.instance.$element().find('.' + REPEAT_COUNT_EDITOR),
        repeatCount = $repeatCount.dxNumberBox('instance');

    assert.equal(repeatCount.option('value'), 10, 'value of repeat-count editor is correct on init');

    this.instance.option('value', 'FREQ=WEEKLY;COUNT=12');

    assert.equal(repeatCount.option('value'), 12, 'value of repeat-count editor is correct');
});

QUnit.test('Recurrence editor should correctly process values from repeat-count editor', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY;COUNT=1' });

    var $repeatCount = this.instance.$element().find('.' + REPEAT_COUNT_EDITOR),
        repeatCount = $repeatCount.dxNumberBox('instance');

    repeatCount.option('value', 9);

    assert.equal(this.instance.option('value'), 'FREQ=WEEKLY;COUNT=9', 'Recurrence editor has right value');
});

QUnit.test('Recurrence until-date editor should not process rules if it was set in recurrence string(T726894)', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY;UNTIL=20151007' });

    var $untilDate = this.instance.$element().find('.' + REPEAT_DATE_EDITOR),
        untilDate = $untilDate.dxDateBox('instance');

    assert.deepEqual(untilDate.option('value'), recurrenceUtils.getDateByAsciiString('20151007'), 'value of until-date editor is correct on init');

    this.instance.option('value', 'FREQ=WEEKLY;UNTIL=20151107');

    assert.equal(untilDate.option('value').toString(), recurrenceUtils.getDateByAsciiString('20151107'), 'value of until-date editor is correct');
});

QUnit.test('Recurrence editor should correctly process values from until-date editor', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY;UNTIL=20151007' });

    var $untilDate = this.instance.$element().find('.' + REPEAT_DATE_EDITOR),
        untilDate = $untilDate.dxDateBox('instance');

    untilDate.option('value', recurrenceUtils.getDateByAsciiString('20151107'));

    var date = dateUtils.trimTime(new Date(2015, 10, 7));

    date.setDate(date.getDate() + 1);
    date = new Date(date.getTime() - 1);

    var untilString = recurrenceUtils.getAsciiStringByDate(date);

    assert.equal(this.instance.option('value'), 'FREQ=WEEKLY;UNTIL=' + untilString, 'Recurrence editor has right value');
});

QUnit.module('Recurrence editor - repeat-on editor', {
    beforeEach: function() {
        this.createInstance = function(options) {
            this.instance = new RecurrenceEditor($('#recurrence-editor'), options);
        };
    }
});

QUnit.test('Recurrence repeat-on editor should be rendered, when freq != daily', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY' });

    var $repeatOn = this.instance.$element().find('.' + REPEAT_ON_EDITOR);

    assert.equal($repeatOn.length, 1, 'repeat-on editor was rendered');
});

QUnit.test('Recurrence repeat-on editor should contain repeat-on-week editor, when freq = weekly', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY' });

    var $repeatOn = this.instance.$element().find('.' + REPEAT_ON_EDITOR),
        $repeatOnWeek = $repeatOn.find('.' + REPEAT_ON_WEEK_EDITOR);

    assert.equal($repeatOnWeek.length, 1, 'repeat-on-week editor was rendered');

    var $checkboxes = $repeatOnWeek.find('.' + 'dx-checkbox');

    assert.equal($checkboxes.length, 7, 'repeat-on-week editor contains 7 checkboxes');
});

QUnit.test('Recurrence repeat-on editor should process values correctly, freq = weekly', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY;BYDAY=TU,SU' });

    var $checkboxes = $('.' + 'dx-checkbox');

    assert.equal($checkboxes.eq(0).dxCheckBox('instance').option('value'), true, 'right checkBox is checked');
    assert.equal($checkboxes.eq(2).dxCheckBox('instance').option('value'), true, 'right checkBox is checked');

    this.instance.option('value', 'FREQ=WEEKLY;BYDAY=MO');

    assert.equal($checkboxes.eq(1).dxCheckBox('instance').option('value'), true, 'right checkBox is checked');
});

QUnit.test('Recurrence repeat-on editor should process values by startDate correctly, freq = weekly', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY', startDate: new Date(2015, 1, 1, 1) });

    var $checkboxes = $('.' + 'dx-checkbox');

    assert.equal($checkboxes.eq(0).dxCheckBox('instance').option('value'), true, 'right checkBox is checked');
});

QUnit.test('Recurrence editor should process values from repeat-on-editor after init correctly, freq=weekly', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY;BYDAY=TU' });

    var $repeatOn = this.instance.$element().find('.' + REPEAT_ON_EDITOR),
        $repeatOnWeek = $repeatOn.find('.' + REPEAT_ON_WEEK_EDITOR);

    var checkbox = $repeatOnWeek.find('.' + 'dx-checkbox').eq(3).dxCheckBox('instance');

    checkbox.option('value', true);

    assert.equal(this.instance.option('value'), 'FREQ=WEEKLY;BYDAY=TU,WE');

    checkbox.option('value', false);

    assert.equal(this.instance.option('value'), 'FREQ=WEEKLY;BYDAY=TU');
});

QUnit.test('Recurrence editor should be able to uncheck default day from byday rule, freq=weekly', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY;BYDAY=TU', startDate: new Date(2018, 6, 24, 1) });
    var $repeatOn = this.instance.$element().find('.' + REPEAT_ON_EDITOR),
        $repeatOnWeek = $repeatOn.find('.' + REPEAT_ON_WEEK_EDITOR);

    var $checkbox = $repeatOnWeek.find('.' + 'dx-checkbox').eq(2);

    assert.ok($checkbox.dxCheckBox('instance').option('value'));

    $($checkbox).trigger('dxclick');

    assert.notOk($checkbox.dxCheckBox('instance').option('value'));
});

QUnit.test('\'BYDAY\' rule has a higher priority than \'startDate\' rule, freq=weekly', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY;BYDAY=TU', startDate: new Date(2015, 1, 1, 1) });

    var $checkboxes = $('.' + 'dx-checkbox');

    assert.equal($checkboxes.eq(0).dxCheckBox('instance').option('value'), false, 'checkBox is not checked');
    assert.equal($checkboxes.eq(2).dxCheckBox('instance').option('value'), true, 'right checkBox is checked');
});

QUnit.test('Recurrence editor should process values from repeat-on-editor correctly, freq=weekly', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY;BYDAY=TU,SU' });

    var $repeatOn = this.instance.$element().find('.' + REPEAT_ON_EDITOR),
        $repeatOnWeek = $repeatOn.find('.' + REPEAT_ON_WEEK_EDITOR);

    var $checkboxes = $repeatOnWeek.find('.' + 'dx-checkbox');

    $checkboxes.eq(1).dxCheckBox('instance').option('value', true);

    assert.equal(this.instance.option('value'), 'FREQ=WEEKLY;BYDAY=SU,MO,TU');
});

QUnit.test('Recurrence repeat-on editor should contain repeat-on-month editor, when freq = monthly', function(assert) {
    this.createInstance({ value: 'FREQ=MONTHLY' });

    var $repeatOn = this.instance.$element().find('.' + REPEAT_ON_EDITOR),
        $repeatOnMonth = $repeatOn.find('.' + REPEAT_ON_MONTH_EDITOR);

    assert.equal($repeatOnMonth.length, 1, 'repeat-on-month editor was rendered');

    var $day = $repeatOnMonth.find('.' + DAY_OF_MONTH),
        dayEditor = $day.dxNumberBox('instance');

    assert.equal($day.length, 1, 'day-of-month editor was rendered');
    assert.equal(dayEditor.option('min'), 1, 'correct default value of day-of-month editor');
    assert.equal(dayEditor.option('max'), 31, 'correct default value of day-of-month editor');
    assert.equal(dayEditor.option('showSpinButtons'), true, 'correct default value of day-of-month editor');
    assert.equal(dayEditor.option('useLargeSpinButtons'), false, 'numberBox have right useLargeSpinButtons');
});

QUnit.test('Recurrence repeat-on editor should should process values correctly, when freq = monthly', function(assert) {
    this.createInstance({ value: 'FREQ=MONTHLY;BYMONTHDAY=5' });

    var $dayOfMonth = this.instance.$element().find('.' + DAY_OF_MONTH),
        dayOfMonth = $dayOfMonth.dxNumberBox('instance');

    assert.equal(dayOfMonth.option('value'), 5, 'repeat-on-month editor was rendered');

    this.instance.option('value', 'FREQ=MONTHLY;BYMONTHDAY=6');

    $dayOfMonth = this.instance.$element().find('.' + DAY_OF_MONTH);
    dayOfMonth = $dayOfMonth.dxNumberBox('instance');

    assert.equal(dayOfMonth.option('value'), 6, 'repeat-on-month editor was rendered');
});

QUnit.test('Recurrence repeat-on editor should should process values by startDate correctly, when freq = monthly', function(assert) {
    this.createInstance({ value: 'FREQ=MONTHLY', startDate: new Date(2015, 1, 10, 1) });

    var $dayOfMonth = this.instance.$element().find('.' + DAY_OF_MONTH),
        dayOfMonth = $dayOfMonth.dxNumberBox('instance');

    assert.equal(dayOfMonth.option('value'), 10, 'repeat-on-month editor was rendered with right value');
});

QUnit.test('Recurrence editor should process values from repeat-on-editor correctly, freq=monthly', function(assert) {
    this.createInstance({ value: 'FREQ=MONTHLY;BYMONTHDAY=5' });

    var $dayOfMonth = this.instance.$element().find('.' + DAY_OF_MONTH),
        dayOfMonth = $dayOfMonth.dxNumberBox('instance');

    dayOfMonth.option('value', 12);

    assert.equal(this.instance.option('value'), 'FREQ=MONTHLY;BYMONTHDAY=12');
});

QUnit.test('\'BYMONTHDAY\' rule has a higher priority than \'startDate\' rule, when freq = monthly', function(assert) {
    this.createInstance({ value: 'FREQ=MONTHLY;BYMONTHDAY=5', startDate: new Date(2015, 1, 10, 1) });

    var $dayOfMonth = this.instance.$element().find('.' + DAY_OF_MONTH),
        dayOfMonth = $dayOfMonth.dxNumberBox('instance');

    assert.equal(dayOfMonth.option('value'), 5, 'repeat-on-month editor was rendered with right value');
});

QUnit.test('Recurrence repeat-on editor should contain repeat-on-year editor, when freq = yearly', function(assert) {
    this.createInstance({ value: 'FREQ=YEARLY' });

    var $repeatOn = this.instance.$element().find('.' + REPEAT_ON_EDITOR),
        $repeatOnYear = $repeatOn.find('.' + REPEAT_ON_YEAR_EDITOR);

    assert.equal($repeatOnYear.length, 1, 'repeat-on-year editor was rendered');

    var $month = $repeatOnYear.find('.' + MONTH_OF_YEAR),
        monthEditor = $month.dxSelectBox('instance');

    assert.equal($month.length, 1, 'month-of-year editor was rendered');
    assert.equal(monthEditor.option('items').length, 12, 'correct default value of month-of-year editor');

    var $day = $repeatOnYear.find('.' + DAY_OF_MONTH);

    assert.equal($day.length, 1, 'day-of-month editor was rendered');
});

QUnit.test('Recurrence repeat-on editor should should process values correctly, when freq = yearly', function(assert) {
    this.createInstance({ value: 'FREQ=YEARLY;BYMONTH=10;BYMONTHDAY=5' });

    var $dayOfMonth = this.instance.$element().find('.' + DAY_OF_MONTH),
        dayEditor = $dayOfMonth.dxNumberBox('instance'),
        $month = this.instance.$element().find('.' + MONTH_OF_YEAR),
        monthEditor = $month.dxSelectBox('instance');

    assert.equal(dayEditor.option('value'), 5, 'day was set correctly');
    assert.equal(monthEditor.option('value'), 10, 'month was set correctly');

    this.instance.option('value', 'FREQ=YEARLY;BYMONTH=11;BYMONTHDAY=6');

    assert.equal(dayEditor.option('value'), 6, 'day was set correctly');
    assert.equal(monthEditor.option('value'), 11, 'month was set correctly');
});

QUnit.test('Recurrence repeat-on editor should process values by startDate correctly, when freq = yearly', function(assert) {
    this.createInstance({ value: 'FREQ=YEARLY', startDate: new Date(2015, 2, 10, 1) });

    var $dayOfMonth = this.instance.$element().find('.' + DAY_OF_MONTH),
        dayEditor = $dayOfMonth.dxNumberBox('instance'),
        $month = this.instance.$element().find('.' + MONTH_OF_YEAR),
        monthEditor = $month.dxSelectBox('instance');

    assert.equal(dayEditor.option('value'), 10, 'day was set correctly');
    assert.equal(monthEditor.option('value'), 3, 'month was set correctly');
});

QUnit.test('Recurrence editor should process values from repeat-on-editor correctly, freq = yearly', function(assert) {
    this.createInstance({ value: 'FREQ=YEARLY', startDate: new Date(2015, 7, 4) });

    var $month = this.instance.$element().find('.' + MONTH_OF_YEAR),
        monthEditor = $month.dxSelectBox('instance');

    monthEditor.option('value', '10');

    assert.equal(this.instance.option('value'), 'FREQ=YEARLY;BYMONTH=10', 'recurrence editor value is correct');

    var $dayOfMonth = this.instance.$element().find('.' + DAY_OF_MONTH),
        dayEditor = $dayOfMonth.dxNumberBox('instance');

    dayEditor.option('value', 5);
    assert.equal(this.instance.option('value'), 'FREQ=YEARLY;BYMONTH=10;BYMONTHDAY=5', 'recurrence editor value is correct');
});

QUnit.test('\'BYMONTH\' rule should has right default value, when freq = yearly', function(assert) {
    this.createInstance({ value: 'FREQ=YEARLY', startDate: new Date(2016, 4, 10) });

    var $month = this.instance.$element().find('.' + MONTH_OF_YEAR),
        monthEditor = $month.dxSelectBox('instance');

    assert.equal(monthEditor.option('value'), 5, 'month was set correctly');
});

QUnit.test('\'BYMONTH\' rule has a higher priority than \'startDate\' rule, when freq = yearly', function(assert) {
    this.createInstance({ value: 'FREQ=YEARLY;BYMONTH=10;BYMONTHDAY=5', startDate: new Date(2015, 2, 10, 1) });

    var $dayOfMonth = this.instance.$element().find('.' + DAY_OF_MONTH),
        dayEditor = $dayOfMonth.dxNumberBox('instance'),
        $month = this.instance.$element().find('.' + MONTH_OF_YEAR),
        monthEditor = $month.dxSelectBox('instance');

    assert.equal(dayEditor.option('value'), 5, 'day was set correctly');
    assert.equal(monthEditor.option('value'), 10, 'month was set correctly');
});

QUnit.test('Recurrence repeat-on editor should be rendered after changing freq if needed', function(assert) {
    this.createInstance({ value: 'FREQ=DAILY' });

    assert.equal(this.instance.$element().find('.' + REPEAT_ON_EDITOR).length, 1, 'repeat-on editor was rendered');
    assert.equal(this.instance.$element().find('.' + REPEAT_ON_EDITOR).children().length, 0, 'but it is empty');

    this.instance.option('value', 'FREQ=WEEKLY');

    assert.equal(this.instance.$element().find('.' + REPEAT_ON_EDITOR).length, 1, 'repeat-on editor was rendered');
    assert.notEqual(this.instance.$element().find('.' + REPEAT_ON_EDITOR).children().length, 0, 'but it is not empty');
});

QUnit.test('Recurrence editor should process values from repeat-on-editor correctly after freq changing', function(assert) {
    this.createInstance({ value: 'FREQ=YEARLY', startDate: new Date(2015, 2, 10) });

    var $month = this.instance.$element().find('.' + MONTH_OF_YEAR),
        monthEditor = $month.dxSelectBox('instance'),
        freqEditor = $('.' + FREQUENCY_EDITOR).dxSelectBox('instance');

    monthEditor.option('value', '10');
    freqEditor.option('value', 'daily');

    assert.equal(this.instance.option('value'), 'FREQ=DAILY', 'recurrence editor value is correct');

    freqEditor.option('value', 'monthly');

    var $dayOfMonth = this.instance.$element().find('.' + DAY_OF_MONTH),
        dayEditor = $dayOfMonth.dxNumberBox('instance');

    dayEditor.option('value', 5);
    freqEditor.option('value', 'yearly');

    assert.equal(this.instance.option('value'), 'FREQ=YEARLY;BYMONTHDAY=5;BYMONTH=3', 'recurrence editor value is correct');
});

QUnit.test('It should not be possible to set incorrect day of month', function(assert) {
    this.createInstance({ value: 'FREQ=YEARLY' });
    var monthEditor = this.instance.$element().find('.' + MONTH_OF_YEAR).dxSelectBox('instance'),
        dayInMonthEditor = this.instance.$element().find('.' + DAY_OF_MONTH).dxNumberBox('instance');

    monthEditor.option('value', '4');

    assert.equal(dayInMonthEditor.option('max'), 30, 'Max allowed day is correct');

    monthEditor.option('value', '2');
    assert.equal(dayInMonthEditor.option('max'), 29, 'Max allowed day is correct');
});

QUnit.test('Parts of recurrence editor should have right readonly option', function(assert) {
    this.createInstance({
        value: 'FREQ=DAILY',
        readOnly: true
    });

    var $interval = this.instance.$element().find('.' + EVERY_INTERVAL),
        intervalInstance = $interval.dxNumberBox('instance');

    assert.equal(intervalInstance.option('readOnly'), this.instance.option('readOnly'), 'right readonly option');
});

QUnit.module('Recurrence editor - firstDayOfWeek option', {
    beforeEach: function() {
        this.createInstance = function(options) {
            this.instance = new RecurrenceEditor($('#recurrence-editor'), options);
        };
    }
});

QUnit.test('Recurrence editor should have correct firstDayOfWeek default value', function(assert) {
    this.createInstance();

    assert.strictEqual(this.instance.option('firstDayOfWeek'), undefined, 'default value is correct');
});

QUnit.test('Recurrence editor should have correct firstDayOfWeek value if this is different in localization', function(assert) {
    var spy = sinon.spy(dateLocalization, 'firstDayOfWeekIndex');

    this.createInstance({ firstDayOfWeek: 0 });

    assert.notOk(spy.called, 'firstDayOfWeekIndex wasn\'t called');
});

QUnit.test('Repeat-until dateBox should have right firstDayOfWeek', function(assert) {
    this.createInstance({ firstDayOfWeek: 5, value: 'FREQ=WEEKLY;UNTIL=20151007' });

    var $untilDate = this.instance.$element().find('.' + REPEAT_DATE_EDITOR),
        untilDate = $untilDate.dxDateBox('instance');

    assert.equal(untilDate.option('calendarOptions.firstDayOfWeek'), 5, 'First day of the week is ok');
});

QUnit.test('Repeat-until dateBox should have right firstDayOfWeek after firstDayOfWeek option changing', function(assert) {
    this.createInstance({ firstDayOfWeek: 5, value: 'FREQ=WEEKLY;UNTIL=20151007' });
    this.instance.option('firstDayOfWeek', 1);

    var $untilDate = this.instance.$element().find('.' + REPEAT_DATE_EDITOR),
        untilDate = $untilDate.dxDateBox('instance');

    assert.equal(untilDate.option('calendarOptions.firstDayOfWeek'), 1, 'First day of the week is ok');
});

QUnit.test('Repeat-on-week editor should be rendered correctly', function(assert) {
    this.createInstance({ firstDayOfWeek: 3, value: 'FREQ=WEEKLY;BYDAY=TU' });

    var $repeatOn = this.instance.$element().find('.' + REPEAT_ON_EDITOR),
        $repeatOnWeek = $repeatOn.find('.' + REPEAT_ON_WEEK_EDITOR);

    var $checkboxes = $repeatOnWeek.find('.' + 'dx-checkbox');

    assert.equal($checkboxes.eq(0).find('.dx-checkbox-text').text(), 'WE', 'Repeat-on-week editor was rendered correctly');
    assert.equal($checkboxes.eq(6).find('.dx-checkbox-text').text(), 'TU', 'Repeat-on-week editor was rendered correctly');
});

QUnit.test('Repeat-on-week editor should be rendered correctly after firstDayOfWeek option changing', function(assert) {
    this.createInstance({ firstDayOfWeek: 3, value: 'FREQ=WEEKLY;BYDAY=TU' });
    this.instance.option('firstDayOfWeek', 5);

    var $repeatOn = this.instance.$element().find('.' + REPEAT_ON_EDITOR),
        $repeatOnWeek = $repeatOn.find('.' + REPEAT_ON_WEEK_EDITOR);

    var $checkboxes = $repeatOnWeek.find('.' + 'dx-checkbox');

    assert.equal($checkboxes.eq(0).find('.dx-checkbox-text').text(), 'FR', 'Repeat-on-week editor was rendered correctly');
    assert.equal($checkboxes.eq(6).find('.dx-checkbox-text').text(), 'TH', 'Repeat-on-week editor was rendered correctly');
});

QUnit.test('Repeat-on-week editor should process values correctly if firstDayOfWeek was set, freq = weekly', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY;BYDAY=TU', firstDayOfWeek: 6 });

    var $checkboxes = $('.' + 'dx-checkbox');

    assert.equal($checkboxes.eq(3).dxCheckBox('instance').option('value'), true, 'Right checkBox was checked');
});

QUnit.test('Repeat-on-week editor should process values from checkboxes correctly if firstDayOfWeek was set, freq=weekly', function(assert) {
    this.createInstance({ value: 'FREQ=WEEKLY;BYDAY=TU', firstDayOfWeek: 3 });

    var $repeatOn = this.instance.$element().find('.' + REPEAT_ON_EDITOR),
        $repeatOnWeek = $repeatOn.find('.' + REPEAT_ON_WEEK_EDITOR);

    var checkbox = $repeatOnWeek.find('.' + 'dx-checkbox').eq(3).dxCheckBox('instance');

    checkbox.option('value', true);

    assert.equal(this.instance.option('value'), 'FREQ=WEEKLY;BYDAY=TU,SA', 'Value was processed correctly');
});
