import $ from 'jquery';
import errors from 'ui/widget/ui.errors';
import Selection from '__internal/ui/selection/m_selection';
import Guid from 'core/guid';
import { DataSource } from 'common/data/data_source/data_source';
import { CustomStore } from 'common/data/custom_store';
import ArrayStore from 'common/data/array_store';

const createDataSource = function(data, storeOptions, dataSourceOptions) {
    const arrayStore = new ArrayStore(storeOptions ? $.extend(true, { data: data }, storeOptions) : data);
    const dataSource = new DataSource($.extend(true, { store: arrayStore, requireTotalCount: true, _preferSync: true }, dataSourceOptions));
    return dataSource;
};

QUnit.testStart(function() { });

QUnit.module('Selection',
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

QUnit.test('Select all by one page', function(assert) {
    const dataSource = createDataSource(this.data, {}, { paginate: true, pageSize: 3 });

    const expectedData = [];
    for(let i = 0; i < 3; i++) {
        expectedData.push(this.data[i]);
    }

    let selectionChangedCallCount = 0;

    const selectionChangedHandler = function(args) {
        selectionChangedCallCount++;
        assert.deepEqual(args.selectedItems, expectedData, 'selectedItems is right');
        assert.deepEqual(args.selectedItemKeys, expectedData, 'selectedItemsKeys is right');
        assert.deepEqual(args.addedItemKeys, expectedData, 'addedItemKeys is right');
        assert.deepEqual(args.removedItemKeys, [], 'removedItemKeys is right');
    };

    const selection = new Selection({
        key: function() {
            const store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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

    assert.strictEqual(selectionChangedCallCount, 1, 'selectionChanged called once');
    assert.strictEqual(selection.getSelectAllState(true), true, 'select all is true');
});

QUnit.test('Select all with disabled items', function(assert) {
    this.data[2].disabled = true;
    const dataSource = createDataSource(this.data, {}, { paginate: true, pageSize: 3 });

    const expectedData = [];
    for(let i = 0; i < 2; i++) {
        expectedData.push(this.data[i]);
    }

    let selectionChangedCallCount = 0;

    const selectionChangedHandler = function(args) {
        selectionChangedCallCount++;
        assert.deepEqual(args.selectedItems, expectedData, 'selectedItems is right');
        assert.deepEqual(args.selectedItemKeys, expectedData, 'selectedItemsKeys is right');
        assert.deepEqual(args.addedItemKeys, expectedData, 'addedItemKeys is right');
        assert.deepEqual(args.removedItemKeys, [], 'removedItemKeys is right');
    };

    const selection = new Selection({
        key: function() {
            const store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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

    assert.strictEqual(selectionChangedCallCount, 1, 'selectionChanged called once');
    assert.strictEqual(selection.getSelectAllState(true), true, 'select all is true');
});

// T532618
QUnit.test('Select all by one page should skip non-selectable items', function(assert) {
    const dataSource = createDataSource(this.data, {}, { paginate: true, pageSize: 3 });

    const selection = new Selection({
        key: function() {
            const store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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

    assert.strictEqual(selection.getSelectAllState(true), true, 'select all is true');
    assert.deepEqual(selection.getSelectedItems(), [this.data[1], this.data[2]], 'selected items');
});

QUnit.module('Selection with all pages mode: ',
    {
        beforeEach: function() {
            const items = [
                { id: 1 },
                { id: 2, disabled: true },
            ];
            const dataSource = createDataSource(items, { key: 'id' }, { paginate: true, pageSize: 1 });

            this.selection = new Selection({
                key: function() {
                    const store = dataSource.store();
                    return store && store.key();
                },
                keyOf: function(item) {
                    const store = dataSource.store();
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
                }
            });
            this.dataSource = dataSource;
        }
    }, function() {
        QUnit.test('Select all should not select disabled items when not ignoreDisabledItems', function(assert) {
            this.dataSource.load();
            this.selection.selectAll();

            assert.deepEqual(this.selection.getSelectedItemKeys(), [1], 'selected item keys are correct');
        });

        QUnit.test('Select all should select disabled items when ignoreDisabledItems', function(assert) {
            this.selection.options.ignoreDisabledItems = true;
            this.dataSource.load();
            this.selection.selectAll();

            assert.deepEqual(this.selection.getSelectedItemKeys(), [1, 2], 'selected item keys are correct');
        });

        QUnit.test('Deselect all should not unselect disabled items when not ignoreDisabledItems', function(assert) {
            this.dataSource.load();
            this.selection.options.ignoreDisabledItems = true;
            this.selection.selectAll();
            this.selection.options.ignoreDisabledItems = false;
            this.selection.deselectAll();

            assert.deepEqual(this.selection.getSelectedItemKeys(), [2], 'selected item keys are correct');
        });

        QUnit.test('Deselect all should unselect disabled items when ignoreDisabledItems', function(assert) {
            this.selection.options.ignoreDisabledItems = true;
            this.dataSource.load();
            this.selection.selectAll();
            this.selection.deselectAll();

            assert.deepEqual(this.selection.getSelectedItemKeys(), [], 'selected item keys are correct');
        });
    });

QUnit.test('Select all for all pages when item is disabled', function(assert) {
    this.data[5].disabled = true;
    const dataSource = createDataSource(this.data, { key: 'id' }, { paginate: true, pageSize: 3 });

    const selection = new Selection({
        key: function() {
            const store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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
        }
    });

    dataSource.load();
    selection.selectAll();

    assert.deepEqual(selection.getSelectedItemKeys(), [1, 2, 3, 4, 5, 7], 'selected item keys are correct');
    assert.strictEqual(selection.getSelectAllState(), true, 'select all is correct');
});

QUnit.test('Select all by one page and changeItemSelection', function(assert) {
    const dataSource = createDataSource(this.data, {}, { paginate: true, pageSize: 3 });

    const expectedData = [];
    for(let i = 0; i < 3; i++) {
        expectedData.push(this.data[i]);
    }

    let selectionChangedCallCount = 0;

    const selectionChangedHandler = function() {
        selectionChangedCallCount++;
    };

    const selection = new Selection({
        key: function() {
            const store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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

    assert.strictEqual(selectionChangedCallCount, 2, 'selectionChanged called once');
    assert.strictEqual(selection.getSelectAllState(true), undefined, 'select all is true');
});

QUnit.test('Deselect all by one page', function(assert) {
    const dataSource = createDataSource(this.data, {}, { paginate: true, pageSize: 3 });

    const expectedData = [];
    for(let i = 3; i < this.data.length; i++) {
        expectedData.push(this.data[i]);
    }

    let selectionChangedCallCount = 0;

    const selectionChangedHandler = function() {
        selectionChangedCallCount++;
    };

    const selection = new Selection({
        key: function() {
            const store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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
    assert.strictEqual(selection.getSelectAllState(true), false, 'select all is false');
});

QUnit.test('Select all by one page when key is defined', function(assert) {
    const dataSource = createDataSource(this.data, { key: 'id' }, { paginate: true, pageSize: 3 });

    let selectionChangedCallCount = 0;

    const selectionChangedHandler = function() {
        selectionChangedCallCount++;
    };

    const selection = new Selection({
        key: function() {
            const store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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

    assert.strictEqual(selectionChangedCallCount, 2, 'selectionChanged should be called twice');
    assert.deepEqual(selection.getSelectedItemKeys(), [4, 5, 6, 7], 'selected item keys are correct');
    assert.strictEqual(selection.getSelectAllState(true), false, 'select all is false');
});

QUnit.test('Deselect all for all pages when key is defined', function(assert) {
    const dataSource = createDataSource(this.data, { key: 'id' }, { paginate: true, pageSize: 3 });

    let selectionChangedCallCount = 0;

    const selectionChangedHandler = function() {
        selectionChangedCallCount++;
    };

    const selection = new Selection({
        key: function() {
            const store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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

    assert.strictEqual(selectionChangedCallCount, 2, 'selectionChanged should be called twice');
    assert.deepEqual(selection.getSelectedItemKeys(), [], 'selected item keys are correct');
    assert.strictEqual(selection.getSelectAllState(), false, 'select all is false');
});

// T450615
QUnit.test('clearSelection should work if it call after select', function(assert) {
    const dataSource = createDataSource(this.data, { key: 'id' }, { paginate: true, pageSize: 3 });

    const selectionChangedHandler = sinon.spy();

    const selection = new Selection({
        key: function() {
            const store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
            return store && store.keyOf(item);
        },
        dataFields: function() {
            return dataSource.select();
        },
        plainItems: function() {
            return dataSource.items();
        },
        load: function(options) {
            const d = $.Deferred();
            setTimeout(function() {
                dataSource.store().load(options).done(d.resolve).fail(d.reject);
            });
            return d;
        },
        onSelectionChanged: selectionChangedHandler
    });

    dataSource.load();

    selection.select([1, 6, 7]);
    assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged is not raised yet');

    // act
    selection.clearSelection();
    this.clock.tick(10);

    // assert
    assert.deepEqual(selection.getSelectedItemKeys(), [], 'selection is cleared');
    assert.strictEqual(selectionChangedHandler.callCount, 2, 'selectionChanged is raised twice');
});

QUnit.test('Equal by reference', function(assert) {
    const dataSource = createDataSource(this.data, {}, {});

    const expectedData = [];
    expectedData.push(this.data[0]);

    const selectionChangedHandler = function(args) {
        assert.equal(args.selectedItems[0], expectedData[0], 'selectedItems is right');
        assert.equal(args.selectedItemKeys[0], expectedData[0], 'selectedItemsKeys is right');
        assert.deepEqual(args.addedItemKeys, expectedData, 'addedItemKeys is right');
        assert.deepEqual(args.removedItemKeys, [], 'removedItemKeys is right');
    };

    const selection = new Selection({
        key: function() {
            const store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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

QUnit.test('Equal by object', function(assert) {
    let dataSource;
    const expectedData = [];
    let countCallErrorLog = 0;
    const originalLog = errors.log;
    let selectionChangedHandler;

    errors.log = function() {
        countCallErrorLog++;
    };
    try {
        dataSource = createDataSource(this.data, {}, {});
        expectedData.push(this.data[0]);
        selectionChangedHandler = function(args) {
            assert.equal(args.selectedItems[0], expectedData[0], 'selectedItems is right');
            assert.equal(args.selectedItemKeys[0], expectedData[0], 'selectedItemsKeys is right');
            assert.deepEqual(args.addedItemKeys, expectedData, 'addedItemKeys is right');
            assert.deepEqual(args.removedItemKeys, [], 'removedItemKeys is right');
        };
        const selection = new Selection({
            key: function() {
                const store = dataSource.store();
                return store && store.key();
            },
            keyOf: function(item) {
                const store = dataSource.store();
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
        assert.equal(countCallErrorLog, 0, 'no error');
    } finally {
        errors.log = originalLog;
    }
});

QUnit.test('Equal by reference with equalByReference', function(assert) {
    const dataSource = createDataSource(this.data, {}, {});

    const expectedData = [];
    expectedData.push(this.data[0]);

    const selectionChangedHandler = function(args) {
        assert.equal(args.selectedItems[0], expectedData[0], 'selectedItems is right');
        assert.equal(args.selectedItemKeys[0], expectedData[0], 'selectedItemsKeys is right');
        assert.equal(args.addedItemKeys[0], expectedData[0], 'addedItemKeys is right');
        assert.deepEqual(args.removedItemKeys, [], 'removedItemKeys is right');
    };

    const selection = new Selection({
        key: function() {
            const store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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

QUnit.test('Equal by object with equalByReference', function(assert) {
    const dataSource = createDataSource(this.data, {}, {});

    dataSource.load();

    const selectionChangedHandler = sinon.stub();

    const selection = new Selection({
        key: function() {
            const store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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

    assert.equal(selectionChangedHandler.callCount, 1, 'selectionChanged should be fired');

    assert.strictEqual(selectionChangedHandler.lastCall.args[0].addedItemKeys.length, 0);
    assert.strictEqual(selectionChangedHandler.lastCall.args[0].removedItemKeys.length, 0);
});

QUnit.test('items should be selected when keyType is Guid', function(assert) {

    const items = [{ id: new Guid() }, { id: new Guid() }, { id: new Guid() }];
    const storeOptions = {
        key: 'id',
        keyType: 'Guid',
        data: items
    };
    const dataSource = createDataSource(this.data, storeOptions, {});

    dataSource.load();

    const selectionChangedHandler = sinon.spy();

    const selection = new Selection({
        load: function(options) {
            return dataSource && dataSource.store().load(options);
        },
        key: function() {
            const store = dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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

    assert.equal(selectionChangedHandler.callCount, 1, 'selectionChanged should be fired');
});

QUnit.test('Show warning (W1002) when select item that does not exist', function(assert) {
    // arrange
    let log;
    let selection;
    let dataSource;
    let countCallErrorLog = 0;
    const originalLog = errors.log;
    errors.log = function() {
        countCallErrorLog++;
        log = $.makeArray(arguments);
    };
    try {
        dataSource = createDataSource(this.data, { key: 'id' }, {});
        selection = new Selection({
            key: function() {
                const store = dataSource.store();
                return store && store.key();
            },
            keyOf: function(item) {
                const store = dataSource.store();
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
        assert.equal(countCallErrorLog, 1, 'call error log');
        assert.strictEqual(log[0], 'W1002', 'name of warning');
        assert.strictEqual(log[1], 9, 'key');
    } finally {
        errors.log = originalLog;
    }
});

QUnit.test('Show warning (W1002) when select items that don\'t exist', function(assert) {
    // arrange
    const log = [];
    let selection;
    let dataSource;
    let countCallErrorLog = 0;
    const originalLog = errors.log;
    errors.log = function() {
        countCallErrorLog++;
        log.push($.makeArray(arguments));
    };
    try {
        dataSource = createDataSource(this.data, { key: 'id' }, {});
        selection = new Selection({
            key: function() {
                const store = dataSource.store();
                return store && store.key();
            },
            keyOf: function(item) {
                const store = dataSource.store();
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
        assert.equal(countCallErrorLog, 2, 'call error log');
        assert.strictEqual(log[0][0], 'W1002', 'name of warning');
        assert.strictEqual(log[0][1], 9, 'key');
        assert.strictEqual(log[1][0], 'W1002', 'name of warning');
        assert.strictEqual(log[1][1], 10, 'key');
    } finally {
        errors.log = originalLog;
    }
});

QUnit.test('selection should work with custom store without filter implementation', function(assert) {
    const selectionChangedHandler = function(args) {
        assert.deepEqual(args.selectedItems, [{ id: 2, text: 'Item 2' }], 'selectedItems is right');
        assert.deepEqual(args.selectedItemKeys, [2], 'selectedItemsKeys is right');
        assert.deepEqual(args.addedItemKeys, [2], 'addedItemKeys is right');
        assert.deepEqual(args.removedItemKeys, [], 'removedItemKeys is right');
    };

    const dataSource = new DataSource({
        store: new CustomStore({
            load: function() {
                const d = $.Deferred();
                const items = [
                    { id: 1, text: 'Item 1' },
                    { id: 2, text: 'Item 2' }
                ];

                setTimeout(function() {
                    d.resolve(items);
                }, 0);

                return d.promise();
            },
            key: 'id'
        })
    });

    const selection = new Selection({
        onSelectionChanged: selectionChangedHandler,
        key: function() {
            const store = dataSource && dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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
    this.clock.tick(10);
});

QUnit.test('selection should works with case-sensitive keys if select item is on current page', function(assert) {
    let loadingArgs = [];
    let selectionChangedCallCount = 0;
    const dataSource = new DataSource({
        pageSize: 2,
        store: {
            type: 'array',
            onLoading: function(e) {
                loadingArgs.push(e);
            },
            data: [
                { id: 'a', text: 'Item 1' },
                { id: 'A', text: 'Item 2' },
                { id: 'b', text: 'Item 3' },
                { id: 'B', text: 'Item 4' },
            ],
            key: 'id'
        }
    });

    const selection = new Selection({
        onSelectionChanged: function(args) {
            selectionChangedCallCount++;
            assert.deepEqual(args.selectedItems, [{ id: 'A', text: 'Item 2' }], 'selectedItems is right');
            assert.deepEqual(args.selectedItemKeys, ['A'], 'selectedItemsKeys is right');
            assert.deepEqual(args.addedItemKeys, ['A'], 'addedItemKeys is right');
            assert.deepEqual(args.removedItemKeys, [], 'removedItemKeys is right');
        },
        key: function() {
            const store = dataSource && dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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
    selection.selectedItemKeys(['A']);

    // assert
    assert.equal(selectionChangedCallCount, 1, 'selectionChanged is called once');
    assert.equal(loadingArgs.length, 0, 'no loadings during selection');
});

QUnit.test('selection should works with case-sensitive keys if select item is not on current page', function(assert) {
    let loadingArgs = [];
    let selectionChangedCallCount = 0;
    const dataSource = new DataSource({
        pageSize: 2,
        store: {
            type: 'array',
            onLoading: function(e) {
                loadingArgs.push(e);
            },
            data: [
                { id: 'a', text: 'Item 1' },
                { id: 'A', text: 'Item 2' },
                { id: 'b', text: 'Item 3' },
                { id: 'B', text: 'Item 4' },
            ],
            key: 'id'
        }
    });

    const selection = new Selection({
        onSelectionChanged: function(args) {
            selectionChangedCallCount++;
            assert.deepEqual(args.selectedItems, [{ id: 'b', text: 'Item 3' }], 'selectedItems is right');
            assert.deepEqual(args.selectedItemKeys, ['b'], 'selectedItemsKeys is right');
            assert.deepEqual(args.addedItemKeys, ['b'], 'addedItemKeys is right');
            assert.deepEqual(args.removedItemKeys, [], 'removedItemKeys is right');
        },
        key: function() {
            const store = dataSource && dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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
    selection.selectedItemKeys(['b']);

    // assert
    assert.equal(selectionChangedCallCount, 1, 'selectionChanged is called once');
    assert.equal(loadingArgs.length, 1, 'one loading during selection');
    assert.deepEqual(loadingArgs[0].filter, ['id', '=', 'b'], 'loading filter');
});

QUnit.test('selection should works with complex key', function(assert) {
    const selectionChangedArgs = [];
    const dataSource = new DataSource({
        pageSize: 2,
        store: {
            type: 'array',
            data: [
                { data: { id: 1 }, text: 'Item 1' },
                { data: { id: 2 }, text: 'Item 2' },
                { data: { id: 3 }, text: 'Item 3' }
            ],
            key: 'data.id'
        }
    });

    const selection = new Selection({
        onSelectionChanged: function(args) {
            selectionChangedArgs.push(args);
        },
        key: function() {
            const store = dataSource && dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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
    assert.equal(selectionChangedArgs.length, 1, 'selectionChanged is called once');
    assert.deepEqual(selectionChangedArgs[0].selectedItemKeys, [2], 'selectedItemsKeys is right');
    assert.deepEqual(selectionChangedArgs[0].selectedItems, [{ data: { id: 2 }, text: 'Item 2' }], 'selectedItems is right');
});

// T696853
QUnit.test('selection should works with complex key if key with another item order', function(assert) {
    const selectionChangedArgs = [];
    const dataSource = new DataSource({
        pageSize: 2,
        store: {
            type: 'array',
            data: [
                { data1: { id: 1 }, data2: { id: 1 }, text: 'Item 1' },
                { data1: { id: 2 }, data2: { id: 1 }, text: 'Item 2' },
                { data1: { id: 3 }, data2: { id: 1 }, text: 'Item 3' }
            ],
            key: ['data1.id', 'data2.id']
        }
    });

    const selection = new Selection({
        onSelectionChanged: function(args) {
            selectionChangedArgs.push(args);
        },
        key: function() {
            const store = dataSource && dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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
    selection.selectedItemKeys([{ data2: { id: 1 }, data1: { id: 2 } }]);

    // assert
    assert.equal(selectionChangedArgs.length, 1, 'selectionChanged is called once');
    assert.deepEqual(selectionChangedArgs[0].selectedItemKeys, [{ data1: { id: 2 }, data2: { id: 1 } }], 'selectedItemsKeys is right');
    assert.deepEqual(selectionChangedArgs[0].selectedItems, [{ data1: { id: 2 }, data2: { id: 1 }, text: 'Item 2' }], 'selectedItems is right');
});

QUnit.test('selection module should support object returned by load method', function(assert) {
    const selectionChangedHandler = sinon.spy();

    const selection = new Selection({
        load: function(options) {
            return $.Deferred().resolve({ data: [{ key: '1' }], totalCount: 1 });
        },
        key: function() {
            return 'key';
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
    assert.equal(selectionChangedHandler.callCount, 1, 'selectionChanged should be fired');
});

// T547950
QUnit.test('focusedItemIndex should be reset to -1 after select all', function(assert) {
    const dataSource = createDataSource(this.data, { key: 'id' });
    const selection = new Selection({
        key: function() {
            const store = dataSource.store();
            return store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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

    assert.strictEqual(selection._focusedItemIndex, 1, 'focusedItemIndex');

    selection.selectAll();

    assert.strictEqual(selection._focusedItemIndex, -1, 'focusedItemIndex');
});

// T547950
QUnit.test('focusedItemIndex should be reset to -1 after deselect all', function(assert) {
    const dataSource = createDataSource(this.data, { key: 'id' });
    const selection = new Selection({
        key: function() {
            const store = dataSource.store();
            return store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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

    assert.strictEqual(selection._focusedItemIndex, 1, 'focusedItemIndex');

    selection.deselectAll();

    assert.strictEqual(selection._focusedItemIndex, -1, 'focusedItemIndex');
});

QUnit.test('selectedItemKeys with key = 0', function(assert) {
    const selectionChangedArgs = [];
    const dataSource = new DataSource({
        pageSize: 2,
        store: {
            type: 'array',
            data: [
                { data: { id: 0 }, text: 'Item 0' },
                { data: { id: 1 }, text: 'Item 1' },
                { data: { id: 2 }, text: 'Item 2' }
            ],
            key: 'data.id'
        }
    });

    const selection = new Selection({
        onSelectionChanged: function(args) {
            selectionChangedArgs.push(args);
        },
        key: function() {
            const store = dataSource && dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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
    selection.selectedItemKeys(0);

    // assert
    assert.equal(selectionChangedArgs.length, 1, 'selectionChanged is called once');
    assert.deepEqual(selectionChangedArgs[0].selectedItemKeys, [0], 'selectedItemsKeys is right');
    assert.deepEqual(selectionChangedArgs[0].selectedItems, [{ data: { id: 0 }, text: 'Item 0' }], 'selectedItems is right');
});


const createDeferredSelection = function(data, options, dataSource) {
    return new Selection($.extend({
        deferred: true,
        key: function() {
            const store = dataSource && dataSource.store();
            return store && store.key();
        },
        keyOf: function(item) {
            const store = dataSource.store();
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


QUnit.module('Deferred mode', {
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

        this.dataSource = createDataSource(this.data, { key: 'id' }, { pageSize: 5 });
        this.dataSource.load();

        this.createDeferredSelection = function(data, options) {
            return createDeferredSelection(data, options, this.dataSource);
        };
    }
});

QUnit.test('Key is required', function(assert) {
    assert.throws(function() {
        const selection = createDeferredSelection(this.data, {}, createDataSource(this.data, { }, { }));
        selection.selectedItemKeys();
    }, function(ex) {
        assert.strictEqual(ex.message.indexOf('E1042'), 0);
        return true;
    });
});

QUnit.test('Key is not required if dataSource not provided yet', function(assert) {

    const selection = createDeferredSelection(this.data, {}, null);
    selection.selectAll();

    assert.ok(selection);
});

QUnit.test('Default selectionFilter', function(assert) {
    // act
    const selection = this.createDeferredSelection(this.data);

    // assert
    assert.deepEqual(selection.selectionFilter(), [], 'selectionFilter default value');
    assert.strictEqual(selection.isItemSelected(this.data[0]), false);
    assert.strictEqual(selection.getSelectAllState(), false, 'select all is false');
});

QUnit.test('Initialize selectionFilter from options', function(assert) {
    const selectionFilter = ['id', '=', 1];
    // act
    const selection = this.createDeferredSelection(this.data, {
        selectionFilter: selectionFilter
    });

    // assert
    assert.strictEqual(selection.selectionFilter(), selectionFilter, 'selectionFilter value');
    assert.strictEqual(selection.getSelectAllState(), undefined);
});

QUnit.test('Change selectionFilter via API', function(assert) {
    const onChanged = sinon.stub();
    const selection = this.createDeferredSelection(this.data, {
        selectionFilter: ['id', '=', 1],
        onSelectionChanged: onChanged
    });
    // act
    const selectionFilter = ['id', '=', 2];
    selection.selectionFilter(selectionFilter);

    // assert
    assert.strictEqual(selection.selectionFilter(), selectionFilter, 'changed selectionFilter value');
    assert.strictEqual(onChanged.callCount, 1);
});

QUnit.test('No fire onChanged if filter passed to selection filter equal current selection filter', function(assert) {
    const onChanged = sinon.stub();
    const selection = this.createDeferredSelection(this.data, {
        selectionFilter: ['id', '=', 1],
        onSelectionChanged: onChanged
    });
    // act
    selection.selectionFilter(['id', '=', 1]);

    // assert
    assert.strictEqual(onChanged.callCount, 0);
});

QUnit.test('changeItemSelection should set selectionFilter to expression with key field', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    selection.changeItemSelection(2);

    // assert
    assert.deepEqual(selection.selectionFilter(), ['id', '=', 3], 'selection filter');
    assert.strictEqual(selection.getSelectAllState(), undefined, 'select all is undefined');
});

QUnit.test('changeItemSelection for several items with control key should add several expressions with key field', function(assert) {
    const selection = this.createDeferredSelection(this.data, {
        selectionFilter: ['id', '=', 1]
    });

    // act
    selection.changeItemSelection(2, { control: true });
    selection.changeItemSelection(3, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [['id', '=', 1], 'or', ['id', '=', 3], 'or', ['id', '=', 4]], 'selection filter');
});

QUnit.test('changeItemSelection twice for one item with control key should not change selectionFilter', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    selection.changeItemSelection(2, { control: true });
    selection.changeItemSelection(2, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [], 'selection filter');
});

QUnit.test('changeItemSelection with shift key should add several expressions with key field', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    selection.changeItemSelection(1);
    selection.changeItemSelection(4, { shift: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [['id', '=', 2], 'or', ['id', '=', 5], 'or', ['id', '=', 4], 'or', ['id', '=', 3]], 'selection filter');
});

// T655219
QUnit.test('changeItemSelection with shift key two times', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    selection.changeItemSelection(1);
    selection.changeItemSelection(4, { shift: true });
    selection.changeItemSelection(2, { shift: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [['id', '=', 2], 'or', ['id', '=', 3]], 'selection filter');
});

QUnit.test('selectAll when filter is empty', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), null, 'selection filter when select all');
    assert.deepEqual(selection.isItemSelected(this.data[0].id, this.data[0]), true, 'first item is selected');
    assert.deepEqual(selection.isItemSelected(this.data[1].id, this.data[1]), true, 'second item is selected');
    assert.strictEqual(selection.getSelectAllState(), true, 'select all is true');
});

QUnit.test('deselectAll when filter is empty', function(assert) {
    const selection = this.createDeferredSelection(this.data, { selectionFilter: ['id', '=', 1] });

    // act
    selection.deselectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [], 'selection filter after deselect all');
    assert.deepEqual(selection.isItemSelected(this.data[0]), false, 'first item is not selected');
    assert.deepEqual(selection.isItemSelected(this.data[1]), false, 'second item is not selected');
    assert.strictEqual(selection.getSelectAllState(), false, 'select all is false');
});

QUnit.test('isSelectAll when dataSource is filtered', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(['age', '<', 18]);
    // assert
    assert.deepEqual(selection.selectionFilter(), [], 'selection filter');
    assert.strictEqual(selection.getSelectAllState(), false, 'select all is true');
});

QUnit.test('selectAll when filter is defined', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(['age', '<', 18]);

    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), ['age', '<', 18], 'selection filter when select all');
    assert.strictEqual(selection.getSelectAllState(), true, 'select all is true');
});

QUnit.test('changeItemSelection after selectAll', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    selection.selectAll();
    selection.changeItemSelection(1, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), ['!', ['id', '=', 2]], 'selection filter when select all');
});

QUnit.test('changeItemSelection after selectAll when filter is defined', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(['age', '>', 18]);
    selection.selectAll();

    selection.changeItemSelection(1, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [['age', '>', 18], 'and', ['!', ['id', '=', 2]]], 'selection filter when select all');
});

QUnit.test('selectAll several times for different filters', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(['age', '<', 18]);
    selection.selectAll();

    this.dataSource.filter(['age', '>', 20]);
    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [['age', '<', 18], 'or', ['age', '>', 20]], 'selection filter');
});

QUnit.test('deselectAll when filter is defined', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(['age', '<', 18]);

    selection.deselectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), ['!', ['age', '<', 18]], 'selection filter after deselect all');
    assert.strictEqual(selection.getSelectAllState(), false, 'select all is false');
});

QUnit.test('deselectAll several times when filter is defined', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(['age', '<', 18]);
    selection.deselectAll();

    this.dataSource.filter(['age', '>', 20]);
    selection.deselectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [['!', ['age', '<', 18]], 'and', ['!', ['age', '>', 20]]], 'selection filter');
    assert.strictEqual(selection.getSelectAllState(), false, 'select all is false');
});

QUnit.test('deselectAll when filter is defined after selectAll', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(['age', '>', 18]);
    selection.selectAll();

    this.dataSource.filter(['age', '>', 20]);
    selection.deselectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [['age', '>', 18], 'and', ['!', ['age', '>', 20]]], 'selection filter');
});

QUnit.test('deselectAll when filter is defined after selectAll immediately with same filter', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    selection.changeItemSelection(0);

    this.dataSource.filter(['age', '>', 18]);
    selection.selectAll();

    selection.deselectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [['id', '=', 1], 'and', ['!', ['age', '>', 18]]], 'selection filter');
});

QUnit.test('deselectAll when filter is defined after selectAll not immediately with same filter', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act

    this.dataSource.filter(['age', '>', 18]);
    selection.selectAll();

    selection.changeItemSelection(0, { control: true });

    selection.deselectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [['id', '=', 1], 'and', ['!', ['age', '>', 18]]], 'selection filter');
});

QUnit.test('selectAll when filter is defined after deselectAll with same filter', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    selection.changeItemSelection(0);

    this.dataSource.filter(['age', '>', 18]);
    selection.deselectAll();

    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [['id', '=', 1], 'or', ['age', '>', 18]], 'selection filter');
});

QUnit.test('selectAll several times with same filter', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(['age', '>', 18]);
    selection.selectAll();

    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), ['age', '>', 18], 'selection filter');
});

QUnit.test('deselectAll when filter is defined after several selectAll', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(['age', '<', 18]);
    selection.selectAll();

    this.dataSource.filter(['age', '>', 20]);
    selection.selectAll();

    this.dataSource.filter(['age', '>', 21]);
    selection.deselectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [[['age', '<', 18], 'or', ['age', '>', 20]], 'and', ['!', ['age', '>', 21]]], 'selection filter');

    for(let i = 0; i < this.data.length; i++) {
        const itemData = this.data[i];
        const selected = itemData.age < 18 || itemData.age === 21;
        assert.equal(selection.isItemSelected(itemData), selected, 'item with age ' + itemData.age + ' is ' + (selected ? 'selected' : 'unselected'));
    }
});

QUnit.test('changeItemSelection before selectAll', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    selection.changeItemSelection(0);

    this.dataSource.filter(['age', '>', 18]);
    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [['id', '=', 1], 'or', ['age', '>', 18]], 'selection filter');
    assert.strictEqual(selection.getSelectAllState(), true, 'select all is true');
});

QUnit.test('dataSource filter -> changeItemSelection after selectAll', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(['age', '>', 18]);
    selection.selectAll();

    selection.changeItemSelection(1, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [['age', '>', 18], 'and', ['!', ['id', '=', 2]]], 'selection filter');
    assert.strictEqual(selection.getSelectAllState(), undefined, 'select all is undefined');
});

QUnit.test('selectAll when filter with \'or\' operation is defined', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter([['age', '=', 15], 'or', ['age', '=', 20]]);
    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [['age', '=', 15], 'or', ['age', '=', 20]], 'selection filter');
    assert.strictEqual(selection.getSelectAllState(), true, 'select all is true');
});

// T754974
QUnit.test('selectAll after deselect one item', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(['age', '>', 18]);
    selection.selectAll();
    selection.changeItemSelection(1, { control: true });
    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), ['age', '>', 18], 'selection filter');
    assert.strictEqual(selection.getSelectAllState(), true, 'select all is true');
});

// T754974
QUnit.test('selectAll after deselecting two items', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(['age', '>', 15]);
    selection.selectAll();
    selection.changeItemSelection(1, { control: true });
    selection.changeItemSelection(2, { control: true });
    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), ['age', '>', 15], 'selection filter');
    assert.strictEqual(selection.getSelectAllState(), true, 'select all is true');
});

// T754974
QUnit.test('selectAll -> deselect items -> select item -> deselect item -> select All', function(assert) {
    let selectedKeys;
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(['age', '>', 15]);
    selection.selectAll();
    selection.changeItemSelection(1, { control: true }); // deselect item
    selection.changeItemSelection(2, { control: true }); // deselect item
    selection.changeItemSelection(2, { control: true }); // select item
    selection.changeItemSelection(3, { control: true }); // deselect item
    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), ['age', '>', 15], 'selection filter');
    assert.strictEqual(selection.getSelectAllState(), true, 'select all is true');
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });
    assert.deepEqual(selectedKeys, [2, 3, 4, 5, 6, 7], 'selected keys');
});

QUnit.test('select item -> selectAll -> deselect items -> select item -> deselect item -> select All', function(assert) {
    let selectedKeys;
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(['age', '>', 15]);
    selection.changeItemSelection(4, { control: true }); // select item
    selection.selectAll();
    selection.changeItemSelection(1, { control: true }); // deselect item
    selection.changeItemSelection(2, { control: true }); // deselect item
    selection.changeItemSelection(2, { control: true }); // select item
    selection.changeItemSelection(3, { control: true }); // deselect item
    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [[['id', '=', 5], 'and', ['!', ['id', '=', 2]], 'and', ['!', ['id', '=', 4]]], 'or', ['age', '>', 15]], 'selection filter');
    assert.strictEqual(selection.getSelectAllState(), true, 'select all is true');
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });
    assert.deepEqual(selectedKeys, [2, 3, 4, 5, 6, 7], 'selected keys');
});

// T754974
QUnit.test('selectAll -> deselect items -> select/deselect item -> select All', function(assert) {
    let selectedKeys;
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(['age', '>', 15]);
    selection.selectAll();
    selection.changeItemSelection(1, { control: true }); // deselect item
    selection.changeItemSelection(2, { control: true }); // deselect item
    selection.changeItemSelection(2, { control: true }); // select item
    selection.changeItemSelection(2, { control: true }); // deselect item
    selection.selectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), ['age', '>', 15], 'selection filter');
    assert.strictEqual(selection.getSelectAllState(), true, 'select all is true');
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });
    assert.deepEqual(selectedKeys, [2, 3, 4, 5, 6, 7], 'selected keys');
});

// T814753
QUnit.test('selectAll -> deselect/select items -> deselect item -> select All -> deselect item', function(assert) {
    let selectedKeys;
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(['age', '>', 15]);
    selection.selectAll();
    selection.changeItemSelection(1, { control: true }); // deselect item
    selection.changeItemSelection(2, { control: true }); // deselect item
    selection.changeItemSelection(1, { control: true }); // select item
    selection.changeItemSelection(2, { control: true }); // select item
    selection.changeItemSelection(2, { control: true }); // deselect item
    selection.selectAll();
    selection.changeItemSelection(1, { control: true }); // deselect item

    // assert
    assert.deepEqual(selection.selectionFilter(), [['age', '>', 15], 'and', ['!', ['id', '=', 2]]], 'selection filter');
    assert.strictEqual(selection.getSelectAllState(), undefined, 'select all is true');
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });
    assert.deepEqual(selectedKeys, [3, 4, 5, 6, 7], 'selected keys');
});


QUnit.test('Deselect one item after selectAll', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(['age', '>', 18]);
    selection.changeItemSelection(1, { control: true });
    selection.selectAll();
    selection.changeItemSelection(1, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [['age', '>', 18], 'and', ['!', ['id', '=', 2]]], 'selection filter');
    assert.strictEqual(selection.getSelectAllState(), undefined, 'select all is true');
    assert.strictEqual(selection.isItemSelected(this.data[1]), false, 'item 1 should not be selected');
});

QUnit.test('Deselect one item after selectAll when filter contains \'or\' operation', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter([['age', '=', 15], 'or', ['age', '=', 20]]);
    selection.changeItemSelection(1, { control: true });
    selection.selectAll();
    selection.changeItemSelection(1, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [[['age', '=', 15], 'or', ['age', '=', 20]], 'and', ['!', ['id', '=', 2]]], 'selection filter');
    assert.strictEqual(selection.getSelectAllState(), undefined, 'select all is true');
    assert.strictEqual(selection.isItemSelected(this.data[1]), false, 'item 1 should not be selected');
});

QUnit.test('select and deselect several items', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter(['age', '>', 0]);
    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(1, { control: true });
    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(1, { control: true });

    // assert
    assert.strictEqual(selection.getSelectAllState(), false, 'select all is false'); // T615278
    assert.strictEqual(selection.isItemSelected(this.data[0]), false, 'item 0 should not be selected');
    assert.strictEqual(selection.isItemSelected(this.data[1]), false, 'item 1 should not be selected');
    assert.strictEqual(selection.isItemSelected(this.data[2]), false, 'item 2 should not be selected');
});

QUnit.test('deselectAll after selectAll when filter by key values is defined', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    // act
    this.dataSource.filter([['id', '=', 1], 'or', ['id', '=', 2]]);
    selection.selectAll();
    selection.deselectAll();

    // assert
    assert.deepEqual(selection.selectionFilter(), [], 'selection filter');
    assert.strictEqual(selection.getSelectAllState(), false, 'select all is false');
    let selectedItems;
    selection.getSelectedItems().done(function(items) {
        selectedItems = items;
    });
    assert.deepEqual(selectedItems, [], 'no selected items');
});

QUnit.test('getSelectedItems returns deferred', function(assert) {
    let selectedItems;
    const selection = this.createDeferredSelection(this.data, {
        selectionFilter: [['id', '=', 1], 'or', ['age', '>', 18]]
    });

    // act
    selection.getSelectedItems().done(function(items) {
        selectedItems = items;
    });

    // assert
    assert.deepEqual(selectedItems, [this.data[0], this.data[1], this.data[5]], 'selected items');
});

QUnit.test('getSelectedItemKeys returns deferred', function(assert) {
    let selectedKeys;
    const selection = this.createDeferredSelection(this.data, {
        selectionFilter: [['id', '=', 1], 'or', ['age', '>', 18]]
    });

    // act
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });

    // assert
    assert.deepEqual(selectedKeys, [1, 2, 6], 'selected keys');
});

QUnit.test('selectAll, select 2 items, deselect 2 items', function(assert) {
    let selectedKeys;
    const selection = this.createDeferredSelection(this.data);

    selection.selectAll();

    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(2, { control: true });
    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(2, { control: true });

    // act
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });

    // assert
    assert.deepEqual(selectedKeys, [1, 2, 3, 4, 5, 6, 7], 'selected keys');
    assert.deepEqual(selection.selectionFilter(), null, 'selectionFilter is null');
});

QUnit.test('selectAll, deselect 3 items, select 3 items', function(assert) {
    let selectedKeys;
    const selection = this.createDeferredSelection(this.data);

    selection.selectAll();

    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(2, { control: true });
    selection.changeItemSelection(3, { control: true });
    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(2, { control: true });
    selection.changeItemSelection(3, { control: true });

    // act
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });

    // assert
    assert.deepEqual(selectedKeys, [1, 2, 3, 4, 5, 6, 7], 'selected keys');
    assert.deepEqual(selection.selectionFilter(), null, 'selectionFilter is null');
});

QUnit.test('select 3 items, deselect 3 items', function(assert) {
    let selectedKeys;
    const selection = this.createDeferredSelection(this.data);

    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(1, { control: true });
    selection.changeItemSelection(2, { control: true });
    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(1, { control: true });
    selection.changeItemSelection(2, { control: true });

    // act
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });

    // assert
    assert.deepEqual(selectedKeys, [], 'selected keys');
    assert.deepEqual(selection.selectionFilter(), [], 'selectionFilter is []');
});

// T874992
QUnit.test('select 2 items, deselect item', function(assert) {
    let selectedKeys;
    const selection = this.createDeferredSelection(this.data);

    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(1, { control: true });
    selection.changeItemSelection(1, { control: true });

    // act
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });

    // assert
    assert.deepEqual(selectedKeys, [1], 'selected keys');
    assert.deepEqual(selection.selectionFilter(), ['id', '=', 1], 'selectionFilter');
});

// T874992
QUnit.test('select 3 items, deselect 2 item, select item', function(assert) {
    let selectedKeys;
    const selection = this.createDeferredSelection(this.data);

    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(1, { control: true });
    selection.changeItemSelection(2, { control: true });
    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(1, { control: true });
    selection.changeItemSelection(3, { control: true });

    // act
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });

    // assert
    assert.deepEqual(selectedKeys, [3, 4], 'selected keys');
    assert.deepEqual(selection.selectionFilter(), [['id', '=', 3], 'or', ['id', '=', 4]], 'selectionFilter');
});

// T874992
QUnit.test('select all, deselect 3 items, select 2 item, dselect item', function(assert) {
    let selectedKeys;
    const selection = this.createDeferredSelection(this.data);

    selection.selectAll();
    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(1, { control: true });
    selection.changeItemSelection(2, { control: true });
    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(1, { control: true });
    selection.changeItemSelection(3, { control: true });

    // act
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });

    // assert
    assert.deepEqual(selectedKeys, [1, 2, 5, 6, 7], 'selected keys');
    assert.deepEqual(selection.selectionFilter(), [['!', ['id', '=', 3]], 'and', ['!', ['id', '=', 4]]], 'selectionFilter');
});

QUnit.test('select 2 items, deselect and select 1 item', function(assert) {
    let selectedKeys;
    const selection = this.createDeferredSelection(this.data);

    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(1, { control: true });
    selection.changeItemSelection(1, { control: true });
    selection.changeItemSelection(1, { control: true });

    // act
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });

    // assert
    assert.deepEqual(selectedKeys, [1, 2], 'selected keys');
    assert.deepEqual(selection.selectionFilter(), [['id', '=', 1], 'or', ['id', '=', 2]], 'selectionFilter');
});

QUnit.test('select 3 items, deselect 2 items, select 1 item, deselect 2 items', function(assert) {
    let selectedKeys;
    const selection = this.createDeferredSelection(this.data);

    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(1, { control: true });
    selection.changeItemSelection(2, { control: true });
    selection.changeItemSelection(1, { control: true });
    selection.changeItemSelection(2, { control: true });
    selection.changeItemSelection(1, { control: true });
    selection.changeItemSelection(1, { control: true });
    selection.changeItemSelection(0, { control: true });

    // act
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });

    // assert
    assert.deepEqual(selectedKeys, [], 'selected keys');
});

