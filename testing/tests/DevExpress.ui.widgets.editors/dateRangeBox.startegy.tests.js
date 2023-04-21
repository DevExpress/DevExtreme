import $ from 'jquery';
import fx from 'animation/fx';
import dataUtils from 'core/element_data';

import 'ui/date_range_box';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup =
        '<div id="dateRangeBox"></div>';

    $('#qunit-fixture').html(markup);
});

const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const STATE_FOCUSED_CLASS = 'dx-state-focused';

const CALENDAR_DATE_VALUE_KEY = 'dxDateValueKey';

const getStartDateBoxInstance = dateRangeBoxInstance => dateRangeBoxInstance.getStartDateBox();

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;
        const init = (options) => {
            this.$element = $('#dateRangeBox').dxDateRangeBox(options);
            this.instance = this.$element.dxDateRangeBox('instance');

            this.startDateBox = this.instance.getStartDateBox();
            this.endDateBox = this.instance.getEndDateBox();
            this.getCalendar = () => this.instance.getStartDateBox()._strategy._widget;
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init({
            value: ['2023/01/05', '2023/02/14']
        });
    },
    afterEach: function() {
        fx.off = false;
    }
};

QUnit.module('Strategy', moduleConfig, () => {
    [
        {
            optionName: 'selectionMode',
            optionValue: 'range'
        },
        {
            optionName: 'viewsCount',
            optionValue: 2
        },
    ].forEach(({ optionName, optionValue }) => {
        QUnit.test(`Calendar should have ${optionName} option equals ${optionValue}`, function(assert) {
            const startDateBox = getStartDateBoxInstance(this.instance);

            startDateBox.open();

            assert.strictEqual(startDateBox._strategy.widgetOption(optionName), optionValue);
        });
    });

    QUnit.test('Calendar should have "values" option equals to dateRangeBox "value"', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);

        startDateBox.open();

        assert.deepEqual(startDateBox._strategy.widgetOption('values'), this.instance.option('value'));
    });
});

QUnit.module('RangeCalendar strategy: applyValueMode="instantly', moduleConfig, () => {
    QUnit.test('StartDate value should be passed to startDateBox after click by calendar cell, value: [null, null]', function(assert) {
        this.reinit({
            applyValueMode: 'instantly',
            value: [null, null],
        });

        this.instance.open();

        const startDateBox = getStartDateBoxInstance(this.instance);

        assert.deepEqual(startDateBox._strategy.widgetOption('values'), [null, null]);
    });

    QUnit.test('StartDateBox & EndDateBox should have correct date values after select start date in calendar', function(assert) {
        this.reinit({
            applyValueMode: 'instantly',
            value: [null, null],
        });

        this.instance.open();

        assert.deepEqual(this.startDateBox.option('value'), null, 'startDateBox value is correct');
        assert.deepEqual(this.endDateBox.option('value'), null, 'endDateBox value is correct');
        assert.deepEqual(this.getCalendar().option('values'), [null, null], 'calendar value is correct');

        const $cell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
        const cellDate = dataUtils.data($cell.get(0), CALENDAR_DATE_VALUE_KEY);
        $cell.trigger('dxclick');

        assert.deepEqual(this.startDateBox.option('value'), cellDate, 'startDateBox value is correct');
        assert.deepEqual(this.endDateBox.option('value'), null, 'endDateBox value is correct');
        assert.deepEqual(this.getCalendar().option('values'), [cellDate, null], 'calendar value is correct');
    });

    QUnit.test('DateRangeBox should not be closed after select start date in calendar', function(assert) {
        this.reinit({
            applyValueMode: 'instantly',
            value: [null, null],
        });

        this.instance.open();

        assert.deepEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');

        const $cell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
        $cell.trigger('dxclick');

        assert.deepEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');
    });

    ['td', 'span'].forEach((cellElement) => {
        QUnit.test(`StartDateBox & EndDateBox should have correct date values after select end date in calendar by click on ${cellElement} element`, function(assert) {
            this.reinit({
                applyValueMode: 'instantly',
                value: [null, null],
            });

            this.instance.open();

            assert.deepEqual(this.startDateBox.option('value'), null, 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), null, 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('values'), [null, null], 'calendar value is correct');

            const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            const startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            (cellElement === 'td' ? $startDateCell : $startDateCell.find(cellElement)).trigger('dxclick');

            const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
            const endCellDate = dataUtils.data($endDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            (cellElement === 'td' ? $endDateCell : $endDateCell.find(cellElement)).trigger('dxclick');

            assert.deepEqual(this.startDateBox.option('value'), startCellDate, 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), endCellDate, 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('values'), [startCellDate, endCellDate], 'calendar value is correct');
        });
    });

    QUnit.test('DateRangeBox should be closed after select end date in calendar', function(assert) {
        this.reinit({
            applyValueMode: 'instantly',
            value: [null, null],
        });

        this.instance.open();

        assert.deepEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');

        const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
        $startDateCell.trigger('dxclick');

        const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
        $endDateCell.trigger('dxclick');

        assert.deepEqual(this.instance.option('opened'), false, 'dateRangeBox is closed');
    });

    QUnit.testInActiveWindow('DateRangeBox & End DateBox should have focus class after select end date', function(assert) {
        this.reinit({
            applyValueMode: 'instantly',
            value: [null, null],
            focusStateEnabled: true,
        });

        this.instance.open();

        assert.strictEqual(this.$element.hasClass(STATE_FOCUSED_CLASS), false, 'dateRangeBox has no focus state class');
        assert.strictEqual(this.instance.getStartDateBox().$element().hasClass(STATE_FOCUSED_CLASS), false, 'startDateBox has no focus state class');
        assert.strictEqual(this.instance.getEndDateBox().$element().hasClass(STATE_FOCUSED_CLASS), false, 'endDateBox has no focus state class');

        const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
        $startDateCell.trigger('dxclick');

        assert.strictEqual(this.$element.hasClass(STATE_FOCUSED_CLASS), true, 'dateRangeBox has focus state class');
        assert.strictEqual(this.instance.getStartDateBox().$element().hasClass(STATE_FOCUSED_CLASS), false, 'startDateBox has no focus state class');
        assert.strictEqual(this.instance.getEndDateBox().$element().hasClass(STATE_FOCUSED_CLASS), true, 'endDateBox has focus state class');

        const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
        $endDateCell.trigger('dxclick');

        assert.strictEqual(this.$element.hasClass(STATE_FOCUSED_CLASS), true, 'dateRangeBox has focus state class');
        assert.strictEqual(this.instance.getStartDateBox().$element().hasClass(STATE_FOCUSED_CLASS), false, 'startDateBox has no focus state class');
        assert.strictEqual(this.instance.getEndDateBox().$element().hasClass(STATE_FOCUSED_CLASS), true, 'endDateBox has focus state class');
    });
});
