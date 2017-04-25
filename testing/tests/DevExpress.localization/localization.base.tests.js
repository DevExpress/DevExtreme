"use strict";

var $ = require("jquery"),
    numberLocalization = require("localization/number"),
    dateLocalization = require("localization/date"),
    messageLocalization = require("localization/message"),
    localization = require("localization"),
    logger = require("core/utils/console").logger;

var generateExpectedDate = require("../../helpers/dateHelper.js").generateDate;

require("localization/currency");

QUnit.module("Localization modules");

var checkModules = function(testName, namespace, methods) {
    QUnit.test(testName, function(assert) {
        $.each(methods, function(index, method) {
            assert.ok($.isFunction(namespace[method]), method + " method exists");
        });
    });
};

checkModules("localization.date", dateLocalization, [
    "getMonthNames",
    "getDayNames",
    "getTimeSeparator",
    "format",
    "parse",
    "formatUsesMonthName",
    "formatUsesDayName",
    "getFormatParts",
    "firstDayOfWeekIndex",
]);

checkModules("localization.number", numberLocalization, [
    "format",
    "parse",
    "getCurrencySymbol"
]);

checkModules("localization.message", messageLocalization, [
    "setup",
    "localizeString",
    "localizeNode",
    "getMessagesByLocales",
    "getFormatter",
    "format",
    "load"
]);

checkModules("localization", localization, [
    "loadMessages",
    "locale"
]);

QUnit.module("Localization date (en)");

QUnit.test("formatUsesMonthName", function(assert) {
    assert.equal(dateLocalization.formatUsesMonthName("monthAndDay"), true);
    assert.equal(dateLocalization.formatUsesMonthName("monthAndYear"), true);
    assert.equal(dateLocalization.formatUsesMonthName("y MMMM d"), true);
    assert.equal(dateLocalization.formatUsesMonthName("y MMM d"), false);
    assert.equal(dateLocalization.formatUsesMonthName("month"), false);
});

QUnit.test("formatUsesDayName", function(assert) {
    assert.equal(dateLocalization.formatUsesDayName("dayofweek"), true);
    assert.equal(dateLocalization.formatUsesDayName("longdate"), true);
    assert.equal(dateLocalization.formatUsesDayName("longdatelongtime"), true);
    assert.equal(dateLocalization.formatUsesDayName("EEEE"), true);
    assert.equal(dateLocalization.formatUsesDayName("EEE"), false);
    assert.equal(dateLocalization.formatUsesDayName("day"), false);
    assert.equal(dateLocalization.formatUsesDayName("shortDate"), false);
});

QUnit.test("getFormatParts", function(assert) {
    assert.equal(dateLocalization.getFormatParts("dayofweek").length, 0);
    assert.equal(dateLocalization.getFormatParts("shortdate").join(" "), "month day year");
    assert.equal(dateLocalization.getFormatParts("longDateLongTime").join(" "), "month day year hours minutes seconds");
    assert.equal(dateLocalization.getFormatParts("d - M - y, hh:mm:ss [SSS]").join(" "), "day month year hours minutes seconds milliseconds");
});

QUnit.test("getMonthNames", function(assert) {
    assert.deepEqual(dateLocalization.getMonthNames(),
        ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "Array of month names");
});

QUnit.test("getDayNames", function(assert) {
    assert.deepEqual(dateLocalization.getDayNames(),
        ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "Array of day names");
});

QUnit.test("getTimeSeparator", function(assert) {
    assert.equal(dateLocalization.getTimeSeparator(), ":");
});