QUnit.test('selectedItemKeys', function(assert) {
    const selection = this.createDeferredSelection(this.data, {});

    // act
    selection.selectedItemKeys([1]);
    selection.selectedItemKeys([2, 4]).done(function() {
        assert.ok(true, 'selectedItems key return Deferred');
    });

    // assert
    selection.getSelectedItemKeys().done(function(keys) {
        assert.deepEqual(keys, [2, 4], 'selected item keys');
    });

});

QUnit.test('selectedItemKeys with preserve', function(assert) {
    const selection = this.createDeferredSelection(this.data, {
    });

    // act
    selection.selectedItemKeys([1, 2]);
    selection.selectedItemKeys([2, 4], true);
    // assert
    selection.getSelectedItemKeys().done(function(keys) {
        assert.deepEqual(keys, [1, 2, 4], 'selected item keys');
    });

});

QUnit.test('selectedItemKeys deselect item', function(assert) {
    const selection = this.createDeferredSelection(this.data, {});

    // act
    selection.selectedItemKeys([1, 2, 4]);
    selection.selectedItemKeys([2, 4], true, true);
    // assert
    selection.getSelectedItemKeys().done(function(keys) {
        assert.deepEqual(keys, [1], 'selected item keys');
    });

});

QUnit.test('onSelectionChanged should be fired after selectedItemKeys deselect item', function(assert) {
    let selectionChangedIsCalled = false;
    const selection = this.createDeferredSelection(this.data, {
        onSelectionChanged: function() {
            selectionChangedIsCalled = true;
        }
    });

    // act
    selection.selectedItemKeys([1, 2]);
    selection.selectedItemKeys([2, 4], true);
    // assert
    selection.getSelectedItemKeys().done(function(keys) {
        assert.deepEqual(keys, [1, 2, 4], 'selected item keys');
    });

    assert.ok(selectionChangedIsCalled);
});

