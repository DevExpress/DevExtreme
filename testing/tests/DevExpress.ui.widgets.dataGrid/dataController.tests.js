"use strict";

var $ = require("jquery"),
    config = require("core/config"),
    formatHelper = require("format_helper"),
    errors = require("ui/widget/ui.errors"),
    typeUtils = require("core/utils/type"),
    DataSource = require("data/data_source/data_source").DataSource,
    ArrayStore = require("data/array_store"),
    dataGridMocks = require("../../helpers/dataGridMocks.js"),
    setupDataGridModules = dataGridMocks.setupDataGridModules,
    MockGridDataSource = dataGridMocks.MockGridDataSource;

require("ui/data_grid/ui.data_grid");

var createDataSource = function(data, storeOptions, dataSourceOptions) {
    var arrayStore = new ArrayStore(storeOptions ? $.extend(true, { data: data }, storeOptions) : data);
    var dataSource = new DataSource($.extend(true, { store: arrayStore, requireTotalCount: true, _preferSync: true }, dataSourceOptions));
    return dataSource;
};

var setupModule = function() {
    setupDataGridModules(this, ['data', 'virtualScrolling', 'columns', 'filterRow', 'search', 'editing', 'grouping', 'headerFilter', 'masterDetail']);

    this.applyOptions = function(options) {
        $.extend(this.options, options);
        this.columnsController.init();
    };
    this.clock = sinon.useFakeTimers();
    this.editingController.getFirstEditableCellInRow = function() { return $([]); };
};

var teardownModule = function() {
    this.dispose();
    this.clock.restore();
};

QUnit.module("Initialization", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("No initialization", function(assert) {
    assert.deepEqual(this.dataController.items(), []);
    assert.ok(!this.dataController.isLoading());
    assert.ok(this.dataController.isLoaded());
});

QUnit.test("Initialize from dataSource with all visible columns", function(assert) {
    var array = [
        { name: 'Alex', phone: '55-55-55' },
        { name: 'Dan', phone: '98-75-21' }
    ];

    var dataSource = createDataSource(array, { key: 'name' });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    assert.equal(this.dataController.items().length, 2);
    assert.deepEqual(this.dataController.items()[0].values, ['Alex', '55-55-55']);
    assert.deepEqual(this.dataController.items()[1].values, ['Dan', '98-75-21']);
    assert.deepEqual(this.dataController.items()[0].data, { name: 'Alex', phone: '55-55-55' });
    assert.deepEqual(this.dataController.items()[1].data, { name: 'Dan', phone: '98-75-21' });
});

QUnit.test("Initialize from dataSource when dataSource has null item", function(assert) {
    var array = [
        { name: 'Alex', phone: '55-55-55' },
        { name: 'Dan', phone: '98-75-21' },
        null
    ];

    var dataSource = createDataSource(array);

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    assert.equal(this.dataController.items().length, 2);
    assert.deepEqual(this.dataController.items()[0].values, ['Alex', '55-55-55']);
    assert.deepEqual(this.dataController.items()[1].values, ['Dan', '98-75-21']);
    assert.deepEqual(this.dataController.items()[0].data, { name: 'Alex', phone: '55-55-55' });
    assert.deepEqual(this.dataController.items()[1].data, { name: 'Dan', phone: '98-75-21' });
});

QUnit.test("Initialize from options with invisible columns", function(assert) {
    var array = [
        { name: 'Alex', age: 20, phone: '55-55-55' },
        { name: 'Dan', age: 30, phone: '98-75-21' }
    ];
    var dataSource = createDataSource(array);

    this.applyOptions({ columns: ["name", { dataField: 'age', visible: false }, 'phone'] });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    assert.equal(this.dataController.items().length, 2);
    assert.deepEqual(this.dataController.items()[0].values, ['Alex', '55-55-55']);
    assert.deepEqual(this.dataController.items()[1].values, ['Dan', '98-75-21']);
});

QUnit.test("Initialize array with keyExpr option", function(assert) {
    // act
    this.applyOptions({ keyExpr: "id", dataSource: [] });
    this.dataController.optionChanged({ name: "keyExpr" });

    // assert
    assert.equal(this.getDataSource().store().key(), "id", "keyExpr is assigned to store");
});

QUnit.test("Raise warning if keyExp is set and dataSource is not an array", function(assert) {
    // arrange
    var dataSource = new DataSource({
        load: function() {
            return [
                { name: 'Alex', phone: '55-55-55' },
                { name: 'Dan', phone: '98-75-21' }
            ];
        }
    });
    sinon.spy(errors, "log");

    // act
    this.applyOptions({ keyExpr: "name", dataSource: dataSource });
    this.dataController.init();

    // assert
    assert.equal(errors.log.lastCall.args[0], "W1011", "Warning about keyExpr is raised");
    assert.equal(errors.log.callCount, 1, "Warning about keyExpr is raised one time");
    errors.log.restore();
});

QUnit.test("Not raise W1011 warning if dataSource is undefined", function(assert) {
    // arrange, act
    sinon.spy(errors, "log");
    this.applyOptions({ keyExpr: "name", dataSource: undefined });
    this.dataController.init();

    // assert
    assert.equal(errors.log.callCount, 0, "Warning about keyExpr is not raised");
    errors.log.restore();
});

QUnit.test("changed on initialize", function(assert) {
    var changedCount = 0;
    var lastArgs;
    var array = [
        { name: 'Alex', phone: '55-55-55' },
        { name: 'Dan', phone: '98-75-21' }
    ];
    var dataSource = createDataSource(array);


    this.dataController.changed.add(function(args) {
        changedCount++;
        lastArgs = args;
    });
    assert.strictEqual(changedCount, 0);

    // act
    this.dataController.setDataSource(dataSource);
    dataSource.load();

    // assert
    assert.strictEqual(changedCount, 1);
    assert.ok(lastArgs);
    assert.strictEqual(lastArgs.changeType, 'refresh');
    assert.equal(lastArgs.items.length, 2);
    assert.ok(lastArgs.items[0].data);
    assert.ok(lastArgs.items[0].values);
});

// B255430
QUnit.test("Call changed after all columnsChanged", function(assert) {
    // arrange
    var that = this,
        changedCount = 0,
        columnsChangedCount = 0,
        array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Dan', phone: '98-75-21' }
        ],
        dataSource = createDataSource(array);

    that.dataController.setDataSource(dataSource);
    dataSource.load();

    that.dataController.changed.add(function() {
        changedCount++;

        // assert
        assert.equal(columnsChangedCount, 1, "columnChangedCount");
    });

    that.columnsController.columnsChanged.add(function() {
        columnsChangedCount++;

        // assert
        assert.equal(changedCount, 0, "changedCount");
    });

    // act
    that.columnsController.columnOption(0, 'visible', false);

    // assert
    assert.equal(changedCount, 1, "changedCount");
    assert.equal(columnsChangedCount, 1, "columnChangedCount");
});

QUnit.test("events rising on second initialize shared dataSource", function(assert) {
    var changedCount = 0;
    var dataSource = createDataSource([]);

    this.applyOptions({
        dataSource: dataSource
    });

    this.dataController.optionChanged({ name: "dataSource" });

    this.dataController.changed.add(function(args) {
        changedCount++;
    });

    // act
    this.dataController.optionChanged({ name: "dataSource" });

    // assert
    assert.strictEqual(changedCount, 1, 'changed called');
    assert.ok(!dataSource._disposed, 'dataSource is not disposed');
});

QUnit.test("events rising on second initialize not shared dataSource", function(assert) {
    var changedCount = 0;

    this.applyOptions({
        dataSource: []
    });

    this.dataController.optionChanged({ name: "dataSource" });

    var dataSource = this.dataController.dataSource()._dataSource;

    this.dataController.changed.add(function(args) {
        changedCount++;
    });

    // act
    this.dataController.optionChanged({ name: "dataSource" });

    // assert
    assert.ok(dataSource, 'dataSource created');
    assert.ok(dataSource._disposed, 'dataSource is disposed');
    assert.strictEqual(changedCount, 1, 'changed called');
});

QUnit.test("update rows on columnsChanged (changeType == 'columns')", function(assert) {
    var changedCount = 0;
    var array = [
        { name: 'Alex', phone: '55-55-55' },
        { name: 'Dan', phone: '98-75-21' }
    ];
    var dataSource = createDataSource(array);

    this.dataController.changed.add(function(args) {
        changedCount++;
    });


    this.dataController.setDataSource(dataSource);
    dataSource.load();

    var rows = this.dataController.items();
    this.columnsController.columnOption(1, 'visible', false);

    assert.notStrictEqual(this.dataController.items(), rows);
    assert.strictEqual(changedCount, 2);

    assert.deepEqual(this.dataController.items()[0].values, ['Alex']);
    assert.deepEqual(this.dataController.items()[1].values, ['Dan']);
});

// T134124
QUnit.test("update rows on columnsChanged when asyncLoadEnabled and column that need converting exists (changeType == 'columns')", function(assert) {
    var changedCount = 0;
    var array = [
        { name: 'Alex', phone: '55-55-55', age: "19" },
        { name: 'Dan', phone: '98-75-21', age: "23" }
    ];

    this.options.loadingTimeout = 0;
    this.options.customizeColumns = function(columns) {
        columns[2].dataType = 'number';
    };
    var dataSource = createDataSource(array);

    this.dataController.changed.add(function(args) {
        changedCount++;
    });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    this.clock.tick();

    var items = this.dataController.items();
    this.columnsController.columnOption(1, 'visible', false);

    this.clock.tick();

    assert.notStrictEqual(this.dataController.items(), items);
    assert.strictEqual(changedCount, 2);

    assert.deepEqual(this.dataController.items()[0].values, ['Alex', 19]);
    assert.deepEqual(this.dataController.items()[1].values, ['Dan', 23]);
});

// B253046
QUnit.test("Load sorting from state when columns generated by dataSource", function(assert) {
    // arrange
    var array = [
        { name: 'Alex', age: 30 },
        { name: 'Dan', age: 25 },
        { name: 'Bob', age: 20 }
    ];
    var dataSource = createDataSource(array);

    this.applyOptions({
        commonColumnSettings: { allowSorting: true }
    });

    this.columnsController.setUserState([{ dataField: 'name', visible: true, sortOrder: 'desc', sortIndex: 0, index: 0 }, { dataField: 'age', visible: true, sortOrder: 'asc', sortIndex: 1, index: 1 }]);
    this.dataController.setDataSource(dataSource);
    dataSource.load();

    // assert
    assert.deepEqual(this.dataController.items()[0].values, ['Dan', 25]);
    assert.deepEqual(this.dataController.items()[1].values, ['Bob', 20]);
    assert.deepEqual(this.dataController.items()[2].values, ['Alex', 30]);
});

// B254110
QUnit.test("set isExpanded group parameters to dataSource on initialization", function(assert) {
    // arrange
    var changedCallCount = 0;
    this.applyOptions({
        commonColumnSettings: { autoExpandGroup: true },
        dataSource: {
            store: [
                { name: 'Alex', age: 30 },
                { name: 'Dan', age: 25 },
                { name: 'Bob', age: 20 }
            ],
            group: ['name', 'age'],
            asyncLoadEnabled: false
        },
        columns: ['name', 'age']
    });

    this.dataController.changed.add(function() {
        changedCallCount++;
    });


    // act
    this.dataController._refreshDataSource();


    // assert
    assert.deepEqual(this.dataController._dataSource.group(), [{ selector: 'name', isExpanded: true, desc: false }, { selector: 'age', isExpanded: true, desc: false }]);
    assert.equal(this.dataController.items()[0].data.key, 'Alex');
    assert.equal(this.dataController.items()[1].data.key, 30);
    assert.equal(changedCallCount, 1, "changed called one time"); // T122785
});

// T221453
QUnit.test("grouping with autoExpandAll is false", function(assert) {
    // arrange
    var changedCallCount = 0;
    this.applyOptions({
        dataSource: {
            store: [
                { name: 'Alex', age: 30 },
                { name: 'Dan', age: 25 },
                { name: 'Bob', age: 20 }
            ],
            group: ['name'],
            asyncLoadEnabled: false
        },
        grouping: { autoExpandAll: false },
        columns: ['name', 'age']
    });

    this.dataController.changed.add(function() {
        changedCallCount++;
    });

    // act
    this.dataController._refreshDataSource();

    // assert
    assert.deepEqual(this.dataController._dataSource.group(), [{ selector: 'name', isExpanded: false, desc: false }]);
    assert.equal(this.dataController.items()[0].data.key, 'Alex');
    assert.deepEqual(this.dataController.items()[0].data.collapsedItems, [{ name: 'Alex', age: 30 }]);
    assert.equal(this.dataController.items()[0].data.items, null);
    assert.equal(changedCallCount, 1, "changed called one time");
});

// B254110
QUnit.test("collapseAll when grouped column with dataType", function(assert) {
    // arrange
    var changedCallCount = 0,
        loadingCount = 0;

    this.applyOptions({
        commonColumnSettings: { autoExpandGroup: true },
        dataSource: {
            store: {
                type: "array",
                onLoading: function() {
                    loadingCount++;
                },
                data: [
                    { name: 'Alex', age: 30 },
                    { name: 'Dan', age: 25 },
                    { name: 'Bob', age: 20 }
                ]
            },
            group: ['name'],
            asyncLoadEnabled: false
        },
        columns: [{ dataField: 'name', dataType: 'string' }, 'age']
    });

    // act
    this.dataController._refreshDataSource();

    this.dataController.changed.add(function() {
        changedCallCount++;
    });
    assert.equal(loadingCount, 1, "loading called one time");

    // assert
    assert.deepEqual(this.dataController._dataSource.group(), [{ selector: "name", isExpanded: true, desc: false }]);
    assert.equal(this.dataController.items()[0].data.key, 'Alex');
    assert.equal(this.dataController.items()[0].data.items.length, 1);

    // act
    this.dataController.collapseAll();

    this.clock.tick();

    // assert
    assert.equal(changedCallCount, 1, "changed called one time");
    // T372049
    assert.equal(loadingCount, 1, "loading is not called on collapseAll");
    assert.deepEqual(this.dataController._dataSource.group(), [{ selector: "name", isExpanded: false, desc: false }]);
    assert.equal(this.dataController.items()[0].data.key, 'Alex');
    assert.strictEqual(this.dataController.items()[0].data.items, null);
});

// T372049
QUnit.test("collapseAll when remoteOperations with grouping and without paging", function(assert) {
    // arrange
    var changedCallCount = 0,
        loadingArgs = [];

    this.applyOptions({
        commonColumnSettings: { autoExpandGroup: true },
        remoteOperations: { grouping: true, sorting: true },
        dataSource: {
            store: {
                type: "array",
                onLoading: function(e) {
                    loadingArgs.push(e);
                },
                data: [
                    { name: 'Alex', age: 30 },
                    { name: 'Dan', age: 25 },
                    { name: 'Bob', age: 20 }
                ]
            },
            group: ['name'],
            asyncLoadEnabled: false
        },
        columns: ['name', 'age']
    });

    // act
    this.dataController._refreshDataSource();

    this.dataController.changed.add(function() {
        changedCallCount++;
    });
    assert.equal(loadingArgs.length, 1, "loading called one time");
    assert.deepEqual(loadingArgs[0].group, [{ selector: "name", isExpanded: true, desc: false }], "loading group arg");

    // assert
    assert.deepEqual(this.dataController._dataSource.group(), [{ selector: "name", isExpanded: true, desc: false }]);
    assert.equal(this.dataController.items()[0].data.key, 'Alex');
    assert.equal(this.dataController.items()[0].data.items.length, 1);

    // act
    this.dataController.collapseAll();

    this.clock.tick();

    // assert
    assert.equal(changedCallCount, 1, "changed called one time after collapseAll");
    // T372049
    assert.equal(loadingArgs.length, 1, "loading is not called after collapseAll");
    assert.deepEqual(this.dataController._dataSource.group(), [{ selector: "name", isExpanded: false, desc: false }]);
    assert.equal(this.dataController.items()[0].data.key, 'Alex');
    assert.strictEqual(this.dataController.items()[0].data.items, null);
});

QUnit.test("collapseAll when several columns grouped", function(assert) {
    // arrange
    var changedCallCount = 0;
    this.applyOptions({
        commonColumnSettings: { autoExpandGroup: true },
        dataSource: {
            store: [
                { name: 'Alex', age: 30 },
                { name: 'Dan', age: 25 },
                { name: 'Bob', age: 20 }
            ],
            group: ['name', 'age'],
            asyncLoadEnabled: false
        },
        columns: ['name', 'age']
    });

    this.dataController._refreshDataSource();

    this.dataController.changed.add(function() {
        changedCallCount++;
    });

    // act
    this.dataController.collapseAll();
    this.clock.tick();

    this.dataController.expandRow(['Alex']);

    // assert
    assert.equal(changedCallCount, 2, "changed called two times");

    var items = this.dataController.items();
    assert.deepEqual(items[0].key, ['Alex'], 'row 0 key');
    assert.ok(items[0].isExpanded, 'row 0 isExpanded');
    assert.deepEqual(items[1].key, ['Alex', 30], 'row 1 key');
    assert.ok(!items[1].isExpanded, 'row 1 isExpanded');
    assert.deepEqual(items[2].key, ['Bob'], 'row 2 key');
    assert.ok(!items[2].isExpanded, 'row 2 isExpanded');
});

QUnit.test("the number of visible items should be identical after expandAll/collapseAll", function(assert) {
    var dataItems = [];

    $.each(TEN_NUMBERS, function(value) {
        dataItems.push({
            "field1": "group" + value,
            "field2": "firstItem"
        });

        dataItems.push({
            "field1": "group" + value,
            "field2": "secondItem"
        });
    });

    this.applyOptions({
        scrolling: { mode: 'virtual' },
        dataSource: dataItems,
        columns: [
            {
                "name": "field1",
                "dataField": "field1",
                groupIndex: 0
            },
            {
                "name": "field2",
                "dataField": "field2"
            }
        ]
    });

    this.dataController._refreshDataSource();

    var itemsCount = this.dataController.items().length;

    // act
    this.dataController.expandAll();
    this.dataController.collapseAll();

    // assert
    assert.equal(this.dataController.items().length, itemsCount, "There are no excess items");
});

// B254274
QUnit.test("sortOrder in column options and group parameters in dataSource", function(assert) {
    // arrange
    this.applyOptions({
        commonColumnSettings: { autoExpandGroup: true },
        dataSource: {
            store: [
                { team: 'internal', name: 'Alex', age: 30 },
                { team: 'internal', name: 'Dan', age: 25 },
                { team: 'internal', name: 'Bob', age: 20 },
                { team: 'public', name: 'Alice', age: 19 }
            ],
            group: ['team'],
            asyncLoadEnabled: false
        },
        columns: ['team', 'name', { dataField: 'age', sortOrder: 'asc' }]
    });

    // act
    this.dataController._refreshDataSource();

    // assert
    assert.deepEqual(this.dataController._dataSource.group(), [{ selector: 'team', isExpanded: true, desc: false }]);
    assert.equal(this.dataController.items()[0].data.key, 'internal');
    assert.equal(this.dataController.items()[1].data.name, 'Bob');
});

QUnit.test("update sorting on columnsChanged (changeType == 'sorting')", function(assert) {
    var array = [
        { name: 'Alex', age: 30 },
        { name: 'Dan', age: 25 },
        { name: 'Bob', age: 20 }
    ];
    var dataSource = createDataSource(array, { key: 'name' });

    this.applyOptions({
        commonColumnSettings: { allowSorting: true },
        sorting: { mode: 'single' }
    });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    this.columnsController.changeSortOrder(0, 'asc');

    assert.deepEqual(this.dataController.items()[0].values, ['Alex', 30]);
    assert.deepEqual(this.dataController.items()[1].values, ['Bob', 20]);
    assert.deepEqual(this.dataController.items()[2].values, ['Dan', 25]);
});

QUnit.test("reset sorting on columnsChanged (changeType == 'sorting')", function(assert) {
    var array = [
        { name: 'Alex', age: 30 },
        { name: 'Dan', age: 25 },
        { name: 'Bob', age: 20 }
    ];
    this.applyOptions({
        commonColumnSettings: { allowSorting: true },
        sorting: { mode: 'single' }
    });

    var dataSource = createDataSource(array, { key: 'name' }, { sort: 'name' });

    this.dataController.setDataSource(dataSource);
    dataSource.load();
    assert.ok(this.dataController.dataSource().sort(), 'sort parameters');

    // act
    this.columnsController.changeSortOrder(0, 'none');

    // assert
    assert.ok(!this.dataController.dataSource().sort(), 'no sort parameters');

    assert.deepEqual(this.dataController.items()[0].values, ['Alex', 30]);
    assert.deepEqual(this.dataController.items()[1].values, ['Dan', 25]);
    assert.deepEqual(this.dataController.items()[2].values, ['Bob', 20]);
});

QUnit.test("update grouping on columnsChanged (changeType == 'grouping')", function(assert) {
    var array = [
        { name: 'Alex', age: 30 },
        { name: 'Dan', age: 25 },
        { name: 'Bob', age: 20 }
    ];
    var dataSource = createDataSource(array, { key: 'name' });

    this.applyOptions({
        commonColumnSettings: { allowSorting: true },
        customizeColumns: function(columns) {
            columns[1].groupIndex = 0;
        }
    });
    this.dataController.setDataSource(dataSource);
    dataSource.load();

    assert.ok(this.dataController._dataSource.group());
    assert.equal(this.dataController.items()[0].rowType, 'group');
});

QUnit.test("Load group from state when columns generated by dataSource", function(assert) {
    // arrange
    this.options.remoteOperations = { filtering: true, sorting: true, paging: true };
    this.options.groupPanel = { visible: true, allowColumnDragging: true };
    this.options.grouping = { autoExpandAll: true };

    var array = [
        { name: 'Alex', age: 30 },
        { name: 'Dan', age: 25 },
        { name: 'Bob', age: 20 }
    ];
    var dataSource = createDataSource(array);
    this.columnsController.setUserState([{ dataField: 'name', visible: true, groupIndex: 0, index: 0 }, { dataField: 'age', visible: true, index: 1 }]);

    // act
    this.dataController.setDataSource(dataSource);
    dataSource.load();

    // assert
    assert.equal(this.dataController.items().length, 6);
    assert.deepEqual(this.dataController.items()[0].rowType, 'group');
    assert.deepEqual(this.dataController.items()[1].rowType, 'data');
    assert.deepEqual(this.dataController.items()[2].rowType, 'group');
    assert.deepEqual(this.dataController.items()[3].rowType, 'data');
    assert.deepEqual(this.dataController.items()[4].rowType, 'group');
    assert.deepEqual(this.dataController.items()[5].rowType, 'data');
});

QUnit.test("Reset sort/group parameters from user state for removed columns", function(assert) {
    // arrange
    var dataSource = [
            { age: 30 },
            { age: 20 },
            { age: 25 }
    ];

    // user state has options for removed column with dataField 'name'
    this.columnsController.setUserState([{ dataField: 'name', visible: true, groupIndex: 0, index: 0 }, { dataField: 'age', visible: true, sortIndex: 0, sortOrder: 'asc', index: 1 }]);

    this.applyOptions({ dataSource: dataSource });

    // act
    this.dataController.optionChanged({
        name: "dataSource",
        value: dataSource
    });

    // assert
    assert.deepEqual(this.dataController._dataSource.sort(), [{ selector: "age", desc: false }], 'sort from user state is applied by dataField');
    assert.deepEqual(this.dataController._dataSource.group(), null, 'group from user state not applied because dataSource not has name column');
    assert.deepEqual(this.dataController.items().length, 3);
    assert.deepEqual(this.dataController.items()[0].values, [20]);
    assert.deepEqual(this.dataController.items()[1].values, [25]);
    assert.deepEqual(this.dataController.items()[2].values, [30]);
});

// B253402
QUnit.test("reset grouping on columnsChanged (changeType == 'grouping')", function(assert) {
    var array = [
        { name: 'Alex', age: 30 },
        { name: 'Dan', age: 25 },
        { name: 'Bob', age: 20 }
    ];
    var dataSource = createDataSource(array, { key: 'name' }, { group: 'name' });

    this.dataController.setDataSource(dataSource);
    dataSource.load();
    assert.ok(this.dataController.dataSource().group());
    // act
    this.columnsController.moveColumn(0, 0, 'group', 'header');

    // assert
    assert.ok(!this.dataController.dataSource().group());
    assert.equal(this.dataController.items()[0].rowType, 'data');
});

QUnit.test("update sorting on columnsChanged (changeType == 'sorting'). Refresh current page", function(assert) {
    var array = [
        { name: 'Alex', age: 30 },
        { name: 'Dan', age: 25 },
        { name: 'Bob', age: 20 }
    ];

    var dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

    this.applyOptions({
        commonColumnSettings: { allowSorting: true },
        sorting: { mode: 'single' }
    });
    this.dataController.setDataSource(dataSource);
    dataSource.load();
    this.dataController.pageIndex(1);

    // act
    this.columnsController.changeSortOrder(0, 'asc');

    assert.equal(this.dataController.pageIndex(), 1);
    assert.equal(this.dataController.items().length, 1);
    assert.deepEqual(this.dataController.items()[0].values, ['Dan', 25]);
});

QUnit.test("sorting when calculateSortValue is defined", function(assert) {
    var array = [
        { name: 'Alex', age: 30 },
        { name: 'Dan', age: 25 },
        { name: 'Bob', age: 20 }
    ];

    var dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

    this.applyOptions({
        commonColumnSettings: { allowSorting: true },
        columns: [{
            dataField: "name", calculateSortValue: function(data) {
                return $.inArray(data.name, ['Dan', 'Bob', 'Alex']);
            }
        }, "age"],
        sorting: { mode: 'single' }
    });
    this.dataController.setDataSource(dataSource);
    dataSource.load();


    // act
    this.columnsController.changeSortOrder(0, 'asc');

    assert.equal(this.dataController.pageIndex(), 0);
    assert.equal(this.dataController.items().length, 2);
    assert.deepEqual(this.dataController.items()[0].values, ['Dan', 25]);
});

QUnit.test("sorting when sortingMethod is defined", function(assert) {
    var array = [
        { name: 'Alex', age: 30 },
        { name: 'Dan', age: 25 },
        { name: 'Bob', age: 20 }
    ];

    var order = ['Dan', 'Bob', 'Alex'];
    var dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

    this.applyOptions({
        commonColumnSettings: { allowSorting: true },
        columns: [{
            dataField: "name", sortingMethod: function(x, y) {
                return order.indexOf(x) - order.indexOf(y);
            }
        }, "age"],
        sorting: { mode: 'single' }
    });
    this.dataController.setDataSource(dataSource);
    dataSource.load();


    // act
    this.columnsController.changeSortOrder(0, 'asc');

    assert.equal(this.dataController.pageIndex(), 0);
    assert.equal(this.dataController.items().length, 2);
    assert.deepEqual(this.dataController.items()[0].values, ['Dan', 25]);
});

QUnit.test("update sorting on columnsChanged (changeType == 'sorting'). Several updates", function(assert) {
    var array = [
        { name: 'Alex', age: 30 },
        { name: 'Dan', age: 25 },
        { name: 'Bob', age: 20 }
    ];
    var dataSource = createDataSource(array, { key: 'name' });

    this.applyOptions({
        commonColumnSettings: { allowSorting: true },
        sorting: { mode: 'single' }
    });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    this.columnsController.changeSortOrder(0, 'asc');
    this.columnsController.changeSortOrder(1, 'asc');

    assert.deepEqual(this.dataController.items()[0].values, ['Bob', 20]);
    assert.deepEqual(this.dataController.items()[1].values, ['Dan', 25]);
    assert.deepEqual(this.dataController.items()[2].values, ['Alex', 30]);
});

// B233497
QUnit.test("changed when ArrayStore with datetime fields in string format", function(assert) {
    var columnsChangedArgs = [];
    var changedCount = 0;
    var dataController = this.dataController;

    var dataSource = createDataSource([
        { name: 'Alex', birthDate: '1987/5/5' },
        { name: 'Dan', birthDate: '1985/3/21' }
    ], {}, { asyncLoadEnabled: true });

    this.applyOptions({
        columns: ['Alex', { dataField: 'birthDate', dataType: 'date' }]
    });
    dataController.changed.add(function() {
        changedCount++;
    });
    this.columnsController.columnsChanged.add(function(e) {
        columnsChangedArgs.push(e);
    });
    dataController.setDataSource(dataSource);
    dataSource.load();
    this.clock.tick();

    // assert
    assert.deepEqual(dataController.items()[0].values[1], new Date(1987, 4, 5));
    assert.equal(changedCount, 1);
    assert.equal(columnsChangedArgs.length, 1);
    assert.equal(columnsChangedArgs[0].changeTypes.length, 1);
    assert.ok(columnsChangedArgs[0].changeTypes.columns);
});

QUnit.test("changed when ArrayStore with datetime fields in string format and sorting defined", function(assert) {
    var columnsChangedArgs = [];
    var changedCount = 0;
    var dataController = this.dataController;

    var dataSource = createDataSource([
        { name: 'Alex', birthDate: '1987/5/5' },
        { name: 'Dan', birthDate: '1985/3/21' }
    ], {}, { asyncLoadEnabled: true });

    this.applyOptions({
        columns: ['Alex', { dataField: 'birthDate', dataType: 'date', sortOrder: 'asc' }]
    });
    dataController.changed.add(function() {
        changedCount++;
    });
    this.columnsController.columnsChanged.add(function(e) {
        columnsChangedArgs.push(e);
    });
    dataController.setDataSource(dataSource);
    dataSource.load();
    this.clock.tick();

    // assert
    assert.deepEqual(dataController.items()[0].values[1], new Date(1985, 2, 21));
    // T122785
    assert.equal(changedCount, 1, 'one load');
    assert.equal(columnsChangedArgs.length, 1);
    // T174640
    assert.equal(columnsChangedArgs[0].changeTypes.length, 1);
    assert.ok(columnsChangedArgs[0].changeTypes.columns);
});

QUnit.test("changed when ArrayStore with datetime fields in string format and sorting defined and serializationFormat defined", function(assert) {
    var columnsChangedArgs = [];
    var changedCount = 0;
    var dataController = this.dataController;

    var dataSource = createDataSource([
        { name: 'Alex', birthDate: '1987-05-05T00:00:00Z' },
        { name: 'Dan', birthDate: '1985-03-21T00:00:00Z' }
    ], {}, { asyncLoadEnabled: true });

    this.applyOptions({
        columns: ['Alex', { dataField: 'birthDate', dataType: 'date', serializationFormat: "yyyy-MM-ddTHH:mm:ss'Z'", sortOrder: 'asc' }]
    });
    dataController.changed.add(function() {
        changedCount++;
    });
    this.columnsController.columnsChanged.add(function(e) {
        columnsChangedArgs.push(e);
    });
    dataController.setDataSource(dataSource);
    dataSource.load();
    this.clock.tick();

    // assert
    assert.deepEqual(dataController.items()[0].values[1], new Date(Date.UTC(1985, 2, 21)));
    assert.equal(changedCount, 1, 'one load');
    assert.equal(columnsChangedArgs.length, 1);
    assert.equal(columnsChangedArgs[0].changeTypes.length, 1);
    assert.ok(columnsChangedArgs[0].changeTypes.columns);
});

QUnit.test("update lookup items on refresh", function(assert) {
    var changedCount = 0;
    var dataController = this.dataController;

    var lookupLoadResult = [];

    this.options.loadingTimeout = 0;

    var dataSource = createDataSource([
        { name: 'Alex', birthDate: '5/5/1987' },
        { name: 'Dan', birthDate: '3/21/1985' }
    ]);

    this.applyOptions({
        columns: [{
            dataField: 'name', lookup: {
                valueExpr: "test",
                dataSource: {
                    load: function() {
                        return lookupLoadResult;
                    }
                }
            }
        }]
    });
    dataController.setDataSource(dataSource);
    dataSource.load();
    this.clock.tick();

    lookupLoadResult = $.Deferred();
    // act

    dataController.changed.add(function(args) {
        changedCount++;
    });

    var refreshed = false;

    // act
    dataController.refresh().done(function() {
        refreshed = true;
    });

    this.clock.tick();
    // assert
    assert.equal(changedCount, 0, 'changed call count');
    assert.ok(!refreshed, 'not refreshed');

    // act
    lookupLoadResult.resolve([]);

    // assert
    assert.equal(changedCount, 0, 'changed call count');
    assert.ok(!refreshed, 'not refreshed');
    this.clock.tick();
    assert.equal(changedCount, 1, 'changed call count');
    assert.ok(refreshed, 'refreshed');
});

QUnit.test("Not Update lookup items when no valueExpr", function(assert) {
    var changedCount = 0,
        dataController = this.dataController,
        lookupLoadCount = 0;

    var dataSource = createDataSource([
        { name: 'Alex', birthDate: '5/5/1987' },
        { name: 'Dan', birthDate: '3/21/1985' }
    ], {}, { asyncLoadEnabled: true });

    this.applyOptions({
        columns: [{
            dataField: 'name', lookup: {
                dataSource: {
                    load: function() {
                        lookupLoadCount++;
                        return [];
                    }
                }
            }
        }]
    });
    dataController.setDataSource(dataSource);

    dataController.changed.add(function(args) {
        changedCount++;
    });

    // act
    dataSource.load();
    this.clock.tick();

    // assert
    assert.equal(changedCount, 1, 'changed call count');
    assert.equal(lookupLoadCount, 0, 'lookup load count');
});

QUnit.test("Not Update lookup items on change sorting", function(assert) {
    var changedCount = 0,
        dataController = this.dataController,
        lookupLoadCount = 0;

    var dataSource = createDataSource([
        { name: 'Alex', birthDate: '5/5/1987' },
        { name: 'Dan', birthDate: '3/21/1985' }
    ], {}, { asyncLoadEnabled: true });

    this.applyOptions({
        sorting: { mode: 'single' },
        columns: [{
            allowSorting: true,
            dataField: 'name', lookup: {
                valueExpr: "test",
                dataSource: {
                    load: function() {
                        lookupLoadCount++;
                        return [];
                    }
                }
            }
        }]
    });
    dataController.setDataSource(dataSource);
    dataSource.load();
    this.clock.tick();


    dataController.changed.add(function(args) {
        changedCount++;
    });

    changedCount = 0;
    lookupLoadCount = 0;


    // act
    this.columnsController.changeSortOrder(0, 'desc');
    this.clock.tick();

    // assert
    assert.equal(changedCount, 1, 'changed call count');
    assert.equal(lookupLoadCount, 0, 'lookup load count');
});

QUnit.test("byKey from loaded items", function(assert) {
    // arrange
    var array = [
        { name: 'Alex', phone: '55-55-55' },
        { name: 'Sam', phone: '66-66-66' },
        { name: 'Dan', phone: '98-75-21' }
        ],
        data;

    var dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    // act
    this.dataController.byKey("Alex").done(function(result) {
        data = result;
    });

    // assert
    assert.equal(this.dataController.items().length, 2, "count loaded items");
    assert.deepEqual(data, { name: "Alex", phone: "55-55-55" }, "data");
});

QUnit.test("byKey from data store", function(assert) {
    // arrange
    var array = [
        { name: 'Alex', phone: '55-55-55' },
        { name: 'Sam', phone: '66-66-66' },
        { name: 'Dan', phone: '98-75-21' }
        ],
        data;

    var dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    // act
    this.dataController.byKey("Dan").done(function(result) {
        data = result;
    });

    // assert
    assert.equal(this.dataController.items().length, 2, "count loaded items");
    assert.deepEqual(data, { name: "Dan", phone: "98-75-21" }, "data");
});

QUnit.test("byKey when not has key", function(assert) {
    // arrange
    var array = [
        { name: 'Alex', phone: '55-55-55' },
        { name: 'Sam', phone: '66-66-66' },
        { name: 'Dan', phone: '98-75-21' }
        ],
        data;

    var dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    // act
    this.dataController.byKey("Test").done(function(result) {
        data = result;
    });

    // assert
    assert.equal(this.dataController.items().length, 2, "count loaded items");
    assert.strictEqual(data, undefined, "not data");
});

QUnit.test("getDataByKeys from loaded items and data store", function(assert) {
    // arrange
    var array = [
        { name: 'Alex', phone: '55-55-55' },
        { name: 'Sam', phone: '66-66-66' },
        { name: 'Dan', phone: '98-75-21' }
        ],
        data;

    var dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    // act
    this.dataController.getDataByKeys(["Alex", "Dan"]).done(function(result) {
        data = result;
    });

    // assert
    assert.equal(this.dataController.items().length, 2, "count loaded items");
    assert.equal(data.length, 2, "count data");
    assert.deepEqual(data[0], { name: "Alex", phone: "55-55-55" }, "data 1");
    assert.deepEqual(data[1], { name: "Dan", phone: "98-75-21" }, "data 2");
});

QUnit.test("getDataByKeys not has keys", function(assert) {
    // arrange
    var array = [
        { name: 'Alex', phone: '55-55-55' },
        { name: 'Sam', phone: '66-66-66' },
        { name: 'Dan', phone: '98-75-21' }
        ],
        data;

    var dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    // act
    this.dataController.getDataByKeys(["Sam", "Test2"]).done(function(result) {
        data = result;
    });

    // assert
    assert.equal(this.dataController.items().length, 2, "count loaded items");
    assert.equal(data.length, 1, "count data");
    assert.deepEqual(data[0], { name: 'Sam', phone: '66-66-66' }, "data 1");
    assert.strictEqual(data[1], undefined, "not data 2");
});

QUnit.test("getKeyByRowIndex", function(assert) {
    // arrange
    var array = [
        { name: 'Alex', phone: '55-55-55' },
        { name: 'Sam', phone: '66-66-66' },
        { name: 'Dan', phone: '98-75-21' }
    ];

    var dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    // act, assert
    assert.strictEqual(this.dataController.getKeyByRowIndex(0), "Alex");
    assert.strictEqual(this.dataController.getKeyByRowIndex(1), "Sam");
    assert.strictEqual(this.dataController.getKeyByRowIndex(5), undefined);
});

QUnit.test("getRowIndexByKey", function(assert) {
    // arrange
    var array = [
        { name: 'Alex', phone: '55-55-55' },
        { name: 'Sam', phone: '66-66-66' },
        { name: 'Dan', phone: '98-75-21' }
    ];

    var dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    // act, assert
    assert.strictEqual(this.dataController.getRowIndexByKey("Alex"), 0);
    assert.strictEqual(this.dataController.getRowIndexByKey("Sam"), 1);
    assert.strictEqual(this.dataController.getRowIndexByKey("Unknown"), -1);
});

// T174450
QUnit.test("Assign loaded dataSource instance", function(assert) {
    // arrange
    var dataSource = new DataSource({
        store: [
            { age: 30 },
            { age: 20 },
            { age: 25 }
        ],
        group: 'age',
        _preferSync: true
    });

    dataSource.load();

    this.applyOptions({ dataSource: dataSource });

    // act
    this.dataController.optionChanged({
        name: "dataSource",
        value: dataSource
    });

    // assert
    assert.equal(this.dataController.items().length, 3);
    assert.equal(this.dataController.items()[0].rowType, 'group');
    assert.equal(this.dataController.items()[1].rowType, 'group');
    assert.equal(this.dataController.items()[2].rowType, 'group');
});

// T174450
QUnit.test("Assign dataSource instance in loading", function(assert) {
    // arrange
    var dataSource = new DataSource({
        store: [
            { age: 30 },
            { age: 20 },
            { age: 25 }
        ],
        group: 'age'
    });

    dataSource.load();

    this.applyOptions({ dataSource: dataSource });

    // act
    this.dataController.optionChanged({
        name: "dataSource",
        value: dataSource
    });

    this.clock.tick();

    // assert
    assert.equal(this.dataController.items().length, 3);
    assert.equal(this.dataController.items()[0].rowType, 'group');
    assert.equal(this.dataController.items()[1].rowType, 'group');
    assert.equal(this.dataController.items()[2].rowType, 'group');
});

