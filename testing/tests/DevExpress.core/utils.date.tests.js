var dateUtils = require("core/utils/date");

QUnit.module('normalizeDate', {
    beforeEach: function() {
        this.normalizeDate = dateUtils.normalizeDate;
    }
});

QUnit.test('normalizeDate', function(assert) {
    var currentDate = new Date(100000),
        minDate = new Date(currentDate.valueOf() - 1000),
        maxDate = new Date(currentDate.valueOf() + 1000);

    assert.equal(this.normalizeDate(currentDate, minDate, maxDate), currentDate);
    assert.equal(this.normalizeDate(currentDate, minDate, null), currentDate);
    assert.equal(this.normalizeDate(currentDate, null, maxDate), currentDate);
    assert.equal(this.normalizeDate(currentDate, null, null), currentDate);
    assert.equal(this.normalizeDate(currentDate, maxDate, null), maxDate);
    assert.equal(this.normalizeDate(currentDate, null, minDate), minDate);
});

QUnit.test('normalizeDateByWeek', function(assert) {
    var date = new Date(2016, 0, 15),
        dateOfWeek = new Date(2016, 0, 12),
        dateOfPrevWeek = new Date(2016, 0, 9);

    assert.deepEqual(dateUtils.normalizeDateByWeek(dateOfWeek, date), dateOfWeek);
    assert.deepEqual(dateUtils.normalizeDateByWeek(dateOfPrevWeek, date), new Date(2016, 0, 16));
});

QUnit.module('dateInRange', {
    beforeEach: function() {
        this.dateInRange = dateUtils.dateInRange;
    }
});

QUnit.test('dateInRange, date is in range', function(assert) {
    var date = new Date(2016, 0, 15),
        min = new Date(2016, 0, 12),
        max = new Date(2016, 0, 17);

    assert.ok(this.dateInRange(date, min, max, "date"));
});

QUnit.test('dateInRange, date is out of range', function(assert) {
    var date = new Date(2016, 0, 11),
        min = new Date(2016, 0, 12),
        max = new Date(2016, 0, 17);

    assert.notOk(this.dateInRange(date, min, max, "date"));
});

QUnit.test('dateInRange, year of date is less than 100', function(assert) {
    var date = new Date(99, 0, 11),
        min = new Date(1900, 0, 12),
        max = new Date(2016, 0, 17);

    date.setFullYear(99);
    assert.notOk(this.dateInRange(date, min, max, "date"));
});

QUnit.module('DateTime functions', {
    beforeEach: function() {
        this.getDateIntervalByString = dateUtils.getDateIntervalByString;
    }
});

QUnit.test('getIntervalByString year', function(assert) {
    // act, assert
    assert.deepEqual(this.getDateIntervalByString('year'), { years: 1 });
});

QUnit.test('getIntervalByString month', function(assert) {
    // act, assert
    assert.deepEqual(this.getDateIntervalByString('month'), { months: 1 });
});

QUnit.test('getIntervalByString quarter', function(assert) {
    // act, assert
    assert.deepEqual(this.getDateIntervalByString('quarter'), { months: 3 });
});

QUnit.test('getIntervalByString week', function(assert) {
    // act, assert
    assert.deepEqual(this.getDateIntervalByString('week'), { weeks: 1 });
});

QUnit.test('getIntervalByString day', function(assert) {
    // act, assert
    assert.deepEqual(this.getDateIntervalByString('day'), { days: 1 });
});

QUnit.test('getIntervalByString hour', function(assert) {
    // act, assert
    assert.deepEqual(this.getDateIntervalByString('hour'), { hours: 1 });
});

QUnit.test('getIntervalByString minute', function(assert) {
    // act, assert
    assert.deepEqual(this.getDateIntervalByString('minute'), { minutes: 1 });
});

QUnit.test('getIntervalByString second', function(assert) {
    // act, assert
    assert.deepEqual(this.getDateIntervalByString('second'), { seconds: 1 });
});

QUnit.test('add negative Interval number', function(assert) {
    // arrange, act
    var newNumber = dateUtils.addInterval(11, 5, true);

    // assert
    assert.deepEqual(newNumber, 6);
});

QUnit.test('add negative day', function(assert) {
    // arrange, act
    var newDate = dateUtils.addInterval(new Date(2012, 2, 2), 'day', true);

    // assert
    assert.deepEqual(newDate, new Date(2012, 2, 1));
});

