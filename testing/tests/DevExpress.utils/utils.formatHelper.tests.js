var formatHelper = require('format_helper'),
    getDateFormatByTickInterval = formatHelper.getDateFormatByTickInterval;

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
    // arrange
    var date = new Date(2010, 5, 3, 4, 11, 34, 0),
        format = this.getDateFormatByTicks([date]);

    // assert
    checkDateWithFormat(date, format, '6/3/2010 4:11:34 AM', assert);
});

QUnit.test('short date and hour, minute, millisecond', function(assert) {
    // arrange
    var date = new Date(2010, 5, 3, 4, 0, 0, 770),
        format = this.getDateFormatByTicks([date]);

    // assert
    checkDateWithFormat(date, format, '6/3/2010 4:00 AM 770', assert);
});

QUnit.test('short date and hour, minute', function(assert) {
    // arrange
    var date = new Date(2010, 5, 3, 4, 11, 0, 0),
        format = this.getDateFormatByTicks([date]);

    // assert
    checkDateWithFormat(date, format, '6/3/2010 4:11 AM', assert);
});

QUnit.test('short date', function(assert) {
    // arrange
    var date = new Date(2010, 5, 3),
        format = this.getDateFormatByTicks([date]);

    // assert
    checkDateWithFormat(date, format, '6/3/2010', assert);
});

QUnit.test('Hour, minute, second', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 3, 4, 11, 41),
        date2 = new Date(2010, 2, 3, 4, 21, 44),
        format = this.getDateFormatByTicks([date1, date2]);

    // assert
    checkDateWithFormat(date1, format, '4:11:41 AM', assert);
});

QUnit.test('Millisecond', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 3, 4, 11, 41, 33),
        date2 = new Date(2010, 2, 3, 4, 11, 41, 50),
        format = this.getDateFormatByTicks([date1, date2]);

    // assert
    checkDateWithFormat(date1, format, '033', assert);
});

QUnit.test('Hour, minute', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 3, 4, 11, 44),
        date2 = new Date(2010, 2, 3, 4, 21, 44),
        format = this.getDateFormatByTicks([date1, date2]);

    // assert
    checkDateWithFormat(date1, format, '4:11 AM', assert);
});

QUnit.test('Day and hour, minute', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 3, 4, 54, 44),
        date2 = new Date(2010, 2, 4, 8, 1, 44),
        format = this.getDateFormatByTicks([date1, date2]);

    // assert
    checkDateWithFormat(date1, format, 'Wednesday, 3 4:54 AM', assert);
});

QUnit.test('Day and hour, minute, second', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 3, 4, 54, 44),
        date2 = new Date(2010, 2, 4, 8, 1, 10),
        format = this.getDateFormatByTicks([date1, date2]);

    // assert
    checkDateWithFormat(date1, format, 'Wednesday, 3 4:54:44 AM', assert);
});

QUnit.test('Day', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 3),
        date2 = new Date(2010, 2, 11),
        format = this.getDateFormatByTicks([date1, date2]);

    // assert
    checkDateWithFormat(date1, format, 'Wednesday, 3', assert);
});

QUnit.test('Month and day, hour, minute, second', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 30, 1, 23, 12),
        date2 = new Date(2010, 3, 2, 3, 53, 15),
        format = this.getDateFormatByTicks([date1, date2]);

    // assert
    checkDateWithFormat(date1, format, 'March 30 1:23:12 AM', assert);
});

QUnit.test('Month and day, hour, minute', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 30, 1, 23, 12),
        date2 = new Date(2010, 3, 2, 3, 53, 12),
        format = this.getDateFormatByTicks([date1, date2]);

    // assert
    checkDateWithFormat(date1, format, 'March 30 1:23 AM', assert);
});

QUnit.test('Month and day', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 30),
        date2 = new Date(2010, 3, 2),
        format = this.getDateFormatByTicks([date1, date2]);

    // assert
    checkDateWithFormat(date1, format, 'March 30', assert);
});

QUnit.test('Month', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 30),
        date2 = new Date(2010, 3, 30),
        format = this.getDateFormatByTicks([date1, date2]);

    // assert
    checkDateWithFormat(date1, format, 'March', assert);
});

QUnit.test('Year, month, day, hour, minute, second', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 30, 3, 34, 23),
        date2 = new Date(2012, 3, 2, 5, 45, 21),
        format = this.getDateFormatByTicks([date1, date2]);

    // assert
    checkDateWithFormat(date1, format, '3/30/2010 3:34:23 AM', assert);
});

QUnit.test('Year, month, day, hour, minute', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 30, 3, 34, 23),
        date2 = new Date(2012, 3, 2, 5, 45, 23),
        format = this.getDateFormatByTicks([date1, date2]);

    // assert
    checkDateWithFormat(date1, format, '3/30/2010 3:34 AM', assert);
});

QUnit.test('Year, month, day', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 30, 3, 34, 23),
        date2 = new Date(2012, 3, 2, 3, 34, 23),
        format = this.getDateFormatByTicks([date1, date2]);

    // assert
    checkDateWithFormat(date1, format, '3/30/2010', assert);
});