QUnit.test("Remote operations with ArrayStore", function(assert) {
    // arrange
    this.applyOptions({
        remoteOperations: "auto",
        dataSource: [
            { name: 'Alex', age: 20, phone: '55-55-55' },
            { name: 'Dan', age: 30, phone: '98-75-21' }
        ]
    });

    // actt
    this.dataController._refreshDataSource();

    // assert
    assert.deepEqual(this.dataController.dataSource().remoteOperations(), {}, "remote operations set correct");
});

QUnit.test("Enable all remote operations if groupPaging is true", function(assert) {
    // arrange
    this.applyOptions({
        remoteOperations: {
            groupPaging: true
        },
        dataSource: [
            { name: 'Alex', age: 20 }
        ]
    });

    // actt
    this.dataController._refreshDataSource();

    // assert
    assert.deepEqual(this.dataController.dataSource().remoteOperations(), {
        filtering: true,
        sorting: true,
        paging: true,
        grouping: true,
        summary: true,
        groupPaging: true
    }, 'remote operations set correct');
});

QUnit.test("No redefine user remoteOperations when remote groupPaging is true", function(assert) {
    // arrange
    this.applyOptions({
        remoteOperations: {
            groupPaging: true,
            sorting: false,
            summary: false
        },
        dataSource: [
            { name: 'Alex', age: 20 }
        ]
    });

    // actt
    this.dataController._refreshDataSource();

    // assert
    assert.deepEqual(this.dataController.dataSource().remoteOperations(), {
        filtering: true,
        sorting: false,
        paging: true,
        grouping: true,
        summary: false,
        groupPaging: true
    }, 'remote operations set correct');
});

QUnit.test("Remote operations with CustomStore", function(assert) {
    // arrange
    this.applyOptions({
        remoteOperations: "auto",
        dataSource: {
            load: function() { }
        }
    });

    // actt
    this.dataController._refreshDataSource();

    // assert
    assert.deepEqual(this.dataController.dataSource().remoteOperations(), {}, "remote operations set correct");
});

QUnit.test("Set remoteOperations option to true", function(assert) {
    // arrange
    this.applyOptions({
        remoteOperations: true,
        dataSource: [
            { name: 'Alex', age: 20, phone: '55-55-55' },
            { name: 'Dan', age: 30, phone: '98-75-21' }
        ]
    });

    // actt
    this.dataController._refreshDataSource();

    // assert
    assert.deepEqual(this.dataController.dataSource().remoteOperations(), { filtering: true, sorting: true, paging: true, grouping: true, summary: true }, "remote operations set correct");
});

// T541798
QUnit.test("Apply sorting by the lookup column with calculateSortValue when the first load", function(assert) {
    // arrange
    var items,
        array = [
            { State: 1 },
            { State: 2 },
            { State: 3 }
        ];

    this.applyOptions({
        dataSource: array,
        columns: [{
            dataField: "State",
            sortOrder: "asc",
            lookup: {
                valueExpr: "id",
                displayExpr: "name",
                dataSource: [{
                    id: 1,
                    name: "Wyoming"
                }, {
                    id: 2,
                    name: "California"
                }, {
                    id: 3,
                    name: "Arkansas"
                }]
            },
            calculateSortValue: function(data) {
                var value = this.calculateCellValue(data);
                return this.lookup.calculateCellValue(value);
            }
        }]
    });

    // act
    this.dataController._refreshDataSource();

    // assert
    items = this.dataController.items();
    assert.equal(items.length, 3, "count item");
    assert.deepEqual(items[0].data, { State: 3 });
    assert.deepEqual(items[1].data, { State: 2 });
    assert.deepEqual(items[2].data, { State: 1 });
});

QUnit.module("No dataSource", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("getters", function(assert) {
    assert.strictEqual(this.dataController.items().length, 0);
    assert.strictEqual(this.dataController.totalItemsCount(), 0);
    assert.strictEqual(this.dataController.pageCount(), 1);
    assert.strictEqual(this.dataController.pageIndex(), 0);
    assert.strictEqual(this.dataController.pageSize(), 0);
    assert.strictEqual(this.dataController.isLoading(), false);
});

QUnit.test("change pageIndex", function(assert) {
    this.applyOptions({});
    this.dataController.pageIndex(2);
    assert.strictEqual(this.dataController.pageIndex(), 0);
});

QUnit.test("change pageSize", function(assert) {
    this.applyOptions({});
    this.dataController.pageSize(100);
    assert.strictEqual(this.dataController.pageSize(), 0);
});

QUnit.test("refresh", function(assert) {
    this.applyOptions({});
    this.dataController.refresh();
    assert.ok(1);
});

QUnit.test("begin/end customLoading", function(assert) {
    this.applyOptions({});
    this.dataController.beginCustomLoading();
    assert.ok(this.dataController.isLoading());
    this.dataController.endCustomLoading();
    assert.ok(!this.dataController.isLoading());
});

QUnit.module("Loading", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("LoadingChanged event on one loading", function(assert) {
    var that = this,
        loadingStates = [],
        dataSource = createDataSource([{ id: 1 }, { id: 2 }, { id: 3 }], {}, {
            pageSize: 2
        });
    that.dataController.setDataSource(dataSource);
    dataSource.load();

    that.dataController.loadingChanged.add(function(isLoading) {
        loadingStates.push(isLoading);
    });

    assert.deepEqual(loadingStates, []);

    // act
    that.dataController.pageIndex(1);

    // assert
    assert.deepEqual(loadingStates, [true, false]);
});

QUnit.test("isLoading for loaded dataSource", function(assert) {
    var arrayStore = new ArrayStore([]);
    var dataSource = new DataSource({
        store: arrayStore,
        _preferSync: true
    });

    // act
    this.dataController.setDataSource(dataSource);
    dataSource.load();

    // assert
    assert.ok(!this.dataController.isLoading());
});

QUnit.test("begin custom loading", function(assert) {
    var loadingStates = [];
    var dataSource = createDataSource([]);
    this.dataController.setDataSource(dataSource);
    dataSource.load();

    this.dataController.loadingChanged.add(function(isLoading) {
        loadingStates.push(isLoading);
    });

    assert.deepEqual(loadingStates, []);

    // act
    this.dataController.beginCustomLoading();

    // assert
    assert.ok(this.dataController.isLoading());
    assert.deepEqual(loadingStates, [true]);
});

QUnit.test("end custom loading", function(assert) {
    var loadingStates = [];
    var dataSource = createDataSource([]);
    this.dataController.setDataSource(dataSource);
    dataSource.load();

    this.dataController.loadingChanged.add(function(isLoading) {
        loadingStates.push(isLoading);
    });

    this.dataController.beginCustomLoading();

    // act
    this.dataController.endCustomLoading();

    // assert
    assert.ok(!this.dataController.isLoading());
    assert.deepEqual(loadingStates, [true, false]);
});

// T179346
QUnit.test("Loading for lookup column", function(assert) {
    var lookupDeferred = $.Deferred();
    var loadingStates = [];
    var arrayStore = new ArrayStore([]);
    var dataSource = new DataSource({
        store: arrayStore,
        _preferSync: true
    });

    this.applyOptions({
        columns: [{
            dataField: 'testId',
            lookup: {
                valueExpr: "test",
                dataSource: {
                    load: function() {
                        return lookupDeferred;
                    }
                }
            }
        }]
    });

    // act
    this.dataController.loadingChanged.add(function(isLoading) {
        loadingStates.push(isLoading);
    });
    this.dataController.setDataSource(dataSource);
    dataSource.load();

    // assert
    assert.ok(this.dataController.isLoading(), 'isLoading is true when lookup dataSource is not loaded');
    assert.deepEqual(loadingStates, [true, false, true], 'loading states before lookup dataSource is loaded');

    // act
    lookupDeferred.resolve([]);

    // assert
    assert.deepEqual(loadingStates, [true, false, true, false], 'loading states when lookup dataSource is loaded');
    assert.ok(!this.dataController.isLoading(), 'isLoading when lookup dataSource is loaded');
});

QUnit.module("Parsing values", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("Null value for dateTime dataType", function(assert) {
    var array = [
        { name: 'Alex', birthday: null }
    ];
    var dataSource = createDataSource(array, { key: 'name' });

    this.applyOptions({
        columns: ['name', { dataField: "birthday", dataType: 'date', format: 'shortDate' }]
    });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    assert.deepEqual(this.dataController.items()[0].values, ['Alex', null]);
});

QUnit.test("value from calculateCellValue", function(assert) {
    var array = [
        { firstName: 'Alex', secondName: 'Ivanov' },
        { firstName: 'Boris', secondName: 'Sidorov' }
    ];
    var dataSource = createDataSource(array, { key: 'name' });

    this.applyOptions({
        columns: [{ calculateCellValue: function(data) { return data.firstName + ' ' + data.secondName; } }]
    });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    assert.equal(this.dataController.items().length, 2);
    assert.deepEqual(this.dataController.items()[0].values, ['Alex Ivanov']);
    assert.deepEqual(this.dataController.items()[1].values, ['Boris Sidorov']);
});

var setupPagingModule = function() {
    setupModule.apply(this);

    this.array = [
        { name: 'Alex', pay: 215 },
        { name: 'Dan1', pay: 151 },
        { name: 'Dan2', pay: 152 },
        { name: 'Dan3', pay: 153 },
        { name: 'Dan4', pay: 154 },
        { name: 'Dan5', pay: 155 },
        { name: 'Dan6', pay: 156 }
    ];
    var dataSource = createDataSource(this.array, { key: 'name' }, {
        pageSize: 5,
        paginate: true
    });

    this.dataSource = dataSource;
};

var teardownPagingModule = function() {
    teardownModule.apply(this);
};

QUnit.module("Paging", { beforeEach: setupPagingModule, afterEach: teardownPagingModule });

QUnit.test("PagesCount, TotalCount, Rows after initialization", function(assert) {
    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();

    assert.equal(this.dataController.items().length, 5);
    assert.equal(this.dataController.totalCount(), 7);
    assert.equal(this.dataController.pageCount(), 2);
    assert.equal(this.dataController.pageIndex(), 0);
    assert.ok(this.dataController.hasKnownLastPage());
    assert.deepEqual(this.dataController.items()[0].values, ['Alex', 215]);
    assert.deepEqual(this.dataController.items()[0].data, { name: 'Alex', pay: 215 });
});

QUnit.test("PagesCount after filter dataSource", function(assert) {
    var changedCount = 0;

    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();
    this.dataController.changed.add(function() {
        changedCount++;
    });

    // act
    this.dataSource.filter(['name', 'Dan3']);
    this.dataSource.reload(true);

    // assert
    assert.equal(changedCount, 1);
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.totalCount(), 1);
    assert.equal(this.dataController.pageCount(), 1);
    assert.equal(this.dataController.pageIndex(), 0);
    assert.deepEqual(this.dataController.items()[0].values, ['Dan3', 153]);
});

QUnit.test("Change pageIndex", function(assert) {
    // arrange
    var countCallPageChanged = 0;

    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();

    this.dataController.pageChanged.add(function() {
        countCallPageChanged++;
    });

    // act
    this.dataController.pageIndex(1);

    assert.equal(this.dataController.items().length, 2);
    assert.equal(this.dataController.pageIndex(), 1);
    assert.deepEqual(this.dataController.items()[0].values, ['Dan5', 155]);
    assert.deepEqual(this.dataController.items()[0].data, { name: 'Dan5', pay: 155 });

    // T262949
    assert.equal(countCallPageChanged, 1, "pageChanged is called");
});

QUnit.test("get pageIndex after change dataSource pageIndex", function(assert) {
    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();
    this.dataSource.pageIndex(1);
    this.dataSource.reload(true);

    assert.equal(this.dataController.items().length, 2);
    assert.equal(this.dataController.pageIndex(), 1);
});

// B233043
QUnit.test("change pageIndex to greater then pageCount", function(assert) {
    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();
    this.dataController.pageIndex(5);

    assert.equal(this.dataController.items().length, 2);
    assert.equal(this.dataController.pageIndex(), 1);
});

QUnit.test("Change pageSize", function(assert) {
    // arrange
    var countCallPageChanged = 0;

    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();
    this.dataController.pageIndex(1);

    this.dataController.pageChanged.add(function() {
        countCallPageChanged++;
    });

    // act
    this.dataController.pageSize(3);

    // assert
    assert.equal(this.dataController.items().length, 3);
    assert.equal(this.dataController.pageCount(), 3);
    assert.equal(this.dataController.pageIndex(), 0);
    assert.deepEqual(this.dataController.items()[0].values, ['Alex', 215]);

    // T262949
    assert.equal(countCallPageChanged, 1, "count call pageChanged");
});

QUnit.test("Change dataSource after change pageSize", function(assert) {
    this.options.dataSource = this.array;
    this.options.paging = { enabled: true, pageSize: 5 };

    this.dataController.optionChanged({ name: 'dataSource' });

    // act
    this.dataController.pageSize(2);

    // assert
    assert.equal(this.dataController.pageSize(), 2);
    assert.equal(this.dataController.pageCount(), 4);

    // act
    this.dataController.optionChanged({ name: 'dataSource' });

    // assert
    assert.equal(this.dataController.pageSize(), 2);
    assert.equal(this.dataController.pageCount(), 4);
    assert.equal(this.option('paging.pageSize'), 2);
});

// T310271
QUnit.test("Change dataSource after change pageIndex", function(assert) {
    this.options.dataSource = this.array;
    this.options.paging = { enabled: true, pageSize: 5 };

    this.dataController.optionChanged({ name: 'dataSource' });

    // act
    this.dataController.pageIndex(1);

    // assert
    assert.equal(this.dataController.pageIndex(), 1);
    assert.equal(this.dataController.pageCount(), 2);

    // act
    this.dataController.optionChanged({ name: 'dataSource' });

    // assert
    assert.equal(this.dataController.pageIndex(), 1);
    assert.equal(this.dataController.pageCount(), 2);
    assert.equal(this.option('paging.pageIndex'), 1);
});


QUnit.test("Rise changed on set pageSize", function(assert) {
    var changedCount = 0;

    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();

    this.dataController.pageSize(10);

    this.dataController.changed.add(function(controller) {
        changedCount++;
    });

    // act
    this.dataController.pageSize(20);

    // assert
    assert.equal(changedCount, 1, 'on change pageSize');
});

QUnit.test("Rise changed on set pageSize with changing pageCount", function(assert) {
    var changedCount = 0;

    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();
    this.dataController.changed.add(function(controller) {
        changedCount++;
    });

    // act
    this.dataController.pageSize(3);

    // assert
    assert.equal(changedCount, 1, 'one on change pageSize');
});

// B239351
QUnit.test("Rise changed on set pageIndex", function(assert) {
    var changedCallCount = 0;
    var dataController = this.dataController;
    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();
    dataController.changed.add(function() {
        changedCallCount++;
    });
    dataController.pageIndex(1);
    this.clock.tick();
    assert.equal(dataController.pageIndex(), 1);
    assert.equal(changedCallCount, 1);
});


QUnit.test("Not Rise changed on get pageIndex", function(assert) {
    var changedCount = 0;
    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();
    this.dataController.changed.add(function() {
        changedCount++;
    });
    assert.equal(this.dataController.pageIndex(), 0);
    assert.equal(changedCount, 0);
});

QUnit.test("update pageCount after insert", function(assert) {
    var changedCount = 0;
    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();
    this.dataController.changed.add(function() {
        changedCount++;
    });

    this.dataSource.store().insert({ name: 'Dan7', pay: 163 });
    this.dataSource.store().insert({ name: 'Dan8', pay: 164 });
    this.dataSource.store().insert({ name: 'Dan9', pay: 165 });
    this.dataSource.store().insert({ name: 'Dan10', pay: 166 });
    this.dataSource.reload(true);

    assert.equal(this.dataController.pageIndex(), 0);
    assert.equal(this.dataController.totalCount(), 11);
    assert.equal(this.dataController.pageCount(), 3);
    assert.equal(changedCount, 1, 'changed raise after reload');
});

// T202716
QUnit.test("initialize pageIndex, pageSize from paging options when dataSource is DataSource instance", function(assert) {
    this.options.dataSource = this.dataSource;
    this.options.paging = {
        enabled: true,
        pageSize: 3,
        pageIndex: 1
    };

    this.dataController._refreshDataSource();

    assert.equal(this.dataController.pageIndex(), 1);
    assert.equal(this.dataController.pageCount(), 3);
    assert.ok(this.dataController.hasKnownLastPage());
    assert.equal(this.dataController.totalCount(), 7);
    assert.equal(this.dataController.items().length, 3);
    assert.deepEqual(this.dataController.items()[0].values, ['Dan3', 153]);
});

QUnit.test("Page size of data source is not changed for old value_T242652", function(assert) {
    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();

    // act
    var dataSourceChangedCounter = 0;

    this.dataSource.on("changed", function() {
        dataSourceChangedCounter++;
    });

    this.dataController.pageSize(1);
    this.dataController.pageSize(1);

    // assert
    assert.equal(dataSourceChangedCounter, 1);
});

var setupVirtualScrollingModule = function() {
    this.options = {
        scrolling: { mode: 'virtual' },
        pager: { visible: 'auto' }
    };
    setupModule.apply(this);

    var i, array = [];

    for(i = 0; i < 1000; i++) {
        array.push({
            id: i,
            value: 'value' + i.toString()
        });
    }

    var dataSource = createDataSource(array, { key: 'id' }, {
        pageSize: 20,
        paginate: true
    });

    this.array = array;

    this.dataController.setDataSource(dataSource);
    this.dataController.viewportSize(10);
    dataSource.load();
    this.dataSource = dataSource;
};

var teardownVirtualScrollingModule = function() {
    teardownModule.apply(this);
};

QUnit.module("Virtual scrolling", { beforeEach: setupVirtualScrollingModule, afterEach: teardownVirtualScrollingModule });

QUnit.test("virtual items return null when no virtual scrolling", function(assert) {
    var dataSource = createDataSource(this.array, { key: 'id' }, {
        pageSize: 20,
        paginate: true,
        userPageSize: 20
    });
    this.applyOptions({
        scrolling: { mode: 'standard' }
    });
    this.dataController.setDataSource(dataSource);
    dataSource.load();
    assert.ok(!this.dataController.virtualItemsCount());
});

QUnit.test("virtual items when virtual scrolling enabled", function(assert) {
    var virtualItemsCount = this.dataController.virtualItemsCount();
    assert.ok(virtualItemsCount);
});

QUnit.test("virtual items at begin", function(assert) {
    var virtualItemsCount = this.dataController.virtualItemsCount();
    assert.ok(virtualItemsCount);
    assert.deepEqual(virtualItemsCount, {
        begin: 0,
        end: 960
    });
    assert.equal(this.dataController.items().length, 40);
});

QUnit.test("virtual items at end", function(assert) {
    this.dataController.setViewportItemIndex(985);
    var virtualItemsCount = this.dataController.virtualItemsCount();
    assert.ok(virtualItemsCount);
    assert.deepEqual(virtualItemsCount, {
        begin: 960,
        end: 0
    });
    assert.equal(this.dataController.items().length, 40);
});

QUnit.test("virtual items after small scrolling at beginning", function(assert) {
    this.dataController.setViewportItemIndex(1);
    var virtualItemsCount = this.dataController.virtualItemsCount();
    assert.ok(virtualItemsCount);
    assert.deepEqual(virtualItemsCount, {
        begin: 0,
        end: 960
    });
    assert.equal(this.dataController.items().length, 40);
});

QUnit.test("virtual items before page center", function(assert) {
    this.dataController.setViewportItemIndex(9);
    var virtualItemsCount = this.dataController.virtualItemsCount();
    assert.ok(virtualItemsCount);
    assert.deepEqual(virtualItemsCount, {
        begin: 0,
        end: 960
    });
    assert.equal(this.dataController.items().length, 40);
    assert.strictEqual(this.dataController.pageIndex(), 0);
});

QUnit.test("virtual items after page center", function(assert) {
    this.dataController.setViewportItemIndex(11);
    var virtualItemsCount = this.dataController.virtualItemsCount();
    assert.ok(virtualItemsCount);
    assert.deepEqual(virtualItemsCount, {
        begin: 0,
        end: 960
    });
    assert.equal(this.dataController.items().length, 40);
    assert.strictEqual(this.dataController.pageIndex(), 0);
});

QUnit.test("virtual items before page end", function(assert) {
    this.dataController.setViewportItemIndex(19);
    var virtualItemsCount = this.dataController.virtualItemsCount();
    assert.ok(virtualItemsCount);
    assert.deepEqual(virtualItemsCount, {
        begin: 0,
        end: 960
    });
    assert.equal(this.dataController.items().length, 40);
    assert.strictEqual(this.dataController.pageIndex(), 0);
});

QUnit.test("virtual items after page end", function(assert) {
    this.dataController.setViewportItemIndex(21);
    var virtualItemsCount = this.dataController.virtualItemsCount();
    assert.ok(virtualItemsCount);
    assert.deepEqual(virtualItemsCount, {
        begin: 0,
        end: 940
    });
    assert.equal(this.dataController.items().length, 60);
    assert.strictEqual(this.dataController.pageIndex(), 1);
});


QUnit.test("virtual items after change current page to next", function(assert) {
    this.dataController.setViewportItemIndex(25);
    var virtualItemsCount = this.dataController.virtualItemsCount();
    assert.ok(virtualItemsCount);
    assert.deepEqual(virtualItemsCount, {
        begin: 0,
        end: 940
    });
    assert.equal(this.dataController.items().length, 60);
    assert.strictEqual(this.dataController.pageIndex(), 1);
});

QUnit.test("virtual items after change current page to previous", function(assert) {
    this.dataController.setViewportItemIndex(25);
    assert.strictEqual(this.dataController.pageIndex(), 1);

    this.dataController.setViewportItemIndex(5);

    assert.strictEqual(this.dataController.pageIndex(), 0);

    assert.equal(this.dataController.items().length, 60);
    assert.deepEqual(this.dataController.virtualItemsCount(), {
        begin: 0,
        end: 940
    });
});

QUnit.test("virtual items after change current page to far", function(assert) {
    this.dataController.setViewportItemIndex(400);
    var virtualItemsCount = this.dataController.virtualItemsCount();
    assert.deepEqual(virtualItemsCount, {
        begin: 400,
        end: 560
    });
    assert.equal(this.dataController.items().length, 40);
    assert.strictEqual(this.dataController.pageIndex(), 20);
});

QUnit.test("virtual items on end when last page size less than half page size", function(assert) {
    var dataController = this.dataController;
    dataController.store().insert({ id: 1001, value: 'value1001' });
    dataController.refresh();

    dataController.setViewportItemIndex(999);
    assert.strictEqual(this.dataController.pageIndex(), 49);

    this.clock.tick();

    assert.strictEqual(dataController.items().length, 21, "items");

    // act
    var virtualItemsCount = dataController.virtualItemsCount();

    // assert
    assert.strictEqual(virtualItemsCount.begin, 980);
    assert.strictEqual(virtualItemsCount.end, 0);
});

// B233350
QUnit.test("virtual items on end when visibleRowsCount < pageSize and last page size greater than half page size", function(assert) {
    var dataController = this.dataController;
    dataController._dataSource.store().remove(999);
    dataController.refresh();
    dataController.setViewportItemIndex(998);
    assert.strictEqual(this.dataController.pageIndex(), 49);

    this.clock.tick();

    assert.strictEqual(dataController.items().length, 39);

    // act
    var virtualItemsCount = dataController.virtualItemsCount();

    // assert
    assert.strictEqual(virtualItemsCount.begin, 960);
    assert.strictEqual(virtualItemsCount.end, 0);
});

QUnit.test("virtual items on setViewportItemIndex at end", function(assert) {
    // act
    this.dataController.setViewportItemIndex(990);

    // assert

    assert.strictEqual(this.dataController.items().length, 40);
    assert.strictEqual(this.dataController.virtualItemsCount().end, 0);
});

QUnit.test("getAllRowsCount for virtual scrolling", function(assert) {
    assert.strictEqual(this.dataController.totalItemsCount(), 1000);
});

// T308521
QUnit.test("change sorting in onContentReady", function(assert) {
    // arrange
    var that = this,
        countCallChanged = 0,
        countCallDataSourceChanged = 0,
        dataSource = that.dataController.dataSource();

    that.dataController.changed.add(function() {
        that.columnOption("id", "sortOrder", "desc");
        countCallChanged++;
    });

    dataSource.changed.add(function() {
        countCallDataSourceChanged++;
    });

    // act
    dataSource.reload(true);

    // arrange
    assert.equal(that.dataController.items()[0].key, 999, "sorting is applied");
    assert.equal(countCallChanged, 3, "count call changed of the dataController");
    assert.equal(countCallDataSourceChanged, 3, "count call changed of the dataSource");
});


var setupVirtualRenderingModule = function() {
    var array = [];

    for(var i = 0; i < 100; i++) {
        array.push({
            id: i,
            value: 'value' + i.toString()
        });
    }
    this.array = array;

    this.clock = sinon.useFakeTimers();

    var options = {
        scrolling: { mode: "virtual", rowRenderingMode: "virtual" },
        keyExpr: "id",
        paging: {
            pageSize: 20
        },
        dataSource: array
    };

    setupDataGridModules(this, ['data', 'virtualScrolling', 'columns', 'filterRow', 'search', 'editing', 'grouping', 'headerFilter', 'masterDetail'], {
        initDefaultOptions: true,
        options: options
    });


    this.dataController.viewportItemSize(10);
    this.dataController.viewportSize(9);
    this.dataController._dataSource._renderTime = 50;

    this.clock.tick();

    this.changedArgs = [];

    var that = this;

    this.dataController.changed.add(function(e) {
        that.changedArgs.push(e);
    });
};

var teardownVirtualRenderingModule = function() {
    this.dispose();
    this.clock.restore();
};

QUnit.module("Virtual rendering", { beforeEach: setupVirtualRenderingModule, afterEach: teardownVirtualRenderingModule });

QUnit.test("first render", function(assert) {
    assert.strictEqual(this.dataController.pageIndex(), 0);
    assert.strictEqual(this.dataController.items().length, 15);

    assert.strictEqual(this.dataController.getContentOffset("begin"), 0);
    assert.strictEqual(this.dataController.getContentOffset("end"), 850);
});

QUnit.test("scroll to before second render page", function(assert) {
    this.dataController.setViewportPosition(49);

    assert.strictEqual(this.dataController.pageIndex(), 0);
    assert.strictEqual(this.dataController.items().length, 15);
    assert.strictEqual(this.dataController.items()[0].key, 0);
    assert.strictEqual(this.dataController.getContentOffset("begin"), 0);
    assert.strictEqual(this.dataController.getContentOffset("end"), 850);
});

QUnit.test("scroll to second render page", function(assert) {
    this.dataController.setViewportPosition(50);

    assert.strictEqual(this.dataController.pageIndex(), 0);
    assert.strictEqual(this.dataController.items().length, 15);
    assert.strictEqual(this.dataController.items()[0].key, 5);
    assert.strictEqual(this.dataController.getContentOffset("begin"), 50);
    assert.strictEqual(this.dataController.getContentOffset("end"), 800);
    assert.deepEqual(this.changedArgs, [{
        changeType: "append",
        removeCount: 5,
        items: this.dataController.items().slice(10, 15)
    }]);
});

QUnit.test("scroll to third render page", function(assert) {
    this.dataController.setViewportPosition(100);

    assert.strictEqual(this.dataController.pageIndex(), 0);
    assert.strictEqual(this.dataController.items().length, 15);
    assert.strictEqual(this.dataController.items()[0].key, 10);
    assert.strictEqual(this.dataController.getContentOffset("begin"), 100);
    assert.strictEqual(this.dataController.getContentOffset("end"), 750);
});

QUnit.test("scroll to second dataSource page", function(assert) {
    this.dataController.setViewportPosition(100);
    this.changedArgs = [];
    this.dataController.setViewportPosition(200);

    assert.strictEqual(this.dataController.pageIndex(), 1);
    assert.strictEqual(this.dataController.items().length, 15);
    assert.strictEqual(this.dataController.items()[0].key, 20);
    assert.strictEqual(this.dataController.getContentOffset("begin"), 200);
    assert.strictEqual(this.dataController.getContentOffset("end"), 650);
    assert.deepEqual(this.changedArgs, [{
        changeType: "append",
        removeCount: 5,
        items: this.dataController.items().slice(5, 10)
    }, {
        changeType: "append",
        removeCount: 5,
        items: this.dataController.items().slice(10, 15)
    }]);
});

QUnit.test("scroll to far", function(assert) {
    this.dataController.setViewportPosition(500);

    assert.strictEqual(this.dataController.pageIndex(), 2);
    assert.strictEqual(this.dataController.items().length, 15);
    assert.strictEqual(this.dataController.items()[0].key, 50);
    assert.strictEqual(this.dataController.getContentOffset("begin"), 500);
    assert.strictEqual(this.dataController.getContentOffset("end"), 350);
    assert.deepEqual(this.changedArgs, [{
        changeType: "refresh",
        items: this.dataController.items()
    }, {
        changeType: "append",
        items: this.dataController.items().slice(5, 10)
    }, {
        changeType: "append",
        items: this.dataController.items().slice(10, 15)
    }]);
});

QUnit.test("scroll to previous render page", function(assert) {
    this.dataController.setViewportPosition(500);
    this.changedArgs = [];
    this.dataController.setViewportPosition(450);

    assert.strictEqual(this.dataController.items().length, 15);
    assert.strictEqual(this.dataController.items()[0].key, 45);
    assert.strictEqual(this.dataController.getContentOffset("begin"), 450);
    assert.strictEqual(this.dataController.getContentOffset("end"), 400);
    assert.deepEqual(this.changedArgs, [{
        changeType: "prepend",
        removeCount: 5,
        items: this.dataController.items().slice(0, 5)
    }]);
});

QUnit.test("disabled row render virtualization", function(assert) {
    this.options.scrolling.rowRenderingMode = "standard";

    this.dataController.optionChanged({ name: "scrolling", fullName: "scrolling.rowRenderingMode" });
    this.dataController.viewportItemSize(10);
    this.dataController.viewportSize(9);
    this.clock.tick(0);

    assert.strictEqual(this.dataController.items().length, 40);
    assert.strictEqual(this.dataController.items()[0].key, 0);
    assert.strictEqual(this.dataController.getContentOffset("begin"), 0);
    assert.strictEqual(this.dataController.getContentOffset("end"), 600);
    assert.deepEqual(this.changedArgs, [{
        changeType: "refresh",
        items: this.dataController.items()
    }]);
});

QUnit.test("enabled row render virtualization and disabled scrolling mode virtual", function(assert) {
    this.options.scrolling.rowRenderingMode = "virtual";
    this.options.scrolling.mode = "standard";

    this.dataController.optionChanged({ name: "scrolling" });
    this.dataController.viewportItemSize(10);
    this.dataController.viewportSize(9);
    this.clock.tick(0);

    assert.strictEqual(this.dataController.items().length, 15);
    assert.strictEqual(this.dataController.items()[0].key, 0);
    assert.strictEqual(this.dataController.getContentOffset("begin"), 0);
    assert.strictEqual(this.dataController.getContentOffset("end"), 50);
    assert.deepEqual(this.changedArgs, [{
        changeType: "refresh",
        items: this.dataController.items()
    }, {
        changeType: "append",
        items: this.dataController.items().slice(10, 15)
    }]);
});

QUnit.test("scroll to to the next page after expand", function(assert) {
    this.options.scrolling.rowRenderingMode = "standard";
    this.dataController.optionChanged({ name: "scrolling" });
    this.dataController.viewportItemSize(10);
    this.dataController.viewportSize(9);
    this.clock.tick();

    this.dataController.expandRow(1);
    this.dataController.expandRow(19);
    this.dataController.expandRow(20);

    this.dataController.setViewportPosition(200);
    this.clock.tick();

    // act
    this.changedArgs = [];
    this.dataController.setViewportPosition(400);
    this.clock.tick();

    // assert
    assert.strictEqual(this.dataController.items().length, 61);
    assert.strictEqual(this.dataController.items()[0].key, 20);
    assert.strictEqual(this.dataController.getContentOffset("begin"), 200);
    assert.strictEqual(this.dataController.getContentOffset("end"), 200);
    assert.deepEqual(this.changedArgs.length, 1);
    assert.deepEqual(this.changedArgs[0].changeType, "append");
    assert.deepEqual(this.changedArgs[0].items.length, 20);
    assert.deepEqual(this.changedArgs[0].removeCount, 22, "remove count should include expanded rows");
});

// T641290
QUnit.test("Search should work correctly when rowRenderingMode is set to 'virtual'", function(assert) {
    // arrange, act
    this.options.searchPanel = { text: "test" };
    this.dataController.optionChanged({ fullName: "searchPanel.text", value: "test" });
    this.clock.tick();

    // assert
    assert.strictEqual(this.dataController.items().length, 0, "item count");
    assert.strictEqual(this.dataController.pageCount(), 1, "page count");

    // act
    this.options.searchPanel = { text: "" };
    this.dataController.optionChanged({ fullName: "searchPanel.text", value: "" });
    this.clock.tick();

    // assert
    assert.strictEqual(this.dataController.items().length, 15, "item count");
    assert.strictEqual(this.dataController.pageCount(), 5, "page count");
});

// =================================
// scrollingDataSource tests

var TEN_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

QUnit.module("Virtual scrolling (ScrollingDataSource)", {
    beforeEach: function() {

        this.options = {
            scrolling: { mode: 'virtual' },
            pager: { visible: 'auto' },
            paging: {},
            remoteOperations: { filtering: true, sorting: true, paging: true },
            grouping: { autoExpandAll: true }
        };
        setupModule.apply(this);

        this.setupDataSource = function(options) {
            this.options.paging.pageSize = options.pageSize;
            this.dataSource = createDataSource(options.data || TEN_NUMBERS, {}, $.extend({ paginate: true }, options));
            this.dataController.setDataSource(this.dataSource);
            this.dataSource.load();
            this.dataController.viewportSize(2);
        };

        this.getDataItems = function(items) {
            var dataItems = [];

            items = items || this.dataController.items();

            $.each(items, function() {
                dataItems.push(this.data);
            });
            return dataItems;
        };

        this.clock = sinon.useFakeTimers();
    }, afterEach: function() {
        teardownModule.call(this);
        this.clock.restore();
    }
});

QUnit.test("load first page", function(assert) {
    // act
    this.setupDataSource({
        pageSize: 3
    });

    // assert
    assert.deepEqual(this.getDataItems(), [1, 2, 3, 4, 5, 6], "two pages are loaded");
    assert.ok(this.dataController.isLoaded());
});

QUnit.test("preload next page after change viewport item index", function(assert) {
    this.setupDataSource({
        pageSize: 3
    });

    var changedArgs = [];

    this.dataController.viewportSize(2);
    this.dataController.changed.add(function(e) {
        changedArgs.push(e);
    });

    // act
    this.dataController.setViewportItemIndex(3);

    // assert
    assert.equal(changedArgs.length, 1);
    assert.equal(changedArgs[0].changeType, 'append');
    assert.deepEqual(this.getDataItems(changedArgs[0].items), [7, 8, 9]);
    assert.deepEqual(this.getDataItems(), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    assert.ok(this.dataController.isLoaded());
});

// T103382
QUnit.test("moving to loaded page rise changed event with changeType pageIndex", function(assert) {
    var changedCallsCount = 0,
        changedArgs;

    this.setupDataSource({
        pageSize: 3
    });

    this.dataController.viewportSize(2);
    this.dataController.setViewportItemIndex(0);
    this.dataController.setViewportItemIndex(3);

    assert.equal(this.dataController.pageIndex(), 1);

    this.dataController.changed.add(function(e) {
        changedCallsCount++;
        changedArgs = e;
    });

    // act
    this.dataController.setViewportItemIndex(0);

    // assert
    assert.equal(changedCallsCount, 1);
    assert.equal(changedArgs.changeType, 'pageIndex');
    assert.equal(this.dataController.pageIndex(), 0, 'pageIndex');
    assert.deepEqual(this.getDataItems(), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

QUnit.test("load pages after change viewport item index to far", function(assert) {
    var changedArgs = [];

    this.options.loadingTimeout = 0;
    this.setupDataSource({
        pageSize: 2
    });
    this.dataController.viewportSize(2);
    this.clock.tick();
    this.dataController.changed.add(function(e) {
        changedArgs.push(e);
    });

    this.dataController.setViewportItemIndex(7);
    // act
    this.clock.callTimer(this.clock.firstTimerInRange());
    // assert
    assert.equal(changedArgs.length, 1);
    assert.equal(changedArgs[0].changeType, 'refresh');
    assert.deepEqual(this.getDataItems(changedArgs[0].items), [7, 8]);
    assert.deepEqual(this.getDataItems(), [7, 8]);
    assert.ok(this.dataController.isLoaded());


    // act
    this.clock.callTimer(this.clock.firstTimerInRange());

    // assert
    assert.equal(changedArgs.length, 2);
    assert.deepEqual(changedArgs[1].changeType, 'append');
    assert.deepEqual(this.getDataItems(changedArgs[1].items), [9, 10]);
    assert.deepEqual(this.getDataItems(), [7, 8, 9, 10]);
    assert.ok(this.dataController.isLoaded());
});

// T103389
QUnit.test("load several pages when pageSize less then viewportSize", function(assert) {
    var changedArgs = [];

    this.options.loadingTimeout = 0;
    this.setupDataSource({
        pageSize: 2
    });
    this.dataController.viewportSize(3);
    this.dataController.changed.add(function(e) {
        changedArgs.push(e);
    });
    // act
    this.clock.tick();

    // assert
    assert.equal(changedArgs.length, 3);
    assert.deepEqual(changedArgs[0].changeType, 'refresh');
    assert.deepEqual(this.getDataItems(changedArgs[0].items), [1, 2]);
    assert.deepEqual(changedArgs[1].changeType, 'append');
    assert.deepEqual(this.getDataItems(changedArgs[1].items), [3, 4]);
    assert.deepEqual(changedArgs[2].changeType, 'append');
    assert.deepEqual(this.getDataItems(changedArgs[2].items), [5, 6]);
    assert.deepEqual(this.getDataItems(), [1, 2, 3, 4, 5, 6]);
    assert.ok(this.dataController.isLoaded());
});

// T103389
QUnit.test("load several pages when pageSize less then viewportSize and preload enabled", function(assert) {
    var changedArgs = [];

    this.options.loadingTimeout = 0;
    this.options.scrolling.preloadEnabled = true;
    this.setupDataSource({
        pageSize: 2
    });
    this.dataController.viewportSize(3);
    this.dataController.changed.add(function(e) {
        changedArgs.push(e);
    });
    // act
    this.clock.tick();

    // assert
    assert.equal(changedArgs.length, 4);
    assert.deepEqual(this.getDataItems(), [1, 2, 3, 4, 5, 6, 7, 8]);
    assert.ok(this.dataController.isLoaded());
});

// T120733
QUnit.test("reload pages after change viewport item index to far", function(assert) {
    var changedArgs = [],
        virtualItems = [];

    this.options.loadingTimeout = 0;
    this.setupDataSource({
        pageSize: 2
    });

    var dataController = this.dataController;


    this.clock.tick();
    dataController.setViewportItemIndex(7);
    this.clock.tick();
    dataController.changed.add(function(e) {
        changedArgs.push(e);
        virtualItems.push(dataController.virtualItemsCount());
    });

    // act
    dataController.reload(true);
    this.clock.callTimer(this.clock.firstTimerInRange());

    // assert
    assert.deepEqual(changedArgs, []);
    assert.deepEqual(this.getDataItems(), [7, 8, 9, 10]);
    assert.ok(dataController.isLoaded());

    // act
    this.clock.callTimer(this.clock.firstTimerInRange());

    // assert
    assert.equal(changedArgs.length, 2);
    assert.equal(changedArgs[0].changeType, 'refresh');
    assert.deepEqual(this.getDataItems(changedArgs[0].items), [7, 8]);
    assert.equal(changedArgs[1].changeType, 'append');
    assert.deepEqual(this.getDataItems(changedArgs[1].items), [9, 10]);
    assert.deepEqual(virtualItems, [{ begin: 6, end: 2 }, { begin: 6, end: 0 }]);
    assert.deepEqual(this.getDataItems(), [7, 8, 9, 10]);
    assert.ok(dataController.isLoaded());

});

QUnit.test("preload pages after change viewport item index", function(assert) {
    var changedArgs = [];

    this.options.scrolling.preloadEnabled = true;

    this.setupDataSource({
        pageSize: 3
    });

    var dataController = this.dataController;

    dataController.viewportSize(2);
    dataController.changed.add(function(e) {
        changedArgs.push(e);
    });

    // act
    dataController.setViewportItemIndex(3);

    // assert
    assert.equal(changedArgs.length, 1);
    assert.deepEqual(changedArgs[0].changeType, 'append');
    assert.deepEqual(this.getDataItems(changedArgs[0].items), [10]);
    assert.deepEqual(this.getDataItems(), TEN_NUMBERS);
    assert.ok(dataController.isLoaded());
});

// T444542
QUnit.test("Preload previous page after change viewport item index when preloadEnabled option is true", function(assert) {
    // arrange
    var changedArgs = [];

    this.options.scrolling.preloadEnabled = true;
    this.setupDataSource({
        pageSize: 1
    });

    var dataController = this.dataController;

    dataController.viewportSize(1);
    dataController.changed.add(function(e) {
        changedArgs.push(e);
    });

    // act
    dataController.setViewportItemIndex(4);

    // assert
    assert.equal(changedArgs.length, 4, "load count");
    assert.equal(changedArgs[0].changeType, "refresh", "load current page");
    assert.equal(changedArgs[1].changeType, "prepend", "load previous page");
    assert.equal(changedArgs[2].changeType, "append", "load next page");
    assert.equal(changedArgs[3].changeType, "append", "load next page");
    assert.deepEqual(this.getDataItems(), [4, 5, 6, 7], "items");
    assert.ok(dataController.isLoaded(), "data is loaded");
});

QUnit.test("update loading on reload", function(assert) {
    var finalized;

    this.options.loadingTimeout = 0;
    this.setupDataSource({
        pageSize: 3
    });

    var dataController = this.dataController;

    dataController.load().done(function() {
        var isLoadingByEvent;
        dataController.loadingChanged.add(function(isLoading) {
            isLoadingByEvent = isLoading;
            if(isLoading) {
                assert.ok(!dataController.isLoaded(), 'isLoaded on reload in loadingChanged event');
            }
        });

        // act
        dataController.reload(true);

        // assert
        assert.ok(!dataController.isLoaded());
        assert.ok(dataController.isLoading());
        assert.ok(isLoadingByEvent);
        finalized = true;
    });

    this.clock.tick();
    assert.ok(finalized);
});

// T152307
QUnit.test("update loading on reload when error occurred", function(assert) {
    var finalized;
    var loadResult;

    var clock = this.clock;

    this.options.loadingTimeout = 0;


    this.dataSource = new DataSource({
        load: function() {
            return loadResult || [];
        }
    });
    this.dataController.setDataSource(this.dataSource);

    var dataController = this.dataController;

    dataController.load().done(function() {
        var isLoadingByEvent;
        dataController.loadingChanged.add(function(isLoading) {
            isLoadingByEvent = isLoading;
            if(isLoading) {
                assert.ok(!dataController.isLoaded(), 'isLoaded on reload in loadingChanged event');
            }
        });

        var changedArgs = [];

        dataController.changed.add(function(e) {
            changedArgs.push(e);
        });

        loadResult = $.Deferred().reject('user error');

        // act
        dataController.reload(true);

        // assert
        assert.ok(!dataController.isLoaded(), 'isLoaded');
        assert.ok(dataController.isLoading(), 'isLoading');
        assert.ok(isLoadingByEvent, 'isLoading by event');

        clock.tick();

        assert.ok(!dataController.isLoaded(), 'isLoaded after error');
        assert.ok(!dataController.isLoading(), 'isLoading after error');
        assert.ok(!isLoadingByEvent, 'isLoading by event after error');

        assert.equal(changedArgs.length, 1);
        assert.equal(changedArgs[0].changeType, 'loadError');
        assert.equal(changedArgs[0].error.message, 'user error');

        finalized = true;
    });

    clock.tick();
    assert.ok(finalized);
});

// T103219
QUnit.test("loadingChanged must be before changed", function(assert) {
    // arrange
    var events = [];

    this.setupDataSource({
        asyncLoadEnabled: true,
        pageSize: 3
    });

    var dataController = this.dataController;


    dataController.load();
    this.clock.tick();

    dataController.loadingChanged.add(function() {
        events.push('loadingChanged');
    });

    dataController.changed.add(function() {
        events.push('changed');
    });

    // act
    dataController.reload(true);
    this.clock.tick();

    // assert
    assert.deepEqual(events, ['loadingChanged', 'loadingChanged', 'changed', 'changed']);
});

// B252337
QUnit.test("update loading when grouping", function(assert) {
    var array = $.map(TEN_NUMBERS, function(value) { return { value: value }; });

    this.setupDataSource({
        data: array,
        group: 'value',
        pageSize: 5
    });
    this.dataSource.load();

    var dataController = this.dataController;

    var isLoadingByEvent;
    dataController.loadingChanged.add(function(isLoading) {
        isLoadingByEvent = isLoading;
    });

    dataController.viewportSize(5);
    dataController.setViewportItemIndex(0);

    // act
    dataController.setViewportItemIndex(9);

    var items = [];
    $.each(TEN_NUMBERS, function(index, value) {
        items.push({ key: value, items: [{ value: value }] });
        items.push({ value: value });
    });

    // assert
    assert.deepEqual(this.getDataItems(), items);
    assert.equal(dataController.itemsCount(), 10);
    assert.ok(dataController.isLoaded());
    assert.ok(!dataController.isLoading(), 'loading completed');
    assert.ok(!isLoadingByEvent, 'loading completed');
});

// B252337
QUnit.test("update loading when dataSource length less then pageSize", function(assert) {
    this.setupDataSource({
        pageSize: 20
    });
    this.dataSource.load();

    var dataController = this.dataController;


    dataController.viewportSize(15);

    var isLoadingByEvent;
    dataController.loadingChanged.add(function(isLoading) {
        isLoadingByEvent = isLoading;
    });

    // act
    dataController.load();


    // assert
    assert.deepEqual(this.getDataItems(), TEN_NUMBERS);
    assert.equal(dataController.itemsCount(), 10);
    assert.ok(dataController.isLoaded());
    assert.ok(!dataController.isLoading(), 'loading completed');
    assert.ok(!isLoadingByEvent, 'loading completed');
});

// B254273
QUnit.test('Loading state when dataSource loading completed and itemsCount less than viewportSize', function(assert) {
    var array = $.map(TEN_NUMBERS, function(value) { return { value: value }; });

    this.setupDataSource({
        data: array,
        group: 'value'
    });

    var dataController = this.dataController;


    dataController.viewportSize(25);
    dataController.setViewportItemIndex(0);

    // act
    dataController.load();

    // assert
    assert.ok(!dataController.isLoading(), 'loading completed');
});

// B254146
QUnit.test("changeRowExpand on second page when virtual scrolling enabled", function(assert) {
    var array = $.map(TEN_NUMBERS, function(value) { return { value: value }; });

    this.setupDataSource({
        data: array,
        group: 'value',
        pageSize: 3
    });

    var dataController = this.dataController;


    dataController.viewportSize(3);

    // act
    dataController.setViewportItemIndex(0);

    dataController.setViewportItemIndex(4);

    dataController.changeRowExpand([4]);

    assert.equal(dataController.pageIndex(), 1, 'pageIndex'); // must be 1
    assert.deepEqual(dataController.items()[0].data, { collapsedItems: [], key: 4, items: null, count: 1 }, 'item 4 collapsed');
});

// B254113
QUnit.test("Start loading after changeRowExpand when virtual scrolling enabled", function(assert) {
    var array = $.map(TEN_NUMBERS, function(value) { return { value: value }; });
    var isLoading = false;

    this.options.loadingTimeout = 0;

    this.setupDataSource({
        data: array,
        group: 'value',
        pageSize: 3
    });

    var dataController = this.dataController;


    dataController.loadingChanged.add(function(state) {
        isLoading = state;
    });

    dataController.load();
    dataController.viewportSize(3);
    this.clock.tick();

    // assert
    assert.ok(!isLoading, 'not loading');

    // act
    dataController.setViewportItemIndex(0);

    dataController.changeRowExpand([0]);

    assert.ok(isLoading, 'loading started');
    this.clock.tick();
    assert.ok(!isLoading, 'loading ended');
});

// T122785
QUnit.test("not update pageSize on viewportSize", function(assert) {
    var changedArgs = [];

    this.setupDataSource({
        data: TEN_NUMBERS.concat(TEN_NUMBERS)
    });

    var dataController = this.dataController;


    dataController.changed.add(function(e) {
        changedArgs.push(e);
    });

    // act
    dataController.viewportSize(2);

    // assert
    assert.equal(changedArgs.length, 0);
    assert.deepEqual(this.getDataItems().length, 20);
    assert.equal(dataController.pageSize(), 20);
    assert.ok(dataController.isLoaded());
});


QUnit.module("Infinite scrolling", {
    beforeEach: function() {
        setupModule.apply(this);

        var i, array = [];

        for(i = 0; i < 50; i++) {
            array.push({
                id: i,
                value: 'value' + i.toString()
            });
        }

        var dataSource = createDataSource(array, { key: 'id' }, {
            pageSize: 20,
            paginate: true,
            requireTotalCount: false,
            scrolling: { mode: 'infinite' }
        });

        this.applyOptions({
            scrolling: { mode: 'infinite' },
            pager: { visible: 'auto' }
        });
        this.dataController.setDataSource(dataSource);
        this.dataController.viewportSize(10);
        dataSource.load();
        this.dataSource = dataSource;
    },
    afterEach: teardownModule
});

QUnit.test("setViewportItemIndex to begin current page not load next page", function(assert) {
    // act
    this.dataController.setViewportItemIndex(1);

    // assert
    assert.strictEqual(this.dataController.pageIndex(), 0);
    assert.strictEqual(this.dataController.hasKnownLastPage(), false);
    assert.strictEqual(this.dataController.items().length, 20);
});

QUnit.test("setViewportItemIndex to end current page load next page", function(assert) {
    // act
    this.dataController.setViewportItemIndex(10);

    // assert
    assert.strictEqual(this.dataController.pageIndex(), 1);
    assert.strictEqual(this.dataController.hasKnownLastPage(), false);
    assert.strictEqual(this.dataController.items().length, 40);
});

// T193217
QUnit.test("setViewportItemIndex to end current page several times load next page one time", function(assert) {
    var loadingCount = 0;
    this.dataController._dataSource.customizeStoreLoadOptions.add(function() {
        loadingCount++;
    });
    // act
    this.options.loadingTimeout = 0;
    this.dataController.setViewportItemIndex(10);
    this.dataController.setViewportItemIndex(10);

    this.clock.tick();

    // assert
    assert.strictEqual(loadingCount, 1);
    assert.strictEqual(this.dataController.pageIndex(), 1);
    assert.strictEqual(this.dataController.hasKnownLastPage(), false);
    assert.strictEqual(this.dataController.items().length, 40);
});


QUnit.test("second setViewportItemIndex to first page not load next page", function(assert) {
    this.dataController.setViewportItemIndex(1);
    // act
    this.dataController.setViewportItemIndex(19);

    // assert
    assert.strictEqual(this.dataController.pageIndex(), 1);
    assert.strictEqual(this.dataController.hasKnownLastPage(), false);
    assert.strictEqual(this.dataController.items().length, 40);
});

QUnit.test("setViewportItemIndex to current page not load next page when hasKnownLastPage", function(assert) {
    // act
    this.dataController.setViewportItemIndex(1);
    this.dataController.setViewportItemIndex(21);
    this.dataController.setViewportItemIndex(41);

    // assert
    assert.strictEqual(this.dataController.pageIndex(), 2);
    assert.strictEqual(this.dataController.hasKnownLastPage(), true);
    assert.strictEqual(this.dataController.items().length, 50);
});

QUnit.test("reset pageIndex on refresh when appendMode", function(assert) {
    this.dataSource.load();
    this.dataController.pageIndex(1);

    // act
    this.dataController.refresh();

    assert.strictEqual(this.dataController.pageIndex(), 0);
});

// T180315
QUnit.test("setViewportItemIndex before data loaded", function(assert) {
    this.applyOptions({
        loadingTimeout: 0
    });

    this.dataController.reload(true);

    // act
    this.dataController.setViewportItemIndex(1);
    this.clock.tick();

    // assert
    assert.strictEqual(this.dataController.pageIndex(), 0);
    assert.strictEqual(this.dataController.hasKnownLastPage(), false);
    assert.strictEqual(this.dataController.items().length, 20);
});

// T103389
QUnit.test("load several pages when pageSize less then viewportSize", function(assert) {
    var changedArgs = [];

    this.dataController.changed.add(function(e) {
        changedArgs.push(e);
    });

    // act
    this.dataController.pageSize(4);

    // assert
    assert.deepEqual(this.dataController.items().length, 12);
    assert.equal(changedArgs.length, 3);
    assert.deepEqual(changedArgs[0].changeType, 'refresh');
    assert.deepEqual(changedArgs[0].items[0].key, 0);
    assert.deepEqual(changedArgs[1].changeType, 'append');
    assert.deepEqual(changedArgs[1].items[0].key, 4);
    assert.deepEqual(changedArgs[2].changeType, 'append');
    assert.deepEqual(changedArgs[2].items[0].key, 8);
    assert.ok(this.dataController.isLoaded());
});

// T103389
QUnit.test("load several pages when pageSize less then viewportSize and preload enabled", function(assert) {
    var changedArgs = [];

    this.options.scrolling.preloadEnabled = true;
    this.dataController.changed.add(function(e) {
        changedArgs.push(e);
    });

    // act
    this.dataController.pageSize(4);

    // assert
    assert.deepEqual(this.dataController.items().length, 16);
    assert.equal(changedArgs.length, 4);
    assert.deepEqual(changedArgs[0].changeType, 'refresh');
    assert.deepEqual(changedArgs[0].items[0].key, 0);
    assert.deepEqual(changedArgs[1].changeType, 'append');
    assert.deepEqual(changedArgs[1].items[0].key, 4);
    assert.deepEqual(changedArgs[2].changeType, 'append');
    assert.deepEqual(changedArgs[2].items[0].key, 8);
    assert.deepEqual(changedArgs[3].changeType, 'append');
    assert.deepEqual(changedArgs[3].items[0].key, 12);
    assert.ok(this.dataController.isLoaded());
});

// T377458
QUnit.test("last page does not be loaded several times then totalCount % pageSize === 0", function(assert) {
    var changedArgs = [];

    this.dataController.changed.add(function(e) {
        changedArgs.push(e);
    });

    this.dataController.viewportSize(30);
    this.dataController.pageSize(25);

    // act
    this.dataController.setViewportItemIndex(40);

    // assert
    assert.deepEqual(this.dataController.items().length, 50);
    assert.equal(changedArgs.length, 3);
    assert.deepEqual(changedArgs[0].changeType, 'refresh');
    assert.deepEqual(changedArgs[0].items[0].key, 0);
    assert.deepEqual(changedArgs[1].changeType, 'append');
    assert.deepEqual(changedArgs[1].items[0].key, 25);
    assert.deepEqual(changedArgs[2].changeType, 'append');
    assert.deepEqual(changedArgs[2].items, []);
    assert.ok(this.dataController.isLoaded());
});

// T507750
QUnit.test("last page does not be loaded several times then totalCount equals pageSize", function(assert) {
    var changedArgs = [];

    this.dataController.changed.add(function(e) {
        changedArgs.push(e);
    });

    this.dataController.viewportSize(20);
    this.dataController.pageSize(50);

    // act
    this.dataController.setViewportItemIndex(30);

    // assert
    assert.deepEqual(this.dataController.items().length, 50);
    assert.equal(changedArgs.length, 2);
    assert.deepEqual(changedArgs[0].changeType, 'refresh');
    assert.deepEqual(changedArgs[0].items[0].key, 0);
    assert.deepEqual(changedArgs[1].changeType, 'append');
    assert.deepEqual(changedArgs[1].items, []);
    assert.ok(this.dataController.isLoaded());
});

QUnit.module("Infinite scrolling (ScrollingDataSource)", {
    beforeEach: function() {

        this.options = {
            scrolling: { mode: 'infinite' },
            grouping: { autoExpandAll: true }
        };
        setupModule.apply(this);

        this.setupDataSource = function(options) {
            this.dataSource = createDataSource(options.data || TEN_NUMBERS, {}, $.extend({ paginate: true, requireTotalCount: false }, options));
            this.dataController.setDataSource(this.dataSource);
            this.dataSource.load();
        };

        this.getDataItems = function(items) {
            var dataItems = [];

            items = items || this.dataController.items();

            $.each(items, function() {
                dataItems.push(this.data);
            });
            return dataItems;
        };

        this.clock = sinon.useFakeTimers();
    }, afterEach: function() {
        teardownModule.call(this);
        this.clock.restore();
    }
});

QUnit.test("not update pageSize on viewportSize", function(assert) {
    var changedCallsCount = 0;

    this.setupDataSource({
        data: TEN_NUMBERS.concat(TEN_NUMBERS)
    });

    var dataController = this.dataController;

    dataController.changed.add(function(e) {
        changedCallsCount++;
    });

    // act
    dataController.viewportSize(2);

    // assert
    assert.equal(changedCallsCount, 0);
    assert.equal(this.getDataItems().length, 20);
    assert.equal(dataController.pageSize(), 20);
    assert.ok(dataController.isLoaded());
});

QUnit.test("change pageIndex", function(assert) {
    var changedCallsCount = 0,
        changedArgs;

    this.setupDataSource({
        pageSize: 3
    });

    var dataController = this.dataController;

    // act
    dataController.changed.add(function(e) {
        changedCallsCount++;
        changedArgs = e;
    });

    dataController.pageIndex(1);

    // assert
    assert.equal(changedCallsCount, 1);
    assert.deepEqual(changedArgs.changeType, 'append');
    assert.deepEqual(this.getDataItems(changedArgs.items), [4, 5, 6]);
    assert.deepEqual(this.getDataItems(), [1, 2, 3, 4, 5, 6]);
    assert.equal(dataController.pageIndex(), 1);
    assert.equal(dataController.pageSize(), 3);
    assert.ok(dataController.isLoaded());
});

// B254676
QUnit.test("Load next page and return to previous", function(assert) {
    // arrange
    this.setupDataSource({
        asyncLoadEnabled: true,
        pageSize: 3
    });

    this.clock.tick();

    var dataController = this.dataController;

    // act
    dataController.pageIndex(1);
    dataController.load();

    dataController.pageIndex(0);
    dataController.load();

    this.clock.tick();

    // assert
    assert.equal(dataController.pageIndex(), 0, 'page index');
    assert.deepEqual(this.getDataItems(), [1, 2, 3, 4, 5, 6], 'items');
});

// B252339
QUnit.test("reset pageIndex on reload", function(assert) {
    var changedCallsCount = 0,
        changedArgs;

    this.setupDataSource({
        pageSize: 3
    });

    var dataController = this.dataController;


    dataController.pageIndex(1);
    dataController.changed.add(function(e) {
        changedCallsCount++;
        changedArgs = e;
    });

    // act
    dataController.reload(true);

    // assert
    assert.equal(changedCallsCount, 1);
    assert.strictEqual(changedArgs.changeType, 'refresh');
    assert.deepEqual(this.getDataItems(changedArgs.items), [1, 2, 3]);
    assert.deepEqual(this.getDataItems(), [1, 2, 3]);
    assert.equal(dataController.pageIndex(), 0, 'pageIndex reset to 0');
    assert.equal(dataController.pageSize(), 3);
    assert.ok(dataController.isLoaded());
});

QUnit.module("Filtering", {
    beforeEach: function() {
        setupModule.apply(this);

        this.applyOptions({
            searchPanel: {
                text: ""
            }
        });

        var originalOption = this.option;

        this.option = function(options, value) {
            var result = originalOption.apply(this, arguments);

            if(options === "searchPanel.text" && typeUtils.isDefined(value)) {
                this.dataController.optionChanged({ fullName: options });
            }

            return result;
        };

        this.setupFilterableData = function() {
            this.dataSource = createDataSource([
                { name: 'Alex', age: 15, birthDate: new Date(1999, 2, 5), state: 0, processed: false, category: 0, categoryName: "First Category" },
                { name: 'Boris', age: 21, birthDate: new Date(1993, 5, 2), state: 0, processed: false, category: 1, categoryName: "Second Category" },
                { name: 'Dan', age: 19, birthDate: new Date(1996, 1, 20), state: 1, processed: true, category: 2, categoryName: "Third Category" }
            ]);
            this.applyOptions({
                columns: ['name', 'age', 'birthDate',
                    {
                        calculateCellValue: function(data) {
                            return data.name + ' ' + data.age;
                        },
                        calculateFilterExpression: function(text, operation) {
                            return [['name', operation || 'contains', text], 'or', ['age', operation || 'contains', text]];
                        }
                    },
                    {
                        dataField: 'state', lookup: {
                            dataSource: [
                                { id: 0, state: 'Accept' },
                                { id: 1, state: 'Reject' }
                            ],
                            displayExpr: 'state',
                            valueExpr: 'id'
                        }
                    }, { dataField: 'processed' }, {
                        dataField: 'category', calculateDisplayValue: "categoryName", lookup: {
                            dataSource: [
                                { id: 0, name: "First Category" },
                                { id: 1, name: "Second Category" },
                                { id: 2, name: "Third Category" }
                            ],
                            displayExpr: 'name',
                            valueExpr: 'id'
                        }
                    }]
            });
            this.dataController.setDataSource(this.dataSource);
            this.dataSource.load();
        };
    },
    afterEach: teardownModule
});

QUnit.test("dataSource filter", function(assert) {
    this.dataSource = createDataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 }
    ], {}, { filter: ['name', 'Dan'] });

    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();

    // assert
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Dan');
});

// B233497
QUnit.test("dataSource filter option on date field defined as string", function(assert) {
    this.applyOptions({
        columns: ['name', { dataField: 'birthDate', dataType: 'date' }],
        dataSource: {
            asyncLoadEnabled: false,
            store: [
                { name: 'Alex', birthDate: '1987/5/5' },
                { name: 'Dan', birthDate: '1985/3/21' }
            ],
            filter: ['birthDate', new Date(1985, 2, 21)]
        }
    });

    // act
    this.dataController.optionChanged({ name: "dataSource" });

    // assert
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Dan');
    // T320550
    assert.deepEqual(this.filter(), ['birthDate', new Date(1985, 2, 21)]);
});

// B233497
QUnit.test("dataSource filter operation on date field defined as string", function(assert) {
    this.dataSource = createDataSource([
        { name: 'Alex', birthDate: '1987/5/5' },
        { name: 'Dan', birthDate: '1985/3/21' }
    ]);

    this.applyOptions({
        columns: ['name', { dataField: 'birthDate', dataType: 'date' }]
    });


    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();

    // act
    this.dataController.filter(['birthDate', new Date(1985, 2, 21)]);

    // assert
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Dan');
});

// T253839
QUnit.test("dataSource filter option on date field defined as string and CustomStore is used with remoteOperations false", function(assert) {
    this.applyOptions({
        columns: ['name', { dataField: 'birthDate', dataType: 'date' }],
        remoteOperations: false,
        dataSource: {
            asyncLoadEnabled: false,
            load: function() {
                return [
                    { name: 'Alex', birthDate: '1987/5/5' },
                    { name: 'Dan', birthDate: '1985/3/21' }
                ];
            },
            filter: ['birthDate', new Date(1985, 2, 21)]
        }
    });

    // act
    this.dataController.optionChanged({ name: "dataSource" });

    // assert
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Dan');
});

QUnit.test("grouping on date field defined as string", function(assert) {
    this.applyOptions({
        columns: ['name', { dataField: 'birthDate', dataType: 'date', groupIndex: 0 }],
        dataSource: {
            asyncLoadEnabled: false,
            store: [
                { name: 'Alex', birthDate: '1987/5/5' },
                { name: 'Dan', birthDate: '1985/3/21' }
            ]
        }
    });

    // act
    this.dataController.optionChanged({ name: "dataSource" });

    // assert
    assert.equal(this.dataController.items().length, 2);
    assert.deepEqual(this.dataController.items()[0].data.key, new Date('1985/3/21'));
    assert.deepEqual(this.dataController.items()[1].data.key, new Date('1987/5/5'));
});

QUnit.test("grouping on date field defined as string assigned in customizeColumns", function(assert) {
    this.applyOptions({
        customizeColumns: function(columns) {
            columns[1].groupIndex = 0;
            columns[1].dataType = "date";

        },
        dataSource: {
            asyncLoadEnabled: false,
            store: [
                { name: 'Alex', birthDate: '1987/5/5' },
                { name: 'Dan', birthDate: '1985/3/21' }
            ]
        }
    });

    // act
    this.dataController.optionChanged({ name: "dataSource" });

    // assert
    assert.equal(this.dataController.items().length, 2);
    assert.deepEqual(this.dataController.items()[0].data.key, new Date('1985/3/21'));
    assert.deepEqual(this.dataController.items()[1].data.key, new Date('1987/5/5'));
});

QUnit.test("change filter as array argument", function(assert) {
    // arrange
    var countCallPageChanged = 0;

    this.dataSource = createDataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 }
    ], {}, { filter: ['name', 'Dan'] });
    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();

    this.dataController.pageChanged.add(function() {
        countCallPageChanged++;
    });

    // act
    this.dataController.filter(['name', 'startswith', 'A']);

    // assert
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Alex');

    // T262949
    assert.equal(countCallPageChanged, 1, "count call pageChanged");
});

