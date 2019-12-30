// TODO: Move this tests to localization module

require('../../helpers/l10n/cldrNumberDataRu.js');
require('../../helpers/l10n/cldrCurrencyDataRu.js');
require('../../helpers/l10n/cldrCurrencyDataEn.js');

require('localization/globalize/core');
require('localization/globalize/number');
require('localization/globalize/currency');
require('localization/globalize/date');
require('localization/globalize/message');

const Globalize = require('globalize');

const NBSP = String.fromCharCode(160);
const RUB = String.fromCharCode(8381);

const noop = require('core/utils/common').noop;
const formatHelper = require('format_helper');
const browser = require('core/utils/browser');
const dateUtils = require('core/utils/date');

QUnit.module('Numeric and dateTime formats', {
    beforeEach: function() {
        this.testDate = new Date(2010, 2, 5, 12, 13, 33, 0);
    }
});
QUnit.test('Currency numeric formats', function(assert) {
    // assert
    assert.equal(formatHelper.format(1204, 'currency'), '$1,204');
    assert.equal(formatHelper.format(1204, { type: 'cuRRency', precision: 2 }), '$1,204.00');
    assert.equal(formatHelper.format(-1204, { type: 'currency', precision: 2 }), '($1,204.00)');
});
QUnit.test('currency RUB large number format with different locales', function(assert) {
    const currentCultureName = Globalize.locale().locale;

    assert.equal(formatHelper.format(1.204, { type: 'currency', precision: 2, currency: 'RUB' }), 'RUB' + NBSP + '1.20');

    Globalize.locale('ru');
    try {
        assert.equal(formatHelper.format(1.204, { type: 'currency', precision: 2, currency: 'RUB' }), '1,20' + NBSP + RUB);
    } finally {
        Globalize.locale(currentCultureName);
    }
});
QUnit.test('Fixed point numeric formats', function(assert) {
    // assert
    assert.equal(formatHelper.format(23.04059872, { type: 'fIxedPoint', precision: 4 }), '23.0406');
});
QUnit.test('Percent numeric formats', function(assert) {
    // assert
    assert.equal(formatHelper.format(0.45, 'percEnt'), '45%');
    assert.equal(formatHelper.format(0.45, { type: 'peRcent', precision: 2 }), '45.00%');
});
QUnit.test('Decimal numeric formats', function(assert) {
    // assert
    assert.equal(formatHelper.format(437, 'decimAl'), '437');
    assert.equal(formatHelper.format(437, { type: 'deCimal', precision: 5 }), '00437');
});
QUnit.test('Long date format', function(assert) {
    // assert
    assert.equal(formatHelper.format(this.testDate, 'LONGDate'), 'Friday, March 5, 2010');
});
QUnit.test('Long time format', function(assert) {
    // assert
    assert.equal(formatHelper.format(this.testDate, 'longTIME'), '12:13:33 PM');
});
QUnit.test('Month and day format', function(assert) {
    // assert
    assert.equal(formatHelper.format(this.testDate, 'monthAndDAY'), 'March 5');
});
QUnit.test('Month and year format', function(assert) {
    // assert
    assert.equal(formatHelper.format(this.testDate, 'MONTHAndYear'), 'March 2010');
});
QUnit.test('Short date format', function(assert) {
    // assert
    assert.equal(formatHelper.format(this.testDate, 'shoRTDate'), '3/5/2010');
});
QUnit.test('Short time format', function(assert) {
    // assert
    assert.equal(formatHelper.format(this.testDate, 'shoRTTime'), '12:13 PM');
});
QUnit.test('Custom date time format', function(assert) {
    // assert
    assert.equal(formatHelper.format(this.testDate, 'dd MMM yy'), '05 Mar 10');
});

QUnit.test('LongDateLongTime', function(assert) {
    // assert
    assert.equal(formatHelper.format(this.testDate, 'LONGDATELongTime'), 'Friday, March 5, 2010, 12:13:33 PM');
});

QUnit.test('ShortDateShortTime', function(assert) {
    // assert
    assert.equal(formatHelper.format(this.testDate, 'shortDATESHORTTime'), '3/5/2010, 12:13 PM');
});