QUnit.module('Deferred mode. Complex key', {
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

        this.dataSource = createDataSource(this.data, { key: ['id', 'name'] }, { pageSize: 5 });
        this.dataSource.load();

        this.createDeferredSelection = function(data, options) {
            return createDeferredSelection(data, options, this.dataSource);
        };
    }
});

QUnit.test('Select item', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    selection.changeItemSelection(0);
    // assert
    assert.deepEqual(selection.selectionFilter(), [['id', '=', 1], 'and', ['name', '=', 'Alex']], 'selectionFilter value');
});

QUnit.test('Deselect item', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    selection.selectAll();

    selection.changeItemSelection(0, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), ['!', [['id', '=', 1], 'and', ['name', '=', 'Alex']]], 'selectionFilter value');
});

QUnit.test('Select and deselect item', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    selection.changeItemSelection(0);
    selection.changeItemSelection(0, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [], 'selectionFilter value');
});

// T470886
QUnit.test('Deselect and select item when selected all', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    selection.selectAll();

    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(0, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), null, 'selectionFilter value');
});

QUnit.module('Deferred mode. Complex key with one item', {
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

        this.dataSource = createDataSource(this.data, { key: ['id'] }, { pageSize: 5 });
        this.dataSource.load();

        this.createDeferredSelection = function(data, options) {
            return createDeferredSelection(data, options, this.dataSource);
        };
    }
});

