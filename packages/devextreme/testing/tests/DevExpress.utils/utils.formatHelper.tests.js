import formatHelper from 'format_helper';

const getDateFormatByTickInterval = formatHelper.getDateFormatByTickInterval;

function checkDateWithFormat(date, format, expected, assert) {
    assert.equal(formatHelper.format(date, format), expected, 'Check formatted date');
}

QUnit.module('Get Date Format by ticks', {
    beforeEach: function() {
        this.getDateFormatByTicks = function(ticks) {
            return formatHelper.getDateFormatByTicks(ticks);
        };
    }
});

QUnit.test('short date and hour, minute, second', function(assert) {
    const date = new Date(2010, 5, 3, 4, 11, 34, 0);
    const format = this.getDateFormatByTicks([date]);

    checkDateWithFormat(date, format, '6/3/2010 4:11:34 AM', assert);
});

QUnit.test('short date and hour, minute, millisecond', function(assert) {
    const date = new Date(2010, 5, 3, 4, 0, 0, 770);
    const format = this.getDateFormatByTicks([date]);

    checkDateWithFormat(date, format, '6/3/2010 4:00 AM 770', assert);
});

QUnit.test('short date and hour, minute', function(assert) {
    const date = new Date(2010, 5, 3, 4, 11, 0, 0);
    const format = this.getDateFormatByTicks([date]);

    checkDateWithFormat(date, format, '6/3/2010 4:11 AM', assert);
});

QUnit.test('short date', function(assert) {
    const date = new Date(2010, 5, 3);
    const format = this.getDateFormatByTicks([date]);

    checkDateWithFormat(date, format, '6/3/2010', assert);
});

QUnit.test('Hour, minute, second', function(assert) {
    const date1 = new Date(2010, 2, 3, 4, 11, 41);
    const date2 = new Date(2010, 2, 3, 4, 21, 44);
    const format = this.getDateFormatByTicks([date1, date2]);

    checkDateWithFormat(date1, format, '4:11:41 AM', assert);
});

QUnit.test('Millisecond', function(assert) {
    const date1 = new Date(2010, 2, 3, 4, 11, 41, 33);
    const date2 = new Date(2010, 2, 3, 4, 11, 41, 50);
    const format = this.getDateFormatByTicks([date1, date2]);

    checkDateWithFormat(date1, format, '033', assert);
});

QUnit.test('Hour, minute', function(assert) {
    const date1 = new Date(2010, 2, 3, 4, 11, 44);
    const date2 = new Date(2010, 2, 3, 4, 21, 44);
    const format = this.getDateFormatByTicks([date1, date2]);

    checkDateWithFormat(date1, format, '4:11 AM', assert);
});

QUnit.test('Day and hour, minute', function(assert) {
    const date1 = new Date(2010, 2, 3, 4, 54, 44);
    const date2 = new Date(2010, 2, 4, 8, 1, 44);
    const format = this.getDateFormatByTicks([date1, date2]);

    checkDateWithFormat(date1, format, 'Wednesday, 3 4:54 AM', assert);
});

QUnit.test('Day and hour, minute, second', function(assert) {
    const date1 = new Date(2010, 2, 3, 4, 54, 44);
    const date2 = new Date(2010, 2, 4, 8, 1, 10);
    const format = this.getDateFormatByTicks([date1, date2]);

    checkDateWithFormat(date1, format, 'Wednesday, 3 4:54:44 AM', assert);
});

QUnit.test('Day', function(assert) {
    const date1 = new Date(2010, 2, 3);
    const date2 = new Date(2010, 2, 11);
    const format = this.getDateFormatByTicks([date1, date2]);

    checkDateWithFormat(date1, format, 'Wednesday, 3', assert);
});

QUnit.test('Month and day, hour, minute, second', function(assert) {
    const date1 = new Date(2010, 2, 30, 1, 23, 12);
    const date2 = new Date(2010, 3, 2, 3, 53, 15);
    const format = this.getDateFormatByTicks([date1, date2]);

    checkDateWithFormat(date1, format, 'March 30 1:23:12 AM', assert);
});

QUnit.test('Month and day, hour, minute', function(assert) {
    const date1 = new Date(2010, 2, 30, 1, 23, 12);
    const date2 = new Date(2010, 3, 2, 3, 53, 12);
    const format = this.getDateFormatByTicks([date1, date2]);

    checkDateWithFormat(date1, format, 'March 30 1:23 AM', assert);
});

