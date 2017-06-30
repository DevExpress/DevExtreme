"use strict";

var Callbacks = require("core/utils/callbacks");

QUnit.module("Methods", {
    beforeEach: function() {
        this.Callbacks = Callbacks();
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

QUnit.test("Base strategy", function(assert) {
    //arrange
    var that = this,
        firstFire = true,
        callOrder = [];

    that.Callbacks.add(function(param) {
        callOrder.push({ callback: 1, params: param });
    });

    that.Callbacks.add(function(param) {
        callOrder.push({ callback: 2, params: param });

        if(firstFire) {
            firstFire = false;
            that.Callbacks.fire(2);
        }
    });

    that.Callbacks.add(function(param) {
        callOrder.push({ callback: 3, params: param });
    });

    //act
    that.Callbacks.fire(1);

    //assert
    assert.deepEqual(callOrder, [
        { callback: 1, params: 1 },
        { callback: 2, params: 1 },
        { callback: 3, params: 1 },
        { callback: 1, params: 2 },
        { callback: 2, params: 2 },
        { callback: 3, params: 2 }
    ]);
});

QUnit.module("Flags", {
    afterEach: function() {
        this.Callbacks.empty();
    }
});

QUnit.test("Sync strategy with one inner fire", function(assert) {
    //arrange
    var that = this,
        firstFire = true,
        callOrder = [];

    this.Callbacks = Callbacks({ syncStrategy: true });

    that.Callbacks.add(function(param) {
        callOrder.push({ callback: 1, params: param });
    });

    that.Callbacks.add(function(param) {
        callOrder.push({ callback: 2, params: param });

        if(firstFire) {
            firstFire = false;
            that.Callbacks.fire(2);
        }
    });

    that.Callbacks.add(function(param) {
        callOrder.push({ callback: 3, params: param });
    });

    //act
    that.Callbacks.fire(1);

    //assert
    assert.deepEqual(callOrder, [
        { callback: 1, params: 1 },
        { callback: 2, params: 1 },
        { callback: 1, params: 2 },
        { callback: 2, params: 2 },
        { callback: 3, params: 2 },
        { callback: 3, params: 1 }
    ]);
});

QUnit.test("Sync strategy with two inner fires", function(assert) {
    //arrange
    var that = this,
        fireCount = 1,
        callOrder = [];

    this.Callbacks = Callbacks({ syncStrategy: true });

    that.Callbacks.add(function(param) {
        callOrder.push({ callback: 1, params: param });
    });

    that.Callbacks.add(function(param) {
        callOrder.push({ callback: 2, params: param });

        if(fireCount < 3) {
            fireCount++;
            that.Callbacks.fire(fireCount);
        }
    });

    that.Callbacks.add(function(param) {
        callOrder.push({ callback: 3, params: param });
    });

    //act
    that.Callbacks.fire(1);

    //assert
    assert.deepEqual(callOrder, [
        { callback: 1, params: 1 },
        { callback: 2, params: 1 },
        { callback: 1, params: 2 },
        { callback: 2, params: 2 },
        { callback: 1, params: 3 },
        { callback: 2, params: 3 },
        { callback: 3, params: 3 },
        { callback: 3, params: 2 },
        { callback: 3, params: 1 }
    ]);
});

QUnit.test("StopOnFalse", function(assert) {
    //arrange
    var fireCount = 0;

    this.Callbacks = Callbacks({ stopOnFalse: true });

    this.Callbacks.add(function() {
        fireCount++;

        return false;
    });

    this.Callbacks.add(function() {
        fireCount++;
    });

    //act
    this.Callbacks.fire();

    //assert
    assert.equal(fireCount, 1);
});

QUnit.test("Unique", function(assert) {
    //arrange
    var fireCount = 0;

    this.Callbacks = Callbacks({ unique: true });

    var func = function() {
        fireCount++;
    };

    this.Callbacks.add(func);
    this.Callbacks.add(func);

    //act
    this.Callbacks.fire();

    //assert
    assert.equal(fireCount, 1);
});
