"use strict";

var $ = require("jquery"),
    errors = require("ui/widget/ui.errors"),
    Selection = require("ui/selection/selection"),
    Guid = require("core/guid"),
    DataSource = require("data/data_source/data_source").DataSource,
    CustomStore = require("data/custom_store"),
    ArrayStore = require("data/array_store");

var createDataSource = function(data, storeOptions, dataSourceOptions) {
    var arrayStore = new ArrayStore(storeOptions ? $.extend(true, { data: data }, storeOptions) : data);
    var dataSource = new DataSource($.extend(true, { store: arrayStore, requireTotalCount: true, _preferSync: true }, dataSourceOptions));
    return dataSource;
};

QUnit.testStart(function() { });

QUnit.module("Selection",
    { beforeEach: function() {
        this.data = [
            { id: 1, name: 'Alex', age: 15 },
            { id: 2, name: 'Dan', age: 16 },
            { id: 3, name: 'Vadim', age: 17 },
            { id: 4, name: 'Dmitry', age: 18 },
            { id: 5, name: 'Sergey', age: 18 },
            { id: 6, name: 'Kate', age: 20 },
            { id: 7, name: 'Dan', age: 21 }
        ];
        this.clock = sinon.useFakeTimers();
    }, afterEach: function() {
        this.clock.restore();
    }
    });

QUnit.test("Select all by one page", function(assert) {
    var dataSource = createDataSource(this.data, {}, { paginate: true, pageSize: 3 });

    var expectedData = [];
    for(var i = 0; i < 3; i++) {
        expectedData.push(this.data[i]);
    }

    var selectionChangedCallCount = 0;

    var selectionChangedHandler = function(args) {
        selectionChangedCallCount++;
        assert.deepEqual(args.selectedItems, expectedData, "selectedItems is right");
        assert.deepEqual(args.selectedItemKeys, expectedData, "selectedItemsKeys is right");
        assert.deepEqual(args.addedItemKeys, expectedData, "addedItemKeys is right");
        assert.deepEqual(args.removedItemKeys, [], "removedItemKeys is right");
    };

    var selection = new Selection({
        key: function() {
            var store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            var store = dataSource.store();
            return store && store.keyOf(item);
        },
        dataFields: function() {
            return dataSource.select();
        },
        plainItems: function() {
            return dataSource.items();
        },
        onSelectionChanged: selectionChangedHandler
    });

    dataSource.load();
    selection.selectAll(true);

    assert.strictEqual(selectionChangedCallCount, 1, "selectionChanged called once");
    assert.strictEqual(selection.getSelectAllState(true), true, "select all is true");
});

// T532618
QUnit.test("Select all by one page should skip non-selectable items", function(assert) {
    var dataSource = createDataSource(this.data, {}, { paginate: true, pageSize: 3 });

    var selection = new Selection({
        key: function() {
            var store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            var store = dataSource.store();
            return store && store.keyOf(item);
        },
        isSelectableItem: function(data) {
            return data.id > 1;
        },
        dataFields: function() {
            return dataSource.select();
        },
        plainItems: function() {
            return dataSource.items();
        }
    });

    dataSource.load();
    selection.selectAll(true);

    assert.strictEqual(selection.getSelectAllState(true), true, "select all is true");
    assert.deepEqual(selection.getSelectedItems(), [this.data[1], this.data[2]], "selected items");
});

QUnit.test("Select all by one page and changeItemSelection", function(assert) {
    var dataSource = createDataSource(this.data, {}, { paginate: true, pageSize: 3 });

    var expectedData = [];
    for(var i = 0; i < 3; i++) {
        expectedData.push(this.data[i]);
    }

    var selectionChangedCallCount = 0;

    var selectionChangedHandler = function() {
        selectionChangedCallCount++;
    };

    var selection = new Selection({
        key: function() {
            var store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            var store = dataSource.store();
            return store && store.keyOf(item);
        },
        dataFields: function() {
            return dataSource.select();
        },
        plainItems: function() {
            return dataSource.items();
        },
        onSelectionChanged: selectionChangedHandler
    });

    dataSource.load();
    selection.selectAll(true);
    selection.changeItemSelection(1);

    assert.strictEqual(selectionChangedCallCount, 2, "selectionChanged called once");
    assert.strictEqual(selection.getSelectAllState(true), undefined, "select all is true");
});

QUnit.test("Select all by one page", function(assert) {
    var dataSource = createDataSource(this.data, {}, { paginate: true, pageSize: 3 });

    var expectedData = [];
    for(var i = 3; i < this.data.length; i++) {
        expectedData.push(this.data[i]);
    }

    var selectionChangedCallCount = 0;

    var selectionChangedHandler = function() {
        selectionChangedCallCount++;
    };

    var selection = new Selection({
        key: function() {
            var store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            var store = dataSource.store();
            return store && store.keyOf(item);
        },
        dataFields: function() {
            return dataSource.select();
        },
        plainItems: function() {
            return dataSource.items();
        },
        load: function(options) {
            return dataSource && dataSource.store().load(options);
        },
        onSelectionChanged: selectionChangedHandler
    });

    dataSource.load();

    selection.selectedItemKeys(this.data);
    selection.deselectAll(true);

    assert.strictEqual(selectionChangedCallCount, 2);
    assert.deepEqual(selection.getSelectedItemKeys(), expectedData);
    assert.strictEqual(selection.getSelectAllState(true), false, "select all is false");
});