QUnit.test('Select item', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    selection.changeItemSelection(0);
    // assert
    assert.deepEqual(selection.selectionFilter(), ['id', '=', 1], 'selectionFilter value');
});

QUnit.test('Deselect item', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    selection.selectAll();

    selection.changeItemSelection(0, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), ['!', ['id', '=', 1]], 'selectionFilter value');
});

QUnit.test('Select and deselect item', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    selection.changeItemSelection(0);
    selection.changeItemSelection(0, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [], 'selectionFilter value');
});

// T958663
QUnit.test('Select 2 items and deselect 2 items', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(1, { control: true });
    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(1, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [], 'selectionFilter value');
    assert.strictEqual(selection.getSelectAllState(), false, 'select all is false');
});

QUnit.test('Deselect and select item when selected all', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    selection.selectAll();

    selection.changeItemSelection(0, { control: true });
    selection.changeItemSelection(0, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), null, 'selectionFilter value');
});

QUnit.module('Deferred mode. Complex key with three items', {
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

        this.dataSource = createDataSource(this.data, { key: ['id', 'name', 'age'] }, { pageSize: 5 });
        this.dataSource.load();

        this.createDeferredSelection = function(data, options) {
            return createDeferredSelection(data, options, this.dataSource);
        };
    }
});

QUnit.test('Select item', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    selection.changeItemSelection(0);
    // assert
    assert.deepEqual(selection.selectionFilter(), [['id', '=', 1], 'and', ['name', '=', 'Alex'], 'and', ['age', '=', 15]], 'selectionFilter value');
});

