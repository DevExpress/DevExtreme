"use strict";

var $ = require("jquery"),
    ArrayStore = require("data/array_store"),
    ErrorHandlingHelper = require("../../helpers/data.errorHandlingHelper.js");

QUnit.module("Loading data");

QUnit.test("trivial load", function(assert) {
    var done = assert.async();

    new ArrayStore([1]).load().done(function(data, extra) {
        assert.deepEqual(data, [1]);
        done();
    });
});

QUnit.test("totalCount", function(assert) {
    var done = assert.async();

    var data = [
        { a: 2 },
        { a: 3 },
        { a: 4 },
        { a: 1 },
        { a: 4 },
        { a: 2 }
    ];

    new ArrayStore(data)
        .totalCount({
            filter: ["a", "<>", 1],
            group: "a",
            pageSize: 2

        })
        .done(function(r) {
            assert.equal(r, 3);
            done();
        });
});

QUnit.test("load callbacks", function(assert) {
    var done = assert.async();

    var checklist = {};

    var store = new ArrayStore({
        data: [{ a: 1, b: 2 }],

        onLoading: function(options) {
            checklist.onLoading_option = options;
        },

        onLoaded: function(data) {
            checklist.onLoaded_option = data;
        }
    });

    store.on("loading", function(options) {
        checklist.on_loading_callback = options;
    });

    store.on("loaded", function(data) {
        checklist.on_loaded_callback = data;
    });

    store.load({ sort: "a", extra: 1 }).done(function(data) {
        assert.deepEqual(checklist, {
            onLoading_option: { sort: "a", extra: 1 },
            on_loading_callback: { sort: "a", extra: 1 },
            onLoaded_option: [{ a: 1, b: 2 }],
            on_loaded_callback: [{ a: 1, b: 2 }]
        });

        assert.deepEqual(data, [{ a: 1, b: 2 }]);
        done();
    });
});

