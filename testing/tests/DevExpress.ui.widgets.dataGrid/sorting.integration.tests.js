import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';
import $ from 'jquery';

QUnit.testStart(function() {
    const markup = `
        <div id="container">
            <div id="dataGrid"></div>
        </div>
    `;

    $('#qunit-fixture').html(markup);
});


QUnit.module('Initialization', baseModuleConfig, () => {
    QUnit.test('Only one column should be sorted after ungrouping when sorting.mode is \'single\' (T933738)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1, name: 'test' }],
            columns: ['id', 'name'],
            loadingTimeout: undefined,
            sorting: {
                mode: 'single'
            }
        });

        // act
        const $idHeaderElement = $(dataGrid.element()).find('.dx-header-row td').eq(0);
        $idHeaderElement.trigger('dxclick');
        this.clock.tick();

        let sortedColumns = dataGrid.getVisibleColumns().filter(col => col.sortIndex >= 0);

        // assert
        assert.equal(sortedColumns.length, 1, 'only one sorted column before grouping');
        assert.strictEqual(sortedColumns[0].dataField, 'id', '\'id\' column is sorted before grouping');
        assert.strictEqual(sortedColumns[0].sortOrder, 'asc', 'sortOrder before grouping');

        // act
        dataGrid.columnOption('id', 'groupIndex', 0);
        this.clock.tick();

        sortedColumns = dataGrid.getVisibleColumns().filter(col => col.sortIndex >= 0);

        // assert
        assert.equal(sortedColumns.length, 1, 'only one sorted column after grouping');
        assert.strictEqual(sortedColumns[0].dataField, 'id', '\'id\' column is sorted after grouping');
        assert.strictEqual(sortedColumns[0].sortOrder, 'asc', 'sortOrder after grouping');

        // act
        const $nameHeaderElement = $(dataGrid.element()).find('.dx-header-row td').eq(1);
        $nameHeaderElement.trigger('dxclick');
        this.clock.tick();

        sortedColumns = dataGrid.getVisibleColumns().filter(col => col.sortIndex >= 0);

        // assert
        assert.equal(sortedColumns.length, 1, 'only one sorted column after clicking the \'name\' column header');
        assert.strictEqual(sortedColumns[0].dataField, 'name', '\'name\' column is sorted after clicking the \'name\' column header');
        assert.strictEqual(sortedColumns[0].sortOrder, 'asc', 'sortOrder after clicking the \'name\' column header');

        // act
        dataGrid.columnOption('id', 'groupIndex', undefined);
        this.clock.tick();

        sortedColumns = dataGrid.getVisibleColumns().filter(col => col.sortIndex >= 0);

        // assert
        assert.equal(sortedColumns.length, 1, 'only one sorted column after ungrouping');
        assert.strictEqual(sortedColumns[0].dataField, 'name', '\'name\' column is sorted after ungrouping');
        assert.strictEqual(sortedColumns[0].sortOrder, 'asc', 'sortOrder after ungrouping');
    });

    QUnit.test('Apply sort/group dataSource options', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            commonColumnSettings: {
                autoExpandGroup: true
            },
            columns: ['field1', 'field2'],
            dataSource: {
                store: [{ field1: '1', field2: '2' }],
                group: 'field1',
                sort: 'field2'
            }
        }).dxDataGrid('instance');

        assert.deepEqual(dataGrid.getController('data')._dataSource.group(), [{ selector: 'field1', desc: false, isExpanded: true }]);
        assert.deepEqual(dataGrid.getController('data')._dataSource.sort(), [{ selector: 'field2', desc: false }]);
    });

    QUnit.skip('Change column sortOrder via option method with canceling in onOptionChanged handler', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [],
            columns: [{ dataField: 'column1', sortOrder: 'asc' }],
            onOptionChanged: function(args) {
                if(args.fullName === 'columns[0].sortOrder') {
                    dataGrid.option('columns[0].sortOrder', 'asc');
                }
            }
        }).dxDataGrid('instance');

        // act
        dataGrid.option('columns[0].sortOrder', 'desc');

        // assert
        assert.strictEqual(dataGrid.columnOption(0, 'sortOrder'), 'asc', 'sortOrder internal state');
        assert.strictEqual(dataGrid.option('columns[0].sortOrder'), 'asc', 'sortOrder option value');
    });

    // T734761
    QUnit.skip('Change column sortOrder via columnOption method with canceling in onOptionChanged handler', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [],
            columns: [{ dataField: 'column1', sortOrder: 'asc' }],
            onOptionChanged: function(args) {
                if(args.fullName === 'columns[0].sortOrder') {
                    dataGrid.option('columns[0].sortOrder', 'asc');
                }
            }
        }).dxDataGrid('instance');

        // act
        dataGrid.columnOption(0, 'sortOrder', 'desc');

        // assert
        assert.strictEqual(dataGrid.columnOption(0, 'sortOrder'), 'asc', 'sortOrder internal state');
        assert.strictEqual(dataGrid.option('columns[0].sortOrder'), 'asc', 'sortOrder option value');
    });

    // T859208
    QUnit.test('Sort indicators should not be rendered if grouping is applied and showWhenGrouped = true (single sorting)', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{}],
            sorting: {
                mode: 'single'
            },
            columns: [{
                dataField: 'field1'
            }, {
                dataField: 'field3',
                sortOrder: 'desc',
                showWhenGrouped: true
            }],
            groupPanel: {
                visible: true
            }
        }).dxDataGrid('instance');

        this.clock.tick();

        // act
        dataGrid.columnOption(1, 'groupIndex', 0);
        this.clock.tick();

        // assert
        const $dataGrid = $(dataGrid.$element());
        const $headers = $dataGrid.find('.dx-header-row > td');
        const $groupPanelItem = $dataGrid.find('.dx-group-panel-item');

        assert.notOk($headers.eq(2).find('.dx-sort').length, 'no element with dx-sort class');
        assert.notOk($headers.eq(2).find('.dx-sort-indicator').length, 'no element with dx-sort-indicator class');

        assert.ok($groupPanelItem.find('.dx-sort').length, 'group item sort indicator');
        assert.notOk($groupPanelItem.find('.dx-sort-indicator').length, 'no element with dx-sort-indicator class');
    });

    function groupingWithSortingTest(that, assert, sortIndexes) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{}],
            sorting: {
                mode: 'multiple'
            },
            columns: [{
                dataField: 'field1',
                sortOrder: 'desc',
                sortIndex: sortIndexes[0]
            }, {
                dataField: 'field3',
                sortOrder: 'desc',
                sortIndex: sortIndexes[1],
                showWhenGrouped: true
            }],
            groupPanel: {
                visible: true
            }
        }).dxDataGrid('instance');

        that.clock.tick();

        // act
        dataGrid.columnOption(1, 'groupIndex', 0);
        that.clock.tick();

        // assert
        const $dataGrid = $(dataGrid.$element());
        const $headers = $dataGrid.find('.dx-header-row > td');
        const $groupPanelItem = $dataGrid.find('.dx-group-panel-item');

        assert.notOk($headers.eq(2).find('.dx-sort').length, 'no element with dx-sort class');
        assert.notOk($headers.eq(2).find('.dx-sort-indicator').length, 'no element with dx-sort-indicator class');
        assert.notOk($headers.eq(2).find('.dx-sort-index-indicator').length, 'no element with dx-sort-index-indicator class');

        assert.ok($groupPanelItem.find('.dx-sort').length, 'group item sort indicator');
        assert.notOk($groupPanelItem.find('.dx-sort-indicator').length, 'no element with dx-sort-indicator class');
        assert.notOk($groupPanelItem.find('.dx-sort-index-indicator').length, 'no element with dx-sort-index-indicator class');

        assert.equal($headers.eq(1).find('.dx-sort-index-icon').text(), `${sortIndexes[0] + 1}`, 'has sort index icon');
        assert.notOk($headers.eq(2).find('.dx-sort-index-icon').length, 'no sort index icon');
        assert.notOk($groupPanelItem.find('.dx-sort-index-icon').length, 'no sort index icon');

        dataGrid.dispose();
    }

    // T859208
    QUnit.test('Sort indicators should not be rendered if grouping is applied and showWhenGrouped = true (multiple sorting)', function(assert) {
        groupingWithSortingTest(this, assert, [0, 1]);
        groupingWithSortingTest(this, assert, [1, 0]);
    });

    // T152307
    QUnit.test('no action cursor for column header when sorting and dragging not allowed', function(assert) {
        // act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columns: [{ dataField: 'field1', allowSorting: false }, { dataField: 'field2' }],
            dataSource: []
        });

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-drag-action').length, 0, 'no drag actions');
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-action').length, 1, 'one action');
        assert.ok($(dataGrid.$element()).find('.dx-header-row > td').eq(1).hasClass('dx-datagrid-action'));

        // act
        dataGrid.showColumnChooser();

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-drag-action').length, 2, 'two drag actions for hiding columns');
    });
});