// T413302
QUnit.test("filter as null - no apply when there is no dataSource filter", function(assert) {
    // arrange
    var countCallPageChanged = 0;

    this.dataSource = createDataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 }
    ]);
    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();

    this.dataController.pageChanged.add(function() {
        countCallPageChanged++;
    });

    // act
    this.dataController.filter(null);

    // assert
    assert.equal(this.dataController.items().length, 2, "count item");
    assert.equal(countCallPageChanged, 0, "not call pageChanged");
});

// T413302
QUnit.test("filter as arguments - no apply when the filter isn't changed", function(assert) {
    // arrange
    var countCallPageChanged = 0;

    this.dataSource = createDataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 }
    ], {}, { filter: ['name', 'Dan'] });
    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();

    this.dataController.pageChanged.add(function() {
        countCallPageChanged++;
    });

    // act
    this.dataController.filter(['name', 'Dan']);

    // assert
    assert.equal(this.dataController.items().length, 1, "count item");
    assert.equal(this.dataController.items()[0].data.name, 'Dan');
    assert.equal(countCallPageChanged, 0, "not call pageChanged");
});

QUnit.test("change filter as arguments", function(assert) {
    this.dataSource = createDataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 }
    ], {}, { filter: ['name', 'Dan'] });
    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();


    // act
    this.dataController.filter('name', 'startswith', 'A');

    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Alex');
});

QUnit.test("change filter as function", function(assert) {
    var loadingCount = 0;
    this.dataSource = createDataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 }
    ], { onLoading: function() { loadingCount++; } }, { filter: ['name', 'Dan'] });
    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();


    // act
    this.dataController.filter(function(data) {
        return data.age > 15;
    });

    // assert
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Dan');

    // act
    this.dataController.filter(function(data) {
        return data.age === 15;
    });

    // assert
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Alex');
    assert.equal(loadingCount, 1, 'one loading');
});

QUnit.test("get filter and combinedFilter", function(assert) {
    this.dataSource = new DataSource({
        load: function() {
            return [];
        },
        filter: ['name', '=', 'Alex']
    });

    this.applyOptions({
        remoteOperations: { filtering: true, sorting: true, paging: true },
        columns: [{ dataField: 'name', dataType: 'string', filterValue: 'A' }, { dataField: 'age', dataType: 'number', filterValue: 15 }],
        searchPanel: {
            text: 'Al'
        }
    });

    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();


    // act
    assert.deepEqual(this.filter(), ['name', '=', 'Alex']);
    assert.deepEqual(this.getCombinedFilter(), [
        [
            [["name", "contains", "A"], "and", ["age", "=", 15]],
            "and",
            ["name", "contains", "Al"]
        ],
        "and",
        ['name', '=', 'Alex']
    ]);
});


QUnit.test("get combinedFilter with remote filtering", function(assert) {
    this.dataSource = new DataSource({
        load: function() {
            return [{ name: "Alex", age: "20" }];
        }
    });

    this.applyOptions({
        remoteOperations: { filtering: true },
        columns: [{ dataField: 'age', dataType: 'number', filterValue: 15 }],
    });

    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();

    assert.deepEqual(this.getCombinedFilter(true), ["age", "=", 15]);
});

QUnit.test("get combinedFilter for search when allowSearch false", function(assert) {
    this.dataSource = new DataSource({
        load: function() {
            return [];
        },
        filter: ['name', '=', 'Alex']
    });

    this.applyOptions({
        remoteOperations: { filtering: true, sorting: true, paging: true },
        columns: [{ dataField: 'name', dataType: 'string', allowSearch: false }, { dataField: 'age', dataType: 'string', visible: false }],
        searchPanel: {
            text: 'Al'
        }
    });

    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();


    // act
    assert.deepEqual(this.filter(), ['name', '=', 'Alex']);
    assert.deepEqual(this.getCombinedFilter(), [
        ["age", "contains", "Al"],
        "and",
        ['name', '=', 'Alex']
    ]);
});

QUnit.test("get combinedFilter for search when searchVisibleColumnsOnly true and column is not visible", function(assert) {
    this.dataSource = new DataSource({
        load: function() {
            return [];
        },
        filter: ['name', '=', 'Alex']
    });

    this.applyOptions({
        remoteOperations: { filtering: true, sorting: true, paging: true },
        columns: [{ dataField: 'name', dataType: 'string' }, { dataField: 'age', dataType: 'string' }],
        searchPanel: {
            text: 'Al',
            searchVisibleColumnsOnly: true
        }
    });

    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();


    // assert
    assert.deepEqual(this.filter(), ['name', '=', 'Alex']);
    assert.deepEqual(this.getCombinedFilter(), [
        [["name", "contains", "Al"], "or", ["age", "contains", "Al"]],
        "and",
        ['name', '=', 'Alex']
    ]);

    // act
    this.columnOption("name", "visible", false);

    // assert
    assert.deepEqual(this.getCombinedFilter(), [
        ["age", "contains", "Al"],
        "and",
        ['name', '=', 'Alex']
    ]);
});

QUnit.test("get combinedFilter for search when allowFiltering false", function(assert) {
    this.dataSource = new DataSource({
        load: function() {
            return [];
        },
        filter: ['name', '=', 'Alex']
    });

    this.applyOptions({
        remoteOperations: { filtering: true, sorting: true, paging: true },
        columns: [{ dataField: 'name', dataType: 'string', allowFiltering: false }, { dataField: 'age', dataType: 'string' }],
        searchPanel: {
            text: 'Al'
        }
    });

    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();


    // act
    assert.deepEqual(this.filter(), ['name', '=', 'Alex']);
    assert.deepEqual(this.getCombinedFilter(), [
        ["age", "contains", "Al"],
        "and",
        ['name', '=', 'Alex']
    ]);
});

QUnit.test("get combinedFilter for search when allowFiltering false and allowSearch true", function(assert) {
    this.dataSource = new DataSource({
        load: function() {
            return [];
        },
        filter: ['name', '=', 'Alex']
    });

    this.applyOptions({
        remoteOperations: { filtering: true, sorting: true, paging: true },
        columns: [{ dataField: 'name', dataType: 'string', allowFiltering: false, allowSearch: true }, { dataField: 'age', dataType: 'string' }],
        searchPanel: {
            text: 'Al'
        }
    });

    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();


    // act
    assert.deepEqual(this.filter(), ['name', '=', 'Alex']);
    assert.deepEqual(this.getCombinedFilter(), [
        [
            ["name", "contains", "Al"],
            "or",
            ["age", "contains", "Al"]
        ],
        "and",
        ['name', '=', 'Alex']
    ]);
});

// T373345
QUnit.test("get combinedFilter when filterRow between operation and headerFilter is used", function(assert) {
    this.dataSource = new DataSource({
        load: function() {
            return [];
        }
    });

    this.applyOptions({
        remoteOperations: true,
        columns: [{ dataField: 'age', dataType: 'number', filterValue: [15, 20], selectedFilterOperation: "between", filterValues: [17] }]
    });

    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();


    // act
    assert.deepEqual(this.getCombinedFilter(), [
        [["age", ">=", 15], "and", ["age", "<=", 20]],
        "and",
        ["age", "=", 17]
    ]);
});

// T203533
QUnit.test("get combinedFilter with filter on only one column", function(assert) {
    // arrange
    this.dataSource = new DataSource({
        load: function() {
            return [];
        },
        filter: ['name', '=', 'Alex']
    });

    this.applyOptions({
        remoteOperations: { filtering: true, sorting: true, paging: true },
        columns: [{ dataField: 'name', dataType: 'string' }, { dataField: 'age', dataType: 'number', filterValue: 15 }]
    });

    // act
    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();

    // assert
    assert.deepEqual(this.filter(), ['name', '=', 'Alex']);
    assert.deepEqual(this.getCombinedFilter(), [
        ["age", "=", 15],
        "and",
        ['name', '=', 'Alex']
    ]);
});

QUnit.test("get combinedFilter with argument", function(assert) {
    // arrange
    var filter;

    this.dataSource = new DataSource({
        load: function() {
            return [];
        },
        filter: ["age", "=", 15]
    });

    this.applyOptions({
        remoteOperations: false,
        columns: [{ dataField: "name", dataType: "string", filterValue: "Alex" }, { dataField: "age", dataType: "number" }]
    });

    // act
    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();

    // assert
    filter = this.getCombinedFilter();
    assert.ok($.isArray(filter[0]), "first argument is filter expression");
    assert.strictEqual(filter[1], "and", "second argument is operation 'and'");
    assert.ok($.isArray(filter[2]), "third argument is filter expression");
    assert.ok($.isFunction(filter[0][0]), "filter expression selector is function");

    filter = this.getCombinedFilter(true);
    assert.ok($.isArray(filter[0]), "first argument is filter expression");
    assert.strictEqual(filter[1], "and", "second argument is operation 'and'");
    assert.ok($.isArray(filter[2]), "third argument is filter expression");
    assert.equal(filter.length, 3, "filter expression + 'and' + 'filter expression'");
    assert.ok(!$.isFunction(filter[2][0]), "filter expression selector isn't function");
    assert.strictEqual(filter[0][0], "name", "value of the selector");
});

QUnit.test("get combinedFilter with argument for date value with ISO8601 parsing", function(assert) {
    var defaultForceIsoDateParsing = config().forceIsoDateParsing;
    config().forceIsoDateParsing = true;

    try {
        // arrange
        var filter;

        this.dataSource = new DataSource({
            load: function() {
                return [{ date: "2016-03-02T10:59:00" }];
            },
            filter: ["date", "<", new Date(2017, 0, 1)]
        });

        this.applyOptions({
            remoteOperations: false,
            columns: [{ dataField: "date", dataType: "date", selectedFilterOperation: ">=", filterValue: new Date(2016, 0, 1) }]
        });

        // act
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        // assert
        filter = this.getCombinedFilter(true);
        assert.deepEqual(filter, [["date", ">=", "2016-01-01T00:00:00"], "and", ["date", "<", "2017-01-01T00:00:00"]], "filter with serialized dates");
    } finally {
        config().forceIsoDateParsing = defaultForceIsoDateParsing;
    }
});

QUnit.test("get combinedFilter with argument for date value without ISO8601 parsing", function(assert) {
    var defaultForceIsoDateParsing = config().forceIsoDateParsing;
    config().forceIsoDateParsing = false;

    try {
        // arrange
        var filter;

        this.dataSource = new DataSource({
            load: function() {
                return [{ date: "2016-03-02T10:59:00" }];
            },
            filter: ["date", "<", new Date(2017, 0, 1)]
        });

        this.applyOptions({
            remoteOperations: false,
            columns: [{ dataField: "date", dataType: "date", selectedFilterOperation: ">=", filterValue: new Date(2016, 0, 1) }]
        });

        // act
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        // assert
        filter = this.getCombinedFilter(true);
        assert.deepEqual(filter, [["date", ">=", new Date(2016, 0, 1)], "and", ["date", "<", new Date(2017, 0, 1)]], "filter with serialized dates");
    } finally {
        config().forceIsoDateParsing = defaultForceIsoDateParsing;
    }
});

// T353244
QUnit.test("changing filterType without filterValues do not rise changed event", function(assert) {
    // arrange
    var that = this,
        countCallChanged = 0;

    that.options.loadingTimeout = 0;
    that.dataSource = createDataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 },
        { name: 'Tom', age: 12 },
        { name: 'Bob', age: 19 },
        { name: 'Bobbi', age: 19 }
    ]);

    that.applyOptions({
        columns: [{ dataField: "name" }, { dataField: "age", filterValue: 19 }]
    });
    that.dataController.setDataSource(that.dataSource);
    that.dataSource.load();
    that.clock.tick();

    // arrange
    that.dataController.changed.add(function() {
        countCallChanged++;
    });

    // act
    that.columnOption("name", "filterType", "exclude");
    that.clock.tick();

    // assert
    assert.strictEqual(that.columnsController.getColumns()[0].filterType, "exclude", "filterType is changed");
    assert.strictEqual(countCallChanged, 0, "changed is not raised");
});

// T238430
QUnit.test("clearFilter without argument", function(assert) {
    // arrange
    var that = this,
        items,
        columns,
        countCallChanged = 0;

    that.options.loadingTimeout = 0;
    that.dataSource = createDataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 },
        { name: 'Tom', age: 12 },
        { name: 'Bob', age: 19 },
        { name: 'Bobbi', age: 19 }
    ], {}, { filter: [['name', 'Alex'], "or", ['name', 'Dan'], "or", ['name', 'Tom'], "or", ['name', 'Bob']] });

    that.applyOptions({
        columns: [{ dataField: "name", filterValues: ["Alex", "Dan", "Bob"] }, { dataField: "age", filterValue: 19 }]
    });
    that.dataController.setDataSource(that.dataSource);
    that.dataSource.load();
    that.dataController.searchByText("Bob");
    that.clock.tick();

    // assert
    items = that.dataController.items();
    columns = that.columnsController.getColumns();
    assert.equal(items.length, 1, "count items");
    assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, "data item");
    assert.strictEqual(that.option("searchPanel.text"), "Bob", "search text");
    assert.ok(Array.isArray(that.dataController.filter()), "filter dataSource");
    assert.equal(columns.length, 2, "count columns");
    assert.deepEqual(columns[0].filterValues, ["Alex", "Dan", "Bob"], "filter values of the first column");
    assert.deepEqual(columns[1].filterValue, 19, "filter values", "filter value of the second column");

    // arrange
    that.dataController.changed.add(function() {
        countCallChanged++;
    });

    // act
    that.dataController.clearFilter();
    that.clock.tick();

    // assert
    columns = that.columnsController.getColumns();
    assert.equal(countCallChanged, 1, "count call changed");
    assert.equal(that.dataController.items().length, 5, "count items");
    assert.strictEqual(that.option("searchPanel.text"), "", "search text");
    assert.deepEqual(that.dataController.filter(), null, "filter dataSource");
    assert.equal(columns.length, 2, "count columns");
    assert.deepEqual(columns[0].filterValues, undefined, "filter values of the first column");
    assert.deepEqual(columns[1].filterValue, undefined, "filter value of the second column");
});

