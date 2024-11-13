import $ from 'jquery';
import dateUtils from 'core/utils/date';
import BaseView from '__internal/ui/calendar/m_calendar.base_view';
import Views from '__internal/ui/calendar/m_calendar.views';
import fx from 'common/core/animation/fx';
import dateSerialization from 'core/utils/date_serialization';

import 'ui/calendar';

const CALENDAR_EMPTY_CELL_CLASS = 'dx-calendar-empty-cell';
const CALENDAR_TODAY_CLASS = 'dx-calendar-today';
const CALENDAR_OTHER_VIEW_CLASS = 'dx-calendar-other-view';
const CALENDAR_SELECTED_DATE_CLASS = 'dx-calendar-selected-date';
const CALENDAR_CELL_START_CLASS = 'dx-calendar-cell-start';
const CALENDAR_CELL_END_CLASS = 'dx-calendar-cell-end';

const getShortDate = function(date) {
    return dateSerialization.serializeDate(date, dateUtils.getShortDateFormat());
};

const getTextsArray = function(elements) {
    const result = [];

    $.each(elements, function(_, element) {
        result.push($(element).text());
    });

    return result;
};

QUnit.module('Basics', () => {
    QUnit.test('all views must be derived from the base view class', function(assert) {
        $.each(Views, function(name, View) {
            if(name !== 'default') {
                assert.ok(new View($('<div>')) instanceof BaseView);
            }
        });
    });
});

