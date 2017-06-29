"use strict";

var Callbacks = require("core/utils/Callbacks");

QUnit.module("Callbacks with flags", {
    beforeEach: function() {
        this.Callbacks = Callbacks({ unique: true, syncStrategy: true });
    },
    afterEach: function() {
        this.Callbacks.empty();
    }
});

QUnit.test("Call all of the Callbacks with the argument", function(assert) {
    //arrange
    var callBack1,
        callBack2;

    this.Callbacks.add(function(param) {
        callBack1 = true;

        //assert
        assert.deepEqual(param, { param: "test" }, "parameter of the first callback");
    });
    this.Callbacks.add(function(param) {
        callBack2 = true;

        //assert
        assert.ok(callBack1, "callBack1");
        assert.deepEqual(param, { param: "test" }, "parameter of the second callback");
    });

    //act
    this.Callbacks.fire({ param: "test" });

    //assert
    assert.ok(callBack2, "callBack1");
});

QUnit.test("Call all Callbacks in a list with the given context", function(assert) {
    //arrange
    var context = {},
        callBack1,
        callBack2;

    this.Callbacks.add(function(param) {
        callBack1 = true;

        //assert
        assert.deepEqual(param, { param: "test" }, "parameter of the first callback");
        assert.deepEqual(this, context, "context");
    });
    this.Callbacks.add(function(param) {
        callBack2 = true;

        //assert
        assert.ok(callBack1, "callBack1");
        assert.deepEqual(param, { param: "test" }, "parameter of the second callback");
        assert.deepEqual(this, context, "context");
    });

    //act
    this.Callbacks.fireWith(context, [{ param: "test" }]);

    //assert
    assert.ok(callBack2, "callBack1");
});

QUnit.test("Determine whether callback is in a list", function(assert) {
    //arrange
    var callBack1 = function() {},
        callBack2 = function() {};

    this.Callbacks.add(callBack1);

    //act, assert
    assert.ok(this.Callbacks.has(callBack1), "has callBack1");
    assert.ok(!this.Callbacks.has(callBack2), "not has callBack2");
});

QUnit.test("Remove a callback from a callback list", function(assert) {
    //arrange
    var callBack1 = function() { },
        callBack2 = function() { };

    this.Callbacks.add(callBack1);
    this.Callbacks.add(callBack2);

    //assert
    assert.ok(this.Callbacks.has(callBack1), "has callBack1");
    assert.ok(this.Callbacks.has(callBack2), "has callBack2");

    //act
    this.Callbacks.remove(callBack1);

    //assert
    assert.ok(!this.Callbacks.has(callBack1), "not has callBack1");
    assert.ok(this.Callbacks.has(callBack2), "has callBack2");
});

QUnit.test("Remove all of the Callbacks from a list", function(assert) {
    //arrange
    var callBack1 = function() { },
        callBack2 = function() { };

    this.Callbacks.add(callBack1);
    this.Callbacks.add(callBack2);

    //assert
    assert.ok(this.Callbacks.has(callBack1), "has callBack1");
    assert.ok(this.Callbacks.has(callBack2), "has callBack2");

    //act
    this.Callbacks.empty();

    //assert
    assert.ok(!this.Callbacks.has(callBack1), "not has callBack1");
    assert.ok(!this.Callbacks.has(callBack2), "not has callBack2");
});

QUnit.test("Remove all of the Callbacks from a list", function(assert) {
    //arrange
    var callBack1 = function() { },
        callBack2 = function() { };

    this.Callbacks.add(callBack1);
    this.Callbacks.add(callBack2);

    //assert
    assert.ok(this.Callbacks.has(callBack1), "has callBack1");
    assert.ok(this.Callbacks.has(callBack2), "has callBack2");

    //act
    this.Callbacks.empty();

    //assert
    assert.ok(!this.Callbacks.has(callBack1), "not has callBack1");
    assert.ok(!this.Callbacks.has(callBack2), "not has callBack2");
});

// Differences with jquery Callbacks
QUnit.test("Second call all of the Callbacks during the first", function(assert) {
    //arrange
    var that = this,
        callBack1,
        callBack2,
        callBack3;

    that.Callbacks.add(function(param) {
        callBack1 = true;

        //assert
        if(!param) { // first call
            assert.ok(!callBack2, "not called the callback2");
            assert.ok(!callBack3, "not called the callback3");
        } else { // second call
            assert.ok(callBack2, "called the callback2");
            assert.ok(!callBack3, "not called the callback3");
        }
    });

    that.Callbacks.add(function(param) {
        callBack2 = true;

        if(!param) {
            //act
            that.Callbacks.fire({});
        }

        //assert
        assert.ok(callBack1, "called the callback1");

        if(!param) { // first call
            assert.ok(callBack3, "called the callback3");
        } else { // second call
            assert.ok(!callBack3, "not called the callback3");
        }
    });

    that.Callbacks.add(function(param) {
        callBack3 = true;

        //assert
        assert.ok(callBack1, "called the callback1");
        assert.ok(callBack2, "called the callback2");
    });

    //act
    that.Callbacks.fire();

    //assert
    assert.ok(callBack1, "called the callback1");
    assert.ok(callBack2, "called the callback2");
    assert.ok(callBack3, "called the callback3");
});