// T238430
QUnit.test("clearFilter for dataSource", function(assert) {
    // arrange
    var that = this,
        items,
        columns;

    that.dataSource = createDataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 },
        { name: 'Tom', age: 12 },
        { name: 'Bob', age: 19 },
        { name: 'Bobbi', age: 19 }
    ], {}, { filter: [['name', 'Alex'], "or", ['name', 'Dan'], "or", ['name', 'Tom'], "or", ['name', 'Bob']] });

    that.applyOptions({
        columns: [{ dataField: "name", filterValues: ["Alex", "Dan", "Bob", "Bobbi"] }, { dataField: "age", filterValue: 19 }]
    });
    that.dataController.setDataSource(that.dataSource);
    that.dataSource.load();
    that.dataController.searchByText("Bob");

    // assert
    items = that.dataController.items();
    columns = that.columnsController.getColumns();
    assert.equal(items.length, 1, "count items");
    assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, "data item");
    assert.strictEqual(that.option("searchPanel.text"), "Bob", "search text");
    assert.ok(Array.isArray(that.dataController.filter()), "filter dataSource");
    assert.equal(columns.length, 2, "count columns");
    assert.deepEqual(columns[0].filterValues, ["Alex", "Dan", "Bob", "Bobbi"], "filter values of the first column");
    assert.deepEqual(columns[1].filterValue, 19, "filter values", "filter value of the second column");

    // act
    that.dataController.clearFilter("dataSource");

    // assert
    items = that.dataController.items();
    columns = that.columnsController.getColumns();
    assert.equal(items.length, 2, "count items");
    assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, "data of the first item");
    assert.deepEqual(items[1].data, { name: 'Bobbi', age: 19 }, "data of the second item");
    assert.strictEqual(that.option("searchPanel.text"), "Bob", "search text");
    assert.deepEqual(that.dataController.filter(), null, "filter dataSource");
    assert.equal(columns.length, 2, "count columns");
    assert.deepEqual(columns[0].filterValues, ["Alex", "Dan", "Bob", "Bobbi"], "filter values of the first column");
    assert.deepEqual(columns[1].filterValue, 19, "filter values", "filter value of the second column");
});

// T238430
QUnit.test("clearFilter for search", function(assert) {
    // arrange
    var that = this,
        items,
        columns;

    that.dataSource = createDataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 },
        { name: 'Tom', age: 12 },
        { name: 'Bob', age: 19 },
        { name: 'Bobbi', age: 19 }
    ], {}, { filter: [['name', 'Alex'], "or", ['name', 'Dan'], "or", ['name', 'Tom'], "or", ['name', 'Bob']] });

    that.applyOptions({
        columns: [{ dataField: "name", filterValues: ["Alex", "Dan", "Bob"] }, { dataField: "age", filterValue: 19 }]
    });
    that.dataController.setDataSource(that.dataSource);
    that.dataSource.load();
    that.dataController.searchByText("Bob");

    // assert
    items = that.dataController.items();
    columns = that.columnsController.getColumns();
    assert.equal(items.length, 1, "count items");
    assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, "data item");
    assert.strictEqual(that.option("searchPanel.text"), "Bob", "search text");
    assert.ok(Array.isArray(that.dataController.filter()), "filter dataSource");
    assert.equal(columns.length, 2, "count columns");
    assert.deepEqual(columns[0].filterValues, ["Alex", "Dan", "Bob"], "filter values of the first column");
    assert.deepEqual(columns[1].filterValue, 19, "filter values", "filter value of the second column");

    // act
    that.dataController.clearFilter("search");

    // assert
    items = that.dataController.items();
    columns = that.columnsController.getColumns();
    assert.equal(items.length, 2, "count items");
    assert.deepEqual(items[0].data, { name: 'Dan', age: 19 }, "data of the first item");
    assert.deepEqual(items[1].data, { name: 'Bob', age: 19 }, "data of the second item");
    assert.strictEqual(that.option("searchPanel.text"), "", "search text");
    assert.ok(Array.isArray(that.dataController.filter()), "filter dataSource");
    assert.equal(columns.length, 2, "count columns");
    assert.deepEqual(columns[0].filterValues, ["Alex", "Dan", "Bob"], "filter values of the first column");
    assert.deepEqual(columns[1].filterValue, 19, "filter values", "filter value of the second column");
});

// T238430
QUnit.test("clearFilter for filter row", function(assert) {
    // arrange
    var that = this,
        items,
        columns;

    that.dataSource = createDataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 },
        { name: 'Tom', age: 12 },
        { name: 'Bob', age: 19 },
        { name: 'Bobbi', age: 19 }
    ], {}, { filter: [['name', 'Alex'], "or", ['name', 'Dan'], "or", ['name', 'Tom'], "or", ['name', 'Bob']] });

    that.applyOptions({
        columns: [{ dataField: "name", filterValues: ["Alex", "Dan", "Bob"] }, { dataField: "age", filterValue: 19 }]
    });
    that.dataController.setDataSource(that.dataSource);
    that.dataSource.load();
    that.dataController.searchByText("Bob");

    // assert
    items = that.dataController.items();
    columns = that.columnsController.getColumns();
    assert.equal(items.length, 1, "count items");
    assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, "data item");
    assert.strictEqual(that.option("searchPanel.text"), "Bob", "search text");
    assert.ok(Array.isArray(that.dataController.filter()), "filter dataSource");
    assert.equal(columns.length, 2, "count columns");
    assert.deepEqual(columns[0].filterValues, ["Alex", "Dan", "Bob"], "filter values of the first column");
    assert.deepEqual(columns[1].filterValue, 19, "filter values", "filter value of the second column");

    // act
    that.dataController.clearFilter("row");

    // assert
    items = that.dataController.items();
    columns = that.columnsController.getColumns();
    assert.equal(items.length, 1, "count items");
    assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, "data of the second item");
    assert.strictEqual(that.option("searchPanel.text"), "Bob", "search text");
    assert.ok(Array.isArray(that.dataController.filter()), "filter dataSource");
    assert.equal(columns.length, 2, "count columns");
    assert.deepEqual(columns[0].filterValues, ["Alex", "Dan", "Bob"], "filter values of the first column");
    assert.deepEqual(columns[1].filterValue, undefined, "filter value of the second column");
});

// T238430
QUnit.test("clearFilter for header filter", function(assert) {
    // arrange
    var that = this,
        items,
        columns;

    that.dataSource = createDataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 },
        { name: 'Tom', age: 12 },
        { name: 'Bob', age: 19 },
        { name: 'Bobbi', age: 19 }
    ], {}, { filter: [['name', 'Alex'], "or", ['name', 'Dan'], "or", ['name', 'Tom'], "or", ['name', 'Bob']] });

    that.applyOptions({
        columns: [{ dataField: "name", filterValues: ["Alex", "Dan", "Bob"] }, { dataField: "age", filterValue: 19 }]
    });
    that.dataController.setDataSource(that.dataSource);
    that.dataSource.load();
    that.dataController.searchByText("Bob");

    // assert
    items = that.dataController.items();
    columns = that.columnsController.getColumns();
    assert.equal(items.length, 1, "count items");
    assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, "data item");
    assert.strictEqual(that.option("searchPanel.text"), "Bob", "search text");
    assert.ok(Array.isArray(that.dataController.filter()), "filter dataSource");
    assert.equal(columns.length, 2, "count columns");
    assert.deepEqual(columns[0].filterValues, ["Alex", "Dan", "Bob"], "filter values of the first column");
    assert.deepEqual(columns[1].filterValue, 19, "filter values", "filter value of the second column");

    // act
    that.dataController.clearFilter("header");

    // assert
    items = that.dataController.items();
    columns = that.columnsController.getColumns();
    assert.equal(items.length, 1, "count items");
    assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, "data of the second item");
    assert.strictEqual(that.option("searchPanel.text"), "Bob", "search text");
    assert.ok(Array.isArray(that.dataController.filter()), "filter dataSource");
    assert.equal(columns.length, 2, "count columns");
    assert.deepEqual(columns[0].filterValues, undefined, "filter values of the first column");
    assert.deepEqual(columns[1].filterValue, 19, "filter values", "filter value of the second column");
});

// T238430
QUnit.test("clearFilter didn't apply by incorrect filter name", function(assert) {
    // arrange
    var that = this,
        items,
        columns;

    that.dataSource = createDataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 },
        { name: 'Tom', age: 12 },
        { name: 'Bob', age: 19 },
        { name: 'Bobbi', age: 19 }
    ], {}, { filter: [['name', 'Alex'], "or", ['name', 'Dan'], "or", ['name', 'Tom'], "or", ['name', 'Bob']] });

    that.applyOptions({
        columns: [{ dataField: "name", filterValues: ["Alex", "Dan", "Bob"] }, { dataField: "age", filterValue: 19 }]
    });
    that.dataController.setDataSource(that.dataSource);
    that.dataSource.load();
    that.dataController.searchByText("Bob");

    // assert
    items = that.dataController.items();
    columns = that.columnsController.getColumns();
    assert.equal(items.length, 1, "count items");
    assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, "data item");
    assert.strictEqual(that.option("searchPanel.text"), "Bob", "search text");
    assert.ok(Array.isArray(that.dataController.filter()), "filter dataSource");
    assert.equal(columns.length, 2, "count columns");
    assert.deepEqual(columns[0].filterValues, ["Alex", "Dan", "Bob"], "filter values of the first column");
    assert.deepEqual(columns[1].filterValue, 19, "filter values", "filter value of the second column");

    // act
    that.dataController.clearFilter("test");

    // assert
    items = that.dataController.items();
    columns = that.columnsController.getColumns();
    assert.equal(items.length, 1, "count items");
    assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, "data of the second item");
    assert.strictEqual(that.option("searchPanel.text"), "Bob", "search text");
    assert.ok(Array.isArray(that.dataController.filter()), "filter dataSource");
    assert.equal(columns.length, 2, "count columns");
    assert.deepEqual(columns[0].filterValues, ["Alex", "Dan", "Bob"], "filter values of the first column");
    assert.deepEqual(columns[1].filterValue, 19, "filter values", "filter value of the second column");
});

// B233043
QUnit.test("filter operation reset pageIndex", function(assert) {
    this.dataSource = createDataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 },
        { name: 'Max', age: 21 }
    ], {}, { pageSize: 2, pageIndex: 1 });

    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();


    assert.equal(this.dataController.pageIndex(), 1);

    // act
    this.dataController.filter(['name', '<>', 'Ilya']);

    assert.equal(this.dataController.items().length, 2);
    assert.equal(this.dataController.pageIndex(), 0);
});

QUnit.test("search for number column", function(assert) {
    this.setupFilterableData();

    // act
    this.dataController.searchByText('9');

    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Dan');
});

QUnit.test("search for string column", function(assert) {
    this.setupFilterableData();

    // act
    this.dataController.searchByText('Al');

    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Alex');
});

QUnit.test("search for date column", function(assert) {
    this.setupFilterableData();

    // act
    this.dataController.searchByText(formatHelper.format(new Date(1996, 1, 20), 'shortDate'));

    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Dan');
});

QUnit.test("search and dataSource filter", function(assert) {
    this.dataSource = createDataSource([
        { name: 'Alex', age: 15, birthDate: new Date(1999, 2, 5) },
        { name: 'Boris', age: 21, birthDate: new Date(1993, 5, 2) },
        { name: 'Dan', age: 19, birthDate: new Date(1996, 1, 20) }
    ], {}, { filter: ['age', '>', 16] });

    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();
    assert.equal(this.dataController.items().length, 2);

    // act
    this.dataController.searchByText('B');

    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Boris');
});

// T100310
QUnit.test("search for lookup column", function(assert) {
    this.setupFilterableData();

    // act
    this.dataController.searchByText('Reje');

    // assert
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Dan');
});

QUnit.test("search for lookup column with calculateDisplayValue", function(assert) {
    this.setupFilterableData();

    // act
    this.dataController.searchByText('Secon');

    // assert
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Boris');
});

// B239940
QUnit.test("Apply search for string column when change dataSource", function(assert) {
    // arrange
    var that = this,
        logId,
        isDataSourceReloaded = false;

    that.setupFilterableData();

    // act
    that.dataController.searchByText('Test');

    that.dataSource = createDataSource([
        { name: 'Test', age: 15, birthDate: new Date(1999, 2, 5) },
        { name: 'Boris', age: 21, birthDate: new Date(1993, 5, 2) },
        { name: 'Dan', age: 19, birthDate: new Date(1996, 1, 20) }
    ]);

    that.dataSource.on("changed", function() {
        isDataSourceReloaded = true;
    });

    that.dataController.setDataSource(that.dataSource);
    that.dataSource.load();
    // assert
    assert.ok(isDataSourceReloaded);
    assert.equal(logId, undefined, 'no log messages');
    assert.equal(that.dataController.items().length, 1);
    assert.equal(that.dataController.items()[0].data.name, 'Test');
});

QUnit.test("Apply search for string and number column when change dataSource", function(assert) {
    // arrange
    var that = this;

    // act
    that.dataController.searchByText('20');

    that.dataSource = new DataSource({
        store: [
            { stringField: 'Test150', numberField: 20 },
            { stringField: 'Test200', numberField: 200 },
            { stringField: 'Test350', numberField: 2000 }
        ]
    });

    that.dataController.setDataSource(that.dataSource);

    sinon.spy(errors, "log");

    that.dataSource.load();
    // assert
    assert.equal(errors.log.lastCall.args[0], "W1005", "Warning about double loading is raised");
    assert.equal(that.dataController.items().length, 2);
    assert.equal(that.dataController.items()[0].data.numberField, 20, '20 equals searchText "20"');
    assert.equal(that.dataController.items()[1].data.stringField, 'Test200', '200 contains searchText "20"');

    errors.log.restore();
});

QUnit.test("Apply search when one empty column is without dataType", function(assert) {
    // arrange
    var that = this;

    // act
    this.applyOptions({
        searchPanel: { text: '20' },
        columns: [
            { dataField: 'stringField', dataType: 'string' },
            { caption: "Empty" },
            { dataField: 'numberField', dataType: 'number' }]
    });

    that.dataSource = new DataSource({
        store: [
            { stringField: 'Test150', numberField: 20 },
            { stringField: 'Test200', numberField: 200 },
            { stringField: 'Test350', numberField: 2000 }
        ]
    });

    that.dataController.setDataSource(that.dataSource);

    sinon.spy(errors, "log");

    that.dataSource.load();
    // assert
    assert.strictEqual(errors.log.callCount, 0, "Warning about double loading is not raised");
    assert.equal(that.dataController.items().length, 2);
    assert.equal(that.dataController.items()[0].data.numberField, 20, '20 equals searchText "20"');
    assert.equal(that.dataController.items()[1].data.stringField, 'Test200', '200 contains searchText "20"');

    errors.log.restore();
});

QUnit.test("Apply search for string column without reloading when all dataTypes defined", function(assert) {
    // arrange
    var that = this,
        logId,
        loadCount = 0;

    this.applyOptions({
        searchPanel: { text: 'Test' },
        columns: [{ dataField: 'name', dataType: 'string' }, { dataField: 'birthDate', dataType: 'date' }, { dataField: 'age', dataType: 'number' }]
    });


    // act
    that.dataSource = createDataSource([
        { name: 'Test', age: 15, birthDate: new Date(1999, 2, 5) },
        { name: 'Boris', age: 21, birthDate: new Date(1993, 5, 2) },
        { name: 'Dan', age: 19, birthDate: new Date(1996, 1, 20) }
    ]);

    that.dataSource.on('changed', function() {
        loadCount++;
    });

    that.dataController.setDataSource(that.dataSource);

    that.dataSource.load();
    // assert
    assert.equal(loadCount, 1);
    assert.equal(logId, undefined);
    assert.equal(that.dataController.items().length, 1);
    assert.equal(that.dataController.items()[0].data.name, 'Test');
});

// T528684
QUnit.test("Apply search for lookup column", function(assert) {
    // arrange
    var that = this,
        loadingArgs = [];

    this.applyOptions({
        searchPanel: { text: 'Second' },
        remoteOperations: true,
        dataSource: new ArrayStore({
            onLoading: function(e) {
                loadingArgs.push(e);
            },
            data: [{ name: "Alex", categoryId: 1 }, { name: "Dan", categoryId: 2 }]
        }),
        columns: [{ dataField: 'categoryId', dataType: "number", lookup: {
            dataSource: [
                { id: 1, name: "first" },
                { id: 2, name: "second" }
            ],
            valueExpr: "id",
            displayExpr: "name"
        } }]
    });

    this.dataController.optionChanged({ name: "dataSource" });

    // assert
    assert.equal(loadingArgs.length, 1);
    assert.deepEqual(loadingArgs[0].filter, ["categoryId", "=", 2]);
    assert.equal(that.dataController.items().length, 1);
    assert.equal(that.dataController.items()[0].data.categoryId, 2);
});

QUnit.test("column filter for one column", function(assert) {
    this.setupFilterableData();


    // act
    this.columnsController.columnOption(0, 'filterValue', 'Al');

    // assert
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Alex');
});

QUnit.test("Filtering with additional filter when dataController's filter expression is function (assertT149995)", function(assert) {
    var dataSource = createDataSource([
                { name: 'Alex', age: 15, birthDate: new Date(1999, 2, 5), state: 0, processed: false },
                { name: 'Alla', age: 21, birthDate: new Date(1993, 5, 2), state: 0, processed: false },
                { name: 'Dan', age: 19, birthDate: new Date(1996, 1, 20), state: 1, processed: true }
        ]),
        columnFilterItemsCount;

    this.dataController.setDataSource(dataSource);
    dataSource.load();
    this.columnsController.columnOption('name', 'filterValue', 'Al');

    // act
    columnFilterItemsCount = this.dataController.items().length;

    this.dataController.filter(function(item) {
        return item.age < 20;
    });

    // assert
    assert.equal(columnFilterItemsCount, 2, "When change filterValue in filterRow we have 2 items in data controller");
    assert.equal(this.dataController.items().length, 1, "When we set data controller's filter we have 1 item in data controller which satisfies both filter expressions");
    assert.equal(this.dataController.items()[0].data.name, 'Alex');
});

QUnit.test("column filter for one column for custom defaultFilterOperation", function(assert) {
    this.setupFilterableData();

    // assert
    assert.equal(this.columnsController.columnOption(0, 'defaultFilterOperation'), 'contains');

    // act
    this.columnsController.columnOption(0, 'defaultFilterOperation', '=');
    this.columnsController.columnOption(0, 'filterValue', 'Al');

    // assert
    assert.equal(this.dataController.items().length, 0);

    // act
    this.columnsController.columnOption(0, 'filterValue', 'Alex');

    // assert
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Alex');
});

QUnit.test("column filter not apply for invisible column", function(assert) {
    this.setupFilterableData();

    // act
    this.columnsController.columnOption(0, 'visible', false);
    this.columnsController.columnOption(0, 'filterValue', 'Al');

    // assert
    assert.equal(this.dataController.items().length, 3);
});

QUnit.test("column filter for two columns", function(assert) {
    this.setupFilterableData();

    // act
    this.columnsController.columnOption(0, 'filterValue', 'A');
    this.columnsController.columnOption(1, 'filterValue', '19');

    // assert
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Dan');
});

QUnit.test("column filter for column with lookup", function(assert) {
    this.setupFilterableData();

    // act
    this.columnsController.columnOption(4, 'filterValue', 1);

    // assert
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Dan');
});

QUnit.test("column filter for column with lookup and calculateDisplayValue", function(assert) {
    this.setupFilterableData();

    // act
    this.columnsController.columnOption(6, 'filterValue', 1);

    // assert
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Boris');
});

// T104792
QUnit.test("column filter for boolean column true value", function(assert) {
    this.setupFilterableData();


    // act
    this.columnsController.columnOption(5, 'filterValue', true);

    // assert
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Dan');
});

// T104792
QUnit.test("column filter for boolean column false value", function(assert) {
    this.setupFilterableData();


    // act
    this.columnsController.columnOption(5, 'filterValue', false);

    // assert
    assert.equal(this.dataController.items().length, 2);
    assert.equal(this.dataController.items()[0].data.name, 'Alex');
    assert.equal(this.dataController.items()[1].data.name, 'Boris');
});

QUnit.test("column filter for column with calculateFilterExpression", function(assert) {
    this.setupFilterableData();

    // act
    this.columnsController.columnOption(3, 'filterValue', '9');

    // assert
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.age, 19);
    // act
    this.columnsController.columnOption(3, 'filterValue', 'Ale');

    // assert
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Alex');
});

QUnit.test("column filter for column with calculateFilterExpression using function selector when cache enabled", function(assert) {
    this.setupFilterableData();

    var loadingCount = 0;
    this.dataSource.store().on("loading", function() {
        loadingCount++;
    });

    // act
    this.columnsController.columnOption(3, 'calculateFilterExpression', function(text, operation) {
        return [function(data) { return data.name + " " + data.age; }, operation || 'contains', text];
    });
    this.columnsController.columnOption(3, 'filterValue', '9');

    // assert
    assert.equal(loadingCount, 0, "no loading because cache enabled");
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.age, 19);

    // act
    this.columnsController.columnOption(3, 'filterValue', 'Ale');

    // assert
    assert.equal(loadingCount, 0, "no loading because cache enabled");
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Alex');
});

QUnit.test("column filter for column with calculateFilterExpression returns filter function when cache enabled", function(assert) {
    this.setupFilterableData();

    var loadingCount = 0;
    this.dataSource.store().on("loading", function() {
        loadingCount++;
    });

    // act
    this.dataController.filter(["age", ">", 10]);
    this.columnsController.columnOption(3, 'calculateFilterExpression', function(text, operation) {
        return function(data) { return (data.name + " " + data.age).indexOf(text) >= 0; };
    });
    this.columnsController.columnOption(3, 'filterValue', '9');

    // assert
    assert.equal(loadingCount, 0, "no loading because cache enabled");
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.age, 19);

    // act
    this.columnsController.columnOption(3, 'filterValue', 'Ale');

    // assert
    assert.equal(loadingCount, 0, "no loading because cache enabled");
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Alex');
});

QUnit.test("no loading when cache enabled and remote filtering is not changed", function(assert) {
    this.setupFilterableData();

    this.applyOptions({
        remoteOperations: { filtering: true }
    });

    this.dataController._isSharedDataSource = true;
    this.dataController.setDataSource(this.dataSource);

    var loadingCount = 0;
    this.dataSource.store().on("loading", function() {
        loadingCount++;
    });

    // act
    this.columnsController.columnOption(3, 'calculateFilterExpression', function(text, operation) {
        return [function(data) { return data.name + " " + data.age; }, operation || 'contains', text];
    });
    this.columnsController.columnOption(3, 'filterValue', '9');

    // assert
    assert.equal(loadingCount, 1, "one loading after change filterValue");
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.age, 19);

    // act
    this.dataSource.load();

    // assert
    assert.equal(loadingCount, 1, "no loading because filter is not changed");
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.age, 19);
});

QUnit.test("column filter when selectedFilterOperation and filterValue parameters defined", function(assert) {
    this.setupFilterableData();

    // act
    this.columnsController.columnOption(0, {
        selectedFilterOperation: '>',
        filterValue: 'B'
    });

    // assert
    assert.equal(this.dataController.items().length, 2);
    assert.equal(this.dataController.items()[0].data.name, 'Boris');
    assert.equal(this.dataController.items()[1].data.name, 'Dan');
});

// T311798
QUnit.test("column filter when selectedFilterOperation, filterValue and headerFilter.groupInterval parameters defined", function(assert) {
    this.setupFilterableData();

    // act
    this.columnsController.columnOption(1, {
        headerFilter: { groupInterval: 10 },
        selectedFilterOperation: '=',
        filterValue: 19
    });

    // assert
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Dan');
    assert.equal(this.dataController.items()[0].data.age, 19);
});


QUnit.test("column filter when selectedFilterOperation and filterValue parameters undefined", function(assert) {
    // arrange
    this.setupFilterableData();

    this.applyOptions({
        columns: [{ dataField: 'name' }, 'age']
    });

    this.columnsController.columnOption(0, {
        selectedFilterOperation: "contains",
        filterValue: "Al"
    });

    // assert
    assert.strictEqual(this.columnsController.getVisibleColumns()[0].filterValue, "Al", "has filter text");
    assert.equal(this.dataController.items().length, 1, "count items");
    assert.strictEqual(this.dataController.items()[0].data.name, "Alex", "data name items[0]");

    // act
    this.columnsController.columnOption(0, {
        selectedFilterOperation: null,
        filterValue: null
    });

    // assert
    assert.ok(!this.columnsController.getVisibleColumns()[0].filterValue, "not has filter text");
    assert.ok(!this.columnsController.getVisibleColumns()[0].selectedFilterOperation, "not has selectedFilterOperation");
    assert.equal(this.dataController.items().length, 3, "count items");
});

QUnit.test("column filter when selectedFilterOperation defined and filterValue undefined", function(assert) {
    // arrange
    this.setupFilterableData();
    var dataSourceChanged = false;

    this.applyOptions({
        columns: [{ dataField: 'name', selectedFilterOperation: "contains", filterValue: "Al" }, 'age']
    });

    this.dataController._dataSource.changed.add(function() {
        dataSourceChanged = true;
    });

    // act
    this.columnsController.columnOption(0, {
        filterValue: null
    });

    // assert
    assert.ok(dataSourceChanged, "dataSource changed");
});

QUnit.test("column filter when selectedFilterOperation parameter null and column filterValue defined", function(assert) {
    // arrange
    var dataSourceChanged = false;
    this.setupFilterableData();

    this.applyOptions({
        columns: [{ dataField: 'name', selectedFilterOperation: "contains", filterValue: "Al" }, 'age']
    });

    this.dataController._dataSource.changed.add(function() {
        dataSourceChanged = true;
    });

    // act
    this.columnsController.columnOption(0, {
        selectedFilterOperation: null
    });

    // assert
    assert.ok(dataSourceChanged, "dataSource changed");
});

QUnit.test("column filter when selectedFilterOperation parameter defined and column filterValue is not defined", function(assert) {
    // arrange
    this.setupFilterableData();
    var dataSourceChanged = false;

    this.applyOptions({
        columns: [{ dataField: 'name', selectedFilterOperation: "contains" }, 'age']
    });

    this.dataController._dataSource.changed.add(function() {
        dataSourceChanged = true;
    });

    // act
    this.columnsController.columnOption(0, {
        selectedFilterOperation: '='
    });

    // assert
    assert.ok(!dataSourceChanged, "dataSource changed");
});

QUnit.test("column filter when selectedFilterOperation parameter defined and no filterValue", function(assert) {
    this.setupFilterableData();

    // act
    this.columnsController.columnOption(0, {
        selectedFilterOperation: '=',
        filterValue: undefined
    });

    // assert
    assert.equal(this.dataController.items().length, 3);
});

// B239940
QUnit.test("Apply column filter when change dataSource", function(assert) {
    // arrange
    var that = this,
        isDataSourceReloaded = false;

    that.setupFilterableData();

    that.columnsController.columnOption(0, {
        selectedFilterOperation: '=',
        filterValue: 'Test'
    });

    that.dataSource = createDataSource([
        { name: 'Test', age: 15, birthDate: new Date(1999, 2, 5) },
        { name: 'Boris', age: 21, birthDate: new Date(1993, 5, 2) },
        { name: 'Dan', age: 19, birthDate: new Date(1996, 1, 20) }
    ]);

    that.dataSource.on("changed", function() {
        isDataSourceReloaded = true;
    });

    // act
    that.dataController.setDataSource(that.dataSource);
    that.dataSource.load();

    // assert
    assert.ok(isDataSourceReloaded);
    assert.equal(that.dataController.items().length, 1);
    assert.equal(that.dataController.items()[0].data.name, 'Test');
});

// B254794
QUnit.test("Apply column filter on QUnit.start when data need converting", function(assert) {
    // arrange
    this.applyOptions({ columns: [{ dataField: 'name', selectedFilterOperation: '=', filterValue: 'Test' }, 'age', { dataField: 'birthDate', dataType: 'date' }] });

    this.dataSource = createDataSource([
        { name: 'Test', age: 15, birthDate: '1999/03/05' },
        { name: 'Boris', age: 21, birthDate: '1993/06/02' },
        { name: 'Dan', age: 19, birthDate: '1996/02/20' }
    ], {}, { asyncLoadEnabled: true });

    // act
    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();

    this.clock.tick();

    // assert
    assert.equal(this.dataController.items().length, 1);
    assert.equal(this.dataController.items()[0].data.name, 'Test');
    assert.deepEqual(this.dataController.items()[0].data.birthDate, '1999/03/05');
});

// B239940
QUnit.test("Data source is not reloaded on set dataSource when no filters", function(assert) {
    // arrange
    var that = this,
        changedCallCount = 0;

    that.setupFilterableData();

    that.dataSource = createDataSource([
        { name: 'Test', age: 15, birthDate: new Date(1999, 2, 5) },
        { name: 'Boris', age: 21, birthDate: new Date(1993, 5, 2) },
        { name: 'Dan', age: 19, birthDate: new Date(1996, 1, 20) }
    ]);

    that.dataSource.on("changed", function() {
        changedCallCount++;
    });

    // act
    that.columnsController.reset();
    that.dataController.setDataSource(that.dataSource);
    that.dataSource.load();

    // assert
    assert.equal(changedCallCount, 1, 'one load only');
    assert.equal(that.dataController.items().length, 3);
    assert.equal(that.dataController.items()[0].data.name, 'Test');
});

QUnit.test("Apply filter method is not used when apply filter is 'OnClick' for filterRow", function(assert) {
    var isApplyFilterCalled;

    this.applyOptions({
        filterRow: {
            applyFilter: "onClick"
        }
    });

    this.dataController._applyFilter = function() {
        isApplyFilterCalled = true;
    };

    this.dataController._handleColumnsChanged({
        changeTypes: {
            columns: "test"
        },
        optionNames: {
            bufferedFilterValue: "test"
        }
    });

    assert.ok(!isApplyFilterCalled);
});

QUnit.test("Filter is reset when column has filterValue and it visibility is changed", function(assert) {
    this.setupFilterableData();

    this.columnsController.columnOption("name", "filterValue", "wrong");
    this.columnsController.columnOption("name", "visible", false);

    assert.equal(this.dataController.items().length, 3, "filter is reset");
});

QUnit.test("Filter is reset when column has filterValue and filterValues and it visibility is changed", function(assert) {
    this.setupFilterableData();

    this.columnsController.columnOption("name", {
        filterValue: "wrong1",
        filterValues: ["wrong2"]
    });
    this.columnsController.columnOption("name", "visible", false);

    assert.equal(this.dataController.items().length, 3, "filter is reset");
});

QUnit.test("Filter is reset when column has filterValues and it visibility is changed", function(assert) {
    this.setupFilterableData();

    this.columnsController.columnOption("name", "filterValues", ["wrong"]);
    this.columnsController.columnOption("name", "visible", false);

    assert.equal(this.dataController.items().length, 3, "filter is reset");
});

QUnit.test("Filter is applied when column with filterValue is shown", function(assert) {
    this.setupFilterableData();

    this.columnsController.columnOption("name", {
        filterValue: "wrong",
        visible: false
    });
    this.columnsController.columnOption("name", "visible", true);

    assert.equal(this.dataController.items().length, 0, "filter is applied");
});

// T487072
QUnit.test("Not apply groupInterval of the headerFilter for filterRow", function(assert) {
    // arrange
    this.dataSource = createDataSource([
        { name: "Alex", birthDate: new Date(1992, 7, 6, 12, 30, 21) }
    ]);
    this.applyOptions({
        columns: ["name", {
            dataField: "birthDate",
            dataType: "date",
            headerFilter: {
                groupInterval: "second"
            },
            filterValue: new Date(1992, 7, 6, 12, 30, 21)
        }]
    });
    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();

    // act, assert
    assert.deepEqual(this.getCombinedFilter(true), [["birthDate", ">=", new Date(1992, 7, 6)], "and", ["birthDate", "<", new Date(1992, 7, 7)]], "filter expression");
});

QUnit.module("Grouping", { beforeEach: setupModule, afterEach: teardownModule });

// T161732
QUnit.test("rows when multilevel grouping without key", function(assert) {
    // arrange
    var items = [{
        items: [{
            key: 2,
            items: [
                { field1: undefined, field2: 2, field3: 3 }, { field1: undefined, field2: 2, field3: 5 },
            ]
        }]
    }];

    var dataSource = new MockGridDataSource({
        items: items,
        itemsCount: 2,
        group: ['field1', 'field2']
    });

    this.applyOptions({
        columns: [{ dataField: 'field1', groupIndex: 0 }, { dataField: 'field2', groupIndex: 1 }, 'field3']
    });

    // act
    this.dataController.setDataSource(dataSource);
    dataSource.load();
    var rows = this.dataController.items();

    // assert
    assert.equal(rows.length, 4);
    assert.deepEqual(rows[0].values, [undefined]);
    assert.deepEqual(rows[0].groupIndex, 0);
    assert.deepEqual(rows[0].isExpanded, true);
    assert.deepEqual(rows[0].data, items[0]);
    assert.deepEqual(rows[1].values, [undefined, 2]);
    assert.deepEqual(rows[1].groupIndex, 1);
    assert.deepEqual(rows[1].isExpanded, true);
    assert.deepEqual(rows[1].data, items[0].items[0]);
    assert.deepEqual(rows[2].values, [null, null, 3]);
    assert.deepEqual(rows[2].data, { field1: undefined, field2: 2, field3: 3 });
});

QUnit.test("rows with simple grouping", function(assert) {
    var items = [
        {
            key: 1, items: [
                    { field1: 1, field2: 4 },
                    { field1: 1, field2: 5 }
            ]
        },
        { key: 2, items: [{ field1: 2, field2: 3 }] }
    ];

    var dataSource = new MockGridDataSource({
        items: items,
        itemsCount: 3,
        group: 'field1'
    });

    this.applyOptions({
        columns: [{ dataField: 'field1', groupIndex: 0 }, 'field2']
    });

    // act
    this.dataController.setDataSource(dataSource);
    dataSource.load();
    var rows = this.dataController.items();

    // assert
    assert.equal(rows.length, 5);
    assert.deepEqual(rows[0].values, [1]);
    assert.deepEqual(rows[0].groupIndex, 0);
    assert.deepEqual(rows[0].isExpanded, true);
    assert.deepEqual(rows[0].data, items[0]);
    assert.deepEqual(rows[1].values, [null, 4]);
    assert.deepEqual(rows[1].data, { field1: 1, field2: 4 });
    assert.deepEqual(rows[2].values, [null, 5]);
    assert.deepEqual(rows[2].data, { field1: 1, field2: 5 });
    assert.deepEqual(rows[3].values, [2]);
    assert.deepEqual(rows[3].groupIndex, 0);
    assert.deepEqual(rows[3].isExpanded, true);
    assert.deepEqual(rows[3].data, items[1]);
    assert.deepEqual(rows[4].values, [null, 3]);
    assert.deepEqual(rows[4].data, { field1: 2, field2: 3 });
});

QUnit.test("rows with simple grouping on column with dataType", function(assert) {
    var items = [
        { field1: "1.0", field2: 4 },
        { field1: "1.0", field2: 5 },
        { field1: "2.5", field2: 3 }
    ];

    var loadArgs = [];

    var dataSource = new DataSource({
        load: function(e) {
            loadArgs.push(e);
            return items;
        },
        totalCount: function() {
            return 3;
        }
    });

    this.applyOptions({
        columns: [{ dataField: 'field1', groupIndex: 0, dataType: 'number' }, 'field2'],
        remoteOperations: { filtering: true, sorting: true, paging: true },
        grouping: { autoExpandAll: true }
    });

    // act
    this.dataController.setDataSource(dataSource);
    dataSource.load();

    var rows = this.dataController.items();

    // assert
    assert.equal(rows.length, 5);
    assert.deepEqual(rows[0].values, [1]);
    assert.deepEqual(rows[0].groupIndex, 0);
    assert.deepEqual(rows[0].isExpanded, true);
    assert.deepEqual(rows[0].data, { key: 1, items: [items[0], items[1]] });
    assert.deepEqual(rows[1].values, [null, 4]);
    assert.deepEqual(rows[1].data, items[0]);
    assert.deepEqual(rows[2].values, [null, 5]);
    assert.deepEqual(rows[2].data, items[1]);
    assert.deepEqual(rows[3].values, [2.5]);
    assert.deepEqual(rows[3].groupIndex, 0);
    assert.deepEqual(rows[3].isExpanded, true);
    assert.deepEqual(rows[3].data, { key: 2.5, items: [items[2]] });
    assert.deepEqual(rows[4].values, [null, 3]);
    assert.deepEqual(rows[4].data, items[2]);

    // act
    this.dataController.collapseRow([2.5]);

    // assert
    assert.equal(loadArgs.length, 3);
    assert.deepEqual(loadArgs[0].filter, undefined);
    assert.deepEqual(loadArgs[1].filter, ["field1", "=", 2.5]);
    assert.deepEqual(loadArgs[1].skip, 0);
    assert.deepEqual(loadArgs[1].take, 1);
    assert.deepEqual(loadArgs[2].filter, ["field1", "<>", 2.5]);
    assert.deepEqual(loadArgs[2].skip, 0);
    assert.deepEqual(loadArgs[2].take, 21);
});


QUnit.test("load options should not contain function selectors when remote grouping enabled", function(assert) {
    var items = [
        { key: "1", count: 2, items: null },
        { key: "2", count: 1, items: null }
    ];

    var loadArgs = [];

    var dataSource = new DataSource({
        load: function(e) {
            loadArgs.push(e);
            return items;
        },
        totalCount: function() {
            return 3;
        }
    });

    this.applyOptions({
        columns: [{ dataField: 'field1', groupIndex: 0 }, 'field2'],
        remoteOperations: { filtering: true, sorting: true, paging: true, grouping: true },
        grouping: { autoExpandAll: false }
    });

    // act
    this.dataController.setDataSource(dataSource);
    dataSource.load();

    this.dataController.changeRowExpand(["1"]);

    // assert
    assert.equal(loadArgs.length, 2);
    assert.deepEqual(loadArgs[0].group, [{ selector: "field1", desc: false, isExpanded: false }]);
    assert.deepEqual(loadArgs[0].filter, undefined);
    assert.deepEqual(loadArgs[0].skip, undefined);
    assert.deepEqual(loadArgs[0].take, undefined);

    assert.deepEqual(loadArgs[1].group, null);
    assert.deepEqual(loadArgs[1].filter, ["field1", "=", "1"]);
    assert.deepEqual(loadArgs[1].skip, undefined);
    assert.deepEqual(loadArgs[1].take, undefined);
});

