const likelySubtags = require('cldr-core/supplemental/likelySubtags.json!');
const numberingSystems = require('cldr-core/supplemental/numberingSystems.json!');
const Globalize = require('globalize');

const cldrData = [
    require('devextreme-cldr-data/fa.json!json'),
    require('devextreme-cldr-data/mr.json!json'),
    require('devextreme-cldr-data/ar.json!json'),
    require('devextreme-cldr-data/de.json!json'),
];

Globalize.load(likelySubtags);
Globalize.load(numberingSystems);

cldrData.forEach(localeCldrData => {
    Globalize.load(localeCldrData);
});

require('common/core/localization/globalize/core');
require('common/core/localization/globalize/number');
require('common/core/localization/globalize/currency');
require('common/core/localization/globalize/date');
require('common/core/localization/globalize/message');

const $ = require('jquery');
const dateLocalization = require('common/core/localization/date');

require('ui/date_box');
require('viz/chart');

const ExcelExport = require('exporter/exceljs/export_format');

const TEXTEDITOR_INPUT_SELECTOR = '.dx-texteditor-input';
const DATEVIEW_ITEM_SELECTOR = '.dx-dateview-item';
const DATEVIEW_ROLLER_DAY_SELECTOR = '.dx-dateviewroller-day';
const DATEVIEW_ROLLER_YEAR_SELECTOR = '.dx-dateviewroller-year';
const DATEVIEW_DAYS_SELECTOR = DATEVIEW_ROLLER_DAY_SELECTOR + ' ' + DATEVIEW_ITEM_SELECTOR;
const DATEVIEW_YEARS_SELECTOR = DATEVIEW_ROLLER_YEAR_SELECTOR + ' ' + DATEVIEW_ITEM_SELECTOR;
const CALENDAR_NAVIGATOR_TEXT_SELECTOR = '.dx-calendar-caption-button';
const CALENDAR_CELL_SELECTOR = '.dx-calendar-cell';
const CLEAR_BUTTON_CLASS = 'dx-clear-button-area';
const commonEnvironment = {
    beforeEach: function() {
        const markup =
                `<div id="dateBox"></div>
                <div id="numberBox"></div>
                <div id="dateBoxWithPicker"></div>
                <div id="widthRootStyle"></div>
                <div id="calendar"></div>`;

        $('#qunit-fixture').html(markup);
        $('#widthRootStyle').css({ width: '300px' });
    },

    afterEach: function() {
        $('#qunit-fixture').empty();
    }
};

