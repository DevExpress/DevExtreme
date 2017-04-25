"use strict";

var typeUtils = require("core/utils/type");

QUnit.module('Type checking');

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