QUnit.module('MonthView markup', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['month'](this.$element, {
            date: new Date(2013, 9, 16),
            firstDayOfWeek: 1,
            focusStateEnabled: true
        });
    },
    reinit: function(options) {
        this.$element.remove();
        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['month'](this.$element, options);
    },
    afterEach: function() {
        this.$element.remove();
    }
}, () => {
    QUnit.test('main table should be 6 by 7', function(assert) {
        const table = this.$element.find('tbody');
        assert.strictEqual(table.length, 1, 'table has been rendered');

        const rows = table.find('tr');
        assert.strictEqual(rows.length, 6, 'with 6 rows');

        for(let i = 0; i < 6; ++i) {
            const columns = $(rows[i]).find('td');
            assert.strictEqual(columns.length, 7, 'of 7 columns');
        }
    });

    QUnit.test('day captions must be rendered in proper order', function(assert) {
        const captions = this.$element.find('table').find('th');
        assert.deepEqual(getTextsArray(captions), ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 'day captions order is correct');
    });

    QUnit.test('dates must be rendered in proper positions', function(assert) {
        const dateCells = this.$element.find('table').find('td');
        assert.deepEqual(getTextsArray(dateCells),
            ['30', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13',
                '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27',
                '28', '29', '30', '31', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    });

    QUnit.test('dates must be rendered in proper positions when the first day of the month comes right before the first day of the week', function(assert) {
        this.reinit({
            date: new Date(2013, 8, 11),
            firstDayOfWeek: 1
        });

        const dateCells = this.$element.find('table').find('td');
        assert.deepEqual(getTextsArray(dateCells),
            ['26', '27', '28', '29', '30', '31', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23',
                '24', '25', '26', '27', '28', '29', '30', '1', '2', '3', '4', '5', '6']);
    });

    QUnit.test('non-current month dates must be decorated with a CSS class', function(assert) {
        const dateCells = this.$element.find('table').find('td').filter('.' + CALENDAR_OTHER_VIEW_CLASS);
        assert.deepEqual(getTextsArray(dateCells), ['30', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    });

    QUnit.test('today must be decorated with a css class', function(assert) {
        this.reinit({});

        const todayCell = this.$element.find(`.${CALENDAR_TODAY_CLASS}`);
        assert.equal(todayCell.length, 1);
    });

    QUnit.test('start and end day cells of the month should be decorated with a css class if selectionMode is range', function(assert) {
        this.reinit({
            date: new Date(2021, 9, 17),
            selectionMode: 'range',
            value: [null, null],
            range: [],
            hoveredRange: [],
        });

        const $startDateCell = this.$element.find(`.${CALENDAR_CELL_START_CLASS}`);
        const $endDateCell = this.$element.find(`.${CALENDAR_CELL_END_CLASS}`);

        assert.strictEqual($startDateCell.length, 1);
        assert.strictEqual($startDateCell.text(), '1', 'the first day of the month');

        assert.strictEqual($endDateCell.length, 1);
        assert.strictEqual($endDateCell.text(), '31', 'the last day of the month');
    });

    QUnit.test('start and end day cells of the month should not be decorated with a css class after change selectionMode to single in runtime', function(assert) {
        this.reinit({
            date: new Date(2021, 9, 17),
            selectionMode: 'range',
            value: [null, null],
            range: [],
            hoveredRange: [],
        });

        this.view.option('selectionMode', 'single');

        const $startDateCell = this.$element.find(`.${CALENDAR_CELL_START_CLASS}`);
        const $endDateCell = this.$element.find(`.${CALENDAR_CELL_END_CLASS}`);

        assert.strictEqual($startDateCell.length, 0);
        assert.strictEqual($endDateCell.length, 0);
    });

    QUnit.test('start and end day cells of the month should not be decorated with a css class if selectionMode is single', function(assert) {
        this.reinit({
            date: new Date(2021, 9, 17),
            selectionMode: 'single',
        });

        const $startDateCell = this.$element.find(`.${CALENDAR_CELL_START_CLASS}`);
        const $endDateCell = this.$element.find(`.${CALENDAR_CELL_END_CLASS}`);

        assert.strictEqual($startDateCell.length, 0);
        assert.strictEqual($endDateCell.length, 0);
    });

    QUnit.test('correct date must be decorated with a css class when _todayDate is specified', function(assert) {
        this.reinit({
            date: new Date(2021, 0, 15),
            _todayDate: () => new Date(2021, 0, 1)
        });

        const todayCell = this.$element.find(`.${CALENDAR_TODAY_CLASS}`);

        assert.strictEqual($(todayCell).text(), '1');
    });

    QUnit.test('correct date must be decorated with a css class after _todayDate runtime change', function(assert) {
        this.view.option('_todayDate', () => new Date(2013, 9, 1));

        const todayCell = this.$element.find(`.${CALENDAR_TODAY_CLASS}`);

        assert.strictEqual($(todayCell).text(), '1');
    });

    QUnit.test('value time component should not be compared in min and max options', function(assert) {
        this.reinit({
            value: new Date(2015, 2, 14, 12),
            min: new Date(2015, 2, 14, 10)
        });
        assert.ok(!$('.dx-calendar-selected-date').hasClass('dx-calendar-empty-cell'), 'current date is available');

        this.reinit({
            value: new Date(2015, 2, 14, 12),
            max: new Date(2015, 2, 14, 13)
        });
        assert.ok(!$('.dx-calendar-selected-date').hasClass('dx-calendar-empty-cell'), 'current date is available');
    });
});

QUnit.module('YearView markup', {
    beforeEach: function() {
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
    }
}, () => {
    QUnit.test('main table for year view should be 4 by 3', function(assert) {
        const table = this.$element.find('tbody');

        assert.strictEqual(table.length, 1, 'table has been rendered');

        const rows = table.find('tr');
        assert.strictEqual(rows.length, 3, 'with 3 rows');

        for(let i = 0; i < 3; ++i) {
            const columns = $(rows[i]).find('td');
            assert.strictEqual(columns.length, 4, 'of 4 columns');
        }
    });

    QUnit.test('month must be rendered in proper positions', function(assert) {
        const dateCells = this.$element.find('table').find('td');
        assert.deepEqual(getTextsArray(dateCells),
            ['Jan', 'Feb', 'Mar', 'Apr', 'May',
                'Jun', 'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec']);
    });

    QUnit.test('data-value after render for cells in year view', function(assert) {
        const dateCells = this.$element.find('table').find('td');
        let startMonth = 0;

        $.each(dateCells, function(_, dateCell) {
            const shortDate = getShortDate(new Date(2013, startMonth, 1));
            assert.equal(shortDate, $(dateCell).data().value, 'data-value has a current value');
            startMonth++;
        });
    });

    QUnit.test('today must be decorated with a css class', function(assert) {
        this.reinit({});

        const todayCell = this.$element.find(`.${CALENDAR_TODAY_CLASS}`);
        assert.equal(todayCell.length, 1);
    });

    QUnit.test('correct date must be decorated with a css class when _todayDate is specified', function(assert) {
        this.reinit({
            date: new Date(2021, 0, 15),
            _todayDate: () => new Date(2021, 10, 15)
        });

        const todayCell = this.$element.find(`.${CALENDAR_TODAY_CLASS}`);

        assert.strictEqual($(todayCell).text(), 'Nov');
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
    QUnit.test('main table for decade view should be 4 by 3', function(assert) {
        const table = this.$element.find('tbody');

        assert.strictEqual(table.length, 1, 'table has been rendered');

        const rows = table.find('tr');
        assert.strictEqual(rows.length, 3, 'with 3 rows');

        for(let i = 0; i < 3; ++i) {
            const columns = $(rows[i]).find('td');
            assert.strictEqual(columns.length, 4, 'of 4 columns');
        }
    });

    QUnit.test('years must be rendered in proper positions', function(assert) {
        const dateCells = this.$element.find('table').find('td');
        assert.deepEqual(getTextsArray(dateCells),
            ['2009', '2010', '2011', '2012', '2013',
                '2014', '2015', '2016', '2017',
                '2018', '2019', '2020']);
    });

    QUnit.test('non-current decade dates must be decorated with a CSS class', function(assert) {
        const dateCells = this.$element.find('table').find('td').filter('.' + CALENDAR_OTHER_VIEW_CLASS);
        assert.deepEqual(getTextsArray(dateCells), ['2009', '2020']);
    });

    QUnit.test('today must be decorated with a css class', function(assert) {
        this.reinit({});

        const todayCell = this.$element.find(`.${CALENDAR_TODAY_CLASS}`);
        assert.equal(todayCell.length, 1);
    });

    QUnit.test('correct date must be decorated with a css class when _todayDate is specified', function(assert) {
        this.reinit({
            date: new Date(2021, 0, 15),
            _todayDate: () => new Date(2030, 0, 15)
        });

        const todayCell = this.$element.find(`.${CALENDAR_TODAY_CLASS}`);

        assert.strictEqual($(todayCell).text(), '2030');
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
    QUnit.test('main table for century view should be 4 by 3', function(assert) {
        const table = this.$element.find('tbody');

        assert.strictEqual(table.length, 1, 'table has been rendered');

        const rows = table.find('tr');
        assert.strictEqual(rows.length, 3, 'with 3 rows');

        for(let i = 0; i < 3; ++i) {
            const columns = $(rows[i]).find('td');
            assert.strictEqual(columns.length, 4, 'of 4 columns');
        }
    });

    QUnit.test('decades must be rendered in proper positions', function(assert) {
        const dateCells = this.$element.find('table').find('td');
        assert.deepEqual(getTextsArray(dateCells),
            ['1990 - 1999', '2000 - 2009', '2010 - 2019', '2020 - 2029', '2030 - 2039',
                '2040 - 2049', '2050 - 2059', '2060 - 2069', '2070 - 2079',
                '2080 - 2089', '2090 - 2099', '2100 - 2109']);
    });

    QUnit.test('non-current century dates must be decorated with a CSS class', function(assert) {
        const dateCells = this.$element.find('table').find('td').filter('.' + CALENDAR_OTHER_VIEW_CLASS);
        assert.deepEqual(getTextsArray(dateCells), ['1990 - 1999', '2100 - 2109']);
    });

    QUnit.test('change value option must add a CSS class to a cell', function(assert) {
        const secondDate = new Date(2010, 1, 1);
        const secondDateCell = this.$element.find('table').find('td').eq(2);

        this.view.option('value', secondDate);
        assert.ok(secondDateCell.hasClass(CALENDAR_SELECTED_DATE_CLASS));
    });

    QUnit.test('today must be decorated with a css class', function(assert) {
        this.reinit({});

        const todayCell = this.$element.find(`.${CALENDAR_TODAY_CLASS}`);
        assert.equal(todayCell.length, 1);
    });

    QUnit.test('correct date must be decorated with a css class when _todayDate is specified', function(assert) {
        this.reinit({
            date: new Date(2021, 0, 15),
            _todayDate: () => new Date(2050, 0, 15)
        });

        const todayCell = this.$element.find(`.${CALENDAR_TODAY_CLASS}`);

        assert.strictEqual($(todayCell).text(), '2050 - 2059');
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
    QUnit.test('monthView should not display dates earlier than min and later than max by decorating them with a CSS class', function(assert) {
        const dateCells = this.$element.find('table').find('td');
        const dateCellsText = dateCells.filter('.' + CALENDAR_EMPTY_CELL_CLASS).text();

        assert.equal(dateCellsText, '31123426272829301234567891011');
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
    QUnit.test('monthView should not display disabled dates by decorating them with a CSS class', function(assert) {
        const dateCells = this.$element.find('table').find('td');
        const dateCellsText = dateCells.filter('.' + CALENDAR_EMPTY_CELL_CLASS).text();

        assert.equal(dateCellsText, '12341234');
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
    QUnit.test('monthView should not display disabled dates by decorating them with a CSS class', function(assert) {
        const dateCells = this.$element.find('table').find('td');
        const dateCellsText = dateCells.filter('.' + CALENDAR_EMPTY_CELL_CLASS).text();

        assert.equal(dateCellsText, '1234');
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
    QUnit.test('yearView should add empty_class for cells out of range ', function(assert) {
        assert.equal(this.$element.find('.' + CALENDAR_EMPTY_CELL_CLASS).length, 5, 'correct empty cells count was rendered');
    });

    QUnit.test('yearView should not display dates earlier than min and later than max by decorating them with a CSS class', function(assert) {
        const dateCells = this.$element.find('table').find('td');
        const dateCellsText = dateCells.filter('.' + CALENDAR_EMPTY_CELL_CLASS).text();

        assert.equal(dateCellsText, 'AugSepOctNovDec');
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
    QUnit.test('yearView should add empty_class for disabled dates', function(assert) {
        assert.equal(this.$element.find('.' + CALENDAR_EMPTY_CELL_CLASS).length, 3, 'correct empty cells count was rendered');
    });

    QUnit.test('yearView should not display disabled dates by decorating them with a CSS class', function(assert) {
        const dateCells = this.$element.find('table').find('td');
        const dateCellsText = dateCells.filter('.' + CALENDAR_EMPTY_CELL_CLASS).text();

        assert.equal(dateCellsText, 'JanFebMar');
    });
});

QUnit.module('DecadeView min/max', {
    beforeEach: function() {
        fx.off = true;

        const min = new Date(2013, 0, 18);
        const max = new Date(2018, 6, 18);
        const currentDate = new Date(2015, 3, 15);

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['decade'](this.$element, {
            min,
            max,
            value: currentDate,
            date: currentDate
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('decadeView should add empty_class for cells out of range ', function(assert) {
        assert.equal(this.$element.find('.' + CALENDAR_EMPTY_CELL_CLASS).length, 6, 'correct empty cells count was rendered');
    });

    QUnit.test('decadeView should not display dates earlier than min and later than max by decorating them with a CSS class', function(assert) {
        const dateCells = this.$element.find('table').find('td');
        const dateCellsText = dateCells.filter('.' + CALENDAR_EMPTY_CELL_CLASS).text();

        assert.equal(dateCellsText, '200920102011201220192020');
    });
});

QUnit.module('DecadeView disabledDates', {
    beforeEach: function() {
        fx.off = true;

        const currentDate = new Date(2015, 3, 15);
        this.disabledDates = function(args) {
            if(args.date.getFullYear() < 2013) {
                return true;
            }
        };

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.view = new Views['decade'](this.$element, {
            disabledDates: this.disabledDates,
            value: currentDate,
            date: currentDate
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('decadeView should add empty_class for disabled dates', function(assert) {
        assert.equal(this.$element.find('.' + CALENDAR_EMPTY_CELL_CLASS).length, 4, 'correct empty cells count was rendered');
    });

    QUnit.test('decadeView should not display disabled dates by decorating them with a CSS class', function(assert) {
        const dateCells = this.$element.find('table').find('td');
        const dateCellsText = dateCells.filter('.' + CALENDAR_EMPTY_CELL_CLASS).text();

        assert.equal(dateCellsText, '2009201020112012');
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
    QUnit.test('centuryView should add empty_class for cells out of range ', function(assert) {
        assert.equal(this.$element.find('.' + CALENDAR_EMPTY_CELL_CLASS).length, 4, 'correct empty cells count was rendered');
    });

    QUnit.test('centuryView should not display dates earlier than min and later than max by decorating them with a CSS class', function(assert) {
        const dateCells = this.$element.find('table').find('td');
        const dateCellsText = dateCells.filter('.' + CALENDAR_EMPTY_CELL_CLASS).text();

        assert.equal(dateCellsText, '1990 - 19992080 - 20892090 - 20992100 - 2109');
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
    QUnit.test('centuryView should add empty_class for disabled dates', function(assert) {
        assert.equal(this.$element.find('.' + CALENDAR_EMPTY_CELL_CLASS).length, 2, 'correct empty cells count was rendered');
    });

    QUnit.test('centuryView should not display disabled dates by decorating them with a CSS class', function(assert) {
        const dateCells = this.$element.find('table').find('td');
        const dateCellsText = dateCells.filter('.' + CALENDAR_EMPTY_CELL_CLASS).text();

        assert.equal(dateCellsText, '1990 - 19992000 - 2009');
    });
});

