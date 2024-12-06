import $ from 'jquery';
import { noop } from 'core/utils/common';
import dateUtils from 'core/utils/date';
import BaseView from '__internal/ui/calendar/m_calendar.base_view';
import Views from '__internal/ui/calendar/m_calendar.views';
import pointerMock from '../../helpers/pointerMock.js';
import fx from 'common/core/animation/fx';
import dateSerialization from 'core/utils/date_serialization';
import dateLocalization from 'common/core/localization/date';
import messageLocalization from 'common/core/localization/message';

import 'ui/calendar';

const CALENDAR_EMPTY_CELL_CLASS = 'dx-calendar-empty-cell';
const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const CALENDAR_SELECTED_DATE_CLASS = 'dx-calendar-selected-date';
const CALENDAR_CONTOURED_DATE_CLASS = 'dx-calendar-contoured-date';
const CALENDAR_WEEK_NUMBER_CELL_CLASS = 'dx-calendar-week-number-cell';
const CALENDAR_CELL_TODAY_CLASS = 'dx-calendar-today';

const UP_ARROW_KEY_CODE = 'ArrowUp';
const DOWN_ARROW_KEY_CODE = 'ArrowDown';

const CURRENT_DATE_TEXT = {
    month: messageLocalization.format('dxCalendar-currentDay'),
    year: messageLocalization.format('dxCalendar-currentMonth'),
    decade: messageLocalization.format('dxCalendar-currentYear'),
    century: messageLocalization.format('dxCalendar-currentYearRange'),
};

const getShortDate = function(date) {
    return dateSerialization.serializeDate(date, dateUtils.getShortDateFormat());
};

function triggerKeydown(key, $element) {
    const e = $.Event('keydown', { key: key });
    $element.find('table').trigger(e);
}


const FakeView = BaseView.inherit({
    _isTodayCell: noop,
    _isDateOutOfRange: function() {
        return false;
    },
    _isOtherView: noop,
    _getCellText: noop,
    _getFirstCellData: noop,
    _getNextCellData: noop,
    _getCellByDate: noop,
    _renderWeekNumberCell: noop,
    isBoundary: noop,
    _renderValue: noop,
    _isStartDayOfMonth: noop,
    _isEndDayOfMonth: noop,
});


QUnit.module('Basics', () => {
    QUnit.test('no contouredDate is set by default', function(assert) {
        const $element = $('<div>').appendTo('#qunit-fixture');

        try {
            const view = new FakeView($element, {});
            assert.equal(view.option('contouredDate'), null, 'contoured Date is null');
        } finally {
            $element.remove();
        }
    });

    QUnit.test('onCellClick should not be fired on out of range cells', function(assert) {
        const $element = $('<div>').appendTo('#qunit-fixture');

        try {
            const spy = sinon.spy();
            new FakeView($element, {
                onCellClick: spy
            });

            $element.find('.' + CALENDAR_CELL_CLASS).addClass(CALENDAR_EMPTY_CELL_CLASS);
            $element.find('.' + CALENDAR_CELL_CLASS).eq(5).trigger('dxclick');
            assert.equal(spy.callCount, 0, 'onCellClick was not called');
        } finally {
            $element.remove();
        }
    });

    QUnit.test('Calendar should set first day by firstDayOfWeek option if it is setted and this is different in localization', function(assert) {
        const $element = $('<div>').appendTo('#qunit-fixture');
        const spy = sinon.spy(dateLocalization, 'firstDayOfWeekIndex');

        this.view = new Views['month']($element, {
            date: new Date(2017, 11, 11),
            firstDayOfWeek: 0
        });

        assert.notOk(spy.called, 'firstDayOfWeekIndex wasn\'t called');
        $element.remove();
    });
});

