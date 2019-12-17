const recurrenceUtils = require('ui/scheduler/utils.recurrence');

QUnit.module('Recurrences');

const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

QUnit.test('get dates with undefined rule', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: undefined, start: new Date(2015, 0, 1, 0, 0, 10), min: new Date(2015, 0, 1, 0, 0, 10), max: new Date(2015, 0, 1, 0, 0, 12) });

    assert.deepEqual(dates, [], 'dates is right');
});

QUnit.test('get date by second recurrence', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=SECONDLY', start: new Date(2015, 0, 1, 0, 0, 10), min: new Date(2015, 0, 1, 0, 0, 10), max: new Date(2015, 0, 1, 0, 0, 12) });

    assert.deepEqual(dates, [new Date(2015, 0, 1, 0, 0, 10), new Date(2015, 0, 1, 0, 0, 11), new Date(2015, 0, 1, 0, 0, 12)], 'dates is right');
});

QUnit.test('get date by minute recurrence', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=MINUTELY', start: new Date(2015, 0, 1, 0, 1), min: new Date(2015, 0, 1, 0, 1), max: new Date(2015, 0, 1, 0, 3) });

    assert.deepEqual(dates, [new Date(2015, 0, 1, 0, 1), new Date(2015, 0, 1, 0, 2), new Date(2015, 0, 1, 0, 3)], 'dates are right');
});

QUnit.test('get date by hour recurrence', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=HOURLY', start: new Date(2015, 0, 1, 8), min: new Date(2015, 0, 1, 8), max: new Date(2015, 0, 1, 10) });

    assert.deepEqual(dates, [new Date(2015, 0, 1, 8), new Date(2015, 0, 1, 9), new Date(2015, 0, 1, 10)], 'dates are right');
});

QUnit.test('get date by day recurrence', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=DAILY', start: new Date(2015, 0, 1), min: new Date(2015, 0, 1), max: new Date(2015, 0, 3) });

    assert.deepEqual(dates, [new Date(2015, 0, 1), new Date(2015, 0, 2), new Date(2015, 0, 3)], 'dates are right');
});

QUnit.test('get date by day recurrence, endDate of part is min', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=DAILY', start: new Date(2015, 4, 26), end: new Date(2015, 4, 27), min: new Date(2015, 4, 31), max: new Date(2015, 5, 2) });

    assert.deepEqual(dates, [new Date(2015, 4, 31), new Date(2015, 5, 1), new Date(2015, 5, 2)], 'dates are right');
});

QUnit.test('get date by week recurrence', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=WEEKLY', start: new Date(2015, 0, 15), min: new Date(2015, 0, 15), max: new Date(2015, 1, 5) });

    assert.deepEqual(dates, [new Date(2015, 0, 15), new Date(2015, 0, 22), new Date(2015, 0, 29), new Date(2015, 1, 5)], 'dates are right');
});

QUnit.test('get date by month recurrence', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=MONTHLY', start: new Date(2015, 1, 15), min: new Date(2015, 1, 15), max: new Date(2015, 5, 5) });

    assert.deepEqual(dates, [new Date(2015, 1, 15), new Date(2015, 2, 15), new Date(2015, 3, 15), new Date(2015, 4, 15)], 'dates are right');
});

QUnit.test('get date by year recurrence', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=YEARLY', start: new Date(2015, 11, 15), min: new Date(2015, 11, 15), max: new Date(2019, 5, 5) });

    assert.deepEqual(dates, [new Date(2015, 11, 15), new Date(2016, 11, 15), new Date(2017, 11, 15), new Date(2018, 11, 15)], 'dates are right');
});