QUnit.test('Month and day', function(assert) {
    const date1 = new Date(2010, 2, 30);
    const date2 = new Date(2010, 3, 2);
    const format = this.getDateFormatByTicks([date1, date2]);

    checkDateWithFormat(date1, format, 'March 30', assert);
});

QUnit.test('Month', function(assert) {
    const date1 = new Date(2010, 2, 30);
    const date2 = new Date(2010, 3, 30);
    const format = this.getDateFormatByTicks([date1, date2]);

    checkDateWithFormat(date1, format, 'March', assert);
});

QUnit.test('Year, month, day, hour, minute, second', function(assert) {
    const date1 = new Date(2010, 2, 30, 3, 34, 23);
    const date2 = new Date(2012, 3, 2, 5, 45, 21);
    const format = this.getDateFormatByTicks([date1, date2]);

    checkDateWithFormat(date1, format, '3/30/2010 3:34:23 AM', assert);
});

QUnit.test('Year, month, day, hour, minute', function(assert) {
    const date1 = new Date(2010, 2, 30, 3, 34, 23);
    const date2 = new Date(2012, 3, 2, 5, 45, 23);
    const format = this.getDateFormatByTicks([date1, date2]);

    checkDateWithFormat(date1, format, '3/30/2010 3:34 AM', assert);
});

QUnit.test('Year, month, day', function(assert) {
    const date1 = new Date(2010, 2, 30, 3, 34, 23);
    const date2 = new Date(2012, 3, 2, 3, 34, 23);
    const format = this.getDateFormatByTicks([date1, date2]);

    checkDateWithFormat(date1, format, '3/30/2010', assert);
});

QUnit.test('Year, month', function(assert) {
    const date1 = new Date(2010, 2, 30, 3, 34, 23);
    const date2 = new Date(2012, 3, 30, 3, 34, 23);
    const format = this.getDateFormatByTicks([date1, date2]);

    checkDateWithFormat(date1, format, 'March 2010', assert);
});

QUnit.test('Year', function(assert) {
    const date1 = new Date(2010, 2, 30);
    const date2 = new Date(2012, 2, 30);
    const format = this.getDateFormatByTicks([date1, date2]);

    checkDateWithFormat(date1, format, '2010', assert);
});


QUnit.module('Get Date Format by Tick Interval');

QUnit.test('Year delta, no tickInterval', function(assert) {
    const date1 = new Date(2010, 2, 3, 4, 11, 41, 33);
    const date2 = new Date(2011, 2, 3, 4, 21, 44, 12);
    const format = getDateFormatByTickInterval(date1, date2, 0);

    checkDateWithFormat(date1, format, '3/3/2010 4:11:41 AM', assert);
});

QUnit.test('Month delta, no tickInterval', function(assert) {
    const date1 = new Date(2010, 2, 3, 4, 11, 41, 33);
    const date2 = new Date(2010, 3, 3, 4, 21, 44, 12);
    const format = getDateFormatByTickInterval(date1, date2, 0);

    checkDateWithFormat(date1, format, 'March 3 4:11:41 AM', assert);
});

QUnit.test('Day delta, no tickInterval', function(assert) {
    const date1 = new Date(2010, 2, 3, 4, 11, 41, 33);
    const date2 = new Date(2010, 2, 10, 4, 21, 44, 12);
    const format = getDateFormatByTickInterval(date1, date2, 0);

    checkDateWithFormat(date1, format, 'Wednesday, 3 4:11:41 AM', assert);
});

QUnit.test('Hour delta, no tickInterval', function(assert) {
    const date1 = new Date(2010, 2, 3, 4, 11, 41, 33);
    const date2 = new Date(2010, 2, 3, 8, 21, 44, 12);
    const format = getDateFormatByTickInterval(date1, date2, 0);

    checkDateWithFormat(date1, format, '4:11:41 AM', assert);
});

QUnit.test('Minute delta, no tickInterval', function(assert) {
    const date1 = new Date(2010, 2, 3, 4, 11, 41, 33);
    const date2 = new Date(2010, 2, 3, 4, 21, 44, 12);
    const format = getDateFormatByTickInterval(date1, date2, 0);

    checkDateWithFormat(date1, format, '4:11:41 AM', assert);
});