QUnit.module('Assign options', baseModuleConfig, () => {
    // T722785
    QUnit.test('columns change with changed column visibility if sorting is applied', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{}],
            columns: ['FirstName', {
                dataField: 'LastName',
                visible: false
            }]
        });

        this.clock.tick();

        dataGrid.columnOption('FirstName', 'sortOrder', 'asc');
        this.clock.tick();

        // act
        dataGrid.option({
            dataSource: [{}],
            columns: ['FirstName', {
                dataField: 'LastName',
                visible: true
            }]
        });
        this.clock.tick();

        // assert
        assert.equal(dataGrid.getVisibleColumns().length, 2, 'two visible columns');
        assert.equal(dataGrid.getVisibleColumns()[0].sortOrder, 'asc', 'sortOrder for first column');
        assert.equal($(dataGrid.element()).find('.dx-header-row .dx-sort-up').length, 1, 'one sort indicator is shown');
        assert.equal($(dataGrid.element()).find('.dx-header-row').children().length, 2, 'two header cells');
        assert.equal($(dataGrid.element()).find('.dx-data-row').children().length, 2, 'two data cells');
    });
});


QUnit.module('API methods', baseModuleConfig, () => {
    // T721368
    QUnit.test('Reset sorting and grouping state when lookup column exists and remote data is used', function(assert) {
        const createRemoteDataSource = function(data) {
            return {
                key: 'id',
                load: function() {
                    const d = $.Deferred();

                    setTimeout(function() {
                        d.resolve(data);
                    }, 0);

                    return d.promise();
                }
            };
        };

        const dataGrid = createDataGrid({
            columns: [{
                dataField: 'id',
                lookup: {
                    dataSource: createRemoteDataSource([{ id: 1, text: 'Test 1' }]),
                    valueExpr: 'id',
                    displayExpr: 'text'
                }
            }, 'field1', 'field2'],
            dataSource: [{ id: 1 }]
        });

        // act
        this.clock.tick(0);

        dataGrid.columnOption('field1', 'sortOrder', 'asc');
        dataGrid.columnOption('field2', 'groupIndex', 0);

        this.clock.tick(0);

        dataGrid.state({});

        this.clock.tick(0);

        // assert
        assert.strictEqual(dataGrid.columnOption('field1', 'sortOrder'), undefined, 'sorting is reseted');
        assert.strictEqual(dataGrid.columnOption('field2', 'groupIndex'), undefined, 'grouping is reseted');
    });

    // T721368
    QUnit.test('Reset sorting and grouping state when lookup column and default grouping and sorting exist and remote data is used', function(assert) {
        const createRemoteDataSource = function(data) {
            return {
                key: 'id',
                load: function() {
                    const d = $.Deferred();

                    setTimeout(function() {
                        d.resolve(data);
                    }, 0);

                    return d.promise();
                }
            };
        };

        const dataGrid = createDataGrid({
            columns: [{
                dataField: 'id',
                lookup: {
                    dataSource: createRemoteDataSource([{ id: 1, text: 'Test 1' }]),
                    valueExpr: 'id',
                    displayExpr: 'text'
                },
                groupIndex: 0,
                sortOrder: 'asc'
            }, 'field1', 'field2'],
            dataSource: [{ id: 1 }]
        });

        // act
        this.clock.tick(0);

        dataGrid.columnOption('field1', 'sortOrder', 'asc');
        dataGrid.columnOption('field2', 'groupIndex', 1);
        this.clock.tick(0);

        // act
        dataGrid.state({});
        this.clock.tick(0);

        // assert
        assert.strictEqual(dataGrid.columnOption('id', 'sortOrder'), 'asc', 'sorting is reseted');
        assert.strictEqual(dataGrid.columnOption('id', 'groupIndex'), 0, 'grouping is reseted');

        assert.strictEqual(dataGrid.columnOption('field1', 'sortOrder'), undefined, 'sorting is reseted');
        assert.strictEqual(dataGrid.columnOption('field2', 'groupIndex'), undefined, 'grouping is reseted');
    });

    // T817555
    QUnit.test('State reset should save default grouping if sorting was applied', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1', groupIndex: 0 }, { dataField: 'field2', sortOrder: 'asc' }],
            dataSource: [{ field1: 'test1', field2: 'test2' }, { field1: 'test3', field2: 'test4' }]
        });

        this.clock.tick(0);

        // act
        dataGrid.state(null);
        this.clock.tick(0);

        // assert
        assert.equal(dataGrid.columnOption(0, 'groupIndex'), 0, 'groupIndex was not reset');
    });

    // T817555
    QUnit.test('State reset should return default grouping and sorting after their changes', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1', groupIndex: 0 }, { dataField: 'field2', sortOrder: 'asc' }],
            dataSource: [{ field1: 'test1', field2: 'test2' }, { field1: 'test3', field2: 'test4' }]
        });

        this.clock.tick(0);

        // act
        dataGrid.columnOption(0, 'groupIndex', undefined);
        dataGrid.columnOption(1, 'sortOrder', undefined);

        dataGrid.state(null);
        this.clock.tick(0);

        // assert
        assert.equal(dataGrid.columnOption(0, 'groupIndex'), 0, 'groupIndex was returned to default');
        assert.equal(dataGrid.columnOption(1, 'sortOrder'), 'asc', 'sortOrder was returned to default');
    });

    // T817555
    QUnit.test('State reset should return default grouping and sorting after multiple changes', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1', groupIndex: 0 }, { dataField: 'field2', sortOrder: 'asc' }],
            dataSource: [{ field1: 'test1', field2: 'test2' }, { field1: 'test3', field2: 'test4' }]
        });

        this.clock.tick(0);

        // act
        dataGrid.columnOption(0, 'groupIndex', undefined);
        dataGrid.columnOption(1, 'groupIndex', 0);

        dataGrid.columnOption(1, 'sortOrder', undefined);
        dataGrid.columnOption(0, 'sortOrder', 'asc');

        dataGrid.state(null);
        this.clock.tick(0);

        // assert
        assert.equal(dataGrid.columnOption(0, 'groupIndex'), 0, 'groupIndex was returned to default');
        assert.equal(dataGrid.columnOption(1, 'groupIndex'), undefined, 'groupIndex was returned to default');

        assert.equal(dataGrid.columnOption(0, 'sortOrder'), undefined, 'sortOrder was returned to default');
        assert.equal(dataGrid.columnOption(1, 'sortOrder'), 'asc', 'sortOrder was returned to default');
    });

    // T508818
    QUnit.test('Change sortOrder via columnOption when data is not loaded', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            dataSource: [{ a: 1 }, { a: 2 }],
            columns: ['a']
        });

        // act
        dataGrid.columnOption(0, 'sortOrder', 'desc');
        this.clock.tick();

        // assert
        assert.equal(dataGrid.cellValue(0, 0), 2, 'first row value');
        assert.equal(dataGrid.cellValue(1, 0), 1, 'second row value');
    });

    // T592655
    QUnit.test('Sorting should not throw an exception when headers are hidden', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            showColumnHeaders: false,
            dataSource: [{ field1: 1, field2: 2, field3: 3 }, { field1: 4, field2: 5, field3: 6 }]
        });

        this.clock.tick();

        try {
            // act
            dataGrid.columnOption('field2', 'sortOrder', 'desc');
            this.clock.tick();

            // assert
            assert.ok(true, 'no exceptions');
        } catch(e) {
            // assert
            assert.ok(false, 'exception');
        }
    });
});
