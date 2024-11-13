import $ from 'jquery';
import ko from 'knockout';
import { DataSource } from 'common/data/data_source/data_source';
import { logger } from 'core/utils/console';
import fx from 'common/core/animation/fx';
import dataSourceAdapter from '__internal/grids/data_grid/m_data_source_adapter';
import dataGridMocks from '../../helpers/dataGridMocks.js';

import 'ui/data_grid';
import 'integration/knockout';

const moduleWithoutCsp = QUnit.urlParams['nocsp'] ? QUnit.module : QUnit.module.skip;

QUnit.testStart(function() {
    const markup =
        '<style>\
            .fixed-height {\
                height: 400px;\
            }\
            .qunit-fixture-auto-height {\
                position: static !important;\
                height: auto !important;\
            }\
        </style>\
        <div id="dataGrid">\
            <div data-options="dxTemplate: { name: \'test\' }">Template Content</div>\
        </div>\
        <div id="landOfKO">\
            <div id="dataGridKO" data-bind="dxDataGrid: gridOptions">\
                <div data-options="dxTemplate: { name: \'testCellTemplate\'}">\
                    <span data-bind="text: $root.getCellText($data)"></span>\
                </div>\
                <table data-options="dxTemplate: { name: \'testRowTemplate\' }">\
                    <tr class="test-row" data-bind="click: $root.rowClick">\
                        <td>Cell Content</td>\
                    </tr>\
                </table>\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const processColumnsForCompare = function(columns, parameterNames) {
    const processedColumns = $.extend(true, [], columns);
    $.each(processedColumns, function() {
        let propertyName;
        for(propertyName in this) {
            if(parameterNames) {
                if($.inArray(propertyName, parameterNames) === -1) {
                    delete this[propertyName];
                }
            } else {
                if($.isFunction(this[propertyName])) {
                    delete this[propertyName];
                }
                if(propertyName === 'filterOperations' ||
                    propertyName === 'showInColumnChooser' ||
                    propertyName === 'userDataType' ||
                    propertyName === 'defaultFilterOperation' ||
                    propertyName === 'defaultFilterOperations' ||
                    propertyName === 'visibleIndex' ||
                    propertyName === 'resizedCallbacks' ||
                    propertyName === 'headerId') {
                    delete this[propertyName];
                }
            }
        }
    });
    return processedColumns;
};

const createDataSource = function(context, config, remoteOperations) {
    const dataSource = new DataSource(config);
    const dataAdapter = dataSourceAdapter.create(context);
    dataAdapter.init(dataSource, remoteOperations);
    return dataAdapter;
};

fx.off = true;

moduleWithoutCsp('Assign options', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, function() {
    QUnit.test('Lookup dataSource is observable value', function(assert) {
        // arrange, act
        let errorMessage;

        logger.error = function(message) {
            errorMessage = message;
        };

        // act
        $('#dataGrid').dxDataGrid({
            columns: [{ dataField: 'field1', lookup: { dataSource: ko.observableArray([]) } }],
            loadingTimeout: undefined,
            dataSource: [{ field1: 1 }]
        });

        // assert
        assert.ok(errorMessage.indexOf('Unexpected type of data source is provided for a lookup column') > -1, 'Error message');
    });
});

const setupModule = function() {
    dataGridMocks.setupDataGridModules(this, ['columns', 'data', 'selection', 'editing', 'filterRow', 'masterDetail']);

    this.applyOptions = function(options) {
        $.extend(this.options, options);
        this.columnsController.init();
        this.selectionController.init();
        this.editingController.init();
    };

    this.getColumns = function(parameterNames) {
        return processColumnsForCompare(this.columnsController.getColumns(), parameterNames);
    };
    this.getVisibleColumns = function(parameterNames) {
        return processColumnsForCompare(this.columnsController.getVisibleColumns(), parameterNames);
    };
};

const teardownModule = function() {
    this.dispose();
};

moduleWithoutCsp('initialization from dataSource', {
    beforeEach: setupModule,
    afterEach: teardownModule
}, function() {
    // T111157
    QUnit.test('Initialize from array store with observable fields', function(assert) {
        const dataSource = createDataSource(this, [
            { name: ko.observable('Alex'), age: ko.observable(15), birthDate: ko.observable(new Date(1995, 5, 23)) },
            { name: ko.observable('Dan'), age: ko.observable(19), birthDate: ko.observable(new Date(1991, 6, 15)) }
        ]);
        dataSource.load();

        this.columnsController.applyDataSource(dataSource);

        const visibleColumns = this.columnsController.getVisibleColumns();

        assert.deepEqual(processColumnsForCompare(visibleColumns), [
            { index: 0, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'name', name: 'name', caption: 'Name', alignment: 'left', dataType: 'string' },
            { index: 1, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'age', name: 'age', caption: 'Age', alignment: 'right', dataType: 'number', serializationFormat: null },
            { index: 2, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'birthDate', name: 'birthDate', caption: 'Birth Date', alignment: 'left', dataType: 'date', format: 'shortDate', serializationFormat: null }
        ]);

        assert.strictEqual(visibleColumns[0].index, 0);
        assert.strictEqual(visibleColumns[1].index, 1);
        assert.strictEqual(visibleColumns[2].index, 2);
    });

    // T387248
    QUnit.test('Set selectedRows where there is a nested knockout observable value inside dataSource', function(assert) {
    // arrange
        this.array = [
            { name: ko.observable('Alex'), age: ko.observable(15), birthDate: ko.observable(new Date(1995, 5, 23)) },
            { name: ko.observable('Dan'), age: ko.observable(16), birthDate: ko.observable(new Date(1991, 6, 15)) },
            { name: ko.observable('Tom'), age: ko.observable(18), birthDate: ko.observable(new Date(1992, 8, 14)) }
        ];
        const dataSource = new DataSource(this.array);
        this.dataController.setDataSource(dataSource);
        dataSource.load();

        this.applyOptions({
            selection: { mode: 'single' }
        });

        this.selectionController.selectRows(this.array[1]);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [this.array[1]], 'keys of the selected rows');
        assert.equal(items.length, 3, 'count item');
        assert.ok(!items[0].isSelected, 'first item isn\'t selected');
        assert.ok(items[1].isSelected, 'second item is selected');
        assert.ok(!items[2].isSelected, 'third item isn\'t selected');
    });
});