QUnit.test('get date by recurrence with 2 day INTERVAL', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=DAILY;INTERVAL=2', start: new Date(2015, 0, 1), min: new Date(2015, 0, 1), max: new Date(2015, 0, 7) });

    assert.deepEqual(dates, [new Date(2015, 0, 1), new Date(2015, 0, 3), new Date(2015, 0, 5), new Date(2015, 0, 7)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should not handled strings only with INTERVAL', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'INTERVAL=2', start: new Date(2015, 0, 1), min: new Date(2015, 0, 1), max: new Date(2015, 0, 7) });

    assert.deepEqual(dates, [], 'result is right');
});

QUnit.test('getDatesByRecurrence should handle strings with DAILY & BYDAY=SU rules and start in Sunday', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=DAILY;BYDAY=SU', start: new Date(2015, 4, 24), min: new Date(2015, 4, 20), max: new Date(2015, 5, 7) });

    assert.deepEqual(dates, [new Date(2015, 4, 24), new Date(2015, 4, 31), new Date(2015, 5, 7)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle strings with WEEKLY & BYDAY=SU rules and start in Sunday', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=WEEKLY;BYDAY=SU', start: new Date(2018, 4, 27), min: new Date(2018, 4, 27), max: new Date(2018, 5, 11) });

    assert.deepEqual(dates, [new Date(2018, 4, 27), new Date(2018, 5, 3), new Date(2018, 5, 10)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle strings with DAILY & BYDAY=MO rules and WKST=WE', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=DAILY;WKST=WE;BYDAY=MO', start: new Date(2015, 4, 18), min: new Date(2015, 4, 18), max: new Date(2015, 5, 7) });

    assert.deepEqual(dates, [new Date(2015, 4, 18), new Date(2015, 4, 25), new Date(2015, 5, 1)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle strings with DAILY, BYDAY = whole week, WKST rules', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=DAILY;BYDAY=SU,MO,TU,WE,TH,FR,SA;WKST=WE', start: new Date(2015, 4, 18), min: new Date(2015, 4, 18), max: new Date(2015, 4, 26) });

    assert.deepEqual(dates, [new Date(2015, 4, 18), new Date(2015, 4, 19), new Date(2015, 4, 20), new Date(2015, 4, 21), new Date(2015, 4, 22), new Date(2015, 4, 23), new Date(2015, 4, 24), new Date(2015, 4, 25), new Date(2015, 4, 26)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle strings with COUNT', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=DAILY;INTERVAL=3;COUNT=2', start: new Date(2015, 0, 1), min: new Date(2015, 0, 1), max: new Date(2015, 0, 21) });

    assert.deepEqual(dates, [new Date(2015, 0, 1), new Date(2015, 0, 4)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with COUNT without range', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=4', start: new Date(2015, 0, 1), min: new Date(2015, 0, 1), max: new Date(2015, 0, 21) });

    assert.deepEqual(dates, [new Date(2015, 0, 2), new Date(2015, 0, 5), new Date(2015, 0, 7), new Date(2015, 0, 9)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with COUNT & BYDAY', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=10', start: new Date(2015, 0, 1), min: new Date(2015, 0, 1), max: new Date(2015, 0, 20) });

    assert.deepEqual(dates, [new Date(2015, 0, 2), new Date(2015, 0, 5), new Date(2015, 0, 7), new Date(2015, 0, 9), new Date(2015, 0, 12), new Date(2015, 0, 14), new Date(2015, 0, 16), new Date(2015, 0, 19)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with COUNT & BYDAY & DAILY', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=DAILY;BYDAY=MO;COUNT=7', start: new Date(2018, 4, 14), min: new Date(2018, 4, 14), max: new Date(2018, 6, 10) });

    assert.deepEqual(dates, [new Date(2018, 4, 14), new Date(2018, 4, 21), new Date(2018, 4, 28), new Date(2018, 5, 4), new Date(2018, 5, 11), new Date(2018, 5, 18), new Date(2018, 5, 25)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with COUNT & BYDAY & WEEKLY & INTERVAL', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=WEEKLY;BYDAY=MO;INTERVAL=2;COUNT=2', start: new Date(2019, 2, 4, 9), min: new Date(2019, 2, 4, 10), max: new Date(2019, 6, 10) });

    assert.deepEqual(dates, [new Date(2019, 2, 4, 9), new Date(2019, 2, 18, 9)], 'date are right');
});

QUnit.test('getDatesByRecurrence: FREQ=WEEKLY;BYDAY=MO;INTERVAL=2;COUNT=2', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=WEEKLY;BYDAY=MO;INTERVAL=2;COUNT=2',
        start: new Date(2019, 2, 4, 9), min: new Date(2019, 2, 4, 10), max: new Date(2019, 6, 10) });

    assert.deepEqual(dates, [new Date(2019, 2, 4, 9), new Date(2019, 2, 18, 9)], 'date are right');
});

QUnit.test('getDatesByRecurrence: FREQ=WEEKLY;BYDAY=MO;INTERVAL=2', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=WEEKLY;BYDAY=MO;INTERVAL=2',
        start: new Date(2019, 2, 4, 9), min: new Date(2019, 2, 4, 10), max: new Date(2019, 2, 20) });

    assert.deepEqual(dates, [new Date(2019, 2, 4, 9), new Date(2019, 2, 18, 9)], 'date are right');
});

QUnit.test('getDatesByRecurrence: FREQ=WEEKLY;BYDAY=[all days], min: new Date(2019, 0, 6), max: new Date(2015, 0, 12)', function(assert) {
    for(let i = 0; i < days.length; i++) {
        const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=WEEKLY;BYDAY=' + days[i], start: new Date(2019, 0, 6), min: new Date(2019, 0, 6), max: new Date(2019, 0, 12) });
        assert.deepEqual(dates, [new Date(2019, 0, 6 + i)], 'date are right');
    }
});