QUnit.module('MonthView', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['month'](this.$element, {
            date: new Date(2013, 9, 16),
            firstDayOfWeek: 1,
            focusStateEnabled: true,
        });
    },
    reinit: function(options) {
        this.$element.remove();
        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['month'](this.$element, options);
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('onCellClick action should be fired on cell click', function(assert) {
        const $element = $('<div>').appendTo('#qunit-fixture');

        try {
            const spy = sinon.spy();

            this.reinit({
                showWeekNumbers: true,
                onCellClick: spy,
                weekNumberRule: 'firstDay',
            });

            this.$element.find('td').eq(4).trigger('dxclick');
            assert.ok(spy.calledOnce, 'onCellClick fired once');
        } finally {
            $element.remove();
        }
    });

    QUnit.test('getNavigatorCaption must return a proper caption', function(assert) {
        assert.equal(this.view.getNavigatorCaption(), 'October 2013', 'caption is correct');
    });

    QUnit.test('getNavigatorCaption must return a proper caption in RTL mode', function(assert) {
        this.view.option('rtlEnabled', true);
        assert.equal(this.view.getNavigatorCaption(), 'October 2013', 'caption is correct');
    });

    QUnit.test('change value option must add a CSS class to a cell', function(assert) {
        const secondDate = new Date(2013, 9, 1);
        const secondDateCell = this.$element.find('table').find('td').eq(1);
        this.view.option('value', secondDate);
        assert.ok(secondDateCell.hasClass(CALENDAR_SELECTED_DATE_CLASS));
    });

    QUnit.test('it should be possible to specify contouredDate via the constructor', function(assert) {
        const date = new Date(2013, 9, 1);
        this.reinit({
            date: new Date(2013, 9, 16),
            contouredDate: date
        });

        assert.strictEqual(this.view.option('contouredDate'), date);
    });

    QUnit.test('changing contouredDate must add CALENDAR_CONTOURED_DATE_CLASS class to a cell', function(assert) {
        const date = new Date(2013, 9, 1);
        const dateCell = this.$element.find('table').find('td').eq(1);

        this.view.option('contouredDate', date);
        assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
    });

    QUnit.test('changing contouredDate must remove CALENDAR_CONTOURED_DATE_CLASS class from the old cell', function(assert) {
        const date = new Date(2013, 9, 1);
        const newDate = new Date(2013, 9, 2);
        const dateCell = this.$element.find('table').find('td').eq(1);

        this.view.option('contouredDate', date);
        assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));

        this.view.option('contouredDate', newDate);
        assert.ok(!dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
    });

    QUnit.test('if option.disabled is set in a constructor, cells should not be clickable', function(assert) {
        assert.expect(0);

        this.reinit({
            disabled: true
        });

        this.view.cellClickHandler = function() { assert.ok(false); };

        const date = this.$element.find('table').find('td')[0];
        pointerMock(date).click();
    });

    QUnit.test('cell data-value has correct year after render in month view for the first century (T929559)', function(assert) {
        const startDate = new Date(2013, 9, 16);
        startDate.setFullYear(14);

        this.reinit({
            min: new Date(-10, 1, 1),
            value: startDate,
            date: startDate
        });

        const dateCell = this.$element.find('table').find('td').eq(7);
        const cellDate = $(dateCell).data().value;

        assert.strictEqual(cellDate.substring(0, 4), '0014');
    });

    QUnit.test('onCellClick should not be fired on week number cells', function(assert) {
        const clickHandler = sinon.spy(noop);

        this.reinit({
            currentDate: new Date(2010, 10, 10),
            focusStateEnabled: true,
            showWeekNumbers: true,
            zoomLevel: 'month',
            onCellClick: clickHandler
        });

        const $weekCell = this.$element.find(`.${CALENDAR_WEEK_NUMBER_CELL_CLASS}`);
        assert.strictEqual($weekCell.length, 6, 'week cells count');

        $($weekCell.eq(2)).trigger('dxclick');

        assert.strictEqual(clickHandler.callCount, 0, 'onCellClick was not called');
    });

    [
        { currentDate: new Date(2012, 0, 1), expectedWeekNumbers: [52, 1, 2, 3, 4, 5] },
        { currentDate: new Date(2007, 0, 1), expectedWeekNumbers: [52, 1, 2, 3, 4, 5] },
        { currentDate: new Date(2007, 11, 31), expectedWeekNumbers: [48, 49, 50, 51, 52, 1] },
        { currentDate: new Date(2002, 11, 31), expectedWeekNumbers: [48, 49, 50, 51, 52, 1] },
        { currentDate: new Date(2008, 11, 29), expectedWeekNumbers: [48, 49, 50, 51, 52, 1] },
        { currentDate: new Date(2009, 11, 28), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2010, 11, 27), expectedWeekNumbers: [48, 49, 50, 51, 52, 1] },
        // 53
        { currentDate: new Date(2004, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2009, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2015, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2020, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2026, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2032, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2037, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2043, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2048, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2054, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2060, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2065, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2071, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2076, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2082, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2088, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2093, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2099, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2105, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2111, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2116, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2122, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2128, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2133, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2139, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2144, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2150, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2156, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2161, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2167, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2172, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2178, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2184, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2189, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2195, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2201, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2207, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2212, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2218, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2224, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2229, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2235, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2240, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2246, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2252, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2257, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2263, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2268, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2274, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2280, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2285, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2291, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2296, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2303, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2308, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2314, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2320, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2325, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2331, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2336, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2342, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2348, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2353, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2359, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2364, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2370, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2376, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2381, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2387, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2392, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
        { currentDate: new Date(2398, 11, 31), expectedWeekNumbers: [49, 50, 51, 52, 53, 1] },
    ].forEach(({ currentDate, expectedWeekNumbers }) => {
        QUnit.test(`iso week numbers of 'month' view with date: ${currentDate.toLocaleDateString()}`, function(assert) {
            this.reinit({
                value: currentDate,
                date: currentDate,
                showWeekNumbers: true,
                weekNumberRule: 'firstFourDays',
                firstDayOfWeek: 1,
                zoomLevel: 'month',
            });

            const $weekCell = this.$element.find(`.${CALENDAR_WEEK_NUMBER_CELL_CLASS}`);
            const actualWeekNumbers = $weekCell.map(function() {
                return Number($(this).text());
            }).get();

            assert.deepEqual(actualWeekNumbers, expectedWeekNumbers, 'week cell numbers');
        });
    });

    [0, 1, 2, 3, 4, 5, 6].forEach((firstDayOfWeek) => {
        QUnit.test(`count years with iso week 53, firstDayOfWeek: ${firstDayOfWeek}`, function(assert) {
            let count = 0;

            for(let i = 0; i < 400; i++) {
                this.reinit({
                    value: new Date(2000 + i, 11, 31),
                    date: new Date(2000 + i, 11, 31),
                    showWeekNumbers: true,
                    weekNumberRule: 'firstFourDays',
                    firstDayOfWeek,
                    zoomLevel: 'month',
                });

                const $weekCell = this.$element.find(`.${CALENDAR_WEEK_NUMBER_CELL_CLASS}`);
                const actualWeekNumbers = $weekCell.map(function() {
                    return Number($(this).text());
                }).get();

                if(actualWeekNumbers.indexOf(53) !== -1) {
                    count++;
                }
            }
            assert.equal(count, 71, 'Should have 71 years with iso week 53');
        });

        QUnit.test(`count years with iso week 53, firstDayOfWeek: ${firstDayOfWeek}`, function(assert) {
            let count = 0;

            for(let i = 0; i < 400; i++) {
                this.reinit({
                    value: new Date(2001 + i, 0, 1),
                    date: new Date(2001 + i, 0, 1),
                    showWeekNumbers: true,
                    weekNumberRule: 'firstFourDays',
                    firstDayOfWeek,
                    zoomLevel: 'month',
                });

                const $weekCell = this.$element.find(`.${CALENDAR_WEEK_NUMBER_CELL_CLASS}`);
                const actualWeekNumbers = $weekCell.map(function() {
                    return Number($(this).text());
                }).get();

                if(actualWeekNumbers.indexOf(53) !== -1 || (dateUtils.getWeekNumber(new Date(2000 + i, 11, 31), firstDayOfWeek, 'firstFourDays') === 53 && actualWeekNumbers[0] === 1)) {
                    count++;
                }
            }
            assert.equal(count, 71, 'Should have 71 years with iso week 53');
        });

        QUnit.test(`count years with iso week 52, firstDayOfWeek: ${firstDayOfWeek}`, function(assert) {
            let count = 0;

            for(let i = 0; i < 400; i++) {
                this.reinit({
                    value: new Date(2000 + i, 11, 31),
                    date: new Date(2000 + i, 11, 31),
                    showWeekNumbers: true,
                    weekNumberRule: 'firstFourDays',
                    firstDayOfWeek,
                    zoomLevel: 'month',
                });

                const $weekCell = this.$element.find(`.${CALENDAR_WEEK_NUMBER_CELL_CLASS}`);
                const actualWeekNumbers = $weekCell.map(function() {
                    return Number($(this).text());
                }).get();

                if(actualWeekNumbers.indexOf(53) === -1) {
                    count++;
                }
            }
            assert.equal(count, 329, 'Should have 329 years with iso week 52');
        });
    });
});