QUnit.test("Select all by one page when key is defined", function(assert) {
    var dataSource = createDataSource(this.data, { key: "id" }, { paginate: true, pageSize: 3 });

    var selectionChangedCallCount = 0;

    var selectionChangedHandler = function() {
        selectionChangedCallCount++;
    };

    var selection = new Selection({
        key: function() {
            var store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            var store = dataSource.store();
            return store && store.keyOf(item);
        },
        dataFields: function() {
            return dataSource.select();
        },
        plainItems: function() {
            return dataSource.items();
        },
        load: function(options) {
            return dataSource && dataSource.store().load(options);
        },
        onSelectionChanged: selectionChangedHandler
    });

    dataSource.load();

    selection.selectedItemKeys(this.data.map(function(data) { return data.id; }));
    selection.deselectAll(true);

    assert.strictEqual(selectionChangedCallCount, 2, "selectionChanged should be called twice");
    assert.deepEqual(selection.getSelectedItemKeys(), [4, 5, 6, 7], "selected item keys are correct");
    assert.strictEqual(selection.getSelectAllState(true), false, "select all is false");
});

QUnit.test("Deselect all for all pages when key is defined", function(assert) {
    var dataSource = createDataSource(this.data, { key: "id" }, { paginate: true, pageSize: 3 });

    var selectionChangedCallCount = 0;

    var selectionChangedHandler = function() {
        selectionChangedCallCount++;
    };

    var selection = new Selection({
        key: function() {
            var store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            var store = dataSource.store();
            return store && store.keyOf(item);
        },
        dataFields: function() {
            return dataSource.select();
        },
        plainItems: function() {
            return dataSource.items();
        },
        load: function(options) {
            return dataSource && dataSource.store().load(options);
        },
        onSelectionChanged: selectionChangedHandler
    });

    dataSource.load();

    selection.selectAll();

    // act
    selection.deselectAll();

    assert.strictEqual(selectionChangedCallCount, 2, "selectionChanged should be called twice");
    assert.deepEqual(selection.getSelectedItemKeys(), [], "selected item keys are correct");
    assert.strictEqual(selection.getSelectAllState(), false, "select all is false");
});

// T450615
QUnit.test("clearSelection should work if it call after select", function(assert) {
    var dataSource = createDataSource(this.data, { key: "id" }, { paginate: true, pageSize: 3 });

    var selectionChangedHandler = sinon.spy();

    var selection = new Selection({
        key: function() {
            var store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            var store = dataSource.store();
            return store && store.keyOf(item);
        },
        dataFields: function() {
            return dataSource.select();
        },
        plainItems: function() {
            return dataSource.items();
        },
        load: function(options) {
            var d = $.Deferred();
            setTimeout(function() {
                dataSource.store().load(options).done(d.resolve).fail(d.reject);
            });
            return d;
        },
        onSelectionChanged: selectionChangedHandler
    });

    dataSource.load();

    selection.select([1, 6, 7]);
    assert.strictEqual(selectionChangedHandler.callCount, 0, "selectionChanged is not raised yet");

    // act
    selection.clearSelection();
    this.clock.tick();

    // assert
    assert.deepEqual(selection.getSelectedItemKeys(), [], "selection is cleared");
    assert.strictEqual(selectionChangedHandler.callCount, 2, "selectionChanged is raised twice");
});

QUnit.test("Equal by reference", function(assert) {
    var dataSource = createDataSource(this.data, {}, {});

    var expectedData = [];
    expectedData.push(this.data[0]);

    var selectionChangedHandler = function(args) {
        assert.equal(args.selectedItems[0], expectedData[0], "selectedItems is right");
        assert.equal(args.selectedItemKeys[0], expectedData[0], "selectedItemsKeys is right");
        assert.deepEqual(args.addedItemKeys, expectedData, "addedItemKeys is right");
        assert.deepEqual(args.removedItemKeys, [], "removedItemKeys is right");
    };

    var selection = new Selection({
        key: function() {
            var store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            var store = dataSource.store();
            return store && store.keyOf(item);
        },
        dataFields: function() {
            return dataSource.select();
        },
        plainItems: function() {
            return dataSource.items();
        },
        onSelectionChanged: selectionChangedHandler
    });

    dataSource.load();

    selection.selectedItemKeys(this.data[0], true, false, false);
});

QUnit.test("Equal by object", function(assert) {
    var dataSource,
        expectedData = [],
        countCallErrorLog = 0,
        originalLog = errors.log,
        selectionChangedHandler;

    errors.log = function() {
        countCallErrorLog++;
    };
    try {
        dataSource = createDataSource(this.data, {}, {});
        expectedData.push(this.data[0]);
        selectionChangedHandler = function(args) {
            assert.equal(args.selectedItems[0], expectedData[0], "selectedItems is right");
            assert.equal(args.selectedItemKeys[0], expectedData[0], "selectedItemsKeys is right");
            assert.deepEqual(args.addedItemKeys, expectedData, "addedItemKeys is right");
            assert.deepEqual(args.removedItemKeys, [], "removedItemKeys is right");
        };
        var selection = new Selection({
            key: function() {
                var store = dataSource.store();
                return store && store.key();
            },
            keyOf: function(item) {
                var store = dataSource.store();
                return store && store.keyOf(item);
            },
            dataFields: function() {
                return dataSource.select();
            },
            plainItems: function() {
                return dataSource.items();
            },
            onSelectionChanged: selectionChangedHandler
        });
        dataSource.load();
        selection.selectedItemKeys({ id: 1, name: 'Alex', age: 15 }, true, false, false);
        assert.equal(countCallErrorLog, 0, "no error");
    } finally {
        errors.log = originalLog;
    }
});

