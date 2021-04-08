import $ from 'jquery';
import { noop as noop } from 'core/utils/common';

QUnit.testStart(function() {
    const markup =
    '<div>\
        <div class="dx-datagrid">\
            <div id="container"></div>\
        </div>\
    </div>';

    $('#qunit-fixture').html(markup);
});

import 'generic_light.css!';

import 'ui/data_grid/ui.data_grid';

import { setupDataGridModules } from '../../helpers/dataGridMocks.js';
import ArrayStore from 'data/array_store';
import clientExporter from 'exporter';
import messageLocalization from 'localization/message';
import exportMixin from 'ui/grid_core/ui.grid_core.export_mixin';

QUnit.module('ExportController', {
    beforeEach: function() {
        this.setupModules = function(options, initDefaultOptions) {
            this.options = options;

            initDefaultOptions = initDefaultOptions !== undefined ? initDefaultOptions : true;

            setupDataGridModules(this, ['data', 'columns', 'rows', 'editorFactory', 'editing', 'selection', 'grouping', 'summary', 'masterDetail', 'virtualColumns', 'export'], {
                initViews: true,
                initDefaultOptions: initDefaultOptions,
                options: $.extend(true, { loadingTimeout: null }, this.options)
            });
        };

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {

    function columnCompare(targetColumn, columnWithOptions) {
        let result = 0;
        let expectLength = 0;

        $.each(columnWithOptions, function() {
            expectLength++;
        });

        $.each(targetColumn, function(key, value) {
            if(columnWithOptions[key] === value) {
                result++;
            }
        });
        return result !== 0 && result === expectLength;
    }

    QUnit.test('Get columns from data provider', function(assert) {
        this.setupModules({
            showColumnHeaders: true,
            columns: [{
                dataField: 'TestField1', width: 100, dataType: 'string'
            }, {
                dataField: 'TestField2', width: 40, dataType: 'number'
            }, {
                dataField: 'TestField3', width: 50, dataType: 'date'
            }, {
                dataField: 'TestField4', width: 90, dataType: 'boolean'
            }]
        });

        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();
        const columns = dataProvider.getColumns();

        assert.equal(columns.length, 4, 'columns length');
        assert.ok(dataProvider.isHeadersVisible(), 'headers is visible');
        assert.ok(columnCompare(columns[0], { width: 100, dataType: 'string', alignment: 'left', caption: 'Test Field 1' }), 'column 1');
        assert.ok(columnCompare(columns[1], { width: 40, dataType: 'number', alignment: 'right', caption: 'Test Field 2' }), 'column 2');
        assert.ok(columnCompare(columns[2], { width: 50, dataType: 'date', alignment: 'left', caption: 'Test Field 3' }), 'column 3');
        assert.ok(columnCompare(columns[3], { width: 90, dataType: 'boolean', alignment: 'center', caption: 'Test Field 4' }), 'column 4');
    });

    QUnit.test('Get columns with width from rowsView', function(assert) {
        this.setupModules({
            columns: [{
                dataField: 'TestField1', dataType: 'string'
            }, {
                dataField: 'TestField2', dataType: 'number'
            }, {
                dataField: 'TestField3', dataType: 'date'
            }, {
                dataField: 'TestField4', dataType: 'boolean'
            }]
        });

        this.rowsView.render($('#container').width('400px'));

        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();
        const columns = dataProvider.getColumns();

        assert.equal(columns.length, 4, 'columns length');
        assert.equal(columns[0].width, 100, '1 column width');
        assert.equal(columns[1].width, 100, '2 column width');
        assert.equal(columns[2].width, 100, '3 column width');
        assert.equal(columns[3].width, 100, '4 column width');
    });

    QUnit.test('Get columns from data provider when visible columns has command columns', function(assert) {
        this.setupModules({
            editing: {
                allowUpdating: true,
                mode: 'row'
            },
            columns: [{
                dataField: 'TestField1', width: 100, dataType: 'string', groupIndex: 0
            }, {
                dataField: 'TestField2', width: 40, dataType: 'number'
            }, {
                dataField: 'TestField3', width: 50, dataType: 'date'
            }, {
                dataField: 'TestField4', width: 90, dataType: 'boolean'
            }]
        });

        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();
        const columns = dataProvider.getColumns();

        assert.equal(columns.length, 3, 'columns length');
        assert.ok(columnCompare(columns[0], { width: 40, dataType: 'number', alignment: 'right', caption: 'Test Field 2' }), 'column 2');
        assert.ok(columnCompare(columns[1], { width: 50, dataType: 'date', alignment: 'left', caption: 'Test Field 3' }), 'column 3');
        assert.ok(columnCompare(columns[2], { width: 90, dataType: 'boolean', alignment: 'center', caption: 'Test Field 4' }), 'column 4');
    });

    QUnit.test('Get columns with percent value in width of column', function(assert) {
        this.setupModules({
            columns: [{
                dataField: 'TestField1', dataType: 'string', width: '20%'
            }, {
                dataField: 'TestField2', dataType: 'number'
            }, {
                dataField: 'TestField3', dataType: 'date'
            }, {
                dataField: 'TestField4', dataType: 'boolean', width: '20%'
            }]
        });

        this.rowsView.render($('#container').width('400px'));
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();
        const columns = dataProvider.getColumns();

        assert.equal(columns.length, 4, 'columns length');
        assert.equal(columns[0].width, 80, '1 column width');
        assert.equal(columns[1].width, 120, '1 column width');
        assert.equal(columns[2].width, 120, '1 column width');
        assert.equal(columns[3].width, 80, '1 column width');
    });

    QUnit.test('Get columns from data provider when there is band columns', function(assert) {
        this.setupModules({
            showColumnHeaders: true,
            columns: [{
                dataField: 'TestField1', width: 100, dataType: 'string'
            },
            {
                caption: 'Band column 1', columns: [
                    {
                        dataField: 'TestField2', width: 40, dataType: 'number'
                    },
                    {
                        dataField: 'TestField3', width: 50, dataType: 'date'
                    },
                    {
                        caption: 'Band Column 2', columns: [
                            {
                                dataField: 'TestField4', width: 90, dataType: 'boolean'
                            }
                        ]
                    }
                ]
            }]
        });

        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();
        const columns = dataProvider.getColumns();

        assert.equal(columns.length, 4, 'columns length');
        assert.ok(dataProvider.isHeadersVisible(), 'headers is visible');
        assert.ok(columnCompare(columns[0], { width: 100, dataType: 'string', alignment: 'left', caption: 'Test Field 1' }), 'column 1');
        assert.ok(columnCompare(columns[1], { width: 40, dataType: 'number', alignment: 'right', caption: 'Test Field 2' }), 'column 2');
        assert.ok(columnCompare(columns[2], { width: 50, dataType: 'date', alignment: 'left', caption: 'Test Field 3' }), 'column 3');
        assert.ok(columnCompare(columns[3], { width: 90, dataType: 'boolean', alignment: 'center', caption: 'Test Field 4' }), 'column 4');
    });

    QUnit.test('Get columns width when column has allowExporting is false', function(assert) {
        this.setupModules({
            columns: [{
                dataField: 'TestField1', dataType: 'string', width: 100
            }, {
                dataField: 'TestField2', dataType: 'number', allowExporting: false, width: 50
            }, {
                dataField: 'TestField3', dataType: 'date', width: 120
            }, {
                dataField: 'TestField4', dataType: 'boolean', width: 130
            }]
        });

        this.rowsView.render($('#container').width('300px'));

        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();
        const columns = dataProvider.getColumns();

        assert.equal(columns.length, 3, 'columns length');
        assert.equal(columns[0].width, 100, '1 column width');
        assert.equal(columns[1].width, 120, '2 column width');
        assert.equal(columns[2].width, 130, '3 column width');
    });

    QUnit.test('Get items without an unexported values', function(assert) {
        this.setupModules({
            dataSource: [
                { TestField1: 'Test string value', TestField2: 135, TestField3: new Date('2016/1/23'), TestField4: true }
            ],
            columns: [{
                dataField: 'TestField1', dataType: 'string'
            }, {
                dataField: 'TestField2', dataType: 'number', allowExporting: false
            }, {
                dataField: 'TestField3', dataType: 'date'
            }, {
                dataField: 'TestField4', dataType: 'boolean', allowExporting: false
            }]
        });

        this.rowsView.render($('#container').width('300px'));

        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        const items = dataProvider._options.items;
        assert.equal(items.length, 1, 'items length');
        assert.deepEqual(items[0].values, ['Test string value', new Date('2016/1/23')], 'values of item');
    });

    QUnit.test('Get actual columns when visible of column is changed before calling \'ready\' method', function(assert) {
        $('#container').width(280);
        this.setupModules({
            showColumnHeaders: true,
            columns: [{
                dataField: 'TestField1', width: 100, dataType: 'string'
            }, {
                dataField: 'TestField2', width: 40, dataType: 'number'
            }, {
                dataField: 'TestField3', width: 50, dataType: 'date'
            }, {
                dataField: 'TestField4', width: 90, dataType: 'boolean', visible: false
            }]
        });

        this.rowsView.render($('#container'));

        const dataProvider = this.exportController.getDataProvider();

        this.exportController._columnsController.columnOption('TestField4', 'visible', true);
        this.clock.tick();

        dataProvider.ready();
        this.clock.tick();
        const columns = dataProvider.getColumns();

        assert.equal(columns.length, 4, 'columns length');
        assert.ok(dataProvider.isHeadersVisible(), 'headers is visible');
        assert.ok(columnCompare(columns[0], { width: 100, dataType: 'string', alignment: 'left', caption: 'Test Field 1' }), 'column 1');
        assert.ok(columnCompare(columns[1], { width: 40, dataType: 'number', alignment: 'right', caption: 'Test Field 2' }), 'column 2');
        assert.ok(columnCompare(columns[2], { width: 50, dataType: 'date', alignment: 'left', caption: 'Test Field 3' }), 'column 3');
        assert.ok(columnCompare(columns[3], { width: 90, dataType: 'boolean', alignment: 'center', caption: 'Test Field 4', visible: true }), 'column 4');
    });

    QUnit.test('Get all columns from data provider when there is band columns', function(assert) {
        this.setupModules({
            showColumnHeaders: true,
            columns: [{
                dataField: 'TestField1', width: 100, dataType: 'string'
            },
            {
                caption: 'Band Column 1', columns: [
                    {
                        dataField: 'TestField2', width: 40, dataType: 'number'
                    },
                    {
                        dataField: 'TestField3', width: 50, dataType: 'date'
                    },
                    {
                        caption: 'Band Column 2', columns: [
                            {
                                dataField: 'TestField4', width: 90, dataType: 'boolean'
                            }
                        ]
                    }
                ]
            }]
        });

        const dataProvider = this.exportController.getDataProvider();
        let columnsByRow;

        dataProvider.ready();
        const columns = dataProvider.getColumns(true);

        assert.equal(columns.length, 4, 'columns length');
        assert.ok(dataProvider.isHeadersVisible(), 'headers is visible');

        // first row
        columnsByRow = columns[0];
        assert.equal(columnsByRow.length, 4, 'count column of the first row');
        assert.ok(columnCompare(columnsByRow[0], { width: 100, dataType: 'string', alignment: 'left', caption: 'Test Field 1' }), 'column 1');
        assert.ok(columnCompare(columnsByRow[1], { caption: 'Band Column 1', isBand: true }), 'Band Column 1');
        assert.ok(columnCompare(columnsByRow[2], { caption: '', rowspan: 1, colspan: 1 }), 'empty column');
        assert.ok(columnCompare(columnsByRow[3], { caption: '', rowspan: 1, colspan: 1 }), 'empty column');

        // second row
        columnsByRow = columns[1];
        assert.equal(columnsByRow.length, 4, 'count column of the second row');
        assert.ok(columnCompare(columnsByRow[0], { caption: '', rowspan: 1, colspan: 1 }), 'empty column');
        assert.ok(columnCompare(columnsByRow[1], { width: 40, dataType: 'number', alignment: 'right', caption: 'Test Field 2', ownerBand: 1 }), 'column 2');
        assert.ok(columnCompare(columnsByRow[2], { width: 50, dataType: 'date', alignment: 'left', caption: 'Test Field 3', ownerBand: 1 }), 'column 3');
        assert.ok(columnCompare(columnsByRow[3], { caption: 'Band Column 2', isBand: true }), 'Band Column 2');

        // third row
        columnsByRow = columns[2];
        assert.equal(columnsByRow.length, 4, 'count column of the third row');
        assert.ok(columnCompare(columnsByRow[0], { caption: '', rowspan: 1, colspan: 1 }), 'empty column');
        assert.ok(columnCompare(columnsByRow[1], { caption: '', rowspan: 1, colspan: 1 }), 'empty column');
        assert.ok(columnCompare(columnsByRow[2], { caption: '', rowspan: 1, colspan: 1 }), 'empty column');
        assert.ok(columnCompare(columnsByRow[3], { width: 90, dataType: 'boolean', alignment: 'center', caption: 'Test Field 4' }), 'column 4');

        // visible columns
        columnsByRow = columns[3];
        assert.ok(columnCompare(columnsByRow[0], { width: 100, dataType: 'string', alignment: 'left', caption: 'Test Field 1' }), 'column 1');
        assert.ok(columnCompare(columnsByRow[1], { width: 40, dataType: 'number', alignment: 'right', caption: 'Test Field 2' }), 'column 2');
        assert.ok(columnCompare(columnsByRow[2], { width: 50, dataType: 'date', alignment: 'left', caption: 'Test Field 3' }), 'column 3');
        assert.ok(columnCompare(columnsByRow[3], { width: 90, dataType: 'boolean', alignment: 'center', caption: 'Test Field 4' }), 'column 4');
    });

    QUnit.test('Get export format', function(assert) {
        this.setupModules({});

        // act, assert
        assert.deepEqual(this.exportController.getExportFormat(), ['EXCEL'], 'export format');
    });

    QUnit.test('Get cell value', function(assert) {
        this.setupModules({
            dataSource: [
                { TestField1: 'test1', TestField2: 1, TestField3: '2/13/2014', TestField4: true },
                { TestField1: 'test2', TestField2: 12, TestField3: '2/10/2014', TestField4: false }
            ],
            showColumnHeaders: true,
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'onClick'
            },
            editing: {
                allowUpdating: true,
                mode: 'row'
            },
            columns: [{
                dataField: 'TestField1', dataType: 'string'
            }, {
                dataField: 'TestField2', dataType: 'number', format: 'currency'
            }, {
                dataField: 'TestField3', dataType: 'date', format: 'shortDate'
            }, {
                dataField: 'TestField4', dataType: 'boolean'
            }]
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        assert.equal(dataProvider.getRowsCount(), 3, 'rows count');

        assert.equal(dataProvider.getCellData(0, 0).value, 'Test Field 1', 'header row 1 cell');
        assert.equal(dataProvider.getCellData(0, 1).value, 'Test Field 2', 'header row 2 cell');
        assert.equal(dataProvider.getCellData(0, 2).value, 'Test Field 3', 'header row 3 cell');
        assert.equal(dataProvider.getCellData(0, 3).value, 'Test Field 4', 'header row 4 cell');
        assert.ok(!dataProvider.getCellData(0, 4).value, 'comand column should be missed');

        assert.equal(dataProvider.getCellData(1, 0).value, 'test1', '1 row 1 cell');
        assert.equal(dataProvider.getCellData(1, 1).value, 1, '1 row 2 cell');
        assert.equal(dataProvider.getCellData(1, 2).value, new Date('2/13/2014').toString(), '1 row 3 cell');
        assert.equal(dataProvider.getCellData(1, 3).value, 'true', '1 row 4 cell');

        assert.equal(dataProvider.getCellData(2, 0).value, 'test2', '2 row 1 cell');
        assert.equal(dataProvider.getCellData(2, 1).value, 12, '2 row 2 cell');
        assert.equal(dataProvider.getCellData(2, 2).value, new Date('2/10/2014').toString(), '2 row 3 cell');
        assert.equal(dataProvider.getCellData(2, 3).value, 'false', '2 row 4 cell');
        assert.ok(!dataProvider.getCellData(2, 4).value, 'edit command column');
    });

    QUnit.test('Virtual columns', function(assert) {
        const data = [{}];
        const columns = [];

        for(let i = 1; i <= 100; i++) {
            const dataField = 'field' + i;
            data[0][dataField] = i;
            columns.push({
                dataField: dataField,
                allowExporting: i !== 99
            });
        }

        this.setupModules({
            width: 500,
            columnWidth: 50,
            dataSource: data,
            showColumnHeaders: true,
            scrolling: {
                columnRenderingMode: 'virtual'
            },
            columns: columns
        });

        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        assert.equal(this.getVisibleColumns().length, 11, 'visible column count');
        assert.equal(dataProvider.getColumns().length, 99, 'column count');
        assert.equal(dataProvider.getRowsCount(), 2, 'row count');

        assert.equal(dataProvider.getCellData(0, 0).value, 'Field 1', 'header row cell 1');
        assert.equal(dataProvider.getCellData(0, 97).value, 'Field 98', 'header row cell 98');
        assert.equal(dataProvider.getCellData(0, 98).value, 'Field 100', 'header row cell 99');

        assert.equal(dataProvider.getCellData(1, 0).value, 1, 'data row cell 1');
        assert.equal(dataProvider.getCellData(1, 97).value, 98, 'data row cell 98');
        assert.equal(dataProvider.getCellData(1, 98).value, 100, 'data row cell 99');
    });

    QUnit.test('Get lookup cell value', function(assert) {
        this.setupModules({
            dataSource: [
                { LookupField: 1, NumberField: 1 },
                { LookupField: 2, NumberField: 12 }
            ],
            columns: [{
                dataField: 'LookupField',
                lookup: {
                    dataSource: {
                        sort: 'category_name', store: {
                            type: 'array', data: [{
                                id: 2, category_name: 'Category 2'
                            }, {
                                id: 1, category_name: 'Category 1'
                            }]
                        }
                    },
                    valueExpr: 'id',
                    displayExpr: 'category_name'
                }
            }, {
                dataField: 'NumberField', dataType: 'number'
            }]
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        assert.equal(dataProvider.getRowsCount(), 2, 'rows count');

        assert.equal(dataProvider.getCellData(0, 0).value, 'Category 1', '1 row 1 cell');
        assert.equal(dataProvider.getCellData(0, 1).value, 1, '1 row 2 cell');

        assert.equal(dataProvider.getCellData(1, 0).value, 'Category 2', '2 row 1 cell');
        assert.equal(dataProvider.getCellData(1, 1).value, 12, '2 row 2 cell');
    });

    QUnit.test('Get cell value with customizeText', function(assert) {
        this.setupModules({
            dataSource: [
                { TestField1: 1, TestField2: true },
                { TestField1: 12, TestField2: false }
            ],
            columns: [{
                dataField: 'TestField1', width: 40, dataType: 'number', format: 'currency', customizeText: function(cellInfo) {
                    return cellInfo.valueText + ' current price';
                }
            }, {
                dataField: 'TestField2', width: 90, dataType: 'boolean', customizeText: function(cellInfo) {
                    return cellInfo.value ? 'да' : 'нет';
                }
            }]
        });

        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        assert.equal(dataProvider.getRowsCount(), 2, 'rows count');

        assert.equal(dataProvider.getCellData(0, 0).value, '$1 current price', '1 row 1 cell');
        assert.equal(dataProvider.getCellData(0, 1).value, 'да', '1 row 2 cell');

        assert.equal(dataProvider.getCellData(1, 0).value, '$12 current price', '2 row 1 cell');
        assert.equal(dataProvider.getCellData(1, 1).value, 'нет', '2 row 2 cell');
    });

    QUnit.test('Get cell value when value is not finite', function(assert) {
        this.setupModules({
            dataSource: [
                { Price: 1 },
                { Price: NaN },
                { Price: Infinity },
                { Price: 12 }
            ],
            grouping: {
                autoExpandAll: true
            },
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'onClick'
            },
            columns: [{
                dataField: 'Price', dataType: 'number'
            }]
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        assert.equal(dataProvider.getRowsCount(), 4, 'rows count');
        assert.equal(dataProvider.getCellData(0, 0).value, 1, 'row 1');
        assert.equal(dataProvider.getCellData(1, 0).value, 'NaN', 'row 2');
        assert.equal(dataProvider.getCellData(2, 0).value, 'Infinity', 'row 3');
        assert.equal(dataProvider.getCellData(3, 0).value, 12, 'row 4');
    });

    QUnit.test('Get group cell value from lookup', function(assert) {
        this.setupModules({
            dataSource: [
                { Name: 1, Price: 1, Active: true },
                { Name: 2, Price: 12, Active: false },
                { Name: 3, Price: 12, Active: false },
                { Name: 1, Price: 1, Active: false }
            ],
            grouping: {
                autoExpandAll: true
            },
            columns: [{
                dataField: 'Name', lookup: {
                    dataSource: {
                        sort: 'category_name', store: {
                            type: 'array', data: [{
                                id: 2, category_name: 'Category 2'
                            }, {
                                id: 1, category_name: 'Category 1'
                            }, {
                                id: 3, category_name: 'Category 3'
                            }, {
                                id: 4, category_name: 'Category 4'
                            }]
                        }
                    },
                    valueExpr: 'id',
                    displayExpr: 'category_name'
                }, groupIndex: 1
            }, {
                dataField: 'Price', dataType: 'number'
            }, {
                dataField: 'Active', dataType: 'boolean', groupIndex: 0
            }]
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        assert.equal(dataProvider.getColumns().length, 1, 'columns count');
        assert.equal(dataProvider.getRowsCount(), 10, 'rows count');

        assert.equal(dataProvider.getCellData(0, 0).value, 'Active: false', 'group row');
        assert.equal(dataProvider.getCellData(1, 0).value, 'Name: Category 1', 'group row');
        assert.equal(dataProvider.getCellData(2, 0).value, 1, 'data row');
        assert.equal(dataProvider.getCellData(3, 0).value, 'Name: Category 2', 'group row');
        assert.equal(dataProvider.getCellData(4, 0).value, 12, 'data row');
        assert.equal(dataProvider.getCellData(5, 0).value, 'Name: Category 3', 'group row');
        assert.equal(dataProvider.getCellData(6, 0).value, 12, 'data row');
        assert.equal(dataProvider.getCellData(7, 0).value, 'Active: true', 'group row');
        assert.equal(dataProvider.getCellData(8, 0).value, 'Name: Category 1', 'group row');
        assert.equal(dataProvider.getCellData(9, 0).value, 1, 'data row');
    });

    QUnit.test('Get group level by group index', function(assert) {
        this.setupModules({
            dataSource: [
                { Name: 1, Price: 1, Active: true },
                { Name: 2, Price: 12, Active: false },
                { Name: 3, Price: 12, Active: false },
                { Name: 4, Price: 1, Active: false }
            ],
            grouping: {
                autoExpandAll: true
            },
            columns: ['Name', {
                dataField: 'Price', dataType: 'number', groupIndex: 1, sortOrder: 'desc'
            }, {
                dataField: 'Active', dataType: 'boolean', groupIndex: 0, sortOrder: 'desc'
            }]
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        // act, assert
        assert.equal(dataProvider.getRowsCount(), 9, 'rows count');
        assert.equal(dataProvider.getGroupLevel(0), 0, 'root group row');
        assert.equal(dataProvider.getGroupLevel(1), 1, 'group row');
        assert.equal(dataProvider.getGroupLevel(2), 2, 'data row');
        assert.equal(dataProvider.getGroupLevel(3), 0, 'root group row');
        assert.equal(dataProvider.getGroupLevel(4), 1, 'group row');
        assert.equal(dataProvider.getGroupLevel(5), 2, 'data row');
        assert.equal(dataProvider.getGroupLevel(6), 2, 'data row');
        assert.equal(dataProvider.getGroupLevel(7), 1, 'group row');
        assert.equal(dataProvider.getGroupLevel(8), 2, 'data row');
    });

    QUnit.test('Get group level by group index. header is visible', function(assert) {
        this.setupModules({
            dataSource: [
                { Name: 1, Price: 1, Active: true },
                { Name: 2, Price: 12, Active: false },
                { Name: 3, Price: 12, Active: false },
                { Name: 4, Price: 1, Active: false }
            ],
            grouping: {
                autoExpandAll: true
            },
            showColumnHeaders: true,
            columns: ['Name', {
                dataField: 'Price', dataType: 'number', groupIndex: 1, sortOrder: 'desc'
            }, {
                dataField: 'Active', dataType: 'boolean', groupIndex: 0, sortOrder: 'desc'
            }]
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        // act, assert
        assert.equal(dataProvider.getRowsCount(), 10, 'rows count');

        assert.equal(dataProvider.getGroupLevel(0), 2, 'header row');
        assert.equal(dataProvider.getGroupLevel(1), 0, 'root group row');
        assert.equal(dataProvider.getGroupLevel(2), 1, 'group row');
        assert.equal(dataProvider.getGroupLevel(3), 2, 'data row');
        assert.equal(dataProvider.getGroupLevel(4), 0, 'root group row');
        assert.equal(dataProvider.getGroupLevel(5), 1, 'group row');
        assert.equal(dataProvider.getGroupLevel(6), 2, 'data row');
        assert.equal(dataProvider.getGroupLevel(7), 2, 'data row');
        assert.equal(dataProvider.getGroupLevel(8), 1, 'group row');
        assert.equal(dataProvider.getGroupLevel(9), 2, 'data row');
    });

    QUnit.test('Items when group item is defined and this column is grouped', function(assert) {
        this.setupModules({
            dataSource: [
                { Name: 1, Price: 1, Active: true },
                { Name: 2, Price: 12, Active: false },
                { Name: 3, Price: 12, Active: false },
                { Name: 4, Price: 1, Active: false }
            ],
            grouping: {
                autoExpandAll: true
            },
            summary: {
                groupItems: [{
                    column: 'Price',
                    showInGroupFooter: true,
                    summaryType: 'sum'
                }]
            },
            columns: ['Name', {
                dataField: 'Price', dataType: 'number', groupIndex: 1, sortOrder: 'desc'
            }, {
                dataField: 'Active', dataType: 'boolean', groupIndex: 0, sortOrder: 'desc'
            }]
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        // act, assert
        assert.equal(dataProvider.getRowsCount(), 9, 'rows count');
    });

    QUnit.test('Get group level for total summary row', function(assert) {
        this.setupModules({
            dataSource: [
                { Name: 1, Price: 1, Active: true },
                { Name: 2, Price: 12, Active: false },
                { Name: 3, Price: 12, Active: false },
                { Name: 4, Price: 1, Active: false }
            ],
            grouping: {
                autoExpandAll: true
            },
            summary: {
                texts: {
                    sum: 'Sum: {0}',
                    min: 'Min: {0}',
                    count: 'Count: {0}'
                },
                totalItems: [
                    {
                        column: 'Name',
                        summaryType: 'count'
                    },
                    {
                        column: 'Price',
                        summaryType: 'min'
                    },
                    {
                        column: 'Price',
                        summaryType: 'max',
                        showInColumn: 'Name'
                    }
                ]
            },
            columns: ['Name', {
                dataField: 'Price', showWhenGrouped: true, dataType: 'number', groupIndex: 1, sortOrder: 'desc'
            }, {
                dataField: 'Active', dataType: 'boolean', groupIndex: 0, sortOrder: 'desc'
            }]
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        // act, assert
        assert.equal(dataProvider.getRowsCount(), 11, 'rows count');
        assert.ok(!dataProvider.isTotalCell(8, 0), 'isTotalCell');
        assert.ok(!dataProvider.isTotalCell(0, 40), 'isTotalCell for out of range');
        assert.ok(dataProvider.isTotalCell(9, 0), 'isTotalCell');
        assert.equal(dataProvider.getGroupLevel(9), 0, '10 row');
        assert.ok(dataProvider.isTotalCell(10, 0), 'isTotalCell');
        assert.equal(dataProvider.getGroupLevel(10), 0, '11 row');
    });

    QUnit.test('Get total summary value', function(assert) {
        const summaryRowTypes = [];
        this.setupModules({
            dataSource: [
                { Name: 1, Price: 1, Sale: 0.03 },
                { Name: 2, Price: 12, Sale: 0.14 },
                { Name: 3, Price: 12, Sale: 0.63 },
                { Name: 4, Price: 1, Sale: 0.93 }
            ],
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'onClick'
            },
            customizeExportData: function(columns, rows) {
                for(let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    if(row.rowType === 'totalFooter') {
                        summaryRowTypes.push(row.rowType);
                    }
                }
            },
            summary: {
                texts: {
                    max: 'Max: {0}',
                    sum: 'Sum: {0}',
                    count: 'Count: {0}'
                },
                totalItems: [
                    {
                        column: 'Name',
                        summaryType: 'count',
                        customizeText: function(cellInfo) {
                            return cellInfo.value + ' tests';
                        }
                    },
                    {
                        column: 'Price',
                        summaryType: 'sum',
                        valueFormat: 'currency'
                    },
                    {
                        column: 'Sale',
                        valueFormat: 'percent',
                        displayFormat: 'Sale - {0}',
                        summaryType: 'max',
                        showInColumn: 'Name'
                    }
                ]
            },
            columns: ['Name', 'Price', 'Sale']
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        // assert, act
        assert.equal(summaryRowTypes.length, 2, 'total footer types');
        assert.equal(dataProvider.getRowsCount(), 6, 'rows count');
        assert.equal(dataProvider.getCellData(4, 0).value, '4 tests', 'summary cell 1');
        assert.equal(dataProvider.getCellData(4, 1).value, 'Sum: $26', 'summary cell 2');
        assert.equal(dataProvider.getCellData(4, 2).value, undefined, 'summary cell 3');
        assert.equal(dataProvider.getCellData(5, 0).value, 'Sale - 93%', 'summary cell 1');
        assert.equal(dataProvider.getCellData(5, 1).value, undefined, 'summary cell 2');
        assert.equal(dataProvider.getCellData(5, 2).value, undefined, 'summary cell 3');
    });

    QUnit.test('Get total summary value when selected items are defined', function(assert) {
        const dataSource = [
            { Name: 1, Price: 1, Sale: 0.03 },
            { Name: 2, Price: 12, Sale: 0.14 },
            { Name: 3, Price: 12, Sale: 0.63 },
            { Name: 4, Price: 1, Sale: 0.93 }
        ];

        this.setupModules({
            dataSource: dataSource,
            selectedRowKeys: [dataSource[1], dataSource[2]],
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'onClick'
            },
            summary: {
                texts: {
                    max: 'Max: {0}',
                    sum: 'Sum: {0}',
                    count: 'Count: {0}'
                },
                totalItems: [
                    {
                        column: 'Name',
                        summaryType: 'count',
                        customizeText: function(cellInfo) {
                            return cellInfo.value + ' tests';
                        }
                    },
                    {
                        column: 'Price',
                        summaryType: 'sum',
                        valueFormat: 'currency'
                    },
                    {
                        column: 'Sale',
                        valueFormat: 'percent',
                        displayFormat: 'Sale - {0}',
                        summaryType: 'max',
                        showInColumn: 'Name'
                    }
                ]
            },
            columns: ['Name', 'Price', 'Sale']
        });

        this.exportController._selectionOnly = true;

        const dataProvider = this.exportController.getDataProvider();
        dataProvider.ready();

        this.clock.tick();

        // assert, act
        assert.equal(dataProvider.getRowsCount(), 4, 'rows count');
        assert.equal(dataProvider.getCellData(2, 0).value, '2 tests', 'summary cell 1');
        assert.equal(dataProvider.getCellData(2, 1).value, 'Sum: $24', 'summary cell 2');
        assert.equal(dataProvider.getCellData(2, 2).value, undefined, 'summary cell 3');
        assert.equal(dataProvider.getCellData(3, 0).value, 'Sale - 63%', 'summary cell 1');
        assert.equal(dataProvider.getCellData(3, 1).value, undefined, 'summary cell 2');
        assert.equal(dataProvider.getCellData(3, 2).value, undefined, 'summary cell 3');
    });

    QUnit.test('Get total summary value when selected items are defined. Deferred selection', function(assert) {
        this.setupModules({
            dataSource: {
                store: new ArrayStore({ data: [
                    { id: 1, Name: 1, Price: 1, Sale: 0.03 },
                    { id: 2, Name: 2, Price: 12, Sale: 0.14 },
                    { id: 3, Name: 3, Price: 12, Sale: 0.63 },
                    { id: 4, Name: 4, Price: 1, Sale: 0.93 }
                ],
                key: 'id'
                })
            },
            selectionFilter: [['id', '=', 2], 'or', ['id', '=', 3]],
            selection: {
                mode: 'multiple',
                deferred: true
            },
            summary: {
                texts: {
                    max: 'Max: {0}',
                    sum: 'Sum: {0}',
                    count: 'Count: {0}'
                },
                totalItems: [
                    {
                        column: 'Name',
                        summaryType: 'count',
                        customizeText: function(cellInfo) {
                            return cellInfo.value + ' tests';
                        }
                    },
                    {
                        column: 'Price',
                        summaryType: 'sum',
                        valueFormat: 'currency'
                    },
                    {
                        column: 'Sale',
                        valueFormat: 'percent',
                        displayFormat: 'Sale - {0}',
                        summaryType: 'max',
                        showInColumn: 'Name'
                    }
                ]
            },
            columns: ['Name', 'Price', 'Sale']
        });

        this.exportController._selectionOnly = true;
        const dataProvider = this.exportController.getDataProvider();
        dataProvider.ready();

        this.clock.tick();

        // assert, act
        assert.equal(dataProvider.getRowsCount(), 4, 'rows count');
        assert.equal(dataProvider.getCellData(2, 0).value, '2 tests', 'summary cell 1');
        assert.equal(dataProvider.getCellData(2, 1).value, 'Sum: $24', 'summary cell 2');
        assert.equal(dataProvider.getCellData(2, 2).value, undefined, 'summary cell 3');
        assert.equal(dataProvider.getCellData(3, 0).value, 'Sale - 63%', 'summary cell 1');
        assert.equal(dataProvider.getCellData(3, 1).value, undefined, 'summary cell 2');
        assert.equal(dataProvider.getCellData(3, 2).value, undefined, 'summary cell 3');
    });

    QUnit.test('Get total summary value when selected items are defined. Deferred selection. SelectedRowsData is failed', function(assert) {
        this.setupModules({
            dataSource: {
                store: new ArrayStore({ data: [
                    { id: 1, Name: 1, Price: 1, Sale: 0.03 },
                    { id: 2, Name: 2, Price: 12, Sale: 0.14 },
                    { id: 3, Name: 3, Price: 12, Sale: 0.63 },
                    { id: 4, Name: 4, Price: 1, Sale: 0.93 }
                ],
                key: 'id'
                })
            },
            selectionFilter: [['id', '=', 2], 'or', ['id', '=', 3]],
            selection: {
                mode: 'multiple',
                deferred: true
            },
            summary: {
                texts: {
                    max: 'Max: {0}',
                    sum: 'Sum: {0}',
                    count: 'Count: {0}'
                },
                totalItems: [
                    {
                        column: 'Name',
                        summaryType: 'count',
                        customizeText: function(cellInfo) {
                            return cellInfo.value + ' tests';
                        }
                    },
                    {
                        column: 'Price',
                        summaryType: 'sum',
                        valueFormat: 'currency'
                    },
                    {
                        column: 'Sale',
                        valueFormat: 'percent',
                        displayFormat: 'Sale - {0}',
                        summaryType: 'max',
                        showInColumn: 'Name'
                    }
                ]
            },
            columns: ['Name', 'Price', 'Sale']
        });

        this.exportController._selectionOnly = true;

        this.selectionController.getSelectedRowsData = function() {
            return $.Deferred().reject();
        };

        const dataProvider = this.exportController.getDataProvider();
        dataProvider.ready();

        this.clock.tick();

        // assert, act
        assert.equal(dataProvider.getRowsCount(), 0);
    });

    QUnit.test('Get group summary value', function(assert) {
        this.setupModules({
            dataSource: [
                { Name: 'test 1', Price: 1, Sale: 0.03 },
                { Name: 'test 2', Price: 12, Sale: 0.14 },
                { Name: 'test 2', Price: 12, Sale: 0.63 },
                { Name: 'test 1', Price: 1, Sale: 0.93 }
            ],
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'onClick'
            },
            grouping: {
                autoExpandAll: true
            },
            summary: {
                texts: {
                    max: 'Max: {0}',
                    sum: 'Sum: {0}',
                    count: 'Count: {0}'
                },
                groupItems: [
                    {
                        column: 'Name',
                        summaryType: 'count',
                        customizeText: function(cellInfo) {
                            return cellInfo.value + ' tests';
                        }
                    },
                    {
                        column: 'Price',
                        summaryType: 'sum',
                        valueFormat: 'currency'
                    },
                    {
                        column: 'Sale',
                        valueFormat: 'percent',
                        displayFormat: 'Sale - {0}',
                        summaryType: 'max',
                        showInColumn: 'Name'
                    }
                ]
            },
            columns: [{ dataField: 'Name', groupIndex: 0 }, 'Price', 'Sale']
        }, false);
        let isPrepareItemsForGroupFooters;

        this.exportController._getItemsWithSummaryGroupFooters = function() {
            isPrepareItemsForGroupFooters = true;
        };

        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        // assert, act
        assert.ok(!isPrepareItemsForGroupFooters, 'summary group footer items is not generated');
        assert.equal(dataProvider.getRowsCount(), 6, 'rows count');

        assert.ok(!dataProvider.isTotalCell(0, 0), 'isTotalCell');
        assert.equal(dataProvider.getCellData(0, 0).value, 'Name: test 1 (2 tests, Sum: $2, Sale - 93%)', 'group summary row 1');
        assert.equal(dataProvider.getCellData(0, 1).value, undefined);
        assert.equal(dataProvider.getCellData(0, 2).value, undefined);

        assert.ok(!dataProvider.isTotalCell(1, 0), 'isTotalCell');
        assert.ok(!dataProvider.isTotalCell(2, 0), 'isTotalCell');

        assert.ok(!dataProvider.isTotalCell(3, 0), 'isTotalCell');
        assert.equal(dataProvider.getCellData(3, 0).value, 'Name: test 2 (2 tests, Sum: $24, Sale - 63%)', 'group summary row 2');
        assert.equal(dataProvider.getCellData(3, 1).value, undefined);
        assert.equal(dataProvider.getCellData(3, 2).value, undefined);
    });

    QUnit.test('Get group footer summary value', function(assert) {
        this.setupModules({
            dataSource: [
                { Name: 'test 1', Price: 1, Sale: 0.03 },
                { Name: 'test 2', Price: 12, Sale: 0.14 },
                { Name: 'test 2', Price: 12, Sale: 0.63 },
                { Name: 'test 1', Price: 1, Sale: 0.93 }
            ],
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'onClick'
            },
            grouping: {
                autoExpandAll: true
            },
            summary: {
                texts: {
                    max: 'Max: {0}',
                    min: 'Min: {0}',
                    sum: 'Sum: {0}',
                    count: 'Count: {0}'
                },
                groupItems: [
                    {
                        column: 'Name',
                        summaryType: 'count',
                        customizeText: function(cellInfo) {
                            return cellInfo.value + ' tests';
                        },
                        showInGroupFooter: true
                    },
                    {
                        column: 'Sale',
                        valueFormat: 'percent',
                        displayFormat: 'Sale - {0}',
                        summaryType: 'max',
                        showInColumn: 'Name',
                        showInGroupFooter: true
                    },
                    {
                        column: 'Sale',
                        summaryType: 'min',
                        showInGroupFooter: true
                    }
                ]
            },
            columns: [{ dataField: 'Name', groupIndex: 0, showWhenGrouped: true }, 'Price', 'Sale']
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        // assert, act
        assert.equal(dataProvider.getRowsCount(), 10, 'rows count');

        assert.ok(dataProvider.isTotalCell(3), 'isTotalCell');
        assert.equal(dataProvider.getCellData(3, 0).value, '2 tests', 'group footer row 1 cell 1');
        assert.equal(dataProvider.getCellData(3, 1).value, undefined, 'group footer row 1 cell 2');
        assert.equal(dataProvider.getCellData(3, 2).value, 'Min: 0.03', 'group footer row 1 cell 3');

        assert.ok(dataProvider.isTotalCell(4, 0), 'isTotalCell');
        assert.equal(dataProvider.getCellData(4, 0).value, 'Sale - 93%', 'group footer row 2 cell 1');
        assert.equal(dataProvider.getCellData(4, 1).value, undefined, 'group footer row 2 cell 2');
        assert.equal(dataProvider.getCellData(4, 2).value, undefined, 'group footer row 2 cell 3');

        assert.ok(dataProvider.isTotalCell(8, 0), 'isTotalCell');
        assert.equal(dataProvider.getCellData(8, 0).value, '2 tests', 'group footer row 3 cell 1');
        assert.equal(dataProvider.getCellData(8, 1).value, undefined, 'group footer row 3 cell 2');
        assert.equal(dataProvider.getCellData(8, 2).value, 'Min: 0.14', 'group footer row 3 cell 3');

        assert.ok(dataProvider.isTotalCell(9, 0), 'isTotalCell');
        assert.equal(dataProvider.getCellData(9, 0).value, 'Sale - 63%', 'group footer row 4 cell 1');
        assert.equal(dataProvider.getCellData(9, 1).value, undefined, 'group footer row 4 cell 2');
        assert.equal(dataProvider.getCellData(9, 2).value, undefined, 'group footer row 4 cell 3');
    });

    QUnit.test('Get summary value for a column', function(assert) {
        this.setupModules({
            dataSource: [
                { Name: 'test 1', room: 101, Price: 1, Sale: 0.03 },
                { Name: 'test 2', room: 102, Price: 12, Sale: 0.14 },
                { Name: 'test 2', room: 102, Price: 12, Sale: 0.63 },
                { Name: 'test 1', room: 101, Price: 1, Sale: 0.93 }
            ],
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'onClick'
            },
            grouping: {
                autoExpandAll: true
            },
            summary: {
                texts: {
                    max: 'Max: {0}',
                    min: 'Min: {0}',
                    sum: 'Sum: {0}',
                    count: 'Count: {0}'
                },
                groupItems: [
                    {
                        column: 'Name',
                        summaryType: 'count'
                    },
                    {
                        column: 'Sale',
                        valueFormat: 'percent',
                        summaryType: 'max',
                        alignByColumn: true
                    },
                    {
                        column: 'Price',
                        summaryType: 'min',
                        alignByColumn: true
                    }
                ]
            },
            columns: [{ dataField: 'Name', groupIndex: 0 }, 'room', 'Price', 'Sale']
        });

        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        // assert, act
        assert.equal(dataProvider.getCellData(0, 1).value, 'Min: 1');
        assert.equal(dataProvider.getCellData(0, 2).value, 'Max: 93%');
    });

    QUnit.test('Get summary value for a column when summary items in one column', function(assert) {
        this.setupModules({
            dataSource: [
                { Name: 'test 1', room: 101, Price: 1, Sale: 0.03 },
                { Name: 'test 2', room: 102, Price: 12, Sale: 0.14 },
                { Name: 'test 2', room: 102, Price: 12, Sale: 0.63 },
                { Name: 'test 1', room: 101, Price: 1, Sale: 0.93 }
            ],
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'onClick'
            },
            grouping: {
                autoExpandAll: true
            },
            summary: {
                texts: {
                    max: 'Max: {0}',
                    min: 'Min: {0}',
                    sum: 'Sum: {0}',
                    count: 'Count: {0}'
                },
                groupItems: [
                    {
                        column: 'Name',
                        summaryType: 'count'
                    },
                    {
                        column: 'Sale',
                        valueFormat: 'percent',
                        summaryType: 'max',
                        alignByColumn: true
                    },
                    {
                        column: 'Price',
                        summaryType: 'min',
                        showInColumn: 'Sale',
                        alignByColumn: true
                    }
                ]
            },
            columns: [{
                dataField: 'Name', groupIndex: 0, allowExporting: true
            }, {
                dataField: 'room', allowExporting: true
            }, {
                dataField: 'Price', allowExporting: true
            }, {
                dataField: 'Sale', allowExporting: true
            }]
        }, false);

        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        // assert, act
        assert.equal(dataProvider.getCellData(0, 2).value, 'Max: 93% \n Min: 1');
    });

    QUnit.test('Check summary for a column in a group row', function(assert) {
    // arrange, act
        this.setupModules({
            dataSource: [
                { Name: 'test 1', room: 103, Price: 1, Sale: 0.03 },
                { Name: 'test 2', room: 103, Price: 12, Sale: 0.14 },
                { Name: 'test 2', room: 102, Price: 12, Sale: 0.63 },
                { Name: 'test 1', room: 102, Price: 1, Sale: 0.93 }
            ],
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'onClick'
            },
            showColumnHeaders: true,
            grouping: {
                autoExpandAll: true
            },
            summary: {
                texts: {
                    max: 'Max: {0}',
                    sum: 'Sum: {0}',
                    count: 'Count: {0}'
                },
                groupItems: [
                    {
                        column: 'Name',
                        summaryType: 'count'
                    },
                    {
                        column: 'Price',
                        summaryType: 'sum',
                        alignByColumn: true,
                        valueFormat: 'currency'
                    },
                    {
                        column: 'Sale',
                        alignByColumn: true,
                        valueFormat: 'percent',
                        summaryType: 'max'
                    }
                ]
            },
            columns: [{ dataField: 'Name', groupIndex: 0 }, 'room', { dataField: 'Price', alignment: 'center' }, 'Sale']
        });

        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        const styles = dataProvider.getStyles();

        assert.ok(dataProvider.isGroupRow(0), 'zero row is a group row');

        assert.deepEqual(styles[dataProvider.getStyleId(1, 0)], {
            bold: true,
            wrapText: false,
            alignment: 'left'
        }, 'group row style');

        assert.deepEqual(styles[dataProvider.getStyleId(1, 1)], {
            bold: true,
            wrapText: true,
            alignment: 'center'
        }, 'Total cell 1 style');

        assert.deepEqual(styles[dataProvider.getStyleId(1, 2)], {
            bold: true,
            wrapText: true,
            alignment: 'right'
        }, 'Total cell 2 style');

        assert.ok(dataProvider.isTotalCell(0, 1), '2 cell is summary in a group row');
        assert.ok(dataProvider.isTotalCell(0, 2), '3 cell is summary in a group row');
    });

    QUnit.test('Check summary for a column in a group row.RTL', function(assert) {
    // arrange, act
        this.setupModules({
            dataSource: [
                { Name: 'test 1', room: 103, Price: 1, Sale: 0.03 }
            ],
            showColumnHeaders: true,
            rtlEnabled: true,
            grouping: {
                autoExpandAll: true
            },
            summary: {
                groupItems: [{
                    column: 'Name',
                    summaryType: 'count'
                }]
            },
            columns: [{ dataField: 'Name', groupIndex: 0 }, 'room', { dataField: 'Price', alignment: 'center' }, 'Sale']
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        const styles = dataProvider.getStyles();
        assert.deepEqual(styles[dataProvider.getStyleId(1, 0)], {
            bold: true,
            wrapText: false,
            alignment: 'right'
        }, 'group row style');
    });

    QUnit.test('Summary group footers are contained in the options', function(assert) {
        const summaryRowTypes = [];
        this.setupModules({
            dataSource: [
                { Name: 'test 1', Price: 1, Sale: 0.03 },
                { Name: 'test 2', Price: 12, Sale: 0.14 },
                { Name: 'test 2', Price: 12, Sale: 0.63 },
                { Name: 'test 1', Price: 1, Sale: 0.93 }
            ],
            customizeExportData: function(columns, rows) {
                for(let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    if(row.rowType === 'groupFooter') {
                        summaryRowTypes.push(row.rowType);
                    }
                }
            },
            summary: {
                groupItems: [
                    {
                        column: 'Name',
                        summaryType: 'count',
                        customizeText: function(cellInfo) {
                            return cellInfo.value + ' tests';
                        },
                        showInGroupFooter: true
                    },
                    {
                        column: 'Sale',
                        valueFormat: 'percent',
                        displayFormat: 'Sale - {0}',
                        summaryType: 'max',
                        showInColumn: 'Name'
                    },
                    {
                        column: 'Sale',
                        summaryType: 'min'
                    }
                ]
            },
            columns: [{ dataField: 'Name', groupIndex: 0, showWhenGrouped: true }, 'Price', 'Sale']
        });

        this.exportController.getDataProvider().ready();

        assert.ok(this.exportController._hasSummaryGroupFooters());
        assert.equal(summaryRowTypes.length, 2, 'group footers count');
    });

    QUnit.test('Summary group footers are not contained in the options', function(assert) {
        this.setupModules({
            dataSource: [
                { Name: 'test 1', Price: 1, Sale: 0.03 },
                { Name: 'test 2', Price: 12, Sale: 0.14 },
                { Name: 'test 2', Price: 12, Sale: 0.63 },
                { Name: 'test 1', Price: 1, Sale: 0.93 }
            ],
            summary: {
                groupItems: [
                    {
                        column: 'Name',
                        summaryType: 'count'
                    },
                    {
                        column: 'Sale',
                        valueFormat: 'percent',
                        displayFormat: 'Sale - {0}',
                        summaryType: 'max',
                        showInColumn: 'Name'
                    },
                    {
                        column: 'Sale',
                        summaryType: 'min'
                    }
                ]
            },
            columns: [{ dataField: 'Name', groupIndex: 0, showWhenGrouped: true }, 'Price', 'Sale']
        });

        // assert, act
        assert.ok(!this.exportController._hasSummaryGroupFooters());
    });

    QUnit.test('Get cell type', function(assert) {
        this.setupModules({
            dataSource: [
                { TestField1: 'test1', TestField2: 1, TestField3: '2/13/2014', TestField4: true },
                { TestField1: 'test2', TestField2: 12, TestField3: '2/10/2014', TestField4: false }
            ],
            showColumnHeaders: true,
            columns: [{
                dataField: 'TestField1', dataType: 'string'
            }, {
                dataField: 'TestField2', dataType: 'number', format: 'currency'
            }, {
                dataField: 'TestField3', dataType: 'date', format: 'shortDate'
            }, {
                dataField: 'TestField4', dataType: 'boolean'
            }]
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        // assert, act
        assert.strictEqual(dataProvider.getCellType(0, 0), 'string', 'header row 1 cell type');
        assert.strictEqual(dataProvider.getCellType(0, 1), 'string', 'header row 2 cell type');
        assert.strictEqual(dataProvider.getCellType(0, 2), 'string', 'header row 3 cell type');
        assert.strictEqual(dataProvider.getCellType(0, 3), 'string', 'header row 4 cell type');

        assert.equal(dataProvider.getCellType(1, 0), 'string', 'col 1');
        assert.equal(dataProvider.getCellType(2, 0), 'string', 'col 1');

        assert.equal(dataProvider.getCellType(1, 1), 'number', 'col 2');
        assert.equal(dataProvider.getCellType(2, 1), 'number', 'col 2');

        assert.equal(dataProvider.getCellType(1, 2), 'date', 'col 3');
        assert.equal(dataProvider.getCellType(2, 2), 'date', 'col 3');

        assert.equal(dataProvider.getCellType(1, 3), 'string', 'col 4');
        assert.equal(dataProvider.getCellType(2, 3), 'string', 'col 4');
    });

    QUnit.test('Get cell type with lookup', function(assert) {
        this.setupModules({
            dataSource: [
                { TestField1: 12, TestID: 1 },
                { TestField1: 478, TestID: 2 }
            ],
            columns: [{
                dataField: 'TestField1', dataType: 'number'
            }, {
                dataField: 'TestID', lookup: {
                    displayExpr: 'Name',
                    valueExpr: 'ID',
                    dataSource: [{
                        ID: 1, Name: 'Lookup 1'
                    },
                    {
                        ID: 2, Name: 'Lookup 2'
                    }]
                }
            }]
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        // assert, act
        assert.equal(dataProvider.getCellType(0, 0), 'number', 'col 1');
        assert.equal(dataProvider.getCellType(0, 1), 'string', 'col 2');
    });

    QUnit.test('Get cell type with customize text', function(assert) {
        this.setupModules({
            dataSource: [
                { TestField1: 'test1', TestField2: 1 },
                { TestField1: 'test2', TestField2: 12 }
            ],
            columns: [{
                dataField: 'TestField1', dataType: 'string'
            }, {
                dataField: 'TestField2', dataType: 'number', format: 'currency', customizeText: function(cellInfo) {
                    return cellInfo.valueText;
                }
            }]
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        // assert, act
        assert.equal(dataProvider.getCellType(0, 0), 'string', 'col 1');
        assert.equal(dataProvider.getCellType(1, 0), 'string', 'col 1');

        assert.equal(dataProvider.getCellType(0, 1), 'string', 'col 2');
        assert.equal(dataProvider.getCellType(1, 1), 'string', 'col 2');
    });

    QUnit.test('Get cell type with grouping and summary footer', function(assert) {
        this.setupModules({
            dataSource: [
                { TestField1: 'test1', TestField2: 1 },
                { TestField1: 'test2', TestField2: 12 }
            ],
            summary: {
                totalItems: [
                    {
                        column: 'TestField1',
                        summaryType: 'count'
                    }
                ]
            },
            grouping: {
                autoExpandAll: true
            },
            columns: [{
                dataField: 'TestField1', dataType: 'string'
            }, {
                dataField: 'TestField2', dataType: 'number', groupIndex: 0
            }]
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        // assert, act
        assert.equal(dataProvider.getColumns().length, 1, 'columns count');
        assert.equal(dataProvider.getRowsCount(), 5, 'rows count');
        assert.equal(dataProvider.getCellType(0, 0), 'string', 'col 1');
        assert.equal(dataProvider.getCellType(1, 0), 'string', 'col 1');
        assert.equal(dataProvider.getCellType(2, 0), 'string', 'col 1');
        assert.equal(dataProvider.getCellType(3, 0), 'string', 'col 1');
        assert.equal(dataProvider.getCellType(5, 0), 'string', 'col 1');
    });

    QUnit.test('Get cell type when value is not finite', function(assert) {
        this.setupModules({
            dataSource: [
                { TestField1: NaN },
                { TestField1: Infinity },
                { TestField1: 123 }
            ],
            columns: [{
                dataField: 'TestField1', dataType: 'number'
            }]
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        // assert, act
        assert.equal(dataProvider.getCellType(0, 0), 'string', 'col 1 row1');
        assert.equal(dataProvider.getCellType(1, 0), 'string', 'col 1 row2');
        assert.equal(dataProvider.getCellType(2, 0), 'number', 'col 1 row3');
    });

    QUnit.test('Summary align by column', function(assert) {
        const that = this;

        that.setupModules({
            dataSource: [
                { Name: 'test 1', room: 101, Price: 1, Sale: 0.03 },
                { Name: 'test 2', room: 101, Price: 12, Sale: 0.14 },
                { Name: 'test 2', room: 103, Price: 12, Sale: 0.63 },
                { Name: 'test 1', room: 103, Price: 1, Sale: 0.93 }
            ],
            summary: {
                groupItems: [
                    {
                        column: 'Name',
                        summaryType: 'count'
                    },
                    {
                        column: 'Price',
                        summaryType: 'max',
                        alignByColumn: true
                    },
                    {
                        column: 'Sale',
                        summaryType: 'min',
                        alignByColumn: true
                    }
                ]
            },
            columns: [{ dataField: 'Name', groupIndex: 0 }, { dataField: 'room', groupIndex: 1, showWhenGrouped: true }, 'Price', 'Sale']
        });

        const updateGroupValuesWithSummaryByColumn = that.exportController._updateGroupValuesWithSummaryByColumn;
        let _sourceItems;

        that.exportController._updateGroupValuesWithSummaryByColumn = function(sourceItems) {
            $.proxy(updateGroupValuesWithSummaryByColumn, that)(sourceItems);
            _sourceItems = sourceItems;
        };

        const dataProvider = this.exportController.getDataProvider();
        dataProvider.ready();

        that.clock.tick();

        assert.deepEqual(_sourceItems[1].values, [101, [{
            alignByColumn: true,
            column: 'Price',
            summaryType: 'max',
            value: 1
        }], [{
            alignByColumn: true,
            column: 'Sale',
            summaryType: 'min',
            value: 0.03
        }]]);
    });

    QUnit.test('Summary align by column when summary items are contains in one cell', function(assert) {
        const that = this;

        that.setupModules({
            dataSource: [
                { Name: 'test 1', room: 101, Price: 1, Sale: 0.03 },
                { Name: 'test 2', room: 101, Price: 12, Sale: 0.14 },
                { Name: 'test 2', room: 103, Price: 12, Sale: 0.63 },
                { Name: 'test 1', room: 103, Price: 1, Sale: 0.93 }
            ],
            summary: {
                groupItems: [
                    {
                        column: 'Name',
                        summaryType: 'count'
                    },
                    {
                        column: 'Price',
                        summaryType: 'max',
                        alignByColumn: true
                    },
                    {
                        column: 'Sale',
                        showInColumn: 'Price',
                        summaryType: 'min',
                        alignByColumn: true
                    }
                ]
            },
            columns: [{ dataField: 'Name', groupIndex: 0 }, 'room', 'Price', 'Sale']
        });

        const updateGroupValuesWithSummaryByColumn = that.exportController._updateGroupValuesWithSummaryByColumn;
        let _sourceItems;

        that.exportController._updateGroupValuesWithSummaryByColumn = function(sourceItems) {
            $.proxy(updateGroupValuesWithSummaryByColumn, that)(sourceItems);
            _sourceItems = sourceItems;
        };

        const dataProvider = this.exportController.getDataProvider();
        dataProvider.ready();

        that.clock.tick();

        assert.deepEqual(_sourceItems[0].values, ['test 1', [
            {
                alignByColumn: true,
                column: 'Price',
                summaryType: 'max',
                value: 1
            },
            {
                alignByColumn: true,
                column: 'Sale',
                columnCaption: 'Sale',
                showInColumn: 'Price',
                summaryType: 'min',
                value: 0.03
            }
        ], undefined]);
    });

    QUnit.test('Headers is not visible', function(assert) {
        this.setupModules({
            dataSource: [
                { TestField1: 'test1', TestField2: 1, TestField3: '2/13/2014', TestField4: true },
                { TestField1: 'test2', TestField2: 12, TestField3: '2/10/2014', TestField4: false }
            ],
            showColumnHeaders: false,
            columns: [{
                dataField: 'TestField1', dataType: 'string'
            }, {
                dataField: 'TestField2', dataType: 'number', format: 'currency'
            }, {
                dataField: 'TestField3', dataType: 'date', format: 'shortDate'
            }, {
                dataField: 'TestField4', dataType: 'boolean'
            }]
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        // assert, act
        assert.ok(!dataProvider.isHeadersVisible());
        assert.strictEqual(dataProvider.getRowsCount(), 2);
    });

    QUnit.test('Get cell value with master detail', function(assert) {
        const dataSource = [
            { TestField1: 'test1', TestField2: 1 },
            { TestField1: 'test2', TestField2: 12 }
        ];

        this.setupModules({
            dataSource: dataSource,
            masterDetail: {
                enabled: true,
                template: function() { }
            },
            columns: [{
                dataField: 'TestField1', dataType: 'string'
            }, {
                dataField: 'TestField2', dataType: 'number'
            }]
        });
        this.rowsView.render($('#container'));
        const dataProvider = this.exportController.getDataProvider();
        this.dataController.expandRow(dataSource[0]);

        dataProvider.ready();

        this.clock.tick();

        assert.equal(dataProvider.getRowsCount(), 2, 'rows count');
        assert.equal(dataProvider.getCellData(0, 0).value, 'test1', 'row 1 cell 1');
        assert.equal(dataProvider.getCellData(0, 1).value, 1, 'row 1 cell 2');
        assert.equal(dataProvider.getCellData(1, 0).value, 'test2', 'row 2 cell 1');
        assert.equal(dataProvider.getCellData(1, 1).value, 12, 'row 2 cell 2');
    });

    QUnit.test('The export to Excel api method', function(assert) {
        const onExportedStub = sinon.stub();
        const onExportingStub = sinon.stub();
        const onFileSavingStub = sinon.stub();

        sinon.stub(clientExporter, 'export');
        this.setupModules({
            'export': {
                enabled: true,
                excelFilterEnabled: true,
                fileName: 'testName',
                proxyUrl: 'testProxy'
            }
        });
        sinon.stub(this.exportController, 'getAction', function(arg) {
            if(arg === 'onExporting') {
                return onExportingStub;
            } else if(arg === 'onExported') {
                return onExportedStub;
            } else if(arg === 'onFileSaving') {
                return onFileSavingStub;
            }
        });
        sinon.stub(this.exportController.component, 'getDataProvider');

        this.exportController.exportToExcel();

        assert.equal(clientExporter.export.callCount, 1, 'exporting is called');
        assert.deepEqual(clientExporter.export.getCall(0).args[0], this.exportController.component.getDataProvider.getCall(0).returnValue, 'First arg is data');

        assert.deepEqual(clientExporter.export.getCall(0).args[1], {
            autoFilterEnabled: true,
            exportedAction: onExportedStub,
            exportingAction: onExportingStub,
            ignoreErrors: true,
            fileName: 'testName',
            fileSavingAction: onFileSavingStub,
            format: 'EXCEL',
            proxyUrl: 'testProxy',
            rtlEnabled: false
        }, 'options');

        assert.deepEqual(clientExporter.export.getCall(0).args[2], clientExporter.excel.getData, 'Export to excel function is correct');

        clientExporter.export.restore();
        this.exportController.getAction.restore();
        this.exportController.component.getDataProvider.restore();
    });

    QUnit.test('Default options', function(assert) {
        sinon.stub(clientExporter, 'export');
        this.setupModules({}, true);

        this.exportController.exportToExcel();

        assert.deepEqual(clientExporter.export.getCall(0).args[1], {
            autoFilterEnabled: false,
            exportedAction: undefined,
            exportingAction: undefined,
            ignoreErrors: true,
            fileName: 'DataGrid',
            fileSavingAction: undefined,
            format: 'EXCEL',
            proxyUrl: undefined,
            rtlEnabled: false
        }, 'options');

        clientExporter.export.restore();
    });

    QUnit.test('get header row count when headers is visible', function(assert) {
        this.setupModules({
            showColumnHeaders: true,
            columns: [{
                dataField: 'TestField1', width: 100, dataType: 'string'
            },
            {
                caption: 'Band Column 1', columns: [
                    {
                        dataField: 'TestField2', width: 40, dataType: 'number'
                    },
                    {
                        dataField: 'TestField3', width: 50, dataType: 'date'
                    },
                    {
                        caption: 'Band Column 2', columns: [
                            {
                                dataField: 'TestField4', width: 90, dataType: 'boolean'
                            }
                        ]
                    }
                ]
            }]
        });
        const dataProvider = this.exportController.getDataProvider();
        dataProvider.ready();

        // act, assert
        assert.ok(dataProvider.isHeadersVisible(), 'headers is visible');
        assert.equal(dataProvider.getHeaderRowCount(), 3, 'count header row');
    });

    QUnit.test('get header row count when headers is hidden', function(assert) {
        this.setupModules({
            showColumnHeaders: false,
            columns: [{
                dataField: 'TestField1', width: 100, dataType: 'string'
            },
            {
                caption: 'Band Column 1', columns: [
                    {
                        dataField: 'TestField2', width: 40, dataType: 'number'
                    },
                    {
                        dataField: 'TestField3', width: 50, dataType: 'date'
                    },
                    {
                        caption: 'Band Column 2', columns: [
                            {
                                dataField: 'TestField4', width: 90, dataType: 'boolean'
                            }
                        ]
                    }
                ]
            }]
        });
        const dataProvider = this.exportController.getDataProvider();
        dataProvider.ready();

        // act, assert
        assert.ok(!dataProvider.isHeadersVisible(), 'headers is visible');
        assert.equal(dataProvider.getHeaderRowCount(), 0, 'count header row');
    });

    QUnit.test('get cell merging', function(assert) {
        this.setupModules({
            showColumnHeaders: true,
            columns: [{
                dataField: 'TestField1', width: 100, dataType: 'string'
            },
            {
                caption: 'Band Column 1', columns: [
                    {
                        dataField: 'TestField2', width: 40, dataType: 'number'
                    },
                    {
                        dataField: 'TestField3', width: 50, dataType: 'date'
                    },
                    {
                        caption: 'Band Column 2', columns: [
                            {
                                dataField: 'TestField4', width: 90, dataType: 'boolean'
                            }
                        ]
                    }
                ]
            }]
        });
        const dataProvider = this.exportController.getDataProvider();
        dataProvider.ready();

        // act, assert
        assert.deepEqual(dataProvider.getCellMerging(0, 0), { colspan: 0, rowspan: 2 }, 'merging of the first cell');
        assert.deepEqual(dataProvider.getCellMerging(0, 1), { colspan: 2, rowspan: 0 }, 'merging of the second cell');
        assert.deepEqual(dataProvider.getCellMerging(2, 0), { colspan: 0, rowspan: 0 }, 'merging of the sixth cell');
    });

    QUnit.test('get frozen area', function(assert) {
        this.setupModules({
            showColumnHeaders: true,
            columns: [{
                dataField: 'TestField1', width: 100, dataType: 'string'
            },
            {
                caption: 'Band Column 1', columns: [
                    {
                        dataField: 'TestField2', width: 40, dataType: 'number'
                    },
                    {
                        dataField: 'TestField3', width: 50, dataType: 'date'
                    },
                    {
                        caption: 'Band Column 2', columns: [
                            {
                                dataField: 'TestField4', width: 90, dataType: 'boolean'
                            }
                        ]
                    }
                ]
            }]
        });
        const dataProvider = this.exportController.getDataProvider();
        dataProvider.ready();

        // act, assert
        assert.deepEqual(dataProvider.getFrozenArea(), { x: 0, y: 3 }, 'frozen aria');
    });

    QUnit.test('Header styles', function(assert) {
        this.setupModules({
            dataSource: [
                { TestField1: 'test1', TestField2: 1 }
            ],
            showColumnHeaders: true,
            columns: [{
                dataField: 'TestField1', dataType: 'string'
            }, {
                dataField: 'TestField2', dataType: 'number', format: 'currency'
            }]
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        const styles = dataProvider.getStyles();

        // assert, act
        assert.strictEqual(dataProvider.getStyleId(0, 0), dataProvider.getStyleId(0, 1), 'used same styles for header');
        assert.deepEqual(styles[dataProvider.getStyleId(0, 0)], {
            bold: true,
            alignment: 'center',
            wrapText: true
        });
    });

    QUnit.test('data styles. column headers are hidden', function(assert) {
        this.setupModules({
            dataSource: [
                { TestField1: 'test1', TestField2: 1 }
            ],
            showColumnHeaders: false,
            columns: [{
                dataField: 'TestField1', dataType: 'string', alignment: 'right'
            }]
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        const styles = dataProvider.getStyles();

        // assert, act
        assert.deepEqual(styles[dataProvider.getStyleId(0, 0)], {
            alignment: 'right',
            wrapText: false,
            format: undefined,
            dataType: 'string'
        });
    });

    QUnit.test('data styles', function(assert) {
        this.setupModules({
            dataSource: [
                { TestField1: 'test1', TestField2: 1 }
            ],
            showColumnHeaders: true,
            columns: [{
                dataField: 'TestField1', dataType: 'string', alignment: 'right'
            }, {
                dataField: 'TestField2', dataType: 'number', format: { type: 'currency', precision: 0 }
            }]
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        const styles = dataProvider.getStyles();

        // assert, act
        assert.deepEqual(styles[dataProvider.getStyleId(1, 0)], {
            alignment: 'right',
            wrapText: false,
            format: undefined,
            dataType: 'string'
        });

        assert.deepEqual(styles[dataProvider.getStyleId(1, 1)], {
            alignment: 'right',
            wrapText: false,
            format: {
                type: 'currency',
                precision: 0
            },
            dataType: 'number'
        });
    });

    QUnit.test('data wrapText enabled. wrapTextEnabled option is set to true', function(assert) {
        this.setupModules({
            dataSource: [
                { TestField1: 'test1', TestField2: 1 }
            ],
            showColumnHeaders: true,
            wordWrapEnabled: true,
            columns: [{ dataField: 'TestField1', dataType: 'string', alignment: 'right' }]
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        const styles = dataProvider.getStyles();

        // assert, act
        assert.strictEqual(styles[dataProvider.getStyleId(0, 0)].wrapText, true, 'header');
        assert.strictEqual(styles[dataProvider.getStyleId(1, 0)].wrapText, true, 'data');
    });

    QUnit.test('data wrapText enabled. wrapTextEnabled option is set to true', function(assert) {
        this.setupModules({
            dataSource: [
                { TestField1: 'test1', TestField2: 1 }
            ],
            showColumnHeaders: true,
            wordWrapEnabled: true,
            export: {
                excelWrapTextEnabled: false
            },
            columns: [{ dataField: 'TestField1', dataType: 'string', alignment: 'right' }]
        });
        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();

        this.clock.tick();

        const styles = dataProvider.getStyles();

        // assert, act
        assert.strictEqual(styles[dataProvider.getStyleId(0, 0)].wrapText, true, 'header');
        assert.strictEqual(styles[dataProvider.getStyleId(1, 0)].wrapText, false, 'data');
    });

    // T592026
    QUnit.test('Get columns from data provider when there is datetime column', function(assert) {
        this.setupModules({
            showColumnHeaders: true,
            columns: [{
                dataField: 'TestField1', width: 100, dataType: 'string'
            }, {
                dataField: 'TestField2', width: 40, dataType: 'number'
            }, {
                dataField: 'TestField3', width: 50, dataType: 'date'
            }, {
                dataField: 'TestField4', width: 90, dataType: 'datetime'
            }]
        });

        const dataProvider = this.exportController.getDataProvider();

        dataProvider.ready();
        const columns = dataProvider.getColumns();

        assert.equal(columns.length, 4, 'columns length');
        assert.ok(columnCompare(columns[0], { width: 100, dataType: 'string', alignment: 'left', caption: 'Test Field 1' }), 'column 1');
        assert.ok(columnCompare(columns[1], { width: 40, dataType: 'number', alignment: 'right', caption: 'Test Field 2' }), 'column 2');
        assert.ok(columnCompare(columns[2], { width: 50, dataType: 'date', format: 'shortDate', alignment: 'left', caption: 'Test Field 3' }), 'column 3');
        assert.ok(columnCompare(columns[3], { width: 90, dataType: 'date', format: 'shortDateShortTime', alignment: 'left', caption: 'Test Field 4' }), 'column 4');
    });
});

QUnit.module('Export menu', {
    beforeEach: function() {
        this.setupModules = function(options, initDefaultOptions) {
            this.options = options.options;
            setupDataGridModules(this, ['data', 'columns', 'rows', 'headerPanel', 'editing', 'editingCellBased', 'stateStoring', 'export', 'editorFactory', 'search', 'columnChooser', 'grouping'], {
                initViews: true,
                initDefaultOptions: initDefaultOptions,
                options: options
            });

            this.headerPanel.component.element = function() { return $('#container'); };
        };
        this._createComponent = function() { return {}; };
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {

    QUnit.test('The export to button is shown', function(assert) {
        this.setupModules({
            'export': {
                enabled: true,
                allowExportSelectedData: true
            }
        }, true);

        const $container = $('#container');

        this.headerPanel.render($container);

        assert.ok(this.headerPanel.isVisible(), 'is visible');
        assert.ok(this.headerPanel._exportController, 'export controller');

        const $button = $container.find('.dx-datagrid-export-button');
        assert.equal($button.length, 1, 'export button is contained in a DOM');
        assert.equal($button.first().attr('title'), 'Export', 'hint of button');
    });

    QUnit.test('Search panel should be replaced after export button', function(assert) {
        this.setupModules({
            'export': {
                enabled: true
            },
            columnChooser: {
                enabled: true
            },
            searchPanel: {
                visible: true
            },
            groupPanel: {
                visible: true
            }
        }, true);

        const $container = $('#container');

        this.headerPanel.render($container);

        const $toolbarItems = $container.find('.dx-toolbar-item');
        assert.equal($toolbarItems.length, 4, 'groupPanel + 2 buttons + 1 editor');

        assert.equal($toolbarItems.eq(0).find('.dx-datagrid-group-panel').length, 1);
        assert.equal($toolbarItems.eq(1).find('.dx-datagrid-export-button').length, 1);
        assert.equal($toolbarItems.eq(2).find('.dx-datagrid-column-chooser-button').length, 1);
        assert.equal($toolbarItems.eq(3).find('.dx-datagrid-search-panel').length, 1);
    });

    QUnit.test('Export\'s menu buttons has a correct markup', function(assert) {
        this.setupModules({
            'export': {
                enabled: true
            },
            columnChooser: {
                enabled: true
            },
            searchPanel: {
                visible: true
            },
            groupPanel: {
                visible: true
            }
        }, true);

        const $container = $('#container').width(100);
        const renderButtonSpy = sinon.spy(this.headerPanel, '_renderButton');
        const checkingSelector = '.dx-toolbar-item-auto-hide > .dx-button';

        this.headerPanel.render($container);
        $container.find('.dx-toolbar-menu-container .dx-dropdownmenu-button').trigger('dxclick');

        assert.equal(renderButtonSpy.callCount, 2);
        assert.equal(renderButtonSpy.getCall(1).args[1].find(checkingSelector).length, 1);
    });

    QUnit.test('Export\'s fake menu buttons has a correct markup', function(assert) {
        this.setupModules({
            'export': {
                enabled: true,
                allowExportSelectedData: true
            },
            columnChooser: {
                enabled: true
            },
            searchPanel: {
                visible: true
            },
            groupPanel: {
                visible: true
            }
        }, true);

        const checkingSelector = '.dx-toolbar-item-auto-hide > .dx-button.dx-button-has-text.dx-button-has-icon.' +
        'dx-datagrid-toolbar-button > .dx-button-content > .dx-icon + .dx-button-text';

        const $container = $('#container').width(100);
        const renderFakeButtonSpy = sinon.spy(this.headerPanel, '_renderFakeButton');

        this.headerPanel.render($container);

        $container.find('.dx-toolbar-menu-container .dx-dropdownmenu-button').trigger('dxclick');

        assert.equal(renderFakeButtonSpy.callCount, 2);

        const $firstItem = renderFakeButtonSpy.getCall(0).args[1];
        const $secondItem = renderFakeButtonSpy.getCall(1).args[1];

        assert.equal($firstItem.find(checkingSelector.replace('dx-icon', 'dx-icon.dx-icon-xlsxfile')).length, 1);
        assert.equal($secondItem.find(checkingSelector.replace('dx-icon', 'dx-icon.dx-icon-exportselected')).length, 1);
    });

    QUnit.test('The export button is not shown', function(assert) {
        this.setupModules({
            'export': {
                enabled: false
            }
        });

        const $container = $('#container');
        this.headerPanel.render($container);

        assert.ok(!this.headerPanel.isVisible(), 'is visible');
        assert.equal($container.find('.dx-datagrid-export-button').length, 0, 'export button is contained in a DOM');
    });

    QUnit.test('The export button is not shown when header panel is visible', function(assert) {
        this.setupModules({
            editing: {
                mode: 'batch',
                allowUpdating: true
            }
        }, true);

        const $container = $('#container');
        this.headerPanel.render($container);

        assert.equal($container.find('.dx-datagrid-export-button').length, 0, 'export button is contained in a DOM');
    });

    QUnit.test('Show export button via option when export is disabled', function(assert) {
        this.setupModules({
            'export': {
                enabled: false
            }
        }, true);

        const $container = $('#container');
        this.headerPanel._$element = $container;
        this.headerPanel.option('export.enabled', true);
        this.headerPanel.component.isReady = function() {
            return true;
        };
        this.headerPanel.beginUpdate();
        this.headerPanel.optionChanged({ name: 'export', fullName: 'export.enabled', value: true });
        this.headerPanel.endUpdate();

        assert.ok(this.headerPanel.isVisible(), 'is visible');
        assert.ok(this.headerPanel._exportController, 'export controller');
        assert.equal($container.find('.dx-datagrid-export-button').length, 1, 'export button is contained in a DOM');
    });

    QUnit.test('Show export to excel button when allowExportSelectedData is disabled', function(assert) {
        this.setupModules({
            'export': {
                enabled: true
            }
        }, true);

        const $container = $('#container');

        this.headerPanel.render($container);

        assert.ok(this.headerPanel.isVisible(), 'is visible');
        assert.ok(this.headerPanel._exportController, 'export controller');

        const $exportButton = $container.find('.dx-datagrid-export-button');
        assert.equal($exportButton.length, 1, 'export button is contained in a DOM');
        assert.equal($exportButton.attr('title'), 'Export all data', 'hint of button');
    });

    QUnit.test('Export menu elements doesn\'t leak', function(assert) {
        this.setupModules({
            'export': {
                enabled: true,
                allowExportSelectedData: true
            }
        }, true);

        const $container = $('#container');

        this.headerPanel.render($container);
        this.refresh();

        const $exportMenu = $container.find('.dx-datagrid-export-menu');

        assert.equal($exportMenu.length, 1, 'only one export menu element is contained in a DOM');
    });

    QUnit.test('Export button disable on editing', function(assert) {
        this.setupModules({
            'export': {
                enabled: true
            }
        }, true);

        const $container = $('#container');
        let $exportButton;

        this.headerPanel.render($container);
        $exportButton = $container.find('.dx-datagrid-export-button');

        assert.ok(!$exportButton.closest('.dx-toolbar-item').hasClass('dx-state-disabled'), 'Export button is enabled before editing start');

        this.editingController.hasChanges = function() { return true; };
        this.editingController._updateEditButtons();

        assert.ok($exportButton.closest('.dx-toolbar-item').hasClass('dx-state-disabled'), 'Export button is disabled after editing');

        this.editingController.hasChanges = function() { return false; };
        this.editingController._updateEditButtons();
        $exportButton = $container.closest('.dx-toolbar-item').find('.dx-datagrid-export-button');

        assert.ok(!$exportButton.hasClass('dx-state-disabled'), 'Export button is enabled after saving');
    });

    QUnit.test('Show the export to excel button and a context menu via an option', function(assert) {
        this.setupModules({
            'export': {
                enabled: true
            }
        }, true);

        const $container = $('#container');

        this.$element = function() {
            return $container;
        };

        this.headerPanel.render($container);
        this.headerPanel._$element = $container;
        this.headerPanel.option('export.allowExportSelectedData', true);
        this.headerPanel.component.isReady = function() {
            return true;
        };
        this.headerPanel.beginUpdate();
        this.headerPanel.optionChanged({ name: 'export', fullName: 'export.allowExportSelectedData', value: true });
        this.headerPanel.endUpdate();

        const $exportButton = $container.find('.dx-datagrid-export-button').first();
        $($exportButton).trigger('dxclick');
        const $exportMenu = $('.dx-context-menu.dx-datagrid-export-menu').first();

        assert.equal($exportButton.attr('title'), 'Export', 'hint of button');
        assert.ok($exportMenu.length > 0);
    });

    QUnit.test('Context menu is removed when the allowExportSelectedData option is changed', function(assert) {
        this.setupModules({
            'export': {
                enabled: true,
                allowExportSelectedData: true
            }
        }, true);

        const $container = $('#container');

        this.$element = function() {
            return $container;
        };

        this.headerPanel.render($container);
        this.headerPanel._$element = $container;
        this.headerPanel.component.isReady = function() {
            return true;
        };
        this.headerPanel.option('export.allowExportSelectedData', false);
        this.headerPanel.beginUpdate();
        this.headerPanel.optionChanged({ name: 'export', fullName: 'export.allowExportSelectedData', value: false });
        this.headerPanel.endUpdate();

        const $exportMenu = $('.dx-context-menu.dx-datagrid-export-menu').first();

        assert.strictEqual($exportMenu.length, 0);
    });

    QUnit.test('Hide export button via option', function(assert) {
        const $container = $('#container');

        this.setupModules({
            'export': {
                enabled: true
            }
        }, true);

        this.headerPanel.render($container);
        this.headerPanel.option('export.enabled', false);
        this.headerPanel.render($container);

        assert.ok(!this.headerPanel.isVisible(), 'is visible');
    });

    QUnit.test('Hide export button via option when editing is defined', function(assert) {
        this.setupModules({
            'export': {
                enabled: true
            },
            editing: {
                mode: 'batch',
                allowUpdating: true
            }
        }, true);

        const $container = $('#container');

        this.headerPanel.render($container);
        this.headerPanel._$element = $container;
        this.headerPanel.component.isReady = function() {
            return true;
        };
        this.headerPanel.option('export.enabled', false);
        this.headerPanel.beginUpdate();
        this.headerPanel.optionChanged({ name: 'export', fullName: 'export.enabled', value: false });
        this.headerPanel.endUpdate();

        assert.ok(this.headerPanel.isVisible(), 'is visible');

        const $exportButton = $container.find('.dx-datagrid-export-button');
        assert.equal($exportButton.length, 0, 'export button is not render');
    });

    QUnit.test('Show export button via option when the enabled option is disabled', function(assert) {
        this.setupModules({
            'export': {
                enabled: true
            }
        }, true);

        const $container = $('#container');

        this.headerPanel.render($container);
        this.headerPanel._$element = $container;

        this.headerPanel.option('export.enabled', false);
        this.headerPanel.optionChanged({ name: 'export', fullName: 'export.enabled', value: false });

        this.headerPanel.option('export.enabled', true);
        this.headerPanel.optionChanged({ name: 'export', fullName: 'export.enabled', value: true });


        assert.ok(this.headerPanel.isVisible(), 'is visible');
        const $exportButton = $container.find('.dx-datagrid-export-button');
        assert.equal($exportButton.length, 1, 'export button is contained in a DOM');
        assert.notStrictEqual($exportButton.css('display'), 'none', 'export button is shown');
    });

    QUnit.test('The export context menu is shown', function(assert) {
        this.setupModules({
            'export': {
                enabled: true,
                allowExportSelectedData: true
            }
        }, true);

        const $container = $('#container');

        this.$element = function() {
            return $container;
        };

        this.headerPanel.render($container);
        const $exportButton = $container.find('.dx-datagrid-export-button').first();
        $($exportButton).trigger('dxclick');

        const $exportMenu = $('.dx-context-menu.dx-datagrid-export-menu').first();
        assert.ok($exportMenu.length > 0);
        assert.equal($exportMenu.css('display'), 'block', 'menu visibility');
    });

    QUnit.test('Export context menu items', function(assert) {
        this.setupModules({
            'export': {
                enabled: true,
                allowExportSelectedData: true
            }
        }, true);

        const $container = $('#container');

        this.$element = function() {
            return $container;
        };

        this.headerPanel.render($container);

        const $menu = $container.find('.dx-datagrid-export-menu');
        const menuInstance = $menu.dxContextMenu('instance');

        menuInstance.option('animation', false);
        const menuItems = menuInstance.option('items');
        menuInstance.show();

        assert.equal(menuItems[0].text, 'Export all data', '1 item');
        assert.equal(menuItems[1].text, 'Export selected rows', '2 item text');
    });

    QUnit.test('Context menu is hidden when item with export format is clicked', function(assert) {
        this.setupModules({
            'export': {
                enabled: true,
                allowExportSelectedData: true
            }
        }, true);

        const $container = $('#container');

        this.$element = function() {
            return $container;
        };

        this.headerPanel.render($container);

        const $menu = $container.find('.dx-datagrid-export-menu');
        const menuInstance = $menu.dxContextMenu('instance');

        this.exportController.exportToExcel = noop;
        menuInstance.option('animation', false);

        const $menuItems = $(menuInstance.$element().find('.dx-menu-item'));
        $($menuItems.first()).trigger('dxclick');

        assert.ok(!menuInstance.option('visible'), 'menu is hidden');
    });

    QUnit.test('Context menu is hidden when item with export selected is clicked', function(assert) {
        this.setupModules({
            'export': {
                enabled: true,
                allowExportSelectedData: true
            }
        }, true);

        const $container = $('#container');

        this.$element = function() {
            return $container;
        };

        this.headerPanel.render($container);

        const $menu = $container.find('.dx-datagrid-export-menu');
        const menuInstance = $menu.dxContextMenu('instance');

        this.exportController.exportToExcel = noop;
        menuInstance.option('animation', false);

        const $menuItems = $(menuInstance.$element().find('.dx-menu-item'));
        $($menuItems.eq(1)).trigger('dxclick');

        assert.ok(!menuInstance.option('visible'), 'menu is hidden');
    });

    // T364045: dxDataGrid - Export to Excel is not working when the Export button text is localized
    QUnit.test('Export to Excel button call`s exportTo when the button text is localized', function(assert) {
    // arrange

        messageLocalization.load({
            'en': {
                'dxDataGrid-excelFormat': 'testItemName'
            }
        });

        this.setupModules({
            'export': {
                enabled: true,
                allowExportSelectedData: true
            },
            stateStoring: {
                enabled: true
            }
        }, true);

        const $container = $('#container');
        let exportToCalled = false;

        this.$element = function() {
            return $container;
        };

        this.stateStoringController.state({ exportSelectionOnly: true });
        this.headerPanel.render($container);

        const $menu = $container.find('.dx-datagrid-export-menu');
        const menuInstance = $menu.dxContextMenu('instance');

        menuInstance.show();
        const $menuItems = menuInstance.itemsContainer().find('.dx-menu-item');
        const _exportToExcel = this.headerPanel._exportController.exportToExcel;
        this.headerPanel._exportController.exportToExcel = function() {
            exportToCalled = true;
        };

        $($menuItems.first()).trigger('dxclick');

        assert.ok(exportToCalled, 'exportTo Called');
        this.headerPanel._exportController.exportToExcel = _exportToExcel;
    });
});

QUnit.module('Real dataGrid ExportController tests', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {

    const createDataGrid = function(options) {
        const dataGridElement = $('#container').dxDataGrid(options);

        QUnit.assert.ok(dataGridElement);
        const dataGrid = dataGridElement.dxDataGrid('instance');
        return dataGrid;
    };

    // T310793
    QUnit.test('Get columns with width from rowsView after grouping', function(assert) {
        const options = {
            width: 300,
            loadingTimeout: 0,
            groupPanel: { visible: true },
            grouping: { autoExpandAll: false },
            dataSource: [
                { 'TestField1': 1, 'TestField2': 2, 'TestField3': 3, 'TestField4': 4 },
                { 'TestField1': 1, 'TestField2': 2, 'TestField3': 3, 'TestField4': 4 },
                { 'TestField1': 1, 'TestField2': 2, 'TestField3': 3, 'TestField4': 4 },
                { 'TestField1': 1, 'TestField2': 2, 'TestField3': 3, 'TestField4': 4 }
            ],
            columns: [{
                dataField: 'TestField1', dataType: 'string', groupIndex: 1
            }, {
                dataField: 'TestField2', dataType: 'number'
            }, {
                dataField: 'TestField3', dataType: 'date'
            }, {
                dataField: 'TestField4', dataType: 'boolean'
            }]
        };
        const dataGrid = createDataGrid(options);

        this.clock.tick();
        const dataProvider = dataGrid.getController('export').getDataProvider();

        dataProvider.ready();
        const columns = dataProvider.getColumns();

        assert.equal(columns.length, 3, 'columns length');
        assert.equal(columns[0].width, 90, '1 column width');
        assert.equal(columns[1].width, 90, '2 column width');
        assert.equal(columns[2].width, 90, '3 column width');
    });

    QUnit.test('Get columns with width when headers is hidden', function(assert) {
        const options = {
            width: 300,
            loadingTimeout: 0,
            dataSource: [
                { 'TestField1': 1, 'TestField2': 2, 'TestField3': 3, 'TestField4': 4 },
                { 'TestField1': 1, 'TestField2': 2, 'TestField3': 3, 'TestField4': 4 },
                { 'TestField1': 1, 'TestField2': 2, 'TestField3': 3, 'TestField4': 4 },
                { 'TestField1': 1, 'TestField2': 2, 'TestField3': 3, 'TestField4': 4 }
            ],
            showColumnHeaders: false,
            columns: [{
                dataField: 'TestField1', dataType: 'string'
            }, {
                dataField: 'TestField2', dataType: 'number'
            }, {
                dataField: 'TestField3', dataType: 'date'
            }, {
                dataField: 'TestField4', dataType: 'boolean'
            }]
        };
        const dataGrid = createDataGrid(options);
        this.clock.tick();
        const dataProvider = dataGrid.getController('export').getDataProvider();

        dataProvider.ready();
        const columns = dataProvider.getColumns();

        assert.equal(columns.length, 4, 'columns length');
        assert.equal(columns[0].width, 75, '1 column width');
        assert.equal(columns[1].width, 75, '2 column width');
        assert.equal(columns[2].width, 75, '3 column width');
        assert.equal(columns[3].width, 75, '4 column width');
    });

    QUnit.test('Customize a data and a columns before exporting', function(assert) {
        const options = {
            width: 300,
            customizeExportData: function(columns, data) {
                columns[2].width = 333;
                for(let i = 0; i < data.length; i++) {
                    const item = data[i];
                    if(item.rowType === 'data') {
                        item.values[1] = 'TEST ' + item.values[1] * 10;
                    }
                }
            },
            loadingTimeout: null,
            dataSource: [
                { 'TestField1': 1, 'TestField2': 2, 'TestField3': 3, 'TestField4': 4 },
                { 'TestField1': 1, 'TestField2': 2, 'TestField3': 3, 'TestField4': 4 },
                { 'TestField1': 1, 'TestField2': 2, 'TestField3': 3, 'TestField4': 4 },
                { 'TestField1': 1, 'TestField2': 2, 'TestField3': 3, 'TestField4': 4 }
            ],
            columns: [{ dataField: 'TestField1', groupIndex: 0 }, 'TestField2', 'TestField3', 'TestField4']
        };
        const dataGrid = createDataGrid(options);
        const columnsController = dataGrid.getController('columns');
        const dataController = dataGrid.getController('data');
        const dataProvider = dataGrid.getController('export').getDataProvider();

        this.clock.tick();
        dataProvider.ready();
        this.clock.tick();

        const columns = columnsController.getVisibleColumns();
        const items = dataController.items();
        const exportedColumns = dataProvider.getColumns();
        const exportedItems = dataProvider._options.items;

        assert.equal(exportedColumns[2].width, 333, 'third exported column\'s width');
        assert.equal(exportedItems[1].values[1], 'TEST 30', '2 exported item of data');
        assert.equal(exportedItems[2].values[1], 'TEST 30', '3 exported item of data');
        assert.equal(exportedItems[3].values[1], 'TEST 30', '4 exported item of data');
        assert.equal(exportedItems[4].values[1], 'TEST 30', '5 exported item of data');

        assert.notStrictEqual(columns[2].width, 333, 'third column\'s width');
        assert.equal(items[1].values[2], '3', '2 item of data');
        assert.equal(items[2].values[2], '3', '3 item of data');
        assert.equal(items[3].values[2], '3', '4 item of data');
        assert.equal(items[4].values[2], '3', '5 item of data');
    });

    // T399787
    QUnit.test('PrepareItems with extended Array prototypes', function(assert) {
        const items = [[{ test: 'test' }], [{ test: 'test' }]];

        items.test = function() { }; // As appending prototype method to array

        const resultItems = exportMixin._prepareItems(items);

        assert.deepEqual(resultItems, [
            [{
                colspan: 1,
                rowspan: 1,
                test: 'test'
            }],
            [{
                colspan: 1,
                rowspan: 1,
                test: 'test'
            }]
        ], 'PrepareItems is correct with custom Array prototype method');
    });
});