QUnit.test('Second delta, no tickInterval', function(assert) {
    const date1 = new Date(2010, 2, 3, 4, 11, 41, 33);
    const date2 = new Date(2010, 2, 3, 4, 11, 44, 12);
    const format = getDateFormatByTickInterval(date1, date2, 0);

    checkDateWithFormat(date1, format, '4:11:41 AM', assert);
});


QUnit.test('tickInterval as object', function(assert) {
    const date1 = new Date(2010, 2, 3, 4, 11, 41, 33);
    const date2 = new Date(2011, 2, 3, 4, 21, 44, 12);
    const format = getDateFormatByTickInterval(date1, date2, { month: 2, days: 5 });

    checkDateWithFormat(date1, format, 'March 2010', assert);
});


QUnit.test('Year delta, custom tickInterval', function(assert) {
    const date1 = new Date(2010, 3, 3, 4, 11, 41, 33);
    const date2 = new Date(2011, 3, 3, 4, 21, 44, 12);

    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'year'), '2010', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'quarter'), 'Q2 2010', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'month'), 'April 2010', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'week'), '4/3/2010', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'day'), '4/3/2010', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'hour'), '4/3/2010 4:11 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'minute'), '4/3/2010 4:11 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'second'), '4/3/2010 4:11:41 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'millisecond'), '4/3/2010 4:11:41 AM 033', assert);
});


QUnit.test('Month delta, custom tickInterval', function(assert) {
    const date1 = new Date(2010, 3, 3, 4, 11, 41, 33);
    const date2 = new Date(2010, 4, 3, 4, 21, 44, 12);

    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'year'), '2010', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'quarter'), 'Q2', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'month'), 'April', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'week'), 'April 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'day'), 'April 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'hour'), 'April 3 4:11 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'minute'), 'April 3 4:11 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'second'), 'April 3 4:11:41 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'millisecond'), 'April 3 4:11:41 AM 033', assert);
});

QUnit.test('Day delta, custom tickInterval', function(assert) {
    const date1 = new Date(2010, 3, 3, 4, 11, 41, 33);
    const date2 = new Date(2010, 3, 10, 4, 21, 44, 12);

    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'year'), '2010', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'quarter'), 'Q2', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'month'), 'April', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'week'), 'Saturday, 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'day'), 'Saturday, 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'hour'), 'Saturday, 3 4:11 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'minute'), 'Saturday, 3 4:11 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'second'), 'Saturday, 3 4:11:41 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'millisecond'), 'Saturday, 3 4:11:41 AM 033', assert);
});

QUnit.test('Hour delta, custom tickInterval', function(assert) {
    const date1 = new Date(2010, 3, 3, 4, 11, 41, 33);
    const date2 = new Date(2010, 3, 3, 8, 21, 44, 12);

    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'year'), '2010', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'quarter'), 'Q2', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'month'), 'April', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'week'), 'Saturday, 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'day'), 'Saturday, 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'hour'), '4:11 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'minute'), '4:11 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'second'), '4:11:41 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'millisecond'), '4:11:41 AM 033', assert);
});

QUnit.test('Minute delta, custom tickInterval', function(assert) {
    const date1 = new Date(2010, 3, 3, 4, 11, 41, 33);
    const date2 = new Date(2010, 3, 3, 4, 21, 44, 12);

    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'year'), '2010', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'quarter'), 'Q2', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'month'), 'April', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'week'), 'Saturday, 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'day'), 'Saturday, 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'hour'), '4:11 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'minute'), '4:11 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'second'), '4:11:41 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'millisecond'), '4:11:41 AM 033', assert);
});

QUnit.test('Second delta, custom tickInterval', function(assert) {
    const date1 = new Date(2010, 3, 3, 4, 11, 41, 33);
    const date2 = new Date(2010, 3, 3, 4, 11, 44, 12);

    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'year'), '2010', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'quarter'), 'Q2', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'month'), 'April', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'week'), 'Saturday, 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'day'), 'Saturday, 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'hour'), '4:11 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'minute'), '4:11 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'second'), '4:11:41 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'millisecond'), '4:11:41 AM 033', assert);
});