QUnit.test("rows collapsed group with undefined key", function(assert) {
    var items = [
        {
            key: undefined, items: null
        },
        { key: 2, items: [{ field1: 2, field2: 3 }] }
    ];

    var dataSource = new MockGridDataSource({
        items: items,
        itemsCount: 3,
        group: 'field1'
    });

    this.applyOptions({
        columns: [{ dataField: 'field1', groupIndex: 0 }, 'field2']
    });

    // act
    this.dataController.setDataSource(dataSource);
    dataSource.load();
    var rows = this.dataController.items();

    // assert
    assert.equal(rows.length, 3);
    assert.deepEqual(rows[0].values, [undefined]);
    assert.deepEqual(rows[0].groupIndex, 0);
    assert.deepEqual(rows[0].isExpanded, false);
    assert.deepEqual(rows[0].data, items[0]);
    assert.deepEqual(rows[1].values, [2]);
    assert.deepEqual(rows[1].groupIndex, 0);
    assert.deepEqual(rows[1].isExpanded, true);
    assert.deepEqual(rows[1].data, items[1]);
    assert.deepEqual(rows[2].values, [null, 3]);
    assert.deepEqual(rows[2].data, { field1: 2, field2: 3 });
});

QUnit.test("rows with multilevel grouping", function(assert) {
    var items = [{
        key: 1, items: [
            {
                key: 2, items: [
                        { field1: 1, field2: 2, field3: 4 }, { field1: 1, field2: 2, field3: 5 }
                ]
            }
        ]
    }];

    var dataSource = new MockGridDataSource({
        items: items,
        itemsCount: 2,
        group: ['field1', 'field2']
    });

    this.applyOptions({
        columns: [{ dataField: 'field1', groupIndex: 0 }, { dataField: 'field2', groupIndex: 1 }, 'field3']
    });

    // act
    this.dataController.setDataSource(dataSource);
    dataSource.load();
    var rows = this.dataController.items();

    // assert
    assert.equal(rows.length, 4);
    assert.deepEqual(rows[0].values, [1]);
    assert.deepEqual(rows[0].groupIndex, 0);
    assert.deepEqual(rows[0].isExpanded, true);
    assert.deepEqual(rows[0].data, items[0]);
    assert.deepEqual(rows[1].values, [1, 2]);
    assert.deepEqual(rows[1].groupIndex, 1);
    assert.deepEqual(rows[1].isExpanded, true);
    assert.deepEqual(rows[1].data, items[0].items[0]);
    assert.deepEqual(rows[2].values, [null, null, 4]);
    assert.deepEqual(rows[2].data, { field1: 1, field2: 2, field3: 4 });
    assert.deepEqual(rows[3].values, [null, null, 5]);
    assert.deepEqual(rows[3].data, { field1: 1, field2: 2, field3: 5 });
});

QUnit.test("collapsed group", function(assert) {
    var items = [
        {
            key: 1, items: null
        },
        { key: 2, items: [{ field1: 2, field2: 3 }] }
    ];

    var dataSource = new MockGridDataSource({
        items: items,
        itemsCount: 2,
        group: 'field1'
    });

    this.applyOptions({
        columns: [{ dataField: 'field1', groupIndex: 0 }, 'field2']
    });

    // act
    this.dataController.setDataSource(dataSource);
    dataSource.load();
    var rows = this.dataController.items();

    // assert
    assert.equal(rows.length, 3);
    assert.deepEqual(rows[0].values, [1]);
    assert.deepEqual(rows[0].groupIndex, 0);
    assert.deepEqual(rows[0].isExpanded, false);
    assert.deepEqual(rows[0].data, {
        key: 1, items: null
    });
    assert.deepEqual(rows[1].values, [2]);
    assert.deepEqual(rows[1].groupIndex, 0);
    assert.deepEqual(rows[1].isExpanded, true);
    assert.deepEqual(rows[1].data, {
        key: 2, items: [
                { field1: 2, field2: 3 }
        ]
    });
    assert.deepEqual(rows[2].values, [null, 3]);
    assert.deepEqual(rows[2].data, { field1: 2, field2: 3 });
});

QUnit.test("continue group", function(assert) {
    var items = [
        {
            key: 1, isContinuation: true, items: [
                    { field1: 1, field2: 4 },
                    { field1: 1, field2: 5 }
            ]
        },
        { key: 2, items: [{ field1: 2, field2: 3 }] }
    ];

    var dataSource = new MockGridDataSource({
        items: items,
        itemsCount: 3,
        group: 'field1'
    });

    this.applyOptions({
        columns: [{ dataField: 'field1', groupIndex: 0 }, 'field2']
    });

    // act
    this.dataController.setDataSource(dataSource);
    dataSource.load();
    var rows = this.dataController.items();

    // assert
    assert.equal(rows.length, 5);
    assert.deepEqual(rows[0].values, [1]);
    assert.deepEqual(rows[0].data, items[0]);
    assert.deepEqual(rows[1].values, [null, 4]);
    assert.deepEqual(rows[1].data, { field1: 1, field2: 4 });
    assert.deepEqual(rows[2].values, [null, 5]);
    assert.deepEqual(rows[2].data, { field1: 1, field2: 5 });
    assert.deepEqual(rows[3].values, [2]);
    assert.deepEqual(rows[3].groupIndex, 0);
    assert.deepEqual(rows[3].isExpanded, true);
    assert.deepEqual(rows[4].values, [null, 3]);
    assert.deepEqual(rows[4].data, { field1: 2, field2: 3 });
});

QUnit.test("continue group when virtual scrolling", function(assert) {
    var items = [
        {
            key: 1, isContinuation: true, items: [
                    { field1: 1, field2: 4 },
                    { field1: 1, field2: 5 }
            ]
        },
        { key: 2, items: [{ field1: 2, field2: 3 }] }
    ];

    var dataSource = new MockGridDataSource({
        items: items,
        itemsCount: 3,
        group: 'field1'
    });

    this.applyOptions({
        columns: [{ dataField: 'field1', groupIndex: 0 }, 'field2'],
        scrolling: { mode: 'virtual' }
    });

    // act
    this.dataController.setDataSource(dataSource);
    dataSource.load();
    var rows = this.dataController.items();

    // assert
    assert.equal(rows.length, 4);
    assert.deepEqual(rows[0].values, [null, 4]);
    assert.deepEqual(rows[0].data, { field1: 1, field2: 4 });
    assert.deepEqual(rows[1].values, [null, 5]);
    assert.deepEqual(rows[1].data, { field1: 1, field2: 5 });
    assert.deepEqual(rows[2].values, [2]);
    assert.deepEqual(rows[2].groupIndex, 0);
    assert.deepEqual(rows[2].isExpanded, true);
    assert.deepEqual(rows[3].values, [null, 3]);
    assert.deepEqual(rows[3].data, { field1: 2, field2: 3 });
});

QUnit.test("continue group when infinite scrolling", function(assert) {
    var items = [
        {
            key: 1, isContinuation: true, items: [
                    { field1: 1, field2: 4 },
                    { field1: 1, field2: 5 }
            ]
        },
        { key: 2, items: [{ field1: 2, field2: 3 }] }
    ];

    var dataSource = new MockGridDataSource({
        items: items,
        itemsCount: 3,
        group: 'field1'
    });

    this.applyOptions({
        columns: [{ dataField: 'field1', groupIndex: 0 }, 'field2'],
        scrolling: { mode: 'infinite' }
    });

    // act
    this.dataController.setDataSource(dataSource);
    dataSource.load();
    var rows = this.dataController.items();

    // assert
    assert.equal(rows.length, 4);
    assert.deepEqual(rows[0].values, [null, 4]);
    assert.deepEqual(rows[0].data, { field1: 1, field2: 4 });
    assert.deepEqual(rows[1].values, [null, 5]);
    assert.deepEqual(rows[1].data, { field1: 1, field2: 5 });
    assert.deepEqual(rows[2].values, [2]);
    assert.deepEqual(rows[2].groupIndex, 0);
    assert.deepEqual(rows[2].isExpanded, true);
    assert.deepEqual(rows[3].values, [null, 3]);
    assert.deepEqual(rows[3].data, { field1: 2, field2: 3 });
});

QUnit.test("continue multilevel group", function(assert) {
    var items = [{
        key: 1, isContinuation: true, items: [
            {
                key: 2, isContinuation: true, items: [
                        { field1: 1, field2: 2, field3: 4 }, { field1: 1, field2: 2, field3: 5 }
                ]
            }
        ]
    },
    {
        key: 2, items: [
                        { key: 1, items: [{ field1: 2, field2: 1, field3: 3 }] }
        ]
    }
    ];

    var dataSource = new MockGridDataSource({
        items: items,
        itemsCount: 3,
        group: ['field1', 'field2']
    });

    this.applyOptions({
        columns: [{ dataField: 'field1', groupIndex: 0 }, { dataField: 'field2', groupIndex: 1 }, 'field3']
    });

    // act
    this.dataController.setDataSource(dataSource);
    dataSource.load();
    var rows = this.dataController.items();

    // assert
    assert.equal(rows.length, 7);
    assert.deepEqual(rows[0].values, [1]);
    assert.deepEqual(rows[0].data, items[0]);
    assert.deepEqual(rows[1].values, [1, 2]);
    assert.deepEqual(rows[1].data, items[0].items[0]);
    assert.deepEqual(rows[2].values, [null, null, 4]);
    assert.deepEqual(rows[2].data, { field1: 1, field2: 2, field3: 4 });
    assert.deepEqual(rows[3].values, [null, null, 5]);
    assert.deepEqual(rows[3].data, { field1: 1, field2: 2, field3: 5 });
    assert.deepEqual(rows[4].values, [2]);
    assert.deepEqual(rows[4].groupIndex, 0);
    assert.deepEqual(rows[4].isExpanded, true);
    assert.deepEqual(rows[5].values, [2, 1]);
    assert.deepEqual(rows[5].groupIndex, 1);
    assert.deepEqual(rows[5].isExpanded, true);
    assert.deepEqual(rows[6].values, [null, null, 3]);
    assert.deepEqual(rows[6].data, { field1: 2, field2: 1, field3: 3 });
});

QUnit.test("continue multilevel group when virtual scrolling", function(assert) {
    var items = [{
        key: 1, isContinuation: true, items: [
            {
                key: 2, isContinuation: true, items: [
                        { field1: 1, field2: 2, field3: 4 }, { field1: 1, field2: 2, field3: 5 }
                ]
            }
        ]
    },
    {
        key: 2, items: [
                        { key: 1, items: [{ field1: 2, field2: 1, field3: 3 }] }
        ]
    }
    ];

    var dataSource = new MockGridDataSource({
        items: items,
        itemsCount: 3,
        group: ['field1', 'field2']
    });

    this.applyOptions({
        columns: [{ dataField: 'field1', groupIndex: 0 }, { dataField: 'field2', groupIndex: 1 }, 'field3'],
        scrolling: { mode: 'virtual' }
    });

    // act
    this.dataController.setDataSource(dataSource);
    dataSource.load();
    var rows = this.dataController.items();

    // assert
    assert.equal(rows.length, 5);
    assert.deepEqual(rows[0].values, [null, null, 4]);
    assert.deepEqual(rows[0].data, { field1: 1, field2: 2, field3: 4 });
    assert.deepEqual(rows[1].values, [null, null, 5]);
    assert.deepEqual(rows[1].data, { field1: 1, field2: 2, field3: 5 });
    assert.deepEqual(rows[2].values, [2]);
    assert.deepEqual(rows[2].groupIndex, 0);
    assert.deepEqual(rows[2].isExpanded, true);
    assert.deepEqual(rows[3].values, [2, 1]);
    assert.deepEqual(rows[3].groupIndex, 1);
    assert.deepEqual(rows[3].isExpanded, true);
    assert.deepEqual(rows[4].values, [null, null, 3]);
    assert.deepEqual(rows[4].data, { field1: 2, field2: 1, field3: 3 });
});

QUnit.test("changeRowExpand", function(assert) {
    var countCallPageChanged = 0,
        dataSourceOptions = {
            items: [{ key: 1, items: [] }],
            itemsCount: 1
        };

    this.dataController.setDataSource(new MockGridDataSource(dataSourceOptions));

    this.dataController.pageChanged.add(function() {
        countCallPageChanged++;
    });

    // act
    this.dataController.changeRowExpand([1]);

    // assert
    assert.ok(dataSourceOptions.loaded);

    // T262949
    assert.equal(countCallPageChanged, 0, "pageChanged is not called");
});

QUnit.test("collapseAll", function(assert) {
    var dataSourceOptions = {
        items: [{}],
        itemsCount: 1,
        pageIndex: 1
    };

    this.dataController.setDataSource(new MockGridDataSource(dataSourceOptions));

    // act
    this.dataController.collapseAll(1);

    // assert
    assert.strictEqual(dataSourceOptions.pageIndex, 0);
    assert.ok(!dataSourceOptions.reloaded);
});

QUnit.test("expandAll", function(assert) {
    var dataSourceOptions = {
        items: [{}],
        itemsCount: 1,
        pageIndex: 1
    };

    this.dataController.setDataSource(new MockGridDataSource(dataSourceOptions));

    // act
    this.dataController.expandAll(1);

    // assert
    assert.strictEqual(dataSourceOptions.pageIndex, 0);
    assert.ok(!dataSourceOptions.reloaded);
});

// T648268
QUnit.test("No exceptions on moving the column from group panel to headers (AngularJS)", function(assert) {
    // arrange
    var that = this,
        dataSource = createDataSource([]);

    that.dataController.setDataSource(dataSource);
    dataSource.load();

    that.applyOptions({ columns: ["field1", "field2", { dataField: "field3", groupIndex: 0 }, { dataField: "field4", groupIndex: 1 }, "field5"] });
    that._notifyOptionChanged = function() {
        that.columnsController._endUpdateCore();
    };

    try {
        // act
        that.columnsController.moveColumn(0, 2, 'group', 'headers');

        // assert
        assert.strictEqual(that.columnsController.getGroupColumns().length, 1, "group column count");
    } catch(e) {
        // assert
        assert.ok(false, "the error is thrown");
    }
});

QUnit.module("Editing", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("Inserting Row", function(assert) {
    var array = [
        { name: 'Alex', phone: '55-55-55' },
        { name: 'Dan', phone: '98-75-21' }
    ];

    var dataSource = createDataSource(array, { key: 'name' });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    // act
    this.editingController.addRow();

    // assert
    assert.equal(this.dataController.items().length, 3);

    assert.deepEqual(this.dataController.items()[0].values, [undefined, undefined]);
    assert.deepEqual(this.dataController.items()[0].data, {});
    assert.ok(!typeUtils.isDefined(this.dataController.items()[0].dataIndex));

    assert.deepEqual(this.dataController.items()[1].values, ['Alex', '55-55-55']);
    assert.deepEqual(this.dataController.items()[1].data, { name: 'Alex', phone: '55-55-55' });
    assert.equal(this.dataController.items()[1].dataIndex, 0);
});

// T521968
QUnit.test("Inserting several rows for cell editing mode", function(assert) {
    var array = [
        { name: 'Alex', phone: '55-55-55' },
        { name: 'Dan', phone: '98-75-21' }
    ];

    this.options.editing = {
        mode: "cell",
        allowAdding: true
    };

    var dataSource = createDataSource(array, { key: 'name' });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    // act
    this.addRow();
    this.addRow();

    // assert
    var items = this.dataController.items();

    assert.equal(items.length, 4, "two rows are added");

    assert.deepEqual(items[0].data, {}, "row 0 data");
    assert.ok(items[0].inserted, "row 0 is inserted");
    assert.deepEqual(items[1].data, array[0], "row 1 data");
    assert.deepEqual(items[2].data, array[1], "row 2 data");
    assert.notOk(items[3].inserted, "row 3 is saved");
});

QUnit.test("Inserting several rows for row editing mode", function(assert) {
    var array = [
        { name: 'Alex', phone: '55-55-55' },
        { name: 'Dan', phone: '98-75-21' }
    ];

    this.options.editing = {
        mode: "row",
        allowAdding: true
    };

    var dataSource = createDataSource(array, { key: 'name' });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    // act
    this.addRow();
    this.addRow();

    // assert
    var items = this.dataController.items();
    assert.equal(items.length, 3, "only one row is added");

    assert.deepEqual(items[0].data, {}, "row 1 data");
    assert.deepEqual(items[1].data, array[0], "row 1 data");
    assert.deepEqual(items[2].data, array[1], "row 2 data");
});

// T327787, T333894
QUnit.test("Inserting Row for grouped data", function(assert) {
    var array = [
        { name: 'Alex', phone: '55-55-55' },
        { name: 'Dan', phone: '98-75-21' }
    ];

    var dataSource = createDataSource(array, { key: 'name' }, { group: "name" });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    this.expandAll();

    // act
    this.editingController.addRow();

    // assert
    assert.equal(this.dataController.items().length, 5);

    assert.deepEqual(this.dataController.items()[0].values, [null, undefined], "item 0 values");
    assert.deepEqual(this.dataController.items()[0].data, {}, "item 0 data");
    assert.deepEqual(this.dataController.items()[0].rowType, "data", "item 0 rowType");

    assert.deepEqual(this.dataController.items()[1].values, ['Alex'], "item 1 values");
    assert.deepEqual(this.dataController.items()[1].data, { key: 'Alex', items: [{ name: 'Alex', phone: '55-55-55' }] }, "item 1 data");
    assert.deepEqual(this.dataController.items()[1].rowType, "group", "item 1 rowType");

    assert.deepEqual(this.dataController.items()[2].values, [null, '55-55-55'], "item 2 values");
    assert.deepEqual(this.dataController.items()[2].data, { name: 'Alex', phone: '55-55-55' }, "item 2 data");
    assert.deepEqual(this.dataController.items()[2].rowType, "data", "item 2 rowType");
});

QUnit.test("Double inserting Row", function(assert) {
    var array = [
        { name: 'Alex', phone: '55-55-55' },
        { name: 'Dan', phone: '98-75-21' }
    ];

    var dataSource = createDataSource(array, { key: 'name' });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    this.editingController.addRow();
    // act
    this.editingController.addRow();

    // assert
    assert.equal(this.dataController.items().length, 3);

    assert.deepEqual(this.dataController.items()[0].values, [undefined, undefined]);
    assert.deepEqual(this.dataController.items()[0].data, {});

    assert.deepEqual(this.dataController.items()[1].values, ['Alex', '55-55-55']);
    assert.deepEqual(this.dataController.items()[1].data, { name: 'Alex', phone: '55-55-55' });
});

QUnit.test("Cancel Inserting Row", function(assert) {
    var array = [
        { name: 'Alex', phone: '55-55-55' },
        { name: 'Dan', phone: '98-75-21' }
    ];

    var dataSource = createDataSource(array, { key: 'name' });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    this.editingController.addRow();
    // act
    this.editingController.cancelEditData();

    // assert
    assert.equal(this.dataController.items().length, 2);

    assert.deepEqual(this.dataController.items()[0].values, ['Alex', '55-55-55']);
    assert.deepEqual(this.dataController.items()[0].data, { name: 'Alex', phone: '55-55-55' });
});

QUnit.test("Cancel Inserting Row after change page", function(assert) {
    var array = [
        { name: 'Alex', phone: '55-55-55' },
        { name: 'Dan', phone: '98-75-21' },
        { name: 'Martin', phone: '12-34-56' }
    ];

    var dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    this.editingController.addRow();
    // act
    this.dataController.pageIndex(1);

    // assert
    assert.ok(!this.editingController.isEditing());
    assert.equal(this.dataController.items().length, 1);

    assert.deepEqual(this.dataController.items()[0].data, array[2]);
});

QUnit.test("Edit row after detail row", function(assert) {
    var array = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
    ];

    var dataSource = createDataSource(array, { key: 'id' });

    this.dataController.setDataSource(dataSource);
    dataSource.load();

    this.expandRow(1);
    // act
    this.editRow(2);

    // assert
    assert.ok(this.editingController.isEditing());
    assert.equal(this.dataController.items().length, 4);
    assert.strictEqual(this.dataController.items()[1].rowType, "detail", "row 1 is detail");
    assert.strictEqual(this.dataController.items()[2].rowType, "data", "row 2 is data");
    assert.strictEqual(this.dataController.items()[2].isEditing, true, "isEditing is correct for row 2");
});

QUnit.module("Error handling", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("load error", function(assert) {
    var dataErrors = [],
        callbackDataErrors = [];

    this.options = {
        loadingTimeout: 0,
        dataSource: {
            load: function() {
                return $.Deferred().reject('Load error');
            },
            totalCount: function() {
                return $.Deferred().reject('Total count error');
            }
        },
        onDataErrorOccurred: function(e) {
            dataErrors.push(e.error.message);
        }
    };

    // act
    setupDataGridModules(this, ['data', 'columns']);

    this.dataController.dataErrorOccurred.add(function(error) {
        callbackDataErrors.push(error.message);
    });
    this.clock.tick();

    // assert
    assert.deepEqual(dataErrors, ['Load error']);
    assert.deepEqual(callbackDataErrors, ['Load error']);
});

QUnit.test("return false on dataErrorOccurred", function(assert) {
    var callbackDataErrors = [],
        dataErrors = [];

    this.options = {
        loadingTimeout: 0,
        dataSource: {
            load: function() {
                return $.Deferred().reject('Load error');
            },
            totalCount: function() {
                return $.Deferred().reject('Total count error');
            }
        },
        onDataErrorOccurred: function(e) {
            dataErrors.push(e.error.message);
            return false;
        }
    };

    // act
    setupDataGridModules(this, ['data', 'columns']);

    this.dataController.dataErrorOccurred.add(function(error) {
        callbackDataErrors.push(error.message);
    });

    this.clock.tick();

    // assert
    assert.deepEqual(dataErrors, ['Load error']);
    assert.deepEqual(callbackDataErrors, []);
});


QUnit.test("insert error", function(assert) {
    var dataErrors = [];

    this.options = {
        dataSource: {
            key: 'field1',
            load: function() {
                return [{ field1: 1, field2: 2 }];
            },
            totalCount: function() {
                return 1;
            },
            insert: function() {
                return $.Deferred().reject('field1 and field2 required');
            }
        },
        onDataErrorOccurred: function(e) {
            dataErrors.push(e.error.message);
        }
    };

    // act
    setupDataGridModules(this, ['data', 'columns', 'editing']);

    this.editingController.getFirstEditableCellInRow = function() { return $([]); };

    this.clock.tick();

    // act
    this.editingController.addRow();
    this.editingController.saveEditData();
    // assert
    assert.deepEqual(dataErrors, ['field1 and field2 required']);
});

QUnit.test("remove error", function(assert) {
    var dataErrors = [];

    this.options = {
        dataSource: {
            key: 'field1',
            load: function() {
                return [{ field1: 1, field2: 2 }];
            },
            totalCount: function() {
                return 1;
            },
            remove: function() {
                return $.Deferred().reject('Remove error');
            }
        },
        onDataErrorOccurred: function(e) {
            dataErrors.push(e.error.message);
        },
        editing: {
            texts: {
                confirmDeleteMessage: ''
            }
        }
    };

    // act
    setupDataGridModules(this, ['data', 'columns', 'editing']);

    this.clock.tick();

    // act
    this.editingController.deleteRow(0);

    // assert
    assert.deepEqual(dataErrors, ['Remove error']);
});

QUnit.test("update error", function(assert) {
    var dataErrors = [];

    this.options = {
        columns: ["field1", { setCellValue: function(data, value) { data.field1 = value; }, allowEditing: true }],
        dataSource: {
            key: 'field1',
            load: function() {
                return [{ field1: 1, field2: 2 }];
            },
            totalCount: function() {
                return 1;
            },
            update: function() {
                return $.Deferred().reject('Update error');
            }
        },
        onDataErrorOccurred: function(e) {
            dataErrors.push(e.error.message);
        }
    };

    // act
    setupDataGridModules(this, ['data', 'columns', 'editing']);

    this.editingController.getFirstEditableCellInRow = function() { return $([]); };

    this.clock.tick();

    // act
    this.editingController.editRow(0);
    this.editingController.updateFieldValue({
        key: 1,
        column: {
            setCellValue: function(data, value) { data.field1 = value; }
        },
        value: 4
    });
    this.editingController.saveEditData();

    // assert
    assert.equal(this.editingController._editRowIndex, 0, "edit row index");
    assert.deepEqual(dataErrors, ['Update error']);
});

QUnit.module("Remote Grouping", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.setupDataGridModules = function() {
            setupDataGridModules(this, ['data', 'columns', 'filterRow', 'grouping', 'summary']);
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
});

// T320744
QUnit.test("Exception when CustomStore returns plain data and remote grouping enabled", function(assert) {
    var storeLoadOptions;
    this.options = {
        dataSource: {
            group: "name",
            load: function(options) {
                storeLoadOptions = options;
                return $.Deferred().resolve([
                    { name: 'Alex', age: 19 },
                    { name: 'Dan', age: 25 }
                ], {
                    totalCount: 10
                });
            },
            pageSize: 2
        },
        paging: {
            enabled: true
        },
        columns: ["name", "age"],
        remoteOperations: true
    };

    // act
    try {
        this.setupDataGridModules();
    } catch(e) {
        // assert
        assert.ok(e instanceof Error, "data error is Error object");

        assert.equal(e.__id, "E1037", "data error id");
        assert.equal(e.__details, "Invalid structure of grouped data", "data error details");
    }

    assert.strictEqual(storeLoadOptions.skip, undefined, "no skip option");
    assert.strictEqual(storeLoadOptions.take, undefined, "no take option");
    assert.deepEqual(storeLoadOptions.group, [{ selector: "name", desc: false, isExpanded: false }], "group option");

    assert.ok(this.dataController.isLoading());
    assert.equal(this.dataController.totalCount(), -1, "totalCount");
    assert.equal(this.dataController.pageCount(), 1, "pageCount");
});

// T366766
QUnit.test("Exception when CustomStore returns groups without items", function(assert) {
    var storeLoadOptions;
    this.options = {
        dataSource: {
            group: "name",
            load: function(options) {
                storeLoadOptions = options;
                return $.Deferred().resolve([
                    { key: 'Alex', count: 1 },
                    { key: 'Dan', count: 1 }
                ], {
                    totalCount: 10
                });
            },
            pageSize: 2
        },
        paging: {
            enabled: true
        },
        columns: ["name", "age"],
        remoteOperations: true
    };

    // act
    try {
        this.setupDataGridModules();
    } catch(e) {
        // assert
        assert.ok(e instanceof Error, "data error is Error object");

        assert.equal(e.__id, "E1037", "data error id");
        assert.equal(e.__details, "Invalid structure of grouped data", "data error details");
    }

    assert.strictEqual(storeLoadOptions.skip, undefined, "no skip option");
    assert.strictEqual(storeLoadOptions.take, undefined, "no take option");
    assert.deepEqual(storeLoadOptions.group, [{ selector: "name", desc: false, isExpanded: false }], "group option");

    assert.ok(this.dataController.isLoading());
    assert.equal(this.dataController.totalCount(), -1, "totalCount");
    assert.equal(this.dataController.pageCount(), 1, "pageCount");
});

// T317797
QUnit.test("CustomStore load options when remote grouping and paging enabled and no groups", function(assert) {
    var storeLoadOptions;
    this.options = {
        dataSource: {
            load: function(options) {
                storeLoadOptions = options;
                return $.Deferred().resolve([
                    { name: 'Alex', age: 19 },
                    { name: 'Dan', age: 25 }
                ], {
                    totalCount: 10
                });
            },
            pageSize: 2
        },
        paging: {
            enabled: true
        },
        columns: ["name", "age"],
        remoteOperations: {
            grouping: true,
            paging: true
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!storeLoadOptions.group, "no group option");
    assert.strictEqual(storeLoadOptions.skip, 0, "skip option");
    assert.strictEqual(storeLoadOptions.take, 2, "take option");
    assert.strictEqual(storeLoadOptions.requireTotalCount, true, "requireTotalCount option");
    assert.ok(!this.dataController.isLoading());
    assert.equal(this.dataController.totalCount(), 10, "totalCount");
    assert.equal(this.dataController.hasKnownLastPage(), true, "hasKnownLastPage");
    assert.equal(this.dataController.items().length, 2, "items count");
    assert.equal(this.dataController.pageCount(), 5, "pageCount");
});

// T318309
QUnit.test("CustomStore load options when remote grouping by column with serialization format", function(assert) {
    this.options = {
        dataSource: {
            group: "birthDate",
            load: function(options) {
                return $.Deferred().resolve([
                    { key: '1980/10/15', items: [{ name: 'Alex', birthDate: '1980/10/15' }] },
                    { key: '1984/1/1', items: [{ name: 'Dan', age: '1984/1/1' }] }
                ]);
            },
            pageSize: 2
        },
        columns: ["name", { dataField: "birthDate", dataType: "date" }],
        remoteOperations: {
            grouping: true
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.equal(this.dataController.totalCount(), 2, "totalCount");
    assert.equal(this.dataController.pageCount(), 1, "pageCount");
    assert.deepEqual(this.dataController.items()[0].rowType, "group", "item 1 rowType");
    assert.deepEqual(this.dataController.items()[0].key, ['1980/10/15'], "item 1 key");
    assert.deepEqual(this.dataController.items()[0].values, [new Date('1980/10/15')], "item 1 values");
    assert.deepEqual(this.dataController.items()[1].rowType, "group", "item 2 rowType");
    assert.deepEqual(this.dataController.items()[1].key, ['1984/1/1'], "item 2 key");
    assert.deepEqual(this.dataController.items()[1].values, [new Date('1984/1/1')], "item 2 values");
});

QUnit.module("Summary", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.setupDataGridModules = function(options) {
            setupDataGridModules(this, ['data', 'columns', 'filterRow', 'grouping', 'summary'], options);
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("No total summary items", function(assert) {
    this.options = {
        dataSource: [
            { name: 'Alex', age: 19 },
            { name: 'Dan', age: 25 }
        ]
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.footerItems(), []);
    assert.ok(!this.dataController.isLoading());
});

QUnit.test("CustomStore load options when remoteOperations auto and summary exists", function(assert) {
    var storeLoadOptions;
    this.options = {
        dataSource: {
            group: "name",
            load: function(options) {
                storeLoadOptions = options;
                return [
                    { name: 'Alex', age: 19 },
                    { name: 'Dan', age: 25 }
                ];
            }
        },
        summary: {
            groupItems: [{
                summaryType: "count"
            }],
            totalItems: [{
                column: 'age',
                summaryType: 'min'
            }]
        },
        remoteOperations: 'auto'
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!storeLoadOptions.skip && !storeLoadOptions.take, "no paging options");
    assert.ok(!storeLoadOptions.summary, "no summary options");
    assert.ok(!this.dataController.isLoading());
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[], [{
            value: 19,
            column: 'age',
            summaryType: 'min'
        }]]
    }], "totalFooter items");
    assert.deepEqual(this.dataController.items()[0].rowType, "group", "first row type");
    // T328430
    assert.deepEqual(this.dataController.items()[0].summaryCells, [[{ summaryType: "count", value: 1 }], []], "group summaryCells");
});

// T615903
QUnit.test("No errors if wrong extra parameter is returned in CustomStore", function(assert) {
    this.options = {
        dataSource: {
            load: function(options) {
                return $.Deferred().resolve([
                    { name: 'Alex', age: 19 },
                    { name: 'Dan', age: 25 }
                ], "success");
            }
        },
        scrolling: {
            mode: "infinite"
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.equal(this.dataController.items().length, 2, "two items are loaded");
});

QUnit.test("CustomStore load options when remote summary enabled", function(assert) {
    var storeLoadOptions;
    this.options = {
        dataSource: {
            load: function(options) {
                storeLoadOptions = options;
                return $.Deferred().resolve([
                    { name: 'Alex', age: 19 },
                    { name: 'Dan', age: 25 }
                ], {
                    totalCount: 10,
                    summary: [3]
                });
            },
            pageSize: 2
        },
        summary: {
            totalItems: [{
                column: 'age',
                summaryType: 'custom'
            }]
        },
        remoteOperations: {
            paging: true,
            summary: true
        }
    };


    var errorId;

    errors.log = function(id) {
        if(!errorId) {
            errorId = id;
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!errorId, "no errors");
    assert.strictEqual(storeLoadOptions.skip, 0, "skip option");
    assert.strictEqual(storeLoadOptions.take, 2, "take option");
    assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: "age", summaryType: "custom" }], "totalSummary option");
    assert.ok(!this.dataController.isLoading());
    assert.equal(this.dataController.totalCount(), 10, "totalCount");
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[], [{
            value: 3,
            column: 'age',
            summaryType: 'custom'
        }]]
    }], "footerItems");
});

// T607606
QUnit.test("CustomStore load options if remote summary enabled and summaryType is not defined", function(assert) {
    var storeLoadOptions;
    this.options = {
        dataSource: {
            load: function(options) {
                storeLoadOptions = options;
                return $.Deferred().resolve([
                    { name: 'Alex', age: 19 },
                    { name: 'Dan', age: 25 }
                ], {
                    totalCount: 3,
                    summary: [3]
                });
            },
            pageSize: 2
        },
        summary: {
            totalItems: [{
                column: 'age'
            }]
        },
        remoteOperations: {
            paging: true,
            summary: true
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: "age", summaryType: "count" }], "totalSummary option");
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[], [{
            value: 3,
            column: 'age'
        }]]
    }], "footerItems");
});

QUnit.test("CustomStore load options when all remoteOperations enabled and summary is defined", function(assert) {
    var storeLoadOptions;
    this.options = {
        dataSource: {
            load: function(options) {
                storeLoadOptions = options;
                return $.Deferred().resolve([
                    { name: 'Alex', age: 19 },
                    { name: 'Dan', age: 25 }
                ], {
                    totalCount: 10,
                    summary: [3]
                });
            },
            pageSize: 2
        },
        summary: {
            totalItems: [{
                column: 'age',
                summaryType: 'custom'
            }]
        },
        remoteOperations: true
    };


    var errorId;

    errors.log = function(id) {
        if(!errorId) {
            errorId = id;
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!errorId, "no errors");
    assert.strictEqual(storeLoadOptions.skip, 0, "skip option");
    assert.strictEqual(storeLoadOptions.take, 2, "take option");
    assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: "age", summaryType: "custom" }], "totalSummary option");
    assert.ok(!this.dataController.isLoading());
    assert.equal(this.dataController.totalCount(), 10, "totalCount");
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[], [{
            value: 3,
            column: 'age',
            summaryType: 'custom'
        }]]
    }], "footerItems");
});

// T306309
QUnit.test("CustomStore load options when remote summary enabled and summary is not returned", function(assert) {
    var storeLoadOptions;
    this.options = {
        dataSource: {
            load: function(options) {
                storeLoadOptions = options;
                return $.Deferred().resolve([
                    { name: 'Alex', age: 19 },
                    { name: 'Dan', age: 25 }
                ], {
                    totalCount: 10
                });
            },
            pageSize: 2
        },
        summary: {
            totalItems: [{
                column: 'age',
                summaryType: 'min'
            }]
        },
        remoteOperations: {
            paging: true,
            summary: true
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.strictEqual(storeLoadOptions.skip, 0, "skip option");
    assert.strictEqual(storeLoadOptions.take, 2, "take option");
    assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: "age", summaryType: "min" }], "summary totalItems option");
    assert.ok(!this.dataController.isLoading());
    assert.equal(this.dataController.totalCount(), 10, "totalCount");
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[], [{
            column: 'age',
            summaryType: 'min'
        }]]
    }], "footerItems");
});


// T353923
QUnit.test("CustomStore load options when remote paging/summary enabled and grouping is defined with summary.groupItems", function(assert) {
    var storeLoadOptions;
    this.options = {
        dataSource: {
            group: "name",
            load: function(options) {
                storeLoadOptions = options;
                return $.Deferred().resolve([
                    { name: 'Alex', age: 19 },
                    { name: 'Alex', age: 18 },
                    { name: 'Dan', age: 30 },
                    { name: 'Dan', age: 25 }
                ], {
                    totalCount: 10,
                    summary: [5]
                });
            },
            pageSize: 2
        },
        summary: {
            totalItems: [{
                column: 'age',
                summaryType: 'min'
            }],
            groupItems: [{
                column: 'age',
                summaryType: 'max'
            }]
        },
        paging: {
            enabled: true
        },
        remoteOperations: {
            paging: true,
            summary: true
        },
        grouping: {
            autoExpandAll: true
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.strictEqual(storeLoadOptions.skip, undefined, "skip option");
    assert.strictEqual(storeLoadOptions.take, undefined, "take option");
    assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: "age", summaryType: "min" }], "summary totalItems option");
    assert.deepEqual(storeLoadOptions.groupSummary, undefined, "summary groupItems option");
    assert.ok(!this.dataController.isLoading());
    assert.equal(this.dataController.totalCount(), 4, "totalCount");
    assert.equal(this.dataController.pageCount(), 4, "pageCount");
    assert.deepEqual(this.dataController.items().length, 2);
    assert.deepEqual(this.dataController.items()[0].data, {
        key: "Alex",
        isContinuationOnNextPage: true,
        items: [{ name: 'Alex', age: 19 }],
        aggregates: [19]
    });
    assert.deepEqual(this.dataController.items()[0].summaryCells, [[{
        column: 'age',
        columnCaption: "Age",
        summaryType: 'max',
        value: 19
    }], []]);
    assert.deepEqual(this.dataController.items()[1].data, { name: 'Alex', age: 19 });
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[], [{
            column: 'age',
            summaryType: 'min',
            value: 5
        }]]
    }], "footerItems");
});

// T353923
QUnit.test("CustomStore load options when remote paging/summary enabled and grouping is defined without summary.groupitems", function(assert) {
    var storeLoadOptions;
    this.options = {
        dataSource: {
            group: "name",
            load: function(options) {
                storeLoadOptions = options;
                return $.Deferred().resolve([
                    { name: 'Alex', age: 19 },
                    { name: 'Alex', age: 18 },
                    { name: 'Dan', age: 30 },
                    { name: 'Dan', age: 25 }
                ], {
                    totalCount: 10,
                    summary: [5]
                });
            },
            pageSize: 2
        },
        summary: {
            totalItems: [{
                column: 'age',
                summaryType: 'min'
            }]
        },
        paging: {
            enabled: true
        },
        remoteOperations: {
            paging: true,
            summary: true
        },
        grouping: {
            autoExpandAll: true
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.strictEqual(storeLoadOptions.skip, undefined, "skip option");
    assert.strictEqual(storeLoadOptions.take, undefined, "take option");
    assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: "age", summaryType: "min" }], "summary totalItems option");
    assert.deepEqual(storeLoadOptions.groupSummary, undefined, "summary groupItems option");
    assert.ok(!this.dataController.isLoading());
    assert.equal(this.dataController.totalCount(), 4, "totalCount");
    assert.equal(this.dataController.pageCount(), 4, "pageCount");
    assert.deepEqual(this.dataController.items().length, 2);
    assert.deepEqual(this.dataController.items()[0].data, {
        key: "Alex",
        isContinuationOnNextPage: true,
        items: [{ name: 'Alex', age: 19 }]
    });
    assert.deepEqual(this.dataController.items()[1].data, { name: 'Alex', age: 19 });
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[], [{
            column: 'age',
            summaryType: 'min',
            value: 5
        }]]
    }], "footerItems");
});


