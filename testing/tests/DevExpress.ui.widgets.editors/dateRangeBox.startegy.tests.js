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
const POPUP_DONE_BUTTON = 'dx-popup-done.dx-button';
const POPUP_CANCEL_BUTTON = 'dx-popup-cancel.dx-button';

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

    QUnit.module('Min/max options in views', {
        beforeEach: function() {
            this.getCalendarMinMax = () => {
                const { min, max } = this.getCalendar().option();

                return {
                    calendarMin: min,
                    calendarMax: max,
                };
            };

            this.getViewMinMax = () => {
                const { min, max } = this.getCalendar()._view.option();

                return {
                    viewMin: min,
                    viewMax: max,
                };
            };
        }
    }, () => {
        ['instantly', 'useButtons'].forEach((applyValueMode) => {
            QUnit.test(`view min/max should be equal to calendar min/max on Popup open (applyValueMode = ${applyValueMode})`, function(assert) {
                this.reinit({
                    value: ['2023/01/05', '2023/02/14'],
                    applyValueMode
                });

                this.instance.open();

                const { calendarMin, calendarMax } = this.getCalendarMinMax();
                const { viewMin, viewMax } = this.getViewMinMax();

                assert.strictEqual(viewMin, calendarMin, 'view and calendar min option is the same');
                assert.strictEqual(viewMax, calendarMax, 'view and calendar max option is the same');
            });

            QUnit.test(`min option in views should be equal to startDate after selecting startDate (applyValueMode = ${applyValueMode})`, function(assert) {
                this.reinit({
                    applyValueMode
                });

                this.instance.open();

                const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
                const startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
                $startDateCell.trigger('dxclick');

                const { calendarMax } = this.getCalendarMinMax();
                const { viewMin, viewMax } = this.getViewMinMax();

                assert.deepEqual(viewMin, startCellDate, 'view min option equals start date');
                assert.strictEqual(calendarMax, viewMax, 'view max option is not changed');
            });

            QUnit.test(`max option in views should be equal to endDate, min option in views should be restored after selecting startDate and endDate (applyValueMode = ${applyValueMode})`, function(assert) {
                this.reinit({
                    applyValueMode
                });

                this.instance.open();

                const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
                $startDateCell.trigger('dxclick');

                const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
                const endCellDate = dataUtils.data($endDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
                $endDateCell.trigger('dxclick');

                const { calendarMin } = this.getCalendarMinMax();
                const { viewMin, viewMax } = this.getViewMinMax();

                assert.strictEqual(viewMin, calendarMin, 'view min option restored to calendar min option');
                assert.deepEqual(viewMax, endCellDate, 'view max option equals endDate');
            });

            QUnit.test(`min and max options should be restored after selecting startDate and endDate and reopen popup (applyValueMode = ${applyValueMode})`, function(assert) {
                this.reinit({
                    applyValueMode
                });

                this.instance.open();

                const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
                $startDateCell.trigger('dxclick');

                const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
                $endDateCell.trigger('dxclick');

                if(applyValueMode === 'useButtons') {
                    const $okButton = $(this.instance.getStartDateBox().content()).parent().find(`.${POPUP_DONE_BUTTON}`);
                    $okButton.trigger('dxclick');
                }

                this.instance.open();

                const { calendarMin, calendarMax } = this.getCalendarMinMax();
                const { viewMin, viewMax } = this.getViewMinMax();

                assert.strictEqual(viewMin, calendarMin, 'view min option restored to calendar min option');
                assert.strictEqual(viewMax, calendarMax, 'view max option restored to calendar max option');
            });
        });
    });
});