QUnit.test('Deselect item', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    selection.selectAll();

    selection.changeItemSelection(0, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), ['!', [['id', '=', 1], 'and', ['name', '=', 'Alex'], 'and', ['age', '=', 15]]], 'selectionFilter value');
});

// T978952
QUnit.test('Select and deselect item', function(assert) {
    const selection = this.createDeferredSelection(this.data);

    selection.changeItemSelection(0);
    selection.changeItemSelection(0, { control: true });

    // assert
    assert.deepEqual(selection.selectionFilter(), [], 'selectionFilter value');
});

QUnit.module('filter length restriction', {
    beforeEach: function() {
        const data = this.data = [
            { id: 1, name: 'Alex', age: 15 },
            { id: 2, name: 'Dan', age: 20 },
            { id: 3, name: 'Vadim', age: 17 },
            { id: 4, name: 'Dmitry', age: 18 },
            { id: 5, name: 'Sergey', age: 18 },
            { id: 6, name: 'Kate', age: 19 },
            { id: 7, name: 'Dan', age: 16 }
        ];

        this.load = sinon.spy(function(options) {
            return new ArrayStore({ data: data, key: 'id' }).load(options);
        });

        this.dataSource = new DataSource({
            store: new CustomStore({
                key: 'id',
                load: this.load
            })
        });

        this.dataSource.load();

        this.load.resetHistory();

        this.createDeferredSelection = function(data, options) {
            return createDeferredSelection(data, options, this.dataSource);
        };
    }
});