QUnit.test('getDatesByRecurrence: FREQ=WEEKLY;BYDAY=[all days], min: new Date(2015, 0, 4), max: new Date(2015, 0, 17)', function(assert) {
    for(let i = 0; i < days.length; i++) {
        const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=WEEKLY;BYDAY=' + days[i], start: new Date(2019, 0, 6), min: new Date(2019, 0, 6), max: new Date(2019, 0, 19) });
        assert.deepEqual(dates, [new Date(2019, 0, 6 + i), new Date(2019, 0, 13 + i)], 'date are right');
    }
});

QUnit.test('getDatesByRecurrence: FREQ=WEEKLY;BYDAY=[all days];COUNT=1, min: new Date(2015, 0, 4), max: new Date(2015, 0, 17)', function(assert) {
    for(let i = 0; i < days.length; i++) {
        const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=WEEKLY;BYDAY=' + days[i] + ';COUNT=1', start: new Date(2019, 0, 6), min: new Date(2019, 0, 6), max: new Date(2019, 0, 19) });
        assert.deepEqual(dates, [new Date(2019, 0, 6 + i)], 'date are right');
    }
});

QUnit.test('getDatesByRecurrence should handle strings with COUNT & BYMONTH', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=MONTHLY;BYMONTHDAY=2;COUNT=10', start: new Date(2017, 0, 1), min: new Date(2017, 0, 1), max: new Date(2017, 11, 20) });

    assert.deepEqual(dates, [new Date(2017, 0, 2), new Date(2017, 1, 2), new Date(2017, 2, 2), new Date(2017, 3, 2), new Date(2017, 4, 2), new Date(2017, 5, 2), new Date(2017, 6, 2), new Date(2017, 7, 2), new Date(2017, 8, 2), new Date(2017, 9, 2)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYYEARDAY, COUNT & YEARLY', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=YEARLY;BYYEARDAY=200,201;COUNT=10', start: new Date(2017, 0, 1), min: new Date(2017, 6, 1), max: new Date(2018, 7, 1) });

    assert.deepEqual(dates, [new Date(2017, 6, 19), new Date(2017, 6, 20), new Date(2018, 6, 19), new Date(2018, 6, 20)], 'date are right');
});

QUnit.test('getDatesByRecurrence should not have any string if count is out', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=DAILY;INTERVAL=2;COUNT=2', start: new Date(2015, 0, 1), min: new Date(2015, 1, 1), max: new Date(2015, 1, 21) });

    assert.deepEqual(dates, [], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with UNTIL', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=DAILY;UNTIL=20160319T030000', start: new Date(2016, 2, 16, 3), min: new Date(2016, 1, 29), max: new Date(2016, 3, 10), exception: undefined });

    assert.deepEqual(dates, [new Date(2016, 2, 16, 3), new Date(2016, 2, 17, 3), new Date(2016, 2, 18, 3), new Date(2016, 2, 19, 3)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with UNTIL greater than endDate', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=DAILY;UNTIL=20150219T000000', start: new Date(2015, 1, 1), min: new Date(2015, 1, 1), max: new Date(2015, 1, 3) });

    assert.deepEqual(dates, [new Date(2015, 1, 1), new Date(2015, 1, 2), new Date(2015, 1, 3)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with UNTIL without time', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=DAILY;UNTIL=20150203', start: new Date(2015, 1, 1), min: new Date(2015, 1, 1), max: new Date(2015, 2, 19) });

    assert.deepEqual(dates, [new Date(2015, 1, 1), new Date(2015, 1, 2), new Date(2015, 1, 3)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYMONTH', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=YEARLY;BYMONTH=2', start: new Date(2013, 0, 1), min: new Date(2013, 0, 1), max: new Date(2015, 2, 19) });

    assert.deepEqual(dates, [new Date(2013, 1, 1), new Date(2014, 1, 1), new Date(2015, 1, 1)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with several value in BYMONTH', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=YEARLY;BYMONTH=1,3', start: new Date(2014, 0, 1), min: new Date(2014, 0, 1), max: new Date(2015, 2, 19) });

    assert.deepEqual(dates, [new Date(2014, 0, 1), new Date(2014, 2, 1), new Date(2015, 0, 1), new Date(2015, 2, 1)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYMONTHDAY', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=MONTHLY;BYMONTHDAY=2', start: new Date(2015, 0, 1), min: new Date(2015, 0, 1), max: new Date(2015, 2, 19) });

    assert.deepEqual(dates, [new Date(2015, 0, 2), new Date(2015, 1, 2), new Date(2015, 2, 2)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with MONTHLY & BYDAY', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=MONTHLY;BYDAY=MO', start: new Date(2017, 8, 25), min: new Date(2017, 8, 20), max: new Date(2017, 9, 20) });

    assert.deepEqual(dates, [new Date(2017, 8, 25), new Date(2017, 9, 2), new Date(2017, 9, 9), new Date(2017, 9, 16)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYMONTHDAY value < 0', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=MONTHLY;BYMONTHDAY=-1', start: new Date(2015, 0, 1), min: new Date(2015, 0, 1), max: new Date(2015, 5, 19) });

    assert.deepEqual(dates, [new Date(2015, 0, 31), new Date(2015, 1, 28), new Date(2015, 2, 31), new Date(2015, 3, 30), new Date(2015, 4, 31)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYMONTHDAY value = -1, recStart - last day of Month (31st) (T515652)', function(assert) {
    const firstRecurrence = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=MONTHLY;BYMONTHDAY=-1', start: new Date(2017, 4, 31), min: new Date(2017, 4, 31), max: new Date(2017, 6, 1) });

    assert.deepEqual(firstRecurrence, [new Date(2017, 4, 31), new Date(2017, 5, 30)], 'dates are right');

    const secondRecurrence = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=MONTHLY;BYMONTHDAY=-1', start: new Date(2017, 2, 31), min: new Date(2017, 2, 31), max: new Date(2017, 4, 1) });

    assert.deepEqual(secondRecurrence, [new Date(2017, 2, 31), new Date(2017, 3, 30)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle strings with COUNT, BYMONTHDAY=-1 and start in 31st', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=MONTHLY;BYMONTHDAY=-1;COUNT=10', start: new Date(2017, 6, 31), min: new Date(2017, 6, 31), max: new Date(2017, 10, 10) });

    assert.deepEqual(dates, [new Date(2017, 6, 31), new Date(2017, 7, 31), new Date(2017, 8, 30), new Date(2017, 9, 31)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYMONTHDAY value = -31', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=MONTHLY;BYMONTHDAY=-31', start: new Date(2015, 0, 1), min: new Date(2015, 0, 1), max: new Date(2015, 6, 19) });

    assert.deepEqual(dates, [new Date(2015, 0, 1), new Date(2015, 2, 1), new Date(2015, 4, 1), new Date(2015, 6, 1)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYMONTHDAY value = -25', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=MONTHLY;BYMONTHDAY=-25', start: new Date(2015, 2, 1), min: new Date(2015, 2, 1), max: new Date(2015, 5, 19) });

    assert.deepEqual(dates, [new Date(2015, 2, 7), new Date(2015, 3, 6), new Date(2015, 4, 7), new Date(2015, 5, 6), ], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYMONTHDAY && INTERVAL=2', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=MONTHLY;BYMONTHDAY=10;INTERVAL=2', start: new Date(2016, 0, 11, 9), min: new Date(2016, 0, 1), max: new Date(2016, 3, 1) });

    assert.deepEqual(dates, [new Date(2016, 2, 10, 9)], 'date is right');
});

