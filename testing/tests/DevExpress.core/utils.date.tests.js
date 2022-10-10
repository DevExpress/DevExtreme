const dateUtils = require('core/utils/date');

const WEEK_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

QUnit.module('normalizeDate', {
    beforeEach: function() {
        this.normalizeDate = dateUtils.normalizeDate;
    }
});

QUnit.test('normalizeDate', function(assert) {
    const currentDate = new Date(100000);
    const minDate = new Date(currentDate.valueOf() - 1000);
    const maxDate = new Date(currentDate.valueOf() + 1000);

    assert.equal(this.normalizeDate(currentDate, minDate, maxDate), currentDate);
    assert.equal(this.normalizeDate(currentDate, minDate, null), currentDate);
    assert.equal(this.normalizeDate(currentDate, null, maxDate), currentDate);
    assert.equal(this.normalizeDate(currentDate, null, null), currentDate);
    assert.equal(this.normalizeDate(currentDate, maxDate, null), maxDate);
    assert.equal(this.normalizeDate(currentDate, null, minDate), minDate);
});

QUnit.test('normalizeDateByWeek', function(assert) {
    const date = new Date(2016, 0, 15);
    const dateOfWeek = new Date(2016, 0, 12);
    const dateOfPrevWeek = new Date(2016, 0, 9);

    assert.deepEqual(dateUtils.normalizeDateByWeek(dateOfWeek, date), dateOfWeek);
    assert.deepEqual(dateUtils.normalizeDateByWeek(dateOfPrevWeek, date), new Date(2016, 0, 16));
});

QUnit.module('dateInRange', {
    beforeEach: function() {
        this.dateInRange = dateUtils.dateInRange;
    }
});

QUnit.test('dateInRange, date is in range', function(assert) {
    const date = new Date(2016, 0, 15);
    const min = new Date(2016, 0, 12);
    const max = new Date(2016, 0, 17);

    assert.ok(this.dateInRange(date, min, max, 'date'));
});

QUnit.test('dateInRange, date is out of range', function(assert) {
    const date = new Date(2016, 0, 11);
    const min = new Date(2016, 0, 12);
    const max = new Date(2016, 0, 17);

    assert.notOk(this.dateInRange(date, min, max, 'date'));
});

QUnit.test('dateInRange, year of date is less than 100', function(assert) {
    const date = new Date(99, 0, 11);
    const min = new Date(1900, 0, 12);
    const max = new Date(2016, 0, 17);

    date.setFullYear(99);
    assert.notOk(this.dateInRange(date, min, max, 'date'));
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
    const newNumber = dateUtils.addInterval(11, 5, true);

    // assert
    assert.deepEqual(newNumber, 6);
});

QUnit.test('add negative day', function(assert) {
    // arrange, act
    const newDate = dateUtils.addInterval(new Date(2012, 2, 2), 'day', true);

    // assert
    assert.deepEqual(newDate, new Date(2012, 2, 1));
});

QUnit.test('add negative day overflow', function(assert) {
    // arrange, act
    const newDate = dateUtils.addInterval(new Date(2012, 1, 1), 'day', true);

    // assert
    assert.deepEqual(newDate, new Date(2012, 0, 31));
});

QUnit.test('addInterval number', function(assert) {
    // arrange, act
    const newNumber = dateUtils.addInterval(5, 6);

    // assert
    assert.deepEqual(newNumber, 11);
});

QUnit.test('addInterval day', function(assert) {
    // arrange, act
    const newDate = dateUtils.addInterval(new Date(2012, 2, 2), 'day');

    // assert
    assert.deepEqual(newDate, new Date(2012, 2, 3));
});

QUnit.test('addInterval day overflow', function(assert) {
    // arrange, act
    const newDate = dateUtils.addInterval(new Date(2012, 0, 31), 'day');

    // assert
    assert.deepEqual(newDate, new Date(2012, 1, 1));
});

QUnit.test('addInterval Day overflow', function(assert) {
    // arrange, act
    const newDate = dateUtils.addInterval(new Date(2012, 0, 31), 'Day');

    // assert
    assert.deepEqual(newDate, new Date(2012, 1, 1));
});