QUnit.test('Pass filter to load when selection filter', function(assert) {
    let selectedKeys;
    const selection = this.createDeferredSelection(this.data, {
        filterLengthRestriction: 70,
        selectionFilter: [['id', '=', 1], 'or', ['age', '>', 18]]
    });

    // act
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });
    // assert
    assert.strictEqual(this.load.lastCall.args[0].filter, selection.selectionFilter());

    assert.deepEqual(selectedKeys, [1, 2, 6], 'selected keys');
});

QUnit.test('Remove template property from filter value', function(assert) {
    const selection = this.createDeferredSelection(this.data, {
        selectionFilter: [['id', '=', { id: 2, template: 'content' }]]
    });

    selection.getSelectedItemKeys().done();

    assert.strictEqual(this.load.lastCall.args[0].filter[0][2].template, undefined);
});

QUnit.test('Remove template property from each filter value', function(assert) {
    const selection = this.createDeferredSelection(this.data, {
        selectionFilter: [
            ['id', '=', { id: 1, template: 'content' }],
            ['id', '=', { id: 2, template: 'content' }],
            ['id', '=', { id: 3, template: 'content' }]
        ]
    });

    selection.getSelectedItemKeys().done();

    assert.strictEqual(this.load.lastCall.args[0].filter[0][2].template, undefined);
    assert.strictEqual(this.load.lastCall.args[0].filter[1][2].template, undefined);
    assert.strictEqual(this.load.lastCall.args[0].filter[2][2].template, undefined);
});

