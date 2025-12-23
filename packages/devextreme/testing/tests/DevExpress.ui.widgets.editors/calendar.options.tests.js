import $ from 'jquery';
import dateUtils from 'core/utils/date';
import { noop } from 'core/utils/common';
import fx from 'common/core/animation/fx';
import Calendar from 'ui/calendar';
import pointerMock from '../../helpers/pointerMock.js';
import keyboardMock from '../../helpers/keyboardMock.js';
import dataUtils from 'core/element_data';
import dateLocalization from 'common/core/localization/date';
import localization from 'localization';

import 'fluent_blue_light.css!';

// calendar
const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const CALENDAR_WEEK_NUMBER_CELL_CLASS = 'dx-calendar-week-number-cell';
const CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS = 'dx-calendar-navigator-previous-view';
const CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS = 'dx-calendar-navigator-next-view';
const CALENDAR_TODAY_BUTTON_CLASS = 'dx-calendar-today-button';
const CALENDAR_CAPTION_BUTTON_CLASS = 'dx-calendar-caption-button';
const CALENDAR_OTHER_VIEW_CLASS = 'dx-calendar-other-view';
const CALENDAR_VIEWS_WRAPPER_CLASS = 'dx-calendar-views-wrapper';

// calendar view
const CALENDAR_SELECTED_DATE_CLASS = 'dx-calendar-selected-date';
const CALENDAR_CELL_IN_RANGE_CLASS = 'dx-calendar-cell-in-range';
const CALENDAR_CELL_RANGE_HOVER_CLASS = 'dx-calendar-cell-range-hover';
const CALENDAR_CELL_RANGE_HOVER_START_CLASS = 'dx-calendar-cell-range-hover-start';
const CALENDAR_CELL_RANGE_HOVER_END_CLASS = 'dx-calendar-cell-range-hover-end';
const CALENDAR_RANGE_START_DATE_CLASS = 'dx-calendar-range-start-date';
const CALENDAR_RANGE_END_DATE_CLASS = 'dx-calendar-range-end-date';

const CALENDAR_DATE_VALUE_KEY = 'dxDateValueKey';

const VIEW_ANIMATION_DURATION = 350;

const ENTER_KEY_CODE = 'Enter';
const PAGE_UP_KEY_CODE = 'PageUp';
const PAGE_DOWN_KEY_CODE = 'PageDown';
const END_KEY_CODE = 'End';
const HOME_KEY_CODE = 'Home';
const LEFT_ARROW_KEY_CODE = 'ArrowLeft';
const UP_ARROW_KEY_CODE = 'ArrowUp';
const RIGHT_ARROW_KEY_CODE = 'ArrowRight';
const DOWN_ARROW_KEY_CODE = 'ArrowDown';

const getBeforeViewInstance = (calendar) => {
    return calendar._beforeView;
};
const getCurrentViewInstance = (calendar) => {
    return calendar._view;
};
const getAdditionalViewInstance = (calendar) => {
    return calendar._additionalView;
};
const getAfterViewInstance = (calendar) => {
    return calendar._afterView;
};

function triggerKeydown($element, key, additionOptions) {
    const options = { key: key };

    $.extend(options, additionOptions);

    const e = $.Event('keydown', options);
    $element.trigger(e);
}