QUnit.test('getDatesByRecurrence should handle strings with several value in BYMONTHDAY', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=MONTHLY;BYMONTHDAY=11,22', start: new Date(2015, 0, 1), min: new Date(2015, 0, 1), max: new Date(2015, 2, 19) });

    assert.deepEqual(dates, [new Date(2015, 0, 11), new Date(2015, 0, 22), new Date(2015, 1, 11), new Date(2015, 1, 22), new Date(2015, 2, 11)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYMONTH & BYMONTHDAY', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=MONTHLY;BYMONTH=1;BYMONTHDAY=2', start: new Date(2015, 0, 1), min: new Date(2015, 0, 1), max: new Date(2015, 2, 19) });

    assert.deepEqual(dates, [new Date(2015, 0, 2)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYMONTHDAY correctly when recurrenceDate is out of range', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=MONTHLY;BYMONTHDAY=26', start: new Date(2015, 4, 25, 9, 30), end: new Date(2015, 4, 26, 11, 30), min: new Date(2015, 4, 27), max: new Date(2015, 4, 27, 23, 59) });

    assert.deepEqual(dates, [], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYSECOND', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=MINUTELY;BYSECOND=15', start: new Date(2015, 0, 1, 1, 1, 10), min: new Date(2015, 0, 1, 1, 1, 10), max: new Date(2015, 0, 1, 1, 3, 20) });

    assert.deepEqual(dates, [new Date(2015, 0, 1, 1, 1, 15), new Date(2015, 0, 1, 1, 2, 15), new Date(2015, 0, 1, 1, 3, 15)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with several value in BYSECOND', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=MINUTELY;BYSECOND=15,17', start: new Date(2015, 0, 1, 1, 1, 10), min: new Date(2015, 0, 1, 1, 1, 10), max: new Date(2015, 0, 1, 1, 2, 20) });

    assert.deepEqual(dates, [new Date(2015, 0, 1, 1, 1, 15), new Date(2015, 0, 1, 1, 1, 17), new Date(2015, 0, 1, 1, 2, 15), new Date(2015, 0, 1, 1, 2, 17)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYMINUTE', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=HOURLY;BYMINUTE=15', start: new Date(2015, 0, 1, 1, 10), min: new Date(2015, 0, 1, 1, 10), max: new Date(2015, 0, 1, 3, 20) });

    assert.deepEqual(dates, [new Date(2015, 0, 1, 1, 15), new Date(2015, 0, 1, 2, 15), new Date(2015, 0, 1, 3, 15)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with several value in BYMINUTE', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=HOURLY;BYMINUTE=15,17', start: new Date(2015, 0, 1, 1, 10), min: new Date(2015, 0, 1, 1, 10), max: new Date(2015, 0, 1, 2, 16) });

    assert.deepEqual(dates, [new Date(2015, 0, 1, 1, 15), new Date(2015, 0, 1, 1, 17), new Date(2015, 0, 1, 2, 15)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYHOUR', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=DAILY;BYHOUR=15', start: new Date(2015, 0, 1, 10), min: new Date(2015, 0, 1, 10), max: new Date(2015, 0, 3, 20) });

    assert.deepEqual(dates, [new Date(2015, 0, 1, 15), new Date(2015, 0, 2, 15), new Date(2015, 0, 3, 15)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with several value in BYMINUTE', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=DAILY;BYHOUR=15,17', start: new Date(2015, 0, 1, 10), min: new Date(2015, 0, 1, 10), max: new Date(2015, 0, 2, 16) });

    assert.deepEqual(dates, [new Date(2015, 0, 1, 15), new Date(2015, 0, 1, 17), new Date(2015, 0, 2, 15)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYDAY to reduce date count', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=DAILY;BYDAY=TU', start: new Date(2015, 1, 10), min: new Date(2015, 1, 10), max: new Date(2015, 2, 9) });

    assert.deepEqual(dates, [new Date(2015, 1, 10), new Date(2015, 1, 17), new Date(2015, 1, 24), new Date(2015, 2, 3)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with several value in BYDAY to reduce date count', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=DAILY;BYDAY=TU,SA', start: new Date(2015, 1, 10), min: new Date(2015, 1, 10), max: new Date(2015, 1, 23) });

    assert.deepEqual(dates, [new Date(2015, 1, 10), new Date(2015, 1, 14), new Date(2015, 1, 17), new Date(2015, 1, 21)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYYEARDAY, YEARLY rule', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=YEARLY;BYYEARDAY=200,201', start: new Date(2015, 1, 10), min: new Date(2015, 1, 10), max: new Date(2017, 1, 23) });

    assert.deepEqual(dates, [new Date(2015, 6, 19), new Date(2015, 6, 20), new Date(2016, 6, 18), new Date(2016, 6, 19)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYWEEKNO & BYDAY, YEARLY rule', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=YEARLY;BYWEEKNO=20,21;BYDAY=TU,SA', start: new Date(2015, 1, 10), min: new Date(2015, 1, 10), max: new Date(2016, 1, 23) });

    assert.deepEqual(dates, [new Date(2015, 4, 12), new Date(2015, 4, 16), new Date(2015, 4, 19), new Date(2015, 4, 23)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYWEEKNO, YEARLY rule', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=YEARLY;BYWEEKNO=20', start: new Date(2015, 1, 10), min: new Date(2015, 1, 10), max: new Date(2016, 1, 23) });

    assert.deepEqual(dates, [new Date(2015, 4, 11), new Date(2015, 4, 12), new Date(2015, 4, 13), new Date(2015, 4, 14), new Date(2015, 4, 15), new Date(2015, 4, 16), new Date(2015, 4, 17)], 'date are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYWEEKNO on second year, YEARLY rule', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=YEARLY;BYWEEKNO=20', start: new Date(2015, 1, 10), min: new Date(2016, 1, 10), max: new Date(2017, 1, 23) });

    assert.deepEqual(dates, [new Date(2016, 4, 16), new Date(2016, 4, 17), new Date(2016, 4, 18), new Date(2016, 4, 19), new Date(2016, 4, 20), new Date(2016, 4, 21), new Date(2016, 4, 22)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYWEEKNO & WKST=TH, YEARLY rule', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=TH', start: new Date(2016, 0, 1), min: new Date(2016, 0, 1), max: new Date(2016, 11, 31) });

    assert.deepEqual(dates, [new Date(2016, 0, 14), new Date(2016, 0, 15), new Date(2016, 0, 16), new Date(2016, 0, 17), new Date(2016, 0, 18), new Date(2016, 0, 19), new Date(2016, 0, 20)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYWEEKNO & WKST=FR, YEARLY rule', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=FR', start: new Date(2016, 0, 1), min: new Date(2016, 0, 1), max: new Date(2016, 11, 31) });

    assert.deepEqual(dates, [new Date(2016, 0, 15), new Date(2016, 0, 16), new Date(2016, 0, 17), new Date(2016, 0, 18), new Date(2016, 0, 19), new Date(2016, 0, 20), new Date(2016, 0, 21)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYWEEKNO & WKST=SA, YEARLY rule', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=SA', start: new Date(2016, 0, 1), min: new Date(2016, 0, 1), max: new Date(2016, 11, 31) });

    assert.deepEqual(dates, [new Date(2016, 0, 16), new Date(2016, 0, 17), new Date(2016, 0, 18), new Date(2016, 0, 19), new Date(2016, 0, 20), new Date(2016, 0, 21), new Date(2016, 0, 22)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYWEEKNO & WKST=SU, YEARLY rule', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=SU', start: new Date(2016, 0, 1), min: new Date(2016, 0, 1), max: new Date(2016, 11, 31) });

    assert.deepEqual(dates, [new Date(2016, 0, 17), new Date(2016, 0, 18), new Date(2016, 0, 19), new Date(2016, 0, 20), new Date(2016, 0, 21), new Date(2016, 0, 22), new Date(2016, 0, 23)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYWEEKNO & WKST=MO, YEARLY rule', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=MO', start: new Date(2016, 0, 1), min: new Date(2016, 0, 1), max: new Date(2016, 11, 31) });

    assert.deepEqual(dates, [new Date(2016, 0, 18), new Date(2016, 0, 19), new Date(2016, 0, 20), new Date(2016, 0, 21), new Date(2016, 0, 22), new Date(2016, 0, 23), new Date(2016, 0, 24)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYWEEKNO & WKST=TU, YEARLY rule', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=TU', start: new Date(2016, 0, 1), min: new Date(2016, 0, 1), max: new Date(2016, 11, 31) });

    assert.deepEqual(dates, [new Date(2016, 0, 12), new Date(2016, 0, 13), new Date(2016, 0, 14), new Date(2016, 0, 15), new Date(2016, 0, 16), new Date(2016, 0, 17), new Date(2016, 0, 18)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYWEEKNO & WKST=WE, YEARLY rule', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=WE', start: new Date(2016, 0, 1), min: new Date(2016, 0, 1), max: new Date(2016, 11, 31) });

    assert.deepEqual(dates, [new Date(2016, 0, 13), new Date(2016, 0, 14), new Date(2016, 0, 15), new Date(2016, 0, 16), new Date(2016, 0, 17), new Date(2016, 0, 18), new Date(2016, 0, 19)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle strings with WKST, WEEKLY rule', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=WEEKLY;BYDAY=TU;WKST=WE;INTERVAL=2', start: new Date(2017, 0, 12, 9, 0), min: new Date(2017, 0, 9), max: new Date(2017, 1, 1) });

    assert.deepEqual(dates, [new Date(2017, 0, 17, 9), new Date(2017, 0, 31, 9)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle strings with BYSETPOS', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=YEARLY;BYWEEKNO=8;BYSETPOS=-1,3', start: new Date(2017, 0, 1, 10), min: new Date(2017, 0, 1), max: new Date(2018, 0, 1) });

    assert.deepEqual(dates, [new Date(2017, 1, 22, 10), new Date(2017, 1, 26, 10)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle recurrence exception in short format, DAILY rule', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=DAILY', start: new Date(2015, 0, 1, 10), min: new Date(2015, 0, 1), max: new Date(2015, 0, 3, 15), exception: '20150102' });

    assert.deepEqual(dates, [new Date(2015, 0, 1, 10), new Date(2015, 0, 3, 10)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle recurrence exception in long format, DAILY rule', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=DAILY', start: new Date(2015, 4, 24, 2), min: new Date(2015, 4, 24), max: new Date(2015, 4, 27, 10), exception: '20150525T020000' });

    assert.deepEqual(dates, [new Date(2015, 4, 24, 2), new Date(2015, 4, 26, 2), new Date(2015, 4, 27, 2)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle recurrence exception in long format with \'Z\', DAILY rule', function(assert) {
    const recurrenceUtilsStub = sinon.stub(recurrenceUtils, 'getTimeZoneOffset', function() {
        return new Date(2015, 4, 24).getTimezoneOffset();
    });
    try {
        const dates = recurrenceUtils.getDatesByRecurrence({
            rule: 'FREQ=DAILY',
            start: new Date(Date.UTC(2015, 4, 24)),
            min: new Date(Date.UTC(2015, 4, 23, 21)),
            max: new Date(Date.UTC(2015, 4, 27, 7)),
            exception: '20150525T000000Z'
        });

        assert.deepEqual(dates, [new Date(Date.UTC(2015, 4, 24)), new Date(Date.UTC(2015, 4, 26)), new Date(Date.UTC(2015, 4, 27))], 'dates are right');
    } finally {
        recurrenceUtilsStub.restore();
    }
});

QUnit.test('getDatesByRecurrence should handle recurrence exception, WEEKLY rule', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=WEEKLY;BYDAY=MO', start: new Date(2015, 0, 1), min: new Date(2015, 0, 5), max: new Date(2015, 0, 7), exception: '20150105' });

    assert.deepEqual(dates, [], 'dates are right');
});

QUnit.test('Weekly recurrences should be shown on the 29 February, WEEKLY rule', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=WEEKLY;BYDAY=MO', start: new Date(2016, 1, 1, 2, 0), min: new Date(2016, 1, 1), max: new Date(2016, 2, 7) });

    assert.deepEqual(dates, [new Date(2016, 1, 1, 2, 0), new Date(2016, 1, 8, 2, 0), new Date(2016, 1, 15, 2, 0), new Date(2016, 1, 22, 2, 0), new Date(2016, 1, 29, 2, 0)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle strings correctly if interval starts from any day, WEEKLY rule', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=WEEKLY;BYDAY=MO,TH,SA', start: new Date(2015, 2, 12), min: new Date(2015, 2, 12), max: new Date(2015, 2, 18, 23, 59) });

    assert.deepEqual(dates, [new Date(2015, 2, 12), new Date(2015, 2, 14), new Date(2015, 2, 16)], 'dates are right');
});