QUnit.test('Invalid format parameters', function(assert) {
    // assert
    assert.equal(formatHelper.format('test', 'percent'), 'test');
    assert.equal(formatHelper.format(12, 12), 12);
});
QUnit.test('Quarter and year', function(assert) {
    // assert
    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'QUarterAndYear'), 'Q1 2005');
    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'dd MMM yy, Q'), '01 Jan 05, 1');
    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'qq, dd MMM yy'), '01, 01 Jan 05');
    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'q, yy'), '1, 05');
    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'qq, yy'), '01, 05');
    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'QQ, yyyy MM'), '01, 2005 01');
    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'qqq, yyyy'), 'Q1, 2005');
    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'qqqq, yyyy'), '1st quarter, 2005');
});
// B218108
QUnit.test('Custom quarter format', function(assert) {
    // assert
    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'q'), '1', 'quarter format - q');
    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'Q'), '1', 'quarter format - Q');
    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'qq'), '01', 'quarter format - qq');
    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'QQ'), '01', 'quarter format - QQ');
    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'qqq'), 'Q1', 'quarter format - qqq');
    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'QQQ'), 'Q1', 'quarter format - QQQ');
    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'qqqq'), '1st quarter', 'quarter format - qqqq');
    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'QQQQ'), '1st quarter', 'quarter format - QQQQ');

    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'q MMM QQ'), '1 Jan 01', 'quarter format - q MMM QQ');
});
QUnit.test('Quarters for any months', function(assert) {
    // assert
    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'quartERAndYear'), 'Q1 2005');
    assert.equal(formatHelper.format(new Date(2005, 1, 1), 'quartERAndYear'), 'Q1 2005');
    assert.equal(formatHelper.format(new Date(2005, 2, 1), 'quartERAndYear'), 'Q1 2005');

    assert.equal(formatHelper.format(new Date(2005, 3, 1), 'quarterANDYear'), 'Q2 2005');
    assert.equal(formatHelper.format(new Date(2005, 4, 1), 'quarterANDYear'), 'Q2 2005');
    assert.equal(formatHelper.format(new Date(2005, 5, 1), 'quarterANDYear'), 'Q2 2005');

    assert.equal(formatHelper.format(new Date(2005, 6, 1), 'qUARterAndYear'), 'Q3 2005');
    assert.equal(formatHelper.format(new Date(2005, 7, 1), 'qUARterAndYear'), 'Q3 2005');
    assert.equal(formatHelper.format(new Date(2005, 8, 1), 'qUARterAndYear'), 'Q3 2005');

    assert.equal(formatHelper.format(new Date(2005, 9, 1), 'qUARterAndYear'), 'Q4 2005');
    assert.equal(formatHelper.format(new Date(2005, 10, 1), 'qUARterAndYear'), 'Q4 2005');
    assert.equal(formatHelper.format(new Date(2005, 11, 1), 'qUARterAndYear'), 'Q4 2005');
});
QUnit.test('Choose call format method by the value type', function(assert) {
    // assert
    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'loNGDate'), 'Saturday, January 1, 2005');
    assert.equal(formatHelper.format(new Date(2005, 0, 1), 'SHORTDate'), '1/1/2005');
    assert.equal(formatHelper.format(12.098, { type: 'fixEDPoint', precision: 2 }), '12.10');
    assert.equal(formatHelper.format(12.098, { type: 'cuRRency', precision: 1 }), '$12.1');
    assert.equal(formatHelper.format('InvalidValue'), 'InvalidValue');
});
QUnit.test('Millisecond date time interval format', function(assert) {
    // assert
    assert.equal(formatHelper.format(new Date(2005, 0, 1, 10, 33, 20, 237), 'millisecond'), '237');
    assert.equal(formatHelper.format(new Date(2005, 0, 1, 10, 33, 20, 569), 'millisecond'), '569');
});
QUnit.test('Day date time interval format', function(assert) {
    // assert
    assert.equal(formatHelper.format(new Date(2005, 0, 16, 10, 33, 20, 237), 'day'), '16');
    assert.equal(formatHelper.format(new Date(2005, 0, 30, 19, 23, 56, 237), 'day'), '30');
});
QUnit.test('Month date time interval format', function(assert) {
    // assert
    assert.equal(formatHelper.format(new Date(2005, 0, 16, 10, 33, 20, 237), 'month'), 'January');
    assert.equal(formatHelper.format(new Date(2005, 9, 27, 19, 23, 56, 237), 'month'), 'October');
});
QUnit.test('Quarter date time interval format', function(assert) {
    // assert
    assert.equal(formatHelper.format(new Date(2005, 0, 16, 10, 33, 20, 237), 'quarter'), 'Q1');
    assert.equal(formatHelper.format(new Date(2005, 9, 27, 19, 23, 56, 237), 'quarter'), 'Q4');
});
QUnit.test('Year date time interval format', function(assert) {
    // assert
    assert.equal(formatHelper.format(new Date(2005, 0, 16, 10, 33, 20, 237), 'year'), '2005');
    assert.equal(formatHelper.format(new Date(2009, 9, 27, 19, 23, 56, 237), 'year'), '2009');
});
QUnit.test('Short Year date time interval format', function(assert) {
    // assert
    assert.equal(formatHelper.format(new Date(2005, 0, 16, 10, 33, 20, 237), 'shortyear'), '05');
    assert.equal(formatHelper.format(new Date(2009, 9, 27, 19, 23, 56, 237), 'shortyear'), '09');
});