QUnit.test("format", function(assert) {
    var assertData = {
        "day": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "2"
        },
        "dayofweek": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "Monday"
        },
        "hour": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "03"
        },
        "longdate": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "Monday, March 2, 2015"
        },
        "longdatelongtime": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "Monday, March 2, 2015, 3:04:05 AM"
        },
        "longtime": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "3:04:05 AM"
        },
        "millisecond": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "006"
        },
        "minute": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "04"
        },
        "month": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "March"
        },
        "monthandday": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "March 2"
        },
        "monthandyear": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "March 2015"
        },
        "quarter": [
            {
                date: new Date(2015, 0),
                expected: "Q1"
            },
            {
                date: new Date(2015, 1),
                expected: "Q1"
            },
            {
                date: new Date(2015, 2),
                expected: "Q1"
            },
            {
                date: new Date(2015, 3),
                expected: "Q2"
            },
            {
                date: new Date(2015, 4),
                expected: "Q2"
            },
            {
                date: new Date(2015, 5),
                expected: "Q2"
            },
            {
                date: new Date(2015, 6),
                expected: "Q3"
            },
            {
                date: new Date(2015, 7),
                expected: "Q3"
            },
            {
                date: new Date(2015, 8),
                expected: "Q3"
            },
            {
                date: new Date(2015, 9),
                expected: "Q4"
            },
            {
                date: new Date(2015, 10),
                expected: "Q4"
            },
            {
                date: new Date(2015, 11),
                expected: "Q4"
            }
        ],
        "quarterandyear": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "Q1 2015"
        },
        "second": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "05"
        },
        "shortdate": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "3/2/2015"
        },
        "shortdateshorttime": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "3/2/2015, 3:04 AM"
        },
        "shorttime": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "3:04 AM"
        },
        "shortyear": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "15"
        },
        "year": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "2015"
        },
        "datetime-local": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "2015-03-02T03:04:05"
        },
        "yyyy MMMM d": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "2015 March 2"
        },
        "ss SSS": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "05 006"
        },
        "E": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "Mon"
        },
        "EEE": {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: "Mon"
        }
    };

    $.each(assertData, function(format, data) {
        data = $.makeArray(data);

        $.each(data, function(_, data) {
            assert.equal(dateLocalization.format(data.date, format), data.expected, data.date + " in " + format + " format");
        });
    });

    assert.equal(dateLocalization.format(new Date(2015, 2, 2, 3, 4, 5, 6)), String(new Date(2015, 2, 2, 3, 4, 5)), "without format");
    assert.notOk(dateLocalization.format(), "without date");
});

QUnit.test("object syntax", function(assert) {
    assert.equal(dateLocalization.format(new Date(2015, 2, 2, 3, 4, 5, 6), { type: "longdate" }), "Monday, March 2, 2015");
});

QUnit.test("parse", function(assert) {
    var assertData = {
        "day": {
            text: "2",
            expectedConfig: { day: 2 }
        },
        "hour": {
            text: "03",
            expectedConfig: { hours: 3 }
        },
        "longdate": {
            text: "Monday, March 2, 2015",
            expected: new Date(2015, 2, 2)
        },
        "longdatelongtime": [
            {
                text: "Monday, March 2, 2015, 3:04:05 AM",
                expected: new Date(2015, 2, 2, 3, 4, 5)
            },
            {
                text: "Monday, March 2, 2015, 3:04:05 PM",
                expected: new Date(2015, 2, 2, 15, 4, 5)
            }
        ],
        "longtime": [
            {
                text: "3:04:05 AM",
                expectedConfig: { hours: 3, minutes: 4, seconds: 5 }
            },
            {
                text: "3:04:05 PM",
                expectedConfig: { hours: 15, minutes: 4, seconds: 5 }
            }
        ],
        "minute": {
            text: "04",
            expectedConfig: { minutes: 4 }
        },
        "month": {
            text: "March",
            expectedConfig: { month: 2, day: 1 }
        },
        "monthandday": {
            text: "March 2",
            expectedConfig: { month: 2, day: 2 }
        },
        "monthandyear": {
            text: "March 2015",
            expected: new Date(2015, 2, 1)
        },
        "second": {
            text: "05",
            expectedConfig: { seconds: 5 }
        },
        "shortdate": {
            text: "3/2/2015",
            expected: new Date(2015, 2, 2)
        },
        "shortdateshorttime": {
            text: "3/2/2015, 3:04 AM",
            expected: new Date(2015, 2, 2, 3, 4)
        },
        "shorttime": [
            {
                text: "3:04 AM",
                expectedConfig: { hours: 3, minutes: 4 }
            },
            // NOTE: T464978
            {
                text: "12:30 PM",
                expectedConfig: { hours: 12, minutes: 30 }
            },
            {
                text: "12:30 AM",
                expectedConfig: { hours: 0, minutes: 30 }
            },
            {
                text: "14:20 AM",
                expected: null
            },
            {
                text: "4:60 AM",
                expected: null
            },
            {
                text: "0:00 AM",
                expected: null
            },
            {
                text: "0:00 PM",
                expected: null
            }
        ],
        "shortyear": [
            {
                text: "15",
                expected: new Date(2015, 0, 1)
            },
            {
                text: "86",
                expected: new Date(1986, 0, 1)
            }
        ],
        "year": {
            text: "2015",
            expected: new Date(2015, 0, 1)
        },

        "datetime-local": {
            text: "2015-03-02T03:04:05",
            expected: new Date(2015, 2, 2, 3, 4, 5)
        },
        "yyyy MMMM d": {
            text: "2015 March 2",
            expected: new Date(2015, 2, 2)
        },

        "mediumdatemediumtime": [
            {
                text: "March 2, 3:12 AM",
                expectedConfig: { month: 2, day: 2, hours: 3, minutes: 12, seconds: 0 }
            },
            {
                text: "March 2, 3:12 PM",
                expectedConfig: { month: 2, day: 2, hours: 15, minutes: 12, seconds: 0 }
            },
            {
                text: "March 2, 12:12 AM",
                expectedConfig: { month: 2, day: 2, hours: 0, minutes: 12, seconds: 0 }
            },
            {
                text: "March 2, 12:12 PM",
                expectedConfig: { month: 2, day: 2, hours: 12, minutes: 12, seconds: 0 }
            }
        ]
    };

    $.each(assertData, function(format, data) {
        data = $.makeArray(data);

        $.each(data, function(_, data) {
            var expected = data.expectedConfig && generateExpectedDate(data.expectedConfig) || data.expected;
            assert.equal(dateLocalization.parse(data.text, format), expected && String(expected), format + " format");
        });
    });

    assert.equal(dateLocalization.parse("550", "millisecond").getMilliseconds(), 550, "millisecond format");
    assert.equal(dateLocalization.parse("550", "SSS").getMilliseconds(), 550, "millisecond format");

    assert.equal(dateLocalization.parse(dateLocalization.format(new Date(), "shortdate")), String(generateExpectedDate({ hours: 0 })), "without format");
    assert.notOk(dateLocalization.parse(), "without date");
});