QUnit.test('getDatesByRecurrence should handle strings correctly for WEEKLY rule with BYDAY for next week', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH', start: new Date(2017, 5, 29, 9), min: new Date(2017, 6, 3), max: new Date(2017, 6, 7, 23, 59) });

    assert.deepEqual(dates, [new Date(2017, 6, 3, 9), new Date(2017, 6, 4, 9), new Date(2017, 6, 5, 9), new Date(2017, 6, 6, 9)], 'dates are right');
});

QUnit.test('getRecurrenceString should handle objects with freq', function(assert) {
    const string = recurrenceUtils.getRecurrenceString({ freq: 'yearly', interval: 2 });

    assert.equal(string, 'FREQ=YEARLY;INTERVAL=2', 'recurrence string is right');
});

QUnit.test('getRecurrenceString should handle objects with freq & interval', function(assert) {
    const string = recurrenceUtils.getRecurrenceString({ freq: 'yearly', interval: 1 });

    assert.equal(string, 'FREQ=YEARLY', 'recurrence string is right');
});

QUnit.test('getRecurrenceString should handle objects with freq & interval > 1', function(assert) {
    const string = recurrenceUtils.getRecurrenceString({ freq: 'yearly', interval: 2 });

    assert.equal(string, 'FREQ=YEARLY;INTERVAL=2', 'recurrence string is right');
});