function isIosWithMSKTimeZone() {
    const isIos = navigator.userAgent.indexOf('Mac OS X') > -1 && browser['webkit'];
    const hasMSKTimeZone = new Date().toString().indexOf('MSK') > -1;

    return isIos && hasMSKTimeZone;
}

// This condition is added because of Safari bug 15434904
if(!isIosWithMSKTimeZone()) {
    QUnit.test('getDateMarkerFormat for second range', function(assert) {
        // assert
        const date1 = new Date(2010, 0, 1, 2, 23, 33);
        const date2 = new Date(date1.getTime());
        let format;

        date2.setMilliseconds(3000);
        format = formatHelper.getDateFormatByDifferences(dateUtils.getDatesDifferences(date1, date2));
        assert.equal(formatHelper.format(date2, format), '2:23:36 AM');
    });
    QUnit.test('getDateMarkerFormat for minute range', function(assert) {
        // assert
        const date1 = new Date(2010, 0, 1, 2, 23, 33, 990);
        let date2 = new Date(date1.getTime());
        let format;

        date2.setSeconds(63);
        format = formatHelper.getDateFormatByDifferences(dateUtils.getDatesDifferences(date1, date2));
        assert.equal(formatHelper.format(date2, format), '2:24:03 AM');

        date2 = new Date(date1.getTime());
        date2.setMinutes(25);
        format = formatHelper.getDateFormatByDifferences(dateUtils.getDatesDifferences(date1, date2));
        assert.equal(formatHelper.format(date2, format), '2:25 AM');
    });
    QUnit.test('getDateMarkerFormat for hour range', function(assert) {
        // assert
        const date1 = new Date(2010, 0, 1, 2, 23, 33, 990);
        let date2 = new Date(date1.getTime());
        let format;

        date2.setSeconds(30000);
        format = formatHelper.getDateFormatByDifferences(dateUtils.getDatesDifferences(date1, date2));
        assert.equal(formatHelper.format(date2, format), '10:43:00 AM');

        date2 = new Date(date1.getTime());
        date2.setHours(4);
        format = formatHelper.getDateFormatByDifferences(dateUtils.getDatesDifferences(date1, date2));
        assert.equal(formatHelper.format(date2, format), '4:23 AM');
    });
}

QUnit.test('getDateMarkerFormat for day range', function(assert) {
    // assert
    const date1 = new Date(2010, 0, 29, 12, 23, 33, 990);
    let date2 = new Date(date1.getTime());
    let format;

    // day and time
    date2 = new Date(date1.getTime());
    date2.setMinutes(1000);
    format = formatHelper.getDateFormatByDifferences(dateUtils.getDatesDifferences(date1, date2));
    assert.equal(formatHelper.format(date2, format), 'Saturday, 30 4:40 AM');

    // day
    date2 = new Date(date1.getTime());
    date2.setDate(30);
    format = formatHelper.getDateFormatByDifferences(dateUtils.getDatesDifferences(date1, date2));
    assert.equal(formatHelper.format(date2, format), 'Saturday, 30');
});
QUnit.test('getDateMarkerFormat for month range', function(assert) {
    // assert
    const date1 = new Date(2010, 10, 29, 12, 23, 33, 990);
    let date2 = new Date(date1.getTime());
    let format;

    // month, day and time
    date2.setHours(74);
    format = formatHelper.getDateFormatByDifferences(dateUtils.getDatesDifferences(date1, date2));
    assert.equal(formatHelper.format(date2, format), 'December 2 2:23 AM');

    // year, month, day and time
    date2 = new Date(date1.getTime());
    date2.setFullYear(2011);
    date2.setMonth(11);
    date2.setHours(74);
    format = formatHelper.getDateFormatByDifferences(dateUtils.getDatesDifferences(date1, date2));
    assert.equal(formatHelper.format(date2, format), '1/1/2012 2:23 AM');

    // month and day
    date2 = new Date(date1.getTime());
    date2.setDate(32);
    format = formatHelper.getDateFormatByDifferences(dateUtils.getDatesDifferences(date1, date2));
    assert.equal(formatHelper.format(date2, format), 'December 2');

    // month
    date2 = new Date(date1.getTime());
    date2.setMonth(11);
    format = formatHelper.getDateFormatByDifferences(dateUtils.getDatesDifferences(date1, date2));
    assert.equal(formatHelper.format(date2, format), 'December');
});
QUnit.test('getDateMarkerFormat for year range', function(assert) {
    // assert
    const date1 = new Date(2010, 10, 29, 12, 23, 33, 990);
    const date2 = new Date(date1.getTime());
    let format;

    // year
    date2.setFullYear(2031);
    format = formatHelper.getDateFormatByDifferences(dateUtils.getDatesDifferences(date1, date2));
    assert.equal(formatHelper.format(date2, format), '2031');
});
// B217749
QUnit.test('value is null or undefined', function(assert) {
    // act, assert
    assert.strictEqual(formatHelper.format(null, ''), '');
    assert.strictEqual(formatHelper.format(undefined, ''), '');
    assert.strictEqual(formatHelper.format('test', ''), 'test');
});