QUnit.module('DateBox', commonEnvironment, () => {
    QUnit.test('"ww" format should not raise any errors (T924017)', function(assert) {
        try {
            $('#dateBox').dxDateBox({
                useMaskBehavior: true,
                displayFormat: 'ww, d of MMM, yyyy HH:mm',
                value: new Date(2018, 9, 16, 15, 8, 12)
            });
        } catch(e) {
            assert.ok(false, e);
        } finally {
            assert.ok(true, 'no errors has been raised');
        }
    });

    QUnit.test('Date and serializing date in locales different than EN', function(assert) {
        const originalCulture = Globalize.locale().locale;

        try {
            Globalize.locale('de');

            const $dateBox = $('#dateBox').dxDateBox({
                value: new Date(2015, 10, 10),
                type: 'date',
                pickerType: 'calendar'
            });

            const date = $dateBox.find(TEXTEDITOR_INPUT_SELECTOR).val();
            assert.equal(date, '10.11.2015', 'date format is correct');
        } finally {
            Globalize.locale(originalCulture);
        }
    });

    QUnit.test('DateBox should localize whole date in arabic locale', function(assert) {
        const originalCulture = Globalize.locale().locale;

        try {
            Globalize.locale('ar');

            const $dateBox = $('#dateBox').dxDateBox({
                value: new Date(2015, 10, 10),
                type: 'date',
                pickerType: 'calendar'
            });

            const date = $dateBox.find(TEXTEDITOR_INPUT_SELECTOR).val();
            assert.equal(date, '١٠/١١/٢٠١٥', 'date is localized');
        } finally {
            Globalize.locale(originalCulture);
        }
    });

    QUnit.test('DateBox should not raise error when digits are Marathi digits', function(assert) {
        const originalCulture = Globalize.locale().locale;

        try {
            Globalize.locale('mr');

            const $dateBox = $('#dateBox').dxDateBox({
                value: new Date(2015, 10, 10),
                type: 'date',
                pickerType: 'calendar',
                useMaskBehavior: true
            });

            const date = $dateBox.find(TEXTEDITOR_INPUT_SELECTOR).val();
            assert.equal(date, '१०/११/२०१५', 'date is localized');
        } catch(e) {
            assert.ok(false, 'Error occured: ' + e.message);
        } finally {
            Globalize.locale(originalCulture);
        }
    });

    QUnit.test('DateBox should not raise error when digits are not default arabic digits', function(assert) {
        const originalCulture = Globalize.locale().locale;

        try {
            Globalize.locale('ar');

            const $dateBox = $('#dateBox').dxDateBox({
                value: new Date(2015, 10, 10),
                type: 'date',
                pickerType: 'calendar',
                useMaskBehavior: true
            });

            const date = $dateBox.find(TEXTEDITOR_INPUT_SELECTOR).val();
            assert.equal(date, '١٠/١١/٢٠١٥', 'date is localized');
        } catch(e) {
            assert.ok(false, 'Error occured: ' + e.message);
        } finally {
            Globalize.locale(originalCulture);
        }
    });

    ['h:mm aaa', 'h:mm aaaa', 'h:mm aaaaa'].forEach(displayFormat => {
        QUnit.test(`DateBox should not raise error when displayFormat="${displayFormat}" and arabic locale is used (T1162346)`, function(assert) {
            const originalCulture = Globalize.locale().locale;

            try {
                Globalize.locale('ar');

                const $dateBox = $('#dateBox').dxDateBox({
                    value: new Date(2015, 10, 10),
                    displayFormat,
                    type: 'time',
                    pickerType: 'calendar',
                    useMaskBehavior: true
                });

                const date = $dateBox.find(TEXTEDITOR_INPUT_SELECTOR).val();
                assert.strictEqual(date, '١٢:٠٠ ص', 'date is localized');
            } catch(e) {
                assert.ok(false, 'Error occured: ' + e.message);
            } finally {
                Globalize.locale(originalCulture);
            }
        });
    });

    QUnit.test('DateBox should not raise error when digits are not default arabic digits and Fractional Seconds in the "displayFormat"', function(assert) {
        const originalCulture = Globalize.locale().locale;

        try {
            Globalize.locale('ar');

            const dateBox = $('#dateBox').dxDateBox({
                value: new Date('2014-09-08T08:02:17.12'),
                useMaskBehavior: true,
                type: 'date',
                pickerType: 'calendar',
                displayFormat: 'HH:mm:ss.SS'
            }).dxDateBox('instance');

            assert.strictEqual(dateBox.option('text'), '٠٨:٠٢:١٧.١٢', 'date is localized');
        } catch(e) {
            assert.ok(false, `Error occured: ${e.message}`);
        } finally {
            Globalize.locale(originalCulture);
        }
    });

    QUnit.test('DateBox should not raise error when digits are Farsi digits', function(assert) {
        const originalCulture = Globalize.locale().locale;

        try {
            Globalize.locale('fa');

            const $dateBox = $('#dateBox').dxDateBox({
                value: new Date(2015, 10, 10),
                type: 'date',
                pickerType: 'calendar',
                useMaskBehavior: true
            });

            const date = $dateBox.find(TEXTEDITOR_INPUT_SELECTOR).val();
            assert.equal(date, '۲۰۱۵/۱۱/۱۰', 'date is localized');
        } catch(e) {
            assert.ok(false, 'Error occured: ' + e.message);
        } finally {
            Globalize.locale(originalCulture);
        }
    });

    QUnit.test('dxDateBox rollers localize years and days', function(assert) {
        const originalCulture = Globalize.locale().locale;
        const clock = sinon.useFakeTimers();

        try {
            Globalize.locale('ar');

            const dateBox = $('#dateBox').dxDateBox({
                value: new Date(2015, 10, 10),
                type: 'date',
                pickerType: 'rollers',
                opened: true
            }).dxDateBox('instance');

            const $dateBoxContent = $(dateBox.content());
            const dayText = $dateBoxContent.find(DATEVIEW_DAYS_SELECTOR).first().text();
            const yearText = $dateBoxContent.find(DATEVIEW_YEARS_SELECTOR).first().text();

            assert.equal(dayText, '١', 'Day localized');
            assert.equal(yearText, '١٩٠٠', 'Year localized');
        } finally {
            Globalize.locale(originalCulture);
            clock.restore();
        }
    });

    QUnit.test('Calendar localize dates on the month view', function(assert) {
        const originalCulture = Globalize.locale().locale;

        try {
            Globalize.locale('ar');

            const $calendar = $('#calendar').dxCalendar({
                value: new Date(2015, 10, 11)
            });

            const navigatorText = $calendar.find(CALENDAR_NAVIGATOR_TEXT_SELECTOR).text();
            const cellText = $calendar.find(CALENDAR_CELL_SELECTOR).first().text();

            assert.equal(navigatorText, 'نوفمبر ٢٠١٥', 'Navigator localized');

            assert.equal(cellText, '٣١', 'Cell localized');
        } finally {
            Globalize.locale(originalCulture);
        }
    });

    QUnit.test('Calendar localize dates on the year view', function(assert) {
        const originalCulture = Globalize.locale().locale;

        try {
            Globalize.locale('ar');

            const $calendar = $('#calendar').dxCalendar({
                value: new Date(2015, 10, 10),
                zoomLevel: 'year'
            });

            const navigatorText = $calendar.find(CALENDAR_NAVIGATOR_TEXT_SELECTOR).text();
            const cellText = $calendar.find(CALENDAR_CELL_SELECTOR).first().text();

            assert.equal(navigatorText, '٢٠١٥', 'Navigator localized');
            assert.equal(cellText, 'يناير', 'Cell localized');
        } finally {
            Globalize.locale(originalCulture);
        }
    });

    QUnit.test('Calendar localize dates on the decade view', function(assert) {
        const originalCulture = Globalize.locale().locale;

        try {
            Globalize.locale('ar');

            const $calendar = $('#calendar').dxCalendar({
                value: new Date(2015, 10, 10),
                zoomLevel: 'decade'
            });

            const navigatorText = $calendar.find(CALENDAR_NAVIGATOR_TEXT_SELECTOR).text();
            const cellText = $calendar.find(CALENDAR_CELL_SELECTOR).first().text();

            assert.equal(navigatorText, '٢٠١٠-٢٠١٩', 'Navigator localized');
            assert.equal(cellText, '٢٠٠٩', 'Cell localized');
        } finally {
            Globalize.locale(originalCulture);
        }
    });

    QUnit.test('Calendar localize dates on the century view', function(assert) {
        const originalCulture = Globalize.locale().locale;

        try {
            Globalize.locale('ar');

            const $calendar = $('#calendar').dxCalendar({
                value: new Date(2015, 10, 10),
                zoomLevel: 'century'
            });

            const navigatorText = $calendar.find(CALENDAR_NAVIGATOR_TEXT_SELECTOR).text();
            const cellText = $calendar.find(CALENDAR_CELL_SELECTOR).first().text();

            assert.equal(navigatorText, '٢٠٠٠-٢٠٩٩', 'Navigator localized');
            assert.equal(cellText, '١٩٩٠ - ١٩٩٩', 'Cell localized');
        } finally {
            Globalize.locale(originalCulture);
        }
    });

    QUnit.test('parse string format date', function(assert) {
        const value = '2014-02-06T23:31:25.33';
        const originalCulture = Globalize.locale().locale;

        try {
            Globalize.locale('de');

            const $element = $('#dateBox').dxDateBox({
                value: value,
                type: 'datetime',
                pickerType: 'calendar'
            });

            const date = $element.find(TEXTEDITOR_INPUT_SELECTOR).val();

            const expectedDate = new Date(2014, 1, 6, 23, 31, 25, 330);

            assert.equal(date, dateLocalization.format(expectedDate, 'shortdateshorttime'), 'string format parsed correct in date format');
            assert.equal($element.dxDateBox('option', 'value'), value, 'value format is correct');
        } finally {
            Globalize.locale(originalCulture);
        }
    });
});