// T353923
QUnit.test("CustomStore load options when remote paging/sorting/filtering/summary enabled and grouping is defined without summary.groupitems", function(assert) {
    var storeLoadOptions;
    this.options = {
        dataSource: {
            group: "name",
            load: function(options) {
                storeLoadOptions = options;
                return $.Deferred().resolve([
                    { name: 'Alex', age: 19 },
                    { name: 'Alex', age: 18 },
                    { name: 'Dan', age: 30 }
                ], {
                    totalCount: 10,
                    summary: [5]
                });
            },
            pageSize: 2
        },
        summary: {
            totalItems: [{
                column: 'age',
                summaryType: 'min'
            }]
        },
        paging: {
            enabled: true
        },
        remoteOperations: {
            paging: true,
            sorting: true,
            filtering: true,
            summary: true
        },
        grouping: {
            autoExpandAll: true
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.strictEqual(storeLoadOptions.skip, 0, "skip option");
    assert.strictEqual(storeLoadOptions.take, 3, "take option");
    assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: "age", summaryType: "min" }], "summary totalItems option");
    assert.deepEqual(storeLoadOptions.groupSummary, undefined, "summary groupItems option");
    assert.ok(!this.dataController.isLoading());
    assert.equal(this.dataController.totalCount(), 10, "totalCount");
    assert.equal(this.dataController.pageCount(), 5, "pageCount");
    assert.deepEqual(this.dataController.items().length, 3);
    assert.deepEqual(this.dataController.items()[0].data, {
        key: "Alex",
        items: [{ name: 'Alex', age: 19 }, { name: 'Alex', age: 18 }]
    });
    assert.deepEqual(this.dataController.items()[1].data, { name: 'Alex', age: 19 });
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[], [{
            column: 'age',
            summaryType: 'min',
            value: 5
        }]]
    }], "footerItems");
});

// T306309, T368811
QUnit.test("CustomStore load options when remote summary enabled and summary is returned as strings", function(assert) {
    var storeLoadOptions;
    this.options = {
        dataSource: {
            load: function(options) {
                storeLoadOptions = options;
                return $.Deferred().resolve([
                    { name: 'Alex', age: 19, date: "2013-05-04T00:00:00Z" },
                    { name: 'Dan', age: 25, date: "2014-11-30T00:00:00Z" }
                ], {
                    totalCount: 10,
                    summary: ["3", "2014-11-30T00:00:00Z"]
                });
            },
            pageSize: 2
        },
        columns: ["name", "age", { dataField: "date", dataType: "date" }],
        summary: {
            totalItems: [{
                column: 'age',
                summaryType: 'min'
            }, {
                column: 'date',
                summaryType: 'max'
            }]
        },
        remoteOperations: {
            paging: true,
            summary: true
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.strictEqual(storeLoadOptions.skip, 0, "skip option");
    assert.strictEqual(storeLoadOptions.take, 2, "take option");
    assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: "age", summaryType: "min" }, { selector: "date", summaryType: "max" }], "summary totalItems option");
    assert.ok(!this.dataController.isLoading());
    assert.equal(this.dataController.totalCount(), 10, "totalCount");
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[], [{
            value: 3,
            column: 'age',
            summaryType: 'min'
        }], [{
            value: new Date("2014-11-30T00:00:00Z"),
            valueFormat: "shortDate",
            column: 'date',
            summaryType: 'max'
        }]]
    }], "footerItems");
});


QUnit.test("CustomStore load options when remote summary and remote grouping without paging enabled", function(assert) {
    var storeLoadOptions;
    this.options = {
        dataSource: {
            group: "name",
            load: function(options) {
                storeLoadOptions = options;
                return $.Deferred().resolve([
                    { key: 'Alex', items: [{ name: 'Alex', age: 19 }], summary: [1] },
                    { key: 'Dan', items: [{ name: 'Dan', age: 25 }], summary: [2] }
                ], {
                    summary: [3]
                });
            },
            pageSize: 2
        },
        paging: {
            enabled: true
        },
        columns: ["name", "age"],
        summary: {
            totalItems: [{
                column: 'age',
                summaryType: 'min'
            }],
            groupItems: [{
                column: 'age',
                summaryType: 'count'
            }]
        },
        remoteOperations: {
            grouping: true,
            summary: true
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.strictEqual(storeLoadOptions.skip, undefined, "no skip option");
    assert.strictEqual(storeLoadOptions.take, undefined, "no take option");
    assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: "age", summaryType: "min" }], "summary totalItems option");
    assert.deepEqual(storeLoadOptions.groupSummary, [{ selector: "age", summaryType: "count" }], "summary groupItems option");
    assert.ok(!this.dataController.isLoading());
    assert.equal(this.dataController.totalCount(), 2, "totalCount");
    assert.equal(this.dataController.pageCount(), 1, "pageCount");
    assert.deepEqual(this.dataController.items()[0].summaryCells, [[{
        column: "age",
        columnCaption: "Age",
        summaryType: "count",
        value: 1
    }], []], "summary cells");
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[], [{
            value: 3,
            column: 'age',
            summaryType: 'min'
        }]]
    }], "footerItems");
});

QUnit.test("CustomStore load options when remote summary and remote grouping and paging enabled", function(assert) {
    var storeLoadOptions;
    this.options = {
        dataSource: {
            group: "name",
            load: function(options) {
                storeLoadOptions = options;
                return $.Deferred().resolve([
                    { key: 'Alex', items: [{ name: 'Alex', age: 19 }], summary: [1] },
                    { key: 'Dan', items: [{ name: 'Dan', age: 25 }], summary: [2] }
                ], {
                    totalCount: 10,
                    summary: [3]
                });
            },
            pageSize: 2
        },
        paging: {
            enabled: true
        },
        columns: ["name", "age"],
        summary: {
            totalItems: [{
                column: 'age',
                summaryType: 'min'
            }],
            groupItems: [{
                column: 'age',
                summaryType: 'count'
            }]
        },
        remoteOperations: {
            grouping: true,
            paging: true,
            summary: true
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.strictEqual(storeLoadOptions.skip, undefined, "no skip option");
    assert.strictEqual(storeLoadOptions.take, undefined, "no take option");
    assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: "age", summaryType: "min" }], "summary totalItems option");
    assert.deepEqual(storeLoadOptions.groupSummary, [{ selector: "age", summaryType: "count" }], "summary groupItems option");
    assert.ok(!this.dataController.isLoading());
    assert.equal(this.dataController.totalCount(), 2, "totalCount");
    assert.equal(this.dataController.pageCount(), 1, "pageCount");
    assert.deepEqual(this.dataController.items()[0].summaryCells, [[{
        column: "age",
        columnCaption: "Age",
        summaryType: "count",
        value: 1
    }], []], "summary cells");
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[], [{
            value: 3,
            column: 'age',
            summaryType: 'min'
        }]]
    }], "footerItems");
});

QUnit.test("CustomStore load options when remote operations enabled and grouping with sort by summary info is defined", function(assert) {
    var storeLoadOptions;
    this.options = {
        dataSource: {
            group: "group",
            key: "id",
            load: function(options) {
                storeLoadOptions = options;
                if(options.group) {
                    return $.Deferred().resolve([
                        { key: 'Group0', items: null, count: 2, summary: [2] },
                        { key: 'Group1', items: null, count: 1, summary: [1] }
                    ], {
                        totalCount: 3
                    });
                } else {
                    return $.Deferred().resolve([
                        { id: 0, group: "Group0" },
                        { id: 1, group: "Group0" },
                        { id: 2, group: "Group1" }
                    ]);
                }
            },
            pageSize: 4
        },
        paging: {
            enabled: true
        },
        grouping: {
            autoExpandAll: true
        },
        columns: [ "id", "group" ],
        sortByGroupSummaryInfo: [{
            summaryItem: "count"
        }],
        summary: {
            groupItems: [{
                summaryType: "count"
            }]
        },
        remoteOperations: true
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.strictEqual(storeLoadOptions.skip, undefined, "no skip option");
    assert.strictEqual(storeLoadOptions.take, undefined, "no take option");
    assert.deepEqual(storeLoadOptions.filter, [["group", "=", "Group1"], "or", ["group", "=", "Group0"]], "filter option");
    assert.deepEqual(storeLoadOptions.sort, [{ "desc": false, "isExpanded": true, "selector": "group" }], "sort option");
    assert.equal(this.dataController.totalCount(), 3, "totalCount");
    assert.equal(this.dataController.pageCount(), 2, "pageCount");
    var items = this.dataController.items();
    assert.equal(items.length, 4, "item count");
    assert.deepEqual(items[0].key, ["Group1"], "item 0");
    assert.equal(items[1].key, 2, "item 1");
    assert.deepEqual(items[2].key, ["Group0"], "item 2");
    assert.equal(items[3].key, 0, "item 3");
});

QUnit.test("CustomStore load options when remote operations enabled and multi-grouping with sort by summary info is defined", function(assert) {
    var storeLoadOptions;
    this.options = {
        dataSource: {
            group: ["group1", "group2"],
            key: "id",
            load: function(options) {
                storeLoadOptions = options;
                if(options.group) {
                    return $.Deferred().resolve([
                        { key: 'Group0', items: [{ key: "Group0_0", items: null, count: 2, summary: [2] }], count: 2, summary: [2] },
                        { key: 'Group1', items: [{ key: "Group1_0", items: null, count: 1, summary: [1] }], count: 1, summary: [1] }
                    ], {
                        totalCount: 3
                    });
                } else {
                    return $.Deferred().resolve([
                        { id: 0, group1: "Group0", group2: "Group0_0" },
                        { id: 1, group1: "Group0", group2: "Group0_0" },
                        { id: 2, group1: "Group1", group2: "Group1_0" }
                    ]);
                }
            },
            pageSize: 6
        },
        paging: {
            enabled: true
        },
        grouping: {
            autoExpandAll: true
        },
        columns: ["id", "group1", "group2"],
        sortByGroupSummaryInfo: [{
            summaryItem: "count"
        }],
        summary: {
            groupItems: [{
                summaryType: "count"
            }]
        },
        remoteOperations: true
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.strictEqual(storeLoadOptions.skip, undefined, "no skip option");
    assert.strictEqual(storeLoadOptions.take, undefined, "no take option");
    assert.deepEqual(storeLoadOptions.filter,
        [[["group1", "=", "Group1"], "and", ["group2", "=", "Group1_0"]], "or", [["group1", "=", "Group0"], "and", ["group2", "=", "Group0_0"]]], "filter option");
    assert.deepEqual(storeLoadOptions.sort,
        [{ "desc": false, "isExpanded": true, "selector": "group1" }, { "desc": false, "isExpanded": true, "selector": "group2" }], "sort option");
    assert.equal(this.dataController.totalCount(), 3, "totalCount");
    assert.equal(this.dataController.pageCount(), 2, "pageCount");
    var items = this.dataController.items();
    assert.equal(items.length, 6, "item count");
    assert.deepEqual(items[0].key, ["Group1"], "item 0");
    assert.deepEqual(items[1].key, ["Group1", "Group1_0"], "item 1");
    assert.equal(items[2].key, 2, "item 2");
    assert.deepEqual(items[3].key, ["Group0"], "item 3");
    assert.deepEqual(items[4].key, ["Group0", "Group0_0"], "item 4");
});


QUnit.test("One total summary item for second column", function(assert) {
    this.options = {
        dataSource: [
            { name: 'Alex', age: 19 },
            { name: 'Dan', age: 25 }
        ],
        summary: {
            totalItems: [{
                column: 'age',
                summaryType: 'min'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[], [{
            value: 19,
            column: 'age',
            summaryType: 'min'
        }]]
    }]);
    assert.ok(!this.dataController.isLoading());
});

QUnit.test("Filtering on column with dataType when summary is defined", function(assert) {
    this.options = {
        columns: ["name", { dataField: "birthDate", dataType: "date", filterValue: new Date('1987/5/5') }],
        dataSource: [
            { name: 'Alex', birthDate: '1987/5/5' },
            { name: 'Dan', birthDate: '1985/3/21' }
        ],
        remoteOperations: "auto",
        summary: {
            totalItems: [{
                showInColumn: 'birthDate',
                summaryType: 'count'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.items().length, 1);
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[], [{
            value: 1,
            showInColumn: 'birthDate',
            summaryType: 'count'
        }]]
    }]);
    assert.ok(!this.dataController.isLoading());
});

QUnit.test("Total summary items when number in string format", function(assert) {
    this.options = {
        dataSource: [
            { name: 'Alex', age: '19' },
            { name: 'Dan', age: '25' }
        ],
        summary: {
            totalItems: [{
                column: 'age',
                summaryType: 'avg'
            },
            {
                column: 'age',
                summaryType: 'sum'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[], [{
            value: 22,
            column: 'age',
            summaryType: 'avg'
        }, {
            value: 44,
            column: 'age',
            summaryType: 'sum'
        }]
        ]
    }]);
    assert.ok(!this.dataController.isLoading());
});

QUnit.test("Several total summary items in one column", function(assert) {
    this.options = {
        dataSource: [
            { name: 'Alex', age: 19 },
            { name: 'Dan', age: 25 }
        ],
        summary: {
            totalItems: [{
                column: 'age',
                summaryType: 'min'
            },
            {
                column: 'age',
                summaryType: 'max'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[], [{
            value: 19,
            column: 'age',
            summaryType: 'min'
        },
        {
            value: 25,
            column: 'age',
            summaryType: 'max'
        }]
        ]
    }]);
    assert.ok(!this.dataController.isLoading());
});

// T351922
QUnit.test("skip empty values for total summary items", function(assert) {
    // act
    this.setupDataGridModules({
        initDefaultOptions: true,
        options: {
            dataSource: [
                { name: 'Alex', age: 19 },
                { name: 'Dan', age: 25 },
                { name: 'Max', age: null },
                { name: 'Bob', age: null }
            ],
            summary: {
                totalItems: [{
                    column: 'age',
                    summaryType: 'avg'
                },
                {
                    column: 'age',
                    summaryType: 'avg',
                    skipEmptyValues: false
                }]
            }
        }
    });
    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[], [{
            value: 22,
            column: 'age',
            summaryType: 'avg'
        },
        {
            value: 11,
            column: 'age',
            summaryType: 'avg',
            skipEmptyValues: false
        }]
        ]
    }]);
    assert.ok(!this.dataController.isLoading());
});

// T351922
QUnit.test("skip empty values for total summary items when common skipEmptyValues false", function(assert) {
    // act
    this.setupDataGridModules({
        initDefaultOptions: true,
        options: {
            dataSource: [
                { name: 'Alex', age: 19 },
                { name: 'Dan', age: 25 },
                { name: 'Max', age: null },
                { name: 'Bob', age: null }
            ],
            summary: {
                skipEmptyValues: false,
                totalItems: [{
                    column: 'age',
                    summaryType: 'avg'
                },
                {
                    column: 'age',
                    summaryType: 'avg',
                    skipEmptyValues: true
                }]
            }
        }
    });
    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[], [{
            value: 11,
            column: 'age',
            summaryType: 'avg'
        },
        {
            value: 22,
            column: 'age',
            summaryType: 'avg',
            skipEmptyValues: true
        }]
        ]
    }]);
    assert.ok(!this.dataController.isLoading());
});

QUnit.test("total summary item show in other column", function(assert) {
    this.options = {
        dataSource: [
            { name: 'Alex', age: 19 },
            { name: 'Dan', age: 25 }
        ],
        summary: {
            totalItems: [{
                column: 'age',
                showInColumn: 'name',
                summaryType: 'min'
            },
            {
                column: 'age',
                summaryType: 'max'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[{
            value: 19,
            column: 'age',
            columnCaption: 'Age',
            showInColumn: 'name',
            summaryType: 'min'
        }], [{
            value: 25,
            column: 'age',
            summaryType: 'max'
        }]]
    }]);
    assert.ok(!this.dataController.isLoading());
});

QUnit.test("total summary for column with showWhenGrouped", function(assert) {
    this.options = {
        columns: [{ dataField: 'name', showWhenGrouped: true, groupIndex: 0 }, 'age'],
        dataSource: {
            group: "name",
            store: [
                { name: 'Alex', age: 19 },
                { name: 'Dan', age: 25 }
            ]
        },
        summary: {
            totalItems: [{
                column: 'age',
                showInColumn: 'name',
                summaryType: 'min'
            },
            {
                column: 'age',
                summaryType: 'max'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[{
            column: "age",
            columnCaption: "Age",
            showInColumn: "name",
            summaryType: "min",
            value: 19
        }], [{
            value: 19,
            column: 'age',
            columnCaption: 'Age',
            showInColumn: 'name',
            summaryType: 'min'
        }], [{
            value: 25,
            column: 'age',
            summaryType: 'max'
        }]]
    }]);
});

QUnit.test("total summary for one summary item if it has group index", function(assert) {
    this.options = {
        columns: ['name', 'age'],
        dataSource: {
            group: "name",
            store: [
                { name: 'Alex', age: 19 },
                { name: 'Dan', age: 25 }
            ]
        },
        summary: {
            totalItems: [{
                column: 'name',
                summaryType: 'count'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.footerItems(), []);
});

QUnit.test("Several total summary items in different column", function(assert) {
    this.options = {
        dataSource: [
            { name: 'Alex', age: 19 },
            { name: 'Dan', age: 25 }
        ],
        summary: {
            totalItems: [{
                column: 'name',
                summaryType: 'count'
            },
            {
                column: 'age',
                summaryType: 'max'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[{
            value: 2,
            column: 'name',
            summaryType: 'count'
        }], [{
            value: 25,
            column: 'age',
            summaryType: 'max'
        }]
        ]
    }]);
    assert.ok(!this.dataController.isLoading());
});

QUnit.test("total summary item with incorrect column", function(assert) {
    this.options = {
        dataSource: [
            { name: 'Alex', age: 19 },
            { name: 'Dan', age: 25 }
        ],
        summary: {
            totalItems: [{
                column: 'incorrectName',
                summaryType: 'count'
            },
            {
                column: 'age',
                summaryType: 'max'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[], [{
            value: 25,
            column: 'age',
            summaryType: 'max'
        }]]
    }]);
    assert.ok(!this.dataController.isLoading());
});

QUnit.test("total custom summary when calculateCustomSummary not implemented", function(assert) {
    this.options = {
        dataSource: [
            { name: 'Alex', age: 19 },
            { name: 'Alex', age: 23 },
            { name: 'Dan', age: 25 }
        ],
        summary: {
            totalItems: [{
                column: 'name',
                summaryType: 'count'
            }, {
                showInColumn: 'age',
                summaryType: 'custom'
            }]
        }
    };

    var errorId;

    errors.log = function(id) {
        if(!errorId) {
            errorId = id;
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.equal(errorId, 'E1026', 'error message');
    assert.ok(!this.dataController.isLoading());
});

QUnit.test("total custom summary", function(assert) {
    this.options = {
        dataSource: [
            { name: 'Alex', age: 19 },
            { name: 'Alex', age: 23 },
            { name: 'Dan', age: 25 }
        ],
        summary: {
            totalItems: [{
                column: 'name',
                summaryType: 'count'
            }, {
                name: 'AlexAvgAge',
                showInColumn: 'age',
                summaryType: 'custom'
            }],
            calculateCustomSummary: function(options) {
                if(options.name === 'AlexAvgAge') {
                    if(options.summaryProcess === 'start') {
                        options.totalValue = [0, 0];
                    }
                    if(options.summaryProcess === 'calculate') {
                        if(options.value.name === 'Alex') {
                            options.totalValue = [options.totalValue[0] + options.value.age, options.totalValue[1] + 1];
                        }
                    }
                    if(options.summaryProcess === 'finalize') {
                        options.totalValue = options.totalValue[0] / options.totalValue[1];
                    }
                }
            }
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[{
            value: 3,
            column: 'name',
            summaryType: 'count'
        }], [{
            name: 'AlexAvgAge',
            value: 21,
            showInColumn: 'age',
            summaryType: 'custom'
        }]]
    }]);
    assert.ok(!this.dataController.isLoading());
});

QUnit.test("total custom summary by selection", function(assert) {
    this.options = {
        dataSource: [
            { name: 'Alex', age: 19 },
            { name: 'Alex', age: 23 },
            { name: 'Dan', age: 25 }
        ],
        summary: {
            totalItems: [{
                name: 'SelectedAvgAge',
                showInColumn: 'age',
                summaryType: 'custom'
            }],
            calculateCustomSummary: function(options) {
                if(options.name === 'SelectedAvgAge') {
                    if(options.summaryProcess === 'start') {
                        options.totalValue = [0, 0];
                    }
                    if(options.summaryProcess === 'calculate') {
                        if(options.component.isRowSelected(options.value)) {
                            options.totalValue = [options.totalValue[0] + options.value.age, options.totalValue[1] + 1];
                        }
                    }
                    if(options.summaryProcess === 'finalize') {
                        options.totalValue = options.totalValue[0] / options.totalValue[1];
                    }
                }
            }
        },
        selectedRowKeys: [{ name: 'Alex', age: 23 }, { name: 'Dan', age: 25 }]
    };

    // act
    setupDataGridModules(this, ['data', 'columns', 'selection', 'summary']);
    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[], [{
            name: 'SelectedAvgAge',
            value: 24,
            showInColumn: 'age',
            summaryType: 'custom'
        }]]
    }]);
    assert.ok(!this.dataController.isLoading());
});

QUnit.test("Several total summary items in different column", function(assert) {
    this.options = {
        dataSource: [
            { name: 'Alex', age: 19 },
            { name: 'Dan', age: 25 }
        ],
        summary: {
            totalItems: [{
                column: 'name',
                summaryType: 'count'
            },
            {
                column: 'age',
                summaryType: 'max'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[{
            value: 2,
            column: 'name',
            summaryType: 'count'
        }], [{
            value: 25,
            column: 'age',
            summaryType: 'max'
        }]
        ]
    }]);
    assert.ok(!this.dataController.isLoading());
});

QUnit.test("Changing total summary items", function(assert) {
    this.options = {
        dataSource: [
            { name: 'Alex', age: 19 },
            { name: 'Dan', age: 25 }
        ],
        summary: {
            totalItems: [{
                column: 'name',
                summaryType: 'count'
            }]
        }
    };

    this.setupDataGridModules();
    this.clock.tick();

    // act
    this.options.summary.totalItems.push({
        column: 'age',
        summaryType: 'max'
    });

    this.dataController.optionChanged({ name: 'summary' });
    this.clock.tick();


    // assert
    assert.deepEqual(this.dataController.footerItems(), [{
        rowType: 'totalFooter', summaryCells: [[{
            value: 2,
            column: 'name',
            summaryType: 'count'
        }], [{
            value: 25,
            column: 'age',
            summaryType: 'max'
        }]
        ]
    }]);
    assert.ok(!this.dataController.isLoading());
});