QUnit.test('add negative day overflow', function(assert) {
    // arrange, act
    var newDate = dateUtils.addInterval(new Date(2012, 1, 1), 'day', true);

    // assert
    assert.deepEqual(newDate, new Date(2012, 0, 31));
});

QUnit.test('addInterval number', function(assert) {
    // arrange, act
    var newNumber = dateUtils.addInterval(5, 6);

    // assert
    assert.deepEqual(newNumber, 11);
});

QUnit.test('addInterval day', function(assert) {
    // arrange, act
    var newDate = dateUtils.addInterval(new Date(2012, 2, 2), 'day');

    // assert
    assert.deepEqual(newDate, new Date(2012, 2, 3));
});

QUnit.test('addInterval day overflow', function(assert) {
    // arrange, act
    var newDate = dateUtils.addInterval(new Date(2012, 0, 31), 'day');

    // assert
    assert.deepEqual(newDate, new Date(2012, 1, 1));
});


QUnit.test('addInterval date object', function(assert) {
    // arrange, act
    var newDate = dateUtils.addInterval(new Date(2012, 1, 1, 1, 1, 1, 1), {
        years: 1,
        months: 2,
        days: 3,
        hours: 4,
        minutes: 5,
        seconds: 6,
        milliseconds: 7
    });

    // assert
    assert.deepEqual(newDate, new Date(2013, 3, 4, 5, 6, 7, 8));
});

QUnit.test('addInterval date object (with timezone)', function(assert) {
    // arrange, act
    var newDate = dateUtils.addInterval(new Date("2017-10-29T01:55:00+01:00"), {
        minutes: 5,
        seconds: 6,
        milliseconds: 7
    });

    // assert
    assert.deepEqual(newDate.getTime(), 1509238806007);
});

QUnit.test('addInterval date object overflow', function(assert) {
    // arrange, act
    var newDate = dateUtils.addInterval(new Date(2012, 12, 1, 1, 1, 1, 1), {
        years: 1,
        months: 2,
        days: 3,
        hours: 4,
        minutes: 5,
        seconds: 6,
        milliseconds: 7
    });

    // assert
    assert.deepEqual(newDate, new Date(2014, 2, 4, 5, 6, 7, 8));
});
QUnit.test('addInterval date object overflow', function(assert) {
    // arrange, act
    var newDate = dateUtils.addInterval(new Date(2012, 12, 1, 1, 1, 1, 1), {
        years: 1,
        months: 2,
        days: 3,
        hours: 4,
        minutes: 5,
        seconds: 6,
        milliseconds: 7
    });

    // assert
    assert.deepEqual(newDate, new Date(2014, 2, 4, 5, 6, 7, 8));
});

QUnit.test('addInterval day overflow', function(assert) {
    // arrange, act
    var newDate = dateUtils.addInterval(new Date(2012, 0, 31), 'Day');

    // assert
    assert.deepEqual(newDate, new Date(2012, 1, 1));
});

QUnit.test('addInterval date with numeric interval', function(assert) {
    // arrange, act
    var newDate = dateUtils.addInterval(new Date(2012, 2, 2), 24 * 60 * 60 * 1000);

    // assert
    assert.deepEqual(newDate, new Date(2012, 2, 3));
});