QUnit.test("Equal by reference with equalByReference", function(assert) {
    var dataSource = createDataSource(this.data, {}, {});

    var expectedData = [];
    expectedData.push(this.data[0]);

    var selectionChangedHandler = function(args) {
        assert.equal(args.selectedItems[0], expectedData[0], "selectedItems is right");
        assert.equal(args.selectedItemKeys[0], expectedData[0], "selectedItemsKeys is right");
        assert.equal(args.addedItemKeys[0], expectedData[0], "addedItemKeys is right");
        assert.deepEqual(args.removedItemKeys, [], "removedItemKeys is right");
    };

    var selection = new Selection({
        key: function() {
            var store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            var store = dataSource.store();
            return store && store.keyOf(item);
        },
        plainItems: function() {
            return dataSource.items();
        },
        dataFields: function() {
            return dataSource.select();
        },
        onSelectionChanged: selectionChangedHandler,
        equalByReference: true
    });

    dataSource.load();

    selection.selectedItemKeys(this.data[0], true, false, false);
});

QUnit.test("Equal by object with equalByReference", function(assert) {
    var dataSource = createDataSource(this.data, {}, {});

    dataSource.load();

    var selectionChangedHandler = sinon.stub();

    var selection = new Selection({
        key: function() {
            var store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            var store = dataSource.store();
            return store && store.keyOf(item);
        },
        load: function(options) {
            return dataSource && dataSource.store().load(options);
        },
        dataFields: function() {
            return dataSource.select();
        },
        plainItems: function() {
            return dataSource.items();
        },
        onSelectionChanged: selectionChangedHandler,
        equalByReference: true
    });

    selection.selectedItemKeys({ name: 'Alex', age: 15 }, true, false, false);

    assert.equal(selectionChangedHandler.callCount, 1, "selectionChanged should be fired");

    assert.strictEqual(selectionChangedHandler.lastCall.args[0].addedItemKeys.length, 0);
    assert.strictEqual(selectionChangedHandler.lastCall.args[0].removedItemKeys.length, 0);
});

QUnit.test("items should be selected when keyType is Guid", function(assert) {

    var items = [{ id: new Guid() }, { id: new Guid() }, { id: new Guid() }],
        storeOptions = {
            key: "id",
            keyType: "Guid",
            data: items
        },
        dataSource = createDataSource(this.data, storeOptions, {});

    dataSource.load();

    var selectionChangedHandler = sinon.spy();

    var selection = new Selection({
        load: function(options) {
            return dataSource && dataSource.store().load(options);
        },
        key: function() {
            var store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            var store = dataSource.store();
            return store && store.keyOf(item);
        },
        plainItems: function() {
            return dataSource.items();
        },
        dataSource: function() {
            return dataSource;
        },
        onSelectionChanged: selectionChangedHandler,
        equalByReference: true
    });

    selection.setSelection([items[0].id]);

    assert.equal(selectionChangedHandler.callCount, 1, "selectionChanged should be fired");
});

QUnit.test("Show warning (W1002) when select item that does not exist", function(assert) {
    // arrange
    var log,
        selection,
        dataSource,
        countCallErrorLog = 0,
        originalLog = errors.log;
    errors.log = function() {
        countCallErrorLog++;
        log = $.makeArray(arguments);
    };
    try {
        dataSource = createDataSource(this.data, { key: "id" }, {});
        selection = new Selection({
            key: function() {
                var store = dataSource.store();
                return store && store.key();
            },
            keyOf: function(item) {
                var store = dataSource.store();
                return store && store.keyOf(item);
            },
            dataFields: function() {
                return dataSource.select();
            },
            load: function(options) {
                return dataSource && dataSource.store().load(options);
            },
            plainItems: function() {
                return dataSource.items();
            }
        });
        dataSource.load();
        // act
        selection.selectedItemKeys(9, true, false, false);
        // assert
        assert.equal(countCallErrorLog, 1, "call error log");
        assert.strictEqual(log[0], "W1002", "name of warning");
        assert.strictEqual(log[1], 9, "key");
    } finally {
        errors.log = originalLog;
    }
});

QUnit.test("Show warning (W1002) when select items that don't exist", function(assert) {
    // arrange
    var log = [],
        selection,
        dataSource,
        countCallErrorLog = 0,
        originalLog = errors.log;
    errors.log = function() {
        countCallErrorLog++;
        log.push($.makeArray(arguments));
    };
    try {
        dataSource = createDataSource(this.data, { key: "id" }, {});
        selection = new Selection({
            key: function() {
                var store = dataSource.store();
                return store && store.key();
            },
            keyOf: function(item) {
                var store = dataSource.store();
                return store && store.keyOf(item);
            },
            load: function(options) {
                return dataSource && dataSource.store().load(options);
            },
            dataFields: function() {
                return dataSource.select();
            },
            plainItems: function() {
                return dataSource.items();
            }
        });
        dataSource.load();
        // act
        selection.selectedItemKeys([1, 9, 10], true, false, false);
        // assert
        assert.equal(countCallErrorLog, 2, "call error log");
        assert.strictEqual(log[0][0], "W1002", "name of warning");
        assert.strictEqual(log[0][1], 9, "key");
        assert.strictEqual(log[1][0], "W1002", "name of warning");
        assert.strictEqual(log[1][1], 10, "key");
    } finally {
        errors.log = originalLog;
    }
});