QUnit.test('Year, month', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 30, 3, 34, 23),
        date2 = new Date(2012, 3, 30, 3, 34, 23),
        format = this.getDateFormatByTicks([date1, date2]);

    // assert
    checkDateWithFormat(date1, format, 'March 2010', assert);
});

QUnit.test('Year', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 30),
        date2 = new Date(2012, 2, 30),
        format = this.getDateFormatByTicks([date1, date2]);

    // assert
    checkDateWithFormat(date1, format, '2010', assert);
});


QUnit.module('Get Date Format by Tick Interval');

QUnit.test('Year delta, no tickInterval', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 3, 4, 11, 41, 33),
        date2 = new Date(2011, 2, 3, 4, 21, 44, 12),
        format = getDateFormatByTickInterval(date1, date2, 0);

    // assert
    checkDateWithFormat(date1, format, '3/3/2010 4:11:41 AM', assert);
});

QUnit.test('Month delta, no tickInterval', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 3, 4, 11, 41, 33),
        date2 = new Date(2010, 3, 3, 4, 21, 44, 12),
        format = getDateFormatByTickInterval(date1, date2, 0);

    // assert
    checkDateWithFormat(date1, format, 'March 3 4:11:41 AM', assert);
});

QUnit.test('Day delta, no tickInterval', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 3, 4, 11, 41, 33),
        date2 = new Date(2010, 2, 10, 4, 21, 44, 12),
        format = getDateFormatByTickInterval(date1, date2, 0);

    // assert
    checkDateWithFormat(date1, format, 'Wednesday, 3 4:11:41 AM', assert);
});

QUnit.test('Hour delta, no tickInterval', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 3, 4, 11, 41, 33),
        date2 = new Date(2010, 2, 3, 8, 21, 44, 12),
        format = getDateFormatByTickInterval(date1, date2, 0);

    // assert
    checkDateWithFormat(date1, format, '4:11:41 AM', assert);
});

QUnit.test('Minute delta, no tickInterval', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 3, 4, 11, 41, 33),
        date2 = new Date(2010, 2, 3, 4, 21, 44, 12),
        format = getDateFormatByTickInterval(date1, date2, 0);

    // assert
    checkDateWithFormat(date1, format, '4:11:41 AM', assert);
});

QUnit.test('Second delta, no tickInterval', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 3, 4, 11, 41, 33),
        date2 = new Date(2010, 2, 3, 4, 11, 44, 12),
        format = getDateFormatByTickInterval(date1, date2, 0);

    // assert
    checkDateWithFormat(date1, format, '4:11:41 AM', assert);
});


QUnit.test('tickInterval as object', function(assert) {
    // arrange
    var date1 = new Date(2010, 2, 3, 4, 11, 41, 33),
        date2 = new Date(2011, 2, 3, 4, 21, 44, 12),
        format = getDateFormatByTickInterval(date1, date2, { month: 2, days: 5 });

    // assert
    checkDateWithFormat(date1, format, 'March 2010', assert);
});


QUnit.test('Year delta, custom tickInterval', function(assert) {
    // arrange
    var date1 = new Date(2010, 3, 3, 4, 11, 41, 33),
        date2 = new Date(2011, 3, 3, 4, 21, 44, 12);

    // assert
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
    // arrange
    var date1 = new Date(2010, 3, 3, 4, 11, 41, 33),
        date2 = new Date(2010, 4, 3, 4, 21, 44, 12);

    // assert
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
    // arrange
    var date1 = new Date(2010, 3, 3, 4, 11, 41, 33),
        date2 = new Date(2010, 3, 10, 4, 21, 44, 12);

    // assert
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
    // arrange
    var date1 = new Date(2010, 3, 3, 4, 11, 41, 33),
        date2 = new Date(2010, 3, 3, 8, 21, 44, 12);

    // assert
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
    // arrange
    var date1 = new Date(2010, 3, 3, 4, 11, 41, 33),
        date2 = new Date(2010, 3, 3, 4, 21, 44, 12);

    // assert
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
    // arrange
    var date1 = new Date(2010, 3, 3, 4, 11, 41, 33),
        date2 = new Date(2010, 3, 3, 4, 11, 44, 12);

    // assert
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
    // arrange
    var date1 = new Date(2010, 3, 3, 4, 11, 41, 33),
        date2 = new Date(2010, 3, 3, 4, 11, 41, 50);

    // assert
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
    // arrange
    var date1 = new Date(2010, 3, 3),
        date2 = new Date(2011, 0, 1);

    // assert
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
    // arrange
    var date1 = new Date(2011, 0, 1),
        date2 = new Date(2010, 3, 3);

    // assert
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
    // arrange
    var date1 = new Date(2010, 3, 3),
        date2 = new Date(2010, 4, 1);

    // assert
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
    // arrange
    var date1 = new Date(2010, 3, 3, 8, 22),
        date2 = new Date(2010, 3, 4);

    // assert
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
    // arrange
    var date1 = new Date(2010, 3, 3, 8, 22, 30, 333),
        date2 = new Date(2010, 3, 3, 8, 22, 31);

    // assert
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
    // arrange
    var date1 = new Date(2010, 3, 3, 8, 22, 30, 333),
        date2 = new Date(2010, 3, 3, 8, 22, 31);

    // assert
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
