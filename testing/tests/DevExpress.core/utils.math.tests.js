"use strict";

var mathUtils = require("core/utils/math");

QUnit.test("fitIntoRange", function(assert) {
    var value = 10,
        min = 5,
        max = 15;

    assert.equal(mathUtils.fitIntoRange(value, min, max), 10, "Returned value is right");
});

QUnit.test("fitIntoRange, when value < min", function(assert) {
    var value = 3,
        min = 5,
        max = 15;

    assert.equal(mathUtils.fitIntoRange(value, min, max), 5, "Returned value is right");
});

QUnit.test("fitIntoRange, when value > max", function(assert) {
    var value = 20,
        min = 5,
        max = 15;

    assert.equal(mathUtils.fitIntoRange(value, min, max), 15, "Returned value is right");
});

QUnit.test("fitIntoRange, when value < min, max = undefined", function(assert) {
    var value = 3,
        min = 5;

    assert.equal(mathUtils.fitIntoRange(value, min, undefined), 5, "Returned value is right");
});

QUnit.test("fitIntoRange, when value > max, min = undefined", function(assert) {
    var value = 15,
        max = 10;

    assert.equal(mathUtils.fitIntoRange(value, undefined, max), 10, "Returned value is right");
});

QUnit.test("fitIntoRange, when min = 0", function(assert) {
    var value = -5,
        min = 0,
        max = 15;

    assert.equal(mathUtils.fitIntoRange(value, min, max), 0, "Returned value is right");
});

QUnit.test("fitIntoRange, when max = 0", function(assert) {
    var value = 5,
        min = -10,
        max = 0;

    assert.equal(mathUtils.fitIntoRange(value, min, max), 0, "Returned value is right");
});