QUnit.test('not pass filter to loadOptions', function(assert) {
    let selectedKeys;
    const selection = this.createDeferredSelection(this.data, {
        maxFilterLengthInRequest: 65,
        selectionFilter: [['id', '=', 1], 'or', ['age', '>', 18]]
    });

    // act
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });
    // assert
    assert.strictEqual(this.load.lastCall.args[0].filter, undefined);

    assert.deepEqual(selectedKeys, [1, 2, 6], 'selected keys');
});

QUnit.test('not pass filter to loadOptions. getSelectedItems', function(assert) {
    let selectedKeys;
    const selection = this.createDeferredSelection(this.data, {
        maxFilterLengthInRequest: 65,
        selectionFilter: [['id', '=', 1], 'or', ['age', '>', 18]]
    });

    // act
    selection.getSelectedItems().done(function(keys) {
        selectedKeys = keys;
    });
    // assert
    assert.strictEqual(this.load.lastCall.args[0].filter, undefined);

    assert.deepEqual(selectedKeys, [this.data[0], this.data[1], this.data[5]], 'selected keys');
});

QUnit.test('filterLengthRestriction is undefined', function(assert) {
    let selectedKeys;
    const selection = this.createDeferredSelection(this.data, {
        selectionFilter: [['id', '=', 1], 'or', ['age', '>', 18]]
    });

    // act
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });
    // assert
    assert.strictEqual(this.load.lastCall.args[0].filter, selection.selectionFilter());

    assert.deepEqual(selectedKeys, [1, 2, 6], 'selected keys');
});

QUnit.test('filterLengthRestriction is 0', function(assert) {
    let selectedKeys;
    const selection = this.createDeferredSelection(this.data, {
        maxFilterLengthInRequest: 0,
        selectionFilter: [['id', '=', 1], 'or', ['age', '>', 18]]
    });

    // act
    selection.getSelectedItemKeys().done(function(keys) {
        selectedKeys = keys;
    });
    // assert
    assert.strictEqual(this.load.lastCall.args[0].filter, selection.selectionFilter());

    assert.deepEqual(selectedKeys, [1, 2, 6], 'selected keys');
});

