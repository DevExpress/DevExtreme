import $ from 'jquery';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import { isFunction } from 'core/utils/type';
import { JSPdfDataGridTestHelper } from './jspdfTestHelper.js';
import { exportDataGrid } from 'pdf_exporter';

import 'ui/data_grid/ui.data_grid';

import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(() => {
    const markup = '<div id="dataGrid"></div>';

    $('#qunit-fixture').html(markup);
});

let helper;

const moduleConfig = {
    beforeEach: function() {
        // The transpiling of the script on the drone and locally has differences that affect the imported jsPDF type.
        const _jsPDF = isFunction(jsPDF) ? jsPDF : jsPDF.jsPDF;
        this.jsPDFDocument = _jsPDF('p', 'pt', 'a4');

        helper = new JSPdfDataGridTestHelper(this.jsPDFDocument);
    }
};

QUnit.module('Scenarios, check autoTableOptions', moduleConfig, () => {
    const getOptions = (context, dataGrid, options) => {
        const { keepColumnWidths = true, selectedRowsOnly = false, autoTableOptions = {} } = options || {};

        const result = {
            component: dataGrid,
            jsPDFDocument: context.jsPDFDocument
        };
        result.keepColumnWidths = keepColumnWidths;
        result.selectedRowsOnly = selectedRowsOnly;
        result.autoTableOptions = autoTableOptions;
        return result;
    };

    QUnit.test('Empty grid', function(assert) {
        const done = assert.async();
        const dataGrid = $('#dataGrid').dxDataGrid({}).dxDataGrid('instance');
        const options = {
            autoTableOptions: { tableWidth: 250 }
        };

        const expectedCells = {
            head: [],
            body: []
        };

        exportDataGrid(getOptions(this, dataGrid, options)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Simple grid', function(assert) {
        const done = assert.async();
        const ds = [{ prop1: 'text1' }];
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            columns: [{ dataField: 'prop1', caption: 'f1' }],
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[{ content: 'f1' }]],
            body: [[{ content: 'text1' }]]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Header - 1 column, showColumnHeaders: false', function(assert) {
        const done = assert.async();
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [{ caption: 'f1' }],
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = { head: [] };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'head');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'head');
            done();
        });
    });

    [
        { visible: true, expectedCells: { head: [[{ content: 'f1' }]] } },
        { visible: false, expectedCells: { head: [] } }
    ].forEach((config) => {
        QUnit.test(`Header - 1 column, column.visible: ${config.visible}`, function(assert) {
            const done = assert.async();
            const dataGrid = $('#dataGrid').dxDataGrid({
                columns: [{ caption: 'f1', visible: config.visible }],
                loadingTimeout: undefined
            }).dxDataGrid('instance');

            exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
                const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
                helper.checkRowAndColumnCount(config.expectedCells, autoTableOptions, 'head');
                helper.checkCellsContent(config.expectedCells, autoTableOptions, 'head');
                done();
            });
        });
    });

    [
        { allowExporting: true, expectedCells: { head: [[{ content: 'f1' }]] } },
        { allowExporting: false, expectedCells: { head: [] } }
    ].forEach((config) => {
        QUnit.test(`Header - 1 column, column.allowExporting: ${config.allowExporting}`, function(assert) {
            const done = assert.async();
            const dataGrid = $('#dataGrid').dxDataGrid({
                columns: [{ caption: 'f1', allowExporting: config.allowExporting }],
                loadingTimeout: undefined
            }).dxDataGrid('instance');

            exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
                const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
                helper.checkRowAndColumnCount(config.expectedCells, autoTableOptions, 'head');
                helper.checkCellsContent(config.expectedCells, autoTableOptions, 'head');
                done();
            });
        });
    });

    ['left', 'center', 'right'].forEach((alignment) => {
        QUnit.test(`Header - 1 column, column.alignment: ${alignment}`, function(assert) {
            const done = assert.async();
            const dataGrid = $('#dataGrid').dxDataGrid({
                columns: [{ caption: 'f1', alignment: alignment }],
                loadingTimeout: undefined
            }).dxDataGrid('instance');

            const expectedCells = {
                head: [[{ content: 'f1', styles: { 'halign': alignment } }]]
            };

            exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
                const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'head');
                helper.checkCellsStyles(expectedCells, autoTableOptions, 'head');
                helper.checkCellsContent(expectedCells, autoTableOptions, 'head');
                done();
            });
        });
    });

    QUnit.test('Header - 1 column, grid.wordWrapEnabled: true', function(assert) {
        const done = assert.async();

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [{ caption: 'f1' }],
            wordWrapEnabled: true
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[{ content: 'f1' }]]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'head');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'head');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'head');
            done();
        });
    });

    [true, false].forEach((keepColumnWidths) => {
        QUnit.test(`Header - 2 Columns - column widths, keepColumnWidths: ${keepColumnWidths}`, function(assert) {
            const done = assert.async();
            const dataGrid = $('#dataGrid').dxDataGrid({
                keyExpr: 'f1',
                columns: [{ caption: 'f1', width: 50 }, { caption: 'f2' }],
                loadingTimeout: undefined,
                width: 500
            }).dxDataGrid('instance');
            const options = {
                autoTableOptions: {
                    tableWidth: 250,
                    columnStyles: { 0: { cellWidth: 100 } }
                },
                keepColumnWidths: keepColumnWidths
            };

            const expectedColumnWidths = keepColumnWidths ? [25, 225] : [100, 'auto'];
            const expectedCells = { head: [[{ content: 'f1' }, { content: 'f2' }]] };

            exportDataGrid(getOptions(this, dataGrid, options)).then((jsPDFDocument) => {
                const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
                assert.strictEqual(autoTableOptions.tableWidth, 250, 'autoTableWidth');
                helper.checkColumnWidths(expectedColumnWidths, autoTableOptions);
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'head');
                helper.checkCellsContent(expectedCells, autoTableOptions, 'head');
                done();
            });
        });
    });

    QUnit.test('Header - 2 Columns - column.visible: false, first hidden', function(assert) {
        const done = assert.async();
        const dataGrid = $('#dataGrid').dxDataGrid({
            keyExpr: 'f1',
            columns: [{ caption: 'f1', visible: false }, { caption: 'f2' }, { caption: 'f3' }],
            loadingTimeout: undefined,
            width: 500
        }).dxDataGrid('instance');
        const options = {
            autoTableOptions: {
                tableWidth: 250,
                columnStyles: { 0: { cellWidth: 100 } }
            }
        };

        const expectedCells = { head: [[{ content: 'f2' }, { content: 'f3' }]] };

        exportDataGrid(getOptions(this, dataGrid, options)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'head');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'head');
            done();
        });
    });

    QUnit.test('Header - 2 Columns - column.visible: false, second hidden', function(assert) {
        const done = assert.async();
        const dataGrid = $('#dataGrid').dxDataGrid({
            keyExpr: 'f1',
            columns: [{ caption: 'f1' }, { caption: 'f2', visible: false }, { caption: 'f3' }],
            loadingTimeout: undefined,
            width: 500
        }).dxDataGrid('instance');
        const options = {
            autoTableOptions: {
                tableWidth: 250,
                columnStyles: { 0: { cellWidth: 100 } }
            }
        };

        const expectedCells = { head: [[{ content: 'f1' }, { content: 'f3' }]] };

        exportDataGrid(getOptions(this, dataGrid, options)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'head');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'head');
            done();
        });
    });

    QUnit.test('Header - 2 Columns - column.visibleIndex', function(assert) {
        const done = assert.async();
        const dataGrid = $('#dataGrid').dxDataGrid({
            keyExpr: 'f1',
            columns: [
                { caption: 'f1', visibleIndex: 1 },
                { caption: 'f2', visibleIndex: 0 }
            ],
            loadingTimeout: undefined,
            width: 500
        }).dxDataGrid('instance');
        const options = {
            autoTableOptions: {
                tableWidth: 250,
                columnStyles: { 0: { cellWidth: 100 } }
            }
        };

        const expectedCells = { head: [[{ content: 'f2' }, { content: 'f1' }]] };

        exportDataGrid(getOptions(this, dataGrid, options)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'head');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'head');
            done();
        });
    });

    QUnit.test('Header - 2 Columns - column.visibleIndex, column.visible: false', function(assert) {
        const done = assert.async();
        const dataGrid = $('#dataGrid').dxDataGrid({
            keyExpr: 'f1',
            columns: [
                { caption: 'f1', visibleIndex: 2 },
                { caption: 'f2', visibleIndex: 1, visible: false },
                { caption: 'f3', visibleIndex: 0 }
            ],
            loadingTimeout: undefined,
            width: 500
        }).dxDataGrid('instance');
        const options = {
            autoTableOptions: {
                tableWidth: 250,
                columnStyles: { 0: { cellWidth: 100 } }
            }
        };

        const expectedCells = { head: [[{ content: 'f3' }, { content: 'f1' }]] };

        exportDataGrid(getOptions(this, dataGrid, options)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'head');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'head');
            done();
        });
    });

    QUnit.test('Header - 2 Columns - column.visibleIndex, column.visible: false, column.allowExporting: false', function(assert) {
        const done = assert.async();
        const dataGrid = $('#dataGrid').dxDataGrid({
            keyExpr: 'f1',
            columns: [
                { caption: 'f1', visibleIndex: 2, visible: false },
                { caption: 'f2', visibleIndex: 1, allowExporting: false },
                { caption: 'f3', visibleIndex: 0 }
            ],
            loadingTimeout: undefined,
            width: 500
        }).dxDataGrid('instance');
        const options = {
            autoTableOptions: {
                tableWidth: 250,
                columnStyles: { 0: { cellWidth: 100 } }
            }
        };

        const expectedCells = { head: [[{ content: 'f3' }]] };

        exportDataGrid(getOptions(this, dataGrid, options)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'head');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'head');
            done();
        });
    });

    QUnit.test('Data - 1 row & 1 columns, showColumnHeaders: false', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'text1' }];
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            columns: [{ dataField: 'f1', caption: 'f1' }],
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = { head: [], body: [[{ content: 'text1' }]] };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    [true, false].forEach((encodeHtml) => {
        QUnit.test(`Data - 1 row & 1 columns, value as html, col.encodeHtml: ${encodeHtml}`, function(assert) {
            const done = assert.async();
            const ds = [{ f1: '<p><strong>text</strong></p>' }];
            const dataGrid = $('#dataGrid').dxDataGrid({
                dataSource: ds,
                columns: [{ dataField: 'f1', caption: 'f1', encodeHtml: encodeHtml }],
                loadingTimeout: undefined
            }).dxDataGrid('instance');

            const expectedCells = {
                head: [[{ content: 'f1' }]],
                body: [[{ content: ds[0].f1 }]]
            };

            exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
                const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
                ['head', 'body'].forEach((rowType) => {
                    helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                    helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                });
                done();
            });
        });
    });

    QUnit.test('Data - 1 row & 4 columns, values as formula string', function(assert) {
        const done = assert.async();
        const ds = [{ f1: '@123', f2: '=123', f3: '-123', f4: '+123' }];
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = { body: [[{ content: ds[0].f1 }, { content: ds[0].f2 }, { content: ds[0].f3 }, { content: ds[0].f4 }]] };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Data - 2 column & 2 rows', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'text1_1', f2: 'text1_2' }, { f1: 'text2_1', f2: 'text2_2' }];
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [{ content: 'text1_1' }, { content: 'text1_2' }],
                [{ content: 'text2_1' }, { content: 'text2_2' }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Data - 2 column & 2 rows, grid.rtlEnabled: true', function(assert) {
        const done = assert.async();
        const ds = [{ f1: '1', f2: '2' }];
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            rtlEnabled: true,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[{ content: 'F1', styles: { 'halign': 'right' } }, { content: 'F2', styles: { 'halign': 'right' } }]],
            body: [
                [{ content: ds[0].f1, styles: { 'halign': 'right' } }, { content: ds[0].f2, styles: { 'halign': 'right' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Data - 2 column & 2 rows, col_2.alignment: right', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'text1_1', f2: 'text1_2' }, { f1: 'text2_1', f2: 'text2_2' }];
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            columns: [ 'f1', { dataField: 'f2', alignment: 'right' }],
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [{ content: 'text1_1', styles: { 'halign': 'left' } }, { content: 'text1_2', styles: { 'halign': 'right' } }],
                [{ content: 'text2_1', styles: { 'halign': 'left' } }, { content: 'text2_2', styles: { 'halign': 'right' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Data - 2 column & 2 rows, wordWrapEnabled = true, col_2.alignment: \'right\'', function(assert) {
        const done = assert.async();
        const ds = [{ f1: '1', f2: '2' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            wordWrapEnabled: true,
            columns: [ 'f1', { dataField: 'f2', alignment: 'right' }],
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [
                [{ content: 'f1', }, { content: 'f2', styles: { 'halign': 'right' } }]
            ],
            body: [
                [{ content: '1', styles: { 'halign': 'left' } }, { content: '2', styles: { 'halign': 'right' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    [
        { dataType: 'string', value: '1', alignment: 'left' },
        { dataType: 'number', value: 1, alignment: 'right' },
        { dataType: 'boolean', value: true, alignment: 'center' },
        { dataType: 'date', value: '1/1/2001', alignment: 'left' },
        { dataType: 'datetime', value: '1/1/2001, 12:00 AM', alignment: 'left' }
    ].forEach((config) => {
        QUnit.test(`Data - columns.dataType: ${config.dataType}`, function(assert) {
            const done = assert.async();
            const ds = [{ f1: config.value }];

            const dataGrid = $('#dataGrid').dxDataGrid({
                columns: [{ dataField: 'f1', dataType: config.dataType }],
                dataSource: ds,
                loadingTimeout: undefined
            }).dxDataGrid('instance');

            const expectedCells = {
                head: [[{ content: 'F1', styles: { 'halign': config.alignment } }]],
                body: [[{ content: config.value, styles: { 'halign': config.alignment } }]]
            };

            exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
                const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
                ['head', 'body'].forEach((rowType) => {
                    helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                    helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                    helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                    helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
                });
                done();
            });
        });
    });

    [
        { dataType: 'string', value: '1', alignment: 'left' },
        { dataType: 'number', value: 1, alignment: 'right' },
        { dataType: 'boolean', value: true, alignment: 'center' },
        { dataType: 'date', value: '1/1/2001', alignment: 'left' },
        { dataType: 'datetime', value: '1/1/2001, 12:00 AM', alignment: 'left' }
    ].forEach((config) => {
        QUnit.test(`Data - columns.dataType: ${config.dataType}, col_1.customizeText: (cell) => 'custom'`, function(assert) {
            const done = assert.async();
            const ds = [{ f1: config.value }];

            const dataGrid = $('#dataGrid').dxDataGrid({
                columns: [
                    {
                        dataField: 'f1',
                        dataType: config.dataType,
                        customizeText: (cell) => 'custom'
                    }
                ],
                dataSource: ds,
                loadingTimeout: undefined,
                showColumnHeaders: false
            }).dxDataGrid('instance');

            const expectedCells = {
                body: [[{ content: 'custom', styles: { 'halign': config.alignment } }]]
            };

            exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
                const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
                helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
                helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
                helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
                done();
            });
        });
    });

    [
        { dataType: 'string', values: ['1', '2'], alignment: 'left' },
        { dataType: 'number', values: [1, 2], alignment: 'right' },
        { dataType: 'boolean', values: [true, false], alignment: 'center' },
        { dataType: 'date', values: ['1/1/2001', '2/2/2002'], alignment: 'left' },
        { dataType: 'datetime', values: ['1/1/2001, 12:00 AM', '2/2/2002, 12:00 AM'], alignment: 'left' }
    ].forEach((config) => {
        QUnit.test(`Data - columns.dataType: ${config.dataType}, selectedRowKeys: [ds[0]]`, function(assert) {
            const done = assert.async();
            const ds = [{ f1: config.values[0] }, { f1: config.values[1] }];

            const dataGrid = $('#dataGrid').dxDataGrid({
                columns: [
                    { dataField: 'f1', dataType: config.dataType }
                ],
                dataSource: ds,
                loadingTimeout: undefined,
                showColumnHeaders: false,
                selectedRowKeys: [ds[0]]
            }).dxDataGrid('instance');

            const expectedCells = {
                body: [[{ content: config.values[0], styles: { 'halign': config.alignment } }]]
            };

            exportDataGrid(getOptions(this, dataGrid, { selectedRowsOnly: true })).then((jsPDFDocument) => {
                const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
                helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
                helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
                helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
                done();
            });
        });
    });

    [
        { dataType: 'string', values: ['1', '2'], alignment: 'left' },
        { dataType: 'number', values: [1, 2], alignment: 'right' },
        { dataType: 'boolean', values: [true, false], alignment: 'center' },
        { dataType: 'date', values: ['1/1/2001', '2/2/2002'], alignment: 'left' },
        { dataType: 'datetime', values: ['1/1/2001, 12:00 AM', '2/2/2002, 12:00 AM'], alignment: 'left' }
    ].forEach((config) => {
        QUnit.test(`Data - columns.dataType: ${config.dataType}, selectedRowKeys: [ds[1]]`, function(assert) {
            const done = assert.async();
            const ds = [{ f1: config.values[0] }, { f1: config.values[1] }];

            const dataGrid = $('#dataGrid').dxDataGrid({
                columns: [{ dataField: 'f1', dataType: config.dataType }],
                dataSource: ds,
                loadingTimeout: undefined,
                showColumnHeaders: false,
                selectedRowKeys: [ds[1]]
            }).dxDataGrid('instance');

            const expectedCells = {
                body: [[{ content: config.values[1], styles: { 'halign': config.alignment } }]]
            };

            exportDataGrid(getOptions(this, dataGrid, { selectedRowsOnly: true })).then((jsPDFDocument) => {
                const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
                helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
                helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
                helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
                done();
            });
        });
    });

    QUnit.test('Data - columns.dataType: string, unbound', function(assert) {
        const done = assert.async();
        const ds = [{ id: 0 }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            columns: [
                { dataType: 'string', calculateCellValue: () => undefined },
                { dataType: 'string', calculateCellValue: () => null },
                { dataType: 'string', calculateCellValue: () => '' },
                { dataType: 'string', calculateCellValue: () => 'str1' },
                { dataType: 'string', calculateCellValue: () => 'str2' }
            ],
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { content: '', styles: { 'halign': 'left' } },
                { content: null, styles: { 'halign': 'left' } },
                { content: '', styles: { 'halign': 'left' } },
                { content: 'str1', styles: { 'halign': 'left' } },
                { content: 'str2', styles: { 'halign': 'left' } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Data - columns.dataType: number, unbound', function(assert) {
        const done = assert.async();
        const ds = [{ id: 0 }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataType: 'number', calculateCellValue: () => undefined },
                { dataType: 'number', calculateCellValue: () => null },
                { dataType: 'number', calculateCellValue: () => 0 },
                { dataType: 'number', calculateCellValue: () => 1 },
                { dataType: 'number', calculateCellValue: () => -2 },
                { dataType: 'number', calculateCellValue: () => Number.POSITIVE_INFINITY },
                { dataType: 'number', calculateCellValue: () => Number.NEGATIVE_INFINITY }
            ],
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { content: '', styles: { 'halign': 'right' } },
                { content: null, styles: { 'halign': 'right' } },
                { content: 0, styles: { 'halign': 'right' } },
                { content: 1, styles: { 'halign': 'right' } },
                { content: -2, styles: { 'halign': 'right' } },
                { content: 'Infinity', styles: { 'halign': 'right' } },
                { content: '-Infinity', styles: { 'halign': 'right' } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    [
        { format: 'millisecond', expectedPdfCellValue: '009' },
        { format: 'second', expectedPdfCellValue: '09' },
        { format: 'minute', expectedPdfCellValue: '09' },
        { format: 'hour', expectedPdfCellValue: '09' },
        { format: 'day', expectedPdfCellValue: '9' },
        { format: 'month', expectedPdfCellValue: 'October' },
        { format: 'year', expectedPdfCellValue: '2019' },
        { format: 'quarter', expectedPdfCellValue: 'Q4' },
        { format: 'monthAndDay', expectedPdfCellValue: 'October 9' },
        { format: 'monthAndYear', expectedPdfCellValue: 'October 2019' },
        { format: 'quarterAndYear', expectedPdfCellValue: 'Q4 2019' },
        { format: 'shortDate', expectedPdfCellValue: '10/9/2019' },
        { format: 'shortTime', expectedPdfCellValue: '9:09 AM' },
        { format: 'longDateLongTime', expectedPdfCellValue: 'Wednesday, October 9, 2019, 9:09:09 AM' },
        { format: 'shotDateShortTime', expectedPdfCellValue: '99otDAMte09ortTi9e' },
        { format: 'longDate', expectedPdfCellValue: 'Wednesday, October 9, 2019' },
        { format: 'longTime', expectedPdfCellValue: '9:09:09 AM' },
        { format: 'dayOfWeek', expectedPdfCellValue: 'Wednesday' },
        { format: 'yyyy-MM-dd', expectedPdfCellValue: '2019-10-09' }
    ].forEach((config)=> {
        const dateValue = new Date(2019, 9, 9, 9, 9, 9, 9);

        QUnit.test(`Data - columns.dataType: date, columns.format: ${config.format}, cell.value: ${JSON.stringify(dateValue)}`, function(assert) {
            const done = assert.async();

            const ds = [{ f1: dateValue }];
            const dataGrid = $('#dataGrid').dxDataGrid({
                columns: [{ dataField: 'f1', dataType: 'datetime', format: config.format }],
                dataSource: ds,
                showColumnHeaders: false,
                loadingTimeout: undefined
            }).dxDataGrid('instance');

            const expectedCells = {
                body: [[{ content: config.expectedPdfCellValue, styles: { 'halign': 'left' } }]]
            };

            exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
                const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
                helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
                helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
                helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
                done();
            });
        });
    });

    QUnit.test('Data - columns.dataType: number, columns.format.type: \'percent\'', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1 }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'percent', precision: 3 } },
                { dataField: 'f2', dataType: 'number', format: { type: 'percent', precision: 0 } },
                { dataField: 'f3', dataType: 'number', format: { type: 'percent' } },
                { dataField: 'f4', dataType: 'number', format: { type: 'percent', precision: 1 } },
                { dataField: 'f5', dataType: 'number', format: { type: 'percent', precision: 6 } },
            ],
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { content: '100.000%', styles: { 'halign': 'right' } },
                { content: '100%', styles: { 'halign': 'right' } },
                { content: '100%', styles: { 'halign': 'right' } },
                { content: '100.0%', styles: { 'halign': 'right' } },
                { content: '100.000000%', styles: { 'halign': 'right' } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Data - columns.dataType: number, columns.format.type: \'fixedPoint\'', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1 }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'fixedPoint', precision: 3 } },
                { dataField: 'f2', dataType: 'number', format: { type: 'fixedPoint', precision: 0 } },
                { dataField: 'f3', dataType: 'number', format: { type: 'fixedPoint' } },
                { dataField: 'f4', dataType: 'number', format: { type: 'fixedPoint', precision: 1 } },
                { dataField: 'f5', dataType: 'number', format: { type: 'fixedPoint', precision: 6 } },
            ],
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { content: '1.000', styles: { 'halign': 'right' } },
                { content: '1', styles: { 'halign': 'right' } },
                { content: '1', styles: { 'halign': 'right' } },
                { content: '1.0', styles: { 'halign': 'right' } },
                { content: '1.000000', styles: { 'halign': 'right' } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Data - columns.dataType: number, columns.format.type: \'decimal\'', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1 }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'decimal', precision: 3 } },
                { dataField: 'f2', dataType: 'number', format: { type: 'decimal', precision: 0 } },
                { dataField: 'f3', dataType: 'number', format: { type: 'decimal' } },
                { dataField: 'f4', dataType: 'number', format: { type: 'decimal', precision: 1 } },
                { dataField: 'f5', dataType: 'number', format: { type: 'decimal', precision: 6 } },
            ],
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { content: '001', styles: { 'halign': 'right' } },
                { content: '1', styles: { 'halign': 'right' } },
                { content: '1', styles: { 'halign': 'right' } },
                { content: '1', styles: { 'halign': 'right' } },
                { content: '000001', styles: { 'halign': 'right' } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Data - columns.dataType: number, columns.format.type: \'exponential\'', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1 }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'exponential', precision: 3 } },
                { dataField: 'f2', dataType: 'number', format: { type: 'exponential', precision: 0 } },
                { dataField: 'f3', dataType: 'number', format: { type: 'exponential' } },
                { dataField: 'f4', dataType: 'number', format: { type: 'exponential', precision: 1 } },
                { dataField: 'f5', dataType: 'number', format: { type: 'exponential', precision: 6 } },
            ],
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { content: '1.000E+0', styles: { 'halign': 'right' } },
                { content: '1E+0', styles: { 'halign': 'right' } },
                { content: '1.0E+0', styles: { 'halign': 'right' } },
                { content: '1.0E+0', styles: { 'halign': 'right' } },
                { content: '1.000000E+0', styles: { 'halign': 'right' } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Data - columns.dataType: number, columns.format.type: \'largeNumber\'', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1 }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'largeNumber', precision: 3 } },
                { dataField: 'f2', dataType: 'number', format: { type: 'largeNumber', precision: 0 } },
                { dataField: 'f3', dataType: 'number', format: { type: 'largeNumber' } },
                { dataField: 'f4', dataType: 'number', format: { type: 'largeNumber', precision: 1 } },
                { dataField: 'f5', dataType: 'number', format: { type: 'largeNumber', precision: 6 } },
            ],
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { content: '1.000', styles: { 'halign': 'right' } },
                { content: '1', styles: { 'halign': 'right' } },
                { content: '1', styles: { 'halign': 'right' } },
                { content: '1.0', styles: { 'halign': 'right' } },
                { content: '1.000000', styles: { 'halign': 'right' } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Data - columns.dataType: number, columns.format.type: \'thousands\'', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1 }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'thousands', precision: 3 } },
                { dataField: 'f2', dataType: 'number', format: { type: 'thousands', precision: 0 } },
                { dataField: 'f3', dataType: 'number', format: { type: 'thousands' } },
                { dataField: 'f4', dataType: 'number', format: { type: 'thousands', precision: 1 } },
                { dataField: 'f5', dataType: 'number', format: { type: 'thousands', precision: 6 } },
            ],
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { content: '0.001K', styles: { 'halign': 'right' } },
                { content: '0K', styles: { 'halign': 'right' } },
                { content: '0K', styles: { 'halign': 'right' } },
                { content: '0.0K', styles: { 'halign': 'right' } },
                { content: '0.001000K', styles: { 'halign': 'right' } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Data - columns.dataType: number, columns.format.type: \'millions\'', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1 }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'millions', precision: 3 } },
                { dataField: 'f2', dataType: 'number', format: { type: 'millions', precision: 0 } },
                { dataField: 'f3', dataType: 'number', format: { type: 'millions' } },
                { dataField: 'f4', dataType: 'number', format: { type: 'millions', precision: 1 } },
                { dataField: 'f5', dataType: 'number', format: { type: 'millions', precision: 6 } },
            ],
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { content: '0.000M', styles: { 'halign': 'right' } },
                { content: '0M', styles: { 'halign': 'right' } },
                { content: '0M', styles: { 'halign': 'right' } },
                { content: '0.0M', styles: { 'halign': 'right' } },
                { content: '0.000001M', styles: { 'halign': 'right' } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Data - columns.dataType: number, columns.format.type: \'billions\'', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1 }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'billions', precision: 3 } },
                { dataField: 'f2', dataType: 'number', format: { type: 'billions', precision: 0 } },
                { dataField: 'f3', dataType: 'number', format: { type: 'billions' } },
                { dataField: 'f4', dataType: 'number', format: { type: 'billions', precision: 1 } },
                { dataField: 'f5', dataType: 'number', format: { type: 'billions', precision: 6 } },
            ],
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { content: '0.000B', styles: { 'halign': 'right' } },
                { content: '0B', styles: { 'halign': 'right' } },
                { content: '0B', styles: { 'halign': 'right' } },
                { content: '0.0B', styles: { 'halign': 'right' } },
                { content: '0.000000B', styles: { 'halign': 'right' } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Data - columns.dataType: number, columns.format.type: \'trillions\'', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1 }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'trillions', precision: 3 } },
                { dataField: 'f2', dataType: 'number', format: { type: 'trillions', precision: 0 } },
                { dataField: 'f3', dataType: 'number', format: { type: 'trillions' } },
                { dataField: 'f4', dataType: 'number', format: { type: 'trillions', precision: 1 } },
                { dataField: 'f5', dataType: 'number', format: { type: 'trillions', precision: 6 } },
            ],
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { content: '0.000T', styles: { 'halign': 'right' } },
                { content: '0T', styles: { 'halign': 'right' } },
                { content: '0T', styles: { 'halign': 'right' } },
                { content: '0.0T', styles: { 'halign': 'right' } },
                { content: '0.000000T', styles: { 'halign': 'right' } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Data - columns.dataType: number, columns.format.type: \'currency\' with presicion', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1, f6: 1 }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'currency', precision: 2 } },
                { dataField: 'f2', dataType: 'number', format: { type: 'currency', precision: 4 } },
                { dataField: 'f3', dataType: 'number', format: { type: 'currency', precision: 0 } },
                { dataField: 'f4', dataType: 'number', format: { type: 'currency' } },
                { dataField: 'f5', dataType: 'number', format: { type: 'currency', precision: 1 } },
                { dataField: 'f6', dataType: 'number', format: { type: 'currency', precision: 5 } },
            ],
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { content: '$1.00', styles: { 'halign': 'right' } },
                { content: '$1.0000', styles: { 'halign': 'right' } },
                { content: '$1', styles: { 'halign': 'right' } },
                { content: '$1', styles: { 'halign': 'right' } },
                { content: '$1.0', styles: { 'halign': 'right' } },
                { content: '$1.00000', styles: { 'halign': 'right' } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 1 level', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f1_2' },
            { f1: 'f1_2', f2: 'f1_2' }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', groupIndex: 0 },
                { dataField: 'f2', caption: 'f2', dataType: 'string' },
            ],
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[{ content: 'f2', styles: { 'halign': 'left' } }]],
            body: [
                [{ content: 'f1: f1_1', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'f1_2', styles: { 'halign': 'left' } }],
                [{ content: 'f1: f1_2', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'f1_2', styles: { 'halign': 'left' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    [true, false].forEach((remoteOperations) => {
        [new Date(1996, 6, 4), '1996/7/4', '1996-07-04T00:00:00', new Date(1996, 6, 4).getTime()].forEach((dateValue) => {
            QUnit.test(`Grouping - 1 level, column.dataType: date, format: 'yyyy-MM-dd', cell.value: ${JSON.stringify(dateValue.value)}, remoteOperations: ${remoteOperations}`, function(assert) {
                const done = assert.async();
                const ds = [{ f1: dateValue, f2: 'f1_1' }];
                const dataGrid = $('#dataGrid').dxDataGrid({
                    dataSource: ds,
                    columns: [
                        { caption: 'f1', dataField: 'f1', dataType: 'date', format: 'yyyy-MM-dd', groupIndex: 0 },
                        { caption: 'f2', dataField: 'f2', dataType: 'string' }
                    ],
                    remoteOperations: remoteOperations,
                    loadingTimeout: undefined
                }).dxDataGrid('instance');

                const expectedCells = {
                    head: [[{ content: 'f2', styles: { 'halign': 'left' } }]],
                    body: [
                        [{ content: 'f1: 1996-07-04', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                        [{ content: 'f1_1', styles: { 'halign': 'left' } }]
                    ]
                };

                exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
                    const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
                    ['head', 'body'].forEach((rowType) => {
                        helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                        helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                        helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                        helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
                    });
                    done();
                });
            });
        });
    });

    QUnit.test('Grouping - 1 level, col_1.customizeText: (cell) => \'custom\'', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1' },
            { f1: 'f1_2', f2: 'f2_2' }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', groupIndex: 0, customizeText: (cell) => 'custom' },
                { dataField: 'f2', caption: 'f2', dataType: 'string' },
            ],
            dataSource: ds,
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [{ content: 'f1: custom', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'f2_1', styles: { 'halign': 'left' } }],
                [{ content: 'f1: custom', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'f2_2', styles: { 'halign': 'left' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 1 level, col_1_group.calculateGroupValue: () => \'custom\'', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1' },
            { f1: 'f1_2', f2: 'f2_2' }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', groupIndex: 0, calculateGroupValue: () => 'custom' },
                { dataField: 'f2', caption: 'f2', dataType: 'string' },
            ],
            dataSource: ds,
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [{ content: 'f1: custom', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'f2_1', styles: { 'halign': 'left' } }],
                [{ content: 'f2_2', styles: { 'halign': 'left' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 1 level, col_1_group.calculateGroupValue: () => \'custom\', showWhenGrouped: true', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1' },
            { f1: 'f1_2', f2: 'f2_2' }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', width: 100, groupIndex: 0, calculateGroupValue: () => 'custom', showWhenGrouped: true },
                { dataField: 'f2', caption: 'f2', width: 150 },
            ],
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[ { content: 'f1', styles: { 'halign': 'left' } }, { content: 'f2', styles: { 'halign': 'left' } } ]],
            body: [
                [{ content: 'f1: custom', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'f1_1', styles: { 'halign': 'left' } }, { content: 'f2_1', styles: { 'halign': 'left' } }],
                [{ content: 'f1_2', styles: { 'halign': 'left' } }, { content: 'f2_2', styles: { 'halign': 'left' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Grouping - 1 level, col_1_group.calculateDisplayValue: () => \'custom\', col_2.calculateDisplayValue: () => \'custom_2\'', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1' },
            { f1: 'f1_2', f2: 'f2_2' }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', groupIndex: 0, calculateDisplayValue: () => 'custom' },
                { dataField: 'f2', caption: 'f2', dataType: 'string', calculateDisplayValue: () => 'custom_2' },
            ],
            dataSource: ds,
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [{ content: 'f1: custom', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'custom_2', styles: { 'halign': 'left' } }],
                [{ content: 'custom_2', styles: { 'halign': 'left' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 1 level, grid.wordWrapEnabled: true, col_1.alignment: \'center\', col_2.alignment: \'right\'', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1' },
            { f1: 'f1_2', f2: 'f2_2' }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', groupIndex: 0, alignment: 'center' },
                { dataField: 'f2', caption: 'f2', dataType: 'string', alignment: 'right' },
            ],
            wordWrapEnabled: true,
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[ { content: 'f2', styles: { 'halign': 'right' } } ]],
            body: [
                [{ content: 'f1: f1_1', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'f2_1', styles: { 'halign': 'right' } }],
                [{ content: 'f1: f1_2', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'f2_2', styles: { 'halign': 'right' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Grouping - 1 level, grid.wordWrapEnabled: true, rtlEnabled: true', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1' },
            { f1: 'f1_2', f2: 'f2_2' }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', groupIndex: 0 },
                { dataField: 'f2', caption: 'f2', dataType: 'string' },
            ],
            wordWrapEnabled: true,
            dataSource: ds,
            rtlEnabled: true,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[ { content: 'f2', styles: { 'halign': 'right' } } ]],
            body: [
                [{ content: 'f1: f1_1', styles: { 'halign': 'right', fontStyle: 'bold' } }],
                [{ content: 'f2_1', styles: { 'halign': 'right' } }],
                [{ content: 'f1: f1_2', styles: { 'halign': 'right', fontStyle: 'bold' } }],
                [{ content: 'f2_2', styles: { 'halign': 'right' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Grouping - 1 level, selectedRowKeys: [ds[0]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'str1', f2: 'str1_1' }, { f1: 'str1', f2: 'str_1_2' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', dataType: 'string', groupIndex: 0 },
                { dataField: 'f2', dataType: 'string' },
            ],
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false,
            selectedRowKeys: [ds[0]]
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [{ content: 'F1: str1', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'str1_1', styles: { 'halign': 'left' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, { selectedRowsOnly: true })).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 1 level, selectedRowKeys: [ds[1]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'str1', f2: 'str1_1' }, { f1: 'str1', f2: 'str_1_2' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', dataType: 'string', groupIndex: 0 },
                { dataField: 'f2', dataType: 'string' },
            ],
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false,
            selectedRowKeys: [ds[1]]
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [{ content: 'F1: str1', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'str_1_2', styles: { 'halign': 'left' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, { selectedRowsOnly: true })).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 1 level, selectedRowKeys: [ds[0], ds[1]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'str1', f2: 'str1_1' }, { f1: 'str1', f2: 'str_1_2' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', dataType: 'string', groupIndex: 0 },
                { dataField: 'f2', dataType: 'string' }
            ],
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false,
            selectedRowKeys: [ds[0], ds[1]]
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [{ content: 'F1: str1', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'str1_1', styles: { 'halign': 'left' } }],
                [{ content: 'str_1_2', styles: { 'halign': 'left' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, { selectedRowsOnly: true })).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 1 level, unbound', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'str1', f2: 'str1_1' }, { f1: 'str1', f2: 'str_1_2' }];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', dataType: 'string' },
                { dataField: 'f2', dataType: 'string', calculateCellValue: rowData => rowData.f1 + '_f2' },
                { caption: 'Field 3', calculateCellValue: rowData => rowData.f1 + '!', groupIndex: 0 }
            ],
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [{ content: 'Field 3: str1!', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'str1', styles: { 'halign': 'left' } }, { content: 'str1_f2', styles: { 'halign': 'left' } }],
                [{ content: 'str1', styles: { 'halign': 'left' } }, { content: 'str1_f2', styles: { 'halign': 'left' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 1 level, unbound, selectedRowKeys: [ds[1]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'str1', f2: 'str1_1' }, { f1: 'str1', f2: 'str_1_2' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', dataType: 'string' },
                { dataField: 'f2', dataType: 'string', calculateCellValue: rowData => rowData.f1 + '_f2' },
                { caption: 'Field 3', calculateCellValue: rowData => rowData.f1 + '!', groupIndex: 0 }
            ],
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false,
            selectedRowKeys: [ds[1]]
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [{ content: 'Field 3: str1!', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'str1', styles: { 'halign': 'left' } }, { content: 'str1_f2', styles: { 'halign': 'left' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, { selectedRowsOnly: true })).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 1 level, 2 group row, selectedRowKeys: [ds[1]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'str1_1', f2: 'str1_2', f3: 'str1_3' }, { f1: 'str2_1', f2: 'str2_2', f3: 'str2_3' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', dataType: 'string', groupIndex: 0 },
                { dataField: 'f2', dataType: 'string' },
            ],
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false,
            selectedRowKeys: [ds[1]]
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [{ content: 'F1: str2_1', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'str2_2', styles: { 'halign': 'left' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, { selectedRowsOnly: true })).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 1 level - 1 summary group node', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 1 },
            { f1: 'f1_2', f2: 3 }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', groupIndex: 0 },
                { dataField: 'f2', caption: 'f2', dataType: 'number' },
            ],
            dataSource: ds,
            summary: {
                groupItems: [{ name: 'GroupItems 1', column: 'f2', summaryType: 'max' }]
            },
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [{ content: 'f1: f1_1 (Max of f2 is 1)', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 1, styles: { 'halign': 'right' } }],
                [{ content: 'f1: f1_2 (Max of f2 is 3)', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 3, styles: { 'halign': 'right' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 1 level - 1 summary group node, group.customizeText: (cell) => \'custom\'', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 1 },
            { f1: 'f1_2', f2: 3 }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', groupIndex: 0 },
                { dataField: 'f2', caption: 'f2', dataType: 'number' },
            ],
            dataSource: ds,
            summary: {
                groupItems: [{ name: 'GroupItems 1', column: 'f2', summaryType: 'max', customizeText: (cell) => 'custom' }]
            },
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [{ content: 'f1: f1_1 (custom)', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 1, styles: { 'halign': 'right' } }],
                [{ content: 'f1: f1_2 (custom)', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 3, styles: { 'halign': 'right' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 1 level & 2 column', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f1_2', f3: 'f3_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', groupIndex: 0 },
                { dataField: 'f2', caption: 'f2', dataType: 'string' },
                { dataField: 'f3', caption: 'f3', dataType: 'string' },
            ],
            dataSource: ds,
            summary: {
                groupItems: [
                    { name: 'GroupItems 1', column: 'f2', summaryType: 'count' },
                    { name: 'GroupItems 2', column: 'f3', summaryType: 'count' }
                ]
            },
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [{ content: 'f1: f1_1 (Count: 1, Count: 1)', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'f1_2', styles: { 'halign': 'left' } }, { content: 'f3_1', styles: { 'halign': 'left' } }],
                [{ content: 'f1: f1_2 (Count: 1, Count: 1)', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'f2_2', styles: { 'halign': 'left' } }, { content: 'f3_2', styles: { 'halign': 'left' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 2 level', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f1_2', f3: 'f3_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', groupIndex: 0 },
                { dataField: 'f2', caption: 'f2', dataType: 'string', groupIndex: 1 },
                { dataField: 'f3', caption: 'f3', dataType: 'string' },
            ],
            dataSource: ds,
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [{ content: 'f1: f1_1', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'f2: f1_2', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'f3_1', styles: { 'halign': 'left' } }],
                [{ content: 'f1: f1_2', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'f2: f2_2', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'f3_2', styles: { 'halign': 'left' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 2 level - 2 summary group node', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f1_2', f3: 'f3_1' },
            { f1: 'f1_1', f2: 'f2_2', f3: 'f3_2' }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', groupIndex: 0 },
                { dataField: 'f2', caption: 'f2', dataType: 'string', groupIndex: 1 },
                { dataField: 'f3', caption: 'f3', dataType: 'string' },
            ],
            dataSource: ds,
            summary: {
                groupItems: [{ name: 'GroupItems 1', column: 'f3', summaryType: 'max' }, { name: 'GroupItems 2', column: 'f3', summaryType: 'count' }]
            },
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [{ content: 'f1: f1_1 (Max of f3 is f3_2, Count: 2)', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'f2: f1_2 (Max of f3 is f3_1, Count: 1)', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'f3_1', styles: { 'halign': 'left' } }],
                [{ content: 'f2: f2_2 (Max of f3 is f3_2, Count: 1)', styles: { 'halign': 'left', fontStyle: 'bold' } }],
                [{ content: 'f3_2', styles: { 'halign': 'left' } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 2 level & 2 column - 2 summary alignByColumn', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f1_2', f3: 'f3_1', f4: 'f4_1', f5: 'f5_1' },
            { f1: 'f1_1', f2: 'f2_2', f3: 'f3_2', f4: 'f4_2', f5: 'f5_2' }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', groupIndex: 0 },
                { dataField: 'f2', caption: 'f2', dataType: 'string', groupIndex: 1 },
                { dataField: 'f3', caption: 'f3', dataType: 'string' },
                { dataField: 'f4', caption: 'f4', dataType: 'string' },
                { dataField: 'f5', caption: 'f5', dataType: 'string' }
            ],
            dataSource: ds,
            summary: {
                groupItems: [
                    { name: 'GroupItems 1', column: 'f4', summaryType: 'max', alignByColumn: true }, { name: 'GroupItems 2', column: 'f4', summaryType: 'count', alignByColumn: true },
                    { name: 'GroupItems 3', column: 'f5', summaryType: 'max', alignByColumn: true }, { name: 'GroupItems 4', column: 'f5', summaryType: 'count', alignByColumn: true }
                ]
            },
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [
                    { content: 'f1: f1_1', styles: { 'halign': 'left', fontStyle: 'bold' } },
                    { content: 'Max: f4_2\nCount: 2', styles: { 'halign': 'left', fontStyle: 'bold' } },
                    { content: 'Max: f5_2\nCount: 2', styles: { 'halign': 'left', fontStyle: 'bold' } }
                ], [
                    { content: 'f2: f1_2', styles: { 'halign': 'left', fontStyle: 'bold' } },
                    { content: 'Max: f4_1\nCount: 1', styles: { 'halign': 'left', fontStyle: 'bold' } },
                    { content: 'Max: f5_1\nCount: 1', styles: { 'halign': 'left', fontStyle: 'bold' } }
                ], [
                    { content: 'f3_1', styles: { 'halign': 'left' } },
                    { content: 'f4_1', styles: { 'halign': 'left' } },
                    { content: 'f5_1', styles: { 'halign': 'left' } }
                ], [
                    { content: 'f2: f2_2', styles: { 'halign': 'left', fontStyle: 'bold' } },
                    { content: 'Max: f4_2\nCount: 1', styles: { 'halign': 'left', fontStyle: 'bold' } },
                    { content: 'Max: f5_2\nCount: 1', styles: { 'halign': 'left', fontStyle: 'bold' } }
                ], [
                    { content: 'f3_2', styles: { 'halign': 'left' } },
                    { content: 'f4_2', styles: { 'halign': 'left' } },
                    { content: 'f5_2', styles: { 'halign': 'left' } }
                ]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 2 level & 2 column - 2 summary alignByColumn: false', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f1_2', f3: 'f3_1', f4: 'f4_1', f5: 'f5_1' },
            { f1: 'f1_1', f2: 'f2_2', f3: 'f3_2', f4: 'f4_2', f5: 'f5_2' }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', groupIndex: 0 },
                { dataField: 'f2', caption: 'f2', dataType: 'string', groupIndex: 1 },
                { dataField: 'f3', caption: 'f3', dataType: 'string' },
                { dataField: 'f4', caption: 'f4', dataType: 'string' },
                { dataField: 'f5', caption: 'f5', dataType: 'string' }
            ],
            dataSource: ds,
            summary: {
                groupItems: [
                    { name: 'GroupItems 1', column: 'f4', summaryType: 'max', alignByColumn: false }, { name: 'GroupItems 2', column: 'f4', summaryType: 'count', alignByColumn: false },
                    { name: 'GroupItems 3', column: 'f5', summaryType: 'max', alignByColumn: false }, { name: 'GroupItems 4', column: 'f5', summaryType: 'count', alignByColumn: false }
                ]
            },
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [
                    { content: 'f1: f1_1 (Max of f4 is f4_2, Count: 2, Max of f5 is f5_2, Count: 2)', colSpan: 3, styles: { 'halign': 'left', fontStyle: 'bold' } }
                ], [
                    { content: 'f2: f1_2 (Max of f4 is f4_1, Count: 1, Max of f5 is f5_1, Count: 1)', colSpan: 3, styles: { 'halign': 'left', fontStyle: 'bold' } }
                ], [
                    { content: 'f3_1', styles: { 'halign': 'left' } },
                    { content: 'f4_1', styles: { 'halign': 'left' } },
                    { content: 'f5_1', styles: { 'halign': 'left' } }
                ], [
                    { content: 'f2: f2_2 (Max of f4 is f4_2, Count: 1, Max of f5 is f5_2, Count: 1)', colSpan: 3, styles: { 'halign': 'left', fontStyle: 'bold' } }
                ], [
                    { content: 'f3_2', styles: { 'halign': 'left' } },
                    { content: 'f4_2', styles: { 'halign': 'left' } },
                    { content: 'f5_2', styles: { 'halign': 'left' } }
                ]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 3 columns', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2', f4: 'f4_1' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 500,
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', width: 100 },
                { dataField: 'f2', caption: 'f2', dataType: 'string', width: 150 },
                { dataField: 'f3', caption: 'f3', dataType: 'string', width: 250 },
                { dataField: 'f4', caption: 'f4', dataType: 'string', groupIndex: 0 },
            ],
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [
                    { content: 'f4: f4_1', colSpan: 3, styles: { 'halign': 'left', fontStyle: 'bold' } }
                ], [
                    { content: 'f1_1', styles: { 'halign': 'left' } },
                    { content: 'f2_1', styles: { 'halign': 'left' } },
                    { content: 'f3_1', styles: { 'halign': 'left' } }
                ], [
                    { content: 'f1_2', styles: { 'halign': 'left' } },
                    { content: 'f2_2', styles: { 'halign': 'left' } },
                    { content: 'f3_2', styles: { 'halign': 'left' } }
                ]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 3 columns & group.allowExporting: false', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2', f4: 'f4_1' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 500,
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', width: 100 },
                { dataField: 'f2', caption: 'f2', dataType: 'string', width: 150 },
                { dataField: 'f3', caption: 'f3', dataType: 'string', width: 250 },
                { dataField: 'f4', caption: 'f4', dataType: 'string', width: 500, groupIndex: 0, allowExporting: false },
            ],
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [
                    { content: 'f4: f4_1', colSpan: 3, styles: { 'halign': 'left', fontStyle: 'bold' } }
                ], [
                    { content: 'f1_1', styles: { 'halign': 'left' } },
                    { content: 'f2_1', styles: { 'halign': 'left' } },
                    { content: 'f3_1', styles: { 'halign': 'left' } }
                ], [
                    { content: 'f1_2', styles: { 'halign': 'left' } },
                    { content: 'f2_2', styles: { 'halign': 'left' } },
                    { content: 'f3_2', styles: { 'halign': 'left' } }
                ]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 3 columns & col_1.allowExporting: false', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2', f4: 'f4_1' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 500,
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', width: 500, allowExporting: false },
                { dataField: 'f2', caption: 'f2', dataType: 'string', width: 200 },
                { dataField: 'f3', caption: 'f3', dataType: 'string', width: 300 },
                { dataField: 'f4', caption: 'f4', dataType: 'string', width: 250, groupIndex: 0 },
            ],
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [
                    { content: 'f4: f4_1', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }
                ], [
                    { content: 'f2_1', styles: { 'halign': 'left' } },
                    { content: 'f3_1', styles: { 'halign': 'left' } }
                ], [
                    { content: 'f2_2', styles: { 'halign': 'left' } },
                    { content: 'f3_2', styles: { 'halign': 'left' } }
                ]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 3 columns & col_2.allowExporting: false', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2', f4: 'f4_1' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 500,
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', width: 200 },
                { dataField: 'f2', caption: 'f2', dataType: 'string', width: 500, allowExporting: false },
                { dataField: 'f3', caption: 'f3', dataType: 'string', width: 300 },
                { dataField: 'f4', caption: 'f4', dataType: 'string', width: 500, groupIndex: 0 },
            ],
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [
                    { content: 'f4: f4_1', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }
                ], [
                    { content: 'f1_1', styles: { 'halign': 'left' } },
                    { content: 'f3_1', styles: { 'halign': 'left' } }
                ], [
                    { content: 'f1_2', styles: { 'halign': 'left' } },
                    { content: 'f3_2', styles: { 'halign': 'left' } }
                ]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 3 columns & col_3.allowExporting: false', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2', f4: 'f4_1' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 500,
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', width: 200 },
                { dataField: 'f2', caption: 'f2', dataType: 'string', width: 300 },
                { dataField: 'f3', caption: 'f3', dataType: 'string', width: 500, allowExporting: false },
                { dataField: 'f4', caption: 'f4', dataType: 'string', width: 500, groupIndex: 0 },
            ],
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [
                    { content: 'f4: f4_1', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }
                ], [
                    { content: 'f1_1', styles: { 'halign': 'left' } },
                    { content: 'f2_1', styles: { 'halign': 'left' } }
                ], [
                    { content: 'f1_2', styles: { 'halign': 'left' } },
                    { content: 'f2_2', styles: { 'halign': 'left' } }
                ]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 3 columns & col_3.fixed: true', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2', f4: 'f4_1' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 500,
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', width: 200 },
                { dataField: 'f2', caption: 'f2', dataType: 'string', width: 300 },
                { dataField: 'f3', caption: 'f3', dataType: 'string', width: 300, fixed: true },
                { dataField: 'f4', caption: 'f4', dataType: 'string', width: 300, groupIndex: 0 },
            ],
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [
                [
                    { content: 'f4: f4_1', colSpan: 3, styles: { 'halign': 'left', fontStyle: 'bold' } }
                ], [
                    { content: 'f3_1', styles: { 'halign': 'left' } },
                    { content: 'f1_1', styles: { 'halign': 'left' } },
                    { content: 'f2_1', styles: { 'halign': 'left' } }
                ], [
                    { content: 'f3_2', styles: { 'halign': 'left' } },
                    { content: 'f1_2', styles: { 'halign': 'left' } },
                    { content: 'f2_2', styles: { 'halign': 'left' } }
                ]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });
});
