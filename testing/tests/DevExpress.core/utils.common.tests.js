var $ = require("jquery"),
    commonUtils = require("core/utils/common"),
    config = require("core/config");

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

    // act
    this.clock.tick(19);

    // assert
    assert.ok(!called, "action is not called");

    // act
    this.clock.tick(1);

    // assert
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

    // act
    commonUtils.deferRender(function() {
        logs.push("before inner render");

        commonUtils.deferRender(function() {
            logs.push("inner render");
        });

        logs.push("after inner render");
    });

    // assert
    assert.equal(logs.length, 3, "3 log texts");
    assert.equal(logs[0], "before inner render", "before inner render");
    assert.equal(logs[1], "inner render", "inner render");
    assert.equal(logs[2], "after inner render", "after inner render");
});

QUnit.test("deferUpdate execute immediately without deferRender", function(assert) {
    var logs = [];

    // act
    commonUtils.deferRender(function() {
        logs.push("before inner update");

        commonUtils.deferRender(function() {
            logs.push("inner update");
        });

        logs.push("after inner update");
    });

    // assert
    assert.equal(logs.length, 3, "3 log texts");
    assert.equal(logs[0], "before inner update", "before inner update");
    assert.equal(logs[1], "inner update", "inner update");
    assert.equal(logs[2], "after inner update", "after inner update");
});

QUnit.test("deferRender execute delayed in deferUpdate", function(assert) {
    var logs = [];

    // act
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

    // assert
    assert.equal(logs.length, 5, "5 log texts");
    assert.equal(logs[0], "before inner render", "before inner render");
    assert.equal(logs[1], "after inner render", "after inner render");
    assert.equal(logs[2], "inner render", "inner render");
    assert.equal(logs[3], "inner render deferred done", "inner render deferred done");
    assert.equal(logs[4], "update deferred done", "update deferred done");
});

QUnit.test("deferUpdate execute delayed in deferRender", function(assert) {
    var logs = [];

    // act
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

    // assert
    assert.equal(logs.length, 5, "5 log texts");
    assert.equal(logs[0], "before inner update", "before inner update");
    assert.equal(logs[1], "after inner update", "after inner update");
    assert.equal(logs[2], "inner update", "inner update");
    assert.equal(logs[3], "inner update deferred done", "inner update deferred done");
    assert.equal(logs[4], "render deferred done", "render deferred done");
});

QUnit.test("several deferUpdate in one deferRender", function(assert) {
    var logs = [];

    // act
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

    // assert
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

    // act
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

    // assert
    assert.equal(logs.length, 1, "1 log texts");

    // act
    this.clock.tick(1000);

    // assert
    assert.equal(logs.length, 3, "4 log texts");
    assert.equal(logs[0], "render");
    assert.equal(logs[1], "update");
    assert.equal(logs[2], "render completed");
});

QUnit.test("Return deferred in deferUpdate and using deferRenderer", function(assert) {
    var logs = [];

    // act
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

    // assert
    assert.equal(logs.length, 1, "1 log texts");

    // act
    this.clock.tick(1000);

    // assert
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

QUnit.module("grep");

QUnit.test("basic", function(assert) {
    var array = [6, 3, 8, 2, 5],
        object = {},
        filterNumbers = function(number) {
            return number > 5;
        };

    for(var i = 0; i < array.length; i++) {
        object[i] = array[i];
    }
    object.length = array.length;

    assert.deepEqual(commonUtils.grep(array, filterNumbers), [6, 8]);
    assert.deepEqual(commonUtils.grep(array, filterNumbers, false), [6, 8]);
    assert.deepEqual(commonUtils.grep(array, filterNumbers, true), [3, 2, 5]);
    assert.deepEqual(commonUtils.grep(object, filterNumbers), [6, 8]);
    assert.deepEqual(commonUtils.grep(object, filterNumbers, false), [6, 8]);
    assert.deepEqual(commonUtils.grep(object, filterNumbers, true), [3, 2, 5]);
});