QUnit.test("parse with shortDate format (T478962)", function(assert) {
    assert.equal(dateLocalization.parse("2/20/2015", "shortDate"), String(new Date(2015, 1, 20)));
    assert.equal(dateLocalization.parse("02/20/2015", "shortDate"), String(new Date(2015, 1, 20)));
    assert.equal(dateLocalization.parse("02/02/2015", "shortDate"), String(new Date(2015, 1, 2)));
    assert.equal(dateLocalization.parse("2/2/2015", "shortDate"), String(new Date(2015, 1, 2)));
    assert.equal(dateLocalization.parse("22/20/2015", "shortDate"), undefined);
    assert.equal(dateLocalization.parse("2/120/2015", "shortDate"), undefined);
    assert.equal(dateLocalization.parse("2/20/", "shortDate"), undefined);
    //TODO: fix this case
    //assert.equal(dateLocalization.parse("2/20/1", "shortDate"), String(new Date(1, 1, 20)));
});

QUnit.test("firstDayOfWeekIndex", function(assert) {
    assert.equal(dateLocalization.firstDayOfWeekIndex(), 0);
});

QUnit.module("Localization message (en)", {
    beforeEach: function() {
        localization.loadMessages({
            "en": {
                addedKey: "testValue",
                hello: "Hello, {0} {1}"
            }
        });
    }
});

QUnit.test("set custom localizablePrefix", function(assert) {
    var localized = messageLocalization.localizeString("@addedKey #addedKey");
    assert.equal(localized, "testValue #addedKey");

    try {
        messageLocalization.setup("#");

        localized = messageLocalization.localizeString("@addedKey #addedKey");
        assert.equal(localized, "@addedKey testValue");
    } finally {
        messageLocalization.setup("@");
    }
});

QUnit.test("format", function(assert) {
    assert.equal(messageLocalization.format("addedKey"), "testValue");

    try {
        localization.loadMessages({ "en": {
            fallBackTestKey: "fallBackTestMessage"
        } });
        localization.locale("ru");

        assert.equal(messageLocalization.format("fallBackTestKey"), "fallBackTestMessage");
    } finally {
        localization.locale("en");
    }
});

