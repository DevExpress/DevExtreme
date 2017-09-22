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

QUnit.test("simple format parser", function(assert) {
    var parser = generateNumberParser("#");

    assert.strictEqual(parser("0"), 0, "parse zero number");
    assert.strictEqual(parser("123"), 123, "parse small number");
    assert.strictEqual(parser("123456789"), 123456789, "parse large number");
    assert.strictEqual(parser("-123"), -123, "parse negative number");
    assert.strictEqual(parser("+123"), null, "parse positive number");

    assert.strictEqual(parser(""), null, "parse empty string");
    assert.strictEqual(parser("123456789012345678901234567890"), null, "parse number larger then max int");
    assert.strictEqual(parser("1245.67"), null, "parse float number");
});

QUnit.test("float parser", function(assert) {
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