QUnit.test('getDateUnitInterval with millisecond tickInterval', function(assert) {
    // arrange
    var getDateUnitInterval = dateUtils.getDateUnitInterval,
        tickInterval = {
            milliseconds: 33
        };
    // assert
    assert.equal(getDateUnitInterval(tickInterval), 'millisecond');
});
QUnit.test('getDateUnitInterval with minute tickInterval', function(assert) {
    // arrange
    var getDateUnitInterval = dateUtils.getDateUnitInterval,
        tickInterval = {
            milliseconds: 122,
            seconds: 33,
            minutes: 17
        };
    // assert
    assert.equal(getDateUnitInterval(tickInterval), 'minute');
});
QUnit.test('getDateUnitInterval with zero minutes and some seconds tickInterval', function(assert) {
    // arrange
    var getDateUnitInterval = dateUtils.getDateUnitInterval,
        tickInterval = {
            milliseconds: 122,
            seconds: 33,
            minutes: 0
        };
    // assert
    assert.equal(getDateUnitInterval(tickInterval), 'second');
});
QUnit.test('getDateUnitInterval with dateDifferences style tickInterval', function(assert) {
    // arrange
    var getDateUnitInterval = dateUtils.getDateUnitInterval,
        tickInterval = {
            millisecond: true,
            second: true,
            minute: false
        };
    // assert
    assert.equal(getDateUnitInterval(tickInterval), 'second');
});
QUnit.test('getDateUnitInterval with hour tickInterval', function(assert) {
    // arrange
    var getDateUnitInterval = dateUtils.getDateUnitInterval,
        tickInterval = {
            milliseconds: 998,
            hours: 12,
            seconds: 33,
            minutes: 17
        };
    // assert
    assert.equal(getDateUnitInterval(tickInterval), 'hour');
});
QUnit.test('getDateUnitInterval with day tickInterval', function(assert) {
    // arrange
    var getDateUnitInterval = dateUtils.getDateUnitInterval,
        tickInterval = {
            hours: 12,
            seconds: 33,
            days: 17
        };
    // assert
    assert.equal(getDateUnitInterval(tickInterval), 'day');
});
QUnit.test('getDateUnitInterval with week tickInterval', function(assert) {
    // arrange
    var getDateUnitInterval = dateUtils.getDateUnitInterval,
        tickInterval = {
            weeks: 3,
            hours: 12,
            seconds: 33,
            days: 17
        };
    // assert
    assert.equal(getDateUnitInterval(tickInterval), 'week');
});
QUnit.test('getDateUnitInterval with month tickInterval', function(assert) {
    // arrange
    var getDateUnitInterval = dateUtils.getDateUnitInterval,
        tickInterval = {
            weeks: 3,
            hours: 12,
            months: 3,
            days: 17
        };
    // assert
    assert.equal(getDateUnitInterval(tickInterval), 'month');
});
QUnit.test('getDateUnitInterval with year tickInterval', function(assert) {
    // arrange
    var getDateUnitInterval = dateUtils.getDateUnitInterval,
        tickInterval = {
            weeks: 3,
            hours: 12,
            months: 3,
            years: 17
        };
    // assert
    assert.equal(getDateUnitInterval(tickInterval), 'year');
});

QUnit.test("fixTimezoneGap should work correctly with null oldDate", function(assert) {
    var newDate = new Date();
    dateUtils.fixTimezoneGap(null, newDate);

    assert.ok(newDate);
});

QUnit.test("getTimezonesDifference should return difference between dates with different timezones", function(assert) {
    var minDate = new Date("Thu Mar 10 2016 00:00:00 GMT-0500"),
        maxDate = new Date("Mon Mar 15 2016 00:00:00 GMT-0400");

    assert.equal(dateUtils.getTimezonesDifference(minDate, maxDate), (maxDate.getTimezoneOffset() - minDate.getTimezoneOffset()) * 60000, "timezone offset is correct");
});

QUnit.test("Get dates interval in year", function(assert) {
    var interval = dateUtils.getDatesInterval(new Date(2010, 1, 29), new Date(2015, 5, 30), "year");

    assert.equal(interval, 5, "Years interval is OK");
});

QUnit.test("Get dates interval in quarter", function(assert) {
    var interval = dateUtils.getDatesInterval(new Date(2015, 1, 29), new Date(2015, 5, 30), "quarter");

    assert.equal(interval, 1, "Quarters interval is OK");
});

QUnit.test("Get dates interval in month", function(assert) {
    var interval = dateUtils.getDatesInterval(new Date(2015, 6, 29), new Date(2015, 7, 30), "month");

    assert.equal(interval, 1, "Months interval is OK");
});

QUnit.test("Get dates interval in week", function(assert) {
    var interval = dateUtils.getDatesInterval(new Date(2015, 7, 7), new Date(2015, 7, 30), "week");

    assert.equal(interval, 3, "Weeks interval is OK");
});

QUnit.test("Get dates interval in days", function(assert) {
    var interval = dateUtils.getDatesInterval(new Date(2015, 7, 27), new Date(2015, 7, 30), "day");

    assert.equal(interval, 3, "Days interval is OK");
});

QUnit.test("Get dates interval in hours", function(assert) {
    var interval = dateUtils.getDatesInterval(new Date(2015, 7, 27), new Date(2015, 7, 30), "hour");

    assert.equal(interval, 72, "Hours interval is OK");
});

QUnit.test("Get dates interval in minutes", function(assert) {
    var interval = dateUtils.getDatesInterval(new Date(2015, 7, 27), new Date(2015, 7, 30), "minute");

    assert.equal(interval, 4320, "Minutes interval is OK");
});

