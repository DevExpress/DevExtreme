var getNumberFormatter = require('localization/ldml/number').getFormatter,
    getNumberFormat = require('localization/ldml/number').getFormat,
    getDateParser = require('localization/ldml/date.parser').getParser,
    getRegExpInfo = require('localization/ldml/date.parser').getRegExpInfo,
    getDateFormatter = require('localization/ldml/date.formatter').getFormatter,
    getDateFormat = require('localization/ldml/date.format').getFormat,
    dateParts = require('localization/default_date_names'),
    numberLocalization = require('localization/number'),
    extend = require('core/utils/extend').extend;

require('localization/currency');

QUnit.module('date parser');

QUnit.test('parse with escaped chars', function(assert) {
    var date = new Date(2018, 10, 12, 14, 15, 16),
        parser = getDateParser('EEEE, d. MMMM yyyy \'um\' H:mm:ss', dateParts);

    assert.deepEqual(parser('Monday, 12. November 2018 um 14:15:16'), date, 'parse correct date string');
});

QUnit.test('parse with escaped pattern chars', function(assert) {
    var date = new Date(2018, 0, 1, 0, 0, 0),
        parser = getDateParser('\'dd\' yyyy', dateParts);

    assert.deepEqual(parser('dd 2018'), date, 'parse correct date string');
});

QUnit.test('parse dd/MM/yyyy format', function(assert) {
    var parser = getDateParser('dd/MM/yyyy'),
        date = new Date(2017, 8, 22);

    assert.deepEqual(parser('22/09/2017'), date, 'parse correct date string');
    assert.deepEqual(parser('22/9/2017'), date, 'parse with short month');
    assert.deepEqual(parser(''), null, 'parse empty string');
    assert.deepEqual(parser('22:09:2017'), null, 'parse with wrong separators');
    assert.deepEqual(parser('09/22/2017'), null, 'parse with switched month and day');
    // T574647
    assert.deepEqual(parser('31/12/2017'), new Date(2017, 11, 31), 'parse date with last day of month');
});

QUnit.test('case insensitive date parsing for months', function(assert) {
    var parser = getDateParser('MMM', dateParts);

    assert.deepEqual(parser('nov').getMonth(), 10, 'lower case');
    assert.deepEqual(parser('Nov').getMonth(), 10, 'capitalized');
    assert.deepEqual(parser('nOv').getMonth(), 10, 'mixed case');
});

QUnit.test('case insensitive date parsing for part of day', function(assert) {
    var _dateParts = extend({}, dateParts, {
            getPeriodNames: function() {
                return ['am', 'pm'];
            }
        }),
        parser = getDateParser('aaaa', _dateParts);

    assert.equal(parser('am').getHours(), 0);
});

QUnit.test('getFormat', function(assert) {
    var checkFormat = function(format, customDateParts) {
        var formatter = getDateFormatter(format, customDateParts || dateParts);
        assert.strictEqual(getDateFormat(formatter), format, format);
    };

    checkFormat('M d');
    checkFormat('MM d');
    checkFormat('MMM d');
    checkFormat('MMMM d');
    checkFormat('dd/MM/yyyy');
    checkFormat('dd/MM/yyyy HH:mm:ss.SSS');
    checkFormat('\'M\'MM d');
    checkFormat('EEE، d MMM yyyy');
    checkFormat('h:mm aaaa', {
        getPeriodNames: function() {
            return ['a. m.', 'p. m.'];
        }
    });
    checkFormat('h:mm aaa', {
        getPeriodNames: function() {
            return ['PG', 'PTG']; // ms
        }
    });
    checkFormat('h:mm aaaa', {
        getPeriodNames: function() {
            return ['म.पू.', 'म.उ.']; // mr
        }
    });
    checkFormat('EEEE', {
        getDayNames: function() {
            return ['quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado', 'domingo', 'segunda-feira', 'terça-feira']; // pt
        }
    });
    checkFormat('yyyy \'m\'. MMMM d');
    checkFormat('MMM dd, yyyy [h:mm aaa]');
});


QUnit.module('number formatter');

QUnit.test('integer with non-required digits', function(assert) {
    var formatter = getNumberFormatter('#');

    assert.strictEqual(formatter(null), '', 'format an empty value');
    assert.strictEqual(formatter(NaN), '', 'NaN value should not be formatted');
    assert.strictEqual(formatter(0), '', 'format zero');
    assert.strictEqual(formatter(-0), '-', 'format minus zero');
    assert.strictEqual(formatter(10), '10', 'format integer wkth zero at the end');
    assert.strictEqual(formatter(123), '123', 'format integer');
    assert.strictEqual(formatter(123456), '123456', 'format large integer');
    assert.strictEqual(formatter(1E20), '100000000000000000000', 'format very large integer');
});