QUnit.module('onSelectionChanging', {
    beforeEach: function() {
        this.data = [
            { id: 1, name: 'Alex', age: 15 },
            { id: 2, name: 'Dan', age: 16 },
            { id: 3, name: 'Vadim', age: 17 },
            { id: 4, name: 'Dmitry', age: 18 },
            { id: 5, name: 'Sergey', age: 18 },
            { id: 6, name: 'Kate', age: 20 },
            { id: 7, name: 'Dan', age: 21 }
        ];

        this.dataSource = createDataSource(this.data, {}, {});
        this.firstThreeItems = this.data.slice(0, 3);
        this.basicSelectionConfig = {
            key: () => {
                const store = this.dataSource.store();
                return store && store.key();
            },
            keyOf: (item) => {
                const store = this.dataSource.store();
                return store && store.keyOf(item);
            },
            dataFields: () => {
                return this.dataSource.select();
            },
            plainItems: () => {
                return this.dataSource.items();
            },
        };
    }
}, () => {
    QUnit.test('should be called with correct parameters', function(assert) {
        const selectionChangingHandler = sinon.spy((args) => {
            assert.deepEqual(args.selectedItems, this.firstThreeItems, 'selectedItems is correct');
            assert.deepEqual(args.selectedItemKeys, this.firstThreeItems, 'selectedItemsKeys is correct');
            assert.deepEqual(args.addedItemKeys, this.firstThreeItems, 'addedItemKeys is correct');
            assert.deepEqual(args.addedItems, this.firstThreeItems, 'addedItems is correct');
            assert.deepEqual(args.removedItemKeys, [], 'removedItemKeys is correct');
            assert.deepEqual(args.removedItems, [], 'removedItems is correct');
            assert.strictEqual(args.cancel, false, 'cancel is correct');
        });
        const selectionChangedHandler = sinon.stub();

        const selection = new Selection({
            ...this.basicSelectionConfig,
            onSelectionChanging: selectionChangingHandler,
            onSelectionChanged: selectionChangedHandler
        });

        this.dataSource.load();
        selection
            .selectedItemKeys(this.firstThreeItems)
            .then((appliedSelectedItems) => {
                assert.deepEqual(appliedSelectedItems, this.firstThreeItems, 'deferred is resolved with correct parameters');
            });

        assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is called once');
        assert.strictEqual(selectionChangedHandler.callCount, 1, 'selectionChanged is called once');
        assert.deepEqual(selection.getSelectedItemKeys(), this.firstThreeItems, 'selectedItemKeys is updated correctly');
        assert.strictEqual(selection.isItemSelected(this.data[0]), true, 'isItemSelected returns true');
    });

    QUnit.test('cancelling should prevent selectedItems change and selectionChanged raise', function(assert) {
        const selectionChangingHandler = sinon.spy(function(e) {
            e.cancel = true;
        });
        const selectionChangedHandler = sinon.stub();

        const selection = new Selection({
            ...this.basicSelectionConfig,
            onSelectionChanging: selectionChangingHandler,
            onSelectionChanged: selectionChangedHandler
        });

        this.dataSource.load();
        const selectionDeferred = selection.selectedItemKeys(this.firstThreeItems);

        assert.strictEqual(selectionDeferred.state(), 'rejected', 'selection deferred is rejected');
        assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is called once');
        assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged is not called');
        assert.deepEqual(selection.getSelectedItems(), [], 'selectedItems is not updated');
        assert.deepEqual(selection.getSelectedItemKeys(), [], 'selectedItemKeys is not updated');
        assert.strictEqual(selection.isItemSelected(this.data[0]), false, 'isItemSelected returns false');
    });

    QUnit.test('cancelling should prevent selectedItems change and selectionChanged raise (e.cancel=promise)', function(assert) {
        const done = assert.async();

        const selectionChangingHandler = sinon.spy(function(e) {
            e.cancel = new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                });
            });
        });
        const selectionChangedHandler = sinon.stub();

        const selection = new Selection({
            ...this.basicSelectionConfig,
            onSelectionChanging: selectionChangingHandler,
            onSelectionChanged: selectionChangedHandler
        });

        this.dataSource.load();
        const selectionDeferred = selection.selectedItemKeys(this.firstThreeItems);

        setTimeout(() => {
            assert.strictEqual(selectionDeferred.state(), 'rejected', 'selection deferred is rejected');
            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is called once');
            assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged is not called');
            assert.deepEqual(selection.getSelectedItems(), [], 'selectedItems is not updated');
            assert.deepEqual(selection.getSelectedItemKeys(), [], 'selectedItemKeys is not updated');
            assert.strictEqual(selection.isItemSelected(this.data[0]), false, 'isItemSelected returns false');
            done();
        });
    });

    QUnit.test('requests should be ignored while previous request is not processed', function(assert) {
        const done = assert.async();
        const delay = 100;

        const selectionChangingHandler = sinon.spy(function(e) {
            e.cancel = new Promise((resolve) => {
                setTimeout(() => {
                    resolve(false);
                }, delay);
            });
        });
        const selectionChangedHandler = sinon.stub();

        const selection = new Selection({
            ...this.basicSelectionConfig,
            onSelectionChanging: selectionChangingHandler,
            onSelectionChanged: selectionChangedHandler
        });

        this.dataSource.load();
        const selectionDeferred = selection.selectedItemKeys(this.firstThreeItems);
        assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is called once');

        setTimeout(() => {
            const secondSelectionDeferred = selection.selectedItemKeys([this.data[0]]);
            assert.strictEqual(secondSelectionDeferred.state(), 'rejected', 'second selection request is immediately rejected');
            assert.strictEqual(selectionDeferred.state(), 'pending', 'first request is still in progress');

            setTimeout(() => {
                assert.strictEqual(selectionDeferred.state(), 'resolved', 'first request is resolved');

                assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is called once');
                assert.strictEqual(selectionChangedHandler.callCount, 1, 'selectionChanged is called once');
                assert.deepEqual(selection.getSelectedItems(), this.firstThreeItems, 'selectedItems are update correctly');
                done();
            }, delay / 2);
        }, delay / 2);
    });

    QUnit.test('should have correct parameters on repeative call if previous request was canceled', function(assert) {
        const selectionChangingHandler = sinon.spy((args) => {
            args.cancel = true;
            if(selectionChangingHandler.callCount === 2) {
                assert.deepEqual(args.selectedItems, this.firstThreeItems, 'selectedItems is correct');
                assert.deepEqual(args.selectedItemKeys, this.firstThreeItems, 'selectedItemsKeys is correct');
                assert.deepEqual(args.addedItemKeys, this.firstThreeItems, 'addedItemKeys is correct');
                assert.deepEqual(args.removedItemKeys, [], 'removedItemKeys is correct');
            }
        });

        const selection = new Selection({
            ...this.basicSelectionConfig,
            onSelectionChanging: selectionChangingHandler
        });

        this.dataSource.load();

        selection.selectedItemKeys(this.data[4]);
        selection.selectedItemKeys(this.firstThreeItems);

        assert.strictEqual(selectionChangingHandler.callCount, 2, 'selectionChanging is called once');
    });

    QUnit.test('isItemSelected should work correctly after selection change is cancelled', function(assert) {
        let cancelSelectionChange = false;
        const selectionChangingHandler = sinon.spy((args) => {
            args.cancel = cancelSelectionChange;
        });

        const selection = new Selection({
            ...this.basicSelectionConfig,
            onSelectionChanging: selectionChangingHandler
        });

        this.dataSource.load();

        const firstItem = this.data[0];

        cancelSelectionChange = false;
        selection.select(firstItem);

        cancelSelectionChange = true;
        selection.deselect(firstItem);

        const isFirstItemSelected = selection.isItemSelected(firstItem);
        assert.strictEqual(isFirstItemSelected, true, 'item is still selected after canceled deselect');
    });

    QUnit.test('getSelectAllState should work correctly after selection change is cancelled', function(assert) {
        let cancelSelectionChange = false;
        const selectionChangingHandler = sinon.spy((args) => {
            args.cancel = cancelSelectionChange;
        });

        const selection = new Selection({
            ...this.basicSelectionConfig,
            onSelectionChanging: selectionChangingHandler
        });

        this.dataSource.load();

        cancelSelectionChange = false;
        selection.selectAll(true);

        cancelSelectionChange = true;
        selection.deselect(true);

        const areAllItemsSelected = selection.getSelectAllState(true);
        assert.strictEqual(areAllItemsSelected, true, 'items are still selected after canceled deselectAll');
    });

    QUnit.module('select all by one page', {
        beforeEach: function() {
            this.dataSource = createDataSource(this.data, {}, { paginate: true, pageSize: 3 });
        }
    }, () => {
        QUnit.test('should call selectionChanging with correct parameters', function(assert) {
            const selectionChangingHandler = sinon.spy((args) => {
                assert.deepEqual(args.selectedItems, this.firstThreeItems, 'selectedItems is correct');
                assert.deepEqual(args.selectedItemKeys, this.firstThreeItems, 'selectedItemsKeys is correct');
                assert.deepEqual(args.addedItemKeys, this.firstThreeItems, 'addedItemKeys is correct');
                assert.deepEqual(args.addedItems, this.firstThreeItems, 'addedItems is correct');
                assert.deepEqual(args.removedItemKeys, [], 'removedItemKeys is correct');
                assert.deepEqual(args.removedItems, [], 'removedItems is correct');
                assert.strictEqual(args.cancel, false, 'cancel is correct');
            });
            const selectionChangedHandler = sinon.stub();

            const selection = new Selection({
                ...this.basicSelectionConfig,
                onSelectionChanging: selectionChangingHandler,
                onSelectionChanged: selectionChangedHandler
            });

            this.dataSource.load();
            selection.selectAll(true);

            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is called once');
            assert.strictEqual(selectionChangedHandler.callCount, 1, 'selectionChanged is called once');
            assert.strictEqual(selection.getSelectAllState(true), true, 'select all is true');
        });

        QUnit.test('selection should be canceled if e.cancel = true', function(assert) {
            const selectionChangingHandler = sinon.spy((args) => {
                args.cancel = true;
            });
            const selectionChangedHandler = sinon.stub();

            const selection = new Selection({
                ...this.basicSelectionConfig,
                onSelectionChanging: selectionChangingHandler,
                onSelectionChanged: selectionChangedHandler
            });

            this.dataSource.load();
            selection.selectAll(true);

            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is called once');
            assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged is not called');
            assert.strictEqual(selection.getSelectAllState(true), false, 'select all is not changed');
        });

        QUnit.test('selection should be canceled if e.cancel is a promise resolving with true', function(assert) {
            const done = assert.async();
            const selectionChangingHandler = sinon.spy((args) => {
                args.cancel = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    });
                });
            });
            const selectionChangedHandler = sinon.stub();

            const selection = new Selection({
                ...this.basicSelectionConfig,
                onSelectionChanging: selectionChangingHandler,
                onSelectionChanged: selectionChangedHandler
            });

            this.dataSource.load();
            selection.selectAll(true);

            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is called immediately');
            assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged is not called until promise is resolved');

            setTimeout(() => {
                assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is called once');
                assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged is not called');
                assert.strictEqual(selection.getSelectAllState(true), false, 'select all is not changed');
                done();
            });
        });

        QUnit.test('selection should be applied if e.cancel is a promise resolving with false', function(assert) {
            const done = assert.async();

            const selectionChangingHandler = sinon.spy((args) => {
                args.cancel = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(false);
                    });
                });
            });
            const selectionChangedHandler = sinon.stub();

            const selection = new Selection({
                ...this.basicSelectionConfig,
                onSelectionChanging: selectionChangingHandler,
                onSelectionChanged: selectionChangedHandler
            });

            this.dataSource.load();
            selection.selectAll(true);

            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is called immediately');
            assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged is not called until promise is resolved');

            setTimeout(() => {
                assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is called once');
                assert.strictEqual(selectionChangedHandler.callCount, 1, 'selectionChanged is called once');
                assert.strictEqual(selection.getSelectAllState(true), true, 'select all is changed');
                done();
            });
        });

        QUnit.test('selection should be applied if e.cancel is a promise which will be rejected', function(assert) {
            const done = assert.async();
            const selectionChangingHandler = sinon.spy((args) => {
                args.cancel = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject();
                    });
                });
            });
            const selectionChangedHandler = sinon.stub();

            const selection = new Selection({
                ...this.basicSelectionConfig,
                onSelectionChanging: selectionChangingHandler,
                onSelectionChanged: selectionChangedHandler
            });

            this.dataSource.load();
            selection.selectAll(true);

            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is called immediately');
            assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged is not called until promise is resolved');

            setTimeout(() => {
                assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is called once');
                assert.strictEqual(selectionChangedHandler.callCount, 1, 'selectionChanged is called once');
                assert.strictEqual(selection.getSelectAllState(true), true, 'select all is changed');
                done();
            });
        });

        QUnit.test('selecton requests should be ignored until previous one is not processed', function(assert) {
            const done = assert.async();
            const delay = 100;
            const selectionChangingHandler = sinon.spy((args) => {
                args.cancel = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(false);
                    }, delay);
                });
            });
            const selectionChangedHandler = sinon.stub();

            const selection = new Selection({
                ...this.basicSelectionConfig,
                onSelectionChanging: selectionChangingHandler,
                onSelectionChanged: selectionChangedHandler
            });

            this.dataSource.load();
            const selectionDeferred = selection.selectAll(true);

            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is called immediately');
            assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged is not called until promise is resolved');

            setTimeout(() => {
                const secondSelectionDeferred = selection.deselectAll(true);
                assert.strictEqual(secondSelectionDeferred.state(), 'rejected', 'second request is immediately rejected');
                assert.strictEqual(selectionDeferred.state(), 'pending', 'first request is still in progress');

                setTimeout(() => {
                    assert.strictEqual(selectionDeferred.state(), 'resolved', 'first request is resolved');
                    assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is called once');
                    assert.strictEqual(selectionChangedHandler.callCount, 1, 'selectionChanged is called once');
                    assert.strictEqual(selection.getSelectAllState(true), true, 'select all is changed');

                    setTimeout(() => {
                        assert.strictEqual(selectionChangingHandler.callCount, 1, 'additional selectionChanging is not called');
                        assert.strictEqual(selection.getSelectAllState(true), true, 'second selection request is ignored');
                        done();
                    }, delay / 2);
                }, delay / 2);
            }, delay / 2);
        });
    });
});