QUnit.test("selection should work with custom store without filter implementation", function(assert) {
    var clock = sinon.useFakeTimers();

    try {
        var selectionChangedHandler = function(args) {
            assert.deepEqual(args.selectedItems, [{ id: 2, text: "Item 2" }], "selectedItems is right");
            assert.deepEqual(args.selectedItemKeys, [2], "selectedItemsKeys is right");
            assert.deepEqual(args.addedItemKeys, [2], "addedItemKeys is right");
            assert.deepEqual(args.removedItemKeys, [], "removedItemKeys is right");
        };

        var dataSource = new DataSource({
            store: new CustomStore({
                load: function() {
                    var d = $.Deferred(),
                        items = [
                            { id: 1, text: "Item 1" },
                            { id: 2, text: "Item 2" }
                        ];

                    setTimeout(function() {
                        d.resolve(items);
                    }, 0);

                    return d.promise();
                },
                key: "id"
            })
        });

        var selection = new Selection({
            onSelectionChanged: selectionChangedHandler,
            key: function() {
                var store = dataSource && dataSource.store();
                return store && store.key();
            },
            keyOf: function(item) {
                var store = dataSource.store();
                return store && store.keyOf(item);
            },
            load: function(options) {
                return dataSource && dataSource.store().load(options);
            },
            dataFields: function() {
                return dataSource.select();
            },
            plainItems: function() {
                return dataSource.items();
            },
            filter: function() {
                return dataSource && dataSource.filter();
            }
        });

        dataSource.load();
        selection.selectedItemKeys(2);
        clock.tick();
    } finally {
        clock.restore();
    }
});

QUnit.test("selection should works with case-sensitive keys if select item is on current page", function(assert) {
    var loadingArgs = [];
    var selectionChangedCallCount = 0;
    var dataSource = new DataSource({
        pageSize: 2,
        store: {
            type: "array",
            onLoading: function(e) {
                loadingArgs.push(e);
            },
            data: [
                { id: "a", text: "Item 1" },
                { id: "A", text: "Item 2" },
                { id: "b", text: "Item 3" },
                { id: "B", text: "Item 4" },
            ],
            key: "id"
        }
    });

    var selection = new Selection({
        onSelectionChanged: function(args) {
            selectionChangedCallCount++;
            assert.deepEqual(args.selectedItems, [{ id: "A", text: "Item 2" }], "selectedItems is right");
            assert.deepEqual(args.selectedItemKeys, ["A"], "selectedItemsKeys is right");
            assert.deepEqual(args.addedItemKeys, ["A"], "addedItemKeys is right");
            assert.deepEqual(args.removedItemKeys, [], "removedItemKeys is right");
        },
        key: function() {
            var store = dataSource && dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            var store = dataSource.store();
            return store && store.keyOf(item);
        },
        load: function(options) {
            return dataSource && dataSource.store().load(options);
        },
        dataFields: function() {
            return dataSource.select();
        },
        plainItems: function() {
            return dataSource.items();
        },
        filter: function() {
            return dataSource && dataSource.filter();
        }
    });

    dataSource.load();
    loadingArgs = [];

    // act
    selection.selectedItemKeys(["A"]);

    // assert
    assert.equal(selectionChangedCallCount, 1, "selectionChanged is called once");
    assert.equal(loadingArgs.length, 0, "no loadings during selection");
});

QUnit.test("selection should works with case-sensitive keys if select item is not on current page", function(assert) {
    var loadingArgs = [];
    var selectionChangedCallCount = 0;
    var dataSource = new DataSource({
        pageSize: 2,
        store: {
            type: "array",
            onLoading: function(e) {
                loadingArgs.push(e);
            },
            data: [
                { id: "a", text: "Item 1" },
                { id: "A", text: "Item 2" },
                { id: "b", text: "Item 3" },
                { id: "B", text: "Item 4" },
            ],
            key: "id"
        }
    });

    var selection = new Selection({
        onSelectionChanged: function(args) {
            selectionChangedCallCount++;
            assert.deepEqual(args.selectedItems, [{ id: "b", text: "Item 3" }], "selectedItems is right");
            assert.deepEqual(args.selectedItemKeys, ["b"], "selectedItemsKeys is right");
            assert.deepEqual(args.addedItemKeys, ["b"], "addedItemKeys is right");
            assert.deepEqual(args.removedItemKeys, [], "removedItemKeys is right");
        },
        key: function() {
            var store = dataSource && dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            var store = dataSource.store();
            return store && store.keyOf(item);
        },
        load: function(options) {
            return dataSource && dataSource.store().load(options);
        },
        dataFields: function() {
            return dataSource.select();
        },
        plainItems: function() {
            return dataSource.items();
        },
        filter: function() {
            return dataSource && dataSource.filter();
        }
    });

    dataSource.load();
    loadingArgs = [];

    // act
    selection.selectedItemKeys(["b"]);

    // assert
    assert.equal(selectionChangedCallCount, 1, "selectionChanged is called once");
    assert.equal(loadingArgs.length, 1, "one loading during selection");
    assert.deepEqual(loadingArgs[0].filter, ["id", "=", "b"], "loading filter");
});

QUnit.test("selection should works with complex key", function(assert) {
    var selectionChangedArgs = [];
    var dataSource = new DataSource({
        pageSize: 2,
        store: {
            type: "array",
            data: [
                { data: { id: 1 }, text: "Item 1" },
                { data: { id: 2 }, text: "Item 2" },
                { data: { id: 3 }, text: "Item 3" }
            ],
            key: "data.id"
        }
    });

    var selection = new Selection({
        onSelectionChanged: function(args) {
            selectionChangedArgs.push(args);
        },
        key: function() {
            var store = dataSource && dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            var store = dataSource.store();
            return store && store.keyOf(item);
        },
        load: function(options) {
            return dataSource && dataSource.store().load(options);
        },
        dataFields: function() {
            return dataSource.select();
        },
        plainItems: function() {
            return dataSource.items();
        },
        filter: function() {
            return dataSource && dataSource.filter();
        }
    });

    dataSource.load();

    // act
    selection.selectedItemKeys([2]);

    // assert
    assert.equal(selectionChangedArgs.length, 1, "selectionChanged is called once");
    assert.deepEqual(selectionChangedArgs[0].selectedItemKeys, [2], "selectedItemsKeys is right");
    assert.deepEqual(selectionChangedArgs[0].selectedItems, [{ data: { id: 2 }, text: "Item 2" }], "selectedItems is right");
});