QUnit.test('getRecurrenceString should handle objects without freq', function(assert) {
    const string = recurrenceUtils.getRecurrenceString({ interval: 2 });

    assert.equal(string, undefined, 'recurrence string is right');
});

QUnit.test('getRecurrenceString should handle objects with until', function(assert) {
    const recurrenceUtilsStub = sinon.stub(recurrenceUtils, 'getTimeZoneOffset', function() {
        return new Date(2015, 6, 9).getTimezoneOffset();
    });

    try {
        const string = recurrenceUtils.getRecurrenceString({ freq: 'yearly', until: new Date(Date.UTC(2015, 6, 9)) });

        assert.equal(string, 'FREQ=YEARLY;UNTIL=20150709T000000Z', 'recurrence string is right');
    } finally {
        recurrenceUtilsStub.restore();
    }
});

QUnit.test('get date by month recurrence with start date at 31', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=MONTHLY', start: new Date(2015, 0, 31), min: new Date(2015, 1, 15), max: new Date(2015, 5, 5) });

    assert.deepEqual(dates, [new Date(2015, 2, 31), new Date(2015, 4, 31)], 'dates are right');
});

QUnit.test('get date by month recurrence with BYMONTHDAY at 31', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=MONTHLY;BYMONTHDAY=31', start: new Date(2015, 1, 15), min: new Date(2015, 1, 15), max: new Date(2015, 5, 5) });

    assert.deepEqual(dates, [new Date(2015, 2, 31), new Date(2015, 4, 31)], 'dates are right');
});