QUnit.test("Get dates interval in seconds", function(assert) {
    var interval = dateUtils.getDatesInterval(new Date(2015, 7, 27, 0, 0, 5), new Date(2015, 7, 27, 0, 0, 15), "second");

    assert.equal(interval, 10, "Seconds interval is OK");
});

QUnit.test("Get dates interval in milliseconds", function(assert) {
    var interval = dateUtils.getDatesInterval(new Date(2015, 7, 27, 0, 0, 5), new Date(2015, 7, 27, 0, 0, 15), "millisecond");

    assert.equal(interval, 10000, "Milliseconds interval is OK");
});

QUnit.test("Get dates interval in milliseconds should be used by default", function(assert) {
    var interval = dateUtils.getDatesInterval(new Date(2015, 7, 27, 0, 0, 5), new Date(2015, 7, 27, 0, 0, 15));

    assert.equal(interval, 10000, "Milliseconds interval is OK");
});

QUnit.module('Convert date unit to milliseconds');

QUnit.test('millisecond', function(assert) {
    assert.equal(dateUtils.convertDateUnitToMilliseconds('millisecond', 876), 876, 'milliseconds');
});
QUnit.test('second', function(assert) {
    assert.equal(dateUtils.convertDateUnitToMilliseconds('second', 33), 33000, 'seconds');
});
QUnit.test('minute', function(assert) {
    assert.equal(dateUtils.convertDateUnitToMilliseconds('minute', 15), 900000, 'minutes');
});
QUnit.test('hour', function(assert) {
    assert.equal(dateUtils.convertDateUnitToMilliseconds('hour', 2), 7200000, 'hours');
});
QUnit.test('day', function(assert) {
    assert.equal(dateUtils.convertDateUnitToMilliseconds('day', 3), 259200000, 'days');
});
QUnit.test('week', function(assert) {
    assert.equal(dateUtils.convertDateUnitToMilliseconds('week', 1), 604800000, 'week');
});
QUnit.test('month', function(assert) {
    assert.equal(dateUtils.convertDateUnitToMilliseconds('month', 1), 2592000000, 'months');
});
QUnit.test('quarter', function(assert) {
    assert.equal(dateUtils.convertDateUnitToMilliseconds('quarter', 2), 15552000000, 'quarter');
});
QUnit.test('year', function(assert) {
    assert.equal(dateUtils.convertDateUnitToMilliseconds('year', 2), 63072000000, 'years');
});

QUnit.test('convertMillisecondsToDateUnits', function(assert) {
    // arrange
    var convertMillisecondsToDateUnits = dateUtils.convertMillisecondsToDateUnits;
    // assert
    assert.deepEqual(convertMillisecondsToDateUnits(new Date(Date.UTC(2010, 1, 3)) - new Date(Date.UTC(2010, 1, 1))), { days: 2 }, 'days interval');
    assert.deepEqual(convertMillisecondsToDateUnits(new Date(Date.UTC(2010, 9, 14)) - new Date(Date.UTC(2010, 4, 14))), { days: 3, months: 5 }, 'months and days');
    assert.deepEqual(convertMillisecondsToDateUnits(new Date(Date.UTC(2010, 9, 14)) - new Date(Date.UTC(2010, 8, 14))), { months: 1 }, 'months');
    assert.deepEqual(convertMillisecondsToDateUnits(new Date(Date.UTC(2010, 9, 14, 3, 30)) - new Date(Date.UTC(2010, 9, 14, 1, 30))), { hours: 2 }, 'hours');
    assert.deepEqual(convertMillisecondsToDateUnits(new Date(Date.UTC(2008, 9, 14, 1, 30, 45)) - new Date(Date.UTC(2007, 4, 14, 1, 30, 45))), { days: 4, months: 5, years: 1 }, 'big interval');
    assert.deepEqual(convertMillisecondsToDateUnits(new Date(Date.UTC(2008, 9, 14, 0, 0, 0)) - new Date(Date.UTC(2008, 4, 10, 1, 30, 45))), { seconds: 15, minutes: 29, hours: 22, days: 6, months: 5 });
});