QUnit.module('YearView', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['year'](this.$element, {
            date: new Date(2013, 9, 16),
            firstDayOfWeek: 1,
            focusStateEnabled: true
        });
    },
    reinit: function(options) {
        this.$element.remove();
        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['year'](this.$element, options);
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('getNavigatorCaption must return a proper caption', function(assert) {
        assert.strictEqual(this.view.getNavigatorCaption().toString(), '2013');
    });

    QUnit.test('change value option must add a CSS class to a cell', function(assert) {
        const secondDate = new Date(2013, 1, 1);
        const secondDateCell = this.$element.find('table').find('td').eq(1);

        this.view.option('value', secondDate);
        assert.ok(secondDateCell.hasClass(CALENDAR_SELECTED_DATE_CLASS));
    });

    QUnit.test('changing contouredDate must add CALENDAR_CONTOURED_DATE_CLASS class to a cell', function(assert) {
        const date = new Date(2013, 4, 1);
        const dateCell = this.$element.find('table').find('td').eq(4);

        this.view.option('contouredDate', date);
        assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
    });

    QUnit.test('changing contouredDate must remove CALENDAR_CONTOURED_DATE_CLASS class from the old cell', function(assert) {
        const date = new Date(2013, 9, 1);
        const newDate = new Date(2013, 4, 1);
        const dateCell = this.$element.find('table').find('td').eq(9);

        this.view.option('contouredDate', date);
        assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));

        this.view.option('contouredDate', newDate);
        assert.ok(!dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
    });
});