QUnit.test("selection module should support object returned by load method", function(assert) {
    var selectionChangedHandler = sinon.spy();

    var selection = new Selection({
        load: function(options) {
            return $.Deferred().resolve({ data: [{ key: '1' }], totalCount: 1 });
        },
        key: function() {
            return "key";
        },
        keyOf: function(item) {
            return item.key;
        },
        plainItems: function() {
            return [{ key: '1' }];
        },
        onSelectionChanged: selectionChangedHandler,
        equalByReference: false
    });
    selection.setSelection([{ key: '2' }]);
    assert.equal(selectionChangedHandler.callCount, 1, "selectionChanged should be fired");
});

// T547950
QUnit.test("focusedItemIndex should be reset to -1 after select all", function(assert) {
    var dataSource = createDataSource(this.data, { key: "id" }),
        selection = new Selection({
            key: function() {
                var store = dataSource.store();
                return store.key();
            },
            keyOf: function(item) {
                var store = dataSource.store();
                return store.keyOf(item);
            },
            dataFields: function() {
                return dataSource.select();
            },
            plainItems: function() {
                return dataSource.items();
            },
            load: function(options) {
                return dataSource.store().load(options);
            }
        });

    selection.changeItemSelection(1);

    assert.strictEqual(selection._focusedItemIndex, 1, "focusedItemIndex");

    selection.selectAll();

    assert.strictEqual(selection._focusedItemIndex, -1, "focusedItemIndex");
});

// T547950
QUnit.test("focusedItemIndex should be reset to -1 after deselect all", function(assert) {
    var dataSource = createDataSource(this.data, { key: "id" }),
        selection = new Selection({
            key: function() {
                var store = dataSource.store();
                return store.key();
            },
            keyOf: function(item) {
                var store = dataSource.store();
                return store.keyOf(item);
            },
            dataFields: function() {
                return dataSource.select();
            },
            plainItems: function() {
                return dataSource.items();
            },
            load: function(options) {
                return dataSource.store().load(options);
            }
        });

    selection.changeItemSelection(1);

    assert.strictEqual(selection._focusedItemIndex, 1, "focusedItemIndex");

    selection.deselectAll();

    assert.strictEqual(selection._focusedItemIndex, -1, "focusedItemIndex");
});


var createDeferredSelection = function(data, options, dataSource) {
    return new Selection($.extend({
        deferred: true,
        key: function() {
            var store = dataSource && dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            var store = dataSource.store();
            return store && store.keyOf(item);
        },
        load: function(options) {
            return dataSource && dataSource.store().load(options);
        },
        dataFields: function() {
            return dataSource.select();
        },
        plainItems: function() {
            return dataSource.items();
        },
        filter: function() {
            return dataSource && dataSource.filter();
        }
    }, options));
};


QUnit.module("Deferred mode", {
    beforeEach: function() {
        this.data = [
            { id: 1, name: 'Alex', age: 15 },
            { id: 2, name: 'Dan', age: 20 },
            { id: 3, name: 'Vadim', age: 17 },
            { id: 4, name: 'Dmitry', age: 18 },
            { id: 5, name: 'Sergey', age: 18 },
            { id: 6, name: 'Kate', age: 19 },
            { id: 7, name: 'Dan', age: 16 }
        ];

        this.dataSource = createDataSource(this.data, { key: "id" }, { pageSize: 5 });
        this.dataSource.load();

        this.createDeferredSelection = function(data, options) {
            return createDeferredSelection(data, options, this.dataSource);
        };
    }
});

QUnit.test("Key is required", function(assert) {
    assert.throws(function() {
        var selection = createDeferredSelection(this.data, {}, createDataSource(this.data, { }, { }));
        selection.selectedItemKeys();
    }, function(ex) {
        assert.ok(ex.message.indexOf("E1042") === 0);
        return true;
    });
});

QUnit.test("Key is not required if dataSource not provided yet", function(assert) {

    var selection = createDeferredSelection(this.data, {}, null);
    selection.selectAll();

    assert.ok(selection);
});

QUnit.test("Default selectionFilter", function(assert) {
    // act
    var selection = this.createDeferredSelection(this.data);

    // assert
    assert.deepEqual(selection.selectionFilter(), [], "selectionFilter default value");
    assert.strictEqual(selection.isItemSelected(this.data[0]), false);
    assert.strictEqual(selection.getSelectAllState(), false, "select all is false");
});

QUnit.test("Initialize selectionFilter from options", function(assert) {
    var selectionFilter = ["id", "=", 1];
    // act
    var selection = this.createDeferredSelection(this.data, {
        selectionFilter: selectionFilter
    });

    // assert
    assert.strictEqual(selection.selectionFilter(), selectionFilter, "selectionFilter value");
    assert.strictEqual(selection.getSelectAllState(), undefined);
});

QUnit.test("Change selectionFilter via API", function(assert) {
    var onChanged = sinon.stub(),
        selection = this.createDeferredSelection(this.data, {
            selectionFilter: ["id", "=", 1],
            onSelectionChanged: onChanged
        });
    // act
    var selectionFilter = ["id", "=", 2];
    selection.selectionFilter(selectionFilter);

    // assert
    assert.strictEqual(selection.selectionFilter(), selectionFilter, "changed selectionFilter value");
    assert.strictEqual(onChanged.callCount, 1);
});

QUnit.test("No fire onChanged if filter passed to selection filter equal current selection filter", function(assert) {
    var onChanged = sinon.stub(),
        selection = this.createDeferredSelection(this.data, {
            selectionFilter: ["id", "=", 1],
            onSelectionChanged: onChanged
        });
    // act
    selection.selectionFilter(["id", "=", 1]);

    // assert
    assert.strictEqual(onChanged.callCount, 0);
});

