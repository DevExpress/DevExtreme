"use strict";

var generateNumberParser = require("core/utils/number_parser_generator").generateNumberParser;
var generateNumberFormat = require("core/utils/number_parser_generator").generateNumberFormatter;
var generateDateParser = require("core/utils/date_parser_generator").generateDateParser;

QUnit.module("date parser");

QUnit.test("parse dd/MM/yyyy format", function(assert) {
    var parser = generateDateParser("dd/MM/yyyy"),
        date = new Date(2017, 8, 22);

    assert.deepEqual(parser("22/09/2017"), date, "parse correct date string");
    assert.deepEqual(parser(""), null, "parse empty string");
    assert.deepEqual(parser("22:09:2017"), null, "parse with wrong separators");
    assert.deepEqual(parser("22/9/2017"), null, "parse with wrong short month");
    assert.deepEqual(parser("09/22/2017"), null, "parse with switched month and day");
});

QUnit.module("number parser");

QUnit.test("integer format parser with non-required digits", function(assert) {
    var parser = generateNumberParser("#");

    assert.strictEqual(parser("0"), null, "parse zero number");
    assert.strictEqual(parser("00"), null, "parse zero number with 2 digits");
    assert.strictEqual(parser("123"), 123, "parse small number");
    assert.strictEqual(parser("123456789"), 123456789, "parse large number");
    assert.strictEqual(parser("12,345"), null, "parse number with group separators");
    assert.strictEqual(parser("-123"), -123, "parse negative number");
    assert.strictEqual(parser("+123"), null, "parse positive number");
    assert.strictEqual(parser(""), null, "parse empty string");
    assert.strictEqual(parser("123456789012345678901234567890"), null, "parse number larger then max int");
    assert.strictEqual(parser("1245.67"), null, "parse float number");
});

QUnit.test("integer format parser with required digits", function(assert) {
    var parser = generateNumberParser("000");

    assert.strictEqual(parser("0"), null, "parse zero number with 1 digits");
    assert.strictEqual(parser("000"), 0, "parse zero number with 3 digits");
    assert.strictEqual(parser("123"), 123, "parse correct number");
    assert.strictEqual(parser("-123"), -123, "parse correct negative number");
    assert.strictEqual(parser("1234"), null, "parse with incorrect count of widgets");
});

QUnit.test("integer format parser with required and non-required digits", function(assert) {
    var parser = generateNumberParser("#000");

    assert.strictEqual(parser("0"), null, "parse zero number with 1 digits");
    assert.strictEqual(parser("000"), 0, "parse zero number with 3 digits");
    assert.strictEqual(parser("12"), null, "parse number with 2 digits");
    assert.strictEqual(parser("123"), 123, "parse number with 3 digits");
    assert.strictEqual(parser("1234"), 1234, "parse number with 4 digits");
    assert.strictEqual(parser("12345"), 12345, "parse number with 5 digits");
});

QUnit.test("integer format parser with group separator", function(assert) {
    var parser = generateNumberParser("#,##0");

    assert.strictEqual(parser("0"), 0, "parse zero number with 1 digits");
    assert.strictEqual(parser("000"), null, "parse zero number with 3 digits");
    assert.strictEqual(parser("123"), 123, "parse number with 3 digits");
    assert.strictEqual(parser("012"), null, "parse number with 3 digits with leading zero");
    assert.strictEqual(parser("1234"), 1234, "parse number with 4 digits without separator");
    assert.strictEqual(parser("1,234"), 1234, "parse number with 4 digits with separator");
    assert.strictEqual(parser("01,234"), null, "parse number with 5 digits with separator with leading zero");
    assert.strictEqual(parser("1 234"), null, "parse number with 4 digits with wrong separator");
    assert.strictEqual(parser("12,34"), 1234, "parse number with 4 digits with wrong separator position");
    assert.strictEqual(parser("12,345,678"), 12345678, "parse number with 8 digits with 2 separators");
});

QUnit.test("integer format parser with complex groups", function(assert) {
    var parser = generateNumberParser("#,##,##0");

    assert.strictEqual(parser("0"), 0, "parse zero number with 1 digits");
    assert.strictEqual(parser("123"), 123, "parse number with 3 digits");
    assert.strictEqual(parser("1234"), 1234, "parse number with 4 digits without group separator");
    assert.strictEqual(parser("1,234"), 1234, "parse number with 4 digits with group separator");
    assert.strictEqual(parser("12,34,567"), 1234567, "parse number with 7 digits with 2 group separators");
});

