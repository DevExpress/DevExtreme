const getNumberFormatter = require('localization/ldml/number').getFormatter;
const getNumberFormat = require('localization/ldml/number').getFormat;
const getDateParser = require('localization/ldml/date.parser').getParser;
const getRegExpInfo = require('localization/ldml/date.parser').getRegExpInfo;
const getDateFormatter = require('localization/ldml/date.formatter').getFormatter;
const getDateFormat = require('localization/ldml/date.format').getFormat;
const defaultDateNames = require('localization/default_date_names');
const numberLocalization = require('localization/number');
const dateLocalization = require('localization/date');
const extend = require('core/utils/extend').extend;
const console = require('core/utils/console').logger;

require('localization/currency');

const dateParts = extend({}, defaultDateNames, {
    getPeriodNames: function() {
        return ['am', 'pm'];
    },
    getTimeSeparator: function() {
        return ':';
    }
});

QUnit.module('date parser', () => {
    QUnit.test('parse with escaped chars', function(assert) {
        const date = new Date(2018, 10, 12, 14, 15, 16);
        const parser = getDateParser('EEEE, d. MMMM yyyy \'um\' H:mm:ss', dateParts);

        assert.deepEqual(parser('Monday, 12. November 2018 um 14:15:16'), date, 'parse correct date string');
    });

    QUnit.test('parse with escaped pattern chars', function(assert) {
        const date = new Date(2018, 0, 1, 0, 0, 0);
        const parser = getDateParser('\'dd\' yyyy', dateParts);

        assert.deepEqual(parser('dd 2018'), date, 'parse correct date string');
    });

    QUnit.test('parse dd/MM/yyyy format', function(assert) {
        const parser = getDateParser('dd/MM/yyyy');
        const date = new Date(2017, 8, 22);

        assert.deepEqual(parser('22/09/2017'), date, 'parse correct date string');
        assert.deepEqual(parser('22/9/2017'), date, 'parse with short month');
        assert.deepEqual(parser(''), null, 'parse empty string');
        assert.deepEqual(parser('22:09:2017'), null, 'parse with wrong separators');
        assert.deepEqual(parser('09/22/2017'), null, 'parse with switched month and day');
        // T574647
        assert.deepEqual(parser('31/12/2017'), new Date(2017, 11, 31), 'parse date with last day of month');
    });

    QUnit.test('case insensitive date parsing for months', function(assert) {
        const parser = getDateParser('MMM', dateParts);

        assert.deepEqual(parser('nov').getMonth(), 10, 'lower case');
        assert.deepEqual(parser('Nov').getMonth(), 10, 'capitalized');
        assert.deepEqual(parser('nOv').getMonth(), 10, 'mixed case');
    });

    QUnit.test('case insensitive date parsing for part of day', function(assert) {
        const parser = getDateParser('aaaa', dateParts);

        assert.equal(parser('am').getHours(), 0);
    });

    QUnit.test('getFormat', function(assert) {
        const checkFormat = function(format, customDateParts) {
            const formatter = getDateFormatter(format, customDateParts || defaultDateNames);
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
        checkFormat('LLLL yyyy', {
            getMonthNames: function() {
                return ['janv.', 'févr.', 'mars', 'avril', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']; // fr
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
        checkFormat('M/d/yyyy, HHmm'); // T960532
    });

    QUnit.test('dates are parsed correctly on DST start time (T869511)', function(assert) {
        const date = new Date(2020, 2, 8, 14, 15, 16);
        const parser = getDateParser('yyyy/MM/dd h:mm:ss aaa', dateParts);
        assert.deepEqual(parser('2020/03/08 2:15:16 PM'), date, 'parse correct date string');
    });

    QUnit.test('dates are parsed correctly on hours after DST start time (T869511)', function(assert) {
        const date = new Date(2020, 2, 8, 15, 14, 13);
        const parser = getDateParser('yyyy/MM/dd h:mm:ss aaa', dateParts);
        assert.deepEqual(parser('2020/03/08 3:14:13 PM'), date, 'parse correct date string');
    });
});


QUnit.module('number formatter', () => {
    QUnit.test('integer with non-required digits', function(assert) {
        const formatter = getNumberFormatter('#');

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
        const formatter = getNumberFormatter('000');

        assert.strictEqual(formatter(null), '', 'format an empty value');
        assert.strictEqual(formatter(NaN), '', 'NaN value should not be formatted');
        assert.strictEqual(formatter(0), '000', 'format zero');
        assert.strictEqual(formatter(1), '001', 'format integer with 1 digit');
        assert.strictEqual(formatter(10), '010', 'format integer with zero at the end');
        assert.strictEqual(formatter(123), '123', 'format integer');
        assert.strictEqual(formatter(123456), '456', 'format large integer');
    });

    QUnit.test('integer with zero format with unlimitedIntegerDigits flag (for dashbords)', function(assert) {
        const formatter = getNumberFormatter('0', { unlimitedIntegerDigits: true });

        assert.strictEqual(formatter(null), '', 'format an empty value');
        assert.strictEqual(formatter(NaN), '', 'NaN value should not be formatted');
        assert.strictEqual(formatter(0), '0', 'format zero');
        assert.strictEqual(formatter(1), '1', 'format integer with 1 digit');
        assert.strictEqual(formatter(-1), '-1', 'format nagative integer with 1 digit');
        assert.strictEqual(formatter(123456), '123456', 'format large integer');
        assert.strictEqual(formatter(123456.7), '123457', 'format large integer with float part');
    });

    QUnit.test('float with precision formatting', function(assert) {
        const formatter = getNumberFormatter('#.00');

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

        const toPrecision4 = getNumberFormatter('#.0000');
        assert.strictEqual(toPrecision4(1.296249, 4), '1.2962', 'T848392');
        assert.strictEqual(toPrecision4(-1.296249, 4), '-1.2962', 'T848392');
    });

    QUnit.test('extra large float part formatting', function(assert) {
        const formatter = getNumberFormatter('#0.####################');

        assert.strictEqual(formatter(1.1), '1.1', 'float format is correct');
        assert.strictEqual(formatter(1), '1', 'integer format is correct');
    });

    QUnit.test('float with precision formatting and required integer digit', function(assert) {
        const formatter = getNumberFormatter('#0.00');

        assert.strictEqual(formatter(5), '5.00', 'format integer');
        assert.strictEqual(formatter(0), '0.00', 'format zero');
        assert.strictEqual(formatter(0.123), '0.12', 'format float');
    });

    QUnit.test('float with required an non-required digits in float part', function(assert) {
        const formatter = getNumberFormatter('#0.0#');

        assert.strictEqual(formatter(1), '1.0', 'format integer');
        assert.strictEqual(formatter(1.2), '1.2', 'format float with 1 digit');
        assert.strictEqual(formatter(1.23), '1.23', 'format float with 2 digits');
        assert.strictEqual(formatter(1.239), '1.24', 'format float with 3 digits and rounding');
    });

    QUnit.test('different positive and negative formatting', function(assert) {
        const formatter = getNumberFormatter('#0.000;(#0.000)');

        assert.strictEqual(formatter(0), '0.000', 'format zero');
        assert.strictEqual(formatter(-0), '(0.000)', 'format negative zero');
        assert.strictEqual(formatter(123), '123.000', 'format integer');
        assert.strictEqual(formatter(123.57), '123.570', 'format float');
        assert.strictEqual(formatter(123.576), '123.576', 'format float with 3 digits after point');
        assert.strictEqual(formatter(-123.57), '(123.570)', 'format negative float');
    });

    QUnit.test('escaping format', function(assert) {
        const formatter = getNumberFormatter('#\'x #0% x\'');

        assert.strictEqual(formatter(15), '15x #0% x', 'special chars was escaped');
    });

    QUnit.test('escaped point in format', function(assert) {
        assert.strictEqual(getNumberFormatter('#0 руб\'.\'')(15), '15 руб.', 'special chars was escaped');
        assert.strictEqual(getNumberFormatter('#0.## руб\'.\'')(15), '15 руб.', 'special chars was escaped');
        assert.strictEqual(getNumberFormatter('#0.00 руб\'.\'')(15), '15.00 руб.', 'special chars was escaped');
    });

    QUnit.test('percent formatting with leading zero', function(assert) {
        const formatter = getNumberFormatter('#0.#%;(#0.#%)');

        assert.strictEqual(formatter(0), '0%', 'format zero');
        assert.strictEqual(formatter(0.1), '10%', 'format less than 100');
        assert.strictEqual(formatter(2.578), '257.8%', 'format more than 100');
        assert.strictEqual(formatter(2.5785), '257.9%', 'rounding percents');
        assert.strictEqual(formatter(-0.45), '(45%)', 'format negative value');
    });

    QUnit.test('escaped percent formatting', function(assert) {
        let formatter = getNumberFormatter('#0.#\'%\'');
        assert.strictEqual(formatter(0.5), '0.5%', 'percent was escaped');

        formatter = getNumberFormatter('#0.#\'x % x\'');
        assert.strictEqual(formatter(0.5), '0.5x % x', 'percent with text was escaped');
    });

    QUnit.test('simple group', function(assert) {
        const formatter = getNumberFormatter('#,##0');

        assert.strictEqual(formatter(123), '123', 'format integer without groups');
        assert.strictEqual(formatter(1234), '1,234', 'format integer with 1 group');
        assert.strictEqual(formatter(123456789), '123,456,789', 'format integer with 2 groups');
    });

    QUnit.test('complex group', function(assert) {
        const formatter = getNumberFormatter('#,##,##0');

        assert.strictEqual(formatter(123), '123', 'format integer without groups');
        assert.strictEqual(formatter(1234), '1,234', 'format integer with 1 group');
        assert.strictEqual(formatter(123456789), '12,34,56,789', 'format integer with 3 groups');
    });

    QUnit.test('format with invalid group (T862287)', function(assert) {
        const formatter = getNumberFormatter('#,,,B');

        assert.strictEqual(formatter(123), 'B', 'format integer with invalid format');
    });

    QUnit.test('different positive and negative formatting with groups', function(assert) {
        const formatter = getNumberFormatter('#,##0;(#,##0)');

        assert.strictEqual(formatter(0), '0', 'format zero');
        assert.strictEqual(formatter(-0), '(0)', 'format negative zero');
        assert.strictEqual(formatter(123), '123', 'format integer without groups');
        assert.strictEqual(formatter(-123), '(123)', 'format negative integer without groups');
        assert.strictEqual(formatter(1234), '1,234', 'format integer with 1 group');
        assert.strictEqual(formatter(-1234), '(1,234)', 'format negative with 1 group');
    });

    QUnit.test('custom separators', function(assert) {
        const formatter = getNumberFormatter('#,##0.##', { thousandsSeparator: ' ', decimalSeparator: ',' });

        assert.strictEqual(formatter(0), '0', 'number without separators');
        assert.strictEqual(formatter(0.12), '0,12', 'number with decimal separator');
        assert.strictEqual(formatter(1234), '1 234', 'number with group separator');
        assert.strictEqual(formatter(1234.567), '1 234,57', 'number with group and decimal separator');
    });

    QUnit.test('getFormat for ldml number formatters', function(assert) {
        const checkFormat = function(format, ldmlFormat) {
            const formatter = getNumberFormatter(format);
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
        const formatter = getNumberFormatter('#,##0.00 $', { thousandsSeparator: ' ', decimalSeparator: ',' });

        assert.strictEqual(getNumberFormat(formatter), '#,##0.00 $', 'format is correct');
    });

    QUnit.test('getFormat for currency if separators are deutsch', function(assert) {
        const formatter = getNumberFormatter('#,##0.00 $', { thousandsSeparator: '.', decimalSeparator: ',' });

        assert.strictEqual(getNumberFormat(formatter), '#,##0.00 $', 'format is correct');
    });

    QUnit.test('getFormat for build-in number formats', function(assert) {
        const checkFormat = function(format, ldmlFormat) {
            const formatter = function(value) {
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
        const checkFormat = function(formatter, ldmlFormat) {
            assert.strictEqual(getNumberFormat(formatter), ldmlFormat, ldmlFormat);
        };

        checkFormat(function(value) {
            return value.toString();
        }, '#0.##############');
        checkFormat(function(value) {
            return value.toFixed(2);
        }, '#0.00');
    });

    QUnit.test('escaped zero should not specify the formatter precision', function(assert) {
        const zeroFormatter = getNumberFormatter('\'00\'0.0\'00\'');
        const sharpFormatter = getNumberFormatter('\'#,##\'0.0\'##\'');

        assert.strictEqual(zeroFormatter(1234.1234), '004.100', 'take into account non-escaped symbols only');
        assert.strictEqual(sharpFormatter(1234.123), '#,##4.1##', 'take into account non-escaped symbols only');
    });

    QUnit.module('getRegExpInfo method');

    QUnit.test('getRegExpInfo should return correct pattern set when stub is in the end', function(assert) {
        const regExpInfo = getRegExpInfo('EEE, MMMM, dd, HH:mm:ss \'(stub)\'', dateParts);
        assert.deepEqual(regExpInfo.patterns, [
            'EEE', '\', \'', 'MMMM', '\', \'', 'dd', '\', \'', 'HH', ':', 'mm', ':', 'ss', '\' (stub)\''
        ]);
    });

    QUnit.test('getRegExpInfo should return correct pattern set when there is "ww" inside of it', function(assert) {
        const regExpInfo = getRegExpInfo('ww, MMMM, dd, HH:mm:ss \'(stub)\'', dateParts);
        assert.deepEqual(regExpInfo.patterns, [
            'ww', '\', \'', 'MMMM', '\', \'', 'dd', '\', \'', 'HH', ':', 'mm', ':', 'ss', '\' (stub)\''
        ]);
    });

    QUnit.test('getRegExpInfo should return correct pattern for the single time separator', function(assert) {
        const regExpInfo = getRegExpInfo('HH:mm', dateParts);
        assert.deepEqual(regExpInfo.patterns, [
            'HH', ':', 'mm'
        ]);
    });

    QUnit.test('getRegExpInfo should return correct regex for multiple adjacent time separators', function(assert) {
        const regExpInfo = getRegExpInfo('HH:::mm', dateParts);
        assert.deepEqual(regExpInfo.patterns, [
            'HH', ':::', 'mm'
        ]);
        assert.notOk(regExpInfo.regexp.test('11:11'));
        assert.notOk(regExpInfo.regexp.test('11::::::11'));
        assert.ok(regExpInfo.regexp.test('11:::11'));
    });

    QUnit.test('getRegExpInfo should consider custom time separators in different locales', function(assert) {
        const baseFormat = dateLocalization.format;
        const baseGetTimeSeparator = dateLocalization.format;
        dateLocalization.format = function(date, format) {
            return baseFormat(...arguments).replace(/:/g, '.');
        };
        dateLocalization.getTimeSeparator = function() {
            return '.';
        };
        try {
            const regExpInfo = getRegExpInfo('HH:mm', dateLocalization);
            const formattedString = dateLocalization.format(new Date(2021, 1, 1, 15, 43), 'HH:mm');
            assert.ok(regExpInfo.regexp.test(formattedString));
        } finally {
            dateLocalization.format = baseFormat;
            dateLocalization.getTimeSeparator = baseGetTimeSeparator;
        }

    });

    QUnit.test('getRegExpInfo should return correct regex for some of not separated `formats`(T1008667)', function(assert) {
        [
            {
                format: 'yyyyMMdd',
                tests: [
                    {
                        dateString: '19990211',
                        expected: ['1999', '02', '11']
                    },
                    {
                        dateString: '20151209',
                        expected: ['2015', '12', '09']
                    },
                    {
                        dateString: '20150101',
                        expected: ['2015', '01', '01']
                    },
                    {
                        dateString: '201270101',
                        expected: ['20127', '01', '01']
                    }
                ]
            },
            {
                format: 'ddMMyyyy',
                tests: [
                    {
                        dateString: '11121212',
                        expected: ['11', '12', '1212']
                    },
                    {
                        dateString: '3152021',
                        expected: ['31', '5', '2021']
                    },
                    {
                        dateString: '19012021',
                        expected: ['19', '01', '2021']
                    },
                    {
                        dateString: '110110217',
                        expected: ['11', '01', '10217']
                    }
                ]
            },
            {
                format: 'MMddyyyy',
                tests: [
                    {
                        dateString: '12212121',
                        expected: ['12', '21', '2121']
                    },
                    {
                        dateString: '3152021',
                        expected: ['3', '15', '2021']
                    },
                    {
                        dateString: '31520212',
                        expected: ['3', '15', '20212']
                    },
                    {
                        dateString: '110920213',
                        expected: ['11', '09', '20213']
                    }
                ]
            },
            {
                format: 'MMddyy',
                tests: [
                    {
                        dateString: '122121',
                        expected: ['12', '21', '21']
                    },
                    {
                        dateString: '31520',
                        expected: ['3', '15', '20']
                    },
                    {
                        dateString: '110921',
                        expected: ['11', '09', '21']
                    }
                ]
            },
            {
                format: 'MMddyyy',
                tests: [
                    {
                        dateString: '1221213',
                        expected: ['12', '21', '213']
                    },
                    {
                        dateString: '315203',
                        expected: ['3', '15', '203']
                    },
                    {
                        dateString: '1109213',
                        expected: ['11', '09', '213']
                    }
                ],
            },
            {
                format: 'Mddyyy',
                tests: [
                    {
                        dateString: '1221213',
                        expected: ['1', '22', '1213']
                    },
                    {
                        dateString: '315203',
                        expected: ['3', '15', '203']
                    },
                    {
                        dateString: '1109213',
                        expected: ['1', '10', '9213']
                    }
                ]
            }
        ].forEach(({ format, tests }) => {
            const regExpInfo = getRegExpInfo(format);
            tests.forEach(({ dateString, expected }) => {
                const regExpGroupsResult = regExpInfo.regexp.exec(dateString).slice(1);
                assert.deepEqual(regExpGroupsResult, expected, `Fromat '${format}' parse dateString '${dateString}' - ok.`);
            });
        });
    });

    QUnit.test('getRegExpInfo should throw warning message if there are no separated single simbols in the `format`!', function(assert) {
        const spy = sinon.spy(console, 'warn');
        const expectedWarningsCount = {
            'dMMyyyy': 1,
            'MMdyyyy': 1,
            'dMMMy': 0,
            'MMMdyyyy': 1,
            'dMMMy hm': 1,
            'd MMM y hm': 1,
            'QQQdMMM y hm': 1,
            'QQQdMMM yhm': 1,
            'dMQQQdMMM yhm': 1,
            'QQQdMMM': 0,
            'QQQdMMM yyyy d h m': 0,
            'QQQdHHMMM yyyyd hhmm': 1,
        };

        Object.entries(expectedWarningsCount).forEach(([ format, warningCalls ]) => {
            spy.callCount = 0;
            getRegExpInfo(format, dateLocalization);
            assert.equal(spy.callCount, warningCalls, `Format '${format}' calls ${warningCalls} warnings.`);
        });
    });
});