QUnit.test('integer with required digits', function(assert) {
    var formatter = getNumberFormatter('000');

    assert.strictEqual(formatter(null), '', 'format an empty value');
    assert.strictEqual(formatter(NaN), '', 'NaN value should not be formatted');
    assert.strictEqual(formatter(0), '000', 'format zero');
    assert.strictEqual(formatter(1), '001', 'format integer with 1 digit');
    assert.strictEqual(formatter(10), '010', 'format integer with zero at the end');
    assert.strictEqual(formatter(123), '123', 'format integer');
    assert.strictEqual(formatter(123456), '456', 'format large integer');
});

QUnit.test('float with precision formatting', function(assert) {
    var formatter = getNumberFormatter('#.00');

    assert.strictEqual(formatter(null), '', 'format an empty value');
    assert.strictEqual(formatter(NaN), '', 'NaN value should not be formatted');
    assert.strictEqual(formatter(0), '.00', 'format zero');
    assert.strictEqual(formatter(0.123), '.12', 'format value without integer');
    assert.strictEqual(formatter(123), '123.00', 'format integer');
    assert.strictEqual(formatter(123.05), '123.05', 'format rounded float with zero');
    assert.strictEqual(formatter(123.5), '123.50', 'format rounded float');
    assert.strictEqual(formatter(123.57), '123.57', 'format float');
    assert.strictEqual(formatter(123.576), '123.58', 'rounding float');
    assert.strictEqual(formatter(123.573), '123.57', 'rounding float back');
    assert.strictEqual(formatter(-123.57), '-123.57', 'format negative float');
    assert.strictEqual(formatter(4.645), '4.65', 'format float with rounding issue');
});

QUnit.test('extra large float part formatting', function(assert) {
    var formatter = getNumberFormatter('#0.####################');

    assert.strictEqual(formatter(1.1), '1.1', 'float format is correct');
    assert.strictEqual(formatter(1), '1', 'integer format is correct');
});

QUnit.test('float with precision formatting and required integer digit', function(assert) {
    var formatter = getNumberFormatter('#0.00');

    assert.strictEqual(formatter(5), '5.00', 'format integer');
    assert.strictEqual(formatter(0), '0.00', 'format zero');
    assert.strictEqual(formatter(0.123), '0.12', 'format float');
});

QUnit.test('float with required an non-required digits in float part', function(assert) {
    var formatter = getNumberFormatter('#0.0#');

    assert.strictEqual(formatter(1), '1.0', 'format integer');
    assert.strictEqual(formatter(1.2), '1.2', 'format float with 1 digit');
    assert.strictEqual(formatter(1.23), '1.23', 'format float with 2 digits');
    assert.strictEqual(formatter(1.239), '1.24', 'format float with 3 digits and rounding');
});

QUnit.test('different positive and negative formatting', function(assert) {
    var formatter = getNumberFormatter('#0.000;(#0.000)');

    assert.strictEqual(formatter(0), '0.000', 'format zero');
    assert.strictEqual(formatter(-0), '(0.000)', 'format negative zero');
    assert.strictEqual(formatter(123), '123.000', 'format integer');
    assert.strictEqual(formatter(123.57), '123.570', 'format float');
    assert.strictEqual(formatter(123.576), '123.576', 'format float with 3 digits after point');
    assert.strictEqual(formatter(-123.57), '(123.570)', 'format negative float');
});

QUnit.test('escaping format', function(assert) {
    var formatter = getNumberFormatter('#\'x #0% x\'');

    assert.strictEqual(formatter(15), '15x #0% x', 'special chars was escaped');
});

QUnit.test('escaped point in format', function(assert) {
    assert.strictEqual(getNumberFormatter('#0 руб\'.\'')(15), '15 руб.', 'special chars was escaped');
    assert.strictEqual(getNumberFormatter('#0.## руб\'.\'')(15), '15 руб.', 'special chars was escaped');
    assert.strictEqual(getNumberFormatter('#0.00 руб\'.\'')(15), '15.00 руб.', 'special chars was escaped');
});

QUnit.test('percent formatting with leading zero', function(assert) {
    var formatter = getNumberFormatter('#0.#%;(#0.#%)');

    assert.strictEqual(formatter(0), '0%', 'format zero');
    assert.strictEqual(formatter(0.1), '10%', 'format less than 100');
    assert.strictEqual(formatter(2.578), '257.8%', 'format more than 100');
    assert.strictEqual(formatter(2.5785), '257.9%', 'rounding percents');
    assert.strictEqual(formatter(-0.45), '(45%)', 'format negative value');
});

QUnit.test('escaped percent formatting', function(assert) {
    var formatter = getNumberFormatter('#0.#\'%\'');
    assert.strictEqual(formatter(0.5), '0.5%', 'percent was escaped');

    formatter = getNumberFormatter('#0.#\'x % x\'');
    assert.strictEqual(formatter(0.5), '0.5x % x', 'percent with text was escaped');
});

