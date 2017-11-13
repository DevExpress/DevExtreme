"use strict";

var numberLocalization = require("localization/number"),
    dateLocalization = require("localization/date");

QUnit.module("Custom month names", {
    beforeEach: function() {
        dateLocalization.inject({
            getMonthNames: function(format, type) {
                if(format === "wide" && type === "standalone") {
                    return ["январь", "февраль", "март"];
                }
                if(format === "wide" && type === "format") {
                    return ["января", "февраля", "марта"];
                }
            }
        });
    },
    afterEach: function() {
        dateLocalization.resetInjection();
    }
});

QUnit.test("format LDML pattern with month name", function(assert) {
    assert.equal(dateLocalization.format(new Date(2015, 2, 1), "d MMMM"), "1 марта");
    assert.equal(dateLocalization.format(new Date(2015, 2, 1), "LLLL y"), "март 2015");
});

QUnit.test("parse LDML pattern with month name", function(assert) {
    assert.deepEqual(dateLocalization.parse("1 марта 2015", "d MMMM y"), new Date(2015, 2, 1));
    assert.deepEqual(dateLocalization.parse("март 2015", "LLLL y"), new Date(2015, 2, 1));
});

QUnit.module("Custom digits", {
    beforeEach: function() {
        numberLocalization.inject({
            format: function(value, format) {
                if(format === "decimal" && value === 90) {
                    return "٩٠";
                }
                return this.callBase.apply(this, arguments);
            }
        });
    },
    afterEach: function() {
        numberLocalization.resetInjection();
    }
});

QUnit.test("format date by LDML pattern", function(assert) {
    var date = new Date(2015, 2, 3, 4, 5, 6, 789);
    assert.equal(dateLocalization.format(date, "dd/MM/yyyy"), "٠٣/٠٣/٢٠١٥");
    assert.equal(dateLocalization.format(date, "HH:mm:ss"), "٠٤:٠٥:٠٦");
    assert.equal(dateLocalization.format(date, "SSS"), "٧٨٩");
});

QUnit.test("format date by predefined format", function(assert) {
    var date = new Date(2015, 2, 3, 4, 5, 6, 789);
    assert.equal(dateLocalization.format(date, "shortDate"), "٣/٣/٢٠١٥");
    assert.equal(dateLocalization.format(date, "millisecond"), "٧٨٩");
});

QUnit.test("parse date by LDML pattern", function(assert) {
    assert.deepEqual(dateLocalization.parse("٠٣/٠٥/٢٠١٥", "dd/MM/yyyy"), new Date(2015, 4, 3));
    assert.deepEqual(dateLocalization.parse("٧٨٩", "SSS").getMilliseconds(), 789);
});

QUnit.test("parse date by predefined format", function(assert) {
    assert.deepEqual(dateLocalization.parse("٠٥/٠٣/٢٠١٥", "shortDate"), new Date(2015, 4, 3));
    assert.deepEqual(dateLocalization.parse("٧٨٩", "millisecond").getMilliseconds(), 789);
});

QUnit.test("format number by LDML pattern", function(assert) {
    assert.equal(numberLocalization.format(1234.5, "#,##0.00"), "١,٢٣٤.٥٠");
});

QUnit.test("parse number by LDML pattern", function(assert) {
    assert.equal(numberLocalization.parse("١,٢٣٤.٥٠", "#,#0.00"), 1234.5);
});
