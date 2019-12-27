SystemJS.config({
    meta: {
        './localization.base.tests.js': {
            deps: [
                'localization/globalize/core',
                'localization/globalize/number',
                'localization/globalize/currency',
                'localization/globalize/date',
                'localization/globalize/message'
            ]
        }
    },
    packages: {
        'globalize': {
            meta: {
                '../globalize.js': {
                    deps: ['cldr/unresolved']
                }
            }
        }
    }
});

define(function(require, exports, module) {
    require('../../helpers/l10n/cldrNumberDataRu.js');
    require('../../helpers/l10n/cldrNumberDataDe.js');
    require('../../helpers/l10n/cldrCalendarDataRu.js');
    require('../../helpers/l10n/cldrCurrencyDataRu.js');
    require('../../helpers/l10n/cldrCurrencyDataEn.js');

    require('localization/globalize/core');
    require('localization/globalize/number');
    require('localization/globalize/currency');
    require('localization/globalize/date');
    require('localization/globalize/message');

    const generateExpectedDate = require('../../helpers/dateHelper.js').generateDate;

    const $ = require('jquery');
    const Globalize = require('globalize');
    const numberLocalization = require('localization/number');
    const dateLocalization = require('localization/date');
    const messageLocalization = require('localization/message');
    const config = require('core/config');

    const likelySubtags = require('../../../node_modules/cldr-core/supplemental/likelySubtags.json!');
    Globalize.load(likelySubtags);

    const NBSP = String.fromCharCode(160);

    const sharedTests = require('./sharedParts/localization.shared.js');

    QUnit.module('Globalize common', null, function() {

        QUnit.test('engine', assert => {
            assert.equal(numberLocalization.engine(), 'globalize');
            assert.equal(dateLocalization.engine(), 'globalize');
            assert.equal(messageLocalization.engine(), 'globalize');
        });

        sharedTests();
    });

    QUnit.module('Localization date (ru)', {
        beforeEach: function() {
            Globalize.locale('ru');
        },
        afterEach: function() {
            Globalize.locale('en');
        }
    });

    QUnit.test('getFormatParts', function(assert) {
        assert.equal(dateLocalization.getFormatParts('dayofweek').length, 0);
        assert.equal(dateLocalization.getFormatParts('shortdate').join(' '), 'day month year');
        assert.equal(dateLocalization.getFormatParts('longDateLongTime').join(' '), 'day month year hours minutes seconds');
        assert.equal(dateLocalization.getFormatParts('d - M - y, hh:mm:ss [SSS]').join(' '), 'day month year hours minutes seconds milliseconds');
        assert.equal(dateLocalization.getFormatParts('ah:mm').join(' '), 'hours minutes'); // T460693
    });

    QUnit.test('getMonthNames', function(assert) {
        assert.deepEqual(dateLocalization.getMonthNames(),
            ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
            'Array of month names');
    });

    QUnit.test('getMonthNames with specified type', function(assert) {
        assert.deepEqual(dateLocalization.getMonthNames('wide', 'format'),
            ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
            'Array of month names');
    });

    QUnit.test('getMonthNames with type=\'standalone\'', function(assert) {
        assert.deepEqual(dateLocalization.getMonthNames('wide', 'standalone'),
            ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
            'Array of month names');
    });

    QUnit.test('getPeriodNames', function(assert) {
        assert.deepEqual(dateLocalization.getPeriodNames(), ['ДП', 'ПП'], 'Array of period names');
    });

    QUnit.test('getDayNames', function(assert) {
        assert.deepEqual(dateLocalization.getDayNames(),
            ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
            'Array of day names');
    });

    QUnit.test('getTimeSeparator', function(assert) {
        assert.equal(dateLocalization.getTimeSeparator(), ':');
    });

    QUnit.test('format', function(assert) {
        const expectedValues = {
            'day': '2',
            'dayofweek': 'понедельник',
            'hour': '03',
            'longdate': 'понедельник, 2 марта 2015 г.',
            'longdatelongtime': 'понедельник, 2 марта 2015 г., 3:04:05',
            'longtime': '3:04:05',
            'millisecond': '006',
            'minute': '04',
            'month': 'март',
            'monthandday': '2 марта',
            'monthandyear': 'март 2015 г.',
            'quarter': '1-й кв.',
            'quarterandyear': '1-й кв. 2015 г.',
            'second': '05',
            'shortdate': '02.03.2015',
            'shortdateshorttime': '02.03.2015, 3:04',
            'shorttime': '3:04',
            'shortyear': '15',
            'year': '2015',

            'datetime-local': '2015-03-02T03:04:05',
            'yyyy MMMM d': '2015 марта 2',
            'ss SSS': '05 006'
        };
        const date = new Date(2015, 2, 2, 3, 4, 5);

        date.setMilliseconds(6);

        $.each(expectedValues, function(format, expectedValue) {
            assert.equal(dateLocalization.format(date, format), expectedValue, format + ' format');
        });

        assert.equal(dateLocalization.format(date), String(new Date(2015, 2, 2, 3, 4, 5)), 'without format');
        assert.notOk(dateLocalization.format(), 'without date');
    });

    QUnit.test('format cache for different locales', function(assert) {
        const originalLocale = Globalize.locale().locale;
        const date = new Date(2015, 2, 2, 3, 4, 5);
        try {
            Globalize.locale('en');
            assert.equal(dateLocalization.format(date, 'month'), 'March');
        } finally {
            Globalize.locale(originalLocale);
            assert.equal(dateLocalization.format(date, 'month'), 'март');
        }
    });

    QUnit.test('parse', function(assert) {
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
                text: 'понедельник, 2 марта 2015 г.',
                expected: new Date(2015, 2, 2)
            },
            'longdatelongtime': {
                text: 'понедельник, 2 марта 2015 г., 3:04:05',
                expected: new Date(2015, 2, 2, 3, 4, 5)
            },
            'longtime': {
                text: '3:04:05',
                expectedConfig: { hours: 3, minutes: 4, seconds: 5 }
            },
            'minute': {
                text: '04',
                expectedConfig: { minutes: 4 }
            },
            'month': {
                text: 'март',
                expectedConfig: { month: 2, day: 1 }
            },
            'monthandday': {
                text: '2 марта',
                expectedConfig: { month: 2, day: 2 }
            },
            'monthandyear': {
                text: 'март 2015 г.',
                expected: new Date(2015, 2, 1)
            },
            'second': {
                text: '05',
                expectedConfig: { seconds: 5 }
            },
            'shortdate': {
                text: '02.03.2015',
                expected: new Date(2015, 2, 2)
            },
            'shortdateshorttime': {
                text: '02.03.2015, 3:04',
                expected: new Date(2015, 2, 2, 3, 4)
            },
            'shorttime': {
                text: '3:04',
                expectedConfig: { hours: 3, minutes: 4 }
            },
            'shortyear': {
                text: '15',
                expected: new Date(2015, 0, 1)
            },
            'year': {
                text: '2015',
                expected: new Date(2015, 0, 1)
            },

            'datetime-local': {
                text: '2015-03-02T03:04:05',
                expected: new Date(2015, 2, 2, 3, 4, 5)
            },
            'yyyy MMMM d': {
                text: '2015 марта 2',
                expected: new Date(2015, 2, 2)
            }
        };

        $.each(assertData, function(format, data) {
            assert.equal(dateLocalization.parse(data.text, format), String(data.expected || generateExpectedDate(data.expectedConfig)), format + ' format');
        });

        assert.equal(dateLocalization.parse('550', 'millisecond').getMilliseconds(), 550, 'millisecond format');
        assert.equal(dateLocalization.parse('550', 'SSS').getMilliseconds(), 550, 'millisecond format');

        assert.equal(dateLocalization.parse(dateLocalization.format(new Date(), 'shortDate')), String(generateExpectedDate({ hours: 0 })), 'without format');
        assert.notOk(dateLocalization.parse(), 'without date');

        assert.equal(dateLocalization.parse(Globalize.formatDate(new Date(), { date: 'short' }), { date: 'short' }), String(generateExpectedDate({ hours: 0 })), 'globalize format');
    });

    QUnit.test('firstDayOfWeekIndex', function(assert) {
        assert.equal(dateLocalization.firstDayOfWeekIndex(), 1);
    });

    QUnit.module('Custom format types');
    QUnit.test('format: { time: \'medium\' }', function(assert) {
        assert.equal(dateLocalization.format(new Date(2015, 1, 2, 3, 4, 5, 6), { time: 'medium' }), '3:04:05 AM', 'with object format');
    });

    QUnit.module('Localization message (custom locales)', {
        beforeEach: function() {
            messageLocalization.load({
                'en': {
                    addedKey: 'testValue',
                    hello: 'Hello, {0} {1}'
                }
            });
        }
    });

    QUnit.test('Fallback to neutral culture', function(assert) {
        const originalLocale = Globalize.locale().locale;

        messageLocalization.load({
            'ru': {
                TestBack: 'Back ru',
                TestCancel: 'Cancel ru'
            }
        });

        messageLocalization.load({
            'ru-RU': {
                TestCancel: 'Cancel ru-RU'
            }
        });

        try {
            Globalize.locale('ru-RU');

            assert.equal(messageLocalization.format('TestBack'), 'Back ru');
            assert.equal(messageLocalization.format('TestCancel'), 'Cancel ru-RU');
        } finally {
            Globalize.locale(originalLocale);
        }
    });


    QUnit.test('Fallback to default (en) culture', function(assert) {
        const originalLocale = Globalize.locale().locale;
        try {
            Globalize.locale('ru');

            assert.equal(messageLocalization.format('OK'), 'OK');
            assert.equal(messageLocalization.getFormatter('OK')(), 'OK');
        } finally {
            Globalize.locale(originalLocale);
        }
    });

    QUnit.test('Extended culture with empty string value (T271323)', function(assert) {
        const originalLocale = Globalize.locale().locale;

        Globalize.load({
            'supplemental': {
                'likelySubtags': {
                    'zh': 'zh-Hans-CN'
                }
            }
        });

        messageLocalization.load({
            'zh-CN': {
                addedKey: ''
            }
        });

        try {
            Globalize.locale('zh-CN');

            assert.equal(messageLocalization.localizeString('@addedKey'), 'testValue', 'Default culture value');
        } finally {
            Globalize.locale(originalLocale);
        }
    });

    QUnit.test('localizeString by custom locale (T383089)', function(assert) {
        messageLocalization.load({
            'ru': {
                'ruAddedKey': 'ruValue'
            }
        });
        Globalize.locale('ru');
        const localized = messageLocalization.localizeString('@ruAddedKey @@ruAddedKey @');
        assert.equal(localized, 'ruValue @ruAddedKey @');

        Globalize.locale('en');
    });

    QUnit.test('Empty message', function(assert) {
        Globalize.loadMessages({
            'en': {
                'empty': ''
            }
        });

        assert.equal(messageLocalization.format('empty'), '');
    });

    QUnit.test('DX messages can be customized', function(assert) {
        assert.equal(messageLocalization.format('dxCollectionWidget-noDataText'), 'No data to display');

        Globalize.loadMessages({
            'en': {
                'dxCollectionWidget-noDataText': 'Custom caption'
            }
        });

        assert.equal(messageLocalization.format('dxCollectionWidget-noDataText'), 'Custom caption');
    });

    QUnit.test('getDictionary ru', function(assert) {
        messageLocalization.load({
            'ru': {
                'freshRuAddedKey': 'ruValue'
            }
        });
        Globalize.locale('ru');

        messageLocalization.localizeString('@unknownKey');
        messageLocalization.localizeString('@ruAddedKey');

        assert.equal(messageLocalization.getDictionary()['freshRuAddedKey'], 'ruValue');
        assert.equal(messageLocalization.getDictionary(true)['freshRuAddedKey'], undefined);
        assert.equal(messageLocalization.getDictionary()['unknownKey'], 'Unknown key');
        assert.equal(messageLocalization.getDictionary(true)['unknownKey'], 'Unknown key');

        Globalize.locale('en');
    });

    QUnit.module('Localization globalizeNumber');

    QUnit.test('format', function(assert) {
        assert.equal(numberLocalization.format(1.2), '1.2');
        assert.equal(numberLocalization.format(12), '12');
        assert.equal(numberLocalization.format(2, { minimumIntegerDigits: 2 }), '02');
        assert.equal(numberLocalization.format(12, { minimumIntegerDigits: 2 }), '12');
        assert.equal(numberLocalization.format(2, { minimumIntegerDigits: 3 }), '002');
        assert.equal(numberLocalization.format(12, { minimumIntegerDigits: 3 }), '012');
        assert.equal(numberLocalization.format(123, { minimumIntegerDigits: 3 }), '123');
    });

    QUnit.module('Localization currency with Globalize');

    QUnit.test('format', function(assert) {
        assert.equal(numberLocalization.format(1.2, { currency: 'default' }), '$1.20');
        assert.equal(numberLocalization.format(12, { currency: 'default' }), '$12.00');
        assert.equal(numberLocalization.format(1, { minimumIntegerDigits: 2, minimumFractionDigits: 0, currency: 'default' }), '$01');
        assert.equal(numberLocalization.format(1, { minimumIntegerDigits: 2, minimumFractionDigits: 0, currency: 'RUB' }), 'RUB' + NBSP + '01');
    });

    QUnit.test('format currency & power in RU locale', function(assert) {
        Globalize.locale('ru');
        assert.equal(numberLocalization.format(0, { type: 'currency thousands', currency: undefined, precision: 0 }), '0K' + NBSP + '$');
        assert.equal(numberLocalization.format(0, { type: 'currency thousands', currency: 'CSK', precision: 2 }), '0,00K' + NBSP + 'CSK');
        assert.equal(numberLocalization.format(2e+5, { type: 'currency thousands', precision: 0 }), '200K' + NBSP + '$');
        Globalize.locale('en');
    });

    QUnit.test('getOpenXmlCurrencyFormat: check conversion for some cultures (T835933)', assert => {
        try {
            Globalize.locale('en');
            assert.equal(numberLocalization.getOpenXmlCurrencyFormat(undefined), '$#,##0{0}_);\\($#,##0{0}\\)');
            assert.equal(numberLocalization.getOpenXmlCurrencyFormat('USD'), '$#,##0{0}_);\\($#,##0{0}\\)');
            assert.equal(numberLocalization.getOpenXmlCurrencyFormat('RUB'), '\\R\\U\\B#,##0{0}_);\\(\\R\\U\\B#,##0{0}\\)');
            assert.equal(numberLocalization.getOpenXmlCurrencyFormat('CNY'), '\\C\\N\\¥#,##0{0}_);\\(\\C\\N\\¥#,##0{0}\\)');
            assert.equal(numberLocalization.getOpenXmlCurrencyFormat('NOK'), '\\N\\O\\K#,##0{0}_);\\(\\N\\O\\K#,##0{0}\\)');

            Globalize.locale('en-ru'); // switch to parent if there are no settings for the passed culture
            assert.equal(numberLocalization.getOpenXmlCurrencyFormat(undefined), '$#,##0{0}_);\\($#,##0{0}\\)');
            assert.equal(numberLocalization.getOpenXmlCurrencyFormat('USD'), '$#,##0{0}_);\\($#,##0{0}\\)');
            assert.equal(numberLocalization.getOpenXmlCurrencyFormat('RUB'), '\\R\\U\\B#,##0{0}_);\\(\\R\\U\\B#,##0{0}\\)');
            assert.equal(numberLocalization.getOpenXmlCurrencyFormat('CNY'), '\\C\\N\\¥#,##0{0}_);\\(\\C\\N\\¥#,##0{0}\\)');
            assert.equal(numberLocalization.getOpenXmlCurrencyFormat('NOK'), '\\N\\O\\K#,##0{0}_);\\(\\N\\O\\K#,##0{0}\\)');

            Globalize.locale('ru');
            assert.equal(numberLocalization.getOpenXmlCurrencyFormat(undefined), '#,##0{0}\xA0$');
            assert.equal(numberLocalization.getOpenXmlCurrencyFormat('USD'), '#,##0{0}\xA0$');
            assert.equal(numberLocalization.getOpenXmlCurrencyFormat('RUB'), '#,##0{0}\xA0\\₽');
            assert.equal(numberLocalization.getOpenXmlCurrencyFormat('CNY'), '#,##0{0}\xA0\\C\\N\\¥');
            assert.equal(numberLocalization.getOpenXmlCurrencyFormat('NOK'), '#,##0{0}\xA0\\N\\O\\K');
        } finally {
            Globalize.locale('en');
        }
    });

    QUnit.test('getDecimalSeparator and getThousandsSeparator in RU locale', function(assert) {
        Globalize.locale('ru');
        assert.equal(numberLocalization.getDecimalSeparator(), ',');
        assert.equal(numberLocalization.getThousandsSeparator(), '\xa0');
        Globalize.locale('en');
    });

    QUnit.test('getCurrencySymbol and config.defaultCurrency', assert => {
        const originalConfig = config();

        try {
            assert.equal(numberLocalization.getCurrencySymbol().symbol, '$');

            config({
                defaultCurrency: 'EUR'
            });

            assert.equal(numberLocalization.getCurrencySymbol().symbol, '€');
        } finally {
            config(originalConfig);
        }
    });

    const ExcelJSLocalizationFormatTests = require('../DevExpress.exporter/exceljsParts/exceljs.format.tests.js');

    ExcelJSLocalizationFormatTests.default.runCurrencyTests([
        { value: 'USD', expected: '$#,##0_);\\($#,##0\\)' },
        { value: 'RUB', expected: '\\R\\U\\B#,##0_);\\(\\R\\U\\B#,##0\\)' },
        { value: 'JPY', expected: '\\¥#,##0_);\\(\\¥#,##0\\)' },
        { value: 'KPW', expected: '\\K\\P\\W#,##0_);\\(\\K\\P\\W#,##0\\)' },
        { value: 'LBP', expected: '\\L\\B\\P#,##0_);\\(\\L\\B\\P#,##0\\)' },
        { value: 'SEK', expected: '\\S\\E\\K#,##0_);\\(\\S\\E\\K#,##0\\)' }
    ]);
});


