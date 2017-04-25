"use strict";

var $ = require("jquery"),
    resizeCallbacks = require("core/utils/window").resizeCallbacks;

QUnit.module('resizeCallbacks', {
    beforeEach: function() {
        var clock = sinon.useFakeTimers();
        this.clock = clock;

        this.__width = $.fn.width;
        this.__height = $.fn.height;
        var test = this;
        test.width = 400;
        test.height = 300;
        $.fn.width = function() { return test.width; };
        $.fn.height = function() { return test.height; };
        this.callbacks = resizeCallbacks;
        var $window = $(window);
        this.triggerResize = function() {
            if(!arguments.length || arguments[0]) {
                ++test.width;
                ++test.height;
            }
            $window.trigger('resize');
            clock.tick(1);
        };
        this.callbacks.add(function() { });
        this.triggerResize();   //  to reset size cache
    },
    afterEach: function() {
        $.fn.width = this.__width;
        $.fn.height = this.__height;
        delete this.__width;
        delete this.__height;
        delete this.callbacks;
        this.triggerResize();   //  to reset size cache
        delete this.triggerResize;
        this.clock.restore();
    }
});

QUnit.test('Callback is called on window resize', function(assert) {
    var called = false;
    this.callbacks.add(function() {
        called = true;
    });

    this.triggerResize();

    assert.ok(called, 'callback is called');
});

QUnit.test('Callback is called for each resize for multiple resizes', function(assert) {
    var callCount = 0;
    this.callbacks.add(function() {
        ++callCount;
    });

    this.triggerResize();
    this.triggerResize();
    this.triggerResize();

    assert.strictEqual(callCount, 3, 'callback is called 3 times');
});

QUnit.test('Callback is not called if size is not changed', function(assert) {
    var called = false;
    this.callbacks.add(function() {
        called = true;
    });

    this.triggerResize(false);

    assert.ok(!called, 'callback is not called');
});

QUnit.test('add', function(assert) {
    var called1 = false,
        called2 = false,
        called3 = false;
    this.callbacks.add(function() {
        called1 = true;
    }).add(function() {
        called2 = true;
    }).add(function() {
        called3 = true;
    });

    this.triggerResize();

    assert.ok(called1, 'callback1 is called');
    assert.ok(called2, 'callback2 is called');
    assert.ok(called3, 'callback3 is called');
});

QUnit.test('remove', function(assert) {
    var callCount1 = 0,
        callCount2 = 0;
    var callback1 = function() { ++callCount1; };
    var callback2 = function() { ++callCount2; };
    this.callbacks.add(callback1).add(callback2);

    this.triggerResize();
    this.callbacks.remove(callback1);
    this.triggerResize();

    assert.strictEqual(callCount1, 1, 'callback1 is called 1 time');
    assert.strictEqual(callCount2, 2, 'callback2 is called 2 times');
});

QUnit.test('has', function(assert) {
    var callback1 = function() { };
    var callback2 = function() { };
    this.callbacks.add(callback1).add(callback2);

    assert.ok(this.callbacks.has(callback1), 'has callback1');
    assert.ok(this.callbacks.has(callback2), 'has callback2');

    this.callbacks.remove(callback1);
    assert.ok(!this.callbacks.has(callback1), 'does not have callback1');
    assert.ok(this.callbacks.has(callback2), 'has callback2');

    this.callbacks.remove(callback2);
    assert.ok(!this.callbacks.has(callback1), 'does not have callback1');
    assert.ok(!this.callbacks.has(callback2), 'does not have callback2');
});

QUnit.test('add - one callback several times', function(assert) {
    var callCount = 0;
    var callback = function() { ++callCount; };

    this.callbacks.add(callback).add(callback).add(callback);
    this.triggerResize();

    assert.strictEqual(callCount, 3, 'callback is called 3 times');
});

QUnit.test('remove - one callback several times', function(assert) {
    var callCount = 0;
    var callback = function() { ++callCount; };
    this.callbacks.add(callback);

    this.callbacks.remove(callback).remove(callback).remove(callback);
    this.triggerResize();

    assert.strictEqual(callCount, 0, 'callback is not called');
});

QUnit.test('callbacks should be fired with changed dimensions', function(assert) {
    var callback = sinon.spy();
    this.callbacks.add(callback);

    callback.reset();
    this.width = 500;
    this.triggerResize(false);

    assert.ok(callback.calledWith('width'), 'callback is called for width only');

    callback.reset();
    this.height = 500;
    this.triggerResize(false);

    assert.ok(callback.calledWith('height'), 'callback is called for height only');
});