QUnit.module('DecadeView', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['decade'](this.$element, {
            date: new Date(2013, 9, 16),
            value: new Date(2013, 9, 16),
            firstDayOfWeek: 1,
            focusStateEnabled: true
        });
    },
    reinit: function(options) {
        this.$element.remove();
        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['decade'](this.$element, options);
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('getNavigatorCaption must return a proper caption', function(assert) {
        assert.strictEqual(this.view.getNavigatorCaption(), '2010-2019');
    });

    QUnit.test('change value option must add a CSS class to a cell', function(assert) {
        const secondDate = new Date(2010, 1, 1);
        const secondDateCell = this.$element.find('table').find('td').eq(1);

        this.view.option('value', secondDate);
        assert.ok(secondDateCell.hasClass(CALENDAR_SELECTED_DATE_CLASS));
    });

    QUnit.test('changing contouredDate must add CALENDAR_CONTOURED_DATE_CLASS class to a cell', function(assert) {
        const date = new Date(2012, 1, 1);
        const dateCell = this.$element.find('table').find('td').eq(3);

        this.view.option('contouredDate', date);
        assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
    });

    QUnit.test('changing contouredDate must remove CALENDAR_CONTOURED_DATE_CLASS class from the old cell', function(assert) {
        const date = new Date(2012, 1, 1);
        const newDate = new Date(2016, 1, 1);
        const dateCell = this.$element.find('table').find('td').eq(3);

        this.view.option('contouredDate', date);
        assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));

        this.view.option('contouredDate', newDate);
        assert.ok(!dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
    });

    QUnit.test('data-value after render for cells in decade view', function(assert) {
        const dateCells = this.$element.find('table').find('td');
        let startYear = 2009;

        $.each(dateCells, function(_, dateCell) {
            const shortDate = getShortDate(new Date(startYear, 0, 1));
            assert.equal(shortDate, $(dateCell).data().value, 'data-value has a current value');
            startYear++;
        });
    });

    QUnit.test('text and data-value after render for cells in decade view for the first century (T929559)', function(assert) {
        let startYear = 9;
        const startDate = new Date(14, 9, 16);
        startDate.setFullYear(14);

        this.reinit({
            min: new Date(-10, 1, 1),
            value: startDate,
            date: startDate
        });

        const dateCells = this.$element.find('table').find('td');

        $.each(dateCells, function(_, dateCell) {
            const expectedDate = new Date(startYear, 0, 1);
            expectedDate.setFullYear(startYear);
            const shortDate = getShortDate(expectedDate);
            const startYearString = ('000' + startYear).slice(-4);
            assert.strictEqual($(dateCell).text(), startYearString, 'correct cell text');
            assert.strictEqual($(dateCell).data().value, shortDate, 'data-value has a current value');
            startYear++;
        });
    });
});

