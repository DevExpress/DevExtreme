"use strict";

var $ = require("jquery"),
    commonUtils = require("core/utils/common"),
    config = require("core/config");

QUnit.module('Type checking');

QUnit.test('isDefined', function(assert) {
    assert.strictEqual(commonUtils.isDefined(0), true, 'zero number');
    assert.strictEqual(commonUtils.isDefined(1), true, 'number');
    assert.strictEqual(commonUtils.isDefined(''), true, 'empty string');
    assert.strictEqual(commonUtils.isDefined('string'), true, 'string');
    assert.strictEqual(commonUtils.isDefined(new Date()), true, 'date');
    assert.strictEqual(commonUtils.isDefined({}), true, 'empty object');
    assert.strictEqual(commonUtils.isDefined({ a: 1 }), true, 'object');
    assert.strictEqual(commonUtils.isDefined([]), true, 'empty array');
    assert.strictEqual(commonUtils.isDefined(['a', 1]), true, 'array');
    assert.strictEqual(commonUtils.isDefined(function() { }), true, 'function');

    assert.strictEqual(commonUtils.isDefined(null), false, 'null');
    assert.strictEqual(commonUtils.isDefined(undefined), false, 'undefined');
});

QUnit.test('isString', function(assert) {
    assert.strictEqual(commonUtils.isString(''), true, 'empty string');
    assert.strictEqual(commonUtils.isString('string'), true, 'string');

    assert.strictEqual(commonUtils.isString(12), false, 'number');
    assert.strictEqual(commonUtils.isString(new Date()), false, 'date');
    assert.strictEqual(commonUtils.isString([]), false, 'array');
    assert.strictEqual(commonUtils.isString({}), false, 'object');
    assert.strictEqual(commonUtils.isString(function() { }), false, 'function');
});

QUnit.test('isNumber', function(assert) {
    assert.strictEqual(commonUtils.isNumber(0), true, 'zero');
    assert.strictEqual(commonUtils.isNumber(-10), true, 'non zero');
    assert.strictEqual(commonUtils.isNumber('1'), true, 'number string');

    assert.strictEqual(commonUtils.isNumber(new Date()), false, 'date');
    assert.strictEqual(commonUtils.isNumber('test'), false, 'string');
    assert.strictEqual(commonUtils.isNumber({}), false, 'object');
    assert.strictEqual(commonUtils.isNumber([]), false, 'array');
    assert.strictEqual(commonUtils.isNumber(function() { }), false, 'function');
});

QUnit.test('isObject', function(assert) {
    assert.strictEqual(commonUtils.isObject({}), true, 'empty object');
    assert.strictEqual(commonUtils.isObject({ a: 1 }), true, 'object');

    assert.strictEqual(commonUtils.isObject(1), false, 'number');
    assert.strictEqual(commonUtils.isObject('test'), false, 'string');
    assert.strictEqual(commonUtils.isObject([]), false, 'array');
    assert.strictEqual(commonUtils.isObject(new Date()), false, 'date');
    assert.strictEqual(commonUtils.isObject(function() { }), false, 'function');
});

QUnit.test('isDate', function(assert) {
    assert.strictEqual(commonUtils.isDate(new Date()), true, 'date');

    assert.strictEqual(commonUtils.isDate({}), false, 'object');
    assert.strictEqual(commonUtils.isDate([]), false, 'array');
    assert.strictEqual(commonUtils.isDate(1), false, 'number');
    assert.strictEqual(commonUtils.isDate('s'), false, 'string');
    assert.strictEqual(commonUtils.isDate(function() { }), false, 'function');
});

QUnit.test('isFunction', function(assert) {
    assert.strictEqual(commonUtils.isFunction(function() { }), true, 'function');

    assert.strictEqual(commonUtils.isFunction({}), false, 'object');
    assert.strictEqual(commonUtils.isFunction([]), false, 'array');
    assert.strictEqual(commonUtils.isFunction(1), false, 'number');
    assert.strictEqual(commonUtils.isFunction('s'), false, 'string');
    assert.strictEqual(commonUtils.isFunction(new Date()), false, 'date');
});