moduleWithoutCsp('Work with knockout', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.viewModel = {
            gridOptions: {
                dataSource: new DataSource({
                    store: {
                        type: 'array',
                        data: [
                            { field1: 'test1', field2: 'test2' },
                            { field1: 'test3', field2: 'test4' },
                            { field1: 'test5', field2: 'test6' },
                            { field1: 'test7', field2: 'test8' }
                        ]
                    },
                    paginate: false
                }),
                headerFilter: {
                    visible: true
                },
                columns: [
                    'field1', 'field2'
                ]
            }
        };
        this.createDataGrid = function() {
            ko.applyBindings(this.viewModel, $('#landOfKO').get(0));

            const dataGrid = $('#dataGridKO').dxDataGrid('instance');
            this.clock.tick(500);
            return dataGrid;
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
}, function() {
    QUnit.test('Check that header filter shows without errors when using KO', function(assert) {
        this.createDataGrid();

        // act
        $('#landOfKO')
            .find('.dx-header-filter')
            .first()
            .trigger('dxclick'); // Without the fix for T269782 we will get error after that


        // assert
        assert.ok(true);
    });

    // T266949
    QUnit.test('Root view model in cellTemplate', function(assert) {
        let getCellTextCallCount = 0;

        this.viewModel.getCellText = function(options) {
            getCellTextCallCount++;
            return options.rowIndex + ' - ' + options.text;
        };
        this.viewModel.gridOptions.columns[0] = {
            dataField: 'field1',
            cssClass: 'test-cell',
            cellTemplate: 'testCellTemplate'
        };

        // act
        this.createDataGrid();

        // assert
        assert.equal(getCellTextCallCount, 4, 'cell template call count');
        assert.ok($('.dx-data-row .test-cell').eq(0).text().indexOf('0 - test1') >= 0, 'test cell 0 text');
        assert.ok($('.dx-data-row .test-cell').eq(1).text().indexOf('1 - test3') >= 0, 'test cell 1 text');
    });

    QUnit.test('Two-way binding', function(assert) {
        // arrange, act

        const data = [{ field1: ko.observable(1), field2: ko.observable(2) }, { field1: ko.observable(3), field2: ko.observable(4) }];

        this.viewModel.gridOptions = {
            dataSource: data
        };

        // act
        const dataGrid = this.createDataGrid();

        // assert
        let $rows = $(dataGrid.$element().find('.dx-data-row'));
        assert.equal($rows.length, 2, 'row count');
        assert.equal($rows.eq(0).children().eq(0).text(), '1');
        assert.equal($rows.eq(1).children().eq(0).text(), '3');

        // act
        data[0].field1(666);

        // assert
        $rows = $(dataGrid.$element().find('.dx-data-row'));
        assert.equal($rows.length, 2, 'row count');
        assert.equal($rows.eq(0).children().eq(0).text(), '666');
        assert.equal($rows.eq(1).children().eq(0).text(), '3');
    });

    QUnit.test('Two-way binding disabled', function(assert) {
        // arrange, act

        const data = [{ field1: ko.observable(1), field2: ko.observable(2) }, { field1: ko.observable(3), field2: ko.observable(4) }];

        this.viewModel.gridOptions = {
            dataSource: data,
            twoWayBindingEnabled: false
        };

        // act
        const dataGrid = this.createDataGrid();

        // assert
        let $rows = $(dataGrid.$element().find('.dx-data-row'));
        assert.equal($rows.length, 2, 'row count');
        assert.equal($rows.eq(0).children().eq(0).text(), '1');
        assert.equal($rows.eq(1).children().eq(0).text(), '3');

        // act
        data[0].field1(666);

        // assert
        $rows = $(dataGrid.$element().find('.dx-data-row'));
        assert.equal($rows.length, 2, 'row count');
        assert.equal($rows.eq(0).children().eq(0).text(), '1');
        assert.equal($rows.eq(1).children().eq(0).text(), '3');
    });

    QUnit.test('$root model in rowTemplate', function(assert) {
        // arrange, act

        this.viewModel.rowClick = sinon.spy();
        this.viewModel.gridOptions = {
            rowTemplate: 'testRowTemplate',
            dataSource: [{ id: 1 }, { id: 2 }]
        };

        const dataGrid = this.createDataGrid();
        const $rows = $(dataGrid.$element().find('.test-row'));

        // act
        $rows.eq(1).click();

        // assert
        assert.equal($rows.length, 2, 'row count');
        assert.ok(this.viewModel.rowClick.calledOnce, 'rowClick called once');
        assert.equal(this.viewModel.rowClick.getCall(0).args[0].data.id, 2, 'rowClick args');
    });
});