QUnit.test("group summary item in group cell", function(assert) {
    this.options = {
        columns: ['name', 'age'],
        dataSource: {
            group: 'name',
            store: [
                { name: 'Alex', age: 19 },
                { name: 'Alex', age: 15 },
                { name: 'Dan', age: 25 }
            ]
        },
        summary: {
            groupItems: [{
                column: 'age',
                summaryType: 'min'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!this.dataController.isLoading());
    assert.strictEqual(this.dataController.items().length, 2);
    assert.deepEqual(this.dataController.items()[0].summaryCells, [[{
        value: 15,
        column: 'age',
        columnCaption: 'Age',
        summaryType: 'min'
    }], []]);
    assert.deepEqual(this.dataController.items()[1].summaryCells, [[{
        value: 25,
        columnCaption: 'Age',
        column: 'age',
        summaryType: 'min'
    }], []]);
});

QUnit.test("Group footer is hidden when group summary is defined a for one a grouped column", function(assert) {
    this.options = {
        columns: [{ dataField: 'name', groupIndex: 0 }, 'age'],
        grouping: {
            autoExpandAll: true
        },
        dataSource: {
            group: "name",
            store: [
                { name: 'Alex', age: 19 },
                { name: 'Alex', age: 15 },
                { name: 'Dan', age: 25 }
            ]
        },
        summary: {
            groupItems: [{
                column: 'name',
                summaryType: 'count',
                showInGroupFooter: true
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.strictEqual(this.dataController.items().length, 5);
    assert.equal(this.dataController.items()[0].rowType, "group");
    assert.equal(this.dataController.items()[1].rowType, "data");
    assert.equal(this.dataController.items()[2].rowType, "data");
    assert.equal(this.dataController.items()[3].rowType, "group");
    assert.equal(this.dataController.items()[4].rowType, "data");
});

QUnit.test("Show summary value in group footer when showWhenGrouped is true for grouped column", function(assert) {
    this.options = {
        columns: [{ dataField: 'name', groupIndex: 0, showWhenGrouped: true }, 'age'],
        grouping: {
            autoExpandAll: true
        },
        dataSource: {
            group: "name",
            store: [
                { name: 'Alex', age: 19 },
                { name: 'Alex', age: 15 },
                { name: 'Dan', age: 25 }
            ]
        },
        summary: {
            groupItems: [{
                column: 'name',
                summaryType: 'count',
                showInGroupFooter: true
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.strictEqual(this.dataController.items().length, 7);
    assert.equal(this.dataController.items()[0].rowType, "group");
    assert.equal(this.dataController.items()[1].rowType, "data");
    assert.equal(this.dataController.items()[2].rowType, "data");
    assert.equal(this.dataController.items()[3].rowType, "groupFooter");
    assert.equal(this.dataController.items()[4].rowType, "group");
    assert.equal(this.dataController.items()[5].rowType, "data");
    assert.equal(this.dataController.items()[6].rowType, "groupFooter");
});

QUnit.test("group sorting by summary", function(assert) {
    this.options = {
        columns: ['name', 'age'],
        dataSource: {
            group: 'name',
            store: [
                { name: 'Dan', age: 19 },
                { name: 'Sam', age: 18 },
                { name: 'Sam', age: 19 },
                { name: 'Sam', age: 20 },
                { name: 'Alex', age: 15 },
                { name: 'Alex', age: 25 }
            ]
        },
        sortByGroupSummaryInfo: [{
            summaryItem: 'count'
        }],
        summary: {
            groupItems: [{
                summaryType: 'count'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!this.dataController.isLoading());
    assert.strictEqual(this.dataController.items().length, 3);
    assert.deepEqual(this.dataController.items()[0].data.key, 'Dan');
    assert.deepEqual(this.dataController.items()[0].summaryCells[0][0].value, 1);
    assert.deepEqual(this.dataController.items()[1].data.key, 'Alex');
    assert.deepEqual(this.dataController.items()[1].summaryCells[0][0].value, 2);
    assert.deepEqual(this.dataController.items()[2].data.key, 'Sam');
    assert.deepEqual(this.dataController.items()[2].summaryCells[0][0].value, 3);
});

// T526028
QUnit.test("group sorting by summary if remoteOperations option is enabled", function(assert) {
    this.options = {
        columns: ['name', 'age'],
        remoteOperations: true,
        dataSource: {
            group: 'name',
            load: function(options) {
                return $.Deferred().resolve([
                    { key: "Dan", summary: [1], items: null, count: 1 },
                    { key: "Sam", summary: [3], items: null, count: 3 },
                    { key: "Alex", summary: [2], items: null, count: 2 },
                ]);
            }
        },
        sortByGroupSummaryInfo: [{
            summaryItem: 'count'
        }],
        summary: {
            groupItems: [{
                summaryType: 'count'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!this.dataController.isLoading());
    assert.strictEqual(this.dataController.items().length, 3);
    assert.deepEqual(this.dataController.items()[0].data.key, 'Dan');
    assert.deepEqual(this.dataController.items()[0].summaryCells[0][0].value, 1);
    assert.deepEqual(this.dataController.items()[1].data.key, 'Alex');
    assert.deepEqual(this.dataController.items()[1].summaryCells[0][0].value, 2);
    assert.deepEqual(this.dataController.items()[2].data.key, 'Sam');
    assert.deepEqual(this.dataController.items()[2].summaryCells[0][0].value, 3);
});

QUnit.test("group sorting by summary when change grouping", function(assert) {
    this.options = {
        columns: ['name', 'age'],
        dataSource: {
            store: [
                { name: 'Dan', age: 19 },
                { name: 'Sam', age: 18 },
                { name: 'Sam', age: 19 },
                { name: 'Sam', age: 20 },
                { name: 'Alex', age: 15 },
                { name: 'Alex', age: 25 }
            ]
        },
        sortByGroupSummaryInfo: [{
            summaryItem: 'count',
            groupColumn: 'name'
        }],
        summary: {
            groupItems: [{
                summaryType: 'count'
            }]
        }
    };

    this.setupDataGridModules();
    this.clock.tick();

    // act
    this.columnsController.columnOption('name', 'groupIndex', 0);

    // assert
    assert.ok(!this.dataController.isLoading());
    assert.strictEqual(this.dataController.items().length, 3);
    assert.deepEqual(this.dataController.items()[0].data.key, 'Dan');
    assert.deepEqual(this.dataController.items()[0].summaryCells[0][0].value, 1);
    assert.deepEqual(this.dataController.items()[1].data.key, 'Alex');
    assert.deepEqual(this.dataController.items()[1].summaryCells[0][0].value, 2);
    assert.deepEqual(this.dataController.items()[2].data.key, 'Sam');
    assert.deepEqual(this.dataController.items()[2].summaryCells[0][0].value, 3);
});

QUnit.test("Changing sortByGroupSummaryInfo", function(assert) {
    this.options = {
        columns: ['name', 'age'],
        dataSource: {
            group: 'name',
            store: [
                { name: 'Dan', age: 19 },
                { name: 'Sam', age: 18 },
                { name: 'Sam', age: 19 },
                { name: 'Sam', age: 20 },
                { name: 'Alex', age: 15 },
                { name: 'Alex', age: 25 }
            ]
        },
        summary: {
            groupItems: [{
                summaryType: 'count'
            }]
        }
    };

    this.setupDataGridModules();
    this.clock.tick();

    // act
    this.options.sortByGroupSummaryInfo = [{
        summaryItem: 'count'
    }];

    this.dataController.optionChanged({ name: 'sortByGroupSummaryInfo' });
    this.clock.tick();


    // assert
    assert.ok(!this.dataController.isLoading());
    assert.strictEqual(this.dataController.items().length, 3);
    assert.deepEqual(this.dataController.items()[0].data.key, 'Dan');
    assert.deepEqual(this.dataController.items()[0].summaryCells[0][0].value, 1);
    assert.deepEqual(this.dataController.items()[1].data.key, 'Alex');
    assert.deepEqual(this.dataController.items()[1].summaryCells[0][0].value, 2);
    assert.deepEqual(this.dataController.items()[2].data.key, 'Sam');
    assert.deepEqual(this.dataController.items()[2].summaryCells[0][0].value, 3);
});

QUnit.test("group sorting by summary when several columns grouped", function(assert) {
    this.options = {
        columns: ['name', 'age'],
        dataSource: {
            group: ['name', 'age'],
            store: [
                { name: 'Dan', age: 19 },
                { name: 'Sam', age: 18 },
                { name: 'Sam', age: 19 },
                { name: 'Sam', age: 20 },
                { name: 'Alex', age: 15 },
                { name: 'Alex', age: 25 }
            ]
        },
        grouping: {
            autoExpandAll: true
        },
        sortByGroupSummaryInfo: [{
            groupColumn: 'name',
            summaryItem: 'count',
            sortOrder: 'desc'
        }, {
            groupColumn: 'age',
            summaryItem: 'max',
            sortOrder: 'desc'
        }],
        summary: {
            groupItems: [{
                summaryType: 'count'
            }, {
                column: 'age',
                summaryType: 'max'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!this.dataController.isLoading());
    assert.deepEqual(this.dataController.items()[0].data.key, 'Sam');
    assert.deepEqual(this.dataController.items()[0].summaryCells[0][0].value, 3);
    assert.deepEqual(this.dataController.items()[1].data.key, 20);
    assert.deepEqual(this.dataController.items()[1].summaryCells[1][1].value, 20);
});

QUnit.test("group sorting by first summary", function(assert) {
    this.options = {
        columns: ['name', 'age'],
        dataSource: {
            group: 'name',
            store: [
                { name: 'Dan', age: 19 },
                { name: 'Sam', age: 18 },
                { name: 'Sam', age: 19 },
                { name: 'Sam', age: 20 },
                { name: 'Alex', age: 15 },
                { name: 'Alex', age: 25 }
            ]
        },
        sortByGroupSummaryInfo: [{
            summaryItem: 0
        }],
        summary: {
            groupItems: [{
                summaryType: 'count'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!this.dataController.isLoading());
    assert.strictEqual(this.dataController.items().length, 3);
    assert.deepEqual(this.dataController.items()[0].data.key, 'Dan');
    assert.deepEqual(this.dataController.items()[0].summaryCells[0][0].value, 1);
    assert.deepEqual(this.dataController.items()[1].data.key, 'Alex');
    assert.deepEqual(this.dataController.items()[1].summaryCells[0][0].value, 2);
    assert.deepEqual(this.dataController.items()[2].data.key, 'Sam');
    assert.deepEqual(this.dataController.items()[2].summaryCells[0][0].value, 3);
});

QUnit.test("findSummaryItem by custom name", function(assert) {
    var summaryItems = [{
        name: 'testCount1',
        summaryType: 'count'
    }, {
        name: 'testCount2',
        summaryType: 'count'
    }, {
        name: 'testMin',
        summaryType: 'min',
        column: 'testField'
    }];

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.strictEqual(this.dataController._findSummaryItem(summaryItems, 'count'), 0, 'find by summaryType');
    assert.strictEqual(this.dataController._findSummaryItem(summaryItems, 'testField'), 2, 'find by column name');
    assert.strictEqual(this.dataController._findSummaryItem(summaryItems, 'min_testField'), 2, 'find by summary type+column name');
    assert.strictEqual(this.dataController._findSummaryItem(summaryItems, 'testCount2'), 1, 'find by name');
    assert.strictEqual(this.dataController._findSummaryItem(summaryItems, 1), 1, 'find by summary item index');
    assert.strictEqual(this.dataController._findSummaryItem(summaryItems, 'test3'), -1, 'find by wrong name');
});

QUnit.test("group sorting by summary sortOrder desc", function(assert) {
    this.options = {
        columns: ['name', 'age'],
        dataSource: {
            group: 'name',
            store: [
                { name: 'Dan', age: 19 },
                { name: 'Sam', age: 18 },
                { name: 'Sam', age: 19 },
                { name: 'Sam', age: 20 },
                { name: 'Alex', age: 15 },
                { name: 'Alex', age: 25 }
            ]
        },
        sortByGroupSummaryInfo: [{
            summaryItem: 'count',
            sortOrder: 'desc'
        }],
        summary: {
            groupItems: [{
                summaryType: 'count'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!this.dataController.isLoading());
    assert.strictEqual(this.dataController.items().length, 3);
    assert.deepEqual(this.dataController.items()[0].data.key, 'Sam');
    assert.deepEqual(this.dataController.items()[0].summaryCells[0][0].value, 3);
    assert.deepEqual(this.dataController.items()[1].data.key, 'Alex');
    assert.deepEqual(this.dataController.items()[1].summaryCells[0][0].value, 2);
    assert.deepEqual(this.dataController.items()[2].data.key, 'Dan');
    assert.deepEqual(this.dataController.items()[2].summaryCells[0][0].value, 1);
});

QUnit.test("group sorting by several summaries", function(assert) {
    this.options = {
        columns: ['name', 'age'],
        dataSource: {
            group: 'name',
            store: [
                { name: 'Dan', age: 19 },
                { name: 'Alex', age: 15 },
                { name: 'Alex', age: 25 },
                { name: 'Sam', age: 18 },
                { name: 'Sam', age: 19 }
            ]
        },
        sortByGroupSummaryInfo: [{
            summaryItem: 'count',
            sortOrder: 'desc'
        }, {
            summaryItem: 'max',
            sortOrder: 'asc'
        }],
        summary: {
            groupItems: [{
                summaryType: 'count'
            }, {
                column: 'age',
                summaryType: 'max'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!this.dataController.isLoading());
    assert.strictEqual(this.dataController.items().length, 3);
    assert.deepEqual(this.dataController.items()[0].data.key, 'Sam');
    assert.deepEqual(this.dataController.items()[0].summaryCells[0][0].value, 2);
    assert.deepEqual(this.dataController.items()[0].summaryCells[0][1].value, 19);
    assert.deepEqual(this.dataController.items()[1].data.key, 'Alex');
    assert.deepEqual(this.dataController.items()[1].summaryCells[0][0].value, 2);
    assert.deepEqual(this.dataController.items()[1].summaryCells[0][1].value, 25);
    assert.deepEqual(this.dataController.items()[2].data.key, 'Dan');
    assert.deepEqual(this.dataController.items()[2].summaryCells[0][0].value, 1);
});

QUnit.test("group sorting groupColumn fo grouped column only", function(assert) {
    this.options = {
        columns: ['name', 'age'],
        dataSource: {
            group: 'name',
            store: [
                { name: 'Dan', age: 19 },
                { name: 'Alex', age: 15 },
                { name: 'Alex', age: 25 },
                { name: 'Sam', age: 18 },
                { name: 'Sam', age: 19 }
            ]
        },
        sortByGroupSummaryInfo: [{
            groupColumn: 'name',
            summaryItem: 'count',
            sortOrder: 'desc'
        }, {
            groupColumn: 'age',
            summaryItem: 'max',
            sortOrder: 'asc'
        }],
        summary: {
            groupItems: [{
                summaryType: 'count'
            }, {
                column: 'age',
                summaryType: 'max'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!this.dataController.isLoading());
    assert.strictEqual(this.dataController.items().length, 3);
    assert.deepEqual(this.dataController.items()[0].data.key, 'Alex');
    assert.deepEqual(this.dataController.items()[0].summaryCells[0][0].value, 2);
    assert.deepEqual(this.dataController.items()[0].summaryCells[0][1].value, 25);
    assert.deepEqual(this.dataController.items()[1].data.key, 'Sam');
    assert.deepEqual(this.dataController.items()[1].summaryCells[0][0].value, 2);
    assert.deepEqual(this.dataController.items()[1].summaryCells[0][1].value, 19);
    assert.deepEqual(this.dataController.items()[2].data.key, 'Dan');
    assert.deepEqual(this.dataController.items()[2].summaryCells[0][0].value, 1);
});

QUnit.test("group custom summary item", function(assert) {
    var startCount = 0,
        calculateCount = 0,
        finalizeCount = 0;

    var totalValue;
    this.options = {
        columns: ['name', 'age'],
        dataSource: {
            group: 'name',
            store: [
                { name: 'Alex', age: 19 },
                { name: 'Alex', age: 20 },
                { name: 'Alex', age: 15 },
                { name: 'Dan', age: 25 }
            ]
        },
        summary: {
            groupItems: [{
                name: 'CountFromAge18',
                summaryType: 'custom'
            }],
            calculateCustomSummary: function(options) {
                if(options.name === 'CountFromAge18') {
                    if(options.summaryProcess === 'start') {
                        startCount++;
                        totalValue = 0;
                    }
                    if(options.summaryProcess === 'calculate') {
                        calculateCount++;
                        if(options.value.age >= 18) {
                            totalValue++;
                        }
                    }
                    if(options.summaryProcess === 'finalize') {
                        finalizeCount++;
                        options.totalValue = totalValue;
                    }
                }
            }
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!this.dataController.isLoading());
    assert.strictEqual(this.dataController.items().length, 2);
    assert.deepEqual(this.dataController.items()[0].summaryCells, [[{
        value: 2,
        name: 'CountFromAge18',
        summaryType: 'custom'
    }], []]);
    assert.deepEqual(this.dataController.items()[1].summaryCells, [[{
        value: 1,
        name: 'CountFromAge18',
        summaryType: 'custom'
    }], []]);

    // T278115
    assert.strictEqual(startCount, 2, "start count");
    assert.strictEqual(calculateCount, 4, "calculate count");
    assert.strictEqual(finalizeCount, 2, "finalize count");
});

QUnit.test("group summary item alignByColumn", function(assert) {
    this.options = {
        dataSource: {
            group: 'name',
            store: [
                { id: 1, name: 'Alex', age: 19 },
                { id: 2, name: 'Alex', age: 15 },
                { id: 3, name: 'Dan', age: 25 }
            ]
        },
        grouping: {
            autoExpandAll: true
        },
        summary: {
            groupItems: [{
                column: 'age',
                alignByColumn: true,
                summaryType: 'min'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!this.dataController.isLoading());
    assert.strictEqual(this.dataController.items()[0].rowType, 'group');
    assert.deepEqual(this.dataController.items()[0].summaryCells, [[], [], [
        $.extend({ value: 15 }, this.options.summary.groupItems[0])
    ]]);
    assert.strictEqual(this.dataController.items()[3].rowType, 'group');
    assert.deepEqual(this.dataController.items()[3].summaryCells, [[], [], [
        $.extend({ value: 25 }, this.options.summary.groupItems[0])
    ]]);
});

QUnit.test("group summary items with and without alignByColumn", function(assert) {
    this.options = {
        dataSource: {
            group: 'name',
            store: [
                { id: 0, name: 'Alex', age: 19 },
                { id: 1, name: 'Alex', age: 15 },
                { id: 2, name: 'Dan', age: 25 }
            ]
        },
        grouping: {
            autoExpandAll: true
        },
        summary: {
            groupItems: [{
                column: 'name',
                summaryType: 'count'
            }, {
                column: 'age',
                alignByColumn: true,
                summaryType: 'min'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!this.dataController.isLoading());
    assert.strictEqual(this.dataController.items()[0].rowType, 'group');
    assert.deepEqual(this.dataController.items()[0].summaryCells, [
        [$.extend({ value: 2 }, this.options.summary.groupItems[0])], [],
        [$.extend({ value: 15 }, this.options.summary.groupItems[1])]
    ]);
    assert.strictEqual(this.dataController.items()[3].rowType, 'group');
    assert.deepEqual(this.dataController.items()[3].summaryCells, [
        [$.extend({ value: 1 }, this.options.summary.groupItems[0])], [],
        [$.extend({ value: 25 }, this.options.summary.groupItems[1])]
    ]);
});

// T241954
QUnit.test("group summary item alignByColumn for first cell after group", function(assert) {
    this.options = {
        dataSource: {
            group: ['city', 'name'],
            store: [
                { city: 'London', name: 'Alex', age: 19 },
                { city: 'London', name: 'Alex', age: 15 },
                { city: 'London', name: 'Dan', age: 25 }
            ]
        },
        grouping: {
            autoExpandAll: true
        },
        summary: {
            groupItems: [{
                column: 'age',
                alignByColumn: true,
                summaryType: 'sum'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!this.dataController.isLoading());
    assert.strictEqual(this.dataController.items()[0].rowType, 'group');
    assert.deepEqual(this.dataController.items()[0].summaryCells, [[
        $.extend({ value: 59, columnCaption: "Age" }, this.options.summary.groupItems[0])
    ], [], []]);
    assert.strictEqual(this.dataController.items()[1].rowType, 'group');
    assert.deepEqual(this.dataController.items()[1].summaryCells, [[], [
        $.extend({ value: 34, columnCaption: "Age" }, this.options.summary.groupItems[0])
    ], []]);
    assert.strictEqual(this.dataController.items()[4].rowType, 'group');
    assert.deepEqual(this.dataController.items()[4].summaryCells, [[], [
        $.extend({ value: 25, columnCaption: "Age" }, this.options.summary.groupItems[0])
    ], []]);
});

QUnit.test("group summary item with showInGroupFooter when no autoExpandAll", function(assert) {
    this.options = {
        dataSource: {
            group: 'name',
            store: [
                { name: 'Alex', age: 19 },
                { name: 'Alex', age: 15 },
                { name: 'Dan', age: 25 }
            ]
        },
        summary: {
            groupItems: [{
                showInGroupFooter: true,
                column: 'age',
                summaryType: 'min'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!this.dataController.isLoading());
    assert.strictEqual(this.dataController.items().length, 2);
    assert.deepEqual(this.dataController.items()[0].summaryCells, []);
    assert.deepEqual(this.dataController.items()[1].summaryCells, []);
});

QUnit.test("No groupFooter item when group summary items with showInGroupFooter and no autoExpandAll", function(assert) {
    this.options = {
        dataSource: {
            group: 'name',
            store: [
                { name: 'Alex', age: 19 },
                { name: 'Alex', age: 15 },
                { name: 'Dan', age: 25 }
            ]
        },
        grouping: {
            autoExpandAll: false
        },
        summary: {
            groupItems: [{
                column: 'age',
                showInGroupFooter: true,
                summaryType: 'max'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!this.dataController.isLoading());
    assert.strictEqual(this.dataController.items().length, 2);
    assert.strictEqual(this.dataController.items()[0].rowType, 'group');
    assert.strictEqual(this.dataController.items()[1].rowType, 'group');
});

QUnit.test("groupFooter item when group summary items with showInGroupFooter and autoExpandAll", function(assert) {
    this.options = {
        dataSource: {
            group: 'name',
            store: [
                { name: 'Alex', age: 19 },
                { name: 'Alex', age: 15 },
                { name: 'Dan', age: 25 }
            ]
        },
        grouping: {
            autoExpandAll: true
        },
        summary: {
            groupItems: [{
                column: 'age',
                showInGroupFooter: true,
                summaryType: 'max'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!this.dataController.isLoading());
    assert.strictEqual(this.dataController.items().length, 7);
    assert.strictEqual(this.dataController.items()[0].rowType, 'group');
    assert.strictEqual(this.dataController.items()[1].rowType, 'data');
    assert.strictEqual(this.dataController.items()[2].rowType, 'data');
    assert.strictEqual(this.dataController.items()[3].rowType, 'groupFooter');
    assert.deepEqual(this.dataController.items()[3].summaryCells, [[],
        [$.extend({ value: 19 }, this.options.summary.groupItems[0])]
    ]);
    assert.strictEqual(this.dataController.items()[4].rowType, 'group');
    assert.strictEqual(this.dataController.items()[5].rowType, 'data');
    assert.strictEqual(this.dataController.items()[6].rowType, 'groupFooter');
    assert.deepEqual(this.dataController.items()[6].summaryCells, [[],
        [$.extend({ value: 25 }, this.options.summary.groupItems[0])]
    ]);
});

// T535240
QUnit.test("groupFooter item when group by several fields and summary item is defined with showInGroupFooter", function(assert) {
    this.options = {
        dataSource: {
            group: ['name', 'age'],
            store: [
                { name: 'Alex', age: 19 },
                { name: 'Alex', age: 15 },
                { name: 'Dan', age: 25 }
            ]
        },
        columns: ['name', { dataField: 'age', showWhenGrouped: true }],
        grouping: {
            autoExpandAll: true
        },
        summary: {
            groupItems: [{
                column: 'age',
                showInGroupFooter: true,
                summaryType: 'max'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    var items = this.dataController.items();
    assert.ok(!this.dataController.isLoading());
    assert.strictEqual(items.length, 13);
    assert.strictEqual(items[0].rowType, 'group');
    assert.deepEqual(items[0].key, ['Alex']);

    assert.strictEqual(items[1].rowType, 'group');
    assert.deepEqual(items[1].key, ['Alex', 15]);
    assert.strictEqual(items[2].rowType, 'data');
    assert.strictEqual(items[3].rowType, 'groupFooter');
    assert.strictEqual(items[3].summaryCells[2][0].value, 15);

    assert.strictEqual(items[4].rowType, 'group');
    assert.deepEqual(items[4].key, ['Alex', 19]);
    assert.strictEqual(items[5].rowType, 'data');
    assert.strictEqual(items[6].rowType, 'groupFooter');
    assert.strictEqual(items[6].summaryCells[2][0].value, 19);

    assert.strictEqual(items[7].rowType, 'groupFooter');
    assert.strictEqual(items[7].summaryCells[2][0].value, 19);

    assert.strictEqual(items[8].rowType, 'group');
    assert.deepEqual(items[8].key, ['Dan']);
});

QUnit.test("several groupFooter items when group summary items with showInGroupFooter and autoExpandAll", function(assert) {
    this.options = {
        dataSource: {
            group: 'name',
            store: [
                { name: 'Alex', age: 19 },
                { name: 'Alex', age: 15 },
                { name: 'Dan', age: 25 }
            ]
        },
        grouping: {
            autoExpandAll: true
        },
        summary: {
            groupItems: [{
                column: 'age',
                showInGroupFooter: true,
                summaryType: 'min'
            },
            {
                column: 'age',
                showInGroupFooter: true,
                summaryType: 'max'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!this.dataController.isLoading());
    assert.strictEqual(this.dataController.items().length, 7);
    assert.strictEqual(this.dataController.items()[0].rowType, 'group');
    assert.strictEqual(this.dataController.items()[1].rowType, 'data');
    assert.strictEqual(this.dataController.items()[2].rowType, 'data');
    assert.strictEqual(this.dataController.items()[3].rowType, 'groupFooter');
    assert.deepEqual(this.dataController.items()[3].summaryCells, [[], [
        $.extend({ value: 15 }, this.options.summary.groupItems[0]),
        $.extend({ value: 19 }, this.options.summary.groupItems[1])
    ]]);
    assert.strictEqual(this.dataController.items()[4].rowType, 'group');
    assert.strictEqual(this.dataController.items()[5].rowType, 'data');
    assert.strictEqual(this.dataController.items()[6].rowType, 'groupFooter');
});

QUnit.test("not show groupFooter item for grouped column", function(assert) {
    this.options = {
        dataSource: {
            group: 'name',
            store: [
                { name: 'Alex', age: 19 },
                { name: 'Alex', age: 15 },
                { name: 'Dan', age: 25 }
            ]
        },
        grouping: {
            autoExpandAll: true
        },
        summary: {
            groupItems: [{
                column: 'age',
                showInColumn: 'name',
                showInGroupFooter: true,
                summaryType: 'min'
            },
            {
                column: 'age',
                showInGroupFooter: true,
                summaryType: 'max'
            }]
        }
    };

    // act
    this.setupDataGridModules();
    this.clock.tick();

    // assert
    assert.ok(!this.dataController.isLoading());
    assert.strictEqual(this.dataController.items().length, 7);
    assert.strictEqual(this.dataController.items()[0].rowType, 'group');
    assert.strictEqual(this.dataController.items()[1].rowType, 'data');
    assert.strictEqual(this.dataController.items()[2].rowType, 'data');
    assert.strictEqual(this.dataController.items()[3].rowType, 'groupFooter');
    assert.deepEqual(this.dataController.items()[3].summaryCells, [[], [
        $.extend({ value: 19 }, this.options.summary.groupItems[1])
    ]]);
    assert.strictEqual(this.dataController.items()[4].rowType, 'group');
    assert.strictEqual(this.dataController.items()[5].rowType, 'data');
    assert.strictEqual(this.dataController.items()[6].rowType, 'groupFooter');
});

QUnit.module("Master Detail", {
    beforeEach: function() {
        this.array = [];
        for(var i = 0; i < 10; i++) {
            this.array.push({ id: i, group: i % 2, name: 'test' + i });
        }
        this.options = {
            masterDetail: {
                enabled: true,
                autoExpandAll: false
            },
            columns: [{ dataField: 'id' }, { dataField: 'group' }, { dataField: 'name' }],
            dataSource: {
                asyncLoadEnabled: false,
                store: {
                    type: 'array',
                    data: this.array,
                    key: 'id'
                }
            },
            paging: {
                enabled: true,
                pageSize: 5
            }
        };

        this.setupDataGrid = function() {
            setupDataGridModules(this, ['data', 'columns', 'grouping', 'masterDetail', 'selection']);
        };

        this.clock = sinon.useFakeTimers();
    }, afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
});

QUnit.test("items by default", function(assert) {
    // act
    this.setupDataGrid();

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 5);

    for(var i = 0; i < items.length; i++) {
        assert.strictEqual(items[i].rowType, 'data');
        assert.strictEqual(items[i].isExpanded, false);
        assert.strictEqual(items[i].values[0], false);
    }
});

QUnit.test("items after expand one row", function(assert) {
    this.setupDataGrid();
    // act
    this.dataController.changeRowExpand(1);

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 6);
    assert.strictEqual(items[0].rowType, 'data');
    assert.strictEqual(items[0].isExpanded, false);
    assert.strictEqual(items[0].values[0], false);
    assert.strictEqual(items[1].rowType, 'data');
    assert.strictEqual(items[1].isExpanded, true);
    assert.strictEqual(items[1].values[0], true);
    assert.strictEqual(items[2].rowType, 'detail');
    assert.strictEqual(items[2].key, 1);
    assert.strictEqual(items[2].data.name, 'test1');
});

QUnit.test("expand events after expand/collapse one row", function(assert) {
    var events = [];
    var that = this;
    $.each(["onRowExpanding", "onRowExpanded", "onRowCollapsing", "onRowCollapsed"], function(index, name) {
        that.options[name] = function(e) {
            events.push({ name: name, key: e.key });
        };
    });

    this.setupDataGrid();

    // act
    this.dataController.changeRowExpand(1);

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 6);
    assert.strictEqual(items[0].rowType, 'data');
    assert.strictEqual(items[1].rowType, 'data');
    assert.strictEqual(items[1].isExpanded, true);
    assert.strictEqual(items[2].rowType, 'detail');
    assert.strictEqual(items[2].key, 1);
    assert.strictEqual(events.length, 2);

    // act
    this.dataController.changeRowExpand(1);

    // assert
    items = this.dataController.items();
    assert.strictEqual(items.length, 6);
    assert.strictEqual(items[0].rowType, 'data');
    assert.strictEqual(items[1].rowType, 'data');
    assert.strictEqual(items[1].isExpanded, false);
    assert.strictEqual(events.length, 4);

    assert.deepEqual(events, [
        { name: "onRowExpanding", key: 1 },
        { name: "onRowExpanded", key: 1 },
        { name: "onRowCollapsing", key: 1 },
        { name: "onRowCollapsed", key: 1 }
    ], "expand events");
});

QUnit.test("items when autoExpandAll", function(assert) {
    // act
    this.options.masterDetail.autoExpandAll = true;
    this.setupDataGrid();

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 10);
    assert.strictEqual(items[0].rowType, 'data');
    assert.strictEqual(items[1].rowType, 'detail');
    assert.strictEqual(items[2].rowType, 'data');
    assert.strictEqual(items[3].rowType, 'detail');
});


QUnit.test("items after expandAll", function(assert) {
    this.setupDataGrid();
    // act
    this.dataController.expandAll(-1);

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 10);
    assert.strictEqual(items[0].rowType, 'data');
    assert.strictEqual(items[0].isExpanded, true);
    assert.strictEqual(items[0].values[0], true);
    assert.strictEqual(items[1].rowType, 'detail');
    assert.strictEqual(items[2].values[0], true);
    assert.strictEqual(items[2].rowType, 'data');
    assert.strictEqual(items[2].isExpanded, true);
    assert.strictEqual(items[3].rowType, 'detail');
});

QUnit.test("items after collapseAll", function(assert) {
    this.setupDataGrid();
    // act
    this.dataController.changeRowExpand(1);
    this.dataController.collapseAll(-1);

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 5);
    assert.strictEqual(items[0].rowType, 'data');
    assert.strictEqual(items[1].rowType, 'data');
    assert.strictEqual(items[2].rowType, 'data');
    assert.strictEqual(items[3].rowType, 'data');
    assert.strictEqual(items[4].rowType, 'data');
});

QUnit.test("isRowExpanded", function(assert) {
    this.setupDataGrid();
    // act
    this.dataController.changeRowExpand(1);

    // assert
    assert.strictEqual(this.dataController.isRowExpanded(0), false);
    assert.strictEqual(this.dataController.isRowExpanded(1), true);
    assert.strictEqual(this.dataController.isRowExpanded(2), false);
});

QUnit.test("isRowExpanded after expandAll", function(assert) {
    this.setupDataGrid();
    // act
    this.dataController.expandAll(-1);
    this.dataController.changeRowExpand(1);

    // assert
    assert.strictEqual(this.dataController.isRowExpanded(0), true);
    assert.strictEqual(this.dataController.isRowExpanded(1), false);
    assert.strictEqual(this.dataController.isRowExpanded(2), true);
});


QUnit.test("expandRow by rowIndex", function(assert) {
    this.setupDataGrid();

    // act
    this.dataController.expandRow(this.getKeyByRowIndex(0));
    this.dataController.expandRow(this.getKeyByRowIndex(2));


    // assert
    assert.strictEqual(this.dataController.isRowExpanded(0), true);
    assert.strictEqual(this.dataController.isRowExpanded(1), true);
    assert.strictEqual(this.dataController.isRowExpanded(2), false);
});

QUnit.test("expandRow", function(assert) {
    this.setupDataGrid();

    this.dataController.changeRowExpand(1);

    // act
    this.dataController.expandRow(0);
    this.dataController.expandRow(1);


    // assert
    assert.strictEqual(this.dataController.isRowExpanded(0), true);
    assert.strictEqual(this.dataController.isRowExpanded(1), true);
    assert.strictEqual(this.dataController.isRowExpanded(2), false);
});

QUnit.test("collapseRow", function(assert) {
    this.setupDataGrid();

    this.dataController.changeRowExpand(1);
    this.dataController.changeRowExpand(2);

    // act
    var collapseRowResult0 = this.dataController.collapseRow(0);
    var collapseRowResult1 = this.dataController.collapseRow(1);

    // assert
    assert.ok(collapseRowResult0 && collapseRowResult0.done, "collapseRow result 0 is deferred");
    assert.ok(collapseRowResult0.state(), "resolved", "collapseRow result 0 state is resolved");
    assert.ok(collapseRowResult1 && collapseRowResult1.done, "collapseRow result 1 is deferred");
    assert.ok(collapseRowResult1.state(), "resolved", "collapseRow result state 1 is resolved");
    assert.strictEqual(this.dataController.isRowExpanded(0), false);
    assert.strictEqual(this.dataController.isRowExpanded(1), false);
    assert.strictEqual(this.dataController.isRowExpanded(2), true);
});

QUnit.test("items after expand several rows", function(assert) {
    this.setupDataGrid();
    // act
    this.dataController.changeRowExpand(0);
    this.dataController.changeRowExpand(2);

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 7);
    assert.strictEqual(items[0].rowType, 'data');
    assert.strictEqual(items[1].rowType, 'detail');
    assert.strictEqual(items[1].key, 0);
    assert.strictEqual(items[1].data.name, 'test0');
    assert.strictEqual(items[2].rowType, 'data');
    assert.strictEqual(items[3].rowType, 'data');
    assert.strictEqual(items[4].rowType, 'detail');
    assert.strictEqual(items[4].key, 2);
    assert.strictEqual(items[4].data.name, 'test2');
});

QUnit.test("expand events after expand several data rows", function(assert) {
    var events = [];
    var that = this;
    $.each(["onRowExpanding", "onRowExpanded", "onRowCollapsing", "onRowCollapsed"], function(index, name) {
        that.options[name] = function(e) {
            events.push({ name: name, key: e.key });
        };
    });
    this.setupDataGrid();
    // act
    this.dataController.changeRowExpand(0);
    this.dataController.changeRowExpand(2);

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 7);
    assert.strictEqual(items[0].rowType, 'data');
    assert.strictEqual(items[1].rowType, 'detail');
    assert.strictEqual(items[1].key, 0);
    assert.strictEqual(items[1].data.name, 'test0');
    assert.strictEqual(items[2].rowType, 'data');
    assert.strictEqual(items[3].rowType, 'data');
    assert.strictEqual(items[4].rowType, 'detail');
    assert.strictEqual(items[4].key, 2);
    assert.strictEqual(items[4].data.name, 'test2');

    assert.deepEqual(events, [
        { name: "onRowExpanding", key: 0 },
        { name: "onRowExpanded", key: 0 },
        { name: "onRowExpanding", key: 2 },
        { name: "onRowExpanded", key: 2 }
    ], "expand events");

});

QUnit.test("cancel expanding events", function(assert) {
    var events = [];
    var that = this;
    $.each(["onRowExpanding", "onRowExpanded", "onRowCollapsing", "onRowCollapsed"], function(index, name) {
        that.options[name] = function(e) {
            if(e.key === 0) {
                e.cancel = true;
            }
            events.push({ name: name, key: e.key });
        };
    });
    this.setupDataGrid();
    // act
    this.dataController.changeRowExpand(0);
    this.dataController.changeRowExpand(2);

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 6);
    assert.strictEqual(items[0].rowType, 'data');
    assert.strictEqual(items[1].rowType, 'data');
    assert.strictEqual(items[2].rowType, 'data');
    assert.strictEqual(items[3].rowType, 'detail');
    assert.strictEqual(items[3].key, 2);
    assert.strictEqual(items[3].data.name, 'test2');

    assert.deepEqual(events, [
        { name: "onRowExpanding", key: 0 },
        { name: "onRowExpanding", key: 2 },
        { name: "onRowExpanded", key: 2 }
    ], "expand events");

});

QUnit.test("expand events after expand group row", function(assert) {
    var events = [];
    var that = this;
    $.each(["onRowExpanding", "onRowExpanded", "onRowCollapsing", "onRowCollapsed"], function(index, name) {
        that.options[name] = function(e) {
            events.push({ name: name, key: e.key });
        };
    });
    this.options.columns[1].groupIndex = 0;
    this.options.loadingTimeout = 0;
    this.setupDataGrid();

    this.clock.tick();

    // act
    this.dataController.changeRowExpand([0]);

    // assert
    assert.equal(events.length, 1, "one expand event called");

    // act
    this.clock.tick();

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 5);
    assert.strictEqual(items[0].rowType, 'group');
    assert.strictEqual(items[0].data.key, 0);
    assert.strictEqual(items[1].rowType, 'data');
    assert.strictEqual(items[2].rowType, 'data');

    assert.deepEqual(events, [
        { name: "onRowExpanding", key: [0] },
        { name: "onRowExpanded", key: [0] }
    ], "expand events");
});

QUnit.test("items after expand and change page", function(assert) {
    this.setupDataGrid();
    // act
    this.dataController.changeRowExpand(0);
    this.dataController.pageIndex(1);

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 5);
    assert.strictEqual(items[0].rowType, 'data');
    assert.strictEqual(items[0].key, 5);

    // act
    this.dataController.pageIndex(0);
    items = this.dataController.items();
    assert.strictEqual(items.length, 6);
    assert.strictEqual(items[0].rowType, 'data');
    assert.strictEqual(items[0].key, 0);
    assert.strictEqual(items[1].rowType, 'detail');
    assert.strictEqual(items[1].key, 0);
});

// T317450
QUnit.test("items after expand and refresh", function(assert) {
    this.setupDataGrid();
    // act
    this.dataController.changeRowExpand(0);
    this.dataController.refresh();

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 6);
    assert.strictEqual(items[0].rowType, 'data');
    assert.strictEqual(items[0].key, 0);
    assert.strictEqual(items[1].rowType, 'detail');
    assert.strictEqual(items[1].key, 0);
});

QUnit.test("items after collapse expanded row", function(assert) {
    // arrange
    this.setupDataGrid();
    this.dataController.changeRowExpand(0);
    this.dataController.changeRowExpand(2);

    // act
    this.dataController.changeRowExpand(0);

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 7, "count items");
    assert.strictEqual(items[0].rowType, "data", "rowType first item");
    assert.strictEqual(items[1].rowType, "detail", "rowType second item");
    assert.strictEqual(items[1].key, 0, "key second item");
    assert.ok(!items[1].visible, "visible second item");
    assert.strictEqual(items[1].data.name, "test0", "data name second item");
    assert.strictEqual(items[2].rowType, "data", "rowType third item");
    assert.strictEqual(items[3].rowType, "data", "rowType fourth item");
    assert.strictEqual(items[4].rowType, "detail", "rowType fifth item");
    assert.strictEqual(items[4].key, 2, "key fifth item");
    assert.ok(items[4].visible, "visible fifth item");
    assert.strictEqual(items[4].data.name, "test2", "data name fifth item");
});

QUnit.test("items after collapse expanded second row", function(assert) {
    // arrange
    this.setupDataGrid();
    this.dataController.changeRowExpand(1);
    this.dataController.changeRowExpand(2);

    // act
    this.dataController.changeRowExpand(1);

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 7, "count items");
    assert.strictEqual(items[0].rowType, "data", "rowType first item");
    assert.strictEqual(items[1].rowType, "data", "rowType second item");
    assert.strictEqual(items[2].rowType, "detail", "rowType third item");
    assert.strictEqual(items[2].key, 1, "key third item");
    assert.ok(!items[2].visible, "visible third item");
    assert.strictEqual(items[2].data.name, "test1", "data name third item");
    assert.strictEqual(items[3].rowType, "data", "rowType fourth item");
    assert.strictEqual(items[4].rowType, "detail", "rowType fifth item");
    assert.strictEqual(items[4].key, 2, "key fifth item");
    assert.ok(items[4].visible, "visible fifth item");
    assert.strictEqual(items[4].data.name, "test2", "data name fifth item");
});

QUnit.test("expand row on invisible page", function(assert) {
    this.setupDataGrid();
    this.dataController.changeRowExpand([0]);

    // act
    this.dataController.changeRowExpand(6);
    this.dataController.pageIndex(1);

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 6);
    assert.strictEqual(items[0].rowType, 'data');
    assert.strictEqual(items[1].rowType, 'data');
    assert.strictEqual(items[2].rowType, 'detail');
    assert.strictEqual(items[2].key, 6);
    assert.strictEqual(items[2].data.name, 'test6');
});

QUnit.test("items after expand data row when grouped column exists", function(assert) {
    this.options.columns[1].groupIndex = 0;
    this.setupDataGrid();
    this.dataController.changeRowExpand([0]);

    // act
    this.dataController.changeRowExpand(0);

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 6);
    assert.strictEqual(items[0].rowType, 'group');
    assert.strictEqual(items[0].data.key, 0);
    assert.strictEqual(items[1].rowType, 'data');
    assert.strictEqual(items[1].isExpanded, true);
    assert.deepEqual(items[1].values, [null, true, 0, "test0"]);
    assert.strictEqual(items[2].rowType, 'detail');
    assert.strictEqual(items[2].key, 0);
    assert.strictEqual(items[3].rowType, 'data');
    assert.strictEqual(items[3].key, 2);
    assert.strictEqual(items[3].isExpanded, false);
    assert.deepEqual(items[3].values, [null, false, 2, "test2"]);
    assert.strictEqual(items[4].rowType, 'data');
    assert.strictEqual(items[5].rowType, 'data');
});

QUnit.test("items after expand data row and collapse its group", function(assert) {
    this.options.columns[1].groupIndex = 0;
    this.setupDataGrid();

    this.dataController.changeRowExpand([0]);

    // act
    this.dataController.changeRowExpand(0);
    this.dataController.changeRowExpand([0]);

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 2);
    assert.strictEqual(items[0].rowType, 'group');
    assert.strictEqual(items[1].rowType, 'group');
});

QUnit.test("detail items after disable masterDetail", function(assert) {
    this.setupDataGrid();
    // act
    this.dataController.changeRowExpand(1);

    this.options.masterDetail.enabled = false;
    this.dataController.optionChanged({ name: 'masterDetail', fullName: 'masterDetail.enabled' });

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 5);
    assert.strictEqual(items[0].rowType, 'data');
    assert.strictEqual(items[1].rowType, 'data');
    assert.strictEqual(items[2].rowType, 'data');
    assert.strictEqual(items[3].rowType, 'data');
    assert.strictEqual(items[4].rowType, 'data');
});

// T175307
QUnit.test("Not reset master detail items after reassign same masterDetail options", function(assert) {
    this.setupDataGrid();
    // act
    this.dataController.changeRowExpand(1);

    var oldMasterDetail = this.options.masterDetail;

    this.options.masterDetail = { enabled: true, autoExpandAll: false };

    this.dataController.optionChanged({ name: 'masterDetail', fullName: 'masterDetail', previousValue: oldMasterDetail, value: this.options.masterDetail });

    // assert
    assert.ok(this.dataController.isRowExpanded(1), 'row 1 is expanded');
    assert.ok(!this.dataController.isRowExpanded(2), 'row 2 is not expanded');
});

QUnit.test("Reset master detail items after change masterDetail options", function(assert) {
    this.setupDataGrid();
    // act
    this.dataController.changeRowExpand(1);

    var oldMasterDetail = this.options.masterDetail;

    this.options.masterDetail = { enabled: true, autoExpandAll: true };

    this.dataController.optionChanged({ name: 'masterDetail', fullName: 'masterDetail', previousValue: oldMasterDetail, value: this.options.masterDetail });

    // assert
    assert.ok(this.dataController.isRowExpanded(1), 'row 1 is not expanded');
    assert.ok(this.dataController.isRowExpanded(2), 'row 2 is not expanded');
});

// T199951
QUnit.test("Visible item after expanded/collapsed", function(assert) {
    // arrange
    this.setupDataGrid();

    // act
    this.dataController.changeRowExpand(0);

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items[0].rowType, "data");
    assert.strictEqual(items[0].key, 0);
    assert.strictEqual(items[1].rowType, "detail");
    assert.strictEqual(items[1].key, 0);
    assert.ok(items[1].visible, "visible master detail");

    // act
    this.dataController.changeRowExpand(0);

    // assert
    items = this.dataController.items();
    assert.strictEqual(items[0].rowType, "data");
    assert.strictEqual(items[0].key, 0);
    assert.strictEqual(items[1].rowType, "detail");
    assert.strictEqual(items[1].key, 0);
    assert.ok(!items[1].visible, "visible master detail");

    var callChanged = false;

    this.dataController.changed.add(function(change) {
        callChanged = true;

        // assert
        assert.ok(change.items[1].visible, "visible master detail");
        assert.ok(!change.items[1].hasOwnProperty("rowType"), "not have property rowType");
        assert.ok(!change.items[1].hasOwnProperty("key"), "not have property key");
    });

    // act
    this.dataController.changeRowExpand(0);

    assert.ok(callChanged, "call changed");
});

QUnit.test("Remove invisible expanded items after change pageIndex", function(assert) {
    // arrange
    this.setupDataGrid();

    // act
    this.dataController.changeRowExpand(0);
    this.dataController.changeRowExpand(0);

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items[0].rowType, "data");
    assert.strictEqual(items[0].key, 0);
    assert.strictEqual(items[1].rowType, "detail");
    assert.strictEqual(items[1].key, 0);
    assert.strictEqual(items[1].visible, false, "visible master detail");

    // act
    this.dataController.pageIndex(1);
    this.dataController.pageIndex(0);

    // assert
    items = this.dataController.items();
    assert.strictEqual(items[0].rowType, "data");
    assert.strictEqual(items[0].key, 0);
    assert.strictEqual(items[1].rowType, "data");
    assert.strictEqual(items[1].key, 1);
    assert.strictEqual(items[1].visible, undefined, "second data row is visible");
});

QUnit.test("SelectAll after expand and collapse row", function(assert) {
    // arrange
    this.setupDataGrid();
    this.dataController.changeRowExpand(0);
    this.dataController.changeRowExpand(0);

    // act
    this.selectAll();

    // assert
    var items = this.dataController.items();
    assert.strictEqual(items.length, 6, "item count");
    assert.strictEqual(items[0].rowType, "data");
    assert.ok(items[0].isSelected, "first data row is selected");
    assert.strictEqual(items[0].key, 0);
    assert.strictEqual(items[1].rowType, "detail");
    assert.strictEqual(items[1].key, 0);
    assert.strictEqual(items[1].visible, false, "visible master detail");
    assert.ok(!items[1].isSelected, "detail row is not selected");
    assert.ok(items[items.length - 1].isSelected, "last row is selected");
});

QUnit.module("Partial update", {
    beforeEach: function() {
        var that = this;
        that.setupModules = function() {
            setupModule.call(that);

            that.array = [
                { name: 'Alex', age: 30 },
                { name: 'Dan', age: 25 },
                { name: 'Bob', age: 20 }
            ];
            that.dataSource = createDataSource(that.array, { key: 'name' });
            that.dataController.setDataSource(that.dataSource);
            that.dataSource.load();
        };

    }, afterEach: teardownModule
});

QUnit.test("update one row", function(assert) {
    this.setupModules();
    var dataSourceItems = this.dataController.dataSource().items();

    var oldItems = this.dataController.items().slice(0);
    var changedArgs;

    this.dataController.changed.add(function(args) {
        changedArgs = args;
    });

    // act
    dataSourceItems[0].age = 31;
    this.dataController.updateItems({
        changeType: 'update',
        rowIndices: [0]
    });

    // assert
    dataSourceItems[0].age = 31;
    var items = this.dataController.items();

    assert.deepEqual(this.dataController.items()[0].values, ['Alex', 31]);
    assert.deepEqual(this.dataController.items()[0].data, { name: 'Alex', age: 31 });
    assert.notStrictEqual(oldItems[0], items[0]);
    assert.strictEqual(oldItems[1], items[1]);
    assert.deepEqual(changedArgs.changeType, 'update');
    assert.deepEqual(changedArgs.rowIndices, [0]);
    assert.deepEqual(changedArgs.changeTypes, ['update']);
    assert.deepEqual(changedArgs.items, [items[0]]);
});

QUnit.test("update several rows", function(assert) {
    this.setupModules();
    var dataSourceItems = this.dataController.dataSource().items();

    var oldItems = this.dataController.items().slice(0);
    var changedArgs;

    this.dataController.changed.add(function(args) {
        changedArgs = args;
    });

    // act
    dataSourceItems[0].age = 31;
    dataSourceItems[2].age = 26;
    this.dataController.updateItems({
        changeType: 'update',
        rowIndices: [0, 2]
    });

    // assert
    var items = this.dataController.items();

    assert.deepEqual(this.dataController.items()[0].values, ['Alex', 31]);
    assert.deepEqual(this.dataController.items()[0].data, { name: 'Alex', age: 31 });
    assert.deepEqual(this.dataController.items()[2].values, ['Bob', 26]);
    assert.deepEqual(this.dataController.items()[2].data, { name: 'Bob', age: 26 });

    assert.notStrictEqual(oldItems[0], items[0]);
    assert.strictEqual(oldItems[1], items[1]);
    assert.notStrictEqual(oldItems[2], items[2]);

    assert.deepEqual(changedArgs.changeType, 'update');
    assert.deepEqual(changedArgs.rowIndices, [0, 2]);
    assert.deepEqual(changedArgs.changeTypes, ['update', 'update']);
    assert.deepEqual(changedArgs.items, [items[0], items[2]]);
});

QUnit.test("update with incorrect rowIndices", function(assert) {
    this.setupModules();
    var dataSourceItems = this.dataController.dataSource().items();

    var oldItems = this.dataController.items().slice(0);
    var changedArgs;

    this.dataController.changed.add(function(args) {
        changedArgs = args;
    });

    // act
    dataSourceItems[0].age = 31;
    this.dataController.updateItems({
        changeType: 'update',
        rowIndices: [0, -1, 0, 1000000]
    });

    // assert
    var items = this.dataController.items();

    assert.deepEqual(this.dataController.items()[0].values, ['Alex', 31]);
    assert.deepEqual(this.dataController.items()[0].data, { name: 'Alex', age: 31 });

    assert.notStrictEqual(oldItems[0], items[0]);
    assert.strictEqual(oldItems[1], items[1]);
    assert.strictEqual(oldItems[2], items[2]);

    assert.deepEqual(changedArgs.changeType, 'update');
    assert.deepEqual(changedArgs.rowIndices, [0]);
    assert.deepEqual(changedArgs.changeTypes, ['update']);
    assert.deepEqual(changedArgs.items, [items[0]]);
});

// T266696
QUnit.test("insert item with editing of the first item", function(assert) {
    this.setupModules();
    var dataSourceItems = this.dataController.dataSource().items(),
        changedArgs;

    this.dataController.changed.add(function(args) {
        changedArgs = args;
    });

    // act
    dataSourceItems.unshift({ name: 'Mike', age: 40 });
    this.dataController.updateItems({
        changeType: 'update',
        rowIndices: [0, 0]
    });

    // assert
    var items = this.dataController.items();

    assert.equal(items.length, 4);
    assert.deepEqual(items[0].values, ['Mike', 40]);
    assert.deepEqual(items[0].data, { name: 'Mike', age: 40 });
    assert.strictEqual(changedArgs.changeType, 'update');
    assert.deepEqual(changedArgs.rowIndices, [0, 1]);
    assert.deepEqual(changedArgs.changeTypes, ['insert', 'update']);
    assert.deepEqual(changedArgs.items, [items[0], items[1]]);
});

QUnit.test("insert one item", function(assert) {
    this.setupModules();
    var dataSourceItems = this.dataController.dataSource().items();

    var oldItems = this.dataController.items().slice(0);
    var changedArgs;

    this.dataController.changed.add(function(args) {
        changedArgs = args;
    });

    // act
    dataSourceItems.unshift({ name: 'Mike', age: 40 });
    this.dataController.updateItems({
        changeType: 'update',
        rowIndices: [0]
    });

    // assert
    var items = this.dataController.items();

    assert.equal(items.length, 4);
    assert.deepEqual(items[0].values, ['Mike', 40]);
    assert.deepEqual(items[0].data, { name: 'Mike', age: 40 });
    assert.deepEqual(items[1].values, ['Alex', 30]);
    assert.deepEqual(items[1].data, { name: 'Alex', age: 30 });

    assert.notStrictEqual(oldItems[0], items[0]);
    assert.strictEqual(oldItems[0], items[1]);
    assert.strictEqual(oldItems[1], items[2]);

    assert.deepEqual(changedArgs.changeType, 'update');
    assert.deepEqual(changedArgs.rowIndices, [0]);
    assert.deepEqual(changedArgs.changeTypes, ['insert']);
    assert.deepEqual(changedArgs.items, [items[0]]);
});

QUnit.test("update and insert", function(assert) {
    this.setupModules();
    var dataSourceItems = this.dataController.dataSource().items();

    var oldItems = this.dataController.items().slice(0);
    var changedArgs;

    this.dataController.changed.add(function(args) {
        changedArgs = args;
    });

    // act
    dataSourceItems[0].age = 31;
    dataSourceItems.splice(1, 0, { name: 'Mike', age: 40 });
    this.dataController.updateItems({
        changeType: 'update',
        rowIndices: [0, 1]
    });

    // assert
    var items = this.dataController.items();

    assert.equal(items.length, 4);
    assert.deepEqual(items[0].values, ['Alex', 31]);
    assert.deepEqual(items[0].data, { name: 'Alex', age: 31 });
    assert.deepEqual(items[1].values, ['Mike', 40]);
    assert.deepEqual(items[1].data, { name: 'Mike', age: 40 });

    assert.notStrictEqual(oldItems[0], items[0]);
    assert.notStrictEqual(oldItems[0], items[1]);
    assert.strictEqual(oldItems[1], items[2]);

    assert.deepEqual(changedArgs.changeType, 'update');
    assert.deepEqual(changedArgs.rowIndices, [0, 1]);
    assert.deepEqual(changedArgs.changeTypes, ['update', 'insert']);
    assert.deepEqual(changedArgs.items, [items[0], items[1]]);
});

QUnit.test("update and insert when edit mode is form_T318702", function(assert) {
    // arrange
    this.options = {
        editing: {
            mode: "form",
            allowUpdating: true,
            allowAdding: true
        }
    };

    this.setupModules();

    var changedArgs;
    this.dataController.changed.add(function(e) {
        changedArgs = e;
    });

    this.editingController.editRow(0);
    this.editingController.addRow();

    // assert
    var items = this.dataController.items();

    assert.equal(items[0].values[0], undefined, "value 1");
    assert.equal(items[0].values[1], undefined, "value 2");
    assert.equal(items[0].values[2], null, "value 3");
    assert.equal(items[0].rowType, "detail", "row type");
    assert.deepEqual(changedArgs.changeType, "update", "changed args changeType");
    assert.deepEqual(changedArgs.changeTypes, ["insert", "update"], "changed args changeType");
    assert.deepEqual(changedArgs.rowIndices, [0, 1], "changed args rowIndices");
});

QUnit.test("remove one item", function(assert) {
    this.setupModules();
    var dataSourceItems = this.dataController.dataSource().items();

    var oldItems = this.dataController.items().slice(0);
    var changedArgs;

    this.dataController.changed.add(function(args) {
        changedArgs = args;
    });

    // act
    dataSourceItems.splice(1, 1);
    this.dataController.updateItems({
        changeType: 'update',
        rowIndices: [1]
    });

    // assert
    var items = this.dataController.items();

    assert.equal(items.length, 2);
    assert.deepEqual(items[0].values, ['Alex', 30]);
    assert.deepEqual(items[0].data, { name: 'Alex', age: 30 });
    assert.deepEqual(items[1].values, ['Bob', 20]);
    assert.deepEqual(items[1].data, { name: 'Bob', age: 20 });

    assert.strictEqual(oldItems[0], items[0]);
    assert.notStrictEqual(oldItems[1], items[1]);
    assert.strictEqual(oldItems[2], items[1]);

    assert.deepEqual(changedArgs.changeType, 'update');
    assert.deepEqual(changedArgs.rowIndices, [1]);
    assert.deepEqual(changedArgs.changeTypes, ['remove']);
});

QUnit.test("update and remove", function(assert) {
    this.setupModules();
    var dataSourceItems = this.dataController.dataSource().items();

    var oldItems = this.dataController.items().slice(0);
    var changedArgs;

    this.dataController.changed.add(function(args) {
        changedArgs = args;
    });

    // act
    dataSourceItems[1].age = 26;
    dataSourceItems.splice(2, 1);
    this.dataController.updateItems({
        changeType: 'update',
        rowIndices: [1, 2]
    });

    // assert
    var items = this.dataController.items();

    assert.equal(items.length, 2);
    assert.deepEqual(items[1].values, ['Dan', 26]);
    assert.deepEqual(items[1].data, { name: 'Dan', age: 26 });

    assert.strictEqual(oldItems[0], items[0]);
    assert.notStrictEqual(oldItems[1], items[1]);
    assert.notStrictEqual(oldItems[2], items[1]);

    assert.deepEqual(changedArgs.changeType, 'update');
    assert.deepEqual(changedArgs.rowIndices, [1, 2]);
    assert.deepEqual(changedArgs.changeTypes, ['update', 'remove']);
    assert.deepEqual(changedArgs.items, [items[1]]);
});

// T186415
QUnit.test("remove and update next row", function(assert) {
    this.setupModules();
    var dataSourceItems = this.dataController.dataSource().items();

    var oldItems = this.dataController.items().slice(0);
    var changedArgs;

    this.dataController.changed.add(function(args) {
        changedArgs = args;
    });

    // act
    dataSourceItems[1].age = 26;
    dataSourceItems.splice(0, 1);
    this.dataController.updateItems({
        changeType: 'update',
        rowIndices: [0, 1]
    });

    // assert
    var items = this.dataController.items();

    assert.equal(items.length, 2);
    assert.deepEqual(items[0].values, ['Dan', 26]);
    assert.deepEqual(items[1].values, ['Bob', 20]);

    assert.notStrictEqual(oldItems[0].data, items[0].data);
    assert.strictEqual(oldItems[1].data, items[0].data);
    assert.strictEqual(oldItems[2].data, items[1].data);

    assert.deepEqual(changedArgs.changeType, 'update');
    assert.deepEqual(changedArgs.rowIndices, [0, 0]);
    assert.deepEqual(changedArgs.changeTypes, ['remove', 'update']);
    assert.deepEqual(changedArgs.items, [items[0], items[0]]);
});

QUnit.test("insert and remove", function(assert) {
    this.setupModules();
    var dataSourceItems = this.dataController.dataSource().items();

    var oldItems = this.dataController.items().slice(0);
    var changedArgs;

    this.dataController.changed.add(function(args) {
        changedArgs = args;
    });

    // act
    dataSourceItems.splice(1, 1);
    dataSourceItems.unshift({ name: 'Mike', age: 40 });
    this.dataController.updateItems({
        changeType: 'update',
        rowIndices: [1, 0]
    });

    // assert
    var items = this.dataController.items();

    assert.equal(items.length, 3);
    assert.deepEqual(items[0].values, ['Mike', 40]);
    assert.deepEqual(items[1].values, ['Alex', 30]);
    assert.deepEqual(items[2].values, ['Bob', 20]);

    assert.notStrictEqual(oldItems[0], items[0]);
    assert.notStrictEqual(oldItems[1], items[1]);
    assert.strictEqual(oldItems[0], items[1]);
    assert.strictEqual(oldItems[2], items[2]);

    assert.deepEqual(changedArgs.changeType, 'update');
    assert.deepEqual(changedArgs.rowIndices, [0, 2]);
    assert.deepEqual(changedArgs.changeTypes, ['insert', 'remove']);
    assert.deepEqual(changedArgs.items[0], items[0]);
});

QUnit.module("Using DataSource instance", {
    beforeEach: function() {
        this.array = [
                { field1: 1, field2: 2, field3: 3 },
                { field1: 1, field2: 2, field3: 4 },
                { field1: 2, field2: 2, field3: 5 },
                { field1: 2, field2: 3, field3: 6 },
                { field1: 2, field2: 3, field3: 7 }
        ];

        this.dataSource = new DataSource(this.array);

        this.setupDataGridModules = function(options) {
            this.options = options;
            setupDataGridModules(this, ['data', 'virtualScrolling', 'columns', 'filterRow', 'search', 'editing', 'grouping']);
        };

        this.applyOptions = function(options) {
            $.extend(this.options, options);
            this.columnsController.init();
        };

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
});


QUnit.test("change filter", function(assert) {
    this.setupDataGridModules({
        dataSource: this.dataSource,
        searchPanel: {
            text: '3'
        }
    });

    this.clock.tick();

    // assert
    assert.ok(!this.dataSource.filter(), 'no filter');
    assert.equal(this.dataController.itemsCount(), 3);
    assert.equal(this.dataController.totalCount(), 3);

    // act
    this.dataSource.filter(['field1', '=', 2]);
    this.dataSource.load();
    this.clock.tick();

    // assert
    var filter = this.dataSource.filter();
    assert.deepEqual(this.dataSource.filter(), [filter[0], '=', 2], 'changed filter');
    assert.equal(this.dataController.items()[0].data.field3, 6);
    assert.equal(this.dataController.itemsCount(), 2);
    assert.equal(this.dataController.totalCount(), 2);
});

QUnit.test("change group", function(assert) {
    var changes = [];

    this.setupDataGridModules({
        dataSource: this.dataSource,
        grouping: {
            autoExpandAll: true
        }
    });

    this.clock.tick();

    this.dataController.changed.add(function() {
        changes.push('data');
    });

    this.columnsController.columnsChanged.add(function(e) {
        changes.push('columns');
    });

    // act
    this.dataSource.group('field1');
    this.dataSource.pageSize(5);
    this.dataSource.load();
    this.clock.tick();

    // assert
    assert.strictEqual(this.columnOption(0, 'groupIndex'), 0);
    assert.strictEqual(this.columnOption(1, 'groupIndex'), undefined);
    assert.strictEqual(this.columnOption(2, 'groupIndex'), undefined);

    assert.deepEqual(changes, ['columns', 'data']);
    assert.equal(this.dataController.itemsCount(), 5);
    assert.equal(this.dataController.totalItemsCount(), 8);
    assert.equal(this.dataController.items()[0].rowType, 'group');
    assert.equal(this.dataController.items()[1].rowType, 'data');
    assert.equal(this.dataController.items()[1].data.field3, 3);
    assert.equal(this.dataController.items()[2].rowType, 'data');
    assert.equal(this.dataController.items()[3].rowType, 'group');
    assert.equal(this.dataController.items()[4].rowType, 'data');
    assert.equal(this.dataController.items()[4].data.field3, 5);
});

QUnit.test("change sort", function(assert) {
    var changes = [];

    this.setupDataGridModules({
        dataSource: this.dataSource
    });

    this.clock.tick();

    this.dataController.changed.add(function() {
        changes.push('data');
    });

    this.columnsController.columnsChanged.add(function(e) {
        changes.push('columns');
    });

    // act
    this.dataSource.sort({ selector: 'field3', desc: true });
    this.dataSource.load();
    this.clock.tick();

    // assert
    assert.strictEqual(this.columnOption(0, 'sortIndex'), undefined);
    assert.strictEqual(this.columnOption(0, 'sortOrder'), undefined);
    assert.strictEqual(this.columnOption(1, 'sortIndex'), undefined);
    assert.strictEqual(this.columnOption(1, 'sortOrder'), undefined);
    assert.strictEqual(this.columnOption(2, 'sortIndex'), 0);
    assert.strictEqual(this.columnOption(2, 'sortOrder'), 'desc');

    assert.deepEqual(changes, ['columns', 'data']);
    assert.equal(this.dataController.itemsCount(), 5);
    assert.equal(this.dataController.totalItemsCount(), 5);
    assert.equal(this.dataController.items()[0].data.field3, 7);
    assert.equal(this.dataController.items()[4].data.field3, 3);
});

QUnit.test("change pageIndex", function(assert) {
    this.dataSource.pageSize(3);

    this.setupDataGridModules({
        dataSource: this.dataSource
    });

    this.clock.tick();

    // act
    this.dataSource.pageIndex(1);
    this.dataSource.load();
    this.clock.tick();

    // assert
    assert.equal(this.dataController.pageIndex(), 1);
    assert.equal(this.dataController.items()[0].data.field3, 6);
});

QUnit.test("reload reset pageIndex in infinite scrolling mode", function(assert) {
    this.dataSource.pageSize(3);

    this.setupDataGridModules({
        dataSource: this.dataSource,
        scrolling: { mode: 'infinite' }
    });

    this.clock.tick();

    // assert
    assert.equal(this.dataController.totalItemsCount(), 3);
    assert.equal(this.dataController.items().length, 3);

    // act
    this.pageIndex(1);
    this.clock.tick();

    // assert
    assert.equal(this.dataController.totalItemsCount(), 5);
    assert.equal(this.dataController.items().length, 5);

    var spy = sinon.spy();
    this.dataSource.on("customizeStoreLoadOptions", spy);

    // act
    this.dataSource.reload(true);
    this.clock.tick();

    // assert
    assert.equal(this.dataController.totalItemsCount(), 3);
    assert.equal(this.dataController.items().length, 3);
    assert.equal(this.dataController.pageIndex(), 0);
    assert.equal(this.dataSource.pageIndex(), 0);
    assert.equal(spy.getCall(0).args[0].pageIndex, 0); // T646491
    assert.equal(spy.getCall(0).args[0].storeLoadOptions.pageIndex, 0);
});

QUnit.test("Grouping not reset after change option autoExpandAll", function(assert) {
    this.setupDataGridModules({
        dataSource: this.array,
        columns: [{ dataField: 'field1', groupIndex: 0 }, 'field2', 'field3'],
        grouping: { autoExpandAll: true }
    });

    this.clock.tick();

    assert.equal(this.columnsController.getGroupColumns().length, 1, 'grouped columns count');
    assert.deepEqual(this.dataController._dataSource.group(), [{ selector: 'field1', desc: false, isExpanded: true }], 'dataSource group when autoExpandAll true');

    // act
    this.option('grouping.autoExpandAll', false);
    this.dataController.optionChanged({ name: 'grouping' });

    this.clock.tick();

    // assert
    assert.equal(this.columnsController.getGroupColumns().length, 1, 'grouped columns count');
    assert.deepEqual(this.dataController._dataSource.group(), [{ selector: 'field1', desc: false, isExpanded: false }], 'dataSource group when autoExpandAll false');
    assert.equal(this.dataController.totalItemsCount(), 2);
    assert.equal(this.dataController.items().length, 2);
});

// T231490
QUnit.test("assign loaded dataSource", function(assert) {
    this.dataSource = new DataSource({
        store: this.array,
        pageSize: 3
    });

    this.dataSource.load();

    this.setupDataGridModules({
        dataSource: this.dataSource
    });

    this.clock.tick();

    // assert
    assert.equal(this.dataController.items().length, 3, "items count");
    assert.equal(this.dataController.totalCount(), 5, "total count");
    assert.equal(this.dataController.pageCount(), 2, "page count");
});

QUnit.module("Exporting", {
    beforeEach: function() {
        this.array = [
                { field1: 1, field2: 2, field3: 3 },
                { field1: 1, field2: 2, field3: 4 },
                { field1: 2, field2: 2, field3: 5 },
                { field1: 2, field2: 3, field3: 6 },
                { field1: 2, field2: 3, field3: 7 }
        ];

        this.setupDataGridModules = function(options) {
            setupDataGridModules(this, ['data', 'virtualScrolling', 'columns', 'filterRow', 'search', 'editing', 'grouping', 'masterDetail', 'summary', 'headerFilter'], {
                initDefaultOptions: true,
                options: options
            });
        };

        this.applyOptions = function(options) {
            $.extend(this.options, options);
            this.columnsController.init();
        };

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
});

QUnit.test("loadAll when no dataSource", function(assert) {
    var allItems;
    this.setupDataGridModules({});

    this.clock.tick();

    // act
    this.dataController.loadAll().done(function(items) {
        allItems = items;
    });

    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.items().length, 0, 'items count');

    assert.deepEqual(allItems, [], 'all items is empty array');
});

QUnit.test("loadAll when error on loading", function(assert) {
    var dataErrorOccurredArgs = [],
        error,
        changedArgs = [];
    this.setupDataGridModules({
        dataSource: {
            load: function() {
                return $.Deferred().reject("Test Error");
            }
        }
    });

    this.clock.tick();

    this.dataController.dataErrorOccurred.add(function(e) {
        dataErrorOccurredArgs.push(e);
    });

    this.dataController.changed.add(function(e) {
        changedArgs.push(e);
    });

    // act
    this.dataController.loadAll().fail(function(e) {
        error = e;
    });

    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.items().length, 0, 'items count');
    assert.equal(error.message, "Test Error", 'all items is empty array');
    assert.equal(dataErrorOccurredArgs[0].message, "Test Error", 'all items is empty array');
    assert.equal(changedArgs.length, 1, "changed call count");
    assert.equal(changedArgs[0].changeType, "loadError", "changeType");
    assert.equal(changedArgs[0].error.message, "Test Error", "error message");
});


QUnit.test("loadAll skip paging", function(assert) {
    var allItems,
        changedCallCount = 0;

    this.setupDataGridModules({
        dataSource: this.array,
        paging: {
            pageSize: 3
        }
    });

    this.clock.tick();

    this.dataController.changed.add(function() {
        changedCallCount++;
    });

    // act
    this.dataController.loadAll().done(function(items) {
        allItems = items;
    });

    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.items().length, 3, 'items count');
    assert.deepEqual(this.dataController.pageSize(), 3, 'pageSize');
    assert.deepEqual(this.dataController.pageCount(), 2, 'pageCount');

    assert.deepEqual(changedCallCount, 0, 'changed call count');

    assert.deepEqual(allItems.length, 5, 'all items count');
    assert.deepEqual(allItems[0].rowType, "data", 'item 0 rowType');
    assert.deepEqual(allItems[0].data, this.array[0], 'item 0 data');
    assert.deepEqual(allItems[0].values, [1, 2, 3], 'item 0 values');

    assert.deepEqual(allItems[3].rowType, "data", 'item 3 rowType');
    assert.deepEqual(allItems[3].values, [2, 3, 6], 'item 3 values');
});

QUnit.test("loadAll grouping when remoteOperations disabled", function(assert) {
    var allItems,
        changedCallCount = 0;

    this.setupDataGridModules({
        dataSource: {
            store: this.array,
            group: 'field1'
        },
        remoteOperations: false,
        grouping: {
            autoExpandAll: false
        },
        columns: ['field1', 'field2', 'field3'],
        paging: {
            pageSize: 3
        }
    });

    this.clock.tick();

    this.dataController.changed.add(function() {
        changedCallCount++;
    });

    // act
    this.dataController.loadAll().done(function(items) {
        allItems = items;
    });

    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.items().length, 2, 'items count');
    assert.deepEqual(this.dataController.pageSize(), 3, 'pageSize');
    assert.deepEqual(this.dataController.pageCount(), 1, 'pageCount');

    assert.deepEqual(changedCallCount, 0, 'changed call count');

    assert.deepEqual(allItems.length, 7, 'all items count');
    assert.deepEqual(allItems[0].rowType, "group", 'item 0 rowType');
    assert.deepEqual(allItems[0].data.key, 1, 'item 0 data key');
    assert.ok(allItems[0].data.items, 'item 0 data items defined');
    assert.deepEqual(allItems[0].data.items.length, 2, 'item 0 data items count');
    assert.deepEqual(allItems[0].values, [1], 'item 0 values');

    assert.deepEqual(allItems[1].rowType, "data", 'item 1 rowType');
    assert.deepEqual(allItems[1].data, this.array[0], 'item 1 data');
    assert.deepEqual(allItems[1].values, [null, 2, 3], 'item 1 values');

    assert.deepEqual(allItems[3].rowType, "group", 'item 3 rowType');
    assert.deepEqual(allItems[3].data.key, 2, 'item 3 data key');
    assert.ok(allItems[3].data.items, 'item 3 data items defined');
    assert.deepEqual(allItems[3].data.items.length, 3, 'item 3 data key');
    assert.deepEqual(allItems[3].values, [2], 'item 3 values');
});

QUnit.test("loadAll grouping when remote filtering/sorting/paging enabled", function(assert) {
    var allItems,
        changedCallCount = 0;

    this.setupDataGridModules({
        dataSource: {
            store: this.array.concat(this.array),
            group: 'field1'
        },
        remoteOperations: { filtering: true, sorting: true, paging: true },
        paging: {
            pageSize: 3
        }
    });

    this.clock.tick();

    assert.deepEqual(this.dataController.pageCount(), 4, 'pageCount');


    this.dataController.changed.add(function() {
        changedCallCount++;
    });

    // act
    this.dataController.loadAll().done(function(items) {
        allItems = items;
    });

    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.items().length, 4, 'items count');
    assert.deepEqual(this.dataController.pageSize(), 3, 'pageSize');
    // T240474
    assert.deepEqual(this.dataController.pageCount(), 4, 'pageCount');

    assert.deepEqual(changedCallCount, 0, 'changed call count');

    assert.deepEqual(allItems.length, 12, 'all items count');
    assert.deepEqual(allItems[0].rowType, "group", 'item 0 rowType');
    assert.deepEqual(allItems[0].data.key, 1, 'item 0 data key');
    assert.ok(allItems[0].data.items, 'item 0 data items defined');
    assert.deepEqual(allItems[0].data.items.length, 4, 'item 0 data items count');
    assert.deepEqual(allItems[0].values, [1], 'item 0 values');

    assert.deepEqual(allItems[1].rowType, "data", 'item 1 rowType');
    assert.deepEqual(allItems[1].data, this.array[0], 'item 1 data');
    assert.deepEqual(allItems[1].values, [null, 2, 3], 'item 1 values');

    assert.deepEqual(allItems[5].rowType, "group", 'item 5 rowType');
    assert.deepEqual(allItems[5].data.key, 2, 'item 5 data key');
    assert.ok(allItems[5].data.items, 'item 3 data items defined');
    assert.deepEqual(allItems[5].data.items.length, 6, 'item 5 items count');
    assert.deepEqual(allItems[5].values, [2], 'item 5 values');
});

QUnit.test("loadAll when remote summary enabled", function(assert) {
    var allItems,
        allSummary,
        changedCallCount = 0;

    var loadArgs = [];

    this.setupDataGridModules({
        dataSource: {
            load: function(e) {
                loadArgs.push(e);

                return $.Deferred().resolve([
                    { field1: 1, field2: 2 }, { field1: 3, field2: 4 }],
                    { totalCount: 2, summary: [6] }
                );
            }
        },
        summary: {
            totalItems: [{
                column: "field2",
                summaryType: "sum"
            }]
        },
        remoteOperations: true,
        paging: {
            pageSize: 3
        }
    });

    this.clock.tick();

    assert.deepEqual(this.dataController.pageCount(), 1, 'pageCount');


    this.dataController.changed.add(function() {
        changedCallCount++;
    });

    // act
    this.dataController.loadAll().done(function(items, summary) {
        allItems = items;
        allSummary = summary;
    });

    this.clock.tick();

    // assert
    assert.deepEqual(changedCallCount, 0, 'changed call count');
    assert.deepEqual(allItems.length, 2, 'all items count');
    assert.deepEqual(allSummary, [6], 'all summary');
    assert.deepEqual(loadArgs.length, 2, "load count");
    assert.deepEqual(loadArgs[0].skip, 0, "initial load skip");
    assert.deepEqual(loadArgs[0].take, 3, "initial load take");
    assert.deepEqual(loadArgs[0].totalSummary, [{ selector: "field2", summaryType: "sum" }], "initial load totalSummary");
    assert.deepEqual(loadArgs[0].groupSummary, undefined, "initial load groupSummary is not defined");
    assert.deepEqual(loadArgs[1].skip, undefined, "loadAll skip");
    assert.deepEqual(loadArgs[1].take, undefined, "loadAll load take");
    assert.deepEqual(loadArgs[1].totalSummary, [{ selector: "field2", summaryType: "sum" }], "loadAll totalSummary");
    assert.deepEqual(loadArgs[1].groupSummary, undefined, "loadAll groupSummary is not defined");
});

// T324247
QUnit.test("loadAll when remote grouping and summary enabled", function(assert) {
    var allItems,
        allSummary,
        changedCallCount = 0;

    var loadArgs = [];

    this.setupDataGridModules({
        dataSource: {
            load: function(e) {
                loadArgs.push(e);

                if(e.group) {
                    return $.Deferred().resolve([
                        { key: 1, summary: [2], items: null, count: 1 }, { key: 3, summary: [4], items: null, count: 1 }],
                        { summary: [4] }
                    );
                } else {
                    return $.Deferred().resolve([
                        { field1: 1, field2: 2 }, { field1: 3, field2: 4 }],
                        { summary: [4] }
                    );
                }
            },
            group: "field1"
        },
        grouping: {
            autoExpandAll: false
        },
        summary: {
            groupItems: [{
                column: "field2",
                summaryType: "sum"
            }],
            totalItems: [{
                column: "field1",
                summaryType: "sum"
            }]
        },
        columns: ["field1", "field2"],
        remoteOperations: true,
        paging: {
            pageSize: 3
        }
    });

    this.clock.tick();

    assert.deepEqual(this.dataController.pageCount(), 1, 'pageCount');


    this.dataController.changed.add(function() {
        changedCallCount++;
    });

    // act
    this.dataController.loadAll().done(function(items, summary) {
        allItems = items;
        allSummary = summary;
    });

    this.clock.tick();

    // assert
    assert.deepEqual(changedCallCount, 0, 'changed call count');
    assert.deepEqual(allItems.length, 4, 'all items count');
    assert.deepEqual(allItems[0].data, { key: 1, count: 1, items: [{ field1: 1, field2: 2 }], summary: [2] }, 'item 0');
    assert.deepEqual(allItems[1].data, { field1: 1, field2: 2 }, 'item 1');
    assert.deepEqual(allItems[2].data, { key: 3, count: 1, items: [{ field1: 3, field2: 4 }], summary: [4] }, 'item 2');
    assert.deepEqual(allItems[3].data, { field1: 3, field2: 4 }, 'item 3');
    assert.deepEqual(allSummary, [4], 'all summary exists');
    assert.deepEqual(loadArgs.length, 3, "load count");
    assert.deepEqual(loadArgs[0].skip, undefined, "initial load skip");
    assert.deepEqual(loadArgs[0].take, undefined, "initial load take");
    assert.deepEqual(loadArgs[0].group, [{ selector: "field1", isExpanded: false, desc: false }], "initial load group");
    assert.deepEqual(loadArgs[0].totalSummary, [{ selector: "field1", summaryType: "sum" }], "initial load totalSummary");
    assert.deepEqual(loadArgs[0].groupSummary, [{ selector: "field2", summaryType: "sum" }], "initial load groupSummary");
    assert.deepEqual(loadArgs[1].skip, undefined, "loadAll skip");
    assert.deepEqual(loadArgs[1].take, undefined, "loadAll load take");
    assert.deepEqual(loadArgs[1].group, [{ selector: "field1", isExpanded: false, desc: false }], "loadAll load group");
    assert.deepEqual(loadArgs[1].totalSummary, [{ selector: "field1", summaryType: "sum" }], "loadAll totalSummary");
    assert.deepEqual(loadArgs[1].groupSummary, [{ selector: "field2", summaryType: "sum" }], "loadAll groupSummary");
    assert.deepEqual(loadArgs[2].skip, undefined, "loadAll skip");
    assert.deepEqual(loadArgs[2].take, undefined, "loadAll load take");
    assert.deepEqual(loadArgs[2].group, null, "loadAll load group");
    assert.deepEqual(loadArgs[2].totalSummary, [{ selector: "field1", summaryType: "sum" }], "loadAll totalSummary");
    assert.deepEqual(loadArgs[2].groupSummary, [{ selector: "field2", summaryType: "sum" }], "loadAll groupSummary");
});

// T437259, T433659
QUnit.test("loadAll by selected items when remote grouping and summary enabled", function(assert) {
    var allItems,
        allSummary,
        changedCallCount = 0;

    var loadArgs = [];

    this.setupDataGridModules({
        dataSource: {
            load: function(e) {
                loadArgs.push(e);

                if(e.group) {
                    return $.Deferred().resolve([
                        { key: 1, summary: [2], items: null, count: 1 }, { key: 3, summary: [4], items: null, count: 1 }],
                        { summary: [4] }
                    );
                } else {
                    return $.Deferred().resolve([
                        { field1: 1, field2: 2 }, { field1: 3, field2: 4 }],
                        { summary: [4] }
                    );
                }
            },
            group: "field1"
        },
        grouping: {
            autoExpandAll: false
        },
        summary: {
            groupItems: [{
                column: "field2",
                summaryType: "sum"
            }],
            totalItems: [{
                column: "field1",
                summaryType: "sum"
            }]
        },
        columns: ["field1", "field2"],
        remoteOperations: true,
        paging: {
            pageSize: 3
        }
    });

    this.clock.tick();

    assert.deepEqual(this.dataController.pageCount(), 1, 'pageCount');


    this.dataController.changed.add(function() {
        changedCallCount++;
    });

    // act
    loadArgs = [];

    this.dataController.loadAll([{ field1: 1, field2: 2 }]).done(function(items, summary) {
        allItems = items;
        allSummary = summary;
    });

    this.clock.tick();

    // assert
    assert.deepEqual(loadArgs.length, 0, "load count");
    assert.deepEqual(changedCallCount, 0, 'changed call count');
    assert.deepEqual(allItems.length, 2, 'all items count');
    assert.deepEqual(allItems[0].data, { key: 1, items: [{ field1: 1, field2: 2 }], aggregates: [2] }, 'item 0');
    assert.deepEqual(allItems[1].data, { field1: 1, field2: 2 }, 'item 1');
    assert.deepEqual(allSummary, [1], 'all summary exists');
    // T433659
    assert.deepEqual(this.dataController.getTotalSummaryValue("field1"), 4);
});

QUnit.test("Skip detail row when loadAll is applied", function(assert) {
    var allItems;

    this.setupDataGridModules({
        dataSource: this.array,
        masterDetail: {
            enabled: true,
            template: function() { }
        },
        paging: {
            pageSize: 3
        }
    });

    this.clock.tick();

    // act
    this.dataController.expandRow(this.array[0]);

    this.dataController.loadAll().done(function(items) {
        allItems = items;
    });

    this.clock.tick();

    // assert
    assert.equal(this.dataController.items()[1].rowType, "detail", "detail row in original items");

    assert.deepEqual(allItems.length, 5, 'all items count');
    assert.deepEqual(allItems[0].rowType, "data", 'item 0 rowType');
    assert.deepEqual(allItems[1].rowType, "data", 'item 1 rowType');
    assert.deepEqual(allItems[2].rowType, "data", 'item 2 rowType');
    assert.deepEqual(allItems[3].rowType, "data", 'item 3 rowType');
    assert.deepEqual(allItems[4].rowType, "data", 'item 4 rowType');
});

QUnit.test("LoadAll and modified values", function(assert) {
    var allItems;

    this.setupDataGridModules({
        dataSource: this.array,
        editing: {
            mode: "batch"
        },
        paging: {
            pageSize: 3
        }
    });

    this.clock.tick();

    // act
    this.editingController.updateFieldValue({
        key: this.array[0],
        column: {
            setCellValue: function(data, value) { data.field1 = value; }
        }
    }, 13);

    this.dataController.loadAll().done(function(items) {
        allItems = items;
    });

    this.clock.tick();

    // assert
    assert.deepEqual(allItems.length, 5, 'all items count');
    assert.deepEqual(allItems[0].data, { field1: 13, field2: 2, field3: 3 }, 'item 0 data');
    assert.deepEqual(allItems[0].values, [13, 2, 3], 'item 0 values');
});

QUnit.test("LoadAll and filtering", function(assert) {
    var allItems;

    this.setupDataGridModules({
        dataSource: this.array,
        paging: {
            pageSize: 3
        },
        columns: ["field1", { dataField: "field2", filterValue: 3 }, "field3"]
    });

    this.clock.tick();

    // act
    this.dataController.loadAll().done(function(items) {
        allItems = items;
    });

    this.clock.tick();

    // assert
    assert.deepEqual(allItems.length, 2, 'all items count');
    assert.deepEqual(allItems[0].data, this.array[3], 'item 0 data');
    assert.deepEqual(allItems[1].data, this.array[4], 'item 1 data');
});

QUnit.test("LoadAll and grouped field with dataType", function(assert) {
    var allItems;

    var array = [{ group: "1", id: 1 }, { group: "1", id: 2 }];
    this.setupDataGridModules({
        dataSource: array,
        columns: [{ dataField: "group", dataType: "number", groupIndex: 0 }, "id"]
    });

    this.clock.tick();

    // act
    this.dataController.loadAll().done(function(items) {
        allItems = items;
    });

    this.clock.tick();

    // assert
    assert.deepEqual(allItems.length, 3, 'all items count');
    assert.deepEqual(allItems[0].key, [1], 'group row key');
    assert.deepEqual(allItems[0].data, { key: 1, items: array }, 'group row data');
});

QUnit.test("loadAll during data loading", function(assert) {
    var isLoadAllFailed;

    this.setupDataGridModules({
        dataSource: this.array,
        paging: {
            pageSize: 3
        }
    });


    // act
    this.dataController.loadAll().fail(function() {
        isLoadAllFailed = true;
    });

    this.clock.tick();

    // assert
    assert.ok(isLoadAllFailed, "loadAll failed");
    assert.equal(this.dataController.items().length, 3, 'items count');
    assert.ok(!this.dataController.isLoading(), 'no loading');
});

QUnit.test("data loading during loadAll", function(assert) {
    var isLoadAllFailed,
        allItems;

    this.setupDataGridModules({
        dataSource: this.array,
        paging: {
            pageSize: 3
        },
        columns: ["field1", "field2", "field3"]
    });

    this.clock.tick();


    // act
    this.dataController.loadAll().fail(function() {
        isLoadAllFailed = true;
    }).done(function(data) {
        allItems = data;
    });

    this.dataController.pageIndex(1);

    this.clock.tick();

    // assert
    assert.ok(!isLoadAllFailed, "loadAll is not failed");
    assert.equal(allItems.length, 5, 'items count');
    assert.equal(this.dataController.pageIndex(), 1, "pageIndex");
    assert.equal(this.dataController.items().length, 2, 'items count');
    assert.deepEqual(this.dataController.items()[0].data, this.array[3], 'item 0 data from second page');
    assert.ok(!this.dataController.isLoading(), 'no loading');
});

QUnit.test("LoadAll when scrolling mode is virtual", function(assert) {
    var allItems;

    this.setupDataGridModules({
        dataSource: this.array,
        scrolling: {
            mode: "virtual"
        },
        paging: {
            pageSize: 3
        }
    });

    this.clock.tick();

    // act
    this.dataController.loadAll().done(function(items) {
        allItems = items;
    });

    this.clock.tick();

    // assert
    assert.deepEqual(allItems.length, 5, 'all items count');
    assert.deepEqual(allItems[0].data, { field1: 1, field2: 2, field3: 3 }, 'item 0 data');
    assert.deepEqual(allItems[0].values, [1, 2, 3], 'item 0 values');
});

QUnit.test("Load ALL with data parameter", function(assert) {
    var allItems,
        changedCallCount = 0;

    this.setupDataGridModules({
        dataSource: this.array,
        paging: {
            pageSize: 3
        }
    });

    this.clock.tick();

    this.dataController.changed.add(function() {
        changedCallCount++;
    });

    // act
    this.dataController.loadAll([this.array[1], this.array[3]]).done(function(items) {
        allItems = items;
    });

    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.items().length, 3, 'items count');
    assert.deepEqual(this.dataController.pageSize(), 3, 'pageSize');
    assert.deepEqual(this.dataController.pageCount(), 2, 'pageCount');

    assert.deepEqual(changedCallCount, 0, 'changed call count');

    assert.deepEqual(allItems.length, 2, 'all items count');
    assert.deepEqual(allItems[0].rowType, "data", 'item 0 rowType');
    assert.deepEqual(allItems[0].data, this.array[1], 'item 0 data');
    assert.deepEqual(allItems[0].values, [1, 2, 4], 'item 0 values');

    assert.deepEqual(allItems[1].rowType, "data", 'item 1 rowType');
    assert.deepEqual(allItems[1].data, this.array[3], 'item 1 rowType');
    assert.deepEqual(allItems[1].values, [2, 3, 6], 'item 1 values');
});

QUnit.test("loadAll with data parameter and grouping", function(assert) {
    var allItems,
        changedCallCount = 0;

    this.setupDataGridModules({
        dataSource: {
            store: this.array,
            group: 'field1'
        },
        remoteOperations: false,
        grouping: {
            autoExpandAll: false
        },
        columns: ['field1', 'field2', 'field3'],
        paging: {
            pageSize: 3
        }
    });

    this.clock.tick();

    this.dataController.changed.add(function() {
        changedCallCount++;
    });

    // act
    this.dataController.loadAll([this.array[0], this.array[3], this.array[4]]).done(function(items) {
        allItems = items;
    });

    this.clock.tick();

    // assert
    assert.deepEqual(this.dataController.items().length, 2, 'items count');
    assert.deepEqual(this.dataController.pageSize(), 3, 'pageSize');
    assert.deepEqual(this.dataController.pageCount(), 1, 'pageCount');

    assert.deepEqual(changedCallCount, 0, 'changed call count');

    assert.deepEqual(allItems.length, 5, 'all items count');

    assert.deepEqual(allItems[0].rowType, "group", 'rowType');
    assert.deepEqual(allItems[0].data.key, 1, 'data key');
    assert.ok(allItems[0].data.items, 'data items');
    assert.deepEqual(allItems[0].data.items.length, 1, 'data items count');
    assert.deepEqual(allItems[0].values, [1], 'values');

    assert.deepEqual(allItems[1].rowType, "data", 'rowType');
    assert.deepEqual(allItems[1].data, this.array[0], 'data');
    assert.deepEqual(allItems[1].values, [null, 2, 3], 'values');

    assert.deepEqual(allItems[2].rowType, "group", 'rowType');
    assert.deepEqual(allItems[2].data.key, 2, 'data key');
    assert.ok(allItems[2].data.items, 'data items');
    assert.deepEqual(allItems[2].data.items.length, 2, 'data items count');
    assert.deepEqual(allItems[2].values, [2], 'values');

    assert.deepEqual(allItems[3].rowType, "data", 'rowType');
    assert.deepEqual(allItems[3].data, this.array[3], 'data');
    assert.deepEqual(allItems[3].values, [null, 3, 6], 'values');

    assert.deepEqual(allItems[4].rowType, "data", 'rowType');
    assert.deepEqual(allItems[4].data, this.array[4], 'data');
    assert.deepEqual(allItems[4].values, [null, 3, 7], 'values');
});

// T595243
QUnit.test("loadAll with data parameter and filtering", function(assert) {
    var allItems;

    this.setupDataGridModules({
        dataSource: this.array,
        columns: [{ dataField: 'field1', filterValues: [2] }, 'field2', 'field3']
    });

    this.clock.tick();

    // act
    this.dataController.loadAll([this.array[1], this.array[2], this.array[3]]).done(function(items) {
        allItems = items;
    });

    this.clock.tick();

    // assert
    assert.equal(allItems.length, 2, 'two items are loaded');
    assert.equal(allItems[0].data, this.array[2], 'item 0');
    assert.equal(allItems[1].data, this.array[3], 'item 1');
});

QUnit.test("LoadAll with data parameter and modified values", function(assert) {
    var allItems;

    this.setupDataGridModules({
        dataSource: this.array,
        editing: {
            mode: "batch"
        },
        paging: {
            pageSize: 3
        }
    });

    this.clock.tick();

    // act
    this.editingController.updateFieldValue({
        key: this.array[0],
        column: {
            setCellValue: function(data, value) { data.field1 = value; }
        }
    }, 13);

    this.dataController.loadAll([this.array[0], this.array[1]]).done(function(items) {
        allItems = items;
    });

    this.clock.tick();

    // assert
    assert.deepEqual(allItems.length, 2, 'all items count');
    assert.deepEqual(allItems[0].data, { field1: 13, field2: 2, field3: 3 }, 'item 0 data');
    assert.deepEqual(allItems[0].values, [13, 2, 3], 'item 0 values');
    assert.deepEqual(allItems[1].data, { field1: 1, field2: 2, field3: 4 }, 'item 0 data');
    assert.deepEqual(allItems[1].values, [1, 2, 4], 'item 1 values');
});

QUnit.module("onOptionChanged", {
    beforeEach: function() {
        this.array = [
            { field1: 1, field2: "test1" },
            { field1: 2, field2: "test2" },
            { field1: 3, field2: "test3" },
            { field1: 4, field2: "test4" },
            { field1: 5, field2: "test5" },
            { field1: 6, field2: "test6" }
        ];
        this.options = {
            dataSource: this.array,
            paging: { enabled: true, pageSize: 2 }
        };
        setupModule.apply(this);
        sinon.spy(this, "option");
    },
    afterEach: function() {
        teardownModule.apply(this);
        this.option.restore();
    }
}, function() {
    QUnit.test("Event should be fired when changing the pageSize", function(assert) {
        // arrange
        var that = this;

        // act
        that.dataController.pageSize(4).done(function() {
            // assert
            assert.ok(that.option.withArgs("paging.pageSize", 4).calledOnce, "onOptionChanged args");
        });
    });

    QUnit.test("Event should be fired when changing the pageIndex", function(assert) {
        // arrange
        var that = this;

        // act
        that.dataController.pageIndex(1).done(function(items) {
            // assert
            assert.deepEqual(items, [{ field1: 3, field2: "test3" }, { field1: 4, field2: "test4" }], "items of second page");
            assert.ok(that.option.withArgs("paging.pageIndex", 1).calledOnce, "onOptionChanged args");
        });
    });

    QUnit.test("Checking pageSize of the dataSource when optionChanged is fired", function(assert) {
        // arrange
        var pageSize,
            that = this;

        that.option.restore();
        sinon.stub(that, "option", function(optionName, value) {
            if(optionName === "paging.pageSize" && value === 3) {
                pageSize = that.dataController.dataSource().pageSize();
            }
        });

        // act
        that.dataController.pageSize(3).done(function() {
            // assert
            assert.strictEqual(pageSize, 3, "pageSize");
        });
    });
});