QUnit.module('Options', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.calendar = this.$element.dxCalendar().dxCalendar('instance');

        this.reinit = (options) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('#qunit-fixture');
            this.calendar = this.$element.dxCalendar(options).dxCalendar('instance');
        };
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('changing the \'value\' option must invoke the \'onValueChanged\' action', function(assert) {
        this.reinit({
            onValueChanged: () => {
                assert.ok(true);
            }
        });
        this.calendar.option('value', new Date(2002, 2, 2));
    });

    QUnit.test('firstDayOfWeek option', function(assert) {
        const getFirstWeekDayCell = () => {
            return getCurrentViewInstance(this.calendar).$element().find('th').get(0);
        };

        let $firstWeekDayCell = getFirstWeekDayCell();
        assert.strictEqual($firstWeekDayCell.abbr, 'Sunday', 'first day of week is correct');

        this.calendar.option('firstDayOfWeek', 1);

        $firstWeekDayCell = getFirstWeekDayCell();
        assert.strictEqual($firstWeekDayCell.abbr, 'Monday', 'first day of week is correct after runtime option change');

        this.calendar.option('firstDayOfWeek', 2);

        $firstWeekDayCell = getFirstWeekDayCell();
        assert.strictEqual($firstWeekDayCell.abbr, 'Tuesday', 'first day of week is correct after runtime option change');
    });

    [
        { localeID: 'de', expectedFirstDayOfWeek: 'Montag' },
        { localeID: 'en', expectedFirstDayOfWeek: 'Sunday' },
        { localeID: 'ja', expectedFirstDayOfWeek: '日曜日' },
        // eslint-disable-next-line i18n/no-russian-character
        { localeID: 'ru', expectedFirstDayOfWeek: 'понедельник' },
        { localeID: 'zh', expectedFirstDayOfWeek: '星期日' },
        { localeID: 'hr', expectedFirstDayOfWeek: 'ponedjeljak' },
        { localeID: 'ar', expectedFirstDayOfWeek: 'السبت' },
        { localeID: 'el', expectedFirstDayOfWeek: 'Δευτέρα' },
        { localeID: 'ca', expectedFirstDayOfWeek: 'dilluns' },
    ].forEach(({ localeID, expectedFirstDayOfWeek }) => {
        QUnit.test(`firstDayOfWeek should depend from locale: ${localeID}`, function(assert) {
            const getFirstWeekDayCell = () => {
                return getCurrentViewInstance(this.calendar).$element().find('th').get(0);
            };

            const currentLocale = localization.locale();

            try {
                localization.locale(localeID);

                this.reinit({});

                const $firstWeekDayCell = getFirstWeekDayCell();
                assert.strictEqual($firstWeekDayCell.abbr, expectedFirstDayOfWeek, 'first day of week is correct');
            } finally {
                localization.locale(currentLocale);
            }
        });
    });

    [
        { weekNumberRule: 'auto', firstDayOfWeek: 1, expectedCalls: { firstFourDays: 36, firstDay: 0, fullWeek: 0 } },
        { weekNumberRule: 'auto', firstDayOfWeek: 0, expectedCalls: { firstFourDays: 0, firstDay: 36, fullWeek: 0 } },
        { weekNumberRule: 'auto', firstDayOfWeek: 5, expectedCalls: { firstFourDays: 0, firstDay: 36, fullWeek: 0 } },
        { weekNumberRule: 'firstDay', firstDayOfWeek: 1, expectedCalls: { firstFourDays: 0, firstDay: 36, fullWeek: 0 } },
        { weekNumberRule: 'firstDay', firstDayOfWeek: 0, expectedCalls: { firstFourDays: 0, firstDay: 36, fullWeek: 0 } },
        { weekNumberRule: 'firstDay', firstDayOfWeek: 5, expectedCalls: { firstFourDays: 0, firstDay: 36, fullWeek: 0 } },
        { weekNumberRule: 'firstFourDays', firstDayOfWeek: 1, expectedCalls: { firstFourDays: 36, firstDay: 0, fullWeek: 0 } },
        { weekNumberRule: 'firstFourDays', firstDayOfWeek: 0, expectedCalls: { firstFourDays: 36, firstDay: 0, fullWeek: 0 } },
        { weekNumberRule: 'firstFourDays', firstDayOfWeek: 5, expectedCalls: { firstFourDays: 36, firstDay: 0, fullWeek: 0 } },
        { weekNumberRule: 'fullWeek', firstDayOfWeek: 1, expectedCalls: { firstFourDays: 0, firstDay: 0, fullWeek: 36 } },
        { weekNumberRule: 'fullWeek', firstDayOfWeek: 0, expectedCalls: { firstFourDays: 0, firstDay: 0, fullWeek: 36 } },
        { weekNumberRule: 'fullWeek', firstDayOfWeek: 5, expectedCalls: { firstFourDays: 0, firstDay: 0, fullWeek: 36 } },
    ].forEach(({ weekNumberRule, firstDayOfWeek, expectedCalls }) => {
        QUnit.test(`weekNumberRule option: weekNumberRule="${weekNumberRule}", firstDayOfWeek="${firstDayOfWeek}"`, function(assert) {
            const dateUtilsCallCountMap = {
                firstDay: 0,
                firstFourDays: 0,
                fullWeek: 0
            };
            const getWeekNumberStub = sinon.stub(dateUtils, 'getWeekNumber').callsFake((date, firstDayOfWeek, rule) => {
                dateUtilsCallCountMap[rule]++;
            });

            try {
                this.calendar.option({
                    firstDayOfWeek,
                    weekNumberRule,
                    showWeekNumbers: true,
                    currentDate: new Date(2020, 0, 1),
                });

                ['firstDay', 'firstFourDays', 'fullWeek'].forEach((rule) => {
                    assert.strictEqual(dateUtilsCallCountMap[rule], expectedCalls[rule], `getWeekNumber called ${expectedCalls[rule]} times for ${rule} rule`);
                });
            } finally {
                getWeekNumberStub.restore();
            }
        });
    });

    QUnit.test('dateSerializationFormat option', function(assert) {
        this.calendar.option({
            dateSerializationFormat: 'yyyy-MM-dd',
            currentDate: new Date(2020, 0, 0)
        });

        const $cell = this.$element.find(`.${CALENDAR_CELL_CLASS}`).eq(4);
        $($cell).trigger('dxclick');

        const selectedFormattedValue = '2019-11-28';
        const value = this.calendar.option('value');
        assert.strictEqual(value, selectedFormattedValue, 'value format is correct after dateSerializationFormat option runtime change');
    });

    QUnit.test('cellTemplate option', function(assert) {
        this.calendar.option({
            cellTemplate: function() {
                return 'Custom template';
            },
            currentDate: new Date(2020, 0, 0)
        });

        const $cell = this.$element.find(`.${CALENDAR_CELL_CLASS}`).eq(4);
        const cellContent = $cell.text();

        assert.strictEqual(cellContent, 'Custom template', 'cell content is correct after cellTemplate runtime change');
    });

    QUnit.test('cellTemplate is rendered fow week cell', function(assert) {
        this.calendar.option({
            cellTemplate: function(cellData, cellIndex) {
                return cellIndex === -1 ? 'Week cell template' : `${cellData.text}`;
            },
            value: new Date(2022, 0, 1),
            showWeekNumbers: true
        });

        const $cell = this.$element.find(`.${CALENDAR_WEEK_NUMBER_CELL_CLASS}`).eq(0);
        const cellContent = $cell.text();

        assert.strictEqual(cellContent, 'Week cell template');
    });

    QUnit.test('showTodayButton option', function(assert) {
        const getTodayButton = () => this.$element.find(`.${CALENDAR_TODAY_BUTTON_CLASS}`).get(0);

        this.calendar.option('showTodayButton', true);

        let $todayButton = getTodayButton();
        assert.strictEqual($($todayButton).text(), 'Today', 'todayButton is rendered after showTodayButton runtime change to true');

        this.calendar.option('showTodayButton', false);
        $todayButton = getTodayButton();
        assert.strictEqual($todayButton, undefined, 'todayButton is not rendered after showTodayButton runtime change to false');
    });

    QUnit.test('todayButtonText option initialize', function(assert) {
        const getTodayButton = () => this.$element.find(`.${CALENDAR_TODAY_BUTTON_CLASS}`).get(0);

        this.reinit({
            showTodayButton: true,
            todayButtonText: 'Custom text',
        });

        const $todayButton = getTodayButton();
        assert.strictEqual($($todayButton).text(), 'Custom text', 'todayButton text matches the todayButtonText option');
    });

    QUnit.test('todayButtonText option', function(assert) {
        const getTodayButton = () => this.$element.find(`.${CALENDAR_TODAY_BUTTON_CLASS}`).get(0);

        this.calendar.option({
            showTodayButton: true,
            todayButtonText: 'Custom text',
        });

        const $todayButton = getTodayButton();
        assert.strictEqual($($todayButton).text(), 'Custom text', 'todayButton text matches the todayButtonText option');
    });

    QUnit.test('onCellClick option runtime change', function(assert) {
        const getCellElement = () => this.$element.find(`.${CALENDAR_CELL_CLASS}`).eq(4);

        const firstClickHandler = sinon.spy();
        const secondClickHandler = sinon.spy();

        this.calendar.option({
            currentDate: new Date(2010, 10, 10),
            focusStateEnabled: true,
            onCellClick: firstClickHandler
        });

        $(getCellElement()).trigger('dxclick');
        assert.ok(firstClickHandler.calledOnce, 'firstClickHandler is called once');

        this.calendar.option('onCellClick', secondClickHandler);

        $(getCellElement()).trigger('dxclick');
        assert.ok(secondClickHandler.calledOnce, 'secondClickHandler is called once after onCellClick runtime option change');
    });

    QUnit.test('onCellClick option - subscription by "on" method', function(assert) {
        const getCellElement = () => this.$element.find(`.${CALENDAR_CELL_CLASS}`).eq(4);

        const clickHandler = sinon.spy();

        this.calendar.option({
            currentDate: new Date(2010, 10, 10),
            focusStateEnabled: true
        });
        this.calendar.on('cellClick', clickHandler);

        $(getCellElement()).trigger('dxclick');
        assert.ok(clickHandler.calledOnce, 'cellClick is called');

        this.calendar.off('cellClick', clickHandler);

        $(getCellElement()).trigger('dxclick');
        assert.ok(clickHandler.calledOnce, 'cellClick is not called second time');
    });

    QUnit.test('onContouredChanged option runtime change', function(assert) {
        const firstHandler = sinon.spy();
        const secondHandler = sinon.spy();

        this.reinit({
            value: null,
            onContouredChanged: firstHandler,
            focusStateEnabled: true
        });

        assert.ok(firstHandler.calledOnce, 'first handler has been called');

        this.calendar.option('onContouredChanged', secondHandler);
        this.calendar.focus();
        triggerKeydown($(this.calendar._$viewsWrapper), UP_ARROW_KEY_CODE, { ctrlKey: true });

        assert.ok(secondHandler.calledOnce, 'second handler has been called');
    });

    QUnit.test('onContouredChanged option - subscription by "on" method', function(assert) {
        const goNextView = () => {
            $(this.$element.find(`.${CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS}`)).trigger('dxclick');
        };

        const handler = sinon.spy();
        this.reinit({
            value: null,
            focusStateEnabled: true
        });

        this.calendar.on('contouredChanged', handler);
        goNextView();
        assert.ok(handler.calledOnce, 'handler is called');

        this.calendar.off('contouredChanged', handler);
        goNextView();
        assert.ok(handler.calledOnce, 'handler is not called second time');
    });

    QUnit.test('onCellClick return not \'undefined\' after click on cell', function(assert) {
        const clickHandler = sinon.spy(noop);

        this.reinit({
            currentDate: new Date(2010, 10, 10),
            focusStateEnabled: true,
            onCellClick: clickHandler
        });

        const $cell = this.$element.find(`.${CALENDAR_CELL_CLASS}`).eq(4);
        $($cell).trigger('dxclick');

        assert.ok(clickHandler.calledOnce, 'onCellClick called once');

        const params = clickHandler.getCall(0).args[0];
        assert.ok(params, 'Event params should be passed');
        assert.ok(params.event, 'Event should be passed');
        assert.ok(params.component, 'Component should be passed');
        assert.ok(params.element, 'Element should be passed');
    });

    QUnit.test('onCellClick should not be fired when zoomLevel change required (for datebox integration)', function(assert) {
        const clickSpy = sinon.spy();

        this.reinit({
            onCellClick: clickSpy,
            zoomLevel: 'year',
            maxZoomLevel: 'month'
        });

        const $cell = $(getCurrentViewInstance(this.calendar).$element().find('.' + CALENDAR_CELL_CLASS).eq(3));
        $($cell).trigger('dxclick');

        assert.equal(clickSpy.callCount, 0, 'onCellClick was not fired');
    });

    QUnit.test('Calendar should not allow to select date in disabled state changed in runtime (T196663)', function(assert) {
        this.reinit({
            value: new Date(2013, 11, 15),
            currentDate: new Date(2013, 11, 15)
        });

        this.calendar.option('disabled', true);
        $(this.$element.find('[data-value=\'2013/12/11\']')).trigger('dxclick');
        assert.deepEqual(this.calendar.option('value'), new Date(2013, 11, 15));
    });

    QUnit.test('When initialized without currentDate, calendar must try to infer it from value', function(assert) {
        const date = new Date(2014, 11, 11);

        this.reinit({
            value: new Date(date)
        });

        assert.deepEqual(this.calendar.option('currentDate'), date);
    });

    QUnit.test('calendar view should be changed on the \'currentDate\' option change', function(assert) {
        const calendar = this.calendar;
        const oldDate = getCurrentViewInstance(calendar).option('date');

        calendar.option('currentDate', new Date(2013, 11, 15));
        assert.notDeepEqual(getCurrentViewInstance(calendar).option('date'), oldDate, 'view is changed');
    });

    QUnit.test('contoured date displaying should depend on \'skipFocusCheck\' option', function(assert) {
        this.reinit({
            value: new Date(2015, 10, 18),
            skipFocusCheck: true
        });

        assert.deepEqual(getCurrentViewInstance(this.calendar).option('contouredDate'), new Date(2015, 10, 18), 'view contoured is set');
    });

    QUnit.test('_todayDate option should be passed to calendar view', function(assert) {
        const calendarTodayDate = () => new Date(2021, 1, 1);

        this.reinit({ _todayDate: calendarTodayDate });
        assert.strictEqual(getCurrentViewInstance(this.calendar).option('_todayDate'), calendarTodayDate, '_todayDate is passed to calendar view');
    });

    QUnit.test('_todayDate option should be passed to calendar view after runtime option change', function(assert) {
        const calendarTodayDate = () => new Date(2021, 1, 1);

        this.calendar.option({ _todayDate: calendarTodayDate });
        assert.strictEqual(getCurrentViewInstance(this.calendar).option('_todayDate'), calendarTodayDate, '_todayDate is passed to calendar view');
    });

    QUnit.test('_todayDate should return new Date() if it is not specified', function(assert) {
        const today = new Date();
        const result = this.calendar.option('_todayDate')();

        today.setHours(0, 0, 0, 0);
        result.setHours(0, 0, 0, 0);

        assert.deepEqual(today, result, 'today date is correct');
    });

    QUnit.module('SelectionMode', {
        beforeEach: function() {
            this.options = {
                value: [new Date('01/15/2023'), new Date('02/01/2023'), new Date('02/05/2023')],
            };
        }
    }, () => {
        ['multiple', 'range'].forEach((selectionMode) => {
            QUnit.test(`Date from value option is not selected when selectionMode is ${selectionMode}`, function(assert) {
                this.reinit({
                    ...this.options,
                    selectionMode
                });
                const $cell = this.$element.find('*[data-value="2023/01/07"]');

                assert.notOk($cell.hasClass(CALENDAR_SELECTED_DATE_CLASS));
            });

            [
                {
                    value: [new Date('01/05/2023'), new Date('02/01/2023')],
                    type: 'dates'
                },
                {
                    value: ['01/05/2023', '02/01/2023'],
                    type: 'strings'
                },
                {
                    value: [1672916400000, 1675249200000],
                    type: 'numbers'
                }
            ].forEach(({ value, type }) => {
                QUnit.test(`Two dates are selected when selectionMode = ${selectionMode} and value are defined as ${type}`, function(assert) {
                    this.reinit({
                        selectionMode,
                        value
                    });
                    const $cells = $(getCurrentViewInstance(this.calendar).$element().find(`.${CALENDAR_SELECTED_DATE_CLASS}`));

                    assert.strictEqual($($cells[0]).data('value'), '2023/01/05');
                    assert.strictEqual($($cells[1]).data('value'), '2023/02/01');
                });
            });
        });

        QUnit.module('CurrentDate', {}, () => {
            ['multiple', 'range'].forEach((selectionMode) => {
                QUnit.test(`Should be equal to the lowest defined date in value on init (selectionMode=${selectionMode}`, function(assert) {
                    this.reinit({
                        value: [null, new Date('01/15/2023'), new Date('02/01/2023')],
                        selectionMode
                    });
                    const { currentDate, value } = this.calendar.option();

                    assert.deepEqual(currentDate, new Date(Math.min(...value.filter(value => value))));
                });

                QUnit.test(`Should be equal to the lowest date in value on runtime value change (selectionMode=${selectionMode}`, function(assert) {
                    this.reinit({ selectionMode });
                    this.calendar.option('value', [new Date(), new Date('2020/02/02')]);
                    const { currentDate, value } = this.calendar.option();

                    assert.deepEqual(currentDate, value[1]);
                });

                QUnit.test(`Should be equal to new selected cell date when selectionMode = ${selectionMode}`, function(assert) {
                    this.reinit({
                        ...this.options,
                        selectionMode
                    });
                    const $cell = this.$element.find('*[data-value="2023/01/16"]');

                    $cell.trigger('dxclick');

                    const currentDate = this.calendar.option('currentDate');

                    assert.deepEqual(currentDate, new Date('2023/01/16'));
                });
            });

            QUnit.test('Should be equal to deselected cell date when selectionMode = multiple', function(assert) {
                this.reinit({
                    ...this.options,
                    selectionMode: 'multiple'
                });
                const $cell = this.$element.find('*[data-value="2023/01/15"]');

                $cell.trigger('dxclick');

                const currentDate = this.calendar.option('currentDate');

                assert.deepEqual(currentDate, new Date('2023/01/15'));
            });
        });

        QUnit.module('Multiple', {
            beforeEach: function() {
                this.reinit({
                    ...this.options,
                    selectionMode: 'multiple'
                });
            }
        }, () => {
            QUnit.test('It should be possible to select another value by click', function(assert) {
                const $cell = this.$element.find('*[data-value="2023/01/16"]');

                $cell.trigger('dxclick');

                assert.strictEqual(this.calendar.option('value').length, 4);
                assert.ok($cell.hasClass(CALENDAR_SELECTED_DATE_CLASS));
            });

            QUnit.test('It should be possible to deselect already selected value by click', function(assert) {
                const $cell = $(getCurrentViewInstance(this.calendar).$element().find('*[data-value="2023/01/15"]'));

                $cell.trigger('dxclick');

                assert.strictEqual(this.calendar.option('value').length, 2);
                assert.notOk($cell.hasClass(CALENDAR_SELECTED_DATE_CLASS));
            });
        });

        QUnit.module('Range', {
            beforeEach: function() {
                this.reinit({
                    value: ['2023/01/13', '2023/01/17', '2023/01/20'],
                    selectionMode: 'range'
                });
            }
        }, () => {
            QUnit.test('Only first two dates from value option should be selected', function(assert) {
                const $cell1 = this.$element.find('*[data-value="2023/01/13"]');
                const $cell2 = this.$element.find('*[data-value="2023/01/17"]');
                const $cell3 = this.$element.find('*[data-value="2023/01/20"]');

                assert.ok($cell1.hasClass(CALENDAR_SELECTED_DATE_CLASS));
                assert.ok($cell2.hasClass(CALENDAR_SELECTED_DATE_CLASS));
                assert.notOk($cell3.hasClass(CALENDAR_SELECTED_DATE_CLASS));
            });

            QUnit.test(`Start value cell should have ${CALENDAR_RANGE_START_DATE_CLASS} class`, function(assert) {
                const $cell = $(getCurrentViewInstance(this.calendar).$element().find('*[data-value="2023/01/13"]'));

                assert.ok($cell.hasClass(CALENDAR_RANGE_START_DATE_CLASS));
            });

            QUnit.test(`End value cell should have ${CALENDAR_RANGE_END_DATE_CLASS} class`, function(assert) {
                const $cell = $(getCurrentViewInstance(this.calendar).$element().find('*[data-value="2023/01/17"]'));

                assert.ok($cell.hasClass(CALENDAR_RANGE_END_DATE_CLASS));
            });

            QUnit.test(`Cells between startDate and endDate should have ${CALENDAR_CELL_IN_RANGE_CLASS} class`, function(assert) {
                const $cell = $(getCurrentViewInstance(this.calendar).$element().find('*[data-value="2023/01/15"]'));

                assert.ok($cell.hasClass(CALENDAR_CELL_IN_RANGE_CLASS));
            });


            QUnit.test(`Cells between startDate and endDate should have ${CALENDAR_CELL_IN_RANGE_CLASS} class even after currentDate runtime change (T1253076)`, function(assert) {
                this.reinit({
                    value: ['2025/01/01', '2025/12/31'],
                    selectionMode: 'range',
                    viewsCount: 2,
                });

                this.calendar.option('currentDate', new Date('2025-12-31'));

                const $prevButton = $(this.$element.find(`.${CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS}`));
                $prevButton.trigger('dxclick');

                const $cell = $(getCurrentViewInstance(this.calendar).$element().find('*[data-value="2025/11/01"]'));

                assert.ok($cell.hasClass(CALENDAR_CELL_IN_RANGE_CLASS), 'cell is highlighted');
            });

            QUnit.test('Should reselect startDate and clear endDate on click when both value are defined', function(assert) {
                const expectedValue = [new Date('2023/01/11'), null];
                const $cell = $(getCurrentViewInstance(this.calendar).$element().find('*[data-value="2023/01/11"]'));

                $cell.trigger('dxclick');

                assert.deepEqual(this.calendar.option('value'), expectedValue);
            });

            QUnit.test('Should select endDate on cell click when startDate is alredy defined and endDate not', function(assert) {
                this.reinit({
                    value: ['2023/01/13', null],
                    selectionMode: 'range'
                });
                const expectedValue = [new Date('2023/01/13'), new Date('2023/01/15')];
                const $cell = $(getCurrentViewInstance(this.calendar).$element().find('*[data-value="2023/01/15"]'));

                $cell.trigger('dxclick');

                assert.deepEqual(this.calendar.option('value'), expectedValue);
            });

            QUnit.test('Should swap startDate and endDate on cell when clicked endDate is less then startDate', function(assert) {
                this.reinit({
                    value: ['2023/01/13', null],
                    selectionMode: 'range'
                });
                const expectedValue = [new Date('2023/01/07'), new Date('2023/01/13')];
                const $cell = $(getCurrentViewInstance(this.calendar).$element().find('*[data-value="2023/01/07"]'));

                $cell.trigger('dxclick');

                assert.deepEqual(this.calendar.option('value'), expectedValue);
            });

            [
                {
                    value: [null, null],
                    scenario: 'when both values are not defined'
                },
                {
                    value: ['2023/01/13', '2023/01/17'],
                    scenario: 'when both values are defined'
                }
            ].forEach(({ value, scenario }) => {
                QUnit.test(`Cells should not have ${CALENDAR_CELL_IN_RANGE_CLASS} class on hover ${scenario}`, function(assert) {
                    this.reinit({
                        value,
                        selectionMode: 'range'
                    });
                    const $cell = $(getCurrentViewInstance(this.calendar).$element().find('*[data-value="2023/01/25"]'));

                    $cell.trigger('mouseenter');

                    assert.notOk($cell.hasClass(CALENDAR_CELL_IN_RANGE_CLASS));
                });
            });

            QUnit.test(`Cells should have ${CALENDAR_CELL_RANGE_HOVER_CLASS} class on hover when only startDate is defined`, function(assert) {
                this.reinit({
                    value: ['2023/01/13', null],
                    selectionMode: 'range'
                });

                const getCell = (date) => {
                    return $(getCurrentViewInstance(this.calendar).$element().find(`*[data-value="${date}"]`));
                };

                getCell('2023/01/15').trigger('mouseenter');

                const hoveredRange = getCurrentViewInstance(this.calendar).option('hoveredRange');

                assert.strictEqual(hoveredRange.length, 3, 'hovered range is correct');

                assert.strictEqual(getCell('2023/01/15').hasClass(CALENDAR_CELL_RANGE_HOVER_CLASS), true, `${CALENDAR_CELL_RANGE_HOVER_CLASS} class`);
                assert.strictEqual(getCell('2023/01/15').hasClass(CALENDAR_CELL_RANGE_HOVER_END_CLASS), true, `${CALENDAR_CELL_RANGE_HOVER_END_CLASS} class`);
                assert.strictEqual(getCell('2023/01/15').hasClass(CALENDAR_CELL_RANGE_HOVER_START_CLASS), false, `${CALENDAR_CELL_RANGE_HOVER_START_CLASS} class`);

                assert.strictEqual(getCell('2023/01/14').hasClass(CALENDAR_CELL_RANGE_HOVER_CLASS), true, `${CALENDAR_CELL_RANGE_HOVER_CLASS} class`);
                assert.strictEqual(getCell('2023/01/14').hasClass(CALENDAR_CELL_RANGE_HOVER_END_CLASS), false, `${CALENDAR_CELL_RANGE_HOVER_END_CLASS} class`);
                assert.strictEqual(getCell('2023/01/14').hasClass(CALENDAR_CELL_RANGE_HOVER_START_CLASS), false, `${CALENDAR_CELL_RANGE_HOVER_START_CLASS} class`);

                assert.strictEqual(getCell('2023/01/13').hasClass(CALENDAR_CELL_RANGE_HOVER_CLASS), true, `${CALENDAR_CELL_RANGE_HOVER_CLASS} class`);
                assert.strictEqual(getCell('2023/01/13').hasClass(CALENDAR_CELL_RANGE_HOVER_END_CLASS), false, `${CALENDAR_CELL_RANGE_HOVER_END_CLASS} class`);
                assert.strictEqual(getCell('2023/01/13').hasClass(CALENDAR_CELL_RANGE_HOVER_START_CLASS), true, `${CALENDAR_CELL_RANGE_HOVER_START_CLASS} class`);
            });

            QUnit.test('Hovered range should be cleared after mouseleave on viewsWrapper element', function(assert) {
                this.reinit({
                    value: ['2023/01/13', null],
                    selectionMode: 'range'
                });
                const $cell = $(getCurrentViewInstance(this.calendar).$element().find('*[data-value="2023/01/15"]'));

                $cell.trigger('mouseenter');

                assert.strictEqual(getCurrentViewInstance(this.calendar).option('hoveredRange').length, 3, 'hovered range is correct');

                const $viewsWrapper = $(this.$element.find(`.${CALENDAR_VIEWS_WRAPPER_CLASS}`));

                $viewsWrapper.trigger('mouseleave');

                assert.strictEqual(getCurrentViewInstance(this.calendar).option('hoveredRange').length, 0, 'hovered range is cleared');
            });

            QUnit.test('Selected range should be reduced when difference between startDate and endDate is bigger than four mounths', function(assert) {
                this.reinit({
                    value: ['1996/01/05', '2121/03/07'],
                    selectionMode: 'range',
                });

                const selectedRange = getCurrentViewInstance(this.calendar).option('range');

                assert.ok(selectedRange.length < 240);
            });

            [1, 2].forEach((viewsCount) => {
                QUnit.test(`Big range should start from first date of before view and end on last date of after view (viewsCount=${viewsCount})`, function(assert) {
                    this.reinit({
                        value: ['1996/01/05', '2345/03/07'],
                        selectionMode: 'range',
                        viewsCount,
                    });

                    this.calendar.option('currentDate', new Date('2023/07/24'));

                    const expectedRangeStart = new Date('2023/06/01');
                    const expectedRangeEnd = viewsCount === 1 ? new Date('2023/08/31') : new Date('2023/09/30');
                    const selectedRange = getCurrentViewInstance(this.calendar).option('range');
                    const rangeStart = selectedRange[0];
                    const rangeEnd = selectedRange[selectedRange.length - 1];

                    assert.deepEqual(rangeStart, expectedRangeStart, 'range start date is first date in views');
                    assert.deepEqual(rangeEnd, expectedRangeEnd, 'range end date is last date in views');
                });

                QUnit.test(`Big range should start from start date if start date is date in before view (viewsCount=${viewsCount})`, function(assert) {
                    this.reinit({
                        value: ['1996/01/05', '2345/03/07'],
                        selectionMode: 'range',
                        viewsCount,
                    });

                    this.calendar.option('currentDate', new Date('2023/07/24'));
                    this.calendar.option('currentDate', new Date('1996/02/15'));

                    const expectedRangeStart = new Date('1996/01/05');
                    const expectedRangeEnd = viewsCount === 1 ? new Date('1996/03/31') : new Date('1996/04/30');
                    const selectedRange = getCurrentViewInstance(this.calendar).option('range');
                    const rangeStart = selectedRange[0];
                    const rangeEnd = selectedRange[selectedRange.length - 1];

                    assert.deepEqual(rangeStart, expectedRangeStart, 'range start date is start date');
                    assert.deepEqual(rangeEnd, expectedRangeEnd, 'range end date is last date in views');
                });

                QUnit.test(`Big range should end on end date if end date is date from views (viewsCount=${viewsCount})`, function(assert) {
                    this.reinit({
                        value: ['1996/01/05', '2345/03/07'],
                        selectionMode: 'range',
                        viewsCount,
                    });

                    this.calendar.option('currentDate', new Date('2345/03/15'));

                    const expectedRangeStart = new Date('2345/02/01');
                    const expectedRangeEnd = new Date('2345/03/07');
                    const selectedRange = getCurrentViewInstance(this.calendar).option('range');
                    const rangeStart = selectedRange[0];
                    const rangeEnd = selectedRange[selectedRange.length - 1];

                    assert.deepEqual(rangeStart, expectedRangeStart, 'range start date is first date in views');
                    assert.deepEqual(rangeEnd, expectedRangeEnd, 'range end date is end date');
                });
            });

            [
                [null, null],
                [new Date(2021, 9, 17), null],
                [null, new Date(2021, 10, 25)],
                [new Date(2021, 9, 10), new Date(2021, 9, 17)]
            ].forEach((value) => {
                QUnit.test(`Click by cell should change startDate value if allowChangeSelectionOrder is true and currentSelection is startDate, initial value: ${JSON.stringify(value)}`, function(assert) {
                    this.reinit({
                        value,
                        selectionMode: 'range',
                        allowChangeSelectionOrder: true,
                        currentSelection: 'startDate',
                    });

                    let $startDateCell = $(this.calendar.$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);
                    let startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
                    $startDateCell.trigger('dxclick');

                    assert.deepEqual(this.calendar.option('value'), [startCellDate, value[1]]);

                    $startDateCell = $(this.calendar.$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(15);
                    startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
                    $startDateCell.trigger('dxclick');

                    assert.deepEqual(this.calendar.option('value'), [startCellDate, value[1]]);
                });

                QUnit.test(`Click by cell should change startDate value and reselect endDate if allowChangeSelectionOrder is true and currentSelection is startDate, startDate > endDate, initial value: ${JSON.stringify(value)}`, function(assert) {
                    this.reinit({
                        value,
                        selectionMode: 'range',
                        allowChangeSelectionOrder: true,
                        currentSelection: 'startDate',
                    });

                    const $startDateCell = $(this.calendar.$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(30);
                    const startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
                    $startDateCell.trigger('dxclick');

                    assert.deepEqual(this.calendar.option('value'), [startCellDate, null]);
                });

                QUnit.test(`Click by cell should change endDate value and reselect startDate if allowChangeSelectionOrder is true and currentSelection is endDate, endDate < startDate, initial value: ${JSON.stringify(value)}`, function(assert) {
                    this.reinit({
                        value,
                        selectionMode: 'range',
                        allowChangeSelectionOrder: true,
                        currentSelection: 'endDate',
                    });

                    const $endCellDate = $(this.calendar.$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(7);
                    const endCellDate = dataUtils.data($endCellDate.get(0), CALENDAR_DATE_VALUE_KEY);
                    $endCellDate.trigger('dxclick');

                    assert.deepEqual(this.calendar.option('value'), endCellDate < value[0] ? [endCellDate, null] : [null, endCellDate]);
                });

                QUnit.test(`Click by cell should change endDate value if allowChangeSelectionOrder is true and currentSelection is endDate, initial value: ${JSON.stringify(value)}`, function(assert) {
                    this.reinit({
                        value,
                        selectionMode: 'range',
                        allowChangeSelectionOrder: true,
                        currentSelection: 'endDate',
                    });

                    let $endDateCell = $(this.calendar.$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(25);
                    let endCellDate = dataUtils.data($endDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
                    $endDateCell.trigger('dxclick');

                    assert.deepEqual(this.calendar.option('value'), [value[0], endCellDate]);

                    $endDateCell = $(this.calendar.$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(30);
                    endCellDate = dataUtils.data($endDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
                    $endDateCell.trigger('dxclick');

                    assert.deepEqual(this.calendar.option('value'), [value[0], endCellDate]);
                });

                QUnit.test(`Click by cell should change endDate then startDate value if allowChangeSelectionOrder is true and currentSelection is endDate then startDate, initial value: ${JSON.stringify(value)}`, function(assert) {
                    this.reinit({
                        value,
                        selectionMode: 'range',
                        allowChangeSelectionOrder: true,
                        currentSelection: 'endDate',
                    });

                    const $endDateCell = $(this.calendar.$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(30);
                    const endCellDate = dataUtils.data($endDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
                    $endDateCell.trigger('dxclick');

                    assert.deepEqual(this.calendar.option('value'), [value[0], endCellDate]);

                    this.calendar.option('currentSelection', 'startDate');

                    const $startDateCell = $(this.calendar.$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(10);
                    const startCellDate = dataUtils.data($startDateCell.get(0), CALENDAR_DATE_VALUE_KEY);
                    $startDateCell.trigger('dxclick');

                    assert.deepEqual(this.calendar.option('value'), [startCellDate, endCellDate]);
                });
            });

            QUnit.test('Range should not be displayed on cell hover if only startDate is defined and allowChangeSelectionOrder is true and currentSelection is startDate', function(assert) {
                this.reinit({
                    value: ['2023/04/01', null],
                    selectionMode: 'range',
                    allowChangeSelectionOrder: true,
                    currentSelection: 'startDate',
                });

                const $cellToHover = $(this.calendar.$element()).find(`.${CALENDAR_CELL_CLASS}`).eq(20);

                $cellToHover.trigger('mouseenter');

                assert.notOk($cellToHover.hasClass(CALENDAR_CELL_IN_RANGE_CLASS));
            });
        });

        [
            {
                initialSelectionMode: 'multiple',
                newSelectionMode: 'single',
                optionName: 'value',
                expectedValue: null,
            },
            {
                initialSelectionMode: 'single',
                newSelectionMode: 'range',
                optionName: 'value',
                expectedValue: [null, null],
            },
            {
                initialSelectionMode: 'range',
                newSelectionMode: 'multiple',
                optionName: 'value',
                expectedValue: [],
            },
        ].forEach(({ initialSelectionMode, newSelectionMode, optionName, expectedValue }) => {
            QUnit.test(`Value should be restored after switching from ${initialSelectionMode} to ${newSelectionMode} selectionMode`, function(assert) {
                const value = initialSelectionMode === 'single' ? new Date() : this.options.value;
                this.reinit({
                    value,
                    selectionMode: initialSelectionMode,
                });

                this.calendar.option('selectionMode', newSelectionMode);

                assert.deepEqual(this.calendar.option(optionName), expectedValue);
            });

            QUnit.test(`No cells should be selected after switching from ${initialSelectionMode} to ${newSelectionMode} selectionMode`, function(assert) {
                const value = initialSelectionMode === 'single' ? new Date() : this.options.value;
                this.reinit({
                    value,
                    selectionMode: initialSelectionMode,
                });

                this.calendar.option('selectionMode', newSelectionMode);

                const $cells = $(getCurrentViewInstance(this.calendar).$element().find(`.${CALENDAR_SELECTED_DATE_CLASS}`));

                assert.strictEqual($cells.length, 0);
            });
        });

        QUnit.module('SelectWeekOnClick', {
            beforeEach: function() {
                this.initialValue = ['2023/08/08', '2023/08/16', '2023/08/20'];
            }
        }, () => {
            ['multiple', 'range'].forEach((selectionMode) => {
                ['init', 'runtime'].forEach((scenario) => {
                    QUnit.test(`Click on week number should select week (selectionMode=${selectionMode};selectWeekOnClick=true on ${scenario})`, function(assert) {
                        this.reinit({
                            value: this.initialValue,
                            selectionMode,
                            selectWeekOnClick: scenario === 'init',
                            showWeekNumbers: true,
                        });

                        if(scenario === 'runtime') {
                            this.calendar.option('selectWeekOnClick', true);
                        }

                        const $row = this.$element.find('tr').eq(3);
                        const $weekNumberCell = $row.find(`.${CALENDAR_WEEK_NUMBER_CELL_CLASS}`);
                        const firstDateInRow = dataUtils.data($row.find(`.${CALENDAR_CELL_CLASS}`).first().get(0), CALENDAR_DATE_VALUE_KEY);
                        const lastDateInRow = dataUtils.data($row.find(`.${CALENDAR_CELL_CLASS}`).last().get(0), CALENDAR_DATE_VALUE_KEY);

                        $weekNumberCell.trigger('dxclick');

                        const value = this.calendar.option('value');
                        const expectedValueLength = selectionMode === 'multiple' ? 7 : 2;

                        assert.strictEqual(value.length, expectedValueLength, `${value.length} days are selected`);
                        assert.deepEqual(value[0], firstDateInRow, 'fisrt selected date is first date in row');
                        assert.deepEqual(value[value.length - 1], lastDateInRow, 'last selected date is last date in row');
                    });

                    QUnit.test(`Click on week number should not select week (selectionMode=${selectionMode};selectWeekOnClick=false on ${scenario})`, function(assert) {
                        this.reinit({
                            value: this.initialValue,
                            selectionMode,
                            selectWeekOnClick: scenario !== 'init',
                            showWeekNumbers: true,
                        });

                        if(scenario === 'runtime') {
                            this.calendar.option('selectWeekOnClick', false);
                        }

                        const $row = this.$element.find('tr').eq(3);
                        const $weekNumberCell = $row.find(`.${CALENDAR_WEEK_NUMBER_CELL_CLASS}`);

                        $weekNumberCell.trigger('dxclick');

                        const value = this.calendar.option('value');

                        assert.deepEqual(value, this.initialValue, 'values are not changed');
                    });
                });

                QUnit.test(`Click on week number should select nothing when all dates are disabled (selectionMode=${selectionMode})`, function(assert) {
                    this.reinit({
                        selectionMode,
                        showWeekNumbers: true,
                        disabledDates: () => true,
                    });

                    const $row = this.$element.find('tr').eq(3);
                    const $weekNumberCell = $row.find(`.${CALENDAR_WEEK_NUMBER_CELL_CLASS}`);

                    $weekNumberCell.trigger('dxclick');

                    const value = this.calendar.option('value');
                    const expectedValue = selectionMode === 'range' ? [null, null] : [];

                    assert.deepEqual(value, expectedValue, 'no dates are selected');
                });

                QUnit.test(`Click on week number should not select dates that are less than min/bigger than max (selectionMode=${selectionMode})`, function(assert) {
                    const date = new Date('2023/09/05');
                    this.reinit({
                        selectionMode,
                        showWeekNumbers: true,
                        currentDate: date,
                        min: date,
                        max: date,
                    });

                    const $row = this.$element.find('tr').eq(2);
                    const $weekNumberCell = $row.find(`.${CALENDAR_WEEK_NUMBER_CELL_CLASS}`);

                    $weekNumberCell.trigger('dxclick');

                    const value = this.calendar.option('value');
                    const expectedValue = selectionMode === 'multiple' ? [date] : [date, date];

                    assert.deepEqual(value, expectedValue);
                });
            });

            QUnit.test('Click on week number should not select disabled dates in multiple selectionMode', function(assert) {
                this.reinit({
                    selectionMode: 'multiple',
                    showWeekNumbers: true,
                    disabledDates: ({ date }) => date.getDay() !== 0,
                });

                const $row = this.$element.find('tr').eq(3);
                const $weekNumberCell = $row.find(`.${CALENDAR_WEEK_NUMBER_CELL_CLASS}`);

                $weekNumberCell.trigger('dxclick');

                const value = this.calendar.option('value');

                assert.strictEqual(value.length, 1, 'only one day is selected');
            });

            QUnit.test('Click on week number should select dates correctly when min/max=null (selectionMode=multiple)', function(assert) {
                this.reinit({
                    selectionMode: 'multiple',
                    showWeekNumbers: true,
                    min: null,
                    max: null,
                });

                const $row = this.$element.find('tr').eq(2);
                const $weekNumberCell = $row.find(`.${CALENDAR_WEEK_NUMBER_CELL_CLASS}`);

                $weekNumberCell.trigger('dxclick');

                const valueLength = this.calendar.option('value').length;

                assert.deepEqual(valueLength, 7, 'week is selected');
            });

            QUnit.test('Click on week number should select range from first available date to last available date', function(assert) {
                this.reinit({
                    selectionMode: 'range',
                    showWeekNumbers: true,
                    firstDayOfWeek: 0,
                    disabledDates: ({ date }) => {
                        const day = date.getDay();
                        return day === 0 || day === 6 || day === 3;
                    }
                });

                const $row = this.$element.find('tr').eq(3);
                const $weekNumberCell = $row.find(`.${CALENDAR_WEEK_NUMBER_CELL_CLASS}`);
                const firstDateInRow = dataUtils.data($row.find(`.${CALENDAR_CELL_CLASS}`).first().get(0), CALENDAR_DATE_VALUE_KEY);
                const firstAvailableDateInRow = dataUtils.data($row.find(`.${CALENDAR_CELL_CLASS}`).eq(1).get(0), CALENDAR_DATE_VALUE_KEY);
                const lastDateInRow = dataUtils.data($row.find(`.${CALENDAR_CELL_CLASS}`).last().get(0), CALENDAR_DATE_VALUE_KEY);
                const lastAvailableDateInRow = dataUtils.data($row.find(`.${CALENDAR_CELL_CLASS}`).eq(5).get(0), CALENDAR_DATE_VALUE_KEY);

                $weekNumberCell.trigger('dxclick');

                const value = this.calendar.option('value');

                assert.notDeepEqual(value, [firstDateInRow, lastDateInRow], 'disabled dates are not selected as range start/end');
                assert.deepEqual(value, [firstAvailableDateInRow, lastAvailableDateInRow], 'first/last available dates are range start/end');
            });

            [
                {
                    selectionMode: 'single',
                    selectWeekOnClick: true,
                    expectedCursor: 'auto',
                },
                {
                    selectionMode: 'single',
                    selectWeekOnClick: false,
                    expectedCursor: 'auto',
                },
                {
                    selectionMode: 'multiple',
                    selectWeekOnClick: false,
                    expectedCursor: 'auto',
                },
                {
                    selectionMode: 'range',
                    selectWeekOnClick: false,
                    expectedCursor: 'auto',
                },
                {
                    selectionMode: 'multiple',
                    selectWeekOnClick: true,
                    expectedCursor: 'pointer',
                },
                {
                    selectionMode: 'range',
                    selectWeekOnClick: true,
                    expectedCursor: 'pointer',
                }
            ].forEach(({ selectionMode, selectWeekOnClick, expectedCursor }) => {
                QUnit.test(`Week number should have "cursor: ${expectedCursor}" style (selectionMode=${selectionMode};selectWeekOnClick=${selectWeekOnClick})`, function(assert) {
                    this.reinit({
                        selectionMode,
                        selectWeekOnClick,
                        showWeekNumbers: true,
                    });
                    const cursor = this.$element.find(`.${CALENDAR_WEEK_NUMBER_CELL_CLASS}`).first().css('cursor');

                    assert.strictEqual(cursor, expectedCursor);
                });
            });
        });
    });

    QUnit.module('ViewsCount = 2', {
        beforeEach: function() {
            this.options = {
                focusStateEnabled: true,
                value: [new Date('01/15/2023'), new Date('02/05/2023')],
                selectionMode: 'range',
                viewsCount: 2,
            };
            this.reinit(this.options);
            this.viewWidth = this.calendar._viewWidth();
        }
    }, () => {
        QUnit.test('Calendar should not have additional view after runtime multiview disable', function(assert) {
            this.calendar.option('viewsCount', 1);

            const additionalView = getAdditionalViewInstance(this.calendar);

            assert.notOk(additionalView);
        });

        QUnit.test('Calendar should have additional view after runtime multiview enable', function(assert) {
            this.reinit({
                ...this.options,
                viewsCount: 1
            });

            this.calendar.option('viewsCount', 2);
            const additionalView = getAdditionalViewInstance(this.calendar);

            assert.ok(additionalView, undefined);
        });

        QUnit.test('Click on date in additinal view should not trigger views movement', function(assert) {
            let $cell = $(getAdditionalViewInstance(this.calendar).$element().find('*[data-value="2023/02/16"]'));

            $cell.trigger('dxclick');

            $cell = $(getAdditionalViewInstance(this.calendar).$element().find('*[data-value="2023/02/16"]'));

            assert.strictEqual($cell.length, 1);
        });

        QUnit.test('Click on next month date in additinal view should trigger views movement', function(assert) {
            let $cell = $(getAdditionalViewInstance(this.calendar).$element().find('*[data-value="2023/03/03"]'));

            $cell.trigger('dxclick');

            $cell = $(getAdditionalViewInstance(this.calendar).$element().find('*[data-value="2023/02/16"]'));

            assert.strictEqual($cell.length, 0);
        });

        QUnit.test('contouredDate should be moved to additional view after keyboard moving from the last date on main view', function(assert) {
            const $cell = $(getCurrentViewInstance(this.calendar).$element().find('*[data-value="2023/01/31"]'));
            const keyboard = keyboardMock($(this.calendar._$viewsWrapper));

            $cell.trigger('dxclick');
            keyboard.press('right');

            const viewContouredDate = getCurrentViewInstance(this.calendar).option('contouredDate');
            const additionalViewContouredDate = getAdditionalViewInstance(this.calendar).option('contouredDate');

            assert.strictEqual(viewContouredDate, null);
            assert.deepEqual(additionalViewContouredDate, new Date('2023/02/01'));
        });

        [
            {
                offset: 2,
                button: 'next',
                focusedView: 'main'
            },
            {
                offset: 1,
                button: 'next',
                focusedView: 'additional'
            },
            {
                offset: -1,
                button: 'previous',
                focusedView: 'main'
            },
            {
                offset: -2,
                button: 'previous',
                focusedView: 'additional'
            },
        ].forEach(({ offset, button, focusedView }) => {
            QUnit.test(`Click on ${button} month button should change currentDate on ${offset} months if ${focusedView} view is focused`, function(assert) {
                if(focusedView === 'additional') {
                    const $additionalViewCell = $(getAdditionalViewInstance(this.calendar).$element().find('*[data-value="2023/02/16"]'));

                    $additionalViewCell.trigger('dxclick');
                }

                const currentDate = this.calendar.option('currentDate');
                const navigatorButtonClass = button === 'next' ? CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS : CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS;
                const $navigatorButton = this.$element.find(`.${navigatorButtonClass}`);

                $navigatorButton.trigger('dxclick');

                const newCurrentDate = this.calendar.option('currentDate');
                const expectedCurrentDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));

                assert.deepEqual(newCurrentDate, expectedCurrentDate);
            });
        });


        [
            {
                currentDate: new Date('04/15/2023'),
                offset: 3,
                shouldRefresh: true
            },
            {
                currentDate: new Date('11/15/2022'),
                offset: -2,
                shouldRefresh: true
            },
            {
                currentDate: new Date('03/15/2023'),
                offset: 2,
                shouldRefresh: false
            },
            {
                currentDate: new Date('12/15/2022'),
                offset: -1,
                shouldRefresh: false
            }
        ].forEach(({ currentDate, offset, shouldRefresh }) => {
            QUnit.test(`Views should ${shouldRefresh ? '' : 'not'} be refreshed if currentDate change offset is than ${offset} months`, function(assert) {
                const spy = sinon.spy(this.calendar, '_refreshViews');

                this.calendar.option('currentDate', currentDate);

                assert.strictEqual(spy.calledOnce, shouldRefresh);
            });
        });

        [false, true].forEach((rtlEnabled) => {
            QUnit.test(`Should double currentDate change on ${rtlEnabled ? 'right' : 'left'} swipe if additionalView is active (rtlEnabled=${rtlEnabled})`, function(assert) {
                const calendar = this.calendar;
                calendar.option('rtlEnabled', rtlEnabled);
                const $cell = $(getAdditionalViewInstance(calendar).$element().find('*[data-value="2023/02/16"]'));

                $cell.trigger('dxclick');
                const currentDate = calendar.option('currentDate');
                const pointer = pointerMock(this.$element).start();

                pointer.swipeStart().swipeEnd(0.5 * rtlEnabled ? -1 : 1);

                const expectedCurrentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, currentDate.getDate());
                const newCurrentDate = calendar.option('currentDate');

                assert.deepEqual(newCurrentDate, expectedCurrentDate);
            });
        });
    });
});


QUnit.module('ZoomLevel option', {
    beforeEach: function() {
        fx.off = true;
        this.$element = $('<div>').appendTo('#qunit-fixture');
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('\'zoomLevel\' should have correct value on init if \'maxZoomLevel\' is specified', function(assert) {
        const calendar = this.$element.dxCalendar({
            maxZoomLevel: 'year',
            zoomLevel: 'month'
        }).dxCalendar('instance');

        assert.equal(calendar.option('zoomLevel'), calendar.option('maxZoomLevel'), '\'zoomLevel\' is corrected');
    });

    QUnit.test('view should not be changed down if specified maxZoomLevel is reached', function(assert) {
        const calendar = this.$element.dxCalendar({
            maxZoomLevel: 'year',
            zoomLevel: 'decade'
        }).dxCalendar('instance');

        $(this.$element.find(`.${CALENDAR_CELL_CLASS}`).eq(5)).trigger('dxclick');
        assert.equal(calendar.option('zoomLevel'), 'year', '\'zoomLevel\' changed');

        $(this.$element.find(`.${CALENDAR_CELL_CLASS}`).eq(5)).trigger('dxclick');
        assert.equal(calendar.option('zoomLevel'), 'year', '\'zoomLevel\' did not change');
    });

    QUnit.test('\'zoomLevel\' should be aligned after \'maxZoomLevel\' option change if out of bounds', function(assert) {
        const calendar = this.$element.dxCalendar({
            maxZoomLevel: 'month',
            value: new Date(2015, 2, 15)
        }).dxCalendar('instance');

        $.each(['month', 'year', 'decade', 'century'], (_, type) => {
            calendar.option('maxZoomLevel', type);

            assert.equal(calendar.option('zoomLevel'), type, 'calendar \'zoomLevel\' is correct');
        });
    });

    QUnit.test('\'zoomLevel\' option should not be changed after \'maxZoomLevel\' option change', function(assert) {
        const calendar = this.$element.dxCalendar({
            maxZoomLevel: 'century',
            value: new Date(2015, 2, 15)
        }).dxCalendar('instance');

        $.each(['month', 'year', 'decade', 'century'], (_, type) => {
            calendar.option('maxZoomLevel', type);

            assert.equal(calendar.option('zoomLevel'), 'century', 'calendar \'zoomLevel\' is correct');
        });
    });

    QUnit.test('calendar should get correct value after click on cell of specified maxZoomLevel', function(assert) {
        const calendar = this.$element.dxCalendar({
            maxZoomLevel: 'year',
            value: new Date(2015, 2, 15)
        }).dxCalendar('instance');

        $(this.$element.find(`.${CALENDAR_CELL_CLASS}`).eq(5)).trigger('dxclick');
        assert.deepEqual(calendar.option('value'), new Date(2015, 5, 1), '\'zoomLevel\' changed');

        calendar.option('maxZoomLevel', 'decade');
        $(this.$element.find(`.${CALENDAR_CELL_CLASS}`).eq(5)).trigger('dxclick');
        assert.deepEqual(calendar.option('value'), new Date(2014, 0, 1), '\'zoomLevel\' changed');

        calendar.option('maxZoomLevel', 'century');
        $(this.$element.find(`.${CALENDAR_CELL_CLASS}`).eq(5)).trigger('dxclick');
        assert.deepEqual(calendar.option('value'), new Date(2040, 0, 1), '\'zoomLevel\' changed');
    });

    QUnit.test('do not go up if minZoomLevel is reached', function(assert) {
        const $element = this.$element;
        const instance = $element.dxCalendar().dxCalendar('instance');

        $.each(['month', 'year', 'decade'], (_, type) => {
            instance.option({
                minZoomLevel: type,
                zoomLevel: type
            });

            $(`.${CALENDAR_CAPTION_BUTTON_CLASS}`).trigger('dxclick');
            assert.equal(instance.option('zoomLevel'), type, 'zoom level did not change');
        });
    });

    QUnit.test('\'zoomLevel\' should be aligned after \'minZoomLevel\' option change if out of bounds', function(assert) {
        const $element = this.$element;
        const instance = $element.dxCalendar({
            minZoomLevel: 'century',
            zoomLevel: 'century'
        }).dxCalendar('instance');

        $.each(['decade', 'year', 'month'], (_, type) => {
            instance.option('minZoomLevel', type);
            assert.equal(instance.option('zoomLevel'), type, 'zoom level is changed correctly');
        });
    });

    QUnit.test('cancel change zoomLevel if there is only one cell on new view', function(assert) {
        const calendar = this.$element.dxCalendar({
            maxZoomLevel: 'month',
            min: new Date(2015, 3, 5),
            max: new Date(2015, 3, 25),
            value: new Date(2015, 2, 15)
        }).dxCalendar('instance');

        const $captionButton = this.$element.find(`.${CALENDAR_CAPTION_BUTTON_CLASS}`);

        $($captionButton).trigger('dxclick');
        assert.equal(calendar.option('zoomLevel'), 'month', 'view is not changed (month)');

        calendar.option('zoomLevel', 'year');
        calendar.option('max', new Date(2015, 6, 25));
        $($captionButton).trigger('dxclick');
        assert.equal(calendar.option('zoomLevel'), 'year', 'view is not changed (year)');

        calendar.option('zoomLevel', 'decade');
        calendar.option('max', new Date(2017, 6, 25));
        $($captionButton).trigger('dxclick');
        assert.equal(calendar.option('zoomLevel'), 'decade', 'view is not changed (decade)');
    });

    QUnit.test('change ZoomLevel after click on view cell', function(assert) {
        const $element = this.$element;
        const calendar = $element.dxCalendar({
            zoomLevel: 'century',
            value: new Date(2015, 2, 15)
        }).dxCalendar('instance');

        $.each(['century', 'decade'], (_, type) => {
            calendar.option('zoomLevel', type);

            $($element.find(`.${CALENDAR_CELL_CLASS}`).not(`.${CALENDAR_OTHER_VIEW_CLASS}`).eq(3)).trigger('dxclick');
            assert.notStrictEqual(calendar.option('zoomLevel'), type, 'zoomLevel option view is changed');
        });
    });

    QUnit.test('change ZoomLevel after pressing enter key on view cell', function(assert) {
        const $element = this.$element;
        const calendar = $element.dxCalendar({
            zoomLevel: 'century',
            value: new Date(2015, 2, 15),
            focusStateEnabled: true
        }).dxCalendar('instance');

        $.each(['century', 'decade'], (_, type) => {
            calendar.option('zoomLevel', type);
            calendar.focus();
            triggerKeydown($(calendar._$viewsWrapper), ENTER_KEY_CODE);
            assert.notStrictEqual(calendar.option('zoomLevel'), type, 'zoomLevel option view is changed');
        });
    });

    QUnit.test('change ZoomLevel after click on other view cell', function(assert) {
        const $element = this.$element;
        const calendar = $element.dxCalendar({
            zoomLevel: 'century',
            value: new Date(2015, 2, 15)
        }).dxCalendar('instance');

        $.each(['century', 'decade'], (_, type) => {
            calendar.option('zoomLevel', type);

            $($element.find(`.${CALENDAR_OTHER_VIEW_CLASS}`).first()).trigger('dxclick');
            assert.notStrictEqual(calendar.option('zoomLevel'), type, 'zoomLevel option view is changed');
        });
    });

    QUnit.test('Current view should be set correctly, after click on other view cells', function(assert) {

        const $element = this.$element;
        const calendar = $element.dxCalendar({
            value: new Date(2015, 1, 1),
            zoomLevel: 'decade'
        }).dxCalendar('instance');

        const spy = sinon.spy(calendar, '_navigate');

        try {
            fx.off = false;
            this.clock = sinon.useFakeTimers();
            $($element.find(`.${CALENDAR_CELL_CLASS}`).first()).trigger('dxclick');

            this.clock.tick(1000);

            const navigatorCaptionText = $element.find(`.${CALENDAR_CAPTION_BUTTON_CLASS}`).text();
            const dataCell = $element.find(`.${CALENDAR_CELL_CLASS}`).first().data('value');

            assert.equal(navigatorCaptionText, '2009', 'navigator caption text is correct');
            assert.equal(dataCell, '2009/01/01', 'cell data is correct');
            assert.ok(!spy.called, '_navigate should not be called');
            assert.equal(calendar.option('zoomLevel'), 'year');
        } finally {
            fx.off = true;
            this.clock.restore();
        }
    });

    QUnit.test('Month names should be shown in \'abbreviated\' format when ZoomLevel is Year', function(assert) {
        const getMonthNamesStub = sinon.stub(dateLocalization, 'getMonthNames');

        getMonthNamesStub.returns(['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec']);
        getMonthNamesStub.withArgs('abbreviated').returns(['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro']);

        const calendar = this.$element.dxCalendar({
            zoomLevel: 'year',
            value: new Date(2017, 10, 20)
        }).dxCalendar('instance');

        const $cells = $(getCurrentViewInstance(calendar).$element().find('.dx-calendar-cell'));

        assert.equal($cells.eq(5).text().trim(), 'čvn');
        assert.equal($cells.eq(6).text().trim(), 'čvc');

        getMonthNamesStub.restore();
    });
});


QUnit.module('Min & Max options', {
    beforeEach: function() {
        fx.off = true;

        this.value = new Date(2010, 10, 10);
        this.minDate = new Date(2010, 9, 10);
        this.maxDate = new Date(2010, 11, 10);

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.calendar = this.$element.dxCalendar({
            min: this.minDate,
            value: this.value,
            max: this.maxDate,
            focusStateEnabled: true
        }).dxCalendar('instance');

        this.clock = sinon.useFakeTimers();

        this.reinit = (options) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('#qunit-fixture');
            this.calendar = this.$element.dxCalendar(options).dxCalendar('instance');
        };
    },
    afterEach: function() {
        this.$element.remove();
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    QUnit.test('calendar should not throw error if max date is null', function(assert) {
        assert.expect(0);

        new Calendar('<div>', { value: new Date(2013, 9, 15), firstDayOfWeek: 1, max: null });
    });

    QUnit.test('calendar must pass min and max to the created views', function(assert) {
        assert.deepEqual(getCurrentViewInstance(this.calendar).option('min'), this.minDate);
        assert.deepEqual(getCurrentViewInstance(this.calendar).option('max'), this.maxDate);
    });

    QUnit.test('calendar should not allow to navigate to a date earlier than min and later than max via keyboard events', function(assert) {
        const isAnimationOff = fx.off;
        const animate = fx.animate;

        try {
            let animateCount = 0;

            fx.off = false;

            fx.animate = (...args) => {
                animateCount++;
                return animate.apply(fx, args);
            };

            const minimumCurrentDate = new Date(this.value.getFullYear(), this.value.getMonth() - 1, this.value.getDate());
            const currentDate = new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate());
            const maximumCurrentDate = new Date(this.value.getFullYear(), this.value.getMonth() + 1, this.value.getDate());

            const calendar = this.calendar;
            const $viewsWrapper = $(calendar._$viewsWrapper);

            calendar.focus();

            triggerKeydown($viewsWrapper, PAGE_UP_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), minimumCurrentDate);
            assert.equal(animateCount, 1, 'view is changed with animation after the \'page up\' key press the first time');

            triggerKeydown($viewsWrapper, PAGE_UP_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), minimumCurrentDate);
            assert.equal(animateCount, 1, 'view is not changed after the \'page up\' key press the second time');

            triggerKeydown($viewsWrapper, PAGE_DOWN_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), currentDate);

            triggerKeydown($viewsWrapper, PAGE_DOWN_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), maximumCurrentDate);
            assert.equal(animateCount, 3, 'view is changed with animation after the \'page down\' key press the first time');

            triggerKeydown($viewsWrapper, PAGE_DOWN_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), maximumCurrentDate);
            assert.equal(animateCount, 3, 'view is not changed after the \'page down\' key press the second time');
        } finally {
            fx.off = isAnimationOff;
            fx.animate = animate;
        }
    });

    QUnit.test('calendar should set currentDate to min when setting to an earlier date; and to max when setting to a later date', function(assert) {
        const calendar = this.calendar;
        const min = calendar.option('min');
        const max = calendar.option('max');
        const earlyDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth() - 1, 1);
        const lateDate = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth() + 1, 1);

        calendar.option('currentDate', earlyDate);
        assert.deepEqual(calendar.option('currentDate'), new Date(this.minDate.getFullYear(), this.minDate.getMonth(), min.getDate()));
        calendar.option('currentDate', lateDate);
        assert.deepEqual(calendar.option('currentDate'), new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), max.getDate()));
    });

    QUnit.test('calendar should properly initialize currentDate with respect to min and max', function(assert) {
        this.reinit({
            min: this.minDate,
            max: this.maxDate
        });

        const calendar = this.calendar;
        assert.ok(dateUtils.sameView(calendar.option('zoomLevel'), calendar.option('currentDate'), this.minDate));
    });

    QUnit.test('value should not be changed when min and max options are set', function(assert) {
        const calendar = this.calendar;
        const outOfRangeDate = new Date(2010, 12, 10);

        calendar.option('value', outOfRangeDate);
        assert.equal(calendar.option('value'), outOfRangeDate, 'value is not changed');
    });

    QUnit.test('current date is max month if value is null and range is earlier than today', function(assert) {
        this.reinit({
            min: this.minDate,
            max: this.maxDate,
            currentDate: new Date(2015, 10, 13),
            value: null
        });

        const calendar = this.calendar;

        assert.strictEqual(calendar.option('value'), null, 'value is null');
        assert.deepEqual(calendar.option('currentDate'), new Date(this.maxDate), 'current date is max');
    });

    QUnit.test('change currentDate without navigation if became out of range after max is set', function(assert) {
        this.reinit({
            value: new Date(2015, 5, 16)
        });

        const spy = sinon.spy(this.calendar, '_navigate');
        const max = new Date(2015, 4, 7);

        this.calendar.option('max', max);
        assert.deepEqual(this.calendar.option('currentDate'), max, 'currentDate and max are equal');
        assert.equal(spy.callCount, 0, 'there was no navigation');
        assert.equal(this.$element.find(`.${CALENDAR_CAPTION_BUTTON_CLASS}`).text(), 'May 2015', 'navigator caption is changed');
    });

    QUnit.test('change currentDate without navigation if became out of range after min is set', function(assert) {
        this.reinit({
            value: new Date(2015, 5, 16)
        });

        const spy = sinon.spy(this.calendar, '_navigate');
        const min = new Date(2015, 6, 12);

        this.calendar.option('min', min);
        assert.deepEqual(this.calendar.option('currentDate'), min, 'currentDate and min are equal');
        assert.equal(spy.callCount, 0, 'there was no navigation');
        assert.equal(this.$element.find(`.${CALENDAR_CAPTION_BUTTON_CLASS}`).text(), 'July 2015', 'navigator caption is changed');
    });

    QUnit.test('current date is not changed when min or max option is changed and current value is in range', function(assert) {
        const value = new Date(2015, 0, 27);

        this.reinit({
            min: null,
            max: null,
            value: value
        });

        const calendar = this.calendar;
        const minDate = new Date(value);
        const maxDate = new Date(value);

        minDate.setYear(2014);
        maxDate.setYear(2015);

        assert.deepEqual(calendar.option('currentDate'), value, 'current date and value are the same');

        calendar.option('min', minDate);
        assert.deepEqual(calendar.option('currentDate'), value, 'current date and min are the same after min option is set');
        assert.deepEqual(calendar.option('value'), value, 'value is not changed');

        calendar.option('min', null);
        assert.deepEqual(calendar.option('currentDate'), value, 'current date and value are the same');
        assert.deepEqual(calendar.option('value'), value, 'value is not changed');

        calendar.option('max', maxDate);
        assert.deepEqual(calendar.option('currentDate'), value, 'current date and max are the same after max option is set');
        assert.deepEqual(calendar.option('value'), value, 'value is not changed');
    });

    QUnit.test('T278441 - min date should be 1/1/1000 if the \'min\' option is null', function(assert) {
        const value = new Date(988, 7, 17);

        this.reinit({
            value: value,
            min: null
        });

        assert.deepEqual(this.calendar.option('currentDate'), new Date(1000, 0), 'current date is correct');
    });

    QUnit.test('T278441 - max date should be 31/12/2999 if the \'max\' option is null', function(assert) {
        const value = new Date(3015, 7, 17);

        this.reinit({
            value: value,
            max: null
        });

        assert.deepEqual(this.calendar.option('currentDate'), new Date(3000, 0), 'current date is correct');
    });

    QUnit.test('T266658 - widget should have no views that are out of range', function(assert) {
        this.reinit({
            value: new Date(2015, 8, 8),
            min: new Date(2015, 8, 2),
            max: new Date(2015, 9, 20)
        });

        const calendar = this.calendar;
        const $viewsWrapper = $(calendar.$element().find(`.${CALENDAR_VIEWS_WRAPPER_CLASS}`));

        assert.equal($viewsWrapper.children().length, 2, 'the number of views is correct when current view contain min date');
        assert.ok(!getBeforeViewInstance(calendar), 'there is no after view');

        calendar.option('value', new Date(2015, 9, 15));

        assert.equal($viewsWrapper.children().length, 2, 'the number of views is correct when current view contain max date');
        assert.ok(!getAfterViewInstance(calendar), 'there is no after view');
    });

    QUnit.test('T266658 - widget should have no views that are out of range after navigation', function(assert) {
        this.reinit({
            value: new Date(2015, 9, 8),
            min: new Date(2015, 8, 2),
            max: new Date(2015, 9, 20)
        });

        const calendar = this.calendar;
        const $views = $(calendar.$element().find(`.${CALENDAR_VIEWS_WRAPPER_CLASS}`).children());

        assert.equal($views.length, 2, 'the number of views is correct when current view contain min date');
    });

    QUnit.test('correct views rendering with min option', function(assert) {
        const params = {
            'year': { value: new Date(2015, 0, 8), min: new Date(2014, 11, 16) },
            'decade': { value: new Date(2010, 0, 8), min: new Date(2009, 11, 16) },
            'century': { value: new Date(2000, 0, 8), min: new Date(1999, 11, 16) }
        };

        $.each(['year', 'decade', 'century'], $.proxy((_, type) => {
            this.reinit($.extend({}, params[type], { zoomLevel: type }));

            const $views = this.$element.find(`.${CALENDAR_VIEWS_WRAPPER_CLASS}`).children();
            assert.equal($views.length, 3, 'all three views are rendered');
        }, this));
    });

    QUnit.test('correct views rendering with max option', function(assert) {
        const params = {
            'year': { value: new Date(2015, 11, 8), max: new Date(2016, 0, 16) },
            'decade': { value: new Date(2019, 11, 8), max: new Date(2020, 0, 16) },
            'century': { value: new Date(2099, 11, 8), max: new Date(2100, 0, 16) }
        };

        $.each(['year', 'decade', 'century'], $.proxy((_, type) => {
            this.reinit($.extend({}, params[type], { zoomLevel: type }));

            const $views = this.$element.find(`.${CALENDAR_VIEWS_WRAPPER_CLASS}`).children();
            assert.equal($views.length, 3, 'all three views are rendered');
        }, this));
    });
});