QUnit.test('correctDateWithUnitBeginning without gap correction', function(assert) {
    // arrange
    var date = new Date(2013, 5, 20, 5, 26, 35, 222),
        correct = dateUtils.correctDateWithUnitBeginning;

    // assert
    var millisecondsDate = correct(new Date(date.getTime()), "millisecond");
    assert.deepEqual(millisecondsDate, new Date(2013, 5, 20, 5, 26, 35, 222), 'milliseconds');

    var secondsDate = correct(new Date(date.getTime()), "second");
    assert.deepEqual(secondsDate, new Date(2013, 5, 20, 5, 26, 35), 'seconds');

    var minutesDate = correct(new Date(date.getTime()), "minute");
    assert.deepEqual(minutesDate, new Date(2013, 5, 20, 5, 26), 'minutes');

    var hoursDate = correct(new Date(date.getTime()), "hour");
    assert.deepEqual(hoursDate, new Date(2013, 5, 20, 5), 'hours');

    var daysDate = correct(new Date(date.getTime()), "day");
    assert.deepEqual(daysDate, new Date(2013, 5, 20), 'days');

    var weeksDate = correct(new Date(date.getTime()), "week");
    assert.deepEqual(weeksDate, new Date(2013, 5, 16), 'weeks');

    var monthsDate = correct(new Date(date.getTime()), "month");
    assert.deepEqual(monthsDate, new Date(2013, 5, 1), 'months');

    var quartersDate = correct(new Date(date.getTime()), "quarter");
    assert.deepEqual(quartersDate, new Date(2013, 3, 1), 'quarters');

    var yearsDate = correct(new Date(date.getTime()), "year");
    assert.deepEqual(yearsDate, new Date(2013, 0, 1), 'years');
});

QUnit.test('correctDateWithUnitBeginning with gap correction', function(assert) {
    // arrange
    var date = new Date(2013, 5, 20, 5, 26, 35, 222),
        correct = dateUtils.correctDateWithUnitBeginning;

    // assert
    var millisecondsDate = correct(new Date(date.getTime()), "millisecond", true);
    assert.deepEqual(millisecondsDate, new Date(2013, 5, 20, 5, 26, 35, 222), 'milliseconds');

    var secondsDate = correct(new Date(date.getTime()), "second", true);
    assert.deepEqual(secondsDate, new Date(2013, 5, 20, 5, 26, 35), 'seconds');

    var minutesDate = correct(new Date(date.getTime()), "minute", true);
    assert.deepEqual(minutesDate, new Date(2013, 5, 20, 5, 26), 'minutes');

    var hoursDate = correct(new Date(date.getTime()), "hour", true);
    assert.deepEqual(hoursDate, new Date(2013, 5, 20, 5), 'hours');

    var daysDate = correct(new Date(date.getTime()), "day", true);
    assert.deepEqual(daysDate, new Date(2013, 5, 20, 1), 'days');

    var weeksDate = correct(new Date(date.getTime()), "week", true);
    assert.deepEqual(weeksDate, new Date(2013, 5, 16, 1), 'weeks');

    var monthsDate = correct(new Date(date.getTime()), "month", true);
    assert.deepEqual(monthsDate, new Date(2013, 5, 1, 1), 'months');

    var quartersDate = correct(new Date(date.getTime()), "quarter", true);
    assert.deepEqual(quartersDate, new Date(2013, 3, 1, 1), 'quarters');

    var yearsDate = correct(new Date(date.getTime()), "year", true);
    assert.deepEqual(yearsDate, new Date(2013, 0, 1, 1), 'years');
});

QUnit.test("trimming time of date", function(assert) {
    var date = new Date(2015, 7, 16, 2, 30);

    assert.deepEqual(dateUtils.trimTime(date), new Date(2015, 7, 16), "Date is correct after time trimming");
});

QUnit.test("setting to the day end", function(assert) {
    var date = new Date(2015, 7, 16, 2, 30, 17, 100);

    assert.deepEqual(dateUtils.setToDayEnd(date), new Date(2015, 7, 16, 23, 59, 59, 999), "Date is correct after time setting day end");
});

QUnit.test("rounding date by startDayHour", function(assert) {
    var date = new Date(2015, 7, 16, 8, 30);

    var result = dateUtils.roundDateByStartDayHour(date, 9.5);

    assert.deepEqual(result, new Date(2015, 7, 16, 9, 30), "Date is correct after time trimming");
});

QUnit.module('Quarter number for different months');

QUnit.test('quarter 1', function(assert) {
    assert.equal(dateUtils.getQuarter(0), 0, '1 month');
    assert.equal(dateUtils.getQuarter(1), 0, '2 month');
    assert.equal(dateUtils.getQuarter(2), 0, '3 month');
});