QUnit.module('CenturyView', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['century'](this.$element, {
            date: new Date(2013, 9, 16),
            value: new Date(2013, 9, 16),
            firstDayOfWeek: 1,
            focusStateEnabled: true
        });
    },
    reinit: function(options) {
        this.$element.remove();
        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['century'](this.$element, options);
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('getNavigatorCaption must return a proper caption', function(assert) {
        assert.strictEqual(this.view.getNavigatorCaption(), '2000-2099');
    });

    QUnit.test('data-value after render for cells in century view', function(assert) {
        const dateCells = this.$element.find('table').find('td');
        let startYear = 1990;

        $.each(dateCells, function(_, dateCell) {
            const shortDate = getShortDate(new Date(startYear, 0, 1));
            assert.equal(shortDate, $(dateCell).data().value, 'data-value has a current value');
            startYear += 10;
        });
    });

    QUnit.test('changing contouredDate must add CALENDAR_CONTOURED_DATE_CLASS class to a cell', function(assert) {
        const date = new Date(2030, 1, 1);
        const dateCell = this.$element.find('table').find('td').eq(4);

        this.view.option('contouredDate', date);
        assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
    });

    QUnit.test('changing contouredDate must remove CALENDAR_CONTOURED_DATE_CLASS class from the old cell', function(assert) {
        const date = new Date(2030, 1, 1);
        const newDate = new Date(2050, 1, 1);
        const dateCell = this.$element.find('table').find('td').eq(4);

        this.view.option('contouredDate', date);
        assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));

        this.view.option('contouredDate', newDate);
        assert.ok(!dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
    });
});