QUnit.module('disabledDates option', {
    beforeEach: function() {
        fx.off = true;

        this.value = new Date(2010, 10, 10);
        this.disabledDates = (args) => {
            const month = args.date.getMonth();

            if(month === 9 || month === 11) {
                return true;
            }
        };

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.calendar = this.$element.dxCalendar({
            disabledDates: this.disabledDates,
            value: this.value,
            focusStateEnabled: true
        }).dxCalendar('instance');

        this.clock = sinon.useFakeTimers();

        this.reinit = (options) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('#qunit-fixture');
            this.calendar = this.$element.dxCalendar(options).dxCalendar('instance');
        };
    },
    afterEach: function() {
        this.$element.remove();
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    QUnit.test('navigating to the disabled month should not skip the month and should focus the current date', function(assert) {
        const isAnimationOff = fx.off;
        const animationSpy = sinon.spy(fx, 'animate');

        try {
            fx.off = false;

            const calendar = this.calendar;
            const $viewsWrapper = $(calendar._$viewsWrapper);

            calendar.focus();

            triggerKeydown($viewsWrapper, PAGE_UP_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), new Date(2010, 9, 10), 'same date has been focused');
            assert.equal(animationSpy.callCount, 1, 'view is changed with animation after the \'page up\' key press the first time');

            triggerKeydown($viewsWrapper, PAGE_UP_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), new Date(2010, 8, 10), 'same date has been focused');
            assert.equal(animationSpy.callCount, 2, 'view is changed after the \'page up\' key press the second time');

            triggerKeydown($viewsWrapper, PAGE_DOWN_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), new Date(2010, 9, 10), 'same date has been focused');
            assert.equal(animationSpy.callCount, 3, 'view is changed with animation after the \'page down\' key press the first time');

            triggerKeydown($viewsWrapper, PAGE_DOWN_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), new Date(2010, 10, 10), 'same date has been focused');
            assert.equal(animationSpy.callCount, 4, 'view is changed with animation after the \'page down\' key press the first time');

            triggerKeydown($viewsWrapper, PAGE_DOWN_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), new Date(2010, 11, 10), 'same date has been focused');
            assert.equal(animationSpy.callCount, 5, 'view is changed after the \'page down\' key press the third time');

            $(this.$element.find(`.${CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS}`)).trigger('dxclick');
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), new Date(2010, 10, 10), 'same date has been focused');
            assert.equal(animationSpy.callCount, 6, 'view is changed after the click on previous arrow on UI');

            $(this.$element.find(`.${CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS}`)).trigger('dxclick');
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), new Date(2010, 11, 10), 'same date has been focused');
            assert.equal(animationSpy.callCount, 7, 'view is changed after the click on next arrow on UI');
        } finally {
            fx.off = isAnimationOff;
            animationSpy.restore();
        }
    });

    QUnit.test('navigating to next/previous month should focus the closest available date and change the view', function(assert) {
        const isAnimationOff = fx.off;
        const animationSpy = sinon.spy(fx, 'animate');

        try {
            const calendar = this.calendar;
            calendar.option({
                value: new Date(2020, 0, 15),
                disabledDates: (args) => {
                    const date = args.date.getDate();
                    const month = args.date.getMonth();
                    return month === 0 && date >= 20 || month === 1 && date < 20;
                }
            });
            const $viewsWrapper = $(calendar._$viewsWrapper);

            fx.off = false;
            animationSpy.resetHistory();

            const lastAvailableDateOnJanuary = new Date(2020, 0, 19);
            const firstAvailableDateOnFebruary = new Date(2020, 1, 20);
            calendar.focus();

            triggerKeydown($viewsWrapper, PAGE_DOWN_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), firstAvailableDateOnFebruary, 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 1, 'view has been changed');

            triggerKeydown($viewsWrapper, PAGE_UP_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), lastAvailableDateOnJanuary, 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 2, 'view has been changed');

            triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE, { ctrlKey: true });
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), firstAvailableDateOnFebruary, 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 3, 'view has been changed');

            triggerKeydown($viewsWrapper, LEFT_ARROW_KEY_CODE, { ctrlKey: true });
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), lastAvailableDateOnJanuary, 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 4, 'view has been changed');

            $(this.$element.find(`.${CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS}`)).trigger('dxclick');
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), firstAvailableDateOnFebruary, 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 5, 'view has been changed');

            $(this.$element.find(`.${CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS}`)).trigger('dxclick');
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), lastAvailableDateOnJanuary, 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 6, 'view has been changed');
        } finally {
            fx.off = isAnimationOff;
            animationSpy.restore();
        }
    });

    QUnit.test('left/right/up/downArrow should focus the closest date on the previous/next month when forced to change the month', function(assert) {
        const isAnimationOff = fx.off;
        const animationSpy = sinon.spy(fx, 'animate');

        try {
            const calendar = this.calendar;

            calendar.option({
                value: new Date(2020, 0, 14),
                disabledDates: (args) => {
                    return args.date.getDate() >= 15 || args.date.getDate() <= 4;
                }
            });
            const $viewsWrapper = $(calendar._$viewsWrapper);

            fx.off = false;
            animationSpy.resetHistory();

            calendar.focus();

            triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), new Date(2020, 1, 5), 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 1, 'view has been changed');

            triggerKeydown($viewsWrapper, LEFT_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), new Date(2020, 0, 14), 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 2, 'view has been changed');

            triggerKeydown($viewsWrapper, DOWN_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), new Date(2020, 1, 11), 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 3, 'view has been changed');

            triggerKeydown($viewsWrapper, UP_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), new Date(2020, 0, 14), 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 4, 'view has been changed');
        } finally {
            fx.off = isAnimationOff;
            animationSpy.restore();
        }
    });

    QUnit.test('left/right/up/downArrow should try focus the date moved by offset in a month', function(assert) {
        const calendar = this.calendar;

        calendar.option({
            value: new Date(2020, 0, 6),
            disabledDates: (args) => {
                const date = args.date.getDate();
                return date > 10 && date < 16 || date === 7 || date === 21;
            }
        });
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.focus();

        triggerKeydown($viewsWrapper, DOWN_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2020, 0, 20), 'closest date by offset has been focused');

        triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2020, 0, 22), 'closest date by offset has been focused');

        triggerKeydown($viewsWrapper, UP_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2020, 0, 8), 'closest date by offset has been focused');

        triggerKeydown($viewsWrapper, LEFT_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2020, 0, 6), 'closest date by offset has been focused');
    });

    QUnit.test('left/right arrows should try focus the month moved by offset in a year view', function(assert) {
        const calendar = this.calendar;

        calendar.option({
            value: new Date(2020, 0, 6),
            zoomLevel: 'year',
            disabledDates: (args) => {
                const month = args.date.getMonth();
                return month % 2;
            }
        });
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.focus();

        triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2020, 2, 6), 'closest month by offset has been focused');

        triggerKeydown($viewsWrapper, LEFT_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2020, 0, 6), 'closest month by offset has been focused');
    });

    QUnit.test('left/right/up/down arrows should try focus the year moved by offset in a decade view', function(assert) {
        const calendar = this.calendar;

        calendar.option({
            value: new Date(2020, 0, 6),
            zoomLevel: 'decade',
            disabledDates: (args) => {
                const year = args.date.getYear();
                return year === 121 || year === 124;
            }
        });
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.focus();

        triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2022, 0, 6), 'closest year by offset has been focused');

        triggerKeydown($viewsWrapper, LEFT_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2020, 0, 6), 'closest year by offset has been focused');

        triggerKeydown($viewsWrapper, DOWN_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2028, 0, 6), 'closest year by offset has been focused');

        triggerKeydown($viewsWrapper, UP_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2020, 0, 6), 'closest year by offset has been focused');
    });

    QUnit.test('left/right/up/down arrows should try focus the decade moved by offset in a century view', function(assert) {
        const calendar = this.calendar;

        calendar.option({
            value: new Date(2000, 0, 6),
            zoomLevel: 'century',
            disabledDates: (args) => {
                const year = args.date.getYear();
                return year >= 110 && year < 120 || year >= 140 && year < 150;
            }
        });
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.focus();

        triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2020, 0, 6), 'closest decade by offset has been focused');

        triggerKeydown($viewsWrapper, LEFT_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2000, 0, 6), 'closest decade by offset has been focused');

        triggerKeydown($viewsWrapper, DOWN_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2080, 0, 6), 'closest decade by offset has been focused');

        triggerKeydown($viewsWrapper, UP_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2000, 0, 6), 'closest decade by offset has been focused');
    });

    QUnit.test('disabled decade/century should not be skipped during navigation', function(assert) {
        const calendar = this.calendar;

        calendar.option({
            value: new Date(2020, 0, 6),
            zoomLevel: 'decade',
            disabledDates: (args) => {
                const view = args.view;
                const year = args.date.getYear();
                if(view === 'decade') {
                    return year >= 130 && year < 140;
                } else if(view === 'century') {
                    return year >= 100 && year < 200;
                }
            }
        });
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.focus();

        triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE, { ctrlKey: true });
        this.clock.tick(VIEW_ANIMATION_DURATION);
        assert.deepEqual(calendar.option('currentDate'), new Date(2030, 0, 6), 'current date is correct');

        triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE);
        this.clock.tick(VIEW_ANIMATION_DURATION);
        assert.deepEqual(calendar.option('currentDate'), new Date(2040, 0, 6), 'current date is correct');

        triggerKeydown($viewsWrapper, UP_ARROW_KEY_CODE, { ctrlKey: true });
        this.clock.tick(VIEW_ANIMATION_DURATION);

        triggerKeydown($viewsWrapper, LEFT_ARROW_KEY_CODE);
        this.clock.tick(VIEW_ANIMATION_DURATION);
        assert.deepEqual(calendar.option('currentDate'), new Date(1940, 0, 6), 'current date is correct');
    });

    QUnit.test('up/down arrows should try focus the month moved by offset in a year view', function(assert) {
        const calendar = this.calendar;

        calendar.option({
            value: new Date(2020, 4, 6),
            zoomLevel: 'year',
            disabledDates: (args) => {
                const month = args.date.getMonth();
                return month < 4 || month > 7;
            }
        });
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.focus();

        triggerKeydown($viewsWrapper, UP_ARROW_KEY_CODE);
        this.clock.tick(VIEW_ANIMATION_DURATION);
        assert.deepEqual(calendar.option('currentDate'), new Date(2019, 4, 6), 'closest month by offset has been focused');

        triggerKeydown($viewsWrapper, DOWN_ARROW_KEY_CODE);
        this.clock.tick(VIEW_ANIMATION_DURATION);
        assert.deepEqual(calendar.option('currentDate'), new Date(2020, 4, 6), 'closest month by offset has been focused');
    });

    QUnit.test('zoomLevel option change should focus the closest available date', function(assert) {
        const calendar = this.calendar;

        calendar.option({
            value: new Date(2020, 0, 6),
            zoomLevel: 'year',
            disabledDates: (args) => {
                const year = args.date.getYear();
                const date = args.date.getDate();

                if(args.view === 'decade') {
                    return year === 120;
                }

                return date === 6;
            }
        });
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.focus();

        triggerKeydown($viewsWrapper, DOWN_ARROW_KEY_CODE, { ctrlKey: true });
        this.clock.tick(VIEW_ANIMATION_DURATION);
        assert.deepEqual(calendar.option('currentDate'), new Date(2020, 0, 7), 'closest date has been focused');

        triggerKeydown($viewsWrapper, UP_ARROW_KEY_CODE, { ctrlKey: true });
        this.clock.tick(VIEW_ANIMATION_DURATION);

        triggerKeydown($viewsWrapper, UP_ARROW_KEY_CODE, { ctrlKey: true });
        this.clock.tick(VIEW_ANIMATION_DURATION);

        assert.deepEqual(calendar.option('currentDate'), new Date(2021, 0, 7), 'closest date has been focused');
    });

    QUnit.test('zoomLevel option change should contour the current view even if current date has not been changed', function(assert) {
        const currentDate = new Date(2020, 0, 6);
        const calendar = this.calendar;
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.option({
            value: currentDate,
        });

        calendar.focus();

        triggerKeydown($viewsWrapper, UP_ARROW_KEY_CODE, { ctrlKey: true });
        this.clock.tick(VIEW_ANIMATION_DURATION);
        assert.deepEqual(calendar.option('currentDate'), currentDate, 'currentDate has not been changed');
        assert.deepEqual(calendar._view.option('contouredDate'), currentDate, 'contoured date is correct');
    });

    QUnit.test('left/right/up/downArrow should work like pageUp/Down when navigating to the disabled month', function(assert) {
        const isAnimationOff = fx.off;
        const animationSpy = sinon.spy(fx, 'animate');

        try {
            const currentDateOnJanuary = new Date(2020, 0, 15);
            const currentDateOnFebruary = new Date(2020, 1, 15);
            const currentDateOnMarch = new Date(2020, 2, 15);
            const currentDateOnApril = new Date(2020, 3, 15);
            const calendar = this.calendar;

            calendar.option({
                value: currentDateOnJanuary,
                disabledDates: (args) => {
                    const month = args.date.getMonth();
                    return month === 1 || month === 2;
                }
            });
            const $viewsWrapper = $(calendar._$viewsWrapper);

            fx.off = false;
            animationSpy.resetHistory();

            calendar.focus();

            triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE, { ctrlKey: true });
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), currentDateOnFebruary, 'the same date has been focused');
            assert.equal(animationSpy.callCount, 1, 'view has been changed');

            triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), currentDateOnMarch, 'the same date has been focused');
            assert.equal(animationSpy.callCount, 2, 'view has been changed');

            triggerKeydown($viewsWrapper, DOWN_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), currentDateOnApril, 'the same date has been focused');
            assert.equal(animationSpy.callCount, 3, 'view has been changed');

            triggerKeydown($viewsWrapper, LEFT_ARROW_KEY_CODE, { ctrlKey: true });
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), currentDateOnMarch, 'the same date has been focused');
            assert.equal(animationSpy.callCount, 4, 'view has been changed');

            triggerKeydown($viewsWrapper, LEFT_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), currentDateOnFebruary, 'the same date has been focused');
            assert.equal(animationSpy.callCount, 5, 'view has been changed');

            triggerKeydown($viewsWrapper, UP_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), currentDateOnJanuary, 'the same date has been focused');
            assert.equal(animationSpy.callCount, 6, 'view has been changed');

        } finally {
            fx.off = isAnimationOff;
            animationSpy.restore();
        }
    });

    QUnit.test('calendar should properly set the first and the last available cells', function(assert) {
        this.reinit({
            disabledDates: (args) => {
                const disabledDays = [1, 2, 28, 30];
                if(disabledDays.indexOf(args.date.getDate()) > -1) {
                    return true;
                }
            },
            value: this.value,
            focusStateEnabled: true
        });
        const calendar = this.calendar;
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.focus();

        triggerKeydown($viewsWrapper, HOME_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2010, 10, 3));

        triggerKeydown($viewsWrapper, END_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2010, 10, 29));
    });

    QUnit.test('home/end keys should not do anything if all dates in the current month are disabled', function(assert) {
        const calendar = this.calendar;
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.option('value', new Date(2010, 11, 10));

        calendar.focus();

        triggerKeydown($viewsWrapper, HOME_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), this.calendar.option('value'));

        triggerKeydown($viewsWrapper, END_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), this.calendar.option('value'));
    });

    QUnit.test('enter key should not change selected value if focused date is disabled', function(assert) {
        const startDate = new Date(2020, 0, 6);
        const calendar = this.calendar;

        calendar.option({
            value: startDate,
            disabledDates: (args) => {
                return args.date.getMonth() === 1;
            }
        });
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.focus();

        triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE, { ctrlKey: true });
        this.clock.tick(VIEW_ANIMATION_DURATION);
        assert.deepEqual(calendar.option('currentDate'), new Date(2020, 1, 6), 'current date is correct');

        triggerKeydown($viewsWrapper, ENTER_KEY_CODE);
        assert.deepEqual(calendar.option('value'), startDate, 'selected value has not been changed');
    });

    QUnit.test('enter key should change selected value if focused date is not disabled', function(assert) {
        const startDate = new Date(2020, 0, 6);
        const newDate = new Date(2020, 1, 6);
        const calendar = this.calendar;
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.option({
            value: startDate,
        });

        calendar.focus();

        triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE, { ctrlKey: true });

        assert.deepEqual(calendar.option('currentDate'), newDate, 'current date has been changed');
        assert.deepEqual(calendar.option('value'), startDate, 'selected value is correct');

        triggerKeydown($viewsWrapper, ENTER_KEY_CODE);

        assert.deepEqual(calendar.option('currentDate'), newDate, 'current date is correct');
        assert.deepEqual(calendar.option('value'), newDate, 'selected value has been changed');
    });

    QUnit.test('home/end keys should focus the first/last available date in the current month', function(assert) {
        const calendar = this.calendar;

        calendar.option({
            value: new Date(2020, 0, 15),
            disabledDates: (args) => {
                const date = args.date.getDate();
                return date <= 7 || date >= 23;
            }
        });
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.focus();

        triggerKeydown($viewsWrapper, HOME_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2020, 0, 8));

        triggerKeydown($viewsWrapper, END_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2020, 0, 22));
    });

    QUnit.test('the focused date should always be in the [min, max] range', function(assert) {
        const isAnimationOff = fx.off;
        const animationSpy = sinon.spy(fx, 'animate');

        try {
            const calendar = this.calendar;

            calendar.option({
                value: new Date(2020, 0, 25),
                disabledDates: (args) => {
                    const date = args.date.getDate();
                    return date >= 5 && date <= 20;
                },
                max: new Date(2020, 1, 20),
                min: new Date(2020, 0, 25)
            });
            const $viewsWrapper = $(calendar._$viewsWrapper);

            fx.off = false;
            animationSpy.resetHistory();

            calendar.focus();

            triggerKeydown($viewsWrapper, PAGE_DOWN_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), new Date(2020, 1, 4), 'focused date is in the range (min, max)');
            assert.equal(animationSpy.callCount, 1, 'view has been changed');

            triggerKeydown($viewsWrapper, PAGE_UP_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), new Date(2020, 0, 25), 'focused date is in the range (min, max)');
            assert.equal(animationSpy.callCount, 2, 'view has been changed');

        } finally {
            fx.off = isAnimationOff;
            animationSpy.restore();
        }
    });

    QUnit.test('up/downArrow should try focus the same date in the next/previous month when the column is disabled', function(assert) {
        const isAnimationOff = fx.off;
        const animationSpy = sinon.spy(fx, 'animate');

        try {
            const calendar = this.calendar;

            calendar.option({
                value: new Date(2020, 1, 5),
                disabledDates: (args) => {
                    const day = args.date.getDay();
                    const month = args.date.getMonth();
                    const date = args.date.getDate();
                    return month === 0 && day === 3 || month === 1 && day === 0 || month === 0 && day === 0 && date !== 5;
                }
            });
            const $viewsWrapper = $(calendar._$viewsWrapper);

            fx.off = false;
            animationSpy.resetHistory();

            calendar.focus();

            triggerKeydown($viewsWrapper, UP_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), new Date(2020, 0, 5), 'the closest available date has been focused');
            assert.equal(animationSpy.callCount, 1, 'view has been changed');

            triggerKeydown($viewsWrapper, DOWN_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(calendar.option('currentDate'), new Date(2020, 1, 5), 'the closest available date has been focused');
            assert.equal(animationSpy.callCount, 2, 'view has been changed');

        } finally {
            fx.off = isAnimationOff;
            animationSpy.restore();
        }
    });

    QUnit.test('calendar should properly initialize currentDate when initial value is disabled', function(assert) {
        this.reinit({
            disabledDates: (args) => {
                if(args.date.valueOf() === new Date(2010, 10, 10).valueOf()) {
                    return true;
                }
            },
            value: this.value,
            focusStateEnabled: true
        });

        const calendar = this.calendar;
        assert.ok(dateUtils.sameView(calendar.option('zoomLevel'), calendar.option('currentDate'), new Date(2010, 10, 11)));
    });

    QUnit.test('arrowUp/Down should focus cell on top/bottom', function(assert) {
        const calendar = this.calendar;

        calendar.option({
            disabledDates: (args) => {
                return args.date.getDate() === 15 || args.date.getDate() === 11;
            },
            value: new Date(2020, 0, 16)
        });
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.focus();

        triggerKeydown($viewsWrapper, UP_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2020, 0, 9), 'cell on top has been focused');

        triggerKeydown($viewsWrapper, DOWN_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2020, 0, 16), 'cell on bottom has been focused');
    });

    QUnit.test('value can be changed to disabled date', function(assert) {
        const calendar = this.calendar;
        const disabledDate = new Date(2010, 9, 10);

        calendar.option('value', disabledDate);
        assert.strictEqual(calendar.option('value'), disabledDate, 'value is changed');
    });

    QUnit.test('disabledDates argument contains correct component parameter', function(assert) {
        const stub = sinon.stub();

        this.reinit({
            disabledDates: stub,
            value: this.value,
            focusStateEnabled: true
        });

        const component = stub.lastCall.args[0].component;
        assert.equal(component.NAME, 'dxCalendar', 'Correct component');
    });

    QUnit.test('current day should be the same as selected on init when current month is disabled', function(assert) {
        this.calendar.option('value', new Date(2010, 11, 10));

        assert.deepEqual(this.calendar.option('currentDate'), this.calendar.option('value'), 'currentDate is the same as selected date');
    });

    QUnit.test('current day should be set to the closest available date on init when there is available date on the current month', function(assert) {
        this.calendar.option({
            value: new Date(2010, 10, 14),
            disabledDates: (args) => {
                return args.date.getDate() > 10 && args.date.getDate() <= 20;
            }
        });

        assert.deepEqual(this.calendar.option('currentDate'), new Date(2010, 10, 10), 'currentDate is the closest available date');
    });

    QUnit.test('It should not be possible to focus dates that are disabled using combination of disabledDates+min/max', function(assert) {
        const calendar = this.calendar;

        calendar.option({
            value: new Date('2023/09/11'),
            max: new Date('2023/09/16'),
            min: new Date('2023/09/10'),
            disabledDates: (d) => {
                const day = d.date.getDay();

                return d.view === 'month' && day === 0 || day === 6;
            },
        });
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.focus();

        triggerKeydown($viewsWrapper, LEFT_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date('2023/09/11'), 'left disabledDate is not focused');

        calendar.option('value', new Date('2023/09/15'));

        triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date('2023/09/15'), 'right disabledDate is not focused');
    });
});