QUnit.test('Millisecond delta, custom tickInterval', function(assert) {
    const date1 = new Date(2010, 3, 3, 4, 11, 41, 33);
    const date2 = new Date(2010, 3, 3, 4, 11, 41, 50);

    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'year'), '2010', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'quarter'), 'Q2', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'month'), 'April', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'week'), 'Saturday, 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'day'), 'Saturday, 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'hour'), '4:11 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'minute'), '4:11 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'second'), '4:11:41 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'millisecond'), '033', assert);
});

// B230770
QUnit.test('Year delta when maxDate at start year', function(assert) {
    const date1 = new Date(2010, 3, 3);
    const date2 = new Date(2011, 0, 1);

    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'year'), '2010', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'quarter'), 'Q2', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'month'), 'April', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'week'), 'April 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'day'), 'April 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'hour'), 'April 3 12:00 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'minute'), 'April 3 12:00 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'second'), 'April 3 12:00:00 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'millisecond'), 'April 3 12:00:00 AM 000', assert);
});

QUnit.test('Year delta when maxDate at start year. inverted', function(assert) {
    const date1 = new Date(2011, 0, 1);
    const date2 = new Date(2010, 3, 3);

    checkDateWithFormat(date2, getDateFormatByTickInterval(date1, date2, 'year'), '2010', assert);
    checkDateWithFormat(date2, getDateFormatByTickInterval(date1, date2, 'quarter'), 'Q2', assert);
    checkDateWithFormat(date2, getDateFormatByTickInterval(date1, date2, 'month'), 'April', assert);
    checkDateWithFormat(date2, getDateFormatByTickInterval(date1, date2, 'week'), 'April 3', assert);
    checkDateWithFormat(date2, getDateFormatByTickInterval(date1, date2, 'day'), 'April 3', assert);
    checkDateWithFormat(date2, getDateFormatByTickInterval(date1, date2, 'hour'), 'April 3 12:00 AM', assert);
    checkDateWithFormat(date2, getDateFormatByTickInterval(date1, date2, 'minute'), 'April 3 12:00 AM', assert);
    checkDateWithFormat(date2, getDateFormatByTickInterval(date1, date2, 'second'), 'April 3 12:00:00 AM', assert);
    checkDateWithFormat(date2, getDateFormatByTickInterval(date1, date2, 'millisecond'), 'April 3 12:00:00 AM 000', assert);
});

QUnit.test('Month delta when maxDate at start month', function(assert) {
    const date1 = new Date(2010, 3, 3);
    const date2 = new Date(2010, 4, 1);

    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'year'), '2010', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'quarter'), 'Q2', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'month'), 'April', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'week'), 'Saturday, 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'day'), 'Saturday, 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'hour'), 'Saturday, 3 12:00 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'minute'), 'Saturday, 3 12:00 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'second'), 'Saturday, 3 12:00:00 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'millisecond'), 'Saturday, 3 12:00:00 AM 000', assert);
});

QUnit.test('Day delta when maxDate at start day', function(assert) {
    const date1 = new Date(2010, 3, 3, 8, 22);
    const date2 = new Date(2010, 3, 4);

    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'year'), '2010', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'quarter'), 'Q2', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'month'), 'April', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'week'), 'Saturday, 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'day'), 'Saturday, 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'hour'), '8:22 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'minute'), '8:22 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'second'), '8:22:00 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'millisecond'), '8:22:00 AM 000', assert);
});

QUnit.test('second delta when maxDate at start second', function(assert) {
    const date1 = new Date(2010, 3, 3, 8, 22, 30, 333);
    const date2 = new Date(2010, 3, 3, 8, 22, 31);

    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'year'), '2010', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'quarter'), 'Q2', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'month'), 'April', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'week'), 'Saturday, 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'day'), 'Saturday, 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'hour'), '8:22 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'minute'), '8:22 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'second'), '8:22:30 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'millisecond'), '333', assert);
});

QUnit.test('Case insensitive', function(assert) {
    const date1 = new Date(2010, 3, 3, 8, 22, 30, 333);
    const date2 = new Date(2010, 3, 3, 8, 22, 31);

    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'yEar'), '2010', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'qUarter'), 'Q2', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'moNth'), 'April', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'wEek'), 'Saturday, 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'daY'), 'Saturday, 3', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'hOur'), '8:22 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'minUte'), '8:22 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'seCond'), '8:22:30 AM', assert);
    checkDateWithFormat(date1, getDateFormatByTickInterval(date1, date2, 'miLLisecond'), '333', assert);
});