QUnit.test("changeItemSelection should set selectionFilter to expression with key field", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    selection.changeItemSelection(2);

    // assert
    assert.deepEqual(selection.selectionFilter(), ["id", "=", 3], "selection filter");
    assert.strictEqual(selection.getSelectAllState(), undefined, "select all is undefined");
});

QUnit.test("changeItemSelection for several items with control key should add several expressions with key field", function(assert) {
    var selection = this.createDeferredSelection(this.data, {
        selectionFilter: ["id", "=", 1]
    });

    // act
    selection.changeItemSelection(2, { control: true });
    selection.changeItemSelection(3, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [["id", "=", 1], "or", ["id", "=", 3], "or", ["id", "=", 4]], "selection filter");
});

QUnit.test("changeItemSelection twice for one item with control key should not change selectionFilter", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    selection.changeItemSelection(2, { control: true });
    selection.changeItemSelection(2, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [], "selection filter");
});

QUnit.test("changeItemSelection with shift key should add several expressions with key field", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    selection.changeItemSelection(1);
    selection.changeItemSelection(4, { shift: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [["id", "=", 5], "or", ["id", "=", 4], "or", ["id", "=", 3], "or", ["id", "=", 2]], "selection filter");
});

QUnit.test("selectAll when filter is empty", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), null, "selection filter when select all");
    assert.deepEqual(selection.isItemSelected(this.data[0].id, this.data[0]), true, "first item is selected");
    assert.deepEqual(selection.isItemSelected(this.data[1].id, this.data[1]), true, "second item is selected");
    assert.strictEqual(selection.getSelectAllState(), true, "select all is true");
});

QUnit.test("deselectAll when filter is empty", function(assert) {
    var selection = this.createDeferredSelection(this.data, { selectionFilter: ["id", "=", 1] });

    // act
    selection.deselectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [], "selection filter after deselect all");
    assert.deepEqual(selection.isItemSelected(this.data[0]), false, "first item is not selected");
    assert.deepEqual(selection.isItemSelected(this.data[1]), false, "second item is not selected");
    assert.strictEqual(selection.getSelectAllState(), false, "select all is false");
});

QUnit.test("isSelectAll when dataSource is filtered", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(["age", "<", 18]);
    // assert
    assert.deepEqual(selection.selectionFilter(), [], "selection filter");
    assert.strictEqual(selection.getSelectAllState(), false, "select all is true");
});

QUnit.test("selectAll when filter is defined", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(["age", "<", 18]);

    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), ["age", "<", 18], "selection filter when select all");
    assert.strictEqual(selection.getSelectAllState(), true, "select all is true");
});

QUnit.test("changeItemSelection after selectAll", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    selection.selectAll();
    selection.changeItemSelection(1, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), ["!", ["id", "=", 2]], "selection filter when select all");
});

QUnit.test("changeItemSelection after selectAll when filter is defined", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(["age", ">", 18]);
    selection.selectAll();

    selection.changeItemSelection(1, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [["age", ">", 18], "and", ["!", ["id", "=", 2]]], "selection filter when select all");
});

QUnit.test("selectAll several times for different filters", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(["age", "<", 18]);
    selection.selectAll();

    this.dataSource.filter(["age", ">", 20]);
    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [["age", "<", 18], "or", ["age", ">", 20]], "selection filter");
});

QUnit.test("deselectAll when filter is defined", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(["age", "<", 18]);

    selection.deselectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), ["!", ["age", "<", 18]], "selection filter after deselect all");
    assert.strictEqual(selection.getSelectAllState(), false, "select all is false");
});

QUnit.test("deselectAll several times when filter is defined", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(["age", "<", 18]);
    selection.deselectAll();

    this.dataSource.filter(["age", ">", 20]);
    selection.deselectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [["!", ["age", "<", 18]], "and", ["!", ["age", ">", 20]]], "selection filter");
    assert.strictEqual(selection.getSelectAllState(), false, "select all is false");
});

QUnit.test("deselectAll when filter is defined after selectAll", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(["age", ">", 18]);
    selection.selectAll();

    this.dataSource.filter(["age", ">", 20]);
    selection.deselectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [["age", ">", 18], "and", ["!", ["age", ">", 20]]], "selection filter");
});

QUnit.test("deselectAll when filter is defined after selectAll immediately with same filter", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    selection.changeItemSelection(0);

    this.dataSource.filter(["age", ">", 18]);
    selection.selectAll();

    selection.deselectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [["id", "=", 1], "and", ["!", ["age", ">", 18]]], "selection filter");
});

QUnit.test("deselectAll when filter is defined after selectAll not immediately with same filter", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act

    this.dataSource.filter(["age", ">", 18]);
    selection.selectAll();

    selection.changeItemSelection(0, { control: true });

    selection.deselectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [["id", "=", 1], "and", ["!", ["age", ">", 18]]], "selection filter");
});

QUnit.test("selectAll when filter is defined after deselectAll with same filter", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    selection.changeItemSelection(0);

    this.dataSource.filter(["age", ">", 18]);
    selection.deselectAll();

    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [["id", "=", 1], "or", ["age", ">", 18]], "selection filter");
});

QUnit.test("selectAll several times with same filter", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(["age", ">", 18]);
    selection.selectAll();

    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), ["age", ">", 18], "selection filter");
});