QUnit.test('get date by month recurrence with BYMONTHDAY at 31', function(assert) {
    const dates = recurrenceUtils.getDatesByRecurrence({ rule: 'FREQ=DAILY;BYMONTHDAY=31', start: new Date(2015, 1, 15), min: new Date(2015, 1, 15), max: new Date(2015, 5, 5) });

    assert.deepEqual(dates, [new Date(2015, 2, 31), new Date(2015, 4, 31)], 'dates are right');
});

QUnit.test('get days of the week by byDay rule', function(assert) {
    const ruleObject = recurrenceUtils.getRecurrenceRule('FREQ=WEEKLY;BYDAY=TU,SA');
    const days = recurrenceUtils.daysFromByDayRule(ruleObject.rule);

    assert.deepEqual(days, ['TU', 'SA'], 'returned array is correct');
});

QUnit.test('getRecurrenceRule should return an object', function(assert) {
    const ruleObject = recurrenceUtils.getRecurrenceRule('FREQ=MONTHLY');

    assert.deepEqual(ruleObject, {
        'isValid': true, 'rule':
        {
            'freq': 'MONTHLY',
            'interval': 1
        }
    }, 'returned ruleObject is right');
});

QUnit.test('getRecurrenceRule should return an invalid object for incorrect freq', function(assert) {
    const ruleObject = recurrenceUtils.getRecurrenceRule('FREQ=WRONG');

    assert.notOk(ruleObject.isValid, 'returned ruleObject is invalid');
});

