var likelySubtags = require('../../../node_modules/cldr-core/supplemental/likelySubtags.json!'),
    numberingSystems = require('../../../node_modules/cldr-core/supplemental/numberingSystems.json!'),
    Globalize = require('globalize');

Globalize.load(likelySubtags);
Globalize.load(numberingSystems);

require('../../helpers/l10n/cldrNumberDataDe.js');
require('../../helpers/l10n/cldrCalendarDataDe.js');
require('../../helpers/l10n/cldrNumberDataAr.js');
require('../../helpers/l10n/cldrCalendarDataAr.js');

require('localization/globalize/core');
require('localization/globalize/number');
require('localization/globalize/currency');
require('localization/globalize/date');
require('localization/globalize/message');

var $ = require('jquery'),
    dateLocalization = require('localization/date');

require('ui/date_box');
require('viz/chart');

var TEXTEDITOR_INPUT_SELECTOR = '.dx-texteditor-input',
    DATEVIEW_ITEM_SELECTOR = '.dx-dateview-item',
    DATEVIEW_ROLLER_DAY_SELECTOR = '.dx-dateviewroller-day',
    DATEVIEW_ROLLER_YEAR_SELECTOR = '.dx-dateviewroller-year',
    DATEVIEW_DAYS_SELECTOR = DATEVIEW_ROLLER_DAY_SELECTOR + ' ' + DATEVIEW_ITEM_SELECTOR,
    DATEVIEW_YEARS_SELECTOR = DATEVIEW_ROLLER_YEAR_SELECTOR + ' ' + DATEVIEW_ITEM_SELECTOR,
    CALENDAR_NAVIGATOR_TEXT_SELECTOR = '.dx-calendar-caption-button',
    CALENDAR_CELL_SELECTOR = '.dx-calendar-cell',
    commonEnvironment = {
        beforeEach: function() {
            var markup =
                '<div id="dateBox"></div>\
                    <div id="dateBoxWithPicker"></div>\
                    <div id="widthRootStyle" style="width: 300px;"></div>\
                    <div id="calendar"></div>';

            $('#qunit-fixture').html(markup);
        },

        afterEach: function() {
            $('#qunit-fixture').empty();
        }
    };

QUnit.module('DateBox', commonEnvironment);

QUnit.test('Date and serializing date in locales different than EN', function(assert) {
    var originalCulture = Globalize.locale().locale;

    try {
        Globalize.locale('de');

        var $dateBox = $('#dateBox').dxDateBox({
            value: new Date(2015, 10, 10),
            type: 'date',
            pickerType: 'calendar'
        });

        var date = $dateBox.find(TEXTEDITOR_INPUT_SELECTOR).val();
        assert.equal(date, '10.11.2015', 'date format is correct');
    } finally {
        Globalize.locale(originalCulture);
    }
});

QUnit.test('DateBox should localize whole date in arabic locale', function(assert) {
    var originalCulture = Globalize.locale().locale;

    try {
        Globalize.locale('ar');

        var $dateBox = $('#dateBox').dxDateBox({
            value: new Date(2015, 10, 10),
            type: 'date',
            pickerType: 'calendar'
        });

        var date = $dateBox.find(TEXTEDITOR_INPUT_SELECTOR).val();
        assert.equal(date, '١٠/١١/٢٠١٥', 'date is localized');
    } finally {
        Globalize.locale(originalCulture);
    }
});

QUnit.test('dxDateBox rollers localize years and days', function(assert) {
    var originalCulture = Globalize.locale().locale;

    try {
        Globalize.locale('ar');

        var dateBox = $('#dateBox').dxDateBox({
            value: new Date(2015, 10, 10),
            type: 'date',
            pickerType: 'rollers',
            opened: true
        }).dxDateBox('instance');

        var $dateBoxContent = $(dateBox.content()),
            dayText = $dateBoxContent.find(DATEVIEW_DAYS_SELECTOR).first().text(),
            yearText = $dateBoxContent.find(DATEVIEW_YEARS_SELECTOR).first().text();

        assert.equal(dayText, '١', 'Day localized');
        assert.equal(yearText, '١٩٠٠', 'Year localized');
    } finally {
        Globalize.locale(originalCulture);
    }
});

