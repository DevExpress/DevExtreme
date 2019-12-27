const $ = require('jquery');
const noop = require('core/utils/common').noop;
const dateUtils = require('core/utils/date');
const BaseView = require('ui/calendar/ui.calendar.base_view');
const Views = require('ui/calendar/ui.calendar.views');
const pointerMock = require('../../helpers/pointerMock.js');
const fx = require('animation/fx');
const dateSerialization = require('core/utils/date_serialization');
const dateLocalization = require('localization/date');

require('common.css!');
require('ui/calendar');

const CALENDAR_EMPTY_CELL_CLASS = 'dx-calendar-empty-cell';
const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const CALENDAR_SELECTED_DATE_CLASS = 'dx-calendar-selected-date';
const CALENDAR_CONTOURED_DATE_CLASS = 'dx-calendar-contoured-date';

const UP_ARROW_KEY_CODE = 'ArrowUp';
const DOWN_ARROW_KEY_CODE = 'ArrowDown';

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
    isBoundary: noop,
    _renderValue: noop
});


QUnit.module('Basics', () => {
    QUnit.test('onCellClick action should be fired on cell click', function(assert) {
        const $element = $('<div>').appendTo('body');

        try {
            const spy = sinon.spy();
            new FakeView($element, {
                onCellClick: spy
            });

            $element.find('td').eq(4).trigger('dxclick');
            assert.ok(spy.calledOnce, 'onCellClick fired once');
        } finally {
            $element.remove();
        }
    });

    QUnit.test('no contouredDate is set by default', function(assert) {
        const $element = $('<div>').appendTo('body');

        try {
            const view = new FakeView($element, {});
            assert.equal(view.option('contouredDate'), null, 'contoured Date is null');
        } finally {
            $element.remove();
        }
    });

    QUnit.test('onCellClick should not be fired on out of range cells', function(assert) {
        const $element = $('<div>').appendTo('body');

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
        const $element = $('<div>').appendTo('body'); const spy = sinon.spy(dateLocalization, 'firstDayOfWeekIndex');

        this.view = new Views['month']($element, {
            date: new Date(2017, 11, 11),
            firstDayOfWeek: 0
        });

        assert.notOk(spy.called, 'firstDayOfWeekIndex wasn\'t called');
    });
});

QUnit.module('MonthView', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('<div>').appendTo('body');
        this.view = new Views['month'](this.$element, {
            date: new Date(2013, 9, 16),
            firstDayOfWeek: 1,
            focusStateEnabled: true
        });
    },
    reinit: function(options) {
        this.$element.remove();
        this.$element = $('<div>').appendTo('body');
        this.view = new Views['month'](this.$element, options);
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('getNavigatorCaption must return a proper caption', function(assert) {
        assert.equal(this.view.getNavigatorCaption(), 'October 2013', 'caption is correct');
    });

    QUnit.test('getNavigatorCaption must return a proper caption in RTL mode', function(assert) {
        this.view.option('rtl', true);
        assert.equal(this.view.getNavigatorCaption(), 'October 2013', 'caption is correct');
    });

    QUnit.test('change value option must add a CSS class to a cell', function(assert) {
        const secondDate = new Date(2013, 9, 1); const secondDateCell = this.$element.find('table').find('td').eq(1);
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
        const date = new Date(2013, 9, 1); const dateCell = this.$element.find('table').find('td').eq(1);

        this.view.option('contouredDate', date);
        assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
    });

    QUnit.test('changing contouredDate must remove CALENDAR_CONTOURED_DATE_CLASS class from the old cell', function(assert) {
        const date = new Date(2013, 9, 1); const newDate = new Date(2013, 9, 2); const dateCell = this.$element.find('table').find('td').eq(1);

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
});

QUnit.module('YearView', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('<div>').appendTo('body');
        this.view = new Views['year'](this.$element, {
            date: new Date(2013, 9, 16),
            firstDayOfWeek: 1,
            focusStateEnabled: true
        });
    },
    reinit: function(options) {
        this.$element.remove();
        this.$element = $('<div>').appendTo('body');
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
        const secondDate = new Date(2013, 1, 1); const secondDateCell = this.$element.find('table').find('td').eq(1);

        this.view.option('value', secondDate);
        assert.ok(secondDateCell.hasClass(CALENDAR_SELECTED_DATE_CLASS));
    });

    QUnit.test('changing contouredDate must add CALENDAR_CONTOURED_DATE_CLASS class to a cell', function(assert) {
        const date = new Date(2013, 4, 1); const dateCell = this.$element.find('table').find('td').eq(4);

        this.view.option('contouredDate', date);
        assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
    });

    QUnit.test('changing contouredDate must remove CALENDAR_CONTOURED_DATE_CLASS class from the old cell', function(assert) {
        const date = new Date(2013, 9, 1); const newDate = new Date(2013, 4, 1); const dateCell = this.$element.find('table').find('td').eq(9);

        this.view.option('contouredDate', date);
        assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));

        this.view.option('contouredDate', newDate);
        assert.ok(!dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
    });
});