QUnit.test("float parser with non-required digits", function(assert) {
    var parser = generateNumberParser("#.##");

    assert.strictEqual(parser("0"), null, "parse zero number");
    assert.strictEqual(parser("."), 0, "parse zero with point");
    assert.strictEqual(parser(".1"), 0.1, "parse zero with 1 fraction digit");

    assert.strictEqual(parser(".12"), 0.12, "parse zero with 2 fraction digit");
    assert.strictEqual(parser(".123"), null, "parse zero with 3 fraction digit");
    assert.strictEqual(parser("123"), 123, "parse small number");
    assert.strictEqual(parser("123456789"), 123456789, "parse large number");
    assert.strictEqual(parser("-123"), -123, "parse negative number");

    assert.strictEqual(parser(""), null, "parse empty string");
    assert.strictEqual(parser("123456789012345678901234567890"), null, "parse number larger then max int");
    assert.strictEqual(parser("12345.67"), 12345.67, "parse float number");
});

QUnit.test("float parser with required digits", function(assert) {
    var parser = generateNumberParser("#0.00");

    assert.strictEqual(parser("0"), null, "parse zero number");
    assert.strictEqual(parser("0.00"), 0, "parse zero with 2 float digits");
    assert.strictEqual(parser("0.12"), 0.12, "parse number with 2 fraction digit");
    assert.strictEqual(parser("0.123"), null, "parse number with 3 fraction digit");
    assert.strictEqual(parser(".12"), null, "parse number without leading zero and with 2 fraction digit");
    assert.strictEqual(parser("123.45"), 123.45, "parse number with integer part and with 2 fraction digit");
    assert.strictEqual(parser("123..45"), null, "value with extra points should be invalid");
});

QUnit.test("float parser with required and non-required digits", function(assert) {
    var parser = generateNumberParser("#0.0##");

    assert.strictEqual(parser("0"), null, "parse zero number");
    assert.strictEqual(parser("0.0"), 0, "parse zero with 1 float digits");
    assert.strictEqual(parser("0.1"), 0.1, "parse number with 1 float digits");
    assert.strictEqual(parser("0.12"), 0.12, "parse number with 2 fraction digit");
    assert.strictEqual(parser("0.123"), 0.123, "parse number with 3 fraction digit");
    assert.strictEqual(parser("0.1234"), null, "parse number with 4 fraction digit");
    assert.strictEqual(parser(".12"), null, "parse number without leading zero and with 2 fraction digit");
    assert.strictEqual(parser("123.45"), 123.45, "parse number with integer part and with 2 fraction digit");
});

QUnit.test("different positive and negative parsing", function(assert) {
    var parser = generateNumberParser("#0.##;(#0.##)");

    assert.strictEqual(parser("0"), 0, "parse zero number");
    assert.strictEqual(parser("(5)"), -5, "parse negative integer");
    assert.strictEqual(parser("5"), 5, "parse positive integer");
    assert.strictEqual(parser("(15.1)"), -15.1, "parse negative float");
    assert.strictEqual(parser("15.17"), 15.17, "parse positive float");
    assert.strictEqual(parser("(15.175)"), null, "parse negative float with overflow");
    assert.strictEqual(parser("15.175"), null, "parse positive float with overflow");
    assert.strictEqual(parser("-15.17"), null, "default negative format should be invalid");
});

QUnit.test("percent format parsing", function(assert) {
    var parser = generateNumberParser("#0%");

    assert.strictEqual(parser("0%"), 0, "zero value");
    assert.strictEqual(parser("1%"), 0.01, "1 value");
    assert.strictEqual(parser("10%"), 0.1, "10 value");
    assert.strictEqual(parser("100%"), 1, "100 value");
});

QUnit.test("percent format parsing with float part", function(assert) {
    var parser = generateNumberParser("#.0#%");

    assert.strictEqual(parser("10.15%"), 0.1015, "parse float number with 2 digits");
    assert.strictEqual(parser("10.0%"), 0.1, "parse float number with 1 digit");
    assert.strictEqual(parser("10%"), null, "value without float part should be incorrect");
    assert.strictEqual(parser("-10.15%"), -0.1015, "parse negative float number with 2 digits");
    assert.strictEqual(parser("-10.0%"), -0.1, "parse negative float number with 1 digit");
    assert.strictEqual(parser("-10%"), null, "negative value without float part should be incorrect");
});

QUnit.module("number formatter");

QUnit.test("integer with non-required digits", function(assert) {
    var formatter = generateNumberFormat("#");

    assert.strictEqual(formatter(null), "", "format an empty value");
    assert.strictEqual(formatter(NaN), "", "NaN value should not be formatted");
    assert.strictEqual(formatter(0), "", "format zero");
    assert.strictEqual(formatter(10), "10", "format integer wkth zero at the end");
    assert.strictEqual(formatter(123), "123", "format integer");
    assert.strictEqual(formatter(123456), "123456", "format large integer");
    assert.strictEqual(formatter(1E20), "100000000000000000000", "format very large integer");
});

