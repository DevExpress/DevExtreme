"use strict";

var $ = require("jquery"),
    typeUtils = require("core/utils/type");

QUnit.module('Type checking');

QUnit.test('type method', function(assert) {
    var element = $("#qunit-fixture").html('"<div id="widget"></div>"');

    assert.strictEqual(typeUtils.type(0), 'number', 'number');
    assert.strictEqual(typeUtils.type(null), 'null', 'null');
    assert.strictEqual(typeUtils.type(undefined), 'undefined', 'undefined');
    assert.strictEqual(typeUtils.type(new Date()), 'date', 'date');
    assert.strictEqual(typeUtils.type({}), 'object', 'object');
    assert.strictEqual(typeUtils.type([]), 'array', 'array');
    assert.strictEqual(typeUtils.type(function() { }), 'function', 'function');
    assert.strictEqual(typeUtils.type(element[0].firstElementChild), 'object', 'HTMLDivElement');
});

QUnit.test('isString', function(assert) {
    assert.strictEqual(typeUtils.isString(''), true, 'empty string');
    assert.strictEqual(typeUtils.isString('string'), true, 'string');

    assert.strictEqual(typeUtils.isString(12), false, 'number');
    assert.strictEqual(typeUtils.isString(new Date()), false, 'date');
    assert.strictEqual(typeUtils.isString([]), false, 'array');
    assert.strictEqual(typeUtils.isString({}), false, 'object');
    assert.strictEqual(typeUtils.isString(function() { }), false, 'function');
});

QUnit.test('isNumeric', function(assert) {
    assert.strictEqual(typeUtils.isNumeric(0), true, 'zero');
    assert.strictEqual(typeUtils.isNumeric(-10), true, 'non zero');
    assert.strictEqual(typeUtils.isNumeric('1'), true, 'number string');

    assert.strictEqual(typeUtils.isNumeric(new Date()), false, 'date');
    assert.strictEqual(typeUtils.isNumeric('test'), false, 'string');
    assert.strictEqual(typeUtils.isNumeric({}), false, 'object');
    assert.strictEqual(typeUtils.isNumeric([]), false, 'array');
    assert.strictEqual(typeUtils.isNumeric(function() { }), false, 'function');
});

QUnit.test('isObject', function(assert) {
    assert.strictEqual(typeUtils.isObject({}), true, 'empty object');
    assert.strictEqual(typeUtils.isObject({ a: 1 }), true, 'object');

    assert.strictEqual(typeUtils.isObject(1), false, 'number');
    assert.strictEqual(typeUtils.isObject('test'), false, 'string');
    assert.strictEqual(typeUtils.isObject([]), false, 'array');
    assert.strictEqual(typeUtils.isObject(new Date()), false, 'date');
    assert.strictEqual(typeUtils.isObject(function() { }), false, 'function');
});

QUnit.test('isPlainObject', function(assert) {
    var testFunction = function() {
        return "test";
    };

    assert.strictEqual(typeUtils.isPlainObject({}), true, 'object is plain');
    assert.strictEqual(typeUtils.isPlainObject(new Object({})), true, 'object is plain');

    assert.strictEqual(typeUtils.isPlainObject(new testFunction()), false, 'function is not plain object');
    assert.strictEqual(typeUtils.isPlainObject([]), false, 'array is not plain object');
    assert.strictEqual(typeUtils.isPlainObject(1), false, 'number is not plain object');
    assert.strictEqual(typeUtils.isPlainObject('s'), false, 'string is not plain object');
    assert.strictEqual(typeUtils.isPlainObject(new Date()), false, 'date is not plain object');
});