QUnit.test('large number auto format negative numbers', function(assert) {
    // act, assert
    assert.strictEqual(formatHelper.format(-123, 'fixedPoint largeNumber'), '-123');
    assert.strictEqual(formatHelper.format(-1230, 'fixedPoint largeNumber'), '-1K');
    assert.strictEqual(formatHelper.format(-12300000, 'fixedPoint largeNumber'), '-12M');
});

QUnit.test('large number auto format precision', function(assert) {
    // act, assert
    assert.strictEqual(formatHelper.format(0.01, 'fixedPoint LARGENumber'), '0');
    assert.strictEqual(formatHelper.format(10.23, 'fixedPoint largeNumber'), '10');
    assert.strictEqual(formatHelper.format(123, { type: 'fixedPoint largeNumber', precision: 1 }), '123.0');
    assert.strictEqual(formatHelper.format(12345, { type: 'fixedPoint largeNUMBER', precision: 2 }), '12.35K');
    assert.strictEqual(formatHelper.format(12345, { type: 'fixedPoint largeNumber', precision: 5 }), '12.34500K');
});

QUnit.test('large number auto format small numbers', function(assert) {
    // act, assert
    assert.strictEqual(formatHelper.format(0.01, { type: 'fixedPoint largeNumber', precision: 2 }), '0.01');
    assert.strictEqual(formatHelper.format(999, { type: 'fixedPoint largeNumber', precision: 2 }), '999.00');
    assert.strictEqual(formatHelper.format(999.9, { type: 'fixedPoint largeNumber', precision: 0 }), '1,000');
    assert.strictEqual(formatHelper.format(1000, { type: 'fixedPoint largeNumber', precision: 0 }), '1K');
});

QUnit.test('large number auto format powers', function(assert) {
    // act, assert
    assert.strictEqual(formatHelper.format(1234.56, { type: 'fixedPoint largeNumber', precision: 2 }), '1.23K');
    assert.strictEqual(formatHelper.format(12345.67, { type: 'fixedPoint largeNumber', precision: 2 }), '12.35K');
    assert.strictEqual(formatHelper.format(123400000, { type: 'fixedPoint largeNumber', precision: 2 }), '123.40M');
    assert.strictEqual(formatHelper.format(1234000000, { type: 'fixedPoint largeNumber', precision: 2 }), '1.23B');
    assert.strictEqual(formatHelper.format(12340000000000, { type: 'fixedPoint largeNumber', precision: 2 }), '12.34T');
    assert.strictEqual(formatHelper.format(12340000000000000, { type: 'fixedPoint largeNumber', precision: 2 }), '12,340.00T');
});

QUnit.test('large number format powers', function(assert) {
    // act, assert
    assert.strictEqual(formatHelper.format(12345.67, { type: 'fixedPoint', precision: 2 }), '12,345.67');
    assert.strictEqual(formatHelper.format(12345.67, { type: 'fixedPoint largeNumber', precision: 2 }), '12.35K');
    assert.strictEqual(formatHelper.format(12345.67, { type: 'fixedPoint thousands', precision: 2 }), '12.35K');
    assert.strictEqual(formatHelper.format(12345.67, { type: 'fixedPoint miLLions', precision: 3 }), '0.012M');
    assert.strictEqual(formatHelper.format(12345.67, { type: 'fixedPoint biLLions', precision: 7 }), '0.0000123B');
    assert.strictEqual(formatHelper.format(12345670, { type: 'fixedPoint triLLions', precision: 7 }), '0.0000123T');
});

QUnit.test('currency large number format', function(assert) {
    // act, assert
    assert.strictEqual(formatHelper.format(12345.67, { type: 'currency largeNumber', precision: 2 }), '$12.35K');
    assert.strictEqual(formatHelper.format(12345.67, { type: 'currency thoUSands', precision: 2 }), '$12.35K');
    assert.strictEqual(formatHelper.format(12345.67, { type: 'currency miLLions', precision: 3 }), '$0.012M');
});