QUnit.module("runtime utils", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("executeAsync", function(assert) {
    assert.expect(1);

    var called = false;

    commonUtils.executeAsync(function() {
        called = true;
    }).promise.done(function() {
        assert.ok(called);
    });

    this.clock.tick(60);
});

QUnit.test("executeAsync with deferred response", function(assert) {
    assert.expect(1);

    var called = false,
        clock = this.clock;

    commonUtils.executeAsync(function() {
        var d = $.Deferred();

        clock.tick(0);

        called = true;
        d.resolve();

        return d.promise();
    }).promise.done(function() {
        assert.ok(called, "executeAsync resolved after deferred returned by callback resolved");
    });

    clock.tick(60);
});

QUnit.test("executeAsync with context parameter", function(assert) {
    assert.expect(2);

    var context = {
        called: false
    };

    commonUtils.executeAsync(function() {
        this.called = true;
    }, context).promise.done(function() {
        assert.ok(context.called, "action calls with correct context");
        assert.ok(this.called, "executeAsync resolved with correct context");
    });

    this.clock.tick(60);
});

QUnit.test("executeAsync with timeout", function(assert) {
    var called = false;

    commonUtils.executeAsync(function() {
        called = true;
    }, 20);

    //act
    this.clock.tick(19);

    //assert
    assert.ok(!called, "action is not called");

    //act
    this.clock.tick(1);

    //assert
    assert.ok(called, "action is called");
});


QUnit.module("findBestMatches");

QUnit.test("basic", function(assert) {
    var items = [
        {
            a: 1,
            b: 2
        },
        {
            a: 1,
            b: 2,
            c: 3
        }
        ],
        filter = {
            b: 2,
            c: 3
        },
        filteredItems = commonUtils.findBestMatches(filter, items);

    assert.equal(filteredItems.length, 1);
    assert.equal(filteredItems[0].c, 3);

    items[0].c = 3;
    filteredItems = commonUtils.findBestMatches(filter, items);

    assert.equal(filteredItems.length, 2);

    items[0].c = 4;
    filteredItems = commonUtils.findBestMatches(filter, items);

    assert.equal(filteredItems.length, 1);
    assert.equal(filteredItems[0].c, 3);

    filter.d = 6;
    filteredItems = commonUtils.findBestMatches(filter, items);

    assert.equal(filteredItems.length, 1);
    assert.equal(filteredItems[0].c, 3);

    items[1].b = 5;
    filteredItems = commonUtils.findBestMatches(filter, items);

    assert.equal(filteredItems.length, 0);

    filter = {
        d: 6
    };
    filteredItems = commonUtils.findBestMatches(filter, items);
    assert.equal(filteredItems.length, 2);
});

QUnit.test("only filter fields should be considered for calculating a specificity", function(assert) {
    var items = [{
            a: 1,
            b: 2
        }, {
            a: 1,
            b: 2,
            c: 3
        }],
        filter = {
            a: 1,
            b: 2
        },
        filteredItems = commonUtils.findBestMatches(filter, items);

    assert.equal(filteredItems.length, 2);
});

QUnit.test("filtering items by array fields", function(assert) {
    var items = [
        {
            a: 1
        },
        {
            a: [1]
        },
        {
            a: [1, 2]
        },
        {
            a: [1, 0, 2]
        },
        {
            a: [1, 2, 3],
            b: 1
        }
        ],
        filter,
        filteredItems;

    filter = {
        a: 1
    };
    filteredItems = commonUtils.findBestMatches(filter, items);
    assert.equal(filteredItems.length, 1);
    assert.equal(filteredItems[0].a, 1);

    filter.a = [1];
    filteredItems = commonUtils.findBestMatches(filter, items);
    assert.equal(filteredItems.length, 1);
    assert.equal(filteredItems[0].a[0], 1);

    filter.a = [1, 2];
    filteredItems = commonUtils.findBestMatches(filter, items);
    assert.equal(filteredItems.length, 2);

    filter.a = [1, 2, 3];
    filteredItems = commonUtils.findBestMatches(filter, items);
    assert.equal(filteredItems.length, 3);

    filter.b = 1;
    filteredItems = commonUtils.findBestMatches(filter, items);
    assert.equal(filteredItems.length, 1);

    filter.b = 2;
    filteredItems = commonUtils.findBestMatches(filter, items);
    assert.equal(filteredItems.length, 2);

    filter = {
        a: [2]
    };
    filteredItems = commonUtils.findBestMatches(filter, items);
    assert.equal(filteredItems.length, 0);
});


QUnit.module('defer render/update', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("deferRender execute immediately without deferUpdate", function(assert) {
    var logs = [];

    //act
    commonUtils.deferRender(function() {
        logs.push("before inner render");

        commonUtils.deferRender(function() {
            logs.push("inner render");
        });

        logs.push("after inner render");
    });

    //assert
    assert.equal(logs.length, 3, "3 log texts");
    assert.equal(logs[0], "before inner render", "before inner render");
    assert.equal(logs[1], "inner render", "inner render");
    assert.equal(logs[2], "after inner render", "after inner render");
});

QUnit.test("deferUpdate execute immediately without deferRender", function(assert) {
    var logs = [];

    //act
    commonUtils.deferRender(function() {
        logs.push("before inner update");

        commonUtils.deferRender(function() {
            logs.push("inner update");
        });

        logs.push("after inner update");
    });

    //assert
    assert.equal(logs.length, 3, "3 log texts");
    assert.equal(logs[0], "before inner update", "before inner update");
    assert.equal(logs[1], "inner update", "inner update");
    assert.equal(logs[2], "after inner update", "after inner update");
});

QUnit.test("deferRender execute delayed in deferUpdate", function(assert) {
    var logs = [];

    //act
    commonUtils.deferUpdate(function() {
        logs.push("before inner render");

        commonUtils.deferRender(function() {
            logs.push("inner render");
        }).done(function() {
            logs.push("inner render deferred done");
        });

        logs.push("after inner render");
    }).done(function() {
        logs.push("update deferred done");
    });

    //assert
    assert.equal(logs.length, 5, "5 log texts");
    assert.equal(logs[0], "before inner render", "before inner render");
    assert.equal(logs[1], "after inner render", "after inner render");
    assert.equal(logs[2], "inner render", "inner render");
    assert.equal(logs[3], "inner render deferred done", "inner render deferred done");
    assert.equal(logs[4], "update deferred done", "update deferred done");
});

QUnit.test("deferUpdate execute delayed in deferRender", function(assert) {
    var logs = [];

    //act
    commonUtils.deferRender(function() {
        logs.push("before inner update");

        commonUtils.deferUpdate(function() {
            logs.push("inner update");
        }).done(function() {
            logs.push("inner update deferred done");
        });

        logs.push("after inner update");
    }).done(function() {
        logs.push("render deferred done");
    });

    //assert
    assert.equal(logs.length, 5, "5 log texts");
    assert.equal(logs[0], "before inner update", "before inner update");
    assert.equal(logs[1], "after inner update", "after inner update");
    assert.equal(logs[2], "inner update", "inner update");
    assert.equal(logs[3], "inner update deferred done", "inner update deferred done");
    assert.equal(logs[4], "render deferred done", "render deferred done");
});

QUnit.test("several deferUpdate in one deferRender", function(assert) {
    var logs = [];

    //act
    commonUtils.deferRender(function() {
        logs.push("render");

        commonUtils.deferUpdate(function() {
            logs.push("update 1");
            commonUtils.deferRender(function() {
                logs.push("inner render 1");
            });
        });

        commonUtils.deferUpdate(function() {
            logs.push("update 2");
            commonUtils.deferRender(function() {
                logs.push("inner render 2");
            });
        });
    }).done(function() {
        logs.push("render completed");
    });

    //assert
    assert.equal(logs.length, 6, "6 log texts");
    assert.equal(logs[0], "render");
    assert.equal(logs[1], "update 1");
    assert.equal(logs[2], "update 2");
    assert.equal(logs[3], "inner render 1");
    assert.equal(logs[4], "inner render 2");
    assert.equal(logs[5], "render completed");
});

QUnit.test("Return deferred in deferRender and using deferUpdater", function(assert) {
    var logs = [];

    //act
    commonUtils.deferRender(function() {
        var d = $.Deferred();

        logs.push("render");

        setTimeout(commonUtils.deferUpdater(function() {
            logs.push("update");
            d.resolve();
        }), 1000);

        return d;
    }).done(function() {
        logs.push("render completed");
    });

    //assert
    assert.equal(logs.length, 1, "1 log texts");

    //act
    this.clock.tick(1000);

    //assert
    assert.equal(logs.length, 3, "4 log texts");
    assert.equal(logs[0], "render");
    assert.equal(logs[1], "update");
    assert.equal(logs[2], "render completed");
});

QUnit.test("Return deferred in deferUpdate and using deferRenderer", function(assert) {
    var logs = [];

    //act
    commonUtils.deferUpdate(function() {
        var d = $.Deferred();

        logs.push("update");

        setTimeout(commonUtils.deferRenderer(function() {
            logs.push("render");
            d.resolve();
        }), 1000);

        return d;
    }).done(function() {
        logs.push("update completed");
    });

    //assert
    assert.equal(logs.length, 1, "1 log texts");

    //act
    this.clock.tick(1000);

    //assert
    assert.equal(logs.length, 3, "4 log texts");
    assert.equal(logs[0], "update");
    assert.equal(logs[1], "render");
    assert.equal(logs[2], "update completed");
});


QUnit.module("applyServerDecimalSeparator");

QUnit.test("formats the value passed according to the DevExpress.config", function(assert) {
    var originalConfig = config();
    try {
        config({ serverDecimalSeparator: "|" });
        assert.equal(commonUtils.applyServerDecimalSeparator(2.6), "2|6", "value is formatted correctly");
    } finally {
        config(originalConfig);
    }
});