QUnit.module('RangeCalendar strategy: applyValueMode="instantly"', moduleConfig, () => {
    QUnit.test('StartDate value should be passed to startDateBox after click by calendar cell, value: [null, null]', function(assert) {
        this.reinit({
            applyValueMode: 'instantly',
            value: [null, null],
        });

        this.instance.open();

        const startDateBox = getStartDateBoxInstance(this.instance);

        assert.deepEqual(startDateBox._strategy.widgetOption('values'), [null, null]);
    });

    [
        [null, null],
        [new Date(2021, 9, 17), null],
        [null, new Date(2021, 10, 25)],
        [new Date(2021, 9, 17), new Date(2021, 10, 25)]
    ].forEach((initialValue) => {
        QUnit.test(`StartDateBox & EndDateBox should have correct date values after select start date and end date in calendar, initialValue: ${JSON.stringify(initialValue)}`, function(assert) {
            this.reinit({
                applyValueMode: 'instantly',
                value: initialValue,
            });

            this.instance.open();

            assert.deepEqual(this.instance.option('value'), initialValue, 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), initialValue[0], 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), initialValue[1], 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('values'), initialValue, 'calendar value is correct');

            const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            const startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            $startDateCell.trigger('dxclick');

            assert.deepEqual(this.instance.option('value'), [startCellDate, initialValue[1]], 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), startCellDate, 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), initialValue[1], 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('values'), [startCellDate, initialValue[1]], 'calendar value is correct');

            const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
            const endCellDate = dataUtils.data($endDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            $endDateCell.trigger('dxclick');

            assert.deepEqual(this.instance.option('value'), [startCellDate, endCellDate], 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), startCellDate, 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), endCellDate, 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('values'), [startCellDate, endCellDate], 'calendar value is correct');
        });

        QUnit.test(`onValueChanged should be called once on select start date and end date in calendar, initialValue: ${JSON.stringify(initialValue)}`, function(assert) {
            const onValueChangedHandler = sinon.spy();

            this.reinit({
                applyValueMode: 'instantly',
                value: initialValue,
                onValueChanged: onValueChangedHandler,
                opened: true,
            });

            const $cell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            $cell.trigger('dxclick');

            assert.strictEqual(onValueChangedHandler.callCount, 1, 'onValueChanged was called once after select start date');
            onValueChangedHandler.reset();

            const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
            $endDateCell.trigger('dxclick');

            assert.strictEqual(onValueChangedHandler.callCount, 1, 'onValueChanged was called once after select end date');
        });
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

            assert.deepEqual(this.instance.option('value'), [null, null], 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), null, 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), null, 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('values'), [null, null], 'calendar value is correct');

            const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            const startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            (cellElement === 'td' ? $startDateCell : $startDateCell.find(cellElement)).trigger('dxclick');

            const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
            const endCellDate = dataUtils.data($endDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            (cellElement === 'td' ? $endDateCell : $endDateCell.find(cellElement)).trigger('dxclick');

            assert.deepEqual(this.instance.option('value'), [startCellDate, endCellDate], 'dateRangeBox value is correct');
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

    [
        { field: 'startDate', index: 0 },
        { field: 'endDate', index: 1 },
    ].forEach(({ field, index }) => {
        QUnit.test(`StartDate value should be choosed first after opening by click on ${field} field if openOnFieldClick is true`, function(assert) {
            this.reinit({
                applyValueMode: 'instantly',
                value: [null, null],
                openOnFieldClick: true,
            });

            $(this.instance.field()[index]).trigger('dxclick');

            assert.deepEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');

            const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            const startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            $startDateCell.trigger('dxclick');

            assert.deepEqual(this.instance.option('value'), [startCellDate, null], 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), startCellDate, 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), null, 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('values'), [startCellDate, null], 'calendar value is correct');

            const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
            const endCellDate = dataUtils.data($endDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            $endDateCell.trigger('dxclick');

            assert.deepEqual(this.instance.option('value'), [startCellDate, endCellDate], 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), startCellDate, 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), endCellDate, 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('values'), [startCellDate, endCellDate], 'calendar value is correct');

            assert.deepEqual(this.instance.option('opened'), false, 'dateRangeBox is closed');
        });
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

    QUnit.test('Popup should not break after selecting values by click and updating min option that triggers invalidate', function(assert) {
        this.reinit({
            applyValueMode: 'instantly',
            value: [null, null],
            opened: true,
        });

        const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
        const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(22);

        $startDateCell.trigger('dxclick');
        $endDateCell.trigger('dxclick');

        this.instance.option('min', new Date('2000/01/01'));
        this.instance.open();

        assert.strictEqual(this.instance.option('opened'), true);
    });
});

