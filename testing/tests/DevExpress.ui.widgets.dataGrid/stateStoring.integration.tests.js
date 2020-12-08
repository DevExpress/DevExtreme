QUnit.testStart(function() {
    const gridMarkup = `
        <div id='container'>
            <div id="dataGrid"></div>
        </div>
    `;

    $('#qunit-fixture').html(gridMarkup);
});

import $ from 'jquery';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';


QUnit.module('State storing', baseModuleConfig, () => {
    // T240338
    QUnit.test('Loading columns state when all columns have width and one column is hidden', function(assert) {
        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1', width: 100 }, { dataField: 'field2', width: 100 }, { dataField: 'field3', width: 100 }],
            selection: {
                mode: 'multiple'
            },
            columnChooser: { enabled: true },
            dataSource: [],
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {
                        columns: [{ dataField: 'field1', visibleIndex: 0, visible: true, width: 100 }, { dataField: 'field2', visibleIndex: 1, visible: true, width: 100 }, { dataField: 'field3', visibleIndex: 2, visible: false, width: 100 }]
                    };
                }
            }

        });

        // assert
        assert.equal(dataGrid.getController('columns').getVisibleColumns().length, 0, 'visible column count');

        // act
        this.clock.tick();

        // assert
        const visibleColumns = dataGrid.getController('columns').getVisibleColumns();
        assert.equal(visibleColumns.length, 3, 'visible column count');
        assert.equal(visibleColumns[0].command, 'select', 'select column');
        assert.equal(visibleColumns[1].dataField, 'field1', 'field1 column');
        assert.equal(visibleColumns[2].dataField, 'field2', 'field2 column');
    });


    QUnit.test('Error row should be shown when state loading failed (T894590)', function(assert) {
        // arrange
        const errorText = 'test error';
        const contentReadyHandler = sinon.spy();
        const dataErrorOccurred = sinon.spy();
        const gridOptions = {
            dataSource: [{ id: 1 }],
            columns: ['id'],
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return $.Deferred().reject(errorText).promise();
                }
            },
            onContentReady: contentReadyHandler,
            onDataErrorOccurred: dataErrorOccurred
        };
        const dataGrid = createDataGrid(gridOptions);
        this.clock.tick();

        const $headerRow = $(dataGrid.element()).find('.dx-header-row');
        const $errorRow = $(dataGrid.element()).find('.dx-error-row');
        const renderedRowCount = dataGrid.getVisibleRows().length;

        // assert
        assert.ok(contentReadyHandler.called, 'onContentReady is called');
        assert.equal(dataErrorOccurred.callCount, 1, 'onDataErrorOccurred is called');
        assert.equal(dataErrorOccurred.getCall(0).args[0].error, errorText, 'error text is correct');
        assert.equal(renderedRowCount, 0, 'there are no rendered data rows');
        assert.ok($headerRow.length, 'header row is rendered');
        assert.ok($errorRow.length, 'error row is rendered');
        assert.equal($errorRow.find('.dx-error-message').text(), errorText, 'error text is correct');
    });

    QUnit.test('Error row should display the default error message when reject is called without a parameter in stateStoring.customLoad (T894590)', function(assert) {
        // arrange
        const gridOptions = {
            dataSource: [],
            columns: ['id'],
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return $.Deferred().reject().promise();
                }
            }
        };
        const dataGrid = createDataGrid(gridOptions);
        this.clock.tick();

        const $errorRow = $(dataGrid.element()).find('.dx-error-row');

        // assert
        assert.ok($errorRow.length, 'error row is rendered');
        assert.equal($errorRow.find('.dx-error-message').text(), 'Unknown error', 'default error message');
    });

    QUnit.test('Error row should not be displayed when reject is called in stateStoring.customLoad and errorRowEnabled === false (T894590)', function(assert) {
        // arrange
        const dataErrorOccurred = sinon.spy();
        const gridOptions = {
            dataSource: [],
            columns: ['id'],
            errorRowEnabled: false,
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return $.Deferred().reject().promise();
                }
            },
            onDataErrorOccurred: dataErrorOccurred
        };
        const dataGrid = createDataGrid(gridOptions);
        this.clock.tick();

        const $errorRow = $(dataGrid.element()).find('.dx-error-row');

        // assert
        assert.equal(dataErrorOccurred.callCount, 1, 'onDataErrorOccurred is called');
        assert.equal(dataErrorOccurred.getCall(0).args[0].error, 'Unknown error', 'default error message');
        assert.notOk($errorRow.length, 'error row is not rendered');
    });

    // T689294
    QUnit.test('onContentReady when there is no dataSource and stateStoring is enabled', function(assert) {
        // arrange
        let contentReadyCallCount = 0;

        // act
        createDataGrid({
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {};
                }
            },
            onContentReady: function() {
                contentReadyCallCount++;
            }
        });
        this.clock.tick();

        // assert
        assert.equal(contentReadyCallCount, 1);
    });

    QUnit.test('Clear state when initial options defined', function(assert) {
        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1', sortOrder: 'desc' }, { dataField: 'field2' }, { dataField: 'field3' }],
            dataSource: [],
            columnChooser: { enabled: true },
            paging: {
                pageSize: 10
            },
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {
                        columns: [{ dataField: 'field1', visibleIndex: 0, visible: true }, { dataField: 'field2', visibleIndex: 1, visible: true }, { dataField: 'field3', visibleIndex: 2, visible: false }],
                        pageSize: 40
                    };
                }
            }

        });

        // act
        this.clock.tick();

        // assert
        let visibleColumns = dataGrid.getController('columns').getVisibleColumns();
        assert.equal(visibleColumns.length, 2, 'visible column count');
        assert.equal(visibleColumns[0].sortOrder, undefined, 'field1 sortOrder');
        assert.equal(dataGrid.pageSize(), 40, 'page size');

        // act
        dataGrid.state(null);
        this.clock.tick();

        // assert
        visibleColumns = dataGrid.getController('columns').getVisibleColumns();
        assert.equal(visibleColumns.length, 3, 'visible column count');
        assert.equal(visibleColumns[0].sortOrder, 'desc', 'field1 sortOrder');
        assert.equal(visibleColumns[0].sortIndex, 0, 'field1 sortIndex');
        assert.equal(dataGrid.pageSize(), 10, 'page size');
    });

    // T528181
    QUnit.test('Change state when lookup column exists and remote data is used', function(assert) {
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
            }],
            dataSource: createRemoteDataSource([{ id: 1 }])
        });

        // act
        this.clock.tick(0);

        // act
        dataGrid.state({});
        this.clock.tick(0);

        // assert
        const $firstCell = $($(dataGrid.$element()).find('.dx-data-row').eq(0).children().eq(0));
        assert.equal($firstCell.text(), 'Test 1', 'Lookup text is correct');
    });

    QUnit.test('Clear state when initial options is defined in dataSource', function(assert) {
        const dataGrid = createDataGrid({
            columnChooser: { enabled: true },
            columns: [{ dataField: 'field1' }, { dataField: 'field2' }, { dataField: 'field3' }],
            dataSource: {
                sort: [{ selector: 'field1', desc: true }],
                pageSize: 10,
                store: []
            },
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {
                        columns: [{ dataField: 'field1', visibleIndex: 0, visible: true }, { dataField: 'field2', visibleIndex: 1, visible: true }, { dataField: 'field3', visibleIndex: 2, visible: false }],
                        pageSize: 40
                    };
                }
            }

        });

        // act
        this.clock.tick();

        // assert
        let visibleColumns = dataGrid.getController('columns').getVisibleColumns();
        assert.equal(visibleColumns.length, 2, 'visible column count');
        assert.equal(visibleColumns[0].sortOrder, undefined, 'field1 sortOrder');
        assert.equal(visibleColumns[0].sortIndex, undefined, 'field1 sortIndex');
        assert.equal(dataGrid.pageSize(), 40, 'page size');

        // act
        dataGrid.state(null);
        this.clock.tick();

        // assert
        visibleColumns = dataGrid.getController('columns').getVisibleColumns();
        assert.equal(visibleColumns.length, 3, 'visible column count');
        assert.equal(visibleColumns[0].sortOrder, 'desc', 'field1 sortOrder');
        assert.equal(visibleColumns[0].sortIndex, 0, 'field1 sortIndex');
        assert.equal(dataGrid.pageSize(), 10, 'page size');
    });

    QUnit.test('Reset pageIndex on clear state', function(assert) {
        const dataGrid = createDataGrid({
            columns: ['field1'],
            dataSource: [{}, {}, {}],
            paging: {
                pageSize: 2
            }
        });

        // act
        this.clock.tick();
        dataGrid.pageIndex(1);

        // assert
        assert.equal(dataGrid.pageIndex(), 1, 'pageIndex');

        // act
        dataGrid.state(null);
        this.clock.tick();

        // assert
        assert.equal(dataGrid.pageIndex(), 0, 'pageIndex');
    });

    // T699807
    QUnit.test('Change dataSource array during state loading', function(assert) {
        // arrange
        const stateDeferred = $.Deferred();
        const dataGrid = createDataGrid({
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return stateDeferred;
                }
            },
            keyExpr: 'id',
            loadingTimeout: undefined,
            repaintChangesOnly: true,
            dataSource: [
                { id: 1, field1: 'test1', detail: 'detail1' },
                { id: 2, field1: 'test2', detail: 'detail2' }
            ],
            columns: ['id', 'field1']
        });

        this.clock.tick();

        // act
        const newItems = [
            { id: 1, field1: 'test1', detail: 'detail1' },
            { id: 2, field1: 'test2', detail: 'updated' }
        ];

        dataGrid.option('dataSource', newItems);
        stateDeferred.resolve({});

        // assert
        assert.strictEqual(dataGrid.getVisibleRows()[1].data.detail, 'updated', 'row 1 data is updated');
    });

    // T558189
    QUnit.test('Band columns should be displayed correctly after state is reset', function(assert) {
        // arrange
        let columns;
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1, field2: 2, field3: 3, field4: 4 }],
            paging: {
                pageIndex: 0
            },
            customizeColumns: function() { },
            columns: ['field1', 'field2', { caption: 'Band Column', columns: ['field3', 'field4'] }]
        });

        this.clock.tick();

        // act
        dataGrid.state(null);
        this.clock.tick();

        // assert
        columns = dataGrid.getVisibleColumns(0).map(function(column) { return column.caption; });
        assert.deepEqual(columns, ['Field 1', 'Field 2', 'Band Column'], 'columns of the first level');

        columns = dataGrid.getVisibleColumns(1).map(function(column) { return column.caption; });
        assert.deepEqual(columns, ['Field 3', 'Field 4'], 'columns of the second level');
    });

    // T921829
    QUnit.test('Row adding should work correctly if add button was clicked before table render', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            dataSource: {
                load: function() {
                    const d = $.Deferred();
                    setTimeout(() => {
                        d.resolve([]);
                    });

                    return d;
                }
            },
            columns: [{
                dataField: 'field1',
                fixed: true
            }, 'field2', 'field3', 'field4', 'field5'],
            showBorders: true,
            editing: {
                allowAdding: true
            },
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {};
                }
            }
        });

        // act
        $('.dx-datagrid-addrow-button').trigger('dxclick');
        this.clock.tick();

        // assert
        const rows = dataGrid.getVisibleRows();
        assert.equal(rows.length, 1, 'row was added');
    });
});
