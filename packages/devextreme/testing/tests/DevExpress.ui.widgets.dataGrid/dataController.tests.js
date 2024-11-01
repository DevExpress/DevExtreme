import $ from 'jquery';
import config from 'core/config';
import formatHelper from 'format_helper';
import errors from 'ui/widget/ui.errors';
import { errors as dataErrors } from 'common/data/errors';
import typeUtils from 'core/utils/type';
import { DataSource } from 'common/data/data_source/data_source';
import ArrayStore from 'common/data/array_store';
import gridCoreUtils from '__internal/grids/grid_core/m_utils';
import { setupDataGridModules, MockGridDataSource } from '../../helpers/dataGridMocks.js';

import 'ui/data_grid';

const TEN_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const rowsViewMock = {
    getTopVisibleItemIndex: () => 0,
    waitAsyncTemplates: () => $.Deferred().resolve(),
    _getCellElement: () => {},
    scrollToRowElement: () => {},
    getRowElement: () => {},
};

const createDataSource = function(data, storeOptions, dataSourceOptions) {
    const arrayStore = new ArrayStore(storeOptions ? $.extend(true, { data: data }, storeOptions) : data);
    const dataSource = new DataSource($.extend(true, { store: arrayStore, requireTotalCount: true, _preferSync: true }, dataSourceOptions));
    return dataSource;
};

const setupModule = function() {
    setupDataGridModules(this, [
        'data',
        'virtualScrolling',
        'columns',
        'filterRow',
        'search',
        'editing',
        'editingRowBased',
        'editingFormBased',
        'editingCellBased',
        'grouping',
        'headerFilter',
        'masterDetail',
        'editorFactory',
        'focus',
        'keyboardNavigation',
        'summary',
        'selection',
        'virtualColumns'
    ]);

    this.applyOptions = function(options) {
        $.extend(true, this.options, options);
        this.columnsController.init();
    };

    this.options.editing = this.options.editing || {};
    $.extend(this.options.editing, {
        confirmDelete: true,
        texts: {
            confirmDeleteMessage: 'Are you sure?'
        }
    });

    this.clock = sinon.useFakeTimers();
    this.editingController.getFirstEditableCellInRow = function() { return $([]); };
};

const teardownModule = function() {
    this.dispose();
    this.clock.restore();
};

QUnit.module('Initialization', { beforeEach: setupModule, afterEach: teardownModule }, () => {

    QUnit.test('No initialization', function(assert) {
        assert.deepEqual(this.dataController.items(), []);
        assert.ok(!this.dataController.isLoading());
        assert.ok(this.dataController.isLoaded());
    });

    QUnit.test('Initialize from dataSource with all visible columns', function(assert) {
        const array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Dan', phone: '98-75-21' }
        ];

        const dataSource = createDataSource(array, { key: 'name' });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        assert.equal(this.dataController.items().length, 2);
        assert.deepEqual(this.dataController.items()[0].values, ['Alex', '55-55-55']);
        assert.deepEqual(this.dataController.items()[1].values, ['Dan', '98-75-21']);
        assert.deepEqual(this.dataController.items()[0].data, { name: 'Alex', phone: '55-55-55' });
        assert.deepEqual(this.dataController.items()[1].data, { name: 'Dan', phone: '98-75-21' });
    });

    QUnit.test('Initialize from dataSource when dataSource has null item', function(assert) {
        const array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Dan', phone: '98-75-21' },
            null
        ];

        const dataSource = createDataSource(array);

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        assert.equal(this.dataController.items().length, 2);
        assert.deepEqual(this.dataController.items()[0].values, ['Alex', '55-55-55']);
        assert.deepEqual(this.dataController.items()[1].values, ['Dan', '98-75-21']);
        assert.deepEqual(this.dataController.items()[0].data, { name: 'Alex', phone: '55-55-55' });
        assert.deepEqual(this.dataController.items()[1].data, { name: 'Dan', phone: '98-75-21' });
    });

    QUnit.test('Initialize from options with invisible columns', function(assert) {
        const array = [
            { name: 'Alex', age: 20, phone: '55-55-55' },
            { name: 'Dan', age: 30, phone: '98-75-21' }
        ];
        const dataSource = createDataSource(array);

        this.applyOptions({ columns: ['name', { dataField: 'age', visible: false }, 'phone'] });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        assert.equal(this.dataController.items().length, 2);
        assert.deepEqual(this.dataController.items()[0].values, ['Alex', '55-55-55']);
        assert.deepEqual(this.dataController.items()[1].values, ['Dan', '98-75-21']);
    });

    QUnit.test('Initialize array with keyExpr option', function(assert) {
        // act
        this.option('dataSource', []);
        this.option('keyExpr', 'id');

        // assert
        assert.equal(this.getDataSource().store().key(), 'id', 'keyExpr is assigned to store');
    });

    QUnit.test('Raise warning if keyExp is set and dataSource is not an array', function(assert) {
    // arrange
        const dataSource = new DataSource({
            load: function() {
                return [
                    { name: 'Alex', phone: '55-55-55' },
                    { name: 'Dan', phone: '98-75-21' }
                ];
            }
        });
        sinon.spy(errors, 'log');

        // act
        this.applyOptions({ keyExpr: 'name', dataSource: dataSource });
        this.dataController.init();

        // assert
        assert.equal(errors.log.lastCall.args[0], 'W1011', 'Warning about keyExpr is raised');
        assert.equal(errors.log.callCount, 1, 'Warning about keyExpr is raised one time');
        errors.log.restore();
    });

    QUnit.test('Not raise W1011 warning if dataSource is undefined', function(assert) {
    // arrange, act
        sinon.spy(errors, 'log');
        this.applyOptions({ keyExpr: 'name', dataSource: undefined });
        this.dataController.init();

        // assert
        assert.equal(errors.log.callCount, 0, 'Warning about keyExpr is not raised');
        errors.log.restore();
    });

    QUnit.test('changed on initialize', function(assert) {
        let changedCount = 0;
        let lastArgs;
        const array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Dan', phone: '98-75-21' }
        ];
        const dataSource = createDataSource(array);


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

    QUnit.test('The pushed callback on initialize', function(assert) {
        // arrange
        const pushedSpy = sinon.spy();
        const array = [
            { id: 0, name: 'Alex', phone: '55-55-55' },
            { id: 1, name: 'Dan', phone: '98-75-21' }
        ];
        const dataSource = createDataSource(array, { key: 'id' });

        this.dataController.pushed.add(pushedSpy);

        // assert
        assert.strictEqual(pushedSpy.callCount, 0, 'the pushed callback was not called');

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        // act
        dataSource.store().push([{ type: 'remove', key: 1 }]);
        this.clock.tick(10);

        // assert
        assert.strictEqual(pushedSpy.callCount, 1, 'the pushed callback was called only once');
        assert.deepEqual(pushedSpy.getCall(0).args[0], [{ type: 'remove', key: 1 }], 'the pushed callback args');
    });

    QUnit.test('The handler of the dataSource pushed callback should be removed after disposing dataSource', function(assert) {
        // arrange
        const dataPushedHandlerSpy = sinon.spy();
        const array = [
            { id: 0, name: 'Alex', phone: '55-55-55' },
            { id: 1, name: 'Dan', phone: '98-75-21' }
        ];
        let dataSource = createDataSource(array, { key: 'id' });

        this.dataController._dataPushedHandler = dataPushedHandlerSpy;
        this.dataController.setDataSource(dataSource);
        dataSource = this.dataController.dataSource();
        dataSource.load();

        // assert
        assert.ok(dataSource.pushed.has(dataPushedHandlerSpy), 'the pushed callback has handler');
        assert.strictEqual(dataPushedHandlerSpy.callCount, 0);

        // act
        dataSource.store().push([{ type: 'remove', key: 1 }]);
        this.clock.tick(10);

        // assert
        assert.strictEqual(dataPushedHandlerSpy.callCount, 1, 'the handler of the pushed callback was called only once');

        // act
        this.dataController.dispose();

        // assert
        assert.notOk(dataSource.pushed.has(dataPushedHandlerSpy), 'the pushed callback has no handler');
    });

    // B255430
    QUnit.test('Call changed after all columnsChanged', function(assert) {
    // arrange
        const that = this;
        let changedCount = 0;
        let columnsChangedCount = 0;
        const array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Dan', phone: '98-75-21' }
        ];
        const dataSource = createDataSource(array);

        that.dataController.setDataSource(dataSource);
        dataSource.load();

        that.dataController.changed.add(function() {
            changedCount++;

            // assert
            assert.equal(columnsChangedCount, 1, 'columnChangedCount');
        });

        that.columnsController.columnsChanged.add(function() {
            columnsChangedCount++;

            // assert
            assert.equal(changedCount, 0, 'changedCount');
        });

        // act
        that.columnsController.columnOption(0, 'visible', false);

        // assert
        assert.equal(changedCount, 1, 'changedCount');
        assert.equal(columnsChangedCount, 1, 'columnChangedCount');
    });

    QUnit.test('events rising on second initialize shared dataSource', function(assert) {
        let changedCount = 0;
        const dataSource = createDataSource([]);
        this.dataController.changed.add(function(args) {
            changedCount++;
        });

        // act
        this.option('dataSource', dataSource);

        // assert
        assert.strictEqual(changedCount, 1, 'changed called');
        assert.ok(!dataSource._disposed, 'dataSource is not disposed');
    });

    QUnit.test('events rising on second initialize not shared dataSource', function(assert) {
        let changedCount = 0;

        this.option('dataSource', []);

        const dataSource = this.dataController.dataSource()._dataSource;

        this.dataController.changed.add(function(args) {
            changedCount++;
        });

        // act
        this.option('dataSource', []);

        // assert
        assert.ok(dataSource, 'dataSource created');
        assert.ok(dataSource._disposed, 'dataSource is disposed');
        assert.strictEqual(changedCount, 1, 'changed called');
    });

    QUnit.test('dataSource should be disposed after calling dispose method', function(assert) {
        const dataSource = createDataSource([]);

        this.dataController.setDataSource(dataSource);

        // act
        this.dataController.dispose();

        // assert
        assert.ok(dataSource._disposed, 'dataSource is disposed');
        assert.strictEqual(this.dataController._dataSource, null, 'dataSourceAdapter is removed');
    });

    // T697860
    QUnit.test('loading should be rised once on change dataSource and grouping', function(assert) {
        const loadingSpy = sinon.spy();

        // act
        this.applyOptions({
            loadingTimeout: 0,
            dataSource: createDataSource([], {
                onLoading: loadingSpy
            })
        });

        this.dataController.optionChanged({ name: 'dataSource' });
        this.dataController.optionChanged({ name: 'grouping' });
        this.clock.tick(10);

        // assert
        assert.strictEqual(loadingSpy.callCount, 1, 'loading called once');
    });

    // T899513
    QUnit.test('loading should be canceled after change dataSource to null', function(assert) {
        const loadingChangedSpy = sinon.spy();

        // act
        const dataSource = new DataSource({
            load: function() {
                return $.Deferred().promise();
            },
            onLoadingChanged: loadingChangedSpy
        });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        // act
        this.dataController.setDataSource(null);

        // assert
        assert.strictEqual(loadingChangedSpy.callCount, 2, 'loadingChanged call count');
        assert.deepEqual(loadingChangedSpy.getCalls().map(c => c.args[0]), [true, false], 'loadingChanged call args');
    });

    QUnit.test('update rows on columnsChanged (changeType == \'columns\')', function(assert) {
        let changedCount = 0;
        const array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Dan', phone: '98-75-21' }
        ];
        const dataSource = createDataSource(array);

        this.dataController.changed.add(function(args) {
            changedCount++;
        });


        this.dataController.setDataSource(dataSource);
        dataSource.load();

        const rows = this.dataController.items();
        this.columnsController.columnOption(1, 'visible', false);

        assert.notStrictEqual(this.dataController.items(), rows);
        assert.strictEqual(changedCount, 2);

        assert.deepEqual(this.dataController.items()[0].values, ['Alex']);
        assert.deepEqual(this.dataController.items()[1].values, ['Dan']);
    });

    // T134124
    QUnit.test('update rows on columnsChanged when asyncLoadEnabled and column that need converting exists (changeType == \'columns\')', function(assert) {
        let changedCount = 0;
        const array = [
            { name: 'Alex', phone: '55-55-55', age: '19' },
            { name: 'Dan', phone: '98-75-21', age: '23' }
        ];

        this.options.loadingTimeout = 0;
        this.options.customizeColumns = function(columns) {
            columns[2].dataType = 'number';
        };
        const dataSource = createDataSource(array);

        this.dataController.changed.add(function(args) {
            changedCount++;
        });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        this.clock.tick(10);

        const items = this.dataController.items();
        this.columnsController.columnOption(1, 'visible', false);

        this.clock.tick(10);

        assert.notStrictEqual(this.dataController.items(), items);
        assert.strictEqual(changedCount, 2);

        assert.deepEqual(this.dataController.items()[0].values, ['Alex', 19]);
        assert.deepEqual(this.dataController.items()[1].values, ['Dan', 23]);
    });

    // B253046
    QUnit.test('Load sorting from state when columns generated by dataSource', function(assert) {
    // arrange
        const array = [
            { name: 'Alex', age: 30 },
            { name: 'Dan', age: 25 },
            { name: 'Bob', age: 20 }
        ];
        const dataSource = createDataSource(array);

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
    QUnit.test('set isExpanded group parameters to dataSource on initialization', function(assert) {
    // arrange
        let changedCallCount = 0;
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
        assert.equal(changedCallCount, 1, 'changed called one time'); // T122785
    });

    // T221453
    QUnit.test('grouping with autoExpandAll is false', function(assert) {
    // arrange
        let changedCallCount = 0;
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
        assert.equal(changedCallCount, 1, 'changed called one time');
    });

    // B254110
    QUnit.test('collapseAll when grouped column with dataType', function(assert) {
    // arrange
        let changedCallCount = 0;
        let loadingCount = 0;

        this.applyOptions({
            commonColumnSettings: { autoExpandGroup: true },
            dataSource: {
                store: {
                    type: 'array',
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
        assert.equal(loadingCount, 1, 'loading called one time');

        // assert
        assert.deepEqual(this.dataController._dataSource.group(), [{ selector: 'name', isExpanded: true, desc: false }]);
        assert.equal(this.dataController.items()[0].data.key, 'Alex');
        assert.equal(this.dataController.items()[0].data.items.length, 1);

        // act
        this.dataController.collapseAll();

        this.clock.tick(10);

        // assert
        assert.equal(changedCallCount, 1, 'changed called one time');
        // T372049
        assert.equal(loadingCount, 1, 'loading is not called on collapseAll');
        assert.deepEqual(this.dataController._dataSource.group(), [{ selector: 'name', isExpanded: false, desc: false }]);
        assert.equal(this.dataController.items()[0].data.key, 'Alex');
        assert.strictEqual(this.dataController.items()[0].data.items, null);
    });

    // T372049
    QUnit.test('collapseAll when remoteOperations with grouping and without paging', function(assert) {
    // arrange
        let changedCallCount = 0;
        const loadingArgs = [];

        this.applyOptions({
            commonColumnSettings: { autoExpandGroup: true },
            remoteOperations: { grouping: true, sorting: true },
            dataSource: {
                store: {
                    type: 'array',
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
        assert.equal(loadingArgs.length, 1, 'loading called one time');
        assert.deepEqual(loadingArgs[0].group, [{ selector: 'name', isExpanded: true, desc: false }], 'loading group arg');

        // assert
        assert.deepEqual(this.dataController._dataSource.group(), [{ selector: 'name', isExpanded: true, desc: false }]);
        assert.equal(this.dataController.items()[0].data.key, 'Alex');
        assert.equal(this.dataController.items()[0].data.items.length, 1);

        // act
        this.dataController.collapseAll();

        this.clock.tick(10);

        // assert
        assert.equal(changedCallCount, 1, 'changed called one time after collapseAll');
        // T372049
        assert.equal(loadingArgs.length, 1, 'loading is not called after collapseAll');
        assert.deepEqual(this.dataController._dataSource.group(), [{ selector: 'name', isExpanded: false, desc: false }]);
        assert.equal(this.dataController.items()[0].data.key, 'Alex');
        assert.strictEqual(this.dataController.items()[0].data.items, null);
    });

    QUnit.test('collapseAll when several columns grouped', function(assert) {
    // arrange
        let changedCallCount = 0;
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
        this.clock.tick(10);

        this.dataController.expandRow(['Alex']);

        // assert
        assert.equal(changedCallCount, 2, 'changed called two times');

        const items = this.dataController.items();
        assert.deepEqual(items[0].key, ['Alex'], 'row 0 key');
        assert.ok(items[0].isExpanded, 'row 0 isExpanded');
        assert.deepEqual(items[1].key, ['Alex', 30], 'row 1 key');
        assert.ok(!items[1].isExpanded, 'row 1 isExpanded');
        assert.deepEqual(items[2].key, ['Bob'], 'row 2 key');
        assert.ok(!items[2].isExpanded, 'row 2 isExpanded');
    });

    QUnit.test('the number of visible items should be identical after expandAll/collapseAll', function(assert) {
        const dataItems = [];

        $.each(TEN_NUMBERS, function(value) {
            dataItems.push({
                'field1': 'group' + value,
                'field2': 'firstItem'
            });

            dataItems.push({
                'field1': 'group' + value,
                'field2': 'secondItem'
            });
        });

        this.applyOptions({
            scrolling: { mode: 'virtual' },
            dataSource: dataItems,
            columns: [
                {
                    'name': 'field1',
                    'dataField': 'field1',
                    groupIndex: 0
                },
                {
                    'name': 'field2',
                    'dataField': 'field2'
                }
            ]
        });

        this.dataController._refreshDataSource();

        const itemsCount = this.dataController.items().length;

        // act
        this.dataController.expandAll();
        this.dataController.collapseAll();

        // assert
        assert.equal(this.dataController.items().length, itemsCount, 'There are no excess items');
    });

    // T922884
    QUnit.test('expandAll for second level if calculateDisplayValue is defined and autoExpandGroup is false', function(assert) {
        this.applyOptions({
            dataSource: [{ group1: 'group1', group2: 'group2', id: 1 }],
            columns: [
                {
                    dataField: 'group1',
                    groupIndex: 0,
                    autoExpandGroup: true
                },
                {
                    dataField: 'group2',
                    groupIndex: 1,
                    autoExprGroup: false,
                    calculateDisplayValue: function(data) {
                        return data.group2;
                    }
                }
            ]
        });

        this.dataController._refreshDataSource();

        // act
        this.dataController.expandAll(1);

        // assert
        assert.equal(this.columnsController.getGroupColumns().length, 2, '2 columns are grouped');
        assert.equal(this.dataController.items().length, 3, 'tree rows are visible');
    });

    QUnit.test('Using focusedRowEnabled should set sorting for the not sorted simple key column if remoteOperations enabled', function(assert) {
    // arrange
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Dan', age: 25 },
            { team: 'internal', name: 'Bob', age: 20 },
            { team: 'public', name: 'Alice', age: 19 }],
        { key: 'name' },
        {
            pageSize: 2,
            asyncLoadEnabled: false
        });

        this.applyOptions({
            dataSource: dataSource,
            focusedRowEnabled: true,
            remoteOperations: true
        });

        // act
        this.dataController._refreshDataSource();
        // assert
        assert.equal(dataSource.items()[0].name, 'Alex', 'Item name is Alex');
        assert.equal(dataSource.items()[1].name, 'Alice', 'Item name is Alice');
        // act
        dataSource.pageIndex(1);
        dataSource.load();
        // assert
        assert.equal(dataSource.items()[0].name, 'Bob', 'Item2');
        assert.equal(dataSource.items()[1].name, 'Dan', 'Item3');
    });

    QUnit.test('Using focusedRowEnabled should not set sorting by key if remoteOperations is true and autoNavigateToFocusedRow is false', function(assert) {
    // arrange
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Dan', age: 25 },
            { team: 'internal', name: 'Bob', age: 20 },
            { team: 'public', name: 'Alice', age: 19 }
        ], { key: 'name' });

        this.applyOptions({
            dataSource: dataSource,
            focusedRowEnabled: true,
            autoNavigateToFocusedRow: false,
            remoteOperations: true
        });

        // act
        this.dataController._refreshDataSource();

        // assert
        assert.strictEqual(dataSource.sort(), null, 'sort is not defined');
        assert.equal(dataSource.items()[0].name, 'Alex', 'Item name is Alex');
        assert.equal(dataSource.items()[1].name, 'Dan', 'Item name is Dan');
    });

    QUnit.test('Using focusedRowEnabled should not set sorting for the not sorted simple key column if remoteOperations disabled', function(assert) {
    // arrange
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Dan', age: 25 },
            { team: 'internal', name: 'Bob', age: 20 },
            { team: 'public', name: 'Alice', age: 19 }],
        { key: 'name' },
        {
            pageSize: 2,
            asyncLoadEnabled: false
        });

        this.applyOptions({
            dataSource: dataSource,
            focusedRowEnabled: true
        });

        // act
        this.dataController._refreshDataSource();
        // assert
        assert.equal(dataSource.items()[0].name, 'Alex', 'Item0');
        assert.equal(dataSource.items()[1].name, 'Dan', 'Item1');
        // act
        dataSource.pageIndex(1);
        dataSource.load();
        // assert
        assert.equal(dataSource.items()[0].name, 'Bob', 'Item2');
        assert.equal(dataSource.items()[1].name, 'Alice', 'Item3');
    });

    QUnit.test('Using focusedRowEnabled should not set sorting for the not sorted composite key columns', function(assert) {
    // arrange
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Dan', age: 25 },
            { team: 'internal', name: 'Bob', age: 20 },
            { team: 'public', name: 'Alice', age: 19 }],
        { key: [ 'name', 'age' ] },
        {
            pageSize: 2,
            asyncLoadEnabled: false
        });

        this.applyOptions({
            dataSource: dataSource,
            focusedRowEnabled: true
        });

        // act
        this.dataController._refreshDataSource();
        const dataIndexGetter = this.dataController._dataSource.getDataIndexGetter();
        this.dataController._dataSource.getDataIndexGetter();
        assert.deepEqual(this.dataController._columnsController.getSortDataSourceParameters(), [{ desc: false, selector: dataIndexGetter }], 'Sort parameters');
        // assert
        assert.equal(dataSource.items()[0].name, 'Alex', 'Item0');
        assert.equal(dataSource.items()[1].name, 'Dan', 'Item1');
        // act
        dataSource.pageIndex(1);
        dataSource.load();
        // assert
        assert.equal(dataSource.items()[0].name, 'Bob', 'Item2');
        assert.equal(dataSource.items()[1].name, 'Alice', 'Item3');
    });

    // T829761
    QUnit.test('Refresh after reordering should update rows if focusedRowEnabled is enabled', function(assert) {
    // arrange
        const items = [
            { name: 'Alex', age: 30 },
            { name: 'Dan', age: 25 }
        ];

        const dataSource = createDataSource(items, { key: 'name' });

        this.applyOptions({
            dataSource: dataSource,
            focusedRowEnabled: true
        });

        this.dataController._refreshDataSource();

        // act
        const item0 = items.splice(0, 1)[0];
        items.splice(1, 0, item0);
        this.dataController.refresh();

        // assert
        assert.equal(dataSource.items()[0].name, 'Dan', 'second item became first');
        assert.equal(dataSource.items()[1].name, 'Alex', 'first item became second');
    });

    QUnit.test('Operation filter should generates correctly when sorting, remoteOperations, and the key column is not present', function(assert) {
    // arrange
        const data = [
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Dan', age: 25 },
            { team: 'internal', name: 'Bob', age: 20 },
            { team: 'public', name: 'Alice', age: 19 }];
        const dataSource = createDataSource(data,
            { key: 'name' },
            { pageSize: 1, asyncLoadEnabled: false });

        this.applyOptions({
            keyExpr: 'name',
            focusedRowEnabled: true,
            remoteOperations: true,
            dataSource: dataSource,
            columns: ['team', 'age']
        });

        // act
        this.dataController._refreshDataSource();

        const filter = this.dataController._generateOperationFilterByKey('Dan', data[1], false);

        assert.equal(JSON.stringify(filter), '[[["name","<","Dan"],"or",["name","=",null]],"or",[["name","=","Dan"],"and",["name","<","Dan"]]]', 'Operation filter');
    });

    // T755462
    QUnit.test('Check the filter generator for the boolean field', function(assert) {
    // act, assert
        let filter = this.dataController._generateBooleanFilter('isRoom', true, { desc: false });
        assert.strictEqual(JSON.stringify(filter), '["isRoom","<>",true]', 'filter');

        // act, assert
        filter = this.dataController._generateBooleanFilter('isRoom', false, { desc: false });
        assert.strictEqual(JSON.stringify(filter), '["isRoom","=",null]', 'filter');

        // act, assert
        filter = this.dataController._generateBooleanFilter('isRoom', true, { desc: true });
        assert.strictEqual(JSON.stringify(filter), undefined, 'filter');

        // act, assert
        filter = this.dataController._generateBooleanFilter('isRoom', false, { desc: true });
        assert.strictEqual(JSON.stringify(filter), '["isRoom","=",true]', 'filter');

        // act, assert
        filter = this.dataController._generateBooleanFilter('isRoom', null, { desc: true });
        assert.strictEqual(JSON.stringify(filter), '["isRoom","<>",null]', 'filter');

        // act, assert
        filter = this.dataController._generateBooleanFilter('isRoom', null, { desc: false });
        assert.strictEqual(JSON.stringify(filter), undefined, 'filter');
    });

    QUnit.test('Get page index by simple key if remoteOperations is false', function(assert) {
    // arrange
        let count = 0;
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Dan', age: 25 },
            { team: 'internal', name: 'Bob', age: 20 },
            { team: 'public', name: 'Alice', age: 19 }],
        { key: 'name' },
        { pageSize: 1, asyncLoadEnabled: false });

        this.applyOptions({
            dataSource: dataSource
        });

        // act
        this.dataController._refreshDataSource();
        this.dataController.getPageIndexByKey('Alice').done(function(pageIndex) {
            ++count;
            assert.equal(pageIndex, 3);
        });
        assert.equal(count, 1, 'Count');
    });

    QUnit.test('Get page index by simple key if remoteOperations is true', function(assert) {
    // arrange
        let count = 0;
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Dan', age: 25 },
            { team: 'internal', name: 'Bob', age: 20 },
            { team: 'public', name: 'Alice', age: 19 }],
        { key: 'name' },
        { pageSize: 1, asyncLoadEnabled: false });

        this.applyOptions({
            remoteOperations: true,
            dataSource: dataSource
        });

        // act
        this.dataController._refreshDataSource();
        this.dataController.getPageIndexByKey('Alice').done(function(pageIndex) {
            ++count;
            assert.equal(pageIndex, 1);
        });
        assert.equal(count, 1, 'Count');
    });

    QUnit.test('Get page index by group key if there is no groouping and remoteOperations is true and data (T1042661)', function(assert) {
        // arrange
        let count = 0;
        const loadingSpy = sinon.spy();
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Dan', age: 25 },
            { team: 'internal', name: 'Bob', age: 20 },
            { team: 'public', name: 'Alice', age: 19 }],
        { key: 'name' },
        { pageSize: 1, asyncLoadEnabled: false });

        this.applyOptions({
            remoteOperations: true,
            dataSource: dataSource
        });

        dataSource.store().on('loading', loadingSpy);

        // act
        this.dataController._refreshDataSource();
        assert.equal(loadingSpy.callCount, 1, 'loading count');

        this.dataController.getPageIndexByKey(['Alice']).done(function(pageIndex) {
            ++count;
            assert.equal(pageIndex, -1);
        });
        assert.equal(count, 1, 'Count');
        assert.equal(loadingSpy.callCount, 1, 'loading count is not changed');
    });

    QUnit.test('Get page index by composite key', function(assert) {
    // arrange
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Bob', age: 25 },
            { team: 'internal', name: 'Bob', age: 20 },
            { team: 'public', name: 'Alice', age: 19 }],
        { key: [ 'name', 'age' ] },
        {
            pageSize: 1,
            asyncLoadEnabled: false
        });

        this.applyOptions({
            dataSource: dataSource
        });

        // act
        this.dataController._refreshDataSource();
        this.dataController.getPageIndexByKey({ name: 'Bob', age: 25 }).done(function(pageIndex) {
            assert.equal(pageIndex, 1);
        });
    });

    QUnit.test('Get page index by simple key with sorting', function(assert) {
    // arrange
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Dan', age: 25 },
            { team: 'internal', name: 'Bob', age: 20 },
            { team: 'public', name: 'Alice', age: 19 }],
        { key: 'name' },
        {
            pageSize: 1,
            asyncLoadEnabled: false
        });

        this.applyOptions({
            commonColumnSettings: { autoExpandGroup: true },
            dataSource: dataSource,
            columns: ['team', { dataField: 'name', sortOrder: 'desc' }, { dataField: 'age', sortOrder: 'desc' }]
        });

        // act
        this.dataController._refreshDataSource();
        this.dataController.getPageIndexByKey('Alice').done(function(pageIndex) {
            assert.equal(pageIndex, 2);
        });
    });

    QUnit.test('Get page index by composite key with sorting', function(assert) {
    // arrange
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Bob', age: 25 },
            { team: 'internal', name: 'Bob', age: 20 },
            { team: 'public', name: 'Alice', age: 19 }],
        { key: [ 'name', 'age' ] },
        {
            pageSize: 1,
            asyncLoadEnabled: false
        });

        this.applyOptions({
            commonColumnSettings: { autoExpandGroup: true },
            dataSource: dataSource,
            columns: ['team', { dataField: 'name', sortOrder: 'desc' }, { dataField: 'age', sortOrder: 'desc' }]
        });

        // act
        this.dataController._refreshDataSource();
        this.dataController.getPageIndexByKey({ name: 'Bob', age: 20 }).done(function(pageIndex) {
            assert.equal(pageIndex, 1);
        });
    });

    QUnit.test('Get page index by simple key with sorting by unbound column', function(assert) {
    // arrange
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Bob', age: 25 },
            { team: 'internal', name: 'Den', age: 20 },
            { team: 'public', name: 'Alice', age: 19 }],
        { key: 'name' },
        {
            pageSize: 1,
            asyncLoadEnabled: false
        });

        this.applyOptions({
            commonColumnSettings: { autoExpandGroup: true },
            dataSource: dataSource,
            columns: ['team', 'name', 'age',
                {
                    dataField: 'calc',
                    sortOrder: 'desc',
                    calculateCellValue: function(data) {
                        return data.name + ' ' + data.age;
                    }
                }
            ]
        });

        // act
        this.dataController._refreshDataSource();
        this.dataController.getPageIndexByKey('Den').done(function(pageIndex) {
            assert.equal(pageIndex, 0);
        });
    });

    QUnit.test('Get page index by composite key with sorting by unbound column', function(assert) {
    // arrange
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Bob', age: 25 },
            { team: 'internal', name: 'Den', age: 20 },
            { team: 'public', name: 'Alice', age: 19 }],
        { key: [ 'name', 'age' ] },
        {
            pageSize: 1,
            asyncLoadEnabled: false
        });

        this.applyOptions({
            commonColumnSettings: { autoExpandGroup: true },
            dataSource: dataSource,
            columns: ['team', 'name', 'age',
                {
                    dataField: 'calc',
                    sortOrder: 'asc',
                    calculateCellValue: function(data) {
                        return data.name + ' ' + data.age;
                    }
                }
            ]
        });

        // act
        this.dataController._refreshDataSource();
        this.dataController.getPageIndexByKey({ name: 'Alice', age: 19 }).done(function(pageIndex) {
            assert.equal(pageIndex, 1);
        });
    });

    QUnit.test('Get page index by simple key if combined filter present', function(assert) {
    // arrange
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Bob', age: 25 },
            { team: 'internal', name: 'Den', age: 20 },
            { team: 'public', name: 'Alice', age: 19 }],
        { key: 'name' },
        { filter: ['age', '>', 20], pageSize: 1, asyncLoadEnabled: false, allowFiltering: true }
        );

        this.applyOptions({
            commonColumnSettings: { autoExpandGroup: true },
            dataSource: dataSource
        });

        // act
        this.dataController._refreshDataSource();
        assert.equal(this.dataController.pageCount(), 2);
        this.dataController.getPageIndexByKey('Bob').done(function(pageIndex) {
            assert.equal(pageIndex, 1);
        });
    });

    QUnit.test('Get page index by simple key if combined filter present and remote operations', function(assert) {
    // arrange
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 19 },
            { team: 'internal', name: 'Bob', age: 30 },
            { team: 'internal', name: 'Den', age: 20 },
            { team: 'public', name: 'Alice', age: 25 }],
        { key: 'name' },
        { pageSize: 1, asyncLoadEnabled: false, sort: 'age' }
        );

        this.applyOptions({
            commonColumnSettings: { autoExpandGroup: true },
            remoteOperations: true,
            dataSource: dataSource
        });

        // act
        this.dataController._refreshDataSource();
        assert.equal(this.dataController.pageCount(), 4);
        this.dataController.getPageIndexByKey('Bob').done(function(pageIndex) {
            assert.equal(pageIndex, 3);
        });
    });

    QUnit.test('Get page index by composite key if combined filter present', function(assert) {
    // arrange
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Bob', age: 25 },
            { team: 'internal', name: 'Bob', age: 24 },
            { team: 'internal', name: 'Bob', age: 23 },
            { team: 'internal', name: 'Bob', age: 22 },
            { team: 'internal', name: 'Den', age: 20 },
            { team: 'public', name: 'Alice', age: 19 }],
        { key: [ 'name', 'age' ] },
        { filter: ['age', '>', 20], pageSize: 1, asyncLoadEnabled: false, allowFiltering: true, sort: [ 'name', 'age' ] }
        );

        this.applyOptions({
            commonColumnSettings: { autoExpandGroup: true },
            dataSource: dataSource
        });

        // act
        const dataController = this.dataController;
        dataController._refreshDataSource();
        // assert
        dataController.getPageIndexByKey({ name: 'Bob', age: 24 }).done(function(pageIndex) {
            assert.equal(dataController.pageCount(), 5);
            assert.equal(pageIndex, 3);
        });
    });

    QUnit.test('Get row index if group by one column and simple key (group sizes are similar and equals to the pageSize)', function(assert) {
    // arrange
        let foundRowCount = 0;
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Bob', age: 29 },
            { team: 'internal0', name: 'Mark', age: 25 },
            { team: 'internal0', name: 'Den', age: 24 },
            { team: 'internal1', name: 'Dan', age: 23 },
            { team: 'internal1', name: 'Clark', age: 22 },
            { team: 'public', name: 'Alice', age: 19 },
            { team: 'public', name: 'Zeb', age: 18 }],
        { key: 'name' },
        { group: 'team', sort: 'name', pageSize: 3, asyncLoadEnabled: false, paginate: true }
        );

        this.applyOptions({
            commonColumnSettings: { autoExpandGroup: true },
            dataSource: dataSource
        });

        // act
        const dataController = this.dataController;
        dataController._refreshDataSource();
        // assert
        dataController.getGlobalRowIndexByKey('Mark').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(dataController.pageCount(), 4, 'Page count');
            assert.equal(globalRowIndex, 5, 'Mark');
        });
        dataController.getGlobalRowIndexByKey('Alex').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 1, 'Alex');
        });
        dataController.getGlobalRowIndexByKey('Den').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 4, 'Den');
        });
        dataController.getGlobalRowIndexByKey('Bob').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 2, 'Bob');
        });
        dataController.getGlobalRowIndexByKey('Dan').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 8, 'Dan');
        });
        dataController.getGlobalRowIndexByKey('Zeb').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 11, 'Zeb');
        });
        dataController.getGlobalRowIndexByKey('Clark').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 7, 'Clark');
        });
        dataController.getGlobalRowIndexByKey('Alice').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 10, 'Alice');
        });

        assert.equal(foundRowCount, 8, 'Found row count');
    });

    QUnit.test('Get row index if group by one column and data item contains key field (T1078374)', function(assert) {
        const done = assert.async();
        // arrange
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', key: 1 },
            { team: 'internal', name: 'Bob', key: 2 }
        ],
        { key: 'name' },
        { group: 'team', sort: 'name', pageSize: 3, asyncLoadEnabled: false, paginate: true }
        );

        this.applyOptions({
            commonColumnSettings: { autoExpandGroup: true },
            dataSource: dataSource
        });

        const dataController = this.dataController;
        dataController._refreshDataSource();

        // act
        dataController.getGlobalRowIndexByKey('Bob').done(function(globalRowIndex) {
            assert.equal(globalRowIndex, 2, 'Bob');
            done();
        });
    });

    ['string', 'number', 'date', 'boolean'].forEach(dataField => {
        [true, false].forEach(desc => {
            QUnit.test(`Get row index if sort by column with null values (dataType = ${dataField}, desc = ${desc})`, function(assert) {
                // arrange
                const done = assert.async();
                const dataSource = createDataSource([
                    { id: 1, string: 'aaa', number: 1, date: new Date(1999, 1, 1), boolean: false },
                    { id: 2, string: 'bbb', number: 2, date: new Date(1999, 1, 2), boolean: true },
                    { id: 3, string: null, number: null, date: null, boolean: null }],
                { key: 'id' },
                { sort: [{ selector: dataField, desc }], pageSize: 1, paginate: true }
                );

                this.applyOptions({
                    dataSource: dataSource
                });

                // act
                const dataController = this.dataController;
                dataController._refreshDataSource();

                // assert
                dataController.getGlobalRowIndexByKey(1).done(globalRowIndex => {
                    assert.equal(dataController.pageCount(), 3, 'Page count');
                    assert.equal(globalRowIndex, 1, 'globalRowIndex');
                    done();
                });
            });
        });
    });

    QUnit.test('Get row index if group by one column and simple key', function(assert) {
    // arrange
        let foundRowCount = 0;
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Bob', age: 29 },
            { team: 'internal', name: 'Sad', age: 28 },
            { team: 'internal0', name: 'Mark', age: 25 },
            { team: 'internal0', name: 'Den', age: 24 },
            { team: 'internal1', name: 'Dan', age: 23 },
            { team: 'internal1', name: 'Clark', age: 22 },
            { team: 'public', name: 'Alice', age: 19 },
            { team: 'public', name: 'Zeb', age: 18 }],
        { key: 'name' },
        { group: 'team', sort: 'name', pageSize: 3, asyncLoadEnabled: false, paginate: true }
        );

        this.applyOptions({
            commonColumnSettings: { autoExpandGroup: true },
            dataSource: dataSource
        });

        // act
        const dataController = this.dataController;
        dataController._refreshDataSource();
        // assert
        dataController.getGlobalRowIndexByKey('Sad').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(dataController.pageCount(), 5, 'Page count');
            assert.equal(globalRowIndex, 4, 'Sad');
        });
        dataController.getGlobalRowIndexByKey('Alex').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 1, 'Alex');
        });
        dataController.getGlobalRowIndexByKey('Den').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 7, 'Den');
        });
        dataController.getGlobalRowIndexByKey('Bob').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 2, 'Bob');
        });
        dataController.getGlobalRowIndexByKey('Dan').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 11, 'Dan');
        });
        dataController.getGlobalRowIndexByKey('Mark').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 8, 'Mark');
        });
        dataController.getGlobalRowIndexByKey('Zeb').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 14, 'Zeb');
        });
        dataController.getGlobalRowIndexByKey('Clark').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 10, 'Clark');
        });
        dataController.getGlobalRowIndexByKey('Alice').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 13, 'Alice');
        });

        assert.equal(foundRowCount, 9, 'Found row count');
    });

    QUnit.test('Get row index if group by one column and simple key and remote operations', function(assert) {
    // arrange
        let foundRowCount = 0;
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Bob', age: 29 },
            { team: 'internal', name: 'Sad', age: 28 },
            { team: 'internal0', name: 'Mark', age: 25 },
            { team: 'internal0', name: 'Den', age: 24 },
            { team: 'internal1', name: 'Dan', age: 23 },
            { team: 'internal1', name: 'Clark', age: 22 },
            { team: 'public', name: 'Alice', age: 19 },
            { team: 'public', name: 'Zeb', age: 18 }],
        { key: 'name' },
        { group: 'team', pageSize: 3, asyncLoadEnabled: false, paginate: true }
        );

        this.applyOptions({
            remoteOperations: true,
            commonColumnSettings: { autoExpandGroup: true },
            dataSource: dataSource
        });

        // act
        const dataController = this.dataController;
        dataController._refreshDataSource();
        // assert
        dataController.getGlobalRowIndexByKey('Sad').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(dataController.pageCount(), 5, 'Page count');
            assert.equal(globalRowIndex, 4, 'Sad');
        });
        dataController.getGlobalRowIndexByKey('Alex').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 1, 'Alex');
        });
        dataController.getGlobalRowIndexByKey('Den').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 7, 'Den');
        });
        dataController.getGlobalRowIndexByKey('Bob').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 2, 'Bob');
        });
        dataController.getGlobalRowIndexByKey('Dan').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 11, 'Dan');
        });
        dataController.getGlobalRowIndexByKey('Mark').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 8, 'Mark');
        });
        dataController.getGlobalRowIndexByKey('Zeb').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 14, 'Zeb');
        });
        dataController.getGlobalRowIndexByKey('Clark').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 10, 'Clark');
        });
        dataController.getGlobalRowIndexByKey('Alice').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 13, 'Alice');
        });

        assert.equal(foundRowCount, 9, 'Found row count');
    });

    QUnit.test('Get row index if group by one column and simple key and OData', function(assert) {
    // arrange
        let foundRowCount = 0;
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Bob', age: 29 },
            { team: 'internal', name: 'Sad', age: 28 },
            { team: 'internal0', name: 'Mark', age: 25 },
            { team: 'internal0', name: 'Den', age: 24 },
            { team: 'internal1', name: 'Dan', age: 23 },
            { team: 'internal1', name: 'Clark', age: 22 },
            { team: 'public', name: 'Alice', age: 19 },
            { team: 'public', name: 'Zeb', age: 18 }],
        { key: 'name' },
        { group: 'team', pageSize: 3, asyncLoadEnabled: false, paginate: true }
        );

        this.applyOptions({
            remoteOperations: { sorting: true, paging: true, filtering: true },
            commonColumnSettings: { autoExpandGroup: true },
            dataSource: dataSource
        });

        // act
        const dataController = this.dataController;
        dataController._refreshDataSource();
        // assert
        dataController.getGlobalRowIndexByKey('Sad').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(dataController.pageCount(), 3, 'Page count');
            assert.equal(globalRowIndex, 2, 'Sad');
        });
        dataController.getGlobalRowIndexByKey('Alex').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 0, 'Alex');
        });
        dataController.getGlobalRowIndexByKey('Den').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 3, 'Den');
        });
        dataController.getGlobalRowIndexByKey('Bob').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 1, 'Bob');
        });
        dataController.getGlobalRowIndexByKey('Dan').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 6, 'Dan');
        });
        dataController.getGlobalRowIndexByKey('Mark').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 4, 'Mark');
        });
        dataController.getGlobalRowIndexByKey('Zeb').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 8, 'Zeb');
        });
        dataController.getGlobalRowIndexByKey('Clark').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 5, 'Clark');
        });
        dataController.getGlobalRowIndexByKey('Alice').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 7, 'Alice');
        });

        assert.equal(foundRowCount, 9, 'Found row count');
    });

    QUnit.test('Get row index if group by two columns and simple key', function(assert) {
    // arrange
        let foundRowCount = 0;
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30, g0: 0 },
            { team: 'internal', name: 'Bob', age: 29, g0: 1 },
            { team: 'internal', name: 'Sad', age: 28, g0: 1 },
            { team: 'internal', name: 'Mark', age: 25, g0: 1 },
            { team: 'internal0', name: 'Den', age: 24, g0: 2 },
            { team: 'internal0', name: 'Dan', age: 23, g0: 2 },
            { team: 'internal1', name: 'Clark', age: 22, g0: 3 },
            { team: 'public', name: 'Alice', age: 19, g0: 3 },
            { team: 'public', name: 'Zeb', age: 18, g0: 0 }],
        { key: 'name' },
        { group: ['team', 'g0'], sort: 'name', pageSize: 5, asyncLoadEnabled: false, paginate: true }
        );

        this.applyOptions({
            commonColumnSettings: { autoExpandGroup: true },
            dataSource: dataSource
        });

        // act
        const dataController = this.dataController;
        dataController._refreshDataSource();
        // assert
        dataController.getGlobalRowIndexByKey('Alex').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(dataController.pageCount(), 5, 'Page count');
            assert.equal(globalRowIndex, 2, 'Alex');
        });
        dataController.getGlobalRowIndexByKey('Bob').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 4, 'Bob');
        });
        dataController.getGlobalRowIndexByKey('Mark').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 7, 'Mark');
        });
        dataController.getGlobalRowIndexByKey('Sad').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 8, 'Sad');
        });
        dataController.getGlobalRowIndexByKey('Dan').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 12, 'Dan');
        });
        dataController.getGlobalRowIndexByKey('Den').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 13, 'Den');
        });
        dataController.getGlobalRowIndexByKey('Clark').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 17, 'Clark');
        });
        dataController.getGlobalRowIndexByKey('Zeb').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 22, 'Zeb');
        });
        dataController.getGlobalRowIndexByKey('Alice').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 24, 'Alice');
        });

        assert.equal(foundRowCount, 9, 'Found row count');
    });

    QUnit.test('Get row index if group by two columns and simple key and remote operations', function(assert) {
    // arrange
        let foundRowCount = 0;
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30, g0: 0 },
            { team: 'internal', name: 'Bob', age: 29, g0: 1 },
            { team: 'internal', name: 'Sad', age: 28, g0: 1 },
            { team: 'internal', name: 'Mark', age: 25, g0: 1 },
            { team: 'internal0', name: 'Den', age: 24, g0: 2 },
            { team: 'internal0', name: 'Dan', age: 23, g0: 2 },
            { team: 'internal1', name: 'Clark', age: 22, g0: 3 },
            { team: 'public', name: 'Alice', age: 19, g0: 3 },
            { team: 'public', name: 'Zeb', age: 18, g0: 0 }],
        { key: 'name' },
        { group: ['team', 'g0'], pageSize: 5, asyncLoadEnabled: false, paginate: true }
        );

        this.applyOptions({
            remoteOperations: true,
            commonColumnSettings: { autoExpandGroup: true },
            dataSource: dataSource
        });

        // act
        const dataController = this.dataController;
        dataController._refreshDataSource();
        // assert
        dataController.getGlobalRowIndexByKey('Alex').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(dataController.pageCount(), 5, 'Page count');
            assert.equal(globalRowIndex, 2, 'Alex');
        });
        dataController.getGlobalRowIndexByKey('Bob').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 4, 'Bob');
        });
        dataController.getGlobalRowIndexByKey('Mark').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 7, 'Mark');
        });
        dataController.getGlobalRowIndexByKey('Sad').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 8, 'Sad');
        });
        dataController.getGlobalRowIndexByKey('Dan').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 12, 'Dan');
        });
        dataController.getGlobalRowIndexByKey('Den').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 13, 'Den');
        });
        dataController.getGlobalRowIndexByKey('Clark').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 17, 'Clark');
        });
        dataController.getGlobalRowIndexByKey('Zeb').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 22, 'Zeb');
        });
        dataController.getGlobalRowIndexByKey('Alice').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 24, 'Alice');
        });
        dataController.getGlobalRowIndexByKey(['internal']).done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, -1, '[internal]');
        });

        assert.equal(foundRowCount, 10, 'Found row count');
    });

    QUnit.test('Get row index if group by two columns and simple key and OData', function(assert) {
    // arrange
        let foundRowCount = 0;
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30, g0: 0 },
            { team: 'internal', name: 'Bob', age: 29, g0: 1 },
            { team: 'internal', name: 'Sad', age: 28, g0: 1 },
            { team: 'internal', name: 'Mark', age: 25, g0: 1 },
            { team: 'internal0', name: 'Den', age: 24, g0: 2 },
            { team: 'internal0', name: 'Dan', age: 23, g0: 2 },
            { team: 'internal1', name: 'Clark', age: 22, g0: 3 },
            { team: 'public', name: 'Alice', age: 19, g0: 3 },
            { team: 'public', name: 'Zeb', age: 18, g0: 0 }],
        { key: 'name' },
        { group: ['team', 'g0'], pageSize: 5, asyncLoadEnabled: false, paginate: true }
        );

        this.applyOptions({
            remoteOperations: { sorting: true, paging: true, filtering: true },
            commonColumnSettings: { autoExpandGroup: true },
            dataSource: dataSource
        });

        // act
        const dataController = this.dataController;
        dataController._refreshDataSource();
        // assert
        dataController.getGlobalRowIndexByKey('Alex').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(dataController.pageCount(), 2, 'Page count');
            assert.equal(globalRowIndex, 0, 'Alex');
        });
        dataController.getGlobalRowIndexByKey('Bob').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 1, 'Bob');
        });
        dataController.getGlobalRowIndexByKey('Mark').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 2, 'Mark');
        });
        dataController.getGlobalRowIndexByKey('Sad').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 3, 'Sad');
        });
        dataController.getGlobalRowIndexByKey('Dan').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 4, 'Dan');
        });
        dataController.getGlobalRowIndexByKey('Den').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 5, 'Den');
        });
        dataController.getGlobalRowIndexByKey('Clark').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 6, 'Clark');
        });
        dataController.getGlobalRowIndexByKey('Zeb').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 7, 'Zeb');
        });
        dataController.getGlobalRowIndexByKey('Alice').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 8, 'Alice');
        });

        assert.equal(foundRowCount, 9, 'Found row count');
    });

    QUnit.test('Get row index if group by one column, simple key and virtual scrolling', function(assert) {
    // arrange
        let foundRowCount = 0;
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Bob', age: 29 },
            { team: 'internal', name: 'Sad', age: 28 },
            { team: 'internal', name: 'Mark', age: 25 },
            { team: 'internal0', name: 'Den', age: 24 },
            { team: 'internal0', name: 'Dan', age: 23 },
            { team: 'internal1', name: 'Clark', age: 22 },
            { team: 'public', name: 'Alice', age: 19 },
            { team: 'public', name: 'Zeb', age: 18 }],
        { key: 'name' },
        { group: 'team', sort: 'name', pageSize: 3, asyncLoadEnabled: false, paginate: true }
        );

        this.applyOptions({
            commonColumnSettings: { autoExpandGroup: true },
            scrolling: { mode: 'virtual' },
            dataSource: dataSource
        });

        // act
        const dataController = this.dataController;
        dataController._refreshDataSource();
        // assert
        dataController.getGlobalRowIndexByKey('Alex').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 1, 'Alex');
        });
        dataController.getGlobalRowIndexByKey('Bob').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 2, 'Bob');
        });
        dataController.getGlobalRowIndexByKey('Mark').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 3, 'Mark');
        });
        dataController.getGlobalRowIndexByKey('Sad').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 4, 'Sad');
        });
        dataController.getGlobalRowIndexByKey('Dan').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 6, 'Dan');
        });
        dataController.getGlobalRowIndexByKey('Den').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 7, 'Den');
        });
        dataController.getGlobalRowIndexByKey('Clark').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 9, 'Clark');
        });
        dataController.getGlobalRowIndexByKey('Alice').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 11, 'Alice');
        });
        dataController.getGlobalRowIndexByKey('Zeb').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 12, 'Zeb');
        });

        assert.equal(foundRowCount, 9, 'Found row count');
    });

    QUnit.test('Get row index if group by two columns, simple key and virtual scrolling', function(assert) {
    // arrange
        let foundRowCount = 0;
        const dataSource = createDataSource([
            { team: 'internal', name: 'Alex', age: 30, g0: 0 },
            { team: 'internal', name: 'Bob', age: 29, g0: 1 },
            { team: 'internal', name: 'Sad', age: 28, g0: 1 },
            { team: 'internal', name: 'Mark', age: 25, g0: 1 },
            { team: 'internal0', name: 'Den', age: 24, g0: 2 },
            { team: 'internal0', name: 'Dan', age: 23, g0: 2 },
            { team: 'internal1', name: 'Clark', age: 22, g0: 3 },
            { team: 'public', name: 'Alice', age: 19, g0: 3 },
            { team: 'public', name: 'Zeb', age: 18, g0: 0 }],
        { key: 'name' },
        { group: ['team', 'g0'], sort: 'name', pageSize: 3, asyncLoadEnabled: false, paginate: true }
        );

        this.applyOptions({
            commonColumnSettings: { autoExpandGroup: true },
            scrolling: { mode: 'virtual' },
            dataSource: dataSource
        });

        // act
        const dataController = this.dataController;
        dataController._refreshDataSource();
        // assert
        dataController.getGlobalRowIndexByKey('Alex').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 2, 'Alex');
        });
        dataController.getGlobalRowIndexByKey('Bob').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 4, 'Bob');
        });
        dataController.getGlobalRowIndexByKey('Mark').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 5, 'Mark');
        });
        dataController.getGlobalRowIndexByKey('Sad').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 6, 'Sad');
        });
        dataController.getGlobalRowIndexByKey('Dan').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 9, 'Dan');
        });
        dataController.getGlobalRowIndexByKey('Den').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 10, 'Den');
        });
        dataController.getGlobalRowIndexByKey('Clark').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 13, 'Clark');
        });
        dataController.getGlobalRowIndexByKey('Alice').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 18, 'Alice');
        });
        dataController.getGlobalRowIndexByKey('Zeb').done(function(globalRowIndex) {
            ++foundRowCount;
            assert.equal(globalRowIndex, 16, 'Zeb');
        });

        assert.equal(foundRowCount, 9, 'Found row count');
    });

    // B254274
    QUnit.test('sortOrder in column options and group parameters in dataSource', function(assert) {
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

    QUnit.test('update sorting on columnsChanged (changeType == \'sorting\')', function(assert) {
        const array = [
            { name: 'Alex', age: 30 },
            { name: 'Dan', age: 25 },
            { name: 'Bob', age: 20 }
        ];
        const dataSource = createDataSource(array, { key: 'name' });

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

    QUnit.test('reset sorting on columnsChanged (changeType == \'sorting\')', function(assert) {
        const array = [
            { name: 'Alex', age: 30 },
            { name: 'Dan', age: 25 },
            { name: 'Bob', age: 20 }
        ];
        this.applyOptions({
            commonColumnSettings: { allowSorting: true },
            sorting: { mode: 'single' }
        });

        const dataSource = createDataSource(array, { key: 'name' }, { sort: 'name' });

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

    QUnit.test('update grouping on columnsChanged (changeType == \'grouping\')', function(assert) {
        const array = [
            { name: 'Alex', age: 30 },
            { name: 'Dan', age: 25 },
            { name: 'Bob', age: 20 }
        ];
        const dataSource = createDataSource(array, { key: 'name' });

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

    QUnit.test('Load group from state when columns generated by dataSource', function(assert) {
    // arrange
        this.options.remoteOperations = { filtering: true, sorting: true, paging: true };
        this.options.groupPanel = { visible: true, allowColumnDragging: true };
        this.options.grouping = { autoExpandAll: true };

        const array = [
            { name: 'Alex', age: 30 },
            { name: 'Dan', age: 25 },
            { name: 'Bob', age: 20 }
        ];
        const dataSource = createDataSource(array);
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

    QUnit.test('Reset sort/group parameters from user state for removed columns', function(assert) {
    // arrange
        const dataSource = [
            { age: 30 },
            { age: 20 },
            { age: 25 }
        ];

        // user state has options for removed column with dataField 'name'
        this.columnsController.setUserState([{ dataField: 'name', visible: true, groupIndex: 0, index: 0 }, { dataField: 'age', visible: true, sortIndex: 0, sortOrder: 'asc', index: 1 }]);

        this.applyOptions({ dataSource: dataSource });

        // act
        this.dataController.optionChanged({
            name: 'dataSource',
            value: dataSource
        });

        // assert
        assert.deepEqual(this.dataController._dataSource.sort(), [{ selector: 'age', desc: false }], 'sort from user state is applied by dataField');
        assert.deepEqual(this.dataController._dataSource.group(), null, 'group from user state not applied because dataSource not has name column');
        assert.deepEqual(this.dataController.items().length, 3);
        assert.deepEqual(this.dataController.items()[0].values, [20]);
        assert.deepEqual(this.dataController.items()[1].values, [25]);
        assert.deepEqual(this.dataController.items()[2].values, [30]);
    });

    // B253402
    QUnit.test('reset grouping on columnsChanged (changeType == \'grouping\')', function(assert) {
        const array = [
            { name: 'Alex', age: 30 },
            { name: 'Dan', age: 25 },
            { name: 'Bob', age: 20 }
        ];
        const dataSource = createDataSource(array, { key: 'name' }, { group: 'name' });

        this.dataController.setDataSource(dataSource);
        dataSource.load();
        assert.ok(this.dataController.dataSource().group());
        // act
        this.columnsController.moveColumn(0, 0, 'group', 'header');

        // assert
        assert.ok(!this.dataController.dataSource().group());
        assert.equal(this.dataController.items()[0].rowType, 'data');
    });

    QUnit.test('update sorting on columnsChanged (changeType == \'sorting\'). Refresh current page', function(assert) {
        const array = [
            { name: 'Alex', age: 30 },
            { name: 'Dan', age: 25 },
            { name: 'Bob', age: 20 }
        ];

        const dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

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

    QUnit.test('sorting when calculateSortValue is defined', function(assert) {
        const array = [
            { name: 'Alex', age: 30 },
            { name: 'Dan', age: 25 },
            { name: 'Bob', age: 20 }
        ];

        const dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

        this.applyOptions({
            commonColumnSettings: { allowSorting: true },
            columns: [{
                dataField: 'name', calculateSortValue: function(data) {
                    return $.inArray(data.name, ['Dan', 'Bob', 'Alex']);
                }
            }, 'age'],
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

    QUnit.test('calculateSortValue should have correct context on sorting if customizeColumns is used (T1036411)', function(assert) {
        const array = [
            { name: 'Alex', age: 30 },
            { name: 'Dan', age: 25 },
            { name: 'Bob', age: 20 }
        ];

        const dataSource = createDataSource(array, { key: 'name' });

        const ascOrder = ['Dan', 'Alex', 'Bob'];

        this.applyOptions({
            commonColumnSettings: { allowSorting: true },
            customizeColumns: function() {},
            columns: [{
                dataField: 'name', calculateSortValue: function(data) {
                    if(this.sortOrder === 'asc') {
                        return $.inArray(data.name, ascOrder);
                    }

                    return data.name;
                }
            }, 'age'],
            sorting: { mode: 'single' }
        });
        this.dataController.setDataSource(dataSource);
        dataSource.load();

        // act
        this.columnsController.changeSortOrder(0, 'asc');

        assert.deepEqual(this.dataController.items().map(item => item.key), ascOrder);
    });

    QUnit.test('sorting when sortingMethod is defined', function(assert) {
        const array = [
            { name: 'Alex', age: 30 },
            { name: 'Dan', age: 25 },
            { name: 'Bob', age: 20 }
        ];

        const order = ['Dan', 'Bob', 'Alex'];
        const dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

        this.applyOptions({
            commonColumnSettings: { allowSorting: true },
            columns: [{
                dataField: 'name', sortingMethod: function(x, y) {
                    return order.indexOf(x) - order.indexOf(y);
                }
            }, 'age'],
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

    QUnit.test('update sorting on columnsChanged (changeType == \'sorting\'). Several updates', function(assert) {
        const array = [
            { name: 'Alex', age: 30 },
            { name: 'Dan', age: 25 },
            { name: 'Bob', age: 20 }
        ];
        const dataSource = createDataSource(array, { key: 'name' });

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
    QUnit.test('changed when ArrayStore with datetime fields in string format', function(assert) {
        const columnsChangedArgs = [];
        let changedCount = 0;
        const dataController = this.dataController;

        const dataSource = createDataSource([
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
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataController.items()[0].values[1], new Date(1987, 4, 5));
        assert.equal(changedCount, 1);
        assert.equal(columnsChangedArgs.length, 1);
        assert.equal(columnsChangedArgs[0].changeTypes.length, 1);
        assert.ok(columnsChangedArgs[0].changeTypes.columns);
    });

    QUnit.test('changed when ArrayStore with datetime fields in string format and sorting defined', function(assert) {
        const columnsChangedArgs = [];
        let changedCount = 0;
        const dataController = this.dataController;

        const dataSource = createDataSource([
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
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataController.items()[0].values[1], new Date(1985, 2, 21));
        // T122785
        assert.equal(changedCount, 1, 'one load');
        assert.equal(columnsChangedArgs.length, 1);
        // T174640
        assert.equal(columnsChangedArgs[0].changeTypes.length, 1);
        assert.ok(columnsChangedArgs[0].changeTypes.columns);
    });

    QUnit.test('changed when ArrayStore with datetime fields in string format and sorting defined and serializationFormat defined', function(assert) {
        const columnsChangedArgs = [];
        let changedCount = 0;
        const dataController = this.dataController;

        const dataSource = createDataSource([
            { name: 'Alex', birthDate: '1987-05-05T00:00:00Z' },
            { name: 'Dan', birthDate: '1985-03-21T00:00:00Z' }
        ], {}, { asyncLoadEnabled: true });

        this.applyOptions({
            columns: ['Alex', { dataField: 'birthDate', dataType: 'date', serializationFormat: 'yyyy-MM-ddTHH:mm:ss\'Z\'', sortOrder: 'asc' }]
        });
        dataController.changed.add(function() {
            changedCount++;
        });
        this.columnsController.columnsChanged.add(function(e) {
            columnsChangedArgs.push(e);
        });
        dataController.setDataSource(dataSource);
        dataSource.load();
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataController.items()[0].values[1], new Date(Date.UTC(1985, 2, 21)));
        assert.equal(changedCount, 1, 'one load');
        assert.equal(columnsChangedArgs.length, 1);
        assert.equal(columnsChangedArgs[0].changeTypes.length, 1);
        assert.ok(columnsChangedArgs[0].changeTypes.columns);
    });

    QUnit.test('update lookup items on refresh', function(assert) {
        let changedCount = 0;
        const dataController = this.dataController;

        let lookupLoadResult = [];

        this.options.loadingTimeout = 0;

        const dataSource = createDataSource([
            { name: 'Alex', birthDate: '5/5/1987' },
            { name: 'Dan', birthDate: '3/21/1985' }
        ]);

        this.applyOptions({
            columns: [{
                dataField: 'name', lookup: {
                    valueExpr: 'test',
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
        this.clock.tick(10);

        lookupLoadResult = $.Deferred();
        // act

        dataController.changed.add(function(args) {
            changedCount++;
        });

        let refreshed = false;

        // act
        dataController.refresh().done(function() {
            refreshed = true;
        });

        this.clock.tick(10);
        // assert
        assert.equal(changedCount, 0, 'changed call count');
        assert.ok(!refreshed, 'not refreshed');

        // act
        lookupLoadResult.resolve([]);

        // assert
        assert.equal(changedCount, 0, 'changed call count');
        assert.ok(!refreshed, 'not refreshed');
        this.clock.tick(10);
        assert.equal(changedCount, 1, 'changed call count');
        assert.ok(refreshed, 'refreshed');
    });

    QUnit.test('not update lookup items on refresh with changesOnly', function(assert) {
        let changedCount = 0;
        const dataController = this.dataController;
        let lookupLoadCount = 0;

        const dataSource = createDataSource([
            { name: 'Alex', birthDate: '5/5/1987' },
            { name: 'Dan', birthDate: '3/21/1985' }
        ], {}, { asyncLoadEnabled: true });

        this.applyOptions({
            columns: [{
                dataField: 'name', lookup: {
                    valueExpr: 'test',
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

        dataController.changed.add(function(args) {
            changedCount++;
        });


        // assert
        assert.equal(lookupLoadCount, 1, 'lookup load count');

        // act
        dataController.refresh(true);
        this.clock.tick(10);

        // assert
        assert.equal(changedCount, 1, 'changed call count');
        assert.equal(lookupLoadCount, 1, 'lookup load count is not changed');
    });

    QUnit.test('Not Update lookup items when no valueExpr', function(assert) {
        let changedCount = 0;
        const dataController = this.dataController;
        let lookupLoadCount = 0;

        const dataSource = createDataSource([
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
        this.clock.tick(10);

        // assert
        assert.equal(changedCount, 1, 'changed call count');
        assert.equal(lookupLoadCount, 0, 'lookup load count');
    });

    QUnit.test('Not Update lookup items on change sorting', function(assert) {
        let changedCount = 0;
        const dataController = this.dataController;
        let lookupLoadCount = 0;

        const dataSource = createDataSource([
            { name: 'Alex', birthDate: '5/5/1987' },
            { name: 'Dan', birthDate: '3/21/1985' }
        ], {}, { asyncLoadEnabled: true });

        this.applyOptions({
            sorting: { mode: 'single' },
            columns: [{
                allowSorting: true,
                dataField: 'name', lookup: {
                    valueExpr: 'test',
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
        this.clock.tick(10);


        dataController.changed.add(function(args) {
            changedCount++;
        });

        changedCount = 0;
        lookupLoadCount = 0;


        // act
        this.columnsController.changeSortOrder(0, 'desc');
        this.clock.tick(10);

        // assert
        assert.equal(changedCount, 1, 'changed call count');
        assert.equal(lookupLoadCount, 0, 'lookup load count');
    });

    QUnit.test('byKey from loaded items', function(assert) {
    // arrange
        const array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Sam', phone: '66-66-66' },
            { name: 'Dan', phone: '98-75-21' }
        ];
        let data;

        const dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        // act
        this.dataController.byKey('Alex').done(function(result) {
            data = result;
        });

        // assert
        assert.equal(this.dataController.items().length, 2, 'count loaded items');
        assert.deepEqual(data, { name: 'Alex', phone: '55-55-55' }, 'data');
    });

    QUnit.test('byKey from data store', function(assert) {
    // arrange
        const array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Sam', phone: '66-66-66' },
            { name: 'Dan', phone: '98-75-21' }
        ];
        let data;

        const dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        // act
        this.dataController.byKey('Dan').done(function(result) {
            data = result;
        });

        // assert
        assert.equal(this.dataController.items().length, 2, 'count loaded items');
        assert.deepEqual(data, { name: 'Dan', phone: '98-75-21' }, 'data');
    });

    QUnit.test('byKey when not has key', function(assert) {
    // arrange
        const array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Sam', phone: '66-66-66' },
            { name: 'Dan', phone: '98-75-21' }
        ];
        let data;

        const dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        // act
        this.dataController.byKey('Test').done(function(result) {
            data = result;
        });

        // assert
        assert.equal(this.dataController.items().length, 2, 'count loaded items');
        assert.strictEqual(data, undefined, 'not data');
    });

    QUnit.test('getDataByKeys from loaded items and data store', function(assert) {
    // arrange
        const array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Sam', phone: '66-66-66' },
            { name: 'Dan', phone: '98-75-21' }
        ];
        let data;

        const dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        // act
        this.dataController.getDataByKeys(['Alex', 'Dan']).done(function(result) {
            data = result;
        });

        // assert
        assert.equal(this.dataController.items().length, 2, 'count loaded items');
        assert.equal(data.length, 2, 'count data');
        assert.deepEqual(data[0], { name: 'Alex', phone: '55-55-55' }, 'data 1');
        assert.deepEqual(data[1], { name: 'Dan', phone: '98-75-21' }, 'data 2');
    });

    QUnit.test('getDataByKeys not has keys', function(assert) {
    // arrange
        const array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Sam', phone: '66-66-66' },
            { name: 'Dan', phone: '98-75-21' }
        ];
        let data;

        const dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        // act
        this.dataController.getDataByKeys(['Sam', 'Test2']).done(function(result) {
            data = result;
        });

        // assert
        assert.equal(this.dataController.items().length, 2, 'count loaded items');
        assert.equal(data.length, 1, 'count data');
        assert.deepEqual(data[0], { name: 'Sam', phone: '66-66-66' }, 'data 1');
        assert.strictEqual(data[1], undefined, 'not data 2');
    });

    QUnit.test('getKeyByRowIndex', function(assert) {
    // arrange
        const array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Sam', phone: '66-66-66' },
            { name: 'Dan', phone: '98-75-21' }
        ];

        const dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        // act, assert
        assert.strictEqual(this.dataController.getKeyByRowIndex(0), 'Alex');
        assert.strictEqual(this.dataController.getKeyByRowIndex(1), 'Sam');
        assert.strictEqual(this.dataController.getKeyByRowIndex(5), undefined);
    });

    QUnit.test('getRowIndexByKey', function(assert) {
    // arrange
        const array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Sam', phone: '66-66-66' },
            { name: 'Dan', phone: '98-75-21' }
        ];

        const dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        // act, assert
        assert.strictEqual(this.dataController.getRowIndexByKey('Alex'), 0);
        assert.strictEqual(this.dataController.getRowIndexByKey('Sam'), 1);
        assert.strictEqual(this.dataController.getRowIndexByKey('Unknown'), -1);
    });

    // T174450
    QUnit.test('Assign loaded dataSource instance', function(assert) {
    // arrange
        const dataSource = new DataSource({
            store: [
                { age: 30 },
                { age: 20 },
                { age: 25 }
            ],
            group: 'age',
            _preferSync: true
        });

        dataSource.load();

        // act
        this.option('dataSource', dataSource);

        // assert
        assert.equal(this.dataController.items().length, 3);
        assert.equal(this.dataController.items()[0].rowType, 'group');
        assert.equal(this.dataController.items()[1].rowType, 'group');
        assert.equal(this.dataController.items()[2].rowType, 'group');
    });

    // T174450
    QUnit.test('Assign dataSource instance in loading', function(assert) {
    // arrange
        const dataSource = new DataSource({
            store: [
                { age: 30 },
                { age: 20 },
                { age: 25 }
            ],
            group: 'age'
        });

        dataSource.load();

        // act
        this.option('dataSource', dataSource);

        this.clock.tick(10);

        // assert
        assert.equal(this.dataController.items().length, 3);
        assert.equal(this.dataController.items()[0].rowType, 'group');
        assert.equal(this.dataController.items()[1].rowType, 'group');
        assert.equal(this.dataController.items()[2].rowType, 'group');
    });

    QUnit.test('Remote operations with ArrayStore', function(assert) {
    // arrange
        this.applyOptions({
            remoteOperations: 'auto',
            dataSource: [
                { name: 'Alex', age: 20, phone: '55-55-55' },
                { name: 'Dan', age: 30, phone: '98-75-21' }
            ]
        });

        // actt
        this.dataController._refreshDataSource();

        // assert
        assert.deepEqual(this.dataController.dataSource().remoteOperations(), {}, 'remote operations set correct');
    });

    QUnit.test('Enable all remote operations if groupPaging is true', function(assert) {
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

    QUnit.test('No redefine user remoteOperations when remote groupPaging is true', function(assert) {
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

    QUnit.test('Remote operations with CustomStore', function(assert) {
    // arrange
        this.applyOptions({
            remoteOperations: 'auto',
            dataSource: {
                load: function() { }
            }
        });

        // actt
        this.dataController._refreshDataSource();

        // assert
        assert.deepEqual(this.dataController.dataSource().remoteOperations(), {}, 'remote operations set correct');
    });

    QUnit.test('Set remoteOperations option to true', function(assert) {
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
        assert.deepEqual(this.dataController.dataSource().remoteOperations(), { filtering: true, sorting: true, paging: true, grouping: true, summary: true }, 'remote operations set correct');
    });

    // T541798
    QUnit.test('Apply sorting by the lookup column with calculateSortValue when the first load', function(assert) {
    // arrange
        const array = [
            { State: 1 },
            { State: 2 },
            { State: 3 }
        ];

        this.applyOptions({
            dataSource: array,
            columns: [{
                dataField: 'State',
                sortOrder: 'asc',
                lookup: {
                    valueExpr: 'id',
                    displayExpr: 'name',
                    dataSource: [{
                        id: 1,
                        name: 'Wyoming'
                    }, {
                        id: 2,
                        name: 'California'
                    }, {
                        id: 3,
                        name: 'Arkansas'
                    }]
                },
                calculateSortValue: function(data) {
                    const value = this.calculateCellValue(data);
                    return this.lookup.calculateCellValue(value);
                }
            }]
        });

        // act
        this.dataController._refreshDataSource();

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, 3, 'count item');
        assert.deepEqual(items[0].data, { State: 3 });
        assert.deepEqual(items[1].data, { State: 2 });
        assert.deepEqual(items[2].data, { State: 1 });
    });
});

QUnit.module('No dataSource', { beforeEach: setupModule, afterEach: teardownModule }, () => {

    QUnit.test('getters', function(assert) {
        assert.strictEqual(this.dataController.items().length, 0);
        assert.strictEqual(this.dataController.totalItemsCount(), 0);
        assert.strictEqual(this.dataController.pageCount(), 1);
        assert.strictEqual(this.dataController.pageIndex(), 0);
        assert.strictEqual(this.dataController.pageSize(), 0);
        assert.strictEqual(this.dataController.isLoading(), false);
    });

    QUnit.test('change pageIndex', function(assert) {
        this.applyOptions({});
        this.dataController.pageIndex(2);
        assert.strictEqual(this.dataController.pageIndex(), 0);
    });

    QUnit.test('change pageSize', function(assert) {
        this.applyOptions({});
        this.dataController.pageSize(100);
        assert.strictEqual(this.dataController.pageSize(), 0);
    });

    QUnit.test('refresh', function(assert) {
        this.applyOptions({});
        this.dataController.refresh();
        assert.ok(1);
    });

    QUnit.test('begin/end customLoading', function(assert) {
        this.applyOptions({});
        this.dataController.beginCustomLoading();
        assert.ok(this.dataController.isLoading());
        this.dataController.endCustomLoading();
        assert.ok(!this.dataController.isLoading());
    });
});

QUnit.module('Loading', { beforeEach: setupModule, afterEach: teardownModule }, () => {

    QUnit.test('LoadingChanged event on one loading', function(assert) {
        const that = this;
        const loadingStates = [];
        const dataSource = createDataSource([{ id: 1 }, { id: 2 }, { id: 3 }], {}, {
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

    QUnit.test('isLoading for loaded dataSource', function(assert) {
        const arrayStore = new ArrayStore([]);
        const dataSource = new DataSource({
            store: arrayStore,
            _preferSync: true
        });

        // act
        this.dataController.setDataSource(dataSource);
        dataSource.load();

        // assert
        assert.ok(!this.dataController.isLoading());
    });

    QUnit.test('begin custom loading', function(assert) {
        const loadingStates = [];
        const dataSource = createDataSource([]);
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

    QUnit.test('end custom loading', function(assert) {
        const loadingStates = [];
        const dataSource = createDataSource([]);
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
    QUnit.test('Loading for lookup column', function(assert) {
        const lookupDeferred = $.Deferred();
        const loadingStates = [];
        const arrayStore = new ArrayStore([]);
        const dataSource = new DataSource({
            store: arrayStore,
            _preferSync: true
        });

        this.applyOptions({
            columns: [{
                dataField: 'testId',
                lookup: {
                    valueExpr: 'test',
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
});

QUnit.module('Parsing values', { beforeEach: setupModule, afterEach: teardownModule }, () => {

    QUnit.test('Null value for dateTime dataType', function(assert) {
        const array = [
            { name: 'Alex', birthday: null }
        ];
        const dataSource = createDataSource(array, { key: 'name' });

        this.applyOptions({
            columns: ['name', { dataField: 'birthday', dataType: 'date', format: 'shortDate' }]
        });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        assert.deepEqual(this.dataController.items()[0].values, ['Alex', null]);
    });

    QUnit.test('value from calculateCellValue', function(assert) {
        const array = [
            { firstName: 'Alex', secondName: 'Ivanov' },
            { firstName: 'Boris', secondName: 'Sidorov' }
        ];
        const dataSource = createDataSource(array, { key: 'name' });

        this.applyOptions({
            columns: [{ calculateCellValue: function(data) { return data.firstName + ' ' + data.secondName; } }]
        });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        assert.equal(this.dataController.items().length, 2);
        assert.deepEqual(this.dataController.items()[0].values, ['Alex Ivanov']);
        assert.deepEqual(this.dataController.items()[1].values, ['Boris Sidorov']);
    });
});

const setupPagingModule = function() {
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
    const dataSource = createDataSource(this.array, { key: 'name' }, {
        pageSize: 5,
        paginate: true
    });

    this.dataSource = dataSource;
};

const teardownPagingModule = function() {
    teardownModule.apply(this);
};

QUnit.module('Paging', { beforeEach: setupPagingModule, afterEach: teardownPagingModule }, () => {

    QUnit.test('PagesCount, TotalCount, Rows after initialization', function(assert) {
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

    QUnit.test('PagesCount after filter dataSource', function(assert) {
        let changedCount = 0;

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

    QUnit.test('Change pageIndex', function(assert) {
    // arrange
        let countCallPageChanged = 0;

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
        assert.equal(countCallPageChanged, 1, 'pageChanged is called');
    });

    QUnit.test('get pageIndex after change dataSource pageIndex', function(assert) {
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();
        this.dataSource.pageIndex(1);
        this.dataSource.reload(true);

        assert.equal(this.dataController.items().length, 2);
        assert.equal(this.dataController.pageIndex(), 1);
    });

    // B233043
    QUnit.test('change pageIndex to greater then pageCount', function(assert) {
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();
        this.dataController.pageIndex(5);

        assert.equal(this.dataController.items().length, 2);
        assert.equal(this.dataController.pageIndex(), 1);
    });

    // T746935
    QUnit.test('dataSource should not be reloaded when pageIndex is normalized after grouping', function(assert) {
        this.applyOptions({
            columns: ['name', 'group']
        });

        const loadingSpy = sinon.spy();
        this.dataSource.store().on('loading', loadingSpy);

        this.dataController.setDataSource(this.dataSource);
        this.dataSource.pageIndex(1);
        this.dataSource.load();

        // act
        this.dataSource.group([{ selector: 'group' }]);
        this.dataSource.load();

        // assert
        assert.equal(loadingSpy.callCount, 1, 'dataSource is loaded once');
        assert.equal(this.dataController.items().length, 1, 'item count');
        assert.equal(this.dataController.items()[0].rowType, 'group', 'first row type');
        assert.equal(this.dataController.pageIndex(), 0, 'pageIndex');
    });

    QUnit.test('Change pageSize', function(assert) {
    // arrange
        let countCallPageChanged = 0;

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
        assert.equal(countCallPageChanged, 1, 'count call pageChanged');
    });

    QUnit.test('Change dataSource after change pageSize', function(assert) {
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
    QUnit.test('Change dataSource after change pageIndex', function(assert) {
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


    QUnit.test('Rise changed on set pageSize', function(assert) {
        let changedCount = 0;

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

    QUnit.test('Rise changed on set pageSize with changing pageCount', function(assert) {
        let changedCount = 0;

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
    QUnit.test('Rise changed on set pageIndex', function(assert) {
        let changedCallCount = 0;
        const dataController = this.dataController;
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();
        dataController.changed.add(function() {
            changedCallCount++;
        });
        dataController.pageIndex(1);
        this.clock.tick(10);
        assert.equal(dataController.pageIndex(), 1);
        assert.equal(changedCallCount, 1);
    });


    QUnit.test('Not Rise changed on get pageIndex', function(assert) {
        let changedCount = 0;
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();
        this.dataController.changed.add(function() {
            changedCount++;
        });
        assert.equal(this.dataController.pageIndex(), 0);
        assert.equal(changedCount, 0);
    });

    QUnit.test('update pageCount after insert', function(assert) {
        let changedCount = 0;
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
    QUnit.test('initialize pageIndex, pageSize from paging options when dataSource is DataSource instance', function(assert) {
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

    QUnit.test('Page size of data source is not changed for old value_T242652', function(assert) {
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        // act
        let dataSourceChangedCounter = 0;

        this.dataSource.on('changed', function() {
            dataSourceChangedCounter++;
        });

        this.dataController.pageSize(1);
        this.dataController.pageSize(1);

        // assert
        assert.equal(dataSourceChangedCounter, 1);
    });
});

const setupVirtualScrollingModule = function() {
    this.options = {
        scrolling: { mode: 'virtual' },
        pager: { visible: 'auto' }
    };
    setupModule.apply(this);


    const array = [];

    for(let i = 0; i < 1000; i++) {
        array.push({
            id: i,
            value: 'value' + i.toString()
        });
    }

    const dataSource = createDataSource(array, { key: 'id' }, {
        pageSize: 20,
        paginate: true
    });

    this.array = array;

    this.dataController.setDataSource(dataSource);
    this.dataController.viewportSize(10);
    dataSource.load();
    this.dataSource = dataSource;
};

const teardownVirtualScrollingModule = function() {
    teardownModule.apply(this);
};

QUnit.module('Virtual scrolling', { beforeEach: setupVirtualScrollingModule, afterEach: teardownVirtualScrollingModule }, () => {

    QUnit.test('virtual items return null when no virtual scrolling', function(assert) {
        const dataSource = createDataSource(this.array, { key: 'id' }, {
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

    QUnit.test('virtual items when virtual scrolling enabled', function(assert) {
        const virtualItemsCount = this.dataController.virtualItemsCount();
        assert.ok(virtualItemsCount);
    });

    QUnit.test('virtual items at begin', function(assert) {
        const virtualItemsCount = this.dataController.virtualItemsCount();
        assert.ok(virtualItemsCount);
        assert.deepEqual(virtualItemsCount, {
            begin: 0,
            end: 980
        });
        assert.equal(this.dataController.items().length, 20);
    });

    QUnit.test('virtual items at end', function(assert) {
        this.dataController.setViewportItemIndex(985);
        const virtualItemsCount = this.dataController.virtualItemsCount();
        assert.ok(virtualItemsCount);
        assert.deepEqual(virtualItemsCount, {
            begin: 960,
            end: 0
        });
        assert.equal(this.dataController.items().length, 40);
    });

    QUnit.test('virtual items after small scrolling at beginning', function(assert) {
        this.dataController.setViewportItemIndex(1);
        const virtualItemsCount = this.dataController.virtualItemsCount();
        assert.ok(virtualItemsCount);
        assert.deepEqual(virtualItemsCount, {
            begin: 0,
            end: 960
        });
        assert.equal(this.dataController.items().length, 40);
    });

    QUnit.test('virtual items before page center', function(assert) {
        this.dataController.setViewportItemIndex(9);
        const virtualItemsCount = this.dataController.virtualItemsCount();
        assert.ok(virtualItemsCount);
        assert.deepEqual(virtualItemsCount, {
            begin: 0,
            end: 960
        });
        assert.equal(this.dataController.items().length, 40);
        assert.strictEqual(this.dataController.pageIndex(), 0);
    });

    QUnit.test('virtual items after page center', function(assert) {
        this.dataController.setViewportItemIndex(11);
        const virtualItemsCount = this.dataController.virtualItemsCount();
        assert.ok(virtualItemsCount);
        assert.deepEqual(virtualItemsCount, {
            begin: 0,
            end: 960
        });
        assert.equal(this.dataController.items().length, 40);
        assert.strictEqual(this.dataController.pageIndex(), 0);
    });

    QUnit.test('virtual items before page end', function(assert) {
        this.dataController.setViewportItemIndex(19);
        const virtualItemsCount = this.dataController.virtualItemsCount();
        assert.ok(virtualItemsCount);
        assert.deepEqual(virtualItemsCount, {
            begin: 0,
            end: 960
        });
        assert.equal(this.dataController.items().length, 40);
        assert.strictEqual(this.dataController.pageIndex(), 0);
    });

    QUnit.test('virtual items after page end', function(assert) {
        this.dataController.setViewportItemIndex(21);
        const virtualItemsCount = this.dataController.virtualItemsCount();
        assert.ok(virtualItemsCount);
        assert.deepEqual(virtualItemsCount, {
            begin: 0,
            end: 940
        });
        assert.equal(this.dataController.items().length, 60);
        assert.strictEqual(this.dataController.pageIndex(), 1);
    });


    QUnit.test('virtual items after change current page to next', function(assert) {
        this.dataController.setViewportItemIndex(25);
        const virtualItemsCount = this.dataController.virtualItemsCount();
        assert.ok(virtualItemsCount);
        assert.deepEqual(virtualItemsCount, {
            begin: 0,
            end: 940
        });
        assert.equal(this.dataController.items().length, 60);
        assert.strictEqual(this.dataController.pageIndex(), 1);
    });

    QUnit.test('virtual items after change current page to previous', function(assert) {
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

    QUnit.test('virtual items after change current page to far', function(assert) {
        this.dataController.setViewportItemIndex(400);
        const virtualItemsCount = this.dataController.virtualItemsCount();
        assert.deepEqual(virtualItemsCount, {
            begin: 400,
            end: 560
        });
        assert.equal(this.dataController.items().length, 40);
        assert.strictEqual(this.dataController.pageIndex(), 20);
    });

    QUnit.test('virtual items on end when last page size less than half page size', function(assert) {
        const dataController = this.dataController;
        dataController.store().insert({ id: 1001, value: 'value1001' });
        dataController.refresh();

        dataController.setViewportItemIndex(999);
        assert.strictEqual(this.dataController.pageIndex(), 49);

        this.clock.tick(10);

        assert.strictEqual(dataController.items().length, 21, 'items');

        // act
        const virtualItemsCount = dataController.virtualItemsCount();

        // assert
        assert.strictEqual(virtualItemsCount.begin, 980);
        assert.strictEqual(virtualItemsCount.end, 0);
    });

    // T866890
    QUnit.test('virtual items on end when last page size less than viewport size', function(assert) {
        const dataController = this.dataController;
        dataController.store().insert({ id: 1001 });
        dataController.store().insert({ id: 1002 });
        dataController.store().insert({ id: 1003 });
        dataController.store().insert({ id: 1004 });
        dataController.refresh();

        dataController.viewportSize(3);

        // act
        dataController.setViewportItemIndex(1002);

        // assert
        assert.strictEqual(this.dataController.pageIndex(), 50);
        assert.strictEqual(dataController.items().length, 24, 'items');
    });

    // B233350
    QUnit.test('virtual items on end when visibleRowsCount < pageSize and last page size greater than half page size', function(assert) {
        const dataController = this.dataController;
        dataController._dataSource.store().remove(999);
        dataController.refresh();
        dataController.setViewportItemIndex(998);
        assert.strictEqual(this.dataController.pageIndex(), 49);

        this.clock.tick(10);

        assert.strictEqual(dataController.items().length, 39);

        // act
        const virtualItemsCount = dataController.virtualItemsCount();

        // assert
        assert.strictEqual(virtualItemsCount.begin, 960);
        assert.strictEqual(virtualItemsCount.end, 0);
    });

    QUnit.test('virtual items on setViewportItemIndex at end', function(assert) {
    // act
        this.dataController.setViewportItemIndex(990);

        // assert

        assert.strictEqual(this.dataController.items().length, 40);
        assert.strictEqual(this.dataController.virtualItemsCount().end, 0);
    });

    QUnit.test('getAllRowsCount for virtual scrolling', function(assert) {
        assert.strictEqual(this.dataController.totalItemsCount(), 1000);
    });

    // T308521
    QUnit.test('change sorting in onContentReady', function(assert) {
    // arrange
        const that = this;
        let countCallChanged = 0;
        let countCallDataSourceChanged = 0;
        const dataSource = that.dataController.dataSource();

        that.dataController.changed.add(function() {
            that.columnOption('id', 'sortOrder', 'desc');
            countCallChanged++;
        });

        dataSource.changed.add(function() {
            countCallDataSourceChanged++;
        });

        // act
        dataSource.reload(true);

        // arrange
        assert.equal(that.dataController.items()[0].key, 999, 'sorting is applied');
        assert.equal(countCallChanged, 2, 'count call changed of the dataController');
        assert.equal(countCallDataSourceChanged, 2, 'count call changed of the dataSource');
    });

    // T717716
    QUnit.test('rows should not be recreated on pageIndex event', function(assert) {
        const rows = this.getVisibleRows();
        const firstRow = rows[0];

        // act
        this.dataController.dataSource().changed.fire({ changeType: 'pageIndex' });

        // assert
        assert.strictEqual(this.getVisibleRows(), rows, 'rows are not changed');
        assert.strictEqual(this.getVisibleRows()[0], firstRow, 'first row is not changed');
    });
});

const setupVirtualRenderingModule = function() {
    const array = [];

    for(let i = 0; i < 100; i++) {
        array.push({
            id: i,
            value: 'value' + i.toString()
        });
    }
    this.array = array;

    this.clock = sinon.useFakeTimers();

    const options = {
        scrolling: { mode: 'virtual', rowRenderingMode: 'virtual', prerenderedRowCount: 0 },
        keyExpr: 'id',
        paging: {
            pageSize: 20
        },
        editing: {
            mode: 'batch'
        },
        dataSource: array
    };

    setupDataGridModules(this, ['data', 'virtualScrolling', 'columns', 'filterRow', 'search', 'editorFactory', 'editing', 'editingRowBased', 'editingCellBased', 'grouping', 'headerFilter', 'masterDetail'], {
        initDefaultOptions: true,
        options: options
    });


    this.dataController.viewportItemSize(10);
    this.dataController.viewportSize(10);
    this.dataController._dataSource._renderTime = 50;

    this.clock.tick(10);

    this.changedArgs = [];

    const that = this;

    this.dataController.changed.add(function(e) {
        that.changedArgs.push(e);
    });

    this._views.rowsView = { ...rowsViewMock };
};

const teardownVirtualRenderingModule = function() {
    this.dispose();
    this.clock.restore();
};

QUnit.module('Virtual rendering', { beforeEach: setupVirtualRenderingModule, afterEach: teardownVirtualRenderingModule }, () => {

    QUnit.test('first render', function(assert) {
        assert.strictEqual(this.dataController.pageIndex(), 0);
        assert.strictEqual(this.dataController.items().length, 10);

        assert.strictEqual(this.dataController.getContentOffset('begin'), 0);
        assert.strictEqual(this.dataController.getContentOffset('end'), 900);
    });

    QUnit.test('scroll to before second render page', function(assert) {
        this.dataController.setViewportPosition(49);

        assert.strictEqual(this.dataController.pageIndex(), 0);
        assert.strictEqual(this.dataController.items().length, 11);
        assert.strictEqual(this.dataController.items()[0].key, 4);
        assert.strictEqual(this.dataController.getContentOffset('begin'), 40);
        assert.strictEqual(this.dataController.getContentOffset('end'), 850);
    });

    QUnit.test('scroll to second render page', function(assert) {
        const oldItems = this.dataController.items().slice();
        this.dataController.setViewportPosition(50);

        assert.strictEqual(this.dataController.pageIndex(), 0);
        assert.strictEqual(this.dataController.items().length, 10);
        assert.strictEqual(this.dataController.items()[0].key, 5);
        assert.strictEqual(this.dataController.getContentOffset('begin'), 50);
        assert.strictEqual(this.dataController.getContentOffset('end'), 850);
        assert.deepEqual(this.changedArgs, [{
            changeType: 'update',
            isLiveUpdate: true,
            repaintChangesOnly: true,
            needUpdateDimensions: true,
            changeTypes: [
                'remove',
                'remove',
                'remove',
                'remove',
                'remove',
                'insert',
                'insert',
                'insert',
                'insert',
                'insert',
            ],
            columnIndices: [
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ],
            operationTypes: {
                filtering: false,
                fullReload: false,
                groupExpanding: undefined,
                grouping: false,
                pageIndex: false,
                pageSize: false,
                paging: true,
                reload: false,
                skip: false,
                sorting: false,
                take: true
            },
            rowIndices: [0, 0, 0, 0, 0, 5, 6, 7, 8, 9],
            items: oldItems.slice(0, 5).concat(this.dataController.items().slice(5, 10)),
        }]);
    });

    QUnit.test('scroll to second render page after expand row on the first page', function(assert) {
        this.dataController.expandRow(1);
        this.changedArgs = [];
        this.dataController.setViewportPosition(50);

        assert.strictEqual(this.dataController.pageIndex(), 0);
        assert.strictEqual(this.dataController.items().length, 10);
        assert.strictEqual(this.dataController.items()[0].key, 5);
        assert.strictEqual(this.dataController.getContentOffset('begin'), 50);
        assert.strictEqual(this.dataController.getContentOffset('end'), 850);
        assert.deepEqual(this.changedArgs[0].changeType, 'update');
        assert.deepEqual(this.changedArgs[0].changeTypes, [
            'remove',
            'remove',
            'remove',
            'remove',
            'remove',
            'remove',
            'insert',
            'insert',
            'insert',
            'insert',
            'insert',
        ]);
        assert.deepEqual(this.changedArgs[0].rowIndices, [0, 0, 0, 0, 0, 0, 5, 6, 7, 8, 9]);
        assert.strictEqual(this.changedArgs[0].items[6].key, 10);
    });

    QUnit.test('scroll to second render page and expand row after expand row on the first page', function(assert) {
        this.dataController.expandRow(1);
        this.dataController.setViewportPosition(50);
        this.dataController.expandRow(5);

        assert.strictEqual(this.dataController.items().length, 11);
        assert.strictEqual(this.dataController.items()[0].key, 5);
        assert.strictEqual(this.dataController.items()[0].rowType, 'data');
        assert.strictEqual(this.dataController.items()[1].key, 5);
        assert.strictEqual(this.dataController.items()[1].rowType, 'detail');
    });

    QUnit.test('scroll to second render page and expand row after expand row on the first page and refresh', function(assert) {
        this.dataController.expandRow(1);
        this.dataController.refresh();
        this.clock.tick(10);
        this.dataController.setViewportPosition(50);
        this.dataController.expandRow(5);

        assert.strictEqual(this.dataController.items().length, 11);
        assert.strictEqual(this.dataController.items()[0].key, 5);
        assert.strictEqual(this.dataController.items()[0].rowType, 'data');
        assert.strictEqual(this.dataController.items()[1].key, 5);
        assert.strictEqual(this.dataController.items()[1].rowType, 'detail');
    });

    QUnit.test('scroll to second render page and return to first after expand row on the first page', function(assert) {
        this.dataController.expandRow(1);
        this.dataController.setViewportPosition(50);
        this.changedArgs = [];
        this.dataController.setViewportPosition(0);

        assert.strictEqual(this.dataController.pageIndex(), 0);
        assert.strictEqual(this.dataController.items().length, 11);
        assert.strictEqual(this.dataController.items()[0].key, 0);
        assert.deepEqual(this.changedArgs[0].changeType, 'update');
        assert.deepEqual(this.changedArgs[0].changeTypes, [
            'insert',
            'insert',
            'insert',
            'insert',
            'insert',
            'insert',
            'remove',
            'remove',
            'remove',
            'remove',
            'remove',
        ]);
        assert.deepEqual(this.changedArgs[0].rowIndices, [0, 1, 2, 3, 4, 5, 11, 11, 11, 11, 11]);

        assert.strictEqual(this.changedArgs[0].items[0].key, 0);
    });

    QUnit.test('scroll to third render page', function(assert) {
        this.dataController.setViewportPosition(100);

        assert.strictEqual(this.dataController.pageIndex(), 0);
        assert.strictEqual(this.dataController.items().length, 10);
        assert.strictEqual(this.dataController.items()[0].key, 10);
        assert.strictEqual(this.dataController.getContentOffset('begin'), 100);
        assert.strictEqual(this.dataController.getContentOffset('end'), 800);
    });

    QUnit.test('scroll to second dataSource page', function(assert) {
        this.dataController.setViewportPosition(100);
        this.changedArgs = [];
        this.dataController.setViewportPosition(200);

        assert.strictEqual(this.dataController.pageIndex(), 1);
        assert.strictEqual(this.dataController.items().length, 10);
        assert.strictEqual(this.dataController.items()[0].key, 20);
        assert.strictEqual(this.dataController.getContentOffset('begin'), 200);
        assert.strictEqual(this.dataController.getContentOffset('end'), 700);
        assert.deepEqual(this.changedArgs.length, 2);
        assert.deepEqual(this.changedArgs[0].changeTypes, [
            'remove',
            'remove',
            'remove',
            'remove',
            'remove',
            'remove',
            'remove',
            'remove',
            'remove',
            'remove',
            'insert',
            'insert',
            'insert',
            'insert',
            'insert',
            'insert',
            'insert',
            'insert',
            'insert',
            'insert',
        ]);
        assert.deepEqual(this.changedArgs[0].rowIndices, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        assert.strictEqual(this.changedArgs[1].changeType, 'pageIndex');
    });

    QUnit.test('scroll to far', function(assert) {
        this.dataController.setViewportPosition(500);

        assert.strictEqual(this.dataController.pageIndex(), 2);
        assert.strictEqual(this.dataController.items().length, 10);
        assert.strictEqual(this.dataController.items()[0].key, 50);
        assert.strictEqual(this.dataController.getContentOffset('begin'), 500);
        assert.strictEqual(this.dataController.getContentOffset('end'), 400);
        assert.deepEqual(this.changedArgs.length, 2);
        assert.deepEqual(this.changedArgs[0].changeTypes, [
            'remove',
            'remove',
            'remove',
            'remove',
            'remove',
            'remove',
            'remove',
            'remove',
            'remove',
            'remove',
            'insert',
            'insert',
            'insert',
            'insert',
            'insert',
            'insert',
            'insert',
            'insert',
            'insert',
            'insert',
        ]);
        assert.deepEqual(this.changedArgs[0].rowIndices, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        assert.strictEqual(this.changedArgs[1].changeType, 'pageIndex');

    });

    // T730143
    QUnit.test('scroll to end if data is grouped and remoteOperations are enabled (sorting, filtering, paging)', function(assert) {
        this.pageSize(200);
        this.columnOption('value', 'groupIndex', 0);
        this.option('remoteOperations', {
            sorting: true,
            filtering: true,
            paging: true
        });
        this.dataController._refreshDataSource();
        this.clock.tick(300);

        const rowsScrollController = this.dataController._rowsScrollController;
        const defaultItemSize = rowsScrollController.getItemSize();
        const bottomPosition = (this.dataController.totalItemsCount() - this.dataController.viewportSize()) * defaultItemSize;

        // act
        this.dataController.setViewportPosition(bottomPosition);
        this.clock.tick(300);

        // assert
        const itemCount = this.dataController.items().length;
        assert.strictEqual(itemCount, 20);
        assert.deepEqual(this.dataController.items()[itemCount - 2].key, ['value99']);
        assert.strictEqual(this.dataController.items()[itemCount - 1].key, 99);
        assert.strictEqual(this.dataController.pageIndex(), 0);
        assert.strictEqual(this.dataController.itemsCount(), 100);
    });

    QUnit.test('scroll to previous render page', function(assert) {
        this.dataController.setViewportPosition(500);
        this.changedArgs = [];
        this.dataController.setViewportPosition(450);

        assert.strictEqual(this.dataController.items().length, 10);
        assert.strictEqual(this.dataController.items()[0].key, 45);
        assert.strictEqual(this.dataController.getContentOffset('begin'), 450);
        assert.strictEqual(this.dataController.getContentOffset('end'), 450);
        assert.deepEqual(this.changedArgs[0].changeTypes, [
            'insert',
            'insert',
            'insert',
            'insert',
            'insert',
            'remove',
            'remove',
            'remove',
            'remove',
            'remove',
        ]);
        assert.deepEqual(this.changedArgs[0].rowIndices, [0, 1, 2, 3, 4, 10, 10, 10, 10, 10]);
    });

    QUnit.test('disabled row render virtualization does not disable it', function(assert) {
        this.option('scrolling.rowRenderingMode', 'standard');
        this.dataController.viewportItemSize(10);
        this.dataController.viewportSize(10);
        this.clock.tick(10);

        assert.strictEqual(this.dataController.items().length, 10);
        assert.strictEqual(this.dataController.items()[0].key, 0);
        assert.strictEqual(this.dataController.getContentOffset('begin'), 0);
        assert.strictEqual(this.dataController.getContentOffset('end'), 900);
        assert.deepEqual(this.changedArgs, [{
            changeType: 'refresh',
            isDataChanged: true,
            repaintChangesOnly: false,
            items: this.dataController.items(),
            needUpdateDimensions: true,
            operationTypes: {
                fullReload: true,
                reload: true
            }
        }]);
    });

    QUnit.test('enabled row render virtualization and disabled scrolling mode virtual', function(assert) {
        this.options.scrolling.rowRenderingMode = 'virtual';
        this.options.scrolling.mode = 'standard';

        this.dataController.optionChanged({ name: 'scrolling' });
        this.dataController.viewportItemSize(10);
        this.dataController.viewportSize(10);
        this.clock.tick(10);

        assert.strictEqual(this.dataController.items().length, 10);
        assert.strictEqual(this.dataController.items()[0].key, 0);
        assert.strictEqual(this.dataController.getContentOffset('begin'), 0);
        assert.strictEqual(this.dataController.getContentOffset('end'), 100);
        assert.deepEqual(this.changedArgs, [{
            changeType: 'refresh',
            isDataChanged: true,
            needUpdateDimensions: true,
            repaintChangesOnly: false,
            items: this.dataController.items(),
            operationTypes: {
                fullReload: true,
                reload: true
            }
        }]);
    });

    QUnit.test('scroll to to the next page after expand', function(assert) {
        this.option('scrolling.rowRenderingMode', 'standard');
        this.dataController.viewportItemSize(10);
        this.dataController.viewportSize(10);
        this.clock.tick(10);

        this.dataController.expandRow(1);
        this.dataController.expandRow(19);
        this.dataController.expandRow(20);

        this.dataController.setViewportPosition(200);
        this.clock.tick(10);

        // act
        this.changedArgs = [];
        this.dataController.setViewportPosition(400);
        this.clock.tick(10);

        // assert
        assert.strictEqual(this.dataController.items().length, 10);
        assert.strictEqual(this.dataController.items()[0].key, 40);
        assert.strictEqual(this.dataController.getContentOffset('begin'), 400);
        assert.strictEqual(this.dataController.getContentOffset('end'), 500);
        assert.deepEqual(this.changedArgs.length, 2);
        assert.deepEqual(this.changedArgs[0].changeType, 'update');
        assert.deepEqual(this.changedArgs[0].changeTypes.filter(type => type === 'remove').length, 11);
        assert.deepEqual(this.changedArgs[0].changeTypes.filter(type => type === 'insert').length, 10);
        assert.deepEqual(this.changedArgs[0].items.length, 21);
        assert.strictEqual(this.changedArgs[1].changeType, 'pageIndex');
    });

    // T641290
    QUnit.test('Search should work correctly when rowRenderingMode is set to \'virtual\'', function(assert) {
    // arrange, act
        this.option('searchPanel.text', 'test');
        this.clock.tick(10);

        // assert
        assert.strictEqual(this.dataController.items().length, 0, 'item count');
        assert.strictEqual(this.dataController.pageCount(), 1, 'page count');

        // act
        this.option('searchPanel.text', '');
        this.clock.tick(10);

        // assert
        assert.strictEqual(this.dataController.items().length, 10, 'item count');
        assert.strictEqual(this.dataController.pageCount(), 5, 'page count');
    });

    QUnit.test('addRow > scroll to far > scroll back', function(assert) {
        // arrange
        this.addRow();

        // act
        this.dataController.setViewportPosition(500);

        // assert
        assert.strictEqual(this.dataController.items()[0].key, 50, 'first item key');

        // act
        this.dataController.setViewportPosition(0);

        // assert
        assert.strictEqual(this.dataController.items()[0].isNewRow, true, 'first item is new');
    });

    QUnit.test('addRow > scroll to near > add row > scroll back', function(assert) {
        this.options.scrolling.prerenderedRowChunkSize = 5;

        // act
        this.addRow();
        this.dataController.setViewportPosition(70);
        this._views.rowsView.getTopVisibleItemIndex = () => 1;

        this.addRow();
        this.dataController.setViewportPosition(0);

        // assert
        assert.strictEqual(this.dataController.items().length, 12, 'item count');
        assert.strictEqual(this.dataController.items()[0].isNewRow, true, 'item 0 is new');
        assert.strictEqual(this.dataController.items()[7].isNewRow, true, 'item 7 is new');
    });

    QUnit.test('addRow > scroll to little near > add row', function(assert) {
        this.options.scrolling.prerenderedRowChunkSize = 5;

        // act
        this.addRow();
        this.dataController.setViewportPosition(20);
        this._views.rowsView.getTopVisibleItemIndex = () => 2;
        this.addRow();

        // assert
        assert.strictEqual(this.dataController.items().length, 17, 'item count');
        assert.strictEqual(this.dataController.items()[0].isNewRow, true, 'item 0 is new');
        assert.strictEqual(this.dataController.items()[2].isNewRow, true, 'item 2 is new');
    });

    QUnit.test('scroll to near > add row > scroll to far > scroll back', function(assert) {
        // act
        this.dataController.setViewportPosition(50);
        this.addRow();
        this.dataController.setViewportPosition(500);
        this.dataController.setViewportPosition(0);

        // assert
        assert.strictEqual(this.dataController.items().length, 11, 'item count');
        assert.strictEqual(this.dataController.items()[5].isNewRow, true, 'item 5 is new');
    });

    QUnit.test('add row > scroll to second page', function(assert) {
        this.options.scrolling.prerenderedRowCount = 1;

        // act
        this.addRow();
        this.dataController.setViewportPosition(160);

        // assert
        assert.strictEqual(this.dataController.items().length, 11, 'item count');
        assert.strictEqual(this.dataController.items()[0].key, 16, 'item 16 from first page');
        assert.strictEqual(this.dataController.items()[4].key, 20, 'item 20 from first page');
        assert.strictEqual(this.dataController.items()[5].key, 21, 'item 21 from second page');
    });

    QUnit.test('scroll to second page > add row > scroll back > scroll to second page', function(assert) {
        // act
        this.dataController.viewportSize(16);
        this.dataController.setViewportPosition(200);
        this.addRow();
        this.dataController.setViewportPosition(150);
        this.dataController.setViewportPosition(150);
        this.dataController.setViewportPosition(100);
        this.dataController.setViewportPosition(50);

        const changedStub = sinon.stub();
        this.dataController.changed.add(changedStub);
        this.dataController.setViewportPosition(0);
        this.dataController.setViewportPosition(50);

        // assert
        assert.deepEqual(changedStub
            .getCalls()
            .map(c => c.args[0])
            .filter(e => e.changeType !== 'pageIndex')
            .map(({
                changeType, changeTypes
            }) => ({
                changeType,
                addCount: changeTypes.filter(type => type === 'insert').length,
                removeCount: changeTypes.filter(type => type === 'remove').length,
            })),
        [{
            changeType: 'update',
            addCount: 5,
            removeCount: 6
        }, {
            changeType: 'update',
            addCount: 6,
            removeCount: 5
        }], 'changed call args');

        assert.strictEqual(this.dataController.items().length, 17, 'item count');
        assert.strictEqual(this.dataController.items()[15].isNewRow, true, 'item 15 is new');
    });

    QUnit.test('scroll to third page > add row > scroll second page > add row > scroll to third page', function(assert) {
        // act
        this.dataController.setViewportPosition(600);
        this.addRow();
        this.dataController.setViewportPosition(400);
        this.dataController.setViewportPosition(200);
        this.dataController.setViewportPosition(0);
        this.dataController.setViewportPosition(200);
        this.dataController.setViewportPosition(400);
        this.dataController.setViewportPosition(600);

        // assert
        assert.strictEqual(this.dataController.items().length, 11, 'item count');
        assert.strictEqual(this.dataController.items()[0].isNewRow, true, 'item 0 is new');
    });
// =================================
// scrollingDataSource tests
});

QUnit.module('Virtual scrolling (ScrollingDataSource)', {
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
            const dataItems = [];

            items = items || this.dataController.items();

            $.each(items, function() {
                dataItems.push(this.data);
            });
            return dataItems;
        };

    },
    afterEach: teardownModule
}, () => {

    QUnit.test('load first page', function(assert) {
    // act
        this.setupDataSource({
            pageSize: 3
        });

        // assert
        assert.deepEqual(this.getDataItems(), [1, 2, 3], 'one page is loaded');
        assert.ok(this.dataController.isLoaded());
    });

    QUnit.test('preload next page after change viewport item index', function(assert) {
        this.setupDataSource({
            pageSize: 3
        });

        const changedArgs = [];

        this.dataController.viewportSize(2);
        this.dataController.setViewportItemIndex(0.1);

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
    QUnit.test('moving to loaded page rise changed event with changeType pageIndex', function(assert) {
        let changedCallsCount = 0;
        let changedArgs;

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

    QUnit.test('load pages after change viewport item index to far', function(assert) {
        const changedArgs = [];

        this.options.loadingTimeout = 0;
        this.options.scrolling.renderAsync = true;
        this.setupDataSource({
            pageSize: 2
        });
        this.dataController.viewportSize(2);
        this.clock.tick(10);
        this.dataController.changed.add(function(e) {
            changedArgs.push(e);
        });

        this.dataController.setViewportItemIndex(7);
        // act
        this.clock.next();

        // assert
        assert.equal(changedArgs.length, 0);

        // act
        this.clock.next();

        // assert
        assert.equal(changedArgs.length, 2);
        assert.equal(changedArgs[0].changeType, 'refresh');
        assert.deepEqual(changedArgs[1].changeType, 'append');
        assert.deepEqual(this.getDataItems(changedArgs[0].items), [7, 8]);
        assert.deepEqual(this.getDataItems(changedArgs[1].items), [9, 10]);
        assert.deepEqual(this.getDataItems(), [7, 8, 9, 10]);
        assert.ok(this.dataController.isLoaded());
    });

    // T103389
    QUnit.test('load several pages when pageSize less then viewportSize', function(assert) {
        const changedArgs = [];

        this.options.loadingTimeout = 0;
        this.setupDataSource({
            pageSize: 2
        });
        this.dataController.viewportSize(5);
        this.dataController.changed.add(function(e) {
            changedArgs.push(e);
        });
        // act
        this.clock.tick(10);

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
    QUnit.test('load several pages when pageSize less then viewportSize and preload enabled', function(assert) {
        const changedArgs = [];

        this.options.loadingTimeout = 0;
        this.options.scrolling.preloadEnabled = true;
        this.setupDataSource({
            pageSize: 2
        });
        this.dataController.viewportSize(5);
        this.dataController.changed.add(function(e) {
            changedArgs.push(e);
        });
        // act
        this.clock.tick(10);

        // assert
        assert.equal(changedArgs.length, 4);
        assert.deepEqual(this.getDataItems(), [1, 2, 3, 4, 5, 6, 7, 8]);
        assert.ok(this.dataController.isLoaded());
    });

    // T120733
    QUnit.test('reload pages after change viewport item index to far', function(assert) {
        const changedArgs = [];
        const virtualItems = [];

        this.options.loadingTimeout = 0;
        this.options.scrolling.renderAsync = true;
        this.setupDataSource({
            pageSize: 2
        });

        const dataController = this.dataController;


        this.clock.tick(10);
        dataController.setViewportItemIndex(7);
        this.clock.tick(10);
        dataController.changed.add(function(e) {
            changedArgs.push(e);
            virtualItems.push(dataController.virtualItemsCount());
        });

        // act
        dataController.reload(true);
        this.clock.next();

        // assert
        assert.deepEqual(changedArgs, []);
        assert.deepEqual(this.getDataItems(), [7, 8, 9, 10]);
        assert.ok(dataController.isLoaded());

        // act
        this.clock.next();

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

    QUnit.test('preload pages after change viewport item index', function(assert) {
        const changedArgs = [];

        this.options.scrolling.preloadEnabled = true;

        this.setupDataSource({
            pageSize: 3
        });

        const dataController = this.dataController;

        dataController.viewportSize(2);
        dataController.setViewportItemIndex(0.1);

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
    QUnit.test('Preload previous page after change viewport item index when preloadEnabled option is true', function(assert) {
    // arrange
        const changedArgs = [];

        this.options.scrolling.preloadEnabled = true;
        this.setupDataSource({
            pageSize: 1
        });

        const dataController = this.dataController;

        dataController.viewportSize(1);
        dataController.changed.add(function(e) {
            changedArgs.push(e);
        });

        // act
        dataController.setViewportItemIndex(4);

        // assert
        assert.equal(changedArgs.length, 4, 'load count');
        assert.equal(changedArgs[0].changeType, 'refresh', 'load current page');
        assert.equal(changedArgs[1].changeType, 'prepend', 'load previous page');
        assert.equal(changedArgs[2].changeType, 'append', 'load next page');
        assert.equal(changedArgs[3].changeType, 'append', 'load next page');
        assert.deepEqual(this.getDataItems(), [4, 5, 6, 7], 'items');
        assert.ok(dataController.isLoaded(), 'data is loaded');
    });

    QUnit.test('update loading on reload', function(assert) {
        let finalized;

        this.options.loadingTimeout = 0;
        this.setupDataSource({
            pageSize: 3
        });

        const dataController = this.dataController;

        dataController.load().done(function() {
            let isLoadingByEvent;
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

        this.clock.tick(10);
        assert.ok(finalized);
    });

    // T152307
    QUnit.test('update loading on reload when error occurred', function(assert) {
        let finalized;
        let loadResult;

        this.options.loadingTimeout = 0;

        this.dataSource = new DataSource({
            load: function() {
                return loadResult || [];
            }
        });
        this.dataController.setDataSource(this.dataSource);

        const dataController = this.dataController;
        let isLoadingByEvent;
        const changedArgs = [];

        dataController.load().done(function() {
            dataController.loadingChanged.add(function(isLoading) {
                isLoadingByEvent = isLoading;
                if(isLoading) {
                    assert.ok(!dataController.isLoaded(), 'isLoaded on reload in loadingChanged event');
                }
            });

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

            finalized = true;
        });

        this.clock.tick(10);

        // assert
        assert.ok(finalized);
        this.clock.tick(10);

        // assert
        assert.ok(!dataController.isLoaded(), 'isLoaded after error');
        assert.ok(!dataController.isLoading(), 'isLoading after error');
        assert.ok(!isLoadingByEvent, 'isLoading by event after error');

        assert.equal(changedArgs.length, 1);
        assert.equal(changedArgs[0].changeType, 'loadError');
        assert.equal(changedArgs[0].error.message, 'user error');
    });

    // T103219
    QUnit.test('loadingChanged must be before changed', function(assert) {
    // arrange
        const events = [];

        this.setupDataSource({
            asyncLoadEnabled: true,
            pageSize: 3
        });

        const dataController = this.dataController;


        dataController.load();
        this.clock.tick(10);

        dataController.loadingChanged.add(function() {
            events.push('loadingChanged');
        });

        dataController.changed.add(function() {
            events.push('changed');
        });

        // act
        dataController.reload(true);
        this.clock.tick(10);

        // assert
        assert.deepEqual(events, ['loadingChanged', 'loadingChanged', 'changed']);
    });

    // B252337
    QUnit.test('update loading when grouping', function(assert) {
        const array = $.map(TEN_NUMBERS, function(value) { return { value: value }; });

        this.setupDataSource({
            data: array,
            group: 'value',
            pageSize: 5
        });
        this.dataSource.load();

        const dataController = this.dataController;

        let isLoadingByEvent;
        dataController.loadingChanged.add(function(isLoading) {
            isLoadingByEvent = isLoading;
        });

        dataController.viewportSize(5);
        dataController.setViewportItemIndex(0);

        // act
        dataController.setViewportItemIndex(9);

        const items = [];
        $.each(TEN_NUMBERS, function(index, value) {
            items.push({ key: value, items: [{ value: value }] });
            items.push({ value: value });
        });

        // assert
        assert.deepEqual(this.getDataItems(), items);
        assert.equal(dataController.itemsCount(), 5);
        assert.ok(dataController.isLoaded());
        assert.ok(!dataController.isLoading(), 'loading completed');
        assert.ok(!isLoadingByEvent, 'loading completed');
    });

    // B252337
    QUnit.test('update loading when dataSource length less then pageSize', function(assert) {
        this.setupDataSource({
            pageSize: 20
        });
        this.dataSource.load();

        const dataController = this.dataController;


        dataController.viewportSize(15);

        let isLoadingByEvent;
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
        const array = $.map(TEN_NUMBERS, function(value) { return { value: value }; });

        this.setupDataSource({
            data: array,
            group: 'value'
        });

        const dataController = this.dataController;


        dataController.viewportSize(25);
        dataController.setViewportItemIndex(0);

        // act
        dataController.load();

        // assert
        assert.ok(!dataController.isLoading(), 'loading completed');
    });

    // B254146
    QUnit.test('changeRowExpand on second page when virtual scrolling enabled', function(assert) {
        const array = $.map(TEN_NUMBERS, function(value) { return { value: value }; });

        this.setupDataSource({
            data: array,
            group: 'value',
            pageSize: 3
        });

        const dataController = this.dataController;


        dataController.viewportSize(3);

        // act
        dataController.setViewportItemIndex(0);

        dataController.setViewportItemIndex(4);

        dataController.changeRowExpand([4]);

        assert.equal(dataController.pageIndex(), 1, 'pageIndex'); // must be 1
        assert.deepEqual(dataController.items()[0].data, { collapsedItems: [], key: 4, items: null, count: 1 }, 'item 4 collapsed');
    });

    // B254113
    QUnit.test('Start loading after changeRowExpand when virtual scrolling enabled', function(assert) {
        const array = $.map(TEN_NUMBERS, function(value) { return { value: value }; });
        let isLoading = false;

        this.options.loadingTimeout = 0;

        this.setupDataSource({
            data: array,
            group: 'value',
            pageSize: 3
        });

        const dataController = this.dataController;


        dataController.loadingChanged.add(function(state) {
            isLoading = state;
        });

        dataController.load();
        dataController.viewportSize(3);
        this.clock.tick(10);

        // assert
        assert.ok(!isLoading, 'not loading');

        // act
        dataController.setViewportItemIndex(0);

        dataController.changeRowExpand([0]);

        assert.ok(isLoading, 'loading started');
        this.clock.tick(10);
        assert.ok(!isLoading, 'loading ended');
    });

    // T122785
    QUnit.test('not update pageSize on viewportSize', function(assert) {
        const changedArgs = [];

        this.setupDataSource({
            data: TEN_NUMBERS.concat(TEN_NUMBERS)
        });

        const dataController = this.dataController;


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

    // T681470
    QUnit.test('remove invisible items if repaintChangesOnly and expanded grouping are enabled', function(assert) {
        const array = [];
        for(let i = 0; i < 100; i++) {
            array.push({ id: i, name: 'text ' + i });
        }

        this.options.scrolling.removeInvisiblePages = true;

        this.setupDataSource({
            data: array
        });

        this.dataController.viewportSize(10);
        this.dataController.setViewportItemIndex(0.1);

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        this.columnOption('id', 'groupIndex', 0);

        // act
        this.dataController.setViewportItemIndex(40);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items[0].key, [20]);
        assert.deepEqual(changedArgs.changeType, 'append');
        assert.deepEqual(changedArgs.removeCount, 40, 'removeCount is correct');
    });

    // T907168
    QUnit.test('Check dataIndex for grouped items in the next page if group row is in the prev page', function(assert) {
        const array = [];
        const pageSize = 5;
        const groupRowCountInFirstPage = 2;
        const firstGroupItemsCount = pageSize - groupRowCountInFirstPage;
        for(let group = 1; group <= 10; group++) {
            const rowCount = group === 1 ? firstGroupItemsCount : 4;
            for(let row = 1; row <= rowCount; row++) {
                array.push({ id: group * row, group: group, name: `text ${group},${row}` });
            }
        }
        this.applyOptions({
            remoteOperations: {},
            columns: [
                'id', { dataField: 'group', groupIndex: 0 }, 'name'
            ] });
        this.setupDataSource({
            data: array,
            pageSize
        });
        this.dataController.viewportSize(pageSize);
        this.dataController.setViewportItemIndex(0);

        const items = this.dataController.items();
        assert.equal(items[pageSize - 1].rowType, 'group');
        assert.equal(items[pageSize].data.name, 'text 2,1');
        assert.equal(items[pageSize].dataIndex, 0);
    });

    // T907168
    QUnit.test('Check dataIndex for the first and the second row in group', function(assert) {
        const array = [];
        const pageSize = 5;
        const groupRowCountInFirstPage = 2;
        const firstGroupItemsCount = pageSize - groupRowCountInFirstPage - 1;
        for(let group = 1; group <= 10; group++) {
            const rowCount = group === 1 ? firstGroupItemsCount : 4;
            for(let row = 1; row <= rowCount; row++) {
                array.push({ id: group * row, group: group, name: `text ${group},${row}` });
            }
        }
        this.applyOptions({
            remoteOperations: {},
            columns: [
                'id', { dataField: 'group', groupIndex: 0 }, 'name'
            ] });
        this.setupDataSource({
            data: array,
            pageSize
        });
        this.dataController.viewportSize(pageSize);
        this.dataController.setViewportItemIndex(0);

        const items = this.dataController.items();
        assert.equal(items[pageSize - 2].rowType, 'group');
        assert.equal(items[pageSize - 1].data.name, 'text 2,1');
        assert.equal(items[pageSize - 1].dataIndex, 0);
        assert.equal(items[pageSize].data.name, 'text 2,2');
        assert.equal(items[pageSize].dataIndex, 1);
    });

    QUnit.test('New mode. rowRenderingMode should be considered as \'virtual\' when legacyMode is disabled', function(assert) {
        // arrange
        this.applyOptions({
            scrolling: {
                legacyMode: false,
                rowPageSize: 5,
                prerenderedRowCount: 1
            }
        });
        this.dataController.init();

        // assert
        assert.ok(gridCoreUtils.isVirtualRowRendering(this), 'rowRenderingMode is virtual');
    });

    QUnit.test('New mode. Load params are synchronized after scrolling', function(assert) {
        // arrange
        const getData = function(count) {
            const items = [];
            for(let i = 0; i < count; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }
            return items;
        };
        this.applyOptions({
            scrolling: {
                legacyMode: false,
                rowPageSize: 5,
                prerenderedRowCount: 1
            }
        });

        this.dataController.init();
        this.setupDataSource({
            data: getData(200),
            pageSize: 10
        });

        // act
        this.dataController.viewportSize(15);

        // assert
        assert.strictEqual(this.dataController.dataSource().loadPageCount(), 1, 'initial load page count');
        assert.strictEqual(this.dataController.items().length, 10, 'initial visible items count');

        // act
        this.dataController.setViewportPosition(500);
        this.clock.tick(10);
        const visibleItems = this.dataController.items();
        const loadedItems = this.dataController.dataSource().items();

        // assert
        assert.deepEqual(this.dataController.getLoadPageParams(), { pageIndex: 2, loadPageCount: 4, skipForCurrentPage: 5 }, 'load page params after scrolling');
        assert.deepEqual(this.dataController.pageIndex(), 2, 'page index after scrolling');
        assert.strictEqual(this.dataController.dataSource().loadPageCount(), 4, 'load page count after scrolling');
        assert.equal(loadedItems.length, 40, 'loaded items count');
        assert.deepEqual(loadedItems[0], { id: 21, name: 'Name 21' }, 'first loaded item');
        assert.deepEqual(loadedItems[39], { id: 60, name: 'Name 60' }, 'last loaded item');
        assert.equal(visibleItems.length, 16, 'visible items count');
        assert.deepEqual(visibleItems[0].data, { id: 26, name: 'Name 26' }, 'first visible item');
        assert.deepEqual(visibleItems[15].data, { id: 41, name: 'Name 41' }, 'last visible item');
    });

    QUnit.test('New mode. Load params if pageSize is 0 (All) and scrolling mode is standart', function(assert) {
        // arrange
        const getData = function(count) {
            const items = [];
            for(let i = 0; i < count; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }
            return items;
        };
        this.applyOptions({
            scrolling: {
                rowRenderingMode: 'virtual',
                mode: 'standart',
                legacyMode: false,
                rowPageSize: 5,
                prerenderedRowCount: 1
            }
        });

        this.dataController.init();
        this.setupDataSource({
            data: getData(10),
            pageSize: 0
        });

        // act
        this.dataController.viewportSize(15);
        this.dataController.setViewportPosition(100);
        this.clock.tick(10);

        // assert
        assert.deepEqual(this.dataController.getLoadPageParams(), { pageIndex: 0, loadPageCount: 1, skipForCurrentPage: 5 }, 'load page params after scrolling');
        assert.deepEqual(this.dataController.pageIndex(), 0, 'page index after scrolling');
        assert.deepEqual(this.getVisibleRows()[0].data.id, 6, 'first visible row id');
    });

    QUnit.test('New mode. View port items should be rendered partially on scroll', function(assert) {
        // arrange
        const getData = function(count) {
            const items = [];
            for(let i = 0; i < count; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }
            return items;
        };
        const changedSpy = sinon.spy();

        this.applyOptions({
            scrolling: {
                legacyMode: false,
                rowPageSize: 5,
                prerenderedRowCount: 1
            }
        });

        this.dataController.init();
        this.setupDataSource({
            data: getData(100),
            pageSize: 10
        });

        this.dataController.viewportSize(15);
        this.dataController.setViewportPosition(50);
        this.clock.tick(10);
        this.dataController.setViewportPosition(0);
        this.clock.tick(10);
        this.dataController.changed.add(changedSpy);

        let renderedItemIds = this.dataController.items().map(i => i.data.id);

        // assert
        assert.deepEqual(renderedItemIds, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 'initially rendered item IDs');

        // act
        this.dataController.setViewportPosition(100);
        this.clock.tick(10);

        renderedItemIds = this.dataController.items().map(i => i.data.id);
        const change = changedSpy.args[0][0];
        const changedItemIds = change.items.map(i => i.data.id);

        // assert
        assert.equal(changedSpy.callCount, 1, 'changed called');
        assert.ok(change.repaintChangesOnly, 'repaint changes only');
        assert.strictEqual(change.items.length, 11, 'items count');
        assert.deepEqual(changedItemIds, [1, 2, 3, 4, 5, 16, 17, 18, 19, 20, 21], 'change item IDs');
        assert.deepEqual(change.changeTypes, ['remove', 'remove', 'remove', 'remove', 'remove', 'insert', 'insert', 'insert', 'insert', 'insert', 'insert'], 'change types');
        assert.deepEqual(renderedItemIds, [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], 'finally rendered item IDs');
    });

    QUnit.test('New mode. View port items should not be changed on small scroll', function(assert) {
        // arrange
        const getData = function(count) {
            const items = [];
            for(let i = 0; i < count; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }
            return items;
        };
        const changedSpy = sinon.spy();

        this.applyOptions({
            scrolling: {
                legacyMode: false,
                rowPageSize: 5,
                prerenderedRowCount: 1
            }
        });

        this.dataController.init();
        this.setupDataSource({
            data: getData(100),
            pageSize: 10
        });

        this.dataController.viewportSize(15);
        this.dataController.setViewportPosition(50);
        this.clock.tick(10);
        this.dataController.setViewportPosition(0);
        this.dataController.setViewportPosition(1);
        this.clock.tick(10);
        this.dataController.changed.add(changedSpy);

        let renderedItemIds = this.dataController.items().map(i => i.data.id);

        // assert
        assert.deepEqual(renderedItemIds, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 'initially rendered item IDs');

        // act
        this.dataController.setViewportPosition(10);
        this.clock.tick(10);

        renderedItemIds = this.dataController.items().map(i => i.data.id);

        // assert
        assert.equal(changedSpy.callCount, 0, 'changed not called');
        assert.deepEqual(renderedItemIds, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 'finally rendered item IDs');
    });

    QUnit.test('New mode. DataSourceAdapter.viewportSize should not be called when viewPortSize is called', function(assert) {
        // arrange
        this.applyOptions({
            scrolling: {
                legacyMode: false,
                rowPageSize: 5,
                prerenderedRowCount: 1
            }
        });

        this.dataController.init();
        this.setupDataSource({
            data: [{ id: 1, name: 'test' }],
            pageSize: 10
        });

        const viewportSizeSpy = sinon.spy(this.dataController.dataSource(), 'viewportSize');

        try {
            this.dataController.viewportSize();

            assert.notOk(viewportSizeSpy.called, 'not called');
        } finally {
            viewportSizeSpy.restore();
        }
    });

    QUnit.test('New mode. DataSourceAdapter.viewportItemSize should not be called when viewportItemSize is called', function(assert) {
        // arrange
        this.applyOptions({
            scrolling: {
                legacyMode: false,
                rowPageSize: 5,
                prerenderedRowCount: 1
            }
        });

        this.dataController.init();
        this.setupDataSource({
            data: [{ id: 1, name: 'test' }],
            pageSize: 10
        });

        const viewportItemSizeSpy = sinon.spy(this.dataController.dataSource(), 'viewportItemSize');

        try {
            this.dataController.viewportItemSize();

            assert.notOk(viewportItemSizeSpy.called, 'not called');
        } finally {
            viewportItemSizeSpy.restore();
        }
    });

    QUnit.test('New mode. DataSourceAdapter.setContentItemSizes should not be called when setContentItemSizes is called', function(assert) {
        // arrange
        this.applyOptions({
            scrolling: {
                legacyMode: false,
                rowPageSize: 5,
                prerenderedRowCount: 1
            }
        });

        this.dataController.init();
        this.setupDataSource({
            data: [{ id: 1, name: 'test' }],
            pageSize: 10
        });

        const setContentItemSizesSpy = sinon.spy(this.dataController.dataSource(), 'setContentItemSizes');

        try {
            this.dataController.setContentItemSizes([30]);

            assert.notOk(setContentItemSizesSpy.called, 'not called');
        } finally {
            setContentItemSizesSpy.restore();
        }
    });

    QUnit.test('New mode. updateItems should be called on data loading when loadViewport method is called', function(assert) {
        // arrange
        this.applyOptions({
            scrolling: {
                legacyMode: false,
                rowPageSize: 5,
                prerenderedRowCount: 1
            }
        });

        this.dataController.init();
        this.setupDataSource({
            data: [{ id: 1, name: 'test' }],
            pageSize: 10
        });

        const updateItemsSpy = sinon.spy(this.dataController, 'updateItems');

        try {
            // act
            this.dataController._isLoading = true;
            this.dataController.loadViewport();

            // assert
            assert.ok(updateItemsSpy.called, 'called');

            // act
            this.dataController._isLoading = false;
            this.dataController.loadViewport();

            // assert
            assert.ok(updateItemsSpy.called, 'called');
        } finally {
            updateItemsSpy.restore();
        }
    });

    QUnit.test('New mode. updateItems should not be called on data loading when updateViewport method is called', function(assert) {
        // arrange
        this.applyOptions({
            scrolling: {
                legacyMode: false,
                rowPageSize: 5,
                prerenderedRowCount: 1
            }
        });

        this.dataController.init();
        this.setupDataSource({
            data: [
                { id: 1, name: 'test' }
            ],
            pageSize: 10
        });

        const updateItemsSpy = sinon.spy(this.dataController, 'updateItems');

        try {
            // act
            this.dataController._isLoading = true;
            this.dataController.updateViewport();

            // assert
            assert.notOk(updateItemsSpy.called, 'not called');

            // act
            this.dataController._isLoading = false;
            this.dataController.updateViewport();

            // assert
            assert.ok(updateItemsSpy.called, 'called');
        } finally {
            updateItemsSpy.restore();
        }
    });

    QUnit.test('loadViewport should not throw an error when dataSource is null (T1045898)', function(assert) {
        // arrange
        this.applyOptions({
            scrolling: {
                legacyMode: false,
                rowPageSize: 5,
                prerenderedRowCount: 1
            }
        });
        this.dataController.init();
        this.setupDataSource({
            data: [{ id: 1, name: 'test' }],
            pageSize: 10
        });

        try {
            // act
            this.dataController.option('dataSource', null);
            this.dataController.loadViewport();

            assert.ok(true, 'error is not thrown');
        } catch(e) {
            assert.ok(false, `the error is thrown: ${e.message}`);
        }
    });


    QUnit.test('Scrolling timeout should be zero when renderAsync is false', function(assert) {
        // arrange
        this.applyOptions({
            scrolling: {
                legacyMode: false,
                rowPageSize: 5,
                timeout: 100,
                renderingThreshold: 100,
                minTimeout: 50,
                renderAsync: false
            }
        });

        this.dataController.init();
        this.setupDataSource({
            data: [{ id: 1, name: 'test' }],
            pageSize: 10
        });

        const timeout = this.dataController._rowsScrollController.getScrollingTimeout();

        // assert
        assert.equal(timeout, 0);
    });

    QUnit.test('Scrolling timeout should be set to minTimeout if renderAsync is not defined', function(assert) {
        // arrange
        this.applyOptions({
            scrolling: {
                legacyMode: false,
                rowPageSize: 5,
                timeout: 100,
                renderingThreshold: 100,
                minTimeout: 50
            }
        });

        this.dataController.init();
        this.setupDataSource({
            data: [{ id: 1, name: 'test' }],
            pageSize: 10
        });

        const timeout = this.dataController._rowsScrollController.getScrollingTimeout();

        // assert
        assert.equal(timeout, 50);
    });

    QUnit.test('Scrolling timeout should be set to timeout if renderAsync is true', function(assert) {
        // arrange
        this.applyOptions({
            scrolling: {
                legacyMode: false,
                rowPageSize: 5,
                timeout: 100,
                renderingThreshold: 100,
                minTimeout: 50,
                renderAsync: true
            }
        });

        this.dataController.init();
        this.setupDataSource({
            data: [{ id: 1, name: 'test' }],
            pageSize: 10
        });

        const timeout = this.dataController._rowsScrollController.getScrollingTimeout();

        // assert
        assert.equal(timeout, 100);
    });

    QUnit.test('Options are reset when dataSource is changed to null (T1054920)', function(assert) {
        // arrange
        this.applyOptions({
            scrolling: {
                legacyMode: false,
                rowPageSize: 5,
                timeout: 100,
                renderingThreshold: 100,
                minTimeout: 50,
                renderAsync: true
            }
        });

        this.dataController.init();
        this.setupDataSource({
            data: [{ id: 1, name: 'test' }],
            pageSize: 10
        });

        // assert
        assert.equal(this.dataController._itemCount, 1, 'itemCount');
        assert.equal(this.dataController._allItems[0].data.id, 1, 'first item id');

        // act
        this.option('dataSource', null);

        // assert
        assert.equal(this.dataController._itemCount, 0, 'itemCount is reset');
        assert.strictEqual(this.dataController._allItems, null, 'all items are reset');
    });
});

QUnit.module('Virtual scrolling preload', {
    beforeEach: function() {

        const getData = function(count) {
            const items = [];
            for(let i = 0; i < count; i++) {
                items.push({ id: i + 1 });
            }
            return items;
        };

        this.options = {
            dataSource: getData(100),
            scrolling: { mode: 'virtual', legacyMode: false, prerenderedRowCount: 0, rowPageSize: 5 },
            pager: { visible: 'auto' },
            paging: { pageSize: 20 },
            remoteOperations: { filtering: true, sorting: true, paging: true },
            grouping: { autoExpandAll: true }
        };
        setupModule.apply(this);

        this.dataController.viewportSize(15);
        this.dataController.updateViewport();
    },
    afterEach: teardownModule
}, () => {
    QUnit.test('New mode. One page should be loaded on start', function(assert) {
        // arrange
        assert.strictEqual(this.dataController.dataSource().loadPageCount(), 1, 'initial load page count');
        assert.strictEqual(this.getVisibleRows().length, 20, 'initial visible items count');
    });

    QUnit.test('New mode. One viewport should be preloaded on scroll', function(assert) {
        // act
        this.dataController.setViewportPosition(1);
        const visibleRows = this.getVisibleRows();
        const dataSourceAdapter = this.dataController.dataSource();
        const loadedItems = dataSourceAdapter.items();

        // assert
        assert.deepEqual(dataSourceAdapter.pageIndex(), 0, 'page index after scrolling');
        assert.strictEqual(dataSourceAdapter.loadPageCount(), 2, 'load page count after scrolling');
        assert.equal(loadedItems.length, 40, 'loaded items count');
        assert.deepEqual(loadedItems[0].id, 1, 'first loaded item');
        assert.equal(visibleRows.length, 16, 'visible items count');
        assert.deepEqual(visibleRows[0].data.id, 1, 'first visible item');
    });

    QUnit.test('New mode. Two viewports should be preloaded on scroll if preloadEnabled', function(assert) {
        this.options.scrolling.preloadEnabled = true;
        // act
        this.dataController.setViewportPosition(1);
        const visibleRows = this.getVisibleRows();
        const dataSourceAdapter = this.dataController.dataSource();
        const loadedItems = dataSourceAdapter.items();

        // assert
        assert.deepEqual(dataSourceAdapter.pageIndex(), 0, 'page index after scrolling');
        assert.strictEqual(dataSourceAdapter.loadPageCount(), 3, 'load page count after scrolling');
        assert.equal(loadedItems.length, 60, 'loaded items count');
        assert.deepEqual(loadedItems[0].id, 1, 'first loaded item');
        assert.equal(visibleRows.length, 16, 'visible items count');
        assert.deepEqual(visibleRows[0].data.id, 1, 'first visible item');
    });

    QUnit.test('New mode. Data should not be preloaded on scroll if preloadedRowCount is 0', function(assert) {
        this.options.scrolling.preloadedRowCount = 0;
        // act
        this.dataController.setViewportPosition(1);
        const visibleRows = this.getVisibleRows();
        const dataSourceAdapter = this.dataController.dataSource();
        const loadedItems = dataSourceAdapter.items();

        // assert
        assert.deepEqual(dataSourceAdapter.pageIndex(), 0, 'page index after scrolling');
        assert.strictEqual(dataSourceAdapter.loadPageCount(), 1, 'load page count after scrolling');
        assert.equal(loadedItems.length, 20, 'loaded items count');
        assert.deepEqual(loadedItems[0].id, 1, 'first loaded item');
        assert.equal(visibleRows.length, 16, 'visible items count');
        assert.deepEqual(visibleRows[0].data.id, 1, 'first visible item');
    });

    QUnit.test('New mode. Data should be preloaded on scroll if preloadedRowCount is defined', function(assert) {
        this.options.scrolling.preloadedRowCount = 50;
        // act
        this.dataController.setViewportPosition(1);
        const visibleRows = this.getVisibleRows();
        const dataSourceAdapter = this.dataController.dataSource();
        const loadedItems = dataSourceAdapter.items();

        // assert
        assert.deepEqual(dataSourceAdapter.pageIndex(), 0, 'page index after scrolling');
        assert.strictEqual(dataSourceAdapter.loadPageCount(), 4, 'load page count after scrolling');
        assert.equal(loadedItems.length, 80, 'loaded items count');
        assert.deepEqual(loadedItems[0].id, 1, 'first loaded item');
        assert.equal(visibleRows.length, 16, 'visible items count');
        assert.deepEqual(visibleRows[0].data.id, 1, 'first visible item');
    });

    QUnit.test('New mode. One viewport should be preloaded on far scroll', function(assert) {
        // act
        this.dataController.setViewportPosition(1000);
        const visibleRows = this.getVisibleRows();
        const dataSourceAdapter = this.dataController.dataSource();
        const loadedItems = dataSourceAdapter.items();

        // assert
        assert.deepEqual(dataSourceAdapter.pageIndex(), 2, 'page index after scrolling');
        assert.strictEqual(dataSourceAdapter.loadPageCount(), 2, 'load page count after scrolling');
        assert.equal(loadedItems.length, 40, 'loaded items count');
        assert.deepEqual(loadedItems[0].id, 41, 'first loaded item');
        assert.equal(visibleRows.length, 15, 'visible items count');
        assert.deepEqual(visibleRows[0].data.id, 51, 'first visible item');
    });

    QUnit.test('New mode. One viewport should be preloaded before viewport on scroll back', function(assert) {
        // act
        this.dataController.setViewportPosition(1000);
        this.dataController.setViewportPosition(999);
        const visibleRows = this.getVisibleRows();
        const dataSourceAdapter = this.dataController.dataSource();
        const loadedItems = dataSourceAdapter.items();

        // assert
        assert.deepEqual(dataSourceAdapter.pageIndex(), 1, 'page index after scrolling');
        assert.strictEqual(dataSourceAdapter.loadPageCount(), 3, 'load page count after scrolling');
        assert.equal(loadedItems.length, 60, 'loaded items count');
        assert.deepEqual(loadedItems[0].id, 21, 'first loaded item');
        assert.equal(visibleRows.length, 16, 'visible items count');
        assert.deepEqual(visibleRows[0].data.id, 50, 'first visible item');
    });

    QUnit.test('New mode. Data should be preloaded before viewport on scroll back if preloadedRowCount is defined', function(assert) {
        this.options.scrolling.preloadedRowCount = 50;
        // act
        this.dataController.setViewportPosition(1000);
        this.dataController.setViewportPosition(999);
        const visibleRows = this.getVisibleRows();
        const dataSourceAdapter = this.dataController.dataSource();
        const loadedItems = dataSourceAdapter.items();

        // assert
        assert.deepEqual(dataSourceAdapter.pageIndex(), 0, 'page index after scrolling');
        assert.strictEqual(dataSourceAdapter.loadPageCount(), 4, 'load page count after scrolling');
        assert.equal(loadedItems.length, 80, 'loaded items count');
        assert.deepEqual(loadedItems[0].id, 1, 'first loaded item');
        assert.equal(visibleRows.length, 16, 'visible items count');
        assert.deepEqual(visibleRows[0].data.id, 50, 'first visible item');
    });

    QUnit.test('New mode. Rows should not be regenerated on scroll (T1046265)', function(assert) {
        let calculateCellValueCallCount = 0;
        this.applyOptions({
            columns: [{
                name: 'id',
                calculateCellValue: function(data) {
                    calculateCellValueCallCount++;
                    return data.id;
                }
            }]
        });
        this.dataController.setViewportPosition(1);

        assert.strictEqual(calculateCellValueCallCount, 100, 'rows are generated');

        calculateCellValueCallCount = 0;

        // act
        this.dataController.setViewportPosition(2);

        // assert
        assert.strictEqual(calculateCellValueCallCount, 0, 'rows are not regenerated');
    });

    QUnit.test('New mode. selectAll after scrolling should select all items (T1044995)', function(assert) {
        // act
        this.dataController.setViewportPosition(10);
        this.selectAll();

        // assert
        assert.deepEqual(this.getSelectedRowKeys().length, 100, 'all items are selected');
    });

    QUnit.test('New mode. loadAll after scrolling should return all items (T1045649)', function(assert) {
        // act
        this.dataController.setViewportPosition(10);
        let loadedItems;
        this.dataController.loadAll().done(items => {
            loadedItems = items;
        });

        // assert
        assert.deepEqual(loadedItems.length, 100, 'all items are selected');
    });

    QUnit.test('New mode. Load page params should not be changed if the viewport position is not changed after scrolling back (T1052705)', function(assert) {
        // act
        this.option('scrolling.prerenderedRowCount', 5);
        this.dataController.setViewportPosition(1000);
        let loadPageParams = this.dataController.getLoadPageParams();

        // assert
        assert.deepEqual(loadPageParams, { pageIndex: 2, loadPageCount: 3, skipForCurrentPage: 10 }, 'params after scrolling down');

        // act
        this.dataController.setViewportPosition(800);
        loadPageParams = this.dataController.getLoadPageParams();

        // assert
        assert.deepEqual(loadPageParams, { pageIndex: 1, loadPageCount: 2, skipForCurrentPage: 15 }, 'params after scrolling up');

        // act
        this.dataController.setViewportPosition(800);
        loadPageParams = this.dataController.getLoadPageParams();

        // assert
        assert.deepEqual(loadPageParams, { pageIndex: 1, loadPageCount: 2, skipForCurrentPage: 15 }, 'params are not changed');
    });
});

QUnit.module('Infinite scrolling', {
    beforeEach: function() {
        setupModule.apply(this);


        const array = [];

        for(let i = 0; i < 50; i++) {
            array.push({
                id: i,
                value: 'value' + i.toString()
            });
        }

        const dataSource = createDataSource(array, { key: 'id' }, {
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
}, () => {

    QUnit.test('setViewportItemIndex to begin current page not load next page', function(assert) {
    // act
        this.dataController.setViewportItemIndex(1);

        // assert
        assert.strictEqual(this.dataController.pageIndex(), 0);
        assert.strictEqual(this.dataController.hasKnownLastPage(), false);
        assert.strictEqual(this.dataController.items().length, 20);
    });

    QUnit.test('setViewportItemIndex to end current page load next page', function(assert) {
    // act
        this.dataController.setViewportItemIndex(10);

        // assert
        assert.strictEqual(this.dataController.pageIndex(), 1);
        assert.strictEqual(this.dataController.hasKnownLastPage(), false);
        assert.strictEqual(this.dataController.items().length, 40);
    });

    // T193217
    QUnit.test('setViewportItemIndex to end current page several times load next page one time', function(assert) {
        let loadingCount = 0;
        this.dataController._dataSource.customizeStoreLoadOptions.add(function() {
            loadingCount++;
        });
        // act
        this.options.loadingTimeout = 0;
        this.dataController.setViewportItemIndex(10);
        this.dataController.setViewportItemIndex(10);

        this.clock.tick(10);

        // assert
        assert.strictEqual(loadingCount, 1);
        assert.strictEqual(this.dataController.pageIndex(), 1);
        assert.strictEqual(this.dataController.hasKnownLastPage(), false);
        assert.strictEqual(this.dataController.items().length, 40);
    });


    QUnit.test('second setViewportItemIndex to first page not load next page', function(assert) {
        this.dataController.setViewportItemIndex(1);
        // act
        this.dataController.setViewportItemIndex(19);

        // assert
        assert.strictEqual(this.dataController.pageIndex(), 1);
        assert.strictEqual(this.dataController.hasKnownLastPage(), false);
        assert.strictEqual(this.dataController.items().length, 40);
    });

    QUnit.test('setViewportItemIndex to current page not load next page when hasKnownLastPage', function(assert) {
    // act
        this.dataController.setViewportItemIndex(1);
        this.dataController.setViewportItemIndex(21);
        this.dataController.setViewportItemIndex(41);

        // assert
        assert.strictEqual(this.dataController.pageIndex(), 2);
        assert.strictEqual(this.dataController.hasKnownLastPage(), true);
        assert.strictEqual(this.dataController.items().length, 50);
    });

    QUnit.test('reset pageIndex on refresh when appendMode', function(assert) {
        this.dataSource.load();
        this.dataController.pageIndex(1);

        // act
        this.dataController.refresh();

        assert.strictEqual(this.dataController.pageIndex(), 0);
    });

    // T180315
    QUnit.test('setViewportItemIndex before data loaded', function(assert) {
        this.applyOptions({
            loadingTimeout: 0
        });

        this.dataController.reload(true);

        // act
        this.dataController.setViewportItemIndex(1);
        this.clock.tick(10);

        // assert
        assert.strictEqual(this.dataController.pageIndex(), 0);
        assert.strictEqual(this.dataController.hasKnownLastPage(), false);
        assert.strictEqual(this.dataController.items().length, 20);
    });

    // T103389
    QUnit.test('load several pages when pageSize less then viewportSize', function(assert) {
        const changedArgs = [];

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
    QUnit.test('load several pages when pageSize less then viewportSize and preload enabled', function(assert) {
        const changedArgs = [];

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

    // T722298
    QUnit.test('selectAll should works correctly if item count less than pageSize', function(assert) {
        this.options.scrolling.preloadEnabled = true;

        this.dataController.pageSize(100);
        this.dataController.refresh();

        // act
        this.selectAll();

        // assert
        assert.equal(this.getVisibleRows().length, 50, 'visible row count');
        assert.strictEqual(this.totalCount(), 50, 'total count');
        assert.ok(this.selectionController.isSelectAll(), 'select all state');
    });

    // T377458
    QUnit.test('last page does not be loaded several times then totalCount % pageSize === 0', function(assert) {
        const changedArgs = [];

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
    QUnit.test('last page does not be loaded several times then totalCount equals pageSize', function(assert) {
        const changedArgs = [];

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
});

QUnit.module('Infinite scrolling (ScrollingDataSource)', {
    beforeEach: function() {

        this.options = {
            scrolling: { mode: 'infinite' },
            grouping: { autoExpandAll: true },
            paging: {}
        };
        setupModule.apply(this);

        this.setupDataSource = function(options) {
            this.dataSource = createDataSource(options.data || TEN_NUMBERS, {}, $.extend({ paginate: true, requireTotalCount: false }, options));
            this.dataController.setDataSource(this.dataSource);
            this.dataSource.load();
        };

        this.getDataItems = function(items) {
            const dataItems = [];

            items = items || this.dataController.items();

            $.each(items, function() {
                dataItems.push(this.data);
            });
            return dataItems;
        };
    },
    afterEach: teardownModule
}, () => {

    QUnit.test('not update pageSize on viewportSize', function(assert) {
        let changedCallsCount = 0;

        this.setupDataSource({
            data: TEN_NUMBERS.concat(TEN_NUMBERS)
        });

        const dataController = this.dataController;

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

    QUnit.test('change pageIndex', function(assert) {
        let changedCallsCount = 0;
        let changedArgs;

        this.setupDataSource({
            pageSize: 3
        });

        const dataController = this.dataController;

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
    QUnit.test('Load next page and return to previous', function(assert) {
    // arrange
        this.setupDataSource({
            asyncLoadEnabled: true,
            pageSize: 3
        });

        this.clock.tick(10);

        const dataController = this.dataController;

        // act
        dataController.pageIndex(1);
        dataController.load();

        dataController.pageIndex(0);
        dataController.load();

        this.clock.tick(10);

        // assert
        assert.equal(dataController.pageIndex(), 0, 'page index');
        assert.deepEqual(this.getDataItems(), [1, 2, 3, 4, 5, 6], 'items');
    });

    // B252339
    QUnit.test('reset pageIndex on reload', function(assert) {
        let changedCallsCount = 0;
        let changedArgs;

        this.setupDataSource({
            pageSize: 3
        });

        const dataController = this.dataController;


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

    QUnit.test('New mode. rowRenderingMode should be considered as \'virtual\' when legacyMode is disabled', function(assert) {
        // arrange
        this.applyOptions({
            scrolling: {
                legacyMode: false,
                rowPageSize: 5,
                prerenderedRowCount: 1
            }
        });
        this.dataController.init();

        // assert
        assert.ok(gridCoreUtils.isVirtualRowRendering(this), 'rowRenderingMode is virtual');
    });

    QUnit.test('New mode. Load params are synchronized after scrolling', function(assert) {
        // arrange
        const getData = function(count) {
            const items = [];
            for(let i = 0; i < count; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }
            return items;
        };
        this.applyOptions({
            scrolling: {
                legacyMode: false,
                rowPageSize: 5,
                prerenderedRowCount: 1
            }
        });

        this.dataController.init();
        this.setupDataSource({
            data: getData(200),
            pageSize: 10
        });

        // act
        this.dataController.viewportSize(15);

        // assert
        assert.strictEqual(this.dataController.dataSource().loadPageCount(), 1, 'initial load page count');
        assert.strictEqual(this.dataController.items().length, 10, 'initial visible items count');

        // act
        this.dataController.setViewportPosition(500);
        this.clock.tick(10);
        const visibleItems = this.dataController.items();
        const loadedItems = this.dataController.dataSource().items();

        // assert
        assert.deepEqual(this.dataController.getLoadPageParams(), { pageIndex: 2, loadPageCount: 4, skipForCurrentPage: 5 }, 'load page params after scrolling');
        assert.deepEqual(this.dataController.pageIndex(), 2, 'page index after scrolling');
        assert.strictEqual(this.dataController.dataSource().loadPageCount(), 4, 'load page count after scrolling');
        assert.equal(loadedItems.length, 40, 'loaded items count');
        assert.deepEqual(loadedItems[0], { id: 21, name: 'Name 21' }, 'first loaded item');
        assert.deepEqual(loadedItems[39], { id: 60, name: 'Name 60' }, 'last loaded item');
        assert.equal(visibleItems.length, 16, 'visible items count');
        assert.deepEqual(visibleItems[0].data, { id: 26, name: 'Name 26' }, 'first visible item');
        assert.deepEqual(visibleItems[15].data, { id: 41, name: 'Name 41' }, 'last visible item');
    });

    QUnit.test('New mode. View port items should be rendered partially on scroll', function(assert) {
        // arrange
        const getData = function(count) {
            const items = [];
            for(let i = 0; i < count; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }
            return items;
        };
        const changedSpy = sinon.spy();

        this.applyOptions({
            scrolling: {
                legacyMode: false,
                rowPageSize: 5,
                prerenderedRowCount: 1
            }
        });

        this.dataController.init();
        this.setupDataSource({
            data: getData(100),
            pageSize: 10
        });

        this.dataController.viewportSize(15);
        this.dataController.setViewportPosition(50);
        this.clock.tick(10);
        this.dataController.setViewportPosition(0);
        this.clock.tick(10);
        this.dataController.changed.add(changedSpy);

        let renderedItemIds = this.dataController.items().map(i => i.data.id);

        // assert
        assert.deepEqual(renderedItemIds, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 'initially rendered item IDs');

        // act
        this.dataController.setViewportPosition(100);
        this.clock.tick(10);

        renderedItemIds = this.dataController.items().map(i => i.data.id);
        const change = changedSpy.args[0][0];
        const changedItemIds = change.items.map(i => i.data.id);

        // assert
        assert.equal(changedSpy.callCount, 1, 'changed called');
        assert.ok(change.repaintChangesOnly, 'repaint changes only');
        assert.strictEqual(change.items.length, 11, 'items count');
        assert.deepEqual(changedItemIds, [1, 2, 3, 4, 5, 16, 17, 18, 19, 20, 21], 'change item IDs');
        assert.deepEqual(change.changeTypes, ['remove', 'remove', 'remove', 'remove', 'remove', 'insert', 'insert', 'insert', 'insert', 'insert', 'insert'], 'change types');
        assert.deepEqual(renderedItemIds, [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], 'finally rendered item IDs');
    });

    QUnit.test('New mode. View port items should not be changed on small scroll', function(assert) {
        // arrange
        const getData = function(count) {
            const items = [];
            for(let i = 0; i < count; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }
            return items;
        };
        const changedSpy = sinon.spy();

        this.applyOptions({
            scrolling: {
                legacyMode: false,
                rowPageSize: 5,
                prerenderedRowCount: 1
            }
        });

        this.dataController.init();
        this.setupDataSource({
            data: getData(100),
            pageSize: 10
        });

        this.dataController.viewportSize(15);
        this.dataController.setViewportPosition(50);
        this.clock.tick(10);
        this.dataController.setViewportPosition(0);
        this.dataController.setViewportPosition(1);
        this.clock.tick(10);
        this.dataController.changed.add(changedSpy);

        let renderedItemIds = this.dataController.items().map(i => i.data.id);

        // assert
        assert.deepEqual(renderedItemIds, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 'initially rendered item IDs');

        // act
        this.dataController.setViewportPosition(10);
        this.clock.tick(10);

        renderedItemIds = this.dataController.items().map(i => i.data.id);

        // assert
        assert.equal(changedSpy.callCount, 0, 'changed is not called');
        assert.deepEqual(renderedItemIds, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 'finally rendered item IDs');
    });
});

QUnit.module('Filtering', {
    beforeEach: function() {
        setupModule.apply(this);

        this.applyOptions({
            searchPanel: {
                text: ''
            }
        });

        this.setupFilterableData = function() {
            this.dataSource = createDataSource([
                { name: 'Alex', age: 15, birthDate: new Date(1999, 2, 5), state: 0, processed: false, category: 0, categoryName: 'First Category' },
                { name: 'Boris', age: 21, birthDate: new Date(1993, 5, 2), state: 0, processed: false, category: 1, categoryName: 'Second Category' },
                { name: 'Dan', age: 19, birthDate: new Date(1996, 1, 20), state: 1, processed: true, category: 2, categoryName: 'Third Category' }
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
                        dataField: 'category', calculateDisplayValue: 'categoryName', lookup: {
                            dataSource: [
                                { id: 0, name: 'First Category' },
                                { id: 1, name: 'Second Category' },
                                { id: 2, name: 'Third Category' }
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
}, () => {

    QUnit.test('dataSource filter', function(assert) {
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
    QUnit.test('dataSource filter option on date field defined as string', function(assert) {
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
        this.dataController.optionChanged({ name: 'dataSource' });

        // assert
        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.name, 'Dan');
        // T320550
        assert.deepEqual(this.filter(), ['birthDate', new Date(1985, 2, 21)]);
    });

    // B233497
    QUnit.test('dataSource filter operation on date field defined as string', function(assert) {
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
    QUnit.test('dataSource filter option on date field defined as string and CustomStore is used with remoteOperations false', function(assert) {
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
        this.dataController.optionChanged({ name: 'dataSource' });

        // assert
        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.name, 'Dan');
    });

    QUnit.test('grouping on date field defined as string', function(assert) {
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
        this.dataController.optionChanged({ name: 'dataSource' });

        // assert
        assert.equal(this.dataController.items().length, 2);
        assert.deepEqual(this.dataController.items()[0].data.key, new Date('1985/3/21'));
        assert.deepEqual(this.dataController.items()[1].data.key, new Date('1987/5/5'));
    });

    QUnit.test('grouping on date field defined as string assigned in customizeColumns', function(assert) {
        this.applyOptions({
            customizeColumns: function(columns) {
                columns[1].groupIndex = 0;
                columns[1].dataType = 'date';

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
        this.dataController.optionChanged({ name: 'dataSource' });

        // assert
        assert.equal(this.dataController.items().length, 2);
        assert.deepEqual(this.dataController.items()[0].data.key, new Date('1985/3/21'));
        assert.deepEqual(this.dataController.items()[1].data.key, new Date('1987/5/5'));
    });

    QUnit.test('change filter as array argument', function(assert) {
    // arrange
        let countCallPageChanged = 0;

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
        assert.equal(countCallPageChanged, 1, 'count call pageChanged');
    });

    // T413302
    QUnit.test('filter as null - no apply when there is no dataSource filter', function(assert) {
    // arrange
        let countCallPageChanged = 0;

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
        assert.equal(this.dataController.items().length, 2, 'count item');
        assert.equal(countCallPageChanged, 0, 'not call pageChanged');
    });

    // T413302
    QUnit.test('filter as arguments - no apply when the filter isn\'t changed', function(assert) {
    // arrange
        let countCallPageChanged = 0;

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
        assert.equal(this.dataController.items().length, 1, 'count item');
        assert.equal(this.dataController.items()[0].data.name, 'Dan');
        assert.equal(countCallPageChanged, 0, 'not call pageChanged');
    });

    QUnit.test('change filter as arguments', function(assert) {
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

    QUnit.test('change filter as function', function(assert) {
        let loadingCount = 0;
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

    QUnit.test('get filter and combinedFilter', function(assert) {
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
                [['name', 'contains', 'A'], 'and', ['age', '=', 15]],
                'and',
                ['name', 'contains', 'Al']
            ],
            'and',
            ['name', '=', 'Alex']
        ]);
    });


    QUnit.test('get combinedFilter with remote filtering', function(assert) {
        this.dataSource = new DataSource({
            load: function() {
                return [{ name: 'Alex', age: '20' }];
            }
        });

        this.applyOptions({
            remoteOperations: { filtering: true },
            columns: [{ dataField: 'age', dataType: 'number', filterValue: 15 }],
        });

        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        assert.deepEqual(this.getCombinedFilter(true), ['age', '=', 15]);
    });

    const generateColumns = (length) => {
        const result = [];
        for(let i = 0; i < length; i++) {
            result.push({
                dataField: 'field' + (i + 1),
                dataType: 'string',
                width: 100
            });
        }
        return result;
    };

    QUnit.test('DataGrid should filter properly by filterRow value in virtual mode (T832948)', function(assert) {
    // arrange
        this.dataSource = new DataSource({
            store: []
        });

        this.applyOptions({
            width: 200,
            columns: generateColumns(10),
            scrolling: {
                columnPageSize: 5,
                columnRenderingMode: 'virtual'
            }
        });

        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        // act
        this.columnOption('field10', 'filterValue', 'test');

        // assert
        assert.equal(this.getVisibleColumns().length, 6, 'column rendering mode is applied');
        assert.deepEqual(this.getCombinedFilter(true), ['field10', 'contains', 'test'], 'combined filter');
    });

    QUnit.test('DataGrid should filter properly by headerFilter value in virtual mode (T832948)', function(assert) {
    // arrange
        this.dataSource = new DataSource({
            store: []
        });

        this.applyOptions({
            width: 200,
            columns: generateColumns(10),
            scrolling: {
                columnPageSize: 5,
                columnRenderingMode: 'virtual'
            }
        });

        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        // act
        this.columnOption('field10', 'filterValues', ['test']);

        // assert
        assert.equal(this.getVisibleColumns().length, 6, 'column rendering mode is applied');
        assert.deepEqual(this.getCombinedFilter(true), ['field10', '=', 'test'], 'combined filter');
    });

    QUnit.test('get combinedFilter for search when allowSearch false', function(assert) {
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
            ['age', 'contains', 'Al'],
            'and',
            ['name', '=', 'Alex']
        ]);
    });

    QUnit.test('get combinedFilter for search when searchVisibleColumnsOnly true and column is not visible', function(assert) {
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
            [['name', 'contains', 'Al'], 'or', ['age', 'contains', 'Al']],
            'and',
            ['name', '=', 'Alex']
        ]);

        // act
        this.columnOption('name', 'visible', false);

        // assert
        assert.deepEqual(this.getCombinedFilter(), [
            ['age', 'contains', 'Al'],
            'and',
            ['name', '=', 'Alex']
        ]);
    });

    QUnit.test('get combinedFilter for search when allowFiltering false', function(assert) {
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
            ['age', 'contains', 'Al'],
            'and',
            ['name', '=', 'Alex']
        ]);
    });

    QUnit.test('get combinedFilter for search when allowFiltering false and allowSearch true', function(assert) {
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
                ['name', 'contains', 'Al'],
                'or',
                ['age', 'contains', 'Al']
            ],
            'and',
            ['name', '=', 'Alex']
        ]);
    });

    // T373345
    QUnit.test('get combinedFilter when filterRow between operation and headerFilter is used', function(assert) {
        this.dataSource = new DataSource({
            load: function() {
                return [];
            }
        });

        this.applyOptions({
            remoteOperations: true,
            columns: [{ dataField: 'age', dataType: 'number', filterValue: [15, 20], selectedFilterOperation: 'between', filterValues: [17] }]
        });

        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();


        // act
        assert.deepEqual(this.getCombinedFilter(), [
            [['age', '>=', 15], 'and', ['age', '<=', 20]],
            'and',
            ['age', '=', 17]
        ]);
    });

    // T203533
    QUnit.test('get combinedFilter with filter on only one column', function(assert) {
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
            ['age', '=', 15],
            'and',
            ['name', '=', 'Alex']
        ]);
    });

    QUnit.test('get combinedFilter with argument', function(assert) {
    // arrange
        let filter;

        this.dataSource = new DataSource({
            load: function() {
                return [];
            },
            filter: ['age', '=', 15]
        });

        this.applyOptions({
            remoteOperations: false,
            columns: [{ dataField: 'name', dataType: 'string', filterValue: 'Alex' }, { dataField: 'age', dataType: 'number' }]
        });

        // act
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        // assert
        filter = this.getCombinedFilter();
        assert.ok($.isArray(filter[0]), 'first argument is filter expression');
        assert.strictEqual(filter[1], 'and', 'second argument is operation \'and\'');
        assert.ok($.isArray(filter[2]), 'third argument is filter expression');
        assert.ok($.isFunction(filter[0][0]), 'filter expression selector is function');

        filter = this.getCombinedFilter(true);
        assert.ok($.isArray(filter[0]), 'first argument is filter expression');
        assert.strictEqual(filter[1], 'and', 'second argument is operation \'and\'');
        assert.ok($.isArray(filter[2]), 'third argument is filter expression');
        assert.equal(filter.length, 3, 'filter expression + \'and\' + \'filter expression\'');
        assert.ok(!$.isFunction(filter[2][0]), 'filter expression selector isn\'t function');
        assert.strictEqual(filter[0][0], 'name', 'value of the selector');
    });

    QUnit.test('get combinedFilter with argument for date value with ISO8601 parsing', function(assert) {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;

        try {
        // arrange
            this.dataSource = new DataSource({
                load: function() {
                    return [{ date: '2016-03-02T10:59:00' }];
                },
                filter: ['date', '<', new Date(2017, 0, 1)]
            });

            this.applyOptions({
                remoteOperations: false,
                columns: [{ dataField: 'date', dataType: 'date', selectedFilterOperation: '>=', filterValue: new Date(2016, 0, 1) }]
            });

            // act
            this.dataController.setDataSource(this.dataSource);
            this.dataSource.load();

            // assert
            const filter = this.getCombinedFilter(true);
            assert.deepEqual(filter, [['date', '>=', '2016-01-01T00:00:00'], 'and', ['date', '<', '2017-01-01T00:00:00']], 'filter with serialized dates');
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    QUnit.test('get combinedFilter with argument for date value without ISO8601 parsing', function(assert) {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = false;

        try {
        // arrange
            this.dataSource = new DataSource({
                load: function() {
                    return [{ date: '2016-03-02T10:59:00' }];
                },
                filter: ['date', '<', new Date(2017, 0, 1)]
            });

            this.applyOptions({
                remoteOperations: false,
                columns: [{ dataField: 'date', dataType: 'date', selectedFilterOperation: '>=', filterValue: new Date(2016, 0, 1) }]
            });

            // act
            this.dataController.setDataSource(this.dataSource);
            this.dataSource.load();

            // assert
            const filter = this.getCombinedFilter(true);
            assert.deepEqual(filter, [['date', '>=', new Date(2016, 0, 1)], 'and', ['date', '<', new Date(2017, 0, 1)]], 'filter with serialized dates');
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    // T353244
    QUnit.test('changing filterType without filterValues do not rise changed event', function(assert) {
    // arrange
        const that = this;
        let countCallChanged = 0;

        that.options.loadingTimeout = 0;
        that.dataSource = createDataSource([
            { name: 'Alex', age: 15 },
            { name: 'Dan', age: 19 },
            { name: 'Tom', age: 12 },
            { name: 'Bob', age: 19 },
            { name: 'Bobbi', age: 19 }
        ]);

        that.applyOptions({
            columns: [{ dataField: 'name' }, { dataField: 'age', filterValue: 19 }]
        });
        that.dataController.setDataSource(that.dataSource);
        that.dataSource.load();
        that.clock.tick(10);

        // arrange
        that.dataController.changed.add(function() {
            countCallChanged++;
        });

        // act
        that.columnOption('name', 'filterType', 'exclude');
        that.clock.tick(10);

        // assert
        assert.strictEqual(that.columnsController.getColumns()[0].filterType, 'exclude', 'filterType is changed');
        assert.strictEqual(countCallChanged, 0, 'changed is not raised');
    });

    // T238430
    QUnit.test('clearFilter without argument', function(assert) {
    // arrange
        const that = this;
        let columns;
        let countCallChanged = 0;

        that.options.loadingTimeout = 0;
        that.dataSource = createDataSource([
            { name: 'Alex', age: 15 },
            { name: 'Dan', age: 19 },
            { name: 'Tom', age: 12 },
            { name: 'Bob', age: 19 },
            { name: 'Bobbi', age: 19 }
        ], {}, { filter: [['name', 'Alex'], 'or', ['name', 'Dan'], 'or', ['name', 'Tom'], 'or', ['name', 'Bob']] });

        that.applyOptions({
            columns: [{ dataField: 'name', filterValues: ['Alex', 'Dan', 'Bob'] }, { dataField: 'age', filterValue: 19 }]
        });
        that.dataController.setDataSource(that.dataSource);
        that.dataSource.load();
        that.dataController.searchByText('Bob');
        that.clock.tick(10);

        // assert
        const items = that.dataController.items();
        columns = that.columnsController.getColumns();
        assert.equal(items.length, 1, 'count items');
        assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, 'data item');
        assert.strictEqual(that.option('searchPanel.text'), 'Bob', 'search text');
        assert.ok(Array.isArray(that.dataController.filter()), 'filter dataSource');
        assert.equal(columns.length, 2, 'count columns');
        assert.deepEqual(columns[0].filterValues, ['Alex', 'Dan', 'Bob'], 'filter values of the first column');
        assert.deepEqual(columns[1].filterValue, 19, 'filter value of the second column');

        // arrange
        that.dataController.changed.add(function() {
            countCallChanged++;
        });

        // act
        that.dataController.clearFilter();
        that.clock.tick(10);

        // assert
        columns = that.columnsController.getColumns();
        assert.equal(countCallChanged, 1, 'count call changed');
        assert.equal(that.dataController.items().length, 5, 'count items');
        assert.strictEqual(that.option('searchPanel.text'), '', 'search text');
        assert.deepEqual(that.dataController.filter(), null, 'filter dataSource');
        assert.equal(columns.length, 2, 'count columns');
        assert.deepEqual(columns[0].filterValues, undefined, 'filter values of the first column');
        assert.deepEqual(columns[1].filterValue, undefined, 'filter value of the second column');
    });

    // T238430
    QUnit.test('clearFilter for dataSource', function(assert) {
    // arrange
        const that = this;
        let items;
        let columns;

        that.dataSource = createDataSource([
            { name: 'Alex', age: 15 },
            { name: 'Dan', age: 19 },
            { name: 'Tom', age: 12 },
            { name: 'Bob', age: 19 },
            { name: 'Bobbi', age: 19 }
        ], {}, { filter: [['name', 'Alex'], 'or', ['name', 'Dan'], 'or', ['name', 'Tom'], 'or', ['name', 'Bob']] });

        that.applyOptions({
            columns: [{ dataField: 'name', filterValues: ['Alex', 'Dan', 'Bob', 'Bobbi'] }, { dataField: 'age', filterValue: 19 }]
        });
        that.dataController.setDataSource(that.dataSource);
        that.dataSource.load();
        that.dataController.searchByText('Bob');

        // assert
        items = that.dataController.items();
        columns = that.columnsController.getColumns();
        assert.equal(items.length, 1, 'count items');
        assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, 'data item');
        assert.strictEqual(that.option('searchPanel.text'), 'Bob', 'search text');
        assert.ok(Array.isArray(that.dataController.filter()), 'filter dataSource');
        assert.equal(columns.length, 2, 'count columns');
        assert.deepEqual(columns[0].filterValues, ['Alex', 'Dan', 'Bob', 'Bobbi'], 'filter values of the first column');
        assert.deepEqual(columns[1].filterValue, 19, 'filter value of the second column');

        // act
        that.dataController.clearFilter('dataSource');

        // assert
        items = that.dataController.items();
        columns = that.columnsController.getColumns();
        assert.equal(items.length, 2, 'count items');
        assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, 'data of the first item');
        assert.deepEqual(items[1].data, { name: 'Bobbi', age: 19 }, 'data of the second item');
        assert.strictEqual(that.option('searchPanel.text'), 'Bob', 'search text');
        assert.deepEqual(that.dataController.filter(), null, 'filter dataSource');
        assert.equal(columns.length, 2, 'count columns');
        assert.deepEqual(columns[0].filterValues, ['Alex', 'Dan', 'Bob', 'Bobbi'], 'filter values of the first column');
        assert.deepEqual(columns[1].filterValue, 19, 'filter value of the second column');
    });

    // T238430
    QUnit.test('clearFilter for search', function(assert) {
    // arrange
        const that = this;
        let items;
        let columns;

        that.dataSource = createDataSource([
            { name: 'Alex', age: 15 },
            { name: 'Dan', age: 19 },
            { name: 'Tom', age: 12 },
            { name: 'Bob', age: 19 },
            { name: 'Bobbi', age: 19 }
        ], {}, { filter: [['name', 'Alex'], 'or', ['name', 'Dan'], 'or', ['name', 'Tom'], 'or', ['name', 'Bob']] });

        that.applyOptions({
            columns: [{ dataField: 'name', filterValues: ['Alex', 'Dan', 'Bob'] }, { dataField: 'age', filterValue: 19 }]
        });
        that.dataController.setDataSource(that.dataSource);
        that.dataSource.load();
        that.dataController.searchByText('Bob');

        // assert
        items = that.dataController.items();
        columns = that.columnsController.getColumns();
        assert.equal(items.length, 1, 'count items');
        assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, 'data item');
        assert.strictEqual(that.option('searchPanel.text'), 'Bob', 'search text');
        assert.ok(Array.isArray(that.dataController.filter()), 'filter dataSource');
        assert.equal(columns.length, 2, 'count columns');
        assert.deepEqual(columns[0].filterValues, ['Alex', 'Dan', 'Bob'], 'filter values of the first column');
        assert.deepEqual(columns[1].filterValue, 19, 'filter value of the second column');

        // act
        that.dataController.clearFilter('search');

        // assert
        items = that.dataController.items();
        columns = that.columnsController.getColumns();
        assert.equal(items.length, 2, 'count items');
        assert.deepEqual(items[0].data, { name: 'Dan', age: 19 }, 'data of the first item');
        assert.deepEqual(items[1].data, { name: 'Bob', age: 19 }, 'data of the second item');
        assert.strictEqual(that.option('searchPanel.text'), '', 'search text');
        assert.ok(Array.isArray(that.dataController.filter()), 'filter dataSource');
        assert.equal(columns.length, 2, 'count columns');
        assert.deepEqual(columns[0].filterValues, ['Alex', 'Dan', 'Bob'], 'filter values of the first column');
        assert.deepEqual(columns[1].filterValue, 19, 'filter value of the second column');
    });

    // T238430
    QUnit.test('clearFilter for filter row', function(assert) {
    // arrange
        const that = this;
        let items;
        let columns;

        that.dataSource = createDataSource([
            { name: 'Alex', age: 15 },
            { name: 'Dan', age: 19 },
            { name: 'Tom', age: 12 },
            { name: 'Bob', age: 19 },
            { name: 'Bobbi', age: 19 }
        ], {}, { filter: [['name', 'Alex'], 'or', ['name', 'Dan'], 'or', ['name', 'Tom'], 'or', ['name', 'Bob']] });

        that.applyOptions({
            columns: [{ dataField: 'name', filterValues: ['Alex', 'Dan', 'Bob'] }, { dataField: 'age', filterValue: 19 }]
        });
        that.dataController.setDataSource(that.dataSource);
        that.dataSource.load();
        that.dataController.searchByText('Bob');

        // assert
        items = that.dataController.items();
        columns = that.columnsController.getColumns();
        assert.equal(items.length, 1, 'count items');
        assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, 'data item');
        assert.strictEqual(that.option('searchPanel.text'), 'Bob', 'search text');
        assert.ok(Array.isArray(that.dataController.filter()), 'filter dataSource');
        assert.equal(columns.length, 2, 'count columns');
        assert.deepEqual(columns[0].filterValues, ['Alex', 'Dan', 'Bob'], 'filter values of the first column');
        assert.deepEqual(columns[1].filterValue, 19, 'filter value of the second column');

        // act
        that.dataController.clearFilter('row');

        // assert
        items = that.dataController.items();
        columns = that.columnsController.getColumns();
        assert.equal(items.length, 1, 'count items');
        assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, 'data of the second item');
        assert.strictEqual(that.option('searchPanel.text'), 'Bob', 'search text');
        assert.ok(Array.isArray(that.dataController.filter()), 'filter dataSource');
        assert.equal(columns.length, 2, 'count columns');
        assert.deepEqual(columns[0].filterValues, ['Alex', 'Dan', 'Bob'], 'filter values of the first column');
        assert.deepEqual(columns[1].filterValue, undefined, 'filter value of the second column');
    });

    // T238430
    QUnit.test('clearFilter for header filter', function(assert) {
    // arrange
        const that = this;
        let items;
        let columns;

        that.dataSource = createDataSource([
            { name: 'Alex', age: 15 },
            { name: 'Dan', age: 19 },
            { name: 'Tom', age: 12 },
            { name: 'Bob', age: 19 },
            { name: 'Bobbi', age: 19 }
        ], {}, { filter: [['name', 'Alex'], 'or', ['name', 'Dan'], 'or', ['name', 'Tom'], 'or', ['name', 'Bob']] });

        that.applyOptions({
            columns: [{ dataField: 'name', filterValues: ['Alex', 'Dan', 'Bob'] }, { dataField: 'age', filterValue: 19 }]
        });
        that.dataController.setDataSource(that.dataSource);
        that.dataSource.load();
        that.dataController.searchByText('Bob');

        // assert
        items = that.dataController.items();
        columns = that.columnsController.getColumns();
        assert.equal(items.length, 1, 'count items');
        assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, 'data item');
        assert.strictEqual(that.option('searchPanel.text'), 'Bob', 'search text');
        assert.ok(Array.isArray(that.dataController.filter()), 'filter dataSource');
        assert.equal(columns.length, 2, 'count columns');
        assert.deepEqual(columns[0].filterValues, ['Alex', 'Dan', 'Bob'], 'filter values of the first column');
        assert.deepEqual(columns[1].filterValue, 19, 'filter value of the second column');

        // act
        that.dataController.clearFilter('header');

        // assert
        items = that.dataController.items();
        columns = that.columnsController.getColumns();
        assert.equal(items.length, 1, 'count items');
        assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, 'data of the second item');
        assert.strictEqual(that.option('searchPanel.text'), 'Bob', 'search text');
        assert.ok(Array.isArray(that.dataController.filter()), 'filter dataSource');
        assert.equal(columns.length, 2, 'count columns');
        assert.deepEqual(columns[0].filterValues, undefined, 'filter values of the first column');
        assert.deepEqual(columns[1].filterValue, 19, 'filter value of the second column');
    });

    // T238430
    QUnit.test('clearFilter didn\'t apply by incorrect filter name', function(assert) {
    // arrange
        const that = this;
        let items;
        let columns;

        that.dataSource = createDataSource([
            { name: 'Alex', age: 15 },
            { name: 'Dan', age: 19 },
            { name: 'Tom', age: 12 },
            { name: 'Bob', age: 19 },
            { name: 'Bobbi', age: 19 }
        ], {}, { filter: [['name', 'Alex'], 'or', ['name', 'Dan'], 'or', ['name', 'Tom'], 'or', ['name', 'Bob']] });

        that.applyOptions({
            columns: [{ dataField: 'name', filterValues: ['Alex', 'Dan', 'Bob'] }, { dataField: 'age', filterValue: 19 }]
        });
        that.dataController.setDataSource(that.dataSource);
        that.dataSource.load();
        that.dataController.searchByText('Bob');

        // assert
        items = that.dataController.items();
        columns = that.columnsController.getColumns();
        assert.equal(items.length, 1, 'count items');
        assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, 'data item');
        assert.strictEqual(that.option('searchPanel.text'), 'Bob', 'search text');
        assert.ok(Array.isArray(that.dataController.filter()), 'filter dataSource');
        assert.equal(columns.length, 2, 'count columns');
        assert.deepEqual(columns[0].filterValues, ['Alex', 'Dan', 'Bob'], 'filter values of the first column');
        assert.deepEqual(columns[1].filterValue, 19, 'filter value of the second column');

        // act
        that.dataController.clearFilter('test');

        // assert
        items = that.dataController.items();
        columns = that.columnsController.getColumns();
        assert.equal(items.length, 1, 'count items');
        assert.deepEqual(items[0].data, { name: 'Bob', age: 19 }, 'data of the second item');
        assert.strictEqual(that.option('searchPanel.text'), 'Bob', 'search text');
        assert.ok(Array.isArray(that.dataController.filter()), 'filter dataSource');
        assert.equal(columns.length, 2, 'count columns');
        assert.deepEqual(columns[0].filterValues, ['Alex', 'Dan', 'Bob'], 'filter values of the first column');
        assert.deepEqual(columns[1].filterValue, 19, 'filter value of the second column');
    });

    // B233043
    QUnit.test('filter operation reset pageIndex', function(assert) {
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

    QUnit.test('search for number column', function(assert) {
        this.setupFilterableData();

        // act
        this.dataController.searchByText('9');

        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.name, 'Dan');
    });

    QUnit.test('search for string column', function(assert) {
        this.setupFilterableData();

        // act
        this.dataController.searchByText('Al');

        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.name, 'Alex');
    });

    QUnit.test('search for date column', function(assert) {
        this.setupFilterableData();

        // act
        this.dataController.searchByText(formatHelper.format(new Date(1996, 1, 20), 'shortDate'));

        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.name, 'Dan');
    });

    QUnit.test('search and dataSource filter', function(assert) {
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
    QUnit.test('search for lookup column', function(assert) {
        this.setupFilterableData();

        // act
        this.dataController.searchByText('Reje');

        // assert
        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.name, 'Dan');
    });

    QUnit.test('search for lookup column with calculateDisplayValue', function(assert) {
        this.setupFilterableData();

        // act
        this.dataController.searchByText('Secon');

        // assert
        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.name, 'Boris');
    });

    // B239940
    QUnit.test('Apply search for string column when change dataSource', function(assert) {
    // arrange
        const that = this;
        let logId;
        let isDataSourceReloaded = false;

        that.setupFilterableData();

        // act
        that.dataController.searchByText('Test');

        that.dataSource = createDataSource([
            { name: 'Test', age: 15, birthDate: new Date(1999, 2, 5) },
            { name: 'Boris', age: 21, birthDate: new Date(1993, 5, 2) },
            { name: 'Dan', age: 19, birthDate: new Date(1996, 1, 20) }
        ]);

        that.dataSource.on('changed', function() {
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

    QUnit.test('Apply search for string and number column when change dataSource', function(assert) {
    // arrange
        const that = this;

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

        sinon.spy(errors, 'log');

        that.dataSource.load();
        // assert
        assert.equal(errors.log.lastCall.args[0], 'W1005', 'Warning about double loading is raised');
        assert.equal(that.dataController.items().length, 2);
        assert.equal(that.dataController.items()[0].data.numberField, 20, '20 equals searchText "20"');
        assert.equal(that.dataController.items()[1].data.stringField, 'Test200', '200 contains searchText "20"');

        errors.log.restore();
    });

    QUnit.test('Apply search when one empty column is without dataType', function(assert) {
    // arrange
        const that = this;

        // act
        this.applyOptions({
            searchPanel: { text: '20' },
            columns: [
                { dataField: 'stringField', dataType: 'string' },
                { caption: 'Empty' },
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

        sinon.spy(errors, 'log');

        that.dataSource.load();
        // assert
        assert.strictEqual(errors.log.callCount, 0, 'Warning about double loading is not raised');
        assert.equal(that.dataController.items().length, 2);
        assert.equal(that.dataController.items()[0].data.numberField, 20, '20 equals searchText "20"');
        assert.equal(that.dataController.items()[1].data.stringField, 'Test200', '200 contains searchText "20"');

        errors.log.restore();
    });

    QUnit.test('Apply search for string column without reloading when all dataTypes defined', function(assert) {
    // arrange
        const that = this;
        let logId;
        let loadCount = 0;

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
    QUnit.test('Apply search for lookup column', function(assert) {
    // arrange
        const that = this;
        const loadingArgs = [];

        this.applyOptions({
            searchPanel: { text: 'Second' },
            remoteOperations: true,
            dataSource: new ArrayStore({
                onLoading: function(e) {
                    loadingArgs.push(e);
                },
                data: [{ name: 'Alex', categoryId: 1 }, { name: 'Dan', categoryId: 2 }]
            }),
            columns: [{ dataField: 'categoryId', dataType: 'number', lookup: {
                dataSource: [
                    { id: 1, name: 'first' },
                    { id: 2, name: 'second' }
                ],
                valueExpr: 'id',
                displayExpr: 'name'
            } }]
        });

        this.dataController.optionChanged({ name: 'dataSource' });

        // assert
        assert.equal(loadingArgs.length, 1);
        assert.deepEqual(loadingArgs[0].filter, ['categoryId', '=', 2]);
        assert.equal(that.dataController.items().length, 1);
        assert.equal(that.dataController.items()[0].data.categoryId, 2);
    });

    QUnit.test('column filter for one column', function(assert) {
        this.setupFilterableData();


        // act
        this.columnsController.columnOption(0, 'filterValue', 'Al');

        // assert
        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.name, 'Alex');
    });

    QUnit.test('Filtering with additional filter when dataController\'s filter expression is function (assertT149995)', function(assert) {
        const dataSource = createDataSource([
            { name: 'Alex', age: 15, birthDate: new Date(1999, 2, 5), state: 0, processed: false },
            { name: 'Alla', age: 21, birthDate: new Date(1993, 5, 2), state: 0, processed: false },
            { name: 'Dan', age: 19, birthDate: new Date(1996, 1, 20), state: 1, processed: true }
        ]);
        this.dataController.setDataSource(dataSource);
        dataSource.load();
        this.columnsController.columnOption('name', 'filterValue', 'Al');

        // act
        const columnFilterItemsCount = this.dataController.items().length;

        this.dataController.filter(function(item) {
            return item.age < 20;
        });

        // assert
        assert.equal(columnFilterItemsCount, 2, 'When change filterValue in filterRow we have 2 items in data controller');
        assert.equal(this.dataController.items().length, 1, 'When we set data controller\'s filter we have 1 item in data controller which satisfies both filter expressions');
        assert.equal(this.dataController.items()[0].data.name, 'Alex');
    });

    QUnit.test('column filter for one column for custom defaultFilterOperation', function(assert) {
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

    QUnit.test('column filter not apply for invisible column', function(assert) {
        this.setupFilterableData();

        // act
        this.columnsController.columnOption(0, 'visible', false);
        this.columnsController.columnOption(0, 'filterValue', 'Al');

        // assert
        assert.equal(this.dataController.items().length, 3);
    });

    QUnit.test('column filter for two columns', function(assert) {
        this.setupFilterableData();

        // act
        this.columnsController.columnOption(0, 'filterValue', 'A');
        this.columnsController.columnOption(1, 'filterValue', '19');

        // assert
        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.name, 'Dan');
    });

    QUnit.test('column filter for column with lookup', function(assert) {
        this.setupFilterableData();

        // act
        this.columnsController.columnOption(4, 'filterValue', 1);

        // assert
        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.name, 'Dan');
    });

    QUnit.test('column filter for column with lookup and calculateDisplayValue', function(assert) {
        this.setupFilterableData();

        // act
        this.columnsController.columnOption(6, 'filterValue', 1);

        // assert
        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.name, 'Boris');
    });

    // T104792
    QUnit.test('column filter for boolean column true value', function(assert) {
        this.setupFilterableData();


        // act
        this.columnsController.columnOption(5, 'filterValue', true);

        // assert
        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.name, 'Dan');
    });

    // T104792
    QUnit.test('column filter for boolean column false value', function(assert) {
        this.setupFilterableData();


        // act
        this.columnsController.columnOption(5, 'filterValue', false);

        // assert
        assert.equal(this.dataController.items().length, 2);
        assert.equal(this.dataController.items()[0].data.name, 'Alex');
        assert.equal(this.dataController.items()[1].data.name, 'Boris');
    });

    QUnit.test('column filter for column with calculateFilterExpression', function(assert) {
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

    // T694441
    QUnit.test('calculateFilterExpression should be called once after filterValue change', function(assert) {
        this.setupFilterableData();

        let calculateFilterExpressionCallCount = 0;
        this.columnsController.columnOption(3, 'calculateFilterExpression', function(text, operation) {
            calculateFilterExpressionCallCount++;
            return [['name', operation || 'contains', text], 'or', ['age', operation || 'contains', text]];
        });

        // act
        this.columnsController.columnOption(3, 'filterValue', '9');

        // assert
        assert.equal(calculateFilterExpressionCallCount, 1);
        assert.equal(this.dataController.items().length, 1);
    });

    QUnit.test('column filter for column with calculateFilterExpression using function selector when cache enabled', function(assert) {
        this.setupFilterableData();

        let loadingCount = 0;
        this.dataSource.store().on('loading', function() {
            loadingCount++;
        });

        // act
        this.columnsController.columnOption(3, 'calculateFilterExpression', function(text, operation) {
            return [function(data) { return data.name + ' ' + data.age; }, operation || 'contains', text];
        });
        this.columnsController.columnOption(3, 'filterValue', '9');

        // assert
        assert.equal(loadingCount, 0, 'no loading because cache enabled');
        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.age, 19);

        // act
        this.columnsController.columnOption(3, 'filterValue', 'Ale');

        // assert
        assert.equal(loadingCount, 0, 'no loading because cache enabled');
        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.name, 'Alex');
    });

    QUnit.test('column filter for column with calculateFilterExpression using function selector as filter function', function(assert) {
        this.setupFilterableData();

        let loadingCount = 0;
        this.dataSource.store().on('loading', function() {
            loadingCount++;
        });

        // act
        this.columnsController.columnOption(3, 'calculateFilterExpression', function(text, operation) {
            return [function(data) {
                return !!(data.name + ' ' + data.age).match(text);
            }, '=', true];
        });
        this.columnsController.columnOption(3, 'filterValue', '9');

        // assert
        assert.equal(loadingCount, 0, 'no loading because cache enabled');
        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.age, 19);

        // act
        this.columnsController.columnOption(3, 'filterValue', 'Ale');

        // assert
        assert.equal(loadingCount, 0, 'no loading because cache enabled');
        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.name, 'Alex');
    });

    QUnit.test('column filter for column with calculateFilterExpression returns filter function when cache enabled', function(assert) {
        this.setupFilterableData();

        let loadingCount = 0;
        this.dataSource.store().on('loading', function() {
            loadingCount++;
        });

        // act
        this.dataController.filter(['age', '>', 10]);
        this.columnsController.columnOption(3, 'calculateFilterExpression', function(text, operation) {
            return function(data) { return (data.name + ' ' + data.age).indexOf(text) >= 0; };
        });
        this.columnsController.columnOption(3, 'filterValue', '9');

        // assert
        assert.equal(loadingCount, 0, 'no loading because cache enabled');
        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.age, 19);

        // act
        this.columnsController.columnOption(3, 'filterValue', 'Ale');

        // assert
        assert.equal(loadingCount, 0, 'no loading because cache enabled');
        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.name, 'Alex');
    });

    QUnit.test('no loading when cache enabled and remote filtering is not changed', function(assert) {
        this.setupFilterableData();

        this.applyOptions({
            remoteOperations: { filtering: true }
        });

        this.dataController._isSharedDataSource = true;
        this.dataController.setDataSource(this.dataSource);

        let loadingCount = 0;
        this.dataSource.store().on('loading', function() {
            loadingCount++;
        });

        // act
        this.columnsController.columnOption(3, 'calculateFilterExpression', function(text, operation) {
            return [function(data) { return data.name + ' ' + data.age; }, operation || 'contains', text];
        });
        this.columnsController.columnOption(3, 'filterValue', '9');

        // assert
        assert.equal(loadingCount, 1, 'one loading after change filterValue');
        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.age, 19);

        // act
        this.dataSource.load();

        // assert
        assert.equal(loadingCount, 1, 'no loading because filter is not changed');
        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.age, 19);
    });

    QUnit.test('column filter when selectedFilterOperation and filterValue parameters defined', function(assert) {
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
    QUnit.test('column filter when selectedFilterOperation, filterValue and headerFilter.groupInterval parameters defined', function(assert) {
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


    QUnit.test('column filter when selectedFilterOperation and filterValue parameters undefined', function(assert) {
    // arrange
        this.setupFilterableData();

        this.applyOptions({
            columns: [{ dataField: 'name' }, 'age']
        });

        this.columnsController.columnOption(0, {
            selectedFilterOperation: 'contains',
            filterValue: 'Al'
        });

        // assert
        assert.strictEqual(this.columnsController.getVisibleColumns()[0].filterValue, 'Al', 'has filter text');
        assert.equal(this.dataController.items().length, 1, 'count items');
        assert.strictEqual(this.dataController.items()[0].data.name, 'Alex', 'data name items[0]');

        // act
        this.columnsController.columnOption(0, {
            selectedFilterOperation: null,
            filterValue: null
        });

        // assert
        assert.ok(!this.columnsController.getVisibleColumns()[0].filterValue, 'not has filter text');
        assert.ok(!this.columnsController.getVisibleColumns()[0].selectedFilterOperation, 'not has selectedFilterOperation');
        assert.equal(this.dataController.items().length, 3, 'count items');
    });

    QUnit.test('column filter when selectedFilterOperation defined and filterValue undefined', function(assert) {
    // arrange
        this.setupFilterableData();
        let dataSourceChanged = false;

        this.applyOptions({
            columns: [{ dataField: 'name', selectedFilterOperation: 'contains', filterValue: 'Al' }, 'age']
        });

        this.dataController._dataSource.changed.add(function() {
            dataSourceChanged = true;
        });

        // act
        this.columnsController.columnOption(0, {
            filterValue: null
        });

        // assert
        assert.ok(dataSourceChanged, 'dataSource changed');
    });

    QUnit.test('column filter when selectedFilterOperation parameter null and column filterValue defined', function(assert) {
    // arrange
        let dataSourceChanged = false;
        this.setupFilterableData();

        this.applyOptions({
            columns: [{ dataField: 'name', selectedFilterOperation: 'contains', filterValue: 'Al' }, 'age']
        });

        this.dataController._dataSource.changed.add(function() {
            dataSourceChanged = true;
        });

        // act
        this.columnsController.columnOption(0, {
            selectedFilterOperation: null
        });

        // assert
        assert.ok(dataSourceChanged, 'dataSource changed');
    });

    QUnit.test('column filter when selectedFilterOperation parameter defined and column filterValue is not defined', function(assert) {
    // arrange
        this.setupFilterableData();
        let dataSourceChanged = false;

        this.applyOptions({
            columns: [{ dataField: 'name', selectedFilterOperation: 'contains' }, 'age']
        });

        this.dataController._dataSource.changed.add(function() {
            dataSourceChanged = true;
        });

        // act
        this.columnsController.columnOption(0, {
            selectedFilterOperation: '='
        });

        // assert
        assert.ok(!dataSourceChanged, 'dataSource changed');
    });

    QUnit.test('column filter when selectedFilterOperation parameter defined and no filterValue', function(assert) {
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
    QUnit.test('Apply column filter when change dataSource', function(assert) {
    // arrange
        const that = this;
        let isDataSourceReloaded = false;

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

        that.dataSource.on('changed', function() {
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
    QUnit.test('Apply column filter on QUnit.start when data need converting', function(assert) {
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

        this.clock.tick(10);

        // assert
        assert.equal(this.dataController.items().length, 1);
        assert.equal(this.dataController.items()[0].data.name, 'Test');
        assert.deepEqual(this.dataController.items()[0].data.birthDate, '1999/03/05');
    });

    // B239940
    QUnit.test('Data source is not reloaded on set dataSource when no filters', function(assert) {
    // arrange
        const that = this;
        let changedCallCount = 0;

        that.setupFilterableData();

        that.dataSource = createDataSource([
            { name: 'Test', age: 15, birthDate: new Date(1999, 2, 5) },
            { name: 'Boris', age: 21, birthDate: new Date(1993, 5, 2) },
            { name: 'Dan', age: 19, birthDate: new Date(1996, 1, 20) }
        ]);

        that.dataSource.on('changed', function() {
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

    QUnit.test('Apply filter method is not used when apply filter is \'OnClick\' for filterRow', function(assert) {
        let isApplyFilterCalled;

        this.applyOptions({
            filterRow: {
                applyFilter: 'onClick'
            }
        });

        this.dataController._applyFilter = function() {
            isApplyFilterCalled = true;
        };

        this.dataController._handleColumnsChanged({
            changeTypes: {
                columns: 'test'
            },
            optionNames: {
                bufferedFilterValue: 'test'
            }
        });

        assert.ok(!isApplyFilterCalled);
    });

    QUnit.test('Filter is reset when column has filterValue and it visibility is changed', function(assert) {
        this.setupFilterableData();

        this.columnsController.columnOption('name', 'filterValue', 'wrong');
        this.columnsController.columnOption('name', 'visible', false);

        assert.equal(this.dataController.items().length, 3, 'filter is reset');
    });

    QUnit.test('Filter is reset when column has filterValue and filterValues and it visibility is changed', function(assert) {
        this.setupFilterableData();

        this.columnsController.columnOption('name', {
            filterValue: 'wrong1',
            filterValues: ['wrong2']
        });
        this.columnsController.columnOption('name', 'visible', false);

        assert.equal(this.dataController.items().length, 3, 'filter is reset');
    });

    QUnit.test('Filter is reset when column has filterValues and it visibility is changed', function(assert) {
        this.setupFilterableData();

        this.columnsController.columnOption('name', 'filterValues', ['wrong']);
        this.columnsController.columnOption('name', 'visible', false);

        assert.equal(this.dataController.items().length, 3, 'filter is reset');
    });

    QUnit.test('Filter is applied when column with filterValue is shown', function(assert) {
        this.setupFilterableData();

        this.columnsController.columnOption('name', {
            filterValue: 'wrong',
            visible: false
        });
        this.columnsController.columnOption('name', 'visible', true);

        assert.equal(this.dataController.items().length, 0, 'filter is applied');
    });

    // T487072
    QUnit.test('Not apply groupInterval of the headerFilter for filterRow', function(assert) {
    // arrange
        this.dataSource = createDataSource([
            { name: 'Alex', birthDate: new Date(1992, 7, 6, 12, 30, 21) }
        ]);
        this.applyOptions({
            columns: ['name', {
                dataField: 'birthDate',
                dataType: 'date',
                headerFilter: {
                    groupInterval: 'second'
                },
                filterValue: new Date(1992, 7, 6, 12, 30, 21)
            }]
        });
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        // act, assert
        assert.deepEqual(this.getCombinedFilter(true), [['birthDate', '>=', new Date(1992, 7, 6)], 'and', ['birthDate', '<', new Date(1992, 7, 7)]], 'filter expression');
    });

    // T835675
    QUnit.test('clearFilter should not fall with error if dataSource is not set', function(assert) {
    // arrange
        this.dataSource = undefined;

        // assert
        assert.notOk(this.dataController.getDataSource(), 'no dataSource');

        // act
        this.dataController.clearFilter();
    });
});

QUnit.module('Grouping', { beforeEach: setupModule, afterEach: teardownModule }, () => {

    // T161732
    QUnit.test('rows when multilevel grouping without key', function(assert) {
    // arrange
        const items = [{
            items: [{
                key: 2,
                items: [
                    { field1: undefined, field2: 2, field3: 3 }, { field1: undefined, field2: 2, field3: 5 },
                ]
            }]
        }];

        const dataSource = new MockGridDataSource({
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
        const rows = this.dataController.items();

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

    QUnit.test('rows with simple grouping', function(assert) {
        const items = [
            {
                key: 1, items: [
                    { field1: 1, field2: 4 },
                    { field1: 1, field2: 5 }
                ]
            },
            { key: 2, items: [{ field1: 2, field2: 3 }] }
        ];

        const dataSource = new MockGridDataSource({
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
        const rows = this.dataController.items();

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

    QUnit.test('rows with simple grouping on column with dataType', function(assert) {
        const items = [
            { field1: '1.0', field2: 4 },
            { field1: '1.0', field2: 5 },
            { field1: '2.5', field2: 3 }
        ];

        const loadArgs = [];

        const dataSource = new DataSource({
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

        const rows = this.dataController.items();

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
        assert.deepEqual(loadArgs[1].filter, ['field1', '=', 2.5]);
        assert.deepEqual(loadArgs[1].skip, 0);
        assert.deepEqual(loadArgs[1].take, 1);
        assert.deepEqual(loadArgs[2].filter, ['field1', '<>', 2.5]);
        assert.deepEqual(loadArgs[2].skip, 0);
        assert.deepEqual(loadArgs[2].take, 21);
    });


    QUnit.test('load options should not contain function selectors when remote grouping enabled', function(assert) {
        const items = [
            { key: '1', count: 2, items: null },
            { key: '2', count: 1, items: null }
        ];

        const loadArgs = [];

        const dataSource = new DataSource({
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

        this.dataController.changeRowExpand(['1']);

        // assert
        assert.equal(loadArgs.length, 2);
        assert.deepEqual(loadArgs[0].group, [{ selector: 'field1', desc: false, isExpanded: false }]);
        assert.deepEqual(loadArgs[0].filter, undefined);
        assert.deepEqual(loadArgs[0].skip, undefined);
        assert.deepEqual(loadArgs[0].take, undefined);

        assert.deepEqual(loadArgs[1].group, null);
        assert.deepEqual(loadArgs[1].filter, ['field1', '=', '1']);
        assert.deepEqual(loadArgs[1].skip, undefined);
        assert.deepEqual(loadArgs[1].take, undefined);
    });

    QUnit.test('rows collapsed group with undefined key', function(assert) {
        const items = [
            {
                key: undefined, items: null
            },
            { key: 2, items: [{ field1: 2, field2: 3 }] }
        ];

        const dataSource = new MockGridDataSource({
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
        const rows = this.dataController.items();

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

    QUnit.test('rows with multilevel grouping', function(assert) {
        const items = [{
            key: 1, items: [
                {
                    key: 2, items: [
                        { field1: 1, field2: 2, field3: 4 }, { field1: 1, field2: 2, field3: 5 }
                    ]
                }
            ]
        }];

        const dataSource = new MockGridDataSource({
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
        const rows = this.dataController.items();

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

    QUnit.test('collapsed group', function(assert) {
        const items = [
            {
                key: 1, items: null
            },
            { key: 2, items: [{ field1: 2, field2: 3 }] }
        ];

        const dataSource = new MockGridDataSource({
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
        const rows = this.dataController.items();

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

    QUnit.test('continue group', function(assert) {
        const items = [
            {
                key: 1, isContinuation: true, items: [
                    { field1: 1, field2: 4 },
                    { field1: 1, field2: 5 }
                ]
            },
            { key: 2, items: [{ field1: 2, field2: 3 }] }
        ];

        const dataSource = new MockGridDataSource({
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
        const rows = this.dataController.items();

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

    QUnit.test('continue group when virtual scrolling', function(assert) {
        const items = [
            {
                key: 1, isContinuation: true, items: [
                    { field1: 1, field2: 4 },
                    { field1: 1, field2: 5 }
                ]
            },
            { key: 2, items: [{ field1: 2, field2: 3 }] }
        ];

        const dataSource = new MockGridDataSource({
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
        const rows = this.dataController.items();

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

    QUnit.test('continue group when infinite scrolling', function(assert) {
        const items = [
            {
                key: 1, isContinuation: true, items: [
                    { field1: 1, field2: 4 },
                    { field1: 1, field2: 5 }
                ]
            },
            { key: 2, items: [{ field1: 2, field2: 3 }] }
        ];

        const dataSource = new MockGridDataSource({
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
        const rows = this.dataController.items();

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

    QUnit.test('continue multilevel group', function(assert) {
        const items = [{
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

        const dataSource = new MockGridDataSource({
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
        const rows = this.dataController.items();

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

    QUnit.test('continue multilevel group when virtual scrolling', function(assert) {
        const items = [{
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

        const dataSource = new MockGridDataSource({
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
        const rows = this.dataController.items();

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

    QUnit.test('changeRowExpand', function(assert) {
        let countCallPageChanged = 0;
        const dataSourceOptions = {
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
        assert.equal(countCallPageChanged, 0, 'pageChanged is not called');
    });

    QUnit.test('collapseAll', function(assert) {
        const dataSourceOptions = {
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

    QUnit.test('expandAll', function(assert) {
        const dataSourceOptions = {
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
    QUnit.test('No exceptions on moving the column from group panel to headers (AngularJS)', function(assert) {
    // arrange
        const that = this;
        const dataSource = createDataSource([]);

        that.dataController.setDataSource(dataSource);
        dataSource.load();

        that.applyOptions({ columns: ['field1', 'field2', { dataField: 'field3', groupIndex: 0 }, { dataField: 'field4', groupIndex: 1 }, 'field5'] });
        that._notifyOptionChanged = function() {
            that.columnsController._endUpdateCore();
        };

        try {
        // act
            that.columnsController.moveColumn(0, 2, 'group', 'headers');

            // assert
            assert.strictEqual(that.columnsController.getGroupColumns().length, 1, 'group column count');
        } catch(e) {
        // assert
            assert.ok(false, 'the error is thrown');
        }
    });

    // T700356
    QUnit.test('Group row should have correct values if calculateDisplayValue is defined', function(assert) {
        this.applyOptions({
            columns: [{
                dataField: 'ID',
                caption: 'Company',
                calculateDisplayValue: 'CompanyName',
                groupIndex: 0
            }, 'City']
        });

        const dataSource = createDataSource([{
            ID: 1,
            CompanyName: '123Super Mart of the West',
            City: 'Bentonville'
        }]);

        this.dataController.setDataSource(dataSource);

        // act
        dataSource.load();

        // assert
        assert.deepEqual(this.dataController.items()[0].rowType, 'group', 'item 1 rowType');
        assert.deepEqual(this.dataController.items()[0].key, ['123Super Mart of the West'], 'item 1 key');
        assert.deepEqual(this.dataController.items()[0].values, ['123Super Mart of the West'], 'item 1 values');
    });
});

QUnit.module('Editing', { beforeEach: function() {
    setupModule.apply(this, arguments);
    this._views.rowsView = { ...rowsViewMock };
}, afterEach: teardownModule }, () => {

    QUnit.test('Inserting Row', function(assert) {
        const array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Dan', phone: '98-75-21' }
        ];

        const dataSource = createDataSource(array, { key: 'name' });

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
    QUnit.test('Inserting several rows for cell editing mode', function(assert) {
        const array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Dan', phone: '98-75-21' }
        ];

        $.extend(this.options.editing, {
            mode: 'cell',
            allowAdding: true
        });

        const dataSource = createDataSource(array, { key: 'name' });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        // act
        this.addRow();
        this.addRow();

        // assert
        const items = this.dataController.items();

        assert.equal(items.length, 4, 'two rows are added');

        assert.deepEqual(items[0].data, {}, 'row 0 data');
        assert.ok(items[0].isNewRow, 'row 0 is inserted');
        assert.deepEqual(items[1].data, array[0], 'row 1 data');
        assert.deepEqual(items[2].data, array[1], 'row 2 data');
        assert.notOk(items[3].isNewRow, 'row 3 is saved');
    });

    QUnit.test('Inserting several rows for row editing mode', function(assert) {
        const array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Dan', phone: '98-75-21' }
        ];

        $.extend(this.options.editing, {
            mode: 'row',
            allowAdding: true
        });

        const dataSource = createDataSource(array, { key: 'name' });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        // act
        this.addRow();
        this.addRow();

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, 3, 'only one row is added');

        assert.deepEqual(items[0].data, {}, 'row 1 data');
        assert.deepEqual(items[1].data, array[0], 'row 1 data');
        assert.deepEqual(items[2].data, array[1], 'row 2 data');
    });

    // T327787, T333894
    QUnit.test('Inserting Row for grouped data', function(assert) {
        const array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Dan', phone: '98-75-21' }
        ];

        const dataSource = createDataSource(array, { key: 'name' }, { group: 'name' });

        this.dataController.setDataSource(dataSource);
        dataSource.load();
        this.expandAll();

        // act
        this.editingController.addRow();

        // assert
        assert.equal(this.dataController.items().length, 5);

        assert.deepEqual(this.dataController.items()[0].values, [null, undefined], 'item 0 values');
        assert.deepEqual(this.dataController.items()[0].data, {}, 'item 0 data');
        assert.deepEqual(this.dataController.items()[0].rowType, 'data', 'item 0 rowType');

        assert.deepEqual(this.dataController.items()[1].values, ['Alex'], 'item 1 values');
        assert.deepEqual(this.dataController.items()[1].data, { key: 'Alex', items: [{ name: 'Alex', phone: '55-55-55' }] }, 'item 1 data');
        assert.deepEqual(this.dataController.items()[1].rowType, 'group', 'item 1 rowType');

        assert.deepEqual(this.dataController.items()[2].values, [null, '55-55-55'], 'item 2 values');
        assert.deepEqual(this.dataController.items()[2].data, { name: 'Alex', phone: '55-55-55' }, 'item 2 data');
        assert.deepEqual(this.dataController.items()[2].rowType, 'data', 'item 2 rowType');
    });

    QUnit.test('Double inserting Row', function(assert) {
        const array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Dan', phone: '98-75-21' }
        ];

        const dataSource = createDataSource(array, { key: 'name' });

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

    QUnit.test('Cancel Inserting Row', function(assert) {
        const array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Dan', phone: '98-75-21' }
        ];

        const dataSource = createDataSource(array, { key: 'name' });

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

    QUnit.test('Don\'t cancel Inserting Row after change page', function(assert) {
        const array = [
            { name: 'Alex', phone: '55-55-55' },
            { name: 'Dan', phone: '98-75-21' },
            { name: 'Martin', phone: '12-34-56' }
        ];

        const dataSource = createDataSource(array, { key: 'name' }, { pageSize: 2 });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        this.editingController.addRow();
        // act
        this.dataController.pageIndex(1);

        // assert
        assert.ok(this.editingController.isEditing());
        assert.equal(this.option('editing.changes').length, 1, 'editing changes are not reset');
        assert.ok(this.option('editing.editRowKey'), 'editRowKey is not reset');
        assert.equal(this.dataController.items().length, 1);

        assert.deepEqual(this.dataController.items()[0].data, array[2]);
    });

    QUnit.test('Edit row after detail row', function(assert) {
        const array = [
            { id: 1 },
            { id: 2 },
            { id: 3 },
        ];

        const dataSource = createDataSource(array, { key: 'id' });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        this.expandRow(1);
        // act
        this.editRow(2);

        // assert
        assert.ok(this.editingController.isEditing());
        assert.equal(this.dataController.items().length, 4);
        assert.strictEqual(this.dataController.items()[1].rowType, 'detail', 'row 1 is detail');
        assert.strictEqual(this.dataController.items()[2].rowType, 'data', 'row 2 is data');
        assert.strictEqual(this.dataController.items()[2].isEditing, true, 'isEditing is correct for row 2');
    });

    // T677250
    QUnit.test('Expand detail row before edit form and detail rows', function(assert) {
        const array = [
            { id: 1 },
            { id: 2 },
            { id: 3 },
        ];

        $.extend(this.options.editing, {
            mode: 'form'
        });

        const dataSource = createDataSource(array, { key: 'id' });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        this.expandRow(2);
        this.editRow(1);

        // act
        this.expandRow(1);

        // assert
        assert.ok(this.editingController.isEditing());
        assert.equal(this.dataController.items().length, 5);
        assert.strictEqual(this.dataController.items()[0].rowType, 'data', 'row 0 is data');

        assert.strictEqual(this.dataController.items()[1].rowType, 'detail', 'row 1 is detail');
        assert.notOk(this.dataController.items()[1].isEditing, 'row 1 is not editing');

        assert.strictEqual(this.dataController.items()[2].rowType, 'detail', 'row 2 is detail (edit form)');
        assert.ok(this.dataController.items()[2].isEditing, 'isEditing is correct for row 2');

        assert.strictEqual(this.dataController.items()[3].rowType, 'detail', 'row 3 is data');
        assert.notOk(this.dataController.items()[3].isEditing, 'row 3 is not editing');

        assert.strictEqual(this.dataController.items()[4].rowType, 'data', 'row 4 is detail');
    });

    QUnit.test('delete row with confirmDelete and confirmDeleteMessage is empty', function(assert) {
    // arrange
        let removeHandlerCallCount = 0;
        const dataSource = new DataSource({
            key: 'id',
            load: () => [{ id: 1 }],
            totalCount: () => 1,
            remove: () => ++removeHandlerCallCount
        });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        this.applyOptions({
            editing: {
                confirmDelete: true,
                texts: {
                    confirmDeleteMessage: ''
                }
            }
        });

        // act
        this.editingController.deleteRow(0);

        // assert
        assert.equal(removeHandlerCallCount, 1, 'row is deleted');

        // arrange
        this.options.editing.confirmDelete = false;

        // act
        this.editingController.deleteRow(0);

        // assert
        assert.equal(removeHandlerCallCount, 2, 'row is deleted');
    });

    QUnit.test('update error', function(assert) {
        const errors = dataErrors;
        sinon.spy(errors, 'log');
        const dataSource = new DataSource({
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
        });

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        this.applyOptions({
            columns: ['field1', { setCellValue: function(data, value) { data.field1 = value; }, allowEditing: true }]
        });

        // act
        this.editingController.getFirstEditableCellInRow = function() { return $([]); };

        this.clock.tick(10);

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
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'edit row index');
        assert.equal(errors.log.callCount, 1, 'error fired');
        assert.equal(errors.log.lastCall.args[0], 'E4000', 'error code');
        errors.log.restore();
    });
});

QUnit.module('Error handling', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {

    QUnit.test('load error', function(assert) {
        const dataErrors = [];
        const callbackDataErrors = [];

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
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataErrors, ['Load error']);
        assert.deepEqual(callbackDataErrors, ['Load error']);
    });

    QUnit.test('load error that occurs in array query', function(assert) {
        const dataErrors = [];
        const callbackDataErrors = [];

        const selectorWithNullRef = function() {
            const value = null;
            return value.field;
        };

        this.options = {
            loadingTimeout: 0,
            dataSource: {
                filter: [selectorWithNullRef, '=', 1],
                store: [{ field: 1 }]
            },
            onDataErrorOccurred: function(e) {
                dataErrors.push(e.error.message);
            }
        };

        setupDataGridModules(this, ['data', 'columns']);


        this.dataController.dataErrorOccurred.add(function(error) {
            callbackDataErrors.push(error.message);
        });

        // act
        this.clock.tick(10);

        // assert
        assert.equal(dataErrors.length, 1);
        assert.equal(callbackDataErrors.length, 1);
    });

    QUnit.test('return false on dataErrorOccurred', function(assert) {
        const callbackDataErrors = [];
        const dataErrors = [];

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

        this.clock.tick(10);

        // assert
        assert.deepEqual(dataErrors, ['Load error']);
        assert.deepEqual(callbackDataErrors, []);
    });


    QUnit.test('insert error', function(assert) {
        const dataErrors = [];

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

        this.clock.tick(10);

        // act
        this.editingController.addRow();
        this.editingController.saveEditData();
        // assert
        assert.deepEqual(dataErrors, ['field1 and field2 required']);
    });

    QUnit.test('remove error', function(assert) {
        const dataErrors = [];

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

        this.clock.tick(10);

        // act
        this.editingController.deleteRow(0);

        // assert
        assert.deepEqual(dataErrors, ['Remove error']);
    });
});

QUnit.module('Remote Grouping', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.setupDataGridModules = function() {
            setupDataGridModules(this, ['data', 'columns', 'filterRow', 'grouping', 'summary']);
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {

    // T320744
    QUnit.test('Error when CustomStore returns plain data and remote grouping enabled', function(assert) {
        let storeLoadOptions;
        const onDataErrorOccurredSpy = sinon.spy();

        this.options = {
            dataSource: {
                group: 'name',
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
            onDataErrorOccurred: onDataErrorOccurredSpy,
            paging: {
                enabled: true
            },
            columns: ['name', 'age'],
            remoteOperations: true
        };

        // act
        this.setupDataGridModules();

        // assert
        const error = onDataErrorOccurredSpy.getCall(0).args[0].error;
        assert.ok(error instanceof Error, 'data error is Error object');

        assert.equal(error.__id, 'E1037', 'data error id');
        assert.equal(error.__details, 'Invalid structure of grouped data', 'data error details');

        assert.strictEqual(storeLoadOptions.skip, undefined, 'no skip option');
        assert.strictEqual(storeLoadOptions.take, undefined, 'no take option');
        assert.deepEqual(storeLoadOptions.group, [{ selector: 'name', desc: false, isExpanded: false }], 'group option');

        assert.equal(this.dataController.totalCount(), -1, 'totalCount');
        assert.equal(this.dataController.pageCount(), 1, 'pageCount');
    });

    // T366766
    QUnit.test('Error when CustomStore returns groups without items', function(assert) {
        let storeLoadOptions;
        const onDataErrorOccurredSpy = sinon.spy();

        this.options = {
            dataSource: {
                group: 'name',
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
            onDataErrorOccurred: onDataErrorOccurredSpy,
            paging: {
                enabled: true
            },
            columns: ['name', 'age'],
            remoteOperations: true
        };

        // act
        this.setupDataGridModules();

        // assert
        const error = onDataErrorOccurredSpy.getCall(0).args[0].error;
        assert.ok(error instanceof Error, 'data error is Error object');

        assert.equal(error.__id, 'E1037', 'data error id');
        assert.equal(error.__details, 'Invalid structure of grouped data', 'data error details');

        assert.strictEqual(storeLoadOptions.skip, undefined, 'no skip option');
        assert.strictEqual(storeLoadOptions.take, undefined, 'no take option');
        assert.deepEqual(storeLoadOptions.group, [{ selector: 'name', desc: false, isExpanded: false }], 'group option');

        assert.equal(this.dataController.totalCount(), -1, 'totalCount');
        assert.equal(this.dataController.pageCount(), 1, 'pageCount');
    });

    // T317797
    QUnit.test('CustomStore load options when remote grouping and paging enabled and no groups', function(assert) {
        let storeLoadOptions;
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
            columns: ['name', 'age'],
            remoteOperations: {
                grouping: true,
                paging: true
            }
        };

        // act
        this.setupDataGridModules();
        this.clock.tick(10);

        // assert
        assert.ok(!storeLoadOptions.group, 'no group option');
        assert.strictEqual(storeLoadOptions.skip, 0, 'skip option');
        assert.strictEqual(storeLoadOptions.take, 2, 'take option');
        assert.strictEqual(storeLoadOptions.requireTotalCount, true, 'requireTotalCount option');
        assert.ok(!this.dataController.isLoading());
        assert.equal(this.dataController.totalCount(), 10, 'totalCount');
        assert.equal(this.dataController.hasKnownLastPage(), true, 'hasKnownLastPage');
        assert.equal(this.dataController.items().length, 2, 'items count');
        assert.equal(this.dataController.pageCount(), 5, 'pageCount');
    });

    // T318309
    QUnit.test('CustomStore load options when remote grouping by column with serialization format', function(assert) {
        this.options = {
            dataSource: {
                group: 'birthDate',
                load: function(options) {
                    return $.Deferred().resolve([
                        { key: '1980/10/15', items: [{ name: 'Alex', birthDate: '1980/10/15' }] },
                        { key: '1984/1/1', items: [{ name: 'Dan', age: '1984/1/1' }] }
                    ]);
                },
                pageSize: 2
            },
            columns: ['name', { dataField: 'birthDate', dataType: 'date' }],
            remoteOperations: {
                grouping: true
            }
        };

        // act
        this.setupDataGridModules();
        this.clock.tick(10);

        // assert
        assert.equal(this.dataController.totalCount(), 2, 'totalCount');
        assert.equal(this.dataController.pageCount(), 1, 'pageCount');
        assert.deepEqual(this.dataController.items()[0].rowType, 'group', 'item 1 rowType');
        assert.deepEqual(this.dataController.items()[0].key, ['1980/10/15'], 'item 1 key');
        assert.deepEqual(this.dataController.items()[0].values, [new Date('1980/10/15')], 'item 1 values');
        assert.deepEqual(this.dataController.items()[1].rowType, 'group', 'item 2 rowType');
        assert.deepEqual(this.dataController.items()[1].key, ['1984/1/1'], 'item 2 key');
        assert.deepEqual(this.dataController.items()[1].values, [new Date('1984/1/1')], 'item 2 values');
    });
});

QUnit.module('Summary', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.setupDataGridModules = function(options) {
            setupDataGridModules(this, ['data', 'columns', 'filterRow', 'headerFilter', 'grouping', 'summary'], options);
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {

    QUnit.test('No total summary items', function(assert) {
        this.options = {
            dataSource: [
                { name: 'Alex', age: 19 },
                { name: 'Dan', age: 25 }
            ]
        };

        // act
        this.setupDataGridModules();
        this.clock.tick(10);

        // assert
        assert.deepEqual(this.dataController.footerItems(), []);
        assert.ok(!this.dataController.isLoading());
    });

    QUnit.test('CustomStore load options when remoteOperations auto and summary exists', function(assert) {
        let storeLoadOptions;
        this.options = {
            dataSource: {
                group: 'name',
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
                    summaryType: 'count'
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
        this.clock.tick(10);

        // assert
        assert.ok(!storeLoadOptions.skip && !storeLoadOptions.take, 'no paging options');
        assert.ok(!storeLoadOptions.summary, 'no summary options');
        assert.ok(!this.dataController.isLoading());
        assert.deepEqual(this.dataController.footerItems(), [{
            rowType: 'totalFooter', summaryCells: [[], [{
                value: 19,
                column: 'age',
                summaryType: 'min'
            }]]
        }], 'totalFooter items');
        assert.deepEqual(this.dataController.items()[0].rowType, 'group', 'first row type');
        // T328430
        assert.deepEqual(this.dataController.items()[0].summaryCells, [[], [{ summaryType: 'count', value: 1 }]], 'group summaryCells');
    });

    // T615903
    QUnit.test('No errors if wrong extra parameter is returned in CustomStore', function(assert) {
        this.options = {
            dataSource: {
                load: function(options) {
                    return $.Deferred().resolve([
                        { name: 'Alex', age: 19 },
                        { name: 'Dan', age: 25 }
                    ], 'success');
                }
            },
            scrolling: {
                mode: 'infinite'
            }
        };

        // act
        this.setupDataGridModules();
        this.clock.tick(10);

        // assert
        assert.equal(this.dataController.items().length, 2, 'two items are loaded');
    });

    QUnit.test('CustomStore load options when remote summary enabled', function(assert) {
        let storeLoadOptions;
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


        let errorId;

        errors.log = function(id) {
            if(!errorId) {
                errorId = id;
            }
        };

        // act
        this.setupDataGridModules();
        this.clock.tick(10);

        // assert
        assert.ok(!errorId, 'no errors');
        assert.strictEqual(storeLoadOptions.skip, 0, 'skip option');
        assert.strictEqual(storeLoadOptions.take, 2, 'take option');
        assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: 'age', summaryType: 'custom' }], 'totalSummary option');
        assert.ok(!this.dataController.isLoading());
        assert.equal(this.dataController.totalCount(), 10, 'totalCount');
        assert.deepEqual(this.dataController.footerItems(), [{
            rowType: 'totalFooter', summaryCells: [[], [{
                value: 3,
                column: 'age',
                summaryType: 'custom'
            }]]
        }], 'footerItems');
    });

    // T607606
    QUnit.test('CustomStore load options if remote summary enabled and summaryType is not defined', function(assert) {
        let storeLoadOptions;
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
        this.clock.tick(10);

        // assert
        assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: 'age', summaryType: 'count' }], 'totalSummary option');
        assert.deepEqual(this.dataController.footerItems(), [{
            rowType: 'totalFooter', summaryCells: [[], [{
                value: 3,
                column: 'age'
            }]]
        }], 'footerItems');
    });

    QUnit.test('CustomStore load options when all remoteOperations enabled and summary is defined', function(assert) {
        let storeLoadOptions;
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


        let errorId;

        errors.log = function(id) {
            if(!errorId) {
                errorId = id;
            }
        };

        // act
        this.setupDataGridModules();
        this.clock.tick(10);

        // assert
        assert.ok(!errorId, 'no errors');
        assert.strictEqual(storeLoadOptions.skip, 0, 'skip option');
        assert.strictEqual(storeLoadOptions.take, 2, 'take option');
        assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: 'age', summaryType: 'custom' }], 'totalSummary option');
        assert.ok(!this.dataController.isLoading());
        assert.equal(this.dataController.totalCount(), 10, 'totalCount');
        assert.deepEqual(this.dataController.footerItems(), [{
            rowType: 'totalFooter', summaryCells: [[], [{
                value: 3,
                column: 'age',
                summaryType: 'custom'
            }]]
        }], 'footerItems');
    });

    QUnit.test('CustomStore load summary on filter change if summary is single remote operation (T1071599)', function(assert) {
        this.options = {
            dataSource: {
                load: function(options) {
                    return $.Deferred().resolve([
                        { name: 'Alex', age: 19 },
                        { name: 'Dan', age: 25 }
                    ], {
                        summary: [3]
                    });
                },
                pageSize: 2
            },
            summary: {
                totalItems: [{
                    column: 'age',
                    summaryType: 'sum'
                }]
            },
            remoteOperations: {
                summary: true
            }
        };

        // act
        this.setupDataGridModules();
        this.clock.tick(10);
        this.filter(['age', '>', 20]);
        this.clock.tick(10);

        // assert
        assert.deepEqual(this.getVisibleRows().length, 1, 'rows are filtered');
        assert.deepEqual(this.getTotalSummaryValue('age'), 3, 'summary value');
    });

    // T306309
    QUnit.test('CustomStore load options when remote summary enabled and summary is not returned', function(assert) {
        let storeLoadOptions;
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
        this.clock.tick(10);

        // assert
        assert.strictEqual(storeLoadOptions.skip, 0, 'skip option');
        assert.strictEqual(storeLoadOptions.take, 2, 'take option');
        assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: 'age', summaryType: 'min' }], 'summary totalItems option');
        assert.ok(!this.dataController.isLoading());
        assert.equal(this.dataController.totalCount(), 10, 'totalCount');
        assert.deepEqual(this.dataController.footerItems(), [{
            rowType: 'totalFooter', summaryCells: [[], [{
                column: 'age',
                summaryType: 'min'
            }]]
        }], 'footerItems');
    });


    // T353923
    QUnit.test('CustomStore load options when remote paging/summary enabled and grouping is defined with summary.groupItems', function(assert) {
        let storeLoadOptions;
        this.options = {
            dataSource: {
                group: 'name',
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
        this.clock.tick(10);

        // assert
        assert.strictEqual(storeLoadOptions.skip, undefined, 'skip option');
        assert.strictEqual(storeLoadOptions.take, undefined, 'take option');
        assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: 'age', summaryType: 'min' }], 'summary totalItems option');
        assert.deepEqual(storeLoadOptions.groupSummary, undefined, 'summary groupItems option');
        assert.ok(!this.dataController.isLoading());
        assert.equal(this.dataController.totalCount(), 4, 'totalCount');
        assert.equal(this.dataController.pageCount(), 4, 'pageCount');
        assert.deepEqual(this.dataController.items().length, 2);
        assert.deepEqual(this.dataController.items()[0].data, {
            key: 'Alex',
            isContinuationOnNextPage: true,
            items: [{ name: 'Alex', age: 19 }],
            aggregates: [19]
        });
        assert.deepEqual(this.dataController.items()[0].summaryCells, [[], [{
            column: 'age',
            columnCaption: 'Age',
            summaryType: 'max',
            value: 19
        }]]);
        assert.deepEqual(this.dataController.items()[1].data, { name: 'Alex', age: 19 });
        assert.deepEqual(this.dataController.footerItems(), [{
            rowType: 'totalFooter', summaryCells: [[], [{
                column: 'age',
                summaryType: 'min',
                value: 5
            }]]
        }], 'footerItems');
    });

    // T353923
    QUnit.test('CustomStore load options when remote paging/summary enabled and grouping is defined without summary.groupitems', function(assert) {
        let storeLoadOptions;
        this.options = {
            dataSource: {
                group: 'name',
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
        this.clock.tick(10);

        // assert
        assert.strictEqual(storeLoadOptions.skip, undefined, 'skip option');
        assert.strictEqual(storeLoadOptions.take, undefined, 'take option');
        assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: 'age', summaryType: 'min' }], 'summary totalItems option');
        assert.deepEqual(storeLoadOptions.groupSummary, undefined, 'summary groupItems option');
        assert.ok(!this.dataController.isLoading());
        assert.equal(this.dataController.totalCount(), 4, 'totalCount');
        assert.equal(this.dataController.pageCount(), 4, 'pageCount');
        assert.deepEqual(this.dataController.items().length, 2);
        assert.deepEqual(this.dataController.items()[0].data, {
            key: 'Alex',
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
        }], 'footerItems');
    });


    // T353923
    QUnit.test('CustomStore load options when remote paging/sorting/filtering/summary enabled and grouping is defined without summary.groupitems', function(assert) {
        let storeLoadOptions;
        this.options = {
            dataSource: {
                group: 'name',
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
        this.clock.tick(10);

        // assert
        assert.strictEqual(storeLoadOptions.skip, 0, 'skip option');
        assert.strictEqual(storeLoadOptions.take, 3, 'take option');
        assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: 'age', summaryType: 'min' }], 'summary totalItems option');
        assert.deepEqual(storeLoadOptions.groupSummary, undefined, 'summary groupItems option');
        assert.ok(!this.dataController.isLoading());
        assert.equal(this.dataController.totalCount(), 10, 'totalCount');
        assert.equal(this.dataController.pageCount(), 5, 'pageCount');
        assert.deepEqual(this.dataController.items().length, 3);
        assert.deepEqual(this.dataController.items()[0].data, {
            key: 'Alex',
            items: [{ name: 'Alex', age: 19 }, { name: 'Alex', age: 18 }]
        });
        assert.deepEqual(this.dataController.items()[1].data, { name: 'Alex', age: 19 });
        assert.deepEqual(this.dataController.footerItems(), [{
            rowType: 'totalFooter', summaryCells: [[], [{
                column: 'age',
                summaryType: 'min',
                value: 5
            }]]
        }], 'footerItems');
    });

    // T306309, T368811
    QUnit.test('CustomStore load options when remote summary enabled and summary is returned as strings', function(assert) {
        let storeLoadOptions;
        this.options = {
            dataSource: {
                load: function(options) {
                    storeLoadOptions = options;
                    return $.Deferred().resolve([
                        { name: 'Alex', age: 19, date: '2013-05-04T00:00:00Z' },
                        { name: 'Dan', age: 25, date: '2014-11-30T00:00:00Z' }
                    ], {
                        totalCount: 10,
                        summary: ['3', '2014-11-30T00:00:00Z']
                    });
                },
                pageSize: 2
            },
            columns: ['name', 'age', { dataField: 'date', dataType: 'date' }],
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
        this.clock.tick(10);

        // assert
        assert.strictEqual(storeLoadOptions.skip, 0, 'skip option');
        assert.strictEqual(storeLoadOptions.take, 2, 'take option');
        assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: 'age', summaryType: 'min' }, { selector: 'date', summaryType: 'max' }], 'summary totalItems option');
        assert.ok(!this.dataController.isLoading());
        assert.equal(this.dataController.totalCount(), 10, 'totalCount');
        assert.deepEqual(this.dataController.footerItems(), [{
            rowType: 'totalFooter', summaryCells: [[], [{
                value: 3,
                column: 'age',
                summaryType: 'min'
            }], [{
                value: new Date('2014-11-30T00:00:00Z'),
                valueFormat: 'shortDate',
                column: 'date',
                summaryType: 'max'
            }]]
        }], 'footerItems');
    });


    QUnit.test('CustomStore load options when remote summary and remote grouping without paging enabled', function(assert) {
        let storeLoadOptions;
        this.options = {
            dataSource: {
                group: 'name',
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
            columns: ['name', 'age'],
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
        this.clock.tick(10);

        // assert
        assert.strictEqual(storeLoadOptions.skip, undefined, 'no skip option');
        assert.strictEqual(storeLoadOptions.take, undefined, 'no take option');
        assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: 'age', summaryType: 'min' }], 'summary totalItems option');
        assert.deepEqual(storeLoadOptions.groupSummary, [{ selector: 'age', summaryType: 'count' }], 'summary groupItems option');
        assert.ok(!this.dataController.isLoading());
        assert.equal(this.dataController.totalCount(), 2, 'totalCount');
        assert.equal(this.dataController.pageCount(), 1, 'pageCount');
        assert.deepEqual(this.dataController.items()[0].summaryCells, [[], [{
            column: 'age',
            columnCaption: 'Age',
            summaryType: 'count',
            value: 1
        }]], 'summary cells');
        assert.deepEqual(this.dataController.footerItems(), [{
            rowType: 'totalFooter', summaryCells: [[], [{
                value: 3,
                column: 'age',
                summaryType: 'min'
            }]]
        }], 'footerItems');
    });

    QUnit.test('CustomStore load options when remote summary and remote grouping and paging enabled', function(assert) {
        let storeLoadOptions;
        this.options = {
            dataSource: {
                group: 'name',
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
            columns: ['name', 'age'],
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
        this.clock.tick(10);

        // assert
        assert.strictEqual(storeLoadOptions.skip, undefined, 'no skip option');
        assert.strictEqual(storeLoadOptions.take, undefined, 'no take option');
        assert.deepEqual(storeLoadOptions.totalSummary, [{ selector: 'age', summaryType: 'min' }], 'summary totalItems option');
        assert.deepEqual(storeLoadOptions.groupSummary, [{ selector: 'age', summaryType: 'count' }], 'summary groupItems option');
        assert.ok(!this.dataController.isLoading());
        assert.equal(this.dataController.totalCount(), 2, 'totalCount');
        assert.equal(this.dataController.pageCount(), 1, 'pageCount');
        assert.deepEqual(this.dataController.items()[0].summaryCells, [[], [{
            column: 'age',
            columnCaption: 'Age',
            summaryType: 'count',
            value: 1
        }]], 'summary cells');
        assert.deepEqual(this.dataController.footerItems(), [{
            rowType: 'totalFooter', summaryCells: [[], [{
                value: 3,
                column: 'age',
                summaryType: 'min'
            }]]
        }], 'footerItems');
    });

    QUnit.test('CustomStore load options when remote operations enabled and grouping with sort by summary info is defined', function(assert) {
        let storeLoadOptions;
        this.options = {
            dataSource: {
                group: 'group',
                key: 'id',
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
                            { id: 0, group: 'Group0' },
                            { id: 1, group: 'Group0' },
                            { id: 2, group: 'Group1' }
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
            columns: [ 'id', 'group' ],
            sortByGroupSummaryInfo: [{
                summaryItem: 'count'
            }],
            summary: {
                groupItems: [{
                    summaryType: 'count'
                }]
            },
            remoteOperations: true
        };

        // act
        this.setupDataGridModules();
        this.clock.tick(10);

        // assert
        assert.strictEqual(storeLoadOptions.skip, undefined, 'no skip option');
        assert.strictEqual(storeLoadOptions.take, undefined, 'no take option');
        assert.deepEqual(storeLoadOptions.filter, [['group', '=', 'Group1'], 'or', ['group', '=', 'Group0']], 'filter option');
        assert.deepEqual(storeLoadOptions.sort, [{ 'desc': false, 'isExpanded': true, 'selector': 'group' }], 'sort option');
        assert.equal(this.dataController.totalCount(), 3, 'totalCount');
        assert.equal(this.dataController.pageCount(), 2, 'pageCount');
        const items = this.dataController.items();
        assert.equal(items.length, 4, 'item count');
        assert.deepEqual(items[0].key, ['Group1'], 'item 0');
        assert.equal(items[1].key, 2, 'item 1');
        assert.deepEqual(items[2].key, ['Group0'], 'item 2');
        assert.equal(items[3].key, 0, 'item 3');
    });

    // T682960
    QUnit.test('Check second page when remote operations, paging, grouping with sort by summary info are defined', function(assert) {
        this.options = {
            dataSource: {
                group: 'group',
                key: 'id',
                load: function(options) {
                    if(options.group) {
                        return $.Deferred().resolve([
                            { key: 'Group0', items: null, count: 6, summary: [6] },
                            { key: 'Group1', items: null, count: 4, summary: [4] }
                        ], {
                            totalCount: 6
                        });
                    } else {
                        return $.Deferred().resolve([
                            { id: 0, group: 'Group0' },
                            { id: 1, group: 'Group0' },
                            { id: 2, group: 'Group0' },
                            { id: 3, group: 'Group0' },
                            { id: 4, group: 'Group0' },
                            { id: 5, group: 'Group0' },
                            { id: 6, group: 'Group1' },
                            { id: 8, group: 'Group1' },
                            { id: 9, group: 'Group1' },
                            { id: 10, group: 'Group1' }
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
            columns: [ 'id', 'group' ],
            sortByGroupSummaryInfo: [{
                summaryItem: 'count'
            }],
            summary: {
                groupItems: [{
                    summaryType: 'count'
                }]
            },
            remoteOperations: true
        };

        // act
        this.setupDataGridModules();
        this.clock.tick(10);
        this.dataController.pageIndex(1);

        const items = this.dataController.items();
        assert.equal(items.length, 4, 'item count');
        assert.deepEqual(items[0].key, ['Group1']);
        assert.equal(items[1].key, 10, 'last item of Group1');
        assert.deepEqual(items[2].key, ['Group0']);
        assert.equal(items[3].key, 0, 'first item of Group0');
    });

    QUnit.test('CustomStore load options when remote operations enabled and multi-grouping with sort by summary info is defined', function(assert) {
        let storeLoadOptions;
        this.options = {
            dataSource: {
                group: ['group1', 'group2'],
                key: 'id',
                load: function(options) {
                    storeLoadOptions = options;
                    if(options.group) {
                        return $.Deferred().resolve([
                            { key: 'Group0', items: [{ key: 'Group0_0', items: null, count: 2, summary: [2] }], count: 2, summary: [2] },
                            { key: 'Group1', items: [{ key: 'Group1_0', items: null, count: 1, summary: [1] }], count: 1, summary: [1] }
                        ], {
                            totalCount: 3
                        });
                    } else {
                        return $.Deferred().resolve([
                            { id: 0, group1: 'Group0', group2: 'Group0_0' },
                            { id: 1, group1: 'Group0', group2: 'Group0_0' },
                            { id: 2, group1: 'Group1', group2: 'Group1_0' }
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
            columns: ['id', 'group1', 'group2'],
            sortByGroupSummaryInfo: [{
                summaryItem: 'count'
            }],
            summary: {
                groupItems: [{
                    summaryType: 'count'
                }]
            },
            remoteOperations: true
        };

        // act
        this.setupDataGridModules();
        this.clock.tick(10);

        // assert
        assert.strictEqual(storeLoadOptions.skip, undefined, 'no skip option');
        assert.strictEqual(storeLoadOptions.take, undefined, 'no take option');
        assert.deepEqual(storeLoadOptions.filter,
            [[['group1', '=', 'Group1'], 'and', ['group2', '=', 'Group1_0']], 'or', [['group1', '=', 'Group0'], 'and', ['group2', '=', 'Group0_0']]], 'filter option');
        assert.deepEqual(storeLoadOptions.sort,
            [{ 'desc': false, 'isExpanded': true, 'selector': 'group1' }, { 'desc': false, 'isExpanded': true, 'selector': 'group2' }], 'sort option');
        assert.equal(this.dataController.totalCount(), 3, 'totalCount');
        assert.equal(this.dataController.pageCount(), 2, 'pageCount');
        const items = this.dataController.items();
        assert.equal(items.length, 6, 'item count');
        assert.deepEqual(items[0].key, ['Group1'], 'item 0');
        assert.deepEqual(items[1].key, ['Group1', 'Group1_0'], 'item 1');
        assert.equal(items[2].key, 2, 'item 2');
        assert.deepEqual(items[3].key, ['Group0'], 'item 3');
        assert.deepEqual(items[4].key, ['Group0', 'Group0_0'], 'item 4');
    });


    QUnit.test('One total summary item for second column', function(assert) {
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
        this.clock.tick(10);

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

    QUnit.test('Filtering on column with dataType when summary is defined', function(assert) {
        this.options = {
            columns: ['name', { dataField: 'birthDate', dataType: 'date', filterValue: new Date('1987/5/5') }],
            dataSource: [
                { name: 'Alex', birthDate: '1987/5/5' },
                { name: 'Dan', birthDate: '1985/3/21' }
            ],
            remoteOperations: 'auto',
            summary: {
                totalItems: [{
                    showInColumn: 'birthDate',
                    summaryType: 'count'
                }]
            }
        };

        // act
        this.setupDataGridModules();
        this.clock.tick(10);

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

    QUnit.test('Total summary items when number in string format', function(assert) {
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
        this.clock.tick(10);

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

    QUnit.test('Several total summary items in one column', function(assert) {
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
        this.clock.tick(10);

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
    QUnit.test('skip empty values for total summary items', function(assert) {
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
        this.clock.tick(10);

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
    QUnit.test('skip empty values for total summary items when common skipEmptyValues false', function(assert) {
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
        this.clock.tick(10);

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

    QUnit.test('total summary item show in other column', function(assert) {
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
        this.clock.tick(10);

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

    QUnit.test('total summary for column with showWhenGrouped', function(assert) {
        this.options = {
            columns: [{ dataField: 'name', showWhenGrouped: true, groupIndex: 0 }, 'age'],
            dataSource: {
                group: 'name',
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
        this.clock.tick(10);

        // assert
        assert.deepEqual(this.dataController.footerItems(), [{
            rowType: 'totalFooter', summaryCells: [[{
                column: 'age',
                columnCaption: 'Age',
                showInColumn: 'name',
                summaryType: 'min',
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

    QUnit.test('total summary for one summary item if it has group index', function(assert) {
        this.options = {
            columns: ['name', 'age'],
            dataSource: {
                group: 'name',
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
        this.clock.tick(10);

        // assert
        assert.deepEqual(this.dataController.footerItems(), []);
    });

    QUnit.test('Several total summary items in different column', function(assert) {
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
        this.clock.tick(10);

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

    QUnit.test('total summary item with incorrect column', function(assert) {
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
        this.clock.tick(10);

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

    QUnit.test('total custom summary when calculateCustomSummary not implemented', function(assert) {
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

        let errorId;

        errors.log = function(id) {
            if(!errorId) {
                errorId = id;
            }
        };

        // act
        this.setupDataGridModules();
        this.clock.tick(10);

        // assert
        assert.equal(errorId, 'E1026', 'error message');
        assert.ok(!this.dataController.isLoading());
    });

    QUnit.test('total custom summary', function(assert) {
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
        this.clock.tick(10);

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

    QUnit.test('total custom summary by selection', function(assert) {
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
        this.clock.tick(10);

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

    // T719655
    QUnit.test('refresh group custom summary by selection if data is grouped to one group', function(assert) {
        const that = this;
        this.options = {
            keyExpr: 'id',
            dataSource: [
                { id: 1, name: 'Alex', age: 19 },
                { id: 2, name: 'Alex', age: 23 },
                { id: 3, name: 'Alex', age: 25 }
            ],
            grouping: {
                autoExpandAll: true
            },
            columns: ['id', { dataField: 'name', groupIndex: 0 }, 'age'],
            summary: {
                groupItems: [{
                    name: 'SelectedAvgAge',
                    showInColumn: 'age',
                    showInGroupFooter: true,
                    summaryType: 'custom'
                }],
                calculateCustomSummary: function(options) {
                    if(options.name === 'SelectedAvgAge') {
                        if(options.summaryProcess === 'start') {
                            options.totalValue = [0, 0];
                        }
                        if(options.summaryProcess === 'calculate') {
                            if(options.component.isRowSelected(options.value.id)) {
                                options.totalValue = [options.totalValue[0] + options.value.age, options.totalValue[1] + 1];
                            }
                        }
                        if(options.summaryProcess === 'finalize') {
                            options.totalValue = options.totalValue[0] / options.totalValue[1];
                        }
                    }
                }
            },
            onSelectionChanged: function(e) {
                that.refresh(true);
            },
            selectedRowKeys: [1]
        };

        setupDataGridModules(this, ['data', 'columns', 'selection', 'summary', 'grouping']);
        this.clock.tick(10);

        const changedSpy = sinon.spy();
        this.dataController.changed.add(changedSpy);

        // act
        this.selectRows([1, 2]);
        this.clock.tick(10);

        // assert
        assert.deepEqual(changedSpy.callCount, 2);
        assert.deepEqual(changedSpy.getCall(0).args[0].changeType, 'updateSelection');
        assert.deepEqual(changedSpy.getCall(1).args[0].changeType, 'update');
        assert.deepEqual(changedSpy.getCall(1).args[0].rowIndices, [4]);
        assert.deepEqual(changedSpy.getCall(1).args[0].columnIndices, [undefined]);

        assert.deepEqual(this.dataController.items().length, 5);
        assert.deepEqual(this.dataController.items()[4].rowType, 'groupFooter');
        assert.deepEqual(this.dataController.items()[4].key, ['Alex']);
        assert.deepEqual(this.dataController.items()[4].summaryCells, [[], [], [{
            name: 'SelectedAvgAge',
            value: (19 + 23) / 2,
            showInColumn: 'age',
            showInGroupFooter: true,
            summaryType: 'custom'
        }]]);
    });

    QUnit.test('Changing total summary items', function(assert) {
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
        this.clock.tick(10);

        // act
        this.options.summary.totalItems.push({
            column: 'age',
            summaryType: 'max'
        });

        this.dataController.optionChanged({ name: 'summary' });
        this.clock.tick(10);


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

    QUnit.test('group summary item in group cell', function(assert) {
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
        this.clock.tick(10);

        // assert
        assert.ok(!this.dataController.isLoading());
        assert.strictEqual(this.dataController.items().length, 2);
        assert.deepEqual(this.dataController.items()[0].summaryCells, [[], [{
            value: 15,
            column: 'age',
            columnCaption: 'Age',
            summaryType: 'min'
        }]]);
        assert.deepEqual(this.dataController.items()[1].summaryCells, [[], [{
            value: 25,
            columnCaption: 'Age',
            column: 'age',
            summaryType: 'min'
        }]]);
    });

    QUnit.test('Group footer is hidden when group summary is defined a for one a grouped column', function(assert) {
        this.options = {
            columns: [{ dataField: 'name', groupIndex: 0 }, 'age'],
            grouping: {
                autoExpandAll: true
            },
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
                    column: 'name',
                    summaryType: 'count',
                    showInGroupFooter: true
                }]
            }
        };

        // act
        this.setupDataGridModules();
        this.clock.tick(10);

        // assert
        assert.strictEqual(this.dataController.items().length, 5);
        assert.equal(this.dataController.items()[0].rowType, 'group');
        assert.equal(this.dataController.items()[1].rowType, 'data');
        assert.equal(this.dataController.items()[2].rowType, 'data');
        assert.equal(this.dataController.items()[3].rowType, 'group');
        assert.equal(this.dataController.items()[4].rowType, 'data');
    });

    QUnit.test('Show summary value in group footer when showWhenGrouped is true for grouped column', function(assert) {
        this.options = {
            columns: [{ dataField: 'name', groupIndex: 0, showWhenGrouped: true }, 'age'],
            grouping: {
                autoExpandAll: true
            },
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
                    column: 'name',
                    summaryType: 'count',
                    showInGroupFooter: true
                }]
            }
        };

        // act
        this.setupDataGridModules();
        this.clock.tick(10);

        // assert
        assert.strictEqual(this.dataController.items().length, 7);
        assert.equal(this.dataController.items()[0].rowType, 'group');
        assert.equal(this.dataController.items()[1].rowType, 'data');
        assert.equal(this.dataController.items()[2].rowType, 'data');
        assert.equal(this.dataController.items()[3].rowType, 'groupFooter');
        assert.equal(this.dataController.items()[4].rowType, 'group');
        assert.equal(this.dataController.items()[5].rowType, 'data');
        assert.equal(this.dataController.items()[6].rowType, 'groupFooter');
    });

    QUnit.test('group sorting by summary', function(assert) {
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
        this.clock.tick(10);

        // assert
        assert.ok(!this.dataController.isLoading());
        assert.strictEqual(this.dataController.items().length, 3);
        assert.deepEqual(this.dataController.items()[0].data.key, 'Dan');
        assert.deepEqual(this.dataController.items()[0].summaryCells[1][0].value, 1);
        assert.deepEqual(this.dataController.items()[1].data.key, 'Alex');
        assert.deepEqual(this.dataController.items()[1].summaryCells[1][0].value, 2);
        assert.deepEqual(this.dataController.items()[2].data.key, 'Sam');
        assert.deepEqual(this.dataController.items()[2].summaryCells[1][0].value, 3);
    });

    // T526028
    QUnit.test('group sorting by summary if remoteOperations option is enabled', function(assert) {
        this.options = {
            columns: ['name', 'age'],
            remoteOperations: true,
            dataSource: {
                group: 'name',
                load: function(options) {
                    return $.Deferred().resolve([
                        { key: 'Dan', summary: [1], items: null, count: 1 },
                        { key: 'Sam', summary: [3], items: null, count: 3 },
                        { key: 'Alex', summary: [2], items: null, count: 2 },
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
        this.clock.tick(10);

        // assert
        assert.ok(!this.dataController.isLoading());
        assert.strictEqual(this.dataController.items().length, 3);
        assert.deepEqual(this.dataController.items()[0].data.key, 'Dan');
        assert.deepEqual(this.dataController.items()[0].summaryCells[1][0].value, 1);
        assert.deepEqual(this.dataController.items()[1].data.key, 'Alex');
        assert.deepEqual(this.dataController.items()[1].summaryCells[1][0].value, 2);
        assert.deepEqual(this.dataController.items()[2].data.key, 'Sam');
        assert.deepEqual(this.dataController.items()[2].summaryCells[1][0].value, 3);
    });

    QUnit.test('group sorting by summary when change grouping', function(assert) {
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
        this.clock.tick(10);

        // act
        this.columnsController.columnOption('name', 'groupIndex', 0);

        // assert
        assert.ok(!this.dataController.isLoading());
        assert.strictEqual(this.dataController.items().length, 3);
        assert.deepEqual(this.dataController.items()[0].data.key, 'Dan');
        assert.deepEqual(this.dataController.items()[0].summaryCells[1][0].value, 1);
        assert.deepEqual(this.dataController.items()[1].data.key, 'Alex');
        assert.deepEqual(this.dataController.items()[1].summaryCells[1][0].value, 2);
        assert.deepEqual(this.dataController.items()[2].data.key, 'Sam');
        assert.deepEqual(this.dataController.items()[2].summaryCells[1][0].value, 3);
    });

    QUnit.test('Changing sortByGroupSummaryInfo', function(assert) {
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
        this.clock.tick(10);

        // act
        this.option('sortByGroupSummaryInfo', [{ summaryItem: 'count' }]);
        this.clock.tick(10);


        // assert
        assert.ok(!this.dataController.isLoading());
        assert.strictEqual(this.dataController.items().length, 3);
        assert.deepEqual(this.dataController.items()[0].data.key, 'Dan');
        assert.deepEqual(this.dataController.items()[0].summaryCells[1][0].value, 1);
        assert.deepEqual(this.dataController.items()[1].data.key, 'Alex');
        assert.deepEqual(this.dataController.items()[1].summaryCells[1][0].value, 2);
        assert.deepEqual(this.dataController.items()[2].data.key, 'Sam');
        assert.deepEqual(this.dataController.items()[2].summaryCells[1][0].value, 3);
    });

    QUnit.test('group sorting by summary when several columns grouped', function(assert) {
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
        this.clock.tick(10);

        // assert
        assert.ok(!this.dataController.isLoading());
        assert.deepEqual(this.dataController.items()[0].data.key, 'Sam');
        assert.deepEqual(this.dataController.items()[0].summaryCells[1][0].value, 3);
        assert.deepEqual(this.dataController.items()[1].data.key, 20);
        assert.deepEqual(this.dataController.items()[1].summaryCells[2][1].value, 20);
    });

    QUnit.test('group sorting by first summary', function(assert) {
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
        this.clock.tick(10);

        // assert
        assert.ok(!this.dataController.isLoading());
        assert.strictEqual(this.dataController.items().length, 3);
        assert.deepEqual(this.dataController.items()[0].data.key, 'Dan');
        assert.deepEqual(this.dataController.items()[0].summaryCells[1][0].value, 1);
        assert.deepEqual(this.dataController.items()[1].data.key, 'Alex');
        assert.deepEqual(this.dataController.items()[1].summaryCells[1][0].value, 2);
        assert.deepEqual(this.dataController.items()[2].data.key, 'Sam');
        assert.deepEqual(this.dataController.items()[2].summaryCells[1][0].value, 3);
    });

    // T678072
    QUnit.test('headerFilter items if sortByGroupSummaryInfo is defined', function(assert) {
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
        this.clock.tick(10);

        const headerFilterDataSource = new DataSource(this.headerFilterController.getDataSource(this.getVisibleColumns()[1]));
        let headerFilterItems;

        headerFilterDataSource.load().done(function(data) {
            headerFilterItems = data;
        });

        // assert
        assert.deepEqual(headerFilterItems.map(function(item) { return item.value; }), [15, 18, 19, 20, 25], 'items are sorted');
    });

    QUnit.test('findSummaryItem by custom name', function(assert) {
        const summaryItems = [{
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
        this.clock.tick(10);

        // assert
        assert.strictEqual(this.dataController._findSummaryItem(summaryItems, 'count'), 0, 'find by summaryType');
        assert.strictEqual(this.dataController._findSummaryItem(summaryItems, 'testField'), 2, 'find by column name');
        assert.strictEqual(this.dataController._findSummaryItem(summaryItems, 'min_testField'), 2, 'find by summary type+column name');
        assert.strictEqual(this.dataController._findSummaryItem(summaryItems, 'testCount2'), 1, 'find by name');
        assert.strictEqual(this.dataController._findSummaryItem(summaryItems, 1), 1, 'find by summary item index');
        assert.strictEqual(this.dataController._findSummaryItem(summaryItems, 'test3'), -1, 'find by wrong name');
    });

    QUnit.test('group sorting by summary sortOrder desc', function(assert) {
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
        this.clock.tick(10);

        // assert
        assert.ok(!this.dataController.isLoading());
        assert.strictEqual(this.dataController.items().length, 3);
        assert.deepEqual(this.dataController.items()[0].data.key, 'Sam');
        assert.deepEqual(this.dataController.items()[0].summaryCells[1][0].value, 3);
        assert.deepEqual(this.dataController.items()[1].data.key, 'Alex');
        assert.deepEqual(this.dataController.items()[1].summaryCells[1][0].value, 2);
        assert.deepEqual(this.dataController.items()[2].data.key, 'Dan');
        assert.deepEqual(this.dataController.items()[2].summaryCells[1][0].value, 1);
    });

    QUnit.test('group sorting by several summaries', function(assert) {
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
        this.clock.tick(10);

        // assert
        assert.ok(!this.dataController.isLoading());
        assert.strictEqual(this.dataController.items().length, 3);
        assert.deepEqual(this.dataController.items()[0].data.key, 'Sam');
        assert.deepEqual(this.dataController.items()[0].summaryCells[1][0].value, 2);
        assert.deepEqual(this.dataController.items()[0].summaryCells[1][1].value, 19);
        assert.deepEqual(this.dataController.items()[1].data.key, 'Alex');
        assert.deepEqual(this.dataController.items()[1].summaryCells[1][0].value, 2);
        assert.deepEqual(this.dataController.items()[1].summaryCells[1][1].value, 25);
        assert.deepEqual(this.dataController.items()[2].data.key, 'Dan');
        assert.deepEqual(this.dataController.items()[2].summaryCells[1][0].value, 1);
    });

    QUnit.test('group sorting groupColumn fo grouped column only', function(assert) {
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
        this.clock.tick(10);

        // assert
        assert.ok(!this.dataController.isLoading());
        assert.strictEqual(this.dataController.items().length, 3);
        assert.deepEqual(this.dataController.items()[0].data.key, 'Alex');
        assert.deepEqual(this.dataController.items()[0].summaryCells[1][0].value, 2);
        assert.deepEqual(this.dataController.items()[0].summaryCells[1][1].value, 25);
        assert.deepEqual(this.dataController.items()[1].data.key, 'Sam');
        assert.deepEqual(this.dataController.items()[1].summaryCells[1][0].value, 2);
        assert.deepEqual(this.dataController.items()[1].summaryCells[1][1].value, 19);
        assert.deepEqual(this.dataController.items()[2].data.key, 'Dan');
        assert.deepEqual(this.dataController.items()[2].summaryCells[1][0].value, 1);
    });

    QUnit.test('group custom summary item', function(assert) {
        let startCount = 0;
        let calculateCount = 0;
        let finalizeCount = 0;

        let totalValue;
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
        this.clock.tick(10);

        // assert
        assert.ok(!this.dataController.isLoading());
        assert.strictEqual(this.dataController.items().length, 2);
        assert.deepEqual(this.dataController.items()[0].summaryCells, [[], [{
            value: 2,
            name: 'CountFromAge18',
            summaryType: 'custom'
        }]]);
        assert.deepEqual(this.dataController.items()[1].summaryCells, [[], [{
            value: 1,
            name: 'CountFromAge18',
            summaryType: 'custom'
        }]]);

        // T278115
        assert.strictEqual(startCount, 2, 'start count');
        assert.strictEqual(calculateCount, 4, 'calculate count');
        assert.strictEqual(finalizeCount, 2, 'finalize count');
    });

    QUnit.test('group custom summary item depends on groupIndex', function(assert) {
        this.options = {
            columns: ['name', 'age'],
            dataSource: {
                group: ['name', 'age'],
                store: [
                    { name: 'Alex', age: 19 },
                    { name: 'Alex', age: 20 },
                    { name: 'Alex', age: 15 },
                    { name: 'Dan', age: 25 }
                ]
            },
            summary: {
                groupItems: [{
                    name: 'CountForFirstGroup',
                    summaryType: 'custom'
                }],
                calculateCustomSummary: function(options) {
                    if(options.name === 'CountForFirstGroup' && options.groupIndex === 0) {
                        if(options.summaryProcess === 'start') {
                            options.totalValue = 0;
                        }
                        if(options.summaryProcess === 'calculate') {
                            options.totalValue++;
                        }
                    }
                }
            }
        };

        // act
        this.setupDataGridModules();
        this.clock.tick(10);

        this.dataController.expandRow(['Alex']);

        // assert
        assert.strictEqual(this.dataController.items().length, 5);
        assert.deepEqual(this.dataController.items()[0].summaryCells, [[], [{
            value: 3,
            name: 'CountForFirstGroup',
            summaryType: 'custom'
        }], []], 'summary value is calculated for first group');
        assert.deepEqual(this.dataController.items()[1].summaryCells, [[], [], [{
            name: 'CountForFirstGroup',
            summaryType: 'custom'
        }]], 'summary value is not calculated for second group');
    });

    QUnit.test('group summary item alignByColumn', function(assert) {
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
        this.clock.tick(10);

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

    QUnit.test('group summary items with and without alignByColumn', function(assert) {
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
        this.clock.tick(10);

        // assert
        assert.ok(!this.dataController.isLoading());
        assert.strictEqual(this.dataController.items()[0].rowType, 'group');
        assert.deepEqual(this.dataController.items()[0].summaryCells, [[],
            [$.extend({ value: 2 }, this.options.summary.groupItems[0])],
            [$.extend({ value: 15 }, this.options.summary.groupItems[1])]
        ]);
        assert.strictEqual(this.dataController.items()[3].rowType, 'group');
        assert.deepEqual(this.dataController.items()[3].summaryCells, [[],
            [$.extend({ value: 1 }, this.options.summary.groupItems[0])],
            [$.extend({ value: 25 }, this.options.summary.groupItems[1])]
        ]);
    });

    // T241954
    QUnit.test('group summary item alignByColumn for first cell after group', function(assert) {
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
        this.clock.tick(10);

        // assert
        assert.ok(!this.dataController.isLoading());
        assert.strictEqual(this.dataController.items()[0].rowType, 'group');
        assert.deepEqual(this.dataController.items()[0].summaryCells, [[], [
            $.extend({ value: 59, columnCaption: 'Age' }, this.options.summary.groupItems[0])
        ], []]);
        assert.strictEqual(this.dataController.items()[1].rowType, 'group');
        assert.deepEqual(this.dataController.items()[1].summaryCells, [[], [], [
            $.extend({ value: 34, columnCaption: 'Age' }, this.options.summary.groupItems[0])
        ]]);
        assert.strictEqual(this.dataController.items()[4].rowType, 'group');
        assert.deepEqual(this.dataController.items()[4].summaryCells, [[], [], [
            $.extend({ value: 25, columnCaption: 'Age' }, this.options.summary.groupItems[0])
        ]]);
    });

    QUnit.test('group summary item with showInGroupFooter when no autoExpandAll', function(assert) {
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
        this.clock.tick(10);

        // assert
        assert.ok(!this.dataController.isLoading());
        assert.strictEqual(this.dataController.items().length, 2);
        assert.deepEqual(this.dataController.items()[0].summaryCells, []);
        assert.deepEqual(this.dataController.items()[1].summaryCells, []);
    });

    QUnit.test('No groupFooter item when group summary items with showInGroupFooter and no autoExpandAll', function(assert) {
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
        this.clock.tick(10);

        // assert
        assert.ok(!this.dataController.isLoading());
        assert.strictEqual(this.dataController.items().length, 2);
        assert.strictEqual(this.dataController.items()[0].rowType, 'group');
        assert.strictEqual(this.dataController.items()[1].rowType, 'group');
    });

    QUnit.test('groupFooter item when group summary items with showInGroupFooter and autoExpandAll', function(assert) {
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
        this.clock.tick(10);

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
    QUnit.test('groupFooter item when group by several fields and summary item is defined with showInGroupFooter', function(assert) {
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
        this.clock.tick(10);

        // assert
        const items = this.dataController.items();
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

    QUnit.test('several groupFooter items when group summary items with showInGroupFooter and autoExpandAll', function(assert) {
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
        this.clock.tick(10);

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

    QUnit.test('not show groupFooter item for grouped column', function(assert) {
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
        this.clock.tick(10);

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
});

QUnit.module('Summary with Editing', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.options = {
            dataSource: [
                { id: 1, value: 2 },
                { id: 2, value: 3 },
                { id: 3, value: 4 },
                { id: 4, value: 5 },
                { id: 5, value: 6 }
            ],
            keyExpr: 'id',
            editing: {
                mode: 'batch'
            },
            grouping: {
                autoExpandAll: true
            },
            summary: {
                recalculateWhileEditing: true,
                skipEmptyValues: true,
                groupItems: [{
                    column: 'value',
                    summaryType: 'sum'
                }],
                totalItems: [{
                    column: 'id',
                    summaryType: 'count'
                }, {
                    column: 'value',
                    summaryType: 'sum'
                }]
            }
        };

        this.setupDataGridModules = function(options) {
            setupDataGridModules(this, ['data', 'columns', 'filterRow', 'grouping', 'summary', 'editing', 'editingRowBased', 'editingCellBased'], options);

            this._views.rowsView = { ...rowsViewMock };
        };

        this.getTotalValues = function() {
            return this.dataController.footerItems()[0].summaryCells.map(function(summaryItems) {
                return summaryItems.length <= 1 ? (summaryItems[0] && summaryItems[0].value) : summaryItems.map(function(item) { return item.value; });
            });
        };

        this.setValue = function(rowIndex, value) {
            const row = this.getVisibleRows()[rowIndex];
            this.editingController.updateFieldValue({
                row,
                key: row.key,
                data: row.data,
                column: this.columnOption('value')
            }, value);
        };
    },
    afterEach: function() {
        this.clock.restore();
        this.dispose();
    }
}, () => {

    QUnit.test('Total summary items without editing', function(assert) {
    // act
        this.setupDataGridModules();
        this.clock.tick(10);

        // assert
        assert.deepEqual(this.getTotalValues(), [5, 20]);
    });

    QUnit.test('modify cell', function(assert) {
    // act
        this.setupDataGridModules();
        this.clock.tick(10);
        this.setValue(0, 3);

        // assert
        assert.deepEqual(this.getTotalValues(), [5, 21]);
    });

    QUnit.test('modify cell and cancelEditData', function(assert) {
    // act
        this.setupDataGridModules();
        this.clock.tick(10);
        this.setValue(0, 3);
        this.cancelEditData();

        // assert
        assert.deepEqual(this.getTotalValues(), [5, 20]);
    });

    QUnit.test('add row', function(assert) {
    // act
        this.setupDataGridModules();
        this.clock.tick(10);
        this.addRow();

        // assert
        assert.deepEqual(this.getTotalValues(), [6, 20]);
    });

    // T697805
    QUnit.test('add row if data is grouped', function(assert) {
        // act
        this.setupDataGridModules();
        this.clock.tick(10);
        this.getDataSource().group('id');
        this.getDataSource().load();
        this.addRow();
        this.setValue(0, 1);

        // assert
        assert.deepEqual(this.getTotalValues(), [undefined, 21]);
    });

    QUnit.test('add row and modify cell', function(assert) {
    // act
        this.setupDataGridModules();
        this.clock.tick(10);
        this.addRow();
        this.setValue(0, 1);

        // assert
        assert.deepEqual(this.getTotalValues(), [6, 21]);
    });

    QUnit.test('add row and delete row', function(assert) {
    // act
        this.setupDataGridModules();
        this.clock.tick(10);
        this.addRow();
        this.deleteRow(0);

        // assert
        assert.deepEqual(this.getTotalValues(), [5, 20]);
    });

    QUnit.test('delete row', function(assert) {
    // act
        this.setupDataGridModules();
        this.clock.tick(10);
        this.deleteRow(3);

        // assert
        assert.deepEqual(this.getTotalValues(), [4, 15]);
    });

    // T697805
    QUnit.test('delete row if data is grouped', function(assert) {
    // act
        this.setupDataGridModules();
        this.clock.tick(10);
        this.getDataSource().group('id');
        this.getDataSource().load();

        // assert
        assert.deepEqual(this.getTotalValues(), [undefined, 20]);
        assert.deepEqual(this.getVisibleRows()[0].data.aggregates, [2]);

        // act
        this.deleteRow(1);

        // assert
        assert.deepEqual(this.getTotalValues(), [undefined, 18]);
        assert.deepEqual(this.getVisibleRows()[0].data.aggregates, [0]);
    });

    QUnit.test('modify cell and delete row', function(assert) {
    // act
        this.setupDataGridModules();
        this.clock.tick(10);
        this.setValue(3, 100);
        this.deleteRow(3);

        // assert
        assert.deepEqual(this.getTotalValues(), [4, 15]);
    });

    QUnit.test('delete row and undelete row', function(assert) {
    // act
        this.setupDataGridModules();
        this.clock.tick(10);
        this.deleteRow(3);
        this.undeleteRow(3);

        // assert
        assert.deepEqual(this.getTotalValues(), [5, 20]);
    });

    QUnit.test('modify cell, delete row and undelete row', function(assert) {
    // act
        this.setupDataGridModules();
        this.clock.tick(10);
        this.setValue(3, 100);
        this.deleteRow(3);
        this.undeleteRow(3);

        // assert
        assert.deepEqual(this.getTotalValues(), [5, 115]);
    });

    QUnit.test('partial update after editing', function(assert) {
        this.setupDataGridModules();
        this.clock.tick(10);

        this.addRow();

        const changedSpy = sinon.spy();
        this.dataController.changed.add(changedSpy);

        // act
        this.setValue(1, 100);

        // assert
        const changedArgs = changedSpy.getCall(0).args[0];

        assert.deepEqual(this.getTotalValues(), [6, 118]);

        assert.equal(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.rowIndices, [1]);
        assert.deepEqual(changedArgs.columnIndices, [[1]]);
        assert.deepEqual(changedArgs.totalColumnIndices, [1]);
    });
});

QUnit.module('Master Detail', {
    beforeEach: function() {
        this.array = [];
        for(let i = 0; i < 10; i++) {
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
}, () => {

    QUnit.test('items by default', function(assert) {
    // act
        this.setupDataGrid();

        // assert
        const items = this.dataController.items();
        assert.strictEqual(items.length, 5);

        for(let i = 0; i < items.length; i++) {
            assert.strictEqual(items[i].rowType, 'data');
            assert.strictEqual(items[i].isExpanded, false);
            assert.strictEqual(items[i].values[0], false);
        }
    });

    QUnit.test('items after expand one row', function(assert) {
        this.setupDataGrid();
        // act
        this.dataController.changeRowExpand(1);

        // assert
        const items = this.dataController.items();
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

    QUnit.test('expand events after expand/collapse one row', function(assert) {
        const events = [];
        const that = this;
        $.each(['onRowExpanding', 'onRowExpanded', 'onRowCollapsing', 'onRowCollapsed'], function(index, name) {
            that.options[name] = function(e) {
                events.push({ name: name, key: e.key });
            };
        });

        this.setupDataGrid();

        // act
        this.dataController.changeRowExpand(1);

        // assert
        let items = this.dataController.items();
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
            { name: 'onRowExpanding', key: 1 },
            { name: 'onRowExpanded', key: 1 },
            { name: 'onRowCollapsing', key: 1 },
            { name: 'onRowCollapsed', key: 1 }
        ], 'expand events');
    });

    QUnit.test('items when autoExpandAll', function(assert) {
    // act
        this.options.masterDetail.autoExpandAll = true;
        this.setupDataGrid();

        // assert
        const items = this.dataController.items();
        assert.strictEqual(items.length, 10);
        assert.strictEqual(items[0].rowType, 'data');
        assert.strictEqual(items[1].rowType, 'detail');
        assert.strictEqual(items[2].rowType, 'data');
        assert.strictEqual(items[3].rowType, 'detail');
    });


    QUnit.test('items after expandAll', function(assert) {
        this.setupDataGrid();
        // act
        this.dataController.expandAll(-1);

        // assert
        const items = this.dataController.items();
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

    QUnit.test('items after collapseAll', function(assert) {
        this.setupDataGrid();
        // act
        this.dataController.changeRowExpand(1);
        this.dataController.collapseAll(-1);

        // assert
        const items = this.dataController.items();
        assert.strictEqual(items.length, 5);
        assert.strictEqual(items[0].rowType, 'data');
        assert.strictEqual(items[1].rowType, 'data');
        assert.strictEqual(items[2].rowType, 'data');
        assert.strictEqual(items[3].rowType, 'data');
        assert.strictEqual(items[4].rowType, 'data');
    });

    QUnit.test('isRowExpanded', function(assert) {
        this.setupDataGrid();
        // act
        this.dataController.changeRowExpand(1);

        // assert
        assert.strictEqual(this.dataController.isRowExpanded(0), false);
        assert.strictEqual(this.dataController.isRowExpanded(1), true);
        assert.strictEqual(this.dataController.isRowExpanded(2), false);
    });

    QUnit.test('isRowExpanded after expandAll', function(assert) {
        this.setupDataGrid();
        // act
        this.dataController.expandAll(-1);
        this.dataController.changeRowExpand(1);

        // assert
        assert.strictEqual(this.dataController.isRowExpanded(0), true);
        assert.strictEqual(this.dataController.isRowExpanded(1), false);
        assert.strictEqual(this.dataController.isRowExpanded(2), true);
    });


    QUnit.test('expandRow by rowIndex', function(assert) {
        this.setupDataGrid();

        // act
        this.dataController.expandRow(this.getKeyByRowIndex(0));
        this.dataController.expandRow(this.getKeyByRowIndex(2));


        // assert
        assert.strictEqual(this.dataController.isRowExpanded(0), true);
        assert.strictEqual(this.dataController.isRowExpanded(1), true);
        assert.strictEqual(this.dataController.isRowExpanded(2), false);
    });

    QUnit.test('expandRow', function(assert) {
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

    QUnit.test('collapseRow', function(assert) {
        this.setupDataGrid();

        this.dataController.changeRowExpand(1);
        this.dataController.changeRowExpand(2);

        // act
        const collapseRowResult0 = this.dataController.collapseRow(0);
        const collapseRowResult1 = this.dataController.collapseRow(1);

        // assert
        assert.ok(collapseRowResult0 && collapseRowResult0.done, 'collapseRow result 0 is deferred');
        assert.strictEqual(collapseRowResult0.state(), 'resolved', 'collapseRow result 0 state is resolved');
        assert.ok(collapseRowResult1 && collapseRowResult1.done, 'collapseRow result 1 is deferred');
        assert.strictEqual(collapseRowResult1.state(), 'resolved', 'collapseRow result state 1 is resolved');
        assert.strictEqual(this.dataController.isRowExpanded(0), false);
        assert.strictEqual(this.dataController.isRowExpanded(1), false);
        assert.strictEqual(this.dataController.isRowExpanded(2), true);
    });

    QUnit.test('items after expand several rows', function(assert) {
        this.setupDataGrid();
        // act
        this.dataController.changeRowExpand(0);
        this.dataController.changeRowExpand(2);

        // assert
        const items = this.dataController.items();
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

    QUnit.test('expand events after expand several data rows', function(assert) {
        const events = [];
        const that = this;
        $.each(['onRowExpanding', 'onRowExpanded', 'onRowCollapsing', 'onRowCollapsed'], function(index, name) {
            that.options[name] = function(e) {
                events.push({ name: name, key: e.key });
            };
        });
        this.setupDataGrid();
        // act
        this.dataController.changeRowExpand(0);
        this.dataController.changeRowExpand(2);

        // assert
        const items = this.dataController.items();
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
            { name: 'onRowExpanding', key: 0 },
            { name: 'onRowExpanded', key: 0 },
            { name: 'onRowExpanding', key: 2 },
            { name: 'onRowExpanded', key: 2 }
        ], 'expand events');

    });

    QUnit.test('cancel expanding events', function(assert) {
        const events = [];
        const that = this;
        $.each(['onRowExpanding', 'onRowExpanded', 'onRowCollapsing', 'onRowCollapsed'], function(index, name) {
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
        const items = this.dataController.items();
        assert.strictEqual(items.length, 6);
        assert.strictEqual(items[0].rowType, 'data');
        assert.strictEqual(items[1].rowType, 'data');
        assert.strictEqual(items[2].rowType, 'data');
        assert.strictEqual(items[3].rowType, 'detail');
        assert.strictEqual(items[3].key, 2);
        assert.strictEqual(items[3].data.name, 'test2');

        assert.deepEqual(events, [
            { name: 'onRowExpanding', key: 0 },
            { name: 'onRowExpanding', key: 2 },
            { name: 'onRowExpanded', key: 2 }
        ], 'expand events');

    });

    QUnit.test('expand events after expand group row', function(assert) {
        const events = [];
        const that = this;
        $.each(['onRowExpanding', 'onRowExpanded', 'onRowCollapsing', 'onRowCollapsed'], function(index, name) {
            that.options[name] = function(e) {
                events.push({ name: name, key: e.key });
            };
        });
        this.options.columns[1].groupIndex = 0;
        this.options.loadingTimeout = 0;
        this.setupDataGrid();

        this.clock.tick(10);

        // act
        this.dataController.changeRowExpand([0]);

        // assert
        assert.equal(events.length, 1, 'one expand event called');

        // act
        this.clock.tick(10);

        // assert
        const items = this.dataController.items();
        assert.strictEqual(items.length, 5);
        assert.strictEqual(items[0].rowType, 'group');
        assert.strictEqual(items[0].data.key, 0);
        assert.strictEqual(items[1].rowType, 'data');
        assert.strictEqual(items[2].rowType, 'data');

        assert.deepEqual(events, [
            { name: 'onRowExpanding', key: [0] },
            { name: 'onRowExpanded', key: [0] }
        ], 'expand events');
    });

    QUnit.test('items after expand and change page', function(assert) {
        this.setupDataGrid();
        // act
        this.dataController.changeRowExpand(0);
        this.dataController.pageIndex(1);

        // assert
        let items = this.dataController.items();
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
    QUnit.test('items after expand and refresh', function(assert) {
        this.setupDataGrid();
        // act
        this.dataController.changeRowExpand(0);
        this.dataController.refresh();

        // assert
        const items = this.dataController.items();
        assert.strictEqual(items.length, 6);
        assert.strictEqual(items[0].rowType, 'data');
        assert.strictEqual(items[0].key, 0);
        assert.strictEqual(items[1].rowType, 'detail');
        assert.strictEqual(items[1].key, 0);
    });

    QUnit.test('items after collapse expanded row', function(assert) {
    // arrange
        this.setupDataGrid();
        this.dataController.changeRowExpand(0);
        this.dataController.changeRowExpand(2);

        // act
        this.dataController.changeRowExpand(0);

        // assert
        const items = this.dataController.items();
        assert.strictEqual(items.length, 7, 'count items');
        assert.strictEqual(items[0].rowType, 'data', 'rowType first item');
        assert.strictEqual(items[1].rowType, 'detail', 'rowType second item');
        assert.strictEqual(items[1].key, 0, 'key second item');
        assert.ok(!items[1].visible, 'visible second item');
        assert.strictEqual(items[1].data.name, 'test0', 'data name second item');
        assert.strictEqual(items[2].rowType, 'data', 'rowType third item');
        assert.strictEqual(items[3].rowType, 'data', 'rowType fourth item');
        assert.strictEqual(items[4].rowType, 'detail', 'rowType fifth item');
        assert.strictEqual(items[4].key, 2, 'key fifth item');
        assert.ok(items[4].visible, 'visible fifth item');
        assert.strictEqual(items[4].data.name, 'test2', 'data name fifth item');
    });

    QUnit.test('items after collapse expanded second row', function(assert) {
    // arrange
        this.setupDataGrid();
        this.dataController.changeRowExpand(1);
        this.dataController.changeRowExpand(2);

        // act
        this.dataController.changeRowExpand(1);

        // assert
        const items = this.dataController.items();
        assert.strictEqual(items.length, 7, 'count items');
        assert.strictEqual(items[0].rowType, 'data', 'rowType first item');
        assert.strictEqual(items[1].rowType, 'data', 'rowType second item');
        assert.strictEqual(items[2].rowType, 'detail', 'rowType third item');
        assert.strictEqual(items[2].key, 1, 'key third item');
        assert.ok(!items[2].visible, 'visible third item');
        assert.strictEqual(items[2].data.name, 'test1', 'data name third item');
        assert.strictEqual(items[3].rowType, 'data', 'rowType fourth item');
        assert.strictEqual(items[4].rowType, 'detail', 'rowType fifth item');
        assert.strictEqual(items[4].key, 2, 'key fifth item');
        assert.ok(items[4].visible, 'visible fifth item');
        assert.strictEqual(items[4].data.name, 'test2', 'data name fifth item');
    });

    QUnit.test('expand row on invisible page', function(assert) {
        this.setupDataGrid();
        this.dataController.changeRowExpand([0]);

        // act
        this.dataController.changeRowExpand(6);
        this.dataController.pageIndex(1);

        // assert
        const items = this.dataController.items();
        assert.strictEqual(items.length, 6);
        assert.strictEqual(items[0].rowType, 'data');
        assert.strictEqual(items[1].rowType, 'data');
        assert.strictEqual(items[2].rowType, 'detail');
        assert.strictEqual(items[2].key, 6);
        assert.strictEqual(items[2].data.name, 'test6');
    });

    QUnit.test('items after expand data row when grouped column exists', function(assert) {
        this.options.columns[1].groupIndex = 0;
        this.setupDataGrid();
        this.dataController.changeRowExpand([0]);

        // act
        this.dataController.changeRowExpand(0);

        // assert
        const items = this.dataController.items();
        assert.strictEqual(items.length, 6);
        assert.strictEqual(items[0].rowType, 'group');
        assert.strictEqual(items[0].data.key, 0);
        assert.strictEqual(items[1].rowType, 'data');
        assert.strictEqual(items[1].isExpanded, true);
        assert.deepEqual(items[1].values, [null, true, 0, 'test0']);
        assert.strictEqual(items[2].rowType, 'detail');
        assert.strictEqual(items[2].key, 0);
        assert.strictEqual(items[3].rowType, 'data');
        assert.strictEqual(items[3].key, 2);
        assert.strictEqual(items[3].isExpanded, false);
        assert.deepEqual(items[3].values, [null, false, 2, 'test2']);
        assert.strictEqual(items[4].rowType, 'data');
        assert.strictEqual(items[5].rowType, 'data');
    });

    QUnit.test('items after expand data row and collapse its group', function(assert) {
        this.options.columns[1].groupIndex = 0;
        this.setupDataGrid();

        this.dataController.changeRowExpand([0]);

        // act
        this.dataController.changeRowExpand(0);
        this.dataController.changeRowExpand([0]);

        // assert
        const items = this.dataController.items();
        assert.strictEqual(items.length, 2);
        assert.strictEqual(items[0].rowType, 'group');
        assert.strictEqual(items[1].rowType, 'group');
    });

    QUnit.test('detail items after disable masterDetail', function(assert) {
        this.setupDataGrid();
        // act
        this.dataController.changeRowExpand(1);

        this.option('masterDetail.enabled', false);

        // assert
        const items = this.dataController.items();
        assert.strictEqual(items.length, 5);
        assert.strictEqual(items[0].rowType, 'data');
        assert.strictEqual(items[1].rowType, 'data');
        assert.strictEqual(items[2].rowType, 'data');
        assert.strictEqual(items[3].rowType, 'data');
        assert.strictEqual(items[4].rowType, 'data');
    });

    // T175307
    QUnit.test('Not reset master detail items after reassign same masterDetail options', function(assert) {
        this.setupDataGrid();
        // act
        this.dataController.changeRowExpand(1);

        this.option('masterDetail', { enabled: true, autoExpandAll: false });

        // assert
        assert.ok(this.dataController.isRowExpanded(1), 'row 1 is expanded');
        assert.ok(!this.dataController.isRowExpanded(2), 'row 2 is not expanded');
    });

    QUnit.test('Reset master detail items after change masterDetail options', function(assert) {
        this.setupDataGrid();
        // act
        this.dataController.changeRowExpand(1);

        this.option('masterDetail', { enabled: true, autoExpandAll: true });

        // assert
        assert.ok(this.dataController.isRowExpanded(1), 'row 1 is not expanded');
        assert.ok(this.dataController.isRowExpanded(2), 'row 2 is not expanded');
    });

    // T199951
    QUnit.test('Visible item after expanded/collapsed', function(assert) {
    // arrange
        this.setupDataGrid();

        // act
        this.dataController.changeRowExpand(0);

        // assert
        let items = this.dataController.items();
        assert.strictEqual(items[0].rowType, 'data');
        assert.strictEqual(items[0].key, 0);
        assert.strictEqual(items[1].rowType, 'detail');
        assert.strictEqual(items[1].key, 0);
        assert.ok(items[1].visible, 'visible master detail');

        // act
        this.dataController.changeRowExpand(0);

        // assert
        items = this.dataController.items();
        assert.strictEqual(items[0].rowType, 'data');
        assert.strictEqual(items[0].key, 0);
        assert.strictEqual(items[1].rowType, 'detail');
        assert.strictEqual(items[1].key, 0);
        assert.ok(!items[1].visible, 'visible master detail');

        let callChanged = false;

        this.dataController.changed.add(function(change) {
            callChanged = true;

            // assert
            assert.ok(change.items[1].visible, 'visible master detail');
            assert.ok(!Object.prototype.hasOwnProperty.call(change.items[1], 'rowType'), 'not have property rowType');
            assert.ok(!Object.prototype.hasOwnProperty.call(change.items[1], 'key'), 'not have property key');
        });

        // act
        this.dataController.changeRowExpand(0);

        assert.ok(callChanged, 'call changed');
    });

    QUnit.test('Remove invisible expanded items after change pageIndex', function(assert) {
    // arrange
        this.setupDataGrid();

        // act
        this.dataController.changeRowExpand(0);
        this.dataController.changeRowExpand(0);

        // assert
        let items = this.dataController.items();
        assert.strictEqual(items[0].rowType, 'data');
        assert.strictEqual(items[0].key, 0);
        assert.strictEqual(items[1].rowType, 'detail');
        assert.strictEqual(items[1].key, 0);
        assert.strictEqual(items[1].visible, false, 'visible master detail');

        // act
        this.dataController.pageIndex(1);
        this.dataController.pageIndex(0);

        // assert
        items = this.dataController.items();
        assert.strictEqual(items[0].rowType, 'data');
        assert.strictEqual(items[0].key, 0);
        assert.strictEqual(items[1].rowType, 'data');
        assert.strictEqual(items[1].key, 1);
        assert.strictEqual(items[1].visible, undefined, 'second data row is visible');
    });

    QUnit.test('SelectAll after expand and collapse row', function(assert) {
    // arrange
        this.setupDataGrid();
        this.dataController.changeRowExpand(0);
        this.dataController.changeRowExpand(0);

        // act
        this.selectAll();

        // assert
        const items = this.dataController.items();
        assert.strictEqual(items.length, 6, 'item count');
        assert.strictEqual(items[0].rowType, 'data');
        assert.ok(items[0].isSelected, 'first data row is selected');
        assert.strictEqual(items[0].key, 0);
        assert.strictEqual(items[1].rowType, 'detail');
        assert.strictEqual(items[1].key, 0);
        assert.strictEqual(items[1].visible, false, 'visible master detail');
        assert.ok(!items[1].isSelected, 'detail row is not selected');
        assert.ok(items[items.length - 1].isSelected, 'last row is selected');
    });
});

QUnit.module('Partial update', {
    beforeEach: function() {
        const that = this;
        that.setupModules = function() {
            setupModule.call(that);

            this._views.rowsView = { ...rowsViewMock };

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
}, () => {

    QUnit.test('update one row', function(assert) {
        this.setupModules();
        const dataSourceItems = this.dataController.dataSource().items();

        const oldItems = this.dataController.items().slice(0);
        let changedArgs;

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
        const items = this.dataController.items();

        assert.deepEqual(this.dataController.items()[0].values, ['Alex', 31]);
        assert.deepEqual(this.dataController.items()[0].data, { name: 'Alex', age: 31 });
        assert.notStrictEqual(oldItems[0], items[0]);
        assert.strictEqual(oldItems[1], items[1]);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.rowIndices, [0]);
        assert.deepEqual(changedArgs.changeTypes, ['update']);
        assert.deepEqual(changedArgs.items, [items[0]]);
    });

    QUnit.test('update several rows', function(assert) {
        this.setupModules();
        const dataSourceItems = this.dataController.dataSource().items();

        const oldItems = this.dataController.items().slice(0);
        let changedArgs;

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
        const items = this.dataController.items();

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

    QUnit.test('update with incorrect rowIndices', function(assert) {
        this.setupModules();
        const dataSourceItems = this.dataController.dataSource().items();

        const oldItems = this.dataController.items().slice(0);
        let changedArgs;

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
        const items = this.dataController.items();

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
    QUnit.test('insert item with editing of the first item', function(assert) {
        this.setupModules();
        const dataSourceItems = this.dataController.dataSource().items();
        let changedArgs;

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
        const items = this.dataController.items();

        assert.equal(items.length, 4);
        assert.deepEqual(items[0].values, ['Mike', 40]);
        assert.deepEqual(items[0].data, { name: 'Mike', age: 40 });
        assert.strictEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.rowIndices, [0, 1]);
        assert.deepEqual(changedArgs.changeTypes, ['insert', 'update']);
        assert.deepEqual(changedArgs.items, [items[0], items[1]]);
    });

    QUnit.test('insert one item', function(assert) {
        this.setupModules();
        const dataSourceItems = this.dataController.dataSource().items();

        const oldItems = this.dataController.items().slice(0);
        let changedArgs;

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
        const items = this.dataController.items();

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

    QUnit.test('update and insert', function(assert) {
        this.setupModules();
        const dataSourceItems = this.dataController.dataSource().items();

        const oldItems = this.dataController.items().slice(0);
        let changedArgs;

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
        const items = this.dataController.items();

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

    QUnit.test('update and insert when edit mode is form_T318702', function(assert) {
    // arrange
        this.options = {
            editing: {
                mode: 'form',
                allowUpdating: true,
                allowAdding: true
            }
        };

        this.setupModules();

        let changedArgs;
        this.dataController.changed.add(function(e) {
            changedArgs = e;
        });

        this.editingController.editRow(0);
        this.editingController.addRow();

        // assert
        const items = this.dataController.items();

        assert.equal(items[0].values[0], undefined, 'value 1');
        assert.equal(items[0].values[1], undefined, 'value 2');
        assert.equal(items[0].values[2], null, 'value 3');
        assert.equal(items[0].rowType, 'detail', 'row type');
        assert.deepEqual(changedArgs.changeType, 'update', 'changed args changeType');
        assert.deepEqual(changedArgs.changeTypes, ['insert', 'update'], 'changed args changeType');
        assert.deepEqual(changedArgs.rowIndices, [0, 1], 'changed args rowIndices');
    });

    QUnit.test('remove one item', function(assert) {
        this.setupModules();
        const dataSourceItems = this.dataController.dataSource().items();

        const oldItems = this.dataController.items().slice(0);
        let changedArgs;

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
        const items = this.dataController.items();

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

    QUnit.test('update and remove', function(assert) {
        this.setupModules();
        const dataSourceItems = this.dataController.dataSource().items();

        const oldItems = this.dataController.items().slice(0);
        let changedArgs;

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
        const items = this.dataController.items();

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
    QUnit.test('remove and update next row', function(assert) {
        this.setupModules();
        const dataSourceItems = this.dataController.dataSource().items();

        const oldItems = this.dataController.items().slice(0);
        let changedArgs;

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
        const items = this.dataController.items();

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

    QUnit.test('insert and remove', function(assert) {
        this.setupModules();
        const dataSourceItems = this.dataController.dataSource().items();

        const oldItems = this.dataController.items().slice(0);
        let changedArgs;

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
        const items = this.dataController.items();

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
});

QUnit.module('Refresh changesOnly', {
    beforeEach: function() {
        const that = this;
        that.setupModules = function(options) {
            setupModule.call(that);

            that.array = [
                { id: 1, name: 'Alex', age: 30 },
                { id: 2, name: 'Dan', age: 25 },
                { id: 3, name: 'Bob', age: 20 }
            ];
            that.dataSource = createDataSource(that.array, { key: 'id' }, options);
            that.dataController.setDataSource(that.dataSource);
            that.dataSource.load();
        };

        that.setValue = function(rowIndex, columnId, value) {
            const row = that.getVisibleRows()[rowIndex];
            this.editingController.updateFieldValue({
                row: row,
                key: row.key,
                data: row.data,
                column: this.columnOption(columnId)
            }, value, '', true);
        };

    }, afterEach: teardownModule
}, () => {

    QUnit.test('update one cell', function(assert) {
        this.setupModules();

        const oldItems = this.dataController.items().slice(0);
        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        // act
        this.array[0].age = 31;

        this.dataController.refresh(true);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items[0].values, [1, 'Alex', 31]);
        assert.notStrictEqual(oldItems[0], items[0]);
        assert.strictEqual(oldItems[1], items[1]);
        assert.strictEqual(changedArgs.repaintChangesOnly, true);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, ['update']);
        assert.deepEqual(changedArgs.rowIndices, [0]);
        assert.deepEqual(changedArgs.columnIndices, [[2]]);
        assert.deepEqual(changedArgs.items, [items[0]]);
    });

    QUnit.test('add one item', function(assert) {
        this.setupModules();

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        // act
        this.array.splice(1, 0, { id: 4, name: 'Vadim', age: 19 });

        this.dataController.refresh(true);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items[1].values, [4, 'Vadim', 19]);
        assert.strictEqual(changedArgs.repaintChangesOnly, true);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, ['insert']);
        assert.deepEqual(changedArgs.rowIndices, [1]);
        assert.deepEqual(changedArgs.columnIndices, [undefined]);
        assert.deepEqual(changedArgs.items, [items[1]]);
    });

    QUnit.test('add one item to end', function(assert) {
        this.setupModules();

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        // act
        this.array.push({ id: 4, name: 'Vadim', age: 19 });

        this.dataController.refresh(true);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items[3].values, [4, 'Vadim', 19]);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, ['insert']);
        assert.deepEqual(changedArgs.rowIndices, [3]);
        assert.deepEqual(changedArgs.columnIndices, [undefined]);
        assert.deepEqual(changedArgs.items, [items[3]]);
    });

    QUnit.test('remove one item', function(assert) {
        this.setupModules();

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        // act
        this.array.splice(1, 1);

        this.dataController.refresh(true);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items.length, 2);
        assert.strictEqual(changedArgs.repaintChangesOnly, true);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, ['remove']);
        assert.deepEqual(changedArgs.rowIndices, [1]);
        assert.deepEqual(changedArgs.columnIndices, [undefined]);
    });

    QUnit.test('remove two items', function(assert) {
        this.setupModules();

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        // act
        this.array.splice(1, 2);

        this.dataController.refresh(true);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items.length, 1);
        assert.strictEqual(changedArgs.repaintChangesOnly, true);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, ['remove', 'remove']);
        assert.deepEqual(changedArgs.rowIndices, [1, 1]);
        assert.deepEqual(changedArgs.columnIndices, [undefined, undefined]);
    });

    QUnit.test('add and remove item', function(assert) {
        this.setupModules();

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        // act
        this.array.unshift({ id: 4, name: 'Vadim', age: 19 });
        this.array.pop();

        this.dataController.refresh(true);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items[0].values, [4, 'Vadim', 19]);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, ['insert', 'remove']);
        assert.deepEqual(changedArgs.rowIndices, [0, 3]);
        assert.deepEqual(changedArgs.columnIndices, [undefined, undefined]);
        assert.deepEqual(changedArgs.items[0], items[0]);
    });

    QUnit.test('remove and add item', function(assert) {
        this.setupModules();

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        // act
        this.array.shift();
        this.array.push({ id: 4, name: 'Vadim', age: 19 });

        this.dataController.refresh(true);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items[2].values, [4, 'Vadim', 19]);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, ['remove', 'insert']);
        assert.deepEqual(changedArgs.rowIndices, [0, 2]);
        assert.deepEqual(changedArgs.columnIndices, [undefined, undefined]);
        assert.deepEqual(changedArgs.items[1], items[2]);
    });

    QUnit.test('add and change item', function(assert) {
        this.setupModules();

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        // act
        this.array.unshift({ id: 4, name: 'Vadim', age: 19 });
        this.array[1].age = 99;

        this.dataController.refresh(true);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items[0].values, [4, 'Vadim', 19]);
        assert.deepEqual(items[1].values, [1, 'Alex', 99]);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, ['insert', 'update']);
        assert.deepEqual(changedArgs.rowIndices, [0, 1]);
        assert.deepEqual(changedArgs.columnIndices, [undefined, [2]]);
        assert.deepEqual(changedArgs.items[0], items[0]);
    });

    QUnit.test('reorder items', function(assert) {
        this.setupModules();

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        // act
        const item = this.array.shift();
        this.array.push(item);

        this.dataController.refresh(true);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items[2].values, [1, 'Alex', 30]);
        assert.deepEqual(changedArgs.changeType, 'refresh', 'full refresh is occured');
        assert.strictEqual(changedArgs.repaintChangesOnly, true);
    });

    // T720721, T720597
    QUnit.test('grouping if repaintChangesOnly', function(assert) {
        this.options = {
            grouping: {
                autoExpandAll: true
            },
            repaintChangesOnly: true
        };

        this.setupModules();

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        // act
        this.columnOption('id', 'groupIndex', 0);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items.length, 6);
        assert.deepEqual(items[0].rowType, 'group');
        assert.deepEqual(changedArgs.changeType, 'refresh', 'full refresh is occured');
        assert.strictEqual(changedArgs.repaintChangesOnly, false);
    });

    // T721235
    QUnit.test('search if repaintChangesOnly', function(assert) {
        this.options = {
            repaintChangesOnly: true,
            searchPanel: {}
        };

        this.setupModules();

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        // act
        this.option('searchPanel.text', 'Bob');

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items.length, 1);
        assert.deepEqual(items[0].data.name, 'Bob');
        assert.deepEqual(changedArgs.changeType, 'refresh', 'full refresh is occured');
        assert.strictEqual(changedArgs.repaintChangesOnly, false);
    });

    QUnit.test('full refresh after partial', function(assert) {
        this.setupModules();

        let changedArgs;

        this.options.loadingTimeout = 0;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        // act
        this.array[0].age = 99;

        this.dataController.refresh(true);
        this.dataController.refresh();
        this.clock.tick(10);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items[0].values, [1, 'Alex', 99]);
        assert.deepEqual(changedArgs.changeType, 'refresh', 'full refresh is occured');
        assert.deepEqual(changedArgs.items, items);
    });

    QUnit.test('partial refresh after full', function(assert) {
        this.setupModules();

        let changedArgs;

        this.options.loadingTimeout = 0;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        // act
        this.array[0].age = 99;

        this.dataController.refresh();
        this.dataController.refresh(true);
        this.clock.tick(10);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items[0].values, [1, 'Alex', 99]);
        assert.deepEqual(changedArgs.changeType, 'update', 'partial refresh is occured');
        assert.deepEqual(changedArgs.items, [items[0]]);
    });

    QUnit.test('several partial refresh', function(assert) {
        this.setupModules();

        let changedArgs;

        this.options.loadingTimeout = 0;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        // act
        this.array[0].age = 99;

        this.dataController.refresh(true);
        this.dataController.refresh(true);
        this.clock.tick(10);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items[0].values, [1, 'Alex', 99]);
        assert.deepEqual(changedArgs.changeType, 'update', 'partial refresh is occured');
        assert.deepEqual(changedArgs.items, [items[0]]);
    });

    QUnit.test('edit row index should be corrected after insert', function(assert) {
        this.setupModules();

        // act
        this.editRow(1);
        this.array.unshift({ id: 4, name: 'Vadim', age: 19 });

        this.dataController.refresh(true);

        // assert
        assert.ok(this.editingController.isEditRow(2), 'edit row index is corrected');
    });

    QUnit.test('focused row index should be corrected after insert', function(assert) {
        this.setupModules();

        // act
        this.keyboardNavigationController._focusedCellPosition = { rowIndex: 0, columnIndex: 1 };
        this.array.unshift({ id: 4, name: 'Vadim', age: 19 });

        this.dataController.refresh(true);

        // assert
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { rowIndex: 1, columnIndex: 1 }, 'focused row index is corrected');
    });

    QUnit.test('edit row index should not be corrected after insert at end', function(assert) {
        this.setupModules();

        // act
        this.editRow(1);
        this.array.push({ id: 4, name: 'Vadim', age: 19 });

        this.dataController.refresh(true);

        // assert
        assert.ok(this.editingController.isEditRow(1), 'edit row index is corrected');
    });

    QUnit.test('edit row should be updated on data change', function(assert) {
        this.setupModules();

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        // act
        this.editRow(0);
        this.array[0].age = 99;
        this.array[1].age = 99;

        this.dataController.refresh(true);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items[0].values, [1, 'Alex', 99]);
        assert.deepEqual(items[1].values, [2, 'Dan', 99]);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, ['update', 'update']);
        assert.deepEqual(changedArgs.rowIndices, [0, 1]);
        assert.deepEqual(changedArgs.items, [items[0], items[1]]);
        assert.deepEqual(changedArgs.columnIndices, [[2], [2]], 'only second row cell is updated');
    });

    // T702112
    QUnit.test('edit row should be updated on cancel', function(assert) {
        this.setupModules();

        $.extend(this.options.editing, { mode: 'row' });

        this.options.repaintChangesOnly = true;

        this.editRow(0);

        let changedArgs;
        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        // act
        this.cancelEditData();

        // assert
        const items = this.dataController.items();
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, ['update', 'update']);
        assert.deepEqual(changedArgs.rowIndices, [0, 1]);
        assert.deepEqual(changedArgs.items, [items[0], items[1]]);
        assert.deepEqual(changedArgs.columnIndices, [undefined, []], 'first row is updated fully');
    });

    QUnit.test('edit form row should not be updated on data change', function(assert) {
        this.setupModules();

        let changedArgs;

        $.extend(this.options.editing, { mode: 'form' });

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        // act
        this.editRow(0);
        this.array[0].age = 99;
        this.array[1].age = 99;

        this.dataController.refresh(true);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items[0].values, [1, 'Alex', 99]);
        assert.deepEqual(items[1].values, [2, 'Dan', 99]);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, ['update', 'update']);
        assert.deepEqual(changedArgs.rowIndices, [0, 1]);
        assert.deepEqual(changedArgs.items, [items[0], items[1]]);
        assert.deepEqual(changedArgs.columnIndices, [[], [2]], 'only second row cell is updated');
    });

    QUnit.test('edit cell should not be updated on data change', function(assert) {
        this.setupModules();

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        $.extend(this.options.editing, { mode: 'cell' });
        this.editCell(0, 1);

        // act
        this.array[0].name = 'Mike';
        this.array[0].age = 99;

        this.dataController.refresh(true);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items[0].values, [1, 'Mike', 99]);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, ['update']);
        assert.deepEqual(changedArgs.rowIndices, [0]);
        assert.deepEqual(changedArgs.columnIndices, [[2]], 'only last column is updated');
    });

    // T710380
    QUnit.test('command column cell should not be updated after cell value change if setCellValue is defined', function(assert) {
        this.setupModules();

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        this.columnOption('age', {
            setCellValue: function(data, value) {
                data.age = value;
            }
        });

        this.options.repaintChangesOnly = true;
        $.extend(this.options.editing, { mode: 'row', allowUpdating: true });
        this.editRow(0);

        // act
        this.setValue(0, 'age', 99);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(this.getVisibleColumns()[3].type, 'buttons', 'last column type is buttons');
        assert.deepEqual(items[0].values, [1, 'Alex', 99, null]);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, ['update']);
        assert.deepEqual(changedArgs.rowIndices, [0]);
        assert.deepEqual(changedArgs.columnIndices, [[2]], 'only age column is updated');
    });

    QUnit.test('change dataSource item field', function(assert) {
        this.setupModules();

        this.options.repaintChangesOnly = true;
        const oldItems = this.dataController.items().slice();

        // act
        this.array[1].age = 99;

        this.dataController.optionChanged({ name: 'dataSource', fullName: 'dataSource', previousValue: this.array, value: this.array });

        // assert
        const items = this.dataController.items().slice();
        assert.equal(oldItems[0], items[0], 'first item is not changed');
        assert.notEqual(oldItems[1], items[1], 'second item is changed');
    });

    QUnit.test('immutable change dataSource item field', function(assert) {
        this.setupModules();

        this.options.columns = ['id', 'name'];
        this.options.repaintChangesOnly = true;
        const oldItems = this.dataController.items().slice();

        // act
        const changedArray = this.array.slice();
        changedArray[1] = $.extend({}, changedArray[1], { age: 99 });

        this.dataController.optionChanged({ name: 'dataSource', fullName: 'dataSource', previousValue: this.array, value: changedArray });

        // assert
        const items = this.dataController.items();
        assert.equal(oldItems[0], items[0], 'first item is not changed');
        assert.notEqual(oldItems[1], items[1], 'second item is changed');
        assert.equal(items[1].data, changedArray[1], 'second item data is changed');
    });

    QUnit.test('change dataSource to another type', function(assert) {
        this.setupModules();

        this.options.repaintChangesOnly = true;

        // act

        this.option('dataSource', createDataSource(this.array.slice(1), { key: 'id' }));

        // assert
        const items = this.dataController.items();
        assert.equal(items.length, this.array.length - 1, 'item count');
    });


    QUnit.test('update one cell using push', function(assert) {
        this.setupModules({ pushAggregationTimeout: 0 });

        const oldItems = this.dataController.items().slice(0);
        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        this.options.repaintChangesOnly = true;

        // act
        this.dataSource.store().push([{ type: 'update', key: 1, data: { age: 31 } }]);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items[0].values, [1, 'Alex', 31]);
        assert.notStrictEqual(oldItems[0], items[0]);
        assert.strictEqual(oldItems[1], items[1]);
        assert.strictEqual(changedArgs.repaintChangesOnly, true);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, ['update']);
        assert.deepEqual(changedArgs.rowIndices, [0]);
        assert.deepEqual(changedArgs.columnIndices, [[2]]);
        assert.deepEqual(changedArgs.items, [items[0]]);
    });

    QUnit.test('insert one row with index using push', function(assert) {
        this.setupModules({ pushAggregationTimeout: 0 });

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        this.options.repaintChangesOnly = true;

        // act
        this.dataSource.store().push([{ type: 'insert', index: 0, data: { id: 999, name: 'Test', age: 99 } }]);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items.length, 4);
        assert.deepEqual(items[0].values, [999, 'Test', 99]);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, ['insert']);
        assert.deepEqual(changedArgs.rowIndices, [0]);
        assert.deepEqual(changedArgs.items, [items[0]]);
    });

    QUnit.test('insert one row with index using push if previous row is expanded', function(assert) {
        this.setupModules({ pushAggregationTimeout: 0 });

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        this.options.repaintChangesOnly = true;

        this.expandRow(1);

        // act
        this.dataSource.store().push([{ type: 'insert', index: 2, data: { id: 999, name: 'Test', age: 99 } }]);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items.length, 5);
        assert.deepEqual(items[2].values, [999, 'Test', 99]);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, ['insert']);
        assert.deepEqual(changedArgs.rowIndices, [2]);
        assert.deepEqual(changedArgs.items, [items[2]]);
    });

    QUnit.test('insert one row without index using push', function(assert) {
        this.setupModules({ pushAggregationTimeout: 0 });

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        this.options.repaintChangesOnly = true;

        // act
        this.dataSource.store().push([{ type: 'insert', data: { id: 999, name: 'Test', age: 99 } }]);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items.length, 3);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, [], 'item is not inserted');
        assert.deepEqual(changedArgs.rowIndices, []);
    });

    // T709020
    QUnit.test('insert one row without index using push if paging is disabled', function(assert) {
        this.setupModules({ pushAggregationTimeout: 0, paginate: false });

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        this.options.repaintChangesOnly = true;

        // act
        this.dataSource.store().push([{ type: 'insert', data: { id: 999, name: 'Test', age: 99 } }]);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items.length, 4);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, ['insert'], 'item is inserted');
        assert.deepEqual(changedArgs.rowIndices, [3], 'item is inserted to end');
    });

    QUnit.test('remove one row using push', function(assert) {
        this.setupModules({ pushAggregationTimeout: 0 });

        this.options.repaintChangesOnly = true;

        // act
        this.dataSource.store().push([{ type: 'remove', key: 1 }]);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items.length, 2);
    });

    QUnit.test('update one cell using push with reshapeOnPush', function(assert) {
        this.options = {
            columns: [{ dataField: 'age', dataType: 'number' }]
        };

        this.setupModules({
            reshapeOnPush: true,
            pushAggregationTimeout: 1,
            filter: ['age', '>=', 18]
        });

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        this.options.repaintChangesOnly = true;

        // act
        this.dataSource.store().push([{ type: 'update', key: 1, data: { age: 15 } }]);
        this.clock.tick(1);

        // assert
        const items = this.dataController.items();
        assert.strictEqual(items.length, 2);
        assert.strictEqual(changedArgs.repaintChangesOnly, true);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, ['remove']);
        assert.deepEqual(changedArgs.rowIndices, [0]);
        assert.deepEqual(changedArgs.columnIndices, [undefined]);
    });

    QUnit.test('column hiding', function(assert) {
        this.setupModules({ reshapeOnPush: true, filter: ['age', '>=', 18] });

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        this.options.repaintChangesOnly = true;

        // act
        this.columnOption('age', 'visible', false);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items[0].values, [1, 'Alex']);
        assert.strictEqual(changedArgs.changeType, 'refresh');
        assert.strictEqual(changedArgs.repaintChangesOnly, false, 'full repaint');
    });

    QUnit.test('update one cell when summary values are changed', function(assert) {
        this.options = {
            summary: {
                totalItems: [{
                    column: 'age',
                    summaryType: 'max'
                }]
            }
        };
        this.setupModules();

        let changedArgs;

        this.dataController.changed.add(function(args) {
            changedArgs = args;
        });

        // act
        this.array[0].age = 31;

        this.dataController.refresh(true);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(items[0].values, [1, 'Alex', 31]);
        assert.strictEqual(changedArgs.repaintChangesOnly, true);
        assert.deepEqual(changedArgs.changeType, 'update');
        assert.deepEqual(changedArgs.changeTypes, ['update']);
        assert.deepEqual(changedArgs.rowIndices, [0]);
        assert.deepEqual(changedArgs.columnIndices, [[2]]);
        assert.deepEqual(changedArgs.totalColumnIndices, [2]);
        assert.strictEqual(this.dataController.footerItems()[0].summaryCells[2][0].value, 31, 'summaryValue is updated');
    });
});

QUnit.module('Using DataSource instance', {
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
            $.extend(true, this.options, options);
            this.columnsController.init();
        };

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
}, () => {


    QUnit.test('change filter', function(assert) {
        this.setupDataGridModules({
            dataSource: this.dataSource,
            searchPanel: {
                text: '3'
            }
        });

        this.clock.tick(10);

        // assert
        assert.ok(!this.dataSource.filter(), 'no filter');
        assert.equal(this.dataController.itemsCount(), 3);
        assert.equal(this.dataController.totalCount(), 3);

        // act
        this.dataSource.filter(['field1', '=', 2]);
        this.dataSource.load();
        this.clock.tick(10);

        // assert
        const filter = this.dataSource.filter();
        assert.deepEqual(this.dataSource.filter(), [filter[0], '=', 2], 'changed filter');
        assert.equal(this.dataController.items()[0].data.field3, 6);
        assert.equal(this.dataController.itemsCount(), 2);
        assert.equal(this.dataController.totalCount(), 2);
    });

    QUnit.test('change group', function(assert) {
        const changes = [];

        this.setupDataGridModules({
            dataSource: this.dataSource,
            grouping: {
                autoExpandAll: true
            }
        });

        this.clock.tick(10);

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
        this.clock.tick(10);

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

    QUnit.test('change sort', function(assert) {
        const changes = [];

        this.setupDataGridModules({
            dataSource: this.dataSource
        });

        this.clock.tick(10);

        this.dataController.changed.add(function() {
            changes.push('data');
        });

        this.columnsController.columnsChanged.add(function(e) {
            changes.push('columns');
        });

        // act
        this.dataSource.sort({ selector: 'field3', desc: true });
        this.dataSource.load();
        this.clock.tick(10);

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

    QUnit.test('change pageIndex', function(assert) {
        this.dataSource.pageSize(3);

        this.setupDataGridModules({
            dataSource: this.dataSource
        });

        this.clock.tick(10);

        // act
        this.dataSource.pageIndex(1);
        this.dataSource.load();
        this.clock.tick(10);

        // assert
        assert.equal(this.dataController.pageIndex(), 1);
        assert.equal(this.dataController.items()[0].data.field3, 6);
    });

    QUnit.test('reload reset pageIndex in infinite scrolling mode', function(assert) {
        this.dataSource.pageSize(3);

        this.setupDataGridModules({
            dataSource: this.dataSource,
            scrolling: { mode: 'infinite' }
        });

        this.clock.tick(10);

        // assert
        assert.equal(this.dataController.totalItemsCount(), 3);
        assert.equal(this.dataController.items().length, 3);

        // act
        this.pageIndex(1);
        this.clock.tick(10);

        // assert
        assert.equal(this.dataController.totalItemsCount(), 5);
        assert.equal(this.dataController.items().length, 5);

        const spy = sinon.spy();
        this.dataSource.on('customizeStoreLoadOptions', spy);

        // act
        this.dataSource.reload(true);
        this.clock.tick(10);

        // assert
        assert.equal(this.dataController.totalItemsCount(), 3);
        assert.equal(this.dataController.items().length, 3);
        assert.equal(this.dataController.pageIndex(), 0);
        assert.equal(this.dataSource.pageIndex(), 0);
        assert.equal(spy.getCall(0).args[0].pageIndex, 0); // T646491
        assert.equal(spy.getCall(0).args[0].storeLoadOptions.pageIndex, 0);
    });

    QUnit.test('Grouping not reset after change option autoExpandAll', function(assert) {
        this.setupDataGridModules({
            dataSource: this.array,
            columns: [{ dataField: 'field1', groupIndex: 0 }, 'field2', 'field3'],
            grouping: { autoExpandAll: true }
        });

        this.clock.tick(10);

        assert.equal(this.columnsController.getGroupColumns().length, 1, 'grouped columns count');
        assert.deepEqual(this.dataController._dataSource.group(), [{ selector: 'field1', desc: false, isExpanded: true }], 'dataSource group when autoExpandAll true');

        // act
        this.option('grouping.autoExpandAll', false);

        this.clock.tick(10);

        // assert
        assert.equal(this.columnsController.getGroupColumns().length, 1, 'grouped columns count');
        assert.deepEqual(this.dataController._dataSource.group(), [{ selector: 'field1', desc: false, isExpanded: false }], 'dataSource group when autoExpandAll false');
        assert.equal(this.dataController.totalItemsCount(), 2);
        assert.equal(this.dataController.items().length, 2);
    });

    // T231490
    QUnit.test('assign loaded dataSource', function(assert) {
        this.dataSource = new DataSource({
            store: this.array,
            pageSize: 3
        });

        this.dataSource.load();

        this.setupDataGridModules({
            dataSource: this.dataSource
        });

        this.clock.tick(10);

        // assert
        assert.equal(this.dataController.items().length, 3, 'items count');
        assert.equal(this.dataController.totalCount(), 5, 'total count');
        assert.equal(this.dataController.pageCount(), 2, 'page count');
    });

    // T752955
    QUnit.test('There are no exceptions when disposing of the shared dataSource', function(assert) {
    // arrange
        this.setupDataGridModules({
            dataSource: this.dataSource
        });

        this.clock.tick(10);

        try {
        // act
            this.dataSource.dispose();
            this.dataController.dataSource().dispose(true);

            // assert
            assert.ok(true, 'No exception');
        } catch(e) {
        // assert
            assert.ok(false, 'exception');
        }
    });
});

QUnit.module('Exporting', {
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
            $.extend(true, this.options, options);
            this.columnsController.init();
        };

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
}, () => {

    QUnit.test('loadAll when no dataSource', function(assert) {
        let allItems;
        this.setupDataGridModules({});

        this.clock.tick(10);

        // act
        this.dataController.loadAll().done(function(items) {
            allItems = items;
        });

        this.clock.tick(10);

        // assert
        assert.deepEqual(this.dataController.items().length, 0, 'items count');

        assert.deepEqual(allItems, [], 'all items is empty array');
    });

    QUnit.test('loadAll when error on loading', function(assert) {
        const dataErrorOccurredArgs = [];
        let error;
        const changedArgs = [];
        this.setupDataGridModules({
            dataSource: {
                load: function() {
                    return $.Deferred().reject('Test Error');
                }
            }
        });

        this.clock.tick(10);

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

        this.clock.tick(10);

        // assert
        assert.deepEqual(this.dataController.items().length, 0, 'items count');
        assert.equal(error.message, 'Test Error', 'all items is empty array');
        assert.equal(dataErrorOccurredArgs[0].message, 'Test Error', 'all items is empty array');
        assert.equal(changedArgs.length, 1, 'changed call count');
        assert.equal(changedArgs[0].changeType, 'loadError', 'changeType');
        assert.equal(changedArgs[0].error.message, 'Test Error', 'error message');
    });


    QUnit.test('loadAll skip paging', function(assert) {
        let allItems;
        let changedCallCount = 0;

        this.setupDataGridModules({
            dataSource: this.array,
            paging: {
                pageSize: 3
            }
        });

        this.clock.tick(10);

        this.dataController.changed.add(function() {
            changedCallCount++;
        });

        // act
        this.dataController.loadAll().done(function(items) {
            allItems = items;
        });

        this.clock.tick(10);

        // assert
        assert.deepEqual(this.dataController.items().length, 3, 'items count');
        assert.deepEqual(this.dataController.pageSize(), 3, 'pageSize');
        assert.deepEqual(this.dataController.pageCount(), 2, 'pageCount');

        assert.deepEqual(changedCallCount, 0, 'changed call count');

        assert.deepEqual(allItems.length, 5, 'all items count');
        assert.deepEqual(allItems[0].rowType, 'data', 'item 0 rowType');
        assert.deepEqual(allItems[0].data, this.array[0], 'item 0 data');
        assert.deepEqual(allItems[0].values, [1, 2, 3], 'item 0 values');

        assert.deepEqual(allItems[3].rowType, 'data', 'item 3 rowType');
        assert.deepEqual(allItems[3].values, [2, 3, 6], 'item 3 values');
    });

    QUnit.test('loadAll grouping when remoteOperations disabled', function(assert) {
        let allItems;
        let changedCallCount = 0;

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

        this.clock.tick(10);

        this.dataController.changed.add(function() {
            changedCallCount++;
        });

        // act
        this.dataController.loadAll().done(function(items) {
            allItems = items;
        });

        this.clock.tick(10);

        // assert
        assert.deepEqual(this.dataController.items().length, 2, 'items count');
        assert.deepEqual(this.dataController.pageSize(), 3, 'pageSize');
        assert.deepEqual(this.dataController.pageCount(), 1, 'pageCount');

        assert.deepEqual(changedCallCount, 0, 'changed call count');

        assert.deepEqual(allItems.length, 7, 'all items count');
        assert.deepEqual(allItems[0].rowType, 'group', 'item 0 rowType');
        assert.deepEqual(allItems[0].data.key, 1, 'item 0 data key');
        assert.ok(allItems[0].data.items, 'item 0 data items defined');
        assert.deepEqual(allItems[0].data.items.length, 2, 'item 0 data items count');
        assert.deepEqual(allItems[0].values, [1], 'item 0 values');

        assert.deepEqual(allItems[1].rowType, 'data', 'item 1 rowType');
        assert.deepEqual(allItems[1].data, this.array[0], 'item 1 data');
        assert.deepEqual(allItems[1].values, [null, 2, 3], 'item 1 values');

        assert.deepEqual(allItems[3].rowType, 'group', 'item 3 rowType');
        assert.deepEqual(allItems[3].data.key, 2, 'item 3 data key');
        assert.ok(allItems[3].data.items, 'item 3 data items defined');
        assert.deepEqual(allItems[3].data.items.length, 3, 'item 3 data key');
        assert.deepEqual(allItems[3].values, [2], 'item 3 values');
    });

    QUnit.test('loadAll grouping when remote filtering/sorting/paging enabled', function(assert) {
        let allItems;
        let changedCallCount = 0;

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

        this.clock.tick(10);

        assert.deepEqual(this.dataController.pageCount(), 4, 'pageCount');


        this.dataController.changed.add(function() {
            changedCallCount++;
        });

        // act
        this.dataController.loadAll().done(function(items) {
            allItems = items;
        });

        this.clock.tick(10);

        // assert
        assert.deepEqual(this.dataController.items().length, 4, 'items count');
        assert.deepEqual(this.dataController.pageSize(), 3, 'pageSize');
        // T240474
        assert.deepEqual(this.dataController.pageCount(), 4, 'pageCount');

        assert.deepEqual(changedCallCount, 0, 'changed call count');

        assert.deepEqual(allItems.length, 12, 'all items count');
        assert.deepEqual(allItems[0].rowType, 'group', 'item 0 rowType');
        assert.deepEqual(allItems[0].data.key, 1, 'item 0 data key');
        assert.ok(allItems[0].data.items, 'item 0 data items defined');
        assert.deepEqual(allItems[0].data.items.length, 4, 'item 0 data items count');
        assert.deepEqual(allItems[0].values, [1], 'item 0 values');

        assert.deepEqual(allItems[1].rowType, 'data', 'item 1 rowType');
        assert.deepEqual(allItems[1].data, this.array[0], 'item 1 data');
        assert.deepEqual(allItems[1].values, [null, 2, 3], 'item 1 values');

        assert.deepEqual(allItems[5].rowType, 'group', 'item 5 rowType');
        assert.deepEqual(allItems[5].data.key, 2, 'item 5 data key');
        assert.ok(allItems[5].data.items, 'item 3 data items defined');
        assert.deepEqual(allItems[5].data.items.length, 6, 'item 5 items count');
        assert.deepEqual(allItems[5].values, [2], 'item 5 values');
    });

    QUnit.test('loadAll when remote summary enabled', function(assert) {
        let allItems;
        let allSummary;
        let changedCallCount = 0;

        const loadArgs = [];

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
                    column: 'field2',
                    summaryType: 'sum'
                }]
            },
            remoteOperations: true,
            paging: {
                pageSize: 3
            }
        });

        this.clock.tick(10);

        assert.deepEqual(this.dataController.pageCount(), 1, 'pageCount');


        this.dataController.changed.add(function() {
            changedCallCount++;
        });

        // act
        this.dataController.loadAll().done(function(items, summary) {
            allItems = items;
            allSummary = summary;
        });

        this.clock.tick(10);

        // assert
        assert.deepEqual(changedCallCount, 0, 'changed call count');
        assert.deepEqual(allItems.length, 2, 'all items count');
        assert.deepEqual(allSummary, [6], 'all summary');
        assert.deepEqual(loadArgs.length, 2, 'load count');
        assert.deepEqual(loadArgs[0].skip, 0, 'initial load skip');
        assert.deepEqual(loadArgs[0].take, 3, 'initial load take');
        assert.deepEqual(loadArgs[0].totalSummary, [{ selector: 'field2', summaryType: 'sum' }], 'initial load totalSummary');
        assert.deepEqual(loadArgs[0].groupSummary, undefined, 'initial load groupSummary is not defined');
        assert.deepEqual(loadArgs[1].skip, undefined, 'loadAll skip');
        assert.deepEqual(loadArgs[1].take, undefined, 'loadAll load take');
        assert.deepEqual(loadArgs[1].totalSummary, [{ selector: 'field2', summaryType: 'sum' }], 'loadAll totalSummary');
        assert.deepEqual(loadArgs[1].groupSummary, undefined, 'loadAll groupSummary is not defined');
    });

    // T324247
    QUnit.test('loadAll when remote grouping and summary enabled', function(assert) {
        let allItems;
        let allSummary;
        let changedCallCount = 0;

        const loadArgs = [];

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
                group: 'field1'
            },
            grouping: {
                autoExpandAll: false
            },
            summary: {
                groupItems: [{
                    column: 'field2',
                    summaryType: 'sum'
                }],
                totalItems: [{
                    column: 'field1',
                    summaryType: 'sum'
                }]
            },
            columns: ['field1', 'field2'],
            remoteOperations: true,
            paging: {
                pageSize: 3
            }
        });

        this.clock.tick(10);

        assert.deepEqual(this.dataController.pageCount(), 1, 'pageCount');


        this.dataController.changed.add(function() {
            changedCallCount++;
        });

        // act
        this.dataController.loadAll().done(function(items, summary) {
            allItems = items;
            allSummary = summary;
        });

        this.clock.tick(10);

        // assert
        assert.deepEqual(changedCallCount, 0, 'changed call count');
        assert.deepEqual(allItems.length, 4, 'all items count');
        assert.deepEqual(allItems[0].data, { key: 1, count: 1, items: [{ field1: 1, field2: 2 }], summary: [2] }, 'item 0');
        assert.deepEqual(allItems[1].data, { field1: 1, field2: 2 }, 'item 1');
        assert.deepEqual(allItems[2].data, { key: 3, count: 1, items: [{ field1: 3, field2: 4 }], summary: [4] }, 'item 2');
        assert.deepEqual(allItems[3].data, { field1: 3, field2: 4 }, 'item 3');
        assert.deepEqual(allSummary, [4], 'all summary exists');
        assert.deepEqual(loadArgs.length, 3, 'load count');
        assert.deepEqual(loadArgs[0].skip, undefined, 'initial load skip');
        assert.deepEqual(loadArgs[0].take, undefined, 'initial load take');
        assert.deepEqual(loadArgs[0].group, [{ selector: 'field1', isExpanded: false, desc: false }], 'initial load group');
        assert.deepEqual(loadArgs[0].totalSummary, [{ selector: 'field1', summaryType: 'sum' }], 'initial load totalSummary');
        assert.deepEqual(loadArgs[0].groupSummary, [{ selector: 'field2', summaryType: 'sum' }], 'initial load groupSummary');
        assert.deepEqual(loadArgs[1].skip, undefined, 'loadAll skip');
        assert.deepEqual(loadArgs[1].take, undefined, 'loadAll load take');
        assert.deepEqual(loadArgs[1].group, [{ selector: 'field1', isExpanded: false, desc: false }], 'loadAll load group');
        assert.deepEqual(loadArgs[1].totalSummary, [{ selector: 'field1', summaryType: 'sum' }], 'loadAll totalSummary');
        assert.deepEqual(loadArgs[1].groupSummary, [{ selector: 'field2', summaryType: 'sum' }], 'loadAll groupSummary');
        assert.deepEqual(loadArgs[2].skip, undefined, 'loadAll skip');
        assert.deepEqual(loadArgs[2].take, undefined, 'loadAll load take');
        assert.deepEqual(loadArgs[2].group, null, 'loadAll load group');
        assert.deepEqual(loadArgs[2].totalSummary, [{ selector: 'field1', summaryType: 'sum' }], 'loadAll totalSummary');
        assert.deepEqual(loadArgs[2].groupSummary, [{ selector: 'field2', summaryType: 'sum' }], 'loadAll groupSummary');
    });

    // T437259, T433659
    QUnit.test('loadAll by selected items when remote grouping and summary enabled', function(assert) {
        let allItems;
        let allSummary;
        let changedCallCount = 0;

        let loadArgs = [];

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
                group: 'field1'
            },
            grouping: {
                autoExpandAll: false
            },
            summary: {
                groupItems: [{
                    column: 'field2',
                    summaryType: 'sum'
                }],
                totalItems: [{
                    column: 'field1',
                    summaryType: 'sum'
                }]
            },
            columns: ['field1', 'field2'],
            remoteOperations: true,
            paging: {
                pageSize: 3
            }
        });

        this.clock.tick(10);

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

        this.clock.tick(10);

        // assert
        assert.deepEqual(loadArgs.length, 0, 'load count');
        assert.deepEqual(changedCallCount, 0, 'changed call count');
        assert.deepEqual(allItems.length, 2, 'all items count');
        assert.deepEqual(allItems[0].data, { key: 1, items: [{ field1: 1, field2: 2 }], aggregates: [2] }, 'item 0');
        assert.deepEqual(allItems[1].data, { field1: 1, field2: 2 }, 'item 1');
        assert.deepEqual(allSummary, [1], 'all summary exists');
        // T433659
        assert.deepEqual(this.dataController.getTotalSummaryValue('field1'), 4);
    });

    QUnit.test('Skip detail row when loadAll is applied', function(assert) {
        let allItems;

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

        this.clock.tick(10);

        // act
        this.dataController.expandRow(this.array[0]);

        this.dataController.loadAll().done(function(items) {
            allItems = items;
        });

        this.clock.tick(10);

        // assert
        assert.equal(this.dataController.items()[1].rowType, 'detail', 'detail row in original items');

        assert.deepEqual(allItems.length, 5, 'all items count');
        assert.deepEqual(allItems[0].rowType, 'data', 'item 0 rowType');
        assert.deepEqual(allItems[1].rowType, 'data', 'item 1 rowType');
        assert.deepEqual(allItems[2].rowType, 'data', 'item 2 rowType');
        assert.deepEqual(allItems[3].rowType, 'data', 'item 3 rowType');
        assert.deepEqual(allItems[4].rowType, 'data', 'item 4 rowType');
    });

    QUnit.test('LoadAll and modified values', function(assert) {
        let allItems;

        this.setupDataGridModules({
            dataSource: this.array,
            editing: {
                mode: 'batch'
            },
            paging: {
                pageSize: 3
            }
        });

        this.clock.tick(10);

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

        this.clock.tick(10);

        // assert
        assert.deepEqual(allItems.length, 5, 'all items count');
        assert.deepEqual(allItems[0].data, { field1: 13, field2: 2, field3: 3 }, 'item 0 data');
        assert.deepEqual(allItems[0].values, [13, 2, 3], 'item 0 values');
    });

    QUnit.test('LoadAll and filtering', function(assert) {
        let allItems;

        this.setupDataGridModules({
            dataSource: this.array,
            paging: {
                pageSize: 3
            },
            columns: ['field1', { dataField: 'field2', filterValue: 3 }, 'field3']
        });

        this.clock.tick(10);

        // act
        this.dataController.loadAll().done(function(items) {
            allItems = items;
        });

        this.clock.tick(10);

        // assert
        assert.deepEqual(allItems.length, 2, 'all items count');
        assert.deepEqual(allItems[0].data, this.array[3], 'item 0 data');
        assert.deepEqual(allItems[1].data, this.array[4], 'item 1 data');
    });

    QUnit.test('LoadAll and grouped field with dataType', function(assert) {
        let allItems;

        const array = [{ group: '1', id: 1 }, { group: '1', id: 2 }];
        this.setupDataGridModules({
            dataSource: array,
            columns: [{ dataField: 'group', dataType: 'number', groupIndex: 0 }, 'id']
        });

        this.clock.tick(10);

        // act
        this.dataController.loadAll().done(function(items) {
            allItems = items;
        });

        this.clock.tick(10);

        // assert
        assert.deepEqual(allItems.length, 3, 'all items count');
        assert.deepEqual(allItems[0].key, [1], 'group row key');
        assert.deepEqual(allItems[0].data, { key: 1, items: array }, 'group row data');
    });

    QUnit.test('loadAll during data loading', function(assert) {
        let isLoadAllFailed;

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

        this.clock.tick(10);

        // assert
        assert.ok(isLoadAllFailed, 'loadAll failed');
        assert.equal(this.dataController.items().length, 3, 'items count');
        assert.ok(!this.dataController.isLoading(), 'no loading');
    });

    // T713135
    QUnit.test('loadAll during custom loading', function(assert) {
        let allItems;

        this.setupDataGridModules({
            dataSource: this.array,
            paging: {
                pageSize: 3
            }
        });

        this.clock.tick(10);

        // act
        this.dataController.beginCustomLoading('test');
        this.dataController.loadAll().done(function(items) {
            allItems = items;
        });
        this.dataController.endCustomLoading();
        this.clock.tick(10);

        // assert
        assert.equal(allItems.length, 5, 'loaded all item count');
        assert.equal(this.dataController.items().length, 3, 'items count');
        assert.ok(!this.dataController.isLoading(), 'no loading');
    });

    QUnit.test('data loading during loadAll', function(assert) {
        let isLoadAllFailed;
        let allItems;

        this.setupDataGridModules({
            dataSource: this.array,
            paging: {
                pageSize: 3
            },
            columns: ['field1', 'field2', 'field3']
        });

        this.clock.tick(10);


        // act
        this.dataController.loadAll().fail(function() {
            isLoadAllFailed = true;
        }).done(function(data) {
            allItems = data;
        });

        this.dataController.pageIndex(1);

        this.clock.tick(10);

        // assert
        assert.ok(!isLoadAllFailed, 'loadAll is not failed');
        assert.equal(allItems.length, 5, 'items count');
        assert.equal(this.dataController.pageIndex(), 1, 'pageIndex');
        assert.equal(this.dataController.items().length, 2, 'items count');
        assert.deepEqual(this.dataController.items()[0].data, this.array[3], 'item 0 data from second page');
        assert.ok(!this.dataController.isLoading(), 'no loading');
    });

    QUnit.test('LoadAll when scrolling mode is virtual', function(assert) {
        let allItems;

        this.setupDataGridModules({
            dataSource: this.array,
            scrolling: {
                mode: 'virtual'
            },
            paging: {
                pageSize: 3
            }
        });

        this.clock.tick(10);

        // act
        this.dataController.loadAll().done(function(items) {
            allItems = items;
        });

        this.clock.tick(10);

        // assert
        assert.deepEqual(allItems.length, 5, 'all items count');
        assert.deepEqual(allItems[0].data, { field1: 1, field2: 2, field3: 3 }, 'item 0 data');
        assert.deepEqual(allItems[0].values, [1, 2, 3], 'item 0 values');
    });

    QUnit.test('Load ALL with data parameter', function(assert) {
        let allItems;
        let changedCallCount = 0;

        this.setupDataGridModules({
            dataSource: this.array,
            paging: {
                pageSize: 3
            }
        });

        this.clock.tick(10);

        this.dataController.changed.add(function() {
            changedCallCount++;
        });

        // act
        this.dataController.loadAll([this.array[1], this.array[3]]).done(function(items) {
            allItems = items;
        });

        this.clock.tick(10);

        // assert
        assert.deepEqual(this.dataController.items().length, 3, 'items count');
        assert.deepEqual(this.dataController.pageSize(), 3, 'pageSize');
        assert.deepEqual(this.dataController.pageCount(), 2, 'pageCount');

        assert.deepEqual(changedCallCount, 0, 'changed call count');

        assert.deepEqual(allItems.length, 2, 'all items count');
        assert.deepEqual(allItems[0].rowType, 'data', 'item 0 rowType');
        assert.deepEqual(allItems[0].data, this.array[1], 'item 0 data');
        assert.deepEqual(allItems[0].values, [1, 2, 4], 'item 0 values');

        assert.deepEqual(allItems[1].rowType, 'data', 'item 1 rowType');
        assert.deepEqual(allItems[1].data, this.array[3], 'item 1 rowType');
        assert.deepEqual(allItems[1].values, [2, 3, 6], 'item 1 values');
    });

    QUnit.test('loadAll with data parameter and grouping', function(assert) {
        let allItems;
        let changedCallCount = 0;

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

        this.clock.tick(10);

        this.dataController.changed.add(function() {
            changedCallCount++;
        });

        // act
        this.dataController.loadAll([this.array[0], this.array[3], this.array[4]]).done(function(items) {
            allItems = items;
        });

        this.clock.tick(10);

        // assert
        assert.deepEqual(this.dataController.items().length, 2, 'items count');
        assert.deepEqual(this.dataController.pageSize(), 3, 'pageSize');
        assert.deepEqual(this.dataController.pageCount(), 1, 'pageCount');

        assert.deepEqual(changedCallCount, 0, 'changed call count');

        assert.deepEqual(allItems.length, 5, 'all items count');

        assert.deepEqual(allItems[0].rowType, 'group', 'rowType');
        assert.deepEqual(allItems[0].data.key, 1, 'data key');
        assert.ok(allItems[0].data.items, 'data items');
        assert.deepEqual(allItems[0].data.items.length, 1, 'data items count');
        assert.deepEqual(allItems[0].values, [1], 'values');

        assert.deepEqual(allItems[1].rowType, 'data', 'rowType');
        assert.deepEqual(allItems[1].data, this.array[0], 'data');
        assert.deepEqual(allItems[1].values, [null, 2, 3], 'values');

        assert.deepEqual(allItems[2].rowType, 'group', 'rowType');
        assert.deepEqual(allItems[2].data.key, 2, 'data key');
        assert.ok(allItems[2].data.items, 'data items');
        assert.deepEqual(allItems[2].data.items.length, 2, 'data items count');
        assert.deepEqual(allItems[2].values, [2], 'values');

        assert.deepEqual(allItems[3].rowType, 'data', 'rowType');
        assert.deepEqual(allItems[3].data, this.array[3], 'data');
        assert.deepEqual(allItems[3].values, [null, 3, 6], 'values');

        assert.deepEqual(allItems[4].rowType, 'data', 'rowType');
        assert.deepEqual(allItems[4].data, this.array[4], 'data');
        assert.deepEqual(allItems[4].values, [null, 3, 7], 'values');
    });

    // T595243
    QUnit.test('loadAll with data parameter and filtering', function(assert) {
        let allItems;

        this.setupDataGridModules({
            dataSource: this.array,
            columns: [{ dataField: 'field1', filterValues: [2] }, 'field2', 'field3']
        });

        this.clock.tick(10);

        // act
        this.dataController.loadAll([this.array[1], this.array[2], this.array[3]]).done(function(items) {
            allItems = items;
        });

        this.clock.tick(10);

        // assert
        assert.equal(allItems.length, 2, 'two items are loaded');
        assert.equal(allItems[0].data, this.array[2], 'item 0');
        assert.equal(allItems[1].data, this.array[3], 'item 1');
    });

    QUnit.test('LoadAll with data parameter and modified values', function(assert) {
        let allItems;

        this.setupDataGridModules({
            dataSource: this.array,
            editing: {
                mode: 'batch'
            },
            paging: {
                pageSize: 3
            }
        });

        this.clock.tick(10);

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

        this.clock.tick(10);

        // assert
        assert.deepEqual(allItems.length, 2, 'all items count');
        assert.deepEqual(allItems[0].data, { field1: 13, field2: 2, field3: 3 }, 'item 0 data');
        assert.deepEqual(allItems[0].values, [13, 2, 3], 'item 0 values');
        assert.deepEqual(allItems[1].data, { field1: 1, field2: 2, field3: 4 }, 'item 0 data');
        assert.deepEqual(allItems[1].values, [1, 2, 4], 'item 1 values');
    });
});

QUnit.module('Sorting', { beforeEach: setupModule, afterEach: teardownModule }, function() {
    // T848348
    QUnit.test('Sorting should work when columns have a calculateSortValue with the same instance', function(assert) {
        // arrange
        const dataSource = createDataSource([
            { name: 'Alex', age: 19 },
            { name: 'Dan', age: 15 }
        ]);

        this.dataController.setDataSource(dataSource);
        dataSource.load();

        const calculateSortValue = function(data) { return data[this.dataField]; };

        this.applyOptions({
            columns: [
                { dataField: 'name', calculateSortValue: calculateSortValue },
                { dataField: 'age', calculateSortValue: calculateSortValue }
            ],
            commonColumnSettings: { allowSorting: true },
            sorting: { mode: 'single' }
        });

        // act
        this.columnsController.changeSortOrder(0, 'asc');

        // assert
        let rows = this.getVisibleRows();
        assert.deepEqual(rows[0].data, { name: 'Alex', age: 19 }, 'first row');
        assert.deepEqual(rows[1].data, { name: 'Dan', age: 15 }, 'second row');

        // act
        this.columnsController.changeSortOrder(1, 'asc');

        // assert
        rows = this.getVisibleRows();
        assert.deepEqual(rows[0].data, { name: 'Dan', age: 15 }, 'first row');
        assert.deepEqual(rows[1].data, { name: 'Alex', age: 19 }, 'second row');
    });
});

QUnit.module('onOptionChanged', {
    beforeEach: function() {
        this.array = [
            { field1: 1, field2: 'test1' },
            { field1: 2, field2: 'test2' },
            { field1: 3, field2: 'test3' },
            { field1: 4, field2: 'test4' },
            { field1: 5, field2: 'test5' },
            { field1: 6, field2: 'test6' }
        ];
        this.options = {
            dataSource: this.array,
            paging: { enabled: true, pageSize: 2 }
        };
        setupModule.apply(this);
        sinon.spy(this, 'option');
    },
    afterEach: function() {
        teardownModule.apply(this);
        this.option.restore();
    }
}, function() {
    QUnit.test('Event should be fired when changing the pageSize', function(assert) {
        // arrange
        const that = this;

        // act
        that.dataController.pageSize(4).done(function() {
            // assert
            assert.ok(that.option.withArgs('paging.pageSize', 4).calledOnce, 'onOptionChanged args');
        });
    });

    QUnit.test('Event should be fired when changing the pageIndex', function(assert) {
        // arrange
        const that = this;

        // act
        that.dataController.pageIndex(1).done(function(items) {
            // assert
            assert.deepEqual(items, [{ field1: 3, field2: 'test3' }, { field1: 4, field2: 'test4' }], 'items of second page');
            assert.ok(that.option.withArgs('paging.pageIndex', 1).calledOnce, 'onOptionChanged args');
        });
    });

    QUnit.test('Checking pageSize of the dataSource when optionChanged is fired', function(assert) {
        // arrange
        let pageSize;
        const that = this;

        that.option.restore();
        sinon.stub(that, 'option').callsFake(function(optionName, value) {
            if(optionName === 'paging.pageSize' && value === 3) {
                pageSize = that.dataController.dataSource().pageSize();
            }
            if(optionName === 'editing.changes') {
                return that.options.editing.changes;
            }
        });

        // act
        that.dataController.pageSize(3).done(function() {
            // assert
            assert.strictEqual(pageSize, 3, 'pageSize');
        });
    });
});
