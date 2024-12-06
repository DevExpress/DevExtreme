import $ from 'jquery';
import fx from 'common/core/animation/fx';
import dataUtils from 'core/element_data';
import devices from 'core/devices.js';
import keyboardMock from '../../helpers/keyboardMock.js';

import 'ui/date_range_box';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup =
        '<div id="dateRangeBox"></div>';

    $('#qunit-fixture').html(markup);
});

const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const STATE_FOCUSED_CLASS = 'dx-state-focused';
const POPUP_APPLY_BUTTON_CLASS = 'dx-popup-done';
const POPUP_DONE_BUTTON = `${POPUP_APPLY_BUTTON_CLASS}.dx-button`;
const POPUP_CANCEL_BUTTON = 'dx-popup-cancel.dx-button';
const CALENDAR_CONTOURED_DATE_CLASS = 'dx-calendar-contoured-date';

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
            this.getCalendar = () => this.startDateBox.getStrategy().getWidget();
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init({
            value: ['2023/01/05', '2023/02/14'],
            multiView: true,
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

    QUnit.test('Calendar should have "value" option equals to dateRangeBox "value"', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);

        startDateBox.open();

        assert.deepEqual(startDateBox._strategy.widgetOption('value'), this.instance.option('value'));
    });

    QUnit.module('disableOutOfRangeSelection option', {
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
            QUnit.test(`view min/max should be equal to calendar min/max on Popup open (applyValueMode="${applyValueMode}", disableOutOfRangeSelection=true)`, function(assert) {
                this.reinit({
                    value: ['2023/01/05', '2023/02/14'],
                    applyValueMode,
                    disableOutOfRangeSelection: true,
                });

                this.instance.open();

                const { calendarMin, calendarMax } = this.getCalendarMinMax();
                const { viewMin, viewMax } = this.getViewMinMax();

                assert.strictEqual(viewMin, calendarMin, 'view and calendar min option is the same');
                assert.strictEqual(viewMax, calendarMax, 'view and calendar max option is the same');
            });

            QUnit.test(`min option in views should be equal to startDate after selecting startDate (applyValueMode="${applyValueMode}", disableOutOfRangeSelection=true)`, function(assert) {
                this.reinit({
                    applyValueMode,
                    disableOutOfRangeSelection: true,
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

            QUnit.testInActiveWindow(`min option in views should be equal to startDate after focus startDate input (applyValueMode="${applyValueMode}", disableOutOfRangeSelection=true)`, function(assert) {
                const initialValue = [new Date(2021, 9, 17), new Date(2021, 9, 20)];

                this.reinit({
                    applyValueMode,
                    value: initialValue,
                    disableOutOfRangeSelection: true,
                });

                $(this.instance.endDateField()).trigger('dxclick');

                const { calendarMin, calendarMax } = this.getCalendarMinMax();

                assert.strictEqual(this.getViewMinMax().viewMin, calendarMin, 'view min option equals calendarMin');
                assert.strictEqual(this.getViewMinMax().viewMax, calendarMax, 'view max option equals calendarMax');

                $(this.instance.startDateField()).focusin();

                assert.strictEqual(this.getViewMinMax().viewMin, calendarMin, 'view min option is not changed');
                assert.deepEqual(this.getViewMinMax().viewMax, initialValue[1], 'view max option is changed');

                $(this.instance.endDateField()).focusin();

                assert.strictEqual(this.getViewMinMax().viewMin, initialValue[0], 'view min option is changed');
                assert.deepEqual(this.getViewMinMax().viewMax, calendarMax, 'view max option is restored');

                $(this.instance.startDateField()).focusin();

                assert.strictEqual(this.getViewMinMax().viewMin, calendarMin, 'view min option is restored');
                assert.deepEqual(this.getViewMinMax().viewMax, initialValue[1], 'view max option is changed');
            });

            QUnit.test(`min and max options should be restored after selecting startDate and endDate and reopen popup (applyValueMode="${applyValueMode}", disableOutOfRangeSelection=true)`, function(assert) {
                this.reinit({
                    applyValueMode,
                    multiView: true,
                    disableOutOfRangeSelection: true,
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

            QUnit.test(`Views min option should not be restored after view refresh (applyValueMode="${applyValueMode}", disableOutOfRangeSelection=true)`, function(assert) {
                this.reinit({
                    applyValueMode,
                    opened: true,
                    disableOutOfRangeSelection: true,
                });

                const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
                const startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
                $startDateCell.trigger('dxclick');

                this.getCalendar()._refreshViews();

                const { viewMin } = this.getViewMinMax();

                assert.deepEqual(viewMin, startCellDate, 'view min option equals startDate');
            });

            QUnit.test(`Views max option should not be restored after view refresh (applyValueMode="${applyValueMode}", disableOutOfRangeSelection=true)`, function(assert) {
                this.reinit({
                    applyValueMode,
                    opened: true,
                    disableOutOfRangeSelection: true,
                });

                $(this.instance.endDateField()).focusin();

                const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
                const endCellDate = dataUtils.data($endDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
                $endDateCell.trigger('dxclick');

                this.getCalendar()._refreshViews();

                const { viewMax } = this.getViewMinMax();

                assert.deepEqual(viewMax, endCellDate, 'view max option equals startDate');
            });
        });

        QUnit.test('max option in views should be equal to endDate, min option in views should be restored after selecting startDate and endDate (applyValueMode="useButtons", disableOutOfRangeSelection=true)', function(assert) {
            this.reinit({
                applyValueMode: 'useButtons',
                multiView: true,
                disableOutOfRangeSelection: true,
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

        QUnit.test('min option in views should not change after selecting startDate (disableOutOfRangeSelection=false)', function(assert) {
            this.reinit({
                applyValueMode: 'useButtons',
            });

            this.instance.open();

            const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            $startDateCell.trigger('dxclick');

            const { calendarMax } = this.getCalendarMinMax();
            const { viewMin, viewMax } = this.getViewMinMax();

            assert.strictEqual(viewMin, viewMin, 'view min option is not changed');
            assert.strictEqual(calendarMax, viewMax, 'view max option is not changed');
        });

        QUnit.test('max option in views should not change after selecting endDate (disableOutOfRangeSelection=false)', function(assert) {
            this.reinit({
                applyValueMode: 'useButtons',
            });
            this.instance.open();

            const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            $startDateCell.trigger('dxclick');

            const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(22);
            $endDateCell.trigger('dxclick');

            const { calendarMin, calendarMax } = this.getCalendarMinMax();
            const { viewMin, viewMax } = this.getViewMinMax();

            assert.strictEqual(viewMin, calendarMin, 'view min option is not changed');
            assert.strictEqual(viewMax, calendarMax, 'view max option is not changed');
        });

        QUnit.test('It should not be possible to focus disabled date before start date when end date field is focused', function(assert) {
            this.reinit({
                disableOutOfRangeSelection: true,
            });
            this.instance.open();

            const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            const startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            $startDateCell.trigger('dxclick');

            const $endDateInput = $(this.instance.endDateField());
            const keyboard = keyboardMock($endDateInput);

            keyboard.press('arrowleft');

            const currentDate = this.getCalendar().option('currentDate');

            assert.deepEqual(startCellDate, currentDate, 'currentDate is not changed');
        });

        QUnit.test('It should not be possible to focus disabled date after end date when start date field is focused', function(assert) {
            this.reinit({
                disableOutOfRangeSelection: true,
            });
            this.instance.open();
            $(this.instance.endDateField()).focusin();

            const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            const endCellDate = dataUtils.data($endDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            $endDateCell.trigger('dxclick');

            const $startDateInput = $(this.instance.startDateField());
            const keyboard = keyboardMock($startDateInput);

            keyboard.press('arrowright');

            const currentDate = this.getCalendar().option('currentDate');

            assert.deepEqual(currentDate, endCellDate, 'currentDate is not changed');
        });
    });

    ['instantly', 'useButtons'].forEach((applyValueMode) => {
        QUnit.test(`Enter key should apply value from input when input value was changed (applyValueMode = ${applyValueMode})`, function(assert) {
            this.reinit({
                applyValueMode,
                value: ['2023/05/11', '2023/05/23'],
                displayFormat: 'yyyy/MM/dd',
                opened: true,
            });

            const $startDateInput = $(this.instance.startDateField());
            let keyboard = keyboardMock($startDateInput);

            $startDateInput.focusin();

            keyboard.caret(100).press('backspace').press('enter');

            assert.deepEqual(new Date(this.getCalendar().option('value')[0]), new Date('2023/05/01'), 'value from start date input aplied');

            const $endDateInput = $(this.instance.endDateField());
            keyboard = keyboardMock($endDateInput);

            $endDateInput.focusin();

            keyboard.caret(100).press('backspace').press('enter');

            assert.deepEqual(new Date(this.getCalendar().option('value')[1]), new Date('2023/05/02'), 'value from end date input aplied');
        });

        QUnit.test(`Enter key should apply value from calendar when input value was not changed (applyValueMode = ${applyValueMode})`, function(assert) {
            this.reinit({
                applyValueMode,
                value: ['2023/05/11', '2023/05/23'],
                displayFormat: 'yyyy/MM/dd',
                opened: true,
            });

            const $startDateInput = $(this.instance.startDateField());
            let keyboard = keyboardMock($startDateInput);

            $startDateInput.focusin();

            keyboard.caret(100).press('arrowleft').press('enter');

            assert.deepEqual(new Date(this.getCalendar().option('value')[0]), new Date('2023/05/10'), 'value from start date input aplied');

            const $endDateInput = $(this.instance.endDateField());
            keyboard = keyboardMock($endDateInput);

            $endDateInput.focusin();

            keyboard.caret(100).press('arrowright').press('enter');

            assert.deepEqual(new Date(this.getCalendar().option('value')[1]), new Date('2023/05/24'), 'value from end date input aplied');
        });

        [
            {
                firstSelect: 'startDate',
                secondSelect: 'endDate',
            },
            {
                firstSelect: 'endDate',
                secondSelect: 'startDate',
            },
            {
                firstSelect: 'startDate',
                secondSelect: 'startDate',
            },
            {
                firstSelect: 'endDate',
                secondSelect: 'endDate',
            },
        ].forEach(({ firstSelect, secondSelect }) => {
            QUnit.test(`Popup should ${applyValueMode === 'instantly' ? '' : 'not'} be closed after selecting ${firstSelect} + ${secondSelect} (applyValueMode = ${applyValueMode}, disableOutOfRangeSelection = true)`, function(assert) {
                this.reinit({
                    applyValueMode,
                    disableOutOfRangeSelection: true,
                    value: [null, null],
                    opened: true,
                });

                $(this.instance.field()[firstSelect === 'startDate' ? 0 : 1]).focusin();

                const $firstDate = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
                const firstCellDate = dataUtils.data($firstDate.get(0), CALENDAR_DATE_VALUE_KEY);
                $firstDate.trigger('dxclick');

                assert.strictEqual(this.instance.option('opened'), true, 'Popup is opened');
                assert.deepEqual(this.getCalendar().option('value')[firstSelect === 'startDate' ? 0 : 1], firstCellDate, `${firstSelect} is selected correctly`);

                $(this.instance.field()[secondSelect === 'startDate' ? 0 : 1]).focusin();

                const $secondDate = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(secondSelect === 'startDate' ? 18 : 22);
                const secondCellDate = dataUtils.data($secondDate.get(0), CALENDAR_DATE_VALUE_KEY);
                $secondDate.trigger('dxclick');

                assert.strictEqual(this.instance.option('opened'), applyValueMode === 'useButtons', `Popup is ${applyValueMode === 'useButtons' ? 'opened' : 'closed'}`);
                assert.deepEqual(this.getCalendar().option('value')[secondSelect === 'startDate' ? 0 : 1], secondCellDate, `${secondSelect} is selected correctly`);
            });
        });
    });

    QUnit.module('Calendar currentDate', () => {
        QUnit.test('CurrentDate should be equal to startDate when open by click on startDate input', function(assert) {
            this.reinit({
                multiView: true,
                value: [new Date('2023/06/01'), new Date('2023/07/13')],
            });

            $(this.instance.startDateField()).trigger('dxclick');

            const calendar = this.getCalendar();

            assert.deepEqual(calendar.option('currentDate'), this.instance.option('startDate'));
        });

        QUnit.test('CurrentDate should be equal to endDate when open by click on endDate input', function(assert) {
            this.reinit({
                multiView: true,
                value: [new Date('2023/06/01'), new Date('2023/07/13')],
            });

            $(this.instance.endDateField()).trigger('dxclick');

            const calendar = this.getCalendar();

            assert.deepEqual(calendar.option('currentDate'), this.instance.option('endDate'));
        });

        QUnit.test('CurrentDate should be equal to endDate when open by click on startDate input but startDate is not defined', function(assert) {
            this.reinit({
                multiView: true,
                value: [null, new Date('2023/07/13')],
            });

            $(this.instance.startDateField()).trigger('dxclick');

            const calendar = this.getCalendar();

            assert.deepEqual(calendar.option('currentDate'), this.instance.option('endDate'));
        });

        QUnit.test('CurrentDate should be equal to startDate when open by click on endDate input but endDate is not defined', function(assert) {
            this.reinit({
                multiView: true,
                value: [new Date('2023/06/01'), null],
            });

            $(this.instance.endDateField()).trigger('dxclick');

            const calendar = this.getCalendar();

            assert.deepEqual(calendar.option('currentDate'), this.instance.option('startDate'));
        });

        QUnit.test('CurrentDate should be updated after changing focus from startDate input to endDate input and vice verta', function(assert) {
            this.reinit({
                multiView: true,
                value: [new Date('2023/06/01'), new Date('2023/07/13')],
            });

            $(this.instance.startDateField()).trigger('dxclick');
            $(this.instance.endDateField()).trigger('dxclick');

            const calendar = this.getCalendar();

            assert.deepEqual(calendar.option('currentDate'), this.instance.option('endDate'), 'currentDate equals endDate');

            $(this.instance.startDateField()).trigger('dxclick');

            assert.deepEqual(calendar.option('currentDate'), this.instance.option('startDate'), 'currentDate equals startDate');

            $(this.instance.endDateField()).trigger('dxclick');

            assert.deepEqual(calendar.option('currentDate'), this.instance.option('endDate'), 'currentDate equals endDate');
        });

        QUnit.test('CurrentDate should be on the additional view when focus endDate field and endDate is bigger than startDate on 2+ months', function(assert) {
            this.reinit({
                multiView: true,
                value: [new Date('2023/06/01'), new Date('2023/11/13')],
            });

            $(this.instance.startDateField()).trigger('dxclick');
            $(this.instance.endDateField()).trigger('dxclick');

            const calendar = this.getCalendar();
            const $additionalView = $(calendar._additionalView.$element());
            const $currentDateCell = $($additionalView.find('td[data-value=\'2023/11/13\']'));

            assert.deepEqual(calendar.option('currentDate'), this.instance.option('endDate'));
            assert.ok($currentDateCell.length, 'currentDate is on additional view');
        });

        QUnit.test('Calendar should not swipe views on focus endDate when startDate is on main view and endDate is on additional view', function(assert) {
            this.reinit({
                multiView: true,
                value: [new Date('2023/06/12'), new Date('2023/07/13')],
            });

            $(this.instance.startDateField()).trigger('dxclick');
            $(this.instance.endDateField()).trigger('dxclick');

            const calendar = this.getCalendar();
            const $mainView = $(calendar._view.$element());
            const $additionalView = $(calendar._additionalView.$element());
            const $startDateCell = $($mainView.find('td[data-value=\'2023/06/12\']'));
            const $endDateCell = $($additionalView.find('td[data-value=\'2023/07/13\']'));

            assert.ok($startDateCell.length, 'startDate is on main view');
            assert.ok($endDateCell.length, 'endDate is on additional view');
        });

        QUnit.test('startDate should be contoured after moving focus from endDate to startDate', function(assert) {
            if(devices.real().deviceType !== 'desktop') {
                assert.ok(true, 'test does not actual for mobile devices');
                return;
            }

            this.reinit({
                multiView: true,
                value: [new Date('2023/06/12'), new Date('2023/11/13')],
            });

            $(this.instance.endDateField()).trigger('dxclick');
            $(this.instance.startDateField()).trigger('dxclick');

            const $calendar = this.getCalendar().$element();
            const $startDateCell = $($calendar.find('td[data-value=\'2023/06/12\']'));

            assert.ok($startDateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
        });

        QUnit.test('endDate should be contoured after moving focus from startDate to endDate', function(assert) {
            if(devices.real().deviceType !== 'desktop') {
                assert.ok(true, 'test does not actual for mobile devices');
                return;
            }

            this.reinit({
                multiView: true,
                value: [new Date('2023/06/12'), new Date('2023/11/13')],
            });

            $(this.instance.startDateField()).trigger('dxclick');
            $(this.instance.endDateField()).trigger('dxclick');

            const $calendar = this.getCalendar().$element();
            const $endDateCell = $($calendar.find('td[data-value=\'2023/11/13\']'));

            assert.ok($endDateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
        });
    });

    QUnit.test('DateRangeBox value selected by click should be serialized (T1178899)', function(assert) {
        this.reinit({
            dateSerializationFormat: 'yyyy-MM-dd',
            value: [new Date('2023/07/20'), new Date('2023/07/25')]
        });
        this.instance.open();

        const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
        $startDateCell.trigger('dxclick');

        assert.deepEqual(this.instance.option('startDate'), '2023-07-15', 'start date is serialized');

        const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(22);
        $endDateCell.trigger('dxclick');

        assert.deepEqual(this.instance.option('endDate'), '2023-07-17', 'end date is serialized');
    });

    QUnit.test('DateRangeBox value selected by enter key should be serialized (T1178899)', function(assert) {
        this.reinit({
            dateSerializationFormat: 'yyyy-MM-dd',
            value: [new Date('2023/07/20'), new Date('2023/07/25')]
        });
        this.instance.open();

        const $startDateInput = $(this.instance.startDateField());
        const $endDateInput = $(this.instance.endDateField());
        let keyboard = keyboardMock($startDateInput);

        keyboard.press('arrowleft').press('enter');

        assert.deepEqual(this.instance.option('startDate'), '2023-07-19', 'start date is serialized');

        keyboard = keyboardMock($endDateInput);
        keyboard.press('arrowright').press('enter');

        assert.deepEqual(this.instance.option('endDate'), '2023-07-26', 'end date is serialized');
    });

    QUnit.test('DateRangeBox selected value should have the same format as initial value', function(assert) {
        this.reinit({
            value: ['2023/07/20', '2023/07/25']
        });
        this.instance.open();

        const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
        $startDateCell.trigger('dxclick');

        assert.strictEqual(this.instance.option('startDate'), '2023/07/15', 'selected start date has the the format as initial value');

        const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(22);
        $endDateCell.trigger('dxclick');

        assert.strictEqual(this.instance.option('endDate'), '2023/07/17', 'selected end date has the the format as initial value');
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

        assert.deepEqual(startDateBox._strategy.widgetOption('value'), [null, null]);
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
                multiView: true,
            });

            this.instance.open();

            assert.deepEqual(this.instance.option('value'), initialValue, 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), initialValue[0], 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), initialValue[1], 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('value'), initialValue, 'calendar value is correct');

            const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            const startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            $startDateCell.trigger('dxclick');

            assert.deepEqual(this.instance.option('value'), [startCellDate, initialValue[1]], 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), startCellDate, 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), initialValue[1], 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('value'), [startCellDate, initialValue[1]], 'calendar value is correct');

            const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
            const endCellDate = dataUtils.data($endDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            $endDateCell.trigger('dxclick');

            assert.deepEqual(this.instance.option('value'), [startCellDate, endCellDate], 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), startCellDate, 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), endCellDate, 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('value'), [startCellDate, endCellDate], 'calendar value is correct');
        });

        QUnit.test(`onValueChanged should be called once with correct event argument on select start date and end date in calendar, initialValue: ${JSON.stringify(initialValue)}`, function(assert) {
            const onValueChangedHandler = sinon.spy();

            this.reinit({
                applyValueMode: 'instantly',
                value: initialValue,
                onValueChanged: onValueChangedHandler,
                opened: true,
                multiView: true,
            });

            const $cell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            $cell.trigger('dxclick');

            assert.strictEqual(onValueChangedHandler.callCount, 1, 'onValueChanged was called once after select start date');
            assert.strictEqual(onValueChangedHandler.getCall(0).args[0].event.type, 'dxclick', 'event is correct');

            onValueChangedHandler.resetHistory();

            const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
            $endDateCell.trigger('dxclick');

            assert.strictEqual(onValueChangedHandler.callCount, 1, 'onValueChanged was called once after select end date');
            assert.strictEqual(onValueChangedHandler.getCall(0).args[0].event.type, 'dxclick', 'event is correct');
        });

        QUnit.test(`StartDate value should be chosen first after opening by click on startDate field if openOnFieldClick is true, initialValue: ${JSON.stringify(initialValue)}`, function(assert) {
            this.reinit({
                applyValueMode: 'instantly',
                value: initialValue,
                openOnFieldClick: true,
                multiView: true,
            });

            $(this.instance.field()[0]).trigger('dxclick');

            assert.deepEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');

            const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            const startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            $startDateCell.trigger('dxclick');

            assert.deepEqual(this.instance.option('value'), [startCellDate, initialValue[1]], 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), startCellDate, 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), initialValue[1], 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('value'), [startCellDate, initialValue[1]], 'calendar value is correct');

            const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
            const endCellDate = dataUtils.data($endDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            $endDateCell.trigger('dxclick');

            assert.deepEqual(this.instance.option('value'), [startCellDate, endCellDate], 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), startCellDate, 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), endCellDate, 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('value'), [startCellDate, endCellDate], 'calendar value is correct');

            assert.deepEqual(this.instance.option('opened'), false, 'dateRangeBox is closed');
        });

        QUnit.test(`EndDate value should be chosen first after opening by click on endDate field if openOnFieldClick is true, initialValue: ${JSON.stringify(initialValue)} (disableOutOfRangeSelection = true)`, function(assert) {
            this.reinit({
                applyValueMode: 'instantly',
                disableOutOfRangeSelection: true,
                value: initialValue,
                openOnFieldClick: true,
                multiView: true,
            });

            $(this.instance.endDateField()).trigger('dxclick');

            assert.deepEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');

            const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
            const endCellDate = dataUtils.data($endDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            $endDateCell.trigger('dxclick');

            assert.deepEqual(this.instance.option('value'), [initialValue[0], endCellDate], 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), initialValue[0], 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), endCellDate, 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('value'), [initialValue[0], endCellDate], 'calendar value is correct');

            assert.deepEqual(this.instance.option('opened'), true, 'dateRangeBox is not closed');
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
                multiView: true,
            });

            this.instance.open();

            assert.deepEqual(this.instance.option('value'), [null, null], 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), null, 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), null, 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('value'), [null, null], 'calendar value is correct');

            const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            const startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            (cellElement === 'td' ? $startDateCell : $startDateCell.find(cellElement)).trigger('dxclick');

            const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
            const endCellDate = dataUtils.data($endDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            (cellElement === 'td' ? $endDateCell : $endDateCell.find(cellElement)).trigger('dxclick');

            assert.deepEqual(this.instance.option('value'), [startCellDate, endCellDate], 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), startCellDate, 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), endCellDate, 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('value'), [startCellDate, endCellDate], 'calendar value is correct');
        });
    });

    QUnit.test('DateRangeBox should be closed after select end date in calendar', function(assert) {
        this.reinit({
            applyValueMode: 'instantly',
            value: [null, null],
            multiView: true,
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
            multiView: true,
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

    QUnit.test('active dateBox should be changed after date selection even if focusStateEnabled=false', function(assert) {
        this.reinit({
            applyValueMode: 'instantly',
            value: [null, null],
            focusStateEnabled: false,
            multiView: true,
        });

        const $startDateInput = $(this.instance.startDateField());

        $startDateInput.trigger('dxclick');

        const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
        const startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
        $startDateCell.trigger('dxclick');

        const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
        const endCellDate = dataUtils.data($endDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
        $endDateCell.trigger('dxclick');

        assert.deepEqual(this.instance.option('value'), [startCellDate, endCellDate], 'value is changed correctly because end dateBox became active after first date select');
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

    QUnit.test('It should be possible to pick the same start date + end date', function(assert) {
        this.reinit({
            value: [null, null],
            opened: true,
        });

        const $firstDate = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
        const firstCellDate = dataUtils.data($firstDate.get(0), CALENDAR_DATE_VALUE_KEY);
        $firstDate.trigger('dxclick');

        const $secondDate = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
        const secondCellDate = dataUtils.data($secondDate.get(0), CALENDAR_DATE_VALUE_KEY);
        $secondDate.trigger('dxclick');

        assert.deepEqual(firstCellDate, secondCellDate, 'dates are equal');
        assert.deepEqual(this.instance.option('value'), [firstCellDate, secondCellDate], 'value is correct');
    });

    QUnit.test('It should be possible to pick the same end date + start date', function(assert) {
        this.reinit({
            value: [null, null],
            opened: true,
        });

        $(this.instance.field()[1]).focusin();

        const $firstDate = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
        const firstCellDate = dataUtils.data($firstDate.get(0), CALENDAR_DATE_VALUE_KEY);
        $firstDate.trigger('dxclick');

        const $secondDate = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
        const secondCellDate = dataUtils.data($secondDate.get(0), CALENDAR_DATE_VALUE_KEY);
        $secondDate.trigger('dxclick');

        assert.deepEqual(firstCellDate, secondCellDate, 'dates are equal');
        assert.deepEqual(this.instance.option('value'), [secondCellDate, firstCellDate], 'value is correct');
    });

    QUnit.test('User and inner (setting selection counter) onShowing handlers should be fired on Popup showing', function(assert) {
        const onShowing = sinon.stub();
        this.reinit({
            opened: true,
            dropDownOptions: {
                onShowing
            }
        });

        const $firstDate = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
        $firstDate.trigger('dxclick');

        const $secondDate = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(22);
        $secondDate.trigger('dxclick');

        assert.ok(onShowing.called, 'user onShowing handler was called');
        assert.strictEqual(this.instance.option('opened'), false, 'Popup is closed');
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
                multiView: true,
            });

            this.instance.open();

            assert.deepEqual(this.instance.option('value'), initialValue, 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), initialValue[0], 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), initialValue[1], 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('value'), initialValue, 'calendar value is correct');

            const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            const startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            $startDateCell.trigger('dxclick');

            assert.deepEqual(this.instance.option('value'), initialValue, 'dateRangeBox value is not changed');
            assert.deepEqual(this.startDateBox.option('value'), initialValue[0], 'startDateBox value is not changed');
            assert.deepEqual(this.endDateBox.option('value'), initialValue[1], 'endDateBox value is not changed');
            assert.deepEqual(this.getCalendar().option('value'), [startCellDate, initialValue[1]], 'calendar value is correct');

            const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
            const endCellDate = dataUtils.data($endDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            $endDateCell.trigger('dxclick');

            assert.deepEqual(this.instance.option('value'), initialValue, 'dateRangeBox value is not changed');
            assert.deepEqual(this.startDateBox.option('value'), initialValue[0], 'startDateBox value is not changed');
            assert.deepEqual(this.endDateBox.option('value'), initialValue[1], 'endDateBox value is not changed');
            assert.deepEqual(this.getCalendar().option('value'), [startCellDate, endCellDate], 'calendar value is correct');

            const $okButton = $(this.instance.getStartDateBox().content()).parent().find(`.${POPUP_DONE_BUTTON}`);
            $okButton.trigger('dxclick');

            assert.deepEqual(this.instance.option('value'), [startCellDate, endCellDate], 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), startCellDate, 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), endCellDate, 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('value'), [startCellDate, endCellDate], 'calendar value is correct');
        });

        QUnit.test(`StartDateBox & EndDateBox should not change value after select start date and end date in calendar and click cancel button, initialValue: ${JSON.stringify(initialValue)}`, function(assert) {
            this.reinit({
                applyValueMode: 'useButtons',
                value: initialValue,
                multiView: true,
            });

            this.instance.open();

            assert.deepEqual(this.instance.option('value'), initialValue, 'dateRangeBox value is correct');
            assert.deepEqual(this.startDateBox.option('value'), initialValue[0], 'startDateBox value is correct');
            assert.deepEqual(this.endDateBox.option('value'), initialValue[1], 'endDateBox value is correct');
            assert.deepEqual(this.getCalendar().option('value'), initialValue, 'calendar value is correct');

            const $startDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            const startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            $startDateCell.trigger('dxclick');

            const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
            const endCellDate = dataUtils.data($endDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
            $endDateCell.trigger('dxclick');

            assert.deepEqual(this.getCalendar().option('value'), [startCellDate, endCellDate], 'calendar value is correct');

            const $cancelButton = $(this.instance.getStartDateBox().content()).parent().find(`.${POPUP_CANCEL_BUTTON}`);
            $cancelButton.trigger('dxclick');

            assert.deepEqual(this.instance.option('value'), initialValue, 'dateRangeBox value is not changed');
            assert.deepEqual(this.startDateBox.option('value'), initialValue[0], 'startDateBox value is not changed');
            assert.deepEqual(this.endDateBox.option('value'), initialValue[1], 'endDateBox value is not changed');
            assert.deepEqual(this.getCalendar().option('value'), initialValue, 'calendar is not changed');
        });

        QUnit.test(`onValueChanged should not be called on select start date and end date in calendar, initialValue: ${JSON.stringify(initialValue)}`, function(assert) {
            const onValueChangedHandler = sinon.spy();

            this.reinit({
                applyValueMode: 'useButtons',
                value: initialValue,
                onValueChanged: onValueChangedHandler,
                opened: true,
                multiView: true,
            });

            const $cell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            $cell.trigger('dxclick');

            assert.strictEqual(onValueChangedHandler.callCount, 0, 'onValueChanged was not called after select start date');
            onValueChangedHandler.resetHistory();

            const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
            $endDateCell.trigger('dxclick');

            assert.strictEqual(onValueChangedHandler.callCount, 0, 'onValueChanged was not called after select end date');
        });

        QUnit.test(`onValueChanged should be called with correct event argument on select start date and end date in calendar and click apply button, initialValue: ${JSON.stringify(initialValue)}`, function(assert) {
            const onValueChangedHandler = sinon.spy();

            this.reinit({
                applyValueMode: 'useButtons',
                value: initialValue,
                onValueChanged: onValueChangedHandler,
                opened: true,
                multiView: true,
            });

            const checkEventHandlerArgs = (event) => {
                const { type, target } = event;

                assert.strictEqual(type, 'dxclick', 'event is correct');
                assert.strictEqual($(target).hasClass(POPUP_APPLY_BUTTON_CLASS), true, 'event target is correct');
            };

            const $cell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
            $cell.trigger('dxclick');

            let $applyButton = $(this.instance.getStartDateBox().content()).parent().find(`.${POPUP_DONE_BUTTON}`);
            $applyButton.trigger('dxclick');

            assert.strictEqual(onValueChangedHandler.callCount, 1, 'onValueChanged was called once after select start date and click on apply button');

            checkEventHandlerArgs(onValueChangedHandler.getCall(0).args[0].event);

            onValueChangedHandler.resetHistory();

            $(this.instance.endDateField()).trigger('dxclick');

            const $endDateCell = $(this.getCalendar().$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(140);
            $endDateCell.trigger('dxclick');

            $applyButton = $(this.instance.getStartDateBox().content()).parent().find(`.${POPUP_DONE_BUTTON}`);
            $applyButton.trigger('dxclick');

            assert.strictEqual(onValueChangedHandler.callCount, 1, 'onValueChanged was called once after select end date and click on apply button');

            checkEventHandlerArgs(onValueChangedHandler.getCall(0).args[0].event);
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
        assert.deepEqual(this.getCalendar().option('value'), [startCellDate, null], 'calendar value is correct');

        const $okButton = $(this.instance.getStartDateBox().content()).parent().find(`.${POPUP_DONE_BUTTON}`);
        $okButton.trigger('dxclick');

        assert.deepEqual(this.instance.option('value'), [startCellDate, null], 'dateRangeBox value is correct');
        assert.deepEqual(this.startDateBox.option('value'), startCellDate, 'startDateBox value is correct');
        assert.deepEqual(this.endDateBox.option('value'), null, 'endDateBox value is not changed');
        assert.deepEqual(this.getCalendar().option('value'), [startCellDate, null], 'calendar value is correct');
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
            multiView: true,
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