QUnit.module('DecadeView', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('<div>').appendTo('body');
        this.view = new Views['decade'](this.$element, {
            date: new Date(2013, 9, 16),
            value: new Date(2013, 9, 16),
            firstDayOfWeek: 1,
            focusStateEnabled: true
        });
    },
    reinit: function(options) {
        this.$element.remove();
        this.$element = $('<div>').appendTo('body');
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
        const secondDate = new Date(2010, 1, 1); const secondDateCell = this.$element.find('table').find('td').eq(1);

        this.view.option('value', secondDate);
        assert.ok(secondDateCell.hasClass(CALENDAR_SELECTED_DATE_CLASS));
    });

    QUnit.test('changing contouredDate must add CALENDAR_CONTOURED_DATE_CLASS class to a cell', function(assert) {
        const date = new Date(2012, 1, 1); const dateCell = this.$element.find('table').find('td').eq(3);

        this.view.option('contouredDate', date);
        assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
    });

    QUnit.test('changing contouredDate must remove CALENDAR_CONTOURED_DATE_CLASS class from the old cell', function(assert) {
        const date = new Date(2012, 1, 1); const newDate = new Date(2016, 1, 1); const dateCell = this.$element.find('table').find('td').eq(3);

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
});

QUnit.module('CenturyView', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('<div>').appendTo('body');
        this.view = new Views['century'](this.$element, {
            date: new Date(2013, 9, 16),
            value: new Date(2013, 9, 16),
            firstDayOfWeek: 1,
            focusStateEnabled: true
        });
    },
    reinit: function(options) {
        this.$element.remove();
        this.$element = $('<div>').appendTo('body');
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
        const date = new Date(2030, 1, 1); const dateCell = this.$element.find('table').find('td').eq(4);

        this.view.option('contouredDate', date);
        assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
    });

    QUnit.test('changing contouredDate must remove CALENDAR_CONTOURED_DATE_CLASS class from the old cell', function(assert) {
        const date = new Date(2030, 1, 1); const newDate = new Date(2050, 1, 1); const dateCell = this.$element.find('table').find('td').eq(4);

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

        this.$element = $('<div>').appendTo('body');
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

        this.$element = $('<div>').appendTo('body');
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
        const disabledDays = [1, 2, 3, 4]; const dateCells = this.$element.find('table').find('td');

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

        this.$element = $('<div>').appendTo('body');
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
        const disabledDays = [1, 2, 3, 4]; const dateCells = this.$element.find('table').find('td');

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

        this.$element = $('<div>').appendTo('body');
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

        this.$element = $('<div>').appendTo('body');
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

        this.$element = $('<div>').appendTo('body');
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

        this.$element = $('<div>').appendTo('body');
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

        this.$element = $('<div>').appendTo('body');
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

        this.$element = $('<div>').appendTo('body');
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
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('getCellAriaLabel method', function(assert) {
        const expectations = {
            'month': 'Monday, June 1, 2015',
            'year': 'June 2015',
            'decade': '2015',
            'century': '2010 - 2019'
        };

        $.each(['month', 'year', 'decade', 'century'], function(_, type) {
            const $element = $('<div>').appendTo('body');

            new Views[type]($element, {
                date: new Date(2015, 5, 1),
                value: new Date(2015, 5, 1),
                contouredDate: new Date(2015, 5, 1),
                firstDayOfWeek: 1,
                focusStateEnabled: true
            });

            try {
                const $cell = $element.find('.' + CALENDAR_CONTOURED_DATE_CLASS);
                assert.equal($cell.attr('aria-label'), expectations[type], 'aria label is correct');
            } finally {
                $element.remove();
            }
        });
    });
});

