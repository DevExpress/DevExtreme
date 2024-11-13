const $ = require('jquery');
const typeUtils = require('core/utils/type');
const Deferred = require('core/utils/deferred').Deferred;
const renderer = require('core/renderer');
const eventsEngine = require('common/core/events/core/events_engine');

QUnit.module('Type checking');

QUnit.test('type method', function(assert) {
    const element = $('#qunit-fixture').html('"<div id="widget"></div>"');
    const origObjectToString = Object.prototype.toString;

    assert.strictEqual(typeUtils.type(0), 'number', 'number');
    assert.strictEqual(typeUtils.type(null), 'null', 'null');
    assert.strictEqual(typeUtils.type(undefined), 'undefined', 'undefined');
    assert.strictEqual(typeUtils.type(new Date()), 'date', 'date');
    assert.strictEqual(typeUtils.type({}), 'object', 'object');
    assert.strictEqual(typeUtils.type([]), 'array', 'array');
    assert.strictEqual(typeUtils.type(function() { }), 'function', 'function');
    assert.strictEqual(typeUtils.type(element[0].firstElementChild), 'object', 'HTMLDivElement');

    /* eslint-disable */
    Object.prototype.toString = (obj) => origObjectToString(obj === null ? top : obj); // T1150251

    assert.strictEqual(typeUtils.type(null), 'null', 'null');

    Object.prototype.toString = origObjectToString;
    /* eslint-enable */
});

QUnit.test('isDefined', function(assert) {
    assert.strictEqual(typeUtils.isDefined(0), true, 'zero number');
    assert.strictEqual(typeUtils.isDefined(1), true, 'number');
    assert.strictEqual(typeUtils.isDefined(''), true, 'empty string');
    assert.strictEqual(typeUtils.isDefined('string'), true, 'string');
    assert.strictEqual(typeUtils.isDefined(new Date()), true, 'date');
    assert.strictEqual(typeUtils.isDefined({}), true, 'empty object');
    assert.strictEqual(typeUtils.isDefined({ a: 1 }), true, 'object');
    assert.strictEqual(typeUtils.isDefined([]), true, 'empty array');
    assert.strictEqual(typeUtils.isDefined(['a', 1]), true, 'array');
    assert.strictEqual(typeUtils.isDefined(function() { }), true, 'function');

    assert.strictEqual(typeUtils.isDefined(null), false, 'null');
    assert.strictEqual(typeUtils.isDefined(undefined), false, 'undefined');
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

QUnit.test('isDate', function(assert) {
    assert.strictEqual(typeUtils.isDate(new Date()), true, 'date');

    assert.strictEqual(typeUtils.isDate({}), false, 'object');
    assert.strictEqual(typeUtils.isDate([]), false, 'array');
    assert.strictEqual(typeUtils.isDate(1), false, 'number');
    assert.strictEqual(typeUtils.isDate('s'), false, 'string');
    assert.strictEqual(typeUtils.isDate(function() { }), false, 'function');
});

QUnit.test('isFunction', function(assert) {
    assert.strictEqual(typeUtils.isFunction(function() { }), true, 'function');

    assert.strictEqual(typeUtils.isFunction({}), false, 'object');
    assert.strictEqual(typeUtils.isFunction([]), false, 'array');
    assert.strictEqual(typeUtils.isFunction(1), false, 'number');
    assert.strictEqual(typeUtils.isFunction('s'), false, 'string');
    assert.strictEqual(typeUtils.isFunction(new Date()), false, 'date');
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
    const testFunction = function() {
        return 'test';
    };

    const dxEvent = eventsEngine.Event('testevent');

    assert.strictEqual(typeUtils.isPlainObject({}), true, 'object is plain');
    assert.strictEqual(typeUtils.isPlainObject(new Object({})), true, 'object is plain');
    assert.strictEqual(typeUtils.isPlainObject(Object.create(null)), true, 'object without prototype is plain object');

    assert.strictEqual(typeUtils.isPlainObject(new testFunction()), false, 'function is not plain object');
    assert.strictEqual(typeUtils.isPlainObject([]), false, 'array is not plain object');
    assert.strictEqual(typeUtils.isPlainObject(1), false, 'number is not plain object');
    assert.strictEqual(typeUtils.isPlainObject('s'), false, 'string is not plain object');
    assert.strictEqual(typeUtils.isPlainObject(new Date()), false, 'date is not plain object');
    assert.strictEqual(typeUtils.isPlainObject($.Event), false, '$.Event is not plain object');
    assert.strictEqual(typeUtils.isPlainObject(dxEvent), false, 'dxEvent is not plain object');
});

QUnit.test('isRenderer', function(assert) {
    assert.strictEqual(typeUtils.isRenderer($('body')), true, 'jQuery is renderer');
    assert.strictEqual(typeUtils.isRenderer(renderer('body')), true, 'renderer is renderer');
    assert.strictEqual(typeUtils.isRenderer(document.getElementsByTagName('body')), false, 'HTMLCollection is not renderer');
    assert.strictEqual(typeUtils.isRenderer(document.getElementsByTagName('body')[0]), false, 'HTMLElement is not renderer');
    assert.strictEqual(typeUtils.isRenderer(document), false, 'document is not renderer');
    assert.strictEqual(typeUtils.isRenderer({}), false, 'Object is not renderer');
});

QUnit.test('isDeferred', function(assert) {
    assert.strictEqual(typeUtils.isDeferred(new Deferred()), true, 'Deferred');
    assert.strictEqual(typeUtils.isDeferred({ done: function() {} }), false, 'Deferred should have fail method');
    assert.strictEqual(typeUtils.isDeferred({ fail: function() {} }), false, 'Deferred should have done method');
});

QUnit.test('isPromise', function(assert) {
    assert.strictEqual(typeUtils.isPromise(Promise.resolve()), true, 'native Promise');
    assert.strictEqual(typeUtils.isPromise({ then: function() {} }), true, 'thenable is Promise');
    assert.strictEqual(typeUtils.isPromise({ then: 1 }), false, 'object with property \'then\' isn\'t Promise');
});

QUnit.test('isEvent', function(assert) {
    assert.strictEqual(typeUtils.isEvent($('body')), false, 'body is not event');
    assert.strictEqual(typeUtils.isEvent(window), false, 'window is not event');
    assert.strictEqual(typeUtils.isEvent(undefined), false, 'undefined is not event');
    assert.strictEqual(typeUtils.isEvent($.Event('dxpointerdown')), true, 'dxpointerdown event is event');
});
