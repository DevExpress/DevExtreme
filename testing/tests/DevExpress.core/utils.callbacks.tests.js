const Callbacks = require('core/utils/callbacks');

QUnit.module('Methods', {
    beforeEach: function() {
        this.Callbacks = Callbacks();
    },
    afterEach: function() {
        this.Callbacks.empty();
    }
});

QUnit.test('Call all of the Callbacks with the argument', function(assert) {
    // arrange
    let callBack1;
    let callBack2;

    this.Callbacks.add(function(param) {
        callBack1 = true;

        // assert
        assert.deepEqual(param, { param: 'test' }, 'parameter of the first callback');
    });
    this.Callbacks.add(function(param) {
        callBack2 = true;

        // assert
        assert.ok(callBack1, 'callBack1');
        assert.deepEqual(param, { param: 'test' }, 'parameter of the second callback');
    });

    // act
    this.Callbacks.fire({ param: 'test' });

    // assert
    assert.ok(callBack2, 'callBack1');
});

QUnit.test('Fired method', function(assert) {
    // arrange

    this.Callbacks.add(function() {});

    // assert
    assert.notOk(this.Callbacks.fired(), 'Callback not fired yet');

    // act
    this.Callbacks.fire();

    // assert
    assert.ok(this.Callbacks.fired(), 'Callback fired');
});

QUnit.test('Call all Callbacks in a list with the given context', function(assert) {
    // arrange
    const context = {};
    let callBack1;
    let callBack2;

    this.Callbacks.add(function(param) {
        callBack1 = true;

        // assert
        assert.deepEqual(param, { param: 'test' }, 'parameter of the first callback');
        assert.deepEqual(this, context, 'context');
    });
    this.Callbacks.add(function(param) {
        callBack2 = true;

        // assert
        assert.ok(callBack1, 'callBack1');
        assert.deepEqual(param, { param: 'test' }, 'parameter of the second callback');
        assert.deepEqual(this, context, 'context');
    });

    // act
    this.Callbacks.fireWith(context, [{ param: 'test' }]);

    // assert
    assert.ok(callBack2, 'callBack1');
});

QUnit.test('Determine whether callback is in a list', function(assert) {
    // arrange
    const callBack1 = function() {};
    const callBack2 = function() {};

    this.Callbacks.add(callBack1);

    // act, assert
    assert.ok(this.Callbacks.has(callBack1), 'has callBack1');
    assert.ok(!this.Callbacks.has(callBack2), 'not has callBack2');
});

QUnit.test('Remove a callback from a callback list', function(assert) {
    // arrange
    const callBack1 = function() { };
    const callBack2 = function() { };

    this.Callbacks.add(callBack1);
    this.Callbacks.add(callBack2);

    // assert
    assert.ok(this.Callbacks.has(callBack1), 'has callBack1');
    assert.ok(this.Callbacks.has(callBack2), 'has callBack2');

    // act
    this.Callbacks.remove(callBack1);

    // assert
    assert.ok(!this.Callbacks.has(callBack1), 'not has callBack1');
    assert.ok(this.Callbacks.has(callBack2), 'has callBack2');
});

QUnit.test('Remove a callback from a callback list when firing', function(assert) {
    // arrange
    const that = this;
    let callOrder = [];

    const callBack1 = function() {
        callOrder.push(1);
    };
    const callBack3 = function() {
        callOrder.push(3);
    };
    const callBack2 = function() {
        callOrder.push(2);
        that.Callbacks.remove(callBack3);
    };
    const callBack4 = function() {
        callOrder.push(4);
        that.Callbacks.remove(callBack1);
    };
    const callBack5 = function() {
        callOrder.push(5);
        that.Callbacks.remove(callBack5);
        that.Callbacks.fire();
    };
    const callBack6 = function() {
        callOrder.push(6);
    };

    this.Callbacks.add(callBack1);
    this.Callbacks.add(callBack2);
    this.Callbacks.add(callBack3);
    this.Callbacks.add(callBack4);
    this.Callbacks.add(callBack5);
    this.Callbacks.add(callBack6);

    // act
    this.Callbacks.fire();

    // assert
    assert.deepEqual(callOrder, [ 1, 2, 4, 5, 6, 2, 4, 6 ]);

    // arrange
    callOrder = [];

    // act
    this.Callbacks.fire();

    // assert
    assert.deepEqual(callOrder, [ 2, 4, 6 ]);
});