QUnit.test('addInterval date object', function(assert) {
    // arrange, act
    const newDate = dateUtils.addInterval(new Date(2012, 1, 1, 1, 1, 1, 1), {
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
    const newDate = dateUtils.addInterval(new Date('2017-10-29T01:55:00+01:00'), {
        minutes: 5,
        seconds: 6,
        milliseconds: 7
    });

    // assert
    assert.deepEqual(newDate.getTime(), 1509238806007);
});

QUnit.test('addInterval date object overflow', function(assert) {
    // arrange, act
    const newDate = dateUtils.addInterval(new Date(2012, 12, 1, 1, 1, 1, 1), {
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

QUnit.test('addInterval date with numeric interval', function(assert) {
    // arrange, act
    const newDate = dateUtils.addInterval(new Date(2012, 2, 2), 24 * 60 * 60 * 1000);

    // assert
    assert.deepEqual(newDate, new Date(2012, 2, 3));
});

QUnit.test('getDateUnitInterval with millisecond tickInterval', function(assert) {
    // arrange
    const getDateUnitInterval = dateUtils.getDateUnitInterval;
    const tickInterval = {
        milliseconds: 33
    };
    // assert
    assert.equal(getDateUnitInterval(tickInterval), 'millisecond');
});
QUnit.test('getDateUnitInterval with minute tickInterval', function(assert) {
    // arrange
    const getDateUnitInterval = dateUtils.getDateUnitInterval;
    const tickInterval = {
        milliseconds: 122,
        seconds: 33,
        minutes: 17
    };
    // assert
    assert.equal(getDateUnitInterval(tickInterval), 'minute');
});
QUnit.test('getDateUnitInterval with zero minutes and some seconds tickInterval', function(assert) {
    // arrange
    const getDateUnitInterval = dateUtils.getDateUnitInterval;
    const tickInterval = {
        milliseconds: 122,
        seconds: 33,
        minutes: 0
    };
    // assert
    assert.equal(getDateUnitInterval(tickInterval), 'second');
});
QUnit.test('getDateUnitInterval with dateDifferences style tickInterval', function(assert) {
    // arrange
    const getDateUnitInterval = dateUtils.getDateUnitInterval;
    const tickInterval = {
        millisecond: true,
        second: true,
        minute: false
    };
    // assert
    assert.equal(getDateUnitInterval(tickInterval), 'second');
});
QUnit.test('getDateUnitInterval with hour tickInterval', function(assert) {
    // arrange
    const getDateUnitInterval = dateUtils.getDateUnitInterval;
    const tickInterval = {
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
    const getDateUnitInterval = dateUtils.getDateUnitInterval;
    const tickInterval = {
        hours: 12,
        seconds: 33,
        days: 17
    };
    // assert
    assert.equal(getDateUnitInterval(tickInterval), 'day');
});
QUnit.test('getDateUnitInterval with week tickInterval', function(assert) {
    // arrange
    const getDateUnitInterval = dateUtils.getDateUnitInterval;
    const tickInterval = {
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
    const getDateUnitInterval = dateUtils.getDateUnitInterval;
    const tickInterval = {
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
    const getDateUnitInterval = dateUtils.getDateUnitInterval;
    const tickInterval = {
        weeks: 3,
        hours: 12,
        months: 3,
        years: 17
    };
    // assert
    assert.equal(getDateUnitInterval(tickInterval), 'year');
});

QUnit.test('fixTimezoneGap should work correctly with null oldDate', function(assert) {
    const newDate = new Date();
    dateUtils.fixTimezoneGap(null, newDate);

    assert.ok(newDate);
});

QUnit.test('getTimezonesDifference should return difference between dates with different timezones', function(assert) {
    const minDate = new Date('Thu Mar 10 2016 00:00:00 GMT-0500');
    const maxDate = new Date('Mon Mar 15 2016 00:00:00 GMT-0400');

    assert.equal(dateUtils.getTimezonesDifference(minDate, maxDate), (maxDate.getTimezoneOffset() - minDate.getTimezoneOffset()) * 60000, 'timezone offset is correct');
});

QUnit.test('Get dates interval in year', function(assert) {
    const interval = dateUtils.getDatesInterval(new Date(2010, 1, 29), new Date(2015, 5, 30), 'year');

    assert.equal(interval, 5, 'Years interval is OK');
});

QUnit.test('Get dates interval in quarter', function(assert) {
    const interval = dateUtils.getDatesInterval(new Date(2015, 1, 29), new Date(2015, 5, 30), 'quarter');

    assert.equal(interval, 1, 'Quarters interval is OK');
});

QUnit.test('Get dates interval in month', function(assert) {
    const interval = dateUtils.getDatesInterval(new Date(2015, 6, 29), new Date(2015, 7, 30), 'month');

    assert.equal(interval, 1, 'Months interval is OK');
});

QUnit.test('Get dates interval in week', function(assert) {
    const interval = dateUtils.getDatesInterval(new Date(2015, 7, 7), new Date(2015, 7, 30), 'week');

    assert.equal(interval, 3, 'Weeks interval is OK');
});

QUnit.test('Get dates interval in days', function(assert) {
    const interval = dateUtils.getDatesInterval(new Date(2015, 7, 27), new Date(2015, 7, 30), 'day');

    assert.equal(interval, 3, 'Days interval is OK');
});

QUnit.test('Get dates interval in hours', function(assert) {
    const interval = dateUtils.getDatesInterval(new Date(2015, 7, 27), new Date(2015, 7, 30), 'hour');

    assert.equal(interval, 72, 'Hours interval is OK');
});

QUnit.test('Get dates interval in minutes', function(assert) {
    const interval = dateUtils.getDatesInterval(new Date(2015, 7, 27), new Date(2015, 7, 30), 'minute');

    assert.equal(interval, 4320, 'Minutes interval is OK');
});

QUnit.test('Get dates interval in seconds', function(assert) {
    const interval = dateUtils.getDatesInterval(new Date(2015, 7, 27, 0, 0, 5), new Date(2015, 7, 27, 0, 0, 15), 'second');

    assert.equal(interval, 10, 'Seconds interval is OK');
});

QUnit.test('Get dates interval in milliseconds', function(assert) {
    const interval = dateUtils.getDatesInterval(new Date(2015, 7, 27, 0, 0, 5), new Date(2015, 7, 27, 0, 0, 15), 'millisecond');

    assert.equal(interval, 10000, 'Milliseconds interval is OK');
});

QUnit.test('Get dates interval in milliseconds should be used by default', function(assert) {
    const interval = dateUtils.getDatesInterval(new Date(2015, 7, 27, 0, 0, 5), new Date(2015, 7, 27, 0, 0, 15));

    assert.equal(interval, 10000, 'Milliseconds interval is OK');
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
    const convertMillisecondsToDateUnits = dateUtils.convertMillisecondsToDateUnits;
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
    const date = new Date(2013, 5, 20, 5, 26, 35, 222);
    const correct = dateUtils.correctDateWithUnitBeginning;

    // assert
    const millisecondsDate = correct(new Date(date.getTime()), 'millisecond');
    assert.deepEqual(millisecondsDate, new Date(2013, 5, 20, 5, 26, 35, 222), 'milliseconds');

    const secondsDate = correct(new Date(date.getTime()), 'second');
    assert.deepEqual(secondsDate, new Date(2013, 5, 20, 5, 26, 35), 'seconds');

    const minutesDate = correct(new Date(date.getTime()), 'minute');
    assert.deepEqual(minutesDate, new Date(2013, 5, 20, 5, 26), 'minutes');

    const hoursDate = correct(new Date(date.getTime()), 'hour');
    assert.deepEqual(hoursDate, new Date(2013, 5, 20, 5), 'hours');

    const daysDate = correct(new Date(date.getTime()), 'day');
    assert.deepEqual(daysDate, new Date(2013, 5, 20), 'days');

    const weeksDate = correct(new Date(date.getTime()), 'week');
    assert.deepEqual(weeksDate, new Date(2013, 5, 16), 'weeks');

    const monthsDate = correct(new Date(date.getTime()), 'month');
    assert.deepEqual(monthsDate, new Date(2013, 5, 1), 'months');

    const quartersDate = correct(new Date(date.getTime()), 'quarter');
    assert.deepEqual(quartersDate, new Date(2013, 3, 1), 'quarters');

    const yearsDate = correct(new Date(date.getTime()), 'year');
    assert.deepEqual(yearsDate, new Date(2013, 0, 1), 'years');
});

QUnit.test('correctDateWithUnitBeginning with gap correction', function(assert) {
    // arrange
    const date = new Date(2013, 5, 20, 5, 26, 35, 222);
    const correct = dateUtils.correctDateWithUnitBeginning;

    // assert
    const millisecondsDate = correct(new Date(date.getTime()), 'millisecond', true);
    assert.deepEqual(millisecondsDate, new Date(2013, 5, 20, 5, 26, 35, 222), 'milliseconds');

    const secondsDate = correct(new Date(date.getTime()), 'second', true);
    assert.deepEqual(secondsDate, new Date(2013, 5, 20, 5, 26, 35), 'seconds');

    const minutesDate = correct(new Date(date.getTime()), 'minute', true);
    assert.deepEqual(minutesDate, new Date(2013, 5, 20, 5, 26), 'minutes');

    const hoursDate = correct(new Date(date.getTime()), 'hour', true);
    assert.deepEqual(hoursDate, new Date(2013, 5, 20, 5), 'hours');

    const daysDate = correct(new Date(date.getTime()), 'day', true);
    assert.deepEqual(daysDate, new Date(2013, 5, 20, 1), 'days');

    const weeksDate = correct(new Date(date.getTime()), 'week', true);
    assert.deepEqual(weeksDate, new Date(2013, 5, 16, 1), 'weeks');

    const monthsDate = correct(new Date(date.getTime()), 'month', true);
    assert.deepEqual(monthsDate, new Date(2013, 5, 1, 1), 'months');

    const quartersDate = correct(new Date(date.getTime()), 'quarter', true);
    assert.deepEqual(quartersDate, new Date(2013, 3, 1, 1), 'quarters');

    const yearsDate = correct(new Date(date.getTime()), 'year', true);
    assert.deepEqual(yearsDate, new Date(2013, 0, 1, 1), 'years');
});

QUnit.test('trimming time of date', function(assert) {
    const date = new Date(2015, 7, 16, 2, 30);

    assert.deepEqual(dateUtils.trimTime(date), new Date(2015, 7, 16), 'Date is correct after time trimming');
});

QUnit.test('setting to the day end', function(assert) {
    const date = new Date(2015, 7, 16, 2, 30, 17, 100);

    assert.deepEqual(dateUtils.setToDayEnd(date), new Date(2015, 7, 16, 23, 59, 59, 999), 'Date is correct after time setting day end');
});

QUnit.test('rounding date by startDayHour', function(assert) {
    const date = new Date(2015, 7, 16, 8, 30);

    const result = dateUtils.roundDateByStartDayHour(date, 9.5);

    assert.deepEqual(result, new Date(2015, 7, 16, 9, 30), 'Date is correct after time trimming');
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


QUnit.module('Periods');

QUnit.test('getViewMinBoundaryDate', function(assert) {
    const initialDate = new Date(2015, 8, 16);
    let resultDate = dateUtils.getViewMinBoundaryDate('month', initialDate);
    assert.deepEqual(resultDate, new Date(2015, 8, 1), 'first day is set month');

    resultDate = dateUtils.getViewMinBoundaryDate('year', initialDate);
    assert.deepEqual(resultDate, new Date(2015, 0, 1), 'first day and first month are set for year');

    resultDate = dateUtils.getViewMinBoundaryDate('decade', initialDate);
    assert.deepEqual(resultDate, new Date(2010, 0, 1), 'first year, first month and first day are set for decade');

    resultDate = dateUtils.getViewMinBoundaryDate('century', initialDate);
    assert.deepEqual(resultDate, new Date(2000, 0, 1), 'first decade, first year, first month and first day are set for century');
});

QUnit.test('getViewMaxBoundaryDate', function(assert) {
    const initialDate = new Date(2015, 8, 16);
    let resultDate = dateUtils.getViewMaxBoundaryDate('month', initialDate);
    assert.deepEqual(resultDate, new Date(2015, 8, 30), 'last day is set for month');

    resultDate = dateUtils.getViewMaxBoundaryDate('year', initialDate);
    assert.deepEqual(resultDate, new Date(2015, 11, 31), 'last day and last month are set for year');

    resultDate = dateUtils.getViewMaxBoundaryDate('decade', initialDate);
    assert.deepEqual(resultDate, new Date(2019, 11, 31), 'last year, last month and last day are set for decade');

    resultDate = dateUtils.getViewMaxBoundaryDate('century', initialDate);
    assert.deepEqual(resultDate, new Date(2099, 11, 31), 'last decade, last year, last month and last day are set for century');
});

QUnit.test('the getViewMaxBoundaryDate method is should be return value with corrected time', function(assert) {
    const initialDate = new Date(2018, 7, 31, 12, 13, 23);
    const resultDate = dateUtils.getViewMaxBoundaryDate('month', initialDate);
    assert.deepEqual(resultDate, new Date(initialDate), 'last day of a month should be equal to an initial date and a time');
});

QUnit.test('the getDatesBetween method should return array of dates', function(assert) {
    const startDate = new Date(2018, 7, 31, 12, 13, 0);
    const endDate = new Date(2018, 8, 5, 12, 13, 0);

    const dates = dateUtils.getDatesOfInterval(startDate, endDate, 'day');

    assert.equal(dates.length, 5);
    assert.deepEqual(dates[0], new Date(2018, 7, 31, 12, 13, 0), 'Date in interval is correct');
    assert.deepEqual(dates[1], new Date(2018, 8, 1, 12, 13, 0), 'Date in interval is correct');
    assert.deepEqual(dates[2], new Date(2018, 8, 2, 12, 13, 0), 'Date in interval is correct');
    assert.deepEqual(dates[3], new Date(2018, 8, 3, 12, 13, 0), 'Date in interval is correct');
    assert.deepEqual(dates[4], new Date(2018, 8, 4, 12, 13, 0), 'Date in interval is correct');
});


QUnit.module('week numbers: FirstFullWeek', () => {
    const expectedWeekNumberCases = [
        [51, 51, 51, 51, 52, 52, 52, 52, 52, 52, 52, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
        [51, 51, 51, 52, 52, 52, 52, 52, 52, 52, 53, 53, 53, 53, 53, 53, 53, 1, 1, 1, 1, 1],
        [50, 50, 51, 51, 51, 51, 51, 51, 51, 52, 52, 52, 52, 52, 52, 52, 1, 1, 1, 1, 1, 1],
        [50, 51, 51, 51, 51, 51, 51, 51, 52, 52, 52, 52, 52, 52, 52, 1, 1, 1, 1, 1, 1, 1],
        [51, 51, 51, 51, 51, 51, 51, 52, 52, 52, 52, 52, 52, 52, 1, 1, 1, 1, 1, 1, 1, 2],
        [51, 51, 51, 51, 51, 51, 52, 52, 52, 52, 52, 52, 52, 1, 1, 1, 1, 1, 1, 1, 2, 2],
        [51, 51, 51, 51, 51, 52, 52, 52, 52, 52, 52, 52, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2],
        [51, 51, 52, 52, 52, 52, 52, 52, 52, 53, 53, 53, 53, 53, 53, 53, 1, 1, 1, 1, 1, 1],
    ];

    const checkWeekNumbers = (assert, year, firstDayOfWeek, expectedWeekNumbers) => {
        for(let i = 0; i < 22; i++) {
            assert.strictEqual(dateUtils.getWeekNumberFirstFullWeekOfYear(new Date(year - 1, 11, 21 + i), firstDayOfWeek), expectedWeekNumbers[i]);
        }
    };

    for(let firstDayOfWeek = 0; firstDayOfWeek < 7; firstDayOfWeek++) {
        QUnit.module(`firstDayOfWeek is ${WEEK_DAYS[firstDayOfWeek]}`, () => {
            for(let year = 2000; year < 2300; year++) {
                const firsDayOfYear = new Date(year, 0, 1).getDay();

                const offset = firsDayOfYear - firstDayOfWeek < 0 ? firsDayOfYear - firstDayOfWeek + 7 : firsDayOfYear - firstDayOfWeek;

                QUnit.test(`weeks years starting ${WEEK_DAYS[firsDayOfYear]}, year: ${year}, firstDayOfWeek: ${firstDayOfWeek}`, function(assert) {
                    if(
                        (firsDayOfYear === 0 && [2017, 2045, 2073, 2113, 2141, 2169, 2197, 2209, 2237, 2265, 2293].includes(year) && firstDayOfWeek === 5)
                        || (firsDayOfYear === 1 && [2001, 2029, 2057, 2085, 2125, 2153, 2181, 2221, 2249, 2277].includes(year) && firstDayOfWeek === 6)
                        || (firsDayOfYear === 2 && [2013, 2041, 2069, 2097, 2109, 2137, 2165, 2193, 2293, 2205, 2233, 2261, 2289].includes(year) && firstDayOfWeek === 0)
                        || (firsDayOfYear === 3 && [2025, 2053, 2081, 2121, 2149, 2177, 2217, 2245, 2273].includes(year) && firstDayOfWeek === 1)
                        || (firsDayOfYear === 4 && [2009, 2037, 2065, 2093, 2105, 2133, 2161, 2189, 2229, 2257, 2285].includes(year) && firstDayOfWeek === 2)
                        || (firsDayOfYear === 5 && [2021, 2049, 2077, 2117, 2145, 2173, 2213, 2241, 2269, 2297].includes(year) && firstDayOfWeek === 3)
                        || (firsDayOfYear === 6 && [2005, 2033, 2061, 2089, 2129, 2157, 2185, 2225, 2253, 2281].includes(year) && firstDayOfWeek === 4)
                    ) {
                        checkWeekNumbers(assert, year, firstDayOfWeek, expectedWeekNumberCases[7]);
                    } else {
                        checkWeekNumbers(assert, year, firstDayOfWeek, expectedWeekNumberCases[offset]);
                    }
                });
            }
        });
    }

});

QUnit.module('week numbers', () => {
    for(let firstDayOfWeek = 0; firstDayOfWeek < 7; firstDayOfWeek++) {
        QUnit.module(`firstDayOfWeek is ${WEEK_DAYS[firstDayOfWeek]}`, () => {
            const expectedWeekNumberCases = [
                [52, 52, 52, 52, 53, 53, 53, 53, 53, 53, 53, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
                [51, 51, 51, 52, 52, 52, 52, 52, 52, 52, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
                [51, 51, 52, 52, 52, 52, 52, 52, 52, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2],
                [51, 52, 52, 52, 52, 52, 52, 52, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2],
                [52, 52, 52, 52, 52, 52, 52, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3],
                [52, 52, 52, 52, 52, 52, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3],
                [52, 52, 52, 52, 52, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
                [52, 52, 52, 53, 53, 53, 53, 53, 53, 53, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
            ];

            const checkWeekNumbers = (assert, year, firstDayOfWeek, expectedWeekNumbers) => {
                for(let i = 0; i < 22; i++) {
                    assert.strictEqual(dateUtils.getWeekNumberFirstDayOfYear(new Date(year - 1, 11, 21 + i), firstDayOfWeek), expectedWeekNumbers[i]);
                }
            };

            for(let year = 2000; year < 2300; year++) {
                const firsDayOfYear = new Date(year, 0, 1).getDay();

                const offset = firsDayOfYear - firstDayOfWeek < 0 ? firsDayOfYear - firstDayOfWeek + 7 : firsDayOfYear - firstDayOfWeek;

                QUnit.test(`weeks years starting ${WEEK_DAYS[firsDayOfYear]}, year: ${year}, firstDayOfWeek: ${firstDayOfWeek}`, function(assert) {
                    if(
                        (firsDayOfYear === 0 && [2017, 2045, 2073, 2113, 2141, 2169, 2197, 2209, 2237, 2265, 2293].includes(year) && firstDayOfWeek === 6)
                        || (firsDayOfYear === 1 && [2001, 2029, 2057, 2085, 2125, 2153, 2181, 2221, 2249, 2277].includes(year) && firstDayOfWeek === 0)
                        || (firsDayOfYear === 2 && [2013, 2041, 2069, 2097, 2109, 2137, 2165, 2193, 2293, 2205, 2233, 2261, 2289].includes(year) && firstDayOfWeek === 1)
                        || (firsDayOfYear === 3 && [2025, 2053, 2081, 2121, 2149, 2177, 2217, 2245, 2273].includes(year) && firstDayOfWeek === 2)
                        || (firsDayOfYear === 4 && [2009, 2037, 2065, 2093, 2105, 2133, 2161, 2189, 2229, 2257, 2285].includes(year) && firstDayOfWeek === 3)
                        || (firsDayOfYear === 5 && [2021, 2049, 2077, 2117, 2145, 2173, 2213, 2241, 2269, 2297].includes(year) && firstDayOfWeek === 4)
                        || (firsDayOfYear === 6 && [2005, 2033, 2061, 2089, 2129, 2157, 2185, 2225, 2253, 2281].includes(year) && firstDayOfWeek === 5)
                    ) {
                        checkWeekNumbers(assert, year, firstDayOfWeek, expectedWeekNumberCases[7]);
                    } else {
                        checkWeekNumbers(assert, year, firstDayOfWeek, expectedWeekNumberCases[offset]);
                    }
                });
            }
        });
    }

});

QUnit.module('iso week numbers', () => {
    QUnit.module('iso weeks years, firstDayOfWeek is Sunday', () => {
        QUnit.test('iso weeks years starting sunday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 24), 0), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 25), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 26), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 27), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 28), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 29), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 30), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 31), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 1), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 2), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 3), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 7), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 8), 0), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 9), 0), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 10), 0), 2);
        });

        QUnit.test('iso weeks years starting monday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 11, 28), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 11, 29), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 11, 30), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 11, 31), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 0, 1), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 0, 2), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 0, 5), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 0, 6), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 0, 7), 0), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 0, 13), 0), 2);
        });

        QUnit.test('iso weeks years starting tuesday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 28), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 29), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 30), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 31), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 1), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 2), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 3), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 4), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 5), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 6), 0), 2);
        });

        QUnit.test('iso weeks years starting wednesday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 11, 28), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 11, 29), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 11, 30), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 11, 31), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 0, 1), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 0, 2), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 0, 3), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 0, 4), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 0, 5), 0), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 0, 6), 0), 2);
        });

        QUnit.test('iso weeks years starting thursday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 27), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 28), 0), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 29), 0), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 30), 0), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 31), 0), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 1), 0), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 2), 0), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 3), 0), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 4), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 10), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 11), 0), 2);
        });

        QUnit.test('iso weeks years starting friday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 27), 0), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 28), 0), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 29), 0), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 30), 0), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 31), 0), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 1), 0), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 2), 0), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 3), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 9), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 10), 0), 2);
        });

        QUnit.test('iso weeks years starting saturday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 11, 26), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 11, 27), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 11, 28), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 11, 29), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 11, 30), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 11, 31), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 0, 1), 0), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 0, 2), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 0, 3), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 0, 8), 0), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 0, 9), 0), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 0, 10), 0), 2);
        });
    });

    QUnit.module('iso weeks years, firstDayOfWeek is Monday', () => {
        QUnit.test('iso weeks years starting sunday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2012, 0, 1), 1), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2012, 0, 2), 1), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2012, 0, 8), 1), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2012, 0, 9), 1), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2012, 0, 15), 1), 2);
        });

        QUnit.test('iso weeks years starting monday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2007, 0, 1), 1), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2007, 0, 7), 1), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2007, 0, 8), 1), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2007, 0, 14), 1), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2007, 0, 15), 1), 3);
        });

        QUnit.test('iso weeks years starting tuesday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2007, 11, 31), 1), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2008, 0, 1), 1), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2008, 0, 6), 1), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2008, 0, 7), 1), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2008, 0, 13), 1), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2008, 0, 14), 1), 3);
        });

        QUnit.test('iso weeks years starting wednesday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2002, 11, 30), 1), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2003, 0, 1), 1), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2003, 0, 5), 1), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2003, 0, 6), 1), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2003, 0, 12), 1), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2003, 0, 13), 1), 3);
        });

        QUnit.test('iso weeks years starting thursday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2008, 11, 29), 1), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2009, 0, 1), 1), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2009, 0, 4), 1), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2009, 0, 5), 1), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2009, 0, 11), 1), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2009, 0, 13), 1), 3);
        });

        QUnit.test('iso weeks years starting friday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2009, 11, 28), 1), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2010, 0, 1), 1), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2010, 0, 3), 1), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2010, 0, 4), 1), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2010, 0, 10), 1), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2010, 0, 11), 1), 2);
        });

        QUnit.test('iso weeks years starting saturday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2010, 11, 27), 1), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2011, 0, 1), 1), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2011, 0, 2), 1), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2011, 0, 3), 1), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2011, 0, 9), 1), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2011, 0, 10), 1), 2);
        });

        QUnit.test('years with iso week 53', function(assert) {
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2004, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2009, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2015, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2026, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2032, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2037, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2043, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2048, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2054, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2060, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2065, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2071, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2076, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2082, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2088, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2093, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2099, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2105, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2111, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2116, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2122, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2128, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2133, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2139, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2144, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2150, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2156, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2161, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2167, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2172, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2178, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2184, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2189, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2195, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2201, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2207, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2212, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2218, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2224, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2229, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2235, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2240, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2246, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2252, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2257, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2263, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2268, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2274, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2280, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2285, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2291, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2296, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2303, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2308, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2314, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2320, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2325, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2331, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2336, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2342, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2348, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2353, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2359, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2364, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2370, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2376, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2381, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2387, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2392, 11, 31), 1), 53);
            assert.equal(dateUtils.getISO8601WeekOfYear(new Date(2398, 11, 31), 1), 53);
        });
    });

    QUnit.module('iso weeks years, firstDayOfWeek is Tuesday', () => {
        QUnit.test('iso weeks years starting sunday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2033, 11, 24), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2033, 11, 25), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2033, 11, 26), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2033, 11, 27), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2033, 11, 28), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2033, 11, 29), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2033, 11, 30), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2033, 11, 31), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 0, 1), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 0, 2), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 0, 3), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 0, 4), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 0, 9), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 0, 10), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 0, 11), 3), 2);
        });

        QUnit.test('iso weeks years starting monday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 11, 22), 2), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 11, 23), 2), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 11, 24), 2), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 11, 25), 2), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 11, 26), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 11, 27), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 11, 28), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 11, 29), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 11, 30), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 11, 31), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 0, 1), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 0, 2), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 0, 5), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 0, 6), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 0, 7), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 0, 8), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 0, 9), 2), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 0, 10), 2), 2);
        });

        QUnit.test('iso weeks years starting tuesday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 11, 24), 2), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 11, 25), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 11, 26), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 11, 27), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 11, 28), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 11, 29), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 11, 30), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 11, 31), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 0, 1), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 0, 2), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 0, 3), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 0, 7), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 0, 8), 2), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 0, 9), 2), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 0, 10), 2), 2);
        });

        QUnit.test('iso weeks years starting wednesday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 11, 22), 2), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 11, 23), 2), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 11, 24), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 11, 25), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 11, 26), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 11, 27), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 11, 28), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 11, 29), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 11, 30), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 11, 31), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 0, 1), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 0, 2), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 0, 5), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 0, 6), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 0, 7), 2), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 0, 8), 2), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 0, 9), 2), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 0, 10), 2), 2);
        });

        QUnit.test('iso weeks years starting thursday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 11, 22), 2), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 11, 23), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 11, 24), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 11, 25), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 11, 26), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 11, 27), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 11, 28), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 11, 29), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 11, 30), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 11, 31), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2037, 0, 1), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2037, 0, 2), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2037, 0, 5), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2037, 0, 6), 2), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2037, 0, 8), 2), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2037, 0, 9), 2), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2037, 0, 10), 2), 2);
        });

        QUnit.test('iso weeks years starting friday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2043, 11, 28), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2043, 11, 29), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2043, 11, 30), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2043, 11, 31), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2044, 0, 1), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2044, 0, 2), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2044, 0, 4), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2044, 0, 5), 2), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2044, 0, 7), 2), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2044, 0, 11), 2), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2044, 0, 12), 2), 3);
        });

        QUnit.test('iso weeks years starting saturday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2038, 11, 24), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2038, 11, 25), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2038, 11, 26), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2038, 11, 27), 2), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2038, 11, 28), 2), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2038, 11, 29), 2), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2038, 11, 30), 2), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2038, 11, 31), 2), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2039, 0, 1), 2), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2039, 0, 2), 2), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2039, 0, 3), 2), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2039, 0, 4), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2039, 0, 9), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2039, 0, 10), 2), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2039, 0, 11), 2), 2);
        });
    });

    QUnit.module('iso weeks years, firstDayOfWeek is Wednesday', () => {
        QUnit.test('iso weeks years starting sunday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2033, 11, 24), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2033, 11, 25), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2033, 11, 26), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2033, 11, 27), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2033, 11, 28), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2033, 11, 29), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2033, 11, 30), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2033, 11, 31), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 0, 1), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 0, 2), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 0, 3), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 0, 4), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 0, 9), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 0, 10), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2034, 0, 11), 3), 2);
        });

        QUnit.test('iso weeks years starting monday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 22), 3), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 23), 3), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 24), 3), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 25), 3), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 26), 3), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 27), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 28), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 29), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 30), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 31), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 1), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 2), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 3), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 5), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 6), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 8), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 9), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 10), 3), 2);
        });

        QUnit.test('iso weeks years starting tuesday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 24), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 25), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 26), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 27), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 28), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 29), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 30), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 31), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 1), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 2), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 3), 3), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 4), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 9), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 10), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 11), 3), 2);
        });

        QUnit.test('iso weeks years starting wednesday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2019, 11, 24), 3), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2019, 11, 25), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2019, 11, 26), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2019, 11, 27), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2019, 11, 28), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2019, 11, 29), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2019, 11, 30), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2019, 11, 31), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 0, 1), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 0, 2), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 0, 3), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 0, 7), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 0, 8), 3), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 0, 9), 3), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 0, 10), 3), 2);
        });

        QUnit.test('iso weeks years starting thursday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 22), 3), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 23), 3), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 24), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 25), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 26), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 27), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 28), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 29), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 30), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 31), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 1), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 2), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 5), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 6), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 7), 3), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 8), 3), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 9), 3), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 10), 3), 2);
        });

        QUnit.test('iso weeks years starting friday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 22), 3), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 23), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 24), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 25), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 26), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 27), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 28), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 29), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 30), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 31), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 1), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 2), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 5), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 6), 3), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 8), 3), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 9), 3), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 10), 3), 2);
        });

        QUnit.test('iso weeks years starting saturday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 28), 3), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 29), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 30), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 31), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 1), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 2), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 4), 3), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 5), 3), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 7), 3), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 11), 3), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 12), 3), 3);
        });
    });

    QUnit.module('iso weeks years, firstDayOfWeek is Thursday', () => {
        QUnit.test('iso weeks years starting sunday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 22), 4), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 23), 4), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 24), 4), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 25), 4), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 26), 4), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 27), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 28), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 29), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 30), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 31), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 1), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 2), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 3), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 5), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 6), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 8), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 9), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 10), 4), 2);
        });

        QUnit.test('iso weeks years starting monday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 24), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 25), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 26), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 27), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 28), 4), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 29), 4), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 30), 4), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 31), 4), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 1), 4), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 2), 4), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 3), 4), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 4), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 9), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 10), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 11), 4), 2);
        });

        QUnit.test('iso weeks years starting tuesday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 28), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 29), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 30), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 31), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 1), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 2), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 4), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 5), 4), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 7), 4), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 11), 4), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 12), 4), 3);
        });

        QUnit.test('iso weeks years starting wednesday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 11, 22), 4), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 11, 23), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 11, 24), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 11, 25), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 11, 26), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 11, 27), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 11, 28), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 11, 29), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 11, 30), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 11, 31), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 0, 1), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 0, 2), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 0, 5), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 0, 6), 4), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 0, 8), 4), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 0, 9), 4), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 0, 10), 4), 2);
        });

        QUnit.test('iso weeks years starting thursday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 24), 4), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 25), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 26), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 27), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 28), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 29), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 30), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2025, 11, 31), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 1), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 2), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 3), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 7), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 8), 4), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 9), 4), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2026, 0, 10), 4), 2);
        });

        QUnit.test('iso weeks years starting friday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 24), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 25), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 26), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 27), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 28), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 29), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 30), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 31), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 1), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 2), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 3), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 7), 4), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 8), 4), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 9), 4), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 10), 4), 2);
        });

        QUnit.test('iso weeks years starting saturday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 22), 4), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 23), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 24), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 25), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 26), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 27), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 28), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 29), 4), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 30), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 31), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 1), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 2), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 5), 4), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 6), 4), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 8), 4), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 9), 4), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 10), 4), 2);
        });
    });

    QUnit.module('iso weeks years, firstDayOfWeek is Friday', () => {
        QUnit.test('iso weeks years starting sunday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 22), 5), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 23), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 24), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 25), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 26), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 27), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 28), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 29), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 30), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2022, 11, 31), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 1), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 2), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 5), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 6), 5), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 8), 5), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 9), 5), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 10), 5), 2);
        });

        QUnit.test('iso weeks years starting monday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 28), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 29), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 30), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 11, 31), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 1), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 2), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 4), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 5), 5), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 7), 5), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 11), 5), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2024, 0, 12), 5), 3);
        });

        QUnit.test('iso weeks years starting tuesday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 11, 26), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 11, 27), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 11, 28), 5), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 11, 29), 5), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 11, 30), 5), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2035, 11, 31), 5), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 0, 1), 5), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 0, 2), 5), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 0, 3), 5), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 0, 4), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 0, 5), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 0, 10), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2036, 0, 11), 5), 2);
        });

        QUnit.test('iso weeks years starting wednesday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2019, 11, 26), 5), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2019, 11, 27), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2019, 11, 28), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2019, 11, 29), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2019, 11, 30), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2019, 11, 31), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 0, 1), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 0, 2), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 0, 3), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 0, 4), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 0, 5), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 0, 9), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 0, 10), 5), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 0, 11), 5), 2);
        });

        QUnit.test('iso weeks years starting thursday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 24), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 25), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 26), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 27), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 28), 5), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 29), 5), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 30), 5), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 11, 31), 5), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 1), 5), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 2), 5), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 3), 5), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 4), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 9), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 10), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2030, 0, 11), 5), 2);
        });

        QUnit.test('iso weeks years starting friday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 24), 5), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 25), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 26), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 27), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 28), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 29), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 30), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2020, 11, 31), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 1), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 2), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 3), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 4), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 7), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 8), 5), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 9), 5), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2021, 0, 10), 5), 2);
        });

        QUnit.test('iso weeks years starting saturday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 24), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 25), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 26), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 27), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 28), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 29), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 30), 5), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 31), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 1), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 2), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 3), 5), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 7), 5), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 8), 5), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 9), 5), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 10), 5), 2);
        });
    });

    QUnit.module('iso weeks years, firstDayOfWeek is Saturday', () => {
        QUnit.test('iso weeks years starting sunday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2039, 11, 23), 6), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2039, 11, 24), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2039, 11, 25), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2039, 11, 26), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2039, 11, 27), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2039, 11, 28), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2039, 11, 29), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2039, 11, 30), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2039, 11, 31), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 1), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 2), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 3), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 7), 6), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 8), 6), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 9), 6), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2023, 0, 10), 6), 2);
        });

        QUnit.test('iso weeks years starting monday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 11, 28), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 11, 29), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 11, 30), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 11, 31), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 0, 1), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 0, 2), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 0, 5), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 0, 6), 6), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 0, 7), 6), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2029, 0, 13), 6), 3);
        });

        QUnit.test('iso weeks years starting tuesday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2040, 11, 28), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2040, 11, 29), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2040, 11, 30), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2040, 11, 31), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 0, 1), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 0, 2), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 0, 3), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 0, 4), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 0, 5), 6), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 0, 6), 6), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 0, 11), 6), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 0, 12), 6), 3);
        });

        QUnit.test('iso weeks years starting wednesday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 11, 27), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 11, 28), 6), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 11, 29), 6), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 11, 30), 6), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2041, 11, 31), 6), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 0, 1), 6), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 0, 2), 6), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 0, 3), 6), 53);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 0, 4), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 0, 5), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 0, 6), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 0, 10), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 0, 11), 6), 2);
        });

        QUnit.test('iso weeks years starting thursday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 11, 26), 6), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 11, 27), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 11, 28), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 11, 29), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 11, 30), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2042, 11, 31), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2043, 0, 1), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2043, 0, 2), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2043, 0, 3), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2043, 0, 4), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2043, 0, 9), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2043, 0, 10), 6), 2);
        });

        QUnit.test('iso weeks years starting friday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2037, 11, 25), 6), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2037, 11, 26), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2037, 11, 27), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2037, 11, 28), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2037, 11, 29), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2037, 11, 30), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2037, 11, 31), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2038, 0, 1), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2038, 0, 2), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2038, 0, 3), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2038, 0, 8), 8), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2038, 0, 9), 6), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2038, 0, 10), 6), 2);
        });

        QUnit.test('iso weeks years starting saturday', function(assert) {
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 24), 6), 51);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 25), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 26), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 27), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 28), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 29), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 30), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2027, 11, 31), 6), 52);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 1), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 2), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 3), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 7), 6), 1);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 8), 6), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 9), 6), 2);
            assert.strictEqual(dateUtils.getISO8601WeekOfYear(new Date(2028, 0, 10), 6), 2);
        });
    });

    [0, 1, 2, 3, 4, 5, 6].forEach((firstDayOfWeek) => {
        QUnit.test(`count years with iso week 53, firstDayOfWeek: ${firstDayOfWeek}`, function(assert) {
            let count = 0;
            for(let i = 0; i < 400; i++) {
                count += dateUtils.getISO8601WeekOfYear(new Date(2000 + i, 11, 31), firstDayOfWeek) === 53 ? 1 : 0;
            }
            assert.equal(count, 71, 'Should have 71 years with iso week 53');
        });
    });
});