QUnit.test('quarter 2', function(assert) {
    assert.equal(dateUtils.getQuarter(3), 1, '4 month');
    assert.equal(dateUtils.getQuarter(4), 1, '5 month');
    assert.equal(dateUtils.getQuarter(5), 1, '6 month');
});

QUnit.test('quarter 3', function(assert) {
    assert.equal(dateUtils.getQuarter(6), 2, '7 month');
    assert.equal(dateUtils.getQuarter(7), 2, '8 month');
    assert.equal(dateUtils.getQuarter(8), 2, '9 month');
});

QUnit.test('quarter 4', function(assert) {
    assert.equal(dateUtils.getQuarter(9), 3, '10 month');
    assert.equal(dateUtils.getQuarter(10), 3, '11 month');
    assert.equal(dateUtils.getQuarter(11), 3, '12 month');
});


QUnit.module("Periods");

QUnit.test("getViewMinBoundaryDate", function(assert) {
    var initialDate = new Date(2015, 8, 16);
    var resultDate = dateUtils.getViewMinBoundaryDate("month", initialDate);
    assert.deepEqual(resultDate, new Date(2015, 8, 1), "first day is set month");

    resultDate = dateUtils.getViewMinBoundaryDate("year", initialDate);
    assert.deepEqual(resultDate, new Date(2015, 0, 1), "first day and first month are set for year");

    resultDate = dateUtils.getViewMinBoundaryDate("decade", initialDate);
    assert.deepEqual(resultDate, new Date(2010, 0, 1), "first year, first month and first day are set for decade");

    resultDate = dateUtils.getViewMinBoundaryDate("century", initialDate);
    assert.deepEqual(resultDate, new Date(2000, 0, 1), "first decade, first year, first month and first day are set for century");
});

QUnit.test("getViewMaxBoundaryDate", function(assert) {
    var initialDate = new Date(2015, 8, 16);
    var resultDate = dateUtils.getViewMaxBoundaryDate("month", initialDate);
    assert.deepEqual(resultDate, new Date(2015, 8, 30), "last day is set for month");

    resultDate = dateUtils.getViewMaxBoundaryDate("year", initialDate);
    assert.deepEqual(resultDate, new Date(2015, 11, 31), "last day and last month are set for year");

    resultDate = dateUtils.getViewMaxBoundaryDate("decade", initialDate);
    assert.deepEqual(resultDate, new Date(2019, 11, 31), "last year, last month and last day are set for decade");

    resultDate = dateUtils.getViewMaxBoundaryDate("century", initialDate);
    assert.deepEqual(resultDate, new Date(2099, 11, 31), "last decade, last year, last month and last day are set for century");
});

QUnit.test("the getViewMaxBoundaryDate method is should be return value with corrected time", function(assert) {
    var initialDate = new Date(2018, 7, 31, 12, 13, 23);
    var resultDate = dateUtils.getViewMaxBoundaryDate("month", initialDate);
    assert.deepEqual(resultDate, new Date(initialDate), "last day of a month should be equal to an initial date and a time");
});

QUnit.test("the getDatesOfInterval method should return array of dates", function(assert) {
    var startDate = new Date(2018, 7, 31, 12, 13, 0),
        endDate = new Date(2018, 8, 5, 12, 13, 0);

    var dates = dateUtils.getDatesOfInterval(startDate, endDate, "day");

    assert.equal(dates.length, 5);
    assert.deepEqual(dates[0], new Date(2018, 7, 31, 12, 13, 0), "Date in interval is correct");
    assert.deepEqual(dates[1], new Date(2018, 8, 1, 12, 13, 0), "Date in interval is correct");
    assert.deepEqual(dates[2], new Date(2018, 8, 2, 12, 13, 0), "Date in interval is correct");
    assert.deepEqual(dates[3], new Date(2018, 8, 3, 12, 13, 0), "Date in interval is correct");
    assert.deepEqual(dates[4], new Date(2018, 8, 4, 12, 13, 0), "Date in interval is correct");
});

QUnit.test('the getDatesOfInterval method should return firstDate if firstDate=lastDate(T845632)', function(assert) {
    const startDate = new Date(2018, 7, 31, 12, 13, 0);
    const endDate = new Date(2018, 7, 31, 12, 13, 0);

    const dates = dateUtils.getDatesOfInterval(startDate, endDate, 'day');

    assert.equal(dates.length, 1);
    assert.deepEqual(dates[0], new Date(2018, 7, 31, 12, 13, 0), 'Date in interval is correct');
});