QUnit.test("deselectAll when filter is defined after several selectAll", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(["age", "<", 18]);
    selection.selectAll();

    this.dataSource.filter(["age", ">", 20]);
    selection.selectAll();

    this.dataSource.filter(["age", ">", 21]);
    selection.deselectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [[["age", "<", 18], "or", ["age", ">", 20]], "and", ["!", ["age", ">", 21]]], "selection filter");

    for(var i = 0; i < this.data.length; i++) {
        var itemData = this.data[i];
        var selected = itemData.age < 18 || itemData.age === 21;
        assert.equal(selection.isItemSelected(itemData), selected, "item with age " + itemData.age + " is " + (selected ? "selected" : "unselected"));
    }
});

QUnit.test("changeItemSelection before selectAll", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    selection.changeItemSelection(0);

    this.dataSource.filter(["age", ">", 18]);
    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [["id", "=", 1], "or", ["age", ">", 18]], "selection filter");
    assert.strictEqual(selection.getSelectAllState(), true, "select all is true");
});

QUnit.test("changeItemSelection after selectAll", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(["age", ">", 18]);
    selection.selectAll();

    selection.changeItemSelection(1, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [["age", ">", 18], "and", ["!", ["id", "=", 2]]], "selection filter");
    assert.strictEqual(selection.getSelectAllState(), undefined, "select all is undefined");
});

QUnit.test("selectAll when filter with 'or' operation is defined", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter([["age", "=", 15], "or", ["age", "=", 20]]);
    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [["age", "=", 15], "or", ["age", "=", 20]], "selection filter");
    assert.strictEqual(selection.getSelectAllState(), true, "select all is true");
});

QUnit.test("selectAll after deselect one item", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(["age", ">", 18]);
    selection.selectAll();
    selection.changeItemSelection(1, { control: true });
    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [["!", ["id", "=", 2]], "or", ["age", ">", 18]], "selection filter");
    assert.strictEqual(selection.getSelectAllState(), true, "select all is true");
});

QUnit.test("Deselect one item after selectAll", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(["age", ">", 18]);
    selection.changeItemSelection(1, { control: true });
    selection.selectAll();
    selection.changeItemSelection(1, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [[["id", "=", 2], "or", ["age", ">", 18]], "and", ["!", ["id", "=", 2]]], "selection filter");
    assert.strictEqual(selection.getSelectAllState(), undefined, "select all is true");
    assert.strictEqual(selection.isItemSelected(this.data[1]), false, "item 1 should not be selected");
});

QUnit.test("Deselect one item after selectAll when filter contains 'or' operation", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter([["age", "=", 15], "or", ["age", "=", 20]]);
    selection.changeItemSelection(1, { control: true });
    selection.selectAll();
    selection.changeItemSelection(1, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [[["id", "=", 2], "or", [["age", "=", 15], "or", ["age", "=", 20]]], "and", ["!", ["id", "=", 2]]], "selection filter");
    assert.strictEqual(selection.getSelectAllState(), undefined, "select all is true");
    assert.strictEqual(selection.isItemSelected(this.data[1]), false, "item 1 should not be selected");
});

QUnit.test("select and deselect several items", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(["age", ">", 0]);
    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(1, { control: true });
    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(1, { control: true });

    // assert
    assert.strictEqual(selection.getSelectAllState(), undefined, "select all is undefined");
    assert.strictEqual(selection.isItemSelected(this.data[0]), false, "item 0 should not be selected");
    assert.strictEqual(selection.isItemSelected(this.data[1]), false, "item 1 should not be selected");
    assert.strictEqual(selection.isItemSelected(this.data[2]), false, "item 2 should not be selected");
});

QUnit.test("deselectAll after selectAll when filter by key values is defined", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter([["id", "=", 1], "or", ["id", "=", 2]]);
    selection.selectAll();
    selection.deselectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [], "selection filter");
    assert.strictEqual(selection.getSelectAllState(), false, "select all is false");
    var selectedItems;
    selection.getSelectedItems().done(function(items) {
        selectedItems = items;
    });
    assert.deepEqual(selectedItems, [], "no selected items");
});

QUnit.test("getSelectedItems returns deferred", function(assert) {
    var selectedItems,
        selection = this.createDeferredSelection(this.data, {
            selectionFilter: [["id", "=", 1], "or", ["age", ">", 18]]
        });

    // act
    selection.getSelectedItems().done(function(items) {
        selectedItems = items;
    });

    // assert
    assert.deepEqual(selectedItems, [this.data[0], this.data[1], this.data[5]], "selected items");
});

QUnit.test("getSelectedItemKeys returns deferred", function(assert) {
    var selectedKeys,
        selection = this.createDeferredSelection(this.data, {
            selectionFilter: [["id", "=", 1], "or", ["age", ">", 18]]
        });

    // act
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });

    // assert
    assert.deepEqual(selectedKeys, [1, 2, 6], "selected keys");
});


QUnit.test("selectedItemKeys", function(assert) {
    var selection = this.createDeferredSelection(this.data, {});

    // act
    selection.selectedItemKeys([1]);
    selection.selectedItemKeys([2, 4]).done(function() {
        assert.ok(true, "selectedItems key return Deferred");
    });

    // assert
    selection.getSelectedItemKeys().done(function(keys) {
        assert.deepEqual(keys, [2, 4], "selected item keys");
    });

});

QUnit.test("selectedItemKeys with preserve", function(assert) {
    var selection = this.createDeferredSelection(this.data, {
    });

    // act
    selection.selectedItemKeys([1, 2]);
    selection.selectedItemKeys([2, 4], true);
    // assert
    selection.getSelectedItemKeys().done(function(keys) {
        assert.deepEqual(keys, [1, 2, 4], "selected item keys");
    });

});

QUnit.test("selectedItemKeys deselect item", function(assert) {
    var selection = this.createDeferredSelection(this.data, {
    });

    // act
    selection.selectedItemKeys([1, 2, 4]);
    selection.selectedItemKeys([2, 4], true, true);
    // assert
    selection.getSelectedItemKeys().done(function(keys) {
        assert.deepEqual(keys, [1], "selected item keys");
    });

});

