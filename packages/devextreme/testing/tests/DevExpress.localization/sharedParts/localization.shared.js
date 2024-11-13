import $ from 'jquery';
import dateLocalization from 'common/core/localization/date';
import numberLocalization from 'common/core/localization/number';
import messageLocalization from 'common/core/localization/message';
import errors from 'core/errors';
import localization from 'localization';
import config from 'core/config';
import { logger } from 'core/utils/console';

import { generateDate } from '../../../helpers/dateHelper.js';

export default function() {
    QUnit.module('Localization modules', () => {
        const checkModules = function(testName, namespace, methods) {
            QUnit.test(testName, function(assert) {
                $.each(methods, function(index, method) {
                    assert.ok($.isFunction(namespace[method]), method + ' method exists');
                });
            });
        };

        checkModules('localization.date', dateLocalization, [
            'getMonthNames',
            'getDayNames',
            'getTimeSeparator',
            'format',
            'parse',
            'formatUsesMonthName',
            'formatUsesDayName',
            'getFormatParts',
            'firstDayOfWeekIndex',
        ]);

        checkModules('localization.number', numberLocalization, [
            'format',
            'parse',
            'getCurrencySymbol'
        ]);

        checkModules('localization.message', messageLocalization, [
            'setup',
            'localizeString',
            'getMessagesByLocales',
            'getFormatter',
            'format',
            'load'
        ]);

        checkModules('localization', localization, [
            'loadMessages',
            'locale'
        ]);
    });

    QUnit.module('Localization date (en)', () => {
        QUnit.test('formatUsesMonthName', function(assert) {
            assert.equal(dateLocalization.formatUsesMonthName('monthAndDay'), true);
            assert.equal(dateLocalization.formatUsesMonthName('monthAndYear'), true);
            assert.equal(dateLocalization.formatUsesMonthName('y MMMM d'), true);
            assert.equal(dateLocalization.formatUsesMonthName('y MMM d'), false);
            assert.equal(dateLocalization.formatUsesMonthName('month'), false);
        });

        QUnit.test('formatUsesDayName', function(assert) {
            assert.equal(dateLocalization.formatUsesDayName('dayofweek'), true);
            assert.equal(dateLocalization.formatUsesDayName('longdate'), true);
            assert.equal(dateLocalization.formatUsesDayName('longdatelongtime'), true);
            assert.equal(dateLocalization.formatUsesDayName('EEEE'), true);
            assert.equal(dateLocalization.formatUsesDayName('EEE'), false);
            assert.equal(dateLocalization.formatUsesDayName('day'), false);
            assert.equal(dateLocalization.formatUsesDayName('shortDate'), false);
        });

        QUnit.test('getFormatParts', function(assert) {
            assert.equal(dateLocalization.getFormatParts('dayofweek').length, 0);
            assert.equal(dateLocalization.getFormatParts('shortdate').join(' '), 'month day year');
            assert.equal(dateLocalization.getFormatParts('longDateLongTime').join(' '), 'month day year hours minutes seconds');
            assert.equal(dateLocalization.getFormatParts('d - M - y, hh:mm:ss [SSS]').join(' '), 'day month year hours minutes seconds milliseconds');
        });

        QUnit.test('getMonthNames', function(assert) {
            assert.deepEqual(dateLocalization.getMonthNames(),
                ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                'Array of month names');
        });

        QUnit.test('getDayNames', function(assert) {
            assert.deepEqual(dateLocalization.getDayNames(),
                ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                'Array of day names');
        });

        QUnit.test('getTimeSeparator', function(assert) {
            assert.equal(dateLocalization.getTimeSeparator(), ':');
        });

        QUnit.test('format', function(assert) {
            const assertData = {
                'day': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: '2'
                },
                'dayofweek': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: 'Monday'
                },
                'hour': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: '03'
                },
                'longdate': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: 'Monday, March 2, 2015'
                },
                'longdatelongtime': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: 'Monday, March 2, 2015, 3:04:05 AM'
                },
                'longtime': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: '3:04:05 AM'
                },
                'millisecond': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: '006'
                },
                'minute': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: '04'
                },
                'month': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: 'March'
                },
                'monthandday': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: 'March 2'
                },
                'monthandyear': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: 'March 2015'
                },
                'quarter': [
                    {
                        date: new Date(2015, 0),
                        expected: 'Q1'
                    },
                    {
                        date: new Date(2015, 1),
                        expected: 'Q1'
                    },
                    {
                        date: new Date(2015, 2),
                        expected: 'Q1'
                    },
                    {
                        date: new Date(2015, 3),
                        expected: 'Q2'
                    },
                    {
                        date: new Date(2015, 4),
                        expected: 'Q2'
                    },
                    {
                        date: new Date(2015, 5),
                        expected: 'Q2'
                    },
                    {
                        date: new Date(2015, 6),
                        expected: 'Q3'
                    },
                    {
                        date: new Date(2015, 7),
                        expected: 'Q3'
                    },
                    {
                        date: new Date(2015, 8),
                        expected: 'Q3'
                    },
                    {
                        date: new Date(2015, 9),
                        expected: 'Q4'
                    },
                    {
                        date: new Date(2015, 10),
                        expected: 'Q4'
                    },
                    {
                        date: new Date(2015, 11),
                        expected: 'Q4'
                    }
                ],
                'quarterandyear': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: 'Q1 2015'
                },
                'second': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: '05'
                },
                'shortdate': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: '3/2/2015'
                },
                'shortdateshorttime': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: '3/2/2015, 3:04 AM'
                },
                'shorttime': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: '3:04 AM'
                },
                'shortyear': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: '15'
                },
                'year': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: '2015'
                },
                'datetime-local': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: '2015-03-02T03:04:05'
                },
                'yyyy MMMM d': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: '2015 March 2'
                },
                'ss SSS': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: '05 006'
                },
                'E': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: 'Mon'
                },
                'EEE': {
                    date: new Date(2015, 2, 2, 3, 4, 5, 6),
                    expected: 'Mon'
                }
            };

            $.each(assertData, function(format, data) {
                data = $.makeArray(data);

                $.each(data, function(_, data) {
                    const localizedDate = localization.formatDate(data.date, format);
                    assert.equal(typeof (localizedDate), 'string');
                    assert.equal(localizedDate, data.expected, data.date + ' in ' + format + ' format');
                });
            });

            assert.equal(localization.formatDate(new Date(2015, 2, 2, 3, 4, 5, 6)), String(new Date(2015, 2, 2, 3, 4, 5)), 'without format');
            assert.notOk(localization.formatDate(), 'without date');
        });

        QUnit.test('object syntax', function(assert) {
            assert.equal(localization.formatDate(new Date(2015, 2, 2, 3, 4, 5, 6), { type: 'longdate' }), 'Monday, March 2, 2015');
        });

        QUnit.test('format with LDML pattern', function(assert) {
            assert.equal(localization.formatDate(new Date(2015, 2, 2, 3, 4, 5, 6), 'dd/MM/yyyy HH:mm:ss'), '02/03/2015 03:04:05');
            assert.equal(localization.formatDate(new Date(2015, 2, 2, 3, 4, 5, 6), 'd MMMM yyyy'), '2 March 2015');
        });

        QUnit.test('parse with LDML pattern', function(assert) {
            assert.deepEqual(localization.parseDate('02/03/2015 03:04:05', 'dd/MM/yyyy HH:mm:ss'), new Date(2015, 2, 2, 3, 4, 5));
            assert.deepEqual(localization.parseDate('2 March 2015', 'd MMMM yyyy'), new Date(2015, 2, 2));
        });

        QUnit.test('parse with custom format', function(assert) {
            assert.deepEqual(localization.parseDate('02/03/2015 03:04:05', function(value) {
                return localization.formatDate(value, 'dd/MM/yyyy HH:mm:ss');
            }), new Date(2015, 2, 2, 3, 4, 5));
            assert.deepEqual(localization.parseDate('2 March 2015', {
                formatter: function(value) {
                    return localization.formatDate(value, 'd MMMM yyyy');
                }
            }), new Date(2015, 2, 2));
        });

        QUnit.test('parse', function(assert) {
            const originalLoggerWarn = logger.warn;
            const warnLog = [];

            logger.warn = function(text) {
                warnLog.push(text);
            };

            const assertData = {
                'day': {
                    text: '2',
                    expectedConfig: { day: 2 }
                },
                'hour': {
                    text: '03',
                    expectedConfig: { hours: 3 }
                },
                'longdate': {
                    text: 'Monday, March 2, 2015',
                    expected: new Date(2015, 2, 2)
                },
                'longdatelongtime': [
                    {
                        text: 'Monday, March 2, 2015, 3:04:05 AM',
                        expected: new Date(2015, 2, 2, 3, 4, 5)
                    },
                    {
                        text: 'Monday, March 2, 2015, 3:04:05 PM',
                        expected: new Date(2015, 2, 2, 15, 4, 5)
                    }
                ],
                'longtime': [
                    {
                        text: '3:04:05 AM',
                        expectedConfig: { hours: 3, minutes: 4, seconds: 5 }
                    },
                    {
                        text: '3:04:05 PM',
                        expectedConfig: { hours: 15, minutes: 4, seconds: 5 }
                    }
                ],
                'minute': {
                    text: '04',
                    expectedConfig: { minutes: 4 }
                },
                'month': {
                    text: 'March',
                    expectedConfig: { month: 2, day: 1 }
                },
                'monthandday': {
                    text: 'March 2',
                    expectedConfig: { month: 2, day: 2 }
                },
                'monthandyear': {
                    text: 'March 2015',
                    expected: new Date(2015, 2, 1)
                },
                'second': {
                    text: '05',
                    expectedConfig: { seconds: 5 }
                },
                'shortdate': {
                    text: '3/2/2015',
                    expected: new Date(2015, 2, 2)
                },
                'shortdateshorttime': {
                    text: '3/2/2015, 3:04 AM',
                    expected: new Date(2015, 2, 2, 3, 4)
                },
                'shorttime': [
                    {
                        text: '3:04 AM',
                        expectedConfig: { hours: 3, minutes: 4 }
                    },
                    // NOTE: T464978
                    {
                        text: '12:30 PM',
                        expectedConfig: { hours: 12, minutes: 30 }
                    },
                    {
                        text: '12:30 AM',
                        expectedConfig: { hours: 0, minutes: 30 }
                    },
                    {
                        text: '14:20 AM',
                        expected: null
                    },
                    {
                        text: '4:60 AM',
                        expected: null
                    },
                    {
                        text: '0:00 AM',
                        expected: null
                    },
                    {
                        text: '0:00 PM',
                        expected: null
                    }
                ],
                'shortyear': [
                    {
                        text: '15',
                        expected: new Date(2015, 0, 1)
                    },
                    {
                        text: '86',
                        expected: new Date(1986, 0, 1)
                    }
                ],
                'year': {
                    text: '2015',
                    expected: new Date(2015, 0, 1)
                },

                'datetime-local': {
                    text: '2015-03-02T03:04:05',
                    expected: new Date(2015, 2, 2, 3, 4, 5)
                },
                'yyyy MMMM d': {
                    text: '2015 March 2',
                    expected: new Date(2015, 2, 2)
                }
            };

            try {
                $.each(assertData, function(format, data) {
                    data = $.makeArray(data);

                    $.each(data, function(_, data) {
                        const expected = data.expectedConfig && generateDate(data.expectedConfig) || data.expected;
                        assert.equal(localization.parseDate(data.text, format), expected && String(expected), format + ' format');
                    });
                });

                assert.equal(localization.parseDate('550', 'millisecond').getMilliseconds(), 550, 'millisecond format');
                assert.equal(localization.parseDate('550', 'SSS').getMilliseconds(), 550, 'millisecond format');

                assert.equal(localization.parseDate(localization.formatDate(new Date(), 'shortdate')), String(generateDate({ hours: 0 })), 'without format');
                assert.notOk(localization.parseDate(), 'without date');
            } finally {
                assert.equal(warnLog.length, 0);
                logger.warn = originalLoggerWarn;
            }
        });

        QUnit.test('parse with shortDate format (T478962, T511282)', function(assert) {
            assert.equal(localization.parseDate('2/20/2015', 'shortDate'), String(new Date(2015, 1, 20)));
            assert.equal(localization.parseDate('02/20/2015', 'shortDate'), String(new Date(2015, 1, 20)));
            assert.equal(localization.parseDate('02/02/2015', 'shortDate'), String(new Date(2015, 1, 2)));
            assert.equal(localization.parseDate('2/2/2015', 'shortDate'), String(new Date(2015, 1, 2)));
            assert.equal(localization.parseDate('1/1/99', 'shortDate'), String(new Date(new Date(99, 0, 1).setFullYear(99))));
            assert.equal(localization.parseDate('2/20/1', 'shortDate'), String(new Date(new Date(1, 1, 20).setFullYear(1))));

            assert.equal(localization.parseDate('22/20/2015', 'shortDate'), undefined);
            assert.equal(localization.parseDate('2/120/2015', 'shortDate'), undefined);
            assert.equal(localization.parseDate('2/20/', 'shortDate'), undefined);
        });

        QUnit.test('date parser should not parse primitive numbers', function(assert) {
            assert.equal(localization.parseDate('2'), undefined);
        });

        QUnit.test('firstDayOfWeekIndex', function(assert) {
            assert.equal(dateLocalization.firstDayOfWeekIndex(), 0);
            try {
                localization.locale('ru');
                assert.equal(dateLocalization.firstDayOfWeekIndex(), 1);

                localization.locale('en-US');
                assert.equal(dateLocalization.firstDayOfWeekIndex(), 0);
            } finally {
                localization.locale('en');
            }
        });
    });

    QUnit.module('Localization message (en)', {
        beforeEach: function() {
            localization.loadMessages({
                'en': {
                    addedKey: 'testValue',
                    hello: 'Hello, {0} {1}'
                }
            });
        }
    }, () => {
        QUnit.test('set custom localizablePrefix', function(assert) {
            let localized = messageLocalization.localizeString('@addedKey #addedKey');
            assert.equal(localized, 'testValue #addedKey');

            try {
                messageLocalization.setup('#');

                localized = messageLocalization.localizeString('@addedKey #addedKey');
                assert.equal(localized, '@addedKey testValue');
            } finally {
                messageLocalization.setup('@');
            }
        });

        QUnit.test('format', function(assert) {
            assert.equal(localization.formatMessage('addedKey'), 'testValue');

            try {
                localization.loadMessages({ 'en': {
                    fallBackTestKey: 'fallBackTestMessage'
                } });
                localization.locale('ru');

                assert.equal(localization.formatMessage('fallBackTestKey'), 'fallBackTestMessage');
            } finally {
                localization.locale('en');
            }
        });

        QUnit.test('format using parent locales', function(assert) {
            try {
                localization.loadMessages({
                    'pt': {
                        ptTestKey: 'ptTestValue',
                        ptPtTestKey: 'shouldNotBeDisplayed'
                    },
                    'pt-PT': {
                        ptPtTestKey: 'ptPtTestValue'
                    }
                });
                localization.locale('pt-AO');

                assert.equal(localization.formatMessage('ptTestKey'), 'ptTestValue');
                assert.equal(localization.formatMessage('ptPtTestKey'), 'ptPtTestValue');
            } finally {
                localization.locale('en');
            }
        });

        QUnit.test('format with placeholders', function(assert) {
            assert.equal(localization.formatMessage('hello', ['Ivan', 'Ivanov']), 'Hello, Ivan Ivanov');
            assert.equal(localization.formatMessage('hello', 'Ivan', 'Ivanov'), 'Hello, Ivan Ivanov');

            try {
                localization.loadMessages({ 'en': {
                    fallBackTestKey: 'fallBackTestMessage {0}'
                } });
                localization.locale('ru');

                assert.equal(localization.formatMessage('fallBackTestKey', '1'), 'fallBackTestMessage 1');
            } finally {
                localization.locale('en');
            }
        });

        QUnit.test('getFormatter', function(assert) {
            assert.equal(messageLocalization.getFormatter('hello')(['Ivan', 'Ivanov']), 'Hello, Ivan Ivanov');
            assert.equal(messageLocalization.getFormatter('hello')('Ivan', 'Ivanov'), 'Hello, Ivan Ivanov');

            try {
                localization.loadMessages({ 'en': {
                    fallBackTestKey: 'fallBackTestMessage {0}'
                } });
                localization.locale('ru');

                assert.equal(messageLocalization.getFormatter('fallBackTestKey')('1'), 'fallBackTestMessage 1');
            } finally {
                localization.locale('en');
            }
        });

        QUnit.test('localizeString', function(assert) {
            const localized = messageLocalization.localizeString('@addedKey @@addedKey @');
            assert.equal(localized, 'testValue @addedKey @');
        });

        QUnit.test('localizeString doesn\'t affect e-mails', function(assert) {
            const toLocalize = 'E-mails such as email@addedKey.com are not localized';
            const localized = messageLocalization.localizeString(toLocalize);

            assert.equal(localized, toLocalize);
        });

        QUnit.test('localizeString doesn\'t affect unknown keys', function(assert) {
            const toLocalize = '@unknownKey';
            const localized = messageLocalization.localizeString(toLocalize);

            assert.equal(localized, toLocalize);
        });

        QUnit.test('getDictionary', function(assert) {
            localization.loadMessages({
                'en': {
                    freshAddedKey: 'testValue'
                }
            });
            messageLocalization.localizeString('@unknownKey');
            messageLocalization.localizeString('@freshAddedKey');

            assert.equal(messageLocalization.getDictionary()['Loading'], 'Loading...');
            assert.equal(messageLocalization.getDictionary(true)['Loading'], undefined);
            assert.equal(messageLocalization.getDictionary()['freshAddedKey'], 'testValue');
            assert.equal(messageLocalization.getDictionary(true)['freshAddedKey'], undefined);
            assert.equal(messageLocalization.getDictionary()['unknownKey'], 'Unknown key');
            assert.equal(messageLocalization.getDictionary(true)['unknownKey'], 'Unknown key');
        });
    });

    QUnit.module('Localization number', () => {
        QUnit.test('parse different positive and negative parts', function(assert) {
            assert.equal(localization.parseNumber('(10)', '#0;(#0)'), -10);
            assert.equal(localization.parseNumber('-10'), -10);
        });

        QUnit.test('parse different positive and negative parts with groups', function(assert) {
            assert.equal(localization.parseNumber('12,345', '#,##0.##;(#,##0.##)'), 12345, 'positive');
            assert.equal(localization.parseNumber('(12,345)', '#,##0.##;(#,##0.##)'), -12345, 'negative');
            assert.equal(localization.parseNumber('12,34', '#,##0.##;(#,##0.##)'), 1234, 'positive after removing one char');
            assert.equal(localization.parseNumber('(12,34)', '#,##0.##;(#,##0.##)'), -1234, 'negative after removing one char');
            assert.equal(localization.parseNumber('(01)', '#,##0.##;(#,##0.##)'), -1, 'negative with leading zero');
            assert.equal(localization.parseNumber('(12,34.56)', '#,##0.##;(#,##0.##)'), -1234.56, 'negative with removed digit and decimal part');
        });

        QUnit.test('parse by predefined formats', function(assert) {
            assert.strictEqual(localization.parseNumber('4B', 'largeNumber'), 4000000000);
            assert.strictEqual(localization.parseNumber('41K', 'thousands'), 41000);
            assert.strictEqual(localization.parseNumber('4,120M', 'miLLions'), 4120000000);
            assert.strictEqual(localization.parseNumber('4B', 'biLLions'), 4000000000);
            assert.strictEqual(localization.parseNumber('4T', 'triLLions'), 4000000000000);
            assert.strictEqual(localization.parseNumber('15.5%', 'percent'), 0.155);
            assert.strictEqual(localization.parseNumber('1K %', 'thousands percent'), 10);
            assert.strictEqual(localization.parseNumber('1.2M %', {
                type: 'percent largeNumber'
            }), 12000);
        });

        QUnit.test('parse different positive and negative parts with minus consists of several specific characters', function(assert) {
            assert.equal(localization.parseNumber('12,345', '##,##0.##;$*/\\?||(?)^   & [({#,##0.##])}'), 12345, 'positive');
            assert.equal(localization.parseNumber('$*/\\?||(?)^   & [({12,345])}', '##,##0.##;$*/\\?||(?)^   & [({#,##0.##])}'), -12345, 'negative');
            assert.equal(localization.parseNumber('$minus^ {12,345}', '##,##0.##;$minus^ {##,##0}'), -12345, 'negative');
            assert.equal(localization.parseNumber('$minus {12,345}', '##,##0.##;$minus^ {##,##0}'), 12345, 'positive, there is no `^` in the text');
        });

        QUnit.test('format: base', function(assert) {
            assert.equal(localization.formatNumber(12), '12');
            assert.equal(localization.formatNumber(1, { type: 'decimal', precision: 2 }), '01');
            assert.equal(localization.formatNumber(1, { type: 'decimal', precision: 3 }), '001');
            assert.equal(localization.formatNumber(1.23456, { type: 'decimal' }), '1.23456');
            const small18DecimalDigits = -0.004768895486559899;
            assert.equal(localization.formatNumber(small18DecimalDigits, { type: 'decimal' }), '-0.004768895486559899');
        });

        QUnit.test('format: precision', function(assert) {
            assert.equal(localization.formatNumber(2, { type: 'decimal', precision: 2 }), '02');
            assert.equal(localization.formatNumber(12, { type: 'decimal', precision: 2 }), '12');
            assert.equal(localization.formatNumber(2, { type: 'decimal', precision: 3 }), '002');
            assert.equal(localization.formatNumber(12, { type: 'decimal', precision: 3 }), '012');
            assert.equal(localization.formatNumber(123, { type: 'decimal', precision: 3 }), '123');
        });

        QUnit.test('parse: base', function(assert) {
            assert.equal(localization.parseNumber('1.2'), 1.2);
            assert.equal(localization.parseNumber('.2', '#0.#'), 0.2);
            assert.equal(localization.parseNumber('12,000'), 12000);
        });

        QUnit.test('parse with custom separators', function(assert) {
            const oldDecimalSeparator = config().decimalSeparator;
            const oldThousandsSeparator = config().thousandsSeparator;
            const oldLocale = localization.locale();

            config({
                decimalSeparator: ',',
                thousandsSeparator: '.'
            });
            localization.locale('de');

            try {
                assert.equal(localization.parseNumber('1,2'), 1.2);
                assert.equal(localization.parseNumber('1.2'), 12);
                assert.equal(localization.parseNumber('12.000'), 12000);
            } finally {
                config({
                    decimalSeparator: oldDecimalSeparator,
                    thousandsSeparator: oldThousandsSeparator
                });
                localization.locale(oldLocale);
            }
        });

        QUnit.test('parse: test starts with not digit symbols', function(assert) {
            assert.equal(localization.parseNumber('$ 1.2'), 1.2);
            assert.equal(localization.parseNumber('1.2 руб.'), 1.2);
        });

        QUnit.test('parse: test different negative format', function(assert) {
            assert.equal(localization.parseNumber('<<1.0>>', '#0.00;<<#0.00>>'), -1);
        });

        QUnit.test('Fixed point numeric formats', function(assert) {
            assert.equal(localization.formatNumber(23.04059872, { type: 'fIxedPoint', precision: 4 }), '23.0406');
            assert.equal(localization.formatNumber(23.04059872, 'fIxedPoint'), '23');
            assert.equal(localization.formatNumber(123.99, 'fIxedPoint largeNumber'), '124');
            assert.equal(localization.formatNumber(-123.99, 'fIxedPoint largeNumber'), '-124');
        });

        QUnit.test('format fixedPoint with precision', function(assert) {
            assert.equal(localization.formatNumber(1, { type: 'fixedPoint', precision: 2 }), '1.00');
            assert.equal(localization.formatNumber(1.1, { type: 'fixedPoint', precision: 2 }), '1.10');
            assert.equal(localization.formatNumber(1.1, { type: 'fixedPoint' }), '1');
            assert.equal(localization.formatNumber(1, { type: 'fixedPoint', precision: null }), '1');
            assert.equal(localization.formatNumber(1.2, { type: 'fixedPoint', precision: null }), '1.2');
            assert.equal(localization.formatNumber(1.22, { type: 'fixedPoint', precision: null }), '1.22');
            assert.equal(localization.formatNumber(1.222, { type: 'fixedPoint', precision: null }), '1.222');
            assert.equal(localization.formatNumber(1.2222, { type: 'fixedPoint', precision: null }), '1.2222');
            assert.equal(localization.formatNumber(1.2225, { type: 'fixedPoint', precision: null }), '1.2225');
            assert.equal(localization.formatNumber(1.22222228, { type: 'fixedPoint', precision: null }), '1.22222228');

            assert.equal(localization.formatNumber(4.645, { type: 'fixedPoint', precision: 2 }), '4.65');
            assert.equal(localization.formatNumber(4.645, { type: 'fixedPoint', precision: 1 }), '4.6');
            assert.equal(localization.formatNumber(4.645, { type: 'fixedPoint', precision: 0 }), '5');
            assert.equal(localization.formatNumber(4.64, { type: 'fixedPoint', precision: 2 }), '4.64');
            assert.equal(localization.formatNumber(-4.645, { type: 'fixedPoint', precision: 2 }), '-4.65');
            assert.equal(localization.formatNumber(-4.645, { type: 'fixedPoint', precision: 1 }), '-4.6');
            assert.equal(localization.formatNumber(-4.645, { type: 'fixedPoint', precision: 0 }), '-5');
            assert.equal(localization.formatNumber(-4.64, { type: 'fixedPoint', precision: 2 }), '-4.64');

            assert.equal(localization.formatNumber(35.855, { type: 'fixedPoint', precision: 2 }), '35.86');
            assert.equal(localization.formatNumber(35.855, { type: 'fixedPoint', precision: 5 }), '35.85500');
            assert.equal(localization.formatNumber(-35.855, { type: 'fixedPoint', precision: 2 }), '-35.86');
            assert.equal(localization.formatNumber(-35.855, { type: 'fixedPoint', precision: 5 }), '-35.85500');

            assert.equal(localization.formatNumber(1.296249, { type: 'fixedPoint', precision: 4 }), '1.2962', 'T848392');
            assert.equal(localization.formatNumber(-1.296249, { type: 'fixedPoint', precision: 4 }), '-1.2962', 'T848392');
        });

        QUnit.test('large number format powers', function(assert) {
            assert.strictEqual(localization.formatNumber(4119626293, 'largeNumber'), '4B');
            assert.strictEqual(localization.formatNumber(41196, 'thousands'), '41K');
            assert.strictEqual(localization.formatNumber(4119626293, 'miLLions'), '4,120M');
            assert.strictEqual(localization.formatNumber(4119626293, 'biLLions'), '4B');
            assert.strictEqual(localization.formatNumber(4119626293234, 'triLLions'), '4T');
        });

        QUnit.test('Percent numeric formats', function(assert) {
            assert.equal(localization.formatNumber(0.45, { type: 'peRcent' }), '45%');
            assert.equal(localization.formatNumber(0.45, { type: 'peRcent', precision: 2 }), '45.00%');
        });

        QUnit.test('Decimal numeric formats', function(assert) {
            assert.equal(localization.formatNumber(437, { type: 'decimAl' }), '437');
            assert.equal(localization.formatNumber(437, { type: 'deCimal', precision: 5 }), '00437');
            assert.equal(localization.formatNumber(-437, { type: 'decimal', precision: 0 }), '-437');
        });

        QUnit.test('format as function', function(assert) {
            assert.equal(localization.formatNumber(437, function(value) { return '!' + value; }), '!437');
            assert.equal(localization.formatNumber(437, { formatter: function(value) { return '!' + value; } }), '!437');
        });

        QUnit.test('custom group and decimal separators', function(assert) {
            const oldDecimalSeparator = config().decimalSeparator;
            const oldThousandsSeparator = config().thousandsSeparator;
            const oldLocale = localization.locale();

            config({
                decimalSeparator: ',',
                thousandsSeparator: '.'
            });
            localization.locale('de');

            try {
                assert.equal(localization.formatNumber(1.1, { type: 'fixedPoint', precision: 2 }), '1,10');
                assert.equal(localization.formatNumber(1234567, 'fixedPoint'), '1.234.567');
                assert.equal(localization.formatNumber(1234567.89, { type: 'fixedPoint', precision: 2 }), '1.234.567,89');
            } finally {
                config({
                    decimalSeparator: oldDecimalSeparator,
                    thousandsSeparator: oldThousandsSeparator
                });
                localization.locale(oldLocale);
            }
        });

        QUnit.test('format as LDML pattern', function(assert) {
            assert.equal(localization.formatNumber(12345.67, '#,##0.00 РУБ'), '12,345.67 РУБ');
            assert.equal(localization.formatNumber(-12345.67, '#.#;(#.#)'), '(12345.7)');
        });

        QUnit.test('format as LDML pattern with custom separators', function(assert) {
            const oldDecimalSeparator = config().decimalSeparator;
            const oldThousandsSeparator = config().thousandsSeparator;
            const oldLocale = localization.locale();

            config({
                decimalSeparator: ',',
                thousandsSeparator: '\xa0'
            });
            localization.locale('ru');

            try {
                assert.equal(localization.formatNumber(12345.67, '#,##0.00 РУБ'), '12\xa0345,67 РУБ');
                assert.equal(localization.formatNumber(-12345.67, '#.#;(#.#)'), '(12345,7)');
                assert.equal(numberLocalization.getDecimalSeparator(), ',');
                assert.equal(numberLocalization.getThousandsSeparator(), '\xa0');
            } finally {
                config({
                    decimalSeparator: oldDecimalSeparator,
                    thousandsSeparator: oldThousandsSeparator
                });
                localization.locale(oldLocale);
            }
        });
    });

    QUnit.module('Localization currency', () => {
        QUnit.test('format: base', function(assert) {
            assert.equal(localization.formatNumber(12, { type: 'currency' }), '$12');
            assert.equal(localization.formatNumber(1, { type: 'currency', precision: 2 }), '$1.00');
            assert.equal(localization.formatNumber(1, { type: 'currency', precision: 2, currency: 'USD' }), '$1.00');
            const negativeCurrency = localization.formatNumber(-1, { type: 'currency', precision: 2 });
            const normalStyle = '-$1.00';
            // NOTE: We use accounting style for currencies in Globalize by default
            const accountingStyle = '($1.00)';

            assert.ok(negativeCurrency === normalStyle || negativeCurrency === accountingStyle);
        });

        QUnit.test('format: several words', function(assert) {
            assert.equal(localization.formatNumber(0, { type: 'currency thousands', currency: undefined, precision: 0 }), '$0K');
        });
    });

    QUnit.module('Localization custom functions', () => {
        QUnit.test('number', function(assert) {
            const format = {
                formatter: function(value) {
                    return 'two';
                },
                parser: function(text) {
                    return 2;
                }
            };

            assert.equal(localization.formatNumber(2, format), 'two');
            assert.equal(localization.formatNumber(2, format.formatter), 'two');
            assert.equal(localization.parseNumber('two', format), 2);
        });

        QUnit.test('date', function(assert) {
            const format = {
                formatter: function(date) {
                    return 'Шел ' + date.getFullYear() + ' год.';
                },
                parser: function(text) {
                    return new Date(Number(text.substr(4, 4)), 1, 1);
                }
            };
            const someDate = new Date(1999, 1, 1);

            assert.equal(localization.formatDate(someDate, format), 'Шел 1999 год.');
            assert.equal(localization.formatDate(someDate, format.formatter), 'Шел 1999 год.');
            assert.equal(localization.parseDate('Шел 2000 год.', format).getFullYear(), 2000);
        });

        QUnit.test('\'no parser\' errors', function(assert) {
            const numberFormatter = function(value) {
                return '1';
            };
            const dateFormatter = function(value) {
                return new Date(0, 0, 1);
            };
            const warningIdPrefixLength = 8;
            const numberWarning = 'Number parsing is invoked while the parser is not defined';
            const dateWarning = 'Date parsing is invoked while the parser is not defined';
            const originalLoggerWarn = logger.warn;
            const warnLog = [];

            logger.warn = function(text) {
                warnLog.push(text);
            };

            try {
                localization.parseNumber('01', numberFormatter);
                localization.parseNumber('01', { formatter: numberFormatter });
                localization.parseDate('01', dateFormatter);
                localization.parseDate('01', { formatter: dateFormatter });
                localization.parseDate('01');

                assert.equal(warnLog.length, 4);

                assert.equal(warnLog[0].substr(warningIdPrefixLength, numberWarning.length), numberWarning);
                assert.equal(warnLog[1].substr(warningIdPrefixLength, numberWarning.length), numberWarning);
                assert.equal(warnLog[2].substr(warningIdPrefixLength, dateWarning.length), dateWarning);
                assert.equal(warnLog[3].substr(warningIdPrefixLength, dateWarning.length), dateWarning);
            } finally {
                logger.warn = originalLoggerWarn;
            }
        });

        QUnit.test('formatter has higher priority than a type', function(assert) {
            const format = {
                formatter: function(date) {
                    return 'Y ' + date.getFullYear();
                },
                type: 'year'
            };
            const someDate = new Date(1999, 1, 1);

            assert.equal(localization.formatDate(someDate, format), 'Y 1999');
        });

        QUnit.test('string format without a parser should not rise a warning', function(assert) {
            const errorHandler = sinon.spy(errors, 'log');
            localization.parseNumber('1', '#0');

            assert.equal(errorHandler.callCount, 0, 'warning was not rised');
        });
        QUnit.test('getTimeSeparator should depend on current locale', function(assert) {
            try {
                localization.locale('da');
                const formattedText = localization.formatDate(new Date(2021, 1, 1, 12, 34), 'shorttime');
                assert.ok(formattedText.indexOf(dateLocalization.getTimeSeparator()) > 0);
            } finally {
                localization.locale('en');
            }
        });
    });
}