QUnit.test('Remove all of the Callbacks from a list', function(assert) {
    // arrange
    const callBack1 = function() { };
    const callBack2 = function() { };

    this.Callbacks.add(callBack1);
    this.Callbacks.add(callBack2);

    // assert
    assert.ok(this.Callbacks.has(callBack1), 'has callBack1');
    assert.ok(this.Callbacks.has(callBack2), 'has callBack2');

    // act
    this.Callbacks.empty();

    // assert
    assert.ok(!this.Callbacks.has(callBack1), 'not has callBack1');
    assert.ok(!this.Callbacks.has(callBack2), 'not has callBack2');
});

QUnit.test('Base strategy', function(assert) {
    // arrange
    const that = this;
    let firstFire = true;
    const callOrder = [];

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

    // act
    that.Callbacks.fire(1);

    // assert
    assert.deepEqual(callOrder, [
        { callback: 1, params: 1 },
        { callback: 2, params: 1 },
        { callback: 3, params: 1 },
        { callback: 1, params: 2 },
        { callback: 2, params: 2 },
        { callback: 3, params: 2 }
    ]);
});

QUnit.module('Flags', {
    afterEach: function() {
        this.Callbacks.empty();
    }
});

QUnit.test('Sync strategy with one inner fire', function(assert) {
    // arrange
    const that = this;
    let firstFire = true;
    const callOrder = [];

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

    // act
    that.Callbacks.fire(1);

    // assert
    assert.deepEqual(callOrder, [
        { callback: 1, params: 1 },
        { callback: 2, params: 1 },
        { callback: 1, params: 2 },
        { callback: 2, params: 2 },
        { callback: 3, params: 2 },
        { callback: 3, params: 1 }
    ]);
});

// T544647
QUnit.test('Sync strategy with one inner fire in first callback', function(assert) {
    // arrange
    const that = this;
    const callOrder = [];

    this.Callbacks = Callbacks({ syncStrategy: true });

    that.Callbacks.add(function(param) {
        callOrder.push({ callback: 1, params: param });
        if(callOrder.length === 1) {
            that.Callbacks.fire(2);
        }
    });

    that.Callbacks.add(function(param) {
        callOrder.push({ callback: 2, params: param });
    });

    that.Callbacks.add(function(param) {
        callOrder.push({ callback: 3, params: param });
    });

    // act
    that.Callbacks.fire(1);

    // assert
    assert.deepEqual(callOrder, [
        { callback: 1, params: 1 },
        { callback: 1, params: 2 },
        { callback: 2, params: 2 },
        { callback: 3, params: 2 },
        { callback: 2, params: 1 },
        { callback: 3, params: 1 }
    ]);
});

QUnit.test('Sync strategy with two inner fires', function(assert) {
    // arrange
    const that = this;
    let fireCount = 1;
    const callOrder = [];

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

    // act
    that.Callbacks.fire(1);

    // assert
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

QUnit.test('Remove a callback from a callback list when firing for sync strategy', function(assert) {
    // arrange
    const that = this;
    let callOrder = [];

    this.Callbacks = Callbacks({ syncStrategy: true });

    const callBack1 = function() {
        callOrder.push(1);
    };
    const callBack3 = function() {
        callOrder.push(3);
    };
    const callBack2 = function() {
        callOrder.push(2);
        that.Callbacks.remove(callBack3);
    };
    const callBack4 = function() {
        callOrder.push(4);
        that.Callbacks.remove(callBack1);
    };
    const callBack5 = function() {
        callOrder.push(5);
        that.Callbacks.remove(callBack5);
        that.Callbacks.fire();
    };
    const callBack6 = function() {
        callOrder.push(6);
    };

    this.Callbacks.add(callBack1);
    this.Callbacks.add(callBack2);
    this.Callbacks.add(callBack3);
    this.Callbacks.add(callBack4);
    this.Callbacks.add(callBack5);
    this.Callbacks.add(callBack6);

    // act
    this.Callbacks.fire();

    // assert
    assert.deepEqual(callOrder, [ 1, 2, 4, 5, 2, 4, 6, 6 ]);

    // arrange
    callOrder = [];

    // act
    this.Callbacks.fire();

    // assert
    assert.deepEqual(callOrder, [ 2, 4, 6 ]);
});

QUnit.test('StopOnFalse', function(assert) {
    // arrange
    let fireCount = 0;

    this.Callbacks = Callbacks({ stopOnFalse: true });

    this.Callbacks.add(function() {
        fireCount++;

        return false;
    });

    this.Callbacks.add(function() {
        fireCount++;
    });

    // act
    this.Callbacks.fire();

    // assert
    assert.equal(fireCount, 1);
});

QUnit.test('Unique', function(assert) {
    // arrange
    let fireCount = 0;

    this.Callbacks = Callbacks({ unique: true });

    const func = function() {
        fireCount++;
    };

    this.Callbacks.add(func);
    this.Callbacks.add(func);

    // act
    this.Callbacks.fire();

    // assert
    assert.equal(fireCount, 1);
});

