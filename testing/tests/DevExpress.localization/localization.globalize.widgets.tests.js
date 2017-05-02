"use strict";

require("../../helpers/l10n/cldrNumberDataDe.js");
require("../../helpers/l10n/cldrCalendarDataDe.js");

require("localization/globalize/core");
require("localization/globalize/number");
require("localization/globalize/currency");
require("localization/globalize/date");
require("localization/globalize/message");

var $ = require("jquery"),
    Globalize = require("globalize"),
    dateLocalization = require("localization/date");

require("ui/date_box");

var TEXTEDITOR_INPUT_SELECTOR = ".dx-texteditor-input";

QUnit.module("DateBox", {
    beforeEach: function() {
        var markup =
            '<div id="dateBox"></div>\
                <div id="dateBoxWithPicker"></div>\
                <div id="widthRootStyle" style="width: 300px;"></div>';

        $("#qunit-fixture").html(markup);
    },

    afterEach: function() {
        $("#qunit-fixture").empty();
    }
});

QUnit.test("Date and serializing date in locales different than EN", function(assert) {
    var originalCulture = Globalize.locale().locale;

    try {
        Globalize.locale("de");

        var $dateBox = $("#dateBox").dxDateBox({
            value: new Date(2015, 10, 10),
            type: "date",
            pickerType: "calendar"
        });

        var date = $dateBox.find(TEXTEDITOR_INPUT_SELECTOR).val();
        assert.equal(date, "10.11.2015", "date format is correct");
    } finally {
        Globalize.locale(originalCulture);
    }
});

QUnit.test("parse string format date", function(assert) {
    var value = "2014-02-06T23:31:25.33";
    var originalCulture = Globalize.locale().locale;

    try {
        Globalize.locale("de");

        var $element = $("#dateBox").dxDateBox({
            value: value,
            type: "datetime",
            pickerType: "calendar"
        });

        var date = $element.find(TEXTEDITOR_INPUT_SELECTOR).val();

        var expectedDate = new Date(2014, 1, 6, 23, 31, 25, 330);

        assert.equal(date, dateLocalization.format(expectedDate, "shortdateshorttime"), "string format parsed correct in date format");
        assert.equal($element.dxDateBox("option", "value"), value, "value format is correct");
    } finally {
        Globalize.locale(originalCulture);
    }
});