QUnit.module('MonthView min/max', {
    beforeEach: function() {
        fx.off = true;

        this.min = new Date(2010, 10, 5);
        this.max = new Date(2010, 10, 25);

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['month'](this.$element, {
            min: this.min,
            date: new Date(2010, 10, 10),
            value: new Date(2010, 10, 10),
            max: this.max
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('monthView should not allow to select dates earlier than min and later than max via pointer events', function(assert) {
        const dateCells = this.$element.find('table').find('td');

        pointerMock(dateCells[0]).click();
        assert.ok(this.min.valueOf() < this.view.option('value').valueOf());

        pointerMock(dateCells[dateCells.length - 1]).click();
        assert.ok(this.max.valueOf() > this.view.option('value').valueOf());
    });

    QUnit.test('monthView should not allow to navigate to a date earlier than min and later than max via keyboard events', function(assert) {
        const $element = this.$element; const view = this.view;

        view.option('contouredDate', this.min);
        triggerKeydown(UP_ARROW_KEY_CODE, $element);
        assert.deepEqual(view.option('contouredDate'), this.min);

        view.option('contouredDate', this.max);
        triggerKeydown(DOWN_ARROW_KEY_CODE, $element);
        assert.deepEqual(view.option('contouredDate'), this.max);
    });
});

QUnit.module('MonthView disabledDates', {
    beforeEach: function() {
        fx.off = true;

        this.disabledDates = function(args) {
            if(args.date.getDate() < 5) {
                return true;
            }
        };

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['month'](this.$element, {
            disabledDates: this.disabledDates,
            date: new Date(2010, 10, 10),
            value: new Date(2010, 10, 10)
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {

    QUnit.test('monthView should not allow to select disabled dates via pointer events', function(assert) {
        const disabledDays = [1, 2, 3, 4];
        const dateCells = this.$element.find('table').find('td');

        pointerMock(dateCells[0]).click();
        assert.ok(disabledDays.indexOf(this.view.option('value').getDate()));
    });

    QUnit.test('monthView should not allow to navigate to a disabled date', function(assert) {
        const $element = this.$element; const view = this.view;

        view.option('contouredDate', new Date(2010, 10, 5));
        triggerKeydown(UP_ARROW_KEY_CODE, $element);
        assert.deepEqual(view.option('contouredDate'), new Date(2010, 10, 5));
    });
});

QUnit.module('MonthView disabledDates as array', {
    beforeEach: function() {
        fx.off = true;

        this.disabledDates = [
            new Date(2010, 10, 1),
            new Date(2010, 10, 2),
            new Date(2010, 10, 3),
            new Date(2010, 10, 4)
        ];

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['month'](this.$element, {
            disabledDates: this.disabledDates,
            date: new Date(2010, 10, 10),
            value: new Date(2010, 10, 10)
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('monthView should not allow to select disabled dates via pointer events', function(assert) {
        const disabledDays = [1, 2, 3, 4];
        const dateCells = this.$element.find('table').find('td');

        pointerMock(dateCells[0]).click();
        assert.ok(disabledDays.indexOf(this.view.option('value').getDate()));
    });

    QUnit.test('monthView should not allow to navigate to a disabled date', function(assert) {
        const $element = this.$element; const view = this.view;

        view.option('contouredDate', new Date(2010, 10, 5));
        triggerKeydown(UP_ARROW_KEY_CODE, $element);
        assert.deepEqual(view.option('contouredDate'), new Date(2010, 10, 5));
    });
});

QUnit.module('YearView min/max', {
    beforeEach: function() {
        fx.off = true;

        this.min = new Date(2015, 0, 18);
        this.max = new Date(2015, 6, 18);

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['year'](this.$element, {
            min: this.min,
            date: new Date(2015, 3, 15),
            max: this.max
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('yearView should not allow to navigate to a date earlier than min and later than max via keyboard events', function(assert) {
        const $element = this.$element; const view = this.view;

        view.option('contouredDate', this.min);
        triggerKeydown(UP_ARROW_KEY_CODE, $element);

        assert.deepEqual(view.option('contouredDate'), this.min);
        view.option('contouredDate', this.max);

        triggerKeydown(DOWN_ARROW_KEY_CODE, $element);
        assert.deepEqual(view.option('contouredDate'), this.max);
    });
});

QUnit.module('YearView disabledDates', {
    beforeEach: function() {
        fx.off = true;

        this.disabledDates = function(args) {
            if(args.date.getMonth() < 3) {
                return true;
            }
        };

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['year'](this.$element, {
            disabledDates: this.disabledDates,
            date: new Date(2015, 3, 15)
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('yearView should not allow to navigate to a disabled date via keyboard events', function(assert) {
        const $element = this.$element; const view = this.view;

        view.option('contouredDate', new Date(2015, 3, 15));
        triggerKeydown(UP_ARROW_KEY_CODE, $element);

        assert.deepEqual(view.option('contouredDate'), new Date(2015, 3, 15));
    });
});

QUnit.module('DecadeView min/max', {
    beforeEach: function() {
        fx.off = true;

        this.min = new Date(2013, 0, 18);
        this.max = new Date(2018, 6, 18);

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['decade'](this.$element, {
            min: this.min,
            value: new Date(2015, 3, 15),
            max: this.max
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('decadeView should not allow to navigate to a date earlier than min and later than max via keyboard events', function(assert) {
        const $element = this.$element; const view = this.view;

        view.option('contouredDate', this.min);
        triggerKeydown(UP_ARROW_KEY_CODE, $element);
        assert.deepEqual(view.option('contouredDate'), this.min);

        view.option('contouredDate', this.max);
        triggerKeydown(DOWN_ARROW_KEY_CODE, $element);

        assert.deepEqual(view.option('contouredDate'), this.max);
    });
});

QUnit.module('DecadeView disabledDates', {
    beforeEach: function() {
        fx.off = true;

        this.disabledDates = function(args) {
            if(args.date.getFullYear() < 2013) {
                return true;
            }
        };

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['decade'](this.$element, {
            disabledDates: this.disabledDates,
            value: new Date(2015, 3, 15),
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('decadeView should not allow to navigate to a disabled date via keyboard events', function(assert) {
        const $element = this.$element; const view = this.view;

        view.option('contouredDate', new Date(2015, 3, 15));
        triggerKeydown(UP_ARROW_KEY_CODE, $element);
        assert.deepEqual(view.option('contouredDate'), new Date(2015, 3, 15));
    });
});

QUnit.module('CenturyView min/max', {
    beforeEach: function() {
        fx.off = true;

        this.min = new Date(2005, 0, 18);
        this.max = new Date(2075, 6, 18);

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['century'](this.$element, {
            min: this.min,
            value: new Date(2015, 3, 15),
            max: this.max
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('centuryView should not allow to navigate to a date earlier than min and later than max via keyboard events', function(assert) {
        const $element = this.$element; const view = this.view;

        view.option('contouredDate', this.min);
        triggerKeydown(UP_ARROW_KEY_CODE, $element);
        assert.deepEqual(view.option('contouredDate'), this.min);
        view.option('contouredDate', this.max);
        triggerKeydown(DOWN_ARROW_KEY_CODE, $element);
        assert.deepEqual(view.option('contouredDate'), this.max);
    });
});

QUnit.module('CenturyView disabledDates', {
    beforeEach: function() {
        fx.off = true;

        this.disabledDates = function(args) {
            if(args.date.getFullYear() < 2010) {
                return true;
            }
        };

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['century'](this.$element, {
            disabledDates: this.disabledDates,
            value: new Date(2015, 3, 15)
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('centuryView should not allow to navigate to a disabled date via keyboard events', function(assert) {
        const $element = this.$element; const view = this.view;

        view.option('contouredDate', new Date(2070, 0, 15));
        triggerKeydown(UP_ARROW_KEY_CODE, $element);
        assert.deepEqual(view.option('contouredDate'), new Date(2070, 0, 15));
    });
});

QUnit.module('Aria accessibility', {
    beforeEach: function() {
        fx.off = true;
        this.$element = $('<div>').appendTo('#qunit-fixture');
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.module('Calendar cell\'s aria-label', () => {
        const expectedAriaLabel = {
            month: 'Monday, June 1, 2015',
            year: 'June 2015',
            decade: '2015',
            century: '2010 - 2019',
        };

        const views = ['month', 'year', 'decade', 'century'];

        views.forEach(view => {
            QUnit.test(`Calendar cell should have a correct aria-label attribute when view is ${view}`, function(assert) {
                new Views[view](this.$element, {
                    date: new Date(2015, 5, 1),
                    value: new Date(2015, 5, 1),
                    contouredDate: new Date(2015, 5, 1),
                    firstDayOfWeek: 1,
                    focusStateEnabled: true,
                });

                const $cell = this.$element.find(`.${CALENDAR_CONTOURED_DATE_CLASS}`);

                assert.strictEqual($cell.attr('aria-label'), expectedAriaLabel[view], 'aria label is correct');
            });
        });

        views.forEach(view => {
            QUnit.test(`Current date cell should have a correct aria-label attribute when view is ${view}`, function(assert) {
                new Views[view](this.$element, {
                    date: new Date(2015, 5, 1),
                    _todayDate: () => new Date(2015, 5, 1),
                });

                const $cell = this.$element.find(`.${CALENDAR_CELL_TODAY_CLASS}`);

                const cellAriaLabel = $cell.attr('aria-label');
                const expectedValue = `${expectedAriaLabel[view]}. ${CURRENT_DATE_TEXT[view]}`;

                assert.strictEqual(cellAriaLabel, expectedValue, 'aria label is correct');
            });
        });
    });

    QUnit.test('check roles across the views', function(assert) {
        ['month', 'year', 'decade', 'century'].forEach((viewName) => {
            new Views[viewName](this.$element, {
                date: new Date(2015, 5, 1),
                value: new Date(2015, 5, 1),
                contouredDate: new Date(2015, 5, 1),
                firstDayOfWeek: 1,
                focusStateEnabled: true
            });

            const $cell = this.$element.find(`.${CALENDAR_CONTOURED_DATE_CLASS}`);
            const $row = $cell.closest('tr');
            const $table = $row.closest('table');

            assert.strictEqual($cell.attr('role'), 'gridcell', `${viewName} - cell role is correct`);
            assert.strictEqual($row.attr('role'), 'row', `${viewName} - row role is correct`);
            assert.strictEqual($table.attr('role'), 'grid', `${viewName} - table role is correct`);
        });
    });

    QUnit.test('header row of the Month view should have correct attributes', function(assert) {
        const view = new Views.month(this.$element, {
            date: new Date(2015, 5, 1),
            value: new Date(2015, 5, 1),
            contouredDate: new Date(2015, 5, 1),
            firstDayOfWeek: 1,
            focusStateEnabled: true
        });

        const $headerCells = this.$element.find('thead > tr').first().find('th');

        $headerCells.each((index, cell) => {
            const scope = cell.getAttribute('scope');
            const abbr = cell.getAttribute('abbr');
            const cellText = cell.textContent;

            const { full: fullDayCaption, abbreviated: shortDayCaption } = view._getDayCaption(1 + index);

            assert.strictEqual(scope, 'col', `"${cellText}" cell: correct header cell role`);
            assert.strictEqual(abbr, fullDayCaption, `"${cellText}" cell: correct cell "abbr" attribute`);
            assert.strictEqual(cellText, shortDayCaption, `"${cellText}" cell: correct cell text`);
        });
    });
});