QUnit.test('simple group', function(assert) {
    var formatter = getNumberFormatter('#,##0');

    assert.strictEqual(formatter(123), '123', 'format integer without groups');
    assert.strictEqual(formatter(1234), '1,234', 'format integer with 1 group');
    assert.strictEqual(formatter(123456789), '123,456,789', 'format integer with 2 groups');
});

QUnit.test('complex group', function(assert) {
    var formatter = getNumberFormatter('#,##,##0');

    assert.strictEqual(formatter(123), '123', 'format integer without groups');
    assert.strictEqual(formatter(1234), '1,234', 'format integer with 1 group');
    assert.strictEqual(formatter(123456789), '12,34,56,789', 'format integer with 3 groups');
});

QUnit.test('different positive and negative formatting with groups', function(assert) {
    var formatter = getNumberFormatter('#,##0;(#,##0)');

    assert.strictEqual(formatter(0), '0', 'format zero');
    assert.strictEqual(formatter(-0), '(0)', 'format negative zero');
    assert.strictEqual(formatter(123), '123', 'format integer without groups');
    assert.strictEqual(formatter(-123), '(123)', 'format negative integer without groups');
    assert.strictEqual(formatter(1234), '1,234', 'format integer with 1 group');
    assert.strictEqual(formatter(-1234), '(1,234)', 'format negative with 1 group');
});

QUnit.test('custom separators', function(assert) {
    var formatter = getNumberFormatter('#,##0.##', { thousandsSeparator: ' ', decimalSeparator: ',' });

    assert.strictEqual(formatter(0), '0', 'number without separators');
    assert.strictEqual(formatter(0.12), '0,12', 'number with decimal separator');
    assert.strictEqual(formatter(1234), '1 234', 'number with group separator');
    assert.strictEqual(formatter(1234.567), '1 234,57', 'number with group and decimal separator');
});

QUnit.test('getFormat for ldml number formatters', function(assert) {
    var checkFormat = function(format, ldmlFormat) {
        var formatter = getNumberFormatter(format);
        assert.strictEqual(getNumberFormat(formatter), ldmlFormat || format, format);
    };

    checkFormat('#');
    checkFormat('#.#');
    checkFormat('#.##');
    checkFormat('#.0');
    checkFormat('#.00');
    checkFormat('#.00#');
    checkFormat('#,###');
    checkFormat('#,##0');
    checkFormat('#,####');
    checkFormat('#,##,###');
    checkFormat('#,##,#00.00#');
    checkFormat('$ #,##0.##');
    checkFormat('#,##0.## руб');
    checkFormat('00000');
    checkFormat('$ #,##0;($ #,##0)');
    checkFormat('#.## %');
    checkFormat('#.## \'%\'');
});

QUnit.test('getFormat for currency if separators are russion', function(assert) {
    var formatter = getNumberFormatter('#,##0.00 $', { thousandsSeparator: ' ', decimalSeparator: ',' });

    assert.strictEqual(getNumberFormat(formatter), '#,##0.00 $', 'format is correct');
});

QUnit.test('getFormat for currency if separators are deutsch', function(assert) {
    var formatter = getNumberFormatter('#,##0.00 $', { thousandsSeparator: '.', decimalSeparator: ',' });

    assert.strictEqual(getNumberFormat(formatter), '#,##0.00 $', 'format is correct');
});

QUnit.test('getFormat for build-in number formats', function(assert) {
    var checkFormat = function(format, ldmlFormat) {
        var formatter = function(value) {
            return numberLocalization.format(value, format);
        };
        assert.strictEqual(getNumberFormat(formatter), ldmlFormat, JSON.stringify(format));
    };

    checkFormat('fixedpoint', '#,##0');
    checkFormat({ type: 'fixedpoint', precision: 2 }, '#,##0.00');
    checkFormat('percent', '#,###,##0%');
    checkFormat({ type: 'percent', precision: 2 }, '#,###,##0.00%');
    checkFormat('currency', '$#,##0');
    checkFormat({ type: 'currency', precision: 2 }, '$#,##0.00');
});

QUnit.test('getFormat for function number formats', function(assert) {
    var checkFormat = function(formatter, ldmlFormat) {
        assert.strictEqual(getNumberFormat(formatter), ldmlFormat, ldmlFormat);
    };

    checkFormat(function(value) {
        return value.toString();
    }, '#0.##############');
    checkFormat(function(value) {
        return value.toFixed(2);
    }, '#0.00');
});

QUnit.module('getRegExpInfo method');

QUnit.test('getRegExpInfo should return correct pattern set when stub is in the end', function(assert) {
    var regExpInfo = getRegExpInfo('EEE, MMMM, dd, HH:mm:ss \'(stub)\'', dateParts);
    assert.deepEqual(regExpInfo.patterns, [
        'EEE', '\', \'', 'MMMM', '\', \'', 'dd', '\', \'', 'HH', '\':\'', 'mm', '\':\'', 'ss', '\' (stub)\''
    ]);
});
