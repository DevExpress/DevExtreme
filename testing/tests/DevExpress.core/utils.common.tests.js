import $ from "jquery";
import {
    executeAsync,
    findBestMatches,
    deferRender,
    deferUpdate,
    deferUpdater,
    deferRenderer,
    applyServerDecimalSeparator,
    grep,
    getKeyHash
} from "core/utils/common";
import { equalByValue } from "core/utils/common";
import Guid from "core/guid";
import config from "core/config";

const { module, test } = QUnit;

module("runtime utils", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    test("executeAsync", function(assert) {
        assert.expect(1);

        let called = false;

        executeAsync(() => {
            called = true;
        }).promise.done(() => {
            assert.ok(called);
        });

        this.clock.tick(60);
    });

    test("executeAsync with deferred response", function(assert) {
        assert.expect(1);

        let called = false;
        const clock = this.clock;

        executeAsync(() => {
            const d = $.Deferred();

            clock.tick(0);

            called = true;
            d.resolve();

            return d.promise();
        }).promise.done(() => {
            assert.ok(called, "executeAsync resolved after deferred returned by callback resolved");
        });

        clock.tick(60);
    });

    test("executeAsync with context parameter", function(assert) {
        assert.expect(2);

        const context = {
            called: false
        };

        executeAsync(function() {
            this.called = true;
        }, context).promise.done(function() {
            assert.ok(context.called, "action calls with correct context");
            assert.ok(this.called, "executeAsync resolved with correct context");
        });

        this.clock.tick(60);
    });

    test("executeAsync with timeout", function(assert) {
        let called = false;

        executeAsync(() => {
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
});


module("findBestMatches", () => {
    test("basic", function(assert) {
        const items = [
            {
                a: 1,
                b: 2
            },
            {
                a: 1,
                b: 2,
                c: 3
            }
        ];
        let filter = {
            b: 2,
            c: 3
        };
        let filteredItems = findBestMatches(filter, items);

        assert.equal(filteredItems.length, 1);
        assert.equal(filteredItems[0].c, 3);

        items[0].c = 3;
        filteredItems = findBestMatches(filter, items);

        assert.equal(filteredItems.length, 2);

        items[0].c = 4;
        filteredItems = findBestMatches(filter, items);

        assert.equal(filteredItems.length, 1);
        assert.equal(filteredItems[0].c, 3);

        filter.d = 6;
        filteredItems = findBestMatches(filter, items);

        assert.equal(filteredItems.length, 1);
        assert.equal(filteredItems[0].c, 3);

        items[1].b = 5;
        filteredItems = findBestMatches(filter, items);

        assert.equal(filteredItems.length, 0);

        filter = {
            d: 6
        };
        filteredItems = findBestMatches(filter, items);
        assert.equal(filteredItems.length, 2);
    });

    test("only filter fields should be considered for calculating a specificity", function(assert) {
        const items = [{
            a: 1,
            b: 2
        }, {
            a: 1,
            b: 2,
            c: 3
        }];
        let filter = {
            a: 1,
            b: 2
        };
        let filteredItems = findBestMatches(filter, items);

        assert.equal(filteredItems.length, 2);
    });

    test("filtering items by array fields", function(assert) {
        const items = [
            {
                a: 1
            }, {
                a: [1]
            }, {
                a: [1, 2]
            }, {
                a: [1, 0, 2]
            }, {
                a: [1, 2, 3],
                b: 1
            }
        ];
        let filter;
        let filteredItems;

        filter = {
            a: 1
        };
        filteredItems = findBestMatches(filter, items);
        assert.equal(filteredItems.length, 1);
        assert.equal(filteredItems[0].a, 1);

        filter.a = [1];
        filteredItems = findBestMatches(filter, items);
        assert.equal(filteredItems.length, 1);
        assert.equal(filteredItems[0].a[0], 1);

        filter.a = [1, 2];
        filteredItems = findBestMatches(filter, items);
        assert.equal(filteredItems.length, 2);

        filter.a = [1, 2, 3];
        filteredItems = findBestMatches(filter, items);
        assert.equal(filteredItems.length, 3);

        filter.b = 1;
        filteredItems = findBestMatches(filter, items);
        assert.equal(filteredItems.length, 1);

        filter.b = 2;
        filteredItems = findBestMatches(filter, items);
        assert.equal(filteredItems.length, 2);

        filter = {
            a: [2]
        };
        filteredItems = findBestMatches(filter, items);
        assert.equal(filteredItems.length, 0);
    });
});


module("defer render/update", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    test("deferRender execute immediately without deferUpdate", function(assert) {
        const logs = [];

        // act
        deferRender(() => {
            logs.push("before inner render");

            deferRender(() => {
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

    test("deferUpdate execute immediately without deferRender", function(assert) {
        const logs = [];

        // act
        deferRender(() => {
            logs.push("before inner update");

            deferRender(() => {
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

    test("deferRender execute delayed in deferUpdate", function(assert) {
        const logs = [];

        // act
        deferUpdate(() => {
            logs.push("before inner render");

            deferRender(() => {
                logs.push("inner render");
            }).done(() => {
                logs.push("inner render deferred done");
            });

            logs.push("after inner render");
        }).done(() => {
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

    test("deferUpdate execute delayed in deferRender", function(assert) {
        const logs = [];

        // act
        deferRender(() => {
            logs.push("before inner update");

            deferUpdate(() => {
                logs.push("inner update");
            }).done(() => {
                logs.push("inner update deferred done");
            });

            logs.push("after inner update");
        }).done(() => {
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

    test("several deferUpdate in one deferRender", function(assert) {
        const logs = [];

        // act
        deferRender(() => {
            logs.push("render");

            deferUpdate(() => {
                logs.push("update 1");
                deferRender(() => {
                    logs.push("inner render 1");
                });
            });

            deferUpdate(() => {
                logs.push("update 2");
                deferRender(() => {
                    logs.push("inner render 2");
                });
            });
        }).done(() => {
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

    test("Return deferred in deferRender and using deferUpdater", function(assert) {
        const logs = [];

        // act
        deferRender(() => {
            const d = $.Deferred();

            logs.push("render");

            setTimeout(deferUpdater(() => {
                logs.push("update");
                d.resolve();
            }), 1000);

            return d;
        }).done(() => {
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

    test("Return deferred in deferUpdate and using deferRenderer", function(assert) {
        const logs = [];

        // act
        deferUpdate(() => {
            const d = $.Deferred();

            logs.push("update");

            setTimeout(deferRenderer(() => {
                logs.push("render");
                d.resolve();
            }), 1000);

            return d;
        }).done(() => {
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
});


module("applyServerDecimalSeparator", () => {
    test("formats the value passed according to the DevExpress.config", function(assert) {
        const originalConfig = config();
        try {
            config({ serverDecimalSeparator: "|" });
            assert.equal(applyServerDecimalSeparator(2.6), "2|6", "value is formatted correctly");
        } finally {
            config(originalConfig);
        }
    });
});


module("grep", () => {
    test("basic", function(assert) {
        const array = [6, 3, 8, 2, 5];
        const object = {};
        const filterNumbers = (number) => {
            return number > 5;
        };

        for(let i = 0; i < array.length; i++) {
            object[i] = array[i];
        }
        object.length = array.length;

        assert.deepEqual(grep(array, filterNumbers), [6, 8]);
        assert.deepEqual(grep(array, filterNumbers, false), [6, 8]);
        assert.deepEqual(grep(array, filterNumbers, true), [3, 2, 5]);
        assert.deepEqual(grep(object, filterNumbers), [6, 8]);
        assert.deepEqual(grep(object, filterNumbers, false), [6, 8]);
        assert.deepEqual(grep(object, filterNumbers, true), [3, 2, 5]);
    });
});


module("equalByValue", () => {
    test("The `equalByValue` should compare GUIDs by values", function(assert) {
        const guid1 = new Guid('1111');
        const guid2 = new Guid('1111');

        guid1.changed = true;
        guid2.changed = false;

        assert.ok(equalByValue(guid1, guid2));
    });
});


module("getKeyHash", () => {
    const guidValue = new Guid();
    const emptyObject = {};
    const TEST_VALUES = [{
        value: 123,
        result: 123
    }, {
        value: "test",
        result: "test"
    }, {
        value: emptyObject,
        result: emptyObject
    }, {
        value: { test: true },
        result: "{\"test\":true}"
    }, {
        value: [1, 2, 3],
        result: "[1,2,3]"
    }, {
        value: guidValue,
        result: guidValue.toString()
    }, {
        value: null,
        result: null
    }];

    TEST_VALUES.forEach(({ value, result }) => {
        test(`getKeyHash from the ${typeof value} value`, function(assert) {
            assert.strictEqual(getKeyHash(value), result, "Correct hash");
        });
    });
});