QUnit.module('NumberBox', commonEnvironment, () => {
    QUnit.test('click on clear button should not raise any errors (T1028426)', function(assert) {
        try {
            const $numberBox = $('#numberBox').dxNumberBox({
                format: Globalize.currencyFormatter('EUR', { minimumFractionDigits: 0 }),
                value: 10,
                showClearButton: true,
            });
            const $clearButton = $numberBox.find(`.${CLEAR_BUTTON_CLASS}`);

            $clearButton.click();

        } catch(e) {
            assert.ok(false, e);
        } finally {
            assert.ok(true, 'no errors has been raised');
        }
    });
});

QUnit.module('Chart', commonEnvironment, () => {
    QUnit.test('Chart', function(assert) {
        $('#widthRootStyle').dxChart({
            dataSource: [{
                arg: 'Sun',
                val: 332837
            }, {
                arg: 'Europa (Jupiter\'s Moon)',
                val: 0.00803
            }],
            series: {},
            valueAxis: {
                tickInterval: 2,
                type: 'logarithmic'
            }
        });

        assert.strictEqual($($('.dxc-val-elements').children()[0]).text(), '0.0001');
    });
});

QUnit.module('Excel creator', commonEnvironment, () => {
    QUnit.test('Arabic data convert', function(assert) {
        const originalCulture = Globalize.locale().locale;

        try {
            Globalize.locale('ar');

            const convertDate = function(formatter) {
                return ExcelExport.ExportFormat.convertFormat(formatter, null, 'date');
            };

            const pattern = '[$-2010001]d\\/M\\/yyyy';
            const formatter = function(value) {
                return dateLocalization.format(value, 'shortdate');
            };
            const date = convertDate(formatter).trim();

            assert.strictEqual(date, pattern, `Pattern: "${pattern}" Example:"${formatter(new Date())}"`);
        } finally {
            Globalize.locale(originalCulture);
        }
    });
});