QUnit.test("getFormatter", function(assert) {
    assert.equal(messageLocalization.getFormatter("hello")(["Ivan", "Ivanov"]), "Hello, Ivan Ivanov");
    assert.equal(messageLocalization.getFormatter("hello")("Ivan", "Ivanov"), "Hello, Ivan Ivanov");

    try {
        localization.loadMessages({ "en": {
            fallBackTestKey: "fallBackTestMessage {0}"
        } });
        localization.locale("ru");

        assert.equal(messageLocalization.getFormatter("fallBackTestKey")("1"), "fallBackTestMessage 1");
    } finally {
        localization.locale("en");
    }
});

QUnit.test("localizeString", function(assert) {
    var localized = messageLocalization.localizeString("@addedKey @@addedKey @");
    assert.equal(localized, "testValue @addedKey @");
});

QUnit.test("localizeString doesn't affect e-mails", function(assert) {
    var toLocalize = "E-mails such as email@addedKey.com are not localized",
        localized = messageLocalization.localizeString(toLocalize);

    assert.equal(localized, toLocalize);
});

QUnit.test("localizeString doesn't affect unknown keys", function(assert) {
    var toLocalize = "@unknownKey",
        localized = messageLocalization.localizeString(toLocalize);

    assert.equal(localized, toLocalize);
});

QUnit.test("localizeNode", function(assert) {
    var $node = $(
        "<div data='@Loading'>" +
            "   @Loading" +
            "   <div data='@Loading' class='inner'>" +
            "       @Loading" +
            "   </div>" +
            "</div>"),
        $contents = $node.contents();

    messageLocalization.localizeNode($node);

    assert.equal($node.attr("data"), "Loading...");

    assert.equal($.trim($contents.eq(0).text()), "Loading...");
    assert.equal($contents.eq(1).attr("data"), "Loading...");
    assert.equal($.trim($contents.eq(1).text()), "Loading...");
});

QUnit.test("getDictionary", function(assert) {
    localization.loadMessages({
        "en": {
            freshAddedKey: "testValue"
        }
    });
    messageLocalization.localizeString("@unknownKey");
    messageLocalization.localizeString("@freshAddedKey");

    assert.equal(messageLocalization.getDictionary()["Loading"], "Loading...");
    assert.equal(messageLocalization.getDictionary(true)["Loading"], undefined);
    assert.equal(messageLocalization.getDictionary()["freshAddedKey"], "testValue");
    assert.equal(messageLocalization.getDictionary(true)["freshAddedKey"], undefined);
    assert.equal(messageLocalization.getDictionary()["unknownKey"], "Unknown key");
    assert.equal(messageLocalization.getDictionary(true)["unknownKey"], "Unknown key");
});

QUnit.test("T199912: Application crashes if it has iframe and jquery version is 1.11.x", function(assert) {
    var $node = $("<iframe data='@Loading'></iframe>");

    messageLocalization.localizeNode($node);
    assert.equal($node.attr("data"), "@Loading", "T199912: Don't touch iframes");
});

QUnit.test("B239384: Application crushes if opening in IE with flash-specific tags", function(assert) {
    assert.expect(0);

    var html = "\
    <object name=\"_dp_swf_engine\" width=\"1\" height=\"1\" align=\"middle\" id=\"_dp_swf_engine\" classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" style=\"width: 1px; height: 1px;\">\
        <param name=\"_cx\" value=\"5080\">\
        <param name=\"_cy\" value=\"5080\">\
        <param name=\"FlashVars\" value=\"\">\
        <param name=\"Movie\" value=\"\">\
        <param name=\"Src\" value=\"\">\
        <param name=\"WMode\" value=\"Transparent\">\
        <param name=\"Play\" value=\"-1\">\
        <param name=\"Loop\" value=\"-1\">\
        <param name=\"Quality\" value=\"High\">\
        <param name=\"SAlign\" value=\"\">\
        <param name=\"Menu\" value=\"-1\">\
        <param name=\"Base\" value=\"\">\
        <param name=\"AllowScriptAccess\" value=\"always\">\
        <param name=\"Scale\" value=\"ShowAll\">\
        <param name=\"DeviceFont\" value=\"0\">\
        <param name=\"EmbedMovie\" value=\"0\">\
        <param name=\"BGColor\" value=\"\">\
        <param name=\"SWRemote\" value=\"\">\
        <param name=\"MovieData\" value=\"\">\
        <param name=\"SeamlessTabbing\" value=\"1\">\
        <param name=\"Profile\" value=\"0\">\
        <param name=\"ProfileAddress\" value=\"\">\
        <param name=\"ProfilePort\" value=\"0\">\
        <param name=\"AllowNetworking\" value=\"all\">\
        <param name=\"AllowFullScreen\" value=\"false\">\
        <param name=\"AllowFullScreenInteractive\" value=\"\">\
        <param name=\"IsDependent\" value=\"61\">\
        <param name=\"movie\" value=\"\">\
        <param name=\"quality\" value=\"high\">\
        <param name=\"wmode\" value=\"transparent\">\
        <param name=\"allowScriptAccess\" value=\"always\">\
    </object>";
    messageLocalization.localizeNode($(html));
});