QUnit.test("integer with required digits", function(assert) {
    var formatter = generateNumberFormat("000");

    assert.strictEqual(formatter(null), "", "format an empty value");
    assert.strictEqual(formatter(NaN), "", "NaN value should not be formatted");
    assert.strictEqual(formatter(0), "000", "format zero");
    assert.strictEqual(formatter(1), "001", "format integer with 1 digit");
    assert.strictEqual(formatter(10), "010", "format integer with zero at the end");
    assert.strictEqual(formatter(123), "123", "format integer");
    assert.strictEqual(formatter(123456), "456", "format large integer");
});

QUnit.test("float with precision formatting", function(assert) {
    var formatter = generateNumberFormat("#.00");

    assert.strictEqual(formatter(null), "", "format an empty value");
    assert.strictEqual(formatter(NaN), "", "NaN value should not be formatted");
    assert.strictEqual(formatter(0), ".00", "format zero");
    assert.strictEqual(formatter(0.123), ".12", "format value without integer");
    assert.strictEqual(formatter(123), "123.00", "format integer");
    assert.strictEqual(formatter(123.05), "123.05", "format rounded float with zero");
    assert.strictEqual(formatter(123.5), "123.50", "format rounded float");
    assert.strictEqual(formatter(123.57), "123.57", "format float");
    assert.strictEqual(formatter(123.576), "123.58", "rounding float");
    assert.strictEqual(formatter(123.573), "123.57", "rounding float back");
    assert.strictEqual(formatter(-123.57), "-123.57", "format negative float");
});

QUnit.test("float with precision formatting and required integer digit", function(assert) {
    var formatter = generateNumberFormat("#0.00");

    assert.strictEqual(formatter(5), "5.00", "format integer");
    assert.strictEqual(formatter(0), "0.00", "format zero");
    assert.strictEqual(formatter(0.123), "0.12", "format float");
});

QUnit.test("float with required an non-required digits in float part", function(assert) {
    var formatter = generateNumberFormat("#0.0#");

    assert.strictEqual(formatter(1), "1.0", "format integer");
    assert.strictEqual(formatter(1.2), "1.2", "format float with 1 digit");
    assert.strictEqual(formatter(1.23), "1.23", "format float with 2 digits");
    assert.strictEqual(formatter(1.239), "1.24", "format float with 3 digits and rounding");
});

QUnit.test("different positive and negative formatting", function(assert) {
    var formatter = generateNumberFormat("#0.000;(#0.000)");

    assert.strictEqual(formatter(0), "0.000", "format zero");
    assert.strictEqual(formatter(-0), "(0.000)", "format negative zero");
    assert.strictEqual(formatter(123), "123.000", "format integer");
    assert.strictEqual(formatter(123.57), "123.570", "format float");
    assert.strictEqual(formatter(123.576), "123.576", "format float with 3 digits after point");
    assert.strictEqual(formatter(-123.57), "(123.570)", "format negative float");
});

QUnit.test("escaping format", function(assert) {
    var formatter = generateNumberFormat("#'x #0% x'");

    assert.strictEqual(formatter(15), "15x #0% x", "special chars was escaped");
});

QUnit.test("percent formatting with leading zero", function(assert) {
    var formatter = generateNumberFormat("#0.#%;(#0.#%)");

    assert.strictEqual(formatter(0), "0%", "format zero");
    assert.strictEqual(formatter(0.1), "10%", "format less than 100");
    assert.strictEqual(formatter(2.578), "257.8%", "format more than 100");
    assert.strictEqual(formatter(2.5785), "257.9%", "rounding percents");
    assert.strictEqual(formatter(-0.45), "(45%)", "format negative value");
});

QUnit.test("escaped percent formatting", function(assert) {
    var formatter = generateNumberFormat("#0.#'%'");
    assert.strictEqual(formatter(0.5), "0.5%", "percent was escaped");

    formatter = generateNumberFormat("#0.#'x % x'");
    assert.strictEqual(formatter(0.5), "0.5x % x", "percent with text was escaped");
});

QUnit.test("simple group", function(assert) {
    var formatter = generateNumberFormat("#,##0");

    assert.strictEqual(formatter(123), "123", "format integer without groups");
    assert.strictEqual(formatter(1234), "1,234", "format integer with 1 group");
    assert.strictEqual(formatter(123456789), "123,456,789", "format integer with 2 groups");
});

QUnit.test("complex group", function(assert) {
    var formatter = generateNumberFormat("#,##,##0");

    assert.strictEqual(formatter(123), "123", "format integer without groups");
    assert.strictEqual(formatter(1234), "1,234", "format integer with 1 group");
    assert.strictEqual(formatter(123456789), "12,34,56,789", "format integer with 3 groups");
});