QUnit.module('Format method', function() {
    QUnit.test('format with invalid format should return value as string', function(assert) {
        assert.equal(formatHelper.format(123, ''), '123', 'Empty string format returns value.toString()');
        assert.equal(formatHelper.format(123, null), '123', 'Null format returns value.toString()');
        assert.equal(formatHelper.format(123, undefined), '123', 'Undefined format returns value.toString()');
    });

    QUnit.test('format with invalid value should return value as string or empty string', function(assert) {
        assert.equal(formatHelper.format('text', 'decimal'), 'text', 'String value with numeric format returns value.toString()');
        assert.equal(formatHelper.format(null, 'decimal'), '', 'Null value returns empty string');
        assert.equal(formatHelper.format(undefined, 'decimal'), '', 'Undefined value returns empty string');
    });

    QUnit.test('format with invalid Date should return value as string', function(assert) {
        const invalidDate = new Date('weekend');
        assert.equal(formatHelper.format(invalidDate, 'shortDate'), 'Invalid Date', 'Invalid Date returns "Invalid Date" string');
    });

    QUnit.test('format numeric value with string format', function(assert) {
        assert.equal(formatHelper.format(1234.5, 'decimal'), '1234.5', 'Decimal format');
        assert.equal(formatHelper.format(0.45, 'percent'), '45%', 'Percent format');
        assert.equal(formatHelper.format(1234.5, 'currency'), '$1,235', 'Currency format');
    });

    QUnit.test('format numeric value with object format', function(assert) {
        assert.equal(formatHelper.format(1234.567, { type: 'fixedPoint', precision: 2 }), '1,234.57', 'FixedPoint with precision');
        assert.equal(formatHelper.format(0.123, { type: 'percent', precision: 1 }), '12.3%', 'Percent with precision');
    });

    QUnit.test('format numeric value with function format', function(assert) {
        const customFormat = function(value) {
            return 'Custom: ' + value;
        };
        assert.equal(formatHelper.format(123, customFormat), 'Custom: 123', 'Function format');
    });

    QUnit.test('format date value with string format', function(assert) {
        const date = new Date(2017, 8, 5, 14, 30, 45);
        assert.equal(formatHelper.format(date, 'shortDate'), '9/5/2017', 'Short date format');
        assert.equal(formatHelper.format(date, 'shortTime'), '2:30 PM', 'Short time format');
    });

    QUnit.test('format date value with object format', function(assert) {
        const date = new Date(2017, 8, 5, 14, 30, 45);
        assert.equal(formatHelper.format(date, { type: 'shortDate' }), '9/5/2017', 'Short date format object');
        assert.equal(formatHelper.format(date, { type: 'longDate' }), 'Tuesday, September 5, 2017', 'Long date format object');
    });

    QUnit.test('format date value with function format', function(assert) {
        const date = new Date(2017, 8, 5);
        const customFormat = function(value) {
            return 'Year: ' + value.getFullYear();
        };
        assert.equal(formatHelper.format(date, customFormat), 'Year: 2017', 'Function format for date');
    });

    QUnit.test('format zero value', function(assert) {
        assert.equal(formatHelper.format(0, 'decimal'), '0', 'Zero with decimal format');
        assert.equal(formatHelper.format(0, 'percent'), '0%', 'Zero with percent format');
    });

    QUnit.test('format negative value', function(assert) {
        assert.equal(formatHelper.format(-123.45, 'fixedPoint'), '-123', 'Negative number with fixedPoint');
        assert.equal(formatHelper.format(-0.5, 'percent'), '-50%', 'Negative percent');
    });

    QUnit.test('format with custom format pattern', function(assert) {
        assert.equal(formatHelper.format(1234.5, '#,##0.00'), '1,234.50', 'Custom number pattern');
        const date = new Date(2017, 8, 5);
        assert.equal(formatHelper.format(date, 'yyyy-MM-dd'), '2017-09-05', 'Custom date pattern');
    });

    QUnit.test('format empty string value', function(assert) {
        assert.equal(formatHelper.format('', 'decimal'), '', 'Empty string returns empty string');
    });

    QUnit.test('format boolean value should return string', function(assert) {
        assert.equal(formatHelper.format(true, 'decimal'), 'true', 'Boolean true returns "true"');
        assert.equal(formatHelper.format(false, 'decimal'), 'false', 'Boolean false returns "false"');
    });
});