QUnit.test("regression Q588810: IE8 error on localize input type attr", function(assert) {
    var $node = $("<input type='text'></input>");

    messageLocalization.localizeNode($node);

    assert.equal($node.attr("type"), "text");
});

QUnit.module("Localization number");

QUnit.test("format: base", function(assert) {
    //assert.equal(numberLocalization.format(1.2), "1.2");
    assert.equal(numberLocalization.format(12), "12");
    assert.equal(numberLocalization.format(1, { type: "decimal", precision: 2 }), "01");
    assert.equal(numberLocalization.format(1, { type: "decimal", precision: 3 }), "001");
});

QUnit.test("format: precision", function(assert) {
    assert.equal(numberLocalization.format(2, { type: "decimal", precision: 2 }), "02");
    assert.equal(numberLocalization.format(12, { type: "decimal", precision: 2 }), "12");
    assert.equal(numberLocalization.format(2, { type: "decimal", precision: 3 }), "002");
    assert.equal(numberLocalization.format(12, { type: "decimal", precision: 3 }), "012");
    assert.equal(numberLocalization.format(123, { type: "decimal", precision: 3 }), "123");
});

QUnit.test("parse: base", function(assert) {
    assert.equal(numberLocalization.parse("1.2"), 1.2);
    assert.equal(numberLocalization.parse("12,000"), 12000);
});

QUnit.test("parse: test starts with not digit symbols", function(assert) {
    assert.equal(numberLocalization.parse("$ 1.2"), 1.2);
    assert.equal(numberLocalization.parse("1.2 руб."), 1.2);
});

QUnit.test('Fixed point numeric formats', function(assert) {
    assert.equal(numberLocalization.format(23.04059872, { type: "fIxedPoint", precision: 4 }), '23.0406');
    assert.equal(numberLocalization.format(23.04059872, "fIxedPoint"), "23");
    assert.equal(numberLocalization.format(123.99, "fIxedPoint largeNumber"), "124");
    assert.equal(numberLocalization.format(-123.99, "fIxedPoint largeNumber"), "-124");
});

QUnit.test("format fixedPoint with precision", function(assert) {
    assert.equal(numberLocalization.format(1, { type: "fixedPoint", precision: 2 }), "1.00");
    assert.equal(numberLocalization.format(1.1, { type: "fixedPoint", precision: 2 }), "1.10");
    assert.equal(numberLocalization.format(1.1, { type: "fixedPoint" }), "1");
    assert.equal(numberLocalization.format(1, { type: "fixedPoint", precision: null }), "1");
    assert.equal(numberLocalization.format(1.2, { type: "fixedPoint", precision: null }), "1.2");
    assert.equal(numberLocalization.format(1.22, { type: "fixedPoint", precision: null }), "1.22");
    assert.equal(numberLocalization.format(1.222, { type: "fixedPoint", precision: null }), "1.222");
    assert.equal(numberLocalization.format(1.2222, { type: "fixedPoint", precision: null }), "1.2222");
    assert.equal(numberLocalization.format(1.2225, { type: "fixedPoint", precision: null }), "1.2225");
    assert.equal(numberLocalization.format(1.22222228, { type: "fixedPoint", precision: null }), "1.22222228");
});

QUnit.test('large number format powers', function(assert) {
    assert.strictEqual(numberLocalization.format(4119626293, 'largeNumber'), '4B');
    assert.strictEqual(numberLocalization.format(41196, 'thousands'), '41K');
    assert.strictEqual(numberLocalization.format(4119626293, 'miLLions'), '4,120M');
    assert.strictEqual(numberLocalization.format(4119626293, 'biLLions'), '4B');
    assert.strictEqual(numberLocalization.format(4119626293234, 'triLLions'), '4T');
});