moduleWithoutCsp('Editing', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.array = ko.observableArray([]);
        this.array.push({
            FirstName: ko.observable('Jon'),
            LastName: ko.observable('Smith')
        });
        this.editing = {
            mode: 'row',
            allowUpdating: true,
            allowAdding: true,
            allowDeleting: true
        };

        this.viewModel = {
            gridOptions: {
                dataSource: this.array,
                editing: this.editing
            }
        };
        this.createDataGrid = function() {
            ko.applyBindings(this.viewModel, $('#landOfKO').get(0));

            const dataGrid = $('#dataGridKO').dxDataGrid('instance');
            this.clock.tick(500);
            return dataGrid;
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
}, function() {
    // T566012
    QUnit.test('Row mode: DataSource fields should not be changed when editing row', function(assert) {
        // arrange
        const dataGrid = this.createDataGrid();

        dataGrid.editRow(0);
        const $input = $(dataGrid.element()).find('.dx-datagrid-rowsview .dx-editor-cell input').first();

        // assert
        assert.strictEqual($input.length, 1, 'has input');

        // act
        $input.val('Test');
        $input.trigger('change');

        // assert
        assert.strictEqual(this.array()[0].FirstName(), 'Jon', 'first name has not changed');
    });

    // T566012
    QUnit.test('Batch mode: DataSource fields should not be changed when editing cell', function(assert) {
        // arrange
        this.editing.mode = 'batch';
        const dataGrid = this.createDataGrid();

        // act
        dataGrid.cellValue(0, 0, 'Test');

        // assert
        assert.strictEqual(this.array()[0].FirstName(), 'Jon', 'first name has not changed');
    });
});