QUnit.test("selectedItemKeys deselect item", function(assert) {
    var selectionChangedIsCalled = false,
        selection = this.createDeferredSelection(this.data, {
            onSelectionChanged: function() {
                selectionChangedIsCalled = true;
            }
        });

    // act
    selection.selectedItemKeys([1, 2]);
    selection.selectedItemKeys([2, 4], true);
    // assert
    selection.getSelectedItemKeys().done(function(keys) {
        assert.deepEqual(keys, [1, 2, 4], "selected item keys");
    });

    assert.ok(selectionChangedIsCalled);

});

QUnit.module("Deferred mode. Complex key", {
    beforeEach: function() {
        this.data = [
            { id: 1, name: 'Alex', age: 15 },
            { id: 2, name: 'Dan', age: 20 },
            { id: 3, name: 'Vadim', age: 17 },
            { id: 4, name: 'Dmitry', age: 18 },
            { id: 5, name: 'Sergey', age: 18 },
            { id: 6, name: 'Kate', age: 19 },
            { id: 7, name: 'Dan', age: 16 }
        ];

        this.dataSource = createDataSource(this.data, { key: ["id", "name"] }, { pageSize: 5 });
        this.dataSource.load();

        this.createDeferredSelection = function(data, options) {
            return createDeferredSelection(data, options, this.dataSource);
        };
    }
});

QUnit.test("Select item", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    selection.changeItemSelection(0);
    // assert
    assert.deepEqual(selection.selectionFilter(), [["id", "=", 1], "and", ["name", "=", "Alex"]], "selectionFilter value");
});

QUnit.test("Deselect item", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    selection.selectAll();

    selection.changeItemSelection(0, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), ["!", [["id", "=", 1], "and", ["name", "=", "Alex"]]], "selectionFilter value");
});

QUnit.test("Select and deselect item", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    selection.changeItemSelection(0);
    selection.changeItemSelection(0, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [], "selectionFilter value");
});

// T470886
QUnit.test("Deselect and select item when selected all", function(assert) {
    var selection = this.createDeferredSelection(this.data);

    selection.selectAll();

    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(0, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), null, "selectionFilter value");
});

QUnit.module("filter length restriction", {
    beforeEach: function() {
        var data = this.data = [
            { id: 1, name: 'Alex', age: 15 },
            { id: 2, name: 'Dan', age: 20 },
            { id: 3, name: 'Vadim', age: 17 },
            { id: 4, name: 'Dmitry', age: 18 },
            { id: 5, name: 'Sergey', age: 18 },
            { id: 6, name: 'Kate', age: 19 },
            { id: 7, name: 'Dan', age: 16 }
        ];

        this.load = sinon.spy(function(options) {
            return new ArrayStore({ data: data, key: "id" }).load(options);
        });

        this.dataSource = new DataSource({
            store: new CustomStore({
                key: "id",
                load: this.load
            })
        });

        this.dataSource.load();

        this.load.reset();

        this.createDeferredSelection = function(data, options) {
            return createDeferredSelection(data, options, this.dataSource);
        };
    }
});

QUnit.test("Pass filter to load when selection filter", function(assert) {
    var selectedKeys,
        selection = this.createDeferredSelection(this.data, {
            filterLengthRestriction: 70,
            selectionFilter: [["id", "=", 1], "or", ["age", ">", 18]]
        });

    // act
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });
    // assert
    assert.strictEqual(this.load.lastCall.args[0].filter, selection.selectionFilter());

    assert.deepEqual(selectedKeys, [1, 2, 6], "selected keys");
});

QUnit.test("not pass filter to loadOptions", function(assert) {
    var selectedKeys,
        selection = this.createDeferredSelection(this.data, {
            maxFilterLengthInRequest: 65,
            selectionFilter: [["id", "=", 1], "or", ["age", ">", 18]]
        });

    // act
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });
    // assert
    assert.strictEqual(this.load.lastCall.args[0].filter, undefined);

    assert.deepEqual(selectedKeys, [1, 2, 6], "selected keys");
});

QUnit.test("not pass filter to loadOptions. getSelectedItems", function(assert) {
    var selectedKeys,
        selection = this.createDeferredSelection(this.data, {
            maxFilterLengthInRequest: 65,
            selectionFilter: [["id", "=", 1], "or", ["age", ">", 18]]
        });

    // act
    selection.getSelectedItems().done(function(keys) {
        selectedKeys = keys;
    });
    // assert
    assert.strictEqual(this.load.lastCall.args[0].filter, undefined);

    assert.deepEqual(selectedKeys, [this.data[0], this.data[1], this.data[5]], "selected keys");
});

QUnit.test("filterLengthRestriction is undefined", function(assert) {
    var selectedKeys,
        selection = this.createDeferredSelection(this.data, {
            selectionFilter: [["id", "=", 1], "or", ["age", ">", 18]]
        });

    // act
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });
    // assert
    assert.strictEqual(this.load.lastCall.args[0].filter, selection.selectionFilter());

    assert.deepEqual(selectedKeys, [1, 2, 6], "selected keys");
});

QUnit.test("filterLengthRestriction is 0", function(assert) {
    var selectedKeys,
        selection = this.createDeferredSelection(this.data, {
            maxFilterLengthInRequest: 0,
            selectionFilter: [["id", "=", 1], "or", ["age", ">", 18]]
        });

    // act
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });
    // assert
    assert.strictEqual(this.load.lastCall.args[0].filter, selection.selectionFilter());

    assert.deepEqual(selectedKeys, [1, 2, 6], "selected keys");
});
