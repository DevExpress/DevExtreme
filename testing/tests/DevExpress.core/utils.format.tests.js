"use strict";

var generateNumberParser = require("core/utils/number_parser_generator").generateNumberParser;
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

    assert.strictEqual(parser("0"), 0, "parse zero number");
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
    assert.strictEqual(parser("1234"), null, "parse number with 4 digits without separator");
    assert.strictEqual(parser("1,234"), 1234, "parse number with 4 digits with separator");
    assert.strictEqual(parser("01,234"), null, "parse number with 5 digits with separator with leading zero");
    assert.strictEqual(parser("1 234"), null, "parse number with 4 digits with wrong separator");
    assert.strictEqual(parser("12,34"), null, "parse number with 4 digits with wrong separator position");
    assert.strictEqual(parser("12,34"), null, "parse number with 4 digits with wrong separator position");
    assert.strictEqual(parser("12,345,678"), 12345678, "parse number with 8 digits with 2 separators");
});

QUnit.test("float parser with non-required digits", function(assert) {
    var parser = generateNumberParser("#.##");

    assert.strictEqual(parser("0"), 0, "parse zero number");
    assert.strictEqual(parser("0."), 0, "parse zero with point");
    assert.strictEqual(parser("0.1"), 0.1, "parse zero with 1 fraction digit");

    assert.strictEqual(parser("0.12"), 0.12, "parse zero with 2 fraction digit");
    assert.strictEqual(parser("0.123"), null, "parse zero with 3 fraction digit");
    assert.strictEqual(parser("123"), 123, "parse small number");
    assert.strictEqual(parser("123456789"), 123456789, "parse large number");
    assert.strictEqual(parser("-123"), -123, "parse negative number");

    assert.strictEqual(parser(""), null, "parse empty string");
    assert.strictEqual(parser("123456789012345678901234567890"), null, "parse number larger then max int");
    assert.strictEqual(parser("12345.67"), 12345.67, "parse float number");
});

QUnit.test("float parser with required digits", function(assert) {
    var parser = generateNumberParser("#.00");

    assert.strictEqual(parser("0"), null, "parse zero number");
    assert.strictEqual(parser("0.00"), 0, "parse zero with 2 float digits");
    assert.strictEqual(parser("0.12"), 0.12, "parse number with 2 fraction digit");
    assert.strictEqual(parser("0.123"), null, "parse number with 3 fraction digit");
    assert.strictEqual(parser(".12"), 0.12, "parse number without leading zero and with 2 fraction digit");
    assert.strictEqual(parser("123.45"), 123.45, "parse number with integer part and with 2 fraction digit");
});

QUnit.test("float parser with required and non-required digits", function(assert) {
    var parser = generateNumberParser("#.0##");

    assert.strictEqual(parser("0"), null, "parse zero number");
    assert.strictEqual(parser("0.0"), 0, "parse zero with 1 float digits");
    assert.strictEqual(parser("0.1"), 0.1, "parse number with 1 float digits");
    assert.strictEqual(parser("0.12"), 0.12, "parse number with 2 fraction digit");
    assert.strictEqual(parser("0.123"), 0.123, "parse number with 3 fraction digit");
    assert.strictEqual(parser("0.1234"), null, "parse number with 4 fraction digit");
    assert.strictEqual(parser(".12"), 0.12, "parse number without leading zero and with 2 fraction digit");
    assert.strictEqual(parser("123.45"), 123.45, "parse number with integer part and with 2 fraction digit");
});

QUnit.test("different positive and negative parsing", function(assert) {
    var parser = generateNumberParser("#.##;(#.##)");

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
    var parser = generateNumberParser("#.0#%");

    assert.strictEqual(parser("10.15%"), 0.1015, "parse float number with 2 digits");
    assert.strictEqual(parser("10.0%"), 0.1, "parse float number with 1 digit");
    assert.strictEqual(parser("10%"), null, "value without float part should be incorrect");
    assert.strictEqual(parser("-10.15%"), -0.1015, "parse negative float number with 2 digits");
    assert.strictEqual(parser("-10.0%"), -0.1, "parse negative float number with 1 digit");
    assert.strictEqual(parser("-10%"), null, "negative value without float part should be incorrect");
});