QUnit.test('getRecurrenceRule should return an invalid object for string with wrong rule name', function(assert) {
    const ruleObject = recurrenceUtils.getRecurrenceRule('FRE=DAILY');

    assert.notOk(ruleObject.isValid, 'returned ruleObject is invalid');
});

QUnit.test('getRecurrenceRule should return an invalid object for string with wrong count', function(assert) {
    const ruleObject = recurrenceUtils.getRecurrenceRule('FREQ=DAILY;COUNT=wrong');

    assert.notOk(ruleObject.isValid, 'returned ruleObject is invalid');
});

QUnit.test('getRecurrenceRule should return an invalid object for string with wrong interval', function(assert) {
    const ruleObject = recurrenceUtils.getRecurrenceRule('FREQ=DAILY;INTERVAL=wrong');

    assert.notOk(ruleObject.isValid, 'returned ruleObject is invalid');
});

QUnit.test('getRecurrenceRule should return an invalid object for string with wrong byDay', function(assert) {
    const ruleObject = recurrenceUtils.getRecurrenceRule('FREQ=DAILY;BYDAY=wrong');

    assert.notOk(ruleObject.isValid, 'returned ruleObject is invalid');
});

QUnit.test('getRecurrenceRule should return an invalid object for string with wrong byDay, several value', function(assert) {
    const ruleObject = recurrenceUtils.getRecurrenceRule('FREQ=DAILY;BYDAY=MO,wrong');

    assert.notOk(ruleObject.isValid, 'returned ruleObject is invalid');
});

QUnit.test('getRecurrenceRule should return an invalid object for string with wrong byMonthDay', function(assert) {
    const ruleObject = recurrenceUtils.getRecurrenceRule('FREQ=MONTHLY;BYMONTHDAY=wrong');

    assert.notOk(ruleObject.isValid, 'returned ruleObject is invalid');
});

QUnit.test('getRecurrenceRule should return an invalid object for string with wrong byMonth', function(assert) {
    const ruleObject = recurrenceUtils.getRecurrenceRule('FREQ=YEARLY;BYMONTH=wrong;BYMONTHDAY=12');

    assert.notOk(ruleObject.isValid, 'returned ruleObject is invalid');
});

QUnit.test('getRecurrenceRule should return an invalid object for string with wrong until date', function(assert) {
    const ruleObject = recurrenceUtils.getRecurrenceRule('FREQ=DAILY;UNTIL=wrong');

    assert.notOk(ruleObject.isValid, 'returned ruleObject is invalid');
});

QUnit.test('getDateByAsciiString should return a valid date for yyyyMMddThhmmss format', function(assert) {
    const date = recurrenceUtils.getDateByAsciiString('20150303T030000');

    assert.deepEqual(date, new Date(2015, 2, 3, 3, 0), 'parsed date is correct');
});

QUnit.test('getDateByAsciiString should return a valid date for yyyyMMddTHHmmss format', function(assert) {
    const date = recurrenceUtils.getDateByAsciiString('20150303T173000');

    assert.deepEqual(date, new Date(2015, 2, 3, 17, 30), 'parsed date is correct');
});

QUnit.test('getDateByAsciiString should return a valid date for yyyyMMdd format', function(assert) {
    const date = recurrenceUtils.getDateByAsciiString('20150303');

    assert.deepEqual(date, new Date(2015, 2, 3), 'parsed date is correct');
});

QUnit.test('getDateByAsciiString should return a valid date for yyyyMMddTHHmmssZ format', function(assert) {
    const recurrenceUtilsStub = sinon.stub(recurrenceUtils, 'getTimeZoneOffset', function() {
        return new Date(2016, 6, 11).getTimezoneOffset();
    });

    try {
        const date = recurrenceUtils.getDateByAsciiString('20160711T230000Z');

        assert.deepEqual(date, new Date(Date.UTC(2016, 6, 11, 23)), 'parsed date is correct');
    } finally {
        recurrenceUtilsStub.restore();
    }
});