QUnit.module('Dates creation');

QUnit.test('createDateWithFullYear', function(assert) {
    const testDate = dateUtils.createDateWithFullYear(18, 7, 31, 12, 13, 23);
    const expectedDate = new Date(18, 7, 31, 12, 13, 23);
    expectedDate.setFullYear(18);

    assert.deepEqual(testDate, expectedDate, 'correct date is created');
});

QUnit.module('intervalsOverlap', () => {
    QUnit.test('Check if intervals overlaps from the Left', function(assert) {
        assert.ok(dateUtils.intervalsOverlap({
            firstMin: new Date(2021, 2, 4, 10),
            firstMax: new Date(2021, 2, 4, 13),
            secondMin: new Date(2021, 2, 4, 11),
            secondMax: new Date(2021, 2, 4, 14)
        }), 'Intervals overlaps');
    });

    QUnit.test('Check if intervals overlaps from the Right', function(assert) {
        assert.ok(dateUtils.intervalsOverlap({
            firstMin: new Date(2021, 2, 4, 10),
            firstMax: new Date(2021, 2, 4, 13),
            secondMin: new Date(2021, 2, 4, 9),
            secondMax: new Date(2021, 2, 4, 11)
        }), 'Intervals overlaps');
    });

    QUnit.test('Check if first interval include the second', function(assert) {
        assert.ok(dateUtils.intervalsOverlap({
            firstMin: new Date(2021, 2, 4, 10),
            firstMax: new Date(2021, 2, 4, 13),
            secondMin: new Date(2021, 2, 4, 11),
            secondMax: new Date(2021, 2, 4, 12)
        }), 'Intervals overlaps');
    });

    QUnit.test('Check if second interval include the first', function(assert) {
        assert.ok(dateUtils.intervalsOverlap({
            firstMin: new Date(2021, 2, 4, 11),
            firstMax: new Date(2021, 2, 4, 12),
            secondMin: new Date(2021, 2, 4, 10),
            secondMax: new Date(2021, 2, 4, 13)
        }), 'Intervals overlaps');
    });

    QUnit.test('Check the same intervals', function(assert) {
        assert.ok(dateUtils.intervalsOverlap({
            firstMin: new Date(2021, 2, 4, 11),
            firstMax: new Date(2021, 2, 4, 12),
            secondMin: new Date(2021, 2, 4, 11),
            secondMax: new Date(2021, 2, 4, 12)
        }), 'Intervals overlaps');
    });

    QUnit.test('Check if leftMin < rightMin and leftMax < rightMax', function(assert) {
        assert.notOk(dateUtils.intervalsOverlap({
            firstMin: new Date(2021, 2, 4, 11),
            firstMax: new Date(2021, 2, 4, 12),
            secondMin: new Date(2021, 2, 4, 13),
            secondMax: new Date(2021, 2, 4, 14)
        }), 'Intervals not overlaps');
    });

    QUnit.test('Check if leftMin > rightMin and leftMax < rightMax', function(assert) {
        assert.ok(dateUtils.intervalsOverlap({
            firstMin: new Date(2021, 2, 4, 11),
            firstMax: new Date(2021, 2, 4, 13),
            secondMin: new Date(2021, 2, 4, 12),
            secondMax: new Date(2021, 2, 4, 14)
        }), 'Intervals overlaps');
    });

    QUnit.test('Check if leftMin > rightMin and leftMax > rightMax', function(assert) {
        assert.notOk(dateUtils.intervalsOverlap({
            firstMin: new Date(2021, 2, 4, 13),
            firstMax: new Date(2021, 2, 4, 14),
            secondMin: new Date(2021, 2, 4, 11),
            secondMax: new Date(2021, 2, 4, 12)
        }), 'Intervals not overlaps');
    });

    QUnit.test('Check if leftMin < rightMin and leftMax > rightMin', function(assert) {
        assert.ok(dateUtils.intervalsOverlap({
            firstMin: new Date(2021, 2, 4, 11),
            firstMax: new Date(2021, 2, 4, 13),
            secondMin: new Date(2021, 2, 4, 12),
            secondMax: new Date(2021, 2, 4, 15)
        }), 'Intervals overlaps');
    });
});