QUnit.test('Percent numeric formats', function(assert) {
    assert.equal(numberLocalization.format(0.45, { type: "peRcent" }), '45%');
    assert.equal(numberLocalization.format(0.45, { type: "peRcent", precision: 2 }), '45.00%');
});

QUnit.test('Decimal numeric formats', function(assert) {
    assert.equal(numberLocalization.format(437, { type: "decimAl" }), '437');
    assert.equal(numberLocalization.format(437, { type: "deCimal", precision: 5 }), '00437');
});

QUnit.test('format as function', function(assert) {
    assert.equal(numberLocalization.format(437, function(value) { return "!" + value; }), '!437');
    assert.equal(numberLocalization.format(437, { formatter: function(value) { return "!" + value; } }), '!437');
});

QUnit.module("Localization currency");

QUnit.test("format: base", function(assert) {
    //assert.equal(currencyLocalization.format(1.2), "$1.2");
    assert.equal(numberLocalization.format(12, { type: "currency" }), "$12");
    assert.equal(numberLocalization.format(1, { type: "currency", precision: 2 }), "$1.00");
    assert.equal(numberLocalization.format(1, { type: "currency", precision: 2, currency: "USD" }), "$1.00");
});
QUnit.test("format: several words", function(assert) {
    assert.equal(numberLocalization.format(0, { type: "currency thousands", currency: undefined, precision: 0 }), "$0K");
});
QUnit.test("getOpenXmlCurrencyFormat", function(assert) {
    assert.equal(numberLocalization.getOpenXmlCurrencyFormat(), "$#,##0{0}_);\\($#,##0{0}\\)");
});

QUnit.module("Localization custom functions");

QUnit.test("number", function(assert) {
    var format = {
        formatter: function(value) {
            return "two";
        },
        parser: function(text) {
            return 2;
        }
    };

    assert.equal(numberLocalization.format(2, format), "two");
    assert.equal(numberLocalization.format(2, format.formatter), "two");
    assert.equal(numberLocalization.parse("two", format), 2);
});

QUnit.test("date", function(assert) {
    var format = {
        formatter: function(date) {
            return "Шел " + date.getFullYear() + " год.";
        },
        parser: function(text) {
            return new Date(Number(text.substr(4, 4)), 1, 1);
        }
    };
    var someDate = new Date(1999, 1, 1);

    assert.equal(dateLocalization.format(someDate, format), "Шел 1999 год.");
    assert.equal(dateLocalization.format(someDate, format.formatter), "Шел 1999 год.");
    assert.equal(dateLocalization.parse("Шел 2000 год.", format).getFullYear(), 2000);
});

QUnit.test("'no parser' errors", function(assert) {
    var numberFormatter = function(value) {
            return 1;
        },
        dateFormatter = function(value) {
            return new Date(0, 0, 1);
        },
        warningIdPrefixLength = 8,
        numberWarning = "Number parsing is invoked while the parser is not defined",
        dateWarning = "Date parsing is invoked while the parser is not defined",
        originalLoggerWarn = logger.warn,
        warnLog = [];

    logger.warn = function(text) {
        warnLog.push(text);
    };

    try {
        numberLocalization.parse("01", numberFormatter);
        numberLocalization.parse("01", { formatter: numberFormatter });
        dateLocalization.parse("01", dateFormatter);
        dateLocalization.parse("01", { formatter: dateFormatter });
        dateLocalization.parse("01", { day: 'numeric' });
        numberLocalization.parse("01");
        dateLocalization.parse("01");

        assert.equal(warnLog.length, 5);

        assert.equal(warnLog[0].substr(warningIdPrefixLength, numberWarning.length), numberWarning);
        assert.equal(warnLog[1].substr(warningIdPrefixLength, numberWarning.length), numberWarning);
        assert.equal(warnLog[2].substr(warningIdPrefixLength, dateWarning.length), dateWarning);
        assert.equal(warnLog[3].substr(warningIdPrefixLength, dateWarning.length), dateWarning);
        assert.equal(warnLog[4].substr(warningIdPrefixLength, dateWarning.length), dateWarning);
    } finally {
        logger.warn = originalLoggerWarn;
    }
});

QUnit.test('formatter has higher priority than a type', function(assert) {
    var format = {
        formatter: function(date) {
            return "Y " + date.getFullYear();
        },
        type: "year"
    };
    var someDate = new Date(1999, 1, 1);

    assert.equal(dateLocalization.format(someDate, format), "Y 1999");
});