QUnit.test("paging", function(assert) {
    var done = assert.async();

    var store = new ArrayStore([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var case1 = store.load({ skip: 3, take: 4 }).done(function(data) {
        assert.deepEqual(data, [4, 5, 6, 7]);
    });

    var case2 = store.load({ take: 3 }).done(function(data) {
        assert.deepEqual(data, [1, 2, 3]);
    });

    $.when(case1, case2).done(done);
});


QUnit.test("sorting, short syntax", function(assert) {
    var done = assert.async();

    new ArrayStore([
        { name: "Z" },
        { name: "A" }
    ])
        .load({ sort: "name" })
        .done(function(data) {
            assert.equal(data[0].name, "A");
            done();
        });
});

QUnit.test("sorting, multi-level, mixed syntax", function(assert) {
    var done = assert.async();

    new ArrayStore({
        data: [
            { a: 1, b: 2, c: 3 },
            { a: 1, b: 1, c: 1 },
            { a: 1, b: 2, c: 2 }
        ]
    })
        .load({
            sort: [
                "a",
                { field: "b", dir: "DESC" },
                { selector: "c", desc: false }
            ]
        })
        .done(function(data) {
            assert.equal(data[2].b, 1);
            assert.equal(data[1].c, 3);
            done();
        });
});

QUnit.test("filtering", function(assert) {
    var done = assert.async();

    new ArrayStore({
        data: [{ a: 1 }, { a: 2 }]
    })
        .load({ filter: ["a", ">", 1] })
        .done(function(data) {
            assert.deepEqual(data, [{ a: 2 }]);
            done();
        });
});

QUnit.test("multi-level grouping", function(assert) {
    var done = assert.async();

    new ArrayStore([
        { name: "Bob", year: 2008 },
        { name: "Alex", year: 2006 },
        { name: "Alice", year: 2011 },
        { name: "Ann", year: 2011 }
    ])
        .load({
            sort: { field: "name", dir: "desc" },
            group: [
                { selector: function(i) { return i.name.charAt(0); } },
                { field: "year", desc: true }
            ]
        })
        .done(function(data) {
            assert.deepEqual(data, [
                {
                    key: "A",
                    items: [
                        {
                            key: 2011,
                            items: [
                                { name: "Ann", year: 2011 },
                                { name: "Alice", year: 2011 }
                            ]
                        },
                        {
                            key: 2006,
                            items: [
                                { name: "Alex", year: 2006 }
                            ]
                        }
                    ]
                },
                {
                    key: "B",
                    items: [
                        {
                            key: 2008,
                            items: [
                                { name: "Bob", year: 2008 }
                            ]
                        }
                    ]
                }

            ]);
            done();
        });

});

QUnit.test("grouping and no sorting", function(assert) {
    var done = assert.async();

    new ArrayStore([
        { name: "Bob", year: 2008 },
        { name: "Alex", year: 2006 },
        { name: "Alice", year: 2011 },
        { name: "Ann", year: 2011 }
    ])
        .load({
            group: [
                { selector: function(i) { return i.name.charAt(0); } },
                { field: "year", desc: true }
            ]
        })
        .done(function(data) {
            assert.deepEqual(data, [
                {
                    key: "A",
                    items: [
                        {
                            key: 2011,
                            items: [
                                { name: "Alice", year: 2011 },
                                { name: "Ann", year: 2011 }
                            ]
                        },
                        {
                            key: 2006,
                            items: [
                                { name: "Alex", year: 2006 }
                            ]
                        }
                    ]
                },
                {
                    key: "B",
                    items: [
                        {
                            key: 2008,
                            items: [
                                { name: "Bob", year: 2008 }
                            ]
                        }
                    ]
                }

            ]);
            done();
        });

});

QUnit.test("selector", function(assert) {
    var done = assert.async();

    new ArrayStore([
        { a: 1, b: 2, c: 3 }
    ])
        .load({ select: ["a", "b"] })
        .done(function(data) {
            assert.deepEqual(data, [
                { a: 1, b: 2 }
            ]);
            done();
        });

});

QUnit.test("grouping with select (Q531205)", function(assert) {
    var done = assert.async();

    var items = [
        { groupKey: 1, f1: 1, f2: "a" },
        { groupKey: 1, f1: 2, f2: "b" },
        { groupKey: 2, f1: 3, f2: "c" }
    ];

    new ArrayStore(items)
        .load({
            select: ["groupKey", "f2"],
            group: "groupKey"
        })
        .done(function(data) {
            assert.deepEqual(data, [
                {
                    key: 1,
                    items: [
                        { groupKey: 1, f2: "a" },
                        { groupKey: 1, f2: "b" }
                    ]
                },
                {
                    key: 2,
                    items: [
                        { groupKey: 2, f2: "c" }
                    ]
                }
            ]);
            done();
        });
});

QUnit.test("sort/group by function (regression)", function(assert) {
    var done = assert.async();

    new ArrayStore([
        { value: "z" },
        { value: "a" }
    ])
        .load({
            sort: function(i) { return i.value; },
            group: function(i) { return i.value; }
        })
        .done(function(data) {
            assert.deepEqual(data, [
                {
                    key: "a",
                    items: [{ value: "a" }]
                },
                {
                    key: "z",
                    items: [{ value: "z" }]
                }
            ]);

            done();
        });

});

QUnit.test("byKey", function(assert) {
    var done = assert.async();

    var store = new ArrayStore({
        key: "k",
        data: [
            { k: 1, v: "a" },
            { k: 2, v: "b" }
        ]
    });

    store.byKey(2).done(function(r) {
        assert.equal(r.v, "b");
        done();
    });
});

QUnit.test("byKey called with unknown id", function(assert) {
    assert.expect(2);

    var done = assert.async();

    var store = new ArrayStore({
        key: "k"
    });

    store.byKey(1)
        .done(function() {
            assert.ok(false);
        })
        .fail(function(error) {
            assert.ok(error instanceof Error);
            assert.ok(true);
        })
        .always(done);
});

QUnit.module("Modifying data");

QUnit.test("insert with autogenerated key", function(assert) {
    var done = assert.async();

    var checklist = {};

    var store = new ArrayStore({
        key: "id",

        onModifying: function() {
            checklist.onModifying_option = true;
        },

        onModified: function() {
            checklist.onModified_option = true;
        },

        onInserting: function(values) {
            checklist.onInserting_option = values;
        },

        onInserted: function(values, key) {
            checklist.onInserted_option = [values, key];
        }
    });

    store.on("modifying", function() {
        checklist.on_modifying_callback = true;
    });

    store.on("modified", function() {
        checklist.on_modified_callback = true;
    });

    store.on("inserting", function(values) {
        checklist.on_inserting_callback = values;
        values.b = 2;
    });

    store.on("inserted", function(values, key) {
        checklist.on_inserted_callback = [values, key];
    });

    store.insert({ a: 1 }).done(function(values, key) {
        assert.equal(typeof key, "string");
        assert.ok(/[0-9a-f-]{36}/.test(key));

        var expectedValues = { a: 1, b: 2 };
        assert.deepEqual(values, expectedValues);

        assert.deepEqual(checklist, {
            onModifying_option: true,
            onModified_option: true,
            on_modifying_callback: true,
            on_modified_callback: true,
            onInserting_option: expectedValues,
            on_inserting_callback: expectedValues,
            onInserted_option: [expectedValues, key],
            on_inserted_callback: [expectedValues, key]
        });

        store.load().done(function(data) {
            assert.equal(data.length, 1);
            assert.equal(data[0].id, key);
            done();
        });

    });
});

QUnit.test("insert with autogenerated compound key throws", function(assert) {
    var store = new ArrayStore({
        key: ["key1", "key2"]
    });

    assert.throws(function() {
        store.insert({});
    });
});

QUnit.test("insert with user-generated key", function(assert) {
    var done = assert.async();

    var store = new ArrayStore({ key: "id" });

    store.insert({ id: 42 }).done(function(values, key) {
        assert.equal(key, 42);
        done();
    });

});

QUnit.test("update with key", function(assert) {
    var done = assert.async();

    var checklist = {};

    var store = new ArrayStore({
        key: "id",
        data: [{ id: 123, name: "Alice" }],

        onModifying: function() {
            checklist.onModifying_option = true;
        },

        onModified: function() {
            checklist.onModified_option = true;
        },

        onUpdating: function(key, values) {
            checklist.onUpdating_option = [key, values];
        },

        onUpdated: function(key, values) {
            checklist.onUpdated_option = [key, values];
        }
    });

    store.on("modifying", function() {
        checklist.on_modifying_callback = true;
    });

    store.on("modified", function() {
        checklist.on_modified_callback = true;
    });

    store.on("updating", function(key, values) {
        values.something = 1;
        checklist.on_updating_callback = [key, values];
    });

    store.on("updated", function(key, values) {
        checklist.on_updated_callback = [key, values];
    });

    store.update(123, { name: "Bob" }).done(function(key, values) {
        assert.equal(key, 123);

        var expectedValues = {
            name: "Bob",
            something: 1
        };

        assert.deepEqual(values, expectedValues);

        assert.deepEqual(checklist, {
            onModifying_option: true,

            onModified_option: true,

            on_modifying_callback: true,

            onUpdating_option: [123, expectedValues],

            onUpdated_option: [123, expectedValues],

            on_updating_callback: [123, expectedValues],

            on_modified_callback: true,

            on_updated_callback: [123, expectedValues]
        });

        store.load().done(function(data) {
            assert.equal(data[0].name, "Bob");
            done();
        });

    });

});

QUnit.test("insert duplicate key (simple)", function(assert) {
    var done = assert.async();

    var store = new ArrayStore({
        key: "id",
        data: [{ id: 1 }]
    });

    store.insert({ id: 1 }).fail(function(error) {
        assert.expect(0);
        done();
    });
});

QUnit.test("insert duplicate key (compound)", function(assert) {
    var done = assert.async();

    var store = new ArrayStore({
        key: ["key1", "key2"],
        data: [{ key1: 1, key2: 2 }]
    });
    store.insert({ key1: 1, key2: 2 }).fail(function(error) {
        assert.expect(0);
        done();
    });
});

QUnit.test("remove with key", function(assert) {
    var done = assert.async();

    var checklist = {};

    var store = new ArrayStore({
        key: "id",
        data: [
            { id: 123 }
        ],

        onRemoving: function(key) {
            checklist.onRemoving_option = key;
        },

        onRemoved: function(key) {
            checklist.onRemoved_option = key;
        },

        onModifying: function() {
            checklist.onModifying_option = true;
        },

        onModified: function() {
            checklist.on_modified_option = true;
        }
    });

    store.on("modifying", function() {
        checklist.on_modifying_callback = true;
    });

    store.on("modified", function() {
        checklist.on_modified_callback = true;
    });

    store.on("removing", function(key) {
        checklist.on_removing_callback = key;
    });

    store.on("removed", function(key) {
        checklist.on_removed_callback = key;
    });

    store.remove(123).done(function(key) {
        assert.equal(key, 123);

        assert.deepEqual(checklist, {
            onRemoving_option: 123,

            onRemoved_option: 123,

            onModifying_option: true,

            on_modified_option: true,

            on_modifying_callback: true,

            on_modified_callback: true,

            on_removing_callback: 123,

            on_removed_callback: 123
        });

        store.load().done(function(data) {
            assert.ok(!data.length);
            done();
        });
    });

});

QUnit.test("modification operations without key use instance as key", function(assert) {
    var done = assert.async();

    var store = new ArrayStore();
    assert.equal(typeof store.key(), "undefined");

    var insertValues = { a: 1 },
        insertedObj;

    store.insert(insertValues).done(function(data, key) {
        insertedObj = store._array[0];

        assert.ok(typeof insertedObj === "object");
        assert.ok(data === insertValues);
        assert.ok(data !== key);
        assert.ok(key === insertedObj);
        assert.equal(insertedObj.a, 1);

        store.update(insertedObj, { a: 2 }).done(function(key, data) {
            assert.ok(key === insertedObj);
            assert.ok(data !== insertedObj);
            assert.equal(insertedObj.a, 2);

            store.remove(insertedObj).done(function(key) {
                assert.ok(key === insertedObj);
                assert.ok(!store._array.length);

                done();
            });
        });


    });

});

QUnit.test("update with array sub-member (B251202)", function(assert) {
    var done = assert.async();

    var store = new ArrayStore({
        key: "id",
        data: [
            {
                id: 1,
                a: [1, 2, 3]
            }
        ]
    });

    store.update(1, { a: [9] }).done(function() {
        assert.deepEqual(store._array, [{ id: 1, a: [9] }]);
        done();
    });
});

QUnit.test("updating key value throws an error (simple key)", function(assert) {
    assert.expect(3);

    var store = new ArrayStore({
        key: "id",
        data: [{ id: 1 }]
    });

    store.update(1, { id: 1 })
        .fail(function() { assert.ok(false); })
        .done(function() { assert.ok(true); });

    store.update(1, { id: 2 })
        .fail(function() { assert.ok(true); })
        .done(function() { assert.ok(false); });

    // NOTE: T335798
    store.update(1, { id: null })
        .fail(function() { assert.ok(true); })
        .done(function() { assert.ok(false); });
});

QUnit.test("updating key value throws an error (compound key)", function(assert) {
    assert.expect(5);

    var store = new ArrayStore({
        key: ["idFirst", "idSecond"],
        data: [{ idFirst: 0, idSecond: 1 }]
    });

    store.update({ idFirst: 0, idSecond: 1 }, { idFirst: 0, idSecond: 1 })
        .fail(function() { assert.ok(false); })
        .done(function() { assert.ok(true); });

    // updates only part of key
    store.update({ idFirst: 0, idSecond: 1 }, { idFirst: 0, idSecond: 2 })
        .fail(function() { assert.ok(true); })
        .done(function() { assert.ok(false); });

    // updates whole key
    store.update({ idFirst: 0, idSecond: 1 }, { idFirst: 1, idSecond: 2 })
        .fail(function() { assert.ok(true); })
        .done(function() { assert.ok(false); });

    // updates only part of key
    store.update({ idFirst: 0, idSecond: 1 }, { idFirst: null, idSecond: 2 })
        .fail(function() { assert.ok(true); })
        .done(function() { assert.ok(false); });

    // updates whole key
    store.update({ idFirst: 0, idSecond: 1 }, { idFirst: null, idSecond: null })
        .fail(function() { assert.ok(true); })
        .done(function() { assert.ok(false); });
});

QUnit.test("clear", function(assert) {
    var done = assert.async();

    var store = new ArrayStore([1, 2, 3]);

    store.clear();
    store.load().done(function(r) {
        assert.ok(!r.length);
        done();
    });
});

QUnit.test("clear fires modifying and modified events (T366717)", function(assert) {
    var done = assert.async(),
        bag = {};

    var store = new ArrayStore({
        onModifying: function() { bag.onModifying = true; },
        onModified: function() { bag.onModified = true; },

        data: [1, 2, 3]
    });

    store.on("modifying", function() { bag.modifying = true; });
    store.on("modified", function() { bag.modified = true; });

    store.clear();

    store.load()
        .fail(function() {
            assert.ok(false, "Shouldn't reach this point");
        })
        .done(function(r) {
            assert.ok(!r.length);

            assert.deepEqual(bag, {
                onModifying: true,
                onModified: true,
                modifying: true,
                modified: true
            });
        })
        .always(done);
});

QUnit.module("Misc");

QUnit.test("T281004: LocalStore/ArrayStore - The update method works properly only if key values are passed as parameters", function(assert) {
    var store = new ArrayStore({
        key: [
            "keyPart1",
            "keyPart2"
        ],
        data: [
            { keyPart1: "0", keyPart2: "0", prop: 5 }
        ]
    });

    store.update({ keyPart1: "0", keyPart2: "0" }, { prop: 5 })
        .fail(function() {
            assert.ok(false, "Shouldn't reach this point");
        })
        .done(function(key, values) {
            assert.deepEqual(key, { keyPart1: "0", keyPart2: "0" });
            assert.deepEqual(values, { prop: 5 });
        });
});

QUnit.test("T155114: ArrayStore converts a string to a char array when you add a string value to the store using the insert() method", function(assert) {
    var done = assert.async();

    var store = new ArrayStore();
    store.insert("a").done(function() {
        store.load().done(function(r) {
            assert.deepEqual(r, ["a"]);
            done();
        });
    });
});

QUnit.test("key() method", function(assert) {
    assert.equal(new ArrayStore({ key: "abc" }).key(), "abc");
});

QUnit.test("store has a public query method", function(assert) {
    assert.ok("select" in new ArrayStore().createQuery());

});

QUnit.test("prevent passing data as non-array", function(assert) {
    assert.throws(function() {
        new ArrayStore({
            data: "string"
        });
    });
});

QUnit.module("Error handling");

QUnit.test("error in during query evaluation", function(assert) {
    var done = assert.async();

    var helper = new ErrorHandlingHelper();

    var store = new ArrayStore({
        data: [1],
        errorHandler: helper.optionalHandler
    });

    helper.run(function() {
        return store.load({
            select: function() { throw Error("test"); }
        });
    }, done, assert);
});


QUnit.test("error during update (missing item)", function(assert) {
    var done = assert.async();

    var helper = new ErrorHandlingHelper();
    helper.extraChecker = function(error) {
        assert.ok(/cannot be found/.test(error.message));
    };

    var store = new ArrayStore({
        key: "id",
        errorHandler: helper.optionalHandler
    });

    helper.run(function() {
        return store.update(123, {});
    }, done, assert);
});

QUnit.test("forced error for insert", function(assert) {
    var done = assert.async();

    var helper = new ErrorHandlingHelper();

    helper.extraChecker = function(error) {
        assert.equal(error.message, "FORCED");
    };

    var store = $.extend(
        new ArrayStore({ errorHandler: helper.optionalHandler }),
        {
            _insertImpl: function() {
                return $.Deferred().reject(Error("FORCED"));
            }
        }
    );

    helper.run(function() {
        return store.insert({});
    }, done, assert);
});

QUnit.test("forced error for update", function(assert) {
    var done = assert.async();

    var helper = new ErrorHandlingHelper();

    helper.extraChecker = function(error) {
        assert.equal(error.message, "FORCED");
    };

    var store = $.extend(
        new ArrayStore({ errorHandler: helper.optionalHandler }),
        {
            _updateImpl: function() {
                return $.Deferred().reject(Error("FORCED"));
            }
        }
    );

    helper.run(function() {
        return store.update(1, {});
    }, done, assert);
});

QUnit.test("forced error for remove", function(assert) {
    var done = assert.async();

    var helper = new ErrorHandlingHelper();

    helper.extraChecker = function(error) {
        assert.equal(error.message, "FORCED");
    };

    var store = $.extend(
        new ArrayStore({ errorHandler: helper.optionalHandler }),
        {
            _removeImpl: function() {
                return $.Deferred().reject(Error("FORCED"));
            }
        }
    );

    helper.run(function() {
        return store.remove(1);
    }, done, assert);
});