QUnit.test('large number format without number type', function(assert) {
    // act, assert
    assert.strictEqual(formatHelper.format(12345.67, { type: 'largeNumber', precision: 2 }), '12.35K');
    assert.strictEqual(formatHelper.format(12345.67, { type: 'thousands', precision: 2 }), '12.35K');
    assert.strictEqual(formatHelper.format(12345.67, { type: 'millions', precision: 3 }), '0.012M');
});

QUnit.test('Empty format for number', function(assert) {
    // assert
    assert.equal(formatHelper.format(1204, ''), '1204');
    assert.equal(formatHelper.format(12.04, ''), '12.04');
});

QUnit.test('exponential number type pow', function(assert) {
    // act, assert
    assert.strictEqual(formatHelper.format(5, { type: 'exponEntial', precision: 2 }), '5.00E+0');
    assert.strictEqual(formatHelper.format(0.0081, { type: 'exponential', precision: 2 }), '8.10E-3');
    assert.strictEqual(formatHelper.format(-12345.67, { type: 'exponential', precision: 2 }), '-1.23E+4');
    assert.strictEqual(formatHelper.format(500000001, { type: 'exponential', precision: 2 }), '5.00E+8');
    assert.strictEqual(formatHelper.format(1.56662165464E+99, { type: 'exponential', precision: 2 }), '1.57E+99');
    assert.strictEqual(formatHelper.format(1.56662165464E-99, { type: 'exponential', precision: 2 }), '1.57E-99');
});

QUnit.test('exponential number type precision', function(assert) {
    // act, assert
    assert.strictEqual(formatHelper.format(1234, 'exponential'), '1.2E+3');
    assert.strictEqual(formatHelper.format(5, { type: 'exponential', precision: 0 }), '5E+0');
    assert.strictEqual(formatHelper.format(0.0081, { type: 'exponential', precision: 1 }), '8.1E-3');
    assert.strictEqual(formatHelper.format(-12345.67, { type: 'exponential', precision: 2 }), '-1.23E+4');
    assert.strictEqual(formatHelper.format(500000001, { type: 'exponential', precision: 3 }), '5.000E+8');
    assert.strictEqual(formatHelper.format(-123456789, { type: 'exponential', precision: 8 }), '-1.23456789E+8');
});

QUnit.test('exponential number type round', function(assert) {
    // act, assert
    assert.strictEqual(formatHelper.format(0.00999, { type: 'exponential', precision: 0 }), '1E-2');
    assert.strictEqual(formatHelper.format(0.00999, { type: 'exponential', precision: 2 }), '9.99E-3');
    assert.strictEqual(formatHelper.format(999, { type: 'exponential', precision: 1 }), '1.0E+3');
});


QUnit.test('exponential number type positive and negative number', function(assert) {
    // act, assert
    assert.strictEqual(formatHelper.format(0, { type: 'exponential', precision: 2 }), '0.00E+0');
    assert.strictEqual(formatHelper.format(1234, { type: 'exponential', precision: 2 }), '1.23E+3');
    assert.strictEqual(formatHelper.format(-1234, { type: 'exponential', precision: 2 }), '-1.23E+3');
});


QUnit.module('formatNumberEx');

QUnit.test('not execute formatNumberEx for non-number value', function(assert) {
    assert.equal(formatHelper.format('test string', { format: 'currency' }), 'test string');
});

QUnit.test('not execute formatNumberEx for infinite value', function(assert) {
    assert.equal(formatHelper.format(Infinity, { format: 'fixedPoint' }), Infinity.toString());
    assert.equal(formatHelper.format(-Infinity, { format: 'fixedPoint' }), (-Infinity).toString());
});

QUnit.test('not execute formatNumberEx for NaN value', function(assert) {
    assert.equal(formatHelper.format(NaN, { format: 'fixedPoint' }), NaN.toString());
});

QUnit.test('Case insensitive currency', function(assert) {
    // assert
    assert.equal(formatHelper.format(1204, 'currency'), '$1,204');
    assert.equal(formatHelper.format(1204, { type: 'cuRrency', precision: 2 }), '$1,204.00');
});

QUnit.test('not execute formatNumberEx for string with set format', function(assert) {
    /* eslint-disable no-extend-native */

    // arrange
    String.prototype.format = noop;

    // assert
    assert.equal(formatHelper.format(123, 'currency'), '$123');

    // cleanup
    delete String.prototype.format;
});