QUnit.module('RangeCalendar strategy: applyValueMode="useButtons"', moduleConfig, () => {
    [
        [null, null],
        [new Date(2021, 9, 17), null],
        [null, new Date(2021, 10, 25)],
        [new Date(2021, 9, 17), new Date(2021, 10, 25)]
    ].forEach((initialValue) => {
        QUnit.test(`StartDateBox & EndDateBox should change value after select start date and end date in calendar and click ok button, initialValue: ${JSON.stringify(initialValue)}`, function(assert) {
            this.reinit({
                applyValueMode: 'useButtons',
                value: initialValue,
            });

            this.instance.open();

            assert.deepEqual(this.instance.option('value'), initialValue, 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), initialValue[0], 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), initialValue[1], 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('values'), initialValue, 'calendar value is correct');

            const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            const startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            $startDateCell.trigger('dxclick');

            assert.deepEqual(this.instance.option('value'), initialValue, 'dateRangeBox value is not changed');
            assert.deepEqual(this.startDateBox.option('value'), initialValue[0], 'startDateBox value is not changed');
            assert.deepEqual(this.endDateBox.option('value'), initialValue[1], 'endDateBox value is not changed');
            assert.deepEqual(this.getCalendar().option('values'), [startCellDate, initialValue[1]], 'calendar value is correct');

            const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
            const endCellDate = dataUtils.data($endDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            $endDateCell.trigger('dxclick');

            assert.deepEqual(this.instance.option('value'), initialValue, 'dateRangeBox value is not changed');
            assert.deepEqual(this.startDateBox.option('value'), initialValue[0], 'startDateBox value is not changed');
            assert.deepEqual(this.endDateBox.option('value'), initialValue[1], 'endDateBox value is not changed');
            assert.deepEqual(this.getCalendar().option('values'), [startCellDate, endCellDate], 'calendar value is correct');

            const $okButton = $(this.instance.getStartDateBox().content()).parent().find(`.${POPUP_DONE_BUTTON}`);
            $okButton.trigger('dxclick');

            assert.deepEqual(this.instance.option('value'), [startCellDate, endCellDate], 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), startCellDate, 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), endCellDate, 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('values'), [startCellDate, endCellDate], 'calendar value is correct');
        });

        QUnit.test(`StartDateBox & EndDateBox should not change value after select start date and end date in calendar and click cancel button, initialValue: ${JSON.stringify(initialValue)}`, function(assert) {
            this.reinit({
                applyValueMode: 'useButtons',
                value: initialValue,
            });

            this.instance.open();

            assert.deepEqual(this.instance.option('value'), initialValue, 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), initialValue[0], 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), initialValue[1], 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('values'), initialValue, 'calendar value is correct');

            const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            const startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            $startDateCell.trigger('dxclick');

            const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
            const endCellDate = dataUtils.data($endDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            $endDateCell.trigger('dxclick');

            assert.deepEqual(this.getCalendar().option('values'), [startCellDate, endCellDate], 'calendar value is correct');

            const $cancelButton = $(this.instance.getStartDateBox().content()).parent().find(`.${POPUP_CANCEL_BUTTON}`);
            $cancelButton.trigger('dxclick');

            assert.deepEqual(this.instance.option('value'), initialValue, 'dateRangeBox value is not changed');
            assert.deepEqual(this.startDateBox.option('value'), initialValue[0], 'startDateBox value is not changed');
            assert.deepEqual(this.endDateBox.option('value'), initialValue[1], 'endDateBox value is not changed');
            assert.deepEqual(this.getCalendar().option('values'), initialValue, 'calendar is not changed');
        });

        QUnit.test(`onValueChanged should not be called on select start date and end date in calendar, initialValue: ${JSON.stringify(initialValue)}`, function(assert) {
            const onValueChangedHandler = sinon.spy();

            this.reinit({
                applyValueMode: 'useButtons',
                value: initialValue,
                onValueChanged: onValueChangedHandler,
                opened: true,
            });

            const $cell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            $cell.trigger('dxclick');

            assert.strictEqual(onValueChangedHandler.callCount, 0, 'onValueChanged was called once after select start date');
            onValueChangedHandler.reset();

            const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
            $endDateCell.trigger('dxclick');

            assert.strictEqual(onValueChangedHandler.callCount, 0, 'onValueChanged was called once after select end date');
        });
    });

    QUnit.test('It should be possible to select only startDate and apply value by click on ok button', function(assert) {
        this.reinit({
            applyValueMode: 'useButtons',
            opened: true,
        });

        const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
        const startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
        $startDateCell.trigger('dxclick');

        assert.deepEqual(this.instance.option('value'), [null, null], 'dateRangeBox value is not changed');
        assert.deepEqual(this.startDateBox.option('value'), null, 'startDateBox value is not changed');
        assert.deepEqual(this.endDateBox.option('value'), null, 'endDateBox value is not changed');
        assert.deepEqual(this.getCalendar().option('values'), [startCellDate, null], 'calendar value is correct');

        const $okButton = $(this.instance.getStartDateBox().content()).parent().find(`.${POPUP_DONE_BUTTON}`);
        $okButton.trigger('dxclick');

        assert.deepEqual(this.instance.option('value'), [startCellDate, null], 'dateRangeBox value is correct');
        assert.deepEqual(this.startDateBox.option('value'), startCellDate, 'startDateBox value is correct');
        assert.deepEqual(this.endDateBox.option('value'), null, 'endDateBox value is not changed');
        assert.deepEqual(this.getCalendar().option('values'), [startCellDate, null], 'calendar value is correct');
    });

    ['ok', 'cancel'].forEach((button) => {
        QUnit.test(`DateRangeBox should be closed after click on ${button} button`, function(assert) {
            this.reinit({
                applyValueMode: 'useButtons',
                value: [null, null],
                opened: true,
            });

            assert.deepEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');

            const buttonClass = button === 'ok' ? POPUP_DONE_BUTTON : POPUP_CANCEL_BUTTON;
            const $button = $(this.instance.getStartDateBox().content()).parent().find(`.${buttonClass}`);
            $button.trigger('dxclick');

            assert.deepEqual(this.instance.option('opened'), false, 'dateRangeBox is closed');
        });

        QUnit.testInActiveWindow(`DateRangeBox and StartDateBox should be focused after click on ${button} button after select start date`, function(assert) {
            this.reinit({
                applyValueMode: 'useButtons',
                value: [null, null],
            });

            this.instance.open();

            const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            $startDateCell.trigger('dxclick');

            assert.deepEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');
            assert.strictEqual(this.$element.hasClass(STATE_FOCUSED_CLASS), true, 'dateRangeBox has focus state class');
            assert.strictEqual(this.instance.getStartDateBox().$element().hasClass(STATE_FOCUSED_CLASS), false, 'startDateBox has no focus state class');
            assert.strictEqual(this.instance.getEndDateBox().$element().hasClass(STATE_FOCUSED_CLASS), true, 'endDateBox has focus state class');

            const buttonClass = button === 'ok' ? POPUP_DONE_BUTTON : POPUP_CANCEL_BUTTON;
            const $button = $(this.instance.getStartDateBox().content()).parent().find(`.${buttonClass}`);
            $button.trigger('dxclick');

            assert.deepEqual(this.instance.option('opened'), false, 'dateRangeBox is closed');
            assert.strictEqual(this.$element.hasClass(STATE_FOCUSED_CLASS), true, 'dateRangeBox has focus state class');
            assert.strictEqual(this.instance.getStartDateBox().$element().hasClass(STATE_FOCUSED_CLASS), true, 'startDateBox has focus state class');
            assert.strictEqual(this.instance.getEndDateBox().$element().hasClass(STATE_FOCUSED_CLASS), false, 'endDateBox has no focus state class');
        });
    });

    QUnit.testInActiveWindow('DateRangeBox & EndDateBox should have focus class after select start date', function(assert) {
        this.reinit({
            applyValueMode: 'useButtons',
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
    });

    QUnit.testInActiveWindow('DateRangeBox & StartDateBox should have focus class after select start date', function(assert) {
        this.reinit({
            applyValueMode: 'useButtons',
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
        assert.strictEqual(this.instance.getStartDateBox().$element().hasClass(STATE_FOCUSED_CLASS), true, 'startDateBox has no focus state class');
        assert.strictEqual(this.instance.getEndDateBox().$element().hasClass(STATE_FOCUSED_CLASS), false, 'endDateBox has focus state class');
    });

    QUnit.test('Popup should not break after selecting values by click and updating min option that triggers invalidate', function(assert) {
        this.reinit({
            applyValueMode: 'useButtons',
            value: [null, null],
            opened: true,
        });

        const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
        const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(22);

        $startDateCell.trigger('dxclick');
        $endDateCell.trigger('dxclick');

        this.instance.option('min', new Date('2000/01/01'));
        this.instance.open();

        assert.strictEqual(this.instance.option('opened'), true);
    });
});