QUnit.test('Calendar localize dates on the month view', function(assert) {
    var originalCulture = Globalize.locale().locale;

    try {
        Globalize.locale('ar');

        var $calendar = $('#calendar').dxCalendar({
            value: new Date(2015, 10, 10)
        });

        var navigatorText = $calendar.find(CALENDAR_NAVIGATOR_TEXT_SELECTOR).text(),
            cellText = $calendar.find(CALENDAR_CELL_SELECTOR).first().text();

        assert.equal(navigatorText, 'نوفمبر ٢٠١٥', 'Navigator localized');
        assert.equal(cellText, '٢٦', 'Cell localized');
    } finally {
        Globalize.locale(originalCulture);
    }
});

QUnit.test('Calendar localize dates on the year view', function(assert) {
    var originalCulture = Globalize.locale().locale;

    try {
        Globalize.locale('ar');

        var $calendar = $('#calendar').dxCalendar({
            value: new Date(2015, 10, 10),
            zoomLevel: 'year'
        });

        var navigatorText = $calendar.find(CALENDAR_NAVIGATOR_TEXT_SELECTOR).text(),
            cellText = $calendar.find(CALENDAR_CELL_SELECTOR).first().text();

        assert.equal(navigatorText, '٢٠١٥', 'Navigator localized');
        assert.equal(cellText, 'يناير', 'Cell localized');
    } finally {
        Globalize.locale(originalCulture);
    }
});

QUnit.test('Calendar localize dates on the decade view', function(assert) {
    var originalCulture = Globalize.locale().locale;

    try {
        Globalize.locale('ar');

        var $calendar = $('#calendar').dxCalendar({
            value: new Date(2015, 10, 10),
            zoomLevel: 'decade'
        });

        var navigatorText = $calendar.find(CALENDAR_NAVIGATOR_TEXT_SELECTOR).text(),
            cellText = $calendar.find(CALENDAR_CELL_SELECTOR).first().text();

        assert.equal(navigatorText, '٢٠١٠-٢٠١٩', 'Navigator localized');
        assert.equal(cellText, '٢٠٠٩', 'Cell localized');
    } finally {
        Globalize.locale(originalCulture);
    }
});

QUnit.test('Calendar localize dates on the century view', function(assert) {
    var originalCulture = Globalize.locale().locale;

    try {
        Globalize.locale('ar');

        var $calendar = $('#calendar').dxCalendar({
            value: new Date(2015, 10, 10),
            zoomLevel: 'century'
        });

        var navigatorText = $calendar.find(CALENDAR_NAVIGATOR_TEXT_SELECTOR).text(),
            cellText = $calendar.find(CALENDAR_CELL_SELECTOR).first().text();

        assert.equal(navigatorText, '٢٠٠٠-٢٠٩٩', 'Navigator localized');
        assert.equal(cellText, '١٩٩٠ - ١٩٩٩', 'Cell localized');
    } finally {
        Globalize.locale(originalCulture);
    }
});

QUnit.test('parse string format date', function(assert) {
    var value = '2014-02-06T23:31:25.33';
    var originalCulture = Globalize.locale().locale;

    try {
        Globalize.locale('de');

        var $element = $('#dateBox').dxDateBox({
            value: value,
            type: 'datetime',
            pickerType: 'calendar'
        });

        var date = $element.find(TEXTEDITOR_INPUT_SELECTOR).val();

        var expectedDate = new Date(2014, 1, 6, 23, 31, 25, 330);

        assert.equal(date, dateLocalization.format(expectedDate, 'shortdateshorttime'), 'string format parsed correct in date format');
        assert.equal($element.dxDateBox('option', 'value'), value, 'value format is correct');
    } finally {
        Globalize.locale(originalCulture);
    }
});

QUnit.module('Chart', commonEnvironment);

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
